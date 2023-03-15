const pm = require("picomatch");
const core = require("@actions/core");

function branchesFilter(branches) {
  let filteredbranches = [];
  if (branches.includes(",")) {
    let branchesArray = branches.split(",");
    for (let branch of branchesArray) {
      filteredbranches.push(pm(branch));
    }
  } else {
    filteredbranches.push(pm(branches));
  }

  return filteredbranches;
}

module.exports = {
  branchesFilter,
};
