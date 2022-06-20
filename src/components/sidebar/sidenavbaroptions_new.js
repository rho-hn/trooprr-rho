import React from "react";

import { Menu, Typography, Layout } from "antd";
import Icon, {
  DashboardOutlined,
  ExperimentOutlined,
  GithubOutlined,
  RocketOutlined,
  SettingOutlined,
  TableOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  PoweroffOutlined,
  MessageOutlined,
  SwapOutlined,
  LockOutlined,
  HomeOutlined,
  ProjectOutlined,
  BulbOutlined,
  QuestionCircleOutlined,
  PieChartOutlined,
  CheckOutlined,
  PlayCircleOutlined
} from "@ant-design/icons";
import { Icon as LegacyIcon } from "@ant-design/compatible";
import getHeaderInfo from "../../utils/skillTabs";
import "./sidebar-new.css";
const { Text } = Typography;

const { SubMenu } = Menu;

const JiraSvg = () => (
  <svg width='1em' height='1em' fill='currentColor' viewBox='0 0 1024 1024'>
    <polygon points='512,0 1024,512 512,1024 0,512' />
  </svg>
);
const JiraIcon = (props) => <Icon component={JiraSvg} {...props} />;

const skillDisplayName = {
  "Jira": "Jira Bot",
  "Check-in": "Check-in",
  "Troopr Projects": "Troopr Projects",
  "GitHub": "GitHub",
  "GitLab": "GitLab",
  // "Wiki": "Wiki (Confluence)"
  "Wiki (Confluence)": "Wiki (Confluence)"
}

const skillIcons = {
  "Jira": <ProjectOutlined />,
  "Check-in": <CheckCircleOutlined />,
  "Troopr Projects": <CheckCircleOutlined />,
  "GitHub": <CheckCircleOutlined />,
  "GitLab": <CheckCircleOutlined />,
  "wiki": <BulbOutlined />,
  "jira_software": <ProjectOutlined />,
  'jira_service_desk': <QuestionCircleOutlined />,
  'jira_reports': <PieChartOutlined />
}

export function profileMenu({ assistant_skills }) {
  return (
    <>
      {helperFunction(assistant_skills)}
    </>
  );
}
export function multiWorkSpaceProfileMenu({ assistant_skills }, data, id, switcherFunc) {
  return (
    <>
      <SubMenu title="Switch Workspace" onClick={switcherFunc}>
        <Menu.ItemGroup style={{overflow:"auto",maxHeight:"80vh"}}>
          {data.map((ws) => (
            <Menu.Item key={ws._id}>
              <Text style={{ marginRight: 16 }}>{ws.name.length > 50 ? `${ws.name.slice(0,47)}...` : ws.name}</Text>
              <CheckOutlined style={ws._id === id ? {} : { visibility: "hidden" }} />
            </Menu.Item>
          ))}
        </Menu.ItemGroup>
      </SubMenu>
      <Menu.Divider />
      {helperFunction(assistant_skills)}
    </>
  );
}
const helperFunction = (assistant_skills) => {
  return (
    <>
      <Menu.Item key='settings'>
        <SettingOutlined style={{ marginRight: '10px' }} />
        Settings
      </Menu.Item>
      {!assistant_skills.workspace.customFeedbackChannel && !assistant_skills.workspace.customFeedbackemail && (
        <Menu.Item key='help'>
          <InfoCircleOutlined style={{ marginRight: '10px' }} />
          Chat With Us
        </Menu.Item>
      )}
      {/*
      <Menu.Item key='help'>
        <InfoCircleOutlined />
        Help
      </Menu.Item>
      */}
      <Menu.Item key='feedback_submit'>
        <MessageOutlined style={{ marginRight: '10px' }} />
        Submit Feedback
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key='logout'>
        <PoweroffOutlined style={{ marginRight: '10px' }} />
        Logout
      </Menu.Item>
    </>
  )
}
const settingsTabStyle = { marginTop: 0, marginBottom: 0 };
export function getMenuItems({

  finalRecentProject,
  workspace,
  skills,
  recentPro,
  projects,
  checkFeaturesVisible,
  teamSyncs,
  user_now,
  recentSquads,
  isAdmin,
  openNewProjectModal,
  parsedQueryString,
  members,
  isOnlyCheckinEnabled,
  jiraSkill,
  toggleSubMenu,
  recentTeamsyncs,
  team,
}) {
    const isHomeTab = true;
    return (
      
      <>
      <div className="menu-scroll">
        <Menu.ItemGroup>        
          {workspace.isSlack && (
          <>
            <Menu.Item key='dashboard' style={{ marginTop: 16 }} className='immediateMenuItems'>
              <HomeOutlined />
              {/* <span className="nav-text">AppHome Reports</span> */}
              <span>{"Home"}</span>
            </Menu.Item>
            <Menu.Item key='getting_started' className='immediateMenuItems'>
              <PlayCircleOutlined />
              <span>{"Getting Started"}</span>
            </Menu.Item>
            <Menu.Item key='metrics' className='immediateMenuItems'>
              <DashboardOutlined />
              {/* <span className="nav-text">AppHome Reports</span> */}
              <span>{"Metrics"}</span>
            </Menu.Item>
            <Menu.Item key='settings' className='immediateMenuItems notLastChild'>
              <SettingOutlined />
              <span>Settings</span>
            </Menu.Item>
            <div style={{ marginBottom: 24 }} />
            {/* {team && team.bot && team.bot.meta.enterprise && team.bot.meta.enterprise.id && (
              <Menu.Item key='grid_metrics' style={{ marginBottom: 24 }} className='immediateMenuItems'>
                <TableOutlined style={{marginRight:'10px'}}/>
                Grid Metrics
              </Menu.Item>
            )} */}

            {/* {(condition to check jira || checkFeaturesVisible("github")) && (
              <Menu.Item key='appHome'>
                <PieChartOutlined />
                <span>Personal Reports</span>
              </Menu.Item>
            )} */}

            {skills.map((skill) => {
              if (skill.skill_metadata && skill.skill_metadata._id && !skill.skill_metadata.disabled) {

                if (skill.skill_metadata.sub_skills && skill.skill_metadata.sub_skills.length > 0) {
                  return skill.skill_metadata.sub_skills.map(sub_skill => {
                    if (!sub_skill.disabled) {
                      const data = getSkillRelatedData({
                        currentpage: `${skill.name}${skill.skill_metadata._id}_${sub_skill.key}:connection`,
                        currentSkill: skill,
                        members,
                        isAdmin,
                        parsedQueryString,
                        user_now,
                        sub_skill
                      });
                      return (
                        <SubMenu
                          key={`${sub_skill.key.toLowerCase()}`}
                          title={
                            <div className='abc submenu-title-wrapper' style={{ height: "32px", lineHeight: "32px" }}>
                              {/* <JiraIcon style={{marginRight:'10px'}}/> */}
                              {/* { skill.name +" Bot"} */}
                              {sub_skill.name}
                            </div>
                          }
                          // icon={skillIcons[skill.name]}
                          icon={skillIcons[sub_skill.key]}
                          onTitleClick={(e) => toggleSubMenu(e, sub_skill, skill)}
                        >
                          {getSkillTabs(data)}
                        </SubMenu>
                      );
                    }
                  })
                }
                else if (skill.key == "standups") {
                  return getCheckInOptions({ teamSyncs, user_now, workspace, isHomeTab, isOnlyCheckinEnabled, toggleSubMenu, recentTeamsyncs, skill,isAdmin })
                } else if (skill.key == "troopr") {

                  return getSquadsOptions({
                    checkFeaturesVisible,
                    recentPro,
                    recentSquads,
                    finalRecentProject,
                    projects,
                    openNewProjectModal,
                    isHomeTab,
                    toggleSubMenu,
                  })

                } else {
                  const data = getSkillRelatedData({
                    currentpage: `${skill.key}${skill.skill_metadata._id}:connection`,
                    currentSkill: skill,
                    members,
                    isAdmin,
                    parsedQueryString,
                    user_now,
                  });
                  return (
                    <SubMenu
                      // key={`${skill.name.toLowerCase()}_inline`}
                      
                      key={`${skill.key.toLowerCase()}_inline`}
                      title={
                        <div className='abc submenu-title-wrapper' style={{ height: "32px", lineHeight: "32px" }}>
                          {/* <JiraIcon style={{marginRight:'10px'}}/> */}
                          {/* { skill.name +" Bot"} */}
                          {/* {skillDisplayName[skill.name]} */}
                          {skill.name}
                        </div>
                      }
                      icon={skillIcons[skill.key]}
                      onTitleClick={(e) => toggleSubMenu(e)}
                    >
                      {getSkillTabs(data)}
                    </SubMenu>
                  );
                }

              }
            })}
        </>
        )
        }        
        <div style={{ marginBottom: 24 }} />
        {workspace.billing_status !== "paid" ? (
          <Menu.Item key='upgrade' className='immediateMenuItems menuItems notLastChild-upgrade'>
            <RocketOutlined />
            <span>Upgrade</span>
          </Menu.Item>
        ) : null}
        </Menu.ItemGroup>
        </div>
      </>
      
    );
}

const getHeader = ({ skill_id, currentSkill, isAdmin, parsedQueryString, user_now, jiraAdminUserData, isWikiTokenThere, sub_skill }) => {
  let info = {};
  if (skill_id) {
    let isJiraConnector = false;
    if (jiraAdminUserData && jiraAdminUserData.user_id && jiraAdminUserData.user_id._id && user_now._id) {
      if (jiraAdminUserData.user_id._id === user_now._id) {
        isJiraConnector = true;
      }
    }

    info = getHeaderInfo(
      currentSkill.key,
      currentSkill.skill_metadata ? currentSkill.skill_metadata.linked : currentSkill.linked,
      null,
      isJiraConnector,
      isAdmin,
      currentSkill.skill_metadata ? currentSkill.skill_metadata : currentSkill,
      sub_skill,
      isWikiTokenThere
    );
    info.defaultTab = parsedQueryString.view;
  } else {
    info = getHeaderInfo("main_page");
    let arr = window.location.pathname.split("/");
    info.defaultTab = arr[arr - 1];
  }
  return info;
};

const getSquadsOptions = ({
  checkFeaturesVisible,
  recentPro,
  projects,
  isHomeTab,
  toggleSubMenu,
}) => {
  //console.info("projects all",projects)
  let Projects = [];
  if (projects && projects.length > 0) {
    Projects = projects.filter((project) => project);
    //
  }
  let recent_project_id = [];
  recentPro.forEach((project) => recent_project_id.push(project._id));
  if (Projects && Projects.length > 0 && recentPro && recentPro.length > 0) {
    Projects.forEach((project, index) => {
      if (project && recent_project_id.includes(project._id)) {
        Projects.splice(index, 1);
        Projects.unshift(project);
      }
    });
  }
  if (Projects && Projects.length > 5) {
    Projects.splice(5);
  }
  Projects.sort(compare);
  return (
    <>
      {checkFeaturesVisible("squads") && (
        <SubMenu
          key='squads'
          title={
            <div className='abc submenu-title-wrapper' style={{ height: "32px", lineHeight: "32px" }}>
              {/* <ExperimentOutlined /> */}
              {isHomeTab ? <ExperimentOutlined /> : <SwapOutlined />}
              <span>{isHomeTab ? "Squads" : "Switch Squads"}</span>
            </div>
          }
          onTitleClick={(e) => toggleSubMenu(e)}
        // style={{overflowY:'auto'}}
        >
          {
            /*recentPro && recentPro.length > 0
            ? (recentSquads(),
              finalRecentProject.map((project, index) => {
                return index < 7 ? (
                  <Menu.Item
                    className='menuItems notLastChild'
                    key={"sqd" + project._id}
                    // onClick={() => this.getProject(project)}
                  >
                    <span className='submenu-title-wrapper'>
                      <span>{project.name.length > 35 ? project.name.substring(0, 35) + "..." : project.name}</span>
                    </span>
                  </Menu.Item>
                ) : (
                  ""
                );
              }))
            : */ Projects.map((project, index) => {
            return index < 5 ? (
              <Menu.Item
                className='menuItems notLastChild'
                key={"sqd" + project._id}
              // onClick={() => this.getProject(project)}
              >
                <span className='submenu-title-wrapper'>
                  <span>{project.name.length > 35 ? project.name.substring(0, 35) + "..." : project.name}</span>
                </span>
              </Menu.Item>
            ) : (
              ""
            );
          })
          }
          <Menu.Divider
            style={{
              opacity: localStorage.getItem("theme") === "default" && 0.2,
            }}
          />
          <Menu.Item key='squads' className='menuItems notLastChild'>
            <span>
              <span>All Squads</span>
            </span>
          </Menu.Item>
          <Menu.Item key='mynotifications' className='menuItems notLastChild'>
            <span>
              <span>My Notifications</span>
            </span>
          </Menu.Item>
          <Menu.Item key='labels' className='menuItems lastChild'>
            <span>
              <span>Labels</span>
            </span>
          </Menu.Item>
          {/*
          <Menu.Item key='newsquad' onClick={() => openNewProjectModal()}>
            <PlusOutlined />
            <span>New Squad</span>
          </Menu.Item>
          */}
        </SubMenu>
      )}
    </>
  );
};
const compare = (a, b) => {
  // Use toUpperCase() to ignore character casing
  const nameA = a.name.toLowerCase();
  const nameB = b.name.toLowerCase();

  let comparison = 0;
  if (nameA > nameB) {
    comparison = 1;
  } else if (nameA < nameB) {
    comparison = -1;
  }
  return comparison;
};
const getCheckInOptions = ({ teamSyncs, user_now, workspace, isHomeTab, isOnlyCheckinEnabled, toggleSubMenu, recentTeamsyncs, isAdmin = false, skill }) => {
  // let TeamSyncs = [];
  // if (teamSyncs && teamSyncs.length > 0) {
  //   TeamSyncs = teamSyncs.filter((val) => val.selectedMembers.includes(user_now._id) || val.selectedMembers.find((mem) => mem._id == user_now._id));
  //   // TeamSyncs = TeamSyncs.splice(0,5)
  //   // // TeamSyncs = TeamSyncs.sort((a,b) => {
  //   // //   console.log(a,b);
  //   // //   if (a.name < b.name) return -1
  //   // //   if (a.name > b.name) return 1
  //   // //   return 0
  //   // // })
  //   // console.log(TeamSyncs);
  // }
  // let recent_teamsync_id=[]
  // recentTeamsyncs.forEach(teamsync=>recent_teamsync_id.push(teamsync._id))
  // if(TeamSyncs && TeamSyncs.length>0 && recentTeamsyncs && recentTeamsyncs.length>0){
  //   TeamSyncs.forEach((teamsync,index)=>{

  //     if(teamsync&& recent_teamsync_id.includes(teamsync._id)){
  //       TeamSyncs.splice(index,1)
  //       TeamSyncs.unshift(teamsync)
  //     }

  //   })
  // }
  // if(TeamSyncs&&TeamSyncs.length>5){
  //   TeamSyncs.splice(5);
  // }
  // TeamSyncs.sort(compare);

  let TeamSyncs = recentTeamsyncs || [];
  TeamSyncs.sort(compare);

  return (
    workspace.isSlack && (
      <SubMenu
        //key={isHomeTab ? (isOnlyCheckinEnabled() ? "standups_inline" : "standups") : "standup_switcher"}
        className='submenu_class'
        key={"standups_inline"}
        title={
          <div className='abc submenu-title-wrapper' style={{ height: "32px", lineHeight: "32px" }}>
            {/* <DeploymentUnitOutlined /> */}
            {isHomeTab ? <CheckCircleOutlined /> : <SwapOutlined />}
            {/* <span>{isHomeTab ? skill.name : "Switch Check-in"}</span> */}
            {<span>{skill.name}</span>}
          </div>
        }
        onTitleClick={(e) => toggleSubMenu(e)}
      >
        {TeamSyncs &&
          TeamSyncs.length > 0 &&
          TeamSyncs.map((teamsync, index) => {

            return (teamsync && index < 5) ? (
              <Menu.Item key={teamsync._id && "ts" + teamsync._id} className='menuItems notLastChild'>
                <span>{teamsync.name && teamsync.name.length > 35 ? teamsync.name.substring(0, 35) + "..." : teamsync.name}</span>
              </Menu.Item>
            ) : (
              ""
            );

          })}
        <Menu.Divider
          style={{
            opacity: localStorage.getItem("theme") === "default" && 0.2,
          }}
        />
        <Menu.Item key='teamsyncs' className='menuItems notLastChild'>
          <span>
            <span>My Check-ins</span>
          </span>
        </Menu.Item>
        <Menu.Item key='global-insights' className='menuItems notLastChild'>
          <span>
            <span>Insights</span>
          </span>
        </Menu.Item>
        <Menu.Item key='planned_absences' className='menuItems notLastChild'>
          <span>
            <span>Planned Absences</span>
          </span>
        </Menu.Item>
        {isAdmin && <Menu.Item key='globalholidays' className='menuItems notLastChild'>
          <span>
            <span>Global Holidays</span>
          </span>
        </Menu.Item>}
        <Menu.Item key='teamsync_integrations' className='menuItems lastChild'>
          <span>
            <span>Integrations</span>
          </span>
        </Menu.Item>
        {/*}
        <Menu.Item key='newStandup'>
          {/* <SlackOutlined /> */}
        {/* <CheckCircleOutlined /> }
          <PlusOutlined />
          <span>New Check-in</span>
        </Menu.Item>
        */}
      </SubMenu>
    )
  );
};

const getSkillRelatedData = ({ currentpage, currentSkill, members, isAdmin, parsedQueryString, user_now, sub_skill }) => {
  let skillName = ''
  if (sub_skill) {
    skillName = sub_skill.key
  } else {
    skillName = currentpage && currentpage.startsWith("Jira") ? "Jira" : currentpage && currentpage.startsWith("GitHub") ? "GitHub" : currentpage.startsWith('wiki') ? 'wiki' : currentSkill.name;
  }
  const jiraAdminId = currentSkill && currentSkill.skill_metadata ? currentSkill.skill_metadata.jiraConnectedId : currentSkill.jiraConnectedId;
  const jiraAdminUserData = members.find((mem) => mem.user_id && mem.user_id._id === jiraAdminId);
  const skill_id = (currentSkill && currentSkill.skill_metadata ? currentSkill.skill_metadata._id : currentSkill._id) || null;
  const isWikiTokenThere = currentSkill && currentSkill.skill_metadata && currentSkill.skill_metadata.metadata && currentSkill.skill_metadata.metadata.token_obj && currentSkill.skill_metadata.metadata.token_obj.userToken;
  const info = skill_id && getHeader({ skill_id, currentSkill, isAdmin, parsedQueryString, user_now, jiraAdminUserData, isWikiTokenThere, sub_skill });

  return { skill_id, info, skillName };
};

const getSkillTabs = ({ skill_id, info, skillName }) => {
  return (
    info.tabArr &&
    info.tabArr.map((item) => {
      //console.log("$$$")
      return item.enable ? (
        <Menu.Item
          key={`${skillName}${skill_id}:${item.key}`}
          className={item.name === "User Mapping" ? "menuItems lastChild" : "menuItems notLastChild"}
        >
          <span>
            <LegacyIcon type={item.icon} />
            <span>{item.name}</span>
          </span>
        </Menu.Item>
      ) : (
        <Menu.Item
          disabled
          key={`${skillName}${skill_id}:${item.key}`}
          className={item.name === "User Mapping" ? "menuItems lastChild" : "menuItems notLastChild"}
        >
          <span>
            {item.locked ? <LockOutlined /> : <LegacyIcon type={item.icon} />}
            <span>{item.name}</span>
          </span>
        </Menu.Item>
      );
    })
  );
};

export const settingsTabs = [
  "profile",
  "theme",
  "absences",
  "upgrade",
  "admin",
  "workspace",
  "trackers",
  "labels",
  "features",
  "feedback",
  "members",
  "notifications",
  "settings",
];
