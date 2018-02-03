import { Field, ID, GraphQLObjectType } from "../../../src";
import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@GraphQLObjectType()
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  readonly id: number;

  @Column()
  @Field()
  email: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  nickname?: string;

  @Column()
  password: string;
}
