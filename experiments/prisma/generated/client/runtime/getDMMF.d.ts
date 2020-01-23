import { DMMF } from '@prisma/generator-helper';
import { GetDMMFOptions } from '@prisma/sdk';
import { DMMF as PrismaClientDMMF } from './dmmf-types';
export declare function getPrismaClientDMMF(dmmf: DMMF.Document): PrismaClientDMMF.Document;
export declare function getDMMF(options: GetDMMFOptions): Promise<PrismaClientDMMF.Document>;
