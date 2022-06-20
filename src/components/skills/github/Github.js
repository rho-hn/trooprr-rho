import React,{ Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getSkillData,getSkillUser } from '../skills_action';
import queryString from 'query-string';
import GithubInfo from "./githubInfo.js";
import Githubchannelpreferences from "./github_channel_preferences";
import GithubConnection from './github_configurations';
import GithubPersonalPreference from './github_personal_preference';
import GitHubAutomation from "./githubAutomation/githubAutomation";
import Reports from "../cardSkill/cardSkill";

class Githubhead extends Component {
    constructor(props)  {
        super(props);
        this.state = {
           workspace_id:this.props.match.params.wId,
           view:"",
           id: '',
           name: ''
        }
        this.setOption=this.setOption.bind(this)
      }

    setOption( view, id, name ) {
        this.setState({ view: view, id: id, name: name });
        let queryStringObject = queryString.stringify({
            view: view,
            id: id,
            name: name
        });
        const path = window.location.pathname;
        if( id ) {
          const obj = {
            "title": view,
            "url": path + `?view=${view}&${name}=${id}`
          }
           window.history.pushState(obj, obj.title, obj.url);
         }else{
          const obj = {
            "title": view,
            "url": path + `?view=${view}`
         }
           window.history.pushState(obj, obj.title, obj.url);
       }
   }

  componentDidMount() {
    // console.log("this.props.match.params.skill_id==>",this.props.match.params.skill_id)
    const parsedQueryString = queryString.parse(window.location.search);
    this.setState({ view:parsedQueryString.view })
    // this.props.getSkillUser(this.props.match.params.wId,this.props.match.params.skill_id)
    this.props.getSkillData(this.props.match.params.skill_id)
     this.props.getSkillUser(this.props.match.params.wId,this.props.match.params.skill_id).then(res=>{
      //  console.log("3e3e3",res.data)
       let jiraUser=res.data.skillUser



        // if( jiraUser.token_obj && jiraUser.token_obj.type=="Guest" && parsedQueryString.view=="jira_guest"){
        //   // this.setState({ view:"jira_config"})

        //   this.setOption("jira_config")
        // }  
      })
    }

  componentDidUpdate(prevProps){
    if(prevProps !== this.props){
    const parsedQueryString = queryString.parse(window.location.search);
     if( parsedQueryString.view ){
       this.setState({ view: parsedQueryString.view })
     }else{
       this.setState({ view: ''})
      }
    }
  }

  channel_name = () => {
      if(window.location.search){
            const search = window.location.search;        
            const link = search.split('&');
            if(link[1]){
              
            const name = link[1].split('=');
            return {name:name[0],id:link[1]};}
            else{return ""}
      }else{
            return ''
      }
    }
getParams=(param,view)=>{
  let workspace_Id=this.props.match.params.wId
  let skill_Id=this.props.match.params.skill_id
  let baseGithubUrl=`/${workspace_Id}/skill/github/${skill_Id}`

 
  if(param==1){
    return {"name":"Github","url":baseGithubUrl}
  }else if(param==2){
    let name=""
    if(view =="info"){
      view="not_connected"
      name="Connection Settings"
    }
    else if(view=="github_channel_pref" || view=="github_channel_config"){
      view="github_channel_config"
      name= "Channel Setting"
    }else if(view=="github_personal_config"){
      name="Personal Setting"
    }else{
      return null
    }
      return {"name":name,"url":baseGithubUrl+"?view="+view}
  
}else if(param==3){
 
  let name=""
  if(view=="github_channel_pref"){
  let channelData=this.channel_name()

    name=<span>Channel: {channelData.name}</span>
    view=view+"&"+channelData.name+"="+channelData.id
  }else if(view === "jira_guest"){
    name="Guest Configuration"
  }else{
    return null
  }
  return {"name":name,"url":baseGithubUrl+"?view="+view}

}

}
	render(){
      // const { skill }=this.props;
let renderTabs = this.props.currentSkill.skill_metadata?this.props.currentSkill.skill_metadata.linked:this.props.currentSkill.linked
      // let  paymentStatus = this.props.paymentHeader.billing_status;
		  return(
             <div className="standup-background">
                {this.props.skillView.view=="info" && renderTabs && <GithubInfo  skill={this.props.skill} workspace_id={this.props.match.params.wId} setOption={this.setOption}/>} 
                    {(!this.props.skillView.view || this.props.skillView.view === "connection") &&<GithubConnection  channel_name={this.state.name} skill={this.props.skill} workspace_id={this.props.match.params.wId} setOption={this.setOption}/>} 
                    {this.props.skillView.view === "personal_preferences"  && renderTabs && <GithubPersonalPreference  skill={this.props.skill} workspace_id={this.props.match.params.wId} setOption={this.setOption}/>} 
                   
                    {this.props.skillView.view === "channel_preferences"  && renderTabs && <Githubchannelpreferences  skillView={this.props.skillView} skill={this.props.skill} workspace_id={this.props.match.params.wId} setOption={this.setOption}/>}
            {this.props.skillView.view=== "automations"  && renderTabs && <GitHubAutomation  skill={this.props.skill} workspace_id={this.props.match.params.wId} setOption={this.setOption}/>}
            {this.props.skillView.view=== "reports"  && renderTabs && <Reports  skill={this.props.skill} workspace_id={this.props.match.params.wId} />}  

                    
                 
                    
             </div>
      );
	}   
}

const mapStateToProps = state => {
  return {
  currentSkill:state.skills.currentSkill,
   
    skills:state.skills.skills,
    // paymentHeader : state.common_reducer.workspace
}};  

export default withRouter(connect( mapStateToProps, {
    getSkillData,
    getSkillUser,
   
  })(Githubhead)); 
