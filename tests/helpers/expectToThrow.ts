export async function expectToThrow<TError extends Error>(call: () => unknown): Promise<TError> {
  try {
    await call();
  } catch (error: unknown) {
    return error as TError;
  }

  throw new Error("You've expected a function to throw, but it didn't throw anything.");
}
