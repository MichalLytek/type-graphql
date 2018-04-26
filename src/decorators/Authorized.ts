import { getMetadataStorage } from "../metadata/getMetadataStorage";
import { SymbolKeysNotSupportedError } from "../errors";
import { getArrayFromOverloadedRest } from "../helpers/decorators";

export type MethodOrPropDecorator = MethodDecorator & PropertyDecorator;

export function Authorized(): MethodOrPropDecorator;
export function Authorized(roles: string[]): MethodOrPropDecorator;
export function Authorized(...roles: string[]): MethodOrPropDecorator;
export function Authorized(...rolesOrRolesArray: Array<string | string[]>): MethodOrPropDecorator {
  const roles = getArrayFromOverloadedRest(rolesOrRolesArray);

  return (prototype: object, propertyKey: string | symbol) => {
    if (typeof propertyKey === "symbol") {
      throw new SymbolKeysNotSupportedError();
    }

    getMetadataStorage().collectAuthorizedFieldMetadata({
      target: prototype.constructor,
      fieldName: propertyKey,
      roles,
    });
  };
}
