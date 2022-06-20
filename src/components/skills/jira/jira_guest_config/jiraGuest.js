import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import {getSkillUser} from "../../skills_action"
import {addJiraGuestManager,getJiraGuestUsers,revokeJiraGuestManager,getJiraGuestManager,updateJiraGuestUser} from "./jiraGuestAction"
import { Card,List,Button,Skeleton,Popconfirm } from 'antd';

const { Meta } = Card;

class JiraGuestPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
             loading:false
        }
 this.makeJiraGuestUser=this.makeJiraGuestUser.bind(this)
 this.getUserAcessRevokeBtn=this.getUserAcessRevokeBtn.bind(this)
 
    }
componentDidMount(){

    this.props.getSkillUser(this.props.match.params.wId,this.props.match.params.skill_id).then(jiraUser=>{


     
    }
)
    this.setState({loading:true})
        this.props.getJiraGuestManager(this.props.match.params.wId).then(res=>{
        if(res.data.success)
        this.props.getJiraGuestUsers(this.props.match.params.wId,res.data.jira_guest_manager._id)
        this.setState({loading:false}) 
    
    

})
    
}
  

makeJiraGuestUser(){
let data={
    workspace_id:this.props.match.params.wId,
    jira_user_id: this.props.jiraUser._id,
    status:"Enable",
    skill_id:this.props.match.params.skill_id
}

this.props.addJiraGuestManager(this.props.match.params.wId,data)
}


   
getUserAcessRevokeBtn(id,value,email){
   
    const {currentUser,guestManager}=this.props

    let actions=[]
    if(currentUser._id==guestManager.user_id){
        if(value=="active"){
          actions.push( <Popconfirm placement="bottomRight" 
                  title={<div style={{width:"30vw"}}>Are you sure you want to revoke guest access for <b>{email}</b> This action can be reversed by enabling the guest again later.</div>}
                  onConfirm={()=>this.props.updateJiraGuestUser(this.props.match.params.wId,id,{status :"revoked"})} okText="Approve" cancelText="Cancel">
                  
                  <Button>Revoke Token </Button>
                  
            </Popconfirm>)
        }else{
            
        actions.push(<Button onClick={()=>this.props.updateJiraGuestUser(this.props.match.params.wId,id,{status :"active"})}>Enable</Button>)
        
        }
    }
    return actions

}

     render() {
         const {guestManager,guestUsers,jiraUser,skill}=this.props
         let domain_name=skill.metadata ? skill.metadata.domain_name:""
       

        return (
      
                <div className="  ">
                    <Card  className="skill_box  ">
                        <div className="row_flex align_center justify_space_between">
                      <Meta
                        style={{marginRight: '24px'}}
                       
                        title="Guest Access"
                        description={guestManager.jira_user_id?guestManager.jira_user_id.user_obj.displayName +" has enabled Guest access in this workspace."+guestManager.jira_user_id.user_obj.emailAddress+"account will be used as the Guest facilitator to act on behalf of the guests in creation and management of Jira issues for this workspace.":"Approving guest access will allow the Guest facilitator to act on behalf of the guests."
                        }
                      />
	
                   {jiraUser && jiraUser.token_obj && jiraUser.token_obj.access_token &&
                   <div>
                     {guestManager.jira_user_id&&guestManager.user_id?
                    <Popconfirm placement="bottomRight" 
                    title={<div style={{width:"30vw"}}><b>{guestManager.jira_user_id.user_obj.emailAddress}</b> is the current Guest access facilitator.Disabling Guest access will revoke and remove guest access for all existing guests in this workspace. All guest users will no longer have access to the Jira domain. Guest facilitator details will also be removed.</div>}
                     onConfirm={()=>this.props.revokeJiraGuestManager(this.props.match.params.wId,guestManager._id)} okText="Revoke" cancelText="Cancel">
                    
                                 <Button >Disable Guest access </Button>
                    
                         </Popconfirm>
                     
                        : <Popconfirm placement="bottomRight" 
                  title={<div style={{width:"30vw"}}>This will enable Guest access to the workspace. Enabling will allow any user in the workspace to access the <b>{domain_name}</b> Jira domain as  <b>{jiraUser.user_obj.emailAddress}</b>. Your account will be used by Guests to create and manage Jira issues on their behalf.</div>}
                  onConfirm={this.makeJiraGuestUser} okText="Approve" cancelText="Cancel">
                  
                                <Button>Approve Guest access </Button>
                  
                       </Popconfirm>}
                       </div>}
                    </div>
                    </Card>
                
                    <Card  className="skill_box  " title="Guest User">
                    <List
                
                
        // loading={initLoading}
        itemLayout="horizontal"
    
        dataSource={guestUsers}
        renderItem={item => (
          <List.Item
            actions={this.getUserAcessRevokeBtn(item._id,item.status,item.slackUser.email)}
          >
            <Skeleton avatar title={false} loading={item.loading} active>
              <List.Item.Meta
                 title={item.slackUser.name}
                description={item.slackUser.email}
              />
              
            </Skeleton>
          </List.Item>
        )}
      />
                    </Card>
 </div>

        );
    }
}
     
const mapStateToProps = state => {
    return{
        currentUser:state.auth.user,
        guestManager:state.jiraGuest.jiraGuestManager,
        guestUsers:state.jiraGuest.jiraGuestUsers,
        jiraUser:state.skills.currentSkillUser
    }
 
}

       
export default withRouter(connect(mapStateToProps, {getSkillUser,addJiraGuestManager,getJiraGuestUsers,revokeJiraGuestManager,getJiraGuestManager,updateJiraGuestUser})(JiraGuestPage));