import { DMMF as ExternalDMMF } from '@prisma/generator-helper';
import { DMMF } from './dmmf-types';
/**
 * Turns type: string into type: string[] for all args in order to support union input types
 * @param document
 */
export declare function externalToInternalDmmf(document: ExternalDMMF.Document): DMMF.Document;
