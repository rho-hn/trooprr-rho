// import React, { Component, Fragment } from "react";
// import { connect } from "react-redux";
// import { withRouter } from "react-router-dom";
// import { Icon as LegacyIcon } from "@ant-design/compatible";
// import {
//   Card,
//   Typography,
//   Row,
//   Col,
//   Table,
//   Tooltip,
//   PageHeader,
//   Statistic,
//   Avatar,
//   Tag,
// } from "antd";
// import queryString from "query-string";
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
//   getAssisantSkills,
//   getTeamSyncAnalytics,
// } from "../skills_action";
// import moment from "moment";

// const { Text } = Typography;

// class Engagement extends Component {
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
//       isJiraLinked: "",
//       upcomingStandup: true,

//       collapsed: true,
//       subview: "report",
//       selectedMembers: "",
//     };
//   }

//   componentDidMount() {
//     const parsedQueryString = queryString.parse(window.location.search);

//     this.props
//       .getTeamSyncAnalytics(this.props.match.params.tId)
//       .then((res) => {});
//   }

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
//     //   .slice(0, 3);

//     if(string){
//       let nameArr = string
//       .trim()
//       .replace(/\s+/g, " ") //remove extra spaces
//       .split(" ");

//     if (nameArr.length > 1)
//       return (nameArr[0][0] + nameArr[1][0]).toUpperCase();
//     else return nameArr[0].slice(0, 2).toUpperCase();
//   }else return ""
//   }

//   getTzInitials(string) {
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
//       .slice(0, 3);
//   }

//   getTimeDate = (timezone) => {
//     let date = new Date().toLocaleString("en-US", { timeZone: timezone });
//     let options = { timeZoneName: "long", timeZone: timezone };
//     let tz = new Date().toLocaleString("en-US", options).split(" ");
//     let tzName = tz[3] + " " + tz[4] + " " + tz[5];
//     return (
//       moment(date).format("ddd hh:mm A") + " " + this.getTzInitials(tzName)
//     );
//   };

//   getProfilePicUrl = (id) => {
//     const { userTeamSync, members } = this.props;
//     if (
//       userTeamSync &&
//       userTeamSync.selectedMembers &&
//       userTeamSync.selectedMembers.length > 0 &&
//       members &&
//       members.length > 0
//     ) {
//       let user =
//         userTeamSync.selectedMembers &&
//         userTeamSync.selectedMembers.find((mem) => mem._id == id);

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

//   render() {
//     const {
//       totalResponded,
//       repliedResponsesCount,
//       totalResponses,
//       membersResponse,
//     } = this.props;
//     const standup_engagement_column = [
//       {
//         title: "Name",
//         dataIndex: "name",
//         key: "name",
//         render: (response, data) => (
//           <div
//           // style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
//           >
//             {data && data.user_id && data.user_id.name ? (
//               <span
//                 style={{
//                   display: "flex",
//                   flexDirection: "row",
//                   alignItems: "center",
//                 }}
//               >
//                 <span>
//                   <Avatar src={this.getProfilePicUrl(data.user_id._id)}>
//                     {this.getInitials(data.user_id.name)}
//                   </Avatar>
//                 </span>
//                 <span style={{ marginLeft: "10px" }}>
//                   <Text strong>{data.user_id.name}</Text>
//                   <br />
//                   <Text type='secondary'>{data.user_id.emails[0]}</Text>
//                 </span>
//               </span>
//             ) : (
//               <span
//                 style={{
//                   display: "flex",
//                   flexDirection: "row",
//                   alignItems: "center",
//                 }}
//               >
//                 <span>
//                   <Avatar>{this.getInitials(data.guestuserInfo.name)}</Avatar>
//                 </span>
//                 <span style={{ marginLeft: "10px" }}>
//                   <Text strong>{data.guestuserInfo.name}</Text>
//                   {/* <br /> */}
//                   {/* <Text type='secondary'>{data.user_id.emails[0]}</Text> */}
//                 </span>
//               </span>
//             )}
//           </div>
//         ),
//       },
//       {
//         title: "User Local Time",
//         // dataIndex: "timezone",
//         // key: "timezone"
//         render: (response, data) => {
//           // return <div>{data.user_id.timezone}</div>
//           return (
//             <div>
//               {this.getTimeDate(
//                 data.user_id
//                   ? data.user_id.timezone
//                   : this.props.user_now.timeZone
//               )}
//             </div>
//           );
//         },
//       },
//       {
//         title: "Asked",
//         // dataIndex: "received",
//         // key: "received"
//         render: (response, data) => {
//           return <div>{data.received}</div>;
//         },
//       },
//       {
//         title: "Responded",
//         // dataIndex: "responses",
//         // key: "responses"
//         render: (response, data) => {
//           return <div>{data.responses}</div>;
//         },
//       },
//       {
//         title: "Engagement",
//         // dataIndex: "engagement",
//         // key: "engagement"
//         render: (response, data) => {
//           return (
//             <div>
//               {data.participation == null ? "0%" : data.participation + "%"}
//             </div>
//           );
//         },
//       },
//     ];

//     this.props.userTeamSync &&
//       !this.props.userTeamSync.isShared &&
//       standup_engagement_column.splice(
//         4,
//         0,
//         {
//           title: "Skipped",
//           // dataIndex: "responses",
//           // key: "responses"
//           render: (response, data) => {
//             return <div>{data.skippedReports}</div>;
//           },
//         },
//         {
//           title: "Leave",
//           // dataIndex: "responses",
//           // key: "responses"
//           render: (response, data) => {
//             return <div>{data.isUserInHoliday}</div>;
//           },
//         }
//       );

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
//                     {this.props.userTeamSync.name &&
//                     this.props.userTeamSync.name.length > 59 ? (
//                       <Tooltip title={this.props.userTeamSync.name}>
//                         {this.props.userTeamSync.name.substring(0, 60) + "... "}
//                       </Tooltip>
//                     ) : (
//                       this.props.userTeamSync.name + " "
//                     )}
//                     Engagement
//                   </span>
//                 ) : (
//                   ""
//                 )}
//               </span>
//             </Fragment>
//           }
//           tags={
//             this.props.userTeamSync.createInstance ? (
//               <Tag color='green'>Active</Tag>
//             ) : (
//               <Tag color='orange'>Paused</Tag>
//             )
//           }
//         />
//         <div
//           style={{
//             paddingLeft: "24px",
//             // paddingRight: "100px",
//             paddingTop: "32px",
//             height: "100vh",
//           }}
//         >
//           <Row>
//             <Col span={16}>
//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "row",
//                   // justifyContent: "space-around"
//                 }}
//               >
//                 <div style={{ paddingRight: 16 }}>
//                   <Card>
//                     <Statistic
//                       title='Engagement'
//                       value={totalResponded ? totalResponded : ""}
//                       suffix='%'
//                     />
//                   </Card>
//                 </div>
//                 <div>
//                   <Card>
//                     <Statistic
//                       title='Responses'
//                       value={repliedResponsesCount ? repliedResponsesCount : ""}
//                       suffix={"/ " + totalResponses}
//                     />
//                   </Card>
//                 </div>
//               </div>
//               <div style={{ padding: 16 }} />
//               <Table
//                 columns={standup_engagement_column}
//                 dataSource={membersResponse}
//                 pagination={false}
//                 style={{ marginBottom: "100px" }}
//               />
//             </Col>

//             <Col span={8}>
//               <span> </span>
//             </Col>
//           </Row>
//         </div>
//       </Fragment>
//     );
//   }
// }

// const mapStateToProps = (state) => ({
//   userTeamSync: state.skills.userTeamSync,
//   totalResponses: state.skills.totalResponses,
//   membersResponse: state.skills.membersResponse,
//   totalResponded: state.skills.totalResponded,
//   repliedResponsesCount: state.skills.repliedResponsesCount,
//   members: state.skills.members,
//   user_now: state.common_reducer.user,
// });
// export default withRouter(
//   connect(mapStateToProps, {
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
//     getAssisantSkills,
//     getTeamSyncAnalytics,
//   })(Engagement)
// );
