module.exports = {
  testEnvironment: "node",
  preset: "ts-jest",
  testMatch: ["**/test/**/*.test.ts"],
  setupFiles: ["<rootDir>/test/jest.setup.js"],
};
