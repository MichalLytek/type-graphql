import type { CacheHint } from "apollo-server-types";
import { Directive } from "../../src";

export function CacheControl({ maxAge, scope }: CacheHint) {
  if (!maxAge && !scope) {
    throw new Error("Missing maxAge or scope param for @CacheControl");
  }

  let sdl = "@cacheControl(";
  if (maxAge) {
    sdl += `maxAge: ${maxAge}`;
  }
  if (scope) {
    sdl += ` scope: ${scope}`;
  }
  sdl += ")";

  return Directive(sdl);
}
