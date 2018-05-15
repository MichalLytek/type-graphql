import { getMetadataStorage } from "../metadata/getMetadataStorage";
import { SymbolKeysNotSupportedError } from "../errors";
import { getArrayFromOverloadedRest } from "../helpers/decorators";

export type MethodOrPropDecorator = MethodDecorator & PropertyDecorator;

export function Authorized(): MethodOrPropDecorator;
export function Authorized(roles: any[]): MethodOrPropDecorator;
export function Authorized(...roles: any[]): MethodOrPropDecorator;
export function Authorized(...rolesOrRolesArray: Array<any | any[]>): MethodOrPropDecorator {
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
