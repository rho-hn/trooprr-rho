import React from "react";
import {  Collapse, message, Modal,Switch, Select, Typography } from "antd";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { addConfluenceChannelConfig } from "../skills_action";
import queryString from "query-string";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import axios from "axios";

const { Text,Paragraph } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

class ChannelAdmins extends React.Component {
  constructor(props) {
    super();
    this.state = {
      channel_id: '',
      selectloading: false,
      switchloading: false,
      restriction: false,
      channelAdmins: false,
      currentChannel:false,
      isGridSharedChannel:false
      // disableSelect: false,
    };
  }

  componentDidMount() {
   let {config}=this.props;
  this.setState({channelAdmins:(config&&config.channel_admins)||[],restriction:(config&&config.restrict_channel_config)||false,channel_id:(config&&config.channel&&config.channel.id)||"",currentChannel:config||null})
  }

  handleSwitch = (checked) => {
    this.setState({ switchloading: true });
  
    if (!checked) {
      Modal.confirm({
        title: "Disable channel restrictions?",
        icon: <ExclamationCircleOutlined />,
        content: (
          <p>
            Are you sure your want to remove channel restrictions? This action will
            <ul>
              <li>Remove current channel administrators</li>
              <li>Allow anyone to configure this channel</li>
            </ul>
          </p>
        ),
        onOk: () => this.handleSwitchAction(),
        onCancel: () => this.setState({ switchloading: false }),
      });
    } else this.handleSwitchAction();
  };

  handleSwitchAction = () => {
    const { restriction, channel_id, currentChannel } = this.state;
  
    const { user_now } = this.props;
    this.setState({ switchloading: true });
    let data = {restrict_channel_config: !restriction,channel:currentChannel.channel};

    //when disabling restriction, we are removing all admins
    if (restriction) {
      data.channel_admins = [];
    }

    if (!restriction&&(currentChannel&&currentChannel.channel_admins&&currentChannel.channel_admins.length == 0)) {
      data.channel_admins = [user_now._id];
    }

    this.props.addConfluenceChannelConfig(this.props.match.params.wId,data).then((res) => {
     
      if (res.data.success) {
        // this.checkSelectDisableConditions(res.data.channelCommonData);
        if(res.data.config){
          this.setState({
            switchloading: false,
            restriction: res.data.config.restrict_channel_config,
            channelAdmins: res.data.config.channel_admins,
            currentChannel: res.data.config,
          });
        }else{
          this.setState({
            switchloading: false,
            restriction: false,
            channelAdmins: false,
            currentChannel: false,
          });
        }
      }
    });
  };


  handleSelect = (value) => {
    const { user_now, isWorkspaceAdimin,isChannelAdmin } = this.props;
    let channelAdmins = [...this.state.channelAdmins]
    channelAdmins.push(value)
    // this.setState({channelAdmins})
    this.updateChannelAdmins(channelAdmins);
  };

  handleDeSelect = (value) => {
    const { user_now, isWorkspaceAdimin } = this.props;
    const { channelAdmins,currentChannel } = this.state;
    let isChannelAdmin = (user_now && user_now._id && user_now._id.toString()) === (currentChannel.created_by && currentChannel.created_by.toString())
    if (!isChannelAdmin) {
      let index = channelAdmins.findIndex(id => id.toString() == value.toString(  ))
      if (index >= 0) {
        isChannelAdmin = true
  }
      
    }
    if(isChannelAdmin){
      if(value == user_now._id) message.error("Cannot remove yourself from channel admins")
      else{
        let ChannelAdmins = [...channelAdmins]
        let index = ChannelAdmins.findIndex(id => id == value)
        ChannelAdmins.splice(index,1)
        // this.setState({channelAdmins:ChannelAdmins})
        this.updateChannelAdmins(ChannelAdmins);
      }
    }else if(isWorkspaceAdimin) {
      message.error("workspace admins can't remove channel admins")
      // const savedAdmin = currentChannel.channel_admins.find(id => id == value)
      // if(savedAdmin)
      // message.error("workspace admins can't remove channel admins")
      // else{
      //   let ChannelAdmins = [...channelAdmins]
      //   let index = ChannelAdmins.findIndex(id => id == value)
      //   ChannelAdmins.splice(index,1)
      //   // this.setState({channelAdmins:ChannelAdmins})
      //   this.updateChannelAdmins(ChannelAdmins);
      // }
    }
  }

  updateChannelAdmins = (channelAdmins) => {
    const { channel_id,currentChannel } = this.state;

    this.setState({selectloading:true})
    const data = {
      channel_admins: channelAdmins,
      channel:currentChannel.channel
    };
    this.props.addConfluenceChannelConfig(this.props.match.params.wId,data).then((res) => {
      if (res.data.success) {
        // this.checkSelectDisableConditions(res.data.channelCommonData);
        this.setState({
          selectloading: false,
          restriction: res.data.config.restrict_channel_config,
          channelAdmins: res.data.config.channel_admins,
          currentChannel: res.data.config,
        });
        // message.success("Channel admins updated successfully");
      }
    });
  }


  render() {
    const { members,isWorkspaceAdmin } = this.props;
    const {  selectloading, switchloading, restriction, channelAdmins, currentChannel } = this.state;
  
    // const currentChannelFound = commonChanneldata.find(cha => cha.channel_id == channel_id)
    // let restriction = false

    // if(currentChannelFound){
    //   restriction = currentChannelFound.restrict_channel_config
    // }

    return (
     <Collapse>
        <Panel key={'1'} header='Restrict Channel configuration' extra={<div onClick={e => { e.stopPropagation(); }}><Switch loading={switchloading} disabled={this.props.disabled} checked={restriction} onClick={this.handleSwitch} /></div>}>
        <Paragraph type='secondary'>Allow only channel adminstrators to configure this channel</Paragraph>
        <div className='Jira_preference_personal_default_type'>
          <Text type='secondary'>Channel Admins</Text>
        </div>
        <Select
          title='Channel Admins'
          style={{ width: 200}}
          mode='multiple'
          // onChange={this.handleSelect}
          onSelect = {this.handleSelect}
          onDeselect={this.handleDeSelect}
          value={channelAdmins ? channelAdmins : []}
          disabled={this.props.disabled||(currentChannel && currentChannel.restrict_channel_config ? false : true)}
          filterOption={(input, option) =>
            option.props.children
              .toLowerCase()
              .indexOf(input.toLowerCase()) >= 0
          }
          loading={selectloading}
        >
          {members.map((mem) => {
            return (
              <Option key={mem.user_id._id} value={mem.user_id._id} label={mem.user_id._id}>
                {mem.user_id.displayName||mem.user_id.name}
              </Option>
            );
          })}
        </Select>
       
        </Panel>
        </Collapse>
    );
  }
}

const mapStateToProps = (state) => {
    
  return {
    user_now: state.common_reducer.user,
  };
};

export default withRouter(connect(mapStateToProps, { addConfluenceChannelConfig })(ChannelAdmins));
