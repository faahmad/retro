module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'react-app',
    'eslint:recommended',
  ],
  rules: {
    'no-console': 'error'
  },
  ignorePatterns: ['build', 'node_modules']
};

// Specifies the ESLint parser
// parserOptions: {
//   ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
//   sourceType: 'module', // Allows for the use of imports
//   ecmaFeatures: {
//     jsx: true // Allows for the parsing of JSX
//   }
// },
// settings: {
//   react: {
//     version: 'detect' // Tells eslint-plugin-react to automatically detect the version of React to use
//   }
// },
// extends: [
//   'eslint:recommended',
//   'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
//   'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
//   'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
//   'plugin:prettier/recommended' // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
// ],
// rules: {
//   'react/prop-types': 0,
//   'react/no-unescaped-entities': 0,
//   'no-debugger': 'on'
//   // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
//   // e.g. "@typescript-eslint/explicit-function-return-type": "off",
// }
