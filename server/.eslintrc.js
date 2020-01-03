module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: "eslint:recommended",
  plugins: ["jest"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  }
};
