import { Resolver, Query, Args } from "../../../src";
import { InputTypeTest } from "./input-type";

@Resolver()
export class TestResolver {
  @Query(returns => String)
  test(@Args() args: InputTypeTest) {
    return "hello world";
  }
}
