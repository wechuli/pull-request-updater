const github = require("@actions/github");
const axios = require("axios");
const { extractInputsAndEnvs } = require("../utils/extractor");

const headers = {
  Accept: "application/vnd.github+json",
  Authorization: `Bearer ${extractInputsAndEnvs()[0]}`,
};


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
  async filterBehindPullRequests() {
    try {
      let filteredPRs = [];
      for (let pr of this.pulls) {
        let head = pr["head"]["label"];
        let base = pr["base"]["label"];
        const { data: pull_request } = await axios.get(
          `https://api.github.com/repos/${this.owner}/${this.repo}/compare/${head}...${base}`,
          { headers }
        );
        console.log(pull_request);

        if (pull_request["behind_by"] > 0) {
          filteredPRs.push(pull_request);
        }
      }

      this.filteredPulls = filteredPRs;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = PullRequests;
