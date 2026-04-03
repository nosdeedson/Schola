/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  // moduleFileExtensions: [
  //   "js",
  //   "json",
  //   "ts"
  // ],
  rootDir: "src",
  forceExit: true,
  testRegex: ".*\\.spec\\.ts$",
  moduleNameMapper:{
    '^@/(.*)$': '<rootDir>/$1',
  },
  coverageDirectory: '../coverage',
  setupFilesAfterEnv: ['../jest.setup.ts'],
};