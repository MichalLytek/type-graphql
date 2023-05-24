export type ParameterDecorator = (
  target: Object,
  propertyKey: string | symbol, // Removed 'undefined' from TS 5.0
  parameterIndex: number,
) => void;
