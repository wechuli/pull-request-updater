const core = require("@actions/core");

function extractInputsAndEnvs(
  token = core.getInput("token"),
  repoFull = core.getInput("repo"),
  base = core.getInput("base"),
  head = core.getInput("head"),
  updateforks = core.getInput("updateforks"),
  createComments = core.getInput("create-comments")
) {
  let reposplit = repoFull.split("/");

  // check if the repository is valid
  try {
    if (reposplit.length !== 2) {
      throw new Error("Invalid repository format");
    }
  } catch (error) {
    throw new Error(
      "It appears the repository format is invalid. Please use the format 'owner/repo'."
    );
  }
  let [owner, repo] = reposplit;
  return [token, owner, repo];
}

module.exports = {
  extractInputsAndEnvs,
};
