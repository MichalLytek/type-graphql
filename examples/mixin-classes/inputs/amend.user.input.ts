import { InputType } from "type-graphql";
import { withId } from "../mixins";
import { UserDetails } from "../types";

// 'AmendUser' is like the full 'User' class without the password
@InputType()
export class AmendUserInput extends withId(UserDetails) {}
