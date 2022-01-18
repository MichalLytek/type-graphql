import User from "./user";

export const users: User[] = [
  createUser({
    id: "1",
    name: "Ada Lovelace",
    birthDate: "1815-12-10",
    username: "@ada",
  }),
  createUser({
    id: "2",
    name: "Alan Turing",
    birthDate: "1912-06-23",
    username: "@complete",
  }),
];

function createUser(userData: Partial<User>) {
  return Object.assign(new User(), userData);
}
