const core = require('@actions/core')
const fs = require('fs')
const path = require('path')

try {
  const filePath = core.getInput('filePath') != '' ? core.getInput('filePath') : 'package.json'
  const jsonFile = JSON.parse(fs.readFileSync(path.resolve(process.env.GITHUB_WORKSPACE, filePath)))

  const branch = core.getInput('branch').replace('/', '-')
  const packageVersion = jsonFile.version

  jsonFile.version = getVersion(branch, packageVersion)

  core.setOutput('version', jsonFile.version);

} catch (error) {
  core.setFailed(error.message);
}

function getVersion(branch, packageVersion) {
  const separatorIndex = packageVersion.indexOf('-');
  if (separatorIndex > -1) {
    const baseVersion = packageVersion.substring(0, separatorIndex).replace(/\./g, "-");
    const isMasterBranch = (branch === 'master' || branch === '');

    if (isMasterBranch) {
      return `${baseVersion}`;
    }

    return `${baseVersion}-${branch}`;
  }
  const stringVersion = packageVersion.replace(/\./g, "-");
  return `${stringVersion}`;
}
