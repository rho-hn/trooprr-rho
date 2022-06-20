// import React, { Component } from "react";
// import { connect } from "react-redux";
// import axios from "axios";
// import { getTeamData, updateWorkspace , getSkillConnectUrl , setJiraConnectId , updateSkill} from '../skills/skills_action';
// import { withRouter } from "react-router-dom";
// import { BarChartOutlined, CheckCircleTwoTone, SlackOutlined , QuestionCircleOutlined , CheckOutlined } from '@ant-design/icons';
// import { Modal, Button, Card, Col, Row, Alert, Result, Typography , Menu ,Radio, Popover, Dropdown, message} from "antd";
// import queryString from 'query-string';
// import TroorLogo from '../../media/circular_troopr_logo.svg';
// import GitHubLogo from '../../media/Github_logo.png';
// import JiraLogo from '../../media/Jira_logo.png';
// import { ThemeProvider, useTheme } from 'antd-theme';

// // import {sendWelcomeMessageToUser} from '../common/common_action'

// const { Text, Title } = Typography;

// const Theme = () => {
//   let initialTheme = {
//     name: "dark",
//     // variables: { 'primary-color': '#664af0' }
//     variables: { 'primary-color': localStorage.getItem("theme") == "dark" ? "#664af0" : "#402E96" }
//   };

//   const [theme, setTheme] = React.useState(initialTheme);
//   return (
//     <ThemeProvider
//       theme={theme}
//       onChange={(value) => { setTheme(value)}}
//     >
//     </ThemeProvider>
//   );
// };
// class OnBoarding extends Component {


//   constructor(props) {
//     super(props);
//     this.state = {
//       visible: true,
//       assisant_name: "",
//       step: "personalize",
//       sId: "",
//       lodaing: false,
//       defaultTool: "",
//       sendWelcomeMessage: false,
//       TrooprProjectSkillId: '',
//       squadsToggleLoading : false,
//       githubToggleLoading : false,
//       jiraToggleLoading: false,
//       teamSyncToggleLoading: false,
//       btnSelected: "",
//       slectedProduct: "",
//       type : ''

//     }

//     this.handleChange = this.handleChange.bind(this);
//     this.handleSubmit = this.handleSubmit.bind(this);
//     this.changeStep = this.changeStep.bind(this);
//     this.setDefault = this.setDefault.bind(this);

//   }

//   componentDidMount() {
//     // this.props.SkillsAction(this.props.match.params.wId);
//     let skill = axios.get("/bot/workspace/" + this.props.match.params.wId + "/assistant_skills")
//     Promise.all([skill]).then(data => {
//       data[0].data.skills.forEach(skill => {
//         if (skill.name == "Troopr") {
//           this.setState({ TrooprProjectSkillId: skill._id })
//         }
//       })

//     })

//     if (!this.props.teamId.id) {

//       this.props.getTeamData(this.props.match.params.wId).then(res => {
//         localStorage.setItem("teamId", res.data.teamId);
//       })
//     }
//     const parsedQueryString = queryString.parse(window.location.search);
//     if (parsedQueryString.view) {
//       this.setState({ step: parsedQueryString.view, sId: parsedQueryString.sId })
//     } else {
//       //  this.setState({ step:'personalize'})
//     }
//     // if(!this.state.sendWelcomeMessage){
//     //   sendWelcomeMessageToUser(this.props.match.params.wId)
//     //   this.setState({sendWelcomeMessageToUser:true})
//     // }

//     //select radio button depending pn where user comes from
//     let type = this.props.location.pathname.split('/')[3];
//     this.setState({type})
//     if(type=="team_mood" || type=="retro" || type=="planning_poker" ||type=="checkin"){
//       this.setState({slectedProduct : type})
//       this.setState({btnSelected : "checkin"})
//     }else if(type == "jira_slack_int"){
//       this.setState({btnSelected : "jira"})
//     }
//     else{
//       this.setState({btnSelected : "both"})
//     }
//   }

//   componentDidUpdate(prevProps) {
//     const parsedQueryString = queryString.parse(window.location.search);
//     if( parsedQueryString.view ){
//       if(prevProps.location.search != window.location.search){
//         if(this.state.step != parsedQueryString.view){
//           this.setState({ step: parsedQueryString.view})
//         }
//       }
//     }else{
//       this.changeStep("personalize")
//     }
//   }



  
//   setDefault(name) {
//     let data = { default: true }
//     axios.put("/bot/api/workspace/" + this.props.match.params.wId + "/assistant_skills/" + name + "?type=onbaording", data).then(res => {
//       if (res.data.success) {
//         this.changeStep("show_success")
//         this.setState({ defaultTool: name, sId: res.data.skill._id })
//         // if(name=="Troopr"){
//         //   this.props.history.push({pathname:`/${this.props.match.params.wId}/onBoardingSuccess/${res.data.skill._id}`,

//         // state:{name:"Troopr",text:"Connected to Troopr Project Management and Standup"}
//         // })
//         //   // this.props.history.push("/"+this.props.match.params.wId+"/troopr_default/"+res.data.skill._id)
//         // } else if(name=="Standup"){

//         //   this.changeStep("standup",res.data.skill._id)
//         // }else{
//         //   this.props.history.push("/"+this.props.match.params.wId+"/skills/"+res.data.skill._id) 
//         // }
//         // this.props.history.push("/"+this.props.match.params.wId+"/skills/"+res.data.skill._id)

//       } else {

//       }
//     })
//   }
//   connectUrl = () => {

//     this.setState({ loading: true })
//     axios.get("/bot/api/workspace/" + this.props.match.params.wId + "/jiraSkill").then(res => {
//       // if(res.data.skill &&)
//       let skill = res.data.skill
//       if (skill && skill.metadata && skill.metadata.token_obj) {
//         this.setState({ loading: false })
//         // this.props.history.push("/"+this.props.match.params.wId+"/skills/"+res.data.skill._id)
//         this.props.history.push("/" + this.props.match.params.wId + "/skills/" + res.data.skill._id)
//       } else {
//         // this.props.history.push("/"+this.props.match.params.wId+"/jira_domain_oauth?source=teamsync") 
//         this.props.history.push("/" + this.props.match.params.wId + "/jira_domain_oauth?source=teamsync")
//       }
//     })
//   }
//   handleChange(event) {
//     this.setState({ assisant_name: event.target.value });
//   }
//   handleSubmit() {
//     let data = { assisantName: this.state.assisant_name }

//     axios.put("/bot/api/workspace/" + this.props.match.params.wId + "/team", data).then(res => {

//       if (res.data.success) {
//         this.changeStep("project_management_tool")

//       } else {

//       }


//     })
//   }

//   goToReport = () => {
//     this.props.history.push("/" + this.props.match.params.wId + "/reports")

//   }

//   goToSquads = () => {
//     this.props.history.push(`/${this.props.match.params.wId}/squads`)
//   }

//   goToJira = () => {
//     let JiraSkillId
//     this.props.skills && this.props.skills.map(value => {
//       if (value.name == 'Jira') {
//         JiraSkillId = value.skill_metadata._id
//       }
//     })
//     JiraSkillId && this.props.history.push("/" + this.props.match.params.wId + "/skills/" + JiraSkillId)

//   }

//   enableWikiAndRedirectToWiki = () => {
//     const {skills , updateSkill , updateWorkspace } = this.props;
//     const jiraSkill = skills.find(skill => skill.name === 'Jira')
//     let checkinSkill= skills.find(skill => skill.name === 'Troopr Standups' || skill.name=="Check-ins" ||skill.name=="Standups" )
//     const jira_skill_id = jiraSkill.skill_metadata._id
//     let wikiSkillId
//     this.props.skills && this.props.skills.map(value => {
//       if (value.name == 'Wiki') {
//         wikiSkillId = value.skill_metadata._id
//       }
//     })
//     if(wikiSkillId){
//       /* enabling wiki */
//       updateSkill(wikiSkillId, this.props.match.params.wId, {disabled : false}).then(res => {
//         if(res.data && res.data.success){
//           const url = `${window.location.origin}/${this.props.match.params.wId}/skills/${wikiSkillId}`
//           window.open(url , "_self");
//         }else{
//           message.error('Error enabling wiki integration')
//           this.props.history.push(`/${this.props.match.params.wId}/dasboard`)
//         }
//       })

//       /* enabling jira projects and checki ins */
//       const checkinSkill= skills.find(skill => skill.name === 'Troopr Standups' || skill.name=="Check-ins" ||skill.name=="Standups" )
//       const data = {disabled : false}
//       updateSkill(jira_skill_id, this.props.match.params.wId, data)
//       if(checkinSkill &&checkinSkill.skill_metadata ){
//         updateSkill(  checkinSkill.skill_metadata._id, this.props.match.params.wId,{disabled : false})
//       }
//       updateWorkspace(this.props.match.params.wId, "", { disableCheckins: false })


//     }else{
//       message.error('Error enabling wiki integration')
//       this.props.history.push(`/${this.props.match.params.wId}/dasboard`)
//     }
    
//   }

//   goToGitHub = () => {
//     let GithubSkillId
//     this.props.skills && this.props.skills.map(value => {
//       if (value.name == 'GitHub') {
//         GithubSkillId = value.skill_metadata._id
//       }
//     })
//     GithubSkillId && this.props.history.push("/" + this.props.match.params.wId + "/skills/" + GithubSkillId)

//   }

//   // skip = () => {
//   //   if (this.state.sId) {
//   //     if (this.state.sId == this.state.TrooprProjectSkillId) {
//   //       this.props.history.push("/" + this.props.match.params.wId + "/squads")
//   //     } else {
//   //       this.props.history.push("/" + this.props.match.params.wId + "/skills/" + this.state.sId)
//   //     }
//   //   }
//   //   else {
//   //     this.props.history.push(`/${this.props.match.params.wId}/squads`)
//   //   }
//   // }

//   changeStep(step, sId) {



//     let path = window.location.pathname;
//     let obj = {
//       "title": step,
//       "url": path + `?view=${step}`
//     }
//     if (sId) {
//       obj.url = obj.url + "&sId=" + sId
//     }
//     window.history.pushState(obj, obj.title, obj.url);

//     this.setState({ step: step, sId: sId })
//   }

//   redirecToDashboard = () => {
//     this.props.history.push(`/${this.props.match.params.wId}/dashboard`)
//   }

//   redirect_to_all_checkins = ({create_new}) => {
//     const url = `${window.location.origin}/${this.props.match.params.wId}/teamsyncs/templates${create_new ? '/new_team_mood_anonymous' : ''}`
//     window.open(url , "_self");
//     // this.props.history.push(`/${this.props.match.params.wId}/teamsyncs/templates${create_new ? '/new_team_mood_anonymous' : ''}`)
//   }

//   onFeatureToggle = (check, feature) => {
//     const { defaultSkill } = this.props;
//     if (feature === "squads") {
//       this.setState({ squadsToggleLoading: true });
//       this.props.updateWorkspace(this.props.match.params.wId, "", { showSquads: check }).then((res) => {
//         this.setState({ squadsToggleLoading: false });
//       });

//       //if squads is the default tracker, changing it to Jira
//       // if (defaultSkill == "Troopr") {
//       //   axios.put("/bot/api/workspace/" + this.props.match.params.wId + "/assistant_skills/" + "Jira", { default: true }).then((res) => {
//       //     if (res.data.success) {
//       //       this.setState({ defaultSkill: "Jira" });
//       //       message.success("Default Project Management Skill Changed to Jira");
//       //     }
//       //   });
//       // }
//     } else {
//       this.setState({ githubToggleLoading: true });
//       this.props.updateWorkspace(this.props.match.params.wId, "", { showGithub: check }).then((res) => {
//         this.setState({ githubToggleLoading: false });
//       });

//       //if github is the default tracker, changing it to Jira
//       // if (defaultSkill == "GitHub") {
//       //   axios.put("/bot/api/workspace/" + this.props.match.params.wId + "/assistant_skills/" + "Jira", { default: true }).then((res) => {
//       //     if (res.data.success) {
//       //       this.setState({ defaultSkill: "Jira" });
//       //       message.success("Default Project Management Skill Changed to Jira");
//       //     }
//       //   });
//       // }
//     }
//   };

//   redirect_to_moodcheckin = ()=>{
//     this.props.history.push(`/${this.props.match.params.wId}/teamsyncs/templates/new_team_mood`)
//   }
//   redirect_to_retrocheckin = ()=>{
//     const url = `${window.location.origin}/${this.props.match.params.wId}/teamsyncs/templates/new_retro_anonymous`
//     window.open(url , "_self");
//     // anonymous?this.props.history.push(`/${this.props.match.params.wId}/teamsyncs/templates/new_retro_anonymous`):this.props.history.push(`/${this.props.match.params.wId}/teamsyncs/templates/new_retro`)
//   }
//   redirect_to_planning_poker = () =>{
//     const url = `${window.location.origin}/${this.props.match.params.wId}/teamsyncs/templates/new_planning_poker`
//     window.open(url , "_self");
//   }
//   getOnBoardingButtons = () => {
//     //console.info("getOnboardingButtons()");
//     const {location, workspace} = this.props
//     const type = location.pathname.split('/')[3]
//     /*

//     return (
//       type ? <>
//          <Button style={{marginRight:0}} type="primary" onClick={() => this.redirect_to_all_checkins({create_new : type === 'team_mood' ? true : false})}>{type === 'team_mood' ? 'Create new Team Mood Anonymous Check-in' : 'Create new Check-in'}</Button><br/><br/>
//          {type==='team_mood' && <><Button onClick={() => this.redirect_to_moodcheckin()}>Create new Team Mood Non-Anonymous Check-in</Button><br/><br/></>}
//          <Button onClick={() => this.redirecToDashboard()}>Let me play around</Button>
//       </>
//       :
//       <div>
//         <Button type="primary" onClick={() => this.redirecToDashboard()}>Let's get started</Button>
//       </div>
//     )
//     */
    
//   if(type){
//     if(type==='team_mood'){
//       return(
//         <>
//          <Button style={{marginRight:0}} type="primary" onClick={() => this.redirect_to_all_checkins({create_new : true })}>{'Create new Team Mood Anonymous Check-in'}</Button><br/><br/>
//          <Button onClick={() => this.redirect_to_moodcheckin()}>Create new Team Mood Non-Anonymous Check-in</Button><br/><br/>
//          <Button onClick={() => this.redirecToDashboard()}>Let me play around</Button>
//       </>
//       )
//     }
//     else if(type==='retro'){
//       return(
//         <>
//          <Button style={{marginRight:0}} type="primary" onClick={() => this.redirect_to_retrocheckin({anonymous : true })}>{'Create new Retrospective Anonymous Check-in'}</Button><br/><br/>
//          <Button onClick={() => this.redirect_to_retrocheckin({anonymous : false })}>Create new Retrospective Non-Anonymous Check-in</Button><br/><br/>
//          <Button onClick={() => this.redirecToDashboard()}>Let me play around</Button>
//       </>
//       )
//     }
//     else{
//       return(
//         <>
//          <Button style={{marginRight:0}} type="primary" onClick={() => this.redirect_to_all_checkins({create_new : false })}>{'Create new Check-in'}</Button><br/><br/>
//          <Button onClick={() => this.redirecToDashboard()}>Let me play around</Button>
//       </>
//       )
//     }
//   }
//   else{
//     return(
//     <Button type="primary" onClick={() => this.redirecToDashboard()}>Let's get started</Button>
//     )
//   }
    
//   }
//   content_checkin = (
//     <div>
//       <div>Run Standups, Retrospectives as async Check-ins in Slack</div>
//       <div>Run Jira based Planning Poker, Task Check-in</div>
//       <div>Run Team mood survey and many more async Check-ins in Slack</div>
//     </div>
//   );

//   content_jira = (
//     <div>
//       <div>Manage Jira Software projects in Slack</div>
//       <div>Manage Jira Service Desk projects in Slack</div>
//       <div>Share Jira Reports in Slack</div>
//     </div>
//   );
//   radioStyle = {
//     display: "block",
//     height: "30px",
//     lineHeight: "30px"
//   };
//   menu = () =>{
//     return (
//       <Menu>
//         <Menu.Item key="cloud">
//           <a onClick={this.connectJiraCloud}>New Jira Cloud Connection</a>
//         </Menu.Item>

//         <Menu.Item key="server">
//           <a onClick={this.jiraoauthConnectionPage}>New Jira Server/Data Center Connection</a>
//         </Menu.Item>
//       </Menu>
//     )
//   }
//   connectJiraCloud = () => {
//     const skill = this.props.skills.find((skill)=> skill.name == "Jira" )
//     //if only jira connection then open connection in same page if checkin is next step open in another window
//     if(this.state.step == "setup_jira"){
//       const url = `${window.location.origin}/${this.props.match.params.wId}/jiraoauthCloud/${skill.skill_metadata._id}/0`
//       window.open(url , "_self");
//       // this.props.history.push(`/${this.props.match.params.wId}/jiraoauth/${skill.skill_metadata._id}`)  
//     }else{
//       const url = `${window.location.origin}/${this.props.match.params.wId}/jiraoauthCloud/${skill.skill_metadata._id}/0`
//       window.open(url , "_blank");
//     }
//   };

//   jiraoauthConnectionPage=()=>{
//     const skill = this.props.skills.find((skill)=> skill.name == "Jira" )
//     //if only jira connection then open connection in same page if checkin is next step open in another window
//     if(this.state.step == "setup_jira"){
//       const url = `${window.location.origin}/${this.props.match.params.wId}/jiraoauthServer/${skill.skill_metadata._id}/0`
//       window.open(url , "_self");
//       // this.props.history.push(`/${this.props.match.params.wId}/jiraoauth/${skill.skill_metadata._id}`)  
//     }else{
//       const url = `${window.location.origin}/${this.props.match.params.wId}/jiraoauthServer/${skill.skill_metadata._id}/0`
//       window.open(url , "_blank");
//     }
//   };

//   onRadioSelect = (e) =>{
//     this.setState({radioSelected : e.target.value})
//   }
//   getFullScreenOnboarding = () =>{
//     return (
//       <> 
//         <Row
//               style={{
//                 color: "white",
//                 backgroundColor: "black",
//                 paddingBottom: 32,
//               }}
//               justify='center'
//             >
//               <Col style={{ textAlign: "center", backgroundColor: "black" }} span={12}>
//                 <img src='https://app.troopr.io/logo/troopr-logo-animation-black-small.gif' width='96' height='54' />
//               </Col>
//             </Row>
//             <Row style={{ backgroundColor: "black", paddingBottom: 16 }} justify='center'>
//               <Col style={{ textAlign: "center" }} span={24}>
//                 <Typography.Title>Welcome to Troopr</Typography.Title>
//               </Col>
//               <Col span={24} style={{ textAlign: "center" }}>
//                 <Typography.Text type='secondary'>"Troopr Assistant" app is now successfully installed in your Slack workspace.</Typography.Text>
//               </Col>
//             </Row>

//             <Row justify='center'>
//               <Col span={12}>
//                 <Button
//                   block
//                   type='primary'
//                   size='large'
//                   onClick={() => {
//                     if(this.state.type === 'jsi_wiki_na') this.enableWikiAndRedirectToWiki()
//                     else this.changeStep("options");
//                   }}
//                 >
//                   Lets get started
//                 </Button>
//               </Col>
//             </Row>
//       </>
//     )
//   }
//   selectBtn = (btn) =>{
//     this.setState({btnSelected : btn});
//   }
//   getOptionsScreen = () => {
//     return (
//       <><Row
//           style={{
//             backgroundColor: "black",
//             paddingBottom: 32
//           }}
//           justify="center"
//         >
//         <Col
//           style={{ textAlign: "center", backgroundColor: "black" }}
//           span={12}
//         >
//           <img
//             src="https://app.troopr.io/logo/troopr-logo-animation-black-small.gif"
//             width="96"
//             height="54"
//           />
//         </Col>
//       </Row>
//             <Row style={{ backgroundColor: "black", paddingBottom: 16 }} justify='center'>
//               <Col style={{ textAlign: "center" }} span={24}>
//                 <Typography.Title level={3}>What do like to use Troopr for?</Typography.Title>
//               </Col>
//               <Col span={24} style={{ textAlign: "center" }}>
//                 <Typography.Text type='secondary'>This will personalize Troopr experience for your team
//                   members.</Typography.Text>
//               </Col>
//             </Row>

//             {/* <Row
//               style={{ backgroundColor: "black", paddingBottom: 16 }}
//               justify="center"
//             >
//               <Col
//                 style={{ textAlign: "center", backgroundColor: "black" }}
//                 span={24}
//               >
//                 <div
//                   style={{ fontSize: 24, fontWeight: "bold", color: "white" }}
//                 >
//                 What do like to use Troopr for?
//                 </div>
//               </Col>
//               <Col span={20}>
//                 <div style={{ textAlign: "center", color: "grey" }}>
//                   This will personalize Troopr experience for your team
//                   members.
//                 </div>
//               </Col>
//             </Row> */}


//             <Row
//               style={{
//                 color: "white",
//                 // backgroundColor: this.onboardingSettings.bgColor,
//                 backgroundColor: "black" ,
//                 paddingBottom: 16
//               }}
//               justify="center"
//             >
//               <Col span={18} style={{marginLeft : "58px"}}>
//                 <Button
//                   // type={this.state.btnSelected == "jira" ? "default" : "text"}
//                   type = "text"
//                   style={{
//                     marginBottom: 8,
//                     width: 350,
//                     marginRight: 8,
//                     border:"1px solid #434343"
//                   }}
//                   onClick={() => {
//                     this.selectBtn("jira")
//                   }}
//                   icon={
//                     this.state.btnSelected === "jira" ? <CheckOutlined /> : <CheckOutlined style={{ visibility: "hidden" }} />
//                   }
//                 >
//                   Managing Jira Projects & Service Desk in Slack
//                 </Button>
//                 <Popover
//                   content={this.content_jira}
//                   title="What do I get?"
//                   trigger="hover"
//                 >
//                   <QuestionCircleOutlined
//                     size="small"
//                     // style={{ color: "white" }}
//                   />
//                 </Popover>

//                 <Button
//                   // type={this.state.btnSelected == "checkin" ? "default" : "text"}
//                   type = "text"
//                   style={{
//                     marginBottom: 8,
//                     width: 350,
//                     marginRight: 8,
//                     border:"1px solid #434343"
//                   }}
//                   onClick={() => {
//                     this.selectBtn("checkin")
//                   }}
//                   icon={
//                     this.state.btnSelected === "checkin" ? <CheckOutlined /> : <CheckOutlined style={{ visibility: "hidden" }} />
//                   }
//                 >
//                   Conducting Slack Check-in meetings
//                 </Button>
//                 <Popover
//                   content={this.content_checkin}
//                   title="What do I get?"
//                   trigger="hover"
//                 >
//                   <QuestionCircleOutlined
//                     size="small"
//                     // style={{ color: "white" }}
//                   />
//                 </Popover>

//                 <Button
//                   // type={this.state.btnSelected == "both" ? "default" : "text"}
//                   type = "text"
//                   style={{
//                     marginBottom: 8,
//                     width: 350,
//                     marginRight: 8,
//                     border:"1px solid #434343"
//                   }}
//                   onClick={() => {
//                     this.selectBtn("both")
//                   }}
//                   icon={
//                     this.state.btnSelected === "both" ? <CheckOutlined /> : <CheckOutlined style={{ visibility: "hidden" }} />
//                   }
//                 >
//                   Both
//                 </Button>
                
//                 {/* <Button
//                   type={
//                     this.state.btnselected == "checkin" ? "default" : "text"
//                   }
//                   onClick={() => {
//                     this.selectBtn("checkin")
//                   }}
//                   style={{ marginBottom: 8, width: 350, marginRight: 8 }}
//                   // icon={
//                   //   this.state.selected === "checkin" ? <CheckOutlined /> : ""
//                   // }
//                 >
//                   Conducting Slack Check-in meetings
//                 </Button>
//                 <Popover
//                   content={this.content_checkin}
//                   title="What do I get?"
//                   trigger="hover"
//                 >
//                   <QuestionCircleOutlined
//                     size="small"
//                     // style={{ color: "white" }}
//                   />
//                 </Popover>
//                 <Button
//                   type={this.state.btnselected == "both" ? "default" : "text"}
//                   onClick={() => {
//                     this.selectBtn("both")
//                   }}
//                   style={{ marginBottom: 4, width: 350 }}
//                   // icon={
//                   //   this.state.selected === "both" ? <CheckOutlined /> : ""
//                   // }
//                 >
//                   Both
//                 </Button> */}
//                </Col>
//             </Row>
            
//             <Row
//               style={{ backgroundColor: "black", paddingBottom: 8 }}
//               justify="center"
//             >
//               <Col
//                 style={{ textAlign: "center", backgroundColor: "black" }}
//                 span={8}
//               >
//                 <Button
//                   block
//                   type="primary"
//                   size="large"
//                   onClick={() => {
//                     //based on selected radio button enable/disable feature and go to next screen
//                     const {skills , updateSkill , updateWorkspace } = this.props;
//                     const jiraSkill = skills.find(skill => skill.name === 'Jira')
//                     let checkinSkill= skills.find(skill => skill.name === 'Troopr Standups' || skill.name=="Check-ins" ||skill.name=="Standups" )
//                     const skill_id = jiraSkill.skill_metadata._id
//                     if(jiraSkill){
//                       if(this.state.btnSelected === "jira"){
//                         const data = {disabled : false}
//                         updateSkill(skill_id, this.props.match.params.wId, data)
//                         if(checkinSkill &&checkinSkill.skill_metadata ){
//                           updateSkill(  checkinSkill.skill_metadata._id, this.props.match.params.wId,{disabled : true})
//                           // checkinSkill
//                         }
//                         updateWorkspace(this.props.match.params.wId, "", { disableCheckins: true })
//                         this.changeStep("setup_jira");
//                       }
//                       if(this.state.btnSelected === "checkin"){
//                         const data = {disabled : true}
//                         updateSkill(skill_id, this.props.match.params.wId, data)
//                         if(checkinSkill &&checkinSkill.skill_metadata ){
//                           updateSkill(  checkinSkill.skill_metadata._id, this.props.match.params.wId,{disabled : false})
//                           // checkinSkill
//                         }
//                          updateWorkspace(this.props.match.params.wId, "", { disableCheckins: false })
//                         this.changeStep("setup_checkin");
//                       }
//                       if(this.state.btnSelected === "both"){
//                         const data = {disabled : false}
//                         updateSkill(skill_id, this.props.match.params.wId, data)
//                         if(checkinSkill &&checkinSkill.skill_metadata ){
//                           updateSkill(  checkinSkill.skill_metadata._id, this.props.match.params.wId,{disabled : false})
//                           // checkinSkill
//                         }
//                         updateWorkspace(this.props.match.params.wId, "", { disableCheckins: false })
//                         this.changeStep("setup");
//                       }
//                     }
                    
//                   }}
//                 >
//                   Continue
//                 </Button>
//               </Col>
//             </Row>
//             </>
//     )
//   }
//   getJiraSetUpScreen = () =>{
//     return (
//       <div>
//         <Row
//           style={{
//             color: "white",
//             backgroundColor: "black",
//             paddingBottom: 32
//           }}
//           justify="center"
//         >
//           <Col
//             style={{ textAlign: "center", backgroundColor: "black" }}
//             span={12}
//           >
//             <img
//               src="https://app.troopr.io/logo/troopr-logo-animation-black-small.gif"
//               width="96"
//               height="54"
//             />
//           </Col>
//         </Row>

//         <Row style={{ backgroundColor: "black", paddingBottom: 16 }} justify='center'>
//               <Col style={{ textAlign: "center" }} span={24}>
//                 <Typography.Title level={3}>OK, lets get your Jira connected</Typography.Title>
//               </Col>
//               <Col span={24} style={{ textAlign: "center" }}>
//                 <Typography.Text type='secondary'>This will initiate the process to connect Troopr to your Jira account.</Typography.Text>
//               </Col>
//             </Row>

//         {/* <Row
//                 style={{ backgroundColor: "black", paddingBottom: 16 }}
//                 justify="center"
//               >
//                 <Col
//                   style={{ textAlign: "center", backgroundColor: "black" }}
//                   span={24}
//                 >
//                   <div
//                     style={{ fontSize: 24, fontWeight: "bold", color: "white" }}
//                   >
//                     OK, lets get your Jira connected
//                   </div>
//                 </Col>
//                 <Col span={22}>
//                   <div style={{ textAlign: "center", color: "grey" }}>
//                     This will initiate the process to connect Troopr to your Jira account.
//                   </div>
//                 </Col>
//               </Row> */}
//               <Row
//                 style={{ backgroundColor: "black", paddingBottom: 8 }}
//                 justify="center"
//               >
//                 <Col
//                   style={{ textAlign: "center", backgroundColor: "black" }}
//                   span={8}
//                 >
//                   <Dropdown overlay={this.menu} trigger={['click']} placement='bottomLeft'>
//                       <Button
//                         block
//                         type="primary"
//                         size="large"
//                         color="#664af0"
//                         // onClick={() => {
//                         //   // this.handleCancel();
//                         // }}
//                       >
//                         Connect
//                       </Button>
//                   </Dropdown>
//                   <Button
//                     block
//                     type="link"
//                     size="large"
//                     onClick={() => {
//                       // localStorage.setItem("theme" , "default");
//                       // this.redirecToDashboard()
//                       const url = `${window.location.origin}/${this.props.match.params.wId}/dashboard`
//                       window.open(url , "_self");
//                     }}
//                   >
//                     Skip
//                   </Button>
//                 </Col>
//               </Row>
//       </div>
//     )
//   }
//   getCheckInSetUpScreen = () =>{
//     return (
//       <div>
//         <Row
//           style={{
//             color: "white",
//             backgroundColor: "black",
//             paddingBottom: 32
//           }}
//           justify="center"
//         >
//           <Col
//             style={{ textAlign: "center", backgroundColor: "black" }}
//             span={12}
//           >
//             <img
//               src="https://app.troopr.io/logo/troopr-logo-animation-black-small.gif"
//               width="96"
//               height="54"
//             />
//           </Col>
//         </Row>

//         <Row style={{ backgroundColor: "black", paddingBottom: 16 }} justify='center'>
//               <Col style={{ textAlign: "center" }} span={24}>
//                 <Typography.Title level={3}>OK, lets setup the first Check-in for your team</Typography.Title>
//               </Col>
//               <Col span={24} style={{ textAlign: "center" }}>
//                 <Typography.Text type='secondary'>You can create a new{(this.state.slectedProduct == "team_mood")? " Team Mood ": 
//                                         (this.state.slectedProduct == "retro")? " Retrospective ":
//                                         (this.state.slectedProduct == "planning_poker")?" Planning Poker ":""} Check-in here or in Slack.</Typography.Text>
//               </Col>
//             </Row>


//               {/* <Row
//                 style={{ backgroundColor: "black", paddingBottom: 16 }}
//                 justify="center"
//               >
//                 <Col
//                   style={{ textAlign: "center", backgroundColor: "black" }}
//                   span={24}
//                 >
//                   <div
//                     style={{ fontSize: 24, fontWeight: "bold", color: "white" }}
//                   >
//                     OK, lets setup the first Check-in for your team
//                   </div>
//                 </Col>
//                 <Col span={18}>
//                   <div style={{ textAlign: "center", color: "grey" }}>
//                     You can create a new{(this.state.slectedProduct == "team_mood")? " Team Mood ": 
//                                         (this.state.slectedProduct == "retro")? " Retrospective ":""} Check-in here or in Slack.
//                   </div>
//                 </Col>
//               </Row> */}
//               <Row
//                 style={{ backgroundColor: "black", paddingBottom: 8 }}
//                 justify="center"
//               >
//                 <Col
//                   style={{ textAlign: "center", backgroundColor: "black" }}
//                   span={8}
//                 >
//                   <Button
//                     block
//                     type="primary"
//                     size="large"
//                     color="#664af0"
//                     onClick={() => {
//                       const {slectedProduct} = this.state
//                       //console.info("slectedProduct",slectedProduct)
//                       // localStorage.setItem("theme" , "default");
//                       if(slectedProduct == "team_mood"){
//                         this.redirect_to_all_checkins({create_new : true })
//                       }else if(slectedProduct == "retro"){
//                         this.redirect_to_retrocheckin({anonymous : true })
//                       }else if(slectedProduct == "planning_poker"){
//                         this.redirect_to_planning_poker()
//                       }else {
//                         this.redirect_to_all_checkins({create_new : false });
//                       }
//                     }}
//                   >
//                     Continue here
//                   </Button>
                  
//                   {/* <div style={{ padding: 8 }} /> */}
//                 </Col>
//                 <Button
//                     block
//                     type="link"
//                     size="large"
//                     target="_blank"
//                     href = {`https://slack.com/app_redirect?app=${localStorage.getItem('app') || "AE4FF42BA"}&team=${this.props.teamId.id}`}
//                   >Go to Troopr in Slack
//                   </Button>
//               </Row>
//       </div>
//     )
//   }
//   getSetUpScreen = () => {
//     return (
//       <>
//         <Row
//           style={{
//             color: "white",
//             backgroundColor: "black",
//             paddingBottom: 32
//           }}
//           justify="center"
//         >
//           <Col
//             style={{ textAlign: "center", backgroundColor: "black" }}
//             span={12}
//           >
//             <img
//               src="https://app.troopr.io/logo/troopr-logo-animation-black.gif"
//               width="96"
//               height="54"
//             />
//           </Col>
//         </Row>
        
//         <Row style={{ backgroundColor: "black", paddingBottom: 16 }} justify='center'>
//               <Col style={{ textAlign: "center" }} span={24}>
//                 <Typography.Title level={3}>OK, lets get your Jira connected</Typography.Title>
//               </Col>
//               <Col span={24} style={{ textAlign: "center" }}>
//                 <Typography.Text type='secondary'>This will initiate the process to connect Troopr to your Jira account.</Typography.Text>
//               </Col>
//             </Row>


//         {/* <Row
//                 style={{ backgroundColor: "black", paddingBottom: 16 }}
//                 justify="center"
//               >
//                 <Col
//                   style={{ textAlign: "center", backgroundColor: "black" }}
//                   span={24}
//                 >
//                   <div
//                     style={{ fontSize: 24, fontWeight: "bold", color: "white" }}
//                   >
//                     OK, lets get your Jira connected
//                   </div>
//                 </Col>
//                 <Col span={22}>
//                   <div style={{ textAlign: "center", color: "grey" }}>
//                     This will initiate the process to connect Troopr to your Jira account.
//                   </div>
//                 </Col>
//               </Row> */}
//               <Row
//                 style={{ backgroundColor: "black", paddingBottom: 8 }}
//                 justify="center"
//               >
//                 <Col
//                   style={{ textAlign: "center", backgroundColor: "black" }}
//                   span={16}
//                 >
//                   <Dropdown overlay={this.menu} trigger={['click']} placement='bottomLeft'>
//                       <Button
                        
//                         type="primary"
//                         size="large"
//                         color="#664af0"
//                       >
//                         Connect
//                       </Button>
//                   </Dropdown>
//                   <Button
                    
//                     type="link"
//                     size="large"
//                     onClick={() => {
//                       //should show Checkins Config
//                       this.changeStep("setup_checkin");
//                     }}
//                   >
//                     Skip / Proceed
//                   </Button>
//                 </Col>
//               </Row>
//             </>
//     )
//   }
  
//   render() {
//     let appId = localStorage.getItem('app') || "AE4FF42BA"
//     const {location, workspace} = this.props
//     // localStorage.setItem("theme" , "dark")

//     return (
//       <>
//       <Theme />
//         <Modal
//         // title={this.state.step == "project_management_tool" ? "Pick a Troopr configuration that makes sense to you" : ""}
//         visible={this.state.visible}
//         footer={null}
//         maskClosable={false}
//         maskStyle={{ backgroundColor: "rgba(0, 0, 0, 1)" }}
//         bodyStyle={{ backgroundColor: "black" }}
//         closable={this.state.step == "standup" ? true : false}
//         width={600}
//         // style={this.state.step == "project_management_tool" ? { height: "50vh" } : {}}
//         // onCancel={this.skip}
//         onCancel={this.redirecToDashboard}

//       >
        
//         {this.state.type === 'jsi_wiki_na' ? 
//             (this.state.step == "personalize" || this.state.step == "project_management_tool") && this.getFullScreenOnboarding()   
//         :
//         <>
//         {
//           (this.state.step == "personalize" || this.state.step== "project_management_tool")&&this.getFullScreenOnboarding()
//         }
//         {
//           this.state.step == "options" && this.getOptionsScreen() 
//         }
//         {
//           this.state.step == "setup_jira" && this.getJiraSetUpScreen()
//           // this.state.step == "setup_jira" && <JiraSetUpScreen/>
//         }
//         {
//           this.state.step == "setup_checkin" && this.getCheckInSetUpScreen()
//         }
//         {
//           this.state.step == "setup" && this.getSetUpScreen()
//         }
//         </>
//       }
//         {
//         /* {this.state.step == "show_success" && <Result
//           icon={<CheckCircleTwoTone />}
//           title={`${this.state.defaultTool} is selected as default Project Management`}
//           subTitle="You can try Troopr privately in Slack DM channel. When you are ready, invite Troopr to your project or team channel to get started."
//           extra={[<Button icon={<SlackOutlined />} href={`https://slack.com/app_redirect?app=${appId}&team=${this.props.teamId.id}`} target="_blank" type="primary" key="slack"> Take me to Slack
//             </Button>, <br />, <br />,
//           this.state.defaultTool === 'Jira' ?
//             <Button icon={<BarChartOutlined />} onClick={this.goToJira} type="link" key="report">Connect Jira Account</Button>
//             : this.state.defaultTool === "GitHub" ?
//               <Button icon={<BarChartOutlined />} onClick={this.goToGitHub} type="link" key="report">Connect GitHub Account</Button>
//               : this.state.defaultTool === "Troopr" ?
//               <Button icon={<BarChartOutlined />} onClick={this.goToSquads} type="link" key="report">Go to Squad</Button>
//               :
//               // <Button icon="bar-chart"  onClick={this.goToReport} type="primary" key="report">Go to Reports</Button>
//               ''

//           ]}
//         />} */}


//         {/* {this.state.step == "project_management_tool" && <React.Fragment>
//           <Row justify="center" type="flex" align="middle" gutter={{ xs: 8, sm: 16, md: 24 }}>
//             <Col span={10} >
//               <Card
//                 onClick={this.setDefault}
//                 onClick={() => this.setDefault("Jira")}
//                 hoverable
//                 style={{ paddingTop: 20, height: 250 }}
//                 cover={
//                   <div style={{ width: "100%", "height": "60%", padding: 20 }} className="justify_center row_flex align_center">
//                     <img
//                       style={{ width: "50%", height: "50%" }}
//                       alt="example"
//                       src={JiraLogo}
//                     />
//                   </div>
//                 }
//               >
//                 {/* <h3 style={{ width: "100%", textAlign: "center" }}>Jira  <br /> + <br /> Standup</h3> */}
//                 {/* <Title level={4} style={{ width: "100%", textAlign: "center",fontSize:'17px',fontWeight:100,fontFamily:'Arial' }}>Jira  <br /> + <br /> Check-ins</Title>
//               </Card>
//             </Col> */}
//             {/* <Col span={6} >
//               <Card onClick={() => this.setDefault("GitHub")}
//                 hoverable
//                 style={{ paddingTop: 20, height: 250 }}
//                 cover={
//                   <div style={{ width: "100%", "height": "60%", padding: 20 }} className="justify_center row_flex align_center">
//                     <img
//                       style={{ width: "50%", height: "50%",background:'white' }}
//                       alt="example"
//                       src={GitHubLogo}
//                     />
//                   </div>
//                 }
//               >
//                 <Title level={4} style={{ width: "100%", textAlign: "center",fontSize:'17px',fontWeight:100,fontFamily:'Arial' }}>GitHub  <br /> + <br />Check-ins</Title>
//               </Card>
//             </Col > */}
//             {/* <Col span={10}  > */}
//               {/* <Card onClick={() => this.setDefault("Troopr")}
//                 hoverable
//                 style={{ paddingTop: 20, height: 250 }}
//                 cover={
//                   <div style={{ width: "100%", "height": "60%", padding: 20 }} className="justify_center row_flex align_center">
//                     <img
//                       style={{ width: "50%", height: "50%" }}
//                       alt="example"
//                       src={TroorLogo}
//                     />
//                   </div>
//                 }
//               >
//                 {/* <h3 style={{ width: "100%", textAlign: "center" }}>Troopr Projects <br /> + <br /> Standup</h3> */}
//                 {/* <Title level={4} style={{ width: "100%", textAlign: "center",fontSize:'17px',fontWeight:100,fontFamily:'Arial' }}>Troopr Squad <br /> + <br /> Check-Ins</Title>
//               </Card> */} 
//             {/* </Col > */}
//             {/* <Col span={6}  > */}

//             {/* <Card  onClick={()=>this.setDefault("Standup")}
//     hoverable
//     style={{ paddingTop:20, height:250}}
//     cover={
//       <div  style={{ width:"100%","height":"60%",padding:20 }}  className="justify_center row_flex align_center">
//         <img
//             style={{ width: "50%",height:"50%"}}
//           alt="example"
//           src={TroorLogo}
//         />
//       </div>
//     }
//   >
// <h3 style={{ width:"100%",textAlign:"center"}}>Troopr Standup Only</h3>
//   </Card> */}

//             {/* </Col> */}


//             {/* <Alert style={{ marginTop: 30 }} message="You can change this setting anytime." type="info" showIcon />
            
//           </Row>
//         </React.Fragment>
//         } */}

//         {/* {this.state.step=="standup"&&<Result
//             icon={<Icon type="check-circle" />}
//             status="success"
//             title="Done"
//             subTitle="Troopr Standups enabled in your workspce."
//             extra={[
//                   <Button  onClick={this.connectUrl}  type="primary" key="jira_btn">
//                      Connect Jira To Standup
//                    </Button>,
//                       <br/>,
//                       <br/>,
//               <Button icon="slack"   href={`https://slack.com/app_redirect?app=AE4FF42BA&team=${this.props.teamId.id}`}  type="primary" key="slack">
//                 Create new Standup
//               </Button>
           
//             ]}
//           />} */}

//       </Modal>
//       </>
//     );
//   }
// }
// const mapStateToProps = state => ({

//   workspace: state.common_reducer.workspace,
//   teamId: state.skills.team,
//   user: state.auth.user,
//   skills: state.skills.skills
//   // assistant: storec,
// });

// export default withRouter(connect(mapStateToProps, { getTeamData, updateWorkspace , getSkillConnectUrl , setJiraConnectId ,updateSkill })(OnBoarding))

