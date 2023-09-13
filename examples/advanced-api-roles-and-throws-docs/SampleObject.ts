import { Authorized, Field, ObjectType } from "@/decorators";

@ObjectType()
export class SampleObject {
  @Field()
  normalField!: string;

  @Field()
  @Authorized()
  authedField!: string;

  @Field({ nullable: true })
  @Authorized()
  nullableAuthedField!: string;

  @Field({ description: "random field description" })
  @Authorized("ADMIN")
  adminField!: string;

  @Field()
  normalResolvedField!: string;

  @Field()
  authedResolvedField!: string;

  @Field()
  @Authorized()
  inlineAuthedResolvedField!: string;
}
