[![Build Action](https://github.com/wechuli/pull-request-updater/actions/workflows/build.yml/badge.svg)](https://github.com/wechuli/pull-request-updater/actions/workflows/build.yml)

# pull-request-updater

This Action updates all open pull requests with the latest changes from the base branches.

## Usage

```yml
- uses: wechuli/pull-request-updater@v1
  with:
    # token used to authenticate with GitHub, defaults to GITHUB_TOKEN
    token: ""
    # the repository to update pull requests for, defaults to the current repository where the workflow is executed
    repository: ""
```

This action will only update the pull request branch if it is behind the base branch, the update is skipped for pull requests that are already up to date with the base branch

## Authentication

The Action will by default use the `$GITHUB_TOKEN` to make authenticated requests to the GitHub API. If you want to use a different token, you can set the `token` input to the token you want to use. The `GITHUB_TOKEN` is scoped to the repository where the workflow is executing, so if you specify a different repository, you'll need to pass a [Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) or [GitHub App token](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/managing-deploy-keys#server-to-server-tokens) that has access to that repository.

A PAT will need the `repo` scope to be able to update pull requests and add comments to the issues. The `GITHUB_TOKEN` and in general all GitHub App tokens will need the `pull-request: write` and `issues: write`

## Additional

- Edit the endpoints to Factor in using GHES as well
- By default use GITHUB_TOKEN
- Provide appropriate warnings in case of merge conflicts
- Provide warnings in case of forks
- Provide warnings or errors in case the merge cannot be performed
- Create comment in the pull request with apropriate time for the merge.
- Detect if the head branch is behind and only then update the pull request, otherwise skip the update - https://docs.github.com/en/rest/commits/commits#compare-two-commits
