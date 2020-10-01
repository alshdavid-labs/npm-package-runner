const { Package, Options, Command } = require('@alshdavid/npm-package-runner')

const __packages = [__dirname, 'packages']
const __testing = [__dirname, 'testing']

const a = new Package({
  alias: 'a',
  workingDir: [...__packages, 'a'],
  readyWhenFiles: [ 'build.txt' ],
})

const b = new Package({
  alias: 'b',
  workingDir: [...__packages, 'b'],
  readyWhenFiles: [ 'build.txt' ],
  dependsOn: [ a ]
})

const c = new Package({
  alias: 'c',
  workingDir: [...__packages, 'c'],
  readyWhenFiles: [ 'build.txt' ],
  dependsOn: [ b ]
})

const d = new Package({
  alias: 'd',
  workingDir: [...__packages, 'd'],
  readyWhenFiles: [ 'build.txt' ],
  dependsOn: [ c ]
})

const devServer = new Package({
  alias: 'dev-server',
  workingDir: [...__testing, 'dev-server'],
  readyWhen: [ 'tcp:8080' ],
  dependsOn: [ a, b ]
})

const Commands = {
  clean: new Command({
    script: 'clean',
    options: [ Options.SkipWait ]
  }),
  build: new Command({
    script: 'build',
    options: [ Options.KillOthersOnFailure ]
  }),
  dev: new Command({
    script: 'dev',
    options: [ Options.KillOthersOnFailure ]
  }),
  test: new Command({
    script: 'test',
    options: [ Options.KillOthersOnFailure ]
  }),
  devServer: new Command({
    script: 'dev',
    options: [ Options.KillOthersOnFailure, Options.NoPrefix ]
  }),
}

module.exports = {
  commands: Commands,
  packages: [ a, b, c, d, devServer ],
  defaultActions: [
    { 
      name: 'Clean Solution', 
      commands: [Commands.clean],
    },
    { 
      name: 'Build Solution', 
      commands: [Commands.clean, Commands.build], 
    },
    { 
      name: 'Develop Solution', 
      commands: [Commands.clean, Commands.dev], 
    },
    { 
      name: 'Develop (Packages Only)', 
      commands: [Commands.clean, Commands.dev],
      packages: [ a, b, c, d ] 
    },
    { 
      name: 'Develop (Server Only)', 
      commands: [Commands.devServer], 
      packages: [ devServer ]
    },
  ]
}

