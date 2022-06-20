import React, { Component } from "react";
import { Layout, PageHeader, Table, Button } from "antd";
import { withRouter } from "react-router-dom";
import moment from "moment-timezone";
import axios from "axios";

class AppsumoInfo extends Component {
  constructor(props) {
    super();
    this.state = {
      appsumoCodes: [],
      loading: true,
    };
  }

  componentDidMount() {
    const appsumoCodesPromise = axios.get(`/bot/api/${this.props.match.params.wId}/workspaceAppsumoData`);
    appsumoCodesPromise.then((res) => {
      if (res.data.success) this.setState({ appsumoCodes: res.data.codes, loading: false });
    });
  }

  render() {
    const columns = [
      {
        title: "Code",
        dataIndex: "code",
        key: "code",
      },
      {
        title: "Product",
        dataIndex: "product",
        key: "product",
        render: (value) => {
          if (value === "standups") return "Check-in";
          else if (value === "jira_software") return "Project (Jira)";
          else if (value === "jira_service_desk") return "HelpDesk (Jira)";
          else if (value === "jira_reports") return "Report (Jira)";
          else if (value === "wiki") return "Wiki (Confluence)";
        },
      },
      {
        title: "Activation",
        dataIndex: "updated_at",
        key: "updated_at",
        render: (value) => moment(value).format("DD MMM YYYY LT"),
      },
    ];
    return (
      <>
        <PageHeader title='AppSumo' subTitle='Redeemed code details' />
        <Layout.Content className='site-layout-background' style={{ padding: "16px 16px 32px 24px", width: "50%" }}>
          <Table dataSource={this.state.appsumoCodes} columns={columns} pagination={false} loading={this.state.loading} />
          <br />
          <Button disabled={this.state.appsumoCodes.length >= 5 || this.state.loading } type='primary' onClick={() => this.props.history.push("/appsumo")}>
            Apply new code
          </Button>
        </Layout.Content>
      </>
    );
  }
}

export default withRouter(AppsumoInfo);
