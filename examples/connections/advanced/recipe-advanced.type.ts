import { Field, ObjectType, Int, ArgsType } from "../../../src";
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

// Client code

// A typical User type that has a connection for their recipes.
@ObjectType()
export class User {
  @Field()
  name: string;

  @Field(type => RecipeConnection)
  recipes: RecipeConnection;
}

// A recipe that's just a simple class
@ObjectType()
export class Recipe {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  vegetarian?: boolean;

  @Field(type => [String])
  ingredients: string[];
}

// The edge for the connection that has additional metadata about the
// relationship between the user and the recipe. In this case it's
// some additional info a user could fill in.
@ObjectType()
export class RecipeEdge extends Edge<Recipe> {
  @Field()
  personalNotes: string;
}

// A class that corresponds to the connection format in TypeScript
@ConnectionType(node => Recipe, { edgeType: () => RecipeEdge })
export class RecipeConnection extends Connection<Recipe, RecipeEdge> {
  // Returns the total number of recipes
  @Field(type => Int)
  totalRecipes: number;
}

// The connection allows the normal before, after etc
// but also whether to include vegetarian recipes
@ArgsType()
class MyArticlesConnectionArgs extends ConnectionArgs {
  @Field({ nullable: true })
  vegetarian?: boolean;
}

// TODO: This will need some work to reflect first grabbing the user, and then their recipes

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
