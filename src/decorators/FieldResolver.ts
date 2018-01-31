import { MetadataStorage } from "../metadata/metadata-storage";

export function FieldResolver(): MethodDecorator {
  return (prototype, propertyKey) => {
    const methodName = propertyKey as keyof typeof prototype;
    MetadataStorage.registerFieldResolver({
      kind: "external",
      methodName,
      target: prototype.constructor,
      handler: prototype[methodName],
    });
  };
}
