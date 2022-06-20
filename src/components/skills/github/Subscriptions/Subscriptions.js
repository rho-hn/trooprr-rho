import React from "react";
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Typography, Select, Card } from "antd";
import { Button, message, Spin, Table } from "antd";
import { withRouter } from "react-router-dom";
import {
  getAllGitHubChannelConfig,
  setDefaultChannel,
  getDefaultChannel,
  getAssisantSkills
} from "../../skills_action";
import {
  getRepos,
  getOrganistaionProject,
  getRepoProject
} from "../gitHubAction";
import { connect } from "react-redux";
import IssueModal from "./IssueModal";
import ProjectModal from "./ProjectModal";
import { Row, Col } from "antd";
import Githubchannelpreferences from '../github_channel_preferences'
const queryString = require("query-string");

const { Option } = Select;
const { Title, Paragraph } = Typography;

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

class Subscriptions extends React.Component {
  constructor(props){
    super(props)
  this.state = {
    loading: false,
    channel_id: this.props.channel_id,
    channel_name: this.props.channel_name,
    openIssueModal: false,
    openprojectModal: false,
    issueId: "",
    issueName: "",
    projectId: "",
    projectName: "",
    // subscriptions_issues: [],
    // subscriptions_projects: [],
    currentSubscription: null,
    defaultRepos: "",
    defaultReposName: "",
    defaultProjects: [],
    defaultProjectsObject: [],
    enableProject: true,
    globalProjects:[],
    orgProjects:[],
    defaultloading:false,
    showChannelSetting:false,
    orgName:""
  };
  this.showChannelSetting = this.showChannelSetting.bind(this);
  this.textInput = React.createRef();
}
  componentDidMount = () => {
    // console.log("skill dataaa=>",this.state.channel_id);
    // console.log("this.props==>",this.props);
    this.props
      .getDefaultChannel(
        this.props.match.params.skill_id,
        this.state.channel_id
      )
      .then(res => {
        if (res.data && res.data.link_info) {
          
          // res.data.link_info.link_info.projects.forEach(d => {
          //   projects.push(d.projectId);
          // });
         
          this.props.getRepoProject(
            this.props.match.params.wId,
            res.data.link_info.link_info.repos
          ).then(repoProject=>{
            // console.log("repoProject==>",repoProject);
            if(repoProject.data.success){
    // console.log("orgNameorgName====>",this.props.orgName)

             
                // this.props.getOrganistaionProject(this.props.match.params.wId).then(orgProject=>{
                  // console.log("orgProject=========>",orgProject)

                  // if(orgProject.data.success){
                    let globalProjects = repoProject.data.projects.concat(this.props.orgName) ;
                    // console.log("globcal==>",f);
                    this.setState({
                      globalProjects:globalProjects,
                      orgProjects:this.props.orgName

                    })

                  // }

                  // if(this.props.orgName.length > 0){
                    let orgName ;

                    orgName = this.props.organizationName;
                    let joinedProjectName = orgName+"/"+res.data.link_info.link_info.projects[0].projectName
                    res.data.link_info.link_info.projects[0].projectName = joinedProjectName
                    delete  res.data.link_info.link_info.projects[0].orgProjName;
                    // console.log(" res.data.link_info.link_info.projects[0]", res.data.link_info.link_info.projects[0])
          
          
                    this.setState({
                      defaultRepos: res.data.link_info.link_info.repos,
                      defaultProjects: joinedProjectName,
                      enableProject: false,
                      defaultProjectsObject: res.data.link_info.link_info.projects[0],
                      defaultReposName: res.data.link_info.link_info.reposName,
                      orgName : orgName
                    });
                  // }
                // })

              
            }
          }) 
          
         
          
        }
      });
    this.props.getRepos(this.props.match.params.wId);

    let channelId = this.state.channel_id;
    let search = window.location.search;
    let query_params = queryString.parse(search);
    if (!channelId) {
      channelId = query_params.channel_id;
    }


    // this.setState({loading:true, channel_id:query_params.channel_id, channel_name:query_params.channel_name})
    this.props
      .getAllGitHubChannelConfig(
        this.props.match.params.wId,
        this.props.match.params.skill_id,
        channelId
      )
      .then(res => {
        this.setState({ loading: false });
        if (res.data.success) {
          // res.data.data.forEach(e => {
          //   if(e.repository_id){
          //     sub_issues.push(e)
          //   }else {sub_projects.push(e)}
          // })
          // this.setState({subscriptions_issues:sub_issues, subscriptions_projects:sub_projects})
        }
      });
  };

  

  openIssueModal = () => {
    this.setState(prevState => {
      return {
        issueId: "",
        issueName: "",
        openIssueModal: !prevState.openIssueModal
      };
    });
  };

  openProjectModal = () => {
    this.setState(prevState => {
      return {
        projectId: "",
        projectName: "",
        openprojectModal: !prevState.openprojectModal
      };
    });
  };

  closeModal = () => {
    this.setState({
      openIssueModal: false,
      openprojectModal: false
    });
  };

  manageIssue = subscription_issue => {
    this.setState({
      currentSubscription: subscription_issue,
      openIssueModal: true,
      issueId: subscription_issue.repository_id[0],
      issueName: subscription_issue.repoName[0]
    });
  };

  manageProjects = subscription_issue => {
    let id;
    let name;

    if (subscription_issue.projectType.repoName) {
      id = subscription_issue.projectType.id;
      name = subscription_issue.projectType.repoProjName;
    } else {
      id = subscription_issue.projectType.id;
      name = subscription_issue.projectType.orgProjName;
    }
    this.setState({
      projectId: id,
      projectName: name,
      currentSubscription: subscription_issue,
      openprojectModal: true
    });
  };

  onChangeRepos = (event, data) => {
    this.setState({
      defaultRepos: event,
      defaultReposName: data.props.children,
      defaultProjects: [],
      enableProject: false,
      defaultProjectsObject:[]
    });

    // console.log("project valueeeeee",this.state.selectedProject);
    // this.props.getRepoProject(this.props.match.params.wId, event);
    // this.props.getOrganistaionProject(this.props.match.params.wId);
    this.props.getRepoProject(
      this.props.match.params.wId,
      event
    ).then(repoProject=>{
      
      if(repoProject.data.success){
        let globalProjects;
        if(this.state.orgProjects.length > 0){
          // console.log()
           globalProjects = repoProject.data.projects.concat(this.state.orgProjects);
          // console.log("globcal==>",f);
          this.setState({
            globalProjects:globalProjects
          })
              
  
          
        }else{
          this.props.getOrganistaionProject(this.props.match.params.wId).then(orgProject=>{
            if(orgProject.data.success){
               globalProjects = repoProject.data.projects.concat(orgProject.data.projects) ;
               this.setState({
                globalProjects:globalProjects
              })
                  
      
            }
          })
        }

       
              
            
          

        
      }
    })  


  };

  onChangeProjects = (event, data) => {
    // this.setState({ defaultProjects: event });
    let project = {};
    // let projectIds = [];
    project.projectId = data.key;
    project.projectName = data.props.children;

    // data.forEach((data, index) => {
    //   f11.push(data.key);
    //   let f1 = {};
    //   f1.projectId = data.key;
    //   f1.projectName = data.props.children;
    //   f.push(f1);
    // });
    // console.log("fff", f);
    this.setState({ defaultProjects: event , defaultProjectsObject: project });
  };

  onClickSave = () => {
    this.setState({defaultloading:true})
    // var arr = [];

    // // console.log("this.state.defaultProjectsObject",this.state.defaultProjectsObject)
    // let newDefaultProjectObject = this.state.defaultProjectsObject;
    // let splitProjectName = newDefaultProjectObject.projectName.split("/")
    // arr.push(this.state.defaultProjectsObject)

    // var data = {
    //   // link_info: {
    //   //   projects: this.state.defaultProjectsObject,
    //   //   repos: this.state.defaultRepos,
    //   //   reposName: this.state.defaultReposName
    //   // }
    //   link_info: {
    //     projects: arr,
    //     repos: this.state.defaultRepos,
    //     reposName: this.state.defaultReposName
    //   }
    // };

    // console.log("======>data",splitProjectName[0])
    // console.log("======>data",splitProjectName[1])
    // data.link_info.projects[0].orgProjName = splitProjectName[0];

    // data.link_info.projects[0].projectName = splitProjectName[1];



    // data.channel_id = this.state.channel_id;
    // data.updated_by = localStorage.trooprUserId;
    // data.skill_id = this.props.match.params.skill_id;

    var arr = [];
    // console.log("this.state.defaultProjectsObject",this.state.defaultProjectsObject);
    let splitProjectName;
    let newDefaultProjectObject;
    var data
    // if(this.state.defaultProjectsObject.length > 0 ){
      if(this.state.defaultProjectsObject.length > 0 || this.state.defaultProjectsObject.projectId){
        newDefaultProjectObject = this.state.defaultProjectsObject;
        splitProjectName = newDefaultProjectObject.projectName.split("/");
        arr.push(this.state.defaultProjectsObject)
        data = {
       channel:this.props.channel,
        link_info: {
          projects: arr,
          repos: this.state.defaultRepos,
          reposName: this.state.defaultReposName
        }
      };
      // console.log("======>data",splitProjectName[0])
      // console.log("======>data",splitProjectName[1])
      data.link_info.projects[0].orgProjName = splitProjectName[0];
  
      data.link_info.projects[0].projectName = splitProjectName[1];
      // console.log("===>data",data)
  
      data.channel_id = this.state.channel_id;
      data.updated_by = localStorage.trooprUserId;
      data.skill_id = this.props.match.params.skill_id;
      }
    

    if (
     
      data && data.link_info.projects[0].projectName &&
      data.link_info.repos &&
      data.channel_id &&
      localStorage.trooprUserId
    ) {
      this.setState({});
      this.props
        .setDefaultChannel(
          this.props.match.params.skill_id,
          data,
          this.state.preference
        )
        .then(res => {
          if (res.data.success) {
            // console.log("this.state===",res.data)
            // console.log("newDefaultProjectObject",newDefaultProjectObject);
            let joinedProjectName = res.data.link_info.link_info.projects[0].orgProjName+"/"+res.data.link_info.link_info.projects[0].projectName
            // console.log("joinedProjectName",joinedProjectName);
            res.data.link_info.link_info.projects[0].projectName = joinedProjectName
            delete  res.data.link_info.link_info.projects[0].orgProjName;
            // console.log(" res.data.link_info.link_info.projects[0]", res.data.link_info.link_info.projects[0])


            // res.data.link_info.link_info.projects.forEach(d => {
            //   projects.push(d.projectId);
            // });
            this.setState({
              defaultRepos: res.data.link_info.link_info.repos,
              defaultProjects: joinedProjectName,
              defaultProjectsObject: res.data.link_info.link_info.projects[0],
              // defaultProjects: res.data.link_info.link_info.projects[0].projectName,
              edit: false,
              error: {}
            });
            this.setState({defaultloading:false})
            message.success("Saved successfully");
          }
        });
    }  else {
      if (this.state.defaultRepos === "") {
        this.setState({defaultloading:false})
        message.error("No Repos selected");
      } else {
        this.setState({defaultloading:false})
        message.error("No Project selected");

        // error.defaultProjects = "No Project selected";
      }
    }
  };

  showChannelSetting(){
    let path = window.location.pathname;
      let obj = {
        "title": this.props.skillView.view,
        "url": path + `?view=${this.props.skillView.view}`
      }
       window.history.pushState(obj, obj.title, obj.url);
       this.setState({showChannelSetting:true})
    }
 

  render() {
    const columns_issues = [
      {
        title: "Subscription Name",
        dataIndex: "_id",
        key: "_id",
        className: "table-column",
        align: "center",
        render: (text, record) => {
          let time = record.frequency;
          let note;

          let timeValue = ChannelFrequency.find(data => {
            if (data.value === time) {
              return data;
            }
          });

          if (timeValue.value === 0) {
            note = `Events from ${record.repoName[0]} in Real time`;
          } else {
            note = `Events from ${record.repoName[0]} every ${timeValue.name}`;
          }

          return (
            <a
              className="table-link"
              onClick={() => {
                this.manageIssue(record);
              }}
            >
              {note}
            </a>
          );
        }
      }
    ];
// console.log("this.state.orgName==>",this.props.organizationName)
    const columns_projects = [
      {
        title: "Subscription Name",
        dataIndex: "_id",
        key: "_id",
        className: "table-column",
        align: "center",
        render: (text, record) => {
          // console.log("record.projectType.orgProjName.split000[0]",record.projectType.orgProjName.split("/")[0])
          let time = record.frequency;
          let note;

          let timeValue = ChannelFrequency.find(data => {
            if (data.value === time) {
              return data;
            }
          });
          let pro;
          let projNmae;
          if(record.projectType && record.projectType.repoProjName){
            pro = record.projectType.repoProjName.split("/");
            projNmae = pro[1] ?record.projectType.repoProjName :  (this.props.organizationName+"/" +pro[0])  ; 

          }
          if (timeValue.value === 0) {
            note = `Events from ${record.projectType.repoProjName? projNmae : (record.projectType.orgProjName.split("/")[0] === "undefined" ? (this.props.organizationName+"/"+record.projectType.orgProjName.split("/")[1]) : record.projectType.orgProjName )} in Real time`
          } else {
            note = `Events from ${record.projectType.repoProjName? projNmae : (record.projectType.orgProjName.split("/")[0] === "undefined" ? (this.props.organizationName+"/"+record.projectType.orgProjName.split("/")[1]) : record.projectType.orgProjName )} every ${timeValue.name}`;
          }
          // console.log("note====>",note)
          return (
            <a
              className="table-link"
              onClick={() => {
                this.manageProjects(record);
              }}
            >
              {/* Events from{" "} */}
              {/* {record.projectType.repoProjName? record.projectType.repoProjName : record.projectType.orgProjName} */}
              {note}
            </a>
          );
        }
      }
    ];
    return (
      <div>
      {!this.state.showChannelSetting ?
      <div> 
                  
        <Title level={3} style={{display:"flex"}}><Button
        onClick={this.showChannelSetting}
        icon={<ArrowLeftOutlined />}
        style={{ marginRight: "16px" }}
      >
        Back
    </Button>
        Channel: {this.state.channel_name} </Title>
        <Row className='content_row' gutter={[0, 16]}>
          <Col span={24}>
            <Card
              size='small'
              title="Issue Notification Subscription"
              extra={
                <Button  type="primary" onClick={this.openIssueModal}>
                  Add Subscription
                </Button>
              }
            >
              {this.state.loading ? (
                <Spin />
              ) : (
                <Table
                  columns={columns_issues}
                  showHeader={false}
                  dataSource={this.props.gitChannelConfigs.filter(
                    (issues, index) => {
                      return issues.repoName.length > 0;
                    }
                  )}
                  pagination={{ pageSize: 20 }}
                />
              )}
            </Card>
            {/* <Card title="Issue Notification Subscription">
          <div>
            {this.props.gitChannelConfigs && this.props.gitChannelConfigs ? (
              manageissues
            ) : (
              <Empty
                image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
                imageStyle={{
                  height: 60
                }}
                description={
                  <span>
                    You are not subscribed to any notifications for this channel
                  </span>
                }
              ></Empty>
            )}
          </div>
          {(this.props.gitChannelConfigs.length === 0) && <Empty
                image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
                imageStyle={{
                  height: 60
                }}
                description={
                  <span>
                    You are not subscribed to any notifications for this channel
                  </span>
                }
              ></Empty> }
          <div style={{ width: "130px", margin: "0 auto" }}>
            <Button
              // disabled={!this.state.notifStatus}
              type="primary"
              onClick={this.openIssueModal}
            >
              Add Subscription
            </Button>
          </div>
        </Card>*/}
          </Col>
          <Col span={24}>
            <Card
            size='small'
              title="Project Notification Subscription"
              extra={
                <Button  type="primary" onClick={this.openProjectModal}>
                  Add Subscription
                </Button>
              }
            >
              {this.state.loading ? (
                <Spin />
              ) : (
                <Table
                  columns={columns_projects}
                  showHeader={false}
                  dataSource={this.props.gitChannelConfigs.filter(
                    (issues, index) => {
                      return issues.projectType;
                    }
                  )}
                  pagination={{ pageSize: 20 }}
                />
              )}
            </Card>
          </Col>
          </Row>
          <br />
          <Row className='content_row' gutter={[0, 16]}>
          <Col span={24}>
            <Card size='small' title="Channel defaults">
              <Paragraph type='secondary' className="Github_preference_tag_second_issue">
                These values will be used in the Bot Channel (DM with Troopr
                Assistant) when creating Github issues.
              </Paragraph>

              {/*---------------------------------Default repos----------------------------------------*/}
              <div
                className={
                  (this.state.edit ? "" : "Preference_disable_state",
                  "bottom_space_forms")
                }
              >
                <div className="Github_preference_personal_default_type">
                  Default Repository
                </div>
                <div className=" proj-setting-common-pointer">
                  <Select
                    // placeholder="Select Repo"
                    name="defaultRepos"
                    style={{ width: "100%" }}
                    value={this.state.defaultRepos}
                    onChange={(value, data) => this.onChangeRepos(value, data)}
                    showSearch={true}
                    //  disabled={!this.state.edit}
                  >
                    {this.props.repos &&
                      this.props.repos.map((repo, index) => {
                        return <Option key={repo.id} value={repo.id}>
                          {repo.name}
                        </Option>
                        })}
                  </Select>
                </div>
                {/* {this.state.error.defaultRepos && (
                          <div className="error_message">
                            {this.state.error.defaultRepos}
                          </div>
                        )} */}
              </div>

              {/*---------------------------------Default Projects----------------------------------*/}

              <div
                className={
                  (this.state.edit ? "" : "Preference_disable_state",
                  "bottom_space_forms")
                }
              >
                <div className="Github_preference_personal_default_type">
                  Default project
                </div>
                <div className="proj-setting-common-pointer">
                  <Select
                    // placeholder="Select Projects"
                    autoClearSearchValue
                    // mode="multiple"
                    name="defaultProjects"
                    style={{ width: "100%" }}
                    value={this.state.defaultProjects}
                    // showSearch={true}
                    onChange={(value, data) =>
                      this.onChangeProjects(value, data)
                    }
                    // showSearch={true}
                    disabled={this.state.enableProject}
                  >
                    {this.state.globalProjects &&
                      this.state.globalProjects.map((project, index) => (
                        <Option key={project.id} value={project.id}>
                          {project.name}
                        </Option>
                      ))}
                  </Select>
                </div>
                {/* {this.state.error.defaultProjects && (
                          <div className="error_message">
                            {this.state.error.defaultProjects}
                          </div>
                        )} */}
              </div>

              {/*----------------------------------------Buttons----------------------------------------*/}
              {/* {this.state.edit ? */}
              <div>
                {/* <Button type="primary"  className=" btn_114 margin__right__button" onClick={this.onCancel}>Cancel</Button> */}
                <Button
                  type="primary"
                  className="btn_114 margin__right__button"
                  loading={this.state.defaultloading}
                  onClick={this.onClickSave}
                >
                  Save
                </Button>
              </div>
              {/* : <Button type="primary"  className=" btn_114 margin__right__button_edit" onClick={this.openEditState}>Edit</Button> */}
              {/* } */}
            </Card>
          </Col>
          {/* <Card title="Project Notification Subscription">
          {this.props.gitChannelConfigs && this.props.gitChannelConfigs ? (
            manageProjects
          ) : (
            <Empty
              image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
              imageStyle={{
                height: 60
              }}
              description={
                <span>
                  You are not subscribed to any notifications for this channel
                </span>
              }
            ></Empty>
          )}
           {(this.props.gitChannelConfigs.length === 0) && <Empty
                image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
                imageStyle={{
                  height: 60
                }}
                description={
                  <span>
                    You are not subscribed to any notifications for this channel
                  </span>
                }
              ></Empty> }
          <div style={{ width: "130px", margin: "0 auto" }}>
            <Button
              // disabled={!this.state.notifStatus}
              type="primary"
              className="btn_114 margin__right__button"
              onClick={this.openProjectModal}
            >
              Add Subscription
            </Button>
          </div>
        </Card> */}

          {this.state.openIssueModal && (
            <IssueModal
              subscription_data={this.state.currentSubscription}
              channelId={this.state.channel_id}
              channel_name={this.state.channel_name}
              skill={this.props.skill}
              setOption={this.props.setOption}
              showModal={this.state.openIssueModal}
              closeModal={this.closeModal}
              issueId={this.state.issueId}
              issueName={this.state.issueName}
            />
          )}
          {this.state.openprojectModal && (
            <ProjectModal
              subscription_data={this.state.currentSubscription}
              channelId={this.state.channel_id}
              channel_name={this.state.channel_name}
              skill={this.props.skill}
              setOption={this.props.setOption}
              showModal={this.state.openprojectModal}
              closeModal={this.closeModal}
              projectId={this.state.projectId}
              projectName={this.state.projectName}
            />
          )}
        </Row>
      </div>:
      <div>
      <Githubchannelpreferences
      // skillView={this.props.skillView}
      // skill={this.props.assistant_skills}
      {...this.props}
      workspace_id={this.props.match.params.wId}
    /></div>}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    gitChannelConfigs: state.skills.gitChannelConfigs,

    repos: state.github.repos,
    projects: state.github.projects,
    columns: state.github.columns,
    orgName : state.github.org_projects,
    personalChannelDefault: state.skills.personalChannelDefault,
    currentSkillUser: state.skills.currentSkillUser,
    assistant_skills: state.skills,
    channelDefault: state.skills
  };
};

export default withRouter(
  connect(mapStateToProps, {
    getAllGitHubChannelConfig,
    getRepos,
    getRepoProject,
    setDefaultChannel,
    getDefaultChannel,
    getOrganistaionProject,
    getAssisantSkills
  })(Subscriptions)
);
// export default withRouter(connect(mapStateToProps, { getProject,personalSetting,getAllGitHubChannelConfig,setGitHubChannelConfig,enableAndDisable })(GithubChannelNotification2));
