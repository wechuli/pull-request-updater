const core = require("@actions/core");
const PullRequests = require("./pr/pull_requests");
const { extractInputsAndEnvs } = require("./utils/extractor");

async function run() {
  try {
    let [token, owner, repo] = extractInputsAndEnvs();

    let pullRequests = new PullRequests(owner, repo, token);
    await pullRequests.getAllPullRequests();
    console.log(pullRequests.pulls);

    await pullRequests.filterBehindPullRequests();

    console.log(`All pull requests: ${length(pullRequests.pulls)}`);
    console.log(
      `Filtered pull requests: ${length(pullRequests.filteredPulls)}`
    );
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
