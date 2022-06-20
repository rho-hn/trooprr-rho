import React from "react";
import { connect } from "react-redux";
import queryString from "query-string";
import { slackApproval } from "./authActions";
import {createTourInfo,getTourInfo} from '../auth/authActions';
import {getAssisantSkills} from '../skills/skills_action';
import "./auth.css";
import { message } from "antd";
import axios from 'axios';

const team_mood_and_checkin_states  = ['trooprai-landing', 'website-standup', 'website-retro', 'website-poker', 'trooprai-teammood', 'trooprai-pricing']
class SlackAuth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: ""
    };
  }

  async componentDidMount() {
    var _obj = {
      code: queryString.parse(this.props.location.search).code
    };

    var url = localStorage.troopr_workspace_id_url;
    if (url) {
      _obj.workspace_id = localStorage.troopr_workspace_id_url.split("/")[2];
    }

    var Type = queryString.parse(this.props.location.search).state;
    const [type,params] = Type.split('.')
    _obj.source=type
    if(!this.state.error){
      
    }

    if (_obj.source === "botupdate") {
      const workspace_id = localStorage.getItem("userCurrentWorkspaceId");
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/troopr/access";
        return;
      } else {
        const res = await axios.post(`/bot/api/${workspace_id}/hanldeBotUpdate`, {
          code: _obj.code,
        });

        if (res.data.success && res.data.workspace_id) {
          window.location.href = `/${res.data.workspace_id}/dashboard?botupdate=success`;
          return;
        } else {
          this.setState({ error: "error_botupdate" });
          return;
        }
      }
    }

   const IsJsonString = (str) => {
      try {
          JSON.parse(str);
      } catch (e) {
          return false;
      }
      return true;
  }

    this.props
      .slackApproval(_obj, params && IsJsonString(params) ? JSON.parse(params) : {})
      .then(response => {

        if (response.data.success && response.data.workspace_id && response.data.isBotUpdate) {
          window.location.href = `/${response.data.workspace_id}/dashboard?botupdate=success`;
          return;
        }else if (response.data.success && response.data.workspace_id && response.data.source && (response.data.source === 'appsumo_update' || response.data.source === 'workspace_already_paid') ){
          window.location.href = `/${response.data.workspace_id}/dashboard?source=${response.data.source}`;
          return;
        }else if (response.data.success && response.data.workspace_id && response.data.source && response.data.source === 'product_already_subscribed'){
          window.location.href = `/${response.data.workspace_id}/dashboard?source=${response.data.source}&product=${response.data.product}`;
          return;
        }
        // console.log(response)
        if (response.data.success) {
         
          // console.log("workspace:", JSON.stringify(response.data))
            // this.props.history.push("/"+response.data.workspace_id+"/onboarding");
            if(type == 'jiraslackdotcom_starter'||type == 'jiraslackdotcom_standard'||type == 'jiraslackdotcom_pro'||type == 'jiraslackdotcom_na'){
              this.props.getAssisantSkills(response.data.workspace_id).then(res =>{
                if(res.data.success){
                  let jiraSkill = res.data.skills.find(skill => skill.key == 'jira')
                  window.location.href="https://"+window.location.hostname+"/"+response.data.workspace_id+"/skills/"+jiraSkill.skill_metadata._id+ "/jira_software"
                }else{
                  this.setState({ errors: response.data.errors });
                  this.props.history.push("/troopr/access") ;
                }
              })
            }else if (type && 
              (
                type.includes('trooprai-landing') || 
                type.includes('website-standup')  ||
                type.includes('website-retro')  ||
                type.includes('website-poker')  ||
                type.includes('trooprai-teammood')  ||
                type.includes('trooprai-pricing') ||
                type.includes('jsi_wiki_na') ||
                type.includes('jsi_na') ||
                type.includes('instant-poker')
                )
              ){
                let state=''
                if(type.includes('trooprai-teammood')){
                  state='team_mood'
                }
                else if(type.includes('instant-poker')){
                  state='instant-poker'
                }
                else if(type.includes('website-retro')){
                  state='retro'
                }
                else if(type.includes('website-poker')){
                  state='planning_poker'
                }
                else if(type.includes('jsi_na')){
                  state='jira_slack_int'
                }
                else if(type.includes('jsi_wiki_na')){
                  state='jsi_wiki_na'
                }
                else {
                  state='checkin'
                }
              //let state = type.includes('trooprai-teammood') ? 'team_mood' : 'checkin'
              window.location.href="https://"+window.location.hostname+"/"+response.data.workspace_id+"/onBoarding/"+state
            }
            else{
              if(response.data.isNewAuth){
              this.props.getAssisantSkills(response.data.workspace_id).then(res =>{
                if(res.data.success){
                  let jiraSkill = res.data.skills.find(skill => skill.key == 'jira')
                  //window.location.href="http://localhost:3000"+"/"+response.data.workspace_id+"/skills/"+jiraSkill.skill_metadata._id+"?view=personal_preferences"
                  window.location.href="https://"+window.location.hostname+"/"+response.data.workspace_id+"/skills/"+jiraSkill.skill_metadata._id+"/jira_software?view=personal_preferences"
                  message.success("Permissions Given Successfully!")
                }else{
                  this.setState({ errors: response.data.errors });
                  this.props.history.push("/troopr/access") ;
                }
              })
              }
              /* else if(response.data.source === 'appsumo_install'){
                let product = ''
                let res_product = response.data.product
                if(res_product){
                  if(res_product === 'standups') product = 'checkin'
                  else if (res_product === 'jira_software' || res_product === 'jira_service_desk' || res_product === 'jira_reports' ) product = 'jira_slack_int'
                  else if (res_product === 'wiki' ) product = 'jsi_wiki_na'
                }
                window.location.href="https://"+window.location.hostname+"/"+response.data.workspace_id+"/onBoarding/"+product
              } */
              else{
                // if(type && type.includes('botupdate')) {
                //   message.success("Troopr Assistant successfully updated to latest version!")
                //   window.location.href="https://"+window.location.hostname+"/"+response.data.workspace_id+"/dashboard"
                // }
                // else window.location.href="https://"+window.location.hostname+"/"+response.data.workspace_id+"/onBoarding"

                window.location.href="https://"+window.location.hostname+"/"+response.data.workspace_id+"/onBoarding"
              }
            }
          // this.props.getTourInfo().then(res => {
          //   if (!res.data.success) {
          //     let data = {};
          //     data.type = 'slack';
          //     this.props.createTourInfo(data).then(tour => {
          //       window.location.href="https://"+window.location.hostname+"/"+response.data.workspace_id+"/skills"
          //     })
          //   }else{
          //     window.location.href="https://"+window.location.hostname+"/"+response.data.workspace_id+"/skills";
          //   }
        //   window.location.href = "https://"+window.location.hostname+"/"+response.data.workspace_id+"/onBoarding" ;
          
        
          // this.props.createTourInfo(data);
         
          
          // if (type == "user_team_link") {
          //   this.props.history.push("/projects/picker");
          // } else if (type == "website-standup") {
          //   // console.log("hello hello heloo")
          //   window.location.href =
          //     "https://app.troopr.io/welcome/" +
          //     response.data.workspace_id +
          //     "?team=" +
          //     response.data.team +
          //     "&type=website-standup";
          // } else {
          //   if (localStorage.troopr_workspace_id_url) {
          //     localStorage.removeItem("troopr_workspace_id_url");
          //     window.location = "https://app.troopr.io" + url;
          //     // this.props.history.push(url);
          //   } else {
          //     // console.log('checking response', response);

          //     window.location.href =
          //       "https://app.troopr.io/welcome/" +
          //       response.data.workspace_id +
          //       "?team=" +
          //       response.data.team;

          //     // console.log(`https://app.troopr.io/slack_landing?team=${response.data.url}`);
          //     // console.log("-----------------From slack auth-----------------",response.data);
          //     // window.location="https://slack.com/app_redirect?app=AE4FF42BA&team="+response.data.team
          //   }
          // }
        } else {
          this.setState({ errors: response.data.errors });
          // console.log('checking access');
          this.props.history.push("/troopr/access") ;
        }
      })
      .catch(err => {
        console.error("err-==>", err);
        this.setState({
          error: err
        });
      });

    //catch action here and senf hem to access link
  }

  onClickRedirect = () => {
    // this.props.history.push("");

    if(this.state.error === 'error_botupdate') window.location.href = "https://app.troopr.io/slack?source=botupdate"
    else window.location.href = "https://app.troopr.io/slack";
    //https://app.troopr.io/slack
  };

  render() {
    let errHtml = (
      <div style={{width:"100vw",height:"100vh"}} className="d-flex flex-column justify-content-center align-items-center">
        <div>OOPS! Itseems there was an error while installing</div>
        <div
          className="confirmation-button primary_btn btn_114"
          onClick={this.onClickRedirect}
          style={{padding:"25px",marginTop:"5px"}}
        >
          Click to reinstall
        </div>
      </div>
    );

    const type = queryString.parse(this.props.location.search).state;

    return (
      <div>
        {this.state.error ? (
          errHtml
        ) : (
          <div style={{width:"100vw",height:"100vh"}} className="d-flex flex-column justify-content-center align-items-center" >
            <div className="loader" />{" "}
            <div style={{fontSize:"24px",fontWeight:"500"}}>
              {type !== 'OA' ? `Please do not refresh the page or hit the back button. The app is
              getting installed.` :
              'Processing ...'
              }
            </div>
          </div>
        )}
      </div>
    );
  }
}
export default connect(
  null,
  { slackApproval,createTourInfo,getTourInfo,getAssisantSkills }
)(SlackAuth);
