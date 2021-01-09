import {
  GraphQLField,
  GraphQLDirective,
  DirectiveLocation,
  GraphQLInputObjectType,
  GraphQLInputField,
  GraphQLScalarType,
  GraphQLNonNull,
} from "graphql";
import { SchemaDirectiveVisitor } from "graphql-tools";

class UpperCaseType extends GraphQLScalarType {
  constructor(type: any) {
    super({
      name: "UpperCase",
      parseValue: value => this.upper(type.parseValue(value)),
      serialize: value => this.upper(type.serialize(value)),
      parseLiteral: ast => this.upper(type.parseLiteral(ast)),
    });
  }

  upper(value: any) {
    return typeof value === "string" ? value.toUpperCase() : value;
  }
}

export class UpperCaseDirective<
  TArgs = { [name: string]: any },
  TContext = { [key: string]: any }
> extends SchemaDirectiveVisitor<TArgs, TContext> {
  static getDirectiveDeclaration(directiveName: string): GraphQLDirective {
    return new GraphQLDirective({
      name: directiveName,
      locations: [DirectiveLocation.FIELD_DEFINITION],
    });
  }

  visitFieldDefinition(field: GraphQLField<any, any>) {
    this.wrapField(field);
  }

  visitInputObject(object: GraphQLInputObjectType) {
    const fields = object.getFields();

    Object.keys(fields).forEach(field => {
      this.wrapField(fields[field]);
    });
  }

  visitInputFieldDefinition(field: GraphQLInputField) {
    this.wrapField(field);
  }

  wrapField(field: GraphQLField<any, any> | GraphQLInputField): void {
    if (field.type instanceof UpperCaseType) {
      /* noop */
    } else if (
      field.type instanceof GraphQLNonNull &&
      field.type.ofType instanceof GraphQLScalarType
    ) {
      field.type = new GraphQLNonNull(new UpperCaseType(field.type.ofType));
    } else if (field.type instanceof GraphQLScalarType) {
      field.type = new UpperCaseType(field.type);
    } else {
      throw new Error(`Not a scalar type: ${field.type}`);
    }
  }
}
