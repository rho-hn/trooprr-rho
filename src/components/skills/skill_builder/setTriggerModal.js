import  { Modal, Button,Card,Row, message } from "antd";
import React, { Component } from 'react';
import {connect} from "react-redux";
import {getServiceOperations,createNode, createEmptySkill} from "./skillBuilderActions";
import { withRouter } from "react-router-dom";
import OperationConfig from "./createSkillModal/operationConfig"
import SkillCreation from './emptySkillCreation';
import RandomEmoji from '../../common/randomImageGenerator';

class TriggerModal extends Component {
    constructor(props){
	    	super(props)
		    this.state = {
            isLoading: false,
            currentOperation:null,
            data:{},
            currentService:null,
            error:false,
            view: 'skill_creation_first',
            descData:{},
            disabled:false
    };
  }
  

  changeView = (view) => {
     this.setState({view: view});
  }

  handleOk = () => {
    this.setState({
      isLoading: true,
    });
}

  onClickService  =(service) => {
      this.props.getServiceOperations(service._id).then(operations => {
      this.setState({currentService:service,
          view:"operations",
        });
      })
  }

  randomEmoji = () => {
    // const { emoji } = this.props;
    return RandomEmoji[Math.floor(Math.random() * RandomEmoji.length)]
  }


  verifyNodeParam=(data)=>{
    let _obj={isError:false,errors:{},type:"required_field_missing"}
    
  
    this.state.data.skillData.paramSchema.forEach(param=>{
  
    if(param.required &&  param.type!== "Boolean"){
        if(!data[param.key]){
          _obj.isError=true
          _obj.errors[param.key]=param.name +" is required"
  
         
        }
  
    }
  
  
   })
  
  
   return _obj
  }

  onSubmit=(e)=>{
    this.setState({
      disabled:true
    })

    let   parmasData= Object.assign({},this.state.data);

    delete parmasData.skillData
    
    this.setState({error:{}})
    let isValidNode=this.verifyNodeParam(parmasData)



if(!isValidNode.isError){
  let desc=""

    let operation_type=this.state.data.skillData.operation

    // console.log(operation_type)
if(operation_type=="get_issues_by_JQL"){
   desc= `Get Jira issues by JQL: ${this.state.data.JQL}`
}else if(operation_type== "continue_if_count"){
    // let node_id=this.state.data.aggregation_field.split(".")[0]
   desc= `Continue only if Count of items in ${this.state.descData.aggregation_field} response is  ${this.state.data.op} ${this.state.data.op_value}`

}else if(operation_type=="continue_if_sum"){
    let node_id=this.state.data.aggregation_field.split(".")[0]
    let nodeObj=this.props.nodes.find(node=>(node._id==node_id))
    let nodeName="Not found"
    if(nodeObj){
      nodeName=nodeObj.name
    }
   desc= `Continue only if SUM of ${ this.state.descData.aggregation_field} in ${nodeName} response is ${this.state.data.op}  ${this.state.data.op_value}`
}else if(operation_type=="everyweek_at"){
   desc= `Everyweek ${this.state.descData.dow}  at ${this.state.descData.tod} ${this.state.descData.tz}`
}else if(operation_type==="everyday_at"){

    desc=`Everyday at  ${this.state.descData.tod} ${this.state.descData.tz}`
}else if(operation_type=="send_msg"){
  
    desc=`Slack message to channel #${this.state.descData.slackChannel}`
}else if(operation_type=="send_jira_issues"){
desc=`Send list of Jira issues from ${this.state.descData.nodeId} #${this.state.descData.slackChannel}`
}else if(operation_type=="invokeCustomJSFunction"){
desc="Invoke a custom javascript function"

}else if(operation_type==="user_message"){
  
  
  desc=`When user send the message ${this.state.data.trigger_phrase}`


}

    
    
      let data={
        name:this.state.data.skillData.operationName,
        // service:this.state.currentService.name,
        operation:this.state.data.skillData.operation,
        workspace_id:this.props.match.params.wId,
         params:parmasData,
        desc:desc,
        type:"trigger",
        is_root: true,
        
  }


     let skill_data = {
       name:this.state.data.skillData.skillName,
       workspace_id:this.props.match.params.wId,
       desc:"No Description",
       type:'custom',
       logo: {type:"emoji",emoji:this.randomEmoji()}

     } 
        
    this.props.createEmptySkill(this.props.match.params.wId, skill_data).then(res => {
        if(res.data.success){
        
       
            data.skill_id = res.data.skill._id
             this.props.createNode(this.props.match.params.wId,data).then(nodeRes=>{
              if(nodeRes.data.success){
                  this.setState({loading : false})
                  this.props.history.push(`/${this.props.match.params.wId}/skill/${res.data.skill._id}/skillbuilder`)
                  this.props.onCancel()
                }else{
                    nodeRes.data.error.isError=true
                 
               this.setState({error:nodeRes.data.error,loading:false}) 
                }
                  
               
            
                //   this.setState({error:res.data.error})}
               })
            }else{
                this.setState({loading : false})
                message.error("Something went wrong")
            }
         })
        }else{

            this.setState({loading:false,error:isValidNode})
        }
}
    
  render() {
     
      const { isLoading, view } = this.state;
      // console.log("this.state.data====>",this.state.data)
    return (
     <Modal
          title="Title"
          visible={this.props.visible}
          onOk={this.handleOk}
          footer={null}
          confirmLoading={isLoading}
          onCancel={this.props.onCancel}>
         {view === "skill_creation_first" && 
            <div>
               <SkillCreation 
                   onNext={() => this.changeView('skill_creation_second')}
                   data={this.state.data}
                />
            </div>
         }


         { view === "skill_creation_second" && this.state.data.skillData.paramSchema && <div>
              {this.state.data.skillData.paramSchema.map((schema,index)=>( 
                  <OperationConfig 
                      schema={schema} 
                      key={index} 
                      onChange={this.onChange} 
                      nodes={this.props.nodes} 
                      data={this.state.data} 
                      currentOperation={this.state.currentOperation}
                      descData={this.state.descData}
                      error={this.state.error && this.state.error.isError &&  this.state.error.type=="required_field_missing"?this.state.error.errors[schema.key]:null}
                    />
             ))}


     {this.state.error.isError  && this.state.error.type!=="required_field_missing" && <div className="error_message">{this.state.error.message} {this.state.error.type=="team_not_linked" && this.getConnectButton()}</div>}   
        
               <Row type="flex" justify="end">
                  <Button type="primary" disabled={this.state.disabled} onClick={this.onSubmit}>Create</Button>
               </Row>
         </div>
      }
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    skillService:state.skill_builder.services,
    operations:state.skill_builder.operations,
  // skillSetData: state.skills.skillSetData,
}};


export default withRouter(connect(mapStateToProps, {createEmptySkill,getServiceOperations,createNode

 })(TriggerModal)); 

