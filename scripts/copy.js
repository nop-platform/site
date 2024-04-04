const { resolve: resolvePath } = require('path');

const { getConfig, ensureDirExists, copyFileDeeply, execute } = require('./helper');

const rootPath = resolvePath(__dirname, '..');

module.exports = {
  execute: site => {
    if (site) {
      execute('site', 'copy', site);
    } else {
      const themeSrcPath = `${rootPath}/node_modules/hexo-theme-lime`;
      const themeDistPath = resolvePath(rootPath, getConfig('site.default.source') || './.knosys/sites/default', 'themes/nop-project');
  
      ensureDirExists(themeDistPath);
      copyFileDeeply(themeSrcPath, themeDistPath, ['README.md', 'CHANGELOG.md', 'package.json']);
    }
  },
};
