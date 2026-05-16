module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '.*\\.e2e.spec\\.ts$',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  // setupFilesAfterEnv: ['./tests/e2e/setup.ts'], // Optional setup file
  collectCoverage: false, // Coverage is optional for e2e
};
