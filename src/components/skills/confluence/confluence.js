import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getSkillUser, getUser } from '../skills_action';
import queryString from 'query-string';
import JiraConfiguration from "./confluence_configuration";
import axios from "axios";
import JiraChannelPreferences from "./channel_list"
import ConfluecneAnalytics from "./analytics/analytics"




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
   
    

    if(currentSkill&& currentSkill.skill_metadata ? currentSkill.skill_metadata.disabled : currentSkill.disabled){
      this.props.history.push(`/${this.props.match.params.wId}/dashboard`)
      message.warning('Jira Integration disabled')
    }else {
    if (this.props.currentSkill && (this.props.currentSkill.skill_metadata || this.props.currentSkill.jiraConnectedId)) {
      this.setState({ currentSkill: this.props.currentSkill });
 
    }

  

    const { skillView } = this.props
    const parsedQueryString = queryString.parse(window.location.search);
    this.setState({ view: parsedQueryString.view })
    // this.props.getSkillUser(this.props.match.params.wId,this.props.match.params.skill_id)
    // this.props.getSkillData(this.props.match.params.skill_id)
  
  }
  }

  // componentDidUpdate(prevProps){
  //   if(prevProps !== this.props){
  //   const parsedQueryString = queryString.parse(window.location.search);


  // }

  componentDidUpdate(prevProps) {
    // if (prevProps.currentSkill != this.props.currentSkill) {
    //   if (this.props.currentSkill.name == 'Jira') {
    //     this.setState({ loading: true })
    //     this.props
    //       .getUser(
    //         this.props.currentSkill.skill_metadata
    //           ? this.props.currentSkill.skill_metadata.jiraConnectedId
    //           : this.props.currentSkill.jiraConnectedId
    //       )
    //       .then(res => {
    //         if (res.data.user) {
    //           this.setState({
    //             jiraAdminUserData: res.data.user, loading: false
    //           });
    //         }
    //       });
    //   }
    // }

    // if (prevProps.user_now != this.props.user_now) {
    //   this.setState({ currentUser: this.props.user_now });
    // }
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
      // console.log("this.props.skillView.view",this.props.skillView.view)
    let renderTabs = this.props.currentSkill.skill_metadata ? this.props.currentSkill.skill_metadata.linked : this.props.currentSkill.linked

  
  

    return (
      <div >


  
        {(!this.props.skillView.view || this.props.skillView.view === "connection") && <JiraConfiguration channel_name={this.state.name} skill={this.props.skill} workspace_id={this.props.match.params.wId} setOption={this.setOption} />}
      
        {this.props.skillView.view === "channel_preferences" && renderTabs && <JiraChannelPreferences skillView={this.props.skillView} skill={this.props.skill} workspace_id={this.props.match.params.wId} setOption={this.setOption} />}
        {this.props.skillView.view === "analytics" && renderTabs && <ConfluecneAnalytics skillView={this.props.skillView} skill={this.props.skill} workspace_id={this.props.match.params.wId} setOption={this.setOption} />}
      

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
