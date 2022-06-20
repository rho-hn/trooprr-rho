import React from 'react';
import { withRouter} from 'react-router-dom';
import slackLogo from '../../../media/slack_logo.png';
import {connect} from 'react-redux';

class JiraNotifIntialPage extends React.Component {
    constructor(props) {
        super(props);
             this.state={  
                 url:""
              }
          this.copyBtn=this.copyBtn.bind(this);
          this.verify = this.verify.bind(this);
       }

    copyBtn(id) {
        var copyText = document.getElementById(id);
        copyText.select();
        document.execCommand("Copy");
      }

      verify() {
        this.props.history.push("/"+this.props.workspace_id+"/skill/jira/"+this.props.skillId)
    }
    goToSlack = () => {
        const { assistant } = this.props;
        localStorage.setItem("app", "AE4FF42BA");
        const app = localStorage.getItem('app');
        const teamId = assistant.id
        let url = '';
        if(app && teamId){
          url = `https://slack.com/app_redirect?app=${app}&team=${teamId}`
        }else{
          url = `https://slack.com`;
        }
         window.location.href = url;
      }

      goToJira = () => {
        this.props.history.push("/"+this.props.match.params.wId+"/skill/jira/"+this.props.match.params.skill_id+"?view=jira_config");
     }

    // goToSlack = () => {
    //     const { assistant } = this.props;
    //     localStorage.setItem("app", "AE4FF42BA");
    //     const app = localStorage.getItem('app');
    //     const teamId = assistant.id
    //     let url = '';
    //     if(app && teamId){
    //       url = `https://slack.com/app_redirect?app=${app}&team=${teamId}`
    //     }else{
    //       url = `https://slack.com`;
    //     }
    //      window.location.href = url;
    //   }
    						
    render() {
      return( 
          <div>
          <div className="jira_notification_main_box">
             <div className="steps_box d-flex flex-column">
                 <div className="step_heading">
                    Step 1 : 
                 </div>
                 <div className="step_text"><a className="go_to_jira_link" target="_blank" href={this.props.webhook_url}>Click here</a> and then Click the button 
                     <span> “Create a WebHook” </span>
                 </div>
             </div>
             <div className="steps_box d-flex flex-column">
               <div className="step_heading  d-flex flex-column">
                       Step 2 : 
               </div>
               <div className="step_text">Enter a WebHook name as 
                    <span>“Troopr Assistant” </span>
               </div>
               <div className="d-flex">
                 <input  type="text" className="jira_notifcation_setup_input" id="jira_webhook_name"  value={"Troopr Assistant"} name="copy_projectTaskEmail" readOnly />
                      <div className="copy_btn secondary_btn  d-flex flex-shrink-0" onClick={()=>this.copyBtn("jira_webhook_name")}>Copy</div>
               </div>
             </div>
             <div className="steps_box  d-flex flex-column">
                <div className="step_heading">
                       Step 3 : 
               </div>
               <div className="step_text">Copy the url and paste it in the Url field</div>
                   <div className="d-flex">
                       <input  type="text" className="jira_notifcation_setup_input" id="jira_webhook_url"  value={"https://bot.troopr.io/bot/jira_webhook/bot"+this.props.skill_id} name="copy_projectTaskEmail"  readOnly/>
                           <div className="copy_btn secondary_btn d-flex flex-shrink-0" onClick={()=>this.copyBtn("jira_webhook_url")}>Copy</div>
                  </div>
              </div>
              <div>
             <div className="steps_box d-flex flex-column">
                <div className="step_heading">
                          Step 4 : 
                </div>
                <div className="step_text">
                    <span>Select issue related events shown below and click on "Create" at the bottom.</span>
                </div>
                <div className="final_step_text">Tick the 3 events listed below,</div>
                   <div className="d-flex justify-content-between issue_event_selection_box">
                       <div className="d-flex flex-column">
                          <div className="event_for">Issue</div>
                             <div className="event_type">Created</div>
                                <div className="event_type">Updated</div>
                       </div>
                       <div className="d-flex flex-column">
                          <div className="event_for">Comment</div>
                              <div className="event_type">Created</div>
                       </div>
                      </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    {/* <div className="nxt_btn  d-flex align-items-center justify-content-end" onClick={this.props.setOption}>
                       <i className="material-icons">arrow_back</i>Back</div> */}
                  {/* <div className="ant-btn skill_pref_action_btn  secondary_btn align-items-center ant-btn-primary ant-btn-background-ghost" onClick={this.verify}>
                            Finish
                  </div> */}
                    <div className="congrats-muted-text"></div>
                        <div className="align-items-center">
                            <div style={{marginTop: '10px',height:'40px',border:"1px solid #3f4096",borderRadius:"6px",cursor:"pointer"}} className="d-flex align-items-center justify-content-center secondary_btn" onClick={this.goToSlack}>
                                  <img style={{width:'24px',height:'24px',marginRight:'10px'}} className="" src={slackLogo} alt="->"/>
                                  <div>Go to Slack</div>
                            </div>
                            
                            <div className="go_to_jira d-flex align-items-center justify-content-center" style={{paddingBottom:"10px"}} onClick={this.goToJira}>
                                  <div>Go to Jira configuration</div>
                            </div>
                    </div>

                  {/* <div style={{marginTop: '10px',height:'40px'}} className="d-flex align-items-center justify-content-center secondary_btn" onClick={this.goToSlack}>
                                  <img style={{width:'24px',height:'24px',marginRight:'10px'}} className="" src={slackLogo} alt="->"/>
                                  <div>Go to Slack</div>
                            </div> */}
               </div>
            </div>
                        

              {/* <div className="d-flex justify-content-end align-items-center" onClick={this.props.setOption}>
                 <div className="nxt_btn  d-flex align-items-center justify-content-end">Next
                    <i className="material-icons">arrow_forward</i>
                 </div>
             </div> */}
            </div>
           
            </div>
        )
    }
}

const mapStateToProps = (state) =>({
    // assistant:state.assistant
    assistant:state.skills
 })

export default withRouter(connect(mapStateToProps,{})(JiraNotifIntialPage))
