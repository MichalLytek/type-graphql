/**
 * Utility Types
 */

/**
 * From https://github.com/sindresorhus/type-fest/
 * Matches a JSON object.
 * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from.
 */
export declare type JsonObject = { [Key in string]?: JsonValue };

/**
 * From https://github.com/sindresorhus/type-fest/
 * Matches a JSON array.
 */
export declare interface JsonArray extends Array<JsonValue> {}

/**
 * From https://github.com/sindresorhus/type-fest/
 * Matches any valid JSON value.
 */
export declare type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonObject
  | JsonArray;

/**
 * Same as JsonObject, but allows undefined
 */
export declare type InputJsonObject = { [Key in string]?: JsonValue };

export declare interface InputJsonArray extends Array<JsonValue> {}

export declare type InputJsonValue =
  | undefined
  | string
  | number
  | boolean
  | null
  | InputJsonObject
  | InputJsonArray;
