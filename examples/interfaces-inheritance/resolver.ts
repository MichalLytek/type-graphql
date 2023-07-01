import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { EmployeeInput } from "./employee/employee.input";
import { Employee } from "./employee/employee.type";
import { calculateAge, getId } from "./helpers";
import { IPerson } from "./person/person.interface";
import { StudentInput } from "./student/student.input";
import { Student } from "./student/student.type";

@Resolver()
export class MultiResolver {
  private readonly personsRegistry: IPerson[] = [];

  @Query(_returns => [IPerson])
  persons(): IPerson[] {
    // this one returns interfaces
    // so GraphQL has to be able to resolve type of the item
    return this.personsRegistry;
  }

  @Mutation()
  addStudent(@Arg("input") input: StudentInput): Student {
    // be sure to create real instances of classes
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
