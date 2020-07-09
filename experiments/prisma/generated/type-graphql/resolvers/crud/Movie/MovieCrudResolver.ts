import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateMovieArgs } from "./args/AggregateMovieArgs";
import { CreateMovieArgs } from "./args/CreateMovieArgs";
import { DeleteManyMovieArgs } from "./args/DeleteManyMovieArgs";
import { DeleteMovieArgs } from "./args/DeleteMovieArgs";
import { FindManyMovieArgs } from "./args/FindManyMovieArgs";
import { FindOneMovieArgs } from "./args/FindOneMovieArgs";
import { UpdateManyMovieArgs } from "./args/UpdateManyMovieArgs";
import { UpdateMovieArgs } from "./args/UpdateMovieArgs";
import { UpsertMovieArgs } from "./args/UpsertMovieArgs";
import { Movie } from "../../../models/Movie";
import { AggregateMovie } from "../../outputs/AggregateMovie";
import { BatchPayload } from "../../outputs/BatchPayload";

@TypeGraphQL.Resolver(_of => Movie)
export class MovieCrudResolver {
  @TypeGraphQL.Query(_returns => Movie, {
    nullable: true,
    description: undefined
  })
  async movie(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindOneMovieArgs): Promise<Movie | undefined> {
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
  async createMovie(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: CreateMovieArgs): Promise<Movie> {
    return ctx.prisma.movie.create(args);
  }

  @TypeGraphQL.Mutation(_returns => Movie, {
    nullable: true,
    description: undefined
  })
  async deleteMovie(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeleteMovieArgs): Promise<Movie | undefined> {
    return ctx.prisma.movie.delete(args);
  }

  @TypeGraphQL.Mutation(_returns => Movie, {
    nullable: true,
    description: undefined
  })
  async updateMovie(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpdateMovieArgs): Promise<Movie | undefined> {
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
  async upsertMovie(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpsertMovieArgs): Promise<Movie> {
    return ctx.prisma.movie.upsert(args);
  }

  @TypeGraphQL.Query(_returns => AggregateMovie, {
    nullable: false,
    description: undefined
  })
  async aggregateMovie(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateMovieArgs): Promise<AggregateMovie> {
    function transformFields(fields: Record<string, any>): Record<string, any> {
      return Object.fromEntries(
        Object.entries(fields).map<[string, any]>(([key, value]) => {
          if (Object.keys(value).length === 0) {
            return [key, true];
          }
          return [key, transformFields(value)];
        })
      );
    }

    return ctx.prisma.movie.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
