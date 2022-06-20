import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  getChannelList,
  getIssues,
  getProject,
  getSkillData,
  getSkillUser,
  getTeamData,
  getJiraBoards,
  getServiceDeskProject,
  // getCommonData,
  searchJiraProjects,
  // checkChannelConfigs,
} from "../../skills_action";
import { getWorkspace } from "../../../common/common_action";
import axios from "axios";
import "./jirasteps.css";
import { Form } from "@ant-design/compatible";
import "@ant-design/compatible/assets/index.css";
import { Select, Checkbox, Typography, notification, Alert, Modal, Button, message } from "antd";
import queryString from "query-string";
const { Title, Text } = Typography;
const { Option } = Select;
class JiraDefaults extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialStateValues();
  }

  initialStateValues = () => {
    return {
      issueType: {},
      requestType : {},
      project: {},
      channel: {},

      loading: false,
      field_error: false,
      autoCreateFields: {
        statusReport: false,
        missingupdates: false,
        standup: false,
        notification: true,
      },
      timezone: "",
      loadBoard: false,
      boardId: {},
      channelsLoading: false,
      channel_already_configured_error: false,
      channel_sync_present_error: false,
      parsedQueryString : {}
    };
  };
  componentDidMount() {
    this.props.shareMethods(this.handleSubmit.bind(this));
    let parsedQueryString = queryString.parse(this.props.location.search);
    if(parsedQueryString && !parsedQueryString.sub_skill && !this.props.match.params.sub_skill) {
      message.error('Error setting defaults')
      this.props.history.push(`/${this.props.match.params.wId}/dashboard`)
      return;
    }
    // this.props.default_type === 'support_channel' ? this.props.getServiceDeskProject(this.props.match.params.wId, this.props.skill_id) : this.props.getProject(this.props.match.params.wId);
    this.setState({parsedQueryString}, () => this.getProjectData())
    // this.getProjectData();

    if(this.props.newChannelType){} else this.props.getSkillData(this.props.skill_id);

    // if (this.props.channels && this.props.channels.length === 0) {
    //   this.setState({ channelsLoading: true });
    //   this.props.getChannelList(this.props.match.params.wId).then((res) => {
    //     // this.setState({channelsLoading : false})
    //     // this.getCommonData(res.data.channels);
    //   });
    // }
    if (!this.props.workspace._id) {
      this.props.getWorkspace(this.props.match.params.wId).then((res) => {
        this.setState({ timezone: this.props.workspace.timezone });
      });
    }
    if (this.props.data.channelInfo) {
      this.setState({
        channel: {
          name: this.props.data.channelDefaults.channelName,
          id: this.props.data.channelDefaults.id,
        },
      });
    }

    if (this.props.data.linking.done) {
      this.setState({ ...this.state, ...this.props.data.linking });
    }
  }

  getCommonData = (channels) => {
    const { team } = this.props;
    const jiraAdmin = true;
    const isGridWorkspace = team.bot && team.bot.meta && team.bot.meta.enterprise && team.bot.meta.enterprise.id ? true : false;
    const channel_ids = jiraAdmin ? false : channels.map((channel) => channel.id);
    const sharedChannels = isGridWorkspace ? channels.filter((channel) => channel.is_org_shared) : false;
    let sharedChannel_ids = false;
    if (sharedChannels) sharedChannel_ids = sharedChannels.map((channel) => channel.id);
    this.props
      .getCommonData(this.props.match.params.wId, this.props.skill_id, jiraAdmin, isGridWorkspace, channel_ids, sharedChannel_ids)
      .then((res) => {
        if (res.success) this.setState({ channelsLoading: false });
      });
  };

  componentDidUpdate(prevProps) {
    const { default_type } = this.props;
    if (default_type !== prevProps.default_type) {
      this.setState({ ...this.initialStateValues() });
      this.resetFormFieldValues();
      this.setState({ loading: true, channelsLoading: true });
      /* again getting the common data to handle configred support channel in last step */
      // this.getCommonData(this.props.channels);
      // this.props.getProject(this.props.match.params.wId).then(res => {
      //   if(res.data.success) this.setState({loading : false})
      // })
      this.getProjectData();
    }
  }

  getProjectData = () => {
    const { skills, default_type, newChannelType } = this.props;
    const { parsedQueryString } = this.state;
    let projectPromise = [];
    const jiraSkill = skills.find((skill) => skill.key === "jira");

    let isFromJiraConnectionOnboarding = true
    if(newChannelType || (parsedQueryString && parsedQueryString.from === 'setup_demo_channel_button')) isFromJiraConnectionOnboarding = false

    if (jiraSkill && jiraSkill.skill_metadata.metadata && jiraSkill.skill_metadata.metadata.server_type) {
      const server_type = jiraSkill.skill_metadata.metadata.server_type;
      if (default_type === 'helpdesk_channels' || newChannelType === 'support' || newChannelType === 'agent' ) {
        projectPromise.push(this.props.getServiceDeskProject(this.props.match.params.wId, this.props.skill_id, /* isFromPersonalPref */ false, isFromJiraConnectionOnboarding));
      }
      // else if (default_type === "agent_channel") {
      //   if (server_type === "jira_server_oauth" || server_type === "jira_server") {
      //     projectPromise.push(this.props.getProject(this.props.match.params.wId));
      //   } else {
      //     projectPromise.push(this.props.searchJiraProjects(this.props.match.params.wId, "?query=typeKey=service_desk"));
      //   }
      // } 
      else {
        projectPromise.push(this.props.getProject(this.props.match.params.wId, isFromJiraConnectionOnboarding));
      }
    }

    Promise.all(projectPromise).then((res) => {
      if (res[0].data ? res[0].data.success : res[0].success) this.setState({ loading: false });
    });
  };

  // componentDidUpdate(prevProps) {
  //   if (
  //     !prevProps.projects ||
  //     prevProps.projects.length === 0 ||
  //     prevProps.projects.length !== (this.props.projects && this.props.projects.length)
  //   ) {
  //     this.props.getProject(this.props.match.params.wId)
  //   }
  // }

  // onChange(value, data, type) {
  //   console.log("====>1")

  //   this.setState({ [type]: { name: data.props.children, id: value } });
  //   if (type == "project") {
  //     this.props.getIssues(this.props.match.params.wId, value);
  //     this.setState({
  //       issueType: {},
  //       project:{name:data.props.projKey,id:value}
  //     });
  //   }
  // }
  onChange(value, data, type) {
    const { setFieldsValue } = this.props.form;
    const { default_type, newChannelType } = this.props;

    this.setState({ [type]: { name: data ? data.props.children : "", id: value ? value : "" } }, () => {
      if (type === 'project' && (this.props.default_type === "helpdesk_channels"  || newChannelType === 'support' )) {
        let temp = this.state.project;
        temp.service_desk_id = data.key;
        this.setState({ project: temp });
      }
    });
    // console.log("type===>",type)
    if (type === "channel") {
      // console.log("====>1")

      this.setState({ project: {}, channel_already_configured_error: false, channel_sync_present_error: false });
      setFieldsValue({ project: null, issue_type: null });

      if(newChannelType) this.props.updateSelectedChannel({name : data.props.children,id: value});
    }

    if (type == "project") {
      this.props.getIssues(
        this.props.match.params.wId,
        value,
      );

      if(default_type === 'helpdesk_channels' || newChannelType === 'support') {
        this.props.getIssues(
          this.props.match.params.wId,
          data.key,
          true,
          false,
          true /* isFromJiraOnboarding */
        );
      }

      this.setState({
        issueType: {},
        requestType : {},
        project: { name: data.props.children, id: value },
        loadBoard: true,
      });

      // if (this.props.default_type !== "support_channel") {
      //   let query = "projectKeyOrId=" + value;
      //   this.props.getJiraBoards(this.props.match.params.wId, query).then((res) => {
      //     this.setState({ loadBoard: false });
      //   });
      // }

      setFieldsValue({ issue_type: null, boardId: null, request_type : null });
    }
  }

  onCheckBoxChange = (e) => {
    this.setState({
      autoCreateFields: {
        ...this.state.autoCreateFields,
        [e.target.name]: e.target.checked,
      },
    });
  };
  handleSubmit() {
    const { default_type, projects,newChannelType ,commonChanneldata } = this.props;

    this.props.form.validateFields((err, values) => {
      if (!err) {
        let autoCreateFields = { ...this.state.autoCreateFields };
        if (default_type === "project_channel" || newChannelType === 'project' || newChannelType === 'agent' ) {
          autoCreateFields = {
            statusReport: false,
            missingupdates: false,
            notification: this.state.autoCreateFields.notification,
            standup: false,
          };
        } else if (default_type === "helpdesk_channels") {
          autoCreateFields = {
            statusReport: false,
            missingupdates: false,
            notification: this.state.autoCreateFields.notification,
            standup: false,
          };
        } else if (default_type === "reports_channel") {
          autoCreateFields = {
            // statusReport: this.state.autoCreateFields.statusReport,
            statusReport: true,
            missingupdates: this.state.autoCreateFields.missingupdates,
            notification: false,
            standup: false,
          };
        } else if (default_type === "support_channel" || newChannelType === 'support') {
          autoCreateFields = {
            statusReport: false,
            missingupdates: false,
            notification: false,
            standup: false,
          };
        }

        this.setState({ loading: true, field_error: false, autoCreateFields }, () => {
          let data = this.state;
          data.onboarding_from = newChannelType ?  'channel_preference_page' : 'webapp_jira_onboarding'
          data.app = "Jira";
          data.skill_id = this.props.skill_id;
          data.timeZone = this.props.workspace.timezone;
          data.onboarding_type = default_type;
          // let board = this.props.boards.find((board) => board.id == this.state.boardId.id);
          // data.board = board;
          if (default_type === "helpdesk_channels" || newChannelType === 'support') {
            // data.channel_type = "support";
            data.projectData = projects.find((p) => p.projectId === this.state.project.id);
          } else delete data.projectData;
          if (newChannelType ? ((newChannelType === 'agent' || newChannelType === 'project') ? (this.state.project.id && this.state.issueType.id) : (this.state.project.id && this.state.requestType.id) ) : (default_type === "reports_channel" ? this.state.project.id : default_type === 'helpdesk_channels' ? (this.state.requestType.id && this.state.issueType.id && this.state.project.id) : (this.state.issueType.id && this.state.project.id))) {
            if (default_type === "project_channel") data.channel_type = "project";
            // else if (default_type === "agent_channel") data.channel_type = "agent";

            if(newChannelType) data.channel_type = newChannelType

            this.setState({ loading: false });
            this.props.setLoadingState(true /* loading */)
              axios.post("/bot/api/workspace/" + this.props.match.params.wId + "/setChannelDefault", data).then((res) => {
                if (res.data.success) {
                  this.props.data.linking = {
                    done: true,
                    issueType: { ...this.state.issueType },
                    requestType : {...this.state.requestType},
                    project: { ...this.state.project },
                    channel: res.data.channel ? { ...res.data.channel } : {},
                    helpdeskChannels : res.data.helpdeskChannels ? {...res.data.helpdeskChannels} : {},
                    autoCreateFields: { ...this.state.autoCreateFields },
                    checkbox: { ...this.state.checkbox },
                    info : res.data.info ? res.data.info : null
                    // board,
                  };
                  this.props.setLoadingState(false /* loading */)
                  this.props.moveToNextStep();
                  // this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.data.skill_id}`)
                }
              });
          } else {
            this.setState({ loading: false, field_error: true });
          }
        });
      } else {
        this.props.linkProjectErrorMessageHandle(err);
      }
    });
  }

  resetFormFieldValues = () => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ issue_type: null, request_type:null, boardId: null, channelDataInfo: null, project: null });
  };

  render() {
    const { projects, issueTypes, requestTypes, default_type, newChannelType } = this.props;
    const { getFieldDecorator } = this.props.form;

    let header_1, header_2, header_3=null,channel_select_label= newChannelType ? 'Select Channel' : '';

    if (default_type === "project_channel") {
      header_1 = "Setup Demo Project Channel";
      header_2 = "This action will setup a demo project channel #demo-troopr-project\nAutomatic issue creation in “Project” channel will work only when summary is the only mandatory field in the issue type";
    } 
    else if (default_type === 'helpdesk_channels'){
      header_1 = "Setup Demo HelpDesk Channels";
      header_2 =
        "This action will setup 2 demo channels";
      header_3 = '1)#demo-troopr-support: Public "Support" channel for employees to submit requests\n2) #demo-troopr-agent: Private "Agent" channel for helpdesk team to triage new tickets\nAutomatic ticket creation in “Support” channel will work only when summary is the only mandatory field in the request type'
    }
    // else if (default_type === "support_channel") {
    //   header_1 = "Setup Demo HelpDesk Channels";
    //   header_2 =
    //     "This action will setup 2 demo channels";
    //   header_3 = '1)#demo-troopr-support: Public "Support" channel for employees to submit requests\n2) #demo-troopr-agent: Private "Agent" channel for helpdesk team to triage new tickets'
    //   channel_select_label = "Select Support Channel";
    // } else if (default_type === "agent_channel") {
    //   header_1 = "Setup Jira Helpdesk Agent Channel";
    //   header_2 =
    //     "Setup a Slack channel where agents will triage tickets. New tickets created in the linked project will be notified in this channel along with 2 way sync between Slack channel conversation and the ticket comments.";
    //   channel_select_label = "Select Agent Channel";
    // } 
    else if (default_type === "reports_channel") {
      header_1 = "Setup Demo Report";
      header_2 = "This action will create a demo report (issues by status chart) for the selected project and publish it to #demo-troopr-report channel";
    }

    const formStyle = newChannelType ? {width : '100%'} : { width: "40%", margin: "0 auto", textAlign: "left", marginTop: "-15px" }

    return (
      <div /* style={{height:'45vh'}} */>
        {!newChannelType &&<>
        <Title level={2}>{header_1}</Title>
        <Title level={5} type='secondary' style={{ /* textAlign: "left", */ whiteSpace:'pre-wrap',width: "70vw" }}>
          {header_2}
        </Title>
        {header_3 && <Text type='secondary' style={{whiteSpace:'pre-wrap'}}>{header_3}<br /></Text>}
        <br />
        </>}
        <Form
          style={formStyle}
          layout='vertical'
          // labelCol={{ span: 10 }}
          // wrapperCol={{ span: 8 }}
        >
          {/* !this.props.data.channelInfo */ newChannelType && <><Form.Item style={{ marginTop: "-15px" }}
          //  validateStatus={this.state.channel_already_configured_error || this.state.channel_sync_present_error ? "error" : ''}
          //  help={this.state.channel_already_configured_error ? "Selected channel already configured" : this.state.channel_sync_present_error ? "Channel sync configured" : '' }
           label={channel_select_label} className={localStorage.getItem('theme') == "dark" && "form_label_dark"}>
             {getFieldDecorator('channelDataInfo', {
               rules: [{ required: true, message: 'Channel is required' }],
               initialValue: this.state.channel.id
             })(<Select
               showSearch
               style={{ width: "100%" }}
               placeholder="Select a channel"
               optionFilterProp="children"
               onChange={(value, data) => this.onChange(value, data, "channel")}
               filterOption={(input, option) =>
                 option.props.children
                   .toLowerCase()
                   .indexOf(input.toLowerCase()) >= 0
               }
               loading = {this.props.loading}
             >
               {this.props.channels.map(item => (
                 <Option key={item.id} value={item.id}>
                   {item.name}
                 </Option>
               ))}
             </Select>)}
           </Form.Item>
           {this.state.channel_already_configured_error && <div style={{marginTop : "-30px", marginBottom:'9px'}} className="error-text" >*Selected channel already configured</div>}
           {this.state.channel_sync_present_error && <div style={{marginTop : "-30px", marginBottom:'9px'}} className="error-text" >*Channel sync configured</div>}
           </>
           }

          <Form.Item
            label={(default_type === 'helpdesk_channels' || newChannelType === 'support' || newChannelType === 'agent') ? "Select JSM Project" : "Select Jira Project"}
            className={localStorage.getItem("theme") == "dark" && "form_label_dark"}
          >
            {getFieldDecorator("project", {
              rules: [{ required: true, message: "Project is required" }],
              initialValue: this.state.project.id,
            })(
              <Select
                showSearch
                style={{ width: "100%" }}
                placeholder={(default_type === 'helpdesk_channels' || newChannelType === 'support' || newChannelType === 'agent') ? "type JSM Project" : "type Jira project"}
                optionFilterProp='children'
                onChange={(value, data) => this.onChange(value, data, "project")}
                loading={this.state.loading}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {projects && (newChannelType ? ((newChannelType === 'project') ? projects.filter(p => p.projectTypeKey === 'software') : projects) : ((default_type === 'helpdesk_channels' || default_type === 'reports_channel') ? projects :  projects.filter(p => p.projectTypeKey === 'software'))).map((item) => (
                  <Option
                    key={item.id}
                    value={(default_type === 'helpdesk_channels' || newChannelType === 'support' || newChannelType === 'agent')  ? item.projectId : item.id}
                    projKey={(default_type === 'helpdesk_channels' || newChannelType === 'support' || newChannelType === 'agent') ? item.projectKey : item.key}
                  >
                    {((default_type === 'helpdesk_channels' || newChannelType === 'support' || newChannelType === 'agent') ? item.projectName : item.name) +
                      ` (${(default_type === 'helpdesk_channels' || newChannelType === 'support' || newChannelType === 'agent') ? item.projectKey : item.key})`}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          {(default_type === 'helpdesk_channels' || newChannelType === 'support') && (
            <Form.Item label='Select default Request Type' className={localStorage.getItem("theme") == "dark" && "form_label_dark"}>
              {getFieldDecorator("request_type", {
                rules: [{ required: true, message: "Request Type is Required" }],
                initialValue: this.state.requestType.id,
              })(
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  placeholder='type request type'
                  optionFilterProp='children'
                  onChange={(value, data) => this.onChange(value, data, "requestType")}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {requestTypes.map((requestType) => (
                    <Option key={requestType.value} value={requestType.id}>
                      {requestType.text}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          )}
          {(default_type === "project_channel" || default_type === 'helpdesk_channels' || newChannelType === 'project' || newChannelType === 'agent') && (
            <Form.Item label='Select default Issue Type' className={localStorage.getItem("theme") == "dark" && "form_label_dark"}>
              {getFieldDecorator("issue_type", {
                rules: [{ required: true, message: "IssueType is Required" }],
                initialValue: this.state.issueType.id,
              })(
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  placeholder='type issue type'
                  optionFilterProp='children'
                  onChange={(value, data) => this.onChange(value, data, "issueType")}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {issueTypes.map((issueType) => (
                    <Option key={issueType.id} value={issueType.id}>
                      {issueType.text}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>)}
          {/* {(default_type === "project_channel" || default_type === "agent_channel") && this.props.boards && this.props.boards.length > 0 && (
            <Form.Item label='Select default Board (optional)' className={localStorage.getItem("theme") == "dark" && "form_label_dark"}>
              {getFieldDecorator("boardId", {
                // rules: [{ required: true, message: 'Board is required' }],
                initialValue: this.state.boardId.id,
              })(
                <Select
                  showSearch
                  allowClear
                  style={{ width: "100%" }}
                  placeholder='Select a Board'
                  onChange={(value, data) => this.onChange(value, data, "boardId")}
                  loading={this.state.loadBoard}
                  disabled={!(this.state.project && this.state.project.id)}
                >
                  {this.props.boards.map((board, index) => (
                    <Option key={index} name='boardId' value={board.id}>
                      {board.name + ` (${board.type})`}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          )} */}
        </Form>
        <div>
          {/* {default_type === "reports_channel" && (
            <>
              <Checkbox
                name='statusReport'
                onChange={this.onCheckBoxChange}
                checked={this.state.autoCreateFields.statusReport}
                // style={{ width : '50vw' }}
              >
                Create Issue By Status Report scheduled every weekday at 10:00 AM
              </Checkbox>
              <br />
              <br />
              <Checkbox
                name='missingupdates'
                onChange={this.onCheckBoxChange}
                checked={this.state.autoCreateFields.missingupdates}
                // style={{ width : '50vw', marginLeft : "0px" }}
              >
                Create Issue Missing Updates scheduled every weekday at 10:00 AM
              </Checkbox>
              <br />
              <br />
              <Alert
                style={{ width: "fit-content", margin: "auto" }}
                message={"You can add and/or customize scheduled reports and nudges for this channel anytime"}
              />
              <br />
            </>
          )} */}
          {/* {(default_type === "project_channel" || default_type === "agent_channel") && (
            <Checkbox
              name='notification'
              onChange={this.onCheckBoxChange}
              checked={this.state.autoCreateFields.notification}
              // style={{ width : '50vw' }}
            >
              Create Notifications from the default project every 15 min
            </Checkbox>
          )} */}
          {/* <Checkbox
              name="standup"
              onChange={this.onCheckBoxChange}
              checked={this.state.autoCreateFields.standup}
            >
              Create standup {this.state.channel.name} scheduled every weekday
              at 10:00AM
            </Checkbox> */}
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    channels: state.skills.channels,
    projects: state.skills.projects,
    issueTypes: state.skills.issues,
    requestTypes: state.skills.requestTypes,
    workspace: state.common_reducer.workspace,
    team: state.skills.team,
    boards: state.skills.jiraBoards,
    assistant_skills: state.skills,
    skills: state.skills.skills,
    commonChanneldata: state.skills.commonChanneldata,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    getChannelList,
    getWorkspace,
    getIssues,
    getProject,
    getSkillData,
    getSkillUser,
    getTeamData,
    getJiraBoards,
    getServiceDeskProject,
    // getCommonData,
    searchJiraProjects,
  })(Form.create({ name: "step_one" })(JiraDefaults))
);