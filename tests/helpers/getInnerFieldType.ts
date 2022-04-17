import {
  IntrospectionObjectType,
  IntrospectionInterfaceType,
  IntrospectionNonNullTypeRef,
  IntrospectionNamedTypeRef,
  IntrospectionInputObjectType,
  IntrospectionTypeRef,
  IntrospectionType
} from 'graphql'

export function getInnerFieldType(
  type: IntrospectionObjectType | IntrospectionInterfaceType,
  name: string
): IntrospectionNamedTypeRef<IntrospectionType> {
  return getInnerTypeOfNonNullableType(type.fields.find(field => field.name === name)!)
}

export function getInnerInputFieldType(
  type: IntrospectionInputObjectType,
  name: string
): IntrospectionNamedTypeRef<IntrospectionType> {
  return getInnerTypeOfNonNullableType(type.inputFields.find(field => field.name === name)!)
}

export function getInnerTypeOfNonNullableType(definition: {
  type: IntrospectionTypeRef
}): IntrospectionNamedTypeRef<IntrospectionType> {
  return (definition.type as IntrospectionNonNullTypeRef).ofType as IntrospectionNamedTypeRef
}

export function getItemTypeOfList(definition: {
  type: IntrospectionTypeRef
}): IntrospectionNamedTypeRef<IntrospectionType> {
  const listType = (definition.type as IntrospectionNonNullTypeRef).ofType as IntrospectionNonNullTypeRef
  const itemType = (listType.ofType as IntrospectionNonNullTypeRef).ofType as IntrospectionNamedTypeRef
  return itemType
}
