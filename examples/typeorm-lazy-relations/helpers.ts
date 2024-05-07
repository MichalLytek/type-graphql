import { dataSource } from "./datasource";
import { Rating, Recipe, User } from "./entities";

export async function seedDatabase() {
  const recipeRepository = dataSource.getRepository(Recipe);
  const ratingRepository = dataSource.getRepository(Rating);
  const userRepository = dataSource.getRepository(User);

  const defaultUser = userRepository.create({
    email: "admin@github.com",
    nickname: "administrator",
    password: "s3cr3tp4ssw0rd",
  });
  await userRepository.save(defaultUser);

  const [recipe1, recipe2] = recipeRepository.create([
    {
      title: "Recipe 1",
      description: "Desc 1",
      author: defaultUser,
    },
    {
      title: "Recipe 2",
      author: defaultUser,
    },
  ]);
  await recipeRepository.save([recipe1, recipe2]);

  const ratings = ratingRepository.create([
    { value: 2, user: defaultUser, recipe: recipe1 },
    { value: 4, user: defaultUser, recipe: recipe1 },
    { value: 5, user: defaultUser, recipe: recipe1 },
    { value: 3, user: defaultUser, recipe: recipe1 },
    { value: 4, user: defaultUser, recipe: recipe1 },
    { value: 2, user: defaultUser, recipe: recipe2 },
    { value: 4, user: defaultUser, recipe: recipe2 },
  ]);
  await ratingRepository.save(ratings);

  return {
    defaultUser,
  };
}
