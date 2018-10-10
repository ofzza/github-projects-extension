### v2.0.1
  [x] Introduced `changelog.md` file to track future version changes
  [x] Updated README.md with Opera published link and some cleanup
  [x] Cleanup of label selectors and support for "super labels" differentiation by label description ("[special]"/"[type]") and not just label name prefix ("@"/"#")
  [x] Fixed "super labels" positioning to lineup with relative order within "super label" kind (up to 5 labels of each kind)
  [x] JS bootstrapping only after detection of GitHub by meta tags (for enterprise deployment on custom domains)
  [x] Deprecated Enterprise version of the plugin, while making the vanilla plugin bootstrap on any domain after detection of GitHub by meta tags 
  [x] Private (local storate persisted) notes for issues on Projects, Issues/Milestones and Issue details pages

### v2.0.2
  [x] Fixed GitHUb site detection
  [x] Fixed issue causing Personal Notes not to bootstrap if loading directly onto a milestone pages
  [x] Fixed wrapping on long Personal Notes

### v2.0.3
  [x] Fixed issues with duplicated Personal Notes buttons on issues list's issues with comments icon
