import { GraphQLError } from 'graphql'

export class GeneratingSchemaError extends Error {
  details: readonly GraphQLError[]

  constructor(details: readonly GraphQLError[]) {
    const detailsStr = details.map(it => it.message).join('\n ')
    const errorMessage = `Some errors occurred while generating GraphQL schema:\n  ${detailsStr}\nPlease check the 'details' property of the error to get more detailed info.`

    super(errorMessage)
    Object.setPrototypeOf(this, new.target.prototype)

    this.details = details
  }
}
