import {
  ObjectType,
  Field,
  Resolver,
  Query,
  buildSchema,
  ID,
  FieldResolver,
  Root,
  Directive,
} from "../../../src";
import federationDirectives from "@apollo/federation/dist/directives";
import { buildFederatedSchema } from "@apollo/federation";
import { specifiedDirectives } from "graphql";
import { ApolloServer } from "apollo-server";
import { plainToClass } from "class-transformer";
import { getMetadataStorage } from "../../../src/metadata/getMetadataStorage";

const buildTypeSchema = async () => {
  getMetadataStorage().clear();

  @ObjectType()
  @Directive("key", { fields: "id" })
  class User {
    @Field(() => ID)
    id: string;

    @Field()
    username: string;

    @Field()
    name: string;

    @Field()
    birthDate: string;
  }

  const users: User[] = plainToClass(User, [
    {
      id: "1",
      name: "Ada Lovelace",
      birthDate: "1815-12-10",
      username: "@ada",
    },
    {
      id: "2",
      name: "Alan Turing",
      birthDate: "1912-06-23",
      username: "@complete",
    },
  ]);

  @Resolver(() => User)
  class AccountsResolver {
    @Query(() => User)
    me(): User {
      return users[0];
    }

    @FieldResolver(() => User, { nullable: true })
    async __resolveReference(@Root() reference: Partial<User>): Promise<User | undefined> {
      return users.find(u => u.id === reference.id);
    }
  }

  return await buildSchema({
    resolvers: [AccountsResolver],
    directives: [...specifiedDirectives, ...federationDirectives],
    skipCheck: true,
  });
};

export async function listen(port: number): Promise<string> {
  const schema = buildFederatedSchema(await buildTypeSchema());

  const server = new ApolloServer({
    schema,
    tracing: false,
    playground: true,
  });

  const { url } = await server.listen({ port });

  console.log(`🚀 Accounts service ready at ${url}`);

  return url;
}
