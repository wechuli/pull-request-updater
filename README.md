# pull-request-updater
GitHub Actions to Update the pull request branch with the base branch

## Problem Statement

Users want the pull request branch to be always up to date with the base branch to make sure code is up to date

## Functionality

Update the pull request whenever code from the default branch is updated.

## Additional

- By default use GITHUB_TOKEN
- Provide appropriate warnings in case of merge conflicts
- Provide warnings in case of forks
- Provide warnings or errors in case the merge cannot be performed
- Create comment in the pull request with apropriate time for the merge.
- Detect if the head branch is behind and only then update the pull request, otherwise skip the update - https://docs.github.com/en/rest/commits/commits#compare-two-commits

