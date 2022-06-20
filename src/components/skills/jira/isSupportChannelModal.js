import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Modal, Select, Typography } from "antd";
import { getServiceDeskProject, getIssues, setDefaultChannel,updateChannelCommonData } from "../skills_action";
import _ from "lodash";

const { Text } = Typography;
const { Option } = Select;

export class isSupportChannelModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectLoading: false,
      requestTypeLoading: false,
      selectedProject: {},
      selectedRequestType: {},
      error: "",
    };
  }

  componentDidMount(){
    this.setState({ projectLoading: true });
    this.props.getServiceDeskProject(this.props.match.params.wId, this.props.match.params.skill_id).then((res) => {
      this.setState({ projectLoading: false });
    });
  }

  onOk = () => {
    const { selectedProject, selectedRequestType, error } = this.state;
    // if (this.props.isSupportChannel) {
      if (_.isEmpty(selectedProject)) this.setState({ error: "project" });
      else if (_.isEmpty(selectedRequestType)) this.setState({ error: "requestType" });
      else {
        //this.saveDefault();
        this.updateCommonData();
      }
    // } else {
    //   this.updateCommonData();
    // }
  };

  saveDefault = () => {
    const { issues, projects, userChannels } = this.props;
    const { selectedProject, selectedRequestType } = this.state;
    const channelId = this.props.channel.id;

    const channelFound = userChannels.find((cha) => cha.id === this.props.channel.id);
    let isGridSharedChannel = false;
    if (channelFound && channelFound.is_org_shared && channelFound.enterprise_id) {
      isGridSharedChannel = true;
    }

    let selectedProjectData = projects && projects.find((project) => project.projectId === selectedProject.value);
    var data = {
      link_info: {
        // project_id: selectedProject.key,
        project_id: selectedProject.value,
        project: selectedProjectData,
      },
    };
    const issueDataFound = this.props.issues.find((issue) => issue.value === selectedRequestType.value);
    if (issueDataFound) data.link_info.requestType = { name: issueDataFound.value, id: issueDataFound.id };

    if (selectedProjectData) {
      data.link_info.project_service_desk_id = selectedProjectData.id;
      data.link_info.project_name = selectedProjectData.projectName + ` (${selectedProjectData.projectKey})`;
    }

    data.channel_id = channelId;
    data.updated_by = localStorage.trooprUserId;
    data.skill_id = this.props.match.params.skill_id;
    data.channel=this.props.channel
    if (data.link_info.requestType && data.link_info.project_id && data.channel_id) {
      this.props.setDefaultChannel(this.props.match.params.skill_id, data, /*to handle "type" */ false, isGridSharedChannel).then((res) => {
        if (res.data.success) {
                this.props.redirect();
        }
      });
    }
  };

  updateCommonData = () => {
    const { channel } = this.props;

    // axios.post(`/bot/api/workspace/${this.props.match.params.wId}/updateChannelCommonData`,{
    //   channel_id : selectedChannel,
    //   skill_id: this.props.match.params.skill_id,
    //   isSupportChannel,
    //   isThreadSync:isSupportChannel ? true : false
    // })

    const data = {
      channel_id: channel.id,
      skill_id: this.props.match.params.skill_id,
      channel:this.props.channel,
      // isThreadSync: isSupportChannel ? true : false,
      isThreadSync: true,
      channel_type : 'support'
    };
    this.props.updateChannelCommonData(data, this.props.match.params.wId).then((res) => {
      if (res.success) {
        // if (this.props.isSupportChannel) {
          this.saveDefault()
        // } else {
        //   this.props.redirect();
        // }
      }
    });
    // .catch(err => {
    //     this.props.onApiCallFinish()
    //     this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}/?view=${this.props.skillView.view}&channel_name=${this.state.selectedChannelName}&channel_id=${this.state.selectedChannel}`)
    // })
  };

  handleRadioChange = (e) => {
    this.props.onRadioChange(e);
    this.setState({ projectLoading: true });
    this.props.getServiceDeskProject(this.props.match.params.wId, this.props.match.params.skill_id).then((res) => {
      this.setState({ projectLoading: false });
    });
  };

  handleProjectChange = (value, event) => {
    this.setState({ selectedProject: event, requestTypeLoading: true, selectedRequestType: {}, error: "" });
    this.props.getIssues(this.props.match.params.wId, event.key, true).then((res) => {
      this.setState({ requestTypeLoading: false });
    });
  };

  handleRequestTypeChange = (value, event) => {
    this.setState({ selectedRequestType: event, error: "" });
  };

  render() {
    const {viewSupportChannelConfirmMessage } = this.props;
    const { projectLoading, requestTypeLoading, selectedProject, selectedRequestType, error } = this.state;
    return (
      <Modal visible={viewSupportChannelConfirmMessage} okText='Manage' onOk={() => this.onOk()} onCancel={() => this.props.onCancel()}>
        <>
        {/* {!this.props.isSupportChannel ? ( */}
          {false ? (
            this.handleRadioChange(true)
          ) : (
            <>
              <Typography.Paragraph>
                This action will setup "support" channel for employees to submit requests with following defaults.
              </Typography.Paragraph>
              <Text strong>Default Project</Text>
              <br />
              <div className={error === "project" && "ant-form-item-has-error"}>
                <Select
                  style={{ width: 200 }}
                  placeholder='Select Project'
                  loading={projectLoading}
                  showSearch={true}
                  onChange={this.handleProjectChange}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {this.props.projects &&
                    this.props.projects.map((project, index) => (
                      // <Option key={project.id} value={isSupportChannel ? project.projectId : project.id}>
                      <Option key={project.id} value={project.projectId}>
                        {project.projectName + ` (${project.projectKey})`}
                      </Option>
                    ))}
                </Select>
                {error === "project" ? (
                  <>
                    <br />
                    <Text type='danger'>Select a project</Text>
                  </>
                ) : (
                  <>
                    <br />
                    <br />
                  </>
                )}
              </div>
              <Text strong>Default Request Type</Text>
              <br />
              <div className={error === "requestType" && "ant-form-item-has-error"}>
                <Select
                  style={{ width: 200 }}
                  value={selectedRequestType.value}
                  placeholder='Select Request Type'
                  loading={requestTypeLoading}
                  disabled={_.isEmpty(selectedProject)}
                  onChange={this.handleRequestTypeChange}
                >
                  {this.props.issues &&
                    this.props.issues.map((issue, index) => (
                      <Option key={issue.value} value={issue.value}>
                        {issue.text}
                      </Option>
                    ))}
                </Select>
                {error === "requestType" ? (
                  <>
                    <br />
                    <Text type='danger'>Select a Request Type</Text>
                  </>
                ) : (
                  <>
                    <br />
                    <br />
                  </>
                )}
              </div>
              <Text type='warning' >Automatic ticket creation in this channel will work only when "summary" is the only mandatory field in the default request type.</Text> 

            </>
          )}
        </>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  projects: state.skills.projects,
  issues: state.skills.issues,
});

export default withRouter(
  connect(mapStateToProps, {
    getServiceDeskProject,
    getIssues,
    setDefaultChannel,
    updateChannelCommonData
  })(isSupportChannelModal)
);
