# GitHub Projects Chrome extension

- Adds "@special" and "#type" labels to issues and milestones pages
- Adds "@special" and "#type" labels to project page's cards

# Installation links:

#### Chrome
  - [Chrome](https://chrome.google.com/webstore/detail/github-projects-plus/pkkhkgaamkjaepakanehpgbifoljadnl)
  - [Chrome (GitHub Enterprise version)](https://chrome.google.com/webstore/detail/github-projects-plus/pkkhkgaamkjaepakanehpgbifoljadnl)

#### Firefox
  - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/github-projects-plus/)
  - [Firefox (GitHub Enterprise version)](https://addons.mozilla.org/en-US/firefox/addon/github-entprise-projects-plus/)

#### Opera:
  - [Opera](https://addons.opera.com/en/extensions/details/github-projects-plus/)
  - Opera (GitHub Enterprise version): awaiting moderation - coming soon!

# Deployment

1) Install NPM dependencies:
```
npm install
```

2) Build project:

... for development
```
gulp build && gulp watch
```

... or for production
```
gulp build --production
```

3) Load unpacked extension from ```/dist``` directory.

# License

Published under [MIT License](./LICENSE)
