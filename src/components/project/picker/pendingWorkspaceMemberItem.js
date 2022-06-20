import React, { Component } from 'react';
import PropTypes from 'prop-types';
import trash from '../../../images/delete.svg';
import {deleteWorkspaceMember,deleteWorkspaceInvite,updateMemership} from '../../workspace/members/workspaceMembershipActions';
import {deleteProjectInvite} from '../../project/projectMembers/pending/pendingProjectAction';

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import DeleteModal from "../../common/confirmation-modal";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown
} from "reactstrap";
import {setSidebar} from '../../sidebar/sidebarActions';



class PendingMemberItem extends Component {
  constructor(){
    super();

    // this.toggle = this.toggle.bind(this);
    this.state  = {
      leavemodal:false,
      dropdownOpen: false
    }
    // this.leaveModalToggle = this.leaveModalToggle.bind(this);
  }
  
  leavemodalToggle = () =>{
    
    this.setState({
      leavemodal: !this.state.leavemodal
    });
  }

  toggle = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }


  // deleteInvitedMember = (invite) => {
  //   this.props.deleteWorkspaceInvite(invite.workspace_id,invite._id);
  //   this.setState({
  //     leavemodal:false
  //   });
  //   // window.location.reload();
  // }

  deleteInvitedMember = (invite) => {
    
    this.props.deleteProjectInvite(invite._id,this.props.match.params.wId);
    this.setState({
      leavemodal:false
    });
    // window.location.reload();
  }

  render() {
  	const {  
      name,
      email,
      onClick,
      member_id,
      type,
      deleteWorkspaceMember,
      deleteWorkspaceInvite,
      currentUser,
      workspaceId,
      id,
      role,
      isAdminMember,
      key
     } = this.props;
    // console.log("PRops",member_id)
    return (
    	<div className="d-flex justify-content-between member_item">
        <div className="d-flex align-items-center">
            <div className="profilepic_myspace_color d-flex align-items-center justify-content-center">
        {email && <div>{email.substring(0, 2)}</div>
      }</div>
            
        </div>
        <div className=" d-flex justify-content-between member_info">
        
        <div className="d-flex align-items-center">
            <div className="member_name">{email}</div>
            <div className="member_pending">Pending</div>
            </div>
            {/* <img src={trash} alt="" className="delete_member" onClick={this.leaveModalToggle} /> */}
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
              <DropdownToggle className="member_dropdown_vertical d-flex align-items-center" tag="span">
                  
                    <i className="material-icons">more_vert</i>
               
              </DropdownToggle>
              <DropdownMenu className="pending-item-dorpdown-menu align_workspaceShareModal align_projectShareModal">
                  {/* <DropdownItem 
                  onClick={() => this.props.updateMemership(workspaceId,member_id, {role: 'admin'})}>Make Admin
                  </DropdownItem> */}
                  <DropdownItem 
                  className="d-flex align-items-center custom_dropdown_item "
                  onClick={this.leavemodalToggle}
                  data="invite"
                  type="div">
                  <div className="d-flex align-items-center ">Cancel Invite</div> 
                  </DropdownItem>
              </DropdownMenu>
            </Dropdown>
        </div>
       
        
        <DeleteModal
          toggle={this.leavemodalToggle}
          modal={this.state.leavemodal}
          name={email}
          data="invite"
          Task="cancel"
          // test={() => this.deleteInvitedMember(key)}
          test = {() =>onClick()}
        />

      </div>
         
    );
  }
}

PendingMemberItem.propTypes = {
  email: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  deleteWorkspaceMember:PropTypes.func.isRequired,
  deleteWorkspaceInvite: PropTypes.func.isRequired,
  member_id:PropTypes.string.isRequired,
}


export default withRouter(
  connect(
    null,
    {deleteWorkspaceMember,deleteWorkspaceInvite,deleteProjectInvite,setSidebar}
    )(PendingMemberItem)
    );
//export default PendingMemberItem;