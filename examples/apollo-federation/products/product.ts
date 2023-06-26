import { Directive, Field, ObjectType } from "type-graphql";

@Directive(`@key(fields: "upc")`)
@ObjectType()
export class Product {
  @Field()
  upc!: string;

  @Field()
  name!: string;

  @Field()
  price!: number;

  @Field()
  weight!: number;
}
