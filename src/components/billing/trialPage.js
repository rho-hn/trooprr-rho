import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { ShoppingCartOutlined, CloseOutlined, ShoppingOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Row, Col, Card, Space, Tag, Button, Typography, Radio, List, Divider, Modal, Switch, Tabs, message } from "antd";
import {updateWorkspace} from '../skills/skills_action';
import { getKeyThenIncreaseKey } from "antd/lib/message";
const { Text, Title } = Typography;
const { TabPane } = Tabs;

const productName = {
  check_in: "Check-in",
  wiki: "Wiki (Confluence)",
  project: "Project (Jira)",
  helpdesk: "HelpDesk (Jira)",
  report: "Report (Jira)",
};

class TrialPage extends Component {
  constructor() {
    super();
    this.state = {
      frequency: "monthly",
      mainSelectedProducts: {},
      selectedProducts: [],
      windowWidth: 0,
      windowHeight: 0,
      billing_type: "normal",
      activeKey: "enterprise",
    };
  }
  getText = (text) => {
    return (
      <Fragment>
        {" "}
        <Text type='secondary'>{text}</Text> <br />
      </Fragment>
    );
  };
  getArrayData = (arr) => {
    return arr.length > 0 ? (
      <Fragment>
        {" "}
        {arr.map((text) => {
          let t = "✔️ " + text;
          return this.getText(t);
        })}{" "}
        <br />
      </Fragment>
    ) : null;
  };

  handleProductSwitch = (plan, products_coresponding_plan, checked) => {
    let mainSelectedProducts = this.state.mainSelectedProducts;
    if (!mainSelectedProducts[plan]) mainSelectedProducts[plan] = [];

    if (checked) mainSelectedProducts[plan].push(products_coresponding_plan);
    else mainSelectedProducts[plan] = mainSelectedProducts[plan].filter((i) => i.id !== products_coresponding_plan.id);
    this.setState({ mainSelectedProducts });
  };

  selectProduct = (product) => {
    let selectedProducts = this.state.selectedProducts;
    let index = selectedProducts.findIndex((i) => i.key === product.key);
    if (index > -1) {
      selectedProducts[index] = product;
    } else {
      selectedProducts.push(product);
    }
    this.setState({ selectedProducts });
  };
  removeProduct = (e, id) => {
    if (e) {
      e.preventDefault();
    }
    let selectedProducts = this.state.selectedProducts;
    selectedProducts = selectedProducts.filter((i) => i.id !== id);
    this.setState({ selectedProducts });
  };

  componentDidMount = () => {
    // this.initialSelectProProduct();
    this.intialySelectedProducts();
    window.addEventListener("resize", this.updateDimensions);
    this.updateDimensions();
  };

  intialySelectedProducts = () => {
    const plan_types = this.getPlanTypes();
    let pricings = this.props.pricings.filter((pricing) => pricing.key);

    let mainSelectedProducts = {};
    if (pricings) {
      plan_types.forEach((plan) => {
        pricings.forEach((product) => {
          const products_coresponding_plan = this.get_products_coresponding_plan({ product, plan });
          if (products_coresponding_plan) {
            if (!mainSelectedProducts[plan]) mainSelectedProducts[plan] = [];
            mainSelectedProducts[plan].push(products_coresponding_plan);
          }
        });
      });
    }

    this.setState({ mainSelectedProducts });
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  initialSelectProProduct = () => {
    let pricings = this.props.pricings.filter((pricing) => pricing.key);
    let selectedProducts = [];
    pricings.forEach((category) => {
      category.products.forEach((product) => {
        if (product.type === "pro") {
          selectedProducts.push(product);
          return;
        }
      });
    });
    this.setState({ selectedProducts });
  };

  goToBillingRedirect = (plan) => {
    const { billing_type } = this.state;
    if (billing_type === "custom" ? this.state.selectedProducts.length > 0 : Object.keys(this.state.mainSelectedProducts).length > 0) {
      let url = "/troopr_billing/" + this.props.workspace._id + "?plan_id=";
      const selectedProducts = billing_type === "custom" ? this.state.selectedProducts : this.state.mainSelectedProducts[plan];
      selectedProducts.forEach((product, i) => {
        let price = product.prices.find((p) => p.frequency === this.state.frequency && p.isArchived !== true);
        if (price) {
          url += price.price_id;
        }
        if (i < selectedProducts.length - 1) {
          url += ",";
        }
      });

      this.props.history.push(url);
    }
  };
  getProducts = (key, products) => {
    let planArr = products.map((p) => {
      if (!p.isArchived) {
        p.key = key;
        let isPlan = this.state.selectedProducts.find((i) => i.id === p.id);
        // let isActive =
        if (isPlan) {
          return (
            <Button onClick={() => this.removeProduct(false, p.id)} type='primary' key={p._id} style={{ marginLeft: 16 }}>
              <span style={{ marginRight: 3 }}>✔️</span>
              {p.desc}
            </Button>
          );
        } else {
          return (
            <Button onClick={() => this.selectProduct(p)} type='default' key={p._id} style={{ marginLeft: 16 }}>
              <span style={{ color: "transparent", marginRight: 3 }}>✔️</span>
              {p.desc}
            </Button>
          );
        }
      }
    });
    return planArr;
  };
  handleFrequecnyChange = (e) => {
    this.setState({ frequency: e.target.value });
  };
  getCheckoutText = () => {
    let prices = [];
    let total = 0;
    this.state.selectedProducts.forEach((product, i) => {
      let price = product.prices.find((p) => p.frequency === this.state.frequency && p.isArchived !== true);
      if (price) {
        prices.push(price);
        total += price.amount;
      }
    });
    if (this.state.frequency == "monthly") {
      return <b>$ {total.toFixed(2)} monthly</b>;
    } else {
      return (
        <div>
          <Text strong>$ {(total / 12).toFixed(2) + " "}monthly</Text> <Text type='secondary'>billed at $ {total.toFixed(2)} yearly</Text>
        </div>
      );
    }
  };
  showComparison = (product) => {
    Modal.info({
      title: "Plans comparision",
      width: 800,
      style: { top: 20 },
      closable: true,
      maskClosable: true,
      content: (
        <Row style={{ marginTop: 32, height: "76vh", overflowY: "auto" }} gutter={16}>
          {this.getListItems(product)}
        </Row>
      ),
      onOk() {},
    });
  };
  getListItems = (product) => {
    // console.log("Hui",product)
    const products = product.products ? product.products.filter(p => p.isArchived !== true) : []
    return products.map((pricing) => {
      return (
        <Col span={24 / products.length}>
          <Card>
            <Title level={4}> {pricing.name}</Title>
            {this.getText(pricing.plan_reason)}
            <Divider />
            <Title level={2}> ${pricing.prices[0].amount}</Title>
            {this.getText("per month")}
            {this.getText("Unlimited Users")}
            {/* {this.getProducts(pricing.key,pricing.products)} */}
            <Divider orientation='left'>Top features</Divider>
            {this.getArrayData(pricing.plan_features)}
            <Divider />
            {this.getArrayData(pricing.support_features)}
          </Card>
        </Col>
      );
    });
  };

  updateDimensions = () => {
    this.setState({ windowWidth: window.innerWidth, windowHeight: window.innerHeight });
  };

  getPlanTypes = () => {
    let pricings = this.props.pricings.filter((pricing) => pricing.key);

    let plan_types = [];
    pricings.forEach((product) => {
      product.products.forEach((plan) => {
        if (!plan_types.includes(plan.type) && !plan.isArchived) plan_types.push(plan.type);
      });
    });

    return plan_types;
  };

  getPriceText = (plan) => {
    const { mainSelectedProducts } = this.state;
    let price = 0;
    if (mainSelectedProducts[plan]) {
      mainSelectedProducts[plan].forEach((product) => {
        const P = product.prices.find((p) => p.frequency === this.state.frequency && p.isArchived !== true);
        if (P) price += P.amount;
      });
    }

    if (this.state.frequency == "monthly") {
      return (
        <>
          <Text style={{ fontSize: 28, fontWeight: 600 }}>$ {price.toFixed(2)}</Text>
          <Text style={{ fontSize: 12, fontWeight: 300 }}> per month</Text>
        </>
      );
    } else {
      return (
        <>
          <Text style={{ fontSize: 28, fontWeight: 600 }}>$ {(price / 12).toFixed(2) + " "}</Text>
          <Text style={{ fontSize: 12, fontWeight: 300 }}> per month</Text>
          <Text style={{ fontSize: 12, fontWeight: 300 }}>billed at ${price.toFixed(2)}/yr</Text>
        </>
      );
    }
  };

  handleCustomize = ({ plan, type }) => {
    const { mainSelectedProducts } = this.state;
    if (type === "customize") {
      // let selectedProducts = []
      // let pricings = this.props.pricings.filter((pricing) => pricing.key);
      // pricings.forEach(product => {
      //   const products_coresponding_plan = this.get_products_coresponding_plan({product,plan})
      //   if(products_coresponding_plan) selectedProducts.push(products_coresponding_plan)
      // })

      this.setState({ billing_type: "custom", selectedProducts: mainSelectedProducts[plan] });
    } else {
      this.intialySelectedProducts();
      this.setState({ billing_type: "normal", frequency: "monthly" });
    }
  };

  get_products_coresponding_plan = ({ product, plan }) => {
    return product.products.find((p) => p.type === plan && p.isArchived !== true);
  };

  handleStarterPlan = async () => {
    const res = await this.props.updateWorkspace(this.props.match.params.wId,'', {billing_status:"free"})
    if(res && res.data && res.data.success) message.success('Successfully upgraded to Starter plan')
  }

  getFeatureText = (plan) => {
    let text = "";
    if (plan === "unlimited") {
      text = (
        <>
          Unlimited recurring Check-ins
          <br />
          Unlimited Project Channels
          <br />
          Unlimited Agent Channels
          <br />
          Unlimited Support Channels
          <br />
          Unlimited Wiki Channels
          <br />
          Unlimited Channel Reports
        </>
      );
    } else if (plan === "premium") {
      text = (
        <>
          10 recurring Check-ins
          <br />
          10 Project Channels
          <br />
          3 Agent Channels
          <br />
          3 Support Channel
          <br />
          3 Wiki Channel
          <br />
          50 Channel Reports
        </>
      );
    } else if (plan === "pro") {
      text = (
        <>
          3 recurring Check-ins
          <br />
          3 Project Channels
          <br />
          1 Agent Channel
          <br />
          1 Support Channel
          <br />
          1 Wiki Channel
          <br />5 Channel Reports
        </>
      );
    }

    return text
  };

  render() {
    const { mainSelectedProducts } = this.state;
    const { workspace } = this.props;
    // console.log(this.props.workspace)
    // let isEnterpriseTrial = this.props.workspace.is_enterprise;
    let pricings = this.props.pricings.filter((pricing) => pricing.key);

    const plan_types = this.getPlanTypes();
    const plan_card_col = workspace && workspace.billing_status === 'free' ? 8 : 6

    return (
      <>
        {this.state.billing_type === "custom" ? (
          <Col span={24}>
            <br />
            <Card
              title={
                <Title style={{ fontSize: 17 }} level={5}>
                  Choose Your Plan
                </Title>
              }
              extra={
                <Button
                  icon={<CloseOutlined />}
                  onClick={() => {
                    this.handleCustomize({ type: "cancel" });
                  }}
                >
                  Cancel
                </Button>
              }
            >
              <Row gutter={[16, 16]}>
                <Col span={16}>
                  <Card
                    title={
                      <Title style={{ fontSize: 17 }} level={5}>
                        Plans Available
                      </Title>
                    }
                  >
                    <List
                      size='small'
                      itemLayout={this.state.windowWidth < 1020 ? "vertical" : "horizontal"}
                      dataSource={pricings}
                      renderItem={(item) => {
                        return (
                          <List.Item actions={[<Space direction='vertical'>{this.getProducts(item.key, item.products)}</Space>]}>
                            <List.Item.Meta
                              style={{ minWidth: 100 }}
                              title={
                                <Title style={{ fontSize: 17, minWidth: 150 }} level={5}>
                                  {productName[item.key]}
                                </Title>
                              }
                              description={<a onClick={() => this.showComparison(item)}>See Details</a>}
                            />
                          </List.Item>
                        );
                      }}
                    />
                    {/* </div> */}
                  </Card>
                </Col>
                <Col span={8}>
                  <Card
                    title={
                      <Title style={{ fontSize: 17 }} level={5}>
                        Selected Plans
                      </Title>
                    }
                  >
                    {this.state.selectedProducts.length <= 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ padding: 16 }}>
                          <ShoppingOutlined style={{ fontSize: 64, color: "#999" }} />
                        </div>
                        <Text type='secondary'>The plans you choose will appear here</Text>
                      </div>
                    )}
                    {this.state.selectedProducts.length > 0 && (
                      <Space direction='vertical'>
                        {this.state.selectedProducts.map((p) => (
                          <Tag key={p.id} closable onClose={(e) => this.removeProduct(e, p.id)}>
                            {p.name}
                          </Tag>
                        ))}
                        <Radio.Group onChange={this.handleFrequecnyChange} value={this.state.frequency} style={{ marginTop: 8, marginBottom: 8 }}>
                          <Space direction='vertical'>
                            <Radio value='monthly'>Monthly Billing</Radio>
                            <Radio value='yearly'>Annual Billing(20% off)</Radio>
                          </Space>
                        </Radio.Group>
                        {this.getCheckoutText()}
                        <Button
                          icon={<ShoppingCartOutlined />}
                          onClick={this.goToBillingRedirect}
                          type='primary'
                          key='billing'
                          style={{ marginTop: 8 }}
                        >
                          Checkout
                        </Button>
                      </Space>
                    )}
                  </Card>
                </Col>
              </Row>
            </Card>
            <br />
          </Col>
        ) : (
          <Tabs
            // defaultActiveKey={"enterprise"}
            activeKey={this.state.activeKey}
            onChange={(activeKey) => this.setState({ activeKey })}
          >
            <TabPane tab='Enterprise Plan' key='enterprise'>
              <Row gutter={[16, 16]} style={{ minWidth: "100%", padding: 16 }}>
                <Col span={plan_card_col}>
                  <Card
                    bodyStyle={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                    style={{ minWidth: 200, height: "100%" }}
                    hoverable
                  >
                    <Text style={{ fontSize: 20, marginBottom: 16 }}>Enterprise</Text>
                    <Text style={{ fontSize: 28, fontWeight: 600 }}>Custom</Text>
                    <Text style={{ fontSize: 12, fontWeight: 300 }}>billed yearly</Text>
                    <Divider />
                    <Text
                      style={{
                        flexGrow: 1,
                        display: "inline-flex",
                        alignItems: "center",
                        flexDirection: "column",
                        fontSize: 12,
                      }}
                    >
                      <Text type='secondary'>Includes</Text>
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        Check-in
                        <Switch style={{ marginLeft: 8 }} size='small' defaultChecked />
                      </div>
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        Project <Switch style={{ marginLeft: 8 }} size='small' defaultChecked />
                      </div>
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        HelpDesk <Switch style={{ marginLeft: 8 }} size='small' defaultChecked />
                      </div>
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        Wiki <Switch style={{ marginLeft: 8 }} size='small' defaultChecked />
                      </div>
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        Report <Switch style={{ marginLeft: 8 }} size='small' defaultChecked />
                      </div>
                    </Text>
                    <Divider />
                    <Text
                      style={{
                        // flexGrow: 1,
                        display: "inline-flex",
                        alignItems: "center",
                        flexDirection: "column",
                        fontSize: 12,
                      }}
                    >
                      <Text type='secondary'>What you get</Text>
                      Unlimited recurring Check-ins
                      <br />
                      Unlimited Project Channels
                      <br />
                      Unlimited Agent Channels
                      <br />
                      Unlimited Support Channels
                      <br />
                      Unlimited Wiki Channels
                      <br />
                      Unlimited Channel Reports <br />
                      Priority support, custom contract, dedicated success manager & more
                      <br />
                      <br />
                    </Text>
                    <Button type='primary' onClick={() => this.props.chooseUnlimitedEnterprisePlan()}>
                      Get Quote
                    </Button>
                  </Card>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab='Self Service Plans(s)' key='selfservice'>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Radio.Group
                  style={{ paddingLeft: 16 }}
                  onChange={(e) => this.setState({ frequency: e.target.value })}
                  value={this.state.frequency}
                  optionType='button'
                  buttonStyle='solid'
                >
                  <Radio.Button value={"monthly"}>Pay monthly</Radio.Button>
                  <Radio.Button value={"yearly"}>Pay yearly</Radio.Button>
                </Radio.Group>
                <ArrowLeftOutlined style={{ paddingLeft: 8 }} />
                <Text mark style={{ paddingLeft: 4 }}>
                  20% discount{" "}
                </Text>
              </div>
              <Row gutter={[16, 16]} style={{ minWidth: "100%", padding: 16 }}>
                {plan_types.reverse().map((plan) => {
                  return (
                    <Col span={plan_card_col}>
                      <Card
                        bodyStyle={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          textAlign: "center",
                        }}
                        style={{ minWidth: 200, height: "100%" }}
                        hoverable
                      >
                        <Text style={{ fontSize: 20, marginBottom: 16 }}>{plan ? plan.charAt(0).toUpperCase() + plan.slice(1) : ''}</Text>
                        {this.getPriceText(plan)}
                        <Divider />
                        <Text
                          style={{
                            // flexGrow: 1,
                            display: "inline-flex",
                            alignItems: "center",
                            flexDirection: "column",
                            fontSize: 12,
                          }}
                        >
                          <Text type='secondary'>Includes</Text>
                          {pricings.map((product) => {
                            const products_coresponding_plan = this.get_products_coresponding_plan({ product, plan });
                            if (products_coresponding_plan)
                              return (
                                <div
                                  style={{
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  {product.name}
                                  <Switch
                                    style={{ marginLeft: 8 }}
                                    disabled={
                                      mainSelectedProducts[plan] &&
                                      mainSelectedProducts[plan].length === 1 &&
                                      mainSelectedProducts[plan] &&
                                      mainSelectedProducts[plan].find((p) => p.id === products_coresponding_plan.id)
                                        ? true
                                        : false
                                    }
                                    size='small'
                                    checked={
                                      mainSelectedProducts[plan] && mainSelectedProducts[plan].find((p) => p.id === products_coresponding_plan.id)
                                    }
                                    onChange={(checked) => this.handleProductSwitch(plan, products_coresponding_plan, checked)}
                                  />
                                </div>
                              );
                          })}
                        </Text>
                        <Divider />
                        <Text
                          style={{
                            flexGrow: 1,
                            display: "inline-flex",
                            alignItems: "center",
                            flexDirection: "column",
                            fontSize: 12,
                          }}
                        >
                          {/* {pricings.map((product) => {
                            const products_coresponding_plan = this.get_products_coresponding_plan({ product, plan });
                            if (products_coresponding_plan)
                              return products_coresponding_plan.plan_features.map((feature, index) => {
                                return (
                                  <>
                                    {feature} <br />
                                  </>
                                );
                              });
                          })} */}
                          <Text type='secondary'>What you get</Text>
                          {this.getFeatureText(plan)}
                        </Text>
                        <Button
                          type='link'
                          onClick={() => {
                            this.handleCustomize({ plan, type: "customize" });
                          }}
                        >
                          Customize
                        </Button>
                        <Button onClick={() => this.goToBillingRedirect(plan)} type='primary' icon={<ShoppingCartOutlined />}>
                          Checkout
                        </Button>
                      </Card>
                    </Col>
                  );
                })}

                {workspace && workspace.billing_status==='free' ? '' : <Col span={plan_card_col}>
                  <Card
                    bodyStyle={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                    hoverable
                    style={{ minWidth: 200, height: "100%" }}
                  >
                    <Text style={{ fontSize: 20, marginBottom: 16 }}>Starter</Text>
                    <Text style={{ fontSize: 28, fontWeight: 600 }}>$0</Text>
                    <Text style={{ fontSize: 12, fontWeight: 300, marginBottom: this.state.frequency === 'yearly' && 18}}>per month</Text>
                    <Divider />
                    <Text
                      style={{
                        // flexGrow: 1,
                        display: "inline-flex",
                        alignItems: "center",
                        flexDirection: "column",
                        fontSize: 12,
                      }}
                    >
                      <Text type='secondary'>Includes</Text>
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        Check-in
                        <Switch style={{ marginLeft: 8 }} size='small' disabled defaultChecked />
                      </div>
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        Project <Switch style={{ marginLeft: 8 }} size='small' disabled />
                      </div>
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        HelpDesk <Switch style={{ marginLeft: 8 }} size='small' disabled />
                      </div>
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        Wiki <Switch style={{ marginLeft: 8 }} size='small' disabled />
                      </div>
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        Report <Switch style={{ marginLeft: 8 }} size='small' disabled />
                      </div>
                    </Text>
                    <Divider />
                    <Text
                      style={{
                        flexGrow: 1,
                        display: "inline-flex",
                        alignItems: "center",
                        flexDirection: "column",
                        fontSize: 12,
                      }}
                    >
                      <Text type='secondary'>What you get</Text>1 recurring Check-in
                    </Text>
                    <Button type='primary' onClick={() => this.handleStarterPlan()}>Choose</Button>
                  </Card>
                </Col>}
              </Row>
            </TabPane>
          </Tabs>
        )}
      </>
    );
  }
}
const mapStateToProps = state => {
  return {
    workspace: state.common_reducer.workspace,
    // members: state.skills.members,
    // skills: state.skills,
  }
};
export default withRouter(connect(mapStateToProps, {updateWorkspace})(TrialPage));
