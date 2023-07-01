import { createParamDecorator } from "type-graphql";
import type { Context } from "../context";

export function CurrentUser() {
  return createParamDecorator<Context>(({ context }) => context.currentUser);
}
