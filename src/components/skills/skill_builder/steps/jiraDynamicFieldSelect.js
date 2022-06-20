import React, { Component } from 'react';
import {connect} from "react-redux";
import {getJiraIssueNodeFields} from "../skillBuilderActions";
import { withRouter } from "react-router-dom";




import  { Select } from 'antd';
const {Option } = Select;


class DynamicFieldSelect extends Component {
  state = {
    selectArr:[],
    currentData:"",
    [this.props.field.key]:""
  };


 componentDidMount=()=>{
    if(this.props.data[this.props.field.key]){
        this.setState({
            [this.props.field.key]: this.props.data[this.props.field.key]
           })
    }

}

 getOptions=()=>{ 
    let  selectArr=[]
   if (this.props.fields.length>0){
  
    if(this.props.template.key=="jira_burn_down_chart"){
        let arr=[
         { "name":"Issue Count",
            "value":"issueCount_"},

                { "name":"Remaining Time Estimate",
            "value":"field_timeestimate"},
                { "name":"Original Time Estimate",
            "value":"field_timeoriginalestimate"}
           
  ]
  // console.log("this.props.data.board.type",this.props.data.board,this.props.fields)
   let storyPoint= this.props.data.board && this.props.data.board.type=="simple"?this.props.fields.find(item=>(item.text=="Story point estimate"&& item.type =="number")):this.props.fields.find(item=>(item.text=="Story Points" &&item.type=="number"))
  //  console.log(storyPoint)
  
   if(storyPoint){
    let storyPointArr=storyPoint.value.split(".")
    arr.push({name:storyPoint.text,
    value:"field_"+storyPointArr[storyPointArr.length-1]
})
   }

 
 selectArr=arr.map(item=>{
     return  <Option   key={item.value} value={item.value}>{item.name}</Option>
    })

 }else if(this.props.template.key=="workload_chart_jira" && this.props.field.key=="field"){
     let typeArr=["issuetype",
        "project",
        "user",
        "status",
        "resolution",
        "priority",
        "option"]
    this.props.fields.forEach(item => {
        if(typeArr.find(i=>(item.type==i))){
            let value=item.value.split(".").slice(1).join(".")
  
            
            selectArr.push( <Option   key={item.value} value={value}>{item.text}</Option>)
        }

    });


 }else if(this.props.template.key=="workload_chart_jira" && this.props.field.key=="time_field"){
 
 let arr=[
     {"text":"Original Estimate",
     "value":"fields.timeoriginalestimate",
     "type":"number"},
 {"text":"Current Estimate",
 "value":"fields.timeestimate",
 "type":"number"},
 {"text":"Time Spent",
 "value":"fields.timespent",
 "type":"number"}

 ]
 selectArr=arr.map(item=>{
    return  <Option   key={item.value} value={item.value}>{item.text}</Option>
   })

 
    }
}
return selectArr
    }
 
    
  componentWillReceiveProps(props,state){
    if(!this.props.data[this.props.field.key] && props.data[this.props.field.key]){
        this.setState({
            [props.field.key]: props.data[this.props.field.key]
           })
    }
  }

    
         





 
    



 onBlur=() =>{
  }
  
  onFocus=()=> {
  }
  
   onSearch=(val)=> {
  }

 onChange=(value,select_data)=>{
// console.log(value)
    this.props.data[this.props.field.key]=value
    // console.log(this.props.data)
    this.setState({
     [this.props.field.key]:value
    })
    // let data={target:{name:this.props.keyValue,value:value}};
    // this.setState({
    //   currentData:data
    // })
    // console.log("data",data)
    // this.props.onChange(data)
  
   
  
 }

  render() {


    return (

        <div > 
        <div className="form-divide">       
       { this.props.field.label} </div>

          <Select
        showSearch
        style={{ width: "100%" }}
        name={this.props.template.key}
        placeholder="Select a value"
        optionFilterProp="children"
        value={this.state[this.props.field.key]}
        onChange={this.onChange}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onSearch={this.onSearch}
        disabled={!this.props.data.boardId}
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

      
        
      </div>
     


 


  

    );
  }
}

    
const mapStateToProps = (state) => {
    return {  

//  fields: state.skill_builder.fields,
  }};
  
  export default withRouter(connect(mapStateToProps, {
    getJiraIssueNodeFields
   })(DynamicFieldSelect)); 


