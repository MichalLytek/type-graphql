export const modelAttributeRegex = /(@@TypeGraphQL\.)+([A-z])+(\()+(.+)+(\))+/;
export const fieldAttributeRegex = /(@TypeGraphQL\.)+([A-z])+(\()+(.+)+(\))+/;
export const attributeNameRegex = /(?:\.)+([A-Za-z])+(?:\()+/;
export const attributeArgsRegex = /(?:\()+([A-Za-z])+\:+(.+)+(?:\))+/;

export function parseDocumentationAttributes<TData extends object = object>(
  documentation: string | undefined,
  expectedAttributeName: string,
  expectedAttributeKind: "model" | "field",
): Partial<TData> {
  const attributeRegex =
    expectedAttributeKind === "model"
      ? modelAttributeRegex
      : fieldAttributeRegex;
  const attribute = documentation?.match(attributeRegex)?.[0];
  const attributeName = attribute?.match(attributeNameRegex)?.[0]?.slice(1, -1);
  if (attributeName !== expectedAttributeName) {
    return {};
  }
  const rawAttributeArgs = attribute
    ?.match(attributeArgsRegex)?.[0]
    ?.slice(1, -1);
  const splitRawArgsArray = rawAttributeArgs?.split(",").map(it => it.trim());
  const parsedAttributeArgs =
    splitRawArgsArray &&
    (Object.fromEntries(
      splitRawArgsArray.map(it => {
        const [key, value] = it.split(": ");
        return [key, JSON.parse(value)];
      }),
    ) as Partial<TData>);
  return parsedAttributeArgs ?? {};
}
