import { CacheHint } from "apollo-cache-control";
import { UseMiddleware } from "../../src";

export function CacheControl(hint: CacheHint) {
  return UseMiddleware(({ info }, next) => {
    console.log("Called CacheControl");
    info.cacheControl.setCacheHint(hint);
    return next();
  });
}
