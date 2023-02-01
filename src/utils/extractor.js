const core = require("@actions/core");

function extractInputsAndEnvs() {
  const token = core.getInput("token");
  const repoFull = process.env["GITHUB_REPOSITORY"];
  const [owner, repo] = repoFull.split("/");
  return [token, owner, repo];
}

module.exports = {
  extractInputsAndEnvs,
};
