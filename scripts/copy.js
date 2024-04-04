const { resolve: resolvePath } = require('path');

const { getConfig, ensureDirExists, copyFileDeeply, execute, getNopThemeDirPath } = require('./helper');

const rootPath = resolvePath(__dirname, '..');

module.exports = {
  execute: site => {
    if (site) {
      execute('site', 'copy', site);
    } else {
      const themeSrcPath = `${rootPath}/node_modules/hexo-theme-lime`;
      const themeDistPath = getNopThemeDirPath();

      ensureDirExists(themeDistPath);
      copyFileDeeply(themeSrcPath, themeDistPath, ['README.md', 'CHANGELOG.md', 'package.json']);
    }
  },
};
