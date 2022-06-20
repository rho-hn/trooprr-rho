import React, { Component } from "react";
import { Layout, PageHeader, Typography, Form, Input, Button, /* List, Switch, Avatar, */ message, Select } from "antd";
import { QuestionCircleOutlined, ProjectOutlined, BulbOutlined, PieChartOutlined, CheckCircleOutlined } from "@ant-design/icons";
import TrooprLogo from "../media/troopr_logo.png";
import AppsumoLogo from "../media/as-appsumo-logo-blk.png";
import Theme from "./Theme";
import axios from "axios";

const { Title, Text } = Typography;
const { Content } = Layout;
const { Option } = Select;

class AppsumoPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedProduct: "",
      code: "",
      error: null,
    };
  }

  componentDidMount() {}

  validateCode = (type) => {
    const { code, selectedProduct } = this.state;

    if (!selectedProduct) {
      message.error("Select a product");
      return;
    }
    if (code.trim().length <= 0) {
      message.error("Enter valid redeem code");
      return;
    }

    axios.get("/bot/appsump_code_validation/" + code).then((res) => {
      if (res.data.success && res.data.status === "available") {
        if (type === "sign_up") {
          const url = `https://app.troopr.io/slack?source=appsumo&appsumo_code=${code}&product=${this.state.selectedProduct}`;
          window.open(url, "_self");
        } else {
          window.location = `https://slack.com/oauth/v2/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&user_scope=identity.basic,identity.team,identity.email&state=appsumo/${code}/${this.state.selectedProduct}`;
        }
      } else if (res.data.success) {
        if (res.data.status === "already_redeemed") message.error("Code already redeemed");
        else message.error("Invalid code");
      } else message.error("Error validating code");
    });
  };

  // handleProductSelect = () => {
  //   this.setState({selectedProduct:checked ? [product] : []})
  // }

  render() {
    const onboarding_products = [
      {
        title: "Check-in",
        key: "standups",
        desc: "Conduct asynchronous meetings in Slack",
        icon: <CheckCircleOutlined />,
      },
      {
        title: "Project (Jira)",
        key: "jira_software",
        desc: "Manage Jira Software issues in Slack",
        icon: <ProjectOutlined />,
      },
      {
        title: "HelpDesk (Jira)",
        key: "jira_service_desk",
        desc: "Manage Jira service requests in Slack",
        icon: <QuestionCircleOutlined />,
      },
      {
        title: "Wiki (Confluence)",
        key: "wiki",
        desc: "Answer with Confluence articles in Slack",
        icon: <BulbOutlined />,
      },
      {
        title: "Report (Jira)",
        key: "jira_reports",
        desc: "Share actionable Jira reports in Slack",
        icon: <PieChartOutlined />,
      },
    ];
    return (
      <>
        <Theme />
        <Layout style={{ height: "100vh", width: "100vw", overflow: "auto", backgroundColor: "#fff" }}>
          <PageHeader>
            {/* <Title style={{disply : 'flex',justifyContent : 'center'}}>Troopr ❤️ AppSumo </Title> */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <img src={TrooprLogo} height='52' style={{ maxWidth: 150, minWidth: 150 }}></img>{" "}
              <img src={AppsumoLogo} style={{ maxWidth: 150, minWidth: 150, margin: "14px" }} height='35' />
            </div>
          </PageHeader>
          <Content
            style={{
              display: "flex",
              justifyContent: "flex-start",
              flexDirection: "column" /* ,alignItems:'center' */,
              maxWidth: "600px",
              margin: "auto",
            }}
          >
            <div>
              <Title level={3} style={{ textAlign: "center" }}>
                What do like to use Troopr for?
              </Title>
              <Text>This will personalize Troopr experience for your team members.</Text> <br />
              <br />
              {/* <List
                size='small'
                style={{ width: "100%" }}
                itemLayout='horizontal'
                dataSource={onboarding_products}
                renderItem={(item) => (
                  <List.Item style={{ padding: "5px 16px" }} actions={[]}>
                    <List.Item.Meta avatar={<Avatar icon={item.icon} />} title={item.title} description={item.desc} />
                    <Switch onChange={(checked) => this.handleProductSelect(item.key, checked)} checked={this.state.selectedProduct.includes(item.key)} />
                  </List.Item>
                )}
                // renderItem = {(item) => {
                //   console.log(item)
                // }}
              /> */}
            </div>
            <br />

            <Form
              name='basic'
              // labelCol={{ span: 4 }}
              // wrapperCol={{ span: 32 }}
              // initialValues={{ remember: true }}
              //   onFinish={onFinish}
              //   onFinishFailed={onFinishFailed}
              autoComplete='off'
              layout='vertical'
              style={{ width: "380px" }}
            >
              {/* <Form.Item
                label='Name'
                name='username'
                rules={[
                  {
                    required: true,
                    message: "Enter name",
                  },
                ]}
              >
                <Input placeholder='Enter name' />
              </Form.Item>

              <Form.Item
                label='Email'
                name='email'
                rules={[{ type: "email", message: "Enter valid email", required: true, message: "Enter valid email" }]}
              >
                <Input placeholder='Enter email' />
              </Form.Item> */}

              <Form.Item
                label='Select a product'
                name='product'
                rules={[
                  {
                    // required: true,
                    message: "Select a product",
                  },
                ]}
              >
                <Select style={{ width: "100%" }} placeholder='select a product' onChange={(selectedProduct) => this.setState({ selectedProduct })}>
                  {onboarding_products.map((product) => {
                    return (
                      <Option key={product.key} value={product.key}>
                        {product.title}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                label='AppSumo redeem code'
                name='appsumo_code'
                rules={[
                  {
                    // required: true,
                    message: "Enter AppSumo redeem code",
                  },
                ]}
              >
                <Input.Password placeholder='Enter code' onChange={(e) => this.setState({ code: e.target.value })} />
              </Form.Item>

              <Form.Item
                /* wrapperCol={{ offset: 8, span: 16 }} */ style={{
                  display: "flex",
                  "justify-content": "center",
                }}
              >
                <Button
                  onClick={() => this.validateCode("sign_up")}
                  type='primary'
                  style={{ display: "flex", justifyContent: "center", margin: "auto" }}
                >
                  Sign up
                </Button>
                <Button
                  onClick={() => this.validateCode("sign_in")}
                  type='link'
                  style={{ display: "flex", justifyContent: "center", margin: "auto",marginTop:'10px' }}
                >
                  Already signed up with Troopr ? Sign in
                </Button>
              </Form.Item>
            </Form>
          </Content>
        </Layout>
      </>
    );
  }
}

export default AppsumoPage;
