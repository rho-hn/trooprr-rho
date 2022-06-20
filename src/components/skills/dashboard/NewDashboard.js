import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { setDriftState } from "../../auth/authActions";
import {productDetails} from "utils/productDetails"
import {
  AppstoreOutlined,
  CheckCircleOutlined,
  SlackOutlined,
  BarChartOutlined,
  UserOutlined,
  InfoCircleOutlined,
  AlertOutlined,
  ArrowRightOutlined,
  ReadOutlined,
  NotificationOutlined,
  BookTwoTone,
  NotificationTwoTone,
  ProjectOutlined,
  QuestionCircleOutlined,
  PieChartOutlined,
  BulbOutlined,
  PlusCircleTwoTone
} from "@ant-design/icons";
import { getTeamsyncsCount, getJiraConfigurationsCount, getConfluenceChannelConfigs, getJiraReportsCount, updateSkill, updateWorkspace, } from "../skills_action";
import {getCardSkills} from '../skill_builder/steps/CardActions'
import { Button, Card, Row, Col, PageHeader, Layout, message, Typography, Divider, Tooltip,Spin, Dropdown, Menu, Modal, Avatar, } from "antd";
import CreateTeamsyncModal from "../troopr_standup/createTeamsyncModal";
import { sendMessageOnchat } from "utils/utils";
import "./NewDashboard.css";
import queryString from "query-string"

// import AppHome from "../app_home/appHome";

const uuidv4 = require("uuid/v4");
const { Content } = Layout;
const { Text, Title } = Typography;

const help_menu = (helpDocs, whatsNew) => (
  <Menu>
    <Menu.Item icon={<ReadOutlined />} key="2" onClick={() => window.open(`${helpDocs}`, '_blank')}>
      Help Docs
    </Menu.Item>
    <Menu.Item icon={<NotificationOutlined />} key="1" onClick={() => window.open(`${whatsNew}`, '_blank')}>
      Whats new
    </Menu.Item>
    {/* <Menu.Item icon={<PlayCircleOutlined />} key="2">
      Getting Started
    </Menu.Item> */}
  </Menu>
);

const productCardDesc = {
  jiraProjects: "Manage Jira Software issues in Slack",
  helpDesk: "Manage Jira service requests in Slack",
  jiraReports: "Share actionable Jira reports in Slack",
  wiki: "Answer with Confluence articles in Slack",
  checkin: "Conduct asynchronous meetings in Slack"
}

// const productCardLinks = {
//   jiraProjects: {
//     helpDocs: "https://help.jiraslackintegration.com",
//     whatsNew: "https://help.jiraslackintegration.com/changelog/latest"
//   },
//   helpDesk: {
//     helpDocs: "https://troopr.gitbook.io/helpdesk",
//     whatsNew: "https://troopr.gitbook.io/helpdesk/changelog/latest"
//   },
//   jiraReports: {
//     helpDocs: "https://troopr.gitbook.io/report",
//     whatsNew: "https://troopr.gitbook.io/report/changelog/latest"
//   },
//   wiki: {
//     helpDocs: "https://troopr.gitbook.io/wiki",
//     whatsNew: "https://troopr.gitbook.io/wiki/changelog/latest"
//   },
//   checkin: {
//     helpDocs: "https://help.troopr.ai",
//     whatsNew: "https://help.troopr.ai/changelog/latest"
//   }
// }
const productCardLinks = {
  jiraProjects: {
    helpDocs: "https://docs.troopr.ai/project ",
    whatsNew: "https://docs.troopr.ai/project/whats-new"
  },
  helpDesk: {
    helpDocs: "https://docs.troopr.ai/helpdesk ",
    whatsNew: "https://docs.troopr.ai/helpdesk/whats-new "
  },
  jiraReports: {
    helpDocs: "https://docs.troopr.ai/report ",
    whatsNew: "https://docs.troopr.ai/report/whats-new "
  },
  wiki: {
    helpDocs: "https://docs.troopr.ai/wiki ",
    whatsNew: "https://docs.troopr.ai/wiki/whats-new "
  },
  checkin: {
    helpDocs: "https://docs.troopr.ai/checkin ",
    whatsNew: "https://docs.troopr.ai/checkin/whats-new "
  }
}

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkinloading: true,
      allCheckinsCount: 0,
      myCheckinsCount: 0,
      newStandupModalVisible: false,
      jiraAdmin: false,
      jiraSkill: false,
      wikiSkill: false,
      checkInSkill: false,
      isWikiConnected: false,
      isJiraConnected: false,
      jiraLoading: true,
      wikiLoading: true,
      jiraReportsCount: 0,
      personalReportsCount: 0,
      jiraConfiguredChannelsCount_agent: 0,
      jiraConfiguredChannelsCount_project: 0,
      jiraConfiguredChannelsCount_support: 0,
      wikiChannelConfigCount: 0,
      cardSkills: [],
      wId: "",
    };
  }
  componentDidMount() {
    const { workspace } = this.props;
    this.setState({ wId: this.props.match.params.wId });

    if (this.props.skills.length > 0) {
      const jiraSkill = this.props.skills.find((skill) => skill.key === "jira");
      if (jiraSkill) {
        let isJiraConnected = jiraSkill.skill_metadata.linked;
        this.setState({ isJiraConnected });
        const isJiraAdmin = jiraSkill.skill_metadata.jiraConnectedId == this.props.user_now._id;
        this.setState({ jiraSkill }, () => this.getDashboardJiraConfigurationsCount({ isJiraAdmin }));
      }

      const wikiSkill = this.props.skills.find((skill) => skill.key === "wiki");
      if (wikiSkill) {
        let isWikiConnected = wikiSkill.skill_metadata && wikiSkill.skill_metadata.metadata && wikiSkill.skill_metadata.metadata.domain_url;
        let isWikiAdmin = false;

        if (
          wikiSkill.skill_metadata &&
          wikiSkill.skill_metadata &&
          wikiSkill.skill_metadata.metadata &&
          wikiSkill.skill_metadata.connected_by &&
          this.props.user._id &&
          wikiSkill.skill_metadata.connected_by.toString() === this.props.user_now._id.toString()
        ) {
          isWikiAdmin = true;
        }
        if (this.props.isWorkspaceAdmin) isWikiAdmin = true;

        this.setState({ isWikiConnected });
        this.setState({ wikiSkill }, () => this.getDashboardWikiConfigurationCount({ isWikiAdmin }));
      }


      const checkInSkill = this.props.skills.find((skill) => skill.key === "standups");
      if(checkInSkill) this.setState({checkInSkill})
    }
    this.getDashboardTeamsyncCounts();

    let parsed_query=queryString.parse(this.props.location.search)
    if(parsed_query && parsed_query.botupdate) {
      message.success('Troopr Assistant successfully updated to latest version!')
      this.props.history.push(`/${this.props.match.params.wId}/dashboard`)
    }else if (parsed_query && parsed_query.source && parsed_query.source === 'appsumo_update'){
      message.success('AppSumo code successfully redeemed!',5)
      this.props.history.push(`/${this.props.match.params.wId}/dashboard`)
    }else if (parsed_query && parsed_query.source && parsed_query.source === 'workspace_already_paid'){
      message.error('Workspace is already paid in troopr',10)
      this.props.history.push(`/${this.props.match.params.wId}/dashboard`)
    }else if (parsed_query.source === 'product_already_subscribed'){
      let product
      if(parsed_query.product === 'standups') product = 'Check-in'
      else if(parsed_query.product === 'jira_software') product = 'Project (Jira)'
      else if(parsed_query.product === 'jira_service_desk') product = 'HelpDesk (Jira)'
      else if(parsed_query.product === 'wiki') product = 'Wiki (Confluence)'
      else if(parsed_query.product === 'jira_reports') product = 'Report (Jira)'
      message.error(`Oops! You have already subscribed to ${product}. You can try with another product`,10)
      this.props.history.push(`/${this.props.match.params.wId}/dashboard`)
    }

  }

  componentDidUpdate(prevProps) {
    const { skills, workspace } = this.props;
    const { wId } = this.state;
    if (skills != prevProps.skills) {
      const jiraSkill = this.props.skills.find((skill) => skill.key === "jira");
      if (jiraSkill) {
        let isJiraConnected = jiraSkill.skill_metadata.linked;
        this.setState({ isJiraConnected });
        let isJiraAdmin = jiraSkill.skill_metadata.jiraConnectedId == this.props.user_now._id;
        this.setState({ jiraSkill }, () => this.getDashboardJiraConfigurationsCount({ isJiraAdmin }));
      }

      const wikiSkill = this.props.skills.find((skill) => skill.key === "wiki");
      if (wikiSkill) {
        let isWikiConnected = wikiSkill.skill_metadata && wikiSkill.skill_metadata.metadata && wikiSkill.skill_metadata.metadata.domain_url;
        let isWikiAdmin = false;

        if (
          wikiSkill.skill_metadata &&
          wikiSkill.skill_metadata &&
          wikiSkill.skill_metadata.metadata &&
          wikiSkill.skill_metadata.connected_by &&
          this.props.user._id &&
          wikiSkill.skill_metadata.connected_by.toString() === this.props.user_now._id.toString()
        ) {
          isWikiAdmin = true;
        }
        if (this.props.isWorkspaceAdmin) isWikiAdmin = true;

        this.setState({ isWikiConnected });
        this.setState({ wikiSkill }, () => this.getDashboardWikiConfigurationCount({ isWikiAdmin }));
      }

      const checkInSkill = this.props.skills.find((skill) => skill.key === "standups");
      if(checkInSkill) this.setState({checkInSkill})
    }

    if (wId != this.props.match.params.wId) {
      this.setState({ wId: this.props.match.params.wId, checkinloading: true, jiraLoading: true });
      this.getDashboardTeamsyncCounts();
    }
  }

  getDashboardTeamsyncCounts = () => {
    const { match } = this.props;
    getTeamsyncsCount(match.params.wId).then((res) => {
      if (res.success) this.setState({ allCheckinsCount: res.allCheckinsCount, myCheckinsCount: res.myCheckinsCount, checkinloading: false });
    });
  };

  getDashboardJiraConfigurationsCount = ({ isJiraAdmin }) => {
    const { jiraSkill } = this.state;
    const { match, team } = this.props;
    const isGridWorkspace = team && team.bot && team.bot.meta && team.bot.meta.enterprise && team.bot.meta.enterprise.id ? true : false;

    Promise.all([
      getJiraConfigurationsCount(match.params.wId, jiraSkill.skill_metadata._id, isGridWorkspace, isJiraAdmin),
      getJiraReportsCount(match.params.wId),
      this.props.getCardSkills(match.params.wId,'app_home', /* type */false  ,/* save in store */true)
    ]).then((data) => {
      if (data[0].success){
        this.setState({
          jiraConfiguredChannelsCount_support: data[0].support_channel_count,
          jiraConfiguredChannelsCount_project: data[0].project_channel_count,
          jiraConfiguredChannelsCount_agent: data[0].agent_channel_count,
          // mappedUsersCount: data[0].mappedUsersCount,
        });
      }
       
      if (data[1].success) this.setState({ jiraReportsCount: data[1].jiraReportsCount });
      if (data[2].data.success) this.setState({personalReportsCount : data[2].data.CardSkills.length})
      if (data[0].success && data[1].success && data[2].data.success) this.setState({ jiraLoading: false });
    });
  };

  getDashboardWikiConfigurationCount = ({ isWikiAdmin }) => {
    const { match } = this.props;
    this.props.getConfluenceChannelConfigs(match.params.wId, isWikiAdmin, /* get count */ true).then((res) => {
      if (res.data.success) this.setState({ wikiChannelConfigCount: res.data.configs, wikiLoading: false });
    });
  };

  handleCheckinLinks = (type) => {
    const wId = this.props.match.params.wId;
    this.props.history.push(`/${wId}/teamsyncs/${type}`);
  };

  handleJiraLinks = (type,sub_skill) => {
    const { jiraSkill } = this.state;
    const wId = this.props.match.params.wId;
    if (jiraSkill) {
      if (type === "manage") {
        // jiraSkill && this.props.history.push(`/${wId}/skills/${jiraSkill.skill_metadata._id}`);
      } else if (type === "personal") {
        jiraSkill && this.props.history.push(`/${wId}/skills/${jiraSkill.skill_metadata._id}/${sub_skill}?view=personal_preferences`);
      } else if (type === "reports") {
        jiraSkill && this.props.history.push(`/${wId}/skills/${jiraSkill.skill_metadata._id}/${sub_skill}?view=reports`);
      } else if (type === "my_reports") {
        jiraSkill && this.props.history.push(`/${wId}/skills/${jiraSkill.skill_metadata._id}/${sub_skill}?view=appHome`);
      } else if (type === "channel_preferences") {
        jiraSkill && this.props.history.push(`/${wId}/skills/${jiraSkill.skill_metadata._id}/${sub_skill}?view=channel_preferences`);
      }
    }
  };

  toggleNewStandupModal = () => {
    this.setState({ newStandupModalVisible: !this.state.newStandupModalVisible }, () => {
      !this.state.newStandupModalVisible && setTimeout(() => this.clickChild(), 500);
    });
  };

  openChatWindow = (msg) => {

    sendMessageOnchat(msg);
  };

  getUserCardSkillsCount = () => {
    let allCardSkills = this.state.cardSkills;
    let currentUserId = this.props.user_now._id;
    let userCardSkills = [];

    if (allCardSkills && allCardSkills.length > 0) {
      userCardSkills = allCardSkills.filter((cardSkill) => cardSkill.user_id === currentUserId);
    }

    return userCardSkills.length > 0 ? userCardSkills.length : 0;
  };

  getProductSecondaryCard = ({ cardSize, product, isSkillEnabled, isSkillOnboarded,sub_skill,skill }) => {
    const {checkinloading,jiraSkill,wikiSkill,checkInSkill} = this.state
    let desc = "",
      buttonText = "",
      title = "",
      subTitle = "",
      loading = false,
      helpDocs="",
      whatsNew="",
      Icon = undefined
    
    if (product === "jiraprojects") {
      desc = productDetails.project.description;
      buttonText = jiraSkill && jiraSkill.skill_metadata && jiraSkill.skill_metadata.linked ? "Activate" : "Connect Jira Software";
      // title = "Project (Jira)";
      title = sub_skill.name;
      subTitle = "New Project Channel";
      helpDocs=productCardLinks.jiraProjects.helpDocs
      whatsNew=productCardLinks.jiraProjects.whatsNew
      Icon = <ProjectOutlined />
    } else if (product === "helpdesk") {
      desc = productDetails.helpDesk.description;
      buttonText = jiraSkill && jiraSkill.skill_metadata && jiraSkill.skill_metadata.linked ? "Activate" : "Connect Jira Desk";
      // title = "HelpDesk (Jira)";
      title = sub_skill.name;
      subTitle = "New Support Channel";
      helpDocs = productCardLinks.helpDesk.helpDocs;
      whatsNew = productCardLinks.helpDesk.whatsNew;
      Icon = <QuestionCircleOutlined />
    } else if (product === "jirareports") {
      desc = productDetails.report.description;
      buttonText = jiraSkill && jiraSkill.skill_metadata && jiraSkill.skill_metadata.linked ? "Activate" : "Connect Jira";
      // title = "Report (Jira)";
      title = sub_skill.name;
      subTitle = "New Channel Report";
      helpDocs = productCardLinks.jiraReports.helpDocs;
      whatsNew = productCardLinks.jiraReports.whatsNew;
      Icon = <PieChartOutlined />
    } else if (product === "wiki") {
      desc = productDetails.wiki.description;
      buttonText = wikiSkill && wikiSkill.skill_metadata && wikiSkill.skill_metadata.linked ? "Activate" : "Connect Confluence";
      // title = "Wiki (Confluence)";
      title = skill.name;
      subTitle="New Wiki Channel";
      helpDocs = productCardLinks.wiki.helpDocs;
      whatsNew = productCardLinks.wiki.whatsNew;
      Icon = <BulbOutlined />
    } else if (product === "checkin") {
      desc = productDetails.checkIn.description;
      buttonText = "Setup first Check-in";
      // title = "Check-in";
      title = skill.name;
      subTitle="New Check-in";
      helpDocs = productCardLinks.checkin.helpDocs;
      whatsNew  = productCardLinks.checkin.whatsNew ;
      loading =  isSkillEnabled ? checkinloading : false;
      Icon = <CheckCircleOutlined />
    }

    return (
      <Col  xs={{ span: 9 }}
      sm={{ span: 9 }}
      lg={{ span: 12 }}
      xxl={{ span: 8 }}>
        <Card
                    // size="small"
                    style={{ minWidth: 300, height: '100%' }}
                    loading={loading}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Avatar
                        style={{
                          backgroundColor: '#402e96',
                          margin: '0px 0px 8px 0px',
                        }}
                        size="large"
                        icon={Icon}
                      />
                      <Title level={5}>{title}</Title>
                      <Text type="secondary">{desc}</Text>
                      <Button
                        type={isSkillEnabled?"primary":"default"}
                        style={{ margin: '8px 0px 4px' }}
                        icon={<ArrowRightOutlined />}
                        onClick={() => this.handleSecondaryProductCardButtonClick(product, isSkillEnabled, isSkillOnboarded,sub_skill)}
                      >
                        {buttonText}
                      </Button>
                      <Divider style={{ margin: '12px 0px 8px' }} />
                      <div>
                        <Tooltip title="Help Docs">
                          <Button
                            type="link"
                            icon={
                              <BookTwoTone
                                // twoToneColor="#8c82c0"
                                style={{ fontSize: 18 }}
                              />
                            }
                            style={{ marginRight: 8 }}
                            onClick={() => window.open(`${helpDocs}`, '_blank')}
                          />
                        </Tooltip>
                        <Tooltip title="What's New">
                          <Button
                            type="text"
                            icon={
                              <NotificationTwoTone
                                // twoToneColor="#8c82c0"
                                style={{ fontSize: 18 }}
                              />
                            }
                            onClick={() => window.open(`${whatsNew}`, '_blank')}
                          />
                        </Tooltip>
                      </div>
                    </div>
                  </Card>
                   {/* <Card style={{ width: "100%", height: "100%"}} size={cardSize} title={title} loading={loading}
        bodyStyle={{ height: "45%", marginBottom: 10 }}
          extra={
            <Dropdown.Button
            size="small"
            type="link"
            overlay={help_menu(productCardLinks.helpDesk.helpDocs, productCardLinks.helpDesk.whatsNew)}
            onClick={() => this.handleJiraLinks("channel_preferences")}
          >
            {subTitle}
          </Dropdown.Button>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", height: "100%", alignItems: "start", justifyContent: "space-between" }}>
            <Text>{desc}</Text>
            <br />
            <Button
              type='primary'
              icon={<ArrowRightOutlined />}
              onClick={() => this.handleSecondaryProductCardButtonClick(product, isSkillEnabled, isSkillOnboarded)}
            >
              {buttonText}
            </Button>

            </div>
            
            <div style={{ marginTop: 10 }}>
              <Button
              icon={<ArrowRightOutlined />}
              onClick={() => this.handleSecondaryProductCardButtonClick(product, isSkillEnabled, isSkillOnboarded,sub_skill)}
              >
                {buttonText}
              </Button>
              <Button size='small' type='text' href={learnMore} target='_blank'>
                Learn more
              </Button>
            </div>
          
        </Card> */}
      </Col>
    );
  };

  handleSecondaryProductCardButtonClick = (product, isSkillEnabled, isSkillOnboarded,sub_skill) => {
    const { isWorkspaceAdmin, updateSkill,updateWorkspace } = this.props;
    const { jiraSkill, wikiSkill, checkInSkill, allCheckinsCount } = this.state;

    if (isSkillEnabled && !isSkillOnboarded) {
      if (product === "jiraprojects" || product === "helpdesk" || product === "jirareports") {
        this.props.history.push(`/${this.props.match.params.wId}/skills/${jiraSkill.skill_metadata && jiraSkill.skill_metadata._id}/${sub_skill.key}?view=connection`);
      } else if (product === "wiki") {
        this.props.history.push(`/${this.props.match.params.wId}/skills/${wikiSkill.skill_metadata && wikiSkill.skill_metadata._id}?view=connection`);
      } else if (product === "checkin") {
        this.toggleNewStandupModal();
      }
    } else if (!isSkillEnabled) {
      if (isWorkspaceAdmin) {
        // this.props.history.push(`/${this.props.match.params.wId}/settings?view=product`);
        let title = '', content = ''

      if (product === "jiraprojects" || product === "helpdesk" || product === "jirareports") {
        title = 'Connect Jira?'
        // content = `This action will activate Troopr Project/Report/HelpDesk and let you connect to Jira if not already connected.`
        content = product === 'jiraprojects' ? 'This action will activate Projects and let you connect to Jira if not already connected.' : `This action will activate ${jiraSkill && jiraSkill.skill_metadata.disabled ? 'Projects, ' : ''} ${product === 'helpdesk' ? 'HelpDesk' : 'Reports'}${!jiraSkill.skill_metadata.linked ? ' and let you connect to Jira if not already connected.' : '.'}`
      } else if (product === "wiki") {
        title = 'Connect Confluence?'
        content = 'This action will activate Wiki and let you connect to Confluence if not already connected.'
      } else if (product === "checkin") {
        title = 'Enable Check-in'
        content = 'This action will activate Check-in and let you create a new Check-in if there is none.'
      }

        Modal.confirm({
          title,
          content,
          okText : 'Proceed',
          onOk : () => {
            let data = {}
            if(sub_skill){
              if(product === 'jiraprojects' || product === 'helpdesk' || product === 'jirareports'){
                let temp = [...jiraSkill.skill_metadata.sub_skills]
                temp = temp.map(s => {
                  if(s.key === sub_skill.key){
                    s.disabled = !sub_skill.disabled
                    return s
                  }else return s
                })
                data.sub_skills = [...temp]
              updateSkill(jiraSkill.skill_metadata._id,this.props.match.params.wId,data).then(res => {
                let view = 'connection'
                if(product === 'jiraprojects' || product === 'helpdesk') view = 'channel_preferences'
                else if(product === 'jirareports') view = 'reports'
                if(res.data.success) jiraSkill.skill_metadata.linked ? this.props.history.push(`/${this.props.match.params.wId}/skills/${jiraSkill.skill_metadata && jiraSkill.skill_metadata._id}/${sub_skill.key}?view=${view}`) : this.props.history.push(`/${this.props.match.params.wId}/skills/${jiraSkill.skill_metadata && jiraSkill.skill_metadata._id}/${sub_skill.key}?view=connection`);
                else if(res.data.error && res.data.error === 'not_a_workspace_admin') message.error('Contact one of the workspace admins to enable/disable products')  
              })
              }
            }
            // if(product === 'jiraprojects'){
            //   updateSkill(jiraSkill.skill_metadata._id,this.props.match.params.wId,{disabled : false}).then(res => {
            //     if(res.data.success) jiraSkill.skill_metadata.linked ? this.props.history.push(`/${this.props.match.params.wId}/skills/${jiraSkill.skill_metadata && jiraSkill.skill_metadata._id}?view=channel_preferences`) : this.props.history.push(`/${this.props.match.params.wId}/skills/${jiraSkill.skill_metadata && jiraSkill.skill_metadata._id}?view=connection`);
            //     })
            // }else if (product === 'helpdesk'){
            //   data = {isServiceDeskEnabled : true}
            //   if(jiraSkill && jiraSkill.skill_metadata && jiraSkill.skill_metadata.disabled) data.disabled = false
            //   updateSkill(jiraSkill.skill_metadata._id,this.props.match.params.wId,data).then(res => {
            //     if(res.data.success) jiraSkill.skill_metadata.linked ? this.props.history.push(`/${this.props.match.params.wId}/skills/${jiraSkill.skill_metadata && jiraSkill.skill_metadata._id}?view=channel_preferences`) : this.props.history.push(`/${this.props.match.params.wId}/skills/${jiraSkill.skill_metadata && jiraSkill.skill_metadata._id}?view=connection`);
            //   })
            // }else if (product === 'jirareports'){
            //   data = {isJiraReportsDisabled : false}
            //   if(jiraSkill && jiraSkill.skill_metadata && jiraSkill.skill_metadata.disabled) data.disabled = false
            //   updateSkill(jiraSkill.skill_metadata._id,this.props.match.params.wId,data).then(res => {
            //     if(res.data.success) jiraSkill.skill_metadata.linked ? this.props.history.push(`/${this.props.match.params.wId}/skills/${jiraSkill.skill_metadata && jiraSkill.skill_metadata._id}?view=reports`) : this.props.history.push(`/${this.props.match.params.wId}/skills/${jiraSkill.skill_metadata && jiraSkill.skill_metadata._id}?view=connection`);
            //   })
            // }
            else if (product === 'wiki'){
              updateSkill(wikiSkill.skill_metadata._id,this.props.match.params.wId,{disabled : false}).then(res => {
                if(res.data.success) this.props.history.push(`/${this.props.match.params.wId}/skills/${wikiSkill.skill_metadata && wikiSkill.skill_metadata._id}?view=${wikiSkill.skill_metadata.linked?"channel_preferences":"connection"}`);
                else if(res.data.error && res.data.error === 'not_a_workspace_admin') message.error('Contact one of the workspace admins to enable/disable products')
              })
            }else if (product === 'checkin'){
              updateSkill(checkInSkill.skill_metadata._id,this.props.match.params.wId,{disabled : false}).then(res => {
                updateWorkspace(this.props.match.params.wId, "", { disableCheckins: false }).then(response=>{
                  if(res.data.success &&response.data.success) this.props.history.push(`/${this.props.match.params.wId}/teamsyncs/templates/new_checkin`);
                  else if(res.data.error && res.data.error === 'not_a_workspace_admin') message.error('Contact one of the workspace admins to enable/disable products')
                })
                
              })
            }
          }
        })
      } else {
        message.warning(this.getErrorMessgage());
      }
    } else {
      message.error("Error redirecting skill");
    }
  };

  getErrorMessgage = () => {
    const { members } = this.props;
    let adiminNames = "Contact one of the workspace admins to enable this product: ";

    const allWorkspaceAdmins = members && members.filter((member) => member.role === "admin");

    if (allWorkspaceAdmins && allWorkspaceAdmins.length > 0) {
      allWorkspaceAdmins.forEach((admin, index) => {
        if (index < 3) {
          adiminNames = adiminNames + `${admin.user_id.displayName || admin.user_id.name} `;
        }
      });

      if (allWorkspaceAdmins.length > 3) adiminNames = adiminNames + ` and ${allWorkspaceAdmins.length - 3} others`;
    }

    return adiminNames;
  };

  getJiraProjectsCard = ({ buttonsizeSmall, buttontypeText, cardSize,sub_skill }) => {
    const { jiraLoading,jiraConfiguredChannelsCount_project } = this.state;

    return (

      <Col
                xs={{ span: 9 }}
                sm={{ span: 9 }}
                lg={{ span: 12 }}
                xxl={{ span: 8 }}
              >
                <Card
                  // size="small"
                  style={{ minWidth: 300, height: '100%' }}
                  loading={jiraLoading}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text strong style={{ fontSize: 16 }}>
                      Project Channels
                    </Text>
                    <Text type="secondary">Get alerts and update issues</Text>
                    <Text strong style={{ fontSize: 32, marginTop: 8 }}>
                      {jiraConfiguredChannelsCount_project}
                    </Text>
                    <Button
                      style={{ marginTop: 8 }}
                      // size="small"
                      type="primary"
                      icon={<ArrowRightOutlined />}
                      onClick={() => this.handleJiraLinks("channel_preferences",'jira_software')}
                    >
                      Show All
                    </Button>
                    <Divider style={{ margin: '12px 0px 8px' }} />
                    <div>
                      <Tooltip title="New Project Channel">
                        <Button
                          type="text"
                          icon={
                            <PlusCircleTwoTone
                              // twoToneColor="#8c82c0"
                              style={{ fontSize: 18 }}
                            />
                          }
                          style={{ marginRight: 8 }}
                          onClick={() => this.handleJiraLinks("channel_preferences",'jira_software')}
                        />
                      </Tooltip>
                      <Tooltip title="Help Docs">
                        <Button
                          type="link"
                          icon={
                            <BookTwoTone
                              // twoToneColor="#8c82c0"
                              style={{ fontSize: 18 }}
                            />
                          }
                          style={{ marginRight: 8 }}
                          onClick={() => window.open(`${productCardLinks.jiraProjects.helpDocs}`, '_blank')}
                        />
                      </Tooltip>
                      <Tooltip title="What's New">
                        <Button
                          type="text"
                          icon={
                            <NotificationTwoTone
                              // twoToneColor="#8c82c0"
                              style={{ fontSize: 18 }}
                            />
                          }
                          onClick={() => window.open(`${productCardLinks.jiraProjects.whatsNew}`, '_blank')}
                        />
                      </Tooltip>
                    </div>
                  </div>
                </Card>
              </Col>
      // <Col  xs={{ span: 24 }}
      // sm={{ span: 24 }}
      // lg={{ span: 12 }}
      // xxl={{ span: 8 }}>
      //   <Card
      //     style={{ width: "100%", height: "100%" }}
      //     size={cardSize}
      //     title={
      //       <span>
      //         {sub_skill.name}
      //         <Tooltip title={productCardDesc.jiraProjects}>
      //           <InfoCircleOutlined
      //             style={{ marginLeft: 8, color: '#999', cursor: 'pointer' }}
      //           />{' '}
      //         </Tooltip>
      //       </span>
      //     }
      //     extra={
      //       <Button size={buttonsizeSmall} type='link' onClick={() => this.handleJiraLinks("manage")}>
      //         Manage
      //       </Button>
      //       <Dropdown.Button
      //       size="small"
      //       type="link"
      //       overlay={help_menu(productCardLinks.jiraProjects.helpDocs, productCardLinks.jiraProjects.whatsNew)}
      //       onClick={() => this.handleJiraLinks("channel_preferences",'jira_software')}
      //     >
      //       Setup Project Channel
      //     </Dropdown.Button>
      //     }
      //     loading={jiraLoading}
      //   >
      //     <Button type={buttontypeText} icon={<SlackOutlined />} onClick={() => this.handleJiraLinks("channel_preferences",'jira_software')}>
      //       Channel configurations ({jiraConfiguredChannelsCount_normalChannel})
      //     </Button>
      //     <br />
      //     <Button type={buttontypeText} icon={<UserOutlined />} onClick={() => this.handleJiraLinks("personal",'jira_software')}>
      //       Jira Personal Preferences
      //     </Button>
      //   </Card>
      // </Col>
      
    );
  };
  getHelpDeskCard = (channel,{ buttonsizeSmall, buttontypeText, cardSize,sub_skill }) => {
    const { jiraLoading, jiraConfiguredChannelsCount_support, jiraConfiguredChannelsCount_agent } = this.state;
    
    let helpDocs = productCardLinks.helpDesk.helpDocs,
    whatsNew = productCardLinks.helpDesk.whatsNew

  let title = channel ? channel : "",
    desc = channel === "Support Channels" ?"Turn employee requests to tickets":
          channel === "Agent Channels"?"Triage, discuss & update tickets":"",
    count = channel === "Support Channels" ? jiraConfiguredChannelsCount_support:
            channel === "Agent Channels"? jiraConfiguredChannelsCount_agent: 0   
    return (
      <Col
                xs={{ span: 9 }}
                sm={{ span: 9 }}
                lg={{ span: 12 }}
                xxl={{ span: 8 }}
              >
                <Card
                  // size="small"
                  style={{ minWidth: 300, height: '100%' }}
                  loading={jiraLoading}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text strong style={{ fontSize: 16 }}>
                      {title}
                    </Text>
                    <Text type="secondary">
                      {desc}
                    </Text>
                    <Text strong style={{ fontSize: 32, marginTop: 8 }}>
                      {count||0}
                    </Text>
                    <Button
                      style={{ marginTop: 8 }}
                      // size="small"
                      type="primary"
                      icon={<ArrowRightOutlined />}
                      onClick={() => this.handleJiraLinks("channel_preferences",'jira_service_desk')}
                    >
                      Show All
                    </Button>
                    <Divider style={{ margin: '12px 0px 8px' }} />
                    <div>
                      <Tooltip title={`New ${channel}`}>
                        <Button
                          type="text"
                          icon={
                            <PlusCircleTwoTone
                              // twoToneColor="#8c82c0"
                              style={{ fontSize: 18 }}
                            />
                          }
                          style={{ marginRight: 8 }}
                          onClick={() => this.handleJiraLinks("channel_preferences",'jira_service_desk')}
                        />
                      </Tooltip>
                      <Tooltip title="Help Docs">
                        <Button
                          type="link"
                          icon={
                            <BookTwoTone
                              // twoToneColor="#8c82c0"
                              style={{ fontSize: 18 }}
                            />
                          }
                          style={{ marginRight: 8 }}
                          onClick={() => window.open(`${helpDocs}`, '_blank')}
                          
                        />
                      </Tooltip>
                      <Tooltip title="What's New">
                        <Button
                          type="text"
                          icon={
                            <NotificationTwoTone
                              // twoToneColor="#8c82c0"
                              style={{ fontSize: 18 }}
                            />
                          }
                          onClick={() => window.open(`${whatsNew}`, '_blank')}
                        />
                      </Tooltip>
                    </div>
                  </div>
                </Card>
              </Col>
      // <Col  xs={{ span: 24 }}
      // sm={{ span: 24 }}
      // lg={{ span: 12 }}
      // xxl={{ span: 8 }}>
      //   <Card
      //     style={{ width: "100%", height: "100%" }}
      //     size={cardSize}
      //     title={
      //       <span>
      //         {sub_skill.name}
      //         <Tooltip title={productCardDesc.helpDesk}>
      //           <InfoCircleOutlined
      //             style={{ marginLeft: 8, color: '#999', cursor: 'pointer' }}
      //           />{' '}
      //         </Tooltip>
      //       </span>
      //     }
      //     extra={
      //       // <Button size={buttonsizeSmall} type='link' onClick={() => this.handleJiraLinks("reports")}>
      //       //   Manage
      //       // </Button>
      //       <Dropdown.Button
      //       size="small"
      //       type="link"
      //       overlay={help_menu(productCardLinks.helpDesk.helpDocs, productCardLinks.helpDesk.whatsNew)}
      //       onClick={() => this.handleJiraLinks("channel_preferences",'jira_service_desk')}
      //     >
      //       Setup Support Channel
      //     </Dropdown.Button>
            
      //     }
      //     loading={jiraLoading}
      //   >
      //     <Button type={buttontypeText} icon={<SlackOutlined />} onClick={() => this.handleJiraLinks("channel_preferences",'jira_service_desk')}>
      //       Channel configurations ({jiraConfiguredChannelsCount_supportChannel})
      //     </Button>
      //   </Card>
      // </Col>
    );
  };
  getJiraReportsCard = (report,{ buttonsizeSmall, buttontypeText, cardSize,sub_skill }) => {
    const { jiraLoading, jiraReportsCount,personalReportsCount } = this.state;
    let  helpDocs = productCardLinks.jiraReports.helpDocs,
    whatsNew = productCardLinks.jiraReports.whatsNew;


    let title = report ? report : "",
    desc =  report === "Channel Reports" ?"Schedule reports for team channels":
            report === "Personal Reports"?"Get reports privately in Slack":"",
    count = report === "Channel Reports" ? jiraReportsCount:
            report === "Personal Reports"? personalReportsCount: 0,
    reportType = report === "Channel Reports"?"reports":"my_reports"
    return (
      <Col
      xs={{ span: 9 }}
      sm={{ span: 9 }}
      lg={{ span: 12 }}
      xxl={{ span: 8 }}
    >
      <Card
        // size="small"
        style={{ minWidth: 300, height: '100%' }}
        loading={jiraLoading}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text strong style={{ fontSize: 16 }}>
            {title}
          </Text>
          <Text type="secondary">
            {desc}
          </Text>
          <Text strong style={{ fontSize: 32, marginTop: 8 }}>
            {count||0}
          </Text>
          <Button
            style={{ marginTop: 8 }}
            // size="small"
            type="primary"
            icon={<ArrowRightOutlined />}
            onClick={() => this.handleJiraLinks(reportType,'jira_reports')}
          >
            Show All
          </Button>
          <Divider style={{ margin: '12px 0px 8px' }} />
          <div>
            <Tooltip title={`New ${report}`}>
              <Button
                type="text"
                icon={
                  <PlusCircleTwoTone
                    // twoToneColor="#8c82c0"
                    style={{ fontSize: 18 }}
                  />
                }
                style={{ marginRight: 8 }}
                onClick={() => this.handleJiraLinks(reportType,'jira_reports')}
              />
            </Tooltip>
            <Tooltip title="Help Docs">
              <Button
                type="link"
                icon={
                  <BookTwoTone
                    // twoToneColor="#8c82c0"
                    style={{ fontSize: 18 }}
                  />
                }
                style={{ marginRight: 8 }}
                onClick={() => window.open(`${helpDocs}`, '_blank')}
              />
            </Tooltip>
            <Tooltip title="What's New">
              <Button
                type="text"
                icon={
                  <NotificationTwoTone
                    // twoToneColor="#8c82c0"
                    style={{ fontSize: 18 }}
                  />
                }
                onClick={() => window.open(`${whatsNew}`, '_blank')}
              />
            </Tooltip>
          </div>
        </div>
      </Card>
    </Col>
      // <Col  xs={{ span: 24 }}
      // sm={{ span: 24 }}
      // lg={{ span: 12 }}
      // xxl={{ span: 8 }}>
      //   <Card
      //     style={{ width: "100%", height: "100%" }}
      //     size={cardSize}
      //     title={
      //       <span>
      //         {sub_skill.name}
      //         <Tooltip title={productCardDesc.jiraReports}>
      //           <InfoCircleOutlined
      //             style={{ marginLeft: 8, color: '#999', cursor: 'pointer' }}
      //           />{' '}
      //         </Tooltip>
      //       </span>
      //     }
      //     extra={
      //       // <Button size={buttonsizeSmall} type='link' onClick={() => this.handleJiraLinks("manage")}>
      //       //   Manage
      //       // </Button>
      //       <Dropdown.Button
      //       size="small"
      //       type="link"
      //       overlay={help_menu(productCardLinks.jiraReports.helpDocs, productCardLinks.jiraReports.whatsNew)}
      //       onClick={() => this.handleJiraLinks("reports",'jira_reports')}
      //     >
      //       Setup Channel Report 
      //     </Dropdown.Button>
      //     }
      //     loading={jiraLoading}
      //   >
      //     <Button type={buttontypeText} icon={<BarChartOutlined />} onClick={() => this.handleJiraLinks("reports",'jira_reports')}>
      //       Scheduled Reports & Nudges ({jiraReportsCount})
      //     </Button>
      //     <br />
      //     <Button type={buttontypeText} icon={<BarChartOutlined />} onClick={() => this.handleJiraLinks("my_reports",'jira_reports')}>
      //       My Reports ({personalReportsCount})
      //     </Button>
      //   </Card>
      // </Col>
    );
  };
  getWikiCard = ({ buttonsizeSmall, buttontypeText, cardSize,skill }) => {
    const { wikiLoading, wikiSkill, wikiChannelConfigCount } = this.state;
    let helpDocs = productCardLinks.wiki.helpDocs,
      whatsNew = productCardLinks.wiki.whatsNew
    return (
      <Col
      xs={{ span: 9 }}
      sm={{ span: 9 }}
      lg={{ span: 12 }}
      xxl={{ span: 8 }}
    >
      <Card
        // size="small"
        style={{ minWidth: 300, height: '100%' }}
        loading={wikiLoading}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text strong style={{ fontSize: 16 }}>
            Wiki Channels
          </Text>
          <Text type="secondary">Auto-answer employee requests</Text>
          <Text strong style={{ fontSize: 32, marginTop: 8 }}>
            {wikiChannelConfigCount}
          </Text>
          <Button
            style={{ marginTop: 8 }}
            // size="small"
            type="primary"
            icon={<ArrowRightOutlined />}
            onClick={() =>
              this.props.history.push(
                `/${this.props.match.params.wId}/skills/${wikiSkill.skill_metadata && wikiSkill.skill_metadata._id}?view=channel_preferences`
              )
            }
          >
            Show All
          </Button>
          <Divider style={{ margin: '12px 0px 8px' }} />
          <div>
            <Tooltip title="New Wiki Channel">
              <Button
                type="text"
                icon={
                  <PlusCircleTwoTone
                    // twoToneColor="#8c82c0"
                    style={{ fontSize: 18 }}
                  />
                }
                style={{ marginRight: 8 }}
                onClick={() =>
              this.props.history.push(`/${this.props.match.params.wId}/skills/${wikiSkill.skill_metadata && wikiSkill.skill_metadata._id}?view=channel_preferences`)
            }
              />
            </Tooltip>
            <Tooltip title="Help Docs">
              <Button
                type="link"
                icon={
                  <BookTwoTone
                    // twoToneColor="#8c82c0"
                    style={{ fontSize: 18 }}
                  />
                }
                style={{ marginRight: 8 }}
                onClick={() => window.open(`${helpDocs}`, '_blank')}
              />
            </Tooltip>
            <Tooltip title="What's New">
              <Button
                type="text"
                icon={
                  <NotificationTwoTone
                    // twoToneColor="#8c82c0"
                    style={{ fontSize: 18 }}
                  />
                }
                onClick={() => window.open(`${whatsNew}`, '_blank')}
              />
            </Tooltip>
          </div>
        </div>
      </Card>
    </Col>
      // <Col  xs={{ span: 24 }}
      // sm={{ span: 24 }}
      // lg={{ span: 12 }}
      // xxl={{ span: 8 }}>
      //   <Card
      //     style={{ width: "100%", height: "100%" }}
      //     size={cardSize}
      //     title={
      //       <span>
      //         {skill.name}
      //         <Tooltip title={productCardDesc.wiki}>
      //           <InfoCircleOutlined
      //             style={{ marginLeft: 8, color: '#999', cursor: 'pointer' }}
      //           />{' '}
      //         </Tooltip>
      //       </span>
      //     }
      //     extra={
      //       // <Button
      //       //   size={buttonsizeSmall}
      //       //   type='link'
      //       //   onClick={() =>
      //       //     this.props.history.push(`/${this.props.match.params.wId}/skills/${wikiSkill.skill_metadata && wikiSkill.skill_metadata._id}`)
      //       //   }
      //       // >
      //       //   Manage
      //       // </Button>
      //       <Dropdown.Button
      //       size="small"
      //       type="link"
      //       overlay={help_menu(productCardLinks.wiki.helpDocs, productCardLinks.wiki.whatsNew)}
      //       onClick={() =>
      //         this.props.history.push(`/${this.props.match.params.wId}/skills/${wikiSkill.skill_metadata && wikiSkill.skill_metadata._id}?view=channel_preferences`)
      //       }
      //     >
      //       Setup Wiki Channel 
      //     </Dropdown.Button>
      //     }
      //     loading={wikiLoading}
      //   >
      //     <Button
      //       type={buttontypeText}
      //       icon={<BarChartOutlined />}
      //       onClick={() =>
      //         this.props.history.push(
      //           `/${this.props.match.params.wId}/skills/${wikiSkill.skill_metadata && wikiSkill.skill_metadata._id}?view=channel_preferences`
      //         )
      //       }
      //     >
      //       Channel configurations ({wikiChannelConfigCount})
      //     </Button>
      //   </Card>
      // </Col>
    );
  };

  getCheckinCard = ({ cardSize, buttontypeText, myCheckins, buttonsizeSmall,skill }) => {
    const { checkinloading, allCheckinsCount, myCheckinsCount } = this.state;
    const { teamSyncs, workspace } = this.props;
    return (
      // <Col  xs={{ span: 24 }}
      // sm={{ span: 24 }}
      // lg={{ span: 12 }}
      // xxl={{ span: 8 }}>
      //   <Card
      //     title={
      //       <span>
      //         {skill.name}
      //         <Tooltip title={productCardDesc.checkin}>
      //           <InfoCircleOutlined
      //             style={{ marginLeft: 8, color: '#999', cursor: 'pointer' }}
      //           />{' '}
      //         </Tooltip>
      //       </span>
      //     }
      //     extra={
      //       // <Button size={buttonsizeSmall} type='link' onClick={this.toggleNewStandupModal}>
      //       //   New Check-in
      //       // </Button>

      //       <Dropdown.Button
      //         size="small"
      //         type="link"
      //         overlay={help_menu(productCardLinks.checkin.helpDocs, productCardLinks.checkin.whatsNew)}
      //         onClick={this.toggleNewStandupModal}
      //       >
      //         Setup Check-in
      //       </Dropdown.Button>

      //     }
      //     loading={checkinloading}
      //     style={{ width: "100%", height: "100%" }}
      //     size={cardSize}
      //   >
      //     <Button type={buttontypeText} icon={<CheckCircleOutlined />} onClick={() => this.handleCheckinLinks("mycheckins")}>
      //       My Check-ins ({myCheckinsCount})
      //     </Button>
      //     <br />
      //     {/* <Button type={buttontypeText} icon={<CheckCircleOutlined />} onClick={() => this.handleCheckinLinks("all")}>
      //   All Check-ins ({allCheckinsCount})
      // </Button> 
      //     <br />*/}
      //     <Button type={buttontypeText} icon={<AppstoreOutlined />} onClick={() => this.handleCheckinLinks("templates")}>
      //       Check-in Templates
      //     </Button>
      //   </Card>
      // </Col>
      <Col
      xs={{ span: 9 }}
      sm={{ span: 9 }}
      lg={{ span: 12 }}
      xxl={{ span: 8 }}
    >
      <Card
        // size="small"
        style={{ minWidth: 300, height: '100%' }}
        loading={checkinloading}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text strong style={{ fontSize: 16 }}>
            My Check-ins
          </Text>
          <Text type="secondary">
            Check-ins I participate or manage
          </Text>
          <Text strong style={{ fontSize: 32, marginTop: 8 }}>
            {myCheckinsCount}
          </Text>
          <Button
            style={{ marginTop: 8 }}
            // size="small"
            type="primary"
            icon={<ArrowRightOutlined />}
            onClick={() => this.handleCheckinLinks("mycheckins")}
          >
            Show All
          </Button>
          <Divider style={{ margin: '12px 0px 8px' }} />
          <div>
            <Tooltip title="New Check-in">
              <Button
                type="text"
                icon={
                  <PlusCircleTwoTone
                    // twoToneColor="#8c82c0"
                    style={{ fontSize: 18 }}
                  />
                }
                style={{ marginRight: 8 }}
                onClick={this.toggleNewStandupModal}
              />
            </Tooltip>
            <Tooltip title="Help Docs">
              <Button
                type="link"
                icon={
                  <BookTwoTone
                    // twoToneColor="#8c82c0"
                    style={{ fontSize: 18 }}
                  />
                }
                style={{ marginRight: 8 }}
                onClick={() => window.open(`${productCardLinks.checkin.helpDocs}`, '_blank')}
              />
            </Tooltip>
            <Tooltip title="What's New">
              <Button
                type="text"
                icon={
                  <NotificationTwoTone
                    // twoToneColor="#8c82c0"
                    style={{ fontSize: 18 }}
                  />
                }
                onClick={() => window.open(`${productCardLinks.checkin.whatsNew}`, '_blank')}
              />
            </Tooltip>
          </div>
        </div>
      </Card>
    </Col>
    );
  };

  // getingStartedButtons = () => {
  //   const { workspace, skills } = this.props;
  //   const buttontypeText = "text";

  //   const checkInHelpDocs_button = (
  //     <Button type={buttontypeText} href={productCardLinks.checkin.helpDocs} target='_blank' icon={<InfoCircleOutlined />}>
  //       Check-ins Help Docs
  //     </Button>
  //   );

  //   const jiraBotHelpDocs_button = (
  //     <Button type={buttontypeText} href={productCardLinks.jiraProjects.helpDocs} target='_blank' icon={<InfoCircleOutlined />}>
  //       Jira Bot Help Docs
  //     </Button>
  //   );

  //   // const trooprChangeLog_button = (
  //   //   <Button
  //   //     type={buttontypeText}
  //   //     href='https://www.notion.so/trooprdocs/Troopr-What-s-New-09dbb0b5591844d7a757dbc5ae847f30'
  //   //     target='_blank'
  //   //     icon={<AlertOutlined />}
  //   //   >
  //   //     Troopr Change log
  //   //   </Button>
  //   // );
  //   const checkin_whatsNew_button = (
  //     <Button type={buttontypeText} href='https://help.troopr.ai/whats-new-in-troopr-check-ins-2021' target='_blank' icon={<AlertOutlined />}>
  //       Whats new in Check-ins
  //     </Button>
  //   );
  //   const jiraBot_whatsNew_button = (
  //     <Button
  //       type={buttontypeText}
  //       href='https://help.jiraslackintegration.com/whats-new-in-jira-bot/whats-new-in-jira-bot-2021'
  //       target='_blank'
  //       icon={<AlertOutlined />}
  //     >
  //       Whats new in Jira Bot
  //     </Button>
  //   );

  //   let buttons = <></>;
  //   const jiraSkill = skills.find((skill) => skill.name === "Jira");
  //   if (skills.length > 0) {
  //     if (!jiraSkill.skill_metadata.disabled && !workspace.disableCheckins) {
  //       buttons = (
  //         <>
  //           {checkInHelpDocs_button}
  //           <br />
  //           {jiraBotHelpDocs_button}
  //           <br />
  //           {checkin_whatsNew_button}
  //           <br />
  //           {jiraBot_whatsNew_button}
  //         </>
  //       );
  //     } else if (!jiraSkill.skill_metadata.disabled && workspace.disableCheckins) {
  //       buttons = (
  //         <>
  //           {jiraBotHelpDocs_button}
  //           <br />
  //           {jiraBot_whatsNew_button}
  //         </>
  //       );
  //     } else if (jiraSkill.skill_metadata.disabled && !workspace.disableCheckins) {
  //       buttons = (
  //         <>
  //           {checkInHelpDocs_button}
  //           <br />
  //           {checkin_whatsNew_button}
  //         </>
  //       );
  //     } else {
  //       buttons = (
  //         <>
  //           {checkInHelpDocs_button}
  //           <br />
  //           {jiraBotHelpDocs_button}
  //           <br />
  //           {checkin_whatsNew_button}
  //           <br />
  //           {jiraBot_whatsNew_button}
  //         </>
  //       );
  //     }
  //   }

  //   return buttons;
  // };

  render() {
    const { user_name, teamSyncs, workspace, skills } = this.props;
    const { newStandupModalVisible, jiraSkill, wikiSkill, allCheckinsCount, isJiraConnected, isWikiConnected,checkInSkill } = this.state;

    const myCheckins = teamSyncs.filter(
      (teamSync) =>
        teamSync.selectedMembers.includes(this.props.user_now._id) || (teamSync.admins && teamSync.admins.includes(this.props.user_now._id))
    );
    const cardSize = "small";
    const buttontypeText = "text";
    const buttonsizeSmall = "small";


    const software_subskill = jiraSkill && jiraSkill.skill_metadata.sub_skills.find(ss => ss.key === 'jira_software') 
    const helpdesk_subskill = jiraSkill && jiraSkill.skill_metadata.sub_skills.find(ss => ss.key === 'jira_service_desk') 
    const reports_subskill = jiraSkill && jiraSkill.skill_metadata.sub_skills.find(ss => ss.key === 'jira_reports') 

    const isJiraEnabled = software_subskill && !software_subskill.disabled;
    const isHelpDeskEnabled = helpdesk_subskill && !helpdesk_subskill.disabled;
    const isJiraReportsEnabled = reports_subskill && !reports_subskill.disabled;
    const isWikiEnabled = wikiSkill && wikiSkill.skill_metadata && !wikiSkill.skill_metadata.disabled;
    const ischeckinEnabled = !workspace.disableCheckins;

    const isCheckinOnBoarded = allCheckinsCount !== 0;
    const showSecondSection = this.props.workspace.isRestricteDisabledProductInDashboard ? this.props.isWorkspaceAdmin : true
    const showDivider = !ischeckinEnabled || !isJiraEnabled || !isHelpDeskEnabled || !isWikiEnabled || !isJiraReportsEnabled
    return (
      <div class="homescroll">
      <Layout
        style={{
          height: "100vh",
          overflow: "auto",
          /*paddingLeft:'100px', paddingRight:'100px',*/ marginLeft: 0 /*background: localStorage.getItem("theme") == "default" ? "#ffffff" : "rgba(15,15,15)"*/,
        }}
      >
        {/* <PageHeader
          title={user_name ? `Hello ${user_name}, welcome to Troopr!` : <div style={{ height: "11vh" }}></div>}
          // style={{ paddingLeft: 0, paddingRight: 0 }}
        > */}
          <PageHeader
          // className="site-page-header"
          // onBack={() => null}
          // title="👋 Hello Rajesh Shanmugam, welcome to Troopr!"
          title={user_name ? `Hello ${user_name}, welcome to Troopr!` : <div style={{ height: "11vh" }}></div>}
          subTitle="Conversational products for work"
          // extra={[
          //   <Button type="primary" onClick={this.showModal}>
          //     Open Onboarding
          //   </Button>,
          // ]}
          className="header"
        >
          {/* <Content style={{ padding: "20px 16px 20px 16px", overflow: "initial" }} /> */}
          {/* <Title level={5}>Your Troopr Products</Title>
          <Divider /> */}
          {this.props.skills && this.props.skills.length > 0 ?
          <>
          <Row gutter={[16, 16]}>
            {/* <Col span={8}>
              <Card
                title='Getting Started'
                loading={this.props.skills.length > 0 ? false : true}
                extra={
                  !this.props.assistant_skills.workspace.customFeedbackChannel && !this.props.assistant_skills.workspace.customFeedbackemail ? (
                    <Button size={buttonsizeSmall} type='link' onClick={() => this.openChatWindow()}>
                      Chat with us
                    </Button>
                  ) : (
                    <></>
                  )
                }
                style={{ width: "100%", height: "100%" }}
                size={cardSize}
              >
                {this.getingStartedButtons()}
              </Card>
            </Col> */}

           
                {ischeckinEnabled && isCheckinOnBoarded && this.getCheckinCard({ cardSize, buttontypeText, myCheckins, buttonsizeSmall,skill : checkInSkill })
                  }
                {isJiraEnabled && isJiraConnected && this.getJiraProjectsCard({ buttonsizeSmall, buttontypeText, cardSize,sub_skill : software_subskill })
                  }
                {isHelpDeskEnabled && isJiraConnected
                && [this.getHelpDeskCard("Support Channels",{ buttonsizeSmall, buttontypeText, cardSize,sub_skill : helpdesk_subskill }),
                  this.getHelpDeskCard("Agent Channels",{ buttonsizeSmall, buttontypeText, cardSize,sub_skill : helpdesk_subskill }) ]
                 }
                {isWikiEnabled && isWikiConnected
                  && this.getWikiCard({ buttonsizeSmall, buttontypeText, cardSize,skill : wikiSkill })
                 }
                {isJiraReportsEnabled && isJiraConnected
                  && [this.getJiraReportsCard("Channel Reports",{ buttonsizeSmall, buttontypeText, cardSize,sub_skill : reports_subskill }),
                    this.getJiraReportsCard("Personal Reports",{ buttonsizeSmall, buttontypeText, cardSize,sub_skill : reports_subskill })]
                  }

                {ischeckinEnabled && isCheckinOnBoarded?"" : ischeckinEnabled && this.getProductSecondaryCard({
                      product: "checkin",
                      isSkillEnabled: ischeckinEnabled,
                      isSkillOnboarded: isCheckinOnBoarded,
                      cardSize,
                      skill : checkInSkill
                    })}
                {isJiraEnabled && isJiraConnected?"": isJiraEnabled && this.getProductSecondaryCard({
                      product: "jiraprojects",
                      isSkillEnabled: isJiraEnabled,
                      isSkillOnboarded: isJiraConnected,
                      cardSize,
                      sub_skill : software_subskill,
                      skill : jiraSkill
                    })}
                {isHelpDeskEnabled && isJiraConnected?"": isHelpDeskEnabled &&  this.getProductSecondaryCard({
                      product: "helpdesk",
                      isSkillEnabled: isHelpDeskEnabled,
                      isSkillOnboarded: isJiraConnected,
                      cardSize,
                      sub_skill : helpdesk_subskill,
                      skill : jiraSkill
                    })}
                {isWikiEnabled && isWikiConnected?"": isWikiEnabled && this.getProductSecondaryCard({
                      product: "wiki",
                      isSkillEnabled: isWikiEnabled,
                      isSkillOnboarded: isWikiConnected,
                      cardSize,
                      skill : wikiSkill
                    })}
                {isJiraReportsEnabled && isJiraConnected ? "" : isJiraReportsEnabled && this.getProductSecondaryCard({
                      product: "jirareports",
                      isSkillEnabled: isJiraReportsEnabled,
                      isSkillOnboarded: isJiraConnected,
                      cardSize,
                      sub_skill : reports_subskill,
                      skill : jiraSkill
                    })}
          </Row>
          
          { showSecondSection && 
          <>
            {showDivider&& 
           <Divider orientation="left" orientationMargin="0" style={{fontWeight:600}} >
              Available Troopr Products
            </Divider>}
          <Row gutter={[16, 16]}>
              {
                  !ischeckinEnabled && this.getProductSecondaryCard({
                    product: "checkin",
                    isSkillEnabled: ischeckinEnabled,
                    isSkillOnboarded: isCheckinOnBoarded,
                    cardSize,
                    skill : checkInSkill
                  })
                }
                {
                  !isJiraEnabled && this.getProductSecondaryCard({
                    product: "jiraprojects",
                    isSkillEnabled: isJiraEnabled,
                    isSkillOnboarded: isJiraConnected,
                    cardSize,
                    sub_skill : software_subskill,
                    skill : jiraSkill
                  })
                }
                 {!isHelpDeskEnabled && this.getProductSecondaryCard({
                      product: "helpdesk",
                      isSkillEnabled: isHelpDeskEnabled,
                      isSkillOnboarded: isJiraConnected,
                      cardSize,
                      sub_skill : helpdesk_subskill,
                      skill : jiraSkill
                    })}
                {!isWikiEnabled &&  this.getProductSecondaryCard({
                      product: "wiki",
                      isSkillEnabled: isWikiEnabled,
                      isSkillOnboarded: isWikiConnected,
                      cardSize,
                      skill : wikiSkill
                    })}
                {!isJiraReportsEnabled &&  this.getProductSecondaryCard({
                      product: "jirareports",
                      isSkillEnabled: isJiraReportsEnabled,
                      isSkillOnboarded: isJiraConnected,
                      cardSize,
                      sub_skill : reports_subskill,
                      skill : jiraSkill
                    })}
          </Row>
           </>}
  
          </>
          :<Spin style={{marginLeft:"50%", marginTop:"40vh"}}/>
          }
          
           
        </PageHeader>

        {newStandupModalVisible && <CreateTeamsyncModal
          newStandupModalVisible={newStandupModalVisible}
          modalToggle={this.toggleNewStandupModal}
          // https://stackoverflow.com/questions/37949981/call-child-method-from-parent
          setClick={(click) => (this.clickChild = click)}

          //whenever you add something here check in allstandups,standupReport,sidenavbar files too
        />}
      </Layout>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user_now: state.common_reducer.user,
  user_name: state.common_reducer.user.displayName || state.common_reducer.user.name,
  teamSyncs: state.skills.userTeamSyncs,
  skills: state.skills.skills,
  assistant_skills: state.skills,
  cardSkills: state.cards.cardSkills,
  currentSkill: state.skills.currentSkill,
  members: state.skills.members,
  usermappings: state.skills.userMappingsWithUsers,
  workspace: state.common_reducer.workspace,
  team: state.skills.team,
  isWorkspaceAdmin: state.common_reducer.isAdmin,
});

export default withRouter(
  connect(mapStateToProps, {
    setDriftState,
    getConfluenceChannelConfigs,
    getCardSkills,
    updateSkill,
    updateWorkspace
  })(Dashboard)
);
