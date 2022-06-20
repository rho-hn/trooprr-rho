import {
  GET_JIRA_CHANNELS,
  GET_JIRA_PROJECTS,
  GET_JIRA_ISSUES,
  SET_DEFAULT_JIRA_PERSONAL_CHANNEL,
  SET_DEFAULT_JIRA_CHANNEL,
  SET_SKILL_DATA,
  PERSONAL_JIRA_SETTING, SET_CURRENT_SKILL_USER,
  GET_JIRA_NOTIFICATION_CONFIGURATION,
  SET_JIRA_NOTIFICATION_CONFIGURATION,
  GET_JIRA_USER_NOTIFICATION_CONFIGURATION,
  SET_JIRA_USER_NOTIFICATION_CONFIGURATION,
  SET_WORKSPACE_ASSISTANT_SKILLS,
  UPDATE_ASSISTANT_SKILLS,
  SET_SLACK_LINK,
  SET_SLACK_CHANNELS,
  GET_CHANNEL_DATA,
  GET_SKILLSET_DATA,
  GET_SKILL,
  EMAIL_SUBSCRIPTION,
  GET_JIRA_BOARDS,
  SET_JIRA_BOARD_SPRINTS,
  SET_CURRENT_SKILL,
  SET_CURRENT_TEAMSYNC,
  DELETE_USER_TEAMSYNC,
  //standups
  SET_USER_TEAMSYNCS,
  SET_USER_TEAMSYNC,
  //standup: show reports
  SET_TEAM_SYNC_INSTANCE,
  PREV_NXT_INSTANCE_NOT_AVAILABLE,
  PREV_INSTANCE_NOT_AVAILABLE,
  NXT_INSTANCE_NOT_AVAILABLE,
  PREV_NXT_INSTANCE_AVAILABLE,
  SET_TEAM_SYNC_INSTANCE_RESPONSE,
  SET_PROJECT_PROGRESS_REPORTS,
  GET_INSTANCE_EMPTY, GET_USERMAPPING_USERS,
  SET_JIRA_USERS,
  SET_LOADING,
  ADD_USER_MAPPING,
  DELETE_USER_MAPPING,
  // GET_INSTANCE_EMPTY,
  //standup:Resume now
  UPDATE_USER_TEAMSYNCS,
  // get all workspace projects
  SET_PROJECTS,
  // To create new projects
  ADD_PROJECT,
  // To get project details
  SET_PROJECT,
  SET_WORKSPACE_MEMBERS,
  ADD_WORKSPACE_MEMBER,
  SET_USER,
  SET_WORKSPACE,
  DELETE_WORKSPACE_MEMBER,
  UPDATE_WORKSPACE_MEMBERSHIP,
  EDIT_USER_MAPPING,
  GET_JIRA_STATUSES,
  UPDATE_TEAMSYNC_INSTANCE_REPORT,

  SET_CONFULENCE_CHANNEL_CONFIG,
  SET_CONFULENCE_SPACES,
  SET_CONFULENCE_CHANNEL_CONFIG_LIST,
  ADD_CONFLUENCE_CHANNEL_CONFIG,
  REMOVE_CONFLUENCE_CHANNEL_CONFIG,
  ADD_CHANNEL,
  RECENT_REMINDERS,
  ADD_JIRA_PROJECTS

}
  from './types';

const initialState = {
  currentSkill: {},
  jiraSprints: [],
  skills: [],
  channels: [],
  // projects: [],
  repository: [],
  issues: [],
  requestTypes:[],
  defaultChannel: '',
  personalSetting: '',
  skillData: {},
  personalChannelDefault: {},
  currentSkillUser: {},
  skill: {},
  channelDefault: {},
  jiraNotifConfig: {},
  setjiraNotifConfig: {},
  jiraUserNotifConfig: {},
  setjiraUserNotifConfig: {},
  slackLinked: '',
  slackChannels: [],
  team: {},
  skillSetData: [],
  skillsData: [],
  emailSubscription: null,
  userData: {},
  gitChannelConfigs: [],
  jiraBoards: [],
  boardStatuses:[],
  getJiraConfigs: [],
  jiraConfigs: [],
  showErrorModal: false,

  //standups
  userTeamSyncs: [],
  recentTeamsyncs: [],
  userTeamSync: {},
  instanceResponses: [],
  userMappingsWithUsers: [],
  JiraUsers: [],
  loading: null,
  changeClassName: false,
  currentteamsync: {},
  members: [],
  project: [],
  projects: [],
  jsd_projects:[],
  allUsers: [],
  user: {},
  workspace: {},
  StandupHistory:{},

  // teamsync analytics
  totalResponses: 0,
  membersResponse: [],
  statuses:[],
  totalMoodResponses:false,
  userMoodTotal:false,
  participation:{},
  moodChart:{},
  responsesGroupedByTeamMoodScore:[],

  commonChanneldata : [],
  confluence_channel_config:{},
  confluence_spaces:[],
  confluence_channel_configs:[],


recent_reminders:[]
};

export default (state = initialState, action = {}) => {

  // console.log("STATE",action)
  switch (action.type) {

    case GET_SKILLSET_DATA:
      return {
        ...state,
        skillSetData: action.skillSetData
      };
    case SET_CURRENT_SKILL:
      return {
        ...state,
        currentSkill: action.skill
      }

    case SET_CURRENT_TEAMSYNC:
      return {
        ...state,
        currentteamsync: action.teamSync
      }

    case GET_SKILL:
      return {
        ...state,
        skillsData: action.skills
      };

    case SET_SLACK_LINK:
      return {
        ...state,
        slackLinked: action.linked
      };

    case GET_CHANNEL_DATA:
      return {
        ...state,
        team: action.channelData
      };

    case SET_SLACK_CHANNELS:
      return {
        ...state,
        slackChannels: action.channels
      };

    case SET_WORKSPACE_ASSISTANT_SKILLS:
      return {
        ...state,
        skills: action.skills
      };
      case UPDATE_ASSISTANT_SKILLS:
        return {
          ...state,
          skills: state.skills.map(skill => {
            if (skill.skill_metadata && skill.skill_metadata._id === action.skill._id) {
              skill.skill_metadata = action.skill
            }
            return skill
          })
        };
    case GET_JIRA_NOTIFICATION_CONFIGURATION:
      return {
        ...state,
        jiraNotifConfig: action.getNotif
      };

    case SET_JIRA_NOTIFICATION_CONFIGURATION:
      return {
        ...state,
        setjiraNotifConfig: action.setNotif
      }

    case GET_JIRA_USER_NOTIFICATION_CONFIGURATION:
      return {
        ...state,
        jiraUserNotifConfig: action.getUserNotif
      };

    case SET_JIRA_USER_NOTIFICATION_CONFIGURATION:
      return {
        ...state,
        setjiraUserNotifConfig: action.setUserNotif
      }

    case GET_JIRA_CHANNELS:
      return {
        ...state,
        channels: action.channels
      };

    case GET_JIRA_PROJECTS:
      return {
        ...state,
        projects: action.jiraprojects
      };
    case ADD_JIRA_PROJECTS:
      const addedProjects = [...action.jiraprojects, ...state.projects].reduce((res, data, index, arr) => {
        if (res.findIndex(project => project.id === data.id) < 0) {
          res.push(data);

        }
        return res;
      }, [])
      return {
        ...state,
        projects:addedProjects
      };
     
    case "GET_JSD_PROJECTS":
      return {
        ...state,
        jsd_projects: action.jiraprojects
      };
      case GET_JIRA_STATUSES:
        return {
          ...state,
          statuses: action.statuses
        };
    case "GET_GITHUB_PROJECTS":
      return {
        ...state,
        repository: action.repositories
      }

    case GET_JIRA_ISSUES:
      return {
        ...state,
        issues: action.jiraissues
      };

      case 'GET_JSD_REQUEST_TYPES':
      return {
        ...state,
        requestTypes: action.jiraissues
      };

    case SET_DEFAULT_JIRA_PERSONAL_CHANNEL:
      let value = {}
      if (action.personal_link_info) {
        value = action.personal_link_info
      }
      return {
        ...state,
        personalChannelDefault: value
      };
    
    case "DELETE_DEFAULT_JIRA_PERSONAL_CHANNEL_LINKING":
      return {
        ...state,
        personalChannelDefault: {}
      }

    case SET_DEFAULT_JIRA_CHANNEL:
      let val2 = {}
      if (action.link_info) {
        val2 = action.link_info
      }
      return {
        ...state,
        channelDefault: val2
      };
    
    case "DELETE_DEFAULT_JIRA_CHANNEL_LINKING":
      return {
        ...state,
        channelDefault: {}
      }

    case PERSONAL_JIRA_SETTING:
      return {
        ...state,
        personalSetting: action.jirasetting
      };

    case SET_SKILL_DATA:
      return {
        ...state,
        skill: action.skill
      };

    case SET_CURRENT_SKILL_USER:
      return {
        ...state,
        currentSkillUser: action.skillUser
      };



    case GET_JIRA_BOARDS:
      return {
        ...state,
        jiraBoards: action.boards
      };

      case "SET_BOARD_STATUSES":
        return {
          ...state,
          boardStatuses: action.statuses
        };
    case SET_JIRA_BOARD_SPRINTS:
      return {
        ...state,
        jiraSprints: action.sprints
      };
    case EMAIL_SUBSCRIPTION:
      return {
        ...state,
        emailSubscription: action.subscription
      }

    case "GET_USER_TOKEN":
      return {
        ...state,
        userData: action.userData
      }


    case "GET_JIRA_CHANNEL_CONFIG":
      return {
        ...state,
        getJiraConfigs: action.jiraChannelConfigs
      }

    case "GET_GIT_CHANNEL_CONFIG":
      return {
        ...state,
        gitChannelConfigs: action.channelConfigs
      }

    case "DELETE_GIT_PROJECT_CONFIG":

      let f = state.gitChannelConfigs.filter(data => {
        if (data && data.projectType) {
          if (data.projectType.id !== action.deletedId.data.id) {
            return data
          }

        } else if (data && data.repository_id.length > 0) {
          if (data.repository_id[0] !== action.deletedId.data.id) {
            return data
          }
        } else {
          return data;
        }
        return false;
      })
      return {
        ...state,
        gitChannelConfigs: f
      }

    case "DELETE_GIT_PROJECT_INPUTS":
      let configs = state.gitChannelConfigs.map(data => {


        if ((data.projectType && data.projectType.id) === action.deletedInput.data.projectType.id) {
          data.status_array = action.deletedInput.data.status_array;
          return data
        } else {
          return data
        }
      })
      // console.log("congigs--->",configs);
      return {
        ...state,
        gitChannelConfigs: configs
      }

    case "DELETE_JIRA_CONFIG":


      let jira = state.getJiraConfigs.filter(data => {
        if (data && data.project_id) {
          if (data.project_id[0] !== action.jiraConfig.data.id) {
            return data;
          }
        }
        return false;
      })
      return {
        ...state,
        getJiraConfigs: jira
      }


    case "SHOW_ERROR_MODAL":
      return {
        ...state,
        showErrorModal: action.showModal
      }

    //standups
    case SET_USER_TEAMSYNCS:
      const sortedTeamSyncs = action.teamSyncs;
      sortedTeamSyncs.sort(function (a, b) {
        return new Date(b.created_at) - new Date(a.created_at);
      });
      return {
        ...state,
        userTeamSyncs: sortedTeamSyncs
      };
    case SET_USER_TEAMSYNC:
      return {
        ...state,
        userTeamSync: action.teamsync
      };

    case "set_recent_teamsyncs":
      return {
        ...state,
        recentTeamsyncs:action.teamsyncs
      }
    // standup:resume now
    case UPDATE_USER_TEAMSYNCS:
      return {
        ...state,
        userTeamSyncs: state.userTeamSyncs.map(ts => {
          if (ts._id === action.teamSync._id) {
            ts = action.teamSync
          }
          return ts
        })
      };

      case "UPDATE_USER_TEAMSYNCS_LIST":
        let temp = state.userTeamSyncs
        temp.unshift(action.teamSync);
        return {
          ...state,
          userTeamSyncs:temp
        };

    case DELETE_USER_TEAMSYNC:
      return {
        ...state,
        userTeamSyncs: state.userTeamSyncs.filter(ts => {
          if (ts._id !== action.id) {
            return ts
          }else {
            return false   
          }

        })
      }
    //standup:show reports
    //       default:
    //         return state;
    case SET_PROJECT_PROGRESS_REPORTS:
      return {
        ...state,
        instanceResponses: action.reports,
        isInstancePresent: true
        // nextInstanceNotAvailable: false
      };

    case "update_progress_report" :
      let userResponseIndex = state.instanceResponses.findIndex(res => res.user_id && res.user_id._id == action.data.user_id._id)
      return {
        ...state,
        instanceResponses:state.instanceResponses.map((resp,index) => index == userResponseIndex ? action.data : resp)
      }

      case "update_user_holiday" :
      let userResponse = state.instanceResponses.findIndex(res => res.user_id._id == action.data.user_id._id)
      //console.log(action.data)
      return {
        ...state,
        //instanceResponses:state.instanceResponses.map((resp,index) => index == userResponse ? action.data : resp)
        instanceResponses:state.instanceResponses.map((resp,index) => (index == userResponse) ? {...resp,isHoliday:action.data.isHoliday, status:"replied", responded_at : new Date()} : resp)
      }

    case PREV_NXT_INSTANCE_NOT_AVAILABLE:
      return {
        ...state,
        nextInstanceNotAvailable: true,
        previousInstanceNotAvailable: true
      };
    case PREV_INSTANCE_NOT_AVAILABLE:
      return {
        ...state,
        previousInstanceNotAvailable: true,
        nextInstanceNotAvailable: false
      };
    case NXT_INSTANCE_NOT_AVAILABLE:
      return {
        ...state,
        nextInstanceNotAvailable: true,
        previousInstanceNotAvailable: false
      };
    case PREV_NXT_INSTANCE_AVAILABLE:
      return {
        ...state,
        nextInstanceNotAvailable: false,
        previousInstanceNotAvailable: false
      };

    case SET_TEAM_SYNC_INSTANCE_RESPONSE:
      return {
        ...state,
        teamSyncResponse: action.response
      };
    case SET_TEAM_SYNC_INSTANCE:
      return {
        ...state,
        projectTeamSyncInstance: action.instance,
        isInstancePresent: true,
        // nextInstanceNotAvailable: false
      };
    case UPDATE_TEAMSYNC_INSTANCE_REPORT:

      return {
        ... state,
        instanceResponses:state.instanceResponses.map(report=>{
          if(report._id==action.report._id){
            return action.report
          }
          return report
        }),
        isInstancePresent:true
      }
    case "update_likes_and_comments":
      return {
        ...state,
        instanceResponses: state.instanceResponses.map(report => {
          if (report._id == action.data._id) {
            return {...report, comment_id: action.data.comment_id, votes: action.data.votes}
          }
          return report
        }),
        isInstancePresent: true
      }
     
    case GET_INSTANCE_EMPTY:
      return {
        ...state,
        isInstancePresent: false
      }
    case GET_USERMAPPING_USERS:
      return {
        ...state,
        userMappingsWithUsers: action.userMappingsWithUsers
      }

    case SET_JIRA_USERS:
      return {
        ...state,
        JiraUsers: action.users
      }
    case SET_LOADING:
      return {
        ...state,
        loading: action.value
      }
    case ADD_USER_MAPPING:
      return {
        ...state,
        userMappingsWithUsers: [...state.userMappingsWithUsers, action.data]
      }
   case DELETE_USER_MAPPING:
    //  console.log("comminggg",state.userMappingsWithUsers,action.id);
     
     return {
       ...state,
       userMappingsWithUsers:state.userMappingsWithUsers.filter(user=>user._id!=action.id)
     }
   case EDIT_USER_MAPPING:
    //  console.log(action.data);
     
     return{
       ...state,
       userMappingsWithUsers:state.userMappingsWithUsers.map((item) => {
        if (item._id !== action.data._id) {
          // This isn't the item we care about - keep it as-is
          return item
        }
    
        // Otherwise, this is the one we want - return an updated value
        return {
          ...action.data
        }
      })
     }

    case "CHANGE_CLASSNAME":
      return {
        ...state,
        changeClassName: action.data
      }

    case 'GET_ALL_USERS':
      return {
        ...state,
        allUsers: action.allUsers
      }

    // get all workspace projects
    case SET_PROJECTS:
      return {
        ...state,
        projects: action.projects
      };

    // To create new project
    case ADD_PROJECT:
      return {
        ...state,
        projects: [action.project, ...state.projects]
      }

    // To get a project details
    case SET_PROJECT:

      return {
        ...state,
        project: action.project,

      };

    // TO get all workspace members
    case SET_WORKSPACE_MEMBERS:
      return {
        ...state,
        members: action.members
      };

    case ADD_WORKSPACE_MEMBER:
      return {
        ...state,
        members: [...state.members, action.member]
      };

    // To update user info
    case SET_USER:
      // if (!state.user._id) {
      //   let name = (action.user.email.replace("@", "_")).replace(".", "_");
      //   ReactGA.initialize('UA-121416513-1', {
      //     // debug:true,
      //     gaOptions: {
      //       userId: name
      //     }
      //   });
      //   ReactGA.pageview(window.location.pathname);
      //   ReactGA.set({ userId: name })

      // }
      return {
        ...state,
        user: action.user
      };

    case SET_WORKSPACE:
      return {
        ...state,
        workspace: action.workspace
      };

    case DELETE_WORKSPACE_MEMBER:
      return {
        ...state,
        members: state.members.filter((member) => (member._id !== action.id))
      };

    case UPDATE_WORKSPACE_MEMBERSHIP:
      return {
        ...state,
        members: state.members.map((membership) => (membership._id === action.membership._id) ? action.membership : membership)

      };

    // teamsync analytics
    case 'SET_WORKSPACE_TEAM_SYNC_DATA':
      const { totalResponses, membersResponse, totalResponded, repliedResponsesCount, totalLikes, totalComments, userMoodTotal, totalMoodResponses, participation, moodChart,responsesGroupedByTeamMoodScore } = action;
      return {
        ...state,
        totalResponses,
        membersResponse,
        totalResponded,
        repliedResponsesCount,
        totalLikes,
        totalComments,
        userMoodTotal,
        totalMoodResponses,
        participation,
        moodChart,
        responsesGroupedByTeamMoodScore

      }

      //standup history
      case 'SET_STANDUP_HISTORY' :
        return {
          ...state,
          standupHistory:action.data
        }

        case 'UPDATE_STANDUP_HISTORY' :
          let finalResponses = state.standupHistory.responses.concat(action.data.responses)
          return {
            ...state,
            standupHistory:{
              ...state.standupHistory,
              startAt:action.data.startAt,
              responses:finalResponses
            }
          }

      case 'set_common_channel_data' :
        return {
          ...state,
          commonChanneldata : action.data
        }

      case 'update_common_channel_data' :
        // console.log("here",action.data)
        let tempArr = [...state.commonChanneldata];
        let find = tempArr.find(cha => cha.channel_id == action.data.channel_id)
        if(find){
          let index = tempArr.findIndex(cha => cha.channel_id == action.data.channel_id);
        // console.log("find",index,find.restrict_channel_config,action.data.restrict_channel_config)
          tempArr.splice(index,1,action.data);
          // console.log("spalice",tempArr[index])
        }else{
          tempArr.push(action.data);
        }
        // console.log("final",tempArr)
        return {
          ...state,
          commonChanneldata:tempArr
        }
        case   SET_CONFULENCE_CHANNEL_CONFIG:

        return {
          ...state,
          confluence_channel_config:action.config

    
        }
        case   SET_CONFULENCE_CHANNEL_CONFIG_LIST:

          return {
            ...state,
            confluence_channel_configs:action.configs
  
      
          }
        case   ADD_CONFLUENCE_CHANNEL_CONFIG:
          let channelConfigs=state.confluence_channel_configs.slice()
       
            const channelConfig=channelConfigs&&channelConfigs.find(el=>(el&&el._id&&el._id.toString())===(action.config&&action.config._id&&action.config._id.toString()))
           if(channelConfig){

           }
           else{

             channelConfigs.push(action.config)
           }
           
return {
  ...state,
  confluence_channel_configs:channelConfigs
}
        case   SET_CONFULENCE_SPACES:
         return {
          ...state,
          confluence_spaces: action.spaces
        };
         case REMOVE_CONFLUENCE_CHANNEL_CONFIG:
          return {
            ...state,
            confluence_channel_configs: state.confluence_channel_configs.filter((item) => ((item&&item.channel&&item.channel.id)!==action.id))
          }
    
    case ADD_CHANNEL:
      let idAlreadyExists = state.channels.find(el => el.id === action.channel.id);
      if (idAlreadyExists) {
        return {
          ...state,
          channels: action.channels
        };
      }
      else {
        return {
          ...state,
          channels: [...state.channels,action.channel]
        };
      }
    case RECENT_REMINDERS:
      return {
        ...state,
        recent_reminders:action.reminders
      }
      
         

    default: return state;
  }

}