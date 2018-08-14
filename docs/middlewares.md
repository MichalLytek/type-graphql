---
title: Middlewares and guards
---

Middlewares are a piece of reusable code that can be easily attached to resolvers and fields. By using middlewares you can extract the common used code from your resolvers and then just declaratively attach it using decorator or even register globally.

## Creating middlewares

### What are middlewares?

Middlewares are a very powerful but also a bit complicated feature. Basically, they are functions that take 2 arguments:

* resolver data - the same as for resolvers (`root`, `args`, `context`, `info`)
* `next` function - used to control execution of next middlewares and the resolver to which they are attached

You might be familiar with how middlewares works in [`express.js`](https://expressjs.com/en/guide/writing-middleware.html) but TypeGraphQL middlewares are inspired by the [`koa.js` ones](http://koajs.com/#application). The difference is that the `next` function returns a promise of the value of further middlewares stack and resolver execution.

Thanks to this it's really easy to perform some action not only before resolvers execution but also after that. So things like measuring execution time are really easy to implement:

```typescript
export const ResolveTime: MiddlewareFn = async ({ info }, next) => {
  const start = Date.now();
  await next();
  const resolveTime = Date.now() - start;
  console.log(`${info.parentType.name}.${info.fieldName} [${resolveTime} ms]`);
};
```

### Intercepting execution result

Middlewares have also an ability to intercept the result of resolver execution. They are able not only to e.g. log it but they can also replace it with a new value:

```typescript
export const CompetitorInterceptor: MiddlewareFn = async (_, next) => {
  const result = await next();
  if (result === "typegql") {
    return "type-graphql";
  }
  return result;
};
```

It might be not very useful from this library users perspective but that feature was mainly introduced for plugins system and 3rd-party libs integration. Thanks to this, it's possible to e.g. wrap the returned object with lazy-relation wrapper that will automatically fetch relations from database on demand under the hood.

### Simple middlewares

If you only want to do something only before action, like log the access to the resolver, you can just place `return next()` statement at the end of your middleware:

```typescript
const LogAccess: MiddlewareFn<TContext> = ({ context, info }, next) => {
  const username: string = context.username || "guest";
  console.log(`Logging access: ${username} -> ${info.parentType.name}.${info.fieldName}`);
  return next();
};
```

### Guards

Middlewares can also break the middlewares stack by not calling the `next` function. The result returned from the middleware will be used instead of calling the resolver and returning it's result.

You can also throw error in the middleware if the execution should be terminated and the error should be returned to the user, e.g. when resolver args are incorrect.

This way you can create a guard that will block an access to the resolver and prevent executing it or returning the data.

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

### Reusable middlewares

Sometimes the middleware has to be configurable, just like you pass `roles` array to the [`@Autorized()` decorator](./authorization.md). In that case, you should create a simple middleware factory - a function that takes your configuration as a parameters and returns a middleware that use that provided value.

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

But remember to call this middleware with argument, e.g. `NumberInterceptor(3.0)` when you attach the middleware to a resolver!

### Errors interceptors

Middlewares can also catch errors that were thrown during execution. This way you can easily log them and even filter what can't be returned to user:

```typescript
export const ErrorInterceptor: MiddlewareFn<any> = ({ context, info }, next) => {
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

### Class-based middlewares

Sometimes your middleware logic might be a bit complicated - it can communicate with database, write logs to file, etc., so you might want to test it. In that cases you can create class middleware that is able to take benefits of [dependency injection](./dependency-injection.md) and easily mock a file logger or a database repository.

All you need to do is to implement a `MiddlewareInterface` - your class has to have the `use` method that conforms with `MiddlewareFn` signature. Below you can see how the defined earlier `LogAccess` middleware looks after the transformation:

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

## How to use?

### Attaching middlewares

To attach middlewares to resolver, place the `@UseMiddleware()` decorator above field or resolver declaration. It accepts an array of middlewares that will be called in the provided order. You can also pass them without array as it supports [rest parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters):

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

You can also attach the resolver to `ObjectType` fields, the same way as with [`@Autorized()` decorator](./authorization.md).

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

### Global middlewares

However, for common middlewares like measuring resolving time or catching errors, it might be a tedious work to place `@UseMiddleware(ResolveTime)` decorator on every field/resolver.

Hence in TypeGraphQL you can also register a global middleware that will be called for each query, mutation, subscription and field resolver. To do this, you have to use `globalMiddlewares` property of `buildSchema` configuration object:

```typescript
const schema = await buildSchema({
  resolvers: [RecipeResolver],
  globalMiddlewares: [ErrorInterceptor, ResolveTime],
});
```

### Custom decorators

If you want to have a more descriptive and declarative API, you can also create custom decorators. They work in the same way like the reusable middleware function, however in this case you need to return the `UseMiddleware` decorator function:
```typescript
export function ValidateArgs<T extends object>(schema: Schema<T>) {
  return UseMiddleware(async ({ args }, next) => {
    // here place your validation logic, e.g. based on schema using joi
    await joiValidate(schema, args);
    return next();
  });
}
```

The usage is then very simple, as you have a custom, descriptive decorator - just place it above resolver/field and pass the required arguments to id:
```typescript
@Resolver()
export class RecipeResolver {
  @Query()
  @ValidateArgs(MyArgsSchema) // custom decorator
  @UseMiddleware(ResolveTime) // explicit middleware
  randomValue(@Args() { scale }: MyArgs): number {
    return Math.random() * scale;
  }
}
```
