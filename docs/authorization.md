# Authorization
Authorization is a core feature used in almost all APIs. Sometimes we want to restrict access to some actions or reading some data only for specific group of users.

In express.js (and other Node.js framework) we use middlewares for this, like `passport.js` or the custom ones. However in GraphQL's resolvers architecture we don't have middlewares so we have to imperatively call the auth checking function and manually passing context data in each resolver, which might be quite tedious work.

And that's why authorization is a first-class feature in `TypeGraphQL`!

## How to use?
At first, you need to use `@Authorized` decorator as a guard on a field or a query/mutation.
Example object type's fields guards:
```ts
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

You can leave the `@Authorized` decorator brackets empty or you can specify the roles that the user needs to have to get acccess to the field, query or mutation.

This way authed users (regardless of theirs roles) could read only `publicField` or `authorizedField` from `MyObject` object. They will receive `null` when accessing `hiddenField` field and will receive error (that will propagate through the whole query tree looking for nullable field) for `adminField` when they don't satisfy roles constraints.

Sample query and mutations guards:
```ts
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
```ts
export const customAuthChecker: AuthChecker<ContextType> = 
  ({ root, args, context, info }, roles) => {
    // here you can read user from context
    // and check his permision in db against `roles` argument
    // that comes from `@Authorized`, eg. ["ADMIN", "MODERATOR"]

    return true; // or false if access denied
  }
```

The last step is to register the function while building the schema:
```ts
import { customAuthChecker } from "../auth/custom-auth-checker.ts";

const schema = await buildSchema({
  resolvers: [MyResolver],
  // here we register the auth checking function
  // or defining it inline
  authChecker: customAuthChecker, 
})
```
And it's done! :wink:

## Recipes

You can also use `TypeGraphQL` with `express.js` and leverage benefits of JWT authentication:
```ts
import * as jwt from "express-jwt";
import { schema } from "../example/above";

// create express-based gql endpoint
const app = express();
app.use(
  "/graphql",
  // register JWT middleware
  jwt({ secret: "TypeGraphQL", credentialsRequired: false }),
  graphqlHTTP(req => {
    // here we're creating GraphQL context from HTTP request
    const context = {
      req,
      user: req.user, // `req.user` comes from `express-jwt`
    };
    return {
      schema,
      context,
    };
  }),
);
```
Then you can use standard, token based authorization in HTTP header like in classic REST API and take advantages of `TypeGraphQL` authorization mechanism.

## Example
You can see how this works together in the [simple real life example](https://github.com/19majkel94/type-graphql/tree/master/examples/06-authorization).
