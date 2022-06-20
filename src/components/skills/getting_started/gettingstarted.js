import React from 'react';
import 'antd/dist/antd.css';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  Avatar,
  Button,
  Layout,
  PageHeader,
  Row,
  Col,
  Typography,
  Card,
  Modal,
  Progress,
  message
} from 'antd';
import {
  BulbOutlined,
  ProjectOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  QuestionCircleOutlined,
  PieChartOutlined,
} from '@ant-design/icons';

import { getTeamsyncsCount, updateSkill, updateWorkspace, getProjectfirstDetails } from "../skills_action";

import CreateTeamsyncModal from '../troopr_standup/createTeamsyncModal';
import { productDetails } from '../../../utils/productDetails';

const { Content } = Layout;

const { Text } = Typography;

class GettingStarted extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myCheckinsCount: 0,
      answerCount: 0,
      projectChannel: false,
      jiraIssue: false,
      isGettingStarted: true,
      isJiraConnected: true,
      isWikiConnected: true,
      automaticAnswer: false,
      confluenceArticle: false,
      channelReport: false,
      personalReport: false,
      isModalVisible: false,
      checkinSkill: false,
      jiraSkill: false,
      wikiSkill: false,
      wiki: false,
      supportChannel: false,
      agentChannel: false,
      wikiChannel: false,
      jiraTicket: false,
      newStandupModalVisible: false,
      checkinActivation: true,
      wikiActivation: true,
      projectActivation: true,
      helpdeskActivation: true,
      reportActivation: true,
      checkinPercentage: 0,
      projectPercentage: 0,
      reportPercentage: 0,
      helpdeskPercentage: 0,
      wikiPercentage: 0,
      loading: true,
      project: false,
      helpdesk: false,
      report: false,
      checkinLoading: true
    }
  }

  checkinPercentage = () => {
    const { checkinActivation, checkinPercentage, myCheckinsCount, answerCount } = this.state;

    if (checkinActivation) {
      if (myCheckinsCount > 0) {
        if (answerCount > 0) {
          this.setState({
            checkinPercentage: checkinPercentage + 100
          })
        } else {
          this.setState({
            checkinPercentage: checkinPercentage + 66
          })
        }
      } else {
        this.setState({
          checkinPercentage: checkinPercentage + 33
        })
      }
    } else { }
  }

  projectPercentage = () => {
    const {  projectChannel, jiraIssue } = this.state;
    const {  skills } = this.props;

    const jiraSkill = skills.find((skill) => skill.key === 'jira')
    const isJiraConnected = jiraSkill.skill_metadata.linked
    let projectActivation = false
    const jiraProject = jiraSkill.skill_metadata.sub_skills.find((sub) => sub.key === 'jira_software')
    if (jiraProject && !jiraProject.disabled)  projectActivation = true
    this.setState({projectActivation})

    let projectPercentage = 0
    if(projectActivation){
      projectPercentage = 25
      if(isJiraConnected) {
        projectPercentage = 50
        if(projectChannel){
          projectPercentage = 75
          if(jiraIssue) projectPercentage = 100
        }
      }
    }

    this.setState({projectPercentage})
  }

  helpdeskPercentage = () => {
    const { supportChannel, agentChannel, jiraTicket } = this.state;
    const {skills} = this.props

    const jiraSkill = skills.find((skill) => skill.key === 'jira')
    const isJiraConnected = jiraSkill.skill_metadata.linked
    let helpdeskActivation = false
    const jiraHelpdesk = jiraSkill.skill_metadata.sub_skills.find((sub) => sub.key === 'jira_service_desk')
    if (jiraHelpdesk && !jiraHelpdesk.disabled) helpdeskActivation = true
    this.setState({helpdeskActivation})

    let helpdeskPercentage = 0
    if(helpdeskActivation) {
      helpdeskPercentage = 20
      if(isJiraConnected) {
        helpdeskPercentage = 40
        if(supportChannel){
          helpdeskPercentage = 60
          if(agentChannel){
            helpdeskPercentage = 80
            if(jiraTicket) helpdeskPercentage = 100
          }
        }
      }
    }

    this.setState({helpdeskPercentage})
  }

  wikiPercentage = () => {
    const { wikiChannel, automaticAnswer, confluenceArticle } = this.state;
    const {skills} = this.props

    const wiki = skills.find((skill) => skill.key === 'wiki')
    const isWikiConnected = wiki.skill_metadata.linked
    let wikiActivation = false

    if (wiki && !wiki.skill_metadata.disabled) wikiActivation = true
    this.setState({wikiActivation})

    let wikiPercentage = 0
    if(wikiActivation){
      wikiPercentage = 20
      if (isWikiConnected) {
        wikiPercentage = 40
        if (wikiChannel) {
          wikiPercentage = 60
          if (automaticAnswer) {
            wikiPercentage = 80
            if (confluenceArticle) wikiPercentage = 100
          }
        }
      }
    }
    this.setState({wikiPercentage})
  }

  reportPercentage = () => {
    const { channelReport, personalReport } = this.state
    const {skills} = this.props

    const jiraSkill = skills.find((skill) => skill.key === 'jira')
    const jiraReport = jiraSkill.skill_metadata.sub_skills.find((sub) => sub.key === 'jira_reports')
    const isJiraConnected = jiraSkill.skill_metadata.linked
    let reportActivation = false
    if (jiraReport && !jiraReport.disabled) reportActivation = true
    this.setState({reportActivation})

    let reportPercentage = 0
    if(reportActivation) {
      reportPercentage = 25
      if(isJiraConnected){
        reportPercentage = 50
        if(channelReport) {
          reportPercentage = 75
          if(personalReport) reportPercentage = 100
        }
      }
    }

    this.setState({reportPercentage})
  }

  componentDidMount() {
    const { skills } = this.props;

    if (skills.length > 0) {
      this.setStateValues()
      this.setCheckinStateValues()
    }
  }

  componentDidUpdate(prevProps) {
    const { skills } = this.props;

    if (skills !== prevProps.skills) {
      this.setStateValues()
      this.setCheckinStateValues()
    }
  }

  setStateValues = () => {
    const { match, skills, user_now, team } = this.props;


    const setPercentage = () => {
      this.projectPercentage();
      this.helpdeskPercentage();
      this.wikiPercentage();
      this.reportPercentage();
    }


    // var UserId = localStorage.trooprUserId;
    let UserId = user_now && user_now._id;

    const wiki = skills.find((skill) => skill.key === 'wiki')
    const jiraSkill = skills.find((skill) => skill.key === 'jira')
    const isJiraConnected = jiraSkill.skill_metadata.linked
    const isWikiConnected = wiki.skill_metadata.linked

    const jiraProject = jiraSkill.skill_metadata.sub_skills.find((sub) => sub.key === 'jira_software')
    const jiraReport = jiraSkill.skill_metadata.sub_skills.find((sub) => sub.key === 'jira_reports')
    const jiraHelpdesk = jiraSkill.skill_metadata.sub_skills.find((sub) => sub.key === 'jira_service_desk')

    if (((!jiraProject.disabled || !jiraHelpdesk.disabled || !jiraReport.disabled) && isJiraConnected) || (!wiki.skill_metadata.disabled && isWikiConnected)) {
      getProjectfirstDetails(match.params.wId, UserId, jiraSkill.skill_metadata._id,{team_data:{teamId:team.id,_id : team._id}}).then((res) => {
        if (res.success) {
          this.setState({
            projectChannel: res.project.projectChannel,
            jiraIssue: res.project.jiraIssue,
            jiraTicket: res.helpDesk.jiraTicket,
            supportChannel: res.helpDesk.customerChannel,
            agentChannel: res.helpDesk.agentChannel,
            wikiChannel: res.wiki.wikiChannel,
            automaticAnswer: res.wiki.automaticAnswer,
            confluenceArticle: res.wiki.confluenceArticle,
            personalReport: res.report.personalReport,
            channelReport: res.report.channelReport,
            loading: false,
          }, () => {
            setPercentage()
          })
        }
      })
    }else {
      setPercentage()
      this.setState({loading : false})
    }

    this.setState({
      jiraSkill: jiraSkill,
      wikiSkill: wiki,
      isJiraConnected,
      isWikiConnected,
      project: jiraProject,
      helpdesk: jiraHelpdesk,
      report: jiraReport
    })

  }

  setCheckinStateValues = () => {
    const { checkinActivation } = this.state;
    const { match, skills } = this.props;
    const checkinSkill = skills.find(skill => skill.key === 'standups')

    if (checkinSkill && checkinSkill.skill_metadata.disabled) {
      this.setState({
        checkinActivation: false,
        checkinPercentage: 0
      })
    }

    if (checkinActivation) {
      this.setState({checkinLoading:true})
      getTeamsyncsCount(match.params.wId, /* isGettingStarted */ true).then((res) => {
        if (res.success) {
          this.setState({
            myCheckinsCount: res.myCheckinsCount,
            answerCount: res.checkAnswerSubmission,
            checkinLoading: false
          })
          this.checkinPercentage();
        }
      }).catch((err) => console.error(err))
    }

    this.setState({
      checkinSkill: checkinSkill,
    })
  }

  toggleNewStandupModal = () => {
    this.setState({ newStandupModalVisible: !this.state.newStandupModalVisible }, () => {
      !this.state.newStandupModalVisible && setTimeout(() => this.clickChild(), 500);
    });
  };

  handleJiraConnection = () => {
    const { jiraSkill } = this.state
    const wId = this.props.match.params.wId
    this.props.history.push(`/${wId}/skills/${jiraSkill.skill_metadata._id}/jira_software?view=connection`)
  }

  handleChannelLinks = (type) => {
    const { jiraSkill, wikiSkill } = this.state;
    const wId = this.props.match.params.wId;
    if (type === "projectChannel") {
      this.props.history.push(`/${wId}/skills/${jiraSkill.skill_metadata._id}/jira_software?view=channel_preferences`);
    } else if (type === "supportChannel" || type === "agentChannel") {
      this.props.history.push(`/${wId}/skills/${jiraSkill.skill_metadata._id}/jira_service_desk?view=channel_preferences`);
    } else if (type === "wikiChannel") {
      this.props.history.push(`/${wId}/skills/${wikiSkill.skill_metadata._id}?view=channel_preferences`);
    } else if (type === "channelReport") {
      this.props.history.push(`/${wId}/skills/${jiraSkill.skill_metadata._id}/jira_reports?view=reports`);
    } else if (type === "personalReport") {
      this.props.history.push(`/${wId}/skills/${jiraSkill.skill_metadata._id}/jira_reports?view=appHome`);
    }
  };

  handleWikiConnection = () => {
    const { wikiSkill } = this.state
    const wId = this.props.match.params.wId
    this.props.history.push(`/${wId}/skills/${wikiSkill.skill_metadata._id}?view=connection`);
  }

  handleCheckinLink = () => {
    const wId = this.props.match.params.wId;
    this.props.history.push(`/${wId}/teamsyncs`);
  };

  handleActivation = (product, sub_skill) => {
    const { checkinSkill, jiraSkill, wikiSkill } = this.state;
    const { updateSkill, updateWorkspace, isWorkspaceAdmin } = this.props;

    if(!isWorkspaceAdmin) {
      return message.warning(this.getErrorMessage());
    }

    if (product === "checkin") {
      Modal.confirm({
        title: 'Enable Check-in',
        content: 'This action will activate Check-in and let you create a new Check-in if there is none.',
        okText: 'Proceed',
        onOk: () => {
          updateSkill(checkinSkill.skill_metadata._id, this.props.match.params.wId, { disabled: false }).then(res => {
            if (res.data.success) {
              updateWorkspace(this.props.match.params.wId, "", { disableCheckins: false }).then(res => {
                if (res.data.success) {
                  this.setState({
                    checkinActivation: true,
                  })
                  this.checkinPercentage();
                }
              })
            }
          })
        }
      })
    } else if (product === 'jiraProject' || product === 'jiraHelpdesk' || product === 'jiraReport') {
      Modal.confirm({
        title: 'Connect Jira',
        content: product === 'jiraProject' ? 'This action will activate Projects and let you connect to Jira if not already connected.' : `This action will activate ${jiraSkill && jiraSkill.skill_metadata.disabled ? 'Projects, ' : ''} ${product === 'jiraHelpdesk' ? 'HelpDesk' : 'Reports'} ${!jiraSkill.skill_metadata.linked ? ' and let you connect to Jira if not already connected.' : '.'}`,
        okText: 'Proceed',
        onOk: () => {
          let data = {}
          if (product === 'jiraProject' || product === 'jiraHelpdesk' || product === 'jiraReport') {
            let temp = [...jiraSkill.skill_metadata.sub_skills]
            temp = temp.map(s => {
              if (s.key === sub_skill.key) {
                s.disabled = !sub_skill.disabled
                return s
              } else return s
            })
            data.sub_skills = [...temp]
            updateSkill(jiraSkill.skill_metadata._id, this.props.match.params.wId, data).then(res => {
              if (res.data.success) {
                this.setState({
                  projectActivation: !this.state.project.disabled,
                  helpdeskActivation: !this.state.helpdesk.disabled,
                  reportActivation: !this.state.report.disabled,
                })
                this.projectPercentage();
                this.helpdeskPercentage();
                this.reportPercentage();
              }
            })
          }
        }
      })
    } else if (product === "wiki") {
      Modal.confirm({
        title: 'Connect Confluence',
        content: 'This action will activate Wiki and let you connect to Confluence if not already connected.',
        okText: 'Proceed',
        onOk: () => {
          updateSkill(wikiSkill.skill_metadata._id, this.props.match.params.wId, { disabled: false }).then(res => {
            if (res.data.success) {
              this.setState({
                wikiActivation: true,
              })
              this.wikiPercentage();
            }
          })
        }
      })
    }
  }

  handleSlackModal = (type) => {
    let content = "";

    if (type === "issue" || type === "ticket") {
      content = (
        <>
          There are many ways you can create a Jira {type} in slack. Some of the ways are: <br /> <br />
          1. Type the jira {type} in this format: /t create [summary] +[fieldName]:[fieldValue] <br /> <br />
          2. Type the {type} summary in the slack channel. Hover your mouse over the message and click on the 3 dots that appear on top of the
          message. Select task it. Fill up the modal that appears. <br /> <br />
          3. In the slack channel, type in the jira {type} summary. Hover your mouse on the {type} summary that you just typed in and select the
          'Ticket' emoji. Fill up the modal that appears.
        </>
      );
    } else if(type === 'automatic_answer') {
      content = 'Troopr allows you to search Confluence docs from Slack. Go to the wiki configured slack channel. Enter a keyword to get related Confluence document(s).'
    } else if (type === 'wiki_artical') {
      content = 'Enter the question or the keyword in the wiki configured slack channel to get the specific article from Confluence.'
    }

    Modal.confirm({
      title: "Open Slack",
      content,
      okText: "Open Slack",
      onOk: () => {
        const app = localStorage.getItem("app") || "AE4FF42BA";
        const teamId = localStorage.getItem("teamId");
        let slackurl = `https://slack.com/app_redirect?app=${app}&team=${teamId}`;
        window.open(slackurl, "_blank");
      },
    });
  };

  getErrorMessage = () => {
    const { members } = this.props;
    let adminNames = "Contact one of the workspace admins to enable this product: ";

    const allWorkspaceAdmins = members && members.filter((member) => member.role === "admin");

    if (allWorkspaceAdmins && allWorkspaceAdmins.length > 0) {
      allWorkspaceAdmins.forEach((admin, index) => {
        if (index < 3) {
          adminNames = adminNames + `${admin.user_id.displayName || admin.user_id.name} `;
        }
      });

      if (allWorkspaceAdmins.length > 3) adminNames = adminNames + ` and ${allWorkspaceAdmins.length - 3} others`;
    }

    return adminNames;
  };

  render() {
    const { checkinLoading ,loading, newStandupModalVisible, supportChannel, jiraTicket, agentChannel, checkinActivation, myCheckinsCount, answerCount, projectChannel, jiraIssue, isJiraConnected, wikiActivation, isWikiConnected, automaticAnswer, confluenceArticle, wikiChannel, channelReport, personalReport } = this.state;

    const title = {
      checkin: this.state.checkinSkill.name,
      project: this.state.project.name,
      helpdesk: this.state.helpdesk.name,
      report: this.state.report.name,
      wiki: this.state.wikiSkill.name
    }

    return (
      <>
        <Layout /* style={{ marginLeft: 250 }} */>
          <Content style={{ height: '100vh', padding: '10px 16px 32px 24px', overflow: 'auto' }}>
            <PageHeader
              title="Quick ways to get started"
              style={{paddingLeft : 0}}
            />
            <Row gutter={[16, 16]}>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                lg={{ span: 12 }}
                xxl={{ span: 8 }}
              >
                <Card
                  title={
                    <span>
                      <Avatar
                        style={{
                          backgroundColor: '#402e96',
                          margin: '0px 8px 0px 0px',
                        }}
                        size="small"
                        icon={<CheckCircleOutlined />}
                      />
                      {title.checkin}
                    </span>
                  }
                  style={{ minWidth: 300, height: '100%' }}
                  loading={checkinLoading}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text style={{ margin: '0px 0px 8px 0px' }} type="secondary">
                      {productDetails.checkIn.description}
                    </Text>
                    <Progress
                      type="circle"
                      percent={this.state.checkinPercentage}
                      // width={80}
                      style={{ margin: 8 }}
                    />
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'baseline',
                      }}
                    >
                      <Button
                        type="link"
                        size="small"
                        style={{ margin: '8px 0px 4px' }}
                        onClick={() => this.handleActivation("checkin")}
                        icon={checkinActivation && <CheckOutlined />}
                        disabled={checkinActivation ? true : false}
                      >
                        Step 1. Activate the product
                      </Button>
                      <Button
                        type="link"
                        size="small"
                        style={{ margin: '8px 0px 4px' }}
                        onClick={() => this.toggleNewStandupModal()}
                        icon={checkinActivation && myCheckinsCount > 0 && <CheckOutlined />}
                        disabled={!checkinActivation || myCheckinsCount > 0 ? true : false}
                      >
                        Step 2. Setup first Check-in
                      </Button>
                      <Button
                        type="link"
                        size="small"
                        style={{ margin: '8px 0px 4px' }}
                        onClick={() => this.handleCheckinLink()}
                        icon={checkinActivation && myCheckinsCount > 0 && answerCount > 0 && <CheckOutlined />}
                        disabled={!checkinActivation || myCheckinsCount === 0 || answerCount > 0 ? true : false}
                      >
                        Step 3. Submit first Check-in Answer
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                lg={{ span: 12 }}
                xxl={{ span: 8 }}
              >
                <Card
                  title={
                    <span>
                      <Avatar
                        style={{
                          backgroundColor: '#402e96',
                          margin: '0px 8px 0px 0px',
                        }}
                        size="small"
                        icon={<ProjectOutlined />}
                      />
                      {title.project}
                    </span>
                  }
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
                    <Text style={{ margin: '0px 0px 8px 0px' }} type="secondary">
                      {productDetails.project.description}
                    </Text>
                    <Progress
                      type="circle"
                      percent={this.state.projectPercentage}
                      // width={80}
                      style={{ margin: 8 }}
                    />
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'baseline',
                      }}
                    >
                      <Button
                        type="link"
                        size="small"
                        style={{ margin: '8px 0px 4px' }}
                        onClick={() => this.handleActivation("jiraProject", this.state.project)}
                        icon={this.state.projectActivation && <CheckOutlined />}
                        disabled={this.state.projectActivation ? true : false}
                      >
                        Step 1. Activate the product
                      </Button>
                      <Button
                        type="link"
                        size="small"
                        style={{ margin: '8px 0px 4px' }}
                        onClick={() => this.handleJiraConnection()}
                        icon={isJiraConnected && this.state.projectActivation && <CheckOutlined />}
                        disabled={!this.state.projectActivation || isJiraConnected ? true : false}
                      >
                        Step 2. Connect Jira Software
                      </Button>
                      <Button
                        type="link"
                        size="small"
                        style={{ margin: '8px 0px 4px' }}
                        onClick={() => this.handleChannelLinks("projectChannel")}
                        icon={this.state.projectActivation && isJiraConnected && projectChannel && <CheckOutlined />}
                        disabled={!this.state.projectActivation || !isJiraConnected || projectChannel ? true : false}
                      >
                        Step 3. Setup first Project Channel
                      </Button>
                      <Button
                        type="link"
                        size="small"
                        style={{ margin: '8px 0px 4px' }}
                        onClick={() => this.handleSlackModal('issue')}
                        icon={this.state.projectActivation && isJiraConnected && jiraIssue && <CheckOutlined />}
                        disabled={!this.state.projectActivation || !isJiraConnected || !projectChannel || jiraIssue ? true : false}
                      >
                        Step 4. Create first Jira issue
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                lg={{ span: 12 }}
                xxl={{ span: 8 }}
              >
                <Card
                  // size="small"
                  title={
                    <span>
                      <Avatar
                        style={{
                          backgroundColor: '#402e96',
                          margin: '0px 8px 0px 0px',
                        }}
                        // size="large"
                        icon={<QuestionCircleOutlined />}
                      />
                      {title.helpdesk}
                    </span>
                  }
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
                    <Text style={{ margin: '0px 0px 8px 0px' }} type="secondary">
                      {productDetails.helpDesk.description}
                    </Text>
                    <Progress
                      type="circle"
                      percent={this.state.helpdeskPercentage}
                      // width={80}
                      style={{ margin: 8 }}
                    />
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'baseline',
                      }}
                    >
                      <Button
                        type="link"
                        size="small"
                        style={{ margin: '8px 0px 4px' }}
                        onClick={() => this.handleActivation("jiraHelpdesk", this.state.helpdesk)}
                        icon={this.state.helpdeskActivation && <CheckOutlined />}
                        disabled={this.state.helpdeskActivation ? true : false}
                      >
                        Step 1. Activate the product
                      </Button>
                      <Button
                        type="link"
                        size="small"
                        style={{ margin: '8px 0px 4px' }}
                        onClick={() => this.handleJiraConnection()}
                        icon={isJiraConnected && this.state.helpdeskActivation && <CheckOutlined />}
                        disabled={!this.state.helpdeskActivation || isJiraConnected ? true : false}
                      >
                        Step 2. Connect to Jira Service Management
                      </Button>
                      <Button
                        type="link"
                        size="small"
                        style={{ margin: '8px 0px 4px' }}
                        onClick={() => this.handleChannelLinks("supportChannel")}
                        icon={this.state.helpdeskActivation && isJiraConnected && supportChannel && <CheckOutlined />}
                        disabled={!this.state.helpdeskActivation || !isJiraConnected || supportChannel ? true : false}
                      >
                        Step 3. Setup first Customer Channel
                      </Button>
                      <Button
                        type="link"
                        size="small"
                        style={{ margin: '8px 0px 4px' }}
                        onClick={() => this.handleChannelLinks("agentChannel")}
                        icon={this.state.helpdeskActivation && isJiraConnected && agentChannel && <CheckOutlined />}
                        disabled={!this.state.helpdeskActivation || !isJiraConnected || !supportChannel || agentChannel ? true : false}
                      >
                        Step 4. Setup first Agent Channel
                      </Button>
                      <Button
                        type="link"
                        size="small"
                        style={{ margin: '8px 0px 4px' }}
                        onClick={() => this.handleSlackModal('ticket')}
                        icon={this.state.helpdeskActivation && isJiraConnected && jiraTicket && <CheckOutlined />}
                        disabled={!this.state.helpdeskActivation || !isJiraConnected || !supportChannel || !agentChannel || jiraTicket ? true : false}
                      >
                        Step 5. Create first Jira ticket
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                lg={{ span: 12 }}
                xxl={{ span: 8 }}
              >
                <Card
                  // size="small"
                  style={{ minWidth: 300, height: '100%' }}
                  title={
                    <span>
                      <Avatar
                        style={{
                          backgroundColor: '#402e96',
                          margin: '0px 4px 0px 0px',
                        }}
                        size="small"
                        icon={<BulbOutlined />}
                      />
                      {title.wiki}
                    </span>
                  }
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
                    <Text style={{ margin: '0px 0px 8px 0px' }} type="secondary">
                      {productDetails.wiki.description}
                    </Text>
                    <Progress
                      type="circle"
                      percent={this.state.wikiPercentage}
                      // width={80}
                      style={{ margin: 8 }}
                    />
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'baseline',
                      }}
                    >
                      <Button
                        type="link"
                        size="small"
                        style={{ margin: '8px 0px 4px' }}
                        onClick={() => this.handleActivation("wiki")}
                        icon={wikiActivation && <CheckOutlined />}
                        disabled={wikiActivation ? true : false}
                      >
                        Step 1. Activate the product
                      </Button>
                      <Button
                        type="link"
                        size="small"
                        style={{ margin: '8px 0px 4px' }}
                        onClick={() => this.handleWikiConnection()}
                        icon={wikiActivation && isWikiConnected && <CheckOutlined />}
                        disabled={!wikiActivation || isWikiConnected ? true : false}
                      >
                        Step 2. Connect Confluence
                      </Button>
                      <Button
                        type="link"
                        size="small"
                        style={{ margin: '8px 0px 4px' }}
                        onClick={() => this.handleChannelLinks("wikiChannel")}
                        icon={wikiActivation && isWikiConnected && wikiChannel && <CheckOutlined />}
                        disabled={!wikiActivation || !isWikiConnected || wikiChannel ? true : false}
                      >
                        Step 3. Setup first Wiki Channel
                      </Button>
                      <Button
                        type="link"
                        size="small"
                        style={{ margin: '8px 0px 4px' }}
                        onClick={() => this.handleSlackModal('automatic_answer')}
                        icon={wikiActivation && isWikiConnected && wikiChannel && automaticAnswer && <CheckOutlined />}
                        disabled={!wikiActivation || !isWikiConnected || !wikiChannel || automaticAnswer ? true : false}
                      >
                        Step 4. Get first automatic answer
                      </Button>
                      <Button
                        type="link"
                        size="small"
                        style={{ margin: '8px 0px 4px' }}
                        onClick={() => this.handleSlackModal('wiki_artical')}
                        icon={wikiActivation && isWikiConnected && wikiChannel && automaticAnswer && confluenceArticle && <CheckOutlined />}
                        disabled={!wikiActivation || !isWikiConnected || !wikiChannel || !automaticAnswer || confluenceArticle ? true : false}
                      >
                        Step 5. Search a Confluence article
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                lg={{ span: 12 }}
                xxl={{ span: 8 }}
              >
                <Card
                  // size="small"
                  style={{ minWidth: 300, height: '100%' }}
                  title={
                    <span>
                      {' '}
                      <Avatar
                        style={{
                          backgroundColor: '#402e96',
                          margin: '0px 4px 0px 0px',
                        }}
                        size="small"
                        icon={<PieChartOutlined />}
                      />
                      {title.report}
                    </span>
                  }
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
                    <Text style={{ margin: '0px 0px 8px 0px' }} type="secondary">
                      {productDetails.report.description}
                    </Text>
                    <Progress
                      type="circle"
                      percent={this.state.reportPercentage}
                      // width={80}
                      style={{ margin: 8 }}
                    />
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'baseline',
                      }}
                    >
                      <Button
                        type="link"
                        size="small"
                        style={{ margin: '8px 0px 4px' }}
                        onClick={() => this.handleActivation("jiraReport", this.state.report)}
                        icon={this.state.reportActivation && <CheckOutlined />}
                        disabled={this.state.reportActivation ? true : false}
                      >
                        Step 1. Activate the product
                      </Button>
                      <Button
                        type="link"
                        size="small"
                        style={{ margin: '8px 0px 4px' }}
                        onClick={() => this.handleJiraConnection()}
                        icon={isJiraConnected && this.state.reportActivation && <CheckOutlined />}
                        disabled={!this.state.reportActivation || isJiraConnected ? true : false}
                      >
                        Step 2. Connect Jira
                      </Button>
                      <Button
                        type="link"
                        size="small"
                        style={{ margin: '8px 0px 4px' }}
                        onClick={() => this.handleChannelLinks("channelReport")}
                        icon={this.state.reportActivation && isJiraConnected && channelReport && <CheckOutlined />}
                        disabled={this.state.report.disabled || !isJiraConnected || channelReport ? true : false}
                      >
                        Step 3. Setup first Channel Report
                      </Button>
                      <Button
                        type="link"
                        size="small"
                        style={{ margin: '8px 0px 4px' }}
                        // onClick={() => this.handleSlackModal()}
                        onClick={() => this.handleChannelLinks("personalReport")}
                        icon={this.state.reportActivation && isJiraConnected && personalReport && <CheckOutlined />}
                        disabled={this.state.report.disabled || !isJiraConnected || !channelReport || personalReport ? true : false}
                      >
                        Step 4. Setup first Personal Report
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </Content>

          {newStandupModalVisible && <CreateTeamsyncModal
            newStandupModalVisible={newStandupModalVisible}
            modalToggle={this.toggleNewStandupModal}
            // https://stackoverflow.com/questions/37949981/call-child-method-from-parent
            setClick={(click) => (this.clickChild = click)}

          //whenever you add something here check in allstandups,standupReport,sidenavbar files too
          />}
        </Layout>
      </>
    );
  }
}

const mapStateToProps = state => ({
  skills: state.skills.skills,
  isWorkspaceAdmin: state.common_reducer.isAdmin,
  members: state.skills.members,
  user_now: state.common_reducer.user,
  team: state.skills.team,
});

export default withRouter(connect(mapStateToProps, {
  updateSkill,
  updateWorkspace
})(GettingStarted));
