import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateUserArgs } from "./args/AggregateUserArgs";
import { CreateUserArgs } from "./args/CreateUserArgs";
import { DeleteManyUserArgs } from "./args/DeleteManyUserArgs";
import { DeleteUserArgs } from "./args/DeleteUserArgs";
import { FindManyUserArgs } from "./args/FindManyUserArgs";
import { FindOneUserArgs } from "./args/FindOneUserArgs";
import { UpdateManyUserArgs } from "./args/UpdateManyUserArgs";
import { UpdateUserArgs } from "./args/UpdateUserArgs";
import { UpsertUserArgs } from "./args/UpsertUserArgs";
import { User } from "../../../models/User";
import { AggregateUser } from "../../outputs/AggregateUser";
import { BatchPayload } from "../../outputs/BatchPayload";

@TypeGraphQL.Resolver(_of => User)
export class UserCrudResolver {
  @TypeGraphQL.Query(_returns => User, {
    nullable: true,
    description: undefined
  })
  async user(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindOneUserArgs): Promise<User | null> {
    return ctx.prisma.user.findOne(args);
  }

  @TypeGraphQL.Query(_returns => [User], {
    nullable: false,
    description: undefined
  })
  async users(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindManyUserArgs): Promise<User[]> {
    return ctx.prisma.user.findMany(args);
  }

  @TypeGraphQL.Mutation(_returns => User, {
    nullable: false,
    description: undefined
  })
  async createUser(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: CreateUserArgs): Promise<User> {
    return ctx.prisma.user.create(args);
  }

  @TypeGraphQL.Mutation(_returns => User, {
    nullable: true,
    description: undefined
  })
  async deleteUser(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeleteUserArgs): Promise<User | null> {
    return ctx.prisma.user.delete(args);
  }

  @TypeGraphQL.Mutation(_returns => User, {
    nullable: true,
    description: undefined
  })
  async updateUser(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpdateUserArgs): Promise<User | null> {
    return ctx.prisma.user.update(args);
  }

  @TypeGraphQL.Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async deleteManyUser(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeleteManyUserArgs): Promise<BatchPayload> {
    return ctx.prisma.user.deleteMany(args);
  }

  @TypeGraphQL.Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async updateManyUser(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpdateManyUserArgs): Promise<BatchPayload> {
    return ctx.prisma.user.updateMany(args);
  }

  @TypeGraphQL.Mutation(_returns => User, {
    nullable: false,
    description: undefined
  })
  async upsertUser(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpsertUserArgs): Promise<User> {
    return ctx.prisma.user.upsert(args);
  }

  @TypeGraphQL.Query(_returns => AggregateUser, {
    nullable: false,
    description: undefined
  })
  async aggregateUser(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateUserArgs): Promise<AggregateUser> {
    function transformFields(fields: Record<string, any>): Record<string, any> {
      return Object.fromEntries(
        Object.entries(fields)
          .filter(([key, value]) => !key.startsWith("_"))
          .map<[string, any]>(([key, value]) => {
            if (Object.keys(value).length === 0) {
              return [key, true];
            }
            return [key, transformFields(value)];
          }),
      );
    }

    return ctx.prisma.user.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
