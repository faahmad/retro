module.exports = {
  parser: "@typescript-eslint/parser",
  extends: ["react-app", "eslint:recommended"],
  rules: {
    "no-console": "error"
  },
  ignorePatterns: ["build", "node_modules"]
};
