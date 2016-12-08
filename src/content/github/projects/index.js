// ============================================================================================
// GitHub projects page
// ============================================================================================
(() => {

  // Initialization functions declaration
  let initAugmentFiltering = null;

  // On load, bootstrap projects page modifications
  $( document ).ready(() => { 
    // Augment filtering
    initAugmentFiltering();
  })

  // Augment filtering
  // ============================================================================================
  {

    // Holds references to ui-sugar elements
    let assigneesEls = { },
        labelsEls = { };

    // Holds current suggestions
    let suggestions = [], 
        suggestionValues = [],
        selectedSuggestion = null;


    // Removes quotation marks from start and end of string 
    const clearQuotations = function (value) {
      // Clear leading and endoing quotations
      if (value && value.length && (value[0] === '"' || value[0] === '\'' || value[0] === '`')) { value = value.substr(1); } 
      if (value && value.length && (value[value.length - 1] === '"' || value[value.length - 1] === '\'' || value[value.length - 1] === '`')) { value = value.substr(0, value.length - 1); } 
      return value;
    }

    /**
     * Injects a filter input into the page and manages it's functionality'
     */
    initAugmentFiltering = function () {

      // Detect full-screen
      let fullscreen = (window.location.search.indexOf('fullscreen=true') > -1);

      // Initialize search bar
      let searchBarContainerEl = document.createElement('div');
      searchBarContainerEl.style.position = 'relative';
      searchBarContainerEl.style.top = '2px';
      searchBarContainerEl.style.display = 'inline-block';
      searchBarContainerEl.style.marginRight = '2px';

      let searchBarEl = document.createElement('input');
      searchBarEl.type = 'text';
      searchBarEl.placeholder = 'Filter';
      searchBarEl.style.width = '200px';
      searchBarEl.style.padding = '0px 4px';
      searchBarEl.style.fontSize = '12px';
      searchBarEl.style.lineHeight = '12px';
      $(searchBarContainerEl).append(searchBarEl);

      let searchSuggestionsEl = document.createElement('ul');
      searchSuggestionsEl.style.display = 'none';
      searchSuggestionsEl.style.zIndex = '31';
      searchSuggestionsEl.style.position = 'absolute';
      searchSuggestionsEl.style.width = '200px';
      searchSuggestionsEl.style.minHeight = '20px';
      searchSuggestionsEl.style.maxHeight = '200px';
      searchSuggestionsEl.style.overflow = 'auto';
      searchSuggestionsEl.style.border = '1px solid #eee';
      searchSuggestionsEl.style.backgroundColor = '#fff';
      searchSuggestionsEl.style.boxShadow = '1px 1px 1px 1px rgba(0,0,0,0.1)';
      $(searchBarContainerEl).append(searchSuggestionsEl);

      let searchBarHelpPanelEl = document.createElement('div');
      searchBarHelpPanelEl.style.display = 'none';
      searchBarHelpPanelEl.style.zIndex = '32';
      searchBarHelpPanelEl.style.position = 'absolute';
      searchBarHelpPanelEl.style.top = (fullscreen ? '40px' : '36px');
      searchBarHelpPanelEl.style.padding = '12px';
      searchBarHelpPanelEl.style.border = '1px solid #eee';
      searchBarHelpPanelEl.style.backgroundColor = '#fafafa';
      searchBarHelpPanelEl.style.boxShadow = '2px 2px 2px 2px rgba(0,0,0,0.2)';
      searchBarHelpPanelEl.innerHTML = '<b>Enter any text and only issues and notes <br />\n' 
                                    + 'matching Title, Number, Creator, Assignee or Label will be shown.</b> <br/>\n' 
                                    + '<br /> \n'
                                    + '<b>Explicit syntax:</b> <br/>\n'
                                    + '<table style="border: 0px; margin: 10px;">'
                                    + '  <tr><td>Issue</td>        <td style="padding-left: 10px;"><b>#</b><i>1234</td></i></tr>               \n'
                                    + '  <tr><td>Title</td>        <td style="padding-left: 10px;"><b>title:</b><i>My title</i></td></tr>      \n'
                                    + '  <tr><td>Created by</td>   <td style="padding-left: 10px;"><b>opened:</b><i>username</i></td></tr>     \n'
                                    + '  <tr><td>Assigned to</td>  <td style="padding-left: 10px;"><b>assignee:</b><i>username</i></td></tr>   \n'
                                    + '  <tr><td>Label</td>        <td style="padding-left: 10px;"><b>label:</b><i>my-label</i></td></tr>      \n'
                                    + '</table>'
                                    + '  ... or combine multiple conditions by separating them with "<b>;</b>"';

      let searchBarHelpEl = document.createElement('span');
      searchBarHelpEl.style.display = 'inline-block';
      searchBarHelpEl.style.marginRight = '36px';
      searchBarHelpEl.style.cursor = 'help';
      searchBarHelpEl.innerText = '?';
      let helpMouseoverTimeout = null;
      $(searchBarHelpEl).mouseover(() => {
        // Show help after a timeout
        helpMouseoverTimeout = setTimeout(() => {
          searchBarHelpPanelEl.style.display = 'block';
        }, 200); 
      });
      $(searchBarHelpEl).mouseout(() => { 
        // Clear timeout
        if (helpMouseoverTimeout) { clearTimeout(helpMouseoverTimeout); }
        // Hide help
        searchBarHelpPanelEl.style.display = 'none'; 
      });

      // Initialize search tooltip
      let searchTooltipEl = document.createElement('span');
      searchTooltipEl.style.position = 'relative';
      searchTooltipEl.style.top = '2px';
      searchTooltipEl.style.display = 'inline-block';
      searchTooltipEl.style.padding = '0px 4px';
      searchTooltipEl.style.fontSize = '12px';
      searchTooltipEl.style.lineHeight = '12px';

      // Assign search handler
      let delayedSearchTimeout = null,
          delayedSearchFn = (e) => {
            if (delayedSearchTimeout) { clearTimeout(delayedSearchTimeout); }
            delayedSearchTimeout = setTimeout(() => { 
              // Check for suggestions
              checkSuggestions(searchSuggestionsEl, e.target);
              // Filter results
              searchBarHandlerFn(searchTooltipEl, e.target.value); 
            }, 200);
          };
      $(searchBarEl).click(delayedSearchFn);
      $(searchBarEl).focus(delayedSearchFn);
      $(searchBarEl).blur(delayedSearchFn);
      $(searchBarEl).change(delayedSearchFn);
      $(searchBarEl).keyup(delayedSearchFn);
      
      // Check if suggestions present and keypress should manipulate dropdown
      $(searchBarEl).keydown((e) => {
        if (checkKeypressForSuggestions(e)) {
          checkSuggestions(searchSuggestionsEl, e.target);
        }
      });

      // Insert search bar
      let searchContainerEl = (fullscreen ? $('.full-screen-project-header > div') : $('.project-header > .float-right'));
      searchContainerEl.prepend(searchBarHelpEl);
      searchContainerEl.prepend(searchBarContainerEl);
      searchContainerEl.prepend(searchBarHelpPanelEl);
      searchContainerEl.prepend(searchTooltipEl);
      $(searchBarEl).focus();

    }

    /**
     * Checks if suggestions need to be shown
     */
    const checkSuggestions = function (searchSuggestionsEl, searchEl) {

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
          el.style.position = 'relative';
          el.style.listStyle = 'none';
          el.style.padding = '1px 4px';
          el.style.cursor = 'pointer';
          if (suggestionValues[i] === selectedSuggestion) {
            selectedSuggestionEl = el;
            el.style.backgroundColor = "#5080d8";
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
    const checkKeypressForSuggestions = function (e) {
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
    const searchBarHandlerFn = function (searchTooltipEl, value) { 
      
      // Filter issues and notes
      if (!value.trim()) {

        // Don't filter anything
        $('.issue-card.project-card').css('display', 'block');

        // Clear conditions' tooltips
        searchConditionsTooltipFn([], searchTooltipEl);

      } else {

        // Process conditions
        let conditions = _.map(value.split(';'), (c) => { 
          let condition = c.trim().toLowerCase();

          // Check if explicit search by title
          if (condition.indexOf('title:') === 0) {
            return { type: 'title', value: clearQuotations(condition.split('title:')[1].trim()) };
          }
          // Check explicit search by issue number
          else if (condition && condition.length && condition[0] === '#' && condition.substr(1).trim() == parseInt(condition.substr(1))) {
            return { type: 'issue', value: condition };
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
              title = card.find('h5').text() || card.find('div > p').text(),
              issue = card.find('small').text().split('opened by')[0] || '',
              creator = card.find('small').text().split('opened by')[1] || '',
              assignees = _.map(card.find('div > img'), (el) => {
                let username = $(el).attr('alt').replace(/@/g, '');
                if (!assigneesEls[username]) { assigneesEls[username] = $(el).clone()[0]; }
                return username;
              }),
              labels = _.map(card.find('.labels > a'), (el) => { 
                let label = $(el).text(); 
                if (!labelsEls[label]) { labelsEls[label] = $(el).clone()[0]; }
                return label;
              });

          // Check conditions and determine if visible
          let visible = true;
          _.forEach(conditions, (condition) => {
            if (condition.value) {
              // Check if explicit search by title
              if (condition.type === 'title') {
                visible = visible && (title.trim().toLowerCase().indexOf(condition.value) > -1)
              }
              // Check explicit search by issue number
              else if (condition.type === 'issue') {
                visible = visible && (issue.trim().toLowerCase() == condition.value)
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
                            || (issue.trim().toLowerCase().indexOf(condition.value) > -1)
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
        searchConditionsTooltipFn(conditions, searchTooltipEl, assigneesEls, labelsEls);

      }

    }

    /**
     * Adds a search conditions tooltip entry 
     */
    const searchConditionsTooltipFn = function (conditions, searchTooltipEl, assigneesEls, labelsEls) {
      
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
          if (condition.type === 'title') {
            tooltipEl.innerHTML = 'title: <b>{value}</b>'.replace(/\{value\}/g, condition.value);
          } else if (condition.type === 'issue') {
            tooltipEl.innerHTML = 'issue: <b>{value}</b>'.replace(/\{value\}/g, condition.value);
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