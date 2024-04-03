const { resolve: resolvePath } = require('path');
const { isPlainObject } = require('@ntks/toolbox');

const { getConfig, readData, saveData, execute } = require('../helper');

function resolveDocToc(docs, docData) {
  return docs.map(({ title, uri, children }) => {
    const resolved = {};

    if (title) {
      resolved.text = title;
    }

    const slug = `${uri.replace(/(?:\/)?(index)?\.md$/, '') || 'index'}`;

    resolved.slug = slug;
    docData[slug] = { title: title || '', slug };

    if (children) {
      resolved.items = resolveDocToc(children, docData);
    }

    return resolved;
  });
}

function resolveRepoData(config) {
  const cookbook = readData(resolvePath(__dirname, './cookbook.yml'));
  const siteDataDir = resolvePath(__dirname, '../..', `${config.source}/_data`)
  const docs = readData(`${siteDataDir}/knosys/doc/docs.yml`);

  const docData = {};
  const docRepo = { name: 'Nop Entropy 文档', base: '/projects/nop-entropy', collection: 'docs', toc: resolveDocToc(docs.structure, docData) };

  saveData(`${siteDataDir}/local/repos.yml`, { cookbook, doc: docRepo });
  saveData(`${siteDataDir}/knosys/docs.yml`, { items: docData });
}

module.exports = {
  execute: (site = 'default', sourceKey) => {
    const siteConfig = getConfig(`site.${site}`);
    const { data } = siteConfig;

    let keys = [];

    if (data) {
      if (isPlainObject(data)) {
        if (sourceKey) {
          if (data[sourceKey]) {
            keys.push(sourceKey);
          }
        } else {
          keys = Object.keys(data);
        }
      }
    }

    keys.forEach(key => execute('generate', site, key));

    if (site === 'default') {
      setTimeout(() => resolveRepoData(siteConfig));
    }
  },
};
