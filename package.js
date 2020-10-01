const path = require('path');

class Package {
  constructor({
    workingDir,
    readyWhenFiles = [],
    readyWhen = [],
    dependsOn = [],
    name,
    onlyScripts,
    alias
  }) {
    this.workingDir = path.resolve(...workingDir)
    this.dependsOn = dependsOn
    this.alias = alias
    this.scripts = require(path.join(this.workingDir, 'package.json')).scripts
    this.name = name || require(path.join(this.workingDir, 'package.json')).name
    this.readyWhen = readyWhenFiles.map(file => path.join(this.workingDir, file))
    this.readyWhen = [...this.readyWhen, ...readyWhen]
    this.onlyScripts = onlyScripts
  }
}

module.exports = { Package }