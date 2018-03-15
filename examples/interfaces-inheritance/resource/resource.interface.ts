import { InterfaceType, ID, Field } from "../../../src";

@InterfaceType()
export abstract class IResource {
  @Field(ID)
  id: string;
}
