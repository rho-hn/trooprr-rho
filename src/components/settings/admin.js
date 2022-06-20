import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Row, Col, PageHeader, Avatar, Divider, List, Select, Modal, message, Popconfirm, Typography, Space, Layout, Alert, Card } from "antd";
import {makeWorkspaceAdmin,deleteWorkspaceAdmin}  from "../skills/skills_action.js"
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { updateUserInfo } from "../skills/skills_action";
import { setUser } from "../common/common_action";
import SyncUserModal from "./SyncUserModal"
const { Text } = Typography;
const { Option } = Select;
const { Content } = Layout;

const { confirm } = Modal;

class Admin extends Component {
  constructor(props) {
    super();
    this.state = {
      adminList: [],
      memberList: [],
      isMembersModalVisible: false,
      currentMemberSelected: "",
      isCurrentAdmin: false,
     
    };
  }

  async componentDidMount() {
    // console.log(this.props.user_name);

    // axios
    //   .get(`/api/${this.props.workspace._id}/admins`)
    //   .then((res) => {
    //     if (res.data.success && res.data.admins) {
    //       this.setState({ adminList: res.data.admins });
    //     }
    //   })
    //   .catch((err) => {
    //     console.log("error fetching admins of this workspace from server: ", err);
    //   });

    // axios
    //   .get(`/api/${this.props.workspace._id}/members`)
    //   .then((res) => {
    //     if (res.data.success && res.data.members) {
    //       this.setState({ memberList: res.data.members });
    //     }
    //   })
    //   .catch((err) => {
    //     console.log("error fetching members of this workspace from server: ", err);
    //   });
  }

  showMembersModal = () => {
    this.setState({
      isMembersModalVisible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      isMembersModalVisible: false,
    });
  };

  handleOk = () => {
    this.setState({
      isMembersModalVisible: false,
    });
  };
  

  addAdmin = (memberId) => {

    this.props.makeWorkspaceAdmin(this.props.workspace._id,memberId).then((res) => {
        if (res.data.success) {
          message.success("Admin Added Successfully");
      
        }else if(res.data.errors && res.data.errors.action=="change_plan"){
          let t =  res.data.errors.text
          let c = <> <p>Upgrade to unlock more Multi-admin access. </p><br/> </>
          confirm({
              title: t,
              okText:"Upgrade",
              icon: <ExclamationCircleOutlined />,
              content: c,
              onOk: () => {
                this.props.history.push('/'+ this.props.match.params.wId+'/settings?view=upgrade')
               
                // this.addAdmin(opt.key)
                //   this.setState({ currentMemberSelected: "" })
                  },
              onCancel() {
                  //do nothing
                  // console.log('Cancel');
              },
  
  
  
  
      
      })
    }
      }).catch((err) => {
        console.log("error in adding member as the workspace admin: ", err);
      });
  };

  onMemberSelect = (val, opt) => {
    // console.log("insiude onMemberSelect");
    // console.log("val -> ",val);

    // console.log("opt -> ",opt.key);
    let t = `This action will add ${val} as administrator of ${this.props.workspace.name}. Are you sure?`;
    let c = "Troopr workspace administrators can manage Check-ins, Jira integration, Squads and Workspace features including Billing information.";
    confirm({
      title: t,
      icon: <ExclamationCircleOutlined />,
      content: c,
      onOk: () => {
        this.addAdmin(opt.key);
        this.setState({ currentMemberSelected: "" });
      },
      onCancel() {
        //do nothing
        // console.log('Cancel');
      },
    });
  };

  adminDeletePopconfirmTitle = (name) => {
    return `This action will remove admin privileges for ${name}. Are you sure?`;
  };

  //val is the user id
  deleteAdmin = (val) => {
    let currentUserId = localStorage.getItem("trooprUserId");

    if (currentUserId === val) {
      message.error("Cannot remove yourself from admin list");
      return;
    }

    this.props.deleteWorkspaceAdmin(this.props.workspace._id,val).then((res) => {

        if (res.data.success) {
         
          message.success("Admin converted to member successfully");
    
     
       }else if(res.data.errors && res.data.errors.action=="change_plan"){
          let t =  res.data.errors.text
          let c = <> <p>Upgrade to unlock more Multi-admin access. </p><br/> </>
          confirm({
              title: t,
              okText:"Upgrade",
              icon: <ExclamationCircleOutlined />,
              content: c,
              onOk: () => {
                this.props.history.push('/'+ this.props.match.params.wId+'/settings?view=upgrade')
               
                // this.addAdmin(opt.key)
                //   this.setState({ currentMemberSelected: "" })
                  },
              onCancel() {
                  //do nothing
                  // console.log('Cancel');
              },
  
  
  
  
      
      })} else {
          // console.log("Could not remove the admin role");
        }
      })
      .catch((err) => {
        // console.log("error in removing admin role: ", err);
      });
  };

  // isSelf = (val) => {

  // }

  getInitials(string) {
    if (string) {
      let nameArr = string
        .trim()
        .replace(/\s+/g, " ") //remove extra spaces
        .split(" ");

      if (nameArr.length > 1) return (nameArr[0][0] + nameArr[1][0]).toUpperCase();
      else return nameArr[0].slice(0, 2).toUpperCase();
    } else return "";
  }

  render() {
  
let workspaceMembers=[]
let admins=[]
this.props.members.forEach(member=>{


 
  if(member.role=="admin"){
{/* <Option key={member._id} value={member.name}>
{member.name}
</Option> */}
 admins.push(member)


  }else{
    let option= <Option key={member.user_id._id} value={member.user_id.displayName||member.user_id.name}>
{member.user_id.displayName||member.user_id.name}
</Option>

    workspaceMembers.push(option)
  }
})

    // let pageHeaderTitle = `${this.props.workspace.name} Administrators: ${this.state.adminList.length}`;
    let pageHeaderTitle = `Administrators (${admins.length})`;

    let adminListDataSource = admins;
    adminListDataSource.sort(function (a, b) {
      var nameA = (a.user_id.displayName||a.user_id.name).toUpperCase(); // ignore upper and lowercase
      var nameB = (b.user_id.displayName||b.user_id.name).toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // names must be equal
      return 0;
    });
    return (
      <>
        <PageHeader title={pageHeaderTitle} />
        <Content style={{ padding: "16px 16px 32px 24px",height:'75vh', overflow: "scroll" }}>
          <Alert
            message='Troopr workspace administrators can manage all Troopr products and also manage Billing information'
            type='info'
            showIcon
            style={{ width: "50%", marginBottom: 16 }}
          />
          <Row style={{ width: "50%" }} gutter={[0, 16]}>
            {this.props.isAdmin && <Col span={24}>
              <Card title='Add New Administrator' style={{ width: "100%" }} size='small'>
                <Text type='secondary'>Select a workspace member below to add them as workspace Administrator</Text>
                <br />
                <br />
                <Select
                  showSearch
                  style={{ width: 200 }}
                  allowClear={true}
                  // defaultValue=""
                  placeholder='Type member name'
                  dropdownClassName='sidebar_dropdown'
                  // value={this.state.memberList._id && this.state.memberList.name}
                  value={this.state.currentMemberSelected}
                  onSelect={this.onMemberSelect}
                  // onChange={this.onMemberChange}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {workspaceMembers}
                </Select>
                <br />
               <SyncUserModal />
              </Card>
            </Col>}
            <Col span={24}>
              <Card title='Current Administrators' style={{ width: "100%" }} size='small'>
                <List
                  size='small'
                  pagination={{ pageSize: 10 }}
                  itemLayout='horizontal'
                  // loading={true}
                  dataSource={adminListDataSource}
                  renderItem={(item) => (
                    <List.Item
                      actions={[this.props.isAdmin &&
                        <Popconfirm
                          title={() => this.adminDeletePopconfirmTitle(item.user_id.displayName||item.user_id.name)}
                          onConfirm={() => this.deleteAdmin(item.user_id._id)}
                          // onCancel={cancel}
                          okText='Yes'
                          cancelText='No'
                        >
                          {/* <DeleteOutlined/> */}
                          <a href='#'>Remove Admin</a>
                        </Popconfirm>,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar src={item.profilePicUrl}>{this.getInitials(item.user_id.displayName||item.user_id.name)}</Avatar>}
                        title={item.user_id.displayName||item.user_id.name}
                        description={item.email}
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </Content>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    workspace_name: state.common_reducer.workspace.name,
    workspace: state.common_reducer.workspace,
    user_name: state.common_reducer.user.name,
   members: state.skills.members,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    updateUserInfo,makeWorkspaceAdmin,deleteWorkspaceAdmin,
    setUser,
  })(Admin)
);
