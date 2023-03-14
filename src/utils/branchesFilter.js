function branchesFilter(branches) {
  let filteredbranches = [];
  //   remove empty spaces
  branches = branches.replace(/\s/g, "");
  // check if the string contains a comma

  if (branches.includes(",")) {
    // split the string into an array
    branches = branches.split(",");
  }
}
