import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Typography, Card, Button, Col, Dropdown,message } from "antd";
import { SettingOutlined } from "@ant-design/icons";

import JiraConfiguration from "../jira/jira_configuration";
import JiraPersonalPreference from "../jira/personal_preference";
import { getUserToken, getSkillUser, getCurrentSkill, getUser } from "../skills_action";
import UserMapping from "../jira/UserMapping";

const { Text } = Typography;

class CheckinIntegarations extends Component {
  constructor() {
    super();
    this.state = {
      jiraSkillData: {},
      adminUserName: "",
      adminUserId: "",
      jiraSkill: {},
      jiraAdminUserData: {},
      loading:false
    };
  }

  componentDidMount() {
    if(this.props.match.params.skill_id){
      const jiraSkill = this.props.skills.find((skill) => skill.key === "jira");
      this.setState({ jiraSkill });
      this.props.getUserToken(this.props.match.params.wId, "Jira").then((res) => {
        if (res.success){
          this.setState({ jiraSkillData: res.data });
          //console.info("res.data",res.data)
          const isLinked=res.data.skill_metadata ? res.data.skill_metadata.linked : res.data.linked;
          isLinked&&jiraSkill&&this.props.getUser(jiraSkill.skill_metadata ? jiraSkill.skill_metadata.jiraConnectedId : jiraSkill.jiraConnectedId).then((res) => {
            if (res.data.user) {
              this.setState({
                jiraAdminUserData: res.data.user,
              });
            }
          });
        } 
      });
       
      if(jiraSkill){
      //this.props.getSkillUser(this.props.match.params.wId, jiraSkill.skill_metadata._id);
      this.setState({loading:true})
      this.props.getCurrentSkill(this.props.match.params.wId, `sId=${jiraSkill.skill_metadata._id}`).then(res => {
      this.setState({loading:false})
      });

      
      }
    }
  }

  componentDidUpdate(prevProps){
    if((prevProps.match.params.skill_id!==this.props.match.params.skill_id) &&this.props.match.params.skill_id){
      const jiraSkill = this.props.skills.find((skill) => skill.key === "jira");
      this.setState({ jiraSkill });
      this.props.getUserToken(this.props.match.params.wId, "Jira").then((res) => {
        if (res.success){
          this.setState({ jiraSkillData: res.data });
          const isLinked=res.data.skill_metadata ? res.data.skill_metadata.linked : res.data.linked;
          isLinked&&jiraSkill&&this.props.getUser(jiraSkill.skill_metadata ? jiraSkill.skill_metadata.jiraConnectedId : jiraSkill.jiraConnectedId).then((res) => {
            if (res.data.user) {
              this.setState({
                jiraAdminUserData: res.data.user,
              });
            }
          });
        } 
      });
      if(jiraSkill){
      //this.props.getSkillUser(this.props.match.params.wId, jiraSkill.skill_metadata._id);
      this.setState({loading:true})
      this.props.getCurrentSkill(this.props.match.params.wId, `sId=${jiraSkill.skill_metadata._id}`).then(res => {
      this.setState({loading:false})
      });
      }
    }
  }


  updateChecinIntegrationsData = (updatedSkill) => {
    if (updatedSkill) this.setState({ jiraSkillData: updatedSkill });
  };

  render() {
    const { integrationPage,user_now,members } = this.props;
    const { jiraSkillData,loading } = this.state;

    const isLinked = jiraSkillData.skill_metadata ? jiraSkillData.skill_metadata.linked : jiraSkillData.linked;

    let isJiraConnector = true;
    if (this.state.jiraAdminUserData.user_id && user_now._id) {
      if (this.state.jiraAdminUserData.user_id !== user_now._id) {
        isJiraConnector = false;
      }
    }

    let isAdmin = false;
    if(members && members.length>0){
      let user=members.find((member)=>member.user_id&&member.user_id._id==user_now._id&&user_now)
      if(user){
        if(user.role){
          isAdmin=user.role=="admin"?true:false
        }
      }
    }
    
    return integrationPage === "all" ? (
      <>
        <Col span={12} style={{ display: "flex" }}>
          <Card
            title={"Jira Projects"}
            onClick={() => this.props.handleIntegrationSelection("jira")}
            //onClick={() => this.handleIntegrationSelection("jira")}
            extra={<Button>Manage</Button>}
            style={{ width: "100%" }}
            size='small'
          >
            Connect with your Jira account to automatically pull activity log in relevant<br/> Check-ins and expand Jira issue mentions in Check-in responses.
          </Card>
        </Col>
        {/* <Col span={12} style={{ display: "flex" }}>
          <Card
            title='GitHub Projects'
            onClick={() => this.props.handleIntegrationSelection("github")}
            extra={<Button>Manage</Button>}
            style={{ width: "100%" }}
            size='small'
          >
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          </Card>
        </Col> */}
      </>
    ) : jiraSkillData && jiraSkillData._id ? (
      <>
        <Col span={12}>
          <JiraConfiguration
            skill={jiraSkillData}
            workspace_id={this.props.match.params.wId}
            isFromCheckins={true}
            updateChecinIntegrationsData={this.updateChecinIntegrationsData}
            jiraAdminUserData={this.state.jiraAdminUserData}
          />
        </Col>
        <Col span={12}>
          {isLinked && <JiraPersonalPreference skill={jiraSkillData} workspace_id={this.props.match.params.wId} isFromCheckins={true} />}
        </Col>
        <Col span={24}>
          {isLinked && !loading && (isAdmin || isJiraConnector) && (
            <Card title='User Mapping' size='small'>
              <UserMapping skill={jiraSkillData} workspace_id={this.props.match.params.wId} isJiraConnector={isJiraConnector} isFromCheckins={true} />
            </Card>
          )}
        </Col>
      </>
    ) : (
      ""
    );
  }
}

const mapStateToProps = (store) => ({
  skills: store.skills.skills,
  user_now: store.common_reducer.user,
  members: store.skills.members,
  // currentSkill: store.skills.currentSkill,
  //   currentSkillUser: store.skills.currentSkillUser,
  //   cardSkills: store.cards.cardSkills,
  //   cardTemplates: store.cards.templateCards,
  //   allUsers: store.skills.allUsers,
});

export default withRouter(connect(mapStateToProps, { getUserToken, getSkillUser, getCurrentSkill, getUser })(CheckinIntegarations));
