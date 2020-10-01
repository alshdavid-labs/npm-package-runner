const concurrently = require('concurrently');

const runScript = (packages, script, options) => {
  const commands = []
  for (const pkg of packages) {
    if (!pkg.scripts[script]) {
      continue
    }

    let command = []
    command.push(`cd "${pkg.workingDir}"`)

    if (script.includes('build')) {
      for (const depPkg of pkg.dependsOn) {
        command.push(`npx wait-on "${depPkg.readyWhen}"`)
      }
    }

    command.push(pkg.scripts[script])
    if (commands.includes(command)) {
      continue
    }
    commands.push({ name: `${pkg.alias || pkg.name}:${script}`, command: command.join(' && ') })
  }
  return concurrently(commands, options)
}

module.exports = { runScript }