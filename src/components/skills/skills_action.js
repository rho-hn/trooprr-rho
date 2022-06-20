//Use the URL to bypass CORS issue : - 
import axios from 'axios';
import { setTeamDetails, updateAssistantName } from '../common/common_action';
import report from '../project/report/report';
import {
  GET_JIRA_CHANNELS,
  GET_JIRA_PROJECTS,
  ADD_JIRA_PROJECTS,
  GET_JIRA_BOARDS,

  GET_JIRA_ISSUES,
  SET_DEFAULT_JIRA_PERSONAL_CHANNEL,
  SET_SKILL_DATA,
  SET_DEFAULT_JIRA_CHANNEL,
  PERSONAL_JIRA_SETTING,
  SET_CURRENT_SKILL_USER,
  GET_JIRA_NOTIFICATION_CONFIGURATION,
  SET_JIRA_NOTIFICATION_CONFIGURATION,
  GET_JIRA_USER_NOTIFICATION_CONFIGURATION,
  SET_JIRA_USER_NOTIFICATION_CONFIGURATION,
  SET_WORKSPACE_ASSISTANT_SKILLS,
  UPDATE_ASSISTANT_SKILLS,
  SET_SLACK_LINK,
  SET_SLACK_CHANNELS,
  GET_CHANNEL_DATA,
  GET_SKILL,
  EMAIL_SUBSCRIPTION,
  SET_JIRA_BOARD_SPRINTS,
  SET_CURRENT_SKILL,
  SET_CURRENT_TEAMSYNC,
  DELETE_USER_TEAMSYNC,
  //standups:my standups
  SET_USER_TEAMSYNC,
  SET_USER_TEAMSYNCS,
  //standups:show reports
  SET_TEAM_SYNC_INSTANCE,
  SET_PROJECT_PROGRESS_REPORTS,
  PREV_NXT_INSTANCE_NOT_AVAILABLE,
  PREV_INSTANCE_NOT_AVAILABLE,
  NXT_INSTANCE_NOT_AVAILABLE,
  PREV_NXT_INSTANCE_AVAILABLE,
  GET_INSTANCE_EMPTY,
  SET_TEAM_SYNC_INSTANCE_RESPONSE,
  GET_USERMAPPING_USERS,
  SET_JIRA_USERS,
  SET_LOADING,
  ADD_USER_MAPPING,
  // standups : Resume now
  UPDATE_USER_TEAMSYNCS,
  SET_ALERT,
  REMOVE_ALERT,
  SET_WORKSPACE_MEMBERS,
  ADD_WORKSPACE_MEMBER,
  SET_USER,
  SET_WORKSPACE,
  LEAVE_WORKSPACE,
  DELETE_WORKSPACE_MEMBER,
  UPDATE_WORKSPACE_MEMBERSHIP,
  DELETE_USER_MAPPING,
  EDIT_USER_MAPPING,
  GET_JIRA_STATUSES,
  UPDATE_TEAMSYNC_INSTANCE_REPORT,
  SET_CONFULENCE_SPACES,
  SET_CONFULENCE_CHANNEL_CONFIG,
  SET_CONFULENCE_CHANNEL_CONFIG_LIST,
  ADD_CONFLUENCE_CHANNEL_CONFIG,
  REMOVE_CONFLUENCE_CHANNEL_CONFIG,
  ADD_CHANNEL,
RECENT_REMINDERS
}
  from './types';

export function setAssisantSkills(skills) {
  return {
    type: SET_WORKSPACE_ASSISTANT_SKILLS,
    skills
  };
}
export function updateAssisantSkills(skill) {

  return {
    type: UPDATE_ASSISTANT_SKILLS,
    skill
  };
}

export function getChannel(channels) {
  return {
    type: GET_JIRA_CHANNELS,
    channels
  };
}

export function personalJiraSetting(jirasetting) {
  return {
    type: PERSONAL_JIRA_SETTING,
    jirasetting
  };
}

export function getJiraIssues(jiraissues) {
  return {
    type: GET_JIRA_ISSUES,
    jiraissues
  };
}
export function getJsdRequestTypes(jiraissues) {
  return {
    type: 'GET_JSD_REQUEST_TYPES',
    jiraissues
  };
}

export function getJiraProjects(jiraprojects) {
  return {
    type: GET_JIRA_PROJECTS,
    jiraprojects
  };
}
export function addJiraProjectsFromDropdown(jiraprojects) {
  return {
    type: ADD_JIRA_PROJECTS,
    jiraprojects
  };
}
export function getJSDProjects(jiraprojects) {
  return {
    type: "GET_JSD_PROJECTS",
    jiraprojects
  };
}
export function getJiraStatuses(statuses) {
  return {
    type: GET_JIRA_STATUSES,
    statuses
  };
}

export function getGitHubProjects(repositories) {
  return {
    type: "GET_GITHUB_PROJECTS",
    repositories
  }
}

export function setJiraPersonalChannelDefault(personal_link_info) {
  return {
    type: SET_DEFAULT_JIRA_PERSONAL_CHANNEL,
    personal_link_info
  };
}

export function deleteJiraPersonalChannelDefaultLinking(){
  return {
    type: "DELETE_DEFAULT_JIRA_PERSONAL_CHANNEL_LINKING"
  }
}

export function setJiraDefaultChannel(link_info) {
  // console.log(link_info)
  return {
    type: SET_DEFAULT_JIRA_CHANNEL,
    link_info
  };
}

export function deleteJiraDefaultChannelLinking(){
  return{
    type: "DELETE_DEFAULT_JIRA_CHANNEL_LINKING"
  }
}

export function setSkill(skill) {

  return {
    type: SET_SKILL_DATA,
    skill
  };
}


export function setCurrentSkillUser(skillUser) {
  return {
    type: SET_CURRENT_SKILL_USER,
    skillUser
  };
}

export function getnotifConfig(getNotif) {
  return {
    type: GET_JIRA_NOTIFICATION_CONFIGURATION,
    getNotif
  };
}

export function setnotifConfig(setNotif) {
  return {
    type: SET_JIRA_NOTIFICATION_CONFIGURATION,
    setNotif
  };
}

export function getUserNotifConfig(getUserNotif) {
  return {
    type: GET_JIRA_USER_NOTIFICATION_CONFIGURATION,
    getUserNotif
  };
}

export function setUserNotifConfig(setUserNotif) {
  return {
    type: SET_JIRA_USER_NOTIFICATION_CONFIGURATION,
    setUserNotif
  };
}

export function setSlackLink(linked) {
  return {
    type: SET_SLACK_LINK,
    linked
  };
}

export function setSlackChannels(channels) {
  return {
    type: SET_SLACK_CHANNELS,
    channels
  };
}

export function setSlackChannelsData(channelData) {
  return {
    type: GET_CHANNEL_DATA,
    channelData
  }
}

export function fetchSkillData(skills) {
  return {
    type: GET_SKILL,
    skills
  };
}

export function emailSubscription(subscription) {
  return {
    type: EMAIL_SUBSCRIPTION,
    subscription
  }
}

export function getUserTokenData(userData) {
  return {
    type: "GET_USER_TOKEN",
    userData
  }
}

export function setAllGitHubChannelConfig(channelConfigs) {
  return {
    type: "GET_GIT_CHANNEL_CONFIG",
    channelConfigs
  }
}

export function setAllJiraChannelConfig(jiraChannelConfigs) {
  return {
    type: "GET_JIRA_CHANNEL_CONFIG",
    jiraChannelConfigs
  }
}

export function setJiraBoards(boards) {
  return {
    type: GET_JIRA_BOARDS,
    boards
  }
}
export function setBoardStatuses(statuses) {
  return {
    type: "SET_BOARD_STATUSES",
    statuses
  }
}
export function setJiraBoardSprint(sprints) {
  return {
    type: SET_JIRA_BOARD_SPRINTS,
    sprints
  }
}

export function setCurrentSkill(skill) {

  return {
    type: SET_CURRENT_SKILL,
    skill
  }
}

export function setCurrentTeamsync(teamSync) {
  // console.log("SETD SKILL SET SKILL SERT SKILL")
  return {
    type: SET_CURRENT_TEAMSYNC,
    teamSync
  }
}

export function deleteJiraChannelConfig(jiraConfig) {
  return {
    type: "DELETE_JIRA_CONFIG",
    jiraConfig
  }
}

//standups:my standups

export const setUsersTeamSyncs = teamSyncs => {
  return {
    type: SET_USER_TEAMSYNCS,
    teamSyncs
  };
};

export const setUserTeamSync = teamsync => {
  return {
    type: SET_USER_TEAMSYNC,
    teamsync
  };
};

// getAllUsers
export const AllUsers = allUsers => {
  return {
    type: 'GET_ALL_USERS',
    allUsers
  };
}

export const deleteUserTeamSync = id => {
  return {
    type: DELETE_USER_TEAMSYNC,
    id
  };
};
//standups: show reports

export function setProjectTeamSyncInstance(instance) {
  return {
    type: SET_TEAM_SYNC_INSTANCE,
    instance
  };
}

export function setProjectProgressReports(reports) {
  return {
    type: SET_PROJECT_PROGRESS_REPORTS,
    reports,

  };
}
export function setProjectTeamSyncInstanceResponse(response) {
  return {
    type: SET_TEAM_SYNC_INSTANCE_RESPONSE,
    response
  };
}
// Standup : Resume Now
export const updateUserTeamSyncs = teamSync => {
  return {
    type: UPDATE_USER_TEAMSYNCS,
    teamSync
  }
}

export const updateUserTeamSyncsList = teamSync => {
  return {
    type: "UPDATE_USER_TEAMSYNCS_LIST",
    teamSync
  }
}

// teamsync analytics
export function setWorkspaceTeamSyncData({ totalResponses, membersResponse, totalResponded, repliedResponsesCount, totalLikes, totalComments, totalMoodResponses, userMoodTotal,participation, moodChart, responsesGroupedByTeamMoodScore }) {
  return {
    type: 'SET_WORKSPACE_TEAM_SYNC_DATA',
    totalResponses,
    membersResponse,
    totalResponded,
    repliedResponsesCount,
    totalLikes,
    totalComments,
    totalMoodResponses,
    userMoodTotal,
    participation,
    moodChart,
    responsesGroupedByTeamMoodScore
  }
}

export function setStandupHistory (data){
  return {
    type: 'SET_STANDUP_HISTORY',
    data
  }
}

export function updateStandupHistory (data){
  return {
    type: 'UPDATE_STANDUP_HISTORY',
    data
  }
}

export function setUserMappingsAndUsers(userMappingsWithUsers) {
  return {
    type: GET_USERMAPPING_USERS,
    userMappingsWithUsers
  }
}
export function deleteMappedUser(umId){
return {
type:DELETE_USER_MAPPING,
id:umId
}

}

export function editUserMappinginStore(data){
  return {
  type:EDIT_USER_MAPPING,
  data
  }
  
  }


export function setJiraUsers(users) {
  return {
    type: SET_JIRA_USERS,
    users
  }
}
export function setLoading(value) {
  return {
    type: SET_LOADING,
    value
  }
}
export function addUserMappingToStore(data) {
  return {
    type: ADD_USER_MAPPING,
    data
  }
}


// TO get all workspace members
export function setWorkspaceMembers(members) {
  return {
    type: SET_WORKSPACE_MEMBERS,
    members
  };
}

export function setIsAdmin(members) {
  return {
    type: 'SET_IS_ADMIN',
    members
  };
}

// To update user info
export function setUser(user) {
  return {
    type: SET_USER,
    user
  };
}

export function setWorkspace(workspace) {

  return {
    type: SET_WORKSPACE,
    workspace
  };
}

export function setRecentTeamsyncs(teamsyncs){
  return {
    type: "set_recent_teamsyncs",
    teamsyncs
  };
}


export function setConfluenceSpaces(spaces) {
  return {
    type: SET_CONFULENCE_SPACES,
    spaces
  };
}

export function setConfluenceChannelConfig(config) {
  return {
    type: SET_CONFULENCE_CHANNEL_CONFIG,
 config
  };
}
export function addConfluenceChannelConfigtoStore(config){
  return {type:ADD_CONFLUENCE_CHANNEL_CONFIG,
  config
  }
}
export function setConfluenceChannelConfigList(configs) {
  return {
    type: SET_CONFULENCE_CHANNEL_CONFIG_LIST,
 configs
  };
}



// export const changeClassName = (data) => {
//   return {
//     type: "CHANGE_CLASSNAME",
//     data
//   }
// }


/*export function getAssisantSkills(id){
    return dispatch => {    
        // return axios.get("http://app.troopr.io/bot/workspace/"+id+"/assistant_skills",options)
           return axios.get("/bot/workspace/"+id+"/skills")
                    .then(res =>{
                     // console.log("we")
                      if(res.data.success){
                          dispatch(setAssisantSkills(res.data.skills))
                       }
            return res;
          })
       }
    }*/




export function emailSubscribe(wId, data) {

  return dispatch => {
    return axios.post("/bot/api/" + wId + "/setEmailSubscription", data)
      .then(res => {
        // console.log("res====>")
        if (res.data.success) {


        }
      })
  }

}

export function getEmailSubscription(wId, data) {
  return dispatch => {
    return axios.get("/bot/api/" + wId + "/setEmailSubscription")
      .then(userData => {
        // console.log("data for get emaik====>",userData.data.data.email_subscription)
        // dispatch(emailSubscription(userData.data.data.email_subscription));
        return userData;
      })
  }

}


export function setJiraConnectId(wId, data) {

  return dispatch => {
    return axios.post("/bot/api/" + wId + "/setJiraConnectedId", data)
      .then(res => {

      })
  }
}

export function setGitHubConnectId(wId, data) {

  return dispatch => {
    return axios.post("/bot/api/" + wId + "/setGitHubConnectId", data)
      .then(res => {

      })
  }
}



export function getAssisantSkills(id) {
  return dispatch => {
    // return axios.get("http://app.troopr.io/bot/workspace/"+id+"/assistant_skills",options)
    return axios.get("/bot/api/" + id + "/skills")
      .then(res => {
        if (res.data.success) {
          dispatch(setAssisantSkills(res.data.skills))
        }
        return res;
      })
  }
}

export function recentCheckins(tId,wId) {
  return dispatch => {
    return axios.post(`/api/${wId}/teamsync/${tId}/updateRecentTeamsync`, {})
      .then(res => {
        if (res.data.success) {
          dispatch(setRecentTeamsyncs(res.data.teamsyncs))
        }
        return res;
      })
  }
}

export function getRecentTeamsyncs(wId) {
  return dispatch =>{
    return axios.get('/api/'+wId+'/teamsyncs_recent')
                .then(res =>{
                  if(res.data.success){
                    dispatch(setRecentTeamsyncs(res.data.teamsyncs));
                  }
                  return res;
                })
  }
}

export function deleteRecentTeamsync(wId,tId) {
  return dispatch => {
    return axios.post(`/api/${wId}/teamsync/${tId}/deleteRecentTeamsync`, {})
      .then(res => {
        if (res.data.success) {
          dispatch(setRecentTeamsyncs(res.data.teamsyncs))
        }
        return res;
      })
  }
}


//Get jira channel based Notification.
export function getJiraNotifConfig(wId, channel_id, skillId, projId,isGridSharedChannel) {
  let link = "/bot/api/workspace/" + wId + "/get_notification_config/" + channel_id + "/" + skillId + "/" + projId
  if(isGridSharedChannel){
    link += '?isGridSharedChannel=true'
  }
  return dispatch => {
    // return axios.get("/bot/api/workspace/" + wId + "/get_notification_config/" + channel_id + "/" + skillId + "/" + projId)
    return axios.get(link)
      .then(res => {
        if (res.data.success) {
          dispatch(getnotifConfig(res.data));
        }
        return res;
      });
  }
}

//Set jira channel based Notification.
export function setJiraNotifConfig(wId, skill_id, data, isGridSharedChannel) {

  let link = "/bot/api/workspace/" + wId + "/set_notification_config/" + skill_id
  if(isGridSharedChannel) link += '?isGridSharedChannel=true'
  return dispatch => {
    // return axios.post("/bot/api/workspace/" + wId + "/set_notification_config/" + skill_id, data)
    return axios.post(link, data)
      .then(res => {
        if (res.data.success) {
          //  dispatch(setnotifConfig(res.data));

        }
        return res;
      });
  }
}

//Get jira user based Notification.
export function getJiraUserNotifConfig(wId, userId, skill_id) {
  //  console.log("skill_id??????????",skill_id)
  return dispatch => {
    // return axios.get("/api/workspace/"+wId+"/get_user_notification_config/"+skill_id)
    return axios.get("/bot/api/" + wId + "/jira_user_notif_config/" + skill_id)
      .then(res => {
        if (res.data.success) {
          dispatch(getUserNotifConfig(res.data));
        }
        return res;
      });
  }
}

export const setUserJiraNotifConfig = (wId, skill_id, data) => {
  return dispatch => {
    //  return axios.post("/api/workspace/"+wId+"/set_user_notification_config/"+skill_id,data)
    return axios.post("/bot/api/" + wId + "/jira_user_notif_config/" + skill_id, data)
      .then(res => {
        if (res.data.success) {
        }
      })
  }
}


export const getGitHubChannelConfig = (wId, skillId, channelId, repoId) => {
  let id;

  if (repoId) {
    id = repoId
  } else {
    id = ""
  }
  return dispatch => {
    return axios.get("/bot/api/" + wId + "/gitHubConfig/" + skillId + "/" + channelId, {
      params: {
        repoId: id
      }
    })
      .then(res => {

        return res;


      })
  }
}

export const getGitHubUserConfig = (wId, skillId, channelId) => {
  return dispatch => {
    return axios.get("/bot/api/" + wId + "/gitHubUserConfig/" + skillId + "/" + channelId)
      .then(res => {

        return res;


      })
  }
}

export const getAllGitHubChannelConfig = (wId, skillId, channelId) => {
  return dispatch => {
    return axios.get("/bot/api/" + wId + "/allGitHubConfig/" + skillId + "/" + channelId)
      .then(res => {
        dispatch(setAllGitHubChannelConfig(res.data.data));
        return res;


      })
  }
}

export const getAllJiraConfigs = (wId, skillId, channelId, isGridSharedChannel) => {
  let link = "/bot/api/" + wId + "/allJiraConfig/" + skillId + "/" + channelId
  if(isGridSharedChannel){
    link += "?isGridSharedChannel=true"
  }
  return dispatch => {
    // return axios.get("/bot/api/" + wId + "/allJiraConfig/" + skillId + "/" + channelId)
    return axios.get(link)
      .then(res => {
        // console.log("getAllJiraConfigs==>",res)
        dispatch(setAllJiraChannelConfig(res.data.data));
        return res;


      })
  }
}


export const setGitHubChannelConfig = (wId, skillId, data) => {
  let userId = data.user_id;
  //  console.log("data=======>",data)
  return dispatch => {
    return axios.post("/bot/api/" + wId + "/gitHubConfig/" + skillId + "/" + userId, data)
      .then(res => {

        return res;


      })
  }

}

export const setGitHubUserChannelConfig = (wId, skillId, data) => {
  let userId = data.user_id;
  //  console.log("data=======>",data)
  return dispatch => {
    return axios.post("/bot/api/" + wId + "/gitHubUserConfig/" + skillId + "/" + userId, data)
      .then(res => {

        return res;


      })
  }

}

export const getMappedUser = (skillId, userId) => {
  return dispatch => {
    return axios.get("/bot/api/" + skillId + "/user/" + userId)
      .then(res => {

        return res;


      })
  }
}


export const deleteUserConfig = (wId, skillId, channelId) => {
  return dispatch => {
    return axios.get("/bot/api/deleteUserConfig/" + wId + "/" + skillId + "/channelId/" + channelId)
      .then(res => {

        return res;


      })
  }
}


export function personalSetting(id, user_id) {
  return dispatch => {
    //  return axios.get('/bot/slack/channels/'+id+'/botchannel/'+user_id)
    return axios.get('/bot/slack/channels/' + id + '/botchannel/' + user_id)
      .then(res => {
        if (res.data.success) {
          dispatch(personalJiraSetting(res.data.channel));
        }
        return res;
      });
  }
}

//Get projects based on skill Id
export function getProject(id, isFromJiraConnectionOnboarding) {
  return dispatch => {
  dispatch(getJiraProjects([]))
    // return axios.get('/bot/jira/' + id + '/project')
    let link = '/bot/jira/' + id + '/project'
    if(isFromJiraConnectionOnboarding) link += '?isFromJiraConnectionOnboarding=true'
    return axios.get(link)
      .then(res => {

        if (res.data.success) {
          dispatch(getJiraProjects(res.data.projects));
        }else{ dispatch(getJiraProjects([]))}
        return res;
      });
  }
}

export function searchJiraProjects(id,query) {
  // console.log(id, 'comming herreee');
  return dispatch => {
  dispatch(getJiraProjects([]))

    // return axios.get('/bot/jira/'+id+'/project')
    return axios.get(`/bot/jira/${id}/searchJiraProject${query || ''}`)
      .then(res => {

        if (res.data.success && res.data.projectsData && res.data.projectsData.values ) {
          dispatch(getJiraProjects(res.data.projectsData.values));
        }else{ dispatch(getJiraProjects([]))}
        return res;
      });
  }
}



export const getServiceDeskProject = (wId,skill_id,isFromPersonalPref, isFromJiraConnectionOnboarding) => dispatch => {
  if(isFromPersonalPref)
  dispatch(getJSDProjects([]))
  else
  dispatch(getJiraProjects([]))
  let link = `/bot/jira/workspace/${wId}/skill/${skill_id}/ServiceDeskProject`
  if(isFromJiraConnectionOnboarding) link += '?isFromJiraConnectionOnboarding=true'
  return axios.get(link).then(res => {
    if (res.data.success) {
      if(isFromPersonalPref)
      dispatch(getJSDProjects(res.data.serviceDeskProjects));
      else dispatch(getJiraProjects(res.data.serviceDeskProjects));
    }else{ 
      if(isFromPersonalPref)
      dispatch(getJSDProjects([]))
      else dispatch(getJiraProjects([]))
    }
    return res.data;
  })
}


//Get projects based on skill Id
export function getJiraBoards(wId, query) {
  return dispatch => {
    // return axios.get('/bot/jira/'+id+'/project')
    return axios.get("/bot/api/workspace/" + wId + "/getAllBoardsApi?" + query)
      .then(res => {
        if (res.data.success) {
          dispatch(setJiraBoards(res.data.boards));
        }
        return res;
      });
  }
}

export function getBoardStatuses(wId, boardId) {
  return dispatch => {
    // return axios.get('/bot/jira/'+id+'/project')
    return axios.get(`/bot/api/${wId}/getBoardStatuses/${boardId}`)
      .then(res => {
        if (res.data.success) {
          // dispatch(setJiraBoards(res.data.boards));
          dispatch(setBoardStatuses(res.data.statuses));
        }
        return res;
      });
  }
}

export function getJiraBoardSprint(wId, id) {
  return dispatch => {
    // return axios.get('/bot/jira/'+id+'/project')
    return axios.get("/bot/api/workspace/" + wId + "/getBoardsSprints/" + id)
      .then(res => {
        if (res.data.success) {
          dispatch(setJiraBoardSprint(res.data.sprints));
        }
        return res;
      });
  }
}

export function getGitHubRepository(wId) {
  return dispatch => {
    return axios.get('/bot/api/github/' + wId + '/getRepos')
      .then(res => {
        //  console.log("=======>",res)
        if (res.data.success) {
          dispatch(getGitHubProjects(res.data.repositories));

        }
        return res;

      })
  }

}

//get issue based on project Id
export function getIssues(wId, pId, isSupportChannel,isFromPersonalPref, isFromJiraOnboarding) {
  return dispatch => {
    let link = '/bot/jira/' + wId + '/project/' + pId
    if(isSupportChannel) link += '?isSupportChannel=true'
    return axios.get(link)
      .then(res => {
        if (res.data.success) {
          if(isFromPersonalPref || isFromJiraOnboarding)dispatch(getJsdRequestTypes(res.data.issueTypes));
          else dispatch(getJiraIssues(res.data.issueTypes));
        }else{
          if(isFromPersonalPref)dispatch(getJsdRequestTypes([]));
          else dispatch(getJiraIssues([]));
        }
        return res;
      });
  }
}

export function getDefaultChannel(id, channel_id, type,isGridSharedChannel) {
  return dispatch => {
    let link = '/bot/skill/' + id + '/channel_link/' + channel_id
    if(isGridSharedChannel) link += `?isGridSharedChannel=true`
    // return axios.get('/bot/skill/' + id + '/channel_link/' + channel_id)
    return axios.get(link)
      .then(res => {
        if (res.data.success) {
          if (type) {
            dispatch(setJiraPersonalChannelDefault(res.data.link_info));
          } else {
            dispatch(setJiraDefaultChannel(res.data.link_info));
          }
        }
        return res;
      });
  }
}

//delete channel_link
export function deleteDefaultChannel(id,channel_id,isPersonal,isGridSharedChannel){
  let link = `/bot/skill/${id}/channel_link/${channel_id}`
  if(isGridSharedChannel){
    link += '?isGridSharedChannel=true'
  }
  return dispatch => {
    // return axios.delete(`/bot/skill/${id}/channel_link/${channel_id}`).then(res => {
    return axios.delete(link).then(res => {
      if (res.data.success) {
        if (isPersonal) {
          // dispatch(setJiraPersonalChannelDefault(res.data.link_info));
          dispatch(deleteJiraPersonalChannelDefaultLinking())
        } else {
          // dispatch(setJiraDefaultChannel(res.data.link_info));
          dispatch(deleteJiraDefaultChannelLinking());
        }
      }
      return res.data
    })
  }
}

export function setDefaultChannel(id, data, type,isGridSharedChannel) {
  return dispatch => {
    let link = '/bot/skill/' + id + '/channel_link'
    if(isGridSharedChannel){
      link += '?isGridSharedChannel=true'
    }
    // return axios.post('/bot/skill/' + id + '/channel_link', data)
    return axios.post(link, data)
      .then(res => {
        if (res.data.success) {
          if (type) {
            dispatch(setJiraPersonalChannelDefault(res.data.link_info));
          } else {
            dispatch(setJiraDefaultChannel(res.data.link_info));
          }
        }
        return res;
      });
  }
}

export function creatorAsAssignee({link,channel}){
  return dispatch => {
    // let link = `/bot/skill/${skill_id}/channel_link/creatorAsAssignee/${channel_id}`;
    return axios
    .post(link,{channel})
    .then(res => {
      if (res && res.data && res.data.success) {
        dispatch(setJiraDefaultChannel(res.data.link_info));
      }
      return res;
    })
    .catch((error) => {});
  }
}

//Get all the channel list based on workspace ID both private and public
export function getChannelList(id, query) {
  let q = ""
  if (query) {
    q = "?" + query
  }
  return dispatch => {
    // return axios.get('/bot/slack/conversations/'+id)
    return axios.get('/bot/api/' + id + '/slack/getChannels' + q).then(res => {
      if (res.data.success) {
        dispatch(getChannel(res.data.channels));
      }
      return res;
    });
  }
}

export const resetChannelsList = () => dispatch => {
  return dispatch(getChannel([]))
}

//get a channel info
export function getChannelInfo(wid, channelId) {

  return dispatch => {
    // return axios.get('/bot/slack/conversations/'+id)
    return axios.get('/bot/api/' + wid + '/slack/conversation/' + channelId).then(res => {
      if (res.data.success) {
        //  dispatch(getChannel(res.data.channels));
      }
      return res;
    });
  }
}

//get current skill



export function getCurrentSkill(wId, query) {
  //  console.log("getCurrentSkillgetCurrentSkillgetCurrentSkillgetCurrentSkillgetCurrentSkillgetCurrentSkill" )
  return dispatch => {
    //  return axios.get('/bot/getSkill/'+id)
    return axios.get("/bot/api/" + wId + "/getSkill?" + query)
      .then(res => {
        // console.log(res.data)
        if (res.data.success) {
          dispatch(setCurrentSkill(res.data.skill));
        }
        return res;
      })
  }
}


//Get skill data based on skillID
export function getSkillData(id) {
  return dispatch => {
    //  return axios.get('/bot/getSkill/'+id)
    return axios.get('/bot/getSkill/' + id)
      .then(res => {
        if (res.data.success) {
          dispatch(setSkill(res.data.skill));
        }
        return res;
      })
  }
}

// getSkillId
export function getSkillId(wId, type) {
  return dispatch => {
    //  return axios.get('/bot/getSkill/'+id)
    return axios.get('/bot/getSkillId/workspace/' + wId + "/type/" + type)
      .then(res => {
        // console.log("res=========>", res);
        if (res.data.success) {
          return res.data.data

        }
        // if (res.data.success) {
        //   dispatch(setSkill(res.data.skill));
        // }
        // return res;
      })
  }
}

export function saveDataTrooprConfigs(wId, data) {
  return dispatch => {
    return axios.post('/bot/workspace/' + wId + "/saveDataTrooprConfigs", data)
      .then(res => {
        // console.log("res=========>", res);
        if (res.data.success) {
          return res.data.data

        }

      })
  }
}

export function getTrooprChannelConfig(skillId, wId, pId) {
  return dispatch => {
    return axios.get('/bot/workspace/' + wId + "/skill/" + skillId + "/getDataTrooprConfigs/" + pId)
      .then(res => {
        // console.log("res=========>getChannelConfig", res);

        return res



      })
  }
}

export function getTrooprUserChannelConfig(skillId, wId, uId) {
  return dispatch => {
    return axios.get('/bot/workspace/' + wId + "/skill/" + skillId + "/getDataTrooprUserConfigs/" + uId)
      .then(res => {
        // console.log("res=========>getChannelConfig", res);

        return res



      })
  }
}

export function getSkillUser(id, skill_id) {
  return dispatch => {
    // return axios.get("/api/workspace/"+id+"/getSkill/"+skill_id+"/user")
    return axios.get("/api/workspace/" + id + "/getSkill/" + skill_id + "/user")
      .then(res => {
        // console.log("res.data.success",res)
        if (res.data.success) {
          // console.log("res",res.data)
          dispatch(setCurrentSkillUser(res.data.skillUser));
        }else if(!res.data.success && res.data.message == "No User Found"){
          dispatch(setCurrentSkillUser({}));
        }
        return res;
      })
  }
}

//Logout/Unlink Jira user
export function logOutSkillUser(id, skill_id) {
  return dispatch => {
    // return axios.post("/api/workspace/"+id+"/getSkill/"+skill_id+"/user_logout")
    return axios.post("/api/workspace/" + id + "/getSkill/" + skill_id + "/user_logout")
      .then(res => {
        if (res.data.success) {
          dispatch(setCurrentSkillUser({}));
        }
        return res;
      })
  }
}

export function unlinkGitUser(wId, skill_id, user_id) {
  return dispatch => {
    // return axios.post("/api/workspace/"+id+"/getSkill/"+skill_id+"/user_logout")
    return axios.post("/bot/api/workspace/" + wId + "/skill/" + skill_id + "/user_logout/" + user_id)
      .then(res => {
        if (res.data.success) {
          dispatch(setCurrentSkillUser({}));
        }
        return res;
      })
  }
}


export function updateSkill(id, workspace_id, data, currentSkill, dontUpdateCurrentSkill) {
  // let newCurrentSkill = { ...currentSkill, userName: data.userName, userToken: data.userToken };
  return dispatch => {
    // return axios.put("/bot/workspace/"+workspace_id+"/assistant_skills/"+id, data)
    //return axios.put("/bot/workspace/" + workspace_id + "/assistant_skills/" + id, data)
    return axios.put("/bot/api/workspace/" + workspace_id + "/assistant_skills_update/" + id, data)
      .then(res => {
        if (res.data.success) {
          dispatch(setSkill(res.data.skill));
          // res.data.skill.name === 'Jira' && 
          
          dispatch(updateAssisantSkills(res.data.skill))
          if (res.data.skill.userToken == null) {
            dispatch(getUserTokenData({ userName: null, userToken: null }));
            // dispatch(setCurrentSkill(newCurrentSkill))
            if(!dontUpdateCurrentSkill) dispatch(setCurrentSkill(res.data.skill))

          }
        }
        return res;
      })
  }
}
export function updateGlobalJiraNotif(wId,sId,data){

return dispatch => {
  // return axios.put("/bot/workspace/"+workspace_id+"/assistant_skills/"+id, data)
  return axios.put("/bot/"+wId+"/skill/"+sId+"/updateJiraGlobalNotif", data)
    .then(res => {
      if (res.data.success) {
        dispatch(setSkill(res.data.skill));
       dispatch(setCurrentSkill(res.data.skill))

        
      }
      return res;
    })
}
}
//Redirects to jira connection page
export function getSkillConnectUrl(type, id, location) {
  return dispatch => {

    let query = "type=" + type + "&workspace_id=" + id
    if (location) {
      query = query + "&location=" + location
    }
    //  return axios.get(`/api/skillConnectUrl?type=`+type+"&workspace_id="+id)
    return axios.get("/api/skillConnectUrl?" + query)
      .then(res => {
        if (res.data.success) {
          // console.log(res.data.url)
        }
        return res;
      })
  }
}

//Check weather workspace is connected to slack or not.
export function checkSlackLink(id) {
  return dispatch => {
    // return axios.get('/api/slack/checkSlackLink/'+id)
    return axios.get('/api/slack/checkSlackLink/' + id)
      .then(res => {
        // dispatch(setSlackLink(res.data.linked));
        if (res.data.success) {
          // dispatch(setSlackChannels(res.data.channels));
          dispatch(setSlackChannelsData(res.data.team));
        }
        return res;
      })
  }
}

export function getuserMapping(sId, uId, wId) {
  return dispatch => {
    return axios.get('/bot/api/workspace/' + wId + '/skill/' + sId + '/usermapping/' + uId)
      .then(res => {
        // console.log("res===>", res)
        if (res.data.success) {
          return res;

        }
      })
  }

}

//Fetch skills both system and custom
export function fetchSkills(id) {
  return dispatch => {
    return axios.get('/bot/api/' + id + '/skills')
      .then(res => {
        if (res.data.success) {
          dispatch(fetchSkillData(res.data.skills));
        }
        return res;
      })
  }
}

export function submitTokenData(wId, data, currentskill) {
  // let newCurrentSkill = { ...currentskill, userName: data.userName, userToken: data.userToken };
  return dispatch => {
    return axios.post('/bot/api/' + wId + '/submitTokenData', data)
      .then(res => {
        if (res.data.success) {
          // dispatch()
          let userData = {
            userName: data.userName,
            userToken: data.userToken
          }
          dispatch(getUserTokenData(userData));
          dispatch(setCurrentSkill(res.data.skill))
          res.data.skill.name === 'Jira' && dispatch(updateAssisantSkills(res.data.skill))
        }
        return res;
      })
  }
}


export function getUserToken(wId, name) {
  return dispatch => {
    return axios.get("/bot/api/" + wId + "/getTokenData/" + name)
      .then(res => {
        // console.log("res===>",res);
        if (res.data.data) {
          let userData = {
            userName: res.data.data.userName,
            userToken: res.data.data.userToken
          }
          dispatch(getUserTokenData(userData));
        }

        return res.data;
      })
  }
}

export function getTeamData(wId) {
  return dispatch => {
    return axios.get("/bot/api/" + wId + "/getTeamData")
      .then(res => {
      dispatch(setTeamDetails(res.data.team))
        // console.log("res==>?",res);
        return res;
      })
  }

}

export function getUser(data) {
  return dispatch => {
    return axios.get("/bot/api/getUserInfo/" + data)
      .then(res => {
        // console.log("getuser",res)
        return res;
      })
  }
}


export const deleteJiraConfig = (wId, skillId, channelId, data, isGridSharedChannel) => {

  let link = "/bot/api/" + wId + "/deleteJiraConfig/" + skillId + "/" + channelId
  if(isGridSharedChannel) link += '?isGridSharedChannel=true'

  return dispatch => {
    // return axios.post("/bot/api/" + wId + "/deleteJiraConfig/" + skillId + "/" + channelId, data).then(res => {
    return axios.post(link, data).then(res => {
      dispatch(deleteJiraChannelConfig(res.data));
    })
  }
}

export const addTeamSyncAdmin = (teamSyncId,userId) => {
  return dispatch => {
    return axios
      .post(`/api/teamSync/${teamSyncId}/addTeamSyncAdmin/${userId}`)
      .then(res => {
        if(res.data.success){
          dispatch(setUserTeamSync(res.data.updated_teamSync));
          return res;
        }else{
          return res;
        }
      }).catch(err => {
        console.error("some error occurred while adding team sync admin: ",err);
      })
  }
}

export const deleteTeamSyncAdmin = (teamSyncId,userId) => {
  return dispatch => {
    return axios
      .post(`/api/teamSync/${teamSyncId}/removeTeamSyncAdmin/${userId}`)
      .then(res => {
        if(res.data.success){
          dispatch(setUserTeamSync(res.data.updated_teamSync));
          return res;
        }else{
          console.error("some error occurred while removing team sync admin");
          return res;
        }
      }).catch(err => {
        console.error("some error occurred while removing team sync admin");
      })
  }
}

//standups:my standup
export const getUserTeamSync = id => {
  return dispatch => {
    return axios
      .get(`/api/getUserTeamSync/${id}`)
      .then(res => {
        // console.log('======>res.data', res);
        if (res.data.success) {
          dispatch(setUserTeamSync(res.data.teamSync));
        } else {
          dispatch({
            type: 'ERROR',
            payload: {
              message: 'not member of this teamsync',
              type: 'TEAMSYNC_MEMBERSHIP'
            }
          });
        }
        return res;
      })
      .catch(e => {
        dispatch({
          type: 'ERROR',
          payload: {
            message: 'not member of this teamsync',
            type: 'TEAMSYNC_MEMBERSHIP'
          }
        });
        console.error(e)
      });
  };
};

export const getUsersSelectedTeamSync = (id,showAll) => {
  return dispatch => {
    return axios
      .get('/api/getUsersSelectedTeamSync/' + id +"?showAll="+showAll)
      .then(res => {
        if (res.data.success) {
          dispatch(setUsersTeamSyncs(res.data.teamSyncs));
        } else {
          dispatch({ type: 'ERROR', payload: res.data });
        }
        return res;
      })
      .catch(err => {
        dispatch({
          type: 'ERROR',
          payload: {
            message: 'not member of this teamsync',
            type: 'TEAMSYNC_MEMBERSHIP'
          }
        });
        console.error(err)
        return err;
      });
  };
};

export const getTeamsyncsCount = (wId,isfromGettingStartedPage) => {
  let link = `/api/${wId}/getTeamsyncsCount`
  if(isfromGettingStartedPage) link += '?isGettingStarted=true'
  return axios.get(link).then(res => res.data)
}

export const getJiraConfigurationsCount = (wId,skill_id,isGridWorkspace,isJiraAdmin) => {
  return axios.get(`/bot/api/${wId}/skill/${skill_id}/getJiraConfigurationsCount?isGridWorkspace=${isGridWorkspace || false}&isJiraAdmin=${isJiraAdmin || false}`).then(res => res.data)
}

export const getProjectfirstDetails = (wId, user_id, skill_id,data) => {
  return axios.post(`/bot/api/${wId}/skill/${skill_id}/user/${user_id}/gettingStartedfirst`,data).then((res) => res.data);
};

export const getWikiConfigurationCount = (wId,skill_id,isGridWorkspace,isWikiAdmin) => {
  return axios.get(`/bot/api/${wId}/skill/${skill_id}/getWikiConfigurationCount?isGridWorkspace=${isGridWorkspace || false}&isWikiAdmin=${isWikiAdmin || false}`).then(res => res.data)
}
export const getJiraChannelPreferencePageData = (wId,skill_id,isGridWorkspace,isJiraAdmin) => dispatch => {
  return axios.get(`/bot/api/${wId}/skill/${skill_id}/getJiraChannelPreferencePageData?isGridWorkspace=${isGridWorkspace || false}&isJiraAdmin=${isJiraAdmin || false}`).then(res => {
    if(res.data.success) dispatch(setCommonChannelData(res.data.commonData));
    return res.data
  })
}

export const getCommonData = (wId,skill_id,isWorkspaceAdmin,isGridWorkspace,channel_ids,sharedChannel_ids,isPersonalPref) => dispatch => {
  let link = `/bot/api/${wId}/skill/${skill_id}/getCommonData`
  return axios.post(link,{
    isWorkspaceAdmin,channel_ids,sharedChannel_ids,isGridWorkspace,isPersonalPref
  }).then(res => {
    if(res.data.success) dispatch(setCommonChannelData(res.data.commonData));
    return res.data
  })
}

export const deleteChannelConfigurations = (wId,data,type) => (dispatch,getStore) => {
  return axios.post(`/bot/api/workspace/${wId}/deleteChannelConfigurations`,data).then(res => {
    if(res.data.success){
      if(type === 'personal'){
        dispatch(getUserNotifConfig({}));
        dispatch(deleteJiraPersonalChannelDefaultLinking());
      }     
        let commonData = getStore().skills.commonChanneldata
        dispatch(setCommonChannelData(commonData.filter(d => d.channel_id !== data.channel_id)))
    }
    return res.data
  })
}

export const getJiraReportsCount = (wId) => {
  return axios.get(`/bot/api/workspace/${wId}/jiraReportsCount`).then(res => res.data)
}


//standupds:show report

export function getAnotherInstancePage(id, data) {
  return dispatch => {
    return axios.post(`/api/teamSync/${id}/get_other_instances`, data).then(res => {
      if (res.data.success) {
        const { previousInstanceNotAvailable, nextInstanceNotAvailable } = res.data.instancePresent;
        dispatch(
          setProjectTeamSyncInstance(res.data.projectTeamSyncInstance)
        );
        dispatch(setProjectProgressReports(res.data.instanceResponses));
        if (previousInstanceNotAvailable && nextInstanceNotAvailable) {
          dispatch({ type: PREV_NXT_INSTANCE_NOT_AVAILABLE })
        }
        else if (previousInstanceNotAvailable) {
          dispatch({ type: PREV_INSTANCE_NOT_AVAILABLE });
        } else if (nextInstanceNotAvailable) {
          dispatch({ type: NXT_INSTANCE_NOT_AVAILABLE });
        } else {
          dispatch({ type: PREV_NXT_INSTANCE_AVAILABLE })
        }
      } else {
        if (res.data.message) {
          dispatch({ type: GET_INSTANCE_EMPTY, message: res.data.message })
        }
      }
      return res;
    })
  }
}

export function getProjectTeamSyncInstance(id, instanceID) {
  if (instanceID) {

  } else {
    instanceID = "";
  }
  return dispatch => {
    return axios.get("/api/teamSync/" + id + "/teamSyncInstance/?instanceID=" + instanceID + '&teamSyncId=' + id)
      .then(res => {
        if (res.data.success) {
          const { previousInstanceNotAvailable, nextInstanceNotAvailable } = res.data.instancePresent;

          dispatch(
            setProjectTeamSyncInstance(res.data.projectTeamSyncInstance)
          );
          dispatch(setProjectProgressReports(res.data.instanceResponses));

          if (previousInstanceNotAvailable && nextInstanceNotAvailable) {
            dispatch({ type: PREV_NXT_INSTANCE_NOT_AVAILABLE })
          }
          else if (previousInstanceNotAvailable) {
            dispatch({ type: PREV_INSTANCE_NOT_AVAILABLE });
          } else if (nextInstanceNotAvailable) {
            dispatch({ type: NXT_INSTANCE_NOT_AVAILABLE });
          }
        }
        return res;
      });
  };
}

export const deleteTeamInstance = (instanceId, wId, teamSyncId) => {
  return dispatch => {
    return axios.delete(`/api/workspace/${wId}/teamsync/${teamSyncId}/teamSyncInstance/${instanceId}`).then(data => {
      return data;
    })
  }
}

export const getUserMappingAndUsers = (wId, skillId, getCount) => {
  return dispatch => {
    let link  = `/bot/workspace/${wId}/getUserMappingsAndUsers/${skillId}`
    if(getCount) link += '?getCount=true'
    return axios.get(link).then(res => {
      // console.log(res);
      if(!getCount)dispatch(setUserMappingsAndUsers(res.data.userMappings));
      return res
    })
  }
}

export const deleteUserMapping=(wId,umid)=>{
  return dispatch => {
    return axios.delete(`/bot/workspace/${wId}/deleteusermapping/${umid}`).then(res => {
if(res&&res.data&&res.data.success)dispatch(deleteMappedUser(umid));
   
    })
  }
}

export const getJiraUsers = (skillId, query) => {

  return dispatch => {
    dispatch(setLoading(true))
    return axios.get(`/bot/workspace/skill/${skillId}/jiraUsers?search=${query}`).then(res => {
      dispatch(setJiraUsers(res.data.users))
      dispatch(setLoading(false))

      return res.data
    })
  }
}


export const addUserMapping = (data, workspace_id, skill_id, type) => {

  return dispatch => {
    dispatch(setLoading(true))
    return axios.post(`/bot/workspace/${workspace_id}/addUserMapping/${skill_id}/${type}`, data).then(res => {

      if (res.data.success && !res.data.userexists) {
        dispatch(addUserMappingToStore(res.data.info))
        dispatch(setLoading(false))
        // console.log(res.data.usermapping);
        return res

      }
      else if (res.data.success && res.data.userexists) {
        dispatch(setLoading(false))
        return res
      }
      else {
        dispatch(setLoading(false))
        return res
      }

    })

  }
}

export const editUserMapping = (data,workspace_id,umid) => {
  return dispatch => {
    dispatch(setLoading(true))
        
    return axios.put(`/bot/workspace/${workspace_id}/updateUserMapping/${umid}`,data).then(res => {
  if(res.data.success&&!res.data.userexists){
    dispatch(setLoading(false))
    dispatch(editUserMappinginStore(res.data.data))
    return res
  }else if (res.data.success && res.data.userexists) {
    dispatch(setLoading(false))
    return res
  }
  else {
    dispatch(setLoading(false))
    return res
  }

    })

  }
}
// Standup : Resume Now

export function editTeamSync(id, data) {
  return dispatch => {
    return axios.post('/api/teamSync/' + id + '/teamsyncupdates', data).then(res => {
      if (res.data.success) {
        if (res.data.teamSync.selectedMembers.length > 0 && res.data.teamSync.selectedMembers[0]._id) {
          res.data.teamSync.selectedMembersInfo=res.data.teamSync.selectedMembers
          res.data.teamSync.selectedMembers = res.data.teamSync.selectedMembers.map(mem => mem._id)
        }
        dispatch(setUserTeamSync(res.data.teamSync));
        dispatch(updateUserTeamSyncs(res.data.teamSync));


      // res.data.teamSync.projectName=data.projectName;
      if (res.data.teamSync.selectedMembers.length > 0 && res.data.teamSync.selectedMembers[0]._id) {
        res.data.teamSync.selectedMembers = res.data.teamSync.selectedMembers.map(mem => mem._id)
      }
    }
      return res;
    });
  }
}

export function updateTeamSyncCustomEmoji(id, data) {
  return dispatch => {
    return axios.put('/api/teamSync/' + id + '/updateCustomEmoji', data)
    .then(res => {
      if (res.data.success) {
        dispatch(setUserTeamSync(res.data.teamSync));
        dispatch(updateUserTeamSyncs(res.data.teamSync));
      }
      return res
    })
    .catch((err)=>{
      console.error(err,"Error")
    });
  }
}

export function changeStandupHoliday(wId, id, data) {
  return dispatch => {
    return axios.post('/api/workspace/' + wId + '/teamSync/' + id + '/holiday', data).then(res => {
      if (res.data.success) {
        if (res.data.teamSync.selectedMembers.length > 0 && res.data.teamSync.selectedMembers[0]._id) {
          res.data.teamSync.selectedMembersInfo=res.data.teamSync.selectedMembers
          res.data.teamSync.selectedMembers = res.data.teamSync.selectedMembers.map(mem => mem._id)
        }
        dispatch(setUserTeamSync(res.data.teamSync));
        dispatch(updateUserTeamSyncs(res.data.teamSync));

      }
      return res;
    })
    // res.data.teamSync.projectName=data.projectName;


  }
}

export function sendTeamsyncAck(data, wId) {

  // console.log("ded",data)
  return dispatch => {
    return axios.post(`/bot/api/${wId}/sendAck`, data).then(res => {
      // console.log("")
    })
  }
}

export function excecuteTeamSync(id) {

  return dispatch => {
    return axios.get(`/api/runTeamSyncNow/` + id)
      .then(res => {
        return res;
      })
  }
}

export function deleteteamsync(id) {
  return dispatch => {

    return axios.delete(`/api/deleteTeamSync/` + id)

      .then(res => {
        if (res.data.success) { dispatch(deleteUserTeamSync(id)) }
        return res;
      })
  }
}
// Jira Server: Connection

export function addBasicAuth(workspace_id, skill_id, data) {
  return dispatch => {
    return axios.post('/bot/api/workspace/' + workspace_id + '/addBasicAuth/' + skill_id, data).then(res => {
      if (res.data.success) {
        dispatch(setCurrentSkill(res.data.skill))
      }
      return res;
    })
  }
}

// Jira Server: Adding User
export function addUserBasicToken(workspace_id, skill_id, data) {
  return dispatch => {

    return axios.post('/bot/api/workspace/' + workspace_id + '/addUserBasicToken/' + skill_id, data).then(res => {
      if (res.data.success) {
        dispatch(setCurrentSkillUser(res.data.skillUser));
      }
      return res;


    })
  }
}

// to get all users
export function getAllUsers(workspace_id) {
  return dispatch => {
    return axios.get('/bot/slack/getAllUsers/' + workspace_id).then(res => {
      if (res.data.success) {
        dispatch(AllUsers(res.data.users));
      }
      return res
    })
  }
}

export function sendDefaultLauncher(wId, channelId, userId) {
  return dispatch => {
    return axios.get('/bot/api/' + wId + '/sendLauncher/' + userId + '/' + channelId).then(data => {

    })
  }
}

export function exportToCsv(wId, data) {
  return dispatch => {
    return axios.post(`/bot/api/${wId}/exportToCsv`, data).then(data => {
      return data
    })
  }
}

//Get User Activities
export function getJiraUserActivity(wId, user_id) {
  return dispatch => {
    return axios.get(`/bot/api/${wId}/getUserActivities/${user_id}`).then(data => {
      // data.data.activity = false
      // delete data.data.userActivity
      // console.log(data.data)
      return data.data;
    })
  }
}


// TO get all workspace members
export function getWorkspaceMembers(id) {
  return dispatch => {
    // return axios.get('/api/workspace/' + id + '/membership').then(res => {
    return axios.get('/api/' + id + '/membership').then(res => {
      if (res.data.success) {
        dispatch(setWorkspaceMembers(res.data.members));
        dispatch(setIsAdmin(res.data.members));
      }
      return res;
    });
  }
}

// To update user info
export function updateUserInfo(data) {
  return dispatch => {
    return axios.put('/api/updateUserInfo', data).then(res => {

      if (res.data.success) {
        // if(res.data.token){
        //    const token = res.data.token;
        //   localStorage.setItem('token', token);
        //   setAuthorizationToken(token);
        // }
        dispatch(setUser(res.data.user));
      }
      return res;
    });
  }

}

// To get user info
export function getProfileinfo() {
  return dispatch => {
    return axios.get('/api/getProfileinfo').then(res => {
      if (res.data.success) {
        // console.log("-------------- profile info-----------",res.data.user);
        dispatch(setUser(res.data.user));
        // // socket connection for notifications
        // localStorage.setItem("trooprUserId",res.data.user._id);
        // socket.emit('initClientInfo',{userId:res.data.user._id})
        // socket.on('notification', (data) => {
        //   // if(data.payload.type === 'PROJECT_NAME_UPDATED'){
        //   //   dispatch(insertProject(data.payload.project))
        //   // }
        //   // console.log("user socket connection data ---------->>>> ---------->>>",data);
        //   dispatch({type:'NOTIFICATION_RECEIVED',payload:data})
        // });
        // end
      }
      return res;
    });
  }
}

export function updateUserWorkspaces(data,wId) {
  return dispatch => {
    // return axios.put('/api/workspacemembership/updateOffset', data)
    return axios.put('/api/'+wId+'/workspace_timezone', data)
      .then(res => {
        if (res.data.success) {
        }
        return res;
      })
  }
}

export function deleteAccount() {
  return dispatch => {
    return axios.delete('/api/user/deleteAccount')
      .then(res => {
        if (res.data.success) {
        }
        return res;
      })
  }
}

// update workspace
export function updateWorkspace(id, showStatus, data) {
  return dispatch => {
    // return axios.put('/api/workspace/' + id, data).then(res => {
    return axios.put('/api/'+id+'/workspace', data).then(res => {
      if (res.data.success) {
        //console.log("###",res.data.workspace)
        res.data.workspace.showStatus = showStatus;
        dispatch(setWorkspace(res.data.workspace));
        // dispatch(editWorkspace(res.data.workspace));
      }
      return res;
    });
  }
}

export function setAssistantName(wId, newName) {
  return dispatch => {
    return axios.post(`/bot/api/${wId}/setAssistantName`, {name: newName}).then((res) => {
      if (res.data.success) {
        dispatch(updateAssistantName(newName))
      }
      return res;
    })
    
  }
}

export function getWorkspace(id) {
  return dispatch => {

    return axios.get('/api/' + id+'/workspace').then(res => {
      if (res.data.success) {
        dispatch(setWorkspace(res.data.workspace));
      } else {
        dispatch({ type: "ERROR", payload: res.data })
      }
      return res;
    }).catch(err => {
      if (err.error !== "cancel") {
        dispatch({ type: "ERROR", payload: { message: err.message, type: err.type } })
      }
      console.error(err)
      return err;
    })
  }
}

export function leaveWorkspace(workspace_id) {
  return dispatch => {
    // return axios.delete('/api/workspace/' + workspace_id + '/leaveWorkspace').then(res => {/
    return axios.delete('/api/workspace/' + workspace_id + '/leaveWorkspace').then(res => {

      if (res.data.success) {
        // dispatch(removeWorkspace(workspace_id));
      }
      return res;
    });
  }
}


export function removeWorkspaceMember(id) {
  return {
    type: DELETE_WORKSPACE_MEMBER,
    id
  };
}





export function deleteWorkspaceMember(wId, id) {
  return dispatch => {
    // return axios.delete('/api/workspace/' + wId + '/membership/' + id).then(res => {
    return axios.delete('/api/' + wId + '/membership/' + id).then(res => {
      if (res.data.success) {
        // console.log("Removed Workspace Member" + id);
        dispatch(removeWorkspaceMember(id));
      }
      return res;
    });
  }
}


export function updateWorkspaceMembership(membership) {
  // console.log("tets",membership)
  return {
    type: UPDATE_WORKSPACE_MEMBERSHIP,
    membership
  }
}

export function updateMembership(id, mId, body) {
  return dispatch => {
    // return axios.put("/api/workspace/" + id + "/userWorkspaceMembership/" + mId, body).then(res => {
    return axios.put("/api/" + id + "/membership/" + mId, body).then(res => {
      if (res.data.success) {
        // console.log("hello ")
        // dispatch(setToAdmin(userId, body.role));

        dispatch(updateWorkspaceMembership(res.data.membership))
      }
      return res
    })
  }
}


export function makeWorkspaceAdmin(wId, mId) {
  return dispatch => {
    // return axios.put("/api/workspace/" + id + "/userWorkspaceMembership/" + mId, body).then(res => {
    return axios.post(`/api/${wId}/${mId}/addAdmin`).then(res => {
      if (res.data.success) {
        // console.log("hello ")
        // dispatch(setToAdmin(userId, body.role));

        dispatch(updateWorkspaceMembership(res.data.membership))
      }
      return res
    })
  }
}

export function deleteWorkspaceAdmin(id, val) {
  return dispatch => {
    // return axios.put("/api/workspace/" + id + "/userWorkspaceMembership/" + mId, body).then(res => {
    return axios.post(`/api/${id}/${val}/deleteAdmin`).then(res => {
      if (res.data.success) {
        // console.log("hello ")
        // dispatch(setToAdmin(userId, body.role));

        dispatch(updateWorkspaceMembership(res.data.membership))
      }
      return res
    })
  }
}


// team sync analytics

export const getTeamSyncAnalytics = (id,data) => {
  return dispatch => {
    return axios.get(`/api/getTeamSyncAnalytics/${id}`,{
      params:{
        selectedMembers:data.selectedMembers,
        startDate:data.startDate,
        endDate:data.endDate
      }
    })
      .then(res => {
        if (res.data.success) {
          dispatch(setWorkspaceTeamSyncData(res.data));
        }
        return res;
      })
  }
}


//standup history

export const getStandupHistory = (wId,tId,data ,showMore) => {
  return dispatch => {
    return axios.get(`/api/${wId}/teamSync/${tId}/userResponses`,{params:{
      startAt:data.startAt,
      startDate:data.startDate,
      endDate:data.endDate,
      user_id:data.user_id,
      user_slack_id:data.user_slack_id
    }})
    .then(res => {
      if(res.data.success){
        if(showMore && showMore == 'true'){
          dispatch(updateStandupHistory(res.data))
        }else{
          dispatch(setStandupHistory(res.data))
        }
      }
      return res;
    })
    
  }
}

//standup csv

export const getStandupCsvReport = (wId,tId,data) => {
  return dispatch => {
    return axios.get(`/api/${wId}/teamSync/${tId}/getCsvReport`,{params:{
      startAt:data.startAt,
      startDate:data.startDate,
      endDate:data.endDate,
      user_id:data.user_id
    }})
    .then(res => {
      return res;
    })
    
  }
}

export const sendReportEmail = (wId,tId,data) => {
  return dispatch => {
    return axios.post(`/api/${wId}/teamSync/${tId}/sendTeamsyncReportAsEmail`,{
      startDate:data.startDate,
      endDate:data.endDate,
      user_id:data.user_id,
      exactStartDate:data.exactStartDate,
      exactEndDate:data.exactStartDate
    }).then(res => {
      return res;
    })
  }
}

export const createTeamSync = (wId,data) => {
  return dispatch => {
    return axios.post(`/api/createNewTeamSync/${wId}`,data).then(res => {
      if (res.data.success) {
        dispatch(setUserTeamSync(res.data.teamSync));
        dispatch(updateUserTeamSyncsList(res.data.teamSync))
      }
      return res;
    })
  }
}


export function updateProgressReport(data) {
  return {
    type: "update_progress_report",
    data
  };
}

export function updateUserLeave(data) {
  return {
    type: "update_user_holiday",
    data
  };
}

export function UpdateStandupReport(data) {
  return {
    type:UPDATE_TEAMSYNC_INSTANCE_REPORT,
    report:data
  };
}

export function UpdateLikesAndComments(data){
  return {
    type: "update_likes_and_comments",
    data: data
  }
}

export function setCommonChannelData(data){
  return {
    type : "set_common_channel_data",
    data
  }
}
export function updateCommonChannelData(data){
  return {
    type : "update_common_channel_data",
    data
  }
}
export function DeleteConfluenceChannelConfig(id){
  return {
   type:REMOVE_CONFLUENCE_CHANNEL_CONFIG,
  id
  }
}
export function addChannel(channel){
  return{
    type: ADD_CHANNEL,
    channel
  }
}

export function RecentReminders(reminders) {
  return {
    type: RECENT_REMINDERS,
    reminders
  }
}

export function addActionItem(data){
  return (dispatch) => {
    return axios
    .post(`/api/${data.teamsync_id}/${data.teamsync_instance_id}/addActionItem`,data)
    .then((res) => {
      if(res.data.success){
        dispatch(UpdateStandupReport(res.data.report))
      }
      return res;
    }).catch(err => {
      console.error(err);
    })
  }
}

export function deleteActionItem(actionItemId){
  return (dispatch) => {
    return axios
    .delete(`/api/${actionItemId}/deleteActionItem`)
    .then(res => {
      if(res.data.success){
        dispatch(UpdateStandupReport(res.data.report))
      }
      return res;
    }).catch(err => {
      console.error(err);
    })
  }
}

export const createGrouping = (instanceId, data) => {
  return (dispatch) => {
    return axios
      .post(`/api/teamSync/${instanceId}/createGrouping`, data)
      .then((res) => {
        if (res.data.success) {
          // dispatch(updateProgressReport(res.data.progressReport));
          dispatch(UpdateStandupReport(res.data.report))
        }
        return res;
      }).catch(err => {
        console.error(err);
      })
  }
}

export const removeGroupingForDuplicate = (instanceId, data) => {
  return (dispatch) => {
    return axios
      .post(`/api/teamSync/${instanceId}/removeGroupingForDuplicate`,data)
      .then((res) => {
        if(res.data.success){
          // dispatch(updateProgressReport(res.data.progressReport));
          dispatch(UpdateStandupReport(res.data.report))
        }
        return res;
      }).catch(err => {
        console.error(err);
      })
  }
}

export const removeGroupingForMaster = (instanceId,data) => {
  return (dispatch) => {
    return axios
      .post(`/api/teamSync/${instanceId}/removeGroupingForMaster`, data)
      .then((res) => {
        if (res.data.success) {
          // dispatch(updateProgressReport(res.data.progressReport));
          dispatch(UpdateStandupReport(res.data.report))
        }
        return res;
      }).catch(err => {
        console.error(err);
      })
  }
}

export const answerTeamSync = (instanceId, data) => {
  return (dispatch) => {
    return axios
      .post(`/api/teamSync/${instanceId}/progressReport`, data)
      .then((res) => {
        //console.log("res.data in skills_action answerTeamSync ",res.data)
        if(res.data.success){
          dispatch(updateProgressReport(res.data.progressReport));
        }
        return res;
      });
  };
};

export const addNextAnswerTeamsync = (wId,tid, data) => {
  return (dispatch) => {
    return axios
      .post(`/api/${wId}/teamsync/${tid}/earlyresponse`, data)
      .then((res) => {
        //console.log("res.data in skills_action answerTeamSync ",res.data)
        return res.data;
      });
  };
};

export const getEarlyNextTeamsyncAnswer = (wId,tid) => {
  return (dispatch) => {
    return axios
      .get(`/api/${wId}/teamsync/${tid}/earlyresponse`)
      .then((res) => {
        //console.log("res.data in skills_action answerTeamSync ",res.data)
        return res.data;
      });
  };
};

export const updateUserHoliday = (data) => {
  return (dispatch) => {
    return axios
      .put(`/api/teamSync/markOnLeave`, data)
      .then((res) => {
        //console.log("####",res)
        if(res.data.success){
          if(res.data.updatedTeamSyncResponses){
            res.data.updatedTeamSyncResponses.forEach( val=>{
              //console.log("**inside UpdateUserHoliday*********",res.data.updatedTeamSyncResponse)
              //dispatch(updateUserLeave(res.data.updatedTeamSyncResponse));
              //console.log("**inside UpdateUserHoliday*********",val)
              dispatch(updateUserLeave(val));
            })
        }
      }
        return res;
      })
      .catch((err)=>{
        console.log(err,"Error")
      });
  };
};



export function insertWorkspaceMembers(member) {
  return {
    type: ADD_WORKSPACE_MEMBER,
    member
  }
}

export function sendWorkspaceInvite(id, wsName, email) {
  return dispatch => {
    return axios.post('/api/' + id + '/workspace_invite', { email: email, name: wsName })
    .then(res => {
      if (res.data.success) {
        if (res.data.member) {
          dispatch(insertWorkspaceMembers(res.data.member));
        }
        // else {
        //   dispatch(insertWorkspaceInvite(res.data.invite));
        // }
      }
      return res;
    });
  }
}



export const getJiraProjectStatues = (skillId,id) => {
  return dispatch => {
    return axios.get(`/bot/jira/${skillId}/${id}/statuses`)
      .then(res => {
        if (res.data.success) {
          dispatch(getJiraStatuses(res.data.statuses));
        }
        return res;
      })
  }
}

export const getJiraIssuePicker = (wId,query) => {
  return dispatch => {
    return axios.get(`/bot/api/${wId}/getJiraIssuePicker?query=${query}`)
    .then(res => {
      return res
    })
  }
}
export const getJiraIssueLinkBlocks = (wId) => {
  return dispatch => {
    return axios.get(`/bot/api/${wId}/getJiraIssueLinkBlocks`)
    .then(res => {
      return res
    })
  }
}

export const getTaskAssignableUsers = (wId,params) => {
  return axios.get(`/bot/api/${wId}/getTaskAssignableUsers`,params).then(res => res)
}

export const getDateDuckling = (wId,text,tz) => {
  return dispatch => {
    return axios.get(`/bot/api/${wId}/getDateDuckling`,{params:{
      text,
      tz
    }}).then(res => {return res})
  }
}

export const getOAuthAccessTokensForUsers=(wId,oauth_verifier,sessionid)=>{
    
  return dispatch => {
      return axios.get(`/bot/api/${wId}/getOAuthAccessTokensForUsers?oauth_verifier=${oauth_verifier}&sessionid=${sessionid}`).then(res => {
        if (res.data.success) {
          dispatch(setCurrentSkillUser(res.data.skillUser));
        }
        return res;
  
  
      })
    }

}
export const getGuestOAuthAccessTokensForUsers = (wId, oauth_verifier, sessionid) => {

  return dispatch => {
    return axios.get(`/bot/api/${wId}/guest/getOAuthAccessTokensForUsers?oauth_verifier=${oauth_verifier}&sessionid=${sessionid}`).then(res => {
      if (res.data.success) {
       
      }
      return res;


    })
  }

}

export const getAccessTokens=(wId,oauth_verifier,sessionid)=>{
  return dispatch =>{
    return axios.get(`/bot/api/${wId}/generateOAuthAccessTokens?oauth_verifier=${oauth_verifier}&sessionid=${sessionid}`).then(res=>{
if(res.data.success){
  dispatch(setCurrentSkill(res.data.skill));
  res.data.skill.name === 'Jira' && dispatch(updateAssisantSkills(res.data.skill))
}
return res
    })


  }



}

export const updateChannelCommonData = (data,wId) => (dispatch,getStore) => {
  return axios.post(`/bot/api/workspace/${wId}/updateChannelCommonData`,data).then(res => {
    const commonData = getStore().skills.commonChanneldata
    if(res.data.success) commonData.push(res.data.newChannelCommonData)
      dispatch(setCommonChannelData(commonData))
    return res.data
  })
}



// export const getAccessTokens=(wId,oauth_verifier,sessionid)=>{
//   return dispatch =>{
//     return axios.get(`/bot/api/${wId}/generateOAuthAccessTokens?oauth_verifier=${oauth_verifier}&sessionid=${sessionid}`).then(res=>{
// if(res.data.success){
//   dispatch(setCurrentSkill(res.data.skill));
// }
// return res
//     })


//   }



// }

export const addLikeToStandupVer2 = (data) => {
  if (data) data.showPreviousReport = true;
  return dispatch => {
    return axios.put(`/api/${data.workspace_id}/${data.reportid}/addCommentsAndVotes?type=${data.type}`, data).then(res => {
      if (res.data.success) {
        dispatch(UpdateLikesAndComments(res.data.report))
      }
      return res
    })
  }
}
//please vote for modi
export const addLikeToStandup=(data)=>{
    if(data) data.showPreviousReport = true;
    return dispatch =>{
      return axios.put(`/api/${data.workspace_id}/${data.reportid}/addCommentsAndVotes?type=${data.type}`,data).then(res=>{
        if(res.data.success){
          // if (data.showPreviousReport && !report.report.previousInstanceResponse){
          //   report.previousInstanceResponse = res.data.prev
          // }
          dispatch(UpdateStandupReport(res.data.report))
        }
        return res
      })
    }
  }

  export const deleteRetroComment = (commentId) => {
    return dispatch => {
      return axios.delete(`/api/${commentId}/progressComment`).then(res => {
        if(res.data.success){
          dispatch(UpdateStandupReport(res.data.report));
        }
        return res;
      })
    }
  }

  export const channelAdminConfig=(wId,skillId,channelId,data,isGridSharedChannel)=>{

    let link = `/bot/api/${wId}/channelAdminsConfig/${skillId}/channel/${channelId}`
    if(isGridSharedChannel) link += '?isGridSharedChannel=true'
    return dispatch =>{
      // return axios.post(`/bot/api/${wId}/channelAdminsConfig/${skillId}/channel/${channelId}`,data).then(res=>{
      return axios.post(link,data).then(res=>{
        if(res.data.success){
          if(res.data.channelCommonData)
          dispatch(updateCommonChannelData(res.data.channelCommonData));
        }
        return res
      })
    }
  }

  export const userChannelNotifications=(wId,skillId, isGridWorkspace)=>{
    let link = '/bot/api/userChannelNotifications/'+wId+'/'+skillId
    if(isGridWorkspace) link += '?isGridWorkspace=true'

    return dispatch =>{
      // return axios.get('/bot/api/userChannelNotifications/'+wId+'/'+skillId).then(res=>{
      return axios.get(link).then(res=>{
        if(res.data.success){
          dispatch(setCommonChannelData(res.data.commonData));
        }
        return res
      })
    }
  }


  export function enableAndDisableNotificationSubscription(wId,data,subscriptionid,isGridSharedChannel) {

    let link =`/bot/api/${wId}/subscription/${subscriptionid}`
    if(isGridSharedChannel) link += '?isGridSharedChannel=true'
    return dispatch => {
      // return axios.post("/bot/api/workspace/" + wId + "/set_notification_config/" + skill_id, data)
      return axios.put(link, data)
        .then(res => {
          if (res.data.success) {
            //  dispatch(setnotifConfig(res.data));
  
          }
          return res;
        });
    }
  }


  export function getConfluenceSpaces(wId) {
    return dispatch => {
      return axios.get(`/bot/api/${wId}/wiki/spaces`).then(res => {
        if(res.data.success){
          dispatch(setConfluenceSpaces(res.data.spaces));
        }
        return res;
      })
    }
   
  }
  export function getConfluenceChannelConfig(wId,cId) {
    return dispatch => {
      return axios.get(`/bot/api/${wId}/wiki/channelConfig/${cId}`).then(res => {
        if(res.data.success){
          dispatch(setConfluenceChannelConfig(res.data.config));
        }
        return res;
      })
    }
   
  }
  export function addConfluenceChannelConfig(wId,data,addNewOne) {
    return dispatch => {
      return axios.post(`/bot/api/${wId}/wiki/channelConfig`,data).then(res => {
        if(res.data.success){
          // setConfluenceChannelConfig
          dispatch(setConfluenceChannelConfig(res.data.config));
          if(addNewOne===true&&res.data.success){
            dispatch(addConfluenceChannelConfigtoStore(res.data.config))
          }
        
        }
        return res;
      })
    }
   
  }


  export function getConfluenceChannelConfigs(wId,sendAll,getCount) {
    return dispatch => {
    let query=''
    if(sendAll){
      query=`showAll=true`
    }

    if(getCount) query += `&getCount=true`
      return axios.get(`/bot/api/${wId}/wiki/configPicker?${query}`).then(res => {
        if(res.data.success){
          // setConfluenceChannelConfig
          if(!getCount) dispatch(setConfluenceChannelConfigList(res.data.configs));
        }
        return res;
      })
    }
   
  }


  export function deleteConfluenceChannelConfig(wId,id,skill_id,isGridSharedChannel) {
    return async dispatch => {
      try {
        const query = isGridSharedChannel ? `?isGridSharedChannel=${isGridSharedChannel}`:""
        const deletedinfo = await axios.post(`/bot/api/workspace/${wId}/wiki/${skill_id}/deleteconfluenceconfig/${id}${query}`)
        dispatch(DeleteConfluenceChannelConfig(id))
        return deletedinfo;
      } catch (err) {
       return null
      }
    }
   
  }

export function createNewChannel(wId,name,type) {
  return async dispatch => {
    try {
      let obj = {name}
      if(type) obj.type = type
      const res=await axios.post(`/bot/api/workspace/${wId}/createChannel`,obj)
      if (res.data && res.data.success) {
        if (res.data && res.data.channel && res.data.channel.id) {
          dispatch(addChannel(res.data.channel));
        }
        return res.data
        
   }
return res.data
    } catch (err) {
      return null
    }
  }

}



export const sendUserMappingReminder = (wId,reminderSendId,data) => {
  return dispatch => {
    return axios.post(`/bot/api/${wId}/${reminderSendId}/sendUserMappingReminder`,data).then(res => {
      
return res.data

     })
  }
}

export const getChannelMembersofSlack = (wId, channelId) => {
  return dispatch => {
    return axios.get(`/bot/api/${wId}/${channelId}/getChannelMembers`).then(res => {
  
      return res.data

    })
  }
}

export const getRecentRemindersToUsers = (wId,type) => {
 
  return dispatch => {
    return axios.get(`/bot/api/${wId}/${type}/getRecentReminders`).then(res => {
      if (res.data && res.data.success) {
        dispatch(RecentReminders(res.data.reminders))
}
     

    })
  }
}

export const checkChannelConfigs = (wId,data) => {
  return axios.post(`/bot/api/${wId}/checkChannelConfigs`,data).then(res => res.data)
}

export const dropDownSearchJiraProjects = (id,query) => {
  return dispatch => {

    // return axios.get('/bot/jira/'+id+'/project')
    return axios.get(`/bot/jira/${id}/searchJiraProject${query || ''}`)
      .then(res => {

        if (res.data.success && res.data.projectsData && res.data.projectsData.values) {
          dispatch(addJiraProjectsFromDropdown(res.data.projectsData.values));
        }
        
        return res;
      });
  }
}
