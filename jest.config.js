module.exports = {
  setupFilesAfterEnv: ["./jest.setup.ts"],
  verbose: true,
  testEnvironment: "jsdom",
  globals: {
    RESAS_API_KEY: "xxxxx",
  },
};
