import React, { Component } from 'react';
import {
  getChannelList,
  setDefaultChannel,
  getDefaultChannel,
  getIssues,
  getProject,
  personalSetting,
  getAssisantSkills,
  getSkillConnectUrl,
  updateSkill,
  getGitHubRepository
}
  from '../skills_action';
import { Button, Select, Card, Alert, Row, Col, Table, Typography, Layout } from 'antd';
import { getOrganistaionProject } from '../github/gitHubAction'
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import axios from "axios";
import Subscriptions from './Subscriptions/Subscriptions';
const { Option } = Select;
const {Content} = Layout
const { Paragraph } = Typography;
const queryString = require('query-string');

class Githubchannelpreferences extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      channels: [],
      projects: [],
      issues: [],
      defaultProject: '',
      defaultIssue: '',
      skillsToggle: false,
      notificationToggle: false,
      personalNotifToggle: false,
      preference: "channel",
      selectedChannel: '',
      selectedChannelName: '',
      selectedProject: '',
      currentSkill: this.props.match.params.skill_id,
      linkedProject: null,
      linkedIssue: null,
      personalProject: '',
      personalIssue: '',
      personalChannelId: '',
      edit: false,
      error: {},
      showChannelSetting: false,
      disconnectModel: false,
      searchChannel: '',
      value: '',
      suggestions: [],
      linkedChannelData: [],
      configuredChannels: [],
    }
    this.onChangeChannel = this.onChangeChannel.bind(this);
    this.goToJiraNotifSetup = this.goToJiraNotifSetup.bind(this);
    this.updateSkill = this.updateSkill.bind(this);
    this.showChannelSetting = this.showChannelSetting.bind(this);
    this.textInput = React.createRef();
  }

  //  handleClick= ()=> {

  //   this.props.history.push(`/${localStorage.getItem("userCurrentWorkspaceId")}/skill/github/notification_settings`)
  //  }



  showChannelSetting() {




    let path = window.location.pathname;

    let obj = {
      "title": this.props.skillView.view,
      "url": path + `?view=${this.props.skillView.view}&channel_name=${this.state.selectedChannelName}&channel_id=${this.state.selectedChannel}`
    }
    // console.log(obj)
    window.history.pushState(obj, obj.title, obj.url);


    this.setState({ showChannelSetting: true })
  }

  disconnectOnClickModel = () => {
    this.setState({ disconnectModel: !this.state.disconnectModel });
  }

  componentDidMount() {
    // console.log("channels array in github -> ", this.props.assistant_skills.channels);


    this.props.getOrganistaionProject(this.props.match.params.wId).then(data => {

      // console.log("component did mount: github_channel_preference",this.props.match.params.skill_id);
      this.setState({ loading: true })
      const search = window.location.search;
      // console.log("window.location.search: "+search);
      let parsed = queryString.parse(search);
      if ((parsed.view === "channel_preferences") && parsed.channel_id) {
        this.setState({ showChannelSetting: true, selectedChannel: parsed.channel_id, selectedChannelName: parsed.channel_name })
      }
      // if(search.split("?")[1]) {
      //   params_raw = search.split("?")[1].split("&");
      //   if(params_raw) {
      //     params_raw.forEach(e => {

      //     });
      //   }
      // }

      this.props.getProject(this.props.skill._id);
      //this.props.workspace_id
      // this.props.getChannelList(this.props.workspace_id);
      const channelListPromise = this.props.getChannelList(this.props.workspace_id);

      this.props.getGitHubRepository(this.props.workspace_id);
      axios.get('/bot/api/userChannelNotifications/' + this.props.workspace_id + '/' + this.props.match.params.skill_id).then(res => {
        this.setState({ linkedChannelData: res.data.data })
        let array = res.data.data
        // console.log("array========>",array);
        const unique_array = [];
        const map = new Map();
        for (const item of array) {
          if (!map.has(item.channel_id)) {
            map.set(item.channel_id, true);
            // let channelData= this.props.assistant_skills.channels.find((b)=>{return b.id==item.channel_id})
            // if(channelData){
            unique_array.push({
              channel_id: item.channel_id,
              channelName: item.channelName
            });
            // }
          }
        }

        this.setState({ configuredChannels: unique_array })
        this.setState({ loading: false })

      }).catch((e) => {
        this.setState({ loading: false });
        //  console.log(e)
        console.error(e)
      })
    })

  }


  onChangeChannel = (event, value) => {

    this.setState({ selectedChannel: event, selectedChannelName: value.props.children });
  }

  goToJiraNotifSetup() {
    this.props.history.push("/" + this.props.workspace_id + "/jira_notification_setup/" + this.props.skill._id + "?step=intial_setup")
  }


  updateSkill(data) {
    this.props.updateSkill(this.props.skill._id, this.props.skill.workspace_id, data).then(() => {
      this.setState({ disconnectModel: !this.state.disconnectModel });
      this.props.history.push("/" + this.props.workspace_id + "/skill/jira/" + this.props.skill._id)
    })
  }

  updateSkillToggle = (data) => {
    this.props.updateSkill(this.props.skill._id, this.props.skill.workspace_id, data).then(() => {
    })
  }


  showSettings = (channelName, channel_id) => {
    this.setState({ selectedChannel: channel_id, selectedChannelName: channelName },
      () => {
        this.showChannelSetting()

      })
  }


  onChangeSearch = (event) => {
    this.setState({ searchChannel: event.target.value });
  }


  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };
  render() {
    // console.log("channels array in github -> ", this.props.assistant_skills.channels);

    // console.log("configuredChannels -> ",this.state.configuredChannels);

    const { assistant_skills, skill } = this.props;
    // console.log("skills ", skill);
    const columns = [
      {
        title: 'Channel Name',
        dataIndex: 'channelName',
        key: 'channelName',
        className: "table-column",
        align: 'center',
        render: (text, record) => {
          return <a className="table-link" onClick={() => { this.showSettings(record.channelName, record.channel_id) }}>{record.channelName}</a>
        }
      },
    ];

    let organizationName;

    if (skill && skill.skill_metadata ? skill.skill_metadata.linked : skill.linked) {
      organizationName = skill && skill.skill_metadata ? skill.skill_metadata.metadata.installationInfo.account.login : skill.metadata.installationInfo.account.login
      // let time = skill.metadata && skill.metadata.installationInfo ? skill.metadata.installationInfo.created_at : ''

    }

    return (
      <Content style={{ padding: "16px 16px 32px 24px", overflow:'initial' ,marginLeft:50}}>
        {!this.state.showChannelSetting ?
          <Row className='content_row' gutter={[0, 16]}>
            <Col span={24}>
              <Card size='small' title="Configured Channels" loading={this.state.loading}>
                <Table className="ant-table-content card" bordered columns={columns} dataSource={this.state.configuredChannels} pagination={{ pageSize: 20 }} showHeader={false} />
              </Card>
            </Col>
            <Col span={24}>
              <Card size='small' title="Select Channel to Configure">
              <Paragraph type='secondary'>Customize notifications and Channel Defaults for channels. Select from public and private channels here. </Paragraph>
                <Row gutter={[8, 8]} type="flex" justify="start">
                  <Col span={10}>
                    <Select
                      showSearch
                      placeholder="Select Channel"
                      style={{ width: "100%" }}
                      // value={this.state.selectedChannel} 
                      onChange={this.onChangeChannel}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {assistant_skills.channels && assistant_skills.channels.map((channel) => (
                        <Option key={channel.id} value={channel.id} name={channel.name}>{channel.name}</Option>))}
                    </Select>
                  </Col>
                  <Col span={2}>
                    {this.state.selectedChannel ? <Button onClick={this.showChannelSetting} >Manage</Button> : <Button type="primary" disabled>Manage</Button>}
                    {/* {this.state.selectedChannel ? <Button className="common_pointer channel_btn " onClick={this.handleClick}>Manage</Button> : <Button type="primary" disabled className="common_pointer channel_btn  ">Manage</Button> } */}
                  </Col>
                </Row>
                <br />
                <Alert message="Make sure to add bot to your private channels first, /invite @troopr." type="info" showIcon />


              </Card>
            </Col>
            {/* <GithubdisplayChannel data={arr} showSettings={this.showSettings} /> */}

          </Row>
          :
          <div >
            {/* {
             this.props.orgName.length > 0 ? 
           } */}
            <Subscriptions skillView={this.props.skillView} channel_id={this.state.selectedChannel} channel_name={this.state.selectedChannelName} skill={this.props.skill} setOption={this.setOption} orgName={this.props.orgName} organizationName={organizationName} />

            {/* <GithubChannelNotification2 channelId={this.state.id} channel_name={this.state.name} skill={this.props.skill} setOption={this.setOption} /> */}
          </div>}

      </Content>
    )
  }
}
const mapStateToProps = state => {
  return {
    workspace: state.common_reducer.workspace,
    assistant_skills: state.skills,
    user: state.common_reducer.user,
    projects: state.skills.projects,
    issues: state.skills.issues,
    channelDefault: state.skills.channelDefault,
    personalChannelDefault: state.skills.personalChannelDefault,
    orgName: state.github.org_projects,
    skill: state.skills.currentSkill

  }
};

export default withRouter(connect(mapStateToProps, {
  getSkillConnectUrl, updateSkill,
  getChannelList,
  setDefaultChannel,
  getDefaultChannel,
  getIssues,
  getProject,
  personalSetting,
  getAssisantSkills,
  getGitHubRepository,
  getOrganistaionProject
})(Githubchannelpreferences));