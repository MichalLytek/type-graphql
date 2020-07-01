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
 * Prisma Client JS version: 2.1.3
 * Query Engine version: 363f5a521d6b06543e53d134652a0037a3096d41
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

export declare type TrueKeys<T> = {
  [key in keyof T]: T[key] extends false | undefined | null ? never : key
}[keyof T]

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
  request<T>(document: any, dataPath?: string[], rootField?: string, typeName?: string, isList?: boolean, callsite?: string, collectTimestamps?: any): Promise<T>;
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
export type GetEvents<T extends Array<LogLevel | LogDefinition>> = GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]> 

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
 * Read more in our [docs](https://github.com/prisma/prisma/blob/master/docs/prisma-client-js/api.md).
 */
export declare class PrismaClient<
  T extends PrismaClientOptions = PrismaClientOptions,
  U = keyof T extends 'log' ? T['log'] extends Array<LogLevel | LogDefinition> ? GetEvents<T['log']> : never : never
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
   * Read more in our [docs](https://github.com/prisma/prisma/blob/master/docs/prisma-client-js/api.md).
   */
  constructor(optionsArg?: T);
  on<V extends U>(eventType: V, callback: (event: V extends 'query' ? QueryEvent : LogEvent) => void): void;
  /**
   * Connect with the database
   */
  connect(): Promise<void>;
  /**
   * @private
   */
  private runDisconnect;
  /**
   * Disconnect from the database
   */
  disconnect(): Promise<any>;

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
  * Read more in our [docs](https://github.com/prisma/prisma/blob/master/docs/prisma-client-js/api.md#raw-database-access).
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
  * Read more in our [docs](https://github.com/prisma/prisma/blob/master/docs/prisma-client-js/api.md#raw-database-access).
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
   * `prisma.post`: Exposes CRUD operations for the **Post** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Posts
    * const posts = await prisma.post.findMany()
    * ```
    */
  get post(): PostDelegate;

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
}



/**
 * Enums
 */

// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275

export declare const OrderByArg: {
  asc: 'asc',
  desc: 'desc'
};

export declare type OrderByArg = (typeof OrderByArg)[keyof typeof OrderByArg]


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

export type UserSelect = {
  id?: boolean
  email?: boolean
  name?: boolean
  age?: boolean
  balance?: boolean
  amount?: boolean
  posts?: boolean | FindManyPostArgs
  role?: boolean
}

export type UserInclude = {
  posts?: boolean | FindManyPostArgs
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
      ? Array<PostGetPayload<S['include'][P]>> : never
    }
  : 'select' extends U
    ? {
      [P in TrueKeys<S['select']>]:P extends keyof User ? User[P]
: 
      P extends 'posts'
      ? Array<PostGetPayload<S['select'][P]>> : never
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
   * 
   */
  count(args?: Omit<FindManyUserArgs, 'select' | 'include'>): Promise<number>
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
  private _collectTimestamps?;
  constructor(_dmmf: DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
  readonly [Symbol.toStringTag]: 'PrismaClientPromise';

  posts<T extends FindManyPostArgs = {}>(args?: Subset<T, FindManyPostArgs>): CheckSelect<T, Promise<Array<Post>>, Promise<Array<PostGetPayload<T>>>>;

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
  orderBy?: UserOrderByInput
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
 * Model Post
 */

export type Post = {
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

export type PostSelect = {
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

export type PostInclude = {
  author?: boolean | UserArgs
}

export type PostGetPayload<
  S extends boolean | null | undefined | PostArgs,
  U = keyof S
> = S extends true
  ? Post
  : S extends undefined
  ? never
  : S extends PostArgs | FindManyPostArgs
  ? 'include' extends U
    ? Post  & {
      [P in TrueKeys<S['include']>]:
      P extends 'author'
      ? UserGetPayload<S['include'][P]> : never
    }
  : 'select' extends U
    ? {
      [P in TrueKeys<S['select']>]:P extends keyof Post ? Post[P]
: 
      P extends 'author'
      ? UserGetPayload<S['select'][P]> : never
    }
  : Post
: Post


export interface PostDelegate {
  /**
   * Find zero or one Post.
   * @param {FindOnePostArgs} args - Arguments to find a Post
   * @example
   * // Get one Post
   * const post = await prisma.post.findOne({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
  **/
  findOne<T extends FindOnePostArgs>(
    args: Subset<T, FindOnePostArgs>
  ): CheckSelect<T, Prisma__PostClient<Post | null>, Prisma__PostClient<PostGetPayload<T> | null>>
  /**
   * Find zero or more Posts.
   * @param {FindManyPostArgs=} args - Arguments to filter and select certain fields only.
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
  findMany<T extends FindManyPostArgs>(
    args?: Subset<T, FindManyPostArgs>
  ): CheckSelect<T, Promise<Array<Post>>, Promise<Array<PostGetPayload<T>>>>
  /**
   * Create a Post.
   * @param {PostCreateArgs} args - Arguments to create a Post.
   * @example
   * // Create one Post
   * const Post = await prisma.post.create({
   *   data: {
   *     // ... data to create a Post
   *   }
   * })
   * 
  **/
  create<T extends PostCreateArgs>(
    args: Subset<T, PostCreateArgs>
  ): CheckSelect<T, Prisma__PostClient<Post>, Prisma__PostClient<PostGetPayload<T>>>
  /**
   * Delete a Post.
   * @param {PostDeleteArgs} args - Arguments to delete one Post.
   * @example
   * // Delete one Post
   * const Post = await prisma.post.delete({
   *   where: {
   *     // ... filter to delete one Post
   *   }
   * })
   * 
  **/
  delete<T extends PostDeleteArgs>(
    args: Subset<T, PostDeleteArgs>
  ): CheckSelect<T, Prisma__PostClient<Post>, Prisma__PostClient<PostGetPayload<T>>>
  /**
   * Update one Post.
   * @param {PostUpdateArgs} args - Arguments to update one Post.
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
  update<T extends PostUpdateArgs>(
    args: Subset<T, PostUpdateArgs>
  ): CheckSelect<T, Prisma__PostClient<Post>, Prisma__PostClient<PostGetPayload<T>>>
  /**
   * Delete zero or more Posts.
   * @param {PostDeleteManyArgs} args - Arguments to filter Posts to delete.
   * @example
   * // Delete a few Posts
   * const { count } = await prisma.post.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
  **/
  deleteMany<T extends PostDeleteManyArgs>(
    args: Subset<T, PostDeleteManyArgs>
  ): Promise<BatchPayload>
  /**
   * Update zero or more Posts.
   * @param {PostUpdateManyArgs} args - Arguments to update one or more rows.
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
  updateMany<T extends PostUpdateManyArgs>(
    args: Subset<T, PostUpdateManyArgs>
  ): Promise<BatchPayload>
  /**
   * Create or update one Post.
   * @param {PostUpsertArgs} args - Arguments to update or create a Post.
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
  upsert<T extends PostUpsertArgs>(
    args: Subset<T, PostUpsertArgs>
  ): CheckSelect<T, Prisma__PostClient<Post>, Prisma__PostClient<PostGetPayload<T>>>
  /**
   * 
   */
  count(args?: Omit<FindManyPostArgs, 'select' | 'include'>): Promise<number>
}

/**
 * The delegate class that acts as a "Promise-like" for Post.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in 
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export declare class Prisma__PostClient<T> implements Promise<T> {
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
  private _collectTimestamps?;
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
 * Post findOne
 */
export type FindOnePostArgs = {
  /**
   * Select specific fields to fetch from the Post
  **/
  select?: PostSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: PostInclude | null
  /**
   * Filter, which Post to fetch.
  **/
  where: PostWhereUniqueInput
}


/**
 * Post findMany
 */
export type FindManyPostArgs = {
  /**
   * Select specific fields to fetch from the Post
  **/
  select?: PostSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: PostInclude | null
  /**
   * Filter, which Posts to fetch.
  **/
  where?: PostWhereInput
  /**
   * Determine the order of the Posts to fetch.
  **/
  orderBy?: PostOrderByInput
  /**
   * Sets the position for listing Posts.
  **/
  cursor?: PostWhereUniqueInput
  /**
   * The number of Posts to fetch. If negative number, it will take Posts before the `cursor`.
  **/
  take?: number
  /**
   * Skip the first `n` Posts.
  **/
  skip?: number
}


/**
 * Post create
 */
export type PostCreateArgs = {
  /**
   * Select specific fields to fetch from the Post
  **/
  select?: PostSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: PostInclude | null
  /**
   * The data needed to create a Post.
  **/
  data: PostCreateInput
}


/**
 * Post update
 */
export type PostUpdateArgs = {
  /**
   * Select specific fields to fetch from the Post
  **/
  select?: PostSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: PostInclude | null
  /**
   * The data needed to update a Post.
  **/
  data: PostUpdateInput
  /**
   * Choose, which Post to update.
  **/
  where: PostWhereUniqueInput
}


/**
 * Post updateMany
 */
export type PostUpdateManyArgs = {
  data: PostUpdateManyMutationInput
  where?: PostWhereInput
}


/**
 * Post upsert
 */
export type PostUpsertArgs = {
  /**
   * Select specific fields to fetch from the Post
  **/
  select?: PostSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: PostInclude | null
  /**
   * The filter to search for the Post to update in case it exists.
  **/
  where: PostWhereUniqueInput
  /**
   * In case the Post found by the `where` argument doesn't exist, create a new Post with this data.
  **/
  create: PostCreateInput
  /**
   * In case the Post was found with the provided `where` argument, update it with this data.
  **/
  update: PostUpdateInput
}


/**
 * Post delete
 */
export type PostDeleteArgs = {
  /**
   * Select specific fields to fetch from the Post
  **/
  select?: PostSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: PostInclude | null
  /**
   * Filter which Post to delete.
  **/
  where: PostWhereUniqueInput
}


/**
 * Post deleteMany
 */
export type PostDeleteManyArgs = {
  where?: PostWhereInput
}


/**
 * Post without action
 */
export type PostArgs = {
  /**
   * Select specific fields to fetch from the Post
  **/
  select?: PostSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: PostInclude | null
}



/**
 * Model Category
 */

export type Category = {
  name: string
  slug: string
  number: number
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
   * 
   */
  count(args?: Omit<FindManyCategoryArgs, 'select' | 'include'>): Promise<number>
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
  private _collectTimestamps?;
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
  orderBy?: CategoryOrderByInput
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
   * 
   */
  count(args?: Omit<FindManyPatientArgs, 'select' | 'include'>): Promise<number>
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
  private _collectTimestamps?;
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
  orderBy?: PatientOrderByInput
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
   * 
   */
  count(args?: Omit<FindManyMovieArgs, 'select' | 'include'>): Promise<number>
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
  private _collectTimestamps?;
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
  orderBy?: MovieOrderByInput
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
   * 
   */
  count(args?: Omit<FindManyDirectorArgs, 'select' | 'include'>): Promise<number>
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
  private _collectTimestamps?;
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
  orderBy?: DirectorOrderByInput
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
 * Deep Input Types
 */


export type PostWhereInput = {
  uuid?: string | UUIDFilter
  createdAt?: Date | string | DateTimeFilter
  updatedAt?: Date | string | DateTimeFilter
  published?: boolean | BooleanFilter
  title?: string | StringFilter
  content?: string | NullableStringFilter | null
  authorId?: number | IntFilter
  kind?: PostKind | NullablePostKindFilter | null
  metadata?: JsonFilter
  AND?: Enumerable<PostWhereInput>
  OR?: Array<PostWhereInput>
  NOT?: Enumerable<PostWhereInput>
  author?: UserWhereInput | null
}

export type UserWhereInput = {
  id?: number | IntFilter
  email?: string | StringFilter
  name?: string | NullableStringFilter | null
  age?: number | IntFilter
  balance?: number | FloatFilter
  amount?: number | FloatFilter
  posts?: PostFilter | null
  role?: Role | RoleFilter
  AND?: Enumerable<UserWhereInput>
  OR?: Array<UserWhereInput>
  NOT?: Enumerable<UserWhereInput>
}

export type UserWhereUniqueInput = {
  id?: number
  email?: string
}

export type PostWhereUniqueInput = {
  uuid?: string
}

export type CategoryWhereInput = {
  name?: string | StringFilter
  slug?: string | StringFilter
  number?: number | IntFilter
  AND?: Enumerable<CategoryWhereInput>
  OR?: Array<CategoryWhereInput>
  NOT?: Enumerable<CategoryWhereInput>
}

export type SlugNumberCompoundUniqueInput = {
  slug: string
  number: number
}

export type CategoryWhereUniqueInput = {
  slug_number?: SlugNumberCompoundUniqueInput
}

export type PatientWhereInput = {
  firstName?: string | StringFilter
  lastName?: string | StringFilter
  email?: string | StringFilter
  AND?: Enumerable<PatientWhereInput>
  OR?: Array<PatientWhereInput>
  NOT?: Enumerable<PatientWhereInput>
}

export type FirstNameLastNameCompoundUniqueInput = {
  firstName: string
  lastName: string
}

export type PatientWhereUniqueInput = {
  firstName_lastName?: FirstNameLastNameCompoundUniqueInput
}

export type DirectorWhereInput = {
  firstName?: string | StringFilter
  lastName?: string | StringFilter
  movies?: MovieFilter | null
  AND?: Enumerable<DirectorWhereInput>
  OR?: Array<DirectorWhereInput>
  NOT?: Enumerable<DirectorWhereInput>
}

export type MovieWhereInput = {
  directorFirstName?: string | StringFilter
  directorLastName?: string | StringFilter
  title?: string | StringFilter
  AND?: Enumerable<MovieWhereInput>
  OR?: Array<MovieWhereInput>
  NOT?: Enumerable<MovieWhereInput>
  director?: DirectorWhereInput | null
}

export type DirectorFirstNameDirectorLastNameTitleCompoundUniqueInput = {
  directorFirstName: string
  directorLastName: string
  title: string
}

export type MovieWhereUniqueInput = {
  directorFirstName_directorLastName_title?: DirectorFirstNameDirectorLastNameTitleCompoundUniqueInput
}

export type DirectorWhereUniqueInput = {
  firstName_lastName?: FirstNameLastNameCompoundUniqueInput
}

export type PostCreateWithoutAuthorInput = {
  uuid?: string
  createdAt?: Date | string
  updatedAt?: Date | string
  published: boolean
  title: string
  content?: string | null
  kind?: PostKind | null
  metadata: InputJsonValue
}

export type PostCreateManyWithoutAuthorInput = {
  create?: Enumerable<PostCreateWithoutAuthorInput>
  connect?: Enumerable<PostWhereUniqueInput>
}

export type UserCreateInput = {
  email: string
  name?: string | null
  age: number
  balance: number
  amount: number
  role: Role
  posts?: PostCreateManyWithoutAuthorInput | null
}

export type PostUpdateWithoutAuthorDataInput = {
  uuid?: string
  createdAt?: Date | string
  updatedAt?: Date | string
  published?: boolean
  title?: string
  content?: string | null
  kind?: PostKind | null
  metadata?: InputJsonValue
}

export type PostUpdateWithWhereUniqueWithoutAuthorInput = {
  where: PostWhereUniqueInput
  data: PostUpdateWithoutAuthorDataInput
}

export type PostScalarWhereInput = {
  uuid?: string | UUIDFilter
  createdAt?: Date | string | DateTimeFilter
  updatedAt?: Date | string | DateTimeFilter
  published?: boolean | BooleanFilter
  title?: string | StringFilter
  content?: string | NullableStringFilter | null
  authorId?: number | IntFilter
  kind?: PostKind | NullablePostKindFilter | null
  metadata?: JsonFilter
  AND?: Enumerable<PostScalarWhereInput>
  OR?: Array<PostScalarWhereInput>
  NOT?: Enumerable<PostScalarWhereInput>
}

export type PostUpdateManyDataInput = {
  uuid?: string
  createdAt?: Date | string
  updatedAt?: Date | string
  published?: boolean
  title?: string
  content?: string | null
  kind?: PostKind | null
  metadata?: InputJsonValue
}

export type PostUpdateManyWithWhereNestedInput = {
  where: PostScalarWhereInput
  data: PostUpdateManyDataInput
}

export type PostUpsertWithWhereUniqueWithoutAuthorInput = {
  where: PostWhereUniqueInput
  update: PostUpdateWithoutAuthorDataInput
  create: PostCreateWithoutAuthorInput
}

export type PostUpdateManyWithoutAuthorInput = {
  create?: Enumerable<PostCreateWithoutAuthorInput>
  connect?: Enumerable<PostWhereUniqueInput>
  set?: Enumerable<PostWhereUniqueInput>
  disconnect?: Enumerable<PostWhereUniqueInput>
  delete?: Enumerable<PostWhereUniqueInput>
  update?: Enumerable<PostUpdateWithWhereUniqueWithoutAuthorInput>
  updateMany?: Enumerable<PostUpdateManyWithWhereNestedInput>
  deleteMany?: Enumerable<PostScalarWhereInput>
  upsert?: Enumerable<PostUpsertWithWhereUniqueWithoutAuthorInput>
}

export type UserUpdateInput = {
  id?: number
  email?: string
  name?: string | null
  age?: number
  balance?: number
  amount?: number
  role?: Role
  posts?: PostUpdateManyWithoutAuthorInput
}

export type UserUpdateManyMutationInput = {
  id?: number
  email?: string
  name?: string | null
  age?: number
  balance?: number
  amount?: number
  role?: Role
}

export type UserCreateWithoutPostsInput = {
  email: string
  name?: string | null
  age: number
  balance: number
  amount: number
  role: Role
}

export type UserCreateOneWithoutPostsInput = {
  create?: UserCreateWithoutPostsInput
  connect?: UserWhereUniqueInput
}

export type PostCreateInput = {
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

export type UserUpdateWithoutPostsDataInput = {
  id?: number
  email?: string
  name?: string | null
  age?: number
  balance?: number
  amount?: number
  role?: Role
}

export type UserUpsertWithoutPostsInput = {
  update: UserUpdateWithoutPostsDataInput
  create: UserCreateWithoutPostsInput
}

export type UserUpdateOneRequiredWithoutPostsInput = {
  create?: UserCreateWithoutPostsInput
  connect?: UserWhereUniqueInput
  update?: UserUpdateWithoutPostsDataInput
  upsert?: UserUpsertWithoutPostsInput
}

export type PostUpdateInput = {
  uuid?: string
  createdAt?: Date | string
  updatedAt?: Date | string
  published?: boolean
  title?: string
  content?: string | null
  kind?: PostKind | null
  metadata?: InputJsonValue
  author?: UserUpdateOneRequiredWithoutPostsInput
}

export type PostUpdateManyMutationInput = {
  uuid?: string
  createdAt?: Date | string
  updatedAt?: Date | string
  published?: boolean
  title?: string
  content?: string | null
  kind?: PostKind | null
  metadata?: InputJsonValue
}

export type CategoryCreateInput = {
  name: string
  slug: string
  number: number
}

export type CategoryUpdateInput = {
  name?: string
  slug?: string
  number?: number
}

export type CategoryUpdateManyMutationInput = {
  name?: string
  slug?: string
  number?: number
}

export type PatientCreateInput = {
  firstName: string
  lastName: string
  email: string
}

export type PatientUpdateInput = {
  firstName?: string
  lastName?: string
  email?: string
}

export type PatientUpdateManyMutationInput = {
  firstName?: string
  lastName?: string
  email?: string
}

export type DirectorCreateWithoutMoviesInput = {
  firstName: string
  lastName: string
}

export type DirectorCreateOneWithoutMoviesInput = {
  create?: DirectorCreateWithoutMoviesInput
  connect?: DirectorWhereUniqueInput
}

export type MovieCreateInput = {
  title: string
  director: DirectorCreateOneWithoutMoviesInput
}

export type DirectorUpdateWithoutMoviesDataInput = {
  firstName?: string
  lastName?: string
}

export type DirectorUpsertWithoutMoviesInput = {
  update: DirectorUpdateWithoutMoviesDataInput
  create: DirectorCreateWithoutMoviesInput
}

export type DirectorUpdateOneRequiredWithoutMoviesInput = {
  create?: DirectorCreateWithoutMoviesInput
  connect?: DirectorWhereUniqueInput
  update?: DirectorUpdateWithoutMoviesDataInput
  upsert?: DirectorUpsertWithoutMoviesInput
}

export type MovieUpdateInput = {
  title?: string
  director?: DirectorUpdateOneRequiredWithoutMoviesInput
}

export type MovieUpdateManyMutationInput = {
  title?: string
}

export type MovieCreateWithoutDirectorInput = {
  title: string
}

export type MovieCreateManyWithoutDirectorInput = {
  create?: Enumerable<MovieCreateWithoutDirectorInput>
  connect?: Enumerable<MovieWhereUniqueInput>
}

export type DirectorCreateInput = {
  firstName: string
  lastName: string
  movies?: MovieCreateManyWithoutDirectorInput | null
}

export type MovieUpdateWithoutDirectorDataInput = {
  title?: string
}

export type MovieUpdateWithWhereUniqueWithoutDirectorInput = {
  where: MovieWhereUniqueInput
  data: MovieUpdateWithoutDirectorDataInput
}

export type MovieScalarWhereInput = {
  directorFirstName?: string | StringFilter
  directorLastName?: string | StringFilter
  title?: string | StringFilter
  AND?: Enumerable<MovieScalarWhereInput>
  OR?: Array<MovieScalarWhereInput>
  NOT?: Enumerable<MovieScalarWhereInput>
}

export type MovieUpdateManyDataInput = {
  title?: string
}

export type MovieUpdateManyWithWhereNestedInput = {
  where: MovieScalarWhereInput
  data: MovieUpdateManyDataInput
}

export type MovieUpsertWithWhereUniqueWithoutDirectorInput = {
  where: MovieWhereUniqueInput
  update: MovieUpdateWithoutDirectorDataInput
  create: MovieCreateWithoutDirectorInput
}

export type MovieUpdateManyWithoutDirectorInput = {
  create?: Enumerable<MovieCreateWithoutDirectorInput>
  connect?: Enumerable<MovieWhereUniqueInput>
  set?: Enumerable<MovieWhereUniqueInput>
  disconnect?: Enumerable<MovieWhereUniqueInput>
  delete?: Enumerable<MovieWhereUniqueInput>
  update?: Enumerable<MovieUpdateWithWhereUniqueWithoutDirectorInput>
  updateMany?: Enumerable<MovieUpdateManyWithWhereNestedInput>
  deleteMany?: Enumerable<MovieScalarWhereInput>
  upsert?: Enumerable<MovieUpsertWithWhereUniqueWithoutDirectorInput>
}

export type DirectorUpdateInput = {
  firstName?: string
  lastName?: string
  movies?: MovieUpdateManyWithoutDirectorInput
}

export type DirectorUpdateManyMutationInput = {
  firstName?: string
  lastName?: string
}

export type UUIDFilter = {
  equals?: string
  not?: string | UUIDFilter
  in?: Enumerable<string>
  notIn?: Enumerable<string>
  lt?: string
  lte?: string
  gt?: string
  gte?: string
  contains?: string
  startsWith?: string
  endsWith?: string
}

export type DateTimeFilter = {
  equals?: Date | string
  not?: Date | string | DateTimeFilter
  in?: Enumerable<Date | string>
  notIn?: Enumerable<Date | string>
  lt?: Date | string
  lte?: Date | string
  gt?: Date | string
  gte?: Date | string
}

export type BooleanFilter = {
  equals?: boolean
  not?: boolean | BooleanFilter
}

export type StringFilter = {
  equals?: string
  not?: string | StringFilter
  in?: Enumerable<string>
  notIn?: Enumerable<string>
  lt?: string
  lte?: string
  gt?: string
  gte?: string
  contains?: string
  startsWith?: string
  endsWith?: string
}

export type NullableStringFilter = {
  equals?: string | null
  not?: string | null | NullableStringFilter
  in?: Enumerable<string> | null
  notIn?: Enumerable<string> | null
  lt?: string | null
  lte?: string | null
  gt?: string | null
  gte?: string | null
  contains?: string | null
  startsWith?: string | null
  endsWith?: string | null
}

export type IntFilter = {
  equals?: number
  not?: number | IntFilter
  in?: Enumerable<number>
  notIn?: Enumerable<number>
  lt?: number
  lte?: number
  gt?: number
  gte?: number
}

export type NullablePostKindFilter = {
  equals?: PostKind | null
  not?: PostKind | null | NullablePostKindFilter
  in?: Enumerable<PostKind> | null
  notIn?: Enumerable<PostKind> | null
}

export type JsonFilter = {
  equals?: InputJsonValue
  not?: InputJsonValue | JsonFilter
}

export type FloatFilter = {
  equals?: number
  not?: number | FloatFilter
  in?: Enumerable<number>
  notIn?: Enumerable<number>
  lt?: number
  lte?: number
  gt?: number
  gte?: number
}

export type PostFilter = {
  every?: PostWhereInput
  some?: PostWhereInput
  none?: PostWhereInput
}

export type RoleFilter = {
  equals?: Role
  not?: Role | RoleFilter
  in?: Enumerable<Role>
  notIn?: Enumerable<Role>
}

export type MovieFilter = {
  every?: MovieWhereInput
  some?: MovieWhereInput
  none?: MovieWhereInput
}

export type UserOrderByInput = {
  id?: OrderByArg | null
  email?: OrderByArg | null
  name?: OrderByArg | null
  age?: OrderByArg | null
  balance?: OrderByArg | null
  amount?: OrderByArg | null
  role?: OrderByArg | null
}

export type PostOrderByInput = {
  uuid?: OrderByArg | null
  createdAt?: OrderByArg | null
  updatedAt?: OrderByArg | null
  published?: OrderByArg | null
  title?: OrderByArg | null
  content?: OrderByArg | null
  authorId?: OrderByArg | null
  kind?: OrderByArg | null
  metadata?: OrderByArg | null
}

export type CategoryOrderByInput = {
  name?: OrderByArg | null
  slug?: OrderByArg | null
  number?: OrderByArg | null
}

export type PatientOrderByInput = {
  firstName?: OrderByArg | null
  lastName?: OrderByArg | null
  email?: OrderByArg | null
}

export type MovieOrderByInput = {
  directorFirstName?: OrderByArg | null
  directorLastName?: OrderByArg | null
  title?: OrderByArg | null
}

export type DirectorOrderByInput = {
  firstName?: OrderByArg | null
  lastName?: OrderByArg | null
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
