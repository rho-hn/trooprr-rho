import React, { Component } from 'react';
import NavbarBreadCrumbs from '../navbar/navbarBreadCrumbs';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Button, message, Card } from 'antd';
import { createSkill, getSkillTemplates } from './skillBuilderActions';
import TriggerModal from './setTriggerModal.js';
import JiraTemplate from "./JiraTemplate"
import RandomEmoji from '../../common/randomImageGenerator';

class SkillDetails extends Component {
	constructor(){
		super()
		this.state = {
			radioValue: 0,
      loading: false,
      selectedTemplate: {},
      selectedTemplateId: '',
      modalStatus: false,
      templateLoaded: false,
		}
	}

  componentDidMount() {
    this.props.getSkillTemplates().then(res => {
      if(res.data.success){
        this.setState({selectedTemplate: res.data.skill_templates[0], selectedTemplateId: res.data.skill_templates[0]._id, templateLoaded: true})
      }
    })
  }

	setSelectedTemplate = (data, event) => {

		this.setState({
          selectedTemplate: data,
          selectedTemplateId: data._id
        }, () => this.createSkill())
	}

	goToNext = () => {
       const { skillName } = this.state;
         if(skillName){
             this.props.skillName.name = skillName
             this.props.onSubmit()
         }
       }

  redirectToSkillCreationPage = () => {
    // this.props.history.push(`/${this.props.match.params.wId}/skill/skillcreation`)
    this.setState({modalStatus: !this.state.modalStatus})
  }

  createSkill = () => {
          this.setState({loading: true})
          this.props.createSkill(this.props.match.params.wId, this.state.selectedTemplateId).then(res => {
         
            if(res.data.success){
              this.setState({loading : false})
              this.props.history.push(`/${this.props.match.params.wId}/skill/${this.props.skill._id}/skillbuilder`)
            }else{
              this.setState({loading : false})
              message.error("Sorry , No data available. We are working hard to make sure you have a smooth experience.Thank you")
            }
          })

  }
	render(){
    const { skillTemplates } = this.props;
    
    let jiraTemplates=[]
    let JiraChartTemplates=[]
    let OtherTemplates=[]
    
    this.state.templateLoaded&&skillTemplates.forEach(template=>{

      if(template.tag==="jsr"){
        jiraTemplates.push(template)
      }
      else if(template.tag==="jrc"){JiraChartTemplates.push(template)}
      else{OtherTemplates.push(template)}
    })
		return(
          <div>
             <NavbarBreadCrumbs param1="Choose Skill Template"  data={[{name:"Choose Skill Template",url:"/"+this.props.match.params.wId+"/skill/create_skill"}] }  workspace_Id={this.props.match.params.wId}/>
               <div className="template-overflow">
               <div className="template-wrapper" >
                <JiraTemplate name="JiraMoreTemplates" templates={jiraTemplates} templateName="Jira Smart Notifications Templates" selectedTemplate={this.setSelectedTemplate} templateLoaded={this.state.templateLoaded} /> </div>
                <div className="template-wrapper" > <JiraTemplate name="JiraChartTemplates" templates={JiraChartTemplates} selectedTemplate={this.setSelectedTemplate} templateName="Jira Report Chart Templates" templateLoaded={this.state.templateLoaded} /></div>
                <div className="template-wrapper" > <JiraTemplate name="OtherTemplates" templates={OtherTemplates} redirect={this.redirectToSkillCreationPage} selectedTemplate={this.setSelectedTemplate} templateName="Other Skill Templates"  templateLoaded={this.state.templateLoaded}/></div>
                </div>
             
                { this.state.modalStatus && 
                 <TriggerModal 
                   visible={this.state.modalStatus}
                   onOk={this.handleOk}
                   onCancel={this.redirectToSkillCreationPage}
                 />
              }
             </div>
			);
	}
}

const mapStateToProps = state => {
  return {
    skill: state.skill_builder.skill,
    skillTemplates: state.skill_builder.skillTemplates,
    skillTemplateNodes: state.skill_builder
}};   

export default withRouter(connect(mapStateToProps, { createSkill, getSkillTemplates })(SkillDetails));
