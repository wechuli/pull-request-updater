const github = require("@actions/github");
{
}
class PullRequests {
  constructor(owner, repo, token) {
    this.owner = owner;
    this.repo = repo;
    this.token = token;
    this.octokit = github.getOctokit(token, {});
  }

  async getAllPullRequests() {
    const results = await this.octokit.paginate(
      "GET /repos/:owner/:repo/pulls",
      { owner: this.owner, repo: this.repo, state: "open" }
    );
    console.log(results);
  }
}

module.exports = PullRequests;
