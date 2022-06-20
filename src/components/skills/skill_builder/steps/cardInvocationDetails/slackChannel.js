import React, { Component } from 'react'
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Button, Select, Alert, message } from 'antd';
import { getChannelList } from "../../../skills_action"
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

const { Option } = Select;
const { TextArea } = Input

class slackChannel extends Component {

  constructor(props) {
    super(props)

    this.state = {
      selectedChannel: ''
    }
  }

  componentDidMount() {
 /* getChannels only called once in sidenavbar_new */
    // this.props.getChannelList(this.props.match.params.wId)
    //  if(slackData)
  }

  onChange = (e) => {

    this.setState({ selectedChannel: e })
  }

  getOptions = () => {
    return this.props.channels.map(channel => {
      return <Option key={channel.id} value={channel.id}>{channel.name}</Option>
    })
  }

  getReportMemberOptions = () => {
    return this.props.allUsers.map((member) => (
      <Option value={member.user_id._id} >{member.user_id.displayName ? member.user_id.displayName : member.user_id.name}</Option>
    ))
  }

  storeValues = () => {
    const values = this.props.form.getFieldsValue();

    
    this.props.data.slackData = values
  
    
    //  this.props.data.slackData= this.props.submittedValues(values);
    this.props.prevStep();
  }

  validateInput = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        //  this.props.handleConfirmButton(values);
        let isDeliverExist = false;
        
        if(values.slackChannel && values.slackChannel.length > 0) {
          isDeliverExist = true;
        }

        if(values.reportMembers && values.reportMembers.length > 0) {
          isDeliverExist = true;
        }

        this.props.data.slackData = values
      
        if(!!isDeliverExist) {
          this.props.nextStep();
        } else {
          message.error("Please, Select at least one channel or member");
        }


      } else {

        // console.log("this is the error", err)
      }
    });
  }

  validateChannels = (channels, selectedChannels) => {
    let notExistChannels = [];
    if(selectedChannels) {
      if(Array.isArray(selectedChannels)) {
        selectedChannels.map((schannel) => {
          if(channels.some((channel) => channel.id === schannel)) {
          } else {
            notExistChannels.push(schannel);
          }
        })
      } else {
        if(channels.find(c => c.id === selectedChannels)) {

        } else {
          notExistChannels = selectedChannels;
        }
      }
    }
    return notExistChannels;
  }
  
  render() {
    const { getFieldDecorator} = this.props.form;
    let channel = this.state.selectedChannel ? this.state.selectedChannel : this.props.data.slackData.slackChannel
    // console.log(this.props)
    const notExistChannels = this.validateChannels(this.props.channels, channel);
    return (
      <Form onSubmit={this.validateInput} style={{ padding: "20px" }} layout='vertical'>

        { // When troopr is removed from a private channel.
        
          // channel && !this.props.channels.find(c => c.id === channel)
          channel && notExistChannels.length > 0
          ? <Alert
          message={`Troopr was removed from channel ${notExistChannels}`}
          type="warning"
          showIcon
          style={{ width: "calc(100% - 16px)",maxWidth:984, marginBottom:16 }}
        />
          : null
        }


        <Form.Item label="Enter Slack Message" style={{ marginBottom: 2, width: "100%",fontWeight:"bold"}} className={localStorage.getItem('theme') == "dark" && "form_label_dark"}>
          {getFieldDecorator('slack_msg', {
            rules: [{ required: false, message: 'Cannot be empty!' }],
            initialValue: this.props.data.slackData.slack_msg
          })(<TextArea
            name="slack_message"
            placeholder="Slack Message"

          />)}
        </Form.Item>

        <Form.Item
          label="Select Members"
          style={{ marginBottom: 2, width: "100%",fontWeight:"bold"}}
          className={localStorage.getItem('theme') == "dark" && "form_label_dark"}
        >
          {getFieldDecorator('reportMembers', {
            rules: [{ required: false, message: 'Select A Member' }],
            initialValue: this.props.data.slackData.reportMembers
          })(
            <Select
              placeholder="Select Members"
              optionFilterProp="children"
              mode='multiple'
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {this.getReportMemberOptions()}
            </Select>

          )}
        </Form.Item>

        <Form.Item label="Select A Channel" style={{ marginBottom: 2, fontSize: "16px",fontWeight:"bold" }} className={localStorage.getItem('theme') == "dark" && "form_label_dark"}>
          {getFieldDecorator('slackChannel', {
            rules: [{ required: false, message: 'Select A Channel' }],
            initialValue: this.props.data.slackData.slackChannel
          })(<Select
          onChange={this.onChange}
            showSearch
            style={{fontWeight:"normal"}}
            placeholder="Select a Channel"
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            mode={this.props.selectMode}
          >
            {this.getOptions()}
          </Select>)}
        </Form.Item>
        {/* <Form.Item label="Skill Name" style={{ marginBottom: 2 }}>
                {getFieldDecorator('skillName', {
                    rules: [{ required: true, message: 'Enter skill Name'}],
                    initialValue: this.props.skillName
                })(<Input
                  name="skillName"
                  placeholder="Skill Name"
              
            />)}
            </Form.Item> */}

        <div style={{ marginBottom: 2, display: "flex", justifyContent: "space-between", marginTop: "24px" }}>

          <Button type="default" onClick={this.storeValues} style={{ marginLeft: "10px" }}>
            Back
                </Button>
          <Button disabled={this.props.buttonDisable} type="primary" htmlType="submit">
            {this.props.mode === "edit" ? "Update" : "Save"}
          </Button>
        </div>
      </Form>
    )
  }
}

slackChannel.defaultProps = {
  selectMode: ''
}

const mapStateToProps = state => {
  // console.log(state)
  return {
    channels: state.skills.channels,
    allUsers: state.skills.members,
  };
};

export default withRouter(connect(mapStateToProps, { getChannelList })(Form.create({ name: 'step_three' })(slackChannel)))























































// import React, { Component } from 'react'
// import {getChannelList} from "../../../skills_action"
// import { Select,Input } from 'antd';

// import { withRouter } from "react-router-dom";
// import { connect } from "react-redux";
// const { Option } = Select;

//  class slackChannel extends Component {
//      constructor(props) {
//          super(props)

//          this.state = {
//               selectedChannel:''
//          }
//      }
//      componentDidMount(){
//         this.props.getChannelList(this.props.match.params.wId)
//      }

//      onChange=(e)=>{

// this.setState({selectedChannel:e})
//      }
//      getOptions=()=>{
//          return  this.props.channels.map(channel=>{
//           return  <Option   key={channel.id} value={channel.id}>{channel.name}</Option>})
//      }
//     render() {
//         return (
//             <div>
//                  <h6>Select delivery target for the card</h6> 
//                  <textarea

//            className="custom_text_area"
//            style={{ width: "60%" }}
//            name="slack_msg"
//            placeholder="Enter Slack Message"
//          />
//        <Select
//     showSearch
//     style={{ width: 200 }}
//     placeholder="Select a Channel"
//     onChange={this.onChange}
//     value={this.state.selectedChannel}
//   >
//     {this.getOptions()}
//   </Select>
//             </div>
//         )
//     }
// }

// const mapStateToProps = state => {
//     return {
//     };
//   };
//   export default withRouter(
//     connect(mapStateToProps, {getChannelList})(slackChannel)
//   )
