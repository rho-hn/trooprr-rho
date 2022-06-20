import React,{ Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {getProject, personalSetting, getJiraUserNotifConfig, setUserJiraNotifConfig,getGitHubChannelConfig, setGitHubChannelConfig,getGitHubUserConfig,setGitHubUserChannelConfig } from '../skills_action';
import { ToastContainer } from "react-toastify";
import { Button, Checkbox, Switch, message } from 'antd';
import { Typography ,Select,Card} from 'antd';
import '../jira/jira.css';



const { Text,Paragraph } = Typography;
const { Option } = Select;


let ChannelFrequency = [
	{
		name:"Real Time",
		value:0
	},{
	name:"1 min",
	value:1
},{
	name:"5 min",
	value:5
},{
	name:"15 min",
	value:15
},{
	name:"30 min",
	value:30
},{
	name:"1 hr",
	value:60
},{
	name:"2 hrs",
	value:120
},{
	name:"4 hrs",
	value:240
},{
	name:"6 hrs",
	value:360
},{
	name:"12 hrs",
	value:720
},
];

var notifEvent = [
	
	{
	    label:"Updates to project cards assigned to me",
	    value:"update_pr"
	},
	{
	    label:"Updates to issues assigned to me",
	    value:"update_issue"
	},
	{
	    label:"@mentions in comment",
	    value:"git_mention"
	},
	
]

const CloseButton = ({ closeToast }) => (
  <span className="close-toaster-text" onClick={closeToast}>
    DISMISS
  </span>
);

class GithubPersonalNotification extends Component {
	constructor(props){
		super(props)
		this.state = {
            notifStatus: false,
            projectNotif: [],
            notifEvent: [],
            notifFrequency: '',
            personalChannelId: '',
            error:{},
			selectedProjectName: '',
			enableUserNotif:false,
			channelNotifFreq:1,
			loading:false
		}
	}

	componentDidMount() {
		 let data = localStorage.trooprUserId;
		 this.props.personalSetting(this.props.match.params.wId, data).then(res=>{
			//  console.log("ressssss==>",res.data.channel.id);
		 
	// console.log("this.props.channelDefault==??>",res);
		 
		 if(res.data && res.data.channel && res.data.channel.id){
			
			this.props.getGitHubUserConfig(this.props.match.params.wId,this.props.match.params.skill_id,this.props.channelDefault.personalSetting.id)
			.then(res=>{
   
				if(res.data.success){
					this.setState({
						notifStatus: res.data.data.status,
						notifEvent: res.data.data.event_type,
						channelNotifFreq:res.data.data.frequency
					})
				}
				else{
					this.setState({
						notifStatus: true,
						notifEvent: ["update_pr", "update_issue", "git_mention"]
					})
				}
				// console.log("data at frontend===>",data);
			})
		}
	})

		 
	}

	toggleNotif = () => {
		this.setState({notifStatus:!this.state.notifStatus});
	}

	 onChangeProject = (e) => {
       const index = e.nativeEvent.target.selectedIndex;
       const text = e.nativeEvent.target[index].text;
       this.setState({[e.target.name]: e.target.value, selectedProjectName: text});
     }

     onChangeEvent = (e) => {
		//  console.log("eee==>",e)
     	if(this.state.notifEvent){  
	        let arr = this.state.notifEvent;
	     	let index = arr.findIndex(item => item === e.target.value)
	     	if (index > -1 ) {
	           arr.splice(index,1)
	     	}else{
	           arr.push(e.target.value)
	     	}
	     	this.setState({[e.target.name]:arr}, () =>{
				//  console.log("======<>events",this.state.notifEvent,"toggle button",this.state.enableUserNotif) ;
			 });
     	}  
     }

	 onChangeFrequency = (event , value) => {
		
		this.setState({
			channelNotifFreq:event
		},()=>{
			// console.log("channel ferequency==?>",this.state.channelNotifFreq)
		});
	  
	}



	onSave = () =>{
		// console.log("entered onSave function",this.props.channelDefault.currentSkillUser);
		// console.log("this.state.selectedProjectName======>",this.props.channelDefault)
		
		// if(this.state.notifStatus){
			// console.log("bnotif event==>",this.state.notifevent);
			this.setState({loading:true})
			let data = {
				user_id:localStorage.trooprUserId,
				workspace_id:this.props.match.params.wId,
				channel_id:this.props.channelDefault.personalSetting.id,
				status:this.state.notifStatus,
				event_type: this.state.notifEvent,
				account_id:this.props.channelDefault.currentSkillUser.user_obj.accountId,
				is_bot_channel:true,
				frequency:this.state.channelNotifFreq,
				skill_id:this.props.match.params.skill_id

			};
			// console.log("data=========>",data)
			// console.log("saving the event withour anything===>",this.state.notifEvent);
			let events = this.state.notifEvent ;
			// console.log("events==>",events.length);
			if(events.length > 0){
				this.props.setGitHubUserChannelConfig(this.props.match.params.wId,this.props.match.params.skill_id,data)
				.then(data=>{
					// console.log("data at frontend===>",data);
				})
		// }		
		// customToast.success("Saved successfully", {
		// 	className:
		// 	  "some-toast-box d-flex justify-content-between align-items-center"
		//   });
		this.setState({loading:false})
		message.success("Saved successfully");		
			}
			else{
				if(this.state.notifStatus){
					// customToast.issueSelection("Please select the issue", {
					// 	className:
					// 	  "some-toast-box d-flex justify-content-between align-items-center"
					//   });	
					this.setState({loading:false})
					message.error("Please select the Event");
				}
				else{
					this.props.setGitHubUserChannelConfig(this.props.match.params.wId,this.props.match.params.skill_id,data)
				.then(data=>{
					// console.log("data at frontend===>",data);
				})
					// customToast.success("Saved successfully", {
					// 	className:
					// 	  "some-toast-box d-flex justify-content-between align-items-center"
					//   });
					this.setState({loading:false})
					message.success("Saved successfully");
					
				}
				
			}
																												
	}

	toggleOn = () =>{
		this.setState({
			enableUserNotif:false
		})
	}

	toggleOff = () =>{

		this.setState({
			enableUserNotif:true
		})
	}



  render() {
    return (
      <div>
        <Card size='small' title="Personal Notifications" extra={<Switch
          checked={this.state.notifStatus}
          onClick={this.toggleNotif}
        />}>
          <Paragraph type='secondary'>Customize what notifications you want to recive in this channel.</Paragraph>
          <br />
          <div style={{ marginBottom: '14px' }} className='align-items-center justify-content-between proj-setting-common-pointer'>
            {notifEvent && notifEvent.map((event, index) => (
              <div className="d-flex align-items-center">

                <Checkbox
                  style={{ marginLeft: '12px', fontSize: '16px', marginBottom: '4px' }}
                  disabled={!this.state.notifStatus}
                  checked={this.state.notifEvent.find(item => item === event.value)}
                  name="notifEvent"
                  onChange={this.onChangeEvent}
                  value={event.value}
                >
                  <Text type="secondary">{event.label}</Text>
                </Checkbox>
              </div>
            ))}
          </div>




          {/*------------------------------Toggle(Enable/Disable)------------------------------*/}
          {/* <div> */}
            {/* <div className="d-flex align-items-center justify-content-between"> */}

            {/* <div style={{cursor:'pointer'}} onClick={this.toggleNotif}>
                                {this.state.notifStatus ? <i style={{color: '#403294'}} className="material-icons ts_toggle_icon ts_off_icon" onClick = {this.toggleOn}>toggle_on</i>
                                                        :<i className="material-icons ts_toggle_icon ts_off_icon" onClick = {this.toggleOff}>toggle_off</i>}
                             </div>*/}
            {/* <Switch 
                                 checked={this.state.notifStatus}
                                 onClick={this.toggleNotif}
                               /> */}
            {/* </div> */}


            {/*------------------------------Project------------------------------*/}
            {/* <div className={this.state.notifStatus ? "" : "Preference_disable_state"}>
                   <div className="Jira_preference_personal_default_type">Project</div>
                     <div className='d-flex align-items-center justify-content-between proj-setting-common-pointer jira_setting_select_options_wrapper project-setting-select-wraper'>
                           <select disabled={!this.state.notifStatus} name="projectNotif" className="form-control custom-select" value={this.state.projectNotif} onChange={this.onChangeProject}>
	                         <option value=''>Project</option>
		                      {this.props.projects && this.props.projects.map((project, index) => (
		                     <option key={project.id}  value={project.id}>{project.name}</option>
		                     ))}
		                  </select> 
                    </div>
                 </div> */}
            {this.state.error.projectNotif && <div className="error_message">{this.state.error.projectNotif}</div>}
            {/*------------------------------Event Type------------------------------*/}
            {/* <div className={this.state.notifStatus ? "" : "Preference_disable_state"}>
                  <div className="Jira_preference_personal_default_type">Event type</div>
                    <div style={{marginBottom:'14px'}} className='align-items-center justify-content-between proj-setting-common-pointer'>
		                    {notifEvent && notifEvent.map((event, index) => (
		                    	<div className="d-flex align-items-center">
		                          <input disabled={!this.state.notifStatus} type="checkbox" checked={this.state.notifEvent.find(item => item  === event.value)} name="notifEvent" onChange={this.onChangeEvent} value={event.value}/>
                                   <div style={{marginLeft:'12px',fontSize:'16px',marginBottom:'4px'}} className="">{event.label}</div>
		                        </div>
		                    ))}
                   </div>
				</div>  */}

            {/* <div className="Jira_preference_personal_default_type"> <Text type="secondary" style={{fontSize:"14px"}}> Event type</Text>  </div> */}
            {/* <div style={{marginBottom:'14px'}} className='align-items-center justify-content-between proj-setting-common-pointer'>
				{notifEvent.map((event, index) => (
		                    	<div className="d-flex align-items-center">
		                          <Checkbox 
		                              style={{marginLeft:'12px',fontSize:'16px',marginBottom:'4px'}}
		                              disabled={!this.state.notifStatus} 
		                              checked={this.state.notifEvent.find(item => item  === event.value)} 
		                              name="notifEvent" 
		                              onChange={this.onChangeEvent} 
		                              value={event.value}
		                              >
		                                 <Text type="secondary" style={{fontSize:"14px"}}>{event.label}</Text>   
                                   </Checkbox>
		                        </div>
		                    ))}
				</div> */}
            {this.state.error.notifEvent && <div className="error_message">{this.state.error.notifEvent}</div>}
            {/*------------------------------Frequency------------------------------*/}
            {/* <div className={this.state.notifStatus ? "" : "Preference_disable_state"}>
                  <div className="Jira_preference_personal_default_type">Frequency</div>
                    <div className='d-flex align-items-center justify-content-between proj-setting-common-pointer jira_setting_select_options_wrapper project-setting-select-wraper'>
		                  <select disabled={!this.state.notifStatus || !this.state.notifEvent} name="notifFrequency" className="form-control custom-select" value={this.state.notifFrequency} onChange={this.onChangeFrequency}>
		                    <option value=''>Frequency</option>
		                    {notifFrequency && notifFrequency.map((freq, index) => (
		                      <option key={freq.value} value={freq.value}>{freq.label}</option>
		                     ))}
		                  </select>
                   </div>
				</div> */}

            <div className={this.state.notifStatus ? "bottom_space_forms" : "Preference_disable_state"}>
                   <div className=""><Text type="secondary">Frequency</Text></div>
            <div className='d-flex align-items-center justify-content-between proj-setting-common-pointer'>
              <Select
                disabled={!this.state.notifStatus}
                name="projectNotif"
                style={{ width: 200 }}
                value={this.state.channelNotifFreq}
                placeholder="Select Frequency"
                onChange={this.onChangeFrequency}>
                {ChannelFrequency.map((project, index) => (
                  <Option key={project.value} value={project.value}>{project.name}</Option>
                ))}
              </Select>
            </div>
          </div>

          {/*------------------------------Buttons------------------------------*/}
          {/*{this.state.notifStatus ?
                   <div className="d-flex">
                     <div className=" btn_114 margin__right__button" onClick={this.onCancel}>Cancel</div>
                     <div className="btn_114 margin__right__button" onClick={this.onSave}>Save</div></div>
                     : ""
                }*/}
          <div className="d-flex">
            {/* <Button type="primary" ghost className="btn_114 margin__right__button" onClick={this.onSave}>Save</Button> */}
            <Button type="primary" className="btn_114 margin__right__button" loading={this.state.loading} onClick={this.onSave}>Save</Button>
          </div>
              
        <ToastContainer
          closeButton={<CloseButton />}
          hideProgressBar
          position="bottom-left"
        />
      </Card>
</div>
    );
  }
}

const mapStateToProps = state => {
  return {
  projects: state.skills.projects,
  channelDefault : state.skills
}};     

export default withRouter(connect(mapStateToProps, {getGitHubUserConfig, getProject,personalSetting,getJiraUserNotifConfig,setUserJiraNotifConfig,getGitHubChannelConfig, setGitHubChannelConfig ,setGitHubUserChannelConfig })(GithubPersonalNotification));