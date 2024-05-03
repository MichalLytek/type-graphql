import { InputType } from "type-graphql";
import { withPassword } from "../mixins";
import { UserDetails } from "../types";

// 'CreateUser' is like the full 'User' class without the id
@InputType()
export class CreateUserInput extends withPassword(UserDetails) {}
