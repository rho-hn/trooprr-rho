// import React, { Component, Fragment } from "react";
// import { connect } from "react-redux";
// import { withRouter } from "react-router-dom";
// import { Menu, Divider, Typography, Tooltip } from "antd";
// import Icon, {
//   ApiOutlined,
//   DashboardOutlined,
//   ExperimentOutlined,
//   GithubOutlined,
//   PlusOutlined,
//   RocketOutlined,
//   SettingOutlined,
//   CheckOutlined,
//   TableOutlined,
//   BulbOutlined,
//   CalendarOutlined,
//   CheckCircleOutlined,
//   InfoCircleOutlined,
//   PoweroffOutlined,
//   HistoryOutlined,
//   AppstoreOutlined,
//   IdcardOutlined,
//   NotificationOutlined,
//   FormatPainterOutlined,
//   ProfileOutlined,
//   TagsOutlined,
//   ProjectOutlined,
//   AppstoreAddOutlined,
//   MessageOutlined,
//   TeamOutlined,
//   UserOutlined,
//   RedoOutlined,
//   LeftCircleOutlined,
//   SwapOutlined,
//   PieChartOutlined,
// } from "@ant-design/icons";
// import { Icon as LegacyIcon } from "@ant-design/compatible";
// import getHeaderInfo from "../../utils/skillTabs";

// const { SubMenu } = Menu;
// const { Text, Paragraph } = Typography;
// const JiraSvg = () => (
//   <svg width='1em' height='1em' fill='currentColor' viewBox='0 0 1024 1024'>
//     <polygon points='512,0 1024,512 512,1024 0,512' />
//   </svg>
// );
// const JiraIcon = (props) => <Icon component={JiraSvg} {...props} />;

// export function profileMenu({ assistant_skills }) {
//   return (
//     <>
//       {/* <Menu.Item>
//         <SettingOutlined />
//         Settings
//       </Menu.Item> */}

//       {!assistant_skills.workspace.customFeedbackChannel && !assistant_skills.workspace.customFeedbackemail && (
//         <Menu.Item key='help'>
//           <InfoCircleOutlined />
//           Help
//         </Menu.Item>
//       )}
//       {/*
//       <Menu.Item key='help'>
//         <InfoCircleOutlined />
//         Help
//       </Menu.Item>
//       */}
//       <Menu.Item key='logout'>
//         <PoweroffOutlined />
//         Logout
//       </Menu.Item>
//       <Menu.Item key='settings'>
//         <SettingOutlined />
//         Settings
//       </Menu.Item>
//       <Menu.Item key='feedback_submit'>
//         <MessageOutlined />
//         Submit Feedback
//       </Menu.Item>
//     </>
//   );
// }
// const settingsTabStyle = { marginTop: 0, marginBottom: 0 };
// export function getMenuItems({
//   currentpage,
//   userTeamSync,
//   finalRecentProject,
//   workspace,
//   skills,
//   recentPro,
//   path,
//   projects,
//   checkFeaturesVisible,
//   teamSyncs,
//   user_now,
//   showCalender,
//   recentSquads,
//   isAdmin,
//   project,
//   openNewProjectModal,
//   currentSkill,
//   parsedQueryString,
//   members,
//   isOnlyCheckinEnabled,
//   isOnlyJiraEnabled,
//   jiraSkill
// }) {
//   // console.log("on options", currentpage);
//   if (currentpage && currentpage.startsWith("ts")) {
//     const tsname = userTeamSync.name ? userTeamSync.name : "";
//     return (
//       <>
//         <div style={{ margin: 16 }}>
//           <div
//             style={{
//               color: "white",
//               opacity: 0.6,
//               fontSize: 12,
//               lineHeight: "12px",
//             }}
//           >
//             Check-in
//           </div>
//           <div
//             style={{
//               color: "white",
//               fontSize: 18,
//               lineHeight: "24px",
//               height: 24,
//             }}
//           >
//             <div
//               style={{
//                 color: "white",
//                 fontSize: 18,
//                 lineHeight: "24px",
//               }}
//             >
//               {tsname.length > 15 ? (
//                 <Tooltip placement='top' title={tsname}>
//                   {tsname.substring(0, 15) + "..."}
//                 </Tooltip>
//               ) : (
//                 tsname
//               )}
//             </div>
//           </div>
//         </div>
//         <Menu.Divider style={{ marginBottom: 8, opacity: 0.1 }} />
//         <Menu.Item key={`ts${path}:report`}>
//           <span>
//             <TableOutlined />
//             <span>Reports</span>
//           </span>
//         </Menu.Item>
//         <Menu.Item key={`ts${path}:insights`}>
//           <span>
//             <BulbOutlined />
//             <span>Insights</span>
//           </span>
//         </Menu.Item>
//         <Menu.Item key={`ts${path}:settings`}>
//           <span>
//             <SettingOutlined />
//             <span>Settings</span>
//           </span>
//         </Menu.Item>
//         {userTeamSync && (userTeamSync.standuptype === "retrospective" || userTeamSync.standuptype === "team_mood_standup") && (
//           <Menu.Item key={`ts${path}:actionItems`}>
//             <span>
//               <CheckOutlined />
//               <span>Action Items</span>
//             </span>
//           </Menu.Item>
//         )}
//         {showCalender && (
//           <Menu.Item key={`ts${path}:holiday`}>
//             <span>
//               <CalendarOutlined />
//               <span> Holidays</span>
//             </span>
//           </Menu.Item>
//         )}
//         <Menu.Divider
//           style={{
//             opacity: 0.1,
//           }}
//         />
//         {getCheckInOptions({ teamSyncs, user_now, workspace })}
//       </>
//     );
//   } else if (jiraSkill &&!jiraSkill.skill_metadata.disabled && (currentpage === "teamsyncs" || currentpage === "all_checkins" || currentpage === "templates" || currentpage === "global_insights" || currentpage === "teamsync_integrations")) {
//     return (
//       <>
//         <Menu.Item key='teamsyncs'>
//           <CheckOutlined />
//           <span>All Check-ins</span>
//         </Menu.Item>
//         <Menu.Item key='teamsync_integrations'>
//           <AppstoreAddOutlined />
//           <span>Integrations</span>
//         </Menu.Item>
//         {/* <Menu.Item key='teamsyncs'>
//           <CheckOutlined />
//           <span>My Check-ins</span>
//         </Menu.Item>
//         <Menu.Item key='all_checkins'>
//           <HistoryOutlined />
//           <span>All Check-ins</span>
//         </Menu.Item>
//         <Menu.Item key='templates'>
//           <AppstoreOutlined />
//           <span>Check-in Templates</span>
//         </Menu.Item>
//         <Menu.Item key='global_insights'>
//           <BulbOutlined />
//           <span>Insights</span>
//         </Menu.Item> */}
//       </>
//     );
//   } else if (currentpage === "settings" || settingsTabs.includes(currentpage)) {
//     return (
//       <>
//         <div style={{ margin: "24px 16px" }}>
//           <div
//             style={{
//               color: "white",
//               fontSize: 18,
//               lineHeight: "36px",
//             }}
//           >
//             Settings
//           </div>
//         </div>
//         <Menu.Divider style={{ marginBottom: 8, opacity: 0.1 }} />
//         <Menu.ItemGroup title='Personal'>
//           <Menu.Item key='profile' style={settingsTabStyle}>
//             <IdcardOutlined />
//             <span>My Profile</span>
//           </Menu.Item>
//           {workspace && workspace.isSlack && ("showSquads" in workspace ? workspace.showSquads : true) && (
//             <Menu.Item key='notifications' style={settingsTabStyle}>
//               <NotificationOutlined />
//               <span>My Notifications</span>
//             </Menu.Item>
//           )}
//           <Menu.Item key='theme' style={settingsTabStyle}>
//             <FormatPainterOutlined />
//             <span>Appearance</span>
//           </Menu.Item>
//           <Menu.Item key='absences' style={settingsTabStyle}>
//             <CalendarOutlined />
//             <span>Absences</span>
//           </Menu.Item>
//         </Menu.ItemGroup>
//         <Menu.Divider
//           style={{
//             opacity: 0.1,
//           }}
//         />
//         <Menu.ItemGroup title='Workspace'>
//           {/* {this.state.isAdmin  &&  */}
//           {!(workspace && workspace.is_enterprise) && (
//             <Menu.Item key='upgrade' style={settingsTabStyle}>
//               <RocketOutlined />
//               <span>Billing</span>
//             </Menu.Item>
//           )}
//           {/* } */}
//           {isAdmin && (
//             <Menu.Item key='admin' style={settingsTabStyle}>
//               <UserOutlined />
//               <span>Admin</span>
//             </Menu.Item>
//           )}
//           <Menu.Item key='workspace' style={settingsTabStyle}>
//             <ProfileOutlined />
//             <span>Settings</span>
//           </Menu.Item>
//           {/* {workspace && workspace.isSlack && isAdmin && (
//             <Menu.Item key='trackers' style={settingsTabStyle}>
//               <ProjectOutlined />
//               <span>Tracker</span>
//             </Menu.Item>
//           )} */}
//           {checkFeaturesVisible("squads") && (
//             <Menu.Item key='labels' style={settingsTabStyle}>
//               <TagsOutlined />
//               <span>Labels</span>
//             </Menu.Item>
//           )}
//           {/* {isAdmin && (
//             <Menu.Item key='features' style={settingsTabStyle}>
//               <AppstoreAddOutlined />
//               <span>Features</span>
//             </Menu.Item>
//           )} */}
//           {/* {((workspace && user_now && workspace.created_by === user_now._id) || isAdmin) && (
//             <Menu.Item key='feedback' style={settingsTabStyle}>
//               <MessageOutlined />
//               <span>Feedback</span>
//             </Menu.Item>
//           )} */}
//           {/* {workspace && workspace.isSlack && isAdmin && (
//             <Menu.Item key='members' style={settingsTabStyle}>
//               <TeamOutlined />
//               <span>Members</span>
//             </Menu.Item>
//           )} */}
//         </Menu.ItemGroup>
//       </>
//     );
//   } else if (currentpage && currentpage.startsWith("sqd")) {
//     const sqdname = project.name ? project.name.toUpperCase() : "";
//     return (
//       <>
//         <div style={{ margin: 16 }}>
//           <div
//             style={{
//               color: "white",
//               opacity: 0.6,
//               fontSize: 12,
//               lineHeight: "12px",
//             }}
//           >
//             Squad
//           </div>
//           <div
//             style={{
//               color: "white",
//               fontSize: 18,
//               lineHeight: "24px",
//               height: 24,
//             }}
//           >
//             <div
//               style={{
//                 color: "white",
//                 fontSize: 18,
//                 lineHeight: "24px",
//               }}
//             >
//               {sqdname.length > 15 ? (
//                 <Tooltip placement='top' title={sqdname}>
//                   {sqdname.substring(0, 15) + "..."}
//                 </Tooltip>
//               ) : (
//                 sqdname
//               )}
//             </div>
//           </div>
//         </div>
//         <Menu.Divider style={{ marginBottom: 8, opacity: 0.1 }} />
//         <Menu.Item key={`sqd${path}:active`}>
//           <span>
//             <CheckOutlined />
//             <span>Active</span>
//           </span>
//         </Menu.Item>
//         <Menu.Item key={`sqd${path}:backlog`}>
//           <span>
//             <RedoOutlined />
//             <span>Plan</span>
//           </span>
//         </Menu.Item>
//         <Menu.Item key={`sqd${path}:status`}>
//           <span>
//             <TableOutlined />
//             <span>Status</span>
//           </span>
//         </Menu.Item>
//         {/* <Menu.Item key="report">
//               <span>
//                 <Icon type="bar-chart" />
//                 <span>Reports</span>
//               </span>
//             </Menu.Item> */}
//         {/* <Menu.Item key="members">
//               <span>
//                 <TeamOutlined />
//                 <span>Members</span>
//               </span>
//             </Menu.Item> */}
//         <Menu.Item key={`sqd${path}:settings`}>
//           <span>
//             <SettingOutlined />
//             <span>Settings</span>
//           </span>
//         </Menu.Item>
//         <Menu.Divider
//           style={{
//             opacity: 0.1,
//           }}
//         />
//         {getSquadsOptions({ checkFeaturesVisible, recentPro, recentSquads, finalRecentProject, projects, openNewProjectModal })}
//       </>
//     );
//   } else if ((!isOnlyJiraEnabled() && currentpage && currentpage.startsWith("Jira")) || (currentpage && currentpage.startsWith("GitHub"))) {
//     const data = getSkillRelatedData({currentpage,currentSkill,members,isAdmin,parsedQueryString,user_now})
//       if (data.info)
//         return (
//           <>
//             <div style={{ margin: "24px 16px" }}>
//               <div
//                 style={{
//                   color: "white",
//                   fontSize: 18,
//                   lineHeight: "36px",
//                 }}
//               >
//                 {data.info.name} Bot
//               </div>
//             </div>
//             <Menu.Divider style={{ marginBottom: 8, opacity: 0.1 }} />
//             {getSkillTabs(data)}
//           </>
//         );
//   } else if (currentpage === "squads") {
//     return <>{/* <Menu.Item key='home'>
//           <LeftCircleOutlined />
//           <span>Go Home</span>
//         </Menu.Item> */}</>;
//   } else {
//     const isHomeTab = true;
//     return (
//       <>
//         {workspace.isSlack && (
//           <>
//             <Menu.Item key='dashboard'>
//               <DashboardOutlined />
//               {/* <span className="nav-text">AppHome Reports</span> */}
//               <span>Dashboard</span>
//             </Menu.Item>
//             {/* {(condition to check jira || checkFeaturesVisible("github")) && (
//               <Menu.Item key='appHome'>
//                 <PieChartOutlined />
//                 <span>Personal Reports</span>
//               </Menu.Item>
//             )} */}
//           </>
//         )}
//         {getSquadsOptions({ checkFeaturesVisible, recentPro, recentSquads, finalRecentProject, projects, openNewProjectModal, isHomeTab })}
//         {!workspace.disableCheckins && getCheckInOptions({ teamSyncs, user_now, workspace, isHomeTab, isOnlyCheckinEnabled })}
//         {!checkFeaturesVisible("github")
//           ? workspace.isSlack &&
//             jiraSkill && !jiraSkill.skill_metadata.disabled &&
//             skills.map((value) => {
//               if (value.skill_metadata && value.skill_metadata._id) {
//                 if (value.name == "Jira") {
//                   if(isOnlyJiraEnabled()){
//                     const data = getSkillRelatedData({currentpage:`Jira${value.skill_metadata._id}:connection`,currentSkill:value,members,isAdmin,parsedQueryString,user_now})
//                     return (<SubMenu
//                     key={"jira_inline"}
//                     title={
//                       <span className='submenu-title-wrapper'>
//                         <JiraIcon/>
//                         Jira Bot
//                       </span>
//                     }
//                   >
//                       {getSkillTabs(data)}
//                     </SubMenu>)
//                   }else {
//                     return (
//                       <Menu.Item key={"Jira" + value.skill_metadata._id}>
//                         <JiraIcon />
//                         <span>Jira Bot</span>
//                       </Menu.Item>
//                     );
//                   }
//                 }
//               }
//             })
//           : workspace.isSlack && (
//               <SubMenu
//                 key='integrations'
//                 title={
//                   <span className='submenu-title-wrapper'>
//                     <ApiOutlined />
//                     <span>Integrations</span>
//                   </span>
//                 }
//               >
//                 {skills.map((value) => {
//                   if (value.skill_metadata && value.skill_metadata._id) {
//                     if (value.name == "Jira" && !jiraSkill.skill_metadata.disabled) {
//                       return (
//                         <Menu.Item key={"Jira" + value.skill_metadata._id}>
//                           <JiraIcon />
//                           <span>Jira Bot</span>
//                         </Menu.Item>
//                       );
//                       // zynga check
//                     } else if (value.name == "GitHub") {
//                       return (
//                         <Menu.Item key={"GitHub" + value.skill_metadata._id}>
//                           <GithubOutlined />
//                           <span>GitHub Integration</span>
//                         </Menu.Item>
//                       );
//                     }
//                   }
//                 })}
//               </SubMenu>
//             )}
//         <Menu.Divider
//           style={{
//             //margin-bottom : "16px",
//             //marginLeft: "16px",
//             opacity: localStorage.getItem("theme") === "default" && 0.2,
//             marginBottom: 16,
//           }}
//         />
//         {/* <Menu.Item key='settings'>
//           <SettingOutlined />
//           <span>Settings</span>
//         </Menu.Item> */}
//         {workspace.billing_status !== "paid" ? (
//           <Menu.Item key='upgrade'>
//             <RocketOutlined />
//             <span>Upgrade</span>
//           </Menu.Item>
//         ) : null}
//       </>
//     );
//   }
// }

// const getHeader = ({ skill_id, currentSkill, isAdmin, parsedQueryString, user_now, jiraAdminUserData }) => {
//   let info = {};
//   if (skill_id) {
//     let isJiraConnector = false;
//     if (jiraAdminUserData && jiraAdminUserData.user_id && jiraAdminUserData.user_id._id && user_now._id) {
//       if (jiraAdminUserData.user_id._id === user_now._id) {
//         isJiraConnector = true;
//       }
//     }

//     info = getHeaderInfo(
//       currentSkill.name,
//       currentSkill.skill_metadata ? currentSkill.skill_metadata.linked : currentSkill.linked,
//       null,
//       isJiraConnector,
//       isAdmin
//     );
//     info.defaultTab = parsedQueryString.view;
//   } else {
//     info = getHeaderInfo("main_page");
//     let arr = window.location.pathname.split("/");
//     info.defaultTab = arr[arr - 1];
//   }
//   return info;
// };

// const getSquadsOptions = ({ checkFeaturesVisible, recentPro, recentSquads, finalRecentProject, projects, openNewProjectModal, isHomeTab }) => {
//   // finalRecentProject = finalRecentProject.splice(0,5)
//   // finalRecentProject = finalRecentProject.sort((a,b) => {
//   //   if (a.name.toLowerCase() < b.name.toLowerCase()) return -1
//   //   if (a.name.toLowerCase() > b.name.toLowerCase()) return 1
//   //   return 0
//   // })
//   return (
//     <>
//       {checkFeaturesVisible("squads") && (
//         <SubMenu
//           key='squads'
//           title={
//             <span className='submenu-title-wrapper'>
//               {/* <ExperimentOutlined /> */}
//               {isHomeTab ? <ExperimentOutlined /> : <SwapOutlined />}
//               <span>{isHomeTab ? "Squads (Beta)" : "Switch Squads"}</span>
//             </span>
//           }
//           // style={{overflowY:'auto'}}
//         >
//           {recentPro && recentPro.length > 0
//             ? (recentSquads(),
//               finalRecentProject.map((project, index) => {
//                 return index < 7 ? (
//                   <Menu.Item
//                     key={"sqd" + project._id}
//                     // onClick={() => this.getProject(project)}
//                   >
//                     <span className='submenu-title-wrapper'>
//                       <span>{project.name.length > 35 ? project.name.substring(0, 35) + "..." : project.name}</span>
//                     </span>
//                   </Menu.Item>
//                 ) : (
//                   ""
//                 );
//               }))
//             : projects.map((project, index) => {
//                 return index < 7 ? (
//                   <Menu.Item
//                     key={"sqd" + project._id}
//                     // onClick={() => this.getProject(project)}
//                   >
//                     <span className='submenu-title-wrapper'>
//                       <span>{project.name.length > 35 ? project.name.substring(0, 35) + "..." : project.name}</span>
//                     </span>
//                   </Menu.Item>
//                 ) : (
//                   ""
//                 );
//               })}
//           <Menu.Divider
//             style={{
//               opacity: localStorage.getItem("theme") === "default" && 0.2,
//             }}
//           />
//           <Menu.Item key='squads'>
//             <span>
//               <span>All Squads</span>
//             </span>
//           </Menu.Item>
//           <Menu.Item key='newsquad' onClick={() => openNewProjectModal()}>
//             <PlusOutlined />
//             <span>New Squad</span>
//           </Menu.Item>
//         </SubMenu>
//       )}
//     </>
//   );
// };
// const getCheckInOptions = ({ teamSyncs, user_now, workspace, isHomeTab, isOnlyCheckinEnabled }) => {
//   let TeamSyncs = [];
//   if (teamSyncs && teamSyncs.length > 0) {
//     TeamSyncs = teamSyncs.filter((val) => val.selectedMembers.includes(user_now._id) || val.selectedMembers.find((mem) => mem._id == user_now._id));
//     TeamSyncs = TeamSyncs.splice(0,5)
//     TeamSyncs = TeamSyncs.sort((a,b) => {
//       if (a.name.toLowerCase() < b.name.toLowerCase()) return -1
//       if (a.name.toLowerCase() > b.name.toLowerCase()) return 1
//       return 0
//     })
//     // console.log(TeamSyncs);
//   }

//   return (
//     workspace.isSlack && (
//       <SubMenu
//         key={isHomeTab ? (isOnlyCheckinEnabled() ? "standups_inline" : "standups") : "standup_switcher"}
//         title={
//           <span className='submenu-title-wrapper'>
//             {/* <DeploymentUnitOutlined /> */}
//             {isHomeTab ? <CheckCircleOutlined /> : <SwapOutlined />}
//             <span>{isHomeTab ? "Check-ins" : "Switch Check-ins"}</span>
//           </span>
//         }
//       >
//         {TeamSyncs &&
//           TeamSyncs.length > 0 &&
//           TeamSyncs.map((teamsync, index) => {
//             return index < 5 ? (
//               <Menu.Item key={"ts" + teamsync._id}>
//                 <span>{teamsync.name.length > 35 ? teamsync.name.substring(0, 35) + "..." : teamsync.name}</span>
//               </Menu.Item>
//             ) : (
//               ""
//             );
//           })}
//         <Menu.Divider
//           style={{
//             opacity: localStorage.getItem("theme") === "default" && 0.2,
//           }}
//         />
//         <Menu.Item key='teamsyncs'>
//           <span>
//             <span>All Check-ins</span>
//           </span>
//         </Menu.Item>
//         <Menu.Item key='teamsync_integrations'>
//           <span>
//             <span>Integrations</span>
//           </span>
//         </Menu.Item>
//         <Menu.Item key='newStandup'>
//           {/* <SlackOutlined /> */}
//           {/* <CheckCircleOutlined /> */}
//           <PlusOutlined />
//           <span>New Check-in</span>
//         </Menu.Item>
//       </SubMenu>
//     )
//   );
// };

// const getSkillRelatedData = ({currentpage,currentSkill,members,isAdmin,parsedQueryString,user_now}) => {

//   const skillName = currentpage && currentpage.startsWith("Jira") ? "Jira" : currentpage && currentpage.startsWith("GitHub") ? "GitHub" : "";
//   const jiraAdminId = currentSkill && currentSkill.skill_metadata ? currentSkill.skill_metadata.jiraConnectedId : currentSkill.jiraConnectedId;
//   const jiraAdminUserData = members.find((mem) => mem.user_id._id === jiraAdminId);
//   const skill_id = (currentSkill && currentSkill.skill_metadata ? currentSkill.skill_metadata._id : currentSkill._id )|| null;
//   const info = skill_id && getHeader({ skill_id, currentSkill, isAdmin, parsedQueryString, user_now, jiraAdminUserData });

//   return {skill_id,info,skillName}
// }

// const getSkillTabs = ({skill_id,info,skillName}) => {
//   return (
//     info.tabArr &&
//       info.tabArr.map((item) => {
//         //console.log("$$$")
//         return item.enable ? (
//           <Menu.Item key={`${skillName}${skill_id}:${item.key}`}>
//             <span>
//               <LegacyIcon type={item.icon} />
//               <span>{item.name}</span>
//             </span>
//           </Menu.Item>
//         ) : (
//           <Menu.Item disabled key={`${skillName}${skill_id}:${item.key}`}>
//             <span>
//               <LegacyIcon type={item.icon} />
//               <span>{item.name}</span>
//             </span>
//           </Menu.Item>
//         );
//       })
//   )
// }

// export const settingsTabs = [
//   "profile",
//   "theme",
//   "absences",
//   "upgrade",
//   "admin",
//   "workspace",
//   "trackers",
//   "labels",
//   "features",
//   "feedback",
//   "members",
//   "notifications",
//   "settings"
// ];
