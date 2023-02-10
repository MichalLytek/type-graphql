import { getMetadataStorage } from "@/metadata/getMetadataStorage";
import { SymbolKeysNotSupportedError } from "@/errors";
import { getArrayFromOverloadedRest } from "@/helpers/decorators";
import { MethodAndPropDecorator } from "./types";

export function Authorized(): MethodAndPropDecorator;
export function Authorized<RoleType = string>(roles: readonly RoleType[]): MethodAndPropDecorator;
export function Authorized<RoleType = string>(
  ...roles: readonly RoleType[]
): MethodAndPropDecorator;
export function Authorized<RoleType = string>(
  ...rolesOrRolesArray: Array<RoleType | readonly RoleType[]>
): MethodDecorator | PropertyDecorator {
  const roles = getArrayFromOverloadedRest(rolesOrRolesArray);

  return (prototype, propertyKey, _descriptor) => {
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
