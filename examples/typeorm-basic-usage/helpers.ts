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

  const recipes = recipeRepository.create([
    {
      title: "Recipe 1",
      description: "Desc 1",
      author: defaultUser,
      ratings: ratingRepository.create([
        { value: 2, user: defaultUser },
        { value: 4, user: defaultUser },
        { value: 5, user: defaultUser },
        { value: 3, user: defaultUser },
        { value: 4, user: defaultUser },
      ]),
    },
    {
      title: "Recipe 2",
      author: defaultUser,
      ratings: ratingRepository.create([
        { value: 2, user: defaultUser },
        { value: 4, user: defaultUser },
      ]),
    },
  ]);
  await recipeRepository.save(recipes);

  return {
    defaultUser,
  };
}
