import React, { Component} from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getCurrentSkill, getUser} from "./skills_action";
import TrooprTask from './troopr_task/troopr_task';
import GitHub from './github/Github';
import Jira from './jira/jira';
import Standups from './troopr_standup/standup';
import Wiki from './confluence/confluence'

import queryString from 'query-string';
import "./skills.css"



const tagsFromServer = ["Pre-built", "Custom"];

class Skills extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      selectedTemplate: {},
      selectedTemplateId: "",
      hover: false,
      selectedTags: tagsFromServer,
      showModal: false,
      selectedCardTemplate: {},
      cardTemplateInfo: {},
      showEditModal: false
    };
  }
 componentDidMount() {
    // let parsedQueryString = queryString.parse(window.location.search);
    // if(this.props.match.params.wId == "5f84c0d0b038174751d7b805"  && this.props.currentSkill&& this.props.currentSkill.name == 'Jira' && parsedQueryString.view == 'reports' && this.props.user_now && this.props.user_now._id){
    //   if(this.props.currentSkill.name == 'Jira'){
    //     await this.props
    //     .getUser(
    //       this.props.currentSkill.skill_metadata
    //         ? this.props.currentSkill.skill_metadata.jiraConnectedId
    //         : this.props.currentSkill.jiraConnectedId
    //     )
    //     .then(res => {
    //       if (res.data.user) {
    //         if(this.props.user_now._id != res.data.user.user_id){
    //           this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}?view=connection`)
    //         }

    //       }
    //     });
    //   }
    // }


  }



  render() {


    return (<div>

      {this.props.currentSkill.name == "Jira" && <Jira skill={this.props.currentSkill} skillView={this.props.skillView} />}
      {(this.props.currentSkill.name == "Troopr" || this.props.currentSkill.name == "Troopr Projects") && <TrooprTask skill={this.props.currentSkill} skillView={this.props.skillView} />}
      {/* {(this.props.currentSkill.name == "Troopr Standups" || this.props.currentSkill.name == "Standups" || this.props.currentSkill.name == "standups" || this.props.currentSkill.name == "Check-ins") && <Standups skill={this.props.currentSkill} skillView={this.props.skillView} />} */}
      {(this.props.currentSkill.name == "GitHub" || this.props.currentSkill.name == "Github") && <GitHub skill={this.props.currentSkill} skillView={this.props.skillView} />}
      {(this.props.currentSkill.name == "Wiki" || this.props.currentSkill.key == "wiki")  && <Wiki skill={this.props.currentSkill} skillView={this.props.skillView} />}

    </div>
    );
  }
}

const mapStateToProps = state => ({
  currentSkill: state.skills.currentSkill,
  user_now: state.common_reducer.user,
});

export default withRouter(
  connect(mapStateToProps, {
    getCurrentSkill,getUser
  })(Skills)
);
