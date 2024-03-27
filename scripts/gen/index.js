const { execute } = require('../helper');

module.exports = {
  execute: (site = 'default') => {
    return execute('generate', site);
  },
};
