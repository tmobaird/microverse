module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: [
    "@testing-library/jest-native/extend-expect",
    "./jest.setup.js",
  ],
  transformIgnorePatterns: [
    "/node_modules/(?!(@react-native|react-native|expo.*|@expo.*|@gluestack-ui/*|@legendapp/motion|uuid/*)/)",
  ],
  verbose: true,
  testTimeout: 30000, // Set a timeout in milliseconds
};
