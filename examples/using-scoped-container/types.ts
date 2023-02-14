import { ContainerInstance } from "typedi";

export type Context = {
  requestId: number;
  container: ContainerInstance;
};
