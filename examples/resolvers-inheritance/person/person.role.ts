import { registerEnumType } from "type-graphql";

export enum PersonRole {
  Normal,
  Pro,
  Admin,
}

registerEnumType(PersonRole, { name: "PersonRole" });
