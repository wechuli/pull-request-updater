[![Build Action](https://github.com/wechuli/pull-request-updater/actions/workflows/build.yml/badge.svg)](https://github.com/wechuli/pull-request-updater/actions/workflows/build.yml)

# pull-request-updater

This Action updates all open pull requests with the latest changes from the base branches.

## Basic usage

```yml
- uses: wechuli/pull-request-updater@v2
```

This action will only update the pull request branch if it is behind the base branch, the update is skipped for pull requests that are already up to date with the base branch. By default, the action will attempt to update all open pull requests in the repository. You can optionally filter for specific bases or heads of the branches you want updated (more on this on the Options section below).

## Authentication

The Action will by default use the `$GITHUB_TOKEN` to make authenticated requests to the GitHub API. If you want to use a different token, you can set the `token` input to the token you want to use. The `GITHUB_TOKEN` is scoped to the repository where the workflow is executing, so if you specify a different repository, you'll need to pass a [Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) or [GitHub App token](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/managing-deploy-keys#server-to-server-tokens) that has access to that repository.

A PAT will need the `repo` scope to be able to update pull requests and add comments to the issues. The `GITHUB_TOKEN` and in general all GitHub App tokens will need the `pull-request: write` and `issues: write`

## Options

The action can be configured using the following inputs:

- `token`: The token to use to authenticate with the GitHub API. Defaults to the `$GITHUB_TOKEN`
- `repository`: The repository to update the pull requests for. Defaults to the repository where the workflow is running. If you want to update pull requests in a different repository, you'll need to pass a [Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) or [GitHub App token](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/managing-deploy-keys#server-to-server-tokens) that has access to that repository.
- `base`: The action will only update pull requests that match this base branch pattern. Default to `**` which means it won't filter by base branch.
- `head`: The action will only update pull requests that match this head branch pattern. Default to `**` which means it won't filter by head branch.
- `create-comment`: Whether to create a comment on the pull request when the branch is updated. Defaults to `true`. If this is set to `false`, the action will only update the pull request branch and not create a comment. This additional comment can be useful to notify the pull request author that the branch has been updated, or if any errors occurred during the update.

## Examples

### Update all open pull requests

```yml
- uses: wechuli/pull-request-updater@v2
```

### Update all open pull requests for the main branch

```yml
- uses: wechuli/pull-request-updater@v2
  with:
    base: main
```

### Update all open pull requests for a specific head branch

```yml
- uses: wechuli/pull-request-updater@v2
  with:
    head: feature/*
```

### Update all open pull requests for a specific head branch and base branch

```yml
- uses: wechuli/pull-request-updater@v2
  with:
    base: main
    head: feature/*
```

### Update all open pull requests for a specific head branch and base branch and don't create a comment

```yml
- uses: wechuli/pull-request-updater@v2
  with:
    base: main
    head: feature/*
    create-comment: false
```

### Update all open pull requests for a specific head branch and base branch and use a different token from GITHUB_TOKEN

```yml
- uses: wechuli/pull-request-updater@v2
  with:
    base: main
    head: feature/*
    token: ${{ secrets.MY_TOKEN }}
```

### Update all open pull requests for a specific head branch and base branch and use a different repository

```yml
- uses: wechuli/pull-request-updater@v2
  with:
    base: main
    head: feature/*
    token: ${{ secrets.MY_TOKEN }}
    repository: my-org/my-repo
```

## To Do

- Provide warnings in case of forks
- Provide options to choose whether to try to update fork pull requests or not
