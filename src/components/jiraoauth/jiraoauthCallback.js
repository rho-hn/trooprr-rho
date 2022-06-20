import React, { Component } from 'react'
import queryString from "query-string";
import {checkJiraStatus} from '../../utils/utils'
import {getOAuthAccessTokensForUsers,getAccessTokens} from "../skills/skills_action"
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
 class JiraoauthCallback extends Component {
     constructor(props) {
         super(props)
     
         this.state = {
          loading:true
         }
     }
     
      componentDidUpdate(prevProps){
        if(this.props.skills !== prevProps.skills){
        const {skills} = this.props
        const jiraSkill = skills.find(skill => skill.name === 'Jira')
        const isJiraEnabled = jiraSkill&&jiraSkill.skill_metadata ? checkJiraStatus(jiraSkill.skill_metadata) : true

    let code= queryString.parse(this.props.location.search)
    // let oauthToken=code.oauth_token  
    let oauthverifier=code.oauth_verifier
  if(code.isUser){
    if(oauthverifier==="denied"){
      if(!isJiraEnabled /* jiraSkill && jiraSkill.skill_metadata.disabled */)
      this.props.history.push(`/${this.props.match.params.wId}/teamsyncs/integrations/${this.props.match.params.skill_id}`)
      else
      this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}/${code.sub_skill}?view=personal_preferences`)
      
    }
    else{
    this.props.getOAuthAccessTokensForUsers(this.props.match.params.wId,oauthverifier,code.sessionid).then(res=>{
      if(res&&res.data&&res.data.success){
        // if(jiraSkill && jiraSkill.skill_metadata.disabled)
        // this.props.history.push(`/${this.props.match.params.wId}/teamsyncs/integrations/${this.props.match.params.skill_id}`)
        // else
        // this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}?view=personal_preferences`)

        this.props.history.push("/"+this.props.match.params.wId+"/jira_user_welcome/"+this.props.match.params.skill_id+`?sub_skill=${code.sub_skill}`)
      
      }
        else{
        
        }
    })
  }
   
  }
  else{
    if(oauthverifier==="denied"){
      if(!isJiraEnabled/* jiraSkill && jiraSkill.skill_metadata.disabled */)
      this.props.history.push(`/${this.props.match.params.wId}/teamsyncs/integrations/${this.props.match.params.skill_id}`)
      else
      this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}/${code.sub_skill}?view=connection`)
    }
    else{
  this.props.getAccessTokens(this.props.match.params.wId,oauthverifier,code.sessionid).then(response=>{
    if(response.data.success){
      let skill=response.data.skill
      this.props.history.push("/"+this.props.match.params.wId+"/jiraConnectionSteps/"+this.props.match.params.skill_id+`?domainName=${skill.metadata.domain_url}&sub_skill=${code.sub_skill}`)
      // this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}`)
      }
      else{
      
      }
   })
    }
  }
//     let response=await getAccessTokens(this.props.match.params.wId,oauthverifier)
// if(response.success){
// this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}`)
// }
// else{

// }
        }
     }
    render() {
        return (
            <div>
              {/* {this.state.loading?"Loading":"Connected"} */}
            </div>
        )
    }
}

const mapStateToProps = (store) => {
  return {
    skills: store.skills.skills
  }
}

export default withRouter(connect(mapStateToProps, {getOAuthAccessTokensForUsers,getAccessTokens})(JiraoauthCallback));


