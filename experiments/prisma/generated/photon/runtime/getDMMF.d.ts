import { DMMF } from '@prisma/generator-helper';
import { GetDMMFOptions } from '@prisma/sdk';
import { DMMF as PhotonDMMF } from './dmmf-types';
export declare function getPhotonDMMF(dmmf: DMMF.Document): PhotonDMMF.Document;
export declare function getDMMF(options: GetDMMFOptions): Promise<PhotonDMMF.Document>;
