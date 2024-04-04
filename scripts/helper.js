const { resolve: resolvePath } = require('path');
const { readFileSync } = require('fs');

const rootPath = resolvePath(__dirname, '..');
const ksdk = require(resolvePath(rootPath, JSON.parse(readFileSync(resolvePath(rootPath, '.knosys/config.json'), 'utf8').toString().trim()).$path));

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
