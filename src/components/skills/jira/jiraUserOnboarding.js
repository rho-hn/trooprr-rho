import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { CloseCircleOutlined, SlackOutlined } from '@ant-design/icons';
import { Typography, Alert, Button, Row, Col } from 'antd';
import { getSkillData,getSkillUser, checkSlackLink ,getuserMapping} from '../skills_action';
import queryString from "query-string";
import {checkJiraStatus} from '../../../utils/utils'

const { Title } = Typography;


class JiraUserOnboarding extends Component {

  goToSlack = () => {
    const { assistant } = this.props;
    localStorage.setItem("app", "AE4FF42BA");
    const app = localStorage.getItem('app');
    const teamId = assistant.id
    let url = '';
    if (app && teamId) {
      url = `https://slack.com/app_redirect?app=${app}&team=${teamId}`
    } else {
      url = `https://slack.com`;
    }
    //  window.location.href = url;
    window.open(url, "_blank")
  }

  componentDidMount() {
    this.props.getSkillData(this.props.match.params.skill_id);
    this.props.getSkillUser(this.props.match.params.wId, this.props.match.params.skill_id);
    this.props.checkSlackLink(this.props.match.params.wId);
      let userId = localStorage.getItem('trooprUserId');
      this.props.getuserMapping(this.props.match.params.skill_id,userId);
      
  }

  goToJira = (jiraSkill) => {
    const isJiraEnabled = jiraSkill&&jiraSkill.skill_metadata ? checkJiraStatus(jiraSkill.skill_metadata) : true
    if( !isJiraEnabled/* jiraSkill && jiraSkill.skill_metadata.disabled */)
    this.props.history.push("/" + this.props.match.params.wId + "/teamsyncs/integrations/" + this.props.match.params.skill_id);
    else
    this.props.history.push("/" + this.props.match.params.wId + "/skills/" + this.props.match.params.skill_id + `/${queryString.parse(this.props.location.search).sub_skill}?view=personal_preferences`);
  }

  render() {
    const { assistant_skills,workspace,skills } = this.props;
      const domainName = assistant_skills.skill.metadata ? assistant_skills.skill.metadata.domain_name || assistant_skills.skill.metadata.domain_url : '';
      // const WName = assistant.name;
      // console.log("currentSkill=====>",skills)
      const jiraSkill = skills.find(skill => skill.name === 'Jira')
      const user_obj = assistant_skills && assistant_skills.currentSkillUser.user_obj;
      const linkedEmail = user_obj ? (user_obj.emailAddress ? user_obj.emailAddress : user_obj.displayName) : "";
      const info1 = `You will now be able to create and take action on Jira issues in Slack as ${linkedEmail ? linkedEmail : ''}.`

      // let info1        
    return (
      <div style={{ padding: "20px 100px 20px 100px", overflowY: "auto", height: "100vh" }}>

        <Row type="flex" justify="end" align="top">
          <Col span={2}>
            <CloseCircleOutlined style={{ fontSize: "48px" }} onClick={()=>this.goToJira(jiraSkill)} />
          </Col>
        </Row>
        <br />

        <Row type="flex" justify="center" align="middle">
          <Col span={12}>
            <Title>Congratulations! 🎉</Title>
            {jiraSkill && jiraSkill.skill_metadata.disabled ? <Title level={4}>You have successfully verified your user account '{linkedEmail ? linkedEmail : ''}' in the connected Jira domain '{domainName}'. You will now be able to take action on Jira issues in Slack as {linkedEmail ? linkedEmail : ''}. </Title>
            :
            <Title level={4}>You have successfully verified your user account '{linkedEmail ? linkedEmail : ''}' in the connected Jira domain '{domainName}'. You will now be able to create and take action on Jira issues in Slack as {linkedEmail ? linkedEmail : ''}. </Title>}
          </Col>
        </Row>

        <br /><br />
        <Row type="flex" justify="center" align="middle">
          <Col span={12}>
            {/* <Alert message={info1} type="info" showIcon /> */}
            {/* <Title level={4} type="secondary"></Title> */}
            {/* <Title level={4} type="secondary">Click here to change the linked user account anytime</Title>
            <Button type="link" onClick={this.goToJira}>Go to preference</Button>
            <Title level={4} type="secondary">Just say “/troopr jira” in any Slack channel to get started.</Title> */}
            <Alert message="Just say “/t jira” in any Slack channel to get started." type="success" showIcon /><br />
            <Alert message="Go to Jira User Preferences (link below) to change the linked user account anytime" type="info" showIcon />
            {/* </>
            } */}
          </Col>
        </Row>

        <br /><br />
        <Row type="flex" justify="center" align="middle">
          <Col span={12}>
            <Button type="primary" icon={<SlackOutlined />} onClick={this.goToSlack}>Go to Slack</Button>
            <Button type="link" onClick={() => this.goToJira(jiraSkill)}>Jira User Preferences</Button>
          </Col>
        </Row>

      </div>
    );
  }
}

const mapStateToProps = state => ({
  assistant: state.skills.team,
  currentSkill: state.skills.currentSkill,
  workspace : state.common_reducer.workspace,
  assistant_skills: state.skills,
  skills: state.skills.skills
});

export default withRouter(
  connect(
    mapStateToProps,
    { getSkillData, checkSlackLink, getSkillUser,getuserMapping }
  )(JiraUserOnboarding)
);
