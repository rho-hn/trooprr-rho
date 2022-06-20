import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import SkillsetDetails from './skillSetDetails';
import SkillDetails from './skillDetails';
import { createSkill } from './skillBuilderActions'

class CustomCreation extends Component {
	constructor(){
		super()
		this.state = {
             step:'skill_set_form',
             skillSetName: {},
             skillSetId: '',
             skillName: {},
             skilldescription: '',
             skillSetLogo: {} 
		}
	}

	onNext = (step) => {
		this.setState({step: step})
	}
    
	onSubmit = () => {
        let data = {
           name: this.state.skillSetName.name,
           logo:{type:"emoji",emoji: this.state.skillSetLogo.name},
           type: 'custom',
           scope: 'team'
        }
        data.created_by_id=localStorage.trooprUserId
        data.workspace_id=this.props.match.params.wId
        if(data.name){
           this.props.createSkillSet(this.props.match.params.wId, data).then(res => {
        
              if(res.data.success){
                  this.props.history.push(`/${this.props.match.params.wId}/skills`);
                  this.setState({ skillSetId: res.data.skillset._id })
                  let data = {
                    skillset_id : res.data.skillset._id,
                    name: this.state.skillName.name,
                    description: this.state.skilldescription
                  }
                  data.workspace_id=this.props.match.params.wId
                  if(data.name){
                       this.props.createSkill(this.props.match.params.wId, data)
                  }
              }
           })
        }
	}

	render(){
		const { step, skillSetName, skillSetLogo, skillName } = this.state;
        
		return(
             <div>
                {step === "skill_set_form" && 
                   <SkillsetDetails 
                         onNext={() => this.onNext('skill_form')} 
                         skillSetName={skillSetName}
                         skillSetLogo={skillSetLogo}
                    />
                }
                {step === "skill_form" && 
                    <SkillDetails 
                         onSubmit={this.onSubmit}
                         skillSetName={skillSetName}
                         skillSetLogo={skillSetLogo}
                         skillName={skillName}
                    />
                }
             </div>
			);
	}
}

const mapStateToProps = state => {
  return {

}};   

export default withRouter(connect(mapStateToProps, { 

    createSkill 
})(CustomCreation));
