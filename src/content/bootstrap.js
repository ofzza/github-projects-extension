// ============================================================================================
// GitHub projects page optimizations
// ============================================================================================

// Check if other version already loaded (in case both GitHub.con and Enterprise versions installed)
(() => {
  if (document.body.getAttribute('github-projects-plus')) { 
    console.log('> GitHub Projects Optimizer: Another version already loaded ...');
    return; 
  } else {
    document.body.setAttribute('github-projects-plus', 'true');
  }

  // Check if github page
  let metaEls = document.getElementsByTagName('meta'),
      foundGitHubMetaElement = false;
  for (let i in metaEls) {
    if ((metaEls[i]['name'] === 'og:site_name') && (metaEls[i]['content'] === 'GitHub')) {
      foundGitHubMetaElement = true;
      break;
    }
  }
  if (foundGitHubMetaElement) {
    
    // TODO: ...

  }
})()
