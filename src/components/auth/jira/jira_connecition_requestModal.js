import React from "react";
import { Form } from "@ant-design/compatible";
import "@ant-design/compatible/assets/index.css";
import {message, Modal, Select, Input, Typography, Button } from "antd";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import axios from "axios";

const { Option } = Select;
const { Text } = Typography;
class JiraConnectionRequestModal extends React.Component {
  state = {
    selectedUser: "",
    validateStatus: "",
    help: "",
    customMessage: "Let's make this happen!",
    username: ""
  };

  onSubmit = () => {
    const { selectedUser, customMessage, username } = this.state;
    if (selectedUser) {
      this.setState({ validateStatus: "success", help: "" });
      axios
        .post(`/bot/api/${this.props.match.params.wId}/requestAdminForJiraConnection`, {
          selectedUser,
          customMessage,
          skill_id: this.props.match.params.skill_id,
          team_id: this.props.team.id,
        })
        .then((res) => {
          if (res.data.success) {
            message.success(`Successfully sent request to ${username}`);
          } else {
            message.error("Error requsting the admin");
          }
          this.props.toggle();
        });
    } else {
      this.setState({ validateStatus: "error", help: "Select user" });
    }
  };

  handleSelectChange = (value, data) => {
    this.setState({ selectedUser: data.user_slack_id, validateStatus: "success", help: "", username: data.children });
  };

  handleCustomMessage = (value) => {
    this.setState({ customMessage: value})
  }

  render() {
    const { members } = this.props;
    const { validateStatus, help, username } = this.state;
    return (
      <Modal
        title='Request to connect to Jira'
        visible={this.props.modal}
        okText='Send to Admin'
        onOk={this.onSubmit}
        onCancel={this.props.toggle}
        centered
      >
        <Typography.Text>Choose Jira admin from dropdown list to request them to connect Troopr to your Jira</Typography.Text><br/> <br />
        <Form layout='vertical' onSubmit={this.onSubmitHandler}>
          <Form.Item validateStatus={validateStatus} hasFeedback help={help} required className={localStorage.getItem("theme") === 'dark' ? "form_label_dark" : "form_label"} label='Select Jira administrator'>
            <Select showSearch
                    optionFilterProp="children"
                    onChange={this.handleSelectChange}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    >
              {members.map((mem) => {
                return (
                  <Option key={mem.user_id._id} value={mem.user_id._id} user_slack_id={mem.slackInfo && mem.slackInfo.user_slack_id}>
                    {mem.user_id.displayName || mem.user_id.name || mem.user_id.user_name || ""}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <div style={{ textAlign: "center", border: "1px solid lightgray", padding: 8}}>        
            <Text strong>Message Preview</Text>
              <br />
              <Text>
                  Hey <a>@{username}</a>, {this.props.user_now.displayName || this.props.user_now.name} wants you to connect <a>@Troopr Assistant</a> to Jira.
                  Please click on the button below to set it up.
              </Text>
              <br /><br />
              <Text type="secondary">
                Message from {this.props.user_now.displayName || this.props.user_now.name}: {this.state.customMessage}
              </Text>
              <br />
              {/* <Button>🔗 Connect Jira</Button>
              <br /> */}
        </div>
        <br />
        <Form.Item name="customMessage" label="Custom Message" className={localStorage.getItem("theme") === 'dark' ? "form_label_dark" : "form_label"}>
              <Input value={this.state.customMessage} onChange={(e) => this.handleCustomMessage(e.target.value)}/>
        </Form.Item>
        </Form>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    members: state.skills.members,
    user_now: state.common_reducer.user,
    team: state.skills.team,
  };
};

export default withRouter(connect(mapStateToProps, {})(JiraConnectionRequestModal));

