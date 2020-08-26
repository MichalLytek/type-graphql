import { DMMF as PrismaDMMF } from "@prisma/client/runtime/dmmf-types";
import { DMMF } from "./types";
import {
  transformSchema,
  transformMappings,
  transformBareModel,
  transformModelWithFields,
  transformEnums,
  generateRelationModel,
} from "./transform";
import { GenerateCodeOptions } from "../options";

export class DmmfDocument implements DMMF.Document {
  private models: DMMF.Model[];
  datamodel: DMMF.Datamodel;
  schema: DMMF.Schema;
  enums: DMMF.Enum[];
  mappings: DMMF.Mapping[];
  relationModels: DMMF.RelationModel[];

  constructor(
    { datamodel, schema, mappings }: PrismaDMMF.Document,
    public options: GenerateCodeOptions,
  ) {
    // transform bare model without fields
    this.models = datamodel.models.map(transformBareModel);
    // then transform once again to map the fields (it requires mapped model type names)
    this.models = datamodel.models.map(transformModelWithFields(this));

    this.datamodel = {
      models: this.models,
      enums: datamodel.enums.map(transformEnums(this)),
    };
    this.enums = schema.enums.map(transformEnums(this));
    this.schema = {
      ...transformSchema(schema, this),
      enums: this.enums,
    };
    this.mappings = transformMappings(mappings, this, options);
    this.relationModels = this.models
      .filter(model =>
        model.fields.some(field => field.relationName !== undefined),
      )
      .map(generateRelationModel(this));
  }

  getModelTypeName(modelName: string): string | undefined {
    return this.models.find(
      it => it.name.toLocaleLowerCase() === modelName.toLocaleLowerCase(),
    )?.typeName;
  }

  isModelName(typeName: string): boolean {
    return this.models.some(it => it.name === typeName);
  }

  isModelTypeName(typeName: string): boolean {
    return this.models.some(it => it.typeName === typeName);
  }

  getModelFieldAlias(modelName: string, fieldName: string): string | undefined {
    const model = this.models.find(it => it.name === modelName);
    return model?.fields.find(it => it.name === fieldName)?.typeFieldAlias;
  }
}
