import { Resolver, Query, Args } from "../../../src";
import { InputTypeTest } from "./input-type";
import { ClassInputType } from "./classes/input-type";

@Resolver()
export class TestResolver {
  @Query(returns => String)
  test(@Args() args: InputTypeTest) {
    console.log(args);
    return "hello world";
  }

  @Query(returns => ClassInputType)
  testNormal(): ClassInputType {
    return {
      hello: "world",
    };
  }
}
