import { ArgParamMetadata, ClassMetadata } from "../metadata/definitions";
import { convertToType } from "../helpers/types";
import { ArgsDictionary } from "../interfaces";
import { ClassType } from "../interfaces/ClassType";
import { getMetadataStorage } from "../metadata/getMetadataStorage";

interface InputTypeField {
  name: string;
  fields?: InputTypeClass;
  isArray?: boolean;
}

interface InputTypeClass {
  target: ClassType;
  fields: InputTypeField[];
}

const generatedTrees = new Map<ClassType, InputTypeClass | null>();

function getInputType(target: ClassType): ClassMetadata | undefined {
  return getMetadataStorage().inputTypes.find(t => t.target === target);
}

function generateTree(param: ArgParamMetadata): InputTypeClass | null {
  const target = param.getType() as ClassType;

  if (generatedTrees.has(target)) {
    return generatedTrees.get(target) as InputTypeClass;
  }

  const inputType = getInputType(target);

  if (!inputType) {
    generatedTrees.set(target, null);

    return null;
  }

  const generate = (meta: ClassMetadata): InputTypeClass => {
    const value: InputTypeClass = {
      target: meta.target as ClassType,
      fields: (meta.fields || []).map(field => {
        const fieldInputType = getInputType(field.getType() as ClassType);

        return {
          name: field.name,
          fields: fieldInputType ? generate(fieldInputType) : undefined,
          isArray: field.typeOptions.array === true,
        };
      }),
    };

    const superPrototype = Object.getPrototypeOf(meta.target);
    if (superPrototype) {
      const superInputType = getInputType(superPrototype);
      if (superInputType) {
        value.fields = value.fields.concat(generate(superInputType).fields);
      }
    }

    return value;
  };

  const tree = generate(inputType);

  generatedTrees.set(target, tree);

  return tree;
}

function convertToInput(tree: InputTypeClass, data?: any) {
  const input = new tree.target();

  tree.fields.forEach(field => {
    if (typeof field.fields !== "undefined") {
      const siblings = field.fields;

      if (field.isArray) {
        input[field.name] = (data[field.name] || []).map((value: any) =>
          convertToInput(siblings, value),
        );
      } else {
        input[field.name] = convertToInput(siblings, data[field.name]);
      }
    } else {
      input[field.name] = data[field.name];
    }
  });

  return input;
}

export function convertToArg(param: ArgParamMetadata, args: ArgsDictionary) {
  const tree = generateTree(param);

  return tree
    ? convertToInput(tree, args[param.name])
    : convertToType(param.getType(), args[param.name]);
}
