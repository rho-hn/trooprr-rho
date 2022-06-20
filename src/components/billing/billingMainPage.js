import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { RocketOutlined, QuestionCircleOutlined, FastForwardOutlined } from "@ant-design/icons";
import { Row, Col, Card, Result, message, PageHeader, Button, Typography, Divider, Alert, Layout, Modal } from "antd";
import axios from "axios";

import moment from "moment";
import TrialPage from "./trialPage";
import { setDriftState } from "../auth/authActions";
import JiraBilling from "./jiraBilling";
import { sendMessageOnchat } from "utils/utils";

const { Title, Text, Link } = Typography;
const uuidv4 = require("uuid/v4");
// const JiraBilling=require("./jiraBilling")

class Billing extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      isProfileView: true,
      assistant_name: "Troopr Assistant",
      team: {},
      skills: [],
      defaultSkill: "",
      nameLoading: false,
      defaultLoading: false,
      info: {},
      activeUsers: {},
      jiraSkill: {},
      numberofActiveCheckIns: 0,
      pricings: [],
      // showSelfPlans: false,
    };

    this.getText = this.getText.bind(this);
    this.getButton = this.getButton.bind(this);
  }

  componentDidMount() {
    // this.props.skills(this.props.workspace._id)
    // console.log(process.env.REACT_APP_STRIPE_TOKEN)
    this.setState({ loading: true });
    let billingPromise = axios.get("/auth/troopr_billing/payementInfo/" + this.props.match.params.wId);

    // let activeUsers = axios.get("/auth/troopr_billing/getActiveUsers/" + this.props.match.params.wId)

    let pricing = axios.get("/auth/pricing");

    // const checkInsPromise = axios.get('/api/getUsersSelectedTeamSync/' + this.props.match.params.wId +"?showAll=true")

    Promise.all([billingPromise, pricing]).then((data) => {
      let billing = data[0].data;
      let pricings = data[1].data.pricings;

      this.setState({ info: billing.paymentInfo, pricings: pricings, loading: false });
    });
  }

  getPrice = () => {
    const { members } = this.props;
    const { jiraSkill, numberofActiveCheckIns, activeUsers } = this.state;
    // const activeusers = activeUsers.quantity
    if (members && jiraSkill._id) {
      if (jiraSkill.linked) {
        if (members.length > 25) return "49";
        else return "10";
      } else if (!jiraSkill.linked) {
        if (members.length > 25) return "19";
        else if (members.length < 26 && numberofActiveCheckIns > 1) return "19";
        else return "0";
      }
    }
  };

  getPlan = () => {
    const { info } = this.state;
    const { workspace } = this.props;
    if (workspace.is_enterprise) {
      return "Troopr Enterprise Plan";
    } else if (info.payment_app == "jira") {
      return "Your  Atlassian License is Active.";
    } else {
      if (info.plans && info.plans.length > 0) {
        let plans = [];

        this.state.pricings.forEach((p) => {
          let isPlan = false;
          if (p.key) {
            p.products.forEach((prd) => {
              prd.prices.forEach((price) => {
                isPlan = info.plans.find((id) => id === price.price_id);
                if (isPlan) {
                  plans.push(prd.name);
                }
              });
            });
          } else {
            isPlan = info.plans.find((id) => id === p.plan_id);
            if (isPlan) {
              plans.push(p.name);
            }

            // dbPlans.push({price_id:p.plan_id,frequency:p.billing_cycle,name:p.name})
          }
        });
        // let plans=  this.state.pricings.filter(p=>!p.key).find(plan=>(info.plan_id==plan.plan_id))
        return plans.length > 0 ? plans.join(", ") : "Troopr Plan";
      }else if (info && info.payment_app === 'appsumo'){
        const products = workspace.subscribed_products && workspace.subscribed_products.products ? workspace.subscribed_products.products : []
        let text = ''
        products.forEach((product,index) => {
          if(product === 'jira_software') text += 'Project Pro'
          else if(product === 'jira_service_desk') text += 'Helpsesk Pro'
          else if(product === 'jira_reports') text += 'Report Pro'
          else if(product === 'wiki') text += 'Wiki Pro'
          else if(product === 'standups') text += 'Check-in Pro'
          if(index !== products.length -1) text += ', '
        }) 

        return text
      } 
      else {
        if (info.plan_id) {
          let plan = this.state.pricings.filter((p) => !p.key).find((plan) => info.plan_id == plan.plan_id);
          if (plan) {
            return plan.name + "(" + plan.billing_cycle + ")";
          } else if (info.plan_id == "price_1Hz1ShHJhp7EYP6g36Xv9aLn") {
            return "Troopr Monthly 19$";
          } else if (info.plan_id == "price_1HK0ZIHJhp7EYP6gMdF3c13p") {
            return "Troopr Pro Yearly";
          } else if (info.plan_id == "price_1HK0X6HJhp7EYP6gZbh03F2k") {
            return "Troopr Starter Yearly";
          } else if (info.plan_id == "price_1H7bjfHJhp7EYP6gx97AVKSn") {
            return "Troopr Starter Monthly";
          } else if (info.plan_id == "price_1H6xUGHJhp7EYP6gFzgxzjHy") {
            return "Troopr Pro Monthly";
          } else if (info.plan_id == "price_1H6xTfHJhp7EYP6glq6N9wMI") {
            return "Troopr Pro Monthly";
          } else if (info.plan_id == "plan_FiFBie8XpLdC3U") {
            return "Troopr Pro Monthly (Per user $2)";
          } else {
            return "Troopr Plan";
          }
        }
      }
    }

    // return "Pro";
  };
  updatePayment = (payment) => {
    this.setState({ info: payment });
  };
  getButton = (plan_id) => {
    const { workspace } = this.props;
    const { info } = this.state;
    if (!plan_id && workspace.billing_status && workspace.is_enterprise) {
      return null;
    } else if (info && info.payment_app === 'appsumo') {
      return null
    } else if (plan_id && plan_id == "custom_pricing") {
      return (
        <Button onClick={this.customPricing} type='primary' key='billing'>
          Chat with us
        </Button>
      );
    } else if (
      workspace.billing_status !== "trial" &&
      workspace.billing_status !== "free" &&
      workspace.billing_status !== "grace_period" &&
      !this.props.isAdmin
    ) {
      return (
        <Button onClick={this.showPermissionError} type='primary' key='billing'>
          Manage
        </Button>
      );
    } else {
      let url = window.location.origin + "/troopr_billing/" + this.props.workspace._id;
      let text = "Manage";
      if (plan_id) {
        url += "?plan_id=" + plan_id;
        text = "Choose";
      }
      return (
        <Button href={url} type='primary' key='billing'>
          {text}
        </Button>
      );
    }
  };
  showPermissionError = () => {
    message.error({ content: "You don't have permission to perform this action. Only workspace admin can manage billing." });
  };

  pricingPageQuestion = () => {
    localStorage.setItem("TROOPR_DRIFT_APP_MESSAGE", "Query on pricing");
    this.openChatWindow("Query on pricing");
  };

  chooseUnlimitedEnterprisePlan = () => {
    localStorage.setItem("TROOPR_DRIFT_APP_MESSAGE", "Query on Enterprise plan");
    this.openChatWindow("Query on Enterprise plan");
  };

  customPricing = () => {
    localStorage.setItem("TROOPR_DRIFT_APP_MESSAGE", "Query on Custom pricing");
    this.openChatWindow("Query on Custom pricing");
  };

  changePlan = () => {
    localStorage.setItem("TROOPR_DRIFT_APP_MESSAGE", "Query on Change plan");
    this.openChatWindow("Query on Change plan");
  };

  openChatWindow = (msg) => {
    sendMessageOnchat(msg);
  };

  showComparison = () => {
    Modal.info({
      title: "Self Service vs Enterprise",
      width: 800,
      maskClosable: true,
      content: (
        <Row style={{ marginTop: 32 }} gutter={[16, 16]}>
          <Col span={12}>
            <Card title='Self Service Plan Features'>
              ✔️ Flat pricing
              <Divider></Divider>
              ✔️ Limited features
              <Divider></Divider>
              ✔️ Standard Support
              <br />
              ✔️ Credit Card Payment only
              <br />
              <br />
              <Text>ℹ️ Choose a self service plan to see more</Text>
            </Card>
          </Col>
          <Col span={12}>
            <Card title='Enterprise Plan Features'>
              ✔️ Custom pricing
              <Divider></Divider>
              ✔️ Unlimited features
              <Divider />
              ✔️ Prioritized 24/7 Email & Chat Support
              <br />
              ✔️ Multiple Payment Methods
              <br />
              ✔️ Payment via PO/Invoice
              <br />
              ✔️ Multi-product Bundle Discount
              <br />
              ✔️ Custom Contract
              <br />
              ✔️ Dedicated Success Manager
              <br />
              ✔️ Prioritized Feature Requests
              <br />
              ✔️ Implementation Support
              <br />
              ✔️ Rollout and Adoption Guidance
              <br />
              ✔️ Security Assessment
              <br />
              ✔️ Vendor Evaluation
              <br />
              ✔️ Customizations to DPA, ToS, SLA
              <br />
              ✔️ Master Service Agreement
              <br />
              ✔️ Extended Evaluation Period
              <br />
              ✔️ Free Staging Setup
              <br />
            </Card>
          </Col>
        </Row>
      ),
      onOk() {},
    });
  };

  // showPlans = (isPlanMode) => {
  //   this.setState({
  //     showSelfPlans: isPlanMode,
  //   });
  // };
  getText = () => {
    let workspace = this.props.workspace;
    let text = "";
    if (workspace._id) {
      if (workspace.billing_status === "trial" || workspace.billing_status === "grace_period") {
        text = (
          <Fragment>
            {" "}
            <Title level={4}> Trial</Title>
            <Alert
              // message=  {moment(new Date())<=moment(workspace.trial_end)?(moment(workspace.trial_end).diff(new Date(),'days')<1?'14 day trial period expires today.':`${moment(workspace.trial_end).diff(new Date(),'days')} days left of 14 day trial period.`) +" Choose a plan to continue using Troopr.":"Your trial period has expired. Choose a plan to keep working without interruption."}
              message={
                moment(new Date()) <= moment(workspace.trial_end)
                  ? (moment(workspace.trial_end).diff(new Date(), "days") < 1
                      ? "Your trial period expires today."
                      : `${moment(workspace.trial_end).diff(new Date(), "days")} days left in your trial period.`) +
                    " Choose a plan to continue using Troopr."
                  : "Your trial period has expired. Choose a plan to keep working without interruption."
              }
              // description="Your trial is expiring in 14 days. Choose a plan to keep working without interruption"
              type={moment(new Date()) > moment(workspace.trial_end) ? "warning" : "info"}
              showIcon
            />
            {/* <br />
            <Button
              onClick={() => {
                this.showPlans(true);
              }}
            >
              Choose Self Service Plan
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.chooseUnlimitedEnterprisePlan}>
              Choose Unlimited Enterprise Plan
            </Button>
            <br />
            <br /> */}
            {/* <Link onClick={this.showComparison}>Compare Self Service vs Enterprise Plans</Link> */}
          </Fragment>
        );
      } else if (workspace.billing_status == "paid") {
        text = (
          <Fragment>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Title level={5}> {this.getPlan()}</Title>
              <Button onClick={this.changePlan}>Change Plan</Button>
            </div>
          </Fragment>
        );
      } else if (workspace.billing_status == "free") {
        text = (
          <Fragment>
            {/* <div>
              <strong>{this.props.workspace.name}</strong> is currently on the <strong>Starter plan</strong>.<br></br>
              Upgrade to Pro plan for unlimited users and priority support.
            </div> */}
            <div>
              <Title level={4}>
                Starter<br></br>
              </Title>
              Choose any of the plan below to use Troopr without interruption.
            </div>
          </Fragment>
        );
      } else {
        if (workspace.billing_status == "grace_payment_failed" || workspace.billing_status == "payment_failed") {
          text = (
            <Fragment>
              {(this.state.info.plan_id || this.state.info.length > 0) && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Title level={4}> {this.getPlan()}</Title>
                  <Button onClick={this.changePlan}>Change Plan</Button>
                </div>
              )}
              <Alert
                message='Payment towards your Troopr subscription was unsucessful. Click on Manage button to update your billing information to keep working without interruption.'
                // description="Your trial is expiring in 14 days. Choose a plan to keep working without interruption"
                type='error'
                showIcon
              />
            </Fragment>
          );
        } else {
          text = (
            <Fragment>
              <div>
                <strong>{this.props.workspace.name}</strong> is currently on the <strong>Starter plan</strong>.<br></br>
                10 active users are allowed in this plan.
                <br></br>
                <br></br>
                Upgrade to Pro plan for unlimited users and priority support.
              </div>
              <br></br>
              <Button
                icon={<RocketOutlined />}
                href={window.location.origin + "/troopr_billing/" + this.props.workspace._id}
                type='primary'
                key='billing'
              >
                Upgrade
              </Button>
            </Fragment>
          );
        }
      }
    }
    return text;
  };

  render() {
    const { workspace } = this.props;
    return (
      <Fragment>
        <PageHeader
          title='TrooprHQ Billing'
          subTitle={
            <span>
              For any questions regarding our Plans visit the{" "}
              <a href='https://www.troopr.ai/pricing' target='_blank'>
                pricing page
              </a>{" "}
              or reach us at sales@troopr.io
            </span>
          }
        />
        {!this.state.loading && (
          <div
            // style={{height:700,overflow: "scroll"}} ̰ ̰
            style={{ height: "75vh", paddingBottom: 20, overflowY: "auto", overflowX: "hidden" }}
          >
            {this.state.info.payment_app == "jira" ? (
              <Row
                style={{
                  // padding: "32px 24px 0px 24px",
                  padding: "0px 24px 0px 24px",
                }}
                gutter={[16, 16]}
              >
                {" "}
                <Col span={24}>
                  {" "}
                  <JiraBilling payment={this.state.info} workspace={this.props.workspace} updatePayment={this.updatePayment} />{" "}
                </Col>
              </Row>
            ) : (
              <Row
                style={{
                  // padding: "32px 24px 0px 24px",
                  padding: "0px 24px 0px 24px",
                }}
                gutter={[16, 16]}
              >
                {workspace.billing_status == "trial" || workspace.billing_status == "free" || workspace.billing_status == "grace_period" ? (
                  <>
                    <Col span={24}>
                      <Card
                        title='Current Plan(s)'
                        extra={
                          workspace.billing_status !== "trial" &&
                          workspace.billing_status !== "free" &&
                          workspace.billing_status !== "grace_period" &&
                          this.state.info.payment_app !== "jira"
                            ? this.getButton()
                            : null
                        }
                      >
                        {this.getText()}
                        <TrialPage
                          pricings={this.state.pricings}
                          showPlans={this.showPlans}
                          workspace={workspace}
                          selectProduct={this.selectProduct}
                          selectedProduct={[]}
                          getButton={this.getButton}
                          chooseUnlimitedEnterprisePlan={() => this.chooseUnlimitedEnterprisePlan()}
                        />
                        <Link onClick={this.showComparison}>Compare Self Service vs Enterprise Plans</Link>
                      </Card>
                    </Col>
                  </>
                ) 
                /* : workspace.billing_status == "paid" ? (
                  <Col span={24}>
                    <Card
                      title='Current Plan(s)'
                      extra={
                        workspace.billing_status !== "trial" && workspace.billing_status !== "grace_period" && this.state.info.payment_app !== "jira"
                          ? this.getButton()
                          : null
                      }
                    >
                      <div>{this.getText()}</div>
                    </Card>
                  </Col>
                )  */
                : (
                  <Col span={24}>
                    <Card
                      title='Current Plan(s)'
                      extra={
                        workspace.billing_status !== "trial" && workspace.billing_status !== "grace_period" && this.state.info.payment_app !== "jira"
                          ? this.getButton()
                          : null
                      }
                    >
                      <div>{this.getText()}</div>
                    </Card>
                  </Col>
                )}

                <br />
                <Col span={24}>
                  <Button type='text' icon={<QuestionCircleOutlined />} onClick={this.pricingPageQuestion}>
                    Got questions? Chat with us
                  </Button>
                </Col>
              </Row>
            )}
          </div>
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    workspace: state.common_reducer.workspace,
    members: state.skills.members,
    skills: state.skills,
    WorkspaceAdmin: state.common_reducer.isAdmin,
  };
};

export default withRouter(connect(mapStateToProps, { setDriftState })(Billing));
