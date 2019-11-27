import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { CreateOneUserArgs } from "./args/CreateOneUserArgs";
import { DeleteOneUserArgs } from "./args/DeleteOneUserArgs";
import { FindManyUserArgs } from "./args/FindManyUserArgs";
import { FindOneUserArgs } from "./args/FindOneUserArgs";
import { UpdateManyUserArgs } from "./args/UpdateManyUserArgs";
import { UpdateOneUserArgs } from "./args/UpdateOneUserArgs";
import { UpsertOneUserArgs } from "./args/UpsertOneUserArgs";
import { User } from "../../../models/User";
import { AggregateUser } from "../../outputs/AggregateUser";
import { BatchPayload } from "../../outputs/BatchPayload";

@Resolver(_of => User)
export class UserCrudResolver {
  @Query(_returns => User, {
    nullable: true,
    description: undefined
  })
  async findOneUser(@Ctx() ctx: any, @Args() args: FindOneUserArgs): Promise<User | null> {
    return ctx.photon.users.findOne(args);
  }

  @Query(_returns => [User], {
    nullable: false,
    description: undefined
  })
  async findManyUser(@Ctx() ctx: any, @Args() args: FindManyUserArgs): Promise<User[]> {
    return ctx.photon.users.findMany(args);
  }

  @Mutation(_returns => User, {
    nullable: false,
    description: undefined
  })
  async createOneUser(@Ctx() ctx: any, @Args() args: CreateOneUserArgs): Promise<User> {
    return ctx.photon.users.create(args);
  }

  @Mutation(_returns => User, {
    nullable: true,
    description: undefined
  })
  async deleteOneUser(@Ctx() ctx: any, @Args() args: DeleteOneUserArgs): Promise<User | null> {
    return ctx.photon.users.delete(args);
  }

  @Mutation(_returns => User, {
    nullable: true,
    description: undefined
  })
  async updateOneUser(@Ctx() ctx: any, @Args() args: UpdateOneUserArgs): Promise<User | null> {
    return ctx.photon.users.update(args);
  }

  @Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async updateManyUser(@Ctx() ctx: any, @Args() args: UpdateManyUserArgs): Promise<BatchPayload> {
    return ctx.photon.users.updateMany(args);
  }

  @Mutation(_returns => User, {
    nullable: false,
    description: undefined
  })
  async upsertOneUser(@Ctx() ctx: any, @Args() args: UpsertOneUserArgs): Promise<User> {
    return ctx.photon.users.upsert(args);
  }

  @Query(_returns => AggregateUser, {
    nullable: false,
    description: undefined
  })
  async aggregateUser(@Ctx() ctx: any): Promise<AggregateUser> {
    return ctx.photon.users.aggregate();
  }
}
