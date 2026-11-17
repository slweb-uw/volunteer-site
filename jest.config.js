// Two Jest projects:
// - rules: Firestore security rules tests. They need the Firestore emulator
//   running on localhost:8080 (see README, "Testing").
// - unit:  fast tests with no emulator or network.
//
//   yarn test:unit    unit tests only
//   yarn test:rules   rules tests only (emulator must be running)
//   yarn test         both
module.exports = {
  projects: [
    {
      displayName: "rules",
      preset: "ts-jest",
      testEnvironment: "node",
      testMatch: ["<rootDir>/__tests__/firestore.rules.test.ts"],
    },
    {
      displayName: "unit",
      testEnvironment: "node",
      testMatch: ["<rootDir>/__tests__/unit/**/*.test.ts"],
      // Lets tests import modules the way the app does, e.g. "helpers/slots".
      moduleDirectories: ["node_modules", "<rootDir>"],
      // Pins TZ=UTC so date-dependent results are the same on every machine.
      globalSetup: "<rootDir>/__tests__/unit/globalSetup.js",
      transform: {
        // diagnostics: false keeps the existing type-error backlog in app
        // files from failing unrelated tests. Type errors are checked
        // separately by `yarn typecheck`.
        "^.+\\.tsx?$": ["ts-jest", { diagnostics: false }],
      },
    },
  ],
};
