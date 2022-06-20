// import React, {Component } from 'react';
// import {connect} from 'react-redux';
// import {withRouter} from 'react-router-dom';
// import Tada from "../../../media/tada.png";
// import { getSkillData, getSkillUser, checkSlackLink } from '../skills_action';
// import slackLogo from '../../../media/slack_logo.png';
// import JiraLogo from '../../../media/Jira_logo.png';

// class JiraWelcome extends Component{

  
   
//     goToJira = () => {
//        this.props.history.push("/"+this.props.match.params.wId+"/skills/"+this.props.match.params.skill_id+"?view=connection");
//     }
   

//     componentDidMount(){
//         this.props.getSkillData(this.props.match.params.skill_id);
//         this.props.getSkillUser(this.props.match.params.wId,this.props.match.params.skill_id);
//         this.props.checkSlackLink(this.props.match.params.wId);
//     }

//     render(){
//         const { assistant_skills, assistant } = this.props;
//         const domainName = assistant_skills.skill.metadata ? assistant_skills.skill.metadata.domain_name : '';
//         const WName = assistant.name;
//         const linkedEmail = assistant_skills && assistant_skills.currentSkillUser.user_obj ? assistant_skills.currentSkillUser.user_obj.emailAddress : '';
//         return(
//           <div>
//             <div >
//                 <div >
//                     <div >

//                       <div >Congratulations!</div>
//                          <img style={{width:'30px',height:'30px',marginLeft:'10px'}} src={Tada} alt=""/>
//                     </div>

//                     <div>Jira domain '{domainName}' is now successfully connected to slack workspace '{WName}'.
//                     </div>

//                      <div>You will now be able to create and manage issues from Slack as '{linkedEmail ? linkedEmail : ''}'. You can change the user linking from Jira Personal Setting.Link below.
//                     </div>

//                     <div>Just say “/troopr jira” in any Slack channel to get started.</div>

//                     <div className="align-items-center">
//                         <div style={{marginTop: '10px',height:'40px'}} className="d-flex align-items-center justify-content-center secondary_btn" onClick={this.goToSlack}>
//                               <img style={{width:'24px',height:'24px',marginRight:'10px'}} className="" src={slackLogo} alt="->"/>
//                               <div>Go to Slack</div>
//                         </div>
//                         <div style={{marginTop: '10px',height:'40px'}} className="d-flex align-items-center justify-content-center secondary_btn" onClick={this.configureWebhook}>
//                               <img style={{width:'24px',height:'24px',marginRight:'10px'}} className="" src={JiraLogo} alt="->"/>
//                               <div>Configure Webhook*</div>
//                         </div>
//                         <div className="go_to_jira d-flex align-items-center justify-content-center" onClick={this.goToJira}>
//                               <div>Go to Personal settings</div>
//                         </div>
//                     </div>
//                 </div>
//                 <div style={{padding:'14px 18px 0 31px'}} className="congrats-muted-text-note">*requires Jira admin privileges. This Step is required for you and your team members to start receiving notifications from Jira when issues are created or updated. If you are a Jira admin in "{domainName}", it is recommended you complete this Step now. Else click the configuration page and send to send a email notification to the Jira admin. You can always come back to this configuration later by clicking <b>Assistant setting > Jira > Configure Jira.</b></div>
//             </div>
//           </div>
//         );
//     }
// }



// const mapStateToProps = (state) =>({
//    assistant:state.skills.team,
//    assistant_skills:state.skills
// })

// export default withRouter(connect(mapStateToProps,{ getSkillData,checkSlackLink,getSkillUser })(JiraWelcome));