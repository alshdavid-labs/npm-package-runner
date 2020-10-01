class Command {
  constructor({
    script,
    options,
  }) {
    this.script = script
    this.options = options
  }
}

module.exports = { Command }