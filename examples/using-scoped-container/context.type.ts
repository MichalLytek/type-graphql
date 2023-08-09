import { type ContainerInstance } from "typedi";

export interface Context {
  requestId: number;
  container: ContainerInstance;
}
