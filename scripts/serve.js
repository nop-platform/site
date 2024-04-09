const { resolve: resolvePath } = require('path');
const { pick } = require('@ntks/toolbox');
const { resolveRootPath, getConfig, readData, saveData } = require('@knosys/sdk');
const { execute } = require('ksio');

const { resolveSiteSrcDir } = require('./helper');

module.exports = {
  execute: (site = 'default') => {
    if (getConfig(`site.${site}.generator`) === 'hexo') {
      const rootPath = resolveRootPath();
      const pkg = readData(`${rootPath}/package.json`);
      const siteSrcPath = resolvePath(rootPath, resolveSiteSrcDir(site));

      saveData(`${siteSrcPath}/package.json`, { name: `${pkg.name}-site`, ...pick(pkg, ['version', 'private', 'hexo', 'dependencies']) });
    }

    execute('site', 'serve', site);
  }
};
