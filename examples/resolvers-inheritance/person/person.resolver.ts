import { Arg, Int, Mutation, Resolver } from "type-graphql";
import { Service } from "typedi";
import { PersonRole } from "./person.role";
import { Person } from "./person.type";
import { ResourceResolver } from "../resource";

const persons: Person[] = [
  {
    id: 1,
    name: "Person 1",
    age: 23,
    role: PersonRole.Normal,
  },
  {
    id: 2,
    name: "Person 2",
    age: 48,
    role: PersonRole.Admin,
  },
];

@Resolver()
@Service()
export class PersonResolver extends ResourceResolver(Person, persons) {
  // Here you can add resource-specific operations

  @Mutation()
  promote(@Arg("personId", _type => Int) personId: number): boolean {
    // Full access to base resolver class fields and methods

    const person = this.resourceService.getOne(personId);
    if (!person) {
      throw new Error("Person not found!");
    }

    if (person.role === PersonRole.Normal) {
      person.role = PersonRole.Pro;
      return true;
    }

    return false;
  }
}
