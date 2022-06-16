export interface AuthorizedMetadata {
  target: Function;
  fieldName: string;
  roles: any[];
}

export type AuthorizedClassMetadata = Omit<AuthorizedMetadata, "fieldName">;
