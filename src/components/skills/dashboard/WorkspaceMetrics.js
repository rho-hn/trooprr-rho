import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  ReloadOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import {
  getUserMappingAndUsers,
  updateWorkspace,
} from "../skills_action";
import { getWorkspaceDashboardChartData } from "./dashboardMetrics";
import { getWorkspaceActivityLog, getWorkspaceCkecInActivies, getWorkspaceJiraNotificationsLog, getWorkspaceActiveUsers } from "./dashboardMetrics";
import { Button, Card, Row, Col, message, Tooltip, Statistic } from "antd";
import DashboardChart from "./charts";
import moment from "moment";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jiraSkill: false,
      isJiraConnected: false,
      wId: "",      
      globalRefresh:this.props.refresh,
      // ---- metrics ----
      
      // ---- User Activity
      UserActivityThisMonth: 0,
      UserActivityLastMonth: 0,
      UserActivityProgress: 0,
      UserActivityLastupdated: null,
      UserActivityLoading: false,
      
      // ---- check in submissions
      CheckInSubmissionsThisMonth: 0,
      CheckInSubmissionsLastMonth: 0,
      CheckInSubmissionsLastupdated: null,
      CheckInSubmissionsLoading: false,
      activeCheckinsCount: 0,
      
      // --- jira notifications
      JiraNotificatinsThisMonth: 0,
      JiraNotificatinsLastMonth: 0,
      JiraNotificatinsProgress: 0,
      JiraNotificatinsLastupdated: null,
      JiraNotificatinsLoading: false,
      
      // --- active users
      activeUsers: 0,
      activeUsersLastupdated: null,
      activeUsersloading: false,
      dataRefreshing:false,
      
      day_by_day_activities: [],
      activity_categories: [],
      
      mappedUsersCount : false
    };
  }
  componentDidMount() {
    const { workspace } = this.props;
    this.props.onRef(this)
    this.sendData()
    this.setState({ wId: this.props.match.params.wId });
    if (this.props.skills.length > 0) {
      const jiraSkill = this.props.skills.find((skill) => skill.key === "jira");
      if (jiraSkill) {
        let isJiraConnected = jiraSkill.skill_metadata.linked;
        this.setState({ isJiraConnected });
        this.setState({ jiraSkill });
        this.props.getUserMappingAndUsers(this.props.match.params.wId, jiraSkill.skill_metadata._id, true).then(res => {
          this.setState({mappedUsersCount : res.data.userMappings})
        })
      }
    }
    // to handle the first time
    if (!workspace.dashboardMetrics || (workspace.dashboardMetrics && !workspace.dashboardMetrics.hasOwnProperty("activeCheckinsCount"))) {
      this.getDashBoardMetrix(true);
    } else if (workspace.dashboardMetrics) {
      this.setDashboardMetricsToState();
    }
    this.getChartData();
  }
  componentDidUpdate(prevProps) {
    const { skills, workspace } = this.props;
    const { wId } = this.state;
    if (skills != prevProps.skills) {
      const jiraSkill = this.props.skills.find((skill) => skill.key === "jira");
      if (jiraSkill) {
        let isJiraConnected = jiraSkill.skill_metadata.linked;
        this.setState({ isJiraConnected });
        this.setState({ jiraSkill });
        this.props.getUserMappingAndUsers(this.props.match.params.wId, jiraSkill.skill_metadata._id, true).then(res => {
          this.setState({mappedUsersCount : res.data.userMappings})
        })
      }
    }
    if (wId != this.props.match.params.wId) {
      this.setState({ wId: this.props.match.params.wId });
      this.getChartData();
      // to handle the first time
      if (!workspace.dashboardMetrics || (workspace.dashboardMetrics && !workspace.dashboardMetrics.activeCheckinsCount)) {
        this.getDashBoardMetrix(true);
      } else if (workspace.dashboardMetrics) {
        this.setDashboardMetricsToState();
      }
    }
  }

  componentWillUnmount() {
    this.props.onRef(undefined)
  }
  sendData(){
    setTimeout(() => {
      this.props.sendData([moment(this.state.UserActivityLastupdated).format("lll"),"workspace"]);    
     },0)   //calling the function when js event loop is done with other task in the callback queue
  }

  getChartData = () => {
    getWorkspaceDashboardChartData(this.props.match.params.wId).then((res) => {
      if (res.success) this.setState({ day_by_day_activities: res.data, activity_categories: res.activity_types });
    });
  };
  getDashBoardMetrix = (isFirstTime) => {
    let diff = 11; /* fail safe */
    if (!isFirstTime) {
      // ----checking the seconds (we are updating all the four metrics at the same time, so only taking the time from one)
      const start = moment(this.state.UserActivityLastupdated);
      const end = moment(Date.now());
      diff = end.diff(start, "seconds");
    }
    /*
    if(isFirstTime || diff > 9){
      this.setState({UserActivityLoading:true,CheckInSubmissionsLoading:true,JiraNotificatinsLoading:true,activeUsersloading:true})
      // -------- metrics ---------
      Promise.all([
        // -------- user activity
        this.userActivity_DashboardMetrics(),
        
        // ------- Checkin activities
        this.checkInActivities_DashboardMetrics(),
        
        // ----- Jira Notifications
        this.jiraNotifications_DashboardMetrics(),
        
        // ---- active users
        this.activeUsers_DasboardMetrics(),
      ]).then((data) => {
        this.updateWorkspaceWithMetrics("all");
      });
    }
    */
   if ((isFirstTime || diff > 9) && this.state.isJiraConnected) {
    this.setState({dataRefreshing:true})
    //  this.setState({ UserActivityLoading: true, CheckInSubmissionsLoading: true, JiraNotificatinsLoading: true, activeUsersloading: true });
     // -------- metrics ---------
     Promise.all([
       // -------- user activity
       this.userActivity_DashboardMetrics(isFirstTime),
       
       // ------- Checkin activities
       this.checkInActivities_DashboardMetrics(isFirstTime),
       
       // ----- Jira Notifications
       this.jiraNotifications_DashboardMetrics(isFirstTime),
       
       // ---- active users
       this.activeUsers_DasboardMetrics(isFirstTime),
      ]).then((data) => {
        this.updateWorkspaceWithMetrics("all");
        message.success({ content: "Metrics updated successfully" });
        this.setState({dataRefreshing:false})
      });
    } else if ((isFirstTime || diff > 9) && !this.state.isJiraConnected) {
      // this.setState({ UserActivityLoading: true, CheckInSubmissionsLoading: true, activeUsersloading: true });
      // -------- metrics ---------
      Promise.all([
        // -------- user activity
        this.userActivity_DashboardMetrics(isFirstTime),
        
        // ------- Checkin activities
        this.checkInActivities_DashboardMetrics(isFirstTime),
        
        // ----- Jira Notifications
        // this.jiraNotifications_DashboardMetrics(isFirstTime),
        
        // ---- active users
        this.activeUsers_DasboardMetrics(isFirstTime),
      ]).then((data) => {
        this.updateWorkspaceWithMetrics("all");
      });
    } else {
      message.warning({ content: `wait for ${10 - diff} seconds` });
    }
  };
  userActivity_DashboardMetrics = (isFirstTime) => {
    this.setState({ UserActivityLoading: true });
    return new Promise((resolve, reject) => {
      this.props.getWorkspaceActivityLog(this.props.match.params.wId).then((res) => {
        this.setState({ UserActivityLoading: false });
        if (res.data.success) {
          // !isFirstTime && message.success({ content: "User activities updated", key: "user_activity" });
          const data = res.data;
          this.setState(
            {
              UserActivityThisMonth: data.ThisMonthActivity,
              UserActivityLastMonth: data.LastMonthActivity,
              UserActivityProgress: data.Progress,
              UserActivityLastupdated: Date.now(),
            },
            () => resolve(true)
            );
            this.sendData()
          }
        });
      });
    };
    checkInActivities_DashboardMetrics = (isFirstTime) => {
      this.setState({ CheckInSubmissionsLoading: true });
      return new Promise((resolve, reject) => {
        this.props.getWorkspaceCkecInActivies(this.props.match.params.wId).then((res) => {
          this.setState({ CheckInSubmissionsLoading: false });
          if (res.data.success) {
            // !isFirstTime && message.success({ content: "Check-in submissions updated", key: "check_submission" });
          const data = res.data;
          this.setState(
            {
              CheckInSubmissionsThisMonth: data.ThisMonthCheckInSubmissions,
              CheckInSubmissionsLastMonth: data.LastMonthCheckInSubmissions,
              activeCheckinsCount: data.activeCheckinsCount,
              CheckInSubmissionsLastupdated: Date.now(),
            },
            () => resolve(true)
          );
        }
      });
    });
  };

  jiraNotifications_DashboardMetrics = (isFirstTime) => {
    this.setState({ JiraNotificatinsLoading: true });
    return new Promise((resolve, reject) => {
      this.props.getWorkspaceJiraNotificationsLog(this.props.match.params.wId).then((res) => {
        this.setState({ JiraNotificatinsLoading: false });
        if (res.data.success) {
          // !isFirstTime && message.success({ content: "Jira Notifications updated", key: "jira_notifications" });
          const data = res.data;
          this.setState(
            {
              JiraNotificatinsThisMonth: data.ThisMonthJiraActivity,
              JiraNotificatinsLastMonth: data.LastMonthJiraActivity,
              JiraNotificatinsProgress: data.JiraProgress,
              JiraNotificatinsLastupdated: Date.now(),
            },
            () => resolve(true)
          );
        }
      });
    });
  };

  activeUsers_DasboardMetrics = (isFirstTime) => {
    this.setState({ activeUsersloading: true });
    return new Promise((resolve, reject) => {
      this.props.getWorkspaceActiveUsers(this.props.match.params.wId).then((res) => {
        this.setState({ activeUsersloading: false });
        if (res.data.success) {
          // !isFirstTime && message.success({ content: "Active Users updated", key: "activie users" });
          this.setState({ activeUsers: res.data.uniqueArray.length, activeUsersLastupdated: Date.now() }, () => resolve(true));
        }
      });
    });
  };

  updateWorkspaceWithMetrics = (update) => {
    const { updateWorkspace } = this.props;
    const {
      UserActivityThisMonth,
      UserActivityLastMonth,
      UserActivityProgress,
      UserActivityLoading,
      CheckInSubmissionsThisMonth,
      CheckInSubmissionsLastMonth,
      JiraNotificatinsThisMonth,
      JiraNotificatinsLastMonth,
      JiraNotificatinsProgress,
      activeUsers,
      activeCheckinsCount,
    } = this.state;

    let data = {};

    if (update === "all") {
      data = {
        dashboardMetrics: {
          userActivity: {
            thisMonth: UserActivityThisMonth,
            lastMonth: UserActivityLastMonth,
            progress: UserActivityProgress,
            lastUpdated: Date.now(),
          },
          checkInSubmissions: {
            thisMonth: CheckInSubmissionsThisMonth,
            lastMonth: CheckInSubmissionsLastMonth,
            lastUpdated: Date.now(),
          },
          jiraNotifications: {
            thisMonth: JiraNotificatinsThisMonth,
            lastMonth: JiraNotificatinsLastMonth,
            progress: JiraNotificatinsProgress,
            lastUpdated: Date.now(),
          },
          activeUsers: {
            thisMonth: activeUsers,
            lastUpdated: Date.now(),
          },
          activeCheckinsCount,
        },
      };
    }
    // else if(update === 'active_users'){
    //   data = {
    //     [`dashboardMetrics.activeUsers`]: {
    //       thisMonth: activeUsers,
    //       lastUpdated: Date.now(),
    //     },
    //   };
    // }
    // else if (update === 'user_activity'){
    //   data = {
    //     [`dashboardMetrics.userActivity`]: {
    //       thisMonth: UserActivityThisMonth,
    //       lastMonth: UserActivityLastMonth,
    //       progress: UserActivityProgress,
    //       lastUpdated: Date.now(),
    //     },
    //   };
    // }else if (update === 'checkin_submissions') {
    //   data = {
    //     [`dashboardMetrics.checkInSubmissions`]: {
    //       thisMonth: CheckInSubmissionsThisMonth,
    //       lastMonth: CheckInSubmissionsLastMonth,
    //       lastUpdated: Date.now(),
    //     },
    //   };
    // }else if(update === 'jira_notifications'){
    //   data = {
    //     [`dashboardMetrics.jiraNotifications`]: {
    //       thisMonth : JiraNotificatinsThisMonth,
    //       lastMonth : JiraNotificatinsLastMonth,
    //       progress : JiraNotificatinsProgress,
    //       lastUpdated : Date.now()
    //     }
    //   }
    // }

    this.props.updateWorkspace(this.props.match.params.wId, "", data).then((res) => {
      // if (res.data.success)
    });
  };

  setDashboardMetricsToState = () => {
    const { workspace } = this.props;
    const userActivity = workspace.dashboardMetrics.userActivity;
    const checkInSubmissions = workspace.dashboardMetrics.checkInSubmissions;
    const jiraNotifications = workspace.dashboardMetrics.jiraNotifications;
    const activeUsers = workspace.dashboardMetrics.activeUsers;
    this.setState({
      UserActivityThisMonth: userActivity.thisMonth,
      UserActivityLastMonth: userActivity.lastMonth,
      UserActivityProgress: userActivity.progress,
      UserActivityLastupdated: userActivity.lastUpdated,
      CheckInSubmissionsThisMonth: checkInSubmissions.thisMonth,
      CheckInSubmissionsLastMonth: checkInSubmissions.lastMonth,
      CheckInSubmissionsLastupdated: checkInSubmissions.lastUpdated,
      JiraNotificatinsThisMonth: jiraNotifications.thisMonth,
      JiraNotificatinsLastMonth: jiraNotifications.lastMonth,
      JiraNotificatinsProgress: jiraNotifications.progress,
      JiraNotificatinsLastupdated: jiraNotifications.lastUpdated,
      activeUsers: activeUsers.thisMonth,
      activeUsersLastupdated: activeUsers.lastUpdated,
      activeCheckinsCount: workspace.dashboardMetrics.activeCheckinsCount || 0,
    });
  };

  render() {
    const { members, workspace } = this.props;
    const {
      UserActivityLoading,
      UserActivityThisMonth,
      UserActivityLastMonth,
      UserActivityProgress,
      UserActivityLastupdated,
      CheckInSubmissionsLoading,
      CheckInSubmissionsThisMonth,
      CheckInSubmissionsLastMonth,
      CheckInSubmissionsLastupdated,
      JiraNotificatinsLoading,
      JiraNotificatinsThisMonth,
      JiraNotificatinsLastMonth,
      JiraNotificatinsProgress,
      JiraNotificatinsLastupdated,
      activeUsersloading,
      activeUsers,
      activeUsersLastupdated,
      mappedUsersCount,
      activeCheckinsCount,
      jiraSkill
    } = this.state;
    return (
      <>
          <Row gutter={[16, 16]}>
            <Col className='gutter-row' span={4}>
              <Card
                title='Active Users'
                size='small'
                // bordered={false}
                style={{ height: "100%" }}
                // extra={
                  // <Tooltip title={`Last updated at ${moment(activeUsersLastupdated).format("lll")}. Click to reload.`}>
                  //   <Button
                  //     size='small'
                  //     type='link'
                  //     shape='circle'
                  //     onClick={() => this.getDashBoardMetrix()}
                  //     icon={<ReloadOutlined spin={activeUsersloading} />}
                  //   />
                  // </Tooltip>
                // }
              >
                <Statistic title='30 days' value={activeUsers} />
              </Card>
            </Col>
            <Col className='gutter-row' span={12}>
              <Card
                size='small'
                title='User activities'
                style={{ height: "100%" }}
                // bordered={false}
                // extra={
                  // <Tooltip title={`Last updated at ${moment(UserActivityLastupdated).format("lll")}. Click to reload.`}>
                  //   <Button
                  //     size='small'
                  //     type='link'
                  //     shape='circle'
                  //     onClick={() => this.getDashBoardMetrix()}
                  //     icon={<ReloadOutlined spin={UserActivityLoading} />}
                  //   />
                  // </Tooltip>
                // }
              >
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Statistic
                      title='30 days'
                      value={UserActivityThisMonth}
                      // suffix="/ 30days"
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title='Previous period'
                      value={UserActivityLastMonth}
                      // suffix="/ 30days"
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title='Progress'
                      value={Math.abs(Math.round(UserActivityProgress))}
                      // precision={2}
                      valueStyle={{
                        color: UserActivityProgress > 0 || UserActivityProgress === 0 || UserActivityProgress === null ? "#3f8600" : "red",
                      }}
                      prefix={
                        UserActivityProgress > 0 || UserActivityProgress === 0 || UserActivityProgress === null ? (
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

            {!workspace.disableCheckins && (
              <Col className='gutter-row' span={8}>
                <Card
                  style={{ width: "100%", height: "100%" }}
                  title='Check-in submissions'
                  size='small'
                  // extra={
                    // <Tooltip title={`Last updated at ${moment(CheckInSubmissionsLastupdated).format("lll")}. Click to reload.`}>
                    //   <Button
                    //     size='small'
                    //     type='link'
                    //     shape='circle'
                    //     onClick={() => this.getDashBoardMetrix()}
                    //     icon={<ReloadOutlined spin={CheckInSubmissionsLoading} />}
                    //   />
                    // </Tooltip>
                  // }
                >
                  <Row>
                    <Col span={12}>
                      <Statistic title='30 days' value={CheckInSubmissionsThisMonth} />
                    </Col>
                    <Col span={12}>
                      <Statistic title='Previous period' value={CheckInSubmissionsLastMonth} />
                    </Col>
                  </Row>
                </Card>
              </Col>
            )}

            {this.state.isJiraConnected && jiraSkill && !jiraSkill.skill_metadata.disabled && (
              <Col className='gutter-row' span={8}>
                <Card
                  style={{ width: "100%", height: "100%" }}
                  title='Jira verified Users'
                  size='small'
                  // extra={
                  //   <Tooltip title='Last updated 2 days ago. Click to reload.'>
                  //     <Button size='small' type='link' shape='circle' icon={<ReloadOutlined />} />
                  //   </Tooltip>
                  // }
                >
                  <Statistic title='Jira verified Users / All workspace members' value={mappedUsersCount !== false ? mappedUsersCount : '-'} suffix={`/ ${members.length}`} />
                </Card>
              </Col>
            )}

            {this.state.isJiraConnected && jiraSkill && !jiraSkill.skill_metadata.disabled && (
              <Col className='gutter-row' span={10}>
                <Card
                  style={{ width: "100%" }}
                  title='Jira Notifications'
                  size='small'
                  // extra={
                    // <Tooltip title={`Last updated at ${moment(JiraNotificatinsLastupdated).format("lll")}. Click to reload.`}>
                    //   <Button
                    //     size='small'
                    //     type='link'
                    //     shape='circle'
                    //     onClick={() => this.getDashBoardMetrix()}
                    //     icon={<ReloadOutlined spin={JiraNotificatinsLoading} />}
                    //   />
                    // </Tooltip>
                  // }
                >
                  <Row gutter={[16, 16]}>
                    <Col span={8}>
                      <Statistic
                        title='30 days'
                        value={JiraNotificatinsThisMonth}
                        // suffix="/ 30days"
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title='Previous period'
                        value={JiraNotificatinsLastMonth}
                        // suffix="/ 30days"
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title='Progress'
                        value={Math.abs(Math.round(JiraNotificatinsProgress))}
                        // precision={2}
                        valueStyle={{
                          color:
                            JiraNotificatinsProgress > 0 || JiraNotificatinsProgress === 0 || JiraNotificatinsProgress === null ? "#3f8600" : "red",
                        }}
                        prefix={
                          JiraNotificatinsProgress > 0 || JiraNotificatinsProgress === 0 || JiraNotificatinsProgress === null ? (
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
            )}
            {!workspace.disableCheckins && (
              <Col className='gutter-row' span={6}>
                <Card
                  title='Active Check-ins'
                  size='small'
                  // bordered={false}
                  style={{ height: "100%" }}
                  // extra={
                    // <Tooltip title={`Last updated at ${moment(CheckInSubmissionsLastupdated).format("lll")}. Click to reload.`}>
                    //   <Button
                    //     size='small'
                    //     type='link'
                    //     shape='circle'
                    //     onClick={() => this.getDashBoardMetrix()}
                    //     icon={<ReloadOutlined spin={CheckInSubmissionsLoading} />}
                    //   />
                    // </Tooltip>
                  // }
                >
                  <Statistic value={activeCheckinsCount} />
                </Card>
              </Col>
            )}
            <DashboardChart day_by_day_activities={this.state.day_by_day_activities} activity_categories={this.state.activity_categories} />
          </Row>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  skills: state.skills.skills,
  members: state.skills.members,
  usermappings: state.skills.userMappingsWithUsers,
  workspace: state.common_reducer.workspace,
  team: state.skills.team,
});

export default withRouter(
  connect(mapStateToProps, {
    getWorkspaceActivityLog,
    getWorkspaceCkecInActivies,
    getWorkspaceJiraNotificationsLog,
    getUserMappingAndUsers,
    getWorkspaceActiveUsers,
    updateWorkspace,
  })(Dashboard)
);
