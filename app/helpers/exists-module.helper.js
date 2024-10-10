const {join} = require('path');
const {existsSync} = require('fs');
// verify if exists module

const existsModule = (module) => {
  return existsSync(join(__dirname, `../../modules/${module}`));
}

module.exports = existsModule;