const core = require("@actions/core");

function extractInputsAndEnvs() {
  const token = core.getInput("token");
  const repoFull = core.getInput("repo") || process.env["GITHUB_REPOSITORY"];

  let owner, repo;

  // check if the repository is valid
  try {
    [owner, repo] = repoFull.split("/");
  } catch (error) {
    throw new Error(
      "It appears the repository format is invalid. Please use the format 'owner/repo'."
    );
  }

  return [token, owner, repo];
}

module.exports = {
  extractInputsAndEnvs,
};
