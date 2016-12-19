// ============================================================================================
// GitHub projects page labels management
// ============================================================================================
(() => {

  // Initialization functions declaration
  let initLabelsUI = null;

  // On load, bootstrap projects page modifications
  $( document ).ready(() => { 
    // Check if github page
    if ($('head').find('meta[content="@github"]').length || window.location.hostname.match(/github/)) {
      // Check if projects page
      if (window.location.pathname.match(/.\/projects/)) {
        // Add label management
        initLabelsUI();
      }
    }
  })

  // Search
  // ============================================================================================
  {

    // Holds reference to currently shown labels menu element 
    let labelsMenuEl = null,
        issueNumber = null,
        token = null,
        hasChanges = false;

    /**
     * Inits labels management UI
     */
    initLabelsUI = function () {
      
      // Listen for clicks on labels
      $('.project-columns').mousedown((e) => {

        // If menu shown
        if (labelsMenuEl) {

          // Check if changes to Save
          if (hasChanges) {
            // Save all selected labels
            let labels = _.reduce($(labelsMenuEl).find('.select-menu-item.selected'), (labels, selectedLabelEl) => {
              labels.push($(selectedLabelEl).find('.name').html().trim());
              return labels;
            }, [null]);
            setLabels(issueNumber, labels, token);
          }

          // Clear previous labels menu
          if (labelsMenuEl) { $(labelsMenuEl).remove(); }
          hasChanges = false;
          labelsMenuEl = null;
        
        }

      });

      $('.project-columns').click((e) => {

        // Check if labels clicked
        if ($(e.target).hasClass('issue-card')) {

          // Show labels menu
          labelsMenuEl = document.createElement('div');
          labelsMenuEl.className = 'ogp-labels-menu label-select-menu';
          $(e.target).append(labelsMenuEl);

          // Reset changes flag
          hasChanges = false;

          // Prevent click on labels menu propagation
          $(labelsMenuEl).mousedown((e) => {
            e.originalEvent.stopPropagation();
          });

          // Get issue number
          let issueHTML = $(e.target).find('small').html();
          issueNumber = parseInt(issueHTML.trim().split(' ')[0].replace('#', ''));

          // Load issue labels
          getLabels(issueNumber)
            .then((res) => {

              // Store token
              token = res.token;

              // Inject labels menu HTML
              labelsMenuEl.innerHTML = res.html;

              // Prevent mouse scroll bleed
              let menuListEl = $(labelsMenuEl).find('.select-menu-list');
              menuListEl.on('DOMMouseScroll mousewheel', function(ev) {
                  var $this = $(this),
                      scrollTop = this.scrollTop,
                      scrollHeight = this.scrollHeight,
                      height = this.offsetHeight,
                      delta = (ev.type == 'DOMMouseScroll' ?
                      ev.originalEvent.detail * -40 :
                          ev.originalEvent.wheelDelta),
                      up = delta > 0;

                  var prevent = function() {
                      ev.stopPropagation();
                      ev.preventDefault();
                      ev.returnValue = false;
                      return false;
                  }

                  if (!up && -delta >= scrollHeight - height - scrollTop) {
                      // Scrolling down, but this will take us past the bottom.
                      $this.scrollTop(scrollHeight);
                      return prevent();
                  } else if (up && delta > scrollTop) {
                      // Scrolling up, but this will take us past the top.
                      $this.scrollTop(0);
                      return prevent();
                  }
              });

              // Handle label click
              _.forEach($(labelsMenuEl).find('.select-menu-item'), (itemEl) => {
                $(itemEl).click((e) => {

                  // Switch label UI state
                  if ($(itemEl).hasClass('selected')) {
                    $(itemEl).removeClass('selected');
                  } else {
                    $(itemEl).addClass('selected');
                  }

                  // Set changes flag
                  hasChanges = true;

                });
              });              

            });

        }

      })

    }

    /**
     * Gets available labels for an issue
     */
    function getLabels (issueNumber) {
      return getAuthenticityToken(issueNumber)
        .then((token) => {
          // Get project ID
          let parsedPath = window.location.pathname.split('/'),
              projectOwner = parsedPath[1],
              projectRepo = parsedPath[2],
              projectId = _.last(parsedPath);

          return new Promise((resolve, reject) => {
            // Get available labels
            $.ajax({
              method: 'GET',
              url: `/${projectOwner}/${projectRepo}/issues/${issueNumber}/show_partial?partial=issues%2Fsidebar%2Flabels_menu_content`,
              success: (html) => { 
                resolve({
                  token: token,
                  html: html
                }); 
              },
              error: reject
            });
          });
        });
    }
    /**
     * Gets authenticity token
     */
    function getAuthenticityToken (issueNumber) {
      // Get project ID
      let parsedPath = window.location.pathname.split('/'),
          projectOwner = parsedPath[1],
          projectRepo = parsedPath[2],
          projectId = _.last(parsedPath);

      return new Promise((resolve, reject) => {
        // Get available labels
        $.ajax({
          method: 'GET',
          url: `/${projectOwner}/${projectRepo}/issues/${issueNumber}`,
          success: (html) => { 
            
            // Parse response
            let bodyHTML = html.substr(html.indexOf('>', html.indexOf('<body')) + 1).replace('</body>', ''),
                bodyEl = document.createElement('div');
            bodyEl.innerHTML = bodyHTML;
            
            // Get authenticity token
            let inputEl = $(bodyEl).find('.sidebar-labels input[name="authenticity_token"]')[0],
                token = $(inputEl).attr('value');
            resolve(token);
            
          },
          error: reject
        });
      });
    }

    /**
     * Sets labels for an issue
     */
    function setLabels (issueNumber, labels, token) {
      // Get project ID
      let parsedPath = window.location.pathname.split('/'),
          projectOwner = parsedPath[1],
          projectRepo = parsedPath[2],
          projectId = _.last(parsedPath);

      return new Promise((resolve, reject) => {
        // Get available labels
        $.ajax({
          method: 'POST',
          url: `/${projectOwner}/${projectRepo}/issues/${issueNumber}?partial=issues%2Fsidebar%2Fshow%2Flabels`,
          data: {
            _method: 'put',
            authenticity_token: token,
            issue: { labels: labels }
          },
          success: (html) => { resolve(html); },
          error: reject
        });
      });
    }

  }

})()