// tslint:disable
import "reflect-metadata";

import * as express from "express";
import * as graphqlHTTP from "express-graphql";

import { MetadataStorage } from "../metadata/metadata-storage";
import { RecipeResolver } from "./classes";
import { SchemaGenerator } from "../schema/schema-generator";
RecipeResolver; // prevent import cleaning

const schema = SchemaGenerator.generateFromMetadata();
// debugger;

const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  }),
);
app.listen(4000, () => {
  console.log("Running a GraphQL API server at localhost:4000/graphql");
});

// MetadataStorage.build();
// MetadataStorage.objectTypes.forEach(objectType => {
//   console.log("Object:", objectType.name, objectType.fields);
// });
// MetadataStorage.inputTypes.forEach(inputType => {
//   console.log("Input:", inputType.name, inputType.fields);
// });
// MetadataStorage.argumentTypes.forEach(argType => {
//   console.log("Arg:", argType.name, argType.fields);
// });
// MetadataStorage.queries.forEach(query => {
//   console.log("Query:", query.methodName, query.params);
// });
// MetadataStorage.mutations.forEach(mutation => {
//   console.log("Mutation:", mutation.methodName, mutation.params);
// });
// MetadataStorage.fieldResolvers.forEach(resolver => {
//   console.log("FieldResolver:", (resolver.getParentType!() as any).name, resolver.methodName, resolver.params);
// });

// const recipe: Recipe = {
//   id: "1",
//   description: "none",
//   averageRating: 0,
//   title: "hehe",
//   ratings: [
//     {
//       user: {},
//       value: 2,
//     },
//     {
//       user: {},
//       value: 4,
//     },
//   ],
// };

// const MyResolver: any = MetadataStorage.queries[0].target;
// const myResolver: RecipeResolver = new MyResolver();
// myResolver.recipeRepository = {
//   findOneById(id: string) {
//     return {
//       id,
//       name: "Test",
//     }
//   }
// } as any;

// const result = MetadataStorage.queries[0].handler.call(myResolver, { recipeId: 2 });
// console.log(result);
