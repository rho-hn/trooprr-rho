import React, { Component, Fragment } from 'react'
import { connect } from "react-redux"
import axios from "axios";
import { withRouter } from "react-router-dom";
import { getUserMappingAndUsers, deleteUserMapping, updateGlobalJiraNotif } from "../skills_action"
import { Modal, Button, Table, Card, Alert, Typography, Tag, Menu, Divider, Dropdown, message, Popconfirm, Input, Space, notification, Select, Layout } from 'antd';
import UserMappingModal from "./UserMappingModal"
import { ExclamationCircleOutlined } from '@ant-design/icons';
import UserPopConfirm from "./UserMappingPopConfirm"
import UserMappingReminder from "./UserMappingReminder"
import UserMappingChannelReminder from './UserMappingChannelReminder';
const { Text } = Typography;
const { confirm } = Modal;
const {Option} = Select
const {Content} = Layout
class UserMapping extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      edit: false,
      mappeddata: {},
      showDeleteModal: false,
      userSearchTerm: "",
      userSearchArray: [],
      notifLoader: false,
      isAdmin: false,
      isAdminInfoLoaded: false,
      filterOption: 'all',


    }
  }
  componentDidMount() {
    this.props.getUserMappingAndUsers(this.props.workspace_id, this.props.skill._id);

    /*axios.get(`/api/${this.props.match.params.wId}/isAdmin`).then(res => {
      if (res.data.isAdmin == false) {
        this.setState({ isAdminInfoLoaded: true });
      }
      if (res.data.success && res.data.isAdmin) {
        this.setState({
          isAdmin: true
        })
      }
    }).catch(err => {
      console.log("error in requesting server if current user is the admin of the workspace: ", err);
    })*/
  }
  showModal = () => {
    this.setState({ showModal: true })
  }
  handleCancel = () => {
    this.setState({ showModal: false, edit: false, mappeddata: {} })
  }
  onCreate = () => {
    this.setState({ showModal: false })
  }



  notificationClick = (key) => {
    notification.close(key)
    this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}/${this.props.match.params.sub_skill}?view=personal_preferences`)
  }
  onUserMappingEdit = (record) => {
    if (record.isVerified) {
      const key = `open${Date.now()}`;
      const btn = (<Button onClick={() => this.notificationClick(key)}>Go to Jira Personal Preferences</Button>)
      // message.error("Verified accounts are the ones user has verified by logging into his Atlassian account. Verified accounts can be managed in Personal Preferences.")
      notification['error']({
        message: 'This is a verified account. User has verified this mapping by logging into his Atlassian account. Verified accounts can be managed by the user in their Personal Preferences.'
        , btn, key
      })
    }
    else {
      this.setState({ showModal: true, edit: true, mappeddata: record })
    }
  }
  // deleteUserMapping(record){
  //   if(record.isVerified){
  // message.error('Verified accounts are the ones user has verified by logging into his Atlassian account. Verified accounts can be managed in Personal Preferences.')
  //   }
  //   else{
  //   }
  // }

  DeleteConfirmModal = (record) => {
    let that = this
    confirm({
      title: 'Are you sure you want to remove this user mapping?',
      icon: <ExclamationCircleOutlined />,
      content: 'Users without mapping will no longer see issues assigned to them in Slack. They will also not receive important notifications like @mentions from Jira.',
      okText: 'Yes',
      okType: 'primary',
      cancelText: 'No',
      onOk() {

        // console.log(that);

        that.props.deleteUserMapping(that.props.match.params.wId, record._id)
      },
      onCancel() {

      },
    });
  }

  showDeleteConfirm = (record) => {
    let currentUserId = localStorage.getItem('trooprUserId');

    //if user is verified then the user should not be able to remove their own user mapping
    if ((record.isVerified) && (record.user_id.user_id === currentUserId)) {
      message.error('You cannot remove yourself from user mapping');
      return;
    }

    const {members,user} = this.props
    let isAdmin = false;
    if(members && members.length>0){
      let user_now=members.find((member)=>member.user_id&&member.user_id._id==user._id&&user)
      if(user_now){
        if(user_now.role){
          isAdmin=user_now.role=="admin"?true:false
        }
      }
    }
    //if the record is verified, it can only be removed by another user who is verified
    //or by any admin of this workspace
    if (record.isVerified) {
      //if (this.state.isAdmin) {
      if (isAdmin) {
        this.DeleteConfirmModal(record);
      } else {
        message.error('Verified accounts are the ones user has verified by logging into his Atlassian account. Verified accounts can be managed in Personal Preferences.')
      }
    }
    else {
      this.DeleteConfirmModal(record);
    }
  }
  showDeleteModal = () => {
    this.setState({ showDeleteModal: true })
  }
  handlePopConfirm = (value) => {
    this.setState({ popvisible: value })
  }



  getColumns = () => {
    const table_columns = [
      // {
      //   title: 'Slack Name',
      //   dataIndex: ['user_id', 'user_name'],
      //   key: "user_id._id",

      //   align: 'center',
      //   render: (text, record) => {
      //     return <span>{text}</span>
      //   },
      // },
      {
        title : 'Slack account',
        dataIndex: 'user_id',
        key: "user_id._id",
        align: "center",
        render: (text, record) => {
          // return <span>{text && text.name ? text.name : text.user_name}<br/>{text && text.email}</span>
          return <span>{text && (text.displayName || text.name || text.user_name || '')}<br/>{text && text.email}</span>
        }
      },
      {
        title: 'Jira account',
        dataIndex: 'user_obj',
        key: "_id",

        align: 'center',
        render: (text, record) => {
          //console.info("text JIra",text)
          /*let display=""
          if(text && text.displayName && text.displayName && text.emailAddress){
            display=text.displayName+" ("+text.emailAddress+")"
          }*/
          return <Fragment>{text && text.displayName && text.displayName}<br/>{text && text.displayName!=text.emailAddress &&text.emailAddress}</Fragment>
        },
      },
      /*{
        title: 'Email Id',
        dataIndex: 'user_id',
        key: "user_id._id",

        align: 'center',
        render: (text, record) => {
          return <Fragment>{text && text.email && text.email}</Fragment>
        },
      },*/
      {
        title: 'Verified',
        key: "is_verified",
        dataIndex: 'is_enabled',

        render: (text, record) => {
          // console.log(record);

          if (record.isVerified) {
            return <Tag color="green">Yes</Tag>
          } else {

            return <><Tag color="orange">NO</Tag>  
<UserMappingReminder closeModal={this.closeReminderModal} record={record} key={record._id} user={this.props.user} />
          
            </>
          }
        }
      },
      {
        title: 'Actions',
        key: "actions",
        align: 'center',
        width: 150,
        render: (text, record) => {
          return <Dropdown overlay={<Menu >
            <Menu.Item key="1">
              <div onClick={() => this.onUserMappingEdit(record)} style={{ width: "100%" }}>
                Edit
                        </div>
            </Menu.Item>
            <Menu.Item key="2" onClick={() => this.showDeleteConfirm(record)}>
              <div style={{ width: "100%" }} >
                Delete
                      </div>
            </Menu.Item>
          </Menu>}>
            <a href="#">More</a>
          </Dropdown>

        }
      }


    ];
    return table_columns
  }
  userSearch = (e) => {
    this.setState({ userSearchTerm: e.target.value }, () => {
     
      let searchData = [...this.props.usermappings];
      // let data = searchData.filter(user => (user.user_id.name.toLowerCase().includes(this.state.userSearchTerm.trim().toLowerCase()) || (user.user_obj.displayName.toLowerCase().includes(this.state.userSearchTerm.trim().toLowerCase()))))
      // let data = searchData.filter(user => (((user.user_id.name ? user.user_id.name : user.user_id.user_name ? user.user_id.user_name : '').toLowerCase().includes(this.state.userSearchTerm.trim().toLowerCase())) || (user.user_obj && user.user_obj.displayName ? user.user_obj.displayName.toLowerCase().includes(this.state.userSearchTerm.trim().toLowerCase()) : '')));
      let data = searchData.filter(user => (((user.user_id.displayName || user.user_id.name || user.user_id.user_name || '').toLowerCase().includes(this.state.userSearchTerm.trim().toLowerCase())) || (user.user_obj && user.user_obj.displayName ? user.user_obj.displayName.toLowerCase().includes(this.state.userSearchTerm.trim().toLowerCase()) : '')));
      this.setState({ userSearchArray: data })
   })
  
  }

  updateSkill = () => {
    this.setState({ notifLoader: true })
    let data = { enableNotif: !this.props.skill.metadata.enableNotif }
    //  id, workspace_id, data, currentSkill
    this.props.updateGlobalJiraNotif(this.props.match.params.wId, this.props.match.params.skill_id, data).then(skill => {
      this.setState({ notifLoader: false })

    })


  }

  sorter = (a, b) => {
    let fa = a.user_id.user_name.toLowerCase(), fb = b.user_id.user_name.toLowerCase();
    if (fa < fb) return -1;
    if (fb < fa) return 1;

    return 0;
  }

  onFilterChange = (value) => {
    this.setState({filterOption:value})
  }

  getFilterdData = (data) => {
    const {filterOption} = this.state
    if(filterOption === 'all') return data // default option when component rendered
    else if(filterOption === 'verified') return data.filter(d => d.isVerified)
    else if(filterOption === 'not_verified') return data.filter(d => !d.isVerified)
    else return data
  }

  getContent = ({verifiedAccountCount}) => {
    return (
      <>
            <Alert
    description={<div>Linking enables user @mentions, personal notifications and nudges to be delivered as direct messages in Slack.<br/>  When user authenticate his Atlassian account, user account mapping is automatically created. For others mapping can be done on their behalf.</div>}
     type="info" />
   <br/>
    <Card extra={
              <Space size='large'>
              <Input placeholder="Search User" onChange={this.userSearch} value={this.state.userSearchTerm} />
              <Select
              style={{width:'150px'}}
              onChange = {this.onFilterChange}
              value = {this.state.filterOption}
              > 
                <Option key={'all'} value={'all'}>All</Option>
                <Option key={'verified'} value={'verified'}>Verifed</Option>
                <Option key={'not_verified'} value={'not_verified'}>Not Verified</Option>
              </Select>
            <Button type="primary" onClick={this.showModal}>New Mapping</Button>
            
            <UserMappingChannelReminder user={this.props.user} />
    <Popconfirm
   title={this.props.skill && this.props.skill.metadata && this.props.skill.metadata.enableNotif?"This will disable notifications for all unverified accounts":"This will enable notifications for all unverified accounts"}
   onConfirm={this.updateSkill}
   placement='topLeft'
   >
   <Button  loading ={this.state.notifLoader}  >{this.props.skill && this.props.skill.metadata && this.props.skill.metadata.enableNotif?"Disable Notifications":"Enable Notifications"}</Button>
            </Popconfirm> 
   
   </Space>
   }>
    {/* <Table  rowKey="_id" columns={this.getColumns()} dataSource={this.props.usermappings} pagination={{ pageSize: 20 }} /> */}
    <Table rowKey="_id" columns={this.getColumns()} 
    // dataSource={((this.state.userSearchArray.length > 0 && this.state.userSearchTerm.trim().length > 0) || this.state.userSearchTerm.trim().length > 0) ? this.state.userSearchArray.sort((a,b) => this.sorter(a,b)) : this.props.usermappings.sort((a,b) => this.sorter(a,b))}
    dataSource={this.getFilterdData(((this.state.userSearchArray.length > 0 && this.state.userSearchTerm.trim().length > 0) || this.state.userSearchTerm.trim().length > 0) ? this.state.userSearchArray.sort((a,b) => this.sorter(a,b)) : this.props.usermappings.sort((a,b) => this.sorter(a,b)))}
     pagination={{ defaultPageSize: 20, showSizeChanger: true}} 
     title = {() => `${verifiedAccountCount.length} of ${this.props.usermappings.length} verified account(s)`}
     />
    </Card>
    {this.state.showModal&&<UserMappingModal isEdit={this.state.edit} visible={this.state.showModal} onCancel={this.handleCancel} onCreate={this.onCreate} mappeddata={this.state.mappeddata}/>}
    <div style={{marginTop:"8px",marginBottom:"8px"}}><Alert
    message="Verified accounts are the ones user has verified by logging into his Atlassian account. Verified accounts can be managed in Personal Preferences."
     type="warning" showIcon/>
     
     </div>
      </>
    );
  }

    render() {
      
      // console.log("this.props.isJiraConnector _> ", this.props.isJiraConnector);
      const verifiedAccountCount = this.props.usermappings && this.props.usermappings.filter(usermap => usermap.isVerified)

      const {members,user} = this.props
      let isAdminInfoLoaded=false
      let isAdmin=false
      if(members && members.length>0){
        let user_now=members.find((member)=>member.user_id && member.user_id._id === user._id && user)
        if(user_now && user_now.role){
          if(user_now.role=="admin"){
            isAdmin=true;
          }
          else{
            isAdminInfoLoaded=true
          } 
        }else{
        }
      }
      
      if(this.props.isFromCheckins){

      }else{
        if(isAdminInfoLoaded){
          if(!(isAdmin || this.props.isJiraConnector)){
            this.props.history.push(`/${this.props.match.params.wId}/dashboard`)
          }
        }
    }

      /*if(this.state.isAdminInfoLoaded){
        if(!(this.state.isAdmin || this.props.isJiraConnector)){
          message.warning('You must be a workspace admin to see Usermapping')
          this.props.history.push(`/${this.props.match.params.wId}/dashboard`)
        }
      }
      */


        return (
          this.props.isFromCheckins ? (isAdmin || this.props.isJiraConnector)?
           this.getContent({verifiedAccountCount}) :
           (""):
          <Layout
          style={{
            marginLeft:0
          }}
          >
          <Content className={'content_row_jira'} style={{ padding: "16px 16px 32px 24px"/* "32px 16px 32px 24px" */, overflow: "initial" }}>
            {this.getContent({verifiedAccountCount})}
          </Content>  
          </Layout>  
        ) 
}
}
const mapStateToProps = state => {
  return {
    skill: state.skills.currentSkill,
    usermappings: state.skills.userMappingsWithUsers,
    user: state.common_reducer.user,
    members: state.skills.members,
  }
};
export default withRouter(connect(mapStateToProps, { getUserMappingAndUsers, deleteUserMapping, updateGlobalJiraNotif })(UserMapping));
