---
title: Enums
---

Nowadays almost all* typed languages have support for enumerated types, so do TypeScript has.
Enums allow to limit the range of possible variable's values to a set of predefined constants, which for example make it easier to document intent.

GraphQL also have enum type support, so do `TypeGraphQL` allows you to use TS enums in your schema.

_* except Golang :(_

## Usage
First of all, you need to create an TypeScript's enum.
It can be normal (number based) or string enum - internal value of enums will be taken from enums definition values and the public names from the enum keys:
```ts
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
Then, we should mark the enums with `@GraphQLEnumType()` decorator. However TypeScript's decorators works only with classes, so we need to mark the enums manually by calling the register function and providing the enum name for GraphQL:
```ts
import { registerEnumType } from "type-graphql";

registerEnumType(Direction, {
  name: "Direction", // this one is mandatory
  description: "The basic directions", // this one is optional
});
```

The last step is very important: TypeScript has limited reflection ability, so we have to explicitly provide the enum type both for object/input type fields as well as return type of queries/mutations or arg type:
```ts
@InputType()
class JourneyInput {
  @Field(type => Direction) // it's very important
  direction: Direction;
}
```
Without this annotation, the generated GQL type would be not `ENUM` but `String` or `Float`, depending on the enum's type.

In the end you can use your enum directly in your code 😉
```ts
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
