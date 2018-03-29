// ============================================================================================
// GitHub projects page optimizations
// ============================================================================================
import bootstrapSearch from './github/projects/search';
import bootstrapLabels from './github/projects/labels';
import bootstrapAssignments from './github/projects/assignments';

// On load, bootstrap plugin
$( document ).ready(() => { 

  // Check if other version already loaded (in case both GitHub.con and Enterprise versions installed)
  if ($(document.body).attr('ofzza-github-projects-optimizer')) { 
    console.log('> GitHub Projects Optimizer: Another version already loaded ...');
    return; 
  } else {
    $(document.body).attr('ofzza-github-projects-optimizer', 'true');
  }

  // Check if github page
  if ($('head').find('meta[content="@github"]').length || window.location.hostname.match(/github/)) {
    
    // Check if projects page
    if (window.location.pathname.match(/.\/projects/)) {
      
      // Bootstrap search optimizations
      bootstrapSearch();

      // Bootstrap labels optimizations
      bootstrapLabels();

      // Bootstrap assignment optimizations
      bootstrapAssignments();

    }

  }
  
})