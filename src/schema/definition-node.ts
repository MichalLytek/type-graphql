import {
  type ConstArgumentNode,
  type ConstDirectiveNode,
  type DocumentNode,
  type FieldDefinitionNode,
  type GraphQLInputType,
  type GraphQLOutputType,
  type InputObjectTypeDefinitionNode,
  type InputValueDefinitionNode,
  type InterfaceTypeDefinitionNode,
  Kind,
  type ObjectTypeDefinitionNode,
  parse,
  parseConstValue,
} from "graphql";
import { InvalidDirectiveError } from "@/errors";
import { type DirectiveMetadata } from "@/metadata/definitions";
import { type SetRequired } from "@/typings";

export function getDirectiveNode(directive: DirectiveMetadata): ConstDirectiveNode {
  const { nameOrDefinition, args } = directive;

  if (nameOrDefinition === "") {
    throw new InvalidDirectiveError(
      "Please pass at-least one directive name or definition to the @Directive decorator",
    );
  }

  if (!nameOrDefinition.startsWith("@")) {
    return {
      kind: Kind.DIRECTIVE,
      name: {
        kind: Kind.NAME,
        value: nameOrDefinition,
      },
      arguments: Object.keys(args).map<ConstArgumentNode>(argKey => ({
        kind: Kind.ARGUMENT,
        name: {
          kind: Kind.NAME,
          value: argKey,
        },
        value: parseConstValue(args[argKey]),
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
    .filter(
      (it): it is SetRequired<ObjectTypeDefinitionNode, "directives"> =>
        !!it.directives && it.directives.length > 0,
    )
    .map(it => it.directives)
    .flat();

  if (directives.length !== 1) {
    throw new InvalidDirectiveError(
      `Please pass only one directive name or definition at a time to the @Directive decorator "${directive.nameOrDefinition}"`,
    );
  }

  return directives[0];
}

export function getObjectTypeDefinitionNode(
  name: string,
  directiveMetadata?: DirectiveMetadata[],
): ObjectTypeDefinitionNode | undefined {
  if (!directiveMetadata || !directiveMetadata.length) {
    return undefined;
  }

  return {
    kind: Kind.OBJECT_TYPE_DEFINITION,
    name: {
      kind: Kind.NAME,
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
    return undefined;
  }

  return {
    kind: Kind.INPUT_OBJECT_TYPE_DEFINITION,
    name: {
      kind: Kind.NAME,
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
    return undefined;
  }

  return {
    kind: Kind.FIELD_DEFINITION,
    type: {
      kind: Kind.NAMED_TYPE,
      name: {
        kind: Kind.NAME,
        value: type.toString(),
      },
    },
    name: {
      kind: Kind.NAME,
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
    return undefined;
  }

  return {
    kind: Kind.INPUT_VALUE_DEFINITION,
    type: {
      kind: Kind.NAMED_TYPE,
      name: {
        kind: Kind.NAME,
        value: type.toString(),
      },
    },
    name: {
      kind: Kind.NAME,
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
    return undefined;
  }

  return {
    kind: Kind.INTERFACE_TYPE_DEFINITION,
    name: {
      kind: Kind.NAME,
      // FIXME: use proper AST representation
      value: name,
    },
    directives: directiveMetadata.map(getDirectiveNode),
  };
}
