# GitHub Projects Chrome extension

- Adds "@special" and "#type" labels support to projects and issues/milestones pages
- Adds personal notes support to issues on projects, issues/milestones and issue details pages

# Installation links:

#### Chrome

- [Chrome](https://chrome.google.com/webstore/detail/github-projects-plus/pkkhkgaamkjaepakanehpgbifoljadnl)
- [Chrome ([Deprecated] GitHub Enterprise version)](https://chrome.google.com/webstore/detail/github-projects-plus/pkkhkgaamkjaepakanehpgbifoljadnl)

#### Firefox

- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/github-projects-plus/)
- [Firefox ([Deprecated] GitHub Enterprise version)](https://addons.mozilla.org/en-US/firefox/addon/github-entprise-projects-plus/)

#### Opera (No longer maintained):

- [Opera](https://addons.opera.com/en/extensions/details/github-projects-plus/)
- [Opera ([Deprecated] GitHub Enterprise version)](https://addons.opera.com/en/extensions/details/github-enterprise-projects-plus/)

# Deployment

1. Install NPM dependencies:

```
npm install
```

2. Build project:

... for development

```
gulp build && gulp watch
```

... or for production

```
gulp build --production
```

3. Load unpacked extension from `/dist` directory.

# License

Published under [MIT License](./LICENSE)
