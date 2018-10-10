// ============================================================================================
// GitHub personal issues' notes' resources
// ============================================================================================
import { namespace as ns } from './namespace';

// Local storage key to store notes under
export const localStorageKey    = `${ ns }`;
// Injeceted style host element ID
export const styleHostElementId = `${ ns }_styling-host`;
// Editing issue element ID
export const editingIssueId     = `${ ns }_editing-issue`;
// Editing issue's editor container element ID
export const editorElementId    = `${ ns }_editing-issue_editor`;
// Editing issue's editor textarea element ID
export const editorTextareaId   = `${ ns }_editing-issue_editor-textarea`;

// Define detectable features for projects page
export const projectsPageIssueClass = 'issue-card';
export const projectsPageIssueNumberAttribute = 'data-card-title';
export const projectsPageIssueNumberAttributeValuePrefix = '#';
export const projectsPageNotesButtonHostClasses = ['sr-only'];
// Define detectable features for issues/milestones page
export const issuesPageIssueClass = 'js-issue-row';
export const issuesPageIssueNumberAttribute = 'id';
export const issuesPageIssueNumberAttributeValuePrefix = 'issue_';
export const issuesPageNotesButtonHostClasses = ['mt-1', 'text-small'];
// Define detectable features for single issue page
export const singleIssuePageIssueClass = 'issue';
export const singleIssuePageIssueNumberAttribute = 'data-url';
export const singleIssuePageIssueNumberAttributeValuePrefix = '/issues/';
export const singleIssuePageNotesButtonHostClasses = ['gh-header-meta'];
