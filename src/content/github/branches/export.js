// ============================================================================================
// GitHub branches page export  management
// ============================================================================================
let initBranchesExportUI = null,
    exporting = false;
export default function bootstrap () { initBranchesExportUI(); }  

// Export
// ============================================================================================
{

  /**
   * Inits branches export UI
   */
  initBranchesExportUI = function () {

    // Append with export button
    let exportButtonEl = document.createElement('span');
    exportButtonEl.className = 'branches-export-button';
    exportButtonEl.innerHTML = '<svg aria-hidden="true" class="octicon octicon-desktop-download" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 6h3V0h2v6h3l-4 4-4-4zm11-4h-4v1h4v8H1V3h4V2H1c-.55 0-1 .45-1 1v9c0 .55.45 1 1 1h5.34c-.25.61-.86 1.39-2.34 2h8c-1.48-.61-2.09-1.39-2.34-2H15c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1z"></path></svg>';
    exportButtonEl.setAttribute('title', 'Export branches list');
    exportButtonEl.onclick = () => {
      if (!exporting) {

        // Set working status
        exporting = true;
        exportButtonEl.setAttribute('working', 'true');

        // Load branches on load
        GetBranches() 
          .then((branches) => {

            // Set working status
            exporting = false;
            exportButtonEl.setAttribute('working', 'false');

            // Prepare branches content
            let content = _.reduce(branches, (content, branch) => {
              return content + `${ branch.name }, ${ branch.ahead || '0' }, ${ branch.behind || '0' }\n`;
            }, 'Branch name, Ahead, Behind\n');

            // Copy to clipboard
            let textArea = document.createElement("textarea");
            textArea.className = 'branches-export-textarea';

            textArea.value = content;
            document.body.appendChild(textArea);
            textArea.select();

            // Copy from text area using JS clipboard.copy command
            try {
              if (document.execCommand('copy')) {
                alert('Copied to clipboard!');
                document.body.removeChild(textArea);
              } else {
                textArea.setAttribute('title', 'Click to remove!');
                textArea.onclick = () => { document.body.removeChild(textArea); }
              }
            } catch (err) {
              textArea.setAttribute('title', 'Click to remove!');
              textArea.onclick = () => { document.body.removeChild(textArea); }
            }

          });

      }
    };
    $('[name="query"]').parent().prepend(exportButtonEl);

  }

  /**
   * Loads all branches
   * @param {any} { page = 0, resolve } 
   * @returns 
   */
  function GetBranches ({ page, resolve, branches = [] } = {  }) {
    
    // Check if running recursively
    if (typeof page !== 'undefined') {

        // Get current query
        let query = $('[name="query"]').val();

        // Try listing out pages
        $.ajax(`${ window.location.href.split('?')[0] }/?query=${ query }&page=${ page }`, {
          method: 'GET',
          success: (data) => {
            
            // Process received HTML
            let el = document.createElement('div');
            el.innerHTML = data;

            // Extract all branches
            let branchEls = $(el).find('.branch-details .branch-name');
            _.forEach(branchEls, (branchEl) => {
              let branchName = branchEl.innerText,
                  branchDetailsEl = $(branchEl).parent().parent(),
                  branchStatusEl = branchDetailsEl.find('.branch-a-b-count'),
                  branchStatus = (branchStatusEl.length ? branchStatusEl.attr('aria-label') : null);
              if (branchStatus) {
                let branchStatusParsed = branchStatus.split(','),
                    branchStatusAhead = parseInt(branchStatusParsed[0]) || 0,
                    branchStatusBehind = parseInt(branchStatusParsed[1]) || 0;
                branches.push({
                  name: branchName,
                  ahead: branchStatusAhead,
                  behind: branchStatusBehind
                });
              }
            });

            // Move onto next page if any results
            if (branchEls.length) {
              GetBranches({ page: page + 1, resolve, branches });
            } else {
              // Resolve original request
              resolve(branches);
            }

          }
        })

    } else {
    
      // Start loading pages
      return new Promise((resolve, reject) => {
        GetBranches({ page: 1, resolve });
      });

    }

  }

}