import React, { Component, Fragment } from "react";

import { withRouter } from "react-router-dom";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
const { confirm } = Modal;

class ConnectionModal extends Component {

  state = { visible: true };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

//   handleOk = e => {
//     console.log(e);
//     // this.setState({
//         this.props.gotToConnection()
    

//   };

//   closeModal=()=>{
//     this.props.closeModal()
//     console.log("hello hello hello")
 
//   }

  

  modal=()=>{
    let skillName = this.props.skill.name === "Jira" ? (this.props.type=="skill_not_connected"? 'Connect ' + this.props.skill.name  :  this.props.type=="user_not_verified"?"Verify your Jira Account":'Add token'): "Connect " + this.props.skill.name
    confirm({
        title: this.props.type=="skill_not_connected"?this.props.skill.name +' is not connected': this.props.type=="user_not_verified"?"Jira Account Not verified":'Jira Token is not added.',
        okText:skillName,
        onOk:this.props.gotToConnection,
        visible:this.state.visible,
        maskClosable:true,
       
          icon: <ExclamationCircleOutlined style={{color: "#faad14"}} />,
          onCancel:    this.props.closeModal
        })

}
   
  render() {

      // console.log("hello this is Modal")
    // this.props.type?"skill_not_connected"?this.props.skill.name +'is connected':'Jira Token is not added.'
    return (
    //   <div>
// lettitle= this.props.type?"skill_not_connected"?this.props.skill.name +'is connected':'Jira Token is not added.'
<div>
{ this.modal()}
    </div>    
    );
  }
}
export default withRouter(ConnectionModal)
