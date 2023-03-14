const core = require("@actions/core");
const PullRequests = require("./pr/pull_requests");
const { extractInputsAndEnvs } = require("./utils/extractor");

async function run() {
  try {
    let { token, owner, repo } = extractInputsAndEnvs();

    let pullRequests = new PullRequests(owner, repo, token);
    await pullRequests.run();
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
