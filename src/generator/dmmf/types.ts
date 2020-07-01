export declare namespace DMMF {
  interface Document {
    datamodel: Datamodel;
    schema: Schema;
    mappings: Mapping[];
  }
  interface Enum {
    name: string;
    values: string[];
    dbName?: string | null;
    documentation?: string;
  }
  interface Datamodel {
    models: Model[];
    enums: Enum[];
  }
  interface UniqueIndex {
    name: string;
    fields: string[];
  }
  interface Model {
    name: string;
    isEmbedded: boolean;
    dbName: string | null;
    fields: Field[];
    uniqueFields: string[][];
    uniqueIndexes: UniqueIndex[];
    documentation?: string;
    idFields: string[];
    // [key: string]: any;
    // additional props
    typeName: string;
  }
  type FieldKind = "scalar" | "object" | "enum";
  interface Field {
    kind: FieldKind;
    name: string;
    isRequired: boolean;
    isList: boolean;
    isUnique: boolean;
    isId: boolean;
    type: string;
    dbNames: string[] | null;
    isGenerated: boolean;
    hasDefaultValue: boolean;
    default?: FieldDefault | string | boolean | number;
    relationToFields?: any[];
    relationOnDelete?: string;
    relationName?: string;
    documentation?: string;
    // [key: string]: any;
    // additional props
    typeFieldAlias?: string;
    typeGraphQLType: string;
    fieldTSType: string;
  }
  interface FieldDefault {
    name: string;
    args: any[];
  }
  interface Schema {
    rootQueryType?: string;
    rootMutationType?: string;
    inputTypes: InputType[];
    outputTypes: OutputType[];
    enums: Enum[];
  }
  interface Query {
    name: string;
    args: SchemaArg[];
    output: QueryOutput;
  }
  interface QueryOutput {
    name: string;
    isRequired: boolean;
    isList: boolean;
  }
  type ArgType = string | InputType | Enum;
  interface SchemaArgInputType {
    isRequired: boolean;
    isNullable: boolean;
    isList: boolean;
    // type: ArgType;
    kind: FieldKind;
    // additional props
    argType: ArgType;
    type: string;
  }
  interface SchemaArg {
    name: string;
    // inputType: SchemaArgInputType[];
    isRelationFilter?: boolean;
    nullEqualsUndefined?: boolean;
    comment?: string;
    // additional props
    selectedInputType: SchemaArgInputType;
    typeName: string;
    typeGraphQLType: string;
    fieldTSType: string;
  }
  interface OutputType {
    name: string;
    fields: OutputSchemaField[];
    isEmbedded?: boolean;
    // additional props
    modelName: string;
    typeName: string;
  }
  interface SchemaField {
    name: string;
    outputType: {
      // type: string | OutputType | Enum;
      type: string;
      isList: boolean;
      isRequired: boolean;
      kind: FieldKind;
    };
    args: SchemaArg[];
    // additional props
    typeGraphQLType: string;
    fieldTSType: string;
  }
  // additional type
  interface OutputSchemaField extends SchemaField {
    argsTypeName: string | undefined;
  }
  interface InputType {
    name: string;
    isWhereType?: boolean;
    isOrderType?: boolean;
    atLeastOne?: boolean;
    atMostOne?: boolean;
    fields: SchemaArg[];
    // additional props
    typeName: string;
  }
  interface Mapping {
    model: string;
    plural: string;
    // findOne?: string | null;
    // findMany?: string | null;
    // create?: string | null;
    // update?: string | null;
    // updateMany?: string | null;
    // upsert?: string | null;
    // delete?: string | null;
    // deleteMany?: string | null;
    // aggregate?: string | null;

    // additional props
    actions: Action[];
  }
  // additional type
  interface Action {
    name: string;
    fieldName: string;
    kind: ModelAction;
    operation: "Query" | "Mutation";
  }
  enum ModelAction {
    findOne = "findOne",
    findMany = "findMany",
    create = "create",
    update = "update",
    updateMany = "updateMany",
    upsert = "upsert",
    delete = "delete",
    deleteMany = "deleteMany",
    // additional props
    aggregate = "aggregate",
  }
}
export interface BaseField {
  name: string;
  type: string | DMMF.Enum | DMMF.OutputType | DMMF.SchemaArg;
  isList: boolean;
  isRequired: boolean;
}
