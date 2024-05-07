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
}
