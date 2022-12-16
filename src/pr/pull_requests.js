const github = require("@actions/github");

class PullRequests {
  constructor(owner, repo, token) {
    this.owner = owner;
    this.repo = repo;
    this.token = token;
    this.octokit = github.getOctokit(token);
  }

  async getAllPullRequests() {
    const allOpenPullRequests = await this.octokit.paginate(
      "GET /repos/:owner/:repo/pulls",
      { owner: this.owner, repo: this.repo, state: "open" }
    );
    this.pulls = allOpenPullRequests;
  }

  async createPRComments() {}
  async filterBehindPullREquests() {
    let filteredPRs = [];
    for (let pr of this.pulls) {
      let head = pr["head"]["label"];
      let base = pr["base"]["label"];

      let results = await this.octokit.repos.compareCommitsWithBaseHead({
        owner: this.owner,
        repo: this.repo,
        basehead: `${base}...${head}`,
      });
      console.log(results);
    }
  }
}

module.exports = PullRequests;
