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
    interface uniqueIndex {
        name: string;
        fields: string[];
    }
    interface Model {
        name: string;
        isEmbedded: boolean;
        dbName: string | null;
        fields: Field[];
        uniqueFields: string[][];
        uniqueIndexes: uniqueIndex[];
        documentation?: string;
        idFields: string[];
        [key: string]: any;
    }
    type FieldKind = 'scalar' | 'object' | 'enum';
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
        [key: string]: any;
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
        type: ArgType;
        kind: FieldKind;
    }
    interface SchemaArg {
        name: string;
        inputType: SchemaArgInputType[];
        isRelationFilter?: boolean;
        nullEqualsUndefined?: boolean;
        comment?: string;
    }
    interface OutputType {
        name: string;
        fields: SchemaField[];
        fieldMap?: Record<string, SchemaField>;
        isEmbedded?: boolean;
    }
    interface SchemaField {
        name: string;
        outputType: {
            type: string | OutputType | Enum;
            isList: boolean;
            isRequired: boolean;
            kind: FieldKind;
        };
        args: SchemaArg[];
    }
    interface InputType {
        name: string;
        isWhereType?: boolean;
        isOrderType?: boolean;
        atLeastOne?: boolean;
        atMostOne?: boolean;
        fields: SchemaArg[];
        fieldMap?: Record<string, SchemaArg>;
    }
    interface Mapping {
        model: string;
        plural: string;
        findOne?: string | null;
        findMany?: string | null;
        create?: string | null;
        update?: string | null;
        updateMany?: string | null;
        upsert?: string | null;
        delete?: string | null;
        deleteMany?: string | null;
        aggregate?: string | null;
    }
    enum ModelAction {
        findOne = "findOne",
        findMany = "findMany",
        create = "create",
        update = "update",
        updateMany = "updateMany",
        upsert = "upsert",
        delete = "delete",
        deleteMany = "deleteMany"
    }
}
export interface BaseField {
    name: string;
    type: string | DMMF.Enum | DMMF.OutputType | DMMF.SchemaArg;
    isList: boolean;
    isRequired: boolean;
}
