// import React, { Component, Fragment } from "react";
// import { connect } from "react-redux";
// import { withRouter } from "react-router-dom";
// import { setDriftState } from "../../auth/authActions";
// import {
//   AppstoreOutlined,
//   CheckCircleOutlined,
//   SlackOutlined,
//   BarChartOutlined,
//   UserOutlined,
//   InfoCircleOutlined,
//   AlertOutlined,
//   ReloadOutlined,
//   ArrowUpOutlined,
//   ArrowDownOutlined,
// } from "@ant-design/icons";
// import {
//   getUsersSelectedTeamSync,
//   userChannelNotifications,
//   getCurrentSkill,
//   getUserMappingAndUsers,
//   updateWorkspace,
//   getTeamsyncsCount,
//   getJiraConfigurationsCount,
//   getJiraReportsCount,
// } from "../skills_action";
// import { getWorkspaceDashboardChartData } from "./dashboardMetrics";
// import { getWorkspaceActivityLog, getWorkspaceCkecInActivies, getWorkspaceJiraNotificationsLog, getWorkspaceActiveUsers } from "./dashboardMetrics";
// import { Button, Card, Row, Col, PageHeader, Layout, message, Tooltip, Statistic } from "antd";
// import CreateTeamsyncModal from "../troopr_standup/createTeamsyncModal";
// import DashboardChart from "./charts";
// import moment from "moment";
// // import AppHome from "../app_home/appHome";

// const uuidv4 = require("uuid/v4");
// const { Content } = Layout;

// class Dashboard extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       checkinloading: true,
//       allCheckinsCount: 0,
//       myCheckinsCount: 0,
//       newStandupModalVisible: false,
//       jiraAdmin: false,
//       jiraSkill: false,
//       isJiraConnected: false,
//       configuredChannels: [],
//       jiraLoading: true,
//       jiraReportsCount: 0,
//       jiraConfiguredChannelsCount: 0,
//       cardSkills: [],
//       wId: "",

//       // ---- metrics ----

//       // ---- User Activity
//       UserActivityThisMonth: 0,
//       UserActivityLastMonth: 0,
//       UserActivityProgress: 0,
//       UserActivityLastupdated: null,
//       UserActivityLoading: false,

//       // ---- check in submissions
//       CheckInSubmissionsThisMonth: 0,
//       CheckInSubmissionsLastMonth: 0,
//       CheckInSubmissionsLastupdated: null,
//       CheckInSubmissionsLoading: false,
//       activeCheckinsCount: 0,

//       // --- jira notifications
//       JiraNotificatinsThisMonth: 0,
//       JiraNotificatinsLastMonth: 0,
//       JiraNotificatinsProgress: 0,
//       JiraNotificatinsLastupdated: null,
//       JiraNotificatinsLoading: false,

//       // --- active users
//       activeUsers: 0,
//       activeUsersLastupdated: null,
//       activeUsersloading: false,

//       day_by_day_activities: [],
//       activity_categories: [],
//     };
//   }
//   componentDidMount() {
//     const { workspace } = this.props;
//     this.setState({ wId: this.props.match.params.wId });

//     if (this.props.skills.length > 0) {
//       const jiraSkill = this.props.skills.find((skill) => skill.key === "jira");
//       if (jiraSkill) {
//         let isJiraConnected = jiraSkill.skill_metadata.linked;
//         this.setState({ isJiraConnected });
//         const isJiraAdmin = jiraSkill.skill_metadata.jiraConnectedId == this.props.user_now._id;
//         this.setState({ jiraSkill }, () => this.getDashboardJiraConfigurationsCount({ isJiraAdmin }));
//         // this.getChannelDefaultsData(jiraSkill, isJiraAdmin);
//         // this.getUserMappings(jiraSkill.skill_metadata._id);
//       }
//     }

//     this.getDashboardTeamsyncCounts();

//     // const query = "type=app_message&app=Jira";
//     // axios.get("/bot/api/workspace/" + this.props.match.params.wId + "/getCardSkills?" + query).then((res) => {
//     //   if (res.data.success) this.setState({ jiraSkillReportCount: res.data.CardSkills.length, cardSkills: res.data.CardSkills });
//     // });

//     // to handle the first time
//     if (!workspace.dashboardMetrics || (workspace.dashboardMetrics && !workspace.dashboardMetrics.activeCheckinsCount)) {
//       this.getDashBoardMetrix(true);
//     } else if (workspace.dashboardMetrics) {
//       this.setDashboardMetricsToState();
//     }

//     this.getChartData();
//     // axios.get(`/bot/api/enterpriseId/E01F37K78BX/gridWorkspacesActivityLog`)
//     // axios.get(`/bot/api/enterpriseId/E01F37K78BX/gridWorkspaceJiraNotificationsLog`)
//     // axios.get(`/bot/api/enterpriseId/E01F37K78BX/gridWorkspaceActiveUsers`)
//     // axios.get(`/bot/api/enterpriseId/E01F37K78BX/gridWorkspaceCheckInActivities`)
//   }

//   componentDidUpdate(prevProps) {
//     const { skills, workspace } = this.props;
//     const { wId } = this.state;
//     if (skills != prevProps.skills) {
//       const jiraSkill = this.props.skills.find((skill) => skill.key === "jira");
//       if (jiraSkill) {
//         let isJiraConnected = jiraSkill.skill_metadata.linked;
//         this.setState({ isJiraConnected });
//         let isJiraAdmin = jiraSkill.skill_metadata.jiraConnectedId == this.props.user_now._id;
//         this.setState({ jiraSkill }, () => this.getDashboardJiraConfigurationsCount({ isJiraAdmin }));
//         // this.getChannelDefaultsData(jiraSkill, isJiraAdmin);
//         // this.getUserMappings(jiraSkill.skill_metadata._id);
//       }
//     }

//     if (wId != this.props.match.params.wId) {
//       this.setState({ wId: this.props.match.params.wId, checkinloading: true, jiraLoading: true });

//       this.getDashboardTeamsyncCounts();
//       this.getChartData();
//       // const query = "type=app_message&app=Jira";
//       // axios.get("/bot/api/workspace/" + this.props.match.params.wId + "/getCardSkills?" + query).then((res) => {
//       //   if (res.data.success) this.setState({ jiraSkillReportCount: res.data.CardSkills.length, cardSkills: res.data.CardSkills });
//       // });

//       // to handle the first time
//       if (!workspace.dashboardMetrics || (workspace.dashboardMetrics && !workspace.dashboardMetrics.activeCheckinsCount)) {
//         this.getDashBoardMetrix(true);
//       } else if (workspace.dashboardMetrics) {
//         this.setDashboardMetricsToState();
//       }
//     }
//   }

//   getChartData = () => {
//     getWorkspaceDashboardChartData(this.props.match.params.wId).then((res) => {
//       if (res.success) this.setState({ day_by_day_activities: res.data, activity_categories: res.activity_types });
//     });
//   };

//   getDashboardTeamsyncCounts = () => {
//     const { match } = this.props;
//     getTeamsyncsCount(match.params.wId).then((res) => {
//       if (res.success) this.setState({ allCheckinsCount: res.allCheckinsCount, myCheckinsCount: res.myCheckinsCount, checkinloading: false });
//     });
//   };

//   getDashboardJiraConfigurationsCount = ({ isJiraAdmin }) => {
//     const { jiraSkill } = this.state;
//     const { match, team } = this.props;
//     const isGridWorkspace = team && team.bot && team.bot.meta && team.bot.meta.enterprise && team.bot.meta.enterprise.id ? true : false;

//     Promise.all([
//       getJiraConfigurationsCount(match.params.wId, jiraSkill.skill_metadata._id, isGridWorkspace, isJiraAdmin),
//       getJiraReportsCount(match.params.wId),
//     ]).then((data) => {
//       if (data[0].success)
//         this.setState({ jiraConfiguredChannelsCount: data[0].configuredChannelsCount, mappedUsersCount: data[0].mappedUsersCount });
//       if (data[1].success) this.setState({ jiraReportsCount: data[1].jiraReportsCount });
//       if (data[0].success && data[1].success) this.setState({ jiraLoading: false });
//     });
//   };

//   getDashBoardMetrix = (isFirstTime) => {
//     let diff = 11; /* fail safe */
//     if (!isFirstTime) {
//       // ----checking the seconds (we are updating all the four metrics at the same time, so only taking the time from one)
//       const start = moment(this.state.UserActivityLastupdated);
//       const end = moment(Date.now());
//       diff = end.diff(start, "seconds");
//     }
//     /*
//     if(isFirstTime || diff > 9){
//       this.setState({UserActivityLoading:true,CheckInSubmissionsLoading:true,JiraNotificatinsLoading:true,activeUsersloading:true})
//       // -------- metrics ---------
//       Promise.all([
//         // -------- user activity
//         this.userActivity_DashboardMetrics(),
  
//         // ------- Checkin activities
//         this.checkInActivities_DashboardMetrics(),
  
//         // ----- Jira Notifications
//         this.jiraNotifications_DashboardMetrics(),
  
//         // ---- active users
//         this.activeUsers_DasboardMetrics(),
//       ]).then((data) => {
//         this.updateWorkspaceWithMetrics("all");
//       });
//     }
//     */
//     if ((isFirstTime || diff > 9) && this.state.isJiraConnected) {
//       this.setState({ UserActivityLoading: true, CheckInSubmissionsLoading: true, JiraNotificatinsLoading: true, activeUsersloading: true });
//       // -------- metrics ---------
//       Promise.all([
//         // -------- user activity
//         this.userActivity_DashboardMetrics(isFirstTime),

//         // ------- Checkin activities
//         this.checkInActivities_DashboardMetrics(isFirstTime),

//         // ----- Jira Notifications
//         this.jiraNotifications_DashboardMetrics(isFirstTime),

//         // ---- active users
//         this.activeUsers_DasboardMetrics(isFirstTime),
//       ]).then((data) => {
//         this.updateWorkspaceWithMetrics("all");
//       });
//     } else if ((isFirstTime || diff > 9) && !this.state.isJiraConnected) {
//       this.setState({ UserActivityLoading: true, CheckInSubmissionsLoading: true, activeUsersloading: true });
//       // -------- metrics ---------
//       Promise.all([
//         // -------- user activity
//         this.userActivity_DashboardMetrics(isFirstTime),

//         // ------- Checkin activities
//         this.checkInActivities_DashboardMetrics(isFirstTime),

//         // ----- Jira Notifications
//         // this.jiraNotifications_DashboardMetrics(isFirstTime),

//         // ---- active users
//         this.activeUsers_DasboardMetrics(isFirstTime),
//       ]).then((data) => {
//         this.updateWorkspaceWithMetrics("all");
//       });
//     } else {
//       message.warning({ content: `wait for ${10 - diff} seconds` });
//     }
//   };

//   // updateOnDemandhandler = (update) => {
//   //   if(update === 'active_users'){
//   //     this.activeUsers_DasboardMetrics().then(res => this.updateWorkspaceWithMetrics(update))
//   //   }else if(update === 'user_activity'){
//   //     this.userActivity_DashboardMetrics().then(res => this.updateWorkspaceWithMetrics(update))
//   //   }else if(update === 'checkin_submissions'){
//   //     this.checkInActivities_DashboardMetrics().then(res => this.updateWorkspaceWithMetrics(update))
//   //   }else if(update === 'jira_notifications'){
//   //     this.jiraNotifications_DashboardMetrics().then(res => this.updateWorkspaceWithMetrics(update))
//   //   }
//   // }

//   userActivity_DashboardMetrics = (isFirstTime) => {
//     this.setState({ UserActivityLoading: true });
//     return new Promise((resolve, reject) => {
//       this.props.getWorkspaceActivityLog(this.props.match.params.wId).then((res) => {
//         this.setState({ UserActivityLoading: false });
//         if (res.data.success) {
//           !isFirstTime && message.success({ content: "User activities updated", key: "user_activity" });
//           const data = res.data;
//           this.setState(
//             {
//               UserActivityThisMonth: data.ThisMonthActivity,
//               UserActivityLastMonth: data.LastMonthActivity,
//               UserActivityProgress: data.Progress,
//               UserActivityLastupdated: Date.now(),
//             },
//             () => resolve(true)
//           );
//         }
//       });
//     });
//   };

//   checkInActivities_DashboardMetrics = (isFirstTime) => {
//     this.setState({ CheckInSubmissionsLoading: true });
//     return new Promise((resolve, reject) => {
//       this.props.getWorkspaceCkecInActivies(this.props.match.params.wId).then((res) => {
//         this.setState({ CheckInSubmissionsLoading: false });
//         if (res.data.success) {
//           !isFirstTime && message.success({ content: "Check-in submissions updated", key: "check_submission" });
//           const data = res.data;
//           this.setState(
//             {
//               CheckInSubmissionsThisMonth: data.ThisMonthCheckInSubmissions,
//               CheckInSubmissionsLastMonth: data.LastMonthCheckInSubmissions,
//               activeCheckinsCount: data.activeCheckinsCount,
//               CheckInSubmissionsLastupdated: Date.now(),
//             },
//             () => resolve(true)
//           );
//         }
//       });
//     });
//   };

//   jiraNotifications_DashboardMetrics = (isFirstTime) => {
//     this.setState({ JiraNotificatinsLoading: true });
//     return new Promise((resolve, reject) => {
//       this.props.getWorkspaceJiraNotificationsLog(this.props.match.params.wId).then((res) => {
//         this.setState({ JiraNotificatinsLoading: false });
//         if (res.data.success) {
//           !isFirstTime && message.success({ content: "Jira Notifications updated", key: "jira_notifications" });
//           const data = res.data;
//           this.setState(
//             {
//               JiraNotificatinsThisMonth: data.ThisMonthJiraActivity,
//               JiraNotificatinsLastMonth: data.LastMonthJiraActivity,
//               JiraNotificatinsProgress: data.JiraProgress,
//               JiraNotificatinsLastupdated: Date.now(),
//             },
//             () => resolve(true)
//           );
//         }
//       });
//     });
//   };

//   activeUsers_DasboardMetrics = (isFirstTime) => {
//     this.setState({ activeUsersloading: true });
//     return new Promise((resolve, reject) => {
//       this.props.getWorkspaceActiveUsers(this.props.match.params.wId).then((res) => {
//         this.setState({ activeUsersloading: false });
//         if (res.data.success) {
//           !isFirstTime && message.success({ content: "Active Users updated", key: "activie users" });
//           this.setState({ activeUsers: res.data.uniqueArray.length, activeUsersLastupdated: Date.now() }, () => resolve(true));
//         }
//       });
//     });
//   };

//   updateWorkspaceWithMetrics = (update) => {
//     const { updateWorkspace } = this.props;
//     const {
//       UserActivityThisMonth,
//       UserActivityLastMonth,
//       UserActivityProgress,
//       UserActivityLoading,
//       CheckInSubmissionsThisMonth,
//       CheckInSubmissionsLastMonth,
//       JiraNotificatinsThisMonth,
//       JiraNotificatinsLastMonth,
//       JiraNotificatinsProgress,
//       activeUsers,
//       activeCheckinsCount,
//     } = this.state;

//     let data = {};

//     if (update === "all") {
//       data = {
//         dashboardMetrics: {
//           userActivity: {
//             thisMonth: UserActivityThisMonth,
//             lastMonth: UserActivityLastMonth,
//             progress: UserActivityProgress,
//             lastUpdated: Date.now(),
//           },
//           checkInSubmissions: {
//             thisMonth: CheckInSubmissionsThisMonth,
//             lastMonth: CheckInSubmissionsLastMonth,
//             lastUpdated: Date.now(),
//           },
//           jiraNotifications: {
//             thisMonth: JiraNotificatinsThisMonth,
//             lastMonth: JiraNotificatinsLastMonth,
//             progress: JiraNotificatinsProgress,
//             lastUpdated: Date.now(),
//           },
//           activeUsers: {
//             thisMonth: activeUsers,
//             lastUpdated: Date.now(),
//           },
//           activeCheckinsCount,
//         },
//       };
//     }
//     // else if(update === 'active_users'){
//     //   data = {
//     //     [`dashboardMetrics.activeUsers`]: {
//     //       thisMonth: activeUsers,
//     //       lastUpdated: Date.now(),
//     //     },
//     //   };
//     // }
//     // else if (update === 'user_activity'){
//     //   data = {
//     //     [`dashboardMetrics.userActivity`]: {
//     //       thisMonth: UserActivityThisMonth,
//     //       lastMonth: UserActivityLastMonth,
//     //       progress: UserActivityProgress,
//     //       lastUpdated: Date.now(),
//     //     },
//     //   };
//     // }else if (update === 'checkin_submissions') {
//     //   data = {
//     //     [`dashboardMetrics.checkInSubmissions`]: {
//     //       thisMonth: CheckInSubmissionsThisMonth,
//     //       lastMonth: CheckInSubmissionsLastMonth,
//     //       lastUpdated: Date.now(),
//     //     },
//     //   };
//     // }else if(update === 'jira_notifications'){
//     //   data = {
//     //     [`dashboardMetrics.jiraNotifications`]: {
//     //       thisMonth : JiraNotificatinsThisMonth,
//     //       lastMonth : JiraNotificatinsLastMonth,
//     //       progress : JiraNotificatinsProgress,
//     //       lastUpdated : Date.now()
//     //     }
//     //   }
//     // }

//     this.props.updateWorkspace(this.props.match.params.wId, "", data).then((res) => {
//       // if (res.data.success)
//     });
//   };

//   setDashboardMetricsToState = () => {
//     const { workspace } = this.props;
//     const userActivity = workspace.dashboardMetrics.userActivity;
//     const checkInSubmissions = workspace.dashboardMetrics.checkInSubmissions;
//     const jiraNotifications = workspace.dashboardMetrics.jiraNotifications;
//     const activeUsers = workspace.dashboardMetrics.activeUsers;
//     this.setState({
//       UserActivityThisMonth: userActivity.thisMonth,
//       UserActivityLastMonth: userActivity.lastMonth,
//       UserActivityProgress: userActivity.progress,
//       UserActivityLastupdated: userActivity.lastUpdated,
//       CheckInSubmissionsThisMonth: checkInSubmissions.thisMonth,
//       CheckInSubmissionsLastMonth: checkInSubmissions.lastMonth,
//       CheckInSubmissionsLastupdated: checkInSubmissions.lastUpdated,
//       JiraNotificatinsThisMonth: jiraNotifications.thisMonth,
//       JiraNotificatinsLastMonth: jiraNotifications.lastMonth,
//       JiraNotificatinsProgress: jiraNotifications.progress,
//       JiraNotificatinsLastupdated: jiraNotifications.lastUpdated,
//       activeUsers: activeUsers.thisMonth,
//       activeUsersLastupdated: activeUsers.lastUpdated,
//       activeCheckinsCount: workspace.dashboardMetrics.activeCheckinsCount || 0,
//     });
//   };

//   getUserMappings = (skill_id) => {
//     this.props.getUserMappingAndUsers(this.props.match.params.wId, skill_id);
//   };

//   // getChannelDefaultsData = (jiraSkill, isJiraAdmin) => {
//   //   const skill_id = jiraSkill.skill_metadata._id;
//   //   const {team} = this.props
//   //   const isGridWorkspace = team && team.bot && team.bot.meta && team.bot.meta.enterprise && team.bot.meta.enterprise.id ? true : false
//   //   const channelNotifPromise = this.props.userChannelNotifications(this.props.match.params.wId, skill_id,isGridWorkspace);
//   //   let link;
//   //   if (isJiraAdmin) {
//   //     link = `/bot/api/${this.props.match.params.wId}/getUserChannels/${this.props.user_now._id}/skill/${skill_id}?admin=true`;
//   //   } else {
//   //     link = `/bot/api/${this.props.match.params.wId}/getUserChannels/${this.props.user_now._id}/skill/${skill_id}`;
//   //   }
//   //   const userChannelPromise = axios.get(link);

//   //   Promise.all([channelNotifPromise, userChannelPromise]).then((res) => {
//   //     const notifData = res[0].data;
//   //     // console.log("notifData.commonData.length: ", notifData.commonData.length);
//   //     this.setState({ jiraAdminChannelCount: notifData.commonData ? notifData.commonData.length : 0 });
//   //     const userChannelsData = res[1].data;

//   //     if (userChannelsData.success) {
//   //       this.setState({ channels: userChannelsData.channels }, () => this.getConfiguredChannels(true, notifData.commonData));
//   //       if (this.state.jiraAdmin) {
//   //         this.getAdminChannels(userChannelsData.workspaceLinkedChannels, userChannelsData.channels);
//   //       }
//   //     } else this.getConfiguredChannels(false, notifData.commonData);
//   //   });
//   // };

//   // getConfiguredChannels = (isUserChannelAvailable, commonData) => {
//   //   let isJiraAdmin = false;
//   //   let { jiraSkill } = this.state;
//   //   if (
//   //     jiraSkill &&
//   //     jiraSkill.skill_metadata &&
//   //     jiraSkill.skill_metadata.jiraConnectedId &&
//   //     jiraSkill.skill_metadata.jiraConnectedId == this.props.user_now._id
//   //   ) {
//   //     isJiraAdmin = true;
//   //   }

//   //   const { assistant_skills } = this.props;
//   //   const allChannels = assistant_skills.channels;

//   //   let array = commonData;
//   //   const unique_array = [];
//   //   const map = new Map();
//   //   for (const item of array) {
//   //     if (!map.has(item.channel_id)) {
//   //       map.set(item.channel_id, true);
//   //       unique_array.push({
//   //         channel_id: item.channel_id,
//   //       });
//   //     }
//   //   }

//   //   let userConfiguredChannel = [];
//   //   if (isUserChannelAvailable) {
//   //     let channels = [];
//   //     if (isJiraAdmin) channels = [...allChannels];
//   //     else channels = [...this.state.channels];

//   //     unique_array.forEach((cha) => {
//   //       const channelFound = channels.find((channel) => channel.id == cha.channel_id);
//   //       channelFound && userConfiguredChannel.push(cha);
//   //     });
//   //     this.setState({ configuredChannels: userConfiguredChannel });
//   //   } else this.setState({ configuredChannels: unique_array });
//   //   this.setState({ jiraLoading: false });
//   // };

//   handleCheckinLinks = (type) => {
//     const wId = this.props.match.params.wId;
//     this.props.history.push(`/${wId}/teamsyncs/${type}`);
//   };

//   handleJiraLinks = (type) => {
//     const { jiraSkill } = this.state;
//     const wId = this.props.match.params.wId;
//     if (jiraSkill) {
//       if (type === "manage") {
//         jiraSkill && this.props.history.push(`/${wId}/skills/${jiraSkill.skill_metadata._id}`);
//       } else if (type === "personal") {
//         jiraSkill && this.props.history.push(`/${wId}/skills/${jiraSkill.skill_metadata._id}?view=personal_preferences`);
//       } else if (type === "reports") {
//         jiraSkill && this.props.history.push(`/${wId}/skills/${jiraSkill.skill_metadata._id}?view=reports`);
//       } else if (type === "channel_preferences") {
//         jiraSkill && this.props.history.push(`/${wId}/skills/${jiraSkill.skill_metadata._id}?view=channel_preferences`);
//       }
//     }
//   };

//   toggleNewStandupModal = () => {
//     this.setState({ newStandupModalVisible: !this.state.newStandupModalVisible }, () => {
//       !this.state.newStandupModalVisible && setTimeout(() => this.clickChild(), 500);
//     });
//   };

//   openChatWindow = () => {
//     let key = uuidv4();
//     message.loading({ content: "Connecting to Team Troopr...", key, duration: 0 });
//     const { setDriftState } = this.props;
//     // console.log("openChatWindow")
//     window.drift.load(process.env.REACT_APP_TROOPR_DRIFT_BOT_ID);
//     window.drift.on("ready", (api) => {
//       if (window.drift.api) {
//         // console.log("window.drift.api")
//         api.widget.hide();
//         if (!this.props.driftInit) {
//           if (localStorage.token) {
//             let tokenBase64 = localStorage.token.split(".")[1];
//             let tokenBase64_1 = tokenBase64.replace("-", "+").replace("_", "/");
//             let token = JSON.parse(window.atob(tokenBase64_1));
//             window.drift.identify(token.email, {
//               email: token.email,
//               nickname: token.name,
//             });
//             setDriftState(true);
//           }
//         }
//         window.drift.api.openChat();
//         message.success({ content: "Connected to Team Troopr", key, duration: 0.5 });
//       } else {
//         message.error({ content: "We are having some trouble connecting.. pls try again later", key, duration: 2 });
//       }
//     });
//   };

//   getUserCardSkillsCount = () => {
//     let allCardSkills = this.state.cardSkills;
//     let currentUserId = this.props.user_now._id;
//     let userCardSkills = [];

//     if (allCardSkills && allCardSkills.length > 0) {
//       userCardSkills = allCardSkills.filter((cardSkill) => cardSkill.user_id === currentUserId);
//     }

//     return userCardSkills.length > 0 ? userCardSkills.length : 0;
//   };

//   getJiraCard = ({ buttonsizeSmall, buttontypeText, cardSize }) => {
//     const { jiraSkill, jiraLoading, jiraConfiguredChannelsCount, mappedUsersCount, jiraReportsCount } = this.state;
//     return this.state.isJiraConnected && jiraSkill && !jiraSkill.skill_metadata.disabled ? (
//       <Col span={8}>
//         <Card
//           style={{ width: "100%", height: "100%" }}
//           size={cardSize}
//           title='Jira Slack Integration'
//           extra={
//             <Button size={buttonsizeSmall} type='link' onClick={() => this.handleJiraLinks("manage")}>
//               Manage
//             </Button>
//           }
//           loading={jiraLoading}
//         >
//           <Button type={buttontypeText} icon={<SlackOutlined />} onClick={() => this.handleJiraLinks("channel_preferences")}>
//             Channel configurations ({jiraConfiguredChannelsCount})
//           </Button>
//           <br />
//           <Button type={buttontypeText} icon={<BarChartOutlined />} onClick={() => this.handleJiraLinks("reports")}>
//             Scheduled Reports & Nudges ({jiraReportsCount})
//           </Button>
//           <br />
//           <Button type={buttontypeText} icon={<UserOutlined />} onClick={() => this.handleJiraLinks("personal")}>
//             Jira Personal Preferences
//           </Button>
//         </Card>
//       </Col>
//     ) : (
//       <Col span={8}></Col>
//     );
//   };

//   getCheckinCard = ({ cardSize, buttontypeText, myCheckins, buttonsizeSmall }) => {
//     const { checkinloading, allCheckinsCount, myCheckinsCount } = this.state;
//     const { teamSyncs, workspace } = this.props;
//     return !workspace.disableCheckins ? (
//       <Col span={8}>
//         <Card
//           title='Check-ins'
//           extra={
//             <Button size={buttonsizeSmall} type='link' onClick={this.toggleNewStandupModal}>
//               New Check-in
//             </Button>
//           }
//           loading={checkinloading}
//           style={{ width: "100%", height: "100%" }}
//           size={cardSize}
//         >
//           <Button type={buttontypeText} icon={<CheckCircleOutlined />} onClick={() => this.handleCheckinLinks("mycheckins")}>
//             My Check-ins ({myCheckinsCount})
//           </Button>
//           <br />
//           {/* <Button type={buttontypeText} icon={<CheckCircleOutlined />} onClick={() => this.handleCheckinLinks("all")}>
//         All Check-ins ({allCheckinsCount})
//       </Button> 
//           <br />*/}
//           <Button type={buttontypeText} icon={<AppstoreOutlined />} onClick={() => this.handleCheckinLinks("templates")}>
//             Check-in Templates
//           </Button>
//         </Card>
//       </Col>
//     ) : (
//       <Col span={8}></Col>
//     );
//   };

//   getingStartedButtons = () => {
//     const { workspace, skills } = this.props;
//     const buttontypeText = "text";

//     const checkInHelpDocs_button = (
//       <Button type={buttontypeText} href='https://help.troopr.ai' target='_blank' icon={<InfoCircleOutlined />}>
//         Check-ins Help Docs
//       </Button>
//     );

//     const jiraBotHelpDocs_button = (
//       <Button type={buttontypeText} href='https://help.jiraslackintegration.com' target='_blank' icon={<InfoCircleOutlined />}>
//         Jira Bot Help Docs
//       </Button>
//     );

//     // const trooprChangeLog_button = (
//     //   <Button
//     //     type={buttontypeText}
//     //     href='https://www.notion.so/trooprdocs/Troopr-What-s-New-09dbb0b5591844d7a757dbc5ae847f30'
//     //     target='_blank'
//     //     icon={<AlertOutlined />}
//     //   >
//     //     Troopr Change log
//     //   </Button>
//     // );
//     const checkin_whatsNew_button = (
//       <Button type={buttontypeText} href='https://help.troopr.ai/whats-new-in-troopr-check-ins-2021' target='_blank' icon={<AlertOutlined />}>
//         Whats new in Check-ins
//       </Button>
//     );
//     const jiraBot_whatsNew_button = (
//       <Button
//         type={buttontypeText}
//         href='https://help.jiraslackintegration.com/whats-new-in-jira-bot/whats-new-in-jira-bot-2021'
//         target='_blank'
//         icon={<AlertOutlined />}
//       >
//         Whats new in Jira Bot
//       </Button>
//     );

//     let buttons = <></>;
//     const jiraSkill = skills.find((skill) => skill.name === "Jira");
//     if (skills.length > 0) {
//       if (!jiraSkill.skill_metadata.disabled && !workspace.disableCheckins) {
//         buttons = (
//           <>
//             {checkInHelpDocs_button}
//             <br />
//             {jiraBotHelpDocs_button}
//             <br />
//             {checkin_whatsNew_button}
//             <br />
//             {jiraBot_whatsNew_button}
//           </>
//         );
//       } else if (!jiraSkill.skill_metadata.disabled && workspace.disableCheckins) {
//         buttons = (
//           <>
//             {jiraBotHelpDocs_button}
//             <br />
//             {jiraBot_whatsNew_button}
//           </>
//         );
//       } else if (jiraSkill.skill_metadata.disabled && !workspace.disableCheckins) {
//         buttons = (
//           <>
//             {checkInHelpDocs_button}
//             <br />
//             {checkin_whatsNew_button}
//           </>
//         );
//       } else {
//         buttons = (
//           <>
//             {checkInHelpDocs_button}
//             <br />
//             {jiraBotHelpDocs_button}
//             <br />
//             {checkin_whatsNew_button}
//             <br />
//             {jiraBot_whatsNew_button}
//           </>
//         );
//       }
//     }

//     return buttons;

//     // return (
//     //   <>
//     //     {checkInHelpDocs_button}
//     //     <br />
//     //     {jiraBotHelpDocs_button}
//     //     <br />
//     //   </>
//     // );
//   };

//   render() {
//     const { user_name, teamSyncs, usermappings, members, workspace } = this.props;
//     const {
//       newStandupModalVisible,
//       UserActivityLoading,
//       UserActivityThisMonth,
//       UserActivityLastMonth,
//       UserActivityProgress,
//       UserActivityLastupdated,
//       CheckInSubmissionsLoading,
//       CheckInSubmissionsThisMonth,
//       CheckInSubmissionsLastMonth,
//       CheckInSubmissionsLastupdated,
//       JiraNotificatinsLoading,
//       JiraNotificatinsThisMonth,
//       JiraNotificatinsLastMonth,
//       JiraNotificatinsProgress,
//       JiraNotificatinsLastupdated,
//       activeUsersloading,
//       activeUsers,
//       activeUsersLastupdated,
//       mappedUsersCount,
//       activeCheckinsCount,
//     } = this.state;

//     const myCheckins = teamSyncs.filter(
//       (teamSync) =>
//         teamSync.selectedMembers.includes(this.props.user_now._id) || (teamSync.admins && teamSync.admins.includes(this.props.user_now._id))
//     );
//     const cardSize = "default";
//     const buttontypeText = "text";
//     const buttonsizeSmall = "small";

//     let isJiraAdmin = false;
//     let { jiraSkill } = this.state;
//     if (
//       jiraSkill &&
//       jiraSkill.skill_metadata &&
//       jiraSkill.skill_metadata.jiraConnectedId &&
//       jiraSkill.skill_metadata.jiraConnectedId == this.props.user_now._id
//     ) {
//       isJiraAdmin = true;
//     }

//     return (
//       <Layout
//         style={{
//           height: "100vh",
//           overflow: "auto",
//           /*paddingLeft:'100px', paddingRight:'100px',*/ marginLeft: 250 /*background: localStorage.getItem("theme") == "default" ? "#ffffff" : "rgba(15,15,15)"*/,
//         }}
//       >
//         <PageHeader
//           title={user_name ? `👋 Hello ${user_name}, welcome to Troopr!` : <div style={{ height: "11vh" }}></div>}
//           // style={{ paddingLeft: 0, paddingRight: 0 }}
//         >
//           <Content style={{ padding: "20px 16px 20px 16px", overflow: "initial" }} />
//           <Row gutter={[16, 16]}>
//             <Col span={8}>
//               <Card
//                 title='Getting Started'
//                 loading={this.props.skills.length > 0 ? false : true}
//                 extra={
//                   !this.props.assistant_skills.workspace.customFeedbackChannel && !this.props.assistant_skills.workspace.customFeedbackemail ? (
//                     <Button size={buttonsizeSmall} type='link' onClick={() => this.openChatWindow()}>
//                       Chat with us
//                     </Button>
//                   ) : (
//                     <></>
//                   )
//                   /*
//                   <Button onClick={() => this.openChatWindow()}>
//                     Chat with us
//                   </Button>
//                   */
//                 }
//                 style={{ width: "100%", height: "100%" }}
//                 size={cardSize}
//               >
//                 {this.getingStartedButtons()}
//               </Card>
//             </Col>
//             {workspace.disableCheckins ? (
//               <>
//                 {this.getJiraCard({ buttonsizeSmall, buttontypeText, cardSize })}
//                 {this.getCheckinCard({ cardSize, buttontypeText, myCheckins, buttonsizeSmall })}
//               </>
//             ) : (
//               <>
//                 {this.getCheckinCard({ cardSize, buttontypeText, myCheckins, buttonsizeSmall })}
//                 {this.getJiraCard({ buttonsizeSmall, buttontypeText, cardSize })}
//               </>
//             )}

//             <Col className='gutter-row' span={4}>
//               <Card
//                 title='Active Users'
//                 size='small'
//                 // bordered={false}
//                 style={{ height: "100%" }}
//                 extra={
//                   <Tooltip title={`Last updated at ${moment(activeUsersLastupdated).format("lll")}. Click to reload.`}>
//                     <Button
//                       size='small'
//                       type='link'
//                       shape='circle'
//                       onClick={() => this.getDashBoardMetrix()}
//                       icon={<ReloadOutlined spin={activeUsersloading} />}
//                     />
//                   </Tooltip>
//                 }
//               >
//                 <Statistic title='30 days' value={activeUsers} />
//               </Card>
//             </Col>
//             <Col className='gutter-row' span={12}>
//               <Card
//                 size='small'
//                 title='User activities'
//                 style={{ height: "100%" }}
//                 // bordered={false}
//                 extra={
//                   <Tooltip title={`Last updated at ${moment(UserActivityLastupdated).format("lll")}. Click to reload.`}>
//                     <Button
//                       size='small'
//                       type='link'
//                       shape='circle'
//                       onClick={() => this.getDashBoardMetrix()}
//                       icon={<ReloadOutlined spin={UserActivityLoading} />}
//                     />
//                   </Tooltip>
//                 }
//               >
//                 <Row gutter={[16, 16]}>
//                   <Col span={8}>
//                     <Statistic
//                       title='30 days'
//                       value={UserActivityThisMonth}
//                       // suffix="/ 30days"
//                     />
//                   </Col>
//                   <Col span={8}>
//                     <Statistic
//                       title='Previous period'
//                       value={UserActivityLastMonth}
//                       // suffix="/ 30days"
//                     />
//                   </Col>
//                   <Col span={8}>
//                     <Statistic
//                       title='Progress'
//                       value={Math.abs(Math.round(UserActivityProgress))}
//                       // precision={2}
//                       valueStyle={{
//                         color: UserActivityProgress > 0 || UserActivityProgress === 0 || UserActivityProgress === null ? "#3f8600" : "red",
//                       }}
//                       prefix={
//                         UserActivityProgress > 0 || UserActivityProgress === 0 || UserActivityProgress === null ? (
//                           <ArrowUpOutlined />
//                         ) : (
//                           <ArrowDownOutlined />
//                         )
//                       }
//                       suffix='%'
//                     />
//                   </Col>
//                 </Row>
//               </Card>
//             </Col>

//             {!workspace.disableCheckins && (
//               <Col className='gutter-row' span={8}>
//                 <Card
//                   style={{ width: "100%", height: "100%" }}
//                   title='Check-in submissions'
//                   size='small'
//                   extra={
//                     <Tooltip title={`Last updated at ${moment(CheckInSubmissionsLastupdated).format("lll")}. Click to reload.`}>
//                       <Button
//                         size='small'
//                         type='link'
//                         shape='circle'
//                         onClick={() => this.getDashBoardMetrix()}
//                         icon={<ReloadOutlined spin={CheckInSubmissionsLoading} />}
//                       />
//                     </Tooltip>
//                   }
//                 >
//                   <Row>
//                     <Col span={12}>
//                       <Statistic title='30 days' value={CheckInSubmissionsThisMonth} />
//                     </Col>
//                     <Col span={12}>
//                       <Statistic title='Previous period' value={CheckInSubmissionsLastMonth} />
//                     </Col>
//                   </Row>
//                 </Card>
//               </Col>
//             )}

//             {this.state.isJiraConnected && jiraSkill && !jiraSkill.skill_metadata.disabled && (
//               <Col className='gutter-row' span={8}>
//                 <Card
//                   style={{ width: "100%", height: "100%" }}
//                   title='Jira verified Users'
//                   size='small'
//                   // extra={
//                   //   <Tooltip title='Last updated 2 days ago. Click to reload.'>
//                   //     <Button size='small' type='link' shape='circle' icon={<ReloadOutlined />} />
//                   //   </Tooltip>
//                   // }
//                 >
//                   <Statistic title='Jira verified Users / All workspace members' value={mappedUsersCount} suffix={`/ ${members.length}`} />
//                 </Card>
//               </Col>
//             )}

//             {this.state.isJiraConnected && jiraSkill && !jiraSkill.skill_metadata.disabled && (
//               <Col className='gutter-row' span={12}>
//                 <Card
//                   style={{ width: "100%" }}
//                   title='Jira Notifications'
//                   size='small'
//                   extra={
//                     <Tooltip title={`Last updated at ${moment(JiraNotificatinsLastupdated).format("lll")}. Click to reload.`}>
//                       <Button
//                         size='small'
//                         type='link'
//                         shape='circle'
//                         onClick={() => this.getDashBoardMetrix()}
//                         icon={<ReloadOutlined spin={JiraNotificatinsLoading} />}
//                       />
//                     </Tooltip>
//                   }
//                 >
//                   <Row gutter={[16, 16]}>
//                     <Col span={8}>
//                       <Statistic
//                         title='30 days'
//                         value={JiraNotificatinsThisMonth}
//                         // suffix="/ 30days"
//                       />
//                     </Col>
//                     <Col span={8}>
//                       <Statistic
//                         title='Previous period'
//                         value={JiraNotificatinsLastMonth}
//                         // suffix="/ 30days"
//                       />
//                     </Col>
//                     <Col span={8}>
//                       <Statistic
//                         title='Progress'
//                         value={Math.abs(Math.round(JiraNotificatinsProgress))}
//                         // precision={2}
//                         valueStyle={{
//                           color:
//                             JiraNotificatinsProgress > 0 || JiraNotificatinsProgress === 0 || JiraNotificatinsProgress === null ? "#3f8600" : "red",
//                         }}
//                         prefix={
//                           JiraNotificatinsProgress > 0 || JiraNotificatinsProgress === 0 || JiraNotificatinsProgress === null ? (
//                             <ArrowUpOutlined />
//                           ) : (
//                             <ArrowDownOutlined />
//                           )
//                         }
//                         suffix='%'
//                       />
//                     </Col>
//                   </Row>
//                 </Card>
//               </Col>
//             )}
//             {!workspace.disableCheckins && (
//               <Col className='gutter-row' span={4}>
//                 <Card
//                   title='Active Check-ins'
//                   size='small'
//                   // bordered={false}
//                   style={{ height: "100%" }}
//                   extra={
//                     <Tooltip title={`Last updated at ${moment(CheckInSubmissionsLastupdated).format("lll")}. Click to reload.`}>
//                       <Button
//                         size='small'
//                         type='link'
//                         shape='circle'
//                         onClick={() => this.getDashBoardMetrix()}
//                         icon={<ReloadOutlined spin={CheckInSubmissionsLoading} />}
//                       />
//                     </Tooltip>
//                   }
//                 >
//                   <Statistic value={activeCheckinsCount} />
//                 </Card>
//               </Col>
//             )}
//             <DashboardChart day_by_day_activities={this.state.day_by_day_activities} activity_categories={this.state.activity_categories} />

//             {/* <Col span={24}>
//               <AppHome jiraSkill={this.state.jiraSkill} />
//             </Col> */}
//           </Row>
//         </PageHeader>

//         <CreateTeamsyncModal
//           newStandupModalVisible={newStandupModalVisible}
//           modalToggle={this.toggleNewStandupModal}
//           // https://stackoverflow.com/questions/37949981/call-child-method-from-parent
//           setClick={(click) => (this.clickChild = click)}

//           //whenever you add something here check in allstandups,standupReport,sidenavbar files too
//         />
//       </Layout>
//     );
//   }
// }

// const mapStateToProps = (state) => ({
//   user_now: state.common_reducer.user,
//   user_name: state.common_reducer.user.displayName || state.common_reducer.user.name,
//   teamSyncs: state.skills.userTeamSyncs,
//   skills: state.skills.skills,
//   assistant_skills: state.skills,
//   cardSkills: state.cards.cardSkills,
//   currentSkill: state.skills.currentSkill,
//   members: state.skills.members,
//   usermappings: state.skills.userMappingsWithUsers,
//   workspace: state.common_reducer.workspace,
//   team: state.skills.team,
// });

// export default withRouter(
//   connect(mapStateToProps, {
//     getUsersSelectedTeamSync,
//     userChannelNotifications,
//     setDriftState,
//     getCurrentSkill,
//     getWorkspaceActivityLog,
//     getWorkspaceCkecInActivies,
//     getWorkspaceJiraNotificationsLog,
//     getUserMappingAndUsers,
//     getWorkspaceActiveUsers,
//     updateWorkspace,
//   })(Dashboard)
// );
