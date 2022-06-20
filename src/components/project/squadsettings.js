import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import axios from "axios"
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { CloseOutlined, SettingOutlined,DeleteOutlined } from '@ant-design/icons';
import {
  PageHeader,
  Typography,
  Button,
  Input,
  Row,
  Col,
  Divider,
  Modal,
  Menu,
  Avatar,
  Dropdown,
  AutoComplete,
  Popconfirm,
  Select,
  message,
  notification,
  Switch,
  Layout,
  Card
} from "antd";

import { addMember, deleteMember, setProjectAdmin } from './projectMembers/projectMembershipActions';
import {
  updateUserWorkspaces,
  getWorkspaceMembers,
  getChannelList,
  saveDataTrooprConfigs,
  getTrooprChannelConfig,
  getSkillId
} from "../skills/skills_action";
import {
  getMembers,
  setProjectMembers
} from "./projectMembers/projectMembershipActions";
import { getWorkspace } from "../common/common_action";
import {
  getProject, updateProject,
  leaveProject, archiveProject, deleteProject, getRecentProjects,
  deleteRecentProject
} from "./projectActions";

const { Option } = AutoComplete;
const { Title,Text } = Typography
const { Content } = Layout

let ChannelFrequency = [
  {
    name: "Real Time",
    value: 0
  },
  {
    name: "1 min",
    value: 1
  },
  {
    name: "5 min",
    value: 5
  },
  {
    name: "15 min",
    value: 15
  },
  {
    name: "30 min",
    value: 30
  },
  {
    name: "1 hr",
    value: 60
  },
  {
    name: "2 hrs",
    value: 120
  },
  {
    name: "4 hrs",
    value: 240
  },
  {
    name: "6 hrs",
    value: 360
  },
  {
    name: "12 hrs",
    value: 720
  }
];

let notifEvent = [

  {
    name: "Important (Issue created/status changed/commented)",
    value: "important_updates"
  }, {
    name: "Most updates",
    value: "most_updates"
  }
]

class SquadSettings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      MemberActions: false,
      searchSelect: '',
      userRole: "member",
      seletedChannel: "",
      selectedChannelName: "",
      squadName: "",
      selectedFrequency: "",
      seletecedEvents: "",
      new_workspace: "",
      skill: {},
      leaveSquadModal: false,
      archiveSquadModal: false,
      channelSelected: false,
      frequencySelected: false,
      eventSelected: false,
      status: null,
      check:false,
      isAdmin: false,
      channelsLoading : false
    };

    this.getUserRole = this.getUserRole.bind(this);
    this.handleChannelSelect = this.handleChannelSelect.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleNameSave = this.handleNameSave.bind(this);
    this.handleSlackConfigSave = this.handleSlackConfigSave.bind(this);
    this.leaveSquad = this.leaveSquad.bind(this);
    this.deleteSquad = this.deleteSquad.bind(this);
    this.archiveSquad = this.archiveSquad.bind(this);
    this.handleFreqSelect = this.handleFreqSelect.bind(this);
    this.handleEventSelect = this.handleEventSelect.bind(this);
    this.handleDeleteSquad = this.handleDeleteSquad.bind(this);
    this.handleArchiveSquad = this.handleArchiveSquad.bind(this);
    this.handleLeaveSquad = this.handleLeaveSquad.bind(this);
  }


  componentDidMount() {

    // this.setState({desc:this.props.task.desc, taskname:this.props.task.name ,date: this.props.task.due_on ?new Date(this.props.task.due_on): null,
    //   start_date: this.props.task.start_at? new Date(this.props.task.start_at): null})
    axios.get(`/api/${this.props.match.params.wId}/isAdmin`).then(res => {
      if (res.data.success && res.data.isAdmin) {
        this.setState({
          isAdmin: true
        })
      }
    }).catch(err => {
      console.log("error in requesting server if current user is the admin of the workspace: ", err);
    })
    

    const { getMembers, getProject } = this.props;
    getMembers(this.props.match.params.pId, this.props.match.params.wId);
    getProject(this.props.match.params.pId, this.props.match.params.wId).then(res => {
      this.setState({ squadName: this.props.project.name })
    });

    if(this.props.channels && this.props.channels.length === 0){
      this.setState({channelsLoading : true})
      this.props.getChannelList(this.props.match.params.wId).then(res => this.setState({channelsLoading : false}));
    }
    // this.props.getChannelList(this.props.match.params.wId);

    this.props.getSkillId(this.props.match.params.wId, "Troopr").then(data => {
      this.setState({
        skill: data
      });
      this.props.getTrooprChannelConfig(data._id, this.props.match.params.wId, this.props.match.params.pId).then(channelData => {
        // console.log("Channel data inside SQUAD SETTINGS : ",channelData)
        if (channelData.data.success) {

          this.setState({
            seletecedEvents: channelData.data.data.event_type[0],
            seletedChannel: channelData.data.data.channel_id,
            selectedChannelName: channelData.data.data.channelName,
            selectedFrequency: channelData.data.data.frequency,
            // squadName: channelData.data.data.project_name[0],
            squadName:this.props.project.name,
            channelSelected: true,
            frequencySelected: true,
            eventSelected: true,
            status: channelData.data.data.status
          })
        }
      })
    })
  }

  handleChannelSelect(val, opt) {
    // console.log(val,opt)
    // console.log(opt)
    let name = opt.children
    // console.log(name)
    this.setState({
      seletedChannel: val,
      selectedChannelName: name,
      channelSelected: true,
      check:true
    });
  }

  handleFreqSelect(val, opt) {
    this.setState({ selectedFrequency: val, frequencySelected: true ,check:true});
  }

  handleEventSelect(val, opt) {
    this.setState({ seletecedEvents: val, eventSelected: true ,check:true});
  }

  handleNameChange(e) {
    this.setState({ squadName: e.target.value });
  }

  handleNameSave() {
    if (this.state.squadName.length > 0) {
      let data = {};
      data.name = this.state.squadName;
      this.props.updateProject(this.props.match.params.pId, data, this.props.match.params.wId).then(res => {
        if (res.data.success) {
          // console.log("Squad name updated");
          this.props.getRecentProjects(this.props.match.params.wId)
          message.success('Squad name saved successfully')
        }
      });
    } else {
      message.error("Enter squad name")
    }
  }

  handleSlackConfigSave() {
    let data = {
      channelName: this.state.selectedChannelName,
      channel_id: this.state.seletedChannel,
      frequency: this.state.selectedFrequency,
      event_type: this.state.seletecedEvents,
      skill_id: this.state.skill._id,
      project_name: this.props.project.name,
      project_id: this.props.project._id,
      workspace_id: this.props.match.params.wId,
      user_id: localStorage.trooprUserId,
      is_bot_channel: false,
      status: this.state.status
    }
    // console.log(this.state.selectedChannelName,this.state.seletedChannel,this.state.selectedFrequency,this.state.seletecedEvents)
    if (!this.state.seletedChannel) {
      message.error("Select Slack Channel")
    // } else if (this.state.selectedFrequency < 0) {
    } else if (!Number.isInteger(this.state.selectedFrequency)) {
      message.error("Select Frequency")
    } else if (!this.state.seletecedEvents) {
      message.error("Select Event")
    }

    if (this.state.seletedChannel && Number.isInteger(this.state.selectedFrequency) && this.state.seletecedEvents) {
      this.props.saveDataTrooprConfigs(this.props.match.params.wId, data).then(res => {
        message.success("Notification settings saved")
        // message.success("Setting Succesfully Saved ")
        // console.log(res);
        // if(res){
        // message.success("Notification settings saved") 
        // }
      })
    }
  this.setState({check:false})
  }
  handleNotificationDisable = () => {
    this.setState({status:!this.state.status,check:true})
  }

  leaveSquad() {
    // this.props.leaveProject(this.props.match.params.pId);
    // console.log("leave modal state : ", this.state.leaveSquadModal);
    this.setState({ leaveSquadModal: !this.state.leaveSquadModal }, () => {
      // console.log("Leave modal when update : ",this.state.leaveSquadModal)
    })
  }

  handleLeaveSquad() {

    this.props.leaveProject(this.props.match.params.pId, this.props.match.params.wId);
    this.setState({ leaveSquadModal: !this.state.leaveSquadModal }, () => {
      // console.log("Leave modal when update : ",this.state.leaveSquadModal)
    });
    this.props.history.push(`/${this.props.match.params.wId}/projects`);
  }

  deleteSquad() {
    Modal.confirm({
      title: 'Are you sure you want to delete this Squad?',
      // content: ,
      okText: 'Yes',
      cancelText: 'No',
      // className: "sidebar_dropdown",
      onOk: this.handleDeleteSquad,
      okText: "Yes",
      okType: 'primary'
    })
  }
  handleDeleteSquad() {
    this.props.deleteProject(this.props.match.params.pId, this.props.match.params.wId).then(res => {
      if (res.data.success) {
        this.props.deleteRecentProject(this.props.match.params.wId,this.props.match.params.pId);
        this.props.history.push(`/${this.props.match.params.wId}/squads`);
        this.props.getRecentProjects(this.props.match.params.pId)
      } else {
        notification['error']({
          message: "Can't delete Squad that has tasks in it",
          placement: 'bottomLeft'
        })
      }
    })
  }


  archiveSquad() {
    // console.log("archive modal state : ", this.state.archiveSquadModal);
    this.setState({ archiveSquadModal: !this.state.archiveSquadModal }, () => {
      // console.log("archive modal when update : ",this.state.archiveSquadModal)
    })
  }

  handleArchiveSquad() {
    this.props.archiveProject(this.props.match.params.pId, this.props.match.params.wId).then(
      // console.log("Project archived")
    );
    this.setState({ archiveSquadModal: !this.state.archiveSquadModal }, () => {
      // console.log("archive modal when update : ",this.state.archiveSquadModal)
    });

    this.props.history.push(`/${this.props.match.params.wId}/projects`);
  }

  getAdminCount(members) {
    // console.log("The array inside members : ",members);
    let count = 0;
    for (let i = 0; i < members.length; i++) {
      if (members[i].role === "admin") {
        count = count + 1;
      }
    }
    // console.log("Count of admins : ", count);
    if (count === 1) {
      this.setState({ MemberActions: false }, () => {
        // console.log("Member actions state should be false",this.state.MemberActions);
      });
    }
    else {
      this.setState({ MemberActions: true }, () => {
        // console.log("Member actions state should be true",this.state.MemberActions);
      })
    }
  }

  getUserRole() {
    if (this.props.user._id && this.props.members) {
      this.props.members.map((member) => {
        if (member.user_id._id === this.props.user._id)
          this.setState({ userRole: member.role })
      })
    }
  }

  // handleSearch(value) {
  //   // this.setState({ searchSelect: value, selectedMail: value }, () => {
  //   // });
  //   this.setState({ selectedChannelName: value })
  // };
  trunc = name => name.length <= 13 ? name : name.slice(0, 13) + '..'

  render() {
    // console.log("User now : ",this.props.user._id); 
    const children = [];
    this.props.channels !== undefined && this.props.channels.map((channel) => {
      children.push(<Option key={channel.id} value={channel.id}>{channel.name}</Option>);
    })

    const frequency = [];
    ChannelFrequency.map((project, index) => {
      frequency.push(<Option key={project.value} value={project.value}>{project.name}</Option>);
    })

    const events = [];
    notifEvent.map((event) => {
      events.push(<Option key={event.value} value={event.value}>{event.name}</Option>);
    })

    const { project } = this.props
    const col_span = 24
    return (
      <Fragment>
        <PageHeader
          // ghost
          style={{
            // backgroundColor: "#ffffff",
            width: "100%",
            // height:'100px'
          }}
          className="site-page-header-responsive"
          // title={project && project.name ? this.trunc(project.name).toUpperCase() + " Settings" : ''}
          title={"Settings"}
          extra={[
            ((this.props.project.created_by == localStorage.getItem('trooprUserId')) || (this.state.isAdmin)) &&
            // <Dropdown
            //   overlay={
            //     <Menu>
            //       <Menu.Item onClick={() => this.deleteSquad()}><CloseOutlined />Delete Squad</Menu.Item>
            //       {/* <Menu.Item onClick={() => this.deleteSquad()}><Icon type="close" />Leave Squad</Menu.Item> */}
            //     </Menu>
            //   }
            //   placement="bottomRight"
            // >
            //   <Button style={{ marginLeft: "10px", marginRight: "10px" }} shape="circle">
            //     <SettingOutlined />
            //   </Button>
            // </Dropdown>
              <Button style={{ marginLeft: "10px", marginRight: "10px" }} onClick={() => this.deleteSquad()}><DeleteOutlined />Delete Squad</Button>
          ]}
        />

        <Content style={{ padding: "16px 16px 32px 24px" }}>

          <Row className='content_row' gutter={[0, 16]}>
            <Col span={col_span}>
              <Card title='Squad name' size='small'>
              {/* <Input placeholder={this.props.project.name? this.props.project.name:"Enter Squad Name"} style={{ width: "100%" }} onChange={(e)=>this.handleNameChange(e)} /> */}
              <Input value={this.props.project.name ? this.state.squadName : "Enter Squad Name"} style={{ width: 200 }} onChange={(e) => this.handleNameChange(e)} />
              <br/><br/>
              <Button type="primary" onClick={() => { this.handleNameSave() }}>Save</Button>
              </Card>
            </Col>
          
          {this.props.workspace && this.props.workspace.isSlack &&
              
                <Col span={col_span}>
                  <Card size='small' title='Slack Notifications' extra={<Switch checked={this.state.status} onChange={this.handleNotificationDisable}/>}>

                  <Text type='secondary' strong>Slack Channel</Text><br/>
                  <Select
                    showSearch
                    style={{ width: 300 }}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    loading={this.state.channelsLoading}
                    disabled={!this.state.status}
                    placeholder="Select Slack Channel" style={{ width: 300 }} value={this.state.seletedChannel} onChange={this.handleChannelSelect} >{children}</Select>
                    <br/>

                    <Text type='secondary' strong>Frequency</Text><br/>
                  <Select placeholder="Select Notification Frequency" style={{ width: 300 }} value={this.state.selectedFrequency} onChange={(value, option) => this.handleFreqSelect(value, option)} disabled={!this.state.status}>{frequency}</Select>
                  <br/>

                  <Text type='secondary' strong>Events</Text><br/>
                  <Select placeholder="Selete Notification Events" style={{ width: 300 }} value={this.state.seletecedEvents} onChange={(value, option) => this.handleEventSelect(value, option)} disabled={!this.state.status}>{events}</Select>
                    <br/><br/>

                  <Button type="primary" onClick={() => this.handleSlackConfigSave()} disabled={!this.state.check}>Save</Button>
                  </Card>
                </Col>
                
          }
              </Row>
        </Content>
      </Fragment>
    );
  }
}

SquadSettings.propTypes = {
  members: PropTypes.array.isRequired,
  getMembers: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    workspace_members: state.skills.members,
    workspace: state.common_reducer.workspace,
    members: state.projectMembership.members,
    project: state.projects.project,
    // user_now: state.common_reducer.user,
    user: state.skills.user,
    channels: state.skills.channels
  }
};

export default withRouter(connect(mapStateToProps, {
  getProject,
  updateUserWorkspaces,
  getWorkspaceMembers, getWorkspace, setProjectMembers,
  getMembers, setProjectAdmin, deleteMember, addMember,
  getChannelList, updateProject, leaveProject, archiveProject
  , saveDataTrooprConfigs, getTrooprChannelConfig, deleteProject, getSkillId, getRecentProjects,deleteRecentProject
})(SquadSettings))