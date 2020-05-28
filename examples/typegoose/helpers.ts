import { Recipe, RecipeModel } from "./entities/recipe";
import { User, UserModel } from "./entities/user";

export async function seedDatabase() {
  const defaultUser = new UserModel({
    email: "test@github.com",
    nickname: "MichalLytek",
    password: "s3cr3tp4ssw0rd",
  } as User);
  await defaultUser.save();

  await RecipeModel.create([
    {
      title: "Recipe 1",
      description: "Desc 1",
      author: defaultUser._id,
      ratings: [
        { value: 2, user: defaultUser._id },
        { value: 4, user: defaultUser._id },
        { value: 5, user: defaultUser._id },
        { value: 3, user: defaultUser._id },
        { value: 4, user: defaultUser._id },
      ],
    },
    {
      title: "Recipe 2",
      author: defaultUser._id,
      ratings: [
        { value: 2, user: defaultUser },
        { value: 4, user: defaultUser },
      ],
    },
  ] as Recipe[]);

  return { defaultUser };
}
