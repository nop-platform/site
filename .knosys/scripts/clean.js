const { resolve: resolvePath } = require('path');
const { resolveRootPath, getConfig, rm } = require('@knosys/sdk');

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
    const { source } = getConfig(`site.${site}`);

    if (source) {
      patterns.forEach(p => rm(resolvePath(resolveRootPath(), `${source}/${p}`)));
    }
  },
};
