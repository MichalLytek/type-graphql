const attributeRegex = /(@@TypeGraphQL\.)+([A-z])+(\(")+([A-z])+("\))+/;
const attributeArgsRegex = /(?:\(")+([A-Za-z])+(?:"\))+/;
const attributeKindRegex = /(?:\.)+([A-Za-z])+(?:\()+/;

export function parseDocumentationAttributes(
  documentation: string | undefined,
  expectedAttributeKind: string,
) {
  const attribute = documentation?.match(attributeRegex)?.[0];
  const attributeKind = attribute?.match(attributeKindRegex)?.[0]?.slice(1, -1);
  if (attributeKind !== expectedAttributeKind) {
    return;
  }
  const attributeArgs = attribute?.match(attributeArgsRegex)?.[0]?.slice(1, -1);
  return attributeArgs;
}
