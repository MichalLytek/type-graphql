import { Field, ObjectType, Directive, ID } from "../../../src";

import { users } from "./data";

@Directive(`@key(fields: "id")`)
@ObjectType()
export default class User {
  @Field(type => ID)
  id: string;

  @Field()
  username: string;

  @Field()
  name: string;

  @Field()
  birthDate: string;
}

export async function resolveUserReference(reference: Pick<User, "id">): Promise<User> {
  return users.find(u => u.id === reference.id)!;
}
