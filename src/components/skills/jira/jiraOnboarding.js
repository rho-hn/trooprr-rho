import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { CloseCircleOutlined, SlackOutlined } from '@ant-design/icons';
import { Typography, Alert, Button, Row, Col } from 'antd';
import { getSkillData, getSkillUser, checkSlackLink } from '../skills_action';


const { Title } = Typography;


class JiraOnboarding extends Component {

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

  componentDidMount(){
    this.props.getSkillData(this.props.match.params.skill_id);
    this.props.getSkillUser(this.props.match.params.wId,this.props.match.params.skill_id);
    this.props.checkSlackLink(this.props.match.params.wId);
}
goToJira = () => {
  this.props.history.push("/" + this.props.match.params.wId + "/skills/" + this.props.match.params.skill_id + "?view=connection");
}
goToJiraUser = () => {
  this.props.history.push("/" + this.props.match.params.wId + "/skills/" + this.props.match.params.skill_id + "?view=personal_preferences");
}

configureWebhook = () =>{
  this.props.history.push("/"+this.props.match.params.wId+"/jira_notification_setup/"+this.props.match.params.skill_id+"?step=intial_setup")
}


  render() {
    const { assistant_skills, assistant } = this.props;
    const domainName = assistant_skills.skill.metadata ? assistant_skills.skill.metadata.domain_name : '';
    const WName = assistant.name;
    const linkedEmail = assistant_skills && assistant_skills.currentSkillUser.user_obj ? assistant_skills.currentSkillUser.user_obj.emailAddress : '';
    const info1 = `Jira domain '${domainName}' is now successfully connected to Slack workspace '${WName}'.`
    const info2= `You will now be able to create and take action on Jira issues in Slack as ${linkedEmail ? linkedEmail : ''}.`

    return (
      //  <div className="d-flex flex-column workspace-onboarding-main-container " >
      //     <div className="d-flex align-items-center justify-content-center workspace-onboarding-header">
      //         <img className=" workspace-onboarding-troopr-logo" src={logo} alt=""/>
      //         <div className=" workspace-onboarding-troopr-text">Troopr</div>
      //     </div>
      //     <div className="workspace-onboarding-container container">
      //       <div className="row workspace-onboarding-row">
      //         <div className="workspace-onboarding-left-container-jira d-flex flex-column">
      //           <Welcome />
      //         </div>
      //      </div>
      //    </div>
      // </div>

      <div style={{ padding: "20px 100px 20px 100px", overflowY: "auto", height: "100vh" }}>

        <Row type="flex" justify="end" align="top">
          <Col span={2}>
            <CloseCircleOutlined style={{ fontSize: "48px" }} onClick={this.goToJira} />
          </Col>
        </Row>
        <br />

        <Row type="flex" justify="center" align="middle">
          <Col span={12}>
            <Title>Congratulations! 🎉</Title><br />
            <Alert message={info1+" "+info2} type="success" showIcon /><br />
            <Alert message="Go to Jira User Preferences (link below) to change the linked user account anytime" type="info" showIcon />
            {/* <Title level={4} type="secondary">  </Title> */}
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
            {/* <Alert message="Just say “/troopr jira” in any Slack channel to get started." type="success" showIcon /><br /> */}
            
          </Col>
        </Row>

        <br /><br />
        <Row type="flex" justify="center" align="middle">
          <Col span={12}>
            <Button type="primary" size="large" onClick={this.configureWebhook}>Configure Webhook</Button><br/><br/>
            <Button type="link" icon={<SlackOutlined />} onClick={this.goToSlack}>Go to Slack</Button>
            <Button type="link" onClick={this.goToJira}>Jira Connection Settings</Button>
            <Button type="link" onClick={this.goToJiraUser}>Jira User Preferences</Button>
          </Col>
        </Row>

      </div>
    );
  }
}

const mapStateToProps = state => ({
  assistant:state.skills.team,
  assistant_skills:state.skills
});

export default withRouter(
  connect(
    mapStateToProps,
    { getSkillData,checkSlackLink,getSkillUser }
  )(JiraOnboarding)
);
