---
title: Authorization
id: version-0.17.0-authorization
original_id: authorization
---

Authorization is a core feature used in almost all APIs. Sometimes we want to restrict access to some actions or reading some data only for specific group of users.

In express.js (and other Node.js framework) we use middlewares for this, like `passport.js` or the custom ones. However in GraphQL's resolvers architecture we don't have middlewares so we have to imperatively call the auth checking function and manually passing context data in each resolver, which might be quite tedious work.

And that's why authorization is a first-class feature in `TypeGraphQL`!

## How to use?

At first, you need to use `@Authorized` decorator as a guard on a field or a query/mutation.
Example object type's fields guards:

```typescript
@ObjectType()
class MyObject {
  @Field()
  publicField: string;

  @Authorized()
  @Field()
  authorizedField: string;

  @Authorized("ADMIN")
  @Field()
  adminField: string;

  @Authorized(["ADMIN", "MODERATOR"])
  @Field({ nullable: true })
  hiddenField?: string;
}
```

You can leave the `@Authorized` decorator brackets empty or you can specify the roles that the user needs to have to get access to the field, query or mutation.
By default the roles are `string` but you can change it easily as the decorator is generic - `@Authorized<number>(1, 7, 22)`.

This way authed users (regardless of theirs roles) could read only `publicField` or `authorizedField` from `MyObject` object. They will receive `null` when accessing `hiddenField` field and will receive error (that will propagate through the whole query tree looking for nullable field) for `adminField` when they don't satisfy roles constraints.

Sample query and mutations guards:

```typescript
@Resolver()
class MyResolver {
  @Query()
  publicQuery(): MyObject {
    return {
      publicField: "Some public data",
      authorizedField: "Data only for logged users",
      adminField: "Top secret info for admin",
    };
  }

  @Authorized()
  @Query()
  authedQuery(): string {
    return "Only for authed users!";
  }

  @Authorized("ADMIN", "MODERATOR")
  @Mutation()
  adminMutation(): string {
    return "You are an admin/moderator, you can safely drop database ;)";
  }
}
```

Authed users (regardless of theirs roles) will be able to read data from `publicQuery` and `authedQuery` but will receive error trying to perform `adminMutation` when their roles doesn't include `ADMIN` or `MODERATOR`.

In next step, you need to create your auth checker function. Its implementation may depends on your business logic:

```typescript
export const customAuthChecker: AuthChecker<ContextType> = (
  { root, args, context, info },
  roles,
) => {
  // here you can read user from context
  // and check his permission in db against `roles` argument
  // that comes from `@Authorized`, eg. ["ADMIN", "MODERATOR"]

  return true; // or false if access denied
};
```

The second argument of `AuthChecker` generic type is `RoleType` - use it together with `@Authorized` decorator generic type.

The last step is to register the function while building the schema:

```typescript
import { customAuthChecker } from "../auth/custom-auth-checker.ts";

const schema = await buildSchema({
  resolvers: [MyResolver],
  // here we register the auth checking function
  // or defining it inline
  authChecker: customAuthChecker,
});
```

And it's done! 😉

If you need silent auth guards and you don't want to return auth errors to users, you can set `authMode` property of `buildSchema` config object to `"null"`:

```typescript
const schema = await buildSchema({
  resolvers: ["./**/*.resolver.ts"],
  authChecker: customAuthChecker,
  authMode: "null",
});
```

It will then return `null` instead of throwing authorization error.

## Recipes

You can also use `TypeGraphQL` with JWT authentication. Example using `apollo-server-express`:

```typescript
import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
import * as jwt from "express-jwt";

import { schema } from "../example/above";

const app = express();
const path = "/graphql";

// Create a GraphQL server
const server = new ApolloServer({
  schema,
  context: ({ req }) => {
    const context = {
      req,
      user: req.user, // `req.user` comes from `express-jwt`
    };
    return context;
  },
});

// Mount a jwt or other authentication middleware that is run before the GraphQL execution
app.use(
  path,
  jwt({
    secret: "TypeGraphQL",
    credentialsRequired: false,
  }),
);

// Apply the GraphQL server middleware
server.applyMiddleware({ app, path });

// Launch the express server
app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`),
);
```

Then you can use standard, token based authorization in HTTP header like in classic REST API and take advantages of `TypeGraphQL` authorization mechanism.

## Example

You can see how this works together in the [simple real life example](https://github.com/MichalLytek/type-graphql/tree/v0.17.0/examples/authorization).
