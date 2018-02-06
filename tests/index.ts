// tslint:disable
import "reflect-metadata";

import * as express from "express";
import * as graphqlHTTP from "express-graphql";

// import { MetadataStorage } from "../src/metadata/metadata-storage";
import { RecipeResolver } from "./classes";
import { buildSchema, GraphQLISODateScalar } from "../src/index";

const schema = buildSchema({
  resolvers: [RecipeResolver],
  dateScalarMode: "timestamp",
  scalarsMap: [{ type: Date, scalar: GraphQLISODateScalar }],
});
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
