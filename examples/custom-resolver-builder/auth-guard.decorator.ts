import "reflect-metadata";

export const AuthGuard = (target: Object, propertyKey: string) => {
  Reflect.defineMetadata(
    "AUTHORIZATION",
    true,
    target.constructor,
    propertyKey,
  );
};
