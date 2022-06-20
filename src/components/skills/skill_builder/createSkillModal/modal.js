import { LoadingOutlined } from '@ant-design/icons';
import { Modal, Button, Card, Row } from "antd";
import React, { Component } from 'react';

import {connect} from "react-redux";
import {getServiceOperations,createNode} from "../skillBuilderActions";
import OperationCard from "./serviceOperation"
import { withRouter } from "react-router-dom";

import OperationConfig from "./operationConfig"


const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
class SkillModal extends Component {


  constructor(){
		super()
		this.state = {
      ModalText: 'Content of the modal',
      isLoading: false,
      view:"services_list",
      currentOperation:null,
      data:{},
      currentService:null,
      error:{},
      creating:false,
      descData:{},
      jql:""
    };

    this.getConnectButton=this.getConnectButton.bind(this)
  }
  

  getConnectButton(){
    let connectUrl="https://app-stage.troopr.io/"+this.props.match.params.wId+"/jira_domain_oauth"
 
  return  <a href={connectUrl} target="_blank">Connect</a>
 
  } 
  handleOk = () => {



    this.setState({
      ModalText: 'The modal will be closed after two seconds',
      isLoading: true,
    });

   
    setTimeout(() => {
        this.props.closeModal()
      this.setState({
  
        isLoading: false,
      });
    }, 1000);
  };


  onClickService=(service)=>{

   this.setState({isLoading:true}) 
      this.props.getServiceOperations(service._id).then(operations=>{


        this.setState({currentService:service,
  
          view:"operations",
          isLoading:false
          
        });
      })

  }

  onClickOperation=(operation)=>{

  
     
      this.setState(  {
        view:"configuration",
        currentOperation:operation,
        data:{}
      });
      
}
getNode=(key)=>{
  if(key=="x-axis" || key=="y-axis-field"){
    if(this.state.data.data){
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

verifyNodeParam=(data)=>{
  let _obj={isError:false,errors:{},type:"required_field_missing"}
  

 this.state.currentOperation.params_schema.forEach(param=>{

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

  this.setState({error:false,creating:true})
  // if(this.state.data && this.state.data.JQL){
  //   this.setState({
  //       jql:this.state.data.JQL
  //   })
  // }

  let isValidNode=this.verifyNodeParam(this.state.data)

  if(!isValidNode.isError){
 
  let desc=""
    let operation_type=this.state.currentOperation.name

 
    
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
    else if(operation_type === "bar_chart_aggregate_count"){
      desc = `Create a barchart based on Count of items`
    }
    else if(operation_type === "bar_chart_aggregate_sum"){
      desc = `Create a barchart based on Sum of values`
    }   else if(operation_type === "get_issues_by_date"){
      desc = `Get Jira Issues by Date field: ${this.state.descData.date_field} for Date Range: ${this.state.descData.date_range}`
    }
  
   
   
    let data={
      name:this.state.currentOperation.label,
      service:this.state.currentService.name,
      operation:this.state.currentOperation.name,
      workspace_id:this.props.match.params.wId,
      params:this.state.data,
      skill_id:this.props.match.params.skill_id,
      parent_id:this.props.parent._id,
      desc:desc,
      type:"action"
    }
   this.props.createNode(this.props.match.params.wId,data).then(res=>{
  
  if(res.data.success){
    
      this.props.closeModal()
      // this.setState({updating:false})
    }else{
      res.data.error.isError=true
   
 this.setState({error:res.data.error,creating:false}) 
  }
    
     })
}else{

this.setState({creating:false,error:isValidNode})


 }
}
 
  render() {

    // console.log("jql------------>",this.state.jql)
    
    //   console.log(this.props)
    const {view} = this.state;
    return (

    <Modal
          title="Create Action"
          visible={this.props.visible}
          onOk={this.handleOk}
          footer={null}

          onCancel={this.props.closeModal}
          
        >

 {view ==="services_list" && 
        this.props.skillService.filter(item=>item.name!=="Scheduler").map(service=>(

        <div onClick={()=>this.onClickService(service)} key={service._id} style={{marginBottom:"10px" }}>
          <Card style={{ width: "100% ",cursor:"pointer"}} bodyStyle={ {padding:"12px"}} >
            <div  style={{ fontSize: "14px ",fontWeight: 700}} >{service.name}</div>
            <div>{service.desc}</div>
          </Card>
        </div>


        ))}
       
        { view ==="operations" && this.props.operations.filter(item=>item.type!=="trigger").map(operation=>(
        <OperationCard onClick={()=>this.onClickOperation(operation)}  currentService={this.state.currentService} key={operation._id} operation={operation}   parent = {this.state.parent} /> 
             ) )   
         }

   { view ==="configuration" &&this.state.currentOperation&& <div>
   {
           this.state.currentOperation.params_schema.map((schema,index)=>( 
            <OperationConfig schema={schema} key={index} onChange={this.onChange} nodes={this.getNode(schema.key)} data={this.state.data} currentOperation={this.state.currentOperation}    currentNodeIndex={this.props.createNodeIndex} descData={this.state.descData} reRenderComponent={this.reRenderComponent} error={this.state.error && this.state.error.isError &&  this.state.error.type=="required_field_missing"?this.state.error.errors[schema.key]:null}/>
            ))
     }

    {this.state.error.isError  && this.state.error.type!=="required_field_missing" && <div className="error_message">{this.state.error.message} {this.state.error.type=="team_not_linked" && this.getConnectButton()}</div>}       
    

     <Row type="flex" justify="end">
       <Button type="primary" onClick={this.onSubmit} loading={this.state.creating}>Create</Button>
    </Row>

 </div>
  }
    
   {/* </div> } */}
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


export default withRouter(connect(mapStateToProps, {getServiceOperations,createNode

 })(SkillModal)); 

