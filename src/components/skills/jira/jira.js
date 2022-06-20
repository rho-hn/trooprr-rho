import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getSkillUser, getUser } from '../skills_action';
import queryString from 'query-string';
import JiraConfiguration from "./jira_configuration";
import JiraPersonalPreference from "./personal_preference"
import JiraMain from "./jira_main"
import UserMapping from "./UserMapping"
import AppHome from "../app_home/appHome";
import JiraChannelPreferences from "./Jira_channel_preferences"
import JiraGuest from "./jira_guest_config/jiraGuest"
import Reports from "../cardSkill/cardSkill";
import { message } from 'antd';

class Jira extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workspace_id: this.props.match.params.wId,
      currentSkill: {},
      jiraAdminUserData: {},
      loading: false,
      id: '',
      currentUser: {},
      name: ''
    }
    this.setOption = this.setOption.bind(this)
  }

  setOption(view, id, name) {
    this.setState({ view: view, id: id, name: name });
    let queryStringObject = queryString.stringify({
      view: view,
      id: id,
      name: name
    });
    const path = window.location.pathname;
    if (id) {
      const obj = {
        "title": view,
        "url": path + `?view=${view}&${name}=${id}`
      }
      window.history.pushState(obj, obj.title, obj.url);
    } else {
      const obj = {
        "title": view,
        "url": path + `?view=${view}`
      }
      window.history.pushState(obj, obj.title, obj.url);
    }
  }

  componentDidMount() {
    const {workspace,skills,currentSkill} = this.props

    const {sub_skill} = this.props.match.params
    const jiraSkill = this.props.skills.find(skill => skill.key === 'jira')
    if(!(sub_skill === 'jira_software' || sub_skill === 'jira_service_desk' || sub_skill === 'jira_reports')){
      /* to handle switching from jira to wiki (code is coming here before currentSkill(jira => wiki) is updated in store) */
      if(jiraSkill && jiraSkill.skill_metadata._id === this.props.match.params.skill_id){
        message.error('Something went wrong')
        console.error('wrong subskill in the url')
        this.props.history.push(`/${this.props.match.params.wId}/dashboard`)
      }
    }

    const sub_skill_data = jiraSkill&& jiraSkill.skill_metadata ? jiraSkill.skill_metadata.sub_skills.find(s => s.key === sub_skill) : false

    // const jiraSkill = skills.find(skill => skill.name === 'Jira')
    // console.log(skills,this.props.currentSkill);
    // if(currentSkill&& (currentSkill.disabled || currentSkill.skill_metadata.disabled)){
    // if(currentSkill&& currentSkill.skill_metadata ? currentSkill.skill_metadata.disabled : currentSkill.disabled){
    if(sub_skill_data && sub_skill_data.disabled){
      this.props.history.push(`/${this.props.match.params.wId}/dashboard`)
      message.warning(`${sub_skill_data.name} is disabled`)
    }else {
    if (this.props.currentSkill && (this.props.currentSkill.skill_metadata || this.props.currentSkill.jiraConnectedId)) {
      this.setState({ currentSkill: this.props.currentSkill });
      this.props
        .getUser(
          this.props.currentSkill.skill_metadata
            ? this.props.currentSkill.skill_metadata.jiraConnectedId
            : this.props.currentSkill.jiraConnectedId
        )
        .then(res => {
          if (res.data.user) {
            this.setState({
              jiraAdminUserData: res.data.user, loading: false
            });
          }
        });
    }

    if (this.props.user_now && this.props.user_now._id) {
      this.setState({ currentUser: this.props.user_now });
    }

    const { skillView } = this.props
    const parsedQueryString = queryString.parse(window.location.search);
    this.setState({ view: parsedQueryString.view })
    // this.props.getSkillUser(this.props.match.params.wId,this.props.match.params.skill_id)
    // this.props.getSkillData(this.props.match.params.skill_id)
    this.props.getSkillUser(this.props.match.params.wId, this.props.match.params.skill_id).then(res => {
      //  console.log("3e3e3",res.data)
      let jiraUser = res.data.skillUser



      if (jiraUser && jiraUser.token_obj && jiraUser.token_obj.type == "Guest" && parsedQueryString.view == "jira_guest") {
        // this.setState({ view:"jira_config"})

        this.setOption("jira_config")
      }
      if (skillView.view === 'channel_preferences' && jiraUser && !jiraUser.token_obj && jiraUser.skill_id) {
        message.warning('Verify your jira account in order to manage channel configurations.')
        this.props.history.push(`/${this.props.match.params.wId}/skills/${jiraUser.skill_id._id}/${this.props.match.params.sub_skill}?view=personal_preferences`)
        this.setOption("jira_config");
      }


         
        // if (skillView.view === 'channel_preferences' && jiraUser && !jiraUser.token_obj && jiraUser.skill_id) {
        //   message.warning('verify your jira account in order to manage channel configurations.')
        //   this.props.history.push(`/${this.props.match.params.wId}/skills/${jiraUser.skill_id._id}?view=personal_preferences`)
        // }
      


    })
  }
  }

  // componentDidUpdate(prevProps){
  //   if(prevProps !== this.props){
  //   const parsedQueryString = queryString.parse(window.location.search);


  // }

  componentDidUpdate(prevProps) {

    const {sub_skill} = this.props.match.params
    if(!(sub_skill === 'jira_software' || sub_skill === 'jira_service_desk' || sub_skill === 'jira_reports')){
      const jiraSkill = this.props.skills.find(skill => skill.key === 'jira')
      /* to handle switching from jira to wiki (code is coming here before currentSkill(jira => wiki) is updated in store) */
      if(jiraSkill && jiraSkill.skill_metadata._id === this.props.match.params.skill_id){
        message.error('Something went wrong')
        console.error('wrong subskill in the url')
        this.props.history.push(`/${this.props.match.params.wId}/dashboard`)
      }
    }

    if(this.props.match.params.sub_skill !== prevProps.match.params.sub_skill){
      const jiraSkill = this.props.skills.find(skill => skill.key === 'jira')
      const sub_skill_data = jiraSkill&& jiraSkill.skill_metadata ? jiraSkill.skill_metadata.sub_skills.find(s => s.key === sub_skill) : jiraSkill.sub_skills.find(s => s.key === sub_skill)
      if(sub_skill_data && sub_skill_data.disabled){
        this.props.history.push(`/${this.props.match.params.wId}/dashboard`)
        message.warning(`${sub_skill_data.name} is disabled`)
      }
    }

    if (prevProps.currentSkill != this.props.currentSkill) {
      if (this.props.currentSkill.name == 'Jira') {
        this.setState({ loading: true })
        this.props
          .getUser(
            this.props.currentSkill.skill_metadata
              ? this.props.currentSkill.skill_metadata.jiraConnectedId
              : this.props.currentSkill.jiraConnectedId
          )
          .then(res => {
            if (res.data.user) {
              this.setState({
                jiraAdminUserData: res.data.user, loading: false
              });
            }
          });
      }
    }

    if (prevProps.user_now != this.props.user_now) {
      this.setState({ currentUser: this.props.user_now });
    }
  }

  channel_name = () => {
    if (window.location.search) {
      const search = window.location.search;
      const link = search.split('&');
      if (link[1]) {

        const name = link[1].split('=');
        return { name: name[0], id: link[1] };
      }
      else { return "" }
    } else {
      return ''
    }
  }

  render() {
    let renderTabs = this.props.currentSkill.skill_metadata ? this.props.currentSkill.skill_metadata.linked : this.props.currentSkill.linked

    let isJiraConnector = true;
    if (this.state.jiraAdminUserData.user_id && this.state.currentUser._id) {
      if (this.state.jiraAdminUserData.user_id !== this.state.currentUser._id) {
        isJiraConnector = false;
      }
    }
    // const { skill }=this.props;
    // let  paymentStatus = this.props.paymentHeader.billing_status;

    return (
      <div >


        {this.props.skillView.view == "info" && <JiraMain skill={this.props.skill} workspace_id={this.props.match.params.wId} setOption={this.setOption} />}
        {(!this.props.skillView.view || this.props.skillView.view === "connection") && <JiraConfiguration channel_name={this.state.name} skill={this.props.skill} workspace_id={this.props.match.params.wId} setOption={this.setOption} />}
        {this.props.skillView.view === "personal_preferences" && renderTabs && <JiraPersonalPreference skill={this.props.skill} workspace_id={this.props.match.params.wId} setOption={this.setOption} />}
        {this.props.skillView.view === "appHome" && renderTabs && <AppHome jira_skill = {this.props.skill}/>}
        {this.props.skillView.view === "channel_preferences" && renderTabs && <JiraChannelPreferences skillView={this.props.skillView} skill={this.props.skill} workspace_id={this.props.match.params.wId} setOption={this.setOption} />}
        {this.props.skillView.view === "guest" && renderTabs && <JiraGuest skill={this.props.skill} workspace_id={this.props.match.params.wId} setOption={this.setOption} />}
        {this.props.skillView.view === "reports" && renderTabs && <Reports skillView={this.props.skillView} skill={this.props.skill} workspace_id={this.props.match.params.wId} />}
        {this.props.skillView.view === "user_mappings" && renderTabs && <UserMapping skill={this.props.skill} workspace_id={this.props.match.params.wId} isJiraConnector={isJiraConnector} />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentSkill: state.skills.currentSkill,
    currentSkillUser: state.skills.currentSkillUser,
    user_now: state.common_reducer.user,
    workspace: state.common_reducer.workspace,
    skills: state.skills.skills

    // paymentHeader : state.common_reducer.workspace
  }
};

export default withRouter(connect(mapStateToProps, {

  getSkillUser, getUser

})(Jira));
