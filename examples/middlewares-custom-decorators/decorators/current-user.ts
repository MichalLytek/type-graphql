import { createParamDecorator } from '../../../src'
import { Context } from '../context'

export default function CurrentUser(): ParameterDecorator {
  return createParamDecorator<Context>(({ context }) => context.currentUser)
}
