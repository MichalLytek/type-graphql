import { Field, ObjectType } from '../../../../src'

import { CircularRef1 } from './CircularRef1'

let hasModuleFinishedInitialLoad = false

@ObjectType()
export class CircularRef2 {
  @Field(type => {
    if (!hasModuleFinishedInitialLoad) {
      throw new Error('Field type function was called synchronously during module load')
    }
    return [CircularRef1]
  })
  ref1Field: any[]
}

hasModuleFinishedInitialLoad = true
