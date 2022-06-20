// import React, { Component, Fragment } from "react";
// import { connect } from "react-redux";
// import { withRouter } from "react-router-dom";
// import { Layout, Menu, Button, Select, message, Typography, Dropdown, Avatar, Tooltip, Alert, Row, Col } from "antd";
// import { profileMenu, getMenuItems, settingsTabs } from "./sidenavbaroptions";
// import SquadCreationModal from "../project/SquadCreationModal";
// import Icon, { CheckOutlined, DownOutlined, ArrowLeftOutlined } from "@ant-design/icons";
// import CreateTeamsyncModal from "../skills/troopr_standup/createTeamsyncModal";
// import { setCurrentUser, setDriftState } from "../auth/authActions";
// import queryString from "query-string";
// import { logout } from "../auth/authActions";
// import {
//   checkSlackLink,
//   emailSubscribe,
//   getEmailSubscription,
//   getAssisantSkills,
//   getWorkspaceMembers,
//   getChannelList,
// } from "../skills/skills_action";
// import { getUserWorkspaces, getWorkspace } from "../common/common_action";
// import { getProject, getProjects, setProject, addProject, getRecentProjects, recentProjects } from "../project/projectActions";
// import { getStatuses } from "../project/tasks/section/sectionActions";
// import { getFutureSprints, getCurrentSprint, getSprintConfig } from "../project/tasks/section/sprintActions";
// import { getTasks, getBacklogTasks } from "../project/tasks/task/taskActions";
// import { getUsersSelectedTeamSync, getUserTeamSync, getProjectTeamSyncInstance } from "../skills/skills_action";
// import FeedbackModal from "./feedbackmodal";
// // import queryString from "query-string";
// import { getMembers } from "../project/projectMembers/projectMembershipActions";
// import axios from "axios";

// // const BillingSvg = () => (
// // <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
// // <path d="M2524.4,4998.8c-59.6-21.1-111.5-86.5-532.6-646.1l-428.8-573l3.8-3678.4l5.8-3676.5l417.3-557.6c228.8-305.7,438.4-576.8,465.3-601.9c61.5-57.7,178.8-73.1,259.6-32.7c38.5,21.1,167.3,173,371.1,446.1c169.2,226.9,317.3,409.6,325,407.6c7.7-3.8,148.1-182.7,311.5-399.9c163.4-217.3,313.4-409.6,336.5-428.8c55.8-51.9,176.9-63.5,250-25c38.5,19.2,173.1,178.8,369.2,438.4c171.1,225,317.3,409.6,326.9,409.6c9.6,0,151.9-180.8,317.3-399.9c165.4-219.2,326.9-417.3,361.5-438.4c75-46.2,205.7-40.4,267.3,13.4c21.1,21.2,173,213.4,336.5,430.7c163.4,217.3,303.8,396.1,311.5,399.9c7.7,1.9,155.7-180.7,324.9-407.6c203.8-273,332.6-424.9,371.1-446.1c80.8-40.4,198.1-25,259.6,32.7c26.9,25,236.5,296.1,465.3,601.9l417.3,557.6V109v3684.1l-417.3,557.6c-228.8,305.7-438.4,576.8-465.3,601.8c-61.5,57.7-178.8,73.1-259.6,32.7c-38.5-21.2-167.3-173.1-371.1-446.1c-169.2-226.9-317.3-409.6-324.9-407.6c-7.7,3.8-148.1,182.7-311.5,399.9c-163.4,217.3-315.4,409.6-336.5,430.7c-61.5,53.8-192.3,59.6-267.3,13.5c-34.6-21.2-196.1-219.2-361.5-438.4c-165.4-219.2-307.6-399.9-317.3-399.9c-9.6,0-151.9,180.8-317.3,399.9c-165.4,219.2-326.9,417.3-361.5,438.4c-75,46.1-205.7,40.4-267.3-13.5c-21.1-21.2-173.1-213.4-336.5-430.7c-163.4-217.3-303.8-396.1-311.5-399.9c-7.7-1.9-155.7,180.8-325,407.6c-190.4,253.8-332.7,424.9-367.3,444.2C2660.9,5012.3,2580.1,5018,2524.4,4998.8z M2930.1,3923.9c176.9-234.6,334.6-425,365.3-442.3c65.4-32.7,151.9-34.6,221.1-3.9c32.7,15.4,175,188.4,367.3,442.3c173.1,230.7,317.3,419.2,323,419.2c5.8,0,150-188.4,323-419.2c317.3-421.1,363.4-465.3,474.9-465.3c111.5,0,157.7,44.2,474.9,465.3c173.1,230.7,317.3,419.2,323,419.2c5.8,0,150-188.4,323-419.2c192.3-253.8,334.6-426.9,367.3-442.3c69.2-30.8,155.7-28.8,221.1,3.9c28.8,15.4,188.4,207.7,365.3,442.3c171.1,228.8,317.3,415.3,324.9,415.3c7.7-1.9,132.7-161.5,278.8-355.7l263.4-355.7V109v-3518.8l-263.4-355.7c-146.1-194.2-271.1-353.8-278.8-355.7c-7.7,0-153.8,186.5-324.9,413.4c-180.8,244.2-332.7,426.9-365.3,442.3c-65.4,34.6-151.9,36.5-221.1,5.8c-32.7-15.4-175-188.4-367.3-442.2c-173.1-230.7-317.3-419.2-323-419.2c-5.8,0-150,188.4-323,419.2c-317.3,421.1-363.4,465.3-474.9,465.3c-111.5,0-157.7-44.2-474.9-465.3c-173.1-230.7-317.3-419.2-323-419.2c-5.8,0-150,188.4-323,419.2c-319.2,423-361.5,465.3-476.9,465.3c-113.4,0-167.3-51.9-480.7-471.1c-171.1-226.9-315.3-413.4-323-413.4c-5.8,1.9-130.8,161.5-275,355.7l-265.3,355.7V109v3518.8l265.3,355.7c144.2,194.2,269.2,353.8,276.9,355.7C2612.8,4339.3,2758.9,4152.7,2930.1,3923.9z"/>
// // <path d="M4831.8,2629.9c0-113.5,0-113.5-61.5-126.9c-190.4-40.4-367.3-182.7-442.2-351.9c-57.7-126.9-42.3-367.3,28.8-488.4c105.8-180.7,280.7-276.9,555.7-305.7c282.7-30.8,344.2-48.1,415.3-123.1c51.9-55.8,61.5-82.7,61.5-155.7c0-76.9-9.6-98.1-67.3-151.9C5170.2,782,4826,787.8,4679.9,934l-73.1,73.1l-136.5-40.4c-75-23.1-140.4-46.2-148.1-53.9c-23.1-23.1,67.3-165.4,155.8-242.3c80.8-73.1,257.7-157.7,325-157.7c23.1,0,28.8-26.9,28.8-115.4V282.1h173.1h173.1v115.4c0,88.5,5.8,115.4,28.8,115.4c67.3,0,244.2,84.6,326.9,157.7c123.1,109.6,182.7,238.4,182.7,401.9c0,171.1-44.2,288.4-146.1,394.2c-115.4,117.3-261.5,178.8-478.8,201.9c-246.1,23.1-300,34.6-367.3,76.9c-105.8,65.4-140.4,234.6-65.4,330.7c128.8,163.4,619.2,153.8,696.1-13.4c11.5-26.9,26.9-50,32.7-50c42.3,0,298,90.4,303.8,107.7c11.5,34.6-113.4,203.8-198,269.2c-44.2,32.7-132.7,75-198.1,94.2l-117.3,36.5v111.5v111.5h-173.1h-173.1V2629.9z"/>
// // <path d="M2880.1-90.9c-26.9-19.2-38.5-57.7-44.2-148.1c-5.8-103.8-1.9-130.8,34.6-175l40.4-53.8h2092h2092l36.5,40.4c53.8,59.6,53.8,296.1,0,336.5C7075.7-50.5,2935.8-50.5,2880.1-90.9z"/>
// // <path d="M2887.8-1119.6c-40.4-32.7-46.1-53.9-46.1-173.1c0-226.9-250-203.8,2163.2-203.8c2413.1,0,2163.2-23.1,2163.2,203.8c0,232.7,240.4,209.6-2163.2,209.6C2993.5-1083.1,2932-1085,2887.8-1119.6z"/>
// // <path d="M2897.4-2136.8c-40.4-26.9-65.4-98.1-65.4-186.5c0-88.4,25-159.6,65.4-186.5c26.9-19.2,4187.9-19.2,4214.8,0c86.5,57.7,86.5,315.4,0,373c-11.5,7.7-959.5,15.4-2107.4,15.4C3856.9-2121.4,2908.9-2129.1,2897.4-2136.8z"/>
// // </svg>
// // );
// // const BillingIcon = props => <Icon component={BillingSvg} {...props} />;

// // import "./navbar.css"

// const uuidv4 = require("uuid/v4");
// const JiraSvg = () => (
//   <svg width='1em' height='1em' fill='currentColor' viewBox='0 0 1024 1024'>
//     <polygon points='512,0 1024,512 512,1024 0,512' />
//   </svg>
// );

// const JiraIcon = (props) => <Icon component={JiraSvg} {...props} />;

// const { Header, Sider, Content } = Layout;
// const { SubMenu } = Menu;
// const { Option } = Select;
// const { Text, Link } = Typography;

// let finalRecentProject = [];

// const jiraDiamondSvg = () => (
//   <svg width='1em' height='1em' fill='currentColor' viewBox='0 0 1024 1024'>
//     <polygon points='512,0 1024,512 512,1024 0,512' />
//   </svg>
// );

// class sidenavbar extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       selectedValue: "1",
//       visible: false,
//       collapsed: false,
//       newProjectModal: false,
//       createProjectLoading: false,
//       projectName: "",
//       wId: "",
//       userWorkspacesLoading: true,
//       // home_currentView: '',
//       newStandupModalVisible: false,
//       isSlackConnected: false,
//       teamSyncs: [],
//       currentpage: this.getCurrentView(),
//       showCalender: false,
//       isAdmin: false,
//       feedback_modal_visible: false,
//       // teamSyncRedirect: false,
//       // teamSyncRedirectUrl : ""
//       // zyngaJiraSkill:false,
//       // jiraSkill:''
//     };
//   }

//   truncTitle = (t) =>
//     t.length > 13 ? (
//       <Tooltip placement='right' title={t}>
//         {" "}
//         {`${t.substring(0, 13)}...`}{" "}
//       </Tooltip>
//     ) : (
//       t
//     );

//   _getInitials(name) {
//     if (!name) return "";

//     let nameArr = name
//       .trim()
//       .replace(/\s+/g, " ") //remove extra spaces
//       .split(" ");

//     if (nameArr.length > 1) return (nameArr[0][0] + nameArr[1][0]).toUpperCase();
//     else return nameArr[0].slice(0, 2).toUpperCase();
//   }

//   switchView = (e) => {
//     let key = e.key ? e.key : e;
//     // console.log("this.props.match.params:"+JSON.stringify(this.props.match.params))
//     let wId = this.props.match.params.wId;
//     // console.log("key:", key);
//     if (key === "teamsyncs") {
//       this.props.history.push(`/${wId}/teamsyncs`);
//     } else if (key === "squads") {
//       this.props.history.push(`/${wId}/squads`);
//     } else if (key && key.length > 0 && key.startsWith("ts")) {
//       const tab = key.split(":")[1];
//       this.showreport(key.split("ts")[1], tab);
//     } else if (key === "settings") {
//       this.props.history.push(`/${wId}/settings`);
//     } else if (key === "help") {
//       this.openChatWindow();
//     } else if (key === "logout") {
//       this.logoutFromApp();
//     } else if (key && key.length > 0 && key.startsWith("sqd")) {
//       // console.log("switching to project:"+key.split('sqd')[1])
//       const tab = key.split(":")[1];
//       this.getProject(key.split("sqd")[1], tab);
//     } else if (key === "newStandup") {
//       this.toggleNewStandupModal();
//       return;
//     }
//     // } else if (key === "appHome") {
//     //   this.props.history.push(`/${wId}/appHome`)
//     // } else if (key.startsWith("Jira")) {
//     else if (key === "newsquad") return;
//     else if (key === "dashboard") {
//       this.props.history.push(`/${wId}/dashboard`);
//     } else if (key && key.length > 0 && key.startsWith("Jira")) {
//       const tab = key.split(":")[1];
//       this.goToSkill(key.split("Jira")[1], tab);
//       // this.props.history.push(`/${wId}/skills/${key.split("Jira")[1]}`);
//     } else if (key && key.length > 0 && key.startsWith("GitHub")) {
//       const tab = key.split(":")[1];
//       this.goToSkill(key.split("GitHub")[1], tab);
//       // this.props.history.push(`/${wId}/skills/${key.split("GitHub")[1]}`);
//     } else if (key === "upgrade") {
//       this.props.history.push(`/${wId}/settings?view=upgrade`);
//     } else if (key === "all_checkins") {
//       this.props.history.push(`/${wId}/teamsyncs/all`);
//     } else if (key === "templates") {
//       this.props.history.push(`/${wId}/teamsyncs/templates`);
//     } else if (key === "global_insights") {
//       this.props.history.push(`/${wId}/teamsyncs/global_insights`);
//     } else if (settingsTabs.includes(key)) {
//       this.props.history.push(`/${wId}/settings?view=${key}`);
//     } else if (key === "appHome") {
//       this.props.history.push(`/${wId}/appHome`);
//     } else if (key === "feedback_submit") {
//       this.toggleFeedbackModal();
//     } else if (key === "home") this.goHome();
//       else if (key === "teamsync_integrations") this.props.history.push(`/${wId}/teamsyncs/integrations`); ;

//     if (typeof key === "string") this.setState({ currentpage: key });
//   };

//   async componentDidMount() {
//     // await getProfileinfo()
//     // console.log("this.props"+JSON.stringify(this.props))
//     this.setState({ userWorkspacesLoading: true });
//     this.props.getUserWorkspaces().then(() => {
//       this.setState({ userWorkspacesLoading: false });
//     });
//     let wId = this.props.match.params.wId;
//     if (wId) {
//       // await this.props.getWorkspace(wId);
//       this.setState({
//         wId,
//         isSlackConnected: this.props.workspace.isSlack,
//       });
//       this.props.checkSlackLink(wId);
//       this.props.getWorkspaceMembers(wId);

//       this.props.getProjects(wId);
//       this.props.getAssisantSkills(wId);
//       this.props.getUsersSelectedTeamSync(wId);

//       this.props.getRecentProjects(wId);

//       this.checkIfWorkspaceAdmin();
//     }
//   }

//   componentDidUpdate(prevProps, prevState) {
//     const { userTeamSync, workspace } = this.props;
//     let wID = localStorage.getItem("userCurrentWorkspaceId");

//     if (wID && this.state.wId !== wID) {
//       let userId = localStorage.getItem("trooprUserId");
//       this.props.checkSlackLink(wID);
//       // this.props.getWorkspace(wID);
//       this.props.getWorkspaceMembers(wID);

//       this.setState({ wId: wID });
//       this.props.getProjects(wID);
//       this.props.getAssisantSkills(wID);
//       // this.props.getUsersSelectedTeamSync(wID);
//     }

//     if (prevProps.userTeamSync != userTeamSync) {
//       const selectedMem = userTeamSync.selectedMembers.map((mem) => mem._id);
//       if (!selectedMem.includes(this.props.user_now._id) && userTeamSync.user_id._id !== this.props.user_now._id)
//         this.setState({ showCalender: false });
//       else this.setState({ showCalender: true });
//     }

//     // to handle sidebar tab change
//     if (this.props.location.pathname !== prevProps.location.pathname) {
//       const currentpage = this.getCurrentView();
//       if (currentpage.startsWith("ts")) this.setState({ currentpage });
//       else if (currentpage.startsWith("sqd")) this.setState({ currentpage });
//       else if (currentpage === "teamsyncs") this.setState({ currentpage });
//       else if (currentpage === "squads") this.setState({ currentpage });
//       else if (currentpage === "dashboard") this.setState({ currentpage });
//       // to handle check-in onboarding
//       else if (currentpage === "templates") this.setState({ currentpage });
//     }

//     // if the page is a 'skill' then we have to wait for the api, so 'getCurrentView' function can find out which skill
//     if (prevProps.skills !== this.props.skills) {
//       let { pathname } = this.props.location;
//       const data = pathname.split("/")[2];
//       if (data === "skills") {
//         const jiraSkill = this.props.skills.find(skill => skill.name === 'Jira')
//         if (this.getCurrentView().startsWith("Jira")) {
//           if (jiraSkill && !jiraSkill.skill_metadata.disabled) this.setState({ currentpage: this.getCurrentView() });
//         } else this.setState({ currentpage: this.getCurrentView() });
//       }
//     }

//     // if(prevProps.teamSyncs != this.props.teamSyncs){
//     //   let teamSyncs =[];
//     //   teamSyncs  = this.props.teamSyncs.filter(val => val.selectedMembers.includes(this.props.user_now._id))
//     //   this.setState({teamSyncs})
//     // }

//     // //for zynga
//     // if(this.props.match.params.wId == '5f84c0d0b038174751d7b805' && JSON.stringify(prevProps.skills) !== JSON.stringify(this.props.skills)){
//     //   let jiraSkill = this.props.skills.find(skill => skill.key == "jira")
//     //   this.setState({zyngaJiraSkill : jiraSkill ? jiraSkill : false})
//     //   // console.log('jiraskill',jiraSkill)
//     //   if(window.location.pathname.split('/')[2] == 'appHome' && this.props.user_now._id && this.props.user_now._id != jiraSkill.skill_metadata.jiraConnectedId){
//     //     this.props.history.push(`/${this.props.match.params.wId}/skills/${jiraSkill.skill_metadata._id}`)
//     //   }
//     // }

//     // if(this.props.skills != prevProps.skills){
//     //   let jiraSkill = this.props.skills.find(skill => skill.key == "jira")
//     //   this.setState({jiraSkill});
//     // }
//   }

//   checkIfWorkspaceAdmin = (wId) => {
//     axios.get(`/api/${wId || this.props.match.params.wId}/isAdmin`).then((res) => {
//       if (res.data.success == true && res.data.isAdmin == true) this.setState({ isAdmin: true });
//       else this.setState({ isAdmin: false });
//     });
//   };

//   onWSSwitcherMenu = ({ key }) => {
//     const { workspace } = this.props;
//     let wId = key;
//     localStorage.setItem("userCurrentWorkspaceId", wId);

//     //  if(workspace && "enableFeatures" in workspace) {
//     //    console.log(workspace.enableFeatures);
//     //     workspace.enableFeatures ? this.props.history.push('/'+wId+'/squads') : this.props.history.push('/'+wId+'/teamsyncs')

//     //  }else this.props.history.push('/'+wId+'/squads')
//     this.props.getWorkspace(wId).then((res) => {
//       if (res.data.success) {
//         // if(res.data.workspace && "showSquads" in res.data.workspace) {
//         //   res.data.workspace.showSquads ? this.props.history.push('/'+wId+'/squads') : this.props.history.push('/'+wId+'/teamsyncs')

//         // }else this.props.history.push('/'+wId+'/squads')

//         this.props.history.push("/" + wId + "/dashboard");
//       }
//     });
//     this.props.getChannelList(wId);
//     this.checkIfWorkspaceAdmin(wId);
//   };

//   recentSquads = () => {
//     let recPro = [];
//     this.props.recentPro.forEach((project) => {
//       if (project.workspace_id._id == this.state.wId) {
//         recPro.push(project);
//       }
//     });
//     finalRecentProject = recPro;
//   };

//   submenu = () => {
//     this.setState({
//       visible: !this.state.visible,
//     });
//   };
//   // sendtoslack = () => {

//   //   const app = localStorage.getItem('app');
//   //   let teamId = localStorage.getItem("teamId");

//   //   let url = (app && teamId)? `https://slack.com/app_redirect?app=${app}&team=${teamId}`:`https://slack.com`
//   //   console.log("url is: "+url+ " opening now..")
//   //   window.open(url, `_blank`);
//   //   window.location.href = url;

//   // }

//   assistantClick = () => {
//     const workspace_id = localStorage.getItem("userCurrentWorkspaceId");
//     this.props.history.push(`/${workspace_id}/skills`);
//   };

//   logoutFromApp = () => {
//     // localStorage.setItem("userCurrentWorkspaceId", "");
//     this.props.logout();
//     // console.log(res)
//     //  this.props.history.push('/troopr/access');
//     window.location.href = "/troopr/access";
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

//   openNewProjectModal = () => {
//     this.setState({
//       newProjectModal: !this.state.newProjectModal,
//       projectName: "",
//     });
//   };
//   closeModal = () => {
//     // console.log("runningg");

//     this.setState({ newProjectModal: false });
//   };
//   getProject = (data, tab) => {
//     const pId = data.split(":")[0];
//     let project = this.props.projects.find((p) => p._id === pId);
//     // this.props.getProject(project._id).then(res => {
//     // })
//     // this.props.getProjects(this.state.wId)
//     this.props.getCurrentSprint(this.state.wId, project._id);
//     this.props.getStatuses(this.state.wId, project._id);
//     this.props.getFutureSprints(this.state.wId, project._id);
//     this.props.getTasks(this.state.wId, project._id);
//     this.props.getBacklogTasks(this.state.wId, project._id);
//     // this.props.getMembers(project._id,this.props.match.params.wId)

//     this.props.setProject(project);
//     this.props.getSprintConfig(this.state.wId, project._id);

//     this.props.recentProjects(project._id, this.state.wId).then((res) => {
//       if (res.data.success) {
//         this.props.getRecentProjects(this.state.wId);
//       }
//     });

//     if (!tab || tab === "active") this.props.history.push(`/${this.state.wId}/squad/${pId}/tasks`);
//     else if (tab) this.props.history.push(`/${this.state.wId}/squad/${pId}/tasks?view=${tab}`);

//     // const filter_value = project.filter_value;
//     // if (filter_value) {
//     //   this.props.history.push("/" + this.state.wId + "/squad/" + project._id + "/tasks" + filter_value);
//     // } else {
//     //   this.props.history.push(`/${this.state.wId}/squad/${project._id}/tasks`);
//     // }
//     // localStorage.setItem("filter_value", filter_value)

//     // console.log("filter value", filter_value)
//   };

//   showreport = (data, tab) => {
//     const tsId = data.split(":")[0];
//     if (!tab) this.props.getUserTeamSync(tsId);
//     // let tsName = this.props.teamSyncs.find((ts) => ts._id === tsId).name;

//     if (!tab || tab === "report") this.props.history.push(`/${this.state.wId}/teamsync/${tsId}`);
//     else if (tab) this.props.history.push(`/${this.state.wId}/teamsync/${tsId}/${tab}`);
//   };

//   goToSkill = (data, tab) => {
//     const skill_id = data.split(":")[0];
//     // this.props.history.push({ search: queryString.stringify({view:tab}) })

//     if (!tab || tab === "connection") this.props.history.push(`/${this.state.wId}/skills/${skill_id}`);
//     else if (tab) this.props.history.push(`/${this.state.wId}/skills/${skill_id}?view=${tab}`);
//     // this.props.history.push(`/${wId}/skills/${key.split("Jira")[1]}`);
//   };

//   goToSlackAppHome = () => {
//     let url = `https://slack.com/app_redirect?app=AE4FF42BA&team=${this.props.assistant.id}&tab=home`;
//     window.open(url);
//     this.setState({ newStandupModalVisible: false });
//   };

//   toggleNewStandupModal = () => {
//     this.setState({ newStandupModalVisible: !this.state.newStandupModalVisible }, () => {
//       !this.state.newStandupModalVisible && setTimeout(() => this.clickChild(), 500);
//     });
//   };

//   getCurrentView = () => {
//     let { search, pathname } = this.props.location;
//     let pathArr = pathname.split("/");
//     let query = queryString.parse(search);
//     let resource = pathArr[2];
//     let cView = "";
//     if (resource === "squad") {
//       cView = "sqd" + pathArr[3];
//     } else if (resource === "teamsync") {
//       // cView = "ts" + query.teamsync_id
//       cView = "ts" + pathArr[3];
//     } else if (resource === "skills") {
//       if (this.props.skills) {
//         let skill = this.props.skills.find((s) => {
//           let id = s.skill_metadata ? s.skill_metadata._id : "";
//           return id === pathArr[3];
//         });
//         cView = skill ? skill.name + pathArr[3] : "";
//         if (cView.startsWith("Jira") || cView.startsWith("GitHub")) {
//           cView += query.view ? `:${query.view}` : ":connection";
//         }
//       }
//     } else if (resource === "teamsyncs") {
//       // cView = pathArr[3] ? (pathArr[3] === "all" ? "all_checkins" : pathArr[3] === "global_insights" ? "global_insights" : pathArr[3] === 'integrations' ? 'teamsync_integrations' : "templates") : resource;
//       cView = pathArr[3] ? (pathArr[3] === "all" || pathArr[3] === "mycheckins" || pathArr[3] === "templates" ? "teamsyncs" : pathArr[3] === "integrations" ?  "teamsync_integrations" : "teamsyncs") : resource;
//     } else if (resource === "settings") {
//       const query = queryString.parse(window.location.search);
//       cView = query.view || "profile";
//     } else {
//       cView = resource;
//     }
//     return cView;
//   };

//   // zyngaAdminCheck = () => {
//   //   const {zyngaJiraSkill} = this.state;
//   //   const {user_now} = this.props;
//   //   const wId = this.props.match.params.wId
//   //   if(wId == '5f84c0d0b038174751d7b805'){
//   //     let allowdasboard = false ;
//   //     if(zyngaJiraSkill && user_now && user_now._id) {
//   //       if(zyngaJiraSkill.skill_metadata.jiraConnectedId == user_now._id){
//   //         allowdasboard = true;
//   //       }
//   //     }
//   //     return allowdasboard
//   //   }else {
//   //     return true;
//   //   }
//   // }

//   // checkSquadsgithubVisisble = () => {
//   //   const {user_now} = this.props;
//   //   const {jiraSkill} = this.state;
//   //   let squadsVisible = false;
//   //   if((this.props.match.params.wId == "5f84c0d0b038174751d7b805" ||
//   //       this.props.match.params.wId == "5da4544577360439548077eb" )
//   //       && jiraSkill && user_now._id){
//   //     if(jiraSkill.skill_metadata.linked ){
//   //       if(jiraSkill.skill_metadata.jiraConnectedId == user_now._id){
//   //         squadsVisible = true;
//   //       }else squadsVisible = false;
//   //     }else squadsVisible = true;
//   //   }else squadsVisible = true;
//   //   return squadsVisible
//   // }

//   checkFeaturesVisible = (feature) => {
//     const { workspace } = this.props;
//     if (feature === "squads") {
//       if (workspace && "showSquads" in workspace) {
//         return workspace.showSquads;
//       } else if (workspace) {
//         return true;
//       }
//     } else {
//       if (workspace && "showGithub" in workspace) {
//         return workspace.showGithub;
//       } else if (workspace) {
//         return true;
//       }
//     }
//   };

//   gotoBilling = () => this.props.history.push(`/${this.props.match.params.wId}/settings?view=upgrade`);

//   getProfileMenu = () => {
//     const { assistant_skills } = this.props;
//     return (
//       <Menu
//         onClick={({ item, key, keyPath, domEvent }) => {
//           domEvent.preventDefault();
//           domEvent.stopPropagation();
//         }}
//         onClick={this.switchView}
//       >
//         {profileMenu({ assistant_skills })}
//       </Menu>
//     );
//   };

//   getMenuItems = () => {
//     const { currentpage, showCalender, isAdmin } = this.state;
//     const { userTeamSync, workspace, skills, recentPro, projects, project, teamSyncs, user_now, currentSkill, members } = this.props;
//     const jiraSkill = skills.find(skill => skill.name === 'Jira')
//     const path = this.props.location.pathname.split("/")[3];
//     const parsedQueryString = queryString.parse(window.location.search);
//     const checkFeaturesVisible = (data) => this.checkFeaturesVisible(data);
//     const recentSquads = () => this.recentSquads();
//     const openNewProjectModal = () => this.openNewProjectModal();
//     const isOnlyCheckinEnabled = () => this.isOnlyCheckinEnabled();
//     const isOnlyJiraEnabled = () => this.isOnlyJiraEnabled();

//     // console.log("currentpage ==>", currentpage);
//     return getMenuItems({
//       currentpage,
//       userTeamSync,
//       finalRecentProject,
//       workspace,
//       skills,
//       recentPro,
//       path,
//       projects,
//       checkFeaturesVisible,
//       teamSyncs,
//       user_now,
//       showCalender,
//       recentSquads,
//       isAdmin,
//       project,
//       openNewProjectModal,
//       currentSkill,
//       parsedQueryString,
//       members,
//       isOnlyCheckinEnabled,
//       isOnlyJiraEnabled,
//       jiraSkill
//     });
//   };

//   goHome = () => {
//     this.setState({ currentpage: "" });
//     this.props.history.push(`/${this.props.match.params.wId}/dashboard`);
//   };

//   isHomeTab = () => {
//     const { currentpage } = this.state;
//     const {workspace,skills} = this.props;
//     let tabs = []
//     const jiraSkill = skills.find(skill => skill.name === 'Jira')
//     if(jiraSkill && !jiraSkill.skill_metadata.disabled) tabs=["teamsyncs", "all_checkins", "templates", "settings", "teamsync_integrations"];
//     if (
//       currentpage &&
//       (currentpage.startsWith("ts") ||
//         currentpage.startsWith("sqd") ||
//         currentpage.startsWith("Jira") && !this.isOnlyJiraEnabled() ||
//         currentpage.startsWith("GitHub") ||
//         currentpage.startsWith("squads") ||
//         settingsTabs.includes(currentpage)) ||
//         tabs.includes(currentpage)
//     )
//       return false;
//     else return true;
//   };

//   toggleFeedbackModal = () => {
//     this.setState({ feedback_modal_visible: !this.state.feedback_modal_visible });
//   };

//   isOnlyCheckinEnabled = () => {
//     const { workspace,skills } = this.props;
//     const jiraSkill = skills.find(skill => skill.name === 'Jira')
//     if (jiraSkill && jiraSkill.skill_metadata.disabled && !this.checkFeaturesVisible("squads") && !this.checkFeaturesVisible("github")) return true;
//     else return false;
//   };

//   isOnlyJiraEnabled = () => {
//     const { workspace } = this.props;
//     if (workspace.disableCheckins && !this.checkFeaturesVisible("squads") && !this.checkFeaturesVisible("github")) return true;
//     else return false;
//   }

//   render() {
//     // if (this.state.teamSyncRedirect){
//     //   return (<Redirect to = {this.state.teamSyncRedirectUrl} />);
//     // }
//     const { workspace, location } = this.props;
//     const { currentpage } = this.state;

//     let wId = this.props.match.params.wId;
//     let userId = localStorage.getItem("trooprUserId");

//     // let qs = this.props&&this.props.location&&queryString.parse(this.props.location.search)
//     let currentView = [this.getCurrentView()];

//     if (currentView[0] && currentView[0].startsWith("ts")) {
//       let tab = location.pathname.split("/")[4];
//       const id = location.pathname.split("/")[3];
//       if (tab === "instance") tab = `ts${id}:report`;
//       else if (tab) tab = `ts${id}:${tab}`;
//       else tab = `ts${id}:report`;
//       currentView = [currentView[0], tab];
//       //['ts60487d867eefd9148a2e6cb9:report','ts60487d867eefd9148a2e6cb9']
//     } else if (currentView[0] && currentView[0].startsWith("sqd")) {
//       const id = location.pathname.split("/")[3];
//       const query = queryString.parse(window.location.search);
//       const tab = query.view || "active";
//       const selectedTab = `sqd${id}:${tab}`;
//       // ['to select the squad from squads list', 'to selct the particular tab from squadtabs']
//       currentView = [currentView[0], selectedTab];
//     }

//     // let subView = qs&&qs.view
//     function compare(a, b) {
//       // Use toUpperCase() to ignore character casing
//       const nameA = a.name.toLowerCase();
//       const nameB = b.name.toLowerCase();

//       let comparison = 0;
//       if (nameA > nameB) {
//         comparison = 1;
//       } else if (nameA < nameB) {
//         comparison = -1;
//       }
//       return comparison;
//     }

//     const isMultiWorkspace = this.props.userWorkspaces ? this.props.userWorkspaces.length > 1 : false;
//     let workspaces = isMultiWorkspace ? this.props.userWorkspaces.sort(compare) : this.props.userWorkspaces;

//     return (
//       <Fragment>
//         {workspace &&
//           workspace.billing_status &&
//           (workspace.billing_status == "grace_payment_failed" || workspace.billing_status == "payment_failed") && (
//             <Alert
//               message={
//                 <span>
//                   Payment Unsuccessful. Payment towards your Troopr subscription was unsuccessful. Go to{" "}
//                   <Link onClick={() => this.gotoBilling()} style={{ textDecoration: "underline" }}>
//                     Billing
//                   </Link>{" "}
//                   to update your billing information. If you have any questions, contact us at sales@troopr.io
//                 </span>
//               }
//               banner
//               closable
//             />
//           )}

//         <Sider
//           style={{
//             // background: "#ffffff",
//             // overflow: "auto",
//             height: "100vh",
//             position: "fixed",
//             left: 0,
//           }}
//         >
//           <Menu
//             theme={"dark"}
//             mode={(this.isOnlyCheckinEnabled() || this.isOnlyJiraEnabled()) && this.isHomeTab() ? "inline" : "vertical"}
//             // mode='vertical'
//             defaultSelectedKeys={currentView || []}
//             selectedKeys={currentView || []}
//             onClick={this.switchView}
//             style={{ height: "100vh" }}
//             // style={{ lineHeight: "62px", height: "64px", padding:"0px 16px" }}
//             // defaultOpenKeys={this.isOnlyCheckinEnabled() ? ["standups_inline"] : this.isOnlyJiraEnabled() ? ['jira_inline'] : []}
//             defaultOpenKeys={["standups_inline",'jira_inline']}
//             // onOpenChange={this.autoSelectSquad}
//           >
//             {!this.isHomeTab() ? (
//               <div style={{ margin: "8px 0px 10px 0px" }}>
//                 <Button
//                   onClick={(e) => {
//                     e.preventDefault();
//                     e.stopPropagation();
//                     this.goHome();
//                   }}
//                   style={{ background: "none" }}
//                   // block
//                   // size="large"
//                   type='text'
//                 >
//                   <Row gutter={[4, 4]}>
//                     <Col>
//                       <Avatar
//                         className='sidenavbar_avatars'
//                         style={{
//                           marginRight: 2,
//                           marginTop: 0,
//                           backgroundColor: "rgba(204,204,204, 0.2)",
//                           // opacity: 0.8,
//                           // backgroundColor: "rgba(0,21,41, 0.5)"
//                         }}
//                         shape='square'
//                         icon={<ArrowLeftOutlined />}
//                       />
//                     </Col>
//                     <Col>
//                       {/*<ArrowLeftOutlined style={{fontSize:20, color: "white", marginRight: 4}}/>*/}
//                       <div style={{ color: "white", marginRight: 4, marginTop: 2 }}> Go Home</div>
//                     </Col>
//                   </Row>
//                 </Button>
//               </div>
//             ) : (
//               <>
//                 {isMultiWorkspace ? (
//                   <Dropdown
//                     trigger={["click"]}
//                     style={{ boxShadow: "0px 1px 1px rgba(255, 255, 255, 0.2)" }}
//                     overlay={
//                       <Menu style={{ maxHeight: "300px", overflow: "auto" }} onClick={this.onWSSwitcherMenu}>
//                         {workspaces.map((ws) => (
//                           <Menu.Item key={ws._id}>
//                             {/* {ws.logo ? (
//                           <Avatar
//                             shape='square'
//                             style={{ marginRight: 2, marginTop: 0, background: "rgba(204,204,204, 0.2)" }}
//                             src={`${ws.logo}?_=${new Date().getTime()}`}
//                           />
//                         ) : (
//                           <Avatar shape='square' style={{ marginRight: 2, marginTop: 0, background: "rgba(204,204,204, 0.2)" }}>
//                             {this._getInitials(ws.name)}
//                           </Avatar>
//                         )} */}
//                             {/* <Text strong style={{ marginRight: 16 }}>{this.truncTitle(ws.name)}</Text> */}
//                             <Text style={{ marginRight: 16 }}>{ws.name}</Text>
//                             <CheckOutlined style={ws._id === wId ? {} : { visibility: "hidden" }} />
//                           </Menu.Item>
//                         ))}
//                       </Menu>
//                     }
//                   >
//                     <div /*className='appbar_logoContainer'*/ style={{ margin: "8px 0px 10px 0px" }}>
//                       <Button
//                         // onClick={(e) => {
//                         //   e.preventDefault();
//                         //   e.stopPropagation();
//                         // }}
//                         type='text'
//                         icon={false}
//                         style={{ background: "none" }}

//                         // style={{ pointerEvents: "none" }}
//                       >
//                         <div style={{ textAlign: "center" }}>
//                           <Row gutter={[4, 4]}>
//                             <Col>
//                               {this.props.workspace.logo ? (
//                                 <Avatar
//                                   className='sidenavbar_avatars'
//                                   shape='square'
//                                   style={{ marginRight: 2, marginTop: 0, background: "rgba(204,204,204, 0.2)" }}
//                                   src={`${this.props.workspace.logo}?_=${new Date().getTime()}`}
//                                 />
//                               ) : (
//                                 <Avatar
//                                   className='sidenavbar_avatars'
//                                   shape='square'
//                                   style={{ marginRight: 2, marginTop: 0, background: "rgba(204,204,204, 0.2)" }}
//                                 >
//                                   {this._getInitials(this.props.workspace.name)}
//                                 </Avatar>
//                               )}
//                             </Col>
//                             <Col>
//                               <Tooltip title={this.props.workspace.name && this.props.workspace.name} placement='right'>
//                                 <Text
//                                   style={{
//                                     marginLeft: 1,
//                                     marginRight: 5,
//                                     textAlign: "center",
//                                     display: "inline-block",
//                                     marginTop: 2,
//                                     color: localStorage.getItem("theme") === "default" && "white",
//                                   }}
//                                 >
//                                   {" "}
//                                   {this.props.workspace.name && this.truncTitle(this.props.workspace.name)}
//                                 </Text>
//                               </Tooltip>
//                               {/* <SwapOutlined
//                             rotate={90}
//                             style={{ fontSize: 12, color: localStorage.getItem("theme") == "default" ? "rgba(64,46,150,0.45)" : "#6656aa" }}
//                           /> */}
//                               <DownOutlined style={{ fontSize: 10, color: "white" }} />
//                             </Col>
//                           </Row>
//                         </div>
//                       </Button>
//                     </div>
//                   </Dropdown>
//                 ) : (
//                   <div /*className='appbar_logoContainer_noHover'*/ style={{ margin: "8px 0px 10px 0px" }}>
//                     <Button
//                       onClick={(e) => {
//                         e.preventDefault();
//                         e.stopPropagation();
//                       }}
//                       type='text'
//                       icon={false}
//                       style={{ background: "none" }}
//                       // style={{pointerEvents:'none'}}
//                     >
//                       <Avatar
//                         className='sidenavbar_avatars'
//                         shape='square'
//                         style={{ marginRight: 2, marginTop: 0, background: "rgba(204,204,204, 0.2)" }}
//                       >
//                         {this._getInitials(this.props.workspace.name)}
//                       </Avatar>

//                       <Tooltip title={this.props.workspace.name && this.props.workspace.name} placement='right'>
//                         <Text
//                           style={{
//                             marginLeft: 5,
//                             display: "inline-block",
//                             marginTop: 2,
//                             textAlign: "center",
//                             color: localStorage.getItem("theme") === "default" && "white",
//                           }}
//                         >
//                           {" "}
//                           {this.props.workspace.name && this.truncTitle(this.props.workspace.name)}
//                         </Text>
//                       </Tooltip>
//                       {/* <SwapOutlined rotate={90} style={{ fontSize: 12, color: "rgba(64,46,150,0.45)", visibility: "hidden" }} /> */}
//                       {/* <DownOutlined style={{ fontSize: 10, color: "white" }} /> */}
//                     </Button>
//                   </div>
//                 )}
//               </>
//             )}

//             <Menu.Divider
//               style={{
//                 marginBottom: "16px",
//                 opacity: 0.2,
//                 boxShadow: "0px 1px 1px rgba(255, 255, 255, 0.2)",
//               }}
//             />
//             {this.getMenuItems()}

//             <Dropdown overlay={this.getProfileMenu()}>
//               <div
//                 style={{
//                   position: "absolute",
//                   bottom: 0,
//                   margin: "8px 0px 16px 0px",
//                 }}
//               >
//                 <Button
//                   onClick={(e) => {
//                     e.preventDefault();
//                     e.stopPropagation();
//                   }}
//                   // block
//                   // size="large"
//                   style={{ background: "none" }}
//                   type='text'
//                 >
//                   <div style={{ textAlign: "center" }}>
//                     <Row gutter={[4, 4]}>
//                       <Col>
//                         <Avatar
//                           className='sidenavbar_avatars'
//                           style={{
//                             marginRight: 2,
//                             marginTop: 0,
//                             backgroundColor: "rgba(204,204,204, 0.8)",
//                           }}
//                         >
//                           {this._getInitials(this.props.user_now.name)}
//                         </Avatar>
//                       </Col>
//                       <Col>
//                         {" "}
//                         <div style={{ color: "white", marginRight: 4, lineHeight: "24px" }}>
//                           {" "}
//                           {this.props.user_now.name && this.truncTitle(this.props.user_now.name)}{" "}
//                           <DownOutlined size='small' style={{ fontSize: 10, color: "white" }} />
//                         </div>
//                       </Col>
//                     </Row>
//                   </div>
//                 </Button>
//               </div>
//             </Dropdown>
//           </Menu>
//         </Sider>

//         <FeedbackModal feedback_modal_visible={this.state.feedback_modal_visible} toggleFeedbackModal={this.toggleFeedbackModal} />

//         {this.state.newProjectModal ? <SquadCreationModal newProjectModal={this.state.newProjectModal} closeModal={this.closeModal} /> : ""}

//         <CreateTeamsyncModal
//           newStandupModalVisible={this.state.newStandupModalVisible}
//           modalToggle={this.toggleNewStandupModal}
//           // https://stackoverflow.com/questions/37949981/call-child-method-from-parent
//           setClick={(click) => (this.clickChild = click)}

//           //whenever you add something here check in allstandups,standupReport,dashboard files too
//         />
//       </Fragment>
//     );
//   }
// }
// // export default withRouter(sidenavbar)

// const mapStateToProps = (store) => {
//   // console.log("SIDENAVBAR workspace:"+JSON.stringify(store.common_reducer.workspace))
//   return {
//     // username: store.auth.user.name,
//     workspace: store.common_reducer.workspace,
//     user_now: store.common_reducer.user,
//     assistant: store.skills.team,
//     skills: store.skills.skills,
//     projects: store.projects.projects,
//     teamSyncs: store.skills.userTeamSyncs,
//     recentPro: store.projects.recentProjects,
//     userWorkspaces: store.common_reducer.userWorkspaces,
//     userTeamSync: store.skills.userTeamSync,
//     project: store.projects.project,
//     currentSkill: store.skills.currentSkill,
//     members: store.skills.members,
//     assistant_skills: store.skills,
//     //appbarView:store.appbarView // switched to route based current state - not need to track in store
//   };
// };

// export default withRouter(
//   connect(mapStateToProps, {
//     // getProfileinfo,
//     getWorkspace,
//     getUserWorkspaces,
//     getFutureSprints,
//     getCurrentSprint,
//     getBacklogTasks,
//     getRecentProjects,
//     recentProjects,
//     getSprintConfig,
//     logout,
//     setCurrentUser,
//     checkSlackLink,
//     emailSubscribe,
//     getEmailSubscription,
//     setDriftState,
//     getAssisantSkills,
//     getWorkspaceMembers,
//     addProject,
//     getProject,
//     getProjects,
//     getStatuses,
//     getTasks,
//     getUsersSelectedTeamSync,
//     getProjectTeamSyncInstance,
//     getUserTeamSync,
//     getMembers,
//     setProject,
//     getChannelList,
//   })(sidenavbar)
// );
