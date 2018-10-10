// ============================================================================================
// GitHub personal issues' notes
// ============================================================================================
import { LocalStorage } from '../../common';
import { generateIssueCardsStyling } from './style.css';
import { namespace as ns } from '../../namespace';
import {
  localStorageKey,
  styleHostElementId,
  editingIssueId,
  editorElementId,
  editorTextareaId,
  projectsPageIssueClass,
  issuesPageIssueClass,
  projectsPageIssueNumberAttribute,
  projectsPageIssueNumberAttributeValuePrefix,
  projectsPageNotesButtonHostClasses,
  issuesPageIssueNumberAttribute,
  issuesPageIssueNumberAttributeValuePrefix,
  issuesPageNotesButtonHostClasses,
  singleIssuePageIssueClass,
  singleIssuePageIssueNumberAttribute,
  singleIssuePageIssueNumberAttributeValuePrefix,
  singleIssuePageNotesButtonHostClasses
} from './res';

/**
 * Initialize and implement personal issues' notes functionality
 * @export
 */
export default function () {

  // Check if /projects, /issues or /milestones page
  if (['projects', 'issues', 'milestone'].indexOf(window.location.pathname.split('/')[3]) > -1) {

    // Initialize notes' local storage
    let notes = new LocalStorage(localStorageKey);

    // Initialize and inject notes' styling
    generateStyling(notes);
    // Track user interactions
    trackUserInteractions(notes);

  }

}

/**
 * Generates needed styling for issue cards containing personal notes
 * @param {LocalStorage} notes Shared LocalStorage instance
 */
function generateStyling (notes) {

  // Generate styling
  const issueNotes = (notes.get() || {}),
        stylingSyntax = generateIssueCardsStyling(issueNotes);

  // Check if styling already injected
  const existingStyleElement = document.getElementById(styleHostElementId);
  if (existingStyleElement) {
    // Update existing element
    existingStyleElement.innerHTML = stylingSyntax;
  } else {
    // Inject styling syntax
    const styleElement = document.createElement('style');
    styleElement.id = styleHostElementId;
    styleElement.innerHTML = stylingSyntax;
    document.head.appendChild(styleElement);
  }

}

/**
 *Tracks user input and provides note's button toggle functionality
 * @param {LocalStorage} notes Shared LocalStorage instance
 */
function trackUserInteractions (notes) {
  
  // Handle user clicks
  document.addEventListener('click', (e) => {
    
    // Get click target parents
    let target = e.target,
        targets = [];
    do {
      targets.push(target);
    } while (target = target.parentElement);

    // Get parent elements
    let extensionScopeEl = null,
        issueEl = null,
        notesButtonEl = null;
    for (let i in targets) {
      const target = targets[i];
      // Detect plugin loaded
      if (target && !!target.getAttribute(ns)) { extensionScopeEl = target; }
      // Detect issue host element
      if (target && target.className && (target.className.split(' ').indexOf(projectsPageIssueClass) > -1)) { issueEl = target; }
      if (target && target.className && (target.className.split(' ').indexOf(issuesPageIssueClass) > -1)) { issueEl = target; }
      if (target && target.className && (target.className.split(' ').indexOf(singleIssuePageIssueClass) > -1)) { issueEl = target; }
      // Detect notes button host element
      if (target && target.className) {
        let targetClasses = target.className.split(' '),
            foundProjectsPage = true,
            foundIssuesPage = true,
            foundSingleIssuePage = true;
        for (let i in projectsPageNotesButtonHostClasses) {
          if (targetClasses.indexOf(projectsPageNotesButtonHostClasses[i]) === -1) { foundProjectsPage = false; break; }
        }
        for (let i in issuesPageNotesButtonHostClasses) {
          if (targetClasses.indexOf(issuesPageNotesButtonHostClasses[i]) === -1) { foundIssuesPage = false; break; }
        }
        for (let i in singleIssuePageNotesButtonHostClasses) {
          if (targetClasses.indexOf(singleIssuePageNotesButtonHostClasses[i]) === -1) { foundSingleIssuePage = false; break; }
        }
        if (foundProjectsPage || foundIssuesPage || foundSingleIssuePage) {
          notesButtonEl = target;
        }
      }
    }

    // Get issue number
    let issueNumber = null;
    if (issueEl) {
      // Extract issue number from projects issue card
      const projectsIssueTitleAttribValue = issueEl.getAttribute(projectsPageIssueNumberAttribute);
      if (projectsIssueTitleAttribValue && (issueEl.className.split(' ').indexOf(projectsPageIssueClass) > -1)) {
        const issueProps = JSON.parse(projectsIssueTitleAttribValue);
        issueNumber = parseInt(issueProps[issueProps.length - 1].replace(projectsPageIssueNumberAttributeValuePrefix, ''));
      }
      // Extract issue number from issues/milestones issue card
      const issuesIssueTitleAttribValue = issueEl.getAttribute(issuesPageIssueNumberAttribute);
      if (issuesIssueTitleAttribValue && (issueEl.className.split(' ').indexOf(issuesPageIssueClass) > -1)) {
        issueNumber = parseInt(issuesIssueTitleAttribValue.replace(issuesPageIssueNumberAttributeValuePrefix, ''));
      }
      // Extract issue number from single-issue page
      const singleIssueIssueTitleAttribValue = issueEl.getAttribute(singleIssuePageIssueNumberAttribute);
      if (singleIssueIssueTitleAttribValue && (issueEl.className.split(' ').indexOf(singleIssuePageIssueClass) > -1)) {
        issueNumber = parseInt(singleIssueIssueTitleAttribValue.split('/')[4]);
      }
    }

    // Toggle previous issue notes editor button 
    const editingIssueButtonEl = document.getElementById(editingIssueId);
    if (editingIssueButtonEl) { editingIssueButtonEl.removeAttribute('id'); }
    // Toggle previous issue notes editor (if not generated for same issue)
    let editingIssueEditorEl = document.getElementById(editorElementId),
        editingIssueTextareaEl = document.getElementById(editorTextareaId);
    if (editingIssueEditorEl && editingIssueEditorEl.parentElement && editingIssueEditorEl.getAttribute('issue-number') != issueNumber) {
      editingIssueEditorEl.parentElement.removeChild(editingIssueEditorEl);
      editingIssueEditorEl = null;
    }

    // Check if click on personal note button
    if (issueNumber && !!extensionScopeEl && !!issueEl && !!notesButtonEl) {
      // Toggle new issue
      notesButtonEl.id = editingIssueId;
      // Generate editor (if not already generated for same issue)
      if (!editingIssueEditorEl) {
        // Append editor
        notesButtonEl.appendChild(generateNoteEditor(notes, issueNumber));
      } else {
        // Focus existing editor
        setTimeout(() => { editingIssueTextareaEl.focus(); });
      }
    }

  });

}

/**
 * Generates notes editor HTML
 * @param {LocalStorage} notes Shared LocalStorage instance
 * @param {number} issueNumber Issue number being edited
 */
function generateNoteEditor (notes, issueNumber) {  

  // Get notes
  const issueNotes = (notes.get() || {});

  // Generate editor DOM
  const containerEl = document.createElement('div');
  containerEl.id = editorElementId;
  containerEl.setAttribute('issue-number', issueNumber);
  const innerContainerEl = document.createElement('div');
  containerEl.appendChild(innerContainerEl);
  const textareaEl = document.createElement('textarea');
  textareaEl.id = editorTextareaId;
  textareaEl.value = issueNotes[issueNumber] || '';
  textareaEl.setAttribute('placeholder', `Note will only be visible to you and not to any other users and will be lost if you clear your browser's LocalStorage!`);
  innerContainerEl.appendChild(textareaEl);

  // Handle events
  textareaEl.addEventListener('change', (e) => {
    // Store note to local storage
    issueNotes[issueNumber] = e.target.value || '';
    for (let i in issueNotes) {
      if (!issueNotes[i]) { delete issueNotes[i]; }
    }
    notes.set(issueNotes);
    // Regenerate styling
    generateStyling(notes);
  });
  
  // Focus editor
  setTimeout(() => { textareaEl.focus(); });

  // Return editor for injection
  return containerEl;

}
