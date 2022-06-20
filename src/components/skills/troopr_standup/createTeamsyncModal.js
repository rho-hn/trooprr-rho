import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Modal, Select, Input, Button, message, Checkbox, Alert, Tag, Popconfirm, Typography } from "antd";
import { SlackOutlined } from "@ant-design/icons";
import TimeZones from "../../../utils/MomenttimeZone"
import {getOauthTokensForUsers} from "../../jiraoauth/jiraoauth.action"
import {
  getChannelList,
  createTeamSync,
  editTeamSync,
  getUserMappingAndUsers,
  getProject,
  getJiraProjectStatues,
  getJiraBoards,
  getBoardStatuses,
  getJiraIssuePicker,
  getDateDuckling,
  getJiraBoardSprint,
  sendTeamsyncAck,
  excecuteTeamSync,
  recentCheckins,
} from "../skills_action";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import TeamSyncTemplates from "./teamSyncTemplates";
import "./createTeamsyncModalStyles.css";
import { timeArr } from "./timeArr";
import { retroQuestionTemplates } from "./retroQuestionTemplates";
import { groupingValues, getGroupingOptions, getInitialOption } from "./Teamsyncreportoptions";
import _ from "lodash";
import moment from "moment-timezone";
import axios from "axios";
const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;
const WaitTimeArr = [
  {
    label: "15 minutes",
    value: "900",
  },
  {
    label: "30 minutes",
    value: "1800",
  },
  {
    label: "1 hour",
    value: "3600",
  },
  {
    label: "2 hours",
    value: "7200",
  },
  {
    label: "4 hours",
    value: "14400",
  },
  {
    label: "6 hours",
    value: "21600",
  },
  {
    label: "12 hours",
    value: "43200",
  },
  {
    label: "18 hours",
    value: "64800",
  },
  {
    label: "24 hours",
    value: "86400",
  },
  {
    label: "48 hours",
    value: "172800",
  },
];

class CreateTeamsyncModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      name: "",
      participants: [],
      errors: {},
      scheduleType: "recurring",
      jobtype: "multi_day",
      schedule: [],
      time_at: false,
      timeZone: "custom_timezone",
      timezone:this.props.user_now.timezone,
      moodQuestion: "none",
      questions: [],
      reportDelivery: "after_every_response",
      waitTime: "1800",
      reportChannels: [],
      groupResponse: 1,
      showActivity: "true",
      teamSyncType: "",
      report_members: [],
      jiraProject: false,
      jiraStatus: false,
      jiraBoard: false,
      jiraSprint: false,
      story_points_options: "",
      pokerIssues: [],
      // loading: false,
      searchQuery: "",
      selectedPokerIssues: [],
      allPokerIssues: [],
      waitTimeArr: WaitTimeArr,
      retroQuestionTemplate: null,
      jiraQuestionCheck: false,
      jiraCustomJQLCheck: false,
      customjql: "",
      taskCheckinNotmappedParticipants: [],
      selectedPlanningPokerIssueType: "choose_issues",
      planningPokerEstimationtemplate: "custom",
      send_anonymous: false,
      channelsLoading : false,
      // newCheckIn : false

      // when ever you add/change state variable, add it in two more places(on previous, setDeafaultState)
      isTeamsyncCreateButtonDisabled: false
    };
    this.onSearchDelayed = _.debounce(this.getJiraIssuePicker, 1000);
  }

  xyz = async () => {
    if (this.props.edit) {
      this.setState({ page: 1 });
    }
    if (this.props.edit && this.props.selectedTeamSyncForEdit) {
      // let userTeamSync = this.props.selectedTeamSyncForEdit;
      let userTeamSync = this.props.userTeamSync;
      let questions=this.props.isCopying?userTeamSync.multiple_question.map(que=>que.question_text) :userTeamSync.multiple_question
   
      this.setState({
        name: userTeamSync.name,
        scheduleType: userTeamSync.standupscheduleType,
        moodQuestion: userTeamSync.moodquestion,
        questions: questions,
        reportDelivery: userTeamSync.report_type,
        waitTime: `${userTeamSync.wait_time}`,
        reportChannels: userTeamSync.reportChannels,
        groupResponse: getInitialOption(
          userTeamSync.deliverymode,
          userTeamSync.groupby || (userTeamSync.standuptype === "retrospective" ? "question" : "user")
        ),
        showActivity: userTeamSync.showActivity.jira == true || userTeamSync.showActivity.jira == "true" ? "true" : "false",
        teamSyncType: userTeamSync.standuptype,
        reportChannels: userTeamSync.reportChannels,
        report_members: userTeamSync.report_members,
        jiraQuestionCheck: userTeamSync.multiple_question.length > 0 && true,
        jiraCustomJQLCheck: userTeamSync.jiraInfo && userTeamSync.jiraInfo.customjql ? true : false,
        jobtype: userTeamSync.standupscheduleType == "manual" ? "manual" : userTeamSync.jobtype,
        send_anonymous: userTeamSync.send_anonymous || false,
      });


      //for custom wait time
      if (userTeamSync.wait_time) {
        let isDefaultTime = WaitTimeArr.find((time) => time.value == userTeamSync.wait_time);

        if (!isDefaultTime) {
          let arr = [...this.state.waitTimeArr];
          arr.push({
            label: this.getWaitTimeLabel(userTeamSync.wait_time * 1000),
            value: userTeamSync.wait_time.toString(),
          });
          this.setState({ waitTimeArr: arr });
        }
      }

      if (userTeamSync.time_at) {
        this.setState({ time_at: userTeamSync.time_at });
      }
      if (userTeamSync.timezone_type) {
        this.setState({ timeZone: userTeamSync.timezone_type });
      }
      if(userTeamSync.timezone_type === 'user_timezone') this.setState({timezone : 'user_timezone'})
      else this.setState({timezone : userTeamSync.timezone || null})

      if (userTeamSync.days.length > 0) {
        let schedule = [];
        schedule = userTeamSync.standupscheduleType == "manual" ? [] : userTeamSync.days;
        this.setState({ schedule });
      }

      if (userTeamSync.standuptype == "planning_poker") {
        this.setState({
          story_points_options: userTeamSync.story_points_options,
          selectedPlanningPokerIssueType: userTeamSync.jiraInfo ? (userTeamSync.jiraInfo.isJql ? "configure_jql" : "choose_issues") : "choose_issues",
          customjql: userTeamSync.jiraInfo ? (userTeamSync.jiraInfo.isJql ? userTeamSync.jiraInfo.isJql : "") : "",
        });
        this.getJiraIssuePicker();
      }

      if (userTeamSync.standuptype == "jiraissuestandup" && userTeamSync.jiraInfo) {
        this.setState({
          // jiraBoard: userTeamSync.jiraInfo.boardInfo,
          jiraBoard: {
            boardId: Number(userTeamSync.jiraInfo && userTeamSync.jiraInfo.boardInfo && userTeamSync.jiraInfo.boardInfo.boardId),
            boardName: userTeamSync.jiraInfo && userTeamSync.jiraInfo.boardInfo && userTeamSync.jiraInfo.boardInfo.boardName,
          },
          jiraProject: userTeamSync.jiraInfo.projectInfo,
          jiraStatus: userTeamSync.jiraInfo.statusInfo,
          jiraSprint: userTeamSync.jiraInfo.sprintinfo,
          customjql: userTeamSync.jiraInfo.customjql,
          jiraCustomJQLCheck: userTeamSync.jiraInfo && userTeamSync.jiraInfo.customjql ? true : false,
        });
        const jiraSkill = this.props.skills && this.props.skills.find((skill) => skill.name == "Jira");
        const usermapping = await this.props.getUserMappingAndUsers(this.props.match.params.wId, jiraSkill && jiraSkill.skill_metadata._id);
        this.getJiraCheckinData();
      }
      let participants = [];
      userTeamSync.selectedMembers &&
        userTeamSync.selectedMembers.forEach((mem) => {
          participants.push(mem._id ? mem._id : mem);
        });

      if (userTeamSync.standuptype == "jiraissuestandup") {
        participants = this.getTaskCheckinParticipants(participants);
      }
      this.setState({ participants });
    }
  };

  componentDidMount() {
 /* getChannels only called once in sidenavbar_new */
    if(this.props.channels && this.props.channels.length === 0){
      this.setState({channelsLoading : true})
      this.props.getChannelList(this.props.match.params.wId).then(res => this.setState({channelsLoading : false}));
    }
    this.xyz();
    // this.handleTemplateSelect("retrospective");
    this.props.standuptype && this.handleTemplateSelect(this.props.standuptype);
    this.props.setClick && this.props.setClick(this.setDeafaultState);
  }

  async componentDidUpdate(prevProps) {
    const { userTeamSync, members } = this.props;

    if (prevProps.newStandupModalVisible != this.props.newStandupModalVisible) {
      if (this.props.standuptype && this.props.newStandupModalVisible) this.handleTemplateSelect(this.props.standuptype);
    }
  }

  getWaitTimeLabel = (diff) => {
    let hrs = Math.floor(diff / (3600 * 1000));
    let min = (diff % (3600 * 1000)) / (1000 * 60);
    let label = "";
    let value = (diff / 1000).toString();

    if (hrs > 0) {
      label = hrs + (hrs == 1 ? " hour" : " hours");
    }
    if (min > 0) {
      label += " " + min + (min == 1 ? " minute" : " minutes");
    }

    return label;
  };

  getJiraCheckinData = () => {
    // let jiraSkill =
    //   this.props.skills &&
    //   this.props.skills.find((skill) => skill.name == "Jira");
    // this.props.userMappingsWithUsers.length == 0 &&
    // const usermapping = await this.props.getUserMappingAndUsers(
    //   this.props.match.params.wId,
    //   jiraSkill && jiraSkill.skill_metadata._id
    // );
    this.props.getProject(this.props.match.params.wId).then((res) => {
      if (res.data.success) {
        if (this.state.jiraProject && this.state.jiraProject.projectId) {
          let query = "projectKeyOrId=" + this.state.jiraProject.projectId;

          // this.props.getJiraProjectStatues(
          //   jiraSkill.skill_metadata._id,
          //   this.state.jiraProject.projectId
          // );
          this.props.getJiraBoards(this.props.match.params.wId, query).then((res) => {
            if (res.data.success) {
              this.props.getBoardStatuses(this.props.match.params.wId, this.state.jiraBoard.boardId);
              this.props.getJiraBoardSprint(this.props.match.params.wId, this.state.jiraBoard.boardId, "state=active,future");
            }
          });
        }
      }
    });
  };

  onNameChange = (event) => {
    this.setState({ name: event.target.value }, () => {
      if (this.state.errors.name && this.state.name.trim().length != 0) {
        let errors = this.state.errors;
        errors.name = false;
        this.setState({ errors });
      }
    });
  };

  handleParticipantChange = (value) => {
    this.setState({ participants: value }, () => {
      if (this.state.errors.participant && this.state.participants.length > 0) {
        let errors = this.state.errors;
        errors.participant = false;
        this.setState({ errors });
      }
    });
  };

  addMemebersfromChannel = (value) => {
    const { teamSyncType, participants } = this.state;
    const { members, userMappingsWithUsers } = this.props;
    axios.get(`/bot/api/${this.props.match.params.wId}/getChannelMembers/${value}`).then((res) => {
      if (res.data.success) {
        let Participants = [...participants];
        res.data.channelMembers.forEach((mem) => {
          const memberFound = (teamSyncType === "jiraissuestandup" ? userMappingsWithUsers : members).find(
            (M) => M.user_id._id === mem || M.user_id.user_id === mem
          );
          if (memberFound) Participants.push(teamSyncType === "jiraissuestandup" ? memberFound.user_id.user_id : memberFound.user_id._id);
        });
        this.setState({ participants: [...new Set(Participants)] });
      }
    });
  };

  handleScheduleTypeChange = (value) => {
    this.setState({ jobtype: value, scheduleType: value === "manual" ? value : "recurring" });
  };

  handleScheduleChange = (value) => {
    let days = [];
    this.setState({ schedule: value }, () => {
      if (this.state.errors.schedule && this.state.schedule.length > 0) {
        let errors = this.state.errors;
        errors.schedule = false;
        this.setState({ errors });
      }
    });
  };

  handleTimeChange = (value) => {
    this.setState({ time_at: value }, () => {
      if (this.state.errors.time_at && this.state.time_at.length > 0) {
        let errors = this.state.errors;
        errors.time_at = false;
        this.setState({ errors });
      }
    });
  };

  handleTimeZoneTypeChange = (value) => {
    if(value === 'user_timezone') this.setState({ timeZone: value, timezone:value });
    else this.setState({timeZone: 'custom_timezone', timezone:value})
  };

  handleCustomJQL = (e) => {
    this.setState({ customjql: e.target.value });
  };

  onPrevious = () => {
    this.setState({ page: this.state.page - 1, errors: {} }, () => {
      if (this.state.page == 0) {
        this.setState({
          name: "",
          participants: [],
          scheduleType: "recurring",
          schedule: [],
          time_at: false,
          timeZone: "custom_timezone",
          timezone:this.props.user_now.timezone,
          moodQuestion: "none",
          questions: [],
          reportDelivery: "after_every_response",
          waitTime: "1800",
          reportChannels: [],
          groupResponse: 1,
          showActivity: "true",
          teamSyncType: "",
          report_members: [],
          jiraProject: false,
          jiraStatus: false,
          jiraSprint: false,
          jiraBoard: false,
          story_points_options: "",
          pokerIssues: [],
          // loading: false,
          searchQuery: "",
          selectedPokerIssues: [],
          allPokerIssues: [],
          waitTimeArr: WaitTimeArr,
          retroQuestionTemplate: null,
          jiraQuestionCheck: false,
          jiraCustomJQLCheck: false,
          customjql: "",
          jobtype: "multi_day",
          taskCheckinNotmappedParticipants: [],
          selectedPlanningPokerIssueType: "choose_issues",
          planningPokerEstimationtemplate: "custom",
          // newCheckIn: false
        });
      }
    });
  };

  onQuestionChange = (event, data) => {
    const { userTeamSync } = this.props;

    let questions = [...this.state.questions];

    if (this.props.edit&&!this.props.isCopying) {
      if (questions[data] && questions[data]._id) {
        event.target.value.length > 0
          ? (questions[data].question_text = event.target.value)
          : data != 0
          ? (questions[data].question_text = "question_removed")
          : (questions[data].question_text = " ");
        // (questions[data].question_text = "question_removed");
      } else {
        event.target.value.length > 0 ? (questions[data] = { question_text: event.target.value }) : delete questions[data];
      }
    } else {
      event.target.value.length > 0 ? (questions[data] = event.target.value) : data != 0 ? questions.splice(data, 1) : (questions[data] = "");
    }


    this.setState({ questions }, () => {
      if (this.state.errors.questions && this.props.edit) {
        let errors = this.state.errors;
        errors.questions = false;
        if (this.state.questions[0].question_text != "question_removed" && this.state.questions[0].question_text.trim().length != 0)
          this.setState({ errors });
      } else if (this.state.errors.questions && this.state.questions[0].trim().length != 0) {
        let errors = this.state.errors;
        errors.questions = false;
        this.setState({ errors });
      }
    });
  };

  handlereportDeliveryChange = (value) => {
    this.setState({ reportDelivery: value });
  };

  handlewaitTimeChange = (value) => {
    this.setState({ waitTime: value }, () => this.setState({ waitTimeArr: WaitTimeArr }));
  };

  handlereportChannelChange = (value) => {
    let reportChannels = [];
    value.length > 0 &&
      value.forEach((val) => {
        let channel = this.props.channels.length > 0 && this.props.channels.find((cha) => cha.id == val);
        channel && reportChannels.push({ name: channel.name, id: channel.id });
      });

    this.setState({ reportChannels }, () => {
      if (this.state.errors.reportChannels && this.state.reportChannels.length > 0) {
        let errors = this.state.errors;
        errors.reportChannels = false;
        errors.report_members = false;
        this.setState({ errors });
      }
    });
  };

  handlereportMembersChange = (value) => {
    this.setState(
      { report_members: value },

      () => {
        if (this.state.errors.report_members && this.state.report_members.length > 0) {
          let errors = this.state.errors;
          errors.report_members = false;
          errors.reportChannels = false;
          this.setState({ errors });
        }
      }
    );
  };

  handleGroupResponseChange = (value) => {
    this.setState({ groupResponse: value });
  };

  handleShowActivityChange = (value) => {
    // console.log("show activity", this.state.showActivity, value);
    this.setState({ showActivity: value });
  };

  handleMoodQuestionChange = (value) => {
    if (this.state.teamSyncType == "team_mood_standup") {
      this.setState({ moodQuestion: value.target.value }, () => {
        if (this.state.errors.moodquestion && this.state.moodQuestion.trim().length > 0) {
          let errors = { ...this.state.errors };
          errors.moodquestion = false;
          this.setState({ errors });
        }
      });
    } else {
      this.setState({ moodQuestion: value });
    }
  };

  handleRetroQuestionTempChange = (value) => {
    if (this.props.edit) {
      let questions = [];
      retroQuestionTemplates[value].value.forEach((question) => {
        questions.push({ question_text: question });
      });
      this.setState({
        retroQuestionTemplate: value,
        questions,
      });
    } else {
      this.setState({
        retroQuestionTemplate: value,
        questions: retroQuestionTemplates[value].value,
      });
    }
  };

  handleJiraProjectSelect = (value, data) => {
    this.setState(
      {
        jiraProject: { projectId: value, projectName: data.props.children },
        jiraBoard: false,
        jiraStatus: false,
        jiraSprint: false,
      },
      () => {
        if (this.state.errors.jiraProject && this.state.jiraProject && this.state.jiraProject.projectName.length > 0) {
          let errors = this.state.errors;
          errors.jiraProject = false;
          this.setState({ errors });
        }

        let jiraSkill = this.props.skills && this.props.skills.find((skill) => skill.name == "Jira");
        let query = "projectKeyOrId=" + this.state.jiraProject.projectId;

        // this.props.getJiraProjectStatues(
        //   jiraSkill.skill_metadata._id,
        //   this.state.jiraProject.projectId
        // );
        this.props.getJiraBoards(this.props.match.params.wId, query);
      }
    );
  };

  handleJiraStatusChange = (value, data) => {
    this.setState({ jiraStatus: { statusId: value, statusName: data.props.children } }, () => {
      if (this.state.errors.jiraStatus && this.state.jiraStatus && this.state.jiraStatus.statusId.length > 0) {
        let errors = this.state.errors;
        errors.jiraStatus = false;
        this.setState({ errors });
      }
    });
  };

  handleJiraSprintChange = (value, data) => {
    if (value) {
      this.setState({ jiraSprint: { sprintid: value, sprintname: data.props.children } }, () => {
        if (this.state.errors.jiraSprint && this.state.jiraSprint && this.state.jiraSprint.sprintid.length > 0) {
          let errors = this.state.errors;
          errors.jiraSprint = false;
          this.setState({ errors });
        }
      });
    } else {
      this.setState({ jiraSprint: {} });
    }
  };

  handleJiraBoardChange = (value, data) => {
    this.setState(
      {
        jiraBoard: {
          boardId: value,
          boardName: data.props.children,
        },
        jiraStatus: false,
        jiraSprint: false,
      },
      () => {
        this.props.getBoardStatuses(this.props.match.params.wId, this.state.jiraBoard.boardId);
        this.props.getJiraBoardSprint(this.props.match.params.wId, this.state.jiraBoard.boardId, "state=active,future");
        if (this.state.errors.jiraBoard && this.state.jiraBoard) {
          let errors = this.state.errors;
          errors.jiraBoard = false;
          this.setState({ errors });
        }
      }
    );
  };

  handleStroryPointChange = (event) => {
    this.setState({ story_points_options: event.target.value }, () => {
      if (this.state.errors.storyPoint && this.state.story_points_options.length > 0) {
        let errors = this.state.errors;
        errors.storyPoint = false;
        this.setState({ errors });
      }
    });
  };

  handleJiraSearchChange = (value) => {
    this.setState({ searchQuery: value }, () => {
      this.onSearchDelayed();
    });
    // this.getJiraIssuePicker(value);
  };

  onJiraQuestionCheckboxChange = (e) => {
    if (this.props.edit) {
      if (e.target.checked)
        this.setState({
          jiraQuestionCheck: e.target.checked,
          questions:
            this.props.userTeamSync.multiple_question.length > 0
              ? this.props.userTeamSync.multiple_question
              : [
                  { question_text: "What did you get done since last report?" },
                  { question_text: "What's plan for today?" },
                  { question_text: "Any blockers?" },
                ],
        });
      else this.setState({ jiraQuestionCheck: e.target.checked, questions: [] });
    } else {
      if (e.target.checked)
        this.setState({
          jiraQuestionCheck: e.target.checked,
          questions: ["What did you get done since last report?", "What's plan for today?", "Any blockers?"],
        });
      else this.setState({ jiraQuestionCheck: e.target.checked, questions: [] });
    }
  };

  jiraCustomJQLCheckChange = (e) => {
    if (this.props.edit) {
      if (e.target.checked)
        this.setState({
          jiraCustomJQLCheck: e.target.checked,
        });
      else this.setState({ jiraCustomJQLCheck: e.target.checked });
    } else {
      if (e.target.checked)
        this.setState({
          jiraCustomJQLCheck: e.target.checked,
        });
      else this.setState({ jiraCustomJQLCheck: e.target.checked });
    }
  };

  handlePokerIssueSelect = (value, data) => {
    if (this.props.edit) {
      let questions = [...this.state.questions];
      data.forEach((issue, index) => {
        if (_.isEmpty(issue)) {
          let tempIssue = this.state.questions.find((issue) => issue.meta.key == value[index]);
          tempIssue && data.push(tempIssue);
        } else {
          const index = questions.findIndex((data) => data.meta && data.meta.key == issue.value);
          index == -1 &&
            questions.push({
              meta: {
                key: issue.value,
                url: `https://api.atlassian.com/ex/jira/a2e993e6-1707-4561-8acc-4f0594369930/rest/api/2/issue/${issue.key}`,
                name: issue.label,
              },
              question_text: issue.label,
            });
        }
      });
      this.setState({ questions }, () => {
        let tempQues = [];
        questions.forEach((question) => {
          if (data.find((que) => que.value == question.meta.key || (que.meta && que.meta.key == question.meta.key))) {
            tempQues.push(question);
          }
        });
        this.setState({ questions: tempQues }, () => this.checkJiraIssues());
      });
    } else {
      let questions = [];
      let data2 = this.findIssues(value);
      data2.forEach((issue, index) => {
        questions.push({
          key: issue.key,
          url: `https://api.atlassian.com/ex/jira/a2e993e6-1707-4561-8acc-4f0594369930/rest/api/2/issue/${issue.id}`,
          name: issue.summaryText,
        });
      });
      this.setState({ questions }, () => this.checkJiraIssues());
    }
  };

  handlePokerisssueType = (value) => {
    if (value === "choose_issues") this.setState({ customjql: "", questions: [] });
    this.setState({ selectedPlanningPokerIssueType: value });
  };

  handlePokerEstimationType = (value) => {
    let obj = {
      linear: "1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ☕",
      fibonacci: "1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ☕",
      tshirt: "XS, S, M, L, XL, XXL, XXXL, ☕",
      custom: "",
    };
    this.setState({ planningPokerEstimationtemplate: value, story_points_options: obj[value] });
  };

  checkJiraIssues = () => {
    if (this.state.errors.jiraIssues && this.state.questions.length > 0) {
      let errors = this.state.errors;
      errors.jiraIssues = false;
      this.setState({ errors });
    }
  };

  findIssues = (value) => {
    let data = [];
    value.forEach((key) => {
      let issue = this.state.allPokerIssues.find((issue) => issue.key == key);
      if (issue) data.push(issue);
    });
    return data;
  };
  
  
  handleTemplateSelect = (value) => {
    const { userMappingsWithUsers } = this.props;

    let scheduleType,
      teamSyncType,
      name,
      questions = [];

    // const getTokenForUser = async() => {
    //     let url=await getOauthTokensForUsers(this.props.match.params.wId,this.props.match.params.sub_skill)
    //     return url
    //   }

    if (value === "Daily Standup") {
      scheduleType = "recurring";
      teamSyncType = value;
      name = "Daily Standup";
      questions = ["What did you get done since last report?", "What's plan for today?", "Any blockers?"];
      this.setState({ schedule: ["1", "2", "3", "4", "5"], time_at: "9:00 AM" });
    } else if (value === "retrospective") {
      //scheduleType = "manual";
      //const jobtype = 'manual'
      scheduleType = "recurring";

      teamSyncType = value;
      name = "Retrospective";
      // questions =
      //   retroQuestionTemplates["What Went Well, What Didn't Go Well"].value;
      questions = ["What went well in the Sprint?", "What could be improved?", "What will we commit to improve in the next Sprint?"];
      const groupResponse = 2;
      this.setState({ groupResponse });
      this.setState({ schedule: ["5"], time_at: "9:00 AM", send_anonymous: false });
    } else if (value === "retrospectiveanonymous") {
      //scheduleType = "manual";
      scheduleType = "recurring";
      //const jobtype = 'manual'
      teamSyncType = "retrospective";
      name = "Retrospective Anonymous";

      // questions =
      //   retroQuestionTemplates["What Went Well, What Didn't Go Well"].value;
      questions = ["What went well in the Sprint?", "What could be improved?", "What will we commit to improve in the next Sprint?"];
      const groupResponse = 2;
      this.setState({ groupResponse });
      this.setState({ schedule: ["5"], time_at: "9:00 AM", send_anonymous: true });
    } else if (value === "mondaykickoff") {
      this.setState({ schedule: ["1"], time_at: "9:00 AM" });
      scheduleType = "recurring";
      teamSyncType = "Daily Standup";
      name = "Monday Kickoff";
      questions = ["How are you feeling today?", "How was your weekend?", "What do you aim to accomplish this week?"];
      // this.setState({ schedule: ["1"] });
    } else if (value === "remoteteamstandup") {
      scheduleType = "recurring";
      teamSyncType = "Daily Standup";
      name = "Remote team Check-in";
      questions = ["What did you get done since last report?", "What's plan for today?", "Any blockers?"];
      this.setState({ timeZone: "user_timezone",timezone:'user_timezone' });
    } else if (value === "moodcheckin") {
      scheduleType = "recurring";
      teamSyncType = "team_mood_standup";
      name = "Team Mood";

      questions = ["Add Comment"];

      //this.setState({ reportDelivery:"after_every_response", moodQuestion: "How was your day today?",schedule:['1','2','3','4','5'] });
      this.setState({
        reportDelivery: "after_every_response",
        moodQuestion: "How are you feeling today?",
        schedule: ["1", "2", "3", "4", "5"],
        time_at: "9:00 AM",
        send_anonymous: false,
      });
    } else if (value === "moodcheckinanonymous") {
      scheduleType = "recurring";
      teamSyncType = "team_mood_standup";
      name = "Team Mood Anonymous";
      questions = ["Add Comment"];

      //this.setState({ reportDelivery:"after_every_response", moodQuestion: "How was your day today?",schedule:['1','2','3','4','5'] });
      this.setState({
        reportDelivery: "after_every_response",
        moodQuestion: "How are you feeling today?",
        schedule: ["1", "2", "3", "4", "5"],
        time_at: "9:00 AM",
        send_anonymous: true,
      });
    } else if (value === "teammoral") {
      scheduleType = "recurring";
      teamSyncType = "Daily Standup";
      name = "Team Morale";
      questions = [
        "In my team, I feel fit and strong",
        "I am proud of the work that I do for my team",
        "I am enthusiastic about the work that I do for my team",
        "I find the work that I do for my team of meaning and purpose",
      ];
    } else if (value === "taskcheckin") {
      scheduleType = "recurring";
      teamSyncType = "jiraissuestandup";
      name = "Task Check-in";
      let jiraSkill = this.props.skills && this.props.skills.find((skill) => skill.name == "Jira");
      // this.props.userMappingsWithUsers.length == 0 &&
      this.props.getUserMappingAndUsers(this.props.match.params.wId, jiraSkill && jiraSkill.skill_metadata._id);
      this.props.getProject(this.props.match.params.wId);
      this.setState({ schedule: ["1", "2", "3", "4", "5"], time_at: "9:00 AM", reportDelivery: "after_wait_time" });
    } else if (value === "planning_poker") {
      // scheduleType = "manual";
      // const {skills,currentSkillUser} = this.props
      // const skill = skills.find((skill) => skill.name == "Jira")
      // const isjiraConnected = skill && skill.skill_metadata ? skill.skill_metadata.linked : skill?skill.linked:false
      // const token =  currentSkillUser && currentSkillUser._id && currentSkillUser.token_obj
      
      // let url= getTokenForUser()
      
      // if(!isjiraConnected||!token) return  message.warning({
      //   content: (
      //     <>
      //       Verify your jira account in order to use Planning Poker
      //       <Button
      //         style={{ marginLeft: 0 }}
      //         type='link'
      //         onClick={() => window.open(url, "_blank")}
      //       >
      //         Click here
      //       </Button>
      //     </>
      //   ),
      // })
      scheduleType = "recurring";
      teamSyncType = "planning_poker";
      name = "Planning Poker";
      this.getJiraIssuePicker();
      this.setState({ reportDelivery: "after_all_response" });
      // let jiraSkill =
      //   this.props.skills &&
      //   this.props.skills.find((skill) => skill.name == "Jira");
      // this.props.userMappingsWithUsers.length == 0 &&
      //   this.props.getUserMappingAndUsers(
      //     this.props.match.params.wId,
      //     jiraSkill && jiraSkill.skill_metadata._id
      //   );
    }else if (value === 'instant-poker') teamSyncType = 'instant-poker'

    this.setState({
      scheduleType,
      teamSyncType,
      name,
      questions,
      page: 1,
      // participants : [this.props.user_now._id],
      // report_members : [this.props.user_now._id]
    });

    if (value === "taskcheckin") {
      // this.setState({participants})
      const isUserFound = userMappingsWithUsers && userMappingsWithUsers.find((user) => user.user_id.user_id === this.props.user_now._id);
      isUserFound && this.setState({ participants: [this.props.user_now._id], report_members: [this.props.user_now._id] });
    } else this.setState({ participants: [this.props.user_now._id], report_members: [this.props.user_now._id] });
  };

  getJiraIssuePicker = () => {
    // this.setState({ loading: true });
    this.props.getJiraIssuePicker(this.props.match.params.wId, this.state.searchQuery).then((res) => {
      if (res.data.success) {
        let allPokerIssues = [...this.state.allPokerIssues];
        let pokerIssues = [...res.data.issues];
        if (this.props.edit) {
          this.state.questions.forEach((ques) => {
            let index = pokerIssues.findIndex((issue) => issue.key == ques.meta.key);
            let id = ques.meta.url.split("/")[10];
            index == -1 &&
              pokerIssues.push({
                id,
                key: ques.meta.key,
                summaryText: ques.question_text,
              });
          });
        }
        allPokerIssues = allPokerIssues.concat(res.data.issues);
        this.setState({ pokerIssues, allPokerIssues }, () => {
          // this.setState({ loading: false });
        });
      }
    });
  };

  onSearchClose = () => {
    this.props.getJiraIssuePicker(this.props.match.params.wId, "").then((res) => {
      if (res.data.success) {
        let allPokerIssues = [...this.state.allPokerIssues];
        let pokerIssues = [...res.data.issues];
        if (this.props.edit) {
          this.state.questions.forEach((ques) => {
            let index = pokerIssues.findIndex((issue) => issue.key == ques.meta.key);
            let id = ques.meta.url.split("/")[10];
            index == -1 &&
              pokerIssues.push({
                id,
                key: ques.meta.key,
                summaryText: ques.question_text,
              });
          });
        }
        allPokerIssues = allPokerIssues.concat(res.data.issues);
        this.setState({ pokerIssues, allPokerIssues });
      }
    });
  };

  getWaitTimeLabel = (diff) => {
    let hrs = Math.floor(diff / (3600 * 1000));
    let min = (diff % (3600 * 1000)) / (1000 * 60);
    let label = "";
    let value = (diff / 1000).toString();

    if (hrs > 0) {
      label = hrs + (hrs == 1 ? " hour" : " hours");
    }
    if (min > 0) {
      label += " " + min + (min == 1 ? " minute" : " minutes");
    }

    return label;
  };

  getLabelTime = (wait_time) => {
    let timeSec = this.getTimeZoneTime();
    let dateObj = new Date(timeSec.valueOf() + 1000 * parseInt(wait_time));
    return dateObj.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: this.props.user_now.timezone,
    });
  };

  getTimeZoneTime = (info) => {
    let runAt = this.state.time_at;
    let tzType = this.state.timeZone;
    let timezone = this.props.user_now.timezone;

    if (this.state.timeZone == "user_timezone") {
      let participants = [];
      participants = this.getParticipantsData(this.state.participants);
      let sortedUsers = participants.sort((a, b) => {
        a.offset = this.getTimeOffSet(a.user_id.timezone);
        b.offset = this.getTimeOffSet(b.user_id.timezone);
        return b.offset - a.offset;
      });
      timezone = sortedUsers[sortedUsers.length - 1].user_id.timezone;
    }

    let run_at = this.convertTime12to24(runAt);
    let time_arr = run_at.split(":");
    let hrs = time_arr[0];
    let min = time_arr[1];
    let timeSec = this.convertToTZ(hrs, min, timezone, "UTC");
    return timeSec;
  };

  getParticipantsData = (participants) => {
    const { members } = this.props;
    let participantsData = [];
    members &&
      members.length > 0 &&
      participants.forEach((participant) => {
        let user = members.find((mem) => mem.user_id._id == participant);
        user && participantsData.push(user);
      });
    return participantsData;
  };

  getTimeOffSet = (timezone) => {
    let offset = moment.tz(moment(), timezone).utcOffset();
    return offset;
  };

  convertTime12to24 = (time12h) => {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");
    if (hours === "12") {
      hours = "00";
    }
    if (modifier === "PM") {
      hours = parseInt(hours, 10) + 12;
    }
    return `${hours}:${minutes}`;
  };

  convertToTZ = (hrs, min, srcTZ, targetTZ) => {
    let dateObj = new Date();
    let mDate = moment.tz(moment(dateObj), srcTZ);
    mDate.set({ hour: hrs, minute: min, second: 0, millisecond: 0 });
    return mDate.tz(targetTZ);
  };

  getPlanningpokerIssuesByJQL = async () => {
    const { customjql } = this.state;

    let res = await axios.post(`/bot/api/${this.props.match.params.wId}/user/${this.props.user_now._id}/getIssueByJQL`, { jql: customjql });
    if (res.data.success) {
      let questions = [];
      res.data.issues.issues.forEach((issue, index) => {
        questions.push({
          key: issue.key,
          url: `https://api.atlassian.com/ex/jira/a2e993e6-1707-4561-8acc-4f0594369930/rest/api/2/issue/${issue.id}`,
          name: issue.fields.summary ? issue.fields.summary : "",
          desc: issue.fields.description ? issue.fields.description : "",
        });
      });
      this.setState({ questions });
      return { error: false };
    } else if (!res.data.success && res.data.error.type === "issue_by_jql") {
      return { error: true, msg: res.data.error.message };
    }
  };

  onNext = async () => {
    let errors = {};

    if (this.state.page === 1) {
      if (this.state.name.trim().length == 0) {
        errors.name = true;
      }

      if (this.state.participants.length === 0) {
        errors.participant = true;
      }
      if (this.state.scheduleType === "recurring" && this.state.schedule.length == 0) {
        errors.schedule = true;
      }
      if (this.state.scheduleType == "recurring" && !this.state.time_at) {
        errors.time_at = true;
      }
      _.isEmpty(errors) && this.setState({ page: 2 });
    } else if (this.state.page === 2) {
      if (this.state.teamSyncType == "dailystandup" || this.state.teamSyncType == "Daily Standup" || this.state.teamSyncType == "retrospective") {
        if (
          this.state.questions[0].question_text
            ? this.state.questions[0].question_text.trim().length == 0
            : this.state.questions[0].trim().length == 0
        ) {
          errors.questions = true;
        }
      } else if (this.state.teamSyncType == "jiraissuestandup") {
        if (!this.state.jiraProject) {
          if (!this.state.jiraCustomJQLCheck) errors.jiraProject = true;
        }
        if (!this.state.jiraStatus) {
          if (!this.state.jiraCustomJQLCheck) errors.jiraStatus = true;
        }
        if (!this.state.jiraBoard) {
          if (!this.state.jiraCustomJQLCheck) errors.jiraBoard = true;
        }
        if (this.state.jiraCustomJQLCheck) {
          if (!this.state.customjql) {
            errors.customjql = "JQL is required";
          } else {
            let res = await axios.post("/bot/api/skill/" + this.props.match.params.wId + "/verifyJql/" + this.props.match.params.wId, {
              jql: this.state.customjql,
            });
            if (res.data.success) {
            } else {
              errors.customjql = res.data.error.message;
            }
          }
        }
        if (
          this.state.jiraQuestionCheck &&
          (this.state.questions[0].question_text
            ? this.state.questions[0].question_text.trim().length == 0
            : this.state.questions[0].trim().length == 0)
        ) {
          errors.questions = true;
        }
      } else if (this.state.teamSyncType == "planning_poker") {
        if (this.state.story_points_options.trim().length == 0) {
          errors.storyPoint = true;
        }

        if (this.state.selectedPlanningPokerIssueType === "configure_jql") {
          if (!this.state.customjql) errors.customjql = "JQL is required";
          else {
            let res = await axios.post("/bot/api/skill/" + this.props.match.params.wId + "/verifyJql/" + this.props.match.params.wId, {
              jql: this.state.customjql,
            });
            if (res.data.success) {
              let d = await this.getPlanningpokerIssuesByJQL();
              if (d.error) {
                errors.customjql_project_not_found = { error: true, msg: d.msg };
              }
            } else errors.customjql = res.data.error.message;
          }
        } else {
          if (this.state.questions.length == 0) errors.jiraIssues = true;
        }
      } else if (this.state.teamSyncType === "team_mood_standup") {
        if (this.state.moodQuestion.trim().length === 0) errors.moodquestion = true;
      }

      _.isEmpty(errors) && this.setState({ page: 3 });
    } else if (this.state.page === 3) {
      this.setState({
        isTeamsyncCreateButtonDisabled: true
      })
      let flag = true;
      if (this.state.reportChannels && this.state.reportChannels.length > 0) {
        // errors.reportChannels = true;
        flag = false;
      }

      if (this.state.report_members.length > 0) {
        // errors.report_members = true;
        flag = false;
      }

      if (flag) {
        errors.reportChannels = true;
        errors.report_members = true;

        this.setState({
          isTeamsyncCreateButtonDisabled: false
        })
      }

      _.isEmpty(errors) && this.state.page === 3 && this.createAndUpdateTeamSync();
    }
    this.setState({ errors });
  };

  createAndUpdateTeamSync = () => {
    const {
      page,
      name,
      participants,
      errors,
      scheduleType,
      schedule,
      time_at,
      timeZone,
      moodQuestion,
      questions,
      reportDelivery,
      waitTime,
      reportChannels,
      groupResponse,
      showActivity,
      teamSyncType,
      report_members,
      jiraProject,
      jiraStatus,
      jiraSprint,
      jiraBoard,
      story_points_options,
      jobtype,
      taskCheckinNotmappedParticipants,
      selectedPlanningPokerIssueType,
      customjql,
      send_anonymous,
      timezone
    } = this.state;
    const responsegroupingOption = groupingValues[groupResponse - 1];
    let data = {
      name,
      jobtype: jobtype,
      days: schedule,
      standuptype: teamSyncType,
      standupscheduleType: scheduleType,
      // selectedMembers: participants,
      report_members,
      guestUsers: [],
      reportChannels,
      isShared: false,
      guestusersInfo: [],
      wait_time: waitTime,
      report_to: "channel",
      report_type: reportDelivery,
      questions: questions.filter((question) => question != null),
      deliverymode: responsegroupingOption.deliverymode,
      groupby: responsegroupingOption.groupby,
      send_anonymous,
    };

    if (teamSyncType == "jiraissuestandup") {
      data.selectedMembers = participants.concat(taskCheckinNotmappedParticipants);
    } else data.selectedMembers = participants;

    if (teamSyncType == "dailystandup" || teamSyncType == "Daily Standup" || teamSyncType == "retrospective" || teamSyncType == "team_mood_standup") {
      data.report_type = reportDelivery;
    }

    if (teamSyncType == "dailystandup" || teamSyncType == "Daily Standup") {
      data.showActivity = { jira: showActivity };
    } else if (
      teamSyncType == "jiraissuestandup" ||
      teamSyncType == "planning_poker" ||
      teamSyncType == "retrospective" ||
      teamSyncType == "team_mood_standup"
    ) {
      data.showActivity = { jira: "false" };
    }

    if (teamSyncType == "dailystandup" || teamSyncType == "Daily Standup" || teamSyncType == "team_mood_standup") {
      data.moodquestion = moodQuestion;
    }
    if (scheduleType == "recurring") {
      data.time_at = time_at;
      data.timezone = timeZone === 'user_timezone' ? null : timezone
      data.timezone_type= timeZone
    }

    if (teamSyncType == "jiraissuestandup") {
      data.jiraInfo = {
        projectInfo: jiraProject,
        statusInfo: jiraStatus,
        sprintinfo: jiraSprint,
        boardInfo: {
          boardId: jiraBoard.boardId && jiraBoard.boardId.toString(),
          boardName: jiraBoard.boardName,
        },
        customjql: this.state.jiraCustomJQLCheck ? this.state.customjql : "",
      };
    }

    if (teamSyncType == "planning_poker") {
      data.story_points_options = story_points_options;

      if (selectedPlanningPokerIssueType === "configure_jql") {
        data.jiraInfo = { isJql: customjql };
      } else data.jiraInfo = { isJql: "" };
    }

    if (this.props.edit&&!this.props.isCopying) {
      this.props.editTeamSync(this.props.editTeamSyncId, data).then((res) => {
        this.handleClose();
        this.setState({
          isTeamsyncCreateButtonDisabled: false
        })
      });
    } else {
    
      this.props.createTeamSync(this.props.match.params.wId, data).then((res) => {
        this.setState({
          isTeamsyncCreateButtonDisabled: false
        })
        if (res.data.success) {
          this.props.recentCheckins(res.data.teamSync._id, this.props.match.params.wId);
          this.props.history.push(`/${this.props.match.params.wId}/teamsync/${res.data.teamSync._id}/settings?new=true`);

          this.props.sendTeamsyncAck(res.data.teamSync, this.props.match.params.wId);

          this.handleClose();

          if (res.data.subs && res.data.subs.success) Modal.confirm({
            title: "Run Check-in now?",
            icon: <ExclamationCircleOutlined />,
            content: (
              <>
                <Text>Check-in created successfully</Text>
                <br />
                <br />
                <Text>
                  {/* {res.data.teamSync.name} by {res.data.teamSync.user_id.displayName || res.data.teamSync.user_id.name} */}
                  {res.data.teamSync.name} by {res.data.teamSync.user_id.displayName || res.data.teamSync.user_id.name}
                  <br />
                  Check-in status is enabled
                  <br />
                  {res.data.teamSync.standupscheduleType == "recurring" && (
                    <span>
                      Runs{" "}
                      {res.data.teamSync.jobtype === "first_week"
                        ? "first week of month on "
                        : res.data.teamSync.jobtype === "multi_day"
                        ? "every "
                        : res.data.teamSync.jobtype === "weekly_2"
                        ? "every two weeks on "
                        : res.data.teamSync.jobtype === "weekly_3"
                        ? "every three weeks on "
                        : res.data.teamSync.jobtype === "weekly_4"
                        ? "every four weeks on "
                        : res.data.teamSync.jobtype === "last_week"
                        ? "last week of month on "
                        : ""}
                      {this.weekdays(res.data.teamSync)} at {this.getTime(res.data.teamSync)}{" "}
                      {moment.tz(res.data.teamSync.user_id.timezone).zoneAbbr()}
                      <br />
                    </span>
                  )}
                  <span>
                    Reporting to
                    {res.data.teamSync.report_type == "after_wait_time"
                      ? `  ${this.getReportChannelText(res.data.teamSync)} ${
                          res.data.teamSync.report_members.length > 0 &&
                          res.data.teamSync.reportChannels &&
                          res.data.teamSync.reportChannels.length > 0
                            ? "and "
                            : ""
                        } ${res.data.teamSync.report_members.map((mem) => {
                          return mem.displayName || mem.name;
                          // return mem.name;
                        })} after ${this.convertSecondsTohours(res.data.teamSync.wait_time)}`
                      : ` ${this.getReportChannelText(res.data.teamSync)} ${
                          res.data.teamSync.report_members.length > 0 &&
                          res.data.teamSync.reportChannels &&
                          res.data.teamSync.reportChannels.length > 0
                            ? "and "
                            : ""
                        } ${res.data.teamSync.report_members.map((mem) => {
                          return mem.displayName || mem.name;
                          // return mem.name;
                        })} after every submission`}
                  </span>
                </Text>
                <br />
                <br />
                <Text>
                  Do you want to run the Check-in now?
                  {res.data.teamSync.standupscheduleType == "recurring" &&
                    ` Note that the Check-in will
                    still run at scheduled times.`}
                </Text>
              </>
            ),
            okText: "Run Now",
            okType: "primary",
            onOk: () => this.execRunNow(res.data.teamSync._id),
            cancelText: res.data.teamSync.standupscheduleType == "recurring" ? "Run at scheduled time" : false,
          });
        }
      });
    }
  };

  // getRunNowButtonForAck = (teamSync) => {
  //   return (
  //     <Popconfirm
  //     title={
  //       <span>
  //         Please confirm if you want to run check-in : "{teamSync.name}" now? <br />
  //         These members{" "}
  //         {(teamSync.selectedMembersInfo ? teamSync.selectedMembersInfo : teamSync.selectedMembers).map((value,index) => {
  //           if(index < 3)return <span>{value.name} </span>;
  //         })}{" "}
  //         {(teamSync.selectedMembersInfo ? teamSync.selectedMembersInfo : teamSync.selectedMembers).length > 3 && `and ${(teamSync.selectedMembersInfo ? teamSync.selectedMembersInfo : teamSync.selectedMembers).length - 3} others `}
  //         {teamSync.guestusersInfo.length > 0 &&
  //           teamSync.guestusersInfo.map((usr) => {
  //             return <span>{usr.name} </span>;
  //           })}
  //         will be asked to respond.
  //       </span>
  //     }
  //     placement='bottom'
  //     onConfirm={() => this.execRunNow(teamSync._id)}
  //   >
  //     <Button type='link' style={{marginLeft:0}}>Run Now</Button>
  //   </Popconfirm>
  //   )
  // }

  execRunNow = (_id) => {
    this.props.excecuteTeamSync(_id).then((res) => {
      if (res.data.success)
        message.success({
          content: (
            <>
              Check-in ran successfully.{" "}
              <Button
                style={{ marginLeft: 0 }}
                type='link'
                href={`https://slack.com/app_redirect?app=AE4FF42BA&team=${localStorage.getItem("teamId")}`}
                target='_blank'
              >
                {" "}
                Go to bot channel
              </Button>
            </>
          ),
        });
    });
    message.destroy("checkin_ack");
  };

  convertSecondsTohours = (d) => {
    d = Number(d);
    let h = Math.floor(d / 3600);
    let m = Math.floor((d % 3600) / 60);
    let hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours") : "";
    let mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes") : "";

    return hDisplay + mDisplay;
  };

  getReportChannelText = (userTeamSync) => {
    const { channels } = this.props;
    let txt = "";
    userTeamSync.reportChannels &&
      userTeamSync.reportChannels.length > 0 &&
      channels.length > 0 &&
      userTeamSync.reportChannels.forEach((channel) => {
        if (channel.name == null) {
          let name = channels.find((cha) => cha.id == channel.id);
          txt = txt + name && "#" + name.name + " ";
        } else {
          txt = txt + "#" + channel.name + " ";
        }
      });

    return txt;
  };

  handleClose = () => {
    this.props.modalToggle();
    // this.setState({
    //   page: 0,
    //   name: "",
    //   participants: [],
    //   errors: {},
    //   scheduleType: "recurring",
    //   schedule: [],
    //   time_at: false,
    //   timeZone: "custom_timezone",
    //   moodQuestion: "none",
    //   questions: [],
    //   reportDelivery: "after_wait_time",
    //   waitTime: "1800",
    //   reportChannels: [],
    //   groupResponse: "thread",
    //   showActivity: "true",
    //   teamSyncType: "",
    //   report_members: [],
    //   jiraProject: false,
    //   jiraStatus: false,
    //   jiraBoard: false,
    //   story_points_options: "",
    // });
  };

  setDeafaultState = () => {
    this.setState({
      page: 0,
      name: "",
      participants: [],
      errors: {},
      scheduleType: "recurring",
      schedule: [],
      time_at: false,
      timeZone: "custom_timezone",
      timezone:this.props.user_now.timezone,
      moodQuestion: "none",
      questions: [],
      reportDelivery: "after_every_response",
      waitTime: "1800",
      reportChannels: [],
      groupResponse: 1,
      showActivity: "true",
      teamSyncType: "",
      report_members: [],
      jiraProject: false,
      jiraStatus: false,
      jiraSprint: false,
      jiraBoard: false,
      story_points_options: "",
      pokerIssues: [],
      // loading: false,
      searchQuery: "",
      selectedPokerIssues: [],
      allPokerIssues: [],
      waitTimeArr: WaitTimeArr,
      retroQuestionTemplate: null,
      jiraQuestionCheck: false,
      jiraCustomJQLCheck: false,
      customjql: "",
      jobtype: "multi_day",
      taskCheckinNotmappedParticipants: [],
      selectedPlanningPokerIssueType: "choose_issues",
      planningPokerEstimationtemplate: "custom",
    });
  };

  getTime = (teamsync) => {
    const { user_now } = this.props;

    //hrs, min, srcTZ, targetTZ

    let dt = moment(teamsync.time_at, ["h:mm A"]).format("HH:mm");
    let [hrs, min] = dt.split(":");

    let dateObj = new Date();
    let mDate = moment.tz(moment(dateObj), teamsync.user_id.timezone);
    mDate.set({ hour: hrs, minute: min, second: 0, millisecond: 0 });
    return mDate.tz(user_now.timezone).format("LT");
  };

  weekdays = (schedule) => {
    let Allweekdays = "";
    if (schedule.days.length > 0) {
      for (var day in schedule.days) {
        if (schedule.days.length - 1 != day) {
          Allweekdays += schedule.days[day] + ",";
        } else {
          Allweekdays += schedule.days[day];
        }
      }
    } else {
      Allweekdays = schedule.weekdays;
    }
    let finalWeekArray;
    let weekdays;
    if (schedule._id) {
      let weekDaysString;
      finalWeekArray = [];
      if (schedule.weekdays || schedule.days) {
        weekDaysString = Allweekdays.split(",");
        weekDaysString.forEach((week) => {
          if (week === "1") {
            finalWeekArray.push({
              weekName: "Mon",
              weekValue: week,
            });
          }
          if (week === "2") {
            finalWeekArray.push({
              weekName: "Tue",
              weekValue: week,
            });
          }
          if (week === "3") {
            finalWeekArray.push({
              weekName: "Wed",
              weekValue: week,
            });
          }
          if (week === "4") {
            finalWeekArray.push({
              weekName: "Thu",
              weekValue: "week",
            });
          }
          if (week === "5") {
            finalWeekArray.push({
              weekName: "Fri",
              weekValue: week,
            });
          }
          if (week === "6") {
            finalWeekArray.push({
              weekName: "Sat",
              weekValue: week,
            });
          }
        });
        weekdays = finalWeekArray;
      }
      if (schedule.teamSync_type && (!schedule.createInstance || !schedule.jobType)) {
        return <div> Not scheduled</div>;
      } else {
        return (
          <span>
            {/* <span> Every </span> */}
            <span>
              {weekdays &&
                weekdays.map((week, i) => {
                  if (weekdays.length === 1) {
                    return `${week.weekName} `;
                  } else {
                    if (i === weekdays.length - 1) {
                      // return `and ${week.weekName} `;
                      return `${week.weekName} `;
                    } else {
                      return `${week.weekName} `;
                    }
                  }
                })}
            </span>
            {/* <span>at {schedule.time_at}</span> */}
          </span>
        );
      }
    }
  };

  onWaitTimeSearch = async (value) => {
    let timeSec = this.getTimeZoneTime();
    let private_metadata = {
      ismanual: false,
      tZAbbr: this.getTimezoneAbbr(this.props.user_now.timezone),
      schTime: timeSec,
    };
    let payload = { private_metadata, value };

    const waitTimeArr = await this.waitTime(payload, this.props.user_now);

    this.setState({ waitTimeArr });
  };

  getTimezoneAbbr = (timezone) => {
    let abbr = moment.tz(timezone).zoneAbbr();
    return abbr;
  };

  waitTime = async (payload, user) => {
    try {
      let privateInfo = payload.private_metadata;

      let userTzAbbr = privateInfo.tZAbbr;
      let startTime = new Date(privateInfo.schTime);

      if (payload.value && !(payload.value === "")) {
        // console.log("hello", payload.value)
        let valueArr = payload.value.split(":");
        // console.log(valueArr)
        if (valueArr.length == 2 && valueArr[1].length == 2) {
          let timeHrs = parseInt(valueArr[0]);
          let timeMin = parseInt(valueArr[1]);

          if (!isNaN(timeHrs) && !isNaN(timeMin)) {
            // console.log(timeHrs)
            if (timeHrs >= 12) {
              payload.value += "PM";
            } else {
              payload.value += "AM";
            }
          }
        }
        let data = [];
        await this.props.getDateDuckling(this.props.match.params.wId, payload.value, user.timezone).then((res) => {
          if (res.data.success) {
            data = [...res.data.duclingData];
          }
        });
        let optionsArray = [];
        if (data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            // console.log(data[i].dim)
            if (data[i].dim == "time" && data[i].value.value) {
              let dateStr = data[i].value.value;
              let dateObj = new Date(dateStr);

              // dateObj.setSeconds(00)
              // dateObj.setMilliseconds(000)
              dateObj.setSeconds(0);
              dateObj.setMilliseconds(0);
              let time = dateObj.toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
                timeZone: user.timezone,
              });
              let diff = dateObj.getTime() - startTime.getTime();
              let hrsInMillSec = 24 * 3600 * 1000;
              if (diff <= 0) {
                diff = hrsInMillSec + diff;
              } else if (diff >= hrsInMillSec) {
                diff = diff - hrsInMillSec;
              }
              let hrs = Math.floor(diff / (3600 * 1000));
              let min = (diff % (3600 * 1000)) / (1000 * 60);
              let label = "";
              let value = (diff / 1000).toString();

              if (hrs > 0) {
                label = hrs + (hrs == 1 ? " hour" : " hours");
              }
              if (min > 0) {
                label += " " + min + (min == 1 ? " minute" : " minutes");
              }

              if (privateInfo.ismanual) {
              } else {
                label += "  (" + time + " " + userTzAbbr + ")";
              }
              // let value= diff

              let option = {
                label,
                value,
                custom: true,
              };
              optionsArray.push(option);
            }
          }

          return optionsArray;
        } else {
          //no response from duckling..
          throw "not_found";
        }
      } else {
        return WaitTimeArr;
      }
    } catch (err) {
      console.error(err);
      return {
        options: [],
      };
    }
  };

  getQuestions = () => {
    let questions = [];
    for (let i = 0; i < 10; i++) {
      if (i == 0) {
        questions.push(
          <>
            <div className='title'>Question 1</div>
            <Input
              value={this.state.questions[0].length > 0 ? this.state.questions[0] : this.state.questions[0].question_text}
              onChange={(event) => this.onQuestionChange(event, 0)}
              placeholder='Enter question'
            />
            {this.state.errors.questions && <span className='error-text'>*Question is required</span>}
          </>
        );
      } else {
        questions.push(
          <>
            <div className='title'>Question {i + 1} (optional)</div>
            <Input
              placeholder='Enter question'
              value={
                this.state.questions[i] && this.state.questions[i].question_text
                  ? this.state.questions[i].question_text == "question_removed"
                    ? ""
                    : this.state.questions[i].question_text
                  : this.state.questions[i]
              }
              onChange={(event) => this.onQuestionChange(event, i)}
            />
          </>
        );
      }
    }
    return questions;
  };

  getTaskCheckinParticipants = (participants) => {
    const { userMappingsWithUsers } = this.props;
    // const {participants} = this.state;
    let Participants = [];
    let notMappedParticipants = [];
    participants.forEach((mem) => {
      const user = userMappingsWithUsers.find((member) => member.user_id.user_id === mem);
      user ? Participants.push(mem) : notMappedParticipants.push(mem);
    });
    this.setState({ taskCheckinNotmappedParticipants: notMappedParticipants });
    return Participants;
  };

  getNotmappedParticipants = () => {
    const { taskCheckinNotmappedParticipants } = this.state;
    const { members } = this.props;
    let participants = [];
    taskCheckinNotmappedParticipants.forEach((mem) => {
      const user = members.find((member) => member.user_id._id === mem);
      participants.push(user);
    });
    return (
      <span>
        {participants.map((user) => {
          return (
            <Tag
              color={"gold"}
              key={user.user_id._id}
              style={{ marginTop: "5px" }}
              closable
              onClose={(e) => this.notMappedParticipantClose(user.user_id._id)}
            >
              {user.user_id.displayName || user.user_id.name}
              {/* {user.user_id.name} */}
            </Tag>
          );
        })}
      </span>
    );
  };

  notMappedParticipantClose = (data) => {
    const { taskCheckinNotmappedParticipants } = this.state;
    let users = [...taskCheckinNotmappedParticipants];
    const index = users.findIndex((val) => val === data);
    if (index != -1) {
      users.splice(index, 1);
    }
    this.setState({ taskCheckinNotmappedParticipants: users });
  };

  manageMapping = (e) => {
    e.preventDefault();
    let { wId } = this.props.match.params;
    let jiraSkill = this.props.skills && this.props.skills.find((skill) => skill.name == "Jira");

    //console.info("JiraSkill",jiraSkill)
    let isJiraEnabled = true;
    const enabledSub_skills = jiraSkill.skill_metadata.sub_skills.filter(ss => !ss.disabled)

    if (enabledSub_skills.length === 0) {
      isJiraEnabled = false;
    }
    this.handleClose();
    isJiraEnabled
      ? this.props.history.push(`/${wId}/skills/${jiraSkill.skill_metadata._id}/${enabledSub_skills[0].key}?view=user_mappings`)
      : this.props.history.push(`/${wId}/teamsyncs/integrations/${jiraSkill.skill_metadata._id}`);
  };

  addEmailToOptionsWithSameName = ({members,email,text}) => {
    let str = ''
    const anotherUserWithSameName = members.find(mem => {
      const temp_text = (mem.slackInfo && mem.slackInfo.displayName) || mem.user_id.displayName || mem.user_id.name || mem.user_id.user_name || ""
      if((temp_text === text) && (mem.user_id.email !== email)) return mem
    })
    if(anotherUserWithSameName) str = ` (${email})`
     return str
    }

  render() {
    const { members, channels, userTeamSync, userMappingsWithUsers, projects, jiraBoards, boardStatuses, boardSprints } = this.props;
    const { taskCheckinNotmappedParticipants, teamSyncType /*,newCheckIn*/ } = this.state;
    let filterboardSprints = boardSprints.filter((board) => board && (board.state === "active" || board.state === "future"));
    return (
      <Modal
        visible={this.props.newStandupModalVisible}
        // visible={true}
        title={
          this.state.teamSyncType === 'instant-poker' ? 'Instant planning poker' : this.state.page == 0
            ? "Choose Check-in Template"
            : this.state.page == 1
            ? "Check-in Step 1/3: Schedule"
            : this.state.page == 2
            ? "Check-in Step 2/3: Questions"
            : this.state.page == 3
            ? "Check-in Step 3/3: Reporting"
            : ""
          // teamSyncType === 'dailystandup' || teamSyncType === 'Daily Standup' ? 'Daily Standup' :
          // teamSyncType === 'jiraissuestandup' ? 'Task Check-in' :
          // teamSyncType === 'retrospective' ? 'Retrospective' :
          // teamSyncType === 'team_mood_standup' ? 'Team Mood Check-in' :
          // teamSyncType === 'planning_poker' ? 'Planning Poker' : ''
        }
        // footer={null}
        onCancel={this.handleClose}
        maskClosable={false}
        centered
        bodyStyle={{
          minHeight: this.state.page === 0 ? "74vh" : "65vh",
          maxHeight: this.state.page === 0 ? "74vh" : "65vh",
          overflowY: "scroll",
          background: this.state.page === 0 && localStorage.getItem("theme") === "default" && "#ececec",
        }}
        footer={
          this.state.teamSyncType === 'instant-poker' ? <div>
            <Button style={{ marginRight: "5px" }} onClick={this.onPrevious}>
              Previous
            </Button>

            {this.props.team && this.props.team.id ? <Button
            type="primary"
            target='_blank'
            href={`https://slack.com/app_redirect?app=${localStorage.getItem("app") || "AE4FF42BA"}&team=${this.props.team.id}`}
          >
            <SlackOutlined/>Go to Slack
          </Button> :  ''}
          </div> : <div>
            {this.state.page != 0 && (
              <div className='prenxt'>
                <Button style={{ marginRight: "5px" }} disabled={this.props.edit && this.state.page === 1 && true} onClick={this.onPrevious}>
                  Previous
                </Button>

                <Button type='primary' onClick={this.onNext} disabled={this.state.isTeamsyncCreateButtonDisabled}>
                  {this.state.page == 3 ? (this.props.edit ?this.props.isCopying?"Create":"Update" : "Create") : "Next"}
                </Button>
              </div>
            )}
          </div>
        }
      >
        {/* page 0 */}
        {this.state.page === 0 && (
          <div
            style={{
              background: localStorage.getItem("theme") == "default" ? "#ECECEC" : "#1f1f1f",
              padding: "30px",
              // overflowY: "scroll",
              // height: "70vh",
            }}
          >
            <TeamSyncTemplates handleTemplateSelect={(value, sendanonymous) => this.handleTemplateSelect(value, sendanonymous)} from='modal' />
          </div>
        )}

        {/* page 1 */}
        {this.state.page === 1 && (
          this.state.teamSyncType === 'instant-poker' ? 
          "To conduct instant planning poker with your team, head over to the designated slack channel and type the command ‘/t poker’. To estimate a jira issue, type the command ‘/t poker (issue_id)’. Once you hit enter, a model will appear where you would need to fill in the task summary, choose the estimation points template and also select the designated channel. Once you fill in these details and hit enter, your team can estimate the task. After everyone has completed estimating, a report would be generated and sent in the same channel. You can also rerun the planning poker until a consensus is reached."
          : <div>
            {/* Name */}
            <div className='title' style={{ marginTop: "-15px" }}>
              Name
            </div>
            <Input value={this.state.name} onChange={this.onNameChange} />
            {this.state.errors.name && <span className='error-text'>*Enter name</span>}

            <div className='title'>Add members of channel to participants</div>
            <Select
              onChange={this.addMemebersfromChannel}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              className='Select'
              placeholder='Choose a channel'
              showSearch
              allowClear={true}
              loading = {this.state.channelsLoading}
            >
              {channels.length > 0 &&
                channels.map((channel) => {
                  return <Option key={channel.id}>{channel.name}</Option>;
                })}
            </Select>

            {/* Participants */}
            {/* ---------------------- if you enable edit option for shared check-in then disable "Participants" ------------------------- */}
            {/* {(newCheckIn || !userTeamSync.isShared) && <div> */}
            {
              <div>
                <div className='title'>Participants</div>
                <Select
                  onChange={this.handleParticipantChange}
                  filterOption={(input, option) => option.props.children.indexOf(input.toLowerCase()) >= 0 || option.email.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.name.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  mode='multiple'
                  placeholder='Select Participants'
                  allowClear={true}
                  className='Select'
                  value={this.state.participants}
                >
                  {this.state.teamSyncType == "dailystandup" ||
                  this.state.teamSyncType == "Daily Standup" ||
                  this.state.teamSyncType == "retrospective" ||
                  this.state.teamSyncType == "planning_poker" ||
                  this.state.teamSyncType == "team_mood_standup"
                    ? members && members.map((mem) => {
                      return (
                        <Option key={mem.user_id._id} email={mem.user_id.email || ''} name={mem.user_id.name || ''} value={mem.user_id._id} label={mem.user_id._id}>
                          {`${(mem.slackInfo && mem.slackInfo.displayName) || mem.user_id.displayName || mem.user_id.name || mem.user_id.user_name || ""}${this.addEmailToOptionsWithSameName({text : (mem.slackInfo && mem.slackInfo.displayName) || mem.user_id.displayName || mem.user_id.name || mem.user_id.user_name || "",members,email:mem.user_id.email || ''})}`}
                          {/* {mem.user_id.name || mem.user_id.user_name || ""} */}
                        </Option>
                      );
                    })
                    : userMappingsWithUsers &&
                      userMappingsWithUsers.map((mem) => {
                        return (
                          <Option key={mem.user_id.user_id} value={mem.user_id.user_id} label={mem.user_id.user_id} email={mem.user_id.email || ''} name={mem.user_id.name || ''}>
                            {`${mem.user_id.displayName || mem.user_id.name || mem.user_id.user_name || ""}${this.addEmailToOptionsWithSameName({text : mem.user_id.displayName || mem.user_id.name || mem.user_id.user_name || "",members:userMappingsWithUsers,email:mem.user_id.email || ''})}`}
                            {/* {mem.user_id.name || mem.user_id.user_name || ""} */}
                          </Option>
                        );
                      })}
                </Select>
                {taskCheckinNotmappedParticipants.length > 0 && (
                  <span style={{ marginTop: "5px" }}>Not mapped participants : {this.getNotmappedParticipants()}</span>
                )}
                {this.state.teamSyncType == "jiraissuestandup" && (
                  <Alert
                    message={
                      <span className='empty-alert-text'>
                        {"Only users mapped to Jira accounts can be added. "}
                        <a href='/' onClick={this.manageMapping}>
                          Manage Mapping
                        </a>
                      </span>
                    }
                    style={{ textAlign: "center", marginTop: "15px" }}
                  />
                )}
                {this.state.errors.participant && <span className='error-text'>*Select Participant</span>}
              </div>
            }

            {/* Schedule Type */}
            {/* this.state.teamSyncType != "planning_poker" && */ (
              <>
                <div className='title'>Pick a schedule type</div>
                <Select
                  onChange={this.handleScheduleTypeChange}
                  // value={this.state.scheduleType}
                  value={this.state.jobtype == "every_day_at" ? "multi_day" : this.state.jobtype}
                  className='Select'
                >
                  {/* <Option
                    key={"recurring"}
                    value={"recurring"}
                    label={"recurring"}
                  >
                    Recurring
                  </Option> */}
                  <Option key={"manual"} value={"manual"} label={"manual"}>
                    Manual
                  </Option>
                  <Option key={"multi_day"} value={"multi_day"} label={"multi_day"}>
                    Every week
                  </Option>
                  <Option key={"weekly_2"} value={"weekly_2"} label={"weekly_2"}>
                    Every 2 weeks
                  </Option>
                  <Option key={"weekly_3"} value={"weekly_3"} label={"weekly_3"}>
                    Every 3 weeks
                  </Option>
                  <Option key={"weekly_4"} value={"weekly_4"} label={"weekly_4"}>
                    Every 4 weeks
                  </Option>
                  <Option key={"first_week"} value={"first_week"} label={"first_week"}>
                    First week of month
                  </Option>
                  <Option key={"last_week"} value={"last_week"} label={"last_week"}>
                    Last week of month
                  </Option>
                </Select>
              </>
            )}

            {this.state.scheduleType === "recurring" && (
              //   recurring
              <>
                {/* Schedule */}
                <div className='title'>Pick a schedule</div>
                <Select
                  onChange={this.handleScheduleChange}
                  value={this.state.schedule}
                  mode='multiple'
                  allowClear={true}
                  className='Select'
                  showSearch={true}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <Option key={"0"} value={"0"} label={"every sunday"}>
                    Every Sunday
                  </Option>
                  <Option key={"1"} value={"1"} label={"every monday"}>
                    Every Monday
                  </Option>
                  <Option key={"2"} value={"2"} label={"every tuesday"}>
                    Every Tuesday
                  </Option>
                  <Option key={"3"} value={"3"} label={"every wednesday"}>
                    Every Wednesday
                  </Option>
                  <Option key={"4"} value={"4"} label={"every thursday"}>
                    Every Thursday
                  </Option>
                  <Option key={"5"} value={"5"} label={"every friday"}>
                    Every Friday
                  </Option>
                  <Option key={"6"} value={"6"} label={"every staurday"}>
                    Every Saturday
                  </Option>
                </Select>
                {this.state.errors.schedule && <span className='error-text'>*Select Schedule</span>}

                {/* Time (Questions will be asked at selected time) */}
                <div className='title'>Time (Questions will be asked at selected time)</div>
                <Select
                  onChange={this.handleTimeChange}
                  placeholder='Select Time'
                  className='Select'
                  value={this.state.time_at}
                  showSearch={true}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {timeArr.map((time) => {
                    return <Option key={time.value}>{time.value}</Option>;
                  })}
                </Select>
                {this.state.errors.time_at && <span className='error-text'>*Select Time</span>}

                {/* Time zone (Start typing below to find your time zone)*/}
                <div className='title'>Time zone (Start typing below to find your time zone)</div>
                <Select
                  onChange={this.handleTimeZoneTypeChange}
                  placeholder='Select Time'
                  className='Select'
                  value={this.state.timezone}
                  showSearch
                  autoClearSearchValue
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <Option key={"user_timezone"}>User local time zone</Option>
                  {/* <Option key={"custom_timezone"}>{this.props.user_now.timezone}</Option> */}
                  {TimeZones.map((item, index) => {
                    return (
                      <Option key={index} value={item}>
                        {item}
                      </Option>
                    );
                  })}
                </Select>
                <span>
                  <a href='https://en.wikipedia.org/wiki/List_of_tz_database_time_zones' target='_blank'>
                    Click here
                  </a>{" "}
                  to see list of time zones.
                </span>
              </>
            )}
          </div>
        )}

        {/* <<<<<<<<<<<<<<<<<<<<<<<< page 2 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
        {this.state.page === 2 &&
          (this.state.teamSyncType == "dailystandup" ||
          this.state.teamSyncType == "Daily Standup" ||
          this.state.teamSyncType == "retrospective" ||
          this.state.teamSyncType == "team_mood_standup" ? (
            <>
              {/* mood question */}
              {(this.state.teamSyncType == "dailystandup" ||
                this.state.teamSyncType == "Daily Standup" ||
                this.state.teamSyncType == "team_mood_standup") && (
                <>
                  <div className='title' style={{ marginTop: "-15px", marginBottom: "10px" }}>
                    {this.state.teamSyncType == "team_mood_standup" ? "Team mood question" : "Select your team mood question"}
                  </div>
                  {this.state.teamSyncType == "team_mood_standup" ? (
                    <>
                      <Input value={this.state.moodQuestion} onChange={this.handleMoodQuestionChange} />
                      {this.state.errors.moodquestion && (
                        <span className='error-text'>
                          *Question is required
                          <br />
                        </span>
                      )}
                      <Text type='secondary' style={{ display: "inline-block", marginTop: 5 }}>
                        Participants will be presented with 5 emoji options to choose from. To customize the emojis and associated mood text, go to
                        Check-in settings in web app after creating the Check-in.
                      </Text>
                    </>
                  ) : (
                    <Select onChange={this.handleMoodQuestionChange} value={this.state.moodQuestion} className='Select'>
                      <Option key={"none"}>None</Option>
                      <Option key={"How are you feeling today?"}>How are you feeling today?</Option>
                      <Option key={"How do you feel about your day today?"}>How do you feel about your day today?</Option>
                    </Select>
                  )}
                </>
              )}
              {/* questions */}
              {this.state.teamSyncType == "retrospective" && (
                <>
                  {" "}
                  <div className='' style={{ marginTop: "-15px" }}>
                    Select Question Template
                  </div>
                  <Select
                    placeholder='Select template'
                    onChange={this.handleRetroQuestionTempChange}
                    value={this.state.retroQuestionTemplate}
                    className='Select'
                  >
                    {Object.keys(retroQuestionTemplates).map((template) => {
                      return <Option key={template}>{template}</Option>;
                    })}
                  </Select>
                </>
              )}
              {/* <div
                className='title'
                style={{
                  marginTop:
                    this.state.teamSyncType == "retrospective" && "-15px",
                }}
              >
                Question 1
              </div>
              <Input
                value={
                  this.state.questions[0].length > 0
                    ? this.state.questions[0]
                    : this.state.questions[0].question_text
                }
                onChange={(event) => this.onQuestionChange(event, 0)}
                placeholder='Enter question'
              />
              {this.state.errors.questions && (
                <span className='error-text'>*Question is required</span>
              )}
              <div className='title'>Question 2 (optional)</div>
              <Input
                value={
                  this.state.questions[1] &&
                  this.state.questions[1].question_text
                    ? this.state.questions[1].question_text ==
                      "question_removed"
                      ? ""
                      : this.state.questions[1].question_text
                    : this.state.questions[1]
                }
                onChange={(event) => this.onQuestionChange(event, 1)}
                placeholder='Enter question'
              />
              <div className='title'>Question 3 (optional)</div>
              <Input
                value={
                  this.state.questions[2] &&
                  this.state.questions[2].question_text
                    ? this.state.questions[2].question_text ==
                      "question_removed"
                      ? ""
                      : this.state.questions[2].question_text
                    : this.state.questions[2]
                }
                onChange={(event) => this.onQuestionChange(event, 2)}
                placeholder='Enter question'
              />
              <div className='title'>Question 4 (optional)</div>
              <Input
                placeholder='Enter question'
                value={
                  this.state.questions[3] &&
                  this.state.questions[3].question_text
                    ? this.state.questions[3].question_text ==
                      "question_removed"
                      ? ""
                      : this.state.questions[3].question_text
                    : this.state.questions[3]
                }
                onChange={(event) => this.onQuestionChange(event, 3)}
              />
              <div className='title'>Question 5 (optional)</div>
              <Input
                placeholder='Enter question'
                value={
                  this.state.questions[4] &&
                  this.state.questions[4].question_text
                    ? this.state.questions[4].question_text ==
                      "question_removed"
                      ? ""
                      : this.state.questions[4].question_text
                    : this.state.questions[4]
                }
                onChange={(event) => this.onQuestionChange(event, 4)}
              />*/}
              {this.state.teamSyncType != "team_mood_standup" && this.getQuestions()}
            </>
          ) : this.state.teamSyncType == "jiraissuestandup" ? (
            // <<<<<<<<<< jiraissuestandup >>>>>>>>>>>>>>>>>>>>
            <>
              <div className='title' style={{ marginTop: "-15px" }}>
                <span style={{ fontWeight: "normal" }}>
                  Participants will be sent the list of issues assigned to them with additional filters below
                </span>
                <br />
              </div>
              <Checkbox
                style={{ marginTop: "8px", marginBottom: "8px" }}
                onChange={this.jiraCustomJQLCheckChange}
                checked={this.state.jiraCustomJQLCheck}
              >
                Use custom JQL filter
              </Checkbox>
              <br />
              {this.state.jiraCustomJQLCheck ? (
                <>
                  <div>JQL</div>
                  <TextArea onChange={this.handleCustomJQL} value={this.state.customjql} placeholder='Type custom JQL query here' rows={4} />

                  {this.state.errors.customjql && (
                    <span className='error-text'>
                      {this.state.errors.customjql} <br />
                    </span>
                  )}
                </>
              ) : (
                <>
                  <div>Project</div>
                  <Select
                    className='Select'
                    placeholder='Select a Project'
                    onChange={this.handleJiraProjectSelect}
                    value={this.state.jiraProject && this.state.jiraProject.projectId}
                    showSearch={true}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    // allowClear
                  >
                    {projects &&
                      projects.map((project) => {
                        return (
                          <Option key={project.id} value={project.id}>
                            {project.name}
                          </Option>
                        );
                      })}
                  </Select>
                  {this.state.errors.jiraProject && <span className='error-text'>*Select a Project</span>}

                  <div className='title'>Board</div>
                  <Select
                    className='Select'
                    placeholder='Select a Board'
                    onChange={this.handleJiraBoardChange}
                    value={this.state.jiraBoard ? this.state.jiraBoard.boardId : ""}
                    showSearch={true}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    // allowClear
                  >
                    {jiraBoards &&
                      jiraBoards.map((board) => {
                        return (
                          <Option key={board.id} value={board.id}>
                            {board.name}
                          </Option>
                        );
                      })}
                  </Select>
                  {this.state.errors.jiraBoard && <span className='error-text'>*Select a Board</span>}
                  <div className='title'>Default Status</div>
                  <div>
                    Issues in this status will be shown to participants by default. Status filter can be changed while answering this Check-in
                  </div>
                  <Select
                    className='Select'
                    placeholder='Select a Status'
                    onChange={this.handleJiraStatusChange}
                    value={this.state.jiraStatus && this.state.jiraStatus.statusId}
                    showSearch={true}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    // allowClear
                  >
                    {boardStatuses &&
                      boardStatuses.map((status) => {
                        return (
                          <Option key={status.id} value={status.id}>
                            {status.name}
                          </Option>
                        );
                      })}
                  </Select>
                  {this.state.errors.jiraStatus && (
                    <span className='error-text'>
                      *Select a Status <br />
                    </span>
                  )}

                  <div className='title'> Sprint (optional)</div>

                  <Select
                    className='Select'
                    placeholder='Select a Sprint'
                    onChange={this.handleJiraSprintChange}
                    allowClear
                    value={this.state.jiraSprint && this.state.jiraSprint.sprintid}
                    showSearch={true}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    // allowClear
                  >
                    {filterboardSprints &&
                      filterboardSprints.map((sprint) => {
                        return (
                          <Option key={sprint.id} value={sprint.id}>
                            {sprint.name}
                          </Option>
                        );
                      })}
                  </Select>
                </>
              )}

              <Checkbox style={{ marginTop: "15px" }} onChange={this.onJiraQuestionCheckboxChange} checked={this.state.jiraQuestionCheck}>
                Add Questions
              </Checkbox>
              {this.state.jiraQuestionCheck && this.getQuestions()}
            </>
          ) : (
            //<<<<<<<<<<<<< planning poker >>>>>>>>>>>>>>>>>>>
            <>
              Configure issues and available estimation options here.
              <br />
              <div className='title'>Choose issues OR set JQL for the issues</div>
              <Select className='Select' value={this.state.selectedPlanningPokerIssueType} onChange={this.handlePokerisssueType}>
                <Option key={"choose_issues"} value={"choose_issues"}>
                  Choose Issues
                </Option>
                <Option key={"configure_jql"} value={"configure_jql"}>
                  Configure JQL
                </Option>
              </Select>
              {this.state.selectedPlanningPokerIssueType === "choose_issues" ? (
                <>
                  <div className='title'>Select Jira issues</div>
                  <Select
                    className='Select'
                    placeholder='Select Jira issues'
                    onChange={this.handlePokerIssueSelect}
                    onSearch={this.handleJiraSearchChange}
                    value={this.state.questions.map((issue) => (issue.key ? issue.key : issue.meta.key))}
                    // notFoundContent={
                    //   this.state.loading ? <Spin size='small' /> : null
                    // }
                    onBlur={this.onSearchClose}
                    filterOption={false}
                    showSearch={true}
                    mode={"multiple"}
                    allowClear
                  >
                    {this.state.pokerIssues.map((issue, index) => {
                      return (
                        <Option key={`${issue.id}`} value={`${issue.key}`} label={issue.summaryText}>
                          ({issue.key}) {issue.summaryText}
                        </Option>
                      );
                    })}
                  </Select>
                  {this.state.errors.jiraIssues && <span className='error-text'>*Select Jira Issues</span>}
                </>
              ) : (
                <>
                  <div className='title'>JQL</div>
                  <TextArea onChange={this.handleCustomJQL} value={this.state.customjql} placeholder='Type custom JQL query here' rows={4} />
                  {this.state.errors.customjql && (
                    <span className='error-text'>
                      {this.state.errors.customjql} <br />
                    </span>
                  )}
                  {this.state.errors.customjql_project_not_found && this.state.errors.customjql_project_not_found.error && (
                    <span className='error-text'>
                      {this.state.errors.customjql_project_not_found.msg} <br />
                    </span>
                  )}
                </>
              )}
              <div className='title'>Choose estimation options template</div>
              <Select className='Select' value={this.state.planningPokerEstimationtemplate} onChange={this.handlePokerEstimationType}>
                <Option key={"fibonacci"} value={"fibonacci"}>
                  Fibonacci
                </Option>
                <Option key={"linear"} value={"linear"}>
                  Linear
                </Option>
                <Option key={"tshirt"} value={"tshirt"}>
                  T-shirt
                </Option>
                <Option key={"custom"} value={"custom"}>
                  Custom
                </Option>
              </Select>
              <div className='title'>Story points options</div>
              <Input placeholder='Story points options' value={this.state.story_points_options} onChange={this.handleStroryPointChange} />
              <div>Comma seprated options like 1,2,3,4,5.</div>
              {this.state.errors.storyPoint && <span className='error-text'>*Enter Story points options</span>}
            </>
          ))}

        {/* page 3 */}
        {this.state.page === 3 && (
          <>
            {/* Report Delivery */}

            {/* {(this.state.teamSyncType == "dailystandup" ||
              this.state.teamSyncType == "Daily Standup" ||
              this.state.teamSyncType == "retrospective") && ( */}

            {this.state.teamSyncType !== "jiraissuestandup" && (
              <span>
                <div className='title' style={{ marginTop: "-15px" }}>
                  Report Delivery
                </div>
                <Select onChange={this.handlereportDeliveryChange} value={this.state.reportDelivery} className='Select'>
                  <Option key={"after_wait_time"}>After wait time</Option>
                  {this.state.teamSyncType !== "planning_poker" && <Option key={"after_every_response"}>After each response</Option>}
                  {this.state.teamSyncType === "planning_poker" && (
                    <Option key={"after_all_response"}>After wait time OR all responses received</Option>
                  )}
                </Select>
                {this.state.teamSyncType === "retrospective" && (
                  <Alert
                    message={<span className='empty-alert-text'>Recomended to use after wait time</span>}
                    style={{ textAlign: "center", marginTop: "15px" }}
                  />
                )}
              </span>
            )}
            {/* )} */}

            {/* Wait time */}
            <div
              className='title'
              style={{
                marginTop: this.state.teamSyncType === "jiraissuestandup" && "-15px",
              }}
            >
              Wait Time
            </div>
            <Select
              onChange={this.handlewaitTimeChange}
              value={this.state.waitTime}
              className='Select'
              showSearch={this.state.scheduleType == "recurring" && true}
              filterOption={false}
              onSearch={(value) => this.onWaitTimeSearch(value)}
            >
              {this.state.waitTimeArr.map((time) => {
                return (
                  <Option key={time.value} label={time.label} value={time.value}>
                    {time.label}
                    {/* {this.getWaitTimeLabel(parseInt(time.value) * 1000)} */}
                    {this.state.scheduleType == "recurring" &&
                      !time.custom &&
                      `(${this.getLabelTime(time.value)} ${moment.tz(this.props.user_now.timezone).zoneAbbr()})`}
                  </Option>
                );
              })}
              {(this.state.teamSyncType === "dailystandup" ||
                this.state.teamSyncType === "Daily Standup" ||
                this.state.teamSyncType === "planning_poker" ||
                this.state.teamSyncType === "retrospective" ||
                this.state.teamSyncType === "retrospectiveanonymous") && /* when wait timme is set to 72 hrs it's already added in the waitTimeArr */ !this.state.waitTimeArr.find(t => t.value === '259200') && (
                <Option key={'259200'} label={"72 hours"} value={'259200'}>
                  {"72 hours"}
                  {this.state.scheduleType == "recurring" &&
                    true &&
                    `(${this.getLabelTime("259200")} ${moment.tz(this.props.user_now.timezone).zoneAbbr()})`}
                </Option>
              )}
            </Select>
            {this.state.timeZone == "user_timezone" && this.state.scheduleType == "recurring" && (
              <a href='https://www.notion.so/trooprdocs/Setting-up-Standup-for-multiple-timezones-50594766f2124dba8b393c991a2c54db' target='_blank'>
                Wait time is relative to the time zone that will trigger last.
              </a>
            )}
            <br></br>
            <Alert
              message={<span className='empty-alert-text'>Select at least one channel or user to send report to.</span>}
              style={{ textAlign: "center", marginTop: "15px" }}
            />
            {/* Send report to channels */}
            <div className='title'>Send report to channels (optional)</div>
            <Select
              onChange={this.handlereportChannelChange}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              className='Select'
              value={this.state.reportChannels && this.state.reportChannels.length > 0 ? this.state.reportChannels.map((cha) => cha.id) : []}
              placeholder='Choose a channel'
              mode='multiple'
              showSearch
              allowClear={true}
              loading = {this.state.channelsLoading}
            >
              {channels.length > 0 &&
                channels.map((channel) => {
                  return <Option key={channel.id}>{channel.name}</Option>;
                })}
            </Select>
            {this.state.errors.reportChannels && <span className='error-text'>*Please select at least one channel or a person to send reports.</span>}

            {/* Send report to people */}
            <div className='title'>Send report to people (optional)</div>
            <Select
              onChange={this.handlereportMembersChange}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.email.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.name.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              mode='multiple'
              placeholder='Select Report Members'
              allowClear={true}
              className='Select'
              value={
                this.state.report_members[0] && this.state.report_members[0]._id
                  ? this.state.report_members.map((rm) => rm._id)
                  : this.state.report_members
              }
            >
              {members &&
                members.map((mem) => {
                  return (
                    <Option key={mem.user_id._id} value={mem.user_id._id} label={mem.user_id._id} email={mem.user_id.email || ''} name={mem.user_id.name || ''}>
                      {`${(mem.slackInfo && mem.slackInfo.displayName) || mem.user_id.displayName || mem.user_id.name || mem.user_id.user_name || ""}${this.addEmailToOptionsWithSameName({text : (mem.slackInfo && mem.slackInfo.displayName) || mem.user_id.displayName || mem.user_id.name || mem.user_id.user_name || "",members,email:mem.user_id.email || ''})}`}

                      {/* {mem.user_id.displayName || mem.user_id.name} */}
                      {/* {mem.user_id.name} */}
                    </Option>
                  );
                })}
            </Select>
            {this.state.errors.report_members && <span className='error-text'>*Please select at least one channel or a person to send reports.</span>}

            {/* Group responses in thread */}
            {this.state.teamSyncType != "planning_poker" && this.state.teamSyncType != "team_mood_standup" && (
              <span>
                {" "}
                <div className='title'>Response grouping</div>
                <Select onChange={this.handleGroupResponseChange} value={this.state.groupResponse} className='Select'>
                  {getGroupingOptions(this.state.teamSyncType)}+{" "}
                  {/* <Option key={"thread"}>Yes</Option>
+                  <Option key={"messages"}>No</Option> */}
                </Select>
              </span>
            )}

            {/* Show Task Activity */}
            {(this.state.teamSyncType == "dailystandup" || this.state.teamSyncType == "Daily Standup") && (
              <span>
                {/* <div className='title'>Show Task Activity</div> */}
                <div className='title'>Show activity from Jira</div>
                <Select onChange={this.handleShowActivityChange} value={this.state.showActivity} className='Select'>
                  <Option key={"true"}>Yes</Option>
                  <Option key={"false"}>No</Option>
                </Select>
              </span>
            )}
          </>
        )}
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  user_now: state.common_reducer.user,
  members: state.skills.members,
  channels: state.skills.channels,
  userTeamSync: state.skills.userTeamSync,
  workspace: state.common_reducer.workspace,
  userMappingsWithUsers: state.skills.userMappingsWithUsers,
  skills: state.skills.skills,
  projects: state.skills.projects,
  jiraBoards: state.skills.jiraBoards,
  boardStatuses: state.skills.boardStatuses,
  boardSprints: state.skills.jiraSprints,
  currentSkillUser: state.skills.currentSkillUser,
  team: state.skills.team
});
export default withRouter(
  connect(mapStateToProps, {
    getChannelList,
    createTeamSync,
    editTeamSync,
    getUserMappingAndUsers,
    getProject,
    getJiraProjectStatues,
    getJiraBoards,
    getBoardStatuses,
    getJiraIssuePicker,
    getDateDuckling,
    getJiraBoardSprint,
    sendTeamsyncAck,
    excecuteTeamSync,
    recentCheckins,
  })(CreateTeamsyncModal)
);

{
  /* <Row gutter={[16, 16]}>
<Col span={24}>
  <Card
    hoverable={true}
    title='Custom Check-in'
    bordered={false}
    extra={<Button>Choose</Button>}
  >
    Create custom asynchronous Slack meeting with custom
    questions, schedule and reporting
  </Card>
</Col>
<Col span={24}>
  <Card
    hoverable={true}
    title='Standup'
    bordered={false}
    extra={
      <Button
        onClick={() => this.handleTemplateSelect("dailystandup")}
      >
        Choose
      </Button>
    }
    onClick={() => this.handleTemplateSelect("dailystandup")}
  >
    Daily team meeting for quick status update
  </Card>
</Col>
<Col span={24}>
  <Card
    hoverable={true}
    title='Retrospective'
    bordered={false}
    extra={
      <Button
        onClick={() => this.handleTemplateSelect("retrospective")}
      >
        Choose
      </Button>
    }
    onClick={() => this.handleTemplateSelect("retrospective")}
  >
    End of Project / Sprint meeting to self inspect and plan for
    future improvements
  </Card>
</Col>
</Row> */
}
