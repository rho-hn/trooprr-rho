import React,{useState} from 'react'
import {Switch} from "antd"
function ToggleSwitch(props) {
   
    return (
      <Switch defaultChecked  checked={props.record.disabled?false:true} onChange={(e)=>{props.toggle(e,props.record)}} />
    )
}


export default ToggleSwitch