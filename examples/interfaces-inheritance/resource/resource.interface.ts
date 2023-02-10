import { InterfaceType, ID, Field } from "type-graphql";

@InterfaceType()
export abstract class IResource {
  @Field(type => ID)
  id: string;
}
