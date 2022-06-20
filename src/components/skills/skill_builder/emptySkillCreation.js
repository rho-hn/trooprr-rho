import React, { Component } from 'react';

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Input, Button, message, Radio } from 'antd';
import { createEmptySkill, getServiceOperationsTriggers } from './skillBuilderActions';



class EmptySkillCreation extends Component {
	constructor(){
		super()
		this.state = {
			skillName: '',
      skillDesc: '',
      radioValue: 3,
      paramSchema: {},
      operationName:'',
      operationLabel: ''
		}
	}

  componentDidMount() {
      this.props.getServiceOperationsTriggers().then(res => {
          if(res.data.success){
              return res.data.operations.filter(trigger => {
                 if(trigger.name === "everyweek_at"){
                  this.setState({paramSchema: trigger.params_schema, operationName: trigger.name, operationLabel: trigger.label})
                 }
              })
            }
          }
      )
  }

  onNextScreen = () => {
    const { skillName, paramSchema } = this.state;
    if(skillName && paramSchema){
      this.props.data.skillData = {
         skillName: this.state.skillName,
         paramSchema: this.state.paramSchema,
         operation: this.state.operationName,
         operationName: this.state.operationLabel
      }
       this.props.onNext()
    }else{
      message.error("Error! Enter Skill Details.")
    }
  }

  setSkillData = (event) => {
      this.setState({[event.target.name]: event.target.value})
  }

  setParamsSchema = (value, event, name, label) => {
   
    this.setState({radioValue: event.target.value, paramSchema: value, operationName: name, operationLabel: label})
  }
 

	render(){
    const { operations } = this.props;
		return(
             <div>
              <div style={{display: 'flex', overflow:'auto', padding: '30px'}}>
              <div>
                <div style={{marginBottom: '20px'}}>
                   <Input name="skillName" placeholder="Skill Name" onChange={this.setSkillData} autoComplete="off"/>
                </div>
                <div>
                  <Radio.Group value={this.state.radioValue} style={{display:'flex', flexDirection:'column'}}>
                  {operations.map((operation, index) => {
                    if(operation.type === "trigger"){
                       return <Radio style={{margin: 5}} key={operation._id} value={index} onChange={(event) => this.setParamsSchema(operation.params_schema, event, operation.name, operation.label)}>
                                {operation.label}
                              </Radio>
                    }
                    })}
                </Radio.Group>
                </div>
              	<Button type="primary" style={{marginTop: '10px', marginBottom: '20px'}} loading={this.state.loading} onClick={this.onNextScreen}>Next</Button>
              </div>
              </div>
             </div>
			);
	}
}

const mapStateToProps = state => {
  return {
    skill: state.skill_builder.skill,
    skillTemplates: state.skill_builder.skillTemplates,
    skillTemplateNodes: state.skill_builder,
    operations: state.skill_builder.operations
}};   

export default withRouter(connect(mapStateToProps, { createEmptySkill, getServiceOperationsTriggers })(EmptySkillCreation));
