import { Container } from "typedi";
import { ResolverData } from "../../src";

import { Context } from "./types";
import { sampleRecipes } from "./recipe/recipe.samples";

// add sample recipes to container
Container.set({
  id: "SAMPLE_RECIPES",
  transient: true, // create a fresh copy for each `get` of samples
  factory: () => {
    console.log("sampleRecipes copy created!");
    return sampleRecipes.slice();
  },
});

// create a wrapper for TypeDI `Container.of` scoped container feature
export const ScopedContainer = {
  get(someClass: any, { context }: ResolverData<Context>) {
    // use context data to get scoped container
    const container = Container.of(context.requestId);

    // then get from container like normal
    return container.get(someClass);
  },
};
