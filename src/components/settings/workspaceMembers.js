import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";

import {
  DownOutlined,
  MailOutlined
} from '@ant-design/icons';

import {
  PageHeader,
  Tabs,
  Typography,
  Button,
  Select,
  message,
  Layout,
  Menu,
  Row,
  Col,
  Divider,
  Input,
  List,
  Avatar,
  Dropdown,
  Form,
} from "antd";

import {
  getWorkspaceMembers,
  deleteWorkspaceMember,
  updateMembership,
  sendWorkspaceInvite
} from "../skills/skills_action";
const { Option } = Select;

class WorkspaceMembers extends Component {

  constructor(props) {
    super();
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
  }

  sendInvite = values => {
    this.props
      .sendWorkspaceInvite(
        this.props.workspace._id,
        this.props.workspace.name,
        values.user.email
      )
      .then(res => {
        // this.setState({disableInviteButton: !this.state.disableInviteButton})
        if (res.data.success) {
          res.data.invite && message.success({ content: `Invite sent to ${values.user.email}`, duration: 3 })
          res.data.member && message.success({ content: `User ${values.user.email} added to this workspace`, duration: 3 })
        } else {
          message.error({ content: `Something went wrong! ${res.data.errors}`, duration: 3 });
        }
      });

  }

  render() {

    let wId = this.props.match.params.wId
    return (
      <Fragment>
        <PageHeader title={`${this.props.workspace_name} Members (${this.props.members && this.props.members.length})`}
          subTitle={this.props.workspace.isSlack ? `Members of this workspace are synced automatically from ${this.props.workspace_name} Slack team` : ""}
        />
        <Layout style={{ padding: "16px 0 0 24px",
        background: (localStorage.getItem('theme') == 'default' ? "#ffffff" : "rgba(15,15,15)")
        }} >
          <div style={{ width: "500px", maxWidth: "500px" }}>
            <Form
              layout="inline"
              initialValues={{
                user: {
                  email: "",
                  role: "member",
                },
              }}
              name="inviteForm"
              onFinish={this.sendInvite}
            >
              <Form.Item style={{ marginRight: 4, flexGrow: 1 }} name={['user', 'email']} rules={[{ type: 'email', required: true, message:'Email is required' }]}>
                <Input className={` input-bg ${localStorage.getItem("theme") == 'dark' && "autofill_dark"}`} placeholder="Enter Email Here"></Input>
              </Form.Item>
              <Form.Item style={{ marginRight: 4 }} name={['user', 'role']}>
                <Select bordered={false} style={{ marginRight: 4 }} defaultValue="member" >
                  {/* <Option value="admin">Admin</Option> */}
                  <Option disabled value="member">Member</Option>
                </Select>
              </Form.Item>
              <Form.Item style={{ marginRight: 0 }}>
                <Button
                  icon={<MailOutlined />}
                  htmlType="submit"
                  type="primary"
                >Invite</Button>
              </Form.Item>
            </Form>
            <Divider />
            <List
              size="small"
              pagination={{
                pageSize: 5,
              }}
              itemLayout="horizontal"
              dataSource={this.props.members}
              renderItem={item => (
                <List.Item align="left"
                  actions={[
                    <Dropdown disabled
                      trigger={["click"]}
                      overlay={
                        <Menu>
                          {item.role === "admin" ?
                            <Menu.Item onClick={() => this.props.updateMembership(wId, item._id, { role: 'member' })}>Remove Admin</Menu.Item> :
                            <Menu.Item onClick={() => this.props.updateMembership(wId, item._id, { role: 'admin' })}>Make Admin</Menu.Item>}
                          {/* <Menu.Item onClick={this.toggleAdminRole(this.props.match.params.wId)}>Remove Admin</Menu.Item> */}
                          <Menu.Item onClick={() => this.props.deleteWorkspaceMember(localStorage.getItem("userCurrentWorkspaceId"), item._id)}>Remove Member</Menu.Item>
                        </Menu>
                      }
                    >
                      <Button type="link" size="small">
                        {item.role === "admin" ? <span>Admin
                        </span> : <span>Member
                        </span>} <DownOutlined />
                      </Button>
                    </Dropdown>
                  ]}
                  >                  
                  <List.Item.Meta
                    avatar={<Avatar>{(item.user_id.displayName ?  item.user_id.displayName[0] : item.user_id.name[0]).toUpperCase()}</Avatar>}
                    title={item.user_id.displayName || item.user_id.name}
                    description={item.user_id.email}
                  />
                </List.Item>
              )}
            />
          </div>
        </Layout>
      </Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    members: state.skills.members,
    workspace_name: state.common_reducer.workspace.name,
    workspace: state.common_reducer.workspace
  }
}

export default withRouter(
  connect(mapStateToProps, {
    sendWorkspaceInvite,
    getWorkspaceMembers,
    deleteWorkspaceMember,
    updateMembership,
  })(WorkspaceMembers)
)