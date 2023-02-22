import {
  IntrospectionInputObjectType,
  IntrospectionInterfaceType,
  IntrospectionNamedTypeRef,
  IntrospectionNonNullTypeRef,
  IntrospectionObjectType,
  IntrospectionTypeRef,
} from "graphql";

export function getInnerTypeOfNonNullableType(definition: { type: IntrospectionTypeRef }) {
  return (definition.type as IntrospectionNonNullTypeRef).ofType! as IntrospectionNamedTypeRef;
}

export function getInnerFieldType(
  type: IntrospectionObjectType | IntrospectionInterfaceType,
  name: string,
) {
  return getInnerTypeOfNonNullableType(type.fields.find(field => field.name === name)!);
}

export function getInnerInputFieldType(type: IntrospectionInputObjectType, name: string) {
  return getInnerTypeOfNonNullableType(type.inputFields.find(field => field.name === name)!);
}

export function getItemTypeOfList(definition: { type: IntrospectionTypeRef }) {
  const listType = (definition.type as IntrospectionNonNullTypeRef)
    .ofType! as IntrospectionNonNullTypeRef;
  const itemType = (listType.ofType! as IntrospectionNonNullTypeRef)
    .ofType as IntrospectionNamedTypeRef;
  return itemType;
}
