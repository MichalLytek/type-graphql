import { Extensions } from "../../src";

interface LogOptions {
  message: string;
  level?: number;
}

export function LogMessage(messageOrOptions: string | LogOptions) {
  // parse the parameters of the custom decorator
  const log: LogOptions =
    typeof messageOrOptions === "string"
      ? {
          level: 4,
          message: messageOrOptions,
        }
      : messageOrOptions;

  // return the `@Extensions` decorator with a prepared property
  return Extensions({ log });
}
