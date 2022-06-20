import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  getProject,
  personalSetting,
  getJiraUserNotifConfig,
  setUserJiraNotifConfig,
} from "../skills_action";
import { ToastContainer } from "react-toastify";
import { Button, Switch, message, Tooltip } from "antd";
import { Typography, Select, Card } from "antd";
import { QuestionCircleOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;
const { Option } = Select;

let ChannelFrequency = [
  {
    name: "Real Time",
    value: 0,
  },
  {
    name: "1 min",
    value: 1,
  },
  {
    name: "5 min",
    value: 5,
  },
  {
    name: "15 min",
    value: 15,
  },
  {
    name: "30 min",
    value: 30,
  },
  {
    name: "1 hr",
    value: 60,
  },
  {
    name: "2 hrs",
    value: 120,
  },
  {
    name: "4 hrs",
    value: 240,
  },
  {
    name: "6 hrs",
    value: 360,
  },
  {
    name: "12 hrs",
    value: 720,
  },
];

var notifEvent = [
  {
    // label: "Updates to issues Watched by me",
    label: "Issues watched by me",
    value: "watched_by",
  },
  {
    // label: "Assigned to me",
    label: "Issues assigned to me",
    value: "assignee_self",
  },
  {
    label: "@mentions",
    value: "mentioned_self",
  },
  {
    label : "Issues reported by me",
    value : "reported_by"
  }
];

const CloseButton = ({ closeToast }) => (
  <span className="close-toaster-text" onClick={closeToast}>
    DISMISS
  </span>
);

class JiraPersonalNotification extends Component {
  defaultState = {
    loading: false,
    notifStatus: false,
    projectNotif: [],
    notifEvent: [],
    self_actions:false,
    notifFrequency: "",
    personalChannelId: "",
    error: {},
    selectedProjectName: "",
    enableUserNotif: false,
    channelNotifFreq: 1,
    defaultloading: false,
    startThreadSync: false,
    sendAsThreadedMessage: false,
  }

  constructor(props) {
    super(props);
    this.state = {...this.defaultState}
  }

  componentDidMount() {
    this.props.setClick(this.handlePersonalConfigurationdeletion)
    let data = localStorage.trooprUserId;
    this.setState({ loading: true });
    this.props
      .getJiraUserNotifConfig(
        this.props.match.params.wId,
        data,
        this.props.match.params.skill_id
      )
      .then((res) => {
        // console.log("user notif confoig==>",res)
        if (res.data.success) {
          // let type=   res.data.data.event_type.find(item=>item=="watched_by")
          // console.info("res.data.data.event_type: ", res.data.data.event_type);

          this.setState({
            loading: false,
            notifStatus: res.data.data.status,
            notifEvent: res.data.data.event_type,
            channelNotifFreq: res.data.data.frequency,
            event_type: res.data.data.event_type,
            sendAsThreadedMessage: res.data.data.sendAsThreadedMessage,
            startThreadSync: res.data.data.startThreadSync,
            self_actions:res.data.data.self_actions
          });
        } else {
          var UserID = localStorage.trooprUserId;

          // let skillId = this.props.match.params.skill_id;
          // this.props.getMappedUser(skillId, UserID).then(res1 => {

          // if(res1.data.success && res1.data.skillUser && res1.data.skillUser.token_obj && res1.data.skillUser.token_obj.access_token){
          // this.props.getJiraUserNotifConfig(this.props.match.params.wId,UserID,this.props.match.params.skill_id).then(data=>{
          //   if(data.data.data && data.data.data.channel_id){

          //   }else{
          this.props
            .personalSetting(this.props.match.params.wId, UserID)
            .then((data1) => {
              // if(data1.data && data1.data.channel){
              // let data = {
              //   user_id: UserID,
              //   workspace_id: this.props.match.params.wId,
              //   channel_id: data1.data.channel.id,
              //   status: true,
              //    event_type:  ["watched_by", "assignee_self", "mentioned_self"],
              //   // event_type:"important_events",
              //   account_id: this.props.channelDefault.currentSkillUser.user_obj.accountId,
              //   is_bot_channel: true,
              //   frequency: 1,
              //   skill_id: this.props.match.params.skill_id
              // };
              // this.props.setUserJiraNotifConfig(this.props.match.params.wId,this.props.match.params.skill_id,data)
              this.setState({
                loading: false,
                notifStatus: true,
                notifEvent: ["mentioned_self",'assignee_self',"reported_by"],
                event_type: ["mentioned_self",'assignee_self',"reported_by"],
                self_actions:false

                // });
                // }
              });
            });

          //   }
          // })
          //   }
          //   console.log("user es-->",res1.data.skillUser.token_obj.access_token);
          // // })
        }
        // console.log("data at frontend===>",data);
      });
  }

  handlePersonalConfigurationdeletion = () => {
    // this.setState({...this.defaultState})

    this.setState({
      notifStatus:true,
      event_type: ["mentioned_self",'assignee_self'],
      notifEvent: ["mentioned_self",'assignee_self'],
      sendAsThreadedMessage:false,
      sendAsThreadedMessage:false,
      channelNotifFreq:1,
      startThreadSync:false,
      loading:false,
      self_actions:false
    })
  }

  toggleNotif = () => {
    this.setState({ notifStatus: !this.state.notifStatus });
  };

  onChangeProject = (e) => {
    const index = e.nativeEvent.target.selectedIndex;
    const text = e.nativeEvent.target[index].text;
    this.setState({
      [e.target.name]: e.target.value,
      selectedProjectName: text,
    });
  };

  onChangeEvent = (e) => {
    //  console.log("e===",e)
    if (this.state.notifEvent) {
      let arr = this.state.notifEvent;
      let index = arr.findIndex((item) => item === e.target.value);
      if (index > -1) {
        arr.splice(index, 1);
      } else {
        arr.push(e.target.value);
      }
      this.setState({ [e.target.name]: arr }, () => {
        //  console.log("======<>events",this.state.notifEvent,"toggle button",this.state.enableUserNotif) ;
      });
    }
  };

  onChangeFrequency = (event, value) => {
    this.setState(
      {
        channelNotifFreq: event,
      },
      () => {
        // console.log("channel ferequency==?>",this.state.channelNotifFreq)
      }
    );
    if (event !== 0) {
      this.setState({
        startThreadSync: false,
      });
    }
  };

  threadedMessagesChangeHandler = (e) => {
    let newStatus = e === "true";
    this.setState({
      sendAsThreadedMessage: newStatus,
    });
  };

  threadSyncStatusChangeHandler = (e) => {
    let newStatus = e === "true";
    this.setState({
      startThreadSync: newStatus,
    });
  };

  event = (val) => {
    let eventsTypes = [];
    // if(val=="most_events"){
    //   eventsTypes=["watched_by","assignee_self", "mentioned_self"]
    // }else{
    //   eventsTypes= ["assignee_self","mentioned_self"]
    //   }

    this.setState({ event_type: val, notifEvent: val });
  };

  toggleSelfEvent=()=>{
 this.setState({self_actions:!this.state.self_actions},()=>{

this.onSave()

 })
  }
  onSave = () => {
    // console.log("entered onSave function",this.props);

    // if(this.state.notifStatus){
    // console.log("bnotif event==>",this.state.notifevent);
    this.setState({ defaultloading: true });

    let data = {
      user_id: localStorage.trooprUserId,
      workspace_id: this.props.match.params.wId,
      channel_id: this.props.channelDefault.personalSetting.id,
      status: this.state.notifStatus,
      event_type: this.state.notifEvent,
      self_actions:this.state.self_actions,

      account_id: this.props.channelDefault.currentSkillUser.user_obj.accountId,
      is_bot_channel: true,
      frequency: this.state.channelNotifFreq,
      skill_id: this.props.match.params.skill_id,
      sendAsThreadedMessage: this.state.sendAsThreadedMessage,
      startThreadSync: this.state.startThreadSync,
    };


    
    let events = this.state.notifEvent;
    
    if (events.length > 0) {
      this.props
        .setUserJiraNotifConfig(
          this.props.match.params.wId,
          this.props.match.params.skill_id,
          data
        )
        .then((data) => {
          // console.log("data at frontend===>",data);
        });
      // }
      // customToast.success("Saved successfully", {
      // 	className:
      // 	  "some-toast-box d-flex justify-content-between align-items-center"
      //   });
      this.setState({ defaultloading: false });
      message.success("Saved successfully");
    } else {
      if (this.state.notifStatus) {
        // customToast.issueSelection("Please select the issue", {
        // 	className:
        // 	  "some-toast-box d-flex justify-content-between align-items-center"
        //   });
        this.setState({ defaultloading: false });
        message.error("Please select the Event");
      } else {
        this.props
          .setUserJiraNotifConfig(
            this.props.match.params.wId,
            this.props.match.params.skill_id,
            data
          )
          .then((data) => {
            // console.log("data at frontend===>",data);
          });
        // customToast.success("Saved successfully", {
        // 	className:
        // 	  "some-toast-box d-flex justify-content-between align-items-center"
        //   });
        this.setState({ defaultloading: false });
        message.success("Saved successfully");
      }
    }
    
  };

  toggleOn = () => {
    this.setState({
      enableUserNotif: false,
    });
  };

  toggleOff = () => {
    this.setState({
      enableUserNotif: true,
    });
  };

  render() {
    const tooltipIcon = <QuestionCircleOutlined style={{marginLeft : 5}}/>
    return (
      <div>
        <Card
          size="small"
          id="personal-notifications"
          title="Personal Notifications"
          loading={this.state.loading}
          extra={
            <Switch
              checked={this.state.notifStatus}
              onClick={this.toggleNotif}
            />
          }
        >
          <Paragraph type="secondary">
            The notification will be delivered privately in "Troopr Assistant"
            channel.
          </Paragraph>

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
          {this.state.error.projectNotif && (
            <div className="error_message">{this.state.error.projectNotif}</div>
          )}
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

          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ marginRight: 10 }}>
              <div className="Jira_preference_personal_default_type">
                {" "}
                <Text type="secondary" strong>
                  {" "}
                  Select Event Type(s)
                </Text>{" "}
              </div>
              
              <Select
                disabled={!this.state.notifStatus}
                name="projectNotif"
                style={{ width: 200, marginBottom: 8 }}
                value={this.state.event_type}
                placeholder="Select Event"
                onChange={this.event}
                mode="multiple"
              >
                {notifEvent.map((event) => (
                  <Option key={0} value={event.value}>
                    {event.label}
                  </Option>
                ))}
              </Select>
            </div>
            <div>
              <div className="">
                {/* <Text type="secondary">Frequency</Text> */}
                <Text type="secondary" strong>
                  Display Format
                  <Tooltip title="Compact format shows limited information in the main message. Both formats show additional details in thread">
                    {tooltipIcon}
                  </Tooltip>
                </Text>
              </div>
              <div className="d-flex align-items-center justify-content-between proj-setting-common-pointer">
                <Select
                  style={{ width: 200, marginBottom: 16 }}
                  placeholder="Please select"
                  // defaultValue={this.state.sendAsThreadedMessage.toString()}
                  value={this.state.sendAsThreadedMessage.toString()}
                  onChange={this.threadedMessagesChangeHandler}
                >
                  <Option key="true">Compact</Option>
                  <Option key="false">Standard</Option>
                </Select>
              </div>
            </div>
          </div>
          {/* <div
            style={{ marginBottom: "14px" }}
            className="align-items-center justify-content-between proj-setting-common-pointer"
          >
            {notifEvent.map((event, index) => (
              <div className="d-flex align-items-center">
                <Checkbox
                  style={{
                    marginLeft: "12px",
                    fontSize: "16px",
                    marginBottom: "4px"
                  }}
                  disabled={!this.state.notifStatus}
                  checked={this.state.notifEvent.find(
                    item => item === event.value
                  )}
                  name="notifEvent"
                  onChange={this.onChangeEvent}
                  value={event.value}
                >
                  <Text type="secondary" style={{ fontSize: "14px" }}>
                    {event.label}
                  </Text>
                </Checkbox>
              </div>
            ))} 
          
          </div>
          {this.state.error.notifEvent && (
            <div className="error_message">{this.state.error.notifEvent}</div>
          )} */}
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

          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ marginRight: 10 }}>
              <div className="">
                {/* <Text type="secondary">Frequency</Text> */}
                <Text type="secondary" strong>
                  Delivery Frequency
                  <Tooltip  title="You can delay notification delivery. All notifications in the selected time interval will be grouped. Choose realtime to deliver without delay.">
                      {tooltipIcon}
                  </Tooltip>
                </Text>
              </div>
              <div className="d-flex align-items-center justify-content-between proj-setting-common-pointer">
                <Select
                  disabled={!this.state.notifStatus}
                  name="projectNotif"
                  style={{ width: 200, marginBottom: 16 }}
                  value={this.state.channelNotifFreq}
                  placeholder="Select Frequency"
                  onChange={this.onChangeFrequency}
                >
                  {ChannelFrequency.map((project, index) => (
                    <Option key={project.value} value={project.value}>
                      {project.name}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
            <div>
              <div className="">
                {/* <Text type="secondary">Frequency</Text> */}
                <Text type="secondary" strong>
                  Start Thread Sync
                  <Tooltip title="Start or enable notification message thread to continuously sync with the corresponding Jira issue.">
                    {tooltipIcon}
                  </Tooltip>
                </Text>
              </div>
              <div className="d-flex align-items-center justify-content-between proj-setting-common-pointer">
                <Select
                  disabled={this.state.channelNotifFreq !== 0}
                  style={{ width: 200, marginBottom: 16 }}
                  placeholder="Please select"
                  value={this.state.startThreadSync.toString()}
                  onChange={this.threadSyncStatusChangeHandler}
                >
                  <Option key="true">Yes</Option>
                  <Option key="false">No</Option>
                </Select>
              </div>
            </div>
          </div>

          {/*------------------------------Buttons------------------------------*/}
          {/*{this.state.notifStatus ?
                   <div className="d-flex">
                     <div className="secondary_btn btn_114 margin__right__button" onClick={this.onCancel}>Cancel</div>
                     <div className="btn_114 margin__right__button" onClick={this.onSave}>Save</div></div>
                     : ""
                }*/}
          <div>
            {/* <Button type="primary" ghost className="btn_114 margin__right__button" onClick={this.onSave}>Save</Button> */}
            <Button
              // type="primary"
              // className="btn_114 margin__right__button"
              loading={this.state.defaultloading}
              onClick={this.onSave}
            >
              Save
            </Button>
          </div>
          <ToastContainer
            closeButton={<CloseButton />}
            hideProgressBar
            position="bottom-left"
          />

<div>

<br/>
            <Text type='secondary' style={{display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",}}>
                          <b style={{color:"rgba(0, 0, 0, 0.65)"}}>{`Alerts for my action`}</b>
                          <Switch 
                            disabled={!this.state.notifStatus}
                            checked={this.state.self_actions} 
                            onChange={() => this.toggleSelfEvent()}
                          />
                        </Text>

                        <Text type='secondary'>
                        {`Allow Troopr to send personal notifications for actions taken by self`}
                        <br/>
                        {/* Troopr will still be able to unfurl other issue mentions. */}
                        </Text>
                        </div>
        
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    projects: state.skills.projects,
    channelDefault: state.skills,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    getProject,
    personalSetting,
    getJiraUserNotifConfig,
    setUserJiraNotifConfig,
  })(JiraPersonalNotification)
);
