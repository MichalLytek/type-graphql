import { registerEnumType } from "../../../src";

export enum PersonRole {
  Normal,
  Pro,
  Admin,
}

registerEnumType(PersonRole, { name: "PersonRole" });
