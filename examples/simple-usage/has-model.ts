import { ObjectType, Field } from "../../src";
import { Recipe } from "./recipe-type";
import { WhereModel, WhereModelObject } from "./where-model";

@ObjectType()
export class HasModel {
  @Field(type => [Recipe], { model: WhereModelObject })
  items: Array<WhereModelObject<Recipe>>;
}
