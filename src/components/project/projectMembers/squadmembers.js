import React, { Component, Fragment, Input } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import { Icon as LegacyIcon } from '@ant-design/compatible';
import { DownOutlined, MailOutlined } from '@ant-design/icons';

import {
  PageHeader,
  Typography,
  Button,
  Menu,
  Row,
  Col,
  Divider,
  Alert,
  List,
  Avatar,
  Dropdown,
  AutoComplete,
  Popconfirm,
  message,
  Modal,
  Layout
} from "antd";
import { addMember, deleteMember, setProjectAdmin } from '../projectMembers/projectMembershipActions';
import {
  // getProfileinfo,
  updateUserWorkspaces,
  getWorkspaceMembers
} from "../../skills/skills_action";
import {
  getMembers,
  setProjectMembers
} from "./projectMembershipActions";
import { getWorkspace } from "../../common/common_action";
import axios from "axios"
import { getProject } from "../projectActions";
const { Title } = Typography;
const { Option } = AutoComplete;

class SquadMembers extends Component {
  constructor(props) {
    super(props)
    this.state = {
      MemberActions: false,
      searchSelect: '',
      selectedMail: '',
      openMakeAdminModal:false,
      openRemoveAdminModal:false,
      openRemoveMemberModal:false,
      user:''
    };
    let inputValue;
    this._getInitials = this._getInitials.bind(this);

    this.getAdminCount = this.getAdminCount.bind(this);

    this.handleMakeAdmin = this.handleMakeAdmin.bind(this);
    this.handleRemoveAdmin = this.handleRemoveAdmin.bind(this);
    this.handleRemove = this.handleRemove.bind(this);

    this.handleSelect = this.handleSelect.bind(this);
    this.handleSearch = this.handleSearch.bind(this);

    this.handleInvite = this.handleInvite.bind(this);

  }

  componentWillMount() {

  }

  componentDidMount() {
    const { getMembers, getProject } = this.props;
    getMembers(this.props.match.params.pId,this.props.match.params.wId);
    getProject(this.props.match.params.pId,this.props.match.params.wId);
    // console.log(document.getElementsByClassName("ant-input ant-select-search__field")[0].value);
  }

  handleRemove(id, index) {
    let old_array = this.props.members;
    let ind=this.props.members.findIndex(idx=>idx._id==id)
   if(this.props.members[ind].role == "admin"){
      message.error({content:"Admin can't be removed directly"})

    }else{

    new Promise(() => {
      this.props.deleteMember(id,this.props.match.params.wId)
    }).then(
      old_array.splice(ind, 1)
    )
    this.getAdminCount(old_array);
  }
  this.setState({openRemoveMemberModal:false})
}

  handleMakeAdmin(id, index) {

      if(this.checkUserRole()==="member"){

        this.setState({openMakeAdminModal:false})
        message.error({content:"You cannot make Admin"})

      }else if(this.checkUserItself(id)){

        this.setState({openMakeAdminModal:false})
        message.error({content:"You cannot make yourself Admin"})

      }else{

    let old_array = this.props.members;
    let indn=this.props.members.findIndex(idx=>idx._id==id)
    let updated;
    // this.getAdminCount(this.props.members);
    new Promise(() => {
      this.props.setProjectAdmin(id, { role: 'admin' },this.props.match.params.wId)
    }).then(
      updated = old_array.splice(indn, 1)
    )
    updated[0].role = "admin";
    old_array.splice(indn,0,updated[0]);
    this.getAdminCount(old_array);
    // console.log(this.getAdminCount(old_array))
    this.setState({openMakeAdminModal:false})
  }
  }

  checkUserItself=(id)=>{

  let ido =this.props.members.filter(i=>i._id==id)[0].user_id._id;
  let userid=this.props.user_now._id
    return userid===ido
  }
  
  checkUserRole=()=>{

  const userRole=this.props.members.filter(o=>o.user_id._id===this.props.user_now._id)[0].role
     return userRole
  }

  handleRemoveAdmin(id, index) {
    if(this.checkUserRole()==="member"){

      this.setState({openRemoveAdminModal:false})
      message.error({content:"You cannot remove Admin"})

    }else{
    let old_array = this.props.members;
    let indx=this.props.members.findIndex(idx=>idx._id==id)
    let updated;
    // this.getAdminCount(this.props.members);
    new Promise(() => {
      this.props.setProjectAdmin(id, { role: 'member' },this.props.match.params.wId)
    }).then(
      updated = old_array.splice(indx, 1)
    )
    updated[0].role = "member";
    old_array.splice(indx,0,updated[0])
    // old_array.push(updated[0]);
    // console.log("OLD ARRAY : ", old_array);
    this.getAdminCount(old_array);
    this.setState({openRemoveAdminModal:false})
  }
  }

  handleSearch(value) {
    this.setState({ searchSelect: value, selectedMail: value }, () => {
    });
  };


  handleSelect(value, option) {

    this.setState({ searchSelect: value, selectedMail: option.key }, () => {
    });

    // this.props.addMember(this.props.project._id,
    //   this.props.project.name,
    //   this.props.project.workspace_id, option.key);
  }

  handleInvite() {

    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let validation = re.test(this.state.selectedMail);
    if (validation) {
      this.props.addMember(this.props.project._id,
        this.props.project.name,
        this.props.project.workspace_id, this.state.selectedMail);
      this.setState({ selectedMail: '' })
    } else {
      message.error('Enter Valid Email');
    }
  }
  getAdminCount(members) {
    // console.log("The array inside members : ", members);
    let count = 0;
    for (let i = 0; i < members.length; i++) {
      if (members[i].role === "admin") {
        count = count + 1;
      }
    }
    // console.log("Count of admins : ", count);
    if (count <= 1) {
      this.setState({ MemberActions: false }, () => {
        // console.log("Member actions state should be false", this.state.MemberActions);
      });
    }
    else {
      this.setState({ MemberActions: true }, () => {
        // console.log("Member actions state should be true", this.state.MemberActions);
      })
    }
  }


  _getInitials(string) {
    // return string
    //   .trim()
    //   .split(" ")
    //   .map(function (item) {
    //     if (item.trim() != "") {
    //       return item[0].toUpperCase();
    //     }
    //     else {
    //       return;
    //     }
    //   })
    //   .join("")
    //   .slice(0, 2);
    let nameArr = string
    .trim()
    .replace(/\s+/g,' ') //remove extra spaces
    .split(" ")

  if (nameArr.length>1)
    return (nameArr[0][0] + nameArr[1][0]).toUpperCase()
  else
    return nameArr[0].slice(0, 2).toUpperCase()
  }
handleRemoveMemberfunc=(obj)=>{
  // console.log(obj.user_id.name)
  this.setState({user:obj})
  this.setState({openRemoveMemberModal:true})
}
handleMakeAdminfunc=(obj)=>{
  // console.log(obj.user_id.name)
  this.setState({user:obj})
this.setState({openMakeAdminModal:true})
}
handleRemoveAdminfunc=(obj)=>{
  // console.log(obj.user_id.name)
  this.setState({user:obj})
  this.setState({openRemoveAdminModal:true})
}
  componentWillUnmount() {

  }

  trunc = name => name.length <= 13 ? name : name.slice(0, 13) + '..'

  render() {
    const children = this.props.workspace_members.map((member) => (
      <Option key={member.user_id.email} value={member.user_id.displayName||member.user_id.name}>
        <Row>
          <Col span={3} align={"left"} style={{ padding: "2px" }}>
            <Avatar style={{ color: '#FFFFFF', backgroundColor: '#003b59' }}>
              {this._getInitials(member.user_id.displayName||member.user_id.name)}
            </Avatar>
          </Col>
          <Col align={"left"} span={13} >
            {member.user_id.displayName||member.user_id.name}
          </Col>
        </Row>
      </Option>
    ));

    // {this.props.members.length>0 && this.getAdminCount(this.props.members)}

    const {project} = this.props
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
          // title={project && project.name ? this.trunc(project.name).toUpperCase() + " Members" : ''}
          title={"Members"}
          subTitle="Add a workspace member to this Squad"
        />
        <Layout style={{ padding: "16px 0 0 24px",background: (localStorage.getItem('theme') == 'default' ? "#ffffff" : "rgba(15,15,15)") }} >
        <div style={{ width: "500px", maxWidth: "500px" }}>
          <Row>
            <Col span={18} >
              <AutoComplete 
                id="search_input" 
                optionLabelProp="label" 
                style={{ width:"100%", paddingRight:8 }} 
                allowClear={true} 
                backfill={true} 
                onSearch={(value) => { this.handleSearch(value) }} 
                filterOption={true} onSelect={(value, option) => { this.handleSelect(value, option) }} 
                value={this.state.selectedMail} 
                placeholder="Enter Email here"
              >
                {children}
              </AutoComplete>
            </Col>
            <Col span={6}>
              {/* onClick={this.sendInvite} */}
              <Button type="primary" block onClick={() => this.handleInvite()}> <MailOutlined />
              Invite
            </Button>
            </Col>

          </Row>
          <Divider />
         
          <Row >
            <Col span={24}>
              {/* {console.log("Members inside admincount : ", this.props.members)} */}
              <List
                pagination={{
                  pageSize: 5,
                }}
                itemLayout="horizontal"
                dataSource={this.props.members != undefined && this.props.members}
                renderItem={(item, index) => (
                  <List.Item
                  actions={[
                    <Dropdown
                    disabled
                    trigger={["click"]}
                    overlay={
                      <Menu>
                            {item.role === "admin" ?
                              <Menu.Item disabled={!this.state.MemberActions}>
                                {/* <Popconfirm placement="leftBottom" title={`Are you sure you want to remove ${item.user_id.name} as an admin?`} onConfirm={() => this.handleRemoveAdmin(item._id, index)} okText="Yes" cancelText="No"> */}
                                  <div style={{ width: "100%",pointerEvents:this.state.MemberActions?'auto':'none'}} onClick={()=>this.handleRemoveAdminfunc(item)}>
                                    Remove Admin
                                {/* </Popconfirm> */}
                                </div>
                                {/* {console.log(item.user_id.name)} */}
                                <Modal
                                    visible={this.state.openRemoveAdminModal}
                                    onOk={()=>this.handleRemoveAdmin(this.state.user._id)}
                                    onCancel={()=>this.setState({openRemoveAdminModal:false})}
                                    okText="Yes"
                                    cancelText="No"                                    
                                    >
                                 Are you sure you want to remove "{this.state.user?(this.state.user.user_id.displayName||this.state.user.user_id.name):null}" as an admin?
                              </Modal>
                              </Menu.Item> :
                              <Menu.Item>
                                {/* <Popconfirm placement="leftBottom" title={`Are you sure you want to make "${item.user_id.name}" an admin?`} onConfirm={() => this.handleMakeAdmin(item._id, index)} okText="Yes" cancelText="No"> */}
                                  <div style={{ width: "100%" }} onClick={()=>this.handleMakeAdminfunc(item)}>
                                    Make Admin
                                </div>
                                {/* </Popconfirm> */}
                                <Modal
                                    visible={this.state.openMakeAdminModal}
                                    onOk={()=>this.handleMakeAdmin(this.state.user._id)}
                                    onCancel={()=>this.setState({openMakeAdminModal:false})}
                                    okText="Yes"
                                    cancelText="No"
                                >
                               Are you sure you want to make "{this.state.user?(this.state.user.user_id.displayName||this.state.user.user_id.name):null}" an admin?
                              </Modal>
                              </Menu.Item>}

                            <Menu.Item disabled={!this.state.MemberActions && item.role === "admin"}>
                              {/* <Popconfirm placement="leftBottom" title={`Are you sure you want to remove the member ${item.user_id.name} ?`} onConfirm={() => this.handleRemove(item._id, index)} okText="Yes" cancelText="No"> */}
                                <div style={{ width: "100%"}} onClick={()=>this.handleRemoveMemberfunc(item)}>
                                  Remove Member
                                </div>
                              {/* </Popconfirm> */}
                              <Modal
                                    visible={this.state.openRemoveMemberModal}
                                    onOk={()=>this.handleRemove(this.state.user._id)}
                                    onCancel={()=>this.setState({openRemoveMemberModal:false})}
                                    okText="Yes"
                                    cancelText="No"
                                >
                             Are you sure you want to remove the member "{this.state.user?(this.state.user.user_id.displayName||this.state.user.user_id.name):null}" ?
                              </Modal>
                            </Menu.Item>
                          </Menu>
                        }
                      >
                        <Button size="small" disabled={(!this.state.MemberActions) && (item.role === "admin")}>
                          {item.role === "admin" ? <span>Admin
                            </span> : <span>Member
                            </span>} <DownOutlined />
                        </Button>
                      </Dropdown>
                    ]}>
                    <List.Item.Meta
                      avatar={
                        item.user_id.profilePicUrl ?<Avatar src={item.user_id.profilePicUrl}/>:
                          <Avatar >{this._getInitials(item.user_id.displayName||item.user_id.name)}</Avatar>}
                      title={item.user_id.displayName||item.user_id.name}
                      description={item.user_id.email}
                    />
                  </List.Item>
                )}
              />
            </Col>
          </Row>
          </div>
        </Layout>
      </Fragment>
    );
  }
}


SquadMembers.propTypes = {
  members: PropTypes.array.isRequired,
  getMembers: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    user_now:state.common_reducer.user,
    workspace_members: state.skills.members,
    workspace: state.common_reducer.workspace,
    members: state.projectMembership.members,
    project: state.projects.project
  }
};

export default withRouter(connect(mapStateToProps, {
  getProject, 
  // getProfileinfo, 
  updateUserWorkspaces,
  getWorkspaceMembers, getWorkspace, setProjectMembers,
  getMembers, setProjectAdmin, deleteMember, addMember
})(SquadMembers))