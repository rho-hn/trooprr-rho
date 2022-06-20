import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { PageHeader, Layout, Alert, Form, Input, Button, message, Checkbox, Select, Collapse } from "antd";
import { updateWorkspace, getChannelList } from "../skills/skills_action";
import Validator from "validator";

const { Option } = Select;

class Feedback extends Component {
  constructor(props) {
    super();
    this.state = { feedbacktoChannel: true, channelsLoading : false };
  }

  componentDidMount(){
    if(this.props.channels && this.props.channels.length === 0){
      this.setState({channelsLoading : true})
      this.props.getChannelList(this.props.match.params.wId).then(res => this.setState({channelsLoading : false}));
    }
  }

  onSave = (data) => {
    const validEmail = true,
      validHelpDocsLink = true;
    let d = {};
    if (data.Feedback.Email && data.Feedback.Email.length > 0) {
      if (Validator.isEmpty(data.Feedback.Email) || !Validator.isEmail(data.Feedback.Email)) {
        message.error("Enter valid email address");
        validEmail = false;
      } else {
        d.customFeedbackemail = data.Feedback.Email;
      }
    } else {
      d.customFeedbackemail = "";
    }
    //if(data.Feedback.Docs){
    if(data.Feedback.Docs && data.Feedback.Docs.length > 0){
      if((/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g).test(data.Feedback.Docs)){
        d.customHelpDocsLink = data.Feedback.Docs
      }else {
        message.error("Enter valid url (example : https://www.troopr.ai)");
        validHelpDocsLink = false;
      }
    } else d.customHelpDocsLink = "";

    data.Feedback.Channel ? (d.customFeedbackChannel = data.Feedback.Channel) : (d.customFeedbackChannel = "");

    if (validEmail && validHelpDocsLink) this.onCustomFeedbackEmailChange(d);
  };

  onCustomFeedbackEmailChange = (data) => {
    this.props.updateWorkspace(this.props.match.params.wId, "", data).then((res) => {
      if (res.data.success) message.success("Updated successfully");
      else message.error("Error updating");
    });
  };

  render() {
    const { workspace, channels } = this.props;
    return (
      <Collapse style={{ borderTop: "transparent" }}>
        <Collapse.Panel header='Feedback' key='1'>
          <Alert
            message={<p>Customize where feedback is sent when users report by clicking <br/>on the "Help & Feedback" button in Troopr App Home or by<br/> typing /t feedback{'<feedback message>'}. This is useful when you <br/>have a helpdesk in your organization to manage internal feedback <br/>about Troopr. Note that feedback will be sent to the Troopr team<br/> as well.</p>}
            type='info'
            showIcon
            style={{ marginBottom: "20px", width: "90%" }}
          />

          <Form
            autocomplete='off'
            ref={this.formRef}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            // name="userProfileForm"
            hideRequiredMark={true}
            initialValues={{
              Feedback: {
                Email: workspace.customFeedbackemail,
                Channel: workspace.customFeedbackChannel || null,
                Docs: workspace.customHelpDocsLink,
              },
            }}
            onFinish={this.onSave}
          >
            <Form.Item labelAlign='left' label='Email' name={["Feedback", "Email"]} /*rules={[{ type:"email", required: true }]}*/>
              <Input allowClear placeholder='Enter custom email' />
            </Form.Item>
            <Form.Item labelAlign='left' label='Channel' name={["Feedback", "Channel"]} /*rules={[{ type:"email", required: true }]}*/>
              <Select
                loading={channels.length == 0}
                allowClear
                showSearch
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                placeholder='Select custom channel'
                loading={this.state.channelsLoading}
              >
                {channels.map((channel) => (
                  <Option key={channel.id}>{channel.name}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item labelAlign='left' label='Help Docs' name={["Feedback", "Docs"]} /*rules={[{ type:"email", required: true }]}*/>
              <Input allowClear placeholder='Enter custom docs link' />
            </Form.Item>
            <Form.Item wrapperCol={{ span: 12, offset: 4 }} shouldUpdate={true}>
              {() => (
                <Button
                  htmlType='submit'
                  disabled={
                    this.formRef &&
                    this.formRef.current &&
                    (!this.formRef.current.isFieldsTouched(true) ||
                      this.formRef.current.getFieldsError().filter(({ errors }) => errors.length).length)
                  }
                  type='primary'
                >
                  Save
                </Button>
              )}
            </Form.Item>
          </Form>
        </Collapse.Panel>
      </Collapse>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    workspace: state.common_reducer.workspace,
    channels: state.skills.channels,
  };
};

export default withRouter(connect(mapStateToProps, { updateWorkspace, getChannelList })(Feedback));
