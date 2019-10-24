import camelCase from "lodash/camelCase";

export const fieldResolverToCamelCase = (source, args, context, info) => {
  return source[camelCase(info.fieldName)];
};
