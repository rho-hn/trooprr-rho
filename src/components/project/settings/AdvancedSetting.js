import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// import 
import { updateProjectUserEmailTaskSetting, moveProject, leaveProject, deleteProject, updateProject, getProjects, sendDeleteProjectToaster } from "../projectActions";
// import {  updateUserWorkspacePreferences, } from '../../workspace/workspaceActions';
// import { getTasks } from '../../myspace/tasks/mytaskActions.js';

import customToast from "../../common/customToaster";
import { ToastContainer, toast } from "react-toastify";
import { CopyOutlined } from '@ant-design/icons';
import { Card, Button, Input, Select, Alert, Modal, notification } from 'antd';



const CloseButton = ({ closeToast }) => (
  <span className="close-toaster-text" onClick={closeToast}>
    DISMISS
  </span>
);
const { Option } = Select;

class AdvancedSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      section_id: "",
      position: "",
      workspace: '',
      leave_project_modal: false,
      delete_project_modal: false,
      archive_project_modal: false,
      move_project_modal: false
    }
    this.onChange = this.onChange.bind(this);
    this.updateEmailProjectTaskSettingEmail = this.updateEmailProjectTaskSettingEmail.bind(this);
    this.copyProjectTaskEmail = this.copyProjectTaskEmail.bind(this);
    this.projectMove = this.projectMove.bind(this);
    this.onWorksapceChange = this.onWorksapceChange.bind(this);
    this.leave_project = this.leave_project.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
    this.archiveProject = this.archiveProject.bind(this);
    this.archiveModalToggle = this.archiveModalToggle.bind(this);
    this.deleteModalToggle = this.deleteModalToggle.bind(this);
    this.leaveModalToggle = this.leaveModalToggle.bind(this);
  }


  leaveModalToggle() {
    let projectMemebers = this.props.projectMembership.members.length;
    // console.log("projectMemebers=====>",projectMemebers)
    if (projectMemebers > 1) {
      // console.log("this ewas clicked");
      this.setState({ leave_project_modal: !this.state.leave_project_modal })

    }
    else {
      // console.log(this.props.projectMembership.members.length);
      // this.props.notAllowleaveProject();
      {
        // customToast.projectNotLeave("Please delete the project as your are the only member", {
        //   className:
        //     "some-toast-box d-flex justify-content-between align-items-center"
        // })
        notification.warning({
          message: "Please delete the project as your are the only member",
          placement:'bottomLeft',
          duration:3
        })

      }
    }
    // this.setState({leave_project_modal:!this.state.leave_project_modal})
  }


  deleteModalToggle() {
    this.setState({ delete_project_modal: !this.state.delete_project_modal })
  }

  archiveModalToggle() {
    this.setState({ archive_project_modal: !this.state.archive_project_modal })
  }

  moveModalToggle = () => {
    this.setState({ move_project_modal: !this.state.move_project_modal });
  }


  copyProjectTaskEmail() {

    var copyText = document.getElementById("project-task-email-id-2");
    copyText.select();
    document.execCommand("Copy");

  }


  onWorksapceChange(e) {
    this.setState({ workspace: e });
  }



  leave_project() {
    const { leaveProject, project } = this.props;
    leaveProject(project._id,this.props.match.params.wId).then(res => {
      if (res.data.success) {
        this.setState({ leave_project_modal: false });
        const workspace_id = localStorage.getItem('userCurrentWorkspaceId')
        this.props.history.push('/workspace/' + workspace_id + '/myspace/tasks')
      }
    })
  }



  deleteProject() {
    const { project } = this.props;
    this.props.deleteProject(project._id,this.props.match.params.wId).then(res => {
      if (res.data.success) {
        this.setState({ delete_project_modal: false });
        const workspace_id = localStorage.getItem('userCurrentWorkspaceId')
        this.props.history.push('/workspace/' + workspace_id + '/myspace/tasks')
      }
      else {
        this.props.sendDeleteProjectToaster();
        {
          customToast.projectNotDeleted("Please delete or archive tasks to delete the project", {
            className:
              "some-toast-box d-flex justify-content-between align-items-center"
          })
        }
      }

    });
  }



  archiveProject() {
    const { updateProject, project } = this.props;
    const data = { availability: "archived" }
    updateProject(project._id, data,this.props.match.params.wId).then(res => {
      if (res.data.success) {
        this.setState({
          archive_project_modal: false
        });
        this.props.history.push('/myspace/tasks');
      }
    });
  }

  componentDidMount = () => {
    // console.log("componentDId moynrg==========>");
    this.updateEmailProjectTaskSettingEmail();
  }


  componentWillReceiveProps(nextProps) {
    // This will erase any local state updates!
    // Do not do this.
    this.setState({ section_id: nextProps.setting.status, position: nextProps.setting.position })
  }




  updateEmailProjectTaskSettingEmail() {
    var data = {
      email: true,
      project_id: this.props.project._id
    }
    this.props.updateProjectUserEmailTaskSetting(this.props.setting.project_id, this.props.setting._id, data,this.props.match.params.wId)

  }



  onChange(e) {
    // console.log("e==", e.target.value)
    this.setState({ [e.target.name]: e.target.value })
    var data = {
      [e.target.name]: e.target.value
    }
    this.props.updateProjectUserEmailTaskSetting(this.props.setting.project_id, this.props.setting._id, data,this.props.match.params.wId)
    // console.log("e2==", this.props.setting.project_id, this.props.setting._id, data)
  }

  // onChange(e) {
  //   this.setState({ [e]: e })
  //   // var data = {
  //   //   [e.target.name]: e.target.value
  //   // }
  //   this.props.updateProjectUserEmailTaskSetting(this.props.setting.project_id, this.props.setting._id, e)
  // }



  projectMove() {
    var data = {};
    const { workspace } = this.state;
    const {  getProjects, project } = this.props;
    data.workspace_id = workspace;
    if (this.props.project.workspace_id._id !== data.workspace_id) {
      this.props.moveProject(this.props.project._id, data)
        .then(res => {
          //this.setState({workspace:res.data.setting._id})
          // this.props.updateUserWorkspacePreferences(workspace)
          if (res.data.success) {
            // getWorkspace(workspace);
            // getWorkspaceProject(workspace);
            getProjects(workspace);
            // this.props.getUsersSelectedTeamSync(workspace);
            // getTasks(workspace).then(res => {
            //   if (res.data.success) {
            //     this.props.history.push("/workspace/" + workspace + "/project/" + project._id + "/tasks");
            //   }
            // });

            this.setState({ dropdownOpen: false });
          }


         })
    }
  }






  componentDidMount() {
    const { setting, workspace } = this.props;
    const { project } = this.props;
    if (setting.position) {
      this.setState({ position: setting.position });
    }
    if (setting.status) {
      this.setState({ section_id: setting.status });
    }
    this.setState({ workspace: workspace._id })

  }



  render() {
    const { project, setting, sections, workspaces, workspace, membership, projectNotDelete, projectMembership, 
      // leavingproject 
    } = this.props;
    //  console.log("workspace======>0",workspace);
    //  console.log("project======>0",project);
    //  console.log("workspaceMemberships======>0",projectMembership.members.length);

    return (
      <div className="d-flex flex-column ">
        {/* <div className="d-flex align-items-center project-setting-basic-details-header">
           Advanced Settings
        </div> */}
        {/* {(projectNotDelete || leavingproject) && (
          <ToastContainer
            closeButton={<CloseButton />}
            hideProgressBar
            position="bottom-left"
            preventDuplicates={false}
          />
        )} */}
        <Card title="Email Forwarding">
          <div >
            <div classnames="">Your email address for this project</div>
            <div className="d-flex align-items-center justify-content-between" style={{ marginTop: '20px' }}>
              <Input id="project-task-email-id-2" value={setting.email} suffix={<CopyOutlined style={{fontSize:"20px"}} onClick={this.copyProjectTaskEmail} />} name="copy_projectTaskEmail" readOnly />
            </div>
            <div className="email-forwarding-new-email-link proj-setting-common-pointer" style={{ marginTop: '10px' }} onClick={this.updateEmailProjectTaskSettingEmail}>Generate new email address</div>
          </div>
          <div style={{ marginTop: '20px' }}>Emailed Task will appear in :</div>
          <div className="email-forwarding-section-position d-flex justify-content-between">
            <div className="d-flex flex-column common-project-edit-task-option">
              <div className="proj-adv-select-sec">List</div>
              <div className='d-flex align-items-center justify-content-between proj-setting-common-pointer select_options_wrapper project-setting-select-wraper'>
                <select name="section_id" className="form-control custom-select" value={this.state.status} onChange={this.onChange}>
                  <option value='' >Select list</option>
                  {sections.map((section, index) => (
                    <option key={section._id} value={section._id}>{section.name}</option>
                  ))}
                </select>

                {/* <Select name="section_id" className="form-control custom-select" value={this.state.status} onChange={(value,data) => {this.onChange(value,data)}}>
                  <Option value=''>Select list</Option>
                  { sections.map((section, index) => (
                     <Option key={section._id} value={section._id}>{section.name}</Option>
                     ))}
                  </Select> */}

              </div>

            </div>
            <div className="d-flex flex-column common-project-edit-task-option">
              <div className="proj-adv-select-sec">Position</div>
              <div className='d-flex align-items-center justify-content-between proj-setting-common-pointer select_options_wrapper project-setting-select-wraper'>

                <select
                  name="position"
                  className="form-control custom-select"
                  value={this.state.position}
                  onChange={this.onChange}
                >
                  <option value='' >Select top or bottom</option>
                  <option value="top">
                    Top
               </option>
                  <option value="bottom">
                    Bottom
               </option>
                </select>
              </div>
              {/* <Select
              name="position"
              value="Select Top or Bottom"
              onChange={this.onChange}
              
              >
                <Option value=''>Select top or Bottom</Option>
                <Option value="top">Top</Option>
                <Option value="bottom">Bottom</Option>
              </Select> */}
              
            </div>
          </div>
        </Card>

        <Card title="Move Project" style={{ margin: '16px 0px' }}>
          <div>
            <div className="">Select Destination Workspace</div>
            <div className="d-flex justify-content-between project-setting-select-workspace-box align-items-center">
              <div className='d-flex align-items-center justify-content-between' style={{width:"85%"}}>
                <Select name="workspace" className="form-control custom-select" value={this.state.common_reducer} onChange={this.onWorksapceChange}>
                  <Option value='' >Select a workspace</Option>
                  {workspaces.map((workspace, index) => (
                    <Option key={workspace._id} value={workspace._id}>
                      {workspace.name}
                    </Option>
                  ))}
                </Select>
              </div>
              <Button style={{marginBottom:'6.75px'}} onClick={this.moveModalToggle}>Move Project</Button>
            </div>
            <div className="">
            <Alert classname="align-items-center" style={{width:"100%"}} message="Project members who are not members of Destination workspace will not be able to see the project" type="warning" showIcon />
            </div>
          </div>
        </Card>
        <div className="advanced-setting-danger-zone">Danger Zone</div>
        <div className="danger-zone-block-project">

          <Card title="Membership">
            <div className="d-flex  flex-column">
              <div className="project-membership-joining-date">You are member since : {membership}</div>
            </div>
            <div className="d-flex  flex-column  align-items-end">
              <Button type='danger' className="  proj-setting-common-pointer btn_114  " onClick={this.leaveModalToggle} >Leave</Button>
            </div>
          </Card>





          {/*<div className="danger-zone-item project-setting-leave-project-container">
        <div className="project-leave-setting-header">Membership</div>
        <div className="d-flex justify-content-between  project-setting-leave-project-option">
          <div className="project-membership-joining-date">You are member since : {membership}</div>
          <div className="leave-project-button-set proj-setting-common-pointer" onClick={this.leave_project}>Leave Project</div>
        </div>
        </div>*/}

          {/* <div className="d-flex danger-zone-item justify-content-between align-items-center danger-zone-item-archive-project">
          <div className="d-flex  flex-column ">
           <div className="danger-zone-item-header">Archive Project</div>
            <div className="project-membership-joining-date">Mark this project as archived and read-only.</div>
          </div>
           <div className="danger_secondary_btn proj-setting-common-pointer btn_114" onClick={this.archiveModalToggle}>Archive</div>
       </div>*/}
          <Card title="Delete Project" style={{ marginTop: '16px', marginBottom:'25px' }}>
            <div className="d-flex  flex-column ">
              <div className="project-membership-joining-date">Once you delete a project, there is no going back.</div>
            </div>
            <div className="d-flex  flex-column align-items-end">
              <Button type="danger" className="danger_secondary_btn proj-setting-common-pointer  btn_114" onClick={this.deleteModalToggle}>Delete</Button>
            </div>
          </Card>
        </div>
        {/* <DeleteModal
          modal={this.state.leave_project_modal}
          toggle={this.leaveModalToggle}
          Task="leave"
          Button="Leave"
          data="Project"
          name={project.name}
          test={() => this.leave_project()}
        />
        <DeleteModal
          modal={this.state.delete_project_modal}
          toggle={this.deleteModalToggle}
          Button="Delete"
          Task="delete"
          data="Project"
          name={project.name}
          test={() => this.deleteProject()}
        />
        <DeleteModal
          modal={this.state.move_project_modal}
          toggle={this.moveModalToggle}
          Task="move"
          data="Project"
          name={project.name}
          test={() => this.projectMove()}
          Button="Move"
        />
        <ArchiveTaskConfirmModal
          modal={this.state.archive_project_modal}
          toggle={this.archiveModalToggle}
          Task="archive"
          data="Project"
          name={project.name}
          test={() => this.archiveProject()}
        /> */}
 {/* Delete Project Modal start*/}
          <Modal
          visible={this.state.delete_project_modal}
          onOk={() => this.deleteProject()}
          onCancel={this.deleteModalToggle}
          okText="Delete"
          keyboard
        >
          <h5>Are you sure you want to delete the Project</h5>
          <h5>'{project.name}'?</h5>
        </Modal>
{/* Delete Project Modal end*/}

{/* Move project modal start */}
        <Modal
          visible={this.state.move_project_modal}
          onOk={() => this.projectMove()}
          onCancel={this.moveModalToggle}
          okText="Move"
          keyboard
        >
          <h5>Are you sure you want to move the Project</h5>
          <h5>'{project.name}'?</h5>
        </Modal>
{/* move projct modal end */}

{/* leave project modal start */}
        <Modal
          visible={this.state.leave_project_modal}
          onOk={() => this.leave_project()}
          onCancel={this.leaveModalToggle}
          okText="Leave"
          keyboard
        >
          <h5>Are you sure you want to move the Project</h5>
          <h5>'{project.name}'?</h5>
        </Modal>
{/* move project modal end */}

{/* Archive task cofirm modal start */}
        <Modal
          visible={this.state.archive_project_modal}
          onOk={() => this.archiveProject()}
          onCancel={this.archiveModalToggle}
          okText="Okay"
          keyboard
        >
          <h5>Are you sure want to archive</h5>
          <h5>'{project.name}'?</h5>
        </Modal>
{/* end */}
      </div>
    );
  }
}


const mapStateToProps = state => ({
  project: state.projects.project,
  setting:state.projects.emailTaskSetting,
  sections: state.statuses,
  workspaces: state.common_reducer.workspaces,
  workspace: state.common_reducer.workspace,
  projectNotDelete: state.task.projectNotDelete,
  projectMembership: state.projectMembership,
  // leavingproject: state.task.leavingProject
})

export default withRouter(connect(mapStateToProps, { updateProjectUserEmailTaskSetting, deleteProject, leaveProject, moveProject, updateProject, getProjects, sendDeleteProjectToaster })(AdvancedSetting));