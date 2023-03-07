const github = require("@actions/github");
const axios = require("axios");

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
  filterBehindPullREquests() {
    let filteredPRs = [];
    for (let pr of this.pulls) {
      let head = pr["head"]["label"];
      let base = pr["base"]["label"];

      console.log(typeof(this.octokit.rest.repos.compareCommitsWithBaseHead));

      // let results = this.octokit.rest.repos.compareCommitsWithBaseHead({
      //   owner: this.owner,
      //   repo: this.repo,
      //   basehead: `${base}...${head}`,
      // });

      // let results = await this.octokit.rest.pulls.get({
      //   owner: this.owner,
      //   repo: this.repo,
      //   pull_number: pr.number,
      // });

      // typeof(results)
      // console.log(results);
    }
  }
}

module.exports = PullRequests;
