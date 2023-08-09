import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { Rating } from "./rating";
import { User } from "./user";

@Entity()
@ObjectType()
export class Recipe {
  @Field(_type => ID)
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Field()
  @Column()
  title!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field(_type => [Rating])
  @OneToMany(_type => Rating, rating => rating.recipe, { cascade: ["insert"] })
  ratings!: Rating[];

  @Field(_type => User)
  @ManyToOne(_type => User)
  author!: User;

  @RelationId((recipe: Recipe) => recipe.author)
  authorId!: number;
}
