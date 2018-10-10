// ============================================================================================
// GitHub personal issues' notes styling
// ============================================================================================
import { SVG } from '../../common';
import { namespace as pluginNamespace } from '../../namespace';
import {
  editingIssueId,
  editorElementId,
  projectsPageIssueClass,
  projectsPageIssueNumberAttribute,
  projectsPageIssueNumberAttributeValuePrefix,
  projectsPageNotesButtonHostClasses,
  issuesPageIssueClass,
  issuesPageIssueNumberAttribute,
  issuesPageIssueNumberAttributeValuePrefix,
  issuesPageNotesButtonHostClasses,
  singleIssuePageIssueClass,
  singleIssuePageIssueNumberAttribute,
  singleIssuePageIssueNumberAttributeValuePrefix,
  singleIssuePageNotesButtonHostClasses
} from './res';

// Define selectors
const projectsPageIssueSelector = `.js-project-container .${ projectsPageIssueClass }[data-card-type='["issue"]']`,
      projectsPageNotesHostSelector = `.${ projectsPageNotesButtonHostClasses.join('.') }`,
      issuesPageIssueSelector = `.issues-listing .${ issuesPageIssueClass }`,
      issuesPageNotesHostSelector = `.${ issuesPageNotesButtonHostClasses.join('.') }`,
      singleIssuePageIssueSelector = `.issues-listing .${ singleIssuePageIssueClass }`,
      singleIssuePageNotesHostSelector = `.${ singleIssuePageNotesButtonHostClasses.join('.') }`;

/**
 * Generates additional styling for an issue card
 * @export
 * @param {*} issueNotes Hashtable of issue notes keyed by issue numbers
 * @returns
 */
export function generateIssueCardsStyling (issueNotes) {

  /**
   * Generate selectors within only issue cards with specified issue numbers
   * @param {*} page Current page being processed; ['PROJECTS', 'ISSUES', 'MILESTONES', 'SINGLE-ISSUE']
   * @param {*} innerSelector Additional selector inside the issue
   * @returns {any} Selectors within only issue cards with specified issue numbers
   */
  const generateIssueCardsWithNotesSelector = (page, innerSelector) => {
    return Object.keys(issueNotes)
      .map((issueNumber) => {
        if (page === 'PROJECTS') {
          // Projects page styling
          return `[${ pluginNamespace }] ${ projectsPageIssueSelector }[${ projectsPageIssueNumberAttribute } *= '${ projectsPageIssueNumberAttributeValuePrefix }${ issueNumber }'] ${ innerSelector }`;
        } else if (page === 'ISSUES' || page === 'MILESTONES'){
          // Issues/Milestones page styling
          return `[${ pluginNamespace }] ${ issuesPageIssueSelector }[${ issuesPageIssueNumberAttribute } = '${ issuesPageIssueNumberAttributeValuePrefix }${ issueNumber }'] ${ innerSelector }`;
        } else if (page === 'SINGLE-ISSUE') {
          // Single issue page styling
          return `[${ pluginNamespace }] ${ singleIssuePageIssueSelector }[${ singleIssuePageIssueNumberAttribute } *= '${ singleIssuePageIssueNumberAttributeValuePrefix }${ issueNumber }'] ${ innerSelector }`;
        }
      })
      .join(',\n') || '[does-not-exist="does-not-exist"]';
  };

  /**
   * Generate per issue styling within only issue cards with specified issue numbers
   * @param {*} page Current page being processed; ['PROJECTS', 'ISSUES', 'MILESTONES']
   * @param {*} innerSelector Additional selector inside the issue
   * @param {*} stylingFn Callback function expected to provide styling for particular issue
   * @returns {any} Per issue styling within only issue cards with specified issue numbers
   */
  const generateIssueCardsWithNotesStyling = (page, innerSelector, stylingFn) => {
    return Object.keys(issueNotes)
      .map((issueNumber) => {
        if (page === 'PROJECTS') {
          // Projects page styling
          return `[${ pluginNamespace }] ${ projectsPageIssueSelector }[${ projectsPageIssueNumberAttribute } *= '${ projectsPageIssueNumberAttributeValuePrefix }${ issueNumber }'] ${ innerSelector } {
            ${ stylingFn(issueNumber) }
          }`;
        } else if (page === 'ISSUES' || page === 'MILESTONES'){
          // Issues/Milestones page styling
          return `[${ pluginNamespace }] ${ issuesPageIssueSelector }[${ issuesPageIssueNumberAttribute } = '${ issuesPageIssueNumberAttributeValuePrefix }${ issueNumber }'] ${ innerSelector } {
            ${ stylingFn(issueNumber) }
          }`;
        } else if (page === 'SINGLE-ISSUE') {
          // Single issue page styling
          return `[${ pluginNamespace }] ${ singleIssuePageIssueSelector }[${ singleIssuePageIssueNumberAttribute } *= '${ singleIssuePageIssueNumberAttributeValuePrefix }${ issueNumber }'] ${ innerSelector } {
            ${ stylingFn(issueNumber) }
          }`;
        }
      })
      .join('\n') || '[does-not-exist="does-not-exist"]';
  };

  // Generate issue cards' with notes styling for adding a note
  return [

    // PROJECTS Page: Make columns have bottom padding to allow for extra textarea
    `[${ pluginNamespace }] .js-project-container .project-column .js-project-column-cards {
      padding-bottom: 100px !important;
    }`,

    // Container (re) styling
    `[${ pluginNamespace }] ${ projectsPageIssueSelector } ${ projectsPageNotesHostSelector },
     [${ pluginNamespace }] ${ issuesPageIssueSelector } ${ issuesPageNotesHostSelector },
     [${ pluginNamespace }] ${ singleIssuePageIssueSelector } ${ singleIssuePageNotesHostSelector } {
      position: relative;
    }`,
    // PROJECTS Page: Suppress notes button container's original content
    `[${ pluginNamespace }] ${ projectsPageIssueSelector } ${ projectsPageNotesHostSelector } {
      position: absolute;
      font-size: 0 !important;
    }`,
    
    // Button container styling (when note "active")
    `/* Projects page: style button container if has notes, issue hover, or editing */
    ${ generateIssueCardsWithNotesSelector('PROJECTS', `${ projectsPageNotesHostSelector }`) },
    [${ pluginNamespace }] ${ projectsPageIssueSelector }:hover ${ projectsPageNotesHostSelector },
    [${ pluginNamespace }] ${ projectsPageIssueSelector } ${ projectsPageNotesHostSelector }#${ editingIssueId },     
    /* Issues/Milestones page: style button container if has notes, issue hover, or editing */
    ${ generateIssueCardsWithNotesSelector('ISSUES', `${ issuesPageNotesHostSelector }`) },
    [${ pluginNamespace }] ${ issuesPageIssueSelector }:hover ${ issuesPageNotesHostSelector },
    [${ pluginNamespace }] ${ issuesPageIssueSelector } ${ issuesPageNotesHostSelector }#${ editingIssueId },
    /* Single issue page: style button container always */
    ${ generateIssueCardsWithNotesSelector('SINGLE-ISSUE', `${ singleIssuePageNotesHostSelector }`) },
    [${ pluginNamespace }] ${ singleIssuePageIssueSelector }:hover ${ singleIssuePageNotesHostSelector },
    [${ pluginNamespace }] ${ singleIssuePageIssueSelector } ${ singleIssuePageNotesHostSelector } {
      overflow: visible;
      clip: unset;
    }`,

    // General button styling
    `${ generateIssueCardsWithNotesSelector('PROJECTS', `${ projectsPageNotesHostSelector }:after`) },
    [${ pluginNamespace }] ${ projectsPageIssueSelector } ${ projectsPageNotesHostSelector }:after,
     ${ generateIssueCardsWithNotesSelector('ISSUES', `${ issuesPageNotesHostSelector }:after`) },
    [${ pluginNamespace }] ${ issuesPageIssueSelector } ${ issuesPageNotesHostSelector }:after,
     ${ generateIssueCardsWithNotesSelector('SINGLE-ISSUE', `${ singleIssuePageNotesHostSelector }:after`) },
    [${ pluginNamespace }] ${ singleIssuePageIssueSelector } ${ singleIssuePageNotesHostSelector }:after {
      z-index: 91;
      position: absolute;
      display: block;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: white url(${SVG.cssUrl(SVG.Note({ color: '#ccc' }))}) center center no-repeat;
      background-color: white;
      border: 2px solid white;
      box-shadow: 0 1px 3px rgba(106,115,125,0.3);
      text-align: center;
      cursor: pointer;
    }`,
    `${ generateIssueCardsWithNotesSelector('PROJECTS', `${ projectsPageNotesHostSelector }:after`) },
    [${ pluginNamespace }] ${ projectsPageIssueSelector } ${ projectsPageNotesHostSelector }:after {
      left: 10px;
      bottom: -10px;
    }`,
    `${ generateIssueCardsWithNotesSelector('ISSUES', `${ issuesPageNotesHostSelector }:after`) },
    [${ pluginNamespace }] ${ issuesPageIssueSelector } ${ issuesPageNotesHostSelector }:after {
      left: -57px;
      bottom: -12px;
    }`,
    `${ generateIssueCardsWithNotesSelector('SINGLE-ISSUE', `${ singleIssuePageNotesHostSelector }:after`) },
    [${ pluginNamespace }] ${ singleIssuePageIssueSelector } ${ singleIssuePageNotesHostSelector }:after {
      content: '';
      left: 0px;
      bottom: -12px;
    }`,

    // General button styling: on issue hover
    `${ generateIssueCardsWithNotesSelector('PROJECTS', `${ projectsPageNotesHostSelector }:hover:after`) },
    [${ pluginNamespace }] ${ projectsPageIssueSelector }:hover ${ projectsPageNotesHostSelector }:after,
     ${ generateIssueCardsWithNotesSelector('ISSUES', `${ issuesPageNotesHostSelector }:hover:after`) },
    [${ pluginNamespace }] ${ issuesPageIssueSelector }:hover ${ issuesPageNotesHostSelector }:after,
     ${ generateIssueCardsWithNotesSelector('SINGLE-ISSUE', `${ singleIssuePageNotesHostSelector }:hover:after`) },
    [${ pluginNamespace }] ${ singleIssuePageIssueSelector }:hover ${ singleIssuePageNotesHostSelector }:after {
      content: '';
      background: white url(${SVG.cssUrl(SVG.Note({ color: '#aaa' }))}) center center no-repeat;
    }`,
    // General button styling: on button hover
    `[${ pluginNamespace }] ${ projectsPageIssueSelector }:hover ${ projectsPageNotesHostSelector }:hover:after,
     [${ pluginNamespace }] ${ issuesPageIssueSelector }:hover ${ issuesPageNotesHostSelector }:hover:after,
     [${ pluginNamespace }] ${ singleIssuePageIssueSelector }:hover ${ singleIssuePageNotesHostSelector }:hover:after {
      content: '';
      background: white url(${SVG.cssUrl(SVG.Note({ color: '#999' }))}) center center no-repeat;
    }`,

    // General button styling: on note exists
    `${ generateIssueCardsWithNotesSelector('PROJECTS', `${ projectsPageNotesHostSelector }:after`) },
     ${ generateIssueCardsWithNotesSelector('ISSUES', `${ issuesPageNotesHostSelector }:after`) },
     ${ generateIssueCardsWithNotesSelector('SINGLE-ISSUE', `${ singleIssuePageNotesHostSelector }:after`) } {
      content: '';
      background: white url(${SVG.cssUrl(SVG.Note({ color: '#0366d6' }))}) center center no-repeat;
    }`,
    // General button styling: on note exists and button hover
    `${ generateIssueCardsWithNotesSelector('PROJECTS', `${ projectsPageNotesHostSelector }:hover:after`) },
     ${ generateIssueCardsWithNotesSelector('ISSUES', `${ issuesPageNotesHostSelector }:hover:after`) },
     ${ generateIssueCardsWithNotesSelector('SINGLE-ISSUE', `${ singleIssuePageNotesHostSelector }:hover:after`) } {
      content: '';
      z-index: 92;
      background: white url(${SVG.cssUrl(SVG.Note({ color: '#0366d6' }))}) center center no-repeat;
    }`,

    // Toggled issue styling
    `[${ pluginNamespace }] ${ projectsPageIssueSelector } ${ projectsPageNotesHostSelector }#${ editingIssueId }:after
     [${ pluginNamespace }] ${ issuesPageIssueSelector } ${ issuesPageNotesHostSelector }#${ editingIssueId }:after,
     [${ pluginNamespace }] ${ singleIssuePageIssueSelector } ${ singleIssuePageNotesHostSelector }#${ editingIssueId }:after {
      background: white url(${SVG.cssUrl(SVG.Note({ color: '#2188ff' }))}) center center no-repeat;
      border: 2px solid #2188ff;
    }`,

    // Issue notes as tooltip
    `${ generateIssueCardsWithNotesSelector('PROJECTS', `${ projectsPageNotesHostSelector }:not(#${ editingIssueId }):hover:before`) },
    [${ pluginNamespace }] ${ projectsPageIssueSelector } ${ projectsPageNotesHostSelector }#${ editingIssueId } #${ editorElementId } textarea,
     ${ generateIssueCardsWithNotesSelector('ISSUES', `${ issuesPageNotesHostSelector }:not(#${ editingIssueId }):hover:before`) },
    [${ pluginNamespace }] ${ issuesPageIssueSelector } ${ issuesPageNotesHostSelector }#${ editingIssueId } #${ editorElementId } textarea,
     ${ generateIssueCardsWithNotesSelector('SINGLE-ISSUE', `${ singleIssuePageNotesHostSelector }:not(#${ editingIssueId }):hover:before`) },
    [${ pluginNamespace }] ${ singleIssuePageIssueSelector } ${ singleIssuePageNotesHostSelector }#${ editingIssueId } #${ editorElementId } textarea {
      position: absolute;
      z-index: 92;
      display: block;
      height: auto;
      box-sizing: border-box;
      padding: 10px 12px 10px 32px;
      background: white;
      box-shadow: 0 1px 3px rgba(106,115,125, 0.3);
      border: 1px #e1e4e8 solid;
      border-width: 2px 1px 1px 1px;
      border-radius: 6px;
      font-size: 10px;
      color: #aaa;
      white-space: pre-line;
      cursor: pointer;
    }`,
    `${ generateIssueCardsWithNotesSelector('PROJECTS', `${ projectsPageNotesHostSelector }:not(#${ editingIssueId }):hover:before`) },
    [${ pluginNamespace }] ${ projectsPageIssueSelector } ${ projectsPageNotesHostSelector }#${ editingIssueId } #${ editorElementId } textarea {
      left: 4px;
      top: -20px;
      width: 310px;
      min-width: 310px;
      max-width: 310px;
    }`,
    `${ generateIssueCardsWithNotesSelector('ISSUES', `${ issuesPageNotesHostSelector }:not(#${ editingIssueId }):hover:before`) },
    [${ pluginNamespace }] ${ issuesPageIssueSelector } ${ issuesPageNotesHostSelector }#${ editingIssueId } #${ editorElementId } textarea {
      left: -62px;
      top: -4px;
      width: 610px;
      min-width: 610px;
      max-width: 610px;
    }`,
    `${ generateIssueCardsWithNotesSelector('SINGLE-ISSUE', `${ singleIssuePageNotesHostSelector }:not(#${ editingIssueId }):hover:before`) },
    [${ pluginNamespace }] ${ singleIssuePageIssueSelector } ${ singleIssuePageNotesHostSelector }#${ editingIssueId } #${ editorElementId } textarea {
      left: -5px;
      top: 26px;
      width: 610px;
      min-width: 610px;
      max-width: 610px;
    }`,
    
    // Generate issue tooltip content
    generateIssueCardsWithNotesStyling('PROJECTS', `${ projectsPageNotesHostSelector }:not(#${ editingIssueId }):hover:before`, (issueNumber) => {
      return `
        content: '${ issueNotes[issueNumber].replace(/\n/g, '\\A').replace(/'/g, '\\\'') }';
      `;
    }),
    generateIssueCardsWithNotesStyling('ISSUES', `${ issuesPageNotesHostSelector }:not(#${ editingIssueId }):hover:before`, (issueNumber) => {
      return `
        content: '${ issueNotes[issueNumber].replace(/\n/g, '\\A').replace(/'/g, '\\\'') }';
      `;
    }),
    generateIssueCardsWithNotesStyling('SINGLE-ISSUE', `${ singleIssuePageNotesHostSelector }:not(#${ editingIssueId }):hover:before`, (issueNumber) => {
      return `
        content: '${ issueNotes[issueNumber].replace(/\n/g, '\\A').replace(/'/g, '\\\'') }';
      `;
    }),

    // Editor styling (focused)
    `[${ pluginNamespace }] ${ projectsPageIssueSelector } ${ projectsPageNotesHostSelector }#${ editingIssueId },
     [${ pluginNamespace }] ${ issuesPageIssueSelector } ${ issuesPageNotesHostSelector }#${ editingIssueId },
     [${ pluginNamespace }] ${ singleIssuePageIssueSelector } ${ singleIssuePageNotesHostSelector }#${ editingIssueId } {
      z-index: 95;
    }`,
    `[${ pluginNamespace }] ${ projectsPageIssueSelector } ${ projectsPageNotesHostSelector }#${ editingIssueId } #${ editorElementId }:before,
     [${ pluginNamespace }] ${ issuesPageIssueSelector } ${ issuesPageNotesHostSelector }#${ editingIssueId } #${ editorElementId }:before,
     [${ pluginNamespace }] ${ singleIssuePageIssueSelector } ${ singleIssuePageNotesHostSelector }#${ editingIssueId } #${ editorElementId }:before {
      z-index: 96;
      transition: background-color 400ms ease;
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0, 0);
      cursor: default;
    }`,
    `[${ pluginNamespace }] ${ projectsPageIssueSelector } ${ projectsPageNotesHostSelector }#${ editingIssueId } #${ editorElementId }:focus-within:before,
     [${ pluginNamespace }] ${ issuesPageIssueSelector } ${ issuesPageNotesHostSelector }#${ editingIssueId } #${ editorElementId }:focus-within:before,
     [${ pluginNamespace }] ${ singleIssuePageIssueSelector } ${ singleIssuePageNotesHostSelector }#${ editingIssueId } #${ editorElementId }:focus-within:before {
      content: '';
      background-color: rgba(0,0,0, 0.2);
    }`,
    `[${ pluginNamespace }] ${ projectsPageIssueSelector } ${ projectsPageNotesHostSelector }#${ editingIssueId } #${ editorElementId } textarea,
     [${ pluginNamespace }] ${ issuesPageIssueSelector } ${ issuesPageNotesHostSelector }#${ editingIssueId } #${ editorElementId } textarea,
     [${ pluginNamespace }] ${ singleIssuePageIssueSelector } ${ singleIssuePageNotesHostSelector }#${ editingIssueId } #${ editorElementId } textarea {
      z-index: 97;
      min-height: 90px;
      color: #666;
    }`,
    `[${ pluginNamespace }] ${ projectsPageIssueSelector } ${ projectsPageNotesHostSelector }#${ editingIssueId } #${ editorElementId } textarea::placeholder,
     [${ pluginNamespace }] ${ issuesPageIssueSelector } ${ issuesPageNotesHostSelector }#${ editingIssueId } #${ editorElementId } textarea::placeholder,
     [${ pluginNamespace }] ${ singleIssuePageIssueSelector } ${ singleIssuePageNotesHostSelector }#${ editingIssueId } #${ editorElementId } textarea::placeholder {
      opacity: 0.2;
      color: #ee0701;
      font-weight: bold;
    }`

  ].join('\n');
}
