import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import trash from "../../../images/delete.svg";
import plus_circle from "../../../images/plus-circle.svg";
import classnames from "classnames";
import {
  deleteWorkspaceMember,
  deleteWorkspaceInvite,
  updateMemership
} from "../../workspace/members/workspaceMembershipActions";
import DeleteModal from "../../common/confirmation-modal";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown
} from "reactstrap";
class MemberItem extends Component {
  constructor() {
    super();

    this.toggle = this.toggle.bind(this);
    this.state = {
      leavemodal: false,
      dropdownOpen: false
    };
    this._getInitials = this._getInitials.bind(this);
    this.leavemodalToggle = this.leavemodalToggle.bind(this);
  }

  componentWillMount() {}

  _getInitials(string) {
    return string
      .trim()
      .split(" ")
      .map(function(item) {
        if (item.trim() != "") {
          return item[0].toUpperCase();
        } else {
          return;
        }
      })
      .join("")
      .slice(0, 2);
  }

  // componentDidMount(){
  //   console.log("item did mount");
    
  // }

  leavemodalToggle() {
    this.setState({
      leavemodal: !this.state.leavemodal
    });
  }

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  render() {
    const {
      name,
      email,
      onClick,
      profilePicUrl,
      share,
      currentUser,
      id,
      member_id,
      deleteWorkspaceMember,
      workspaceId,
      role,
      isAdminMember
    } = this.props;
    return (
      <div className="d-flex justify-content-between align-items-center member_item">
        <div className="d-flex align-items-center">
          {profilePicUrl ? (
            <img
              className="profilepic_myspace"
              src={profilePicUrl}
              alt="profile"
            />
          ) : (
            <div className="profilepic_myspace_color d-flex align-items-center justify-content-center">
              {name && <div>{this._getInitials(name)}</div>}
            </div>
          )}
        </div>

        <div
          className={classnames("member_info", {
            project: share === "project"
          })}
        >
          <div style={{height:'23px'}} className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div className="member_name">{name}</div>
              <Fragment>
                {role === "admin" && (
                  <div className="d-flex">
                    <div className="share_modal_admin_text">admin</div>
                    <span style={{ fontSize: "12px", marginRight: "6px" }}>
                      {" "}
                      ·
                    </span>
                  </div>
                )}
              </Fragment>
              <div className="member_email">{email}</div>
            </div>

            { id !== currentUser._id &&
              isAdminMember && (
                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                  <DropdownToggle className="member_dropdown_vertical d-flex align-items-center" tag="span">
                  
                    <i className="material-icons">more_vert</i>
                 
              </DropdownToggle>
                    <DropdownMenu style={{padding:'0px'}}>
                    {role !== "admin" ? (
                      <DropdownItem 
                        className="custom_dropdown_item"
                        onClick={() => this.props.updateMemership(workspaceId,member_id, {role: 'admin'})}
                      >
                        Make admin
                      </DropdownItem>
                    ) : <DropdownItem
                    className="custom_dropdown_item"
                        onClick={() => this.props.updateMemership(workspaceId,member_id, {role: 'member'})}>
                        Remove Admin
                    </DropdownItem>}
                    <DropdownItem
                      className="custom_dropdown_item"
                      onClick={this.leavemodalToggle}
                    >
                      Remove Member
                    </DropdownItem>
                  </DropdownMenu>
                 </Dropdown>
              )}
            {/* {share === "project" && (
              <div
                className="d-flex align-items-center justify-content-center project_invitation_btn"
                onClick={onClick}
              >
                <img src={plus_circle} className="invite_member_icon" alt="" />
                Invite
              </div>
            )} */}
            
            {/* <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
              <DropdownToggle>
                  <div className="d-flex justify-content-end member_dropdown_vertical">
                    <i style={{padding:"0px"}} className="material-icons">more_vert</i>
                  </div>
              </DropdownToggle>
              <DropdownMenu>
                  <DropdownItem 
                  onClick={() => this.props.updateMemership(workspaceId,member_id, {role: 'admin'})}>Make Admin
                  </DropdownItem>
                  <DropdownItem 
                  onClick={this.leavemodalToggle}>
                  Remove Member
                  </DropdownItem>
              </DropdownMenu>
            </Dropdown> */}
          </div>
        </div>
            
              

        <DeleteModal
          toggle={this.leavemodalToggle}
          modal={this.state.leavemodal}
          name={name}
          Task="remove"
          Button="Remove"
          data="member"
          Delete={"workspace Member"}
          test={() => deleteWorkspaceMember(workspaceId, member_id)}
        />
      </div>
    );
  }
}

MemberItem.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  member_id: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  profilePicUrl: PropTypes.string.isRequired,
  deleteWorkspaceMember: PropTypes.func.isRequired
};

export default withRouter(
  connect(
    null,
    { deleteWorkspaceMember, updateMemership }
  )(MemberItem)
);
