import { ObjectId } from "mongodb";

export type Ref<T> = T | ObjectId;
