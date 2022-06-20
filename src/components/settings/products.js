import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import axios from "axios";

import {
  PageHeader,
  Typography,
  Select,
  message,
  Layout,
  Row,
  Col,
  Alert,
  Modal,
  Switch,
  notification,
  Card,
  Collapse,
} from "antd";

import { updateWorkspace, updateSkill, getConfluenceChannelConfigs } from "../skills/skills_action";
import { productDetails } from "utils/productDetails";

const isValidWSName = (id) => id && id.length >= 3; //TODO:improve this validation
const { Option } = Select;
const { Content } = Layout;
const { Text } = Typography;

const productCardDescription = {
  checkin: "Automatically ask your team questions on a schedule, with replies & context from work tools like Jira rolled up in one report.",
  jira: "Track and update your Jira Software projects in Slack.",
  helpDesk: "Manage your internal support requests with Jira Service Management in Slack.",
  wiki: "Automatically answer internal support requests using Confluence knowledge base in Slack.",
  reports: "Share Jira Reports in Slack",
  jira_software : 'Track and update your Jira Software projects in Slack.',
  jira_service_desk: 'Manage your internal support requests with Jira Service Management in Slack.',
  jira_reports : 'Share Jira Reports in Slack'
}

class Products extends Component {
  constructor(props) {
    super();
    this.state = {
      loading: false,
      githubToggleLoading: false,
      squadsToggleLoading: false,
      jiraProjectToggleLoading: false,
      CheckinsToggleLoading: false,
      defaultSkill: "",
      skills: [],
      disableFeatureToggle: false,
      jira: false,
      checkin: false,
      squads: false,
      allSkills: []
      // switchLoading:false
    };
  }

  componentDidMount() {

    if(this.props.workspace.isRestricteDisabledProductInDashboard && !this.props.isWorkspaceAdmin) {
      message.error('Products page is restricted')
      this.props.history.push(`/${this.props.match.params.wId}/dashboard`)
    }

    // ---------- To Do : Remove this api, use redux store for skills -----------
    axios.get("/bot/workspace/" + this.props.match.params.wId + "/assistant_skills").then((ws_skills) => {
      let defaultSkill = {};
      let skills = [];
      ws_skills.data.skills.forEach((skill) => {
        if (skill.type == "Project Management") {
          skills.push(skill);
          if (skill.default) {
            defaultSkill = skill;
          }
        }
      });
      this.setState({ skills, allSkills: ws_skills.data.skills, defaultSkill: defaultSkill.name });
    });
    const { workspace, skills } = this.props;
    const jiraSkill = skills.find((skill) => skill.name === "Jira");
    if ("showSquads" in workspace) {
      this.setState({ squads: workspace.showSquads });
    } else {
      this.setState({ squads: true });
    }
    if (!workspace.disableCheckins) {
      this.setState({ checkin: true });
    }
    if (jiraSkill) {
      if (!jiraSkill.skill_metadata.disabled) {
        this.setState({ jira: true });
      }
    }
    // this.checkFeatures();
  }

  // checkFeatures = () => {
  //   const { workspace } = this.props;
  //   let enabledFeatures = 0;

  //   if ("showSquads" in workspace ? workspace.showSquads : true) enabledFeatures++;
  //   if ("showGithub" in workspace ? workspace.showGithub : true) enabledFeatures++;
  //   if (!workspace.disableJiraProjects) enabledFeatures++;
  //   if (!workspace.disableCheckins) enabledFeatures++;

  //   this.setState({ disableFeatureToggle: enabledFeatures === 1 ? true : false });
  // };

  countEnabledFeatures = () => {
    const { workspace } = this.props;
    const { skills } = this.props;
    let confluenceSkill = skills.find((skill) => skill.key === "wiki");
    let checkinSkill = skills.find((skill) => skill.key === "standups");
    let enabledFeatures = 0;

    skills.forEach(skill => {
      if(skill.skill_metadata && skill.skill_metadata.sub_skills && skill.skill_metadata.sub_skills.length > 0){
        skill.skill_metadata.sub_skills.forEach(sub_skill => {
          if(!sub_skill.disabled) enabledFeatures++
        })
      }else {};
    })

    // if ("showSquads" in workspace ? workspace.showSquads : true) enabledFeatures++;
    if (checkinSkill && !checkinSkill.skill_metadata.disabled) enabledFeatures++;

    if(confluenceSkill){
      if(!confluenceSkill.skill_metadata.disabled) enabledFeatures++;
    }
   
    return enabledFeatures == 1 ? true : false;
  };

  update = (values) => {
    // console.log("update values:", JSON.stringify(values))
    
    let newWSName = values.workspace.name.trim();
    let wsNameChanged = values.workspace.name.trim() !== this.props.workspace_name;

    !wsNameChanged && message.info({ content: `Profile name not changed` });
    !isValidWSName(newWSName) && message.error({ content: `Profile name invalid.` });

    if (wsNameChanged && isValidWSName(newWSName)) {
      this.props
        .updateWorkspace(this.props.match.params.wId, "", { name: newWSName })
        .then((res) => {
          res.data.success && message.success({ content: "Workspace updated successfully" });
          !res.data.success && message.error({ content: `Something went wrong! ${res.data.errors}` });
        })
        .catch((err) => console.error("err", err));
    }

    // this.props.updateWorkspace(this.props.match.params.wId, "", {timezone:this.state.timeZoneValue}).then(res => {
  };

  formRef = React.createRef();
  restrictedCardDashboard = (checked)=>{
    const {updateWorkspace} = this.props
    
   
    updateWorkspace(this.props.match.params.wId, "", { isRestricteDisabledProductInDashboard: checked }).then((res)=>{
      
      this.setState({ restrictProduct: res.data.workspace.isRestricteDisabledProductInDashboard });
    })
  

  }

  onFeatureT = (skill,subSkill) => {
    let data = {}
    

    if(subSkill){
        let temp = [...skill.sub_skills]
        temp = temp.map(s => {
          if(s.key === subSkill.key){
            s.disabled = !subSkill.disabled
            return s
          }else return s
        })
        data.sub_skills = [...temp]
    }else {
      data.disabled = !skill.disabled
    }

    const { defaultSkill, user_now, updateSkill, skills, updateWorkspace } = this.props;

    this.props.updateSkill(skill._id, this.props.match.params.wId, data, /* cuurentSkill */ false, /* don't update current skill */ true).then((res) => {
      if (res.data.success) {
        let new_skill = res.data.skill;
        let name = skill.name;

        if (subSkill) {
          if (name === 'Jira' && subSkill.key === 'jira_reports' && subSkill.disabled) {
            axios.post(`/bot/api/${this.props.match.params.wId}/disableallWorkspaceJiraReports`).then((res) => {
              if (res.data.success) message.success(`${res.data.disabledReports} Report(s) disabled successfully`);
            });
          }
        } else if (name == "Check-ins" || name == "Standups") {
          updateWorkspace(this.props.match.params.wId, "", { disableCheckins: new_skill.disabled });
          if (new_skill.disabled) {
            let checkinData = {
              edited_by: user_now._id,
              edited_by_name: user_now.displayName || user_now.name || user_now.user_name || "",
            };
            axios.post(`/api/${this.props.match.params.wId}/disableAllTeamsyncsinWorkspace`, checkinData).then((res) => {
              if (res.data.success) message.success(`${res.data.disabledCheckins} Check-in(s) disabled successfully`);
            });
          }
        } else if (name == "Troopr Projects" || name == "Troopr") {
          updateWorkspace(this.props.match.params.wId, "", { showSquads: !new_skill.disabled });
        }
      }else if(res.data.error && res.data.error === 'not_a_workspace_admin') message.error('Contact one of the workspace admins to enable/disable products')
    });

    // if(product==="squads"){
    //     if(e){
    //       this.props.updateWorkspace(this.props.match.params.wId, "", { showSquads: e }).then((res) => {
    //       });
    //     }else{
    //       this.props.updateWorkspace(this.props.match.params.wId, "", { showSquads: e }).then((res) => {
    //         message.success("Squads Disabled Successfully")
    //       });
    //     }
    // }
    // updateWorkspace(this.props.match.params.wId, "", { disableCheckins: false })
  };

  getTrackerOptions = () => {
    const { workspace } = this.props;
    const { skills } = this.state;
    let options = [];
    options = skills.map((skill) => {
      if (skill.name == "Jira") {
        return !skill.disabled ? <Option value={skill.name}>{skill.name}</Option> : "";
      } else if (skill.name == "GitHub") {
        if ("showGithub" in workspace) {
          return workspace.showGithub ? <Option value={skill.name}>{skill.name}</Option> : "";
        } else {
          return <Option value={skill.name}>{skill.name}</Option>;
        }
      } else if (skill.name == "Troopr") {
        if ("showSquads" in workspace) {
          return workspace.showSquads ? <Option value={skill.name}>{skill.name}</Option> : "";
        } else {
          return <Option value={skill.name}>{skill.name}</Option>;
        }
      }
    });
    return options;
  };

  setDefault = (value) => {
    // let data={assisantName:this.state.assisant_name}
    // this.setState({ defaultLoading: true })

    let data = { default: true };

    axios
      .put("/bot/api/workspace/" + this.props.match.params.wId + "/assistant_skills/" + value, data)
      .then((res) => {
        // this.setState({ defaultLoading: false })
        if (res.data.success) {
          this.setState({ defaultSkill: res.data.skill.name });
          notification.success({
            key: "projectstatus",
            message: "Default Project Management Skill Updated",
            // description: "If there is data to be sent, it will reach the configured Slack channel",
            placement: "bottomLeft",
            duration: 2,
          });
        } else {
          notification.error({ message: "Something went wrong when setting default tracker!" });
        }
      })
      .catch((err) => {
        console.error(err);
        // this.setState({ defaultLoading: false })
      });
  };

  radioStyle = {
    display: "block",
    height: "30px",
    lineHeight: "30px",
  };

  content_jira = (
    <div>
      <div>Manage Jira Software projects in Slack</div>
      <div>Manage Jira Service Desk projects in Slack</div>
      <div>Share Jira Reports in Slack</div>
    </div>
  );

  content_checkin = (
    <div>
      <div>Run Standups, Retrospectives as async Check-ins in Slack</div>
      <div>Run Jira based Planning Poker, Task Check-in</div>
      <div>Run Team mood survey and many more async Check-ins in Slack</div>
    </div>
  );

  cancelToggle = (e) => {
    console.info(e);
  };

  confirmModal = async (skill,subSkill) => {
    let title = "Are you sure?";
    let content = "";
    let name = skill.name;
    if (subSkill ? !subSkill.disabled : !skill.skill_metadata.disabled) {
      
      if (subSkill){
        if(subSkill.key === "jira_software"){
          content = (
            <div>
              This action will disable notifications for everyone in this workspace. <br /> <br />
              All notification subscriptions will be disabled. <br />
              <br />
              This action is irreversible. Are you sure?
            </div>
          );
        }else if  (subSkill.key === "jira_service_desk"){
          content = (
            <div>
              This action will disable Help Desk for everyone in this workspace. <br /> <br />
              This action is irreversible. Are you sure?
            </div>
          );
        }else if (subSkill.key === "jira_reports"){
          let res = await axios.post(`/bot/api/${this.props.match.params.wId}/disableallWorkspaceJiraReports?getCount=true`);
          if (res.data.success) {
            content = (
              <div>
                This action will disable Jira reports for everyone in this workspace. <br /> <br />
                {res.data.personalReportsCount} personal reports will be disabled. <br />
                {res.data.channelReportsCount} channel reports will be disabled. <br />
                <br />
                This action is irreversible. Are you sure?
              </div>
            );
          } else {
            content = (
              <div>
                This action will disable Jira reports for everyone in this workspace. <br /> <br />
                All notification subscriptions will be disabled. <br />
                <br />
                This action is irreversible. Are you sure?
              </div>
            );
          }
        }
      }
      else if (name == "Jira") {
        if(subSkill === 'helpdesk'){
          content = (
            <div>
              This action will disable Help Desk for everyone in this workspace. <br /> <br />
              This action is irreversible. Are you sure?
            </div>
          );
        }else if (subSkill === 'reports'){
        let res = await axios.post(`/bot/api/${this.props.match.params.wId}/disableallWorkspaceJiraReports?getCount=true`);
          if (res.data.success) {
            content = (
              <div>
                This action will disable Jira reports for everyone in this workspace. <br /> <br />
                {res.data.personalReportsCount} personal reports will be disabled. <br />
                {res.data.channelReportsCount} channel reports will be disabled. <br />
                <br />
                This action is irreversible. Are you sure?
              </div>
            );
          } else {
            content = (
              <div>
                This action will disable Jira reports for everyone in this workspace. <br /> <br />
                All notification subscriptions will be disabled. <br />
                <br />
                This action is irreversible. Are you sure?
              </div>
            );
          }
        }else{
        let res = await axios.post(`/bot/api/${this.props.match.params.wId}/disableallWorkspaceJiraReports?getCount=true`);

        if (res.data.success) {
          content = (
            <div>
              This action will disable Jira reports and notifications for everyone in this workspace. <br /> <br />
              {res.data.personalReportsCount} personal reports will be disabled. <br />
              {res.data.channelReportsCount} channel reports will be disabled. <br />
              All notification subscriptions will be disabled. <br />
              <br />
              This action is irreversible. Are you sure?
            </div>
          );
        } else {
          content = (
            <div>
              This action will disable Jira reports and notifications for everyone in this workspace. <br /> <br />
              All notification subscriptions will be disabled. <br />
              <br />
              This action is irreversible. Are you sure?
            </div>
          );
        }
      }
      // } else if (name == "Check-ins" || name == "Standups") {
      } else if (skill.key === 'standups') {
        let res = await axios.post(`/api/${this.props.match.params.wId}/disableAllTeamsyncsinWorkspace?getCount=true`);
        content = res.data.success ? (
          <div>
            This action will disable Check-ins for everyone in this workspace. <br />
            <br />
            {res.data.activeCheckinsCount} Check-ins will be disabled. <br />
            <br />
            This action is irreversible. Are you sure?
          </div>
        ) : (
          <div>
            This action will disable Check-ins for everyone in this workspace. <br />
            <br />
            This action is irreversible. Are you sure?
          </div>
        );
      } 
      else if (skill.key === 'wiki'){
        // content = (
        //   <div>
        //     This action will disable {skill.name + " Bot"} and its configurations. <br />
        //     <br />
        //     This action is irreversible. Are you sure?
        //   </div>
        // );
        
        let res = await this.props.getConfluenceChannelConfigs(this.props.match.params.wId,true,true)

        content = res.data.success ? (
          <div>
            This action will disable {skill.name + " Bot"} and its configurations. <br /><br/>

            {res.data.configs} channel reports will be disabled. <br />

            <br />
            This action is irreversible. Are you sure?
          </div>
        )
        :
        (
          <div>
            This action will disable {skill.name + " Bot"} and its configurations. <br />
            <br />
            This action is irreversible. Are you sure?
          </div>
        );
      }
      else {
        content = (
          <div>
            This action will disable {skill.name + " Bot"} and its configurations. <br />
            <br />
            This action is irreversible. Are you sure?
          </div>
        );
      }

      Modal.confirm({
        title: title,
        // content : <div>This action will disable all the enabled Check-ins in this workspace.</div>,
        content: content,
        okText: "Yes",
        okType: "primary",
        onOk: () => this.onFeatureT(skill.skill_metadata,subSkill),
      });
    } else {
      this.onFeatureT(skill.skill_metadata,subSkill);
    }
  };

  getText = (skill,sub_skill) => {
    let name = skill.name;
    if(sub_skill){
      if(sub_skill.key === 'jira_software'){
        return         <Text>
        {productDetails.project.description}
      </Text>
      }else if (sub_skill.key === 'jira_service_desk'){
        return         <Text>
        {productDetails.helpDesk.description}
      </Text>
      }else if (sub_skill.key === 'jira_reports'){
        return         <Text>
        {productDetails.report.description}
      </Text>
      }
    }
    else if (name == "Jira") {
      return (
        <Text>
          {productDetails.project.description}
        </Text>
      );
    }
    // else if (name == "Check-in" || name == "Standups") {
    else if (skill.key == 'standups') {
      return (
        <Text>
          {productDetails.checkIn.description}
        </Text>
      );
    } else if (skill.key == "wiki") {
      return (
        <Text>
          {productDetails.wiki.description}
        </Text>
      );
    } else if (name == "Troopr Projects" || name == "Troopr") {
      return (
        <Text>
          Manage you Troopr project tasks directly in Slack
          <br />
        </Text>
      );
    } else if (name == "GitHub") {
      return (
        <Text>
          Manage you Github tasks directly in Slack
          <br />
        </Text>
      );
    }
  };

  // setRadioGroupValue = () => {
  //   const { workspace, skills } = this.props;
  //   console.log('here');
  //   let radio_value
  //   if (skills.length > 0) {
  //     let jiraSkill = skills.find((skill) => skill.name === "Jira");
  //     if (!workspace.disableCheckins && !jiraSkill.skill_metadata.disabled) radio_value = "both";
  //     else if (!workspace.disableCheckins) radio_value = "checkins";
  //     else if (!jiraSkill.skill_metadata.disabled) radio_value = "jira";
  //   }
  //   this.setState({radio_value})
  // };

  getTitle(skill,sub_skill) {
    let name = skill.name;
    if (sub_skill){
      return sub_skill.name;
    }
    // else if (name == "Check-in" || name == "Standups") {
    else if (skill.key === 'standups') {
      return name;
    } else if(skill.key === "wiki") {
      return name;
    } else if(name === "Jira") {
      return "Project (Jira)";
    }else {
      return name + "(Jira)";
    }
  }

  render() {
    const { workspace, skills, isWorkspaceAdmin } = this.props;

    const { githubToggleLoading, squadsToggleLoading, jiraProjectToggleLoading, CheckinsToggleLoading, disableFeatureToggle, restrictProduct } = this.state;
    let wId = this.props.match.params.wId;
    const jiraSkill = skills.find((skill) => skill.name === "Jira");
    
    const isOnlyOneFeatureEnabled = this.countEnabledFeatures();
    let confluenceSkill = skills.find((skill) => skill.key === "wiki");
 
    if (confluenceSkill) {
      confluenceSkill = confluenceSkill.skill_metadata;
    }

    // console.log(confluenceSkill,skills)
    // let radio_value;
    // if (skills.length > 0) {
    //   let jiraSkill = skills.find((skill) => skill.name === "Jira");
    //   if (!workspace.disableCheckins && !jiraSkill.skill_metadata.disabled) radio_value = "both";
    //   else if (!workspace.disableCheckins) radio_value = "checkins";
    //   else if (!jiraSkill.skill_metadata.disabled) radio_value = "jira";
    // }

    return (
      <>
        <PageHeader title='Products' subTitle='Manage Troopr Products for your workspace' />
        {!isWorkspaceAdmin &&
          <Alert message="Allow only Workspace administrators to activate or deactivate Troopr products" type="warning" showIcon closable  style={{ marginInline: 15 }}/>
        }
        <Content className='site-layout-background' style={{ padding: "16px 16px 32px 16px", overflow: "scroll" }}>
          <Row gutter={[16, 16]}>
            {skills.map((skill) => {
              if (skill.skill_metadata && (skill.is_enabled || (!skill.is_enabled && !skill.skill_metadata.disabled))) {
                if (skill.skill_metadata.sub_skills && skill.skill_metadata.sub_skills.length > 0) {
                  return skill.skill_metadata.sub_skills.map(sub_skill => {
                    return                     <>
                    <Col span={8} style={{ display: "flex" }}>
                      <Card
                        // title={this.getTitle(skill,sub_skill)}
                        title={sub_skill.name}
                        style={{ width: "100%" }}
                        size='small'
                        extra={
                          <Switch
                            size='small'
                            checked={!sub_skill.disabled}
                            //  disabled={isOnlyOneFeatureEnabled}
                            disabled={isWorkspaceAdmin ? isOnlyOneFeatureEnabled && !sub_skill.disabled : true }
                            onChange={() => this.confirmModal(skill,sub_skill)}
                          />
                        }
                      >
                        {this.getText(skill,sub_skill)}
                      </Card>
                    </Col>
                  </>
                  })
                } else
                  return (
                    <Col span={8} style={{ display: "flex" }}>
                      <Card
                        title={this.getTitle(skill)}
                        style={{ width: "100%" }}
                        size='small'
                        extra={
                          <Switch
                          
                            size='small'
                            checked={skill.skill_metadata && !skill.skill_metadata.disabled}
                            disabled={isWorkspaceAdmin ? isOnlyOneFeatureEnabled && skill.skill_metadata && !skill.skill_metadata.disabled : true}
                         

                            //  disabled={isOnlyOneFeatureEnabled}
                            onChange={() => this.confirmModal(skill)}
                          />
                        }
                      >
                        {this.getText(skill)}
                      </Card>
                    </Col>
                  );
              }
            })}
          </Row>
          {/* <Col span={24} style={{ display: "flex",marginTop: 40 }}>
                        <Card
                          title={"dashboard card"}
                          style={{ width: "100%" }}
                          size='default'
                          extra={
                            <Switch
                            size='small'
                            checked = {workspace.isRestricteDisabledProductInDashboard}
                            onChange={this.restrictedCardDashboard}
                            />
                          }
                        >
                        TO restrict card for dash boardId
                        </Card>
                      </Col> */}
                      <br />
                      <br />
                      {isWorkspaceAdmin && <Collapse>
                <Collapse.Panel
                  size="small"
                  header="Restrict Product Activation"
                  key="2"
                  extra={
                    <Switch
                      size="small"
                      checked = {workspace.isRestricteDisabledProductInDashboard}
                      onChange={this.restrictedCardDashboard}
                      onClick={(checked, event) => {
                        event.stopPropagation();
                      }}
                    />
                  }
                >
                  <Text type="secondary">
                    Allow only Workspace administrators to activate or
                    deactivate Troopr products
                  </Text>
                </Collapse.Panel>
              </Collapse>}
        </Content>
      </>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    workspace_name: store.common_reducer.workspace.name,
    workspace: store.common_reducer.workspace,
    user_now: store.common_reducer.user,
    skills: store.skills.skills,
    isWorkspaceAdmin: store.common_reducer.isAdmin,
    members: store.skills.members,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    updateWorkspace,
    updateSkill,
    getConfluenceChannelConfigs
  })(Products)
);

{
  /* <div>
<Text type='secondary' strong style={{ marginRight: 8 }}>
  Squads
</Text>
<Switch
  size='small'
  checked={"showSquads" in workspace ? workspace.showSquads : true}
  onChange={(e) => this.onFeatureToggle(e, "squads")}
  loading={squadsToggleLoading}
  onClick={(checked, event) => {
    event.stopPropagation();
  }}
  disabled={disableFeatureToggle && ("showSquads" in workspace ? workspace.showSquads : true)}
/>

</div>
<Text type='secondary'>Troopr's agile project management (Beta)</Text>
<br />
<br />
<div>
<Text type='secondary' strong style={{ marginRight: 8 }}>
  GitHub
</Text>
<Switch
  size='small'
  checked={"showGithub" in workspace ? workspace.showGithub : true}
  onChange={(e) => this.onFeatureToggle(e, "github")}
  loading={githubToggleLoading}
  onClick={(checked, event) => {
    event.stopPropagation();
  }}
  disabled={disableFeatureToggle && ("showGithub" in workspace ? workspace.showGithub : true)}

/>
</div>
<Text type='secondary'>Troopr's Slack integration for GitHub (Beta)</Text>
<br />
<br />
<div>
<Text type='secondary' strong style={{ marginRight: 8 }}>
  Jira
</Text>
{workspace.disableJiraProjects ? <Switch
  size='small'
  checked={!workspace.disableJiraProjects}
  onChange={(e) => this.onFeatureToggle(e, "jira")}
  loading={jiraProjectToggleLoading}
  onClick={(checked, event) => {
    event.stopPropagation();
  }}
  disabled={disableFeatureToggle && !workspace.disableJiraProjects}
/>
:
<Popconfirm
title={'This action will disable all the enabled Personal and Channel Repotrs in this workspace, Are you sure?'}
onConfirm={(e) => this.onFeatureToggle(workspace.disableJiraProjects, "jira")}
>
<Switch
  size='small'
  checked={!workspace.disableJiraProjects}
  // onChange={(e) => this.onFeatureToggle(e, "jira")}
  loading={jiraProjectToggleLoading}
  // onClick={(checked, event) => {
  //   event.stopPropagation();
  // }}
  disabled={disableFeatureToggle && !workspace.disableJiraProjects}
/>
</Popconfirm>
}
</div>
<Text type='secondary'>Troopr's Slack integration for Jira</Text>
<br />
<br />
<div>
<Text type='secondary' strong style={{ marginRight: 8 }}>
  Check-ins
</Text>
{workspace.disableCheckins ? <Switch
  size='small'
  checked={!workspace.disableCheckins}
  onChange={(e) => this.onFeatureToggle(e, "checkins")}
  loading={CheckinsToggleLoading}
  onClick={(checked, event) => {
    event.stopPropagation();
  }}
  disabled={disableFeatureToggle && !workspace.disableCheckins}
/>
:
<Popconfirm
title={'This action will disable all the enabled checkins in this workspace, Are you sure?'}
onConfirm={(e) => this.onFeatureToggle(workspace.disableCheckins, "checkins")}
>
  <Switch
  size='small'
  checked={!workspace.disableCheckins}
  // onChange={(e) => this.onFeatureToggle(e, "checkins")}
  loading={CheckinsToggleLoading}
  // onClick={(checked, event) => {
  //   event.stopPropagation();
  // }}
  disabled={disableFeatureToggle && !workspace.disableCheckins}
/>
</Popconfirm>

}
</div>
<Text type='secondary'>Troopr's Check-ins</Text> */
}
