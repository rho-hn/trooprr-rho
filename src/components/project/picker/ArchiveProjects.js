import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import  ArchiveProjectItem  from './ArchiveProjectItem';


class ArchiveProjects extends Component{
	constructor(props){
		super(props)
		this.state = {
			project:{},
		};
	}




render(){
     
   //const {showItems} = this.state;


	return (
	   <Modal isOpen={this.props.modal} toggle={this.props.toggle} >
                    <ModalHeader toggle={this.toggle}>
                      <h4>Archived Projects</h4>
                      <p className="archive-tasks-modal-header">These projects are not accessible by invited users. As an Admin , only you can restore these project.
                      </p>
                    </ModalHeader>
                    <ModalBody  id="archive-task-modal-scroll" className="archive-task-modal-body container archive-project-container">
                     <div className="row">
                   
                        {this.props.archiveProjects.map((project,i) => {
                         return  <ArchiveProjectItem index={i} key={project._id} project={project} /> 
                        })
                        }
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      <Button className="archive-task-done-button common-pointer" onClick={this.props.toggle}>Done</Button>
                    </ModalFooter>
       </Modal>
	)
  }
}



function mapStateToProps(state){
	return{
		archiveProjects:state.projects.projectarchiveProjects
	};
}

export default connect(mapStateToProps,{})(ArchiveProjects);