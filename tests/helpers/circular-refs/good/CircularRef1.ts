import { Field, ObjectType } from "type-graphql";

import { CircularRef2 } from "./CircularRef2";

let hasModuleFinishedInitialLoad = false;

@ObjectType()
export class CircularRef1 {
  @Field(type => {
    if (!hasModuleFinishedInitialLoad) {
      throw new Error("Field type function was called synchronously during module load");
    }
    return [CircularRef2];
  })
  ref2Field: any[];
}

hasModuleFinishedInitialLoad = true;
