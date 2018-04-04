```ts
@Entity()
@ObjectType()
export class Rate {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field(type => Int)
  @Column({ type: "int" })
  value: number;

  @Field(type => User)
  @ManyToOne(type => User, { lazy: true })
  user: User;

  @Field()
  @CreateDateColumn()
  date: Date;

  @ManyToOne(type => Recipe, { lazy: true })
  recipe: Recipe;
}
```
