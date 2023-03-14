const github = require("@actions/github");
const { GitHub } = require("@actions/github/lib/utils");
const axios = require("axios");
const { extractInputsAndEnvs } = require("../utils/extractor");

const headers = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  Authorization: `Bearer ${extractInputsAndEnvs()[0]}`,
};

class PullRequests {
  constructor(
    owner,
    repo,
    token,
    serverURL = process.env["GITHUB_SERVER_URL"]
  ) {
    this.owner = owner;
    this.repo = repo;
    this.token = token;
    this.octokit = github.getOctokit(token);
    this.filteredPulls = [];

    // serverURL is in the form https://github.com i want to extract only the github.com part

    this.URL = serverURL.split("//")[2];

    // get server endpoint in case ghes
  }

  async getAllPullRequests() {
    const allOpenPullRequests = await this.octokit.paginate(
      "GET /repos/:owner/:repo/pulls",
      { owner: this.owner, repo: this.repo, state: "open" }
    );
    this.pulls = allOpenPullRequests;
  }

  async createPRComments(owner, repo, prNumber, comment) {
    try {
      const response = await axios.post(
        `https://api.${this.URL}/repos/${owner}/${repo}/issues/${prNumber}/comments`,
        {
          body: comment,
        },
        {
          headers,
        }
      );
    } catch (error) {
      console.log(error.response.data);
    }
  }
  async filterBehindPullRequests() {
    try {
      let filteredPRs = [];
      for (let pr of this.pulls) {
        let base = pr["base"]["label"];
        let head = pr["head"]["label"];
        const { data: pull_request } = await axios.get(
          `https://api.${this.URL}/repos/${this.owner}/${this.repo}/compare/${base}...${head}`,
          { headers }
        );

        if (pull_request["behind_by"] > 0) {
          filteredPRs.push(pull_request);
          this.filteredPulls.push(pr);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  async updatePRbranches() {
    if (this.filteredPulls.length > 0) {
      // update prs with base
      for (let pr of this.filteredPulls) {
        try {
          await axios.put(
            `https://api.${this.URL}/repos/${this.owner}/${this.repo}/pulls/${pr["number"]}/update-branch`,
            null,
            { headers }
          );
          // get current utc time
          const date = new Date();
          const utcDate = date.toUTCString();
          await this.createPRComments(
            this.owner,
            this.repo,
            pr["number"],
            `This pull request has been updated at ${utcDate} with the latest changes from the base branch (${pr.base.ref}).`
          );
        } catch (error) {
          console.log("...........................................");
          console.log(`error updating pr: ${pr["number"]}`);
          console.log(error.response.data);
          console.log("...........................................");

          // create comment on pull request if the error is as a result of merge conflicts

          if (
            error.response.data.message ==
            "merge conflict between base and head"
          ) {
            await this.createPRComments(
              this.owner,
              this.repo,
              pr["number"],
              `This pull request has merge conflicts that must be resolved before it can be updated with the latest changes from the base branch (${pr.base.ref}).`
            );
          }
        }
      }
    }
  }

  async run() {
    await this.getAllPullRequests();
    await this.filterBehindPullRequests();
    await this.updatePRbranches();
  }
}

module.exports = PullRequests;
