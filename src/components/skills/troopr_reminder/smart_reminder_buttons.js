import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {getSmartReminders ,updateReminder, smartReminderRunNow, smartReminderDelete } from "./troopr_reminder_actions";
import customToast from "../../common/customToaster";
import { ToastContainer } from "react-toastify";
import DeleteModal from "../../common/confirmation-modal";

const CloseButton = ({ closeToast }) => (
  <span className="close-toaster-text" onClick={closeToast}>
    DISMISS
  </span>
);

class SmartReminderButtons extends Component {
       constructor(props) {
        super(props);
        this.state = {
          deleteReminder: false,
          runNow: false
        }
      }



   deleteReminderToggle = () => {
      this.setState({deleteReminder : !this.state.deleteReminder })
   }

   deleteReminder = (reminder) => {
    this.props.smartReminderDelete(this.props.match.params.wId, reminder._id).then(res => {
    	if(res.data.success){
    		this.setState({deleteReminder: !this.state.deleteReminder, runNow: true })
            customToast.success("Deleted successfully", {
                className:
                  "some-toast-box d-flex justify-content-between align-items-center"
              });
    	    }    
       })
   }

   runNow = (reminder) => {
    // console.log("reminder",reminder)
       this.props.smartReminderRunNow( this.props.match.params.wId, reminder._id ).then(res => {
       	if(res.data.success){
       		this.setState({runNow: true})
            customToast.success("Successfull", {
                className:
                  "some-toast-box d-flex justify-content-between align-items-center"
              });
       	   }
       })
   }

   render() {
   	const { reminder } = this.props;
   	// console.log("Props from smart_reminder_buttons",this.props);
   	// console.log("state from smart_reminder_buttons",this.state);
   	  return (
          <div>
	       <div className = "d-flex align-items-center">
	          <div className="d-flex justify-content-between align-items-center remider_item_box">
	             <div className="reminder_name">{reminder.name}</div>
	                <div className="smart_remider_toggle_btn secondary_btn" onClick={() => this.runNow(reminder)}>Run now</div>
	                  {reminder.isEnabled ?
	                     <div className="smart_remider_toggle_btn danger_secondary_btn" 
	                          onClick={()=>this.props.updateReminder(this.props.match.params.wId,reminder._id,{isEnabled:false})}>
	                            Disable
	                    </div> 
	                  : <div className="smart_remider_toggle_btn secondary_btn" 
	                         onClick={()=>this.props.updateReminder(this.props.match.params.wId,reminder._id,{isEnabled:true})}>
	                            Enable
	                    </div>
	                   }
	               </div>
	               <i className="material-icons-round delete_reminder" onClick={() => this.deleteReminderToggle()}>delete_forever</i>               
	              </div>
	                {this.state.deleteReminder && 
	                     <DeleteModal
	                       modal={this.state.deleteReminder}
	                       toggle={this.deleteReminderToggle}
	                       Task="delete"
	                       Button="Delete"
	                       data= "reminder"
	                       name={reminder.name}
	                       test={() => this.deleteReminder(reminder)}
	                  />
	                }
	                {this.state.runNow && 
                       <ToastContainer
                            closeButton={<CloseButton />}
                            hideProgressBar
                            position="bottom-left"
                      />
	                }
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
     })(SmartReminderButtons)); 
 
