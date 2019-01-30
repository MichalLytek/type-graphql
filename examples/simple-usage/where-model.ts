import { Field, Model, Destination, ObjectType } from "../../src";
import { Recipe } from "./recipe-type";

@Model({ models: [Recipe], type: "ArgsType" })
export class WhereModel<Type> {
  @Destination({
    transformModel: {
      nullable: true,
    },
  })
  where?: Partial<Type>;

  @Field({ nullable: true })
  count: number;
}

@Model({ models: [Recipe], type: "InputType" })
export class WhereModelInput<Type> {
  @Destination({
    transformModel: {
      apply: field => {
        if (field.getType() instanceof Function) {
          field.typeOptions.nullable = true;
        }
      },
    },
  })
  where?: Partial<Type>;
}

@Model({ models: [Recipe], type: "ObjectType" })
export class WhereModelObject<Type> {
  @Destination({ nullable: true, array: true })
  items: Type[];
}
