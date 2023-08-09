// Copied from 'reflect-metadata' (https://github.com/rbuckton/reflect-metadata/blob/master/index.d.ts)

/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABILITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

declare namespace Reflect {
  /**
   * Applies a set of decorators to a target object.
   * @param decorators - An array of decorators.
   * @param target - The target object.
   * @returns The result of applying the provided decorators.
   * @remarks Decorators are applied in reverse order of their positions in the array.
   * @example
   *
   *     class Example \{ \}
   *
   *     // constructor
   *     Example = Reflect.decorate(decoratorsArray, Example);
   *
   */
  function decorate(decorators: ClassDecorator[], target: Function): Function;
  /**
   * Applies a set of decorators to a property of a target object.
   * @param decorators - An array of decorators.
   * @param target - The target object.
   * @param propertyKey - The property key to decorate.
   * @param attributes - A property descriptor.
   * @remarks Decorators are applied in reverse order.
   * @example
   *
   *     class Example \{
   *         // property declarations are not part of ES6, though they are valid in TypeScript:
   *         // static staticProperty;
   *         // property;
   *
   *         static staticMethod() \{ \}
   *         method() \{ \}
   *     \}
   *
   *     // property (on constructor)
   *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
   *
   *     // property (on prototype)
   *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
   *
   *     // method (on constructor)
   *     Object.defineProperty(Example, "staticMethod",
   *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
   *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
   *
   *     // method (on prototype)
   *     Object.defineProperty(Example.prototype, "method",
   *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
   *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
   *
   */
  function decorate(
    decorators: Array<PropertyDecorator | MethodDecorator>,
    target: object,
    propertyKey: string | symbol,
    attributes?: PropertyDescriptor,
  ): PropertyDescriptor;
  /**
   * A default metadata decorator factory that can be used on a class, class member, or parameter.
   * @param metadataKey - The key for the metadata entry.
   * @param metadataValue - The value for the metadata entry.
   * @returns A decorator function.
   * @remarks
   * If `metadataKey` is already defined for the target and target key, the
   * metadataValue for that key will be overwritten.
   * @example
   *
   *     // constructor
   *     \@Reflect.metadata(key, value)
   *     class Example \{
   *     \}
   *
   *     // property (on constructor, TypeScript only)
   *     class Example \{
   *         \@Reflect.metadata(key, value)
   *         static staticProperty;
   *     \}
   *
   *     // property (on prototype, TypeScript only)
   *     class Example \{
   *         \@Reflect.metadata(key, value)
   *         property;
   *     \}
   *
   *     // method (on constructor)
   *     class Example \{
   *         \@Reflect.metadata(key, value)
   *         static staticMethod() \{ \}
   *     \}
   *
   *     // method (on prototype)
   *     class Example \{
   *         \@Reflect.metadata(key, value)
   *         method() \{ \}
   *     \}
   *
   */
  function metadata(
    metadataKey: any,
    metadataValue: any,
  ): {
    (target: Function): void;
    (target: object, propertyKey: string | symbol): void;
  };
  /**
   * Define a unique metadata entry on the target.
   * @param metadataKey - A key used to store and retrieve metadata.
   * @param metadataValue - A value that contains attached metadata.
   * @param target - The target object on which to define metadata.
   * @example
   *
   *     class Example \{
   *     \}
   *
   *     // constructor
   *     Reflect.defineMetadata("custom:annotation", options, Example);
   *
   *     // decorator factory as metadata-producing annotation.
   *     function MyAnnotation(options): ClassDecorator \{
   *         return target =\> Reflect.defineMetadata("custom:annotation", options, target);
   *     \}
   *
   */
  function defineMetadata(metadataKey: any, metadataValue: any, target: object): void;
  /**
   * Define a unique metadata entry on the target.
   * @param metadataKey - A key used to store and retrieve metadata.
   * @param metadataValue - A value that contains attached metadata.
   * @param target - The target object on which to define metadata.
   * @param propertyKey - The property key for the target.
   * @example
   *
   *     class Example \{
   *         // property declarations are not part of ES6, though they are valid in TypeScript:
   *         // static staticProperty;
   *         // property;
   *
   *         static staticMethod(p) \{ \}
   *         method(p) \{ \}
   *     \}
   *
   *     // property (on constructor)
   *     Reflect.defineMetadata("custom:annotation", Number, Example, "staticProperty");
   *
   *     // property (on prototype)
   *     Reflect.defineMetadata("custom:annotation", Number, Example.prototype, "property");
   *
   *     // method (on constructor)
   *     Reflect.defineMetadata("custom:annotation", Number, Example, "staticMethod");
   *
   *     // method (on prototype)
   *     Reflect.defineMetadata("custom:annotation", Number, Example.prototype, "method");
   *
   *     // decorator factory as metadata-producing annotation.
   *     function MyAnnotation(options): PropertyDecorator \{
   *         return (target, key) =\> Reflect.defineMetadata("custom:annotation", options, target, key);
   *     \}
   *
   */
  function defineMetadata(
    metadataKey: any,
    metadataValue: any,
    target: object,
    propertyKey: string | symbol,
  ): void;
  /**
   * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
   * @param metadataKey - A key used to store and retrieve metadata.
   * @param target - The target object on which the metadata is defined.
   * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
   * @example
   *
   *     class Example \{
   *     \}
   *
   *     // constructor
   *     result = Reflect.hasMetadata("custom:annotation", Example);
   *
   */
  function hasMetadata(metadataKey: any, target: object): boolean;
  /**
   * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
   * @param metadataKey - A key used to store and retrieve metadata.
   * @param target - The target object on which the metadata is defined.
   * @param propertyKey - The property key for the target.
   * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
   * @example
   *
   *     class Example \{
   *         // property declarations are not part of ES6, though they are valid in TypeScript:
   *         // static staticProperty;
   *         // property;
   *
   *         static staticMethod(p) \{ \}
   *         method(p) \{ \}
   *     \}
   *
   *     // property (on constructor)
   *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
   *
   *     // property (on prototype)
   *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
   *
   *     // method (on constructor)
   *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
   *
   *     // method (on prototype)
   *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
   *
   */
  function hasMetadata(metadataKey: any, target: object, propertyKey: string | symbol): boolean;
  /**
   * Gets a value indicating whether the target object has the provided metadata key defined.
   * @param metadataKey - A key used to store and retrieve metadata.
   * @param target - The target object on which the metadata is defined.
   * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
   * @example
   *
   *     class Example \{
   *     \}
   *
   *     // constructor
   *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
   *
   */
  function hasOwnMetadata(metadataKey: any, target: object): boolean;
  /**
   * Gets a value indicating whether the target object has the provided metadata key defined.
   * @param metadataKey - A key used to store and retrieve metadata.
   * @param target - The target object on which the metadata is defined.
   * @param propertyKey - The property key for the target.
   * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
   * @example
   *
   *     class Example \{
   *         // property declarations are not part of ES6, though they are valid in TypeScript:
   *         // static staticProperty;
   *         // property;
   *
   *         static staticMethod(p) \{ \}
   *         method(p) \{ \}
   *     \}
   *
   *     // property (on constructor)
   *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
   *
   *     // property (on prototype)
   *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
   *
   *     // method (on constructor)
   *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
   *
   *     // method (on prototype)
   *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
   *
   */
  function hasOwnMetadata(metadataKey: any, target: object, propertyKey: string | symbol): boolean;
  /**
   * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
   * @param metadataKey - A key used to store and retrieve metadata.
   * @param target - The target object on which the metadata is defined.
   * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
   * @example
   *
   *     class Example \{
   *     \}
   *
   *     // constructor
   *     result = Reflect.getMetadata("custom:annotation", Example);
   *
   */
  function getMetadata(metadataKey: any, target: object): any;
  /**
   * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
   * @param metadataKey - A key used to store and retrieve metadata.
   * @param target - The target object on which the metadata is defined.
   * @param propertyKey - The property key for the target.
   * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
   * @example
   *
   *     class Example \{
   *         // property declarations are not part of ES6, though they are valid in TypeScript:
   *         // static staticProperty;
   *         // property;
   *
   *         static staticMethod(p) \{ \}
   *         method(p) \{ \}
   *     \}
   *
   *     // property (on constructor)
   *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
   *
   *     // property (on prototype)
   *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
   *
   *     // method (on constructor)
   *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
   *
   *     // method (on prototype)
   *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
   *
   */
  function getMetadata(metadataKey: any, target: object, propertyKey: string | symbol): any;
  /**
   * Gets the metadata value for the provided metadata key on the target object.
   * @param metadataKey - A key used to store and retrieve metadata.
   * @param target - The target object on which the metadata is defined.
   * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
   * @example
   *
   *     class Example \{
   *     \}
   *
   *     // constructor
   *     result = Reflect.getOwnMetadata("custom:annotation", Example);
   *
   */
  function getOwnMetadata(metadataKey: any, target: object): any;
  /**
   * Gets the metadata value for the provided metadata key on the target object.
   * @param metadataKey - A key used to store and retrieve metadata.
   * @param target - The target object on which the metadata is defined.
   * @param propertyKey - The property key for the target.
   * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
   * @example
   *
   *     class Example \{
   *         // property declarations are not part of ES6, though they are valid in TypeScript:
   *         // static staticProperty;
   *         // property;
   *
   *         static staticMethod(p) \{ \}
   *         method(p) \{ \}
   *     \}
   *
   *     // property (on constructor)
   *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
   *
   *     // property (on prototype)
   *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
   *
   *     // method (on constructor)
   *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
   *
   *     // method (on prototype)
   *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
   *
   */
  function getOwnMetadata(metadataKey: any, target: object, propertyKey: string | symbol): any;
  /**
   * Gets the metadata keys defined on the target object or its prototype chain.
   * @param target - The target object on which the metadata is defined.
   * @returns An array of unique metadata keys.
   * @example
   *
   *     class Example \{
   *     \}
   *
   *     // constructor
   *     result = Reflect.getMetadataKeys(Example);
   *
   */
  function getMetadataKeys(target: object): any[];
  /**
   * Gets the metadata keys defined on the target object or its prototype chain.
   * @param target - The target object on which the metadata is defined.
   * @param propertyKey - The property key for the target.
   * @returns An array of unique metadata keys.
   * @example
   *
   *     class Example \{
   *         // property declarations are not part of ES6, though they are valid in TypeScript:
   *         // static staticProperty;
   *         // property;
   *
   *         static staticMethod(p) \{ \}
   *         method(p) \{ \}
   *     \}
   *
   *     // property (on constructor)
   *     result = Reflect.getMetadataKeys(Example, "staticProperty");
   *
   *     // property (on prototype)
   *     result = Reflect.getMetadataKeys(Example.prototype, "property");
   *
   *     // method (on constructor)
   *     result = Reflect.getMetadataKeys(Example, "staticMethod");
   *
   *     // method (on prototype)
   *     result = Reflect.getMetadataKeys(Example.prototype, "method");
   *
   */
  function getMetadataKeys(target: object, propertyKey: string | symbol): any[];
  /**
   * Gets the unique metadata keys defined on the target object.
   * @param target - The target object on which the metadata is defined.
   * @returns An array of unique metadata keys.
   * @example
   *
   *     class Example \{
   *     \}
   *
   *     // constructor
   *     result = Reflect.getOwnMetadataKeys(Example);
   *
   */
  function getOwnMetadataKeys(target: object): any[];
  /**
   * Gets the unique metadata keys defined on the target object.
   * @param target - The target object on which the metadata is defined.
   * @param propertyKey - The property key for the target.
   * @returns An array of unique metadata keys.
   * @example
   *
   *     class Example \{
   *         // property declarations are not part of ES6, though they are valid in TypeScript:
   *         // static staticProperty;
   *         // property;
   *
   *         static staticMethod(p) \{ \}
   *         method(p) \{ \}
   *     \}
   *
   *     // property (on constructor)
   *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
   *
   *     // property (on prototype)
   *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
   *
   *     // method (on constructor)
   *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
   *
   *     // method (on prototype)
   *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
   *
   */
  function getOwnMetadataKeys(target: object, propertyKey: string | symbol): any[];
  /**
   * Deletes the metadata entry from the target object with the provided key.
   * @param metadataKey - A key used to store and retrieve metadata.
   * @param target - The target object on which the metadata is defined.
   * @returns `true` if the metadata entry was found and deleted; otherwise, false.
   * @example
   *
   *     class Example \{
   *     \}
   *
   *     // constructor
   *     result = Reflect.deleteMetadata("custom:annotation", Example);
   *
   */
  function deleteMetadata(metadataKey: any, target: object): boolean;
  /**
   * Deletes the metadata entry from the target object with the provided key.
   * @param metadataKey - A key used to store and retrieve metadata.
   * @param target - The target object on which the metadata is defined.
   * @param propertyKey - The property key for the target.
   * @returns `true` if the metadata entry was found and deleted; otherwise, false.
   * @example
   *
   *     class Example \{
   *         // property declarations are not part of ES6, though they are valid in TypeScript:
   *         // static staticProperty;
   *         // property;
   *
   *         static staticMethod(p) \{ \}
   *         method(p) \{ \}
   *     \}
   *
   *     // property (on constructor)
   *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
   *
   *     // property (on prototype)
   *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
   *
   *     // method (on constructor)
   *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
   *
   *     // method (on prototype)
   *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
   *
   */
  function deleteMetadata(metadataKey: any, target: object, propertyKey: string | symbol): boolean;
}
