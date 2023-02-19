import {
  IntrospectionNamedTypeRef,
  IntrospectionNonNullTypeRef,
  IntrospectionObjectType,
  IntrospectionSchema,
} from "graphql";

export function getSampleObjectFieldType(schemaIntrospection: IntrospectionSchema) {
  const sampleObject = schemaIntrospection.types.find(
    type => type.name === "SampleObject",
  ) as IntrospectionObjectType;
  return (fieldName: string) => {
    const field = sampleObject.fields.find(it => it.name === fieldName)!;
    const fieldType = (field.type as IntrospectionNonNullTypeRef)
      .ofType as IntrospectionNamedTypeRef;
    return fieldType;
  };
}
