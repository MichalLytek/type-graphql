import {
  Arg,
  Args,
  ID,
  Mutation,
  Query,
  Resolver,
  Root,
  Subscription,
  type SubscriptionHandlerData,
} from "type-graphql";
import { CommentInput } from "./comment.input";
import { Comment, NewCommentPayload } from "./comment.type";
import { Topic, pubSub } from "./pubsub";
import { sampleRecipes } from "./recipe.data";
import { NewCommentsArgs } from "./recipe.resolver.args";
import { Recipe } from "./recipe.type";

@Resolver()
export class RecipeResolver {
  private readonly recipes: Recipe[] = sampleRecipes.slice();

  @Query(_returns => Recipe, { nullable: true })
  async recipe(@Arg("id", _type => ID) id: string) {
    return this.recipes.find(recipe => recipe.id === id);
  }

  @Mutation(_returns => Boolean)
  async addNewComment(@Arg("comment") input: CommentInput): Promise<boolean> {
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

    pubSub.publish(Topic.NEW_COMMENT, {
      content: comment.content,
      nickname: comment.nickname,
      dateString: comment.date.toISOString(),
      recipeId: input.recipeId,
    });

    return true;
  }

  @Subscription(_returns => Comment, {
    topics: Topic.NEW_COMMENT,
    filter: ({ payload, args }: SubscriptionHandlerData<NewCommentPayload, NewCommentsArgs>) =>
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
