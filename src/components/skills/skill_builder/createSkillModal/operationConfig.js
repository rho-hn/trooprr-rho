import React, { Component } from 'react';
import {connect} from "react-redux";
import {getServiceOperations} from "../skillBuilderActions";
import CustomSelect from './select.js'
import CustomRadio from './radio.js'
import NodeSelect from './nodeSelect'
import ChannelSelect from "./channel"
import DynamicSelect from "./dynamicSelect"
import DynamicFieldSelect from "./dynamicFieldSelect"




//CONFIG 

class OperationConfig extends Component {
  state = {
      [this.props.schema.key]:this.props.data[this.props.schema.key]?this.props.data[this.props.schema.key]:""
  };

onChange=(e,value)=>{
// console.log(value)
// console.log(e)


  if(this.props.schema.type!=="Number" || (this.props.schema.type=="Number" && !isNaN(e.target.value))){
     this.setState({[e.target.name]:e.target.value},function(){
  })
    this.props.data[e.target.name]=e.target.value
  }
  if([e.target.name]=="data"){
    this.props.reRenderComponent()
  }
}
// console.log()
 render() {

  //  console.log(this.state[schema.key])
    const {key, schema } = this.props;
    // console.log("props of operatin",this.props)
    return (
        <div key={key} style={{marginBottom:"10px" }}>
         <div className="form_group_label" >{schema.name } {!schema.required && <span className="optional">(Optional)</span>} </div>
          {(schema.type === "Number") && <input type = "text" className = "cutsom_input" onChange={this.onChange} name={schema.key}  value={this.state[schema.key]} placeholder={"Enter value"}   autoComplete="off"/>}
          {(schema.type === "String" )&& <textarea className = "custom_text_area" style = {{width:"100%" }} onChange={this.onChange} name = {schema.key} value={this.state[schema.key]} placeholder={"Enter value"}/>}
      {/* {schema.type=="params_dynamic" &&<p style={{width:"100%" }}>This is dynamic</p>} */}
          {schema.type === "Boolean" && <div>
                  <CustomRadio value={true} name={schema.key}  checked={this.state[schema.key] === "true" ||this.state[schema.key] === true ?true:false} onChange={this.onChange} label="Yes"/>
                  <CustomRadio value={false} name={schema.key}  checked={(!this.state[schema.key]||this.state[schema.key] === "false" )?true:false} onChange={this.onChange} label="No"/>
                </div>
           }

            {/* "key" : "date_field",
            "type" : "jql_fields", */}
            {schema.type === "jql_fields"&& <DynamicFieldSelect keyValue={schema.key} value={this.state[schema.key]} onChange={this.onChange} schema={schema}   nodes={this.props.nodes} currentOperation={this.props.currentOperation} data={this.props.data} currentNodeIndex={this.props.currentNodeIndex} descData={this.props.descData} />}
             {schema.type === "params_dynamic"&& <DynamicSelect keyValue={schema.key} value={this.state[schema.key]} onChange={this.onChange} schema={schema}   nodes={this.props.nodes} currentOperation={this.props.currentOperation} data={this.props.data} currentNodeIndex={this.props.currentNodeIndex} descData={this.props.descData} reRenderComponent={this.props.reRenderComponent}/>}
          {(schema.type === "node_select" || schema.type === "image_url")&& <NodeSelect keyValue={schema.key} value={this.state[schema.key]} onChange={this.onChange} schema={schema}   nodes={this.props.nodes} currentOperation={this.props.currentOperation} currentNodeIndex={this.props.currentNodeIndex}  descData={this.props.descData} />}
          {schema.type === "slack_channel_select" && <ChannelSelect keyValue={schema.key} value={this.state[schema.key]} onChange={this.onChange} schema={schema}   descData={this.props.descData}  nodes={this.props.nodes} />}
          {(schema.type === "tod" || schema.type === "dow" || schema.type === "tz" || schema.type === "Array" )  && <CustomSelect keyValue={schema.key} value={this.state[schema.key]} onChange={this.onChange} schema={schema} descData={this.props.descData} />}
          {/* {(schema.type === "bar_chart_config_count") && <DynamicSelect keyValue={schema.key} value={this.state[schema.key]} onChange={this.onChange} schema={schema}   nodes={this.props.nodes} currentOperation={this.props.currentOperation} currentNodeIndex={this.props.currentNodeIndex} descData={this.props.descData} />} */}
          {/* {(schema.type === "bar_chart_config_sum") && <DynamicSelect keyValue={schema.key} value={this.state[schema.key]} onChange={this.onChange} schema={schema}   nodes={this.props.nodes} currentOperation={this.props.currentOperation} currentNodeIndex={this.props.currentNodeIndex} descData={this.props.descData} />} */}

          {this.props.error && <div className="error_message">{this.props.error}</div>}

      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {  
//     skillService:state.skill_builder.services,
//     operations:state.skill_builder.operations,
//   // skillSetData: state.skills.skillSetData,
}};

export default (connect(mapStateToProps, {
  getServiceOperations
 })(OperationConfig)); 

