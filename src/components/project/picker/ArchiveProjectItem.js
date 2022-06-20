import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateProject, deleteProject } from '../projectActions.js';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import DeleteModal from '../../common/confirmation-modal';

class ArchiveProjectItem extends Component{
	constructor(props){
		super(props);
		this.state = {
			dropdownOpen: false,
      leaveModal:false
		}
		this.toggle = this.toggle.bind(this);
		this.restoreProject = this.restoreProject.bind(this);
    this.leaveModalToggle = this.leaveModalToggle.bind(this);
    this.removeProject = this.removeProject.bind(this);
	}

	toggle(){
		this.setState({
			dropdownOpen: !this.state.dropdownOpen
		})
	}

  leaveModalToggle(){
    this.setState({
      leaveModal: !this.state.leaveModal
    })
  }

	restoreProject(project){
    const data = {};
    data.availability = "active";
    this.props.updateProject(project._id,data,this.props.match.params.wId)
              .then(res => {
                if(res.data.success){
                  this.setState({
                    dropdownOpen: false
                  })
                }
              });
  }

  removeProject(id){
    this.props.deleteProject(id,this.props.match.params.wId).then(res => {
      if(res.data.success){
        this.setState({
          dropdownOpen:false,
          leaveModal:false
        });
      }
    });
  }


	render(){
		const {project} = this.props;
		return(
                <div  className="d-flex justify-content-between align-items-center archive-project-item">
                  <div>
                     <div className="archive-task-name">{project.name}</div>
                     <div className="d-flex archive-project-members">
                       <div className="archive-project-total-tasks">{project.total_tasks}{' '}tasks</div>
                       <div>{project.members} {' '}members</div>
                     </div>
                  </div>
                      <div onClick={this.toggle}>
                         <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                         <DropdownToggle>
                             <i class="fas fa-ellipsis-v common-pointer common-option-icon"></i>
                         </DropdownToggle>
                         <DropdownMenu className="custom_dropdown_conatiner" right>
                           <div className="d-flex align-items-center custom_dropdown_item" onClick={() => this.restoreProject(project)}>
                                <i class="material-icons custom_dropdown_icon">history</i>
                                <span>Unarchive Project</span>
                           </div>
                           <div  className="d-flex align-items-center custom_dropdown_item" onClick={this.leaveModalToggle}>
                             <i class="material-icons custom_dropdown_icon">delete</i>
                             <span>Delete Project</span>
                             </div>
                         </DropdownMenu>
                        </Dropdown>
                      </div>
                      <DeleteModal
                      modal={this.state.leaveModal}
                      toggle={this.leaveModalToggle}
                      Delete="Project"
                      name={project.name}
                      test={() => this.removeProject(project._id)}
                      />
                </div>
                        
		)
	}
}




export default connect(null,{updateProject,deleteProject})(ArchiveProjectItem);