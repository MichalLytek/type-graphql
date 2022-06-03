// Inspired by @nestjs/mapped-types
import { ClassType } from "../interfaces";

export function applyIsOptionalDecorator(targetClass: Function, propertyKey: string) {
  if (!isClassValidatorAvailable()) {
    return;
  }
  const classValidator: typeof import("class-validator") = require("class-validator");
  const decoratorFactory = classValidator.IsOptional();
  decoratorFactory(targetClass.prototype, propertyKey);
}

export function inheritValidationMetadata(
  parentClass: ClassType<any>,
  targetClass: Function,
  isPropertyInherited?: (key: string) => boolean,
) {
  if (!isClassValidatorAvailable()) {
    return;
  }
  try {
    const classValidator: typeof import("class-validator") = require("class-validator");
    const metadataStorage: import("class-validator").MetadataStorage = (classValidator as any)
      .getMetadataStorage
      ? (classValidator as any).getMetadataStorage()
      : classValidator.getFromContainer(classValidator.MetadataStorage);

    const getTargetValidationMetadatasArgs = [parentClass, null!, false, false];
    const targetMetadata: ReturnType<
      typeof metadataStorage.getTargetValidationMetadatas
    > = (metadataStorage.getTargetValidationMetadatas as Function)(
      ...getTargetValidationMetadatasArgs,
    );
    targetMetadata
      .filter(({ propertyName }) => !isPropertyInherited || isPropertyInherited(propertyName))
      .map(value => {
        const originalType = Reflect.getMetadata(
          "design:type",
          parentClass.prototype,
          value.propertyName,
        );
        if (originalType) {
          // @ts-ignore
          Reflect.defineMetadata(
            "design:type",
            originalType,
            targetClass.prototype,
            value.propertyName,
          );
        }

        metadataStorage.addValidationMetadata({
          ...value,
          target: targetClass,
        });
        return value.propertyName;
      });
  } catch (err) {
    if (err.code !== "EEXIST") {
      throw err;
    }
  }
}

type TransformMetadataKey =
  | "_excludeMetadatas"
  | "_exposeMetadatas"
  | "_typeMetadatas"
  | "_transformMetadatas";

export function inheritTransformationMetadata(
  parentClass: ClassType<any>,
  targetClass: Function,
  isPropertyInherited?: (key: string) => boolean,
) {
  if (!isClassTransformerAvailable()) {
    return;
  }
  try {
    const transformMetadataKeys: TransformMetadataKey[] = [
      "_excludeMetadatas",
      "_exposeMetadatas",
      "_transformMetadatas",
      "_typeMetadatas",
    ];
    transformMetadataKeys.forEach(key =>
      inheritTransformerMetadata(key, parentClass, targetClass, isPropertyInherited),
    );
  } catch (err) {
    if (err.code !== "EEXIST") {
      throw err;
    }
  }
}

function inheritTransformerMetadata(
  key: TransformMetadataKey,
  parentClass: ClassType<any>,
  targetClass: Function,
  isPropertyInherited?: (key: string) => boolean,
) {
  let classTransformer: any;
  try {
    /** "class-transformer" >= v0.3.x */
    classTransformer = require("class-transformer/cjs/storage");
  } catch {
    /** "class-transformer" <= v0.3.x */
    classTransformer = require("class-transformer/storage");
  }
  const metadataStorage /*: typeof import('class-transformer/types/storage').defaultMetadataStorage */ =
    classTransformer.defaultMetadataStorage;

  while (parentClass && parentClass !== Object) {
    if (metadataStorage[key].has(parentClass)) {
      const metadataMap = metadataStorage[key] as Map<Function, Map<string, any>>;
      const parentMetadata = metadataMap.get(parentClass);

      const targetMetadataEntries: Iterable<[string, any]> = Array.from(parentMetadata!.entries())
        .filter(([keyInEntries]) => !isPropertyInherited || isPropertyInherited(keyInEntries))
        .map(([keyInEntries, metadata]) => {
          if (Array.isArray(metadata)) {
            // "_transformMetadatas" is an array of elements
            const targetMetadata = metadata.map(item => ({
              ...item,
              target: targetClass,
            }));
            return [keyInEntries, targetMetadata];
          }
          return [keyInEntries, { ...metadata, target: targetClass }];
        });

      if (metadataMap.has(targetClass)) {
        const existingRules = metadataMap.get(targetClass)!.entries();
        metadataMap.set(targetClass, new Map([...existingRules, ...targetMetadataEntries]));
      } else {
        metadataMap.set(targetClass, new Map(targetMetadataEntries));
      }
    }
    parentClass = Object.getPrototypeOf(parentClass);
  }
}

function isClassValidatorAvailable() {
  try {
    require("class-validator");
    return true;
  } catch {
    return false;
  }
}

function isClassTransformerAvailable() {
  try {
    require("class-transformer");
    return true;
  } catch {
    return false;
  }
}

export function inheritPropertyInitializers(
  target: Record<string, any>,
  sourceClass: ClassType<any>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isPropertyInherited = (key: string) => true,
) {
  try {
    const tempInstance = new sourceClass();
    const propertyNames = Object.getOwnPropertyNames(tempInstance);

    propertyNames
      .filter(
        propertyName =>
          typeof tempInstance[propertyName] !== "undefined" &&
          typeof target[propertyName] === "undefined",
      )
      .filter(propertyName => isPropertyInherited(propertyName))
      .forEach(propertyName => {
        target[propertyName] = tempInstance[propertyName];
      });
  } catch (err) {
    if (err.code !== "EEXIST") {
      throw err;
    }
  }
}
