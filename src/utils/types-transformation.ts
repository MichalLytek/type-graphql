import { ObjectType, InputType, InterfaceType } from "../decorators";
import {
  inheritValidationMetadata,
  inheritTransformationMetadata,
  applyIsOptionalDecorator,
} from "../helpers/inherit-metedata";
import { ClassType } from "../interfaces";
import { getMetadataStorage } from "../metadata";

export function PartialType<T>(BaseClass: ClassType<T>): ClassType<Partial<T>> {
  const PartialClass = abstractClass();
  inheritValidationMetadata(BaseClass, PartialClass);
  inheritTransformationMetadata(BaseClass, PartialClass);

  const fields = getMetadataStorage().fields.filter(
    f => f.target === BaseClass || BaseClass.prototype instanceof f.target,
  );

  fields.forEach(field => {
    getMetadataStorage().collectClassFieldMetadata({
      ...field,
      typeOptions: { ...field.typeOptions, nullable: true },
      target: PartialClass,
    });
    applyIsOptionalDecorator(PartialClass, field.name);
  });

  return PartialClass as ClassType<Partial<T>>;
}

export function RequiredType<T>(BaseClass: ClassType<T>): ClassType<Required<T>> {
  const RequiredClass = abstractClass();
  inheritValidationMetadata(BaseClass, RequiredClass);
  inheritTransformationMetadata(BaseClass, RequiredClass);

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

  const isInheritedPredicate = (propertyKey: string) => pickFields.includes(propertyKey as K);
  inheritValidationMetadata(BaseClass, PickClass, isInheritedPredicate);
  inheritTransformationMetadata(BaseClass, PickClass, isInheritedPredicate);

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

  const isInheritedPredicate = (propertyKey: string) => !omitFields.includes(propertyKey as K);
  inheritValidationMetadata(BaseClass, OmitClass, isInheritedPredicate);
  inheritTransformationMetadata(BaseClass, OmitClass, isInheritedPredicate);

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
  inheritValidationMetadata(BaseClassA, IntersectionClass);
  inheritTransformationMetadata(BaseClassA, IntersectionClass);
  inheritValidationMetadata(BaseClassB, IntersectionClass);
  inheritTransformationMetadata(BaseClassB, IntersectionClass);

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
