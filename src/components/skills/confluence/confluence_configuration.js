import React, { Component } from "react";
import axios from 'axios'
import {



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
  updateAssisantSkills

} from "../skills_action";
import {getUserWorkspaceMembership} from "../../common/common_action"

import { SettingOutlined} from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import {setWorkspace} from "../../common/common_action"



import '@ant-design/compatible/assets/index.css';
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
  Typography
} from "antd";
import moment from "moment";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Validator from "validator";
import isEmpty from "lodash/isEmpty";
import JiraServerModal from '../jira/jira_server_modal';
import JiraToken from "../jira/jiraConnectionFlow/jiraToken"
import jwt from "jsonwebtoken"
import { isValidUser } from "../../../utils/utils";
const { Panel } = Collapse;
// import bcrypt from 'bcryptjs';
const Jira_skill_id = localStorage.getItem("Jira_skill_id");
const { SubMenu } = Menu
const {Content} = Layout
const {Text} = Typography
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
      adminMailId: '',
      adminUserId: '',
      newConnectionModal: false,
      loading: false,
      isUnfurlLink:false,
      isAdmin: false,
      isThreadSyncUnfurl: false,  // Only for unfurl
      isThreadSyncTaskIt: false,  // Only for task it
      loadingPricing:false,payment:{},
      urlModal:false,
      doamin_url:"",
      connections:[],
      gridLoading:false,
      isUnfurl: false,
      unfurlResponseInThread: false,
      taskItResponseInThread: false,
      isSoftwareEnabled:true,
      isServiceDeskEnabled : true,
      showStatusUpdateInThread : true
    };
    this.onChangeChannel = this.onChangeChannel.bind(this);
 
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

  disconnectOnClickModel = async (isAllowed) => {

    if (isAllowed) {
      this.setState({ disconnectModel:!this.state.disconnectModel });
      // this.updateSkill({metadata:undefined,linked:false})
    } else {
   
      message.error("Please contact your Confluence Admin to disconnect");
    }
  };




  switchButtonStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  }

  getExistingGridConnections() {
    axios.get("/bot/api/" + this.props.match.params.wId + "/grid_jira_connections").then(data => {
      this.setState({ gridLoading: false })
      if (data.data.success) {
        this.setState({ connections: data.data.skills })
      }
    })
  }
  menu = () => {
    return (
      <Menu>
        <Menu.Item key="0">
          <a onClick={()=>this.wikiOuathPage("cloud")}>New Confluence Cloud Connection</a>
        </Menu.Item>
        {/* <Menu.Item key="1">
          <a onClick={this.openConnectModal}>New Confluence Server/Data Center Connection</a>
        </Menu.Item> */}
        <Menu.Item key="2">
          <a onClick={()=>this.wikiOuathPage("server")}>New Confluence Server/Data Center Connection</a>
        </Menu.Item>
       {/* { this.state.connections.length>0&&<>
        <Menu.Divider />
    <SubMenu title="Use existing from Grid">
      <Menu.ItemGroup title="Confluence connections in Grid">
      {this.state.connections.map(connection=> <Menu.Item key={connection._id}>
        <Popconfirm
                          title= {<div >
                          Are you sure you want to use the following Confluence connection from the Grid?
                          <br />
                          <b>Confluence domain: {connection.url}</b>
                         {connection.connected_as &&<br/>}
                          {connection.connected_as && `Connected as: ${connection.connected_as.displayName} ${connection.connected_as.emailAddress ? `(${connection.connected_as.emailAddress})` : ""}`}
                          <br />
                          Are you sure?
                          <br />
                        </div>}
                          onConfirm={()=>this.addGridToken(connection._id)}
                          okText='Yes'
                          cancelText='No'
                        >
                         {connection.url}
                        </Popconfirm>
  
        </Menu.Item>)


        }
      </Menu.ItemGroup>
    </SubMenu></>} */}
       
      </Menu>
    );
  };
 async componentDidMount() {
  
    let {isUnfurl, isUnfurlLink, unfurlResponseInThread, taskItResponseInThread, isThreadSyncUnfurl, isThreadSyncTaskIt,isSoftwareEnabled , isServiceDeskEnabled, showStatusUpdateInThread} = this.props.skill;
    this.props.getUserWorkspaceMembership(this.props.match.params.wId)
    this.setState({
      isUnfurl,
      isUnfurlLink,
      unfurlResponseInThread,
      taskItResponseInThread, 
      isThreadSyncUnfurl,
      isThreadSyncTaskIt,
      isSoftwareEnabled,
      isServiceDeskEnabled,
      showStatusUpdateInThread
    })
   let {skill}=this.props

   let isLinked = skill.skill_metadata
   ? skill.skill_metadata.linked
   : skill.linked;
   if(isLinked){
    let domainname = skill.skill_metadata  ? skill.skill_metadata.metadata.domain_name : skill.metadata.domain_name;
    let jiraUrl =  skill.skill_metadata? skill.skill_metadata.metadata.domain_url : skill.metadata.domain_url?skill.metadata.domain_url:`https://${domainname}.atlassian.net`;
   
     this.setState({domain_url:jiraUrl})
   }else{
    this.getExistingGridConnections();
   }
   
    
  
   

      this.setState({loadingUser: true})
      this.props
      .getUser(
        this.props.skill.skill_metadata
          ? this.props.skill.skill_metadata.jiraConnectedId
          : this.props.skill.jiraConnectedId
      )
      .then(res => {
        // console.log("pulled admin user info:" + JSON.stringify(res))
        // console.log("connectorUser: ", res.data);
        this.setState({ loadingUser: false });
        // console.log("componentDidMount:props.getUser(" + this.props.skill.jiraConnectedId + ")" + JSON.stringify(res.data))
        if (res.data.user) {
          this.setState({
            adminUserName: res.data.user.displayName || res.data.user.name, 
            adminMailId: res.data.user.email,
            adminUserId: res.data.user.user_id
          });
        }
      });
    


    
  }

  onChangeChannel = (event, value) => {
    //value gets all the props
    //event gets the value props
    this.setState({
      selectedChannel: event,
      selectedChannelName: value.props.children
    });
  };


  updateSkill(data) {
    const { skill, workspace,skills } = this.props;
   
    let skillId =skill && skill.skill_metadata ? skill.skill_metadata._id : skill._id;
    let wId =skill && skill.skill_metadata? skill.skill_metadata.workspace_id : skill.workspace_id;

    this.props.updateSkill(skillId, wId, data).then(res => {
      this.setState({ disconnectModel: !this.state.disconnectModel });
   
      this.props.history.push(
        "/" +
        this.props.workspace_id +
        "/skills/" +
        this.props.currentSkill._id
      );
    });
  }

  updateSkillToggle = data => {
    this.props
      .updateSkill(this.props.skill._id, this.props.skill.workspace_id, data)
      .then(res => { });
  };

  onChangeSearch = event => {
    this.setState({ searchChannel: event.target.value });
  };

  validateEmail = data => {
    let errors = {};
    if (Validator.isEmpty(data)) {
      errors.isEmail = "This field is required";
    } else if (!Validator.isEmail(data)) {
      errors.isEmail = "Email is invalid";
    }

    this.setState({
      error: errors
    });
    return isEmpty(errors);
  };

  // onChange = (event, { newValue }) => {
  //   this.setState({
  //     value: newValue
  //   });
  // };

  getToken = () => {

    const isTokenisThere = this.props.currentSkill && this.props.currentSkill.metadata &&this.props.currentSkill && this.props.currentSkill.metadata.token_obj&&this.props.currentSkill.metadata.token_obj.userToken
    let tokenInfo=isTokenisThere?this.props.currentSkill.metadata.token_obj:{}
    this.setState({
      userName: isTokenisThere
        ? tokenInfo.userName
        : "",
      userToken: isTokenisThere
        ? tokenInfo.userToken
        : "",
      getToken: true
    });
  };

  // Delete token Start
  deleteToken = (allowed) => {
    const { skill } = this.props;
   

    if (allowed) {
      let skillId = skill && skill.skill_metadata ? skill.skill_metadata._id : skill._id;
      let wId = skill && skill.skill_metadata ? skill.skill_metadata.workspace_id : skill.workspace_id;
      this.setState({ loading: true })
      this.props.updateSkill(skillId, wId, { "metadata.token_obj":null}, this.props.currentSkill).then(res => {
        if (res.data.success) {
          this.setState({ loading: false })
          message.success('Token deleted')
        }
      })
    } else { message.error('You are not having permission to delete token.Contact your jira admin.') }
  };
  // Delete token End

  doNotShowModal = () => {
    this.setState({
      getToken: false
    });
  };

  getUserName = event => {
    // if(event.target.value){
    this.setState({
      userName: event.target.value
    });
    // }
  };

  getUserToken = event => {
    // console.log("event--->",event.target.value)
    // if(event.target.value){
    this.setState({
      userToken: event.target.value
    });
    // }
  };
  

  submitTokenData = () => {

    this.invokeChildMethod()

  };

  // connectUrl = () => {
  //   this.props.getSkillConnectUrl(this.props.skill.name, this.props.workspace_id)
  //     .then(res => {
  //       if (res.data.success) {
  //         var url = res.data.url;
  //         window.open(url, "_blank");
  //         let data = {
  //           name: this.props.skill.name,
  //           connectUserId: localStorage.getItem("trooprUserId")
  //         };
  //         let wId = this.props.workspace_id;
  //         this.props.setJiraConnectId(wId, data);
  //       }
  //     });
  // };

  addGridToken=async(id)=>{

   axios.post('/bot/api/'+this.props.match.params.wId+'/jira_grid_token/'+this.props.skill._id+"?token_id="+id).then(res=>{

     if(res.data.skill){
  this.props.setSkill(res.data.skill)
  this.props.setCurrentSkill(res.data.skill)
  this.props.updateAssisantSkills(res.data.skill)
     }else{
      message.error("There was a error connecting Confluence.");
     }
  
  
  
   })
   }

  // Menu End
  openConnectModal = () => {
    this.setState({ newConnectionModal: true })
  }

  wikiOuathPage=(type)=>{
    // this.setState()=>{
      
    // }
    // console.log(this.props)
    this.props.history.push(`/${this.props.match.params.wId}/wikiOuath/${this.props.match.params.skill_id}/0?connection_type=${type}`)  
  }


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

// updatePayment=(payment)=>{
//   this.setState({ payment: payment })

// }
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


        this.props.addBasicAuth(currentWorkspaceId, this.props.match.params.skill_id, {
          username: values.username,
          password: values.password,
          domain_url: values.url
        }).then(res => {
          if (res.data.success) {
        
            this.setState({ newConnectionModal: false })
            form.resetFields();
            //
          let skillMeta=this.props.skill.skill_metadata?this.props.skill.skill_metadata:this.props.skill
          // console.log(skillMeta)
           let  jiraUrl = skillMeta.metadata.domain_url;
          //  let  jiraDomainName = jiraUrl;
             this.props.history.push("/"+this.props.match.params.wId+"/jiraConnectionSteps/"+skillMeta._id+`?domainName=${jiraUrl}`)
       
            // 
          }
          else {
            message.error("Credentials incorrect, Try again")
          }
        }) 
      //----------------------------------------------
    //  })
      //----------------------------------------------
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };
  // Confluence New Connection End
  acceptMethods(invokeChildMethod) {
    this.invokeChildMethod = invokeChildMethod
  }
  urlModalToggle=()=>{


    this.setState({urlModal:!this.state.urlModal})
  }
 

    onChange=(e)=>{
      this.setState({[e.target.name]:e.target.value})
    }
    submitNewUrl=()=>{
if(this.state.domain_url){
  let domain_url=this.state.domain_url;
 domain_url=domain_url[domain_url.length-1]=="/"?domain_url.substring(0,domain_url.length-1):domain_url
  this.setState({domain_url:this.state.domain_url.trim()})

      let obj={"metadata.domain_url":domain_url}
      let {skill}=this.props
      let skillId = skill && skill.skill_metadata ? skill.skill_metadata._id : skill._id;
      let wId = skill && skill.skill_metadata ? skill.skill_metadata.workspace_id : skill.workspace_id;
      this.props.updateSkill(skillId, wId, obj, this.props.currentSkill).then(res => {
        if (res.data.success) {
          this.setState({urlModal:!this.state.urlModal})
          message.success('Confluence Base url updated to :'+this.state.domain_url)
        }
      })
    }else{
      message.error("Confluence Base url cannot be empty")
    }

    }

  connectDropDown = (isUserPrivileged)=> {
      // console.log("inside connectDropDown: ", isUserPrivileged);
    const {
      skill,
      currentSkill
    } = this.props;

    const isTokenisThere = currentSkill && currentSkill.metadata &&currentSkill && currentSkill.metadata.token_obj&&currentSkill.metadata.token_obj.userToken;
    let    type=skill.skill_metadata?(skill.skill_metadata&&(skill.skill_metadata.metadata.server_type=="jira_server"||skill.skill_metadata.metadata.server_type=="jira_server_oauth")):(skill.metadata&&(skill.metadata.server_type==="jira_server"||skill.metadata.server_type==="jira_server_oauth"))
    return   <Menu>
      {!type && <Menu.Item disabled={!isUserPrivileged} onClick={this.urlModalToggle}>Update Base URL</Menu.Item>}
      <Menu.Item disabled={!isUserPrivileged} onClick={this.getToken}>
                            {isTokenisThere ? "Update Token" : "Add Token"}
                          </Menu.Item>
      <Menu.Item danger disabled={!isUserPrivileged}    onClick={()=>this.disconnectOnClickModel(isUserPrivileged)}>Disconnect</Menu.Item>
      </Menu>
   }


   content_NotLinked = () => {
     const {skill} = this.props
     return (
      <Card
      size='small'
         loading={this.state.gridLoading}
        title="Confluence Connection"
        bodyStyle={{ overflow: "hidden" }}
        style={{width:'100%'}}
      >
        <p>
          Connect to a Confluence domain. Any Confluence user (preferably one
          with Confluence admin privileges) can perform this action
        </p>
        <Dropdown overlay={this.menu} trigger={['click']} placement='bottomLeft'>
          <Button>Connect</Button>
        </Dropdown>
          {/* <Button onClick={this.goToOuath}>Connect</Button> */}

      </Card>
     )
   }
   goToOuath = () => {
    this.props.history.push(`/${this.props.match.params.wId}/confluenceOuath/${this.props.match.params.skill_id}/0`)
  }
   content_Linked = (data) => {
 let {isUserPrivileged,connectedAt,connected_by,jiraDomainName,jiraUrl,isLinked,currentSkill}=data
 let { user }=this.props
 const isTokenisThere = currentSkill && currentSkill.metadata &&currentSkill && currentSkill.metadata.token_obj&&currentSkill.metadata.token_obj.userToken;
 let tokenInfo=isTokenisThere?currentSkill.metadata.token_obj:{}

if(!isUserPrivileged){

  isUserPrivileged=currentSkill.metadata.connected_by===user._id.toString()
}
     return (
      <Card
      style={{ width: "100%" }}
      loading={this.state.loadingUser}
      title={  "Confluence Account"}
      size='small'
      bodyStyle={{ overflow: "hidden" }}
      extra={<Dropdown overlay={this.connectDropDown(isUserPrivileged)} placement="bottomLeft">
              <Button type='link' icon={<SettingOutlined />} />
              </Dropdown>
      }
    >
      {
        <div>
          {isLinked &&
            <p>
              <Text type='secondary'>Connected to:</Text> <a href={jiraUrl} target='_blank'>{jiraDomainName}</a>
              <br />
              {connected_by &&connected_by.user_id&&connected_by.user_id.name && <><Text type='secondary'> Connected by:</Text> {connected_by.user_id.displayName||connected_by.user_id.name}{" (" + connected_by.email + ")"}<br /></>}
              {connectedAt&& <><Text type='secondary'> Connected at:</Text> {connectedAt}<br /></>}
              {isTokenisThere ? <><Text type="secondary">Token account: </Text><Text>{tokenInfo.userName}</Text></> 
                : <><Text type="secondary">Token is not configured for this account</Text></>}
            </p>
          }
        </div>
      }
    </Card>
     )
   }


   getContent = (data) => {
    const {skill} = this.props
    return(
      !data.isLinked ? this.content_NotLinked(data) : this.content_Linked(data)
    )
   }

   getModals = (domainName,tokenInfo) => {
    return (
      <>
        {/*-----------------Disconnect Confluence modal---------------*/}
        <Modal
        maskClosable={false}
          visible={this.state.disconnectModel}
          onCancel={this.disconnectOnClickModel}
          onOk={() => {
            this.updateSkill({ linked: false, metadata: {}, userName: null, userToken: null });
            this.getExistingGridConnections();
          }}
        >
          <div style={{ textAlign: "center" }}>
            You are currently connected to the Confluence domain
            <br />
            <b>'{domainName ? domainName : ""}'</b>
            <br />
            Disconnecting the Confluence domain will disconnect Confluence access for the entire team.
            <br />
            Are you sure?
            <br />
          </div>
        </Modal>

        {this.state.getToken && (
          <Modal
          maskClosable={false}
            visible={this.state.getToken}
            // visible={this.showModal}
            style={{ top: 20 }}
            onCancel={this.doNotShowModal}
            onOk={this.submitTokenData}
            okText='Authorize Token'
            title='Token Authorization'
            width={540}
          >
            <JiraToken
              userToken={tokenInfo.userToken}
              domain_url={this.state.domain_url}
              // wiki_type={tokenInfo.server_type?tokenInfo.server_type:"cloud"}
              wiki_type={tokenInfo.server_type?tokenInfo.server_type: this.props.currentSkill.metadata.connected_by ? this.props.currentSkill.metadata.connection_type : 'cloud'}
              userName={tokenInfo.userName}
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
          <Modal title={"Confluence Base URL"} visible={this.state.urlModal} onCancel={this.urlModalToggle} onOk={this.submitNewUrl} okText='Submit'>
            <Form layout='vertical'>
              <Form.Item className={localStorage.getItem("theme") == "dark" && "form_label_dark"}>
                <Alert
                  description={
                    <div>
                      The Base URL is the URL via which users access Confluence applications. The base URL must be set to the same URL by which browsers
                      will be viewing your Confluence instance. Troopr used the Confluence Base URL for some REST API calls and also to generate link URL for
                      issues.
                      <br />
                      <br />
                      Change the Base URL for your Confluence instance only if it is different from what is mentioned below. Typically there is no need to
                      change this value, but in some cases like migrated Confluence instance, the Base URL can be different from the generated one below.
                    </div>
                  }
                  type='warning'
                />
                <br />
                <Input
                  type='url'
                  defaultValue={this.state.domain_url}
                  onChange={this.onChange}
                  name="domain_url"
                  className={` input-bg ${localStorage.getItem("theme") == "dark" && "autofill_dark"}`}
                />
              </Form.Item>
            </Form>
          </Modal>
        )}

       
      </>
    );
  };

  
  render() {

    const {members,user,currentUser,userworkspacemembership} = this.props
    let isAdmin = (userworkspacemembership&&userworkspacemembership.role==="admin")?true:false;

    if(!isAdmin){
     let {currentSkill}=this.state
        isAdmin=currentSkill&&currentSkill.metadata&&currentSkill.metadata.connected_by&&currentSkill.metadata.connected_by.toString()===user._id.toString()
      
    }

    // if(members && members.length>0){
    //   let user_now=members.find((member)=>member.user_id&&member.user_id._id==user._id&&user)
    //   if(user_now){
    //     if(user_now.role){
    //       isAdmin=user_now.role=="admin"?true:false
    //     }
    //   }
    // }
    // let currentUserId = this.props.currentUser._id;
    // isUserPrivileged = ((currentUserId == this.state.adminUserId) || (this.state.isAdmin));
    let isUserPrivileged = isAdmin
    const col_span = 24
    const {
      skill,
    } = this.props;
    // console.log("this is new skill",skill)

    // console.log("skill: ", skill);

    let jiraUrl ;
      let jiraDomainName;
    let isLinked = skill.skill_metadata
      ? skill.skill_metadata.linked
      : skill.linked;

    let connectedAt;

    // console.log("skill---->",skill)
    // let time = skill.metadata.installationInfo ? skill.metadata.installationInfo.created_at : ''
    // let date = moment.utc(time).format('MMM Do ha');
    let   connected_by=""
    let   domainName=""

    let currentSkill=this.props.currentSkill.skill_metadata?this.props.currentSkill.skill_metadata:this.props.currentSkill
    let  isTokenisThere =  currentSkill&&  currentSkill.metadata &&  currentSkill.metadata.token_obj&& currentSkill.metadata.token_obj.userToken
 let  skillConnected=  currentSkill.metadata && currentSkill.metadata.domain_url
    if (skillConnected) {
      if(isTokenisThere){
        
      
      connected_by=currentSkill.metadata.token_obj.connected_by
  
      if(!isUserPrivileged){
    

            isUserPrivileged=(connected_by===user._id.toString())
          
        
      }
    
     
    }

    connected_by=currentSkill.metadata.connected_by ||  connected_by
    connected_by=members.find((member)=>member.user_id&&member.user_id._id=== connected_by)
    let time =  currentSkill.metadata.connected_at
    connectedAt = moment(time).format('MMM Do h:mm A Z');


      jiraUrl = currentSkill.metadata.domain_url
      jiraDomainName = jiraUrl;
   
    domainName = currentSkill.metadata.domain_url 
    }
   




   
  
    let tokenInfo=isTokenisThere?currentSkill.metadata.token_obj:{}

    const style_for_double_columns = {display:'flex'}


    const data = {isUserPrivileged,connectedAt,connected_by,jiraDomainName,jiraUrl,isLinked,currentSkill}

    return (
   <Layout style={{marginLeft:0}}>
      <Content style={ { padding: "16px 16px 32px 24px" }}>
         <Alert
            message="Configurations in this page apply to the entire workspace"
            type="warning"
            showIcon
            style={{ width: "calc(100% - 16px)",maxWidth:984, marginBottom:16 }}
          />
     
          <Row className={'content_row_jira'} gutter={[16, 16]}>
            {!isLinked ? (
                <Col span={col_span}>
                  {/*-----------------------------------Confluence Not Connected--------------------------------*/}
                  {this.content_NotLinked(data)}
                </Col>
            ) : 
                (<>
                  <Col span={col_span}  >
                    {this.content_Linked(data)}
                </Col>
              
                {/* <Col span={col_span} style={style_for_double_columns}>
                  <Card
                    style={{ width: "100%" }}
                    loading={this.state.loadingToken}
                    title="API Token"
                    size='small'
                    bodyStyle={{ overflow: "hidden" }}
                    extra={
                      isTokenisThere ? <Dropdown overlay={
                        <Menu>
                          <Menu.Item disabled={!isUserPrivileged} onClick={this.getToken}>
                            {isTokenisThere ? "Update" : "Add Token"}
                          </Menu.Item>
                          <Menu.Item disabled={!isUserPrivileged} danger loading={this.state.loading}>
                            {!isUserPrivileged ? 'Delete' : <Popconfirm
                              title='Are you sure you want to delete the token?'
                              //  disabled={!isUserPrivileged}
                              onConfirm={()=>this.deleteToken(isUserPrivileged)}
                              okText='Yes'
                              cancelText='No'
                            >
                              Delete
                     </Popconfirm>}
                          </Menu.Item>
                        </Menu>
                      }
                        placement="bottomLeft">
                        <Button type='link' icon={<SettingOutlined />} />
                      </Dropdown>
                        :
                        isTokenisThere? <Button disabled={!isUserPrivileged} onClick={this.getToken}>{ "Update" }</Button>:<Button  onClick={this.getToken}> Add Token</Button>
                    }
                  >
                   

                    {isTokenisThere ?

                      <><Text type="secondary">Token owner: </Text><Text>{tokenInfo.userName}</Text></>
                      :
                      <><Text type="secondary">Token is not configured for this account</Text></>
                    }
                  </Card>
                </Col> */}
                 
                 </>      )
                 }
                   
                   {this.getModals(domainName,tokenInfo)}

          </Row>
    
      </ Content>
      </Layout> 
    );
  }
}

const mapStateToProps = state => {
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
    userworkspacemembership:state.common_reducer.userworkspacemembership

  };
};

export default withRouter(
  connect(mapStateToProps, {
    getSkillConnectUrl,
    updateSkill,

   
  
    personalSetting,
    getAssisantSkills,
  
    submitTokenData,
    getUserToken,
    getUser,
    setJiraConnectId,
    addBasicAuth,
    setWorkspace,
    setSkill,
    setCurrentSkill,
    updateAssisantSkills,
    getUserWorkspaceMembership
  })(JiraConfiguration)
);
