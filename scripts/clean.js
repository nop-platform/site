const { resolve: resolvePath } = require('path');
const { getConfig, rm } = require('@knosys/sdk');

const rootPath = resolvePath(__dirname, '..');
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
      patterns.forEach(p => rm(resolvePath(rootPath, `${source}/${p}`)));
    }
  },
};
