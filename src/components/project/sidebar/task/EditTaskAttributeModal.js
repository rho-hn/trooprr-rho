import React, {Component} from 'react';
import { Button, Modal } from 'reactstrap';
import Validator from "validator";

import isEmpty from "lodash/isEmpty";
import OptionItem from "../../../common/custom_attributes_modal_option_item";
import {editCustomAttribute} from "../../projectActions.js";
import { connect } from "react-redux";
import axios from 'axios';


class EditTaskAttributeModal extends Component{
	constructor(props){
		super(props);
		this.state = {
            name:"",
            placeholder:"",
            helptext:"",
            type:"",
            options:[],
            option:"",
            errors:{}
        };

	   this.addOptions=this.addOptions.bind(this)
       this.editAttribute = this.editAttribute.bind(this);
       this.onChange=this.onChange.bind(this);
       this.removeOption=this.removeOption.bind(this);
	}

   
	componentWillMount(){
		const {attribute} = this.props;
        if(attribute){
		if(attribute.type === "text" || attribute.type === "number"){
			this.setState({
			name: attribute.name,
			placeholder:attribute.placeholder,
			helptext: attribute.helptext,
			type: attribute.type,
			options:attribute.options
		  });
		}else if(attribute.type === "select"){
			this.setState({
				type:"select",
				name:attribute.name,
				options:attribute.options,
			});
		}else{
			this.setState({
				type:"date",
				options:attribute.options,
				name:attribute.name
			})
		}
	 }
	}


    isValidData(data,type) {
        var errors = {};

        if (Validator.isEmpty(data)) {
          
            if(type==="label"){
                errors.fieldLabel = "This field is required";
            }else if(type==="option"){
                errors.option  = "This field is required";
            }
          
        } 
        this.setState({ errors: errors });
    
        return isEmpty(errors);
      }

      onChange(e){
        this.setState({[e.target.name]:e.target.value})
      }

     addOptions(e){
        e.stopPropagation()
        e.preventDefault();
        if(this.isValidData(this.state.option,"option")){
            const {attribute} = this.props;
            const attribute_id = attribute._id;
        var optionsArr=this.state.options
        var option={
            text:this.state.option,
            position:(optionsArr.length +1)
        }
        const data = {};
        data.text = this.state.option;
        optionsArr.push(option);
        // axios.post(`/api/attributeOption/${attribute_id}`,data).then(res =>{
        axios.post(`/api/${this.props.match.params.wId}/custom_attribute/${attribute_id}/option`,data).then(res =>{
            if(res.data.success){
                this.setState({options:optionsArr,option:''});
            }
        });
        //this.setState({options:optionsArr,option:''})
       }
      }

     removeOption(index,item){
            var options=this.state.options
            options.splice(index, 1)
            //this.setState({options:options});
            // axios.delete('/api/projectTaskAttribute/'+item.atrribute_id+'/option/'+item._id)
            axios.delete('/api/'+this.props.match.params.wId+'/custom_attribute/'+item.atrribute_id+'/option/'+item._id)
                 .then(res => {
                    if(res.data.success){
                        this.setState({options:options})
                    }
                 })

      }

	editAttribute(e){
            e.preventDefault();
            var data={};
            var errors = {};
          
        if(this.isValidData(this.state.name,"label")){
         
                data.name=this.state.name
                data._id = this.props.attribute._id;
                if(this.state.type === "text" || this.state.type === "number"){
                        data.type=this.state.type
                        data.placeholder=this.state.placeholder
                        data.helptext=this.state.helptext
                }else if(this.state.type === "select"){
                        data.type="select"
                        data.options=this.state.options
                        if(data.options.length<=0){
                            errors.option="Add atleast One Option"
                            this.setState({errors:errors})
                            return;
                        }
                    
                }else if(this.state.type === "date"){
                        data.type="date"
                }else {
                }
        
                this.props.editCustomAttribute(this.props.project._id,data,this.props.match.params.wId).then(res => {
                    if(res.data.success){
                        this.props.toggle();
                    }else{
                        
                    }
                })
        }
   }

	render(){

    	const {name,type,placeholder,helptext,options,option,errors,attribute} = this.state;
		return( 
		 <Modal isOpen={this.props.modal} toggle={this.props.toggle} className="modal-content custom-attr-modal-content">
            <div className="custom_atrrib_add_modal">
                <div className="custom_atrrib_add_modal_header">Edit Custom Field</div>
                    <div className="d-flex align-items-center justify-content-center custom-attr-warning-text">
                    <i class="material-icons report-problem-icon">report_problem</i>
                    <span className="report-problem-text">Changes made here will reflect across all the Project Tasks</span>
                    </div>            
                    
                                {(type==="text" || type === "number" ) && 
                                 <form onSubmit={this.addAttribute}>
                                    <div className="custom_atrrib_add_modal_body justify-content-center">
                                    <div className="form-group">
                                    <label className="custom_attrib_label">Field Label</label>
                                    <input className="form-control" type="input" onChange={this.onChange} name="name"  autoComplete="off" value={name}/>
                                    {errors.fieldLabel && <span className="error_span">{errors.fieldLabel}</span>}
                                    </div>
                                    <div className="form-group">
                                    <label className="custom_attrib_label">Placeholder text</label>
                                    <input className="form-control" type="input"onChange={this.onChange} name="placeholder"  autoComplete="off" value={placeholder}/>
                                    {errors.placeHolder && <span className="error_span">{errors.placeHolder}</span>}
                                    </div>
                                    <div className="form-group">
                                    <label className="custom_attrib_label">Help text</label>
                                    <input className="form-control" type="input" onChange={this.onChange} name="helptext"  autoComplete="off" value={helptext}/>
                                    </div>
                                    
                                </div>
                                </form>
                                }
                        
                                    {type==="select" &&  
                                        <div className="custom_atrrib_add_modal_body justify-content-center">
                                            <div className="form-group">
                                            <label className="custom_attrib_label">Dropdown selection label</label>
                                            <input className="form-control" type="input" onChange={this.onChange} name="name"  autoComplete="off" value={name}/>
                                            {errors.fieldLabel && <span className="error_span">{errors.fieldLabel}</span>}
                                            </div>
                                            <div className="custom_attrib_label_options"> Add Options</div>
                                            {options.map((item,index)=>
                                                <OptionItem index={index} item={item} removeOption={()=>this.removeOption(index,item)}/>
                                            )}
                                            <form onSubmit={this.addOptions}>
                                                <input className="form-control" type="input" value={option} onChange={this.onChange} name="option"  autoComplete="off" placeholder="enter option "/>
                                                {errors.option && <span className="error_span">{errors.option}</span>}
                                            </form>
                                            
                                            
                                            
                                        </div> 
                                    }
                                {type==="date" &&   <div className="custom_atrrib_add_modal_body justify-content-center">
                                <form onSubmit={this.addAttribute}>
                                    <div className="form-group">
                                    <label className="custom_attrib_label">Date picker label</label>
                                    <input className="form-control" type="input" onChange={this.onChange} name="name"  autoComplete="off" value={name} placeholder="enter label here"/>
                                    {errors.fieldLabel && <span className="error_span">{errors.fieldLabel}</span>}
                                    </div>
                                    
                                    </form></div> }
                        
                                <div className="custom_atrrib_add_modal_footer d-flex justify-content-end">
                                    <Button  className="cancel__button__color custom_atrrib_add_modal_close_btn" onClick={this.props.toggle}>Cancel</Button>{' '}
                                    <Button className="add-custom-attr-button button__color" onClick={this.editAttribute}>
                                     Save Changes
                                    </Button>
                                </div>
                         </div>
                </Modal>
         );
	}
}

function mapStateToProps(state){
    return{
        project: state.projects.project
    }
}

export default connect(mapStateToProps,{editCustomAttribute})(EditTaskAttributeModal);