import pipe from "lodash/fp/pipe";

export function removeGraphQLErrorText(errorMessage: string) {
  return errorMessage.replace(/GraphQL error: /g, "");
}

export function removeDuplicateKeyErrorText(message: string) {
  return message.replace(/Key /g, "");
}

export function removeNonAlphanumericCharacters(message: string) {
  return message.replace(/[^a-zA-Z0-9 -]/, "");
}

export function replaceParensWithWhitespace(message: string) {
  return message.replace(/[()]/g, " ");
}

export const cleanDuplicateKeyErrorMessage = pipe(
  removeGraphQLErrorText,
  removeDuplicateKeyErrorText,
  replaceParensWithWhitespace,
  removeNonAlphanumericCharacters
);
