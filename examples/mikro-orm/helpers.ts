import { EntityManager } from "@mikro-orm/core";

import { Recipe } from "./entities/recipe";
import { Rate } from "./entities/rate";
import { User } from "./entities/user";

export async function seedDatabase(em: EntityManager) {
  const defaultUser = em.create(User, {
    email: "test@github.com",
    nickname: "MichalLytek",
    password: "s3cr3tp4ssw0rd",
  });
  em.persist(defaultUser);

  const recipe1 = em.create(Recipe, {
    title: "Recipe 1",
    description: "Desc 1",
    author: defaultUser,
  });
  recipe1.ratings.add(
    em.create(Rate, { value: 2, user: defaultUser, recipe: recipe1 }),
    em.create(Rate, { value: 4, user: defaultUser, recipe: recipe1 }),
    em.create(Rate, { value: 5, user: defaultUser, recipe: recipe1 }),
    em.create(Rate, { value: 3, user: defaultUser, recipe: recipe1 }),
    em.create(Rate, { value: 4, user: defaultUser, recipe: recipe1 }),
  );
  em.persist(recipe1);

  const recipe2 = em.create(Recipe, {
    title: "Recipe 2",
    author: defaultUser,
  });
  recipe2.ratings.add(
    em.create(Rate, { value: 2, user: defaultUser, recipe: recipe2 }),
    em.create(Rate, { value: 4, user: defaultUser, recipe: recipe2 }),
  );
  em.persist(recipe2);

  await em.flush();
  return { defaultUser };
}
