export class ReflectMetadataMissingError extends Error {
  constructor() {
    super(
      "Looks like you've forgot to provide experimental metadata API polyfill. " +
        "Please read the installation instruction for more details: " +
        "https://github.com/19majkel94/type-graphql#installation",
    );

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
