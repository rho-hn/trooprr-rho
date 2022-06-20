import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { ArrowRightOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import "./channel_notification.css";
import {
  getProject,
  getDefaultChannel,
  setJiraNotifConfig,
  getJiraNotifConfig,
  getAllJiraConfigs,
  deleteJiraConfig, getJiraProjectStatues,
  searchJiraProjects,
  dropDownSearchJiraProjects
} from "../skills_action";
import { Checkbox, Button, Select, Input, message,Alert,Row,Col,Spin, Tooltip, Collapse } from "antd";
import { Typography} from "antd";
import queryString from "query-string";

const { Text } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

var notifEvent = [
  {
    label: "An issue is created",
    value: "issue_created"
  },
  {
    label: "A comment is added",
    value: "comment_added"
  },
  {
    label: "Assignee is changed",
    value: "assignee_changed"
  },
 
  {
    label: "Priority is updated",
    value: "priority_updated"
  },
  {
    label: "An issue is edited",
    value: "issue_edited"
  },
  {
    label: "Sprint started/closed [Need Jira Token]",
    value: "sprint_started"
  },
  {     
    label: "An issue is transitioned",
    value: "issue_transitioned"
  }
];

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

class JiraChannelNotification extends Component {
  constructor(props) {
    super(props);
    this.timeout=0
    this.state = {
      showChannelNotification: false,
      notifStatus: false,
      selectedChannel: this.props.channel_id,
      projectNotif: [],
      notifEvent: [],
      notifFrequency: "",
      edit: false,
      jqlstatus: false,
      jql: "",
      showAddInputs: false,
      addInputs: [],
      error: {},
      selectedChannelName: "",
      selectedProjectName: [],
      // channelNotifFreq:["1 min","2 min"],
      channelNotifFreq: 1,
      projectId: [],
      loading:false,
      showloader:true,
      selectedEvents: [],
      sendAsThreadedMessage: false,
      startThreadSync: false,
      isSubscriptionSaveButtonDisabled: false,
   
    };
  }

  componentDidMount() {
    // console.log("====componnetdidmount",this.props.projectId);

    this.setState({parsedQueryString : queryString.parse(window.location.search)})

    let projId;
    if (this.props.projectId) {
      projId = this.props.projectId;
    } else {
      projId = "" ;
    }

    if(projId){
      this.props
      .getJiraNotifConfig(
        this.props.match.params.wId,
        this.props.channelId,
        this.props.match.params.skill_id,
        projId,
        this.props.isGridSharedChannel
      )
      .then(res => {
        // console.log("====componnetdi",res);
        if (res.data.success) {
          let showAddInputs=(res.data&&res.data.data&&res.data.data.project_id&&res.data.data.event_type.includes("issue_transitioned"))?true:false        
          this.setState({
            notifStatus: res.data.data.status,
            projectNotif: res.data.data.project_id,
            jql: res.data.data.jqlQuery,
            notifEvent: res.data.data.event_type,
            notifFrequency: res.data.data.frequency,
            selectedProjectName: res.data.data.project_name,
            channelNotifFreq: res.data.data.frequency,
            addInputs:res.data.data.jiratransitions||[],
            showAddInputs,
            showloader:false,
            sendAsThreadedMessage: res.data.data.sendAsThreadedMessage,
            startThreadSync: res.data.data.startThreadSync,
          });
          if(showAddInputs){     
            let project_id=typeof(res.data.data.project_id)=="string"?res.data.data.project_id:res.data.data.project_id[0]
            this.props.getJiraProjectStatues(this.props.match.params.skill_id,project_id)
          }
        }
      });
    }else{
      this.setState({
        notifStatus: true,
        projectNotif: [],
        jql: "",
        notifEvent: ["issue_created","comment_added","assignee_changed","issue_transitioned", "priority_updated","issue_edited","sprint_started"],
        notifFrequency: "",
        selectedProjectName: [],
        channelNotifFreq:1, 
        showloader:false
      });
    }
    
  }

  onSearch = (val) => {
    const {  channel_type } = queryString.parse(window.location.search)
    if (this.props.currentSkill && this.props.currentSkill.metadata && (this.props.currentSkill.metadata.server_type === "jira_cloud_oauth" || this.props.currentSkill.metadata.server_type === "jira_cloud")) {
      let query = `query=${val || ""}`
      const queryType = channel_type === "agent" ? "&typeKey=service_desk" : "&typeKey=software"
      query=query + queryType
      if (channel_type === "project" || channel_type === "agent") {
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.props.dropDownSearchJiraProjects(this.props.match.params.wId, `?query=${query}`)
        }, 300);
        
}
   
  }
    //  this.props
   }

  showChannelNotification = () => {
    this.setState({
      showChannelNotification: !this.state.showChannelNotification
    });
  };

  toggleOffNotif = () => {
    this.setState({ notifStatus: !this.state.notifStatus }) ;
  };

  toggleNotif = () => {
    this.setState({ notifStatus: !this.state.notifStatus }) ;
  };

  toggleJql = () => {
    this.setState({ jqlstatus: !this.state.jqlstatus });
  };

  onChangeJql = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onChangeProject = (event, value) => {    
    this.setState({
      projectNotif: event,
      selectedProjectName: value.props.children,
    });
  };

  //frequency
  onChangeFrequency = (event, value) => {
   
    
    this.setState(
      {
        channelNotifFreq: event,
       
      }
    );
    if(value!=0){
      this.setState(
        {
          startThreadSync: false,
         
        }
      );
    }
    

    //Get the text of the input
    // const index = e.nativeEvent.target.selectedIndex;
    // const text = e.nativeEvent.target[index].text;
  };

  //On setting Events
  onChangeEvent = e => {
    
    if (this.state.notifEvent) {
      let arr = this.state.notifEvent;
      let index = arr.findIndex(item => item === e.target.value);
      if (index > -1) {
        arr.splice(index, 1);
      } else {
        arr.push(e.target.value);
      }
      let showAddInputs=(this.state.projectNotif&&this.state.projectNotif.length>0&&arr.includes("issue_transitioned"))?true:false
      this.setState({ [e.target.name]: arr,showAddInputs });
    }
  };

  onEventChange = (event, value) => {
    let showAddInputs=false;
    // (this.state.projectNotif&&this.state.projectNotif.length>0&&!value.includes("issue_transitioned"))?true:false
    if (
      event && 
      event.length > 0 && 
      event.includes('issue_transitioned')
    ) {
      showAddInputs = true
    }
    this.setState({ showAddInputs, selectedEvents: event });
  }

  getDefaultEvents = () => {
    // Compare all notif events with the ones in state
    let temp = notifEvent.filter(event => this.state.notifEvent.includes(event.value) && event)
    return temp.filter(event => event);
  }

  //On Changing Frequency
  //  onChangeFrequency = (e) => {
  //  	 this.setState({[e.target.name]: e.target.value});
  //  }

  openEditState = () => {
    this.setState({ edit: !this.state.edit });
  };

  onSave = () => { 
    this.setState({
      isSubscriptionSaveButtonDisabled: true
    })
    try {
    let inputs=this.state.addInputs
    if(inputs&&inputs.length>0){
let lastInput=inputs[inputs.length-1]
if(!(lastInput&&lastInput.from&&lastInput.to)){
 inputs.pop()
}}
 if(this.props.configureId){
   let findProject=this.props.jiraChannelConfigs.find(config=>config.project_id[0]==this.state.projectNotif)
   if(findProject&&findProject._id!==this.props.configureId){
     throw ("project_already_configured")
   }
 }   
 let selectedEvents = this.state.selectedEvents;
 if (!selectedEvents.length) {
   selectedEvents = this.state.notifEvent
 }

 this.setState({loading:true})
      let data = {
        channel_id: this.props.channelId,
        project_id: this.state.projectNotif,
        project_name: this.state.selectedProjectName,
        channelName: this.props.channel_name,
        event_type: selectedEvents,
        status: true,
        jqlQuery: this.state.jql,
        frequency: this.state.channelNotifFreq,
        is_bot_channel: false,
        skill_id: this.props.match.params.skill_id,
        jiratransitions:inputs,
        configureId:this.props.configureId,
        sendAsThreadedMessage: this.state.sendAsThreadedMessage,
        startThreadSync: this.state.startThreadSync
      };
      data.created_by = localStorage.trooprUserId;
      data.workspace_id = this.props.match.params.wId;
      data.channel_type = this.state.parsedQueryString.channel_type
	  // console.log("---data",data)
      if (data.channel_id && data.status && localStorage.trooprUserId) {
        this.setState({});
        this.props
          .setJiraNotifConfig(
            this.props.match.params.wId,
            this.props.match.params.skill_id,
            data,
            this.props.isGridSharedChannel
          )
          .then(res => {
            //   console.log("res========??????",res);
            if (res.data.success) {
              this.props
              .getAllJiraConfigs(
                this.props.match.params.wId,
                this.props.match.params.skill_id,
                data.channel_id,
                this.props.isGridSharedChannel
              )
              this.setState({
                jql: res.data.data.jqlQuery,
                selectedProjectName: res.data.data.project_name,
                projectNotif: res.data.data.project_id,
                notifEvent: res.data.data.event_type,
                frequency: res.data.data.frequency,
                notifStatus: res.data.data.status,
                edit: false,
                error: {}
              });
              this.setState({
                loading:false,
                isSubscriptionSaveButtonDisabled: false
              })
              this.props.closeModal();
              message.success("Saved successfully");
            } else if (
              res.data.message === "JQL not valid" ||
              res.data.message ===
                "Error updating channel notification config: err[object Object]"
            ) {
              // console.log("jql",res.data.message)
              this.setState({
                loading:false,
                isSubscriptionSaveButtonDisabled: false
              })
              message.error("Enter a valid JQL");
            } else if (res.data.message === "Please select project") {
              // console.log("project")
              this.setState({
                loading:false,
                isSubscriptionSaveButtonDisabled: false
              })
              message.error("Please select project");
            } else if (res.data.message === "No event selected") {
              // console.log("event")
              this.setState({
                loading:false,
                isSubscriptionSaveButtonDisabled: false
              })
              message.error("Please select event");
            } else {
              message.error(res.data.message,5)
              this.setState({
                loading:false,
                isSubscriptionSaveButtonDisabled: false
              })
            }
          });
      }
    } catch (error) {
      this.setState({
        isSubscriptionSaveButtonDisabled: false
      })
    //  console.log(error);
      if(error=="project_already_configured"){
        message.error(`${this.state.selectedProjectName} Project already subscribed for notifications.To edit click on Events from ${this.state.selectedProjectName}.`)
      }
      console.error(error)
    }
  };

  handleChange = (event, value) => {
  //  console.log("value",value.children)
  let showAddInputs=(event&&event.length>0&&this.state.notifEvent.includes("issue_transitioned"))?true:false    
  this.setState({
      projectNotif: event,
      selectedProjectName: value.children,
      showAddInputs,
      addInputs:[]
    });
    this.props.getJiraProjectStatues(this.props.match.params.skill_id,event)
  };

  threadedMessagesChangeHandler = (e) => {
    
    let newStatus = (e === "true");
    this.setState({
        sendAsThreadedMessage: newStatus
    })
  }
  

  threadSyncStatusChangeHandler = (e) => {
    let newStatus = (e === "true");
    
   
    this.setState({
        startThreadSync: newStatus
    })
  }

  onDelete = () =>{
    
    const channelId = this.props.channelId;
    let data = {
      id: this.props.projectId,
      project_name: this.props.projectName,
      channelName: this.props.channel_name
    
     
    };
    this.props
      .deleteJiraConfig(
        this.props.match.params.wId,
        this.props.match.params.skill_id,
        channelId,
        data,
        this.props.isGridSharedChannel
      )
      .then(data => {
        this.props.closeModal();
        message.success("Deleted successfully")
      });

  }
onChangeInput=(value,index,type)=>{
// console.log(value,index,type);

let addedInputs=this.state.addInputs
let changedInput=addedInputs[index]
if(changedInput){
changedInput[type]=value;
changedInput.index=index
addedInputs[index]=changedInput

}
else{
  addedInputs.push({[type]:value,index})
}
this.setState({addInputs:addedInputs})
}
  addInputs = () => {
  let addedInputs=this.state.addInputs;
  let lastInput=addedInputs[addedInputs.length-1]
  if(lastInput&&lastInput.from&&lastInput.to){
    addedInputs.push({index:""})
   this.setState({addInputs:addedInputs})
  }
  else{
    message.error("Please select both 'From' and 'To' columns");
  }
  };
deleteInputs(id){
let filterInputs=this.state.addInputs.filter(input=>input.index!==id)
// console.log(id,filterInputs);

this.setState({addInputs:filterInputs})
}
isDisabled=()=>{
  if(this.state.channelNotifFreq !== 0 ){
    this.setState({startThreadSync:false})
   

  }
}

  render() {  
    
   const {  channel_type } = queryString.parse(window.location.search)
   let addedInputs=(this.state.addInputs&&this.state.addInputs.length>0)?this.state.addInputs:[{from:undefined,id:"",to:undefined}]  
    // const inputChildren= addedInputs.map((val, indx) => {
     
      
    //   return (
    //     <div className="proj-setting-common-pointer">
    //       <Row type="flex" justify="space-around" align="middle">
    //         <Col span={10}>
    //           <Select 
    //             style={{ width: 280, marginBottom: "10px", marginRight: "5px" }}
    //             placeholder="Select Transition"
    //             value={val.from}
    //             onChange={(e)=>{this.onChangeInput(e,indx,"from")}}
    //           >
    //             <Option value="any">Any</Option>
    //              {this.props.statuses.map(status=>{
    //             return <Option value={status.id}>{status.name}</Option>
    //           })}
    //           </Select>
    //         </Col>
    //         <Col span={2}>
    //           <div style={{ marginTop: "-10px", marginLeft: "24px" }}>
    //             {/* <i className="material-icons">arrow_right_alt</i> */}
    //             <ArrowRightOutlined />
    //           </div>
    //         </Col>
    //         <Col span={10}>
    //           <Select
    //             style={{ width: 280, marginBottom: "10px", marginLeft: "5px" }}
    //             value={val.to}
    //             placeholder="Select Transition"
    //             onChange={(e)=>{this.onChangeInput(e,indx,"to")}}
    //           >
    //          {this.props.statuses.map(status=>{
    //             return <Option value={status.id}>{status.name}</Option>
    //           })}
    //           </Select>
    //         </Col>
    //         <Col span={2}>
    //           {(val.from&&val.to) && (
    //             <div
    //               style={{
    //                 marginTop: "-9px",
    //                 cursor: "pointer",
    //                 marginLeft: "10px"
    //               }}
    //               onClick={()=>this.deleteInputs(val.index)}
    //             >
    //               <DeleteOutlined style={{ marginLeft:"10px",fontSize: "22px", color: "red" }} />
    //             </div>
    //           )}
    //         </Col>
    //       </Row>
    //     </div>
    //   );
    // });

    const inputChildren = addedInputs.map((val, indx) => {
      return (
        <div className="proj-setting-common-pointer">
          <Row style={{ marginBottom: 8, backgroundColor: "#eee", padding: 4 }}>
            <Col span={12} style={{ padding: 2 }}>
              <Text style={{ padding: 2 }}>From Status</Text>
              <Select
                style={{ width: 280, marginBottom: "10px", marginRight: "5px" }}
                placeholder="Select Transition"
                value={val.from}
                onChange={(e) => {
                  this.onChangeInput(e, indx, "from");
                }}
              >
                <Option value="any">Any</Option>
                {this.props.statuses.map((status) => {
                  return <Option value={status.id}>{status.name}</Option>;
                })}
              </Select>

              {val.from && val.to && (
                <Button
                  size="small"
                  type="text"
                  danger
                  onClick={() => this.deleteInputs(val.index)}
                >
                  Delete
                </Button>
              )}
            </Col>
            <Col span={12} style={{ padding: 2 }}>
              <Text style={{ padding: 2 }}>To Status</Text>
              <Select
                style={{ width: 280, marginBottom: "10px", marginLeft: "5px" }}
                value={val.to}
                placeholder="Select Transition"
                onChange={(e) => {
                  this.onChangeInput(e, indx, "to");
                }}
              >
                {this.props.statuses.map((status) => {
                  return <Option value={status.id}>{status.name}</Option>;
                })}
              </Select>
            </Col>
          </Row>
        </div>
      );
    })

    let currentConfiguredProjects = this.props.jiraChannelConfigs 
    && this.props.jiraChannelConfigs.map(config => {
      return config.project_id && config.project_id[0]
    })
    currentConfiguredProjects = currentConfiguredProjects.filter(project_id => project_id);
    // Don't show already configured projects
    let children = (channel_type === 'agent' ? this.props.projects.filter(proj => proj.projectTypeKey === 'service_desk') : this.props.projects.filter(proj => proj.projectTypeKey === 'software')).map(d => {
      if (currentConfiguredProjects.includes(d.id)) {
        return false
      }
      return <Option key={d.key} value={d.id} name={d.name}>{d.name+` (${d.key})`}</Option>
    });
    children = children.filter(child => child);
    let textStatus = this.state.notifStatus ? "Enabled" : "Disabled";
    let buttonStatus = this.state.notifStatus ? "Disable" : "Enable";
    let notificationTitle = `Notification Subscription(${textStatus})`;
    const toolTipEmoji = (
      <QuestionCircleOutlined />
    )
    return (
      <Fragment>
        {this.state.showloader ? (
          <div style={{ textAlign: "center", borderRadius: "4px" }}>
            <Spin />
          </div>
        ) : (
          <div>
            <div className="d-flex justify-content-between">
              <div
                className={
                  localStorage.getItem("theme") == "default"
                    ? "Jira_preference_tag_second_issue"
                    : "Jira_preference_tag_second_issue_dark"
                }
                style={{ marginBottom: "10px" }}
              >
                Customize how you want to receive notifications
              </div>
            </div>
            {this.state.showChannelNotification && (
              <div className="divider"></div>
            )}
            <div>
              <div></div>
              <div>
                <div className="">
                  <Text type="secondary">Notification Delivery</Text>
                </div>

                {/* <div
                  className="d-flex align-items-center justify-content-between proj-setting-common-pointer"
                  style={{ marginBottom: "18px" }}
                >
                  <Select
                    // disabled={!this.state.notifStatus}
                    name="projectNotif"
                    style={{ width: "100%" }}
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
                </div> */}
                {/* <div className="" style={{ marginBottom: "18px" }}>
                  <Text type="secondary">Project</Text>
                  <div className="d-flex align-items-center justify-content-between proj-setting-common-pointer">
                    <Select
                      autoClearSearchValue
                      //   disabled={!this.state.notifStatus}
                      // mode="multiple"
                      style={{ width: "100%" }}
                      value={this.state.selectedProjectName}
                      onChange={this.handleChange}
                      placeholder="Select project"
                      // tokenSeparators={[","]}
                      showSearch
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {children}
                    </Select>
                  </div>
                </div> */}
              </div>

              {/*------------------------------Frequency------------------------------*/}
              <div style={{ marginBottom: "18px" }}>
                <Row
                  justify="space-around"
                  style={{
                    marginBottom: 16,
                    paddingTop: 8,
                    paddingBottom: 12,
                    backgroundColor: localStorage.getItem("theme")=="default"?"#eee":"",
                  }}
                >
                  <Col 
                  span={7}>
                    <div>
                      <Text strong>Delivery Frequency </Text>
                      <Tooltip title="You can delay notification delivery. All notifications in the selected time interval will be grouped. Choose realtime to deliver without delay.">
                        {toolTipEmoji}
                      </Tooltip>
                    </div>

                    <Select
                      // disabled={!this.state.notifStatus}
                      name="projectNotif"
                      style={{ width: "100%" }}
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
                  </Col>
                  <Col span={7}>
                    <Text strong>Display format </Text>
                    <Tooltip title="Compact format shows limited information in the main message. Both formats show additional details in thread">
                      {toolTipEmoji}
                    </Tooltip>
                    
                    <Select
                      style={{ width: "100%" }}
                      placeholder="Please select"
                      defaultValue={this.state.sendAsThreadedMessage.toString()}
                      onChange={this.threadedMessagesChangeHandler}
                    >
                      <Option key="true">Compact</Option>
                      <Option key="false">Standard</Option>
                    </Select>
                  </Col>
                  <Col span={7}>
                      <Text strong>Start Thread Sync </Text>
                      <Tooltip title="Start or enable notification message thread to continuously sync with the corresponding Jira issue.">
                        {toolTipEmoji}
                      </Tooltip>
                      <Select
                        disabled={ this.state.channelNotifFreq !== 0 }
                        style={{ width: "100%" }}
                        placeholder="Please select"
                        defaultValue={this.state.startThreadSync.toString() }
                        onChange={this.threadSyncStatusChangeHandler}
                        value = {this.state.startThreadSync?"true":"false"}
                      >
                        <Option key="true">Yes</Option>
                        <Option key="false">No</Option>
                      </Select>
                  </Col>
                </Row>
              </div>

              {/*------------------------------Project-----------------------------------*/}

              <div style={{ marginBottom: "18px" }}>
                <Text strong>From Project</Text>
                <Select
                  autoClearSearchValue
                  //   disabled={!this.state.notifStatus}
                  // mode="multiple"
                  style={{ width: "100%" }}
                  value={this.state.selectedProjectName}
                  onChange={this.handleChange}
                  placeholder="Select project"
                  // tokenSeparators={[","]}
                    onSearch={this.onSearch}
                  showSearch
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {children}
                </Select>
              </div>

              {/*------------------------------JQL-----------------------------------*/}
              <div
                className="bottom_space_forms"
                style={{ marginBottom: "18px" }}
              >
                <Text strong>JQL Filter (optional)</Text>
                <Text type="secondary"> project="PRJ"</Text>
                <Input
                  //   disabled={!this.state.notifStatus}
                  autoComplete="off"
                  style={{ width: "100%", fontSize: "14px" }}
                  className={"form-control ts_custom_input"}
                  name="jql"
                  placeholder="Enter JQL"
                  onChange={this.onChangeJql}
                  value={this.state.jql}
                />
              </div>
              {/* <div
                className="bottom_space_forms"
                style={{ marginBottom: "18px" }}
              >
                <div className="">
                  <Text type="secondary">JQL filter (optional)</Text>
                </div>
                <Input
                  //   disabled={!this.state.notifStatus}
                  autoComplete="off"
                  style={{ width: "100%", fontSize: "14px" }}
                  className={"form-control ts_custom_input"}
                  name="jql"
                  placeholder="Enter JQL"
                  onChange={this.onChangeJql}
                  value={this.state.jql}
                />
              </div> */}

              {/*------------------------------Event Type------------------------------*/}
              <div
                className={
                  (this.state.notifStatus ? "" : "Preference_disable_state",
                  "bottom_space_forms")
                }
              >
                <Text strong>Send these events</Text>
                <Select
                  mode="multiple"
                  style={{ width: "100%", marginBottom: 16 }}
                  placeholder="Please select"
                  defaultValue={
                    this.state.notifEvent && this.getDefaultEvents().map(event => event.value)
                  }
                  maxTagCount="responsive"
                  onChange={this.onEventChange}
                >
                  {notifEvent &&
                    notifEvent.map((event, index) => {
                      return (
                        <Option key={event.value} value={event.value}>
                          {event.label}
                        </Option>
                      );
                    })}
                </Select>
              </div>

              {/* <div
                className={
                  (this.state.notifStatus ? "" : "Preference_disable_state",
                  "bottom_space_forms")
                }
              >
                <div className="">
                  <Text type="secondary">Event type</Text>
                </div>
                <div
                  style={{ marginBottom: "14px", marginLeft: "-12px" }}
                  className="align-items-center justify-content-between proj-setting-common-pointer"
                >
                  {notifEvent &&
                    notifEvent.map((event, index) => (
                      <div className="d-flex align-items-center">
                        <Checkbox
                          style={{
                            marginLeft: "12px",
                            fontSize: "16px",
                            marginBottom: "4px",
                          }}
                          //   disabled={!this.state.notifStatus}
                          checked={this.state.notifEvent.find(
                            (item) => item === event.value
                          )}
                          name="notifEvent"
                          onChange={this.onChangeEvent}
                          value={event.value}
                        >
                          <Text type="secondary">{event.label}</Text>
                        </Checkbox>
                      </div>
                    ))}
                </div>
              </div> */}

              {/*------------------------------Transition Filters------------------------------*/}

              {this.state.showAddInputs && (
                <div>
                  <Collapse
                  // defaultActiveKey={["1"]}
                  >
                    <Panel header="Transition Filters" key="1">
                      <Alert
                        message="You may want notifications only when issue moves to 'Ready to QA' status, then select 'Any' to 'Ready to QA'. If no transition filters are selected, notification will be sent for every status change"
                        type="info"
                      />

                      <br />
                      {inputChildren}
                      <Button type="default" onClick={this.addInputs}>
                        Add Transition Filter
                      </Button>
                    </Panel>
                  </Collapse>
                </div>
              )}

              {/* {this.state.showAddInputs && (
                <div>
                  <Alert
                    message="Specify which status change will trigger notification. For example, you may want notifications only when card moves to 'Ready to QA', then select 'Any' to 'Ready to QA'. If no transitions are selected, notification will be triggered for every status change"
                    type="success"
                  />
                  <br />
                  <Row type="flex" align="middle">
                    <Col span={12}>
                      <Text type="secondary">From Status</Text>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary">To Status</Text>
                    </Col>
                  </Row>
                  {inputChildren}
                  <Button type="default" onClick={this.addInputs}>
                    Add status transition
                  </Button>
                </div>
              )} */}

              <div className="d-flex">
                <Button
                  type="primary"
                  className="btn_114 margin__right__button"
                  loading={this.state.loading}
                  onClick={this.onSave}
                  disabled={this.state.isSubscriptionSaveButtonDisabled}
                >
                  Save
                </Button>
                {this.state.selectedProjectName[0] ? (
                  <Button
                    type="danger"
                    className="btn_114 margin__right__button"
                    onClick={this.onDelete}
                  >
                    Delete
                  </Button>
                ) : (
                  <Button
                    type="ghost"
                    className="btn_114 margin__right__button"
                    onClick={() => this.props.closeModal()}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Fragment>
    );
   
  }
}

const mapStateToProps = state => {
  return {
    projects: state.skills.projects,
    assistant_skills: state.skills,
    statuses:state.skills.statuses,
    jiraChannelConfigs: state.skills.getJiraConfigs,
    currentSkill: state.skills.currentSkill,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    getProject,
    getDefaultChannel,
    setJiraNotifConfig,
    getJiraNotifConfig,
    getAllJiraConfigs,
    deleteJiraConfig,
    getJiraProjectStatues,
    searchJiraProjects,
    dropDownSearchJiraProjects
  })(JiraChannelNotification)
);
