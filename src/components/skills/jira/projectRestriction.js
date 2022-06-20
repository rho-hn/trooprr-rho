import React, { Component } from "react";
import { Select, Typography, Tooltip, Radio, Space, Button, Switch, Collapse, message } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { dropDownSearchJiraProjects, channelAdminConfig } from "../skills_action";
import queryString from "query-string";

const { Option } = Select;
const { Text } = Typography;

class ProjectRestriction extends Component {
  constructor(props) {
    super(props);
    this.timeout = 0;
    this.state = {
      editMode: false,
      projectRestriction: { ...this.initialProjectRestriction },
    };
  }

  initialProjectRestriction = {
    projectRestrictionDisabled: true,
    restriction_type: "block",
    selected_projects: [],
  };

  componentDidMount() {
    const { commonChanneldata } = this.props;
    const channelFound = commonChanneldata.find((data) => data.channel_id === queryString.parse(window.location.search).channel_id);
    if (channelFound && channelFound.projectRestriction) this.setState({ projectRestriction: channelFound.projectRestriction });
  }

  onSearch = (val) => {
    const { channel_type } = queryString.parse(window.location.search);
    if (
      this.props.currentSkill &&
      this.props.currentSkill.metadata &&
      (this.props.currentSkill.metadata.server_type === "jira_cloud_oauth" || this.props.currentSkill.metadata.server_type === "jira_cloud")
    ) {
      let query = `query=${val || ""}`;
      const queryType = channel_type === "agent" ? "&typeKey=service_desk" : "&typeKey=software";
      query = query + queryType;
      if (channel_type === "project" || channel_type === "agent") {
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.props.dropDownSearchJiraProjects(this.props.match.params.wId, `?query=${query}`);
        }, 300);
      }
    }
  };

  handleSwitch = (checked) => {
    const { projectRestriction } = this.state;
    let temp = { ...projectRestriction };
    temp.projectRestrictionDisabled = !checked;
    this.setState({ projectRestriction: temp }, () => this.updateCommonData("switch"));
  };

  handleChange = ({ type, value, option }) => {
    const { projectRestriction } = this.state;
    let temp = { ...projectRestriction };
    // if (type === "switch") temp.projectRestrictionDisabled = !value;
    if (type === "radio") temp.restriction_type = value;
    else if (type === "select") temp.selected_projects = option.map((o) => o.project);
    this.setState({ projectRestriction: temp });
  };

  updateCommonData = (from) => {
    const queryParams = queryString.parse(this.props.location.search);
    if (from !== "switch") this.setState({ apiLoading: true });
    //checking if it's enterprice shared channel or not
    const channelFound = this.props.userChannels.find((cha) => cha.id === queryParams.channel_id);
    let isGridSharedChannel = false;
    if (channelFound && channelFound.is_org_shared && channelFound.enterprise_id) {
      isGridSharedChannel = true;
      this.setState({ isGridSharedChannel: true });
    }
    this.props
      .channelAdminConfig(
        this.props.match.params.wId,
        this.props.match.params.skill_id,
        queryParams.channel_id,
        {
          channel: { id: queryParams.channel_id, name: queryParams.channel_name },
          projectRestriction: this.state.projectRestriction,
          ...queryParams,
        },
        isGridSharedChannel
      )
      .then((res) => {
        if (res.data.success) {
          if (from !== "switch") {
            message.success("Project restrictions updated!");
            this.setState({ apiLoading: false, editMode: false });
          }
          this.setState({ projectRestriction: res.data.channelCommonData.projectRestriction });
        }
      });
  };

  handleCancel = () => {
    const { commonChanneldata } = this.props;
    const channelFound = commonChanneldata.find((data) => data.channel_id === queryString.parse(window.location.search).channel_id);
    if (channelFound && channelFound.projectRestriction) this.setState({ projectRestriction: channelFound.projectRestriction });
    else this.setState({ projectRestriction: this.initialProjectRestriction });
    this.setState({ editMode: false });
  };

  render() {
    const { channel_type, channel_id } = queryString.parse(this.props.location.search);
    const { projects, isChannelAdmin, channelDefault, isWorkspaceAdmin } = this.props;
    const { projectRestriction, editMode, apiLoading } = this.state;
    let disabled = !editMode;
    let actionDisabled = !isWorkspaceAdmin && !isChannelAdmin
    let children = (
      channel_type === "support"
        ? projects
        : channel_type === "agent"
        ? projects.filter((proj) => proj.projectTypeKey === "service_desk")
        : projects.filter((proj) => proj.projectTypeKey === "software")
    ).map((d) => {
      let disabled = false;
      if (channelDefault && channelDefault.channel_id === channel_id)
        if (channelDefault.link_info && (channelDefault.link_info.project_id === d.id || channelDefault.link_info.project_id === d.projectId))
          disabled = true;

      return (
        <Option key={d.key || d.projectKey} value={d.id || d.projectId} name={d.name || d.projectName} project={d} disabled={disabled}>
          {`${d.name || d.projectName} ${`(${d.key || d.projectKey})`}`}
        </Option>
      );
    });
    children = children.filter((child) => child);
    return (
      <>
        <Collapse size='small' /* defaultActiveKey={"blockWhitelistProjects"} */>
          <Collapse.Panel
            header={
              <span>
                <span style={{ marginRight: 4 }}>Project Restrictions</span>
                <Tooltip title={`Limit access to projects when creating ${channel_type === 'support' ? 'tickets' : 'issues'} in this channel`}>
                  <InfoCircleOutlined />
                </Tooltip>
              </span>
            }
            extra={
              <Switch
                checked={!projectRestriction.projectRestrictionDisabled}
                onChange={(checked, e) => {
                  e.stopPropagation();
                  this.handleSwitch(checked);
                }}
                disabled={actionDisabled}
              />
            }
            key='blockWhitelistProjects'
            size='small'
          >
            {/* <Card
          title={
            <span>
              <span style={{ marginRight: 4 }}>Project Restrictions</span>
              <Tooltip title='Choose which projects to allow or block in issue====ticket creation form'>
                <InfoCircleOutlined />
              </Tooltip>
            </span>
          }
          extra={<Switch />}
          style={{ width: "100%" }}
          size='small'
        > */}
            <Radio.Group
              disabled={disabled}
              value={projectRestriction.restriction_type}
              onChange={(e) => this.handleChange({ type: "radio", value: e.target.value })}
            >
              <Space direction='vertical'>
                <Radio value={"block"}>
                  <Text type='secondary'>Block selected projects</Text>
                </Radio>
                <Radio value={"allow"}>
                  <Text type='secondary'>Allow only selected projects</Text>
                </Radio>
              </Space>
            </Radio.Group>
            <br />
            <br />
            <Text type='secondary' strong>
              Choose your projects
            </Text>{" "}
            <br />
            <Select
              style={{
                width: "100%",
              }}
              mode='multiple'
              showSearch
              autoClearSearchValue
              placeholder='Select projects'
              onSearch={this.onSearch}
              onChange={(value, option) => this.handleChange({ type: "select", value, option })}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              value={[...projectRestriction.selected_projects.map((p) => p.id || p.projectId)]}
              disabled={disabled}
              allowClear
            >
              {children}
            </Select>
            <br />
            <br />
            {(!actionDisabled) && (
              <>
                {editMode ? (
                  <>
                    <Button type='primary' loading={apiLoading} onClick={() => this.updateCommonData()} style={{ width: 100 }}>
                      Save
                    </Button>
                    <Button style={{ width: 100, marginLeft: 16 }} onClick={() => this.handleCancel()}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button style={{ width: 100 }} onClick={() => this.setState({ editMode: true })}>
                    Edit
                  </Button>
                )}
              </>
            )}
            {/* </Card> */}
          </Collapse.Panel>
        </Collapse>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    projects: state.skills.projects,
    currentSkill: state.skills.currentSkill,
    commonChanneldata: state.skills.commonChanneldata,
    channelDefault: state.skills.channelDefault,
    isWorkspaceAdmin: state.common_reducer.isAdmin
  };
};

export default withRouter(
  connect(mapStateToProps, {
    dropDownSearchJiraProjects,
    channelAdminConfig,
  })(ProjectRestriction)
);
