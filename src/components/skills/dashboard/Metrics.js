import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { PageHeader, Layout, Tabs, Spin } from "antd";
import WorkspaceMetrics from "./WorkspaceMetrics";
import GridMetrics from "./grid_metrics";
import { Button } from "antd";
import {
  ReloadOutlined,
} from "@ant-design/icons";
import "./metrics.css"

const { TabPane } = Tabs

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = { activeKey: 'workspace_metrics',loading:true, gridWorkSpace: false, updateDashBoard: "",updateGridMetrics: "",gridInitial:"",lastUpdatedGrid:"",lastUpdatedWorkSpace:"" }
    this.getData = this.getData.bind(this);
    this.getGridInitialData = this.getGridInitialData.bind(this)
  }
  handleTabChange = () => {
    if (this.state.activeKey === "workspace_metrics") {
      this.setState({ activeKey: "grid_metrics" })
    }
    else {
      this.setState({ activeKey: "workspace_metrics" });
    };
  }
  onClick = () => {
    if (this.state.activeKey === "workspace_metrics") {
      this.state.updateDashBoard();
    } else this.state.updateGridMetrics();
  }
  getData(val) {
    this.setState({loading:true})
    if (val && val[0] !== "Invalid date")
      if (this.state.activeKey === "workspace_metrics") {
        this.setState({ lastUpdatedWorkSpace: val[0] });
      } else {
        this.setState({ lastUpdatedGrid: val[0] })
      }
    this.setState({ loading: false })
  }
  getGridInitialData(val){
    if(val){
      this.setState({lastUpdatedGrid:val})
    }
  }

  render() {
    const { team } = this.props;
    let isGridWorkspace,loading = true
    if(team.id) loading = false
    if (team.bot && team.bot.meta && team.bot.meta.enterprise && team.bot.meta.enterprise.id) isGridWorkspace = true
    return (
      <>
        <Layout
          style={{
            height: "100vh",
            overflow: "auto",
            marginLeft: 0,
            padding: "16px 24px"
          }}
        >
          <div className="header">
            <PageHeader
              title={
                <>
                  <span style={{ marginRight: 8 }}>Metrics</span>
                  <Button type="primary" onClick={this.onClick} icon={<ReloadOutlined />}>
                    Refresh
                  </Button>
                </>
              }
              subTitle={!this.state.loading ? `Last refreshed at ${this.state.activeKey === "workspace_metrics" ? this.state.lastUpdatedWorkSpace : this.state.lastUpdatedGrid}`:""}
            />
          </div>
          {loading ? (
            <Spin style={{ marginTop: "37vh", marginLeft: "0" }} />
          ) : (
            <>
              {isGridWorkspace ? (
                <Tabs className="mainBody" defaultActiveKey={"workspace_metrics"} onChange={this.handleTabChange}>
                  <TabPane tab="Workspace" key="workspace_metrics">
                    <WorkspaceMetrics sendData={this.getData}
                      onRef={(ref) => {
                        try { this.setState({ updateDashBoard: ref.getDashBoardMetrix}) } catch (e) { console.error(e) }
                      }} />
                  </TabPane>
                  <TabPane tab="Grid" key="grid_metrics">
                    <GridMetrics sendData={this.getData} sendInitialData={this.getGridInitialData} onRef={(ref) => {
                      try { this.setState({ updateGridMetrics: ref.updateGridMetrics }) } catch (e) { console.error(e) }
                    }} />
                  </TabPane>
                </Tabs>
              ) : (
                <div className="mainBody">
                  <WorkspaceMetrics sendData={this.getData}
                    onRef={(ref) => {
                      try { this.setState({ updateDashBoard: ref.getDashBoardMetrix }) } catch (e) { console.error(e) }
                    }} />
                </div>
              )}
            </>
          )}
        </Layout>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  team: state.skills.team,
});

export default withRouter(connect(mapStateToProps, {})(Dashboard));