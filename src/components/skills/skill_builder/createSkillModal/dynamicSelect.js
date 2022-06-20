import React, { Component } from 'react';

import  { Select } from 'antd';
const { OptGroup,Option } = Select;

class CustomSelect extends Component {
  state = {
    selectArr:[],
    currentData:""
  };

//   function onChange(value) {
//     console.log(`selected ${value}`);
//   }
//   componentDidMount(){
 

//  }
 

 getOptions=()=>{
let selectArr=[]
let arr=[]
     if(this.props.currentNodeIndex){
         arr=Array.from(this.props.nodes)
         arr=arr.splice(0,this.props.currentNodeIndex)
 
     }else{
         arr= this.props.nodes
     }


     arr= this.props.nodes;
     
     if(this.props.currentOperation.name==="continue_if_sum"){

        arr.forEach(node=>{
            if(node.params_out && node.params_out.length>0){ 
                // console.log( node.params_out.filter((number)=> {return number.type == "number"})) 
         let group= <OptGroup label={node.name} key={node.key}>
                    {   
                        node.params_out.filter((number)=> {return number.type == "number"}).map(item=>{
                            if(this.props.value && this.props.value==(node.key+"."+item.value)){
                                this.props.descData[this.props.keyValue]=item.text
                            }
                       return  <Option   key={item.value} value={node.key+"."+item.value}>{item.text}</Option>})
                        }
                </OptGroup>
            selectArr.push(group)
        }})
     }else if(this.props.currentOperation.name==="continue_if_count"){

        arr.forEach(node=>{
            if(this.props.value && this.props.value==(node.key+".issues")){
                this.props.descData[this.props.keyValue]=node.name
            }
        if(node.operation === "get_issues_by_JQL" || node.operation === "get_issues_by_date"){
          selectArr.push(<Option   key={node.key} value={node.key+".issues"}>{node.name}</Option>)
    }})
     }
     else if(this.props.currentOperation.name==="bar_chart_aggregate_sum"){
      arr.forEach(node=>{
        if(node.params_out && node.params_out.length>0){    
     let group= <OptGroup label={node.name} key={node.key}>
                {   
                    node.params_out.filter((number)=> {
                      if(this.props.schema.key == "x-axis"){
                        return  (number.type == "user" ||number.type ==  "string" || number.type == "status" ||number.type ==  "any" || number.type == "priority" || number.type == "date_range")
                      }else{
                        return number.type == "number"
                      }

                      
                    }).map(item=>{
                        if(this.props.value && this.props.value==(node.key+"."+item.value)){
                            this.props.descData[this.props.keyValue]=item.text
                        }
                   return  <Option   key={item.value} value={node.key+"."+item.value}>{item.text}</Option>})
                    }
            </OptGroup>
        selectArr.push(group);
// console.log()
    }})
    }
      
      else if(this.props.currentOperation.name==="bar_chart_aggregate_count"){
        arr.forEach(node=>{


         
          if(node.params_out && node.params_out.length>0){    
       let group= <OptGroup label={node.name} key={node.key}>
                  {   
                      node.params_out.filter((number)=> {return  (number.type == "user" ||number.type ==  "string" || number.type == "status" ||number.type ==  "any" || number.type == "priority" || number.type == "date_range")}).map(item=>{
                          if(this.props.value && this.props.value==(node.key+"."+item.value)){
                              this.props.descData[this.props.keyValue]=item.text
                          }
                     return  <Option   key={item.value} value={node.key+"."+item.value}>{item.text}</Option>})
                      }
              </OptGroup>
          selectArr.push(group)

      }})
  
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

    this.props.descData[this.props.keyValue]=select_data.props.children
    let data={target:{name:this.props.keyValue,value:value}};
    // this.setState({
    //   currentData:data
    // })
    // console.log("data",data)
    this.props.onChange(data)
  
   
  
 }

  render() {




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



export default CustomSelect; 

