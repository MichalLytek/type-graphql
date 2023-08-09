import { getClass } from "@typegoose/typegoose";
import { type Document, Model } from "mongoose";
import { type MiddlewareFn } from "type-graphql";

function convertDocument(doc: Document) {
  const convertedDocument = doc.toObject();
  const DocumentClass = getClass(doc)!;
  Object.setPrototypeOf(convertedDocument, DocumentClass.prototype);
  return convertedDocument;
}

export const TypegooseMiddleware: MiddlewareFn = async (_, next) => {
  const result = await next();

  if (Array.isArray(result)) {
    return result.map(item => (item instanceof Model ? convertDocument(item) : item));
  }

  if (result instanceof Model) {
    return convertDocument(result);
  }

  return result;
};
