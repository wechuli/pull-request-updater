const core = require("@actions/core");
const PullRequests = require("./utils/pull_requests");

async function run() {
  try {
    let token = core.getInput("token");
    let repoFull = process.env["GITHUB_REPOSITORY"];
    let [owner, repo] = repoFull.split("/");

    let pullRequests = new PullRequests(owner, repo, token);
    await pullRequests.getAllPullRequests();
    //console.log(pullRequests.pull_requests);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
