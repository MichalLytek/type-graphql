import { GraphQLObjectType } from "../../../src";

import { IPerson } from "./person.interface";

@GraphQLObjectType({ implements: IPerson })
export class Person implements IPerson {
  id: string;
  name: string;
  age: number;
}
