import React,{ Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {getSmartReminders ,updateReminder, smartReminderRunNow, smartReminderDelete } from "./troopr_reminder_actions";
import SmartReminderButtons from './smart_reminder_buttons';
import "./troopr_reminder.css"


class SmartReminders extends Component {
    constructor(props) {
        super(props);
        this.state = {
          modal:false,
          deleteReminder: false,
          reminderName: ''
        }
        this.toggle=this.toggle.bind(this)
      }

    componentDidMount(){ 
      this.props.getSmartReminders(this.props.match.params.wId)
  }

  toggle = () => {
     this.setState({
         modal: !this.state.modal
      });
   };

	render() { 
    // console.log("state from smart_reminders",this.state);
    // console.log("Props from smart_reminders",this.props);
		  return(
           <div>
              <div style={{marginBottom:'24px'}} className="Setting__body Jira_setting_body d-flex flex-column ">
                  <div className="d-flex justify-content-between">
                      <div className="config_action_heading">My Smart Reminders</div>
                      <div style={{marginBottom:'24px', marginRight: '10px'}} 
                           className="skill_pref_action_btn secondary_btn" 
                           onClick={this.toggle}>Create a smart Reminder
                      </div>
                  </div>
                  {this.props.reminders.length > 0 ? this.props.reminders.map(reminder => {
                      return <div>
                                 <SmartReminderButtons reminder={reminder}/>
                             </div>
                           }) 
                            : <div style={{marginBottom:'0'}} className="Jira_preference_tag_second_issue">
                                   No reminders.
                               </div>
                     }
                </div>
                     {/* {this.state.modal && (
                       <TemplateModal
                         modal = { this.state.modal }
                         templateToggle = {this.toggle}
                         type = {"reminder"}
                       />
                    )} */}
              </div>
         );
     }
  }

const mapStateToProps = state => {
  return{
     reminders:state.reminders.smartReminders,
  }
};

export default withRouter(connect( mapStateToProps, {
     getSmartReminders,
     updateReminder,
     smartReminderRunNow,
     smartReminderDelete
     })(SmartReminders)); 
 
