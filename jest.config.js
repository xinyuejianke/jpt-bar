// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  testPathIgnorePatterns: ['/node_modules/'],
  testMatch: [
    '**/?(*.)(test).js?(x)'
  ],
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest'
  }
};
