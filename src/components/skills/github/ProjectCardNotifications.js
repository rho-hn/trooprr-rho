import React, { Component } from "react";
import { ArrowRightOutlined, DeleteOutlined } from '@ant-design/icons';
import { Typography, Select, Row, Col } from "antd";
import {
  getRepos,
  getOrganistaionProject,
  getRepoProject,
  setGitHubChannelProjectConfig,
  getProjectColumns,
  getGitHubChannelProjectConfig,
  deleteInputs,
  deleteConfig
} from "../github/gitHubAction";
import { getAllGitHubChannelConfig } from "../skills_action";

import { ToastContainer } from "react-toastify";
import { Button, Checkbox, message, Alert } from "antd";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
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
    label: "created(When new cards are created)",
    value: "created"
  },
  {
    label: "edited(When a card is updated)",
    value: "edited"
  },
  // {
  //   label: "converted to an issue",
  //   value: "converted"
  // },
  {
    label: "moved(When a card is moved to another column)",
    value: "moved"
  }
];

let projectTypes = [
  {
    label: "Organization Project",
    value: "org_project"
  },
  {
    label: "Repository Project",
    value: "repo_project"
  }
];

const CloseButton = ({ closeToast }) => (
  <span className="close-toaster-text" onClick={closeToast}>
    DISMISS
  </span>
);

class ProjectCardNotifications extends Component {
  state = {
    notifEvent: [],
    showAddInputs: false,
    addInputs: ["add"],
    addInputs1: [],
    projectLabel: "",
    organiztionProjects: [],
    showOrganiztaionInput: false,
    organizationSelectedProject: "",
    repositories: [],
    onChangeRepoId: "",
    organizationSelectedProjectId: "",
    onChangeRepoProjectId: "",
    notifStatus: false,
    movedselectShow: false,
    channelNotifFreq: 1,
    loading: false
    // fromColumn:"",
    // toColumn
  };

  componentDidMount = () => {
    // let s_data = this.state.subscription_data;
    // console.log("compknet fdf",this.props.subscription_data.status_array)
    let s_data = this.props.subscription_data;
    let arrydata = [];

    let projId;
    if (this.props.projectName) {
      projId = this.props.projectId;
    } else {
      projId = "";
    }

    if (projId) {
      s_data.status_array.forEach(data => {
        arrydata.push("add");
      });
      let eventMoved = s_data.project_event_type.find(event => {
        return event === "moved";
      });

      if (eventMoved) {
        this.setState({
          showAddInputs: true
        });
      }

      if (s_data.projectType.type === "org_level") {
        // this.props

        this.setState(
          {
            projectLabel: "org_project",
            showOrganiztaionInput: true,
            showRepoInput: false,
            organizationSelectedProject: s_data.projectType.orgProjName,
            movedselectShow: true,
            organizationSelectedProjectId: projId
          },
          () => {
            this.props.getProjectColumns(
              this.props.match.params.wId,
              s_data.projectType.id,
              "projectCard"
            );

            this.props.getOrganistaionProject(this.props.match.params.wId);
          }
        );
      } else {
        this.setState(
          {
            projectLabel: "repo_project",
            showRepoInput: true,
            showOrganiztaionInput: false,
            onChangeRepo: s_data.projectType.repoName,
            onChangeRepoProject: s_data.projectType.repoProjName,
            movedselectShow: true,
            onChangeRepoProjectId: s_data.projectType.id
          },
          () => {
            this.props.getProjectColumns(
              this.props.match.params.wId,
              s_data.projectType.id,
              "projectCard"

            );
            this.props.getRepoProject(this.props.match.params.wId, projId);
          }
        );
      }

      this.setState({
        notifEvent: s_data.project_event_type,
        addInputs1: s_data.status_array,
        addInputs: arrydata,
        channelNotifFreq: s_data.frequency
      });
    }
  };

  toggleNotif = () => {
    this.setState({ notifStatus: !this.state.notifStatus });
  };

  onChangeEvent = e => {
    // console.log("s_data.projectType.repoProjId",s_data.projectType.repoProjId)
    // console.log("s_data.projectType.repoProjId",this.props.projects);

    if (this.state.notifEvent) {
      let arr = this.state.notifEvent;
      if (e.target.value === "moved") {
        if (this.state.movedselectShow) {
          let arr = this.state.notifEvent;
          let index = arr.findIndex(item => item === e.target.value);
          if (index > -1) {
            arr.splice(index, 1);
          } else {
            arr.push(e.target.value);
          }
          this.setState(
            {
              showAddInputs: !this.state.showAddInputs
            },
            () => {
              // if (this.state.showAddInputs) {
              //   this.props.getProjectColumns(
              //     this.props.match.params.wId,
              //     this.props.projects[0].id
              //   );
              // }
            }
          );
        } else {
          // if(this.state.showAddInputs){
            this.setState({loading:false})
          message.error("Please select a project");

          // }
        }
      } else {
        let index = arr.findIndex(item => item === e.target.value);
        if (index > -1) {
          arr.splice(index, 1);
        } else {
          arr.push(e.target.value);
        }
      }

      this.setState({ [e.target.name]: arr }, () => {
      });
    }
  };

  onChangeProjectLabel = (event, value) => {
    this.setState({
      projectLabel: event,
      showAddInputs: false,
      addInputs: ["add"],
      addInputs1: [],
      notifEvent: [],
      organizationSelectedProject: "",
      onChangeRepoProject: "",
      onChangeRepo: ""
    });

    if (event === "org_project") {
      this.setState({
        showOrganiztaionInput: true,
        showRepoInput: false
      });

      this.props
        .getOrganistaionProject(this.props.match.params.wId)
        .then(data => {
          // console.log("data organication prifrbh",data);
          // this.setState({
          //   organiztionProjects:data.data.projects
          //  },()=>console.log("projectrepos====>",this.state.organiztionProjects));
        });

      // this.props.getOrgProjects(this.props.match.params.wId).then(data=>{
      //   console.log("resss=?",data)
      // })
    } else {
      this.setState({
        showRepoInput: true,
        showOrganiztaionInput: false
      });
      // this.props.getOrgProjects(this.props.match.params.wId).then(data=>{
      //   console.log("resss=?",data)
      // })
    }
  };

  onChangeOrganizationProject = (value, event) => {
    this.setState(
      {
        organizationSelectedProject: value,
        organizationSelectedProjectId: event.key,
        movedselectShow: true
      },
      () => {
            
              this.props.getProjectColumns(this.props.match.params.wId, event.key,"projectCard");
      }
    );
  };

  addInputs = () => {
    let d = "add";
   
    // this.state.addInputs1.map()
    if (this.state.addInputs.length === this.state.addInputs1.length) {

      let addAnotherInput = this.state.addInputs1.filter((data, index) => {
        let input = "input-" + (index + 1);

        if (
          data[input].fromColumn &&
          data[input].fromColumn.length > 0 &&
          data[input].fromColumn &&
          data[input].toColumn.length > 0
        ) {
          // this.setState(prevState => ({
          //   addInputs: [...prevState.addInputs, d]
          // }));
          return true;
        } else {
          this.setState({loading:false})
          message.error("Please select both 'From' and 'To' columns");
        }
      });

      if (addAnotherInput) {
        this.setState(prevState => ({
          addInputs: [...prevState.addInputs, d]
        }));
      } else {
        this.setState({loading:false})
        message.error("Please select both 'From' and 'To' columns");
      }
    } else {
      this.setState({loading:false})
      message.error("Please select both 'From' and 'To' columns");
    }

  };

  onChangeRepo = (event, value) => {
    this.setState(
      {
        onChangeRepo: event,
        onChangeRepoId: value.key,
        onChangeRepoProject: ""
      },
      () => {
        this.props.getRepoProject(
          this.props.match.params.wId,
          this.state.onChangeRepoId
        );
      }
    );
  };

  onChangeRepoProject = (event, value) => {
    this.setState(
      {
        onChangeRepoProject: event,
        onChangeRepoProjectId: value.key,
        movedselectShow: true
      },
      () => this.props.getProjectColumns(this.props.match.params.wId, value.key,"projectCard")
    );
  };

  onChangeInput = (event, value) => {
    // eventevent
    // console.log("event====>", event);
    // console.log("=======>", value.key);
    let column = value.key.split("@")[1];
    let inputnumber = `input-${this.state.addInputs.length}`;

    let df = [...this.state.addInputs1];
    // console.log("this.state.addInputs1 ", this.state.addInputs1);
    if (
      this.state.addInputs1 &&
      this.state.addInputs1[this.state.addInputs.length - 1]
    ) {

      let keyRecognized;
      let duplicateState;

      this.state.addInputs1.forEach(input => {
        keyRecognized = input.hasOwnProperty(value.props.name);
        if (keyRecognized) {
          // console.log("keyRecognized==>", keyRecognized);
          duplicateState = [...this.state.addInputs1];
          // console.log("duplicateState======>", duplicateState);
          // console.log(
          //   "duplicateState??????new",
          //   duplicateState[this.state.addInputs.length - 1][value.props.name]
          // );
          if (column === "fromColumn") {
            //  let  value1=this.state.addInputs1[this.state.addInputs.length - 1] ? this.state.addInputs1[this.state.addInputs.length - 1][inputnumber].fromColumn : ""
            duplicateState[this.state.addInputs.length - 1][
              value.props.name
            ].fromColumn = event;
          }

          if (column === "toColumn") {
            // let  value1=this.state.addInputs1[this.state.addInputs.length - 1] ? this.state.addInputs1[this.state.addInputs.length - 1][inputnumber].toColumn : ""

if(duplicateState&&duplicateState[this.state.addInputs.length - 1]&&duplicateState[this.state.addInputs.length - 1][value.props.name]&&duplicateState[this.state.addInputs.length - 1][value.props.name].toColumn){
  duplicateState[this.state.addInputs.length - 1][value.props.name].toColumn = event;
}
}

          // console.log("new duplicate state==>", duplicateState);
          this.setState(
            {
              addInputs1: duplicateState
            });
        }
      });
    } else {
      if (column === "fromColumn") {
        let value1 = this.state.addInputs1[this.state.addInputs.length - 1]
          ? this.state.addInputs1[this.state.addInputs.length - 1][inputnumber]
              .fromColumn
          : "";
        // let a = {
        //   [value.props.name]:{fromColumn:event}
        // }
        df.push({
          [value.props.name]: { fromColumn: event, key: value.props.name }
        });
      }

      if (column === "toColumn") {
        let value1 = this.state.addInputs1[this.state.addInputs.length - 1]
          ? this.state.addInputs1[this.state.addInputs.length - 1][inputnumber]
              .toColumn
          : "";

        df.push({
          [value.props.name]: { toColumn: event, key: value.props.name }
        });
      }
      this.setState(
        {
          addInputs1: df
        }
      );
    }
  };

  onSave = () => {
    this.setState({loading:true})
    let type;
    // const search = window.location.search;
    // const channelId = this.props.channel_name;
    let events = this.state.notifEvent;
    // console.log("channel anme", this.props.channel_name)
    let data = {
      projectEventTypes: this.state.notifEvent,
      addInputs1: this.state.addInputs1,

      status: true,
      user_id: localStorage.trooprUserId,
      channel_id: this.props.channelId,
      channelName: this.props.channel_name,
      skill_id: this.props.match.params.skill_id,
      workspace_id: this.props.match.params.wId,
      type: type,
      frequency: this.state.channelNotifFreq
    };

    if (this.state.projectLabel === "repo_project") {
      data.type = "repo_level";
      data.repoName = this.state.onChangeRepo;
      data.repoId = this.state.onChangeRepoId;
      data.repoProjName = this.state.onChangeRepoProject;
      data.repoProjId = this.state.onChangeRepoProjectId;
    } else {
      data.orgProjName = this.state.organizationSelectedProject;
      data.orgProjId = this.state.organizationSelectedProjectId;
      data.type = "org_level";
    }

    if (this.state.movedselectShow) {
      if (events.length > 0) {
        this.props
          .setGitHubChannelProjectConfig(
            this.props.match.params.wId,
            this.props.match.params.skill_id,
            data
          )
          .then(data => {
            if (data.data.success) {
              this.props.getAllGitHubChannelConfig(
                this.props.match.params.wId,
                this.props.match.params.skill_id,
                this.props.channelId
              );
                this.setState({loading:false})
              message.success("Saved successfully");
              // this.props.closeModal;
              this.props.closeModal();
            }
            // console.log("data at frontend===>",data);
          });
      } else {
        this.setState({loading:false})
        message.error("Please select the Event");
      }
    } else {
      this.setState({loading:false})
      message.error("Please select Project type");
    }
  };

  deleteInputs = (input, index) => {
    let addInput = [];
    const channelId = this.props.channelId;
    let data = {
      input,
      index,
      id: this.props.projectId
    };
    this.props
      .deleteInputs(
        this.props.match.params.wId,
        this.props.match.params.skill_id,
        channelId,
        data
      )
      .then(deletedInput => {

        deletedInput.data.data.status_array.forEach(dtaa => {
          addInput.push("add");
        });
        deletedInput.data.data.status_array.forEach(data => {});
        this.setState({
          addInputs1: deletedInput.data.data.status_array,
          addInputs: addInput
        });
      });
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
  cancelModal = () => {
    this.props.closeModal();
  };

  deleteProjectConfig = () => {
    const search = window.location.search;
    const channelId = this.props.channelId;
    let data = {
      id: this.props.projectId,
      name: this.props.projectName,
      type: "project"
    };
    this.props
      .deleteConfig(
        this.props.match.params.wId,
        this.props.match.params.skill_id,
        channelId,
        data
      )
      .then(data => {
        this.props.closeModal();
        message.success("Deleted successfully");
      });

    // this.props.history.push("/5da4544577360439548077eb/skill/github/5dd63174bd3dc1549ee7e5e4?view=github_channel_pref&random=CDC63GDCP")
  };
  render() {

    let width1 = this.state.showOrganiztaionInput
      ? { width: 320 }
      : this.state.showRepoInput
      ? { width: 220 }
      : { width: 320 };
    
    let children = this.state.addInputs.map((val, indx) => {
      let inputnumber = "input-" + (indx + 1);
      let fromInputKey = inputnumber + indx + "@" + "fromColumn";
      let toInputKey = inputnumber + indx + "@" + "toColumn";
      
      return (
        <div key={indx} className="proj-setting-common-pointer">
          <Row type="flex" justify="space-around" align="middle">
            <Col span={10}>
              <Select
                //  disabled={!this.state.notifStatus}
                // disabled={!this.props.status}

                style={{ width: 280, marginBottom: "10px", marginRight: "5px" }}
                value={
                  this.state.addInputs1[indx]
                    ? this.state.addInputs1[indx][inputnumber].fromColumn
                    : ""
                }
                placeholder="Select Transition"
                onChange={this.onChangeInput}
              >
                {this.props.columns.map((project, index) => (
                  <Option
                    name={inputnumber}
                    key={fromInputKey}
                    value={project.name}
                  >
                    {project.name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={2}>
              <div style={{ marginTop: "-10px", marginLeft: "12px" }}>
                {/* <i className="material-icons">arrow_right_alt</i> */}
                <ArrowRightOutlined />
              </div>
            </Col>
            <Col span={10}>
              <Select
                //  disabled={!this.state.notifStatus}
                // disabled={!this.props.status}

                style={{ width: 280, marginBottom: "10px", marginLeft: "5px" }}
                value={
                  this.state.addInputs1[indx]
                    ? this.state.addInputs1[indx][inputnumber].toColumn
                    : ""
                }
                placeholder="Select Transition"
                onChange={this.onChangeInput}
              >
                {this.props.columns &&
                  this.props.columns
                    .filter(data => {
                      return data.name !== "Any";
                    })
                    .map((project, index) => (
                      <Option
                        name={inputnumber}
                        key={index}
                        value={project.name}
                      >
                        {project.name}
                      </Option>
                    ))}
              </Select>
            </Col>
            <Col span={2}>
              {this.props.projectId && (
                <div
                  style={{
                    marginTop: "-9px",
                    cursor: "pointer",
                    marginLeft: "10px"
                  }}
                  onClick={() => this.deleteInputs(inputnumber, indx)}
                >
                  <DeleteOutlined style={{ fontSize: "22px", color: "red" }} />
                </div>
              )}
            </Col>
          </Row>
        </div>
      );
    });

    return (
      // <div
      //   style={{ marginTop: "20px" }}
      //   className="Setting__body d-flex align-items-center justify-content-between card "
      // >
      // <Card
      //   title="Project Card Notifications"
      //   // style={{ width: "100%" }}
      //   // extra={
      //   //   <Switch
      //   //     checked={this.state.notifStatus}
      //   //     onClick={this.toggleNotif}
      //   //   />
      //   // }
      // >
      <div>
        <div style={{ marginTop: "10px" }}>
          <Alert
            message="You can delay notification delivery. All notifications in the selected time interval will be grouped. Choose realtime to deliver without delay."
            type="success"
          />
        </div>
        {/* <div className={this.state.notifStatus ? "" : "Preference_disable_state","bottom_space_forms"}> */}
        <div className="" style={{ marginTop: "10px" }}>
          <Text type="secondary">Delivery Frequency</Text>
        </div>
        <div className="proj-setting-common-pointer">
          <Select
            //  disabled={!this.state.notifStatus}
            name="projectNotif"
            style={{ width: 320 }}
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
        <hr />
        <div className="">
          <div>
            {this.props.projectId ? (
              <>
                {" "}
                <div className="">
                  <Text type="secondary">Project</Text>
                </div>
                <div>{this.props.projectName}</div>{" "}
              </>
            ) : (
              <>
                <div className="">
                  <Text type="secondary">Select Project type</Text>
                </div>
                <Select
                  //  disabled={!this.state.notifStatus}
                  // disabled={!this.props.status}

                  name="projectNotif"
                  style={width1}
                  value={this.state.projectLabel}
                  placeholder="Select Frequency"
                  onChange={this.onChangeProjectLabel}
                >
                  {projectTypes.map((project, index) => (
                    <Option key={project.value} value={project.value}>
                      {project.label}
                    </Option>
                  ))}
                </Select>
              </>
            )}
          </div>

          {this.props.projectId ? (
            <div></div>
          ) : (
            this.state.showOrganiztaionInput && (
              <div>
                <div className="" style={{ marginTop:"10px"}}>
                  <Text type="secondary">Select Project</Text>
                </div>
                <Select
                  //    disabled={!this.state.notifStatus}
                  // disabled={!this.props.status}

                  name="projectNotif"
                  style={{ width: 320 }}
                  value={this.state.organizationSelectedProject}
                  placeholder="Select Frequency"
                  onChange={this.onChangeOrganizationProject}
                >
                  {this.props.orgProjects.map((project, index) => (
                    <Option key={project.id} value={project.name}>
                      {project.name}
                    </Option>
                  ))}
                </Select>
              </div>
            )
          )}

          {this.props.projectId ? (
            <div></div>
          ) : (
            this.state.showRepoInput && (
              <div className="" style={{ marginTop:"10px"}}>
                {/* <div className="d-flex align-items-center justify-content-between proj-setting-common-pointer pa"> */}
                {/* <Text type="secondary">Select Repository</Text> */}

                <div className="">
                  <Text type="secondary">Select Repository</Text>
                </div>
                {/* </div> */}
                <Select
                  //    disabled={!this.state.notifStatus}
                  // disabled={!this.props.status}

                  name="projectNotif"
                  style={{ width: 220 }}
                  value={this.state.onChangeRepo}
                  placeholder="Select Repository"
                  onChange={this.onChangeRepo}
                >
                  {this.props.repos.map((project, index) => (
                    <Option key={project.id} value={project.name}>
                      {project.name}
                    </Option>
                  ))}
                </Select>
              </div>
            )
          )}

          {this.props.projectId ? (
            <div></div>
          ) : (
            this.state.showRepoInput && (
              <div className="" style={{ marginTop:"10px"}}>
                <div className=" proj-setting-common-pointer">
                  <Text type="secondary">Select Project</Text>
                </div>

                <Select
                  //    disabled={!this.state.notifStatus}
                  // disabled={!this.props.status}

                  name="projectNotif"
                  style={{ width: 220 }}
                  value={this.state.onChangeRepoProject}
                  placeholder="Select Project"
                  onChange={this.onChangeRepoProject}
                  // disabled={!this.props.status}
                >
                  {this.props.repoProjects.map((project, index) => (
                    <Option key={project.id} value={project.name}>
                      {project.name}
                    </Option>
                  ))}
                </Select>
              </div>
            )
          )}
        </div>
        {/* </div> */}

        <div
          style={{ marginBottom: "14px", marginTop: "20px" }}
          className="proj-setting-common-pointer"
        >
          {/* <div></div> */}
          <Text type="secondary">Select Event Types</Text>
          <div style={{ marginLeft: "-10px" }}>
            {notifEvent &&
              notifEvent.map((event, index) => (
                <div key={index} >
                  <Checkbox
                    style={{
                      marginLeft: "12px",
                      fontSize: "16px",
                      marginBottom: "4px"
                    }}
                    // disabled={!this.props.status}
                    checked={this.state.notifEvent.find(
                      item => item === event.value
                    )}
                    name={event.label}
                    onChange={this.onChangeEvent}
                    value={event.value}
                    //  value={"wd"}
                  >
                    <Text type="secondary">{event.label}</Text>
                  </Checkbox>
                </div>
              ))}
          </div>

          {this.state.showAddInputs && (
            <div>
              {/* <div>
                  <br />
                  Column change filters: Specify which column change will trigger notification. For example, you may want notifications only when card moves to "Ready to QA", then select "Any" to "Ready to QA"

                </div> */}
              <Alert
                message="Specify which column change will trigger notification. For example, you may want notifications only when card moves to 'Ready to QA', then select 'Any' to 'Ready to QA'. If no transitions are selected, notification will be triggered for every column change"
                type="success"
              />
              <br />
              <Row type="flex" align="middle">
                <Col span={12}>
                  <Text type="secondary">From Column</Text>
                </Col>
                <Col span={12}>
                  <Text type="secondary">To Column</Text>
                </Col>
              </Row>
              {children}
              {/* <br /> */}
              {/* <div style={{cursor:"pointer"}} onClick={this.addInputs}>Add status transition</div> */}
              <Button
                // disabled={!this.props.status}
                // style={{cursor:"pointer"}}
               
                type="default"
           
                onClick={this.addInputs}
              >
                Add status transition
              </Button>
            </div>
          )}

          {/* <DynamicInputs showInputs={this.state.showAddInputs} /> */}
        </div>

        <div className="d-flex">
          {/* <Button type="primary" ghost className="btn_114 margin__right__button" onClick={this.onSave}>Save</Button> */}
          <Button
            // disabled={!this.props.status}

            type="primary"
            className="btn_114 margin__right__button"
            loading={this.state.loading}
            onClick={this.onSave}
          >
            Save
          </Button>
          {this.props.projectId ? (
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
                // style={{ marginLeft: "492px",marginTop:"16px" }}
                style={{marginTop:'16px'}}
                type="danger"
              className="btn_114"
                onClick={this.deleteProjectConfig}
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

        <ToastContainer
          closeButton={<CloseButton />}
          hideProgressBar
          position="bottom-left"
        />
      </div>

      // </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    repos: state.github.repos,
    orgProjects: state.github.org_projects,
    repoProjects:state.github.repo_projects,
    columns: state.github.columns
  };
};

export default withRouter(
  connect(mapStateToProps, {
    getRepos,
    getOrganistaionProject,
    getRepoProject,
    setGitHubChannelProjectConfig,
    getProjectColumns,
    getGitHubChannelProjectConfig,
    deleteInputs,
    getAllGitHubChannelConfig,
    deleteConfig
  })(ProjectCardNotifications)
);
