const concurrently = require('concurrently');
const { Command } = require('./command');
const { Options } = require('./options');

const runScript = async (packages, script, options = []) => {
  let _task = ''
  let _options = []
  let _concurrentlyOptions = {}

  if (script instanceof Command) {
    _task = script.script
    _options = [ ...(script.options || []) ]
  } else {
    _task = script
  }

  _options = [ ..._options, ...options ]

  if (_options.includes(Options.NoPrefix)) {
    _concurrentlyOptions.prefix = 'none'
  }
  if (_options.includes(Options.KillOthersOnFailure)) {
    _concurrentlyOptions.killOthers = [ ...(_concurrentlyOptions.killOthers || []), 'failure']
  }
  if (_options.includes(Options.KillOthersOnSuccess)) {
    _concurrentlyOptions.killOthers = [ ...(_concurrentlyOptions.killOthers || []), 'success']
  }
  
  const commands = []
  for (const pkg of packages) {
    if (!pkg.scripts[_task]) {
      continue
    }

    let command = []
    command.push(`cd "${pkg.workingDir}"`)

    if (!_options.includes(Options.SkipWait)) {
      for (const depPkg of pkg.dependsOn) {
        command.push(`npx wait-on "${depPkg.readyWhen}"`)
      }
    }

    command.push(pkg.scripts[_task])
    if (commands.includes(command)) {
      continue
    }
    commands.push({ name: `${pkg.alias || pkg.name}:${_task}`, command: command.join(' && ') })
  }
  return concurrently(commands, _concurrentlyOptions)
}

module.exports = { runScript }