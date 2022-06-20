import React, { Component } from 'react'
import {Button,Input,Modal,message} from "antd";
import { Form } from '@ant-design/compatible';
import {GenerateProjectKey,uniqueKeyCheck} from "../../utils/generateProjectKey"
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getStatuses } from "../project/tasks/section/sectionActions";
import { getTasks, getBacklogTasks } from "../project/tasks/task/taskActions"
import { getFutureSprints, getCurrentSprint, getSprintConfig } from "../project/tasks/section/sprintActions";
import {
  getProjects,
  addProject,
  getProject,
  setProject,
  recentProjects,
  getRecentProjects,
  getWorkspaceProjectKeys
} from "./projectActions.js";
 class SquadCreationModal extends Component {
constructor(props) {
    super(props)

    this.state = {
        projectName: '',
        createProjectLoading: false,
        loading: false,
        projectkey:"",
        disablecreation:true,
        projectkeyerrors:{error:false,text:''},
        userInput:false
    }
}

componentDidMount(){
  this.props.getWorkspaceProjectKeys(this.props.match.params.wId)
}

createProject = () => {
    // console.log("creating squad...")
    this.props.form.validateFields(['projectName','projectkey'],(error,values)=>{
      if(!error){

      
      const { wId } = this.props.match.params
      if (this.state.projectName.length > 0) {
        this.setState({ createProjectLoading: true })
        let data = {
          name: this.state.projectName,
          sections: ["To Do", "In Progress", "Done"],
          type: 'scrum',
          tags: [],
          projectkey:this.state.projectkey
        }
        this.props.addProject(wId, data).then(res => {
          this.props.closeModal()
          this.setState({ newProjectModal: false, createProjectLoading: false, projectName: '' })
         
          this.props.history.push(`/${wId}/squad/${res.data.project._id}/tasks`)
          this.props.getCurrentSprint(wId, res.data.project._id)
          this.props.getProjects(wId)
          this.props.getStatuses(wId, res.data.project._id)
          this.props.getFutureSprints(wId, res.data.project._id)
          this.props.getBacklogTasks(wId, res.data.project._id)
          this.props.getTasks(wId, res.data.project._id)
          this.props.setProject(res.data.project);
          this.props.getSprintConfig(wId, res.data.project._id)
          this.props.recentProjects(res.data.project._id, this.props.match.params.wId).then(res => {
            if (res.data.success) {
              //this.props.getRecentProjects(this.props.match.params.wId)
            }
          })
         
        })
      } else {
        message.error("Enter Squad name")
      }
    }

    })
  }

onProjectNameChange = event => {
    // console.log("onProjectNameChange called")
    if(this.state.userInput&&this.state.projectkey.length>0){
      let disable=true
   if(event.target.value.length>1&&this.state.projectkey.length>1)disable=false
      this.setState({ projectName: event.target.value,disable})
    }
    else{
   let generatedKey= GenerateProjectKey(event.target.value.trim(),this.props.workspacekeys)
  let disable=true
   if(event.target.value.length>1&&generatedKey.length>1)disable=false

  this.props.form.setFields({
      projectkey: {
        value:generatedKey,  
      },
    }); 
    this.setState({ projectName: event.target.value,projectkey:generatedKey,disablecreation:disable,userInput:false })
  }
  };  


  onProjectKeyChange=(e)=>{
 
    let disable=true
  if(this.state.projectName.length>1&&e.target.value.length>1&&e.target.value.length<6)disable=false
  let checkuniqueKey=uniqueKeyCheck(e.target.value,this.props.workspacekeys)
  let errors={error:false}
  if(!checkuniqueKey.isValid){
    disable=true
    errors.error=true
    errors.text=`${checkuniqueKey.projectname} squad already using this key.`
  }
  this.setState({disablecreation:disable,projectkeyerrors:errors,projectkey:e.target.value,userInput:true})
  }


    render() {
      
      
        let propserror={}
        if(this.state.projectkeyerrors.error){
          propserror.help=this.state.projectkeyerrors.text
         propserror.validateStatus= 'error'
        }
       
         const { getFieldDecorator} = this.props.form;
        return (
            <Modal
            visible={this.props.newProjectModal}
            title="New Squad"
            // onOk={this.projectsNew_close}
            onCancel={this.props.closeModal}
            maskClosable={false}
            footer={[
              <Button
              disabled={this.state.disablecreation}
                key="submit"
                type="primary"
                loading={this.state.createProjectLoading}
                onClick={this.createProject}
              >
                Create
                  </Button>
        ]}
      >
        <Form layout="vertical" onSubmit={this.onFormSubmit}>
          <div className={localStorage.getItem("theme") == 'dark' ? "form_group_label_dark" : "form_group_label"} >Squad Name</div>
          <Form.Item > {getFieldDecorator('projectName', {
            rules: [{ required: true, message: 'Squad Name is required' }, { min: 2, message: "Squad name is too short" }],
            initialValue: this.state.projectName
          })(<Input
            className={`input_text_change ${localStorage.getItem("theme") == 'dark' && "autofill_dark"}`} 

            autoFocus
            placeholder="Squad Name"
            onChange={this.onProjectNameChange}
          />)}

          </Form.Item>
          <div className={localStorage.getItem("theme") == 'dark' ? "form_group_label_dark" : "form_group_label"} >Key</div>
          <Form.Item {...propserror} >
            {getFieldDecorator('projectkey', {
              normalize: (input) => input.toUpperCase(),
              rules: [{ required: true, message: 'Key is required' }, { pattern: /^[A-Za-z]{2}/i, message: "First two letters should be alphabets followed by alpha numeric." }, { pattern: /^[a-z0-9]+$/i, message: `Squad keys must be alphanumeric characters` }, { min: 2, message: "Key length too short." }, { max: 5, message: "Key Length Should be less than 5 letters" }],
              initialValue: this.state.projectkey
            })(<Input className="autofill_dark" onChange={this.onProjectKeyChange} />)}
          </Form.Item>
        </Form>




      </Modal>
    )
  }
}

const mapStateToProps = state => ({
    workspacekeys:state.projects.workspacekeys
  });
export default withRouter(connect(mapStateToProps, { getProjects,
    addProject,
    getProject,
    setProject,
    getStatuses,
    getTasks,
    getFutureSprints,
    getCurrentSprint,
    getBacklogTasks,
    recentProjects,
    getSprintConfig,
    getRecentProjects,getWorkspaceProjectKeys})(Form.create({name:'projectsetup'})(SquadCreationModal)));
// export default SquadCreationModal