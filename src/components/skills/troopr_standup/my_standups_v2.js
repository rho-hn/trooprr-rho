// import React, { Component, Fragment } from "react";
// import { connect } from "react-redux";
// import { withRouter } from "react-router-dom";
// import { SkillsAction } from "../settings/settings_action";
// import {
//   Card,
//   Typography,
//   Row,
//   Col,
//   Button,
//   Tag,
//   Table,
//   Avatar,
//   Menu,
//   Divider,
//   Dropdown,
//   Icon,
//   Tooltip,
//   Popconfirm,
//   Empty,
//   Layout,
//   Tabs,
//   PageHeader,
//   Input,
//   Result
// } from "antd";
// import queryString from "query-string";
// import moment from "moment";
// import {
//   getUserTeamSync,
//   getUsersSelectedTeamSync,
//   getProjectTeamSyncInstance,
//   getAnotherInstancePage,
//   editTeamSync,
//   excecuteTeamSync,
//   deleteteamsync,
//   setCurrentTeamsync,
//   sendTeamsyncAck,
//   exportToCsv,
//   deleteTeamInstance,
//   getJiraUserActivity,
//   getAssisantSkills
// } from "../skills_action";
// import { ModalBody, ModalHeader, Modal } from "reactstrap";
// const { Text, Title } = Typography;
// const { Meta } = Card;
// const { TabPane } = Tabs;
// const { Search, TextArea } = Input;
// const { Header, Sider, Content, Footer } = Layout;

// class MyStandups extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       showmystandups: false,
//       showreport: false,
//       loading: false,
//       islatestinstance: false,
//       instance: "",
//       teamSyncId: "",
//       teamSyncName: "",
//       noInstance: "",
//       weekdays: [],
//       trooprUserId: "",
//       selectedMembers: [],
//       modalVisible: false,
//       allreadyhappened: false,
//       // isToggleOn: true,
//       showmore: false,
//       allreadyhappen: false,
//       currentPage: 1,
//       isJiraLinked: '',
//       upcomingStandup: true,
//     };

//     this.showmystandups = this.showmystandups.bind(this);
//     this.showreport = this.showreport.bind(this);
//     this.getAnotherInstance = this.getAnotherInstance.bind(this);
//     this.thredAnswer = this.thredAnswer.bind(this);
//     this.toggle = this.toggle.bind(this);
//     this.weekdays = this.weekdays.bind(this);
//   }

//   componentDidMount() {
//     this.props.getAssisantSkills(this.props.match.params.wId)
//     this.setState({ loading: true });
//     this.props.SkillsAction(this.props.match.params.wId);
//     const parsedQueryString = queryString.parse(window.location.search);
//     if (parsedQueryString.teamsync_id) {
//       this.setState({ loading: true });
//       this.props.getUserTeamSync(parsedQueryString.teamsync_id)
//       this.props
//         .getProjectTeamSyncInstance(
//           parsedQueryString.teamsync_id,
//           parsedQueryString.instance
//         )
//         .then(res => {
//           if (res.data.projectTeamSyncInstance._id == undefined) {
//             this.setState({
//               loading: false,
//               islatestinstance: true,
//               instance: res.data.projectTeamSyncInstance._id,
//               showreport: true,
//               showmystandups: false
//             });
//             this.setState({
//               teamSyncId: parsedQueryString.teamsync_id,
//               teamSyncName: parsedQueryString.teamsync_name,
//               noInstance: true
//             });
//             let path = window.location.pathname;
//             let obj = {
//               // title: this.props.skillView.view,
//               url:
//                 path +
//                 `?teamsync_id=${parsedQueryString.teamsync_id}&teamsync_name=${parsedQueryString.teamsync_name}`
//             };
//             window.history.pushState(obj, '', obj.url);
//           } else {
//             this.setState({
//               loading: false,
//               islatestinstance: true,
//               instance: res.data.projectTeamSyncInstance._id,
//               showreport: true,
//               showmystandups: false
//             });
//             this.setState({
//               teamSyncId: parsedQueryString.teamsync_id,
//               // teamSyncName: res.data.projectTeamSyncInstance.teamSync_metdata.name,
//               teamSyncName: this.props.userTeamSync.name,
//               noInstance: false
//             });
//             let path = window.location.pathname;
//             let obj = {
//               // title: this.props.skillView.view,
//               url:
//                 path +
//                 `?teamsync_id=${parsedQueryString.teamsync_id}&teamsync_name=${parsedQueryString.teamsync_name}&instance=${this.state.instance}`
//             };
//             window.history.pushState(obj, '', obj.url);
//           }
//         });
//     }
//     if ((parsedQueryString.teamsync_id, parsedQueryString.instance)) {
//       this.setState({ loading: true });
//       this.props.getUserTeamSync(parsedQueryString.teamsync_id)
//       this.props
//         .getProjectTeamSyncInstance(
//           parsedQueryString.teamsync_id,
//           parsedQueryString.instance
//         )
//         .then(res => {
//           this.setState({
//             loading: false,
//             islatestinstance: true,
//             instance: res.data.projectTeamSyncInstance._id,
//             showreport: true,
//             showmystandups: false
//           });
//           this.setState({
//             teamSyncId: parsedQueryString.teamsync_id,
//             // teamSyncName: res.data.projectTeamSyncInstance.teamSync_metdata.name,
//             teamSyncName: this.props.userTeamSync.name,
//             noInstance: false
//           });
//           let path = window.location.pathname;
//           let obj = {
//             // title: this.props.skillView.view,
//             url:
//               path +
//               `?teamsync_id=${parsedQueryString.teamsync_id}&teamsync_name=${parsedQueryString.teamsync_name}&instance=${res.data.projectTeamSyncInstance._id}`
//           };
//           window.history.pushState(obj, '', obj.url);
//         });
//     } else if (
//       (parsedQueryString.teamsync_id, parsedQueryString.instance == "")
//     ) {
//       this.props.getUserTeamSync(parsedQueryString.teamsync_id)
//       this.props
//         .getProjectTeamSyncInstance(parsedQueryString.teamsync_id)
//         .then(res => {
//           if (res.data.success) {
//             if (res.data.projectTeamSyncInstance._id) {
//               this.setState({
//                 loading: false,
//                 islatestinstance: true,
//                 instance: res.data.projectTeamSyncInstance._id
//               });
//             } else if (res.data.projectTeamSyncInstance._id == undefined) {
//               this.setState({
//                 loading: false,
//                 islatestinstance: true,
//                 instance: res.data.projectTeamSyncInstance._id,
//                 noInstance: true
//               });
//               let path = window.location.pathname;
//               let obj = {
//                 // title: this.props.skillView.view,
//                 url:
//                   path +
//                   `?teamsync_id=${parsedQueryString.teamsync_id}&teamsync_name=${parsedQueryString.teamsync_name}&instance=`
//               };
//               window.history.pushState(obj, '', obj.url);
//               this.setState({
//                 showreport: true,
//                 showmystandups: false,
//                 noInstance: true
//               });
//             }
//           }
//         });
//     }
//     this.setState({
//       showreport: false,
//       showmystandups: true,
//       noInstance: false
//     });
//     let currentWorkspaceId = localStorage.getItem("userCurrentWorkspaceId");
//     this.props.getUsersSelectedTeamSync(currentWorkspaceId).then(res => {
//       this.setState({ loading: false });
//     });
//     this.setState({ showreport: false, showmystandups: true });
//     this.setState({ trooprUserId: localStorage.getItem("trooprUserId") });
//   }

//   handleCancel = () => {
//     this.setState({ modalVisible: false });
//   };

//   toggle() {
//     this.setState({
//       modalVisible: !this.state.modalVisible
//     });
//   }

//   getInitials(string) {
//     return string
//       .trim()
//       .split(" ")
//       .map(function (item) {
//         if (item.trim() != "") {
//           return item[0].toUpperCase();
//         } else {
//           return;
//         }
//       })
//       .join("")
//       .slice(0, 2);
//   }

//   showmystandups() {
//     this.seemore()
//     this.setState({ showmystandups: true, showreport: false, showmore: false });
//     let path = window.location.pathname;
//     let obj = {
//       // title: this.props.skillView.view,
//       // url: path + `?view=my_standups`
//       url: path + ``
//     };
//     window.history.pushState(obj, '', obj.url);

//   }

//   showreport = (teamsyncId, teamsyncName) => () => {
//     this.setState({ teamSyncId: teamsyncId, teamSyncName: teamsyncName });
//     let path = window.location.pathname;
//     let obj = {
//       // title: this.props.skillView.view,
//       // title: 'balaji',
//       url:
//         path +
//         `?teamsync_id=${teamsyncId}&teamsync_name=${teamsyncName}`
//     };
//     window.history.pushState(obj, '', obj.url);
//     const search = window.location.search;
//     let parsed = queryString.parse(search);
//     if (parsed.view == "my_standups" && parsed.teamsync_id) {
//       this.setState({ showreport: true });
//     }
//     this.setState({ loading: true });
//     this.props.getUserTeamSync(parsed.teamsync_id)
//     this.props.getProjectTeamSyncInstance(parsed.teamsync_id).then(res => {
//       if (res.data.success) {
//         if (res.data.projectTeamSyncInstance._id) {
//           this.setState({
//             loading: false,
//             islatestinstance: true,
//             instance: res.data.projectTeamSyncInstance._id,
//             noInstance: false
//           });
//           let path = window.location.pathname;
//           obj = {
//             // title: this.props.skillView.view,
//             url:
//               path +
//               `?teamsync_id=${teamsyncId}&teamsync_name=${teamsyncName}&instance=${this.state.instance}`
//           };
//           window.history.pushState(obj, '', obj.url);
//         } else {
//           this.setState({ loading: false, noInstance: true });
//           let path = window.location.pathname;
//           obj = {
//             // title: this.props.skillView.view,
//             url:
//               path +
//               `?teamsync_id=${teamsyncId}&teamsync_name=${teamsyncName}&instance=`
//           };
//           window.history.pushState(obj, '', obj.url);
//         }
//       }
//     });
//     this.setState({ showreport: true, showmystandups: false });
//   };

//   getAnotherInstance(previousInstance, nextInstance) {
//     this.setState({ loading: true });
//     this.setState({ showmore: false })
//     this.props
//       .getAnotherInstancePage(this.state.teamSyncId, {
//         teamSyncId: true,
//         previousInstance,
//         nextInstance,
//         instanceId: this.props.teamSyncInstance._id
//       })
//       .then(res => {
//         this.setState({ loading: false });
//         if (res.data.success) {
//           if (res.data.projectTeamSyncInstance._id) {
//             this.setState({
//               loading: false,
//               instance: res.data.projectTeamSyncInstance._id,
//               noInstance: false
//             });
//             let path = window.location.pathname;
//             let obj = {
//               // title: this.props.skillView.view,
//               url:
//                 path +
//                 `?teamsync_id=${this.state.teamSyncId}&teamsync_name=${this.state.teamSyncName}&instance=${this.state.instance}`
//             };
//             window.history.pushState(obj, '', obj.url);
//           } else if (res.data.projectTeamSyncInstance._id == undefined) {
//             this.setState({
//               loading: false,
//               instance: res.data.projectTeamSyncInstance._id,
//               noInstance: true
//             });
//             let path = window.location.pathname;
//             let obj = {
//               // title: this.props.skillView.view,
//               url:
//                 path +
//                 `?teamsync_id=${this.state.teamSyncId}&teamsync_name=${this.state.teamSyncName}`
//             };
//             window.history.pushState(obj, '', obj.url);
//           }
//         }
//       });
//   }

//   seemore = () => {
//     this.setState({ showmore: !this.state.showmore });

//     // this.setState(function (prevState) {
//     //   return { isToggleOn: !prevState.isToggleOn };
//     // });
//   };

//   thredAnswer(answer, report) {
//     ///searching for urls
//     var Regex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
//     answer = answer.replace(Regex, function (url) {
//       return '<a href="' + url + '" target=_blank>' + url + '</a>';
//     })
//     ////searching for jira id's
//     let ids;
//     let url;
//     try {
//       ids = report;
//       ids.forEach(ele => {
//         let regexp = new RegExp("\\b" + ele.id + "\\b", "gi")
//         url = `${ele.url}/browse/${ele.id}`;
//         const replaceText = `${ele.id} : ${ele.title}`;
//         answer = answer.replace(
//           regexp,
//           `<a href=${url} target=_blank>${replaceText}</a>`
//         );
//       });
//       return answer;
//     } catch {
//       return answer;
//     }
//   }

//   standup_settings_menu(tsid, createInstance) {
//     if (createInstance) {
//       return (
//         <Menu>
//           <Menu.Item onClick={() => this.disable(tsid)} key="0">
//             <Icon type="cross" />
//             Deactivate
//           </Menu.Item>
//           <Menu.Item key="2">
//             <Popconfirm
//               title="Are you sure you want to delete this standup permanently?"
//               onConfirm={() => this.deleteteamsync(tsid)}
//               okText="Yes"
//               cancelText="No"
//               placement='leftTop'
//             >
//               <Icon type="delete" />
//               Delete Standup
//             </Popconfirm>
//           </Menu.Item>
//         </Menu >
//       );
//     } else {
//       return (
//         <Menu>
//           <Menu.Item onClick={() => this.enable(tsid)} key="0">
//             <Icon type='check' />
//             Activate
//           </Menu.Item>
//           <Menu.Item key="1">
//             <Popconfirm
//               title="Are you sure you want to delete this standup permanently?"
//               onConfirm={() => this.deleteteamsync(tsid)}
//               okText="Yes"
//               cancelText="No"
//             >
//               <Icon type="delete" />
//               Delete Standup
//             </Popconfirm>
//           </Menu.Item>
//         </Menu>
//       );
//     }
//   }

//   // home_standup_menu = (
//   //   <Menu>
//   //     <Menu.Item>
//   //       <Icon type="edit" />
//   //       Info
//   //     </Menu.Item>
//   //     <Menu.Item>
//   //       <Icon type="team" />
//   //       Show Engagement
//   //     </Menu.Item>
//   //     <Menu.Item>
//   //       <Icon type="dashboard" />
//   //       Show Reports
//   //     </Menu.Item>
//   //     <Menu.Item>
//   //       <Icon type="history" />
//   //       Show History
//   //     </Menu.Item>
//   //   </Menu>
//   // );

//   disable = tsid => {
//     let data = {
//       createInstance: false
//     };
//     this.props.editTeamSync(tsid, data);
//   };

//   enable = tsid => {
//     let data = {
//       createInstance: true
//     };
//     this.props.editTeamSync(tsid, data).then(data => {
//       if (data.data.success) {
//         this.props.sendTeamsyncAck(data.data.teamSync, this.props.match.params.wId);
//       }
//     })
//   };

//   execRunNow = _id => {
//     this.props.excecuteTeamSync(_id);
//   };
//   deleteteamsync = _id => {
//     this.props.deleteteamsync(_id).then(res => {
//       if (res.data.success) {
//         this.setState({ showmystandups: true, showreport: false, showmore: false, upcomingStandup: true });
//         let path = window.location.pathname;
//         let obj = {
//           // title: this.props.skillView.view,
//           // url: path + `?view=my_standups`
//           url: path + ``
//         };
//         window.history.pushState(obj, '', obj.url);
//       }
//     });
//   };

//   exportToCsv = () => {
//     let teamSyncInstanceData = this.props.instanceResponses;
//     let date = moment(this.props.projectTeamSyncInstance.created_at).format("D MMM");
//     // this.props.instanceResponses.forEach((value1, index1) => {
//     //   if (value1.progress_report) {
//     //       teamSyncInstanceData[index1].progress_report.push({
//     //         question: { text: 'Jira activity summary' }, answer: {
//     //           plain_text: `${value1.userActivity.jiraLogs.map((logs, logIndex) => {
//     //             return `${logs.key + ' : ' + logs.fields.summary} ${' '}`
//     //           })}`
//     //         }
//     //       })//
//     //   }
//     // })

//     let data
//     if (this.props.projectTeamSyncInstance) {
//       data = {
//         teamSyncInstanceData: teamSyncInstanceData,
//         projectTeamSyncInstance: this.props.projectTeamSyncInstance.questions,
//         createdAt: date,
//         // teamSyncName: this.props.projectTeamSyncInstance.teamSync_metdata.name
//         teamSyncName: this.props.userTeamSync.name

//       }
//     }

//     this.props.exportToCsv(this.props.match.params.wId, data).then(res => {
//       if (res) {
//         this.download(res.data);
//       }
//     })

//   }

//   download = (data) => {
//     let date = moment(this.props.projectTeamSyncInstance.created_at).format("D  MMM");

//     let reportname = this.props.projectTeamSyncInstance.teamSync_metdata.name
//     let fileName = `Troopr_${reportname}_${date}.csv`
//     const dataBlob = new Blob([data], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(dataBlob);
//     const a = document.createElement('a');
//     a.setAttribute('hidden', "");
//     a.setAttribute('href', url);
//     a.setAttribute('download', fileName);
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//   }

//   deleteTeamSyncInstance = (instanceId, previousInstanceNotAvailable, nextInstanceNotAvailable) => {

//     let wId = this.props.match.params.wId;
//     let teamSyncId = instanceId.teamSync_metdata._id;
//     this.props.deleteTeamInstance(instanceId._id, wId, teamSyncId).then(data => {
//       this.props.getProjectTeamSyncInstance(data.data.data.teamSync_metdata._id).then(res => {
//         let path = window.location.pathname;
//         let obj = {
//           // title: this.props.skillView.view,
//           url:
//             path +
//             `?teamsync_id=${this.state.teamSyncId}&teamsync_name=${this.state.teamSyncName}`
//         };
//         window.history.pushState(obj, '', obj.url);
//         if (nextInstanceNotAvailable && previousInstanceNotAvailable) {
//           this.setState({ noInstance: true })
//         }
//       })
//     })
//   }

//   handleChange = (pagination, filters, sorter) => {
//     this.setState({
//       currentPage: pagination.current
//     })
//   }

//   getUserActivity = (user_id) => () => {
//     this.setState({ loading: true })
//     this.props.getJiraUserActivity(this.props.match.params.wId, user_id).then(res => {
//       if (res.success && res.activity) {
//         this.props.instanceResponses.forEach((value, index) => {
//           // if (value.user_id._id == user_id) {

//           if (value.user_id && value.user_id._id == user_id) {
//             res.userActivity.forEach((logs, index1) => {
//               this.props.instanceResponses[index].userActivity.jiraLogs.push(res.userActivity[index1])
//             })
//             this.props.instanceResponses[index].showJiraActivity = true
//           } else if (value._id == user_id) {
//             res.userActivity.forEach((logs, index1) => {
//               this.props.instanceResponses[index].userActivity.jiraLogs.push(res.userActivity[index1])
//             })
//             this.props.instanceResponses[index].showJiraActivity = true
//           }
//         })
//         this.setState({ loading: false })
//       } else if (res.success && !res.activity) {
//         this.props.instanceResponses.forEach((value, index) => {
//           if (value.user_id._id == user_id) {
//             this.props.instanceResponses[index].showJiraActivity = true
//             this.props.instanceResponses[index].userNotMapped = true
//           }
//         })
//         this.setState({ loading: false })
//       }
//     })
//   }

//   gotoUserMapping = () => {
//     this.props.skills.forEach(value => {
//       if (value.name == 'Jira') {
//         this.props.history.push(`/${this.props.match.params.wId}/skills/${value.skill_metadata._id}?view=user_mappings`);
//       }
//     })
//   }

//   weekdays = (schedule) => {
//     let finalWeekArray;
//     let weekdays;
//     if (schedule._id) {
//       let weekDaysString;
//       finalWeekArray = [];
//       if (schedule.weekdays) {
//         weekDaysString = schedule.weekdays.split(",");
//         weekDaysString.forEach(week => {
//           if (week === "1") {
//             finalWeekArray.push({
//               weekName: "Mon",
//               weekValue: week
//             });
//           }
//           if (week === "2") {
//             finalWeekArray.push({
//               weekName: "Tue",
//               weekValue: week
//             });
//           }
//           if (week === "3") {
//             finalWeekArray.push({
//               weekName: "Wed",
//               weekValue: week
//             });
//           }
//           if (week === "4") {
//             finalWeekArray.push({
//               weekName: "Thu",
//               weekValue: "week"
//             });
//           }
//           if (week === "5") {
//             finalWeekArray.push({
//               weekName: "Fri",
//               weekValue: week
//             });
//           }
//         });
//         weekdays = finalWeekArray;
//       }
//       if (
//         schedule.teamSync_type &&
//         (!schedule.createInstance || !schedule.jobType)
//       ) {
//         return <div> Not scheduled</div>;
//       } else {
//         return (
//           <span>
//             {/* <span> Every </span> */}
//             <span>
//               {weekdays &&
//                 weekdays.map((week, i) => {
//                   if (weekdays.length === 1) {
//                     return `${week.weekName} `;
//                   } else {
//                     if (i === weekdays.length - 1) {
//                       // return `and ${week.weekName} `;
//                       return `${week.weekName} `;
//                     } else {
//                       return `${week.weekName} `;
//                     }
//                   }
//                 })}
//             </span>
//             <span>at {schedule.time_at}</span>
//           </span>
//         );
//       }
//     }
//   }

//   onTabChange = activeKey => {
//     if (activeKey === "active") {
//       this.setState({
//         upcomingStandup: true
//       });
//     } else {
//       this.setState({
//         upcomingStandup: false
//       });
//     }
//   };



//   switchView = () => {
//     this.props.history.push(`/${this.props.match.params.wId}/teamsync`);
//     this.setState({ showreport: !this.state.showreport })
//   }

//   goToSlackAppHome = () => {
//     let url = `https://slack.com/app_redirect?app=AE4FF42BA&team=${this.props.assistant.id}&tab=home`
//     window.open(url)
//   }

//   render() {
//     const { teamSyncs, instanceResponses, projectTeamSyncInstance, userTeamSync } = this.props;
//     let col, isJiraLinked;
//     const emptyColumns = [
//       {
//         title: '',
//         render: () => <Empty description='No Activity in this Standup yet' />
//       }
//     ];
//     const emptyData = [
//       {
//         key: '1',
//         name: '',
//       }
//     ];
//     //
//     let columns = [
//       {
//         className: "table_top",
//         title: 'Participant',
//         dataIndex: "name",
//         render: (response, data) => {
//           if (data.user_id) {
//             return (
//               <Title level={4}>{data.user_id.name}</Title>
//             );
//           } else {
//             return (
//               // <span>{data.metadata.sharedUserName}(External)</span>
//               <Title level={4}>{data.metadata.sharedUserName} (External)</Title>
//             );
//           }
//         },
//         fixed: 'left',
//         width: 200
//       },
//     ];

//     this.props.skills.forEach(value => {
//       if (value.name == 'Jira') {
//         isJiraLinked = value.skill_metadata.linked
//       }
//     })
//     if (isJiraLinked) {
//       columns.push(
//         {
//           className: "table_top",
//           width: "auto",
//           // className: "response_column_table_top_without_width",
//           title: "Jira activity summary",
//           render: (data, activities, activities2) => {
//             // if (data.metadata && data.metadata.isJiraConnected) {
//             if ((data.userActivity && data.userActivity.jiraLogs.length > 0) || (data.showJiraActivity && data.userActivity && data.userActivity.jiraLogs.length > 0)) {
//               if (data.userActivity.jiraLogs.length <= 5) {
//                 activities = data.userActivity.jiraLogs.slice(0, 5);
//                 return (
//                   <div>
//                     {" "}
//                   Progressed
//                     {activities.map(activity => (
//                       <a
//                         className="response_column"
//                         href={
//                           data.userActivity.jiraLogs[0].domain_url +
//                           "/browse/" +
//                           activity.key
//                         }
//                         target="_blank"
//                       >
//                         {" "}
//                         {activity.key} : {activity.fields.summary.length > 79 ?
//                           activity.fields.summary.substring(0, 80) + '...' : activity.fields.summary
//                         }
//                         <br />
//                       </a>
//                     ))}
//                   </div>
//                 );
//               } else {
//                 activities = data.userActivity.jiraLogs.slice(0, 5);
//                 activities2 = data.userActivity.jiraLogs.slice(5, data.userActivity.jiraLogs.length);
//                 return (
//                   <div>
//                     {" "}
//                   Progressed
//                     {activities.map(activity => (
//                       <a
//                         className="response_column"
//                         href={
//                           data.userActivity.jiraLogs[0].domain_url +
//                           "/browse/" +
//                           activity.key
//                         }
//                         target="_blank"
//                       >
//                         {" "}
//                         {activity.key} : {activity.fields.summary.length > 79 ?
//                           activity.fields.summary.substring(0, 80) + '...' : activity.fields.summary
//                         }
//                         <br />
//                       </a>
//                     ))}
//                     {this.state.showmore &&
//                       activities2.map(activity => (
//                         <a
//                           className="response_column"
//                           href={
//                             data.userActivity.jiraLogs[0].domain_url +
//                             "/browse/" +
//                             activity.key
//                           }
//                           target="_blank"
//                         >
//                           {" "}
//                           {activity.key} : {activity.fields.summary.length > 79 ?
//                             activity.fields.summary.substring(0, 80) + '...' : activity.fields.summary
//                           }
//                           <br />
//                         </a>
//                       ))}
//                     <a onClick={this.seemore}>
//                       {!this.state.showmore ? `See ${data.userActivity.jiraLogs.length - 5} more` : "See Less"}
//                     </a>

//                     {/* {!this.state.showmore ? `and ${data.userActivity.jiraLogs.length - 5} more` : ''} */}

//                   </div>
//                 );
//               }
//             }
//             else {
//               if (data && data.status) {
//                 if (data.metadata && data.metadata.isJiraConnected) {
//                   return "No activity found."
//                 } else {
//                   return <span>User not mapped.<br /><a onClick={this.gotoUserMapping}>Go to User Mapping</a></span>
//                 }
//               }
//               else {
//                 if (data.showJiraActivity) {
//                   if (data.userNotMapped) {
//                     return <span>User not mapped.<br /><a onClick={this.gotoUserMapping}>Go to User Mapping</a></span>
//                   } else { return "No activity found." }
//                 } else {
//                   return <a onClick={this.getUserActivity(data.user_id._id)}>Get Jira activities</a>
//                 }
//               }
//             }
//           }
//         }
//       )
//     }



//     if (
//       this.props.projectTeamSyncInstance &&
//       this.props.projectTeamSyncInstance.questions
//     ) {
//       col = this.props.projectTeamSyncInstance.questions.map((datas, index) => {
//         if (projectTeamSyncInstance.questions.length - 1 == index && !isJiraLinked) {
//           return {
//             width: "auto",
//             title: datas.question.text,
//             render: data => {

//               if (data.progress_report && data.progress_report[index]) {
//                 return (
//                   <div
//                     // className="response_column_table_top"
//                     className="response_column"
//                     // style={{ maxWidth: "250px" }}
//                     dangerouslySetInnerHTML={{
//                       __html: this.thredAnswer(
//                         data.progress_report[index].answer.plain_text,
//                         data.unfurl_medata.jiraIds
//                       )
//                     }}
//                   ></div>
//                 );
//               }
//               else {
//                 return (
//                   <div> No Answer
//                   </div>)
//               }
//             }
//           };
//         } else {
//           return {
//             width: 300,
//             title: datas.question.text,
//             render: data => {

//               if (data.progress_report && data.progress_report[index]) {
//                 return (
//                   <div>
//                     {data.progress_report[index].answer.plain_text.length > 0 ?
//                                       <div
//                     // className="response_column_table_top"
//                     // style={{ maxWidth: "250px" }}
//                     dangerouslySetInnerHTML={{
//                       __html: this.thredAnswer(
//                         data.progress_report[index].answer.plain_text,
//                         data.unfurl_medata.jiraIds
//                       )
//                     }}
//                   ></div> 
//                   :
//                   'No Answer'
//                   }
//                   </div>
//                 );
//               }
//               else {
//                 return (
//                   <div> No Answer
//                   </div>)
//               }
//             }
//           };
//         }
//       });
//     }


//     if (col) {
//       col.map((value, index) => {
//         columns.splice(index + 1, 0, col[index]);
//       });
//     }

//     let respondedId = instanceResponses.map((value, index) => {
//       // return value.user_id.name
//       if (value.user_id) {
//         return value.user_id.name
//       } else {
//         return value.metadata.sharedUserName
//       }
//     })

//     if (projectTeamSyncInstance && projectTeamSyncInstance._id) {
//       projectTeamSyncInstance.teamSync_metdata.selectedMembers.forEach(value => {
//         if (respondedId.indexOf(value.name) == -1) { instanceResponses.push({ user_id: { name: value.name, _id: value._id }, userActivity: { jiraLogs: [] }, showJiraActivity: false }) } else { }
//       })
//     }
//     let creator_id
//     if (userTeamSync && userTeamSync.user_id && userTeamSync.user_id._id) {
//       creator_id = userTeamSync.user_id._id
//     }
//     let noActiveStandup = true
//     teamSyncs && teamSyncs.map(teamsync => {
//       if (teamsync.createInstance) {
//         return noActiveStandup = false
//       }
//     })

//     return (
//       <div>
//         {/* <div> */}
//         {!this.state.showreport ? (
//           <Layout
//           // style={{
//           //   // backgroundColor: "#FAFAFA ",
//           //   height: "100vh",
//           //   paddingLeft: "100px",
//           //   paddingRight: "100px",
//           //   paddingTop: "32px",
//           // }}
//           >
//             <PageHeader
//               style={{ backgroundColor: "#ffffff" }}
//               avatar={{ icon: "deployment-unit" }}
//               className="site-page-header-responsive"
//               title="Standups"
//               subTitle="Conduct virtual asynchronous standup meeting and collect team responses over Slack"
//               footer={
//                 <Tabs
//                   activeKey={this.state.upcomingStandup ? 'active' : 'archive'}
//                   onChange={this.onTabChange}
//                 >
//                   <TabPane
//                     tab={
//                       <span>
//                         <Icon type="check" />
//                               Active
//                             </span>
//                     }
//                     key="active"
//                   />
//                   <TabPane
//                     tab={
//                       <span>
//                         <Icon type="history" />
//                               All
//                             </span>
//                     }
//                     key="archive"
//                   />
//                 </Tabs>
//               }
//             />
//             <div style={{ padding: "24px 36px", height: '50vh' }}>
//               <Row gutter={[24, 24]}>
//                 {this.state.upcomingStandup ? (
//                   teamSyncs && teamSyncs.length > 0 && !noActiveStandup ? (
//                     teamSyncs && teamSyncs.map(teamsync => {
//                       if (teamsync.createInstance) {
//                         return (
//                           <Col span={8}>
//                             <a onClick={this.showreport(teamsync._id, teamsync.name, teamsync.createInstance)}>
//                               <Card
//                                 title={
//                                   <Fragment>
//                                     <span style={{ paddingRight: '8px' }}>
//                                       {teamsync.name}
//                                     </span>
//                                   </Fragment>
//                                 }
//                                 extra={<Tag color="green">Active</Tag>}

//                                 hoverable='true'
//                                 // bordered={false}
//                                 style={{ maxHeight: "150px", minHeight: "150px" }}
//                               >

//                                 <Icon type='clock-circle' />
//                                 <span style={{ paddingLeft: "8px" }}>
//                                   {this.weekdays(teamsync)}
//                                 </span>
//                                 <br />
//                                 <Icon type="user" />
//                                 <span style={{ paddingLeft: "8px" }}>
//                                   {teamsync.user_id.name}
//                                 </span>
//                               </Card>
//                             </a>
//                           </Col>
//                         )
//                       }
//                     }))
//                     :
//                     // noActiveStandup ? <div style={{ textAlign: 'center', marginTop: '200px' }}>No active standup available</div> : <div style={{ textAlign: 'center', marginTop: '200px' }}>No standup available</div>
//                     noActiveStandup ?
//                       <Result
//                         status="404"
//                         title={<div>You got no active Standups <br /> Click here to see paused Standups</div>}
//                         extra={
//                           <Button type="primary" onClick={this.onTabChange}>
//                             See all Standups
//                           </Button>
//                         }
//                       />
//                       :
//                       <Result
//                         status="404"
//                         title="You got no Standups yet!"
//                         subTitle={
//                           <span>
//                             Create new Standup in Slack{" "}
//                           </span>
//                         }
//                         extra={
//                           <Button type="primary" icon="slack" onClick={this.goToSlackAppHome}>
//                             Go to Slack
//                         </Button>
//                         }
//                       />
//                 )
//                   :
//                   (
//                     teamSyncs && teamSyncs.length > 0 ?
//                       teamSyncs && teamSyncs.map(teamsync => {
//                         return (
//                           <Col span={8}>
//                             <a onClick={this.showreport(teamsync._id, teamsync.name, teamsync.createInstance)}>
//                               <Card
//                                 title={
//                                   // <Fragment>
//                                   <div >
//                                     {/* <Tooltip placement='right' title={teamsync.name}> */}
//                                     <span style={{ paddingRight: '50px', maxWidth: '50px', minWidth: '50px' }}>
//                                       {teamsync.name}
//                                     </span>
//                                     {/* </Tooltip> */}
//                                     {/* {teamsync.createInstance ? <Tag color="green">Active</Tag> : <Tag color="orange">Paused</Tag>} */}

//                                   </div>
//                                   // </Fragment>
//                                 }
//                                 extra={teamsync.createInstance ? <Tag color="green">Active</Tag> : <Tag color="orange">Paused</Tag>}
//                                 hoverable='true'
//                                 // bordered={false}
//                                 style={{ maxHeight: "150px", minHeight: "150px" }}
//                               >

//                                 <Icon type='clock-circle' />
//                                 <span style={{ paddingLeft: "8px" }}>
//                                   {this.weekdays(teamsync)}
//                                 </span>
//                                 <br />
//                                 <Icon type="user" />
//                                 <span style={{ paddingLeft: "8px" }}>
//                                   {teamsync.user_id.name}
//                                 </span>
//                               </Card>
//                             </a>
//                           </Col>
//                         )
//                       })
//                       :
//                       <Result
//                         status="404"
//                         title="You got no Standups yet!"
//                         subTitle={
//                           <span>
//                             Create new Standup in Slack{" "}
//                           </span>
//                         }
//                         extra={
//                           <Button type="primary" icon="slack" onClick={this.goToSlackAppHome}>
//                             Go to Slack
//                       </Button>
//                         }
//                       />
//                   )
//                 }
//               </Row>
//             </div>
//           </Layout>
//         ) :
//           (
//             // <Fragment >
//             <Layout>
//               <PageHeader
//                 // style={{ backgroundColor: "rgba(64,46,150,0.2)" }}
//                 style={{ backgroundColor: "#ffffff" }}
//                 // ghost={true}
//                 className="site-page-header-responsive"
//                 onBack={this.showmystandups}
//                 title={this.state.teamSyncName && this.state.teamSyncName.length > 59 ?
//                   <div className="response_column" style={{ width: '800px' }}>
//                     <Tooltip title={this.state.teamSyncName}>{this.state.teamSyncName.substring(0, 60) + '...'}</Tooltip>{userTeamSync && userTeamSync.createInstance ?
//                       <Tag style={{ marginLeft: '10px' }} color="green">Active</Tag> : <Tag style={{ marginLeft: '10px' }} color="orange">Paused</Tag>}
//                   </div>
//                   :
//                   <div className="response_column" style={{ width: '800px' }}>
//                     {this.state.teamSyncName}{userTeamSync && userTeamSync.createInstance ?
//                       <Tag style={{ marginLeft: '10px' }} color="green">Active</Tag> : <Tag style={{ marginLeft: '10px' }} color="orange">Paused</Tag>}
//                   </div>
//                 }
//                 // tags={
//                 //   userTeamSync && userTeamSync.createInstance ?
//                 //     <Tag color="green">Active</Tag> : <Tag color="orange">Paused</Tag>
//                 // }
//                 extra={[
//                   <span>
//                     {creator_id == this.state.trooprUserId ?
//                       <span>
//                         {
//                           userTeamSync.createInstance ?
//                             <Popconfirm title={
//                               <span>
//                                 Please confirm if you want to run standup : "{
//                                   userTeamSync.name
//                                 }" now? <br />These members {
//                                   userTeamSync.selectedMembers.map(value => {
//                                     return <span>{value.name} </span>
//                                   })
//                                 } will be asked to respond.
//                         </span>
//                             }
//                               placement='leftTop'
//                               onConfirm={() => this.execRunNow(userTeamSync._id)}
//                             >
//                               <Tooltip title="Run now">
//                                 <Button icon="thunderbolt" shape="circle"
//                                 // onClick={() => this.execRunNow(userTeamSync._id)}
//                                 />
//                               </Tooltip>
//                             </Popconfirm> : ''
//                         }
//                         <span style={{ padding: 4 }} />
//                         <Dropdown
//                           overlay={this.standup_settings_menu(userTeamSync._id, userTeamSync.createInstance)}
//                           placement="bottomRight"
//                         >
//                           <Button shape="circle" icon="setting" />
//                         </Dropdown>
//                       </span>
//                       :
//                       ''
//                     }
//                   </span>


//                 ]}
//               >
//                 {/* <Content extra={extraContent}>{renderContent()}</Content> */}
//               </PageHeader>
//               {/* <Fragment > */}
//               <Content style={{ minHeight: "100%" }}>
//                 <div
//                   style={{
//                     // backgroundColor: "#FAFAFA ",
//                     // backgroundColor: "rgb(255,255,255)",
//                     // paddingLeft: 57,
//                     paddingLeft: 24,
//                     paddingRight: 24,
//                     paddingTop: 6,
//                     paddingBottom: 6,
//                     boxShadow: "rgba(0,0,0,0.1) 0 1px 0 0",
//                     zIndex: "999",
//                     position: "relative",
//                     textAlign: "center"
//                   }}
//                 >
//                   <Button.Group size="small">
//                     {!this.props.previousInstanceNotAvailable ? (
//                       <span>
//                         {!this.state.loading ?
//                           <Button
//                             type='link'
//                             // loading={this.state.loading}
//                             onClick={() =>
//                               this.getAnotherInstance(true, false)
//                             }
//                             icon="left"
//                           >
//                             Previous
//                       </Button>
//                           :
//                           <Button type='link' disabled icon="left">
//                             Previous
//                     </Button>
//                         }
//                       </span>

//                     ) : (
//                         <Button type='link' disabled icon="left">
//                           Previous
//                         </Button>
//                       )}
//                     <span style={{ padding: 6, fontWeight: "800" }}>
//                       {" "}
//                       {this.props.teamSyncInstance ? (
//                         <b>
//                           {moment(
//                             this.props.teamSyncInstance.created_at
//                           ).format("DD  MMM")}
//                         </b>
//                       ) : (
//                           ""
//                         )}
//                     </span>
//                     {!this.props.nextInstanceNotAvailable ? (
//                       this.state.islatestinstance ? (
//                         <span>
//                           {!this.state.loading ?
//                             <Button
//                               type='link'
//                               // loading={this.state.loading}
//                               onClick={() =>
//                                 this.getAnotherInstance(false, true)
//                               }
//                             >
//                               Next
//                         <Icon type='right' />
//                             </Button>

//                             :
//                             <Button type='link' disabled
//                             >
//                               Next
//                             <Icon type='right' />
//                             </Button>
//                           }

//                         </span>
//                       ) : (
//                           <Button type='link' disabled
//                           >
//                             Next
//                             <Icon type='right' />
//                           </Button>
//                         )
//                     ) : (
//                         <Button type='link' disabled
//                         >
//                           Next
//                           <Icon type='right' />
//                         </Button>
//                       )}
//                   </Button.Group>
//                   <span style={{ padding: 6 }} />
//                   <span style={{ right: "16px", position: "absolute" }}>
//                     {!this.state.noInstance ?
//                       <span>
//                         <span style={{ padding: 6 }} />
//                         <Popconfirm
//                           title='This will delete the current report.'
//                           onConfirm={() => this.deleteTeamSyncInstance(this.props.projectTeamSyncInstance, this.props.previousInstanceNotAvailable, this.props.nextInstanceNotAvailable)}
//                           okText='Delete'
//                           placement='leftTop'
//                         >
//                           <Tooltip placement='top' title='Delete'>
//                             <Button size='small' type='circle' style={{ marginLeft: "5px", float: 'right' }} icon='delete'></Button>
//                           </Tooltip>
//                         </Popconfirm>
//                         <span style={{ padding: 6 }} />
//                         <Popconfirm
//                           title='This will download the  current report in csv format.'
//                           onConfirm={this.exportToCsv}
//                           okText='Export'
//                           placement='leftTop'
//                         >
//                           <Tooltip placement='top' title='Export'>
//                             <Button
//                               type='circle' size='small' style={{ marginLeft: "5px", float: 'right' }} icon='download'
//                             >
//                             </Button>
//                           </Tooltip>
//                         </Popconfirm>
//                       </span> : ''
//                     }

//                   </span>

//                 </div>
//                 <div
//                   style={{
//                     // backgroundColor: "#FAFAFA ",
//                     // paddingLeft: 57,
//                     // paddingTop: 32,
//                     // paddingRight: 57,
//                     height: "100vh",
//                     zIndex: "10",
//                     width: '100%'
//                   }}
//                 >
//                   {!this.state.noInstance ? (
//                     <Table
//                       scroll={{ x: "max-content" }}
//                       style={{ width: "100%", marginBottom: '150px' }}
//                       // loading={this.state.loading}
//                       bordered={true}
//                       pagination={false}
//                       columns={columns}
//                       dataSource={instanceResponses}
//                     />
//                   ) :
//                     <Table
//                       pagination={false}
//                       columns={emptyColumns}
//                       dataSource={emptyData}
//                       loading={this.state.loading}
//                     />
//                   }
//                 </div>
//                 {/* </Fragment> */}
//               </Content>
//               {/* {console.log('All ============> ', this.props.userTeamSync)} */}
//             </Layout>
//             // </Fragment>

//           )}
//         {/* </div> */}
//       </div>
//     );
//   }
// }

// const mapStateToProps = state => ({
//   teamSync: state.skills.currentteamsync,
//   teamSyncs: state.skills.userTeamSyncs,
//   projectTeamSyncInstance: state.skills.projectTeamSyncInstance,
//   instanceResponses: state.skills.instanceResponses,
//   nextInstanceNotAvailable: state.skills.nextInstanceNotAvailable,
//   teamSyncInstance: state.skills.projectTeamSyncInstance,
//   previousInstanceNotAvailable: state.skills.previousInstanceNotAvailable,
//   userTeamSync: state.skills.userTeamSync,
//   skills: state.skills.skills,
//   assistant: state.skills.team
// });
// export default withRouter(
//   connect(mapStateToProps, {
//     SkillsAction,
//     getUserTeamSync,
//     getUsersSelectedTeamSync,
//     getProjectTeamSyncInstance,
//     getAnotherInstancePage,
//     editTeamSync,
//     excecuteTeamSync,
//     deleteteamsync,
//     setCurrentTeamsync,
//     sendTeamsyncAck,
//     exportToCsv,
//     deleteTeamInstance,
//     getJiraUserActivity,
//     getAssisantSkills
//   })(MyStandups)
// );
