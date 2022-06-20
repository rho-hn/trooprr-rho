import React,{useState} from 'react'
import { EllipsisOutlined } from '@ant-design/icons';
import { Menu, Dropdown } from 'antd';
import "./popover.css"
const Popup = (props) => {


  
    const [visible,setVisible]=useState(false)
    const hide = () => {
        // console.log("comminggg")
        setVisible(false);
        };
const handleVisibleChange = visible => {
    // console.log(visible)
       setVisible(visible);
}
const handleEdit=(e)=>{
    // console.log("insisde src/components/common/Popover.js -> handleEdit()");
    e.stopPropagation()
   hide()
    props.edit()
}
const handleRunNow=(e)=>{
    e.stopPropagation()
    hide()
    props.runNow()
}
const handleDisable=(e)=>{
    e.stopPropagation()
hide()
props.disable()
}
const menu=()=>{
    return <Menu>
    
    <Menu.Item>
    <div className="buttonStyles" onClick={(e)=>{handleEdit(e)}} >Edit</div>
    </Menu.Item>
    <Menu.Item>
    <div className="buttonStyles" onClick={(e)=>{handleRunNow(e)}}>Run Now</div>
    </Menu.Item>
    <Menu.Item>
    <div className="buttonStyles"  onClick={(e)=>{handleDisable(e)}}>Disable</div>
    </Menu.Item>
    </Menu>
    
}
    return (
        //     <Popover
        //     content={<div onClick={hide}>
        //     <div className="buttonStyles" onClick={(e)=>{handleEdit(e)}} >Edit</div>
        //     <div className="buttonStyles" onClick={(e)=>{handleRunNow(e)}}>Run Now</div>
        //     <div className="buttonStyles"  onClick={(e)=>{handleDisable(e)}}>Disable</div>
        //     </div>}
        //     trigger={"click"}
        //     // onClick={handleClick()}
        //     visible={visible}
        //     onVisibleChange={handleVisibleChange}
        //   >
        // {/* <div className="action_colors"  onClick={(e)=>this.handleEditClick(skill,e)}><Icon type="ellipsis" style={{fontSize:"22px"}} key="ellipsis" /><Popover/></div> */}
        // <div onClick={e=>{e.stopPropagation()}} className="action_colors"><Icon type="ellipsis" key="ellipsis" /></div>
        //   </Popover>
        <Dropdown overlay={menu} trigger={"click"} visible={visible} onVisibleChange={handleVisibleChange}>
        <div onClick={e=>{e.stopPropagation()}} className="action_colors"><EllipsisOutlined key="ellipsis" /></div>
        </Dropdown>
    );
}

export default Popup





