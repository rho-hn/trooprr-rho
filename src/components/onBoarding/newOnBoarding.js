import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { getTeamData, updateWorkspace, getSkillConnectUrl, setJiraConnectId, updateSkill } from "../skills/skills_action";
import { withRouter } from "react-router-dom";
import { QuestionCircleOutlined, ProjectOutlined, BulbOutlined, PieChartOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Modal, Button, Col, Row, Typography, Menu, Dropdown, message, List, Avatar, Switch } from "antd";
import queryString from "query-string";
import { ThemeProvider /* , useTheme */ } from "antd-theme";
import { productDetails } from "utils/productDetails";

// import {sendWelcomeMessageToUser} from '../common/common_action'

const { Text, Title } = Typography;

const Theme = () => {
  let initialTheme = {
    name: "default",
    // variables: { 'primary-color': '#664af0' }
    variables: { "primary-color": localStorage.getItem("theme") == "dark" ? "#664af0" : "#402E96" },
  };

  const [theme, setTheme] = React.useState(initialTheme);
  return (
    <ThemeProvider
      theme={theme}
      onChange={(value) => {
        setTheme(value);
      }}
    ></ThemeProvider>
  );
};
class NewOnBoarding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      assisant_name: "",
      step: "personalize",
      sId: "",
      defaultTool: "",
      sendWelcomeMessage: false,
      TrooprProjectSkillId: "",
      squadsToggleLoading: false,
      githubToggleLoading: false,
      jiraToggleLoading: false,
      teamSyncToggleLoading: false,
      type: false,
      isAdminApiLoading: true,
      selectedProducts: ["jiraprojects", "helpdesk", "jirareports", "wiki", "checkin"],
      isAdmin: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeStep = this.changeStep.bind(this);
    this.setDefault = this.setDefault.bind(this);
  }

  componentDidMount() {
    // this.props.SkillsAction(this.props.match.params.wId);
    let skill = axios.get("/bot/workspace/" + this.props.match.params.wId + "/assistant_skills");
    let isAdmin = axios.get(`/api/${this.props.match.params.wId}/isAdmin`);
    Promise.all([skill, isAdmin]).then((data) => {
      data[0].data.skills.forEach((skill) => {
        if (skill.name == "Troopr") {
          this.setState({ TrooprProjectSkillId: skill._id });
        }
      });

      if (data[1] && data[1].data.success && data[1].data.isAdmin) this.setState({ isAdmin: data[1].data.isAdmin, isAdminApiLoading: false });
    });

    if (!this.props.teamId.id) {
      this.props.getTeamData(this.props.match.params.wId).then((res) => {
        localStorage.setItem("teamId", res.data.teamId);
      });
    }
    const parsedQueryString = queryString.parse(window.location.search);
    if (parsedQueryString.view) {
      this.setState({ step: parsedQueryString.view, sId: parsedQueryString.sId });
    } else {
      //  this.setState({ step:'personalize'})
    }

    //select radio button depending pn where user comes from
    let type = this.props.location.pathname.split("/")[3];
    this.setState({ type });
    if (type == "team_mood" || type == "retro" || type == "planning_poker" || type == "checkin" || type === 'instant-poker') {
      this.setState({ type, selectedProducts: ["checkin"] });
    } else if (type == "jira_slack_int") {
      this.setState({ selectedProducts: ["jiraprojects"] });
    } else if (type === "jsi_wiki_na") {
      this.setState({ selectedProducts: ["wiki"] });
    }
  }

  componentDidUpdate(prevProps) {
    const parsedQueryString = queryString.parse(window.location.search);
    if (parsedQueryString.view) {
      if (prevProps.location.search != window.location.search) {
        if (this.state.step != parsedQueryString.view) {
          this.setState({ step: parsedQueryString.view });
        }
      }
    } else {
      this.changeStep("personalize");
    }
  }

  setDefault(name) {
    let data = { default: true };
    axios.put("/bot/api/workspace/" + this.props.match.params.wId + "/assistant_skills/" + name + "?type=onbaording", data).then((res) => {
      if (res.data.success) {
        this.changeStep("show_success");
        this.setState({ defaultTool: name, sId: res.data.skill._id });
      } else {
      }
    });
  }
  // connectUrl = () => {
  //   this.setState({ loading: true });
  //   axios.get("/bot/api/workspace/" + this.props.match.params.wId + "/jiraSkill").then((res) => {
  //     // if(res.data.skill &&)
  //     let skill = res.data.skill;
  //     if (skill && skill.metadata && skill.metadata.token_obj) {
  //       this.setState({ loading: false });
  //       // this.props.history.push("/"+this.props.match.params.wId+"/skills/"+res.data.skill._id)
  //       this.props.history.push("/" + this.props.match.params.wId + "/skills/" + res.data.skill._id);
  //     } else {
  //       // this.props.history.push("/"+this.props.match.params.wId+"/jira_domain_oauth?source=teamsync")
  //       this.props.history.push("/" + this.props.match.params.wId + "/jira_domain_oauth?source=teamsync");
  //     }
  //   });
  // };
  handleChange(event) {
    this.setState({ assisant_name: event.target.value });
  }
  handleSubmit() {
    let data = { assisantName: this.state.assisant_name };

    axios.put("/bot/api/workspace/" + this.props.match.params.wId + "/team", data).then((res) => {
      if (res.data.success) {
        this.changeStep("project_management_tool");
      } else {
      }
    });
  }

  // goToReport = () => {
  //   this.props.history.push("/" + this.props.match.params.wId + "/reports");
  // };

  // goToSquads = () => {
  //   this.props.history.push(`/${this.props.match.params.wId}/squads`);
  // };

  // goToJira = () => {
  //   let JiraSkillId;
  //   this.props.skills &&
  //     this.props.skills.map((value) => {
  //       if (value.name == "Jira") {
  //         JiraSkillId = value.skill_metadata._id;
  //       }
  //     });
  //   JiraSkillId && this.props.history.push("/" + this.props.match.params.wId + "/skills/" + JiraSkillId);
  // };

  //   enableWikiAndRedirectToWiki = () => {
  //     const { skills, updateSkill, updateWorkspace } = this.props;
  //     const jiraSkill = skills.find((skill) => skill.name === "Jira");
  //     let checkinSkill = skills.find((skill) => skill.name === "Troopr Standups" || skill.name == "Check-ins" || skill.name == "Standups");
  //     const jira_skill_id = jiraSkill.skill_metadata._id;
  //     let wikiSkillId;
  //     this.props.skills &&
  //       this.props.skills.map((value) => {
  //         if (value.name == "Wiki") {
  //           wikiSkillId = value.skill_metadata._id;
  //         }
  //       });
  //     if (wikiSkillId) {
  //       /* enabling wiki */
  //       updateSkill(wikiSkillId, this.props.match.params.wId, { disabled: false }).then((res) => {
  //         if (res.data && res.data.success) {
  //           const url = `${window.location.origin}/${this.props.match.params.wId}/skills/${wikiSkillId}`;
  //           window.open(url, "_self");
  //         } else {
  //           message.error("Error enabling wiki integration");
  //           this.props.history.push(`/${this.props.match.params.wId}/dasboard`);
  //         }
  //       });

  //       /* enabling jira projects and checki ins */
  //       const checkinSkill = skills.find((skill) => skill.name === "Troopr Standups" || skill.name == "Check-ins" || skill.name == "Standups");
  //       const data = { disabled: false };
  //       updateSkill(jira_skill_id, this.props.match.params.wId, data);
  //       if (checkinSkill && checkinSkill.skill_metadata) {
  //         updateSkill(checkinSkill.skill_metadata._id, this.props.match.params.wId, { disabled: false });
  //       }
  //       updateWorkspace(this.props.match.params.wId, "", { disableCheckins: false });
  //     } else {
  //       message.error("Error enabling wiki integration");
  //       this.props.history.push(`/${this.props.match.params.wId}/dasboard`);
  //     }
  //   };

  // goToGitHub = () => {
  //   let GithubSkillId;
  //   this.props.skills &&
  //     this.props.skills.map((value) => {
  //       if (value.name == "GitHub") {
  //         GithubSkillId = value.skill_metadata._id;
  //       }
  //     });
  //   GithubSkillId && this.props.history.push("/" + this.props.match.params.wId + "/skills/" + GithubSkillId);
  // };

  changeStep(step, sId) {
    let path = window.location.pathname;
    let obj = {
      title: step,
      url: path + `?view=${step}`,
    };
    if (sId) {
      obj.url = obj.url + "&sId=" + sId;
    }
    window.history.pushState(obj, obj.title, obj.url);

    this.setState({ step: step, sId: sId });
  }

  redirecToDashboard = () => {
    this.props.history.push(`/${this.props.match.params.wId}/dashboard`);
  };

  redirect_to_all_checkins = ({ create_new }) => {
    const url = `${window.location.origin}/${this.props.match.params.wId}/teamsyncs/templates${create_new ? "/new_team_mood_anonymous" : ""}`;
    window.open(url, "_self");
    // this.props.history.push(`/${this.props.match.params.wId}/teamsyncs/templates${create_new ? '/new_team_mood_anonymous' : ''}`)
  };

  onFeatureToggle = (check, feature) => {
    const { defaultSkill } = this.props;
    if (feature === "squads") {
      this.setState({ squadsToggleLoading: true });
      this.props.updateWorkspace(this.props.match.params.wId, "", { showSquads: check }).then((res) => {
        this.setState({ squadsToggleLoading: false });
      });
    } else {
      this.setState({ githubToggleLoading: true });
      this.props.updateWorkspace(this.props.match.params.wId, "", { showGithub: check }).then((res) => {
        this.setState({ githubToggleLoading: false });
      });
    }
  };

  redirect_to_moodcheckin = () => {
    this.props.history.push(`/${this.props.match.params.wId}/teamsyncs/templates/new_team_mood`);
  };
  redirect_to_retrocheckin = () => {
    const url = `${window.location.origin}/${this.props.match.params.wId}/teamsyncs/templates/new_retro_anonymous`;
    window.open(url, "_self");
    // anonymous?this.props.history.push(`/${this.props.match.params.wId}/teamsyncs/templates/new_retro_anonymous`):this.props.history.push(`/${this.props.match.params.wId}/teamsyncs/templates/new_retro`)
  };
  redirect_to_planning_poker = () => {
    const url = `${window.location.origin}/${this.props.match.params.wId}/teamsyncs/templates/new_planning_poker`;
    window.open(url, "_self");
  };
  redirect_to_instant_planning_poker = () => {
    const url = `${window.location.origin}/${this.props.match.params.wId}/teamsyncs/templates/new_instant_planning_poker`;
    window.open(url, "_self");
  };
  // getOnBoardingButtons = () => {
  //   //console.info("getOnboardingButtons()");
  //   const { location, workspace } = this.props;
  //   const type = location.pathname.split("/")[3];

  //   if (type) {
  //     if (type === "team_mood") {
  //       return (
  //         <>
  //           <Button style={{ marginRight: 0 }} type='primary' onClick={() => this.redirect_to_all_checkins({ create_new: true })}>
  //             {"Create new Team Mood Anonymous Check-in"}
  //           </Button>
  //           <br />
  //           <br />
  //           <Button onClick={() => this.redirect_to_moodcheckin()}>Create new Team Mood Non-Anonymous Check-in</Button>
  //           <br />
  //           <br />
  //           <Button onClick={() => this.redirecToDashboard()}>Let me play around</Button>
  //         </>
  //       );
  //     } else if (type === "retro") {
  //       return (
  //         <>
  //           <Button style={{ marginRight: 0 }} type='primary' onClick={() => this.redirect_to_retrocheckin({ anonymous: true })}>
  //             {"Create new Retrospective Anonymous Check-in"}
  //           </Button>
  //           <br />
  //           <br />
  //           <Button onClick={() => this.redirect_to_retrocheckin({ anonymous: false })}>Create new Retrospective Non-Anonymous Check-in</Button>
  //           <br />
  //           <br />
  //           <Button onClick={() => this.redirecToDashboard()}>Let me play around</Button>
  //         </>
  //       );
  //     } else {
  //       return (
  //         <>
  //           <Button style={{ marginRight: 0 }} type='primary' onClick={() => this.redirect_to_all_checkins({ create_new: false })}>
  //             {"Create new Check-in"}
  //           </Button>
  //           <br />
  //           <br />
  //           <Button onClick={() => this.redirecToDashboard()}>Let me play around</Button>
  //         </>
  //       );
  //     }
  //   } else {
  //     return (
  //       <Button type='primary' onClick={() => this.redirecToDashboard()}>
  //         Let's get started
  //       </Button>
  //     );
  //   }
  // };
  content_checkin = (
    <div>
      <div>Run Standups, Retrospectives as async Check-ins in Slack</div>
      <div>Run Jira based Planning Poker, Task Check-in</div>
      <div>Run Team mood survey and many more async Check-ins in Slack</div>
    </div>
  );

  content_jira = (
    <div>
      <div>Manage Jira Software projects in Slack</div>
      <div>Manage Jira Service Desk projects in Slack</div>
      <div>Share Jira Reports in Slack</div>
    </div>
  );
  radioStyle = {
    display: "block",
    height: "30px",
    lineHeight: "30px",
  };
  menu = () => {
    const { step } = this.state;
    return (
      <Menu>
        <Menu.Item key='cloud'>
          <a onClick={this.connectJiraWikiCloud}>New {step === "setup_wiki" ? "Wiki" : "Jira"} Cloud Connection</a>
        </Menu.Item>

        <Menu.Item key='server'>
          <a onClick={this.jiraWikioauthConnectionPage}>New {step === "setup_wiki" ? "Wiki" : "Jira"} Server/Data Center Connection</a>
        </Menu.Item>
      </Menu>
    );
  };
  connectJiraWikiCloud = () => {
    const { step, selectedProducts } = this.state;
    const skill = this.props.skills.find((skill) => ((skill.name == step) === "setup_wiki" ? "Wiki" : "Jira"));
    let sub_skill = "";
    if (selectedProducts[0] === "jiraprojects") sub_skill = "jira_software";
    else if (selectedProducts[0] === "helpdesk") sub_skill = "jira_service_desk";
    else if (selectedProducts[0] === "jirareports") sub_skill = "jira_reports";
    const url = `${window.location.origin}/${this.props.match.params.wId}/${step === "setup_wiki" ? "wikiOuath" : "jiraoauthCloud"}/${
      skill.skill_metadata._id
    }/0${step === "setup_wiki" ? "?connection_type=cloud" : ""}${skill.key === "jira" ? `?sub_skill=${sub_skill}` : ""}`;
    window.open(url, "_self");
  };

  jiraWikioauthConnectionPage = () => {
    const { step, selectedProducts } = this.state;
    const skill = this.props.skills.find((skill) => ((skill.name == step) === "setup_wiki" ? "Wiki" : "Jira"));
    let sub_skill = "";
    if (selectedProducts[0] === "jiraprojects") sub_skill = "jira_software";
    else if (selectedProducts[0] === "helpdesk") sub_skill = "jira_service_desk";
    else if (selectedProducts[0] === "jirareports") sub_skill = "jira_reports";
    const url = `${window.location.origin}/${this.props.match.params.wId}/${step === "setup_wiki" ? "wikiOuath" : "jiraoauthServer"}/${
      skill.skill_metadata._id
    }/0${step === "setup_wiki" ? "?connection_type=cloud" : ""}${skill.key === "jira" ? `?sub_skill=${sub_skill}` : ""}`;
    window.open(url, "_self");
  };

  onRadioSelect = (e) => {
    this.setState({ radioSelected: e.target.value });
  };
  getFullScreenOnboarding = () => {
    return (
      <>
        <div style={{ marginBottom: 32 }}>
          <img
            // src="https://i.ibb.co/3vFPgTg/troopr-logo-animation-black1.gif"
            src='https://app.troopr.io/logo/Circle.png'
            // width="96"
            height='54'
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Title level={2}>Welcome to Troopr</Title>

          <Text>
            <Text strong>Troopr Assistant</Text> app is now installed in your Slack workspace.
          </Text>
          <Button
            style={{ marginTop: 16, marginBottom: 64 }}
            type='primary'
            size='large'
            onClick={() => {
              if (this.state.type) this.onContinue();
              else this.changeStep("options");
            }}
            loading={this.state.isAdminApiLoading}
            disabled={!this.state.isAdmin}
          >
            Let's get started
          </Button>
          <div>
            <Button type='text'>
              <Text type='secondary' onClick={() => window.open('https://www.troopr.ai/tos', '_blank')}>Troopr Terms of Use</Text>
            </Button>
            <Text type='secondary'>|</Text>
            <Button type='text'>
              <Text type='secondary' onClick={() => window.open('https://www.troopr.ai/privacy', '_blank')}>Troopr Privacy Policy</Text>
            </Button>
          </div>
        </div>
      </>
    );
  };

  handleProductSelect = (product, isSelected) => {
    const { selectedProducts } = this.state;

    if (isSelected) {
      this.setState({ selectedProducts: [...selectedProducts, product] });
    } else {
      const temp = [...selectedProducts];
      const index = temp.indexOf(product);
      temp.splice(index, 1);
      this.setState({ selectedProducts: temp });
    }
  };

  getOptionsScreen = () => {
    const { selectedProducts } = this.state;
    const onboarding_products = [
      {
        title: "Check-in",
        key: "checkin",
        desc: productDetails.checkIn.description,
        icon: <CheckCircleOutlined />,
      },
      {
        title: "Project",
        key: "jiraprojects",
        desc: productDetails.project.description,
        icon: <ProjectOutlined />,
      },
      {
        title: "HelpDesk",
        key: "helpdesk",
        desc: productDetails.helpDesk.description,
        icon: <QuestionCircleOutlined />,
      },
      {
        title: "Wiki",
        key: "wiki",
        desc: productDetails.wiki.description,
        icon: <BulbOutlined />,
      },
      {
        title: "Report",
        key: "jirareports",
        desc: productDetails.report.description,
        icon: <PieChartOutlined />,
      },
    ];

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Title level={3}>What do like to use Troopr for?</Title>

        <Text>This will personalize Troopr experience for your team members.</Text>

        <List
          size='small'
          style={{ margin: 32, width: "100%" }}
          itemLayout='horizontal'
          dataSource={onboarding_products}
          renderItem={(item) => (
            <List.Item actions={[]}>
              <List.Item.Meta avatar={<Avatar icon={item.icon} />} title={item.title} description={item.desc} />
              <Switch
                checked={selectedProducts.includes(item.key) ? true : false}
                onChange={(checked) => this.handleProductSelect(item.key, checked)}
              />
            </List.Item>
          )}
        />

        <Button
          style={{ marginTop: 16 }}
          type='primary'
          size='large'
          onClick={() => {
            this.onContinue();
          }}
          loading={this.state.apiCallsLoading || this.state.isAdminApiLoading}
          disabled={!this.state.isAdmin}
        >
          Continue
        </Button>
      </div>
    );
  };

  onContinue = () => {
    //based on selected radio button enable/disable feature and go to next screen
    const { skills, updateSkill, updateWorkspace } = this.props;
    const { selectedProducts } = this.state;
    let promiseArr = [];

    if (selectedProducts.length > 0) {
      /* enabing the skills */

      /*       if (selectedProducts.includes("jiraprojects") || selectedProducts.includes("jirareports") || selectedProducts.includes("helpdesk")) {
        let data = { disabled: false };

        if (selectedProducts.includes("jirareports")) data.isJiraReportsEnabled = true;
        if (selectedProducts.includes("helpdesk")) data.isServiceDeskEnabled = true;

        const jiraSkill = skills.find((skill) => skill.name === "Jira");
        if (jiraSkill && jiraSkill.skill_metadata && jiraSkill.skill_metadata._id)
          updateSkill(jiraSkill.skill_metadata._id, this.props.match.params.wId, data);
        else message.error("Error enabling jira skill");
      }

      if (selectedProducts.includes("checkin")) {
        const checkinSkill = skills.find((skill) => skill.name === "Troopr Standups" || skill.name == "Check-ins" || skill.name == "Standups");

        if (checkinSkill && checkinSkill.skill_metadata && checkinSkill.skill_metadata._id){
          updateSkill(checkinSkill.skill_metadata._id, this.props.match.params.wId, { disabled: false });
        }
        else message.error("Error enabling checkin skill");
      } else {
        updateWorkspace(this.props.match.params.wId, "", { disableCheckins: true })
      }

      if (selectedProducts.includes("wiki")) {
        const wikiSkill = skills.find((skill) => skill.name === "Wiki");
        if (wikiSkill && wikiSkill.skill_metadata && wikiSkill.skill_metadata._id)
          updateSkill(wikiSkill.skill_metadata._id, this.props.match.params.wId, { disabled: false });
        else message.error("Error enabling wiki skill");
      } */

      if (!selectedProducts.includes("checkin")) {
        const checkinSkill = skills.find(
          (skill) => skill.key === "standups" || skill.name === "Troopr Standups" || skill.name == "Check-ins" || skill.name == "Standups"
        );
        if (checkinSkill && checkinSkill.skill_metadata && checkinSkill.skill_metadata._id) {
          promiseArr.push(updateSkill(checkinSkill.skill_metadata._id, this.props.match.params.wId, { disabled: true }));
          // updateSkill(checkinSkill.skill_metadata._id, this.props.match.params.wId, { disabled: true });
        }

        updateWorkspace(this.props.match.params.wId, "", { disableCheckins: true });
      }
      if (!selectedProducts.includes("wiki")) {
        const wikiSkill = skills.find((skill) => skill.key === "wiki");
        if (wikiSkill && wikiSkill.skill_metadata && wikiSkill.skill_metadata._id)
          promiseArr.push(updateSkill(wikiSkill.skill_metadata._id, this.props.match.params.wId, { disabled: true }));
        // updateSkill(wikiSkill.skill_metadata._id, this.props.match.params.wId, { disabled: true });
      }

      if (!selectedProducts.includes("jiraprojects") || !selectedProducts.includes("jirareports") || !selectedProducts.includes("helpdesk")) {
        const jiraSkill = skills.find((skill) => skill.name === "Jira");
        if (jiraSkill && jiraSkill.skill_metadata && jiraSkill.skill_metadata._id) {
          let temp = [...jiraSkill.skill_metadata.sub_skills];
          let jira_software = temp.find((s) => s.key === "jira_software");
          let jira_service_desk = temp.find((s) => s.key === "jira_service_desk");
          let jira_reports = temp.find((s) => s.key === "jira_reports");

          if (!selectedProducts.includes("jiraprojects")) jira_software.disabled = true;
          if (!selectedProducts.includes("jirareports")) jira_reports.disabled = true;
          if (!selectedProducts.includes("helpdesk")) jira_service_desk.disabled = true;

          temp = [jira_software, jira_service_desk, jira_reports];
          // updateSkill(jiraSkill.skill_metadata._id, this.props.match.params.wId, {sub_skills : temp});
          promiseArr.push(updateSkill(jiraSkill.skill_metadata._id, this.props.match.params.wId, { sub_skills: temp }));
        }
      }

      // if (!selectedProducts.includes("jiraprojects")) {
      //   let data = { disabled: true };
      //   if (!selectedProducts.includes("jirareports")) data.isJiraReportsDisabled = true;
      //   if (!selectedProducts.includes("helpdesk")) data.isServiceDeskEnabled = false;

      //   const jiraSkill = skills.find((skill) => skill.name === "Jira");
      //   if (jiraSkill && jiraSkill.skill_metadata && jiraSkill.skill_metadata._id)
      //     updateSkill(jiraSkill.skill_metadata._id, this.props.match.params.wId, data);
      // } else if (!selectedProducts.includes("jirareports") || !selectedProducts.includes("helpdesk")) {
      //   let data = {};
      //   if (!selectedProducts.includes("jirareports")) data.isJiraReportsDisabled = false;
      //   if (!selectedProducts.includes("helpdesk")) data.isServiceDeskEnabled = false;

      //   const jiraSkill = skills.find((skill) => skill.name === "Jira");
      //   if (jiraSkill && jiraSkill.skill_metadata && jiraSkill.skill_metadata._id)
      //     updateSkill(jiraSkill.skill_metadata._id, this.props.match.params.wId, data);
      // }
      this.setState({ apiCallsLoading: true });
      Promise.all(promiseArr).then((res) => {
        /* redirecting to next screen */
        this.setState({ apiCallsLoading: false });
        if (selectedProducts.length === 1) {
          if (selectedProducts.includes("checkin")) this.changeStep("setup_checkin");
          else if (selectedProducts.includes("wiki")) this.changeStep("setup_wiki");
          else if (selectedProducts.includes("jiraprojects") || selectedProducts.includes("jirareports") || selectedProducts.includes("helpdesk"))
            this.changeStep("setup_jira");
        } else {
          if (!selectedProducts.includes("wiki") && !selectedProducts.includes("checkin")) this.changeStep("setup_jira");
          else {
            // const url = `${window.location.origin}/${this.props.match.params.wId}/dashboard`;
            const url = `${window.location.origin}/${this.props.match.params.wId}/getting_started`;
            window.open(url, "_self");
          }
        }
      });
    } else message.error("One product must be selected");
  };
  getJiraWikiSetUpScreen = () => {
    const { step } = this.state;
    return (
      <div>
        <Row
          style={{
            /* color: "white" */
            // backgroundColor: "black",
            paddingBottom: 32,
          }}
          justify='center'
        >
          <Col style={{ textAlign: "center" /* , backgroundColor: "black" */ }} span={12}>
            <img
                // src="https://i.ibb.co/3vFPgTg/troopr-logo-animation-black1.gif"
                src='https://app.troopr.io/logo/Circle.png'
                // width="96"
                height='54'
              />
          </Col>
        </Row>

        <Row style={{ /* backgroundColor: "black", */ paddingBottom: 16 }} justify='center'>
          <Col style={{ textAlign: "center" }} span={24}>
            <Typography.Title level={3}>OK, let's get your {step === "setup_wiki" ? "Wiki" : "Jira"} connected</Typography.Title>
          </Col>
          <Col span={24} style={{ textAlign: "center" }}>
            <Typography.Text type='secondary'>
              This will initiate the process to connect Troopr to your {step === "setuo_wiki" ? "Wiki" : "Jira"} account.
            </Typography.Text>
          </Col>
        </Row>
        <Row style={{ /* backgroundColor: "black" */ paddingBottom: 8 }} justify='center'>
          <Col style={{ textAlign: "center" /* backgroundColor: "black" */ }} span={8}>
            <Dropdown overlay={this.menu} trigger={["click"]} placement='bottomLeft'>
              <Button
                block
                type='primary'
                size='large'
                color='#664af0'
                // onClick={() => {
                //   // this.handleCancel();
                // }}
              >
                Connect
              </Button>
            </Dropdown>
            <Button
              block
              type='link'
              size='large'
              onClick={() => {
                // localStorage.setItem("theme" , "default");
                // this.redirecToDashboard()
                const url = `${window.location.origin}/${this.props.match.params.wId}/dashboard`;
                window.open(url, "_self");
              }}
            >
              Skip
            </Button>
          </Col>
        </Row>
      </div>
    );
  };
  getCheckInSetUpScreen = () => {
    return (
      <div>
        <Row
          style={{
            /* color: "white" */
            /* backgroundColor: "black" */
            paddingBottom: 32,
          }}
          justify='center'
        >
          <Col style={{ textAlign: "center" /* backgroundColor: "black" */ }} span={12}>
              <img
                // src="https://i.ibb.co/3vFPgTg/troopr-logo-animation-black1.gif"
                src='https://app.troopr.io/logo/Circle.png'
                // width="96"
                height='54'
              />
          </Col>
        </Row>

        <Row style={{ /* backgroundColor: "black" */ paddingBottom: 16 }} justify='center'>
          <Col style={{ textAlign: "center" }} span={24}>
            <Typography.Title level={3}>OK, let's setup the first Check-in for your team</Typography.Title>
          </Col>
          <Col span={24} style={{ textAlign: "center" }}>
            <Typography.Text type='secondary'>
              You can create a new
              {this.state.type == "team_mood"
                ? " Team Mood "
                : this.state.type == "retro"
                ? " Retrospective "
                : this.state.type == "instant-poker"
                ? " Instant planning poker"
                : this.state.type == "planning_poker"
                ? " Planning Poker "
                : ""}{" "}
              Check-in here or in Slack.
            </Typography.Text>
          </Col>
        </Row>
        <Row style={{ /* backgroundColor: "black" */ paddingBottom: 8 }} justify='center'>
          <Col style={{ textAlign: "center" /* backgroundColor: "black" */ }} span={8}>
            <Button
              block
              type='primary'
              size='large'
              color='#664af0'
              onClick={() => {
                const { type } = this.state;
                //console.info("type",type)
                // localStorage.setItem("theme" , "default");
                if (type == "team_mood") {
                  this.redirect_to_all_checkins({ create_new: true });
                } else if (type == "retro") {
                  this.redirect_to_retrocheckin({ anonymous: true });
                } else if (type == "planning_poker") {
                  this.redirect_to_planning_poker();
                } else if (type == "instant-poker") {
                  this.redirect_to_instant_planning_poker();
                } else {
                  this.redirect_to_all_checkins({ create_new: false });
                }
              }}
            >
              Continue here
            </Button>

            {/* <div style={{ padding: 8 }} /> */}
          </Col>
          <Button
            block
            type='link'
            size='large'
            target='_blank'
            href={`https://slack.com/app_redirect?app=${localStorage.getItem("app") || "AE4FF42BA"}&team=${this.props.teamId.id}`}
          >
            Go to Troopr in Slack
          </Button>
        </Row>
      </div>
    );
  };
  // getSetUpScreen = () => {
  //   return (
  //     <>
  //       <Row
  //         style={{
  //           /* color: "white" */,
  //           /* backgroundColor: "black" */,
  //           paddingBottom: 32,
  //         }}
  //         justify='center'
  //       >
  //         <Col style={{ textAlign: "center", backgroundColor: "black" }} span={12}>
  //           <img src='https://app.troopr.io/logo/troopr-logo-animation-black.gif' width='96' height='54' />
  //         </Col>
  //       </Row>

  //       <Row style={{ backgroundColor: "black", paddingBottom: 16 }} justify='center'>
  //         <Col style={{ textAlign: "center" }} span={24}>
  //           <Typography.Title level={3}>OK, lets get your Jira connected</Typography.Title>
  //         </Col>
  //         <Col span={24} style={{ textAlign: "center" }}>
  //           <Typography.Text type='secondary'>This will initiate the process to connect Troopr to your Jira account.</Typography.Text>
  //         </Col>
  //       </Row>
  //       <Row style={{ backgroundColor: "black", paddingBottom: 8 }} justify='center'>
  //         <Col style={{ textAlign: "center", backgroundColor: "black" }} span={16}>
  //           <Dropdown overlay={this.menu} trigger={["click"]} placement='bottomLeft'>
  //             <Button type='primary' size='large' color='#664af0'>
  //               Connect
  //             </Button>
  //           </Dropdown>
  //           <Button
  //             type='link'
  //             size='large'
  //             onClick={() => {
  //               //should show Checkins Config
  //               this.changeStep("setup_checkin");
  //             }}
  //           >
  //             Skip / Proceed
  //           </Button>
  //         </Col>
  //       </Row>
  //     </>
  //   );
  // };

  render() {
    let appId = localStorage.getItem("app") || "AE4FF42BA";
    const { location, workspace } = this.props;
    // localStorage.setItem("theme" , "dark")

    return (
      <>
        <Theme />
        <Modal
          // title={this.state.step == "project_management_tool" ? "Pick a Troopr configuration that makes sense to you" : ""}
          // maskStyle={{ backgroundColor: "rgba(0, 0, 0, 1)" }}
          // bodyStyle={{ backgroundColor: "black" }}
          // closable={this.state.step == "standup" ? false : true}
          // style={{ top: 50 }}

          visible={this.state.visible}
          footer={null}
          maskClosable={false}
          centered
          closable={false}
          width={/* this.state.step == "options" ? 1800 : 600 */ "100%"}
          onCancel={this.redirecToDashboard}
          style={{ minHeight: "100vh", width: "100vw" }}
          bodyStyle={{
            backgroundColor: "#fff",
            minHeight: "100vh",
            width: "100vw",
            position: "fixed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            marginLeft: "-15px",
          }}
          maskStyle={{ backgroundColor: "#fff" }}
        >
          <>
            {(this.state.step == "personalize" || this.state.step == "project_management_tool") && this.getFullScreenOnboarding()}
            {this.state.step == "options" && this.getOptionsScreen()}
            {this.state.step == "setup_jira" && this.getJiraWikiSetUpScreen()}
            {this.state.step == "setup_wiki" && this.getJiraWikiSetUpScreen()}
            {this.state.step == "setup_checkin" && this.getCheckInSetUpScreen()}
            {/* {this.state.step == "setup" && this.getSetUpScreen()} */}
          </>
        </Modal>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  workspace: state.common_reducer.workspace,
  teamId: state.skills.team,
  user: state.auth.user,
  skills: state.skills.skills,
  // assistant: storec,
});

export default withRouter(
  connect(mapStateToProps, { getTeamData, updateWorkspace, getSkillConnectUrl, setJiraConnectId, updateSkill })(NewOnBoarding)
);
