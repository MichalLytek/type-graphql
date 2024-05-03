import { type CacheHint } from "@apollo/cache-control-types";
import { Directive } from "type-graphql";
import { type RequireAtLeastOne } from "./helpers/RequireAtLeastOne";

export function CacheControl({ maxAge, scope }: RequireAtLeastOne<CacheHint>) {
  if (maxAge === undefined && scope === undefined) {
    throw new Error("Missing maxAge or scope param for @CacheControl");
  }

  let sdl = "@cacheControl(";
  if (maxAge !== undefined) {
    sdl += `maxAge: ${maxAge}`;
  }
  if (scope) {
    sdl += ` scope: ${scope}`;
  }
  sdl += ")";

  return Directive(sdl);
}
