const { resolveRootPath, ensureDirExists, copyFileDeeply, execute, getNopThemeDirPath } = require('./helper');

module.exports = {
  execute: site => {
    if (site) {
      execute('site', 'copy', site);
    } else {
      const themeSrcPath = `${resolveRootPath()}/node_modules/hexo-theme-lime`;
      const themeDistPath = getNopThemeDirPath();

      ensureDirExists(themeDistPath);
      copyFileDeeply(themeSrcPath, themeDistPath, ['README.md', 'CHANGELOG.md', 'package.json']);
    }
  },
};
