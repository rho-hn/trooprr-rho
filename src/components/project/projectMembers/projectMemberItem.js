import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import trash from '../../../../images/delete.svg';
import DeleteModal from '../../../common/confirmation-modal';
import AddModal from '../../../common/AddConfirmationModal';
import { deleteMember, setProjectAdmin} from '../projectMembers/projectMembershipActions';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

const _getInitials = (string)=> {
  return string.trim().split(' ').map(function(item){
    if(item.trim() != ""){
      return item[0].toUpperCase()
    }else{
      return;
    }
  }).join('').slice(0,2)
};

class ProjectMemberItem extends Component {
    constructor(props){
       super(props);
       this.state = {
             deletemodal:false,
             removeAdminModal : false,
             makeAdminModal:false
       }
       this.deletemodalToggle = this.deletemodalToggle.bind(this);
       this.makeAdminToggle = this.makeAdminToggle.bind(this);
       this.removeAdminToggle = this.removeAdminToggle.bind(this);
  }



  removeAdminToggle(){
    this.setState({
      removeAdminModal: !this.state.removeAdminModal
    })
  }

  makeAdminToggle(){
    this.setState({
      makeAdminModal: !this.state.makeAdminModal
    })
  }




   deletemodalToggle() {
    this.setState({
      deletemodal: !this.state.deletemodal,
    });
  }
  render() {
    const { name, email,member, onClick,profilePicUrl,currentUser,id,deleteMember, role, member_id, isAdmin} = this.props;

    return (
  <div className="d-flex justify-content-between member_item">
      <div className="d-flex align-items-center">
       {profilePicUrl ?  <img className="profilepic_myspace" src={profilePicUrl} alt="profile"/>: <div className="profilepic_myspace_color d-flex align-items-center justify-content-center">{name && <div>{_getInitials(name)}</div>}</div>}
       
        </div>
        <div className=" d-flex justify-content-between member_info">
        <div className="d-flex align-items-center">
          <div className="member_name">{name}</div>
          <Fragment>{role === "admin" && <div className='d-flex'><div className='share_modal_admin_text'>Admin</div><span style={{fontSize: '12px', marginRight: '6px'}}> ·</span></div>}</Fragment>

          <div className="member_email">{email}</div>
          </div>
         
          {(id!==currentUser._id && isAdmin) && 
          <UncontrolledDropdown >
                  {/* <DropdownToggle className='share_options_toggle' tag="span"> */}
                    {/* <i style={{color: 'rgba(0, 0, 0, 0.4)'}}className="material-icons">more_vert</i> */}
                    {/* <i className="material-icons">more_vert</i>
                   */}
              <DropdownToggle className="member_dropdown_vertical d-flex align-items-center" tag="span">
                   <i class="material-icons">more_vert</i>
                  </DropdownToggle>
                  <DropdownMenu className="pending-item-dorpdown-menu align_left">
                    {role !== 'admin' ? <DropdownItem
                      className="d-flex align-items-center custom_dropdown_item"
                      onClick={() => this.props.setProjectAdmin(member_id, {role: 'admin'},this.props.match.params.wId)}
                    >
                      Make admin
                    </DropdownItem> : <DropdownItem
                      className="d-flex align-items-center custom_dropdown_item"
                      onClick={() => this.props.setProjectAdmin(member_id, {role: 'member'},this.props.match.params.wId)}
                    >
                      Dismiss as admin
                    </DropdownItem>}
                    <DropdownItem
                      className="d-flex align-items-center custom_dropdown_item"
                      onClick={this.deletemodalToggle}
                    >
                      Remove Member
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>}
                <DeleteModal 
                modal={this.state.removeAdminModal}
                toggle={this.removeAdminToggle}
                name={name}
                Delete="Admin"
                test={() => this.props.setProjectAdmin(member_id, {role: 'member'},this.props.match.params.wId)}
                />
                <AddModal
                modal={this.state.makeAdminModal}
                toggle={this.makeAdminToggle}
                name={name}
                Add="Add as Admin"
                test={() => this.props.setProjectAdmin(member_id, {role: 'member'},this.props.match.params.wId)}
                />
        </div>
            
            <DeleteModal
             toggle={this.deletemodalToggle}
             modal={this.state.deletemodal} 
             name={name} 
             Delete={"Project Member"} 
             test={() => deleteMember(member._id,this.props.match.params.wId)} 
             Task = "remove"
             member = 'member'  
             Button = 'Remove'/>
            
      </div>
    );
  }
}

function mapStateToProps(state) {
 
  return {
       chatClient: state.sidebar.chatClient,
    };
}

ProjectMemberItem.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  profilePicUrl:PropTypes.string.isRequired,
  member:PropTypes.object.isRequired,
  project_id:PropTypes.string.isRequired,
}

export default connect(mapStateToProps,{deleteMember, setProjectAdmin})(ProjectMemberItem);