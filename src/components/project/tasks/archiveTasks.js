import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { setSidebar } from "../sidebar/sidebarActions.js";

import  ArchiveTaskItem  from './archiveTaskItem'


class ArchiveTasks extends Component{
	constructor(props){
		super(props)
		this.state = {
			task:{},
      //showItems:[],
      //currentItems:10
		};
    //this.handleScroll = this.handleScroll.bind(this); 
   // this.searchArchiveTasks = this.searchArchiveTasks.bind(this);
	}

  /*searchArchiveTasks(e){
    this.props.searchArchiveTasks(e.target.value)
  }*/

 






render(){
     
   //const {showItems} = this.state;


	return (
	   <Modal isOpen={this.props.modal} toggle={this.props.toggle} >
                    <ModalHeader toggle={this.toggle}>
                      <h4>Archived Tasks</h4>
                      <p className="archive-tasks-modal-header">These tasks are not accessible by invited users. As an Admin , only you can restore these tasks.
                      </p>
                    </ModalHeader>
                    <ModalBody  id="archive-task-modal-scroll" className="archive-task-modal-body">
                      {/*<div className="d-flex align-items-center search-archive-tasks">
                        <input type="text" className="search-archive-task-input" onChange={this.searchArchiveTasks} name="searchTask" placeholder="search archived tasks"/>
                        <i className="material-icons archive-tasks-search-icon">search</i>
                      </div>*/}
                   
                        {this.props.archiveTasks.map((task,i) => {
                         return  <ArchiveTaskItem index={i} key={task._id} task={task} /> 
                        })
                        }
                 
                    </ModalBody>
                    <ModalFooter >
                      <Button className="archive-task-done-button archive-task-done-button-hover" onClick={this.props.toggle}>Done</Button>
                    </ModalFooter>
       </Modal>
	)
  }
}



function mapStateToProps(state){
	return{
		archiveTasks: state.task.archiveTasks
	};
}

export default connect(mapStateToProps,{ setSidebar})(ArchiveTasks);