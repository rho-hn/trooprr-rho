import React, { Component } from 'react';
import Timezone from "../../../../utils/timezone.json"
import  { Select } from 'antd';
const { Option } = Select;

const  timeArr=[{text:"00:00",value:"00:00"},
{text:"00:30",value:"00:30"},
{text:"01:00",value:"01:00"},
{text:"01:30",value:"01:30"},
{text:"02:00",value:"02:00"},
{text:"02:30",value:"02:30"},
{text:"03:00",value:"03:00"},
{text:"03:30",value:"03:30"},
{text:"04:00",value:"04:00"},
{text:"04:30",value:"04:30"},
{text:"05:00",value:"05:00"},
{text:"05:30",value:"05:30"},
{text:"06:00",value:"06:00"},
{text:"06:30",value:"06:30"},
{text:"07:00",value:"07:00"},
{text:"07:30",value:"07:30"},
{text:"08:00",value:"08:00"},
{text:"08:30",value:"08:30"},
{text:"09:00",value:"09:00"},
{text:"09:30",value:"09:30"},
{text:"10:00",value:"10:00"},
{text:"10:30",value:"10:30"},
{text:"11:00",value:"11:00"},
{text:"11:30",value:"11:30"},
{text:"12:00",value:"12:00"},
{text:"12:30",value:"12:30"},
{text:"13:00",value:"13:00"},
{text:"13:30",value:"13:30"},
{text:"14:00",value:"14:00"},
{text:"14:30",value:"14:30"},
{text:"15:00",value:"15:00"},
{text:"15:30",value:"15:30"},
{text:"16:00",value:"16:00"},
{text:"16:30",value:"16:30"},
{text:"17:00",value:"17:00"},
{text:"17:30",value:"17:30"},
{text:"18:00",value:"18:00"},
{text:"18:30",value:"18:30"},
{text:"19:00",value:"19:00"},
{text:"19:30",value:"19:30"},
{text:"20:00",value:"20:00"},
{text:"20:30",value:"20:30"},
{text:"21:00",value:"21:00"},
{text:"21:30",value:"21:30"},
{text:"22:00",value:"22:00"},
{text:"22:30",value:"22:30"},
{text:"23:00",value:"23:00"},
{text:"23:30",value:"23:30"},
]
 
const dayArr=[
    {text:"Monday",value:"monday"},
{text:"Tuesday",value:"tuesday"},
    {text:"Wednesday",value:"wednesday"},
   { text:"Thursday",value:"thursday"},
    {text:"Friday",value:"friday"},
    {text:"Saturday",value:"saturday"},
    {text:"Sunday",value:"sunday"},
]

class CustomSelect extends Component {
  state = {
    selectArr:[]
  };

//   function onChange(value) {
//     console.log(`selected ${value}`);
//   }
//   componentDidMount(){
 

//  }
 

 getOptions=()=>{  

 
 let selectArr=[]
 if(this.props.schema.type === "tod"){

    selectArr=timeArr.map(item=>{
        if(this.props.value && this.props.value==item.value){
            this.props.descData[this.props.keyValue]=item.text
        }
        return <Option   key={item.value} value={item.value}>{item.text}</Option>
    })
   }else if(this.props.schema.type === "dow"){
        selectArr=dayArr.map(item=>{
            if(this.props.value && this.props.value==item.value){
                this.props.descData[this.props.keyValue]=item.text
            }
            return <Option   key={item.value} value={item.value}>{item.text}</Option>
        })
   } else if(this.props.schema.type === "tz"){
selectArr=Timezone.timezones.map((item,index)=>{
    if(this.props.value && this.props.value==item.utc[0]){
        this.props.descData[this.props.keyValue]=item.text
    }
    return <Option   key={index} value={item.utc[0]}>{item.text}</Option>
})
}else if(this.props.schema.type === "Array"){

       selectArr=this.props.schema.items.map(item=>{
        if(this.props.value && this.props.value==item.key){
            this.props.descData[this.props.keyValue]=item.name
        }
        return <Option   key={item.key} value={item.key}>{item.name}</Option>
    })
   }else if(this.props.schema.type === "slack_channel_select"){

      selectArr=this.props.channels.map(channel=>{
        if(this.props.value && this.props.value==channel.id){
            this.props.descData[this.props.keyValue]=channel.name
        }
    
     return  <Option   key={channel.id} value={channel.id}>{channel.name}</Option>})
   }else if( this.props.schema.type === "node_select" || this.props.schema.type ==="image_url" ){
  
        if(this.props.currentOperation.name === "send_jira_issues"   ){
            this.props.skillNodes.forEach(node=>{
                if(this.props.value && this.props.value==node.key){
                    this.props.descData[this.props.keyValue]=node.name
                }
           
                            if(node.operation === "get_issues_by_JQL" ||  node.operation === "get_issues_by_date"){
                                selectArr.push(<Option   key={node.key} value={node.key}>{node.name}</Option>)
                             }
                
                  
            
                })
        }else{
                    selectArr= this.props.skillNodes.map(node=>{
                        if(this.props.value && this.props.value==node.key){
                            this.props.descData[this.props.keyValue]=node.name
                        }
                        
                    return <Option   key={node.key} value={node.key}>{node.name}</Option>})
                }
  
    

   }


   
     return selectArr
 }

 onBlur=() =>{
    // console.log('blur');
  }
  
  onFocus=()=> {
    // console.log('focus');
  }
  
   onSearch=(val)=> {
  }

 onChange=(value,select_data)=>{

if(this.props.descData){this.props.descData[this.props.keyValue]=select_data.props.children}
    let data={target:{name:this.props.keyValue,value:value}}
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
        onChange={(value,data)=>this.onChange(value,data)}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onSearch={this.onSearch}
        filterOption={(input, option) =>{
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

