import {
  IntrospectionObjectType,
  IntrospectionInterfaceType,
  IntrospectionNonNullTypeRef,
  IntrospectionNamedTypeRef,
  IntrospectionInputObjectType,
  IntrospectionTypeRef,
} from "graphql";

export function getInnerFieldType(
  type: IntrospectionObjectType | IntrospectionInterfaceType,
  name: string,
) {
  return getInnerTypeOfNullableType(type.fields.find(field => field.name === name)!);
}

export function getInnerInputFieldType(type: IntrospectionInputObjectType, name: string) {
  return getInnerTypeOfNullableType(type.inputFields.find(field => field.name === name)!);
}

export function getInnerTypeOfNullableType(definition: { type: IntrospectionTypeRef }) {
  return (definition.type as IntrospectionNonNullTypeRef).ofType! as IntrospectionNamedTypeRef;
}
