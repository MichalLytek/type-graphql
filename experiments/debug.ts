import generateCode from "../src/generator/generate-code";
import { dmmf } from "./prisma/generated/client";

generateCode(dmmf, __dirname + "/prisma/generated/type-graphql", console.log);
