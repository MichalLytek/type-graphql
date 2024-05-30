import { createParameterDecorator } from "type-graphql";
import { type Context } from "../context.type";

export function CurrentUser() {
  return createParameterDecorator<Context>(({ context }) => context.currentUser);
}
