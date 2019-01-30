import { Field, Model, Destination, ObjectType } from "../../src";
import { Recipe, Test } from "./recipe-type";

@Model({ models: [Recipe, Test], type: "ObjectType" })
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

@Model({ models: [Recipe, Test], type: "InputType" })
export class Where2Model<Type> {
  @Destination({
    transformModel: {
      apply: field => {
        if (field.getType() instanceof Function) {
          field.typeOptions.nullable = true;
        }
      },
    },
  })
  where3?: Partial<Type>;

  @Destination({ nullable: true })
  where4: Type;

  @Field({ nullable: true })
  count: number;
}

@ObjectType()
export class HasModel {
  @Field(type => Recipe, { model: WhereModel })
  whereModel: WhereModel<Recipe>;
}
