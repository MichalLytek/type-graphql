import { Extensions } from "type-graphql";

type LogOptions = {
  message: string;
  level?: number;
};

export function LogMessage(messageOrOptions: string | LogOptions) {
  // Parse the parameters of the custom decorator
  const log: LogOptions =
    typeof messageOrOptions === "string"
      ? {
          level: 4,
          message: messageOrOptions,
        }
      : messageOrOptions;

  // Return the '@Extensions' decorator with a prepared property
  return Extensions({ log });
}
