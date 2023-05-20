import type {
  IntrospectionField,
  IntrospectionInterfaceType,
  IntrospectionObjectType,
} from "graphql";

export function getTypeField(
  type: IntrospectionObjectType | IntrospectionInterfaceType,
  fieldName: string,
): IntrospectionField {
  return type.fields.find(field => field.name === fieldName)!;
}
