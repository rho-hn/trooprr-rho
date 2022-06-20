import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { connect } from "react-redux";
import share from "../../../images/share.svg";
import { getStatuses } from "../tasks/section/sectionActions";
// import { getTasks } from "../../myspace/tasks/mytaskActions";
import classnames from "classnames";
import {
  updateProject,
  moveProject,
  getProjectUserEmailTaskSetting,
  leaveProject
} from "../projectActions";
import Validator from "validator";
import isEmpty from "lodash/isEmpty";
import leave_project_Icon from "../../../images/leave_icon.svg";
import {
  getMembers,
  getProjectInvites,
  getProjectShareUrl,
} from "./projectMembers/projectMembershipActions";
import { getWorkspaceMembers } from "../../workspace/members/workspaceMembershipActions";
import ProjectShareModal from "./projectShareModal";
import DeleteModal from "../../common/confirmation-modal";
import ArchiveTaskConfirmModal from "../../common/archiveTask_confirmation_modal";
import { Form, FormGroup, Label, Input } from "reactstrap";
import { toggleLoader } from "../../settings/settingAction";

class ProjectItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.project.name,
      color: this.props.project && this.props.project.color,
      icon: this.props.project.icon,
      inviteMember: "",
      suggestions: [],
      errors: {},
      share_link: "",
      invites: {},
      dropdownOpen: false,
      cleardata: false,
      optionsDropdown: true,
      new_workspace: "",
      isHover: false,
      newProjDropdownOpen:true,
      newProjectId:''
    };
    //this.onIconChange = this.onIconChange.bind(this);
    this.onColorChange = this.onColorChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.stopPropagation = this.stopPropagation.bind(this);
    this.onChange = this.onChange.bind(this);
    //this.modalToggle = this.modalToggle.bind(this);
    //this.leavemodalToggle = this.leavemodalToggle.bind(this);
    //this.leave_Project = this.leave_Project.bind(this);
    this.dropdownToggle = this.dropdownToggle.bind(this);
    this.onClickSubmit = this.onClickSubmit.bind(this);
    //this.projectMove = this.projectMove.bind(this);
    this.onWorksapceChange = this.onWorksapceChange.bind(this);
    //this.openMoveProjectDropDown = this.openMoveProjectDropDown.bind(this);
    //this.closeMoveProjectDropDown = this.closeMoveProjectDropDown.bind(this);
    this.onClearData = this.onClearData.bind(this);
    this.toggleHoverStyle = this.toggleHoverStyle.bind(this);
    //this.archiveModalToggle = this.archiveModalToggle.bind(this);
    //this.archiveProject = this.archiveProject.bind(this);
    this.newProjDropdownToggle = this.newProjDropdownToggle.bind(this);
  }







 // projectMove(e) {
 //    e.stopPropagation();
 //    var data = {};
 //    data.workspace_id = this.state.new_workspace;

 //    if (this.props.project.workspace_id._id === data.workspace_id) {
 //      this.setState({ dropdownOpen: !this.state.dropdownOpen });
 //    } else {
     

 //            this.props.moveProject(this.props.project._id, data).then(res => {
 //              if (res.data.success) {
 //                this.setState({ dropdownOpen: !this.state.dropdownOpen });
               
 //              }
 //            });
 //          }
     
 //  }



  onWorksapceChange(e) {
    this.setState({ new_workspace: e.target.value });
  }


  // openMoveProjectDropDown(e) {
  //   e.stopPropagation();
  //   this.setState({
  //     optionsDropdown: false,
  //     moveProjectDropdown: true,
  //     new_workspace: this.props.project.workspace_id._id
  //   });
  // }


  // closeMoveProjectDropDown() {
  //   this.setState({ optionsDropdown: true, moveProjectDropdown: false });
  // }



  dropdownToggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
      optionsDropdown: true,
      moveProjectDropdown: false
    });
  }




  newProjDropdownToggle(){
    this.setState({
      newProjDropdownOpen: !this.state.newProjDropdownOpen
    })
  }
  // modalToggle() {
  //   this.setState({
  //     modal: !this.state.modal,
  //     cleardata: true
  //   });
  // }

  // archiveModalToggle(){
  //   this.setState({
  //     leaveArchiveModal: !this.state.leaveArchiveModal
  //   })
  // }

  // leavemodalToggle() {
  //   this.setState({
  //     leavemodal: !this.state.leavemodal
  //   });
  // }

  stopPropagation(e) {
    e.stopPropagation();
  }

  isValid(data) {
    var errors = {};

    if (Validator.isEmpty(data)) {
      errors.name = "This field is required";
    }
    this.setState({ errors: errors });

    return isEmpty(errors);
  }


  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  // onIconChange(icon) {
  //   this.setState({ icon: icon });
  //   // this.props.project.name = this.state.name;
  //   // this.props.project.color = this.state.color;
  //   // this.props.project.icon = icon;

  //   this.updateProject({ icon });
  // }

  onColorChange(color) {
    this.setState({ color: color });
    // this.props.project.name = this.state.name;
    // this.props.project.color = color;
    // this.props.project.icon = this.state.icon;
     this.updateProject({ color });
  }

  onSubmit(e) {
    e.preventDefault();
    if (this.isValid(this.state.name) && this.props.project.name !== this.state.name) {
      //this.props.project.name = this.state.name;
      //this.updateProject({name:this.state.name});
      const { updateProject } = this.props;
      let data = {};
        data.name = this.state.name;
       updateProject(this.props.project._id, data,this.props.match.params.wId).then(res=>{
        if(res.data.success){
          //this.props.clearNewItem();
        }
      });
    
    }
  }

  updateProject(data) {
    this.setState({ errors: {} });
    // if (this.isValid(data.name)) {
    const { updateProject } = this.props;
    updateProject(this.props.project._id, data,this.props.match.params.wId).then(res=>{
      if(res.data.success){
       // this.props.clearNewItem();
      }
    });
    // }
  }

  // archiveProject(){
  //   const {updateProject,project} = this.props;
  //   const data = {availability:"archived"}
  //   updateProject(project._id,data).then(res => {
  //     if(res.data.success){
  //       this.setState({
  //         leaveArchiveModal: false
  //       });
  //     }
  //   });
  // }

  onClickSubmit(e) {
    e.preventDefault();
      if(this.isValid(this.state.name) && this.props.project.name !== this.state.name){
         let data = {};
        data.name = this.state.name;
      

        this.props
        .updateProject(this.props.project._id, data,this.props.match.params.wId)
        .then(res => {
          if (res.data.success) {
            // this.setState({
            //   dropdownOpen: false,
            //   newProjDropdownOpen:false,
            // });
            // this.props.clearNewItem();
          }
        });
      }
  }

  // leave_Project(id) {
  //   const { leaveProject, chatClient } = this.props;
  //   leaveProject(id).then(res => {
  //     if (res.data.success) {
  //       getTasks();
  //     }
  //   });
  // }

  onClearData() {
    this.setState({ cleardata: false });
  }

  toggleHoverStyle(){
    this.setState({isHover: !this.state.isHover})
  }
  handleFocus = (event) => event.target.select();

  render() {
    const {
      user,
      chatClient,
      invites,
      getProjectInvites,
      projectShareUrl,
      getProjectShareUrl,
      workspaceName,
      projectMembers,
      project,
      onClick,
      getMembers,
      getWorkspaceMembers,
      members,
      workspaces
    } = this.props;
    const { inviteMember, errors, suggestions } = this.state;
 
    return (
      <div className="col-3">
        <div
          onMouseEnter={this.toggleHoverStyle}
          onMouseLeave={this.toggleHoverStyle}
          className="d-flex project_item_box col-12 flex-row justify-content-between align-items-center"
          onClick={onClick}
        >
          <div className=" d-flex flex-column justify-content-center project_info">
            <div className="project_name ">{project.name}</div>
            <span className="project_tasks">
              {project.total_tasks} tasks
            </span>
          </div>

       

          {this.props.newItem === project._id &&
            <Dropdown
            isOpen={this.props.newItem === project._id ? this.state.newProjDropdownOpen : this.state.dropdownOpen}
            toggle={this.props.newItem === project._id ? this.newProjDropdownToggle :this.dropdownToggle}
          >
            <DropdownToggle tag="span" className="d-flex justify-content-end  ">
            {/*<i class="material-icons project_settings_button">more_vert</i>*/}
            </DropdownToggle>
            {this.state.optionsDropdown && (
              <DropdownMenu
                className="custom_dropdown_conatiner"
                onClick={this.stopPropagation}
                right
              >
                <div className="custom_dropdown_item_input">
                  <form onSubmit={this.onClickSubmit} className="">
                    <input
                      type="text"
                      autoComplete="off"
                      autoFocus={true}
                      onBlur={this.onSubmit}
                      onChange={this.onChange}
                      value={this.state.name}
                      onFocus={this.handleFocus}
                      id="project_name"
                      name="name"
                      className="form-control project_setting_name"
                    />
                  </form>
                </div>
                {/* <div className="custom_dropdown_divider"></div>
                <div className="custom_dropdown_header  d-flex align-items-center" >PROJECT THEME</div>

                <div className="d-flex justify-content-between custom_dropdown_item">
                  
                  <div
                    className="colorBox bg_Color1 d-flex align-items-center justify-content-center"
                    onClick={() => this.onColorChange("#de350a")}
                  >
                    <div
                      className={classnames({
                        active_color_box: this.state.color === "#de350a"
                      })}
                    />
                  </div>
                  <div
                    className="colorBox bg_Color2 d-flex align-items-center justify-content-center"
                    onClick={() => this.onColorChange("#ff8b01")}
                  >
                    <div
                      className={classnames({
                        active_color_box: this.state.color === "#ff8b01"
                      })}
                    />
                  </div>
                  <div
                    className="colorBox bg_Color3 d-flex align-items-center justify-content-center"
                    onClick={() => this.onColorChange("#00875a")}
                  >
                    <div
                      className={classnames({
                        active_color_box: this.state.color === "#00875a"
                      })}
                    />
                  </div>
                  <div
                    className="colorBox bg_Color4 d-flex align-items-center justify-content-center"
                    onClick={() => this.onColorChange("#008da6")}
                  >
                    <div
                      className={classnames({
                        active_color_box: this.state.color === "#008da6"
                      })}
                    />
                  </div>
                  <div
                    className="colorBox bg_Color5 d-flex align-items-center justify-content-center"
                    onClick={() => this.onColorChange("#0052cc")}
                  >
                    <div
                      className={classnames({
                        active_color_box: this.state.color === "#0052cc"
                      })}
                    />
                  </div>
                  <div
                    className="colorBox bg_Color6 d-flex align-items-center justify-content-center"
                    onClick={() => this.onColorChange("#403294")}
                  >
                    <div
                      className={classnames({
                        active_color_box: this.state.color === "#403294"
                      })}
                    />
                  </div>
                  <div
                    className="colorBox bg_Color7 d-flex align-items-center justify-content-center"
                    onClick={() => this.onColorChange("#42526e")}
                  >
                    <div
                      className={classnames({
                        active_color_box: this.state.color === "#42526e"
                      })}
                    />
                  </div>
                </div> */}
              </DropdownMenu>
            )}
          </Dropdown>
        }
        </div>
      </div>
    );
  }
}

ProjectItem.propTypes = {
  project: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    workspaces: state.common_reducer.workspaces,
    members: state.common_reducerMembership.members,
    projectMembers: state.projectMembership.members,
    chatClient: state.sidebar.chatClient,
    user: state.common_reducer.user,
    projectShareUrl: state.projectMembership.url,
    invites: state.projectMembership.invites,
    channels: state.sidebar.channels
  };
}

export default connect(
  mapStateToProps,
  {
    getProjectShareUrl,
    moveProject,
    getProjectInvites,
    getStatuses,
    // getTasks,
    updateProject,
    leaveProject,
    getWorkspaceMembers,
    getMembers,
    toggleLoader,
    getProjectUserEmailTaskSetting
  }
)(ProjectItem);
