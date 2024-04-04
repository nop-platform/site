const { resolve: resolvePath } = require('path');
const { pick } = require('@ntks/toolbox');

const { getConfig, readData, saveData, execute } = require('./helper');

const rootPath = resolvePath(__dirname, '..');

module.exports = {
  execute: (site = 'default') => {
    const config = getConfig(`site.${site}`);

    if (config.generator === 'hexo') {
      const pkg = readData(`${rootPath}/package.json`);
      const siteSrcPath = resolvePath(rootPath, config.source || `./.knosys/sites/${site}`);

      saveData(`${siteSrcPath}/package.json`, { name: `${pkg.name}-site`, ...pick(pkg, ['version', 'private', 'hexo', 'dependencies']) });
    }

    execute('site', 'serve', site);
  }
};
