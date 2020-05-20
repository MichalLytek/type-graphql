import { DMMF as PrismaDMMF } from "@prisma/client/runtime/dmmf-types";
import { DMMF } from "./types";
import { transformDatamodel } from "./transform";

export class DmmfDocument implements DMMF.Document {
  datamodel: DMMF.Datamodel;
  schema: DMMF.Schema;
  mappings: DMMF.Mapping[];

  constructor({ datamodel, schema, mappings }: PrismaDMMF.Document) {
    this.datamodel = transformDatamodel(datamodel);
    this.schema = schema;
    this.mappings = mappings;
  }

  getModelTypeName(modelName: string): string | undefined {
    return this.datamodel.models.find(it => it.name === modelName)?.typeName;
  }

  isModelName(typeName: string): boolean {
    return this.datamodel.models.some(it => it.name === typeName);
  }

  getModelFieldAlias(modelName: string, fieldName: string): string | undefined {
    const model = this.datamodel.models.find(it => it.name === modelName);
    return model?.fields.find(it => it.name === fieldName)?.typeFieldAlias;
  }
}
