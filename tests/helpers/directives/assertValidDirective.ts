import {
  FieldDefinitionNode,
  InputObjectTypeDefinitionNode,
  InputValueDefinitionNode,
  parseValue,
} from "graphql";
import Maybe from "graphql/tsutils/Maybe";

export function assertValidDirective(
  astNode: Maybe<FieldDefinitionNode | InputObjectTypeDefinitionNode | InputValueDefinitionNode>,
  name: string,
  args?: { [key: string]: string },
): void {
  if (!astNode) {
    throw new Error(`Directive with name ${name} does not exist`);
  }

  const directives = (astNode || {}).directives || [];

  const directive = directives.find(it => it.name.kind === "Name" && it.name.value === name);

  if (!directive) {
    throw new Error(`Directive with name ${name} does not exist`);
  }

  if (!args) {
    if (Array.isArray(directive.arguments)) {
      expect(directive.arguments).toHaveLength(0);
    } else {
      expect(directive.arguments).toBeFalsy();
    }
  } else {
    expect(directive.arguments).toEqual(
      Object.keys(args).map(arg => ({
        kind: "Argument",
        name: { kind: "Name", value: arg },
        value: parseValue(args[arg]),
      })),
    );
  }
}
