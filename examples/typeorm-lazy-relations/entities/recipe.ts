import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
// eslint-disable-next-line import/no-cycle
import { Rating } from "./rating";
// eslint-disable-next-line import/no-cycle
import { User } from "./user";

@Entity()
@ObjectType()
export class Recipe {
  @Field(_type => ID)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field()
  @Column()
  title: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field(_type => [Rating])
  @OneToMany(_type => Rating, rate => rate.recipe, { lazy: true, cascade: ["insert"] })
  ratings: Rating[] | Promise<Rating[]>;

  @Field(_type => User)
  @ManyToOne(_type => User, { lazy: true })
  author: User | Promise<User>;
}
