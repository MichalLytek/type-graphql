import {
  DMMF,
  DMMFClass,
  Engine,
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
} from './runtime';

export { PrismaClientKnownRequestError }
export { PrismaClientUnknownRequestError }
export { PrismaClientRustPanicError }
export { PrismaClientInitializationError }
export { PrismaClientValidationError }

/**
 * Query Engine version: a5496bff511ac9d1efe467700d3b8955e6030765
 * Prisma Client JS version: 2.0.0-alpha.980
 */
export declare type PrismaVersion = {
  client: string
}

export declare const prismaVersion: PrismaVersion 

/**
 * Utility Types
 */

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


export type Datasources = {
  db?: string
}

export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'

export interface PrismaClientOptions {
  datasources?: Datasources

  /**
   * @default "pretty"
   */
  errorFormat?: ErrorFormat

  log?: Array<LogLevel | LogDefinition>

  /**
   * You probably don't want to use this. `__internal` is used by internal tooling.
   */
  __internal?: {
    debug?: boolean
    hooks?: Hooks
    engine?: {
      cwd?: string
      binaryPath?: string
    }
    measurePerformance?: boolean
  }

  /**
   * Useful for pgbouncer
   */
  forceTransactions?: boolean
}

export type Hooks = {
  beforeRequest?: (options: {query: string, path: string[], rootField?: string, typeName?: string, document: any}) => any
}

/* Types for Logging */
export type LogLevel = 'info' | 'query' | 'warn'
export type LogDefinition = {
  level: LogLevel
  emit: 'stdout' | 'event'
}

export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
export type GetEvents<T extends Array<LogLevel | LogDefinition>> = GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]>

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
 * Read more in our [docs](https://github.com/prisma/prisma2/blob/master/docs/prisma-client-js/api.md).
 */
export declare class PrismaClient<T extends PrismaClientOptions = {}, U = keyof T extends 'log' ? T['log'] extends Array<LogLevel | LogDefinition> ? GetEvents<T['log']> : never : never> {
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
   * Read more in our [docs](https://github.com/prisma/prisma2/blob/master/docs/prisma-client-js/api.md).
   */
  constructor(optionsArg?: T);
  on<V extends U>(eventType: V, callback: V extends never ? never : (event: V extends 'query' ? QueryEvent : LogEvent) => void): void;
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
   * Makes a raw query
   * @example
   * ```
   * // Fetch all entries from the `User` table
   * const result = await prisma.raw`SELECT * FROM User;`
   * // Or
   * const result = await prisma.raw('SELECT * FROM User;')
   * 
   * // With parameters use prisma.raw``, values will be escaped automatically
   * const userId = '1'
   * const result = await prisma.raw`SELECT * FROM User WHERE id = ${userId};`
  * ```
  * 
  * Read more in our [docs](https://github.com/prisma/prisma2/blob/master/docs/prisma-client-js/api.md#raw-database-access).
  */
  raw<T = any>(query: string | TemplateStringsArray, ...values: any[]): Promise<T>;

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
  : S extends UserArgs
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
  ): CheckSelect<T, UserClient<User | null>, UserClient<UserGetPayload<T> | null>>
  /**
   * Find zero or more Users.
   * @param {FindManyUserArgs=} args - Arguments to filter and select certain fields only.
   * @example
   * // Get all Users
   * const users = await prisma.user.findMany()
   * 
   * // Get first 10 Users
   * const users = await prisma.user.findMany({ first: 10 })
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
   * const user = await prisma.user.create({
   *   data: {
   *     // ... data to create a User
   *   }
   * })
   * 
  **/
  create<T extends UserCreateArgs>(
    args: Subset<T, UserCreateArgs>
  ): CheckSelect<T, UserClient<User>, UserClient<UserGetPayload<T>>>
  /**
   * Delete a User.
   * @param {UserDeleteArgs} args - Arguments to delete one User.
   * @example
   * // Delete one User
   * const user = await prisma.user.delete({
   *   where: {
   *     // ... filter to delete one User
   *   }
   * })
   * 
  **/
  delete<T extends UserDeleteArgs>(
    args: Subset<T, UserDeleteArgs>
  ): CheckSelect<T, UserClient<User>, UserClient<UserGetPayload<T>>>
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
   *     // ... provider data here
   *   }
   * })
   * 
  **/
  update<T extends UserUpdateArgs>(
    args: Subset<T, UserUpdateArgs>
  ): CheckSelect<T, UserClient<User>, UserClient<UserGetPayload<T>>>
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
   *     // ... provider data here
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
  ): CheckSelect<T, UserClient<User>, UserClient<UserGetPayload<T>>>
  /**
   * 
   */
  count(): Promise<number>
}

export declare class UserClient<T> implements Promise<T> {
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
  where?: UserWhereInput | null
  /**
   * Determine the order of the Users to fetch.
  **/
  orderBy?: UserOrderByInput | null
  /**
   * Skip the first `n` Users.
  **/
  skip?: number | null
  /**
   * Get all Users that come after the User you provide with the current order.
  **/
  after?: UserWhereUniqueInput | null
  /**
   * Get all Users that come before the User you provide with the current order.
  **/
  before?: UserWhereUniqueInput | null
  /**
   * Get the first `n` Users.
  **/
  first?: number | null
  /**
   * Get the last `n` Users.
  **/
  last?: number | null
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
  where?: UserWhereInput | null
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
  where?: UserWhereInput | null
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
  kind: PostKind | null
}

export type PostSelect = {
  uuid?: boolean
  createdAt?: boolean
  updatedAt?: boolean
  published?: boolean
  title?: boolean
  content?: boolean
  author?: boolean | UserArgs
  kind?: boolean
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
  : S extends PostArgs
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
  ): CheckSelect<T, PostClient<Post | null>, PostClient<PostGetPayload<T> | null>>
  /**
   * Find zero or more Posts.
   * @param {FindManyPostArgs=} args - Arguments to filter and select certain fields only.
   * @example
   * // Get all Posts
   * const posts = await prisma.post.findMany()
   * 
   * // Get first 10 Posts
   * const posts = await prisma.post.findMany({ first: 10 })
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
   * const user = await prisma.post.create({
   *   data: {
   *     // ... data to create a Post
   *   }
   * })
   * 
  **/
  create<T extends PostCreateArgs>(
    args: Subset<T, PostCreateArgs>
  ): CheckSelect<T, PostClient<Post>, PostClient<PostGetPayload<T>>>
  /**
   * Delete a Post.
   * @param {PostDeleteArgs} args - Arguments to delete one Post.
   * @example
   * // Delete one Post
   * const user = await prisma.post.delete({
   *   where: {
   *     // ... filter to delete one Post
   *   }
   * })
   * 
  **/
  delete<T extends PostDeleteArgs>(
    args: Subset<T, PostDeleteArgs>
  ): CheckSelect<T, PostClient<Post>, PostClient<PostGetPayload<T>>>
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
   *     // ... provider data here
   *   }
   * })
   * 
  **/
  update<T extends PostUpdateArgs>(
    args: Subset<T, PostUpdateArgs>
  ): CheckSelect<T, PostClient<Post>, PostClient<PostGetPayload<T>>>
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
   *     // ... provider data here
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
  ): CheckSelect<T, PostClient<Post>, PostClient<PostGetPayload<T>>>
  /**
   * 
   */
  count(): Promise<number>
}

export declare class PostClient<T> implements Promise<T> {
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

  author<T extends UserArgs = {}>(args?: Subset<T, UserArgs>): CheckSelect<T, UserClient<User | null>, UserClient<UserGetPayload<T> | null>>;

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
  where?: PostWhereInput | null
  /**
   * Determine the order of the Posts to fetch.
  **/
  orderBy?: PostOrderByInput | null
  /**
   * Skip the first `n` Posts.
  **/
  skip?: number | null
  /**
   * Get all Posts that come after the Post you provide with the current order.
  **/
  after?: PostWhereUniqueInput | null
  /**
   * Get all Posts that come before the Post you provide with the current order.
  **/
  before?: PostWhereUniqueInput | null
  /**
   * Get the first `n` Posts.
  **/
  first?: number | null
  /**
   * Get the last `n` Posts.
  **/
  last?: number | null
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
  where?: PostWhereInput | null
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
  where?: PostWhereInput | null
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

export type CategoryInclude = {

}

export type CategoryGetPayload<
  S extends boolean | null | undefined | CategoryArgs,
  U = keyof S
> = S extends true
  ? Category
  : S extends undefined
  ? never
  : S extends CategoryArgs
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
  ): CheckSelect<T, CategoryClient<Category | null>, CategoryClient<CategoryGetPayload<T> | null>>
  /**
   * Find zero or more Categories.
   * @param {FindManyCategoryArgs=} args - Arguments to filter and select certain fields only.
   * @example
   * // Get all Categories
   * const categories = await prisma.category.findMany()
   * 
   * // Get first 10 Categories
   * const categories = await prisma.category.findMany({ first: 10 })
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
   * const user = await prisma.category.create({
   *   data: {
   *     // ... data to create a Category
   *   }
   * })
   * 
  **/
  create<T extends CategoryCreateArgs>(
    args: Subset<T, CategoryCreateArgs>
  ): CheckSelect<T, CategoryClient<Category>, CategoryClient<CategoryGetPayload<T>>>
  /**
   * Delete a Category.
   * @param {CategoryDeleteArgs} args - Arguments to delete one Category.
   * @example
   * // Delete one Category
   * const user = await prisma.category.delete({
   *   where: {
   *     // ... filter to delete one Category
   *   }
   * })
   * 
  **/
  delete<T extends CategoryDeleteArgs>(
    args: Subset<T, CategoryDeleteArgs>
  ): CheckSelect<T, CategoryClient<Category>, CategoryClient<CategoryGetPayload<T>>>
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
   *     // ... provider data here
   *   }
   * })
   * 
  **/
  update<T extends CategoryUpdateArgs>(
    args: Subset<T, CategoryUpdateArgs>
  ): CheckSelect<T, CategoryClient<Category>, CategoryClient<CategoryGetPayload<T>>>
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
   *     // ... provider data here
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
  ): CheckSelect<T, CategoryClient<Category>, CategoryClient<CategoryGetPayload<T>>>
  /**
   * 
   */
  count(): Promise<number>
}

export declare class CategoryClient<T> implements Promise<T> {
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
   * Choose, which related nodes to fetch as well.
  **/
  include?: CategoryInclude | null
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
   * Choose, which related nodes to fetch as well.
  **/
  include?: CategoryInclude | null
  /**
   * Filter, which Categories to fetch.
  **/
  where?: CategoryWhereInput | null
  /**
   * Determine the order of the Categories to fetch.
  **/
  orderBy?: CategoryOrderByInput | null
  /**
   * Skip the first `n` Categories.
  **/
  skip?: number | null
  /**
   * Get all Categories that come after the Category you provide with the current order.
  **/
  after?: CategoryWhereUniqueInput | null
  /**
   * Get all Categories that come before the Category you provide with the current order.
  **/
  before?: CategoryWhereUniqueInput | null
  /**
   * Get the first `n` Categories.
  **/
  first?: number | null
  /**
   * Get the last `n` Categories.
  **/
  last?: number | null
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
   * Choose, which related nodes to fetch as well.
  **/
  include?: CategoryInclude | null
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
   * Choose, which related nodes to fetch as well.
  **/
  include?: CategoryInclude | null
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
  where?: CategoryWhereInput | null
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
   * Choose, which related nodes to fetch as well.
  **/
  include?: CategoryInclude | null
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
   * Choose, which related nodes to fetch as well.
  **/
  include?: CategoryInclude | null
  /**
   * Filter which Category to delete.
  **/
  where: CategoryWhereUniqueInput
}


/**
 * Category deleteMany
 */
export type CategoryDeleteManyArgs = {
  where?: CategoryWhereInput | null
}


/**
 * Category without action
 */
export type CategoryArgs = {
  /**
   * Select specific fields to fetch from the Category
  **/
  select?: CategorySelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: CategoryInclude | null
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

export type PatientInclude = {

}

export type PatientGetPayload<
  S extends boolean | null | undefined | PatientArgs,
  U = keyof S
> = S extends true
  ? Patient
  : S extends undefined
  ? never
  : S extends PatientArgs
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
  ): CheckSelect<T, PatientClient<Patient | null>, PatientClient<PatientGetPayload<T> | null>>
  /**
   * Find zero or more Patients.
   * @param {FindManyPatientArgs=} args - Arguments to filter and select certain fields only.
   * @example
   * // Get all Patients
   * const patients = await prisma.patient.findMany()
   * 
   * // Get first 10 Patients
   * const patients = await prisma.patient.findMany({ first: 10 })
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
   * const user = await prisma.patient.create({
   *   data: {
   *     // ... data to create a Patient
   *   }
   * })
   * 
  **/
  create<T extends PatientCreateArgs>(
    args: Subset<T, PatientCreateArgs>
  ): CheckSelect<T, PatientClient<Patient>, PatientClient<PatientGetPayload<T>>>
  /**
   * Delete a Patient.
   * @param {PatientDeleteArgs} args - Arguments to delete one Patient.
   * @example
   * // Delete one Patient
   * const user = await prisma.patient.delete({
   *   where: {
   *     // ... filter to delete one Patient
   *   }
   * })
   * 
  **/
  delete<T extends PatientDeleteArgs>(
    args: Subset<T, PatientDeleteArgs>
  ): CheckSelect<T, PatientClient<Patient>, PatientClient<PatientGetPayload<T>>>
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
   *     // ... provider data here
   *   }
   * })
   * 
  **/
  update<T extends PatientUpdateArgs>(
    args: Subset<T, PatientUpdateArgs>
  ): CheckSelect<T, PatientClient<Patient>, PatientClient<PatientGetPayload<T>>>
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
   *     // ... provider data here
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
  ): CheckSelect<T, PatientClient<Patient>, PatientClient<PatientGetPayload<T>>>
  /**
   * 
   */
  count(): Promise<number>
}

export declare class PatientClient<T> implements Promise<T> {
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
   * Choose, which related nodes to fetch as well.
  **/
  include?: PatientInclude | null
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
   * Choose, which related nodes to fetch as well.
  **/
  include?: PatientInclude | null
  /**
   * Filter, which Patients to fetch.
  **/
  where?: PatientWhereInput | null
  /**
   * Determine the order of the Patients to fetch.
  **/
  orderBy?: PatientOrderByInput | null
  /**
   * Skip the first `n` Patients.
  **/
  skip?: number | null
  /**
   * Get all Patients that come after the Patient you provide with the current order.
  **/
  after?: PatientWhereUniqueInput | null
  /**
   * Get all Patients that come before the Patient you provide with the current order.
  **/
  before?: PatientWhereUniqueInput | null
  /**
   * Get the first `n` Patients.
  **/
  first?: number | null
  /**
   * Get the last `n` Patients.
  **/
  last?: number | null
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
   * Choose, which related nodes to fetch as well.
  **/
  include?: PatientInclude | null
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
   * Choose, which related nodes to fetch as well.
  **/
  include?: PatientInclude | null
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
  where?: PatientWhereInput | null
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
   * Choose, which related nodes to fetch as well.
  **/
  include?: PatientInclude | null
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
   * Choose, which related nodes to fetch as well.
  **/
  include?: PatientInclude | null
  /**
   * Filter which Patient to delete.
  **/
  where: PatientWhereUniqueInput
}


/**
 * Patient deleteMany
 */
export type PatientDeleteManyArgs = {
  where?: PatientWhereInput | null
}


/**
 * Patient without action
 */
export type PatientArgs = {
  /**
   * Select specific fields to fetch from the Patient
  **/
  select?: PatientSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: PatientInclude | null
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
  : S extends MovieArgs
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
  ): CheckSelect<T, MovieClient<Movie | null>, MovieClient<MovieGetPayload<T> | null>>
  /**
   * Find zero or more Movies.
   * @param {FindManyMovieArgs=} args - Arguments to filter and select certain fields only.
   * @example
   * // Get all Movies
   * const movies = await prisma.movie.findMany()
   * 
   * // Get first 10 Movies
   * const movies = await prisma.movie.findMany({ first: 10 })
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
   * const user = await prisma.movie.create({
   *   data: {
   *     // ... data to create a Movie
   *   }
   * })
   * 
  **/
  create<T extends MovieCreateArgs>(
    args: Subset<T, MovieCreateArgs>
  ): CheckSelect<T, MovieClient<Movie>, MovieClient<MovieGetPayload<T>>>
  /**
   * Delete a Movie.
   * @param {MovieDeleteArgs} args - Arguments to delete one Movie.
   * @example
   * // Delete one Movie
   * const user = await prisma.movie.delete({
   *   where: {
   *     // ... filter to delete one Movie
   *   }
   * })
   * 
  **/
  delete<T extends MovieDeleteArgs>(
    args: Subset<T, MovieDeleteArgs>
  ): CheckSelect<T, MovieClient<Movie>, MovieClient<MovieGetPayload<T>>>
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
   *     // ... provider data here
   *   }
   * })
   * 
  **/
  update<T extends MovieUpdateArgs>(
    args: Subset<T, MovieUpdateArgs>
  ): CheckSelect<T, MovieClient<Movie>, MovieClient<MovieGetPayload<T>>>
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
   *     // ... provider data here
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
  ): CheckSelect<T, MovieClient<Movie>, MovieClient<MovieGetPayload<T>>>
  /**
   * 
   */
  count(): Promise<number>
}

export declare class MovieClient<T> implements Promise<T> {
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

  director<T extends DirectorArgs = {}>(args?: Subset<T, DirectorArgs>): CheckSelect<T, DirectorClient<Director | null>, DirectorClient<DirectorGetPayload<T> | null>>;

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
  where?: MovieWhereInput | null
  /**
   * Determine the order of the Movies to fetch.
  **/
  orderBy?: MovieOrderByInput | null
  /**
   * Skip the first `n` Movies.
  **/
  skip?: number | null
  /**
   * Get all Movies that come after the Movie you provide with the current order.
  **/
  after?: MovieWhereUniqueInput | null
  /**
   * Get all Movies that come before the Movie you provide with the current order.
  **/
  before?: MovieWhereUniqueInput | null
  /**
   * Get the first `n` Movies.
  **/
  first?: number | null
  /**
   * Get the last `n` Movies.
  **/
  last?: number | null
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
  where?: MovieWhereInput | null
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
  where?: MovieWhereInput | null
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
  : S extends DirectorArgs
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
  ): CheckSelect<T, DirectorClient<Director | null>, DirectorClient<DirectorGetPayload<T> | null>>
  /**
   * Find zero or more Directors.
   * @param {FindManyDirectorArgs=} args - Arguments to filter and select certain fields only.
   * @example
   * // Get all Directors
   * const directors = await prisma.director.findMany()
   * 
   * // Get first 10 Directors
   * const directors = await prisma.director.findMany({ first: 10 })
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
   * const user = await prisma.director.create({
   *   data: {
   *     // ... data to create a Director
   *   }
   * })
   * 
  **/
  create<T extends DirectorCreateArgs>(
    args: Subset<T, DirectorCreateArgs>
  ): CheckSelect<T, DirectorClient<Director>, DirectorClient<DirectorGetPayload<T>>>
  /**
   * Delete a Director.
   * @param {DirectorDeleteArgs} args - Arguments to delete one Director.
   * @example
   * // Delete one Director
   * const user = await prisma.director.delete({
   *   where: {
   *     // ... filter to delete one Director
   *   }
   * })
   * 
  **/
  delete<T extends DirectorDeleteArgs>(
    args: Subset<T, DirectorDeleteArgs>
  ): CheckSelect<T, DirectorClient<Director>, DirectorClient<DirectorGetPayload<T>>>
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
   *     // ... provider data here
   *   }
   * })
   * 
  **/
  update<T extends DirectorUpdateArgs>(
    args: Subset<T, DirectorUpdateArgs>
  ): CheckSelect<T, DirectorClient<Director>, DirectorClient<DirectorGetPayload<T>>>
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
   *     // ... provider data here
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
  ): CheckSelect<T, DirectorClient<Director>, DirectorClient<DirectorGetPayload<T>>>
  /**
   * 
   */
  count(): Promise<number>
}

export declare class DirectorClient<T> implements Promise<T> {
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
  where?: DirectorWhereInput | null
  /**
   * Determine the order of the Directors to fetch.
  **/
  orderBy?: DirectorOrderByInput | null
  /**
   * Skip the first `n` Directors.
  **/
  skip?: number | null
  /**
   * Get all Directors that come after the Director you provide with the current order.
  **/
  after?: DirectorWhereUniqueInput | null
  /**
   * Get all Directors that come before the Director you provide with the current order.
  **/
  before?: DirectorWhereUniqueInput | null
  /**
   * Get the first `n` Directors.
  **/
  first?: number | null
  /**
   * Get the last `n` Directors.
  **/
  last?: number | null
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
  where?: DirectorWhereInput | null
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
  where?: DirectorWhereInput | null
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


export type authorCompoundInlineFilterInput = {

}

export type PostWhereInput = {
  uuid?: string | UUIDFilter | null
  createdAt?: Date | string | DateTimeFilter | null
  updatedAt?: Date | string | DateTimeFilter | null
  published?: boolean | BooleanFilter | null
  title?: string | StringFilter | null
  content?: string | NullableStringFilter | null
  kind?: PostKind | NullablePostKindFilter | null
  AND?: Enumerable<PostWhereInput> | null
  OR?: Enumerable<PostWhereInput> | null
  NOT?: Enumerable<PostWhereInput> | null
  author?: UserWhereInput | null
}

export type UserWhereInput = {
  id?: number | IntFilter | null
  email?: string | StringFilter | null
  name?: string | NullableStringFilter | null
  age?: number | IntFilter | null
  balance?: number | FloatFilter | null
  amount?: number | FloatFilter | null
  posts?: PostFilter | null
  role?: Role | RoleFilter | null
  AND?: Enumerable<UserWhereInput> | null
  OR?: Enumerable<UserWhereInput> | null
  NOT?: Enumerable<UserWhereInput> | null
}

export type UserWhereUniqueInput = {
  id?: number | null
  email?: string | null
}

export type PostWhereUniqueInput = {
  uuid?: string | null
}

export type CategoryWhereInput = {
  name?: string | StringFilter | null
  slug?: string | StringFilter | null
  number?: number | IntFilter | null
  AND?: Enumerable<CategoryWhereInput> | null
  OR?: Enumerable<CategoryWhereInput> | null
  NOT?: Enumerable<CategoryWhereInput> | null
}

export type SlugNumberCompoundUniqueInput = {
  slug: string
  number: number
}

export type CategoryWhereUniqueInput = {
  slug_number?: SlugNumberCompoundUniqueInput | null
}

export type PatientWhereInput = {
  firstName?: string | StringFilter | null
  lastName?: string | StringFilter | null
  email?: string | StringFilter | null
  AND?: Enumerable<PatientWhereInput> | null
  OR?: Enumerable<PatientWhereInput> | null
  NOT?: Enumerable<PatientWhereInput> | null
}

export type FirstNameLastNameCompoundUniqueInput = {
  firstName: string
  lastName: string
}

export type PatientWhereUniqueInput = {
  firstName_lastName?: FirstNameLastNameCompoundUniqueInput | null
}

export type DirectorWhereInput = {
  firstName?: string | StringFilter | null
  lastName?: string | StringFilter | null
  movies?: MovieFilter | null
  AND?: Enumerable<DirectorWhereInput> | null
  OR?: Enumerable<DirectorWhereInput> | null
  NOT?: Enumerable<DirectorWhereInput> | null
}

export type directorCompoundInlineFilterInput = {
  directorFirstName: string
  directorLastName: string
}

export type MovieWhereInput = {
  directorFirstName?: string | StringFilter | null
  directorLastName?: string | StringFilter | null
  title?: string | StringFilter | null
  AND?: Enumerable<MovieWhereInput> | null
  OR?: Enumerable<MovieWhereInput> | null
  NOT?: Enumerable<MovieWhereInput> | null
  director?: DirectorWhereInput | null
}

export type DirectorFirstNameDirectorLastNameTitleCompoundUniqueInput = {
  directorFirstName: string
  directorLastName: string
  title: string
}

export type MovieWhereUniqueInput = {
  directorFirstName_directorLastName_title?: DirectorFirstNameDirectorLastNameTitleCompoundUniqueInput | null
}

export type DirectorWhereUniqueInput = {
  firstName_lastName?: FirstNameLastNameCompoundUniqueInput | null
}

export type PostCreateWithoutAuthorInput = {
  uuid?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  published: boolean
  title: string
  content?: string | null
  kind?: PostKind | null
}

export type PostCreateManyWithoutAuthorInput = {
  create?: Enumerable<PostCreateWithoutAuthorInput> | null
  connect?: Enumerable<PostWhereUniqueInput> | null
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
  uuid?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  published?: boolean | null
  title?: string | null
  content?: string | null
  kind?: PostKind | null
}

export type PostUpdateWithWhereUniqueWithoutAuthorInput = {
  where: PostWhereUniqueInput
  data: PostUpdateWithoutAuthorDataInput
}

export type PostScalarWhereInput = {
  uuid?: string | UUIDFilter | null
  createdAt?: Date | string | DateTimeFilter | null
  updatedAt?: Date | string | DateTimeFilter | null
  published?: boolean | BooleanFilter | null
  title?: string | StringFilter | null
  content?: string | NullableStringFilter | null
  kind?: PostKind | NullablePostKindFilter | null
  AND?: Enumerable<PostScalarWhereInput> | null
  OR?: Enumerable<PostScalarWhereInput> | null
  NOT?: Enumerable<PostScalarWhereInput> | null
}

export type PostUpdateManyDataInput = {
  uuid?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  published?: boolean | null
  title?: string | null
  content?: string | null
  kind?: PostKind | null
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
  create?: Enumerable<PostCreateWithoutAuthorInput> | null
  connect?: Enumerable<PostWhereUniqueInput> | null
  set?: Enumerable<PostWhereUniqueInput> | null
  disconnect?: Enumerable<PostWhereUniqueInput> | null
  delete?: Enumerable<PostWhereUniqueInput> | null
  update?: Enumerable<PostUpdateWithWhereUniqueWithoutAuthorInput> | null
  updateMany?: Enumerable<PostUpdateManyWithWhereNestedInput> | null
  deleteMany?: Enumerable<PostScalarWhereInput> | null
  upsert?: Enumerable<PostUpsertWithWhereUniqueWithoutAuthorInput> | null
}

export type UserUpdateInput = {
  id?: number | null
  email?: string | null
  name?: string | null
  age?: number | null
  balance?: number | null
  amount?: number | null
  role?: Role | null
  posts?: PostUpdateManyWithoutAuthorInput | null
}

export type UserUpdateManyMutationInput = {
  id?: number | null
  email?: string | null
  name?: string | null
  age?: number | null
  balance?: number | null
  amount?: number | null
  role?: Role | null
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
  create?: UserCreateWithoutPostsInput | null
  connect?: UserWhereUniqueInput | null
}

export type PostCreateInput = {
  uuid?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  published: boolean
  title: string
  content?: string | null
  kind?: PostKind | null
  author: UserCreateOneWithoutPostsInput
}

export type UserUpdateWithoutPostsDataInput = {
  id?: number | null
  email?: string | null
  name?: string | null
  age?: number | null
  balance?: number | null
  amount?: number | null
  role?: Role | null
}

export type UserUpsertWithoutPostsInput = {
  update: UserUpdateWithoutPostsDataInput
  create: UserCreateWithoutPostsInput
}

export type UserUpdateOneRequiredWithoutPostsInput = {
  create?: UserCreateWithoutPostsInput | null
  connect?: UserWhereUniqueInput | null
  update?: UserUpdateWithoutPostsDataInput | null
  upsert?: UserUpsertWithoutPostsInput | null
}

export type PostUpdateInput = {
  uuid?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  published?: boolean | null
  title?: string | null
  content?: string | null
  kind?: PostKind | null
  author?: UserUpdateOneRequiredWithoutPostsInput | null
}

export type PostUpdateManyMutationInput = {
  uuid?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  published?: boolean | null
  title?: string | null
  content?: string | null
  kind?: PostKind | null
}

export type CategoryCreateInput = {
  name: string
  slug: string
  number: number
}

export type CategoryUpdateInput = {
  name?: string | null
  slug?: string | null
  number?: number | null
}

export type CategoryUpdateManyMutationInput = {
  name?: string | null
  slug?: string | null
  number?: number | null
}

export type PatientCreateInput = {
  firstName: string
  lastName: string
  email: string
}

export type PatientUpdateInput = {
  firstName?: string | null
  lastName?: string | null
  email?: string | null
}

export type PatientUpdateManyMutationInput = {
  firstName?: string | null
  lastName?: string | null
  email?: string | null
}

export type DirectorCreateWithoutMoviesInput = {
  firstName: string
  lastName: string
}

export type DirectorCreateOneWithoutMoviesInput = {
  create?: DirectorCreateWithoutMoviesInput | null
  connect?: DirectorWhereUniqueInput | null
}

export type MovieCreateInput = {
  title: string
  director: DirectorCreateOneWithoutMoviesInput
}

export type DirectorUpdateWithoutMoviesDataInput = {
  firstName?: string | null
  lastName?: string | null
}

export type DirectorUpsertWithoutMoviesInput = {
  update: DirectorUpdateWithoutMoviesDataInput
  create: DirectorCreateWithoutMoviesInput
}

export type DirectorUpdateOneRequiredWithoutMoviesInput = {
  create?: DirectorCreateWithoutMoviesInput | null
  connect?: DirectorWhereUniqueInput | null
  update?: DirectorUpdateWithoutMoviesDataInput | null
  upsert?: DirectorUpsertWithoutMoviesInput | null
}

export type MovieUpdateInput = {
  title?: string | null
  director?: DirectorUpdateOneRequiredWithoutMoviesInput | null
}

export type MovieUpdateManyMutationInput = {
  title?: string | null
}

export type MovieCreateWithoutDirectorInput = {
  title: string
}

export type MovieCreateManyWithoutDirectorInput = {
  create?: Enumerable<MovieCreateWithoutDirectorInput> | null
  connect?: Enumerable<MovieWhereUniqueInput> | null
}

export type DirectorCreateInput = {
  firstName: string
  lastName: string
  movies?: MovieCreateManyWithoutDirectorInput | null
}

export type MovieUpdateWithoutDirectorDataInput = {
  title?: string | null
}

export type MovieUpdateWithWhereUniqueWithoutDirectorInput = {
  where: MovieWhereUniqueInput
  data: MovieUpdateWithoutDirectorDataInput
}

export type MovieScalarWhereInput = {
  directorFirstName?: string | StringFilter | null
  directorLastName?: string | StringFilter | null
  title?: string | StringFilter | null
  AND?: Enumerable<MovieScalarWhereInput> | null
  OR?: Enumerable<MovieScalarWhereInput> | null
  NOT?: Enumerable<MovieScalarWhereInput> | null
}

export type MovieUpdateManyDataInput = {
  title?: string | null
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
  create?: Enumerable<MovieCreateWithoutDirectorInput> | null
  connect?: Enumerable<MovieWhereUniqueInput> | null
  set?: Enumerable<MovieWhereUniqueInput> | null
  disconnect?: Enumerable<MovieWhereUniqueInput> | null
  delete?: Enumerable<MovieWhereUniqueInput> | null
  update?: Enumerable<MovieUpdateWithWhereUniqueWithoutDirectorInput> | null
  updateMany?: Enumerable<MovieUpdateManyWithWhereNestedInput> | null
  deleteMany?: Enumerable<MovieScalarWhereInput> | null
  upsert?: Enumerable<MovieUpsertWithWhereUniqueWithoutDirectorInput> | null
}

export type DirectorUpdateInput = {
  firstName?: string | null
  lastName?: string | null
  movies?: MovieUpdateManyWithoutDirectorInput | null
}

export type DirectorUpdateManyMutationInput = {
  firstName?: string | null
  lastName?: string | null
}

export type UUIDFilter = {
  equals?: string | null
  not?: string | UUIDFilter | null
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

export type DateTimeFilter = {
  equals?: Date | string | null
  not?: Date | string | DateTimeFilter | null
  in?: Enumerable<Date | string> | null
  notIn?: Enumerable<Date | string> | null
  lt?: Date | string | null
  lte?: Date | string | null
  gt?: Date | string | null
  gte?: Date | string | null
}

export type BooleanFilter = {
  equals?: boolean | null
  not?: boolean | BooleanFilter | null
}

export type StringFilter = {
  equals?: string | null
  not?: string | StringFilter | null
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

export type NullablePostKindFilter = {
  equals?: PostKind | null
  not?: PostKind | null | NullablePostKindFilter
  in?: Enumerable<PostKind> | null
  notIn?: Enumerable<PostKind> | null
}

export type IntFilter = {
  equals?: number | null
  not?: number | IntFilter | null
  in?: Enumerable<number> | null
  notIn?: Enumerable<number> | null
  lt?: number | null
  lte?: number | null
  gt?: number | null
  gte?: number | null
}

export type FloatFilter = {
  equals?: number | null
  not?: number | FloatFilter | null
  in?: Enumerable<number> | null
  notIn?: Enumerable<number> | null
  lt?: number | null
  lte?: number | null
  gt?: number | null
  gte?: number | null
}

export type PostFilter = {
  every?: PostWhereInput | null
  some?: PostWhereInput | null
  none?: PostWhereInput | null
}

export type RoleFilter = {
  equals?: Role | null
  not?: Role | RoleFilter | null
  in?: Enumerable<Role> | null
  notIn?: Enumerable<Role> | null
}

export type MovieFilter = {
  every?: MovieWhereInput | null
  some?: MovieWhereInput | null
  none?: MovieWhereInput | null
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
  kind?: OrderByArg | null
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
