const { resolve: resolvePath } = require('path');
const { existsSync } = require('fs');
const { isArray, isPlainObject, capitalize } = require('@ntks/toolbox');
const { resolveRootPath, getConfig, isDirectory, ensureDirExists, readData, saveData, normalizeFrontMatter } = require('@knosys/sdk');
const { execute } = require('ksio');

function resolveSiteSrcDir(site) {
  return getConfig(`site.${site}.source`) || `./.knosys/sites/${site}`;
}

function resolveSlug(uri) {
  return `${uri.replace(/(?:\/)?(index)?\.md$/, '') || 'index'}`;
}

function resolveDefaultDocToc(docs, docData) {
  return docs.map(({ title, uri, children }) => {
    const resolved = {};

    if (title) {
      resolved.text = title;
    }

    const slug = resolveSlug(uri);

    resolved.slug = slug;
    docData[slug] = { title: title || '', slug };

    if (children) {
      resolved.items = resolveDefaultDocToc(children, docData);
    }

    return resolved;
  });
}

function resolveCustomizedDocToc(srcPath, items, parentUri, docData) {
  const resolved = [];

  items.forEach(({ text, uri, children }) => {
    const item = {};

    if (text) {
      item.text = text;
    }

    if (uri) {
      let docFile;

      if (uri.startsWith('./')) {
        docFile = uri;
      } else {
        docFile = `./${parentUri && !uri.endsWith('.md') ? [parentUri.replace(/^\\\./, ''), uri].join('/') : uri}`;
      }

      const docPath = resolvePath(srcPath, docFile);

      if (existsSync(docPath) && !isDirectory(docPath)) {
        const slug = resolveSlug(docFile.slice(2));

        if (!item.text) {
          const content = readData(docPath);

          if (content) {
            const normalized = normalizeFrontMatter(content);

            if (normalized.data && normalized.data.title) {
              item.text = normalized.data.title;
            }
          }
        }

        item.slug = slug;
        docData[slug] = { title: item.text || '', slug };
      } else {
        const errText = `[NOP_ERR: \`${uri}\` 不存在或不是文件 ]`;

        item.text = item.text ? `${item.text} ${errText}` : errText;
      }
    }

    if (isArray(children)) {
      item.items = resolveCustomizedDocToc(srcPath, children, uri, docData);
    }

    resolved.push(item);
  });

  return resolved;
}

function resolveRepoData(site, config, existsRepos = {}) {
  const rootPath = resolveRootPath();
  const siteDataDir = resolvePath(rootPath, `${resolveSiteSrcDir(site)}${config.generator === 'hexo' ? '/source' : ''}/_data`);

  const projectRepos = {};

  Object.entries(config.data).forEach(([srcKey, srcDir]) => {
    if (!srcKey.startsWith('project-')) {
      return;
    }

    const docData = {};
    const srcPath = resolvePath(rootPath, srcDir);
    const customizedTocPath = `${srcPath}/.meta/toc.yml`;
    const customized = existsSync(customizedTocPath);

    let toc;

    if (customized) {
      toc = resolveCustomizedDocToc(srcPath, readData(customizedTocPath), '', docData);
    } else {
      toc = resolveDefaultDocToc(readData(`${siteDataDir}/knosys/${srcKey}/docs.yml`).structure, docData);
    }

    const projectSlug = srcKey.replace(/^project\-/, '');

    projectRepos[projectSlug] = {
      name: `${projectSlug.split('-').map(w => capitalize(w)).join(' ')} 项目文档`,
      base: `/projects/${projectSlug}`,
      collection: 'docs',
      toc,
      customized,
    };

    saveData(`${siteDataDir}/knosys/${projectSlug}.yml`, { items: docData });
  });

  ensureDirExists(`${siteDataDir}/local`);
  saveData(`${siteDataDir}/local/repos.yml`, { ...existsRepos, ...projectRepos });
}

function generateProjectDocs(site, opts = {}) {
  const siteConfig = getConfig(`site.${site}`);
  const { sourceKey, repos } = opts;
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
  setTimeout(() => resolveRepoData(site, siteConfig, repos));
}

module.exports = { resolveSiteSrcDir, generateProjectDocs };
