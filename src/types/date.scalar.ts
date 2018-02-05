import {GraphQLScalarType, Kind} from "graphql";

export const GraphQLTimestampType = new GraphQLScalarType({
    name: "Date",
    description: "Date scalar type",
    parseValue(value: string) {
        return new Date(value); // value from the client input variables
    },
    serialize(value: Date) {
        return value.toISOString(); // value sent to the client
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return new Date(ast.value); // value from the client query
        }
        return null;
    },
});

export default GraphQLTimestampType;
