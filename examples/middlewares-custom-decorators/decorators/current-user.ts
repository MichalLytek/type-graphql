import { createParamDecorator } from "type-graphql";
import { Context } from "../context";

export default function CurrentUser() {
  return createParamDecorator<Context>(({ context }) => context.currentUser);
}
