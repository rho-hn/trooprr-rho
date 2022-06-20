// import React, { Component, Fragment } from "react";
// import { connect } from "react-redux";
// import { withRouter } from "react-router-dom";
// import { Icon as LegacyIcon } from "@ant-design/compatible";
// import {
//   Card,
//   Typography,
//   Row,
//   Col,
//   Tooltip,
//   PageHeader,
//   Avatar,
//   Tag,
//   Select,
//   DatePicker,
//   Popconfirm,
//   Button,
//   Result,
//   Dropdown,
//   Menu,
//   Badge,
//   Modal,
// } from "antd";
// import axios from "axios";
// import { DownloadOutlined, EllipsisOutlined } from "@ant-design/icons";
// import Pdf from "./ReoprtPdf";
// import { getStandupHistory, getStandupCsvReport, sendReportEmail } from "../skills_action";
// import moment from "moment";

// const { Text } = Typography;
// const { Option } = Select;
// const { RangePicker } = DatePicker;

// class StandupHistory extends Component {
//   _isMounted = false;
//   constructor(props) {
//     super(props);
//     this.state = {
//       defaultRangePickerValue: [],
//       defaultRangeValue: [],
//       selectedMembers: [],
//       instanceIds: [],
//       instanceResponses: [],
//       loading: true,
//       userSelected: false,
//       showMore: false,
//       responseDataEmpty: true,
//       allMembers: [],
//       membersReady: false,
//       downloadCsvModal: false,
//       sendEmailModal: false,
//     };
//   }

//   componentDidMount() {
//     // const today = new Date();
//     // // today.setHours(23, 59, 0);
//     // const Today = new Date(today);
//     // const yesterday = new Date();
//     // yesterday.setDate(yesterday.getDate() - 1);
//     // // yesterday.setHours(0, 0, 0);

//     let today = new Date();
//     let yesterday = new Date(today);
//     yesterday.setDate(yesterday.getDate() - 1);

//     today.setHours(23, 59, 0);

//     // console.log(
//     //   new Date(today),
//     //   new Date(new Date(yesterday).setHours(0, 0, 0))
//     // );

//     // const Yesterday = new Date(yesterday);
//     let defaultRangePickerValue = [moment(yesterday, "YYYY-MM-DD"), moment(today, "YYYY-MM-DD")];
//     let defaultRangeValue = [new Date(new Date(yesterday).setHours(0, 0, 0)), new Date(today)];
//     this.setState({ defaultRangeValue, defaultRangePickerValue });
//     this.props.match.params.history_user_id &&
//       this.setState({
//         selectedMembers: [this.props.match.params.history_user_id],
//         // startDate: new Date(new Date(yesterday).setHours(0, 0, 0)),
//         // endDate: new Date(today),
//       });
//     let data = {
//       startAt: 0,
//       startDate: new Date(new Date(yesterday).setHours(0, 0, 0)),
//       endDate: new Date(today),
//     };
//     if (this.props.match.params.history_user_id) {
//       data.user_id = this.props.match.params.history_user_id;
//     }
//     //for guest user
//     if (this.props.match.params.history_user_slack_id) {
//       data.user_slack_id = this.props.match.params.history_user_slack_id;
//     }

//     this.setState({ loading: true });
//     this.props.getStandupHistory(this.props.match.params.wId, this.props.match.params.tId, data).then((res) => {
//       if (res.data.success) {
//         let tmp;
//         res.data.responses.length == 0 && this.setState({ responseDataEmpty: true });

//         tmp = res.data.responses.find((val) => val.status == "replied");
//         tmp ? this.setState({ responseDataEmpty: false }) : this.setState({ responseDataEmpty: true });
//         this.props.userTeamSync.standuptype == "planning_poker" && this.checkPlanningPokerRes();
//         this.setState({ loading: false });
//         this.getSelectedMemberdata();
//       }
//     });

//     // to check next page is available or not

//     axios
//       .get(`/api/${this.props.match.params.wId}/teamSync/${this.props.match.params.tId}/userResponses`, {
//         params: {
//           startAt: 100,
//           startDate: data.startDate,
//           endDate: data.endDate,
//           user_id: data.user_id,
//         },
//       })
//       .then((res) => {
//         if (res.data.success && res.data.responses.length > 0) {
//           this.setState({ showMore: true });
//         }
//       });
//   }

//   componentDidUpdate(prevProps) {
//     if (prevProps.userTeamSync != this.props.userTeamSync) {
//       this.getSelectedMemberdata();
//     }
//   }

//   getSelectedMemberdata = () => {
//     const { userTeamSync, members } = this.props;

//     if (userTeamSync.selectedMembers && userTeamSync.selectedMembers[0].name) {
//       // console.log('here',userTeamSync)

//       this.setState(
//         {
//           allMembers: userTeamSync.selectedMembers,
//           membersReady: true,
//         },
//         () => {
//           if (userTeamSync.isShared) {
//             this.getGuestUser();
//           }
//         }
//       );
//     } else {
//       // console.log('here 2',userTeamSync)
//       let allMembers = [];
//       userTeamSync.selectedMembers &&
//         userTeamSync.selectedMembers.forEach((mem) => {
//           let tmp = members && members.find((val) => val.user_id._id == mem);

//           tmp && allMembers.push(tmp);
//         });
//       this.setState({ allMembers, membersReady: true }, () => {
//         if (userTeamSync.isShared) {
//           this.getGuestUser();
//         }
//       });
//     }
//   };

//   getGuestUser = () => {
//     const { userTeamSync } = this.props;

//     let allMembers = [...this.state.allMembers];

//     userTeamSync.guestusersInfo &&
//       userTeamSync.guestusersInfo.length > 0 &&
//       userTeamSync.guestusersInfo.forEach((mem) => {
//         allMembers.push(mem);
//       });

//     this.setState({
//       allMembers: allMembers,
//     });
//   };

//   // sortInstances = () => {
//   //   let allIds = this.props.standupHistory.responses.map(
//   //     (res) => res.question_instance_id
//   //   );
//   //   let instanceIds = [...new Set(allIds)];
//   //   this.setState({ instanceIds });
//   //   this.groupInstances(
//   //     this.props.standupHistory.responses,
//   //     "question_instance_id"
//   //   );
//   // };

//   // groupInstances(array, property) {
//   //   var hash = {};
//   //   for (var i = 0; i < array.length; i++) {
//   //     if (!hash[array[i][property]]) hash[array[i][property]] = [];
//   //     hash[array[i][property]].push(array[i]);
//   //   }
//   //   this.setState({ instanceResponses: hash, loading: false });
//   // }

//   getInitials(string) {
//     // return string
//     //   .trim()
//     //   .split(" ")
//     //   .map(function (item) {
//     //     if (item.trim() != "") {
//     //       return item[0].toUpperCase();
//     //     } else {
//     //       return;
//     //     }
//     //   })
//     //   .join("")
//     //   .slice(0, 2);

//     if (string) {
//       let nameArr = string
//         .trim()
//         .replace(/\s+/g, " ") //remove extra spaces
//         .split(" ");

//       if (nameArr.length > 1) return (nameArr[0][0] + nameArr[1][0]).toUpperCase();
//       else return nameArr[0].slice(0, 2).toUpperCase();
//     } else return "";
//   }

//   getTimeDate = (timezone) => {
//     let date = new Date().toLocaleString("en-US", { timeZone: timezone });
//     let options = { timeZoneName: "long", timeZone: timezone };
//     let tz = new Date().toLocaleString("en-US", options).split(" ");
//     let tzName = tz[3] + " " + tz[4] + " " + tz[5];
//     return moment(date).format("ddd hh:mm A") + " " + this.getInitials(tzName);
//   };

//   disabledDate = (current) => {
//     // to do addition in date
//     //   function addDays(theDate, days) {
//     //     return new Date(theDate.getTime() + days*24*60*60*1000);
//     // }

//     // var newDate = addDays(new Date(), 5);

//     const today = new Date();
//     const yesterday = new Date(today);

//     const firstInstance = moment("2020-07-9", "YYYY-MM-DD");
//     const lastInstance = moment("2020-08-5", "YYYY-MM-DD");
//     return current < firstInstance || current > lastInstance;
//   };

//   findUser = (response) => {
//     const { userTeamSync, members } = this.props;
//     if (response && response.user_id) {
//       const id = response.user_id;
//       if (userTeamSync.selectedMembers && userTeamSync.selectedMembers.length > 0 && members.length > 0) {
//         let user = userTeamSync.selectedMembers && userTeamSync.selectedMembers.find((mem) => mem._id == id);

//         if (user) {
//           return user.name;
//         } else {
//           user = members && members.find((mem) => mem.user_id._id == id);
//           if (user) {
//             return user.user_id.name;
//           } else {
//             return "";
//           }
//         }
//       }
//     } else if (response && response.metadata && response.metadata.sharedUserName) {
//       return response.metadata.sharedUserName;
//     } else {
//       const userFound =
//         userTeamSync.guestusersInfo &&
//         userTeamSync.guestusersInfo.find((user) => user.user_slack_id == response.user_slack_id);
//       return userFound ? userFound.name : "";
//     }
//   };

//   getAvatarInitials = (response) => {
//     let username = this.findUser(response);
//     return username && this.getInitials(username);
//   };

//   getProfilePicUrl = (id) => {
//     const { userTeamSync, members } = this.props;

//     if (userTeamSync.selectedMembers.length > 0 && members.length > 0) {
//       let user = userTeamSync.selectedMembers && userTeamSync.selectedMembers.find((mem) => mem._id == id);

//       if (user) {
//         return user.profilePicUrl;
//       } else {
//         user = members && members.find((mem) => mem.user_id._id == id);
//         if (user) {
//           return user.user_id.profilePicUrl;
//         } else {
//           return "";
//         }
//       }
//     }
//   };

//   getResData = (id) => {
//     let res = this.props.user.responses.find((val) => val.question_instance_id == id);
//     return {
//       date: moment(res.created_at).format(" DD MMM YYYY"),
//       day: moment(res.created_at).format("dddd"),
//       name: res.name,
//     };
//   };

//   checkUser = (value) => {
//     const { userTeamSync } = this.props;
//     const guestUser = userTeamSync.guestusersInfo.find((usr) => usr.user_slack_id == value);
//     if (guestUser) {
//       return true;
//     } else {
//       return false;
//     }
//   };

//   checkPlanningPokerRes = () => {
//     //we are doing this, when standup is "planning_poker" and user is on holiday then we are not considering that res,
//     // so here we are checking, if all the res is on holiday or not, if all res is on holiday, then responseData is empty
//     const { standupHistory } = this.props;
//     if (!this.state.responseDataEmpty) {
//       let tmp = false;
//       tmp = standupHistory && standupHistory.responses.filter((res) => res.isHoliday == false);
//       tmp.length == 0 && this.setState({ responseDataEmpty: true });
//     }
//   };

//   handleUserChange = (value) => {
//     const { userTeamSync } = this.props;
//     // console.log('select value',value)
//     this.setState({ showMore: false });
//     this.setState({ selectedMembers: value, userSelected: true });

//     let data = {
//       startAt: 0,
//       startDate: new Date(new Date(this.state.defaultRangeValue[0]).setHours(0, 0, 0)),
//       endDate: new Date(new Date(this.state.defaultRangeValue[1]).setHours(23, 59, 0)),
//     };
//     let user_id = [],
//       user_slack_id = [];

//     if (!userTeamSync.isShared && value.length > 0) {
//       data.user_id = value;
//     }

//     if (userTeamSync.isShared && value.length > 0) {
//       // data.user_id = value;

//       value.forEach((val) => {
//         if (this.checkUser(val)) {
//           user_slack_id.push(val);
//         } else {
//           user_id.push(val);
//         }
//       });
//     }
//     if (user_id.length > 0) data.user_id = user_id;
//     if (user_slack_id.length > 0) data.user_slack_id = user_slack_id;

//     this.props.getStandupHistory(this.props.match.params.wId, this.props.match.params.tId, data).then((res) => {
//       if (res.data.success) {
//         let tmp;
//         res.data.responses.length == 0 && this.setState({ responseDataEmpty: true });

//         tmp = res.data.responses.find((val) => val.status == "replied");

//         tmp ? this.setState({ responseDataEmpty: false }) : this.setState({ responseDataEmpty: true });
//         userTeamSync.standuptype == "planning_poker" && this.checkPlanningPokerRes();
//         this.setState({ loading: false });
//       }

//       //to check for next page
//       axios
//         .get(`/api/${this.props.match.params.wId}/teamSync/${this.props.match.params.tId}/userResponses`, {
//           params: {
//             startAt: res.data.startAt + 100,
//             startDate: data.startDate,
//             endDate: data.endDate,
//             user_id: user_id,
//             user_slack_id: user_slack_id,
//           },
//         })
//         .then((res) => {
//           if (res.data.success && res.data.responses.length > 0) {
//             this.setState({ showMore: true });
//           }
//         });
//     });
//   };

//   rangeChange = (value) => {
//     const { userTeamSync } = this.props;
//     // let defaultRangeValue = [moment(value[0]), moment(value[1])];
//     // this.setState({ defaultRangeValue });
//     this.setState({ showMore: false });
//     const startDate = value[0].format();
//     const EndDate = value[1].format();

//     // console.log(
//     //   new Date(new Date(startDate).setHours(0, 0, 0)),
//     //   new Date(new Date(EndDate).setHours(23, 59, 0))
//     // );

//     let defaultRangePickerValue = value;
//     let defaultRangeValue = [startDate, EndDate];

//     this.setState({ defaultRangeValue, defaultRangePickerValue });
//     let data = {
//       startAt: 0,
//       startDate: new Date(new Date(startDate).setHours(0, 0, 0)),
//       endDate: new Date(new Date(EndDate).setHours(23, 59, 0)),
//     };

//     let user_id = [],
//       user_slack_id = [];
//     if (!userTeamSync.isShared && this.state.selectedMembers.length > 0) {
//       data.user_id = this.state.selectedMembers;
//     }
//     if (userTeamSync.isShared && this.state.selectedMembers.length > 0) {
//       this.state.selectedMembers.forEach((val) => {
//         if (this.checkUser(val)) {
//           user_slack_id.push(val);
//         } else {
//           user_id.push(val);
//         }
//       });
//     }
//     if (user_id.length > 0) data.user_id = user_id;
//     if (user_slack_id.length > 0) data.user_slack_id = user_slack_id;

//     this.props.getStandupHistory(this.props.match.params.wId, this.props.match.params.tId, data).then((res) => {
//       if (res.data.success) {
//         let tmp;
//         res.data.responses.length == 0 && this.setState({ responseDataEmpty: true });

//         tmp = res.data.responses.find((val) => val.status == "replied");
//         tmp ? this.setState({ responseDataEmpty: false }) : this.setState({ responseDataEmpty: true });
//         userTeamSync.standuptype == "planning_poker" && this.checkPlanningPokerRes();
//         this.setState({ loading: false });
//       }

//       //to check for next page
//       axios
//         .get(`/api/${this.props.match.params.wId}/teamSync/${this.props.match.params.tId}/userResponses`, {
//           params: {
//             startAt: res.data.startAt + 100,
//             startDate: data.startDate,
//             endDate: data.endDate,
//             user_id: data.user_id,
//             user_slack_id: data.user_slack_id,
//           },
//         })
//         .then((res) => {
//           if (res.data.success && res.data.responses.length > 0) {
//             this.setState({ showMore: true });
//           }
//         });
//     });
//   };

//   showMore = () => {
//     const { userTeamSync } = this.props;

//     this.setState({ showMore: false });
//     let data = {
//       startAt: this.props.standupHistory.startAt + 100,
//       startDate: new Date(new Date(this.state.defaultRangeValue[0]).setHours(0, 0, 0)),
//       endDate: new Date(new Date(this.state.defaultRangeValue[1]).setHours(23, 59, 0)),
//     };

//     let user_id = [],
//       user_slack_id = [];
//     if (!userTeamSync.isShared && this.state.selectedMembers.length > 0) {
//       data.user_id = this.state.selectedMembers;
//     }
//     if (userTeamSync.isShared && this.state.selectedMembers.length > 0) {
//       // data.user_id = value;

//       this.state.selectedMembers.forEach((val) => {
//         if (this.checkUser(val)) {
//           user_slack_id.push(val);
//         } else {
//           user_id.push(val);
//         }
//       });
//     }
//     if (user_id.length > 0) data.user_id = user_id;
//     if (user_slack_id.length > 0) data.user_slack_id = user_slack_id;

//     const showMore = "true";

//     this.props
//       .getStandupHistory(this.props.match.params.wId, this.props.match.params.tId, data, showMore)
//       .then((res) => {
//         if (res.data.success) {
//           let tmp;
//           res.data.responses.length == 0 && this.setState({ responseDataEmpty: true });

//           tmp = this.props.standupHistory.responses.find((val) => val.status == "replied");
//           tmp ? this.setState({ responseDataEmpty: false }) : this.setState({ responseDataEmpty: true });
//           userTeamSync.standuptype == "planning_poker" && this.checkPlanningPokerRes();
//           this.setState({ loading: false });
//         }
//         //to check for next page
//         axios
//           .get(`/api/${this.props.match.params.wId}/teamSync/${this.props.match.params.tId}/userResponses`, {
//             params: {
//               startAt: res.data.startAt + 100,
//               startDate: data.startDate,
//               endDate: data.endDate,
//               user_id: data.user_id,
//               user_slack_id: data.user_slack_id,
//             },
//           })
//           .then((res) => {
//             if (res.data.success && res.data.responses.length > 0) {
//               this.setState({ showMore: true });
//             }
//           });
//       });
//   };

//   handleSendEmail = () => {
//     let data = {
//       // startAt: this.props.standupHistory.startAt,
//       startDate: new Date(new Date(this.state.defaultRangeValue[0]).setHours(0, 0, 0)),
//       endDate: new Date(new Date(this.state.defaultRangeValue[1]).setHours(23, 59, 0)),
//       user_id: this.state.selectedMembers,
//       exactStartDate: this.state.defaultRangePickerValue[0].format("YYYY-M-D"),
//       exactEndDate: this.state.defaultRangePickerValue[1].format("YYYY-M-D"),
//     };

//     // console.log(this.state.defaultRangePickerValue[0].format('DD MMM YYYY'),this.state.defaultRangePickerValue[1].format('DD MMM YYYY'))
//     // console.log(data)
//     this.props.sendReportEmail(this.props.match.params.wId, this.props.match.params.tId, data).then((res) => {});
//     this.setState({ sendEmailModal: !this.state.sendEmailModal });
//   };

//   downloadCsv = () => {
//     let data = {
//       // startAt: this.props.standupHistory.startAt,
//       startDate: new Date(new Date(this.state.defaultRangeValue[0]).setHours(0, 0, 0)),
//       endDate: new Date(new Date(this.state.defaultRangeValue[1]).setHours(23, 59, 0)),
//       user_id: this.state.selectedMembers,
//     };
//     this.props.getStandupCsvReport(this.props.match.params.wId, this.props.match.params.tId, data).then((res) => {
//       this.download(res.data);
//     });
//   };

//   download = (data) => {
//     const { userTeamSync, standupHistory } = this.props;
//     // let date = moment(this.props.projectTeamSyncInstance.created_at).format(
//     //   "D  MMM"
//     // );

//     // let reportname = this.props.projectTeamSyncInstance.teamSync_metdata.name;
//     // let fileName = `Troopr_${reportname}_${date}.csv`;
//     let betweenDates = [
//       moment(this.state.defaultRangeValue[0]).format("D MMM"),
//       moment(this.state.defaultRangeValue[1]).format("D MMM"),
//     ];

//     let selectedMembersName = [];

//     this.state.selectedMembers.length > 0 &&
//       this.state.selectedMembers.forEach((mem) => {
//         let user = userTeamSync.selectedMembers.find((val) => val._id == mem);
//         user.name && selectedMembersName.push(user.name);
//       });

//     let fileName = `${userTeamSync.name} between ${betweenDates[0]} and ${betweenDates[1]} from ${
//       selectedMembersName.length > 0
//         ? selectedMembersName.map((name) => {
//             return name;
//           })
//         : "all users"
//     }.csv`;

//     const dataBlob = new Blob([data], { type: "text/csv" });
//     const url = window.URL.createObjectURL(dataBlob);
//     const a = document.createElement("a");
//     a.setAttribute("hidden", "");
//     a.setAttribute("href", url);
//     a.setAttribute("download", fileName);
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);

//     this.setState({ downloadCsvModal: !this.state.downloadCsvModal });
//   };

//   getSelectedMembersforName = () => {
//     let selectedMembersName = [];

//     this.state.selectedMembers.length > 0 &&
//       this.state.selectedMembers.forEach((mem) => {
//         let user = this.props.userTeamSync.selectedMembers.find((val) => val._id == mem);
//         user.name && selectedMembersName.push(user.name);
//       });

//     return selectedMembersName;
//   };
//   getPopConfirmText = () => {
//     const { userTeamSync, standupHistory } = this.props;

//     let betweenDates = [
//       moment(this.state.defaultRangeValue[0]).format("D MMM"),
//       moment(this.state.defaultRangeValue[1]).format("D MMM"),
//     ];

//     let selectedMembersName = [];

//     userTeamSync.selectedMembers &&
//       this.state.selectedMembers.length > 0 &&
//       this.state.selectedMembers.forEach((mem) => {
//         let user = userTeamSync.selectedMembers.find((val) => val._id == mem);
//         user.name && selectedMembersName.push(user.name);
//       });

//     let title = `This will export responses for ${userTeamSync.name} between ${betweenDates[0]} and ${
//       betweenDates[1]
//     } from ${
//       selectedMembersName.length > 0
//         ? selectedMembersName.map((name) => {
//             return name;
//           })
//         : "all users"
//     } in CSV format`;

//     return title;
//   };

//   getEmailText = () => {
//     const { userTeamSync, standupHistory } = this.props;

//     let betweenDates = [
//       moment(this.state.defaultRangeValue[0]).format("D MMM"),
//       moment(this.state.defaultRangeValue[1]).format("D MMM"),
//     ];

//     let selectedMembersName = [];

//     userTeamSync.selectedMembers &&
//       this.state.selectedMembers.length > 0 &&
//       this.state.selectedMembers.forEach((mem) => {
//         let user = userTeamSync.selectedMembers.find((val) => val._id == mem);
//         user.name && selectedMembersName.push(user.name);
//       });

//     let title = `This will send responses for ${userTeamSync.name} between ${betweenDates[0]} and ${
//       betweenDates[1]
//     } from ${
//       selectedMembersName.length > 0
//         ? selectedMembersName.map((name) => {
//             return name;
//           })
//         : "all users"
//     } in email`;

//     return title;
//   };

//   getSelectedMemberName = () => {
//     const { userTeamSync, standupHistory } = this.props;
//     let selectedMembersName = [];

//     this.state.selectedMembers.length > 0 &&
//       this.state.selectedMembers.forEach((mem) => {
//         let user = userTeamSync.selectedMembers.find((val) => val._id == mem);
//         user.name && selectedMembersName.push(user.name);
//       });

//     return selectedMembersName;
//   };

//   thredAnswer(Answer, report) {
//     let answer = Answer.replace(/&/g, "&amp;")
//       .replace(/</g, "&lt;")
//       .replace(/>/g, "&gt;")
//       .replace(/"/g, "&quot;")
//       .replace(/'/g, "&#039;");

//     // searching for urls
//     var Regex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
//     answer = answer.replace(Regex, function (url, b, c) {
//       var url2 = c == "www." ? "http://" + url : url;
//       return '<a href="' + url2 + '" target=_blank>' + url + "</a>";
//     });
//     ////searching for jira id's
//     let ids;
//     let url;
//     try {
//       ids = report;
//       ids.forEach((ele) => {
//         let regexp = new RegExp("\\b" + ele.id + "\\b", "gi");
//         url = `${ele.url}/browse/${ele.id}`;
//         const replaceText = `${ele.id} : ${ele.title}`;
//         answer = answer.replace(regexp, `<a href=${url} target=_blank>${replaceText}</a>`);
//       });
//       return answer;
//     } catch {
//       return answer;
//     }
//   }

//   getSelectValue = () => {
//     // this.props.match.params.history_user_id ?
//     // (!this.state.userSelected
//     //   ? [this.props.match.params.history_user_id]
//     //   : this.state.selectedMembers)
//     // :
//     // (
//     //   !this.state.userSelected
//     // ? [this.props.match.params.history_user_slack_id]
//     // : this.state.selectedMembers
//     // )

//     if (this.props.match.params.history_user_id && !this.state.userSelected) {
//       return [this.props.match.params.history_user_id];
//     } else if (this.props.match.params.history_user_slack_id && !this.state.userSelected) {
//       return [this.props.match.params.history_user_slack_id];
//     } else {
//       return this.state.selectedMembers;
//     }
//   };

//   downloadCsvModal = () => {
//     this.setState({ downloadCsvModal: !this.state.downloadCsvModal });
//   };

//   sendEmailModal = () => {
//     this.setState({ sendEmailModal: !this.state.sendEmailModal });
//   };

//   checkAnswer = (response, data) => {
//     let tmp = 0;

//     let ans = response.progress_report.filter(
//       (ans) => ans && ans.answer && ans.answer.plain_text && ans.answer.plain_text.length > 0
//     );
//     tmp = ans.length;
//     if (tmp != 0) {
//       return data.answer && data.answer.plain_text && data.answer.plain_text.length > 0 ? (
//         <span
//           dangerouslySetInnerHTML={{
//             __html: this.thredAnswer(data.answer.plain_text, response.unfurl_medata.jiraIds),
//           }}
//         />
//       ) : (
//         "No Answer"
//       );
//     } else {
//       return "Skipped this report";
//     }
//   };

//   getJiraIssueText = (str) => {
//     if (str && str.length > 0) {
//       let eachIssueArr = str.split("\n\n");
//       let issueDataArr = [];
//       eachIssueArr.forEach((issue) => {
//         let arr = this.getSplitedData(issue);
//         let issueUrlId = this.getIssueUrlId(arr[0]);
//         let data = {
//           url: issueUrlId.url,
//           id: issueUrlId.id,
//           data: arr[1],
//         };
//         issueDataArr.push(data);
//         // console.log("main", issueUrlId);
//       });

//       // console.log("main", issueDataArr);

//       return issueDataArr.map((issue) => {
//         return (
//           <span>
//             Updates in{" "}
//             <a href={issue.url} style={{ fontWeight: "bold" }} target='_blank'>
//               {issue.id}
//             </a>{" "}
//             {this.getIssueData(issue.data)}
//             <br />
//           </span>
//         );
//       });

//       // return str;
//     }
//   };

//   getIssueData = (str) => {
//     str = str.split("\n");
//     let name = str[0].split("*");
//     let issueDataArr = [];
//     str.forEach((data, index) => {
//       let arr = index != str.length - 1 && str[index + 1].split("*");
//       index != str.length - 1 && issueDataArr.push(arr);
//     });
//     return (
//       <span>
//         <strong>
//           :{name[1]} <br />
//         </strong>
//         {issueDataArr.map((data) => {
//           // console.log(data);
//           if (data[1] == "Assignee") {
//             let assigneeArr = data[2].split("to");
//             if (assigneeArr[1]) {
//               let assignedTo = data[2].split("to")[1];
//               assignedTo = assignedTo.slice(2).slice(0, -2);
//               assigneeArr[0] = assigneeArr[0].split("<");
//               let AssignerArr = assigneeArr[0][1].slice(0, -1).split("|");
//               AssignerArr[1] = AssignerArr[1].slice(1);
//               AssignerArr[1] = AssignerArr[1].slice(0, -1);
//               return (
//                 <span>
//                   <strong>{data[1]} </strong>
//                   {"=>"} chenged from <strong>{AssignerArr[1]}</strong> to <strong>{assignedTo}</strong>
//                   <br />
//                 </span>
//               );
//             } else if (data[2].includes("https://")) {
//               let assignedTo = data[2].split("|")[1].slice(1).slice(0, -2);
//               return (
//                 <span>
//                   <strong>{data[1]} </strong> {"=>"} <strong>{assignedTo && assignedTo}</strong>
//                   <br />
//                 </span>
//               );
//             } else {
//               let assigneeNameArr = data[2].split("`");
//               return (
//                 <span>
//                   <strong>{data[1]} </strong> {"=>"} <strong>{assigneeNameArr[1]}</strong>
//                   <br />
//                 </span>
//               );
//             }
//           } else if (data[1] == "description") {
//             // console.log(data);
//             let descData = data[2];
//             descData = descData.split("<");
//             if (descData[1]) {
//               descData[1] = descData[1].slice(0, -1).split("|");
//               descData[1][1] = descData[1][1].slice(1);
//             }
//             // console.log(descData[1]);
//             return (
//               <span>
//                 <strong>{data[1]}</strong>
//                 {descData[0]} {descData[1] && descData[1][1] && <strong>{descData[1][1]}</strong>}
//                 <br />
//               </span>
//             );
//           } else {
//             return (
//               <span>
//                 <strong>{data[1]}</strong>
//                 {data[2]}
//                 <br />
//               </span>
//             );
//           }
//         })}
//       </span>
//     );
//   };

//   getIssueUrlId = (str) => {
//     let string = str;
//     string = string.split("<");
//     string[1] = string[1].slice(0, -1).split("|");
//     // console.log(string);
//     return { id: string[1][1], url: string[1][0] };
//   };

//   getSplitedData = (str) => {
//     let n = 2;
//     var L = str.length,
//       i = -1;
//     while (n-- && i++ < L) {
//       i = str.indexOf(":", i);
//       if (i < 0) break;
//     }
//     const splitAt = (index) => (x) => [x.slice(0, index), x.slice(index)];

//     return splitAt(i)(str);
//   };

//   getTaskCheckInAnswer = (response) => {
//     const { userTeamSync } = this.props;

//     if (response.isHoliday) {
//       return response.progress_report.length == 0 ? "User is on holiday" : "";
//     } else {
//       if (response.isSkipped && response.metadata && response.metadata.jiraactivitytext == null) {
//         return response.progress_report.length == 0 ? "Skipped this report" : "";
//       } else {
//         return response.metadata.jiraactivitytext
//           ? this.getJiraIssueText(response.metadata.jiraactivitytext)
//           : /*fail safe*/ "No Update";
//       }
//     }
//   };

//   render() {
//     const { userTeamSync, standupHistory } = this.props;
//     const { instanceResponses } = this.state;

//     // let today = new Date();

//     // let yesterday = new Date(today);
//     // yesterday.setDate(yesterday.getDate() - 1);
//     // today.setHours(23, 59, 0);

//     // console.log(
//     //   new Date(today),
//     //   new Date(new Date(yesterday).setHours(0, 0, 0))
//     // );

//     return (
//       <Fragment>
//         <PageHeader
//           style={{
//             // backgroundColor: "#ffffff",
//             width: "100%",
//           }}
//           className='site-page-header-responsive'
//           title={
//             <Fragment>
//               <LegacyIcon
//                 className='trigger'
//                 type={this.props.iconState ? "menu-unfold" : "menu-fold"}
//                 onClick={this.props.collapsed}
//               />
//               <span style={{ paddingLeft: "16px" }}>
//                 {this.props.userTeamSync.name ? (
//                   <span style={{ paddingLeft: "16px" }}>
//                     {this.props.userTeamSync.name && this.props.userTeamSync.name.length > 39 ? (
//                       <Tooltip title={this.props.userTeamSync.name}>
//                         {this.props.userTeamSync.name.substring(0, 40) + "... "}
//                       </Tooltip>
//                     ) : (
//                       this.props.userTeamSync.name + " "
//                     )}
//                     History
//                   </span>
//                 ) : (
//                   ""
//                 )}
//               </span>
//             </Fragment>
//           }
//           tags={
//             this.props.userTeamSync.createInstance ? <Tag color='green'>Active</Tag> : <Tag color='orange'>Paused</Tag>
//           }
//           extra={
//             <div>
//               {/* {this.props.standupHistory &&
//                 this.state.allMembers.length > 0 && (
//                   <Pdf
//                     History={this.props.standupHistory}
//                     allMembers={this.state.allMembers}
//                   />
//                 )} */}

//               {this.props.userTeamSync.selectedMembers && (
//                 <Select
//                   value={this.getSelectValue()}
//                   style={{ width: 250, marginRight: "20px" }}
//                   mode='multiple'
//                   placeholder='Select members'
//                   onChange={this.handleUserChange}
//                   filterOption={(input, option) =>
//                     option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
//                   }
//                   allowClear
//                 >
//                   {userTeamSync.selectedMembers &&
//                     !this.state.loading &&
//                     this.state.allMembers.map((mem) => (
//                       <Option
//                         key={mem.user_id && mem.user_id._id ? mem.user_id._id : mem._id ? mem._id : mem.user_slack_id}
//                         value={mem.user_id && mem.user_id._id ? mem.user_id._id : mem._id ? mem._id : mem.user_slack_id}
//                         label={mem.user_id && mem.user_id._id ? mem.user_id._id : mem._id ? mem._id : mem.user_slack_id}
//                       >
//                         {mem.name ? mem.name : mem.user_id.name}
//                       </Option>
//                     ))}
//                 </Select>
//               )}
//               <RangePicker
//                 value={this.state.defaultRangePickerValue}
//                 /* disabledDate ={this.disabledDate}*/
//                 onChange={this.rangeChange}
//                 allowClear={false}
//               />
//               {/* <Popconfirm
//                 title={this.getPopConfirmText}
//                 onConfirm={this.downloadCsv}
//                 okText='Export'
//                 placement='leftTop'
//               >
//                 <Tooltip placement='top' title='Export as CSV'>
//                   <Button
//                     icon={<DownloadOutlined />}
//                     style={{ marginRight: "16px", marginLeft: "16px" }}
//                   ></Button>
//                 </Tooltip>
//               </Popconfirm> */}
//               {this.props.standupHistory &&
//                 this.state.allMembers.length > 0 &&
//                 userTeamSync &&
//                 (userTeamSync.standuptype == "dailystandup" ||
//                   userTeamSync.standuptype == "Daily Standup" ||
//                   userTeamSync.standuptype == "retrospective") && (
//                   <Dropdown
//                     onClick={(e) => e.preventDefault()}
//                     overlay={
//                       <Menu>
//                         <Menu.Item key='csv' onClick={this.downloadCsvModal}>
//                           Export as CSV
//                         </Menu.Item>

//                         <Menu.Item key='email' onClick={this.sendEmailModal}>
//                           Send as Email
//                         </Menu.Item>
//                       </Menu>
//                     }
//                   >
//                     <Button style={{ marginLeft: "20px" }}>
//                       <EllipsisOutlined key='ellipsis' />
//                     </Button>
//                   </Dropdown>
//                 )}

//               {/* {this.props.standupHistory && (
//                 <Pdf
//                   standupHistory={this.props.standupHistory}
//                   betweenDates={this.state.defaultRangePickerValue}
//                   selectedMembersName={this.getSelectedMemberName()}
//                 />
//               )} */}
//             </div>
//           }
//         />
//         <div
//           style={{
//             // backgroundColor: "#FAFAFA",
//             paddingLeft: "100px",
//             paddingRight: "100px",
//             paddingTop: "32px",
//             height: "100%",
//             overflow: "auto",
//           }}
//         >
//           {/* <Html /> */}
//           {!this.state.loading &&
//             (standupHistory && !this.state.responseDataEmpty ? (
//               <>
//                 <Row gutter={32}>
//                   {standupHistory &&
//                     standupHistory.responses.map((response) => {
//                       return (
//                         response.status != "asked" &&
//                         (userTeamSync.standuptype == "planning_poker" ? !response.isHoliday : true) && (
//                           <Col span={12}>
//                             <Row gutter={[32, 32]}>
//                               <Col span={24}>
//                                 <Card>
//                                   <Card.Meta
//                                     title={
//                                       <Row gutter={10}>
//                                         <Col style={{ marginTop: "5px" }}>
//                                           <div className='standup_history_badge'>
//                                             <Avatar
//                                               style={{ marginTop: "5px" }}
//                                               src={
//                                                 this.props.userTeamSync &&
//                                                 this.props.userTeamSync.selectedMembers &&
//                                                 this.getProfilePicUrl(response.user_id)
//                                               }
//                                             >
//                                               {this.props.members &&
//                                                 this.state.membersReady &&
//                                                 this.getAvatarInitials(response)}
//                                             </Avatar>
//                                             {/* </Badge> */}
//                                           </div>
//                                         </Col>
//                                         <Col>
//                                           {this.props.members && this.state.membersReady && this.findUser(response)}{" "}
//                                           {response.usermood == 1
//                                             ? "🤩"
//                                             : response.usermood == 2
//                                             ? "🙂"
//                                             : response.usermood == 3
//                                             ? "😐"
//                                             : response.usermood == 4
//                                             ? "🥵"
//                                             : response.usermood == 5
//                                             ? "🙁"
//                                             : ""}
//                                           <br />
//                                           <span
//                                             style={{
//                                               fontWeight: "normal",
//                                               fontSize: "14px",
//                                               color:
//                                                 localStorage.getItem("theme") == "dark"
//                                                   ? "rgba(255, 255, 255, 0.45)"
//                                                   : "rgba(0, 0, 0, 0.45)",
//                                             }}
//                                           >
//                                             {moment(response.responded_at).format("dddd DD MMM YYYY hh:mm A")}
//                                           </span>
//                                         </Col>
//                                       </Row>
//                                     }
//                                   />
//                                   <span>
//                                     <br />
//                                     <span>
//                                       {response.progress_report.map((data) => {
//                                         return (
//                                           <span>
//                                             <span
//                                               style={{
//                                                 wordBreak: "break-word",
//                                                 fontWeight: "bold",
//                                               }}
//                                             >
//                                               {userTeamSync.standuptype == "planning_poker" ? (
//                                                 <span>
//                                                   <a
//                                                     style={{
//                                                       fontWeight: "normal",
//                                                     }}
//                                                     href={data.question.meta && data.question.meta.url}
//                                                     target='_blank'
//                                                   >
//                                                     {data.question.meta && data.question.meta.key}
//                                                   </a>
//                                                   :{data.question.text}
//                                                 </span>
//                                               ) : (
//                                                 data.question.text
//                                               )}
//                                             </span>
//                                             <br />
//                                             <span
//                                               style={{
//                                                 wordBreak: "break-word",
//                                                 whiteSpace: "pre-line",
//                                               }}
//                                             >
//                                               {response.isSkipped ? (
//                                                 this.checkAnswer(response, data)
//                                               ) : data.answer &&
//                                                 data.answer.plain_text &&
//                                                 data.answer.plain_text.length > 0 ? (
//                                                 // data.answer.plain_text
//                                                 <span
//                                                   dangerouslySetInnerHTML={{
//                                                     __html: this.thredAnswer(
//                                                       data.answer.plain_text,
//                                                       response.unfurl_medata.jiraIds
//                                                     ),
//                                                   }}
//                                                 />
//                                               ) : response.isHoliday ? (
//                                                 userTeamSync.standuptype == "planning_poker" ? (
//                                                   "No Answer"
//                                                 ) : (
//                                                   "User is on holiday"
//                                                 )
//                                               ) : (
//                                                 "No Answer"
//                                               )}
//                                             </span>
//                                             <br />
//                                           </span>
//                                         );
//                                       })}
//                                       {/* {!response.isHoliday &&
//                                       userTeamSync.standuptype ==
//                                         "jiraissuestandup"
//                                         ? this.getJiraIssueText(
//                                             response.metadata.jiraactivitytext
//                                           )
//                                         : "User is on holiday"} */}
//                                       {userTeamSync.standuptype == "jiraissuestandup" &&
//                                         this.getTaskCheckInAnswer(response)}
//                                     </span>
//                                   </span>
//                                 </Card>
//                               </Col>
//                             </Row>
//                           </Col>
//                         )
//                       );
//                     })}
//                 </Row>
//                 {this.state.showMore && (
//                   <Button onClick={this.showMore} style={{ marginBottom: "20px", float: "right" }}>
//                     Show More
//                   </Button>
//                 )}
//               </>
//             ) : (
//               // "here"
//               <div>
//                 <Result status='404' title='No data found' />
//                 {this.state.showMore && (
//                   <Button onClick={this.showMore} style={{ marginBottom: "20px", float: "right" }}>
//                     Show More
//                   </Button>
//                 )}
//               </div>
//             ))}
//         </div>
//         <div>
//           <Modal
//             className='sidebar_dropdown'
//             // title="Confirm Task Archival"
//             visible={this.state.downloadCsvModal}
//             onOk={this.downloadCsv}
//             onCancel={this.downloadCsvModal}
//             okText='Export'
//             bodyStyle={{ width: "97%" }}
//           >
//             {this.getPopConfirmText()}
//           </Modal>
//           <Modal
//             className='sidebar_dropdown'
//             // title="Confirm Task Archival"
//             visible={this.state.sendEmailModal}
//             onOk={this.handleSendEmail}
//             onCancel={this.sendEmailModal}
//             okText='Yes'
//             bodyStyle={{ width: "97%" }}
//           >
//             {this.getEmailText()}
//           </Modal>
//         </div>
//       </Fragment>
//     );
//   }
// }

// const mapStateToProps = (state) => ({
//   userTeamSync: state.skills.userTeamSync,
//   teamSync: state.skills.currentteamsync,
//   user_now: state.common_reducer.user,
//   standupHistory: state.skills.standupHistory,
//   members: state.skills.members,
// });
// export default withRouter(
//   connect(mapStateToProps, {
//     getStandupHistory,
//     getStandupCsvReport,
//     sendReportEmail,
//   })(StandupHistory)
// );

// // getJiraIssueText = (str) => {
// //   if (str && str.length > 0) {
// //     let issueArr = str.split("\n");
// //     let issueDataArr = [];
// //     issueArr.forEach((issue, index) => {
// //       let arr = issue.split(":");
// //       let urlData = arr[0] + ":" + arr[1];
// //       urlData = urlData.slice(1);
// //       urlData = urlData.slice(0, -1);
// //       urlData = urlData.split("|");
// //       let data = {
// //         url: urlData[0],
// //         issueId: urlData[1],
// //         issueDetails: arr[2],
// //       };
// //       if (issueArr.length - 1 != index) {
// //         issueDataArr.push(data);
// //       }
// //     });
// //     return issueDataArr.map((issue) => {
// //       return (
// //         <span>
// //           <a href={issue.url} target='_blank'>
// //             {issue.issueId}
// //           </a>{" "}
// //           :{this.replaceText(issue.issueDetails)}
// //           <br />
// //         </span>
// //       );
// //     });
// //   }
// //   // return data.metadata.jiraactivitytext;
// // };

// // replaceText = (txt) => {
// //   txt = txt.split("*");
// //   txt[4] = txt[4].split("`");
// //   return (
// //     <span>
// //       {" "}
// //       <strong>{txt[1]}</strong> {txt[2]} <strong>{txt[3]}</strong> {txt[4][0]}{" "}
// //       <Text code>{txt[4][1]}</Text> {txt[4][2]} <Text code>{txt[4][3]}</Text>
// //     </span>
// //   );
// // };
