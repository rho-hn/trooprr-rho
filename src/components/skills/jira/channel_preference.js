import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  setDefaultChannel,
  getDefaultChannel,
  getIssues,
  getProject,
  getServiceDeskProject,
  getAssisantSkills,
  getJiraBoards,
  deleteDefaultChannel,
  channelAdminConfig,
  updateChannelCommonData,
  deleteChannelConfigurations,
  searchJiraProjects,
  creatorAsAssignee
} from "../skills_action";
import {
  ArrowLeftOutlined,
  ExclamationCircleOutlined,
  ExpandAltOutlined,
  ShrinkOutlined,
  QuestionCircleOutlined,
  DeleteOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import { Button, Select, Modal, Input, Card, message, Spin, Alert, Layout, Collapse, Switch, Radio,Space } from "antd";
import { Typography, Row, Col, Tabs, Tooltip, Dropdown, Menu, Popconfirm } from "antd";
import query from "query-string";
import Subscriptions from "./Subscriptions/Subscriptions";
import ChannelAdmins from "./channel_admins";
import JiraChannelPreferences from "./Jira_channel_preferences";
import ProjectRestriction from "./projectRestriction";
import axios from "axios";
// import { ExclamationCircleOutlined } from '@ant-design/icons';
import IssueCard from "../../../utils/IssueCard";
import JiraIssueFields from "./jiraIssueFields";
import IssueCardCustomization from "./issueCardFieldCustomization"
import queryString from "query-string";
import { guestOauthTokensForUsers } from "../../jiraoauth/jiraoauth.action"
import { getGuestOauthTokensForCloudUsers } from "../../jiraoauth/jiraOAuthCloud.action"
const { Text, Title, Paragraph } = Typography;
const { Option } = Select;
const { Panel } = Collapse;
const { Content } = Layout;
const { TabPane } = Tabs;
const threadsync_options = [
  { label: 'Show all updates', value: true },
  { label: 'Show comments', value: false },
];
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

const defaultDetailedFields = [
  {
    index: 0,
    field: {
      name: "Project",
      value: "project",
    },
    fallback: {
      name: "Issue Type",
      value: "issuetype",
    },
  },
  {
    index: 1,
    field: {
      name: "Issue Type",
      value: "issuetype",
    },
    fallback: {
      name: "Project",
      value: "project",
    },
  },
  {
    index: 2,
    field: {
      name: "Priority",
      value: "priority",
    },
    fallback: {
      name: "Assignee",
      value: "assignee",
    },
  },
  {
    index: 0,
    field: {
      name: "Assignee",
      value: "assignee",
    },
    fallback: {
      name: "Priority",
      value: "priority",
    },
  },
];

const defaultCompactField = {
  field: {
    name: "Status",
    value: "status",
  },
  fallback: {
    name: "Status",
    value: "status",
  },
};

const allowedSchemaTypes = [
  "issuetype",
  "number",
  "string",
  "project",
  "sd-customerrequesttype",
  "resolution",
  "datetime",
  "date",
  "watches",
  "user",
];

const allowedArrayWithTypes = ["user", "string", "number", "version"];

class JiraChannelPreference extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      linkedProject: null,
      linkedProjectName: "",
      linkedIssue: null,
      edit: false,
      error: {},
      preference: "channel",
      setFieldValueModal: false,
      setFieldValueField: "",
      setFieldInputField: "",
      defaultloading: false,
      showChannelSetting: false,
      board: "",
      boardData: [],
      isChannelAdmin: true,
      currentChannelConfigs: false,
      currentChannelName: "",
      isGridSharedChannel: false,
      creatorAsAssignee: false,
      isTrooprAdded: true,
      numberOfFieldsInExpanded: 4,
      allFieldsInJira: [],
      fieldsSelectedDetailed: defaultDetailedFields,
      fieldSelectedCompact: defaultCompactField,
      showDescription: false,
      isThreadSync: false,
      currentView: 1,
      projectLoading: false,
      // fields: [],
      channelDefaultsModalVisible: false,
      updateChannelDefaultData: {},
      disable_CSAT_feedback: true,
      auto_create_issue: false,
      auto_create_issue_emoji:false,
      isUnfurl:true,
      isUnfurlLink:true,
      unfurlResponseInThread:true,
      server_type: '',
      channel_type : '',
      showAllUpdatesInThread:false,
      showThreadSyncConfigurationInModal:false,
      channelCommonData : null,
      // blockedProjects : []
    };
    // this.showChannelSetting = this.showChannelSetting.bind(this);
    this.myRef = React.createRef();
  }

  columns = [
    {
      key: "number",
      align: "center",
      render: (text, record, index) => <Text>Attribute #{index + 1}</Text>,
      width: "25%",
    },
    {
      title: () => (
        <Text>
          Field{" "}
          <Tooltip title={`If the value for this field is not present for any issue, "Not available" will be shown`}>
            <QuestionCircleOutlined />
          </Tooltip>
        </Text>
      ),
      key: "field",
      align: "center",
      render: (text, record, index) => (
        <Select
          defaultValue={this.state.fieldsSelectedDetailed.length === 4 && this.state.fieldsSelectedDetailed[index].field.name}
          placeholder='Select a jira field'
          style={{ width: "100%" }}
          value={this.state.fieldsSelectedDetailed[index].field.name}
          onSelect={(e) => this.onDetailedFieldsSelect(e, "field", index)}
          showSearch
        >
          {this.getAvailableFields(index).map((field) => {
            return (
              <Option key={field.id} value={field.name}>
                {field.name}
              </Option>
            );
          })}
        </Select>
      ),
      width: "37%",
    },
    // {
    //   title: () => <Text>Fallback Field <Tooltip title="When the jira field is not present in the issue, this field will be uesd."><QuestionCircleOutlined /></Tooltip></Text>,
    //   key: "field-fallback",
    //   align: "center",
    //   render: (text, record, index) => <Select
    //     defaultValue={this.state.fieldsSelectedDetailed.length === 4 && this.state.fieldsSelectedDetailed[index].fallback.name}
    //     placeholder="Select a jira field"
    //     style={{ width: "100%" }}
    //     onSelect={(e) => this.onDetailedFieldsSelect(e, "fallback", index)}
    //   >
    //     {defaultFields.map(field => {
    //       return <Option key={field.value} value={field.name}>{field.name}</Option>
    //     })}
    //   </Select>,
    //   width: "37%"
    // }
  ];

  descriptionToggle = () => {
    let data = {
      showDescription: !this.state.showDescription,
      fieldsSelectedDetailed: this.state.fieldsSelectedDetailed,
      fieldSelectedCompact: this.state.fieldSelectedCompact,
    };
    this.handleIssueCardConfigChanges(data);
  };

  componentDidMount() {
    const { commonChanneldata, user_now, channels, userChannels, skill } = this.props;
    const {channel_id, channel_type} = queryString.parse(window.location.search)
    let qs = query.parse(window.location.search);
    if(qs.isThreadSyncUrl){
this.setState({showThreadSyncConfigurationInModal:true})
    }
    if(channel_id) {
      let redirect = false
      if (!channel_type) {message.error('Channel type not found'); redirect = true}
      if (channel_type !== 'agent' && channel_type !== 'support' && channel_type !== 'project') {message.error('Channel type wrong') ; redirect = true}
      
      if(redirect)this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}/${this.props.match.params.sub_skill}?view=channel_preferences`)
    }

    this.setState({ loading: true, projectLoading: true,channel_type }, () => {
      if(channel_type) this.getRequiredData()
    });

    // Check if Troopr is added Show Descto the current channel
    let Channel_id = this.props.channel.id;
    let link = `/bot/slack/${this.props.match.params.wId}/checkIfMember/${Channel_id}`;
    axios
      .get(link)
      .then((res) => {
        res = res.data;
        if (res.success) {
          this.setState({
            isTrooprAdded: res.data,
          });
        }
      })
      .catch((e) => {
        this.setState({ isTrooprAdded: false });
      });
    let channelSettings = commonChanneldata.find((channel) => channel.channel_id === this.props.channel.id);
    // Thread Sync Toggle
    if (channelSettings) {
      this.setState({ isThreadSync: channelSettings.isThreadSync,
        showAllUpdatesInThread:channelSettings.showAllUpdatesInThread,
        isUnfurl:channelSettings.isUnfurl,
        isUnfurlLink:channelSettings.isUnfurlLink,
        unfurlResponseInThread:channelSettings.unfurlResponseInThread,
        channelCommonData : channelSettings
      
      });

      this.setState({ currentChannelConfigs: channelSettings, auto_create_issue: channelSettings.auto_create_in_channel || false, auto_create_issue_emoji: channelSettings.auto_create_in_channel_emoji || false });
      if ("restrict_channel_config" in channelSettings && channelSettings.restrict_channel_config) {
        const userFound = channelSettings.channel_admins.find((user) => user == user_now._id);
        if (userFound) this.setState({ isChannelAdmin: true });
        else this.setState({ isChannelAdmin: false });
      } else this.setState({ isChannelAdmin: true });

      if (channelSettings.issueCardCustomizationInfo) {
        this.setState({
          showDescription: channelSettings.issueCardCustomizationInfo.showDescription,
          fieldsSelectedDetailed: channelSettings.issueCardCustomizationInfo.fieldsSelectedDetailed,
          fieldSelectedCompact: channelSettings.issueCardCustomizationInfo.fieldSelectedCompact,
        });
      }

      // if(channelSettings && channelSettings.projectRestriction && channelSettings.projectRestriction.restriction_type === "block" && channelSettings.projectRestriction.selected_projects && channelSettings.projectRestriction.selected_projects.length > 0){
      //   this.setState({blockedProjects : channelSettings.projectRestriction.selected_projects})
      // }

      // if restriction is false or is not configured, then we will allow all users to edit
    }

    //<<< handle channel name change >>>
    if (this.props.channel.id) {
      const selectedChannel = this.props.channels.find((channel) => channel.id == this.props.channel.id);
      if (selectedChannel) this.setState({ currentChannelName: selectedChannel.name });
      else {
        if (this.props.channel_name) {
          this.setState({
            isTrooprAdded: false,
            currentChannelName: this.props.channel_name,
          });
        }
      }
    }
  }

  getRequiredData = () => {
    const {userChannels, skill } = this.props;
    const {channel_type} = this.state;

    if(skill && skill.metadata && skill.metadata.server_type) {
      this.setState({server_type : skill.metadata.server_type}, () => {

        if (channel_type === 'support'){
        this.props
          .getServiceDeskProject(this.props.match.params.wId, this.props.match.params.skill_id)
          .then((res) => this.setState({ projectLoading: false }));
        }
      else if(channel_type === 'agent'){
        if(this.state.server_type === 'jira_server_oauth' || this.state.server_type === 'jira_server'){
          this.props.getProject(this.props.match.params.wId).then((res) => this.setState({ projectLoading: false }));
        }else{
          this.props.searchJiraProjects(this.props.match.params.wId,'?query=typeKey=service_desk').then(res => this.setState({projectLoading:false}))
        }
      }
      else if(channel_type === "project"){
        if(this.state.server_type === 'jira_server_oauth' || this.state.server_type === 'jira_server'){
          this.props.getProject(this.props.match.params.wId).then((res) => this.setState({ projectLoading: false }));
        }else{
          this.props.searchJiraProjects(this.props.match.params.wId,'?query=typeKey=software').then(res => this.setState({projectLoading:false}))
        }
      }
      else {
        this.props.getProject(this.props.match.params.wId).then((res) => this.setState({ projectLoading: false }));
      }
      })
    }

    //checking if it's enterprice shared channel or not
    const channelFound = userChannels.find((cha) => cha.id === this.props.channel.id);
    let isGridSharedChannel = false;
    if (channelFound && channelFound.is_org_shared && channelFound.enterprise_id) {
      isGridSharedChannel = true;
      this.setState({ isGridSharedChannel: true });
    }


    this.props
    .getDefaultChannel(this.props.match.params.skill_id, this.props.channel.id, /*to handle "type"*/ false, isGridSharedChannel)
    .then((res) => {
      this.setState({ loading: false });
      if (res.data.success) {
        // if(res.data.link_info){
        //   if(res.data.link_info.isSupportChannel) this.props.getServiceDeskProject(this.props.match.params.wId,this.props.match.params.skill_id).then(res => this.setState({projectLoading:false}))
        //   else this.props.getProject(this.props.match.params.wId).then(res => this.setState({projectLoading:false}))
        // }else{
        //   this.props.getProject(this.props.match.params.wId).then(res => this.setState({projectLoading:false}));
        // }
        if (res.data.link_info) {
           this.setState({
            linkedProjectName: res.data.link_info.link_info.project_name,
            linkedProject: res.data.link_info.link_info.project_id,
            linkedIssue: channel_type === 'support' ? res.data.link_info.link_info.requestType.name : res.data.link_info.link_info.issue_id,
            board: res.data.link_info.link_info.board ? res.data.link_info.link_info.board.id.toString() : null,
            disable_CSAT_feedback: res.data.link_info.link_info.disable_CSAT_feedback ? true : false
           
          });
          this.props.getIssues(
            this.props.match.params.wId,
            channel_type === 'support' ? res.data.link_info.link_info.project_service_desk_id : res.data.link_info.link_info.project_id,
            // this.props.isSupportChannel
            channel_type === 'support' ? true : false
          );

          // if(res.data.link_info.link_info.board){
          let query = "projectKeyOrId=" + this.state.linkedProject;
          this.props.getJiraBoards(this.props.match.params.wId, query).then((boardData) => {
            if (boardData && boardData.data && boardData.data.boards && boardData.data.boards.length > 0 && boardData.data.boards[0].name) {
              // console.log('didmount',boardData)
              this.setState({ /*board: boardData.data.boards[0].name*/ boardData: boardData.data.boards });
            }
          });
          // }
        } else {
          this.setState({ linkedProject: "", linkedIssue: "" });
        }
      }
    });
  }

   removeGuestAuthorizationConfirm = async () => {
     const { isChannelAdmin } = this.state;

     if (!isChannelAdmin) {
      return message.warn(`Channel configuration access restricted.Contact one of the channel admins(or workspace admins) for access: ${this.getAdminNames()}`)
     }

    Modal.confirm({
      title: "Revoke Guest Facilitation",
      icon: <ExclamationCircleOutlined />,
      content: (
        <p>
          Are you sure you want revoke permissions?
        </p>
      ),
      onOk: () => this.removeGuestAuthorization(),
      onCancel: () => { },
    });
  }

  removeGuestAuthorization = () => {
    const queryParams = queryString.parse(this.props.location.search)
    this.props.channelAdminConfig(this.props.match.params.wId,this.props.match.params.skill_id,queryParams.channel_id,{guestToken:null},this.state.isGridSharedChannel)
  }



  goToUserJiraLogin = async () => {
    const { skill } = this.props;
    const { isChannelAdmin } = this.state;
    if (!isChannelAdmin) {
    return message.warn(`Channel configuration access restricted.Contact one of the channel admins(or workspace admins) for access: ${ this.getAdminNames() }`)
    }
    let servertype = skill && skill.metadata && skill.metadata.server_type
    const queryParams = queryString.parse(this.props.location.search)
    if (servertype && servertype === "jira_server_oauth") {

      let url = await guestOauthTokensForUsers(this.props.match.params.wId, this.props.match.params.sub_skill,queryParams)
      if (!url) {
        message.error("Error Logging in make sure you connected to jira or disconnect and try connection jira again")
      }
      else {
        window.open(url, "_blank");
      }
    } else if (servertype && servertype === "jira_cloud_oauth") {
      let url = await getGuestOauthTokensForCloudUsers(this.props.match.params.wId, this.props.match.params.sub_skill,queryParams);
      if (!url) {
        message.error("Error Logging in make sure you connected to jira or disconnect and try connection jira again")
      }
      else {
        window.open(url, "_blank");
      }
    }
    else {
      const url = `/${this.props.match.params.wId}/jira_user_oauth/${this.props.match.params.skill_id}`;
      window.open(url, "_blank");
    }

    /*this.props.history.push("/workspace/"+this.props.workspace_id+"/jira_user_oauth/"+this.props.skill._id)*/
  };





  getValidFields = (fields) => {
    let validFields = [];
    if (!fields || !fields.length) return;
    fields.forEach((field) => {
      let schema = field.schema;
      let type = schema && schema.type;
      let items = schema && schema.items;
      if (!type) return;
      if (allowedSchemaTypes.includes(type) || (type === "array" && items && allowedArrayWithTypes.includes(items))) {
        validFields.push(field);
      }
    });
    this.setState({
      allFieldsInJira: validFields,
    });
  };

  componentDidUpdate(prevProps) {
    const { commonChanneldata, user_now, channel } = this.props;
    // if (prevProps.channelDefault.creatorAsAssignee === undefined && this.props.channelDefault.creatorAsAssignee !== undefined) {
    //   this.setState({
    //     creatorAsAssignee: this.props.channelDefault.creatorAsAssignee,
    //   });
    // }
    if(prevProps.channelDefault !== this.props.channelDefault && this.props.channelDefault._id) this.setState({creatorAsAssignee : this.props.channelDefault.creatorAsAssignee})
    if (prevProps.commonChanneldata != commonChanneldata) {
      if (this.props.isWorkspaceAdimin) {
        this.setState({ isChannelAdmin: true });
      }
      // Check if Troopr is added to the current channel
      let channel_id = this.props.channel.id;
      let link = `/bot/slack/${this.props.match.params.wId}/checkIfMember/${channel_id}`;
      axios
        .get(link)
        .then((res) => {
          res = res.data;
          if (res.success) {
            this.setState({
              isTrooprAdded: res.data,
            });
          }
        })
        .catch((e) => {
          this.setState({ isTrooprAdded: false });
        });

      if (commonChanneldata) {
        const channelFound = commonChanneldata.find((cha) => cha.channel_id == channel.id);
        // Thread Sync Toggle
        if (channelFound) {
        this.setState({ channelCommonData: channelFound,isThreadSync: channelFound.isThreadSync,showAllUpdatesInThread:channelFound.showAllUpdatesInThread, isUnfurl:channelFound.isUnfurl});
        }
        if (channelFound) {
          this.setState({ currentChannelConfigs: channelFound, auto_create_issue: channelFound.auto_create_in_channel || false, auto_create_issue_emoji: channelFound.auto_create_in_channel_emoji || false  });
          if ("restrict_channel_config" in channelFound && channelFound.restrict_channel_config) {
            const userFound = channelFound.channel_admins.find((user) => user == user_now._id);
            if (userFound) this.setState({ isChannelAdmin: true });
            else this.setState({ isChannelAdmin: false });
          } else this.setState({ isChannelAdmin: true });

          if (channelFound.issueCardCustomizationInfo) {
            this.setState({
              showDescription: channelFound.issueCardCustomizationInfo.showDescription,
              fieldsSelectedDetailed: channelFound.issueCardCustomizationInfo.fieldsSelectedDetailed,
              fieldSelectedCompact: channelFound.issueCardCustomizationInfo.fieldSelectedCompact,
            });
          }

          // if(channelFound && channelFound.projectRestriction && channelFound.projectRestriction.restriction_type === "block" && channelFound.projectRestriction.selected_projects && channelFound.projectRestriction.selected_projects.length > 0){
          //   this.setState({blockedProjects : channelFound.projectRestriction.selected_projects})
          // }
        }
        // if restriction is false or is not configured, then we will allow all users to edit
      }
    }

    if (prevProps.channels != this.props.channels) {
      //<<< handle channel name change >>>
      if (this.props.channel.id) {
        const selectedChannel = this.props.channels.find((channel) => channel.id == this.props.channel.id);
        if (selectedChannel) this.setState({ currentChannelName: selectedChannel.name });
        else {
          if (this.props.channel_name) {
            this.setState({
              isTrooprAdded: false,
              currentChannelName: this.props.channel_name,
            });
          }
        }
      }
    }

    if(this.props.location.search !== prevProps.location.search){
      const channel_type = queryString.parse(window.location.search).channel_type
      this.setState({channel_type}, () => this.getRequiredData())
    }
  }

  creatorAsAssigneeChange = () => {
    let skill_id = this.props.match.params.skill_id;
    let channel_id = this.props.channel.id;
    let link = `/bot/api/skill/${skill_id}/channel_link/creatorAsAssignee/${channel_id}`;

    if (this.state.isGridSharedChannel) link += `?isGridSharedChannel=true`;

    this.props.creatorAsAssignee({link, channeL : this.props.channel}).then(data => {
        if (data && data.data && data.data.success) {
          this.setState({
            creatorAsAssignee: data.data.data,
          });
        }
    })
    // axios
    //   .post(link,{channel:this.props.channel})
    //   .then((data) => {
    //     if (data && data.data && data.data.success) {
    //       this.setState({
    //         creatorAsAssignee: data.data.data,
    //       });
    //     }
    //   })
    //   .catch((error) => {});
  };

  threadSyncToggle = () => {

    let skill_id = this.props.match.params.skill_id;
    let channel_id = this.props.channel.id;
    let workspace_id = this.props.match.params.wId;
    let link = `/bot/api/${workspace_id}/isThreadSync/${skill_id}/${channel_id}`;
    if (this.state.isGridSharedChannel) link += `?isGridSharedChannel=true`;
    let data = {
      channel:this.props.channel,
      isThreadSync: !this.state.isThreadSync,
      channel_type : this.state.channel_type
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


  
  showAllUpdatesButtonToggle = (showAllUpdatesInThread) => {

    let skill_id = this.props.match.params.skill_id;
    let channel_id = this.props.channel.id;
    let workspace_id = this.props.match.params.wId;
    let link = `/bot/api/${workspace_id}/isThreadSync/${skill_id}/${channel_id}`;
    if (this.state.isGridSharedChannel) link += `?isGridSharedChannel=true`;
    let data = {
      channel:this.props.channel,
      showAllUpdatesInThread,
      isThreadSync: this.state.isThreadSync,
      channel_type : this.state.channel_type
    };
    axios
      .post(link, data)
      .then((data) => {
        data = data.data;
        if (data && data.commonChannelData) {
          this.setState({ showAllUpdatesInThread: data.commonChannelData.showAllUpdatesInThread });
        }
      })
      .catch((error) => {
        message.error("Some error occurred. Please try again.");
      });
  };

  onChangeProject = async (event, value) => {
    const { channel_type } = this.state;
    this.setState({ linkedProject: event, linkedProjectName: value.props.children }, () => {
      let query = "projectKeyOrId=" + this.state.linkedProject;
      channel_type !== 'support' &&
        this.props.getJiraBoards(this.props.match.params.wId, query).then((boardData) => {
          if (boardData && boardData.data && boardData.data.boards && boardData.data.boards.length > 0 && boardData.data.boards[0].name) {
            this.setState({ board: boardData.data.boards[0].id.toString(), boardData: boardData.data.boards });
          } else this.setState({ boardData: [], board: null });
        });
    });
    this.props.getIssues(this.props.match.params.wId, channel_type === 'support' ? value.key : event, channel_type === 'support' ? true : false).then((res) => {
      if (res.data.success){
        this.setState({ linkedIssue: res.data.issueTypes[0].value }, () => {
          // if (!this.props.isSupportChannel) {
          //   // this.getIssueFields()
          //   // this.project_change_click_child()
          // }
        });
      }else{
        this.setState(()=>({linkedIssue:null}))
      }
    });
  };

  onChangeIssue = (event) => {
    this.setState({ linkedIssue: event }, () => {
      // if (!this.props.isSupportChannel) {
      //   // this.getIssueFields()
      //   // this.issue_change_click_child()
      // }
    });
  };

  getIssueFields = () => {
    axios
      .get(`/bot/skill/${this.props.match.params.skill_id}/user/${this.props.user_now._id}/issueFieldsOfProject`, {
        params: {
          project_id: this.state.linkedProject,
          issueTypeName: this.state.linkedIssue,
          // params : {project_id : '10026',
          // issueTypeName : 'Task'
        },
      })
      .then((res) => {
        // console.log(JSON.stringify(res.data.items.projects[0].issuetypes[0].fields))
        if (res.data.success) this.setState({ fields: Object.values(res.data.items.projects[0].issuetypes[0].fields) });
      })
      .catch((e) => {});
  };

  onChangeBoard = (event, value) => {
    this.setState({ board: value && value.key ? value.key : null });
  };

  onClickSave = async () => {
    try {
         // console.log(this.state)
    const { issues, projects,commonChanneldata } = this.props;
    const {channel_type} = this.state
    // console.log("this.state.linkedProject=>",this.state.linkedProject)
    // const search = window.location.search;
    const channelId = this.props.channel.id;

    var error = {};
    let selectedBoardData = this.state.board && this.state.boardData.find((board) => board.id == this.state.board);
    let selectedProjectData =
      projects && projects.find((project) => (channel_type === 'support' ? project.projectId : project.id) === this.state.linkedProject);
    var data = {
      link_info: {
        // issue_id: this.state.linkedIssue,
        project_id: this.state.linkedProject,
        project: selectedProjectData,
        // issue_field: this.state.setFieldValueField,
        // issue_value: this.state.setFieldInputValue,
        // issueName:selectedIssueData && selectedIssueData.value
      },
    };
    if (channel_type === 'support') {

      const config = commonChanneldata.find(cha => cha.channel_id === channelId)

      if(config){
      }
      else{
      /* saving the channel as support channel in "Common channel data collection" */

      const common_data = {
        channel_id: channelId,
        skill_id: this.props.match.params.skill_id,
        channel:this.props.channel,
        isThreadSync: true,
        channel_type : 'support'
      };

      const common_data_res = await this.props.updateChannelCommonData(common_data, this.props.match.params.wId)
      if(common_data_res.success){}
      else throw JSON.stringify(common_data_res)
      }

      const issueDataFound = this.props.issues.find((issue) => issue.value === this.state.linkedIssue);
      const projectDataFound = this.props.projects.find((project) => project.projectId === this.state.linkedProject);
      data.link_info.requestType = { name: this.state.linkedIssue, id: issueDataFound ? issueDataFound.id : null };
      if (projectDataFound) data.link_info.project_service_desk_id = projectDataFound.id;
      data.link_info.disable_CSAT_feedback = this.state.disable_CSAT_feedback ? true : false
    } else {
      let selectedIssueData = issues && issues.find((issue) => issue.value == this.state.linkedIssue);
      data.link_info.issue_id = this.state.linkedIssue;
      data.link_info.issue_field = this.state.setFieldValueField;
      data.link_info.issue_value = this.state.setFieldInputValue;
      data.link_info.issueName = selectedIssueData && selectedIssueData.value;
      if(selectedIssueData){
        data.link_info.issueType={id:selectedIssueData.id,name:selectedIssueData.text}
      }
   

    }
    if (selectedProjectData)
      data.link_info.project_name = channel_type === 'support'
        ? selectedProjectData.projectName + ` (${selectedProjectData.projectKey})`
        : selectedProjectData.name + ` (${selectedProjectData.key})`;
    // data.link_info.board = selectedBoardData ? {id:selectedBoardData.id, name:selectedBoardData.name} : null
    data.link_info.board = selectedBoardData ? selectedBoardData : null;
    data.channel_id = channelId;
    data.updated_by = localStorage.trooprUserId;
    data.skill_id = this.props.match.params.skill_id;
    if ((data.link_info.issue_id || data.link_info.requestType) && data.link_info.project && data.link_info.project_id && data.channel_id) {
      this.setState({ defaultloading: true, updateChannelDefaultData: data }, () => {
        if (channel_type === 'support') this.saveChannelDefault(data);
        else this.clickChild();
      });

      // this.props.setDefaultChannel(this.props.match.params.skill_id, data,/*to handle "type" */false,this.state.isGridSharedChannel).then(res => {
      //   if (res.data.success) {
      //     this.setState({ defaultloading: false })
      //     message.success("Saved successfully");
      //     this.setState({ setFieldInputValue: res.data.link_info.link_info.issue_value, setFieldValueField: res.data.link_info.link_info.issue_field, linkedProject: res.data.link_info.link_info.project_id, linkedIssue: isSupportChannel ? res.data.link_info.link_info.requestType.name : res.data.link_info.link_info.issue_id, edit: false, error: {} });
      //     !res.data.link_info.link_info.board && this.setState({boardData:[]});
      //   }
      // })
    } else {
      if (!this.state.linkedProject) {
        message.error("No Project selected");
      } else if (!this.state.linkedIssue) {
        message.error("No Issue Selected");
      }
      this.setState({ error: error });
    } 
    } catch (error) {
      message.error('Something went wrong, please try again.')
      console.error(error)
      this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}/${this.props.match.params.sub_skill}?view=channel_preferences`);
    }
  };

  saveChannelDefault = (data) => {
    const { channel_type } = this.state;
    data.channel=this.props.channel
    data.channel_type = this.state.channel_type
    this.props.setDefaultChannel(this.props.match.params.skill_id, data, /*to handle "type" */ false, this.state.isGridSharedChannel).then((res) => {
      this.setState({ channelDefaultsModalVisible: false });
      if (res.data.success) {
        this.setState({ defaultloading: false });
        message.success("Saved successfully");
        this.setState({
          setFieldInputValue: res.data.link_info.link_info.issue_value,
          setFieldValueField: res.data.link_info.link_info.issue_field,
          linkedProject: res.data.link_info.link_info.project_id,
          linkedIssue: channel_type === 'support' ? res.data.link_info.link_info.requestType.name : res.data.link_info.link_info.issue_id,
          edit: false,
          error: {},
        });
        !res.data.link_info.link_info.board && this.setState({ boardData: [] });
      }
    });
  };
  onClickDeleteConfirm = () => {
    Modal.confirm({
      title: "Delete Channel defaults?",
      icon: <ExclamationCircleOutlined />,
      content: <p>Are you sure you want to delete channel defaults?</p>,
      onOk: () => this.onClickDelete(),
      onCancel: () => {},
    });
  };
  onClickDelete = () => {
    const { deleteDefaultChannel } = this.props;
    this.setState({ defaultloading: true });
    deleteDefaultChannel(
      this.props.match.params.skill_id,
      this.props.channel.id,
      /*to handle "isPersonal"*/ false,
      this.state.isGridSharedChannel
    ).then((res) => {
      if (res.success) {
        message.success("Deleted successfully");
        this.setState({ linkedProject: null, linkedIssue: null, board: "", linkedProjectName: "" });
        // this.props.history.push(`/${this.props.match.params.wId}/skills/${this.pro ps.match.params.skill_id}?view=channel_preferences`);
      } else {
        message.error("Error deleting channel defaults");
      }
      this.setState({ defaultloading: false });
    });
  };

  openEditState = async () => {
    this.setState({ edit: true });
    const { channelDefault } = this.props;
    if (this.props.channelDefault.link_info) {
      let query = "projectKeyOrId=" + this.props.channelDefault.link_info.project_id;
      await this.props.getJiraBoards(this.props.match.params.wId, query).then((boardData) => {
        if (boardData && boardData.data && boardData.data.boards && boardData.data.boards.length > 0 && boardData.data.boards[0].name) {
          this.setState({ /*board: boardData.data.boards[0].name*/ boardData: boardData.data.boards });
        } else this.setState({ boardData: [] });
      });
    }
  };

  onCancel = async () => {
    const { channel_type } = this.state;
    const { channelDefault } = this.props;
    if (this.props.channelDefault.link_info) {
      let query = "projectKeyOrId=" + this.props.channelDefault.link_info.project_id;
      await this.props.getJiraBoards(this.props.match.params.wId, query).then((boardData) => {
        if (boardData && boardData.data && boardData.data.boards && boardData.data.boards.length > 0 && boardData.data.boards[0].name) {
          this.setState({ /*board: boardData.data.boards[0].name*/ boardData: channelDefault.link_info.board ? boardData.data.boards : [] });
        } else this.setState({ boardData: [] });
      });
      this.props.getIssues(this.props.match.params.wId, channelDefault.link_info.project_id);
      this.setState({ board: channelDefault.link_info.board ? channelDefault.link_info.board.id.toString() : channelDefault.link_info.board });
    }

    if (channelDefault && channelDefault.link_info)
      this.setState({
        linkedProjectName: channelDefault.link_info.project_name,
        linkedProject: channelDefault.link_info.project_id,
        linkedIssue: channel_type === 'support' ? channelDefault.link_info.requestType.name : channelDefault.link_info.issue_id,
      });
    else this.setState({ linkedProjectName: "", linkedProject: null, linkedIssue: null, board: "", boardData: [] });
    this.setState({ edit: false, error: {} });

    this.setState({ fields: [] });

    // this.resetFieldDefaults_click_child()
  };

  toggleSetFieldValue = () => {
    this.setState({ setFieldValueModal: !this.state.setFieldValueModal });
  };

  toggleSetFieldValueCancel = () => {
    this.setState({ setFieldValueField: "", setFieldInputField: "", setFieldValueModal: !this.state.setFieldValueModal });
  };

  toggleSetFieldValueOk = () => {
    this.setState({ setFieldValueModal: !this.state.setFieldValueModal });
  };

  setFieldFieldValue = (event) => {
    // console.log('setFieldInputField',event)
    this.setState({ setFieldValueField: event });
  };

  setFieldInputValue = (event) => {
    // console.log('setFieldInputValue',event.target.value)
    this.setState({ setFieldInputField: event.target.value });
  };

  setFieldValueBody = () => {
    return (
      <div>
        <div>Jira Issue field</div>
        <div>
          <Select placeholder='Choose an field value' onChange={this.setFieldFieldValue} style={{ width: 472 }}>
            {setFieldValueValues.map((value) => (
              <Option key={value.value} value={value.value}>
                {value.label}
              </Option>
            ))}
          </Select>
        </div>
        <div>Issue Value</div>
        <div>
          <Input onChange={this.setFieldInputValue} />
        </div>
      </div>
    );
  };

  // showChannelSetting() {
  //   // let path = window.location.pathname;

  //   // let obj = {
  //   //   "title": this.props.skillView.view,
  //   //   "url": path + `?view=${this.props.skillView.view}`
  //   // }
  //   // // console.log(obj)
  //   // window.history.pushState(obj, obj.title, obj.url);

  //   this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}?view=channel_preferences`);

  //   this.setState({ showChannelSetting: true });
  // }

  getAdminNames = () => {
    const { members } = this.props;
    let { currentChannelConfigs } = this.state;
    let adiminNames = "";
    if (currentChannelConfigs) {
      currentChannelConfigs.channel_admins.forEach((id, index) => {
        if (index < 3) {
          const user = members && members.find((mem) => mem.user_id._id == id);
          if (user) adiminNames = adiminNames + `${user.user_id.displayName || user.user_id.name} `;
        }
      });

      if (currentChannelConfigs.channel_admins.length > 3) {
        adiminNames = adiminNames + ` and ${currentChannelConfigs.channel_admins.length - 3} others`;
      }
    }

    return adiminNames;
  };

  getAvailableFields = (index) => {
    let allSelectedFields = [...this.state.fieldsSelectedDetailed.map((config) => config.field)];
    allSelectedFields.splice(index, 1);
    let allJiraFields = this.state.allFieldsInJira;
    allJiraFields = allJiraFields.filter((field) => !allSelectedFields.some((selectedField) => selectedField.value === field.id));
    return allJiraFields;
  };

  onDetailedFieldsSelect = (fieldName, type, index) => {
    // Type can be field or fallback.
    // Index gives attribute index.

    if (this.state.fieldsSelectedDetailed.length < 4) return message.error("Please try again.");
    let allSelectedFields = this.state.fieldsSelectedDetailed;
    let currentAttributeConfig = allSelectedFields[index];
    let field = this.state.allFieldsInJira.find((field) => field.name === fieldName);
    currentAttributeConfig[type] = {
      index,
      name: field.name,
      value: field.id,
      schema: field.schema,
    };
    allSelectedFields[index] = currentAttributeConfig;

    let data = {
      showDescription: this.state.showDescription,
      fieldsSelectedDetailed: allSelectedFields,
      fieldSelectedCompact: this.state.fieldSelectedCompact,
    };
    this.handleIssueCardConfigChanges(data);

    // this.setState({
    //   fieldsSelectedDetailed: allSelectedFields
    // })
  };

  onCompactFieldsSelect = (fieldName) => {
    let selectedField = this.state.allFieldsInJira.find((field) => field.name === fieldName);
    if (!selectedField) return message.error("Try again.");
    // this.setState({
    //   fieldSelectedCompact: selectedField
    // })
    selectedField = {
      field: {
        name: selectedField.name,
        value: selectedField.id,
        schema: selectedField.schema,
      },
      fallback: {
        name: "Status",
        value: "status",
      },
    };
    let data = {
      showDescription: this.state.showDescription,
      fieldsSelectedDetailed: this.state.fieldsSelectedDetailed,
      fieldSelectedCompact: selectedField,
    };
    this.handleIssueCardConfigChanges(data);
  };

  onReset = () => {
    let data = {
      showDescription: false,
      fieldsSelectedDetailed: defaultDetailedFields,
      fieldSelectedCompact: defaultCompactField,
    };
    this.handleIssueCardConfigChanges(data);
  };

  onViewChange = (id) => {
    this.setState({ currentView: id });
  };

  handleIssueCardConfigChanges = (data) => {
    // let data = {
    //   showDescription: this.state.showDescription,
    //   fieldsSelectedDetailed: this.state.fieldsSelectedDetailed
    // };
    let skill_id = this.props.match.params.skill_id;
    let channel_id = this.props.channel.id;
    let wId = this.props.match.params.wId;
    data = {
      issueCardCustomizationInfo: data,
    };
    axios
      .post(`/bot/api/${wId}/issueCardCustomization/${skill_id}/channel/${channel_id}`, data)
      .then((res) => {
        res = res.data;
        if (res && res.success) {
          let channelCommonData = res.channelCommonData;
          if (channelCommonData && channelCommonData.issueCardCustomizationInfo) {
            this.setState({
              showDescription: channelCommonData.issueCardCustomizationInfo.showDescription,
              fieldsSelectedDetailed: channelCommonData.issueCardCustomizationInfo.fieldsSelectedDetailed,
              fieldSelectedCompact: channelCommonData.issueCardCustomizationInfo.fieldSelectedCompact,
            });
          }
        }
      })
      .catch((error) => {
        message.error("Please try again.");
      });
  };

  on_CSAT_switch_change = (checked) => {
    let data = { ...this.props.channelDefault };

    if (data.link_info) {
      data.link_info.disable_CSAT_feedback = !checked;
      data.channel=this.props.channel
      this.props
        .setDefaultChannel(this.props.match.params.skill_id, data, /*to handle "type" */ false, this.state.isGridSharedChannel)
        .then((res) => {
          if (res.data.success) {
            this.setState({ disable_CSAT_feedback: !checked });
          } else message.error("Error updating Request CSAT feedback");
        });
    } else message.error("Channel defaults not set");
  };

  // onUnfurlChange = (checked) => {
  //   let data = { ...this.props.channelDefault };

  //   if (data.link_info) {
  //     data.link_info.disable_CSAT_feedback = !checked;
  //     data.channel=this.props.channel
  //     this.props
  //       .setDefaultChannel(this.props.match.params.skill_id, data, /*to handle "type" */ false, this.state.isGridSharedChannel)
  //       .then((res) => {
  //         if (res.data.success) {
  //           this.setState({ disable_CSAT_feedback: !checked });
  //         } else message.error("Error updating Request CSAT feedback");
  //       });
  //   } else message.error("Channel defaults not set");
  // };




  onAutoCreateIssueChanged = (event) => {
    let data = {}
    if (event.target.value === 0) {
      data = { auto_create_in_channel: false, auto_create_in_channel_emoji: false }
    }
    else if (event.target.value === 1) {
      data = { auto_create_in_channel: true, auto_create_in_channel_emoji: false }
    }
    else {
      data = { auto_create_in_channel: false, auto_create_in_channel_emoji: true }
    }


    let query = ""
    if (this.state.isGridSharedChannel) query = `isGridSharedChannel=true`
    // console.log(`/bot/api/${this.props.match.params.wId}/jira/${this.props.match.params.skill_id}/${this.props.channel.id}/updateautoticket?${query}\n`,JSON.stringify(query), data)
    axios.post(`/bot/api/${this.props.match.params.wId}/jira/${this.props.match.params.skill_id}/${this.props.channel.id}/updateautoticket?${query}`, data).then((res) => {
      // console.log(res.data)
      if (res.data && res.data.success /* &&res.data.warningMessage */) {
        // message.error("hi saurav what's up ")
        if (res.data.warningMessage) message.error(res.data.warningMessage)
        this.setState({ auto_create_issue: data.auto_create_in_channel, auto_create_issue_emoji: data.auto_create_in_channel_emoji })
      }
    })
  };


  switchButtonStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  }


  unfurlOptionsHandler = async (name) => {
    if (!name)  return;

    let data = {channel:this.props.channel};
    data[name] = !this.state[name]
    let skill_id = this.props.match.params.skill_id;
    let channel_id = this.props.channel.id;
    let workspace_id = this.props.match.params.wId;

   
let link=`/bot/api/${ workspace_id}/channel_config/${skill_id}/${channel_id}?isGridSharedChannel=${this.state.isGridSharedChannel}`
    let response = await axios.post(link, data);
    if (response) {
      this.setState({
        isUnfurl:response.data.commonChannelData.isUnfurl,
        isUnfurlLink:response.data.commonChannelData.isUnfurlLink,
        unfurlResponseInThread:response.data.commonChannelData.unfurlResponseInThread
  
      })
    }
  }

getHiddenFieldsCardText = () => {
  const {channelDefault} = this.props

  let text

  if(channelDefault.link_info.hiddenFields){
    let hiddenFields = {...channelDefault.link_info.hiddenFields}
    text = (
      <Text type='secondary'>
        Hidden fields set for issue type(s) <strong>{`${Object.keys(hiddenFields)[0]}${Object.keys(hiddenFields)[1] ? ', '+ Object.keys(hiddenFields)[1]: ''}` }</strong> {`${Object.keys(hiddenFields).length > 2 ? `and ${Object.keys(hiddenFields).length - 2 } more issue types.` : '.'}`} <br /><br />
        Click <strong>Manage</strong> button above to cusomize field visibility when creating<br></br> issues in this slack channel in the default project.
      </Text>
    )
  }else {
    text = (
      <Text type = 'secondary'>
        Click <strong>Manage</strong> button above to cusomize field visibility when creating <br></br>issues in this slack channel in the default project.
      </Text>
    )
  }

  return text
}

deleteChannelConfiguration = (channel_id,name) => {
  const channelFound = this.props.channels.find(channel => channel.id === channel_id)
  let  data = {
    channel_id,
    skill_id:this.props.match.params.skill_id
  }
  data.isGridSharedChannel = false
  if(channelFound && channelFound.enterprise_id && channelFound.is_org_shared) data.isGridSharedChannel = true
  this.props.deleteChannelConfigurations(this.props.match.params.wId,data).then(res => {
    if(res.success){
      message.success(`#${name} configurations deleted successfully`)
      this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}/${this.props.match.params.sub_skill}?view=channel_preferences`)
    }
  })
}

deleteConfiguration = (data) => {
      const {commonChanneldata,user_now, isWorkspaceAdimin} = this.props
        let isChannelAdmin = true
        const commondataFound = commonChanneldata.find(channelCommonData => channelCommonData.channel_id === data.id)
        if(commondataFound && "restrict_channel_config" in commondataFound && commondataFound.restrict_channel_config ){
          const userFound = commondataFound && commondataFound.channel_admins.find(user => user === user_now._id)
          if(userFound) isChannelAdmin = true
          else isChannelAdmin = false
        }else isChannelAdmin=true;

          if(isChannelAdmin || isWorkspaceAdimin){
            return Modal.confirm({
              title: "The following channel preferences will be reset",
              content: commondataFound && commondataFound.channel_type === 'support' ? (
                <>
                1. Ticket Defaults<br/>
                2. Thread Sync behaviour<br/>
                3. Channel administration<br/>
                <br />
                This change is irreversible. Are you sure?
                </>
              ) : (
              <>
                1. Notification preferences<br/>
                2. Issue Defaults<br/>
                3. Thread Sync behaviour<br/>
                4. Channel administration<br/>
                <br />
                This change is irreversible. Are you sure?
                </>),
              okText: 'Delete', 
              okType: 'danger',
              onOk: () => this.deleteChannelConfiguration(data.id,data.name)
            }) 
          } else {
             message.warning(`Channel configuration access restricted. Contact one of the channel admins (or workspace admins) for access: ${this.getAdminNames(commondataFound)}`)
           }
}
   
  render() {
    // let dataSourceForAttributesList = Array.apply(null, { length: this.state.numberOfFieldsInExpanded }).map((_, index) => {
    //   return {
    //     key: index,
    //   };
    // });
    
    // console.log("state from JiraChannelPreference",this.state);
    //  const search = window.location.search;
    //  const channelId = search.split('=')[2];
    let { cardTemplates, projects, isWorkspaceAdimin, channelDefault } = this.props;
    let { isChannelAdmin, currentChannelConfigs, linkedProject, projectLoading,channel_type } = this.state;

    let projectFound = false;
    if (linkedProject) projectFound = projects.find((project) => (channel_type === 'support' ? project.projectId : project.id == linkedProject));
    let qs = queryString.parse(window.location.search)
    let channel_data = {
      id: qs.channel_id,
      name: qs.channel_name
    }
    // else projectFound = false;
    return (
      <Content style={{ padding: "16px 16px 32px 24px", marginLeft: 0 }}>
        {!this.state.showChannelSetting ? (
          <div>
            {/* <Title level={3} style={{ display: "flex" }}>  <Button
              onClick={this.showChannelSetting}
              icon={<ArrowLeftOutlined />}
              style={{ marginRight: "16px" }}
            >
              Back
        </Button>
              Channel: {this.state.currentChannelName} </Title> */}
            {currentChannelConfigs != false && !isChannelAdmin && !isWorkspaceAdimin && (
              <Alert
                showIcon
                type='warning'
                description={`Channel configuration access restricted. Contact one of the channel admins (or workspace admins) for access: ${this.getAdminNames()}`}
                style={{ margin: "10px auto" }}
              />
            )}
            {!this.state.isTrooprAdded ? (
              <>
                <Alert
                  // description="Troopr is not invited to this channel. Features like Notifications, Reports, etc. will not work until Troopr is added. Use /invite @Troopr Assistant to invite Troopr to this channel."
                  message='Troopr is not invited to this channel. Features like Notifications, Reports, etc. will not work until Troopr is added. Use /invite @Troopr Assistant to invite Troopr to this channel.'
                  type='warning'
                  showIcon
                  style={{ width: "calc(100% - 16px)", maxWidth: 984 }}
                />
                <br />
              </>
            ) : null}
     
                    {this.state.showThreadSyncConfigurationInModal&&<Modal footer={[  <Button key="close" type="secondary"  onClick={()=>this.setState({showThreadSyncConfigurationInModal:false})}>
            Close
          </Button>,]} maskClosable={false} title="Threadsync Configuration" visible={true} onOk={()=>this.setState({showThreadSyncConfigurationInModal:false})} onCancel={()=>this.setState({showThreadSyncConfigurationInModal:false})}>
                    <Text style={this.switchButtonStyle}>
                   Threadsync
                   <Switch
                            disabled={(!isChannelAdmin && !isWorkspaceAdimin) ? true : false} // If currentChannelConfig is not present, no need to disable.
                            checked={this.state.isThreadSync}
                            onChange={() => this.threadSyncToggle()}
                          />
                        </Text>
                        <Paragraph type='secondary'>
                        {/* Allow issue cards to start a Slack thread to continuously sync with the corresponding Jira issue. Every Jira issue can have a
                        maximum of 5 active issue cards. Newer active cards will automatically disable thread sync in the oldest one. */}
                        <p>Jira {channel_type === 'support' ? 'ticket' : 'issue'} cards posted to this channel will start a thread to continuously <br></br>sync 2-way with the corresponding Jira {channel_type === 'support' ? 'ticket' : 'issue'}. Messages in this thread <br></br>will be added as comments in Jira and vice versa. Every Jira {channel_type === 'support' ? 'ticket' : 'issue'} can <br></br>have a maximum of 5 thread sync. Newer thread sync for the {channel_type === 'support' ? 'ticket' : 'issue'} will automatically disable the oldest one.</p>
                      </Paragraph>
                      <br/>
                      <Radio.Group
                  options={threadsync_options}
                  disabled={(!isChannelAdmin && !isWorkspaceAdimin) ? true : false}
                  onChange={(event)=>{
                   let value=event.target.value;
                   this.showAllUpdatesButtonToggle(value)
                  }}
                  value={this.state.showAllUpdatesInThread?true:false}
                  optionType="button"
                  buttonStyle="solid"
                />
      </Modal>
  }
            <Row className='content_row_jira' gutter={[16, 16]}>
              <Col span={12}>
                {/* -------- channel default --------------- */}
                <Card
                  style={channel_type !== 'support' ? { height: "100%" } : {}}
                  size='small'
                  title={
                    <>
                      Channel Defaults{" "}
                      <Tooltip
                        title={
                          <>
                            When a new jira {channel_type === 'support' ? "ticket" : "issue"} is created during “Quick create or Slack message action” the
                            following defaults will be used.
                          </>
                        }
                      >
                        <QuestionCircleOutlined
                          size='small'
                          // style={{ color: "white" }}
                        />
                      </Tooltip>
                    </>
                  }
                  extra={
                    <>
                      {(currentChannelConfigs == false || isChannelAdmin || isWorkspaceAdimin) && this.props.channelDefault.channel_id ? (
                        <Dropdown.Button
                          overlay={
                            <>
                              <Menu onClick={this.onClickDeleteConfirm}>
                                <Menu.Item key='1'>
                                  <DeleteOutlined /> Clear Defaults
                                </Menu.Item>
                              </Menu>
                            </>
                          }
                          onClick={() => {
                            this.setState({ channelDefaultsModalVisible: true });
                          }}
                        >
                          Manage
                        </Dropdown.Button>
                      ) : (
                        <Button
                          onClick={() => {
                            this.setState({ channelDefaultsModalVisible: true });
                          }}
                        >
                          Manage
                        </Button>
                      )}
                    </>
                  }
                >
                  {this.state.channelDefaultsModalVisible /*  || true */ && (
                    <Modal
                      title='Channel Defaults'
                      visible={this.state.channelDefaultsModalVisible /*  || true */}
                      maskClosable={false}
                      centered
                      onCancel={() => {
                        this.setState({ channelDefaultsModalVisible: false });
                        this.onCancel();
                      }}
                      bodyStyle={{ maxHeight: "70vh", overflowY: "scroll", overflowX: "hidden" }}
                      footer={
                        !(currentChannelConfigs != false && !isChannelAdmin && !isWorkspaceAdimin)
                          ? [
                              <>
                                <Button
                                  key='submit'
                                  type='primary'
                                  // loading={this.state.loading}
                                  onClick={() => this.onClickSave()}
                                >
                                  Save
                                </Button>
                              </>,
                            ]
                          : false
                      }
                    >
                      {this.state.loading ? (
                        <Spin />
                      ) : (
                        <div>
                          {/* <Checkbox disabled={!this.state.edit} checked={isSupportChannel} onChange={this.onSupportChannelCheck} strong style={{marginBottom:8}}><Text type='secondary'>Is this a Support channel</Text></Checkbox> */}
                          {channel_type === 'support' && (
                            <>
                              <Alert
                                type='warning'
                                style={{ textAlign: "center" }}
                                message='Channel defaults should be configured for ticketing task it'
                              />
                              <br />
                            </>
                          )}
                          {/* <Paragraph type='secondary'>When a new jira {isSupportChannel ? 'ticket':'issue'} is created during “Quick create or Slack message action” the following defaults will be used.</Paragraph> */}
                          {/*------------------------------Default Project-----------------------------*/}
                          <>
                            <Text type='secondary' strong>
                              Default Project
                            </Text>
                            <br />
                            <Select
                              name='linkedProject'
                              style={{ marginBottom: "8px", width: "100%" }}
                              placeholder='Select Project'
                              value={this.state.linkedProjectName}
                              onChange={this.onChangeProject}
                              showSearch={true}
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              disabled={currentChannelConfigs != false && !isChannelAdmin && !isWorkspaceAdimin}
                              loading={projectLoading}
                            >
                              {this.props.projects &&
                                (channel_type === 'agent' ? this.props.projects.filter(pro => pro.projectTypeKey === 'service_desk') : channel_type === 'project' ? this.props.projects.filter(pro => pro.projectTypeKey === 'software') : this.props.projects).map((project, index) => {
                                  // let disabled = false
                                  // if(this.state.blockedProjects.find(p => (p.id || p.projectId) === (project.id || project.projectId )/*  || p.projectId === project.projectId */)) disabled = true
                                  return <Option key={project.id} value={channel_type === 'support' ? project.projectId : project.id} /* disabled={disabled} */>
                                    {channel_type === 'support' ? project.projectName + ` (${project.projectKey})` : project.name + ` (${project.key})`}
                                  </Option>
                              })}
                            </Select>
                            <br />

                            {this.state.error.linkedProject && <div className='error_message'>{this.state.error.linkedProject}</div>}
                          </>
                          {/*---------------------------------Default Issue Type---------------------------*/}
                          {/* <div className={this.state.linkedProject ? "bottom_space_forms" : "Preference_disable_state"}> */}
                          <>
                            <Text type='secondary' strong>
                              {channel_type === 'support' ? "Default Request Type" : "Default Issue type"}
                            </Text>
                            <br />
                            <Select
                              // disabled={!this.state.linkedProject || !this.state.edit}
                              name='linkedIssue'
                              style={{ marginBottom: "8px", width: "100%" }}
                              value={this.state.linkedIssue}
                              onChange={this.onChangeIssue}
                              // disabled={projectFound ? false : true}
                              disabled={projectFound ? currentChannelConfigs != false && !isChannelAdmin && !isWorkspaceAdimin : true}
                              showSearch={true}
                            >
                              {this.props.issues &&
                                this.props.issues.map((issue, index) => (
                                  <Option key={issue.value} value={issue.value}>
                                    {issue.text}
                                  </Option>
                                ))}
                            </Select>
                            <br />
                            {this.state.error.linkedIssue && <div className='error_message'>{this.state.error.linkedIssue}</div>}
                          </>

                          {/*------------------------------Board Def-----------------------------*/}
                          {channel_type !== 'support' && (
                            <>
                              <Text type='secondary' strong>
                                Board (optional)
                              </Text>
                              <br />
                              <Select
                                name='boards'
                                style={{ width: "100%", marginBottom: "15px" }}
                                showSearch={true}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                value={this.state.board}
                                defaultValue={this.state.board}
                                disabled={projectFound ? currentChannelConfigs != false && !isChannelAdmin && !isWorkspaceAdimin : true}
                                onChange={this.onChangeBoard}
                                allowClear
                              >
                                {this.state.boardData.map((board) => {
                                  return (
                                    <Option value={board.id.toString()} key={board.id.toString()} label={board.name}>
                                      {board.name + ` (${board.type})`}
                                    </Option>
                                  );
                                })}
                                {/* <Option value={this.state.board} >{this.state.board}</Option> */}
                                {/* {cardTemplates && cardTemplates.map((board, index) => (
                            ))} */}
                              </Select>
                            </>
                          )}

                          {/*--------------------------------Set field value-----------------------*/}
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

                          {(channel_type === 'project' || channel_type === 'agent') && (
                            <JiraIssueFields
                              issues={this.props.issues}
                              // fields={this.state.fields}
                              linkedIssue={this.state.linkedIssue}
                              linkedProject={this.state.linkedProject}
                              updateChannelDefaultData={this.state.updateChannelDefaultData}
                              saveChannelDefault={(data) => this.saveChannelDefault(data)}
                              setClick={(click) => (this.clickChild = click)}
                              channelDefault={this.props.channelDefault}
                              board={this.state.board}
                              disableEdit={currentChannelConfigs != false && !isChannelAdmin && !isWorkspaceAdimin}
                              // project_change={(click) => (this.project_change_click_child = click)}
                              /* issue_change={(click) => (this.issue_change_click_child = click)}  resetFieldDefaults={(click) =>
                              (this.resetFieldDefaults_click_child = click)
                            } */
                              // resetFieldDefaults={(click) =>
                              //   (this.resetFieldDefaults_click_child = click)}
                            />
                          )}

                          {/*---------------------------------Buttons---------------------------------------*/}
                          {/* {(currentChannelConfigs == false || isChannelAdmin || isWorkspaceAdimin) && this.props.channelDefault.channel_id &&!this.state.edit && <Button  type='danger' style={{float:'right',width:'114px'}} loading={this.state.defaultloading} onClick={this.onClickDeleteConfirm}>Delete</Button>} */}
                          {/* {(currentChannelConfigs == false || isChannelAdmin || isWorkspaceAdimin) && <div>{this.state.edit ?
                      <div >
                        <Button style={{width:'114px'}} onClick={this.onCancel}>Cancel</Button>
                        <Button type="primary" style={{width:'114px',marginLeft:'10px'}} loading={this.state.defaultloading} onClick={this.onClickSave}>Save</Button>
                      </div>
                       : 
                       <div>
                         <Button style={{width:'114px'}}  onClick={this.openEditState}>Edit</Button>
                      {this.props.channelDefault.channel_id && <Button  type='danger' style={{float:'right',width:'114px'}} loading={this.state.defaultloading} onClick={this.onClickDeleteConfirm}>Delete</Button>}

                       </div>
                       }
                       </div>} */}
                        </div>
                      )}
                    </Modal>
                  )}
                  <Row>
                    <Col>
                      {/* <Paragraph type='secondary'>When a new jira {isSupportChannel ? 'ticket':'issue'} is created during “Quick create or Slack message action” the following defaults will be used.</Paragraph>
                {this.props.channelDefault.channel_id && 'hello'} */}
                      {this.state.loading ? (
                        <Spin />
                      ) : (
                        <>
                          {channelDefault.channel_id ? (
                            <>
                              <Text type='secondary'>Project: </Text> {channelDefault.link_info.project_name} <br />
                              <Text type='secondary'>{channel_type === 'support' ? "Request Type:" : "Issue Type:"} </Text>{" "}
                              {channel_type === 'support'
                                ? channelDefault.link_info.requestType
                                  ? channelDefault.link_info.requestType.name
                                  : ""
                                : channelDefault.link_info.issue_id}{" "}
                              <br />
                              {channelDefault.link_info.board && (
                                <>
                                  <Text type='secondary'>Board: </Text> {channelDefault.link_info.board.name} &nbsp;
                                  <Tooltip
                                    title={
                                      <>
                                        Board Default is used only during issue listing in this channel
                                      </>
                                    }
                                  >
                                    <QuestionCircleOutlined
                                      size='small'
                                      // style={{ color: "white" }}
                                    />
                                  </Tooltip>
                                  <br />
                                </>
                              )}
                              {channelDefault.link_info.fieldDefaults && (
                                <>
                                  <Text type='secondary'>
                                    <br />
                                    Field defaults set for issue type(s){" "}
                                    {Object.keys(channelDefault.link_info.fieldDefaults).map((issue_type, index) => {
                                      if (index === Object.keys(channelDefault.link_info.fieldDefaults).length - 1)
                                        return `${Object.keys(channelDefault.link_info.fieldDefaults).length === 1 ? "" : "and"} ${issue_type}`;
                                      else
                                        return `${issue_type}${Object.keys(channelDefault.link_info.fieldDefaults).length - 2 === index ? "" : ","} `;
                                    })}
                                    . Click Manage button for details.
                                  </Text>
                                  <br />
                                  {/* ex : Field defaults set for issue type(s) Task, Sub-task and Story. Click Manage button for details. */}
                                </>
                              )}
                            </>
                          ) : (
                            <Text type='secondary'>No defaults set. Click Manage button to set defaults.</Text>
                          )}
                        </>
                      )}
                    </Col>
                    {/* <Col>
                      {(currentChannelConfigs == false || isChannelAdmin || isWorkspaceAdimin) && this.props.channelDefault.channel_id && (
                        <Button
                          type='danger'
                          style={{ float: "right", width: "114px" }}
                          loading={this.state.defaultloading}
                          onClick={this.onClickDeleteConfirm}
                        >
                          Delete
                        </Button>
                      )}
                    </Col> */}
                    
                  </Row>
                </Card>
              </Col>

              {channelDefault && channelDefault.link_info && (channel_type === 'project' || channel_type === 'agent') && (
                <Col span={12}>
                  <Card
                    title={"Hide Fields in Creation Form"}
                    style={{ height: "100%" }}
                    size='small'
                    extra={
                      <>
                        <Button
                          onClick={() => {
                            this.setState({ channelDefaultsModalVisible: true });
                          }}
                        >
                          Manage
                        </Button>
                      </>
                    }
                  >
                    {this.getHiddenFieldsCardText()}
                  </Card>
                </Col>
              )}

              {(channel_type === 'project' || channel_type === 'agent') && (
                <Col span={12}>
                  {/*-------------------Channel Notification Subscription---------------------*/}
                  {/* <JiraChannelNotification channel_id={channelId} channelName={this.props.channel_name} /> */}
                  <Subscriptions
                    channel={this.props.channel}
                    isChannelAdmin={this.state.isChannelAdmin}
                    isWorkspaceAdimin={isWorkspaceAdimin}
                    currentChannelConfigs={this.state.currentChannelConfigs}
                    userChannels={this.props.userChannels}
                    isGridSharedChannel={this.state.isGridSharedChannel}
                  />
                </Col>
              )}

              {/*-------------------Channel Notification Subscription ends---------------------*/}
              <Col span={12}>
                {/* channel admins */}
                {(!currentChannelConfigs || isChannelAdmin || isWorkspaceAdimin) && (
                  <div>
                    <ChannelAdmins
                      currentChannelConfigs={this.state.currentChannelConfigs}
                      channel={this.props.channel}
                      isWorkspaceAdimin={isWorkspaceAdimin}
                      isChannelAdmin={isChannelAdmin}
                      userChannels={this.props.userChannels}
                      isGridSharedChannel={this.state.isGridSharedChannel}
                    />
                  </div>
                )}
                <div>
                  <Collapse style={{ borderTop: "transparent" }} /*defaultActiveKey={["1"]}*/>


                  <Panel 
                      header={channel_type === 'support' ? "Ticket Preview (Unfurl)" : "Issue Preview (Unfurl)" }
                      key="0" 
                      extra={
                        <div
                          onClick={e => { e.stopPropagation(); }}
                        >
                          <Switch 
                          checked={this.state.isUnfurl}
                          disabled={!isChannelAdmin && !isWorkspaceAdimin} 
                          onChange={() => this.unfurlOptionsHandler("isUnfurl")}
                          />
                        </div>
                      }
                    >
                   

                    <Text type='secondary'>{`Show additional information about Jira ${channel_type === 'support' ? "tickets" : "issues"} when its is mentioned in Slack`}</Text><br/>
                      <div>
                        <Text type='secondary' style={this.switchButtonStyle}>
                          <b style={{color:"rgba(0, 0, 0, 0.65)"}}>{`Generate ${channel_type === 'support' ? 'ticket' : 'issue'} preview for ${channel_type === 'support' ? 'ticket' : 'issue'} links`}</b>
                          <Switch 
                            disabled={(!this.state.isUnfurl) || (!isChannelAdmin)}
                            checked={this.state.isUnfurlLink} 
                            onChange={() => this.unfurlOptionsHandler("isUnfurlLink")}
                          />
                        </Text>
                        {/* <br/> */}
                        <Text type='secondary'>
                        {`Allow Troopr to generate ${channel_type === 'support' ? 'ticket' : 'issue'} preview for Jira ${channel_type === 'support' ? 'ticket' : 'issue'} links. Example: https://acme.atlassian.net/browse/TP-100`}
                        <br/>
                        {/* Troopr will still be able to unfurl other issue mentions. */}
                        </Text>
                      </div>
                      <br/>
                      <div>
                        <Text type='secondary' style={this.switchButtonStyle}>
                          <b style={{color:"rgba(0, 0, 0, 0.65)"}}>{`Show ${channel_type === 'support' ? 'ticket' : 'issue'} preview in thread`}</b> 
                          <Switch 
                            disabled={(!this.state.isUnfurl) || (!isChannelAdmin)}
                            checked={this.state.unfurlResponseInThread} 
                            onChange={() => this.unfurlOptionsHandler("unfurlResponseInThread")}
                          />
                        </Text>
                        {/* <br/> */}
                        <Text type='secondary'><p>Expanded {channel_type === 'support' ? 'ticket' : 'issue'} context will be sent as ${channel_type === 'support' ? 'ticket' : 'issue'} card in original message <br></br>thread. If disabled {channel_type === 'support' ? 'ticket' : 'issue'} card will be sent as new message.</p></Text>
                      </div>
                     
                    </Panel>
                    <Panel
                      header={channel_type === 'support' ? 'Ticket creator as Assignee' : 'Issue creator as Assignee'}
                      key='1'
                      extra={
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <Switch
                            disabled={(!isChannelAdmin && !isWorkspaceAdimin) || !this.props.channelDefault.link_info}
                            checked={this.state.creatorAsAssignee}
                            onChange={() => this.creatorAsAssigneeChange()}
                          />
                        </div>
                      }
                    >
                      <Paragraph type='secondary'>
                        {`When creating ${channel_type === 'support' ? 'tickets' :  'issues'} from channel, auto-assign the creator as the assignee for that ${channel_type === 'support' ? 'ticket' : 'issue'}.`}
                      </Paragraph>
                    </Panel>
                    


                    <Panel
                      header='Thread Sync'
                      key='2'
                      extra={
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <Switch
                            disabled={(!isChannelAdmin && !isWorkspaceAdimin) ? true : false} // If currentChannelConfig is not present, no need to disable.
                            checked={this.state.isThreadSync}
                            onChange={() => this.threadSyncToggle()}
                          />
                        </div>
                      }
                    >
                      <Paragraph type='secondary'>
                        {/* Allow issue cards to start a Slack thread to continuously sync with the corresponding Jira issue. Every Jira issue can have a
                        maximum of 5 active issue cards. Newer active cards will automatically disable thread sync in the oldest one. */}
                        <p>Jira {channel_type === 'support' ? 'ticket' : 'issue'} cards posted to this channel will start a thread to continuously <br></br>sync 2-way with the corresponding Jira {channel_type === 'support' ? 'ticket' : 'issue'}. Messages in this thread <br></br>will be added as comments in Jira and vice versa. Every Jira {channel_type === 'support' ? 'ticket' : 'issue'} can <br></br>have a maximum of 5 thread sync. Newer thread sync for the {channel_type === 'support' ? 'ticket' : 'issue'} will automatically disable the oldest one.</p>
                      </Paragraph>
                      <br/>
                      <Radio.Group
                  options={threadsync_options}
                  disabled={(!isChannelAdmin && !isWorkspaceAdimin) ? true : false}
                  onChange={(event)=>{
                   let value=event.target.value;
                   this.showAllUpdatesButtonToggle(value)
                  }}
                  value={this.state.showAllUpdatesInThread?true:false}
                  optionType="button"
                  buttonStyle="solid"
                />
                      {/* <Button disabled={(!isChannelAdmin && !isWorkspaceAdimin) ? true : false} onClick={()=>this.showAllUpdatesButtonToggle(true)} type={(this.state.showAllUpdatesInThread)?"primary":"secondary"}  > Show All Updates</Button> &nbsp;&nbsp;
                      <Button disabled={(!isChannelAdmin && !isWorkspaceAdimin) ? true : false} onClick={()=>this.showAllUpdatesButtonToggle(false)} type={(this.state.showAllUpdatesInThread)?"secondary":"primary"} > Show Comments</Button>            */}
                    </Panel>

                    {channel_type === 'support' && (
                      <Panel
                        header='Request CSAT feedback'
                        key='3'
                        extra={
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <Switch
                              disabled={this.state.currentChannelConfigs ? !isChannelAdmin : false} // If currentChannelConfig is not present, no need to disable.
                              checked={!this.state.disable_CSAT_feedback}
                              onChange={this.on_CSAT_switch_change}
                              loading = {this.state.loading}
                            />
                          </div>
                        }
                      >
                        <Paragraph type='secondary'>
                          Send the requestor a private message requesting for feedback when their request is closed.{" "}
                        </Paragraph>
                      </Panel>
                    )}

                    {
                      // isSupportChannel ? (
                      // <Panel
                      //   header='Auto create tickets'
                      //   key='4'
                      //   extra={
                      //     <div
                      //       onClick={(e) => {
                      //         e.stopPropagation();
                      //       }}
                      //     >
                      //       <Switch
                      //         disabled={this.state.currentChannelConfigs ? !isChannelAdmin : false} // If currentChannelConfig is not present, no need to disable.
                      //         checked={this.state.auto_create_issue}
                      //         onChange={this.onAutoCreateIssueChanged}
                      //         loading = {this.state.loading}
                      //       />
                      //     </div>
                      //   }
                      // >
                      //   <Paragraph type='secondary'>
                      //   Automatically create a new ticket for every message posted in this channel
                      //   </Paragraph>
                      // </Panel>) : (
                <Collapse.Panel
                  header={`Auto Create ${channel_type === 'support' ?"Ticket":"Issue"}`}
                  key="auto-create"
                  size="small"
                >
                  <Text type="secondary">
                          Automatically create a new {channel_type === 'support' ?"ticket":"issue"} for every message posted in
                          this<br></br> channel or when the {channel_type === 'support' ? "ticket" : "issue"} creation emoji is added to a
                    message in the channel.
                  </Text>
                  <br />
                  <br />
                          <Radio.Group value={this.state.auto_create_issue?1:(this.state.auto_create_issue_emoji?2:0)} onChange={this.onAutoCreateIssueChanged} disabled={this.state.currentChannelConfigs ? !isChannelAdmin : false}>
                    <Space direction="vertical">
                      <Radio value={0}>Disabled</Radio>
                      <Radio value={1}>For every message posted</Radio>
                      <Radio value={2}>On issue creation emoji</Radio>
                    </Space>
                  </Radio.Group>
                  <br /><br />
                  <Text type="warning">Automatic {channel_type === 'support' ?"ticket":"issue"} creation in this channel will work only when "summary" is the only mandatory field in the default {channel_type === 'support' ?"request":"issue"} type.</Text>
                </Collapse.Panel>


                        
                      // <Panel
                      //   header='Auto create issues'
                      //   key='4'
                      //   extra={
                      //     <div
                      //       onClick={(e) => {
                      //         e.stopPropagation();
                      //       }}
                      //     >
                      //       {/* <Switch
                      //         disabled={this.state.currentChannelConfigs ? !isChannelAdmin : false} // If currentChannelConfig is not present, no need to disable.
                      //         checked={this.state.auto_create_issue}
                      //         onChange={this.onAutoCreateIssueChanged}
                      //         loading={this.state.loading}
                      //       /> */}
                      //     </div>
                      //   }
                      // >
                      //   <Paragraph type='secondary'>
                      //     Automatically create a new issue for every message posted in this channel
                      //   </Paragraph>
                      // </Panel>
                      // )
                      
                      
                      }
                    {(channel_type === 'support')&& <Collapse.Panel
                      header="Guest Facilitation"
                      key="guest"
                      size="small"
                    >
                      <Text type="secondary">
                        <a
                          onClick={() => {
                            Modal.info({
                              title: 'Guest facilitation scenarios',
                              content: (
                                <div>
                                  <p>
                                    Guest facilitation will be triggered in the
                                    following scenarios
                                  </p>
                                  <p>
                                    1. When auto create issues is enabled and
                                    unverified users post messages in the channel or
                                    add the issue creation emoji to a message in the
                                    channel
                                  </p>
                                  <p>
                                    2. When thread sync is enabled and an unverified
                                    user posts message in the thread
                                  </p>
                                </div>
                              ),
                              
                            });
                          }}
                        >
                          In guest facilitation scenarios
                        </a>
                        , Troopr can facilitate specific Jira actions for<br/> users who
                        have not verified their Jira account yet. This feature can
                        be<br/> activated by authorizing a facilitator account below
                      </Text>
                      <br />
               
                      {currentChannelConfigs && currentChannelConfigs.guestToken && currentChannelConfigs.guestToken.user_obj&&<Text>
                        Facilitator account: {currentChannelConfigs.guestToken.user_obj.displayName||currentChannelConfigs.guestToken.user_obj.name ||currentChannelConfigs.guestToken.user_obj.emailAddress}
                      </Text>}
                      <br />
                      {!(currentChannelConfigs && currentChannelConfigs.guestToken) && <Button  type="primary" onClick={() => this.goToUserJiraLogin()}> Authorize</Button>}
                      {(currentChannelConfigs && currentChannelConfigs.guestToken) && <>
                      <br/>
                        <Button  danger onClick={this.removeGuestAuthorizationConfirm} > Remove Authorization</Button></>}
                      <br />
                      <br />
                    </Collapse.Panel>
                  }
                    
                  </Collapse>
                </div>
              </Col>
              <Col span={12}>         
              {(channel_type === 'project' || channel_type === 'agent') && this.state.linkedProject && <IssueCardCustomization projectId={this.state.linkedProject} linkedIssue={this.state.linkedIssue} channelAdmin={this.state.isChannelAdmin} workspaceAdmin={this.props.isWorkspaceAdimin} />}

                <ProjectRestriction userChannels = {this.props.userChannels} isChannelAdmin = {this.state.isChannelAdmin}/>
              </Col>
              {/* {!isSupportChannel && <Col span={12}>
              <Collapse size="small">
                <Collapse.Panel
                  header="Issue Card Display Customization"
                  key="4"
                  size="small"
                >
                  <div className="card-container">
                    <Tabs 
                      tabBarExtraContent={<Button onClick={this.onReset}>Reset</Button>}
                      onTabClick={this.onViewChange}
                    >
                      <TabPane

                        tab={
                          <span>
                            <ExpandAltOutlined />
                            Detailed View
                          </span>
                        }
                        key="1"
                      >
                        <div
                          style={{
                            marginBottom: "10px",
                            paddingBottom: "10px",
                            borderBottom: "1px solid #ddd5d5"
                          }}
                        >
                          <div style={{marginBottom: "5px"}}><Text type="secondary">Preview:</Text></div>
                          <IssueCard isCompact={false} showDescription={this.state.showDescription} selectedAttributesDetailed={this.state.fieldsSelectedDetailed.map(config => config.field)} />
                        </div>
                          <div style={{ marginBottom: "10px", borderBottom: "1px solid rgb(221, 213, 213)", paddingBottom: "10px" }}>
                          <Text
                            type="secondary"
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-between"
                            }}
                          >
                            Show Description
                            <Switch checked={this.state.showDescription} onChange={this.descriptionToggle}/>
                          </Text>
                        </div>
                        <div>
                          <Table
                            pagination={false}
                            showHeader={true}
                            columns={this.columns}
                            dataSource={dataSourceForAttributesList}
                          />
                        </div>
                      </TabPane>
                      <TabPane
                        tab={
                          <span>
                            <ShrinkOutlined />
                            Compact View
                          </span>
                        }
                        key="2"
                      >
                        <div
                          style={{
                            marginBottom: "10px",
                            paddingBottom: "10px",
                            borderBottom: "1px solid #ddd5d5"
                          }}
                        >
                          <IssueCard isCompact={true} selectedField={this.state.fieldSelectedCompact && this.state.fieldSelectedCompact.field}/>
                        </div>
                          <div style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between"
                          }}>
                            <Text
                              type="secondary"

                            >
                              Attribute to show: <Tooltip title={`When this field is not available, "Status" field will be used as fallback.`}><QuestionCircleOutlined /></Tooltip>
                          </Text>
                            <Select
                              style={{ width: "60%" }}
                              value={this.state.fieldSelectedCompact && this.state.fieldSelectedCompact.field.name}
                              // defaultValue={this.state.fieldSelectedCompact && this.state.fieldSelectedCompact.field.name}
                              onSelect={this.onCompactFieldsSelect}
                              showSearch
                            >
                              {this.state.allFieldsInJira.map(field => {
                                return <Option key={field.id} value={field.name}>{field.name}</Option>
                              })}
                            </Select>
                          </div>
                      </TabPane>
                    </Tabs>
                  </div>
                </Collapse.Panel>
              </Collapse>
              </Col>} */}
              {/*----------------------------Channel Preference ends-------------------------*/}

              <Modal visible={this.state.setFieldValueModal} onCancel={this.toggleSetFieldValueCancel} onOk={this.toggleSetFieldValueOk}>
                {this.setFieldValueBody()}
              </Modal>
              <Button type="primary" danger style={{marginLeft:'auto',paddingRight:'8px',marginTop:'10px',marginRight:'7px'}} onClick={() => this.deleteConfiguration(channel_data)}>Delete Channel Configuration</Button> 
            </Row>
          </div>
        ) : (
          <div>
            <JiraChannelPreferences
              // skillView={this.props.skillView}
              // skill={this.props.assistant_skills}
              {...this.props}
              workspace_id={this.props.match.params.wId}
            />
          </div>
        )}
      </Content>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    projects: state.skills.projects,
    issues: state.skills.issues,
    channelDefault: state.skills.channelDefault,
    // assistant_skills: state.skills,
    cardTemplates: state.cards.templateCards,
    commonChanneldata: state.skills.commonChanneldata,
    user_now: state.common_reducer.user,
    members: state.skills.members,
    channels: state.skills.channels,
    isWorkspaceAdimin: state.common_reducer.isAdmin,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    setDefaultChannel,
    getDefaultChannel,
    getIssues,
    getProject,
    getAssisantSkills,
    getJiraBoards,
    deleteDefaultChannel,
    deleteChannelConfigurations,
    getServiceDeskProject,
    channelAdminConfig,
    updateChannelCommonData,
    searchJiraProjects,
    creatorAsAssignee
  })(JiraChannelPreference)
);