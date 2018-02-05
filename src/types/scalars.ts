import {GraphQLFloat, GraphQLInt, GraphQLScalarType, GraphQLString} from "graphql";
import GraphQLTimestampType from "./date.scalar";

export const Int: GraphQLScalarType = GraphQLInt;
export const Float: GraphQLScalarType = GraphQLFloat;
export const ID: GraphQLScalarType = GraphQLString;
export const Date: GraphQLScalarType = GraphQLTimestampType;
