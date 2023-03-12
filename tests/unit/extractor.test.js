const { extractInputsAndEnvs } = require("../../src/utils/extractor");

test("test extractor function throws error if invalid repo is supplied", () => {
  expect(() => {
    extractInputsAndEnvs("token", "invalidformat");
  }).toThrow(Error);
});

test("test extractor function returns an array of length 3", () => {
  expect(extractInputsAndEnvs("token", "owner/repo").length).toBe(3);
});
