import React, { Component } from 'react';
import {
    addTaskAttribValue
  } from "../sidebarActions";
  import { withRouter } from "react-router-dom";
  import { connect } from "react-redux";
  import CustomTaskAttributeDropdown from './CustomTaskAttrDropdown';
  
class SelectFieldItem extends Component{
	constructor(props){
		super(props);
		this.state = {
            selectValue:"",
            openDropdown: false
		}
		
        this.onChange = this.onChange.bind(this);
        this.toggleDropdown = this.toggleDropdown.bind(this);
        
	}

   toggleDropdown(){
    this.setState({
      openDropdown: !this.openDropdown
    })
   }
 

    componentWillMount(){
       
            if(this.props.task.task_custom_attributes.length>0){
             
            var attribute=this.props.task.task_custom_attributes.find( item => item.attribute_id === this.props.attrib._id)
       
                    if(attribute){
                     
                        this.setState({selectValue:attribute.option})
                    }
            }
        
    }
    onChange(e){

        this.setState({[e.target.name]:e.target.value})
        if(e.target.value){
            var data={ 
	
                "attribute_id":this.props.attrib._id,
              
                "option":e.target.value
                
                }
            
            this.props.addTaskAttribValue(this.props.match.params.wId,this.props.task._id,this.props.storeLocation,data)
        }
       
    
      }

    
	render(){

	const {attrib}=this.props
		

		return(
		
               <div  className="custom_attributes_item"  index={attrib._id}>
                  
                   <form onSubmit={this.onSubmit}>
                   <div className="d-flex justify-content-between align-items-center">
                   <label className="custom_attrib_label">{attrib.name}</label>
                   <CustomTaskAttributeDropdown 
                   dropdownOpen={this.state.openDropdown}
                   toggle={this.toggleDropdown}
                   attribute={attrib}
                   />
                   </div>
                   <select value={this.state.selectValue} onChange={this.onChange} className="form-control custom_attrib_input " name="selectValue" required>
                   <option  value="">select one</option>
                   {attrib.options.map((item,index) => <option key={index} value={[item._id]}>{item.text}</option>)}
   
                   </select>
                   </form>
                   </div>
                  
                  
              
               
              
             
		);
	}
}

export default withRouter(connect(null, { addTaskAttribValue })(SelectFieldItem));
