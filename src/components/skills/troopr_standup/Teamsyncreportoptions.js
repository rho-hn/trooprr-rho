import React from "react";
import {Select} from "antd"
const { Option } = Select;

export const groupingValues=[{
    name:"Group by user in thread",
    "value": 1,
    deliverymode:"thread",
    groupby:"user"
  },
  {
  "name": "Group by question in thread (max 16 answers per question)",
  "value": 2,
  deliverymode:"thread",
  groupby:"question"
  },
  {
  "name": "Group by user in channel",
  "value": 3,
  deliverymode:"messages",
  groupby:"user"
  },
  {
  "name": "Group by question in channel (max 16 answers per question)",
    "value": 4,
    deliverymode:"messages",
    groupby:"question"
  }]
  
  
 export const getGroupingOptions=(teamsynctype)=>{
  let filteredGroupingValues=teamsynctype==="jiraissuestandup"?groupingValues.filter(val=>val.groupby!="question"):groupingValues
  return filteredGroupingValues.map(option=>{
  return  <Option value={option.value} key={option.value}>{option.name}</Option>
  })
  }
  
  
  
 export const getOption=(optionValue)=>{

  let option=groupingValues[optionValue]
    return  <Option key={option.value}>{option.name}</Option>
  }
  
  export const  getInitialOption=(deliverymode="thread",groupby="user")=>{
  
  let initialOption=1;
   if(deliverymode=="thread"&&groupby=="question"){
  initialOption=2
  }
  else if(deliverymode=="messages"&&groupby=="user"){
  initialOption=3
  }
  else if(deliverymode=="messages"&&groupby=="question"){
    initialOption=4
  }

  return initialOption
  
  }

  