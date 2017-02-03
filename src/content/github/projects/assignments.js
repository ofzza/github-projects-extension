// ============================================================================================
// GitHub projects page assigment management
// ============================================================================================
let initAssignmentUI = null;
export default function bootstrap () { initAssignmentUI(); }  

// Search
// ============================================================================================
{

  // Holds reference to currently shown assignments menu element 
  let assignmentMenuEl = null,
      issueNumber = null,
      token = null,
      hasChanges = false;

  /**
   * Inits assignments management UI
   */
  initAssignmentUI = function () {
    
    // Listen for clicks outside of assignments
    $('body, .project-columns').mousedown((e) => {

      // If menu shown
      if (assignmentMenuEl) {

        // Check if changes to Save
        if (hasChanges) {
          // Save all selected assignments
          let assignments = _.reduce($(assignmentMenuEl).find('.select-menu-item.selected'), (assignments, selectedAssignmentEl) => {
            let avaratUrl = $(selectedAssignmentEl).find('img.avatar').attr('src').trim(),
                avatarId = _.last(avaratUrl.split('/')).split('?')[0];
            assignments.push(avatarId);
            return assignments;
          }, [null]);
          setAssignment(issueNumber, assignments, token);
        }

        // Clear previous assignments menu
        if (assignmentMenuEl) { $(assignmentMenuEl).remove(); }
        hasChanges = false;
        assignmentMenuEl = null;
      
      }

    });

    // Listen for clicks on assignments
    $('.project-columns').click((e) => {

      // Check if assigments clicked
      let issueEl = ($(e.target).hasClass('issue-card') ? $(e.target) : $(e.target).parents('.issue-card')),
          issueElOffset = issueEl && issueEl.length && issueEl.offset(),
          isIssue = issueEl && issueEl.length && issueEl.attr('data-content-type').toLowerCase() === 'issue',
          isAssignmentSpecificTriggerClicked = $(e.target).hasClass('avatar-stack') || $(e.target).hasClass('avatar'),
          isCommonEditTriggerClicked = $(e.target).hasClass('card-menu-container'),
          isPositionAssignment = issueElOffset && (e.clientX > issueElOffset.left + (issueEl.width() / 2));
      if (isIssue && ((isCommonEditTriggerClicked && isPositionAssignment) || isAssignmentSpecificTriggerClicked)) {

        // Show assignments menu
        assignmentMenuEl = document.createElement('div');
        assignmentMenuEl.className = 'ogp-assignments-menu assignments-select-menu';
        $($(e.target).parents('.issue-card')[0]).append(assignmentMenuEl);

        // Reset changes flag
        hasChanges = false;

        // Prevent click on assignments menu propagation
        $(assignmentMenuEl).mousedown((e) => {
          e.originalEvent.stopPropagation();
        });

        // Get issue number
        let issueHTML = $(e.target).parents('.issue-card').find('small').html();
        issueNumber = parseInt(issueHTML.trim().split(' ')[0].replace('#', ''));

        // Load issue assignments
        getAssignments(issueNumber)
          .then((res) => {
            if (assignmentMenuEl) {

              // Store token
              token = res.token;

              // Inject assignments menu HTML
              assignmentMenuEl.innerHTML = res.html;

              // Focus filter
              $(assignmentMenuEl).find('.select-menu-text-filter input').focus();

              // Prevent mouse scroll bleed
              let menuListEl = $(assignmentMenuEl).find('.select-menu-list');
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

              // Handle assignments click
              _.forEach($(assignmentMenuEl).find('.select-menu-item'), (itemEl) => {
                $(itemEl).click((e) => {

                  // Switch assignment UI state
                  if ($(itemEl).hasClass('selected')) {
                    $(itemEl).removeClass('selected');
                  } else {
                    $(itemEl).addClass('selected');
                  }

                  // Set changes flag
                  hasChanges = true;

                });
              });              

            }
          });

      }

    })

  }

  /**
   * Gets available assignments for an issue
   */
  function getAssignments (issueNumber) {
    return getAuthenticityToken(issueNumber)
      .then((token) => {
        // Get project ID
        let parsedPath = window.location.pathname.split('/'),
            projectOwner = parsedPath[1],
            projectRepo = parsedPath[2],
            projectId = _.last(parsedPath);

        return new Promise((resolve, reject) => {
          // Get available assignments
          $.ajax({
            method: 'GET',
            url: `/${projectOwner}/${projectRepo}/issues/${issueNumber}/show_partial?partial=issues%2Fsidebar%2Fassignees_menu_content`,
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
      // Get available assignments
      $.ajax({
        method: 'GET',
        url: `/${projectOwner}/${projectRepo}/issues/${issueNumber}`,
        success: (html) => { 
          
          // Parse response
          let bodyHTML = html.substr(html.indexOf('>', html.indexOf('<body')) + 1).replace('</body>', ''),
              bodyEl = document.createElement('div');
          bodyEl.innerHTML = bodyHTML;
          
          // Get authenticity token
          let inputEl = $(bodyEl).find('.sidebar-assignee input[name="authenticity_token"]')[0],
              token = $(inputEl).attr('value');
          resolve(token);
          
        },
        error: reject
      });
    });
  }

  /**
   * Sets assignments for an issue
   */
  function setAssignment (issueNumber, assignments, token) {
    // Get project ID
    let parsedPath = window.location.pathname.split('/'),
        projectOwner = parsedPath[1],
        projectRepo = parsedPath[2],
        projectId = _.last(parsedPath);

    return new Promise((resolve, reject) => {
      // Get available assignments
      $.ajax({
        method: 'POST',
        url: `/${projectOwner}/${projectRepo}/issues/${issueNumber}?partial=issues%2Fsidebar%2Fshow%2Fassignees`,
        data: {
          _method: 'put',
          authenticity_token: token,
          issue: { user_assignee_ids: assignments }
        },
        success: (html) => { resolve(html); },
        error: reject
      });
    });
  }

}