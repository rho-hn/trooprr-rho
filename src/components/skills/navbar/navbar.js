import React, { Component, Fragment } from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Layout, Modal, Radio, Tabs, PageHeader, Tag, Menu, Typography, Button,Tooltip, notification } from 'antd';
import moment from "moment";
import { withRouter } from "react-router-dom";
import { logout } from '../../auth/authActions';
import { setCurrentUser } from "../../auth/authActions"
import './navbar.css';
import { connect } from 'react-redux';
import { checkSlackLink, emailSubscribe, getEmailSubscription, getSkillUser } from "../skills_action";
import queryString from "query-string";
import { BorderRightOutlined, ArrowLeftOutlined,InfoCircleOutlined } from '@ant-design/icons';
const { TabPane } = Tabs;
const {Sider} = Layout;
const {Title} = Typography;

const jira_titles =[
  {tab:"connection",
    title:"Connection",
    subtitle:"Jira domain connection for workspace",
    tag:"Connected"
  },
  {tab:"channel_preferences",
    title:"Channel Preferences",
    // subtitle:"Notification settings and Issue creation defauts for Slack channels",
    subtitle:"Manage issue updates and alerts in Project Channel(s)",
    tag:null
  },{
    tab:"personal_preferences",
    title:"Personal Preferences",
    subtitle:"Jira personal account, personal notification settings and issue creation defaults",
    tag:null
  },
  {
    tab: "appHome",
    title: "Personal Reports",
    subtitle : "Jira Personal Reports",
    tag: null
  },
  {tab:"reports",
    // title:"Jira Schedule Reports & Nudges",
    title:"Reports & Nudges",
    subtitle:"Schedule Project Reports directly to your Slack Channels",
    tag:null
  },{tab:"user_mappings",
    title:"User mapping",
    // subtitle:"Atlassian User account & Slack User Account mapping",
    subtitle:"Map Jira User accounts to Slack users",
    tag:null
  },
]
const confluence_titles =[
  {tab:"connection",
    title:"Connection",
    subtitle:"Jira domain connection for workspace",
    tag:"Connected"
  },
  {tab:"channel_preferences",
    title:"Channel Preferences",
    subtitle:"Automatically answer employee requests in Wiki Channel(s)",
    tag:null
  },
  
  {tab:"analytics",
    title:"Analytics",
    subtitle:"Use Analytics to understand usage and get better adoption",
    tag:null
  }
]
const github_titles =[
  { tab:"connection",
    // title:"GitHub Connection",
    title:"Connection",
    subtitle:"GitHub Organization account for workspace",
    tag:"Connected"
  },
  {tab:"channel_preferences",
    title:"Channel Preferences",
    // title:"GitHub Channel Preferences",
    subtitle:"Notification settings and Issue creation defauts for Slack channels",
    tag:null
  },{tab:"personal_preferences",
    title:"Personal Preferences",
    // title:"GitHub Personal Preferences",
    subtitle:"GitHub personal account, personal notification settings and issue creation defaults",
    tag:null
  },{tab:"reports",
    // title:"GitHub Schedule Reports & Nudges",
    title:"Schedule Reports & Nudges",
    subtitle:"Schedule Project Reports directly to your Slack Channels",
    tag:null
  },{
    tab:"automations",
    title:"GitHub Automations",
    title:"Automations",
    subtitle:"Automate GitHub Project card column update based on status of linked PR",
    tag:null
  },
]

class Navbar extends Component {

  state = {
    visible: false,
    sendEmail: false,
    emailState: "",
    collapsed: false,
    tabState:"connection",
    title:"",
    subtitle:"",
    tag:"",
    isJiraChannelDefaultConfiguration:false
  }
  onCollapse = collapsed => {
    // console.log(collapsed);
    this.setState({ collapsed: !this.state.collapsed });
  };

  TabChange(key){
    this.setState({tabState:key});
    // this.setTitles();
  }

  componentDidMount() {
    let userId = localStorage.getItem("trooprUserId");

    this.props.checkSlackLink(localStorage.getItem("userCurrentWorkspaceId"));
    this.props.getEmailSubscription(this.props.match.params.wId, userId).then(data => {
      if (this.props.emailSubscription) {

        this.setState({
          emailState: "Subscribe"
        })
      } else {
        this.setState({
          emailState: "unSubscribe"
        })
      }
    })

    this.handleTabs()
    
    // if (parsedQueryString.view && parsedQueryString.channel_name && parsedQueryString.channel_id) {
    //   this.setState({ tabState: 'channel_preferences' });
    //   this.props.history.push(
    //     "/" +
    //       this.props.match.params.wId +
    //       "/skills/" +
    //       this.props.match.params.skill_id +
    //       "?view=channel_preferences&channel_name=" +
    //       parsedQueryString.channel_name +
    //       "&channel_id=" +
    //       parsedQueryString.channel_id
    //   );
    // }
    // this.setTitles();
    
  }

  componentDidUpdate(prevProps){
    if(this.props.location.search !== prevProps.location.search){
      this.handleTabs()
    }
  }

  handleTabs = () => {
    const parsedQueryString = queryString.parse(window.location.search);

    if (parsedQueryString.view == 'user_mappings') {
      this.setState({ tabState: 'user_mappings'});
      this.props.onTabClick('user_mappings');
    }
    else if (parsedQueryString.view == 'connection' || !parsedQueryString.view) {
      this.setState({ tabState: 'connection' });
      this.props.onTabClick('connection');
    }
    else if (parsedQueryString.view == 'channel_preferences') {
      if (parsedQueryString.channel_name!==undefined && parsedQueryString.channel_id!==undefined) {
        
        this.setState({ tabState: 'channel_preferences',isJiraChannelDefaultConfiguration : true });
      }
      else{

        this.setState({ tabState: 'channel_preferences',isJiraChannelDefaultConfiguration : false });
        this.props.onTabClick('channel_preferences');
      }
    }
    else if (parsedQueryString.view == 'personal_preferences') {
      this.setState({ tabState: 'personal_preferences' });
      this.props.onTabClick('personal_preferences');
    }
    else if (parsedQueryString.view == 'reports') {
      this.setState({ tabState: 'reports' });
      if(!parsedQueryString.report_id){
        this.props.onTabClick('reports');
      }
    }
    else if (parsedQueryString.view == 'automations') {
      this.setState({ tabState: 'automations' });
      this.props.onTabClick('automations');
    }
    else if (parsedQueryString.view == 'guest') {
      this.setState({ tabState: 'guest' });
      this.props.onTabClick('guest');
    }else if(parsedQueryString.view =="analytics"){

      this.setState({ tabState: 'analytics' ,isJiraChannelDefaultConfiguration : true});
      // this.props.onTabClick('analytics');

    }
  }


  setTitles(){
    var a;
    var b;
    var c;
    const parsedQueryString = queryString.parse(window.location.search);
    if(this.props.currentSkill.name==="Jira"){
      jira_titles.map((item)=>{
        if(item.tab===this.state.tabState){
          a=item.title;
          b=item.subtitle
          c=item.tag

          const {sub_skill} = this.props.match.params
          if(this.state.tabState === 'channel_preferences' && sub_skill === 'jira_service_desk'){
            b = 'Manage employee requests in Support and Agent channel(s)'
          }

          if(parsedQueryString.channel_id) b = ''
        }
        }
      )
    }
    else if(this.props.currentSkill.name==="Wiki" || this.props.currentSkill.key==="wiki"){
      confluence_titles.map((item)=>{
        if(item.tab===this.state.tabState){
          a=item.title;
          b=item.subtitle
          c=item.tag
        }
        if(parsedQueryString.channel_id) b = ''
      })

    }
    return [a,b,c]
  }

  sendtoslack = () => {
    const { } = this.props
    const app = localStorage.getItem('app');
    // const teamId = assistant.id
    let teamId = localStorage.getItem("teamId");

    let url = '';
    if (app && teamId) {
      url = `https://slack.com/app_redirect?app=${app}&team=${teamId}`
    } else {
      url = `https://slack.com`;
    }
    window.location.href = url;

  }
  // assistantClick = () => {
  //   const workspace_id = localStorage.getItem('userCurrentWorkspaceId')
  //   this.props.history.push(`/${workspace_id}/skills`);
  // }

  settingClick = () => {
    const workspace_id = localStorage.getItem('userCurrentWorkspaceId');
    this.props.history.push(`/${workspace_id}/skill/settings`)
  }

  redirectToBuilder = () => {
    const workspace_id = localStorage.getItem('userCurrentWorkspaceId');
    // this.props.history.push(`/${workspace_id}/skill/skillsetdetails`)
    this.props.history.push(`/${workspace_id}/skill/create_skill`)
  }
  redirectToCard = () => {
    const workspace_id = localStorage.getItem('userCurrentWorkspaceId');
    if (this.props.cardtitle === "New Skill") {
      this.props.history.push(`/${workspace_id}/skill/create_skills`)
    }
    else { this.props.history.push(`/${workspace_id}/card/create_card`) }


  }


  logoutFromApp = () => {
    localStorage.setItem("userCurrentWorkspaceId", "");
    this.props.logout();
    this.props.history.push('/troopr/access');
  }
  unlinkJiraAccountToggle = () => {
    window.location.href = "https://troopr.drift.help/"
  }

  openPreferenceModal = () => {
    this.setState({
      visible: true
    })
  }

  sendEmail = (value, emailState) => {
    this.setState({
      emailState: emailState
    })
    // console.log("=========>sendemail");
    let userId = localStorage.getItem("trooprUserId");
    let data = {
      userId,
      email_subscription: value
    }
    // if(this.state.sendEmail){
    //   axios.post("https://cors-anywhere.herokuapp.com/https://app-stage.troopr.io/api/workspace/"+this.props.match.params.wId+"/sendemail",data)
    //   .then(res=>{
    //     console.log("res=====>",res)
    //   })
    // }
    this.props.emailSubscribe(this.props.match.params.wId, data);

  }

  // onTabClick=(key)=>{


  //       this.props.history.push("/"+this.props.match.params.wId+"/"+key)

  // }

  // doNotSendEmail = ()=>{
  //   this.setState({
  //     emailState:"unSubscribe"
  //   })


  // }


  // menus = () => {
  //   return <Menu>
  //     {/* <Menu.Item onClick={this.goToUserJiraLogin}>
  //                 Assistant preference
  //               </Menu.Item>
  //               <Menu.Item onClick={this.unlinkJiraAccountToggle}>
  //                 Personal preference
  //               </Menu.Item> */}
  //     <Menu.Item >
  //       <div className="navbar_icon_inner">

  //         <div className="navbar_radius row_flex align_center justify_center" style={{ height: "36px" }}>
  //           {this.props.username && this.props.username.charAt(0).toUpperCase()}</div>

  //         <div className="navbar_username"><div className="navbar_username">{this.props.username}</div><div className="navbar_slackName">{this.props.assistant.name}</div></div>

  //       </div>
  //     </Menu.Item>
  //     {/* <Menu.Item >
  //                <a  onClick={this.openPreferenceModal} style={{textDecoration:"none" }}>Preferences</a>
  //               </Menu.Item>  */}
  //     <Menu.Item >
  //       <a href="https://troopr.drift.help/ " target="_blank" style={{ textDecoration: "none" }}>Help</a>
  //     </Menu.Item>
  //     <Menu.Item onClick={this.logoutFromApp}>
  //       Logout
  //               </Menu.Item>
  //   </Menu>
  // }

  onOk = () => {
    this.setState({
      visible: false
    })
  }

  onCancel = () => {
    this.setState({
      visible: false
    })
  }
  
  // componentDidUpdate(){

  //   console.log("COMPONENT DID UPDATE");
  // }
  // componentWillUpdate(){
    
  //   console.log("COMPONENT WILL UPDATE");
  // }
  // componentWillMount(){

  //   console.log("COMPONENT WILL MOUNT");
  // }


  goBack = () => {

    this.props.history.push("/" + this.props.wId + "/skills")
  }

  getChannelDefaultHeaderActions = (tabName) => {
    const { currentSkill, commonChanneldata, confluenceChannelConfig } = this.props
 
    const parsedQueryString = queryString.parse(window.location.search);
   
    const channelConfig = commonChanneldata && commonChanneldata.find(el => (el.channel_id === parsedQueryString.channel_id))
    const isWiki=currentSkill&&(currentSkill.name==="Wiki")
    const showToolTip=channelConfig?(channelConfig.createdAt||channelConfig.updatedAt||channelConfig.createdBy||channelConfig.updatedBy)?true:false :false  
    const confluenceShowToolTip = confluenceChannelConfig ? (confluenceChannelConfig.created_at || confluenceChannelConfig.updatedAt || confluenceChannelConfig.created_by || confluenceChannelConfig.updated_by) ? true : false : false
    
      // {console.log(this.props.currentSkill, parsedQueryString, selectedChannel)}
      return (
                   <Title level={3} style={{ display: "flex" }}> 
                    <Button
                onClick={this.showChannelSetting}
                icon={<ArrowLeftOutlined />}
                style={{ marginRight: "16px" }}
              >
                {/*Back*/}
                All Channels
          </Button>
                {/* Channel: {selectedChannel && selectedChannel.name && selectedChannel.name || parsedQueryString.channel_name || ''} </Title> */}
                Channel: {parsedQueryString.channel_name || ''}
                
          {showToolTip &&!isWiki&& <Tooltip
            title={
              <>
                {channelConfig.createdBy && <><span>Created By:{(channelConfig && channelConfig.createdBy && channelConfig.createdBy.user_id) ? (channelConfig.createdBy.displayName || channelConfig.createdBy.name) : ""} </span>
                  <br />
                </>
                }
                {channelConfig.createdAt && <><span>Created At: {(channelConfig && channelConfig.createdAt) ? moment(new Date(channelConfig.createdAt)).format(
                  "dddd, DD MMM YYYY"
                ) : ""}</span>
                  <br />
                </>
                }
              
                {channelConfig.updatedBy && <> <span>Last Updated By: {(channelConfig && channelConfig.updatedBy && channelConfig.updatedBy.user_id) ? (channelConfig.updatedBy.displayName || channelConfig.updatedBy.name) : ""}</span>
                  <br />
                </>
                }
                {channelConfig && channelConfig.updatedAt && <span>Last Updated At: {(channelConfig && channelConfig.updatedAt) ? moment(new Date(channelConfig.updatedAt)).format(
                  "dddd, DD MMM YYYY"
                ) : ""}
                </span>
              
                }
              </>
            }
          >
            <InfoCircleOutlined

              style={{ marginLeft: 8, marginTop: 4 }}
            />
          </Tooltip>
          }

          {confluenceShowToolTip && isWiki && <Tooltip
            title={
              <>
                {confluenceChannelConfig.created_by && <><span>Created By:{(confluenceChannelConfig && confluenceChannelConfig.created_by && confluenceChannelConfig.created_by.user_id) ? (confluenceChannelConfig.created_by.displayName || confluenceChannelConfig.created_by.name) : ""} </span>
                  <br />
                </>
                }
                {confluenceChannelConfig.created_at && <><span>Created At: {(confluenceChannelConfig && confluenceChannelConfig.created_at) ? moment(new Date(confluenceChannelConfig.created_at)).format(
                  "dddd, DD MMM YYYY"
                ) : ""}</span>
                  <br />
                </>
                }

                {confluenceChannelConfig.updated_by && <> <span>Last Updated By: {(confluenceChannelConfig && confluenceChannelConfig.updated_by && confluenceChannelConfig.updated_by.user_id) ? (confluenceChannelConfig.updated_by.displayName || confluenceChannelConfig.updated_by.name) : ""}</span>
                  <br />
                </>
                }
                {confluenceChannelConfig && confluenceChannelConfig.updatedAt && <span>Last Updated At: {(confluenceChannelConfig && confluenceChannelConfig.updatedAt) ? moment(new Date(confluenceChannelConfig.updatedAt)).format(
                  "dddd, DD MMM YYYY"
                ) : ""}
                </span>

                }
              </>
            }
          >
            <InfoCircleOutlined

              style={{ marginLeft: 8, marginTop: 4 }}
            />
          </Tooltip>
          }
          
        </Title>
      )
  }

  showChannelSetting = () => {
    const {currentSkill} = this.props
    // this.props.history.push(`/${this.props.match.params.wId}/skills/${currentSkill._id}?view=channel_preferences`)
    this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}${this.props.match.params.sub_skill ? '/' + this.props.match.params.sub_skill :  '' }?view=channel_preferences`)
  }

  notificationClick = (key) => {
    notification.close(key)
    this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}/${this.props.match.params.sub_skill}?view=personal_preferences`)
   }

  gotoSetupDemoChannel = (jiraSkill) => {
    this.props.getSkillUser(this.props.match.params.wId, this.props.match.params.skill_id).then((res) => {
      if (res.data.success) {
        if (res.data.skillUser && res.data.skillUser.token_obj && res.data.skillUser.token_obj.access_token) {
          this.props.history.push(`/${this.props.match.params.wId}/jiraConnectionSteps/${jiraSkill.skill_metadata._id}?domainName=${jiraSkill.skill_metadata.metadata.domain_url}&sub_skill=${this.props.match.params.sub_skill}&from=setup_demo_channel_button`)
        }else{
          const key = `open${Date.now()}`;
          const link = (
            <a onClick={() => this.notificationClick(key)}>
              here
            </a>
          );
          const des = (
            <p>You need to verify your jira account in order to setup demo channel. Verify your account by clicking {link}</p>
          );
          notification["error"]({
            message: "Cant setup demo channel",
            description: des,
            key,
          });
        }
      }
    });
  }

  render() {
    //  console.log("this.props",this.props);
    var x = this.setTitles();
    const { headerInfo } = this.props
    const parsedQueryString = queryString.parse(window.location.search);

    const jiraSkill = this.props.skills.find(skill => skill.key === 'jira')


    return (
      <div className="navbar_head"> 
{/* <Icon type="menu-fold" />
<Icon type="menu-unfold" /> */}
        <Layout  style={{height:"70px",marginLeft:0}}>
        <Fragment>
              <Layout style={{ 
                  // background: (localStorage.getItem('theme') == 'default' ? "#ffffff" : "rgba(15,15,15)"),
                  overflow:"hidden"}} >
                  <PageHeader
                  // avatar={headerInfo.iconUrl ? { src: headerInfo.iconUrl } : { style: { backgroundColor: '#402E96' }, icon: headerInfo.icon }}
                    //style={{maxWidth:1440}}
                    title={
                      <Fragment>
                        {/* <LegacyIcon
                          className="trigger"
                          type={
                            this.state.collapsed ? "menu-unfold" : "menu-fold"
                          }
                          onClick={this.onCollapse}
                        /> */}
                        <span >
                        {this.props.currentSkill && (this.props.currentSkill.name === 'Jira'||(this.props.currentSkill.key === 'wiki' || this.props.currentSkill.name === 'Wiki')) && parsedQueryString && parsedQueryString.view && parsedQueryString.view === 'channel_preferences' && (parsedQueryString.channel_id && parsedQueryString.channel_name) ?
                        this.getChannelDefaultHeaderActions(x[0])
                        :
                        x[0]}
                        </span>
                      </Fragment>
                    }
                    subTitle={
                      <div>{x[1]}</div>
                    }
                    tags={
                      
                      
                      (this.props.currentSkill.linked || (this.props.currentSkill && this.props.currentSkill.skill_metadata && this.props.currentSkill.skill_metadata.linked)) ? x[2] ? <Tag color='green'>{x[2]}</Tag> : null : <Tag color='orange'>Not Connected</Tag>
                    }
                    extra={
                        this.props.currentSkill && (this.props.currentSkill.name === 'Jira' || this.props.currentSkill.key === 'jira') && (this.props.currentSkill.linked || this.props.currentSkill.skill_metadata && this.props.currentSkill.skill_metadata.linked) && parsedQueryString && parsedQueryString.view && ((parsedQueryString.view === "channel_preferences" && !parsedQueryString.channel_id) || parsedQueryString.view === 'connection')  && this.props.currentSkill.name === "Jira" && jiraSkill && /* jiraSkill.skill_metadata._id ===  */
                        <Button onClick={() => this.gotoSetupDemoChannel(jiraSkill)}>{this.props.match.params.sub_skill === 'jira_reports' ? 'Setup Demo Report' : 'Setup Demo Channel'}</Button>
                    }
                    // subTitle={x[1]}
                  />
                  <Layout
                    style={{
                      padding: "32px 24px",
                      // background: (localStorage.getItem('theme') == 'default' ? "#ffffff" : "rgba(15,15,15)"),
                      heigth: "100vh"
                    }}
                  />
                </Layout>
              </Fragment>

         
        </Layout>

        {
          this.state.visible && <Modal title="Basic Modal"
            visible={this.state.visible}
            // onOk={this.handleOk}
            // onCancel={this.handleCancel}
            onOk={this.onOk}
            onCancel={this.onCancel}
          >
            <div>
              <div>
                <Radio.Group defaultValue={this.state.emailState} buttonStyle="solid">
                  <Radio.Button onClick={() => this.sendEmail(true, "Subscribe")} value="Subscribe">Send mail</Radio.Button>
                  <Radio.Button onClick={() => this.sendEmail(false, "unSubscribe")} value="unSubscribe">Do Not send mail</Radio.Button>

                </Radio.Group>
              </div>

            </div>
          </Modal>
        }


      </div>
    );
  }
}

const mapStateToProps = (store) => {

  return {
    username: store.auth.user.name,
    assistant: store.skills.team,
    emailSubscription: store.skills.emailSubscription,
    currentSkill : store.skills.currentSkill,
    channels: store.skills.channels,
    skills: store.skills.skills,
    commonChanneldata: store.skills.commonChanneldata,
    confluenceChannelConfig: store.skills.confluence_channel_config
  }
}


export default withRouter(connect(mapStateToProps, { logout, setCurrentUser, checkSlackLink, emailSubscribe, getEmailSubscription,getSkillUser })(Navbar));
