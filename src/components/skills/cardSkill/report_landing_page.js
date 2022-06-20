import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Layout, Typography, Card, Button, PageHeader, Row, Col, Dropdown, Menu, Popconfirm, Tag } from "antd";
import { ArrowLeftOutlined, SettingOutlined } from "@ant-design/icons";
import queryString from "query-string";
import { getChannelList } from "./../skills_action";

const { Text } = Typography;

class ReportLandingPage extends Component {
  constructor() {
    super();
    this.state = {
      report: {},
      deliverChannelAndMember: []
    };
  }

  componentDidMount() {
    if (this.props.channels.length === 0) this.channelLoading();
    this.setReport();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.cardSkills !== this.props.cardSkills) this.setReport();
    // if(prevProps.location.search !== this.props.location.search) this.setReport()
    if (prevProps.channels !== this.props.channels || prevProps.allUsers !== this.props.allUsers) this.setReport()
    if (prevProps.channels !== this.props.channels) this.channelLoading();
  }
  channelLoading = () => {
    this.setState({ channelsLoading: false, channels: this.props.channels });
  }

  setReport = () => {
    const { cardSkills } = this.props;
    const qs = queryString.parse(window.location.search);
    const reportFound = cardSkills.find((report) => report._id === qs.report_id);
    this.setState({ report: reportFound || {} }, () => {this.getDeliverChannelAndMember(this.state.report.slackData);});
  };

  getDeliverChannelAndMember = (slackData) => {
    let notExistChannels = [];
    let existChannels = [];
    let existMemberDetails = [];
    let notExistMembersDetails = [];
    
    if (slackData) {
      if (slackData.slackChannel && Array.isArray(slackData.slackChannel)) {
        let channelDetails = "";
        slackData.slackChannel.map((schannel) => {
          channelDetails = this.props.channels.find((channel) => channel.id === schannel);
          if (channelDetails) {
            existChannels.push({
              id: channelDetails.id,
              name: channelDetails.name,
              type : 'channel'
            })
          } else {
            notExistChannels.push(schannel);
          }
        })
      } else {
        let singleChannelDetails = this.props.channels.find(c => c.id === slackData.slackChannel);
        if (singleChannelDetails) {
          existChannels.push({
            id: singleChannelDetails.id,
            name: singleChannelDetails.name,
            type : 'channel'
          })
        } else {
          notExistChannels = slackData.slackChannel;
        }
      }

      if (slackData && slackData.reportMembers && Array.isArray(slackData.reportMembers)) {
        let userDetails = "";
        slackData.reportMembers.map((member) => {
          userDetails = this.props.allUsers.find((user) => user.user_id._id === member);
          if (userDetails) {
            existMemberDetails.push({
              id: userDetails.user_id,
              name: userDetails.user_id.displayName || userDetails.user_id.name,
              type : 'user'
            })
          } else {
            notExistMembersDetails.push(member);
          }
        })
      }
    }

    let deliverDetails = [...existChannels, ...existMemberDetails];
    
    this.setState({
      deliverChannelAndMember: deliverDetails
    })
  } 

  render() {
    const { cardSkills } = this.props;
    const { report } = this.state;
    const menu = (
      <Menu>
        <Menu.Item onClick={() => this.props.toggleSkill(report)}>
          {/* <Popconfirm
            title={`Are you sure you want to ${!this.state.report.is_enabled ? "Disable" : "Enable"} this report?`}
            onConfirm={() => this.props.toggleSkill(report)}
            okText='Yes'
            cancelText='No'
            placement='left'
          > */}
          {this.state.report.is_enabled ? "Disable" : "Enable"}
          {/* </Popconfirm> */}
        </Menu.Item>

        <Menu.Item danger>
          <Popconfirm
            title='Are you sure you want to delete this report permanently?'
            onConfirm={() => this.props.onReportDelete(report)}
            okText='Yes'
            cancelText='No'
            placement='left'
          >
            Delete
          </Popconfirm>
        </Menu.Item>
      </Menu>
    );
    return report._id ? (
      <>
        <PageHeader
          title={
            <>
              <Button style={{ marginRight: 4 }} icon={<ArrowLeftOutlined />} onClick={() => this.props.goToReports()}>
                All Reports
              </Button>{" "}
              {report.name + ' '}<Tag color={report.is_enabled ? 'green' : 'orange'}>{report.is_enabled ? 'Enabled' : 'Not Enabled'}</Tag>
            </>
          }
          // onBack={() => this.props.parent.goToChannels()}
          // backIcon={<ArrowLeftOutlined>All Channels</ArrowLeftOutlined>}
          //   extra={[<Button>Enable</Button>, <Button>Run Now</Button>, <Button danger>Delete</Button>]}
          extra={[
            <Button onClick={() => this.props.execRunNow(report)}>Run Now</Button>,
            <Dropdown overlay={menu}>
              <Button
                // size="small"
                //   type="link"
                icon={<SettingOutlined />}
              />
            </Dropdown>,
          ]}
        />
        <Layout.Content style={{ padding: "16px 16px 32px 24px", overflow: "initial" }}>
          <Row style={{ width: "100%", maxWidth: 1000 }} gutter={[16, 16]}>
            {/*<Col span={24}>
                <Button icon={<ArrowLeftOutlined />} style={{ marginRight: 8 }} onClick={() => this.props.parent.goToChannels()}>
                  All Channels
                </Button>{" "}
                <Text strong>#general</Text>
              </Col>*/}
            <Col span={12} style={{ display: "flex" }}>
              <Card
                title='Configuration'
                style={{ width: "100%" }}
                size='small'
                extra={[<Button onClick={(e) => this.props.showConfigModal(report, e)}>Update</Button>]}
              >
                <div>
                  <Text type='secondary'>By: </Text>
                  <Text>{report.creator_name}</Text>
                </div>
                <div>
                  <Text type='secondary'>Schedule: </Text>
                  <Text>
                    {report.triggerInformation.frequency === "daily" ? "Daily" : "Every " + report.triggerInformation.selectedDay} at{" "}
                    {report.triggerInformation.timeOfDay}
                  </Text>
                </div>
                <div>
                  <Text type='secondary'>Delivering to: </Text>
                  {report && report.slackData && (this.state.deliverChannelAndMember || []).map((channel, index) => {
                    if(index <= 2) {
                      return (
                        <Text>{channel.type==='channel' && '#'}{channel.name || ''}{(this.state.deliverChannelAndMember || []).slice(0,3).length - 1 === index ? '' : ','} </Text>
                      )
                    }
                  })}
                  {this.state.deliverChannelAndMember.length > 3 &&
                    <Text> and {this.state.deliverChannelAndMember.length - 3} more</Text>
                  }
                </div>
              </Card>
            </Col>
          </Row>
        </Layout.Content>
      </>
    ) : (
      ""
    );
  }
}

const mapStateToProps = (store) => ({
  currentSkill: store.skills.currentSkill,
  currentSkillUser: store.skills.currentSkillUser,
  cardSkills: store.cards.cardSkills,
  cardTemplates: store.cards.templateCards,
  allUsers: store.skills.members,
  channels: store.skills.channels,
});

export default withRouter(connect(mapStateToProps, {
  getChannelList
})(ReportLandingPage));
