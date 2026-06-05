const { coverageDirectory } = require("./jest.config");

module.exports = {
  preset: 'ts-jest',
  // forceExit: true,
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: 'tests/e2e/.*\\.e2e.spec\\.ts$',
  // testMatch: ['<rootDir>/tests/e2e/**/*.e2e.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.ts'
  ], // Optional setup file
  collectCoverage: false, // Coverage is optional for e2e
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  coverageDirectory: './coverage_e2e'
};
