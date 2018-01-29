import { ParamDefinition } from "../metadata/definition-interfaces";

export function getParams(
  params: ParamDefinition[],
  { root, args, context, info }: { root: any; args: any; context: any; info: any },
): any[] {
  return params.sort((a, b) => a.index - b.index).map(paramInfo => {
    switch (paramInfo.kind) {
      case "args":
        return args;
      case "arg":
        return args[paramInfo.name];
      case "context":
        return context;
      case "root":
        return root;
    }
  });
}
