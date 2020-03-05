
Object.defineProperty(exports, "__esModule", { value: true });

const {
  DMMF,
  DMMFClass,
  deepGet,
  deepSet,
  makeDocument,
  Engine,
  debugLib,
  transformDocument,
  chalk,
  printStack,
  mergeBy,
  unpack,
  stripAnsi,
  parseDotenv,
  sqlTemplateTag,
  Dataloader,
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  lowerCase
} = require('./runtime')

/**
 * Query Engine version: latest
 */

const path = require('path')
const fs = require('fs')

const debug = debugLib('prisma-client')

exports.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
exports.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError;
exports.PrismaClientRustPanicError = PrismaClientRustPanicError;
exports.PrismaClientInitializationError = PrismaClientInitializationError;
exports.PrismaClientValidationError = PrismaClientValidationError;

class PrismaClientFetcher {
  constructor(prisma, enableDebug = false, hooks) {
    this.prisma = prisma;
    this.debug = enableDebug;
    this.hooks = hooks;
    this.dataloader = new Dataloader(async (requests) => {
      // TODO: More elaborate logic to only batch certain queries together
      // We should e.g. make sure, that findOne queries are batched together
      await this.prisma.connect();
      const queries = requests.map(r => String(r.document))
      debug('Requests:')
      debug(queries)
      const results = await this.prisma.engine.request(queries)
      debug('Results:')
      debug(results)
      return results
    })
  }
  async request({ document, dataPath = [], rootField, typeName, isList, callsite, collectTimestamps, clientMethod }) {
    if (this.hooks && this.hooks.beforeRequest) {
      const query = String(document);
      this.hooks.beforeRequest({ query, path: dataPath, rootField, typeName, document });
    }
    try {
      collectTimestamps && collectTimestamps.record("Pre-prismaClientConnect");
      collectTimestamps && collectTimestamps.record("Post-prismaClientConnect");
      collectTimestamps && collectTimestamps.record("Pre-engine_request");
      const result = await this.dataloader.request({ document });
      collectTimestamps && collectTimestamps.record("Post-engine_request");
      collectTimestamps && collectTimestamps.record("Pre-unpack");
      const unpackResult = this.unpack(document, result, dataPath, rootField, isList);
      collectTimestamps && collectTimestamps.record("Post-unpack");
      return unpackResult;
    } catch (e) {
      debug(e.stack);
      if (callsite) {
        const { stack } = printStack({
          callsite,
          originalMethod: clientMethod,
          onUs: e.isPanic
        });
        const message = stack + e.message;
        if (e.code) {
          throw new PrismaClientKnownRequestError(this.sanitizeMessage(message), e.code, e.meta);
        }
        if (e instanceof PrismaClientUnknownRequestError) {
          throw new PrismaClientUnknownRequestError(this.sanitizeMessage(message));
        } else if (e instanceof PrismaClientInitializationError) {
          throw new PrismaClientInitializationError(this.sanitizeMessage(message));
        } else if (e instanceof PrismaClientRustPanicError) {
          throw new PrismaClientRustPanicError(this.sanitizeMessage(message));
        }
      } else {
        if (e.code) {
          throw new PrismaClientKnownRequestError(this.sanitizeMessage(e.message), e.code, e.meta);
        }
        if (e.isPanic) {
          throw new PrismaClientRustPanicError(e.message);
        } else {
          if (e instanceof PrismaClientUnknownRequestError) {
            throw new PrismaClientUnknownRequestError(this.sanitizeMessage(message));
          } else if (e instanceof PrismaClientInitializationError) {
            throw new PrismaClientInitializationError(this.sanitizeMessage(message));
          } else if (e instanceof PrismaClientRustPanicError) {
            throw new PrismaClientRustPanicError(this.sanitizeMessage(message));
          }
        }
      }
    }
  }
  sanitizeMessage(message) {
    if (this.prisma.errorFormat && this.prisma.errorFormat !== 'pretty') {
      return stripAnsi(message);
    }
    return message;
  }
  unpack(document, data, path, rootField, isList) {
    if (data.data) {
      data = data.data
    }
    const getPath = [];
    if (rootField) {
      getPath.push(rootField);
    }
    getPath.push(...path.filter(p => p !== 'select' && p !== 'include'));
    return unpack({ document, data, path: getPath });
  }
}

class CollectTimestamps {
  constructor(startName) {
    this.records = [];
    this.start = undefined;
    this.additionalResults = {};
    this.start = { name: startName, value: process.hrtime() };
  }
  record(name) {
    this.records.push({ name, value: process.hrtime() });
  }
  elapsed(start, end) {
    const diff = [end[0] - start[0], end[1] - start[1]];
    const nanoseconds = (diff[0] * 1e9) + diff[1];
    const milliseconds = nanoseconds / 1e6;
    return milliseconds;
  }
  addResults(results) {
    Object.assign(this.additionalResults, results);
  }
  getResults() {
    const results = this.records.reduce((acc, record) => {
      const name = record.name.split('-')[1];
      if (acc[name]) {
        acc[name] = this.elapsed(acc[name], record.value);
      }
      else {
        acc[name] = record.value;
      }
      return acc;
    }, {});
    Object.assign(results, {
      total: this.elapsed(this.start.value, this.records[this.records.length - 1].value),
      ...this.additionalResults
    });
    return results;
  }
}


/**
 * Build tool annotations
 * In order to make `ncc` and `node-file-trace` happy.
**/

path.join(__dirname, 'runtime/query-engine-windows');

/**
 * Client
**/

// tested in getLogLevel.test.ts
function getLogLevel(log) {
    return log.reduce((acc, curr) => {
        const currentLevel = typeof curr === 'string' ? curr : curr.level;
        if (currentLevel === 'query') {
            return acc;
        }
        if (!acc) {
            return currentLevel;
        }
        if (curr === 'info' || acc === 'info') {
            // info always has precedence
            return 'info';
        }
        return currentLevel;
    }, undefined);
}
exports.getLogLevel = getLogLevel;

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
class PrismaClient {
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
  constructor(optionsArg) {
    const options = optionsArg || {}
    const internal = options.__internal || {}

    const useDebug = internal.debug === true
    if (useDebug) {
      debugLib.enable('prisma-client')
    }

    // datamodel = datamodel without datasources + printed datasources

    const predefinedDatasources = [
      {
        "name": "db",
        "url": 'file:' + path.resolve(__dirname, '..\\..\\..\\dev.db')
      }
    ]
    const inputDatasources = Object.entries(options.datasources || {}).map(([name, url]) => ({ name, url }))
    const datasources = mergeBy(predefinedDatasources, inputDatasources, source => source.name)

    const engineConfig = internal.engine || {}

    if (options.errorFormat) {
      this.errorFormat = options.errorFormat
    } else if (process.env.NODE_ENV === 'production') {
      this.errorFormat = 'minimal'
    } else if (process.env.NO_COLOR) {
      this.errorFormat = 'colorless'
    } else {
      this.errorFormat = 'pretty'
    }

    this.measurePerformance = internal.measurePerformance || false

    const envFile = this.readEnv()

    this.engineConfig = {
      cwd: engineConfig.cwd || path.resolve(__dirname, "..\\.."),
      debug: useDebug,
      datamodelPath: path.resolve(__dirname, 'schema.prisma'),
      prismaPath: engineConfig.binaryPath || undefined,
      datasources,
      generator: {"name":"client","provider":"prisma-client-js","output":"D:\\#Projekty\\typegraphql-prisma\\experiments\\prisma\\generated\\client","binaryTargets":["windows"],"config":{}},
      showColors: this.errorFormat === 'pretty',
      logLevel: options.log && getLogLevel(options.log),
      logQueries: options.log && Boolean(options.log.find(o => typeof o === 'string' ? o === 'query' : o.level === 'query')),
      env: envFile,
      flags: options.forceTransactions ? ['--always_force_transactions'] : []
    }

    debug({ engineConfig: this.engineConfig })

    this.engine = new Engine(this.engineConfig)

    this.dmmf = new DMMFClass(dmmf)

    this.fetcher = new PrismaClientFetcher(this, false, internal.hooks)

    if (options.log) {
      for (const log of options.log) {
        const level = typeof log === 'string' ? log : log.emit === 'stdout' ? log.level : null
        if (level) {
          this.on(level, event => {
            const colorMap = {
              query: 'blue',
              info: 'cyan',
              warn: 'yellow'
            }
            console.error(chalk[colorMap[level]](`prisma:${level}`.padEnd(13)) + (event.message || event.query))
          })
        }
      }
    }
  }

  /**
   * @private
   */
  readEnv() {
    const dotEnvPath = path.resolve(path.resolve(__dirname, "..\\.."), '.env')

    if (fs.existsSync(dotEnvPath)) {
      return parseDotenv(fs.readFileSync(dotEnvPath, 'utf-8'))
    }

    return {}
  }

  on(eventType, callback) {
    this.engine.on(eventType, event => {
      const fields = event.fields
      if (eventType === 'query') {
        callback({
          timestamp: event.timestamp,
          query: fields.query,
          params: fields.params,
          duration: fields.duration_ms,
          target: event.target
        })
      } else { // warn or info events
        callback({
          timestamp: event.timestamp,
          message: fields.message,
          target: event.target
        })
      }
    })
  }
  /**
   * Connect with the database
   */
  async connect() {
    if (this.disconnectionPromise) {
      debug('awaiting disconnection promise')
      await this.disconnectionPromise
    } else {
      debug('disconnection promise doesnt exist')
    }
    if (this.connectionPromise) {
      return this.connectionPromise
    }
    this.connectionPromise = this.engine.start()
    return this.connectionPromise
  }
  /**
   * @private
   */
  async runDisconnect() {
    debug('disconnectionPromise: stopping engine')
    await this.engine.stop()
    delete this.connectionPromise
    this.engine = new Engine(this.engineConfig)
    delete this.disconnectionPromise
  }
  /**
   * Disconnect from the database
   */
  async disconnect() {
    if (!this.disconnectionPromise) {
      this.disconnectionPromise = this.runDisconnect() 
    }
    return this.disconnectionPromise
  }
  /**
   * Makes a raw query
   */ 
  async raw(stringOrTemplateStringsArray, ...values) {
    let query = ''
    let parameters = undefined

    if (Array.isArray(stringOrTemplateStringsArray)) {
      // Called with prisma.raw``
      const queryInstance = sqlTemplateTag.sqltag(stringOrTemplateStringsArray, ...values)
      query = queryInstance.sql
      parameters = JSON.stringify(queryInstance.values)
    } else {
      // Called with prisma.raw(string)
      query = stringOrTemplateStringsArray 
    }

    const document = makeDocument({
      dmmf: this.dmmf,
      rootField: "executeRaw",
      rootTypeName: 'mutation',
      select: {
        query,
        parameters
      }
    })

    document.validate({ query, parameters }, false, 'raw', this.errorFormat)
    
    return this.fetcher.request({ document, rootField: 'executeRaw', typeName: 'raw', isList: false })
  }

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   */
  get user() {
    return UserDelegate(this.dmmf, this.fetcher, this.errorFormat, this.measurePerformance)
  }
  /**
   * `prisma.post`: Exposes CRUD operations for the **Post** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Posts
   * const posts = await prisma.post.findMany()
   * ```
   */
  get post() {
    return PostDelegate(this.dmmf, this.fetcher, this.errorFormat, this.measurePerformance)
  }
}
exports.PrismaClient = PrismaClient



/**
 * Enums
 */
// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275
function makeEnum(x) { return x; }

exports.OrderByArg = makeEnum({
  asc: 'asc',
  desc: 'desc'
});

exports.Role = makeEnum({
  USER: 'USER',
  ADMIN: 'ADMIN'
});

exports.PostKind = makeEnum({
  BLOG: 'BLOG',
  ADVERT: 'ADVERT'
});


function UserDelegate(dmmf, fetcher, errorFormat, measurePerformance) {
  const User = {} 
  User.findOne = (args) => args && args.select ? new UserClient(
    dmmf,
    fetcher,
    'query',
    'findOneUser',
    'users.findOne',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new UserClient(
    dmmf,
    fetcher,
    'query',
    'findOneUser',
    'users.findOne',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  User.findMany = (args) => new UserClient(
    dmmf,
    fetcher,
    'query',
    'findManyUser',
    'users.findMany',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  User.create = (args) => args && args.select ? new UserClient(
    dmmf,
    fetcher,
    'mutation',
    'createOneUser',
    'users.create',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new UserClient(
    dmmf,
    fetcher,
    'mutation',
    'createOneUser',
    'users.create',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  User.delete = (args) => args && args.select ? new UserClient(
    dmmf,
    fetcher,
    'mutation',
    'deleteOneUser',
    'users.delete',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new UserClient(
    dmmf,
    fetcher,
    'mutation',
    'deleteOneUser',
    'users.delete',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  User.update = (args) => args && args.select ? new UserClient(
    dmmf,
    fetcher,
    'mutation',
    'updateOneUser',
    'users.update',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new UserClient(
    dmmf,
    fetcher,
    'mutation',
    'updateOneUser',
    'users.update',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  User.deleteMany = (args) => new UserClient(
    dmmf,
    fetcher,
    'mutation',
    'deleteManyUser',
    'users.deleteMany',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  User.updateMany = (args) => new UserClient(
    dmmf,
    fetcher,
    'mutation',
    'updateManyUser',
    'users.updateMany',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  User.upsert = (args) => args && args.select ? new UserClient(
    dmmf,
    fetcher,
    'mutation',
    'upsertOneUser',
    'users.upsert',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new UserClient(
    dmmf,
    fetcher,
    'mutation',
    'upsertOneUser',
    'users.upsert',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  User.count = () => new UserClient(dmmf, fetcher, 'query', 'aggregateUser', 'users.count', {}, ['count'], errorFormat)
  return User
}

class UserClient {
  constructor(_dmmf, _fetcher, _queryType, _rootField, _clientMethod, _args, _dataPath, _errorFormat, _measurePerformance, _isList) {
    this._dmmf = _dmmf;
    this._fetcher = _fetcher;
    this._queryType = _queryType;
    this._rootField = _rootField;
    this._clientMethod = _clientMethod;
    this._args = _args;
    this._dataPath = _dataPath;
    this._errorFormat = _errorFormat;
    this._measurePerformance = _measurePerformance;
    this._isList = _isList;
    if (this._measurePerformance) {
      // Timestamps for performance checks
      this._collectTimestamps = new CollectTimestamps("PrismaClient");
    }
    // @ts-ignore
    if (process.env.NODE_ENV !== 'production' && this._errorFormat !== 'minimal') {
      const error = new Error();
      if (error && error.stack) {
        const stack = error.stack;
        this._callsite = stack;
      }
    }
  }

  posts(args) {
    const prefix = this._dataPath.includes('select') ? 'select' : this._dataPath.includes('include') ? 'include' : 'select'
    const dataPath = [...this._dataPath, prefix, 'posts']
    const newArgs = deepSet(this._args, dataPath, args || true)
    this._isList = true
    return new PostClient(this._dmmf, this._fetcher, this._queryType, this._rootField, this._clientMethod, newArgs, dataPath, this._errorFormat, this._measurePerformance, this._isList)
  }

  get _document() {
    const { _rootField: rootField } = this
    this._collectTimestamps && this._collectTimestamps.record("Pre-makeDocument")
    const document = makeDocument({
      dmmf: this._dmmf,
      rootField,
      rootTypeName: this._queryType,
      select: this._args
    })
    this._collectTimestamps && this._collectTimestamps.record("Post-makeDocument")
    try {
      this._collectTimestamps && this._collectTimestamps.record("Pre-document.validate")
      document.validate(this._args, false, this._clientMethod, this._errorFormat)
      this._collectTimestamps && this._collectTimestamps.record("Post-document.validate")
    } catch (e) {
      const x = e
      if (this._errorFormat !== 'minimal' && x.render) {
        if (this._callsite) {
          e.message = x.render(this._callsite)
        }
      }
      throw e
    }
    this._collectTimestamps && this._collectTimestamps.record("Pre-transformDocument")
    const transformedDocument = transformDocument(document)
    this._collectTimestamps && this._collectTimestamps.record("Post-transformDocument")
    return transformedDocument
  }

  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then(onfulfilled, onrejected) {
    if (!this._requestPromise){
      this._requestPromise = this._fetcher.request({
        document: this._document,
        dataPath: this._dataPath,
        rootField: this._rootField,
        typeName: 'User',
        isList: this._isList,
        callsite: this._callsite,
        collectTimestamps: this._collectTimestamps,
        clientMethod: this._clientMethod
      })
    }
    return this._requestPromise.then(onfulfilled, onrejected)
  }

  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch(onrejected) {
    if (!this._requestPromise) {
      this._requestPromise = this._fetcher.request({
        document: this._document,
        dataPath: this._dataPath,
        rootField: this._rootField,
        typeName: 'User',
        isList: this._isList,
        callsite: this._callsite,
        collectTimestamps: this._collectTimestamps,
        clientMethod: this._clientMethod
      })
    }
    return this._requestPromise.catch(onrejected)
  }

  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally) {
    if (!this._requestPromise) {
      this._requestPromise = this._fetcher.request({
        document: this._document,
        dataPath: this._dataPath,
        rootField: this._rootField,
        typeName: 'User',
        isList: this._isList,
        callsite: this._callsite,
        collectTimestamps: this._collectTimestamps,
        clientMethod: this._clientMethod
      })
    }
    return this._requestPromise.finally(onfinally)
  }
}

exports.UserClient = UserClient

function PostDelegate(dmmf, fetcher, errorFormat, measurePerformance) {
  const Post = {} 
  Post.findOne = (args) => args && args.select ? new PostClient(
    dmmf,
    fetcher,
    'query',
    'findOnePost',
    'posts.findOne',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new PostClient(
    dmmf,
    fetcher,
    'query',
    'findOnePost',
    'posts.findOne',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Post.findMany = (args) => new PostClient(
    dmmf,
    fetcher,
    'query',
    'findManyPost',
    'posts.findMany',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Post.create = (args) => args && args.select ? new PostClient(
    dmmf,
    fetcher,
    'mutation',
    'createOnePost',
    'posts.create',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new PostClient(
    dmmf,
    fetcher,
    'mutation',
    'createOnePost',
    'posts.create',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Post.delete = (args) => args && args.select ? new PostClient(
    dmmf,
    fetcher,
    'mutation',
    'deleteOnePost',
    'posts.delete',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new PostClient(
    dmmf,
    fetcher,
    'mutation',
    'deleteOnePost',
    'posts.delete',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Post.update = (args) => args && args.select ? new PostClient(
    dmmf,
    fetcher,
    'mutation',
    'updateOnePost',
    'posts.update',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new PostClient(
    dmmf,
    fetcher,
    'mutation',
    'updateOnePost',
    'posts.update',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Post.deleteMany = (args) => new PostClient(
    dmmf,
    fetcher,
    'mutation',
    'deleteManyPost',
    'posts.deleteMany',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Post.updateMany = (args) => new PostClient(
    dmmf,
    fetcher,
    'mutation',
    'updateManyPost',
    'posts.updateMany',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Post.upsert = (args) => args && args.select ? new PostClient(
    dmmf,
    fetcher,
    'mutation',
    'upsertOnePost',
    'posts.upsert',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new PostClient(
    dmmf,
    fetcher,
    'mutation',
    'upsertOnePost',
    'posts.upsert',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Post.count = () => new PostClient(dmmf, fetcher, 'query', 'aggregatePost', 'posts.count', {}, ['count'], errorFormat)
  return Post
}

class PostClient {
  constructor(_dmmf, _fetcher, _queryType, _rootField, _clientMethod, _args, _dataPath, _errorFormat, _measurePerformance, _isList) {
    this._dmmf = _dmmf;
    this._fetcher = _fetcher;
    this._queryType = _queryType;
    this._rootField = _rootField;
    this._clientMethod = _clientMethod;
    this._args = _args;
    this._dataPath = _dataPath;
    this._errorFormat = _errorFormat;
    this._measurePerformance = _measurePerformance;
    this._isList = _isList;
    if (this._measurePerformance) {
      // Timestamps for performance checks
      this._collectTimestamps = new CollectTimestamps("PrismaClient");
    }
    // @ts-ignore
    if (process.env.NODE_ENV !== 'production' && this._errorFormat !== 'minimal') {
      const error = new Error();
      if (error && error.stack) {
        const stack = error.stack;
        this._callsite = stack;
      }
    }
  }

  author(args) {
    const prefix = this._dataPath.includes('select') ? 'select' : this._dataPath.includes('include') ? 'include' : 'select'
    const dataPath = [...this._dataPath, prefix, 'author']
    const newArgs = deepSet(this._args, dataPath, args || true)
    this._isList = false
    return new UserClient(this._dmmf, this._fetcher, this._queryType, this._rootField, this._clientMethod, newArgs, dataPath, this._errorFormat, this._measurePerformance, this._isList)
  }

  get _document() {
    const { _rootField: rootField } = this
    this._collectTimestamps && this._collectTimestamps.record("Pre-makeDocument")
    const document = makeDocument({
      dmmf: this._dmmf,
      rootField,
      rootTypeName: this._queryType,
      select: this._args
    })
    this._collectTimestamps && this._collectTimestamps.record("Post-makeDocument")
    try {
      this._collectTimestamps && this._collectTimestamps.record("Pre-document.validate")
      document.validate(this._args, false, this._clientMethod, this._errorFormat)
      this._collectTimestamps && this._collectTimestamps.record("Post-document.validate")
    } catch (e) {
      const x = e
      if (this._errorFormat !== 'minimal' && x.render) {
        if (this._callsite) {
          e.message = x.render(this._callsite)
        }
      }
      throw e
    }
    this._collectTimestamps && this._collectTimestamps.record("Pre-transformDocument")
    const transformedDocument = transformDocument(document)
    this._collectTimestamps && this._collectTimestamps.record("Post-transformDocument")
    return transformedDocument
  }

  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then(onfulfilled, onrejected) {
    if (!this._requestPromise){
      this._requestPromise = this._fetcher.request({
        document: this._document,
        dataPath: this._dataPath,
        rootField: this._rootField,
        typeName: 'Post',
        isList: this._isList,
        callsite: this._callsite,
        collectTimestamps: this._collectTimestamps,
        clientMethod: this._clientMethod
      })
    }
    return this._requestPromise.then(onfulfilled, onrejected)
  }

  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch(onrejected) {
    if (!this._requestPromise) {
      this._requestPromise = this._fetcher.request({
        document: this._document,
        dataPath: this._dataPath,
        rootField: this._rootField,
        typeName: 'Post',
        isList: this._isList,
        callsite: this._callsite,
        collectTimestamps: this._collectTimestamps,
        clientMethod: this._clientMethod
      })
    }
    return this._requestPromise.catch(onrejected)
  }

  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally) {
    if (!this._requestPromise) {
      this._requestPromise = this._fetcher.request({
        document: this._document,
        dataPath: this._dataPath,
        rootField: this._rootField,
        typeName: 'Post',
        isList: this._isList,
        callsite: this._callsite,
        collectTimestamps: this._collectTimestamps,
        clientMethod: this._clientMethod
      })
    }
    return this._requestPromise.finally(onfinally)
  }
}

exports.PostClient = PostClient


/**
 * DMMF
 */
const dmmfString = '{"datamodel":{"enums":[{"name":"Role","values":["USER","ADMIN"],"dbName":null,"documentation":"Role enum comment\\r"},{"name":"PostKind","values":["BLOG","ADVERT"],"dbName":null}],"models":[{"name":"User","isEmbedded":false,"dbName":null,"fields":[{"name":"id","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":true,"type":"Int","default":{"name":"autoincrement","returnType":"Int","args":[]},"isGenerated":false,"isUpdatedAt":false,"documentation":"User model field comment\\r"},{"name":"email","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":true,"isId":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","dbNames":[],"isList":false,"isRequired":false,"isUnique":false,"isId":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"age","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"balance","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"type":"Float","isGenerated":false,"isUpdatedAt":false},{"name":"amount","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"type":"Float","isGenerated":false,"isUpdatedAt":false},{"name":"posts","kind":"object","dbNames":[],"isList":true,"isRequired":false,"isUnique":false,"isId":false,"type":"Post","relationName":"PostToUser","relationToFields":[],"relationOnDelete":"NONE","isGenerated":false,"isUpdatedAt":false},{"name":"role","kind":"enum","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"type":"Role","isGenerated":false,"isUpdatedAt":false}],"isGenerated":false,"documentation":"User model comment\\r","idFields":[],"uniqueFields":[]},{"name":"Post","isEmbedded":false,"dbName":null,"fields":[{"name":"uuid","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":true,"type":"String","default":{"name":"cuid","returnType":"String","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"type":"DateTime","default":{"name":"now","returnType":"DateTime","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"published","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"type":"Boolean","isGenerated":false,"isUpdatedAt":false},{"name":"title","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"content","kind":"scalar","dbNames":[],"isList":false,"isRequired":false,"isUnique":false,"isId":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"author","kind":"object","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"type":"User","relationName":"PostToUser","relationToFields":["id"],"relationOnDelete":"NONE","isGenerated":false,"isUpdatedAt":false},{"name":"kind","kind":"enum","dbNames":[],"isList":false,"isRequired":false,"isUnique":false,"isId":false,"type":"PostKind","isGenerated":false,"isUpdatedAt":false}],"isGenerated":false,"idFields":[],"uniqueFields":[]}]},"mappings":[{"model":"User","plural":"users","findOne":"findOneUser","findMany":"findManyUser","create":"createOneUser","delete":"deleteOneUser","update":"updateOneUser","deleteMany":"deleteManyUser","updateMany":"updateManyUser","upsert":"upsertOneUser","aggregate":"aggregateUser"},{"model":"Post","plural":"posts","findOne":"findOnePost","findMany":"findManyPost","create":"createOnePost","delete":"deleteOnePost","update":"updateOnePost","deleteMany":"deleteManyPost","updateMany":"updateManyPost","upsert":"upsertOnePost","aggregate":"aggregatePost"}],"schema":{"enums":[{"name":"OrderByArg","values":["asc","desc"]},{"name":"Role","values":["USER","ADMIN"]},{"name":"PostKind","values":["BLOG","ADVERT"]}],"outputTypes":[{"name":"Post","fields":[{"name":"uuid","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}},{"name":"createdAt","args":[],"outputType":{"type":"DateTime","kind":"scalar","isRequired":true,"isList":false}},{"name":"updatedAt","args":[],"outputType":{"type":"DateTime","kind":"scalar","isRequired":true,"isList":false}},{"name":"published","args":[],"outputType":{"type":"Boolean","kind":"scalar","isRequired":true,"isList":false}},{"name":"title","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}},{"name":"content","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":false,"isList":false}},{"name":"author","args":[],"outputType":{"type":"User","kind":"object","isRequired":true,"isList":false}},{"name":"kind","args":[],"outputType":{"type":"PostKind","kind":"enum","isRequired":false,"isList":false}}]},{"name":"User","fields":[{"name":"id","args":[],"outputType":{"type":"Int","kind":"scalar","isRequired":true,"isList":false}},{"name":"email","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}},{"name":"name","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":false,"isList":false}},{"name":"age","args":[],"outputType":{"type":"Int","kind":"scalar","isRequired":true,"isList":false}},{"name":"balance","args":[],"outputType":{"type":"Float","kind":"scalar","isRequired":true,"isList":false}},{"name":"amount","args":[],"outputType":{"type":"Float","kind":"scalar","isRequired":true,"isList":false}},{"name":"posts","args":[{"name":"where","inputType":[{"type":"PostWhereInput","kind":"object","isRequired":false,"isList":false}]},{"name":"orderBy","inputType":[{"isList":false,"isRequired":false,"type":"PostOrderByInput","kind":"object"}]},{"name":"skip","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"after","inputType":[{"type":"PostWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"before","inputType":[{"type":"PostWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"first","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"last","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]}],"outputType":{"type":"Post","kind":"object","isRequired":false,"isList":true}},{"name":"role","args":[],"outputType":{"type":"Role","kind":"enum","isRequired":true,"isList":false}}]},{"name":"AggregateUser","fields":[{"name":"count","args":[],"outputType":{"type":"Int","kind":"scalar","isRequired":true,"isList":false}}]},{"name":"AggregatePost","fields":[{"name":"count","args":[],"outputType":{"type":"Int","kind":"scalar","isRequired":true,"isList":false}}]},{"name":"Query","fields":[{"name":"findManyUser","args":[{"name":"where","inputType":[{"type":"UserWhereInput","kind":"object","isRequired":false,"isList":false}]},{"name":"orderBy","inputType":[{"isList":false,"isRequired":false,"type":"UserOrderByInput","kind":"object"}]},{"name":"skip","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"after","inputType":[{"type":"UserWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"before","inputType":[{"type":"UserWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"first","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"last","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]}],"outputType":{"type":"User","kind":"object","isRequired":true,"isList":true}},{"name":"aggregateUser","args":[],"outputType":{"type":"AggregateUser","kind":"object","isRequired":true,"isList":false}},{"name":"findOneUser","args":[{"name":"where","inputType":[{"type":"UserWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"User","kind":"object","isRequired":false,"isList":false}},{"name":"findManyPost","args":[{"name":"where","inputType":[{"type":"PostWhereInput","kind":"object","isRequired":false,"isList":false}]},{"name":"orderBy","inputType":[{"isList":false,"isRequired":false,"type":"PostOrderByInput","kind":"object"}]},{"name":"skip","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"after","inputType":[{"type":"PostWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"before","inputType":[{"type":"PostWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"first","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"last","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]}],"outputType":{"type":"Post","kind":"object","isRequired":true,"isList":true}},{"name":"aggregatePost","args":[],"outputType":{"type":"AggregatePost","kind":"object","isRequired":true,"isList":false}},{"name":"findOnePost","args":[{"name":"where","inputType":[{"type":"PostWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"Post","kind":"object","isRequired":false,"isList":false}}]},{"name":"BatchPayload","fields":[{"name":"count","args":[],"outputType":{"type":"Int","kind":"scalar","isRequired":true,"isList":false}}]},{"name":"Mutation","fields":[{"name":"createOneUser","args":[{"name":"data","inputType":[{"type":"UserCreateInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"User","kind":"object","isRequired":true,"isList":false}},{"name":"deleteOneUser","args":[{"name":"where","inputType":[{"type":"UserWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"User","kind":"object","isRequired":false,"isList":false}},{"name":"updateOneUser","args":[{"name":"data","inputType":[{"type":"UserUpdateInput","kind":"object","isRequired":true,"isList":false}]},{"name":"where","inputType":[{"type":"UserWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"User","kind":"object","isRequired":false,"isList":false}},{"name":"upsertOneUser","args":[{"name":"where","inputType":[{"type":"UserWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]},{"name":"create","inputType":[{"type":"UserCreateInput","kind":"object","isRequired":true,"isList":false}]},{"name":"update","inputType":[{"type":"UserUpdateInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"User","kind":"object","isRequired":true,"isList":false}},{"name":"updateManyUser","args":[{"name":"data","inputType":[{"type":"UserUpdateManyMutationInput","kind":"object","isRequired":true,"isList":false}]},{"name":"where","inputType":[{"type":"UserWhereInput","kind":"object","isRequired":false,"isList":false}]}],"outputType":{"type":"BatchPayload","kind":"object","isRequired":true,"isList":false}},{"name":"deleteManyUser","args":[{"name":"where","inputType":[{"type":"UserWhereInput","kind":"object","isRequired":false,"isList":false}]}],"outputType":{"type":"BatchPayload","kind":"object","isRequired":true,"isList":false}},{"name":"createOnePost","args":[{"name":"data","inputType":[{"type":"PostCreateInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"Post","kind":"object","isRequired":true,"isList":false}},{"name":"deleteOnePost","args":[{"name":"where","inputType":[{"type":"PostWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"Post","kind":"object","isRequired":false,"isList":false}},{"name":"updateOnePost","args":[{"name":"data","inputType":[{"type":"PostUpdateInput","kind":"object","isRequired":true,"isList":false}]},{"name":"where","inputType":[{"type":"PostWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"Post","kind":"object","isRequired":false,"isList":false}},{"name":"upsertOnePost","args":[{"name":"where","inputType":[{"type":"PostWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]},{"name":"create","inputType":[{"type":"PostCreateInput","kind":"object","isRequired":true,"isList":false}]},{"name":"update","inputType":[{"type":"PostUpdateInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"Post","kind":"object","isRequired":true,"isList":false}},{"name":"updateManyPost","args":[{"name":"data","inputType":[{"type":"PostUpdateManyMutationInput","kind":"object","isRequired":true,"isList":false}]},{"name":"where","inputType":[{"type":"PostWhereInput","kind":"object","isRequired":false,"isList":false}]}],"outputType":{"type":"BatchPayload","kind":"object","isRequired":true,"isList":false}},{"name":"deleteManyPost","args":[{"name":"where","inputType":[{"type":"PostWhereInput","kind":"object","isRequired":false,"isList":false}]}],"outputType":{"type":"BatchPayload","kind":"object","isRequired":true,"isList":false}},{"name":"executeRaw","args":[{"name":"query","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"parameters","inputType":[{"type":"Json","kind":"scalar","isRequired":false,"isList":false}]}],"outputType":{"type":"Json","kind":"scalar","isRequired":true,"isList":false}}]}],"inputTypes":[{"name":"PostWhereInput","fields":[{"name":"uuid","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"createdAt","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"},{"type":"DateTimeFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"updatedAt","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"},{"type":"DateTimeFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"published","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Boolean"},{"type":"BooleanFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"title","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"content","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"NullableStringFilter","isList":false,"isRequired":false,"kind":"object"},{"type":"null","isList":false,"isRequired":false,"kind":"scalar"}],"isRelationFilter":false},{"name":"kind","inputType":[{"isList":false,"isRequired":false,"kind":"enum","type":"PostKind"},{"type":"NullablePostKindFilter","isList":false,"isRequired":false,"kind":"object"},{"type":"null","isList":false,"isRequired":false,"kind":"scalar"}],"isRelationFilter":false},{"name":"AND","inputType":[{"type":"PostWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"OR","inputType":[{"type":"PostWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"NOT","inputType":[{"type":"PostWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"author","inputType":[{"type":"UserWhereInput","kind":"object","isRequired":false,"isList":false}],"isRelationFilter":true}],"isWhereType":true,"atLeastOne":false},{"name":"UserWhereInput","fields":[{"name":"id","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Int"},{"type":"IntFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"email","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"name","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"NullableStringFilter","isList":false,"isRequired":false,"kind":"object"},{"type":"null","isList":false,"isRequired":false,"kind":"scalar"}],"isRelationFilter":false},{"name":"age","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Int"},{"type":"IntFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"balance","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"},{"type":"FloatFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"amount","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"},{"type":"FloatFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"posts","inputType":[{"type":"PostFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false,"nullEqualsUndefined":true},{"name":"role","inputType":[{"isList":false,"isRequired":false,"kind":"enum","type":"Role"},{"type":"RoleFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"AND","inputType":[{"type":"UserWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"OR","inputType":[{"type":"UserWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"NOT","inputType":[{"type":"UserWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true}],"isWhereType":true,"atLeastOne":false},{"name":"IdCompoundUniqueInput","fields":[{"name":"id","inputType":[{"type":"Int","kind":"scalar","isRequired":true,"isList":false}]}]},{"name":"UserWhereUniqueInput","fields":[{"name":"id","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"email","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]}],"atLeastOne":true},{"name":"UuidCompoundUniqueInput","fields":[{"name":"uuid","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]}]},{"name":"PostWhereUniqueInput","fields":[{"name":"uuid","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]}],"atLeastOne":true},{"name":"PostCreateWithoutAuthorInput","fields":[{"name":"uuid","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"published","inputType":[{"type":"Boolean","kind":"scalar","isRequired":true,"isList":false}]},{"name":"title","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"content","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"kind","inputType":[{"type":"PostKind","kind":"enum","isRequired":false,"isList":false}]}]},{"name":"PostCreateManyWithoutAuthorInput","fields":[{"name":"create","inputType":[{"type":"PostCreateWithoutAuthorInput","kind":"object","isRequired":false,"isList":true}]},{"name":"connect","inputType":[{"type":"PostWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]}]},{"name":"UserCreateInput","fields":[{"name":"email","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"age","inputType":[{"type":"Int","kind":"scalar","isRequired":true,"isList":false}]},{"name":"balance","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"amount","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"role","inputType":[{"type":"Role","kind":"enum","isRequired":true,"isList":false}]},{"name":"posts","inputType":[{"type":"PostCreateManyWithoutAuthorInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"PostUpdateWithoutAuthorDataInput","fields":[{"name":"uuid","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"published","inputType":[{"type":"Boolean","kind":"scalar","isRequired":false,"isList":false}]},{"name":"title","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"content","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"kind","inputType":[{"type":"PostKind","kind":"enum","isRequired":false,"isList":false}]}]},{"name":"PostUpdateWithWhereUniqueWithoutAuthorInput","fields":[{"name":"where","inputType":[{"type":"PostWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]},{"name":"data","inputType":[{"type":"PostUpdateWithoutAuthorDataInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"PostScalarWhereInput","fields":[{"name":"uuid","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"createdAt","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"},{"type":"DateTimeFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"updatedAt","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"},{"type":"DateTimeFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"published","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Boolean"},{"type":"BooleanFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"title","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"content","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"NullableStringFilter","isList":false,"isRequired":false,"kind":"object"},{"type":"null","isList":false,"isRequired":false,"kind":"scalar"}],"isRelationFilter":false},{"name":"kind","inputType":[{"isList":false,"isRequired":false,"kind":"enum","type":"PostKind"},{"type":"NullablePostKindFilter","isList":false,"isRequired":false,"kind":"object"},{"type":"null","isList":false,"isRequired":false,"kind":"scalar"}],"isRelationFilter":false},{"name":"AND","inputType":[{"type":"PostScalarWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"OR","inputType":[{"type":"PostScalarWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"NOT","inputType":[{"type":"PostScalarWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true}],"isWhereType":true,"atLeastOne":false},{"name":"PostUpdateManyDataInput","fields":[{"name":"uuid","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"published","inputType":[{"type":"Boolean","kind":"scalar","isRequired":false,"isList":false}]},{"name":"title","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"content","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"kind","inputType":[{"type":"PostKind","kind":"enum","isRequired":false,"isList":false}]}]},{"name":"PostUpdateManyWithWhereNestedInput","fields":[{"name":"where","inputType":[{"type":"PostScalarWhereInput","kind":"object","isRequired":true,"isList":false}]},{"name":"data","inputType":[{"type":"PostUpdateManyDataInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"PostUpsertWithWhereUniqueWithoutAuthorInput","fields":[{"name":"where","inputType":[{"type":"PostWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]},{"name":"update","inputType":[{"type":"PostUpdateWithoutAuthorDataInput","kind":"object","isRequired":true,"isList":false}]},{"name":"create","inputType":[{"type":"PostCreateWithoutAuthorInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"PostUpdateManyWithoutAuthorInput","fields":[{"name":"create","inputType":[{"type":"PostCreateWithoutAuthorInput","kind":"object","isRequired":false,"isList":true}]},{"name":"connect","inputType":[{"type":"PostWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"set","inputType":[{"type":"PostWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"disconnect","inputType":[{"type":"PostWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"delete","inputType":[{"type":"PostWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"update","inputType":[{"type":"PostUpdateWithWhereUniqueWithoutAuthorInput","kind":"object","isRequired":false,"isList":true}]},{"name":"updateMany","inputType":[{"type":"PostUpdateManyWithWhereNestedInput","kind":"object","isRequired":false,"isList":true}]},{"name":"deleteMany","inputType":[{"type":"PostScalarWhereInput","kind":"object","isRequired":false,"isList":true}]},{"name":"upsert","inputType":[{"type":"PostUpsertWithWhereUniqueWithoutAuthorInput","kind":"object","isRequired":false,"isList":true}]}]},{"name":"UserUpdateInput","fields":[{"name":"id","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"email","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"age","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"balance","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"amount","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"role","inputType":[{"type":"Role","kind":"enum","isRequired":false,"isList":false}]},{"name":"posts","inputType":[{"type":"PostUpdateManyWithoutAuthorInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"UserUpdateManyMutationInput","fields":[{"name":"id","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"email","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"age","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"balance","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"amount","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"role","inputType":[{"type":"Role","kind":"enum","isRequired":false,"isList":false}]}]},{"name":"UserCreateWithoutPostsInput","fields":[{"name":"email","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"age","inputType":[{"type":"Int","kind":"scalar","isRequired":true,"isList":false}]},{"name":"balance","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"amount","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"role","inputType":[{"type":"Role","kind":"enum","isRequired":true,"isList":false}]}]},{"name":"UserCreateOneWithoutPostsInput","fields":[{"name":"create","inputType":[{"type":"UserCreateWithoutPostsInput","kind":"object","isRequired":false,"isList":false}]},{"name":"connect","inputType":[{"type":"UserWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"PostCreateInput","fields":[{"name":"uuid","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"published","inputType":[{"type":"Boolean","kind":"scalar","isRequired":true,"isList":false}]},{"name":"title","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"content","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"kind","inputType":[{"type":"PostKind","kind":"enum","isRequired":false,"isList":false}]},{"name":"author","inputType":[{"type":"UserCreateOneWithoutPostsInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"UserUpdateWithoutPostsDataInput","fields":[{"name":"id","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"email","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"age","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"balance","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"amount","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"role","inputType":[{"type":"Role","kind":"enum","isRequired":false,"isList":false}]}]},{"name":"UserUpsertWithoutPostsInput","fields":[{"name":"update","inputType":[{"type":"UserUpdateWithoutPostsDataInput","kind":"object","isRequired":true,"isList":false}]},{"name":"create","inputType":[{"type":"UserCreateWithoutPostsInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"UserUpdateOneRequiredWithoutPostsInput","fields":[{"name":"create","inputType":[{"type":"UserCreateWithoutPostsInput","kind":"object","isRequired":false,"isList":false}]},{"name":"connect","inputType":[{"type":"UserWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"update","inputType":[{"type":"UserUpdateWithoutPostsDataInput","kind":"object","isRequired":false,"isList":false}]},{"name":"upsert","inputType":[{"type":"UserUpsertWithoutPostsInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"PostUpdateInput","fields":[{"name":"uuid","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"published","inputType":[{"type":"Boolean","kind":"scalar","isRequired":false,"isList":false}]},{"name":"title","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"content","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"kind","inputType":[{"type":"PostKind","kind":"enum","isRequired":false,"isList":false}]},{"name":"author","inputType":[{"type":"UserUpdateOneRequiredWithoutPostsInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"PostUpdateManyMutationInput","fields":[{"name":"uuid","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"published","inputType":[{"type":"Boolean","kind":"scalar","isRequired":false,"isList":false}]},{"name":"title","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"content","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"kind","inputType":[{"type":"PostKind","kind":"enum","isRequired":false,"isList":false}]}]},{"name":"StringFilter","fields":[{"name":"equals","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"}]},{"name":"not","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"isList":false,"isRequired":false,"kind":"scalar","type":"StringFilter"}]},{"name":"in","isRelationFilter":false,"inputType":[{"isList":true,"isRequired":false,"kind":"scalar","type":"String"}]},{"name":"notIn","isRelationFilter":false,"inputType":[{"isList":true,"isRequired":false,"kind":"scalar","type":"String"}]},{"name":"lt","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"}]},{"name":"lte","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"}]},{"name":"gt","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"}]},{"name":"gte","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"}]},{"name":"contains","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"}]},{"name":"startsWith","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"}]},{"name":"endsWith","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"}]}],"atLeastOne":false},{"name":"DateTimeFilter","fields":[{"name":"equals","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"}]},{"name":"not","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"},{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTimeFilter"}]},{"name":"in","isRelationFilter":false,"inputType":[{"isList":true,"isRequired":false,"kind":"scalar","type":"DateTime"}]},{"name":"notIn","isRelationFilter":false,"inputType":[{"isList":true,"isRequired":false,"kind":"scalar","type":"DateTime"}]},{"name":"lt","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"}]},{"name":"lte","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"}]},{"name":"gt","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"}]},{"name":"gte","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"}]}],"atLeastOne":false},{"name":"BooleanFilter","fields":[{"name":"equals","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Boolean"}]},{"name":"not","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Boolean"},{"isList":false,"isRequired":false,"kind":"scalar","type":"BooleanFilter"}]}],"atLeastOne":false},{"name":"NullableStringFilter","fields":[{"name":"equals","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"isList":false,"isRequired":false,"kind":"scalar","type":"null"}]},{"name":"not","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"isList":false,"isRequired":false,"kind":"scalar","type":"null"},{"isList":false,"isRequired":false,"kind":"scalar","type":"NullableStringFilter"}]},{"name":"in","isRelationFilter":false,"inputType":[{"isList":true,"isRequired":false,"kind":"scalar","type":"String"}]},{"name":"notIn","isRelationFilter":false,"inputType":[{"isList":true,"isRequired":false,"kind":"scalar","type":"String"}]},{"name":"lt","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"}]},{"name":"lte","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"}]},{"name":"gt","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"}]},{"name":"gte","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"}]},{"name":"contains","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"}]},{"name":"startsWith","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"}]},{"name":"endsWith","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"}]}],"atLeastOne":false},{"name":"NullablePostKindFilter","fields":[{"name":"equals","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"enum","type":"PostKind"},{"isList":false,"isRequired":false,"kind":"enum","type":"null"}]},{"name":"not","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"enum","type":"PostKind"},{"isList":false,"isRequired":false,"kind":"enum","type":"null"},{"isList":false,"isRequired":false,"kind":"enum","type":"NullablePostKindFilter"}]},{"name":"in","isRelationFilter":false,"inputType":[{"isList":true,"isRequired":false,"kind":"enum","type":"PostKind"}]},{"name":"notIn","isRelationFilter":false,"inputType":[{"isList":true,"isRequired":false,"kind":"enum","type":"PostKind"}]}],"atLeastOne":false},{"name":"IntFilter","fields":[{"name":"equals","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Int"}]},{"name":"not","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Int"},{"isList":false,"isRequired":false,"kind":"scalar","type":"IntFilter"}]},{"name":"in","isRelationFilter":false,"inputType":[{"isList":true,"isRequired":false,"kind":"scalar","type":"Int"}]},{"name":"notIn","isRelationFilter":false,"inputType":[{"isList":true,"isRequired":false,"kind":"scalar","type":"Int"}]},{"name":"lt","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Int"}]},{"name":"lte","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Int"}]},{"name":"gt","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Int"}]},{"name":"gte","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Int"}]}],"atLeastOne":false},{"name":"FloatFilter","fields":[{"name":"equals","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"}]},{"name":"not","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"},{"isList":false,"isRequired":false,"kind":"scalar","type":"FloatFilter"}]},{"name":"in","isRelationFilter":false,"inputType":[{"isList":true,"isRequired":false,"kind":"scalar","type":"Float"}]},{"name":"notIn","isRelationFilter":false,"inputType":[{"isList":true,"isRequired":false,"kind":"scalar","type":"Float"}]},{"name":"lt","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"}]},{"name":"lte","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"}]},{"name":"gt","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"}]},{"name":"gte","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"}]}],"atLeastOne":false},{"name":"PostFilter","fields":[{"name":"every","isRelationFilter":true,"inputType":[{"isList":false,"isRequired":false,"kind":"object","type":"PostWhereInput"}]},{"name":"some","isRelationFilter":true,"inputType":[{"isList":false,"isRequired":false,"kind":"object","type":"PostWhereInput"}]},{"name":"none","isRelationFilter":true,"inputType":[{"isList":false,"isRequired":false,"kind":"object","type":"PostWhereInput"}]}],"atLeastOne":false},{"name":"RoleFilter","fields":[{"name":"equals","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"enum","type":"Role"}]},{"name":"not","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"enum","type":"Role"},{"isList":false,"isRequired":false,"kind":"enum","type":"RoleFilter"}]},{"name":"in","isRelationFilter":false,"inputType":[{"isList":true,"isRequired":false,"kind":"enum","type":"Role"}]},{"name":"notIn","isRelationFilter":false,"inputType":[{"isList":true,"isRequired":false,"kind":"enum","type":"Role"}]}],"atLeastOne":false},{"name":"UserOrderByInput","atLeastOne":true,"atMostOne":true,"isOrderType":true,"fields":[{"name":"id","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"email","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"name","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"age","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"balance","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"amount","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"role","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false}]},{"name":"PostOrderByInput","atLeastOne":true,"atMostOne":true,"isOrderType":true,"fields":[{"name":"uuid","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"createdAt","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"updatedAt","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"published","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"title","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"content","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"kind","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false}]}]}}'

// We are parsing 2 times, as we want independent objects, because
// DMMFClass introduces circular references in the dmmf object
const dmmf = JSON.parse(dmmfString)
exports.dmmf = JSON.parse(dmmfString)
    