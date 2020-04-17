import * as TypeGraphQL from "type-graphql";
import { CreateOneMovieArgs } from "./args/CreateOneMovieArgs";
import { DeleteManyMovieArgs } from "./args/DeleteManyMovieArgs";
import { DeleteOneMovieArgs } from "./args/DeleteOneMovieArgs";
import { FindManyMovieArgs } from "./args/FindManyMovieArgs";
import { FindOneMovieArgs } from "./args/FindOneMovieArgs";
import { UpdateManyMovieArgs } from "./args/UpdateManyMovieArgs";
import { UpdateOneMovieArgs } from "./args/UpdateOneMovieArgs";
import { UpsertOneMovieArgs } from "./args/UpsertOneMovieArgs";
import { Movie } from "../../../models/Movie";
import { AggregateMovie } from "../../outputs/AggregateMovie";
import { BatchPayload } from "../../outputs/BatchPayload";

@TypeGraphQL.Resolver(_of => Movie)
export class MovieCrudResolver {
  @TypeGraphQL.Query(_returns => Movie, {
    nullable: true,
    description: undefined
  })
  async movie(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindOneMovieArgs): Promise<Movie | null> {
    return ctx.prisma.movie.findOne(args);
  }

  @TypeGraphQL.Query(_returns => [Movie], {
    nullable: false,
    description: undefined
  })
  async movies(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindManyMovieArgs): Promise<Movie[]> {
    return ctx.prisma.movie.findMany(args);
  }

  @TypeGraphQL.Mutation(_returns => Movie, {
    nullable: false,
    description: undefined
  })
  async createOneMovie(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: CreateOneMovieArgs): Promise<Movie> {
    return ctx.prisma.movie.create(args);
  }

  @TypeGraphQL.Mutation(_returns => Movie, {
    nullable: true,
    description: undefined
  })
  async deleteOneMovie(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeleteOneMovieArgs): Promise<Movie | null> {
    return ctx.prisma.movie.delete(args);
  }

  @TypeGraphQL.Mutation(_returns => Movie, {
    nullable: true,
    description: undefined
  })
  async updateOneMovie(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpdateOneMovieArgs): Promise<Movie | null> {
    return ctx.prisma.movie.update(args);
  }

  @TypeGraphQL.Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async deleteManyMovie(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeleteManyMovieArgs): Promise<BatchPayload> {
    return ctx.prisma.movie.deleteMany(args);
  }

  @TypeGraphQL.Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async updateManyMovie(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpdateManyMovieArgs): Promise<BatchPayload> {
    return ctx.prisma.movie.updateMany(args);
  }

  @TypeGraphQL.Mutation(_returns => Movie, {
    nullable: false,
    description: undefined
  })
  async upsertOneMovie(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpsertOneMovieArgs): Promise<Movie> {
    return ctx.prisma.movie.upsert(args);
  }

  @TypeGraphQL.Query(_returns => AggregateMovie, {
    nullable: false,
    description: undefined
  })
  async aggregateMovie(): Promise<AggregateMovie> {
    return new AggregateMovie();
  }
}
