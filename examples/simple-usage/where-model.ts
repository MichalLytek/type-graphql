import { Field, Model, Destination } from "../../src";
import { Recipe, Test } from "./recipe-type";

@Model({ models: [Recipe, Test] })
export class WhereModel<Type> {
  @Destination({
    nullable: true,
    transformModel: {
      nullable: true,
    },
  })
  where?: Partial<Type>;

  @Destination({ nullable: true })
  where2: Type;

  @Field({ nullable: true })
  count: number;
}
