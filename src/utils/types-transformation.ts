import { ObjectType, InputType, InterfaceType } from "../decorators";
import { ClassType } from "../interfaces";
import { getMetadataStorage } from "../metadata";

export function PartialType<T>(BaseClass: ClassType<T>): ClassType<Partial<T>> {
  class PartialClass {}
  InputType({ isAbstract: true })(PartialClass);
  ObjectType({ isAbstract: true })(PartialClass);
  InterfaceType({ isAbstract: true })(PartialClass);

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
  class RequiredClass {}
  InputType({ isAbstract: true })(RequiredClass);
  ObjectType({ isAbstract: true })(RequiredClass);
  InterfaceType({ isAbstract: true })(RequiredClass);

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
  class PickClass {}
  InputType({ isAbstract: true })(PickClass);
  ObjectType({ isAbstract: true })(PickClass);
  InterfaceType({ isAbstract: true })(PickClass);

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
  class OmitClass {}
  InputType({ isAbstract: true })(OmitClass);
  ObjectType({ isAbstract: true })(OmitClass);
  InterfaceType({ isAbstract: true })(OmitClass);

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
