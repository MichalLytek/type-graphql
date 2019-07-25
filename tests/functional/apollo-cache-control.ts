// tslint:disable:member-ordering
import "reflect-metadata";
import { Field, Resolver, Query, Directive, buildSchema, ObjectType } from "../../src";
import { getMetadataStorage } from "../../src/metadata/getMetadataStorage";
import { ApolloServer } from "apollo-server";

describe("Apollo @cacheControl", () => {
  beforeAll(async () => {
    getMetadataStorage().clear();
  });

  it("works with ApolloServer and @cacheControl", async () => {
    @ObjectType()
    @Directive("@cacheControl(maxAge: 240)")
    class Post {
      @Field()
      id: number = 1;

      @Field()
      @Directive("@cacheControl(maxAge: 30)")
      votes: number = 1;

      @Field(() => [Comment])
      comments: Comment[] = [new Comment()];

      @Field()
      @Directive("@cacheControl(scope: PRIVATE)")
      readByCurrentUser: boolean = true;
    }

    @ObjectType()
    @Directive("@cacheControl(maxAge: 1000)")
    class Comment {
      @Field()
      comment: string = "comment";
    }

    @Resolver()
    class PostsResolver {
      @Query(() => Post)
      @Directive("@cacheControl(maxAge: 10)")
      latestPost(): Post {
        return new Post();
      }
    }

    const server = new ApolloServer({
      schema: await buildSchema({ resolvers: [PostsResolver] }),
      cacheControl: true,
    });

    const { extensions } = await server.executeOperation({
      query: `query {
          latestPost {
            id
            votes
            comments { comment }
            readByCurrentUser
          }
        }`,
    });

    expect(extensions).toBeDefined();
    expect(extensions).toHaveProperty("cacheControl");
    expect(extensions!.cacheControl).toEqual({
      version: 1,
      hints: [
        {
          maxAge: 10,
          path: ["latestPost"],
        },
        {
          maxAge: 30,
          path: ["latestPost", "votes"],
        },
        {
          maxAge: 1000,
          path: ["latestPost", "comments"],
        },
        {
          path: ["latestPost", "readByCurrentUser"],
          scope: "PRIVATE",
        },
      ],
    });
  });
});
