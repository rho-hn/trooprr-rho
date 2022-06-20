import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import axios from "axios";

import { DownOutlined, MailOutlined, QuestionCircleOutlined } from "@ant-design/icons";

import {
  PageHeader,
  Tabs,
  Typography,
  Button,
  Select,
  message,
  Layout,
  Menu,
  Row,
  Col,
  Divider,
  Input,
  List,
  Avatar,
  Dropdown,
  Form,
  Alert,
  Modal,
  Switch,
  notification,
  Card,
  Collapse,
  Popconfirm,
  Radio,
  Popover,
} from "antd";

import { updateWorkspace, updateSkill } from "../skills/skills_action";
import Feedback from "./feedback";

const isValidWSName = (id) => id && id.length >= 3; //TODO:improve this validation
const { Option } = Select;
const { Content } = Layout;
const { Text } = Typography;

class WorkspaceProfile extends Component {
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
    };
  }

  componentDidMount() {
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
      this.setState({ skills, defaultSkill: defaultSkill.name });
    });

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

  onFeatureToggle = (e) => {
    const { defaultSkill, user_now, updateSkill, skills, updateWorkspace } = this.props;
    const product = e.target.value;
    const jiraSkill = skills.find(skill => skill.name === 'Jira')
    const skill_id = jiraSkill.skill_metadata._id
    if (jiraSkill) {
      if (product === "jira") {
        const data = {disabled : false}
        updateSkill(skill_id, this.props.match.params.wId, data)
        updateWorkspace(this.props.match.params.wId, "", { disableCheckins: true })
        const checkinData = {
          edited_by: user_now._id,
          edited_by_name: user_now.displayName || user_now.name || user_now.user_name || "",
        };
        axios.post(`/api/${this.props.match.params.wId}/disableAllTeamsyncsinWorkspace`, checkinData).then((res) => {
          if (res.data.success) message.success(`${res.data.disabledCheckins} Check-in(s) disabled successfully`);
        });

      } else if (product === "checkins") {
        const data = {disabled : true}
        updateSkill(skill_id, this.props.match.params.wId, data)
        updateWorkspace(this.props.match.params.wId, "", { disableCheckins: false })
        axios.post(`/bot/api/${this.props.match.params.wId}/disableallWorkspaceJiraReports`).then((res) => {
          if (res.data.success) message.success(`${res.data.disabledReports} Report(s) disabled successfully`);
        });
      } else {
        const data = {disabled : false}
        updateSkill(skill_id, this.props.match.params.wId, data)
        updateWorkspace(this.props.match.params.wId, "", { disableCheckins: false })
      }
    }

    // if (feature === "squads") {
    //   this.setState({ squadsToggleLoading: true });
    //   this.props.updateWorkspace(this.props.match.params.wId, "", { showSquads: check }).then((res) => {
    //     this.setState({ squadsToggleLoading: false });
    //     this.checkFeatures();
    //   });

    //   //if squads is the default tracker, changing it to Jira
    //   // if (defaultSkill == "Troopr") {
    //   //   axios.put("/bot/api/workspace/" + this.props.match.params.wId + "/assistant_skills/" + "Jira", { default: true }).then((res) => {
    //   //     if (res.data.success) {
    //   //       this.setState({ defaultSkill: "Jira" });
    //   //       message.success("Default Project Management Skill Changed to Jira");
    //   //     }
    //   //   });
    //   // }
    // } else if (feature === "github") {
    //   this.setState({ githubToggleLoading: true });
    //   this.props.updateWorkspace(this.props.match.params.wId, "", { showGithub: check }).then((res) => {
    //     this.setState({ githubToggleLoading: false });
    //     this.checkFeatures();
    //   });

    //   //if github is the default tracker, changing it to Jira
    //   // if (defaultSkill == "GitHub") {
    //   //   axios.put("/bot/api/workspace/" + this.props.match.params.wId + "/assistant_skills/" + "Jira", { default: true }).then((res) => {
    //   //     if (res.data.success) {
    //   //       this.setState({ defaultSkill: "Jira" });
    //   //       message.success("Default Project Management Skill Changed to Jira");
    //   //     }
    //   //   });
    //   // }
    // } else if (feature === "jira") {
    //   this.setState({ jiraProjectToggleLoading: true });
    //   this.props.updateWorkspace(this.props.match.params.wId, "", { disableJiraProjects: !check }).then((res) => {
    //     this.setState({ jiraProjectToggleLoading: false });
    //     this.checkFeatures();
    //   });

    //   axios.post(`/bot/api/${this.props.match.params.wId}/disableallWorkspaceJiraReports`).then((res) => {
    //     if (res.data.success) message.success(`${res.data.disabledReports} reports disabled successfully`);
    //   });
    // } else if (feature === "checkins") {
    //   this.setState({ CheckinsToggleLoading: true });
      // this.props.updateWorkspace(this.props.match.params.wId, "", { disableCheckins: !check }).then((res) => {
      //   this.setState({ CheckinsToggleLoading: false });
      //   this.checkFeatures();
      // });
    //   if (!check) {
    //     const data = {
    //       edited_by: user_now._id,
    //       edited_by_name: user_now.name || user_now.user_name || "",
    //     };
    //     axios.post(`/api/${this.props.match.params.wId}/disableAllTeamsyncsinWorkspace`, data).then((res) => {
    //       if (res.data.success) message.success(`${res.data.disabledCheckins} check-ins disabled successfully`);
    //     });
    //   }
    // }
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

  openWarningModal = (e) => {
    const product = e.target.value

    if(product === 'checkins') {
      axios.post(`/bot/api/${this.props.match.params.wId}/disableallWorkspaceJiraReports?getCount=true`).then((res) => {
        res.data.success && Modal.confirm({
          title:'Are you sure?',
          // content : <div>This action will disable all the enabled Personal and Channel Reports and all the Notifications in this workspace.</div>,
          content : <div>This action will disable Jira reports and notifications for everyone in this workspace. <br/> <br/>
          {res.data.personalReportsCount} personal reports will be disabled. <br/>
          {res.data.channelReportsCount} channel reports will be disabled. <br/>
          All notification subscriptions will be disabled. <br/><br/>
          This action is irreversible. Are you sure?
          </div>,
          okText : 'Yes',
          okType:'primary',
          onOk: () => this.onFeatureToggle(e)
        })
      });
    }else if(product === 'jira') {
      axios.post(`/api/${this.props.match.params.wId}/disableAllTeamsyncsinWorkspace?getCount=true`).then((res) => {
        res.data.success && Modal.confirm({
          title:'Are you sure?',
          // content : <div>This action will disable all the enabled Check-ins in this workspace.</div>,
          content : <div>This action will disable Check-ins for everyone in this workspace. <br/><br/>
            {res.data.activeCheckinsCount} Check-ins will be disabled. <br/><br/>
            This action is irreversible. Are you sure?
          </div>,
          okText : 'Yes',
          okType:'primary',
          onOk: () => this.onFeatureToggle(e)
        })
      });
    }else this.onFeatureToggle(e)
  }
  

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

  render() {
    const { workspace, skills } = this.props;
    const { githubToggleLoading, squadsToggleLoading, jiraProjectToggleLoading, CheckinsToggleLoading, disableFeatureToggle } = this.state;
    let wId = this.props.match.params.wId;
    let admin = this.props.WorkspaceAdmin;
    let radio_value
    if (skills.length > 0) {
      let jiraSkill = skills.find((skill) => skill.name === "Jira");
      if (!workspace.disableCheckins && !jiraSkill.skill_metadata.disabled) radio_value = "both";
      else if (!workspace.disableCheckins) radio_value = "checkins";
      else if (!jiraSkill.skill_metadata.disabled) radio_value = "jira";
    }

    return (
      <>
        <PageHeader
          // title={this.props.workspace_name}
          title='Workspace Profile'
          // extra={[
          //   <Button disabled type="danger" onClick={this.leavemodalToggle}>Leave Workspace</Button>
          // ]}
        />
        <Content
          style={{
            padding: "16px 16px 32px 24px",
            overflow: "scroll",
            height: "75vh",
            // background: (localStorage.getItem('theme') == 'default' ? "#ffffff" : "rgba(15,15,15)")
          }}
        >
          <Row style={{ width: "50%" }} gutter={[0, 16]}>
            <Col span={24}>
              <Card title='Workspace Name' style={{ width: "100%" }} size='small' >
                <Form
                
                  autocomplete='off'
                  ref={this.formRef}
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 14 }}
                  name='userProfileForm'
                  hideRequiredMark={true}
                  initialValues={{
                    workspace: {
                      name: this.props.workspace_name,
                    },
                  }}
                  onFinish={this.update}
                  style={{ marginBottom: "-25px" }}
                >
                  <Form.Item labelAlign='left' name={["workspace", "name"]} rules={[{ min: 3, required: true }]}>
                    <Input disabled= {!admin}/>
                  </Form.Item>
                  <Form.Item shouldUpdate={true}>
                    {() => (
                      <Button
                        htmlType='submit'
                        disabled={
                          (this.formRef &&
                          this.formRef.current &&
                          (!this.formRef.current.isFieldsTouched(true) ||
                            this.formRef.current.getFieldsError().filter(({ errors }) => errors.length).length)) || !admin
                        }
                        type='primary'
                      >
                        Save
                      </Button>
                    )}
                  </Form.Item>
                </Form>
              </Card>
            </Col>
            {this.props.isAdmin && (
              <Col span={24}>
                <Collapse>
                {/*
                  <Collapse.Panel header='Default Issue Tracker and Ticketing Tool' key='1'>
                    {!this.state.loading && (
                      <Select style={{ width: 200, marginRight: 8 }} value={this.state.defaultSkill} onChange={this.setDefault}>
                        {this.getTrackerOptions()}
                      </Select>
                    )}
                  </Collapse.Panel>
                    */}
                  {/*<Collapse.Panel header='Enable / Disable products' key='2'>
                    <Row>
                      <Col span={12}>
                        {/* <Radio.Group onChange={(e) => this.onFeatureToggle(e)} value={radio_value}> }
                        <Radio.Group onChange={(e) => this.openWarningModal(e)} value={radio_value}>
                          <Radio style={this.radioStyle} value={"jira"}>
                            <span style={{ paddingRight: 8 }}>Managing Jira Projects & Service Desk in Slack</span>
                            <Popover content={this.content_jira} title='What do I get?' trigger='hover'>
                              <QuestionCircleOutlined size='small' />
                            </Popover>
                          </Radio>
                          <Radio style={this.radioStyle} value={"checkins"}>
                            <span style={{ paddingRight: 8 }}>Conducting Slack Check-in meetings</span>
                            <Popover content={this.content_checkin} title='What do I get?' trigger='hover'>
                              <QuestionCircleOutlined size='small' />
                            </Popover>
                          </Radio>
                          <Radio style={this.radioStyle} value={"both"}>
                            <span>Both</span>
                          </Radio>
                        </Radio.Group>
                      </Col>
                    </Row>
                  </Collapse.Panel>
                    </Collapse.Panel>*/}
                </Collapse>

                <Feedback />
              </Col>
            )}
          </Row>
        </Content>
        <Modal
          visible={this.state.leavemodal}
          onOk={() => this.leaveWorkspace(this.props.match.params.wId)}
          onCancel={this.leavemodalToggle}
          okText='Leave'
        >
          <p>Are you sure you want to leave the Workspace</p>
          <p>'{this.props.workspace_name}'?</p>
        </Modal>
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
    WorkspaceAdmin: store.common_reducer.isAdmin
  };
};

export default withRouter(
  connect(mapStateToProps, {
    updateWorkspace,
    updateSkill,
  })(WorkspaceProfile)
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
