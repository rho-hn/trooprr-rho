import React, { Component } from "react";
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
  getSkillUser,
  userChannelNotifications,
  getJiraChannelPreferencePageData,
  
  updateChannelCommonData,
  getConfluenceChannelConfigs,
  deleteConfluenceChannelConfig,
  createNewChannel,
  checkChannelConfigs
} from "../skills_action";
import {
  Button,
  Select,
  Card,
  Row,
  Col,
  Alert,
  Table,
  Dropdown,
  Menu,
  notification,
  Layout,
  Typography,
  Modal,
  Radio,
  Space,
  message,
  Popconfirm,
  Input
} from "antd";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import axios from "axios";
import ConfluenceChannelPreference from "./channel_config";
import queryString from 'query-string';
import { CopyOutlined, PlusCircleOutlined,DeleteOutlined, WarningOutlined } from '@ant-design/icons';
import IsSupportChannelModal from "../jira/isSupportChannelModal";


const { Option } = Select;
const { Content } = Layout;
const { Text } = Typography;

const wiki_channel_options = [
  { label: 'Existing Channel', value: 'existing_channel' },
  { label: 'New Channel', value: 'new_channel' },
];
class ConfluenceChannelPreferences extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
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
      // linkedChannelData: [],
      configuredChannels: [],
      getAdminChannels: [],
      jiraAdmin:this.props.currentSkill.jiraConnectedId == this.props.user_now._id ? true : false,
      personalConnected : false,
      isSupportChannel: false,
      openSupportChannelConfirmModal:false,
      viewSupportChannelConfirmMessage:false,
      isNewModalVisible: false,
      wiki_channel_value: 'existing_channel',
      new_channel_name:"troopr-wiki-demo",
      showLoading: false,
      errorText: "",
      wikiChannelLoadingButton: true,
      hidecreationofchannel:true,
      channelsLoading : false,
      wikiConfiguredChannelsCount: 0

    };
    this.onChangeChannel = this.onChangeChannel.bind(this);
    this.goToJiraNotifSetup = this.goToJiraNotifSetup.bind(this);
    this.updateSkill = this.updateSkill.bind(this);
    this.showChannelSetting = this.showChannelSetting.bind(this);
    this.textInput = React.createRef();
 
  }

 

  redirect = () => {
          this.setState({viewSupportChannelConfirmMessage:false,showChannelSetting:true})
      this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}?view=${this.props.skillView.view}&channel_name=${this.state.selectedChannelName}&channel_id=${this.state.selectedChannel}`)  
  }

  showChannelSetting() {
    const goToChannel = () => {
      this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}?view=${this.props.skillView.view}&channel_name=${this.state.selectedChannelName}&channel_id=${this.state.selectedChannel}`)
      this.setState({ new_channel_name: "", isNewModalVisible: false, showLoading:false})  
    }
    const {channel_configs} = this.props
    this.setState({
      showLoading:true
    });
    if (this.state.wiki_channel_value==="new_channel"&&!this.state.hidecreationofchannel) {
      this.props.createNewChannel(this.props.match.params.wId,this.state.new_channel_name||"troopr-wiki-demo").then(data => {
        if (data && data.success) {
         
          this.setState({ showLoading: false, new_channel_name: "", errorText: "", isNewModalVisible: false,selectedChannelName:data.channel.name,selectedChannel:data.channel.id })
          this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}?view=${this.props.skillView.view}&channel_name=${data.channel.name}&channel_id=${data.channel.id}`)
        }
        else {
         
          this.setState({ showLoading: false, errorText: (data&&data.message) || "Error While creating channel"})
        }
      
      })

     
    }
    else {
      const wiki_config = channel_configs.find(c => c.channel.id === this.state.selectedChannel)
      if(wiki_config) goToChannel()
      else {
        checkChannelConfigs(this.props.match.params.wId,{requiredData : ['channel_sync'],channel_id : this.state.selectedChannel}).then(res => {
          if(res.success){
            if(res.channelMeta.channel_sync_present) {
              message.error({
                style: {
                  width: '60vw',
                  margin:'auto'
                },
                content: (
                  <>
                    This channel is configured for channel sync. Delete the configuration first before proceeding, 
                    To delete the channel sync configuration, type '/t configure' in that channel and click "Delete".
                  </>
                ),
              }); 
              this.setState({showLoading: false})}
            else goToChannel()
          }
        })
      }
    }

    

  }



  personalConnectionNotification = () => {
    const key = `open${Date.now()}`;
    const link = (
      <a onClick={() => this.notificationClick(key)}>
        here
      </a>
    );
    const des = (
      <p>You need to verify your jira account in order to manage channel configurations. Verify your account by clicking {link}</p>
    );
    notification["error"]({
      message: "Cant configure channel preferences",
      description: des,
      key,
    });
    // Modal.error({
    //   title: "cant configure channel preferences",
    //   content:(<p>You need to verify your Jira account in order to manage channel configurations. Verify your account by clicking <a onClick={this.notificationClick}>here</a>.</p>)
    // })
  }

  disconnectOnClickModel = () => {
    this.setState({ disconnectModel: !this.state.disconnectModel });
  };

  componentDidMount() {
    // this.props.getProject(this.props.workspace_id);
    if(this.props.channels && this.props.channels.length === 0){
      this.setState({channelsLoading : true})
      this.props.getChannelList(this.props.match.params.wId).then(res => this.setState({channelsLoading : false, channels:this.props.channels}));
    }else this.setState({channels : this.props.channels})

    const isTokenisThere = this.props.currentSkill && this.props.currentSkill.metadata &&this.props.currentSkill && this.props.currentSkill.metadata.token_obj&&this.props.currentSkill.metadata.token_obj.userToken
    if(this.props.currentSkill && this.props.currentSkill.metadata && !isTokenisThere) {
      message.error('Token is not added.')
      this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}?view=connection`)
    }

   let isAdmin=false;
  
   if(this.props.skill&&this.props.skill&&this.props.skill.metadata&&this.props.skill.connected_by&&(this.props.user._id&&this.props.skill.connected_by.toString()===this.props.user._id.toString())){
isAdmin=true
   }
   if(this.props.isWorkspaceAdmin)isAdmin=true
  // console.log(this.props.getConfluenceChannelConfigs(this.props.match.params.wId, isAdmin))
    this.props.getConfluenceChannelConfigs(this.props.match.params.wId,isAdmin)
    this.props.getConfluenceChannelConfigs(this.props.match.params.wId,isAdmin, true).then((res) => {
      if(!!res.data.success) {
        this.setState({
          wikiConfiguredChannelsCount: res.data.configs
        })
      }
    })
    axios.get(`/bot/api/${this.props.match.params.wId}/wiki/configPicker`).then(res=>{
       this.setState({confluence_configs:res.data.configs})
       })
    // const channelCommonData = this.props.commonChanneldata.find(data => data.channel_id === this.props.skillView.channel_id) 
    if (this.props.skillView.channel_name) {
      this.setState({
        showChannelSetting: true,
        selectedChannelName: this.props.skillView.channel_name,
        selectedChannel: this.props.skillView.channel_id,
 
      });
    }
 
    if (this.props.history.location && this.props.history.location && this.props.history.location.state && this.props.history.location.state.openDefaultModal) {
      this.setState({ wiki_channel_value: "new_channel" }, () => {
        this.showNewModal()
})
   
    }
  }

  componentDidUpdate(prevProps){
    // console.log(this.props.location.search,prevProps.location.search)
    let qs = queryString.parse(window.location.search)
    if (this.props.location.search !== prevProps.location.search) {

      let isAdmin = false;

      if (this.props.skill && this.props.skill && this.props.skill.metadata && this.props.skill.connected_by && (this.props.user._id && this.props.skill.connected_by.toString() === this.props.user._id.toString())) {
        isAdmin = true
      }
      if (this.props.isWorkspaceAdmin) isAdmin = true

      this.props.getConfluenceChannelConfigs(this.props.match.params.wId, isAdmin)
      
      const channelCommonDataFound = this.props.commonChanneldata.find(data => data.channel_id === this.props.skillView.channel_id) 
      if(channelCommonDataFound) this.setState({isSupportChannel: channelCommonDataFound.isSupportChannel||false})
      this.setState({showChannelSetting : qs.channel_id ? true : false/*,isSupportChannel : channelCommonData ? channelCommonData.isSupportChannel||false : false*/})
      // ----- when coming back from a channels configuration page , we are updating the data
      if(!qs.channel_id && qs.view === 'channel_preferences') {
        this.getRequiredDatas()
      }
    }

    if( qs.channel_id && prevProps.commonChanneldata !== this.props.commonChanneldata){
      const channelCommonData = this.props.commonChanneldata.find(data => data.channel_id === this.props.skillView.channel_id) 
      this.setState({isSupportChannel:channelCommonData ? channelCommonData.isSupportChannel||false : false})
    }

    if(this.props.channels != prevProps.channels) this.setState({channels : this.props.channels})
  }

  getRequiredDatas = () => {
    const {team,match} = this.props
    const isGridWorkspace = team.bot && team.bot.meta && team.bot.meta.enterprise && team.bot.meta.enterprise.id ? true : false
    const currentSkillUserPromise = this.props.getSkillUser(this.props.match.params.wId,this.props.match.params.skill_id)
    this.setState({loading:true})
    Promise.all([currentSkillUserPromise,this.props.getJiraChannelPreferencePageData(match.params.wId,match.params.skill_id,isGridWorkspace,this.state.jiraAdmin)]).then((data) => {
      const currentSkillUser = data[0].data;
      if(currentSkillUser.skillUser && currentSkillUser.skillUser.token_obj && currentSkillUser.skillUser.token_obj.access_token){
        this.setState({personalConnected : true});
      }
      if(data[1].success) this.setState({configuredChannels: data[1].configuredChannels,channels:data[1].channelsList})
      this.setState({loading:false})
    });
  }



  onChangeChannel = (event, value) => {
   

    this.setState({
      selectedChannel: event,
      selectedChannelName: value.props.children
    });
  };

  goToJiraNotifSetup() {
    this.props.history.push(
      "/" +
        this.props.workspace_id +
        "/jira_notification_setup/" +
        this.props.skill._id +
        "?step=intial_setup"
    );
  }

  updateSkill(data) {
    this.props
      .updateSkill(this.props.skill._id, this.props.skill.workspace_id, data)
      .then(res => {
        this.setState({ disconnectModel: !this.state.disconnectModel });
        this.props.history.push(
          "/" +
            this.props.workspace_id +
            "/skill/jira/" +
            this.props.skill._id
        );
      });
  }

  updateSkillToggle = data => {
    this.props
      .updateSkill(this.props.skill._id, this.props.skill.workspace_id, data)
      .then(res => {});
  };

  onChangeSearch = event => {
    this.setState({ searchChannel: event.target.value });
  };
  notificationClick = (key) => {
    notification.close(key)
    this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}?view=personal_preferences`)
   }
  showSettings = (channelName, channel_id) => {

      this.setState(
        { selectedChannel: channel_id, selectedChannelName: channelName },
        () => {
          this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}?view=${this.props.skillView.view}&channel_name=${this.state.selectedChannelName}&channel_id=${this.state.selectedChannel}`)

        }
      );
    } 
    // this.props.setOption("jira_channel_pref",channel_id,channelName);
  

  onChange = (event, { newValue }) => {
    
    this.setState({
      value: newValue
    });
  };

  getAdminNames = (currentChannelConfigs) => {
    const {members} = this.props;
    let adiminNames = ''
    if(currentChannelConfigs){
      currentChannelConfigs.channel_admins.forEach((id,index) => {
        if(index<3){
          const user = members && members.find(mem => mem.user_id._id == id)
          if(user) adiminNames = adiminNames + `${user.user_id.displayName||user.user_id.name} `
        }
      })

      if(currentChannelConfigs.channel_admins.length > 3){
        adiminNames = adiminNames + ` and ${currentChannelConfigs.channel_admins.length -3} others`
      }
    }

    return adiminNames;

  }

  deleteChannelConfiguration = (channel_id, name) => {
    const channelFound = this.state.channels.find(channel => channel.id === channel_id)
    let isGridSharedChannel = false
    if (channelFound && channelFound.enterprise_id && channelFound.is_org_shared) isGridSharedChannel = true
      this.props.deleteConfluenceChannelConfig(this.props.match.params.wId,channel_id,this.props.match.params.skill_id,isGridSharedChannel).then(res => {
        if(res&&res.data&&res.data.success){
          message.success(`#${name} configurations deleted successfully`)
          this.setState({
            wikiConfiguredChannelsCount: parseInt(this.state.wikiConfiguredChannelsCount) > 0 ? parseInt(this.state.wikiConfiguredChannelsCount) - 1 : 0
          })
          
          this.setState({configuredChannels : this.state.configuredChannels.filter(d => d.id !== channel_id)})
        } else {
          message.error(`Error deleting #${name} configurations.`)
        }
      })
     
  }

  handleDeleteConfiguration = (record) => {
    let channel = record.channel;
    const { channel_configs, user_now, isWorkspaceAdmin } = this.props
    let isChannelAdmin = true
    const confluenceChannelData = channel_configs.find((channeldata) => channeldata.channel.id === channel.id)
    if (confluenceChannelData && "restrict_channel_config" in confluenceChannelData && confluenceChannelData.restrict_channel_config) {
      const userFound = confluenceChannelData && confluenceChannelData.channel_admins && confluenceChannelData.channel_admins.find(user => user.toString() === user_now._id.toString())
      if (userFound) isChannelAdmin = true
      else isChannelAdmin = false
    } else {
      isChannelAdmin = true;
    }

    if (isChannelAdmin || isWorkspaceAdmin) {
      this.deleteChannelConfiguration(channel.id, channel.name)
    }
    else {
     return  message.warning(`Channel configuration access restricted. Contact one of the channel admins (or workspace admins) for access: ${this.getAdminNames(confluenceChannelData)}`)
    }

 

}

  showNewModal = async() => {
    this.setState({ wikiChannelLoadingButton: true, isNewModalVisible: true, })
    let res = await axios.get(`/bot/api/${this.props.match.params.wId}/checkforchannelsmanagepermission?scopes=channels:manage`)
    if (res.data.success && res.data.scopeexists) {
      this.setState({ hidecreationofchannel: false }, () => {
        this.setState({
          
          new_channel_name: "troopr-wiki-demo",
          errorText: "",
          wikiChannelLoadingButton: false
        });
      })
    }
    else {
      this.setState({
        isNewModalVisible: true,
        new_channel_name: "",
        errorText: "",
        wikiChannelLoadingButton: false
      });
    }
  
   
  };

  handleCancel = () => {
    this.setState({
      isNewModalVisible: false,
      errorText: "",
      new_channel_name: "troopr-wiki-demo",
      wiki_channel_value: 'existing_channel',
      
    });
  };

  wiki_channel_onChange = (e) => {
    this.setState({
      wiki_channel_value: e.target.value,
    });
  };

  handleChannelName = (e) => {
    this.setState({new_channel_name:e.target.value})
  }

  render() {
    // const {channels,adminChannels, configuredChannels,loading,showChannelSetting} = this.state;
    const {channels} = this.props;
  //  console.log(channels) 
    const columns = [
      {
        title: 'Channel Name',
        dataIndex:["channel","name"],
        key: "_id",
        // className: "table-column",
       
        render: (text, record) => {
    
          return (
            <a
              className="table-link"
              onClick={() => {
                this.showSettings(record.channel.name, record.channel.id);
              }}
            >
              {record.channel.name}
            </a>
          );
        }
      },
      {
        title: 'Confluence Space(s)',
        dataIndex: 'spaces',
        key: 'spaces',
        render: (text, record) => {
          let spaces = []
        
          record.spaces.forEach(item => {
            spaces.push(item.name)
          });

          return (
            <div>{ spaces.length > 0 ? spaces.join() : "All Spaces"}</div>
          );
        }
      },
      {
        title: 'Auto-suggest',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => {
          if(record.auto_suggest){
            return (
              <div>Enabled</div>
            );
            }else{
              return (
                <div>Disabled</div>
              );
            }
        }
      },
      {
        title: '',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => {

          

          return (
            <>
              <Dropdown.Button
                type="link"
                onClick={() => {
                  this.showSettings(record.channel.name, record.channel.id);
                }}
                overlay={
                  <Menu>
                    <Popconfirm title={
                      <div> Are you sure you want to delete channel preferences for this channel?
                      </div>
                    } okText='Delete' okType='danger' placement='top' onConfirm={() => this.handleDeleteConfiguration(record)}>   <Menu.Item key="1" icon={<DeleteOutlined danger />}>
                        Delete Configuration
                      </Menu.Item></Popconfirm>

                   
                  </Menu>
                }
              >
                Configure
              </Dropdown.Button>
            </>
          )
        }
      },
   
 
    ];


    return (
        !this.state.showChannelSetting ? (
          <Layout style={{marginLeft:0}}>
            <Content
          className="site-layout-background"
          style={{ padding: '16px 16px 32px 16px', overflow: 'scroll' }}
        >
          <Modal
            title="Configure Wiki Channel"
            visible={this.state.isNewModalVisible}
            onOk={this.showChannelSetting}
              onCancel={this.handleCancel}
              confirmLoading={this.state.showLoading}
              okText="Configure"
              maskClosable={false}
              // onCancel = {() => this.setState({ showLoading: false, new_channel_name: "", isNewModalVisible: false})}
            >
              {
                this.state.wikiChannelLoadingButton ? <div>Loading...</div> : <div> {this.state.errorText && <><Alert message={this.state.errorText} type="error" />
                  <br /></>
                }
                  <Text type="secondary">
                    Select a Slack channel for automatic suggestions from Confluence Space(s). Troopr will automatically find matching Confluence pages for messages posted in configured channels.
                  </Text>
                  <br />
                  <br />
                  {!this.state.hidecreationofchannel && <> <Radio.Group
                    options={wiki_channel_options}
                    onChange={this.wiki_channel_onChange}
                    value={this.state.wiki_channel_value}
                    optionType="button"
                    buttonStyle="solid"
                  />
                    <br />
                    <br />
                  </>
                  }

                  {(this.state.wiki_channel_value === 'new_channel' && !this.state.hidecreationofchannel) ? (
                    <Input onChange={this.handleChannelName} defaultValue={this.state.new_channel_name} />
                  ) : (
                    <>
                      <Select
                        showSearch
                        placeholder="Select Channel"
                        style={{ width: "100%" }}
                        // value={this.state.selectedChannel}
                        onChange={this.onChangeChannel}
                        optionFilterProp="children"
                        loading={this.state.loading || this.state.channelsLoading}
                        filterOption={(input, option) =>
                          option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {

                          channels &&
                          channels.map((channel, index) => (
                            <Option
                              key={channel.id}
                              value={channel.id}
                              name={channel.name}
                            >
                              {channel.name}
                            </Option>
                          ))
                        }
                      </Select>
                    </>
                  )}


                  <br />
                  <br />
                  <Text type="warning">
                    For private channels, ensure Troopr is added to the channel first.
                    Type&nbsp;<i>/invite @troopr</i>&nbsp;in that channel to invite
                    Troopr Assistant.
                  </Text></div>
             }
          </Modal>
          <Row style={{ width: '100%', maxWidth: 1000 }} gutter={[16, 16]}>
            <Col span={24} style={{ display: 'flex' }}>
              <Card
                title={`Configured Channels (${this.state.wikiConfiguredChannelsCount})`}
                style={{ width: '100%' }}
                size="small"
                extra={
                  <Button  type="primary" icon={<PlusCircleOutlined />} onClick={this.showNewModal}>
                    Setup Wiki Channel
                  </Button>
                }
              >
                <Table
                  size="small"
                  dataSource={this.props.channel_configs.slice().reverse()}
                  columns={columns}
                />
              </Card>
            </Col>
            
          </Row>
        </Content>

          
          
       
          <IsSupportChannelModal 
          viewSupportChannelConfirmMessage={this.state.viewSupportChannelConfirmMessage} 
          onCancel={() => this.setState({viewSupportChannelConfirmMessage:false})} 
          // updateCommonData={() => this.updateCommonData()}
          onRadioChange = {(e) => this.setState({isSupportChannel:true})}
          isSupportChannel = {this.state.isSupportChannel}
          channel={{
            id: this.state.selectedChannel,
            name: this.state.selectedChannelName
          }}
          userChannels = {channels}
          // onApiCallFinish = {() => this.setState({viewSupportChannelConfirmMessage:false,showChannelSetting:true})}
          skillView={this.props.skillView}
          redirect={() => this.redirect()}
          />
          </Layout>
          
          
        ) : (
          /* !this.state.loading && */ <ConfluenceChannelPreference
            skillView={this.props.skillView}
            channel={{
              id: this.state.selectedChannel,
              name: this.state.selectedChannelName
            }}
            channel_name={this.state.selectedChannelName}
            skill={this.props.skill}
            setOption={this.setOption}
            userChannels = {channels}
            isSupportChannel = {this.state.isSupportChannel}
          />
        )
    );
  }
}
const mapStateToProps = state => {
  return {
    workspace: state.common_reducer.workspace,
    assistant_skills: state.skills,
    user: state.common_reducer.user,
    projects: state.skills.projects,
    statuses:state.skills.statuses,
    issues: state.skills.issues,
    channelDefault: state.skills.channelDefault,
    personalChannelDefault: state.skills.personalChannelDefault,
    user_now: state.common_reducer.user,
    skills:state.skills.skills,
    team: state.skills.team,
    currentSkill:state.skills.currentSkill,
    commonChanneldata: state.skills.commonChanneldata,
    isWorkspaceAdmin: state.common_reducer.isAdmin,
    members: state.skills.members,
    channels:state.skills.channels,
    channel_configs: state.skills.confluence_channel_configs,

  };
};

export default withRouter(
  connect(mapStateToProps, {
    getSkillConnectUrl,
    updateSkill,
    getChannelList,
    setDefaultChannel,
    getDefaultChannel,
    getIssues,
    getProject,
    personalSetting,
    getAssisantSkills,
    getSkillUser,
    userChannelNotifications,
    getJiraChannelPreferencePageData,
    updateChannelCommonData,
    getConfluenceChannelConfigs,
    deleteConfluenceChannelConfig,
    createNewChannel
  })(ConfluenceChannelPreferences)
);
