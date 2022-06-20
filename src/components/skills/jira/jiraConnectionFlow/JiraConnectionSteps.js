import React, { Fragment } from "react";
import JiraDomainSelection from "../../../auth/jira/jiraDomainSelection";
import JiraToken from "./jiraToken";
import "./jirasteps.css";
import {connect} from 'react-redux';
import { withRouter } from "react-router-dom";
import { Steps, Button, notification,Layout,message } from "antd";
import JiraWebHookPage from "./JiraWebHookConfigure";
import DefaultProjects from "./defaultChannelSelection";
import Success from "./success";
import {sendDefaultLauncher,getCurrentSkill} from '../../skills_action';
import {checkJiraStatus} from '../../../../utils/utils'
// import { getCurrentSkill, } from "./skills_action";
import queryString from "query-string"
const { Step } = Steps;
const { Content } = Layout;

class JiraConnectionSteps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      demoChannelApiLoading:false,
      current: 0,
      domainId: "",
      data: {
        domain: {done:false,domain:""} ,
        token: {done:false,userName:"",userToken:""},
        channelDefaults: {done:false,id:"",channelName:""},
        channelInfo: false,
         linking:{done:false,issueType: {},
         project: {},
         channel: {},autoCreateFields:{}},
         skill_id:""
      },
      field_error: false,
      errorMessage: "",
      parsedQueryString : {}
    };
  }

  acceptMethods(invokeChildMethod) {
    this.invokeChildMethod = invokeChildMethod;
  }
  componentDidMount() {
    // this.props.getWorkspace(this.props.match.params.wId)
if(this.props.currentSkill && this.props.currentSkill._id){

}else{
 this.setState({loading:true})
  let query = "sId=" + this.props.match.params.domain_id
  this.props.getCurrentSkill(this.props.match.params.wId, query).then(res=>{
    this.setState({loading:false})

  })

}
   
    let query=queryString.parse(this.props.location.search)
    this.setState({parsedQueryString : query})
    if(query.domainName){
      let channelInfo=false
      let channel={done:true,id:"",name:""}
      if(query.channelInfo){
       let [channelId,...channelname] =query.channelInfo.split("-")

       channelInfo=true
       channel.id= channelId
       channel.name=channelname.join('-')

      } 
    
      
    this.setState({data:{...this.state.data,channelInfo,linking:{...this.state.data.linking,channel},channelDefaults:{id:channel.id,channelName:channel.name},skill_id:this.props.match.params.domain_id}})
  

  }
    else{
    let id = this.props.match.params.domain_id   
    this.setState({ domainId: id });
    }

    this.showSuccessMessage()
    
  }

  componentDidUpdate(prevProps){
    if(prevProps.skills !== this.props.skills){
      this.showSuccessMessage()
    }
  }

  showSuccessMessage = () => {
    let query=queryString.parse(this.props.location.search)
    const skill_data = this.props.skills.find(skill => skill && skill.skill_metadata && skill.skill_metadata._id === this.props.match.params.domain_id)
    if(skill_data && skill_data.key === 'jira' && query.from !== 'setup_demo_channel_button') message.success('Jira Connection Successfull',5)
  }

next() {

  
this.invokeChildMethod()
}
sendToDefault(){
  const {skills} = this.props
  const jiraSkill = skills.find(skill => skill.name === 'Jira')
  const isJiraEnabled = jiraSkill&&jiraSkill.skill_metadata ? checkJiraStatus(jiraSkill.skill_metadata) : true
  if (!isJiraEnabled/* jiraSkill && jiraSkill.skill_metadata.disabled */) 
  this.props.history.push(`/${this.props.match.params.wId}/teamsyncs/integrations/${this.state.data.skill_id}`)
  else
  this.props.history.push(`/${this.props.match.params.wId}/skills/${this.state.data.skill_id}/${this.state.parsedQueryString.sub_skill}`)
}
  moveToNextStep(count) {
    if(count){
      const current = this.state.current + 2;
      this.setState({ current });
    }
    else{
    const current = this.state.current + 1;
    this.setState({ current });
    }
  }
  skip() {
    const current = this.state.current + 1;
    let query=queryString.parse(this.props.location.search);
    let userId = localStorage.getItem('trooprUserId');
  
let channelId = this.state.data.channelDefaults.id;
// console.log("channelId============>",channelId);
    if(query && query.domainName){
      if(current === 3){
        // console.log("send api call");
        if(channelId){
        this.props.sendDefaultLauncher(this.props.match.params.wId,channelId,userId);
        
        }
      }
      
    }else{
      if(current === 4){
        if(channelId){
          this.props.sendDefaultLauncher(this.props.match.params.wId,channelId,userId);

        }
      }
      
    }
    
    // if(current === 4){
    //   console.log("send api call");
    //   this.props.sendDefaultLauncher(this.props.match.params.wId,channelId,userId);
    // }
    
    this.setState({ current });
  }
  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  linkProjectErrorMessageHandle (errors) {
  // if(errors.channelDataInfo) message.error(errors.channelDataInfo.errors[0].message);
  // if(errors.project) message.error(errors.project.errors[0].message);
  // if(errors.boardId) message.error(errors.boardId.errors[0].message);
  // if(errors.issue_type) message.error(errors.issue_type.errors[0].message);

  // message.error(
  //   <div style={{textAlign:'left'}}>
  //   {errors.channelDataInfo &&errors.channelDataInfo.errors[0].message}<br/>
  //   {errors.project &&errors.project.errors[0].message}<br/>
  //   {errors.boardId &&errors.boardId.errors[0].message}<br/>
  //   {errors.issue_type &&errors.issue_type.errors[0].message}
  //   </div>

  notification["error"]({
    message: 'Required fields',
    description:
   <div>
    {errors.channelDataInfo &&errors.channelDataInfo.errors[0].message}{errors.channelDataInfo && <br/>}
    {errors.project &&errors.project.errors[0].message}{errors.project && <br/>}
    {errors.boardId &&errors.boardId.errors[0].message}{errors.boardId && <br/>}
    {errors.issue_type &&errors.issue_type.errors[0].message}
    </div>
  });

  }
  
  render() {
     
  let query=queryString.parse(this.props.location.search)
  const { current, parsedQueryString } = this.state;
  const { workspace,skills } = this.props;
  const {parsedQueryString : {sub_skill}} = this.state
  const jiraSkill = skills.find(skill => skill.key === 'jira')
  let showSkipButton=true;
  if(current==0){
    showSkipButton=false
  }
  else if(current==1&&!query.domainName){
    showSkipButton=false
  }
let skill= this.props.currentSkill.skill_metadata ? this.props.currentSkill.skill_metadata : this.props.currentSkill
let steps=[]
if(!this.state.loading){
 if(query.from === 'setup_demo_channel_button' /* to handle old cloud connectiosn without webhook when try to setup demo channel */ ||( skill && skill.metadata && (skill.metadata.server_type=="jira_server"|| skill.metadata.server_type=="jira_server_oauth" || skill.metadata.server_type=="jira_cloud_oauth"))){
   
if(current==0)showSkipButton=true
  steps = [
  // {
  //     title: "Link Project",
  //     content: (
  //       <DefaultProjects
  //         data={this.state.data}
  //         moveToNextStep={this.moveToNextStep.bind(this)}
  //         shareMethods={this.acceptMethods.bind(this)}
  //         skill_id={this.state.data.skill_id}
  //         linkProjectErrorMessageHandle = {this.linkProjectErrorMessageHandle.bind(this)}
  //       />
  //     )
  //   },
    {
      title: "Success",
      content: (
        <Success
          data={this.state.data}
          skill_id={this.state.data.skill_id}
          goToChannelDefaultStep = {(step) => this.prev(step)}
        />
      )
    }
  ];

  // handling checkin integration onboarding
  if(jiraSkill && !jiraSkill.skill_metadata.disabled){
    if(sub_skill === 'jira_software'){
      steps.unshift(
        {
          title: 'Setup Project Channel',
          content: (
            <DefaultProjects
              data={this.state.data}
              moveToNextStep={this.moveToNextStep.bind(this)}
              setLoadingState = {(loadingState) => {this.setState({demoChannelApiLoading:loadingState})}}
              shareMethods={this.acceptMethods.bind(this)}
              skill_id={this.state.data.skill_id}
              linkProjectErrorMessageHandle = {this.linkProjectErrorMessageHandle.bind(this)}
              default_type = 'project_channel'
            />
          )
        },
      )
    }else if (sub_skill === 'jira_service_desk'){
      steps.splice(0,0, {
        title: 'Setup HelpDesk Channels',
        content: (
          <DefaultProjects
            data={this.state.data}
            moveToNextStep={this.moveToNextStep.bind(this)}
            setLoadingState = {(loadingState) => {this.setState({demoChannelApiLoading:loadingState})}}
            shareMethods={this.acceptMethods.bind(this)}
            skill_id={this.state.data.skill_id}
            linkProjectErrorMessageHandle = {this.linkProjectErrorMessageHandle.bind(this)}
            default_type = 'helpdesk_channels'
          />
        )
      })

      // steps.splice(0,0, {
      //   title: 'Setup Support Channel',
      //   content: (
      //     <DefaultProjects
      //       data={this.state.data}
      //       moveToNextStep={this.moveToNextStep.bind(this)}
      //       shareMethods={this.acceptMethods.bind(this)}
      //       skill_id={this.state.data.skill_id}
      //       linkProjectErrorMessageHandle = {this.linkProjectErrorMessageHandle.bind(this)}
      //       default_type = 'support_channel'
      //     />
      //   )
      // })
      // steps.splice(1,0, {
      //   title: 'Setup Agent Channel',
      //   content: (
      //     <DefaultProjects
      //       data={this.state.data}
      //       moveToNextStep={this.moveToNextStep.bind(this)}
      //       shareMethods={this.acceptMethods.bind(this)}
      //       skill_id={this.state.data.skill_id}
      //       linkProjectErrorMessageHandle = {this.linkProjectErrorMessageHandle.bind(this)}
      //       default_type = 'agent_channel'
      //     />
      //   )
      // })
    }else if (sub_skill === 'jira_reports'){
      steps.splice(0,0, {
        title: 'Setup Reports Channel',
        content: (
          <DefaultProjects
            data={this.state.data}
            moveToNextStep={this.moveToNextStep.bind(this)}
            setLoadingState = {(loadingState) => {this.setState({demoChannelApiLoading:loadingState})}}
            shareMethods={this.acceptMethods.bind(this)}
            skill_id={this.state.data.skill_id}
            linkProjectErrorMessageHandle = {this.linkProjectErrorMessageHandle.bind(this)}
            default_type = 'reports_channel'
          />
        )
      })
    }
  }

  // console.log("1",steps.length)
  if(skill && skill.metadata && !skill.metadata.webhook && query.from !== 'setup_demo_channel_button' /* to handle old jira connectiosn without webhook when try to setup demo channel */){
    // console.log("2",steps.length)
    steps.unshift( {
      title: "Enable Webhook",
      content: (
        <JiraWebHookPage
        data={this.state.data}
          moveToNextStep={this.moveToNextStep.bind(this)}
          shareMethods={this.acceptMethods.bind(this)}
          skill_id={this.state.data.skill_id}
          sub_skill = {this.state.parsedQueryString.sub_skill}
        />
      )
    })
    // console.log("4",steps.length)
  }

  // console.log("3",steps.length)
 }else{
   steps = [
    {
      title: "Pick Domain",
      content: (
        <div>
          <JiraDomainSelection
            data={this.state.data}
            domainId={this.state.domainId}
            shareMethods={this.acceptMethods.bind(this)}
            moveToNextStep={this.moveToNextStep.bind(this)}
          />
        </div>
      )
    },
    {
      title: "Add Token",
      content: (
        <JiraToken
          data={this.state.data}
          moveToNextStep={this.moveToNextStep.bind(this)}
          shareMethods={this.acceptMethods.bind(this)}
          skill_id={this.state.data.skill_id}
          showStyles={true}
          closeModal={false}
          fromConnectionOnboarding={true}
        />
      )
    },
    {
      title: "Enable Webhook",
      content: (
        <JiraWebHookPage
        data={this.state.data}
          moveToNextStep={this.moveToNextStep.bind(this)}
          shareMethods={this.acceptMethods.bind(this)}
          skill_id={this.state.data.skill_id}
        />
      )
    },
    // {
    //   title: "Link Project",
    //   content: (
    //     <DefaultProjects
    //       data={this.state.data}
    //       moveToNextStep={this.moveToNextStep.bind(this)}
    //       shareMethods={this.acceptMethods.bind(this)}
    //       skill_id={this.state.data.skill_id}
    //       linkProjectErrorMessageHandle = {this.linkProjectErrorMessageHandle.bind(this)}
    //     />
    //   )
    // },
    {
      title: "Success",
      content: (
        <Success
          data={this.state.data}
          skill_id={this.state.data.skill_id}
        />
      )
    }
  ];

  //to handle checkin integrations 
  if(jiraSkill && !jiraSkill.skill_metadata.disabled){
    steps.splice(3,0, 
      {
        title: "Link Project",
        content: (
          <DefaultProjects
            data={this.state.data}
            moveToNextStep={this.moveToNextStep.bind(this)}
            shareMethods={this.acceptMethods.bind(this)}
            skill_id={this.state.data.skill_id}
            linkProjectErrorMessageHandle = {this.linkProjectErrorMessageHandle.bind(this)}
          />
        )
      })
  }

  if(query.domainName){
    // console.log("hello stepsremoving")
    steps.shift()  
    // this.setState({data:{...this.state.data,skill_id:this.props.match.params.domain_id}})
  }
 }
}

//  console.log("hello steps",steps)
  // console.log("channelDefaults==>",this.state.channelDefaults)

    return (
      <Content style={{height:"100vh",/* overflow:"auto", */ padding: "16px 16px 32px 24px", marginLeft:0 }}>
      {!this.state.loading && <Fragment>
        <Steps size="large" current={current}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="steps-content" style={{height:'74vh', maxHeight:'500px',background:(localStorage.getItem('theme') == 'dark' && "#07080a"),border:(localStorage.getItem('theme') == 'dark' &&"none")}}>{steps[current].content}</div>
        {/* <div className="steps-content" style={{height:'74vh',background:(localStorage.getItem('theme') == 'dark' && "#07080a"),border:(localStorage.getItem('theme') == 'dark' &&"none")}}>{steps[steps.length-1].content}</div> */}
        <div style={{height:"10vh"}} className="steps-action">
        {(current > 0&&current!==steps.length-1) && (
            <Button style={{ marginRight: 8 }} onClick={() => this.prev()}>
              Previous
            </Button>
          )}
           {showSkipButton&&current!==steps.length-1&& <Button style={{ marginRight: 8 }} 
          //  onClick={() => this.skip()}
           onClick={() => {
             let view = this.state.parsedQueryString.sub_skill === 'jira_reports' ? 'reports' : 'channel_preferences'
             if(this.state.parsedQueryString && this.state.parsedQueryString.from && this.state.parsedQueryString.from === 'setup_demo_channel_button'){
               this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.domain_id}/${this.state.parsedQueryString.sub_skill}?view=${view}`)
             }else this.skip()
            }}
           >
                  Skip
              </Button>}
            

          {current < steps.length - 1 && (
            <Fragment>
              <Button type="primary"  onClick={() => this.next()} loading={this.state.demoChannelApiLoading}>
                Next
              </Button>
           
           
            </Fragment>
          )}

          {current ===steps.length - 1 && (
            <div>
              {jiraSkill && jiraSkill.skill_metadata.disabled && <div>
                <Button type='primary' onClick={() => this.props.history.push(`/${this.props.match.params.wId}/teamsyncs/templates`)}>Create new Check-in</Button>
            </div>}
            {jiraSkill && jiraSkill.skill_metadata.disabled && <br/>}
            {/* <div>
            <Button
              type={jiraSkill && jiraSkill.skill_metadata.disabled ? "default" : "primary"}
              onClick={() => this.sendToDefault()}
              style={jiraSkill && jiraSkill.skill_metadata.disabled ? {marginLeft:'30%'}: {}}
            >
              Close
            </Button>
            </div> */}
            </div>
          )}
        </div>
        </Fragment>
        }
      </Content>
    );
  }
}
const mapStateToProps=(state) =>{

  return{
    teamId: state.skills.team,
    currentSkill: state.skills.currentSkill,
    workspace : state.common_reducer.workspace,
    skills: state.skills.skills

  }


}

export default withRouter(connect(mapStateToProps,{sendDefaultLauncher,getCurrentSkill})(JiraConnectionSteps));
