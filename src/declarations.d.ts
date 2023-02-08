// definitions copied from `reflect-metadata` to satisfy gulp-typescript
declare namespace Reflect {
  function getMetadata(metadataKey: any, target: Object): any;
  function getMetadata(metadataKey: any, target: Object, propertyKey: string | symbol): any;
  function decorate(decorators: ClassDecorator[], target: Function): Function;
  function decorate(
    decorators: Array<PropertyDecorator | MethodDecorator>,
    target: Object,
    propertyKey: string | symbol,
    attributes?: PropertyDescriptor,
  ): PropertyDescriptor;
  function metadata(
    metadataKey: any,
    metadataValue: any,
  ): {
    (target: Function): void;
    (target: Object, propertyKey: string | symbol): void;
  };
}
