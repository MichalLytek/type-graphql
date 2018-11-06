export interface Metadata {
  target: Function | string | symbol;
  name?: string;
  data: {
    [key: string]: any;
  };
}
