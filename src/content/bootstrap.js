// ============================================================================================
// GitHub projects page optimizations
// ============================================================================================
import { namespace as ns } from "./namespace";
import bootstrapPersonalNotes from "./github/issue-personal-notes";
import bootstrapProjectsNewIssueBtn from "./github/projects-newissue-btn";

// Load
(() => {
  // Check if other version already loaded (in case both GitHub.con and Enterprise versions installed)
  if (document.body.getAttribute(ns)) {
    console.log(
      "> GitHub Projects Optimizer: Another version already loaded ..."
    );
    return;
  } else {
    document.body.setAttribute(ns, "true");
  }

  // Check if github page
  let metaEls = document.getElementsByTagName("meta"),
    foundGitHubMetaElement = false;
  for (let i in metaEls) {
    const metaEl = metaEls[i];
    if (metaEl && metaEl.getAttribute) {
      let propertyMatch = metaEl.getAttribute("property") === "og:site_name";
      if (propertyMatch) {
        let propertyValue = metaEl.getAttribute("content"),
          propertyValueMatch =
            propertyValue && propertyValue.substr(0, 6) === "GitHub";
        if (propertyMatch && propertyValueMatch) {
          foundGitHubMetaElement = true;
          break;
        }
      }
    }
  }
  if (foundGitHubMetaElement) {
    // Initialize and load JS scripts
    // bootstrapPersonalNotes();

    // Initialize projects page "New issue" button
    bootstrapProjectsNewIssueBtn();
  }
})();
