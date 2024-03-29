const github = require("@actions/github");
const axios = require("axios");
const { extractInputsAndEnvs } = require("../utils/extractor");
const { branchesFilter } = require("../utils/branchesFilter");

const headers = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  Authorization: `Bearer ${extractInputsAndEnvs().token}`,
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
    this.URL = serverURL.split("/")[2];
  }

  async getAllPullRequests() {
    const allOpenPullRequests = await this.octokit.paginate(
      "GET /repos/:owner/:repo/pulls",
      { owner: this.owner, repo: this.repo, state: "open" }
    );
    this.pulls = allOpenPullRequests;
  }

  async createPRComments(
    owner,
    repo,
    prNumber,
    comment,
    createComments = extractInputsAndEnvs().createComments
  ) {
    if (!createComments) {
      return;
    }
    try {
      await axios.post(
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
  async filterPrsByBranches(prs = this.pulls) {
    let localsFilteredPrs = [];
    let baseFilters = branchesFilter(extractInputsAndEnvs().base);
    let headFilters = branchesFilter(extractInputsAndEnvs().head);
    for (let pr of prs) {
      let base = pr["base"]["ref"];
      let head = pr["head"]["ref"];
      for (let baseBranchFilter of baseFilters) {
        for (let headBranchFilter of headFilters) {
          if (baseBranchFilter(base) && headBranchFilter(head)) {
            localsFilteredPrs.push(pr);
          }
        }
      }
    }
    this.filteredPulls = localsFilteredPrs;
  }
  async filterBehindPullRequests(prs = this.filteredPulls) {
    let localFilteredPulls = [];
    try {
      for (let pr of prs) {
        let base = pr["base"]["label"];
        let head = pr["head"]["label"];
        const { data: pull_request } = await axios.get(
          `https://api.${this.URL}/repos/${this.owner}/${this.repo}/compare/${base}...${head}`,
          { headers }
        );

        if (pull_request["behind_by"] > 0) {
          localFilteredPulls.push(pr);
        }
      }
      this.filteredPulls = localFilteredPulls;
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
            `This pull request has been updated on ${utcDate} with the latest changes from the base branch (${pr.base.ref}).`
          );
        } catch (error) {
          console.log("...........................................");
          // show link to pr
          console.log(`error updating pr: ${pr["number"]} - ${pr["url"]}`);
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
    await this.filterPrsByBranches();
    await this.filterBehindPullRequests();
    await this.updatePRbranches();
  }
}

module.exports = PullRequests;
