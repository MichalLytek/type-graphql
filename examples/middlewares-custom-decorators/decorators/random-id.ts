import { Int, createParameterDecorator } from "type-graphql";

const MAX_ID_VALUE = 3; // Number.MAX_SAFE_INTEGER

export function RandomId(argName = "id") {
  return createParameterDecorator(
    ({ args }) => args[argName] ?? Math.round(Math.random() * MAX_ID_VALUE),
    {
      arg: {
        name: argName,
        typeFunc: () => Int,
        options: {
          nullable: true,
          description: "Accepts provided id or generates a random one.",
          validateFn: (value: number): void => {
            if (value < 0 || value > MAX_ID_VALUE) {
              throw new Error(`Invalid value for ${argName}`);
            }
          },
        },
      },
    },
  );
}
