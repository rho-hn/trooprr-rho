import React, { Component } from "react";
import {
  setDefaultChannel,
  getDefaultChannel,
  personalSetting,
  unlinkGitUser,
  getGitHubUserConfig,
  setGitHubUserChannelConfig,
  getMappedUser,
  deleteUserConfig
} from "../skills_action";
import {
  getRepos,
  getOrganistaionProject,
  getRepoProject
} from "../github/gitHubAction";
import { connect } from "react-redux";
import GithubPersonalNotification from "./github_personal_notification";
import { withRouter } from "react-router-dom";
import { SettingOutlined } from '@ant-design/icons';
import { Button, Select, Dropdown, Menu, Modal, Card, message, Row, Col, Alert, Layout, Typography } from "antd";
const { Option } = Select;
const { Content } = Layout;
const { Paragraph, Text } = Typography;

class GithubPersonalPreference extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channels: [],
      repos: [],
      projects: [],
      defaultRepos: "",
      defaultProjects: [],
      skillsToggle: false,
      notificationToggle: false,
      personalNotifToggle: false,
      preference: "channel",
      selectedChannel: "",
      selectedProject: "",
      currentSkill: this.props.match.params.skill_id,
      linkedProject: null,
      linkedIssue: null,
      personalProject: "",
      personalIssue: "",
      personalChannelId: "",
      edit: false,
      error: {},
      unlinkGithubAccount: false,
      dropdownOpen: false,
      setFieldValueField: "",
      setFieldInputField: "",
      enableProject: true,
      defaultProjectsObject: [],
      defaultReposName: "",
      globalProjects: [],
      orgProjects: [],
      loading:false
    };

    this.onClickPersonalNotificationToggle = this.onClickPersonalNotificationToggle.bind(
      this
    );
    // this.openEditState = this.openEditState.bind(this);
    // this.onCancel = this.onCancel.bind(this);
    this.onClickSave = this.onClickSave.bind(this);
    this.onChangeProjects = this.onChangeProjects.bind(this);
  }

  componentDidMount() {
    //this.props.getRepos(this.props.match.params.skill_id);
    // console.log("sss");
    this.props.getRepos(this.props.match.params.wId);
    var UserID = localStorage.trooprUserId;
    let skillId = this.props.match.params.skill_id;

    this.props.personalSetting(this.props.workspace_id, UserID).then(res => {
      // console.log("res--->", res);
      if (res.data.success) {
        this.props.getMappedUser(skillId, UserID).then(res1 => {
          // console.log("res===>", res1);
          if (res1.data.success) {
            this.props
              .getGitHubUserConfig(
                this.props.match.params.wId,
                this.props.match.params.skill_id,
                res.data.channel.id
              )
              .then(data => {
                // console.log("data==>",data)
                // console.log("ffffff this skill props",data.data);
                if (data.data.data && data.data.data.channel_id) {
                  // console.log("ffffff this skill props configurations already there")
                } else {
                  // console.log("ffffff this skill props configurations not  there")

                  let data = {
                    user_id: UserID,
                    workspace_id: this.props.match.params.wId,
                    channel_id: res.data.channel.id,
                    status: true,
                    event_type: ["update_pr", "update_issue", "git_mention"],
                    is_bot_channel: true,
                    frequency: 1,
                    skill_id: this.props.match.params.skill_id
                  };
                  this.props.setGitHubUserChannelConfig(
                    this.props.match.params.wId,
                    this.props.match.params.skill_id,
                    data
                  );
                }
              });
          }
        });

        this.setState({ personalChannelId: res.data.channel.id });
        this.props
          .getDefaultChannel(
            this.props.match.params.skill_id,
            res.data.channel.id,
            "personal"
          )
          .then(res => {
            if (res.data.success) {
              if (res.data && res.data.link_info) {
                // console.log("this.state===",res.data)
              
                // res.data.link_info.link_info.projects.forEach(d => {
                //   projects.push(d.projectId);
                // });
                let joinedProjectName = res.data.link_info.link_info.projects[0].orgProjName+"/"+res.data.link_info.link_info.projects[0].projectName
                // console.log("joinedProjectName",joinedProjectName);
                res.data.link_info.link_info.projects[0].projectName = joinedProjectName
                delete  res.data.link_info.link_info.projects[0].orgProjName;
                // console.log(" res.data.link_info.link_info.projects[0]", res.data.link_info.link_info.projects[0])

                this.setState({
                  defaultRepos: res.data.link_info.link_info.repos,
                  defaultProjects: joinedProjectName,
                  defaultProjectsObject: res.data.link_info.link_info.projects[0],
                  defaultReposName: res.data.link_info.link_info.reposName,
                  enableProject: false
                });

                this.props
                  .getRepoProject(
                    this.props.match.params.wId,
                    res.data.link_info.link_info.repos
                  )
                  .then(repoProject => {
                    // console.log("repoProject==>",repoProject);
                    if (repoProject.data.success) {
                      this.props
                        .getOrganistaionProject(this.props.match.params.wId)
                        .then(orgProject => {
                          if (orgProject.data.success) {
                            // let repoProjects =  repoProject.data.projects.map(data1=>{
                            //   data1.name = `${res.data.link_info.link_info.reposName} / ${data1.name}`;
                            //   return data1
                            // })
                  
                            let globalProjects = repoProject.data.projects.concat(
                              orgProject.data.projects
                            );
                            // console.log("globcal==>",f);
                            this.setState({
                              globalProjects: globalProjects,
                              orgProjects: orgProject.data.projects
                            });
                          }
                        });
                    }
                  });
              }
            }
          });
      }
    });
  }

  goToUserGithubLogin = () => {
    // console.log(process.env);
    window.open(
      "https://github.com/apps/" +
        process.env.REACT_APP_GitHubApp +
        "/installations/new?state=" +
        this.props.match.params.wId,
      "_blank"
    );
    // window.open("https://github.com/apps/test-troopr1/installations/new?state="+this.props.match.params.wId , '_blank') ;

    /*this.props.history.push("/workspace/"+this.props.workspace_id+"/jira_user_oauth/"+this.props.skill._id)*/
  };

  unlinkGithubAccountToggle = () => {
    this.setState({ unlinkGithubAccount: !this.state.unlinkGithubAccount });
  };

  logOutSkillUser() {
    this.props
      .unlinkGitUser(this.props.workspace_id, this.props.match.params.skill_id,localStorage.trooprUserId)
      .then(res => {
        this.setState({ unlinkGithubAccount: !this.state.unlinkGithubAccount },()=>{
          this.props.deleteUserConfig(
            this.props.match.params.wId,
            this.props.match.params.skill_id,
            this.state.personalChannelId
          );
        });
        
      });
  }

  dropdownToggle = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  onChangeProjects = (event, data) => {
    // console.log("event",event,"value",data)
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

  onClickPersonalNotificationToggle = () => {
    this.setState({
      personalNotifToggle: !this.state.personalNotifToggle,
      error: {}
    });
  };

  onChangeRepos = (event, data) => {
    // this.setState({ defaultRepos: event, defaultProjects: "" });
    // // console.log("project valueeeeee",this.state.selectedProject);
    // this.props.getRepoProject(this.props.match.params.wId, event);
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
    this.props
      .getRepoProject(this.props.match.params.wId, event)
      .then(repoProject => {
        // console.log("repoProject==>",repoProject);
        if (repoProject.data.success) {
          let globalProjects;
          if(this.state.orgProjects.length > 0){
            globalProjects = repoProject.data.projects.concat(this.state.orgProjects);
           // console.log("globcal==>",f);
           this.setState({
            globalProjects: globalProjects
          });
         }else{
           this.props.getOrganistaionProject(this.props.match.params.wId).then(orgProject=>{
             if(orgProject.data.success){
                globalProjects = repoProject.data.projects.concat(orgProject.data.projects);
                this.setState({
                  globalProjects: globalProjects
                });
             }
           })
         }
          // console.log("repoProject.data.projects",repoProject.data.projects);
        //  let repoProjects =  repoProject.data.projects.map(data1=>{
        //     data1.name = `${data.props.children} / ${data1.name}`;
        //     return data1
        //   })

          // let globalProjects = repoProject.data.projects.concat(
          //   this.state.orgProjects
          // );
          // console.log("globcal==>",f);
        
        }
      });
  };

  // openEditState = () => {
  //   this.setState({ edit: true });
  // };

  // onCancel = () => {
  //   var defaultProjects = '';
  //   var defaultRepos = '';
  //   if (this.props.personalChannelDefault.link_info) {
  //     if (this.props.personalChannelDefault.link_info.repos) {
  //       defaultRepos = this.props.personalChannelDefault.link_info.repos;
  //       this.props.getRepoProject(
  //         this.props.match.params.wId,
  //         defaultRepos
  //       );
  //     }
  //     if (this.props.personalChannelDefault.link_info.projects) {
  //       defaultProjects = this.props.personalChannelDefault.link_info.projects;
  //     }
  //     this.setState({
  //       edit: false,
  //       defaultRepos: defaultRepos,
  //       defaultProjects: defaultProjects,
  //       error: {}
  //     });
  //   }
  // };

  onClickSave = () => {
    this.setState({loading:true})
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
  
  
      data.channel_id = this.state.personalChannelId;
      data.updated_by = localStorage.trooprUserId;
      data.skill_id = this.props.match.params.skill_id;
      }
    
    
    // console.log("====>",data.link_info.projects)
    if (
      // data.link_info.projects &&
      // data.link_info.repos &&
      // data.channel_id &&
      // localStorage.trooprUserId
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


            // console.log("resdd--->", res.data);
            
            // res.data.link_info.link_info.projects.forEach(d => {
            //   projects.push(d.projectId);
            // });
            this.setState({
              defaultRepos: res.data.link_info.link_info.repos,
              defaultProjects: joinedProjectName,
              defaultProjectsObject: res.data.link_info.link_info.projects[0],
              edit: false,
              error: {}
            });
            this.setState({loading:false})
            message.success("Saved successfully");
          }
        });
    } else {
      // if (!this.state.defaultRepos) {
      //   error.defaultRepos = "No Repo selected";
      // } else if (!this.state.defaultProjects) {
      //   error.defaultProjects = "No Project selected";
      // }
      // this.setState({ error: error });
      if (this.state.defaultRepos === "") {
        this.setState({loading:false})
        message.error("No Repos selected");
      } else  {
        this.setState({loading:false})
        message.error("No Project selected");

        // error.defaultProjects = "No Project selected";
      }
    }
  };

  menus = () => {
    return (
      <Menu>
        <Menu.Item onClick={this.goToUserGithubLogin}>
          Change Github Account
        </Menu.Item>
        <Menu.Item danger onClick={this.unlinkGithubAccountToggle}>
          Unlink Github Account
        </Menu.Item>
      </Menu>
    );
  };

  toggleSetFieldValue = () => {
    this.setState({ setFieldValueModal: !this.state.setFieldValueModal });
  };

  toggleSetFieldValueCancel = () => {
    this.setState({
      setFieldValueField: "",
      setFieldInputField: "",
      setFieldValueModal: !this.state.setFieldValueModal
    });
  };

  toggleSetFieldValueOk = () => {
    this.setState({ setFieldValueModal: !this.state.setFieldValueModal });
  };

  setFieldFieldValue = event => {
    this.setState({ setFieldValueField: event });
  };

  setFieldInputValue = event => {
    this.setState({ setFieldInputField: event.target.value });
  };

  render() {
    const {skill, currentSkillUser } = this.props;
    let domainName 
    // console.log("skill--->",this.props.skill)
    if( skill && skill.skill_metadata ? skill.skill_metadata.linked : skill.linked){
      domainName = skill && skill.skill_metadata ? skill.skill_metadata.metadata.installationInfo.account.login : skill.metadata.installationInfo.account.login
   
    }
// if(this.state.globalProjects.length > 0){
//   console.log("this.state.globalProjects",this.state.globalProjects);
//   console.log("this.state.globalProjects - defaultprojects,",this.state.defaultProjects);
//   console.log("this.state.globalProjects - defaultobjectProjects",this.state.defaultProjectsObject)

// }
   
    return (
      <Content style={{ padding: "16px 16px 32px 24px", overflow: "scroll", marginLeft:0 }}>
      <Row className='content_row' gutter={[0, 16]}>
        {(skill && skill.skill_metadata
          ? skill.skill_metadata.linked
          : skill.linked) &&
        currentSkillUser &&
        currentSkillUser._id ? (
          <Col span={24}>
            <Card
            size='small'
              title="My Account"
              extra={
                <Dropdown overlay={this.menus()} trigger={["hover"]}>
                  {/* <Button>
                    {currentSkillUser.user_obj.login} <DownOutlined />
                  </Button> */}
                  <Button
                  // size="small"
                  type="link"
                  icon={<SettingOutlined />}
                />
                </Dropdown>
              }
            >
              <Paragraph type='secondary'>You are logged in as {currentSkillUser.user_obj.login}</Paragraph>
            </Card>
          </Col>
        ) : (
          <Col span={24}>
            <Card
            size='small'
              title="My Account"
              extra={
                <Button type="primary" onClick={this.goToUserGithubLogin}>
                  Link Account
                </Button>
              }
            ><Alert
            message= {"Link a user account that is a member of the org account: "+ domainName}
            type="success"
          />
              <Paragraph type='secondary' style={{marginTop:"20px"}}>Authenticate with your Github user account.</Paragraph>
            </Card>
          </Col>
        )}
        {(skill && skill.skill_metadata
          ? skill.skill_metadata.linked
          : skill.linked) &&
          currentSkillUser &&
          currentSkillUser._id && (
            <>
              <Col span={24}>
                <GithubPersonalNotification />
              </Col>
              <Col span={24}>
                <Card size='small' title="Personal Defaults">
                  <Paragraph type='secondary' className="Github_preference_tag_second_issue">
                    These values will be used in the Bot Channel (DM with Troopr
                    Assistant) when creating Github issues.
                  </Paragraph>

                  {/*---------------------------------Default repos----------------------------------------*/}
                  <div
                    className={
                      (this.state.edit ? "" : "Preference_disable_state"
                      // "bottom_space_forms"
                      )
                    }
                  >
                    <Text type='secondary'>
                      Default Repository
                    </Text><br/>
                      <Select
                        // placeholder="Select Repo"
                        name="defaultRepos"
                        style={{ width: 200 }}
                        value={this.state.defaultRepos}
                        onChange={(value, data) =>
                          this.onChangeRepos(value, data)
                        }
                        showSearch={true}
                        //  disabled={!this.state.edit}
                      >
                        {this.props.repos &&
                          this.props.repos.map((repo, index) => (
                            <Option key={repo.id} value={repo.id}>
                              {repo.name}
                            </Option>
                          ))}
                      </Select>
                    {this.state.error.defaultRepos && (
                      <div className="error_message">
                        {this.state.error.defaultRepos}
                      </div>
                    )}
                  </div>

                  {/*---------------------------------Default Projects----------------------------------*/}

                  <div
                    // className={
                    //   (this.state.edit ? "" : "Preference_disable_state",
                    //   "bottom_space_forms")
                    // }
                  >
                    <Text type='secondary' >
                      Default project
                    </Text><br/>
                      <Select
                        autoClearSearchValue
                        // mode="multiple"
                        name="defaultProjects"
                        style={{ width: 200 }}
                        value={this.state.defaultProjects}
                        showSearch={true}
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
                    {this.state.error.defaultProjects && (
                      <div className="error_message">
                        {this.state.error.defaultProjects}
                      </div>
                    )}
                  </div>

                  {/*----------------------------------------Buttons----------------------------------------*/}
                  {/* {this.state.edit ? */}
                  <div className="d-flex">
                    {/* <Button type="primary"  className=" btn_114 margin__right__button" onClick={this.onCancel}>Cancel</Button> */}
                    <Button
                      type="primary"
                      className="btn_114 margin__right__button"
                      loading={this.state.loading}
                      onClick={this.onClickSave}
                    >
                      Save
                    </Button>
                  </div>
                  {/* : <Button type="primary"  className=" btn_114 margin__right__button_edit" onClick={this.openEditState}>Edit</Button> */}
                  {/* } */}
                </Card>
              </Col>
            </>
          )}

        <Modal
          title="Unlink Github Account"
          visible={this.state.unlinkGithubAccount}
          onCancel={this.unlinkGithubAccountToggle}
          onOk={() => this.logOutSkillUser()}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <br></br>
            <p>Are you sure you want to unlink the Github account </p>
            <p>
              '{" "}
              {currentSkillUser && currentSkillUser._id
                ? currentSkillUser.user_obj.login
                : ""}
              ' ?
            </p>
          </div>
        </Modal>
      </Row>
      </Content>
    );
  }
}

const mapStateToProps = state => {
  return {
    // user: state.common_reducer.user,
    repos: state.github.repos,
    projects: state.github.projects,
    columns: state.github.columns,

    personalChannelDefault: state.skills.personalChannelDefault,
    currentSkillUser: state.skills.currentSkillUser,
    assistant_skills: state.skills,
    channelDefault: state.skills
  };
};

export default withRouter(
  connect(mapStateToProps, {
    setDefaultChannel,
    getDefaultChannel,
    personalSetting,
    unlinkGitUser,
    getRepos,
    getOrganistaionProject,
    getRepoProject,
    getGitHubUserConfig,
    setGitHubUserChannelConfig,
    getMappedUser,
    deleteUserConfig
  })(GithubPersonalPreference)
);
