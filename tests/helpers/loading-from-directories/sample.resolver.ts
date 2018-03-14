import { Query } from "../../../src";

import { SampleObject } from "./sample.type";

export class Resolver {
  @Query()
  sampleQuery(): SampleObject {
    return {
      sampleField: "sampleField",
    };
  }
}
