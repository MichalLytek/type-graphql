import { IsEmail } from "class-validator";
import { InputType, Field, ObjectType } from "type-graphql";

// `UserDetails` stores base common user properties
@ObjectType({ isAbstract: true })
@InputType("UserDetailsInput", { isAbstract: true })
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
