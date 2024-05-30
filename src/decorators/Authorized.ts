import { SymbolKeysNotSupportedError } from "@/errors";
import { getArrayFromOverloadedRest } from "@/helpers/decorators";
import { getMetadataStorage } from "@/metadata/getMetadataStorage";
import { type MethodPropClassDecorator } from "./types";

export function Authorized(): MethodPropClassDecorator;
export function Authorized<RoleType = string>(roles: readonly RoleType[]): MethodPropClassDecorator;
export function Authorized<RoleType = string>(
  ...roles: readonly RoleType[]
): MethodPropClassDecorator;
export function Authorized<RoleType = string>(
  ...rolesOrRolesArray: Array<RoleType | readonly RoleType[]>
): MethodPropClassDecorator {
  const roles = getArrayFromOverloadedRest(rolesOrRolesArray);

  return (
    target: Function | Object,
    propertyKey?: string | symbol,
    _descriptor?: TypedPropertyDescriptor<any>,
  ) => {
    if (propertyKey == null) {
      getMetadataStorage().collectAuthorizedResolverMetadata({
        target: target as Function,
        roles,
      });
      return;
    }

    if (typeof propertyKey === "symbol") {
      throw new SymbolKeysNotSupportedError();
    }

    getMetadataStorage().collectAuthorizedFieldMetadata({
      target: target.constructor,
      fieldName: propertyKey,
      roles,
    });
  };
}
