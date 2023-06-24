import type { User } from "./entities";
import { RecipeModel, UserModel } from "./entities";

export async function seedDatabase() {
  const defaultUser = new UserModel({
    email: "admin@github.com",
    nickname: "administrator",
    password: "s3cr3tp4ssw0rd",
  } as User);
  await defaultUser.save();

  await RecipeModel.create([
    {
      title: "Recipe 1",
      description: "Desc 1",
      author: defaultUser.id,
      ratings: [
        { value: 2, user: defaultUser.id },
        { value: 4, user: defaultUser.id },
        { value: 5, user: defaultUser.id },
        { value: 3, user: defaultUser.id },
        { value: 4, user: defaultUser.id },
      ],
    },
    {
      title: "Recipe 2",
      author: defaultUser.id,
      ratings: [
        { value: 2, user: defaultUser },
        { value: 4, user: defaultUser },
      ],
    },
  ]);

  return { defaultUser };
}
