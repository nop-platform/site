const { resolve: resolvePath } = require('path');

const ksUtils = require('./knosys');
const nopUtils = require('./nop-project');

function getNopThemeDirPath() {
  return resolvePath(ksUtils.resolveRootPath(), nopUtils.resolveSiteSrcDir('default'), 'themes/nop-project');
}

module.exports = { ...ksUtils, ...nopUtils, getNopThemeDirPath };
