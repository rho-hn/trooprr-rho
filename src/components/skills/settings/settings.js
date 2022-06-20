import React,{ Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import LauncherActionButton from './launcherActionRemove';
import LauncherActionButtonAdd from './launcherActionAdd';
import { getAllData,getAllUserActions,updateUserActions, removeUserAction, getResetUserActions } from './settings_action';
import { Button, message, Card } from 'antd';
import NavbarBreadCrumbs from '../navbar/navbarBreadCrumbs';
import {getAssisantSkills} from '../skills_action';

class AssistantSettingPage extends Component {
    constructor(props){
        super(props)
        this.state={
    	    isOpen:false
        }
      this.data = {};
    }

    handleAddMoreToggle = () => {
    	this.setState({ isOpen: !this.state.isOpen });
    }

    componentDidMount() {
      //Get all the actions
      this.props.getAllData(this.props.match.params.wId);
      //Get user based actions
      this.props.getAllUserActions(this.props.match.params.wId);

    }


    //User based buttons
    activeButtons = () => {
       const { launcherActions } = this.props;
          return launcherActions.userData
                 .map(useraction => {         
                  return (
                    <LauncherActionButton
                       handleOnClick={() => this.handleRemoveAction(useraction._id)}
                       text={useraction.actionName}
                       data = {this.data}
                     >
                       {useraction.actionName}
                    </LauncherActionButton>
                 );
              })
           }

    //Get all actions
    inactiveButtons = ( skillName ) => {
       const { launcherActions } = this.props;
       return launcherActions.actions
              .map(action => {
                 if( action.skillName === skillName){
                    return (
                      <LauncherActionButtonAdd
                         handleOnClick={() => this.handleOnClick(action)}
                         textAdd={action.actionName}
                         data = {this.data}
                      >
                        {action.actionName}
                      </LauncherActionButtonAdd>
                     )
                  } else {
                     return "";
                  }
              })
          }

    //Function to remove user actions
    handleRemoveAction = ( actionId, id) => {
      const { launcherActions } = this.props;
      // const workspaceId = this.props.match.params.wId;
          if(launcherActions.userData.length > 2) {
                this.props.removeUserAction(this.props.match.params.wId, actionId);
              } else {
                 message.warning("You need to have minimum 2 actions.");
              }
           }

    //Function to add user actions
    handleOnClick = ( id ) => {
       const { launcherActions } = this.props;
       const workspaceId = this.props.match.params.wId;
       var data = {
           userActions: {
           workspace_id: workspaceId,
           actionIds: id
          }
      }
       if(launcherActions.userData.length < 8) {
            this.props.updateUserActions(this.props.match.params.wId, data)
         } else {
            message.warning("You can add upto 8 Launcher buttons at a time. Please remove a current Launcher button to add this.");
         }
      }

        resetActions = () => {
            this.props.getResetUserActions(this.props.match.params.wId)
            .then(res => {
                if(res){
                   this.props.getAllUserActions(this.props.match.params.wId);
                   this.props.getAllData(this.props.match.params.wId);
                }
            })
          }

  	  render() {
        //  const { launcherActions } = this.props;
        //  let  paymentStatus = this.props.paymentHeader.billing_status;
  		   return(
             <div>
               <NavbarBreadCrumbs param1="Setting"   data={[{name:"Setting",url:"/"+this.props.match.params.wId+"/skill/settings"}] } workspace_Id={this.props.match.params.wId}/>
			           <div style={{overflow:'auto', height:'calc(100vh - 80px)', display:'flex', justifyContent:'center'}}>
                   <div style={{width: '60%'}} className = "">
                    <div className="Setting__body Launcher_body_padding">
                     <Card>
                       <div className="Launcher_Header">Launcher</div>
                       <div className="Launcher_Tag_First">Customize what actions show up when you say ‘hello’ to Troopr or just /troopr</div>
                       <div className="Launcher_Tag_Second">Launcher shows the most frequent actions and is fully customizable. Choose from any of the
                                                         available actions and customize as you wish.
                      </div>
                       <div className="d-flex justify-content-between align-items-center">
                        <div className="Launcher_actions_Header">Current launcher actions</div>
                          <Button type="link"className="reset_button " onClick={this.resetActions}>Reset</Button>
                      </div>
                      <div className="d-flex flex-wrap">
                         {this.activeButtons()}
                      </div>
                      <div className="Toggle__margin">
                        <div> 
                            <div className="Launcher_action_title">Troopr action buttons</div>
                              <div className="d-flex flex-wrap">
                                           {this.inactiveButtons('Troopr Task')}
                                           {this.inactiveButtons('Troopr TeamSync')}
                                           {this.inactiveButtons('Troopr Reminder')}
                              </div>
                           <div className="Launcher_action_title">Jira action buttons</div>
                               <div className="d-flex flex-wrap">
                                           {this.inactiveButtons('Jira')}
                               </div>
                           <div className="Launcher_action_title">Other action buttons</div>
                                <div className="d-flex flex-wrap">
                                           {this.inactiveButtons('Other')}
                                </div>
                        </div>    
                      </div>
                    </Card>
                  </div>
                </div>
            </div>
          </div>
			);
	}
}


const mapStateToProps = state => {
  return {
  launcherActions: state.launcherActions,
//   paymentHeader : state.common_reducer.workspace
}};     

export default withRouter(connect(mapStateToProps, 
  {
   getAllData,
   getAllUserActions,
   updateUserActions,
   removeUserAction,
   getResetUserActions ,
   getAssisantSkills
 })(AssistantSettingPage));