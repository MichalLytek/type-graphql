import { Resolver, Arg, Int, Mutation } from "../../../src";

import { ResourceResolver } from "../resource/resource.resolver";
import { Person } from "./person.type";
import { PersonRole } from "./person.role";

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
export class PersonResolver extends ResourceResolver(Person, persons) {
  // here you can add resource-specific operations

  @Mutation()
  promote(@Arg("personId", type => Int) personId: number): boolean {
    // you have full access to base resolver class fields and methods

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
