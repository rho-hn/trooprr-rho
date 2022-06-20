import React,{useState} from 'react'
import "./SyncUserModal.css"
import { withRouter } from "react-router-dom";
import { Modal,Input,Alert } from 'antd';
import Validator  from "validator"
import {useDispatch } from "react-redux";
import {SyncSlackUser} from "../common/common_action"
import {getWorkspaceMembers} from "../skills/skills_action"
const { Search } = Input;


const SyncUserModal=(props)=>{
    const dispatch = useDispatch();
const [showModal,setShowModal]=useState(false);
const [loading,setLoading]=useState(false)
const [message,setMessage]=useState("")
const [error,setError]=useState(false)
const [value,setValue]=useState("")
const makeModalVisible=()=>{
    setShowModal(true)
}
const handleCancel=()=>{
    setShowModal(false)
    setMessage("")
    setError(false)
    setLoading(false)
    setValue("")

}



const onSearch=async(value)=>{
    if(!value){ 
        setError(true)
        setMessage("Please enter email")
        return
    }
    if(!Validator.isEmail(value)){
        
            setError(true)
    setMessage("Please enter a valid email")
    return 
    };
setLoading(true)
const actionResult=await SyncSlackUser(props.match.params.wId,value)
setLoading(false)
setMessage(actionResult.message)
if(actionResult.success){
setError(false)
dispatch(getWorkspaceMembers(props.match.params.wId))
}
else{
setError(true)
}
}

const handleChange=(e)=>{
setValue(e.target.value)
}

return <>
<div>
    <br/>
    Don't see a Slack user in Troopr?  &nbsp; &nbsp;  <span className="syncUserButton" onClick={makeModalVisible}>Sync User from Slack</span>  
</div>

<Modal
        title="Sync User from Slack"
        visible={showModal}
        onCancel={handleCancel}
        okButtonProps={{ style: { display: 'none' } }}
        cancelText="Close"
      >
     <Search type="email" value={value} onChange={handleChange}  onSearch={onSearch} placeholder="Enter user email (username@company.com)" enterButton="Sync User" size="large" loading={loading} />
     <br/>
     <br/>
{message&&(error?<Alert message={message||"Error while Syncing user"} type="error" />:<Alert message={message} type="success" />)}
      </Modal>

</>

}

export default withRouter(SyncUserModal)