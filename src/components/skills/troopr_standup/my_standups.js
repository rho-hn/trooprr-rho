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
//   Empty
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
//   getJiraUserActivity
// } from "../skills_action";
// import { ModalBody, ModalHeader, Modal } from "reactstrap";
// const { Text } = Typography;
// const { Meta } = Card;

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
//       isJiraLinked: ''
//     };

//     this.showmystandups = this.showmystandups.bind(this);
//     this.showreport = this.showreport.bind(this);
//     this.getAnotherInstance = this.getAnotherInstance.bind(this);
//     this.thredAnswer = this.thredAnswer.bind(this);
//     this.toggle = this.toggle.bind(this);
//   }

//   componentDidMount() {
//     this.setState({ loading: true });
//     this.props.SkillsAction(this.props.match.params.wId);
//     const parsedQueryString = queryString.parse(window.location.search);
//     if (parsedQueryString.teamsync_id) {
//       this.setState({ loading: true });
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
//               title: this.props.skillView.view,
//               url:
//                 path +
//                 `?view=my_standups&teamsync_id=${parsedQueryString.teamsync_id}&teamsync_name=${parsedQueryString.teamsync_name}`
//             };
//             window.history.pushState(obj, obj.title, obj.url);
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
//               teamSyncName:res.data.projectTeamSyncInstance.teamSync_metdata.name,
//               noInstance: false
//             });
//             let path = window.location.pathname;
//             let obj = {
//               title: this.props.skillView.view,
//               url:
//                 path +
//                 `?view=my_standups&teamsync_id=${parsedQueryString.teamsync_id}&teamsync_name=${parsedQueryString.teamsync_name}&instance=${this.state.instance}`
//             };
//             window.history.pushState(obj, obj.title, obj.url);
//           }
//         });
//     }
//     if ((parsedQueryString.teamsync_id, parsedQueryString.instance)) {
//       this.setState({ loading: true });
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
//             teamSyncName:res.data.projectTeamSyncInstance.teamSync_metdata.name,
//             noInstance: false
//           });
//           let path = window.location.pathname;
//           let obj = {
//             title: this.props.skillView.view,
//             url:
//               path +
//               `?view=my_standups&teamsync_id=${parsedQueryString.teamsync_id}&teamsync_name=${parsedQueryString.teamsync_name}&instance=${res.data.projectTeamSyncInstance._id}`
//           };
//           window.history.pushState(obj, obj.title, obj.url);
//         });
//     } else if (
//       (parsedQueryString.teamsync_id, parsedQueryString.instance == "")
//     ) {
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
//                 title: this.props.skillView.view,
//                 url:
//                   path +
//                   `?view=my_standups&teamsync_id=${parsedQueryString.teamsync_id}&teamsync_name=${parsedQueryString.teamsync_name}&instance=`
//               };
//               window.history.pushState(obj, obj.title, obj.url);
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
//       title: this.props.skillView.view,
//       url: path + `?view=my_standups`
//     };
//     window.history.pushState(obj, obj.title, obj.url);

//   }

//   showreport = (teamsyncId, teamsyncName) => () => {
//     this.setState({ teamSyncId: teamsyncId, teamSyncName: teamsyncName });
//     let path = window.location.pathname;
//     let obj = {
//       title: this.props.skillView.view,
//       url:
//         path +
//         `?view=my_standups&teamsync_id=${teamsyncId}&teamsync_name=${teamsyncName}`
//     };
//     window.history.pushState(obj, obj.title, obj.url);
//     const search = window.location.search;
//     let parsed = queryString.parse(search);
//     if (parsed.view == "my_standups" && parsed.teamsync_id) {
//       this.setState({ showreport: true });
//     }
//     this.setState({ loading: true });
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
//             title: this.props.skillView.view,
//             url:
//               path +
//               `?view=my_standups&teamsync_id=${teamsyncId}&teamsync_name=${teamsyncName}&instance=${this.state.instance}`
//           };
//           window.history.pushState(obj, obj.title, obj.url);
//         } else {
//           this.setState({ loading: false, noInstance: true });
//           let path = window.location.pathname;
//           obj = {
//             title: this.props.skillView.view,
//             url:
//               path +
//               `?view=my_standups&teamsync_id=${teamsyncId}&teamsync_name=${teamsyncName}&instance=`
//           };
//           window.history.pushState(obj, obj.title, obj.url);
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
//               title: this.props.skillView.view,
//               url:
//                 path +
//                 `?view=my_standups&teamsync_id=${this.state.teamSyncId}&teamsync_name=${this.state.teamSyncName}&instance=${this.state.instance}`
//             };
//             window.history.pushState(obj, obj.title, obj.url);
//           } else if (res.data.projectTeamSyncInstance._id == undefined) {
//             this.setState({
//               loading: false,
//               instance: res.data.projectTeamSyncInstance._id,
//               noInstance: true
//             });
//             let path = window.location.pathname;
//             let obj = {
//               title: this.props.skillView.view,
//               url:
//                 path +
//                 `?view=my_standups&teamsync_id=${this.state.teamSyncId}&teamsync_name=${this.state.teamSyncName}`
//             };
//             window.history.pushState(obj, obj.title, obj.url);
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

//   enableMenu(tsid, createInstance) {
//     if (createInstance) {
//       return (
//         <Menu>
//           <Menu.Item onClick={() => this.disable(tsid)} key="0">
//             <div>Disable</div>
//           </Menu.Item>
//           <Menu.Item key="1" onClick={() => this.execRunNow(tsid)}>
//             <div>Run Now</div>
//           </Menu.Item>
//           <Menu.Divider />
//           <Menu.Item key="2">
//             <Popconfirm
//               title="Are you sure you want to delete this standup permanently?"
//               onConfirm={() => this.deleteteamsync(tsid)}
//               okText="Yes"
//               cancelText="No"
//             >
//               <div>Delete</div>
//             </Popconfirm>
//           </Menu.Item>
//         </Menu >
//       );
//     } else {
//       return (
//         <Menu>
//           <Menu.Item onClick={() => this.enable(tsid)} key="0">
//             <div>Enable</div>
//           </Menu.Item>
//           <Menu.Divider />
//           <Menu.Item key="1" >
//             <Popconfirm
//               title="Are you sure you want to delete this standup permanently?"
//               onConfirm={() => this.deleteteamsync(tsid)}
//               okText="Yes"
//               cancelText="No"
//             >
//               <div>Delete</div>
//             </Popconfirm>
//           </Menu.Item>
//         </Menu>
//       );
//     }
//   }


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
//     this.props.deleteteamsync(_id);
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
//     //       })
//     //   }
//     // })

//     let data = {
//       teamSyncInstanceData: teamSyncInstanceData,
//       projectTeamSyncInstance: this.props.projectTeamSyncInstance.questions,
//       createdAt: date,
//       teamSyncName: this.props.projectTeamSyncInstance.teamSync_metdata.name
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

//   deleteTeamSyncInstance = (instanceId) => {
//     let wId = this.props.match.params.wId;
//     let teamSyncId = instanceId.teamSync_metdata._id;
//     this.props.deleteTeamInstance(instanceId._id, wId, teamSyncId).then(data => {
//       this.props.getProjectTeamSyncInstance(data.data.data.teamSync_metdata._id).then(res => {
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
//     this.props.getJiraUserActivity(this.props.workspace_id, user_id).then(res => {
//       if (res.success && res.activity) {
//         this.props.instanceResponses.forEach((value, index) => {
//           // if (value.user_id._id == user_id) {
            
//           if (value.user_id && value.user_id._id == user_id) {
//             res.userActivity.forEach((logs, index1) => {
//               this.props.instanceResponses[index].userActivity.jiraLogs.push(res.userActivity[index1])
//             })
//             this.props.instanceResponses[index].showJiraActivity = true
//           }else if(value._id == user_id){
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

//   render() {
//     const { teamSyncs, instanceResponses, projectTeamSyncInstance } = this.props;
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
//         className: "response_column_table_top",
//         dataIndex: "name",
//         render: (response, data) => {
//           if (data.user_id) {
//             return (
//               <Card
//                 size="small"
//                 className="response_column"
//                 style={{ border: "none" }}
//               >
//                 <Meta
//                   avatar={
//                     <Avatar
//                       size="large"
//                       style={{
//                         fontWeight: "bolder",
//                         backgroundColor: "orange"
//                       }}
//                     >
//                       <Text>{this.getInitials(data.user_id.name)}</Text>
//                     </Avatar>
//                   }
//                   title={
//                     <Text style={{ fontWeight: "bolder" }}>
//                       {data.user_id.name}
//                     </Text>
//                   }
//                   description={data.responded_at ?
//                     <Text type="secondary" style={{ fontSize: "12px" }}>
//                       Submitted at <br />
//                       {moment(data.responded_at).format("LT")}
//                     </Text> : null
//                   }
//                 />
//               </Card>
//             );
//           } else {
//             return (
//               // <Card className="response_column_table_top" style={{ border: "none" }}>
//               <Card
//               size="small"
//               className="response_column"
//               style={{ border: "none" }}
//             >
//                 <Meta
//                   avatar={
//                     <Avatar
//                       size="large"
//                       style={{
//                         fontWeight: "bolder",
//                         backgroundColor: "#80C271"
//                       }}
//                     >
//                       <Text>
//                         {this.getInitials(data.metadata.sharedUserName)}
//                       </Text>
//                     </Avatar>
//                   }
//                   title={
//                     <Text style={{ fontWeight: "bolder" }}>
//                       {data.metadata.sharedUserName}
//                     </Text>
//                   }
//                   description={data.responded_at ?
//                     <Text type="secondary" style={{ fontSize: "12px" }}>
//                       Submitted at <br />
//                       {moment(data.responded_at).format("LT")}
//                     </Text> : null
//                   }
//                 />
//               </Card>
//             );
//           }
//         },
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
//           className: "response_column_table_top",
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
//                         {activity.key} : {activity.fields.summary}
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
//                         {activity.key} : {activity.fields.summary}
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
//                           {activity.key} : {activity.fields.summary}
//                           <br />
//                         </a>
//                       ))}
//                     <a onClick={this.seemore}>
//                       {!this.state.showmore ? `See ${data.userActivity.jiraLogs.length - 5} more` : "See Less"}
//                     </a>
//                   </div>
//                 );
//               }
//             }
//             else {
//               if (data && data.status) {
//                 if(data.metadata && data.metadata.isJiraConnected){
//                   return "No activity found."
//                 }else{
//                   return <span>User not mapped.<br /><a onClick={this.gotoUserMapping}>Go to User Mapping</a></span>
//                 } 
//               }
//               else {
//                 if (data.showJiraActivity) {
//                   if (data.userNotMapped) {
//                     return <span>User not mapped.<br /><a onClick={this.gotoUserMapping}>Go to User Mapping</a></span>
//                   } else { return "No activity found." }
//                 } else {
//                     return <a onClick={this.getUserActivity(data.user_id._id)}>Get Jira activities</a>
//                 }
//               }
//             }
//             // } else {
//             //   if (data.userActivity && data.userActivity.jiraLogs.length > 0) {
//             //     return "No activity found.";

//             //   } else {
//             //     return "Jira Account was not connected at the time of submission"

//             //   }
//             // }

//           }
//         }
//       )
//     }



//     if (
//       this.props.projectTeamSyncInstance &&
//       this.props.projectTeamSyncInstance.questions
//     ) {
//       col = this.props.projectTeamSyncInstance.questions.map((datas, index) => {
//         return {
//           className: "response_column_table_top",
//           title: datas.question.text,
//           render: data => {
//             if (data.progress_report) {
//               return (
//                 <div
//                   // className="response_column_table_top"
//                   // style={{ maxWidth: "250px" }}
//                   dangerouslySetInnerHTML={{
//                     __html: this.thredAnswer(
//                       data.progress_report[index].answer.plain_text,
//                       data.unfurl_medata.jiraIds
//                     )
//                   }}
//                 ></div>
//               );
//             }
//             else {
//               return (
//                 <div> No Answer
//                 </div>)
//             }
//           }
//         };
//       });
//     }
//     if (col) {
//       col.map((value, index) => {
//         columns.splice(index + 1, 0, col[index]);
//       });
//     }

//     let respondedId = instanceResponses.map((value, index) => {
//       // return value.user_id.name
//       if(value.user_id){
//         return value.user_id.name
//       }else{
//         return value.metadata.sharedUserName
//       }
//     })

//     if (projectTeamSyncInstance && projectTeamSyncInstance._id) {
//       projectTeamSyncInstance.teamSync_metdata.selectedMembers.forEach(value => {
//         if (respondedId.indexOf(value.name) == -1) { instanceResponses.push({ user_id: { name: value.name, _id: value._id }, userActivity: { jiraLogs: [] }, showJiraActivity: false }) } else { }
//       })
//     }

//     const StandupColumns = [
//       {
//         title: "Name",
//         render: (name, response) => {
//           return (
//             <div className="response_column" style={{ minWidth: "200px" }}>
//               {name.name}
//             </div>
//           );
//         }
//       },
//       {
//         title: "Info",
//         render: info => {
//           return `Created by ${info.user_id.name} on ${moment(
//             info.created_at
//           ).format("Do MMM YYYY")}`;
//         }
//       },
//       {
//         title: "Schedule",
//         render: schedule => {
//           let finalWeekArray;
//           let weekdays;
//           if (schedule._id) {
//             let weekDaysString;
//             finalWeekArray = [];
//             if (schedule.weekdays) {
//               weekDaysString = schedule.weekdays.split(",");
//               weekDaysString.forEach(week => {
//                 if (week === "1") {
//                   finalWeekArray.push({
//                     weekName: "Mon",
//                     weekValue: week
//                   });
//                 }
//                 if (week === "2") {
//                   finalWeekArray.push({
//                     weekName: "Tue",
//                     weekValue: week
//                   });
//                 }
//                 if (week === "3") {
//                   finalWeekArray.push({
//                     weekName: "Wed",
//                     weekValue: week
//                   });
//                 }
//                 if (week === "4") {
//                   finalWeekArray.push({
//                     weekName: "Thu",
//                     weekValue: "week"
//                   });
//                 }
//                 if (week === "5") {
//                   finalWeekArray.push({
//                     weekName: "Fri",
//                     weekValue: week
//                   });
//                 }
//               });
//               weekdays = finalWeekArray;
//             }
//             if (
//               schedule.teamSync_type &&
//               (!schedule.createInstance || !schedule.jobType)
//             ) {
//               return <div>Not scheduled</div>;
//             } else {
//               return (
//                 <div>
//                   <span>Every </span>
//                   <span>
//                     {weekdays &&
//                       weekdays.map((week, i) => {
//                         if (weekdays.length === 1) {
//                           return `${week.weekName} `;
//                         } else {
//                           if (i === weekdays.length - 1) {
//                             return `and ${week.weekName} `;
//                           } else {
//                             return `${week.weekName} `;
//                           }
//                         }
//                       })}
//                   </span>
//                   <span>at {schedule.time_at}</span>
//                 </div>
//               );
//             }
//           }
//         }
//       },
//       {
//         title: "Status",
//         render: status => {
//           if (status.createInstance) {
//             return <Tag color="green">Enabled</Tag>;
//           } else {
//             return <Tag color="orange">Not Enabled</Tag>;
//           }
//         }
//       },
//       {
//         title: "",
//         render: data => {
//           if (this.state.trooprUserId === data.user_id._id) {
//             if (data.createInstance) {
//               return (
//                 <div style={{ minWidth: "200px" }}>
//                   <Button
//                     type="link"
//                     onClick={this.showreport(data._id, data.name, data)}
//                   >
//                     Show Response
//                   </Button>
//                   <Divider type="vertical" />

//                   <Dropdown
//                     overlay={this.enableMenu(data._id, data.createInstance)}
//                     trigger={["click"]}
//                   >
//                     <a>
//                       <Icon type="more" />
//                     </a>
//                   </Dropdown>
//                 </div>
//               );
//             } else {
//               return (
//                 <div style={{ minWidth: '200px' }}>
//                   <Button
//                     type="link"
//                     onClick={this.showreport(data._id, data.name, data)}
//                   >
//                     Show Response
//                   </Button>
//                   <Divider type="vertical" />
//                   <Dropdown
//                     overlay={this.enableMenu(data._id, data.createInstance)}
//                     trigger={["click"]}
//                   >
//                     <a>
//                       <Icon type="more" />
//                     </a>
//                   </Dropdown>
//                 </div>
//               );
//             }
//           } else {
//             return (
//               <div>
//                 <Button
//                   type="link"
//                   onClick={this.showreport(data._id, data.name, data)}
//                 >
//                   Show Response
//                 </Button>
//               </div>
//             );
//           }
//         }
//       }
//     ];
//     return (
//       <div>
//         <div>
//           {!this.state.showreport ? (
//             <Fragment>
//               <div className="Setting__body">
//                 <Row gutter={[16, 16]}>
//                   <Col span={24}>
//                     <div
//                       className="Assistant_Body card"
//                       pagination={false}
//                       style={{ backgroundColor: "white" }}
//                     >
//                       {teamSyncs ? (
//                         <Table
//                           loading={this.state.loading}
//                           columns={StandupColumns}
//                           dataSource={teamSyncs}
//                           onChange={this.handleChange}
//                           pagination={{ current: this.state.currentPage }}
//                         />
//                       ) : (
//                           ""
//                         )}
//                     </div>
//                   </Col>
//                 </Row>
//               </div>
//             </Fragment>
//           ) : (
//               <div className="Setting_body">
//                 <Row gutter={[16, 16]}>
//                   <Col span={24}>
//                     {!this.state.noInstance ? (
//                       <div
//                         className="Assistant_Body card"
//                         style={{ backgroundColor: "white" }}
//                       >
//                         <div>
//                           <Table
//                             loading={this.state.loading}
//                             title={() =>
//                               <div>
//                                 <Button
//                                   type='link'
//                                   onClick={this.showmystandups}
//                                   icon="arrow-left"
//                                   style={{ marginRight: "16px" }}
//                                 >
//                                   Back
//                                   </Button>

//                                 <Text className="response_column" style={{ display: "inline-flex", marginRight: "98px", maxWidth: '40vw' }}>

//                                   <b>
//                                     Responses for {this.state.teamSyncName}
//                                   </b>
//                                 </Text>
//                                 <div>
//                                   <Button.Group>
//                                     {!this.props.previousInstanceNotAvailable ? (
//                                       <Button
//                                         type='link'
//                                         loading={this.state.loading}
//                                         onClick={() =>
//                                           this.getAnotherInstance(true, false)
//                                         }
//                                         icon="left"
//                                       >
//                                         Previous
//                                       </Button>
//                                     ) : (
//                                         <Button type='link' disabled icon="left">
//                                           Previous
//                                         </Button>
//                                       )}
//                                     <Text style={{ marginRight: '7px', marginLeft: '7px' }}>
//                                       {this.props.teamSyncInstance ? (
//                                         <b>
//                                           {moment(
//                                             this.props.teamSyncInstance.created_at
//                                           ).format("D  MMM")}
//                                         </b>
//                                       ) : (
//                                           ""
//                                         )}
//                                     </Text>
//                                     {!this.props.nextInstanceNotAvailable ? (
//                                       this.state.islatestinstance ? (
//                                         <Button
//                                           type='link'
//                                           loading={this.state.loading}
//                                           onClick={() =>
//                                             this.getAnotherInstance(false, true)
//                                           }
//                                         >
//                                           Next
//                                           <Icon type='right' />
//                                         </Button>
//                                       ) : (
//                                           <Button type='link' disabled >
//                                             Next
//                                             <Icon type='right' />
//                                           </Button>
//                                         )
//                                     ) : (
//                                         <Button type='link' disabled >
//                                           Next
//                                           <Icon type='right' />
//                                         </Button>
//                                       )}
//                                   </Button.Group>

//                                   {!this.state.noInstance &&
//                                     <>

//                                       <Popconfirm
//                                         title='This will delete the current report.'
//                                         onConfirm={() => this.deleteTeamSyncInstance(this.props.projectTeamSyncInstance)}
//                                         okText='Delete'
//                                       >
//                                         <Tooltip placement='top' title='Delete'>
//                                           <Button style={{ marginLeft: "5px", float: 'right' }} icon='delete'></Button>
//                                         </Tooltip>
//                                       </Popconfirm>
//                                       <Popconfirm
//                                         title='This will download the  current report in csv format.'
//                                         onConfirm={this.exportToCsv}
//                                         okText='Export'
//                                       >
//                                         <Tooltip placement='top' title='Export'>
//                                           <Button
//                                             style={{ marginLeft: "5px", float: 'right' }} icon='download'
//                                           >
//                                           </Button>
//                                         </Tooltip>
//                                       </Popconfirm>
//                                       <Tooltip placement="top" title='Full screen'>
//                                         <Button
//                                           icon="fullscreen"
//                                           style={{ float: 'right' }}
//                                           onClick={this.toggle}
//                                         />
//                                       </Tooltip>
//                                     </>}
//                                 </div>

//                               </div>
//                             }
//                             style={{
//                               backgroundColor: "white"
//                             }}
//                             scroll={{ x: "50vw" }}
//                             columns={columns}
//                             dataSource={instanceResponses}
//                             pagination={false}
//                           />
//                         </div>
//                       </div>
//                     ) : (
//                         <div
//                           className="Assistant_Body card"
//                           pagination={false}
//                           style={{ backgroundColor: "white" }}
//                         >
//                           <Table
//                             className='time-table-row-select'
//                             pagination={false}
//                             columns={emptyColumns}
//                             dataSource={emptyData}
//                             loading={this.state.loading}
//                             title={() =>
//                               <div>
//                                 <Button
//                                   type='link'
//                                   onClick={this.showmystandups}
//                                   icon="arrow-left"
//                                   style={{ marginRight: "16px" }}
//                                 >
//                                   Back
//                           </Button>
//                                 <Text className="response_column" style={{ display: "inline-flex", marginRight: "98px", maxWidth: '40vw' }}>
//                                   <b>
//                                     Responses for {this.state.teamSyncName}
//                                   </b>
//                                 </Text>
//                               </div>
//                             }
//                           />
//                         </div>
//                       )}
//                   </Col>
//                 </Row>
//               </div>
//             )}
//         </div>
//         <Modal
//           isOpen={this.state.modalVisible}
//           toggle={this.toggle}
//           style={{
//             height: "100vh",
//             overflow: "auto",
//             backgroundColor: "white"
//           }}
//         >
//           <ModalHeader style={{ height: "50px" }}>
//             <Card
//               style={{
//                 background: "white",
//                 "z-index": "1",
//                 width: "100vw",
//                 height: "65px",
//                 border: "0px",
//                 position: "fixed",
//                 top: "0vh"
//               }}
//               title={
//                 <div>
//                   <Text className="response_column">
//                     <b>
//                       Responses for {this.state.teamSyncName} on{" "}
//                       <Text>
//                         {this.props.teamSyncInstance ? (
//                           <b>
//                             {moment(
//                               this.props.teamSyncInstance.created_at
//                             ).format("D  MMM")}
//                           </b>
//                         ) : (
//                             ""
//                           )}
//                       </Text>
//                     </b>
//                   </Text>
//                 </div>
//               }
//               extra={
//                 <div>
//                   <Button
//                     icon="close"
//                     style={{ marginRight: "50px", marginLeft: "10px" }}
//                     onClick={this.handleCancel}
//                   ></Button>
//                 </div>
//               }
//             ></Card>
//           </ModalHeader>
//           <ModalBody>
//             <Table
//               style={{
//                 marginTop: "10px",
//                 backgroundColor: "white",
//                 width: "100vw"
//               }}
//               columns={columns}
//               dataSource={instanceResponses}
//               pagination={false}
//               scroll={{ x: "100vw" }}
//             />
//           </ModalBody>
//         </Modal>
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
//   skills: state.skills.skills
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
//     getJiraUserActivity
//   })(MyStandups)
// );
