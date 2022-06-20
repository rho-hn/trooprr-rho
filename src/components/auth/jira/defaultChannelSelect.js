// import React from "react";
// import { connect } from "react-redux";
// import { withRouter } from "react-router-dom";
// import {
//   getIssues,
//   getProject,
//   getSkillData,
//   getSkillUser,
//   getTeamData
// } from "../../skills/skills_action";
// import { getWorkspace } from "../../common/common_action";
// import axios from "axios";
// import { CheckCircleOutlined, SlackOutlined } from '@ant-design/icons';
// import { Button, Select, Modal, notification, Result, Checkbox } from "antd";

// const { Option } = Select;

// class JiraDefaults extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       issueType: {},
//       project: {},
//       channel: {},
//       loading: false,
//       field_error: false,
//       visible: true,
//       success: false,
//       step: "show_defaults",
//       autoCreateFields:{statusReport:true,
//         missingupdates:true,
//       standup:true
//       }
//     };
//     this.skip = this.skip.bind(this);
//     this.handleSubmit = this.handleSubmit.bind(this);
//     this.showConnectionStatusNotif = this.showConnectionStatusNotif.bind(this);
//     this.connectionStatusShown = false;
//   }

//   showConnectionStatusNotif(msg, desc, duration) {
//     notification.success({
//       key: "connectionStatus",
//       message: msg,
//       description: desc,
//       placement: "bottomLeft",
//       duration
//     });
//   }

//   componentDidMount() {

//     // this.props.getWorkspace(this.props.match.params.wId)

//     if (!this.props.workspace._id) {
//       this.props.getWorkspace(this.props.match.params.wId);
//     }
//     if (!this.props.team.id) {
//       this.props.getTeamData(this.props.match.params.wId).then(res => {
//         // console.log("res=>",res.data.teamId);
//         localStorage.setItem("teamId", res.data.teamId);
//       });
//     }
//     this.props.getProject(this.props.match.params.wId);
//     this.props.getSkillData(this.props.match.params.skill_id);
//     this.showConnectionStatusNotif("Jira Connection Status", "fetching...", 0);
//     if (this.props.location.state && this.props.location.state.channelId) {
//       this.setState({
//         channel: {
//           id: this.props.location.state.channelId,
//           name: this.props.location.state.channelName
//         }
//       });
//     }
//   }
//   goToNotif = () => {
//     this.props.history.push(
//       "/" +
//         this.props.match.params.wId +
//         "/skills/" +
//         this.props.match.params.skill_id +
//         "?view=channel_preferences&channel_name=" +
//         this.state.channel.name +
//         "&channel_id=" +
//         this.state.channel.id
//     );
//   };

//   goToReports = () => {
//     this.props.history.push(
//       "/" +
//         this.props.match.params.wId +
//         "/skills/" +
//         this.props.match.params.skill_id +
//         "?view=reports"
//     );
//   };
//   goToWebConfigure = () => {
//     this.props.history.push(
//       `/${this.props.match.params.wId}/jira_notification_setup/${this.props.match.params.skill_id}`
//     );
//   };

//   onChange(value, data, type) {
//     this.setState({ [type]: { name: data.props.children, id: value } });
//     if (type == "project") {
//       this.props.getIssues(this.props.match.params.wId, value);
//       this.setState({
//         issueType: {}
//       });
//     }
//   }
//   onCheckBoxChange = e => {
//     this.setState({
//       autoCreateFields: {
//         ...this.state.autoCreateFields,
//         [e.target.name]: e.target.checked
//       }
//     });
//   };
//   handleNextPage = step => {
//     if(step==="askpermissions"){
//       if(!this.state.project.id ||!this.state.issueType.id){
//         this.setState({field_error:true})
//       }else{this.setState({step})}
 
// }
// else{
//   this.setState({step})
// }
//   };

//   handleSubmit() {
//     // console.log(this.state)
//     this.setState({ loading: true, field_error: false });
//     let data = this.state;
//     let issueType=this.props.issueTypes.find(iT=>iT.text===data.issueType.name)
//     if(issueType){
//       data.issueType={id:issueType.id,name:issueType.text}
//     }

//     data.app = "Jira";
//     data.skill_id = this.props.match.params.skill_id;
//     data.timeZone = this.props.workspace.timezone;
//     // console.log(this.state, "cjjjj");

//     if (
//       this.state.issueType.id &&
//       this.state.channel.id &&
//       this.state.project.id
//     ) {
//       axios
//         .post(
//           "/bot/api/workspace/" +
//             this.props.match.params.wId +
//             "/setChannelDefault",
//           data
//         )
//         .then(res => {
//           this.setState({ loading: false });
//           if (res.data.success) {
//             // this.props.history.push("/" + this.props.match.params.wId + "/jira_welcome/" + this.props.match.params.skill_id+"?channel="+this.state.channel.name+")
//             // this.props.history.push("/" + this.props.match.params.wId + "/jira_notification_setup/" + this.props.match.params.skill_id+"?channel="+this.state.channel.name+"&project="+this.state.project.name)
//             this.setState({ step: "success" });
//             // this.props.history.push("/"+this.props.match.params.wId+"/skills/"+this.props.match.params.skill_id)
//             // this.changeStep("project_management_tool")
//           } else {
//           }
//         });
//     } else {
//       this.setState({ loading: false, field_error: true });
//     }
//   }

//   skip() {
//     if(this.state.step==="askpermissions"){
//       this.setState({ autoCreateFields:{statusReport:false,
//         missingupdates:false,
//       standup:false
// }},()=>{this.handleSubmit()})

//     }
//     if (this.props.visible) {
//       this.setState({ visible: false });
//     } else {

//       // this.props.history.push("/" + this.props.match.params.wId + "/jira_welcome/" + this.props.match.params.skill_id)
//       this.props.history.push(
//         "/" +
//           this.props.match.params.wId +
//           "/jira_notification_setup/" +
//           this.props.match.params.skill_id
//       );
//     }
//   }

//   render() {
//     const { projects, issueTypes, assistant_skills, team } = this.props;
//     const domainName = assistant_skills.skill.metadata
//       ? assistant_skills.skill.metadata.domain_name
//       : "";
//     const WName = team.name;
//     // const linkedEmail = assistant_skills && assistant_skills.currentSkillUser.user_obj ? assistant_skills.currentSkillUser.user_obj.emailAddress : '';
//     const info1 = `Jira domain '${domainName}' is now successfully connected to Slack workspace '${WName}'.`;

//     if (!this.connectionStatusShown && WName && domainName) {
//       // const { assistant_skills, assistant } = this.props;
//       // const domainName = assistant_skills.skill.metadata ? assistant_skills.skill.metadata.domain_name : '';
//       // const WName = assistant.name;
//       // const info1 = `Jira domain '${domainName}' is now successfully connected to Slack workspace '${WName}'.`
//       this.showConnectionStatusNotif("Jira Connection Status", info1, 3);
//       this.connectionStatusShown = true;
//     }

//     return (
//       <React.Fragment>
//         <Modal
//           title={
//             this.state.step==='show_defaults'
//               ? `Link your Jira Project to channel ${this.state.channel.name}`
//               : (this.state.step==="askpermissions"?'Create Reports':"")
//           }
//           visible={this.state.visible}
//           onCancel={this.skip}
//           footer={null}
//         >
//           {this.state.step == "success" && (
//             <Result
//               icon={<CheckCircleOutlined />}
//               status="success"
//               title="Done"
//               subTitle={
//                 <div>
//                   Channel: <b>{this.state.channel.name}</b> linked to jira
//                   project: <b>{this.state.project.name}</b>. Reports and
//                   Notifications are enabled.
//                 </div>
//               }
//               extra={[
//                 <Button
//                   onClick={this.goToWebConfigure}
//                   key="webhook"
//                   type="primary"
//                 >
//                   Configure Jira Webhook
//                 </Button>,
//                 <Button
//                   icon={<SlackOutlined />}
//                   href={`https://slack.com/app_redirect?team=${this.props.team.id}&channel=${this.state.channel.id}`}
//                   type="secondary"
//                   key="slack"
//                 >
//                   Go to #({this.state.channel.name})
//                 </Button>,
//                 <br />,
//                 <Button onClick={this.goToNotif} key="notification" type="link">
//                   Customize Notifications
//                 </Button>,
//                 <br />,
//                 <Button onClick={this.goToReports} type="link" key="reports">
//                   Customize Reports
//                 </Button>
//               ]}
//             />
//           )}
//           {this.state.step === "show_defaults" && (
//             <React.Fragment>
//               <div
//                 className="flex_column"
//                 style={{ marginBottom: 25, marginTop: 10 }}
//               >
//                 <div className="form_group_label">
//                   {" "}
//                   Select a default project{" "}
//                 </div>
//                 <Select
//                   showSearch
//                   style={{ width: "100%" }}
//                   placeholder="Select a project"
//                   optionFilterProp="children"
//                   onChange={(value, data) =>
//                     this.onChange(value, data, "project")
//                   }
//                   value={this.state.project.id}
//                   filterOption={(input, option) =>
//                     option.props.children
//                       .toLowerCase()
//                       .indexOf(input.toLowerCase()) >= 0
//                   }
//                 >
//                   {projects.map(item => (
//                     <Option key={item.id} value={item.id}>
//                       {item.key}
//                     </Option>
//                   ))}
//                 </Select>
//                 {this.state.field_error && !this.state.project.id && (
//                   <span className="error_message">Project is required</span>
//                 )}
//               </div>
//               <div
//                 className="flex_column"
//                 style={{ marginBottom: 25, marginTop: 10 }}
//               >
//                 <div className="form_group_label">
            
//                   Select a default Issue Type
//                 </div>
//                 <Select
//                   showSearch
//                   style={{ width: "100%" }}
//                   placeholder="Select a issue type"
//                   optionFilterProp="children"
//                   onChange={(value, data) =>
//                     this.onChange(value, data, "issueType")
//                   }
//                   value={this.state.issueType.id}
//                   filterOption={(input, option) =>
//                     option.props.children
//                       .toLowerCase()
//                       .indexOf(input.toLowerCase()) >= 0
//                   }
//                 >
//                   {issueTypes.map(issueType => (
//                     <Option key={issueType.value} value={issueType.value}>
//                       {issueType.text}
//                     </Option>
//                   ))}
//                 </Select>

//                 {this.state.field_error && !this.state.issueType.id && (
//                   <span className="error_message">IssueType is required</span>
//                 )}
//               </div>

//               <div
//                 className="row_flex"
//                 style={{ marginTop: 20, justifyContent: "flex-end" }}
//               >
//                 <Button onClick={this.skip}>Skip</Button>
//                 &nbsp; &nbsp; &nbsp;
//                 <Button
//                   type="primary"
//                   loading={this.state.loading}
//                   onClick={()=>this.handleNextPage("askpermissions")}
//                 >
//                   Link
//                 </Button>
//               </div>
//             </React.Fragment>
//           )}
//           {this.state.step === "askpermissions" && (
//             <React.Fragment>
//               <div>
//                 {" "}
//                 <Checkbox
//                   name="statusReport"
//                   defaultChecked
//                   onChange={this.onCheckBoxChange}
//                 >
//                   Create Issue By  Report scheduled every weekday at 10:00 AM
//                 </Checkbox>
//               </div>
//               <div>
//                 <Checkbox
//                   name="missingupdates"
//                   defaultChecked
//                   onChange={this.onCheckBoxChange}
//                 >
//                   Create Issue Missing Updates Report scheduled every weekday at 10:00 AM
//                 </Checkbox>
//               </div>
//               <div>
//                 {" "}
//                 {/* <Checkbox
//                   name="standup"
//                   defaultChecked
//                   onChange={this.onCheckBoxChange}
//                 >
//                   Create standup {this.state.channel.name} scheduled every weekday at 10:00AM
//                 </Checkbox> */}
//               </div>

//               <div
//                 className="row_flex"
//                 style={{ marginTop: 20, justifyContent: "flex-end" }}
//               >
//                 {/* <Button onClick={this.skip}>Skip</Button> */}
//                 &nbsp; &nbsp; &nbsp;
//                 <Button
//                   type="primary"
//                   loading={this.state.loading}
//                   onClick={this.handleSubmit}
//                 >
//                   Set up
//                 </Button>
//               </div>
//             </React.Fragment>
//           )}
          
//         </Modal>
//       </React.Fragment>
//     );
//   }
// }
// const mapStateToProps = state => {
//   // console.log("state:"+JSON.stringify(state))
//   return {
//     projects: state.skills.projects,
//     issueTypes: state.skills.issues,
//     workspace: state.common_reducer.workspace,
//     team: state.skills.team,
//     assistant_skills: state.skills
//     // a:state
//   };
// };

// export default withRouter(
//   connect(mapStateToProps, {
//     getWorkspace,
//     getIssues,
//     getProject,
//     getSkillData,
//     getSkillUser,
//     getTeamData
//   })(JiraDefaults)
// );

// // export default connect( null, { })(GitHubDefaults);
