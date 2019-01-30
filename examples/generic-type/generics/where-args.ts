import { GenericType, GenericField } from "../../../src";

@GenericType()
export class WhereArgs<Type> {
  @GenericField({
    transformFields: {
      // To match with Partial<Type>, it will transform
      // each props of the Type (SDL) into a nullable prop
      nullable: true,
    },
  })
  where: Partial<Type>;
}
