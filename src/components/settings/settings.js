import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter/* , Link, Redirect */ } from "react-router-dom";
// import Workflows from './settings_main';
import Validator from "validator";
import isEmpty from "lodash/isEmpty";
// import TimeZones from "../../utils/MomenttimeZone"
import queryString from "query-string";
import AppsumoInfo from "./appsumoInfo";

// import {
//   IdcardOutlined,
//   ProfileOutlined,
//   ProjectOutlined,
//   RocketOutlined,
//   NotificationOutlined,
//   TeamOutlined,
//   TagsOutlined,
//   FormatPainterOutlined,
//   CalendarOutlined,
//   AppstoreAddOutlined,
//   MessageOutlined,
//   UserOutlined
// } from '@ant-design/icons';

import {
  // Spin,
  PageHeader,
  Tabs,
  Typography,
  Button,
  Select,
  message,
  // notification,
  Layout,
  // Menu,
  Form,
  // Alert,
  Card,
  // Divider,
  Switch,
  Row,
  Col,
  // Input,
  Collapse
} from "antd";
import {
  personalSetting,
  saveDataTrooprConfigs,
  getSkillId,
  getTrooprUserChannelConfig,
  updateUserInfo,
  // getProfileinfo,
  updateUserWorkspaces,
  deleteAccount,
  updateWorkspace,
  leaveWorkspace,
  getWorkspaceMembers,
  deleteWorkspaceMember,
  updateMembership,
  sendWorkspaceInvite
} from "../skills/skills_action";
import { getWorkspace } from "../common/common_action";
import Payment from "../billing/billingMainPage.js"
import WorkspaceMembers from "./workspaceMembers"
import UserProfile from "./userProfile"
import WorkspaceProfile from "./workspaceProfile"
import Products from "./products"
import Absences from "./Absences/MyAbsences";
import Labels from "./labelManagement"
import axios from "axios"
import { ThemeProvider, useTheme } from 'antd-theme';
import Admin from "./admin";
import "./settings.css"

const { TabPane } = Tabs;
const { Option } = Select;
const { /* Title, */ Text } = Typography;
const { /* Header, Sider, */ Content } = Layout;
// let isUserAdmin=false;
let ChannelFrequency = [
  {
    name: "Real Time",
    value: 0
  },
  {
    name: "1 min",
    value: 1
  },
  {
    name: "5 min",
    value: 5
  },
  {
    name: "15 min",
    value: 15
  },
  {
    name: "30 min",
    value: 30
  },
  {
    name: "1 hr",
    value: 60
  },
  {
    name: "2 hrs",
    value: 120
  },
  {
    name: "4 hrs",
    value: 240
  },
  {
    name: "6 hrs",
    value: 360
  },
  {
    name: "12 hrs",
    value: 720
  }
];

// let redirectPath = `${this.props.match.params.wId}/settings?view=profile`;

let notifEvent = [

  {
    name: "Important (assigned/@mentioned)",
    value: "important_updates"
  }, {
    name: "Most updates[Issues Followed]",
    value: "most_updates"
  }
]
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}


const Theme = () => {

  let initialTheme = {
    name: localStorage.getItem("theme"),
    // variables: { 'primary-color': '#664af0' }
    variables: { 'primary-color': localStorage.getItem("theme") == "dark" ? "#664af0" : "#402E96" }
  };

  const [theme, setTheme] = React.useState(initialTheme);
  return (
    <ThemeProvider
      theme={theme}
      onChange={(value) => { setTheme(value)}}
    >
      <ThemeSelect />
    </ThemeProvider>
  );
};

const ThemeSelect = () => {
  const [{ name, variables,themes }, setTheme] = useTheme();
  return (
    <>
      {/*<PageHeader title='Appearance' />*/}
      <Content
        // style={{
        //   padding: "16px 0 0 24px",
        //   background: (localStorage.getItem('theme') == 'default' ? "#ffffff" : "rgba(15,15,15)")
        // }}
        style={{ padding: "16px 16px 32px 24px" }}
      >
        <Row className='content_row' gutter={[0, 16]}>
      
          <Col span={24}>
            <Collapse>
              <Collapse.Panel
              className='collapse_with_action'
                header='Theme'
                key='1'
                extra={
                  <Select
                    style={{ width: 100 }}
                    value={name}
                    onClick={event => {
                      event.stopPropagation();
                    }}
                    onChange={
                      (theme) => {
                        localStorage.setItem("theme", theme);
                        setTheme({ name: theme, variables: { "primary-color": localStorage.getItem("theme") == "default" ? "#402E96" : "#664af0" } });
                      }
                      // (theme) => {ThemeSelect()}
                    }
                  >
                    {themes.map(({ name }) => (
                      <Select.Option key={name} value={name}>
                        {/* {name}{console.log('names',name)} */}
                        {name == "dark" ? "Dark" : "Default"}
                      </Select.Option>
                    ))}
                  </Select>
                }
              >
                <Text type='secondary'>Customize how Troopr looks</Text>
              </Collapse.Panel>
            </Collapse>
          </Col>
        </Row>
        {/* <div>
          <Form
            autocomplete="off"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            name="userProfileForm"
            hideRequiredMark={true}
          >
            <Form.Item labelAlign="left" label="Select a Theme">
              <Select
                style={{ width: 200 }}
                value={name}
                onChange={
                  (theme) => {localStorage.setItem("theme", theme);setTheme({ name: theme, variables: { 'primary-color': localStorage.getItem("theme") == "default" ?  "#402E96": "#664af0" }
                })}
                  // (theme) => {ThemeSelect()}
                }
              >
                {
                  themes.map(
                    ({ name }) => (
                      <Select.Option key={name} value={name}>
                        {name == "dark" ? 'Dark': 'Default'}
                      </Select.Option>
                    )
                  )
                }
              </Select>
            </Form.Item>
          </Form>
        </div> */}
      </Content>
    </>
  );
};

class Workflow extends Component {

  constructor(props) {
    super();
    let settings_currentTab = "profile"
    let currentActiveKey="1"
    if (props && props.location && props.location.search) {
      settings_currentTab = queryString.parse(props.location.search).view || "profile"
      if(settings_currentTab=="workspace"){
        currentActiveKey="2"
      }else if(settings_currentTab=="product"){
        currentActiveKey="3"
      }else if(settings_currentTab=="upgrade"){
        currentActiveKey="4"
      }else if(settings_currentTab=="admin"){
        currentActiveKey="5"
      }else if(settings_currentTab=="appsumo"){
        currentActiveKey="8"
      }
    }
    // console.log("constructing settings compoenent with props: "+JSON.stringify(props))
    this.state = {
      loading: true,
      isProfileView: true,
      assistant_name: "Troopr Assistant",
      team: {},
      skills: [],
      defaultSkill: "",
      nameLoading: false,
      defaultLoading: false,
      settings_currentTab,
      currentActiveKey,
      channelNotifFreq: 1,
      notifEvents: "important_updates",
      skill: {},
      profileName: '',
      timeZone: '',
      offsetObj: {},
      showWorkspacesName: false,
      projects: [],
      showProjectsName: false,
      workspaces: [],
      showWorkspacesName: false,
      showDeleteAccountModal: false,
      workspaceName: '',
      leavemodal: false,
      profileNameChanged: false,
      profileTimezoneChanged: false,
      timeZoneValue: '',
      workspaceTimezoneChanged: false,
      workspaceNameChanged: false,
      status: true,
      check: false,
      isAdmin: false
    };

    this.checkForAdmin = this.checkForAdmin.bind(this);
    this.leaveWorkspace = this.leaveWorkspace.bind(this);

  }

  setCurrentTab = () => {
    let settings_currentTab = "profile"
    let currentActiveKey="1"
    if (this.props && this.props.location && this.props.location.search) {
      settings_currentTab = queryString.parse(this.props.location.search).view || "profile"
      if(settings_currentTab=="workspace"){
        currentActiveKey="2"
      }else if(settings_currentTab=="product"){
        currentActiveKey="3"
      }else if(settings_currentTab=="upgrade"){
        currentActiveKey="4"
      }else if(settings_currentTab=="admin"){
        currentActiveKey="5"
      }else if(settings_currentTab=="appsumo"){
        currentActiveKey="8"
      }

      this.setState({
        settings_currentTab,
        currentActiveKey
      })
    }
  }

  componentDidUpdate(prevProps) {
    // console.log("ncomponentDidUpdate: prevProps view:"+(queryString.parse(window.location.search)?queryString.parse(window.location.search).view:""))
    // console.log("current state view:"+this.state.settings_currentTab);
    let qs = queryString.parse(window.location.search)
    if (qs && qs.view) {
      if (qs.view != this.state.settings_currentTab) {
        // console.log("updating state to "+qs.view)
        this.setState({
          settings_currentTab: qs.view
        })
      }
    }

    if (this.props.location !== prevProps.location) {
      this.setCurrentTab();
    }
  }

  componentDidMount() {
    // console.log("\ncomponentDidMount with location props:\n"+JSON.stringify(this.props.location))
    let stateData = {}
    // const parsedQueryString = queryString.parse(window.location.search);
    // stateData.settings_currentTab = parsedQueryString.view

    // if (parsedQueryString.view == 'trackers') {
    //   // this.setState({ settings_currentTab: 'trackers' })
    //   stateData.settings_currentTab = 'trackers'
    // }
    // else if (parsedQueryString.view == 'upgrade') {
    //   // this.setState({ settings_currentTab: 'upgrade' })
    //   stateData.settings_currentTab = 'trackers'
    // }
    // this.setState({ loading: true })

    // this.props.getWorkspace(this.props.match.params.wId)

    // console.log("settings compoenent mounting")
    /*axios.get(`/api/${this.props.match.params.wId}/isAdmin`).then(res=> {
      // console.log("response from -> /api/:wId/isAdmin: ", res);

      if(res.data.success==true && res.data.isAdmin==true){
        this.setState({isAdmin: true})
      }
    })*/

    Promise.all([
      // this.props.getProfileinfo(),
      axios.get("/bot/workspace/" + this.props.match.params.wId + "/assistant_skills"),
      // this.props.personalSetting(this.props.match.params.wId, localStorage.trooprUserId),
      this.props.getSkillId(this.props.match.params.wId, "Troopr")
    ]).then(data => {
      let [
        // profile,
        ws_skills,
        // personalSettings,
        trooprSkill] = data
      // console.log("got Troopr skill")
      // let profile = this.props
      stateData.timeZoneValue = this.props.workspace_timezone
      stateData.profileName = this.props.user_name
      stateData.timeZone = this.props.user_timezone
      let defaultSkill = {}
      let skills = []
      ws_skills.data.skills.forEach(skill => {
        if (skill.type == "Project Management") {
          skills.push(skill)
          if (skill.default) {
            defaultSkill = skill
          }
        }
      })

      stateData.skill = trooprSkill
      stateData = Object.assign(stateData, { skills: skills, defaultSkill: defaultSkill.name })

      this.props.getTrooprUserChannelConfig(trooprSkill._id, this.props.match.params.wId, this.props.user_now._id).then(channelData => {
        if (channelData.data.success) {
          stateData = Object.assign(stateData, {
            notifEvents: channelData.data.data.event_type[0]|| "important_updates",
            // selectedChannel:channelData.data.data.channel_id,
            // selectedChannelName:channelData.data.data.channelName,
            channelNotifFreq: channelData.data.data.frequency===0?0:(channelData.data.data.frequency||1),
            status: channelData.data.data.status || true
          })
        }
        // notification: {
        //   frequency: this.state.channelNotifFreq,
        //   events: this.state.notifEvents
        // },
        this.setState(stateData, () => this.setState({ loading: false }))
      })
    })

  }

  checkForAdmin = () => {
    axios.get("/api/user/checkForWorkspaceMembership").then(res => {
      if (res.data.success) {
        if (!res.data.isSingleAdmin) {
          axios.get("/api/user/checkForProjectAdmin").then(Res => {
            if (Res.data.success) {
              if (!Res.data.isSingleAdmin) {
                this.setState({ showDeleteAccountModal: true });
              } else {
                this.setState({
                  projects: Res.data.projects,
                  showProjectsName: true
                });
              }
            }
          });
        } else {
          this.setState({
            workspaces: res.data.workspaces,
            showWorkspacesName: true
          });
        }
      }
    });
  }

  removeAccount = () => {
    this.props.deleteAccount().then(res => {
      if (res.data.success) {
        localStorage.setItem("userCurrentWorkspaceId", "");
        this.props.logout();
      } else {
      }
    });
  }

  // setDefault = values => {
  //   // let data={assisantName:this.state.assisant_name}
  //   this.setState({ defaultLoading: true })

  //   let data = { default: true }

  //   axios.put("/bot/api/workspace/" + this.props.match.params.wId + "/assistant_skills/" + values.tracker.default, data).then(res => {
  //     this.setState({ defaultLoading: false })
  //     if (res.data.success) {
  //       this.setState({ defaultSkill: res.data.skill.name })
  //       notification.success({
  //         key: "projectstatus",
  //         message: "Default Project Management Skill Updated",
  //         // description: "If there is data to be sent, it will reach the configured Slack channel",
  //         placement: "bottomLeft",
  //         duration: 2,
  //       })
  //     } else {
  //       notification.error({ message: 'Something went wrong when setting default tracker!' })
  //     }
  //   }).catch(err => {
  //     console.error(err)
  //     this.setState({ defaultLoading: false }) })
  // }

  timeZoneChange = (event, value) => {
    // this.setState({ timeZone: event, profileTimezoneChanged: true, timeZoneValue: event })
    this.setState({ profileTimezoneChanged: true, timeZone: event })
  }
  onWorkplacetimeZoneChange = (event) => {
    this.setState({ timeZoneValue: event, workspaceTimezoneChanged: true })
  }

  beforeUpload = file => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  saveConfigs = values => {
    let frequency = values.notification.frequency
    let event_type = values.notification.events
    let freqChanged = (values.notification.frequency !== this.state.channelNotifFreq)
    let evtChanged = (values.notification.events !== this.state.notifEvents)

    if (!freqChanged && !evtChanged && !this.state.check) {
      message.info({ content: `No change to notification configuration found.` })
    } else {
      let data = {
        channel_id: this.props.channelDefaultId,
        frequency,
        event_type,
        skill_id: this.state.skill._id,
        workspace_id: this.props.match.params.wId,
        user_id: this.props.user_id,
        is_bot_channel: true,
        status: this.state.status
      }
      this.props.saveDataTrooprConfigs(this.props.match.params.wId, data)
        .then(() => {
          message.success({ content: "Notification preference updated successfully" })
          this.setState({
            channelNotifFreq: frequency,
            notifEvents: event_type
          })
        })
    }
  }

  handleNotificationDisable = () => {
    this.setState({ status: !this.state.status, check: true })
  }

  onTimezoneChange = () => {
    const { offsetObj, timeZone } = this.state;
    const { updateUserInfo, updateUserWorkspaces } = this.props;

    let data = { timezone: timeZone }
    updateUserInfo(data).then(res => {
      if (res.data.success) {
        // this.setState({timezone:timeZonesObj.timezones[val].text})
      }
    });
    updateUserWorkspaces(offsetObj).then(res => {
      if (res.data.success) {
        //this.setState({timezone:timeZonesObj.timezones[val].text})
      }
    });
    // this.setState({ [e.target.name]: timeZoneVal });
    // this.setState({ modalTimeZone: !this.state.modalTimeZone });
  }
  onProfileNameChange = event => {
    this.setState({ profileName: event.target.value, profileNameChanged: true })
  };

  onWorkspacenamechange = event => {
    this.setState({ workspaceName: event.target.value, workspaceNameChanged: true })
  };

  isValid(data) {
    var errors = {};

    if (Validator.isEmpty(data.name.trim())) {
      errors.name = "This field is required";
    }
    this.setState({ errors: errors });

    return isEmpty(errors);
  }

  leavemodalToggle = () => {
    this.setState({ leavemodal: !this.state.leavemodal });
  }

  leaveWorkspace = () => {
    this.props.leaveWorkspace(this.props.match.params.wId).then(res => {
    })
    this.setState({ leavemodal: !this.state.leavemodal });
  }

  // handlePicChange=(info)=>{
  //   if (info.file.status === 'uploading') {
  //     this.setState({ loading: true });
  //     return;
  //   }
  //   if (info.file.status === 'done') {
  //     getBase64(info.file.originFileObj, imageUrl =>
  //       this.setState({
  //         imageUrl,
  //         loading: false,
  //       }),
  //     )
  //   }
  // }

  formRef = React.createRef()
  trackerFormRef = React.createRef()

  switchSubView = e => {
    let toView = e.key ? e.key : e;
    this.setState({
      settings_currentTab: toView
    })
    this.props.history.push(`/${this.props.match.params.wId}/settings?view=${toView}`)
  }
  onTabChange=(key)=>{
    this.setState({currentActiveKey:key.toString()})
    if(key==1){
      this.setState({
        settings_currentTab: "profile"
      })
      this.props.history.push(`/${this.props.match.params.wId}/settings`)
    }
    else if(key==2){
      this.setState({
        settings_currentTab: "workspace"
      })
      this.props.history.push(`/${this.props.match.params.wId}/settings?view=workspace`)
    }
    
    else if(key==3){
      this.setState({
        settings_currentTab: "product"
      })
      this.props.history.push(`/${this.props.match.params.wId}/settings?view=product`)
    }
    else if(key==4){
      this.setState({
        settings_currentTab: "upgrade"
      })
      this.props.history.push(`/${this.props.match.params.wId}/settings?view=upgrade`)
    }
    else if(key==5){
      this.setState({
        settings_currentTab: "admin"
      })
      this.props.history.push(`/${this.props.match.params.wId}/settings?view=admin`)
    }
    else if(key==6){
      this.setState({
        settings_currentTab: "notifications"
      })
      this.props.history.push(`/${this.props.match.params.wId}/settings?view=notifications`)
    }
    else if(key==7){
      this.setState({
        settings_currentTab: "labels"
      })
      this.props.history.push(`/${this.props.match.params.wId}/settings?view=labels`)
    }
    else if(key==='8'){
      this.setState({
        settings_currentTab: "appsumo"
      })
      this.props.history.push(`/${this.props.match.params.wId}/settings?view=appsumo`)
    }
    
  }

  handlePMChange = (value) => {
    this.setState({ defaultSkill: value });
  }

  jiraNotification = (e) => {
    e.preventDefault()
    let { wId } = this.props.match.params
    let skill_id=this.state.skills.filter(data=>data.name==='Jira')
    // this.props.history.push(`/${wId}/skills/${skill_id[0]._id}?view=personal_preferences`)
  }

  // onFeatureToggle = (check,feature) => {
  //   const {defaultSkill} = this.state;
  //   if(feature === "squads"){
  //   this.setState({squadsToggleLoading:true})
  //   this.props.updateWorkspace(this.props.match.params.wId, "", {showSquads:check}).then(res => {this.setState({squadsToggleLoading:false})})
    
  //   //if squads is the default tracker, changing it to Jira
  //   if(defaultSkill == "Troopr"){
  //     axios.put("/bot/api/workspace/" + this.props.match.params.wId + "/assistant_skills/" + "Jira", { default: true }).then( res => {
  //       if(res.data.success) {
  //         this.setState({defaultSkill:'Jira'})
  //         message.success("Default Project Management Skill Changed to Jira")
  //       }
  //     })
  //   }
  //   }
  //   else{
  //   this.setState({githubToggleLoading:true})
  //   this.props.updateWorkspace(this.props.match.params.wId, "", {showGithub:check}).then(res => {this.setState({githubToggleLoading:false})})

  //   //if github is the default tracker, changing it to Jira
  //   if(defaultSkill == "GitHub"){
  //     axios.put("/bot/api/workspace/" + this.props.match.params.wId + "/assistant_skills/" + "Jira", { default: true }).then( res => {
  //      if(res.data.success) {
  //        this.setState({defaultSkill:'Jira'})
  //        message.success("Default Project Management Skill Changed to Jira")
  //      }
  //     })
  //   }
  //   }
  // }

  onCustomFeedbackEmailChange = (value) => {
    this.props.updateWorkspace(this.props.match.params.wId, "", {customFeedbackemail:value}).then(res => {
      if(res.data.success) 
      message.success('Email updated successfully')
      else
      message.error('Error updating email')
    })
  }

  validateEmail = data => {
    if(data.Feedback.Email.length > 0){
      if (Validator.isEmpty(data.Feedback.Email) || !Validator.isEmail(data.Feedback.Email)) {
        message.error('Enter valid email address')
      } else {
        this.onCustomFeedbackEmailChange(data.Feedback.Email);
      }
    }else{
      this.onCustomFeedbackEmailChange("");
    }
  };

  // renderRedirect = () => {
  //   console.log(this.props.workspace._id);
  //   let redirectPath = `${this.props.workspace._id}/settings?view=profile`;
  //     return <Redirect to={redirectPath} />
  // }

  // getTrackerOptions = () => {
  //   const {workspace} = this.props
  //   let options = [];
  //   options = this.state.skills.map(skill => {
  //     if (skill.name == 'Jira'){
  //       return <Option value={skill.name}>{skill.name}</Option>
  //     }
  //     else if(skill.name == 'GitHub'){
  //       if('showGithub' in workspace){
  //         return workspace.showGithub ? <Option value={skill.name}>{skill.name}</Option> : ''
  //       }else{
  //         return <Option value={skill.name}>{skill.name}</Option>
  //       }
  //     }
  //     else if(skill.name == 'Troopr'){
  //       if('showSquads' in workspace){
  //         return workspace.showSquads ? <Option value={skill.name}>{skill.name}</Option> : ''
  //       }else{
  //         return <Option value={skill.name}>{skill.name}</Option>
  //       }
  //     }
  //   })
  //   return options;
  // }

  render() {
    const {workspace,user_now, members} = this.props
    const {squadsToggleLoading,githubToggleLoading} = this.state
    let wId = this.props.match.params.wId
    let isAdminDataLoaded=false
    let isAdmin=false
    if(members && members.length>0){
      let user=members.find((member)=>member.user_id && member.user_id._id === user_now._id && user_now)
      if(user && user.role){
        if(user.role=="admin"){
          isAdmin=true;
        }
        isAdminDataLoaded=true
      }else{
        isAdminDataLoaded=true
      }
    }
    return (
      // <Layout
      // style={{ background: (localStorage.getItem('theme') == 'default' ? "#ffffff" : "rgba(15,15,15)") }}
      // >
     <div className="settingscroll">
     <Layout
        style={{ marginLeft: 0/*,background: (localStorage.getItem('theme') == 'default' ? "#ffffff" : "rgba(15,15,15)"),height:"calc(100vh - 64px)","overflow-y":"auto"*/ }}
        >
          {this.state.settings_currentTab==="notifications" ?(
          <Fragment>
          <PageHeader
            title="Slack Notifications"
            extra={<Switch /*style={{marginLeft:"153px"}}*/ style={{marginTop:'inherit'}}  checked={this.state.status} onClick={this.handleNotificationDisable} />}
            style={{ maxWidth: 'fit-content'}}
            subTitle={`Squad Personal Notification directly to your Slack Bot`}
          />
          <Layout style={{
            padding: "16px 16px 32px 24px",
            // background: (localStorage.getItem('theme') == 'default' ? "#ffffff" : "rgba(15,15,15)") 
          }} >
            {/* <p >Squad Personal Notification directly to your Slack Bot</p> */}
            <Row className='content_row'>
              <Col span={24}>
                <Card size='small' title='Slack Notifications'>
              {!this.state.loading && <Form
                autocomplete="off"
                ref={this.formRef}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                name="userProfileForm"
                hideRequiredMark={true}
                initialValues={{
                  notification: {
                    frequency: this.state.channelNotifFreq,
                    events: this.state.notifEvents
                  },
                }}
                onFinish={this.saveConfigs}
              >
                <Form.Item labelAlign="left" label="Frequency" name={['notification', 'frequency']}>
                  <Select
                    // disabled={!this.state.notifStatus}
                    // name="projectNotif"
                    // style={{ width: "200px" }}
                    // value={this.state.channelNotifFreq}
                    placeholder="Select Frequency"
                    disabled={!this.state.status}
                  // onChange={this.onChangeFrequency}
                  style={{width:300}}
                  >
                    {ChannelFrequency.map((project, index) => (
                      <Option key={project.value} value={project.value}>
                        {project.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item labelAlign="left" label="Events" name={['notification', 'events']}>
                  <Select
                    placeholder="Select Event"
                    // onChange={this.handleChange}
                    // style={{ width: "300px" }}
                    // value={this.state.notifEvents}
                    defaultValue={notifEvent[0].name}
                    disabled={!this.state.status}
                    showSearch
                  style={{width:300}}
                  >
                    {notifEvent.map((project, index) => (
                      <Option key={project.value} value={project.value}>
                        {project.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item wrapperCol={{ span: 12, offset: 4 }} shouldUpdate={true}>
                  {() => (<Button
                    type="primary"
                    htmlType="submit"
                    disabled={
                      this.formRef &&
                      this.formRef.current &&
                      (!this.formRef.current.isFieldsTouched(false) ||
                        this.formRef.current.getFieldsError()
                          .filter(({ errors }) => errors.length).length) && (!this.state.check)
                    }
                  // onClick={this.saveConfigs}
                  >Save</Button>
                  )}
                </Form.Item>
              </Form>}
              </Card>
              </Col>
            </Row>
            <p ><a href="/" onClick={this.jiraNotification}>Jira Notification click here</a></p>
          </Layout>
        </Fragment>)
        :(
          <PageHeader
          title="Settings"
          ghost={false}
          footer={
            <div className="settingscroll">
            <Tabs defaultActiveKey="1" activeKey={this.state.currentActiveKey} onChange={this.onTabChange}>
              <TabPane tab="My Profile" key="1" />
              <TabPane tab="Workspace Profile" key="2" />
              {workspace.isRestricteDisabledProductInDashboard ? (isAdmin  ? <TabPane tab="Products" key="3" /> : '') : <TabPane tab="Products" key="3" />}
              {/*<TabPane tab="Appearance" key="2" />*/}
              {/*<TabPane tab="Absences" key="3" />*/}
              <TabPane tab="Billing" key="4" />
              <TabPane tab="Admin" key="5" />
              {/*("showSquads" in workspace ? workspace.showSquads : true) && <TabPane tab="My Notifications" key="6" />*/}
              {/*("showSquads" in workspace ? workspace.showSquads : true) && <TabPane tab="Labels" key="7" />*/}
              {workspace && workspace.subscribed_products && workspace.subscribed_products.plan_type && workspace.subscribed_products.plan_type === 'app_sumo_plan' && <TabPane tab="AppSumo" key="8" />}
            </Tabs>
            </div>
          }
        />)}
          {
            this.state.settings_currentTab === "notifications_temp" ? (
              <Fragment>
                <PageHeader
                  title="Slack Notifications"
                  extra={<Switch /*style={{marginLeft:"153px"}}*/ style={{marginTop:'inherit'}}  checked={this.state.status} onClick={this.handleNotificationDisable} />}
                  style={{ maxWidth: 'fit-content'}}
                  subTitle={`Squad Personal Notification directly to your Slack Bot`}
                />
                <Layout style={{
                  padding: "16px 16px 32px 24px",
                  // background: (localStorage.getItem('theme') == 'default' ? "#ffffff" : "rgba(15,15,15)") 
                }} >
                  {/* <p >Squad Personal Notification directly to your Slack Bot</p> */}
                  <Row className='content_row'>
                    <Col span={24}>
                      <Card size='small' title='Slack Notifications'>
                    {!this.state.loading && <Form
                      autocomplete="off"
                      ref={this.formRef}
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 14 }}
                      name="userProfileForm"
                      hideRequiredMark={true}
                      initialValues={{
                        notification: {
                          frequency: this.state.channelNotifFreq,
                          events: this.state.notifEvents
                        },
                      }}
                      onFinish={this.saveConfigs}
                    >
                      <Form.Item labelAlign="left" label="Frequency" name={['notification', 'frequency']}>
                        <Select
                          // disabled={!this.state.notifStatus}
                          // name="projectNotif"
                          // style={{ width: "200px" }}
                          // value={this.state.channelNotifFreq}
                          placeholder="Select Frequency"
                          disabled={!this.state.status}
                        // onChange={this.onChangeFrequency}
                        style={{width:300}}
                        >
                          {ChannelFrequency.map((project, index) => (
                            <Option key={project.value} value={project.value}>
                              {project.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item labelAlign="left" label="Events" name={['notification', 'events']}>
                        <Select
                          placeholder="Select Event"
                          // onChange={this.handleChange}
                          // style={{ width: "300px" }}
                          // value={this.state.notifEvents}
                          defaultValue={notifEvent[0].name}
                          disabled={!this.state.status}
                          showSearch
                        style={{width:300}}
                        >
                          {notifEvent.map((project, index) => (
                            <Option key={project.value} value={project.value}>
                              {project.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item wrapperCol={{ span: 12, offset: 4 }} shouldUpdate={true}>
                        {() => (<Button
                          type="primary"
                          htmlType="submit"
                          disabled={
                            this.formRef &&
                            this.formRef.current &&
                            (!this.formRef.current.isFieldsTouched(false) ||
                              this.formRef.current.getFieldsError()
                                .filter(({ errors }) => errors.length).length) && (!this.state.check)
                          }
                        // onClick={this.saveConfigs}
                        >Save</Button>
                        )}
                      </Form.Item>
                    </Form>}
                    </Card>
                    </Col>
                  </Row>
                  <p ><a href="/" onClick={this.jiraNotification}>Jira Notification click here</a></p>
                </Layout>
              </Fragment>
            // ) : this.state.settings_currentTab === "trackers"?  (
              // (this.state.isAdmin ? (
              // <Fragment>
              //     <PageHeader
              //       title="Project Management Services"
              //       subTitle="The selected Project Management service will be used as default when creating and tracking tasks/issues in Slack"
              //     />
              //     <Layout style={{
              //       padding: "16px 0 0 24px",
              //       background: (localStorage.getItem('theme') == 'default' ? "#ffffff" : "rgba(15,15,15)")
              //     }} >
              //       <div style={{ maxWidth: "500px" }}>
              //         {!this.state.loading && <Form
              //           ref={this.trackerFormRef}
              //           labelCol={{ span: 4 }}
              //           wrapperCol={{ span: 14 }}
              //           name="trackerForm"
              //           hideRequiredMark={true}
              //           initialValues={{
              //             tracker: {
              //               default: this.state.defaultSkill
              //             },
              //           }}
              //           onFinish={this.setDefault}
              //         >
              //           <Form.Item labelAlign="left" label="Default" name={['tracker', 'default']}>
              //             <Select style={{ width: "200px" }}
              //               //to disable this option:
              //               // uncomment -> disabled={workspace.created_by !== user_now._id}
              //               // comment -> disabled={false}
              //               // disabled={workspace.created_by !== user_now._id}
              //               disabled={false}
              //             // value={this.state.defaultSkill} 
              //             // onChange={this.handlePMChange}
              //             >
              //               {/* {this.state.skills.map(skill => (<Option value={skill.name}>{skill.name}</Option>))} */}
              //               {this.getTrackerOptions()}
              //             </Select>
              //           </Form.Item>
              //           <Form.Item wrapperCol={{ span: 12, offset: 4 }} shouldUpdate={true}>
              //             {() => (<Button
              //               // loading={this.state.defaultLoading}
              //               // onClick={this.setDefault} 
              //               htmlType="submit"
              //               // disabled={
              //               //   this.trackerFormRef &&
              //               //   this.trackerFormRef.current &&
              //               //   (!this.trackerFormRef.current.isFieldsTouched(false) ||
              //               //     this.trackerFormRef.current.getFieldsError()
              //               //       .filter(({ errors }) => errors.length).length)
              //               // }
              //               disabled = {false}
              //               type="primary">Save</Button>)}
              //           </Form.Item>
              //         </Form>}
              //         <Divider />
              //         {/* {this.state.defaultSkill==="Jira" && <div>To manage your Jira account <Button onClick={()=>{
              //         let jira_skill = this.state.skills.find(s=>s.name="Jira")
              //         // console.log("jira_skill:", JSON.stringify(jira_skill))
              //         let skill_id = jira_skill && jira_skill.skill_metadata && jira_skill.skill_metadata._id
              //         // console.log("skill_id:", skill_id)
              //         skill_id && this.props.history.push(`/${wId}/skills/${skill_id}`)}
              //       }
              //       type="link">Click here</Button></div>}
              //     {this.state.defaultSkill==="Troopr" && <Alert  message="Manage your Troopr Squads here" type="info"/>}
              //     {this.state.defaultSkill==="GitHub" && <Alert  message="Manage your GitHub account here" type="info"/>} */}
              //       </div>
              //     </Layout>
              //   </Fragment>) :
              // (
              //     <Redirect to={`/${this.props.workspace._id}/settings?view=profile`} />
              // ))
                
              ) : this.state.settings_currentTab === 'profile' ? (
                <>
              <UserProfile />
              {/*<Theme />*/}
              </>
            ) : this.state.settings_currentTab === "workspace" ? (
              <WorkspaceProfile isAdmin={isAdmin} skills={this.state.skills} defaultSkill = {this.state.defaultSkill}/>
            ) : this.state.settings_currentTab === "product" ? (
              <Products isAdmin={isAdmin} skills={this.state.skills} defaultSkill = {this.state.defaultSkill}/>
            ): this.state.settings_currentTab === "members" ? (
              <WorkspaceMembers />
            ) : this.state.settings_currentTab === "upgrade" ? (
              <Payment isAdmin={isAdmin} />
            ) : this.state.settings_currentTab === "labels" ? (
              <Labels />
              ) : this.state.settings_currentTab === "theme" ? (
                <Theme />
                ) : this.state.settings_currentTab === "absences" ? (
                  <Absences />
                ) : this.state.settings_currentTab === "appsumo" ? (
                  <AppsumoInfo />
            )
//              : this.state.settings_currentTab === "features" ? (
//               (this.state.isAdmin ? (
//             <Fragment>
              // <PageHeader
//                 title="Features"
//                 subTitle="Enable / Disable features in Troopr"
//               />
//               <Layout style={{
//                 padding: "16px 0 0 24px",
//                 background: (localStorage.getItem('theme') == 'default' ? "#ffffff" : "rgba(15,15,15)")
//               }} >
//                 {/* <div style={{ maxWidth: "700px" }}>
// <div>Show Squds <Switch style={{marginLeft:'16px'}} checked={"showSquads" in workspace ? workspace.showSquads : true}></Switch></div><br/>
// <div style={{marginTop:"px"}}>Show Github <Switch style={{marginLeft:'16px'}} checked={"showGithub" in workspace ? workspace.showGithub : true}></Switch></div>
// </div> */}

//                 <Row>
//                   <Col span={1}>Squads</Col>
//                   <Col><Switch style={{ marginLeft: '16px' }} checked={"showSquads" in workspace ? workspace.showSquads : true} onChange={(e) => this.onFeatureToggle(e, 'squads')} loading={squadsToggleLoading}></Switch></Col>
//                 </Row>
//                 <Row style={{ marginTop: '16px' }}>
//                   <Col span={1}>GitHub</Col>
//                   <Col><Switch style={{ marginLeft: '16px' }} checked={"showGithub" in workspace ? workspace.showGithub : true} onChange={(e) => this.onFeatureToggle(e, 'github')} loading={githubToggleLoading}></Switch></Col>
//                 </Row>
//               </Layout>
//             </Fragment>
//               ) : (
//               <Redirect to={`/${this.props.workspace._id}/settings?view=profile`} />
//               ))
//             ) 
            // : (this.state.settings_currentTab === "feedback")  ? (
            //   (this.state.isAdmin ? (
            //     <Feedback/>
            //   ) : (
            //   <Redirect to={`/${this.props.workspace._id}/settings?view=profile`} />
            //   ))
              
            // )
            : this.state.settings_currentTab === "admin" ? isAdminDataLoaded?(
              // (isAdmin ? (
                  <Admin 
                    isAdmin={isAdmin}
                  />
              // ) : (
              //     <Redirect to={`/${this.props.workspace._id}/settings?view=profile`} />
              // ))
          ):("") : ("")}
        </Layout>
        </div>
    );
  }

}

const mapStateToProps = state => {
  // console.log("REDUX UPD!")
  return {
    channelDefaultId: state.skills.personalSetting.id,
    user_now: state.common_reducer.user,
    user_name: state.common_reducer.user.name,
    user_id: state.common_reducer.user._id,
    user_timezone: state.skills.user.timezone,
    // workspace: state.skills.workspace,
    workspace_timezone: state.common_reducer.workspace.timezone,
    members: state.skills.members,
    workspace_name: state.common_reducer.workspace.name,
    workspace: state.common_reducer.workspace,
    // skills: state.skills
    // profilePic:state.common_reducer.user.profilePicUrl
  }
}

export default withRouter(
  connect(mapStateToProps, {
    personalSetting, leaveWorkspace, updateWorkspace, deleteAccount, saveDataTrooprConfigs, getSkillId, getTrooprUserChannelConfig, updateUserInfo,
    // getProfileinfo, 
    updateUserWorkspaces, getWorkspaceMembers, getWorkspace, deleteWorkspaceMember, updateMembership, sendWorkspaceInvite
  })(Workflow)
)