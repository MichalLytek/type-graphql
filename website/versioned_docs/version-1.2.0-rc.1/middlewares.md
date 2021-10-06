---
title: Middleware and guards
id: version-1.2.0-rc.1-middlewares
original_id: middlewares
---

Middleware are pieces of reusable code that can be easily attached to resolvers and fields. By using middleware we can extract the commonly used code from our resolvers and then declaratively attach it using a decorator or even registering it globally.

## Creating Middleware

### What is Middleware?

Middleware is a very powerful but somewhat complicated feature. Basically, middleware is a function that takes 2 arguments:

- resolver data - the same as resolvers (`root`, `args`, `context`, `info`)
- the `next` function - used to control the execution of the next middleware and the resolver to which it is attached

We may be familiar with how middleware works in [`express.js`](https://expressjs.com/en/guide/writing-middleware.html) but TypeGraphQL middleware is inspired by [`koa.js`](http://koajs.com/#application). The difference is that the `next` function returns a promise of the value of subsequent middleware and resolver execution from the stack.

This makes it easy to perform actions before or after resolver execution. So things like measuring execution time are simple to implement:

```typescript
export const ResolveTime: MiddlewareFn = async ({ info }, next) => {
  const start = Date.now();
  await next();
  const resolveTime = Date.now() - start;
  console.log(`${info.parentType.name}.${info.fieldName} [${resolveTime} ms]`);
};
```

### Intercepting the execution result

Middleware also has the ability to intercept the result of a resolver's execution. It's not only able to e.g. create a log but also replace the result with a new value:

```typescript
export const CompetitorInterceptor: MiddlewareFn = async (_, next) => {
  const result = await next();
  if (result === "typegql") {
    return "type-graphql";
  }
  return result;
};
```

It might not seem very useful from the perspective of this library's users but this feature was mainly introduced for plugin systems and 3rd-party library integration. Thanks to this, it's possible to e.g. wrap the returned object with a lazy-relation wrapper that automatically fetches relations from a database on demand under the hood.

### Simple Middleware

If we only want to do something before an action, like log the access to the resolver, we can just place the `return next()` statement at the end of our middleware:

```typescript
const LogAccess: MiddlewareFn<TContext> = ({ context, info }, next) => {
  const username: string = context.username || "guest";
  console.log(`Logging access: ${username} -> ${info.parentType.name}.${info.fieldName}`);
  return next();
};
```

### Guards

Middleware can also break the middleware stack by not calling the `next` function. This way, the result returned from the middleware will be used instead of calling the resolver and returning it's result.

We can also throw an error in the middleware if the execution must be terminated and an error returned to the user, e.g. when resolver arguments are incorrect.

This way we can create a guard that blocks access to the resolver and prevents execution or any data return.

```typescript
export const CompetitorDetector: MiddlewareFn = async ({ args }, next) => {
  if (args.frameworkName === "type-graphql") {
    return "TypeGraphQL";
  }
  if (args.frameworkName === "typegql") {
    throw new Error("Competitive framework detected!");
  }
  return next();
};
```

### Reusable Middleware

Sometimes middleware has to be configurable, just like we pass a `roles` array to the [`@Authorized()` decorator](authorization.md). In this case, we should create a simple middleware factory - a function that takes our configuration as a parameter and returns a middleware that uses the provided value.

```typescript
export function NumberInterceptor(minValue: number): MiddlewareFn {
  return async (_, next) => {
    const result = await next();
    // hide values below minValue
    if (typeof result === "number" && result < minValue) {
      return null;
    }
    return result;
  };
}
```

Remember to call this middleware with an argument, e.g. `NumberInterceptor(3.0)`, when attaching it to a resolver!

### Error Interceptors

Middleware can also catch errors that were thrown during execution. This way, they can easily be logged and even filtered for info that can't be returned to the user:

```typescript
export const ErrorInterceptor: MiddlewareFn<any> = async ({ context, info }, next) => {
  try {
    return await next();
  } catch (err) {
    // write error to file log
    fileLog.write(err, context, info);

    // hide errors from db like printing sql query
    if (someCondition(err)) {
      throw new Error("Unknown error occurred!");
    }

    // rethrow the error
    throw err;
  }
};
```

### Class-based Middleware

Sometimes our middleware logic can be a bit complicated - it may communicate with a database, write logs to file, etc., so we might want to test it. In that case we create class middleware that is able to benefit from [dependency injection](dependency-injection.md) and easily mock a file logger or a database repository.

To accomplish this, we implement a `MiddlewareInterface`. Our class must have the `use` method that conforms with the `MiddlewareFn` signature. Below we can see how the previously defined `LogAccess` middleware looks after the transformation:

```typescript
export class LogAccess implements MiddlewareInterface<TContext> {
  constructor(private readonly logger: Logger) {}

  async use({ context, info }: ResolverData<TContext>, next: NextFn) {
    const username: string = context.username || "guest";
    this.logger.log(`Logging access: ${username} -> ${info.parentType.name}.${info.fieldName}`);
    return next();
  }
}
```

## How to use

### Attaching Middleware

To attach middleware to a resolver, place the `@UseMiddleware()` decorator above the field or resolver declaration. It accepts an array of middleware that will be called in the provided order. We can also pass them without an array as it supports [rest parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters):

```typescript
@Resolver()
export class RecipeResolver {
  @Query()
  @UseMiddleware(ResolveTime, LogAccess)
  randomValue(): number {
    return Math.random();
  }
}
```

We can also attach the middleware to the `ObjectType` fields, the same way as with the [`@Authorized()` decorator](authorization.md).

```typescript
@ObjectType()
export class Recipe {
  @Field()
  title: string;

  @Field(type => [Int])
  @UseMiddleware(LogAccess)
  ratings: number[];
}
```

### Global Middleware

However, for common middleware like measuring resolve time or catching errors, it might be annoying to place a `@UseMiddleware(ResolveTime)` decorator on every field/resolver.

Hence, in TypeGraphQL we can also register a global middleware that will be called for each query, mutation, subscription and field resolver. For this, we use the `globalMiddlewares` property of the `buildSchema` configuration object:

```typescript
const schema = await buildSchema({
  resolvers: [RecipeResolver],
  globalMiddlewares: [ErrorInterceptor, ResolveTime],
});
```

### Custom Decorators

If we want to use middlewares with a more descriptive and declarative API, we can also create a custom method decorators. See how to do this in [custom decorators docs](custom-decorators.md#method-decorators).

## Example

See how different kinds of middlewares work in the [middlewares and custom decorators example](https://github.com/MichalLytek/type-graphql/tree/master/examples/middlewares-custom-decorators).
