import React, { Component } from 'react';
import {connect} from "react-redux";
import {getJiraIssueNodeFields} from "../skillBuilderActions";
import { withRouter } from "react-router-dom";

import { getJiraBoardSprint } from "../../skills_action";


import  { Select } from 'antd';
const {Option } = Select;


class BoardSprintSelect extends Component {
  state = {
    selectArr:[],
    currentData:"",
    [this.props.field.key]:""
  };


 componentDidMount=()=>{
    // console.log("running againrunning againrunning againrunning againrunning againrunning again",this.props)
    if(this.props.data[this.props.field.key]){
        
        // console.log("CDID nd condition",)
        this.setState({
         [this.props.field.key]: this.props.data[this.props.field.key]
        })
    }


    if(this.props.boardId){
        this.props.getJiraBoardSprint(this.props.match.params.wId ,this.props.boardId ,"state=active")

    }
    //  this.props.getBoardSprints(this.props.boardId)

}
componentWillReceiveProps=(props,state)=>{

if(props.boardId && this.props.boardId!==props.boardId){
    this.props.getJiraBoardSprint(this.props.match.params.wId ,props.boardId)
  
   
}
if(!this.props.data[this.props.field.key] && props.data[this.props.field.key]){
    // console.log("IST CONDITION",)
    this.setState({
        [props.field.key]: props.data[this.props.field.key]
       })
}else if(this.props.boardId!==props.boardId &&  props.data[this.props.field.key]){
    // console.log("2nd condition",)
    this.setState({
        [props.field.key]: ""
       })
}
// console.log("componentWillReceivePropscomponentWillReceivePropscomponentWillReceivePropscomponentWillReceiveProps")
    // console.log(props)
    // console.log(state)

}
getDerivedStateFromProps=(props, state)=>{
    // console.log("received new props")

    //     console.log(props)
    //     console.log(state)

}

 getOptions=()=>{ 
    let selectArr=[]
 

      if(this.props.boardId){
         selectArr= this.props.sprints.map(item=>{
            return  <Option   key={item.id} value={item.id}>{item.name}</Option>
           })
    
        
          
      }
      return selectArr
      
    }
 
    
  

    
         





 
    



 onBlur=() =>{
  }
  
  onFocus=()=> {
  }
  
   onSearch=(val)=> {
  }

 onChange=(value,select_data)=>{


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
// console.log(this.props.data,"what is this")


    return (
        <div > 
        <div className="form-divide">
       { this.props.field.label}</div>
        <Select
        showSearch
        style={{ width: "100%" }}
        name={this.props.template.key}
        placeholder="Select a value"
        optionFilterProp="children"
        value={this.state[this.props.field.key]}
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


 


  </div>

    );
  }
}

    
const mapStateToProps = (state) => {
    return {  
       sprints:state.skills.jiraSprints
  }};
  
  export default withRouter(connect(mapStateToProps, {
    getJiraIssueNodeFields,
    getJiraBoardSprint
   })(BoardSprintSelect)); 


