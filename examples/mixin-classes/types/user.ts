import { ObjectType } from "type-graphql";
import { UserDetails } from "./user.details";
import { withId } from "../mixins/with.id";

// 'User' is a full object with 'id' and hidden 'password'
@ObjectType()
export class User extends withId(UserDetails) {
  // No TypeGraphQL decorator, hidden in schema
  password!: string;
}
