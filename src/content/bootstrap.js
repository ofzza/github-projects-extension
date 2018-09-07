// ============================================================================================
// GitHub projects page optimizations
// ============================================================================================
import testFn from './github/test';

// Load
(() => {

  // Check if other version already loaded (in case both GitHub.con and Enterprise versions installed)
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
    const metaEl = metaEls[i];
    if (metaEl.attributes && (metaEl.attributes.property && metaEl.attributes.property.value === 'og:site_name') && (metaEl.attributes.content && metaEl.attributes.content.value === 'GitHub')) {
      foundGitHubMetaElement = true;
      break;
    }
  }
  if (foundGitHubMetaElement) {
    
    // Initialize and load JS scripts
    testFn();

  }
})()
