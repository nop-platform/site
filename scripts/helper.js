const { resolve: resolvePath } = require('path');

const rootPath = resolvePath(__dirname, '..');
const ksdk = { ...require('@knosys/sdk'), ...require('ksio') };

function resolveSiteSrcDir(site) {
  return ksdk.getConfig(`site.${site}.source`) || `./.knosys/sites/${site}`;
}

function getNopThemeDirPath() {
  return resolvePath(rootPath, resolveSiteSrcDir('default'), 'themes/nop-project');
}

module.exports = {
  ...ksdk,
  resolveSiteSrcDir,
  getNopThemeDirPath,
};
