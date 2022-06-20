import React, { useState } from 'react'
import {
    Menu,
    Dropdown,
    message,
    Popconfirm} from "antd";
const PopconfirmAndDropdown = (props) => {
    const [v, setV] = useState(false);
    const handleDelete=(value)=>{
setV(value)
if(props.record&&props.record.isVerified){
    message.error("Verified accounts are the ones user has verified by logging into his Atlassian account. Verified accounts can be managed in Personal Preferences.")
}
else{
props.deleteUserMapping(props.record)}
    }
    return (
        <Popconfirm
        title="Users without mapping will no longer see issues assigned to them in Slack. They will also not receive important notifications like @mentions from Jira. Are you sure you want to remove this user mapping?"
        trigger="click"
        visible={v}
        onCancel={()=>setV(false)}
        onConfirm={()=>handleDelete(false)}
      >
          <Dropdown overlay={<Menu >
          <Menu.Item key="1">
            <div onClick={() => props.onUserMappingEdit(props.record)} style={{ width: "100%" }}>
              Edit
                  </div> 
          </Menu.Item>
          <Menu.Item key="2" onClick={()=>setV(true)}>
          <div style={{ width: "100%" }} >
              Delete
                </div>
          </Menu.Item>
        </Menu>}>
            <a href="#">More</a>
          </Dropdown>
        </Popconfirm>
    );
  };

  export default PopconfirmAndDropdown