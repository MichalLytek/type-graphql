<!-- markdownlint-disable MD041 -->

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
  @ManyToOne(type => User)
  user: Promise<User>;

  @Field()
  @CreateDateColumn()
  date: Date;

  @ManyToOne(type => Recipe)
  recipe: Promise<Recipe>;
}
```
