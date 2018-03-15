import { MetadataStorage } from "../metadata/metadata-storage";
import { SymbolKeysNotSupportedError } from "../errors";

export type MethodOrPropDecorator = MethodDecorator & PropertyDecorator;

export function Authorized(): MethodOrPropDecorator;
export function Authorized(roles: string[]): MethodOrPropDecorator;
export function Authorized(...roles: string[]): MethodOrPropDecorator;
export function Authorized(...rolesOrRolesArray: any[]): MethodOrPropDecorator {
  let roles: string[];
  if (Array.isArray(rolesOrRolesArray[0])) {
    roles = rolesOrRolesArray[0];
  } else {
    roles = rolesOrRolesArray;
  }

  return (prototype: object, propertyKey: string | symbol) => {
    if (typeof propertyKey === "symbol") {
      throw new SymbolKeysNotSupportedError();
    }

    MetadataStorage.registerAuthorizedField({
      target: prototype.constructor,
      fieldName: propertyKey,
      roles,
    });
  };
}
