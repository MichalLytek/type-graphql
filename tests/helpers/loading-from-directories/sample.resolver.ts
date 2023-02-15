import { Query } from "type-graphql";
import { SampleObject } from "./sample.type";

export class Resolver {
  @Query()
  sampleQuery(): SampleObject {
    return {
      sampleField: "sampleField",
    };
  }
}
