import { ObjectType } from "type-graphql";

import withId from "../mixins/with-id";
import UserDetails from "./user-details";

// `User` is a full object with id and hidden password
@ObjectType()
export default class User extends withId(UserDetails) {
  // no TypeGraphQL decorator - hidden in schema
  password!: string;
}
