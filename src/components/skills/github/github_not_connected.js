import React, { Component } from 'react'
import { withRouter } from "react-router-dom";
import Githublogo from '../../../media/Github_logo.png';
import { connect } from "react-redux";
import { Card, Avatar, List, Typography } from 'antd';
import { Button } from 'antd';
import GithubConfiguration from "./github_configurations"
import '../jira/jira.css';

const { Text } = Typography

const { Meta } = Card;

class Github_Not_Connected extends Component {

  installation = () => {
    // console.log(process.env)
    // console.log(this.props.match.params.wId)
    window.open("https://github.com/apps/"+process.env.REACT_APP_GitHubApp+"/installations/new?state=" + this.props.match.params.wId, '_blank');
    // window.open("https://github.com/apps/test-troopr1/installations/new?state="+this.props.match.params.wId , '_blank') ;

  }

  render() {
    const { skill, currentSkillUser } = this.props;
    const domainName = skill.metadata ? skill.metadata.installationInfo.account.login : '';
    // console.log("channelDefault", this.props.channelDefault)

    return (
      <div>
            <GithubConfiguration />
      </div>
    )
  }

}


const mapStateToProps = state => {
  return {
    projects: state.skills.projects,
    channelDefault: state.skills
  }
};

export default withRouter(connect(mapStateToProps, null)(Github_Not_Connected));
