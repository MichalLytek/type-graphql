import { InterfaceType, ID, Field } from "../../../src";

@InterfaceType()
export abstract class IResource {
  @Field(type => ID)
  id: string;
}
