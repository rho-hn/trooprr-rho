import React, { Component } from "react";
import {
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
  deleteChannelConfigurations,
  updateChannelCommonData,
  getChannelList,
  getCommonData,
  checkChannelConfigs
} from "../skills_action";
import {
  Button,
  Select,
  Card,
  Row,
  Col,
  Dropdown,
  Menu,
  Table,
  notification,
  Layout,
  Typography,
  Modal,
  message,
  Popconfirm,
  Tabs,
  Input,
  Space
} from "antd";
import Highlighter from "react-highlight-words";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import JiraChannelPreference from "./channel_preference";
import queryString from 'query-string';
import { PlusCircleOutlined,DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import IsSupportChannelModal from "./isSupportChannelModal";
import { getJiraConfigurationsCount } from "../skills_action";
import DefaultProjects from "./jiraConnectionFlow/defaultChannelSelection";

const { TabPane } = Tabs;
const { Option } = Select;
const { Content } = Layout;
const { Text } = Typography;
class JiraChannelPreferences extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
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
      openSupportChannelConfirmModal:false,
      viewSupportChannelConfirmMessage:false,
      tabName : "",
      isNewModalVisible: false,
      isNewSupportModalVisible : false,
      jiraConfiguredChannelsCountNormalChannel: 0,
      jiraConfiguredChannelsCountSupportChannel: 0,
      jiraConfiguredChannelsCountTotal: 0,
      checkingChannelConfigs : false,
      newChannelType : 'project',
      preferenceCreationLoading:false
    };
    this.onChangeChannel = this.onChangeChannel.bind(this);
    // this.goToJiraNotifSetup = this.goToJiraNotifSetup.bind(this);
    // this.updateSkill = this.updateSkill.bind(this);
    this.showChannelSetting = this.showChannelSetting.bind(this);
    this.textInput = React.createRef();
 
  }

  // updateCommonData = () => {
  //   const {isSupportChannel,selectedChannel} = this.state

  //   // axios.post(`/bot/api/workspace/${this.props.match.params.wId}/updateChannelCommonData`,{
  //   //   channel_id : selectedChannel,
  //   //   skill_id: this.props.match.params.skill_id,
  //   //   isSupportChannel,
  //   //   isThreadSync:isSupportChannel ? true : false
  //   // })

  //   const data = {
  //           channel_id : selectedChannel,
  //     skill_id: this.props.match.params.skill_id,
  //     isSupportChannel,
  //     isThreadSync:isSupportChannel ? true : false
  //   }
  //   this.props.updateChannelCommonData(data,this.props.match.params.wId).then(res => {
  //     this.setState({viewSupportChannelConfirmMessage:false,showChannelSetting:true})
  //     this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}/?view=${this.props.skillView.view}&channel_name=${this.state.selectedChannelName}&channel_id=${this.state.selectedChannel}`)  
  //   }).catch(err => {
  //     this.setState({viewSupportChannelConfirmMessage:false,showChannelSetting:true})
  //     this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}/?view=${this.props.skillView.view}&channel_name=${this.state.selectedChannelName}&channel_id=${this.state.selectedChannel}`)  
  //   })
  // }

  redirect = () => {
          this.setState({viewSupportChannelConfirmMessage:false,showChannelSetting:true})
      this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}/${this.props.match.params.sub_skill}?view=${this.props.skillView.view}&channel_name=${this.state.selectedChannelName}&channel_id=${this.state.selectedChannel}&channel_type=support`)  
  }

  showChannelSetting(data) {
    const {commonChanneldata} = this.props
    const {selectedChannel} = this.state
    

    if (this.state.personalConnected) {
      // let path = window.location.pathname;

      // let obj = {
      //   title: this.props.skillView.view,
      //   url:
      //     path +
      //     `?view=${this.props.skillView.view}&channel_name=${this.state.selectedChannelName}&channel_id=${this.state.selectedChannel}`,
      // };
      // // console.log(obj)
      // window.history.pushState(obj, obj.title, obaj.url);
      const jiraSkill = this.props.skills.find(skill => skill.name === 'Jira')
      const service_desk_sub_skill = jiraSkill && jiraSkill.skill_metadata ? jiraSkill.skill_metadata.sub_skills.find(ss => ss.key === 'jira_service_desk') : false
      // if(jiraSkill && jiraSkill.skill_metadata && jiraSkill.skill_metadata.isServiceDeskEnabled){
        if(service_desk_sub_skill && !service_desk_sub_skill.disabled){
      const channelData = commonChanneldata.find(data => data.channel_id === selectedChannel)
      if(channelData){
      this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}${this.props.match.params.sub_skill ? '/' + this.props.match.params.sub_skill :  '' }?view=${this.props.skillView.view}&channel_name=${this.state.selectedChannelName}&channel_id=${this.state.selectedChannel}&channel_type=${channelData.channel_type}`)
      this.setState({ showChannelSetting: true });
      }else {
        this.setState({viewSupportChannelConfirmMessage:true})
      }}else{
        this.setState({showChannelSetting:true})
      this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}/${this.props.match.params.sub_skill}?view=${this.props.skillView.view}&channel_name=${this.state.selectedChannelName}&channel_id=${this.state.selectedChannel}&channel_type=project`)
      }

    } else this.personalConnectionNotification();
  }

  // personalConnectionNotification = () => {
  //   const key = `open${Date.now()}`;
  //   const btn = (
  //     <Button onClick={() => this.notificationClick(key)}>
  //       Go to Jira Personal Preferences
  //     </Button>
  //   );
  //   notification["error"]({
  //     message: "Verify your Jira Account",
  //     btn,
  //     key,
  //   });
  // }

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

    this.getRequiredDatas()

    const channelCommonData = this.props.commonChanneldata.find(data => data.channel_id === this.props.skillView.channel_id) 
    if (this.props.skillView.channel_name) {
      this.setState({
        isNewModalVisible: false,
        showChannelSetting: true,
        selectedChannelName: this.props.skillView.channel_name,
        selectedChannel: this.props.skillView.channel_id,
      });
    }
  }

  componentDidUpdate(prevProps){
    let qs = queryString.parse(window.location.search)
    if (this.props.location.search !== prevProps.location.search) {
      const channelCommonDataFound = this.props.commonChanneldata.find(data => data.channel_id === this.props.skillView.channel_id) 
      this.setState({showChannelSetting : qs.channel_id ? true : false})
      // ----- when coming back from a channels configuration page , we are updating the data
      if(!qs.channel_id && qs.view === 'channel_preferences') {
        this.setState({selectedChannel:''})
        this.getRequiredDatas()
      }
    }

    // if( qs.channel_id && prevProps.commonChanneldata !== this.props.commonChanneldata){
    //   const channelCommonData = this.props.commonChanneldata.find(data => data.channel_id === this.props.skillView.channel_id) 
    // }
  }

  // getRequiredDatas = () => {
  //   const {team,match} = this.props
  //   const isGridWorkspace = team.bot && team.bot.meta && team.bot.meta.enterprise && team.bot.meta.enterprise.id ? true : false
  //   const currentSkillUserPromise = this.props.getSkillUser(this.props.match.params.wId,this.props.match.params.skill_id)
  //   this.setState({loading:true})
  //   Promise.all([currentSkillUserPromise,this.props.getJiraChannelPreferencePageData(match.params.wId,match.params.skill_id,isGridWorkspace,this.state.jiraAdmin)]).then((data) => {
  //     const currentSkillUser = data[0].data;
  //     if(currentSkillUser.skillUser && currentSkillUser.skillUser.token_obj && currentSkillUser.skillUser.token_obj.access_token){
  //       this.setState({personalConnected : true});
  //     }
  //     if(data[1].success) this.setState({configuredChannels: data[1].configuredChannels,channels:data[1].channelsList})
  //     this.setState({loading:false})
  //   });
  // }

  getRequiredDatas = () => {
    const { channels } = this.props;
    this.setState({ loading: true });
    this.props.getSkillUser(this.props.match.params.wId, this.props.match.params.skill_id).then((res) => {
      if (res.data.success) {
        if (res.data.skillUser && res.data.skillUser.token_obj && res.data.skillUser.token_obj.access_token) {
          this.setState({ personalConnected: true });
        }
      }
    });

    if (channels.length === 0) {
      this.props.getChannelList(this.props.match.params.wId).then((res) => {
        if (res.data.success) this.getCommonData(res.data.channels)
      });
    } else this.getCommonData(channels)
  };

  getCommonData = (channels) => {
    this.fetchConfiguredChannelCount();
    const { team, isWorkspaceAdmin } = this.props;
    const { jiraAdmin } = this.state;
    const isGridWorkspace = team.bot && team.bot.meta && team.bot.meta.enterprise && team.bot.meta.enterprise.id ? true : false
    const channel_ids = isWorkspaceAdmin ? false : channels.map((channel) => channel.id);
    const sharedChannels = isGridWorkspace ? channels.filter((channel) => channel.is_org_shared) : false
    let sharedChannel_ids = false
    if(sharedChannels) sharedChannel_ids = sharedChannels.map((channel) => channel.id)
    this.props.getCommonData(this.props.match.params.wId, this.props.match.params.skill_id, isWorkspaceAdmin, isGridWorkspace ,channel_ids, sharedChannel_ids).then((res) => {
      if (res.success) this.setConfiguredChannels();
    });
  }

  setConfiguredChannels = () => {
    const { commonChanneldata, channels } = this.props;

    let array = commonChanneldata;

    // to remove duplicate, in case of grid workspace, shared channel will occur two times in the workspace where that channel is configured
    const unique_array = [];
    const map = new Map();
    for (const item of array) {
      if (!map.has(item.channel_id)) {
        map.set(item.channel_id, true);
        // unique_array.push({
        //   channel_id: item.channel_id,
        //   isSupportChannel: item.isSupportChannel,
        // });
        unique_array.push(item);
      }
    }

    let configuredChannels = [];
      unique_array.forEach((cha) => {
          // const channelFound = channels.find((channel) => channel.id == cha.channel_id);
          // if (channelFound) configuredChannels.push({ id: channelFound.id, name: channelFound.name });
          // else configuredChannels.push({ id: cha.channel_id, name: cha.channel_id });


          const {commonChanneldata} = this.props
          const channelData = commonChanneldata && commonChanneldata.find(channelCommonData => channelCommonData.channel_id === cha.channel_id )
          if(channelData){
            configuredChannels.push({id : cha.channel_id,name : cha.channel && cha.channel.name ? cha.channel.name : cha.channel_id, channel_type : channelData.channel_type, project: channelData.channel_linking_id?.link_info?.project_name || "-" })
          }
      });

    this.setState({ configuredChannels, loading: false });
  };

  // getConfiguredChannels = (isUserChannelAvailable,commonData) => {
  //   const {assistant_skills} = this.props;
  //   const allChannels = assistant_skills.channels;

  //   // axios.get('/bot/api/userChannelNotifications/'+this.props.workspace_id+'/'+this.props.match.params.skill_id)
  //   // .then(res => {
  //       // this.setState({ linkedChannelData: res.data.data });

  //       // let array = res.data.commonData;
  //       let array = commonData;
  //       const unique_array = [];
  //       const map = new Map();
  //       for (const item of array) {
  //         if (!map.has(item.channel_id)) {
  //           map.set(item.channel_id, true);
  //           unique_array.push({
  //             channel_id: item.channel_id,
  //             channelName: this.getchannelname(item.channel_id)
  //           });
  //           // }
  //         }
  //       }

  //       let userConfiguredChannel = []
  //       if(isUserChannelAvailable){

  //         let channels = [];
  //         if(this.state.jiraAdmin)
  //         channels = [...allChannels]
  //         else
  //         channels = [...this.state.channels]

  //         unique_array.forEach(cha => {
  //             const channelFound = channels.find(channel => channel.id == cha.channel_id);
  //             channelFound && userConfiguredChannel.push(cha);
  //         })
  //         this.setState({ configuredChannels: userConfiguredChannel });

  //       }else this.setState({ configuredChannels: unique_array });
  //       this.setState({ loading: false });
  //     // })
  //     // .catch(e => {
  //     //   this.setState({ loading: false });
  //     //   // console.log(e);
  //     //   console.error(e)
  //     // });
  // }

  // getchannelname = (channel_id) => {
  //   const {assistant_skills} = this.props;
  //   const allChannels = assistant_skills.channels;
    
  //   let channels = [];
  //   if(this.state.jiraAdmin)
  //   channels = [...allChannels]
  //   else
  //   channels = [...this.state.channels]

  //   const channel = channels.find(channel => channel.id == channel_id)
  //   return channel ? channel.name : "";
  // }

  // getAdminChannels = (AllWLchannels,userChannels) => {
  //   const {assistant_skills} = this.props;
  //   const allChannels = assistant_skills.channels;
  //   let WLchannels = [];
  //   let adminChannels = [...userChannels];

  //   //from all linking data removing DM and BOT channels
  //   AllWLchannels.forEach(channel => {
  //     const channelFound = allChannels.find(cha => cha.id === channel.channel_id)
  //     if(channelFound) WLchannels.push(channelFound);
  //   })

  //   // merging user's channels without linking
  //   WLchannels.forEach(channel => {
  //     const channelFound = adminChannels.find(cha => cha.id === channel.channel_id)
  //     if(!channelFound) adminChannels.push(channel)
  //   })

  //   //to remove duplicates
  //   adminChannels = Array.from(new Set(adminChannels.map(a => a.id)))
  //   .map(id => {
  //   return adminChannels.find(a => a.id === id)
  //   })

  //   this.setState({adminChannels});
  // }

  onChangeChannel = (event, value) => {
   

    this.setState({
      selectedChannel: event,
      selectedChannelName: value.props.children
    });
  };

  // goToJiraNotifSetup() {
  //   this.props.history.push(
  //     "/" +
  //       this.props.workspace_id +
  //       "/jira_notification_setup/" +
  //       this.props.skill._id +
  //       "?step=intial_setup"
  //   );
  // }

  // updateSkill(data) {
  //   this.props
  //     .updateSkill(this.props.skill._id, this.props.skill.workspace_id, data)
  //     .then(res => {
  //       this.setState({ disconnectModel: !this.state.disconnectModel });
  //       this.props.history.push(
  //         "/" +
  //           this.props.workspace_id +
  //           "/skill/jira/" +
  //           this.props.skill._id
  //       );
  //     });
  // }

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
    this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}/${this.props.match.params.sub_skill}?view=personal_preferences`)
   }
  showSettings = (channelName, channel_id, data) => {
    if (this.state.personalConnected) {
      this.setState(
        { selectedChannel: channel_id, selectedChannelName: channelName },
        () => {
          this.showChannelSetting(data);
        }
      );
    } else this.personalConnectionNotification();

    // this.props.setOption("jira_channel_pref",channel_id,channelName);
  };

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
          this.setState({
            jiraConfiguredChannelsCountTotal: parseInt(this.state.jiraConfiguredChannelsCountTotal) > 0 ? parseInt(this.state.jiraConfiguredChannelsCountTotal) - 1 : 0 
          })
          this.setState({configuredChannels : this.state.configuredChannels.filter(d => d.id !== channel_id)})
        }
      })
  }

  callback = (key) =>{
    this.setState({tabName:key})
  }

  deleteConfiguration = (data) => {
    const {isWorkspaceAdmin,commonChanneldata,user_now} = this.props
          let isChannelAdmin = true
          const commondataFound = commonChanneldata.find(channelCommonData => channelCommonData.channel_id === data.id)
          
          if(commondataFound && "restrict_channel_config" in commondataFound && commondataFound.restrict_channel_config ){
            const userFound = commondataFound.channel_admins.find(user => user == user_now._id)
            if(userFound) isChannelAdmin = true
            else isChannelAdmin = false
          }else isChannelAdmin=true;

          if(commondataFound){
            if(isChannelAdmin || isWorkspaceAdmin)
            return <Popconfirm title={
              <div>
                {commondataFound.channel_type === 'support' ? 
                <>
                The following channel preferences will be reset. <br/>
                1. Ticket Defaults<br/>
                2. Thread Sync behaviour<br/>
                3. Channel administration<br/><br/>
                </>
                :<>
              The following channel preferences will be reset. <br/>
              1. Notification preferences<br/>
              2. Issue Defaults<br/>
              3. Thread Sync behaviour<br/>
              4. Channel administration<br/><br/>
              </>}
  
              This change is irreversible. Are you sure?
            </div>
            } okText='Delete' okType='danger' placement='top' onConfirm={() => this.deleteChannelConfiguration(data.id,data.name)}><Button type='link'>Delete Configuration</Button></Popconfirm>
            else return <Button type='link' onClick={() => (
              message.warning(`Channel configuration access restricted. Contact one of the channel admins (or workspace admins) for access: ${this.getAdminNames(commondataFound)}`)
            )}>Delete Configuration</Button>
          }

  }

  handleOk = () => {
    this.setState({
      isNewModalVisible: false,
    });
    this.goToChannel();
  };

  handleCancel = () => {
    this.setState({
      isNewModalVisible: false,
      selectedChannel:'',
      checkingChannelConfigs : false,
      newChannelType : 'project',
      preferenceCreationLoading:false
    });
  };

  showNewModal = (newChannelType) => {
    this.setState({
      isNewModalVisible: true,
      newChannelType
    });
  };

  showNewSupportModal = () => {
    this.setState({
      isNewSupportModalVisible: true,
    });
  };

  goToChannelSettings = () => {
    this.setState({showChannelSetting:true,isNewModalVisible : false})
    this.getCommonData(this.props.channels)
    this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}/${this.props.match.params.sub_skill}?view=${this.props.skillView.view}&channel_name=${this.state.selectedChannelName}&channel_id=${this.state.selectedChannel}&channel_type=${this.state.newChannelType}`)
    this.setState({preferenceCreationLoading:false})
  }


  goToProjectchannel =()=>{
    const {commonChanneldata} = this.props
    const {selectedChannel, newChannelType} = this.state
    const {sub_skill} = this.props.match.params

      const channelData = commonChanneldata.find(data => data.channel_id === selectedChannel)

      const showErrorMessage = () => {
        message.warning({
          content: (
            <>
              #{this.state.selectedChannelName} already configured
            </>
          ),
        })
      }

      const check = () => {
        this.setState({checkingChannelConfigs : true})
        checkChannelConfigs(this.props.match.params.wId, {requiredData : ['channel_sync'],jiraSkill_id : this.props.match.params.skill_id,channel_id : this.state.selectedChannel }).then(res => {
          if(res.success) {
            this.setState({checkingChannelConfigs : false})
            if(res.channelMeta.channel_sync_present) message.error({
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
            })
            else {this.setState({preferenceCreationLoading:true}); this.invokeChildMethod(); }
          }
        }) 
      }

    if (this.state.personalConnected) {
      if(sub_skill === 'jira_software'){
        if(channelData){
          if(channelData.channel_type === 'support' || channelData.channel_type === 'agent'){
            message.warning({
              content: (
                <>
                  #{this.state.selectedChannelName} already configured in HelpDesk (Jira)
                  <Button
                    style={{ marginLeft: 0 }}
                    type='link'
                    onClick={() => {
                      this.handleCancel()
                      this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}/jira_service_desk?view=channel_preferences`)
                    }}
                  >
                    {" "}
                    Go to HelpDesk channel preference
                  </Button>
                </>
              ),
            })
          }else showErrorMessage()
        }else check()
      }else if (sub_skill === 'jira_service_desk') {
        if(channelData){
          if(channelData.channel_type === 'project'){
            message.warning({
              content: (
                <>
                  #{this.state.selectedChannelName} already configured in Project (Jira)
                  <Button
                    style={{ marginLeft: 0 }}
                    type='link'
                    onClick={() => {
                      this.handleCancel()
                      this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}/jira_software?view=channel_preferences`)
                    }}
                  >
                    {" "}
                    Go to Project channel preference
                  </Button>
                </>
              ),
            })
          }else showErrorMessage()
        }else   check()
      }
 

    } else this.personalConnectionNotification();
  }


  fetchConfiguredChannelCount = () => {
    if (this.props.skills.length > 0) {
      const jiraSkill = this.props.skills.find((skill) => skill.key === "jira");
      if (jiraSkill) {
        const { match, team } = this.props;
        const isGridWorkspace = team && team.bot && team.bot.meta && team.bot.meta.enterprise && team.bot.meta.enterprise.id ? true : false;
        
        const isJiraAdmin = jiraSkill.skill_metadata.jiraConnectedId == this.props.user_now._id;
        getJiraConfigurationsCount(match.params.wId, jiraSkill.skill_metadata._id, isGridWorkspace, isJiraAdmin).then((data) => {
          if (data.success)
            this.setState({
              jiraConfiguredChannelsCountNormalChannel: data.normalChannelCount,
              jiraConfiguredChannelsCountSupportChannel: data.supportChannelCount,
              jiraConfiguredChannelsCountTotal: parseInt(data.normalChannelCount) + parseInt(data.supportChannelCount)
            });
        })
      }
    }
  }


  getCardWithTable = ({sub_skill,columns,dataSource,cardType}) => {
    return (
      <Card
        // title={`Configured Channels (${this.state.jiraConfiguredChannelsCountTotal})`}
        title={`${sub_skill === 'jira_software' ? 'Configured Channels' : cardType === 'support' ? 'Support Channels' : 'Agent Channels'} (${dataSource.length})`}
        style={{ width: "100%" }}
        size='small'
        extra={
          <div>
            {/* <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={this.showNewModal}
          >
            {sub_skill === 'jira_service_desk' ? 'Setup Agent Channel' : 'Setup Project Channel'}
          </Button>
          { sub_skill === 'jira_service_desk' &&
          <Button
            style={{ marginLeft: 8 }}
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={this.showNewSupportModal}
          >
            Setup Customer Support Channel
          </Button>
          } */}

            {sub_skill === "jira_software" ? (
              <Button type='primary' icon={<PlusCircleOutlined />} onClick={() => this.showNewModal('project')}>
                Setup Project Channel
              </Button>
            ) : cardType === "support" ? (
              <Button style={{ marginLeft: 8 }} type='primary' icon={<PlusCircleOutlined />} onClick={() => this.showNewModal('support') /* this.showNewSupportModal */}>
                Setup Support Channel
              </Button>
            ) : (
              <Button type='primary' icon={<PlusCircleOutlined />} onClick={() => this.showNewModal('agent')}>
                Setup Agent Channel
              </Button>
            )}
          </div>
        }
      >
        <Table
        // style={{tableLayout:"fixed"}}
    
          columns={columns}
          showHeader={true}
          // dataSource={this.state.configuredChannels.slice().reverse().filter(cha => sub_skill === 'jira_service_desk' ? cha.isSupportChannel : !cha.isSupportChannel)}
          dataSource={dataSource}
          pagination={{ size: "small" }}
          loading={this.state.loading}
        />
      </Card>
    );
  }

  acceptMethods(invokeChildMethod) {
    this.invokeChildMethod = invokeChildMethod;
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
    record[dataIndex]
     ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
     : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    }
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  render() {
    const {channels} = this.props
    const {newChannelType} = this.state
    const jiraSkill = this.props.skills.find(skill => skill.name === 'Jira')

    const sub_skill = this.props.match.params.sub_skill ? this.props.match.params.sub_skill : false
    
    // const isHelpDeskEnabled = jiraSkill && !jiraSkill.skill_metadata.disabled && jiraSkill.skill_metadata.isServiceDeskEnabled;
    
    // configuredChannels.forEach(channel=> {
     
    //   const channelData = commonChanneldata&& commonChanneldata && commonChanneldata.find(channelCommonData => channelCommonData.channel_id === channel.id )
      
    //   if(channelData.isSupportChannel){

    //     supportArray.push(channel)
    //   }else {
    //     normalArray.push(channel)
    //   }
    // })
   
    const columns = [
      {
        title: 'Channel Name',
        dataIndex: "channelName",
        key: "channelName",
        ...this.getColumnSearchProps('name'),
        // width: '40%',
        // ellipsis: true,
        // className: "table-column",
       
        render: (text, record) => {
        let channelNameLinkArr = record.name.split('-')
        // console.log(channelNameLink)
        let shortChannelName = channelNameLinkArr.map((ele, idx)=>{
          return `${channelNameLinkArr[idx].slice(0,20)}${channelNameLinkArr[idx].length>20?'...':""}`
        })
        let shortChannelNameJoined = shortChannelName.join('-')
        // console.log(channelNameLinkArr[0].slice(0,15))
          return (
            <a
              className="table-link"
              onClick={() => {
                this.showSettings(record.name, record.id,record);
              }}
            >
              {shortChannelNameJoined}
            </a>
          );
            
        }
      },
      {
        title: 'Project Name',
        dataIndex: "projectName",
        key: "projectName",
        // className: "table-column",
       
        render: (text, record) => {
         
          return (
            <a
              className="table-link"
              onClick={() => {
                this.showSettings(record.name, record.id);
              }}
            >
              {record.project}
            </a>
          );
            
        }
      },
      // {
        // title: 'Actions',
        
        // render: (data) => {
          // const {isWorkspaceAdmin,commonChanneldata,user_now} = this.props
          // let isChannelAdmin = true
          // const commondataFound = commonChanneldata.find(channelCommonData => channelCommonData.channel_id === data.id)
          
          // if(commondataFound && "restrict_channel_config" in commondataFound && commondataFound.restrict_channel_config ){
          //   const userFound = commondataFound.channel_admins.find(user => user == user_now._id)
          //   if(userFound) isChannelAdmin = true
          //   else isChannelAdmin = false
          // }else isChannelAdmin=true;
          // if(isChannelAdmin)
          // return <Popconfirm title={
            
          //   <div>
          //   The following channel preferences will be reset. <br/>
          //   1. Notification preferences<br/>
          //   2. Issue Defaults<br/>
          //   3. Ticket Defaults<br/>
          //   4. Thread Sync behaviour<br/>
          //   5. Channel administration<br/><br/>

          //   This change is irreversible. Are you sure?
          // </div>
          // } okText='Delete' okType='danger' placement='top' onConfirm={() => this.deleteChannelConfiguration(data.id,data.name)}><Button type='link'>Delete Preferences</Button></Popconfirm>
          // else return <Button type='link' onClick={() => (
          //   message.warning(`Channel configuration access restricted. Contact one of the channel admins (or workspace admins) for access: ${this.getAdminNames(commondataFound)}`)
          // )}>Delete Preferences</Button>
         
          
        // }
      // },
      // {
      //   title:( <span>
      //   Type
      //   <Tooltip title="Channels can be setup for project notifications or for customer support">
      //     <InfoCircleOutlined style={{ marginLeft: 4 }} />
      //   </Tooltip>
      // </span> ),
      //   dataIndex: "channelType",
      //   key: "channelName",
      //   // className: "table-column",
        
      //   render: (text, record) => {
          
      //     const {commonChanneldata} = this.props
      //     const channelData = commonChanneldata && commonChanneldata.find(channelCommonData => channelCommonData.channel_id === record.id )
    
      //      if(channelData && channelData.isSupportChannel)
      //       return(
      //         <div>Customer Support </div>

      //       );
      //     else
      //       return(
      //         <div>{sub_skill === 'jira_service_desk' ? 'Agent' : 'Project'}</div>

      //       );
          

          
      //   }
      // },
      {
        title: '',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => (
          <>
            {/* <Button size="small" type="link" onClick={this.goToChannel}>
              Configure
            </Button> */}
            <Dropdown.Button
              type="link"
              onClick={() => {
                this.showSettings(record.name, record.id);
              }}
              overlay={
                <Menu>
                  <Menu.Item key="1" icon={<DeleteOutlined danger />} > 
                 {this.deleteConfiguration(record)}
                  </Menu.Item>
                </Menu>
              }
            >
              Configure
            </Dropdown.Button>
          </>
        ),
      },
    ];

    return (
        !this.state.showChannelSetting ? (
          <Layout style={{marginLeft:0}}>
            
            <Content styl e={{ padding: "16px 16px 32px 24px", overflow: "scroll" }}>
            <Modal
            // title={newChannelType  === 'agent' ? 'Configure Agent Channel' : newChannelType === 'support' ? 'Configure Support Channel' : "Configure Project Channel"}
            title={newChannelType  === 'agent' ? 'Configure Agent Channel' : newChannelType === 'support' ? 'Configure Support Channel' : "Configure Project Channel"}
            visible={this.state.isNewModalVisible}
            onOk={this.goToProjectchannel}
            okButtonProps = {{loading : this.state.checkingChannelConfigs  || this.state.loading}}
            // okButtonProps={{disabled:  !this.state.selectedChannel,loading : this.state.handleCancel}}
            onCancel={this.handleCancel}
            okText="Setup"
            destroyOnClose
          >
            {/* <Text type="secondary">
              {`Setup channel for Jira ${sub_skill  === 'jira_service_desk' ? 'agent' : 'project' } notifications, issue creation and update in the project.`}
            </Text>{' '} */}
            <Text type="secondary">{newChannelType  === 'agent' ? 'Triage, discuss & update tickets' : newChannelType === 'support' ? 'Turn employee requests to tickets' : 'Get alerts and update issues'}</Text>
            <br />
            <br />
            {/* <Select
                      showSearch
                      placeholder="Select Channel"
                      style={{ width: "100%" }}
                      value={this.state.selectedChannel}
                      onChange={this.onChangeChannel}
                      optionFilterProp="children"
                      loading={this.state.loading}
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {
                      channels &&
                        channels.slice(0).map((channel, index) => (
                          <Option
                            key={channel.id}
                            value={channel.id}
                            name={channel.name}
                          >
                            {channel.name}
                          </Option>
                        ))
                        }
                    </Select> */}
                <DefaultProjects
                  // data={this.state.data}
                  data={{
                    domain: {done:false,domain:""} ,
                    token: {done:false,userName:"",userToken:""},
                    channelDefaults: {done:false,id:"",channelName:""},
                    channelInfo: false,
                     linking:{done:false,issueType: {},
                     project: {},
                     channel: {},autoCreateFields:{}},
                     skill_id:""
                  }}
                  shareMethods={this.acceptMethods.bind(this)}
                  skill_id={this.props.match.params.skill_id}
                  // loading = {this.state.loading}
                  setLoadingState = {(loadingState) => {}}
                  moveToNextStep = {() => this.goToChannelSettings()}
                  newChannelType = {this.state.newChannelType}
                  updateSelectedChannel = {selectedChannelData => this.setState({selectedChannel: selectedChannelData.id, selectedChannelName:selectedChannelData.name})}
                />
            <Text type="warning">
              For private channels, ensure Troopr is added to the channel first.
              Type&nbsp;<i>/invite @troopr</i>&nbsp;in that channel to invite
              Troopr Assistant.
            </Text>
          </Modal>
          {/* <Modal
            title="Configure Customer Support Channel"
            visible={this.state.isNewSupportModalVisible}
            onOk={this.goToSupportchannel}
            onCancel={this.handleCancel}
            okButtonProps={{disabled:  !this.state.selectedChannel,loading : this.state.handleCancel}}
            okText="Configure"
          >
            <Text type="secondary">
              Setup channel for employee requests similar to Jira Customer
              Portal experience but in Slack. Troopr will also sync
              conversations in the channel with the ticket and vice versa.
            </Text>
            <br />
            <br />
            <Select
                      showSearch
                      placeholder="Select Channel"
                      style={{ width: "100%" }}
                      value={this.state.selectedChannel}
                      onChange={this.onChangeChannel}
                      optionFilterProp="children"
                      loading={this.state.loading}
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {
                      channels &&
                        channels.slice(0).map((channel, index) => (
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
            <br />
            <br />
            <Text type="warning">
              For private channels, ensure Troopr is added to the channel first.
              Type&nbsp;<i>/invite @troopr</i>&nbsp;in that channel to invite
              Troopr Assistant.
            </Text>
          </Modal> */}
            <Row style={{ width: '100%', maxWidth: 1000, paddingLeft: 16 }} gutter={[16, 16]}>
            {sub_skill === 'jira_software' ? <Col xs={{ span: 24 }} sm={{ span: 24 }} lg={{ span: 12 }} md={{ span: 24 }}style={{ display: 'flex' }}>
              {/* {this.getCardWithTable({sub_skill,columns,dataSource : this.state.configuredChannels.slice().reverse()})} */}
              {/* {this.getCardWithTable({sub_skill,columns,dataSource : this.state.configuredChannels.slice().reverse().filter(cha => sub_skill === 'jira_service_desk' ? cha.isSupportChannel : !cha.isSupportChannel)})} */}
              {this.getCardWithTable({sub_skill,columns,dataSource : this.state.configuredChannels.slice().reverse().filter(cha => cha.channel_type === 'project')})}
              {/* <Card
                title={`Configured Channels (${this.state.jiraConfiguredChannelsCountTotal})`}
                style={{ width: '100%' }}
                size="small"
                extra={
                  <div>
                    <Button
                      type="primary"
                      icon={<PlusCircleOutlined />}
                      onClick={this.showNewModal}
                    >
                      {sub_skill === 'jira_service_desk' ? 'Setup Agent Channel' : 'Setup Project Channel'}
                    </Button>
                    { sub_skill === 'jira_service_desk' &&
                    <Button
                      style={{ marginLeft: 8 }}
                      type="primary"
                      icon={<PlusCircleOutlined />}
                      onClick={this.showNewSupportModal}
                    >
                      Setup Customer Support Channel
                    </Button>
                    }
                  </div>
                }
              >
                <Table
                      columns={columns}
                      showHeader={true}
                      // dataSource={this.state.configuredChannels.slice().reverse().filter(cha => sub_skill === 'jira_service_desk' ? cha.isSupportChannel : !cha.isSupportChannel)}
                      dataSource={this.state.configuredChannels.slice().reverse()}
                      pagination={{ size:'small' }}
                      loading = {this.state.loading}
                      />
                
              </Card> */}
            </Col>
          : 
          <>
          <Col xs={{ span: 24 }} sm={{ span: 24 }} lg={{ span: 12 }} md={{ span: 24 }} style={{ display: "flex" }}>
            {this.getCardWithTable({ sub_skill, columns,cardType : 'support' ,dataSource: this.state.configuredChannels.slice().reverse().filter(cha =>  cha.channel_type === 'support') })}
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 24 }} lg={{ span: 12 }} md={{ span: 24 }} style={{ display: "flex" }}>
            {/* {this.getCardWithTable({ sub_skill, columns,cardType : 'agent', dataSource: this.state.configuredChannels.slice().reverse().filter(cha =>  !cha.isSupportChannel) })} */}
            {this.getCardWithTable({ sub_skill, columns,cardType : 'agent', dataSource: this.state.configuredChannels.slice().reverse().filter(cha =>  cha.channel_type === 'agent') })}
          </Col>
        </>
          }
            </Row>
            </Content>
           




          
                     
          {/* <Modal
          visible={this.state.viewSupportChannelConfirmMessage}
          // title='Is this a support channel?'
          okText='Manage'
          onOk={() => this.updateCommonData()}
          onCancel={() => this.setState({viewSupportChannelConfirmMessage:false})}
          >
            Is this a support channel?<br/><br/>
                     <Radio.Group onChange={(e) => this.setState({isSupportChannel:e.target.value})} value={this.state.isSupportChannel}>
         <Space direction="vertical">
           <Radio value={true}>Yes</Radio>
           <Radio value={false}>No</Radio>

         </Space>
       </Radio.Group>
          </Modal> */}
          {this.props.match.params.sub_skill === 'jira_service_desk' && this.state.viewSupportChannelConfirmMessage && <IsSupportChannelModal 
          viewSupportChannelConfirmMessage={this.state.viewSupportChannelConfirmMessage} 
          onCancel={() => this.setState({viewSupportChannelConfirmMessage:false})} 
          // updateCommonData={() => this.updateCommonData()}
          // onRadioChange = {(e) => this.setState({isSupportChannel:true})}
          onRadioChange = {(e) => {}}
          // isSupportChannel = {this.state.isSupportChannel}
          channel={{
            id: this.state.selectedChannel,
            name: this.state.selectedChannelName
          }}
          userChannels = {channels}
          // onApiCallFinish = {() => this.setState({viewSupportChannelConfirmMessage:false,showChannelSetting:true})}
          skillView={this.props.skillView}
          redirect={() => this.redirect()}
          />}
          </Layout>
        ) : (
          !this.state.loading && <JiraChannelPreference
            skillView={this.props.skillView}
            channel={{
              id: this.state.selectedChannel,
              name: this.state.selectedChannelName
            }}
            channel_name={this.state.selectedChannelName}
            skill={this.props.skill}
            setOption={this.setOption}
            userChannels = {channels}
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
    channels : state.skills.channels
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
    getSkillUser,
    userChannelNotifications,
    getJiraChannelPreferencePageData,
    deleteChannelConfigurations,
    updateChannelCommonData,
    getChannelList,
    getCommonData
  })(JiraChannelPreferences)
);
