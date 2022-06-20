import React from 'react';
import { Button, Modal } from 'reactstrap';

import isEmpty from "lodash/isEmpty";
import OptionItem from "./custom_attributes_modal_option_item"
import Validator from "validator";
import classnames from 'classnames';

class CustomAttrributeModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name:"",
            placeholder:"",
            helptext:"",
            type:"",
            buttonText:"",
            options:[],
            option:"",
            errors:{}
        };
        this.addOptions=this.addOptions.bind(this)
        this.addAttribute = this.addAttribute.bind(this);
       this.onChange=this.onChange.bind(this);
       this.removeOption=this.removeOption.bind(this);
      this.selectTaskAttribute = this.selectTaskAttribute.bind(this);
      }

      componentWillMount(){
        this.setState({
            type:"text",
            buttonText:"Add new Text Field"
        })
      }

      onChange(e){
        this.setState({[e.target.name]:e.target.value})
      }
      addOptions(e){
        e.stopPropagation()
        e.preventDefault();
        if(this.isValidData(this.state.option,"option")){
        var optionsArr=this.state.options
        var option={
            text:this.state.option,
            position:(optionsArr.length +1)
        }
        optionsArr.push(option)
        this.setState({options:optionsArr,option:''})
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
      addAttribute(e){
            e.preventDefault();
            var data={};
            var errors = {};
          
        if(this.isValidData(this.state.name,"label")){
         
                data.name=this.state.name
                if(this.state.type==="text"){
                        data.type="text"
                        data.placeholder=this.state.placeholder
                        data.helptext=this.state.helptext
                }else if(this.state.type==="select"){
                        data.type="select"
                        data.options=this.state.options
                        if(data.options.length<=0){
                            errors.option="Add atleast One Option"
                            this.setState({errors:errors})
                            return;
                        }
                    
                }else if(this.state.type==="date"){
                        data.type="date"
                }else if(this.state.type==="number"){
                        data.type="number"
                        data.placeholder=this.state.placeholder
                        data.helptext=this.state.helptext
                }
        
                this.props.addCustomAttribute(this.props.id,data,this.props.match.params.wId).then(res => {
                    if(res.data.success){
                        this.setState({name:"",options:[],  placeholder:"",
                        helptext:"",option:''})
                        this.props.toggle()
                    }else{
                    
                    }
                })
        }
     
    }

    selectTaskAttribute(type,text){
        this.setState({
            type:type,
            buttonText: text
        })
    }

    removeOption(index){
            var options=this.state.options
            options.splice(index, 1)
            this.setState({options:options})

      }

    render() {
        const {errors}=this.state
        return (
            <Modal isOpen={this.props.modal} toggle={this.props.toggle} className="modal-content custom-attr-modal-content">
            <div className="custom_atrrib_add_modal">
                <div className="custom_atrrib_add_modal_header">Add Custom Field</div>
                    <div className="d-flex align-items-center justify-content-center custom-attr-warning-text">
                    <i class="material-icons report-problem-icon">report_problem</i>
                    <span className="report-problem-text">Changes made here will reflect across all the Project Tasks</span>
                    </div>
                    <div className="select-task-attr-subheader">Select Task attribute</div>
                    <div className="d-flex align-items-center select-task-attribute" >
                      <div className={classnames("d-flex align-items-center custom-add-text-field",{'custom-text-div' : this.state.type==="text"})} onClick={()=>this.selectTaskAttribute("text", "Add a new Text Field")}>
                      <i className={classnames("material-icons custom-attr-select-icon",{'custom-text-active-icon': this.state.type==="text"})}>text_fields</i><span className="span-custom-text">Text Field</span>
                      </div>
                      <div className={classnames("d-flex align-items-center custom-add-text-field",{'custom-number-div' : this.state.type==="number"})} onClick={() =>this.selectTaskAttribute("number", "Add  new Number Field")}>
                      <span className="hash-tag">#</span>
                      <span className="span-custom-text">Number Field</span>
                      </div>
                      <div className={classnames("d-flex align-items-center custom-add-text-field",{'custom-select-div' : this.state.type==="select"})} onClick={() => this.selectTaskAttribute("select", "Add dropdown selection")}>
                      <i className={classnames("material-icons custom-attr-select-icon",{'custom-select-active-icon':this.state.type ==="select"})}>arrow_drop_down_circle</i>
                      <span className="span-custom-text">Drop-down</span>
                      </div>
                      <div className={classnames("d-flex align-items-center custom-add-text-field",{'custom-date-div' : this.state.type==="date"})} onClick={() => this.selectTaskAttribute('date',"Add date picker")}>
                      <i className={classnames("material-icons custom-attr-select-icon",{'custom-date-active-icon':this.state.type === "date"})}>date_range</i>
                      <span className="span-custom-text">Date</span>
                      </div>
                    </div>
                    
                                {(this.state.type==="text" || this.state.type==="number" ) && 
                                 <form onSubmit={this.addAttribute}>
                                    <div className="custom_atrrib_add_modal_body justify-content-center">
                                    <div className="form-group">
                                    <label className="custom_attrib_label">Field Label</label>
                                    <input className="form-control" type="input" onChange={this.onChange} name="name"  autoComplete="off" placeholder="Enter label here"/>
                                    {errors.fieldLabel && <span className="error_span">{errors.fieldLabel}</span>}
                                    </div>
                                    <div className="form-group">
                                    <label className="custom_attrib_label">Placeholder text</label>
                                    <input className="form-control" type="input"onChange={this.onChange} name="placeholder"  autoComplete="off" placeholder="Enter placeholder text here"/>
                                    {errors.placeHolder && <span className="error_span">{errors.placeHolder}</span>}
                                    </div>
                                    <div className="form-group">
                                    <label className="custom_attrib_label">Help text</label>
                                    <input className="form-control" type="input" onChange={this.onChange} name="helptext"  autoComplete="off" placeholder="Enter help text here"/>
                                    </div>
                                    
                                </div>
                                </form>
                                }
                        
                                    {this.state.type==="select" &&  
                                        <div className="custom_atrrib_add_modal_body justify-content-center">
                                            <div className="form-group">
                                            <label className="custom_attrib_label">Dropdown selection label</label>
                                            <input className="form-control" type="input" onChange={this.onChange} name="name"  autoComplete="off" placeholder="enter label here"/>
                                            {errors.fieldLabel && <span className="error_span">{errors.fieldLabel}</span>}
                                            </div>
                                            <div className="custom_attrib_label_options"> Add Options</div>
                                            {this.state.options.map((item,index)=>
                                                <OptionItem index={index} item={item} removeOption={()=>this.removeOption(index)}/>
                                            )}
                                            <form onSubmit={this.addOptions}>
                                                <input className="form-control" type="input" value={this.state.option} onChange={this.onChange} name="option"  autoComplete="off" placeholder="enter option "/>
                                                {errors.option && <span className="error_span">{errors.option}</span>}
                                            </form>
                                            
                                            
                                            
                                        </div> 
                                    }
                                {this.state.type==="date" &&   <div className="custom_atrrib_add_modal_body justify-content-center">
                                <form onSubmit={this.addAttribute}>
                                    <div className="form-group">
                                    <label className="custom_attrib_label">Date picker label</label>
                                    <input className="form-control" type="input" onChange={this.onChange} name="name"  autoComplete="off" placeholder="enter label here"/>
                                    {errors.fieldLabel && <span className="error_span">{errors.fieldLabel}</span>}
                                    </div>
                                    
                                    </form></div> }
                        
                                <div className="custom_atrrib_add_modal_footer d-flex justify-content-end">
                                    <Button  className="custom_atrrib_add_modal_close_btn common-pointer cancel__button__color" onClick={this.props.toggle}>Cancel</Button>{' '}
                                    <Button className="add-custom-attr-button common-pointer button__color" onClick={this.addAttribute}>
                                     {this.state.buttonText}
                                    </Button>
                                </div>
                                
                    
            </div>
               
            </Modal>
        );
    }
}

export default (CustomAttrributeModal); 