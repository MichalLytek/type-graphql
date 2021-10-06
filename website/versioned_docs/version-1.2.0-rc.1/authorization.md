---
title: Authorization
id: version-1.2.0-rc.1-authorization
original_id: authorization
---

Authorization is a core feature used in almost all APIs. Sometimes we want to restrict data access or actions for a specific group of users.

In express.js (and other Node.js frameworks) we use middleware for this, like `passport.js` or the custom ones. However, in GraphQL's resolver architecture we don't have middleware so we have to imperatively call the auth checking function and manually pass context data to each resolver, which might be a bit tedious.

That's why authorization is a first-class feature in `TypeGraphQL`!

## How to use

First, we need to use the `@Authorized` decorator as a guard on a field, query or mutation.
Example object type field guards:

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

We can leave the `@Authorized` decorator brackets empty or we can specify the role/roles that the user needs to possess in order to get access to the field, query or mutation.
By default the roles are of type `string` but they can easily be changed as the decorator is generic - `@Authorized<number>(1, 7, 22)`.

Thus, authorized users (regardless of their roles) can only read the `publicField` or the `authorizedField` from the `MyObject` object. They will receive `null` when accessing the `hiddenField` field and will receive an error (that will propagate through the whole query tree looking for a nullable field) for the `adminField` when they don't satisfy the role constraints.

Sample query and mutation guards:

```typescript
@Resolver()
class MyResolver {
  @Query()
  publicQuery(): MyObject {
    return {
      publicField: "Some public data",
      authorizedField: "Data for logged users only",
      adminField: "Top secret info for admin",
    };
  }

  @Authorized()
  @Query()
  authedQuery(): string {
    return "Authorized users only!";
  }

  @Authorized("ADMIN", "MODERATOR")
  @Mutation()
  adminMutation(): string {
    return "You are an admin/moderator, you can safely drop the database ;)";
  }
}
```

Authorized users (regardless of their roles) will be able to read data from the `publicQuery` and the `authedQuery` queries, but will receive an error when trying to perform the `adminMutation` when their roles don't include `ADMIN` or `MODERATOR`.

Next, we need to create our auth checker function. Its implementation may depend on our business logic:

```typescript
export const customAuthChecker: AuthChecker<ContextType> = (
  { root, args, context, info },
  roles,
) => {
  // here we can read the user from context
  // and check his permission in the db against the `roles` argument
  // that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]

  return true; // or false if access is denied
};
```

The second argument of the `AuthChecker` generic type is `RoleType` - used together with the `@Authorized` decorator generic type.

Auth checker can be also defined as a class - this way we can leverage the dependency injection mechanism:

```ts
export class CustomAuthChecker implements AuthCheckerInterface<ContextType> {
  // inject dependency
  constructor(private readonly userRepository: Repository<User>) {}

  check({ root, args, context, info }: ResolverData<ContextType>, roles: string[]) {
    const userId = getUserIdFromToken(context.token);
    // use injected service
    const user = this.userRepository.getById(userId);

    // custom logic here, e.g.:
    return user % 2 === 0;
  }
}
```

The last step is to register the function or class while building the schema:

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

If we need silent auth guards and don't want to return authorization errors to users, we can set the `authMode` property of the `buildSchema` config object to `"null"`:

```typescript
const schema = await buildSchema({
  resolvers: ["./**/*.resolver.ts"],
  authChecker: customAuthChecker,
  authMode: "null",
});
```

It will then return `null` instead of throwing an authorization error.

## Recipes

We can also use `TypeGraphQL` with JWT authentication.
Here's an example using `apollo-server-express`:

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

Then we can use standard, token based authorization in the HTTP header like in classic REST APIs and take advantage of the `TypeGraphQL` authorization mechanism.

## Example

See how this works in the [simple real life example](https://github.com/MichalLytek/type-graphql/tree/master/examples/authorization).
