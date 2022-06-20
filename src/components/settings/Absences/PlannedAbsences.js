import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { PageHeader, Tabs, Layout } from "antd";
import MyAbsences from "./MyAbsences";
import TeamAbsences from "./TeamAbsences";

const { TabPane } = Tabs;

class PlannedAbsences extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentActiveKey: "my_absences",
    };
  }

  componentDidMount() {}

  render() {
    const { currentActiveKey } = this.state;
    const { isWorkspaceAdmin } = this.props;
    return (
      <Layout style={{marginLeft: 0,
       height: "100vh", overflowY: "scroll" }}>
        <PageHeader
          ghost={false}
          title='Absences'
          subTitle='Choose the days when you dont want Troopr to send Check-in alerts'
          footer={
            isWorkspaceAdmin && (
              <Tabs defaultActiveKey='team_absences' activeKey={currentActiveKey} onChange={(key) => this.setState({ currentActiveKey: key })}>
                <TabPane tab='My Absences' key='my_absences' />
                <TabPane tab='Team Absences' key='team_absences' />
              </Tabs>
            )
          }
        />
        {currentActiveKey === "my_absences" ? <MyAbsences /> : <>{isWorkspaceAdmin && <TeamAbsences />}</>}
      </Layout>
    );
  }
}

const mapStateToProps = (store) => ({
  user: store.auth.user,
  isWorkspaceAdmin: store.common_reducer.isAdmin,
});

export default withRouter(connect(mapStateToProps, {})(PlannedAbsences));
