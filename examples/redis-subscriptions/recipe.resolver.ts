import type { ResolverFilterData } from "type-graphql";
import {
  Arg,
  Args,
  ID,
  Mutation,
  PubSub,
  Publisher,
  Query,
  Resolver,
  Root,
  Subscription,
} from "type-graphql";
import { CommentInput } from "./comment.input";
import { Comment, NewCommentPayload } from "./comment.type";
import { sampleRecipes } from "./recipe.data";
import { NewCommentsArgs } from "./recipe.resolver.args";
import { Recipe } from "./recipe.type";
import { Topic } from "./topics";

@Resolver()
export class RecipeResolver {
  private readonly recipes: Recipe[] = sampleRecipes.slice();

  @Query(_returns => Recipe, { nullable: true })
  async recipe(@Arg("id", _type => ID) id: string) {
    return this.recipes.find(recipe => recipe.id === id);
  }

  @Mutation(_returns => Boolean)
  async addNewComment(
    @Arg("comment") input: CommentInput,
    @PubSub(Topic.NEW_COMMENT) notifyAboutNewComment: Publisher<NewCommentPayload>,
  ): Promise<boolean> {
    const recipe = this.recipes.find(r => r.id === input.recipeId);
    if (!recipe) {
      return false;
    }

    const comment: Comment = {
      content: input.content,
      nickname: input.nickname,
      date: new Date(),
    };
    recipe.comments.push(comment);

    await notifyAboutNewComment({
      content: comment.content,
      nickname: comment.nickname,
      dateString: comment.date.toISOString(),
      recipeId: input.recipeId,
    });

    return true;
  }

  @Subscription(_returns => Comment, {
    topics: Topic.NEW_COMMENT,
    filter: ({ payload, args }: ResolverFilterData<NewCommentPayload, NewCommentsArgs>) =>
      payload.recipeId === args.recipeId,
  })
  newComments(@Root() newComment: NewCommentPayload, @Args() _args: NewCommentsArgs): Comment {
    return {
      content: newComment.content,
      date: new Date(newComment.dateString), // Limitation of Redis payload serialization
      nickname: newComment.nickname,
    } satisfies Comment;
  }
}
