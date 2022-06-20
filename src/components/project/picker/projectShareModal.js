import React, { Component } from "react";
import { Modal, ModalBody } from "reactstrap";
import Autosuggest from "react-autosuggest";
import classnames from "classnames";
import PendingMemberItem from "./pendingWorkspaceMemberItem";

import ProjectMemberItem from "./projectMembers/projectMemberItem";

import {
  addMember,
  deleteProjectInvite,
  generateProjectShareUrl,
  getProjectShareUrl,
  deleteMember
} from "./projectMembers/projectMembershipActions";
import Validator from "validator";
import isEmpty from "lodash/isEmpty";
import { connect } from "react-redux";

class ProjectShareModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: this.getSuggestions(""),
      inviteMember: "",
      modal: false,
      errors: {},
      share_link: "",
      sections: [],
      invites: {},
      dropdownOpen: false,
      sendState: false    
    };
    this.addProjectmember = this.addProjectmember.bind(this);
    this.onClickAddMember = this.onClickAddMember.bind(this);

    this.copyShareLink = this.copyShareLink.bind(this);
    this.onInviteMemberChange = this.onInviteMemberChange.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(
      this
    );
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(
      this
    );
    this.getSuggestionValue = this.getSuggestionValue.bind(this);
    this.renderSuggestion = this.renderSuggestion.bind(this);
    this._getInitials = this._getInitials.bind(this);
  }
  escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  filteredMembers() {
    var members = this.props.workSpaceMembers;
    var workSpaceMembers = [];
    var a = 0;
    for (a = 0; a < members.length; a++) {
      if (members[a].user_id) {
        var status = this.props.projectMembers.findIndex(
          projectMember => projectMember.user_id._id === members[a].user_id._id
        );
        if (status === -1 && members[a].status === "member") {
          workSpaceMembers.push(members[a]);
        }
      }
    }

    return workSpaceMembers;
  }
  getSuggestions(value) {
    const escapedValue = this.escapeRegexCharacters(value.trim());
    if (escapedValue === "") {
      return [];
    }

    const regex = new RegExp("\\b" + escapedValue, "i");
    var suggestions = this.filteredMembers().filter(member =>
      regex.test( member.user_id.displayName||member.user_id.name)
    );

    return suggestions;
  }
  onSuggestionsFetchRequested({ value }) {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  }

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  getSuggestionValue(suggestion) {
    return suggestion;
  }

  renderSuggestion(suggestion, { query }) {
    return (
      <div className="d-flex suggestion-content">
        {suggestion.user_id.profilePicUrl ? (
          <img
            className="profilepic_myspace"
            src={suggestion.user_id.profilePicUrl}
            alt="profile"
          />
        ) : (
          <div className="profilepic_myspace_color d-flex align-items-center justify-content-center">
            {( suggestion.user_id.displayName||suggestion.user_id.name) && (
              <div>{this._getInitials(suggestion.user_id.displayName||suggestion.user_id.name)}</div>
            )}
          </div>
        )}

        <div className="member-info">
          <h5>{ suggestion.user_id.displayName||suggestion.user_id.name}</h5>
          <span>{suggestion.user_id.email}</span>
        </div>
      </div>
    );
  }
  onInviteMemberChange(e, { newValue, method }) {
    if (method === "click") {
      this.setState({
        inviteMember: newValue.user_id.email,
        invites: newValue
      });
    } else {
      this.setState({ inviteMember: e.target.value });
    }
  }
  onClickAddMember(e, member) {
    this.addProjectmember(e, member.user_id.email);
  }

  isValidEmail(data) {
    var errors = {};

    if (Validator.isEmpty(data)) {
      errors.invite_email = "This field is required";
    } else if (!Validator.isEmail(data)) {
      errors.invite_email = "Email is invalid";
    }
    this.setState({ errors: errors });

    return isEmpty(errors);
  }

  addProjectmember(e, email) {
    e.stopPropagation()
    var err = {};
    this.setState({ error: {} });
    const { addMember, chatClient } = this.props;
    if (!email) {
      email = this.state.inviteMember;
    }

    if (this.isValidEmail(email)) {
      this.setState({ sendState: true });
      addMember(
        this.props.project._id,
        this.props.project.name,
        this.props.project.workspace_id,
        email,
        chatClient
      ).then(res => {
        this.setState({ sendState: false });
        if (res) {
          if (res.data.success) {
            this.setState({ inviteMember: "" });
          } else {
            err.invite_email = res.data.errors;
            this.setState({ errors: err });
          }
        } else {
          //err.invite_email="Error adding Member"
          // this.setState({ errors: err });
        }
      });
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.cleardata) {
      this.setState({ errors: {}, invites: {}, inviteMember: "" });
      this.props.onClearData();
    }
  }

  copyShareLink() {
    var copyText = document.getElementById("share_link");

    copyText.select();
    document.execCommand("Copy");
  }

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

  render() {

    const {
      project,
      currentUser,
      deleteMember,
      projectMembers,
      invites,
      workspaceName,
      generateProjectShareUrl,
      deleteProjectInvite
    } = this.props;
    const inputProps = {
      value: this.state.inviteMember,
      onChange: this.onInviteMemberChange,
      className: "form-control share_input",
      placeholder: "Enter email address"
    };
    // console.log("-==========>inbite _id",invites);
    const { inviteMember, errors, suggestions } = this.state;
    var memberArr = [];
    var invitedMemberArr = [];
    var isAdmin = false;
    for (var i = 0; i < this.props.projectMembers.length; i++)
      if (this.props.projectMembers[i].status === "member") {
        memberArr.push(this.props.projectMembers[i]);

      if(currentUser._id === this.props.projectMembers[i].user_id._id && this.props.projectMembers[i].role === "admin"){
        isAdmin = true;  
      }

      } else {
        invitedMemberArr.push(this.props.projectMembers[i]);
      }
    return (
      <Modal
        isOpen={this.props.modal}
        toggle={this.props.toggle}
        className={classnames("share_modal", [this.props.className])}
      >
        <ModalBody className="share_modal_body">
          <div className="d-flex flex-column  justify-content-between share_modal_top_box">
            <span className="share_modal_heading">
              Invite to {project.name}
            </span>

            {/* <button type="button" onClick={this.props.toggle} className="close_share_modal_btn" data-dismiss="modal">&times;</button> */}
          </div>

          {/*<div className="share_modal_divider">OR</div>

                <div className="d-flex">
                        <div className="form-group">
                            <label className="form-control-label share_label" >Invite by Link</label>
                            <div className="d-flex">
                        
                                    
                                {!projectShareUrl && <button className="share_btn"  onClick={()=>generateProjectShareUrl(project.workspace_id._id,project._id)}>Generate URL</button>}
                                    
                                {projectShareUrl &&   <input type="text"  id="share_link"  value={projectShareUrl} name="share_link" className="form-control share_input" />}
                                {projectShareUrl &&  <button className="share_btn" onClick={this.copyShareLink}>Copy URL</button>}
                            </div>
                    </div>
            </div>*/}
          <div className="d-flex flex-column  project_member_box">

          <div className="add-or-invite-text common-text">Add existing users or invite new users here</div>
          <div className="d-flex">
              <form className="invite_member_form">
                <div>
                  {/* <label className="form-control-label share_label size-labelling">
                    Invite via email{" "}
                  </label> */}
                  <div className="d-flex">
                    <Autosuggest
                      suggestions={suggestions}
                      onSuggestionsFetchRequested={
                        this.onSuggestionsFetchRequested
                      }
                      onSuggestionsClearRequested={
                        this.onSuggestionsClearRequested
                      }
                      getSuggestionValue={this.getSuggestionValue}
                      renderSuggestion={this.renderSuggestion}
                      inputProps={inputProps}
                    />
                    {this.state.sendState ? (
                      <button type="button" className="share_btn btn_disabled">
                        Inviting...
                      </button>
                    ) : (
                      <button
                        className="primary_btn btn_114"
                        onClick={this.addProjectmember}
                      >
                        Invite
                      </button>
                    )}
                  </div>
                  {errors.invite_email && (
                    <span className="error_span">{errors.invite_email}</span>
                  )}
                </div>
              </form>
            </div>



            <div className="member_heading">
              {memberArr.length} Project members
              {invitedMemberArr.length + invites.length > 0 &&  <span className="project-modal-pending-value">{"  "}|{'  '} {invitedMemberArr.length + invites.length} pending invitation</span>}
            </div>
            
            <div className="d-flex flex-column justify-content-between  worpspace_member_list">
              {memberArr.map((member, index) => (
                <ProjectMemberItem
                  key={member._id}
                  isAdmin={isAdmin}
                  member_id={member._id}
                  role={member.role}
                  profilePicUrl={member.user_id.profilePicUrl}
                  name={ member.user_id.displayName||member.user_id.name}
                  email={member.user_id.email}
                  currentUser={currentUser}
                  member={member}
                  id={member.user_id._id}
                  project_id={this.props.project._id}
                />
              ))}

              {invitedMemberArr.map((member, index) => (
                <PendingMemberItem
                  key={member._id}
                  email={member.user_id.email}
                  onClick={() => deleteMember(member._id)}
                  type="Project"
                />
              ))}

              {invites.map((invite, index) => (
                <PendingMemberItem
                  key={invite._id}
                  email={invite.email}
                  onClick={() => deleteProjectInvite(invite._id,this.props.match.params.wId)}
                  type="project"
                />
              ))}
            </div>
          </div>

          {/* <div className="d-flex flex-column  worpspace_member_box filtered_workspace_members">
                          <div className="member_heading">
                              {workspaceName} Members
                          </div>
                      <div className="d-flex flex-column justify-content-between flex-wrap worpspace_member_list">

                        {this.filteredMembers().map((member, index) => (
                        <MemberItem key={member._id} profilePicUrl={member.user_id.profilePicUrl} name={member.user_id.name} email={member.user_id.email} onClick={(e) =>this.onClickAddMember(e,member)} share="project" currentUser={currentUser} id={member.user_id._id}/>
                    ))}



                </div>
              </div> */}
          <div className="share_modal_footer d-flex justify-content-end ">
            <button
              type="button"
              onClick={this.props.toggle}
              className="secondary_btn btn_114 hover-effect2"
              data-dismiss="modal"
            >
              Done
            </button>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

export default connect(
  
  null,
  { deleteProjectInvite, generateProjectShareUrl, addMember, deleteMember }
)(ProjectShareModal);
