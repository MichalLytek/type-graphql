import { type EntityManager } from "@mikro-orm/core";
import { Rating, Recipe, User } from "./entities";

export async function seedDatabase(em: EntityManager) {
  const defaultUser = em.create(User, {
    email: "admin@github.com",
    nickname: "administrator",
    password: "s3cr3tp4ssw0rd",
  });
  em.persist(defaultUser);

  const recipe1 = em.create(Recipe, {
    title: "Recipe 1",
    description: "Desc 1",
    author: defaultUser,
  });
  recipe1.ratings.add(
    em.create(Rating, { value: 2, user: defaultUser, recipe: recipe1 }),
    em.create(Rating, { value: 4, user: defaultUser, recipe: recipe1 }),
    em.create(Rating, { value: 5, user: defaultUser, recipe: recipe1 }),
    em.create(Rating, { value: 3, user: defaultUser, recipe: recipe1 }),
    em.create(Rating, { value: 4, user: defaultUser, recipe: recipe1 }),
  );
  em.persist(recipe1);

  const recipe2 = em.create(Recipe, {
    title: "Recipe 2",
    author: defaultUser,
  });
  recipe2.ratings.add(
    em.create(Rating, { value: 2, user: defaultUser, recipe: recipe2 }),
    em.create(Rating, { value: 4, user: defaultUser, recipe: recipe2 }),
  );
  em.persist(recipe2);

  await em.flush();
  return { defaultUser };
}
