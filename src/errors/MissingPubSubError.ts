export class MissingPubSubError extends Error {
  constructor() {
    super(
      "Looks like you've forgot to provide `pubSub` option in `buildSchema()`. " +
        "Subscriptions can't work without a proper PubSub system.",
    );

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
