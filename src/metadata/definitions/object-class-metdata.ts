import { ClassMetadata } from './class-metadata'

export interface ObjectClassMetadata extends ClassMetadata {
  interfaceClasses: Function[] | undefined
}
