import { Field, ID, InterfaceType } from "type-graphql";

@InterfaceType()
export abstract class IResource {
  @Field(_type => ID)
  id!: string;
}
