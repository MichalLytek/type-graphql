import { Authorized, Ctx, Directive, FieldResolver, Query, Resolver } from "@/decorators";
import { SampleObject } from "./SampleObject";

@Resolver(_of => SampleObject)
export class SampleResolver {
  @Query()
  normalQuery(): boolean {
    return true;
  }

  @Query({ description: "random query description" })
  normalObjectQuery(): SampleObject {
    return {
      normalField: "normalField",
      authedField: "authedField",
      adminField: "adminField",
    } as SampleObject;
  }

  @Query()
  @Authorized()
  authedQuery(@Ctx() ctx: any): boolean {
    return ctx.user !== undefined;
  }

  @Query(_type => Boolean, { nullable: true })
  @Authorized()
  nullableAuthedQuery(): boolean {
    return true;
  }

  @Query()
  @Directive(`@throws(errors: ["${["GraphqlError"].join(`", "`)}"])`)
  @Authorized("ADMIN")
  adminQuery(@Ctx() ctx: any): boolean {
    return ctx.user !== undefined;
  }

  @Query()
  @Authorized(["ADMIN", "REGULAR"])
  adminOrRegularQuery(@Ctx() ctx: any): boolean {
    return ctx.user !== undefined;
  }

  @Query()
  @Authorized("ADMIN", "REGULAR")
  adminOrRegularRestQuery(@Ctx() ctx: any): boolean {
    return ctx.user !== undefined;
  }

  @FieldResolver()
  normalResolvedField(): string {
    return "normalResolvedField";
  }

  @FieldResolver()
  @Authorized()
  authedResolvedField(): string {
    return "authedResolvedField";
  }

  @FieldResolver()
  inlineAuthedResolvedField(): string {
    return "inlineAuthedResolvedField";
  }
}
