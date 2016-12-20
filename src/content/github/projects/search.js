// ============================================================================================
// GitHub projects page search
// ============================================================================================
(() => {

  // Initialization functions declaration
  let initSearchUI = null;

  // On load, bootstrap projects page modifications
  $( document ).ready(() => { 
    // Check if github page
    if ($('head').find('meta[content="@github"]').length || window.location.hostname.match(/github/)) {
      // Check if projects page
      if (window.location.pathname.match(/.\/projects/)) {
        // Augment filtering
        initSearchUI();
      }
    }
  })

  // Search
  // ============================================================================================
  {

    // Holds references to ui-sugar elements
    let assigneesEls = {},
        labelsEls = {};

    // Holds current suggestions
    let suggestions = [], 
        suggestionValues = [],
        selectedSuggestion = null;


    // Removes quotation marks from start and end of string 
    function clearQuotations (value) {
      // Clear leading and endoing quotations
      if (value && value.length && (value[0] === '"' || value[0] === '\'' || value[0] === '`')) { value = value.substr(1); } 
      if (value && value.length && (value[value.length - 1] === '"' || value[value.length - 1] === '\'' || value[value.length - 1] === '`')) { value = value.substr(0, value.length - 1); } 
      return value;
    }

    /**
     * Injects a filter input into the page and manages it's functionality'
     */
    initSearchUI = function () {

      // Detect full-screen
      let fullscreen = (window.location.search.indexOf('fullscreen=true') > -1);

      // Initialize search bar
      let searchBarContainerEl = document.createElement('div');
      searchBarContainerEl.className = 'ogp-search-bar-container';

      let searchBarEl = document.createElement('input');
      searchBarEl.className = 'ogp-search-bar-element';
      searchBarEl.type = 'text';
      searchBarEl.placeholder = 'Filter';      
      $(searchBarContainerEl).append(searchBarEl);

      let searchSuggestionsEl = document.createElement('ul');
      searchSuggestionsEl.className = 'ogp-suggestions-element';
      $(searchBarContainerEl).append(searchSuggestionsEl);

      let searchBarHelpPanelEl = document.createElement('div');
      searchBarHelpPanelEl.className = 'ogp-search-bar-help-panel';

      let searchBarHelpPanelClose = document.createElement('a');
      searchBarHelpPanelClose.className = 'ogp-search-bar-help-close';
      searchBarHelpPanelClose.innerText = 'close';
      $(searchBarHelpPanelEl).append(searchBarHelpPanelClose);

      let searchBarHelpPanelContent = document.createElement('div');
      searchBarHelpPanelContent.className = 'ogp-search-bar-help-content';
      searchBarHelpPanelContent.innerHTML = `
      
        <div class="ogp-search-example">
          <div class="ogp-search-example-syntax">
            "<i>Fix problem</i>"
          </div>
          <div class="ogp-search-example-comment">
            Finds all issues, notes and pull requests with searched phrase ("Fix problem") in title or label
          </div>
        </div>
      
        <div class="ogp-search-example">
          <div class="ogp-search-example-syntax">
            "<i>Joe</i>"
          </div>
          <div class="ogp-search-example-comment">
            Finds all issues, notes and pull requests created by or assigned to user "Joe"
          </div>
        </div>

        <div class="ogp-search-example">
          <div class="ogp-search-example-syntax">
            "<i>Fix problem</i>" <b>;</b>
            "<i>Joe</i>"
          </div>
          <div class="ogp-search-example-comment">
            Finds all issues, notes and pull requests with searched phrase ("Fix problem") in title or label that is also created by or assigned to user "Joe"
          </div>
        </div>

        <div class="ogp-search-example">
          <div class="ogp-search-example-syntax">
            "<i>1234</i>"
          </div>
          <div class="ogp-search-example-comment">
            Finds issue or pull request #1234
          </div>
        </div>

        <div class="ogp-search-example">
          <div class="ogp-search-example-comment">
            Search by card type and current status
          </div>
          <div class="ogp-search-example-syntax indent">
            <b>is:</b> <i>note</i>
          </div>
          <div class="ogp-search-example-syntax indent">
            <b>is:</b> <i>issue</i> <b>;</b>
            <b>is:</b> <i>open</i>
          </div>
          <div class="ogp-search-example-syntax indent">
            <b>is:</b> <i>issue</i> <b>;</b> 
            <b>is:</b> <i>closed</i>
          </div>
          <div class="ogp-search-example-syntax indent">
            <b>is:</b> <i>pull request</i> <b>;</b> 
            <b>is:</b> <i>open</i>
          </div>
          <div class="ogp-search-example-syntax indent">
            <b>is:</b> <i>pr</i> <b>;</b> 
            <b>is:</b> <i>closed</i>
          </div>
          <div class="ogp-search-example-syntax indent">
            <b>is:</b> <i>pr</i> <b>;</b> 
            <b>is:</b> <i>merged</i>
          </div>
        </div>

        <div class="ogp-search-example">
          <div class="ogp-search-example-comment">
            Search by phrase in card title
          </div>
          <div class="ogp-search-example-syntax indent">
            <b>title:</b> <i>do something</i>
          </div>
        </div>

        <div class="ogp-search-example">
          <div class="ogp-search-example-comment">
            Search by issue or pull reuqest number
          </div>
          <div class="ogp-search-example-syntax indent">
            <b>#</b><i>123</i>
          </div>
          <div class="ogp-search-example-syntax indent">
            <b>num:</b> <i>1234</i>
          </div>
          <div class="ogp-search-example-syntax indent">
            <b>number:</b> <i>12345</i>
          </div>
        </div>

        <div class="ogp-search-example">
          <div class="ogp-search-example-comment">
            Search by user who opened the card
          </div>
          <div class="ogp-search-example-syntax indent">
            <b>opened: </b> <i>Joe</i>
          </div>
          <div class="ogp-search-example-syntax indent">
            <b>created: </b> <i>Joe</i>
          </div>
          <div class="ogp-search-example-syntax indent">
            <b>by: </b> <i>Joe</i>
          </div>
        </div>

        <div class="ogp-search-example">
          <div class="ogp-search-example-comment">
            Search by assigned user
          </div>
          <div class="ogp-search-example-syntax indent">
            <b>assignee: </b> <i>Joe</i>
          </div>
          <div class="ogp-search-example-syntax indent">
            <b>assigned: </b> <i>Joe</i>
          </div>
          <div class="ogp-search-example-syntax indent">
            <b>to: </b> <i>Joe</i>
          </div>
          <div class="ogp-search-example-syntax indent">
            <b>for: </b> <i>Joe</i>
          </div>
        </div>

        <div class="ogp-search-example">
          <div class="ogp-search-example-comment">
            Search by label
          </div>
          <div class="ogp-search-example-syntax indent">
            <b>label: </b> <i>bug</i>
          </div>
        </div>

      `;
      $(searchBarHelpPanelEl).append(searchBarHelpPanelContent);

      let searchBarHelpEl = document.createElement('span');
      searchBarHelpEl.className = 'ogp-search-bar-help-element';
      searchBarHelpEl.innerText = '?';
      let helpMouseoverTimeout = null;
      $(searchBarHelpEl).click(() => {
        // Show help 
        if ($(searchBarHelpPanelEl).hasClass('ogp-shown')) {
          searchBarHelpPanelEl.className = 'ogp-search-bar-help-panel';
        } else {
          searchBarHelpPanelEl.className = 'ogp-search-bar-help-panel ogp-shown';
        }
      });
      $(searchBarHelpPanelClose).click((e) => {
        // Hide help
        searchBarHelpPanelEl.className = 'ogp-search-bar-help-panel'; 
      });

      // Initialize search tooltip
      let searchTooltipEl = document.createElement('span');
      searchTooltipEl.className = 'ogp-search-tooltip-el';

      // Assign search handler
      let delayedSearchTimeout = null,
          delayedSearchFn = (e) => {
            if (delayedSearchTimeout) { clearTimeout(delayedSearchTimeout); }
            delayedSearchTimeout = setTimeout(() => { 
              // Filter results
              searchBarInputHandlerFn(searchTooltipEl, (e.target || searchBarEl).value); 
              // Check for suggestions
              checkSearchSuggestions(searchSuggestionsEl, e.target || searchBarEl);
            }, 200);
          };
      $(searchBarEl).click(delayedSearchFn);
      $(searchBarEl).focus(delayedSearchFn);
      $(searchBarEl).blur(delayedSearchFn);
      $(searchBarEl).change(delayedSearchFn);
      $(searchBarEl).keyup(delayedSearchFn);
      delayedSearchFn(); 
      
      // Check if suggestions present and keypress should manipulate dropdown
      $(searchBarEl).keydown((e) => {
        if (checkKeypressForSuggestions(e)) {
          checkSearchSuggestions(searchSuggestionsEl, e.target);
        }
      });

      // Insert search bar
      let searchContainerEl = (fullscreen && $('.full-screen-project-header > div').length ? $('.full-screen-project-header > div') : $('.project-header > .float-right'));
      searchContainerEl.prepend(searchBarHelpEl);
      searchContainerEl.prepend(searchBarContainerEl);
      searchContainerEl.prepend(searchBarHelpPanelEl);
      searchContainerEl.prepend(searchTooltipEl);
      $(searchBarEl).focus();

    }

    /**
     * Checks if suggestions need to be shown
     */
    function checkSearchSuggestions (searchSuggestionsEl, searchEl) {

      // Get search terms and caret position
      let searchSyntax = searchEl.value,
          searchCaretPosition = searchEl.selectionStart;

      // Check if previous char is ':'
      if ($(searchEl).is(":focus") && (searchCaretPosition > 0) && (searchSyntax.lastIndexOf(':', (searchCaretPosition - 1)) > searchSyntax.lastIndexOf(';', (searchCaretPosition - 1)))) {

        // Get explicit search operator
        let semicolonPosition = searchSyntax.lastIndexOf(':', (searchCaretPosition + 1)) + 1,
            operatorStartSpacePosition = searchSyntax.lastIndexOf(' ', semicolonPosition - 1),
            operatorStartSemicPosition = searchSyntax.lastIndexOf(';', semicolonPosition - 1),
            operatorStartPosition = (operatorStartSpacePosition > operatorStartSemicPosition ? operatorStartSpacePosition : operatorStartSemicPosition),
            operator = searchSyntax.substr((operatorStartPosition + 1), ((semicolonPosition - 1) - (operatorStartPosition + 1))).trim().toLowerCase(),
            valueEndSemicPosition = searchSyntax.indexOf(';', semicolonPosition),
            valueEndPosition = (valueEndSemicPosition > -1 && valueEndSemicPosition < searchSyntax.length  ? valueEndSemicPosition : null),
            value = clearQuotations(searchSyntax.length > semicolonPosition ? searchSyntax.substr((semicolonPosition), (valueEndPosition ? (valueEndPosition + 1 - (semicolonPosition + 1)) : undefined)).trim().toLowerCase() : null);
        
        // Search for suggestions
        suggestions = []; 
        suggestionValues = [];
        if (operator === 'label') {
          suggestions = _.reduce(labelsEls, (suggestions, el, label) => {
            if (!value || label.trim().toLowerCase().indexOf(value) > -1) {
              let suggestionEl = $(el).clone()[0];
              $(suggestionEl).removeAttr('href');
              $(suggestionEl).attr('key', label.trim().toLowerCase());
              suggestionValues.push(label.trim().toLowerCase());
              suggestions.push(suggestionEl);
            }
            return suggestions;
          }, []);
        } else if ((operator === 'opened') || (operator === 'created') || (operator === 'by') || (operator === 'assignee') || (operator === 'assigned') || (operator === 'to') || (operator === 'for')) {
          suggestions = _.reduce(assigneesEls, (suggestions, el, username) => {
            if (!value || username.trim().toLowerCase().indexOf(value) > -1) {
              let suggestionEl = document.createElement('span');
              suggestionEl.innerHTML = '<b style="margin-left: 4px;">' + username + '</b>';
              $(suggestionEl).prepend($(el).clone()[0]);
              $(suggestionEl).attr('key', username.trim().toLowerCase());
              suggestionValues.push(username.trim().toLowerCase());
              suggestions.push(suggestionEl);
            }
            return suggestions;
          }, []);
        }

        // Wrap elements
        let selectedSuggestionEl = null;
        suggestions = _.map(suggestions, (suggestionEl, i) => {
          let el = document.createElement('li');
          if (suggestionValues[i] === selectedSuggestion) {
            selectedSuggestionEl = el;
            el.className = 'ogp-suggestion-item selected';
          } else {
            el.className = 'ogp-suggestion-item';
          }
          $(el).append(suggestionEl);
          $(el).click(() => {

            // Inject element value to search syntax
            let value = suggestionValues[i];
            searchEl.focus();
            let syntax = searchSyntax.substr(0, semicolonPosition) + ' ' + value + (valueEndPosition ? searchSyntax.substr(valueEndPosition) : '');
            searchEl.value = syntax;
            let position = semicolonPosition + value.length + 1;
            searchEl.setSelectionRange(position, position);

          })
          return el;
        });

        // Set suggestions
        let suggestionsEl = $(searchSuggestionsEl);
        suggestionsEl.empty();
        suggestionsEl.append(suggestions);

        // If selected, scroll to selected element
        if (selectedSuggestionEl) {
          let offset = $(selectedSuggestionEl).position().top;
          if (offset > 160) { 
            $(searchSuggestionsEl).scrollTop(offset - 160); 
          } else {
            $(searchSuggestionsEl).scrollTop(0);
          }
        }

        // Show suggestions
        searchSuggestionsEl.style.display = ((suggestions.length > 1) || (suggestions.length === 1 && suggestionValues[0] !== value) ? 'block' : 'none');

      } else {

        // Hide suggestions
        searchSuggestionsEl.style.display = 'none';

      }

    }
    /**
     * Checks if keypress should manage suggestions dropdown
     */
    function checkKeypressForSuggestions (e) {
      // Check if actionable key pressed
      if ([38/* UP */, 40/* DOWN */, 33/* PGUP */, 34/* PGDOWN */, 13/* ENTER */].indexOf(e.keyCode) > -1) {
        
        // Prevent event propagation
        e.preventDefault();

        // Find current selected suggestion's index
        let selectedIndex = suggestionValues.indexOf(selectedSuggestion);

        // Select a suggestion (process keypress as drop-down action)
        if (e.keyCode == 38) {
          if (selectedIndex >= 1) { 
            selectedSuggestion = suggestionValues[selectedIndex - 1]; 
            return true;
          }
        } else if (e.keyCode == 40) {
          if (selectedIndex + 1 < suggestionValues.length) {
            selectedSuggestion = suggestionValues[selectedIndex + 1]; 
            return true;
          }
        } else if (e.keyCode == 33) {
            selectedSuggestion = suggestionValues[0]; 
            return true;
        } else if (e.keyCode == 34) {
            selectedSuggestion = suggestionValues[suggestionValues.length - 1]; 
            return true;
        } else if (e.keyCode == 13) {
          if (selectedIndex > -1) {
            (suggestions[selectedIndex]).click();
            return true;
          }
        }

      }
    }

    /**
     * Handles search input
     */
    function searchBarInputHandlerFn (searchTooltipEl, value) { 
      
      // Filter issues and notes
      if (!value.trim()) {

        // Don't filter anything
        $('.issue-card.project-card').css('display', 'block');

        // Clear conditions' tooltips
        generateSearchConditionsTooltips([], searchTooltipEl);

      } else {

        // Process conditions
        let conditions = _.map(value.split(';'), (c) => { 
          let condition = c.trim().toLowerCase();

          // Check if explicit IS
          if (condition.indexOf('is:') === 0) {
            return { type: 'is', value: clearQuotations(condition.split('is:')[1].trim()) };
          }
          // Check if explicit search by title
          else if (condition.indexOf('title:') === 0) {
            return { type: 'title', value: clearQuotations(condition.split('title:')[1].trim()) };
          }
          // Check explicit search by number
          else if (condition && condition.length && condition[0] === '#' && condition.substr(1).trim() == parseInt(condition.substr(1))) {
            return { type: 'number', value: condition };
          }
          else if (condition.indexOf('num:') === 0) {
            return { type: 'number', value: '#' + clearQuotations(condition.split('num:')[1].trim()) };
          }
          else if (condition.indexOf('number:') === 0) {
            return { type: 'number', value: '#' + clearQuotations(condition.split('number:')[1].trim()) };
          }
          // Check if explicit search by created
          else if (condition.indexOf('opened:') === 0) {
            return { type: 'created', value: clearQuotations(condition.split('opened:')[1].trim()) };
          }
          else if (condition.indexOf('created:') === 0) {
            return { type: 'created', value: clearQuotations(condition.split('created:')[1].trim()) };
          }
          else if (condition.indexOf('by:') === 0) {
            return { type: 'created', value: clearQuotations(condition.split('by:')[1].trim()) };
          }
          // Check if explicit search by created
          else if (condition.indexOf('assignee:') === 0) {
            return { type: 'assigned', value: clearQuotations(condition.split('assignee:')[1].trim()) };
          }
          else if (condition.indexOf('assigned:') === 0) {
            return { type: 'assigned', value: clearQuotations(condition.split('assigned:')[1].trim()) };
          }
          else if (condition.indexOf('to:') === 0) {
            return { type: 'assigned', value: clearQuotations(condition.split('to:')[1].trim()) };
          }
          else if (condition.indexOf('for:') === 0) {
            return { type: 'assigned', value: clearQuotations(condition.split('for:')[1].trim()) };
          }
          // Check if explicit search by label
          else if (condition.indexOf('label:') === 0) {
            return { type: 'label', value: clearQuotations(condition.split('label:')[1].trim()) };
          }
          // Match any
          else {
            return { type: 'any', value: clearQuotations(condition) };
          }

        }); 
              
        // Filter cards by content
        let cards = $('.issue-card.project-card');
        _.forEach(cards, (c) => {

          // Get card info
          let card = $(c),
              type = 'issue', status = 'open',
              title = card.find('h5').text() || card.find('div > p').text(),
              number = card.find('small').text().split('opened by')[0] || '',
              creator = card.find('small').text().split('by')[1] || '',
              assignees = _.map(card.find('div > img'), (el) => {
                let username = $(el).attr('alt').replace(/@/g, '');
                if (!assigneesEls[username]) { assigneesEls[username] = $(el).clone()[0]; }
                return username;
              }),
              labels = _.map(card.find('.issue-card-label'), (el) => { 
                let label = $(el).text(); 
                if (!labelsEls[label]) { labelsEls[label] = $(el).clone()[0]; }
                return label;
              });

          let typeEl = card.find('.card-octicon');
          if ($(typeEl).hasClass('card-note-octicon')) { type = 'note'; status = 'open'; }
          if ($(typeEl).find('.octicon-issue-opened.open').length) { type = 'issue'; status = 'open' }
          if ($(typeEl).find('.octicon-issue-closed.closed').length) { type = 'issue'; status = 'closed'; }
          if ($(typeEl).find('.octicon-git-pull-request.open').length) { type = 'pr'; status = 'open'; }
          if ($(typeEl).find('.octicon-git-pull-request.closed').length) { type = 'pr'; status = 'closed'; }
          if ($(typeEl).find('.octicon-git-pull-request.merged').length) { type = 'pr'; status = 'merged'; }

          // Check conditions and determine if visible
          let visible = true;
          _.forEach(conditions, (condition) => {
            if (condition.value) {
              // Check if explicit IS
              if (condition.type === 'is') {
                // Check if filtering issues
                if (['note'].indexOf(condition.value) > -1) { visible = visible && (type === 'note'); }
                if (['issue'].indexOf(condition.value) > -1) { visible = visible && (type === 'issue'); }
                if (['pr', 'pull', 'request', 'pull request'].indexOf(condition.value) > -1) { visible = visible && (type === 'pr'); }
                if (['open'].indexOf(condition.value) > -1) { visible = visible && (status === 'open'); }
                if (['closed'].indexOf(condition.value) > -1) { visible = visible && (status === 'closed'); }
                if (['merged'].indexOf(condition.value) > -1) { visible = visible && (status === 'merged'); }
              }
              // Check if explicit search by title
              else if (condition.type === 'title') {
                visible = visible && (title.trim().toLowerCase().indexOf(condition.value) > -1)
              }
              // Check explicit search by number
              else if (condition.type === 'number') {
                visible = visible && (number.trim().toLowerCase() == condition.value)
              }
              // Check if explicit search by created
              else if (condition.type === 'created') {
                visible = visible && (creator.trim().toLowerCase() == condition.value)
              }
              // Check if explicit search by created
              else if (condition.type === 'assigned') {
                visible = visible && _.find(assignees, (assignee) => {
                  return (assignee.trim().toLowerCase() == condition.value);
                });
              }
              // Check if explicit search by label
              else if (condition.type === 'label') {
                visible = visible && _.find(labels, (label) => {
                  return (label.trim().toLowerCase() == condition.value);
                });
              }
              // Match any
              else if (condition.type === 'any') {
                visible = visible && (
                              (title.trim().toLowerCase().indexOf(condition.value) > -1)
                            || (number.trim().toLowerCase().indexOf(condition.value) > -1)
                            || (creator.trim().toLowerCase().indexOf(condition.value) > -1)
                            || _.find(assignees, (assignee) => {
                                return (assignee.trim().toLowerCase().indexOf(condition.value) > -1);
                              })
                            || _.find(labels, (label) => {
                                return (label.trim().toLowerCase().indexOf(condition.value) > -1);
                              })
                          );
              }
            }
          });
          
          // Set visibility
          card.css('display', (visible ? 'block' : 'none'));

        });

        // Update conditions' tooltips
        generateSearchConditionsTooltips(conditions, searchTooltipEl, assigneesEls, labelsEls);

      }

    }

    /**
     * Adds a search conditions tooltip entry 
     */
    function generateSearchConditionsTooltips (conditions, searchTooltipEl, assigneesEls, labelsEls) {
      
      // Detect full-screen
      let fullscreen = (window.location.search.indexOf('fullscreen=true') > -1);

      // Clear previous conditions
      $(searchTooltipEl).empty();
      
      // Add condition tooltips
      _.forEach(conditions, (condition) => {
        if (condition && condition.value && condition.value.trim().length) {

          // Create tooltip container
          let tooltipEl = document.createElement('span');
          tooltipEl.style.padding = '1px 2px';
          tooltipEl.style.border = '1px solid #eee';
          tooltipEl.style.borderRadius = '2px';
          tooltipEl.style.backgroundColor = (fullscreen ? '#fff' : '#fafafa');

          // Check condition type and add element
          if (condition.type === 'is') {
            tooltipEl.innerHTML = 'is: <b>{value}</b>'.replace(/\{value\}/g, condition.value);
          } else if (condition.type === 'title') {
            tooltipEl.innerHTML = 'title: <b>{value}</b>'.replace(/\{value\}/g, condition.value);
          } else if (condition.type === 'number') {
            tooltipEl.innerHTML = '<b>{value}</b>'.replace(/\{value\}/g, condition.value);
          } else if (condition.type === 'created') {
            if (!assigneesEls[condition.value]) { 
              tooltipEl.innerHTML = 'created by: <b><a href="/{value}">{value}</a></b>'.replace(/\{value\}/g, condition.value);
            } else  {
              tooltipEl.innerHTML = 'created by: <b><a href="/{value}">{value}</a></b>'.replace(/\{value\}/g, condition.value);
              assigneesEls[condition.value].style.position = 'relative';
              assigneesEls[condition.value].style.top = '-2px';
              assigneesEls[condition.value].style.width = '16px';
              assigneesEls[condition.value].style.height = '16px';
              assigneesEls[condition.value].style.marginLeft = '4px';
              $(tooltipEl).append(assigneesEls[condition.value]);
            }
          } else if (condition.type === 'assigned') {
            if (!assigneesEls[condition.value]) { 
              tooltipEl.innerHTML = 'assigned to: <b><a href="/{value}">{value}</a></b>'.replace(/\{value\}/g, condition.value);
            } else  {
              tooltipEl.innerHTML = 'assigned to: <b><a href="/{value}">{value}</a></b>'.replace(/\{value\}/g, condition.value);
              assigneesEls[condition.value].style.position = 'relative';
              assigneesEls[condition.value].style.top = '-2px';
              assigneesEls[condition.value].style.width = '16px';
              assigneesEls[condition.value].style.height = '16px';
              assigneesEls[condition.value].style.marginLeft = '4px';
              $(tooltipEl).append(assigneesEls[condition.value]);
            }
          } else if (condition.type === 'label') {
            if (!labelsEls[condition.value]) { 
              tooltipEl.innerHTML = 'label: <b>{value}</b>'.replace(/\{value\}/g, condition.value);
            } else {
              labelsEls[condition.value].style.position = 'relative';
              labelsEls[condition.value].style.top = '-4px';
              tooltipEl = labelsEls[condition.value];
            }        
          } else if (condition.type === 'any') {
            tooltipEl.innerHTML = '<b>{value}</b>'.replace(/\{value\}/g, condition.value);
          }

          // Add tooltip element
          tooltipEl.style.marginRight = '2px';
          $(searchTooltipEl).append(tooltipEl);

        }
      });

    }

  }

})()