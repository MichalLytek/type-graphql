import { InputType } from "type-graphql";

import withId from "../mixins/with-id";
import UserDetails from "../types/user-details";

// `AmendUser` is like the full `User` class without the password
@InputType()
export default class AmendUserInput extends withId(UserDetails) {}
