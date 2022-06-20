import React, { Component } from 'react';
import {connect} from "react-redux";
import {getJiraIssueNodeFields} from "../skillBuilderActions";
import { withRouter } from "react-router-dom";




import  { Select } from 'antd';
const {Option } = Select;


class DynamicFieldSelect extends Component {
  state = {
    selectArr:[],
    currentData:""
  };


 componentDidMount=()=>{
    let   query=""
    if(this.props.schema.key=="date_field"){
        query ="date,datetime"
    }
    this.props.getJiraIssueNodeFields(this.props.match.params.wId,query)
}

 getOptions=()=>{ 
    
   let  selectArr= this.props.fields.map(item=>{
        if(this.props.value && this.props.value==item.value){
            this.props.descData[this.props.keyValue]=item.text
        }
   return  <Option   key={item.value} value={item.value}>{item.text}</Option>
})


return selectArr
    }
 
    
  

    
         





 
    



 onBlur=() =>{
  }
  
  onFocus=()=> {
  }
  
   onSearch=(val)=> {
  }

 onChange=(value,select_data)=>{

    this.props.descData[this.props.keyValue]=select_data.props.children
    let data={target:{name:this.props.keyValue,value:value}};
    // this.setState({
    //   currentData:data
    // })
    // console.log("data",data)
    this.props.onChange(data)
  
   
  
 }

  render() {
// console.log(this.props.fields,"what is this")


    return (
        <Select
        showSearch
        style={{ width: "100%" }}
        name={this.props.keyValue}
        placeholder="Select a value"
        optionFilterProp="children"
        value={this.props.value}
        onChange={(value,select_data)=>this.onChange(value,select_data)}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onSearch={this.onSearch}
        filterOption={(input, option) =>{
            // console.log(option)
            if(typeof (option.props.children)=="string"){
              return   option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }else{

           
                  return    option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0

            
            }

        }}
      >
      
{this.getOptions()}

     
    
      </Select>


 


  

    );
  }
}

    
const mapStateToProps = (state) => {
    return {  

 fields: state.skill_builder.fields,
  }};
  
  export default withRouter(connect(mapStateToProps, {
    getJiraIssueNodeFields
   })(DynamicFieldSelect)); 


