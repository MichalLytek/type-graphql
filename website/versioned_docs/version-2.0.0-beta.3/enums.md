---
title: Enums
id: version-2.0.0-beta.3-enums
original_id: enums
---

Nowadays almost all typed languages have support for enumerated types, including TypeScript. Enums limit the range of a variable's values to a set of predefined constants, which makes it easier to document intent.

GraphQL also has enum type support, so TypeGraphQL allows us to use TypeScript enums in our GraphQL schema.

## Creating enum

Let's create a TypeScript enum. It can be a numeric or string enum - the internal values of enums are taken from the enum definition values and the public names taken from the enum keys:

```ts
// Implicit value 0, 1, 2, 3
enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

// Or explicit values
enum Direction {
  UP = "UP",
  DOWN = "DOWN",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
}
```

To tell TypeGraphQL about our enum, we would ideally mark the enums with the `@EnumType()` decorator. However, TypeScript decorators only work with classes, so we need to make TypeGraphQL aware of the enums manually by calling the `registerEnumType` function and providing the enum name for GraphQL:

```ts
import { registerEnumType } from "type-graphql";

registerEnumType(Direction, {
  name: "Direction", // Mandatory
  description: "The basic directions", // Optional
});
```

In case we need to provide additional GraphQL-related config for values, like description or deprecation reason, we can use `valuesConfig` property and put the data inside it, e.g.:

```ts
enum Direction {
  UP = "UP",
  DOWN = "DOWN",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  SIDEWAYS = "SIDEWAYS",
}

registerEnumType(Direction, {
  name: "Direction",
  description: "The basic directions",
  valuesConfig: {
    SIDEWAYS: {
      deprecationReason: "Replaced with Left or Right",
    },
    RIGHT: {
      description: "The other left",
    },
  },
});
```

This way, the additional info will be emitted in the GraphQL schema:

```graphql
enum Direction {
  UP
  DOWN
  LEFT
  """
  The other left
  """
  RIGHT
  SIDEWAYS @deprecated(reason: "Replaced with Left or Right")
}
```

## Using enum

The last step is very important: TypeScript has limited reflection ability, so this is a case where we have to explicitly provide the enum type for object type fields, input type fields, args, and the return type of queries and mutations:

```ts
@InputType()
class JourneyInput {
  @Field(type => Direction) // Mandatory
  direction: Direction;
}
```

Without this annotation, the generated GQL type would be `String` or `Float` (depending on the enum type), rather than the `ENUM` we are aiming for.

With all that in place, we can use our enum directly in our code 😉

```ts
@Resolver()
class SpriteResolver {
  private sprite = getMarioSprite();

  @Mutation()
  move(@Arg("direction", type => Direction) direction: Direction): boolean {
    switch (direction) {
      case Direction.Up:
        this.sprite.position.y++;
        break;
      case Direction.Down:
        this.sprite.position.y--;
        break;
      case Direction.Left:
        this.sprite.position.x--;
        break;
      case Direction.Right:
        this.sprite.position.x++;
        break;
      default:
        // Never reached
        return false;
    }

    return true;
  }
}
```

## Interoperability

Enums in TypeGraphQL are designed with server side in mind - the runtime will map the string value from input into a corresponding enum value, like `"UP"` into `0`. While this is very handy e.g. for mapping database values into GraphQL API enum names, it makes it unusable on the query side because `Direction.UP` will put `0` in the query which is an invalid value (should be `UP`).

So if we would like to share the types definition and use the enum on the client side app or use the enums directly on the server app e.g. in tests, we have to use the direct mapping of the enum member names with values, e.g.:

```ts
enum Direction {
  UP = "UP",
  DOWN = "DOWN",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
}
```
