// TODO: support not string args
const modelAttributeRegex = /(@@TypeGraphQL\.)+([A-z])+(\(")+([A-z])+("\))+/;
const fieldAttributeRegex = /(@TypeGraphQL\.)+([A-z])+(\(")+([A-z])+("\))+/;
const attributeNameRegex = /(?:\.)+([A-Za-z])+(?:\()+/;
const attributeArgsRegex = /(?:\(")+([A-Za-z])+(?:"\))+/;

export function parseDocumentationAttributes(
  documentation: string | undefined,
  expectedAttributeName: string,
  expectedAttributeKind: "model" | "field",
) {
  const attributeRegex =
    expectedAttributeKind === "model"
      ? modelAttributeRegex
      : fieldAttributeRegex;
  const attribute = documentation?.match(attributeRegex)?.[0];
  const attributeName = attribute?.match(attributeNameRegex)?.[0]?.slice(1, -1);
  if (attributeName !== expectedAttributeName) {
    return;
  }
  const attributeArgs = attribute?.match(attributeArgsRegex)?.[0]?.slice(1, -1);
  return attributeArgs;
}
