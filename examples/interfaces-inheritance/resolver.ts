import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Employee, EmployeeInput } from "./employee";
import { calculateAge, getId } from "./helpers";
import { IPerson } from "./person";
import { Student, StudentInput } from "./student";

@Resolver()
export class MultiResolver {
  private readonly personsRegistry: IPerson[] = [];

  @Query(_returns => [IPerson])
  persons(): IPerson[] {
    // This one returns interfaces,
    // GraphQL has to be able to resolve type of the item
    return this.personsRegistry;
  }

  @Mutation()
  addStudent(@Arg("input") input: StudentInput): Student {
    // Be sure to create real instances of classes
    const student = Object.assign(new Student(), {
      id: getId(),
      name: input.name,
      universityName: input.universityName,
      age: calculateAge(input.dateOfBirth),
    });
    this.personsRegistry.push(student);
    return student;
  }

  @Mutation()
  addEmployee(@Arg("input") input: EmployeeInput): Employee {
    const employee = Object.assign(new Employee(), {
      id: getId(),
      name: input.name,
      companyName: input.companyName,
      age: calculateAge(input.dateOfBirth),
    });
    this.personsRegistry.push(employee);
    return employee;
  }
}
