import { Car } from "./car-type";
import { ObjectType, Field, ArgsType } from "../../../src";

@ArgsType()
export class Person {
  @Field(type => String)
  name: string;

  @Field(type => [Car])
  cars: Car[];

  constructor(name: string, cars: Car[]) {
    this.name = name;
    this.cars = cars;
  }
}
