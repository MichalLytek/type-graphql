import { Field, ID, GraphQLObjectType } from "../../../src";
import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@GraphQLObjectType()
@Entity()
export class User {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field()
  @Column()
  email: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  nickname?: string;

  @Column()
  password: string;
}
