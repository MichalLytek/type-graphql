import {
  Resolver,
  Query,
  Mutation,
  Arg,
  PubSub,
  Publisher,
  Subscription,
  Root,
  ID,
  ResolverFilterData,
  Args,
} from "../../src";

import { Recipe } from "./recipe.type";
import { CommentInput } from "./comment.input";
import { Comment } from "./comment.type";
import { NewCommentPayload } from "./newComment.interface";
import { Topic } from "./topics";
import { sampleRecipes } from "./recipe.samples";
import { NewCommentsArgs } from "./recipe.resolver.args";

@Resolver()
export class RecipeResolver {
  private readonly recipes: Recipe[] = sampleRecipes.slice();

  @Query(returns => Recipe, { nullable: true })
  async recipe(@Arg("id", type => ID) id: string) {
    return this.recipes.find(recipe => recipe.id === id);
  }

  @Mutation(returns => Boolean)
  async addNewComment(
    @Arg("comment") input: CommentInput,
    @PubSub(Topic.NewComment) notifyAboutNewComment: Publisher<NewCommentPayload>,
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

  @Subscription(returns => Comment, {
    topics: Topic.NewComment,
    filter: ({ payload, args }: ResolverFilterData<NewCommentPayload, NewCommentsArgs>) => {
      return payload.recipeId === args.recipeId;
    },
  })
  newComments(
    @Root() newComment: NewCommentPayload,
    @Args() { recipeId }: NewCommentsArgs,
  ): Comment {
    return {
      content: newComment.content,
      date: new Date(newComment.dateString), // limitation of Redis payload serialization
      nickname: newComment.nickname,
    };
  }
}
