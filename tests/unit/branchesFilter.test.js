const { branchesFilter } = require("../../src/utils/branchesFilter");

// write tests for the branchesFilter function

test("test branchesFilter function returns an array of length 1 if branches is **", () => {
  expect(branchesFilter("**")).toHaveLength(1);
});

test("test branchesFilter function returns an array of length 2 if branches is master,dev", () => {
  expect(branchesFilter("master,dev")).toHaveLength(2);
});

test("test branchesFilter function returns an array of length 1 if branches is master", () => {
  expect(branchesFilter("master")).toHaveLength(1);
});

// test logic of filtering branches
test("test branchesFilter function returns true if branch is master", () => {
  expect(branchesFilter("master")[0]("master")).toBe(true);
});

test("test branchesFilter function returns false if branch is dev", () => {
  expect(branchesFilter("master")[0]("dev")).toBe(false);
});

test("test branchesFilter function returns true for any branch if the filter is **", () => {
  expect(branchesFilter("**")[0]("release/v2.0/v7.0")).toBe(true);
});

test("test branchesFilter function returns correct values for branches with /", () => {
  expect(branchesFilter("release/v*/*")[0]("release/v2.0/7.0")).toBe(true);
});
