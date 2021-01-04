import {
  ObjectTypeDefinitionNode,
  InputObjectTypeDefinitionNode,
  GraphQLOutputType,
  FieldDefinitionNode,
  GraphQLInputType,
  InputValueDefinitionNode,
  DirectiveNode,
  parseValue,
  DocumentNode,
  parse,
  InterfaceTypeDefinitionNode,
} from "graphql";

import { InvalidDirectiveError } from "../errors";
import { DirectiveMetadata } from "../metadata/definitions";

export function getObjectTypeDefinitionNode(
  name: string,
  directiveMetadata?: DirectiveMetadata[],
): ObjectTypeDefinitionNode | undefined {
  if (!directiveMetadata || !directiveMetadata.length) {
    return;
  }

  return {
    kind: "ObjectTypeDefinition",
    name: {
      kind: "Name",
      // FIXME: use proper AST representation
      value: name,
    },
    directives: directiveMetadata.map(getDirectiveNode),
  };
}

export function getInputObjectTypeDefinitionNode(
  name: string,
  directiveMetadata?: DirectiveMetadata[],
): InputObjectTypeDefinitionNode | undefined {
  if (!directiveMetadata || !directiveMetadata.length) {
    return;
  }

  return {
    kind: "InputObjectTypeDefinition",
    name: {
      kind: "Name",
      // FIXME: use proper AST representation
      value: name,
    },
    directives: directiveMetadata.map(getDirectiveNode),
  };
}

export function getFieldDefinitionNode(
  name: string,
  type: GraphQLOutputType,
  directiveMetadata?: DirectiveMetadata[],
): FieldDefinitionNode | undefined {
  if (!directiveMetadata || !directiveMetadata.length) {
    return;
  }

  return {
    kind: "FieldDefinition",
    type: {
      kind: "NamedType",
      name: {
        kind: "Name",
        value: type.toString(),
      },
    },
    name: {
      kind: "Name",
      value: name,
    },
    directives: directiveMetadata.map(getDirectiveNode),
  };
}

export function getInputValueDefinitionNode(
  name: string,
  type: GraphQLInputType,
  directiveMetadata?: DirectiveMetadata[],
): InputValueDefinitionNode | undefined {
  if (!directiveMetadata || !directiveMetadata.length) {
    return;
  }

  return {
    kind: "InputValueDefinition",
    type: {
      kind: "NamedType",
      name: {
        kind: "Name",
        value: type.toString(),
      },
    },
    name: {
      kind: "Name",
      value: name,
    },
    directives: directiveMetadata.map(getDirectiveNode),
  };
}

export function getInterfaceTypeDefinitionNode(
  name: string,
  directiveMetadata?: DirectiveMetadata[],
): InterfaceTypeDefinitionNode | undefined {
  if (!directiveMetadata || !directiveMetadata.length) {
    return;
  }

  return {
    kind: "InterfaceTypeDefinition",
    name: {
      kind: "Name",
      // FIXME: use proper AST representation
      value: name,
    },
    directives: directiveMetadata.map(getDirectiveNode),
  };
}

export function getDirectiveNode(directive: DirectiveMetadata): DirectiveNode {
  const { nameOrDefinition, args } = directive;

  if (nameOrDefinition === "") {
    throw new InvalidDirectiveError(
      "Please pass at-least one directive name or definition to the @Directive decorator",
    );
  }

  if (!nameOrDefinition.startsWith("@")) {
    return {
      kind: "Directive",
      name: {
        kind: "Name",
        value: nameOrDefinition,
      },
      arguments: Object.keys(args).map(argKey => ({
        kind: "Argument",
        name: {
          kind: "Name",
          value: argKey,
        },
        value: parseValue(args[argKey]),
      })),
    };
  }

  let parsed: DocumentNode;
  try {
    parsed = parse(`type String ${nameOrDefinition}`);
  } catch (err) {
    throw new InvalidDirectiveError(
      `Error parsing directive definition "${directive.nameOrDefinition}"`,
    );
  }

  const definitions = parsed.definitions as ObjectTypeDefinitionNode[];
  const directives = definitions
    .filter(it => it.directives && it.directives.length > 0)
    .map(it => it.directives!)
    .reduce((acc, item) => [...acc, ...item]); // flatten the array

  if (directives.length !== 1) {
    throw new InvalidDirectiveError(
      `Please pass only one directive name or definition at a time to the @Directive decorator "${directive.nameOrDefinition}"`,
    );
  }
  return directives[0];
}
