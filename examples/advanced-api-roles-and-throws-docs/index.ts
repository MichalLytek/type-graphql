import 'reflect-metadata'
import {
  Authorized,
  buildSchema,
  Ctx,
  Directive,
  Field,
  FieldResolver,
  ForbiddenError,
  ObjectType,
  Query,
  Resolver
} from '../../src'
import { FieldMetadata } from '../../src/metadata/definitions'
import { GraphQLSchema, GraphQLDirective, DirectiveLocation } from 'graphql'
import { ApolloError } from 'apollo-server'
import { mapSchema, MapperKind, printSchemaWithDirectives } from '@graphql-tools/utils'

@ObjectType()
class SampleObject {
  @Field()
  normalField: string

  @Field()
  @Authorized()
  authedField: string

  @Field({ nullable: true })
  @Authorized()
  nullableAuthedField: string

  @Field({ description: 'random field description' })
  @Authorized('ADMIN')
  adminField: string

  @Field()
  normalResolvedField: string

  @Field()
  authedResolvedField: string

  @Field()
  @Authorized()
  inlineAuthedResolvedField: string
}

@Resolver(of => SampleObject)
class SampleResolver {
  @Query()
  normalQuery(): boolean {
    return true
  }

  @Query({ description: 'random query description' })
  normalObjectQuery(): SampleObject {
    return {
      normalField: 'normalField',
      authedField: 'authedField',
      adminField: 'adminField'
    } as SampleObject
  }

  @Query()
  @Authorized()
  authedQuery(@Ctx() ctx: any): boolean {
    return ctx.user !== undefined
  }

  @Query(type => Boolean, { nullable: true })
  @Authorized()
  nullableAuthedQuery(@Ctx() ctx: any): boolean {
    return true
  }

  @Query()
  @Directive(`@throws(errors: ["${[ApolloError.name, ForbiddenError.name].join(`", "`)}"])`)
  @Authorized('ADMIN')
  adminQuery(@Ctx() ctx: any): boolean {
    return ctx.user !== undefined
  }

  @Query()
  @Authorized(['ADMIN', 'REGULAR'])
  adminOrRegularQuery(@Ctx() ctx: any): boolean {
    return ctx.user !== undefined
  }

  @Query()
  @Authorized('ADMIN', 'REGULAR')
  adminOrRegularRestQuery(@Ctx() ctx: any): boolean {
    return ctx.user !== undefined
  }

  @FieldResolver()
  normalResolvedField(): string {
    return 'normalResolvedField'
  }

  @FieldResolver()
  @Authorized()
  authedResolvedField(): string {
    return 'authedResolvedField'
  }

  @FieldResolver()
  inlineAuthedResolvedField(): string {
    return 'inlineAuthedResolvedField'
  }
}

// This function takes in a schema and adds upper-casing logic
// to every resolver for an object field that has a directive with
// the specified name (we're using `upper`)
function throwsDirectiveTransformer(schema: GraphQLSchema, directiveName: string): GraphQLSchema {
  return mapSchema(schema, {
    // Executes once for each object field in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig: any) => {
      return fieldConfig
    }
  })
}

export const throwsDirective = new GraphQLDirective({
  name: 'throws',
  locations: [DirectiveLocation.OBJECT, DirectiveLocation.FIELD_DEFINITION]
})

async function main(): Promise<any> {
  const sampleResolver = SampleResolver
  const localSchema = await buildSchema({
    resolvers: [sampleResolver],
    directives: [throwsDirective],
    authChecker: () => true,
    transformDescription: (metadata: FieldMetadata) => {
      if (!metadata.roles) {
        return metadata.description
      }
      if (!metadata.description) {
        metadata.description = ''
      }
      if (Array.isArray(metadata.roles) && metadata.roles.length) {
        return `${metadata.description}\nAuthorized roles: ${metadata.roles.join(', ')}`.trim()
      }
      return `${metadata.description}\nAuthorization required`.trim()
    }
  })

  const localSchemaW = throwsDirectiveTransformer(localSchema, 'throws')

  console.log(printSchemaWithDirectives(localSchemaW))
}

main().catch(console.error)
