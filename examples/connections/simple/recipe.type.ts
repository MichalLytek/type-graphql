import { Field, ObjectType, Int, Resolver, Query, ArgsType, Args } from "../../../src";
import { ConnectionType } from "../../../src/decorators/Connection";

// The default classes that a user would pull out of this library

class Edge<NodeType = {}> {
  @Field()
  node: NodeType;
  @Field()
  cursor: string;
}

class Connection<NodeType = {}, EdgeType = Edge<{}>> {
  @Field()
  edges: [EdgeType];

  @Field() // TODO, fill out this object
  pageInfo: any;
}

@ArgsType()
class ConnectionArgs {
  @Field(type => Int, { nullable: true })
  first?: number;

  @Field(type => Int, { nullable: true })
  last?: number;

  @Field({ nullable: true })
  after?: string;

  @Field({ nullable: true })
  before?: string;
}

// The code that a client would write

// A class that corresponds to the connection format in TypeScript
@ConnectionType(node => Recipe)
export class RecipeConnection extends Connection<Recipe> {
  // Empty is fine here, but you should be able to extend it
}

// A recipe that's just a simple class
@ObjectType()
export class Recipe {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(type => [String])
  ingredients: string[];
}

// An example resolver that someone would need to write to get
//

@Resolver()
class RecipeResolver {
  private recipesCollection: Recipe[] = [];

  @Query(returns => RecipeConnection)
  async recipes(@Args() args: ConnectionArgs): Promise<RecipeConnection> {
    const pageOptions = parseConnectionOptions(args);
    return connectionFromArraySlice(this.recipesCollection, args, {
      arrayLength: this.recipes.length,
      sliceStart: pageOptions.offset,
    });
  }
}
