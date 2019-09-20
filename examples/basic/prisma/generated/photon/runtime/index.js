module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(196);
/******/ 	};
/******/ 	// initialize runtime
/******/ 	runtime(__webpack_require__);
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 9:
/***/ (function(module, __unusedexports, __webpack_require__) {

var once = __webpack_require__(49);

var noop = function() {};

var isRequest = function(stream) {
	return stream.setHeader && typeof stream.abort === 'function';
};

var isChildProcess = function(stream) {
	return stream.stdio && Array.isArray(stream.stdio) && stream.stdio.length === 3
};

var eos = function(stream, opts, callback) {
	if (typeof opts === 'function') return eos(stream, null, opts);
	if (!opts) opts = {};

	callback = once(callback || noop);

	var ws = stream._writableState;
	var rs = stream._readableState;
	var readable = opts.readable || (opts.readable !== false && stream.readable);
	var writable = opts.writable || (opts.writable !== false && stream.writable);

	var onlegacyfinish = function() {
		if (!stream.writable) onfinish();
	};

	var onfinish = function() {
		writable = false;
		if (!readable) callback.call(stream);
	};

	var onend = function() {
		readable = false;
		if (!writable) callback.call(stream);
	};

	var onexit = function(exitCode) {
		callback.call(stream, exitCode ? new Error('exited with error code: ' + exitCode) : null);
	};

	var onerror = function(err) {
		callback.call(stream, err);
	};

	var onclose = function() {
		if (readable && !(rs && rs.ended)) return callback.call(stream, new Error('premature close'));
		if (writable && !(ws && ws.ended)) return callback.call(stream, new Error('premature close'));
	};

	var onrequest = function() {
		stream.req.on('finish', onfinish);
	};

	if (isRequest(stream)) {
		stream.on('complete', onfinish);
		stream.on('abort', onclose);
		if (stream.req) onrequest();
		else stream.on('request', onrequest);
	} else if (writable && !ws) { // legacy streams
		stream.on('end', onlegacyfinish);
		stream.on('close', onlegacyfinish);
	}

	if (isChildProcess(stream)) stream.on('exit', onexit);

	stream.on('end', onend);
	stream.on('finish', onfinish);
	if (opts.error !== false) stream.on('error', onerror);
	stream.on('close', onclose);

	return function() {
		stream.removeListener('complete', onfinish);
		stream.removeListener('abort', onclose);
		stream.removeListener('request', onrequest);
		if (stream.req) stream.req.removeListener('finish', onfinish);
		stream.removeListener('end', onlegacyfinish);
		stream.removeListener('close', onlegacyfinish);
		stream.removeListener('finish', onfinish);
		stream.removeListener('exit', onexit);
		stream.removeListener('end', onend);
		stream.removeListener('error', onerror);
		stream.removeListener('close', onclose);
	};
};

module.exports = eos;


/***/ }),

/***/ 11:
/***/ (function(module) {

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    var ret = fn.apply(this, args)
    var cb = args[args.length-1]
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })
    }
    return ret
  }
}


/***/ }),

/***/ 16:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const pump = __webpack_require__(453);
const bufferStream = __webpack_require__(375);

class MaxBufferError extends Error {
	constructor() {
		super('maxBuffer exceeded');
		this.name = 'MaxBufferError';
	}
}

async function getStream(inputStream, options) {
	if (!inputStream) {
		return Promise.reject(new Error('Expected a stream'));
	}

	options = {
		maxBuffer: Infinity,
		...options
	};

	const {maxBuffer} = options;

	let stream;
	await new Promise((resolve, reject) => {
		const rejectPromise = error => {
			if (error) { // A null check
				error.bufferedData = stream.getBufferedValue();
			}

			reject(error);
		};

		stream = pump(inputStream, bufferStream(options), error => {
			if (error) {
				rejectPromise(error);
				return;
			}

			resolve();
		});

		stream.on('data', () => {
			if (stream.getBufferedLength() > maxBuffer) {
				rejectPromise(new MaxBufferError());
			}
		});
	});

	return stream.getBufferedValue();
}

module.exports = getStream;
// TODO: Remove this for the next major release
module.exports.default = getStream;
module.exports.buffer = (stream, options) => getStream(stream, {...options, encoding: 'buffer'});
module.exports.array = (stream, options) => getStream(stream, {...options, array: true});
module.exports.MaxBufferError = MaxBufferError;


/***/ }),

/***/ 18:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const net = __webpack_require__(631);

class TimeoutError extends Error {
	constructor(threshold, event) {
		super(`Timeout awaiting '${event}' for ${threshold}ms`);
		this.name = 'TimeoutError';
		this.code = 'ETIMEDOUT';
		this.event = event;
	}
}

const reentry = Symbol('reentry');

const noop = () => {};

module.exports = (request, delays, options) => {
	/* istanbul ignore next: this makes sure timed-out isn't called twice */
	if (request[reentry]) {
		return;
	}

	request[reentry] = true;

	let stopNewTimeouts = false;

	const addTimeout = (delay, callback, ...args) => {
		// An error had been thrown before. Going further would result in uncaught errors.
		// See https://github.com/sindresorhus/got/issues/631#issuecomment-435675051
		if (stopNewTimeouts) {
			return noop;
		}

		// Event loop order is timers, poll, immediates.
		// The timed event may emit during the current tick poll phase, so
		// defer calling the handler until the poll phase completes.
		let immediate;
		const timeout = setTimeout(() => {
			immediate = setImmediate(callback, delay, ...args);
			/* istanbul ignore next: added in node v9.7.0 */
			if (immediate.unref) {
				immediate.unref();
			}
		}, delay);

		/* istanbul ignore next: in order to support electron renderer */
		if (timeout.unref) {
			timeout.unref();
		}

		const cancel = () => {
			clearTimeout(timeout);
			clearImmediate(immediate);
		};

		cancelers.push(cancel);

		return cancel;
	};

	const {host, hostname} = options;
	const timeoutHandler = (delay, event) => {
		request.emit('error', new TimeoutError(delay, event));
		request.once('error', () => {}); // Ignore the `socket hung up` error made by request.abort()

		request.abort();
	};

	const cancelers = [];
	const cancelTimeouts = () => {
		stopNewTimeouts = true;
		cancelers.forEach(cancelTimeout => cancelTimeout());
	};

	request.once('error', cancelTimeouts);
	request.once('response', response => {
		response.once('end', cancelTimeouts);
	});

	if (delays.request !== undefined) {
		addTimeout(delays.request, timeoutHandler, 'request');
	}

	if (delays.socket !== undefined) {
		const socketTimeoutHandler = () => {
			timeoutHandler(delays.socket, 'socket');
		};

		request.setTimeout(delays.socket, socketTimeoutHandler);

		// `request.setTimeout(0)` causes a memory leak.
		// We can just remove the listener and forget about the timer - it's unreffed.
		// See https://github.com/sindresorhus/got/issues/690
		cancelers.push(() => request.removeListener('timeout', socketTimeoutHandler));
	}

	if (delays.lookup !== undefined && !request.socketPath && !net.isIP(hostname || host)) {
		request.once('socket', socket => {
			/* istanbul ignore next: hard to test */
			if (socket.connecting) {
				const cancelTimeout = addTimeout(delays.lookup, timeoutHandler, 'lookup');
				socket.once('lookup', cancelTimeout);
			}
		});
	}

	if (delays.connect !== undefined) {
		request.once('socket', socket => {
			/* istanbul ignore next: hard to test */
			if (socket.connecting) {
				const timeConnect = () => addTimeout(delays.connect, timeoutHandler, 'connect');

				if (request.socketPath || net.isIP(hostname || host)) {
					socket.once('connect', timeConnect());
				} else {
					socket.once('lookup', error => {
						if (error === null) {
							socket.once('connect', timeConnect());
						}
					});
				}
			}
		});
	}

	if (delays.secureConnect !== undefined && options.protocol === 'https:') {
		request.once('socket', socket => {
			/* istanbul ignore next: hard to test */
			if (socket.connecting) {
				socket.once('connect', () => {
					const cancelTimeout = addTimeout(delays.secureConnect, timeoutHandler, 'secureConnect');
					socket.once('secureConnect', cancelTimeout);
				});
			}
		});
	}

	if (delays.send !== undefined) {
		request.once('socket', socket => {
			const timeRequest = () => addTimeout(delays.send, timeoutHandler, 'send');
			/* istanbul ignore next: hard to test */
			if (socket.connecting) {
				socket.once('connect', () => {
					request.once('upload-complete', timeRequest());
				});
			} else {
				request.once('upload-complete', timeRequest());
			}
		});
	}

	if (delays.response !== undefined) {
		request.once('upload-complete', () => {
			const cancelTimeout = addTimeout(delays.response, timeoutHandler, 'response');
			request.once('response', cancelTimeout);
		});
	}
};

module.exports.TimeoutError = TimeoutError;


/***/ }),

/***/ 24:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const prism_1 = __webpack_require__(848);
function highlightTS(str) {
    return highlight(str, prism_1.Prism.languages.javascript);
}
exports.highlightTS = highlightTS;
function highlight(str, grammar) {
    const tokens = prism_1.Prism.tokenize(str, grammar);
    return tokens.map(t => prism_1.Token.stringify(t)).join('');
}


/***/ }),

/***/ 28:
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (object) => Object
    .getOwnPropertySymbols(object)
    .filter((keySymbol) => object.propertyIsEnumerable(keySymbol));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxrQkFBZSxDQUFDLE1BQWMsRUFBWSxFQUFFLENBQUMsTUFBTTtLQUNoRCxxQkFBcUIsQ0FBQyxNQUFNLENBQUM7S0FDN0IsTUFBTSxDQUFDLENBQUMsU0FBUyxFQUFXLEVBQUUsQ0FBQyxNQUFNLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IChvYmplY3Q6IG9iamVjdCk6IHN5bWJvbFtdID0+IE9iamVjdFxuICAuZ2V0T3duUHJvcGVydHlTeW1ib2xzKG9iamVjdClcbiAgLmZpbHRlcigoa2V5U3ltYm9sKTogYm9vbGVhbiA9PiBvYmplY3QucHJvcGVydHlJc0VudW1lcmFibGUoa2V5U3ltYm9sKSlcbiJdfQ==

/***/ }),

/***/ 41:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(__webpack_require__(946));
const stackTraceParser = __importStar(__webpack_require__(579));
const highlight_1 = __webpack_require__(24);
const dedent_1 = __webpack_require__(469);
function renderN(n, max) {
    const wantedLetters = String(max).length;
    const hasLetters = String(n).length;
    if (hasLetters >= wantedLetters) {
        return String(n);
    }
    return String(' '.repeat(wantedLetters - hasLetters) + n);
}
exports.printStack = ({ callsite, originalMethod, onUs }) => {
    const lastErrorHeight = 20;
    let callsiteStr = ':';
    let prevLines = '\n';
    let afterLines = '';
    let indentValue = 0;
    let functionName = `photon.${originalMethod}()`;
    // @ts-ignore
    if (callsite && typeof window === 'undefined') {
        const stack = stackTraceParser.parse(callsite);
        // TODO: more resilient logic to check that it's not relative to cwd
        const trace = stack.find(t => t.file &&
            !t.file.includes('@generated') &&
            !t.methodName.includes('new ') &&
            t.methodName.split('.').length < 4);
        if (process.env.NODE_ENV !== 'production' && trace && trace.file && trace.lineNumber && trace.column) {
            const fileName = trace.file;
            const lineNumber = trace.lineNumber;
            callsiteStr = callsite ? ` in ${chalk_1.default.underline(`${trace.file}:${trace.lineNumber}:${trace.column}`)}` : '';
            const height = process.stdout.rows || 20;
            const start = Math.max(0, lineNumber - 5);
            const neededHeight = lastErrorHeight + lineNumber - start;
            if (height > neededHeight) {
                const fs = __webpack_require__(747);
                if (fs.existsSync(fileName)) {
                    const file = fs.readFileSync(fileName, 'utf-8');
                    const slicedFile = file
                        .split('\n')
                        .slice(start, lineNumber)
                        .join('\n');
                    const lines = dedent_1.dedent(slicedFile).split('\n');
                    const theLine = lines[lines.length - 1];
                    const photonRegex = /(=|return)*\s+(await)?\s*(.*\()/;
                    const match = theLine.match(photonRegex);
                    if (match) {
                        functionName = `${match[3]})`;
                    }
                    const slicePoint = theLine.indexOf('{');
                    const highlightedLines = highlight_1.highlightTS(lines
                        .map((l, i, all) => !onUs && i === all.length - 1 ? l.slice(0, slicePoint > -1 ? slicePoint : l.length - 1) : l)
                        .join('\n')).split('\n');
                    prevLines =
                        '\n' +
                            highlightedLines
                                .map((l, i) => chalk_1.default.grey(renderN(i + start + 1, lineNumber + start + 1) + ' ') + chalk_1.default.reset() + l)
                                .map((l, i, arr) => (i === arr.length - 1 ? `${chalk_1.default.red.bold('→')} ${l}` : chalk_1.default.dim('  ' + l)))
                                .join('\n');
                    afterLines = ')';
                    indentValue = String(lineNumber + start + 1).length + getIndent(theLine) + 1;
                }
            }
        }
    }
    function getIndent(line) {
        let spaceCount = 0;
        for (let i = 0; i < line.length; i++) {
            if (line.charAt(i) !== ' ') {
                return spaceCount;
            }
            spaceCount++;
        }
        return spaceCount;
    }
    const introText = onUs
        ? chalk_1.default.red(`Oops, an unknown error occured! This is ${chalk_1.default.bold('on us')}, you did nothing wrong.
It occured in the ${chalk_1.default.bold(`\`${functionName}\``)} invocation${callsiteStr}`)
        : chalk_1.default.red(`Invalid ${chalk_1.default.bold(`\`${functionName}\``)} invocation${callsiteStr}`);
    const stackStr = `\n${introText}
${prevLines}${chalk_1.default.reset()}`;
    return { indent: indentValue, stack: stackStr, afterLines, lastErrorHeight };
};


/***/ }),

/***/ 49:
/***/ (function(module, __unusedexports, __webpack_require__) {

var wrappy = __webpack_require__(11)
module.exports = wrappy(once)
module.exports.strict = wrappy(onceStrict)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  var name = fn.name || 'Function wrapped with `once`'
  f.onceError = name + " shouldn't be called more than once"
  f.called = false
  return f
}


/***/ }),

/***/ 53:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

// TODO: Use the `URL` global when targeting Node.js 10
const URLParser = typeof URL === 'undefined' ? __webpack_require__(835).URL : URL;

const testParameter = (name, filters) => {
	return filters.some(filter => filter instanceof RegExp ? filter.test(name) : filter === name);
};

const normalizeUrl = (urlString, options) => {
	options = {
		defaultProtocol: 'http:',
		normalizeProtocol: true,
		forceHttp: false,
		forceHttps: false,
		stripAuthentication: true,
		stripHash: false,
		stripWWW: true,
		removeQueryParameters: [/^utm_\w+/i],
		removeTrailingSlash: true,
		removeDirectoryIndex: false,
		sortQueryParameters: true,
		...options
	};

	// TODO: Remove this at some point in the future
	if (Reflect.has(options, 'normalizeHttps')) {
		throw new Error('options.normalizeHttps is renamed to options.forceHttp');
	}

	if (Reflect.has(options, 'normalizeHttp')) {
		throw new Error('options.normalizeHttp is renamed to options.forceHttps');
	}

	if (Reflect.has(options, 'stripFragment')) {
		throw new Error('options.stripFragment is renamed to options.stripHash');
	}

	urlString = urlString.trim();

	const hasRelativeProtocol = urlString.startsWith('//');
	const isRelativeUrl = !hasRelativeProtocol && /^\.*\//.test(urlString);

	// Prepend protocol
	if (!isRelativeUrl) {
		urlString = urlString.replace(/^(?!(?:\w+:)?\/\/)|^\/\//, options.defaultProtocol);
	}

	const urlObj = new URLParser(urlString);

	if (options.forceHttp && options.forceHttps) {
		throw new Error('The `forceHttp` and `forceHttps` options cannot be used together');
	}

	if (options.forceHttp && urlObj.protocol === 'https:') {
		urlObj.protocol = 'http:';
	}

	if (options.forceHttps && urlObj.protocol === 'http:') {
		urlObj.protocol = 'https:';
	}

	// Remove auth
	if (options.stripAuthentication) {
		urlObj.username = '';
		urlObj.password = '';
	}

	// Remove hash
	if (options.stripHash) {
		urlObj.hash = '';
	}

	// Remove duplicate slashes if not preceded by a protocol
	if (urlObj.pathname) {
		// TODO: Use the following instead when targeting Node.js 10
		// `urlObj.pathname = urlObj.pathname.replace(/(?<!https?:)\/{2,}/g, '/');`
		urlObj.pathname = urlObj.pathname.replace(/((?!:).|^)\/{2,}/g, (_, p1) => {
			if (/^(?!\/)/g.test(p1)) {
				return `${p1}/`;
			}

			return '/';
		});
	}

	// Decode URI octets
	if (urlObj.pathname) {
		urlObj.pathname = decodeURI(urlObj.pathname);
	}

	// Remove directory index
	if (options.removeDirectoryIndex === true) {
		options.removeDirectoryIndex = [/^index\.[a-z]+$/];
	}

	if (Array.isArray(options.removeDirectoryIndex) && options.removeDirectoryIndex.length > 0) {
		let pathComponents = urlObj.pathname.split('/');
		const lastComponent = pathComponents[pathComponents.length - 1];

		if (testParameter(lastComponent, options.removeDirectoryIndex)) {
			pathComponents = pathComponents.slice(0, pathComponents.length - 1);
			urlObj.pathname = pathComponents.slice(1).join('/') + '/';
		}
	}

	if (urlObj.hostname) {
		// Remove trailing dot
		urlObj.hostname = urlObj.hostname.replace(/\.$/, '');

		// Remove `www.`
		if (options.stripWWW && /^www\.([a-z\-\d]{2,63})\.([a-z.]{2,5})$/.test(urlObj.hostname)) {
			// Each label should be max 63 at length (min: 2).
			// The extension should be max 5 at length (min: 2).
			// Source: https://en.wikipedia.org/wiki/Hostname#Restrictions_on_valid_host_names
			urlObj.hostname = urlObj.hostname.replace(/^www\./, '');
		}
	}

	// Remove query unwanted parameters
	if (Array.isArray(options.removeQueryParameters)) {
		for (const key of [...urlObj.searchParams.keys()]) {
			if (testParameter(key, options.removeQueryParameters)) {
				urlObj.searchParams.delete(key);
			}
		}
	}

	// Sort query parameters
	if (options.sortQueryParameters) {
		urlObj.searchParams.sort();
	}

	if (options.removeTrailingSlash) {
		urlObj.pathname = urlObj.pathname.replace(/\/$/, '');
	}

	// Take advantage of many of the Node `url` normalizations
	urlString = urlObj.toString();

	// Remove ending `/`
	if ((options.removeTrailingSlash || urlObj.pathname === '/') && urlObj.hash === '') {
		urlString = urlString.replace(/\/$/, '');
	}

	// Restore relative protocol, if applicable
	if (hasRelativeProtocol && !options.normalizeProtocol) {
		urlString = urlString.replace(/^http:\/\//, '//');
	}

	// Remove http/https
	if (options.stripProtocol) {
		urlString = urlString.replace(/^(?:https?:)?\/\//, '');
	}

	return urlString;
};

module.exports = normalizeUrl;
// TODO: Remove this for the next major release
module.exports.default = normalizeUrl;


/***/ }),

/***/ 57:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const fs = __webpack_require__(747);
const util = __webpack_require__(669);
const is = __webpack_require__(534);
const isFormData = __webpack_require__(504);

module.exports = async options => {
	const {body} = options;

	if (options.headers['content-length']) {
		return Number(options.headers['content-length']);
	}

	if (!body && !options.stream) {
		return 0;
	}

	if (is.string(body)) {
		return Buffer.byteLength(body);
	}

	if (isFormData(body)) {
		return util.promisify(body.getLength.bind(body))();
	}

	if (body instanceof fs.ReadStream) {
		const {size} = await util.promisify(fs.stat)(body.path);
		return size;
	}

	return null;
};


/***/ }),

/***/ 72:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const {PassThrough} = __webpack_require__(413);

module.exports = options => {
	options = Object.assign({}, options);

	const {array} = options;
	let {encoding} = options;
	const buffer = encoding === 'buffer';
	let objectMode = false;

	if (array) {
		objectMode = !(encoding || buffer);
	} else {
		encoding = encoding || 'utf8';
	}

	if (buffer) {
		encoding = null;
	}

	let len = 0;
	const ret = [];
	const stream = new PassThrough({objectMode});

	if (encoding) {
		stream.setEncoding(encoding);
	}

	stream.on('data', chunk => {
		ret.push(chunk);

		if (objectMode) {
			len = ret.length;
		} else {
			len += chunk.length;
		}
	});

	stream.getBufferedValue = () => {
		if (array) {
			return ret;
		}

		return buffer ? Buffer.concat(ret, len) : ret.join('');
	};

	stream.getBufferedLength = () => len;

	return stream;
};


/***/ }),

/***/ 79:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const query_1 = __webpack_require__(165);
function visit(document, visitor) {
    const children = document.children.map(field => visitField(field, visitor));
    if (document.children.length === children.length &&
        document.children.every((child, index) => child === children[index])) {
        return document;
    }
    const newDoc = new query_1.Document(document.type, children);
    return newDoc;
}
exports.visit = visit;
function visitField(field, visitor) {
    const args = field.args ? field.args.args.map(arg => visitArg(arg, visitor)) : undefined;
    const newArgs = args ? new query_1.Args(args) : undefined;
    const children = field.children ? field.children.map(child => visitField(child, visitor)) : undefined;
    const argsDidntChange = (!newArgs && !field.args) ||
        (field.args &&
            newArgs &&
            (field.args.args.length === newArgs.args.length &&
                field.args.args.every((arg, index) => arg === newArgs.args[index])));
    const fieldsDidntChange = (!field.children && !children) ||
        (field.children &&
            children &&
            field.children.length === children.length &&
            field.children.every((child, index) => child === children[index]));
    if (argsDidntChange && fieldsDidntChange) {
        return field;
    }
    return new query_1.Field({
        name: field.name,
        args: newArgs,
        children,
        error: field.error,
    });
}
function isArgsArray(input) {
    if (Array.isArray(input)) {
        return input.every(arg => arg instanceof query_1.Args);
    }
    return false;
}
function visitArg(arg, visitor) {
    function mapArgs(inputArgs) {
        const { args } = inputArgs;
        const newArgs = args.map(a => visitArg(a, visitor));
        if (newArgs.length !== args.length || args.find((a, i) => a !== newArgs[i])) {
            return new query_1.Args(newArgs);
        }
        return inputArgs;
    }
    const newArg = visitor.Arg.enter(arg) || arg;
    let newValue = newArg.value;
    if (isArgsArray(newArg.value)) {
        newValue = newArg.value.map(mapArgs);
    }
    else if (newArg.value instanceof query_1.Args) {
        newValue = mapArgs(newArg.value);
    }
    if (newValue !== newArg.value) {
        return new query_1.Arg({
            key: newArg.key,
            value: newValue,
            error: newArg.error,
            argType: newArg.argType,
            isEnum: newArg.isEnum,
        });
    }
    return newArg;
}


/***/ }),

/***/ 81:
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module dependencies.
 */

const tty = __webpack_require__(867);
const util = __webpack_require__(669);

/**
 * This is the Node.js implementation of `debug()`.
 */

exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

try {
	// Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
	// eslint-disable-next-line import/no-extraneous-dependencies
	const supportsColor = __webpack_require__(247);

	if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
		exports.colors = [
			20,
			21,
			26,
			27,
			32,
			33,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			56,
			57,
			62,
			63,
			68,
			69,
			74,
			75,
			76,
			77,
			78,
			79,
			80,
			81,
			92,
			93,
			98,
			99,
			112,
			113,
			128,
			129,
			134,
			135,
			148,
			149,
			160,
			161,
			162,
			163,
			164,
			165,
			166,
			167,
			168,
			169,
			170,
			171,
			172,
			173,
			178,
			179,
			184,
			185,
			196,
			197,
			198,
			199,
			200,
			201,
			202,
			203,
			204,
			205,
			206,
			207,
			208,
			209,
			214,
			215,
			220,
			221
		];
	}
} catch (error) {
	// Swallow - we only care if `supports-color` is available; it doesn't have to be.
}

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(key => {
	return /^debug_/i.test(key);
}).reduce((obj, key) => {
	// Camel-case
	const prop = key
		.substring(6)
		.toLowerCase()
		.replace(/_([a-z])/g, (_, k) => {
			return k.toUpperCase();
		});

	// Coerce string value into JS value
	let val = process.env[key];
	if (/^(yes|on|true|enabled)$/i.test(val)) {
		val = true;
	} else if (/^(no|off|false|disabled)$/i.test(val)) {
		val = false;
	} else if (val === 'null') {
		val = null;
	} else {
		val = Number(val);
	}

	obj[prop] = val;
	return obj;
}, {});

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
	return 'colors' in exports.inspectOpts ?
		Boolean(exports.inspectOpts.colors) :
		tty.isatty(process.stderr.fd);
}

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	const {namespace: name, useColors} = this;

	if (useColors) {
		const c = this.color;
		const colorCode = '\u001B[3' + (c < 8 ? c : '8;5;' + c);
		const prefix = `  ${colorCode};1m${name} \u001B[0m`;

		args[0] = prefix + args[0].split('\n').join('\n' + prefix);
		args.push(colorCode + 'm+' + module.exports.humanize(this.diff) + '\u001B[0m');
	} else {
		args[0] = getDate() + name + ' ' + args[0];
	}
}

function getDate() {
	if (exports.inspectOpts.hideDate) {
		return '';
	}
	return new Date().toISOString() + ' ';
}

/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 */

function log(...args) {
	return process.stderr.write(util.format(...args) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	if (namespaces) {
		process.env.DEBUG = namespaces;
	} else {
		// If you set a process.env field to null or undefined, it gets cast to the
		// string 'null' or 'undefined'. Just delete instead.
		delete process.env.DEBUG;
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
	return process.env.DEBUG;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init(debug) {
	debug.inspectOpts = {};

	const keys = Object.keys(exports.inspectOpts);
	for (let i = 0; i < keys.length; i++) {
		debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
	}
}

module.exports = __webpack_require__(486)(exports);

const {formatters} = module.exports;

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

formatters.o = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts)
		.replace(/\s*\n\s*/g, ' ');
};

/**
 * Map %O to `util.inspect()`, allowing multiple lines if needed.
 */

formatters.O = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts);
};


/***/ }),

/***/ 86:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const {URL, URLSearchParams} = __webpack_require__(835); // TODO: Use the `URL` global when targeting Node.js 10
const urlLib = __webpack_require__(835);
const is = __webpack_require__(534);
const urlParseLax = __webpack_require__(173);
const lowercaseKeys = __webpack_require__(474);
const urlToOptions = __webpack_require__(811);
const isFormData = __webpack_require__(504);
const merge = __webpack_require__(821);
const knownHookEvents = __webpack_require__(433);

const retryAfterStatusCodes = new Set([413, 429, 503]);

// `preNormalize` handles static options (e.g. headers).
// For example, when you create a custom instance and make a request
// with no static changes, they won't be normalized again.
//
// `normalize` operates on dynamic options - they cannot be saved.
// For example, `body` is everytime different per request.
// When it's done normalizing the new options, it performs merge()
// on the prenormalized options and the normalized ones.

const preNormalize = (options, defaults) => {
	if (is.nullOrUndefined(options.headers)) {
		options.headers = {};
	} else {
		options.headers = lowercaseKeys(options.headers);
	}

	if (options.baseUrl && !options.baseUrl.toString().endsWith('/')) {
		options.baseUrl += '/';
	}

	if (options.stream) {
		options.json = false;
	}

	if (is.nullOrUndefined(options.hooks)) {
		options.hooks = {};
	} else if (!is.object(options.hooks)) {
		throw new TypeError(`Parameter \`hooks\` must be an object, not ${is(options.hooks)}`);
	}

	for (const event of knownHookEvents) {
		if (is.nullOrUndefined(options.hooks[event])) {
			if (defaults) {
				options.hooks[event] = [...defaults.hooks[event]];
			} else {
				options.hooks[event] = [];
			}
		}
	}

	if (is.number(options.timeout)) {
		options.gotTimeout = {request: options.timeout};
	} else if (is.object(options.timeout)) {
		options.gotTimeout = options.timeout;
	}

	delete options.timeout;

	const {retry} = options;
	options.retry = {
		retries: 0,
		methods: [],
		statusCodes: [],
		errorCodes: []
	};

	if (is.nonEmptyObject(defaults) && retry !== false) {
		options.retry = {...defaults.retry};
	}

	if (retry !== false) {
		if (is.number(retry)) {
			options.retry.retries = retry;
		} else {
			options.retry = {...options.retry, ...retry};
		}
	}

	if (options.gotTimeout) {
		options.retry.maxRetryAfter = Math.min(...[options.gotTimeout.request, options.gotTimeout.connection].filter(n => !is.nullOrUndefined(n)));
	}

	if (is.array(options.retry.methods)) {
		options.retry.methods = new Set(options.retry.methods.map(method => method.toUpperCase()));
	}

	if (is.array(options.retry.statusCodes)) {
		options.retry.statusCodes = new Set(options.retry.statusCodes);
	}

	if (is.array(options.retry.errorCodes)) {
		options.retry.errorCodes = new Set(options.retry.errorCodes);
	}

	return options;
};

const normalize = (url, options, defaults) => {
	if (is.plainObject(url)) {
		options = {...url, ...options};
		url = options.url || {};
		delete options.url;
	}

	if (defaults) {
		options = merge({}, defaults.options, options ? preNormalize(options, defaults.options) : {});
	} else {
		options = merge({}, preNormalize(options));
	}

	if (!is.string(url) && !is.object(url)) {
		throw new TypeError(`Parameter \`url\` must be a string or object, not ${is(url)}`);
	}

	if (is.string(url)) {
		if (options.baseUrl) {
			if (url.toString().startsWith('/')) {
				url = url.toString().slice(1);
			}

			url = urlToOptions(new URL(url, options.baseUrl));
		} else {
			url = url.replace(/^unix:/, 'http://$&');
			url = urlParseLax(url);
		}
	} else if (is(url) === 'URL') {
		url = urlToOptions(url);
	}

	// Override both null/undefined with default protocol
	options = merge({path: ''}, url, {protocol: url.protocol || 'https:'}, options);

	for (const hook of options.hooks.init) {
		const called = hook(options);

		if (is.promise(called)) {
			throw new TypeError('The `init` hook must be a synchronous function');
		}
	}

	const {baseUrl} = options;
	Object.defineProperty(options, 'baseUrl', {
		set: () => {
			throw new Error('Failed to set baseUrl. Options are normalized already.');
		},
		get: () => baseUrl
	});

	const {query} = options;
	if (is.nonEmptyString(query) || is.nonEmptyObject(query) || query instanceof URLSearchParams) {
		if (!is.string(query)) {
			options.query = (new URLSearchParams(query)).toString();
		}

		options.path = `${options.path.split('?')[0]}?${options.query}`;
		delete options.query;
	}

	if (options.hostname === 'unix') {
		const matches = /(.+?):(.+)/.exec(options.path);

		if (matches) {
			const [, socketPath, path] = matches;
			options = {
				...options,
				socketPath,
				path,
				host: null
			};
		}
	}

	const {headers} = options;
	for (const [key, value] of Object.entries(headers)) {
		if (is.nullOrUndefined(value)) {
			delete headers[key];
		}
	}

	if (options.json && is.undefined(headers.accept)) {
		headers.accept = 'application/json';
	}

	if (options.decompress && is.undefined(headers['accept-encoding'])) {
		headers['accept-encoding'] = 'gzip, deflate';
	}

	const {body} = options;
	if (is.nullOrUndefined(body)) {
		options.method = options.method ? options.method.toUpperCase() : 'GET';
	} else {
		const isObject = is.object(body) && !is.buffer(body) && !is.nodeStream(body);
		if (!is.nodeStream(body) && !is.string(body) && !is.buffer(body) && !(options.form || options.json)) {
			throw new TypeError('The `body` option must be a stream.Readable, string or Buffer');
		}

		if (options.json && !(isObject || is.array(body))) {
			throw new TypeError('The `body` option must be an Object or Array when the `json` option is used');
		}

		if (options.form && !isObject) {
			throw new TypeError('The `body` option must be an Object when the `form` option is used');
		}

		if (isFormData(body)) {
			// Special case for https://github.com/form-data/form-data
			headers['content-type'] = headers['content-type'] || `multipart/form-data; boundary=${body.getBoundary()}`;
		} else if (options.form) {
			headers['content-type'] = headers['content-type'] || 'application/x-www-form-urlencoded';
			options.body = (new URLSearchParams(body)).toString();
		} else if (options.json) {
			headers['content-type'] = headers['content-type'] || 'application/json';
			options.body = JSON.stringify(body);
		}

		options.method = options.method ? options.method.toUpperCase() : 'POST';
	}

	if (!is.function(options.retry.retries)) {
		const {retries} = options.retry;

		options.retry.retries = (iteration, error) => {
			if (iteration > retries) {
				return 0;
			}

			if ((!error || !options.retry.errorCodes.has(error.code)) && (!options.retry.methods.has(error.method) || !options.retry.statusCodes.has(error.statusCode))) {
				return 0;
			}

			if (Reflect.has(error, 'headers') && Reflect.has(error.headers, 'retry-after') && retryAfterStatusCodes.has(error.statusCode)) {
				let after = Number(error.headers['retry-after']);
				if (is.nan(after)) {
					after = Date.parse(error.headers['retry-after']) - Date.now();
				} else {
					after *= 1000;
				}

				if (after > options.retry.maxRetryAfter) {
					return 0;
				}

				return after;
			}

			if (error.statusCode === 413) {
				return 0;
			}

			const noise = Math.random() * 100;
			return ((2 ** (iteration - 1)) * 1000) + noise;
		};
	}

	return options;
};

const reNormalize = options => normalize(urlLib.format(options), options);

module.exports = normalize;
module.exports.preNormalize = preNormalize;
module.exports.reNormalize = reNormalize;


/***/ }),

/***/ 87:
/***/ (function(module) {

module.exports = require("os");

/***/ }),

/***/ 89:
/***/ (function(module) {

"use strict";


// We define these manually to ensure they're always copied
// even if they would move up the prototype chain
// https://nodejs.org/api/http.html#http_class_http_incomingmessage
const knownProps = [
	'destroy',
	'setTimeout',
	'socket',
	'headers',
	'trailers',
	'rawHeaders',
	'statusCode',
	'httpVersion',
	'httpVersionMinor',
	'httpVersionMajor',
	'rawTrailers',
	'statusMessage'
];

module.exports = (fromStream, toStream) => {
	const fromProps = new Set(Object.keys(fromStream).concat(knownProps));

	for (const prop of fromProps) {
		// Don't overwrite existing properties
		if (prop in toStream) {
			continue;
		}

		toStream[prop] = typeof fromStream[prop] === 'function' ? fromStream[prop].bind(fromStream) : fromStream[prop];
	}
};


/***/ }),

/***/ 90:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const ansiRegex = __webpack_require__(963);

const stripAnsi = string => typeof string === 'string' ? string.replace(ansiRegex(), '') : string;

module.exports = stripAnsi;
module.exports.default = stripAnsi;


/***/ }),

/***/ 93:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const Readable = __webpack_require__(413).Readable;
const lowercaseKeys = __webpack_require__(474);

class Response extends Readable {
	constructor(statusCode, headers, body, url) {
		if (typeof statusCode !== 'number') {
			throw new TypeError('Argument `statusCode` should be a number');
		}
		if (typeof headers !== 'object') {
			throw new TypeError('Argument `headers` should be an object');
		}
		if (!(body instanceof Buffer)) {
			throw new TypeError('Argument `body` should be a buffer');
		}
		if (typeof url !== 'string') {
			throw new TypeError('Argument `url` should be a string');
		}

		super();
		this.statusCode = statusCode;
		this.headers = lowercaseKeys(headers);
		this.body = body;
		this.url = url;
	}

	_read() {
		this.push(this.body);
		this.push(null);
	}
}

module.exports = Response;


/***/ }),

/***/ 97:
/***/ (function(module) {

"use strict";

module.exports = object => {
	const result = {};

	for (const [key, value] of Object.entries(object)) {
		result[key.toLowerCase()] = value;
	}

	return result;
};


/***/ }),

/***/ 108:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(__webpack_require__(747));
function plusX(file) {
    const s = fs.statSync(file);
    const newMode = s.mode | 64 | 8 | 1;
    if (s.mode === newMode)
        return;
    const base8 = newMode.toString(8).slice(-3);
    fs.chmodSync(file, base8);
}
exports.plusX = plusX;
function fixPlatforms(platforms, platform) {
    platforms = platforms || [];
    if (!platforms.includes('native')) {
        return ['native', ...platforms];
    }
    return [...platforms, platform];
}
exports.fixPlatforms = fixPlatforms;
//# sourceMappingURL=util.js.map

/***/ }),

/***/ 128:
/***/ (function(module) {

"use strict";

module.exports = (url, opts) => {
	if (typeof url !== 'string') {
		throw new TypeError(`Expected \`url\` to be of type \`string\`, got \`${typeof url}\``);
	}

	url = url.trim();
	opts = Object.assign({https: false}, opts);

	if (/^\.*\/|^(?!localhost)\w+:/.test(url)) {
		return url;
	}

	return url.replace(/^(?!(?:\w+:)?\/\/)/, opts.https ? 'https://' : 'http://');
};


/***/ }),

/***/ 129:
/***/ (function(module) {

module.exports = require("child_process");

/***/ }),

/***/ 131:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const indent_string_1 = __importDefault(__webpack_require__(257));
function printGeneratorConfig(config) {
    return String(new GeneratorConfigClass(config));
}
exports.printGeneratorConfig = printGeneratorConfig;
class GeneratorConfigClass {
    constructor(config) {
        this.config = config;
    }
    toString() {
        const { config } = this;
        // parse & stringify trims out all the undefined values
        const obj = JSON.parse(JSON.stringify({
            provider: config.provider,
            platforms: config.platforms || undefined,
            pinnedPlatform: config.pinnedPlatform || undefined,
        }));
        return `generator ${config.name} {
${indent_string_1.default(printDatamodelObject(obj), 2)}
}`;
    }
}
exports.GeneratorConfigClass = GeneratorConfigClass;
function printDatamodelObject(obj) {
    const maxLength = Object.keys(obj).reduce((max, curr) => Math.max(max, curr.length), 0);
    return Object.entries(obj)
        .map(([key, value]) => `${key.padEnd(maxLength)} = ${niceStringify(value)}`)
        .join('\n');
}
exports.printDatamodelObject = printDatamodelObject;
function niceStringify(value) {
    return JSON.parse(JSON.stringify(value, (_, value) => {
        if (Array.isArray(value)) {
            return `[${value.map(element => JSON.stringify(element)).join(', ')}]`;
        }
        return JSON.stringify(value);
    }));
}
//# sourceMappingURL=printGeneratorConfig.js.map

/***/ }),

/***/ 138:
/***/ (function(module) {

"use strict";


var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;

module.exports = function (str) {
	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}

	return str.replace(matchOperatorsRe, '\\$&');
};


/***/ }),

/***/ 145:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// Copyright (C) 2011-2015 John Hewson
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
// IN THE SOFTWARE.
Object.defineProperty(exports, "__esModule", { value: true });
var stream = __webpack_require__(413), util = __webpack_require__(669);
// convinience API
function byline(readStream, options) {
    return module.exports.createStream(readStream, options);
}
exports.default = byline;
// basic API
module.exports.createStream = function (readStream, options) {
    if (readStream) {
        return createLineStream(readStream, options);
    }
    else {
        return new LineStream(options);
    }
};
function createLineStream(readStream, options) {
    if (!readStream) {
        throw new Error('expected readStream');
    }
    if (!readStream.readable) {
        throw new Error('readStream must be readable');
    }
    var ls = new LineStream(options);
    readStream.pipe(ls);
    return ls;
}
exports.createLineStream = createLineStream;
//
// using the new node v0.10 "streams2" API
//
module.exports.LineStream = LineStream;
function LineStream(options) {
    stream.Transform.call(this, options);
    options = options || {};
    // use objectMode to stop the output from being buffered
    // which re-concatanates the lines, just without newlines.
    this._readableState.objectMode = true;
    this._lineBuffer = [];
    this._keepEmptyLines = options.keepEmptyLines || false;
    this._lastChunkEndedWithCR = false;
    // take the source's encoding if we don't have one
    this.on('pipe', function (src) {
        if (!this.encoding) {
            // but we can't do this for old-style streams
            if (src instanceof stream.Readable) {
                this.encoding = src._readableState.encoding;
            }
        }
    });
}
util.inherits(LineStream, stream.Transform);
LineStream.prototype._transform = function (chunk, encoding, done) {
    // decode binary chunks as UTF-8
    encoding = encoding || 'utf8';
    if (Buffer.isBuffer(chunk)) {
        if (encoding == 'buffer') {
            chunk = chunk.toString(); // utf8
            encoding = 'utf8';
        }
        else {
            chunk = chunk.toString(encoding);
        }
    }
    this._chunkEncoding = encoding;
    var lines = chunk.split(/\r\n|\r|\n/g);
    // don't split CRLF which spans chunks
    if (this._lastChunkEndedWithCR && chunk[0] == '\n') {
        lines.shift();
    }
    if (this._lineBuffer.length > 0) {
        this._lineBuffer[this._lineBuffer.length - 1] += lines[0];
        lines.shift();
    }
    this._lastChunkEndedWithCR = chunk[chunk.length - 1] == '\r';
    this._lineBuffer = this._lineBuffer.concat(lines);
    this._pushBuffer(encoding, 1, done);
};
LineStream.prototype._pushBuffer = function (encoding, keep, done) {
    // always buffer the last (possibly partial) line
    while (this._lineBuffer.length > keep) {
        var line = this._lineBuffer.shift();
        // skip empty lines
        if (this._keepEmptyLines || line.length > 0) {
            if (!this.push(this._reencode(line, encoding))) {
                // when the high-water mark is reached, defer pushes until the next tick
                var self = this;
                setImmediate(function () {
                    self._pushBuffer(encoding, keep, done);
                });
                return;
            }
        }
    }
    done();
};
LineStream.prototype._flush = function (done) {
    this._pushBuffer(this._chunkEncoding, 0, done);
};
// see Readable::push
LineStream.prototype._reencode = function (line, chunkEncoding) {
    if (this.encoding && this.encoding != chunkEncoding) {
        return Buffer.from(line, chunkEncoding).toString(this.encoding);
    }
    else if (this.encoding) {
        // this should be the most common case, i.e. we're using an encoded source stream
        return line;
    }
    else {
        return Buffer.from(line, chunkEncoding);
    }
};
//# sourceMappingURL=byline.js.map

/***/ }),

/***/ 154:
/***/ (function(module) {

"use strict";

// rfc7231 6.1
const statusCodeCacheableByDefault = [
    200,
    203,
    204,
    206,
    300,
    301,
    404,
    405,
    410,
    414,
    501,
];

// This implementation does not understand partial responses (206)
const understoodStatuses = [
    200,
    203,
    204,
    300,
    301,
    302,
    303,
    307,
    308,
    404,
    405,
    410,
    414,
    501,
];

const hopByHopHeaders = {
    date: true, // included, because we add Age update Date
    connection: true,
    'keep-alive': true,
    'proxy-authenticate': true,
    'proxy-authorization': true,
    te: true,
    trailer: true,
    'transfer-encoding': true,
    upgrade: true,
};
const excludedFromRevalidationUpdate = {
    // Since the old body is reused, it doesn't make sense to change properties of the body
    'content-length': true,
    'content-encoding': true,
    'transfer-encoding': true,
    'content-range': true,
};

function parseCacheControl(header) {
    const cc = {};
    if (!header) return cc;

    // TODO: When there is more than one value present for a given directive (e.g., two Expires header fields, multiple Cache-Control: max-age directives),
    // the directive's value is considered invalid. Caches are encouraged to consider responses that have invalid freshness information to be stale
    const parts = header.trim().split(/\s*,\s*/); // TODO: lame parsing
    for (const part of parts) {
        const [k, v] = part.split(/\s*=\s*/, 2);
        cc[k] = v === undefined ? true : v.replace(/^"|"$/g, ''); // TODO: lame unquoting
    }

    return cc;
}

function formatCacheControl(cc) {
    let parts = [];
    for (const k in cc) {
        const v = cc[k];
        parts.push(v === true ? k : k + '=' + v);
    }
    if (!parts.length) {
        return undefined;
    }
    return parts.join(', ');
}

module.exports = class CachePolicy {
    constructor(
        req,
        res,
        {
            shared,
            cacheHeuristic,
            immutableMinTimeToLive,
            ignoreCargoCult,
            trustServerDate,
            _fromObject,
        } = {}
    ) {
        if (_fromObject) {
            this._fromObject(_fromObject);
            return;
        }

        if (!res || !res.headers) {
            throw Error('Response headers missing');
        }
        this._assertRequestHasHeaders(req);

        this._responseTime = this.now();
        this._isShared = shared !== false;
        this._trustServerDate =
            undefined !== trustServerDate ? trustServerDate : true;
        this._cacheHeuristic =
            undefined !== cacheHeuristic ? cacheHeuristic : 0.1; // 10% matches IE
        this._immutableMinTtl =
            undefined !== immutableMinTimeToLive
                ? immutableMinTimeToLive
                : 24 * 3600 * 1000;

        this._status = 'status' in res ? res.status : 200;
        this._resHeaders = res.headers;
        this._rescc = parseCacheControl(res.headers['cache-control']);
        this._method = 'method' in req ? req.method : 'GET';
        this._url = req.url;
        this._host = req.headers.host;
        this._noAuthorization = !req.headers.authorization;
        this._reqHeaders = res.headers.vary ? req.headers : null; // Don't keep all request headers if they won't be used
        this._reqcc = parseCacheControl(req.headers['cache-control']);

        // Assume that if someone uses legacy, non-standard uncecessary options they don't understand caching,
        // so there's no point stricly adhering to the blindly copy&pasted directives.
        if (
            ignoreCargoCult &&
            'pre-check' in this._rescc &&
            'post-check' in this._rescc
        ) {
            delete this._rescc['pre-check'];
            delete this._rescc['post-check'];
            delete this._rescc['no-cache'];
            delete this._rescc['no-store'];
            delete this._rescc['must-revalidate'];
            this._resHeaders = Object.assign({}, this._resHeaders, {
                'cache-control': formatCacheControl(this._rescc),
            });
            delete this._resHeaders.expires;
            delete this._resHeaders.pragma;
        }

        // When the Cache-Control header field is not present in a request, caches MUST consider the no-cache request pragma-directive
        // as having the same effect as if "Cache-Control: no-cache" were present (see Section 5.2.1).
        if (
            res.headers['cache-control'] == null &&
            /no-cache/.test(res.headers.pragma)
        ) {
            this._rescc['no-cache'] = true;
        }
    }

    now() {
        return Date.now();
    }

    storable() {
        // The "no-store" request directive indicates that a cache MUST NOT store any part of either this request or any response to it.
        return !!(
            !this._reqcc['no-store'] &&
            // A cache MUST NOT store a response to any request, unless:
            // The request method is understood by the cache and defined as being cacheable, and
            ('GET' === this._method ||
                'HEAD' === this._method ||
                ('POST' === this._method && this._hasExplicitExpiration())) &&
            // the response status code is understood by the cache, and
            understoodStatuses.indexOf(this._status) !== -1 &&
            // the "no-store" cache directive does not appear in request or response header fields, and
            !this._rescc['no-store'] &&
            // the "private" response directive does not appear in the response, if the cache is shared, and
            (!this._isShared || !this._rescc.private) &&
            // the Authorization header field does not appear in the request, if the cache is shared,
            (!this._isShared ||
                this._noAuthorization ||
                this._allowsStoringAuthenticated()) &&
            // the response either:
            // contains an Expires header field, or
            (this._resHeaders.expires ||
                // contains a max-age response directive, or
                // contains a s-maxage response directive and the cache is shared, or
                // contains a public response directive.
                this._rescc.public ||
                this._rescc['max-age'] ||
                this._rescc['s-maxage'] ||
                // has a status code that is defined as cacheable by default
                statusCodeCacheableByDefault.indexOf(this._status) !== -1)
        );
    }

    _hasExplicitExpiration() {
        // 4.2.1 Calculating Freshness Lifetime
        return (
            (this._isShared && this._rescc['s-maxage']) ||
            this._rescc['max-age'] ||
            this._resHeaders.expires
        );
    }

    _assertRequestHasHeaders(req) {
        if (!req || !req.headers) {
            throw Error('Request headers missing');
        }
    }

    satisfiesWithoutRevalidation(req) {
        this._assertRequestHasHeaders(req);

        // When presented with a request, a cache MUST NOT reuse a stored response, unless:
        // the presented request does not contain the no-cache pragma (Section 5.4), nor the no-cache cache directive,
        // unless the stored response is successfully validated (Section 4.3), and
        const requestCC = parseCacheControl(req.headers['cache-control']);
        if (requestCC['no-cache'] || /no-cache/.test(req.headers.pragma)) {
            return false;
        }

        if (requestCC['max-age'] && this.age() > requestCC['max-age']) {
            return false;
        }

        if (
            requestCC['min-fresh'] &&
            this.timeToLive() < 1000 * requestCC['min-fresh']
        ) {
            return false;
        }

        // the stored response is either:
        // fresh, or allowed to be served stale
        if (this.stale()) {
            const allowsStale =
                requestCC['max-stale'] &&
                !this._rescc['must-revalidate'] &&
                (true === requestCC['max-stale'] ||
                    requestCC['max-stale'] > this.age() - this.maxAge());
            if (!allowsStale) {
                return false;
            }
        }

        return this._requestMatches(req, false);
    }

    _requestMatches(req, allowHeadMethod) {
        // The presented effective request URI and that of the stored response match, and
        return (
            (!this._url || this._url === req.url) &&
            this._host === req.headers.host &&
            // the request method associated with the stored response allows it to be used for the presented request, and
            (!req.method ||
                this._method === req.method ||
                (allowHeadMethod && 'HEAD' === req.method)) &&
            // selecting header fields nominated by the stored response (if any) match those presented, and
            this._varyMatches(req)
        );
    }

    _allowsStoringAuthenticated() {
        //  following Cache-Control response directives (Section 5.2.2) have such an effect: must-revalidate, public, and s-maxage.
        return (
            this._rescc['must-revalidate'] ||
            this._rescc.public ||
            this._rescc['s-maxage']
        );
    }

    _varyMatches(req) {
        if (!this._resHeaders.vary) {
            return true;
        }

        // A Vary header field-value of "*" always fails to match
        if (this._resHeaders.vary === '*') {
            return false;
        }

        const fields = this._resHeaders.vary
            .trim()
            .toLowerCase()
            .split(/\s*,\s*/);
        for (const name of fields) {
            if (req.headers[name] !== this._reqHeaders[name]) return false;
        }
        return true;
    }

    _copyWithoutHopByHopHeaders(inHeaders) {
        const headers = {};
        for (const name in inHeaders) {
            if (hopByHopHeaders[name]) continue;
            headers[name] = inHeaders[name];
        }
        // 9.1.  Connection
        if (inHeaders.connection) {
            const tokens = inHeaders.connection.trim().split(/\s*,\s*/);
            for (const name of tokens) {
                delete headers[name];
            }
        }
        if (headers.warning) {
            const warnings = headers.warning.split(/,/).filter(warning => {
                return !/^\s*1[0-9][0-9]/.test(warning);
            });
            if (!warnings.length) {
                delete headers.warning;
            } else {
                headers.warning = warnings.join(',').trim();
            }
        }
        return headers;
    }

    responseHeaders() {
        const headers = this._copyWithoutHopByHopHeaders(this._resHeaders);
        const age = this.age();

        // A cache SHOULD generate 113 warning if it heuristically chose a freshness
        // lifetime greater than 24 hours and the response's age is greater than 24 hours.
        if (
            age > 3600 * 24 &&
            !this._hasExplicitExpiration() &&
            this.maxAge() > 3600 * 24
        ) {
            headers.warning =
                (headers.warning ? `${headers.warning}, ` : '') +
                '113 - "rfc7234 5.5.4"';
        }
        headers.age = `${Math.round(age)}`;
        headers.date = new Date(this.now()).toUTCString();
        return headers;
    }

    /**
     * Value of the Date response header or current time if Date was demed invalid
     * @return timestamp
     */
    date() {
        if (this._trustServerDate) {
            return this._serverDate();
        }
        return this._responseTime;
    }

    _serverDate() {
        const dateValue = Date.parse(this._resHeaders.date);
        if (isFinite(dateValue)) {
            const maxClockDrift = 8 * 3600 * 1000;
            const clockDrift = Math.abs(this._responseTime - dateValue);
            if (clockDrift < maxClockDrift) {
                return dateValue;
            }
        }
        return this._responseTime;
    }

    /**
     * Value of the Age header, in seconds, updated for the current time.
     * May be fractional.
     *
     * @return Number
     */
    age() {
        let age = Math.max(0, (this._responseTime - this.date()) / 1000);
        if (this._resHeaders.age) {
            let ageValue = this._ageValue();
            if (ageValue > age) age = ageValue;
        }

        const residentTime = (this.now() - this._responseTime) / 1000;
        return age + residentTime;
    }

    _ageValue() {
        const ageValue = parseInt(this._resHeaders.age);
        return isFinite(ageValue) ? ageValue : 0;
    }

    /**
     * Value of applicable max-age (or heuristic equivalent) in seconds. This counts since response's `Date`.
     *
     * For an up-to-date value, see `timeToLive()`.
     *
     * @return Number
     */
    maxAge() {
        if (!this.storable() || this._rescc['no-cache']) {
            return 0;
        }

        // Shared responses with cookies are cacheable according to the RFC, but IMHO it'd be unwise to do so by default
        // so this implementation requires explicit opt-in via public header
        if (
            this._isShared &&
            (this._resHeaders['set-cookie'] &&
                !this._rescc.public &&
                !this._rescc.immutable)
        ) {
            return 0;
        }

        if (this._resHeaders.vary === '*') {
            return 0;
        }

        if (this._isShared) {
            if (this._rescc['proxy-revalidate']) {
                return 0;
            }
            // if a response includes the s-maxage directive, a shared cache recipient MUST ignore the Expires field.
            if (this._rescc['s-maxage']) {
                return parseInt(this._rescc['s-maxage'], 10);
            }
        }

        // If a response includes a Cache-Control field with the max-age directive, a recipient MUST ignore the Expires field.
        if (this._rescc['max-age']) {
            return parseInt(this._rescc['max-age'], 10);
        }

        const defaultMinTtl = this._rescc.immutable ? this._immutableMinTtl : 0;

        const dateValue = this._serverDate();
        if (this._resHeaders.expires) {
            const expires = Date.parse(this._resHeaders.expires);
            // A cache recipient MUST interpret invalid date formats, especially the value "0", as representing a time in the past (i.e., "already expired").
            if (Number.isNaN(expires) || expires < dateValue) {
                return 0;
            }
            return Math.max(defaultMinTtl, (expires - dateValue) / 1000);
        }

        if (this._resHeaders['last-modified']) {
            const lastModified = Date.parse(this._resHeaders['last-modified']);
            if (isFinite(lastModified) && dateValue > lastModified) {
                return Math.max(
                    defaultMinTtl,
                    ((dateValue - lastModified) / 1000) * this._cacheHeuristic
                );
            }
        }

        return defaultMinTtl;
    }

    timeToLive() {
        return Math.max(0, this.maxAge() - this.age()) * 1000;
    }

    stale() {
        return this.maxAge() <= this.age();
    }

    static fromObject(obj) {
        return new this(undefined, undefined, { _fromObject: obj });
    }

    _fromObject(obj) {
        if (this._responseTime) throw Error('Reinitialized');
        if (!obj || obj.v !== 1) throw Error('Invalid serialization');

        this._responseTime = obj.t;
        this._isShared = obj.sh;
        this._cacheHeuristic = obj.ch;
        this._immutableMinTtl =
            obj.imm !== undefined ? obj.imm : 24 * 3600 * 1000;
        this._status = obj.st;
        this._resHeaders = obj.resh;
        this._rescc = obj.rescc;
        this._method = obj.m;
        this._url = obj.u;
        this._host = obj.h;
        this._noAuthorization = obj.a;
        this._reqHeaders = obj.reqh;
        this._reqcc = obj.reqcc;
    }

    toObject() {
        return {
            v: 1,
            t: this._responseTime,
            sh: this._isShared,
            ch: this._cacheHeuristic,
            imm: this._immutableMinTtl,
            st: this._status,
            resh: this._resHeaders,
            rescc: this._rescc,
            m: this._method,
            u: this._url,
            h: this._host,
            a: this._noAuthorization,
            reqh: this._reqHeaders,
            reqcc: this._reqcc,
        };
    }

    /**
     * Headers for sending to the origin server to revalidate stale response.
     * Allows server to return 304 to allow reuse of the previous response.
     *
     * Hop by hop headers are always stripped.
     * Revalidation headers may be added or removed, depending on request.
     */
    revalidationHeaders(incomingReq) {
        this._assertRequestHasHeaders(incomingReq);
        const headers = this._copyWithoutHopByHopHeaders(incomingReq.headers);

        // This implementation does not understand range requests
        delete headers['if-range'];

        if (!this._requestMatches(incomingReq, true) || !this.storable()) {
            // revalidation allowed via HEAD
            // not for the same resource, or wasn't allowed to be cached anyway
            delete headers['if-none-match'];
            delete headers['if-modified-since'];
            return headers;
        }

        /* MUST send that entity-tag in any cache validation request (using If-Match or If-None-Match) if an entity-tag has been provided by the origin server. */
        if (this._resHeaders.etag) {
            headers['if-none-match'] = headers['if-none-match']
                ? `${headers['if-none-match']}, ${this._resHeaders.etag}`
                : this._resHeaders.etag;
        }

        // Clients MAY issue simple (non-subrange) GET requests with either weak validators or strong validators. Clients MUST NOT use weak validators in other forms of request.
        const forbidsWeakValidators =
            headers['accept-ranges'] ||
            headers['if-match'] ||
            headers['if-unmodified-since'] ||
            (this._method && this._method != 'GET');

        /* SHOULD send the Last-Modified value in non-subrange cache validation requests (using If-Modified-Since) if only a Last-Modified value has been provided by the origin server.
        Note: This implementation does not understand partial responses (206) */
        if (forbidsWeakValidators) {
            delete headers['if-modified-since'];

            if (headers['if-none-match']) {
                const etags = headers['if-none-match']
                    .split(/,/)
                    .filter(etag => {
                        return !/^\s*W\//.test(etag);
                    });
                if (!etags.length) {
                    delete headers['if-none-match'];
                } else {
                    headers['if-none-match'] = etags.join(',').trim();
                }
            }
        } else if (
            this._resHeaders['last-modified'] &&
            !headers['if-modified-since']
        ) {
            headers['if-modified-since'] = this._resHeaders['last-modified'];
        }

        return headers;
    }

    /**
     * Creates new CachePolicy with information combined from the previews response,
     * and the new revalidation response.
     *
     * Returns {policy, modified} where modified is a boolean indicating
     * whether the response body has been modified, and old cached body can't be used.
     *
     * @return {Object} {policy: CachePolicy, modified: Boolean}
     */
    revalidatedPolicy(request, response) {
        this._assertRequestHasHeaders(request);
        if (!response || !response.headers) {
            throw Error('Response headers missing');
        }

        // These aren't going to be supported exactly, since one CachePolicy object
        // doesn't know about all the other cached objects.
        let matches = false;
        if (response.status !== undefined && response.status != 304) {
            matches = false;
        } else if (
            response.headers.etag &&
            !/^\s*W\//.test(response.headers.etag)
        ) {
            // "All of the stored responses with the same strong validator are selected.
            // If none of the stored responses contain the same strong validator,
            // then the cache MUST NOT use the new response to update any stored responses."
            matches =
                this._resHeaders.etag &&
                this._resHeaders.etag.replace(/^\s*W\//, '') ===
                    response.headers.etag;
        } else if (this._resHeaders.etag && response.headers.etag) {
            // "If the new response contains a weak validator and that validator corresponds
            // to one of the cache's stored responses,
            // then the most recent of those matching stored responses is selected for update."
            matches =
                this._resHeaders.etag.replace(/^\s*W\//, '') ===
                response.headers.etag.replace(/^\s*W\//, '');
        } else if (this._resHeaders['last-modified']) {
            matches =
                this._resHeaders['last-modified'] ===
                response.headers['last-modified'];
        } else {
            // If the new response does not include any form of validator (such as in the case where
            // a client generates an If-Modified-Since request from a source other than the Last-Modified
            // response header field), and there is only one stored response, and that stored response also
            // lacks a validator, then that stored response is selected for update.
            if (
                !this._resHeaders.etag &&
                !this._resHeaders['last-modified'] &&
                !response.headers.etag &&
                !response.headers['last-modified']
            ) {
                matches = true;
            }
        }

        if (!matches) {
            return {
                policy: new this.constructor(request, response),
                // Client receiving 304 without body, even if it's invalid/mismatched has no option
                // but to reuse a cached body. We don't have a good way to tell clients to do
                // error recovery in such case.
                modified: response.status != 304,
                matches: false,
            };
        }

        // use other header fields provided in the 304 (Not Modified) response to replace all instances
        // of the corresponding header fields in the stored response.
        const headers = {};
        for (const k in this._resHeaders) {
            headers[k] =
                k in response.headers && !excludedFromRevalidationUpdate[k]
                    ? response.headers[k]
                    : this._resHeaders[k];
        }

        const newResponse = Object.assign({}, response, {
            status: this._status,
            method: this._method,
            headers,
        });
        return {
            policy: new this.constructor(request, newResponse, {
                shared: this._isShared,
                cacheHeuristic: this._cacheHeuristic,
                immutableMinTimeToLive: this._immutableMinTtl,
                trustServerDate: this._trustServerDate,
            }),
            modified: false,
            matches: true,
        };
    }
};


/***/ }),

/***/ 165:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(__webpack_require__(946));
__webpack_require__(175);
const indent_string_1 = __importDefault(__webpack_require__(257));
const common_1 = __webpack_require__(664);
const deep_extend_1 = __webpack_require__(608);
const deep_set_1 = __webpack_require__(721);
const filterObject_1 = __webpack_require__(344);
const omit_1 = __webpack_require__(478);
const printJsonErrors_1 = __webpack_require__(959);
const printStack_1 = __webpack_require__(41);
const stringifyObject_1 = __importDefault(__webpack_require__(212));
const visit_1 = __webpack_require__(79);
const tab = 2;
class Document {
    constructor(type, children) {
        this.type = type;
        this.children = children;
        this.printFieldError = ({ error, path }) => {
            if (error.type === 'emptySelect') {
                return `The ${chalk_1.default.redBright('`select`')} statement for type ${chalk_1.default.bold(common_1.getOutputTypeName(error.field.outputType.type))} must not be empty. Available options are listed in ${chalk_1.default.greenBright.dim('green')}.`;
            }
            if (error.type === 'emptyInclude') {
                return `The ${chalk_1.default.redBright('`include`')} statement for type ${chalk_1.default.bold(common_1.getOutputTypeName(error.field.outputType.type))} must not be empty. Available options are listed in ${chalk_1.default.greenBright.dim('green')}.`;
            }
            if (error.type === 'noTrueSelect') {
                return `The ${chalk_1.default.redBright('`select`')} statement for type ${chalk_1.default.bold(common_1.getOutputTypeName(error.field.outputType.type))} needs ${chalk_1.default.bold('at least one truthy value')}. Available options are listed in ${chalk_1.default.greenBright.dim('green')}.`;
            }
            if (error.type === 'includeAndSelect') {
                // return `The ${chalk.redBright('`select`')} statement for type ${chalk.bold(
                //   getOutputTypeName(error.field.outputType.type),
                // )} needs ${chalk.bold('at least one truthy value')}. Available options are listed in ${chalk.greenBright.dim(
                //   'green',
                // )}.`
                return `Please ${chalk_1.default.bold('either')} use ${chalk_1.default.greenBright('`include`')} or ${chalk_1.default.greenBright('`select`')}, but ${chalk_1.default.redBright('not both')} at the same time.`;
            }
            if (error.type === 'invalidFieldName') {
                const statement = error.isInclude ? 'include' : 'select';
                const wording = error.isIncludeScalar ? 'Invalid scalar' : 'Unknown';
                let str = `${wording} field ${chalk_1.default.redBright(`\`${error.providedName}\``)} for ${chalk_1.default.bold(statement)} statement on model ${chalk_1.default.bold.white(error.modelName)}. Available options are listed in ${chalk_1.default.greenBright.dim('green')}.`;
                if (error.didYouMean) {
                    str += ` Did you mean ${chalk_1.default.greenBright(`\`${error.didYouMean}\``)}?`;
                }
                if (error.isIncludeScalar) {
                    str += `\nNote, that ${chalk_1.default.bold('include')} statements only accept relation fields.`;
                }
                return str;
            }
            if (error.type === 'invalidFieldType') {
                const str = `Invalid value ${chalk_1.default.redBright(`${stringifyObject_1.default(error.providedValue)}`)} of type ${chalk_1.default.redBright(common_1.getGraphQLType(error.providedValue, undefined))} for field ${chalk_1.default.bold(`${error.fieldName}`)} on model ${chalk_1.default.bold.white(error.modelName)}. Expected either ${chalk_1.default.greenBright('true')} or ${chalk_1.default.greenBright('false')}.`;
                return str;
            }
        };
        this.printArgError = ({ error, path }, hasMissingItems) => {
            if (error.type === 'invalidName') {
                let str = `Unknown arg ${chalk_1.default.redBright(`\`${error.providedName}\``)} in ${chalk_1.default.bold(path.join('.'))} for type ${chalk_1.default.bold(error.outputType ? error.outputType.name : common_1.getInputTypeName(error.originalType))}.`;
                if (error.didYouMeanField) {
                    str += `\n→ Did you forget to wrap it with \`${chalk_1.default.greenBright('select')}\`? ${chalk_1.default.dim('e.g. ' + chalk_1.default.greenBright(`{ select: { ${error.providedName}: ${error.providedValue} } }`))}`;
                }
                else if (error.didYouMeanArg) {
                    str += ` Did you mean \`${chalk_1.default.greenBright(error.didYouMeanArg)}\`?`;
                    if (!hasMissingItems) {
                        str += ` ${chalk_1.default.dim('Available args:')}\n` + common_1.stringifyInputType(error.originalType, true);
                    }
                }
                else {
                    if (error.originalType.fields.length === 0) {
                        str += ` The field ${chalk_1.default.bold(error.originalType.name)} has no arguments.`;
                    }
                    else if (!hasMissingItems) {
                        str += ` Available args:\n\n` + common_1.stringifyInputType(error.originalType, true);
                    }
                }
                return str;
            }
            if (error.type === 'invalidType') {
                let valueStr = stringifyObject_1.default(error.providedValue, { indent: '  ' });
                const multilineValue = valueStr.split('\n').length > 1;
                if (multilineValue) {
                    valueStr = `\n${valueStr}\n`;
                }
                // TODO: we don't yet support enums in a union with a non enum. This is mostly due to not implemented error handling
                // at this code part.
                if (error.requiredType.bestFittingType.kind === 'enum') {
                    return `Argument ${chalk_1.default.bold(error.argName)}: Provided value ${chalk_1.default.redBright(valueStr)}${multilineValue ? '' : ' '}of type ${chalk_1.default.redBright(common_1.getGraphQLType(error.providedValue))} on ${chalk_1.default.bold(`photon.${this.children[0].name}`)} is not a ${chalk_1.default.greenBright(common_1.wrapWithList(common_1.stringifyGraphQLType(error.requiredType.bestFittingType.kind), error.requiredType.bestFittingType.isList))}.
→ Possible values: ${error.requiredType.bestFittingType.type.values
                        .map(v => chalk_1.default.greenBright(`${common_1.stringifyGraphQLType(error.requiredType.bestFittingType.type)}.${v}`))
                        .join(', ')}`;
                }
                let typeStr = '.';
                if (isInputArgType(error.requiredType.bestFittingType.type)) {
                    typeStr = ':\n' + common_1.stringifyInputType(error.requiredType.bestFittingType.type);
                }
                let expected = `${error.requiredType.inputType
                    .map(t => chalk_1.default.greenBright(common_1.wrapWithList(common_1.stringifyGraphQLType(t.type), error.requiredType.bestFittingType.isList)))
                    .join(' or ')}${typeStr}`;
                const inputType = (error.requiredType.inputType.length === 2 && error.requiredType.inputType.find(t => isInputArgType(t.type))) ||
                    null;
                if (inputType) {
                    expected += `\n` + common_1.stringifyInputType(inputType.type, true);
                }
                return `Argument ${chalk_1.default.bold(error.argName)}: Got invalid value ${chalk_1.default.redBright(valueStr)}${multilineValue ? '' : ' '}on ${chalk_1.default.bold(`photon.${this.children[0].name}`)}. Provided ${chalk_1.default.redBright(common_1.getGraphQLType(error.providedValue))}, expected ${expected}`;
            }
            if (error.type === 'missingArg') {
                return `Argument ${chalk_1.default.greenBright(error.missingName)} for ${chalk_1.default.bold(`${path.join('.')}`)} is missing.`;
            }
            if (error.type === 'atLeastOne') {
                return `Argument ${chalk_1.default.bold(path.join('.'))} of type ${chalk_1.default.bold(error.inputType.name)} needs ${chalk_1.default.greenBright('at least one')} argument. Available args are listed in ${chalk_1.default.dim.green('green')}.`;
            }
            if (error.type === 'atMostOne') {
                return `Argument ${chalk_1.default.bold(path.join('.'))} of type ${chalk_1.default.bold(error.inputType.name)} needs ${chalk_1.default.greenBright('exactly one')} argument, but you provided ${error.providedKeys
                    .map(key => chalk_1.default.redBright(key))
                    .join(' and ')}. Please choose one. ${chalk_1.default.dim('Available args:')} \n${common_1.stringifyInputType(error.inputType, true)}`;
            }
        };
        this.type = type;
        this.children = children;
    }
    toString() {
        return `${this.type} {
${indent_string_1.default(this.children.map(String).join('\n'), tab)}
}`;
    }
    validate(select, isTopLevelQuery = false, originalMethod) {
        const invalidChildren = this.children.filter(child => child.hasInvalidChild || child.hasInvalidArg);
        if (invalidChildren.length === 0) {
            return;
        }
        const fieldErrors = [];
        const argErrors = [];
        const prefix = select && select.select ? 'select' : select.include ? 'include' : undefined;
        for (const child of invalidChildren) {
            const errors = child.collectErrors(prefix);
            fieldErrors.push(...errors.fieldErrors.map(e => (Object.assign({}, e, { path: isTopLevelQuery ? e.path : e.path.slice(1) }))));
            argErrors.push(...errors.argErrors.map(e => (Object.assign({}, e, { path: isTopLevelQuery ? e.path : e.path.slice(1) }))));
        }
        const topLevelQueryName = this.children[0].name;
        const queryName = isTopLevelQuery ? this.type : topLevelQueryName;
        const keyPaths = [];
        const valuePaths = [];
        const missingItems = [];
        for (const fieldError of fieldErrors) {
            const path = this.normalizePath(fieldError.path, select).join('.');
            if (fieldError.error.type === 'invalidFieldName') {
                keyPaths.push(path);
                const fieldType = fieldError.error.outputType;
                const { isInclude } = fieldError.error;
                fieldType.fields
                    .filter(field => (isInclude ? field.outputType.kind === 'object' : true))
                    .forEach(field => {
                    const splittedPath = path.split('.');
                    missingItems.push({
                        path: `${splittedPath.slice(0, splittedPath.length - 1).join('.')}.${field.name}`,
                        type: 'true',
                        isRequired: false,
                    });
                });
            }
            else if (fieldError.error.type === 'includeAndSelect') {
                keyPaths.push('select');
                keyPaths.push('include');
            }
            else {
                valuePaths.push(path);
            }
            if (fieldError.error.type === 'emptySelect' ||
                fieldError.error.type === 'noTrueSelect' ||
                fieldError.error.type === 'emptyInclude') {
                const selectPathArray = this.normalizePath(fieldError.path, select);
                const selectPath = selectPathArray.slice(0, selectPathArray.length - 1).join('.');
                const fieldType = fieldError.error.field.outputType.type;
                fieldType.fields
                    .filter(field => (fieldError.error.type === 'emptyInclude' ? field.outputType.kind === 'object' : true))
                    .forEach(field => {
                    missingItems.push({
                        path: `${selectPath}.${field.name}`,
                        type: 'true',
                        isRequired: false,
                    });
                });
            }
        }
        // an arg error can either be an invalid key or invalid value
        for (const argError of argErrors) {
            const path = this.normalizePath(argError.path, select).join('.');
            if (argError.error.type === 'invalidName') {
                keyPaths.push(path);
            }
            else if (argError.error.type !== 'missingArg' && argError.error.type !== 'atLeastOne') {
                valuePaths.push(path);
            }
            else if (argError.error.type === 'missingArg') {
                const type = argError.error.missingType.length === 1
                    ? argError.error.missingType[0].type
                    : argError.error.missingType.map(t => common_1.getInputTypeName(t.type)).join(' | ');
                missingItems.push({
                    path,
                    type: common_1.inputTypeToJson(type, true, path.split('where.').length === 2),
                    isRequired: argError.error.missingType[0].isRequired,
                });
            }
        }
        function renderN(n, max) {
            const wantedLetters = String(max).length;
            const hasLetters = String(n).length;
            if (hasLetters >= wantedLetters) {
                return String(n);
            }
            return String(' '.repeat(wantedLetters - hasLetters) + n);
        }
        const renderErrorStr = (callsite) => {
            const { stack, indent: indentValue, afterLines } = printStack_1.printStack({
                callsite,
                originalMethod: originalMethod || queryName,
            });
            const hasRequiredMissingArgsErrors = argErrors.some(e => e.error.type === 'missingArg' && e.error.missingType[0].isRequired);
            const hasOptionalMissingArgsErrors = argErrors.some(e => e.error.type === 'missingArg' && !e.error.missingType[0].isRequired);
            const hasMissingArgsErrors = hasOptionalMissingArgsErrors || hasRequiredMissingArgsErrors;
            let missingArgsLegend = '';
            if (hasRequiredMissingArgsErrors) {
                missingArgsLegend += `\n${chalk_1.default.dim('Note: Lines with ')}${chalk_1.default.reset.greenBright('+')} ${chalk_1.default.dim('are required')}`;
            }
            if (hasOptionalMissingArgsErrors) {
                if (missingArgsLegend.length === 0) {
                    missingArgsLegend = '\n';
                }
                if (hasRequiredMissingArgsErrors) {
                    missingArgsLegend += chalk_1.default.dim(`, lines with ${chalk_1.default.green('?')} are optional`);
                }
                else {
                    missingArgsLegend += chalk_1.default.dim(`Note: Lines with ${chalk_1.default.green('?')} are optional`);
                }
                missingArgsLegend += chalk_1.default.dim('.');
            }
            const errorStr = `${stack}${indent_string_1.default(printJsonErrors_1.printJsonWithErrors(isTopLevelQuery ? { [topLevelQueryName]: select } : select, keyPaths, valuePaths, missingItems), indentValue).slice(indentValue)}${chalk_1.default.dim(afterLines)}

${argErrors
                .filter(e => e.error.type !== 'missingArg' || e.error.missingType[0].isRequired)
                .map(e => this.printArgError(e, hasMissingArgsErrors))
                .join('\n')}
${fieldErrors.map(this.printFieldError).join('\n')}${missingArgsLegend}\n`;
            return errorStr;
        };
        const error = new PhotonError(renderErrorStr());
        // @ts-ignore
        if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
            Object.defineProperty(error, 'render', {
                get: () => renderErrorStr,
                enumerable: false,
            });
        }
        throw error;
    }
    /**
     * As we're allowing both single objects and array of objects for list inputs, we need to remove incorrect
     * zero indexes from the path
     * @param inputPath e.g. ['where', 'AND', 0, 'id']
     * @param select select object
     */
    normalizePath(inputPath, select) {
        const path = inputPath.slice();
        const newPath = [];
        let key;
        let pointer = select;
        // tslint:disable-next-line:no-conditional-assignment
        while ((key = path.shift()) !== undefined) {
            if (!Array.isArray(pointer) && key === 0) {
                continue;
            }
            if (key === 'select') {
                // TODO: Remove this logic! It shouldn't be needed
                if (!pointer[key]) {
                    pointer = pointer.include;
                }
                else {
                    pointer = pointer[key];
                }
            }
            else {
                pointer = pointer[key];
            }
            newPath.push(key);
        }
        return newPath;
    }
}
exports.Document = Document;
class PhotonError extends Error {
}
class Field {
    constructor({ name, args, children, error }) {
        this.name = name;
        this.args = args;
        this.children = children;
        this.error = error;
        this.hasInvalidChild = children
            ? children.some(child => Boolean(child.error || child.hasInvalidArg || child.hasInvalidChild))
            : false;
        this.hasInvalidArg = args ? args.hasInvalidArg : false;
    }
    toString() {
        let str = this.name;
        if (this.error) {
            return str + ' # INVALID_FIELD';
        }
        if (this.args && this.args.args && this.args.args.length > 0) {
            if (this.args.args.length === 1) {
                str += `(${this.args.toString()})`;
            }
            else {
                str += `(\n${indent_string_1.default(this.args.toString(), tab)}\n)`;
            }
        }
        if (this.children) {
            str += ` {
${indent_string_1.default(this.children.map(String).join('\n'), tab)}
}`;
        }
        return str;
    }
    collectErrors(prefix = 'select') {
        const fieldErrors = [];
        const argErrors = [];
        if (this.error) {
            fieldErrors.push({
                path: [this.name],
                error: this.error,
            });
        }
        // get all errors from fields
        if (this.children) {
            for (const child of this.children) {
                const errors = child.collectErrors(prefix);
                // Field -> Field always goes through a 'select'
                fieldErrors.push(...errors.fieldErrors.map(e => (Object.assign({}, e, { path: [this.name, prefix, ...e.path] }))));
                argErrors.push(...errors.argErrors.map(e => (Object.assign({}, e, { path: [this.name, prefix, ...e.path] }))));
            }
        }
        // get all errors from args
        if (this.args) {
            argErrors.push(...this.args.collectErrors().map(e => (Object.assign({}, e, { path: [this.name, ...e.path] }))));
        }
        return {
            fieldErrors,
            argErrors,
        };
    }
}
exports.Field = Field;
class Args {
    constructor(args = []) {
        this.args = args;
        this.hasInvalidArg = args ? args.some(arg => Boolean(arg.hasError)) : false;
    }
    toString() {
        if (this.args.length === 0) {
            return '';
        }
        return `${this.args
            .map(arg => arg.toString())
            .filter(a => a)
            .join('\n')}`;
    }
    collectErrors() {
        if (!this.hasInvalidArg) {
            return [];
        }
        return this.args.flatMap(arg => arg.collectErrors());
    }
}
exports.Args = Args;
/**
 * Custom stringify which turns undefined into null - needed by GraphQL
 * @param obj to stringify
 * @param _
 * @param tab
 */
function stringify(obj, _, tabbing, isEnum) {
    if (obj === undefined) {
        return null;
    }
    if (isEnum && typeof obj === 'string') {
        return obj;
    }
    if (isEnum && Array.isArray(obj)) {
        return `[${obj.join(', ')}]`;
    }
    return JSON.stringify(obj, _, tabbing);
}
class Arg {
    constructor({ key, value, argType, isEnum = false, error, schemaArg }) {
        this.key = key;
        this.value = value;
        this.argType = argType;
        this.isEnum = isEnum;
        this.error = error;
        this.schemaArg = schemaArg;
        this.hasError =
            Boolean(error) ||
                (value instanceof Args ? value.hasInvalidArg : false) ||
                (Array.isArray(value) && value.some(v => (v instanceof Args ? v.hasInvalidArg : false)));
    }
    _toString(value, key) {
        if (typeof value === 'undefined') {
            return undefined;
        }
        if (value instanceof Args) {
            return `${key}: {
${indent_string_1.default(value.toString(), 2)}
}`;
        }
        if (Array.isArray(value)) {
            const isScalar = !value.some(v => typeof v === 'object');
            return `${key}: [${isScalar ? '' : '\n'}${indent_string_1.default(value
                .map(nestedValue => {
                if (nestedValue instanceof Args) {
                    return `{\n${indent_string_1.default(nestedValue.toString(), tab)}\n}`;
                }
                return stringify(nestedValue, null, 2, this.isEnum);
            })
                .join(`,${isScalar ? ' ' : '\n'}`), isScalar ? 0 : tab)}${isScalar ? '' : '\n'}]`;
        }
        return `${key}: ${stringify(value, null, 2, this.isEnum)}`;
    }
    toString() {
        return this._toString(this.value, this.key);
    }
    collectErrors() {
        if (!this.hasError) {
            return [];
        }
        const errors = [];
        // add the own arg
        if (this.error) {
            errors.push({
                error: this.error,
                path: [this.key],
            });
        }
        if (Array.isArray(this.value)) {
            errors.push(...this.value.flatMap((val, index) => {
                if (!val.collectErrors) {
                    return [];
                }
                return val.collectErrors().map(e => {
                    return Object.assign({}, e, { path: [this.key, index, ...e.path] });
                });
            }));
        }
        // collect errors of children if there are any
        if (this.value instanceof Args) {
            errors.push(...this.value.collectErrors().map(e => (Object.assign({}, e, { path: [this.key, ...e.path] }))));
        }
        return errors;
    }
}
exports.Arg = Arg;
function makeDocument({ dmmf, rootTypeName, rootField, select }) {
    const rootType = rootTypeName === 'query' ? dmmf.queryType : dmmf.mutationType;
    // Create a fake toplevel field for easier implementation
    const fakeRootField = {
        args: [],
        outputType: {
            isList: false,
            isRequired: true,
            type: rootType,
            kind: 'object',
        },
        name: rootTypeName,
    };
    const children = selectionToFields(dmmf, { [rootField]: select }, fakeRootField, [rootTypeName]);
    return new Document(rootTypeName, children);
}
exports.makeDocument = makeDocument;
function transformDocument(document) {
    function transformWhereArgs(args) {
        return new Args(args.args.flatMap(ar => {
            if (isArgsArray(ar.value)) {
                // long variable name to prevent shadowing
                const value = ar.value.map(argsInstance => {
                    return transformWhereArgs(argsInstance);
                });
                return new Arg(Object.assign({}, ar, { value }));
            }
            else if (ar.value instanceof Args) {
                if (ar.schemaArg && !ar.schemaArg.isRelationFilter) {
                    return ar.value.args.map(a => new Arg({
                        key: getFilterArgName(ar.key, a.key),
                        value: a.value,
                        /**
                         * This is an ugly hack. It assumes, that deeploy somewhere must be a valid inputType for
                         * this argument
                         */
                        argType: deep_set_1.deepGet(ar, ['value', 'args', '0', 'argType']),
                        schemaArg: ar.schemaArg,
                    }));
                }
            }
            return [ar];
        }));
    }
    function transformOrderArg(arg) {
        if (arg.value instanceof Args) {
            const orderArg = arg.value.args[0];
            return new Arg(Object.assign({}, arg, { isEnum: true, value: `${orderArg.key}_${orderArg.value.toString().toUpperCase()}` }));
        }
        return arg;
    }
    return visit_1.visit(document, {
        Arg: {
            enter(arg) {
                const { argType, schemaArg } = arg;
                if (!argType) {
                    return undefined;
                }
                if (isInputArgType(argType)) {
                    if (argType.isOrderType) {
                        return transformOrderArg(arg);
                    }
                    if (argType.isWhereType && schemaArg) {
                        let value;
                        if (isArgsArray(arg.value)) {
                            value = arg.value.map(val => transformWhereArgs(val));
                        }
                        else if (arg.value instanceof Args) {
                            value = transformWhereArgs(arg.value);
                        }
                        return new Arg(Object.assign({}, arg, { value }));
                    }
                }
                return undefined;
            },
        },
    });
}
exports.transformDocument = transformDocument;
function isArgsArray(input) {
    if (Array.isArray(input)) {
        return input.every(arg => arg instanceof Args);
    }
    return false;
}
function getFilterArgName(arg, filter) {
    if (filter === 'equals') {
        return arg;
    }
    if (filter === 'notIn') {
        return `${arg}_not_in`;
    }
    return `${arg}_${filter}`;
}
function selectionToFields(dmmf, selection, schemaField, path) {
    const outputType = schemaField.outputType.type;
    return Object.entries(selection).reduce((acc, [name, value]) => {
        const field = outputType.fields.find(f => f.name === name);
        if (!field) {
            // if the field name is incorrect, we ignore the args and child fields altogether
            acc.push(new Field({
                name,
                children: [],
                // @ts-ignore
                error: {
                    type: 'invalidFieldName',
                    modelName: outputType.name,
                    providedName: name,
                    didYouMean: common_1.getSuggestion(name, outputType.fields.map(f => f.name)),
                    outputType,
                },
            }));
            return acc;
        }
        if (typeof value !== 'boolean' && field.outputType.kind === 'scalar') {
            acc.push(new Field({
                name,
                children: [],
                error: {
                    type: 'invalidFieldType',
                    modelName: outputType.name,
                    fieldName: name,
                    providedValue: value,
                },
            }));
            return acc;
        }
        if (value === false) {
            return acc;
        }
        const transformedField = {
            name: field.name,
            fields: field.args,
        };
        const argsWithoutIncludeAndSelect = typeof value === 'object' ? omit_1.omit(value, ['include', 'select']) : undefined;
        const args = argsWithoutIncludeAndSelect
            ? objectToArgs(argsWithoutIncludeAndSelect, transformedField, [], typeof field === 'string' ? undefined : field.outputType.type)
            : undefined;
        const isRelation = field.outputType.kind === 'object';
        // TODO: use default selection for `include` again
        // check for empty select
        if (value) {
            if (value.select && value.include) {
                acc.push(new Field({
                    name,
                    children: [
                        new Field({
                            name: 'include',
                            args: new Args(),
                            error: {
                                type: 'includeAndSelect',
                                field,
                            },
                        }),
                    ],
                }));
            }
            else if (value.include) {
                const keys = Object.keys(value.include);
                if (keys.length === 0) {
                    acc.push(new Field({
                        name,
                        children: [
                            new Field({
                                name: 'include',
                                args: new Args(),
                                error: {
                                    type: 'emptyInclude',
                                    field,
                                },
                            }),
                        ],
                    }));
                    return acc;
                }
                // TODO: unify with select validation logic
                /**
                 * Error handling for `include` statements
                 */
                if (field.outputType.kind === 'object') {
                    const fieldOutputType = field.outputType.type;
                    const allowedKeys = fieldOutputType.fields.filter(f => f.outputType.kind === 'object').map(f => f.name);
                    const invalidKeys = keys.filter(key => !allowedKeys.includes(key));
                    if (invalidKeys.length > 0) {
                        acc.push(...invalidKeys.map(invalidKey => new Field({
                            name: invalidKey,
                            children: [
                                new Field({
                                    name: invalidKey,
                                    args: new Args(),
                                    error: {
                                        type: 'invalidFieldName',
                                        modelName: fieldOutputType.name,
                                        outputType: fieldOutputType,
                                        providedName: invalidKey,
                                        didYouMean: common_1.getSuggestion(invalidKey, allowedKeys) || undefined,
                                        isInclude: true,
                                        isIncludeScalar: fieldOutputType.fields.some(f => f.name === invalidKey),
                                    },
                                }),
                            ],
                        })));
                        return acc;
                    }
                }
            }
            else if (value.select) {
                const values = Object.values(value.select);
                if (values.length === 0) {
                    acc.push(new Field({
                        name,
                        children: [
                            new Field({
                                name: 'select',
                                args: new Args(),
                                error: {
                                    type: 'emptySelect',
                                    field,
                                },
                            }),
                        ],
                    }));
                    return acc;
                }
                // check if there is at least one truthy value
                const truthyValues = values.filter(v => v);
                if (truthyValues.length === 0) {
                    acc.push(new Field({
                        name,
                        children: [
                            new Field({
                                name: 'select',
                                args: new Args(),
                                error: {
                                    type: 'noTrueSelect',
                                    field,
                                },
                            }),
                        ],
                    }));
                    return acc;
                }
            }
        }
        // either use select or default selection, but not both at the same time
        const defaultSelection = isRelation ? getDefaultSelection(field.outputType.type) : null;
        let select = defaultSelection;
        if (value) {
            if (value.select) {
                select = value.select;
            }
            else if (value.include) {
                select = deep_extend_1.deepExtend(defaultSelection, value.include);
            }
        }
        const children = select !== false && isRelation ? selectionToFields(dmmf, select, field, [...path, name]) : undefined;
        acc.push(new Field({ name, args, children }));
        return acc;
    }, []);
}
exports.selectionToFields = selectionToFields;
function getDefaultSelection(outputType) {
    return outputType.fields.reduce((acc, f) => {
        if (f.outputType.kind === 'scalar' || f.outputType.kind === 'enum') {
            acc[f.name] = true;
        }
        else {
            // otherwise field is a relation. Only continue if it's an embedded type
            // as normal types don't end up in the default selection
            if (f.outputType.type.isEmbedded) {
                acc[f.name] = { select: getDefaultSelection(f.outputType.type) };
            }
        }
        return acc;
    }, {});
}
function getInvalidTypeArg(key, value, arg, bestFittingType) {
    const arrg = new Arg({
        key,
        value,
        isEnum: bestFittingType.kind === 'enum',
        argType: bestFittingType.type,
        error: {
            type: 'invalidType',
            providedValue: value,
            argName: key,
            requiredType: {
                inputType: arg.inputType,
                bestFittingType,
            },
        },
    });
    return arrg;
}
function hasCorrectScalarType(value, arg, inputType) {
    const { type } = inputType;
    const isList = arg.inputType[0].isList;
    const expectedType = common_1.wrapWithList(common_1.stringifyGraphQLType(type), isList);
    const graphQLType = common_1.getGraphQLType(value, type);
    if (isList && graphQLType === 'List<>') {
        return true;
    }
    // DateTime is a subset of string
    if (graphQLType === 'DateTime' && expectedType === 'String') {
        return true;
    }
    if (graphQLType === 'List<DateTime>' && expectedType === 'List<String>') {
        return true;
    }
    // UUID is a subset of string
    if (graphQLType === 'UUID' && expectedType === 'String') {
        return true;
    }
    if (graphQLType === 'List<UUID>' && expectedType === 'List<String>') {
        return true;
    }
    if (graphQLType === 'String' && expectedType === 'ID') {
        return true;
    }
    if (graphQLType === 'List<String>' && expectedType === 'List<ID>') {
        return true;
    }
    // Int is a subset of Float
    if (graphQLType === 'Int' && expectedType === 'Float') {
        return true;
    }
    if (graphQLType === 'List<Int>' && expectedType === 'List<Float>') {
        return true;
    }
    // Int is a subset of Long
    if (graphQLType === 'Int' && expectedType === 'Long') {
        return true;
    }
    if (graphQLType === 'List<Int>' && expectedType === 'List<Long>') {
        return true;
    }
    if (graphQLType === expectedType) {
        return true;
    }
    if (!inputType.isRequired && value === null) {
        return true;
    }
    return false;
}
const cleanObject = obj => filterObject_1.filterObject(obj, (k, v) => v !== undefined);
function valueToArg(key, value, arg) {
    const argInputType = arg.inputType[0];
    if (typeof value === 'undefined') {
        // the arg is undefined and not required - we're fine
        if (!argInputType.isRequired) {
            return null;
        }
        // the provided value is 'undefined' but shouldn't be
        return new Arg({
            key,
            value,
            isEnum: argInputType.kind === 'enum',
            error: {
                type: 'missingArg',
                missingName: key,
                missingType: arg.inputType,
                atLeastOne: false,
                atMostOne: false,
            },
        });
    }
    // then the first
    if (!argInputType.isList) {
        const args = arg.inputType.map(t => {
            if (isInputArgType(t.type)) {
                if (typeof value !== 'object') {
                    return getInvalidTypeArg(key, value, arg, t);
                }
                else {
                    const val = cleanObject(value);
                    let error;
                    const keys = Object.keys(val || {});
                    const numKeys = keys.length;
                    if (numKeys === 0 && t.type.atLeastOne) {
                        error = {
                            type: 'atLeastOne',
                            key,
                            inputType: t.type,
                        };
                    }
                    if (numKeys > 1 && t.type.atMostOne) {
                        error = {
                            type: 'atMostOne',
                            key,
                            inputType: t.type,
                            providedKeys: keys,
                        };
                    }
                    return new Arg({
                        key,
                        value: objectToArgs(val, t.type, arg.inputType),
                        isEnum: argInputType.kind === 'enum',
                        error,
                        argType: t.type,
                        schemaArg: arg,
                    });
                }
            }
            else {
                return scalarToArg(key, value, arg, t);
            }
        });
        // is it just one possible type? Then no matter what just return that one
        if (args.length === 1) {
            return args[0];
        }
        // do we have more then one, but does it fit one of the args? Then let's just take that one arg
        const argWithoutError = args.find(a => !a.hasError);
        if (argWithoutError) {
            return argWithoutError;
        }
        const hasSameKind = (argType, val) => {
            if (val === null && (argType === 'null' || !isInputArgType(argType))) {
                return true;
            }
            return isInputArgType(argType) ? typeof val === 'object' : typeof val !== 'object';
        };
        /**
         * If there are more than 1 args, do the following:
         * First check if there are any possible arg types which at least have the
         * correct base type (scalar, null or object)
         * Take either these, or if they don't exist just again the normal args and
         * take the arg with the minimum amount of errors
         */
        if (args.length > 1) {
            const argsWithSameKind = args.filter(a => hasSameKind(a.argType, value));
            const argsToFilter = argsWithSameKind.length > 0 ? argsWithSameKind : args;
            const argWithMinimumErrors = argsToFilter.reduce((acc, curr) => {
                const numErrors = curr.collectErrors().length;
                if (numErrors < acc.numErrors) {
                    return {
                        arg: curr,
                        numErrors,
                    };
                }
                return acc;
            }, {
                arg: null,
                numErrors: Infinity,
            });
            return argWithMinimumErrors.arg;
        }
    }
    if (arg.inputType.length > 1) {
        throw new Error(`List types with union input types are not supported`);
    }
    // the provided arg should be a list, but isn't
    // that's fine for us as we can just turn this into a list with a single item
    // and GraphQL even allows this. We're going the conservative route though
    // and actually generate the [] around the value
    if (!Array.isArray(value)) {
        value = [value];
    }
    if (argInputType.kind === 'enum' || argInputType.kind === 'scalar') {
        // if no value is incorrect
        return scalarToArg(key, value, arg, argInputType);
    }
    const inputType = argInputType.type;
    const hasAtLeastOneError = inputType.atLeastOne ? value.some(v => Object.keys(cleanObject(v)).length === 0) : false;
    const err = hasAtLeastOneError
        ? {
            inputType,
            key,
            type: 'atLeastOne',
        }
        : undefined;
    return new Arg({
        key,
        value: value.map(v => {
            if (typeof v !== 'object' || !value) {
                return getInvalidTypeArg(key, v, arg, argInputType);
            }
            return objectToArgs(v, argInputType.type);
        }),
        isEnum: false,
        argType: argInputType.type,
        schemaArg: arg,
        error: err,
    });
}
function isInputArgType(argType) {
    if (typeof argType === 'string') {
        return false;
    }
    if (argType.hasOwnProperty('values')) {
        return false;
    }
    return true;
}
exports.isInputArgType = isInputArgType;
function scalarToArg(key, value, arg, inputType) {
    if (hasCorrectScalarType(value, arg, inputType)) {
        return new Arg({ key, value, isEnum: arg.inputType[0].kind === 'enum', argType: inputType.type, schemaArg: arg });
    }
    return getInvalidTypeArg(key, value, arg, inputType);
}
function objectToArgs(initialObj, inputType, possibilities, outputType) {
    // filter out undefined values and treat them if they weren't provided
    // TODO: think about using JSON.parse(JSON.stringify()) upfront instead to simplify things
    const obj = cleanObject(initialObj);
    const { fields: args } = inputType;
    const requiredArgs = args.filter(arg => arg.inputType.some(t => t.isRequired)).map(arg => [arg.name, undefined]);
    const entries = common_1.unionBy(Object.entries(obj || {}), requiredArgs, a => a[0]);
    const argsList = entries.reduce((acc, [argName, value]) => {
        const schemaArg = args.find(a => a.name === argName);
        if (!schemaArg) {
            const didYouMeanField = typeof value === 'boolean' && outputType && outputType.fields.some(f => f.name === argName) ? argName : null;
            acc.push(new Arg({
                key: argName,
                value,
                error: {
                    type: 'invalidName',
                    providedName: argName,
                    providedValue: value,
                    didYouMeanField,
                    didYouMeanArg: (!didYouMeanField && common_1.getSuggestion(argName, [...args.map(a => a.name), 'select'])) || undefined,
                    originalType: inputType,
                    possibilities,
                    outputType,
                },
            }));
            return acc;
        }
        const arg = valueToArg(argName, value, schemaArg);
        if (arg) {
            acc.push(arg);
        }
        return acc;
    }, []);
    // Also show optional neighbour args, if there is any arg missing
    if ((entries.length === 0 && inputType.atLeastOne) ||
        argsList.find(arg => arg.error && arg.error.type === 'missingArg')) {
        const optionalMissingArgs = inputType.fields.filter(arg => !entries.some(([entry]) => entry === arg.name));
        argsList.push(...optionalMissingArgs.map(arg => {
            const argInputType = arg.inputType[0];
            return new Arg({
                key: arg.name,
                value: undefined,
                isEnum: argInputType.kind === 'enum',
                error: {
                    type: 'missingArg',
                    missingName: arg.name,
                    missingType: arg.inputType,
                    atLeastOne: inputType.atLeastOne || false,
                    atMostOne: inputType.atMostOne || false,
                },
            });
        }));
    }
    return new Args(argsList);
}


/***/ }),

/***/ 173:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const url = __webpack_require__(835);
const prependHttp = __webpack_require__(128);

module.exports = (input, options) => {
	if (typeof input !== 'string') {
		throw new TypeError(`Expected \`url\` to be of type \`string\`, got \`${typeof input}\` instead.`);
	}

	const finalUrl = prependHttp(input, Object.assign({https: true}, options));
	return url.parse(finalUrl);
};


/***/ }),

/***/ 175:
/***/ (function(__unusedmodule, __unusedexports, __webpack_require__) {

"use strict";


__webpack_require__(538);

__webpack_require__(900);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 178:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Engine_1 = __webpack_require__(284);
const got_1 = __importDefault(__webpack_require__(798));
const debug_1 = __importDefault(__webpack_require__(784));
const get_platform_1 = __webpack_require__(251);
const path = __importStar(__webpack_require__(622));
const net = __importStar(__webpack_require__(631));
const fs_1 = __importDefault(__webpack_require__(747));
const chalk_1 = __importDefault(__webpack_require__(946));
const printGeneratorConfig_1 = __webpack_require__(131);
const util_1 = __webpack_require__(108);
const util_2 = __webpack_require__(669);
const events_1 = __importDefault(__webpack_require__(614));
const log_1 = __webpack_require__(324);
const child_process_1 = __webpack_require__(129);
const byline_1 = __importDefault(__webpack_require__(145));
const debug = debug_1.default('engine');
const exists = util_2.promisify(fs_1.default.exists);
/**
 * Node.js based wrapper to run the Prisma binary
 */
const knownPlatforms = [
    'native',
    'darwin',
    'linux-glibc-libssl1.0.1',
    'linux-glibc-libssl1.0.2',
    'linux-glibc-libssl1.1.0',
    'linux-musl-libssl1.1.0',
];
class NodeEngine extends Engine_1.Engine {
    constructor(_a) {
        var { cwd, datamodel, prismaPath, platform, generator, datasources } = _a, args = __rest(_a, ["cwd", "datamodel", "prismaPath", "platform", "generator", "datasources"]);
        super();
        /**
         * exiting is used to tell the .on('exit') hook, if the exit came from our script.
         * As soon as the Prisma binary returns a correct return code (like 1 or 0), we don't need this anymore
         */
        this.exiting = false;
        this.managementApiEnabled = false;
        this.ready = false;
        this.stderrLogs = '';
        this.stdoutLogs = '';
        this.fail = async (e, why) => {
            debug(e, why);
            await this.stop();
        };
        this.cwd = this.resolveCwd(cwd);
        this.debug = args.debug || false;
        this.datamodel = datamodel;
        this.prismaPath = prismaPath;
        this.platform = platform;
        this.generator = generator;
        this.datasources = datasources;
        this.logEmitter = new events_1.default();
        this.logEmitter.on('log', log => {
            if (log.level === 'error') {
                this.lastError = log;
                if (log.message === 'PANIC') {
                    this.handlePanic(log);
                }
            }
            if (this.debug) {
                debug_1.default('engine:log')(log);
            }
        });
        if (platform) {
            if (!knownPlatforms.includes(platform)) {
                throw new Error(`Unknown ${chalk_1.default.red('pinnedPlatform')} ${chalk_1.default.redBright.bold(platform)}. Possible platforms: ${chalk_1.default.greenBright(knownPlatforms.join(', '))}.
You may have to run ${chalk_1.default.greenBright('prisma2 generate')} for your changes to take effect.`);
            }
        }
        else {
            this.getPlatform();
        }
        if (this.debug) {
            debug_1.default.enable('*');
        }
    }
    resolveCwd(cwd) {
        if (cwd && fs_1.default.existsSync(cwd) && fs_1.default.lstatSync(cwd).isDirectory()) {
            return cwd;
        }
        return process.cwd();
    }
    on(event, listener) {
        this.logEmitter.on(event, listener);
    }
    async getPlatform() {
        if (this.platformPromise) {
            return this.platformPromise;
        }
        this.platformPromise = get_platform_1.getPlatform();
        return this.platformPromise;
    }
    handlePanic(log) {
        this.child.kill();
        if (this.currentRequestPromise) {
            ;
            this.currentRequestPromise.cancel();
        }
    }
    async resolvePrismaPath() {
        if (this.prismaPath) {
            return this.prismaPath;
        }
        const platform = await this.getPlatform();
        if (this.platform && this.platform !== platform) {
            this.incorrectlyPinnedPlatform = this.platform;
        }
        this.platform = this.platform || platform;
        const fileName = eval(`path.basename(__filename)`);
        if (fileName === 'NodeEngine.js') {
            return path.join(__dirname, `../query-engine-${this.platform}`);
        }
        else {
            return path.join(__dirname, `query-engine-${this.platform}`);
        }
    }
    // If we couldn't find the correct binary path, let's look for an alternative
    // This is interesting for libssl 1.0.1 vs libssl 1.0.2 cases
    async resolveAlternativeBinaryPath() {
        const binariesExist = await Promise.all(knownPlatforms.slice(1).map(async (platform) => {
            const filePath = path.join(__dirname, `query-engine-${platform}`);
            return {
                exists: await exists(filePath),
                platform,
                filePath,
            };
        }));
        const firstExistingPlatform = binariesExist.find(b => b.exists);
        if (firstExistingPlatform) {
            return firstExistingPlatform.filePath;
        }
        return null;
    }
    // get prisma path
    async getPrismaPath() {
        const prismaPath = await this.resolvePrismaPath();
        if (!(await exists(prismaPath))) {
            let info = '.';
            if (this.generator) {
                const fixedGenerator = Object.assign({}, this.generator, { platforms: util_1.fixPlatforms(this.generator.platforms, this.platform) });
                if (this.generator.pinnedPlatform && this.incorrectlyPinnedPlatform) {
                    fixedGenerator.pinnedPlatform = await this.getPlatform();
                }
                info = `:\n${chalk_1.default.greenBright(printGeneratorConfig_1.printGeneratorConfig(fixedGenerator))}`;
            }
            const pinnedStr = this.incorrectlyPinnedPlatform
                ? `\nYou incorrectly pinned it to ${chalk_1.default.redBright.bold(`${this.incorrectlyPinnedPlatform}`)}\n`
                : '';
            const alternativePath = await this.resolveAlternativeBinaryPath();
            if (!alternativePath) {
                throw new Error(`Photon binary for current platform ${chalk_1.default.bold.greenBright(await this.getPlatform())} could not be found.${pinnedStr}
  Make sure to adjust the generator configuration in the ${chalk_1.default.bold('schema.prisma')} file${info}
  Please run ${chalk_1.default.greenBright('prisma2 generate')} for your changes to take effect.
  ${chalk_1.default.gray(`Note, that by providing \`native\`, Photon automatically resolves \`${await this.getPlatform()}\`.
  Read more about deploying Photon: ${chalk_1.default.underline('https://github.com/prisma/prisma2/blob/master/docs/core/generators/photonjs.md')}`)}`);
            }
            else {
                console.error(`${chalk_1.default.yellow('warning')} Photon could not resolve the needed binary for the current platform ${chalk_1.default.greenBright(await this.getPlatform())}.
Instead we found ${chalk_1.default.bold(alternativePath)}, which we're trying for now. In case Photon runs, just ignore this message.`);
                util_1.plusX(alternativePath);
                return alternativePath;
            }
        }
        if (this.incorrectlyPinnedPlatform) {
            console.log(`${chalk_1.default.yellow('Warning:')} You pinned the platform ${chalk_1.default.bold(this.incorrectlyPinnedPlatform)}, but Photon detects ${chalk_1.default.bold(await this.getPlatform())}.
This means you should very likely pin the platform ${chalk_1.default.greenBright(await this.getPlatform())} instead.
${chalk_1.default.dim("In case we're mistaken, please report this to us 🙏.")}`);
        }
        util_1.plusX(prismaPath);
        return prismaPath;
    }
    printDatasources() {
        if (this.datasources) {
            return JSON.stringify(this.datasources);
        }
        return '[]';
    }
    /**
     * Starts the engine, returns the url that it runs on
     */
    async start() {
        if (!this.startPromise) {
            this.startPromise = this.internalStart();
        }
        return this.startPromise;
    }
    internalStart() {
        return new Promise(async (resolve, reject) => {
            try {
                this.port = await this.getFreePort();
                const env = {
                    PRISMA_DML: this.datamodel,
                    PORT: String(this.port),
                    RUST_BACKTRACE: '1',
                    RUST_LOG: 'info',
                };
                if (this.datasources) {
                    env.OVERWRITE_DATASOURCES = this.printDatasources();
                }
                debug(env);
                debug({ cwd: this.cwd });
                const prismaPath = await this.getPrismaPath();
                this.child = child_process_1.spawn(prismaPath, [], {
                    env: Object.assign({}, process.env, env),
                    cwd: this.cwd,
                    stdio: ['pipe', 'pipe', 'pipe'],
                });
                this.child.stderr.on('data', msg => {
                    const data = String(msg);
                    if (data.includes('\u001b[1;94m-->\u001b[0m')) {
                        this.stderrLogs += data;
                    }
                });
                byline_1.default(this.child.stdout).on('data', msg => {
                    const data = String(msg);
                    try {
                        const json = JSON.parse(data);
                        const log = log_1.convertLog(json);
                        this.logEmitter.emit('log', log);
                    }
                    catch (e) {
                        debug(e, data);
                    }
                });
                this.child.on('exit', code => {
                    const message = this.stderrLogs ? this.stderrLogs : this.stdoutLogs;
                    this.lastError = {
                        application: 'datamodel',
                        date: new Date(),
                        level: 'error',
                        message,
                    };
                });
                this.child.on('error', err => {
                    reject(err);
                });
                if (this.lastError) {
                    return reject(new Engine_1.PhotonError(this.lastError));
                }
                try {
                    await this.engineReady();
                }
                catch (err) {
                    await this.child.kill();
                    throw err;
                }
                const url = `http://localhost:${this.port}`;
                this.url = url;
                resolve();
            }
            catch (e) {
                reject(e);
            }
        });
    }
    /**
     * If Prisma runs, stop it
     */
    async stop() {
        await this.start();
        if (this.currentRequestPromise) {
            try {
                await this.currentRequestPromise;
            }
            catch (e) {
                //
            }
        }
        if (this.child) {
            debug(`Stopping Prisma engine`);
            this.exiting = true;
            await this.child.kill();
            delete this.child;
        }
    }
    /**
     * Use the port 0 trick to get a new port
     */
    getFreePort() {
        return new Promise((resolve, reject) => {
            const server = net.createServer(s => s.end(''));
            server.unref();
            server.on('error', reject);
            server.listen(0, () => {
                const address = server.address();
                const port = typeof address === 'string' ? parseInt(address.split(':').slice(-1)[0], 10) : address.port;
                server.close(e => {
                    if (e) {
                        reject(e);
                    }
                    resolve(port);
                });
            });
        });
    }
    /**
     * Make sure that our internal port is not conflicting with the prisma.yml's port
     * @param str config
     */
    trimPort(str) {
        return str
            .split('\n')
            .filter(l => !l.startsWith('port:'))
            .join('\n');
    }
    // TODO: Replace it with a simple tcp connection
    async engineReady() {
        let tries = 0;
        while (true) {
            if (!this.child) {
                return;
            }
            else if (this.child.killed) {
                throw new Error('Engine has died');
            }
            await new Promise(r => setTimeout(r, 50));
            if (this.lastError) {
                throw new Engine_1.PhotonError(this.lastError);
            }
            try {
                await got_1.default(`http://localhost:${this.port}/status`, {
                    timeout: 5000,
                });
                debug(`Ready after try number ${tries}`);
                this.ready = true;
                return;
            }
            catch (e) {
                debug(e.message);
                if (tries >= 100) {
                    throw e;
                }
            }
            finally {
                tries++;
            }
        }
    }
    async getDmmf() {
        const result = await got_1.default.get(this.url + '/dmmf', {
            json: true,
        });
        return result.body.data;
    }
    async request(query, typeName) {
        await this.start();
        if (!this.child) {
            throw new Error(`Engine has already been stopped`);
        }
        this.currentRequestPromise = got_1.default.post(this.url, {
            json: true,
            headers: {
                'Content-Type': 'application/json',
            },
            body: { query, variables: {} },
        });
        return this.currentRequestPromise
            .then(({ body }) => {
            const errors = body.error || body.errors;
            if (errors) {
                return this.handleErrors({
                    errors,
                    query,
                });
            }
            return body.data;
        })
            .catch(error => {
            if (this.currentRequestPromise.isCanceled && this.lastError) {
                throw new Engine_1.PhotonError(this.lastError);
            }
            if (error.code && error.code === 'ECONNRESET') {
                if (this.lastError) {
                    throw new Engine_1.PhotonError(this.lastError);
                }
                const logs = this.stderrLogs || this.stdoutLogs;
                throw new Error(logs);
            }
            if (!(error instanceof Engine_1.PhotonQueryError)) {
                return this.handleErrors({ errors: error, query });
            }
            else {
                throw error;
            }
        });
    }
    serializeErrors(errors) {
        // make the happy case beautiful
        if (Array.isArray(errors) && errors.length === 1 && errors[0].error && typeof errors[0].error === 'string') {
            return errors[0].error;
        }
        return JSON.stringify(errors, null, 2);
    }
    handleErrors({ errors, query }) {
        const stringified = errors ? this.serializeErrors(errors) : null;
        const message = stringified.length > 0 ? stringified : `Error in photon.\$\{rootField || 'query'}`;
        const isPanicked = this.stderrLogs.includes('panicked') || this.stdoutLogs.includes('panicked'); // TODO better handling
        if (isPanicked) {
            this.stop();
        }
        throw new Engine_1.PhotonQueryError(message);
    }
}
exports.NodeEngine = NodeEngine;
//# sourceMappingURL=NodeEngine.js.map

/***/ }),

/***/ 196:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var dmmf_types_1 = __webpack_require__(422);
exports.DMMF = dmmf_types_1.DMMF;
var dmmf_1 = __webpack_require__(755);
exports.DMMFClass = dmmf_1.DMMFClass;
var deep_set_1 = __webpack_require__(721);
exports.deepGet = deep_set_1.deepGet;
exports.deepSet = deep_set_1.deepSet;
var query_1 = __webpack_require__(165);
exports.makeDocument = query_1.makeDocument;
exports.transformDocument = query_1.transformDocument;
var NodeEngine_1 = __webpack_require__(178);
exports.Engine = NodeEngine_1.NodeEngine;
var debug_1 = __webpack_require__(784);
exports.debugLib = debug_1.default;
var printDatasources_1 = __webpack_require__(643);
exports.printDatasources = printDatasources_1.printDatasources;
var chalk_1 = __webpack_require__(946);
exports.chalk = chalk_1.default;
var printStack_1 = __webpack_require__(41);
exports.printStack = printStack_1.printStack;
var mergeBy_1 = __webpack_require__(316);
exports.mergeBy = mergeBy_1.mergeBy;


/***/ }),

/***/ 205:
/***/ (function(__unusedmodule, exports) {

//TODO: handle reviver/dehydrate function like normal
//and handle indentation, like normal.
//if anyone needs this... please send pull request.

exports.stringify = function stringify (o) {
  if('undefined' == typeof o) return o

  if(o && Buffer.isBuffer(o))
    return JSON.stringify(':base64:' + o.toString('base64'))

  if(o && o.toJSON)
    o =  o.toJSON()

  if(o && 'object' === typeof o) {
    var s = ''
    var array = Array.isArray(o)
    s = array ? '[' : '{'
    var first = true

    for(var k in o) {
      var ignore = 'function' == typeof o[k] || (!array && 'undefined' === typeof o[k])
      if(Object.hasOwnProperty.call(o, k) && !ignore) {
        if(!first)
          s += ','
        first = false
        if (array) {
          if(o[k] == undefined)
            s += 'null'
          else
            s += stringify(o[k])
        } else if (o[k] !== void(0)) {
          s += stringify(k) + ':' + stringify(o[k])
        }
      }
    }

    s += array ? ']' : '}'

    return s
  } else if ('string' === typeof o) {
    return JSON.stringify(/^:/.test(o) ? ':' + o : o)
  } else if ('undefined' === typeof o) {
    return 'null';
  } else
    return JSON.stringify(o)
}

exports.parse = function (s) {
  return JSON.parse(s, function (key, value) {
    if('string' === typeof value) {
      if(/^:base64:/.test(value))
        return new Buffer(value.substring(8), 'base64')
      else
        return /^:/.test(value) ? value.substring(1) : value 
    }
    return value
  })
}


/***/ }),

/***/ 211:
/***/ (function(module) {

module.exports = require("https");

/***/ }),

/***/ 212:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const isRegexp = __webpack_require__(754);
const isObj = __webpack_require__(804);
const getOwnEnumPropSymbols = __webpack_require__(28).default;
// Fork of https://github.com/yeoman/stringify-object/blob/master/index.js
// with possibility to overwrite the whole key-value pair (options.transformLine)
/* tslint:disable */
const stringifyObject = (input, options, pad) => {
    const seen = [];
    return (function stringifyObject(input, options = {}, pad = '', path = []) {
        options.indent = options.indent || '\t';
        let tokens;
        if (options.inlineCharacterLimit === undefined) {
            tokens = {
                newLine: '\n',
                newLineOrSpace: '\n',
                pad,
                indent: pad + options.indent,
            };
        }
        else {
            tokens = {
                newLine: '@@__STRINGIFY_OBJECT_NEW_LINE__@@',
                newLineOrSpace: '@@__STRINGIFY_OBJECT_NEW_LINE_OR_SPACE__@@',
                pad: '@@__STRINGIFY_OBJECT_PAD__@@',
                indent: '@@__STRINGIFY_OBJECT_INDENT__@@',
            };
        }
        const expandWhiteSpace = string => {
            if (options.inlineCharacterLimit === undefined) {
                return string;
            }
            const oneLined = string
                .replace(new RegExp(tokens.newLine, 'g'), '')
                .replace(new RegExp(tokens.newLineOrSpace, 'g'), ' ')
                .replace(new RegExp(tokens.pad + '|' + tokens.indent, 'g'), '');
            if (oneLined.length <= options.inlineCharacterLimit) {
                return oneLined;
            }
            return string
                .replace(new RegExp(tokens.newLine + '|' + tokens.newLineOrSpace, 'g'), '\n')
                .replace(new RegExp(tokens.pad, 'g'), pad)
                .replace(new RegExp(tokens.indent, 'g'), pad + options.indent);
        };
        if (seen.indexOf(input) !== -1) {
            return '"[Circular]"';
        }
        if (input === null ||
            input === undefined ||
            typeof input === 'number' ||
            typeof input === 'boolean' ||
            typeof input === 'function' ||
            typeof input === 'symbol' ||
            isRegexp(input)) {
            return String(input);
        }
        if (input instanceof Date) {
            return `new Date('${input.toISOString()}')`;
        }
        if (Array.isArray(input)) {
            if (input.length === 0) {
                return '[]';
            }
            seen.push(input);
            const ret = '[' +
                tokens.newLine +
                input
                    .map((el, i) => {
                    const eol = input.length - 1 === i ? tokens.newLine : ',' + tokens.newLineOrSpace;
                    let value = stringifyObject(el, options, pad + options.indent, [...path, i]);
                    if (options.transformValue) {
                        value = options.transformValue(input, i, value);
                    }
                    return tokens.indent + value + eol;
                })
                    .join('') +
                tokens.pad +
                ']';
            seen.pop();
            return expandWhiteSpace(ret);
        }
        if (isObj(input)) {
            let objKeys = Object.keys(input).concat(getOwnEnumPropSymbols(input));
            if (options.filter) {
                objKeys = objKeys.filter(el => options.filter(input, el));
            }
            if (objKeys.length === 0) {
                return '{}';
            }
            seen.push(input);
            const ret = '{' +
                tokens.newLine +
                objKeys
                    .map((el, i) => {
                    const eol = objKeys.length - 1 === i ? tokens.newLine : ',' + tokens.newLineOrSpace;
                    const isSymbol = typeof el === 'symbol';
                    const isClassic = !isSymbol && /^[a-z$_][a-z$_0-9]*$/i.test(el);
                    const key = isSymbol || isClassic ? el : stringifyObject(el, options, undefined, [...path, el]);
                    let value = stringifyObject(input[el], options, pad + options.indent, [...path, el]);
                    if (options.transformValue) {
                        value = options.transformValue(input, el, value);
                    }
                    let line = tokens.indent + String(key) + ': ' + value + eol;
                    if (options.transformLine) {
                        line = options.transformLine({
                            obj: input,
                            indent: tokens.indent,
                            key,
                            stringifiedValue: value,
                            value: input[el],
                            eol,
                            originalLine: line,
                            path: path.concat(key),
                        });
                    }
                    return line;
                })
                    .join('') +
                tokens.pad +
                '}';
            seen.pop();
            return expandWhiteSpace(ret);
        }
        input = String(input).replace(/[\r\n]/g, x => (x === '\n' ? '\\n' : '\\r'));
        if (options.singleQuotes === false) {
            input = input.replace(/"/g, '\\"');
            return `"${input}"`;
        }
        input = input.replace(/\\?'/g, "\\'");
        return `'${input}'`;
    })(input, options, pad);
};
exports.default = stringifyObject;


/***/ }),

/***/ 247:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const os = __webpack_require__(87);
const hasFlag = __webpack_require__(364);

const env = process.env;

let forceColor;
if (hasFlag('no-color') ||
	hasFlag('no-colors') ||
	hasFlag('color=false')) {
	forceColor = false;
} else if (hasFlag('color') ||
	hasFlag('colors') ||
	hasFlag('color=true') ||
	hasFlag('color=always')) {
	forceColor = true;
}
if ('FORCE_COLOR' in env) {
	forceColor = env.FORCE_COLOR.length === 0 || parseInt(env.FORCE_COLOR, 10) !== 0;
}

function translateLevel(level) {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
}

function supportsColor(stream) {
	if (forceColor === false) {
		return 0;
	}

	if (hasFlag('color=16m') ||
		hasFlag('color=full') ||
		hasFlag('color=truecolor')) {
		return 3;
	}

	if (hasFlag('color=256')) {
		return 2;
	}

	if (stream && !stream.isTTY && forceColor !== true) {
		return 0;
	}

	const min = forceColor ? 1 : 0;

	if (process.platform === 'win32') {
		// Node.js 7.5.0 is the first version of Node.js to include a patch to
		// libuv that enables 256 color output on Windows. Anything earlier and it
		// won't work. However, here we target Node.js 8 at minimum as it is an LTS
		// release, and Node.js 7 is not. Windows 10 build 10586 is the first Windows
		// release that supports 256 colors. Windows 10 build 14931 is the first release
		// that supports 16m/TrueColor.
		const osRelease = os.release().split('.');
		if (
			Number(process.versions.node.split('.')[0]) >= 8 &&
			Number(osRelease[0]) >= 10 &&
			Number(osRelease[2]) >= 10586
		) {
			return Number(osRelease[2]) >= 14931 ? 3 : 2;
		}

		return 1;
	}

	if ('CI' in env) {
		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
			return 1;
		}

		return min;
	}

	if ('TEAMCITY_VERSION' in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	}

	if (env.COLORTERM === 'truecolor') {
		return 3;
	}

	if ('TERM_PROGRAM' in env) {
		const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env.TERM_PROGRAM) {
			case 'iTerm.app':
				return version >= 3 ? 3 : 2;
			case 'Apple_Terminal':
				return 2;
			// No default
		}
	}

	if (/-256(color)?$/i.test(env.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
		return 1;
	}

	if ('COLORTERM' in env) {
		return 1;
	}

	if (env.TERM === 'dumb') {
		return min;
	}

	return min;
}

function getSupportLevel(stream) {
	const level = supportsColor(stream);
	return translateLevel(level);
}

module.exports = {
	supportsColor: getSupportLevel,
	stdout: getSupportLevel(process.stdout),
	stderr: getSupportLevel(process.stderr)
};


/***/ }),

/***/ 251:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var getPlatform_1 = __webpack_require__(715);
exports.getPlatform = getPlatform_1.getPlatform;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 257:
/***/ (function(module) {

"use strict";


module.exports = (string, count = 1, options) => {
	options = {
		indent: ' ',
		includeEmptyLines: false,
		...options
	};

	if (typeof string !== 'string') {
		throw new TypeError(
			`Expected \`input\` to be a \`string\`, got \`${typeof string}\``
		);
	}

	if (typeof count !== 'number') {
		throw new TypeError(
			`Expected \`count\` to be a \`number\`, got \`${typeof count}\``
		);
	}

	if (typeof options.indent !== 'string') {
		throw new TypeError(
			`Expected \`options.indent\` to be a \`string\`, got \`${typeof options.indent}\``
		);
	}

	if (count === 0) {
		return string;
	}

	const regex = options.includeEmptyLines ? /^/gm : /^(?!\s*$)/gm;

	return string.replace(regex, options.indent.repeat(count));
};


/***/ }),

/***/ 260:
/***/ (function(module, __unusedexports, __webpack_require__) {

var conversions = __webpack_require__(600);

/*
	this function routes a model to all other models.

	all functions that are routed have a property `.conversion` attached
	to the returned synthetic function. This property is an array
	of strings, each with the steps in between the 'from' and 'to'
	color models (inclusive).

	conversions that are not possible simply are not included.
*/

function buildGraph() {
	var graph = {};
	// https://jsperf.com/object-keys-vs-for-in-with-closure/3
	var models = Object.keys(conversions);

	for (var len = models.length, i = 0; i < len; i++) {
		graph[models[i]] = {
			// http://jsperf.com/1-vs-infinity
			// micro-opt, but this is simple.
			distance: -1,
			parent: null
		};
	}

	return graph;
}

// https://en.wikipedia.org/wiki/Breadth-first_search
function deriveBFS(fromModel) {
	var graph = buildGraph();
	var queue = [fromModel]; // unshift -> queue -> pop

	graph[fromModel].distance = 0;

	while (queue.length) {
		var current = queue.pop();
		var adjacents = Object.keys(conversions[current]);

		for (var len = adjacents.length, i = 0; i < len; i++) {
			var adjacent = adjacents[i];
			var node = graph[adjacent];

			if (node.distance === -1) {
				node.distance = graph[current].distance + 1;
				node.parent = current;
				queue.unshift(adjacent);
			}
		}
	}

	return graph;
}

function link(from, to) {
	return function (args) {
		return to(from(args));
	};
}

function wrapConversion(toModel, graph) {
	var path = [graph[toModel].parent, toModel];
	var fn = conversions[graph[toModel].parent][toModel];

	var cur = graph[toModel].parent;
	while (graph[cur].parent) {
		path.unshift(graph[cur].parent);
		fn = link(conversions[graph[cur].parent][cur], fn);
		cur = graph[cur].parent;
	}

	fn.conversion = path;
	return fn;
}

module.exports = function (fromModel) {
	var graph = deriveBFS(fromModel);
	var conversion = {};

	var models = Object.keys(graph);
	for (var len = models.length, i = 0; i < len; i++) {
		var toModel = models[i];
		var node = graph[toModel];

		if (node.parent === null) {
			// no possible conversion, or this node is the source model.
			continue;
		}

		conversion[toModel] = wrapConversion(toModel, graph);
	}

	return conversion;
};



/***/ }),

/***/ 262:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const is = __webpack_require__(534);

module.exports = function deepFreeze(object) {
	for (const [key, value] of Object.entries(object)) {
		if (is.plainObject(value) || is.array(value)) {
			deepFreeze(object[key]);
		}
	}

	return Object.freeze(object);
};


/***/ }),

/***/ 284:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(__webpack_require__(946));
class PhotonError extends Error {
    constructor(log) {
        const isPanic = log.message === 'PANIC';
        const message = isPanic ? serializePanic(log) : serializeError(log);
        super(message);
        Object.defineProperty(this, 'log', {
            enumerable: false,
            value: log,
        });
        Object.defineProperty(this, 'isPanic', {
            enumerable: false,
            value: isPanic,
        });
    }
}
exports.PhotonError = PhotonError;
function serializeError(log) {
    let { application, level, message } = log, rest = __rest(log, ["application", "level", "message"]);
    if (application === 'datamodel') {
        return chalk_1.default.red.bold('Schema ') + message;
    }
    return chalk_1.default.red(log.message + ' ' + serializeObject(rest));
}
function serializePanic(log) {
    return `${chalk_1.default.red.bold('Reason: ')}${chalk_1.default.red(`${log.reason} in ${chalk_1.default.underline(`${log.file}:${log.line}:${log.column}`)}`)}

Please create an issue in the ${chalk_1.default.bold('photonjs')} repo with
your \`schema.prisma\` and the Photon method you tried to use 🙏:
${chalk_1.default.underline('https://github.com/prisma/photonjs/issues/new')}\n`;
}
class PhotonQueryError extends Error {
    constructor(message) {
        super(chalk_1.default.red.bold('Reason: ') + chalk_1.default.red(message + '\n'));
    }
}
exports.PhotonQueryError = PhotonQueryError;
function serializeObject(obj) {
    return Object.entries(obj)
        .map(([key, value]) => `${key}=${JSON.parse(JSON.stringify(value))}`)
        .join(' ');
}
/**
 * Engine Base Class used by Browser and Node.js
 */
class Engine {
}
exports.Engine = Engine;
//# sourceMappingURL=Engine.js.map

/***/ }),

/***/ 303:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const EventEmitter = __webpack_require__(614);
const JSONB = __webpack_require__(205);

const loadStore = opts => {
	const adapters = {
		redis: '@keyv/redis',
		mongodb: '@keyv/mongo',
		mongo: '@keyv/mongo',
		sqlite: '@keyv/sqlite',
		postgresql: '@keyv/postgres',
		postgres: '@keyv/postgres',
		mysql: '@keyv/mysql'
	};
	if (opts.adapter || opts.uri) {
		const adapter = opts.adapter || /^[^:]*/.exec(opts.uri)[0];
		return new (require(adapters[adapter]))(opts);
	}
	return new Map();
};

class Keyv extends EventEmitter {
	constructor(uri, opts) {
		super();
		this.opts = Object.assign(
			{
				namespace: 'keyv',
				serialize: JSONB.stringify,
				deserialize: JSONB.parse
			},
			(typeof uri === 'string') ? { uri } : uri,
			opts
		);

		if (!this.opts.store) {
			const adapterOpts = Object.assign({}, this.opts);
			this.opts.store = loadStore(adapterOpts);
		}

		if (typeof this.opts.store.on === 'function') {
			this.opts.store.on('error', err => this.emit('error', err));
		}

		this.opts.store.namespace = this.opts.namespace;
	}

	_getKeyPrefix(key) {
		return `${this.opts.namespace}:${key}`;
	}

	get(key) {
		key = this._getKeyPrefix(key);
		const store = this.opts.store;
		return Promise.resolve()
			.then(() => store.get(key))
			.then(data => {
				data = (typeof data === 'string') ? this.opts.deserialize(data) : data;
				if (data === undefined) {
					return undefined;
				}
				if (typeof data.expires === 'number' && Date.now() > data.expires) {
					this.delete(key);
					return undefined;
				}
				return data.value;
			});
	}

	set(key, value, ttl) {
		key = this._getKeyPrefix(key);
		if (typeof ttl === 'undefined') {
			ttl = this.opts.ttl;
		}
		if (ttl === 0) {
			ttl = undefined;
		}
		const store = this.opts.store;

		return Promise.resolve()
			.then(() => {
				const expires = (typeof ttl === 'number') ? (Date.now() + ttl) : null;
				value = { value, expires };
				return store.set(key, this.opts.serialize(value), ttl);
			})
			.then(() => true);
	}

	delete(key) {
		key = this._getKeyPrefix(key);
		const store = this.opts.store;
		return Promise.resolve()
			.then(() => store.delete(key));
	}

	clear() {
		const store = this.opts.store;
		return Promise.resolve()
			.then(() => store.clear());
	}
}

module.exports = Keyv;


/***/ }),

/***/ 308:
/***/ (function(module) {

"use strict";


module.exports = (socket, callback) => {
	if (socket.writable && !socket.connecting) {
		callback();
	} else {
		socket.once('connect', callback);
	}
};


/***/ }),

/***/ 316:
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Merge two arrays, their elements uniqueness decided by the callback.
 * In case of a duplicate, elements of `arr2` are taken.
 * If there is a duplicate within an array, the last element is being taken.
 * @param arr1 Base array
 * @param arr2 Array to overwrite the first one if there is a match
 * @param cb The function to calculate uniqueness
 */
function mergeBy(arr1, arr2, cb) {
    const groupedArr1 = groupBy(arr1, cb);
    const groupedArr2 = groupBy(arr2, cb);
    const result = Object.values(groupedArr2).map(value => value[value.length - 1]);
    const arr2Keys = Object.keys(groupedArr2);
    Object.entries(groupedArr1).forEach(([key, value]) => {
        if (!arr2Keys.includes(key)) {
            result.push(value[value.length - 1]);
        }
    });
    return result;
}
exports.mergeBy = mergeBy;
const groupBy = (arr, cb) => {
    return arr.reduce((acc, curr) => {
        const key = cb(curr);
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(curr);
        return acc;
    }, {});
};


/***/ }),

/***/ 317:
/***/ (function(module) {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}


/***/ }),

/***/ 324:
/***/ (function(__unusedmodule, exports) {

"use strict";

var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const logLevelMap = {
    CRIT: 'critical',
    ERRO: 'error',
    WARN: 'warning',
    INFO: 'info',
    DEBG: 'debug',
    TRCE: 'trace',
};
function rustToPublicLogLevel(rustLevel) {
    return logLevelMap[rustLevel];
}
function convertLog(rustLog) {
    const { msg, level, application, ts } = rustLog, rest = __rest(rustLog, ["msg", "level", "application", "ts"]);
    return Object.assign({ message: msg, level: rustToPublicLogLevel(level), application: application, date: new Date(ts) }, rest);
}
exports.convertLog = convertLog;
//# sourceMappingURL=log.js.map

/***/ }),

/***/ 325:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const PassThrough = __webpack_require__(413).PassThrough;
const mimicResponse = __webpack_require__(89);

const cloneResponse = response => {
	if (!(response && response.pipe)) {
		throw new TypeError('Parameter `response` must be a response stream.');
	}

	const clone = new PassThrough();
	mimicResponse(response, clone);

	return response.pipe(clone);
};

module.exports = cloneResponse;


/***/ }),

/***/ 338:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const errors = __webpack_require__(774);
const asStream = __webpack_require__(794);
const asPromise = __webpack_require__(916);
const normalizeArguments = __webpack_require__(86);
const merge = __webpack_require__(821);
const deepFreeze = __webpack_require__(262);

const getPromiseOrStream = options => options.stream ? asStream(options) : asPromise(options);

const aliases = [
	'get',
	'post',
	'put',
	'patch',
	'head',
	'delete'
];

const create = defaults => {
	defaults = merge({}, defaults);
	normalizeArguments.preNormalize(defaults.options);

	if (!defaults.handler) {
		// This can't be getPromiseOrStream, because when merging
		// the chain would stop at this point and no further handlers would be called.
		defaults.handler = (options, next) => next(options);
	}

	function got(url, options) {
		try {
			return defaults.handler(normalizeArguments(url, options, defaults), getPromiseOrStream);
		} catch (error) {
			if (options && options.stream) {
				throw error;
			} else {
				return Promise.reject(error);
			}
		}
	}

	got.create = create;
	got.extend = options => {
		let mutableDefaults;
		if (options && Reflect.has(options, 'mutableDefaults')) {
			mutableDefaults = options.mutableDefaults;
			delete options.mutableDefaults;
		} else {
			mutableDefaults = defaults.mutableDefaults;
		}

		return create({
			options: merge.options(defaults.options, options),
			handler: defaults.handler,
			mutableDefaults
		});
	};

	got.mergeInstances = (...args) => create(merge.instances(args));

	got.stream = (url, options) => got(url, {...options, stream: true});

	for (const method of aliases) {
		got[method] = (url, options) => got(url, {...options, method});
		got.stream[method] = (url, options) => got.stream(url, {...options, method});
	}

	Object.assign(got, {...errors, mergeOptions: merge.options});
	Object.defineProperty(got, 'defaults', {
		value: defaults.mutableDefaults ? defaults : deepFreeze(defaults),
		writable: defaults.mutableDefaults,
		configurable: defaults.mutableDefaults,
		enumerable: true
	});

	return got;
};

module.exports = create;


/***/ }),

/***/ 344:
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function filterObject(obj, cb) {
    if (!obj || typeof obj !== 'object' || typeof obj.hasOwnProperty !== 'function') {
        return obj;
    }
    const newObj = {};
    for (const key in obj) {
        const value = obj[key];
        if (obj.hasOwnProperty(key) && cb(key, value)) {
            newObj[key] = value;
        }
    }
    return newObj;
}
exports.filterObject = filterObject;


/***/ }),

/***/ 364:
/***/ (function(module) {

"use strict";

module.exports = (flag, argv) => {
	argv = argv || process.argv;
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const pos = argv.indexOf(prefix + flag);
	const terminatorPos = argv.indexOf('--');
	return pos !== -1 && (terminatorPos === -1 ? true : pos < terminatorPos);
};


/***/ }),

/***/ 365:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const {Transform} = __webpack_require__(413);

module.exports = {
	download(response, emitter, downloadBodySize) {
		let downloaded = 0;

		return new Transform({
			transform(chunk, encoding, callback) {
				downloaded += chunk.length;

				const percent = downloadBodySize ? downloaded / downloadBodySize : 0;

				// Let `flush()` be responsible for emitting the last event
				if (percent < 1) {
					emitter.emit('downloadProgress', {
						percent,
						transferred: downloaded,
						total: downloadBodySize
					});
				}

				callback(null, chunk);
			},

			flush(callback) {
				emitter.emit('downloadProgress', {
					percent: 1,
					transferred: downloaded,
					total: downloadBodySize
				});

				callback();
			}
		});
	},

	upload(request, emitter, uploadBodySize) {
		const uploadEventFrequency = 150;
		let uploaded = 0;
		let progressInterval;

		emitter.emit('uploadProgress', {
			percent: 0,
			transferred: 0,
			total: uploadBodySize
		});

		request.once('error', () => {
			clearInterval(progressInterval);
		});

		request.once('response', () => {
			clearInterval(progressInterval);

			emitter.emit('uploadProgress', {
				percent: 1,
				transferred: uploaded,
				total: uploadBodySize
			});
		});

		request.once('socket', socket => {
			const onSocketConnect = () => {
				progressInterval = setInterval(() => {
					const lastUploaded = uploaded;
					/* istanbul ignore next: see #490 (occurs randomly!) */
					const headersSize = request._header ? Buffer.byteLength(request._header) : 0;
					uploaded = socket.bytesWritten - headersSize;

					// Don't emit events with unchanged progress and
					// prevent last event from being emitted, because
					// it's emitted when `response` is emitted
					if (uploaded === lastUploaded || uploaded === uploadBodySize) {
						return;
					}

					emitter.emit('uploadProgress', {
						percent: uploadBodySize ? uploaded / uploadBodySize : 0,
						transferred: uploaded,
						total: uploadBodySize
					});
				}, uploadEventFrequency);
			};

			/* istanbul ignore next: hard to test */
			if (socket.connecting) {
				socket.once('connect', onSocketConnect);
			} else if (socket.writable) {
				// The socket is being reused from pool,
				// so the connect event will not be emitted
				onSocketConnect();
			}
		});
	}
};


/***/ }),

/***/ 370:
/***/ (function(module) {

"use strict";

module.exports = str => {
	const match = str.match(/^[ \t]*(?=\S)/gm);

	if (!match) {
		return 0;
	}

	// TODO: Use spread operator when targeting Node.js 6
	return Math.min.apply(Math, match.map(x => x.length));
};


/***/ }),

/***/ 375:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const {PassThrough: PassThroughStream} = __webpack_require__(413);

module.exports = options => {
	options = {...options};

	const {array} = options;
	let {encoding} = options;
	const isBuffer = encoding === 'buffer';
	let objectMode = false;

	if (array) {
		objectMode = !(encoding || isBuffer);
	} else {
		encoding = encoding || 'utf8';
	}

	if (isBuffer) {
		encoding = null;
	}

	const stream = new PassThroughStream({objectMode});

	if (encoding) {
		stream.setEncoding(encoding);
	}

	let length = 0;
	const chunks = [];

	stream.on('data', chunk => {
		chunks.push(chunk);

		if (objectMode) {
			length = chunks.length;
		} else {
			length += chunk.length;
		}
	});

	stream.getBufferedValue = () => {
		if (array) {
			return chunks;
		}

		return isBuffer ? Buffer.concat(chunks, length) : chunks.join('');
	};

	stream.getBufferedLength = () => length;

	return stream;
};


/***/ }),

/***/ 390:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const EventEmitter = __webpack_require__(614);
const urlLib = __webpack_require__(835);
const normalizeUrl = __webpack_require__(53);
const getStream = __webpack_require__(16);
const CachePolicy = __webpack_require__(154);
const Response = __webpack_require__(93);
const lowercaseKeys = __webpack_require__(97);
const cloneResponse = __webpack_require__(325);
const Keyv = __webpack_require__(303);

class CacheableRequest {
	constructor(request, cacheAdapter) {
		if (typeof request !== 'function') {
			throw new TypeError('Parameter `request` must be a function');
		}

		this.cache = new Keyv({
			uri: typeof cacheAdapter === 'string' && cacheAdapter,
			store: typeof cacheAdapter !== 'string' && cacheAdapter,
			namespace: 'cacheable-request'
		});

		return this.createCacheableRequest(request);
	}

	createCacheableRequest(request) {
		return (opts, cb) => {
			let url;
			if (typeof opts === 'string') {
				url = normalizeUrlObject(urlLib.parse(opts));
				opts = {};
			} else if (opts instanceof urlLib.URL) {
				url = normalizeUrlObject(urlLib.parse(opts.toString()));
				opts = {};
			} else {
				const [pathname, ...searchParts] = (opts.path || '').split('?');
				const search = searchParts.length > 0 ?
					`?${searchParts.join('?')}` :
					'';
				url = normalizeUrlObject({ ...opts, pathname, search });
			}

			opts = {
				headers: {},
				method: 'GET',
				cache: true,
				strictTtl: false,
				automaticFailover: false,
				...opts,
				...urlObjectToRequestOptions(url)
			};
			opts.headers = lowercaseKeys(opts.headers);

			const ee = new EventEmitter();
			const normalizedUrlString = normalizeUrl(
				urlLib.format(url),
				{
					stripWWW: false,
					removeTrailingSlash: false,
					stripAuthentication: false
				}
			);
			const key = `${opts.method}:${normalizedUrlString}`;
			let revalidate = false;
			let madeRequest = false;

			const makeRequest = opts => {
				madeRequest = true;
				let requestErrored = false;
				let requestErrorCallback;

				const requestErrorPromise = new Promise(resolve => {
					requestErrorCallback = () => {
						if (!requestErrored) {
							requestErrored = true;
							resolve();
						}
					};
				});

				const handler = response => {
					if (revalidate && !opts.forceRefresh) {
						response.status = response.statusCode;
						const revalidatedPolicy = CachePolicy.fromObject(revalidate.cachePolicy).revalidatedPolicy(opts, response);
						if (!revalidatedPolicy.modified) {
							const headers = revalidatedPolicy.policy.responseHeaders();
							response = new Response(revalidate.statusCode, headers, revalidate.body, revalidate.url);
							response.cachePolicy = revalidatedPolicy.policy;
							response.fromCache = true;
						}
					}

					if (!response.fromCache) {
						response.cachePolicy = new CachePolicy(opts, response, opts);
						response.fromCache = false;
					}

					let clonedResponse;
					if (opts.cache && response.cachePolicy.storable()) {
						clonedResponse = cloneResponse(response);

						(async () => {
							try {
								const bodyPromise = getStream.buffer(response);

								await Promise.race([
									requestErrorPromise,
									new Promise(resolve => response.once('end', resolve))
								]);

								if (requestErrored) {
									return;
								}

								const body = await bodyPromise;

								const value = {
									cachePolicy: response.cachePolicy.toObject(),
									url: response.url,
									statusCode: response.fromCache ? revalidate.statusCode : response.statusCode,
									body
								};

								let ttl = opts.strictTtl ? response.cachePolicy.timeToLive() : undefined;
								if (opts.maxTtl) {
									ttl = ttl ? Math.min(ttl, opts.maxTtl) : opts.maxTtl;
								}

								await this.cache.set(key, value, ttl);
							} catch (error) {
								ee.emit('error', new CacheableRequest.CacheError(error));
							}
						})();
					} else if (opts.cache && revalidate) {
						(async () => {
							try {
								await this.cache.delete(key);
							} catch (error) {
								ee.emit('error', new CacheableRequest.CacheError(error));
							}
						})();
					}

					ee.emit('response', clonedResponse || response);
					if (typeof cb === 'function') {
						cb(clonedResponse || response);
					}
				};

				try {
					const req = request(opts, handler);
					req.once('error', requestErrorCallback);
					req.once('abort', requestErrorCallback);
					ee.emit('request', req);
				} catch (error) {
					ee.emit('error', new CacheableRequest.RequestError(error));
				}
			};

			(async () => {
				const get = async opts => {
					await Promise.resolve();

					const cacheEntry = opts.cache ? await this.cache.get(key) : undefined;
					if (typeof cacheEntry === 'undefined') {
						return makeRequest(opts);
					}

					const policy = CachePolicy.fromObject(cacheEntry.cachePolicy);
					if (policy.satisfiesWithoutRevalidation(opts) && !opts.forceRefresh) {
						const headers = policy.responseHeaders();
						const response = new Response(cacheEntry.statusCode, headers, cacheEntry.body, cacheEntry.url);
						response.cachePolicy = policy;
						response.fromCache = true;

						ee.emit('response', response);
						if (typeof cb === 'function') {
							cb(response);
						}
					} else {
						revalidate = cacheEntry;
						opts.headers = policy.revalidationHeaders(opts);
						makeRequest(opts);
					}
				};

				const errorHandler = error => ee.emit('error', new CacheableRequest.CacheError(error));
				this.cache.once('error', errorHandler);
				ee.on('response', () => this.cache.removeListener('error', errorHandler));

				try {
					await get(opts);
				} catch (error) {
					if (opts.automaticFailover && !madeRequest) {
						makeRequest(opts);
					}

					ee.emit('error', new CacheableRequest.CacheError(error));
				}
			})();

			return ee;
		};
	}
}

function urlObjectToRequestOptions(url) {
	const options = { ...url };
	options.path = `${url.pathname || '/'}${url.search || ''}`;
	delete options.pathname;
	delete options.search;
	return options;
}

function normalizeUrlObject(url) {
	// If url was parsed by url.parse or new URL:
	// - hostname will be set
	// - host will be hostname[:port]
	// - port will be set if it was explicit in the parsed string
	// Otherwise, url was from request options:
	// - hostname or host may be set
	// - host shall not have port encoded
	return {
		protocol: url.protocol,
		auth: url.auth,
		hostname: url.hostname || url.host || 'localhost',
		port: url.port,
		pathname: url.pathname,
		search: url.search
	};
}

CacheableRequest.RequestError = class extends Error {
	constructor(error) {
		super(error.message);
		this.name = 'RequestError';
		Object.assign(this, error);
	}
};

CacheableRequest.CacheError = class extends Error {
	constructor(error) {
		super(error.message);
		this.name = 'CacheError';
		Object.assign(this, error);
	}
};

module.exports = CacheableRequest;


/***/ }),

/***/ 408:
/***/ (function(module, exports, __webpack_require__) {

/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */
function log(...args) {
	// This hackery is required for IE8/9, where
	// the `console.log` function doesn't have 'apply'
	return typeof console === 'object' &&
		console.log &&
		console.log(...args);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = process.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = __webpack_require__(486)(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};


/***/ }),

/***/ 413:
/***/ (function(module) {

module.exports = require("stream");

/***/ }),

/***/ 422:
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ExternalDMMF;
(function (ExternalDMMF) {
    let ModelAction;
    (function (ModelAction) {
        ModelAction["findOne"] = "findOne";
        ModelAction["findMany"] = "findMany";
        ModelAction["create"] = "create";
        ModelAction["update"] = "update";
        ModelAction["updateMany"] = "updateMany";
        ModelAction["upsert"] = "upsert";
        ModelAction["delete"] = "delete";
        ModelAction["deleteMany"] = "deleteMany";
    })(ModelAction = ExternalDMMF.ModelAction || (ExternalDMMF.ModelAction = {}));
})(ExternalDMMF = exports.ExternalDMMF || (exports.ExternalDMMF = {}));
var DMMF;
(function (DMMF) {
    let ModelAction;
    (function (ModelAction) {
        ModelAction["findOne"] = "findOne";
        ModelAction["findMany"] = "findMany";
        ModelAction["create"] = "create";
        ModelAction["update"] = "update";
        ModelAction["updateMany"] = "updateMany";
        ModelAction["upsert"] = "upsert";
        ModelAction["delete"] = "delete";
        ModelAction["deleteMany"] = "deleteMany";
    })(ModelAction = DMMF.ModelAction || (DMMF.ModelAction = {}));
})(DMMF = exports.DMMF || (exports.DMMF = {}));


/***/ }),

/***/ 433:
/***/ (function(module) {

"use strict";


module.exports = [
	'beforeError',
	'init',
	'beforeRequest',
	'beforeRedirect',
	'beforeRetry',
	'afterResponse'
];


/***/ }),

/***/ 453:
/***/ (function(module, __unusedexports, __webpack_require__) {

var once = __webpack_require__(49)
var eos = __webpack_require__(9)
var fs = __webpack_require__(747) // we only need fs to get the ReadStream and WriteStream prototypes

var noop = function () {}
var ancient = /^v?\.0/.test(process.version)

var isFn = function (fn) {
  return typeof fn === 'function'
}

var isFS = function (stream) {
  if (!ancient) return false // newer node version do not need to care about fs is a special way
  if (!fs) return false // browser
  return (stream instanceof (fs.ReadStream || noop) || stream instanceof (fs.WriteStream || noop)) && isFn(stream.close)
}

var isRequest = function (stream) {
  return stream.setHeader && isFn(stream.abort)
}

var destroyer = function (stream, reading, writing, callback) {
  callback = once(callback)

  var closed = false
  stream.on('close', function () {
    closed = true
  })

  eos(stream, {readable: reading, writable: writing}, function (err) {
    if (err) return callback(err)
    closed = true
    callback()
  })

  var destroyed = false
  return function (err) {
    if (closed) return
    if (destroyed) return
    destroyed = true

    if (isFS(stream)) return stream.close(noop) // use close for fs streams to avoid fd leaks
    if (isRequest(stream)) return stream.abort() // request.destroy just do .end - .abort is what we want

    if (isFn(stream.destroy)) return stream.destroy()

    callback(err || new Error('stream was destroyed'))
  }
}

var call = function (fn) {
  fn()
}

var pipe = function (from, to) {
  return from.pipe(to)
}

var pump = function () {
  var streams = Array.prototype.slice.call(arguments)
  var callback = isFn(streams[streams.length - 1] || noop) && streams.pop() || noop

  if (Array.isArray(streams[0])) streams = streams[0]
  if (streams.length < 2) throw new Error('pump requires two streams per minimum')

  var error
  var destroys = streams.map(function (stream, i) {
    var reading = i < streams.length - 1
    var writing = i > 0
    return destroyer(stream, reading, writing, function (err) {
      if (!error) error = err
      if (err) destroys.forEach(call)
      if (reading) return
      destroys.forEach(call)
      callback(error)
    })
  })

  return streams.reduce(pipe)
}

module.exports = pump


/***/ }),

/***/ 456:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const deferToConnect = __webpack_require__(308);

module.exports = request => {
	const timings = {
		start: Date.now(),
		socket: null,
		lookup: null,
		connect: null,
		upload: null,
		response: null,
		end: null,
		error: null,
		phases: {
			wait: null,
			dns: null,
			tcp: null,
			request: null,
			firstByte: null,
			download: null,
			total: null
		}
	};

	const handleError = origin => {
		const emit = origin.emit.bind(origin);
		origin.emit = (event, ...args) => {
			// Catches the `error` event
			if (event === 'error') {
				timings.error = Date.now();
				timings.phases.total = timings.error - timings.start;

				origin.emit = emit;
			}

			// Saves the original behavior
			return emit(event, ...args);
		};
	};

	let uploadFinished = false;
	const onUpload = () => {
		timings.upload = Date.now();
		timings.phases.request = timings.upload - timings.connect;
	};

	handleError(request);

	request.once('socket', socket => {
		timings.socket = Date.now();
		timings.phases.wait = timings.socket - timings.start;

		const lookupListener = () => {
			timings.lookup = Date.now();
			timings.phases.dns = timings.lookup - timings.socket;
		};

		socket.once('lookup', lookupListener);

		deferToConnect(socket, () => {
			timings.connect = Date.now();

			if (timings.lookup === null) {
				socket.removeListener('lookup', lookupListener);
				timings.lookup = timings.connect;
				timings.phases.dns = timings.lookup - timings.socket;
			}

			timings.phases.tcp = timings.connect - timings.lookup;

			if (uploadFinished && !timings.upload) {
				onUpload();
			}
		});
	});

	request.once('finish', () => {
		uploadFinished = true;

		if (timings.connect) {
			onUpload();
		}
	});

	request.once('response', response => {
		timings.response = Date.now();
		timings.phases.firstByte = timings.response - timings.upload;

		handleError(response);

		response.once('end', () => {
			timings.end = Date.now();
			timings.phases.download = timings.end - timings.response;
			timings.phases.total = timings.end - timings.start;
		});
	});

	return timings;
};


/***/ }),

/***/ 469:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strip_indent_1 = __importDefault(__webpack_require__(947));
function dedent(str) {
    return strip_indent_1.default(str);
}
exports.dedent = dedent;


/***/ }),

/***/ 474:
/***/ (function(module) {

"use strict";

module.exports = function (obj) {
	var ret = {};
	var keys = Object.keys(Object(obj));

	for (var i = 0; i < keys.length; i++) {
		ret[keys[i].toLowerCase()] = obj[keys[i]];
	}

	return ret;
};


/***/ }),

/***/ 478:
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function omit(object, path) {
    const result = {};
    const paths = Array.isArray(path) ? path : [path];
    for (const key in object) {
        if (object.hasOwnProperty(key) && !paths.includes(key)) {
            result[key] = object[key];
        }
    }
    return result;
}
exports.omit = omit;


/***/ }),

/***/ 482:
/***/ (function(module) {

module.exports = {"name":"got","version":"9.6.0","description":"Simplified HTTP requests","license":"MIT","repository":"sindresorhus/got","main":"source","engines":{"node":">=8.6"},"scripts":{"test":"xo && nyc ava","release":"np"},"files":["source"],"keywords":["http","https","get","got","url","uri","request","util","utility","simple","curl","wget","fetch","net","network","electron"],"dependencies":{"@sindresorhus/is":"^0.14.0","@szmarczak/http-timer":"^1.1.2","cacheable-request":"^6.0.0","decompress-response":"^3.3.0","duplexer3":"^0.1.4","get-stream":"^4.1.0","lowercase-keys":"^1.0.1","mimic-response":"^1.0.1","p-cancelable":"^1.0.0","to-readable-stream":"^1.0.0","url-parse-lax":"^3.0.0"},"devDependencies":{"ava":"^1.1.0","coveralls":"^3.0.0","delay":"^4.1.0","form-data":"^2.3.3","get-port":"^4.0.0","np":"^3.1.0","nyc":"^13.1.0","p-event":"^2.1.0","pem":"^1.13.2","proxyquire":"^2.0.1","sinon":"^7.2.2","slow-stream":"0.0.4","tempfile":"^2.0.0","tempy":"^0.2.1","tough-cookie":"^3.0.0","xo":"^0.24.0"},"ava":{"concurrency":4},"browser":{"decompress-response":false,"electron":false}};

/***/ }),

/***/ 486:
/***/ (function(module, __unusedexports, __webpack_require__) {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = __webpack_require__(317);

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* Active `debug` instances.
	*/
	createDebug.instances = [];

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return match;
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.enabled = createDebug.enabled(namespace);
		debug.useColors = createDebug.useColors();
		debug.color = selectColor(namespace);
		debug.destroy = destroy;
		debug.extend = extend;
		// Debug.formatArgs = formatArgs;
		// debug.rawLog = rawLog;

		// env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		createDebug.instances.push(debug);

		return debug;
	}

	function destroy() {
		const index = createDebug.instances.indexOf(this);
		if (index !== -1) {
			createDebug.instances.splice(index, 1);
			return true;
		}
		return false;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}

		for (i = 0; i < createDebug.instances.length; i++) {
			const instance = createDebug.instances[i];
			instance.enabled = createDebug.enabled(instance.namespace);
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;


/***/ }),

/***/ 504:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const is = __webpack_require__(534);

module.exports = body => is.nodeStream(body) && is.function(body.getBoundary);


/***/ }),

/***/ 534:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/// <reference lib="es2016"/>
/// <reference lib="es2017.sharedmemory"/>
/// <reference lib="esnext.asynciterable"/>
/// <reference lib="dom"/>
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: Use the `URL` global when targeting Node.js 10
// tslint:disable-next-line
const URLGlobal = typeof URL === 'undefined' ? __webpack_require__(835).URL : URL;
const toString = Object.prototype.toString;
const isOfType = (type) => (value) => typeof value === type;
const isBuffer = (input) => !is.nullOrUndefined(input) && !is.nullOrUndefined(input.constructor) && is.function_(input.constructor.isBuffer) && input.constructor.isBuffer(input);
const getObjectType = (value) => {
    const objectName = toString.call(value).slice(8, -1);
    if (objectName) {
        return objectName;
    }
    return null;
};
const isObjectOfType = (type) => (value) => getObjectType(value) === type;
function is(value) {
    switch (value) {
        case null:
            return "null" /* null */;
        case true:
        case false:
            return "boolean" /* boolean */;
        default:
    }
    switch (typeof value) {
        case 'undefined':
            return "undefined" /* undefined */;
        case 'string':
            return "string" /* string */;
        case 'number':
            return "number" /* number */;
        case 'symbol':
            return "symbol" /* symbol */;
        default:
    }
    if (is.function_(value)) {
        return "Function" /* Function */;
    }
    if (is.observable(value)) {
        return "Observable" /* Observable */;
    }
    if (Array.isArray(value)) {
        return "Array" /* Array */;
    }
    if (isBuffer(value)) {
        return "Buffer" /* Buffer */;
    }
    const tagType = getObjectType(value);
    if (tagType) {
        return tagType;
    }
    if (value instanceof String || value instanceof Boolean || value instanceof Number) {
        throw new TypeError('Please don\'t use object wrappers for primitive types');
    }
    return "Object" /* Object */;
}
(function (is) {
    // tslint:disable-next-line:strict-type-predicates
    const isObject = (value) => typeof value === 'object';
    // tslint:disable:variable-name
    is.undefined = isOfType('undefined');
    is.string = isOfType('string');
    is.number = isOfType('number');
    is.function_ = isOfType('function');
    // tslint:disable-next-line:strict-type-predicates
    is.null_ = (value) => value === null;
    is.class_ = (value) => is.function_(value) && value.toString().startsWith('class ');
    is.boolean = (value) => value === true || value === false;
    is.symbol = isOfType('symbol');
    // tslint:enable:variable-name
    is.numericString = (value) => is.string(value) && value.length > 0 && !Number.isNaN(Number(value));
    is.array = Array.isArray;
    is.buffer = isBuffer;
    is.nullOrUndefined = (value) => is.null_(value) || is.undefined(value);
    is.object = (value) => !is.nullOrUndefined(value) && (is.function_(value) || isObject(value));
    is.iterable = (value) => !is.nullOrUndefined(value) && is.function_(value[Symbol.iterator]);
    is.asyncIterable = (value) => !is.nullOrUndefined(value) && is.function_(value[Symbol.asyncIterator]);
    is.generator = (value) => is.iterable(value) && is.function_(value.next) && is.function_(value.throw);
    is.nativePromise = (value) => isObjectOfType("Promise" /* Promise */)(value);
    const hasPromiseAPI = (value) => !is.null_(value) &&
        isObject(value) &&
        is.function_(value.then) &&
        is.function_(value.catch);
    is.promise = (value) => is.nativePromise(value) || hasPromiseAPI(value);
    is.generatorFunction = isObjectOfType("GeneratorFunction" /* GeneratorFunction */);
    is.asyncFunction = isObjectOfType("AsyncFunction" /* AsyncFunction */);
    is.boundFunction = (value) => is.function_(value) && !value.hasOwnProperty('prototype');
    is.regExp = isObjectOfType("RegExp" /* RegExp */);
    is.date = isObjectOfType("Date" /* Date */);
    is.error = isObjectOfType("Error" /* Error */);
    is.map = (value) => isObjectOfType("Map" /* Map */)(value);
    is.set = (value) => isObjectOfType("Set" /* Set */)(value);
    is.weakMap = (value) => isObjectOfType("WeakMap" /* WeakMap */)(value);
    is.weakSet = (value) => isObjectOfType("WeakSet" /* WeakSet */)(value);
    is.int8Array = isObjectOfType("Int8Array" /* Int8Array */);
    is.uint8Array = isObjectOfType("Uint8Array" /* Uint8Array */);
    is.uint8ClampedArray = isObjectOfType("Uint8ClampedArray" /* Uint8ClampedArray */);
    is.int16Array = isObjectOfType("Int16Array" /* Int16Array */);
    is.uint16Array = isObjectOfType("Uint16Array" /* Uint16Array */);
    is.int32Array = isObjectOfType("Int32Array" /* Int32Array */);
    is.uint32Array = isObjectOfType("Uint32Array" /* Uint32Array */);
    is.float32Array = isObjectOfType("Float32Array" /* Float32Array */);
    is.float64Array = isObjectOfType("Float64Array" /* Float64Array */);
    is.arrayBuffer = isObjectOfType("ArrayBuffer" /* ArrayBuffer */);
    is.sharedArrayBuffer = isObjectOfType("SharedArrayBuffer" /* SharedArrayBuffer */);
    is.dataView = isObjectOfType("DataView" /* DataView */);
    is.directInstanceOf = (instance, klass) => Object.getPrototypeOf(instance) === klass.prototype;
    is.urlInstance = (value) => isObjectOfType("URL" /* URL */)(value);
    is.urlString = (value) => {
        if (!is.string(value)) {
            return false;
        }
        try {
            new URLGlobal(value); // tslint:disable-line no-unused-expression
            return true;
        }
        catch (_a) {
            return false;
        }
    };
    is.truthy = (value) => Boolean(value);
    is.falsy = (value) => !value;
    is.nan = (value) => Number.isNaN(value);
    const primitiveTypes = new Set([
        'undefined',
        'string',
        'number',
        'boolean',
        'symbol'
    ]);
    is.primitive = (value) => is.null_(value) || primitiveTypes.has(typeof value);
    is.integer = (value) => Number.isInteger(value);
    is.safeInteger = (value) => Number.isSafeInteger(value);
    is.plainObject = (value) => {
        // From: https://github.com/sindresorhus/is-plain-obj/blob/master/index.js
        let prototype;
        return getObjectType(value) === "Object" /* Object */ &&
            (prototype = Object.getPrototypeOf(value), prototype === null || // tslint:disable-line:ban-comma-operator
                prototype === Object.getPrototypeOf({}));
    };
    const typedArrayTypes = new Set([
        "Int8Array" /* Int8Array */,
        "Uint8Array" /* Uint8Array */,
        "Uint8ClampedArray" /* Uint8ClampedArray */,
        "Int16Array" /* Int16Array */,
        "Uint16Array" /* Uint16Array */,
        "Int32Array" /* Int32Array */,
        "Uint32Array" /* Uint32Array */,
        "Float32Array" /* Float32Array */,
        "Float64Array" /* Float64Array */
    ]);
    is.typedArray = (value) => {
        const objectType = getObjectType(value);
        if (objectType === null) {
            return false;
        }
        return typedArrayTypes.has(objectType);
    };
    const isValidLength = (value) => is.safeInteger(value) && value > -1;
    is.arrayLike = (value) => !is.nullOrUndefined(value) && !is.function_(value) && isValidLength(value.length);
    is.inRange = (value, range) => {
        if (is.number(range)) {
            return value >= Math.min(0, range) && value <= Math.max(range, 0);
        }
        if (is.array(range) && range.length === 2) {
            return value >= Math.min(...range) && value <= Math.max(...range);
        }
        throw new TypeError(`Invalid range: ${JSON.stringify(range)}`);
    };
    const NODE_TYPE_ELEMENT = 1;
    const DOM_PROPERTIES_TO_CHECK = [
        'innerHTML',
        'ownerDocument',
        'style',
        'attributes',
        'nodeValue'
    ];
    is.domElement = (value) => is.object(value) && value.nodeType === NODE_TYPE_ELEMENT && is.string(value.nodeName) &&
        !is.plainObject(value) && DOM_PROPERTIES_TO_CHECK.every(property => property in value);
    is.observable = (value) => {
        if (!value) {
            return false;
        }
        if (value[Symbol.observable] && value === value[Symbol.observable]()) {
            return true;
        }
        if (value['@@observable'] && value === value['@@observable']()) {
            return true;
        }
        return false;
    };
    is.nodeStream = (value) => !is.nullOrUndefined(value) && isObject(value) && is.function_(value.pipe) && !is.observable(value);
    is.infinite = (value) => value === Infinity || value === -Infinity;
    const isAbsoluteMod2 = (rem) => (value) => is.integer(value) && Math.abs(value % 2) === rem;
    is.even = isAbsoluteMod2(0);
    is.odd = isAbsoluteMod2(1);
    const isWhiteSpaceString = (value) => is.string(value) && /\S/.test(value) === false;
    is.emptyArray = (value) => is.array(value) && value.length === 0;
    is.nonEmptyArray = (value) => is.array(value) && value.length > 0;
    is.emptyString = (value) => is.string(value) && value.length === 0;
    is.nonEmptyString = (value) => is.string(value) && value.length > 0;
    is.emptyStringOrWhitespace = (value) => is.emptyString(value) || isWhiteSpaceString(value);
    is.emptyObject = (value) => is.object(value) && !is.map(value) && !is.set(value) && Object.keys(value).length === 0;
    is.nonEmptyObject = (value) => is.object(value) && !is.map(value) && !is.set(value) && Object.keys(value).length > 0;
    is.emptySet = (value) => is.set(value) && value.size === 0;
    is.nonEmptySet = (value) => is.set(value) && value.size > 0;
    is.emptyMap = (value) => is.map(value) && value.size === 0;
    is.nonEmptyMap = (value) => is.map(value) && value.size > 0;
    const predicateOnArray = (method, predicate, values) => {
        if (is.function_(predicate) === false) {
            throw new TypeError(`Invalid predicate: ${JSON.stringify(predicate)}`);
        }
        if (values.length === 0) {
            throw new TypeError('Invalid number of values');
        }
        return method.call(values, predicate);
    };
    // tslint:disable variable-name
    is.any = (predicate, ...values) => predicateOnArray(Array.prototype.some, predicate, values);
    is.all = (predicate, ...values) => predicateOnArray(Array.prototype.every, predicate, values);
    // tslint:enable variable-name
})(is || (is = {}));
// Some few keywords are reserved, but we'll populate them for Node.js users
// See https://github.com/Microsoft/TypeScript/issues/2536
Object.defineProperties(is, {
    class: {
        value: is.class_
    },
    function: {
        value: is.function_
    },
    null: {
        value: is.null_
    }
});
exports.default = is;
// For CommonJS default export support
module.exports = is;
module.exports.default = is;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 538:
/***/ (function(__unusedmodule, __unusedexports, __webpack_require__) {

"use strict";


var _arraySpeciesCreate = __webpack_require__(797);

var _arraySpeciesCreate2 = _interopRequireDefault(_arraySpeciesCreate);

var _flattenIntoArray = __webpack_require__(789);

var _flattenIntoArray2 = _interopRequireDefault(_flattenIntoArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (!Object.prototype.hasOwnProperty.call(Array.prototype, 'flatten')) {

  /**
   * @param {number=Infinity} depth
   */
  Array.prototype.flatten = function flatten(depth) {
    var o = Object(this);
    var a = (0, _arraySpeciesCreate2.default)(o, this.length);
    var depthNum = depth !== undefined ? Number(depth) : Infinity;
    (0, _flattenIntoArray2.default)(a, o, 0, depthNum);
    return a.filter(function (e) {
      return e !== undefined;
    });
  };
}
//# sourceMappingURL=flatten.js.map

/***/ }),

/***/ 557:
/***/ (function(module) {

"use strict";


class CancelError extends Error {
	constructor(reason) {
		super(reason || 'Promise was canceled');
		this.name = 'CancelError';
	}

	get isCanceled() {
		return true;
	}
}

class PCancelable {
	static fn(userFn) {
		return (...args) => {
			return new PCancelable((resolve, reject, onCancel) => {
				args.push(onCancel);
				userFn(...args).then(resolve, reject);
			});
		};
	}

	constructor(executor) {
		this._cancelHandlers = [];
		this._isPending = true;
		this._isCanceled = false;
		this._rejectOnCancel = true;

		this._promise = new Promise((resolve, reject) => {
			this._reject = reject;

			const onResolve = value => {
				this._isPending = false;
				resolve(value);
			};

			const onReject = error => {
				this._isPending = false;
				reject(error);
			};

			const onCancel = handler => {
				this._cancelHandlers.push(handler);
			};

			Object.defineProperties(onCancel, {
				shouldReject: {
					get: () => this._rejectOnCancel,
					set: bool => {
						this._rejectOnCancel = bool;
					}
				}
			});

			return executor(onResolve, onReject, onCancel);
		});
	}

	then(onFulfilled, onRejected) {
		return this._promise.then(onFulfilled, onRejected);
	}

	catch(onRejected) {
		return this._promise.catch(onRejected);
	}

	finally(onFinally) {
		return this._promise.finally(onFinally);
	}

	cancel(reason) {
		if (!this._isPending || this._isCanceled) {
			return;
		}

		if (this._cancelHandlers.length > 0) {
			try {
				for (const handler of this._cancelHandlers) {
					handler();
				}
			} catch (error) {
				this._reject(error);
			}
		}

		this._isCanceled = true;
		if (this._rejectOnCancel) {
			this._reject(new CancelError(reason));
		}
	}

	get isCanceled() {
		return this._isCanceled;
	}
}

Object.setPrototypeOf(PCancelable.prototype, Promise.prototype);

module.exports = PCancelable;
module.exports.default = PCancelable;

module.exports.CancelError = CancelError;


/***/ }),

/***/ 579:
/***/ (function(__unusedmodule, exports) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

var UNKNOWN_FUNCTION = '<unknown>';
/**
 * This parses the different stack traces and puts them into one format
 * This borrows heavily from TraceKit (https://github.com/csnover/TraceKit)
 */

function parse(stackString) {
  var lines = stackString.split('\n');
  return lines.reduce(function (stack, line) {
    var parseResult = parseChrome(line) || parseWinjs(line) || parseGecko(line) || parseJSC(line) || parseNode(line);

    if (parseResult) {
      stack.push(parseResult);
    }

    return stack;
  }, []);
}
var chromeRe = /^\s*at (.*?) ?\(((?:file|https?|blob|chrome-extension|native|eval|webpack|<anonymous>|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i;
var chromeEvalRe = /\((\S*)(?::(\d+))(?::(\d+))\)/;

function parseChrome(line) {
  var parts = chromeRe.exec(line);

  if (!parts) {
    return null;
  }

  var isNative = parts[2] && parts[2].indexOf('native') === 0; // start of line

  var isEval = parts[2] && parts[2].indexOf('eval') === 0; // start of line

  var submatch = chromeEvalRe.exec(parts[2]);

  if (isEval && submatch != null) {
    // throw out eval line/column and use top-most line/column number
    parts[2] = submatch[1]; // url

    parts[3] = submatch[2]; // line

    parts[4] = submatch[3]; // column
  }

  return {
    file: !isNative ? parts[2] : null,
    methodName: parts[1] || UNKNOWN_FUNCTION,
    arguments: isNative ? [parts[2]] : [],
    lineNumber: parts[3] ? +parts[3] : null,
    column: parts[4] ? +parts[4] : null
  };
}

var winjsRe = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i;

function parseWinjs(line) {
  var parts = winjsRe.exec(line);

  if (!parts) {
    return null;
  }

  return {
    file: parts[2],
    methodName: parts[1] || UNKNOWN_FUNCTION,
    arguments: [],
    lineNumber: +parts[3],
    column: parts[4] ? +parts[4] : null
  };
}

var geckoRe = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|resource|\[native).*?|[^@]*bundle)(?::(\d+))?(?::(\d+))?\s*$/i;
var geckoEvalRe = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i;

function parseGecko(line) {
  var parts = geckoRe.exec(line);

  if (!parts) {
    return null;
  }

  var isEval = parts[3] && parts[3].indexOf(' > eval') > -1;
  var submatch = geckoEvalRe.exec(parts[3]);

  if (isEval && submatch != null) {
    // throw out eval line/column and use top-most line number
    parts[3] = submatch[1];
    parts[4] = submatch[2];
    parts[5] = null; // no column when eval
  }

  return {
    file: parts[3],
    methodName: parts[1] || UNKNOWN_FUNCTION,
    arguments: parts[2] ? parts[2].split(',') : [],
    lineNumber: parts[4] ? +parts[4] : null,
    column: parts[5] ? +parts[5] : null
  };
}

var javaScriptCoreRe = /^(?:\s*([^@]*)(?:\((.*?)\))?@)?(\S.*?):(\d+)(?::(\d+))?\s*$/i;

function parseJSC(line) {
  var parts = javaScriptCoreRe.exec(line);

  if (!parts) {
    return null;
  }

  return {
    file: parts[3],
    methodName: parts[1] || UNKNOWN_FUNCTION,
    arguments: [],
    lineNumber: +parts[4],
    column: parts[5] ? +parts[5] : null
  };
}

var nodeRe = /^\s*at (?:((?:\[object object\])?\S+(?: \[as \S+\])?) )?\(?(.*?):(\d+)(?::(\d+))?\)?\s*$/i;

function parseNode(line) {
  var parts = nodeRe.exec(line);

  if (!parts) {
    return null;
  }

  return {
    file: parts[2],
    methodName: parts[1] || UNKNOWN_FUNCTION,
    arguments: [],
    lineNumber: +parts[3],
    column: parts[4] ? +parts[4] : null
  };
}

exports.parse = parse;


/***/ }),

/***/ 584:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const {URL} = __webpack_require__(835); // TODO: Use the `URL` global when targeting Node.js 10
const util = __webpack_require__(669);
const EventEmitter = __webpack_require__(614);
const http = __webpack_require__(605);
const https = __webpack_require__(211);
const urlLib = __webpack_require__(835);
const CacheableRequest = __webpack_require__(390);
const toReadableStream = __webpack_require__(952);
const is = __webpack_require__(534);
const timer = __webpack_require__(456);
const timedOut = __webpack_require__(18);
const getBodySize = __webpack_require__(57);
const getResponse = __webpack_require__(633);
const progress = __webpack_require__(365);
const {CacheError, UnsupportedProtocolError, MaxRedirectsError, RequestError, TimeoutError} = __webpack_require__(774);
const urlToOptions = __webpack_require__(811);

const getMethodRedirectCodes = new Set([300, 301, 302, 303, 304, 305, 307, 308]);
const allMethodRedirectCodes = new Set([300, 303, 307, 308]);

module.exports = (options, input) => {
	const emitter = new EventEmitter();
	const redirects = [];
	let currentRequest;
	let requestUrl;
	let redirectString;
	let uploadBodySize;
	let retryCount = 0;
	let shouldAbort = false;

	const setCookie = options.cookieJar ? util.promisify(options.cookieJar.setCookie.bind(options.cookieJar)) : null;
	const getCookieString = options.cookieJar ? util.promisify(options.cookieJar.getCookieString.bind(options.cookieJar)) : null;
	const agents = is.object(options.agent) ? options.agent : null;

	const emitError = async error => {
		try {
			for (const hook of options.hooks.beforeError) {
				// eslint-disable-next-line no-await-in-loop
				error = await hook(error);
			}

			emitter.emit('error', error);
		} catch (error2) {
			emitter.emit('error', error2);
		}
	};

	const get = async options => {
		const currentUrl = redirectString || requestUrl;

		if (options.protocol !== 'http:' && options.protocol !== 'https:') {
			throw new UnsupportedProtocolError(options);
		}

		decodeURI(currentUrl);

		let fn;
		if (is.function(options.request)) {
			fn = {request: options.request};
		} else {
			fn = options.protocol === 'https:' ? https : http;
		}

		if (agents) {
			const protocolName = options.protocol === 'https:' ? 'https' : 'http';
			options.agent = agents[protocolName] || options.agent;
		}

		/* istanbul ignore next: electron.net is broken */
		if (options.useElectronNet && process.versions.electron) {
			const r = ({x: require})['yx'.slice(1)]; // Trick webpack
			const electron = r('electron');
			fn = electron.net || electron.remote.net;
		}

		if (options.cookieJar) {
			const cookieString = await getCookieString(currentUrl, {});

			if (is.nonEmptyString(cookieString)) {
				options.headers.cookie = cookieString;
			}
		}

		let timings;
		const handleResponse = async response => {
			try {
				/* istanbul ignore next: fixes https://github.com/electron/electron/blob/cbb460d47628a7a146adf4419ed48550a98b2923/lib/browser/api/net.js#L59-L65 */
				if (options.useElectronNet) {
					response = new Proxy(response, {
						get: (target, name) => {
							if (name === 'trailers' || name === 'rawTrailers') {
								return [];
							}

							const value = target[name];
							return is.function(value) ? value.bind(target) : value;
						}
					});
				}

				const {statusCode} = response;
				response.url = currentUrl;
				response.requestUrl = requestUrl;
				response.retryCount = retryCount;
				response.timings = timings;
				response.redirectUrls = redirects;
				response.request = {
					gotOptions: options
				};

				const rawCookies = response.headers['set-cookie'];
				if (options.cookieJar && rawCookies) {
					await Promise.all(rawCookies.map(rawCookie => setCookie(rawCookie, response.url)));
				}

				if (options.followRedirect && 'location' in response.headers) {
					if (allMethodRedirectCodes.has(statusCode) || (getMethodRedirectCodes.has(statusCode) && (options.method === 'GET' || options.method === 'HEAD'))) {
						response.resume(); // We're being redirected, we don't care about the response.

						if (statusCode === 303) {
							// Server responded with "see other", indicating that the resource exists at another location,
							// and the client should request it from that location via GET or HEAD.
							options.method = 'GET';
						}

						if (redirects.length >= 10) {
							throw new MaxRedirectsError(statusCode, redirects, options);
						}

						// Handles invalid URLs. See https://github.com/sindresorhus/got/issues/604
						const redirectBuffer = Buffer.from(response.headers.location, 'binary').toString();
						const redirectURL = new URL(redirectBuffer, currentUrl);
						redirectString = redirectURL.toString();

						redirects.push(redirectString);

						const redirectOptions = {
							...options,
							...urlToOptions(redirectURL)
						};

						for (const hook of options.hooks.beforeRedirect) {
							// eslint-disable-next-line no-await-in-loop
							await hook(redirectOptions);
						}

						emitter.emit('redirect', response, redirectOptions);

						await get(redirectOptions);
						return;
					}
				}

				getResponse(response, options, emitter);
			} catch (error) {
				emitError(error);
			}
		};

		const handleRequest = request => {
			if (shouldAbort) {
				request.once('error', () => {});
				request.abort();
				return;
			}

			currentRequest = request;

			request.once('error', error => {
				if (request.aborted) {
					return;
				}

				if (error instanceof timedOut.TimeoutError) {
					error = new TimeoutError(error, options);
				} else {
					error = new RequestError(error, options);
				}

				if (emitter.retry(error) === false) {
					emitError(error);
				}
			});

			timings = timer(request);

			progress.upload(request, emitter, uploadBodySize);

			if (options.gotTimeout) {
				timedOut(request, options.gotTimeout, options);
			}

			emitter.emit('request', request);

			const uploadComplete = () => {
				request.emit('upload-complete');
			};

			try {
				if (is.nodeStream(options.body)) {
					options.body.once('end', uploadComplete);
					options.body.pipe(request);
					options.body = undefined;
				} else if (options.body) {
					request.end(options.body, uploadComplete);
				} else if (input && (options.method === 'POST' || options.method === 'PUT' || options.method === 'PATCH')) {
					input.once('end', uploadComplete);
					input.pipe(request);
				} else {
					request.end(uploadComplete);
				}
			} catch (error) {
				emitError(new RequestError(error, options));
			}
		};

		if (options.cache) {
			const cacheableRequest = new CacheableRequest(fn.request, options.cache);
			const cacheRequest = cacheableRequest(options, handleResponse);

			cacheRequest.once('error', error => {
				if (error instanceof CacheableRequest.RequestError) {
					emitError(new RequestError(error, options));
				} else {
					emitError(new CacheError(error, options));
				}
			});

			cacheRequest.once('request', handleRequest);
		} else {
			// Catches errors thrown by calling fn.request(...)
			try {
				handleRequest(fn.request(options, handleResponse));
			} catch (error) {
				emitError(new RequestError(error, options));
			}
		}
	};

	emitter.retry = error => {
		let backoff;

		try {
			backoff = options.retry.retries(++retryCount, error);
		} catch (error2) {
			emitError(error2);
			return;
		}

		if (backoff) {
			const retry = async options => {
				try {
					for (const hook of options.hooks.beforeRetry) {
						// eslint-disable-next-line no-await-in-loop
						await hook(options, error, retryCount);
					}

					await get(options);
				} catch (error) {
					emitError(error);
				}
			};

			setTimeout(retry, backoff, {...options, forceRefresh: true});
			return true;
		}

		return false;
	};

	emitter.abort = () => {
		if (currentRequest) {
			currentRequest.once('error', () => {});
			currentRequest.abort();
		} else {
			shouldAbort = true;
		}
	};

	setImmediate(async () => {
		try {
			// Convert buffer to stream to receive upload progress events (#322)
			const {body} = options;
			if (is.buffer(body)) {
				options.body = toReadableStream(body);
				uploadBodySize = body.length;
			} else {
				uploadBodySize = await getBodySize(options);
			}

			if (is.undefined(options.headers['content-length']) && is.undefined(options.headers['transfer-encoding'])) {
				if ((uploadBodySize > 0 || options.method === 'PUT') && !is.null(uploadBodySize)) {
					options.headers['content-length'] = uploadBodySize;
				}
			}

			for (const hook of options.hooks.beforeRequest) {
				// eslint-disable-next-line no-await-in-loop
				await hook(options);
			}

			requestUrl = options.href || (new URL(options.path, urlLib.format(options))).toString();

			await get(options);
		} catch (error) {
			emitError(error);
		}
	});

	return emitter;
};


/***/ }),

/***/ 592:
/***/ (function(module, __unusedexports, __webpack_require__) {

var conversions = __webpack_require__(600);
var route = __webpack_require__(260);

var convert = {};

var models = Object.keys(conversions);

function wrapRaw(fn) {
	var wrappedFn = function (args) {
		if (args === undefined || args === null) {
			return args;
		}

		if (arguments.length > 1) {
			args = Array.prototype.slice.call(arguments);
		}

		return fn(args);
	};

	// preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

function wrapRounded(fn) {
	var wrappedFn = function (args) {
		if (args === undefined || args === null) {
			return args;
		}

		if (arguments.length > 1) {
			args = Array.prototype.slice.call(arguments);
		}

		var result = fn(args);

		// we're assuming the result is an array here.
		// see notice in conversions.js; don't use box types
		// in conversion functions.
		if (typeof result === 'object') {
			for (var len = result.length, i = 0; i < len; i++) {
				result[i] = Math.round(result[i]);
			}
		}

		return result;
	};

	// preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

models.forEach(function (fromModel) {
	convert[fromModel] = {};

	Object.defineProperty(convert[fromModel], 'channels', {value: conversions[fromModel].channels});
	Object.defineProperty(convert[fromModel], 'labels', {value: conversions[fromModel].labels});

	var routes = route(fromModel);
	var routeModels = Object.keys(routes);

	routeModels.forEach(function (toModel) {
		var fn = routes[toModel];

		convert[fromModel][toModel] = wrapRounded(fn);
		convert[fromModel][toModel].raw = wrapRaw(fn);
	});
});

module.exports = convert;


/***/ }),

/***/ 600:
/***/ (function(module, __unusedexports, __webpack_require__) {

/* MIT license */
var cssKeywords = __webpack_require__(885);

// NOTE: conversions should only return primitive values (i.e. arrays, or
//       values that give correct `typeof` results).
//       do not use box values types (i.e. Number(), String(), etc.)

var reverseKeywords = {};
for (var key in cssKeywords) {
	if (cssKeywords.hasOwnProperty(key)) {
		reverseKeywords[cssKeywords[key]] = key;
	}
}

var convert = module.exports = {
	rgb: {channels: 3, labels: 'rgb'},
	hsl: {channels: 3, labels: 'hsl'},
	hsv: {channels: 3, labels: 'hsv'},
	hwb: {channels: 3, labels: 'hwb'},
	cmyk: {channels: 4, labels: 'cmyk'},
	xyz: {channels: 3, labels: 'xyz'},
	lab: {channels: 3, labels: 'lab'},
	lch: {channels: 3, labels: 'lch'},
	hex: {channels: 1, labels: ['hex']},
	keyword: {channels: 1, labels: ['keyword']},
	ansi16: {channels: 1, labels: ['ansi16']},
	ansi256: {channels: 1, labels: ['ansi256']},
	hcg: {channels: 3, labels: ['h', 'c', 'g']},
	apple: {channels: 3, labels: ['r16', 'g16', 'b16']},
	gray: {channels: 1, labels: ['gray']}
};

// hide .channels and .labels properties
for (var model in convert) {
	if (convert.hasOwnProperty(model)) {
		if (!('channels' in convert[model])) {
			throw new Error('missing channels property: ' + model);
		}

		if (!('labels' in convert[model])) {
			throw new Error('missing channel labels property: ' + model);
		}

		if (convert[model].labels.length !== convert[model].channels) {
			throw new Error('channel and label counts mismatch: ' + model);
		}

		var channels = convert[model].channels;
		var labels = convert[model].labels;
		delete convert[model].channels;
		delete convert[model].labels;
		Object.defineProperty(convert[model], 'channels', {value: channels});
		Object.defineProperty(convert[model], 'labels', {value: labels});
	}
}

convert.rgb.hsl = function (rgb) {
	var r = rgb[0] / 255;
	var g = rgb[1] / 255;
	var b = rgb[2] / 255;
	var min = Math.min(r, g, b);
	var max = Math.max(r, g, b);
	var delta = max - min;
	var h;
	var s;
	var l;

	if (max === min) {
		h = 0;
	} else if (r === max) {
		h = (g - b) / delta;
	} else if (g === max) {
		h = 2 + (b - r) / delta;
	} else if (b === max) {
		h = 4 + (r - g) / delta;
	}

	h = Math.min(h * 60, 360);

	if (h < 0) {
		h += 360;
	}

	l = (min + max) / 2;

	if (max === min) {
		s = 0;
	} else if (l <= 0.5) {
		s = delta / (max + min);
	} else {
		s = delta / (2 - max - min);
	}

	return [h, s * 100, l * 100];
};

convert.rgb.hsv = function (rgb) {
	var rdif;
	var gdif;
	var bdif;
	var h;
	var s;

	var r = rgb[0] / 255;
	var g = rgb[1] / 255;
	var b = rgb[2] / 255;
	var v = Math.max(r, g, b);
	var diff = v - Math.min(r, g, b);
	var diffc = function (c) {
		return (v - c) / 6 / diff + 1 / 2;
	};

	if (diff === 0) {
		h = s = 0;
	} else {
		s = diff / v;
		rdif = diffc(r);
		gdif = diffc(g);
		bdif = diffc(b);

		if (r === v) {
			h = bdif - gdif;
		} else if (g === v) {
			h = (1 / 3) + rdif - bdif;
		} else if (b === v) {
			h = (2 / 3) + gdif - rdif;
		}
		if (h < 0) {
			h += 1;
		} else if (h > 1) {
			h -= 1;
		}
	}

	return [
		h * 360,
		s * 100,
		v * 100
	];
};

convert.rgb.hwb = function (rgb) {
	var r = rgb[0];
	var g = rgb[1];
	var b = rgb[2];
	var h = convert.rgb.hsl(rgb)[0];
	var w = 1 / 255 * Math.min(r, Math.min(g, b));

	b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));

	return [h, w * 100, b * 100];
};

convert.rgb.cmyk = function (rgb) {
	var r = rgb[0] / 255;
	var g = rgb[1] / 255;
	var b = rgb[2] / 255;
	var c;
	var m;
	var y;
	var k;

	k = Math.min(1 - r, 1 - g, 1 - b);
	c = (1 - r - k) / (1 - k) || 0;
	m = (1 - g - k) / (1 - k) || 0;
	y = (1 - b - k) / (1 - k) || 0;

	return [c * 100, m * 100, y * 100, k * 100];
};

/**
 * See https://en.m.wikipedia.org/wiki/Euclidean_distance#Squared_Euclidean_distance
 * */
function comparativeDistance(x, y) {
	return (
		Math.pow(x[0] - y[0], 2) +
		Math.pow(x[1] - y[1], 2) +
		Math.pow(x[2] - y[2], 2)
	);
}

convert.rgb.keyword = function (rgb) {
	var reversed = reverseKeywords[rgb];
	if (reversed) {
		return reversed;
	}

	var currentClosestDistance = Infinity;
	var currentClosestKeyword;

	for (var keyword in cssKeywords) {
		if (cssKeywords.hasOwnProperty(keyword)) {
			var value = cssKeywords[keyword];

			// Compute comparative distance
			var distance = comparativeDistance(rgb, value);

			// Check if its less, if so set as closest
			if (distance < currentClosestDistance) {
				currentClosestDistance = distance;
				currentClosestKeyword = keyword;
			}
		}
	}

	return currentClosestKeyword;
};

convert.keyword.rgb = function (keyword) {
	return cssKeywords[keyword];
};

convert.rgb.xyz = function (rgb) {
	var r = rgb[0] / 255;
	var g = rgb[1] / 255;
	var b = rgb[2] / 255;

	// assume sRGB
	r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
	g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
	b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);

	var x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
	var y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
	var z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

	return [x * 100, y * 100, z * 100];
};

convert.rgb.lab = function (rgb) {
	var xyz = convert.rgb.xyz(rgb);
	var x = xyz[0];
	var y = xyz[1];
	var z = xyz[2];
	var l;
	var a;
	var b;

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

	l = (116 * y) - 16;
	a = 500 * (x - y);
	b = 200 * (y - z);

	return [l, a, b];
};

convert.hsl.rgb = function (hsl) {
	var h = hsl[0] / 360;
	var s = hsl[1] / 100;
	var l = hsl[2] / 100;
	var t1;
	var t2;
	var t3;
	var rgb;
	var val;

	if (s === 0) {
		val = l * 255;
		return [val, val, val];
	}

	if (l < 0.5) {
		t2 = l * (1 + s);
	} else {
		t2 = l + s - l * s;
	}

	t1 = 2 * l - t2;

	rgb = [0, 0, 0];
	for (var i = 0; i < 3; i++) {
		t3 = h + 1 / 3 * -(i - 1);
		if (t3 < 0) {
			t3++;
		}
		if (t3 > 1) {
			t3--;
		}

		if (6 * t3 < 1) {
			val = t1 + (t2 - t1) * 6 * t3;
		} else if (2 * t3 < 1) {
			val = t2;
		} else if (3 * t3 < 2) {
			val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
		} else {
			val = t1;
		}

		rgb[i] = val * 255;
	}

	return rgb;
};

convert.hsl.hsv = function (hsl) {
	var h = hsl[0];
	var s = hsl[1] / 100;
	var l = hsl[2] / 100;
	var smin = s;
	var lmin = Math.max(l, 0.01);
	var sv;
	var v;

	l *= 2;
	s *= (l <= 1) ? l : 2 - l;
	smin *= lmin <= 1 ? lmin : 2 - lmin;
	v = (l + s) / 2;
	sv = l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s);

	return [h, sv * 100, v * 100];
};

convert.hsv.rgb = function (hsv) {
	var h = hsv[0] / 60;
	var s = hsv[1] / 100;
	var v = hsv[2] / 100;
	var hi = Math.floor(h) % 6;

	var f = h - Math.floor(h);
	var p = 255 * v * (1 - s);
	var q = 255 * v * (1 - (s * f));
	var t = 255 * v * (1 - (s * (1 - f)));
	v *= 255;

	switch (hi) {
		case 0:
			return [v, t, p];
		case 1:
			return [q, v, p];
		case 2:
			return [p, v, t];
		case 3:
			return [p, q, v];
		case 4:
			return [t, p, v];
		case 5:
			return [v, p, q];
	}
};

convert.hsv.hsl = function (hsv) {
	var h = hsv[0];
	var s = hsv[1] / 100;
	var v = hsv[2] / 100;
	var vmin = Math.max(v, 0.01);
	var lmin;
	var sl;
	var l;

	l = (2 - s) * v;
	lmin = (2 - s) * vmin;
	sl = s * vmin;
	sl /= (lmin <= 1) ? lmin : 2 - lmin;
	sl = sl || 0;
	l /= 2;

	return [h, sl * 100, l * 100];
};

// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
convert.hwb.rgb = function (hwb) {
	var h = hwb[0] / 360;
	var wh = hwb[1] / 100;
	var bl = hwb[2] / 100;
	var ratio = wh + bl;
	var i;
	var v;
	var f;
	var n;

	// wh + bl cant be > 1
	if (ratio > 1) {
		wh /= ratio;
		bl /= ratio;
	}

	i = Math.floor(6 * h);
	v = 1 - bl;
	f = 6 * h - i;

	if ((i & 0x01) !== 0) {
		f = 1 - f;
	}

	n = wh + f * (v - wh); // linear interpolation

	var r;
	var g;
	var b;
	switch (i) {
		default:
		case 6:
		case 0: r = v; g = n; b = wh; break;
		case 1: r = n; g = v; b = wh; break;
		case 2: r = wh; g = v; b = n; break;
		case 3: r = wh; g = n; b = v; break;
		case 4: r = n; g = wh; b = v; break;
		case 5: r = v; g = wh; b = n; break;
	}

	return [r * 255, g * 255, b * 255];
};

convert.cmyk.rgb = function (cmyk) {
	var c = cmyk[0] / 100;
	var m = cmyk[1] / 100;
	var y = cmyk[2] / 100;
	var k = cmyk[3] / 100;
	var r;
	var g;
	var b;

	r = 1 - Math.min(1, c * (1 - k) + k);
	g = 1 - Math.min(1, m * (1 - k) + k);
	b = 1 - Math.min(1, y * (1 - k) + k);

	return [r * 255, g * 255, b * 255];
};

convert.xyz.rgb = function (xyz) {
	var x = xyz[0] / 100;
	var y = xyz[1] / 100;
	var z = xyz[2] / 100;
	var r;
	var g;
	var b;

	r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
	g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
	b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

	// assume sRGB
	r = r > 0.0031308
		? ((1.055 * Math.pow(r, 1.0 / 2.4)) - 0.055)
		: r * 12.92;

	g = g > 0.0031308
		? ((1.055 * Math.pow(g, 1.0 / 2.4)) - 0.055)
		: g * 12.92;

	b = b > 0.0031308
		? ((1.055 * Math.pow(b, 1.0 / 2.4)) - 0.055)
		: b * 12.92;

	r = Math.min(Math.max(0, r), 1);
	g = Math.min(Math.max(0, g), 1);
	b = Math.min(Math.max(0, b), 1);

	return [r * 255, g * 255, b * 255];
};

convert.xyz.lab = function (xyz) {
	var x = xyz[0];
	var y = xyz[1];
	var z = xyz[2];
	var l;
	var a;
	var b;

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

	l = (116 * y) - 16;
	a = 500 * (x - y);
	b = 200 * (y - z);

	return [l, a, b];
};

convert.lab.xyz = function (lab) {
	var l = lab[0];
	var a = lab[1];
	var b = lab[2];
	var x;
	var y;
	var z;

	y = (l + 16) / 116;
	x = a / 500 + y;
	z = y - b / 200;

	var y2 = Math.pow(y, 3);
	var x2 = Math.pow(x, 3);
	var z2 = Math.pow(z, 3);
	y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
	x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
	z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;

	x *= 95.047;
	y *= 100;
	z *= 108.883;

	return [x, y, z];
};

convert.lab.lch = function (lab) {
	var l = lab[0];
	var a = lab[1];
	var b = lab[2];
	var hr;
	var h;
	var c;

	hr = Math.atan2(b, a);
	h = hr * 360 / 2 / Math.PI;

	if (h < 0) {
		h += 360;
	}

	c = Math.sqrt(a * a + b * b);

	return [l, c, h];
};

convert.lch.lab = function (lch) {
	var l = lch[0];
	var c = lch[1];
	var h = lch[2];
	var a;
	var b;
	var hr;

	hr = h / 360 * 2 * Math.PI;
	a = c * Math.cos(hr);
	b = c * Math.sin(hr);

	return [l, a, b];
};

convert.rgb.ansi16 = function (args) {
	var r = args[0];
	var g = args[1];
	var b = args[2];
	var value = 1 in arguments ? arguments[1] : convert.rgb.hsv(args)[2]; // hsv -> ansi16 optimization

	value = Math.round(value / 50);

	if (value === 0) {
		return 30;
	}

	var ansi = 30
		+ ((Math.round(b / 255) << 2)
		| (Math.round(g / 255) << 1)
		| Math.round(r / 255));

	if (value === 2) {
		ansi += 60;
	}

	return ansi;
};

convert.hsv.ansi16 = function (args) {
	// optimization here; we already know the value and don't need to get
	// it converted for us.
	return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
};

convert.rgb.ansi256 = function (args) {
	var r = args[0];
	var g = args[1];
	var b = args[2];

	// we use the extended greyscale palette here, with the exception of
	// black and white. normal palette only has 4 greyscale shades.
	if (r === g && g === b) {
		if (r < 8) {
			return 16;
		}

		if (r > 248) {
			return 231;
		}

		return Math.round(((r - 8) / 247) * 24) + 232;
	}

	var ansi = 16
		+ (36 * Math.round(r / 255 * 5))
		+ (6 * Math.round(g / 255 * 5))
		+ Math.round(b / 255 * 5);

	return ansi;
};

convert.ansi16.rgb = function (args) {
	var color = args % 10;

	// handle greyscale
	if (color === 0 || color === 7) {
		if (args > 50) {
			color += 3.5;
		}

		color = color / 10.5 * 255;

		return [color, color, color];
	}

	var mult = (~~(args > 50) + 1) * 0.5;
	var r = ((color & 1) * mult) * 255;
	var g = (((color >> 1) & 1) * mult) * 255;
	var b = (((color >> 2) & 1) * mult) * 255;

	return [r, g, b];
};

convert.ansi256.rgb = function (args) {
	// handle greyscale
	if (args >= 232) {
		var c = (args - 232) * 10 + 8;
		return [c, c, c];
	}

	args -= 16;

	var rem;
	var r = Math.floor(args / 36) / 5 * 255;
	var g = Math.floor((rem = args % 36) / 6) / 5 * 255;
	var b = (rem % 6) / 5 * 255;

	return [r, g, b];
};

convert.rgb.hex = function (args) {
	var integer = ((Math.round(args[0]) & 0xFF) << 16)
		+ ((Math.round(args[1]) & 0xFF) << 8)
		+ (Math.round(args[2]) & 0xFF);

	var string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert.hex.rgb = function (args) {
	var match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
	if (!match) {
		return [0, 0, 0];
	}

	var colorString = match[0];

	if (match[0].length === 3) {
		colorString = colorString.split('').map(function (char) {
			return char + char;
		}).join('');
	}

	var integer = parseInt(colorString, 16);
	var r = (integer >> 16) & 0xFF;
	var g = (integer >> 8) & 0xFF;
	var b = integer & 0xFF;

	return [r, g, b];
};

convert.rgb.hcg = function (rgb) {
	var r = rgb[0] / 255;
	var g = rgb[1] / 255;
	var b = rgb[2] / 255;
	var max = Math.max(Math.max(r, g), b);
	var min = Math.min(Math.min(r, g), b);
	var chroma = (max - min);
	var grayscale;
	var hue;

	if (chroma < 1) {
		grayscale = min / (1 - chroma);
	} else {
		grayscale = 0;
	}

	if (chroma <= 0) {
		hue = 0;
	} else
	if (max === r) {
		hue = ((g - b) / chroma) % 6;
	} else
	if (max === g) {
		hue = 2 + (b - r) / chroma;
	} else {
		hue = 4 + (r - g) / chroma + 4;
	}

	hue /= 6;
	hue %= 1;

	return [hue * 360, chroma * 100, grayscale * 100];
};

convert.hsl.hcg = function (hsl) {
	var s = hsl[1] / 100;
	var l = hsl[2] / 100;
	var c = 1;
	var f = 0;

	if (l < 0.5) {
		c = 2.0 * s * l;
	} else {
		c = 2.0 * s * (1.0 - l);
	}

	if (c < 1.0) {
		f = (l - 0.5 * c) / (1.0 - c);
	}

	return [hsl[0], c * 100, f * 100];
};

convert.hsv.hcg = function (hsv) {
	var s = hsv[1] / 100;
	var v = hsv[2] / 100;

	var c = s * v;
	var f = 0;

	if (c < 1.0) {
		f = (v - c) / (1 - c);
	}

	return [hsv[0], c * 100, f * 100];
};

convert.hcg.rgb = function (hcg) {
	var h = hcg[0] / 360;
	var c = hcg[1] / 100;
	var g = hcg[2] / 100;

	if (c === 0.0) {
		return [g * 255, g * 255, g * 255];
	}

	var pure = [0, 0, 0];
	var hi = (h % 1) * 6;
	var v = hi % 1;
	var w = 1 - v;
	var mg = 0;

	switch (Math.floor(hi)) {
		case 0:
			pure[0] = 1; pure[1] = v; pure[2] = 0; break;
		case 1:
			pure[0] = w; pure[1] = 1; pure[2] = 0; break;
		case 2:
			pure[0] = 0; pure[1] = 1; pure[2] = v; break;
		case 3:
			pure[0] = 0; pure[1] = w; pure[2] = 1; break;
		case 4:
			pure[0] = v; pure[1] = 0; pure[2] = 1; break;
		default:
			pure[0] = 1; pure[1] = 0; pure[2] = w;
	}

	mg = (1.0 - c) * g;

	return [
		(c * pure[0] + mg) * 255,
		(c * pure[1] + mg) * 255,
		(c * pure[2] + mg) * 255
	];
};

convert.hcg.hsv = function (hcg) {
	var c = hcg[1] / 100;
	var g = hcg[2] / 100;

	var v = c + g * (1.0 - c);
	var f = 0;

	if (v > 0.0) {
		f = c / v;
	}

	return [hcg[0], f * 100, v * 100];
};

convert.hcg.hsl = function (hcg) {
	var c = hcg[1] / 100;
	var g = hcg[2] / 100;

	var l = g * (1.0 - c) + 0.5 * c;
	var s = 0;

	if (l > 0.0 && l < 0.5) {
		s = c / (2 * l);
	} else
	if (l >= 0.5 && l < 1.0) {
		s = c / (2 * (1 - l));
	}

	return [hcg[0], s * 100, l * 100];
};

convert.hcg.hwb = function (hcg) {
	var c = hcg[1] / 100;
	var g = hcg[2] / 100;
	var v = c + g * (1.0 - c);
	return [hcg[0], (v - c) * 100, (1 - v) * 100];
};

convert.hwb.hcg = function (hwb) {
	var w = hwb[1] / 100;
	var b = hwb[2] / 100;
	var v = 1 - b;
	var c = v - w;
	var g = 0;

	if (c < 1) {
		g = (v - c) / (1 - c);
	}

	return [hwb[0], c * 100, g * 100];
};

convert.apple.rgb = function (apple) {
	return [(apple[0] / 65535) * 255, (apple[1] / 65535) * 255, (apple[2] / 65535) * 255];
};

convert.rgb.apple = function (rgb) {
	return [(rgb[0] / 255) * 65535, (rgb[1] / 255) * 65535, (rgb[2] / 255) * 65535];
};

convert.gray.rgb = function (args) {
	return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
};

convert.gray.hsl = convert.gray.hsv = function (args) {
	return [0, 0, args[0]];
};

convert.gray.hwb = function (gray) {
	return [0, 100, gray[0]];
};

convert.gray.cmyk = function (gray) {
	return [0, 0, 0, gray[0]];
};

convert.gray.lab = function (gray) {
	return [gray[0], 0, 0];
};

convert.gray.hex = function (gray) {
	var val = Math.round(gray[0] / 100 * 255) & 0xFF;
	var integer = (val << 16) + (val << 8) + val;

	var string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert.rgb.gray = function (rgb) {
	var val = (rgb[0] + rgb[1] + rgb[2]) / 3;
	return [val / 255 * 100];
};


/***/ }),

/***/ 605:
/***/ (function(module) {

module.exports = require("http");

/***/ }),

/***/ 608:
/***/ (function(__unusedmodule, exports) {

"use strict";

// Taken from https://github.com/unclechu/node-deep-extend/blob/master/lib/deep-extend.js
// es2017-ified, now it's about 2.5 times faster
/*!
 * @description Recursive object extending
 * @author Viacheslav Lotsmanov <lotsmanov89@gmail.com>
 * @license MIT
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2013-2018 Viacheslav Lotsmanov
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable */
function isSpecificValue(val) {
    return val instanceof Buffer || val instanceof Date || val instanceof RegExp ? true : false;
}
function cloneSpecificValue(val) {
    if (val instanceof Buffer) {
        const x = Buffer.alloc ? Buffer.alloc(val.length) : new Buffer(val.length);
        val.copy(x);
        return x;
    }
    else if (val instanceof Date) {
        return new Date(val.getTime());
    }
    else if (val instanceof RegExp) {
        return new RegExp(val);
    }
    else {
        throw new Error('Unexpected situation');
    }
}
/**
 * Recursive cloning array.
 */
function deepCloneArray(arr) {
    const clone = [];
    arr.forEach(function (item, index) {
        if (typeof item === 'object' && item !== null) {
            if (Array.isArray(item)) {
                clone[index] = deepCloneArray(item);
            }
            else if (isSpecificValue(item)) {
                clone[index] = cloneSpecificValue(item);
            }
            else {
                clone[index] = exports.deepExtend({}, item);
            }
        }
        else {
            clone[index] = item;
        }
    });
    return clone;
}
function safeGetProperty(object, property) {
    return property === '__proto__' ? undefined : object[property];
}
/**
 * Extening object that entered in first argument.
 *
 * Returns extended object or false if have no target object or incorrect type.
 *
 * If you wish to clone source object (without modify it), just use empty new
 * object as first argument, like this:
 *   deepExtend({}, yourObj_1, [yourObj_N]);
 */
exports.deepExtend = function (target, ...args) {
    if (!target || typeof target !== 'object') {
        return false;
    }
    if (args.length === 0) {
        return target;
    }
    let val, src;
    for (const obj of args) {
        // skip argument if isn't an object, is null, or is an array
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            continue;
        }
        for (const key of Object.keys(obj)) {
            src = safeGetProperty(target, key); // source value
            val = safeGetProperty(obj, key); // new value
            // recursion prevention
            if (val === target) {
                continue;
                /**
                 * if new value isn't object then just overwrite by new value
                 * instead of extending.
                 */
            }
            else if (typeof val !== 'object' || val === null) {
                target[key] = val;
                continue;
                // just clone arrays (and recursive clone objects inside)
            }
            else if (Array.isArray(val)) {
                target[key] = deepCloneArray(val);
                continue;
                // custom cloning and overwrite for specific objects
            }
            else if (isSpecificValue(val)) {
                target[key] = cloneSpecificValue(val);
                continue;
                // overwrite by new value if source isn't object or array
            }
            else if (typeof src !== 'object' || src === null || Array.isArray(src)) {
                target[key] = exports.deepExtend({}, val);
                continue;
                // source value and new value is objects both, extending...
            }
            else {
                target[key] = exports.deepExtend(src, val);
                continue;
            }
        }
    }
    return target;
};
// @ts-ignore-end


/***/ }),

/***/ 614:
/***/ (function(module) {

module.exports = require("events");

/***/ }),

/***/ 622:
/***/ (function(module) {

module.exports = require("path");

/***/ }),

/***/ 631:
/***/ (function(module) {

module.exports = require("net");

/***/ }),

/***/ 633:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const decompressResponse = __webpack_require__(861);
const is = __webpack_require__(534);
const mimicResponse = __webpack_require__(89);
const progress = __webpack_require__(365);

module.exports = (response, options, emitter) => {
	const downloadBodySize = Number(response.headers['content-length']) || null;

	const progressStream = progress.download(response, emitter, downloadBodySize);

	mimicResponse(response, progressStream);

	const newResponse = options.decompress === true &&
		is.function(decompressResponse) &&
		options.method !== 'HEAD' ? decompressResponse(progressStream) : progressStream;

	if (!options.decompress && ['gzip', 'deflate'].includes(response.headers['content-encoding'])) {
		options.encoding = null;
	}

	emitter.emit('response', newResponse);

	emitter.emit('downloadProgress', {
		percent: 0,
		transferred: 0,
		total: downloadBodySize
	});

	response.pipe(progressStream);
};


/***/ }),

/***/ 637:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(__webpack_require__(946));
exports.orange = chalk_1.default.rgb(246, 145, 95);
exports.darkBrightBlue = chalk_1.default.rgb(107, 139, 140);
exports.blue = chalk_1.default.cyan;
exports.brightBlue = chalk_1.default.rgb(127, 155, 155);
exports.identity = str => str;
exports.theme = {
    keyword: exports.blue,
    entity: exports.blue,
    value: exports.brightBlue,
    punctuation: exports.darkBrightBlue,
    directive: exports.blue,
    function: exports.blue,
    variable: exports.brightBlue,
    string: chalk_1.default.greenBright,
    boolean: exports.orange,
    number: chalk_1.default.cyan,
    comment: chalk_1.default.grey,
};


/***/ }),

/***/ 643:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const indent_string_1 = __importDefault(__webpack_require__(257));
function printDatasources(dataSources, internalDatasources) {
    const mergedInternalDataSources = internalDatasources.map(internalDataSource => {
        const override = dataSources[internalDataSource.name];
        if (!override) {
            return internalDataSource;
        }
        if (typeof override === 'string') {
            return Object.assign({}, internalDataSource, { url: {
                    value: override,
                    fromEnvVar: null,
                } });
        }
        const { url } = override, rest = __rest(override, ["url"]);
        return Object.assign({}, internalDataSource, rest, { url: {
                value: override.url,
                fromEnvVar: null,
            } });
    });
    return mergedInternalDataSources.map(d => String(new InternalDataSourceClass(d))).join('\n\n');
}
exports.printDatasources = printDatasources;
const tab = 2;
class InternalDataSourceClass {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    toString() {
        const { dataSource } = this;
        const obj = {
            provider: dataSource.connectorType,
            url: dataSource.url,
        };
        if (dataSource.config && typeof dataSource.config === 'object') {
            Object.assign(obj, dataSource.config);
        }
        return `datasource ${dataSource.name} {
${indent_string_1.default(printDatamodelObject(obj), tab)}
}`;
    }
}
function printDatamodelObject(obj) {
    const maxLength = Object.keys(obj).reduce((max, curr) => Math.max(max, curr.length), 0);
    return Object.entries(obj)
        .map(([key, value]) => `${key.padEnd(maxLength)} = ${JSON.stringify(value)}`)
        .join('\n');
}
exports.printDatamodelObject = printDatamodelObject;


/***/ }),

/***/ 659:
/***/ (function(module) {

"use strict";

module.exports = (function()
{
  function _min(d0, d1, d2, bx, ay)
  {
    return d0 < d1 || d2 < d1
        ? d0 > d2
            ? d2 + 1
            : d0 + 1
        : bx === ay
            ? d1
            : d1 + 1;
  }

  return function(a, b)
  {
    if (a === b) {
      return 0;
    }

    if (a.length > b.length) {
      var tmp = a;
      a = b;
      b = tmp;
    }

    var la = a.length;
    var lb = b.length;

    while (la > 0 && (a.charCodeAt(la - 1) === b.charCodeAt(lb - 1))) {
      la--;
      lb--;
    }

    var offset = 0;

    while (offset < la && (a.charCodeAt(offset) === b.charCodeAt(offset))) {
      offset++;
    }

    la -= offset;
    lb -= offset;

    if (la === 0 || lb < 3) {
      return lb;
    }

    var x = 0;
    var y;
    var d0;
    var d1;
    var d2;
    var d3;
    var dd;
    var dy;
    var ay;
    var bx0;
    var bx1;
    var bx2;
    var bx3;

    var vector = [];

    for (y = 0; y < la; y++) {
      vector.push(y + 1);
      vector.push(a.charCodeAt(offset + y));
    }

    var len = vector.length - 1;

    for (; x < lb - 3;) {
      bx0 = b.charCodeAt(offset + (d0 = x));
      bx1 = b.charCodeAt(offset + (d1 = x + 1));
      bx2 = b.charCodeAt(offset + (d2 = x + 2));
      bx3 = b.charCodeAt(offset + (d3 = x + 3));
      dd = (x += 4);
      for (y = 0; y < len; y += 2) {
        dy = vector[y];
        ay = vector[y + 1];
        d0 = _min(dy, d0, d1, bx0, ay);
        d1 = _min(d0, d1, d2, bx1, ay);
        d2 = _min(d1, d2, d3, bx2, ay);
        dd = _min(d2, d3, dd, bx3, ay);
        vector[y] = dd;
        d3 = d2;
        d2 = d1;
        d1 = d0;
        d0 = dy;
      }
    }

    for (; x < lb;) {
      bx0 = b.charCodeAt(offset + (d0 = x));
      dd = ++x;
      for (y = 0; y < len; y += 2) {
        dy = vector[y];
        vector[y] = dd = _min(dy, d0, dd, bx0, vector[y + 1]);
        d0 = dy;
      }
    }

    return dd;
  };
})();



/***/ }),

/***/ 663:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";
/* module decorator */ module = __webpack_require__.nmd(module);

const colorConvert = __webpack_require__(592);

const wrapAnsi16 = (fn, offset) => function () {
	const code = fn.apply(colorConvert, arguments);
	return `\u001B[${code + offset}m`;
};

const wrapAnsi256 = (fn, offset) => function () {
	const code = fn.apply(colorConvert, arguments);
	return `\u001B[${38 + offset};5;${code}m`;
};

const wrapAnsi16m = (fn, offset) => function () {
	const rgb = fn.apply(colorConvert, arguments);
	return `\u001B[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
};

function assembleStyles() {
	const codes = new Map();
	const styles = {
		modifier: {
			reset: [0, 0],
			// 21 isn't widely supported and 22 does the same thing
			bold: [1, 22],
			dim: [2, 22],
			italic: [3, 23],
			underline: [4, 24],
			inverse: [7, 27],
			hidden: [8, 28],
			strikethrough: [9, 29]
		},
		color: {
			black: [30, 39],
			red: [31, 39],
			green: [32, 39],
			yellow: [33, 39],
			blue: [34, 39],
			magenta: [35, 39],
			cyan: [36, 39],
			white: [37, 39],
			gray: [90, 39],

			// Bright color
			redBright: [91, 39],
			greenBright: [92, 39],
			yellowBright: [93, 39],
			blueBright: [94, 39],
			magentaBright: [95, 39],
			cyanBright: [96, 39],
			whiteBright: [97, 39]
		},
		bgColor: {
			bgBlack: [40, 49],
			bgRed: [41, 49],
			bgGreen: [42, 49],
			bgYellow: [43, 49],
			bgBlue: [44, 49],
			bgMagenta: [45, 49],
			bgCyan: [46, 49],
			bgWhite: [47, 49],

			// Bright color
			bgBlackBright: [100, 49],
			bgRedBright: [101, 49],
			bgGreenBright: [102, 49],
			bgYellowBright: [103, 49],
			bgBlueBright: [104, 49],
			bgMagentaBright: [105, 49],
			bgCyanBright: [106, 49],
			bgWhiteBright: [107, 49]
		}
	};

	// Fix humans
	styles.color.grey = styles.color.gray;

	for (const groupName of Object.keys(styles)) {
		const group = styles[groupName];

		for (const styleName of Object.keys(group)) {
			const style = group[styleName];

			styles[styleName] = {
				open: `\u001B[${style[0]}m`,
				close: `\u001B[${style[1]}m`
			};

			group[styleName] = styles[styleName];

			codes.set(style[0], style[1]);
		}

		Object.defineProperty(styles, groupName, {
			value: group,
			enumerable: false
		});

		Object.defineProperty(styles, 'codes', {
			value: codes,
			enumerable: false
		});
	}

	const ansi2ansi = n => n;
	const rgb2rgb = (r, g, b) => [r, g, b];

	styles.color.close = '\u001B[39m';
	styles.bgColor.close = '\u001B[49m';

	styles.color.ansi = {
		ansi: wrapAnsi16(ansi2ansi, 0)
	};
	styles.color.ansi256 = {
		ansi256: wrapAnsi256(ansi2ansi, 0)
	};
	styles.color.ansi16m = {
		rgb: wrapAnsi16m(rgb2rgb, 0)
	};

	styles.bgColor.ansi = {
		ansi: wrapAnsi16(ansi2ansi, 10)
	};
	styles.bgColor.ansi256 = {
		ansi256: wrapAnsi256(ansi2ansi, 10)
	};
	styles.bgColor.ansi16m = {
		rgb: wrapAnsi16m(rgb2rgb, 10)
	};

	for (let key of Object.keys(colorConvert)) {
		if (typeof colorConvert[key] !== 'object') {
			continue;
		}

		const suite = colorConvert[key];

		if (key === 'ansi16') {
			key = 'ansi';
		}

		if ('ansi16' in suite) {
			styles.color.ansi[key] = wrapAnsi16(suite.ansi16, 0);
			styles.bgColor.ansi[key] = wrapAnsi16(suite.ansi16, 10);
		}

		if ('ansi256' in suite) {
			styles.color.ansi256[key] = wrapAnsi256(suite.ansi256, 0);
			styles.bgColor.ansi256[key] = wrapAnsi256(suite.ansi256, 10);
		}

		if ('rgb' in suite) {
			styles.color.ansi16m[key] = wrapAnsi16m(suite.rgb, 0);
			styles.bgColor.ansi16m[key] = wrapAnsi16m(suite.rgb, 10);
		}
	}

	return styles;
}

// Make the export immutable
Object.defineProperty(module, 'exports', {
	enumerable: true,
	get: assembleStyles
});


/***/ }),

/***/ 664:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(__webpack_require__(946));
const indent_string_1 = __importDefault(__webpack_require__(257));
const js_levenshtein_1 = __importDefault(__webpack_require__(659));
exports.keyBy = (collection, iteratee) => {
    return collection.reduce((acc, curr) => {
        acc[iteratee(curr)] = curr;
        return acc;
    }, {});
};
exports.ScalarTypeTable = {
    String: true,
    Int: true,
    Float: true,
    Boolean: true,
    Long: true,
    DateTime: true,
    ID: true,
    UUID: true,
    Json: true,
};
function isScalar(str) {
    if (typeof str !== 'string') {
        return false;
    }
    return exports.ScalarTypeTable[str] || false;
}
exports.isScalar = isScalar;
exports.GraphQLScalarToJSTypeTable = {
    String: 'string',
    Int: 'number',
    Float: 'number',
    Boolean: 'boolean',
    Long: 'number',
    DateTime: ['string', 'Date'],
    ID: 'string',
    UUID: 'string',
    Json: 'object',
};
exports.JSTypeToGraphQLType = {
    string: 'String',
    boolean: 'Boolean',
    object: 'Json',
};
function stringifyGraphQLType(type) {
    if (typeof type === 'string') {
        return type;
    }
    return type.name;
}
exports.stringifyGraphQLType = stringifyGraphQLType;
function wrapWithList(str, isList) {
    if (isList) {
        return `List<${str}>`;
    }
    return str;
}
exports.wrapWithList = wrapWithList;
function getGraphQLType(value, potentialType) {
    if (value === null) {
        return 'null';
    }
    if (Array.isArray(value)) {
        const scalarTypes = value.reduce((acc, val) => {
            const type = getGraphQLType(val, potentialType);
            if (!acc.includes(type)) {
                acc.push(type);
            }
            return acc;
        }, []);
        return `List<${scalarTypes.join(' | ')}>`;
    }
    const jsType = typeof value;
    if (jsType === 'number') {
        if (Math.trunc(value) === value) {
            return 'Int';
        }
        else {
            return 'Float';
        }
    }
    if (value instanceof Date) {
        return 'DateTime';
    }
    if (jsType === 'string') {
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
            return 'UUID';
        }
        const date = new Date(value);
        if (potentialType &&
            typeof potentialType === 'object' &&
            potentialType.values &&
            potentialType.values.includes(value)) {
            return potentialType.name;
        }
        if (date.toString() === 'Invalid Date') {
            return 'String';
        }
        if (date.toISOString() === value) {
            return 'DateTime';
        }
    }
    return exports.JSTypeToGraphQLType[jsType];
}
exports.getGraphQLType = getGraphQLType;
function graphQLToJSType(gql) {
    return exports.GraphQLScalarToJSTypeTable[gql];
}
exports.graphQLToJSType = graphQLToJSType;
function getSuggestion(str, possibilities) {
    const bestMatch = possibilities.reduce((acc, curr) => {
        const distance = js_levenshtein_1.default(str, curr);
        if (distance < acc.distance) {
            return {
                distance,
                str: curr,
            };
        }
        return acc;
    }, {
        // heuristic to be not too strict, but allow some big mistakes (<= ~ 5)
        distance: Math.min(Math.floor(str.length) * 1.1, ...possibilities.map(p => p.length * 3)),
        str: null,
    });
    return bestMatch.str;
}
exports.getSuggestion = getSuggestion;
function stringifyInputType(input, greenKeys = false) {
    if (typeof input === 'string') {
        return input;
    }
    if (input.values) {
        return `enum ${input.name} {\n${indent_string_1.default(input.values.join(', '), 2)}\n}`;
    }
    else {
        const body = indent_string_1.default(input.fields // TS doesn't discriminate based on existence of fields properly
            .map(arg => {
            const argInputType = arg.inputType[0];
            const key = `${arg.name}`;
            const str = `${greenKeys ? chalk_1.default.green(key) : key}${argInputType.isRequired ? '' : '?'}: ${chalk_1.default.white(arg.inputType
                .map(argType => argIsInputType(argType.type)
                ? argType.type.name
                : wrapWithList(stringifyGraphQLType(argType.type), argType.isList))
                .join(' | '))}`;
            if (!argInputType.isRequired) {
                return chalk_1.default.dim(str);
            }
            return str;
        })
            .join('\n'), 2);
        return `${chalk_1.default.dim('type')} ${chalk_1.default.bold.dim(input.name)} ${chalk_1.default.dim('{')}\n${body}\n${chalk_1.default.dim('}')}`;
    }
}
exports.stringifyInputType = stringifyInputType;
function argIsInputType(arg) {
    if (typeof arg === 'string') {
        return false;
    }
    return true;
}
function getInputTypeName(input) {
    if (typeof input === 'string') {
        return input;
    }
    return input.name;
}
exports.getInputTypeName = getInputTypeName;
function getOutputTypeName(input) {
    if (typeof input === 'string') {
        return input;
    }
    return input.name;
}
exports.getOutputTypeName = getOutputTypeName;
function inputTypeToJson(input, isRequired, nameOnly = false) {
    if (typeof input === 'string') {
        return input;
    }
    if (input.values) {
        return input.values.join(' | ');
    }
    // TS "Trick" :/
    const inputType = input;
    // If the parent type is required and all fields are non-scalars,
    // it's very useful to show to the user, which options they actually have
    const showDeepType = isRequired &&
        inputType.fields.every(arg => arg.inputType[0].kind === 'object') &&
        !inputType.isWhereType &&
        !inputType.atLeastOne;
    if (nameOnly) {
        return getInputTypeName(input);
    }
    return inputType.fields.reduce((acc, curr) => {
        const argInputType = curr.inputType[0];
        acc[curr.name + (argInputType.isRequired ? '' : '?')] =
            curr.isRelationFilter && !showDeepType && !argInputType.isRequired
                ? getInputTypeName(argInputType.type)
                : inputTypeToJson(argInputType.type, argInputType.isRequired, true);
        return acc;
    }, {});
}
exports.inputTypeToJson = inputTypeToJson;
function destroyCircular(from, seen = []) {
    const to = Array.isArray(from) ? [] : {};
    seen.push(from);
    for (const key of Object.keys(from)) {
        const value = from[key];
        if (typeof value === 'function') {
            continue;
        }
        if (!value || typeof value !== 'object') {
            to[key] = value;
            continue;
        }
        if (seen.indexOf(from[key]) === -1) {
            to[key] = destroyCircular(from[key], seen.slice(0));
            continue;
        }
        to[key] = '[Circular]';
    }
    if (typeof from.name === 'string') {
        to.name = from.name;
    }
    if (typeof from.message === 'string') {
        to.message = from.message;
    }
    if (typeof from.stack === 'string') {
        to.stack = from.stack;
    }
    return to;
}
exports.destroyCircular = destroyCircular;
function unionBy(arr1, arr2, iteratee) {
    const map = {};
    for (const element of arr1) {
        map[iteratee(element)] = element;
    }
    for (const element of arr2) {
        const key = iteratee(element);
        if (!map[key]) {
            map[key] = element;
        }
    }
    return Object.values(map);
}
exports.unionBy = unionBy;
function uniqBy(arr, iteratee) {
    const map = {};
    for (const element of arr) {
        map[iteratee(element)] = element;
    }
    return Object.values(map);
}
exports.uniqBy = uniqBy;
function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
}
exports.capitalize = capitalize;
/**
 * Converts the first character of a word to lower case
 * @param name
 */
function lowerCase(name) {
    return name.substring(0, 1).toLowerCase() + name.substring(1);
}
exports.lowerCase = lowerCase;


/***/ }),

/***/ 669:
/***/ (function(module) {

module.exports = require("util");

/***/ }),

/***/ 705:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const pump = __webpack_require__(453);
const bufferStream = __webpack_require__(72);

class MaxBufferError extends Error {
	constructor() {
		super('maxBuffer exceeded');
		this.name = 'MaxBufferError';
	}
}

function getStream(inputStream, options) {
	if (!inputStream) {
		return Promise.reject(new Error('Expected a stream'));
	}

	options = Object.assign({maxBuffer: Infinity}, options);

	const {maxBuffer} = options;

	let stream;
	return new Promise((resolve, reject) => {
		const rejectPromise = error => {
			if (error) { // A null check
				error.bufferedData = stream.getBufferedValue();
			}
			reject(error);
		};

		stream = pump(inputStream, bufferStream(options), error => {
			if (error) {
				rejectPromise(error);
				return;
			}

			resolve();
		});

		stream.on('data', () => {
			if (stream.getBufferedLength() > maxBuffer) {
				rejectPromise(new MaxBufferError());
			}
		});
	}).then(() => stream.getBufferedValue());
}

module.exports = getStream;
module.exports.buffer = (stream, options) => getStream(stream, Object.assign({}, options, {encoding: 'buffer'}));
module.exports.array = (stream, options) => getStream(stream, Object.assign({}, options, {array: true}));
module.exports.MaxBufferError = MaxBufferError;


/***/ }),

/***/ 715:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __importDefault(__webpack_require__(87));
const fs_1 = __importDefault(__webpack_require__(747));
const util_1 = __webpack_require__(669);
const child_process_1 = __webpack_require__(129);
const debug_1 = __importDefault(__webpack_require__(784));
const debug = debug_1.default('getos');
const readFile = util_1.promisify(fs_1.default.readFile);
const exists = util_1.promisify(fs_1.default.exists);
async function getos() {
    const platform = os_1.default.platform();
    if (platform !== 'linux') {
        return {
            platform,
        };
    }
    return {
        platform: 'linux',
        libssl: await getLibSslVersion(),
        distro: await resolveUbuntu(),
    };
}
exports.getos = getos;
async function resolveUbuntu() {
    if (await exists('/etc/lsb-release')) {
        const idRegex = /distrib_id=(.*)/i;
        const releaseRegex = /distrib_release=(.*)/i;
        const codenameRegex = /distrib_codename=(.*)/i;
        const file = await readFile('/etc/lsb-release', 'utf-8');
        const idMatch = file.match(idRegex);
        const id = (idMatch && idMatch[1]) || null;
        const codenameMatch = file.match(codenameRegex);
        const codename = (codenameMatch && codenameMatch[1]) || null;
        const releaseMatch = file.match(releaseRegex);
        const release = (releaseMatch && releaseMatch[1]) || null;
        if (id && codename && release && id.toLowerCase() === 'ubuntu') {
            return { dist: id, release, codename };
        }
    }
    return null;
}
exports.resolveUbuntu = resolveUbuntu;
async function getLibSslVersion() {
    const [version, ls] = await Promise.all([
        gracefulExec(`openssl version -v`),
        gracefulExec(`ls -l /lib64 | grep ssl;
    ls -l /usr/lib64 | grep ssl`),
    ]);
    debug({ version });
    debug({ ls });
    if (version) {
        const match = /^OpenSSL\s(\d+\.\d+\.\d+)/.exec(version);
        if (match) {
            return match[1];
        }
    }
    if (ls) {
        const match = /libssl\.so\.(\d+\.\d+\.\d+)/.exec(ls);
        if (match) {
            return match[1];
        }
    }
    return undefined;
}
exports.getLibSslVersion = getLibSslVersion;
async function gracefulExec(cmd) {
    return new Promise(resolve => {
        try {
            child_process_1.exec(cmd, (err, stdout, stderr) => {
                resolve(String(stdout));
            });
        }
        catch (e) {
            resolve(undefined);
            return undefined;
        }
    });
}
async function getPlatform() {
    const { platform, libssl, distro } = await getos();
    debug({ platform, libssl });
    if (platform === 'darwin') {
        return 'darwin';
    }
    if (platform === 'win32') {
        return 'windows';
    }
    if (platform === 'linux' && libssl) {
        if (libssl === '1.0.2') {
            if (distro && distro.codename === 'xenial') {
                return 'linux-glibc-libssl1.0.2-ubuntu1604';
            }
            return 'linux-glibc-libssl1.0.2';
        }
        if (libssl === '1.0.1') {
            return 'linux-glibc-libssl1.0.1';
        }
    }
    return 'linux-glibc-libssl1.1.0';
}
exports.getPlatform = getPlatform;
//# sourceMappingURL=getPlatform.js.map

/***/ }),

/***/ 718:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


var stream = __webpack_require__(413);

function DuplexWrapper(options, writable, readable) {
  if (typeof readable === "undefined") {
    readable = writable;
    writable = options;
    options = null;
  }

  stream.Duplex.call(this, options);

  if (typeof readable.read !== "function") {
    readable = (new stream.Readable(options)).wrap(readable);
  }

  this._writable = writable;
  this._readable = readable;
  this._waiting = false;

  var self = this;

  writable.once("finish", function() {
    self.end();
  });

  this.once("finish", function() {
    writable.end();
  });

  readable.on("readable", function() {
    if (self._waiting) {
      self._waiting = false;
      self._read();
    }
  });

  readable.once("end", function() {
    self.push(null);
  });

  if (!options || typeof options.bubbleErrors === "undefined" || options.bubbleErrors) {
    writable.on("error", function(err) {
      self.emit("error", err);
    });

    readable.on("error", function(err) {
      self.emit("error", err);
    });
  }
}

DuplexWrapper.prototype = Object.create(stream.Duplex.prototype, {constructor: {value: DuplexWrapper}});

DuplexWrapper.prototype._write = function _write(input, encoding, done) {
  this._writable.write(input, encoding, done);
};

DuplexWrapper.prototype._read = function _read() {
  var buf;
  var reads = 0;
  while ((buf = this._readable.read()) !== null) {
    this.push(buf);
    reads++;
  }
  if (reads === 0) {
    this._waiting = true;
  }
};

module.exports = function duplex2(options, writable, readable) {
  return new DuplexWrapper(options, writable, readable);
};

module.exports.DuplexWrapper = DuplexWrapper;


/***/ }),

/***/ 721:
/***/ (function(__unusedmodule, exports) {

"use strict";

// Taken from https://gist.github.com/LukeChannings/15c92cef5a016a8b21a0
/* tslint:disable */
Object.defineProperty(exports, "__esModule", { value: true });
// ensure the keys being passed is an array of key paths
// example: 'a.b' becomes ['a', 'b'] unless it was already ['a', 'b']
const keys = (ks) => (Array.isArray(ks) ? ks : ks.split('.'));
// traverse the set of keys left to right,
// returning the current value in each iteration.
// if at any point the value for the current key does not exist,
// return the default value
exports.deepGet = (o, kp, d) => keys(kp).reduce((o, k) => (o && o[k]) || d, o);
// traverse the set of keys right to left,
// returning a new object containing both properties from the object
// we were originally passed and our new property.
//
// Example:
// If o = { a: { b: { c: 1 } } }
//
// deepSet(o, ['a', 'b', 'c'], 2) will progress thus:
// 1. c = Object.assign({}, {c: 1}, { c: 2 })
// 2. b = Object.assign({}, { b: { c: 1 } }, { b: c })
// 3. returned = Object.assign({}, { a: { b: { c: 1 } } }, { a: b })
exports.deepSet = (o, kp, v) => keys(kp).reduceRight((v, k, i, ks) => Object.assign({}, exports.deepGet(o, ks.slice(0, i)), { [k]: v }), v);


/***/ }),

/***/ 747:
/***/ (function(module) {

module.exports = require("fs");

/***/ }),

/***/ 754:
/***/ (function(module) {

"use strict";


module.exports = input => Object.prototype.toString.call(input) === '[object RegExp]';


/***/ }),

/***/ 755:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(664);
class DMMFClass {
    constructor({ datamodel, schema, mappings }) {
        this.outputTypeMap = {};
        this.outputTypeToMergedOutputType = (outputType) => {
            const model = this.modelMap[outputType.name];
            return Object.assign({}, outputType, { isEmbedded: model ? model.isEmbedded : false, fields: outputType.fields });
        };
        this.datamodel = datamodel;
        this.schema = schema;
        this.mappings = mappings;
        this.enumMap = this.getEnumMap();
        this.queryType = this.getQueryType();
        this.mutationType = this.getMutationType();
        this.modelMap = this.getModelMap();
        this.outputTypes = this.getOutputTypes();
        this.resolveOutputTypes(this.outputTypes);
        this.inputTypes = this.schema.inputTypes;
        this.resolveInputTypes(this.inputTypes);
        this.inputTypeMap = this.getInputTypeMap();
        this.resolveFieldArgumentTypes(this.outputTypes, this.inputTypeMap);
        this.outputTypeMap = this.getMergedOutputTypeMap();
        // needed as references are not kept
        this.queryType = this.outputTypeMap.Query;
        this.mutationType = this.outputTypeMap.Mutation;
        this.outputTypes = this.outputTypes;
    }
    getField(fieldName) {
        return (
        // TODO: create lookup table for Query and Mutation
        this.queryType.fields.find(f => f.name === fieldName) || this.mutationType.fields.find(f => f.name === fieldName));
    }
    resolveOutputTypes(types) {
        for (const typeA of types) {
            for (const fieldA of typeA.fields) {
                for (const typeB of types) {
                    if (typeof fieldA.outputType.type === 'string') {
                        if (fieldA.outputType.type === typeB.name) {
                            fieldA.outputType.type = typeB;
                        }
                        else if (this.enumMap[fieldA.outputType.type]) {
                            fieldA.outputType.type = this.enumMap[fieldA.outputType.type];
                        }
                    }
                }
            }
        }
    }
    resolveInputTypes(types) {
        for (const typeA of types) {
            for (const fieldA of typeA.fields) {
                for (const typeB of types) {
                    fieldA.inputType.forEach((inputType, index) => {
                        if (typeof inputType.type === 'string') {
                            if (inputType.type === typeB.name) {
                                fieldA.inputType[index].type = typeB;
                            }
                            else if (this.enumMap[inputType.type]) {
                                fieldA.inputType[index].type = this.enumMap[inputType.type];
                            }
                        }
                    });
                }
            }
        }
    }
    resolveFieldArgumentTypes(types, inputTypeMap) {
        for (const type of types) {
            for (const field of type.fields) {
                for (const arg of field.args) {
                    arg.inputType.forEach((t, index) => {
                        if (typeof t.type === 'string') {
                            if (inputTypeMap[t.type]) {
                                arg.inputType[index].type = inputTypeMap[t.type];
                            }
                            else if (this.enumMap[t.type]) {
                                arg.inputType[index].type = this.enumMap[t.type];
                            }
                        }
                    });
                }
            }
        }
    }
    getQueryType() {
        return this.schema.outputTypes.find(t => t.name === 'Query');
    }
    getMutationType() {
        return this.schema.outputTypes.find(t => t.name === 'Mutation');
    }
    getOutputTypes() {
        return this.schema.outputTypes.map(this.outputTypeToMergedOutputType);
    }
    getEnumMap() {
        return common_1.keyBy(this.schema.enums, e => e.name);
    }
    getModelMap() {
        return common_1.keyBy(this.datamodel.models, m => m.name);
    }
    getMergedOutputTypeMap() {
        return common_1.keyBy(this.outputTypes, t => t.name);
    }
    getInputTypeMap() {
        return common_1.keyBy(this.schema.inputTypes, t => t.name);
    }
}
exports.DMMFClass = DMMFClass;


/***/ }),

/***/ 761:
/***/ (function(module) {

module.exports = require("zlib");

/***/ }),

/***/ 774:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const urlLib = __webpack_require__(835);
const http = __webpack_require__(605);
const PCancelable = __webpack_require__(557);
const is = __webpack_require__(534);

class GotError extends Error {
	constructor(message, error, options) {
		super(message);
		Error.captureStackTrace(this, this.constructor);
		this.name = 'GotError';

		if (!is.undefined(error.code)) {
			this.code = error.code;
		}

		Object.assign(this, {
			host: options.host,
			hostname: options.hostname,
			method: options.method,
			path: options.path,
			socketPath: options.socketPath,
			protocol: options.protocol,
			url: options.href,
			gotOptions: options
		});
	}
}

module.exports.GotError = GotError;

module.exports.CacheError = class extends GotError {
	constructor(error, options) {
		super(error.message, error, options);
		this.name = 'CacheError';
	}
};

module.exports.RequestError = class extends GotError {
	constructor(error, options) {
		super(error.message, error, options);
		this.name = 'RequestError';
	}
};

module.exports.ReadError = class extends GotError {
	constructor(error, options) {
		super(error.message, error, options);
		this.name = 'ReadError';
	}
};

module.exports.ParseError = class extends GotError {
	constructor(error, statusCode, options, data) {
		super(`${error.message} in "${urlLib.format(options)}": \n${data.slice(0, 77)}...`, error, options);
		this.name = 'ParseError';
		this.statusCode = statusCode;
		this.statusMessage = http.STATUS_CODES[this.statusCode];
	}
};

module.exports.HTTPError = class extends GotError {
	constructor(response, options) {
		const {statusCode} = response;
		let {statusMessage} = response;

		if (statusMessage) {
			statusMessage = statusMessage.replace(/\r?\n/g, ' ').trim();
		} else {
			statusMessage = http.STATUS_CODES[statusCode];
		}

		super(`Response code ${statusCode} (${statusMessage})`, {}, options);
		this.name = 'HTTPError';
		this.statusCode = statusCode;
		this.statusMessage = statusMessage;
		this.headers = response.headers;
		this.body = response.body;
	}
};

module.exports.MaxRedirectsError = class extends GotError {
	constructor(statusCode, redirectUrls, options) {
		super('Redirected 10 times. Aborting.', {}, options);
		this.name = 'MaxRedirectsError';
		this.statusCode = statusCode;
		this.statusMessage = http.STATUS_CODES[this.statusCode];
		this.redirectUrls = redirectUrls;
	}
};

module.exports.UnsupportedProtocolError = class extends GotError {
	constructor(options) {
		super(`Unsupported protocol "${options.protocol}"`, {}, options);
		this.name = 'UnsupportedProtocolError';
	}
};

module.exports.TimeoutError = class extends GotError {
	constructor(error, options) {
		super(error.message, {code: 'ETIMEDOUT'}, options);
		this.name = 'TimeoutError';
		this.event = error.event;
	}
};

module.exports.CancelError = PCancelable.CancelError;


/***/ }),

/***/ 784:
/***/ (function(module, __unusedexports, __webpack_require__) {

/**
 * Detect Electron renderer / nwjs process, which is node, but we should
 * treat as a browser.
 */

if (typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs) {
	module.exports = __webpack_require__(408);
} else {
	module.exports = __webpack_require__(81);
}


/***/ }),

/***/ 789:
/***/ (function(__unusedmodule, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = flattenIntoArray;
/**
 * @template T, U
 * @param {Array<U>} target
 * @param {Array<T>} source
 * @param {number} start
 * @param {number} depth
 * @param {function(T): U[]} mapperFunction
 * @param {Array<T>} thisArg
 * @returns {number}
 */
function flattenIntoArray(target, source, start, depth, mapperFunction, thisArg) {

  var mapperFunctionProvied = mapperFunction !== undefined;
  var targetIndex = start;
  var sourceIndex = 0;
  var sourceLen = source.length;
  while (sourceIndex < sourceLen) {
    var p = sourceIndex;
    var exists = !!source[p];
    if (exists === true) {
      var element = source[p];
      if (element) {
        if (mapperFunctionProvied) {
          element = mapperFunction.call(thisArg, element, sourceIndex, target);
        }
        var spreadable = Object.getOwnPropertySymbols(element).includes(Symbol.isConcatSpreadable) || Array.isArray(element);
        if (spreadable === true && depth > 0) {
          var nextIndex = flattenIntoArray(target, element, targetIndex, depth - 1);
          targetIndex = nextIndex;
        } else {
          if (!Number.isSafeInteger(targetIndex)) {
            throw TypeError();
          }
          target[targetIndex] = element;
        }
      }
    }
    targetIndex += 1;
    sourceIndex += 1;
  }
  return targetIndex;
}
//# sourceMappingURL=flatten-into-array.js.map

/***/ }),

/***/ 794:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const {PassThrough} = __webpack_require__(413);
const duplexer3 = __webpack_require__(718);
const requestAsEventEmitter = __webpack_require__(584);
const {HTTPError, ReadError} = __webpack_require__(774);

module.exports = options => {
	const input = new PassThrough();
	const output = new PassThrough();
	const proxy = duplexer3(input, output);
	const piped = new Set();
	let isFinished = false;

	options.retry.retries = () => 0;

	if (options.body) {
		proxy.write = () => {
			throw new Error('Got\'s stream is not writable when the `body` option is used');
		};
	}

	const emitter = requestAsEventEmitter(options, input);

	// Cancels the request
	proxy._destroy = emitter.abort;

	emitter.on('response', response => {
		const {statusCode} = response;

		response.on('error', error => {
			proxy.emit('error', new ReadError(error, options));
		});

		if (options.throwHttpErrors && statusCode !== 304 && (statusCode < 200 || statusCode > 299)) {
			proxy.emit('error', new HTTPError(response, options), null, response);
			return;
		}

		isFinished = true;

		response.pipe(output);

		for (const destination of piped) {
			if (destination.headersSent) {
				continue;
			}

			for (const [key, value] of Object.entries(response.headers)) {
				// Got gives *decompressed* data. Overriding `content-encoding` header would result in an error.
				// It's not possible to decompress already decompressed data, is it?
				const allowed = options.decompress ? key !== 'content-encoding' : true;
				if (allowed) {
					destination.setHeader(key, value);
				}
			}

			destination.statusCode = response.statusCode;
		}

		proxy.emit('response', response);
	});

	[
		'error',
		'request',
		'redirect',
		'uploadProgress',
		'downloadProgress'
	].forEach(event => emitter.on(event, (...args) => proxy.emit(event, ...args)));

	const pipe = proxy.pipe.bind(proxy);
	const unpipe = proxy.unpipe.bind(proxy);
	proxy.pipe = (destination, options) => {
		if (isFinished) {
			throw new Error('Failed to pipe. The response has been emitted already.');
		}

		const result = pipe(destination, options);

		if (Reflect.has(destination, 'setHeader')) {
			piped.add(destination);
		}

		return result;
	};

	proxy.unpipe = stream => {
		piped.delete(stream);
		return unpipe(stream);
	};

	return proxy;
};


/***/ }),

/***/ 797:
/***/ (function(__unusedmodule, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = arraySpeciesCreate;
/**
 * @template T
 * @param {T[]} originalArray
 * @param {number} length
 * @returns {T[]}
 */
function arraySpeciesCreate(originalArray, length) {
  var isArray = Array.isArray(originalArray);
  if (!isArray) {
    return Array(length);
  }
  /**
   * @type {ArrayConstructor|undefined|null} C
   */
  var C = Object.getPrototypeOf(originalArray).constructor;
  if (C) {
    // If IsConstructor(C) is true... not sure how this can be reliably checked without invoking it. Likely not insignificant.
    if ((typeof C === 'undefined' ? 'undefined' : _typeof(C)) === 'object' || typeof C === 'function') {
      C = C[Symbol.species.toString()];
      C = C !== null ? C : undefined;
    }
    if (C === undefined) {
      return Array(length);
    }
    if (typeof C !== 'function') {
      throw TypeError('invalid constructor');
    }
    /** @type {Array} */
    var result = new C(length);
    return result;
  }
}
//# sourceMappingURL=array-species-create.js.map

/***/ }),

/***/ 798:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const pkg = __webpack_require__(482);
const create = __webpack_require__(338);

const defaults = {
	options: {
		retry: {
			retries: 2,
			methods: [
				'GET',
				'PUT',
				'HEAD',
				'DELETE',
				'OPTIONS',
				'TRACE'
			],
			statusCodes: [
				408,
				413,
				429,
				500,
				502,
				503,
				504
			],
			errorCodes: [
				'ETIMEDOUT',
				'ECONNRESET',
				'EADDRINUSE',
				'ECONNREFUSED',
				'EPIPE',
				'ENOTFOUND',
				'ENETUNREACH',
				'EAI_AGAIN'
			]
		},
		headers: {
			'user-agent': `${pkg.name}/${pkg.version} (https://github.com/sindresorhus/got)`
		},
		hooks: {
			beforeRequest: [],
			beforeRedirect: [],
			beforeRetry: [],
			afterResponse: []
		},
		decompress: true,
		throwHttpErrors: true,
		followRedirect: true,
		stream: false,
		form: false,
		json: false,
		cache: false,
		useElectronNet: false
	},
	mutableDefaults: false
};

const got = create(defaults);

module.exports = got;


/***/ }),

/***/ 804:
/***/ (function(module) {

"use strict";


module.exports = value => {
	const type = typeof value;
	return value !== null && (type === 'object' || type === 'function');
};


/***/ }),

/***/ 811:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const is = __webpack_require__(534);

module.exports = url => {
	const options = {
		protocol: url.protocol,
		hostname: url.hostname.startsWith('[') ? url.hostname.slice(1, -1) : url.hostname,
		hash: url.hash,
		search: url.search,
		pathname: url.pathname,
		href: url.href
	};

	if (is.string(url.port) && url.port.length > 0) {
		options.port = Number(url.port);
	}

	if (url.username || url.password) {
		options.auth = `${url.username}:${url.password}`;
	}

	options.path = is.null(url.search) ? url.pathname : `${url.pathname}${url.search}`;

	return options;
};


/***/ }),

/***/ 821:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const {URL} = __webpack_require__(835);
const is = __webpack_require__(534);
const knownHookEvents = __webpack_require__(433);

const merge = (target, ...sources) => {
	for (const source of sources) {
		for (const [key, sourceValue] of Object.entries(source)) {
			if (is.undefined(sourceValue)) {
				continue;
			}

			const targetValue = target[key];
			if (is.urlInstance(targetValue) && (is.urlInstance(sourceValue) || is.string(sourceValue))) {
				target[key] = new URL(sourceValue, targetValue);
			} else if (is.plainObject(sourceValue)) {
				if (is.plainObject(targetValue)) {
					target[key] = merge({}, targetValue, sourceValue);
				} else {
					target[key] = merge({}, sourceValue);
				}
			} else if (is.array(sourceValue)) {
				target[key] = merge([], sourceValue);
			} else {
				target[key] = sourceValue;
			}
		}
	}

	return target;
};

const mergeOptions = (...sources) => {
	sources = sources.map(source => source || {});
	const merged = merge({}, ...sources);

	const hooks = {};
	for (const hook of knownHookEvents) {
		hooks[hook] = [];
	}

	for (const source of sources) {
		if (source.hooks) {
			for (const hook of knownHookEvents) {
				hooks[hook] = hooks[hook].concat(source.hooks[hook]);
			}
		}
	}

	merged.hooks = hooks;

	return merged;
};

const mergeInstances = (instances, methods) => {
	const handlers = instances.map(instance => instance.defaults.handler);
	const size = instances.length - 1;

	return {
		methods,
		options: mergeOptions(...instances.map(instance => instance.defaults.options)),
		handler: (options, next) => {
			let iteration = -1;
			const iterate = options => handlers[++iteration](options, iteration === size ? next : iterate);

			return iterate(options);
		}
	};
};

module.exports = merge;
module.exports.options = mergeOptions;
module.exports.instances = mergeInstances;


/***/ }),

/***/ 835:
/***/ (function(module) {

module.exports = require("url");

/***/ }),

/***/ 841:
/***/ (function(module) {

"use strict";

const TEMPLATE_REGEX = /(?:\\(u[a-f\d]{4}|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi;
const STYLE_REGEX = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g;
const STRING_REGEX = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/;
const ESCAPE_REGEX = /\\(u[a-f\d]{4}|x[a-f\d]{2}|.)|([^\\])/gi;

const ESCAPES = new Map([
	['n', '\n'],
	['r', '\r'],
	['t', '\t'],
	['b', '\b'],
	['f', '\f'],
	['v', '\v'],
	['0', '\0'],
	['\\', '\\'],
	['e', '\u001B'],
	['a', '\u0007']
]);

function unescape(c) {
	if ((c[0] === 'u' && c.length === 5) || (c[0] === 'x' && c.length === 3)) {
		return String.fromCharCode(parseInt(c.slice(1), 16));
	}

	return ESCAPES.get(c) || c;
}

function parseArguments(name, args) {
	const results = [];
	const chunks = args.trim().split(/\s*,\s*/g);
	let matches;

	for (const chunk of chunks) {
		if (!isNaN(chunk)) {
			results.push(Number(chunk));
		} else if ((matches = chunk.match(STRING_REGEX))) {
			results.push(matches[2].replace(ESCAPE_REGEX, (m, escape, chr) => escape ? unescape(escape) : chr));
		} else {
			throw new Error(`Invalid Chalk template style argument: ${chunk} (in style '${name}')`);
		}
	}

	return results;
}

function parseStyle(style) {
	STYLE_REGEX.lastIndex = 0;

	const results = [];
	let matches;

	while ((matches = STYLE_REGEX.exec(style)) !== null) {
		const name = matches[1];

		if (matches[2]) {
			const args = parseArguments(name, matches[2]);
			results.push([name].concat(args));
		} else {
			results.push([name]);
		}
	}

	return results;
}

function buildStyle(chalk, styles) {
	const enabled = {};

	for (const layer of styles) {
		for (const style of layer.styles) {
			enabled[style[0]] = layer.inverse ? null : style.slice(1);
		}
	}

	let current = chalk;
	for (const styleName of Object.keys(enabled)) {
		if (Array.isArray(enabled[styleName])) {
			if (!(styleName in current)) {
				throw new Error(`Unknown Chalk style: ${styleName}`);
			}

			if (enabled[styleName].length > 0) {
				current = current[styleName].apply(current, enabled[styleName]);
			} else {
				current = current[styleName];
			}
		}
	}

	return current;
}

module.exports = (chalk, tmp) => {
	const styles = [];
	const chunks = [];
	let chunk = [];

	// eslint-disable-next-line max-params
	tmp.replace(TEMPLATE_REGEX, (m, escapeChar, inverse, style, close, chr) => {
		if (escapeChar) {
			chunk.push(unescape(escapeChar));
		} else if (style) {
			const str = chunk.join('');
			chunk = [];
			chunks.push(styles.length === 0 ? str : buildStyle(chalk, styles)(str));
			styles.push({inverse, styles: parseStyle(style)});
		} else if (close) {
			if (styles.length === 0) {
				throw new Error('Found extraneous } in Chalk template literal');
			}

			chunks.push(buildStyle(chalk, styles)(chunk.join('')));
			chunk = [];
			styles.pop();
		} else {
			chunk.push(chr);
		}
	});

	chunks.push(chunk.join(''));

	if (styles.length > 0) {
		const errMsg = `Chalk template literal is missing ${styles.length} closing bracket${styles.length === 1 ? '' : 's'} (\`}\`)`;
		throw new Error(errMsg);
	}

	return chunks.join('');
};


/***/ }),

/***/ 848:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const theme_1 = __webpack_require__(637);
/* tslint:disable */
/* **********************************************
     Begin prism-core.js
********************************************** */
var _self = {};
/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 */
// Private helper vars
var uniqueId = 0;
exports.Prism = {
    manual: _self.Prism && _self.Prism.manual,
    disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,
    util: {
        encode: function (tokens) {
            if (tokens instanceof Token) {
                const anyTokens = tokens;
                return new Token(anyTokens.type, exports.Prism.util.encode(anyTokens.content), anyTokens.alias);
            }
            else if (Array.isArray(tokens)) {
                return tokens.map(exports.Prism.util.encode);
            }
            else {
                return tokens
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/\u00a0/g, ' ');
            }
        },
        type: function (o) {
            return Object.prototype.toString.call(o).slice(8, -1);
        },
        objId: function (obj) {
            if (!obj['__id']) {
                Object.defineProperty(obj, '__id', { value: ++uniqueId });
            }
            return obj['__id'];
        },
        // Deep clone a language definition (e.g. to extend it)
        clone: function deepClone(o, visited) {
            var clone, id, type = exports.Prism.util.type(o);
            visited = visited || {};
            switch (type) {
                case 'Object':
                    id = exports.Prism.util.objId(o);
                    if (visited[id]) {
                        return visited[id];
                    }
                    clone = {};
                    visited[id] = clone;
                    for (var key in o) {
                        if (o.hasOwnProperty(key)) {
                            clone[key] = deepClone(o[key], visited);
                        }
                    }
                    return clone;
                case 'Array':
                    id = exports.Prism.util.objId(o);
                    if (visited[id]) {
                        return visited[id];
                    }
                    clone = [];
                    visited[id] = clone;
                    o.forEach(function (v, i) {
                        clone[i] = deepClone(v, visited);
                    });
                    return clone;
                default:
                    return o;
            }
        },
    },
    languages: {
        extend: function (id, redef) {
            var lang = exports.Prism.util.clone(exports.Prism.languages[id]);
            for (var key in redef) {
                lang[key] = redef[key];
            }
            return lang;
        },
        /**
         * Insert a token before another token in a language literal
         * As this needs to recreate the object (we cannot actually insert before keys in object literals),
         * we cannot just provide an object, we need an object and a key.
         * @param inside The key (or language id) of the parent
         * @param before The key to insert before.
         * @param insert Object with the key/value pairs to insert
         * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
         */
        insertBefore: function (inside, before, insert, root) {
            root = root || exports.Prism.languages;
            var grammar = root[inside];
            var ret = {};
            for (var token in grammar) {
                if (grammar.hasOwnProperty(token)) {
                    if (token == before) {
                        for (var newToken in insert) {
                            if (insert.hasOwnProperty(newToken)) {
                                ret[newToken] = insert[newToken];
                            }
                        }
                    }
                    // Do not insert token which also occur in insert. See #1525
                    if (!insert.hasOwnProperty(token)) {
                        ret[token] = grammar[token];
                    }
                }
            }
            var old = root[inside];
            root[inside] = ret;
            // Update references in other language definitions
            exports.Prism.languages.DFS(exports.Prism.languages, function (key, value) {
                if (value === old && key != inside) {
                    this[key] = ret;
                }
            });
            return ret;
        },
        // Traverse a language definition with Depth First Search
        DFS: function DFS(o, callback, type, visited) {
            visited = visited || {};
            var objId = exports.Prism.util.objId;
            for (var i in o) {
                if (o.hasOwnProperty(i)) {
                    callback.call(o, i, o[i], type || i);
                    var property = o[i], propertyType = exports.Prism.util.type(property);
                    if (propertyType === 'Object' && !visited[objId(property)]) {
                        visited[objId(property)] = true;
                        DFS(property, callback, null, visited);
                    }
                    else if (propertyType === 'Array' && !visited[objId(property)]) {
                        visited[objId(property)] = true;
                        DFS(property, callback, i, visited);
                    }
                }
            }
        },
    },
    plugins: {},
    highlight: function (text, grammar, language) {
        var env = {
            code: text,
            grammar: grammar,
            language: language,
        };
        exports.Prism.hooks.run('before-tokenize', env);
        env.tokens = exports.Prism.tokenize(env.code, env.grammar);
        exports.Prism.hooks.run('after-tokenize', env);
        return Token.stringify(exports.Prism.util.encode(env.tokens), env.language);
    },
    matchGrammar: function (text, strarr, grammar, index, startPos, oneshot, target) {
        for (var token in grammar) {
            if (!grammar.hasOwnProperty(token) || !grammar[token]) {
                continue;
            }
            if (token == target) {
                return;
            }
            var patterns = grammar[token];
            patterns = exports.Prism.util.type(patterns) === 'Array' ? patterns : [patterns];
            for (var j = 0; j < patterns.length; ++j) {
                var pattern = patterns[j], inside = pattern.inside, lookbehind = !!pattern.lookbehind, greedy = !!pattern.greedy, lookbehindLength = 0, alias = pattern.alias;
                if (greedy && !pattern.pattern.global) {
                    // Without the global flag, lastIndex won't work
                    var flags = pattern.pattern.toString().match(/[imuy]*$/)[0];
                    pattern.pattern = RegExp(pattern.pattern.source, flags + 'g');
                }
                pattern = pattern.pattern || pattern;
                // Don’t cache length as it changes during the loop
                for (var i = index, pos = startPos; i < strarr.length; pos += strarr[i].length, ++i) {
                    var str = strarr[i];
                    if (strarr.length > text.length) {
                        // Something went terribly wrong, ABORT, ABORT!
                        return;
                    }
                    if (str instanceof Token) {
                        continue;
                    }
                    if (greedy && i != strarr.length - 1) {
                        pattern.lastIndex = pos;
                        var match = pattern.exec(text);
                        if (!match) {
                            break;
                        }
                        var from = match.index + (lookbehind ? match[1].length : 0), to = match.index + match[0].length, k = i, p = pos;
                        for (var len = strarr.length; k < len && (p < to || (!strarr[k].type && !strarr[k - 1].greedy)); ++k) {
                            p += strarr[k].length;
                            // Move the index i to the element in strarr that is closest to from
                            if (from >= p) {
                                ++i;
                                pos = p;
                            }
                        }
                        // If strarr[i] is a Token, then the match starts inside another Token, which is invalid
                        if (strarr[i] instanceof Token) {
                            continue;
                        }
                        // Number of tokens to delete and replace with the new match
                        delNum = k - i;
                        str = text.slice(pos, p);
                        match.index -= pos;
                    }
                    else {
                        pattern.lastIndex = 0;
                        var match = pattern.exec(str), delNum = 1;
                    }
                    if (!match) {
                        if (oneshot) {
                            break;
                        }
                        continue;
                    }
                    if (lookbehind) {
                        lookbehindLength = match[1] ? match[1].length : 0;
                    }
                    var from = match.index + lookbehindLength, match = match[0].slice(lookbehindLength), to = from + match.length, before = str.slice(0, from), after = str.slice(to);
                    var args = [i, delNum];
                    if (before) {
                        ++i;
                        pos += before.length;
                        args.push(before);
                    }
                    var wrapped = new Token(token, inside ? exports.Prism.tokenize(match, inside) : match, alias, match, greedy);
                    args.push(wrapped);
                    if (after) {
                        args.push(after);
                    }
                    Array.prototype.splice.apply(strarr, args);
                    if (delNum != 1)
                        exports.Prism.matchGrammar(text, strarr, grammar, i, pos, true, token);
                    if (oneshot)
                        break;
                }
            }
        }
    },
    tokenize: function (text, grammar) {
        var strarr = [text];
        var rest = grammar.rest;
        if (rest) {
            for (var token in rest) {
                grammar[token] = rest[token];
            }
            delete grammar.rest;
        }
        exports.Prism.matchGrammar(text, strarr, grammar, 0, 0, false);
        return strarr;
    },
    hooks: {
        all: {},
        add: function (name, callback) {
            var hooks = exports.Prism.hooks.all;
            hooks[name] = hooks[name] || [];
            hooks[name].push(callback);
        },
        run: function (name, env) {
            var callbacks = exports.Prism.hooks.all[name];
            if (!callbacks || !callbacks.length) {
                return;
            }
            for (var i = 0, callback; (callback = callbacks[i++]);) {
                callback(env);
            }
        },
    },
    Token: Token,
};
exports.Prism.languages.clike = {
    comment: [
        {
            pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
            lookbehind: true,
        },
        {
            pattern: /(^|[^\\:])\/\/.*/,
            lookbehind: true,
            greedy: true,
        },
    ],
    string: {
        pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
        greedy: true,
    },
    'class-name': {
        pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i,
        lookbehind: true,
        inside: {
            punctuation: /[.\\]/,
        },
    },
    keyword: /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
    boolean: /\b(?:true|false)\b/,
    function: /\w+(?=\()/,
    number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
    operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
    punctuation: /[{}[\];(),.:]/,
};
exports.Prism.languages.javascript = exports.Prism.languages.extend('clike', {
    'class-name': [
        exports.Prism.languages.clike['class-name'],
        {
            pattern: /(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/,
            lookbehind: true,
        },
    ],
    keyword: [
        {
            pattern: /((?:^|})\s*)(?:catch|finally)\b/,
            lookbehind: true,
        },
        {
            pattern: /(^|[^.])\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
            lookbehind: true,
        },
    ],
    number: /\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/,
    // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
    function: /[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
    operator: /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/,
});
exports.Prism.languages.javascript['class-name'][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/;
exports.Prism.languages.insertBefore('javascript', 'keyword', {
    regex: {
        pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyus]{0,6}(?=\s*($|[\r\n,.;})\]]))/,
        lookbehind: true,
        greedy: true,
    },
    // This must be declared before keyword because we use "function" inside the look-forward
    'function-variable': {
        pattern: /[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/,
        alias: 'function',
    },
    parameter: [
        {
            pattern: /(function(?:\s+[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/,
            lookbehind: true,
            inside: exports.Prism.languages.javascript,
        },
        {
            pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/i,
            inside: exports.Prism.languages.javascript,
        },
        {
            pattern: /(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/,
            lookbehind: true,
            inside: exports.Prism.languages.javascript,
        },
        {
            pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/,
            lookbehind: true,
            inside: exports.Prism.languages.javascript,
        },
    ],
    constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/,
});
exports.Prism.languages.insertBefore('javascript', 'string', {
    'template-string': {
        pattern: /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}|[^\\`])*`/,
        greedy: true,
        inside: {
            interpolation: {
                pattern: /\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}/,
                inside: {
                    'interpolation-punctuation': {
                        pattern: /^\${|}$/,
                        alias: 'punctuation',
                    },
                    rest: exports.Prism.languages.javascript,
                },
            },
            string: /[\s\S]+/,
        },
    },
});
if (exports.Prism.languages.markup) {
    exports.Prism.languages.markup.tag.addInlined('script', 'javascript');
}
exports.Prism.languages.js = exports.Prism.languages.javascript;
exports.Prism.languages.typescript = exports.Prism.languages.extend('javascript', {
    // From JavaScript Prism keyword list and TypeScript language spec: https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md#221-reserved-words
    keyword: /\b(?:abstract|as|async|await|break|case|catch|class|const|constructor|continue|debugger|declare|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|is|keyof|let|module|namespace|new|null|of|package|private|protected|public|readonly|return|require|set|static|super|switch|this|throw|try|type|typeof|var|void|while|with|yield)\b/,
    builtin: /\b(?:string|Function|any|number|boolean|Array|symbol|console|Promise|unknown|never)\b/,
});
exports.Prism.languages.ts = exports.Prism.languages.typescript;
function Token(type, content, alias, matchedStr, greedy) {
    this.type = type;
    this.content = content;
    this.alias = alias;
    // Copy of the full string this token was created from
    this.length = (matchedStr || '').length | 0;
    this.greedy = !!greedy;
}
exports.Token = Token;
Token.stringify = function (o, language) {
    if (typeof o == 'string') {
        return o;
    }
    if (Array.isArray(o)) {
        return o
            .map(function (element) {
            return Token.stringify(element, language);
        })
            .join('');
    }
    return getColorForSyntaxKind(o.type)(o.content);
};
function getColorForSyntaxKind(syntaxKind) {
    return theme_1.theme[syntaxKind] || theme_1.identity;
}


/***/ }),

/***/ 861:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const PassThrough = __webpack_require__(413).PassThrough;
const zlib = __webpack_require__(761);
const mimicResponse = __webpack_require__(89);

module.exports = response => {
	// TODO: Use Array#includes when targeting Node.js 6
	if (['gzip', 'deflate'].indexOf(response.headers['content-encoding']) === -1) {
		return response;
	}

	const unzip = zlib.createUnzip();
	const stream = new PassThrough();

	mimicResponse(response, stream);

	unzip.on('error', err => {
		if (err.code === 'Z_BUF_ERROR') {
			stream.end();
			return;
		}

		stream.emit('error', err);
	});

	response.pipe(unzip).pipe(stream);

	return stream;
};


/***/ }),

/***/ 867:
/***/ (function(module) {

module.exports = require("tty");

/***/ }),

/***/ 885:
/***/ (function(module) {

"use strict";


module.exports = {
	"aliceblue": [240, 248, 255],
	"antiquewhite": [250, 235, 215],
	"aqua": [0, 255, 255],
	"aquamarine": [127, 255, 212],
	"azure": [240, 255, 255],
	"beige": [245, 245, 220],
	"bisque": [255, 228, 196],
	"black": [0, 0, 0],
	"blanchedalmond": [255, 235, 205],
	"blue": [0, 0, 255],
	"blueviolet": [138, 43, 226],
	"brown": [165, 42, 42],
	"burlywood": [222, 184, 135],
	"cadetblue": [95, 158, 160],
	"chartreuse": [127, 255, 0],
	"chocolate": [210, 105, 30],
	"coral": [255, 127, 80],
	"cornflowerblue": [100, 149, 237],
	"cornsilk": [255, 248, 220],
	"crimson": [220, 20, 60],
	"cyan": [0, 255, 255],
	"darkblue": [0, 0, 139],
	"darkcyan": [0, 139, 139],
	"darkgoldenrod": [184, 134, 11],
	"darkgray": [169, 169, 169],
	"darkgreen": [0, 100, 0],
	"darkgrey": [169, 169, 169],
	"darkkhaki": [189, 183, 107],
	"darkmagenta": [139, 0, 139],
	"darkolivegreen": [85, 107, 47],
	"darkorange": [255, 140, 0],
	"darkorchid": [153, 50, 204],
	"darkred": [139, 0, 0],
	"darksalmon": [233, 150, 122],
	"darkseagreen": [143, 188, 143],
	"darkslateblue": [72, 61, 139],
	"darkslategray": [47, 79, 79],
	"darkslategrey": [47, 79, 79],
	"darkturquoise": [0, 206, 209],
	"darkviolet": [148, 0, 211],
	"deeppink": [255, 20, 147],
	"deepskyblue": [0, 191, 255],
	"dimgray": [105, 105, 105],
	"dimgrey": [105, 105, 105],
	"dodgerblue": [30, 144, 255],
	"firebrick": [178, 34, 34],
	"floralwhite": [255, 250, 240],
	"forestgreen": [34, 139, 34],
	"fuchsia": [255, 0, 255],
	"gainsboro": [220, 220, 220],
	"ghostwhite": [248, 248, 255],
	"gold": [255, 215, 0],
	"goldenrod": [218, 165, 32],
	"gray": [128, 128, 128],
	"green": [0, 128, 0],
	"greenyellow": [173, 255, 47],
	"grey": [128, 128, 128],
	"honeydew": [240, 255, 240],
	"hotpink": [255, 105, 180],
	"indianred": [205, 92, 92],
	"indigo": [75, 0, 130],
	"ivory": [255, 255, 240],
	"khaki": [240, 230, 140],
	"lavender": [230, 230, 250],
	"lavenderblush": [255, 240, 245],
	"lawngreen": [124, 252, 0],
	"lemonchiffon": [255, 250, 205],
	"lightblue": [173, 216, 230],
	"lightcoral": [240, 128, 128],
	"lightcyan": [224, 255, 255],
	"lightgoldenrodyellow": [250, 250, 210],
	"lightgray": [211, 211, 211],
	"lightgreen": [144, 238, 144],
	"lightgrey": [211, 211, 211],
	"lightpink": [255, 182, 193],
	"lightsalmon": [255, 160, 122],
	"lightseagreen": [32, 178, 170],
	"lightskyblue": [135, 206, 250],
	"lightslategray": [119, 136, 153],
	"lightslategrey": [119, 136, 153],
	"lightsteelblue": [176, 196, 222],
	"lightyellow": [255, 255, 224],
	"lime": [0, 255, 0],
	"limegreen": [50, 205, 50],
	"linen": [250, 240, 230],
	"magenta": [255, 0, 255],
	"maroon": [128, 0, 0],
	"mediumaquamarine": [102, 205, 170],
	"mediumblue": [0, 0, 205],
	"mediumorchid": [186, 85, 211],
	"mediumpurple": [147, 112, 219],
	"mediumseagreen": [60, 179, 113],
	"mediumslateblue": [123, 104, 238],
	"mediumspringgreen": [0, 250, 154],
	"mediumturquoise": [72, 209, 204],
	"mediumvioletred": [199, 21, 133],
	"midnightblue": [25, 25, 112],
	"mintcream": [245, 255, 250],
	"mistyrose": [255, 228, 225],
	"moccasin": [255, 228, 181],
	"navajowhite": [255, 222, 173],
	"navy": [0, 0, 128],
	"oldlace": [253, 245, 230],
	"olive": [128, 128, 0],
	"olivedrab": [107, 142, 35],
	"orange": [255, 165, 0],
	"orangered": [255, 69, 0],
	"orchid": [218, 112, 214],
	"palegoldenrod": [238, 232, 170],
	"palegreen": [152, 251, 152],
	"paleturquoise": [175, 238, 238],
	"palevioletred": [219, 112, 147],
	"papayawhip": [255, 239, 213],
	"peachpuff": [255, 218, 185],
	"peru": [205, 133, 63],
	"pink": [255, 192, 203],
	"plum": [221, 160, 221],
	"powderblue": [176, 224, 230],
	"purple": [128, 0, 128],
	"rebeccapurple": [102, 51, 153],
	"red": [255, 0, 0],
	"rosybrown": [188, 143, 143],
	"royalblue": [65, 105, 225],
	"saddlebrown": [139, 69, 19],
	"salmon": [250, 128, 114],
	"sandybrown": [244, 164, 96],
	"seagreen": [46, 139, 87],
	"seashell": [255, 245, 238],
	"sienna": [160, 82, 45],
	"silver": [192, 192, 192],
	"skyblue": [135, 206, 235],
	"slateblue": [106, 90, 205],
	"slategray": [112, 128, 144],
	"slategrey": [112, 128, 144],
	"snow": [255, 250, 250],
	"springgreen": [0, 255, 127],
	"steelblue": [70, 130, 180],
	"tan": [210, 180, 140],
	"teal": [0, 128, 128],
	"thistle": [216, 191, 216],
	"tomato": [255, 99, 71],
	"turquoise": [64, 224, 208],
	"violet": [238, 130, 238],
	"wheat": [245, 222, 179],
	"white": [255, 255, 255],
	"whitesmoke": [245, 245, 245],
	"yellow": [255, 255, 0],
	"yellowgreen": [154, 205, 50]
};


/***/ }),

/***/ 900:
/***/ (function(__unusedmodule, __unusedexports, __webpack_require__) {

"use strict";


var _flattenIntoArray = __webpack_require__(789);

var _flattenIntoArray2 = _interopRequireDefault(_flattenIntoArray);

var _arraySpeciesCreate = __webpack_require__(797);

var _arraySpeciesCreate2 = _interopRequireDefault(_arraySpeciesCreate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (!Object.prototype.hasOwnProperty.call(Array.prototype, 'flatMap')) {

  Array.prototype.flatMap = function flatMap(callbackFn, thisArg) {
    var o = Object(this);
    if (!callbackFn || typeof callbackFn.call !== 'function') {
      throw TypeError('callbackFn must be callable.');
    }
    var t = thisArg !== undefined ? thisArg : undefined;

    var a = (0, _arraySpeciesCreate2.default)(o, o.length);
    (0, _flattenIntoArray2.default)(a, o,
    /*start*/0,
    /*depth*/1, callbackFn, t);
    return a.filter(function (x) {
      return x !== undefined;
    }, a);
  };
}
//# sourceMappingURL=flat-map.js.map

/***/ }),

/***/ 916:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const EventEmitter = __webpack_require__(614);
const getStream = __webpack_require__(705);
const is = __webpack_require__(534);
const PCancelable = __webpack_require__(557);
const requestAsEventEmitter = __webpack_require__(584);
const {HTTPError, ParseError, ReadError} = __webpack_require__(774);
const {options: mergeOptions} = __webpack_require__(821);
const {reNormalize} = __webpack_require__(86);

const asPromise = options => {
	const proxy = new EventEmitter();

	const promise = new PCancelable((resolve, reject, onCancel) => {
		const emitter = requestAsEventEmitter(options);

		onCancel(emitter.abort);

		emitter.on('response', async response => {
			proxy.emit('response', response);

			const stream = is.null(options.encoding) ? getStream.buffer(response) : getStream(response, options);

			let data;
			try {
				data = await stream;
			} catch (error) {
				reject(new ReadError(error, options));
				return;
			}

			const limitStatusCode = options.followRedirect ? 299 : 399;

			response.body = data;

			try {
				for (const [index, hook] of Object.entries(options.hooks.afterResponse)) {
					// eslint-disable-next-line no-await-in-loop
					response = await hook(response, updatedOptions => {
						updatedOptions = reNormalize(mergeOptions(options, {
							...updatedOptions,
							retry: 0,
							throwHttpErrors: false
						}));

						// Remove any further hooks for that request, because we we'll call them anyway.
						// The loop continues. We don't want duplicates (asPromise recursion).
						updatedOptions.hooks.afterResponse = options.hooks.afterResponse.slice(0, index);

						return asPromise(updatedOptions);
					});
				}
			} catch (error) {
				reject(error);
				return;
			}

			const {statusCode} = response;

			if (options.json && response.body) {
				try {
					response.body = JSON.parse(response.body);
				} catch (error) {
					if (statusCode >= 200 && statusCode < 300) {
						const parseError = new ParseError(error, statusCode, options, data);
						Object.defineProperty(parseError, 'response', {value: response});
						reject(parseError);
						return;
					}
				}
			}

			if (statusCode !== 304 && (statusCode < 200 || statusCode > limitStatusCode)) {
				const error = new HTTPError(response, options);
				Object.defineProperty(error, 'response', {value: response});
				if (emitter.retry(error) === false) {
					if (options.throwHttpErrors) {
						reject(error);
						return;
					}

					resolve(response);
				}

				return;
			}

			resolve(response);
		});

		emitter.once('error', reject);
		[
			'request',
			'redirect',
			'uploadProgress',
			'downloadProgress'
		].forEach(event => emitter.on(event, (...args) => proxy.emit(event, ...args)));
	});

	promise.on = (name, fn) => {
		proxy.on(name, fn);
		return promise;
	};

	return promise;
};

module.exports = asPromise;


/***/ }),

/***/ 946:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const escapeStringRegexp = __webpack_require__(138);
const ansiStyles = __webpack_require__(663);
const stdoutColor = __webpack_require__(247).stdout;

const template = __webpack_require__(841);

const isSimpleWindowsTerm = process.platform === 'win32' && !(process.env.TERM || '').toLowerCase().startsWith('xterm');

// `supportsColor.level` → `ansiStyles.color[name]` mapping
const levelMapping = ['ansi', 'ansi', 'ansi256', 'ansi16m'];

// `color-convert` models to exclude from the Chalk API due to conflicts and such
const skipModels = new Set(['gray']);

const styles = Object.create(null);

function applyOptions(obj, options) {
	options = options || {};

	// Detect level if not set manually
	const scLevel = stdoutColor ? stdoutColor.level : 0;
	obj.level = options.level === undefined ? scLevel : options.level;
	obj.enabled = 'enabled' in options ? options.enabled : obj.level > 0;
}

function Chalk(options) {
	// We check for this.template here since calling `chalk.constructor()`
	// by itself will have a `this` of a previously constructed chalk object
	if (!this || !(this instanceof Chalk) || this.template) {
		const chalk = {};
		applyOptions(chalk, options);

		chalk.template = function () {
			const args = [].slice.call(arguments);
			return chalkTag.apply(null, [chalk.template].concat(args));
		};

		Object.setPrototypeOf(chalk, Chalk.prototype);
		Object.setPrototypeOf(chalk.template, chalk);

		chalk.template.constructor = Chalk;

		return chalk.template;
	}

	applyOptions(this, options);
}

// Use bright blue on Windows as the normal blue color is illegible
if (isSimpleWindowsTerm) {
	ansiStyles.blue.open = '\u001B[94m';
}

for (const key of Object.keys(ansiStyles)) {
	ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), 'g');

	styles[key] = {
		get() {
			const codes = ansiStyles[key];
			return build.call(this, this._styles ? this._styles.concat(codes) : [codes], this._empty, key);
		}
	};
}

styles.visible = {
	get() {
		return build.call(this, this._styles || [], true, 'visible');
	}
};

ansiStyles.color.closeRe = new RegExp(escapeStringRegexp(ansiStyles.color.close), 'g');
for (const model of Object.keys(ansiStyles.color.ansi)) {
	if (skipModels.has(model)) {
		continue;
	}

	styles[model] = {
		get() {
			const level = this.level;
			return function () {
				const open = ansiStyles.color[levelMapping[level]][model].apply(null, arguments);
				const codes = {
					open,
					close: ansiStyles.color.close,
					closeRe: ansiStyles.color.closeRe
				};
				return build.call(this, this._styles ? this._styles.concat(codes) : [codes], this._empty, model);
			};
		}
	};
}

ansiStyles.bgColor.closeRe = new RegExp(escapeStringRegexp(ansiStyles.bgColor.close), 'g');
for (const model of Object.keys(ansiStyles.bgColor.ansi)) {
	if (skipModels.has(model)) {
		continue;
	}

	const bgModel = 'bg' + model[0].toUpperCase() + model.slice(1);
	styles[bgModel] = {
		get() {
			const level = this.level;
			return function () {
				const open = ansiStyles.bgColor[levelMapping[level]][model].apply(null, arguments);
				const codes = {
					open,
					close: ansiStyles.bgColor.close,
					closeRe: ansiStyles.bgColor.closeRe
				};
				return build.call(this, this._styles ? this._styles.concat(codes) : [codes], this._empty, model);
			};
		}
	};
}

const proto = Object.defineProperties(() => {}, styles);

function build(_styles, _empty, key) {
	const builder = function () {
		return applyStyle.apply(builder, arguments);
	};

	builder._styles = _styles;
	builder._empty = _empty;

	const self = this;

	Object.defineProperty(builder, 'level', {
		enumerable: true,
		get() {
			return self.level;
		},
		set(level) {
			self.level = level;
		}
	});

	Object.defineProperty(builder, 'enabled', {
		enumerable: true,
		get() {
			return self.enabled;
		},
		set(enabled) {
			self.enabled = enabled;
		}
	});

	// See below for fix regarding invisible grey/dim combination on Windows
	builder.hasGrey = this.hasGrey || key === 'gray' || key === 'grey';

	// `__proto__` is used because we must return a function, but there is
	// no way to create a function with a different prototype
	builder.__proto__ = proto; // eslint-disable-line no-proto

	return builder;
}

function applyStyle() {
	// Support varags, but simply cast to string in case there's only one arg
	const args = arguments;
	const argsLen = args.length;
	let str = String(arguments[0]);

	if (argsLen === 0) {
		return '';
	}

	if (argsLen > 1) {
		// Don't slice `arguments`, it prevents V8 optimizations
		for (let a = 1; a < argsLen; a++) {
			str += ' ' + args[a];
		}
	}

	if (!this.enabled || this.level <= 0 || !str) {
		return this._empty ? '' : str;
	}

	// Turns out that on Windows dimmed gray text becomes invisible in cmd.exe,
	// see https://github.com/chalk/chalk/issues/58
	// If we're on Windows and we're dealing with a gray color, temporarily make 'dim' a noop.
	const originalDim = ansiStyles.dim.open;
	if (isSimpleWindowsTerm && this.hasGrey) {
		ansiStyles.dim.open = '';
	}

	for (const code of this._styles.slice().reverse()) {
		// Replace any instances already present with a re-opening code
		// otherwise only the part of the string until said closing code
		// will be colored, and the rest will simply be 'plain'.
		str = code.open + str.replace(code.closeRe, code.open) + code.close;

		// Close the styling before a linebreak and reopen
		// after next line to fix a bleed issue on macOS
		// https://github.com/chalk/chalk/pull/92
		str = str.replace(/\r?\n/g, `${code.close}$&${code.open}`);
	}

	// Reset the original `dim` if we changed it to work around the Windows dimmed gray issue
	ansiStyles.dim.open = originalDim;

	return str;
}

function chalkTag(chalk, strings) {
	if (!Array.isArray(strings)) {
		// If chalk() was called by itself or with a string,
		// return the string itself as a string.
		return [].slice.call(arguments, 1).join(' ');
	}

	const args = [].slice.call(arguments, 2);
	const parts = [strings.raw[0]];

	for (let i = 1; i < strings.length; i++) {
		parts.push(String(args[i - 1]).replace(/[{}\\]/g, '\\$&'));
		parts.push(String(strings.raw[i]));
	}

	return template(chalk, parts.join(''));
}

Object.defineProperties(Chalk.prototype, styles);

module.exports = Chalk(); // eslint-disable-line new-cap
module.exports.supportsColor = stdoutColor;
module.exports.default = module.exports; // For TypeScript


/***/ }),

/***/ 947:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const minIndent = __webpack_require__(370);

module.exports = string => {
	const indent = minIndent(string);

	if (indent === 0) {
		return string;
	}

	const regex = new RegExp(`^[ \\t]{${indent}}`, 'gm');

	return string.replace(regex, '');
};


/***/ }),

/***/ 952:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const {Readable} = __webpack_require__(413);

module.exports = input => (
	new Readable({
		read() {
			this.push(input);
			this.push(null);
		}
	})
);


/***/ }),

/***/ 959:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(__webpack_require__(946));
const strip_ansi_1 = __importDefault(__webpack_require__(90));
const deep_set_1 = __webpack_require__(721);
const stringifyObject_1 = __importDefault(__webpack_require__(212));
const DIM_TOKEN = '@@__DIM_POINTER__@@';
function printJsonWithErrors(ast, keyPaths, valuePaths, missingItems = []) {
    let obj = ast;
    for (const { path, type } of missingItems) {
        obj = deep_set_1.deepSet(obj, path, type);
    }
    return stringifyObject_1.default(obj, {
        indent: '  ',
        transformLine: ({ indent, key, value, stringifiedValue, eol, path }) => {
            const dottedPath = path.join('.');
            const keyError = keyPaths.includes(dottedPath);
            const valueError = valuePaths.includes(dottedPath);
            const missingItem = missingItems.find(item => item.path === dottedPath);
            let valueStr = stringifiedValue;
            if (missingItem) {
                // trim away the '' from the string
                if (typeof value === 'string') {
                    valueStr = valueStr.slice(1, valueStr.length - 1);
                }
                const isRequiredStr = missingItem.isRequired ? '' : '?';
                const prefix = missingItem.isRequired ? '+' : '?';
                const color = missingItem.isRequired ? chalk_1.default.greenBright : chalk_1.default.green;
                let output = color(prefixLines(key + isRequiredStr + ': ' + valueStr + eol, indent, prefix));
                if (!missingItem.isRequired) {
                    output = chalk_1.default.dim(output);
                }
                return output;
            }
            else {
                const isOnMissingItemPath = missingItems.some(item => dottedPath.startsWith(item.path));
                const isOptional = key[key.length - 2] === '?';
                if (isOptional) {
                    key = key.slice(1, key.length - 1);
                }
                if (isOptional && typeof value === 'object' && value !== null) {
                    valueStr = valueStr
                        .split('\n')
                        .map((line, index, arr) => (index === arr.length - 1 ? line + DIM_TOKEN : line))
                        .join('\n');
                }
                if (isOnMissingItemPath && typeof value === 'string') {
                    valueStr = valueStr.slice(1, valueStr.length - 1);
                    if (!isOptional) {
                        valueStr = chalk_1.default.bold(valueStr);
                    }
                }
                if ((typeof value !== 'object' || value === null) && !valueError && !isOnMissingItemPath) {
                    valueStr = chalk_1.default.dim(valueStr);
                }
                const keyStr = keyError ? chalk_1.default.redBright(key) : key;
                valueStr = valueError ? chalk_1.default.redBright(valueStr) : valueStr;
                // valueStr can be multiple lines if it's an object
                let output = indent + keyStr + ': ' + valueStr + (isOnMissingItemPath ? eol : chalk_1.default.dim(eol));
                // if there is an error, add the scribble lines
                // 3 options:
                // error in key, but not in value
                // error in value, but not in key
                // error in both
                if (keyError || valueError) {
                    const lines = output.split('\n');
                    const keyLength = String(key).length;
                    const keyScribbles = keyError ? chalk_1.default.redBright('~'.repeat(keyLength)) : ' '.repeat(keyLength);
                    const valueLength = valueError ? getValueLength(indent, key, value, stringifiedValue) : 0;
                    const hideValueScribbles = Boolean(valueError && (typeof value === 'object' && value !== null));
                    const valueScribbles = valueError ? '  ' + chalk_1.default.redBright('~'.repeat(valueLength)) : '';
                    // Either insert both keyScribles and valueScribbles in one line
                    if (keyScribbles && keyScribbles.length > 0 && !hideValueScribbles) {
                        lines.splice(1, 0, indent + keyScribbles + valueScribbles);
                    }
                    // or the valueScribbles for a multiline string
                    if (keyScribbles && keyScribbles.length > 0 && hideValueScribbles) {
                        lines.splice(lines.length - 1, 0, indent.slice(0, indent.length - 2) + valueScribbles);
                    }
                    output = lines.join('\n');
                }
                return output;
            }
        },
    });
}
exports.printJsonWithErrors = printJsonWithErrors;
function getValueLength(indent, key, value, stringifiedValue) {
    if (value === null) {
        return 4;
    }
    if (typeof value === 'string') {
        return value.length + 2; // +2 for the quotes
    }
    if (typeof value === 'object') {
        return getLongestLine(`${key}: ${strip_ansi_1.default(stringifiedValue)}`) - indent.length;
    }
    return String(value).length;
}
function getLongestLine(str) {
    return str.split('\n').reduce((max, curr) => (curr.length > max ? curr.length : max), 0);
}
function prefixLines(str, indent, prefix) {
    return str
        .split('\n')
        .map((line, index, arr) => index === 0 ? prefix + indent.slice(1) + line : index < arr.length - 1 ? prefix + line.slice(1) : line)
        .map(line => {
        // we need to use a special token to "mark" a line a "to be dimmed", as chalk (or rather ansi) doesn't allow nesting of dimmed & colored content
        return strip_ansi_1.default(line).includes(DIM_TOKEN)
            ? chalk_1.default.dim(line.replace(DIM_TOKEN, ''))
            : line.includes('?')
                ? chalk_1.default.dim(line)
                : line;
    })
        .join('\n');
}


/***/ }),

/***/ 963:
/***/ (function(module) {

"use strict";


module.exports = options => {
	options = Object.assign({
		onlyFirst: false
	}, options);

	const pattern = [
		'[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
		'(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'
	].join('|');

	return new RegExp(pattern, options.onlyFirst ? undefined : 'g');
};


/***/ })

/******/ },
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ 	"use strict";
/******/ 
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	!function() {
/******/ 		__webpack_require__.nmd = function(module) {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			Object.defineProperty(module, 'loaded', {
/******/ 				enumerable: true,
/******/ 				get: function() { return module.l; }
/******/ 			});
/******/ 			Object.defineProperty(module, 'id', {
/******/ 				enumerable: true,
/******/ 				get: function() { return module.i; }
/******/ 			});
/******/ 			return module;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ }
);