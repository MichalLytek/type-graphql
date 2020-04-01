import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { CreateOneMovieArgs } from "./args/CreateOneMovieArgs";
import { DeleteManyMovieArgs } from "./args/DeleteManyMovieArgs";
import { DeleteOneMovieArgs } from "./args/DeleteOneMovieArgs";
import { FindManyMovieArgs } from "./args/FindManyMovieArgs";
import { FindOneMovieArgs } from "./args/FindOneMovieArgs";
import { UpdateManyMovieArgs } from "./args/UpdateManyMovieArgs";
import { UpdateOneMovieArgs } from "./args/UpdateOneMovieArgs";
import { UpsertOneMovieArgs } from "./args/UpsertOneMovieArgs";
import { Movie } from "../../../models/Movie";
import { BatchPayload } from "../../outputs/BatchPayload";

@Resolver(_of => Movie)
export class MovieCrudResolver {
  @Query(_returns => Movie, {
    nullable: true,
    description: undefined
  })
  async movie(@Ctx() ctx: any, @Args() args: FindOneMovieArgs): Promise<Movie | null> {
    return ctx.prisma.movie.findOne(args);
  }

  @Query(_returns => [Movie], {
    nullable: false,
    description: undefined
  })
  async movies(@Ctx() ctx: any, @Args() args: FindManyMovieArgs): Promise<Movie[]> {
    return ctx.prisma.movie.findMany(args);
  }

  @Mutation(_returns => Movie, {
    nullable: false,
    description: undefined
  })
  async createOneMovie(@Ctx() ctx: any, @Args() args: CreateOneMovieArgs): Promise<Movie> {
    return ctx.prisma.movie.create(args);
  }

  @Mutation(_returns => Movie, {
    nullable: true,
    description: undefined
  })
  async deleteOneMovie(@Ctx() ctx: any, @Args() args: DeleteOneMovieArgs): Promise<Movie | null> {
    return ctx.prisma.movie.delete(args);
  }

  @Mutation(_returns => Movie, {
    nullable: true,
    description: undefined
  })
  async updateOneMovie(@Ctx() ctx: any, @Args() args: UpdateOneMovieArgs): Promise<Movie | null> {
    return ctx.prisma.movie.update(args);
  }

  @Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async deleteManyMovie(@Ctx() ctx: any, @Args() args: DeleteManyMovieArgs): Promise<BatchPayload> {
    return ctx.prisma.movie.deleteMany(args);
  }

  @Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async updateManyMovie(@Ctx() ctx: any, @Args() args: UpdateManyMovieArgs): Promise<BatchPayload> {
    return ctx.prisma.movie.updateMany(args);
  }

  @Mutation(_returns => Movie, {
    nullable: false,
    description: undefined
  })
  async upsertOneMovie(@Ctx() ctx: any, @Args() args: UpsertOneMovieArgs): Promise<Movie> {
    return ctx.prisma.movie.upsert(args);
  }
}
