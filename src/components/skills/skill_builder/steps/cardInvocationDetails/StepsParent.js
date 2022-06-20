import React, { Component } from 'react'

import './steps.css';
import { Steps, Button, message } from 'antd';
import StepOne from "./SelectCard"
import StepTwo from "./SelectInvoke"
import StepFinal from "./slackChannel"
import {saveCardSkills} from "../CardActions"
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
const { Step } = Steps;
class StepsParent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      step_one_fields:{
        selectedCard:''
      },
      step_two_fields:{
        selectedDay:'',
        timeOfDay:'',
        timeZone:'',
        triggerPhrase:''

      },
      step_final_fields:{
        slack_msg:"",
        slackChannel:"",
        skillName:""
      },
      show_final_values:false
    };
  }

  
  handleNextButton = () => {
    const { step } = this.state;
    this.setState({step: step+1});
}

handleBackButton = () => {
    const { step } = this.state;
    this.setState({step: step-1})
}

handleConfirmButton = (values) => {
 
    const { step_final_fields } = this.state;

    this.setState({ step_final_fields: {
        ...step_final_fields,
        ...values
    }},()=>{
    
      let data={}
      data. workspace_id=this.props.match.params.wId;
      data.user_id=localStorage.getItem("trooprUserId")
      data.cardInformation=this.state.step_one_fields.selectedCard
      data.slackData=this.state.step_final_fields
      data.cardSkillName=this.state.step_final_fields.skillName
      data.triggerInformation=this.state.step_two_fields
      this.props.saveCardSkills(data).then(res=>{
        if(res.data.success){
          this.props.history.push(
            `/${this.props.match.params.wId}/skills`
          );
        }
      })
    })
  
}

getFinalStepValue = (values) => {
    const { step_final_fields } = this.state;
    this.setState({ step_final_fields: {
        ...step_final_fields,
        ...values
    }});
}

getStepOneValue = (values) => {
    const { step_one_fields } = this.state;
    this.setState({step_one_fields: {
        ...step_one_fields,
        ...values
    }})
}

getStepTwoValue = (values) => {
    const { step_two_fields } = this.state;
    this.setState({step_two_fields: {
        ...step_two_fields,
        ...values
    }})
}

  render() {
    const { step, step_one_fields, step_two_fields, step_final_fields } = this.state;
    
        if(step === 1) {
           
             return   <div className="steps_wrapper_class">
             
                     <h6 className="steps_card">Select a Assistant Card</h6> 
                    <StepOne {...step_one_fields} handleNextButton={this.handleNextButton} submittedValues={this.getStepOneValue} />
                </div>
          
        }
        else if(step === 2) {
          
              return  <div className="steps_wrapper_class1">
                    {/* { <h6 className="steps_card1"> Select A trigger </h6>} */}
                    <StepTwo {...step_two_fields} handleNextButton={this.handleNextButton} handleBackButton={this.handleBackButton} submittedValues={this.getStepTwoValue} />
                </div>
            
        }
        else {
            
             return   <div className="steps_wrapper_class2">
           
                    {/* { <h6 className="steps_card2"> Select a  slackchannel </h6> } */}
                    <StepFinal {...step_final_fields} handleConfirmButton={this.handleConfirmButton} handleBackButton={this.handleBackButton} submittedValues={this.getFinalStepValue} style={{}}/>
                  
                </div>
            
        }
      
  }
}


export default withRouter(
  connect(null, { saveCardSkills })(StepsParent)
)