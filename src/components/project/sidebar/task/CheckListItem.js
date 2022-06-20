import React, { Component } from 'react';
import moment from "moment";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button
} from "reactstrap";

import {updateChecklist} from '../sidebarActions.js';
import {connect} from 'react-redux';
import { withRouter } from "react-router-dom";

class CheckListItem extends Component{
	constructor(props){
		super(props);
		this.state = {
			dropdownOpen: false,
      fileColors: [],
      inputForm:false,
      name:''
		}
		this.dropdownToggle = this.dropdownToggle.bind(this);
    this.onClickSubmit = this.onClickSubmit.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.toggle = this.toggle.bind(this);
	}


  onChange(e){
    this.setState({
      [e.target.name] : e.target.value
    })
  }
  

  toggle(){
    const {item} = this.props;
    this.setState({
      dropdownOpen:!this.state.dropdownOpen,
      inputForm: !this.state.inputForm,
      name: item.name
    });
  }

	onSubmit(e){
    e.preventDefault();
    let data = {};
    const {item} = this.props;
    data.name = this.state.name;
    this.props.updateChecklist(this.props.match.params.wId,item._id,data).then(res=>{
      if(res.data.success){
        this.setState({
          inputForm:false,
        })
      }
    })
  }

  onClickSubmit(e){
    e.preventDefault();
    let data = {};
    const {item} = this.props;
    data.name = this.state.name;
    this.props.updateChecklist(this.props.match.params.wId,item._id,data).then(res =>{
      if(res.data.success){
        this.setState({
          inputForm:false
        })
      }
    })
  }

	dropdownToggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

	render(){

	
		const { item,key } = this.props;
		return(
		    <div key={item._id} className="checklist_item_box">
            { this.state.inputForm ?
               <form  onSubmit={this.onClickSubmit} className="d-flex checklist-edit-form">
                 <input 
                  type="text"
                  autoComplete="off"
                  ref={input => input && input.focus()}
                  onBlur={this.onSubmit}
                  onChange={this.onChange}
                  value={this.state.name}
                  name="name"
                  className="checklist-edit-input"
                  />
                </form> :
              <div className="d-flex justify-content-between">
              <div className="d-flex checklist_item_info "> 
                 {item.status
                            ? ( <i className="fas fa-check-circle kanban_checked_icon" 
                                   onClick={()=>this.props.updateChecklistStatus(item._id,false)}></i>)
                            : (<i className="far fa-square kanban_unchecked_icon" onClick={()=>this.props.updateChecklistStatus(item._id,true)}></i>)
                        }
                    <div className="checklist_name">{item.name}</div>
                    
              </div>
               <div>
                 <Dropdown isOpen={this.state.dropdownOpen} toggle={this.dropdownToggle}>
                  <DropdownToggle tag="span"  className="d-flex justify-content-end"  >
                  <i className="fa fa-ellipsis-h checkList_settings_button" ></i>
                  </DropdownToggle>
                  <DropdownMenu onClick={this.stopPropagation} right>
                      <div  className="d-flex align-items-center custom_dropdown_item" onClick={this.toggle}>
                          <i class="material-icons custom_dropdown_icon">edit</i>
                          <span>Edit</span>
                      </div>
                      <div  className="d-flex align-items-center custom_dropdown_item" onClick={this.props.deleteChecklist}>
                       <i class="material-icons custom_dropdown_icon">delete_outline</i>
                       <span> Delete </span>
                      </div>
                  </DropdownMenu>
                </Dropdown>
              </div>
              </div>
            }                     
        </div>
		);
	}
}


const mapStateToProps = (state) =>({
  project:state.projects.project
})

export default withRouter(connect(mapStateToProps,{updateChecklist})(CheckListItem));