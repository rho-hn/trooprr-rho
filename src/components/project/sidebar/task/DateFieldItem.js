import React, { Component } from 'react';
import {
    addTaskAttribValue
  } from "../sidebarActions";
  import DatePicker from "react-datepicker";
  import { withRouter } from "react-router-dom";
  import { connect } from "react-redux";
  import moment from "moment";
  import CustomTaskAttributeDropdown from './CustomTaskAttrDropdown';
class DateFieldItem extends Component{
	constructor(props){
		super(props);
		this.state = {
            date:"",
            openDropdown:false
		}
		
        this.onChange = this.onChange.bind(this);
        this.toggleDropdown = this.toggleDropdown.bind(this);
      
	}

  toggleDropdown(){
    this.setState({
      openDropdown: !this.state.openDropdown
    })
  }
  
    componentWillMount(){
            if(this.props.task.task_custom_attributes.length>0){
            var attribute=this.props.task.task_custom_attributes.find( item => item.attribute_id === this.props.attrib._id)
                    if(attribute){
                        this.setState({date:moment(attribute.date)})
                    }
            }
        
    }
    onChange(date){
       var selectedDate = new Date(date)
                    this.setState({date:date})
                    var data={ 
	
                        "attribute_id":this.props.attrib._id,
                      
                        "date":selectedDate
                        
                        }
                    this.props.addTaskAttribValue(this.props.match.params.wId,this.props.task._id,this.props.storeLocation,data)
             
        
      }

     
	render(){

	const {attrib}=this.props
		

		return(
		
               <div className="custom_attributes_item"  index={attrib._id}>
                  
                   <form onSubmit={this.onSubmit} className="date_custom_attrib_container">
                   <div className="d-flex justify-content-between align-items-center">
                   <label className="custom_attrib_label">{attrib.name}</label>
                   <CustomTaskAttributeDropdown 
                   dropdownOpen={this.state.openDropdown}
                   toggle={this.toggleDropdown}
                   attribute={attrib}
                   />
                   </div>
                   <DatePicker dateFormat="DD/MM/YYYY"
                          selected={this.state.date}
                          minDate={moment()}
                          onChange={this.onChange}
                          placeholderText="dd/mm/yyyy" 
                          className="custom_attrib_input"
                        />
                   </form>
                   </div>
                  
                  
              
               
              
             
		);
	}
}

export default withRouter(connect(null, { addTaskAttribValue })(DateFieldItem));
