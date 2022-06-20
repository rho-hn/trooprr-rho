import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { slackApproval } from '../authActions';
import {getAssisantSkills} from '../../skills/skills_action';
import axios from 'axios';
class SlackAuth extends React.Component {
	 constructor(props) {
   super(props);
        this.state={       
     } 
     }
componentDidMount() {
let query=queryString.parse(this.props.location.search)
let state=query.state.split(" ")
let type=state[0]
let id=state[1]
let location=null
if(state[2]){
    location=state[2]
}

let  _obj={
    code:query.code,
    oauth_type:type,
    id:id,
    location:location


}
axios.post('/api/saveJiraToken',  _obj).then(res => {

    if (res.data.success ) {
     if(res.data.status=="domain_selection"){
    // console.log("INSIDE DOAMIN SELECTION")
         this.props.history.push("/"+res.data.domainInfo.workspace_id+"/jiraConnectionSteps/"+res.data.domainInfo._id)
  //  window.location.href ="https://"+window.location.hostname+"/"+res.data.domainInfo.workspace_id+"/jiraConnectionSteps/"+res.data.domainInfo._id
}else if(res.data.status==="single_domain_selection"){
 let channelInfo=res.data.channelId?`&channelInfo=${res.data.channelId.channelId}`:"" 
 
 this.props.history.push("/"+res.data.workspace_id+"/jiraConnectionSteps/"+res.data._id+`?domainName=${res.data.domainName}${channelInfo}`)
  //  window.location.href ="https://"+window.location.hostname+"/"+res.data.workspace_id+"/jiraConnectionSteps/"+res.data._id+`?domainName=${res.data.domainName}${channelInfo}`
}

else if(type=="jira_user_oauth"){

   this.props.history.push("/"+res.data.workspace_id+"/jira_user_welcome/"+res.data.skill_id)
    // this.props.history.push("/workspace/"  +res.data.workspace_id+ "/"+res.data.skill_id+"/jira")
    // window.location.href ="https://"+window.location.hostname+"/workspace/"+res.data.workspace_id+"/settings?view=project_management"
}

else if(location){

   this.props.history.push("/"+res.data.workspace_id+"/jira_standup_onboard")
    window.location.href ="https://"+window.location.hostname+"/"+res.data.workspace_id+"/jira_standup_onboard"
}


else{

   this.props.history.push("/"+res.data.workspace_id+"/jira_default/"+res.data.skill_id)
  //  window.location.href ="https://"+window.location.hostname+"/"+res.data.workspace_id+"/jira_default/"+res.data.skill_id

}
}
else{

  if(this.props.skills&&this.props.skills.length>0){
  
    let getSkill=this.props.skills.find(skill=>skill.name=="Jira")
    if(getSkill&&getSkill.skill_metadata){
     this.props.history.push("/"+res.data.workspace_id+"/skills/"+getSkill.skill_metadata._id+"?view=connection")
    }
  }


 else{
   this.props.getAssisantSkills(res.data.workspace_id).then(skills=>{
    if(skills.data.success){
      let jiraSkill = skills.data.skills.find(skill => skill.name == 'Jira')
      if(jiraSkill&&jiraSkill.skill_metadata){
        this.props.history.push("/"+res.data.workspace_id+"/skills/"+jiraSkill.skill_metadata._id+"?view=connection")
       }
    }
   })
 }

}
     
}).catch(err=>{
  console.log(err);
})
              
            
         
		
}

						
  render() {
  	 
 return(<div></div>)
	}
}

const mapStateToProps = state => {
return {
  skills:state.skills.skills
}
};
export default connect( mapStateToProps, { slackApproval,getAssisantSkills })(SlackAuth);
