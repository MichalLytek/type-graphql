import { ObjectType, InputType, InterfaceType } from "../decorators";
import { ClassType } from "../interfaces";
import { getMetadataStorage } from "../metadata";

export function PartialType<T>(BaseClass: ClassType<T>): ClassType<Partial<T>> {
  const PartialClass = abstractClass();

  const fields = getMetadataStorage().fields.filter(
    f => f.target === BaseClass || BaseClass.prototype instanceof f.target,
  );

  fields.forEach(field => {
    getMetadataStorage().collectClassFieldMetadata({
      ...field,
      typeOptions: { ...field.typeOptions, nullable: true },
      target: PartialClass,
    });
  });

  return PartialClass as ClassType<Partial<T>>;
}

export function RequiredType<T>(BaseClass: ClassType<T>): ClassType<Required<T>> {
  const RequiredClass = abstractClass();

  const fields = getMetadataStorage().fields.filter(
    f => f.target === BaseClass || BaseClass.prototype instanceof f.target,
  );

  fields.forEach(field => {
    getMetadataStorage().collectClassFieldMetadata({
      ...field,
      typeOptions: { ...field.typeOptions, nullable: false },
      target: RequiredClass,
    });
  });
  return RequiredClass as ClassType<Required<T>>;
}

export function PickType<T, K extends keyof T>(
  BaseClass: ClassType<T>,
  ...pickFields: K[]
): ClassType<Pick<T, K>> {
  const PickClass = abstractClass();

  const fields = getMetadataStorage().fields.filter(
    f =>
      (f.target === BaseClass || BaseClass.prototype instanceof f.target) &&
      pickFields.includes(f.name as K),
  );

  fields.forEach(field => {
    getMetadataStorage().collectClassFieldMetadata({
      ...field,
      target: PickClass,
    });
  });
  return PickClass as ClassType<Pick<T, K>>;
}

export function OmitType<T, K extends keyof T>(
  BaseClass: ClassType<T>,
  ...omitFields: K[]
): ClassType<Omit<T, K>> {
  const OmitClass = abstractClass();

  const fields = getMetadataStorage().fields.filter(
    f =>
      (f.target === BaseClass || BaseClass.prototype instanceof f.target) &&
      !omitFields.includes(f.name as K),
  );

  fields.forEach(field => {
    getMetadataStorage().collectClassFieldMetadata({
      ...field,
      target: OmitClass,
    });
  });
  return OmitClass as ClassType<Omit<T, K>>;
}

export function IntersectionType<A, B>(BaseClassA: ClassType<A>, BaseClassB: ClassType<B>) {
  const IntersectionClass = abstractClass();

  const fields = getMetadataStorage().fields.filter(
    f =>
      f.target === BaseClassB ||
      BaseClassB.prototype instanceof f.target ||
      f.target === BaseClassA ||
      BaseClassA.prototype instanceof f.target,
  );

  fields.forEach(field => {
    getMetadataStorage().collectClassFieldMetadata({
      ...field,
      target: IntersectionClass,
    });
  });

  return IntersectionClass as ClassType<A & B>;
}

function abstractClass() {
  class AbstractClass {}
  InputType({ isAbstract: true })(AbstractClass);
  ObjectType({ isAbstract: true })(AbstractClass);
  InterfaceType({ isAbstract: true })(AbstractClass);
  getMetadataStorage().collectArgsMetadata({
    name: AbstractClass.name,
    isAbstract: true,
    target: AbstractClass,
  });
  return AbstractClass;
}
