const { resolve: resolvePath } = require('path');
const { readData } = require('@knosys/sdk');

const { generateProjectDocs } = require('../helper');

module.exports = {
  execute: (site = 'default', sourceKey) => generateProjectDocs(site, {
    sourceKey,
    repos: { cookbook: readData(resolvePath(__dirname, './cookbook.yml')) }
  }),
};
