import * as TypeGraphQL from "type-graphql";
import { CreateOneUserArgs } from "./args/CreateOneUserArgs";
import { DeleteManyUserArgs } from "./args/DeleteManyUserArgs";
import { DeleteOneUserArgs } from "./args/DeleteOneUserArgs";
import { FindManyUserArgs } from "./args/FindManyUserArgs";
import { FindOneUserArgs } from "./args/FindOneUserArgs";
import { UpdateManyUserArgs } from "./args/UpdateManyUserArgs";
import { UpdateOneUserArgs } from "./args/UpdateOneUserArgs";
import { UpsertOneUserArgs } from "./args/UpsertOneUserArgs";
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
  async createOneUser(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: CreateOneUserArgs): Promise<User> {
    return ctx.prisma.user.create(args);
  }

  @TypeGraphQL.Mutation(_returns => User, {
    nullable: true,
    description: undefined
  })
  async deleteOneUser(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeleteOneUserArgs): Promise<User | null> {
    return ctx.prisma.user.delete(args);
  }

  @TypeGraphQL.Mutation(_returns => User, {
    nullable: true,
    description: undefined
  })
  async updateOneUser(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpdateOneUserArgs): Promise<User | null> {
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
  async upsertOneUser(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpsertOneUserArgs): Promise<User> {
    return ctx.prisma.user.upsert(args);
  }

  @TypeGraphQL.Query(_returns => AggregateUser, {
    nullable: false,
    description: undefined
  })
  async aggregateUser(): Promise<AggregateUser> {
    return new AggregateUser();
  }
}
