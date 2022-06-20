import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { setWorkspace } from '../../workspace/workspaceActions';
import ProjectItem from './ProjectItem';
import leave_workspce_Icon from '../../../images/leave_icon.svg';
import workspce_options from '../../../images/downarrow.png';
import { connect } from 'react-redux';
import share from '../../../images/share.svg';
import importProject from '../../../images/import.svg';
import MemberItem from './workspaceMemberItem';
import PendingMemberItem from './pendingWorkspaceMemberItem';
import { Modal, ModalBody } from 'reactstrap';
import { addProject, import_project } from '../projectActions.js';
import {
  updateWorkspace,
  uploadWorkspaceLogo,
  leaveWorkspace
} from '../../workspace/workspaceActions';
import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';
import {
  sendWorkspaceInvite,
  getWorkspaceMembers,
  getWorkspaceInvites,
  deleteWorkspaceMember,
  getWorkspaceShareUrl,
  generateWorkspaceShareUrl,
  deleteWorkspaceInvite
} from '../../workspace/members/workspaceMembershipActions';
import classnames from 'classnames';
import { setStatuses } from '../tasks/section/sectionActions';

import { setFiles } from '../files/filedAction';
import { setProjectProgressReports } from '../updates/projectProgressAction';
import axios from 'axios';
import { Card,Button,Input } from 'antd';

class WorkspaceShareModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // id: this.props.match.params.id,
      id: this.props.workspace._id,
      errors: {},
      color: '',
      icon: '',
      name: this.props.workspace.name,
      // modal: true,
      // leavemodal: false,
      invite_email: '',
      // dropdownOpen: false,
      sendState: false,
      disableInviteButton: false,
      modalChange: false
    };
    this.invitemember = this.invitemember.bind(this);
    this.onChange = this.onChange.bind(this);
    this.copyShareLink = this.copyShareLink.bind(this);
  }

  isValidEmail(data) {
    var errors = {};

    if (Validator.isEmpty(data)) {
      errors.invite_email = 'This field is required';
    } else if (!Validator.isEmail(data)) {
      errors.invite_email = 'Email is invalid';
    }
    this.setState({ errors: errors });

    return isEmpty(errors);
  }
  invitemember(e) {
    e.preventDefault();
    var errors = {};

    if (this.isValidEmail(this.state.invite_email)) {
      this.setState({ sendState: true });

      this.props
        .sendWorkspaceInvite(
          this.props.workspace._id,
          this.props.workspace.name,
          this.state.invite_email
        )
        .then(res => {
          // this.setState({disableInviteButton: !this.state.disableInviteButton})
          if (res.data.success) {
            this.setState({ sendState: false, invite_email: '' });
          } else {
            errors.invite_email = res.data.errors;
            this.setState({ sendState: false, errors: errors });
          }
        });
    }
  }

  getFilteredInvitedUser() {
    var filteredInvitedMembers = [];
    var a = 0;
    for (a = 0; a < this.props.invites.length; a++) {
      var status = this.props.members.findIndex(
        member => member.user_id.email === this.props.invites[a].email
      );

      if (status === -1) {
        filteredInvitedMembers.push(this.props.invites[a]);
      }
    }
    return filteredInvitedMembers;
  }
  isValid(data) {
    var errors = {};

    if (Validator.isEmpty(data.name)) {
      errors.name = 'This field is required';
    }
    this.setState({ errors: errors });

    return isEmpty(errors);
  }
  copyShareLink() {
    var copyText = document.getElementById('workspace_share_link');

    copyText.select();
    document.execCommand('Copy');
  }
  componentDidUpdate(prevProps) {
    if (this.props.cleardata) {
      this.setState({ errors: {}, invite_email: '' });
      this.props.onClearData();
    }
    // if (
    //   prevProps.members.length !== this.props.members.length ||
    //   prevProps.invites.length !== this.props.invites.length
    // ) {
    //   for (let i = 0; i < this.props.members.length; i++) {
    //     if (
    //       this.props.members[i].user_id &&
    //       this.props.currentUser._id === this.props.members[i].user_id._id &&
    //       this.props.members[i].role === "admin"
    //     ) {
    //       this.setState({ isAdmin: true });
    //     }
    //   }
    // }
  }

  // componentWillMount() {
  //   console.log('check did mount');
  //   const {members,currentUser} = this.props;

  // }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  deleteInvitedMember = invite => {
    return invite;
  };

  render() {
    const {
      workspaceShareUrl,
      currentUser,
      getWorkspaceShareUrl,
      generateWorkspaceShareUrl,
      workspace,
      projects,
      getWorkspaceMembers,
      getWorkspaceInvites,
      deleteWorkspaceInvite,
      deleteWorkspaceMember,
      leaveWorkspace,
      members,
      invites
    } = this.props;
    let isAdminMember = false;
    const adminMember = this.props.members.filter(
      member =>
        member.role === 'admin' &&
        member.user_id._id === this.props.currentUser._id
    );
    if (adminMember.length > 0) {
      isAdminMember = true;
    }
    var memberArr = [];
    var invitedMemberArr = [];
    // console.log("members.length",this.props.members.length)
    for (var i = 0; i < this.props.members.length; i++)
      if (this.props.members[i].status === 'member') {
        memberArr.push(this.props.members[i]);
      } else {
        invitedMemberArr.push(this.props.members[i]);
      }

    const { errors } = this.state;
    return (
        <div >
          {/* members start */}
          <Card className='' style={{marginBottom:'25px', marginTop:'16px',marginLeft:'25px',width:'800px'}}>
          <div className="d-flex flex-column  justify-content-between ">
            {/* <div className="workspace_members_font">
              Invite to {this.props.workspace.name}
            </div> */}

            <div className="d-flex">
              <form style={{width:'100%'}} >
                <div>
                  {/* <label 
                  style={{marginBottom:'15px'}}
                  className="form-control-label share_label size-labelling">
                    Invite via email{" "}
                  </label> */}
                  <div className="d-flex" style = {{marginTop:'20px',marginLeft:'32px',marginRight:'20px'}}>
                    <Input
                      onChange={this.onChange}
                      value={this.state.invite_email}
                      name="invite_email"
                      placeholder="Enter email id here"
                      // autoComplete="off"
                    />
                    {this.state.sendState ? (
                      <Button type='primary' style={{width:'157px',marginLeft:"16px"}}>
                        Inviting...
                      </Button>
                    ) : (
                      <Button 
                      type="primary" 
                      onClick={this.invitemember}
                      style={{width:'157px',marginLeft:"16px"}}>
                        Invite
                      </Button>
                    )}
                  </div>
                  {errors.invite_email && (
                    <span className="error_span">{errors.invite_email}</span>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/*  <div className="share_modal_divider">OR</div>

              <div className="d-flex">
              <div className="form-group">
               <label className="form-control-label share_label" >Invite by Link</label>
                 <div className="d-flex">
                   {workspaceShareUrl && <input type="text" id="workspace_share_link" value={this.props.workspaceShareUrl} name="share_link" className="form-control share_input" />}

                  {!workspaceShareUrl && <button className="share_btn" onClick={() => generateWorkspaceShareUrl(workspace._id)}>Generate URL</button>}
                   {workspaceShareUrl && <button className="share_btn" onClick={this.copyShareLink}>Copy URL</button>}
                 </div>
               </div>
     </div>*/}

          <div className="Workspace_members_data_style">
          {/* <div style={{marginBottom:"3px"}}>
            <span className="team-members-styling">Team members</span>
            <div className="One-line-description">One line description about what a workspace member role is. Who is an admin and who is a member.</div>
          </div> */}
          <div className="d-flex flex-column  worpspace_member_box">
            <div className="member_heading">
              {memberArr.length} Workspace members{" "}
              {/* {invitedMemberArr.length + this.getFilteredInvitedUser().length}{" "}
              pending invitation */}
              {invitedMemberArr.length + invites.length > 0 &&  <span className="project-modal-pending-value">{"  "}|{'  '} {invitedMemberArr.length + invites.length} pending invitation</span>}
              
            </div>
           
            <div className="d-flex flex-column justify-content-between worpspace_member_list">
            
              {memberArr.map((member, index) => (

                <MemberItem
                  key={member._id}
                  isAdmin={this.props.isAdmin}
                  isAdminMember={isAdminMember}
                  currentUser={currentUser}
                  role={member.role}
                  profilePicUrl={member.user_id.profilePicUrl}
                  name={ member.user_id.displayName||member.user_id.name}
                  email={member.user_id.email}
                  share="workspace"
                  currentUser={currentUser}
                  member_id={member._id}
                  id={member.user_id._id}
                  workspaceId={workspace._id}
                />
              ))}

              {invitedMemberArr.map((member, index) => (
                <PendingMemberItem
                  key={member._id}
                  isMember="member"
                  member_id={member._id}
                  email={member.user_id.email}
                  onClick={() => deleteWorkspaceMember(member._id)}
                  type="workspace"
                />
              ))}

              {this.getFilteredInvitedUser().map((invite, index) => (
                <PendingMemberItem
                  key={invite._id}
                  isMember="invite"
                  email={invite.email}
                  member_id={invite._id}
                  // onClick={() => deleteWorkspaceInvite(invite.workspace_id,invite._id)}
                  onClick = {invite}
                  type="workspace"
                />
              ))}
              
            </div>
          </div>
          </div>
        </Card>
          {/* members end */}
      </div>
    );
  }
}

WorkspaceShareModal.propTypes = {
  workspace: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  addProject: PropTypes.func.isRequired,
  sendWorkspaceInvite: PropTypes.func.isRequired,
  getWorkspaceMembers: PropTypes.func.isRequired,
  getWorkspaceInvites: PropTypes.func.isRequired,
  setWorkspace: PropTypes.func.isRequired,
  updateWorkspace: PropTypes.func.isRequired,
  leaveWorkspace: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  // console.log("new members",state.common_reducerMembership.members)
  return {
    workspace: state.common_reducer.workspace,
    currentUser: state.common_reducer.user,
    members: state.common_reducerMembership.members,
    invites: state.common_reducerMembership.invites,
    workspaceShareUrl: state.common_reducerMembership.url
  };
}

export default withRouter(
  connect(mapStateToProps, {
    setProjectProgressReports,

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

    setFiles
  })(WorkspaceShareModal)
);
