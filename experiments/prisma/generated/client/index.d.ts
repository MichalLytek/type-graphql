import {
  DMMF,
  DMMFClass,
  Engine,
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  sqltag as sql,
  empty,
  join,
  raw,
} from './runtime';

export { PrismaClientKnownRequestError }
export { PrismaClientUnknownRequestError }
export { PrismaClientRustPanicError }
export { PrismaClientInitializationError }
export { PrismaClientValidationError }

/**
 * Re-export of sql-template-tag
 */
export { sql, empty, join, raw }

/**
 * Prisma Client JS version: 2.7.1
 * Query Engine version: 5c2ad460cf4fe8c9330e6640b266c046542c8b6a
 */
export declare type PrismaVersion = {
  client: string
}

export declare const prismaVersion: PrismaVersion 

/**
 * Utility Types
 */

/**
 * From https://github.com/sindresorhus/type-fest/
 * Matches a JSON object.
 * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
 */
export declare type JsonObject = {[Key in string]?: JsonValue}
 
/**
 * From https://github.com/sindresorhus/type-fest/
 * Matches a JSON array.
 */
export declare interface JsonArray extends Array<JsonValue> {}
 
/**
 * From https://github.com/sindresorhus/type-fest/
 * Matches any valid JSON value.
 */
export declare type JsonValue = string | number | boolean | null | JsonObject | JsonArray

/**
 * Same as JsonObject, but allows undefined
 */
export declare type InputJsonObject = {[Key in string]?: JsonValue}
 
export declare interface InputJsonArray extends Array<JsonValue> {}
 
export declare type InputJsonValue = undefined |  string | number | boolean | null | InputJsonObject | InputJsonArray

declare type SelectAndInclude = {
  select: any
  include: any
}

declare type HasSelect = {
  select: any
}

declare type HasInclude = {
  include: any
}

declare type CheckSelect<T, S, U> = T extends SelectAndInclude
  ? 'Please either choose `select` or `include`'
  : T extends HasSelect
  ? U
  : T extends HasInclude
  ? U
  : S

/**
 * Get the type of the value, that the Promise holds.
 */
export declare type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

/**
 * Get the return type of a function which returns a Promise.
 */
export declare type PromiseReturnType<T extends (...args: any) => Promise<any>> = PromiseType<ReturnType<T>>


export declare type Enumerable<T> = T | Array<T>;

export type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K
}[keyof T]

export declare type TruthyKeys<T> = {
  [key in keyof T]: T[key] extends false | undefined | null ? never : key
}[keyof T]

export declare type TrueKeys<T> = TruthyKeys<Pick<T, RequiredKeys<T>>>

/**
 * Subset
 * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
 */
export declare type Subset<T, U> = {
  [key in keyof T]: key extends keyof U ? T[key] : never;
};
declare class PrismaClientFetcher {
  private readonly prisma;
  private readonly debug;
  private readonly hooks?;
  constructor(prisma: PrismaClient<any, any>, debug?: boolean, hooks?: Hooks | undefined);
  request<T>(document: any, dataPath?: string[], rootField?: string, typeName?: string, isList?: boolean, callsite?: string): Promise<T>;
  sanitizeMessage(message: string): string;
  protected unpack(document: any, data: any, path: string[], rootField?: string, isList?: boolean): any;
}


/**
 * Client
**/

export declare type Datasource = {
  url?: string
}

export type Datasources = {
  db?: Datasource
}

export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'

export interface PrismaClientOptions {
  /**
   * Overwrites the datasource url from your prisma.schema file
   */
  datasources?: Datasources

  /**
   * @default "colorless"
   */
  errorFormat?: ErrorFormat

  /**
   * @example
   * ```
   * // Defaults to stdout
   * log: ['query', 'info', 'warn', 'error']
   * 
   * // Emit as events
   * log: [
   *  { emit: 'stdout', level: 'query' },
   *  { emit: 'stdout', level: 'info' },
   *  { emit: 'stdout', level: 'warn' }
   *  { emit: 'stdout', level: 'error' }
   * ]
   * ```
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
   */
  log?: Array<LogLevel | LogDefinition>
}

export type Hooks = {
  beforeRequest?: (options: {query: string, path: string[], rootField?: string, typeName?: string, document: any}) => any
}

/* Types for Logging */
export type LogLevel = 'info' | 'query' | 'warn' | 'error'
export type LogDefinition = {
  level: LogLevel
  emit: 'stdout' | 'event'
}

export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
  GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
  : never

export type QueryEvent = {
  timestamp: Date
  query: string
  params: string
  duration: number
  target: string
}

export type LogEvent = {
  timestamp: Date
  message: string
  target: string
}
/* End Types for Logging */


export type PrismaAction =
  | 'findOne'
  | 'findMany'
  | 'create'
  | 'update'
  | 'updateMany'
  | 'upsert'
  | 'delete'
  | 'deleteMany'
  | 'executeRaw'
  | 'queryRaw'
  | 'aggregate'

/**
 * These options are being passed in to the middleware as "params"
 */
export type MiddlewareParams = {
  model?: string
  action: PrismaAction
  args: any
  dataPath: string[]
  runInTransaction: boolean
}

/**
 * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
 */
export type Middleware<T = any> = (
  params: MiddlewareParams,
  next: (params: MiddlewareParams) => Promise<T>,
) => Promise<T>

// tested in getLogLevel.test.ts
export declare function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js (ORM replacement)
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export declare class PrismaClient<
  T extends PrismaClientOptions = PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<LogLevel | LogDefinition> ? GetEvents<T['log']> : never : never
> {
  /**
   * @private
   */
  private fetcher;
  /**
   * @private
   */
  private readonly dmmf;
  /**
   * @private
   */
  private connectionPromise?;
  /**
   * @private
   */
  private disconnectionPromise?;
  /**
   * @private
   */
  private readonly engineConfig;
  /**
   * @private
   */
  private readonly measurePerformance;
  /**
   * @private
   */
  private engine: Engine;
  /**
   * @private
   */
  private errorFormat: ErrorFormat;

  /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js (ORM replacement)
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */
  constructor(optionsArg?: T);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? QueryEvent : LogEvent) => void): void;
  /**
   * @deprecated renamed to `$on`
   */
  on<V extends U>(eventType: V, callback: (event: V extends 'query' ? QueryEvent : LogEvent) => void): void;
  /**
   * Connect with the database
   */
  $connect(): Promise<void>;
  /**
   * @deprecated renamed to `$connect`
   */
  connect(): Promise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): Promise<any>;
  /**
   * @deprecated renamed to `$disconnect`
   */
  disconnect(): Promise<any>;

  /**
   * Add a middleware
   */
  $use(cb: Middleware): void

  /**
   * Executes a raw query and returns the number of affected rows
   * @example
   * ```
   * // With parameters use prisma.executeRaw``, values will be escaped automatically
   * const result = await prisma.executeRaw`UPDATE User SET cool = ${true} WHERE id = ${1};`
   * // Or
   * const result = await prisma.executeRaw('UPDATE User SET cool = $1 WHERE id = $2 ;', true, 1)
  * ```
  * 
  * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
  */
  $executeRaw<T = any>(query: string | TemplateStringsArray, ...values: any[]): Promise<number>;

  /**
   * @deprecated renamed to `$executeRaw`
   */
  executeRaw<T = any>(query: string | TemplateStringsArray, ...values: any[]): Promise<number>;

  /**
   * Performs a raw query and returns the SELECT data
   * @example
   * ```
   * // With parameters use prisma.queryRaw``, values will be escaped automatically
   * const result = await prisma.queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'ema.il'};`
   * // Or
   * const result = await prisma.queryRaw('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'ema.il')
  * ```
  * 
  * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
  */
  $queryRaw<T = any>(query: string | TemplateStringsArray, ...values: any[]): Promise<T>;
 
  /**
   * @deprecated renamed to `$queryRaw`
   */
  queryRaw<T = any>(query: string | TemplateStringsArray, ...values: any[]): Promise<T>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): UserDelegate;

  /**
   * `prisma.post`: Exposes CRUD operations for the **post** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Posts
    * const posts = await prisma.post.findMany()
    * ```
    */
  get post(): postDelegate;

  /**
   * `prisma.category`: Exposes CRUD operations for the **Category** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Categories
    * const categories = await prisma.category.findMany()
    * ```
    */
  get category(): CategoryDelegate;

  /**
   * `prisma.patient`: Exposes CRUD operations for the **Patient** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Patients
    * const patients = await prisma.patient.findMany()
    * ```
    */
  get patient(): PatientDelegate;

  /**
   * `prisma.movie`: Exposes CRUD operations for the **Movie** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Movies
    * const movies = await prisma.movie.findMany()
    * ```
    */
  get movie(): MovieDelegate;

  /**
   * `prisma.director`: Exposes CRUD operations for the **Director** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Directors
    * const directors = await prisma.director.findMany()
    * ```
    */
  get director(): DirectorDelegate;

  /**
   * `prisma.problem`: Exposes CRUD operations for the **Problem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Problems
    * const problems = await prisma.problem.findMany()
    * ```
    */
  get problem(): ProblemDelegate;

  /**
   * `prisma.creator`: Exposes CRUD operations for the **Creator** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Creators
    * const creators = await prisma.creator.findMany()
    * ```
    */
  get creator(): CreatorDelegate;
}



/**
 * Enums
 */

// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275

export declare const UserDistinctFieldEnum: {
  id: 'id',
  email: 'email',
  name: 'name',
  age: 'age',
  balance: 'balance',
  amount: 'amount',
  role: 'role'
};

export declare type UserDistinctFieldEnum = (typeof UserDistinctFieldEnum)[keyof typeof UserDistinctFieldEnum]


export declare const PostDistinctFieldEnum: {
  uuid: 'uuid',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  published: 'published',
  title: 'title',
  content: 'content',
  authorId: 'authorId',
  kind: 'kind',
  metadata: 'metadata'
};

export declare type PostDistinctFieldEnum = (typeof PostDistinctFieldEnum)[keyof typeof PostDistinctFieldEnum]


export declare const CategoryDistinctFieldEnum: {
  name: 'name',
  slug: 'slug',
  number: 'number'
};

export declare type CategoryDistinctFieldEnum = (typeof CategoryDistinctFieldEnum)[keyof typeof CategoryDistinctFieldEnum]


export declare const PatientDistinctFieldEnum: {
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email'
};

export declare type PatientDistinctFieldEnum = (typeof PatientDistinctFieldEnum)[keyof typeof PatientDistinctFieldEnum]


export declare const MovieDistinctFieldEnum: {
  directorFirstName: 'directorFirstName',
  directorLastName: 'directorLastName',
  title: 'title'
};

export declare type MovieDistinctFieldEnum = (typeof MovieDistinctFieldEnum)[keyof typeof MovieDistinctFieldEnum]


export declare const DirectorDistinctFieldEnum: {
  firstName: 'firstName',
  lastName: 'lastName'
};

export declare type DirectorDistinctFieldEnum = (typeof DirectorDistinctFieldEnum)[keyof typeof DirectorDistinctFieldEnum]


export declare const ProblemDistinctFieldEnum: {
  id: 'id',
  problemText: 'problemText',
  creatorId: 'creatorId'
};

export declare type ProblemDistinctFieldEnum = (typeof ProblemDistinctFieldEnum)[keyof typeof ProblemDistinctFieldEnum]


export declare const CreatorDistinctFieldEnum: {
  id: 'id',
  name: 'name'
};

export declare type CreatorDistinctFieldEnum = (typeof CreatorDistinctFieldEnum)[keyof typeof CreatorDistinctFieldEnum]


export declare const SortOrder: {
  asc: 'asc',
  desc: 'desc'
};

export declare type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


export declare const Role: {
  USER: 'USER',
  ADMIN: 'ADMIN'
};

export declare type Role = (typeof Role)[keyof typeof Role]


export declare const PostKind: {
  BLOG: 'BLOG',
  ADVERT: 'ADVERT'
};

export declare type PostKind = (typeof PostKind)[keyof typeof PostKind]



/**
 * Model User
 */

export type User = {
  id: number
  email: string
  name: string | null
  age: number
  balance: number
  amount: number
  role: Role
}


export type AggregateUser = {
  count: number
  avg: UserAvgAggregateOutputType | null
  sum: UserSumAggregateOutputType | null
  min: UserMinAggregateOutputType | null
  max: UserMaxAggregateOutputType | null
}

export type UserAvgAggregateOutputType = {
  id: number
  age: number
  balance: number
  amount: number
}

export type UserSumAggregateOutputType = {
  id: number
  age: number
  balance: number
  amount: number
}

export type UserMinAggregateOutputType = {
  id: number
  age: number
  balance: number
  amount: number
}

export type UserMaxAggregateOutputType = {
  id: number
  age: number
  balance: number
  amount: number
}


export type UserAvgAggregateInputType = {
  id?: true
  age?: true
  balance?: true
  amount?: true
}

export type UserSumAggregateInputType = {
  id?: true
  age?: true
  balance?: true
  amount?: true
}

export type UserMinAggregateInputType = {
  id?: true
  age?: true
  balance?: true
  amount?: true
}

export type UserMaxAggregateInputType = {
  id?: true
  age?: true
  balance?: true
  amount?: true
}

export type AggregateUserArgs = {
  where?: UserWhereInput
  orderBy?: Enumerable<UserOrderByInput>
  cursor?: UserWhereUniqueInput
  take?: number
  skip?: number
  distinct?: Enumerable<UserDistinctFieldEnum>
  count?: true
  avg?: UserAvgAggregateInputType
  sum?: UserSumAggregateInputType
  min?: UserMinAggregateInputType
  max?: UserMaxAggregateInputType
}

export type GetUserAggregateType<T extends AggregateUserArgs> = {
  [P in keyof T]: P extends 'count' ? number : GetUserAggregateScalarType<T[P]>
}

export type GetUserAggregateScalarType<T extends any> = {
  [P in keyof T]: P extends keyof UserAvgAggregateOutputType ? UserAvgAggregateOutputType[P] : never
}
    
    

export type UserSelect = {
  id?: boolean
  email?: boolean
  name?: boolean
  age?: boolean
  balance?: boolean
  amount?: boolean
  posts?: boolean | FindManypostArgs
  role?: boolean
}

export type UserInclude = {
  posts?: boolean | FindManypostArgs
}

export type UserGetPayload<
  S extends boolean | null | undefined | UserArgs,
  U = keyof S
> = S extends true
  ? User
  : S extends undefined
  ? never
  : S extends UserArgs | FindManyUserArgs
  ? 'include' extends U
    ? User  & {
      [P in TrueKeys<S['include']>]:
      P extends 'posts'
      ? Array<postGetPayload<S['include'][P]>> : never
    }
  : 'select' extends U
    ? {
      [P in TrueKeys<S['select']>]:P extends keyof User ? User[P]
: 
      P extends 'posts'
      ? Array<postGetPayload<S['select'][P]>> : never
    }
  : User
: User


export interface UserDelegate {
  /**
   * Find zero or one User.
   * @param {FindOneUserArgs} args - Arguments to find a User
   * @example
   * // Get one User
   * const user = await prisma.user.findOne({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
  **/
  findOne<T extends FindOneUserArgs>(
    args: Subset<T, FindOneUserArgs>
  ): CheckSelect<T, Prisma__UserClient<User | null>, Prisma__UserClient<UserGetPayload<T> | null>>
  /**
   * Find zero or more Users.
   * @param {FindManyUserArgs=} args - Arguments to filter and select certain fields only.
   * @example
   * // Get all Users
   * const users = await prisma.user.findMany()
   * 
   * // Get first 10 Users
   * const users = await prisma.user.findMany({ take: 10 })
   * 
   * // Only select the `id`
   * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
   * 
  **/
  findMany<T extends FindManyUserArgs>(
    args?: Subset<T, FindManyUserArgs>
  ): CheckSelect<T, Promise<Array<User>>, Promise<Array<UserGetPayload<T>>>>
  /**
   * Create a User.
   * @param {UserCreateArgs} args - Arguments to create a User.
   * @example
   * // Create one User
   * const User = await prisma.user.create({
   *   data: {
   *     // ... data to create a User
   *   }
   * })
   * 
  **/
  create<T extends UserCreateArgs>(
    args: Subset<T, UserCreateArgs>
  ): CheckSelect<T, Prisma__UserClient<User>, Prisma__UserClient<UserGetPayload<T>>>
  /**
   * Delete a User.
   * @param {UserDeleteArgs} args - Arguments to delete one User.
   * @example
   * // Delete one User
   * const User = await prisma.user.delete({
   *   where: {
   *     // ... filter to delete one User
   *   }
   * })
   * 
  **/
  delete<T extends UserDeleteArgs>(
    args: Subset<T, UserDeleteArgs>
  ): CheckSelect<T, Prisma__UserClient<User>, Prisma__UserClient<UserGetPayload<T>>>
  /**
   * Update one User.
   * @param {UserUpdateArgs} args - Arguments to update one User.
   * @example
   * // Update one User
   * const user = await prisma.user.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
  **/
  update<T extends UserUpdateArgs>(
    args: Subset<T, UserUpdateArgs>
  ): CheckSelect<T, Prisma__UserClient<User>, Prisma__UserClient<UserGetPayload<T>>>
  /**
   * Delete zero or more Users.
   * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
   * @example
   * // Delete a few Users
   * const { count } = await prisma.user.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
  **/
  deleteMany<T extends UserDeleteManyArgs>(
    args: Subset<T, UserDeleteManyArgs>
  ): Promise<BatchPayload>
  /**
   * Update zero or more Users.
   * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
   * @example
   * // Update many Users
   * const user = await prisma.user.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
  **/
  updateMany<T extends UserUpdateManyArgs>(
    args: Subset<T, UserUpdateManyArgs>
  ): Promise<BatchPayload>
  /**
   * Create or update one User.
   * @param {UserUpsertArgs} args - Arguments to update or create a User.
   * @example
   * // Update or create a User
   * const user = await prisma.user.upsert({
   *   create: {
   *     // ... data to create a User
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the User we want to update
   *   }
   * })
  **/
  upsert<T extends UserUpsertArgs>(
    args: Subset<T, UserUpsertArgs>
  ): CheckSelect<T, Prisma__UserClient<User>, Prisma__UserClient<UserGetPayload<T>>>
  /**
   * Count
   */
  count(args?: Omit<FindManyUserArgs, 'select' | 'include'>): Promise<number>

  /**
   * Aggregate
   */
  aggregate<T extends AggregateUserArgs>(args: Subset<T, AggregateUserArgs>): Promise<GetUserAggregateType<T>>
}

/**
 * The delegate class that acts as a "Promise-like" for User.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in 
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export declare class Prisma__UserClient<T> implements Promise<T> {
  private readonly _dmmf;
  private readonly _fetcher;
  private readonly _queryType;
  private readonly _rootField;
  private readonly _clientMethod;
  private readonly _args;
  private readonly _dataPath;
  private readonly _errorFormat;
  private readonly _measurePerformance?;
  private _isList;
  private _callsite;
  private _requestPromise?;
  constructor(_dmmf: DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
  readonly [Symbol.toStringTag]: 'PrismaClientPromise';

  posts<T extends FindManypostArgs = {}>(args?: Subset<T, FindManypostArgs>): CheckSelect<T, Promise<Array<post>>, Promise<Array<postGetPayload<T>>>>;

  private get _document();
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | Promise<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | Promise<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | Promise<TResult>) | undefined | null): Promise<T | TResult>;
  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally?: (() => void) | undefined | null): Promise<T>;
}

// Custom InputTypes

/**
 * User findOne
 */
export type FindOneUserArgs = {
  /**
   * Select specific fields to fetch from the User
  **/
  select?: UserSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: UserInclude | null
  /**
   * Filter, which User to fetch.
  **/
  where: UserWhereUniqueInput
}


/**
 * User findMany
 */
export type FindManyUserArgs = {
  /**
   * Select specific fields to fetch from the User
  **/
  select?: UserSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: UserInclude | null
  /**
   * Filter, which Users to fetch.
  **/
  where?: UserWhereInput
  /**
   * Determine the order of the Users to fetch.
  **/
  orderBy?: Enumerable<UserOrderByInput>
  /**
   * Sets the position for listing Users.
  **/
  cursor?: UserWhereUniqueInput
  /**
   * The number of Users to fetch. If negative number, it will take Users before the `cursor`.
  **/
  take?: number
  /**
   * Skip the first `n` Users.
  **/
  skip?: number
  distinct?: Enumerable<UserDistinctFieldEnum>
}


/**
 * User create
 */
export type UserCreateArgs = {
  /**
   * Select specific fields to fetch from the User
  **/
  select?: UserSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: UserInclude | null
  /**
   * The data needed to create a User.
  **/
  data: UserCreateInput
}


/**
 * User update
 */
export type UserUpdateArgs = {
  /**
   * Select specific fields to fetch from the User
  **/
  select?: UserSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: UserInclude | null
  /**
   * The data needed to update a User.
  **/
  data: UserUpdateInput
  /**
   * Choose, which User to update.
  **/
  where: UserWhereUniqueInput
}


/**
 * User updateMany
 */
export type UserUpdateManyArgs = {
  data: UserUpdateManyMutationInput
  where?: UserWhereInput
}


/**
 * User upsert
 */
export type UserUpsertArgs = {
  /**
   * Select specific fields to fetch from the User
  **/
  select?: UserSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: UserInclude | null
  /**
   * The filter to search for the User to update in case it exists.
  **/
  where: UserWhereUniqueInput
  /**
   * In case the User found by the `where` argument doesn't exist, create a new User with this data.
  **/
  create: UserCreateInput
  /**
   * In case the User was found with the provided `where` argument, update it with this data.
  **/
  update: UserUpdateInput
}


/**
 * User delete
 */
export type UserDeleteArgs = {
  /**
   * Select specific fields to fetch from the User
  **/
  select?: UserSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: UserInclude | null
  /**
   * Filter which User to delete.
  **/
  where: UserWhereUniqueInput
}


/**
 * User deleteMany
 */
export type UserDeleteManyArgs = {
  where?: UserWhereInput
}


/**
 * User without action
 */
export type UserArgs = {
  /**
   * Select specific fields to fetch from the User
  **/
  select?: UserSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: UserInclude | null
}



/**
 * Model post
 */

export type post = {
  uuid: string
  createdAt: Date
  updatedAt: Date
  published: boolean
  title: string
  content: string | null
  authorId: number
  kind: PostKind | null
  metadata: JsonValue
}


export type AggregatePost = {
  count: number
  avg: PostAvgAggregateOutputType | null
  sum: PostSumAggregateOutputType | null
  min: PostMinAggregateOutputType | null
  max: PostMaxAggregateOutputType | null
}

export type PostAvgAggregateOutputType = {
  authorId: number
}

export type PostSumAggregateOutputType = {
  authorId: number
}

export type PostMinAggregateOutputType = {
  authorId: number
}

export type PostMaxAggregateOutputType = {
  authorId: number
}


export type PostAvgAggregateInputType = {
  authorId?: true
}

export type PostSumAggregateInputType = {
  authorId?: true
}

export type PostMinAggregateInputType = {
  authorId?: true
}

export type PostMaxAggregateInputType = {
  authorId?: true
}

export type AggregatePostArgs = {
  where?: postWhereInput
  orderBy?: Enumerable<postOrderByInput>
  cursor?: postWhereUniqueInput
  take?: number
  skip?: number
  distinct?: Enumerable<PostDistinctFieldEnum>
  count?: true
  avg?: PostAvgAggregateInputType
  sum?: PostSumAggregateInputType
  min?: PostMinAggregateInputType
  max?: PostMaxAggregateInputType
}

export type GetPostAggregateType<T extends AggregatePostArgs> = {
  [P in keyof T]: P extends 'count' ? number : GetPostAggregateScalarType<T[P]>
}

export type GetPostAggregateScalarType<T extends any> = {
  [P in keyof T]: P extends keyof PostAvgAggregateOutputType ? PostAvgAggregateOutputType[P] : never
}
    
    

export type postSelect = {
  uuid?: boolean
  createdAt?: boolean
  updatedAt?: boolean
  published?: boolean
  title?: boolean
  content?: boolean
  author?: boolean | UserArgs
  authorId?: boolean
  kind?: boolean
  metadata?: boolean
}

export type postInclude = {
  author?: boolean | UserArgs
}

export type postGetPayload<
  S extends boolean | null | undefined | postArgs,
  U = keyof S
> = S extends true
  ? post
  : S extends undefined
  ? never
  : S extends postArgs | FindManypostArgs
  ? 'include' extends U
    ? post  & {
      [P in TrueKeys<S['include']>]:
      P extends 'author'
      ? UserGetPayload<S['include'][P]> : never
    }
  : 'select' extends U
    ? {
      [P in TrueKeys<S['select']>]:P extends keyof post ? post[P]
: 
      P extends 'author'
      ? UserGetPayload<S['select'][P]> : never
    }
  : post
: post


export interface postDelegate {
  /**
   * Find zero or one Post.
   * @param {FindOnepostArgs} args - Arguments to find a Post
   * @example
   * // Get one Post
   * const post = await prisma.post.findOne({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
  **/
  findOne<T extends FindOnepostArgs>(
    args: Subset<T, FindOnepostArgs>
  ): CheckSelect<T, Prisma__postClient<post | null>, Prisma__postClient<postGetPayload<T> | null>>
  /**
   * Find zero or more Posts.
   * @param {FindManypostArgs=} args - Arguments to filter and select certain fields only.
   * @example
   * // Get all Posts
   * const posts = await prisma.post.findMany()
   * 
   * // Get first 10 Posts
   * const posts = await prisma.post.findMany({ take: 10 })
   * 
   * // Only select the `uuid`
   * const postWithUuidOnly = await prisma.post.findMany({ select: { uuid: true } })
   * 
  **/
  findMany<T extends FindManypostArgs>(
    args?: Subset<T, FindManypostArgs>
  ): CheckSelect<T, Promise<Array<post>>, Promise<Array<postGetPayload<T>>>>
  /**
   * Create a Post.
   * @param {postCreateArgs} args - Arguments to create a Post.
   * @example
   * // Create one Post
   * const Post = await prisma.post.create({
   *   data: {
   *     // ... data to create a Post
   *   }
   * })
   * 
  **/
  create<T extends postCreateArgs>(
    args: Subset<T, postCreateArgs>
  ): CheckSelect<T, Prisma__postClient<post>, Prisma__postClient<postGetPayload<T>>>
  /**
   * Delete a Post.
   * @param {postDeleteArgs} args - Arguments to delete one Post.
   * @example
   * // Delete one Post
   * const Post = await prisma.post.delete({
   *   where: {
   *     // ... filter to delete one Post
   *   }
   * })
   * 
  **/
  delete<T extends postDeleteArgs>(
    args: Subset<T, postDeleteArgs>
  ): CheckSelect<T, Prisma__postClient<post>, Prisma__postClient<postGetPayload<T>>>
  /**
   * Update one Post.
   * @param {postUpdateArgs} args - Arguments to update one Post.
   * @example
   * // Update one Post
   * const post = await prisma.post.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
  **/
  update<T extends postUpdateArgs>(
    args: Subset<T, postUpdateArgs>
  ): CheckSelect<T, Prisma__postClient<post>, Prisma__postClient<postGetPayload<T>>>
  /**
   * Delete zero or more Posts.
   * @param {postDeleteManyArgs} args - Arguments to filter Posts to delete.
   * @example
   * // Delete a few Posts
   * const { count } = await prisma.post.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
  **/
  deleteMany<T extends postDeleteManyArgs>(
    args: Subset<T, postDeleteManyArgs>
  ): Promise<BatchPayload>
  /**
   * Update zero or more Posts.
   * @param {postUpdateManyArgs} args - Arguments to update one or more rows.
   * @example
   * // Update many Posts
   * const post = await prisma.post.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
  **/
  updateMany<T extends postUpdateManyArgs>(
    args: Subset<T, postUpdateManyArgs>
  ): Promise<BatchPayload>
  /**
   * Create or update one Post.
   * @param {postUpsertArgs} args - Arguments to update or create a Post.
   * @example
   * // Update or create a Post
   * const post = await prisma.post.upsert({
   *   create: {
   *     // ... data to create a Post
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the Post we want to update
   *   }
   * })
  **/
  upsert<T extends postUpsertArgs>(
    args: Subset<T, postUpsertArgs>
  ): CheckSelect<T, Prisma__postClient<post>, Prisma__postClient<postGetPayload<T>>>
  /**
   * Count
   */
  count(args?: Omit<FindManypostArgs, 'select' | 'include'>): Promise<number>

  /**
   * Aggregate
   */
  aggregate<T extends AggregatePostArgs>(args: Subset<T, AggregatePostArgs>): Promise<GetPostAggregateType<T>>
}

/**
 * The delegate class that acts as a "Promise-like" for post.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in 
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export declare class Prisma__postClient<T> implements Promise<T> {
  private readonly _dmmf;
  private readonly _fetcher;
  private readonly _queryType;
  private readonly _rootField;
  private readonly _clientMethod;
  private readonly _args;
  private readonly _dataPath;
  private readonly _errorFormat;
  private readonly _measurePerformance?;
  private _isList;
  private _callsite;
  private _requestPromise?;
  constructor(_dmmf: DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
  readonly [Symbol.toStringTag]: 'PrismaClientPromise';

  author<T extends UserArgs = {}>(args?: Subset<T, UserArgs>): CheckSelect<T, Prisma__UserClient<User | null>, Prisma__UserClient<UserGetPayload<T> | null>>;

  private get _document();
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | Promise<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | Promise<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | Promise<TResult>) | undefined | null): Promise<T | TResult>;
  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally?: (() => void) | undefined | null): Promise<T>;
}

// Custom InputTypes

/**
 * post findOne
 */
export type FindOnepostArgs = {
  /**
   * Select specific fields to fetch from the post
  **/
  select?: postSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: postInclude | null
  /**
   * Filter, which post to fetch.
  **/
  where: postWhereUniqueInput
}


/**
 * post findMany
 */
export type FindManypostArgs = {
  /**
   * Select specific fields to fetch from the post
  **/
  select?: postSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: postInclude | null
  /**
   * Filter, which posts to fetch.
  **/
  where?: postWhereInput
  /**
   * Determine the order of the posts to fetch.
  **/
  orderBy?: Enumerable<postOrderByInput>
  /**
   * Sets the position for listing posts.
  **/
  cursor?: postWhereUniqueInput
  /**
   * The number of posts to fetch. If negative number, it will take posts before the `cursor`.
  **/
  take?: number
  /**
   * Skip the first `n` posts.
  **/
  skip?: number
  distinct?: Enumerable<PostDistinctFieldEnum>
}


/**
 * post create
 */
export type postCreateArgs = {
  /**
   * Select specific fields to fetch from the post
  **/
  select?: postSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: postInclude | null
  /**
   * The data needed to create a post.
  **/
  data: postCreateInput
}


/**
 * post update
 */
export type postUpdateArgs = {
  /**
   * Select specific fields to fetch from the post
  **/
  select?: postSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: postInclude | null
  /**
   * The data needed to update a post.
  **/
  data: postUpdateInput
  /**
   * Choose, which post to update.
  **/
  where: postWhereUniqueInput
}


/**
 * post updateMany
 */
export type postUpdateManyArgs = {
  data: postUpdateManyMutationInput
  where?: postWhereInput
}


/**
 * post upsert
 */
export type postUpsertArgs = {
  /**
   * Select specific fields to fetch from the post
  **/
  select?: postSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: postInclude | null
  /**
   * The filter to search for the post to update in case it exists.
  **/
  where: postWhereUniqueInput
  /**
   * In case the post found by the `where` argument doesn't exist, create a new post with this data.
  **/
  create: postCreateInput
  /**
   * In case the post was found with the provided `where` argument, update it with this data.
  **/
  update: postUpdateInput
}


/**
 * post delete
 */
export type postDeleteArgs = {
  /**
   * Select specific fields to fetch from the post
  **/
  select?: postSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: postInclude | null
  /**
   * Filter which post to delete.
  **/
  where: postWhereUniqueInput
}


/**
 * post deleteMany
 */
export type postDeleteManyArgs = {
  where?: postWhereInput
}


/**
 * post without action
 */
export type postArgs = {
  /**
   * Select specific fields to fetch from the post
  **/
  select?: postSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: postInclude | null
}



/**
 * Model Category
 */

export type Category = {
  name: string
  slug: string
  number: number
}


export type AggregateCategory = {
  count: number
  avg: CategoryAvgAggregateOutputType | null
  sum: CategorySumAggregateOutputType | null
  min: CategoryMinAggregateOutputType | null
  max: CategoryMaxAggregateOutputType | null
}

export type CategoryAvgAggregateOutputType = {
  number: number
}

export type CategorySumAggregateOutputType = {
  number: number
}

export type CategoryMinAggregateOutputType = {
  number: number
}

export type CategoryMaxAggregateOutputType = {
  number: number
}


export type CategoryAvgAggregateInputType = {
  number?: true
}

export type CategorySumAggregateInputType = {
  number?: true
}

export type CategoryMinAggregateInputType = {
  number?: true
}

export type CategoryMaxAggregateInputType = {
  number?: true
}

export type AggregateCategoryArgs = {
  where?: CategoryWhereInput
  orderBy?: Enumerable<CategoryOrderByInput>
  cursor?: CategoryWhereUniqueInput
  take?: number
  skip?: number
  distinct?: Enumerable<CategoryDistinctFieldEnum>
  count?: true
  avg?: CategoryAvgAggregateInputType
  sum?: CategorySumAggregateInputType
  min?: CategoryMinAggregateInputType
  max?: CategoryMaxAggregateInputType
}

export type GetCategoryAggregateType<T extends AggregateCategoryArgs> = {
  [P in keyof T]: P extends 'count' ? number : GetCategoryAggregateScalarType<T[P]>
}

export type GetCategoryAggregateScalarType<T extends any> = {
  [P in keyof T]: P extends keyof CategoryAvgAggregateOutputType ? CategoryAvgAggregateOutputType[P] : never
}
    
    

export type CategorySelect = {
  name?: boolean
  slug?: boolean
  number?: boolean
}

export type CategoryGetPayload<
  S extends boolean | null | undefined | CategoryArgs,
  U = keyof S
> = S extends true
  ? Category
  : S extends undefined
  ? never
  : S extends CategoryArgs | FindManyCategoryArgs
  ? 'include' extends U
    ? Category 
  : 'select' extends U
    ? {
      [P in TrueKeys<S['select']>]:P extends keyof Category ? Category[P]
: 
 never
    }
  : Category
: Category


export interface CategoryDelegate {
  /**
   * Find zero or one Category.
   * @param {FindOneCategoryArgs} args - Arguments to find a Category
   * @example
   * // Get one Category
   * const category = await prisma.category.findOne({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
  **/
  findOne<T extends FindOneCategoryArgs>(
    args: Subset<T, FindOneCategoryArgs>
  ): CheckSelect<T, Prisma__CategoryClient<Category | null>, Prisma__CategoryClient<CategoryGetPayload<T> | null>>
  /**
   * Find zero or more Categories.
   * @param {FindManyCategoryArgs=} args - Arguments to filter and select certain fields only.
   * @example
   * // Get all Categories
   * const categories = await prisma.category.findMany()
   * 
   * // Get first 10 Categories
   * const categories = await prisma.category.findMany({ take: 10 })
   * 
   * // Only select the `name`
   * const categoryWithNameOnly = await prisma.category.findMany({ select: { name: true } })
   * 
  **/
  findMany<T extends FindManyCategoryArgs>(
    args?: Subset<T, FindManyCategoryArgs>
  ): CheckSelect<T, Promise<Array<Category>>, Promise<Array<CategoryGetPayload<T>>>>
  /**
   * Create a Category.
   * @param {CategoryCreateArgs} args - Arguments to create a Category.
   * @example
   * // Create one Category
   * const Category = await prisma.category.create({
   *   data: {
   *     // ... data to create a Category
   *   }
   * })
   * 
  **/
  create<T extends CategoryCreateArgs>(
    args: Subset<T, CategoryCreateArgs>
  ): CheckSelect<T, Prisma__CategoryClient<Category>, Prisma__CategoryClient<CategoryGetPayload<T>>>
  /**
   * Delete a Category.
   * @param {CategoryDeleteArgs} args - Arguments to delete one Category.
   * @example
   * // Delete one Category
   * const Category = await prisma.category.delete({
   *   where: {
   *     // ... filter to delete one Category
   *   }
   * })
   * 
  **/
  delete<T extends CategoryDeleteArgs>(
    args: Subset<T, CategoryDeleteArgs>
  ): CheckSelect<T, Prisma__CategoryClient<Category>, Prisma__CategoryClient<CategoryGetPayload<T>>>
  /**
   * Update one Category.
   * @param {CategoryUpdateArgs} args - Arguments to update one Category.
   * @example
   * // Update one Category
   * const category = await prisma.category.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
  **/
  update<T extends CategoryUpdateArgs>(
    args: Subset<T, CategoryUpdateArgs>
  ): CheckSelect<T, Prisma__CategoryClient<Category>, Prisma__CategoryClient<CategoryGetPayload<T>>>
  /**
   * Delete zero or more Categories.
   * @param {CategoryDeleteManyArgs} args - Arguments to filter Categories to delete.
   * @example
   * // Delete a few Categories
   * const { count } = await prisma.category.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
  **/
  deleteMany<T extends CategoryDeleteManyArgs>(
    args: Subset<T, CategoryDeleteManyArgs>
  ): Promise<BatchPayload>
  /**
   * Update zero or more Categories.
   * @param {CategoryUpdateManyArgs} args - Arguments to update one or more rows.
   * @example
   * // Update many Categories
   * const category = await prisma.category.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
  **/
  updateMany<T extends CategoryUpdateManyArgs>(
    args: Subset<T, CategoryUpdateManyArgs>
  ): Promise<BatchPayload>
  /**
   * Create or update one Category.
   * @param {CategoryUpsertArgs} args - Arguments to update or create a Category.
   * @example
   * // Update or create a Category
   * const category = await prisma.category.upsert({
   *   create: {
   *     // ... data to create a Category
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the Category we want to update
   *   }
   * })
  **/
  upsert<T extends CategoryUpsertArgs>(
    args: Subset<T, CategoryUpsertArgs>
  ): CheckSelect<T, Prisma__CategoryClient<Category>, Prisma__CategoryClient<CategoryGetPayload<T>>>
  /**
   * Count
   */
  count(args?: Omit<FindManyCategoryArgs, 'select' | 'include'>): Promise<number>

  /**
   * Aggregate
   */
  aggregate<T extends AggregateCategoryArgs>(args: Subset<T, AggregateCategoryArgs>): Promise<GetCategoryAggregateType<T>>
}

/**
 * The delegate class that acts as a "Promise-like" for Category.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in 
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export declare class Prisma__CategoryClient<T> implements Promise<T> {
  private readonly _dmmf;
  private readonly _fetcher;
  private readonly _queryType;
  private readonly _rootField;
  private readonly _clientMethod;
  private readonly _args;
  private readonly _dataPath;
  private readonly _errorFormat;
  private readonly _measurePerformance?;
  private _isList;
  private _callsite;
  private _requestPromise?;
  constructor(_dmmf: DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
  readonly [Symbol.toStringTag]: 'PrismaClientPromise';


  private get _document();
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | Promise<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | Promise<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | Promise<TResult>) | undefined | null): Promise<T | TResult>;
  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally?: (() => void) | undefined | null): Promise<T>;
}

// Custom InputTypes

/**
 * Category findOne
 */
export type FindOneCategoryArgs = {
  /**
   * Select specific fields to fetch from the Category
  **/
  select?: CategorySelect | null
  /**
   * Filter, which Category to fetch.
  **/
  where: CategoryWhereUniqueInput
}


/**
 * Category findMany
 */
export type FindManyCategoryArgs = {
  /**
   * Select specific fields to fetch from the Category
  **/
  select?: CategorySelect | null
  /**
   * Filter, which Categories to fetch.
  **/
  where?: CategoryWhereInput
  /**
   * Determine the order of the Categories to fetch.
  **/
  orderBy?: Enumerable<CategoryOrderByInput>
  /**
   * Sets the position for listing Categories.
  **/
  cursor?: CategoryWhereUniqueInput
  /**
   * The number of Categories to fetch. If negative number, it will take Categories before the `cursor`.
  **/
  take?: number
  /**
   * Skip the first `n` Categories.
  **/
  skip?: number
  distinct?: Enumerable<CategoryDistinctFieldEnum>
}


/**
 * Category create
 */
export type CategoryCreateArgs = {
  /**
   * Select specific fields to fetch from the Category
  **/
  select?: CategorySelect | null
  /**
   * The data needed to create a Category.
  **/
  data: CategoryCreateInput
}


/**
 * Category update
 */
export type CategoryUpdateArgs = {
  /**
   * Select specific fields to fetch from the Category
  **/
  select?: CategorySelect | null
  /**
   * The data needed to update a Category.
  **/
  data: CategoryUpdateInput
  /**
   * Choose, which Category to update.
  **/
  where: CategoryWhereUniqueInput
}


/**
 * Category updateMany
 */
export type CategoryUpdateManyArgs = {
  data: CategoryUpdateManyMutationInput
  where?: CategoryWhereInput
}


/**
 * Category upsert
 */
export type CategoryUpsertArgs = {
  /**
   * Select specific fields to fetch from the Category
  **/
  select?: CategorySelect | null
  /**
   * The filter to search for the Category to update in case it exists.
  **/
  where: CategoryWhereUniqueInput
  /**
   * In case the Category found by the `where` argument doesn't exist, create a new Category with this data.
  **/
  create: CategoryCreateInput
  /**
   * In case the Category was found with the provided `where` argument, update it with this data.
  **/
  update: CategoryUpdateInput
}


/**
 * Category delete
 */
export type CategoryDeleteArgs = {
  /**
   * Select specific fields to fetch from the Category
  **/
  select?: CategorySelect | null
  /**
   * Filter which Category to delete.
  **/
  where: CategoryWhereUniqueInput
}


/**
 * Category deleteMany
 */
export type CategoryDeleteManyArgs = {
  where?: CategoryWhereInput
}


/**
 * Category without action
 */
export type CategoryArgs = {
  /**
   * Select specific fields to fetch from the Category
  **/
  select?: CategorySelect | null
}



/**
 * Model Patient
 */

export type Patient = {
  firstName: string
  lastName: string
  email: string
}


export type AggregatePatient = {
  count: number
}



export type AggregatePatientArgs = {
  where?: PatientWhereInput
  orderBy?: Enumerable<PatientOrderByInput>
  cursor?: PatientWhereUniqueInput
  take?: number
  skip?: number
  distinct?: Enumerable<PatientDistinctFieldEnum>
  count?: true
}

export type GetPatientAggregateType<T extends AggregatePatientArgs> = {
  [P in keyof T]: P extends 'count' ? number : never
}


    
    

export type PatientSelect = {
  firstName?: boolean
  lastName?: boolean
  email?: boolean
}

export type PatientGetPayload<
  S extends boolean | null | undefined | PatientArgs,
  U = keyof S
> = S extends true
  ? Patient
  : S extends undefined
  ? never
  : S extends PatientArgs | FindManyPatientArgs
  ? 'include' extends U
    ? Patient 
  : 'select' extends U
    ? {
      [P in TrueKeys<S['select']>]:P extends keyof Patient ? Patient[P]
: 
 never
    }
  : Patient
: Patient


export interface PatientDelegate {
  /**
   * Find zero or one Patient.
   * @param {FindOnePatientArgs} args - Arguments to find a Patient
   * @example
   * // Get one Patient
   * const patient = await prisma.patient.findOne({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
  **/
  findOne<T extends FindOnePatientArgs>(
    args: Subset<T, FindOnePatientArgs>
  ): CheckSelect<T, Prisma__PatientClient<Patient | null>, Prisma__PatientClient<PatientGetPayload<T> | null>>
  /**
   * Find zero or more Patients.
   * @param {FindManyPatientArgs=} args - Arguments to filter and select certain fields only.
   * @example
   * // Get all Patients
   * const patients = await prisma.patient.findMany()
   * 
   * // Get first 10 Patients
   * const patients = await prisma.patient.findMany({ take: 10 })
   * 
   * // Only select the `firstName`
   * const patientWithFirstNameOnly = await prisma.patient.findMany({ select: { firstName: true } })
   * 
  **/
  findMany<T extends FindManyPatientArgs>(
    args?: Subset<T, FindManyPatientArgs>
  ): CheckSelect<T, Promise<Array<Patient>>, Promise<Array<PatientGetPayload<T>>>>
  /**
   * Create a Patient.
   * @param {PatientCreateArgs} args - Arguments to create a Patient.
   * @example
   * // Create one Patient
   * const Patient = await prisma.patient.create({
   *   data: {
   *     // ... data to create a Patient
   *   }
   * })
   * 
  **/
  create<T extends PatientCreateArgs>(
    args: Subset<T, PatientCreateArgs>
  ): CheckSelect<T, Prisma__PatientClient<Patient>, Prisma__PatientClient<PatientGetPayload<T>>>
  /**
   * Delete a Patient.
   * @param {PatientDeleteArgs} args - Arguments to delete one Patient.
   * @example
   * // Delete one Patient
   * const Patient = await prisma.patient.delete({
   *   where: {
   *     // ... filter to delete one Patient
   *   }
   * })
   * 
  **/
  delete<T extends PatientDeleteArgs>(
    args: Subset<T, PatientDeleteArgs>
  ): CheckSelect<T, Prisma__PatientClient<Patient>, Prisma__PatientClient<PatientGetPayload<T>>>
  /**
   * Update one Patient.
   * @param {PatientUpdateArgs} args - Arguments to update one Patient.
   * @example
   * // Update one Patient
   * const patient = await prisma.patient.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
  **/
  update<T extends PatientUpdateArgs>(
    args: Subset<T, PatientUpdateArgs>
  ): CheckSelect<T, Prisma__PatientClient<Patient>, Prisma__PatientClient<PatientGetPayload<T>>>
  /**
   * Delete zero or more Patients.
   * @param {PatientDeleteManyArgs} args - Arguments to filter Patients to delete.
   * @example
   * // Delete a few Patients
   * const { count } = await prisma.patient.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
  **/
  deleteMany<T extends PatientDeleteManyArgs>(
    args: Subset<T, PatientDeleteManyArgs>
  ): Promise<BatchPayload>
  /**
   * Update zero or more Patients.
   * @param {PatientUpdateManyArgs} args - Arguments to update one or more rows.
   * @example
   * // Update many Patients
   * const patient = await prisma.patient.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
  **/
  updateMany<T extends PatientUpdateManyArgs>(
    args: Subset<T, PatientUpdateManyArgs>
  ): Promise<BatchPayload>
  /**
   * Create or update one Patient.
   * @param {PatientUpsertArgs} args - Arguments to update or create a Patient.
   * @example
   * // Update or create a Patient
   * const patient = await prisma.patient.upsert({
   *   create: {
   *     // ... data to create a Patient
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the Patient we want to update
   *   }
   * })
  **/
  upsert<T extends PatientUpsertArgs>(
    args: Subset<T, PatientUpsertArgs>
  ): CheckSelect<T, Prisma__PatientClient<Patient>, Prisma__PatientClient<PatientGetPayload<T>>>
  /**
   * Count
   */
  count(args?: Omit<FindManyPatientArgs, 'select' | 'include'>): Promise<number>

  /**
   * Aggregate
   */
  aggregate<T extends AggregatePatientArgs>(args: Subset<T, AggregatePatientArgs>): Promise<GetPatientAggregateType<T>>
}

/**
 * The delegate class that acts as a "Promise-like" for Patient.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in 
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export declare class Prisma__PatientClient<T> implements Promise<T> {
  private readonly _dmmf;
  private readonly _fetcher;
  private readonly _queryType;
  private readonly _rootField;
  private readonly _clientMethod;
  private readonly _args;
  private readonly _dataPath;
  private readonly _errorFormat;
  private readonly _measurePerformance?;
  private _isList;
  private _callsite;
  private _requestPromise?;
  constructor(_dmmf: DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
  readonly [Symbol.toStringTag]: 'PrismaClientPromise';


  private get _document();
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | Promise<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | Promise<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | Promise<TResult>) | undefined | null): Promise<T | TResult>;
  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally?: (() => void) | undefined | null): Promise<T>;
}

// Custom InputTypes

/**
 * Patient findOne
 */
export type FindOnePatientArgs = {
  /**
   * Select specific fields to fetch from the Patient
  **/
  select?: PatientSelect | null
  /**
   * Filter, which Patient to fetch.
  **/
  where: PatientWhereUniqueInput
}


/**
 * Patient findMany
 */
export type FindManyPatientArgs = {
  /**
   * Select specific fields to fetch from the Patient
  **/
  select?: PatientSelect | null
  /**
   * Filter, which Patients to fetch.
  **/
  where?: PatientWhereInput
  /**
   * Determine the order of the Patients to fetch.
  **/
  orderBy?: Enumerable<PatientOrderByInput>
  /**
   * Sets the position for listing Patients.
  **/
  cursor?: PatientWhereUniqueInput
  /**
   * The number of Patients to fetch. If negative number, it will take Patients before the `cursor`.
  **/
  take?: number
  /**
   * Skip the first `n` Patients.
  **/
  skip?: number
  distinct?: Enumerable<PatientDistinctFieldEnum>
}


/**
 * Patient create
 */
export type PatientCreateArgs = {
  /**
   * Select specific fields to fetch from the Patient
  **/
  select?: PatientSelect | null
  /**
   * The data needed to create a Patient.
  **/
  data: PatientCreateInput
}


/**
 * Patient update
 */
export type PatientUpdateArgs = {
  /**
   * Select specific fields to fetch from the Patient
  **/
  select?: PatientSelect | null
  /**
   * The data needed to update a Patient.
  **/
  data: PatientUpdateInput
  /**
   * Choose, which Patient to update.
  **/
  where: PatientWhereUniqueInput
}


/**
 * Patient updateMany
 */
export type PatientUpdateManyArgs = {
  data: PatientUpdateManyMutationInput
  where?: PatientWhereInput
}


/**
 * Patient upsert
 */
export type PatientUpsertArgs = {
  /**
   * Select specific fields to fetch from the Patient
  **/
  select?: PatientSelect | null
  /**
   * The filter to search for the Patient to update in case it exists.
  **/
  where: PatientWhereUniqueInput
  /**
   * In case the Patient found by the `where` argument doesn't exist, create a new Patient with this data.
  **/
  create: PatientCreateInput
  /**
   * In case the Patient was found with the provided `where` argument, update it with this data.
  **/
  update: PatientUpdateInput
}


/**
 * Patient delete
 */
export type PatientDeleteArgs = {
  /**
   * Select specific fields to fetch from the Patient
  **/
  select?: PatientSelect | null
  /**
   * Filter which Patient to delete.
  **/
  where: PatientWhereUniqueInput
}


/**
 * Patient deleteMany
 */
export type PatientDeleteManyArgs = {
  where?: PatientWhereInput
}


/**
 * Patient without action
 */
export type PatientArgs = {
  /**
   * Select specific fields to fetch from the Patient
  **/
  select?: PatientSelect | null
}



/**
 * Model Movie
 */

export type Movie = {
  directorFirstName: string
  directorLastName: string
  title: string
}


export type AggregateMovie = {
  count: number
}



export type AggregateMovieArgs = {
  where?: MovieWhereInput
  orderBy?: Enumerable<MovieOrderByInput>
  cursor?: MovieWhereUniqueInput
  take?: number
  skip?: number
  distinct?: Enumerable<MovieDistinctFieldEnum>
  count?: true
}

export type GetMovieAggregateType<T extends AggregateMovieArgs> = {
  [P in keyof T]: P extends 'count' ? number : never
}


    
    

export type MovieSelect = {
  directorFirstName?: boolean
  directorLastName?: boolean
  director?: boolean | DirectorArgs
  title?: boolean
}

export type MovieInclude = {
  director?: boolean | DirectorArgs
}

export type MovieGetPayload<
  S extends boolean | null | undefined | MovieArgs,
  U = keyof S
> = S extends true
  ? Movie
  : S extends undefined
  ? never
  : S extends MovieArgs | FindManyMovieArgs
  ? 'include' extends U
    ? Movie  & {
      [P in TrueKeys<S['include']>]:
      P extends 'director'
      ? DirectorGetPayload<S['include'][P]> : never
    }
  : 'select' extends U
    ? {
      [P in TrueKeys<S['select']>]:P extends keyof Movie ? Movie[P]
: 
      P extends 'director'
      ? DirectorGetPayload<S['select'][P]> : never
    }
  : Movie
: Movie


export interface MovieDelegate {
  /**
   * Find zero or one Movie.
   * @param {FindOneMovieArgs} args - Arguments to find a Movie
   * @example
   * // Get one Movie
   * const movie = await prisma.movie.findOne({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
  **/
  findOne<T extends FindOneMovieArgs>(
    args: Subset<T, FindOneMovieArgs>
  ): CheckSelect<T, Prisma__MovieClient<Movie | null>, Prisma__MovieClient<MovieGetPayload<T> | null>>
  /**
   * Find zero or more Movies.
   * @param {FindManyMovieArgs=} args - Arguments to filter and select certain fields only.
   * @example
   * // Get all Movies
   * const movies = await prisma.movie.findMany()
   * 
   * // Get first 10 Movies
   * const movies = await prisma.movie.findMany({ take: 10 })
   * 
   * // Only select the `directorFirstName`
   * const movieWithDirectorFirstNameOnly = await prisma.movie.findMany({ select: { directorFirstName: true } })
   * 
  **/
  findMany<T extends FindManyMovieArgs>(
    args?: Subset<T, FindManyMovieArgs>
  ): CheckSelect<T, Promise<Array<Movie>>, Promise<Array<MovieGetPayload<T>>>>
  /**
   * Create a Movie.
   * @param {MovieCreateArgs} args - Arguments to create a Movie.
   * @example
   * // Create one Movie
   * const Movie = await prisma.movie.create({
   *   data: {
   *     // ... data to create a Movie
   *   }
   * })
   * 
  **/
  create<T extends MovieCreateArgs>(
    args: Subset<T, MovieCreateArgs>
  ): CheckSelect<T, Prisma__MovieClient<Movie>, Prisma__MovieClient<MovieGetPayload<T>>>
  /**
   * Delete a Movie.
   * @param {MovieDeleteArgs} args - Arguments to delete one Movie.
   * @example
   * // Delete one Movie
   * const Movie = await prisma.movie.delete({
   *   where: {
   *     // ... filter to delete one Movie
   *   }
   * })
   * 
  **/
  delete<T extends MovieDeleteArgs>(
    args: Subset<T, MovieDeleteArgs>
  ): CheckSelect<T, Prisma__MovieClient<Movie>, Prisma__MovieClient<MovieGetPayload<T>>>
  /**
   * Update one Movie.
   * @param {MovieUpdateArgs} args - Arguments to update one Movie.
   * @example
   * // Update one Movie
   * const movie = await prisma.movie.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
  **/
  update<T extends MovieUpdateArgs>(
    args: Subset<T, MovieUpdateArgs>
  ): CheckSelect<T, Prisma__MovieClient<Movie>, Prisma__MovieClient<MovieGetPayload<T>>>
  /**
   * Delete zero or more Movies.
   * @param {MovieDeleteManyArgs} args - Arguments to filter Movies to delete.
   * @example
   * // Delete a few Movies
   * const { count } = await prisma.movie.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
  **/
  deleteMany<T extends MovieDeleteManyArgs>(
    args: Subset<T, MovieDeleteManyArgs>
  ): Promise<BatchPayload>
  /**
   * Update zero or more Movies.
   * @param {MovieUpdateManyArgs} args - Arguments to update one or more rows.
   * @example
   * // Update many Movies
   * const movie = await prisma.movie.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
  **/
  updateMany<T extends MovieUpdateManyArgs>(
    args: Subset<T, MovieUpdateManyArgs>
  ): Promise<BatchPayload>
  /**
   * Create or update one Movie.
   * @param {MovieUpsertArgs} args - Arguments to update or create a Movie.
   * @example
   * // Update or create a Movie
   * const movie = await prisma.movie.upsert({
   *   create: {
   *     // ... data to create a Movie
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the Movie we want to update
   *   }
   * })
  **/
  upsert<T extends MovieUpsertArgs>(
    args: Subset<T, MovieUpsertArgs>
  ): CheckSelect<T, Prisma__MovieClient<Movie>, Prisma__MovieClient<MovieGetPayload<T>>>
  /**
   * Count
   */
  count(args?: Omit<FindManyMovieArgs, 'select' | 'include'>): Promise<number>

  /**
   * Aggregate
   */
  aggregate<T extends AggregateMovieArgs>(args: Subset<T, AggregateMovieArgs>): Promise<GetMovieAggregateType<T>>
}

/**
 * The delegate class that acts as a "Promise-like" for Movie.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in 
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export declare class Prisma__MovieClient<T> implements Promise<T> {
  private readonly _dmmf;
  private readonly _fetcher;
  private readonly _queryType;
  private readonly _rootField;
  private readonly _clientMethod;
  private readonly _args;
  private readonly _dataPath;
  private readonly _errorFormat;
  private readonly _measurePerformance?;
  private _isList;
  private _callsite;
  private _requestPromise?;
  constructor(_dmmf: DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
  readonly [Symbol.toStringTag]: 'PrismaClientPromise';

  director<T extends DirectorArgs = {}>(args?: Subset<T, DirectorArgs>): CheckSelect<T, Prisma__DirectorClient<Director | null>, Prisma__DirectorClient<DirectorGetPayload<T> | null>>;

  private get _document();
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | Promise<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | Promise<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | Promise<TResult>) | undefined | null): Promise<T | TResult>;
  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally?: (() => void) | undefined | null): Promise<T>;
}

// Custom InputTypes

/**
 * Movie findOne
 */
export type FindOneMovieArgs = {
  /**
   * Select specific fields to fetch from the Movie
  **/
  select?: MovieSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: MovieInclude | null
  /**
   * Filter, which Movie to fetch.
  **/
  where: MovieWhereUniqueInput
}


/**
 * Movie findMany
 */
export type FindManyMovieArgs = {
  /**
   * Select specific fields to fetch from the Movie
  **/
  select?: MovieSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: MovieInclude | null
  /**
   * Filter, which Movies to fetch.
  **/
  where?: MovieWhereInput
  /**
   * Determine the order of the Movies to fetch.
  **/
  orderBy?: Enumerable<MovieOrderByInput>
  /**
   * Sets the position for listing Movies.
  **/
  cursor?: MovieWhereUniqueInput
  /**
   * The number of Movies to fetch. If negative number, it will take Movies before the `cursor`.
  **/
  take?: number
  /**
   * Skip the first `n` Movies.
  **/
  skip?: number
  distinct?: Enumerable<MovieDistinctFieldEnum>
}


/**
 * Movie create
 */
export type MovieCreateArgs = {
  /**
   * Select specific fields to fetch from the Movie
  **/
  select?: MovieSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: MovieInclude | null
  /**
   * The data needed to create a Movie.
  **/
  data: MovieCreateInput
}


/**
 * Movie update
 */
export type MovieUpdateArgs = {
  /**
   * Select specific fields to fetch from the Movie
  **/
  select?: MovieSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: MovieInclude | null
  /**
   * The data needed to update a Movie.
  **/
  data: MovieUpdateInput
  /**
   * Choose, which Movie to update.
  **/
  where: MovieWhereUniqueInput
}


/**
 * Movie updateMany
 */
export type MovieUpdateManyArgs = {
  data: MovieUpdateManyMutationInput
  where?: MovieWhereInput
}


/**
 * Movie upsert
 */
export type MovieUpsertArgs = {
  /**
   * Select specific fields to fetch from the Movie
  **/
  select?: MovieSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: MovieInclude | null
  /**
   * The filter to search for the Movie to update in case it exists.
  **/
  where: MovieWhereUniqueInput
  /**
   * In case the Movie found by the `where` argument doesn't exist, create a new Movie with this data.
  **/
  create: MovieCreateInput
  /**
   * In case the Movie was found with the provided `where` argument, update it with this data.
  **/
  update: MovieUpdateInput
}


/**
 * Movie delete
 */
export type MovieDeleteArgs = {
  /**
   * Select specific fields to fetch from the Movie
  **/
  select?: MovieSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: MovieInclude | null
  /**
   * Filter which Movie to delete.
  **/
  where: MovieWhereUniqueInput
}


/**
 * Movie deleteMany
 */
export type MovieDeleteManyArgs = {
  where?: MovieWhereInput
}


/**
 * Movie without action
 */
export type MovieArgs = {
  /**
   * Select specific fields to fetch from the Movie
  **/
  select?: MovieSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: MovieInclude | null
}



/**
 * Model Director
 */

export type Director = {
  firstName: string
  lastName: string
}


export type AggregateDirector = {
  count: number
}



export type AggregateDirectorArgs = {
  where?: DirectorWhereInput
  orderBy?: Enumerable<DirectorOrderByInput>
  cursor?: DirectorWhereUniqueInput
  take?: number
  skip?: number
  distinct?: Enumerable<DirectorDistinctFieldEnum>
  count?: true
}

export type GetDirectorAggregateType<T extends AggregateDirectorArgs> = {
  [P in keyof T]: P extends 'count' ? number : never
}


    
    

export type DirectorSelect = {
  firstName?: boolean
  lastName?: boolean
  movies?: boolean | FindManyMovieArgs
}

export type DirectorInclude = {
  movies?: boolean | FindManyMovieArgs
}

export type DirectorGetPayload<
  S extends boolean | null | undefined | DirectorArgs,
  U = keyof S
> = S extends true
  ? Director
  : S extends undefined
  ? never
  : S extends DirectorArgs | FindManyDirectorArgs
  ? 'include' extends U
    ? Director  & {
      [P in TrueKeys<S['include']>]:
      P extends 'movies'
      ? Array<MovieGetPayload<S['include'][P]>> : never
    }
  : 'select' extends U
    ? {
      [P in TrueKeys<S['select']>]:P extends keyof Director ? Director[P]
: 
      P extends 'movies'
      ? Array<MovieGetPayload<S['select'][P]>> : never
    }
  : Director
: Director


export interface DirectorDelegate {
  /**
   * Find zero or one Director.
   * @param {FindOneDirectorArgs} args - Arguments to find a Director
   * @example
   * // Get one Director
   * const director = await prisma.director.findOne({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
  **/
  findOne<T extends FindOneDirectorArgs>(
    args: Subset<T, FindOneDirectorArgs>
  ): CheckSelect<T, Prisma__DirectorClient<Director | null>, Prisma__DirectorClient<DirectorGetPayload<T> | null>>
  /**
   * Find zero or more Directors.
   * @param {FindManyDirectorArgs=} args - Arguments to filter and select certain fields only.
   * @example
   * // Get all Directors
   * const directors = await prisma.director.findMany()
   * 
   * // Get first 10 Directors
   * const directors = await prisma.director.findMany({ take: 10 })
   * 
   * // Only select the `firstName`
   * const directorWithFirstNameOnly = await prisma.director.findMany({ select: { firstName: true } })
   * 
  **/
  findMany<T extends FindManyDirectorArgs>(
    args?: Subset<T, FindManyDirectorArgs>
  ): CheckSelect<T, Promise<Array<Director>>, Promise<Array<DirectorGetPayload<T>>>>
  /**
   * Create a Director.
   * @param {DirectorCreateArgs} args - Arguments to create a Director.
   * @example
   * // Create one Director
   * const Director = await prisma.director.create({
   *   data: {
   *     // ... data to create a Director
   *   }
   * })
   * 
  **/
  create<T extends DirectorCreateArgs>(
    args: Subset<T, DirectorCreateArgs>
  ): CheckSelect<T, Prisma__DirectorClient<Director>, Prisma__DirectorClient<DirectorGetPayload<T>>>
  /**
   * Delete a Director.
   * @param {DirectorDeleteArgs} args - Arguments to delete one Director.
   * @example
   * // Delete one Director
   * const Director = await prisma.director.delete({
   *   where: {
   *     // ... filter to delete one Director
   *   }
   * })
   * 
  **/
  delete<T extends DirectorDeleteArgs>(
    args: Subset<T, DirectorDeleteArgs>
  ): CheckSelect<T, Prisma__DirectorClient<Director>, Prisma__DirectorClient<DirectorGetPayload<T>>>
  /**
   * Update one Director.
   * @param {DirectorUpdateArgs} args - Arguments to update one Director.
   * @example
   * // Update one Director
   * const director = await prisma.director.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
  **/
  update<T extends DirectorUpdateArgs>(
    args: Subset<T, DirectorUpdateArgs>
  ): CheckSelect<T, Prisma__DirectorClient<Director>, Prisma__DirectorClient<DirectorGetPayload<T>>>
  /**
   * Delete zero or more Directors.
   * @param {DirectorDeleteManyArgs} args - Arguments to filter Directors to delete.
   * @example
   * // Delete a few Directors
   * const { count } = await prisma.director.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
  **/
  deleteMany<T extends DirectorDeleteManyArgs>(
    args: Subset<T, DirectorDeleteManyArgs>
  ): Promise<BatchPayload>
  /**
   * Update zero or more Directors.
   * @param {DirectorUpdateManyArgs} args - Arguments to update one or more rows.
   * @example
   * // Update many Directors
   * const director = await prisma.director.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
  **/
  updateMany<T extends DirectorUpdateManyArgs>(
    args: Subset<T, DirectorUpdateManyArgs>
  ): Promise<BatchPayload>
  /**
   * Create or update one Director.
   * @param {DirectorUpsertArgs} args - Arguments to update or create a Director.
   * @example
   * // Update or create a Director
   * const director = await prisma.director.upsert({
   *   create: {
   *     // ... data to create a Director
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the Director we want to update
   *   }
   * })
  **/
  upsert<T extends DirectorUpsertArgs>(
    args: Subset<T, DirectorUpsertArgs>
  ): CheckSelect<T, Prisma__DirectorClient<Director>, Prisma__DirectorClient<DirectorGetPayload<T>>>
  /**
   * Count
   */
  count(args?: Omit<FindManyDirectorArgs, 'select' | 'include'>): Promise<number>

  /**
   * Aggregate
   */
  aggregate<T extends AggregateDirectorArgs>(args: Subset<T, AggregateDirectorArgs>): Promise<GetDirectorAggregateType<T>>
}

/**
 * The delegate class that acts as a "Promise-like" for Director.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in 
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export declare class Prisma__DirectorClient<T> implements Promise<T> {
  private readonly _dmmf;
  private readonly _fetcher;
  private readonly _queryType;
  private readonly _rootField;
  private readonly _clientMethod;
  private readonly _args;
  private readonly _dataPath;
  private readonly _errorFormat;
  private readonly _measurePerformance?;
  private _isList;
  private _callsite;
  private _requestPromise?;
  constructor(_dmmf: DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
  readonly [Symbol.toStringTag]: 'PrismaClientPromise';

  movies<T extends FindManyMovieArgs = {}>(args?: Subset<T, FindManyMovieArgs>): CheckSelect<T, Promise<Array<Movie>>, Promise<Array<MovieGetPayload<T>>>>;

  private get _document();
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | Promise<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | Promise<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | Promise<TResult>) | undefined | null): Promise<T | TResult>;
  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally?: (() => void) | undefined | null): Promise<T>;
}

// Custom InputTypes

/**
 * Director findOne
 */
export type FindOneDirectorArgs = {
  /**
   * Select specific fields to fetch from the Director
  **/
  select?: DirectorSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: DirectorInclude | null
  /**
   * Filter, which Director to fetch.
  **/
  where: DirectorWhereUniqueInput
}


/**
 * Director findMany
 */
export type FindManyDirectorArgs = {
  /**
   * Select specific fields to fetch from the Director
  **/
  select?: DirectorSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: DirectorInclude | null
  /**
   * Filter, which Directors to fetch.
  **/
  where?: DirectorWhereInput
  /**
   * Determine the order of the Directors to fetch.
  **/
  orderBy?: Enumerable<DirectorOrderByInput>
  /**
   * Sets the position for listing Directors.
  **/
  cursor?: DirectorWhereUniqueInput
  /**
   * The number of Directors to fetch. If negative number, it will take Directors before the `cursor`.
  **/
  take?: number
  /**
   * Skip the first `n` Directors.
  **/
  skip?: number
  distinct?: Enumerable<DirectorDistinctFieldEnum>
}


/**
 * Director create
 */
export type DirectorCreateArgs = {
  /**
   * Select specific fields to fetch from the Director
  **/
  select?: DirectorSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: DirectorInclude | null
  /**
   * The data needed to create a Director.
  **/
  data: DirectorCreateInput
}


/**
 * Director update
 */
export type DirectorUpdateArgs = {
  /**
   * Select specific fields to fetch from the Director
  **/
  select?: DirectorSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: DirectorInclude | null
  /**
   * The data needed to update a Director.
  **/
  data: DirectorUpdateInput
  /**
   * Choose, which Director to update.
  **/
  where: DirectorWhereUniqueInput
}


/**
 * Director updateMany
 */
export type DirectorUpdateManyArgs = {
  data: DirectorUpdateManyMutationInput
  where?: DirectorWhereInput
}


/**
 * Director upsert
 */
export type DirectorUpsertArgs = {
  /**
   * Select specific fields to fetch from the Director
  **/
  select?: DirectorSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: DirectorInclude | null
  /**
   * The filter to search for the Director to update in case it exists.
  **/
  where: DirectorWhereUniqueInput
  /**
   * In case the Director found by the `where` argument doesn't exist, create a new Director with this data.
  **/
  create: DirectorCreateInput
  /**
   * In case the Director was found with the provided `where` argument, update it with this data.
  **/
  update: DirectorUpdateInput
}


/**
 * Director delete
 */
export type DirectorDeleteArgs = {
  /**
   * Select specific fields to fetch from the Director
  **/
  select?: DirectorSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: DirectorInclude | null
  /**
   * Filter which Director to delete.
  **/
  where: DirectorWhereUniqueInput
}


/**
 * Director deleteMany
 */
export type DirectorDeleteManyArgs = {
  where?: DirectorWhereInput
}


/**
 * Director without action
 */
export type DirectorArgs = {
  /**
   * Select specific fields to fetch from the Director
  **/
  select?: DirectorSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: DirectorInclude | null
}



/**
 * Model Problem
 */

export type Problem = {
  id: number
  problemText: string
  creatorId: number | null
}


export type AggregateProblem = {
  count: number
  avg: ProblemAvgAggregateOutputType | null
  sum: ProblemSumAggregateOutputType | null
  min: ProblemMinAggregateOutputType | null
  max: ProblemMaxAggregateOutputType | null
}

export type ProblemAvgAggregateOutputType = {
  id: number
  creatorId: number
}

export type ProblemSumAggregateOutputType = {
  id: number
  creatorId: number | null
}

export type ProblemMinAggregateOutputType = {
  id: number
  creatorId: number | null
}

export type ProblemMaxAggregateOutputType = {
  id: number
  creatorId: number | null
}


export type ProblemAvgAggregateInputType = {
  id?: true
  creatorId?: true
}

export type ProblemSumAggregateInputType = {
  id?: true
  creatorId?: true
}

export type ProblemMinAggregateInputType = {
  id?: true
  creatorId?: true
}

export type ProblemMaxAggregateInputType = {
  id?: true
  creatorId?: true
}

export type AggregateProblemArgs = {
  where?: ProblemWhereInput
  orderBy?: Enumerable<ProblemOrderByInput>
  cursor?: ProblemWhereUniqueInput
  take?: number
  skip?: number
  distinct?: Enumerable<ProblemDistinctFieldEnum>
  count?: true
  avg?: ProblemAvgAggregateInputType
  sum?: ProblemSumAggregateInputType
  min?: ProblemMinAggregateInputType
  max?: ProblemMaxAggregateInputType
}

export type GetProblemAggregateType<T extends AggregateProblemArgs> = {
  [P in keyof T]: P extends 'count' ? number : GetProblemAggregateScalarType<T[P]>
}

export type GetProblemAggregateScalarType<T extends any> = {
  [P in keyof T]: P extends keyof ProblemAvgAggregateOutputType ? ProblemAvgAggregateOutputType[P] : never
}
    
    

export type ProblemSelect = {
  id?: boolean
  problemText?: boolean
  likedBy?: boolean | FindManyCreatorArgs
  creator?: boolean | CreatorArgs
  creatorId?: boolean
}

export type ProblemInclude = {
  likedBy?: boolean | FindManyCreatorArgs
  creator?: boolean | CreatorArgs
}

export type ProblemGetPayload<
  S extends boolean | null | undefined | ProblemArgs,
  U = keyof S
> = S extends true
  ? Problem
  : S extends undefined
  ? never
  : S extends ProblemArgs | FindManyProblemArgs
  ? 'include' extends U
    ? Problem  & {
      [P in TrueKeys<S['include']>]:
      P extends 'likedBy'
      ? Array<CreatorGetPayload<S['include'][P]>> :
      P extends 'creator'
      ? CreatorGetPayload<S['include'][P]> | null : never
    }
  : 'select' extends U
    ? {
      [P in TrueKeys<S['select']>]:P extends keyof Problem ? Problem[P]
: 
      P extends 'likedBy'
      ? Array<CreatorGetPayload<S['select'][P]>> :
      P extends 'creator'
      ? CreatorGetPayload<S['select'][P]> | null : never
    }
  : Problem
: Problem


export interface ProblemDelegate {
  /**
   * Find zero or one Problem.
   * @param {FindOneProblemArgs} args - Arguments to find a Problem
   * @example
   * // Get one Problem
   * const problem = await prisma.problem.findOne({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
  **/
  findOne<T extends FindOneProblemArgs>(
    args: Subset<T, FindOneProblemArgs>
  ): CheckSelect<T, Prisma__ProblemClient<Problem | null>, Prisma__ProblemClient<ProblemGetPayload<T> | null>>
  /**
   * Find zero or more Problems.
   * @param {FindManyProblemArgs=} args - Arguments to filter and select certain fields only.
   * @example
   * // Get all Problems
   * const problems = await prisma.problem.findMany()
   * 
   * // Get first 10 Problems
   * const problems = await prisma.problem.findMany({ take: 10 })
   * 
   * // Only select the `id`
   * const problemWithIdOnly = await prisma.problem.findMany({ select: { id: true } })
   * 
  **/
  findMany<T extends FindManyProblemArgs>(
    args?: Subset<T, FindManyProblemArgs>
  ): CheckSelect<T, Promise<Array<Problem>>, Promise<Array<ProblemGetPayload<T>>>>
  /**
   * Create a Problem.
   * @param {ProblemCreateArgs} args - Arguments to create a Problem.
   * @example
   * // Create one Problem
   * const Problem = await prisma.problem.create({
   *   data: {
   *     // ... data to create a Problem
   *   }
   * })
   * 
  **/
  create<T extends ProblemCreateArgs>(
    args: Subset<T, ProblemCreateArgs>
  ): CheckSelect<T, Prisma__ProblemClient<Problem>, Prisma__ProblemClient<ProblemGetPayload<T>>>
  /**
   * Delete a Problem.
   * @param {ProblemDeleteArgs} args - Arguments to delete one Problem.
   * @example
   * // Delete one Problem
   * const Problem = await prisma.problem.delete({
   *   where: {
   *     // ... filter to delete one Problem
   *   }
   * })
   * 
  **/
  delete<T extends ProblemDeleteArgs>(
    args: Subset<T, ProblemDeleteArgs>
  ): CheckSelect<T, Prisma__ProblemClient<Problem>, Prisma__ProblemClient<ProblemGetPayload<T>>>
  /**
   * Update one Problem.
   * @param {ProblemUpdateArgs} args - Arguments to update one Problem.
   * @example
   * // Update one Problem
   * const problem = await prisma.problem.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
  **/
  update<T extends ProblemUpdateArgs>(
    args: Subset<T, ProblemUpdateArgs>
  ): CheckSelect<T, Prisma__ProblemClient<Problem>, Prisma__ProblemClient<ProblemGetPayload<T>>>
  /**
   * Delete zero or more Problems.
   * @param {ProblemDeleteManyArgs} args - Arguments to filter Problems to delete.
   * @example
   * // Delete a few Problems
   * const { count } = await prisma.problem.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
  **/
  deleteMany<T extends ProblemDeleteManyArgs>(
    args: Subset<T, ProblemDeleteManyArgs>
  ): Promise<BatchPayload>
  /**
   * Update zero or more Problems.
   * @param {ProblemUpdateManyArgs} args - Arguments to update one or more rows.
   * @example
   * // Update many Problems
   * const problem = await prisma.problem.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
  **/
  updateMany<T extends ProblemUpdateManyArgs>(
    args: Subset<T, ProblemUpdateManyArgs>
  ): Promise<BatchPayload>
  /**
   * Create or update one Problem.
   * @param {ProblemUpsertArgs} args - Arguments to update or create a Problem.
   * @example
   * // Update or create a Problem
   * const problem = await prisma.problem.upsert({
   *   create: {
   *     // ... data to create a Problem
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the Problem we want to update
   *   }
   * })
  **/
  upsert<T extends ProblemUpsertArgs>(
    args: Subset<T, ProblemUpsertArgs>
  ): CheckSelect<T, Prisma__ProblemClient<Problem>, Prisma__ProblemClient<ProblemGetPayload<T>>>
  /**
   * Count
   */
  count(args?: Omit<FindManyProblemArgs, 'select' | 'include'>): Promise<number>

  /**
   * Aggregate
   */
  aggregate<T extends AggregateProblemArgs>(args: Subset<T, AggregateProblemArgs>): Promise<GetProblemAggregateType<T>>
}

/**
 * The delegate class that acts as a "Promise-like" for Problem.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in 
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export declare class Prisma__ProblemClient<T> implements Promise<T> {
  private readonly _dmmf;
  private readonly _fetcher;
  private readonly _queryType;
  private readonly _rootField;
  private readonly _clientMethod;
  private readonly _args;
  private readonly _dataPath;
  private readonly _errorFormat;
  private readonly _measurePerformance?;
  private _isList;
  private _callsite;
  private _requestPromise?;
  constructor(_dmmf: DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
  readonly [Symbol.toStringTag]: 'PrismaClientPromise';

  likedBy<T extends FindManyCreatorArgs = {}>(args?: Subset<T, FindManyCreatorArgs>): CheckSelect<T, Promise<Array<Creator>>, Promise<Array<CreatorGetPayload<T>>>>;

  creator<T extends CreatorArgs = {}>(args?: Subset<T, CreatorArgs>): CheckSelect<T, Prisma__CreatorClient<Creator | null>, Prisma__CreatorClient<CreatorGetPayload<T> | null>>;

  private get _document();
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | Promise<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | Promise<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | Promise<TResult>) | undefined | null): Promise<T | TResult>;
  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally?: (() => void) | undefined | null): Promise<T>;
}

// Custom InputTypes

/**
 * Problem findOne
 */
export type FindOneProblemArgs = {
  /**
   * Select specific fields to fetch from the Problem
  **/
  select?: ProblemSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: ProblemInclude | null
  /**
   * Filter, which Problem to fetch.
  **/
  where: ProblemWhereUniqueInput
}


/**
 * Problem findMany
 */
export type FindManyProblemArgs = {
  /**
   * Select specific fields to fetch from the Problem
  **/
  select?: ProblemSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: ProblemInclude | null
  /**
   * Filter, which Problems to fetch.
  **/
  where?: ProblemWhereInput
  /**
   * Determine the order of the Problems to fetch.
  **/
  orderBy?: Enumerable<ProblemOrderByInput>
  /**
   * Sets the position for listing Problems.
  **/
  cursor?: ProblemWhereUniqueInput
  /**
   * The number of Problems to fetch. If negative number, it will take Problems before the `cursor`.
  **/
  take?: number
  /**
   * Skip the first `n` Problems.
  **/
  skip?: number
  distinct?: Enumerable<ProblemDistinctFieldEnum>
}


/**
 * Problem create
 */
export type ProblemCreateArgs = {
  /**
   * Select specific fields to fetch from the Problem
  **/
  select?: ProblemSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: ProblemInclude | null
  /**
   * The data needed to create a Problem.
  **/
  data: ProblemCreateInput
}


/**
 * Problem update
 */
export type ProblemUpdateArgs = {
  /**
   * Select specific fields to fetch from the Problem
  **/
  select?: ProblemSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: ProblemInclude | null
  /**
   * The data needed to update a Problem.
  **/
  data: ProblemUpdateInput
  /**
   * Choose, which Problem to update.
  **/
  where: ProblemWhereUniqueInput
}


/**
 * Problem updateMany
 */
export type ProblemUpdateManyArgs = {
  data: ProblemUpdateManyMutationInput
  where?: ProblemWhereInput
}


/**
 * Problem upsert
 */
export type ProblemUpsertArgs = {
  /**
   * Select specific fields to fetch from the Problem
  **/
  select?: ProblemSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: ProblemInclude | null
  /**
   * The filter to search for the Problem to update in case it exists.
  **/
  where: ProblemWhereUniqueInput
  /**
   * In case the Problem found by the `where` argument doesn't exist, create a new Problem with this data.
  **/
  create: ProblemCreateInput
  /**
   * In case the Problem was found with the provided `where` argument, update it with this data.
  **/
  update: ProblemUpdateInput
}


/**
 * Problem delete
 */
export type ProblemDeleteArgs = {
  /**
   * Select specific fields to fetch from the Problem
  **/
  select?: ProblemSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: ProblemInclude | null
  /**
   * Filter which Problem to delete.
  **/
  where: ProblemWhereUniqueInput
}


/**
 * Problem deleteMany
 */
export type ProblemDeleteManyArgs = {
  where?: ProblemWhereInput
}


/**
 * Problem without action
 */
export type ProblemArgs = {
  /**
   * Select specific fields to fetch from the Problem
  **/
  select?: ProblemSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: ProblemInclude | null
}



/**
 * Model Creator
 */

export type Creator = {
  id: number
  name: string
}


export type AggregateCreator = {
  count: number
  avg: CreatorAvgAggregateOutputType | null
  sum: CreatorSumAggregateOutputType | null
  min: CreatorMinAggregateOutputType | null
  max: CreatorMaxAggregateOutputType | null
}

export type CreatorAvgAggregateOutputType = {
  id: number
}

export type CreatorSumAggregateOutputType = {
  id: number
}

export type CreatorMinAggregateOutputType = {
  id: number
}

export type CreatorMaxAggregateOutputType = {
  id: number
}


export type CreatorAvgAggregateInputType = {
  id?: true
}

export type CreatorSumAggregateInputType = {
  id?: true
}

export type CreatorMinAggregateInputType = {
  id?: true
}

export type CreatorMaxAggregateInputType = {
  id?: true
}

export type AggregateCreatorArgs = {
  where?: CreatorWhereInput
  orderBy?: Enumerable<CreatorOrderByInput>
  cursor?: CreatorWhereUniqueInput
  take?: number
  skip?: number
  distinct?: Enumerable<CreatorDistinctFieldEnum>
  count?: true
  avg?: CreatorAvgAggregateInputType
  sum?: CreatorSumAggregateInputType
  min?: CreatorMinAggregateInputType
  max?: CreatorMaxAggregateInputType
}

export type GetCreatorAggregateType<T extends AggregateCreatorArgs> = {
  [P in keyof T]: P extends 'count' ? number : GetCreatorAggregateScalarType<T[P]>
}

export type GetCreatorAggregateScalarType<T extends any> = {
  [P in keyof T]: P extends keyof CreatorAvgAggregateOutputType ? CreatorAvgAggregateOutputType[P] : never
}
    
    

export type CreatorSelect = {
  id?: boolean
  name?: boolean
  likes?: boolean | FindManyProblemArgs
  problems?: boolean | FindManyProblemArgs
}

export type CreatorInclude = {
  likes?: boolean | FindManyProblemArgs
  problems?: boolean | FindManyProblemArgs
}

export type CreatorGetPayload<
  S extends boolean | null | undefined | CreatorArgs,
  U = keyof S
> = S extends true
  ? Creator
  : S extends undefined
  ? never
  : S extends CreatorArgs | FindManyCreatorArgs
  ? 'include' extends U
    ? Creator  & {
      [P in TrueKeys<S['include']>]:
      P extends 'likes'
      ? Array<ProblemGetPayload<S['include'][P]>> :
      P extends 'problems'
      ? Array<ProblemGetPayload<S['include'][P]>> : never
    }
  : 'select' extends U
    ? {
      [P in TrueKeys<S['select']>]:P extends keyof Creator ? Creator[P]
: 
      P extends 'likes'
      ? Array<ProblemGetPayload<S['select'][P]>> :
      P extends 'problems'
      ? Array<ProblemGetPayload<S['select'][P]>> : never
    }
  : Creator
: Creator


export interface CreatorDelegate {
  /**
   * Find zero or one Creator.
   * @param {FindOneCreatorArgs} args - Arguments to find a Creator
   * @example
   * // Get one Creator
   * const creator = await prisma.creator.findOne({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
  **/
  findOne<T extends FindOneCreatorArgs>(
    args: Subset<T, FindOneCreatorArgs>
  ): CheckSelect<T, Prisma__CreatorClient<Creator | null>, Prisma__CreatorClient<CreatorGetPayload<T> | null>>
  /**
   * Find zero or more Creators.
   * @param {FindManyCreatorArgs=} args - Arguments to filter and select certain fields only.
   * @example
   * // Get all Creators
   * const creators = await prisma.creator.findMany()
   * 
   * // Get first 10 Creators
   * const creators = await prisma.creator.findMany({ take: 10 })
   * 
   * // Only select the `id`
   * const creatorWithIdOnly = await prisma.creator.findMany({ select: { id: true } })
   * 
  **/
  findMany<T extends FindManyCreatorArgs>(
    args?: Subset<T, FindManyCreatorArgs>
  ): CheckSelect<T, Promise<Array<Creator>>, Promise<Array<CreatorGetPayload<T>>>>
  /**
   * Create a Creator.
   * @param {CreatorCreateArgs} args - Arguments to create a Creator.
   * @example
   * // Create one Creator
   * const Creator = await prisma.creator.create({
   *   data: {
   *     // ... data to create a Creator
   *   }
   * })
   * 
  **/
  create<T extends CreatorCreateArgs>(
    args: Subset<T, CreatorCreateArgs>
  ): CheckSelect<T, Prisma__CreatorClient<Creator>, Prisma__CreatorClient<CreatorGetPayload<T>>>
  /**
   * Delete a Creator.
   * @param {CreatorDeleteArgs} args - Arguments to delete one Creator.
   * @example
   * // Delete one Creator
   * const Creator = await prisma.creator.delete({
   *   where: {
   *     // ... filter to delete one Creator
   *   }
   * })
   * 
  **/
  delete<T extends CreatorDeleteArgs>(
    args: Subset<T, CreatorDeleteArgs>
  ): CheckSelect<T, Prisma__CreatorClient<Creator>, Prisma__CreatorClient<CreatorGetPayload<T>>>
  /**
   * Update one Creator.
   * @param {CreatorUpdateArgs} args - Arguments to update one Creator.
   * @example
   * // Update one Creator
   * const creator = await prisma.creator.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
  **/
  update<T extends CreatorUpdateArgs>(
    args: Subset<T, CreatorUpdateArgs>
  ): CheckSelect<T, Prisma__CreatorClient<Creator>, Prisma__CreatorClient<CreatorGetPayload<T>>>
  /**
   * Delete zero or more Creators.
   * @param {CreatorDeleteManyArgs} args - Arguments to filter Creators to delete.
   * @example
   * // Delete a few Creators
   * const { count } = await prisma.creator.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
  **/
  deleteMany<T extends CreatorDeleteManyArgs>(
    args: Subset<T, CreatorDeleteManyArgs>
  ): Promise<BatchPayload>
  /**
   * Update zero or more Creators.
   * @param {CreatorUpdateManyArgs} args - Arguments to update one or more rows.
   * @example
   * // Update many Creators
   * const creator = await prisma.creator.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
  **/
  updateMany<T extends CreatorUpdateManyArgs>(
    args: Subset<T, CreatorUpdateManyArgs>
  ): Promise<BatchPayload>
  /**
   * Create or update one Creator.
   * @param {CreatorUpsertArgs} args - Arguments to update or create a Creator.
   * @example
   * // Update or create a Creator
   * const creator = await prisma.creator.upsert({
   *   create: {
   *     // ... data to create a Creator
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the Creator we want to update
   *   }
   * })
  **/
  upsert<T extends CreatorUpsertArgs>(
    args: Subset<T, CreatorUpsertArgs>
  ): CheckSelect<T, Prisma__CreatorClient<Creator>, Prisma__CreatorClient<CreatorGetPayload<T>>>
  /**
   * Count
   */
  count(args?: Omit<FindManyCreatorArgs, 'select' | 'include'>): Promise<number>

  /**
   * Aggregate
   */
  aggregate<T extends AggregateCreatorArgs>(args: Subset<T, AggregateCreatorArgs>): Promise<GetCreatorAggregateType<T>>
}

/**
 * The delegate class that acts as a "Promise-like" for Creator.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in 
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export declare class Prisma__CreatorClient<T> implements Promise<T> {
  private readonly _dmmf;
  private readonly _fetcher;
  private readonly _queryType;
  private readonly _rootField;
  private readonly _clientMethod;
  private readonly _args;
  private readonly _dataPath;
  private readonly _errorFormat;
  private readonly _measurePerformance?;
  private _isList;
  private _callsite;
  private _requestPromise?;
  constructor(_dmmf: DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
  readonly [Symbol.toStringTag]: 'PrismaClientPromise';

  likes<T extends FindManyProblemArgs = {}>(args?: Subset<T, FindManyProblemArgs>): CheckSelect<T, Promise<Array<Problem>>, Promise<Array<ProblemGetPayload<T>>>>;

  problems<T extends FindManyProblemArgs = {}>(args?: Subset<T, FindManyProblemArgs>): CheckSelect<T, Promise<Array<Problem>>, Promise<Array<ProblemGetPayload<T>>>>;

  private get _document();
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | Promise<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | Promise<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | Promise<TResult>) | undefined | null): Promise<T | TResult>;
  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally?: (() => void) | undefined | null): Promise<T>;
}

// Custom InputTypes

/**
 * Creator findOne
 */
export type FindOneCreatorArgs = {
  /**
   * Select specific fields to fetch from the Creator
  **/
  select?: CreatorSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: CreatorInclude | null
  /**
   * Filter, which Creator to fetch.
  **/
  where: CreatorWhereUniqueInput
}


/**
 * Creator findMany
 */
export type FindManyCreatorArgs = {
  /**
   * Select specific fields to fetch from the Creator
  **/
  select?: CreatorSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: CreatorInclude | null
  /**
   * Filter, which Creators to fetch.
  **/
  where?: CreatorWhereInput
  /**
   * Determine the order of the Creators to fetch.
  **/
  orderBy?: Enumerable<CreatorOrderByInput>
  /**
   * Sets the position for listing Creators.
  **/
  cursor?: CreatorWhereUniqueInput
  /**
   * The number of Creators to fetch. If negative number, it will take Creators before the `cursor`.
  **/
  take?: number
  /**
   * Skip the first `n` Creators.
  **/
  skip?: number
  distinct?: Enumerable<CreatorDistinctFieldEnum>
}


/**
 * Creator create
 */
export type CreatorCreateArgs = {
  /**
   * Select specific fields to fetch from the Creator
  **/
  select?: CreatorSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: CreatorInclude | null
  /**
   * The data needed to create a Creator.
  **/
  data: CreatorCreateInput
}


/**
 * Creator update
 */
export type CreatorUpdateArgs = {
  /**
   * Select specific fields to fetch from the Creator
  **/
  select?: CreatorSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: CreatorInclude | null
  /**
   * The data needed to update a Creator.
  **/
  data: CreatorUpdateInput
  /**
   * Choose, which Creator to update.
  **/
  where: CreatorWhereUniqueInput
}


/**
 * Creator updateMany
 */
export type CreatorUpdateManyArgs = {
  data: CreatorUpdateManyMutationInput
  where?: CreatorWhereInput
}


/**
 * Creator upsert
 */
export type CreatorUpsertArgs = {
  /**
   * Select specific fields to fetch from the Creator
  **/
  select?: CreatorSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: CreatorInclude | null
  /**
   * The filter to search for the Creator to update in case it exists.
  **/
  where: CreatorWhereUniqueInput
  /**
   * In case the Creator found by the `where` argument doesn't exist, create a new Creator with this data.
  **/
  create: CreatorCreateInput
  /**
   * In case the Creator was found with the provided `where` argument, update it with this data.
  **/
  update: CreatorUpdateInput
}


/**
 * Creator delete
 */
export type CreatorDeleteArgs = {
  /**
   * Select specific fields to fetch from the Creator
  **/
  select?: CreatorSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: CreatorInclude | null
  /**
   * Filter which Creator to delete.
  **/
  where: CreatorWhereUniqueInput
}


/**
 * Creator deleteMany
 */
export type CreatorDeleteManyArgs = {
  where?: CreatorWhereInput
}


/**
 * Creator without action
 */
export type CreatorArgs = {
  /**
   * Select specific fields to fetch from the Creator
  **/
  select?: CreatorSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: CreatorInclude | null
}



/**
 * Deep Input Types
 */


export type UserWhereInput = {
  AND?: Enumerable<UserWhereInput>
  OR?: Array<UserWhereInput>
  NOT?: Enumerable<UserWhereInput>
  id?: number | IntFilter
  email?: string | StringFilter
  name?: string | StringNullableFilter | null
  age?: number | IntFilter
  balance?: number | FloatFilter
  amount?: number | FloatFilter
  posts?: PostListRelationFilter
  role?: Role | EnumRoleFilter
}

export type UserOrderByInput = {
  id?: SortOrder
  email?: SortOrder
  name?: SortOrder
  age?: SortOrder
  balance?: SortOrder
  amount?: SortOrder
  role?: SortOrder
}

export type UserWhereUniqueInput = {
  id?: number
  email?: string
}

export type postWhereInput = {
  AND?: Enumerable<postWhereInput>
  OR?: Array<postWhereInput>
  NOT?: Enumerable<postWhereInput>
  uuid?: string | StringFilter
  createdAt?: Date | string | DateTimeFilter
  updatedAt?: Date | string | DateTimeFilter
  published?: boolean | BoolFilter
  title?: string | StringFilter
  content?: string | StringNullableFilter | null
  author?: UserWhereInput | null
  authorId?: number | IntFilter
  kind?: PostKind | EnumPostKindNullableFilter | null
  metadata?: JsonFilter
}

export type postOrderByInput = {
  uuid?: SortOrder
  createdAt?: SortOrder
  updatedAt?: SortOrder
  published?: SortOrder
  title?: SortOrder
  content?: SortOrder
  authorId?: SortOrder
  kind?: SortOrder
  metadata?: SortOrder
}

export type postWhereUniqueInput = {
  uuid?: string
}

export type CategoryWhereInput = {
  AND?: Enumerable<CategoryWhereInput>
  OR?: Array<CategoryWhereInput>
  NOT?: Enumerable<CategoryWhereInput>
  name?: string | StringFilter
  slug?: string | StringFilter
  number?: number | IntFilter
}

export type CategoryOrderByInput = {
  name?: SortOrder
  slug?: SortOrder
  number?: SortOrder
}

export type CategoryWhereUniqueInput = {
  slug_number?: SlugNumberCompoundUniqueInput
}

export type PatientWhereInput = {
  AND?: Enumerable<PatientWhereInput>
  OR?: Array<PatientWhereInput>
  NOT?: Enumerable<PatientWhereInput>
  firstName?: string | StringFilter
  lastName?: string | StringFilter
  email?: string | StringFilter
}

export type PatientOrderByInput = {
  firstName?: SortOrder
  lastName?: SortOrder
  email?: SortOrder
}

export type PatientWhereUniqueInput = {
  firstName_lastName?: FirstNameLastNameCompoundUniqueInput
}

export type MovieWhereInput = {
  AND?: Enumerable<MovieWhereInput>
  OR?: Array<MovieWhereInput>
  NOT?: Enumerable<MovieWhereInput>
  directorFirstName?: string | StringFilter
  directorLastName?: string | StringFilter
  director?: DirectorWhereInput | null
  title?: string | StringFilter
}

export type MovieOrderByInput = {
  directorFirstName?: SortOrder
  directorLastName?: SortOrder
  title?: SortOrder
}

export type MovieWhereUniqueInput = {
  directorFirstName_directorLastName_title?: DirectorFirstNameDirectorLastNameTitleCompoundUniqueInput
}

export type DirectorWhereInput = {
  AND?: Enumerable<DirectorWhereInput>
  OR?: Array<DirectorWhereInput>
  NOT?: Enumerable<DirectorWhereInput>
  firstName?: string | StringFilter
  lastName?: string | StringFilter
  movies?: MovieListRelationFilter
}

export type DirectorOrderByInput = {
  firstName?: SortOrder
  lastName?: SortOrder
}

export type DirectorWhereUniqueInput = {
  firstName_lastName?: FirstNameLastNameCompoundUniqueInput
}

export type ProblemWhereInput = {
  AND?: Enumerable<ProblemWhereInput>
  OR?: Array<ProblemWhereInput>
  NOT?: Enumerable<ProblemWhereInput>
  id?: number | IntFilter
  problemText?: string | StringFilter
  likedBy?: CreatorListRelationFilter
  creator?: CreatorWhereInput | null
  creatorId?: number | IntNullableFilter | null
}

export type ProblemOrderByInput = {
  id?: SortOrder
  problemText?: SortOrder
  creatorId?: SortOrder
}

export type ProblemWhereUniqueInput = {
  id?: number
}

export type CreatorWhereInput = {
  AND?: Enumerable<CreatorWhereInput>
  OR?: Array<CreatorWhereInput>
  NOT?: Enumerable<CreatorWhereInput>
  id?: number | IntFilter
  name?: string | StringFilter
  likes?: ProblemListRelationFilter
  problems?: ProblemListRelationFilter
}

export type CreatorOrderByInput = {
  id?: SortOrder
  name?: SortOrder
}

export type CreatorWhereUniqueInput = {
  id?: number
}

export type UserCreateInput = {
  email: string
  name?: string | null
  age: number
  balance: number
  amount: number
  role: Role
  posts?: postCreateManyWithoutAuthorInput
}

export type UserUpdateInput = {
  email?: string | StringFieldUpdateOperationsInput
  name?: string | NullableStringFieldUpdateOperationsInput | null
  age?: number | IntFieldUpdateOperationsInput
  balance?: number | FloatFieldUpdateOperationsInput
  amount?: number | FloatFieldUpdateOperationsInput
  role?: Role | EnumRoleFieldUpdateOperationsInput
  posts?: postUpdateManyWithoutAuthorInput
}

export type UserUpdateManyMutationInput = {
  email?: string | StringFieldUpdateOperationsInput
  name?: string | NullableStringFieldUpdateOperationsInput | null
  age?: number | IntFieldUpdateOperationsInput
  balance?: number | FloatFieldUpdateOperationsInput
  amount?: number | FloatFieldUpdateOperationsInput
  role?: Role | EnumRoleFieldUpdateOperationsInput
}

export type postCreateInput = {
  uuid?: string
  createdAt?: Date | string
  updatedAt?: Date | string
  published: boolean
  title: string
  content?: string | null
  kind?: PostKind | null
  metadata: InputJsonValue
  author: UserCreateOneWithoutPostsInput
}

export type postUpdateInput = {
  uuid?: string | StringFieldUpdateOperationsInput
  createdAt?: Date | string | DateTimeFieldUpdateOperationsInput
  updatedAt?: Date | string | DateTimeFieldUpdateOperationsInput
  published?: boolean | BoolFieldUpdateOperationsInput
  title?: string | StringFieldUpdateOperationsInput
  content?: string | NullableStringFieldUpdateOperationsInput | null
  kind?: PostKind | NullableEnumPostKindFieldUpdateOperationsInput | null
  metadata?: InputJsonValue
  author?: UserUpdateOneRequiredWithoutPostsInput
}

export type postUpdateManyMutationInput = {
  uuid?: string | StringFieldUpdateOperationsInput
  createdAt?: Date | string | DateTimeFieldUpdateOperationsInput
  updatedAt?: Date | string | DateTimeFieldUpdateOperationsInput
  published?: boolean | BoolFieldUpdateOperationsInput
  title?: string | StringFieldUpdateOperationsInput
  content?: string | NullableStringFieldUpdateOperationsInput | null
  kind?: PostKind | NullableEnumPostKindFieldUpdateOperationsInput | null
  metadata?: InputJsonValue
}

export type CategoryCreateInput = {
  name: string
  slug: string
  number: number
}

export type CategoryUpdateInput = {
  name?: string | StringFieldUpdateOperationsInput
  slug?: string | StringFieldUpdateOperationsInput
  number?: number | IntFieldUpdateOperationsInput
}

export type CategoryUpdateManyMutationInput = {
  name?: string | StringFieldUpdateOperationsInput
  slug?: string | StringFieldUpdateOperationsInput
  number?: number | IntFieldUpdateOperationsInput
}

export type PatientCreateInput = {
  firstName: string
  lastName: string
  email: string
}

export type PatientUpdateInput = {
  firstName?: string | StringFieldUpdateOperationsInput
  lastName?: string | StringFieldUpdateOperationsInput
  email?: string | StringFieldUpdateOperationsInput
}

export type PatientUpdateManyMutationInput = {
  firstName?: string | StringFieldUpdateOperationsInput
  lastName?: string | StringFieldUpdateOperationsInput
  email?: string | StringFieldUpdateOperationsInput
}

export type MovieCreateInput = {
  title: string
  director: DirectorCreateOneWithoutMoviesInput
}

export type MovieUpdateInput = {
  title?: string | StringFieldUpdateOperationsInput
  director?: DirectorUpdateOneRequiredWithoutMoviesInput
}

export type MovieUpdateManyMutationInput = {
  title?: string | StringFieldUpdateOperationsInput
}

export type DirectorCreateInput = {
  firstName: string
  lastName: string
  movies?: MovieCreateManyWithoutDirectorInput
}

export type DirectorUpdateInput = {
  firstName?: string | StringFieldUpdateOperationsInput
  lastName?: string | StringFieldUpdateOperationsInput
  movies?: MovieUpdateManyWithoutDirectorInput
}

export type DirectorUpdateManyMutationInput = {
  firstName?: string | StringFieldUpdateOperationsInput
  lastName?: string | StringFieldUpdateOperationsInput
}

export type ProblemCreateInput = {
  problemText: string
  likedBy?: CreatorCreateManyWithoutLikesInput
  creator?: CreatorCreateOneWithoutProblemsInput
}

export type ProblemUpdateInput = {
  problemText?: string | StringFieldUpdateOperationsInput
  likedBy?: CreatorUpdateManyWithoutLikesInput
  creator?: CreatorUpdateOneWithoutProblemsInput
}

export type ProblemUpdateManyMutationInput = {
  problemText?: string | StringFieldUpdateOperationsInput
}

export type CreatorCreateInput = {
  name: string
  likes?: ProblemCreateManyWithoutLikedByInput
  problems?: ProblemCreateManyWithoutCreatorInput
}

export type CreatorUpdateInput = {
  name?: string | StringFieldUpdateOperationsInput
  likes?: ProblemUpdateManyWithoutLikedByInput
  problems?: ProblemUpdateManyWithoutCreatorInput
}

export type CreatorUpdateManyMutationInput = {
  name?: string | StringFieldUpdateOperationsInput
}

export type IntFilter = {
  equals?: number
  in?: Enumerable<number>
  notIn?: Enumerable<number>
  lt?: number
  lte?: number
  gt?: number
  gte?: number
  not?: number | NestedIntFilter
}

export type StringFilter = {
  equals?: string
  in?: Enumerable<string>
  notIn?: Enumerable<string>
  lt?: string
  lte?: string
  gt?: string
  gte?: string
  contains?: string
  startsWith?: string
  endsWith?: string
  not?: string | NestedStringFilter
}

export type StringNullableFilter = {
  equals?: string | null
  in?: Enumerable<string> | null
  notIn?: Enumerable<string> | null
  lt?: string | null
  lte?: string | null
  gt?: string | null
  gte?: string | null
  contains?: string | null
  startsWith?: string | null
  endsWith?: string | null
  not?: string | NestedStringNullableFilter | null
}

export type FloatFilter = {
  equals?: number
  in?: Enumerable<number>
  notIn?: Enumerable<number>
  lt?: number
  lte?: number
  gt?: number
  gte?: number
  not?: number | NestedFloatFilter
}

export type PostListRelationFilter = {
  every?: postWhereInput
  some?: postWhereInput
  none?: postWhereInput
}

export type EnumRoleFilter = {
  equals?: Role
  in?: Enumerable<Role>
  notIn?: Enumerable<Role>
  not?: Role | NestedEnumRoleFilter
}

export type DateTimeFilter = {
  equals?: Date | string
  in?: Enumerable<Date | string>
  notIn?: Enumerable<Date | string>
  lt?: Date | string
  lte?: Date | string
  gt?: Date | string
  gte?: Date | string
  not?: Date | string | NestedDateTimeFilter
}

export type BoolFilter = {
  equals?: boolean
  not?: boolean | NestedBoolFilter
}

export type UserRelationFilter = {
  is?: UserWhereInput | null
  isNot?: UserWhereInput | null
}

export type EnumPostKindNullableFilter = {
  equals?: PostKind | null
  in?: Enumerable<PostKind> | null
  notIn?: Enumerable<PostKind> | null
  not?: PostKind | NestedEnumPostKindNullableFilter | null
}

export type JsonFilter = {
  equals?: InputJsonValue
  not?: InputJsonValue | NestedJsonFilter
}

export type SlugNumberCompoundUniqueInput = {
  slug: string
  number: number
}

export type FirstNameLastNameCompoundUniqueInput = {
  firstName: string
  lastName: string
}

export type DirectorRelationFilter = {
  is?: DirectorWhereInput | null
  isNot?: DirectorWhereInput | null
}

export type DirectorFirstNameDirectorLastNameTitleCompoundUniqueInput = {
  directorFirstName: string
  directorLastName: string
  title: string
}

export type MovieListRelationFilter = {
  every?: MovieWhereInput
  some?: MovieWhereInput
  none?: MovieWhereInput
}

export type CreatorListRelationFilter = {
  every?: CreatorWhereInput
  some?: CreatorWhereInput
  none?: CreatorWhereInput
}

export type CreatorRelationFilter = {
  is?: CreatorWhereInput | null
  isNot?: CreatorWhereInput | null
}

export type IntNullableFilter = {
  equals?: number | null
  in?: Enumerable<number> | null
  notIn?: Enumerable<number> | null
  lt?: number | null
  lte?: number | null
  gt?: number | null
  gte?: number | null
  not?: number | NestedIntNullableFilter | null
}

export type ProblemListRelationFilter = {
  every?: ProblemWhereInput
  some?: ProblemWhereInput
  none?: ProblemWhereInput
}

export type postCreateManyWithoutAuthorInput = {
  create?: Enumerable<postCreateWithoutAuthorInput>
  connect?: Enumerable<postWhereUniqueInput>
  connectOrCreate?: Enumerable<postCreateOrConnectWithoutUserInput>
}

export type StringFieldUpdateOperationsInput = {
  set?: string
}

export type NullableStringFieldUpdateOperationsInput = {
  set?: string | null
}

export type IntFieldUpdateOperationsInput = {
  set?: number
  increment?: number
  decrement?: number
  multiply?: number
  divide?: number
}

export type FloatFieldUpdateOperationsInput = {
  set?: number
  increment?: number
  decrement?: number
  multiply?: number
  divide?: number
}

export type EnumRoleFieldUpdateOperationsInput = {
  set?: Role
}

export type postUpdateManyWithoutAuthorInput = {
  create?: Enumerable<postCreateWithoutAuthorInput>
  connect?: Enumerable<postWhereUniqueInput>
  set?: Enumerable<postWhereUniqueInput>
  disconnect?: Enumerable<postWhereUniqueInput>
  delete?: Enumerable<postWhereUniqueInput>
  update?: Enumerable<postUpdateWithWhereUniqueWithoutAuthorInput>
  updateMany?: Enumerable<postUpdateManyWithWhereNestedInput> | null
  deleteMany?: Enumerable<postScalarWhereInput>
  upsert?: Enumerable<postUpsertWithWhereUniqueWithoutAuthorInput>
  connectOrCreate?: Enumerable<postCreateOrConnectWithoutUserInput>
}

export type UserCreateOneWithoutPostsInput = {
  create?: UserCreateWithoutPostsInput
  connect?: UserWhereUniqueInput
  connectOrCreate?: UserCreateOrConnectWithoutpostInput
}

export type DateTimeFieldUpdateOperationsInput = {
  set?: Date | string
}

export type BoolFieldUpdateOperationsInput = {
  set?: boolean
}

export type NullableEnumPostKindFieldUpdateOperationsInput = {
  set?: PostKind | null
}

export type JsonFieldUpdateOperationsInput = {
  set?: InputJsonValue
}

export type UserUpdateOneRequiredWithoutPostsInput = {
  create?: UserCreateWithoutPostsInput
  connect?: UserWhereUniqueInput
  update?: UserUpdateWithoutPostsDataInput
  upsert?: UserUpsertWithoutPostsInput
  connectOrCreate?: UserCreateOrConnectWithoutpostInput
}

export type DirectorCreateOneWithoutMoviesInput = {
  create?: DirectorCreateWithoutMoviesInput
  connect?: DirectorWhereUniqueInput
  connectOrCreate?: DirectorCreateOrConnectWithoutMovieInput
}

export type DirectorUpdateOneRequiredWithoutMoviesInput = {
  create?: DirectorCreateWithoutMoviesInput
  connect?: DirectorWhereUniqueInput
  update?: DirectorUpdateWithoutMoviesDataInput
  upsert?: DirectorUpsertWithoutMoviesInput
  connectOrCreate?: DirectorCreateOrConnectWithoutMovieInput
}

export type MovieCreateManyWithoutDirectorInput = {
  create?: Enumerable<MovieCreateWithoutDirectorInput>
  connect?: Enumerable<MovieWhereUniqueInput>
  connectOrCreate?: Enumerable<MovieCreateOrConnectWithoutDirectorInput>
}

export type MovieUpdateManyWithoutDirectorInput = {
  create?: Enumerable<MovieCreateWithoutDirectorInput>
  connect?: Enumerable<MovieWhereUniqueInput>
  set?: Enumerable<MovieWhereUniqueInput>
  disconnect?: Enumerable<MovieWhereUniqueInput>
  delete?: Enumerable<MovieWhereUniqueInput>
  update?: Enumerable<MovieUpdateWithWhereUniqueWithoutDirectorInput>
  updateMany?: Enumerable<MovieUpdateManyWithWhereNestedInput> | null
  deleteMany?: Enumerable<MovieScalarWhereInput>
  upsert?: Enumerable<MovieUpsertWithWhereUniqueWithoutDirectorInput>
  connectOrCreate?: Enumerable<MovieCreateOrConnectWithoutDirectorInput>
}

export type CreatorCreateManyWithoutLikesInput = {
  create?: Enumerable<CreatorCreateWithoutLikesInput>
  connect?: Enumerable<CreatorWhereUniqueInput>
  connectOrCreate?: Enumerable<CreatorCreateOrConnectWithoutProblemInput>
}

export type CreatorCreateOneWithoutProblemsInput = {
  create?: CreatorCreateWithoutProblemsInput
  connect?: CreatorWhereUniqueInput
  connectOrCreate?: CreatorCreateOrConnectWithoutProblemInput
}

export type CreatorUpdateManyWithoutLikesInput = {
  create?: Enumerable<CreatorCreateWithoutLikesInput>
  connect?: Enumerable<CreatorWhereUniqueInput>
  set?: Enumerable<CreatorWhereUniqueInput>
  disconnect?: Enumerable<CreatorWhereUniqueInput>
  delete?: Enumerable<CreatorWhereUniqueInput>
  update?: Enumerable<CreatorUpdateWithWhereUniqueWithoutLikesInput>
  updateMany?: Enumerable<CreatorUpdateManyWithWhereNestedInput> | null
  deleteMany?: Enumerable<CreatorScalarWhereInput>
  upsert?: Enumerable<CreatorUpsertWithWhereUniqueWithoutLikesInput>
  connectOrCreate?: Enumerable<CreatorCreateOrConnectWithoutProblemInput>
}

export type CreatorUpdateOneWithoutProblemsInput = {
  create?: CreatorCreateWithoutProblemsInput
  connect?: CreatorWhereUniqueInput
  disconnect?: boolean
  delete?: boolean
  update?: CreatorUpdateWithoutProblemsDataInput
  upsert?: CreatorUpsertWithoutProblemsInput
  connectOrCreate?: CreatorCreateOrConnectWithoutProblemInput
}

export type ProblemCreateManyWithoutLikedByInput = {
  create?: Enumerable<ProblemCreateWithoutLikedByInput>
  connect?: Enumerable<ProblemWhereUniqueInput>
  connectOrCreate?: Enumerable<ProblemCreateOrConnectWithoutCreatorInput>
}

export type ProblemCreateManyWithoutCreatorInput = {
  create?: Enumerable<ProblemCreateWithoutCreatorInput>
  connect?: Enumerable<ProblemWhereUniqueInput>
  connectOrCreate?: Enumerable<ProblemCreateOrConnectWithoutCreatorInput>
}

export type ProblemUpdateManyWithoutLikedByInput = {
  create?: Enumerable<ProblemCreateWithoutLikedByInput>
  connect?: Enumerable<ProblemWhereUniqueInput>
  set?: Enumerable<ProblemWhereUniqueInput>
  disconnect?: Enumerable<ProblemWhereUniqueInput>
  delete?: Enumerable<ProblemWhereUniqueInput>
  update?: Enumerable<ProblemUpdateWithWhereUniqueWithoutLikedByInput>
  updateMany?: Enumerable<ProblemUpdateManyWithWhereNestedInput> | null
  deleteMany?: Enumerable<ProblemScalarWhereInput>
  upsert?: Enumerable<ProblemUpsertWithWhereUniqueWithoutLikedByInput>
  connectOrCreate?: Enumerable<ProblemCreateOrConnectWithoutCreatorInput>
}

export type ProblemUpdateManyWithoutCreatorInput = {
  create?: Enumerable<ProblemCreateWithoutCreatorInput>
  connect?: Enumerable<ProblemWhereUniqueInput>
  set?: Enumerable<ProblemWhereUniqueInput>
  disconnect?: Enumerable<ProblemWhereUniqueInput>
  delete?: Enumerable<ProblemWhereUniqueInput>
  update?: Enumerable<ProblemUpdateWithWhereUniqueWithoutCreatorInput>
  updateMany?: Enumerable<ProblemUpdateManyWithWhereNestedInput> | null
  deleteMany?: Enumerable<ProblemScalarWhereInput>
  upsert?: Enumerable<ProblemUpsertWithWhereUniqueWithoutCreatorInput>
  connectOrCreate?: Enumerable<ProblemCreateOrConnectWithoutCreatorInput>
}

export type NestedIntFilter = {
  equals?: number
  in?: Enumerable<number>
  notIn?: Enumerable<number>
  lt?: number
  lte?: number
  gt?: number
  gte?: number
  not?: NestedIntFilter | null
}

export type NestedStringFilter = {
  equals?: string
  in?: Enumerable<string>
  notIn?: Enumerable<string>
  lt?: string
  lte?: string
  gt?: string
  gte?: string
  contains?: string
  startsWith?: string
  endsWith?: string
  not?: NestedStringFilter | null
}

export type NestedStringNullableFilter = {
  equals?: string | null
  in?: Enumerable<string> | null
  notIn?: Enumerable<string> | null
  lt?: string | null
  lte?: string | null
  gt?: string | null
  gte?: string | null
  contains?: string | null
  startsWith?: string | null
  endsWith?: string | null
  not?: NestedStringNullableFilter | null
}

export type NestedFloatFilter = {
  equals?: number
  in?: Enumerable<number>
  notIn?: Enumerable<number>
  lt?: number
  lte?: number
  gt?: number
  gte?: number
  not?: NestedFloatFilter | null
}

export type NestedEnumRoleFilter = {
  equals?: Role
  in?: Enumerable<Role>
  notIn?: Enumerable<Role>
  not?: NestedEnumRoleFilter | null
}

export type NestedDateTimeFilter = {
  equals?: Date | string
  in?: Enumerable<Date | string>
  notIn?: Enumerable<Date | string>
  lt?: Date | string
  lte?: Date | string
  gt?: Date | string
  gte?: Date | string
  not?: NestedDateTimeFilter | null
}

export type NestedBoolFilter = {
  equals?: boolean
  not?: NestedBoolFilter | null
}

export type NestedEnumPostKindNullableFilter = {
  equals?: PostKind | null
  in?: Enumerable<PostKind> | null
  notIn?: Enumerable<PostKind> | null
  not?: NestedEnumPostKindNullableFilter | null
}

export type NestedJsonFilter = {
  equals?: InputJsonValue
  not?: NestedJsonFilter | null
}

export type NestedIntNullableFilter = {
  equals?: number | null
  in?: Enumerable<number> | null
  notIn?: Enumerable<number> | null
  lt?: number | null
  lte?: number | null
  gt?: number | null
  gte?: number | null
  not?: NestedIntNullableFilter | null
}

export type postCreateWithoutAuthorInput = {
  uuid?: string
  createdAt?: Date | string
  updatedAt?: Date | string
  published: boolean
  title: string
  content?: string | null
  kind?: PostKind | null
  metadata: InputJsonValue
}

export type postCreateOrConnectWithoutUserInput = {
  where: postWhereUniqueInput
  create: postCreateWithoutAuthorInput
}

export type postUpdateWithWhereUniqueWithoutAuthorInput = {
  where: postWhereUniqueInput
  data: postUpdateWithoutAuthorDataInput
}

export type postUpdateManyWithWhereNestedInput = {
  where: postScalarWhereInput
  data: postUpdateManyDataInput
}

export type postScalarWhereInput = {
  AND?: Enumerable<postScalarWhereInput>
  OR?: Array<postScalarWhereInput>
  NOT?: Enumerable<postScalarWhereInput>
  uuid?: string | StringFilter
  createdAt?: Date | string | DateTimeFilter
  updatedAt?: Date | string | DateTimeFilter
  published?: boolean | BoolFilter
  title?: string | StringFilter
  content?: string | StringNullableFilter | null
  authorId?: number | IntFilter
  kind?: PostKind | EnumPostKindNullableFilter | null
  metadata?: JsonFilter
}

export type postUpsertWithWhereUniqueWithoutAuthorInput = {
  where: postWhereUniqueInput
  update: postUpdateWithoutAuthorDataInput
  create: postCreateWithoutAuthorInput
}

export type UserCreateWithoutPostsInput = {
  email: string
  name?: string | null
  age: number
  balance: number
  amount: number
  role: Role
}

export type UserCreateOrConnectWithoutpostInput = {
  where: UserWhereUniqueInput
  create: UserCreateWithoutPostsInput
}

export type UserUpdateWithoutPostsDataInput = {
  email?: string | StringFieldUpdateOperationsInput
  name?: string | NullableStringFieldUpdateOperationsInput | null
  age?: number | IntFieldUpdateOperationsInput
  balance?: number | FloatFieldUpdateOperationsInput
  amount?: number | FloatFieldUpdateOperationsInput
  role?: Role | EnumRoleFieldUpdateOperationsInput
}

export type UserUpsertWithoutPostsInput = {
  update: UserUpdateWithoutPostsDataInput
  create: UserCreateWithoutPostsInput
}

export type DirectorCreateWithoutMoviesInput = {
  firstName: string
  lastName: string
}

export type DirectorCreateOrConnectWithoutMovieInput = {
  where: DirectorWhereUniqueInput
  create: DirectorCreateWithoutMoviesInput
}

export type DirectorUpdateWithoutMoviesDataInput = {
  firstName?: string | StringFieldUpdateOperationsInput
  lastName?: string | StringFieldUpdateOperationsInput
}

export type DirectorUpsertWithoutMoviesInput = {
  update: DirectorUpdateWithoutMoviesDataInput
  create: DirectorCreateWithoutMoviesInput
}

export type MovieCreateWithoutDirectorInput = {
  title: string
}

export type MovieCreateOrConnectWithoutDirectorInput = {
  where: MovieWhereUniqueInput
  create: MovieCreateWithoutDirectorInput
}

export type MovieUpdateWithWhereUniqueWithoutDirectorInput = {
  where: MovieWhereUniqueInput
  data: MovieUpdateWithoutDirectorDataInput
}

export type MovieUpdateManyWithWhereNestedInput = {
  where: MovieScalarWhereInput
  data: MovieUpdateManyDataInput
}

export type MovieScalarWhereInput = {
  AND?: Enumerable<MovieScalarWhereInput>
  OR?: Array<MovieScalarWhereInput>
  NOT?: Enumerable<MovieScalarWhereInput>
  directorFirstName?: string | StringFilter
  directorLastName?: string | StringFilter
  title?: string | StringFilter
}

export type MovieUpsertWithWhereUniqueWithoutDirectorInput = {
  where: MovieWhereUniqueInput
  update: MovieUpdateWithoutDirectorDataInput
  create: MovieCreateWithoutDirectorInput
}

export type CreatorCreateWithoutLikesInput = {
  name: string
  problems?: ProblemCreateManyWithoutCreatorInput
}

export type CreatorCreateOrConnectWithoutProblemInput = {
  where: CreatorWhereUniqueInput
  create: CreatorCreateWithoutLikesInput
}

export type CreatorCreateWithoutProblemsInput = {
  name: string
  likes?: ProblemCreateManyWithoutLikedByInput
}

export type CreatorUpdateWithWhereUniqueWithoutLikesInput = {
  where: CreatorWhereUniqueInput
  data: CreatorUpdateWithoutLikesDataInput
}

export type CreatorUpdateManyWithWhereNestedInput = {
  where: CreatorScalarWhereInput
  data: CreatorUpdateManyDataInput
}

export type CreatorScalarWhereInput = {
  AND?: Enumerable<CreatorScalarWhereInput>
  OR?: Array<CreatorScalarWhereInput>
  NOT?: Enumerable<CreatorScalarWhereInput>
  id?: number | IntFilter
  name?: string | StringFilter
}

export type CreatorUpsertWithWhereUniqueWithoutLikesInput = {
  where: CreatorWhereUniqueInput
  update: CreatorUpdateWithoutLikesDataInput
  create: CreatorCreateWithoutLikesInput
}

export type CreatorUpdateWithoutProblemsDataInput = {
  name?: string | StringFieldUpdateOperationsInput
  likes?: ProblemUpdateManyWithoutLikedByInput
}

export type CreatorUpsertWithoutProblemsInput = {
  update: CreatorUpdateWithoutProblemsDataInput
  create: CreatorCreateWithoutProblemsInput
}

export type ProblemCreateWithoutLikedByInput = {
  problemText: string
  creator?: CreatorCreateOneWithoutProblemsInput
}

export type ProblemCreateOrConnectWithoutCreatorInput = {
  where: ProblemWhereUniqueInput
  create: ProblemCreateWithoutLikedByInput
}

export type ProblemCreateWithoutCreatorInput = {
  problemText: string
  likedBy?: CreatorCreateManyWithoutLikesInput
}

export type ProblemUpdateWithWhereUniqueWithoutLikedByInput = {
  where: ProblemWhereUniqueInput
  data: ProblemUpdateWithoutLikedByDataInput
}

export type ProblemUpdateManyWithWhereNestedInput = {
  where: ProblemScalarWhereInput
  data: ProblemUpdateManyDataInput
}

export type ProblemScalarWhereInput = {
  AND?: Enumerable<ProblemScalarWhereInput>
  OR?: Array<ProblemScalarWhereInput>
  NOT?: Enumerable<ProblemScalarWhereInput>
  id?: number | IntFilter
  problemText?: string | StringFilter
  creatorId?: number | IntNullableFilter | null
}

export type ProblemUpsertWithWhereUniqueWithoutLikedByInput = {
  where: ProblemWhereUniqueInput
  update: ProblemUpdateWithoutLikedByDataInput
  create: ProblemCreateWithoutLikedByInput
}

export type ProblemUpdateWithWhereUniqueWithoutCreatorInput = {
  where: ProblemWhereUniqueInput
  data: ProblemUpdateWithoutCreatorDataInput
}

export type ProblemUpsertWithWhereUniqueWithoutCreatorInput = {
  where: ProblemWhereUniqueInput
  update: ProblemUpdateWithoutCreatorDataInput
  create: ProblemCreateWithoutCreatorInput
}

export type postUpdateWithoutAuthorDataInput = {
  uuid?: string | StringFieldUpdateOperationsInput
  createdAt?: Date | string | DateTimeFieldUpdateOperationsInput
  updatedAt?: Date | string | DateTimeFieldUpdateOperationsInput
  published?: boolean | BoolFieldUpdateOperationsInput
  title?: string | StringFieldUpdateOperationsInput
  content?: string | NullableStringFieldUpdateOperationsInput | null
  kind?: PostKind | NullableEnumPostKindFieldUpdateOperationsInput | null
  metadata?: InputJsonValue
}

export type postUpdateManyDataInput = {
  uuid?: string | StringFieldUpdateOperationsInput
  createdAt?: Date | string | DateTimeFieldUpdateOperationsInput
  updatedAt?: Date | string | DateTimeFieldUpdateOperationsInput
  published?: boolean | BoolFieldUpdateOperationsInput
  title?: string | StringFieldUpdateOperationsInput
  content?: string | NullableStringFieldUpdateOperationsInput | null
  kind?: PostKind | NullableEnumPostKindFieldUpdateOperationsInput | null
  metadata?: InputJsonValue
}

export type MovieUpdateWithoutDirectorDataInput = {
  title?: string | StringFieldUpdateOperationsInput
}

export type MovieUpdateManyDataInput = {
  title?: string | StringFieldUpdateOperationsInput
}

export type CreatorUpdateWithoutLikesDataInput = {
  name?: string | StringFieldUpdateOperationsInput
  problems?: ProblemUpdateManyWithoutCreatorInput
}

export type CreatorUpdateManyDataInput = {
  name?: string | StringFieldUpdateOperationsInput
}

export type ProblemUpdateWithoutLikedByDataInput = {
  problemText?: string | StringFieldUpdateOperationsInput
  creator?: CreatorUpdateOneWithoutProblemsInput
}

export type ProblemUpdateManyDataInput = {
  problemText?: string | StringFieldUpdateOperationsInput
}

export type ProblemUpdateWithoutCreatorDataInput = {
  problemText?: string | StringFieldUpdateOperationsInput
  likedBy?: CreatorUpdateManyWithoutLikesInput
}

/**
 * Batch Payload for updateMany & deleteMany
 */

export type BatchPayload = {
  count: number
}

/**
 * DMMF
 */
export declare const dmmf: DMMF.Document;
export {};
