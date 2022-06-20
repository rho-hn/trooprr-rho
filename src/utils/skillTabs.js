import JiraLogo from './../media/Jira_logo.png';
import GitHubLogo from './../media/Github_logo.png';
import TrooprLogo from '../media/circular_troopr_logo.svg';

export default function getHeaderInfo(type, isLinked, isJiraAdmin, isJiraConnector = false, isWorkspaceAdmin = false,currentSkill_skill_metadata,sub_skill,isWikiTokenThere) {
    // console.log("this is heaser type",isZyngaWorkspace,isJiraAdmin)
    // console.log("isJiraConnector: ", isJiraConnector);

    let headerInfo = {}

    if (type == "main_page") {
        headerInfo = {
            "name": "Assistant Skills",
            "icon": "robot",
            //         tabArr:[
            //           { name:"Skill",
            //             key:"skills",
            //             "icon":"robot"
            //         },
            //     { name:"Workflow Automation",
            //         key:"work_flow",
            //         "icon":"apartment"
            //     },
            //     { name:"Profile",
            //     key:"profile",
            //     icon:"profile"
            // } ]
        }

    } else if (type == "jira") {
        if(currentSkill_skill_metadata && currentSkill_skill_metadata.sub_skills && currentSkill_skill_metadata.sub_skills.length > 0){
            if(sub_skill.key === 'jira_software' || sub_skill.key === 'jira_service_desk'){
                headerInfo = {
                    "name": "Jira",
                    "iconUrl": JiraLogo,
                    tabArr: [{
                        name: "Connection",
                        key: "connection",
                        "icon": "api",
                        enable: true,
                    },
                    {
                        name: "Channel Preferences",
                        key: "channel_preferences",
                        "icon": "number",
                        enable: isLinked,
                    }, {
                        name: "Personal Preferences",
                        key: "personal_preferences",
                        "icon": "user",
                        enable: isLinked,
                    },
                    {
                        name: "User Mapping",
                        key: "user_mappings",
                        "icon": "link",
                        enable: isLinked && ((isJiraConnector || isWorkspaceAdmin))
                    }
                    ]
                }
            } else if (sub_skill.key === 'jira_reports') {
                headerInfo = {
                    "name": "Jira",
                    "iconUrl": JiraLogo,
                    tabArr: [{
                        name: "Connection",
                        key: "connection",
                        "icon": "api",
                        enable: true,
                    },
                    {
                      name: "Personal Reports",
                      key: "appHome",
                      "icon" : "pie-chart",
                    //   enable: isLinked
                    //   enable: currentSkill_skill_metadata && currentSkill_skill_metadata.isJiraReportsDisabled ? false : isLinked,
                    //   locked : currentSkill_skill_metadata && currentSkill_skill_metadata.isJiraReportsDisabled ? true : false
                      enable: isLinked,
                      locked : false
                    },
                    {
                        name: "Channel Reports & Nudges",
                        key: "reports",
                        "icon": "bar-chart",
                        // enable: isLinked,
                        // enable: currentSkill_skill_metadata && currentSkill_skill_metadata.isJiraReportsDisabled ? false : isLinked,
                        // locked : currentSkill_skill_metadata && currentSkill_skill_metadata.isJiraReportsDisabled ? true : false
                        enable: isLinked,
                        locked : false
                    }, 
                    {
                        name: "Personal Preferences",
                        key: "personal_preferences",
                        "icon": "user",
                        enable: isLinked,
                    },
                    {
                        name: "User Mapping",
                        key: "user_mappings",
                        "icon": "link",
                        enable: isLinked && ((isJiraConnector || isWorkspaceAdmin))
                    }
                    ]
                }
            }
        }else {
            headerInfo = {
                "name": "Jira",
                "iconUrl": JiraLogo,
                tabArr: [{
                    name: "Connection",
                    key: "connection",
                    "icon": "api",
                    enable: true,
                },
                // {
                //     name: "Guest",
                //     key: "guest",
                //     "icon": "login",
                //     enable: isLinked,
                // }, 
                {
                    name: "Channel Preferences",
                    key: "channel_preferences",
                    "icon": "number",
                    enable: isLinked,
                }, {
                    name: "Personal Preferences",
                    key: "personal_preferences",
                    "icon": "user",
                    enable: isLinked,
                },
                {
                  name: "Personal Reports",
                  key: "appHome",
                  "icon" : "pie-chart",
                //   enable: isLinked
                  enable: currentSkill_skill_metadata && currentSkill_skill_metadata.isJiraReportsDisabled ? false : isLinked,
                  locked : currentSkill_skill_metadata && currentSkill_skill_metadata.isJiraReportsDisabled ? true : false
                },
                {
                    name: "Channel Reports & Nudges",
                    key: "reports",
                    "icon": "bar-chart",
                    // enable: isLinked,
                    enable: currentSkill_skill_metadata && currentSkill_skill_metadata.isJiraReportsDisabled ? false : isLinked,
                    locked : currentSkill_skill_metadata && currentSkill_skill_metadata.isJiraReportsDisabled ? true : false
                },
                {
                    name: "User Mapping",
                    key: "user_mappings",
                    "icon": "link",
                    enable: isLinked && ((isJiraConnector || isWorkspaceAdmin))
                }
    
    
    
    
                ]
            }
        }
    } else if (type == "GitHub" || type == "Github") {
        headerInfo = {
            "name": "GitHub Integration",
            "iconUrl": GitHubLogo,
            tabArr: [{
                name: "Connection",
                key: "connection",
                "icon": "api",
                enable: true,
            }, {
                name: "Channel Preferences",
                key: "channel_preferences",
                "icon": "number",
                enable: isLinked,
            }, {
                name: "Personal Preferences",
                key: "personal_preferences",
                "icon": "user",
                enable: isLinked,
              },/* {
                name: "Personal Reports",
                key: "appHome",
                "icon": "pie-chart",
                enable: isLinked
              }, */{
                name: "Reports & Nudges",
                key: "reports",
                "icon": "bar-chart",
                enable: isLinked,
            }, {
                name: "Automations",
                key: "automations",
                "icon": "thunderbolt",
                enable: isLinked,
            }
            ]
        }


    } else if (type == 'troopr' || type == "Troopr" || type == "Troopr Projects") {
        headerInfo = {
            "name": "Troopr Projects Skill",
            "iconUrl": TrooprLogo,
            tabArr: [
                // {
                //     name:"Connection",
                //     key:"connection",
                //     "icon":"api"
                // },{
                //     name:"Channel Preferences",
                //     key:"channel_preferences",
                //     "icon":"number"
                // },{
                //     name:"Personal Preferences",
                //     key:"personal_preferences",
                //     "icon":"user"
                // },{
                //     name:"Reports & Nudges",
                //     key:"reports",
                //     "icon":"bar-chart"
                // },
                {
                    name: "Info",
                    key: "info",
                    "icon": "info-circle",
                    enable: true,
                }
            ]
        }
    }

    else if (type == "Troopr Standups" || type == "Standups" || type == "standups" || type == "standup") {
        headerInfo = {
            "name": "Troopr Standup Skill",
            "iconUrl": TrooprLogo,
            tabArr: [
                {
                    name: "My Standups",
                    key: "my_standups",
                    "icon": "unordered-list",
                    enable: true
                },
                {
                    name: "Info",
                    key: "info",
                    "icon": "info-circle",
                    enable: true,
                }
            ]
        }
    }else if (type == "wiki") {
        headerInfo = {
            "name": "Wiki",
            "iconUrl": JiraLogo,
            tabArr: [{
                name: "Connection",
                key: "connection",
                "icon": "api",
                enable: true,
            },
          
            {
                name: "Channel Preferences",
                key: "channel_preferences",
                "icon": "number",
                enable: isWikiTokenThere && isLinked,
            }, 
            {
                name: "Analytics",
                key: "analytics",
                "icon": "number",
                enable: isWikiTokenThere && isLinked,
            }, 
          
          

 




            ]
        }
    }
    // console.log("this is heaser type",headerInfo, type, isLinked)

    return headerInfo
}