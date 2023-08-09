<!-- markdownlint-disable MD041 -->

```ts
@ObjectType()
class Recipe {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(type => [Rate])
  ratings: Rate[];

  @Field(type => Float, { nullable: true })
  get averageRating() {
    const sum = this.ratings.reduce((a, b) => a + b, 0);
    return sum / this.ratings.length;
  }
}
```
