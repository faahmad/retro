import snakeCase from "lodash/snakeCase";

export const fieldResolverFromCamelCaseToSnakeCase = (
  parent,
  args,
  context,
  info
) => {
  // The keys are stored as snake_case in our repo, but we request them
  // as camelCase. We use lodash's snakeCase method to convert the
  // incoming fieldName to snake_case so that we can get the value.
  return parent[snakeCase(info.fieldName)];
};
