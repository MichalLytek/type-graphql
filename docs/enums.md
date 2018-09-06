---
title: Enums
---

Nowadays almost all* typed languages have support for enumerated types, including TypeScript.
Enums allow to limit the range of possible variable's values to a set of predefined constants, which make it easier to document intent.

GraphQL also has enum type support, so `TypeGraphQL` allows you to use TypeScript enums in your GraphQL schema.

_* except Golang :(_

## Usage
First of all, you need to create a TypeScript enum.
It can be a numeric or string enum - the internal value of enums will be taken from enums definition values and the public names from the enum keys:

```typescript
enum Direction {
  Up,
  Down,
  Left,
  Right,
}
// or
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}
```

To tell TypeGraphQL about your enum, you would ideally mark the enums with `@GraphQLEnumType()` decorator. However, TypeScript's decorators only works with classes, so we need to make TypeGraphQL aware of the enums manually by calling the `registerEnumType` function and providing the enum name for GraphQL:

```typescript
import { registerEnumType } from "type-graphql";

registerEnumType(Direction, {
  name: "Direction", // this one is mandatory
  description: "The basic directions", // this one is optional
});
```

The last step is very important: TypeScript has limited reflection ability, so this is a case where we have to explicitly provide the enum type for object type fields, input type fields, args, and the return type of queries and mutations:

```typescript
@InputType()
class JourneyInput {
  @Field(type => Direction) // it's very important
  direction: Direction;
}
```

Without this annotation, the generated GQL type would be `String` or `Float` (depending on the enum type), rather than the `ENUM` we are aiming for.

With all that in place, you can use your enum directly in your code 😉

```typescript
class Resolver {
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
      default: // it will never be hitten ;)
        return false;
    }

    return true;
  }
}
```
