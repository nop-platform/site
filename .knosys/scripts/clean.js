const { resolve: resolvePath } = require('path');
const { resolveRootPath, rm } = require('@knosys/sdk');

const { resolveSiteSrcDir } = require('./helper');

const patterns = [
  '/.cache/',
  '/.asset-cache/',
  '/.sass-cache/',
  '/_assets/*/knosys/',
  '/_data/knosys/',
  '/_knosys/',
];

module.exports = {
  execute: (site = 'default') => {
    const srcDir = resolveSiteSrcDir(site);

    patterns.forEach(p => rm(resolvePath(resolveRootPath(), `${srcDir}/${p}`)));
  },
};
