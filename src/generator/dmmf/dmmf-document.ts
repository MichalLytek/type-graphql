import { DMMF as PrismaDMMF } from "@prisma/client/runtime/dmmf-types";
import { DMMF } from "./types";
import {
  transformDatamodel,
  transformSchema,
  transformMappings,
  transformBareModel,
} from "./transform";
import { GenerateCodeOptions } from "../options";

export class DmmfDocument implements DMMF.Document {
  private models: DMMF.Model[];
  datamodel: DMMF.Datamodel;
  schema: DMMF.Schema;
  mappings: DMMF.Mapping[];

  constructor(
    { datamodel, schema, mappings }: PrismaDMMF.Document,
    options: GenerateCodeOptions,
  ) {
    this.models = datamodel.models.map(transformBareModel);
    this.datamodel = transformDatamodel(datamodel, this);
    this.schema = transformSchema(schema, this);
    this.mappings = transformMappings(mappings, this, options);
  }

  getModelTypeName(modelName: string): string | undefined {
    return this.models.find(it => it.name === modelName)?.typeName;
  }

  isModelName(typeName: string): boolean {
    return this.models.some(it => it.name === typeName);
  }

  getModelFieldAlias(modelName: string, fieldName: string): string | undefined {
    const model = this.models.find(it => it.name === modelName);
    return model?.fields.find(it => it.name === fieldName)?.typeFieldAlias;
  }
}
