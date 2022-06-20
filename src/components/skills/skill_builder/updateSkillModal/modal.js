import  { Modal, Button,Row } from "antd";
import React, { Component } from 'react';
import {connect} from "react-redux";
import {updateNode,deleteNode} from "../skillBuilderActions";
import { withRouter } from "react-router-dom";
import OperationConfig from "../createSkillModal/operationConfig"



class UpdateNodeModal extends Component {
    constructor(){
		super()
		this.state = {
  

    isLoading: false,
    currentOperation:null,
    data:{},
    currentService:null,
    updating:false,
    deleting:false,
    descData:{},
    reRender:false,
    error:{}
  };

  this.getConnectButton=this.getConnectButton.bind(this)
 }

 getConnectButton(){
  let connectUrl="https://app-stage.troopr.io/"+this.props.match.params.wId+"/jira_domain_oauth"

return  <a href={connectUrl} target="_blank">Connect</a>

} 
//   currentNode
  
  componentDidMount(){
    let params={}
    let error={}
if(this.props.currentNode.params){
  params=this.props.currentNode.params
 
}
let validation=this.props.currentNode.validation
if(validation && validation.status=="inValid"  ){
 
  error=validation.error
  error.isError=true

}
this.setState({data:params,error:error })


    

  }
      

   
verifyNodeParam=(data)=>{
  let _obj={isError:false,errors:{},type:"required_field_missing"}
  

 this.props.currentNodeOperation.params_schema.forEach(param=>{

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
   this.setState({updating:true,error:{}})



let isValidNode=this.verifyNodeParam(this.state.data)

if(!isValidNode.isError){
  let desc=""
let operation_type=this.props.currentNode.operation
if(operation_type=="get_issues_by_JQL"){
   desc= `Get Jira issues by JQL: ${this.state.data.JQL}`
}else if(operation_type== "continue_if_count"){
    // let node_id=this.state.data.aggregation_field.split(".")[0]
   desc= `Continue only if Count of items in ${this.state.descData.aggregation_field} response is  ${this.state.data.op} ${this.state.data.op_value}`
}else if(operation_type=="continue_if_sum"){
    let node_id=this.state.data.aggregation_field.split(".")[0]
    let nodeObj=this.props.nodes.find(node=>(node.key==node_id))
    let nodeName="Not found"
    if(nodeObj){
      nodeName=nodeObj.name
    }
   desc= `Continue only if SUM of ${ this.state.descData.aggregation_field} in ${nodeName} response is ${this.state.data.op}  ${this.state.data.op_value}`
}else if(operation_type=="everyweek_at"){
   desc= `Everyweek ${this.state.descData.dow}  at ${this.state.descData.tod} ${this.state.descData.tz}`
}else if(operation_type=="everyday_at"){

    desc=`Everyday at  ${this.state.descData.tod} ${this.state.descData.tz}`
}else if(operation_type=="send_msg"){
  
    desc=`Slack message to channel #${this.state.descData.slackChannel}`
}else if(operation_type=="send_jira_issues"){
desc=`Send list of Jira issues from ${this.state.descData.nodeId} #${this.state.descData.slackChannel}`
}else if(operation_type=="invokeCustomJSFunction"){
desc="Invoke a custom javascript function"

}else if(operation_type==="user_message"){
        desc=`When user send the message ${this.state.data.trigger_phrase}`

} else if(operation_type === "bar_chart_aggregate_count"){
  desc = `Create a barchart based on Count of items`
}
else if(operation_type === "bar_chart_aggregate_sum"){
  desc = `Create a barchart based on Sum of values`
}   else if(operation_type === "get_issues_by_date"){
  desc = `Get Jira Issues by Date field: ${this.state.descData.date_field} for Date Range: ${this.state.descData.date_range}`
}


 
let data={
    operation:operation_type,
    params:this.state.data,
    desc:desc
  }

 

    this.props.updateNode(this.props.currentNode.workspace_id,this.props.currentNode._id,data).then(res=>{
      if(res.data.success){
          this.props.closeModal()
          // this.setState({updating:false})
        }else{
          res.data.error.isError=true
       
     this.setState({error:res.data.error,updating:false}) 
      }
        
         })
  }else{

    this.setState({updating:false,error:isValidNode})

  }
}

    deleteNode=()=>{
        this.setState({error:false,deleting:true})
    this.props.deleteNode(this.props.currentNode.workspace_id,this.props.currentNode._id).then(res=>{

    if(res.data.success){
        this.props.closeModal()
        // this.setState({deleting:false})
      }else{
        
        this.setState({error:{isError:true,type:"delete_error",message:"Error while deleting node"},deleting:false})
    }
      
    
}) 
    }

    getNode=(key)=>{
      if(key=="x-axis" || key=="y-axis-field"){
        if(this.state.data){
            let channel= this.props.nodes.find(node=>node.key==this.state.data.data)
            if(channel){
              return [channel]
            }else{
              return []
            }
         
        }else{
return []
        }
      }else{
        return this.props.nodes
      }


    }


 
    reRenderComponent=()=>{
      this.setState({reRender:true})

    }
  render() {

    //   console.log(this.props)
    const {isLoading} = this.state;
    return (
    <Modal
          title={this.props.currentNode.name}
          visible={this.props.visible}
          
          footer={null}
          confirmLoading={isLoading}
          onCancel={this.props.closeModal}
          
        >
  
  {this.props.currentNodeOperation.params_schema.map((schema,index)=>( 
           
           
           <OperationConfig schema={schema} key={index} onChange={this.onChange} data={this.state.data}   nodes={this.getNode(schema.key)}  currentOperation={ this.props.currentNodeOperation} currentNodeIndex={this.props.currentNodeIndex} reRenderComponent={this.reRenderComponent}  descData=  {this.state.descData} error={this.state.error && this.state.error.isError &&  this.state.error.type=="required_field_missing"?this.state.error.errors[schema.key]:null}/>
           

     ))}


       {this.state.error.isError  && this.state.error.type!=="required_field_missing" && <div className="error_message">{this.state.error.message} {this.state.error.type=="team_not_linked" && this.getConnectButton()}</div>}           <Row type="flex" justify="space-between">
        
           {!this.props.currentNode.is_root? <Button type="danger" onClick={this.deleteNode} loading={this.state.deleting}>Remove</Button>:<div></div>}
       <Button type="primary" onClick={this.onSubmit} loading={this.state.updating}>Update</Button>
    </Row>
</Modal>

    );
  }
}
const mapStateToProps = (state) => {
//   console.log(state)
  return {
  
    // skillService:state.skill_builder.services,
    currentNodeOperation:state.skill_builder.currentNodeOperation,
  // skillSetData: state.skills.skillSetData,
}};


export default withRouter(connect(mapStateToProps, {updateNode,deleteNode

 })(UpdateNodeModal)); 

