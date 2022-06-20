import React, { Component } from 'react';
import {
    addTaskAttribValue
  } from "../sidebarActions";
  import { withRouter } from "react-router-dom";
  import { connect } from "react-redux";
 import CustomTaskAttributeDropdown from './CustomTaskAttrDropdown';
  
class NumberFieldItem extends Component{
	constructor(props){
		super(props);
		this.state = {
            numberFieldValue:"",
            openDropdown:false
		}
		
        this.onChange = this.onChange.bind(this);
        this.onSubmit= this.onSubmit.bind(this);
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
                     
                        this.setState({numberFieldValue:attribute.number})
                    }
            }
        
    }
    onChange(e){
        var check= isNaN(e.target.value)
                if(check){


                    this.setState({errors:"Enter A Valid Number"})
                }else{
                    this.setState({[e.target.name]:e.target.value})
                }
        
      }

      onSubmit(e){
        e.preventDefault();
            var data={ 
	
                "attribute_id":this.props.attrib._id,
              
                "number":this.state.numberFieldValue
                
                }
            this.props.addTaskAttribValue(this.props.match.params.wId,this.props.task._id,this.props.storeLocation,data)

      }
	render(){

	const {attrib}=this.props
		

		return(
		
               <div className="custom_attributes_item"  index={attrib._id}>
                  
                   <form onSubmit={this.onSubmit}>
                   <div className="d-flex justify-content-between align-items-center">
                   <label className="custom_attrib_label">{attrib.name}</label>
                   <CustomTaskAttributeDropdown 
                   dropdownOpen={this.state.openDropdown}
                   toggle={this.toggleDropdown}
                   attribute={attrib}
                   />
                   </div>
                   <input className="form-control custom_attrib_input" type="input" onChange={this.onChange} name="numberFieldValue" onBlur={this.onSubmit} value={this.state.numberFieldValue} placeholder={attrib.placeholder}/>
                   <div className="custom_attrib_helptext">{attrib.helptext}</div>
                   </form>
                   </div>             
             
		);
	}
}

export default withRouter(connect(null, { addTaskAttribValue })(NumberFieldItem));
