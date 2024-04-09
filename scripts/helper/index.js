const { resolve: resolvePath } = require('path');
const { resolveRootPath } = require('@knosys/sdk');

const utils = require('./nop-project');

function getNopThemeDirPath() {
  return resolvePath(resolveRootPath(), utils.resolveSiteSrcDir('default'), 'themes/nop-project');
}

module.exports = { ...utils, getNopThemeDirPath };
