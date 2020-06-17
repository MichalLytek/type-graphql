import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { DirectorUpdateManyMutationInput } from "../../../inputs/DirectorUpdateManyMutationInput";
import { DirectorWhereInput } from "../../../inputs/DirectorWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManyDirectorArgs {
  @TypeGraphQL.Field(_type => DirectorUpdateManyMutationInput, { nullable: false })
  data!: DirectorUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => DirectorWhereInput, { nullable: true })
  where?: DirectorWhereInput | undefined;
}
