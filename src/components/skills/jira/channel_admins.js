import React from "react";
import { Card, Collapse, message, Modal } from "antd";
import { Button, Table, Switch, Alert, Select, Typography } from "antd";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { channelAdminConfig } from "../skills_action";
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
    const { commonChanneldata, currentChannelConfigs, userChannels } = this.props;
    const { channel_id,channelAdmins } = this.state;
    this.setState({channel_id:queryString.parse(window.location.search).channel_id,parsedQueryString : queryString.parse(window.location.search)},() => {

    //checking if it's enterprice shared channel or not
    const channelFound = userChannels.find((cha) => cha.id === this.state.channel_id);
    let isGridSharedChannel = false;
    if (channelFound && channelFound.is_org_shared && channelFound.enterprise_id) {
      isGridSharedChannel = true;
      this.setState({ isGridSharedChannel: true });
      axios.get(`/bot/api/${this.props.match.params.wId}/gridSharedChannelAdminsConfig/channel/${this.state.channel_id}`).then(res => {
        if(res.data._id){
          this.setState({
            currentChannel: res.data,
            restriction: res.data.restrict_channel_config,
            channelAdmins: res.data.channel_admins,
          });        
        }
      })
    }else{
      const currentChannelFound = commonChanneldata.find((cha) => cha.channel_id == this.state.channel_id);
      currentChannelFound &&
        this.setState({
          currentChannel: currentChannelFound,
          restriction: currentChannelFound.restrict_channel_config,
          channelAdmins: currentChannelFound.channel_admins,
        });
    }

    })

   

    // if (currentChannelFound) this.checkSelectDisableConditions(currentChannelFound);
    // else this.setState({ disableSelect: true });
  }

  handleSwitch = (checked) => {
    const { channelAdmins,currentChannel } = this.state;
   

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

    let data = {
      restrict_channel_config: !restriction,
      channel_type : this.state.parsedQueryString.channel_type
    };

    //when disabling restriction, we are removing all admins
    if (restriction) {
      data.channel_admins = [];
    }

    if (!currentChannel || currentChannel.channel_admins.length == 0) {
      data.channel_admins = [user_now._id];
    }
    data.channel=this.props.channel
    this.props.channelAdminConfig(this.props.match.params.wId, this.props.match.params.skill_id, queryString.parse(window.location.search).channel_id, data, this.state.isGridSharedChannel).then((res) => {
      if (res.data.success) {
        // this.checkSelectDisableConditions(res.data.channelCommonData);
        if(res.data.channelCommonData){
          this.setState({
            switchloading: false,
            restriction: res.data.channelCommonData.restrict_channel_config,
            channelAdmins: res.data.channelCommonData.channel_admins,
            currentChannel: res.data.channelCommonData,
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

  // handleSave = () => {
  //   const { channel_id, channelAdmins } = this.state;
  //   this.setState({ selectloading: true });
  //   let data = {
  //     channel_admins: channelAdmins,
  //   };

  //   this.props.channelAdminConfig(this.props.match.params.wId, this.props.match.params.skill_id, channel_id, data).then((res) => {
  //     if (res.data.success) {
  //       // this.checkSelectDisableConditions(res.data.channelCommonData);
  //       this.setState({
  //         selectloading: false,
  //         restriction: res.data.channelCommonData.restrict_channel_config,
  //         channelAdmins: res.data.channelCommonData.channel_admins,
  //         currentChannel: res.data.channelCommonData,
  //       });
  //       message.success("Channel admins updated successfully");
  //     }
  //   });
  // };

  handleSelect = (value) => {
    const { user_now, isWorkspaceAdimin,isChannelAdmin } = this.props;
    let channelAdmins = [...this.state.channelAdmins]
    channelAdmins.push(value)
    // this.setState({channelAdmins})
    this.updateChannelAdmins(channelAdmins);
  };

  handleDeSelect = (value) => {
    const { user_now, isWorkspaceAdimin,isChannelAdmin } = this.props;
    const { channelAdmins,currentChannel } = this.state;

    
    
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
    const { channel_id } = this.state;

    this.setState({selectloading:true})
    const data = {
      channel_admins: channelAdmins,
      channel:this.props.channel
    };
    this.props.channelAdminConfig(this.props.match.params.wId, this.props.match.params.skill_id, queryString.parse(window.location.search).channel_id, data,this.state.isGridSharedChannel).then((res) => {
      if (res.data.success) {
        // this.checkSelectDisableConditions(res.data.channelCommonData);
        this.setState({
          selectloading: false,
          restriction: res.data.channelCommonData.restrict_channel_config,
          channelAdmins: res.data.channelCommonData.channel_admins,
          currentChannel: res.data.channelCommonData,
        });
        // message.success("Channel admins updated successfully");
      }
    });
  }


  render() {
    const { members, commonChanneldata,isWorkspaceAdimin } = this.props;
    const { channel_id, selectloading, switchloading, restriction, channelAdmins, currentChannel, disableSelect } = this.state;
    

   

    return (
      <Collapse>
        <Panel key={'1'}  header='Restrict Channel configuration' extra={<div onClick={e => { e.stopPropagation(); }}><Switch loading={switchloading} checked={restriction} onClick={this.handleSwitch} /></div>}>
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
          disabled={currentChannel && currentChannel.restrict_channel_config ? false : true}
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
        {/* <Button
          onClick={this.handleSave}
          disabled={currentChannel && currentChannel.restrict_channel_config ? false : true}
          style={{ margin: "-10px auto 10px auto" }}
        >
          Save
        </Button> */}
        {/* <Alert showIcon description='Allow only channel adminstrators to configure this channel' /> */}
        </Panel>
      </Collapse>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    jiraChannelConfigs: state.skills.getJiraConfigs,
    members: state.skills.members,
    commonChanneldata: state.skills.commonChanneldata,
    user_now: state.common_reducer.user,
  };
};

export default withRouter(connect(mapStateToProps, { channelAdminConfig })(ChannelAdmins));
