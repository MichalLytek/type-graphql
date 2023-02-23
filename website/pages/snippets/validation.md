<!-- markdownlint-disable MD041 -->

```ts
@InputType()
export class RecipeInput {
  @Field()
  @MaxLength(30)
  title: string;

  @Field({ nullable: true })
  @Length(30, 255)
  description?: string;

  @Field(type => [String])
  @MaxArraySize(25)
  ingredients: string[];
}
```
