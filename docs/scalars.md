# Scalars

## Aliases
TypeGraphQL provides aliases for 3 basic scalars:
- Int --> GraphQLInt;
- Float --> GraphQLFloat;
- ID --> GraphQLID;

This shorthand allows you to save keystrokes when declaring field type:
```ts
// import the aliases
import { ID, Float, Int } from "type-graphql";

@ObjectType()
class SampleObject {
  @Field(type => ID)
  readonly id: string;

  @Field(type => Int)
  notificationsCount: number;

  @Field(type => Float)
  probability: number;
}
```
In the last case you can ommit the `type => Float` since JavaScript `Number` will become `GraphQLFloat` in schema automatically.

Other scalars - `GraphQLString` and `GraphQLBoolean` doesn't need aliases - when it's possible, they will be reflected automatically:
```ts
@ObjectType()
class User {
  @Field()
  name: string;

  @Field()
  isOld: boolean;
}
```

However in some cases you will have to explicitly declare the string/bool scalar type. Use JS constructor functions (`String`, `Boolean`) then:
```ts
@ObjectType()
class SampleObject {
  @Field(type => String, { nullable: true })
  get optionalInfo(): string | undefined { // TS reflected type is `Object` :(
    if (Math.random() > 0.5) {
      return "Gotcha!";
    }
  }
}
```

## Built-in scalars
TypeGraphQL provides built-in scalars for `Date` type. There are two versions of this scalars:
- timestamp based (`"timestamp"`) - `1518037458374`
- ISO format (`"isoDate"`) - `"2018-02-07T21:04:39.573Z"`

They are exported from `type-graphql` package as `GraphQLISODateScalar` and `GraphQLTimestampScalar`. 

By default TypeGraphQL use the ISO date format, however you can change it in `buildSchema` options:
```ts
import { buildSchema } from "type-graphql";

const schema = await buildSchema({
  resolvers,
  dateScalarMode: "timestamp", // "timestamp" or "isoDate"
});
```

There's no need to explicitly declare the field type then:
```ts
@ObjectType()
class User {
  @Field()
  registrationDate: Date;
}
```
Be aware to use `ts-node` with `--type-check` flag due to [Date reflection bug](https://github.com/TypeStrong/ts-node/issues/511).

## Custom scalars
TypeGraphQL also support custom scalar types.

First of all, you need to create your own `GraphQLScalarType` instance (or import the scalar type from 3rd-party npm library). Example for Mongo's ObjectId:
```ts
import { GraphQLScalarType, Kind } from "graphql";
import { ObjectId } from "mongodb";

export const ObjectIdScalar = new GraphQLScalarType({
  name: "ObjectId",
  description: "Mongo object id scalar type",
  parseValue(value: string) {
    return new ObjectId(value); // value from the client input variables
  },
  serialize(value: ObjectId) {
    return value.toHexString(); // value sent to the client
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new ObjectId(ast.value); // value from the client query
    }
    return null;
  },
});
```

Then you can just use it in your field decorators:
```ts
// import the earlier created const
import { ObjectIdScalar } from "../my-scalars/ObjectId";

@ObjectType()
class User {
  @Field(type => ObjectIdScalar) // and explicitly use it
  readonly id: ObjectId;

  @Field()
  name: string;

  @Field()
  isOld: boolean;
}
```

Optionally, you can delcare the association between reflected property type and your scalars to automatically map them (no need to explicit type annotation!):
```ts
@ObjectType()
class User {
  @Field() // magic goes here - no type annotation for custom scalar
  readonly id: ObjectId;
}
```

All you need to do is register the association map in `buildSchema` options:
```ts
import { ObjectId } from "mongodb";
import { ObjectIdScalar } from "../my-scalars/ObjectId";
import { buildSchema } from "type-graphql";

const schema = await buildSchema({
  resolvers,
  scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
});
```
However, be aware that this will work only when TypeScript reflection mechanism can handle it. So your class property type must be the `class`, not an enum, union or an interface.
