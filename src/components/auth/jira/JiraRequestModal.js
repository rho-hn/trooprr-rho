import React from "react";
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Input } from "antd";
import { connect } from "react-redux";
import axios from "axios";
import { setCurrentUser } from "../authActions";
import Validator from "validator";
import { withRouter } from "react-router-dom";

const { TextArea } = Input;

class JiraRequestModal extends React.Component {
  state = {
    email: "",
    // error: {},
    emailValidStatus: 'success',
    emailHelp: ""
  };

  onChangeHandler = event => {
    this.setState({
      email: event.target.value
    });
  };

  onSubmitHandler = event => {
    // console.log("onSubmitHandler")
    event.preventDefault();
  };

  validateEmail = data => {
    // console.log("validating email:"+data)
    if (Validator.isEmpty(data) || !Validator.isEmail(data)) {
      // console.log("invalid email detected")
      this.setState({emailValidStatus:"error", emailHelp:"Enter valid email address"})
      return false;
    } else {
      this.setState({emailValidStatus:"success", emailHelp:""})
      return true;
    }
  };

  onOKbutton = () => {
    // console.log("onOKbutton")
    let value = this.state.email;

   
    let jiraUrl = `https://app.troopr.io/${this.props.match.params.wId}/jira_notification_setup/${this.props.skill_id}`;
    let name = this.props.auth.name;

    // console.log("validating email..")
    if (this.validateEmail(this.state.email)) {
      // console.log("api to send email")
      axios
        .post("/api/jira/emailJiraAdmin", {
          params: {
            value,
            jiraUrl,
            name
          }
        })
        .then(res =>{});
      this.props.toggle();
    }
  };

  render() {
    const url =  `https://app.troopr.io/${this.props.match.params.wId}/jira_notification_setup/${this.props.skill_id}`;;
   
    return (
      <Modal
      title="Send a request to Jira Admin"
      visible={this.props.modal}
      // footer={null}
      okText = "Send Email"
      onOk = {this.onOKbutton}
      onCancel = {this.props.toggle}
      centered
      >

      <Form layout="vertical" onSubmit={this.onSubmitHandler}>
            <Form.Item validateStatus={this.state.emailValidStatus} help={this.state.emailHelp} required label="Jira admin’s email id">
              <Input value={this.state.email} placeholder="admin@acme.com" onChange={this.onChangeHandler}></Input> 
            </Form.Item>
            <Form.Item required label="Email Message" className="collection-create-form_last-form-item">
              <TextArea rows={8} value={`Hey, I need your help to receive Jira push notification in Slack via Troopr Assistant. Please click on this link to complete the setup:\n ${url} \n\nThank you.`}/>
            </Form.Item>
            {/* <Form.Item className="collection-create-form_last-form-item">
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item> */}
          </Form>

        
        {/* <div >
          <div className="all_page_container pt-4">
            <div className="mt-3 d-flex justify-content-between align-items-center">
              <form onSubmit={this.onSubmitHandler}>
                <label>Jira admin’s mail id</label>
                <input
                  autoComplete="off"
                  style={{
                    width: "600px",
                    marginRight: "16px",
                    padding: "12px"
                  }}
                  type="email"
                  className={"form-control ts_custom_input"}
                  name="name"
                  value={this.state.value}
                  onChange={this.onChangeHandler}
                  placeholder={`Enter Email Id`}
                />
                {this.state.error.isEmail && (
                  <span className="error_span">{this.state.error.isEmail}</span>
                )}
                <div style={{ marginTop: "16px" }}>
                  <div>
                    <div>
                      <label>Message</label>
                    </div>
                    <textarea
                      spellcheck="false"
                      style={{ height: "100px", padding: "10px" }}
                      value={`Hey, I need your help to receive Jira push notification in Slack via Troopr Assistant. Please click on this link to complete the setup: https://app.trooopr.io${url}
                             Thanks.`}
                      className={"form-control ts_custom_input"}
                    />
                    <div />
                  </div>
                </div>
                
              </form>
            </div>
          </div>
        </div> */}


      </Modal>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth.user
  };
};

export default withRouter(
  connect(mapStateToProps, {
   setCurrentUser }
)(JiraRequestModal));
