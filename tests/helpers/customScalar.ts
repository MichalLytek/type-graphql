import { GraphQLScalarType } from 'graphql'

export const CustomScalar = new GraphQLScalarType({
  name: 'Custom',
  parseLiteral: () => 'TypeGraphQL parseLiteral',
  parseValue: () => 'TypeGraphQL parseValue',
  serialize: () => 'TypeGraphQL serialize'
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class CustomType {}

export const ObjectScalar = new GraphQLScalarType({
  name: 'ObjectScalar',
  parseLiteral: () => ({
    value: 'TypeGraphQL parseLiteral'
  }),
  parseValue: () => ({
    value: 'TypeGraphQL parseValue'
  }),
  serialize: (obj: any) => obj.value
})
