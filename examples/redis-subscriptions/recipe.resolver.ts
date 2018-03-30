import {
  Resolver,
  Query,
  Mutation,
  Arg,
  PubSub,
  Publisher,
  Subscription,
  Root,
  PubSubEngine,
  ID,
} from "../../src";

import { Recipe } from "./recipe.type";
import { CommentInput } from "./comment.input";
import { Comment } from "./comment.type";
import { NewCommentPayload } from "./newComment.interface";
import { Topic } from "./topics";
import { sampleRecipes } from "./recipe.samples";

@Resolver()
export class RecipeResolver {
  private readonly recipes: Recipe[] = sampleRecipes.slice();

  @Query(returns => Recipe, { nullable: true })
  async recipe(@Arg("id", type => ID) id: string) {
    return this.recipes.find(recipe => recipe.id === id);
  }

  @Mutation()
  addNewComment(
    @Arg("comment") input: CommentInput,
    @PubSub(Topic.NewComment) notifyAboutNewComment: Publisher<NewCommentPayload>,
  ): boolean {
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
    return notifyAboutNewComment({
      content: comment.content,
      nickname: comment.nickname,
      dateString: comment.date.toISOString(),
      recipeId: input.recipeId,
    });
  }

  @Subscription(returns => Comment, {
    topics: Topic.NewComment,
    filter: ({ root, args }) => root.recipeId === args.recipeId,
  })
  newComments(
    @Root() newComment: NewCommentPayload,
    @Arg("recipeId", type => ID) recipeId: string,
  ): Comment {
    return {
      content: newComment.content,
      date: new Date(newComment.dateString), // limitation of Redis payload serialization
      nickname: newComment.nickname,
    };
  }
}
