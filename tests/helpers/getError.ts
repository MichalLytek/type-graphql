export async function getError<TError extends Error>(call: () => unknown): Promise<TError> {
  try {
    await call();
  } catch (error: unknown) {
    return error as TError;
  }

  throw new Error("Unreachable");
}
