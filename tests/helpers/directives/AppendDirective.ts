import { SchemaDirectiveVisitor } from "graphql-tools";
import { GraphQLField, GraphQLString, GraphQLDirective, DirectiveLocation } from "graphql";

export class AppendDirective extends SchemaDirectiveVisitor {
  static getDirectiveDeclaration(directiveName: string): GraphQLDirective {
    return new GraphQLDirective({
      name: directiveName,
      locations: [DirectiveLocation.FIELD_DEFINITION],
    });
  }

  visitFieldDefinition(field: GraphQLField<any, any>) {
    const resolve = field.resolve;

    field.args.push({
      name: "append",
      description: "Appends a string to the end of a field",
      type: GraphQLString,
      defaultValue: "",
      extensions: {},
      astNode: undefined,
    });

    field.resolve = async function (source, { append, ...otherArgs }, context, info) {
      const result = await resolve!.call(this, source, otherArgs, context, info);

      return `${result}${append}`;
    };
  }
}
