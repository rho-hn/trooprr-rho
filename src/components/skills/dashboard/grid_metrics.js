import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { ReloadOutlined, ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { Button, Card, Row, Col, PageHeader, Layout, message, Tooltip, Statistic } from "antd";
import { updateGridMetrics, getGridMetrics, getGridLevelUsermapping, getGridDateWiseActivities } from "./dashboardMetrics";
// import { XAxis, YAxis, Tooltip as ReTooltip, Legend, AreaChart, BarChart, Bar, Area, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import DashboardChart from "./charts";
import moment from "moment";

const { Content } = Layout;

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid_metrics: {},
      loading: true,
      grid_day_to_day_activities: [],
      grid_activities_types: [],
      mappedUsersCountInGrid: 0,
    };
  }
  componentDidMount() {
    // updateGridMetrics("E01F37K78BX");
    // getGridMetrics("E01F37K78BX");
    const { team } = this.props;
    this.props.onRef(this)
    if (team && team._id) {
      if (team.bot && team.bot.meta.enterprise.id) {
        this.getMetricsData();
      } else
        this.props.history.push(`/${this.props.match.params.wId}/dasshboard`);
    }
  }

  componentDidUpdate(prevProps) {
    const { team } = this.props;

    if (team !== prevProps.team) {
      if (team && team.bot && team.bot.meta.enterprise && team.bot.meta.enterprise.id) this.getMetricsData();
      else this.props.history.push(`/${this.props.match.params.wId}/dasshboard`);
    }
  }

  componentWillUnmount() {
    this.props.onRef(undefined)
  }
  sendData(){
    setTimeout(() => {
      this.props.sendData([moment(this.state.grid_metrics.lastUpdated).format("lll"),"grid"])
    },0) // calling the function when js event loop is done with other task in the callback queue
  }
  sendInitialData(){
    this.props.sendInitialData(moment(this.state.grid_metrics.lastUpdated).format("lll"))
  }


  getMetricsData = () => {
    const { team } = this.props;

    getGridLevelUsermapping(team.bot.meta.enterprise.id).then((res) => {
      res.success && this.setState({ mappedUsersCountInGrid: res.mappedUsersInGridCount.length });
    });
    if (team && team.bot && team.bot.meta.enterprise) {
      getGridMetrics(team.bot.meta.enterprise.id).then((res) => {
        if (
          res.success &&
          res.grid_metrics &&
          res.grid_metrics.hasOwnProperty("activeCheckinsCount") &&
          res.grid_metrics.hasOwnProperty("jiraCommonChannelData")&&
          res.grid_metrics.hasOwnProperty("notificationSubscriptionsCount")
        )
        {this.setState({ grid_metrics: res.grid_metrics, loading: false })
          this.sendInitialData()
      }

        else 
          updateGridMetrics(team.bot.meta.enterprise.id).then((res) => {
              if (res.success && res.grid_metrics) this.setState({ grid_metrics: res.grid_metrics, loading: false });
            });   
          });
      getGridDateWiseActivities(team.bot.meta.enterprise.id).then((res) =>
        this.setState({ grid_day_to_day_activities: res.data, grid_activities_types: res.activity_types })
      );
    }
  };

  updateGridMetrics = () => {
    const { team } = this.props;
    this.setState({ loading: true });
    team &&
      team.bot &&
      team.bot.meta.enterprise.id &&
      updateGridMetrics(team.bot.meta.enterprise.id).then((res) => {
        if (res.success && res.grid_metrics) {
          message.success("Grid metrics updated successfully");
          this.setState({ grid_metrics: res.grid_metrics, loading: false });
          this.sendData()
        }
      });
  };

  // getLegendText = (name,{payload}) => {
  //   return `${name} (${payload.value})`
  // }

  //   getRandomColor() {
  //     var letters = "0123456789ABCDEF";
  //     var color = "#";
  //     let colors = [];
  //     for (let n = 0; n < 29; n++) {
  //       for (var i = 0; i < 6; i++) {
  //         color += letters[Math.floor(Math.random() * 16)];
  //       }
  //       colors.push(color);
  //       color = "#";
  //     }
  //     return colors;
  //   }

  render() {
    const { grid_metrics, loading, grid_day_to_day_activities, grid_activities_types, mappedUsersCountInGrid } = this.state;
    const {
      activeUsers,
      checkInSubmissions,
      jiraNotifications,
      userActivity,
      activeCheckinsCount,
      jiraCommonChannelData,
      notificationSubscriptionsCount,
    } = grid_metrics;
    // const COLORS = ['#C8707E','#E28FAD','#EFB4C1','#E48E58','#EDAA7D','#F0C7AB','#5AA08D','#4C92B1','#A8C879'];
    const COLORS = [
      "#5AA08D",
      "#4C92B1",
      "#C8707E",
      "#EEE117",
      "#E48E58",
      "#E28FAD",
      "#5AA08D",
      "#4C92B1",
      "#C8707E",
      "#EEE117",
      "#E48E58",
      "#E28FAD",
      "#5AA08D",
      "#4C92B1",
      "#C8707E",
      "#EEE117",
      "#E48E58",
      "#E28FAD",
      "#5AA08D",
      "#4C92B1",
      "#C8707E",
      "#EEE117",
      "#E48E58",
      "#E28FAD",
    ];
    return (
      <Row gutter={[16, 16]}>
        <Col className='gutter-row' span={4}>
          <Card
            title='Active Users'
            size='small'
            style={{ height: "100%" }}
          >
            <Statistic title='30 days' value={activeUsers && activeUsers.thisMonth} />
          </Card>
        </Col>
        <Col className='gutter-row' span={12}>
          <Card
            size='small'
            title='User activities'
            style={{ height: "100%" }}
          >
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Statistic title='30 days' value={userActivity && userActivity.thisMonth} />
              </Col>
              <Col span={8}>
                <Statistic title='Previous period' value={userActivity && userActivity.lastMonth} />
              </Col>
              <Col span={8}>
                <Statistic
                  title='Progress'
                  value={userActivity && Math.abs(Math.round(userActivity.progress))}
                  valueStyle={{
                    color:
                      (userActivity && userActivity.progress > 0) ||
                      (userActivity && userActivity.progress === 0) ||
                      (userActivity && userActivity.progress === null)
                        ? "#3f8600"
                        : "red",
                  }}
                  prefix={
                    (userActivity && userActivity.progress > 0) ||
                    (userActivity && userActivity.progress === 0) ||
                    (userActivity && userActivity.progress === null) ? (
                      <ArrowUpOutlined />
                    ) : (
                      <ArrowDownOutlined />
                    )
                  }
                  suffix='%'
                />
              </Col>
            </Row>
          </Card>
        </Col>

        <Col className='gutter-row' span={8}>
          <Card
            style={{ width: "100%", height: "100%" }}
            title='Check-in submissions'
            size='small'
          >
            <Row>
              <Col span={12}>
                <Statistic title='30 days' value={checkInSubmissions && checkInSubmissions.thisMonth} />
              </Col>
              <Col span={12}>
                <Statistic title='Previous period' value={checkInSubmissions && checkInSubmissions.lastMonth} />
              </Col>
            </Row>
          </Card>
        </Col>

        <Col className='gutter-row' span={8}>
          <Card style={{ width: "100%", height: "100%" }} title='Jira verified Users' size='small'>
            <Statistic
              title='Jira verified Users'
              value={mappedUsersCountInGrid}
              // suffix={}
            />
          </Card>
        </Col>

        <Col className='gutter-row' span={12}>
          <Card
            style={{ width: "100%" }}
            title='Jira Notifications'
            size='small'
          >
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Statistic title='30 days' value={jiraNotifications && jiraNotifications.thisMonth} />
              </Col>
              <Col span={8}>
                <Statistic title='Previous period' value={jiraNotifications && jiraNotifications.lastMonth} />
              </Col>
              <Col span={8}>
                <Statistic
                  title='Progress'
                  value={jiraNotifications && Math.abs(Math.round(jiraNotifications.progress))}
                  valueStyle={{
                    color:
                      (jiraNotifications && jiraNotifications.progress > 0) ||
                      (jiraNotifications && jiraNotifications.progress === 0) ||
                      (jiraNotifications && jiraNotifications.progress === null)
                        ? "#3f8600"
                        : "red",
                  }}
                  prefix={
                    (jiraNotifications && jiraNotifications.progress > 0) ||
                    (jiraNotifications && jiraNotifications.progress === 0) ||
                    (jiraNotifications && jiraNotifications.progress === null) ? (
                      <ArrowUpOutlined />
                    ) : (
                      <ArrowDownOutlined />
                    )
                  }
                  suffix='%'
                />
              </Col>
            </Row>
          </Card>
        </Col>

        <Col className='gutter-row' span={4}>
          <Card
            title='Active Check-ins'
            size='small'
            // bordered={false}
            style={{ height: "100%" }}
          >
            <Statistic value={activeCheckinsCount || ""} />
          </Card>
        </Col>

        {/*             <Col className='gutter-row' span={4}>
              <Card
                title='Channel Configurations'
                size='small'
                style={{ height: "100%" }}
                extra={
                  <Tooltip title={`Last updated at ${moment(grid_metrics && grid_metrics.lastUpdated).format("lll")}. Click to reload.`}>
                    <Button
                      size='small'
                      type='link'
                      shape='circle'
                      onClick={() => this.updateGridMetrics()}
                      icon={<ReloadOutlined spin={loading} />}
                    />
                  </Tooltip>
                }
              >
                <Statistic value={jiraCommonChannelData} />
              </Card>
            </Col>
            <Col className='gutter-row' span={4}>
              <Card
                title='Notification Subscriptions'
                size='small'
                style={{ height: "100%" }}
                extra={
                  <Tooltip title={`Last updated at ${moment(grid_metrics && grid_metrics.lastUpdated).format("lll")}. Click to reload.`}>
                    <Button
                      size='small'
                      type='link'
                      shape='circle'
                      onClick={() => this.updateGridMetrics()}
                      icon={<ReloadOutlined spin={loading} />}
                    />
                  </Tooltip>
                }
              >
                <Statistic value={notificationSubscriptionsCount} />
              </Card>
            </Col>*/}

        {/* chard data */}
        <DashboardChart day_by_day_activities={grid_day_to_day_activities} activity_categories={grid_activities_types} />
        {/* <Col className='gutter-row' span={24}>
              <Card
                size='small'
                title='User activities'
                style={{ height: "100%" }}
                // extra={
                //   <Tooltip title={`Last updated at ${moment(grid_metrics && grid_metrics.lastUpdated).format("lll")}. Click to reload.`}>
                //     <Button
                //       size='small'
                //       type='link'
                //       shape='circle'
                //       onClick={() => this.updateGridMetrics()}
                //       icon={<ReloadOutlined spin={loading} />}
                //     />
                //   </Tooltip>
                // }
              >
                <Row gutter={[16, 16]}>
                  <Col span={14}>
                    <AreaChart data={grid_day_to_day_activities} width={600} height={300}>
                      <ReTooltip contentStyle={localStorage.getItem("theme") === "dark" && { backgroundColor: "#000" }} />
                      <XAxis dataKey={"date"} />
                      <Area
                        type='monotone'
                        dataKey='activities'
                        fill={localStorage.getItem("theme") === "default" ? "#402E96" : "#664af0"}
                        // strokeWidth={2}
                        // fillOpacity={1}
                      />
                    </AreaChart>
                  </Col>
                  <Col col={8}>
                    <ResponsiveContainer width={400} height={300}>
                      <PieChart>
                        <Pie dataKey='total' data={grid_activities_types} cx='50%' cy='50%' outerRadius={80} fill='#8884d8' label={false}>
                          {grid_activities_types.map((data, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend layout={"horizontal"} formatter={this.getLegendText}/>
                        <ReTooltip
                        //   contentStyle={localStorage.getItem("theme") === "dark" && { backgroundColor: "#000" }}
                        //   labelStyle={localStorage.getItem("theme") === "dark" && { color: "white" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Col>
                </Row>
              </Card>
            </Col> */}
      </Row>
    );
  }
}

const mapStateToProps = (state) => ({
  user_now: state.common_reducer.user,
  workspace: state.common_reducer.workspace,
  team: state.skills.team,
});

export default withRouter(
  connect(mapStateToProps, {
    // updateGridMetrics,
  })(Dashboard)
);
