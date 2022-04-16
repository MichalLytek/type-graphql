import { getMetadataStorage } from '../metadata/getMetadataStorage'
import { AbstractClassOptions, ClassTypeResolver } from './types'
import { ClassType } from '../interfaces'

export function Resolver(): ClassDecorator
export function Resolver(options: AbstractClassOptions): ClassDecorator
export function Resolver(typeFunc: ClassTypeResolver, options?: AbstractClassOptions): ClassDecorator
export function Resolver(objectType: ClassType, options?: AbstractClassOptions): ClassDecorator
export function Resolver(
  objectTypeOrTypeFuncOrMaybeOptions?: Function | AbstractClassOptions,
  maybeOptions?: AbstractClassOptions
): ClassDecorator {
  const objectTypeOrTypeFunc: Function | undefined =
    typeof objectTypeOrTypeFuncOrMaybeOptions === 'function' ? objectTypeOrTypeFuncOrMaybeOptions : undefined
  const options: AbstractClassOptions =
    (typeof objectTypeOrTypeFuncOrMaybeOptions === 'function' ? maybeOptions : objectTypeOrTypeFuncOrMaybeOptions) || {}

  return target => {
    const getObjectType = objectTypeOrTypeFunc
      ? objectTypeOrTypeFunc.prototype
        ? () => objectTypeOrTypeFunc as ClassType
        : (objectTypeOrTypeFunc as ClassTypeResolver)
      : () => {
          throw new Error(`No provided object type in '@Resolver' decorator for class '${target.name}!'`)
        }
    getMetadataStorage().collectResolverClassMetadata({
      target,
      getObjectType,
      isAbstract: options.isAbstract || false
    })
  }
}
