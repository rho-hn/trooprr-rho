import { combineReducers } from 'redux';

import skills from './components/skills/skills_reducer';
import skill_builder from './components/skills/skill_builder/skillBuilderReducer';
import launcherActions from './components/skills/settings/settings_reducer';
import reminders from './components/skills/troopr_reminder/troopr_reminder_reducer';
import common_reducer from './components/common/common_reducer';
import auth from './components/auth/authReducer';
import jiraGuest from './components/skills/jira/jira_guest_config/jiraGuestReducer';
import cards from "./components/skills/skill_builder/steps/CardsReducer"
import github from "./components/skills/github/githubReducer"
import { projects, searchProj } from './components/project/project_reducer';
import projectMembership from './components/project/projectMembers/projectMembership';
import statuses from './components/project/tasks/section/section';
import sprints from './components/project/tasks/section/sprint';
import projectReports from './components/project/report/report';
import tags from './components/project/tasks/tags/Tag';

import projectInvite from './components/project/projectMembers/pending/projectInvite';
import files from './components/project/files/files';
import task from './components/project/tasks/task/task';

import sidebar from './components/project/sidebar/sidebar';
import filterSidebarValue from './components/project/sidebar/filter_sidebar_reducer';
import OAuthReducer from './components/jiraoauth/jiraoauth.reducer';
import confluecne from './components/skills/confluence/aliases/alias_reducer';
export default combineReducers({
	filterSidebarValue,
	sidebar,
	task,
	files,
	projectInvite,
	tags,

	projectReports,
	skills,
	projects,
	searchProj,
	projectMembership,
  statuses,
  sprints,
	launcherActions,
	reminders,
	common_reducer,
	skill_builder,
	auth,
	jiraGuest,
	cards,
	github,
	OAuthReducer,
	confluecne
});


// filterSidebarValue,
//-- result of the filter applied using filter_dropdown.js, used to filter Squad tasks

//     sidebar,
//-- state of various sidebars. we used to have sidebars for project activity, task filters, my space filters, teamsync filters etc
// Now (May 2020) we have only use for Task sidebar - NEEDS CLEANUP
//Also state of task activities, followers, subtasks and comments are menaged here, it should move to task --NEEDS CLEANUP

//     task,
//-- State of ALL active tasks, backlog tasks, current selected task etc

//     files,
//-- We used to have File management where teams can manage their files like  inGoogle drive - not used anymore

//     projectInvite,
//-- for setting list of Squad invitations for the user - not used currently

//     tags,
//-- state for workspace tags aka labels - was used in previous design - must bring back

//     report,
//-- state for project reports - was used in previous design - must bring back

//     skills,
//-- supposed to be only for state of Jira and Github skills - but mixed up with other states
//states for workspace , project and user are managed here incorrectly -- NEEDS CLEANUP

//     projects,
//-- state for project

//     searchProj,
//-- state for project filter - was used in old design - NEEDS CLEANUP

//     projectMembership,
//-- state for project members

//   statuses,
//-- list of all statuses for currently selected Squad

//   sprints,
//-- list of sprints & current sprint for the currently selected Squad

//     launcherActions,
//--this is for custom launcher actions we used to have per user - not used anymore - NEEDS CLEANUP

//     reminders,
//-- we used to have reminders skill for assistant - not used anymore - NEEDS CLEANUP

//     common_reducer,
//-- this is the place for common states that will be needed by all components like current user - NEEDS IMPROVEMENT
// we should use this more for current state of APP (like current WS etc)

//     skill_builder,
//-- we used to have a tool to build custom skills for Troopr Assistant visually - not used anymore - MAY bring back

//     auth,
//-- currently manages current user, user tour state(old), -- SHOULD BE MERGED WIH COMMON_REDUCER

//     jiraGuest,
//--manages state for Jira Gues user functionality - SHOULD BE MERGED WIH skills

//     cards,
//-- manages card skills - used for Jira/Github reports - CAN BE MERGED WIH skills ?

//     github,
// manages github state - SHOULD BE MERGED WIH skills