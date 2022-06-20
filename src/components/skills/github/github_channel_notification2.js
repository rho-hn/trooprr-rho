import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  getProject,
  personalSetting,
  getGitHubChannelConfig,
  setGitHubChannelConfig,
  getGitHubRepository,
  getAllGitHubChannelConfig
} from "../skills_action";
import {
  enableAndDisable,
  deleteGitHubIssueConfig,
  getRepoLabels,
  getRepoProject,
  getMileStone,
  getOrganistaionProject
} from "../github/gitHubAction";
import { ToastContainer } from "react-toastify";
import { Button, Checkbox, message, Alert } from "antd";
import { Typography, Select} from "antd";
import "../jira/jira.css";

const { Text } = Typography;
const { Option } = Select;

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


var notifEvent = [
  {
    label: "Issue Edited",
    value: "edited"
  },
  {
    label: "Issue opened",
    value: "opened"
  },
  {
    label: "Issue Closed",
    value: "closed"
  },
  {
    label: "Issue Reopened",
    value: "reopened"
  },
  {
    label: "Issue assigned",
    value: "assigned"
  },
  {
    label: "Issue commented",
    value: "commented"
  },
  {
    label: "Issue comment edited",
    value: "comment_edited"
  },
  {
  	label:"Issue labeled",
  	value:"labeled"
  },
  {
  	label:"Milestone added to Issue",
  	value:"milestoned"
  },

];

const CloseButton = ({ closeToast }) => (
  <span className="close-toaster-text" onClick={closeToast}>
    DISMISS
  </span>
);

class GithubChannelNotification2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notifStatus: false,
      projectNotif: [],
      notifEvent: [],
      notifFrequency: "",
      personalChannelId: "",
      error: {},
      selectedProjectName: "",
      enableUserNotif: false,
      channelNotifFreq: 1,
      repositoryId: [],
      repoName: [],
      addInputs: ["add"],
      labelId: [],
      labelName: [],
      projectId: [],
      projectName: [],
      subscription_data: this.props.subscription_data,
      projectSelected:false,
      mileStoneName:[],
      mileStoneId:[],
      loading:false
    };
  }

  componentDidMount() {
    this.props.getOrganistaionProject(this.props.match.params.wId);

    // console.log("this.props.match.params====>", this.props.issueId);
    // console.log("this.props.match.paramsdddcdc====>", this.props.issueName);
    // this.props.getGitHubRepository(this.props.match.params.wId)
    // const search = window.location.search;
    // const channelId = search.split("=")[2];
    // console.log("componentDidMount===>", search);
    // let data = localStorage.trooprUserId;
    let repoId;
    if (this.props.issueName) {
      repoId = this.props.issueId;
    } else {
      repoId = "";
    }

    if(repoId){
      this.props.getRepoProject(this.props.match.params.wId,repoId);

        this.props.getRepoLabels( this.props.match.params.wId,repoId);
        this.props.getMileStone( this.props.match.params.wId,repoId);
        // getMileStone
    }
   
    
    // console.log("this.props.match.params====>", this.props.issueId);
    // console.log("this.props.match.paramsdddcdc====>", this.props.issueName);
    let s_data = this.props.subscription_data;
    let mileStoneName = [];
    let mileStoneId = [];
    if( s_data && s_data.mileStones){
      s_data.mileStones.forEach(mileStone=>{
        mileStoneName.push(mileStone.title);
        mileStoneId.push(mileStone.id);
      })

    }
    // console.log("s_dataaa==?",s_data)
    if (repoId) {
      this.setState({
        notifStatus: s_data.status,
        notifEvent: s_data.event_type,
        channelNotifFreq: s_data.frequency,
        repoName: s_data.repoName,
        repositoryId: s_data.repository_id,
        labelId: s_data ? s_data.labelId : [],
        labelName: s_data ? s_data.labelName:[],
        projectName:s_data ? s_data.project_name:[],
        projectId:s_data ? s_data.project_id:[],
        projectSelected:true,
        mileStoneName:s_data.mileStones ? mileStoneName : [],
        mileStoneId:s_data.mileStones ? mileStoneId : []
      });
    } else {
      this.setState({
        notifStatus: true,
        notifEvent: [
          "edited",
          "opened",
          "closed",
          "reopened",
          "assigned",
          "commented",
          "comment_edited",
          "labeled",
          "milestoned"

        ],
        repositoryId: [],
        repoName: [],
        labelId: [],
        labelName: [],
        projectId: [],
        projectName: [],
        mileStoneName:[],
        mileStoneId:[]
      });
    }
  }

  toggleNotif = () => {
    this.setState({ notifStatus: !this.state.notifStatus }, () => {
      let data = {
        user_id: localStorage.trooprUserId,
        workspace_id: this.props.match.params.wId,
        channel_id: this.props.channelId,
        status: this.state.notifStatus,
        skill_id: this.props.match.params.skill_id
      };
      this.props
        .enableAndDisable(
          this.props.match.params.wId,
          this.props.match.params.skill_id,
          data
        )
        .then(data => {});
    });
  };

  onChangeProject = e => {
    const index = e.nativeEvent.target.selectedIndex;
    const text = e.nativeEvent.target[index].text;
    this.setState({
      [e.target.name]: e.target.value,
      selectedProjectName: text
    });
  };

  onChangeEvent = e => {
    // console.log("eee==>", e);
    if (this.state.notifEvent) {
      let arr = this.state.notifEvent;
      let index = arr.findIndex(item => item === e.target.value);
      if (index > -1) {
        arr.splice(index, 1);
      } else {
        arr.push(e.target.value);
      }
      this.setState({ [e.target.name]: arr }, () => {
        // console.log("======<>events", this.state.notifEvent);
      });
    }
  };

  onChangeFrequency = (event, value) => {
    this.setState(
      {
        channelNotifFreq: event
      },
      () => {
        // console.log("channel ferequency==?>",this.state.channelNotifFreq)
      }
    );
  };

  onSave = () => {
  
    this.setState({loading:true})
    let data = {
      user_id: localStorage.trooprUserId,
      workspace_id: this.props.match.params.wId,
      channel_id: this.props.channelId,
      channelName: this.props.channel_name,
      status: true,
      event_type: this.state.notifEvent,
      //account_id:this.props.channelDefault.currentSkillUser.user_obj.accountId,
      is_bot_channel: false,
      frequency: this.state.channelNotifFreq,
      skill_id: this.props.match.params.skill_id,
      repository_id: this.state.repositoryId,
      repoName: this.state.repoName,
      labelName:this.state.labelName,
      labelId:this.state.labelId,
      project_name:this.state.projectName,
      project_id:this.state.projectId,
      mileStones:this.state.mileStoneObject
    };
  
    // console.log("data=========>",data)
    // console.log("saving the event withour anything===>",this.state.notifEvent);
    let events = this.state.notifEvent;
    // console.log("events==>",events.length);
    if (events.length > 0) {
      // console.log("eventsds==>");
      if (this.state.repoName.length > 0) {
        // console.log("edfrv");
        this.props
          .setGitHubChannelConfig(
            this.props.match.params.wId,
            this.props.match.params.skill_id,
            data
          )
          .then(data => {
            // console.log("dqsdsdsd=>", data);

            if (data.data.success) {
              // console.log("scueedf===>");
              this.props.getAllGitHubChannelConfig(
                this.props.match.params.wId,
                this.props.match.params.skill_id,
                this.props.channelId
              );
              this.props.closeModal();
              message.success("Saved successfully");
            }

            // console.log("data at frontend===>",data);
          });
      } else {
        this.setState({loading:false})
        message.error("Please select Repository");
      }

      // message.success("Saved successfully");
    } else {
      if (this.state.notifStatus) {
        // customToast.issueSelection("Please select the issue", {
        // 	className:
        // 	  "some-toast-box d-flex justify-content-between align-items-center"
        //   });
        this.setState({loading:false})
        message.error("Please select the Event");
      } else {
        this.props
          .setGitHubChannelConfig(
            this.props.match.params.wId,
            this.props.match.params.skill_id,
            data
          )
          .then(data => {
            // console.log("data at frontend===>",data);
          });
        // customToast.success("Saved successfully", {
        // 	className:
        // 	  "some-toast-box d-flex justify-content-between align-items-center"
        //   });
        this.setState({loading:false})
        message.success("Saved successfully");
      }
    }
  };

  toggleOn = () => {
    this.setState({
      enableUserNotif: false
    });
  };

  toggleOff = () => {
    this.setState({
      enableUserNotif: true
    });
  };

  handleChange = (event, value) => {
    // console.log(`selected ${value} and ${event} and ${name}`);\
    // console.log("event==<", event, "value===>", value);

    this.setState(
      {
        repositoryId: value.key,
        repoName: event,
        projectSelected:true
      },
      () => {
        // console.log("oooooo=====>", this.state.repositoryId);
        this.props.getRepoProject(this.props.match.params.wId,this.state.repositoryId);

        this.props.getRepoLabels( this.props.match.params.wId,this.state.repositoryId);

        this.props.getMileStone(this.props.match.params.wId,this.state.repositoryId,this.props.match.params.skill_id);
      }
    );
  };

  // value={this.state.labelName}
  // onChange={this.handleLabelChange}
   
  handleLabelChange = (event, value) =>{
    // console.log("event--->",event);
    let labelEvent=[];
    let labelId=[];
    event.forEach(label=>{
      labelEvent.push(label)
    })

    value.forEach(label=>{
      labelId.push(label.key)
    })
    this.setState(
      {
        labelId: labelId,
        labelName: labelEvent
      },
      () => {
       

        // this.props.getRepoLabels( this.props.match.params.wId,this.state.repositoryId)
      }
    );
  }

  handleProjectChange = (event, value)=>{
    let projectEvent=[];
    let projectId=[];
    event.forEach(project=>{
      projectEvent.push(project)
    })

    value.forEach(project=>{
      projectId.push(project.key)
    })


    this.setState(
      {
        projectId: projectId,
        projectName: projectEvent
      },
      () => {
       

        // this.props.getRepoLabels( this.props.match.params.wId,this.state.repositoryId)
      }
    );
  }

  handleMileStoneChange = (event,value)=>{
   
    let mileStoneEvent=[];
    let mileStoneId=[];
    event.forEach(project=>{
    })
    let mileStone = [];

    value.forEach(project=>{
      let mileStoneObject = {}

      mileStoneObject.id = project.key
      mileStoneObject.title = project.props.name
      mileStoneEvent.push(project.props.name)
      mileStone.push(mileStoneObject);
      mileStoneId.push(project.key)
    })
    this.setState({
      mileStoneName:mileStoneEvent,
      mileStoneId:mileStoneId,
      mileStoneObject:mileStone
    })
  }

  onSave1 = () => {};

  onSave2 = () => {
    let data = {
      user_id: localStorage.trooprUserId,
      workspace_id: this.props.match.params.wId,
      channel_id: this.props.channelId,
      status: this.state.notifStatus,
      skill_id: this.props.match.params.skill_id
    };
    this.props
      .enableAndDisable(
        this.props.match.params.wId,
        this.props.match.params.skill_id,
        data
      )
      .then(data => {});
  };

  deleteIssueConfig = () => {
    const channelId = this.props.channelId;
    let data = {
      id: this.props.issueId,
      name: this.props.issueName,
      type: "Issue"
    };
    this.props
      .deleteGitHubIssueConfig(
        this.props.match.params.wId,
        this.props.match.params.skill_id,
        channelId,
        data
      )
      .then(data => {
        this.props.closeModal();
        message.success("Deleted successfully");
      });
  };

  cancelModal = () => {
    this.props.closeModal();
  };

  render() {
    const children = []
    this.props.gitHubRepository.forEach(project => {
      children.push(
        <Option
          key={project.id}
          name={project.name}
          value={(project.id, project.name)}
        >
          {project.name}
        </Option>
      );
    });

    const labelChildren = [];
    this.props.repoLabels.forEach(project=>{
      labelChildren.push(
        <Option
          key={project.id}
          name={project.name}
          value={(project.id, project.name)}
        >
          {project.name}
        </Option>
      )
    })

    const projectChildren = [];
let allProjects = this.props.orgProjects.concat(this.props.repoProjects);
// console.log("allProjects==>",this.props.repoProjects);
allProjects.forEach(project=>{
    projectChildren.push(
      <Option
        key={project.id}
        name={project.name}
        value={(project.id, project.name)}
      >
        {project.name}
      </Option>
    )
  })
// console.log("projectChildrenprojectChildren===>",projectChildren)
  const mileStoneChildren = [];

  this.props.repoMileStones.forEach(mileStone=>{
    mileStoneChildren.push( <Option
      key={mileStone.id}
      name={mileStone.title}
      value={(mileStone.id, mileStone.title)}
    >
      {mileStone.title}
    </Option>)
  })

    let textStatus = this.state.notifStatus ? "Enabled" : "Disabled";
  

    return (
      <div>
        {/* <Card
          style={{
            marginBottom: "20px",
            marginLeft: "24px",
            boxShadow: "0 1px 4px 0 rgba(0, 0, 0, 0.08)",
            marginTop: "25px"
          }} */}

        <div>
          <div >
            {/* <div style={{ fontSize: "18px", color: "rgba(0,0,0,.85)" }}>
                {notificationTitle}
              </div> */}
            {/* <Switch 
                                 checked={this.state.notifStatus}
                                 onClick={this.toggleNotif}
                               /> */}
          </div>
          <div>
            <div
              className={
                (this.state.notifStatus ? "" : "Preference_disable_state",
                "bottom_space_forms")
              }
            >
              <div
                className={localStorage.getItem('theme') == "default" ? "Jira_preference_tag_second_issue" :"Jira_preference_tag_second_issue_dark"}
                style={{ marginBottom: "10px" }}
              >
                Customize how you want to receive issues related notifications
                <br />
                {/* <br></br> */}
                {/* <br></br>
                                    Updates to PR created by me/assigned to me<br/>
                                    Updates to issues created by me/assigned to me<br/>
                                    @mentions
							</div> */}
              </div>
              <div className="" style={{ marginTop: "10px" }}>
                <Alert
                  message="You can delay notification delivery. All notifications in the selected time interval will be grouped. Choose realtime to deliver without delay."
                  type="success"
                  style={{ marginBottom: "10px" }}
                />
                <Text type="secondary">Delivery Frequency</Text>
              </div>
              <div className="proj-setting-common-pointer">
                <Select
                  disabled={!this.state.notifStatus}
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
              </div>
            </div>
          </div>
        </div>
        {/* </Card> */}

        {/* <Card  style={{ width: "100%" ,marginBottom:"20px",marginLeft:"24px",boxShadow: "0 1px 4px 0 rgba(0, 0, 0, 0.08)"}} >

								   <div className={this.state.notifStatus ? "" : "Preference_disable_state","bottom_space_forms"}>
                   <div className=""><Text type="secondary">Frequency</Text></div>
                     <div className='d-flex align-items-center justify-content-between proj-setting-common-pointer'>
                           <Select 
                               disabled={!this.state.notifStatus} 
                               name="projectNotif" 
                          	   style={{ width: "100%" }}
						  	   value={this.state.channelNotifFreq}
                               placeholder="Select Frequency"
                               onChange={this.onChangeFrequency}>
			                      {ChannelFrequency.map((project, index) => (
			                     <Option key={project.value}  value={project.value}>{project.name}</Option>
			                     ))}
		                  </Select> 
                    </div>
                 </div>
								   </Card> */}
        <div>
          {/* <Card title="Issue Notifications" style={{ width: "100%" }}> */}
          <div >
            <div >
              <div
                className={
                  (this.state.notifStatus ? "" : "Preference_disable_state",
                  "bottom_space_forms")
                }
              >
                <div className=""  style={{ marginBottom: "10px" }}>
                  <Text type="secondary">Repository</Text>
                  <div className="proj-setting-common-pointer">
                    {this.props.issueId ? (
                      <div>{this.props.issueName}</div>
                    ) : (
                      <Select
                        autoClearSearchValue
                        // disabled={!this.state.notifStatus}
                        style={{ width: "100%" }}
                        value={this.state.repoName}
                        onChange={this.handleChange}
                        placeholder="Select Repository"
                        showSearch={true}
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      >
                        {children}
                      </Select>
                    )}
                  </div>
                </div>
                
                <div className="">
                  <Text type="secondary">Labels(optional)</Text>
                  <div className=" proj-setting-common-pointer">
                    {
                      <Select
                        autoClearSearchValue
                        mode="multiple"
                        disabled={!this.state.projectSelected}
                        style={{ width: "100%" }}
                        value={this.state.labelName}
                        onChange={this.handleLabelChange}
                        placeholder="Select Labels"
                        showSearch={true}
                      >
                        {labelChildren}
                      </Select>
                    }
                  </div>
                </div>
                <div className="" style={{marginTop:"18px"}}>
                  <Text type="secondary">Projects(optional)</Text>
                  <div className="proj-setting-common-pointer">
                    {
                      <Select
                        autoClearSearchValue
                        mode="multiple"
                        disabled={!this.state.projectSelected}
                        style={{ width: "100%" }}
                        value={this.state.projectName}
                        onChange={this.handleProjectChange}
                        placeholder="Select Projects"
                        showSearch={true}
                      >
                        {projectChildren}
                      </Select>
                    }
                  </div>
                </div>
                <div className="" style={{marginTop:"18px"}}>
                  <Text type="secondary">Milestone(optional)</Text>
                  <div className="proj-setting-common-pointer">
                    {
                      <Select
                        autoClearSearchValue
                        mode="multiple"
                        disabled={!this.state.projectSelected}
                        style={{ width: "100%" }}
                        value={this.state.mileStoneName}
                        onChange={this.handleMileStoneChange}
                        placeholder="Select Milestone"
                        showSearch={true}
                      >
                        {mileStoneChildren}
                      </Select>
                    }
                  </div>
                </div>
              </div>

              <div
                style={{ marginBottom: "14px", marginLeft: "-10px" }}
                className="proj-setting-common-pointer"
              >
                <div
                  style={{
                    marginLeft: "10px",
                    fontSize: "14px",
                    color: "#7d7d7d"
                  }}
                >
                  Selected Events
                </div>
                {notifEvent &&
                  notifEvent.map((event, index) => (
                    <div>
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
                        <Text type="secondary">{event.label}</Text>
                      </Checkbox>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/*------------------------------Toggle(Enable/Disable)------------------------------*/}
          <div>
            <div className="d-flex align-items-center">
              {/* <Button type="primary" ghost className="btn_114 margin__right__button" onClick={this.onSave}>Save</Button> */}
              <Button
                disabled={!this.state.notifStatus}
                type="primary"
                className="btn_114 margin__right__button"
                loading={this.state.loading}
                onClick={this.onSave}
              >
                Save
              </Button>
              {this.props.issueId ? (
                <>
                 {/* <Button
                 // disabled={!this.props.status}

                 type="secondary"
                 className="btn_114 margin__right__button"
                 onClick={this.cancelModal}
               >
                 Cancel
               </Button> */}
                <Button
                  // disabled={!this.props.status}
                  // style={{marginLeft:"212px",marginTop:"16px"}}
                  style={{marginTop:'16px'}}
                  type="danger"
                  className="btn_114 "
                  onClick={this.deleteIssueConfig}
                >
                  Delete
                </Button>
                </>
              ) : (
                <Button
                  // disabled={!this.props.status}

                  type="secondary"
                  className="btn_114 margin__right__button"
                  onClick={this.cancelModal}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>

          {/* {!this.state.notifStatus ? this.onSave1(this.state.notifStatus) : this.onSave2()} */}
          <ToastContainer
            closeButton={<CloseButton />}
            hideProgressBar
            position="bottom-left"
          />
          {/* </Card> */}
        </div>

        {/* <ProjectCardNotifications channelId = {this.props.channelId} status={this.state.notifStatus} frequency={this.state.channelNotifFreq}/> */}
        {/* <PullRequestNotifications /> */}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    projects: state.skills.projects,
    channelDefault: state.skills,
    gitHubRepository: state.skills.repository,
    repoLabels:state.github.repo_labels,
    repoProjects:state.github.repo_projects,
    repoMileStones:state.github.repoMileStones,
    orgProjects : state.github.org_projects
  };
};

export default withRouter(
  connect(mapStateToProps, {
    getProject,
    personalSetting,
    getGitHubChannelConfig,
    setGitHubChannelConfig,
    enableAndDisable,
    getAllGitHubChannelConfig,
    deleteGitHubIssueConfig,
    getRepoLabels,
    getGitHubRepository,
    getRepoProject,
    getMileStone,
    getOrganistaionProject
  })(GithubChannelNotification2)
);
