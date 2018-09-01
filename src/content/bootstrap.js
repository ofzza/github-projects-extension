// ============================================================================================
// GitHub projects page optimizations
// ============================================================================================

// On load, bootstrap plugin
window.addEventListener('load', () => {

  // Check if other version already loaded (in case both GitHub.con and Enterprise versions installed)
  if (document.body.getAttribute('ofzza-github-projects-optimizer')) { 
    console.log('> GitHub Projects Optimizer: Another version already loaded ...');
    return; 
  } else {
    document.body.setAttribute('ofzza-github-projects-optimizer', 'true');
  }

  // Check if github page
  let metaEls = document.getElementsByTagName('meta'),
      foundGitHubMetaElement = false;
  for (let i in metaEls) {
    if ((metaEls[i]['name'] === 'octolytics-app-id') && (metaEls[i]['content'] === 'github')) {
      foundGitHubMetaElement = true;
      break;
    }
  }
  if (foundGitHubMetaElement || window.location.hostname.match(/github/)) {
    
    // TODO: ...

  }
  
});
