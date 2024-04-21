import {
  type FieldDefinitionNode,
  type InputObjectTypeDefinitionNode,
  type InputValueDefinitionNode,
  type InterfaceTypeDefinitionNode,
  type ObjectTypeDefinitionNode,
  parseValue,
} from "graphql";
import { type Maybe } from "@/typings";

export function assertValidDirective(
  astNode: Maybe<
    | FieldDefinitionNode
    | ObjectTypeDefinitionNode
    | InputObjectTypeDefinitionNode
    | InputValueDefinitionNode
    | InterfaceTypeDefinitionNode
  >,
  name: string,
  args?: Record<string, string>,
): void {
  if (!astNode) {
    throw new Error(`Directive with name ${name} does not exist`);
  }

  const directives = (astNode && astNode.directives) || [];

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
    expect(directive.arguments).toHaveLength(Object.keys(args.length).length);
    expect(directive.arguments).toEqual(
      expect.arrayContaining(
        Object.keys(args).map(arg =>
          expect.objectContaining({
            kind: "Argument",
            name: expect.objectContaining({ kind: "Name", value: arg }),
            value: expect.objectContaining(parseValue(args[arg], { noLocation: true })),
          }),
        ),
      ),
    );
  }
}
