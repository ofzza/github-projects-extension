# GitHub Projects Chrome extension

- Adds "@special" and "#type" labels to issues and milestones pages
- Adds "@special" and "#type" labels to project page's cards
- Adds a functional search-bar, labels management and other functionality to Github Projects page.
  <br>(```DEPRECATED as the search is now natively supported by GutHub```)

# Installation links:

#### Chrome
  - [Chrome](https://chrome.google.com/webstore/detail/github-projects-plus/pkkhkgaamkjaepakanehpgbifoljadnl)
  - [Chrome (GitHub Enterprise version)](https://chrome.google.com/webstore/detail/github-projects-plus/pkkhkgaamkjaepakanehpgbifoljadnl)

#### Firefox
  - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/github-projects-plus/)
  - [Firefox (GitHub Enterprise version)](https://addons.mozilla.org/en-US/firefox/addon/github-entprise-projects-plus/)

#### Opera:
  - Opera: awaiting moderation - coming soon!
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

3) Load unpacked Chrome extension from ```/dist``` directory.

# License

Published under [MIT License](./LICENSE)

# Attribution

#### jQuery 

[jQuery](https://jquery.org/)

#### Lodash

[Lodash](https://github.com/lodash/lodash)