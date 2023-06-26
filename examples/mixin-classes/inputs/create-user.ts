import { InputType } from "type-graphql";
import withPassword from "../mixins/with-password";
import UserDetails from "../types/user-details";

// `CreateUser` is like the full `User` class without the id
@InputType()
export default class CreateUserInput extends withPassword(UserDetails) {}
