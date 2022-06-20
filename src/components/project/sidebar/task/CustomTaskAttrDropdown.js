import React, {Component} from 'react';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {Dropdown,DropdownToggle,DropdownMenu,DropdownItem,Button} from "reactstrap";
import EditTaskAttributeModal from './EditTaskAttributeModal';
import {deleteCustomAttribute} from '../../projectActions';
import DeleteModal from '../../../common/confirmation-modal';

class CustomTaskAttributeDropdown extends Component{
	constructor(props){
		super(props); 
		this.state = {
			leaveModal:false,
			dropdownOpen:false,
			leaveDeleteModal:false
		}
		this.deleteAttribute = this.deleteAttribute.bind(this);
		this.leaveModalToggle = this.leaveModalToggle.bind(this);
		this.toggle = this.toggle.bind(this);
		this.leaveDeleteModalToggle = this.leaveDeleteModalToggle.bind(this);
	}

	deleteAttribute(){
		const {attribute,project,deleteCustomAttribute} = this.props;
		const attribute_id = attribute._id;
		const id = project._id;
		deleteCustomAttribute(id,attribute_id,this.props.match.params.wId).then(res =>{
			if(res.data.success){
				this.setState({
					leaveModal: false,
					dropdownOpen:false
				});
			}else{
				
			}
		});
	}

	leaveModalToggle(){
		this.setState({
			leaveModal: !this.state.leaveModal
		})
	}

	leaveDeleteModalToggle(){
		this.setState({
			leaveDeleteModal: !this.state.leaveDeleteModal
		});
	}

	toggle(){
		this.setState({
			dropdownOpen: !this.state.dropdownOpen
		})
	}


	render(){
		return(
			<div>
			<Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
               <DropdownToggle tag="div">
                <i class="material-icons common-pointer common-option-icon">more_horiz</i>
              </DropdownToggle>
              <DropdownMenu  right>
              <div className="d-flex align-items-center custom_dropdown_item" onClick={this.leaveModalToggle}>
              <i class="material-icons custom_dropdown_icon">edit</i>
              <span>Edit</span>
              </div>
              <div className="d-flex align-items-center custom_dropdown_item" onClick={this.leaveDeleteModalToggle}>
              <i class="material-icons custom_dropdown_icon">delete_outline</i>
              <span>Delete</span>
              </div>
              </DropdownMenu>
            </Dropdown>
            <EditTaskAttributeModal 
            attribute={this.props.attribute}
            modal={this.state.leaveModal}
            toggle={this.leaveModalToggle}
            />
             <DeleteModal
            modal={this.state.leaveDeleteModal}
            toggle={this.leaveDeleteModalToggle}
            name={this.props.attribute.name}
            Delete="Custom Task Attribute"
            test={()=>this.deleteAttribute()}
            />
            </div>
			)
	}
}

function mapstateToProps(state){
	return{
		project: state.projects.project
	}
}


export default connect(mapstateToProps,{deleteCustomAttribute})(CustomTaskAttributeDropdown);