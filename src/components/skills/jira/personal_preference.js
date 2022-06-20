import React, { Component } from "react";
import {
  setDefaultChannel,
  getDefaultChannel,
  getIssues,
  getProject,
  personalSetting,
  logOutSkillUser,
  addUserBasicToken,
  addBasicAuth,
  getMappedUser,
  getJiraUserNotifConfig,
  setUserJiraNotifConfig,
  deleteUserConfig,
  getSkillUser,
  getJiraBoards,
  deleteDefaultChannel,
  getServiceDeskProject,
  deleteChannelConfigurations,
  getCommonData,
} from "../skills_action";
import { connect } from "react-redux";
import moment from "moment";
import JiraPersonalNotification from "./presonal_notification";
import IssueCardCustomization from "./issueCardFieldCustomization";
import MultiTaskIt from "./multi_task_It";
import { withRouter } from "react-router-dom";
import { SettingOutlined } from "@ant-design/icons";
import { Form } from "@ant-design/compatible";
import "@ant-design/compatible/assets/index.css";
import "./personal_preferences.css";
import {
  Button,
  Select,
  Dropdown,
  Menu,
  Modal,
  Card,
  message,
  Row,
  Col,
  Divider,
  Input,
  Layout,
  Typography,
  Collapse,
  Switch,
  Checkbox,
  PageHeader,
  Popconfirm,
  Alert,
  Anchor,
  Affix,
} from "antd";
import "../jira/jira.css";
import JiraServerModal from "./jira_server_modal";
import { getOauthTokensForUsers } from "../../jiraoauth/jiraoauth.action";
import { getOauthTokensForCloudUsers } from "../../jiraoauth/jiraOAuthCloud.action";

import axios from "axios";
const { Option } = Select;
const { Content } = Layout;
const { Panel } = Collapse;
const { Link } = Anchor;
const { Text, Paragraph } = Typography;

const setFieldValueValues = [
  {
    label: "Parent",
    value: "parent",
  },
  {
    label: "Components",
    value: "components",
  },
  {
    label: "Sprint",
    value: "sprint",
  },
  {
    label: "Fix versions",
    value: "fix_versions",
  },
  {
    label: "Priority",
    value: "priority",
  },
  {
    label: "Team",
    value: "team",
  },
  {
    label: "Labels",
    value: "labels",
  },
  {
    label: "Test Team",
    value: "test_team",
  },
  {
    label: "Assignee",
    value: "assignee",
  },
];

class JiraPersonalPreference extends Component {
  defaultState = {
    loading: false,
    channels: [],
    projects: [],
    issues: [],
    defaultProject: "",
    defaultIssue: "",
    skillsToggle: false,
    notificationToggle: false,
    personalNotifToggle: false,
    selectedChannel: "",
    selectedProject: "",
    edit: false,
    error: {},
    unlinkJiraAccount: false,
    dropdownOpen: false,
    setFieldValueField: "",
    setFieldInputField: "",
    defaultloading: false,
    newConnectionModal: false,
    board: "",
    boardData: [],
    isThreadSync: false,

    //jsd
    jsd_edit: false,
    selectedJsdProject: "",
    selectedJsdRequestType: "",
    create_tickets_by_default: false,
    preference: "channel",
  };

  constructor(props) {
    super(props);
    this.state = {
      ...this.defaultState,
      currentSkill: this.props.match.params.skill_id,
      personalChannelId: "",
      personalConnected: false,
    };

    this.onClickPersonalNotificationToggle =
      this.onClickPersonalNotificationToggle.bind(this);
    this.openEditState = this.openEditState.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onClickSave = this.onClickSave.bind(this);
    this.onChangeIssue = this.onChangeIssue.bind(this);
  }

  componentDidMount() {
    var UserID = localStorage.trooprUserId;
    this.props
      .getSkillUser(
        this.props.match.params.wId,
        this.props.match.params.skill_id
      )
      .then((res) => {
        if (
          res.data.skillUser &&
          res.data.skillUser.token_obj &&
          res.data.skillUser.token_obj.access_token
        ) {
          this.setState({ personalConnected: true });
        }
      });
    this.setState({ loading: true, jsd_loading: true });
    let skillId = this.props.match.params.skill_id;
    if (this.props.isFromCheckins) {
    } else {
      this.props.getProject(this.props.match.params.wId);
      this.props
        .getServiceDeskProject(
          this.props.match.params.wId,
          this.props.match.params.skill_id,
          true
        )
        .then((res) => {
          this.setState({ jsd_loading: false });
        });
      this.props
        .personalSetting(this.props.workspace_id, UserID)
        .then((res) => {
          if (res.data.success) {
            this.setState({ personalChannelId: res.data.channel.id });
            this.getCommonData(res.data.channel.id);
            this.props
              .getDefaultChannel(
                this.props.match.params.skill_id,
                res.data.channel.id,
                "personal"
              )
              .then((res) => {
                this.setState({ loading: false });
                if (res.data.success) {
                  if (res.data.link_info) {
                    if (
                      res.data.link_info &&
                      res.data.link_info.link_info.project_id
                    ) {
                      this.setState({
                        defaultProject: res.data.link_info.link_info.project_id,
                        defaultIssue: res.data.link_info.link_info.issue_id,
                        board: res.data.link_info.link_info.board
                          ? res.data.link_info.link_info.board.id.toString()
                          : null,
                      });
                      this.props.getIssues(
                        this.props.match.params.wId,
                        res.data.link_info.link_info.project_id
                      );
                      let query = "projectKeyOrId=" + this.state.defaultProject;
                      /*res.data.link_info.link_info.board&&*/ this.props
                        .getJiraBoards(this.props.match.params.wId, query)
                        .then((boardData) => {
                          if (
                            boardData.data.boards &&
                            boardData.data.boards[0] &&
                            boardData.data.boards[0].name
                          ) {
                            // this.setState({ board: boardData.data.boards[0].name })
                            this.setState({ boardData: boardData.data.boards });
                          }
                        });
                    }

                    if (res.data.link_info.link_info.jira_service_desk) {
                      this.setState({
                        selectedJsdProject:
                          res.data.link_info.link_info.jira_service_desk
                            .project_id,
                        selectedJsdRequestType:
                          res.data.link_info.link_info.jira_service_desk
                            .requestType.name,
                        create_tickets_by_default:
                          res.data.link_info.link_info
                            .create_tickets_by_default || false,
                      });
                      this.props.getIssues(
                        this.props.match.params.wId,
                        res.data.link_info.link_info.jira_service_desk
                          .project_service_desk_id,
                        true,
                        true
                      );
                      // .then(res => console.log('here'));
                    }
                  } else {
                    this.setState({ defaultProject: "", defaultIssue: "" });
                  }
                }
              });
            let channel_id = res.data.channel.id;
            // this.getCommonChannelDataForPersonal(channel_id)
          } else {
            this.setState({ loading: false });
          }
        });
    }
  }

  getCommonData = (channel_id) => {
    const { team } = this.props;
    if (!channel_id) channel_id = this.state.personalChannelId;
    const isGridWorkspace =
      team.bot &&
      team.bot.meta &&
      team.bot.meta.enterprise &&
      team.bot.meta.enterprise.id
        ? true
        : false;
    this.props
      .getCommonData(
        this.props.match.params.wId,
        this.props.match.params.skill_id,
        this.props.isWorkspaceAdmin,
        isGridWorkspace,
        [channel_id],
        false,
        true /* is personalPref */
      )
      .then((res) => {
        if (res.success) {
          let data = res.commonData && res.commonData[0];
          if (data) {
            this.setState({ isThreadSync: data.isThreadSync });
          }
        }
      });
  };

  // getCommonChannelDataForPersonal = (channel_id) => {
  //   // Get commonChannelData for personal
  //   let wId = this.props.match.params.wId;
  //   let skillId = this.props.match.params.skill_id;
  //   let url = `/bot/api/${wId}/getAllJiraCommonConfig/${skillId}/${channel_id}`;
  //   axios.get(url).then(res => {
  //     if (res.data && res.data.success) {
  //       let data = res.data && res.data.data && res.data.data[0];
  //       if (data) {
  //         this.setState({isThreadSync: data.isThreadSync})
  //       }
  //     }
  //   }).catch(e => {
  //     console.error(e);
  //   })
  // }

  goToUserJiraLogin = async (servertype) => {
    if (servertype && servertype === "jira_server_oauth") {
      let url = await getOauthTokensForUsers(
        this.props.match.params.wId,
        this.props.match.params.sub_skill
      );
      if (!url) {
        message.error(
          "Error Logging in make sure you connected to jira or disconnect and try connection jira again"
        );
      } else {
        window.open(url, "_blank");
      }
    } else if (servertype && servertype === "jira_cloud_oauth") {
      let url = await getOauthTokensForCloudUsers(
        this.props.match.params.wId,
        this.props.match.params.sub_skill
      );
      if (!url) {
        message.error(
          "Error Logging in make sure you connected to jira or disconnect and try connection jira again"
        );
      } else {
        window.open(url, "_blank");
      }
    } else {
      const url = `/${this.props.match.params.wId}/jira_user_oauth/${this.props.match.params.skill_id}`;
      window.open(url, "_blank");
    }

    /*this.props.history.push("/workspace/"+this.props.workspace_id+"/jira_user_oauth/"+this.props.skill._id)*/
  };

  unlinkJiraAccountToggle = () => {
    this.setState({ unlinkJiraAccount: !this.state.unlinkJiraAccount });
  };

  logOutSkillUser() {
    this.props
      .logOutSkillUser(
        this.props.workspace_id,
        this.props.match.params.skill_id
      )
      .then((res) => {
        this.setState(
          { unlinkJiraAccount: !this.state.unlinkJiraAccount },
          () => {
            this.props
              .getSkillUser(
                this.props.match.params.wId,
                this.props.match.params.skill_id
              )
              .then((res) => {
                res.data.success && this.setState({ personalConnected: false });
              });
            this.props.deleteUserConfig(
              this.props.match.params.wId,
              this.props.match.params.skill_id,
              this.state.personalChannelId
            );
          }
        );
      });
  }

  dropdownToggle = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  onChangeIssue = (event) => {
    this.setState({ defaultIssue: event });
  };

  onClickPersonalNotificationToggle = () => {
    this.setState({
      personalNotifToggle: !this.state.personalNotifToggle,
      error: {},
    });
  };

  onChangeProject = async (event) => {
    let query = "projectKeyOrId=" + event;
    let boardData = await this.props.getJiraBoards(
      this.props.match.params.wId,
      query
    );
    if (
      boardData.data.success &&
      boardData.data.boards &&
      boardData.data.boards.length > 0 &&
      boardData.data.boards[0].name
    ) {
      this.setState({
        boardData: boardData.data.boards,
        board: boardData.data.boards[0].id.toString(),
      });
    } else this.setState({ boardData: [], board: null });
    this.setState({ defaultProject: event });
    /*console.log("project valueeeeee",this.state.selectedProject);*/
    this.props.getIssues(this.props.match.params.wId, event).then((res) => {
      if (res.data.success)
        this.setState({ defaultIssue: res.data.issueTypes[0].value });
    });
  };

  onChangeJsdProject = async (value, event) => {
    this.setState({ selectedJsdProject: value, selectedJsdRequestType: "" });
    this.props
      .getIssues(this.props.match.params.wId, event.key, true, true)
      .then((res) => {
        if (res.data.success)
          this.setState({
            selectedJsdRequestType: res.data.issueTypes[0].value,
          });
      });
  };

  setRequesType = (value) => this.setState({ selectedJsdRequestType: value });

  onChangeBoard = (event, value) => {
    this.setState({ board: value && value.key ? value.key : null });
  };

  openEditState = async (isJsdConfig) => {
    if (isJsdConfig) {
      this.setState({ jsd_edit: true });
    } else {
      this.setState({ edit: true });
      if (this.props.personalChannelDefault.link_info) {
        if (this.props.personalChannelDefault.link_info.project_id) {
          if (this.props.personalChannelDefault.link_info) {
            let query =
              "projectKeyOrId=" +
              this.props.personalChannelDefault.link_info.project_id;
            await this.props
              .getJiraBoards(this.props.match.params.wId, query)
              .then((boardData) => {
                if (
                  boardData &&
                  boardData.data &&
                  boardData.data.boards &&
                  boardData.data.boards.length > 0 &&
                  boardData.data.boards[0].name
                ) {
                  this.setState({ boardData: boardData.data.boards });
                } else this.setState({ boardData: [] });
              });
          }
        }
      }
    }
  };

  onCancel = async (isJsdConfig) => {
    const { personalChannelDefault } = this.props;
    if (isJsdConfig) {
      if (personalChannelDefault.link_info.jira_service_desk) {
        const jira_service_desk_default =
          personalChannelDefault.link_info.jira_service_desk;
        this.setState({
          selectedJsdProject: jira_service_desk_default.project_id,
          selectedJsdRequestType: jira_service_desk_default.requestType.name,
        });
        this.props.getIssues(
          this.props.match.params.wId,
          jira_service_desk_default.project_service_desk_id,
          true,
          true
        );
      } else {
        this.setState({
          selectedJsdProject: "",
          selectedJsdRequestType: "",
          create_tickets_by_default:
            personalChannelDefault.create_tickets_by_default || false,
        });
      }
      this.setState({ jsd_edit: false });
    } else {
      var defaultIssue = "";
      var defaultProject = "";
      if (this.props.personalChannelDefault.link_info) {
        if (this.props.personalChannelDefault.link_info.project_id) {
          defaultProject =
            this.props.personalChannelDefault.link_info.project_id;
          if (this.props.personalChannelDefault.link_info) {
            let query =
              "projectKeyOrId=" +
              this.props.personalChannelDefault.link_info.project_id;
            await this.props
              .getJiraBoards(this.props.match.params.wId, query)
              .then((boardData) => {
                if (
                  boardData &&
                  boardData.data &&
                  boardData.data.boards &&
                  boardData.data.boards.length > 0 &&
                  boardData.data.boards[0].name
                ) {
                  this.setState({
                    boardData: this.props.personalChannelDefault.link_info.board
                      ? boardData.data.boards
                      : [],
                  });
                } else this.setState({ boardData: [] });
              });
          }
          this.setState({
            board: this.props.personalChannelDefault.link_info.board
              ? this.props.personalChannelDefault.link_info.board.id.toString()
              : null,
          });
          this.props.getIssues(this.props.match.params.wId, defaultProject);
        }
        if (this.props.personalChannelDefault.link_info.issue_id) {
          defaultIssue = this.props.personalChannelDefault.link_info.issue_id;
        }
        this.setState({
          edit: false,
          defaultProject: defaultProject,
          defaultIssue: defaultIssue,
          error: {},
        });
      } else {
        this.setState({
          edit: false,
          errors: {},
          defaultProject: "",
          defaultIssue: "",
          board: "",
          boardData: [],
        });
      }
    }
  };

  onClickSave = () => {
    const { issues, projects, personalChannelDefault } = this.props;
    var error = {};
    let selectedIssueData =
      issues && issues.find((issue) => issue.value == this.state.defaultIssue);
    let selectedProjectData =
      projects &&
      projects.find((project) => project.id == this.state.defaultProject);
    // console.log('data',selectedIssueData,selectedProjectData)
    var data = {
      link_info: {
        issue_id: this.state.defaultIssue,
        project_id: this.state.defaultProject,
        project_name: selectedProjectData && selectedProjectData.name,
        issueName: selectedIssueData && selectedIssueData.value,
        issueType: { id: selectedIssueData.id, name: selectedIssueData.text },
      },
    };
    let selectedBoardData =
      this.state.board &&
      this.state.boardData.find((board) => board.id == this.state.board);
    // data.link_info.board = selectedBoardData ? {id:selectedBoardData.id.toString(), name:selectedBoardData.name} : null;
    data.link_info.board = selectedBoardData ? selectedBoardData : null;
    data.channel_id = this.state.personalChannelId;
    data.updated_by = localStorage.trooprUserId;
    data.skill_id = this.props.match.params.skill_id;
    // console.log('data',data)

    if (
      personalChannelDefault.link_info &&
      personalChannelDefault.link_info.jira_service_desk
    ) {
      data.link_info.jira_service_desk =
        personalChannelDefault.link_info.jira_service_desk;
      data.link_info.create_tickets_by_default =
        personalChannelDefault.link_info.create_tickets_by_default || false;
    }
    if (
      data.link_info.issue_id &&
      data.link_info.project_id &&
      data.channel_id &&
      localStorage.trooprUserId
    ) {
      this.setState({ defaultloading: true });
      this.props
        .setDefaultChannel(
          this.props.match.params.skill_id,
          data,
          this.state.preference
        )
        .then((res) => {
          if (res.data.success) {
            this.getCommonData();
            this.setState({
              defaultProject: res.data.link_info.link_info.project_id,
              defaultIssue: res.data.link_info.link_info.issue_id,
              edit: false,
              error: {},
            });
            !res.data.link_info.link_info.board &&
              this.setState({ boardData: [] });
            this.setState({ defaultloading: false });
            message.success("Saved successfully");
          }
        });
    } else {
      if (!this.state.defaultProject) {
        message.error("No Issue project selected");
      } else if (!this.state.defaultIssue) {
        message.error("No Issue type selected");
      }
      this.setState({ error: error });
    }
  };

  onJsdDefaultSave = () => {
    const { selectedJsdProject, selectedJsdRequestType } = this.state;
    if (!selectedJsdProject) message.error("No ticket project selected");
    else if (!selectedJsdRequestType) message.error("No request type selected");
    else this.saveJsdDefaults();
  };

  saveJsdDefaults = () => {
    const { requestTypes, jsd_projects, personalChannelDefault } = this.props;
    const {
      selectedJsdProject,
      selectedJsdRequestType,
      create_tickets_by_default,
    } = this.state;
    let data = {};
    let jira_service_desk = {};

    const projectData = jsd_projects.find(
      (project) => project.projectId === selectedJsdProject
    );
    const requestTypeData = requestTypes.find(
      (requestType) => requestType.value === selectedJsdRequestType
    );
    if (projectData && requestTypeData) {
      jira_service_desk = {
        project_id: projectData.projectId,
        project_service_desk_id: projectData.id,
        project: projectData,
        project_name: `${projectData.projectName} (${projectData.projectKey})`,
        requestType: { name: requestTypeData.value, id: requestTypeData.id },
      };
    }

    if (
      personalChannelDefault &&
      personalChannelDefault.link_info &&
      personalChannelDefault.link_info.project_id
    ) {
      data.link_info = personalChannelDefault.link_info;
      data.link_info.jira_service_desk = jira_service_desk;
      data.link_info.create_tickets_by_default = create_tickets_by_default;
    } else {
      data.link_info = { jira_service_desk, create_tickets_by_default };
    }

    data.channel_id = this.state.personalChannelId;
    data.updated_by = localStorage.trooprUserId;
    data.skill_id = this.props.match.params.skill_id;
    data.workspace_id = this.props.match.params.wId;

    if (projectData && requestTypeData) {
      this.props
        .setDefaultChannel(
          this.props.match.params.skill_id,
          data,
          this.state.preference
        )
        .then((res) => {
          this.setState({ jsd_edit: false });
          if (res.data.success) {
            message.success("Saved successfully");
          }
        });
    } else message.error("Internal error, please try again.");
  };

  onClickDelete = (type) => {
    const { deleteDefaultChannel, personalChannelDefault } = this.props;
    const { personalChannelId } = this.state;

    if (type === "ticket_defaults") {
      if (personalChannelDefault.link_info.project_id) {
        let data = { ...personalChannelDefault };
        delete data.link_info.jira_service_desk;
        delete data.link_info.create_tickets_by_default;
        this.props
          .setDefaultChannel(
            this.props.match.params.skill_id,
            data,
            this.state.preference
          )
          .then((res) => {
            if (res.data.success) {
              this.setState({
                selectedJsdProject: "",
                selectedJsdRequestType: "",
                create_tickets_by_default: false,
              });
              message.success("Issue defaults deleted successfully");
            }
          });
      } else this.deletePersonalDefaults();
    } else if (type === "issue_defaults") {
      if (personalChannelDefault.link_info.jira_service_desk) {
        let data = { ...personalChannelDefault };

        data.link_info = {
          jira_service_desk: personalChannelDefault.link_info.jira_service_desk,
          create_tickets_by_default:
            personalChannelDefault.create_tickets_by_default || false,
        };

        this.props
          .setDefaultChannel(
            this.props.match.params.skill_id,
            data,
            this.state.preference
          )
          .then((res) => {
            if (res.data.success) {
              this.setState({
                defaultProject: "",
                defaultIssue: "",
                board: "",
                linkedProjectName: "",
              });
              message.success("Ticket defaults deleted successfully");
            }
          });
      } else this.deletePersonalDefaults();
    }
  };

  deletePersonalDefaults = () => {
    const { deleteDefaultChannel } = this.props;
    const { personalChannelId } = this.state;

    this.setState({ defaultloading: true });
    deleteDefaultChannel(
      this.props.match.params.skill_id,
      personalChannelId,
      "personal"
    ).then((res) => {
      if (res.success) {
        message.success("Persoanl defaults deleted successfully");
        this.getCommonData();
        this.setState({
          defaultProject: null,
          defaultIssue: null,
          board: "",
          linkedProjectName: "",
          selectedJsdProject: "",
          selectedJsdRequestType: "",
          create_tickets_by_default: false,
        });
      } else {
        message.error("Error deleting personal defaults");
      }
      this.setState({ defaultloading: true });
    });
  };

  menus = () => {
    return (
      <Menu>
        {/* {this.props.currentSkill.metadata && (this.props.currentSkill.metadata.server_type != "jira_server"&&this.props.currentSkill.metadata.server_type != "jira_server_oauth") ?
          <Menu.Item onClick={this.goToUserJiraLogin}>
            Change Jira Account
        </Menu.Item>
          :this.props.currentSkill.metadata.server_type == "jira_server_oauth"? <Menu.Item onClick={()=>this.goToUserJiraLogin(this.props.currentSkill.metadata.server_type)}>
          Change Jira Account
      </Menu.Item>:
          <Menu.Item onClick={this.openConnectModal}>
            Change Jira Account
      </Menu.Item>
        } */}
        <Menu.Item onClick={this.unlinkJiraAccountToggle}>
          Unlink Jira Account
        </Menu.Item>
      </Menu>
    );
  };

  toggleSetFieldValue = () => {
    this.setState({ setFieldValueModal: !this.state.setFieldValueModal });
  };

  toggleSetFieldValueCancel = () => {
    this.setState({
      setFieldValueField: "",
      setFieldInputField: "",
      setFieldValueModal: !this.state.setFieldValueModal,
    });
  };

  toggleSetFieldValueOk = () => {
    this.setState({ setFieldValueModal: !this.state.setFieldValueModal });
  };

  setFieldFieldValue = (event) => {
    this.setState({ setFieldValueField: event });
  };

  setFieldInputValue = (event) => {
    this.setState({ setFieldInputField: event.target.value });
  };

  openConnectModal = () => {
    this.setState({ newConnectionModal: true });
  };

  handleCancel = () => {
    const { form } = this.formRef.props;
    this.setState({ newConnectionModal: false });
    form.resetFields();
  };

  threadSyncToggle = () => {
    let skill_id = this.props.match.params.skill_id;
    let channel_id = this.state.personalChannelId;
    let workspace_id = this.props.match.params.wId;
    let link = `/bot/api/${workspace_id}/isThreadSync/${skill_id}/${channel_id}`;
    let data = {
      isThreadSync: !this.state.isThreadSync,
    };
    axios
      .post(link, data)
      .then((data) => {
        data = data.data;
        if (data && data.commonChannelData) {
          this.setState({ isThreadSync: data.commonChannelData.isThreadSync });
        }
      })
      .catch((error) => {
        message.error("Some error occurred. Please try again.");
      });
  };

  handleCreate = () => {
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      let currentWorkspaceId = localStorage.getItem("userCurrentWorkspaceId");
      this.props
        .addUserBasicToken(
          currentWorkspaceId,
          this.props.match.params.skill_id,
          {
            username: values.username,
            password: values.password,
          }
        )
        .then((res) => {
          if (res.data.success) {
            this.setState({ newConnectionModal: false });
            form.resetFields();
          } else {
            message.error("Credentials incorrect, Try again");
          }
        });
    });
  };

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  };
  // Jira New Connection End

  getContent = ({ domainName, serverType, connectedAt }) => {
    const { currentSkillUser, skill } = this.props;
    return (skill && skill.skill_metadata
      ? skill.skill_metadata.linked
      : skill.linked) &&
      currentSkillUser &&
      currentSkillUser._id &&
      currentSkillUser.token_obj ? (
      currentSkillUser.token_obj.type === "Guest" ? (
        <Card
          size="small"
          title="My Account"
          extra={
            <Button onClick={this.goToUserJiraLogin}>Link Jira Account</Button>
          }
        >
          <p>
            You are connected as a guest User. The domain is '{domainName}' and
            you are connected as '{currentSkillUser.user_obj.emailAddress}'.
          </p>
        </Card>
      ) : (
        <div>
          <Affix offsetTop={0}>
            <Anchor
              style={{
                backgroundColor: "white",
                maxWidth: 984,
                marginLeft: 900,
                zIndex: 2,
                marginBottom: -140,
                // paddingTop: 50,
                position: "sticky",
                top: 50,
              }}
            >
              <Link href="#tpgp-wja" title="Workspace Jira Account" />
              {/* <Link href="#tpgp-um" title="User Mapping" /> */}
              <Link href="#tpgp-cf" title="Common Filters" />
              <Link href="#tpgp-ice" title="Task It" />
              <Link href="#emoji" title="Emoji Creation" />
              {/* <Link href="#tpgp-gtcd" title="Ticket Creation Defaults" /> */}
              <Link href="#abl" title="Atlassian Billing Link" />
            </Anchor>
          </Affix>

          <Card
            size="small"
            title="My Account"
            style={{ height: "100%" }}
            extra={
              <Dropdown overlay={this.menus()} trigger={["hover"]}>
                <Button type="link" icon={<SettingOutlined />} />
              </Dropdown>
            }
          >
            {this.props.currentSkillUser.skill_id &&
            serverType != "jira_server" &&
            serverType !== "jira_server_oauth" &&
            serverType !== "jira_cloud_oauth" ? (
              <div>
                <Text type="secondary">Connected to: </Text>
                {domainName}
                <br />
                <Text type="secondary">Connected at: </Text>
                {connectedAt}
                <br />
                <Text type="secondary">Connected as: </Text>
                {currentSkillUser.user_obj &&
                  currentSkillUser.user_obj.emailAddress}
                {/* Connected to Jira domain '{domainName}' as '
                  {currentSkillUser.user_obj && currentSkillUser.user_obj.emailAddress}' {connectedAt}. */}
              </div>
            ) : (
              <div>
                <Text type="secondary">Connected to: </Text>
                {this.props.currentSkillUser.skill_id &&
                  this.props.currentSkillUser.skill_id.metadata &&
                  this.props.currentSkillUser.skill_id.metadata.domain_url}
                <br />
                <Text type="secondary">Connected at: </Text>
                {connectedAt}
                <br />
                <Text type="secondary">Connected as: </Text>
                {currentSkillUser.user_obj &&
                currentSkillUser.user_obj.emailAddress
                  ? currentSkillUser.user_obj.emailAddress
                  : currentSkillUser.user_obj &&
                    currentSkillUser.user_obj.displayName
                  ? currentSkillUser.user_obj.displayName
                  : currentSkillUser.user_obj.name
                  ? currentSkillUser.user_obj.name
                  : ""}
                {/* Connected to Jira domain '{this.props.currentSkillUser.skill_id && this.props.currentSkillUser.skill_id.metadata && this.props.currentSkillUser.skill_id.metadata.domain_url}' as '
                {currentSkillUser.user_obj && currentSkillUser.user_obj.emailAddress ? currentSkillUser.user_obj.emailAddress : currentSkillUser.user_obj && currentSkillUser.user_obj.name ? currentSkillUser.user_obj.name : ''}' {connectedAt}. */}
              </div>
            )}
          </Card>
        </div>
      )
    ) : (
      <>
        <Affix offsetTop={0}>
          <Anchor
            style={{
              backgroundColor: "white",
              maxWidth: 984,
              marginLeft: 1000,
              marginBottom: -140,
              // paddingTop: 50,
              position: "sticky",
              top: 50,
              alignSelf: "flex-end",
            }}
          >
            <Link href="#tpgp-wja" title="Workspace Jira Account" />
            {/* <Link href="#tpgp-um" title="User Mapping" /> */}
            <Link href="#tpgp-cf" title="Common Filters" />
            <Link href="#tpgp-ice" title="Task It" />
            <Link href="#emoji" title="Emoji Creation" />
            {/* <Link href="#tpgp-gtcd" title="Ticket Creation Defaults" /> */}
            <Link href="#abl" title="Atlassian Billing Link" />
          </Anchor>
        </Affix>

        <Card
          size="small"
          title="My Account"
          extra={
            this.props.currentSkill.skill_metadata ? (
              <div>
                {this.props.currentSkill.skill_metadata.metadata.server_type ==
                "jira_server" ? (
                  <Button type="Primary" onClick={this.openConnectModal}>
                    Login to Verify
                  </Button>
                ) : (
                  <Button
                    type="Primary"
                    onClick={() => {
                      this.goToUserJiraLogin(
                        this.props.currentSkill.skill_metadata.metadata
                          .server_type
                      );
                    }}
                  >
                    Login to Verify
                  </Button>
                )}{" "}
              </div>
            ) : (
              <div>
                {this.props.currentSkill.metadata &&
                this.props.currentSkill.metadata.server_type ==
                  "jira_server" ? (
                  <Button type="Primary" onClick={this.openConnectModal}>
                    Login to Verify
                  </Button>
                ) : (
                  <Button
                    type="Primary"
                    onClick={() => {
                      this.goToUserJiraLogin(
                        this.props.currentSkill.metadata.server_type
                      );
                    }}
                  >
                    Login to Verify
                  </Button>
                )}
              </div>
            )
          }
        >
          <p>
            {currentSkillUser.user_obj && currentSkillUser.user_obj.displayName
              ? "Your account is mapped to " +
                currentSkillUser.user_obj.displayName +
                `${
                  currentSkillUser.user_obj.emailAddress
                    ? ` (${currentSkillUser.user_obj.emailAddress})`
                    : ""
                }. Click "login to verify" to Verify Account`
              : `User account verification is necessary to attribute Jira ${
                  this.props.match.params.sub_skill === "jira_service_desk"
                    ? "ticket"
                    : "issue"
                } actions taken in Slack to the correct Jira user.`}
          </p>
        </Card>
      </>
    );
  };

  getModals = ({ currentSkillUser }) => {
    const sub_skill = this.props.match.params.sub_skill;
    let dynamicText = "";
    if (sub_skill === "jira_software") {
      dynamicText = "Helpdesk and Reports";
    } else if (sub_skill === "jira_service_desk") {
      dynamicText = "Projects and Reports";
    } else if (sub_skill === "jira_reports") {
      dynamicText = "Projects and Helpdesk";
    }
    return (
      <>
        <Modal
          visible={this.state.unlinkJiraAccount}
          onCancel={this.unlinkJiraAccountToggle}
          onOk={() => this.logOutSkillUser()}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <p>Are you sure you want to unlink the jira account</p>
            <p>
              '
              {currentSkillUser &&
              currentSkillUser._id &&
              currentSkillUser.user_obj &&
              currentSkillUser.user_obj.emailAddress
                ? currentSkillUser.user_obj.emailAddress
                : currentSkillUser &&
                  currentSkillUser._id &&
                  currentSkillUser.user_obj
                ? currentSkillUser.user_obj.displayName
                : ""}
              ' ,
              <br />
              Disconnecting the Jira personal connection will disconnect
              personal connection for {dynamicText} too,
              <br />
              Are you sure?
            </p>
          </div>
        </Modal>

        <JiraServerModal
          currentSkillUser={currentSkillUser}
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.newConnectionModal}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          serverConnection={false}
        />
      </>
    );
  };

  create_tickets_by_default = (checked) => {
    let data = this.props.personalChannelDefault;
    if (data.link_info) {
      data.link_info.create_tickets_by_default = checked;
      this.props
        .setDefaultChannel(
          this.props.match.params.skill_id,
          data,
          this.state.preference
        )
        .then((res) => {
          if (res.data.success)
            this.setState({ create_tickets_by_default: checked });
        });
    }
  };

  deletePersoanlConfigurations = () => {
    let data = {
      channel_id: this.state.personalChannelId,
      skill_id: this.props.match.params.skill_id,
    };

    this.props
      .deleteChannelConfigurations(
        this.props.match.params.wId,
        data,
        "personal"
      )
      .then((res) => {
        if (res.success) {
          message.success(`Pesonal configurations deleted successfully`);
          this.getCommonData();
          this.clickChild();
          this.resetStatesToDefault();
        }
      });
  };

  resetStatesToDefault = () => {
    this.setState({ ...this.defaultState });
  };

  render() {
    const {
      projects,
      jsd_projects,
      issues,
      skill,
      currentSkillUser,
      isFromCheckins,
    } = this.props;
    const { defaultProject, selectedJsdProject } = this.state;
    const { sub_skill } = this.props.match.params;
    //  console.log("currentSkillUser====>",currentSkillUser)

    let domainName;
    let serverType;
    if (
      skill && skill.skill_metadata ? skill.skill_metadata.linked : skill.linked
    ) {
      domainName =
        skill && skill.skill_metadata
          ? skill.skill_metadata.metadata.domain_name
          : skill.metadata.domain_name;
      serverType =
        skill && skill.skill_metadata
          ? skill.skill_metadata.metadata.server_type
          : skill.metadata.server_type;
    }
    let { cardTemplates } = this.props;
    let connectedAt = "";
    if (
      currentSkillUser &&
      currentSkillUser.skill_id &&
      currentSkillUser.skill_id.linked
    ) {
      let time = currentSkillUser.updated_at;
      // connectedAt = 'on '+moment(time).format('MMM Do h:mm A Z');
      connectedAt = moment(time).format("MMM Do h:mm A Z");
    }

    let projectFound = false;
    if (defaultProject)
      projectFound = projects.find((project) => project.id == defaultProject);
    else projectFound = true;
    let jsd_projectFound = false;
    if (selectedJsdProject)
      jsd_projectFound = jsd_projects.find(
        (project) => project.projectId == selectedJsdProject
      );
    else jsd_projectFound = true;

    return isFromCheckins ? (
      <>
        {this.getContent({ domainName, serverType, connectedAt })}{" "}
        {this.getModals({ currentSkillUser })}{" "}
      </>
    ) : (
      <Layout style={{ marginLeft: 0 }}>
        <PageHeader
          title="Personal Preferences"
          extra={[
            <>
              {(sub_skill === "jira_software" ||
                sub_skill === "jira_service_desk") && (
                <Popconfirm
                  title={
                    <div>
                      The following personal preferences will be reset. <br />
                      1. Notification preferences
                      <br />
                      2. Issue Defaults
                      <br />
                      3. Ticket Defaults
                      <br />
                      4. Thread Sync behaviour
                      <br />
                      <br />
                      This change is irreversible. Are you sure?
                    </div>
                  }
                  onConfirm={() => this.deletePersoanlConfigurations()}
                  okText="Delete"
                  okType="danger"
                  placement="leftBottom"
                >
                  <Button>Reset Personal Preferences</Button>
                </Popconfirm>
              )}
            </>,
          ]}
        />
        <Content
          style={{ padding: "16px 16px 9px 24px" }}
          className="personal_preference"
        >
          <Row className={"content_row_jira"} gutter={[16, 16]}>
            <Col
              xs={{ span: 24 }}
              // sm={{ span: 24 }}
              // lg={{ span: 12 }}
              // xxl={{ span: 12 }}
              // style={{ maxWidth: "1000px" }}
            >
              {this.getContent({ domainName, serverType, connectedAt })}
            </Col>
            {/* this.state.personalConnected */}
            {(this.props.match.params.sub_skill === "jira_software" ||
              this.props.match.params.sub_skill === "jira_service_desk") &&
              (skill && skill.skill_metadata
                ? skill.skill_metadata.linked
                : skill.linked) &&
              currentSkillUser &&
              currentSkillUser._id && (
                <Col
                  xs={{ span: 24 }}
                  // sm={{ span: 24 }}
                  // lg={{ span: 12 }}
                  // xxl={{ span: 12 }}
                  style={{ maxWidth: "1000px" }}
                >
                  {/* {(currentSkillUser.token_obj && currentSkillUser.token_obj.type !== "Guest" ||) && */}
                  {/* https://stackoverflow.com/questions/37949981/call-child-method-from-parent */}
                  <JiraPersonalNotification
                    channelId={this.state.personalChannelId}
                    setClick={(click) => {
                      this.clickChild = click;
                    }}
                  />
                  {/* } */}
                </Col>
              )}

            {this.props.match.params.sub_skill === "jira_software" && (
              <Col
                xs={{ span: 24 }}
                // sm={{ span: 24 }}
                // lg={{ span: 12 }}
                // xxl={{ span: 12 }}
                style={{ maxWidth: "1000px" }}
              >
                {(skill && skill.skill_metadata
                  ? skill.skill_metadata.linked
                  : skill.linked) &&
                  currentSkillUser &&
                  currentSkillUser._id &&
                  currentSkillUser.token_obj &&
                  currentSkillUser.token_obj.type !== "Guest" && (
                    <Card
                      id="issue-default"
                      size="small"
                      title="Issue Defaults"
                      loading={this.state.jsd_loading}
                    >
                      {/* <p>
                  These values will be used in the Bot Channel (DM with
                  Troopr Assistant) when creating Jira issues.
                      </p> */}

                      <Paragraph
                        type="secondary"
                        style={{ whiteSpace: "break-spaces" }}
                      >
                        Following defaults will be used during issue creation
                        and listing in private conversation with "Troopr
                        Assistant" and in DM channels. For setting defaults for
                        other channels use "Channel Defaults".
                      </Paragraph>

                      {/*---------------------------------Default Projects----------------------------------------*/}
                      <div
                      // className={
                      //   (this.state.edit ? "" : "Preference_disable_state",
                      //     "bottom_space_forms")
                      // }
                      >
                        <Text type="secondary" strong>
                          Default Project
                        </Text>
                        <br />
                        <Select
                          style={{ marginBottom: "8px", width: 200 }}
                          name="defaultProject"
                          value={this.state.defaultProject}
                          onChange={this.onChangeProject}
                          showSearch={true}
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          disabled={!this.state.edit}
                          // disabled={true}
                        >
                          {projects &&
                            projects.map((project, index) =>
                              project.projectTypeKey === "software" ? (
                                <Option key={project.id} value={project.id}>
                                  {project.name + ` (${project.key})`}
                                </Option>
                              ) : (
                                ""
                              )
                            )}
                        </Select>

                        {this.state.error.defaultProject && (
                          <div className="error_message">
                            {this.state.error.defaultProject}
                          </div>
                        )}
                      </div>

                      {/*---------------------------------Default Issue Type----------------------------------*/}

                      <div
                      // className={
                      //   (this.state.edit ? "" : "Preference_disable_state",
                      //     "bottom_space_forms")
                      // }
                      >
                        <Text type="secondary" strong>
                          Default Issue type
                        </Text>
                        <br />
                        <Select
                          style={{ marginBottom: "8px", width: 200 }}
                          name="defaultIssue"
                          value={this.state.defaultIssue}
                          onChange={this.onChangeIssue}
                          showSearch={true}
                          // disabled={true}
                          // disabled={!this.state.edit || !this.state.defaultProject}
                          disabled={
                            this.state.edit && projectFound ? false : true
                          }
                        >
                          {issues &&
                            issues.map((issue, index) => (
                              <Option key={issue.value} value={issue.value}>
                                {issue.text}
                              </Option>
                            ))}
                        </Select>
                      </div>
                      {this.state.error.defaultIssue && (
                        <div className="error_message">
                          {this.state.error.defaultIssue}
                        </div>
                      )}

                      {/*---------------------------------Board----------------------------------------*/}
                      {
                        /*this.state.boardData.length > 0 &&*/ <>
                          <Text
                            type="secondary"
                            strong
                            className="Jira_preference_personal_default_type"
                          >
                            Board (optional)
                          </Text>
                          <br />
                          <Select
                            name="boards"
                            style={{ width: 200, marginBottom: "18px" }}
                            showSearch={true}
                            value={this.state.board}
                            filterOption={(input, option) =>
                              option.props.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            defaultValue={this.state.board}
                            // disabled={!this.state.edit}
                            disabled={
                              this.state.edit && projectFound ? false : true
                            }
                            onChange={this.onChangeBoard}
                            allowClear
                            // disabled={true}
                          >
                            {this.state.boardData.map((board) => {
                              return (
                                <Option
                                  value={board.id.toString()}
                                  key={board.id.toString()}
                                  label={board.name}
                                >
                                  {board.name + ` (${board.type})`}
                                </Option>
                              );
                            })}
                            {/* <Option value={this.state.board} >{this.state.board}</Option> */}

                            {/* {cardTemplates && cardTemplates.map((board, index) => (
                      <Option disabled="disabled" key={board._id}>{board.desc}</Option>
                    ))} */}
                          </Select>
                          <br />
                        </>
                      }

                      {/* <div className="d-flex flex-column">
                                  <div className="Jira_preference_personal_default_type">Set value as field</div>
                               <div>Jira Issue field</div>
                                <div>
                                   <Select 
                                      disabled={!this.state.edit}
                                      placeholder="Choose an field value"
                                      onChange={this.setFieldFieldValue}   
                                      style={{width : "100%"}} 
                                   >
                                   {setFieldValueValues.map(value => (
                                   <Option key={value.value} value={value.value}>
                                       {value.label}
                                   </Option>
                                 ))}
                                   </Select>
                                </div>
                                     <div>Issue Value</div>
                                      <div>
                                          <Input 
                                             disabled={!this.state.edit}
                                             style={{width:"100%"}}
                                             onChange={this.setFieldInputValue}/>
                                      </div>  
                              </div>*/}
                      {/*----------------------------------------Buttons----------------------------------------*/}
                      {this.props.personalChannelDefault.link_info &&
                        this.props.personalChannelDefault.link_info
                          .project_id &&
                        !this.state.edit && (
                          <Button
                            type="danger"
                            style={{ float: "right", width: "114px" }}
                            loading={this.state.defaultloading}
                            onClick={() => this.onClickDelete("issue_defaults")}
                          >
                            Delete
                          </Button>
                        )}
                      {this.state.edit ? (
                        <div>
                          <Button
                            /*className=" btn_114 margin__right__button"*/ style={{
                              width: "114px",
                            }}
                            onClick={() => this.onCancel(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="primary"
                            // className="btn_114 margin__right__button"
                            // loading={this.state.defaultloading}
                            onClick={this.onClickSave}
                            style={{ width: "114px", marginLeft: "10px" }}
                          >
                            Save
                          </Button>
                        </div>
                      ) : (
                        <Button
                          /*className=" 114 margin__right__button_edit"*/ style={{
                            width: "114px",
                          }}
                          onClick={() => this.openEditState(false)}
                        >
                          Edit
                        </Button>
                      )}
                    </Card>
                  )}
              </Col>
            )}
            {this.props.match.params.sub_skill === "jira_service_desk" && (
              <Col
                xs={{ span: 24 }}
                // sm={{ span: 24 }}
                // lg={{ span: 12 }}
                // xxl={{ span: 12 }}
                style={{ maxWidth: "1000px" }}
              >
                {(skill && skill.skill_metadata
                  ? skill.skill_metadata.linked
                  : skill.linked) &&
                  currentSkillUser &&
                  currentSkillUser._id &&
                  currentSkillUser.token_obj &&
                  currentSkillUser.token_obj.type !== "Guest" && (
                    <Card
                      size="small"
                      title="Ticket Defaults"
                      loading={this.state.loading}
                    >
                      {/* <p>
                  These values will be used in the Bot Channel (DM with
                  Troopr Assistant) when creating Jira issues.
                      </p> */}
                      {/* <Checkbox disabled={!this.state.jsd_edit} checked={this.state.create_tickets_by_default} onChange={this.handle_use_jsd_defaults_checkbox} strong style={{marginBottom:8}}><Text type='secondary'>Use ticket defualts</Text></Checkbox> */}
                      <Paragraph type="secondary">
                        Following defaults will be used during ticket creation
                        and listing in private conversation with "Troopr
                        Assistant" and in DM channels. For setting defaults for
                        other channels use "Channel Defaults".
                      </Paragraph>

                      {/*---------------------------------Default Projects----------------------------------------*/}
                      <div>
                        <Text type="secondary" strong>
                          Default Project
                        </Text>
                        <br />
                        <Select
                          style={{ marginBottom: "8px", width: 200 }}
                          name="defaultProject"
                          value={this.state.selectedJsdProject}
                          onChange={this.onChangeJsdProject}
                          showSearch={true}
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          disabled={!this.state.jsd_edit}
                          // disabled={true}
                        >
                          {this.props.jsd_projects.map((project, index) => (
                            <Option key={project.id} value={project.projectId}>
                              {project.projectName + ` (${project.projectKey})`}
                            </Option>
                          ))}
                        </Select>
                      </div>

                      {/*---------------------------------Default Request Type----------------------------------*/}

                      <div>
                        <Text type="secondary" strong>
                          Default Request Type
                        </Text>
                        <br />
                        <Select
                          style={{ marginBottom: "8px", width: 200 }}
                          name="defaultIssue"
                          value={this.state.selectedJsdRequestType}
                          onChange={this.setRequesType}
                          showSearch={true}
                          // disabled={true}
                          // disabled={!this.state.edit || !this.state.defaultProject}
                          disabled={
                            this.state.jsd_edit && jsd_projectFound
                              ? false
                              : true
                          }
                        >
                          {this.props.requestTypes.map((issue, index) => (
                            <Option key={issue.value} value={issue.value}>
                              {issue.text}
                            </Option>
                          ))}
                        </Select>
                      </div>

                      {/*---------------------------------Board----------------------------------------*/}
                      {/* <div className="d-flex flex-column">
                                  <div className="Jira_preference_personal_default_type">Set value as field</div>
                               <div>Jira Issue field</div>
                                <div>
                                   <Select 
                                      disabled={!this.state.edit}
                                      placeholder="Choose an field value"
                                      onChange={this.setFieldFieldValue}   
                                      style={{width : "100%"}} 
                                   >
                                   {setFieldValueValues.map(value => (
                                   <Option key={value.value} value={value.value}>
                                       {value.label}
                                   </Option>
                                 ))}
                                   </Select>
                                </div>
                                     <div>Issue Value</div>
                                      <div>
                                          <Input 
                                             disabled={!this.state.edit}
                                             style={{width:"100%"}}
                                             onChange={this.setFieldInputValue}/>
                                      </div>  
                              </div>*/}
                      {/*----------------------------------------Buttons----------------------------------------*/}
                      {this.props.personalChannelDefault.link_info &&
                        this.props.personalChannelDefault.link_info
                          .jira_service_desk &&
                        !this.state.jsd_edit && (
                          <Button
                            type="danger"
                            style={{ float: "right", width: "114px" }}
                            onClick={() =>
                              this.onClickDelete("ticket_defaults")
                            }
                          >
                            Delete
                          </Button>
                        )}
                      {this.state.jsd_edit ? (
                        <div>
                          <Button
                            /*className=" btn_114 margin__right__button"*/ style={{
                              width: "114px",
                            }}
                            onClick={() => this.onCancel(true)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="primary"
                            // className="btn_114 margin__right__button"
                            // loading={this.state.defaultloading}
                            onClick={this.onJsdDefaultSave}
                            style={{ width: "114px", marginLeft: "10px" }}
                          >
                            Save
                          </Button>
                        </div>
                      ) : (
                        <Button
                          /*className=" 114 margin__right__button_edit"*/ style={{
                            width: "114px",
                          }}
                          onClick={() => this.openEditState(true)}
                        >
                          Edit
                        </Button>
                      )}
                    </Card>
                  )}
              </Col>
            )}

            {(skill && skill.skill_metadata
              ? skill.skill_metadata.linked
              : skill.linked) &&
              currentSkillUser &&
              currentSkillUser._id &&
              this.state.personalConnected && (
                <Col
                  xs={{ span: 24 }}
                  // sm={{ span: 24 }}
                  // lg={{ span: 12 }}
                  // xxl={{ span: 12 }}
                  style={{ maxWidth: "1000px" }}
                >
                  {/* {this.props.match.params.sub_skill === 'jira_service_desk' && */}
                  {(this.props.match.params.sub_skill === "jira_software" ||
                    this.props.match.params.sub_skill ===
                      "jira_service_desk") && <MultiTaskIt skill={skill} />}
                  {/* } */}
                  {/* <Collapse
                    style={{
                      borderTop:
                        this.props.match.params.sub_skill === "jira_software"
                          ? ""
                          : "transparent",
                    }}
                  > */}
                  {(this.props.match.params.sub_skill === "jira_service_desk" ||
                    this.props.match.params.sub_skill === "jira_software") && (
                    <Card
                      id="thread-sync"
                      title="Thread Sync"
                      key="2"
                      xs={{ span: 24 }}
                      style={{ marginTop: 15 }}
                      extra={
                        <div
                          // style={{ marginLeft: 500 }}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <Switch
                            checked={this.state.isThreadSync}
                            onChange={() => this.threadSyncToggle()}
                          />
                        </div>
                      }
                    >
                      <Paragraph type="secondary">
                        {/* Allow issue cards to start a Slack thread to continuously sync with the corresponding Jira issue.
Every Jira issue can have a maximum of 5 active issue cards. Newer active cards will automatically disable thread sync in the oldest one. */}
                        <p>
                          Jira{" "}
                          {sub_skill === "jira_service_desk"
                            ? "ticket"
                            : "issue"}{" "}
                          cards posted to this channel will start a thread to
                          continuously sync 2-way with the corresponding Jira{" "}
                          {sub_skill === "jira_service_desk"
                            ? "ticket"
                            : "issue"}
                          . Messages in this thread will be added as comments in
                          Jira and vice versa. Every Jira{" "}
                          {sub_skill === "jira_service_desk"
                            ? "ticket"
                            : "issue"}{" "}
                          <br></br>can have a maximum of 5 thread sync. Newer
                          thread sync for the{" "}
                          {sub_skill === "jira_service_desk"
                            ? "ticket"
                            : "issue"}{" "}
                          will automatically disable the oldest one.
                        </p>
                      </Paragraph>
                    </Card>
                  )}
                  {this.props.match.params.sub_skill ===
                    "jira_service_desk" && (
                    <Card
                      title="Create tickets by default"
                      jey="3"
                      extra={
                        <div onClick={(e) => e.stopPropagation()}>
                          <Switch
                            checked={this.state.create_tickets_by_default}
                            onChange={(checked) =>
                              this.create_tickets_by_default(checked)
                            }
                            disabled={
                              this.props.personalChannelDefault._id &&
                              this.props.personalChannelDefault.link_info
                                .jira_service_desk
                                ? false
                                : true
                            }
                          />
                        </div>
                      }
                    >
                      <Paragraph type="secondary">
                        Allow "Task It" message action and Troopr commands to
                        use tickets rather than issues in this channel.
                      </Paragraph>
                      {this.props.personalChannelDefault._id &&
                      this.props.personalChannelDefault.link_info
                        .jira_service_desk ? (
                        ""
                      ) : (
                        <Paragraph type="warning">
                          Set the ticket defaults to use this.
                        </Paragraph>
                      )}
                    </Card>
                  )}
                  {/* </Collapse> */}
                  {sub_skill === "jira_software" ? (
                    <>
                      {this.state.personalChannelId &&
                      this.props.commonChanneldata &&
                      this.state.defaultProject &&
                      this.props.commonChanneldata.find(
                        (cha) => cha.channel_id === this.state.personalChannelId
                      ) ? (
                        <IssueCardCustomization
                          projectId={this.state.defaultProject}
                          linkedIssue={this.state.defaultIssue}
                          channel_id={this.state.personalChannelId}
                          isPersonalPref={true}
                        />
                      ) : (
                        <Card
                          id="issue-card"
                          title="Issue Card Display Customization"
                          key="4"
                          size="small"
                          style={{ marginTop: 15 }}
                        >
                          <Alert
                            description={
                              "Configure Issue Defaults to customize Issue card"
                            }
                            type="warning"
                            style={{ textAlign: "center" }}
                          />
                        </Card>
                      )}
                    </>
                  ) : (
                    ""
                  )}
                </Col>
              )}

            {this.getModals({ currentSkillUser })}
          </Row>
        </Content>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    // user: state.common_reducer.user,
    projects: state.skills.projects,
    jsd_projects: state.skills.jsd_projects,
    issues: state.skills.issues,
    requestTypes: state.skills.requestTypes,
    personalChannelDefault: state.skills.personalChannelDefault,
    currentSkillUser: state.skills.currentSkillUser,
    assistant_skills: state.skills,
    channelDefault: state.skills,
    currentSkill: state.skills.currentSkill,
    cardTemplates: state.cards.templateCards,
    isWorkspaceAdmin: state.common_reducer.isAdmin,
    team: state.skills.team,
    commonChanneldata: state.skills.commonChanneldata,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    setDefaultChannel,
    getDefaultChannel,
    getIssues,
    getProject,
    personalSetting,
    logOutSkillUser,
    addUserBasicToken,
    addBasicAuth,
    getMappedUser,
    getJiraUserNotifConfig,
    setUserJiraNotifConfig,
    deleteUserConfig,
    getSkillUser,
    getJiraBoards,
    deleteDefaultChannel,
    getServiceDeskProject,
    deleteChannelConfigurations,
    getCommonData,
  })(JiraPersonalPreference)
);
