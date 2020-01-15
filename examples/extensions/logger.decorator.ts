import { Extensions } from "../../src";

interface LogOptions {
  message: string;
  level?: number;
}

export const Logger = (messageOrOptions: string | LogOptions) =>
  Extensions({
    log:
      typeof messageOrOptions === "string"
        ? {
            level: 4,
            message: messageOrOptions,
          }
        : messageOrOptions,
  });
