import React,{Component} from 'react'
import { Modal } from 'antd';
import {getCardTemplates,saveCardSkills,updateCardSkills} from "../CardActions"
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import TriggerStep from "./SelectInvoke";
import SlackStep from "./slackChannel"
import SkillConfiguration from "./gitHubConfigurationIssues"
import JiraSkillConfiguration from '../CardForms';
import GithubColumnConfiguration from "./githubColumnConfiguration"


 class SelectCard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      template:"",
      data:this.props.mode == 'edit' ? Object.assign({},this.props.cardInfo) : {
      slackData:{},
      cardInformation:{},
      triggerInformation:{},
      name:"",
      desc:""
    },
      selectedTemplate:{},
      step:"configure_step",
      buttonDisable:false
    }

    this.onSubmit=this.onSubmit.bind(this)
}
componentDidMount() {
  // console.log("runn",this.props);

/////// old logic ////////
//   if(this.props.mode==="edit"){
// const {cardInfo}=this.props

// let card=Object.assign({},cardInfo)
// // console.log(cardInfo);
// this.setState({data:card})  
//   } 

/////// old logic end (new logic =>> directly assigning the value for "data" in constructor itself) /////
// this.props.getCardTemplates()
}
showModal = () => { 
 
this.setState({
 
  visible: true,
});

}
onSubmit(){



 
  
  // console.log("let submit1")
  // console.log(this.props.saveCardSkills)
  if(this.props.mode==="edit"){
if(this.props.template.key === 'custom_report_2'){
  this.state.data.name= this.props.template.name
}
this.props.updateCardSkills(this.state.data).then(res=>{
  // console.log(this.props);
  this.setState({
    data:{
      slackData:{},
      cardInformation:{},
      triggerInformation:{}
    }

   
  });
  this.props.showModal()

})

  }else{

    this.state.data.workspace_id=this.props.match.params.wId;
    this.state.data.app=   this.props.template.app
   //  this.props.template.app=="Jira"
   this.state.data.name= this.props.template.name
   this.state.data.desc=this.props.template.desc 
   this.state.data.skill_type=this.props.skill_type
    this.setState({buttonDisable:true})
  this.props.saveCardSkills(this.state.data).then(res=>{
    // console.log(res)
    if(res.data.success){
      this.props.cancel("add")
    }
  })
}

// console.log("FINAL DATA",this.state.data)

}
onStepChange=(step)=>{
 
  
this.setState({step:step})
}    

handleCancel = e => {
if(this.props.mode==="edit"){
this.props.showModal()

}
else{
  this.props.cancel()}
  this.setState({
    data:{
      slackData:{},
      cardInformation:{},
      triggerInformation:{}
    }

   
  });
};
 
  render() {

  // console.log("ss======>",this.props);
    return (
  
 
      <div className="flex_column">


        <Modal
          maskClosable={false}
          title={this.props.skill_type == 'app_home' ? "Configure" : this.state.step === "configure_step" ? "Step (1/3): Configure" : (this.state.step === "trigger_step" ? "Step (2/3): Schedule" : "Step (3/3): Deliver")}
          visible={this.props.visible}
          footer={null}
          onCancel={this.handleCancel}
          centered
          bodyStyle={{
             position: "relative",
           
          }}
        >
          {/* {console.log(this.props,"11111111")} */}
          {/* {console.log(this.props.template,"11111111")}  */}
          {this.state.step == "configure_step" && this.props.template.app == "Jira" && <JiraSkillConfiguration data={this.state.data} template={this.props.template} mode={this.props.mode ? this.props.mode : "save"} skill_type={this.props.skill_type} nextStep={this.props.skill_type == "app_home" ? this.onSubmit : () => this.onStepChange("trigger_step")} />}

          {this.state.step == "configure_step" && (this.props.template.app == "GitHub" && this.props.template.key === "get_github_organization_issues") && <GithubColumnConfiguration data={this.state.data} mode={this.props.mode ? this.props.mode : "save"} skill_type={this.props.skill_type} template={this.props.template} nextStep={this.props.skill_type == "app_home" ? this.onSubmit : () => this.onStepChange("trigger_step")} />}
          {this.state.step == "configure_step" && (this.props.template.app == "GitHub" && this.props.template.key !== "get_github_organization_issues") && <SkillConfiguration data={this.state.data} mode={this.props.mode ? this.props.mode : "save"} template={this.props.template} skill_type={this.props.skill_type} nextStep={this.props.skill_type == "app_home" ? this.onSubmit : () => this.onStepChange("trigger_step")} />}

          {this.state.step == "trigger_step" && <TriggerStep mode={this.props.mode ? this.props.mode : "save"} data={this.state.data} nextStep={() => this.onStepChange("slack_step")} prevStep={() => this.onStepChange("configure_step")} />}
          {this.state.step == "slack_step" && <SlackStep /* reportMembers={this.props.reportMembers} */ selectMode={`multiple`} data={this.state.data} buttonDisable={this.state.buttonDisable} nextStep={this.onSubmit} mode={this.props.mode ? this.props.mode : "save"} prevStep={() => this.onStepChange("trigger_step")} />}

        </Modal>
</div>
  
      
    )
  }
}

export default withRouter(connect(null,{getCardTemplates,saveCardSkills,updateCardSkills})(SelectCard))







// <div className="form_group_label" >Card Project Type </div>
// <Select
//   showSearch
//   // 
//   placeholder="Select a project type"
//   optionFilterProp="children"
//   onChange={(value,data)=>this.onChange(value,data)}
//   style={{ width: "100%" }}
//   // name="prjType"
//   value={this.state.template}
//   filterOption={(input, option) =>
//   option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 }>  

//   {this.props.teamplates.map((item, index) => (
//      <Option key={index} name="selectedCard" value={item.key}>
//   {item.name}
//   </Option>
//   ))
//   }
    
// </Select>