const { resolve: resolvePath } = require('path');
const { readFileSync } = require('fs');

const rootPath = resolvePath(__dirname, '..');

module.exports = require(resolvePath(rootPath, JSON.parse(readFileSync(resolvePath(rootPath, '.knosys/config.json'), 'utf8').toString().trim()).$path));
