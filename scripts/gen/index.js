const { resolve: resolvePath } = require('path');
const { isPlainObject, capitalize } = require('@ntks/toolbox');

const { getConfig, ensureDirExists, readData, saveData, execute } = require('../helper');

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

function resolveRepoData(config, site) {
  const cookbook = readData(resolvePath(__dirname, './cookbook.yml'));
  const srcDir = config.source || `./.knosys/sites/${site}`;
  const siteDataDir = resolvePath(__dirname, '../..', `${srcDir}${config.generator === 'hexo' ? '/source' : ''}/_data`);

  const projectRepos = {};

  Object.keys(config.data).forEach(srcKey => {
    if (!srcKey.startsWith('project-')) {
      return;
    }

    const docs = readData(`${siteDataDir}/knosys/${srcKey}/docs.yml`);
    const docData = {};

    const projectSlug = srcKey.replace(/^project\-/, '');

    projectRepos[projectSlug] = {
      name: `${projectSlug.split('-').map(w => capitalize(w)).join(' ')} 项目文档`,
      base: `/projects/${projectSlug}`,
      collection: 'docs',
      toc: resolveDocToc(docs.structure, docData),
    };

    saveData(`${siteDataDir}/knosys/${projectSlug}.yml`, { items: docData });
  });

  ensureDirExists(`${siteDataDir}/local`);
  saveData(`${siteDataDir}/local/repos.yml`, { cookbook, ...projectRepos });
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
      setTimeout(() => resolveRepoData(siteConfig, site));
    }
  },
};
