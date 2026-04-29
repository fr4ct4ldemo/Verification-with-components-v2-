const chalkImport = require('chalk');
const chalk = chalkImport.default || chalkImport;

function info(message, ...extra) {
  console.log(chalk.cyan('[FractalVerify]'), message, ...extra);
}

function warn(message, ...extra) {
  console.warn(chalk.yellow('[FractalVerify]'), message, ...extra);
}

function error(message, ...extra) {
  console.error(chalk.red('[FractalVerify]'), message, ...extra);
}

module.exports = { info, warn, error };
