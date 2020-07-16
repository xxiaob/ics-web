
/*eslint-disable */
//console.log(process.argv)
//设置默认为dev
let defaultEvn = 'dev'
let evnMode = defaultEvn

for (let i = 0; i < process.argv.length; i++) {
  if (process.argv[i] === '--build') {
    evnMode = process.argv[i + 1] || defaultEvn
    break
  }
}

console.log(`building for ${evnMode}.host.js`)

let sysConfigs = require(`../allConfigs/${evnMode}.config`)

module.exports = {
  NODE_ENV: '"production"',
  apiHostConfig: sysConfigs.apiHostConfig,
  aMapConfig: sysConfigs.aMapConfig,
  agoraConfig: sysConfigs.agoraConfig
}
