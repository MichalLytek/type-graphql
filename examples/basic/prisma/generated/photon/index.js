"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const runtime_1 = require("./runtime");
/**
 * Query Engine version: latest
 */
const path = require("path");
const debug = runtime_1.debugLib('photon');
class PhotonFetcher {
    constructor(photon, engine, debug = false, hooks) {
        this.photon = photon;
        this.engine = engine;
        this.debug = debug;
        this.hooks = hooks;
    }
    request(document, path = [], rootField, typeName, isList, callsite) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = String(document);
            debug('Request:');
            debug(query);
            if (this.hooks && this.hooks.beforeRequest) {
                this.hooks.beforeRequest({ query, path, rootField, typeName, document });
            }
            try {
                yield this.photon.connect();
                const result = yield this.engine.request(query, typeName);
                debug('Response:');
                debug(result);
                return this.unpack(result, path, rootField, isList);
            }
            catch (e) {
                if (callsite) {
                    const { stack } = runtime_1.printStack({
                        callsite,
                        originalMethod: path.join('.'),
                        onUs: e.isPanic
                    });
                    throw new Error(stack + '\n\n' + e.message);
                }
                else {
                    if (e.isPanic) {
                        throw e;
                    }
                    else {
                        throw new Error(`Error in Photon${path}: \n` + e.stack);
                    }
                }
            }
        });
    }
    unpack(data, path, rootField, isList) {
        const getPath = [];
        if (rootField) {
            getPath.push(rootField);
        }
        getPath.push(...path.filter(p => p !== 'select' && p !== 'include'));
        const result = runtime_1.deepGet(data, getPath) || null;
        if (result === null && isList) {
            return [];
        }
        return result;
    }
}
/**
 * Build tool annotations
 * In order to make `ncc` and `node-file-trace` happy.
**/
path.join(__dirname, 'runtime/query-engine-windows');
class Photon {
    constructor(options = {}) {
        const useDebug = options.debug === true ? true : typeof options.debug === 'object' ? Boolean(options.debug.library) : false;
        if (useDebug) {
            runtime_1.debugLib.enable('photon');
        }
        const debugEngine = options.debug === true ? true : typeof options.debug === 'object' ? Boolean(options.debug.engine) : false;
        // datamodel = datamodel without datasources + printed datasources
        this.datamodel = "datasource db {\r\n  provider = \"sqlite\"\r\n  url      = \"../dev.db\"\r\n}\r\n\r\ntype Numeric = Float\r\n\r\n// generator typegraphql {\r\n//   provider = \"../../../src/bin.ts\"\r\n//   output   = \"./prisma/generated/type-graphql\"\r\n// }\r\n\r\ngenerator photon {\r\n  provider = \"photonjs\"\r\n  output   = \"./prisma/generated/photon\"\r\n}\r\n\r\n/// Role enum comment\r\nenum Role {\r\n  // USER = \"User\"\r\n  USER\r\n  // ADMIN = \"Admin\"\r\n  ADMIN\r\n}\r\n\r\n/// User model comment\r\nmodel User {\r\n  /// User model field comment\r\n  id          Int     @id @unique\r\n  email       String  @unique\r\n  name        String?\r\n  age         Int\r\n  balance     Numeric\r\n  amount      Float\r\n  posts       Post[]\r\n  // maybePosts  Post[]?\r\n  role        Role\r\n  // address     Address\r\n  // address2 embed {\r\n  //   street  String\r\n  //   zipCode String\r\n  // }\r\n}\r\n\r\n// embed Address {\r\n//   street  String\r\n//   zipCode String\r\n// }\r\n\r\nenum PostKind {\r\n  BLOG\r\n  ADVERT\r\n}\r\n\r\nmodel Post {\r\n  uuid      String   @default(cuid()) @id @unique\r\n  createdAt DateTime @default(now())\r\n  updatedAt DateTime @updatedAt\r\n  published Boolean\r\n  title     String\r\n  content   String?\r\n  author    User\r\n  // coAuthor  User?\r\n  kind      PostKind?\r\n}\r\n";
        const predefinedDatasources = [];
        const inputDatasources = Object.entries(options.datasources || {}).map(([name, url]) => ({ name, url: url }));
        const datasources = runtime_1.mergeBy(predefinedDatasources, inputDatasources, (source) => source.name);
        const internal = options.__internal || {};
        const engineConfig = internal.engine || {};
        this.engine = new runtime_1.Engine({
            cwd: engineConfig.cwd || path.resolve(__dirname, "..\\.."),
            debug: debugEngine,
            datamodel: this.datamodel,
            prismaPath: engineConfig.binaryPath || undefined,
            datasources,
            generator: { "name": "photon", "provider": "photonjs", "output": "F:\\#Projekty\\#Github\\typegraphql-prisma\\examples\\basic\\prisma\\generated\\photon", "platforms": [], "pinnedPlatform": null, "config": {} },
            platform: undefined
        });
        this.dmmf = new runtime_1.DMMFClass(exports.dmmf);
        this.fetcher = new PhotonFetcher(this, this.engine, false, internal.hooks);
    }
    connectEngine(publicCall) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.engine.start();
        });
    }
    connect() {
        if (this.connectionPromise) {
            return this.connectionPromise;
        }
        this.connectionPromise = this.connectEngine(true);
        return this.connectionPromise;
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.engine.stop();
        });
    }
    // won't be generated for now
    // private _query?: QueryDelegate
    // get query(): QueryDelegate {
    //   return this._query ? this._query: (this._query = QueryDelegate(this.dmmf, this.fetcher))
    // }
    get users() {
        return UserDelegate(this.dmmf, this.fetcher);
    }
    get posts() {
        return PostDelegate(this.dmmf, this.fetcher);
    }
}
exports.Photon = Photon;
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
function UserDelegate(dmmf, fetcher) {
    const User = (args) => new UserClient(dmmf, fetcher, 'query', 'findManyUser', 'users', args, []);
    User.findOne = (args) => args.select ? new UserClient(dmmf, fetcher, 'query', 'findOneUser', 'users.findOne', args, []) : new UserClient(dmmf, fetcher, 'query', 'findOneUser', 'users.findOne', args, []);
    User.findMany = (args) => new UserClient(dmmf, fetcher, 'query', 'findManyUser', 'users.findMany', args, []);
    User.create = (args) => args.select ? new UserClient(dmmf, fetcher, 'mutation', 'createOneUser', 'users.create', args, []) : new UserClient(dmmf, fetcher, 'mutation', 'createOneUser', 'users.create', args, []);
    User.delete = (args) => args.select ? new UserClient(dmmf, fetcher, 'mutation', 'deleteOneUser', 'users.delete', args, []) : new UserClient(dmmf, fetcher, 'mutation', 'deleteOneUser', 'users.delete', args, []);
    User.update = (args) => args.select ? new UserClient(dmmf, fetcher, 'mutation', 'updateOneUser', 'users.update', args, []) : new UserClient(dmmf, fetcher, 'mutation', 'updateOneUser', 'users.update', args, []);
    User.deleteMany = (args) => new UserClient(dmmf, fetcher, 'mutation', 'deleteManyUser', 'users.deleteMany', args, []);
    User.updateMany = (args) => new UserClient(dmmf, fetcher, 'mutation', 'updateManyUser', 'users.updateMany', args, []);
    User.upsert = (args) => args.select ? new UserClient(dmmf, fetcher, 'mutation', 'upsertOneUser', 'users.upsert', args, []) : new UserClient(dmmf, fetcher, 'mutation', 'upsertOneUser', 'users.upsert', args, []);
    User.count = () => new UserClient(dmmf, fetcher, 'query', 'aggregateUser', 'users.count', {}, ['count']);
    return User; // any needed until https://github.com/microsoft/TypeScript/issues/31335 is resolved
}
class UserClient {
    constructor(_dmmf, _fetcher, _queryType, _rootField, _clientMethod, _args, _path, _isList = false) {
        this._dmmf = _dmmf;
        this._fetcher = _fetcher;
        this._queryType = _queryType;
        this._rootField = _rootField;
        this._clientMethod = _clientMethod;
        this._args = _args;
        this._path = _path;
        this._isList = _isList;
        // @ts-ignore
        if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
            const error = new Error();
            if (error && error.stack) {
                const stack = error.stack;
                this._callsite = stack;
            }
        }
    }
    posts(args) {
        const prefix = this._path.includes('select') ? 'select' : this._path.includes('include') ? 'include' : 'select';
        const path = [...this._path, prefix, 'posts'];
        const newArgs = runtime_1.deepSet(this._args, path, args || true);
        this._isList = true;
        return new PostClient(this._dmmf, this._fetcher, this._queryType, this._rootField, this._clientMethod, newArgs, path, this._isList);
    }
    get _document() {
        const { _rootField: rootField } = this;
        const document = runtime_1.makeDocument({
            dmmf: this._dmmf,
            rootField,
            rootTypeName: this._queryType,
            select: this._args
        });
        try {
            document.validate(this._args, false, this._clientMethod);
        }
        catch (e) {
            const x = e;
            if (x.render) {
                if (this._callsite) {
                    e.message = x.render(this._callsite);
                }
            }
            throw e;
        }
        return runtime_1.transformDocument(document);
    }
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then(onfulfilled, onrejected) {
        if (!this._requestPromise) {
            this._requestPromise = this._fetcher.request(this._document, this._path, this._rootField, 'User', this._isList, this._callsite);
        }
        return this._requestPromise.then(onfulfilled, onrejected);
    }
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch(onrejected) {
        if (!this._requestPromise) {
            this._requestPromise = this._fetcher.request(this._document, this._path, this._rootField, 'User', this._isList, this._callsite);
        }
        return this._requestPromise.catch(onrejected);
    }
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally) {
        if (!this._requestPromise) {
            this._requestPromise = this._fetcher.request(this._document, this._path, this._rootField, 'User', this._isList, this._callsite);
        }
        return this._requestPromise.finally(onfinally);
    }
}
exports.UserClient = UserClient;
function PostDelegate(dmmf, fetcher) {
    const Post = (args) => new PostClient(dmmf, fetcher, 'query', 'findManyPost', 'posts', args, []);
    Post.findOne = (args) => args.select ? new PostClient(dmmf, fetcher, 'query', 'findOnePost', 'posts.findOne', args, []) : new PostClient(dmmf, fetcher, 'query', 'findOnePost', 'posts.findOne', args, []);
    Post.findMany = (args) => new PostClient(dmmf, fetcher, 'query', 'findManyPost', 'posts.findMany', args, []);
    Post.create = (args) => args.select ? new PostClient(dmmf, fetcher, 'mutation', 'createOnePost', 'posts.create', args, []) : new PostClient(dmmf, fetcher, 'mutation', 'createOnePost', 'posts.create', args, []);
    Post.delete = (args) => args.select ? new PostClient(dmmf, fetcher, 'mutation', 'deleteOnePost', 'posts.delete', args, []) : new PostClient(dmmf, fetcher, 'mutation', 'deleteOnePost', 'posts.delete', args, []);
    Post.update = (args) => args.select ? new PostClient(dmmf, fetcher, 'mutation', 'updateOnePost', 'posts.update', args, []) : new PostClient(dmmf, fetcher, 'mutation', 'updateOnePost', 'posts.update', args, []);
    Post.deleteMany = (args) => new PostClient(dmmf, fetcher, 'mutation', 'deleteManyPost', 'posts.deleteMany', args, []);
    Post.updateMany = (args) => new PostClient(dmmf, fetcher, 'mutation', 'updateManyPost', 'posts.updateMany', args, []);
    Post.upsert = (args) => args.select ? new PostClient(dmmf, fetcher, 'mutation', 'upsertOnePost', 'posts.upsert', args, []) : new PostClient(dmmf, fetcher, 'mutation', 'upsertOnePost', 'posts.upsert', args, []);
    Post.count = () => new PostClient(dmmf, fetcher, 'query', 'aggregatePost', 'posts.count', {}, ['count']);
    return Post; // any needed until https://github.com/microsoft/TypeScript/issues/31335 is resolved
}
class PostClient {
    constructor(_dmmf, _fetcher, _queryType, _rootField, _clientMethod, _args, _path, _isList = false) {
        this._dmmf = _dmmf;
        this._fetcher = _fetcher;
        this._queryType = _queryType;
        this._rootField = _rootField;
        this._clientMethod = _clientMethod;
        this._args = _args;
        this._path = _path;
        this._isList = _isList;
        // @ts-ignore
        if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
            const error = new Error();
            if (error && error.stack) {
                const stack = error.stack;
                this._callsite = stack;
            }
        }
    }
    author(args) {
        const prefix = this._path.includes('select') ? 'select' : this._path.includes('include') ? 'include' : 'select';
        const path = [...this._path, prefix, 'author'];
        const newArgs = runtime_1.deepSet(this._args, path, args || true);
        this._isList = false;
        return new UserClient(this._dmmf, this._fetcher, this._queryType, this._rootField, this._clientMethod, newArgs, path, this._isList);
    }
    get _document() {
        const { _rootField: rootField } = this;
        const document = runtime_1.makeDocument({
            dmmf: this._dmmf,
            rootField,
            rootTypeName: this._queryType,
            select: this._args
        });
        try {
            document.validate(this._args, false, this._clientMethod);
        }
        catch (e) {
            const x = e;
            if (x.render) {
                if (this._callsite) {
                    e.message = x.render(this._callsite);
                }
            }
            throw e;
        }
        return runtime_1.transformDocument(document);
    }
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then(onfulfilled, onrejected) {
        if (!this._requestPromise) {
            this._requestPromise = this._fetcher.request(this._document, this._path, this._rootField, 'Post', this._isList, this._callsite);
        }
        return this._requestPromise.then(onfulfilled, onrejected);
    }
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch(onrejected) {
        if (!this._requestPromise) {
            this._requestPromise = this._fetcher.request(this._document, this._path, this._rootField, 'Post', this._isList, this._callsite);
        }
        return this._requestPromise.catch(onrejected);
    }
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally) {
        if (!this._requestPromise) {
            this._requestPromise = this._fetcher.request(this._document, this._path, this._rootField, 'Post', this._isList, this._callsite);
        }
        return this._requestPromise.finally(onfinally);
    }
}
exports.PostClient = PostClient;
/**
 * DMMF
 */
exports.dmmf = { "datamodel": { "enums": [{ "name": "Role", "values": ["USER", "ADMIN"], "dbName": null, "documentation": "Role enum comment\r" }, { "name": "PostKind", "values": ["BLOG", "ADVERT"], "dbName": null }], "models": [{ "name": "User", "isEmbedded": false, "dbName": null, "fields": [{ "name": "id", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": true, "isId": true, "type": "Int", "isGenerated": false, "isUpdatedAt": false, "documentation": "User model field comment\r" }, { "name": "email", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": true, "isId": false, "type": "String", "isGenerated": false, "isUpdatedAt": false }, { "name": "name", "kind": "scalar", "dbName": null, "isList": false, "isRequired": false, "isUnique": false, "isId": false, "type": "String", "isGenerated": false, "isUpdatedAt": false }, { "name": "age", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": false, "isId": false, "type": "Int", "isGenerated": false, "isUpdatedAt": false }, { "name": "balance", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": false, "isId": false, "type": "Float", "isGenerated": false, "isUpdatedAt": false }, { "name": "amount", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": false, "isId": false, "type": "Float", "isGenerated": false, "isUpdatedAt": false }, { "name": "posts", "kind": "object", "dbName": null, "isList": true, "isRequired": false, "isUnique": false, "isId": false, "type": "Post", "relationName": "PostToUser", "relationToFields": [], "relationOnDelete": "NONE", "isGenerated": false, "isUpdatedAt": false }, { "name": "role", "kind": "enum", "dbName": null, "isList": false, "isRequired": true, "isUnique": false, "isId": false, "type": "Role", "isGenerated": false, "isUpdatedAt": false }], "isGenerated": false, "documentation": "User model comment\r" }, { "name": "Post", "isEmbedded": false, "dbName": null, "fields": [{ "name": "uuid", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": true, "isId": true, "type": "String", "default": { "name": "cuid", "returnType": "String", "args": [] }, "isGenerated": false, "isUpdatedAt": false }, { "name": "createdAt", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": false, "isId": false, "type": "DateTime", "default": { "name": "now", "returnType": "DateTime", "args": [] }, "isGenerated": false, "isUpdatedAt": false }, { "name": "updatedAt", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": false, "isId": false, "type": "DateTime", "isGenerated": false, "isUpdatedAt": true }, { "name": "published", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": false, "isId": false, "type": "Boolean", "isGenerated": false, "isUpdatedAt": false }, { "name": "title", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": false, "isId": false, "type": "String", "isGenerated": false, "isUpdatedAt": false }, { "name": "content", "kind": "scalar", "dbName": null, "isList": false, "isRequired": false, "isUnique": false, "isId": false, "type": "String", "isGenerated": false, "isUpdatedAt": false }, { "name": "author", "kind": "object", "dbName": null, "isList": false, "isRequired": true, "isUnique": false, "isId": false, "type": "User", "relationName": "PostToUser", "relationToFields": ["id"], "relationOnDelete": "NONE", "isGenerated": false, "isUpdatedAt": false }, { "name": "kind", "kind": "enum", "dbName": null, "isList": false, "isRequired": false, "isUnique": false, "isId": false, "type": "PostKind", "isGenerated": false, "isUpdatedAt": false }], "isGenerated": false }] }, "mappings": [{ "model": "User", "plural": "users", "findOne": "findOneUser", "findMany": "findManyUser", "create": "createOneUser", "delete": "deleteOneUser", "update": "updateOneUser", "deleteMany": "deleteManyUser", "updateMany": "updateManyUser", "upsert": "upsertOneUser", "aggregate": "aggregateUser" }, { "model": "Post", "plural": "posts", "findOne": "findOnePost", "findMany": "findManyPost", "create": "createOnePost", "delete": "deleteOnePost", "update": "updateOnePost", "deleteMany": "deleteManyPost", "updateMany": "updateManyPost", "upsert": "upsertOnePost", "aggregate": "aggregatePost" }], "schema": { "enums": [{ "name": "OrderByArg", "values": ["asc", "desc"] }, { "name": "Role", "values": ["USER", "ADMIN"] }, { "name": "PostKind", "values": ["BLOG", "ADVERT"] }], "outputTypes": [{ "name": "Post", "fields": [{ "name": "uuid", "args": [], "outputType": { "type": "ID", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "createdAt", "args": [], "outputType": { "type": "DateTime", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "updatedAt", "args": [], "outputType": { "type": "DateTime", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "published", "args": [], "outputType": { "type": "Boolean", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "title", "args": [], "outputType": { "type": "String", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "content", "args": [], "outputType": { "type": "String", "kind": "scalar", "isRequired": false, "isList": false } }, { "name": "author", "args": [], "outputType": { "type": "User", "kind": "object", "isRequired": true, "isList": false } }, { "name": "kind", "args": [], "outputType": { "type": "PostKind", "kind": "enum", "isRequired": false, "isList": false } }] }, { "name": "User", "fields": [{ "name": "id", "args": [], "outputType": { "type": "Int", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "email", "args": [], "outputType": { "type": "String", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "name", "args": [], "outputType": { "type": "String", "kind": "scalar", "isRequired": false, "isList": false } }, { "name": "age", "args": [], "outputType": { "type": "Int", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "balance", "args": [], "outputType": { "type": "Float", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "amount", "args": [], "outputType": { "type": "Float", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "posts", "args": [{ "name": "where", "inputType": [{ "type": "PostWhereInput", "kind": "object", "isRequired": false, "isList": false }] }, { "name": "orderBy", "inputType": [{ "isList": false, "isRequired": false, "type": "PostOrderByInput", "kind": "object" }] }, { "name": "skip", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "after", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "before", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "first", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "last", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }], "outputType": { "type": "Post", "kind": "object", "isRequired": false, "isList": true } }, { "name": "role", "args": [], "outputType": { "type": "Role", "kind": "enum", "isRequired": true, "isList": false } }] }, { "name": "AggregateUser", "fields": [{ "name": "count", "args": [], "outputType": { "type": "Int", "kind": "scalar", "isRequired": true, "isList": false } }] }, { "name": "AggregatePost", "fields": [{ "name": "count", "args": [], "outputType": { "type": "Int", "kind": "scalar", "isRequired": true, "isList": false } }] }, { "name": "Query", "fields": [{ "name": "findManyUser", "args": [{ "name": "where", "inputType": [{ "type": "UserWhereInput", "kind": "object", "isRequired": false, "isList": false }] }, { "name": "orderBy", "inputType": [{ "isList": false, "isRequired": false, "type": "UserOrderByInput", "kind": "object" }] }, { "name": "skip", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "after", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "before", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "first", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "last", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }], "outputType": { "type": "User", "kind": "object", "isRequired": false, "isList": true } }, { "name": "aggregateUser", "args": [], "outputType": { "type": "AggregateUser", "kind": "object", "isRequired": true, "isList": false } }, { "name": "findOneUser", "args": [{ "name": "where", "inputType": [{ "type": "UserWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "User", "kind": "object", "isRequired": false, "isList": false } }, { "name": "findManyPost", "args": [{ "name": "where", "inputType": [{ "type": "PostWhereInput", "kind": "object", "isRequired": false, "isList": false }] }, { "name": "orderBy", "inputType": [{ "isList": false, "isRequired": false, "type": "PostOrderByInput", "kind": "object" }] }, { "name": "skip", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "after", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "before", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "first", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "last", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }], "outputType": { "type": "Post", "kind": "object", "isRequired": false, "isList": true } }, { "name": "aggregatePost", "args": [], "outputType": { "type": "AggregatePost", "kind": "object", "isRequired": true, "isList": false } }, { "name": "findOnePost", "args": [{ "name": "where", "inputType": [{ "type": "PostWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "Post", "kind": "object", "isRequired": false, "isList": false } }] }, { "name": "BatchPayload", "fields": [{ "name": "count", "args": [], "outputType": { "type": "Int", "kind": "scalar", "isRequired": true, "isList": false } }] }, { "name": "Mutation", "fields": [{ "name": "createOneUser", "args": [{ "name": "data", "inputType": [{ "type": "UserCreateInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "User", "kind": "object", "isRequired": true, "isList": false } }, { "name": "deleteOneUser", "args": [{ "name": "where", "inputType": [{ "type": "UserWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "User", "kind": "object", "isRequired": false, "isList": false } }, { "name": "updateOneUser", "args": [{ "name": "data", "inputType": [{ "type": "UserUpdateInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "where", "inputType": [{ "type": "UserWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "User", "kind": "object", "isRequired": false, "isList": false } }, { "name": "upsertOneUser", "args": [{ "name": "where", "inputType": [{ "type": "UserWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "create", "inputType": [{ "type": "UserCreateInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "update", "inputType": [{ "type": "UserUpdateInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "User", "kind": "object", "isRequired": true, "isList": false } }, { "name": "updateManyUser", "args": [{ "name": "data", "inputType": [{ "type": "UserUpdateManyMutationInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "where", "inputType": [{ "type": "UserWhereInput", "kind": "object", "isRequired": false, "isList": false }] }], "outputType": { "type": "BatchPayload", "kind": "object", "isRequired": true, "isList": false } }, { "name": "deleteManyUser", "args": [{ "name": "where", "inputType": [{ "type": "UserWhereInput", "kind": "object", "isRequired": false, "isList": false }] }], "outputType": { "type": "BatchPayload", "kind": "object", "isRequired": true, "isList": false } }, { "name": "createOnePost", "args": [{ "name": "data", "inputType": [{ "type": "PostCreateInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "Post", "kind": "object", "isRequired": true, "isList": false } }, { "name": "deleteOnePost", "args": [{ "name": "where", "inputType": [{ "type": "PostWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "Post", "kind": "object", "isRequired": false, "isList": false } }, { "name": "updateOnePost", "args": [{ "name": "data", "inputType": [{ "type": "PostUpdateInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "where", "inputType": [{ "type": "PostWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "Post", "kind": "object", "isRequired": false, "isList": false } }, { "name": "upsertOnePost", "args": [{ "name": "where", "inputType": [{ "type": "PostWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "create", "inputType": [{ "type": "PostCreateInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "update", "inputType": [{ "type": "PostUpdateInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "Post", "kind": "object", "isRequired": true, "isList": false } }, { "name": "updateManyPost", "args": [{ "name": "data", "inputType": [{ "type": "PostUpdateManyMutationInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "where", "inputType": [{ "type": "PostWhereInput", "kind": "object", "isRequired": false, "isList": false }] }], "outputType": { "type": "BatchPayload", "kind": "object", "isRequired": true, "isList": false } }, { "name": "deleteManyPost", "args": [{ "name": "where", "inputType": [{ "type": "PostWhereInput", "kind": "object", "isRequired": false, "isList": false }] }], "outputType": { "type": "BatchPayload", "kind": "object", "isRequired": true, "isList": false } }] }], "inputTypes": [{ "name": "PostWhereInput", "fields": [{ "name": "uuid", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "StringFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "createdAt", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "DateTime" }, { "type": "DateTimeFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "updatedAt", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "DateTime" }, { "type": "DateTimeFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "published", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Boolean" }, { "type": "BooleanFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "title", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "StringFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "content", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "NullableStringFilter", "isList": false, "isRequired": false, "kind": "object" }, { "type": "null", "isList": false, "isRequired": false, "kind": "scalar" }], "isRelationFilter": false }, { "name": "kind", "inputType": [{ "isList": false, "isRequired": false, "kind": "enum", "type": "PostKind" }, { "type": "NullablePostKindFilter", "isList": false, "isRequired": false, "kind": "object" }, { "type": "null", "isList": false, "isRequired": false, "kind": "scalar" }], "isRelationFilter": false }, { "name": "AND", "inputType": [{ "type": "PostWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }, { "name": "OR", "inputType": [{ "type": "PostWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }, { "name": "NOT", "inputType": [{ "type": "PostWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }, { "name": "author", "inputType": [{ "type": "UserWhereInput", "kind": "object", "isRequired": false, "isList": false }], "isRelationFilter": true }], "isWhereType": true, "atLeastOne": false }, { "name": "UserWhereInput", "fields": [{ "name": "id", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Int" }, { "type": "IntFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "email", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "StringFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "name", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "NullableStringFilter", "isList": false, "isRequired": false, "kind": "object" }, { "type": "null", "isList": false, "isRequired": false, "kind": "scalar" }], "isRelationFilter": false }, { "name": "age", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Int" }, { "type": "IntFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "balance", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Float" }, { "type": "FloatFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "amount", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Float" }, { "type": "FloatFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "posts", "inputType": [{ "type": "PostFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "role", "inputType": [{ "isList": false, "isRequired": false, "kind": "enum", "type": "Role" }, { "type": "RoleFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "AND", "inputType": [{ "type": "UserWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }, { "name": "OR", "inputType": [{ "type": "UserWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }, { "name": "NOT", "inputType": [{ "type": "UserWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }], "isWhereType": true, "atLeastOne": false }, { "name": "UserWhereUniqueInput", "fields": [{ "name": "id", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "email", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }], "atLeastOne": true }, { "name": "PostWhereUniqueInput", "fields": [{ "name": "uuid", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }], "atLeastOne": true }, { "name": "PostCreateWithoutAuthorInput", "fields": [{ "name": "uuid", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "createdAt", "inputType": [{ "type": "DateTime", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "updatedAt", "inputType": [{ "type": "DateTime", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "published", "inputType": [{ "type": "Boolean", "kind": "scalar", "isRequired": true, "isList": false }] }, { "name": "title", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": true, "isList": false }] }, { "name": "content", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "kind", "inputType": [{ "type": "PostKind", "kind": "enum", "isRequired": false, "isList": false }] }] }, { "name": "PostCreateManyWithoutPostsInput", "fields": [{ "name": "create", "inputType": [{ "type": "PostCreateWithoutAuthorInput", "kind": "object", "isRequired": false, "isList": true }] }, { "name": "connect", "inputType": [{ "type": "PostWhereUniqueInput", "kind": "object", "isRequired": false, "isList": true }] }] }, { "name": "UserCreateInput", "fields": [{ "name": "email", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": true, "isList": false }] }, { "name": "name", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "age", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": true, "isList": false }] }, { "name": "balance", "inputType": [{ "type": "Float", "kind": "scalar", "isRequired": true, "isList": false }] }, { "name": "amount", "inputType": [{ "type": "Float", "kind": "scalar", "isRequired": true, "isList": false }] }, { "name": "role", "inputType": [{ "type": "Role", "kind": "enum", "isRequired": true, "isList": false }] }, { "name": "posts", "inputType": [{ "type": "PostCreateManyWithoutPostsInput", "kind": "object", "isRequired": false, "isList": false }] }] }, { "name": "PostUpdateWithoutAuthorDataInput", "fields": [{ "name": "uuid", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "createdAt", "inputType": [{ "type": "DateTime", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "updatedAt", "inputType": [{ "type": "DateTime", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "published", "inputType": [{ "type": "Boolean", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "title", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "content", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "kind", "inputType": [{ "type": "PostKind", "kind": "enum", "isRequired": false, "isList": false }] }] }, { "name": "PostUpdateWithWhereUniqueWithoutAuthorInput", "fields": [{ "name": "where", "inputType": [{ "type": "PostWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "data", "inputType": [{ "type": "PostUpdateWithoutAuthorDataInput", "kind": "object", "isRequired": true, "isList": false }] }] }, { "name": "PostScalarWhereInput", "fields": [{ "name": "uuid", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "StringFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "createdAt", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "DateTime" }, { "type": "DateTimeFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "updatedAt", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "DateTime" }, { "type": "DateTimeFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "published", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Boolean" }, { "type": "BooleanFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "title", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "StringFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "content", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "NullableStringFilter", "isList": false, "isRequired": false, "kind": "object" }, { "type": "null", "isList": false, "isRequired": false, "kind": "scalar" }], "isRelationFilter": false }, { "name": "kind", "inputType": [{ "isList": false, "isRequired": false, "kind": "enum", "type": "PostKind" }, { "type": "NullablePostKindFilter", "isList": false, "isRequired": false, "kind": "object" }, { "type": "null", "isList": false, "isRequired": false, "kind": "scalar" }], "isRelationFilter": false }, { "name": "AND", "inputType": [{ "type": "PostScalarWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }, { "name": "OR", "inputType": [{ "type": "PostScalarWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }, { "name": "NOT", "inputType": [{ "type": "PostScalarWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }], "isWhereType": true, "atLeastOne": false }, { "name": "PostUpdateManyDataInput", "fields": [{ "name": "uuid", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "createdAt", "inputType": [{ "type": "DateTime", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "updatedAt", "inputType": [{ "type": "DateTime", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "published", "inputType": [{ "type": "Boolean", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "title", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "content", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "kind", "inputType": [{ "type": "PostKind", "kind": "enum", "isRequired": false, "isList": false }] }] }, { "name": "PostUpdateManyWithWhereNestedInput", "fields": [{ "name": "where", "inputType": [{ "type": "PostScalarWhereInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "data", "inputType": [{ "type": "PostUpdateManyDataInput", "kind": "object", "isRequired": true, "isList": false }] }] }, { "name": "PostUpsertWithWhereUniqueWithoutAuthorInput", "fields": [{ "name": "where", "inputType": [{ "type": "PostWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "update", "inputType": [{ "type": "PostUpdateWithoutAuthorDataInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "create", "inputType": [{ "type": "PostCreateWithoutAuthorInput", "kind": "object", "isRequired": true, "isList": false }] }] }, { "name": "PostUpdateManyWithoutAuthorInput", "fields": [{ "name": "create", "inputType": [{ "type": "PostCreateWithoutAuthorInput", "kind": "object", "isRequired": false, "isList": true }] }, { "name": "connect", "inputType": [{ "type": "PostWhereUniqueInput", "kind": "object", "isRequired": false, "isList": true }] }, { "name": "set", "inputType": [{ "type": "PostWhereUniqueInput", "kind": "object", "isRequired": false, "isList": true }] }, { "name": "disconnect", "inputType": [{ "type": "PostWhereUniqueInput", "kind": "object", "isRequired": false, "isList": true }] }, { "name": "delete", "inputType": [{ "type": "PostWhereUniqueInput", "kind": "object", "isRequired": false, "isList": true }] }, { "name": "update", "inputType": [{ "type": "PostUpdateWithWhereUniqueWithoutAuthorInput", "kind": "object", "isRequired": false, "isList": true }] }, { "name": "updateMany", "inputType": [{ "type": "PostUpdateManyWithWhereNestedInput", "kind": "object", "isRequired": false, "isList": true }] }, { "name": "deleteMany", "inputType": [{ "type": "PostScalarWhereInput", "kind": "object", "isRequired": false, "isList": true }] }, { "name": "upsert", "inputType": [{ "type": "PostUpsertWithWhereUniqueWithoutAuthorInput", "kind": "object", "isRequired": false, "isList": true }] }] }, { "name": "UserUpdateInput", "fields": [{ "name": "id", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "email", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "name", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "age", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "balance", "inputType": [{ "type": "Float", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "amount", "inputType": [{ "type": "Float", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "role", "inputType": [{ "type": "Role", "kind": "enum", "isRequired": false, "isList": false }] }, { "name": "posts", "inputType": [{ "type": "PostUpdateManyWithoutAuthorInput", "kind": "object", "isRequired": false, "isList": false }] }] }, { "name": "UserUpdateManyMutationInput", "fields": [{ "name": "id", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "email", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "name", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "age", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "balance", "inputType": [{ "type": "Float", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "amount", "inputType": [{ "type": "Float", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "role", "inputType": [{ "type": "Role", "kind": "enum", "isRequired": false, "isList": false }] }] }, { "name": "UserCreateWithoutPostsInput", "fields": [{ "name": "email", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": true, "isList": false }] }, { "name": "name", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "age", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": true, "isList": false }] }, { "name": "balance", "inputType": [{ "type": "Float", "kind": "scalar", "isRequired": true, "isList": false }] }, { "name": "amount", "inputType": [{ "type": "Float", "kind": "scalar", "isRequired": true, "isList": false }] }, { "name": "role", "inputType": [{ "type": "Role", "kind": "enum", "isRequired": true, "isList": false }] }] }, { "name": "UserCreateOneWithoutAuthorInput", "fields": [{ "name": "create", "inputType": [{ "type": "UserCreateWithoutPostsInput", "kind": "object", "isRequired": false, "isList": false }] }, { "name": "connect", "inputType": [{ "type": "UserWhereUniqueInput", "kind": "object", "isRequired": false, "isList": false }] }] }, { "name": "PostCreateInput", "fields": [{ "name": "uuid", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "createdAt", "inputType": [{ "type": "DateTime", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "updatedAt", "inputType": [{ "type": "DateTime", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "published", "inputType": [{ "type": "Boolean", "kind": "scalar", "isRequired": true, "isList": false }] }, { "name": "title", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": true, "isList": false }] }, { "name": "content", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "kind", "inputType": [{ "type": "PostKind", "kind": "enum", "isRequired": false, "isList": false }] }, { "name": "author", "inputType": [{ "type": "UserCreateOneWithoutAuthorInput", "kind": "object", "isRequired": true, "isList": false }] }] }, { "name": "UserUpdateWithoutPostsDataInput", "fields": [{ "name": "id", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "email", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "name", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "age", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "balance", "inputType": [{ "type": "Float", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "amount", "inputType": [{ "type": "Float", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "role", "inputType": [{ "type": "Role", "kind": "enum", "isRequired": false, "isList": false }] }] }, { "name": "UserUpsertWithoutPostsInput", "fields": [{ "name": "update", "inputType": [{ "type": "UserUpdateWithoutPostsDataInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "create", "inputType": [{ "type": "UserCreateWithoutPostsInput", "kind": "object", "isRequired": true, "isList": false }] }] }, { "name": "UserUpdateOneRequiredWithoutPostsInput", "fields": [{ "name": "create", "inputType": [{ "type": "UserCreateWithoutPostsInput", "kind": "object", "isRequired": false, "isList": false }] }, { "name": "connect", "inputType": [{ "type": "UserWhereUniqueInput", "kind": "object", "isRequired": false, "isList": false }] }, { "name": "update", "inputType": [{ "type": "UserUpdateWithoutPostsDataInput", "kind": "object", "isRequired": false, "isList": false }] }, { "name": "upsert", "inputType": [{ "type": "UserUpsertWithoutPostsInput", "kind": "object", "isRequired": false, "isList": false }] }] }, { "name": "PostUpdateInput", "fields": [{ "name": "uuid", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "createdAt", "inputType": [{ "type": "DateTime", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "updatedAt", "inputType": [{ "type": "DateTime", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "published", "inputType": [{ "type": "Boolean", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "title", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "content", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "kind", "inputType": [{ "type": "PostKind", "kind": "enum", "isRequired": false, "isList": false }] }, { "name": "author", "inputType": [{ "type": "UserUpdateOneRequiredWithoutPostsInput", "kind": "object", "isRequired": false, "isList": false }] }] }, { "name": "PostUpdateManyMutationInput", "fields": [{ "name": "uuid", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "createdAt", "inputType": [{ "type": "DateTime", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "updatedAt", "inputType": [{ "type": "DateTime", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "published", "inputType": [{ "type": "Boolean", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "title", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "content", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "kind", "inputType": [{ "type": "PostKind", "kind": "enum", "isRequired": false, "isList": false }] }] }, { "name": "StringFilter", "fields": [{ "name": "equals", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "not", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "isList": false, "isRequired": false, "kind": "scalar", "type": "StringFilter" }] }, { "name": "in", "inputType": [{ "isList": true, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "notIn", "inputType": [{ "isList": true, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "lt", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "lte", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "gt", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "gte", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "contains", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "startsWith", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "endsWith", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }], "atLeastOne": false }, { "name": "DateTimeFilter", "fields": [{ "name": "equals", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "DateTime" }] }, { "name": "not", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "DateTime" }, { "isList": false, "isRequired": false, "kind": "scalar", "type": "DateTimeFilter" }] }, { "name": "in", "inputType": [{ "isList": true, "isRequired": false, "kind": "scalar", "type": "DateTime" }] }, { "name": "notIn", "inputType": [{ "isList": true, "isRequired": false, "kind": "scalar", "type": "DateTime" }] }, { "name": "lt", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "DateTime" }] }, { "name": "lte", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "DateTime" }] }, { "name": "gt", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "DateTime" }] }, { "name": "gte", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "DateTime" }] }], "atLeastOne": false }, { "name": "BooleanFilter", "fields": [{ "name": "equals", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Boolean" }] }, { "name": "not", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Boolean" }, { "isList": false, "isRequired": false, "kind": "scalar", "type": "BooleanFilter" }] }], "atLeastOne": false }, { "name": "NullableStringFilter", "fields": [{ "name": "equals", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "isList": false, "isRequired": false, "kind": "scalar", "type": "null" }] }, { "name": "not", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "isList": false, "isRequired": false, "kind": "scalar", "type": "null" }, { "isList": false, "isRequired": false, "kind": "scalar", "type": "NullableStringFilter" }] }, { "name": "in", "inputType": [{ "isList": true, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "notIn", "inputType": [{ "isList": true, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "lt", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "lte", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "gt", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "gte", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "contains", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "startsWith", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "endsWith", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }], "atLeastOne": false }, { "name": "NullablePostKindFilter", "fields": [], "atLeastOne": false }, { "name": "IntFilter", "fields": [{ "name": "equals", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Int" }] }, { "name": "not", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Int" }, { "isList": false, "isRequired": false, "kind": "scalar", "type": "IntFilter" }] }, { "name": "in", "inputType": [{ "isList": true, "isRequired": false, "kind": "scalar", "type": "Int" }] }, { "name": "notIn", "inputType": [{ "isList": true, "isRequired": false, "kind": "scalar", "type": "Int" }] }, { "name": "lt", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Int" }] }, { "name": "lte", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Int" }] }, { "name": "gt", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Int" }] }, { "name": "gte", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Int" }] }], "atLeastOne": false }, { "name": "FloatFilter", "fields": [{ "name": "equals", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Float" }] }, { "name": "not", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Float" }, { "isList": false, "isRequired": false, "kind": "scalar", "type": "FloatFilter" }] }, { "name": "in", "inputType": [{ "isList": true, "isRequired": false, "kind": "scalar", "type": "Float" }] }, { "name": "notIn", "inputType": [{ "isList": true, "isRequired": false, "kind": "scalar", "type": "Float" }] }, { "name": "lt", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Float" }] }, { "name": "lte", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Float" }] }, { "name": "gt", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Float" }] }, { "name": "gte", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Float" }] }], "atLeastOne": false }, { "name": "PostFilter", "fields": [{ "name": "every", "inputType": [{ "isList": false, "isRequired": false, "kind": "object", "type": "PostWhereInput" }] }, { "name": "some", "inputType": [{ "isList": false, "isRequired": false, "kind": "object", "type": "PostWhereInput" }] }, { "name": "none", "inputType": [{ "isList": false, "isRequired": false, "kind": "object", "type": "PostWhereInput" }] }], "atLeastOne": false }, { "name": "RoleFilter", "fields": [], "atLeastOne": false }, { "name": "UserOrderByInput", "atLeastOne": true, "atMostOne": true, "isOrderType": true, "fields": [{ "name": "id", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "email", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "name", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "age", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "balance", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "amount", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "role", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }] }, { "name": "PostOrderByInput", "atLeastOne": true, "atMostOne": true, "isOrderType": true, "fields": [{ "name": "uuid", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "createdAt", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "updatedAt", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "published", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "title", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "content", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "kind", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }] }] } };
