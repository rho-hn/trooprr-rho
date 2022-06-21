import React, { Component } from "react";
import axios from "axios";

import { setWorkspace } from "../common/common_action";

import { setDriftState } from "../auth/authActions";

import {
  Tag,
  Button,
  Modal,
  Card,
  message,
  Input,
  Row,
  Col,
  Alert,
  Dropdown,
  Menu,
  Popconfirm,
  Switch,
  Collapse,
  Typography,
  Space,
} from "antd";
import moment from "moment";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { sendMessageOnchat } from "utils/utils";

const uuidv4 = require("uuid/v4");
const { Panel } = Collapse;
const { Text } = Typography;
class JiraBilling extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      //   loadingUser: false,
      //   loadingToken: false,
      //   channels: [],
      //   projects: [],
      //   issues: [],
      //   defaultProject: "",
      //   defaultIssue: "",
      //   skillsToggle: false,
      //   notificationToggle: false,
      //   personalNotifToggle: false,
      //   preference: "channel",
      //   selectedChannel: "",
      //   selectedChannelName: "",
      //   selectedProject: "",
      //   currentSkill: this.props.match.params.skill_id,
      //   linkedProject: null,
      //   linkedIssue: null,
      //   personalProject: "",
      //   personalIssue: "",
      //   personalChannelId: "",
      //   edit: false,
      //   error: {},
      //   showChannelSetting: false,
      //   disconnectModel: false,
      //   searchChannel: "",
      //   value: "",
      //   suggestions: [],
      //   getToken: false,
      //   userName: "",
      //   userToken: "",
      //   adminUserName: "",
      //   adminMailId: '',
      //   newConnectionModal: false,
      //   loading: false,
      //   isUnfurlLink:'',
      //   isAnyAdmin: false,
      //   isThreadSync: false,
      //   loadingPricing:false,payment:{}
      loadingPricing: false,
    };
  }

  openChatWindow = () => {
    sendMessageOnchat("👋");
  };

  getPaymentText = () => {
    const { payment } = this.props;
    let text = "";
    if (payment && payment.payment_app && payment.payment_app == "jira") {
      text = (
        <>
          Troopr subscription for this worksapce is linked to Troopr app license
          in
          <br /> your connected Atlassian account (Switch off the button above
          to disable <br />
          linking and pay for Troopr subscription using stripe)
          <br />
          <br />
          App License status :{" "}
          <b>
            {payment.plan_status == "active"
              ? "Paid"
              : payment.plan_status == "trial"
              ? "Eval"
              : "Eval expired"}
          </b>{" "}
          <a onClick={() => this.syncJiraLicense(true)}>Update</a>
          <br /> <br /> For questions contact hello@troopr.io or{" "}
          <a onClick={this.openChatWindow}>Chat with us.</a>
        </>
      );
    } else {
      text = (
        <>
          Switch on the button above if you prefer to pay for Troopr
          subscription
          <br /> via your Atlassian Billing account.Troopr will fetch Troopr
          license <br />
          information from the connected Atlassian account. Please ensure that
          <br /> you have necessary administrative access for the same.
          <br /> <br /> For questions contact hello@troopr.io or{" "}
          <a onClick={this.openChatWindow}>Chat with us.</a>
        </>
      );
    }
    return text;
  };
  syncJiraLicense = (checked, e) => {
    // console.log(checked,e)
    this.setState({ loadingPricing: true });
    let app = "stripe";
    if (checked) {
      app = "jira";
    }
    axios
      .get(
        "/bot/api/" +
          this.props.match.params.wId +
          "/getLicenseStatus?app=" +
          app
      )
      .then((data) => {
        let billing = data.data;
        this.setState({ loadingPricing: false });
        if (billing.success) {
          // console.log(billing.payment.payment)
          this.props.updatePayment(billing.payment.payment);

          setWorkspace(billing.payment.payment.workspace_id);
        } else {
          message.error(billing.err);
        }
      });
  };

  render() {
    return (
      <>
        {this.props.workspace.billing_status == "paid" &&
        this.props.payment &&
        this.props.payment.payment_app !== "jira" ? (
          <></>
        ) : (
          <>
            <Card
              loading={this.state.loadingPricing}
              id="abl"
              title="Link Atlassian Billing"
              key="1"
              style={{ marginTop: 20,marginLeft:10 }}
              extra={
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Switch
                    onChange={this.syncJiraLicense}
                    disabled={!this.props.isUserPrivileged}
                    checked={
                      this.props.payment &&
                      this.props.payment.payment_app == "jira"
                        ? true
                        : false
                    }
                    // checked={this.state.isUnfurlLink}
                  />
                </div>
              }
            >
              <Text type="secondary">{this.getPaymentText()}</Text>
            </Card>
          </>
        )}
      </>
    );
  }
}

export default withRouter(
  connect(null, {
    setWorkspace,
    setDriftState,
  })(JiraBilling)
);
