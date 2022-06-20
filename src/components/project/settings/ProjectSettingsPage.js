import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import BasicDetails from './BasicDetails';
import './projectSetting.css'
import AdvancedSetting from './AdvancedSetting';
import {getProjectUserEmailTaskSetting, getProject} from '../projectActions';
import {getStatuses} from "../tasks/section/sectionActions";
import axios from 'axios';
import moment from 'moment';

class ProjectSettingsPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      advancedSettings:false,
      membership:''
    };
    this.setAdvancedView = this.setAdvancedView.bind(this);
  }

  setAdvancedView(){
    this.setState({
      advancedSettings:!this.state.advancedSettings
    });
  }

  componentDidMount(){
    const {project} = this.props;
    // console.log("did mount project ",project);
    const {pathname} = this.props.location;
  if(pathname.match('/project/')){
      const projectId = this.props.location.pathname.split('/')[4];
         this.props.getProject(projectId,this.props.match.params.wId).then(res =>{
           if(res.data.success){
            this.props.getProjectUserEmailTaskSetting(res.data.project._id,this.props.match.params.wId);
            this.props.getStatuses(this.props.match.params.wId,res.data.project._id);
           }
         })
    }else{
      this.props.getProjectUserEmailTaskSetting(this.props.project._id,this.props.match.params.wId);
    }
    axios.get(`/api/${this.props.match.params.wId}/squad/${project._id}/membership`)
         .then(res => {
          if(res.data.success){
          const date = moment(new Date(res.data.projectMember.created_at)).format("DD MMM YYYY");
            this.setState({membership:date})
          }
         })
  }

  
  render() {
    const {project} = this.props;
    const {membership} = this.state;
    const color = project.color + '07';
    const sidebarItemBackground = project.color + '19';
    const borderValue  =  '2px solid ' + project.color;
    const projColor = project.color;
    let  paymentStatus = this.props.paymentHeader.billing_status;
    return (
      <div className="project-setting-page-container">
        {/* <div className="d-flex flex-column project-setting-sidebar">
        {this.state.showSidebarItem === "basic details" ?
          <div className="d-flex project-setting-sidebar-item proj-setting-common-pointer" 
                style={{backgroundColor:sidebarItemBackground,borderRight:borderValue,color:projColor}} 
                onClick={this.setBasicDetailsView}>
            Basic Details
          </div>
           :
          <div className="d-flex project-setting-sidebar-item proj-setting-common-pointer" 
                onClick={this.setBasicDetailsView}>
                Basic Details
          </div>
          }
          {this.state.showSidebarItem === "advanced setting" ? 
          <div className="d-flex project-setting-sidebar-item proj-setting-common-pointer" 
               style={{backgroundColor:sidebarItemBackground,borderRight:borderValue,color:projColor}} 
               onClick={this.setAdvancedView}>
            Advanced
           </div> :
           <div className="d-flex project-setting-sidebar-item proj-setting-common-pointer" 
                onClick={this.setAdvancedView}>
                Advanced
           </div> 
          }
          
        </div> */}
        <div className={paymentStatus === ("grace" || "grace_payment_failed") ? "project-setting-content_grace" : "d-flex flex-column project-setting-content"}>
        <div className="project-settings-header-bar">Project Settings</div>
          {/* {this.state.showSidebarItem === "basic details" && <BasicDetails project={project}/>}
          {this.state.showSidebarItem === "advanced setting" && <AdvancedSetting project={project} membership={membership}/>} */}
           <div className="row">
             <div className="col-sm-9 project-setting-common-sub-content">
             <BasicDetails project={project}/>
             </div>
           </div>
           
            <div className="row advanced-settings-toggle-btn">
             <div className="d-flex proj-setting-common-pointer col-sm-8 project-setting-common-sub-content  justify-content-center align-items-center"  onClick={this.setAdvancedView}>
             <div className = "d-flex justify-content-center Add_more_button">
             <div className="">Advanced Settings</div>
              {this.state.advancedSettings ? <i class="material-icons-round">keyboard_arrow_up</i>
                                         : <i class="material-icons-round">keyboard_arrow_down</i>
               }
            </div>
            </div>
            
           </div>
           <div className="row">
             <div className="col-sm-9 project-setting-common-sub-content">
             {this.state.advancedSettings && <AdvancedSetting project={project} membership={membership}/>}
             </div>
           </div>
          {/* <BasicDetails project={project}/>
          <AdvancedSetting project={project} membership={membership}/> */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state =>({
  project:state.projects.project,
  paymentHeader : state.common_reducer.workspace
})

export default withRouter(connect(mapStateToProps, {getStatuses,getProject,getProjectUserEmailTaskSetting})(ProjectSettingsPage))



