import { GraphQLInterfaceType, ID, Field } from "../../../src";

@GraphQLInterfaceType()
export abstract class IResource {
  @Field(ID)
  id: string;
}
