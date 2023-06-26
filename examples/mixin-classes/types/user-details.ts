import { IsEmail } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";

// `UserDetails` stores base common user properties
@ObjectType()
@InputType("UserDetailsInput")
export default class UserDetails {
  @Field()
  forename!: string;

  @Field({ nullable: true })
  surname?: string;

  @Field(type => Date)
  dateOfBirth!: Date;

  @IsEmail()
  @Field()
  email!: string;
}
