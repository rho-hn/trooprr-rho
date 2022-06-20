import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { setWorkspace } from "../../workspace/workspaceActions";
import ProjectItem from "./ProjectItem";
import leave_workspce_Icon from "../../../images/leave_icon.svg";
import { connect } from "react-redux";
import importProject from "../../../images/import.svg";
import { addProject, import_project, setProject,recentProjects, setLocalStorageProjects } from "../projectActions.js";
import {
  updateWorkspace,
  uploadWorkspaceLogo,
  leaveWorkspace
} from "../../workspace/workspaceActions";
import Validator from "validator";
import isEmpty from "lodash/isEmpty";
import {
  sendWorkspaceInvite,
  getWorkspaceMembers,
  getWorkspaceInvites,
  deleteWorkspaceMember,
  getWorkspaceShareUrl,
  generateWorkspaceShareUrl,
  deleteWorkspaceInvite
} from "../../workspace/members/workspaceMembershipActions";
import { setStatuses } from "../tasks/section/sectionActions";

import { setFiles } from "../files/filedAction";
import { setProjectProgressReports } from "../updates/projectProgressAction";
import DeleteModal from "../../common/confirmation-modal";
import WorkspaceShareModal from "./workspaceShareModal.js";
// import { getTasks } from "../tasks/task/taskActions";
// import { getStatuses } from "../tasks/section/sectionActions";

class WorkspaceItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      errors: {},
      color: "",
      icon: "",
      name: this.props.workspace.name,
      modal: false,
      leavemodal: false,
      invite_email: "",
      dropdownOpen: false,
      cleardata: false,
      newProjectId:'',
      isAdmin: this.props.workspace.role === 'admin' ? true : false
    };

    this.localStorageProjects = [];
    this.toggle = this.toggle.bind(this);
    this.onProjectClick = this.onProjectClick.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.updateWorkspace = this.updateWorkspace.bind(this);
    this.onChange = this.onChange.bind(this);

    this.dropdownToggle = this.dropdownToggle.bind(this);
    this.onWorkspaceClick = this.onWorkspaceClick.bind(this);
    this.importProject = this.importProject.bind(this);
    this.leavemodalToggle = this.leavemodalToggle.bind(this);
    this.onClearData = this.onClearData.bind(this);
    this.clearNewItem = this.clearNewItem.bind(this);
  }
  //import asana
  importProject(e) {
    e.preventDefault();

    //const{ import_Project_Others} = this.props;
    const {  chatClient } = this.props
  
    const formData = new FormData();
    const originalname = e.target.files[0].name;
    const file = e.target.files[0];
    formData.append('name', originalname)
    formData.append('file', file)
  

    this.props.import_project(this.props.workspace._id, formData).then((response) => {
      if (response.data.success) {

        

            this.setState({
              dropdownOpen: !this.state.dropdownOpen
            });




      } else {
        this.setState({ errors: response.data.errors });
      }
    });




  }
  dropdownToggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }
  leavemodalToggle() {
    this.setState({
      leavemodal: !this.state.leavemodal
    });
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
      cleardata: true
    });
  }
  clearNewItem(){
    this.setState({
      newProjectId:''
    });
  }

  onProjectClick(e, project) {
    if (e.target.nodeName !== "I") {
      const { setStatuses, setProjectProgressReports, setFiles } = this.props;
      this.props.setLocalStorageProjects(project._id);
      this.props.recentProjects(project._id,this.props.match.params.wId)
                .then(res =>{
                  
                  
                })
      const filter_value = project.filter_value;
      localStorage.setItem('filter_value',filter_value);
      if(filter_value){
        this.props.history.push("/project/" + project._id + "/tasks"+filter_value);
      }else{
        this.props.history.push("/project/" + project._id + "/tasks");
      }
      // this.props.history.push('/project/'+project._id);
    }
  }
  onWorkspaceClick(e) {
    const { setProjectProgressReports } = this.props;
    var updates = [];
    setProjectProgressReports(updates);
    this.props.history.push(
      "/workspace/" + this.props.workspace._id + "/manage/teamSync?option=analytics"
    );
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  isValid(data) {
    var errors = {};

    if (Validator.isEmpty(data.name)) {
      errors.name = "This field is required";
    }
    this.setState({ errors: errors });

    return isEmpty(errors);
  }
  updateWorkspace(e) {
    this.setState({ errors: {} });
    e.preventDefault();
    if (this.isValid(this.state)) {
      const { workspace, updateWorkspace } = this.props;
      var data = {
        name: this.state.name
      };
      var showStatus = "";
      if (this.props.location.pathname === "/projects/privatePicker") {
        showStatus = "private";
      } else {
        showStatus = "public";
      }
      updateWorkspace(workspace._id, showStatus, data).then(res => {
        if (res.data.success) {
        }
        this.setState({
          dropdownOpen: !this.state.dropdownOpen
        });
      });
    }
  }

  onSubmit() {
    this.setState({ errors: {} });
    const { chatClient, addProject, projects,} = this.props;
    var data = {
      name: "Project " + (projects.length + 1)
    };

    addProject(this.props.workspace._id, data).then(response => {
      if (response.data.success) {
         this.setState({
          newProjectId:response.data.project._id
         })
      } else {
        this.setState({ errors: response.data.errors });
      }
    });
  }
 


  onClearData() {
    this.setState({ cleardata: false });
  }
componentWillMount(){
}
  // componentWillMount(){
  //   const { getWorkspaceMembers, workspace, workspaceMembers } = this.props;
  //   getWorkspaceMembers(workspace._id).then(res => {
  //     const { members } = res.data;
  //     for (let i = 0; i < members.length; i++) {
  //       if (
  //         members[i].user_id &&
  //         this.props.currentUser._id === members[i].user_id._id &&
  //         members[i].role === "admin"
  //       ) {
  //         this.setState({ isAdmin: true });
  //       }
  //     }
  //   });
    
  // }

  render() {
    const {
      workspaceShareUrl,
      getWorkspaceShareUrl,
      generateWorkspaceShareUrl,
      isPrivate,
      workspace,
      projects,
      getWorkspaceMembers,
      getWorkspaceInvites,
      deleteWorkspaceInvite,
      deleteWorkspaceMember,
      leaveWorkspace,
      members,
      invites,
      onSearch,
      searchProj
    } = this.props;

    const { errors,newProjectId } = this.state;
    return (
      <div>
        {!onSearch || searchProj === "" || projects.length > 0 ? (
          <div className="d-flex flex-column workspace_item_conatiner">
            <div className="d-flex justify-content-start align-items-center worskpace_action_box">
              <div className="workspace_item_name">
                {workspace.name}
              </div>

              <div className="d-flex align-items-center">
                <div
                  className="workspace_invite_btn d-flex align-items-center justify-content-center"
                  onClick={() => {
                    this.toggle();
                    getWorkspaceMembers(workspace._id);
                    getWorkspaceInvites(workspace._id);
                  }}
                >
                  <i
                    style={{ fontSize: "17px", marginRight: "4px" }}
                    className="material-icons"
                  >
                    person_add
                  </i>
                  <div>INVITE</div>
                </div>
                {this.state.isAdmin && <div onClick={this.onWorkspaceClick} className='project_picker_manage_button d-flex align-items-center'>
                <div>Manage</div>
                <i className=" project_picker_manage_icon material-icons">arrow_right_alt</i>
              </div>}
              </div>
            </div>
            <div className="row">
              {projects.map((project, index) => (
                <ProjectItem
                  key={project._id}
                  projectEmailSettingModal={this.props.projectEmailSettingModal}
                  workspaceName={workspace.name}
                  project={project}
                  onClick={e => this.onProjectClick(e, project)}
                  newItem={this.state.newProjectId}
                  clearNewItem={this.clearNewItem}
                />
              ))}
              {!onSearch || searchProj === "" ? (
                <div className="col-3">
                  <div
                    className="d-flex col-12 add_project_btn align-items-center justify-content-center"
                    onClick={this.onSubmit}
                  >
                    + Add new Project.
                  </div>
                </div>
              ) : null}
            </div>

            <DeleteModal
              toggle={this.leavemodalToggle}
              modal={this.state.leavemodal}
              name={workspace.name}
              Delete={"Workspace"}
              test={() => leaveWorkspace(workspace._id)}
            />
            {this.state.modal && <WorkspaceShareModal
              workspace={workspace}
              onClearData={this.onClearData}
              modal={this.state.modal}
              toggle={this.toggle}
              cleardata={this.state.cleardata}
              isAdmin = { this.state.isAdmin }
            />}
          </div>
        ) : (
          <div>
            <div className="d-flex flex-wrap justify-content-between">
              {projects.map((project, index) => (
                
                  <ProjectItem
                  key={project._id}
                  projectEmailSettingModal={this.props.projectEmailSettingModal}
                  workspaceName={workspace.name}
                  project={project}
                  onClick={e => this.onProjectClick(e, project)}
                  newItem={this.state.newProjectId}
                  clearNewItem={this.clearNewItem}
                /> 
              ))}
              {!onSearch || searchProj === "" ? (
                <div
                  className="d-flex add_project_btn align-items-center justify-content-center"
                  onClick={this.onSubmit}
                >
                  + Add new Project.
                </div>
              ) : null}
            </div>
            <DeleteModal
              toggle={this.leavemodalToggle}
              modal={this.state.leavemodal}
              name={workspace.name}
              Delete={"Workspace"}
              test={() => leaveWorkspace(workspace._id)}
            />
            {this.state.modal && <WorkspaceShareModal
              workspace={workspace}
              cleardata={this.state.cleardata}
              modal={this.state.modal}
              toggle={this.toggle}
            />}
          </div>
        )}
      </div>
    );
  }
}

WorkspaceItem.propTypes = {
  workspace: PropTypes.object.isRequired,
  projects: PropTypes.array.isRequired,
  project: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  addProject: PropTypes.func.isRequired,
  sendWorkspaceInvite: PropTypes.func.isRequired,
  getWorkspaceMembers: PropTypes.func.isRequired,
  getWorkspaceInvites: PropTypes.func.isRequired,
  setWorkspace: PropTypes.func.isRequired,
  updateWorkspace: PropTypes.func.isRequired,
  leaveWorkspace: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    chatClient: state.sidebar.chatClient,
    currentUser: state.common_reducer.user,
    workspaceMembers: state.common_reducerMembership.members,
    project: state.projects.project
  };
}
export default withRouter(
  connect(
    mapStateToProps,
    {
      setProjectProgressReports,
      setProject,
      import_project,
      setStatuses,
      sendWorkspaceInvite,
      getWorkspaceMembers,
      getWorkspaceShareUrl,
      generateWorkspaceShareUrl,
      getWorkspaceInvites,
      setWorkspace,
      addProject,
      deleteWorkspaceMember,
      updateWorkspace,
      leaveWorkspace,
      deleteWorkspaceInvite,
      recentProjects,
      setFiles,
      setLocalStorageProjects
    }
  )(WorkspaceItem)
);
