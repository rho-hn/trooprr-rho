import React, { Component } from 'react';
import { Modal, ModalBody} from 'reactstrap';

import classnames from 'classnames';
import {updateProjectUserEmailTaskSetting } from "../projectActions";
import { connect } from 'react-redux';
import { Input } from "reactstrap";
// import memoize from "memoize-one";

class EmailProjectTaskSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
    section_id:"",
    position:"",
   
    } 
 this.onChange = this.onChange.bind(this);
  this.updateEmailProjectTaskSettingEmail = this.updateEmailProjectTaskSettingEmail.bind(this);
  this.copyProjectTaskEmail = this.copyProjectTaskEmail.bind(this);
  


  }



  
  componentWillReceiveProps(nextProps) {
   
    // This will erase any local state updates!
    // Do not do this.
    this.setState({section_id:nextProps.setting.status,position:nextProps.setting.position})
  }
  
  updateEmailProjectTaskSettingEmail(){
    var data={
      email:true,
      project_id:this.props.setting.project_id
    }

    this.props.updateProjectUserEmailTaskSetting(this.props.setting.project_id,this.props.setting._id,data,this.props.match.params.wId)

  }

    onChange(e){
      
    
        this.setState({[e.target.name]:e.target.value})

        var data={
          [e.target.name]:e.target.value
        }
        this.props.updateProjectUserEmailTaskSetting(this.props.setting.project_id,this.props.setting._id,data,this.props.match.params.wId)
    }
  
    copyProjectTaskEmail() {

      var copyText = document.getElementById("project_task_email");
  
      copyText.select();
      document.execCommand("Copy");
  
    }              

 render() {
 const {openModal,project,setting,sections}=this.props;


 


  return(
    
<Modal isOpen={openModal} toggle={this.props.toggle} className={classnames('project_email_setting_modal', [this.props.className])}>

          
          <ModalBody className="project_email_setting_modal_body">
                 <div className="d-flex justify-content-between project_email_setting_modal_header" >
                      <div className="d-flex flex-column">
                          <span className="heading">Email Forwarding Settings</span>
                           <div className="sub_heading">{project.name}</div>
                      </div>
                      <div onClick={this.props.toggle} className="close_project_email_setting_modal" data-dismiss="modal">&times;</div>
                  </div>
                 

                  <div >

                     <label className="form-control-label setting_label" >Your email address for this Project </label>
                          <div className="d-flex align-items-center">        
                          <input type="text"  id="project_task_email"  value={setting.email} name="copy_projectTaskEmail" className="form-control project_email_setting_input" />
                          <i className="fas fa-copy copy_icon" onClick={this.copyProjectTaskEmail }></i>
                              </div>      
                      
                              
                       
                   </div>

        <div className="generate_new_email_btn" onClick={this.updateEmailProjectTaskSettingEmail}> Generate new email address </div>
                 <div className="d-flex flex-column  setting_heading_box">
                          <div className="setting_heading">
                          Emailed tasks will appear in..
                          </div>
                      <div className="d-flex justify-content-between ">
                      <div className="project_email_setting_form">
                      <label className="form-control-label setting_label" >List</label>
                              <Input
                                type="select"
                                name="section_id"
                                className="project_email_setting_select"
                                
                                value={this.state.status}
                                onChange={this.onChange}
                              > 
                               <option value='' >select list</option>
                                    {sections.map((section, index) => (
                                        <option
                                          key={section._id}
                                          value={section._id}
                                        >
                                          {section.name}
                                        </option>
                                      ))}
                               
                              </Input></div>
                              <div className="project_email_setting_form">
                              <label className="form-control-label setting_label" >Position</label>
                              <Input
                                type="select"
                                name="position"
                                className="project_email_setting_select"
                               
                                value={this.state.position}
                                onChange={this.onChange}
                              > 
                               <option value='' >select position</option>
                                    
                                        <option value="top">
                                        Top
                                        </option>
                                        <option value="bottom">
                                        Bottom
                                        </option>
                                     
                               
                              </Input></div>
                              </div>
                              
                        </div>
                      

          </ModalBody>
          
        </Modal>


    )}  }




export default connect(null, {updateProjectUserEmailTaskSetting})(EmailProjectTaskSetting)
