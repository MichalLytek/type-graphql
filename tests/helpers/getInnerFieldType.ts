import {
  IntrospectionObjectType,
  IntrospectionInterfaceType,
  IntrospectionNonNullTypeRef,
  IntrospectionNamedTypeRef,
} from "graphql";

export function getInnerFieldType(
  type: IntrospectionObjectType | IntrospectionInterfaceType,
  name: string,
) {
  const fieldType = type.fields.find(field => field.name === name)!;
  return (fieldType.type as IntrospectionNonNullTypeRef).ofType! as IntrospectionNamedTypeRef;
}
