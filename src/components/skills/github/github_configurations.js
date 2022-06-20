import React,{ Component } from 'react';
import {  setDefaultChannel,
          getDefaultChannel,
          getIssues,
          getProject,
          personalSetting,
          getAssisantSkills,
          getSkillConnectUrl,
          updateSkill,
          getUser,
          setGitHubConnectId
         } 
from '../skills_action';
import ModalError from '../../auth/gitHub/ModalError'
import moment from "moment";
import { Button,Modal, Card, message ,Typography, Row, Col,Alert, Layout} from 'antd';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Validator from "validator";
import isEmpty from "lodash/isEmpty";
import queryString from "query-string"
const { Text } = Typography;
const { Content } = Layout;

const Jira_skill_id = localStorage.getItem('Jira_skill_id');

class GithubConfiguration extends Component {
  constructor(props){
    super(props)
    this.state={
      loading:false,
     channels: [],
     projects:[],
     issues: [],
     defaultProject:'',
     defaultIssue:'',
     skillsToggle: false,
     notificationToggle: false,
     personalNotifToggle: false,
     preference: "channel",
     selectedChannel:'',
     selectedChannelName: '',
     selectedProject:'',
     currentSkill: this.props.match.params.skill_id,
     linkedProject: null,
     linkedIssue: null,
     personalProject: '',
     personalIssue: '',
     personalChannelId:'',
     edit: false,
     error:{},
     showChannelSetting:false,
     disconnectModel:false,
     searchChannel: '',
     value: '',
     suggestions: [],
     userName:"",
    //  userToken:"",
     response:"",
     connected_by_email:"",
     }
     this.onChangeChannel = this.onChangeChannel.bind(this);
     this.goToJiraNotifSetup = this.goToJiraNotifSetup.bind(this);
     this.updateSkill = this.updateSkill.bind(this);
     this.showChannelSetting = this.showChannelSetting.bind(this);
     this.textInput = React.createRef();
  }
	
   showChannelSetting(){
        this.props.setOption("jira_channel_pref",this.state.selectedChannel, this.state.selectedChannelName);

     }


   disconnectOnClickModel = () => {
    
     let currentUserId = localStorage.getItem("trooprUserId");
    //  console.log("jiraConnectedId",this.props.skill);
     const { skill } = this.props;
     let jiraConnectedId = skill && skill.skill_metadata ? skill.skill_metadata.jiraConnectedId : skill.jiraConnectedId
    //  let jiraConnectedId = skill && skill.skill_metadata ? skill.skill_metadata.metadata.installationInfo.created_at : skill.metadata.installationInfo.created_at

    //  console.log("jiraConnectedId",jiraConnectedId);
      if(currentUserId === jiraConnectedId){
        this.setState({disconnectModel:!this.state.disconnectModel});

      } else{
        message.error(`Please contact your admin: ${this.state.response} (${this.state.connected_by_email}) to disconnect`);
      }
     
  
   
       
   }


  componentDidMount() {
    // console.log("skill gituhib---->component did moungt",this.props.skill)
    // console.log("mounting github config: Github admin id is:"+this.props.skill.jiraConnectedId)
    // console.log("props.skill from page header: "+JSON.stringify(this.props.skill))
    this.setState({loading:true})
     this.props.getUser(this.props.skill.skill_metadata?this.props.skill.skill_metadata.jiraConnectedId:this.props.skill.jiraConnectedId).then(res=>{
      //  console.log("pulled admin user info:"+JSON.stringify(res))
      this.setState({loading:false})
            //  console.log("componentDidMount:props.getUser("+this.props.skill.jiraConnectedId+")"+JSON.stringify(res.data))
             if(res.data.user){
              this.setState({
                response:res.data.user.displayName||res.data.user.name, connected_by_email:res.data.user.email
                // response:res.data.user.name
              })

             }
            
         })
         
    
    // this.props.getProject(this.props.skill._id);
//     this.props.getJiraGuestManager(this.props.match.params.wId).then(res=>{
//       if(res.data.success)
//       this.props.getJiraGuestUsers(this.props.match.params.wId,res.data.jira_guest_manager._id)
//   })

// let name="Github"
// this.props.getUserToken(this.props.match.params.wId,name).then(userData=>{
//   console.log("userData===>",userData);
//   if(userData.data){
//     this.setState({
//       userName:userData.data.userName,
//       userToken:userData.data.userToken
//     })
//   } 
// })

   
  }


  onChangeChannel = (event, value) => {
    //value gets all the props
    //event gets the value props
    this.setState({selectedChannel: event, selectedChannelName: value.props.children});
  }

  goToJiraNotifSetup(){
    this.props.history.push("/"+this.props.workspace_id+"/jira_notification_setup/"+this.props.skill._id+"?step=intial_setup")
}


  updateSkill(data){
    // console.log("this.props.skill==>",this.props.skill)
    const {skill} = this.props;
    let skillId = skill && skill.skill_metadata ? skill.skill_metadata._id : skill._id;
    let wId = skill && skill.skill_metadata ? skill.skill_metadata.workspace_id : skill.workspace_id;
    this.props.updateSkill(skillId,wId,data).then(res=>{
    this.setState({disconnectModel: !this.state.disconnectModel});
     this.props.history.push("/"+this.props.workspace_id+"/skills/"+this.props.currentSkill._id);
  })
}

  updateSkillToggle = (data) => {
     this.props.updateSkill(this.props.skill._id,this.props.skill.workspace_id,data).then(res=>{
  })
}

onChangeSearch = (event) => {
     this.setState({searchChannel : event.target.value});
}

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


  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  // getToken = () =>{
  //     this.setState({
  //       getToken:true
  //     })
  // }

  // doNotShowModal = () =>{
  //   this.setState({
  //     getToken:false
  //   })
  // }

  getUserName = (event) =>{
    this.setState({
      userName:event.target.value
    })
  }

//   getUserToken = (event) =>{
//  this.setState({
//       userToken:event.target.value
//     })
//   }

  // submitTokenData = () =>{
  //   // console.log("this.state.userName===>",this.state.userName,"this.state.userToken====>",this.state.userToken);
  //   let data={
  //     userName:this.state.userName,
  //     userToken:this.state.userToken,
  //     name:this.props.skill.name
  //   }

  //   if (this.validateEmail(this.state.userName)) {
  //   this.props.submitTokenData(this.props.workspace_id,data).then(res=>{
  //     this.setState({
  //       getToken:false
  //     })
  //   })
  //  }
  // }
  connectUrl=()=> {

    const parsedQueryString = queryString.parse(window.location.search);
    let channelId=null
    if(parsedQueryString.channelIdInfo){
      channelId="-"+parsedQueryString.channelIdInfo
    }
    // console.log(process.env)
    //     this.props.getSkillConnectUrl(this.props.skill.name,this.props.workspace_id).then(res => {
    //         if(res.data.success){
    //             var url=res.data.url;
    //             window.open(url,"_blank");
    // console.log("this.props.match.params.wId",this.props)
                let data = {
                    name:"GitHub",
                    connectUserId:localStorage.getItem("trooprUserId")
                }
                let wId = this.props.match.params.wId
                this.props.setGitHubConnectId(wId,data);
  
    window.open(`https://github.com/apps/${process.env.REACT_APP_GitHubApp}/installations/new?state=${this.props.match.params.wId}${channelId?channelId:""}`, '_blank') ;
    // window.open("https://github.com/apps/test-troopr1/installations/new?state="+this.props.match.params.wId , '_blank') ;

    // console.log("========>Ds")
  
  }
  
  
  render(){
    // console.log("this.props.match.params.wId",this.props.match.params.wId)
    const {skill} = this.props;
// console.log("skill gituhib1",skill);
// console.log("skill gituhib2",skill.skill_metadata.linked);
let date;
let domainName
// console.log("skill.default",skill.default)
    // const domainName = skill.metadata && skill.metadata.installationInfo ? skill.metadata.installationInfo.account.login : ''
   if( skill && skill.skill_metadata ? skill.skill_metadata.linked : skill.linked){
     domainName = skill && skill.skill_metadata ? skill.skill_metadata.metadata.installationInfo.account.login : skill.metadata.installationInfo.account.login
    // let time = skill.metadata && skill.metadata.installationInfo ? skill.metadata.installationInfo.created_at : ''
    let time = skill && skill.skill_metadata ? skill.skill_metadata.metadata.installationInfo.created_at : skill.metadata.installationInfo.created_at
    // console.log("tie-->",time)
      date = moment(time).format('MMM Do h:mm A Z');
   }
  
    // console.log(date)
  return(
    <Content style={{ padding: "16px 16px 32px 24px" ,marginLeft:50}}>
    <Row className='content_row' gutter={[0, 16]}>
      {(!(skill && skill.skill_metadata ? skill.skill_metadata.linked : skill.linked) ) ? 
        <Col span={24}>
          <Alert
      description="Only organization account is supported"
      type="warning"
      showIcon
      style={{marginBottom:"20px"}}
    />
        <Card size='small' title="Organization Account" >
        <Col span={20}>
        
          <p>Connect to your GitHub organization account.</p>
          </Col>
          <Col span={4}>
          <Button
                          className="skill_pref_action_btn  align-items-center" 
                          onClick={this.connectUrl}>
                             Connect
                      </Button>
          </Col>

        </Card>
        </Col>
        :
        <Col span={24}>
        <Card  size='small'title="Organization Account" extra={<Button type="danger" onClick={this.disconnectOnClickModel}>Disconnect</Button>}>
        <Text>Connected account: <a href={`https://github.com/${domainName}`}>{domainName}</a></Text><br/><Text>Connected by: {this.state.response} ({this.state.connected_by_email}) on {date}</Text>
        </Card>
        </Col>
      }
              <br/>
            {/*-----------------Disconnect Jira modal---------------*/}
           <Modal
           title="Disconnect GitHub"
              visible={this.state.disconnectModel}
              onCancel={this.disconnectOnClickModel}
              onOk={()=>this.updateSkill({linked:false,metadata:{}})}
              footer={[
                <Button key="back" onClick={this.disconnectOnClickModel}>
                  Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={()=>this.updateSkill({linked:false,metadata:{}})}>
                  Yes Disconnect
                </Button>
              ]}
           >
             {/* <div style={{display:'flex', flexDirection:'column', alignItems: 'center'}}>
                <p>You are currently connected to the GitHub domain</p>
                <p>'{domainName ? domainName : ''}'</p>  
                <p>Disconnecting the GitHub domain will disconnect GitHub access for the entire team.</p>
                <p>Are you sure?</p>
             </div> */}
             <Alert
                message="Warning"
                description="Disconnecting workspace GitHub account will remove GitHub access for the entire team."
                type="warning"
                showIcon
              /><br/>
              <Text>Your team is currently connected to account: </Text>
              <Text strong>{domainName}</Text>
              <Text> by</Text>
              <Text strong> {this.state.response} ({this.state.connected_by_email})</Text>
              <Text> on</Text>
              <Text strong> {date}</Text>
              <br/><br/><p>Are you sure you want to disconnect?</p>
           </Modal>
         {this.props.errorModal && <ModalError showModal={this.props.errorModal}/>} 
           

           {/* {this.state.getToken && 
           <Modal
           visible={this.state.getToken}
           onCancel={this.doNotShowModal}
           onOk = {this.submitTokenData}
           okText = "Submit"
           >
             <div className="getUserToken">
               <div>
                 Username will typically be your email id.
               The token can be generated at this url <a href="https://id.atlassian.com/manage/api-tokens" target="blank">https://id.atlassian.com/manage/api-tokens</a>

               </div>
              
             </div>
             <Input
             prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
             placeholder="Username"
             onChange={this.getUserName}
             style={{marginBottom:"10px"}}
             value = {this.state.userName}
             type="email"
           />
           {this.state.error.isEmail && (
                 <span className="error_span">{this.state.error.isEmail}</span>
               )}
           <Input
             prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
             type="password"
             placeholder="Token"
             onChange={this.getUserToken}
             style={{marginBottom:"10px"}}
             value = {this.state.userToken}

           />
           </Modal> */}
           
           
       </Row>
       </Content>
     );
 }
} 

const mapStateToProps = state => {
  // console.log("store: "+JSON.stringify(state))
 return {
 workspace: state.common_reducer.workspace,
 assistant_skills:state.skills,
 user: state.common_reducer.user,
 userData:state.skills,
 issues:state.skills.issues,
 channelDefault:state.skills.channelDefault,
 personalChannelDefault:state.skills.personalChannelDefault,
 currentUser:state.auth.user,
 guestManager:state.jiraGuest.jiraGuestManager,
 guestUsers:state.jiraGuest.jiraGuestUsers,
 jiraUser:state.skills.currentSkillUser,
 errorModal:state.skills.showErrorModal,
 currentSkill:state.skills.currentSkill
//  skill:state.skills.skill
}};     
   

export default withRouter(connect(mapStateToProps, { 
getSkillConnectUrl,updateSkill,
    setDefaultChannel,
    getDefaultChannel,
    getIssues,
    getProject,
    personalSetting,
    getAssisantSkills,
    getUser,
    setGitHubConnectId
    //getJiraGuestManager,
    //getJiraGuestUsers,
    // submitTokenData,
    // getUserToken
  })(GithubConfiguration));