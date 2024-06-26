const { execSync } = require('child_process');
const { pick } = require('@ntks/toolbox');

const { resolveRootPath, ensureDirExists, copyFileDeeply, cp, saveData, execute, getNopThemeDirPath } = require('./helper');

const pkgName = '@nop-community/hexo-theme-site';

function copyMetaFiles(rootPath) {
  const distDir = `${rootPath}/dist`;
  const readmeTemplate = `# \`${pkgName}\`
`;

  saveData(`${distDir}/README.md`, readmeTemplate);
  // cp(`${rootPath}/CHANGELOG.md`, `${distDir}/`);
}

function copyThemeFiles(rootPath) {
  const themeSrcPath = getNopThemeDirPath();
  const themeDistPath = `${rootPath}/dist`;

  ensureDirExists(themeDistPath, true);
  copyFileDeeply(themeSrcPath, themeDistPath);

  const pkgFields = pick(require(`${rootPath}/package.json`), ['version', 'repository', 'author', 'license', 'bugs', 'homepage']);

  saveData(`${themeDistPath}/package.json`, JSON.stringify({
    name: pkgName,
    description: 'Theme for Nop project docs',
    main: 'index.js',
    keywords: ['nop', 'nop-platform', 'nop-community', 'knosys', 'ksio', 'hexo', 'theme'],
    peerDependencies: { 'hexo-front-matter-defaults': '~0.0.0' },
    ...pkgFields,
  }, null, 2));
  copyMetaFiles(rootPath);
  cp(`${rootPath}/.knosys/scripts/helper/nop-project.js`, `${themeDistPath}/index.js`);
}

module.exports = {
  execute: (type = 'site', site = 'default') => {
    const rootPath = resolveRootPath();

    if (type === 'theme') {
      copyThemeFiles(rootPath);
      execSync('npm publish --access=public', { stdio: 'inherit', cwd: `${rootPath}/dist` });
    } else if (type === 'site') {
      execSync('npm run clean', { stdio: 'inherit', cwd: rootPath });
      execute('site', 'deploy', site);
    }
  },
};
