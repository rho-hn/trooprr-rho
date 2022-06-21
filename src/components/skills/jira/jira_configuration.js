import React, { Component } from "react";
import axios from "axios";
import {
  setDefaultChannel,
  getDefaultChannel,
  getIssues,
  getProject,
  personalSetting,
  getAssisantSkills,
  getSkillConnectUrl,
  updateSkill,
  submitTokenData,
  getUserToken,
  getUser,
  setJiraConnectId,
  addBasicAuth,
  setSkill,
  setCurrentSkill,
  updateAssisantSkills,
} from "../skills_action";

import { SettingOutlined } from "@ant-design/icons";
import { Form } from "@ant-design/compatible";
import { setWorkspace } from "../../common/common_action";
import JiraBilling from "../../billing/jiraBilling";
import {
  getJiraGuestManager,
  getJiraGuestUsers,
} from "./jira_guest_config/jiraGuestAction";

import "@ant-design/compatible/assets/index.css";
import {
  Tag,
  Button,
  Modal,
  Card,
  message,
  Input,
  Row,
  Col,
  Alert,
  Dropdown,
  Menu,
  Layout,
  Popconfirm,
  Collapse,
  Switch,
  Typography,
  List,
  Anchor,
  Space,
  Affix,
} from "antd";
import moment from "moment";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Validator from "validator";
import isEmpty from "lodash/isEmpty";
import JiraServerModal from "./jira_server_modal";
import JiraToken from "../jira/jiraConnectionFlow/jiraToken";

import jwt from "jsonwebtoken";
import CustomEmojiForCreation from "./CustomEmojisForIssueCreation";
import { isValidUser } from "../../../utils/utils";
const { Panel } = Collapse;
// import bcrypt from 'bcryptjs';
const Jira_skill_id = localStorage.getItem("Jira_skill_id");
const { SubMenu } = Menu;
const { Link } = Anchor;
const { Content } = Layout;
const { Text, Paragraph } = Typography;

class JiraConfiguration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingUser: false,
      loadingToken: false,
      channels: [],
      projects: [],
      issues: [],
      defaultProject: "",
      defaultIssue: "",
      skillsToggle: false,
      notificationToggle: false,
      personalNotifToggle: false,
      preference: "channel",
      selectedChannel: "",
      selectedChannelName: "",
      selectedProject: "",
      currentSkill: this.props.match.params.skill_id,
      linkedProject: null,
      linkedIssue: null,
      personalProject: "",
      personalIssue: "",
      personalChannelId: "",
      edit: false,
      error: {},
      showChannelSetting: false,
      disconnectModel: false,
      searchChannel: "",
      value: "",
      suggestions: [],
      getToken: false,
      userName: "",
      userToken: "",
      adminUserName: "",
      adminMailId: "",
      adminUserId: "",
      newConnectionModal: false,
      loading: false,
      isUnfurlLink: false,
      isAdmin: false,
      isThreadSyncUnfurl: false, // Only for unfurl
      isThreadSyncTaskIt: false, // Only for task it
      loadingPricing: false,
      payment: {},
      urlModal: false,
      doamin_url: "",
      connections: [],
      gridLoading: false,
      isUnfurl: false,
      unfurlResponseInThread: false,
      taskItResponseInThread: false,
      isSoftwareEnabled: true,
      isServiceDeskEnabled: true,
      showStatusUpdateInThread: true,
      jqlFilter: [],
      isJqlFilterModalVisible: false,
      jqlFilterName: "",
      jqlFilterExp: "",
      jqlFilterModalStatus: "",
      jqlFilterId: "",
      isJqlFilterActionButtonDisabled: false,
    };
    this.onChangeChannel = this.onChangeChannel.bind(this);
    this.goToJiraNotifSetup = this.goToJiraNotifSetup.bind(this);
    this.updateSkill = this.updateSkill.bind(this);
    this.showChannelSetting = this.showChannelSetting.bind(this);
    this.textInput = React.createRef();
  }

  showChannelSetting() {
    this.props.setOption(
      "jira_channel_pref",
      this.state.selectedChannel,
      this.state.selectedChannelName
    );
  }

  disconnectOnClickModel = async () => {
    const { skill } = this.props;

    let currentUserId = localStorage.getItem("trooprUserId");
    let workspaceId = this.props.workspace_id;

    // console.log('workspace_id -> ', workspaceId);

    /*try{
      let res = await axios.get(`/api/${workspaceId}/isAdmin`);
      if(res){
        if(res.data.success && res.data.isAdmin){
          // console.log("setting this.state.isAdmin to true");
          this.setState({
            isAdmin : true
          })
        }
      }
      // else{
      //   console.log("no response from api");
      // }
    }catch(err){
      console.error("api call to /api/:userId/isAdmin failed with error: ",err);
    }*/

    const { members, user } = this.props;
    let isAdmin = false;
    if (members) {
      let user_now = members.find(
        (member) => member.user_id && member.user_id._id == user._id && user
      );
      if (user_now) {
        if (user_now.role) {
          isAdmin = user_now.role == "admin" ? true : false;
        }
      }
    }

    let jiraConnectedId =
      skill && skill.skill_metadata
        ? skill.skill_metadata.jiraConnectedId
        : skill.jiraConnectedId;

    // console.log("this.state.isAdmin -> ",this.state.isAdmin);

    //  let jiraConnectedId = this.props.skill.jiraConnectedId
    //if ((currentUserId === jiraConnectedId) || this.state.isAdmin) {
    if (currentUserId === jiraConnectedId || isAdmin) {
      // message.okText("Disconnection authorized");
      // console.log("disconnection authorized!");
      this.setState({ disconnectModel: !this.state.disconnectModel });
    } else {
      // console.log("failed to disconnect as you are not the conection owner");
      message.error("Please contact your Jira Admin to disconnect");
    }
  };

  unfurlOptionsHandler = async (name) => {
    if (!name) return;

    let data = {};
    let value = !this.state[name];
    data = {
      name: name,
      value,
    };

    let response = await axios.post(
      `/bot/workspace/unfurlToggles/${this.props.match.params.wId}`,
      data
    );
    if (response) {
      if (response.data && response.data.success) {
        this.setState({
          ...response.data.data,
        });
        let options = response.data.data;
        let skill = this.props.skill;
        skill = { ...skill, ...options };
        this.props.setSkill(skill);
        this.props.setCurrentSkill(skill);
      }
    }
  };

  // enableDisableProduct = async(product)=>{
  //   let data = {};
  //   let value = !this.state[product];
  //   product === "isServiceDeskEnabled"?
  //   data = {
  //     "isServiceDeskEnabled" : value
  //   }:
  //   data = {
  //     "isSoftwareEnabled" : value
  //   }
  //   this.props.updateSkill(this.props.skill._id, this.props.skill.workspace_id, data).then(res => {
  //     if(res.data.success){
  //       this.setState(data);
  //       this.props.setSkill(res.data.skill);
  //       this.props.setCurrentSkill(res.data.skill);
  //     }
  //   });
  // }
  switchButtonStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    fontWeight: "bold",
  };

  getExistingGridConnections() {
    axios
      .get("/bot/api/" + this.props.match.params.wId + "/grid_jira_connections")
      .then((data) => {
        this.setState({ gridLoading: false });
        if (data.data.success) {
          this.setState({ connections: data.data.skills });
        }
      });
  }

  fetchJqlFilter = async () => {
    const token = await localStorage.getItem("token");

    const headers = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const jqlFilter = await axios.get(
        `/bot/api/${this.props.match.params.wId}/jqlfilter`,
        headers
      );
      if (!!jqlFilter.data.success) {
        this.setState({
          jqlFilter: jqlFilter.data.data[0].filters,
        });
      }
    } catch (error) {}
  };

  addJqlFilter = () => {
    if (
      this.state.jqlFilterName.trim() != "" &&
      this.state.jqlFilterExp.trim() != ""
    ) {
      let isUsed =
        this.state.jqlFilter &&
        this.state.jqlFilter.find(
          (el) => el.filterName === this.state.jqlFilterName
        );
      if (isUsed) {
        if (
          this.state.jqlFilterModalStatus === "UPDATE" &&
          this.state.jqlFilterId === (isUsed && isUsed._id)
        ) {
        } else {
          return message.error(
            "Jql Filter name is already used, Please use different name."
          );
        }
      }

      if (this.state.jqlFilterModalStatus === "ADD") {
        this.jqlFilterOps({
          filterName: this.state.jqlFilterName,
          jqlFilter: this.state.jqlFilterExp,
          filterId: null,
        });
      }
      if (this.state.jqlFilterModalStatus === "UPDATE") {
        if (this.state.jqlFilterId.trim() != "") {
          this.jqlFilterOps({
            filterId: this.state.jqlFilterId,
            filterName: this.state.jqlFilterName,
            jqlFilter: this.state.jqlFilterExp,
          });
        } else {
          message.error("jql filter id missing");
        }
      }
    } else {
      message.warn("Please fill all details");
    }
  };

  createJqlFilter = async ({ filterName, jqlFilter }) => {
    const token = await localStorage.getItem("token");

    const headers = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const body = {
      workspaceId: this.props.match.params.wId,
      filters: [
        {
          filterName,
          jqlFilter,
        },
      ],
    };

    try {
      const jqlFilter = await axios.post(`/bot/api/jqlfilter`, body, headers);
      if (!!jqlFilter.data.success) {
        message.success(jqlFilter.data.message);
        this.toggleJqlFilterModal();
        this.fetchJqlFilter();
      } else {
        message.error(jqlFilter.data.message);
      }
    } catch (error) {}
  };

  editJqlFilter = async ({ filterName, jqlFilter, filterId }) => {
    const token = await localStorage.getItem("token");

    const headers = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const body = {
      workspaceId: this.props.match.params.wId,
      filterName,
      jqlFilter,
      filterId,
    };

    try {
      const jqlFilter = await axios.put(`/bot/api/jqlfilter`, body, headers);
      if (!!jqlFilter.data.success) {
        message.success(jqlFilter.data.message);
        this.toggleJqlFilterModal();
        this.fetchJqlFilter();
      } else {
        message.error(jqlFilter.data.message);
      }
    } catch (error) {}
  };

  addJqlFilterOnExist = async ({ filterName, jqlFilter }) => {
    const token = await localStorage.getItem("token");

    const headers = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const body = {
      workspaceId: this.props.match.params.wId,
      filterName,
      jqlFilter,
    };

    try {
      const jqlFilter = await axios.post(
        `/bot/api/jqlfilter/add`,
        body,
        headers
      );
      if (!!jqlFilter.data.success) {
        message.success(jqlFilter.data.message);
        this.toggleJqlFilterModal();
        this.fetchJqlFilter();
      } else {
        message.error(jqlFilter.data.message);
      }
    } catch (error) {}
  };

  jqlFilterOps = async ({ filterName, jqlFilter, filterId }) => {
    this.setState({
      isJqlFilterActionButtonDisabled: true,
    });

    const token = await localStorage.getItem("token");

    const headers = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const body = {
      workspaceId: this.props.match.params.wId,
      filterName,
      jqlFilter,
      filterId,
    };

    try {
      const jqlFilter = await axios.post(`/bot/api/jqlfilter`, body, headers);
      this.setState({
        isJqlFilterActionButtonDisabled: false,
      });
      if (!!jqlFilter.data.success) {
        message.success(jqlFilter.data.message);
        this.toggleJqlFilterModal();
        this.fetchJqlFilter();
      } else {
        message.error(jqlFilter.data.message);
      }
    } catch (error) {
      this.setState({
        isJqlFilterActionButtonDisabled: false,
      });
      message.error("Something went wrong! Please try again later");
    }
  };

  removeJqlFilter = async () => {
    const token = await localStorage.getItem("token");

    const headers = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const filterId = this.state.jqlFilterId;

    try {
      const jqlFilter = await axios.delete(
        `/bot/api/${this.props.match.params.wId}/jqlfilter/${filterId}`,
        headers
      );
      if (!!jqlFilter.data.success) {
        message.success(jqlFilter.data.message);
        this.toggleJqlFilterModal();
        this.fetchJqlFilter();
      } else {
        message.error(jqlFilter.data.message);
      }
    } catch (error) {
      message.error("Something went wrong! Please try again later");
    }
  };

  openJqlFilterModal = (filter = null) => {
    if (filter != null) {
      this.setState(
        {
          jqlFilterName: filter.filterName,
          jqlFilterExp: filter.jqlFilter,
          jqlFilterId: filter._id,
          jqlFilterModalStatus: "UPDATE",
        },
        () => {
          this.toggleJqlFilterModal();
        }
      );
    } else {
      this.setState(
        {
          jqlFilterModalStatus: "ADD",
        },
        () => {
          this.toggleJqlFilterModal();
        }
      );
    }
  };

  toggleJqlFilterModal = () => {
    this.setState(
      {
        isJqlFilterModalVisible: !this.state.isJqlFilterModalVisible,
      },
      () => {
        if (!this.state.isJqlFilterModalVisible) {
          this.setState({
            jqlFilterName: "",
            jqlFilterExp: "",
            jqlFilterId: "",
          });
        }
      }
    );
  };

  async componentDidMount() {
    this.fetchJqlFilter();

    /*axios.get(`/api/${this.props.match.params.wId}/isAdmin`).then(res => {
     if(res.data.success && res.data.isAdmin){
       this.setState({isAdmin : true});
     }
   })*/

    // this.props.getProject(this.props.workspace_id);
    let {
      isUnfurl,
      isUnfurlLink,
      unfurlResponseInThread,
      taskItResponseInThread,
      isThreadSyncUnfurl,
      isThreadSyncTaskIt,
      isSoftwareEnabled,
      isServiceDeskEnabled,
      showStatusUpdateInThread,
    } = this.props.skill;
    this.setState({
      isUnfurl,
      isUnfurlLink,
      unfurlResponseInThread,
      taskItResponseInThread,
      isThreadSyncUnfurl,
      isThreadSyncTaskIt,
      isSoftwareEnabled,
      isServiceDeskEnabled,
      showStatusUpdateInThread,
    });
    let { skill } = this.props;
    let isLinked = skill.skill_metadata
      ? skill.skill_metadata.linked
      : skill.linked;
    if (isLinked) {
      let domainname = skill.skill_metadata
        ? skill.skill_metadata.metadata.domain_name
        : skill.metadata.domain_name;
      let jiraUrl = skill.skill_metadata
        ? skill.skill_metadata.metadata.domain_url
        : skill.metadata.domain_url
        ? skill.metadata.domain_url
        : `https://${domainname}.atlassian.net`;

      this.setState({ domain_url: jiraUrl });
    } else {
      this.getExistingGridConnections();
    }

    this.setState({ loadingPricing: true });

    // app.get('/api/:wId/grid_jira_connections', function (req, res) {
    //   SkillMetadata.getGridJiraConnections(req, res)
    // });

    axios
      .get("/auth/troopr_billing/payementInfo/" + this.props.match.params.wId)
      .then((data) => {
        let billing = data.data;
        // let pricings = data[1].data.pricings
        // let jSkills=data[2].data
        // let skill = jSkills.skill
        // const allCheckInsData = data[3].data;
        // let activeCheckins = 0;
        // if(allCheckInsData.teamSyncs){
        //   allCheckInsData.teamSyncs.forEach(checkin => {
        //     checkin.createInstance && activeCheckins++
        //   })
        // }
        // console.log(data,users,billing)
        this.setState({ payment: billing.paymentInfo, loadingPricing: false });
      });

    // let activeUsers = axios.get("/auth/troopr_billing/getActiveUsers/" + this.props.match.params.wId)

    // const checkInsPromise = axios.get('/api/getUsersSelectedTeamSync/' + this.props.match.params.wId +"?showAll=true")

    // Promise.all([billingPromise, pricing]).then(data => {
    //isUnfurlLink=>GET

    // let isUnfurlLink=await axios.get(`/bot/workspace/isUnfurlLink/${this.props.match.params.wId}`)
    // // console.log(isUnfurlLink)
    // if(isUnfurlLink){
    //   this.setState({isUnfurlLink:isUnfurlLink.data.data})
    // }

    // let isThreadSyncStatus=await axios.get(`/bot/workspace/isThreadSyncStatus/${this.props.match.params.wId}`)
    // // console.log(isUnfurlLink)
    // if(isThreadSyncStatus){
    //   this.setState({isThreadSync:isThreadSyncStatus.data.data})
    // }
    //
    if (this.props.isFromCheckins) {
    } else {
      this.setState({ loadingUser: true });
      this.props
        .getUser(
          this.props.skill.skill_metadata
            ? this.props.skill.skill_metadata.jiraConnectedId
            : this.props.skill.jiraConnectedId
        )
        .then((res) => {
          // console.log("pulled admin user info:" + JSON.stringify(res))
          // console.log("connectorUser: ", res.data);
          this.setState({ loadingUser: false });
          // console.log("componentDidMount:props.getUser(" + this.props.skill.jiraConnectedId + ")" + JSON.stringify(res.data))
          if (res.data.user) {
            this.setState({
              adminUserName: res.data.user.displayName || res.data.user.name,
              adminMailId: res.data.user.email,
              adminUserId: res.data.user.user_id,
            });
          }
        });
    }
    if (this.props.isFromCheckins) {
    } else {
      this.setState({ loadingToken: true });
      let name = "Jira";
      this.props
        .getUserToken(this.props.match.params.wId, name)
        .then((userData) => {
          // console.log("====>userData",userData)
          this.setState({ loadingToken: false });
          if (userData.data && userData.data.userToken) {
            this.setState({
              userName: userData.data.userName,
              userToken: userData.data.userToken,
            });
          } else {
            this.setState({
              userName: "",
              userToken: "",
            });
          }
        });
    }
  }

  onChangeChannel = (event, value) => {
    //value gets all the props
    //event gets the value props
    this.setState({
      selectedChannel: event,
      selectedChannelName: value.props.children,
    });
  };

  goToJiraNotifSetup() {
    this.props.history.push(
      "/" +
        this.props.workspace_id +
        "/jira_notification_setup/" +
        this.props.match.params.skill_id +
        "?step=intial_setup"
    );
  }

  updateSkill(data) {
    const { skill, workspace, skills } = this.props;
    // let skillId = skill && skill.skill_metadata ? skill.skill_metadata._id : skill._id;
    // let wId = skill && skill.skill_metadata ? skill.skill_metadata.workspace_id : skill.workspace_id;
    let skillId =
      skill && skill.skill_metadata ? skill.skill_metadata._id : skill._id;
    let wId =
      skill && skill.skill_metadata
        ? skill.skill_metadata.workspace_id
        : skill.workspace_id;

    this.props.updateSkill(skillId, wId, data).then((res) => {
      this.setState({ disconnectModel: !this.state.disconnectModel });
      const jiraSkill = skills.find((skill) => skill.name === "Jira");
      if (jiraSkill.skill_metadata.disabled) {
        if (res.data.success)
          this.props.updateChecinIntegrationsData(res.data.skill);
        this.props.history.push(
          "/" +
            this.props.workspace_id +
            "/teamsyncs/" +
            "integrations/" +
            this.props.currentSkill._id
        );
      } else
        this.props.history.push(
          "/" +
            this.props.workspace_id +
            "/skills/" +
            this.props.currentSkill._id +
            `/${this.props.match.params.sub_skill}`
        );
    });
  }

  updateSkillToggle = (data) => {
    this.props
      .updateSkill(this.props.skill._id, this.props.skill.workspace_id, data)
      .then((res) => {});
  };

  onChangeSearch = (event) => {
    this.setState({ searchChannel: event.target.value });
  };

  validateEmail = (data) => {
    let errors = {};
    if (Validator.isEmpty(data)) {
      errors.isEmail = "This field is required";
    } else if (!Validator.isEmail(data)) {
      errors.isEmail = "Email is invalid";
    }

    this.setState({
      error: errors,
    });
    return isEmpty(errors);
  };

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };

  getToken = () => {
    this.setState({
      userName: this.props.userToken.userName
        ? this.props.userToken.userName
        : "",
      userToken: this.props.userToken.userToken
        ? this.props.userToken.userToken
        : "",
      getToken: true,
    });
  };

  // Delete token Start
  deleteToken = () => {
    const { skill } = this.props;
    let token = localStorage.getItem("token");
    let userinfo = jwt.decode(token);
    let jiraConnectedId =
      skill && skill.skill_metadata
        ? skill.skill_metadata.jiraConnectedId
        : skill.jiraConnectedId;

    if (userinfo._id == jiraConnectedId) {
      let skillId =
        skill && skill.skill_metadata ? skill.skill_metadata._id : skill._id;
      let wId =
        skill && skill.skill_metadata
          ? skill.skill_metadata.workspace_id
          : skill.workspace_id;
      this.setState({ loading: true });
      this.props
        .updateSkill(
          skillId,
          wId,
          { userName: null, userToken: null },
          this.props.currentSkill
        )
        .then((res) => {
          if (res.data.success) {
            this.setState({ loading: false });
            message.success("Token deleted");
          }
        });
    } else {
      message.error(
        "You are not having permission to delete token.Contact your jira admin."
      );
    }
  };
  // Delete token End

  doNotShowModal = () => {
    this.setState({
      getToken: false,
    });
  };

  getUserName = (event) => {
    // if(event.target.value){
    this.setState({
      userName: event.target.value,
    });
    // }
  };

  getUserToken = (event) => {
    // console.log("event--->",event.target.value)
    // if(event.target.value){
    this.setState({
      userToken: event.target.value,
    });
    // }
  };

  submitTokenData = () => {
    this.invokeChildMethod();
  };

  connectUrl = () => {
    this.props
      .getSkillConnectUrl(this.props.skill.name, this.props.workspace_id)
      .then((res) => {
        if (res.data.success) {
          var url = res.data.url;
          window.open(url, "_blank");
          let data = {
            name: this.props.skill.name,
            connectUserId: localStorage.getItem("trooprUserId"),
          };
          let wId = this.props.workspace_id;
          this.props.setJiraConnectId(wId, data);
        }
      });
  };

  addGridToken = async (id) => {
    axios
      .post(
        "/bot/api/" +
          this.props.match.params.wId +
          "/jira_grid_token/" +
          this.props.skill._id +
          "?token_id=" +
          id
      )
      .then((res) => {
        if (res.data.skill) {
          this.props.setSkill(res.data.skill);
          this.props.setCurrentSkill(res.data.skill);
          this.props.updateAssisantSkills(res.data.skill);
        } else {
          message.error("There was a error connecting Jira.");
        }
      });
  };
  // Jira New Connection Start
  // Menu Start
  menu = () => {
    return (
      <Menu>
        <Menu.Item key="0">
          <a onClick={this.jiraOAuthCloudPage}>New Jira Cloud Connection</a>
        </Menu.Item>
        {/* <Menu.Item key="1">
          <a onClick={this.openConnectModal}>New Jira Server/Data Center Connection</a>
        </Menu.Item> */}
        <Menu.Item key="2">
          <a onClick={this.jiraoauthConnectionPage}>
            New Jira Server/Data Center Connection
          </a>
        </Menu.Item>
        {this.state.connections.length > 0 && (
          <>
            <Menu.Divider />
            <SubMenu title="Use existing from Grid">
              <Menu.ItemGroup title="Jira connections in Grid">
                {this.state.connections.map((connection) => (
                  <Menu.Item key={connection._id}>
                    <Popconfirm
                      title={
                        <div>
                          Are you sure you want to use the following Jira
                          connection from the Grid?
                          <br />
                          <b>Jira domain: {connection.url}</b>
                          {connection.connected_as && <br />}
                          {connection.connected_as &&
                            `Connected as: ${
                              connection.connected_as.displayName
                            } ${
                              connection.connected_as.emailAddress
                                ? `(${connection.connected_as.emailAddress})`
                                : ""
                            }`}
                          <br />
                          Are you sure?
                          <br />
                        </div>
                      }
                      onConfirm={() => this.addGridToken(connection._id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      {connection.url}
                    </Popconfirm>
                  </Menu.Item>
                ))}
              </Menu.ItemGroup>
            </SubMenu>
          </>
        )}
      </Menu>
    );
  };
  // Menu End
  openConnectModal = () => {
    this.setState({ newConnectionModal: true });
  };

  jiraoauthConnectionPage = () => {
    // console.log(this.props)
    this.props.history.push(
      `/${this.props.match.params.wId}/jiraoauthServer/${this.props.match.params.skill_id}/0?sub_skill=${this.props.match.params.sub_skill}`
    );
  };
  jiraOAuthCloudPage = () => {
    this.props.history.push(
      `/${this.props.match.params.wId}/jiraOAuthCloud/${this.props.match.params.skill_id}/0?sub_skill=${this.props.match.params.sub_skill}`
    );
  };

  handleCancel = () => {
    const { form } = this.formRef.props;
    this.setState({ newConnectionModal: false });
    form.resetFields();
  };
  // getPaymentText=()=>{
  //   const {payment}=this.state
  //   let text=""
  // if(payment.payment_app=="jira"){

  //   if(payment.plan_status=="active"){

  //    text=<>Current Status: <Tag color="green">Paid</Tag></>
  //   }else if(payment.plan_status=="trial"){
  //     text=<> Current Status: <Tag color="blue">Evaluation</Tag></>

  //   }else{
  //     text=<> Current Status: <Tag color="red">Eval Expired</Tag></>
  //   }
  // }else{

  // text=<>Current Status:  <br />
  //   <br />
  //   Click on Sync button to fetch license information from the
  //   installed Troopr plugin in the connected Atlassian
  //   account. Please ensure that you have necessary
  //   administrative access for the same.</>
  // }
  // return text

  // }

  updatePayment = (payment) => {
    this.setState({ payment: payment });
  };
  // syncJiraLicense=()=>{
  //   axios.get("/bot/api/"+ this.props.match.params.wId+"/getLicenseStatus").then(data => {
  //     let billing = data.data
  //     if(billing.success){
  //       // console.log(billing.payment.payment)
  //       this.setState({ payment: billing.payment.payment })
  //       setWorkspace(billing.payment.payment.workspace_id)
  //     }else{
  //       message.error(billing.err );
  //     }

  //   })
  // }
  handleCreate = () => {
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      // console.log('Received values of form: ', values);
      let currentWorkspaceId = localStorage.getItem("userCurrentWorkspaceId");

      //----------------------------------------------
      // bcrypt.hash(values.password,10,(err,hash)=>{
      //----------------------------------------------

      this.props
        .addBasicAuth(currentWorkspaceId, this.props.match.params.skill_id, {
          username: values.username,
          password: values.password,
          domain_url: values.url,
        })
        .then((res) => {
          if (res.data.success) {
            this.setState({ newConnectionModal: false });
            form.resetFields();
            //
            let skillMeta = this.props.skill.skill_metadata
              ? this.props.skill.skill_metadata
              : this.props.skill;
            // console.log(skillMeta)
            let jiraUrl = skillMeta.metadata.domain_url;
            //  let  jiraDomainName = jiraUrl;
            this.props.history.push(
              "/" +
                this.props.match.params.wId +
                "/jiraConnectionSteps/" +
                skillMeta._id +
                `?domainName=${jiraUrl}`
            );
            // this.setState({ loadingUser: true });

            // this.props
            //   .getUser(
            //     this.props.skill.skill_metadata
            //       ? this.props.skill.skill_metadata.jiraConnectedId
            //       : this.props.skill.jiraConnectedId
            //   )
            //   .then(res => {
            //     this.setState({ loadingUser: false });
            //     if (res.data.user) {
            //       this.setState({
            //         adminUserName: res.data.user.name, adminMailId: res.data.user.email
            //       });
            //     }
            //   });
            //
          } else {
            message.error("Credentials incorrect, Try again");
          }
        });
      //----------------------------------------------
      //  })
      //----------------------------------------------
    });
  };

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  };
  // Jira New Connection End
  acceptMethods(invokeChildMethod) {
    this.invokeChildMethod = invokeChildMethod;
  }
  urlModalToggle = () => {
    this.setState({ urlModal: !this.state.urlModal });
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  submitNewUrl = () => {
    let obj = { "metadata.domain_url": this.state.domain_url };
    let { skill } = this.props;
    let skillId =
      skill && skill.skill_metadata ? skill.skill_metadata._id : skill._id;
    let wId =
      skill && skill.skill_metadata
        ? skill.skill_metadata.workspace_id
        : skill.workspace_id;
    this.props
      .updateSkill(skillId, wId, obj, this.props.currentSkill)
      .then((res) => {
        if (res.data.success) {
          this.setState({ urlModal: !this.state.urlModal });
          message.success("Site URL updated to :" + this.state.domain_url);
        }
      });
  };

  connectDropDown = (isUserPrivileged) => {
    // console.log("inside connectDropDown: ", isUserPrivileged);
    const { skill } = this.props;
    let type = skill.skill_metadata
      ? skill.skill_metadata &&
        (skill.skill_metadata.metadata.server_type == "jira_server" ||
          skill.skill_metadata.metadata.server_type == "jira_server_oauth")
      : skill.metadata &&
        (skill.metadata.server_type === "jira_server" ||
          skill.metadata.server_type === "jira_server_oauth");
    return (
      <Menu>
        {!type && (
          <Menu.Item disabled={!isUserPrivileged} onClick={this.urlModalToggle}>
            Update Base URL
          </Menu.Item>
        )}
        <Menu.Item
          danger
          disabled={!isUserPrivileged}
          onClick={this.disconnectOnClickModel}
        >
          Delete
        </Menu.Item>
      </Menu>
    );
  };

  content_NotLinked = () => {
    const { skill } = this.props;
    return (
      <Card
        size="small"
        loading={this.state.gridLoading}
        title="Jira Connection"
        bodyStyle={{ overflow: "hidden" }}
        style={{ width: "100%" }}
      >
        <p>
          Connect to a Jira domain. Any Jira user (preferably one with Jira
          admin privileges) can perform this action
        </p>
        <Dropdown
          overlay={this.menu}
          trigger={["click"]}
          placement="bottomLeft"
        >
          <Button>Connect</Button>
        </Dropdown>
      </Card>
    );
  };

  content_Linked = ({
    isUserPrivileged,
    col_span,
    isTokenisThere,
    style_for_double_columns,
    skillConnected,
    isFromCheckins,
    connectedAt,
    jiraDomainName,
    jiraUrl,
    isLinked,
  }) => {
    const { skill } = this.props;
    const connected_as = skill.connected_as
      ? skill.connected_as
      : skill.skill_metadata && skill.skill_metadata.connected_as;
    return (
      <Card
        id="tpgp-wja"
        style={{ width: "100%" }}
        loading={this.state.loadingUser}
        title={isFromCheckins ? "Jira Account" : "Account"}
        size="small"
        bodyStyle={{ overflow: "hidden" }}
        extra={
          <Dropdown
            overlay={this.connectDropDown(isUserPrivileged)}
            placement="bottomLeft"
          >
            <Button type="link" icon={<SettingOutlined />} />
          </Dropdown>
        }
      >
        {
          <div>
            {isLinked && (
              <p>
                <Text type="secondary">Connected to:</Text>{" "}
                <a href={jiraUrl} target="_blank">
                  {jiraDomainName}
                </a>
                <br />
                <Text type="secondary">Connected by:</Text>{" "}
                {this.props.isFromCheckins
                  ? this.props.jiraAdminUserData &&
                    (this.props.jiraAdminUserData.displayName ||
                      this.props.jiraAdminUserData.name)
                  : this.state.adminUserName}{" "}
                (
                {this.props.isFromCheckins
                  ? this.props.jiraAdminUserData &&
                    this.props.jiraAdminUserData.email
                  : this.state.adminMailId}
                )<br />
                {/* <br/> */}
                {/* {skill.connected_as && `Connected as: ${skill.connected_as.displayName} (${skill.connected_as.emailAddress})`} */}
                <Text type="secondary"> Connected at:</Text> {connectedAt}
                <br />
                {connected_as && connected_as.emailAddress ? (
                  <>
                    <Text type="secondary"> Connected as:</Text>{" "}
                    {connected_as.displayName} ({connected_as.emailAddress})
                  </>
                ) : (
                  connected_as &&
                  connected_as.displayName && (
                    <>
                      <Text type="secondary"> Connected as:</Text>{" "}
                      {connected_as.displayName}
                    </>
                  )
                )}
              </p>
            )}
          </div>
        }
      </Card>
    );
  };

  getContent = (data) => {
    const { skill } = this.props;
    return !data.isLinked
      ? this.content_NotLinked(data)
      : this.content_Linked(data);
  };

  getModals = ({ domainName }) => {
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
        {/*-----------------Disconnect Jira modal---------------*/}
        <Modal
          visible={this.state.disconnectModel}
          onCancel={this.disconnectOnClickModel}
          onOk={() => {
            this.updateSkill({
              linked: false,
              metadata: {},
              userName: null,
              userToken: null,
            });
            this.getExistingGridConnections();
          }}
        >
          <div style={{ textAlign: "center" }}>
            You are currently connected to the Jira domain
            <br />
            <b>'{domainName ? domainName : ""}'</b>
            <br />
            Disconnecting the Jira domain will disconnect Jira access for the
            entire team. This will also disconnect Jira for {dynamicText}.
            <br />
            Are you sure?
            <br />
            {/* <Alert type="warning" message={`This will also disconnect Jira for ${dynamicText}. Are you sure?`}/> */}
          </div>
        </Modal>

        {this.state.getToken && (
          <Modal
            visible={this.state.getToken}
            // visible={this.showModal}
            style={{ top: 20 }}
            onCancel={this.doNotShowModal}
            onOk={this.submitTokenData}
            okText="Submit"
            title="Jira Token"
            width={540}
          >
            <JiraToken
              userToken={this.props.userToken.userToken}
              userName={this.props.userToken.userName}
              doNotShowModal={this.doNotShowModal}
              closeModal={true}
              showStyles={false}
              data={{ token: { done: false } }}
              shareMethods={this.acceptMethods.bind(this)}
              currentSkill={this.props.currentSkill}
            />
          </Modal>
        )}

        {this.state.urlModal && (
          <Modal
            title={"Jira Base URL"}
            visible={this.state.urlModal}
            onCancel={this.urlModalToggle}
            onOk={this.submitNewUrl}
            okText="Submit"
          >
            <Form layout="vertical">
              <Form.Item
                className={
                  localStorage.getItem("theme") == "dark" && "form_label_dark"
                }
              >
                <Alert
                  description={
                    <div>
                      The Base URL is the URL via which users access Jira
                      applications. The base URL must be set to the same URL by
                      which browsers will be viewing your Jira instance. Troopr
                      used the Jira Base URL for some REST API calls and also to
                      generate link URL for issues.
                      <br />
                      <br />
                      Change the Base URL for your Jira instance only if it is
                      different from what is mentioned below. Typically there is
                      no need to change this value, but in some cases like
                      migrated Jira instance, the Base URL can be different from
                      the generated one below.
                    </div>
                  }
                  type="warning"
                />
                <br />
                <Input
                  type="url"
                  defaultValue={this.state.domain_url}
                  className={` input-bg ${
                    localStorage.getItem("theme") == "dark" && "autofill_dark"
                  }`}
                />
              </Form.Item>
            </Form>
          </Modal>
        )}

        <JiraServerModal
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.newConnectionModal}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          serverConnection={true}
        />
      </>
    );
  };

  render() {
    const { isFromCheckins } = this.props;
    const { members, user } = this.props;
    const { sub_skill } = this.props.match.params;

    let isAdmin = false;
    if (members && members.length > 0) {
      let user_now = members.find(
        (member) => member.user_id && member.user_id._id == user._id && user
      );
      if (user_now) {
        if (user_now.role) {
          isAdmin = user_now.role == "admin" ? true : false;
        }
      }
    }
    let currentUserId = this.props.currentUser._id;
    //let isUserPrivileged = ((currentUserId == this.state.adminUserId) || (this.state.isAdmin));
    let isUserPrivileged =
      currentUserId ==
        (this.props.isFromCheckins
          ? this.props.jiraAdminUserData && this.props.jiraAdminUserData.user_id
          : this.state.adminUserId) || isAdmin;
    const col_span = 24;
    const { skill } = this.props;
    // console.log("this is new skill",skill)

    // console.log("skill: ", skill);

    let jiraUrl;
    let jiraDomainName;
    let isLinked = skill.skill_metadata
      ? skill.skill_metadata.linked
      : skill.linked;
    let domainName;
    let connectedAt;

    // console.log("skill---->",skill)
    // let time = skill.metadata.installationInfo ? skill.metadata.installationInfo.created_at : ''
    // let date = moment.utc(time).format('MMM Do ha');
    let type = null;
    if (isLinked) {
      let type = skill.skill_metadata
        ? skill.skill_metadata &&
          (skill.skill_metadata.metadata.server_type == "jira_server" ||
            skill.skill_metadata.metadata.server_type == "jira_server_oauth")
        : skill.metadata &&
          (skill.metadata.server_type === "jira_server" ||
            skill.metadata.server_type === "jira_server_oauth");
      let time = skill.skill_metadata
        ? skill.skill_metadata.metadata.createdAt
        : skill.metadata.createdAt;
      connectedAt = moment(time).format("MMM Do h:mm A Z");
      if (type) {
        jiraUrl = skill.skill_metadata
          ? skill.skill_metadata.metadata.domain_url
          : skill.metadata.domain_url;
        jiraDomainName = jiraUrl;
      } else {
        let name = skill.skill_metadata
          ? skill.skill_metadata.metadata.domain_name
          : skill.metadata.domain_name;
        jiraUrl = skill.skill_metadata
          ? skill.skill_metadata.metadata.domain_url
          : skill.metadata.domain_url
          ? skill.metadata.domain_url
          : `https://${name}.atlassian.net`;

        jiraDomainName = jiraUrl;
      }

      // domainName=skill.skill_metadata?
      domainName = skill.skill_metadata
        ? type
          ? skill.skill_metadata.metadata.domain_url
          : skill.skill_metadata.metadata.domain_name
        : type
        ? skill.metadata.domain_url
        : skill.metadata.domain_name;
    }

    const checkingSkill1 =
      this.props.currentSkill.skill_metadata &&
      this.props.currentSkill.skill_metadata &&
      this.props.currentSkill.skill_metadata.metadata &&
      this.props.currentSkill.skill_metadata.metadata.server_type !=
        "jira_server" &&
      this.props.currentSkill.skill_metadata.metadata.server_type !=
        "jira_server_oauth" &&
      this.props.currentSkill.skill_metadata.metadata.server_type !=
        "jira_cloud_oauth";
    const checkingSkill2 =
      this.props.currentSkill &&
      this.props.currentSkill.metadata &&
      this.props.currentSkill.metadata.server_type != "jira_server" &&
      this.props.currentSkill.metadata.server_type != "jira_server_oauth" &&
      this.props.currentSkill.metadata.server_type != "jira_cloud_oauth";
    const skillConnected = checkingSkill1 || checkingSkill2;
    const isTokenisThere = skillConnected && this.props.userToken.userName;
    const style_for_double_columns = { display: "flex" };

    const data = {
      isUserPrivileged,
      col_span,
      isTokenisThere,
      style_for_double_columns,
      skillConnected,
      isFromCheckins,
      connectedAt,
      jiraDomainName,
      jiraUrl,
      isLinked,
    };

    return isFromCheckins ? (
      <>
        {this.getContent(data)} {this.getModals({ domainName })}{" "}
      </>
    ) : (
      <Layout style={{ marginLeft: 0 }}>
        <Content style={{ padding: "16px 16px 32px 24px" }}>
          <Affix offsetTop={0}>
            <Anchor
              style={{
                backgroundColor: "white",
                maxWidth: 984,
                marginLeft: 1000,
                marginBottom: -140,
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

          <Alert
            message="Configurations in this page apply to the entire workspace"
            type="warning"
            showIcon
            style={{
              width: "calc(100% - 16px)",
              maxWidth: 984,
              marginBottom: 16,
            }}
          />
          {/* <div> */}
          <Row className={"content_row_jira"} gutter={[16, 16]}>
            {!isLinked ? (
              <Col span={col_span}>
                {/*-----------------------------------Jira Not Connected--------------------------------*/}
                {this.content_NotLinked(data)}
              </Col>
            ) : (
              <>
                {this.props.currentSkill.skill_metadata &&
                (this.props.currentSkill.skill_metadata.metadata.server_type ===
                  "jira_cloud" ||
                  this.props.currentSkill.skill_metadata.metadata
                    .server_type === "jira_server") &&
                !this.props.currentSkill.skill_metadata.metadata.webhook ? (
                  <Col span={col_span}>
                    <Card
                      style={{ width: "100%" }}
                      title="Webhook"
                      bodyStyle={{ height: "150px", overflow: "hidden" }}
                      extra={
                        <Button onClick={this.goToJiraNotifSetup}>
                          Configure
                        </Button>
                      }
                    >
                      <p>
                        This configuration can be completed by any Jira admin.
                        This step is required for you and your team members to
                        start receiving notifications from Jira when issues are
                        created or updated.
                      </p>
                    </Card>
                  </Col>
                ) : (
                  <>
                    {this.props.currentSkill.metadata &&
                    (this.props.currentSkill.metadata.server_type ===
                      "jira_cloud" ||
                      this.props.currentSkill.metadata.server_type ===
                        "jira_server") &&
                    !this.props.currentSkill.metadata.webhook ? (
                      <Col span={col_span}>
                        <Card
                          style={{ width: "100%" }}
                          title="Webhook"
                          bodyStyle={{ height: "150px", overflow: "hidden" }}
                          extra={
                            <Button onClick={this.goToJiraNotifSetup}>
                              Configure
                            </Button>
                          }
                        >
                          <p>
                            This configuration can be completed by any Jira
                            admin. This step is required for you and your team
                            members to start receiving notifications from Jira
                            when issues are created or updated.
                          </p>
                        </Card>
                      </Col>
                    ) : (
                      ""
                    )}
                  </>
                )}
                {/*------------------------------------------Jira Connected-------------------------------------*/}
                <div id="my-scroll-layout">
                  <Row gutter={[8, 8]} style={{ marginBottom: 1024 }}>
                    <Col span={col_span} style={{ display: "grid" }}>
                      {this.content_Linked(data)}
                    </Col>
                    {this.props.match.params.sub_skill === "jira_software" && (
                      <Col span={col_span} style={{ display: "flex" }}>
                        {/* <Card
                          id="tpgp-cf"
                          title={
                            <div>
                              <Text>Common Filters</Text>
                              <Paragraph ellipsis type="secondary">
                                Shared JQL filters that can be used by all users
                                (max:20)
                              </Paragraph>
                            </div>
                          }
                          extra={
                            <Button
                              type="primary"
                              disabled={!isAdmin}
                              onClick={() => this.openJqlFilterModal()}
                            >
                              Add
                            </Button>
                          }
                          style={{ width: "100%" }}
                          size="small"
                        >
                          <List
                            bordered
                            size="small"
                            pagination={{ pageSize: 4 }}
                            dataSource={this.state.jqlFilter}
                            renderItem={(item) => (
                              <List.Item>
                                <div
                                  style={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <div>
                                    <Typography.Text>
                                      {item.filterName}
                                    </Typography.Text>{" "}
                                  </div>
                                  <div>
                                    <Button
                                      onClick={() =>
                                        this.openJqlFilterModal(item)
                                      }
                                    >
                                      Edit
                                    </Button>
                                  </div>
                                </div>
                              </List.Item>
                            )}
                          />
                        </Card> */}
                      </Col>
                    )}
                    {skillConnected && (
                      <Col span={col_span} style={style_for_double_columns}>
                        <Card
                          style={{ width: "100%" }}
                          loading={this.state.loadingToken}
                          title="API Token"
                          size="small"
                          bodyStyle={{ overflow: "hidden" }}
                          extra={
                            isTokenisThere ? (
                              <Dropdown
                                overlay={
                                  <Menu>
                                    <Menu.Item
                                      disabled={!isUserPrivileged}
                                      onClick={this.getToken}
                                    >
                                      {isTokenisThere ? "Update" : "Add Token"}
                                    </Menu.Item>
                                    <Menu.Item
                                      disabled={!isUserPrivileged}
                                      danger
                                      loading={this.state.loading}
                                    >
                                      {!isUserPrivileged ? (
                                        "Delete"
                                      ) : (
                                        <Popconfirm
                                          title="Are you sure you want to delete the token?"
                                          //  disabled={!isUserPrivileged}
                                          onConfirm={this.deleteToken}
                                          okText="Yes"
                                          cancelText="No"
                                        >
                                          Delete
                                        </Popconfirm>
                                      )}
                                    </Menu.Item>
                                  </Menu>
                                }
                                placement="bottomLeft"
                              >
                                <Button
                                  type="link"
                                  icon={<SettingOutlined />}
                                />
                              </Dropdown>
                            ) : (
                              <Button
                                disabled={!isUserPrivileged}
                                onClick={this.getToken}
                              >
                                {isTokenisThere ? "Update" : "Add Token"}
                              </Button>
                            )
                          }
                        >
                          {isTokenisThere ? (
                            <>
                              <Text type="secondary">Token owner: </Text>
                              <Text>{this.props.userToken.userName}</Text>
                            </>
                          ) : (
                            <>
                              <Text type="secondary">
                                Token is not configured for this account
                              </Text>
                            </>
                          )}
                        </Card>
                      </Col>
                    )}
                    {/* <Row gutter={[8, 8]} style={{ marginBottom: 1024 }}> */}
                    <Col span={24}>
                      {sub_skill !== "jira_reports" && (
                        <div style={{ height: "100vh" }}>
                          <Col span={col_span} style={{ display: "flex" }}>
                            <Card
                              id="tpgp-cf"
                              title={
                                <div>
                                  <Text>
                                    Common Filters ‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎
                                    ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎
                                    ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎
                                    ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎
                                    ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎
                                    ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎
                                    ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎
                                    ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎
                                    ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎
                                    ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎
                                    ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎
                                    ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎
                                    ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎‏‎ ‎
                                  </Text>
                                  <Paragraph ellipsis type="secondary">
                                    Shared JQL filters that can be used by all
                                    users (max:20)‏
                                  </Paragraph>
                                </div>
                              }
                              extra={
                                <Button
                                  type="primary"
                                  disabled={!isAdmin}
                                  onClick={() => this.openJqlFilterModal()}
                                >
                                  Add
                                </Button>
                              }
                              style={{ width: "100%", marginTop: 20 }}
                              size="small"
                            >
                              <List
                                bordered
                                size="small"
                                pagination={{ pageSize: 4 }}
                                dataSource={this.state.jqlFilter}
                                renderItem={(item) => (
                                  <List.Item>
                                    <div
                                      style={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                      }}
                                    >
                                      <div>
                                        <Typography.Text>
                                          {item.filterName}
                                        </Typography.Text>{" "}
                                      </div>
                                      <div>
                                        <Button
                                          onClick={() =>
                                            this.openJqlFilterModal(item)
                                          }
                                        >
                                          Edit
                                        </Button>
                                      </div>
                                    </div>
                                  </List.Item>
                                )}
                              />
                            </Card>
                          </Col>
                          <Col span={col_span} style={{ display: "flex" }}>
                            <Card
                              title="Task It"
                              key="5"
                              id="tpgp-ice"
                              style={{ width: "100%", marginTop: 20 }}
                            >
                              <div>
                                <Text
                                  type="secondary"
                                  style={this.switchButtonStyle}
                                >
                                  Task It Response in Thread
                                  <Switch
                                    disabled={!isUserPrivileged}
                                    checked={this.state.taskItResponseInThread}
                                    onChange={() =>
                                      this.unfurlOptionsHandler(
                                        "taskItResponseInThread"
                                      )
                                    }
                                  />
                                </Text>

                                <Text type="secondary">
                                  <p>
                                    When a Slack message is converted to an{" "}
                                    {sub_skill === "jira_service_desk"
                                      ? "ticket"
                                      : "issue"}{" "}
                                    using {"Task It"}
                                    <br /> message action, the{" "}
                                    {sub_skill === "jira_service_desk"
                                      ? "ticket"
                                      : "issue"}{" "}
                                    card response will be sent in original
                                    message
                                    <br /> thread. If disabled{" "}
                                    {sub_skill === "jira_service_desk"
                                      ? "ticket"
                                      : "issue"}{" "}
                                    card will be sent as new message.
                                  </p>
                                </Text>
                              </div>

                              <br />
                              <Alert
                                message="This configuration will be used in Projects and Helpdesk"
                                type="warning"
                                style={{ textAlign: "center" }}
                              />
                            </Card>
                          </Col>

                          <CustomEmojiForCreation />
                          <JiraBilling
                            payment={this.state.payment}
                            workspace={this.props.workspace}
                            updatePayment={this.updatePayment}
                            isUserPrivileged={isUserPrivileged}
                          />
                        </div>
                      )}
                    </Col>
                  </Row>
                </div>
              </>
            )}

            {this.getModals({ domainName })}
          </Row>

          <Modal
            title="Common Filter"
            visible={this.state.isJqlFilterModalVisible}
            onCancel={this.toggleJqlFilterModal}
            onOk={this.addJqlFilter}
            okText={
              this.state.jqlFilterModalStatus === "ADD" ? "Create" : "Update"
            }
            footer={[
              <Button
                onClick={this.toggleJqlFilterModal}
                key="back"
                style={{
                  marginRight: 15,
                }}
              >
                Cancel
              </Button>,
              <Popconfirm
                placement="top"
                title={`Are you sure to delete this filter?`}
                onConfirm={this.removeJqlFilter}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="danger"
                  disabled={this.state.jqlFilterModalStatus === "ADD"}
                  key="delete"
                  hidden={this.state.jqlFilterModalStatus === "ADD"}
                  style={{
                    marginRight: 15,
                  }}
                >
                  Delete
                </Button>
              </Popconfirm>,
              <Button
                type="primary"
                onClick={this.addJqlFilter}
                disabled={this.state.isJqlFilterActionButtonDisabled}
                key="submit"
              >
                {this.state.jqlFilterModalStatus === "ADD"
                  ? "Create"
                  : "Update"}
              </Button>,
            ]}
          >
            <Text>Name (max 20 chars)</Text>
            <br />
            <Input
              label="Name"
              defaultValue={this.state.jqlFilterName}
              value={this.state.jqlFilterName}
              maxLength={20}
              onChange={(e) => this.setState({ jqlFilterName: e.target.value })}
            />
            <br />
            <br />
            <Text>Filter (JQL)</Text>
            <br />
            <Input
              label="Filter"
              defaultValue={this.state.jqlFilterExp}
              value={this.state.jqlFilterExp}
              onChange={(e) => this.setState({ jqlFilterExp: e.target.value })}
            />
          </Modal>
        </Content>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    workspace: state.common_reducer.workspace,
    assistant_skills: state.skills,
    user: state.common_reducer.user,
    userData: state.skills,
    issues: state.skills.issues,
    channelDefault: state.skills.channelDefault,
    personalChannelDefault: state.skills.personalChannelDefault,
    currentUser: state.auth.user,
    guestManager: state.jiraGuest.jiraGuestManager,
    guestUsers: state.jiraGuest.jiraGuestUsers,
    jiraUser: state.skills.currentSkillUser,
    userToken: state.skills.userData,
    currentSkill: state.skills.currentSkill,
    skills: state.skills.skills,
    members: state.skills.members,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    getSkillConnectUrl,
    updateSkill,
    setDefaultChannel,
    getDefaultChannel,
    getIssues,
    getProject,
    personalSetting,
    getAssisantSkills,
    getJiraGuestManager,
    getJiraGuestUsers,
    submitTokenData,
    getUserToken,
    getUser,
    setJiraConnectId,
    addBasicAuth,
    setWorkspace,
    setSkill,
    setCurrentSkill,
    updateAssisantSkills,
  })(JiraConfiguration)
);
