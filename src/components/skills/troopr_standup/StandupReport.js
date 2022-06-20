import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
// import { SkillsAction } from "../settings/settings_action";
import Calender from "./calender";
import Retrospective from "./retrospective/retrospective";
import RetroCommentModal from "./retrospective/retrocommentmodel";
import RetroActionItems from "./retrospective/retroActionItems";
import axios from "axios";
import {
  CaretRightOutlined,
  DeleteOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  LeftOutlined,
  MoreOutlined,
  PauseOutlined,
  RightOutlined,
  SettingOutlined,
  ThunderboltOutlined,
  EditOutlined,
  CopyOutlined
} from "@ant-design/icons";
import Picker from "emoji-picker-react";
import {toHTML} from "slack-markdown"
import 'emoji-mart/css/emoji-mart.css'
import CreateTeamsyncModal from "./createTeamsyncModal";
import NextAnswer from "./nextAnswer/NextAnswer"
// import { Icon as LegacyIcon } from "@ant-design/compatible";
import {
  Typography,
  Row,
  Col,
  Button,
  Tag,
  Table,
  Menu,
  Modal,
  Dropdown,
  Tooltip,
  Popconfirm,
  Empty,
  Layout,
  PageHeader,
  Input,
  Spin,
  Avatar,
  message,
  Card,
  Switch,
  Select,
  Collapse,
  Popover,
  Statistic,
  Tabs
} from "antd";
import queryString from "query-string";
import moment from "moment";
import {
  getUserTeamSync,
  getUsersSelectedTeamSync,
  getProjectTeamSyncInstance,
  getAnotherInstancePage,
  editTeamSync,
  excecuteTeamSync,
  deleteteamsync,
  setCurrentTeamsync,
  sendTeamsyncAck,
  exportToCsv,
  deleteTeamInstance,
  getJiraUserActivity,
  getAssisantSkills,
  getUserMappingAndUsers,
  updateUserHoliday,
  answerTeamSync,
  updateTeamSyncCustomEmoji,
  addLikeToStandupVer2,
  addLikeToStandup,
  getUser,
  deleteRecentTeamsync,
  deleteTeamSyncAdmin,
  addTeamSyncAdmin,
  getChannelList
} from "../skills_action";
// import Engagement from "./StandupEngagement";
// import History from "./StandupHistory";
import Insights from "./insights";
import ReportNotGenerated from "./ReportNotGenerated"
import { BellOutlined, MessageOutlined, CommentOutlined, LikeOutlined } from "@ant-design/icons";
import AnswerModal from "./teamSyncAnswerModal";
import JiraActivityModal from "./jiraActivityModal";
import "./Standupreport.css"
const { Paragraph, Text, Link } = Typography;
const { Sider, Content } = Layout;
const { Option } = Select;
const { confirm } = Modal;
const { TabPane } = Tabs;

class Standup_Head extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showmystandups: false,
      showreport: false,
      loading: false,
      islatestinstance: false,
      instance: "",
      teamSyncId: "",
      teamSyncName: "",
      teamSyncAdmins: [],
      workspaceUserList: [],
      noInstance: "",
      weekdays: [],
      // trooprUserId: "",
      modalVisible: false,
      // allreadyhappened: false,
      // isToggleOn: true,
      showmore: false,
      showCommentModal: false,
      showCommentModalMoodCheckin: {},
      comments: [],
      likeCommentData: {},
      // currentPage: 1,
      isJiraLinked: "",
      upcomingStandup: true,
      showCalender: true,
      isAdmin: false,
      isTeamSyncAdmin: false,
      collapsed: true,
      subview: "report",
      currentActiveKey: "1",
      selectedMembers: "",
      selectedRows: [],
      currentMemberSelected: "",
      selectedRowKeys: [],
      answerModalVisible: true,
      ansUpdate: false,
      jiraSkill: false,
      newStandupModalVisible: false,
      edit: false,
      selectedTeamSyncForEdit: false,
      jiraActivityModalVisible: false,
      selectedActivityData: {},
      isRunNowHappened: false,
      handleSubmissionAfterWaitTime: true,
      handleUpdateAfterWaitTime: true,
      customEmoji: [{}, {}, {}, {}, {}],
      selectedTeamsyncForCopy:null,
      visible: [false, false, false, false, false],
      isCopying:false,
      nextAnswerModalVisible:false,
      checkInName: ""
    };

    // this.showmystandups = this.showmystandups.bind(this);
    // this.showreport = this.showreport.bind(this);
    // this.getAnotherInstance = this.getAnotherInstance.bind(this);
    this.thredAnswer = this.thredAnswer.bind(this);
    // this.toggle = this.toggle.bind(this);
    // this.weekdays = this.weekdays.bind(this);
  }

  checkisResponded = (instanceResponses, projectTeamSyncInstance) => {
    if (instanceResponses && instanceResponses.length > 0 && projectTeamSyncInstance && projectTeamSyncInstance._id) {
      // console.log(1);
      let ts = projectTeamSyncInstance && projectTeamSyncInstance.teamSync_metdata;
      if (ts && ts.report_type === "after_every_response") {
        // console.log(2);
        let isReplied = instanceResponses.find((res) => res.status === "replied");
        if (isReplied) {
          // console.log(3);
          return true;
        } else {
          // console.log(4);
          return false;
        }
      } else {
        // console.log(5);
        return false;
      }
    } else {
      // console.log(6);
      return false;
    }
  };

onCopyStandup=(e,userTeamSync)=>{
if(e&&e.key==="copy_standup"){
   if (userTeamSync._id) {
     userTeamSync.name=`Copy of ${this.state.checkInName}`
      this.setState({edit:true,selectedTeamSyncForEdit: userTeamSync,isCopying:true }, () => {
        this.setState({ newStandupModalVisible: true });
      });
    } else {
      message.error("some error occurred");
    }
}
}

answerNextModalToggle=()=>{
  this.setState({nextAnswerModalVisible:!this.state.nextAnswerModalVisible})
}


  changeEmojiText = (index, item, event) => {
    const { customEmoji } = this.state;
    let setCustomEmoji = [...customEmoji];

    //if(!setCustomEmoji){
    //setCustomEmoji=[{},{},{},{},{}]
    //}
    setCustomEmoji[index].text = event.target.value;
    this.setState({
      customEmoji: setCustomEmoji,
    });
  };
  onEmojiClick = (index, event, emojiObject) => {
    const { customEmoji, visible } = this.state;
    let setCustomEmoji = [...customEmoji];
    let setVisible = [...visible];
    //if(!setCustomEmoji){
    // setCustomEmoji=[{},{},{},{},{}]
    // }
    setCustomEmoji[index].emoji = emojiObject.emoji;
    setVisible[index] = false;
    this.setState({
      customEmoji: setCustomEmoji,
      visible: setVisible,
    });
  };
  handleVisibleChange = (popOverVisible, index) => {
    const { visible } = this.state;
    let setVisible = [...visible];
    setVisible[index] = popOverVisible;
    this.setState({ visible: setVisible });
  };
  picker_popover_content = (
    <Picker
      disableSearchBar
      onEmojiClick={() => this.onEmojiClick()}
      groupVisibility={{
        flags: false,
        animals_nature: false,
        food_drink: false,
        travel_places: false,
        activities: false,
        objects: false,
        symbols: false,
        recently_used: false,
      }}
    />
  );

  getCurrentAnswerCommentCount = (item, report) => {
    let currentAnswerComments =
      item &&
      item.comment_id &&
      item.comment_id.filter((comment) => {
        return (
          comment.questionid ===
          ((report && report.question && report.question.id && report.question.id._id) || (report && report.question && report.question.id))
        );
      });

    return currentAnswerComments && currentAnswerComments.length > 0 ? currentAnswerComments.length : "";
  };

  handleCommentClick = (item, report) => {
    const { userTeamSync } = this.props;
    let totalVotes = item.votes;
    let currentAnswerVotes = totalVotes.filter((vote) => {
      return (
        vote.questionid ===
        (report && ((report.question && report.question.id && report.question.id._id) || (report && report.question && report.question.id)))
      );
    });
    let currentAnswerComments = item.comment_id.filter((comment) => {
      return (
        comment.questionid ===
        ((report && report.question && report.question.id && report.question.id._id) || (report && report.question && report.question.id))
      );
    });

    let data = {
      user_id: this.props.user_now && this.props.user_now._id,
      workspace_id: this.props.match.params.wId,
      questionid: report && ((report.question && report.question.id && report.question.id._id) || (report && report.question && report.question.id)),
      name: this.props.user_now && (this.props.user_now.displayName||this.props.user_now.name),
      isCurrentUserVoted: this.hasCurrentUserVoted(currentAnswerVotes),
      reportid: item && item._id,
      type: "votes",
    };

    this.setState({ showCommentModal: true, comments: currentAnswerComments, likeCommentData: data });
  };

  handleCommentClose = (item) => {
    this.setState({ showCommentModal: false, comments: [], likeCommentData: {} });
  };

  hasCurrentUserVoted = (currentAnswerVotes) => {
    let userId = localStorage.getItem("trooprUserId");
    let hasCurrentUserVoted = currentAnswerVotes.find((user) => user.user_id === userId);
    return hasCurrentUserVoted;
  };

  findReport = (response, question) => {
    let report =
      response &&
      response.progress_report &&
      response.progress_report.find(
        (report) =>
          (report && report.question && report.question.id && report.question.id._id && report.question.id._id == question._id) ||
          (report && report.question && report.question.id && report.question.id == question._id)
      );
    return report;
  };
  getTotalLikes = (item, report) => {
    let totalVotes = item.votes;
    let currentQuestionId =
      report && ((report.question && report.question.id && report.question.id._id) || (report && report.question && report.question.id));
    let currentAnswerVotes =
      totalVotes &&
      totalVotes.filter((vote) => {
        return vote.questionid === currentQuestionId;
      });

    return currentAnswerVotes && currentAnswerVotes.length > 0 ? currentAnswerVotes.length : "";
  };

  onLikeButtonClick = (item, report) => {
    let totalVotes = item.votes;
    let currentAnswerVotes = totalVotes.filter((vote) => {
      return (
        vote.questionid ===
        (report && ((report.question && report.question.id && report.question.id._id) || (report && report.question && report.question.id)))
      );
    });

    let data = {
      user_id: this.props.user_now && this.props.user_now._id,
      workspace_id: this.props.match.params.wId,
      questionid: report && ((report.question && report.question.id && report.question.id._id) || (report && report.question && report.question.id)),
      name: this.props.user_now && (this.props.user_now.displayName||this.props.user_now.name),
      isCurrentUserVoted: this.hasCurrentUserVoted(currentAnswerVotes),
      reportid: item && item._id,
      type: "votes",
    };

    this.props
      .addLikeToStandupVer2(data)
      .then((res) => {
        if (res && res.data.permissionerror) {
          message.error(res.data.error);
        }
      })
      .catch((err) => {
        console.error("some error occurred while adding like to standup: ", err);
      });
  };

  setCheckInName = (checkInName) => {
    this.setState({
      checkInName
    })
  }
  
  componentDidMount() {
    if(this.props.channels && this.props.channels.length === 0){
      this.setState({channelsLoading : true})
      this.props.getChannelList(this.props.match.params.wId).then(res => this.setState({channelsLoading : false}));
    }
    if (this.props.workspace.disableCheckins) {
      this.props.history.push(`/${this.props.match.params.wId}/dashboard`);
      message.warning("Check-in is disabled");
    } else {
      this.props.getUserTeamSync(this.props.match.params.tId).then((res) => {
        if (res.data.success) {
          this.setCheckInName(res.data.teamSync.name);
          if (res.data.teamSync.customEmoji && res.data.teamSync.customEmoji.length != 0) {
            this.setState({ customEmoji: res.data.teamSync.customEmoji });
          } else {
            const emojiArray =
              this.props.userTeamSync && this.props.userTeamSync.standuptype == "team_mood_standup"
                ? [
                    { emoji: "🤩", text: "Rad", score: 5 },
                    { emoji: "🙂", text: "Good", score: 4 },
                    { emoji: "😐", text: "Meh", score: 3 },
                    { emoji: "🥵", text: "Exhausted", score: 2 },
                    { emoji: "🙁", text: "Awful", score: 1 },
                  ]
                : [
                    { emoji: "🤩", text: "Excellent", score: 5 },
                    { emoji: "🙂", text: "Good", score: 4 },
                    { emoji: "😐", text: "Average", score: 3 },
                    { emoji: "🥵", text: "Exhausted", score: 2 },
                    { emoji: "🙁", text: "Bad", score: 1 },
                  ];

            this.setState({ customEmoji: emojiArray });
          }
        }
        let selectedMem = res && res.data && res.data.teamSync.selectedMembers.map((mem) => mem._id);
        if (!selectedMem.includes(this.props.user_now._id) && res.data.teamSync.user_id._id !== this.props.user_now._id) {
          this.setState({ showCalender: false });
        }
        if (res.data.teamSync.allowUpdateAfterWaitTime) {
          this.setState({
            selectedMembers: res.data.teamSync.selectedMembers,
            handleSubmissionAfterWaitTime: res.data.teamSync.allowSubmissionAfterWaitTime,
            handleUpdateAfterWaitTime: res.data.teamSync.allowUpdateAfterWaitTime,
          });
        } else {
          this.setState({
            selectedMembers: res.data.teamSync.selectedMembers,
            handleSubmissionAfterWaitTime: res.data.teamSync.allowSubmissionAfterWaitTime,
            handleUpdateAfterWaitTime: res.data.teamSync.allowSubmissionAfterWaitTime,
          });
        }
      });
      this.setState({ teamSyncId: this.props.match.params.tId });
      // this.props.getAssisantSkills(this.props.match.params.wId);
      this.setState({ loading: true });
      // this.props.SkillsAction(this.props.match.params.wId);
      let params = this.props.location.pathname.split("/")[4];

      //for old links in bot
      if (params == "engagement" || params == "history") {
        this.props.history.push(`/${this.props.match.params.wId}/teamsync/${this.props.match.params.tId}/insights`);
        this.setState({ subview: "insights" });
      }

      if (
        params == "settings" ||
        // params == "engagement" ||
        params == "holiday" ||
        // params == "history" ||
        params === "insights" ||
        params === "actionItems"
      ) {
        if (params == "holiday") {
          this.setState({ subview: "calendar", currentActiveKey: "5" });
        } else if (params === "actionItems") {
          // console.log("HERE");
          this.setState({ subview: "actionItems", currentActiveKey: "4" });
        } else {
          this.setState({ subview: params });
          if (params === "settings") {
            this.setState({ currentActiveKey: "3" });
          } else if (params === "insights") {
            this.setState({ currentActiveKey: "2" });
          }
        }
        this.setState({ loading: false });
      }

      //make an api call to get instance responses only for 'reports' tab.
      //for other tabs this api call is not required
      if (!["holiday", "settings", "insights", "actionItems"].includes(params)) {
        const parsedQueryString = queryString.parse(window.location.search);
        if (this.props.match.params.tId) {
          this.props
            .getProjectTeamSyncInstance(this.props.match.params.tId, this.props.match.params.instanceId && this.props.match.params.instanceId)
            .then((res) => {
              if (res.data.projectTeamSyncInstance._id == undefined) {
                this.setState({
                  loading: false,
                  islatestinstance: true,
                  instance: res.data.projectTeamSyncInstance._id,
                  showreport: true,
                  showmystandups: false,
                });
                this.setState({
                  teamSyncId: this.props.match.params.tId,
                  teamSyncName: parsedQueryString.teamsync_name,
                  noInstance: true,
                });

                if (this.state.subview == "report") {
                  this.state.instance
                    ? this.props.history.push(
                        `/${this.props.match.params.wId}/teamsync/${this.props.match.params.tId}/instance/${this.state.instance}`
                      )
                    : this.props.history.push(`/${this.props.match.params.wId}/teamsync/${this.props.match.params.tId}`);
                } else {
                  this.state.subview == "calendar"
                    ? this.props.history.push(`/${this.props.match.params.wId}/teamsync/${this.props.match.params.tId}/holiday`)
                    : this.props.history.push(`/${this.props.match.params.wId}/teamsync/${this.props.match.params.tId}/${this.state.subview}`);
                }
              } else {
                this.setState({
                  loading: false,
                  islatestinstance: true,
                  instance: res.data.projectTeamSyncInstance._id,
                  showreport: true,
                  showmystandups: false,
                });
                this.setState({
                  teamSyncId: this.props.match.params.tId,
                  // teamSyncName: res.data.projectTeamSyncInstance.teamSync_metdata.name,
                  teamSyncName: this.props.userTeamSync.name,
                  noInstance: false,
                });
                let path = window.location.pathname;
                if (this.state.subview == "report") {
                  this.props.history.push(`/${this.props.match.params.wId}/teamsync/${this.props.match.params.tId}/instance/${this.state.instance}`);
                } else {
                  this.state.subview == "calendar"
                    ? this.props.history.push(`/${this.props.match.params.wId}/teamsync/${this.props.match.params.tId}/holiday`)
                    : //  this.props.history.push(
                    //     `/${this.props.match.params.wId}/teamsync/${this.props.match.params.tId}/${this.state.subview}`
                    //   );
                    this.props.match.params.history_user_id
                    ? this.props.history.push(
                        `/${this.props.match.params.wId}/teamsync/${this.props.match.params.tId}/${this.state.subview}/${this.props.match.params.history_user_id}`
                      )
                    : this.props.match.params.history_user_slack_id
                    ? this.props.history.push(
                        `/${this.props.match.params.wId}/teamsync/${this.props.match.params.tId}/${this.state.subview}/guest/${this.props.match.params.history_user_slack_id}`
                      )
                    : this.props.history.push(`/${this.props.match.params.wId}/teamsync/${this.props.match.params.tId}/${this.state.subview}`);
                }
              }
            });
        }

        this.setState({
          showreport: false,
          showmystandups: true,
          noInstance: false,
        });
      }

      //to get jira skill
      if (this.props.skills && this.props.skills.length > 0) {
        let jiraSkill = this.props.skills && this.props.skills.find((skill) => skill.name == "Jira");
      
        if (jiraSkill && jiraSkill._id) {
          this.setState({ jiraSkill });
        }
      }

      this.setState({ showreport: false, showmystandups: true });
      this.setState({ selectedMembers: this.props.userTeamSync.selectedMembers });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const parsedQueryString = queryString.parse(window.location.search);
    if (prevProps == undefined) {
      return false;
    }
    if (this.state.teamSyncId != this.props.match.params.tId) {
      this.setState({ selectedRowKeys: [], selectedRows: [], currentActiveKey:(parsedQueryString.new && parsedQueryString.new == "true")?this.state.activeKey :"1" });

      this.props.getUserTeamSync(this.props.match.params.tId).then((res) => {
        if(res.data.success) {
          this.setCheckInName(res.data.teamSync.name);
        }
        if (res.data.success && res.data.teamSync.selectedMembers) {
          if (res.data.teamSync.customEmoji && res.data.teamSync.customEmoji.length != 0) {
            this.setState({ customEmoji: res.data.teamSync.customEmoji });
          } else {
            const emojiArray =
              this.props.userTeamSync && this.props.userTeamSync.standuptype == "team_mood_standup"
                ? [
                    { emoji: "🤩", text: "Rad", score: 5 },
                    { emoji: "🙂", text: "Good", score: 4 },
                    { emoji: "😐", text: "Meh", score: 3 },
                    { emoji: "🥵", text: "Exhausted", score: 2 },
                    { emoji: "🙁", text: "Awful", score: 1 },
                  ]
                : [
                    { emoji: "🤩", text: "Excellent", score: 5 },
                    { emoji: "🙂", text: "Good", score: 4 },
                    { emoji: "😐", text: "Average", score: 3 },
                    { emoji: "🥵", text: "Exhausted", score: 2 },
                    { emoji: "🙁", text: "Bad", score: 1 },
                  ];

            this.setState({ customEmoji: emojiArray });
          }
          if (res.data.teamSync.allowUpdateAfterWaitTime) {
            this.setState({
              selectedMembers: res.data.teamSync.selectedMembers,
              handleSubmissionAfterWaitTime: res.data.teamSync.allowSubmissionAfterWaitTime,
              handleUpdateAfterWaitTime: res.data.teamSync.allowUpdateAfterWaitTime,
            });
          } else {
            this.setState({
              selectedMembers: res.data.teamSync.selectedMembers,
              handleSubmissionAfterWaitTime: res.data.teamSync.allowSubmissionAfterWaitTime,
              handleUpdateAfterWaitTime: res.data.teamSync.allowSubmissionAfterWaitTime,
            });
          }
        }
        let selectedMem = res.data.teamSync.selectedMembers.map((mem) => mem._id);
        if (!selectedMem.includes(this.props.user_now._id) && res.data.teamSync.user_id._id !== this.props.user_now._id) {
          this.setState({ showCalender: false });
        } else {
          this.setState({ showCalender: true });
        }
      });
      this.setState({ teamSyncId: this.props.match.params.tId, loading: true });
      this.props.getProjectTeamSyncInstance(this.props.match.params.tId).then((res) => {

        this.setState({
          subview: parsedQueryString.new && parsedQueryString.new == "true" ? "settings" : "report",
          teamSyncId: this.props.match.params.tId,
          instance: res.data.projectTeamSyncInstance._id,
        });
        if (res.data.projectTeamSyncInstance._id == undefined) {
          this.setState({ noInstance: true, loading: false });
        } else {
          this.setState({ noInstance: false, loading: false });
        }
      });
    }

    //to get jira id
    if (prevProps.skills !== this.props.skills) {
      let jiraSkill = this.props.skills && this.props.skills.find((skill) => skill.name == "Jira");

      if (jiraSkill && jiraSkill._id) {
        this.setState({ jiraSkill });
      }
      //to get user mapping
      // this.props.getUserMappingAndUsers(this.props.match.params.wId, jiraSkill.skill_metadata._id);
    }

    // to handle sidebar tab change
    // if (this.props.location.pathname !== prevProps.location.pathname) {
    //   let subview = this.props.location.pathname.split("/")[4];
    //   if (subview && subview === "instance") {
    //     this.setState({ subview: "report" });
    //   } else if (subview === "holiday") this.setState({ subview: "calendar" });
    //   else if (subview) this.setState({ subview });
    //   else {
    //     // this.getLatestInstance();
    //     this.setState({ subview: "report" });
    //   }
    // }
  }

  // getLatestInstance = () => {
  //   this.setState({ loading: true });
  //   this.props.getProjectTeamSyncInstance(this.props.match.params.tId).then((res) => {
  //     if(res.data.success){
  //       this.setState({ loading: false })
  //       if(res.data.projectTeamSyncInstance._id) this.setState({noInstance : false})
  //     }
  //   });

  // };

  handleCancel = () => {
    this.setState({ modalVisible: false });
  };

  toggle() {
    this.setState({
      modalVisible: !this.state.modalVisible,
    });
  }

  getPreviousAnswer = (data, index) => {
    let isHoliday = false;
    let hasAnswer = false;
    let isSkipped = false;
    if (data.previousInstanceResponse) {
      isHoliday = data.previousInstanceResponse.isHoliday;
      isSkipped = data.previousInstanceResponse.isSkipped;
      hasAnswer = data && data.progress_report && data.progress_report[index] && data.progress_report[index].prevAnswer;
    }

    if (hasAnswer) {
      return (
        // <Card
        //   size='small'
        //   bordered={false}
        //   style={{ backgroundColor: localStorage.getItem("theme") === "dark" ? "#353535" : "#efefef", marginTop: 16 }}
        // >
          <Paragraph type='secondary' ellipsis={{ rows: 10, expandable: true, symbol: "more" }}>
            <div
              className={`response_column`}
              dangerouslySetInnerHTML={{
                __html: this.thredAnswer(
                  `Previous Answer:\n${data.progress_report[index].prevAnswer}`,
                  (data && data.previousInstanceResponse.unfurl_medata && data.previousInstanceResponse.unfurl_medata.jiraIds) || [],
                  data.previousInstanceResponse
                ),
              }}
            ></div>
          </Paragraph>
        // </Card>
      );
    }
    if (isHoliday) {
      return (
        <div className={`${localStorage.getItem("theme") === "dark" ? "previous_answer_darkmode" : "previous_answer"}`}>
          <div> Previous Answer:</div>
          <Text code>User is on Holiday </Text>
        </div>
      );
    }
    if (isSkipped) {
      return (
        <div className={`${localStorage.getItem("theme") === "dark" ? "previous_answer_darkmode" : "previous_answer"}`}>
          <div> Previous Answer:</div>
          <Text code>Skipped this report</Text>
        </div>
      );
    }

    return (
      <div className={`${localStorage.getItem("theme") === "dark" ? "previous_answer_darkmode" : "previous_answer"}`}>
        <div> Previous Answer:</div>
        <Text code>No Answer</Text>
      </div>
    );
  };

  getInitials(string) {
    if (string) {
      let nameArr = string
        .trim()
        .replace(/\s+/g, " ") //remove extra spaces
        .split(" ");

      if (nameArr.length > 1) return (nameArr[0][0] + nameArr[1][0]).toUpperCase();
      else return nameArr[0].slice(0, 2).toUpperCase();
    } else return "";
  }

  showmystandups() {
    this.seemore();
    this.setState({ showmystandups: true, showreport: false, showmore: false });
    let path = window.location.pathname;
    let obj = {
      // title: this.props.skillView.view,
      // url: path + `?view=my_standups`
      url: path + ``,
    };
    window.history.pushState(obj, "", obj.url);
  }

  getAnotherInstance(previousInstance, nextInstance) {
    this.setState({ loading: true, selectedRowKeys: [], selectedRows: [] });
    this.setState({ showmore: false });
    this.props
      .getAnotherInstancePage(this.state.teamSyncId, {
        teamSyncId: true,
        previousInstance,
        nextInstance,
        instanceId: this.props.teamSyncInstance._id,
      })
      .then((res) => {
        this.setState({ loading: false });
        if (res.data.success) {
          if (res.data.projectTeamSyncInstance._id) {
            this.setState({
              loading: false,
              instance: res.data.projectTeamSyncInstance._id,
              noInstance: false,
            });
            // let path = window.location.pathname;
            // let obj = {
            //   // title: this.props.skillView.view,
            //   url:
            //     path +
            //     `?teamsync_id=${this.state.teamSyncId}&instance=${this.state.instance}`
            // };
            // window.history.pushState(obj, '', obj.url);
            this.props.history.push(`/${this.props.match.params.wId}/teamsync/${this.props.match.params.tId}/instance/${this.state.instance}`);
          } else if (res.data.projectTeamSyncInstance._id == undefined) {
            this.setState({
              loading: false,
              instance: res.data.projectTeamSyncInstance._id,
              noInstance: true,
            });
            let path = window.location.pathname;
            // let obj = {
            //   // title: this.props.skillView.view,
            //   url:
            //     path +
            //     `?teamsync_id=${this.state.teamSyncId}`
            // };
            // window.history.pushState(obj, '', obj.url);

            this.props.history.push(`/${this.props.match.params.wId}/teamsync/${this.props.match.params.tId}`);
          }
        }
      });
  }

  seemore = () => {
    this.setState({ showmore: !this.state.showmore });

    // this.setState(function (prevState) {
    //   return { isToggleOn: !prevState.isToggleOn };
    // });
  };

  switchViewFromRetroActionItems = () => {
    this.setState({ subview: "report" });
  };

  switchViewToRetroActionItems = () => {
    // this.setState({ subview: "actionItems" });
    this.switchSubView("actionItems");
  };

  // switchViewToRetroActionItems = () => {
  //   this.setState({ subview: "action_items" });
  // }

  handleSubmissionAfterWaitTime = (e, tsid) => {
    let data = {};
    if (e) {
      data = {
        allowSubmissionAfterWaitTime: e,
        allowUpdateAfterWaitTime: e,
      };
      this.setState({
        handleSubmissionAfterWaitTime: e,
        handleUpdateAfterWaitTime: e,
      });
    } else {
      data = {
        allowSubmissionAfterWaitTime: e,
      };
      this.setState({
        handleSubmissionAfterWaitTime: e,
      });
    }

    this.props.editTeamSync(tsid, data);
  };

  handleUpdateAfterWaitTime = (e, tsid) => {
    // console.log("teamsync id -> ", tsid);
    this.setState({
      handleUpdateAfterWaitTime: e,
    });
    let data = {
      allowUpdateAfterWaitTime: e,
    };
    try {
      this.props.editTeamSync(tsid, data);
    } catch (err) {
      // console.log("some error occurred: ", err);
    }
  };

  handleBlockQuote(html1){
    let splitStrings=html1.split("<br>")
 
    if(splitStrings&&splitStrings.length==1){
     if(html1.substring(0,8)==="&amp;gt;"){
      return `<blockquote class="block_quote_tag">${html1.slice(8)}</blockquote>`
     }
     return html1
    }
 let previousIsBlockQuote=false
 let newStr=[]
  for(let str of splitStrings){
    if(str.substring(0,8)==="&amp;gt;"){
if(previousIsBlockQuote===false){
  str=`<blockquote class="block_quote_tag">${str.slice(8)}`
}
else{
str=str.slice(8)
}
previousIsBlockQuote=true
}
else{
  if(previousIsBlockQuote){
   newStr[newStr.length-1]=`${newStr[newStr.length-1]}</blockquote>`
  }
  previousIsBlockQuote=false
}

 

    newStr.push(str)
  }
   if(previousIsBlockQuote){
        newStr[newStr.length-1]=`${newStr[newStr.length-1]}</blockquote>`
    }
return newStr.join("<br>")
  }


    markupFormatting(html1){ 
   if(html1&&html1.indexOf("&amp;gt;")>=0){
     html1=this.handleBlockQuote(html1)
   }
    let e = document.createElement('div');
    e.innerHTML = html1;
    e.querySelectorAll('code').forEach(function(obj,i){obj.setAttribute("class", "checkin_code_block")});
    e.querySelectorAll('pre').forEach(function(obj,i){obj.setAttribute("class", "checkin_multi_code_block")});

    return e.innerHTML;
  }



  thredAnswer(Answer, report = [],data) {
    const { userTeamSync } = this.props;

  if(userTeamSync&&userTeamSync.standuptype==="Daily Standup"){
    let  answer =this.handleConversations(Answer,data)   
    answer=this.markupFormatting(toHTML(answer))
    answer=`<pre>${answer}</pre>`
       let ids;
       let url;
       try {
         ids = report || [];
         ids.forEach((ele) => {
           let regexp = new RegExp("\\b" + ele.id + "\\b", "gi");
           url = `${ele.url}/browse/${ele.id}`;
           const replaceText = `${ele.id} : ${ele.title}`;
           answer = answer.replace(regexp, `<a href=${url} target=_blank>${replaceText}</a>`);
         });
         
         return  answer
       } catch {
         return answer;
       }
  }
  else{
    let answer = Answer.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

    // searching for urls
    var Regex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    answer = answer.replace(Regex, function (url, b, c) {
      var url2 = c == "www." ? "http://" + url : url;
      return '<a href="' + url2 + '" target=_blank>' + url + "</a>";
    });
    ////searching for jira id's
    let ids;
    let url;
    try {
      ids = report || [];
      ids.forEach((ele) => {
        let regexp = new RegExp("\\b" + ele.id + "\\b", "gi");
        url = `${ele.url}/browse/${ele.id}`;
        const replaceText = `${ele.id} : ${ele.title}`;
        answer = answer.replace(regexp, `<a href=${url} target=_blank>${replaceText}</a>`);
      });
      return answer;
    } catch {
      return answer;
    }

  }

  }

  handleConversations=(answer,data)=>{
 
    try {
      if(data&&data.conversationMentions){
        let userMentions=data.conversationMentions.userMentions
        let channelMentions=data.conversationMentions.channelMentions
        let userGroups=data.conversationMentions.userGroups
        if(userMentions){
         
          for (const [key, value] of Object.entries(userMentions)) {
           let str=`<@${key}>`
           let regex=new RegExp(str,"gi")
            answer=answer.replace(regex,`@${value.name||value.displayName}`)
          }
        }
        if(channelMentions){
          for (const [key, value] of Object.entries(channelMentions)) {
            let str=`<#${key}\\|${value.name}>`
           let regex=new RegExp(str,"gi")
        
            answer=answer.replace(regex,`#${value.name||value.privateChannelName||value.channel_id}`)
            
          }
        }

        if(userGroups){
         
          for (const [key, value] of Object.entries(userGroups)) {
           let str=`<!subteam\\^${key}\\|${value.name}>`
          
           let regex=new RegExp(str,"gi")
            answer=answer.replace(regex,`${value.name}`)
          }
        }
      }
  
      return answer
    } catch (error) {
      console.error(error)
      return answer
    }



  }

  disable = (tsid) => {
    let data = {
      createInstance: false,
    };
    this.props.editTeamSync(tsid, data);
  };

  enable = (tsid) => {
    let data = {
      createInstance: true,
    };
    this.props.editTeamSync(tsid, data).then((data) => {
      if (data.data.success) {
        this.props.sendTeamsyncAck(data.data.teamSync, this.props.match.params.wId);
      } else if (data.data.errors && data.data.errors.action == "change_plan") {
        let t = data.data.errors.text;
        let c = (
          <>
            {" "}
            <p>Upgrade to unlock more Check-ins </p>
            <br /> <p style={{ color: "rgba(0, 0, 0, 0.45)" }}>Hint:You can deactivate another Check-in to make room for this one.</p>
          </>
        );
        confirm({
          title: t,
          okText: "Upgrade",
          icon: <ExclamationCircleOutlined />,
          content: c,
          onOk: () => {
            this.props.history.push("/" + this.props.match.params.wId + "/settings?view=upgrade");

            // this.addAdmin(opt.key)
            //   this.setState({ currentMemberSelected: "" })
          },
          onCancel() {
            //do nothing
            // console.log('Cancel');
          },
        });
      }
    });
  };

  skipConfiguration = () => {
    const { userTeamSync } = this.props;
    const data = {
      enableSkip: !userTeamSync.enableSkip,
    };

    this.props.editTeamSync(userTeamSync._id, data);
  };

  execRunNow = (_id) => {
    // this.setState({ isRunNowHappened: true, instance: "" });
    // this.state.noInstance && this.setState({ noInstance: false });
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
  };
  deleteteamsync = (userTeamSync) => {
    this.props.deleteteamsync(userTeamSync._id).then((res) => {
      if (res.data.success) {
        this.props.recentTeamsyncs.forEach((teamSync) => {
          if (teamSync._id == userTeamSync._id) {
            this.props.deleteRecentTeamsync(this.props.match.params.wId, userTeamSync._id);
          }
        });
        this.setState({
          showmystandups: true,
          showreport: false,
          showmore: false,
          upcomingStandup: true,
        });
        message.success(`Check-in ${userTeamSync.name} successfully deleted`);
      }
      this.props.history.push(`/${this.props.match.params.wId}/teamsyncs`);
    });
  };

  exportToCsv = () => {
    let teamSyncInstanceData = this.props.instanceResponses;
    let date = moment(this.props.projectTeamSyncInstance.created_at).format("D MMM");
    // this.props.instanceResponses.forEach((value1, index1) => {
    //   if (value1.progress_report) {
    //       teamSyncInstanceData[index1].progress_report.push({
    //         question: { text: 'Jira activity summary' }, answer: {
    //           plain_text: `${value1.userActivity.jiraLogs.map((logs, logIndex) => {
    //             return `${logs.key + ' : ' + logs.fields.summary} ${' '}`
    //           })}`
    //         }
    //       })//
    //   }
    // })

    let data;
    if (this.props.projectTeamSyncInstance) {
      data = {
        teamSyncInstanceData: teamSyncInstanceData,
        projectTeamSyncInstance: this.props.projectTeamSyncInstance.questions,
        createdAt: date,
        // teamSyncName: this.props.projectTeamSyncInstance.teamSync_metdata.name
        teamSyncName: this.props.userTeamSync.name,
      };
    }

    this.props.exportToCsv(this.props.match.params.wId, data).then((res) => {
      if (res) {
        this.download(res.data);
      }
    });
  };

  download = (data) => {
    // let date = moment(this.props.projectTeamSyncInstance.created_at).format(
    //   "D  MMM"
    // );

    let reportname = this.props.projectTeamSyncInstance.teamSync_metdata.name;
    let fileName = `Troopr_${reportname}.csv`;
    const dataBlob = new Blob([data], { type: "text/csv" });
    const url = window.URL.createObjectURL(dataBlob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", fileName);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  deleteTeamSyncInstance = (instanceId, previousInstanceNotAvailable, nextInstanceNotAvailable) => {
    let wId = this.props.match.params.wId;
    let teamSyncId = instanceId.teamSync_metdata._id;
    this.props.deleteTeamInstance(instanceId._id, wId, teamSyncId).then((data) => {
      this.props.getProjectTeamSyncInstance(data.data.data.teamSync_metdata._id).then((res) => {
        // let path = window.location.pathname;
        // let obj = {
        //   // title: this.props.skillView.view,
        //   url:
        //     path +
        //     `?teamsync_id=${this.state.teamSyncId}`
        // };
        // window.history.pushState(obj, '', obj.url);
        if (nextInstanceNotAvailable && previousInstanceNotAvailable) {
          this.props.history.push(`/${this.props.match.params.wId}/teamsync/${this.props.match.params.tId}`);
          this.setState({ noInstance: true, instance: "" });
        } else {
          this.props.history.push(
            `/${this.props.match.params.wId}/teamsync/${this.props.match.params.tId}/instance/${res.data.projectTeamSyncInstance._id}`
          );
          this.setState({ instance: res.data.projectTeamSyncInstance._id });
        }
      });
    });
  };

  // handleChange = (pagination, filters, sorter) => {
  //   this.setState({
  //     currentPage: pagination.current,
  //   });
  // };

  getUserActivity = (user_id) => {

      this.props.getJiraUserActivity(this.props.match.params.wId, user_id).then((res) => {
        if (res.success && res.activity) {
          this.props.instanceResponses.forEach((value, index) => {
            if ((value.user_id && value.user_id._id == user_id) || value._id == user_id) {
              this.props.instanceResponses[index].userActivity = {};
              this.props.instanceResponses[index].userActivity.jiraLogs = res.userActivity;
              // this.props.instanceResponses[index].showJiraActivity = true;
            }
          });
        } else if (res.success && !res.activity) {
          this.props.instanceResponses.forEach((value, index) => {
            if (value.user_id._id == user_id) {
              this.props.instanceResponses[index].userActivity = {};
            }
          });
        }
        this.setState({ loading: false });
      });
  };

  // checkUserMapping = (user_id) => () => {
  //   this.props.getJiraUserActivity(this.props.match.params.wId, user_id).then((res) => {
  //     if (res.success && res.activity) {
  //       this.props.instanceResponses.forEach((value, index) => {
  //         // if (value.user_id._id == user_id) {

  //         if (value.user_id && value.user_id._id == user_id) {
  //           let data = { jiraLogs: [] };
  //           this.props.instanceResponses[index].userActivity = data;
  //           this.props.instanceResponses[index].metadata = {
  //             isJiraConnected: true,
  //           };

  //           res.userActivity.forEach((logs, index1) => {
  //             this.props.instanceResponses[index].userActivity.jiraLogs.push(res.userActivity[index1]);
  //           });
  //         }
  //       });
  //     } else if (res.success && !res.activity) {
  //       this.props.instanceResponses.forEach((value, index) => {
  //         if (value.user_id._id == user_id) {
  //           this.props.instanceResponses[index].userNotMapped = true;
  //         }
  //       });
  //     }
  //     this.setState({ loading: false });
  //   });
  // };

  gotoUserMapping = () => {
    // this.props.skills.forEach((value) => {
    //   if (value.name == "Jira") {
    // this.props.history.push(
    //   `/${this.props.match.params.wId}/skills/${value.skill_metadata._id}?view=user_mappings`
    // );
    //   }
    // });
    const { jiraSkill } = this.state;
    let isJiraEnabled = true;
    const enabledSub_skills = jiraSkill.skill_metadata.sub_skills.filter(ss => !ss.disabled)

    if (enabledSub_skills.length === 0) {
      isJiraEnabled = false;
    }
    isJiraEnabled
      ? this.props.history.push(`/${this.props.match.params.wId}/skills/${jiraSkill.skill_metadata._id}/${enabledSub_skills[0].key}?view=user_mappings`)
      : this.props.history.push(`/${this.props.match.params.wId}/teamsyncs/integrations/${jiraSkill.skill_metadata._id}`);
    //console.info("jiraSkill",this.state.jiraSkill)
    //this.state.jiraSkill &&
    //this.props.history.push(`/${this.props.match.params.wId}/skills/${this.state.jiraSkill.skill_metadata._id}?view=user_mappings`);
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
        // weekDaysString = schedule.jobType == "multi_day" ? schedule.days : schedule.weekdays.split(",");
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
            {schedule.standupscheduleType && schedule.standupscheduleType == "recurring" && (
              <span>at {schedule.timezone_type == "custom_timezone" ? this.convertToTZ(schedule) : schedule.time_at}</span>
            )}
          </span>
        );
      }
    }
  };

  convertToTZ = (teamsync) => {
    const { user_now } = this.props;

    //hrs, min, srcTZ, targetTZ

    let dt = moment(teamsync.time_at, ["h:mm A"]).format("HH:mm");
    let [hrs, min] = dt.split(":");

    let dateObj = new Date();
    let mDate = moment.tz(moment(dateObj), teamsync.timezone);
    mDate.set({ hour: hrs, minute: min, second: 0, millisecond: 0 });
    return mDate.tz(user_now.timezone).format("LT");
  };

  // onTabChange = (activeKey) => {
  //   if (activeKey === "active") {
  //     this.setState({
  //       upcomingStandup: true,
  //     });
  //   } else {
  //     this.setState({
  //       upcomingStandup: false,
  //     });
  //   }
  // };

  goToSlackAppHome = () => {
    let url = `https://slack.com/app_redirect?app=AE4FF42BA&team=${this.props.assistant.id}&tab=home`;
    window.open(url);
  };
  switchSubView = (e) => {
    //console.log("inside switchSubView() -> ", e.key);

    const { instance, noInstance } = this.state;
    let toView = e.key ? e.key : e;
    this.setState({
      subview: toView,
    });
    if (toView == "settings") {
      this.props.history.push(`/${this.props.match.params.wId}/teamsync/${this.props.match.params.tId}/settings`);
    } else if (toView == "report") {
      this.setState({ loading: true });
      if (this.state.isRunNowHappened) {
        this.props.getProjectTeamSyncInstance(this.props.match.params.tId).then((res) => res.data.success && this.setState({ loading: false }));
        this.props.history.push(`/${this.props.match.params.wId}/teamsync/${this.props.match.params.tId}`);
        this.setState({ isRunNowHappened: false });
      } else {
        // this.state.instance
        //   ? this.props.history.push(`/${this.props.match.params.wId}/teamsync/${this.props.match.params.tId}/instance/${this.state.instance}`)
        //   : this.props.history.push(`/${this.props.match.params.wId}/teamsync/${this.props.match.params.tId}`);

        if (instance) {
          this.props
            .getProjectTeamSyncInstance(this.props.match.params.tId, instance)
            .then((res) => res.data.success && this.setState({ loading: false }));
          this.props.history.push(`/${this.props.match.params.wId}/teamsync/${this.props.match.params.tId}/instance/${this.state.instance}`);
        } else {
          !noInstance &&
            this.props.getProjectTeamSyncInstance(this.props.match.params.tId).then((res) => res.data.success && this.setState({ loading: false }));
          this.props.history.push(`/${this.props.match.params.wId}/teamsync/${this.props.match.params.tId}`);
        }
      }
    } else if (toView == "calendar") {
      this.props.history.push(`/${this.props.match.params.wId}/teamsync/${this.props.match.params.tId}/holiday`);
    }
    // else if (toView == "engagement") {
    //   this.props.history.push(
    //     `/${this.props.match.params.wId}/teamsync/${this.props.match.params.tId}/engagement`
    //   );
    // } else if (toView == "history") {
    //   this.props.history.push(
    //     `/${this.props.match.params.wId}/teamsync/${this.props.match.params.tId}/history`
    //   );
    // }
    else if (toView == "insights") {
      this.props.history.push(`/${this.props.match.params.wId}/teamsync/${this.props.match.params.tId}/insights`);
    } else if (toView == "actionItems") {
      this.props.history.push(`/${this.props.match.params.wId}/teamsync/${this.props.match.params.tId}/actionItems`);
    }
  };

  sidertoggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  jiraActivityModalToggel = (domain_url, selectedActivity) => {
    this.setState({
      jiraActivityModalVisible: !this.state.jiraActivityModalVisible,
      selectedActivityData:
        selectedActivity && domain_url
          ? {
              domain_url,
              selectedActivity,
            }
          : {},
    });
  };

  renderJiraActivity = (data) => {
    const { jiraSkill } = this.state;
    let isJiraLinked, activities, activities2;
    isJiraLinked = jiraSkill ? jiraSkill.skill_metadata.linked : false;
    if (isJiraLinked) {
      if (
        data &&
        data.userActivity &&
        data.userActivity.jiraLogs &&
        data.userActivity.jiraLogs.length > 0
        // ||
        // (data.showJiraActivity && data.userActivity && data.userActivity.jiraLogs && data.userActivity.jiraLogs.length > 0)
      ) {
        if (data.userActivity.jiraLogs.length <= 5) {
          activities = data.userActivity.jiraLogs.slice(0, 5);
          return (
            <div>
              {" "}
              {/* Progressed <br /> */}
              Activities from Jira <br />
              {activities.map((activity) => (
                <a
                  className='response_column'
                  // href={
                  //   data.userActivity.jiraLogs[0].domain_url +
                  //   "/browse/" +
                  //   activity.key
                  // }
                  // target='_blank'
                  onClick={() => this.jiraActivityModalToggel(data.userActivity.jiraLogs[0].domain_url, activity)}
                >
                  {" "}
                  {activity.key} : {activity.fields.summary.length > 20 ? activity.fields.summary.substring(0, 20) + "..." : activity.fields.summary}
                  <br />
                </a>
              ))}
            </div>
          );
        } else {
          activities = data.userActivity.jiraLogs.slice(0, 5);
          activities2 = data.userActivity.jiraLogs.slice(5, data.userActivity.jiraLogs.length);
          return (
            <div>
              {/* Progressed <br /> */}
              Activities from Jira <br />
              {activities.map((activity) => (
                <span>
                  <a
                    className='response_column'
                    // href={
                    //   data.userActivity.jiraLogs[0].domain_url +
                    //   "/browse/" +
                    //   activity.key
                    // }
                    // target='_blank'
                    onClick={() => this.jiraActivityModalToggel(data.userActivity.jiraLogs[0].domain_url, activity)}
                  >
                    {" "}
                    {activity.key} :{" "}
                    {activity.fields.summary.length > 20 ? activity.fields.summary.substring(0, 20) + "..." : activity.fields.summary}
                    <br />
                  </a>
                  {}
                </span>
              ))}
              {this.state.showmore &&
                activities2.map((activity) => (
                  <a
                    className='response_column'
                    // href={
                    //   data.userActivity.jiraLogs[0].domain_url +
                    //   "/browse/" +
                    //   activity.key
                    // }
                    // target='_blank'
                    onClick={() => this.jiraActivityModalToggel(data.userActivity.jiraLogs[0].domain_url, activity)}
                  >
                    {" "}
                    {activity.key} :{" "}
                    {activity.fields.summary.length > 20 ? activity.fields.summary.substring(0, 20) + "..." : activity.fields.summary}
                    <br />
                  </a>
                ))}
              <a onClick={this.seemore}>{!this.state.showmore ? `See ${data.userActivity.jiraLogs.length - 5} more` : "See Less"}</a>
            </div>
          );
        }
      } else if (data && data._id) {
        const userMapped = this.props.usermappings.find((user) => user.user_id.user_id == data.user_id._id);
        if (userMapped){
          if (!data.userActivity) return <a onClick={() => this.getUserActivity(data.user_id._id)}>Get Jira activities</a>;
          else return "No activity found.";
        }
        else{
          return (
            <span>
              User not mapped.
              <br />
              <a onClick={this.gotoUserMapping}>Go to User Mapping</a>
            </span>
          );
        }
      }
    }
  };

  caluculateWaitingTime = (time, waittime) => {
    if (this.props.userTeamSync.timezone_type == "custom_timezone") {
      time = this.convertToTZ(this.props.userTeamSync);
    }
    try {
      let value = this.convertTime12to24(time);
      let startHr = parseInt(value.split(":")[0]);
      let startMin = parseInt(value.split(":")[1].split(" ")[0]);
      let waitTimeMin = waittime / 60;
      let waitHr = Math.floor(waitTimeMin / 60);
      let waitMin = waitTimeMin % 60;
      let reportMin = (startMin + waitMin) % 60;
      let reportMinOverflow = Math.floor((startMin + waitMin) / 60);
      let reportHr = (startHr + waitHr + reportMinOverflow) % 24;
      let suffix = reportHr >= 12 ? "PM" : "AM";
      reportHr = ((reportHr + 11) % 12) + 1;
      let text = reportHr + ":" + (reportMin < 10 ? "0" + reportMin : reportMin) + " " + suffix;
      return text;
    } catch (error) {
      console.error(error);
    }
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

  getTimeDate = (timezone) => {
    let options = { timeZoneName: "long", timeZone: timezone };
    let tz = new Date().toLocaleString("en-US", options).split(" ");
    let tzName = tz[3] + " " + tz[4] + " " + tz[5];
    return this.getInitialsTimezone(tzName);
  };

  getInitialsTimezone(string) {
    return string
      .trim()
      .split(" ")
      .map(function (item) {
        if (item.trim() != "") {
          return item[0].toUpperCase();
        } else {
          return;
        }
      })
      .join("")
      .slice(0, 3);
  }

  convertSecondsTohours = (d) => {
    d = Number(d);
    let h = Math.floor(d / 3600);
    let m = Math.floor((d % 3600) / 60);
    let hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours") : "";
    let mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes") : "";

    return hDisplay + mDisplay;
  };

  ParticpantClick_handle = (data) => {
    const { userTeamSync } = this.props;
    this.setState({ subview: "insights" });

    // console.log(data,userTeamSync)
    let isUserFound;
    if (data.user_id) {
      isUserFound = userTeamSync.selectedMembers.find((user) => user._id == data.user_id._id || user == data.user_id._id);
    } else {
      isUserFound = userTeamSync.guestUsers.find((user) => user == data.user_slack_id);
    }
    if (isUserFound) {
      if (data.user_id) {
        this.props.history.push(`/${this.props.match.params.wId}/teamsync/${this.props.match.params.tId}/insights/${data.user_id._id}`);
      } else if (data.user_slack_id) {
        // for guest user
        this.props.history.push(`/${this.props.match.params.wId}/teamsync/${this.props.match.params.tId}/insights/guest/${data.user_slack_id}`);
      }
    } else {
      this.props.history.push(`/${this.props.match.params.wId}/teamsync/${this.props.match.params.tId}/insights`);
      message.error("Selected participant is not part of this check-in anymore.");
    }
  };

  getProfilePicUrl = (id) => {
    const { userTeamSync, members } = this.props;

    if (userTeamSync && userTeamSync.selectedMembers && userTeamSync.selectedMembers.length > 0 && members && members.length > 0) {
      let user = userTeamSync.selectedMembers && userTeamSync.selectedMembers.find((mem) => mem._id == id);

      if (user) {
        return user.profilePicUrl;
      } else {
        user = members && members.find((mem) => mem.user_id._id == id);
        if (user) {
          return user.user_id.profilePicUrl;
        } else {
          return "";
        }
      }
    }
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    // console.log("selectedRowKeys changed: ", selectedRowKeys, selectedRows);
    this.setState({ selectedRowKeys, selectedRows });
  };

  handleSelectionCancel = () => {
    this.setState({ selectedRowKeys: [], selectedRows: [] });
  };

  sendReminder = () => {
    axios
      .post(`/api/${this.props.match.params.wId}/teamSync/${this.state.instance}/sendManualReminder`, { user_id: this.state.selectedRowKeys })
      .then((res) => {
        // console.log("res", res);
        if (res.data.success) {
          message.success("Reminders sent successfully");
        }
        this.setState({ selectedRowKeys: [], selectedRows: [] });
      });
  };

  getPopconfirmTitle = () => {
    const { selectedRows } = this.state;
    const { userTeamSync, user_now, projectTeamSyncInstance } = this.props;

    let currentTime = moment();
    const waitTime = userTeamSync.wait_time;
    const instanceTime = projectTeamSyncInstance.created_at;
    let teamsyncreporttime = moment(instanceTime).add(waitTime, "seconds");
    let isAfter = currentTime.isAfter(teamsyncreporttime);
    let waiting_time = moment(instanceTime).add(waitTime, "seconds").tz(user_now.timezone).format("LT");

    return (
      <span>
        {isAfter && `Warning: This Check-in ended on ${moment(projectTeamSyncInstance.created_at).format("DD MMM")} ${waiting_time}. `}
        Are you sure you want to send reminders to{" "}
        {selectedRows &&
          selectedRows.map((value, index) => {
            return index <= 2 ? (value.user_id ? (value.user_id.displayName ||value.user_id.name) : value.metadata.sharedUserName) + " " : "";
          })}{" "}
        {selectedRows.length <= 3 && "?"}
        {selectedRows.length > 3 && `and ${selectedRows.length - 3} others?`}
      </span>
    );
  };

  markOnLeave = () => {
    const { selectedRows } = this.state;
    let data = { ts: selectedRows[0].question_instance_id.teamSync_metdata, instance: selectedRows[0].question_instance_id, userIds: [] };

    selectedRows &&
      selectedRows.map((value, index) => {
        //console.log(value.user_id)
        data.userIds.push(value.user_id);
      });
    //console.log("data : ",data)
    this.props.updateUserHoliday(data);
    this.setState({ selectedRowKeys: [], selectedRows: [] });

    /* previous code
   const { selectedRows } = this.state;
   //console.log(selectedRows[0].isHoliday)
   selectedRows &&
    selectedRows.map((value, index) => {
      //console.log(value.user_id)
      this.props.updateUserHoliday({
        instance_id: value.question_instance_id,
        status : value.status,
        user_id: value.user_id,
      })
      
    })
   // console.log("res", res);

    //console.log("SelectedRowKeys : ",this.state.selectedRowKeys)
    //console.log("SelectedRows : ",this.state.selectedRows)
    this.setState({ selectedRowKeys: [], selectedRows: [] });
    
    Previous code End******/
    /**ProgressReport Api
    const { selectedRows, instance} = this.state;
    let data = { progress_report: [], isHoliday: true };
    selectedRows &&
    selectedRows.map((value, index) => {
      data.user_id= value.user_id._id
      this.props.answerTeamSync(value.question_instance_id._id,data).then((res) => {
        // console.log("res.data -> ", res.data);
        if(res.data.success){
          //message.success("Marked on Leave to all the selected Users",5);
        }
        else{
          //message.error("Failed to mark on leave some user");
        }
      })
    })
    this.setState({ selectedRowKeys: [], selectedRows: [] });
    ProgressReport api end**** */
  };
  getPopconfirmTitleLeave = () => {
    const { selectedRows } = this.state;
    const { userTeamSync, user_now, projectTeamSyncInstance } = this.props;

    let currentTime = moment();
    const waitTime = userTeamSync.wait_time;
    const instanceTime = projectTeamSyncInstance.created_at;
    let teamsyncreporttime = moment(instanceTime).add(waitTime, "seconds");
    let isAfter = currentTime.isAfter(teamsyncreporttime);
    let waiting_time = moment(instanceTime).add(waitTime, "seconds").tz(user_now.timezone).format("LT");

    return (
      <span>
      {isAfter && `Warning: This Check-in ended on ${moment(projectTeamSyncInstance.created_at).format("DD MMM")} ${waiting_time}. `}
      Are you sure you want to mark on leave to{" "}
      {selectedRows &&
        selectedRows.map((value, index) => {
          return index <= 2 ? (value.user_id ? (value.user_id.displayName ||value.user_id.name) : value.metadata.sharedUserName) + " " : "";
        })}{" "}
      {selectedRows.length <= 3 && "?"}
      {selectedRows.length > 3 && `and ${selectedRows.length - 3} others?`}
    </span>
    );
  };

  getReportChannelText = () => {
    const { userTeamSync, channels } = this.props;
    let txt = "";
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

  getReportMembers = () => {
    const { userTeamSync, members } = this.props;
    let txt = "";
    let mem;
    members.length > 0 &&
      userTeamSync.report_members.length > 0 &&
      userTeamSync.report_members.forEach((member, index) => {
        let mem = members.find((mem) => mem.user_id._id == member);
        // console.log("mem", mem, member, members);
        txt = mem ? txt + (mem.user_id.displayName||mem.user_id.name) + " " : txt + "";
      });
    // console.log("txt", txt);
    return txt;
  };

  getJiraIssueText = (str) => {
    try {
      if (str && str.length > 0) {
        // let eachIssueArr = str.split("\n\n");
        let eachIssueArr = str.split("\n\nUpdates in");
        let issueDataArr = [];
        eachIssueArr.forEach((issue) => {
          let arr = this.getSplitedData(issue);
          if (arr) {
            let issueUrlId = this.getIssueUrlId(arr[0]);
            let data = {
              url: issueUrlId.url,
              id: issueUrlId.id,
              data: arr[1],
            };
            issueDataArr.push(data);
          }
        });

        return issueDataArr.map((issue) => {
          return (
            <span>
              Updates in{" "}
              <a href={issue.url} style={{ fontWeight: "bold" }} target='_blank'>
                {issue.id}
              </a>{" "}
              {this.getIssueData(issue.data)}
              <br />
            </span>
          );
        });

        // return str;
      }
    } catch (error) {
      console.error("error parsing jira avtivity string", error);
      return <Text code>Error parsing jira activity</Text>;
    }
  };

  getIssueData = (str) => {
    // console.log("before ==>",`${str}`)
    let regexp = /\n\n/gi;
    str = str.replace(regexp, "\r\r");
    str = str.split("\n");
    let name = str[0].split("*");
    let issueDataArr = [];
    str.forEach((data, index) => {
      let arr = index != str.length - 1 && str[index + 1].split("*");
      index != str.length - 1 && issueDataArr.push(arr);
    });
    return (
      <span>
        <strong>
          :{name[1]} <br />
        </strong>
        {issueDataArr.map((data) => {
          if (data[1] == "description") {
            // console.log(data);
            let descData = data[2];
            descData = descData.split("<");
            if (descData[1]) {
              descData[1] = descData[1].slice(0, -1).split("|");
              descData[1][1] = descData[1][1].slice(1);
            }
            // console.log(descData[1]);
            return (
              <span>
                <strong>{data[1]}</strong>
                {descData[0]} {descData[1] && descData[1][1] && <strong>{descData[1][1]}</strong>}
                <br />
              </span>
            );
          } else {
            //checking for assignee
            let assigneeStr = data[0].split(">");
            if (assigneeStr[1] && assigneeStr[1].slice(0, -2) == "Assignee") {
              let assigneeUrlArr = assigneeStr[2].slice(2).split("|");
              if (assigneeUrlArr.length == 2) {
                return (
                  <span>
                    <strong>
                      {"Assignee ==> "} {assigneeUrlArr[1]}
                    </strong>
                    <br />
                  </span>
                );
              } else if (assigneeUrlArr[0] == "nassigned ") {
                //for unassigned
                return (
                  <span>
                    <strong>{"Assignee ==> "} Unassigned</strong>
                    <br />
                  </span>
                );
              } else return "";
            } else {
              if (data[2]) {
                let regex = /\r\r/gi;
                data[2] = data[2].replace(regex, "\n\n");
              }
              return (
                <span style={{ whiteSpace: "pre-line" }}>
                  <strong>{data[1]}</strong>
                  {data[2]}
                  <br />
                </span>
              );
            }
          }
        })}
      </span>
    );
  };

  getIssueUrlId = (str) => {
    let string = str;
    string = string.split("<");
    string[1] = string[1].slice(0, -1).split("|");
    return { id: string[1][1], url: string[1][0] };
  };

  getSplitedData = (str) => {
    if (str.length > 0) {
      //<<<<<<<<old logic ></old>>>>>>
      // let n = 2;
      // var L = str.length,
      //   i = -1;
      // while (n-- && i++ < L) {
      //   i = str.indexOf(":", i);
      //   if (i < 0) break;
      // }
      // const splitAt = (index) => (x) => [x.slice(0, index), x.slice(index)];

      // return splitAt(i)(str);

      str = str.substring(1);
      str = str.split(">:*");
      str[0] = str[0] + ">";
      str[1] = ":*" + str[1];
      return str;
    }
  };

  toggleNewStandupModal = () => {
    this.setState(
      {
        newStandupModalVisible: !this.state.newStandupModalVisible,
        edit: false,
        standuptype: false,
      },
      () => {
        !this.state.newStandupModalVisible && setTimeout(() => this.clickChild(), 500);
      }
    );
  };

  handleEdit = (id, userTeamSync) => {
    // const { teamSyncs } = this.props;
    // let selectedTeamSyncForEdit = {};
    // if (teamSyncs.length > 0) {
    //   selectedTeamSyncForEdit = teamSyncs.find((ts) => ts._id == id);
    // }

    if (userTeamSync._id) {
      this.setState({ edit: true, selectedTeamSyncForEdit: userTeamSync }, () => {
        this.setState({ newStandupModalVisible: true });
      });
    } else {
      message.error("some error occurred");
    }
  };

  getRetroColumns = () => {
    // console.log("inside getRetroColumns()");
    const { instanceResponses } = this.props;
    let retroColumn = [
      {
        title: "Retrospective Report",
        className: "table_top",
        render: (questionData) => {
          // return (
          //   <div>
          //     <Text strong>{questionData.question_text}</Text>
          //     <br />
          //     {instanceResponses.map((response) => {
          //       return (
          //         <span>
          //           <Link onClick={() => this.ParticpantClick_handle(response)}>
          //             {response.user_id.name}{" "}
          //           </Link>
          //           {/* {response.progress_report &&
          //           response.progress_report[] &&
          //           response.progress_report[].answer &&
          //           response.progress_report[].answer.plain_text
          //             ? response.progress_report[].answer.plain_text
          //             : "No Answer"} */}
          //           {!response.isHoliday
          //             ? !response.isSkipped
          //               ? this.findAnswer(
          //                   response.progress_report,
          //                   questionData._id,
          //                   response
          //                 )
          //               : "Skipped this Report"
          //             : "User is on Hoilday"}
          //           <br />
          //         </span>
          //       );
          //     })}
          //   </div>
          // );
          return (
            <Table
              columns={this.questionsTableColumns(questionData)}
              dataSource={instanceResponses}
              pagination={false}
              bordered
              style={{ maxWidth: "103%", marginLeft: "-34px" }}
            />
          );
        },
      },
    ];

    return retroColumn;
  };

  // dropDownDelete = (userTeamSync) => {
  //   return (
  //     <Menu>
  //       <Menu.Item icon={<DeleteOutlined />}>
  //         <Popconfirm
  //           title={`Are you sure you want to delete this check-in : ${userTeamSync.name} permanently?`}
  //           onConfirm={() => this.deleteteamsync(userTeamSync)}
  //           okText='Yes'
  //           cancelText='No'
  //           placement='leftTop'
  //         >
  //         <span>
  //           Delete Check-In
  //         </span>
  //         </Popconfirm>
  //       </Menu.Item>
  //     </Menu>
  //   );
  // }

  questionsTableColumns = (questionData) => {
    let columns = [
      {
        title: questionData.question_text,
        className: "table_top",
        width: 500,
        render: (data) => {
          return (
            <span>
              <Link onClick={() => this.ParticpantClick_handle(data)} strong>
                {(data.user_id.displayName ||data.user_id.name)
                  ? (data.user_id.displayName||data.user_id.name)
                  : data.metadata.sharedUserName
                  ? data.metadata.sharedUserName
                  : this.getSharedUserName(data.user_slack_id)}{" "}
              </Link>
              <br />
              {data.responded_at && <span style={{ fontSize: "12px" }}>{moment(data.responded_at).format("hh:mm A")}</span>}
            </span>
          );
        },
      },
      {
        title: "Answer",
        className: "table_top",
        render: (data) => {
          return !data.isHoliday ? (
            !data.isSkipped ? (
              this.findAnswer(data.progress_report, questionData._id, data)
            ) : (
              <Text code>Skipped this report</Text>
            )
          ) : (
            "User is on Hoilday"
          );
        },
      },
    ];
    return columns;
  };

  findAnswer = (progress_report, queId, response) => {
    let answer = "";
    if (progress_report) {
      let data = progress_report.find((data) => data.question.id._id == queId || data.question.id == queId);
      answer =
        data && data.answer && data.answer.plain_text ? (
          // ? data.answer.plain_text
          <span
            className='response_column'
            dangerouslySetInnerHTML={{
              __html: this.thredAnswer(data.answer.plain_text, response.unfurl_medata.jiraIds,response),
            }}
          ></span>
        ) : (
          <Text code>No Answer</Text>
        );
    } else {
      answer = <Text code>No Answer</Text>;
    }
    return answer;
  };

  getSharedUserName = (id) => {
    const { /*userTeamSync,*/ projectTeamSyncInstance } = this.props;
    const guestusersInfo =
      projectTeamSyncInstance.teamSync_metdata && projectTeamSyncInstance.teamSync_metdata.guestusersInfo
        ? projectTeamSyncInstance.teamSync_metdata.guestusersInfo
        : [];
    const userFound = guestusersInfo && guestusersInfo.find((user) => user.user_slack_id == id);
    return userFound ? (userFound.displayName||userFound.name) : "";
  };

  addTeamSyncAdmin = (userId) => {
    this.props
      .addTeamSyncAdmin(this.props.match.params.tId, userId)
      .then((res) => {
        if (res.data.success) {
          message.success("Check-in admin added successfully");
        } else if (res.data.errors && res.data.errors.action == "change_plan") {
          let t = res.data.errors.text;
          let c = (
            <>
              {" "}
              <p>Upgrade to unlock more Multi-admin access. </p>
              <br />{" "}
            </>
          );
          confirm({
            title: t,
            okText: "Upgrade",
            icon: <ExclamationCircleOutlined />,
            content: c,
            onOk: () => {
              this.props.history.push("/" + this.props.match.params.wId + "/settings?view=upgrade");
            },
            onCancel() {
              //do nothing
            },
          });
        } else {
          message.error("Some error occurred");
        }
      })
      .catch((err) => {
        console.error(err);
        message.error("Some error occurred");
      });
  };

  removeTeamSyncAdmin = (userId) => {
    this.props
      .deleteTeamSyncAdmin(this.props.match.params.tId, userId)
      .then((res) => {
        if (res.data.success) {
          message.success("Check-In Admin removed successfully");
        } else if (res.data.errors && res.data.errors.action == "change_plan") {
          let t = res.data.errors.text;
          let c = (
            <>
              {" "}
              <p>Upgrade to unlock more Multi-admin access. </p>
              <br />{" "}
            </>
          );
          confirm({
            title: t,
            okText: "Upgrade",
            icon: <ExclamationCircleOutlined />,
            content: c,
            onOk: () => {
              this.props.history.push("/" + this.props.match.params.wId + "/settings?view=upgrade");
            },
            onCancel() {},
          });
        } else {
          message.error("Some error occurred");
        }
      })
      .catch((err) => {
        console.error(err);
        message.error("Some error occurred");
      });
  };

  handleAdminSelect = (val, opt) => {
    let confirmTitle = `This will add ${val} as the admin for this check-in. Are you sure?`;
    confirm({
      title: confirmTitle,
      icon: <ExclamationCircleOutlined />,

      onOk: () => {
        this.addTeamSyncAdmin(opt.key);
        // this.setState({ currentMemberSelected: "" })
      },
    });
  };

  handleAdminDeselect = (val, opt) => {
    let { userTeamSync, user_now, members } = this.props;
    let currentUserId = user_now && user_now._id;

    let isAdmin = false;
    if (members && members.length > 0) {
      members.forEach((member) => {
        if (member.role == "admin" && member.user_id && member.user_id._id == currentUserId) {
          isAdmin = true;
        }
      });
    }

    let isTeamSyncAdmin = false;

    let ts_admins = userTeamSync && userTeamSync.admins ? userTeamSync.admins : [];

    if (ts_admins && ts_admins.length > 0) {
      ts_admins.forEach((admin) => {
        if (admin._id == currentUserId) {
          isTeamSyncAdmin = true;
        }
      });
    }

    //nobody can remove themself from admin
    if (user_now._id === opt.key) {
      message.error("You cannot remove yourself from check-in admin");
      return;
    }

    //if the user is workspace admin but not the check-in admin then show error
    if (isAdmin && !isTeamSyncAdmin) {
      message.error("To perform this action, you need to be the check-in admin");
      return;
    }

    let confirmTitle = `This will remove ${val} as admin. Are you sure?`;
    confirm({
      title: confirmTitle,
      icon: <ExclamationCircleOutlined />,
      onOk: () => {
        // console.log(`remove ${val} as admin`);
        this.removeTeamSyncAdmin(opt.key);
        // this.setState({ currentMemberSelected: "" })
      },
    });
  };

  saveCustomEmoji = () => {
    const { customEmoji } = this.state;
    const { userTeamSync } = this.props;
    let data = { customEmoji: customEmoji };
    this.props.updateTeamSyncCustomEmoji(userTeamSync._id, data).then((res) => {
      if (res.data.success) message.success("Updated successfully. Changes will be applied to future reports. ");
      else message.error("Error updating");
    });
  };

  resetCustomEmojiConfirmation = () => {
    return <span>Are you sure you want to reset emojis and text to default?</span>;
  };

  resetCustomEmoji = () => {
    const { customEmoji } = this.state;
    const { userTeamSync } = this.props;
    let data =
      userTeamSync.standuptype == "team_mood_standup"
        ? {
            customEmoji: [
              { emoji: "🤩", text: "Rad", score: 5 },
              { emoji: "🙂", text: "Good", score: 4 },
              { emoji: "😐", text: "Meh", score: 3 },
              { emoji: "🥵", text: "Exhausted", score: 2 },
              { emoji: "🙁", text: "Awful", score: 1 },
            ],
          }
        : {
            customEmoji: [
              { emoji: "🤩", text: "Excellent", score: 5 },
              { emoji: "🙂", text: "Good", score: 4 },
              { emoji: "😐", text: "Average", score: 3 },
              { emoji: "🥵", text: "Exhausted", score: 2 },
              { emoji: "🙁", text: "Bad", score: 1 },
            ],
          };

    this.props.updateTeamSyncCustomEmoji(userTeamSync._id, data).then((res) => {
      if (res.data.success) {
        this.setState({ customEmoji: res.data.teamSync.customEmoji });
        //console.info(res.data.teamSync)
        message.success("Resetted successfully");
        //console.info("customEmoji state",customEmoji)
        //console.info("userteamSyncc",userTeamSync)
      } else message.error("Error reseting");
    });

    // this.setState({customEmoji:emojiArray})
  };

  resetCustomEmojiCancel = () => {};

  // getPlanningPokerData = (data) => {
  //   const { projectTeamSyncInstance, instanceResponses } = this.props;
  //   let storyPointOptions = projectTeamSyncInstance.teamSync_metdata.story_points_options.split(
  //     ","
  //   );
  //   console.log(storyPointOptions);
  //   return data.progress_report.map((data) => {
  //     return (
  //       <div>
  //         <a href={data.question.meta.url} target='_blank'>
  //           {data.question.meta.key}
  //         </a>{" "}
  //         : <strong>{data.question.text}</strong>
  //         <br />
  //         <Text code>{data.answer.plain_text}</Text>
  //         <br />
  //       </div>
  //     );
  //   });
  // };

  getActionItems = () => {
    const { userTeamSync } = this.props;
    let creator_id;
    if (userTeamSync && userTeamSync.user_id && userTeamSync.user_id._id) creator_id = userTeamSync.user_id._id;

    if (
      creator_id === this.props.user_now._id &&
      userTeamSync &&
      (userTeamSync.standuptype == "dailystandup" || userTeamSync.standuptype == "Daily Standup" || userTeamSync.standuptype == "retrospective")
    ) {
      return (
        <Dropdown
          overlay={
            <Menu
              onClick={({ item, key, keyPath, domEvent }) => {
                domEvent.preventDefault();
                domEvent.stopPropagation();
              }}
            >
              <Menu.Item>
                <Popconfirm
                  title='This will download the  current report in csv format.'
                  onConfirm={this.exportToCsv}
                  okText='Export'
                  placement='leftTop'
                >
                  <DownloadOutlined /> Export
                </Popconfirm>
              </Menu.Item>
              <Menu.Item danger>
                <Popconfirm
                  title='This will delete the current report.'
                  onConfirm={() =>
                    this.deleteTeamSyncInstance(
                      this.props.projectTeamSyncInstance,
                      this.props.previousInstanceNotAvailable,
                      this.props.nextInstanceNotAvailable
                    )
                  }
                  okText='Delete'
                  placement='leftTop'
                >
                  <DeleteOutlined /> Delete Report
                </Popconfirm>
              </Menu.Item>
            </Menu>
          }
        >
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            icon={<SettingOutlined />}
            type='text'
          />
        </Dropdown>
      );
    } else {
      return (
        <span>
          {creator_id === this.props.user_now._id && (
            <Popconfirm
              title='This will delete the current report.'
              onConfirm={() =>
                this.deleteTeamSyncInstance(
                  this.props.projectTeamSyncInstance,
                  this.props.previousInstanceNotAvailable,
                  this.props.nextInstanceNotAvailable
                )
              }
              okText='Delete'
              placement='leftTop'
            >
              <Tooltip placement='top' title='Delete'>
                <Button type='circle' icon={<DeleteOutlined />}></Button>
              </Tooltip>
            </Popconfirm>
          )}
          <span style={{ marginLeft: "10px" }} />
          {userTeamSync &&
            (userTeamSync.standuptype == "dailystandup" ||
              userTeamSync.standuptype == "Daily Standup" ||
              userTeamSync.standuptype == "retrospective") && (
              <Popconfirm
                title='This will download the  current report in csv format.'
                onConfirm={this.exportToCsv}
                okText='Export'
                placement='leftTop'
              >
                <Tooltip placement='top' title='Export'>
                  <Button type='circle' icon={<DownloadOutlined />}></Button>
                </Tooltip>
              </Popconfirm>
            )}
        </span>
      );
    }
  };

  getRespondedUsersPercent = () => {
    const { instanceResponses } = this.props;
    let count = 0;
    if (instanceResponses) {
      for (let i = 0; i < instanceResponses.length; i++) {
        if (instanceResponses[i].status == "replied") {
          count++;
        }
      }
      //return (100*(count/instanceResponses.length)).toFixed(0)
    }
    return count;
  };
  getPreviousRespondedUsersPercent = () => {
    const { instanceResponses } = this.props;
    let previousCount = 0;
    if (instanceResponses) {
      for (let i = 0; i < instanceResponses.length; i++) {
        if (instanceResponses[i].previousInstanceResponse && instanceResponses[i].previousInstanceResponse.status == "replied") {
          previousCount++;
        }
      }
      return (100 * (previousCount / instanceResponses.length)).toFixed(0);
    }
    return previousCount;
  };
  getUnrespondedUsers = () => {
    const { instanceResponses } = this.props;
    let unrespondedCount = 0;
    let unrespondedUsername = "";
    if (instanceResponses) {
      for (let i = 0; i < instanceResponses.length; i++) {
        if (instanceResponses[i].status == "asked") {
          unrespondedCount++;
          unrespondedUsername = instanceResponses[i].user_id.displayName||instanceResponses[i].user_id.name;
        }
      }
      let str = unrespondedCount ? `${unrespondedUsername} +${unrespondedCount - 1} Absences` : unrespondedCount + " Absences";
      return str;
    }

    return "";
  };
  getUsersOnHoliday = () => {
    const { instanceResponses, userTeamSync } = this.props;

    let userOnHolidayCount = 0;
    let userOnHolidayName = "";
    for (let i = 0; i < instanceResponses.length; i++) {
      if (instanceResponses[i].status == "replied" && instanceResponses[i].isHoliday) {
        userOnHolidayCount++;
        if (userTeamSync && userTeamSync.standuptype == "team_mood_standup" && userTeamSync.send_anonymous) {
        } else {
          userOnHolidayName = instanceResponses[i].user_id.displayName || instanceResponses[i].user_id.name;
        }
      }
    }
    if (userTeamSync && userTeamSync.standuptype == "team_mood_standup" && userTeamSync.send_anonymous) {
      return userOnHolidayCount ? `${userOnHolidayCount} Absences` : "No Absences";
    }
    let str = userOnHolidayCount
      ? userOnHolidayCount == 1
        ? `${userOnHolidayName} absence`
        : `${userOnHolidayName} +${userOnHolidayCount - 1} Absences`
      : "No Absences";
    return str;
  };
  getCurrentMoodScore = () => {
    const mood = [5, 4, 3, 2, 1];
    const { instanceResponses } = this.props;
    let currentMoodScore = 0;
    let totalMoodResponses = 0;
    for (var i = 0; i < instanceResponses.length; i++) {
      if (instanceResponses[i] && instanceResponses[i].usermood) {
        totalMoodResponses++;
        currentMoodScore += mood[instanceResponses[i].usermood - 1];
      }
    }
    currentMoodScore = totalMoodResponses ? (currentMoodScore / totalMoodResponses).toFixed(1) : 0;
    return currentMoodScore;
  };
  getPreviousDayMoodScore = () => {
    const mood = [5, 4, 3, 2, 1];
    const { instanceResponses } = this.props;
    let previousDayMoodScore = 0;
    let totalMoodResponses = 0;
    for (var i = 0; i < instanceResponses.length; i++) {
      if (instanceResponses[i].previousInstanceResponse && instanceResponses[i].previousInstanceResponse.usermood) {
        totalMoodResponses++;
        previousDayMoodScore += mood[instanceResponses[i].previousInstanceResponse.usermood - 1];
      }
    }
    previousDayMoodScore = totalMoodResponses ? (previousDayMoodScore / totalMoodResponses).toFixed(1) : 0;
    return previousDayMoodScore;
  };
  getIsPreviousResponseAvailable = () => {
    const { instanceResponses } = this.props;
    let isPreviousResponseAvailable = false;
    for (var i = 0; i < instanceResponses.length; i++) {
      if (instanceResponses[i] && instanceResponses[i].previousInstanceResponse) {
        isPreviousResponseAvailable = true;
        return isPreviousResponseAvailable;
      }
    }
    return isPreviousResponseAvailable;
  };
  // getUserBestMoodScore = () => {
  //   const mood = [5, 4, 3, 2, 1];
  //   const { instanceResponses } = this.props;
  //   let bestUser = { user: [], moodScore: null, totalMoodResponses: 0 };
  //   for (var i = 0; i < instanceResponses.length; i++) {
  //     if (instanceResponses[i] && instanceResponses[i].usermood) {
  //       bestUser.totalMoodResponses++;
  //       if (bestUser.moodScore < mood[instanceResponses[i].usermood - 1]) {
  //         bestUser.user = [];
  //         bestUser.user.push( instanceResponses[i].user_id.displayName||instanceResponses[i].user_id.name);
  //         bestUser.moodScore = mood[instanceResponses[i].usermood - 1];
  //       } else if (bestUser.moodScore == mood[instanceResponses[i].usermood - 1]) {
  //         bestUser.user.push(instanceResponses[i].user_id.displayName || instanceResponses[i].user_id.name);
  //       }
  //     }
  //   }
  //   return bestUser;
  // };
  // getUserWorstMoodScore = () => {
  //   const mood = [5, 4, 3, 2, 1];
  //   const { instanceResponses } = this.props;
  //   let worstUser = { user: [], moodScore: 5, totalMoodResponses: 0 };
  //   for (var i = 0; i < instanceResponses.length; i++) {
  //     if (instanceResponses[i] && instanceResponses[i].usermood) {
  //       worstUser.totalMoodResponses++;
  //       if (worstUser.moodScore > mood[instanceResponses[i].usermood - 1]) {
  //         worstUser.user = [];
  //         worstUser.user.push(instanceResponses[i].user_id.displayName || instanceResponses[i].user_id.name);
  //         worstUser.moodScore = mood[instanceResponses[i].usermood - 1];
  //       } else if (worstUser.moodScore == mood[instanceResponses[i].usermood - 1]) {
  //         worstUser.user.push( instanceResponses[i].user_id.displayName||instanceResponses[i].user_id.name);
  //       }
  //     }
  //   }
  //   return worstUser;
  // };
  changeTab = (key) => {
    const { instance, noInstance } = this.state;
    this.setState({ currentActiveKey: key.toString() });
    if (key == 1) {
      this.setState({ subview: "report" });
      this.setState({ loading: true });
      this.props.getProjectTeamSyncInstance(this.props.match.params.tId).then((res) => res.data.success && this.setState({ loading: false }));
      this.props.history.push(`/${this.props.match.params.wId}/teamsync/${this.props.match.params.tId}`);
      // if (this.state.isRunNowHappened) {
      //   this.props.getProjectTeamSyncInstance(this.props.match.params.tId).then((res) => res.data.success && this.setState({ loading: false }));
      //   this.props.history.push(`/${this.props.match.params.wId}/teamsync/${this.props.match.params.tId}`);
      //   this.setState({ isRunNowHappened: false });
      // } else {
      //   // this.state.instance
      //   //   ? this.props.history.push(`/${this.props.match.params.wId}/teamsync/${this.props.match.params.tId}/instance/${this.state.instance}`)
      //   //   : this.props.history.push(`/${this.props.match.params.wId}/teamsync/${this.props.match.params.tId}`);

      //   if (instance) {
      //     this.props
      //       .getProjectTeamSyncInstance(this.props.match.params.tId, instance)
      //       .then((res) => res.data.success && this.setState({ loading: false }));
      //     this.props.history.push(`/${this.props.match.params.wId}/teamsync/${this.props.match.params.tId}/instance/${this.state.instance}`);
      //   } else {
      //     !noInstance &&
      //       this.props.getProjectTeamSyncInstance(this.props.match.params.tId).then((res) => res.data.success && this.setState({ loading: false }));
      //     this.props.history.push(`/${this.props.match.params.wId}/teamsync/${this.props.match.params.tId}`);
      //   }
      // }
    } else if (key == 2) {
      this.setState({ subview: "insights" });
      this.props.history.push(`/${this.props.match.params.wId}/teamsync/${this.props.match.params.tId}/insights`);
    } else if (key == 3) {
      this.setState({ subview: "settings" });
      this.props.history.push(`/${this.props.match.params.wId}/teamsync/${this.props.match.params.tId}/settings`);
    } else if (key == 4) {
      this.setState({ subview: "actionItems" });
      this.props.history.push(`/${this.props.match.params.wId}/teamsync/${this.props.match.params.tId}/actionItems`);
    } else if (key == 5) {
      this.setState({ subview: "calendar" });
      this.props.history.push(`/${this.props.match.params.wId}/teamsync/${this.props.match.params.tId}/holiday`);
    }
  };
  getUserComment = (response, question) => {
    if (response && response.status == "replied") {
      let report = response.progress_report.find((report) => report.question.id._id == question._id || report.question.id == question._id);
      if (report && report.answer && report.answer.plain_text) {
        return report.answer.plain_text;
      }
    }
  };
  getUserRespondedEmoji = (response) => {
    const { userTeamSync } = this.props;
    if (response && response.status == "replied" && response.usermood && response.metadata && response.metadata.emoji) {
      return response.metadata.emoji;
    } else if (response && response.status == "replied" && response.usermood) {
      let emoji =
        userTeamSync.customEmoji && userTeamSync.customEmoji.length != 0
          ? response.usermood && response.usermood == 1
            ? userTeamSync.customEmoji[0].emoji
            : response.usermood == 2
            ? userTeamSync.customEmoji[1].emoji
            : response.usermood == 3
            ? userTeamSync.customEmoji[2].emoji
            : response.usermood == 4
            ? userTeamSync.customEmoji[3].emoji
            : response.usermood == 5
            ? userTeamSync.customEmoji[4].emoji
            : ""
          : response.usermood && response.usermood == 1
          ? "🤩"
          : response.usermood == 2
          ? "🙂"
          : response.usermood == 3
          ? "😐"
          : response.usermood == 4
          ? "🥵"
          : response.usermood == 5
          ? "🙁"
          : "";
      return emoji;
    }
    return "";
  };
  getEmojiText = (response) => {
    const { userTeamSync } = this.props;
    if (response && response.status == "replied" && response.usermood && response.metadata && response.metadata.emojiText) {
      return " feeling " + response.metadata.emojiText;
    } else if (response && response.status == "replied" && response.usermood) {
      let emojiText =
        userTeamSync.customEmoji && userTeamSync.customEmoji.length != 0
          ? response.usermood && response.usermood == 1
            ? userTeamSync.customEmoji[0].text
            : response.usermood == 2
            ? userTeamSync.customEmoji[1].text
            : response.usermood == 3
            ? userTeamSync.customEmoji[2].text
            : response.usermood == 4
            ? userTeamSync.customEmoji[3].text
            : response.usermood == 5
            ? userTeamSync.customEmoji[4].text
            : ""
          : response.usermood && response.usermood == 1
          ? "excellent"
          : response.usermood == 2
          ? "good"
          : response.usermood == 3
          ? "average"
          : response.usermood == 4
          ? "exhausted"
          : response.usermood == 5
          ? "bad"
          : "";
      return " feeling " + emojiText;
    }
    return "";
  };

  render() {
    const col_span = 24;

    const lateSubmissionAndUpdateStyle = {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    };

    const { teamSyncs, instanceResponses, projectTeamSyncInstance, userTeamSync, user_now, workspace, members } = this.props;

    let currentUserId = user_now && user_now._id;

    let isAdmin = false;
    if (members && members.length > 0) {
      members.forEach((member) => {
        if (member.role == "admin" && member.user_id && member.user_id._id == currentUserId) {
          isAdmin = true;
        }
      });
    }

    let isTeamSyncAdmin = false;

    let ts_admins = userTeamSync && userTeamSync.admins ? userTeamSync.admins : [];

    if (ts_admins && ts_admins.length > 0) {
      ts_admins.forEach((admin) => {
        if (admin._id == currentUserId) {
          isTeamSyncAdmin = true;
        }
      });
    }

    let teamSyncAdminsArr = userTeamSync && userTeamSync.admins ? userTeamSync.admins : [];

    let teamSyncAdminNames = [];
    if (teamSyncAdminsArr.length > 0) {
      teamSyncAdminNames = teamSyncAdminsArr.map((admin) => admin.displayName || admin.name);
    }

    let col;
    let jiraSkill = this.props.skills && this.props.skills.find((skill) => skill.name == "Jira");

    // let teamSyncMembers = [];

    // if (userTeamSync && userTeamSync.selectedMembers) {
    //   teamSyncMembers = userTeamSync.selectedMembers;
    // } else if (userTeamSync && userTeamSync.selectedMembersInfo) {
    //   teamSyncMembers = userTeamSync.selectedMembersInfo;
    // }
    
    const workspaceUsers = members.map((member) => (
      
      <Option key={member.user_id._id} value={ member.user_id.displayName || member.user_id.name }>
        {
        member.user_id.displayName || member.user_id.name }
      </Option>
    ));

    const emptyColumns = [
      {
        title: "",
        render: () => <Empty description='No Activity in this Check-in yet' />,
      },
    ];
    const emptyData = [
      {
        key: "1",
        name: "",
      },
    ];

    let columns = [
      {
        className: "table_top",
        title: "Participant",
        dataIndex: "name",
        fixed: userTeamSync && userTeamSync.standuptype === "planning_poker" ? "left" : "",
        render: (response, data) => {
          if (data.user_id) {
            return (
              <Row>
                <Col style={{ marginRight: "10px" }}>
                  <span className='standup_history_badge'>
                    {/* <Avatar style={{ marginTop: "5px" }} src={this.getProfilePicUrl(data.user_id._id)}>
                      {this.getInitials(data.user_id.name)}
                    </Avatar> */}
                    {/* </Badge> */}
                  </span>
                </Col>
                <Col
                  style={{
                    // marginLeft: "10px",
                    //checking for jira activity
                    marginTop:
                      (userTeamSync && userTeamSync.showActivity && userTeamSync.showActivity.jira && userTeamSync.showActivity.jira === "true") ||
                      (userTeamSync && userTeamSync.showActivity && userTeamSync.showActivity.jira && userTeamSync.showActivity.jira === true)
                        ? jiraSkill && jiraSkill.skill_metadata.linked
                          ? ""
                          : "9px"
                        : "9px",
                  }}
                >
                  <Text strong>
                    <a onClick={() => this.ParticpantClick_handle(data)}>
                      {data.user_id.displayName||data.user_id.name}{" "}
                      {/*data.usermood && data.usermood == 1
                        ? "🤩"
                        : data.usermood == 2
                        ? "🙂"
                        : data.usermood == 3
                        ? "😐"
                        : data.usermood == 4
                        ? "🥵"
                        : data.usermood == 5
                        ? "🙁"
                        : ""
                      */}
                      {userTeamSync.customEmoji && userTeamSync.customEmoji.length != 0
                        ? data.usermood && data.usermood == 1
                          ? userTeamSync.customEmoji[0].emoji
                          : data.usermood == 2
                          ? userTeamSync.customEmoji[1].emoji
                          : data.usermood == 3
                          ? userTeamSync.customEmoji[2].emoji
                          : data.usermood == 4
                          ? userTeamSync.customEmoji[3].emoji
                          : data.usermood == 5
                          ? userTeamSync.customEmoji[4].emoji
                          : ""
                        : data.usermood && data.usermood == 1
                        ? "🤩"
                        : data.usermood == 2
                        ? "🙂"
                        : data.usermood == 3
                        ? "😐"
                        : data.usermood == 4
                        ? "🥵"
                        : data.usermood == 5
                        ? "🙁"
                        : ""}
                    </a>
                  </Text>
                  <br />
                  {data.responded_at && (
                    <span>
                      {moment(data.responded_at).format("hh:mm A")} <br />
                    </span>
                  )}
                  {(userTeamSync && userTeamSync.showActivity && userTeamSync.showActivity.jira && userTeamSync.showActivity.jira === "true") ||
                  (userTeamSync && userTeamSync.showActivity && userTeamSync.showActivity.jira && userTeamSync.showActivity.jira === true)
                    ? this.renderJiraActivity(data)
                    : ""}
                </Col>
                {/* </span> */}
              </Row>
            );
          } else {
            return (
              <Row>
                <Col>
                  <span className='standup_history_badge'>
                    {/* <Avatar
                      style={{ marginTop: "5px" }}
                    //we don't have profile pic data for shared user
                    // src={this.getProfilePicUrl(data.user_id._id)}
                    >
                      {this.getInitials(data && data.metadata && data.metadata.sharedUserName ? data.metadata.sharedUserName : this.getSharedUserName(data.user_slack_id))}
                    </Avatar> */}
                    {/* </Badge> */}
                  </span>
                </Col>
                <Col style={{ marginLeft: "10px", marginTop: "9px" }}>
                  <Text strong onClick={() => this.ParticpantClick_handle(data)}>
                    <a>
                      {data && data.metadata && data.metadata.sharedUserName
                        ? data.metadata.sharedUserName
                        : this.getSharedUserName(data.user_slack_id)}{" "}
                      (External){" "}
                      {/*data.usermood && data.usermood == 1 ? (
                        <span role='img' aria-label='excited'>
                          🤩
                        </span>
                      ) : data.usermood == 2 ? (
                        <span role='img' aria-label='happy'>
                          🙂
                        </span>
                      ) : data.usermood == 3 ? (
                        <span role='img' aria-label='ok'>
                          😐
                        </span>
                      ) : data.usermood == 4 ? (
                        <span role='img' aria-label='sick'>
                          🥵
                        </span>
                      ) : data.usermood == 5 ? (
                        <span role='img' aria-label='sad'>
                          🙁
                        </span>
                      ) : (
                        ""
                      )*/}
                      {userTeamSync.customEmoji && userTeamSync.customEmoji.length != 0 ? (
                        data.usermood && data.usermood == 1 ? (
                          <span role='img'>{userTeamSync.customEmoji[0].emoji}</span>
                        ) : data.usermood == 2 ? (
                          <span role='img'>{userTeamSync.customEmoji[1].emoji}</span>
                        ) : data.usermood == 3 ? (
                          <span role='img'>{userTeamSync.customEmoji[2].emoji}</span>
                        ) : data.usermood == 4 ? (
                          <span role='img'>{userTeamSync.customEmoji[3].emoji}</span>
                        ) : data.usermood == 5 ? (
                          <span role='img'>{userTeamSync.customEmoji[4].emoji}</span>
                        ) : (
                          ""
                        )
                      ) : data.usermood && data.usermood == 1 ? (
                        <span role='img' aria-label='excited'>
                          🤩
                        </span>
                      ) : data.usermood == 2 ? (
                        <span role='img' aria-label='happy'>
                          🙂
                        </span>
                      ) : data.usermood == 3 ? (
                        <span role='img' aria-label='ok'>
                          😐
                        </span>
                      ) : data.usermood == 4 ? (
                        <span role='img' aria-label='sick'>
                          🥵
                        </span>
                      ) : data.usermood == 5 ? (
                        <span role='img' aria-label='sad'>
                          🙁
                        </span>
                      ) : (
                        ""
                      )}{" "}
                    </a>
                  </Text>
                  {data.responded_at && (
                    <span>
                      {moment(data.responded_at).format("hh:mm A")} <br />
                    </span>
                  )}
                  {/* <br />
                  {(userTeamSync &&
                    userTeamSync.showActivity &&
                    userTeamSync.showActivity.jira &&
                    userTeamSync.showActivity.jira === "true") ||
                  (userTeamSync &&
                    userTeamSync.showActivity &&
                    userTeamSync.showActivity.jira &&
                    userTeamSync.showActivity.jira === true)
                    ? this.renderJiraActivity(data)
                    : ""} */}
                </Col>
              </Row>
            );
          }
        },
        width: 200,
      },
    ];

    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: (record) => {
        /*
        // checking if user answered or not
        let answered = record.progress_report && record.progress_report.find((val) => val && val.answer && val.answer.plain_text);
        return {
          // <<< old logic >>>
          // disabled: record.created_at && record.user_id && record.user_id._id,

          disabled: answered,

          // Column configuration not to be checked
          // name: record.name,
        };
        */
        let status = record.status == "replied" ? true : false;
        return {
          disabled: status,
        };
      },
    };

    let jiraTasks = [];
    if (
      projectTeamSyncInstance &&
      projectTeamSyncInstance.teamSync_metdata &&
      projectTeamSyncInstance.teamSync_metdata.standuptype == "jiraissuestandup"
    ) {
      jiraTasks = {
        width: 800,
        title: "Jira Issue Updates",
        className: "table_top",
        render: (data) => {
          if (data.isHoliday) {
            return (
              <>
                <Text code>User is on holiday</Text>
              </>
            );
          } else {
            if (data && data.isSkipped && data.metadata && data.metadata.jiraactivitytext == null) {
              return (
                <>
                  <Text code>Skipped this report</Text>
                </>
              );
            } else {
              if (data.metadata && data.metadata.jiraactivitytext) {
                return this.getJiraIssueText(data && data.metadata && data.metadata.jiraactivitytext && data.metadata.jiraactivitytext);
              } else {
                return <Text code>No Update</Text>;
              }
            }
          }
        },
      };
      columns.push(jiraTasks);
    }
    // let planningPokerArr = [];
    // if (
    //   projectTeamSyncInstance &&
    //   projectTeamSyncInstance.teamSync_metdata &&
    //   projectTeamSyncInstance.teamSync_metdata.standuptype == "planning_poker"
    // ) {
    //   planningPokerArr = {
    //     width: 800,
    //     title: "Planning Poker Updates",
    //     className: "table_top",
    //     render: (data) => {
    //       if (data.metadata) {
    //         return this.getPlanningPokerData(data);
    //       } else {
    //         return "No Update";
    //       }
    //     },
    //   };
    //   columns.push(planningPokerArr);
    // }

    if (
      this.props.projectTeamSyncInstance &&
      this.props.projectTeamSyncInstance.questions
      // &&
      // (projectTeamSyncInstance.teamSync_metdata.standuptype == "dailystandup" ||
      //   projectTeamSyncInstance.teamSync_metdata.standuptype ==
      //     "Daily Standup" ||
      //   projectTeamSyncInstance.teamSync_metdata.standuptype == "retrospective")
    ) {
      col = this.props.projectTeamSyncInstance.questions.map((datas, index) => {
        return {
          width: 200,
          title:
            projectTeamSyncInstance.teamSync_metdata.standuptype == "planning_poker" ? (
              <span>
                <a href={datas.meta && datas.meta.url} target='_blank'>
                  {datas.meta && datas.meta.key}:
                </a>
                {" " + datas.question_text}
              </span>
            ) : (
              datas.question_text
            ),
          className: "table_top",
          render: (data) => {
            //console.log("data",data.user_id.email,data)
            if (data.progress_report && data.progress_report[index]) {
              let tmp = 0;
              if (data.isSkipped) {
                let ans = data.progress_report.filter((ans) => ans && ans.answer && ans.answer.plain_text && ans.answer.plain_text.length > 0);
                tmp = ans.length;
              }
              return data.isHoliday ? (
                projectTeamSyncInstance.teamSync_metdata.standuptype == "planning_poker" ? (
                  <Text code>No Answer</Text>
                ) : (
                  <>
                    <Text code>User is on holiday</Text>
                    {data.previousInstanceResponse && this.getPreviousAnswer(data, index)}
                  </>
                )
              ) : (
                <div>
                  {data.isSkipped && data.isSkipped ? (
                    tmp != 0 ? (
                      data.progress_report[index] &&
                      data.progress_report[index].answer &&
                      data.progress_report[index].answer.plain_text &&
                      data.progress_report[index].answer.plain_text.length > 0 ? (
                        <>
                          <div
                            className='response_column'
                            dangerouslySetInnerHTML={{
                              __html: this.thredAnswer(data.progress_report[index].answer.plain_text, data.unfurl_medata.jiraIds,data),
                            }}
                          ></div>
                          {userTeamSync && userTeamSync.standuptype === "planning_poker" && data.progress_report[index].answer.desc && (
                            <span>
                              Reason:
                              <br />
                              {data.progress_report[index].answer.desc}
                            </span>
                          )}
                          {data.previousInstanceResponse && this.getPreviousAnswer(data, index)}
                        </>
                      ) : (
                        <Text code>No Answer</Text>
                      )
                    ) : (
                      <>
                        <Text code>Skipped this report</Text>
                        {data.previousInstanceResponse && this.getPreviousAnswer(data, index)}
                      </>
                    )
                  ) : data.progress_report[index] &&
                    data.progress_report[index].answer &&
                    data.progress_report[index].answer.plain_text &&
                    data.progress_report[index].answer.plain_text.length > 0 ? (
                    <>
                      <div
                        className='response_column'
                        dangerouslySetInnerHTML={{
                          __html: this.thredAnswer(
                            data.progress_report[index].answer.plain_text,
                            data && data.unfurl_medata && data.unfurl_medata.jiraIds,data
                          ),
                        }}
                      ></div>
       
                      {userTeamSync && userTeamSync.standuptype === "planning_poker" && data.progress_report[index].answer.desc && (
                        <span>
                          Reason:
                          <br />
                          {data.progress_report[index].answer.desc}
                        </span>
                      )}
                      {userTeamSync &&
                        userTeamSync.standuptype &&
                        (userTeamSync.standuptype === "Daily Standup" || userTeamSync.standuptype === "jiraissuestandup") &&
                        data &&
                        data.progress_report &&
                        data.progress_report[index] && (
                          <div style={{ display: "flex", flexDirection: "row" }}>
                            <Button
                              onClick={() => this.onLikeButtonClick(data, data.progress_report[index])}
                              icon={<LikeOutlined />}
                              type='text'
                              size='small'
                            >
                              {this.getTotalLikes(data, data.progress_report[index])}
                            </Button>
                            <Button
                              type='text'
                              size='small'
                              icon={<CommentOutlined />}
                              onClick={() => this.handleCommentClick(data, data.progress_report[index])}
                            >
                              {this.getCurrentAnswerCommentCount(data, data.progress_report[index])}
                            </Button>
                          </div>
                        )}

                      {this.state.showCommentModal && (
                        <RetroCommentModal
                          _getInitials={this.getInitials}
                          comments={this.state.comments}
                          showModal={this.state.showCommentModal}
                          data={this.state.likeCommentData}
                          handleCancel={this.handleCommentClose}
                          currentUserId={this.props.user_now && this.props.user_now._id}
                          isNonRetro={true}
                        />
                      )}

                      {data.previousInstanceResponse && this.getPreviousAnswer(data, index)}
                    </>
                  ) : (
                    <>
                      <Text code>No Answer</Text>
                      {data.previousInstanceResponse && this.getPreviousAnswer(data, index)}
                    </>
                  )}
                </div>
              );
            } else {
              return <Text code>No Answer</Text>;
            }
          },
        };
      });
    }

    if (col) {
      col.map((value, index) => {
        columns.splice(index + 1, 0, col[index]);
      });
    }

    let respondedId =
      instanceResponses &&
      instanceResponses.map((value, index) => {
        // return value.user_id.name
        if (value.user_id) {
          return value.user_id._id;
        }
        //to get guest user id
        else if (value.user_slack_id) {
          return value.user_slack_id;
        }

        //<<<<<<<<<another way>>>>>>>>
        // else {
        //   //getting guest  user id
        //   let user = userTeamSync.guestusersInfo.find(
        //     (usr) => usr.name == value.metadata.sharedUserName
        //   );

        //   return user && user.user_slack_id;
        // }
      });

    // if (userTeamSync && userTeamSync._id) {
    //   const selectedMembers = userTeamSync.selectedMembersInfo ? userTeamSync.selectedMembersInfo : userTeamSync.selectedMembers;
    //   selectedMembers.forEach((value) => {
    //     if (respondedId.indexOf(value._id) == -1) {
    //       instanceResponses.push({
    //         user_id: {
    //           name: value.name,
    //           _id: value._id,
    //         },
    //         userActivity: { jiraLogs: [] },
    //         showJiraActivity: false,
    //       });
    //     } else {
    //     }
    //   });
    // }

    //to  get not answered shred users

    if (projectTeamSyncInstance && projectTeamSyncInstance._id && projectTeamSyncInstance.teamSync_metdata.guestusersInfo) {
      projectTeamSyncInstance.teamSync_metdata.guestusersInfo.forEach((value) => {
        if (respondedId.indexOf(value.user_slack_id) == -1) {
          instanceResponses.push({
            metadata: {
              sharedUserName: value.name,
            },
            user_slack_id: value.user_slack_id,
          });
        }
      });
    }

    // let creator_id;
    // if (userTeamSync && userTeamSync.user_id && userTeamSync.user_id._id) {
    //   creator_id = userTeamSync.user_id._id;
    // }
    let noActiveStandup = true;
    teamSyncs &&
      teamSyncs.map((teamsync) => {
        if (teamsync.createInstance) {
          return (noActiveStandup = false);
        }
      });

    let isUserInvolved = false;
    if (projectTeamSyncInstance && projectTeamSyncInstance.teamSync_metdata && projectTeamSyncInstance.teamSync_metdata.selectedMembers) {
      isUserInvolved = projectTeamSyncInstance.teamSync_metdata.selectedMembers.find((mem) => mem._id == this.props.user_now._id);
    }

    const { customEmoji } = this.state;
    let isPreviousResponseAvailable = this.getIsPreviousResponseAvailable();
    let currentMoodScore = this.getCurrentMoodScore();
    let previousDayMoodScore = this.getPreviousDayMoodScore();
    // let userBestMoodScore = this.getUserBestMoodScore();
    // let userWorstMoodScore = this.getUserWorstMoodScore();
    return (
      <div class="reportscroll">
      <Layout
        style={{
          marginLeft: 0,
          // background: localStorage.getItem("theme") == "default" ? "#ffffff" : "rgba(15,15,15)",
          // height: "calc(100vh - (64px))",
          //overflowY: "scroll",
        }}
      >
      
        <PageHeader
          ghost={false}
          title={this.props.userTeamSync && this.state.checkInName}
          footer={
            <div class="reportscroll">
            <Tabs defaultActiveKey='1' activeKey={this.state.currentActiveKey} onChange={this.changeTab}>
              <TabPane tab='Reports' key='1' />
              <TabPane tab='Insights' key='2' />
              {userTeamSync.standuptype == "retrospective" && <TabPane tab='Action Items' key='4' />}
              <TabPane tab='Holidays' key='5' />
              <TabPane tab='Settings' key='3' />
            </Tabs>
            </div>
          }
          tags={
            this.state.selectedRowKeys.length == 0 &&
            (this.props.userTeamSync.createInstance ? <Tag color='green'>Active</Tag> : <Tag color='orange'>Paused</Tag>)
          }
        />
        {this.state.subview === "report" ? (
          <Fragment>
            <PageHeader
              style={
                {
                  // background: localStorage.getItem("theme") == "default" ? "#ffffff" : "rgba(15,15,15)",
                }
              }
              className='site-page-header-responsive'
              title={
                <Fragment>
                  {this.state.selectedRowKeys.length > 0 ? (
                    <span>
                      <Popconfirm
                        title={this.getPopconfirmTitle()}
                        onConfirm={this.sendReminder}
                        onCancel={this.handleSelectionCancel}
                        placement='rightTop'
                      >
                        <Button type='primary' style={{ marginLeft: "16px", height: "28px" }} icon={<BellOutlined />} size='small'>
                          Send Reminder
                        </Button>
                      </Popconfirm>

                      <Popconfirm
                        title={this.getPopconfirmTitleLeave()}
                        onConfirm={this.markOnLeave}
                        onCancel={this.handleSelectionCancel}
                        placement='rightTop'
                      >
                        <Button type='primary' style={{ marginLeft: "16px", height: "28px" }} size='small' disabled={!isTeamSyncAdmin && !isAdmin}>
                          Mark on Leave
                        </Button>
                      </Popconfirm>

                      <Button style={{ marginLeft: "16px", height: "28px" }} onClick={this.handleSelectionCancel} size='small'>
                        Cancel
                      </Button>
                    </span>
                  ) : (
                    <span>
                      {/* <LegacyIcon className='trigger' type={this.state.collapsed ? "menu-unfold" : "menu-fold"} onClick={this.sidertoggle} /> */}
                      {/* {this.props.userTeamSync.name ? (
                        <span style={{ paddingLeft: "16px" }}>
                          {this.props.userTeamSync.name && this.props.userTeamSync.name.length > 59 ? (
                            <Tooltip title={this.props.userTeamSync.name}>{this.props.userTeamSync.name.substring(0, 60) + "... "}</Tooltip>
                          ) : (
                            this.props.userTeamSync.name + " "
                          )}
                          Report for {this.props.teamSyncInstance ? <b>{moment(this.props.teamSyncInstance.created_at).format("DD  MMM")}</b> : ""}
                        </span>
                      ) : (
                        ""
                      )} */}
                      Report for {this.props.teamSyncInstance ? <b>{moment(this.props.teamSyncInstance.created_at).format("DD  MMM")}</b> : ""}
                    </span>
                  )}
                </Fragment>
              }
              // tags={
              //   this.state.selectedRowKeys.length == 0 &&
              //   (this.props.userTeamSync.createInstance ? <Tag color='green'>Active</Tag> : <Tag color='orange'>Paused</Tag>)
              // }
              extra={[
                <>
                  {userTeamSync &&
                    userTeamSync._id &&
                    (userTeamSync.standuptype == "dailystandup" ||
                      userTeamSync.standuptype == "Daily Standup" ||
                      userTeamSync.standuptype == "retrospective" ||
                      userTeamSync.standuptype == "planning_poker" ||
                      userTeamSync.standuptype == "team_mood_standup") &&
                    isUserInvolved &&
                    projectTeamSyncInstance &&
                    projectTeamSyncInstance._id &&
                    instanceResponses && 
                    !(this.state.selectedRowKeys.length > 0) && <AnswerModal />}
             {
   
   userTeamSync.standuptype==="Daily Standup"&&userTeamSync.createInstance&&this.props.nextInstanceNotAvailable && (
          <>
          <Button  onClick={() => this.answerNextModalToggle()}>
            Next Answer
           </Button>
           
        </>    
         )
         }
    {this.state.nextAnswerModalVisible&&<NextAnswer nextAnswerModalVisible={this.state.nextAnswerModalVisible} handleCancel={this.answerNextModalToggle} userTeamSync={userTeamSync} />}

                  {this.state.selectedRowKeys.length == 0 && (
                    <>
                      <Button.Group style={{ paddingRight: 8, marginLeft: "15px" }}>
                        {!this.props.previousInstanceNotAvailable ? (
                          <span>
                            {
                              // !this.state.loading ?
                              <Button onClick={() => this.getAnotherInstance(true, false)} icon={<LeftOutlined />}>
                                Previous
                              </Button>
                              //       :
                              //       <Button type='link' disabled icon="left">
                              //         Previous
                              // </Button>
                            }
                          </span>
                        ) : (
                          <Button type='link' disabled icon={<LeftOutlined />}>
                            Previous
                          </Button>
                        )}
                        {!this.props.nextInstanceNotAvailable ? (
                          this.state.islatestinstance ? (
                            <span>
                              {
                                // !this.state.loading ?
                                <Button onClick={() => this.getAnotherInstance(false, true)}>
                                  Next
                                  <RightOutlined />
                                </Button>

                                // :
                                // <Button type='link' disabled
                                // >
                                //   Next
                                // <Icon type='right' />
                                // </Button>
                              }
                            </span>
                          ) : (
                            <Button type='link' disabled>
                              Next
                              <RightOutlined />
                            </Button>
                          )
                        ) : (
                          <Button type='link' disabled>
                            Next
                            <RightOutlined />
                          </Button>
                        )}
                      </Button.Group>
                      <span>{!this.state.noInstance ? this.getActionItems() : ""}</span>
                    </>
                  )}
                </>,
              ]}
            />
            {/*********changes */}
            {/*
            <Content style={{ padding: "16px 16px 0px 24px" }}>
            <Row gutter={[16, 16]}>
            <Col span={6} style={{ display: "flex" }}>
              <Card
                border={false}
                title="Previous Team Mood Score"
                style={{ width: "100%" }}
                size="small"
              >
                <Statistic valueStyle={{fontSize:'20px'}} value={previousDayMoodScore} suffix={previousDayMoodScore?"/ 5":"/ 0"} />
              </Card>
            </Col>
            <Col span={6} >
            {userTeamSync.moodquestion && userTeamSync.moodquestion !== "none" && userTeamSync.moodquestion !== "None" && userBestMoodScore && userBestMoodScore.moodScore && (
              <Card
                border={false}
                title={"User with Best Score: "+userBestMoodScore.moodScore}
                style={{ width: "100%" }}
                size="small"
              >
                <Statistic valueStyle={{fontSize:'20px'}} value={userBestMoodScore.user} />
              </Card>
            )}
            </Col>
            <Col span={6} >
            {userTeamSync.moodquestion && userTeamSync.moodquestion !== "none" && userTeamSync.moodquestion !== "None" && userWorstMoodScore && userWorstMoodScore.moodScore && (
              <Card
                border={false}
                title={"User with Worst Score: "+userWorstMoodScore.moodScore}
                style={{ width: "100%" }}
                size="small"
              >
                <Statistic valueStyle={{fontSize:'20px'}} value={userWorstMoodScore.user}/>
              </Card>
              )}
            </Col>
            </Row>
            </Content>
            */}

            {/**********chnges over */}

            {/*Changes for teammood checkin report page*/}
            {!this.state.noInstance &&
              userTeamSync.standuptype === "team_mood_standup" &&
              ((this.props.projectTeamSyncInstance && this.props.projectTeamSyncInstance.isReportGenerated) === false ? (
                <ReportNotGenerated projectTeamSyncInstance={projectTeamSyncInstance} />
              ) : (
                <Content style={{ padding: "16px 16px 32px 16px", overflow: "scroll", height: "75vh" }}>
                  <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                    <Col span={6} style={{ display: "flex" }}>
                      <Card border={false} title='Responses' style={{ width: "100%" }} size='small'>
                        <Statistic value={this.getRespondedUsersPercent()} suffix={"/ " + instanceResponses.length} />
                        <Text type='secondary'>{this.getUsersOnHoliday()}</Text>
                      </Card>
                    </Col>
                    <Col span={6} style={{ display: "flex" }}>
                      <Card border={false} title='Mood Score' style={{ width: "100%" }} size='small'>
                        <Statistic value={currentMoodScore} suffix={currentMoodScore ? "/ 5" : "/ 0"} />
                        {isPreviousResponseAvailable && <Text type='secondary'>{previousDayMoodScore + " in prev report"}</Text>}
                      </Card>
                    </Col>

                    {/*userTeamSync.standuptype==="team_mood_standup" && userBestMoodScore.totalMoodResponses && (
            <Col span={6}>
            
              <Card
                border={false}
                title="User with Best Score"
                style={{ width: "100%" }}
                size="small"
              >
                {/*<Statistic value={currentMoodScore} />}
                <Text type="secondary">{userBestMoodScore.user}</Text>
              </Card>
              
            </Col>
            ) */}

                    {/*userTeamSync.standuptype==="team_mood_standup" && userWorstMoodScore.totalMoodResponses && (
            <Col span={6}>
              <Card
                border={false}
                title="User with Worst Score"
                style={{ width: "100%" }}
                size="small"
              >
                {/*<Statistic value={currentMoodScore} />}
                <Text type="secondary">{userWorstMoodScore.user}</Text>
              </Card>
            </Col>
            )*/}
                  </Row>
                  {this.state.showCommentModal && (
                    <RetroCommentModal
                      _getInitials={this.getInitials}
                      comments={this.state.comments}
                      isAnonymous={userTeamSync && userTeamSync.send_anonymous}
                      showModal={this.state.showCommentModal}
                      data={this.state.likeCommentData}
                      handleCancel={this.handleCommentClose}
                      currentUserId={this.props.user_now && this.props.user_now._id}
                    />
                  )}
                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <Row gutter={[16, 16]}>
                        {instanceResponses.map((response) => {
                          return (
                            response.status == "replied" &&
                            !response.isHoliday &&
                            !response.isSkipped && (
                              <Col span={12}>
                                <Card>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      // alignItems: "center",
                                      wordBreak: "break-word",
                                      //overflow:"scroll"
                                      // maxWidth: 250
                                    }}
                                  >
                                    {userTeamSync && !userTeamSync.send_anonymous && (
                                      <Avatar
                                        style={{ minWidth: 32 }}
                                        src={this.props.userTeamSync && response && response.user_id && this.getProfilePicUrl(response.user_id._id)}
                                        //icon={<UserOutlined />}
                                      >
                                        {response && response.user_id && ( response.user_id.displayName||response.user_id.name) && this.getInitials(response.user_id.displayName || response.user_id.name)}
                                      </Avatar>
                                    )}

                                    <span style={{ marginLeft: 10 }}>
                                      <div>
                                        {userTeamSync && userTeamSync.send_anonymous ? (
                                          <Text>{this.getUserRespondedEmoji(response) + this.getEmojiText(response)}</Text>
                                        ) : (
                                          <Text>
                                            {(response.user_id.displayName || response.user_id.name) + " " + this.getUserRespondedEmoji(response) + this.getEmojiText(response)}
                                          </Text>
                                        )}
                                        {/*<Text style={{ marginLeft: 4 }} type="secondary">
                            previously 😃
                          </Text>*/}
                                      </div>
                                      <span
                                        style={{
                                          fontWeight: "normal",
                                          fontSize: "14px",
                                          color: localStorage.getItem("theme") == "dark" ? "rgba(255, 255, 255, 0.45)" : "rgba(0, 0, 0, 0.45)",
                                        }}
                                      >
                                        {moment(response.responded_at).format("dddd DD MMM YYYY hh:mm A")}
                                      </span>
                                      <br />

                                      {userTeamSync.multiple_question.map((question) => {
                                        return (
                                          <>
                                            <div>
                                              <Text type='secondary'>{this.getUserComment(response, question)}</Text>
                                            </div>

                                            <div style={{ marginTop: 8 }}>
                                              {/*response.status=="replied" && (
                          <Popover content="Like">
                            <Button
                              onClick={() => this.onLikeButtonClick(response,this.findReport(response,question))}
                              style={{ marginRight: 4 }}
                              icon={<LikeOutlined />}
                              size="small"
                            >
                              {" "}
                              {this.getTotalLikes(response,this.findReport(response,question))}{" "}
                            </Button>
                          </Popover>
                          ) */}

                                              {response.status == "replied" && (
                                                <Popover content='Comment'>
                                                  <Button
                                                    onClick={() => this.handleCommentClick(response, this.findReport(response, question))}
                                                    style={{ marginRight: 4 }}
                                                    icon={<MessageOutlined />}
                                                    size='small'
                                                  >
                                                    {/*this.state.showCommentModalMoodCheckin[response._id] && <RetroCommentModal _getInitials={this.getInitials} comments={this.state.comments} showModal={this.state.showCommentModalMoodCheckin[response._id]} response={response} data={this.state.likeCommentData} handleCancel={this.handleCommentClose} currentUserId={this.props.user_now && this.props.user_now._id}/>*/}{" "}
                                                    {this.getCurrentAnswerCommentCount(response, this.findReport(response, question))
                                                      ? this.getCurrentAnswerCommentCount(response, this.findReport(response, question))
                                                      : "Add Comment"}{" "}
                                                  </Button>
                                                </Popover>
                                              )}
                                            </div>
                                          </>
                                        );
                                      })}
                                    </span>
                                  </div>
                                </Card>
                              </Col>
                            )
                          );
                        })}
                      </Row>
                    </Col>
                  </Row>
                </Content>
              ))}

            {/*Changes over for teammood checkin report page*/}
            {userTeamSync.standuptype !== "team_mood_standup" && (
              <Content style={{ padding: "16px 16px 32px 24px", height: "75vh", overflow: "auto" }}>
                {!this.state.noInstance ? (
                  !this.props.userTeamSync.isShared ? (
                    (this.props.projectTeamSyncInstance && this.props.projectTeamSyncInstance.isReportGenerated) === false ? (
                      <ReportNotGenerated projectTeamSyncInstance={projectTeamSyncInstance} />
                    ) : userTeamSync.standuptype === "retrospective" ? (
                      <Retrospective
                        loading={this.state.loading}
                        isTeamSyncAdmin={isTeamSyncAdmin}
                        teamsync={userTeamSync}
                        thredAnswer={this.thredAnswer}
                        questions={this.props.projectTeamSyncInstance ? this.props.projectTeamSyncInstance.questions : []}
                        instanceResponses={instanceResponses}
                        switchViewToRetroActionItems={this.switchViewToRetroActionItems}
                      />
                    ) : (
                      <Table
                        // scroll={{ x: "max-content" }}
                        scroll={userTeamSync.standuptype === "planning_poker" ? { x: "max-content" } : {}}
                        style={{ marginBottom: "5px", marginTop: "5px" }}
                        loading={this.state.loading}
                        size='small'
                        bordered={true}
                        pagination={false}
                        // columns={columns}
                        // dataSource={instanceResponses}
                        columns={userTeamSync.standuptype === "retrospective" ? instanceResponses.length > 0 && this.getRetroColumns() : columns}
                        dataSource={
                          userTeamSync.standuptype === "retrospective"
                            ? projectTeamSyncInstance && projectTeamSyncInstance.questions
                            : instanceResponses
                        }
                        id='report_table'
                        rowSelection={
                          userTeamSync.standuptype !== "retrospective" && {
                            ...rowSelection,
                          }
                        }
                        rowKey={userTeamSync.standuptype !== "retrospective" && ((record) => record.user_id && record.user_id._id)}
                      />
                    )
                  ) : (
                    //for shred standup no remainder
                    <Table
                      //   scroll={{ x: "max-content" }}
                      style={{ marginBottom: "5px", marginTop: "5px" }}
                      loading={this.state.loading}
                      size='small'
                      bordered={true}
                      pagination={false}
                      // columns={columns}
                      // dataSource={instanceResponses}
                      columns={userTeamSync.standuptype === "retrospective" ? instanceResponses.length > 0 && this.getRetroColumns() : columns}
                      dataSource={
                        userTeamSync.standuptype === "retrospective"
                          ? projectTeamSyncInstance && projectTeamSyncInstance.questions
                          : instanceResponses
                      }
                      id='report_table'
                    />
                  )
                ) : (
                  <Table size='small' pagination={false} columns={emptyColumns} dataSource={emptyData} loading={this.state.loading} />
                )}
              </Content>
            )}

            {/* jira activity modal */}
            {userTeamSync &&
              userTeamSync.standuptype &&
              (userTeamSync.standuptype == "dailystandup" || userTeamSync.standuptype == "Daily Standup") && (
                <JiraActivityModal
                  visible={this.state.jiraActivityModalVisible}
                  selectedActivityData={this.state.selectedActivityData}
                  onCancel={this.jiraActivityModalToggel}
                />
              )}
          </Fragment>
        ) : this.state.subview === "calendar" && this.state.showCalender ? (
          <Calender teamsync={this.props.userTeamSync} collapsed={this.state.collapsed} sidertoggle={this.sidertoggle} />
        ) : this.state.subview === "settings" ? (
          <Fragment>
            <PageHeader
              style={{
                // background: localStorage.getItem("theme") == "default" ? "#ffffff" : "rgba(15,15,15)",
                width: "100%",
              }}
              className='site-page-header-responsive'
              // tags={this.props.userTeamSync.createInstance ? <Tag color='green'>Active</Tag> : <Tag color='orange'>Paused</Tag>}
              title={
                <Fragment>
                  {/* <LegacyIcon className='trigger' type={this.state.collapsed ? "menu-unfold" : "menu-fold"} onClick={this.sidertoggle} /> */}
                  <span>
                    {/* {this.props.userTeamSync ? this.props.userTeamSync.name + " Settings" : ''} */}
                    {/* {this.props.userTeamSync.name ? (
                      <span>
                        {this.props.userTeamSync.name && this.props.userTeamSync.name.length > 59 ? (
                          <Tooltip title={this.props.userTeamSync.name}>{this.props.userTeamSync.name.substring(0, 60) + "... "}</Tooltip>
                        ) : (
                          this.props.userTeamSync.name + " "
                        )}
                        Settings
                      </span>
                    ) : (
                      " "
                    )} */}
                    Settings
                  </span>
                </Fragment>
              }
              extra={[
                <span>
                  {isTeamSyncAdmin || isAdmin ? (
                    <span>
                      {userTeamSync.createInstance && userTeamSync.selectedMembers ? (
                        <Popconfirm
                          title={
                            <span>
                              Please confirm if you want to run check-in :"{userTeamSync.name}" now?<br/>
                              These members{" "}
                              {(userTeamSync.selectedMembersInfo ? userTeamSync.selectedMembersInfo : userTeamSync.selectedMembers).map((value,index) => {
                                if(index < 3) return <span>{ value.displayName||value.name} </span>;
                              })}{" "}
                              {(userTeamSync.selectedMembersInfo ? userTeamSync.selectedMembersInfo : userTeamSync.selectedMembers).length > 3 && `and ${(userTeamSync.selectedMembersInfo ? userTeamSync.selectedMembersInfo : userTeamSync.selectedMembers).length - 3} others `}
                              {userTeamSync.guestusersInfo.length > 0 &&
                                userTeamSync.guestusersInfo.map((usr) => {
                                  return <span>{usr.name}</span>;
                                })}
                               will be asked to respond.
                            </span>
                          }
                          placement='leftTop'
                          onConfirm={() => this.execRunNow(userTeamSync._id)}
                        >
                          <Button icon={<ThunderboltOutlined />}>Run Now</Button>
                        </Popconfirm>
                      ) : (
                        ""
                      )}
                      <span style={{ padding: 4 }} />

                      {userTeamSync.createInstance ? (
                         <Popconfirm
                         title={<span>Please confirm if you want to disable check-in : "{userTeamSync.name}" now?</span>}
                         placement={"leftTop"}
                         onConfirm={() => this.disable(userTeamSync._id)}
                       >
                         <Button
                           icon={<PauseOutlined />}
                           // onClick={() => this.disable(userTeamSync._id)}
                         >
                           {/* Pause */}
                           Disable
                         </Button>
                       </Popconfirm>

                      ) : (
                        <span>
                          <Popconfirm
                            title=
                            {<div>{<p>Please confirm if you want to enable check-in : <br></br>"{userTeamSync.name}" now?</p>}</div>}
                            placement={"leftTop"}
                            onConfirm={() => this.enable(userTeamSync._id)}
                          >
                            <Button
                            // onClick={() => this.enable(userTeamSync._id)}
                            >
                              <CaretRightOutlined />
                              Enable
                            </Button>
                          </Popconfirm>
                        </span>
                      )}
                      {/* {this.props.userTeamSync && (
                          <span style={{ paddingLeft: "8px" }}>
                            <Button icon={<EditOutlined />} onClick={() => this.handleEdit(this.props.match.params.tId)}>
                              Edit
                            </Button>
                          </span>
                        )} */}
                      {/* {userTeamSync &&
                          (userTeamSync.standuptype == "dailystandup" ||
                            userTeamSync.standuptype == "Daily Standup" ||
                            userTeamSync.standuptype == "jiraissuestandup" ||
                            userTeamSync.standuptype == "retrospective") && (
                            <span style={{ paddingLeft: "8px" }}>
                              <Popconfirm
                                title={
                                  <span>
                                    Please confirm if you want to {userTeamSync.enableSkip ? "disable" : "enable"} skip for check-in : "
                                    {userTeamSync.name}" now?
                                  </span>
                                }
                                placement={"leftTop"}
                                onConfirm={() => this.skipConfiguration()}
                              >
                                <Button
                                  // onClick={() => this.skipConfiguration()}
                                  icon={userTeamSync.enableSkip ? <StopOutlined /> : <StepForwardOutlined />}
                                >
                                  {userTeamSync.enableSkip ? "Disable Skip" : "Enable Skip"}
                                </Button>
                              </Popconfirm>
                            </span>
                          )} */}

                      <span style={{ padding: 4 }} />
                      <Dropdown
                        overlay={
                       
<Menu onClick={(e)=>this.onCopyStandup(e,userTeamSync)}>
{userTeamSync&&(userTeamSync.standuptype!=="jiraissuestandup"&&userTeamSync.standuptype!=="planning_poker")&& <Menu.Item key="copy_standup" icon={<CopyOutlined />}>
                             
                                <span>Copy Check-In</span>
                           
                            </Menu.Item>
                        }
                        
                            <Menu.Item key="delete_standup" icon={<DeleteOutlined />}>
                            <Popconfirm
                                title=
                                 {<div>{<p>Are you sure you want to delete this check-in :<br></br>
                                 {userTeamSync.name} permanently?</p>}</div>}
                                onConfirm={() => this.deleteteamsync(userTeamSync)}
                                okText='Yes'
                                cancelText='No'
                                placement='leftTop'
                              >
                                <span>Delete Check-In</span>
                              </Popconfirm>
                            </Menu.Item>
                          </Menu>
                        }
                        placement='bottomRight'
                      >
                        <Button icon={<MoreOutlined />} />
                      </Dropdown>

                      {/* <Dropdown
                           overlay={this.standup_settings_menu(userTeamSync._id, userTeamSync.createInstance)}
                           placement="bottomRight"
                        >
                           <Button icon={<MoreOutlined />} />
                         </Dropdown> */}
                    </span>
                  ) : (
                    ""
                  )}
                </span>,
              ]}
            />
            <div
              style={{
                // background: "#fff",
                padding: "16px 16px 32px 24px",
                height: "75vh",
                overflow: "auto",
              }}
            >
              <Row className='content_row' gutter={[0, 16]}>
                <Col span={col_span}>
                  <Card
                    loading={userTeamSync.selectedMembers ? false : true}
                    title='Check-in configuration'
                    bodyStyle={{ overflow: "hidden" }}
                    size='small'
                    extra={
                      userTeamSync &&
                      // (
                      // userTeamSync.standuptype == "dailystandup" ||
                      // userTeamSync.standuptype == "Daily Standup" ||
                      // userTeamSync.standuptype == "jiraissuestandup" ||
                      // userTeamSync.standuptype == "retrospective")
                      // &&

                      // ---------------- if you enable edit for shared check-in then don't show particpants for shard check-ins ---------------------
                      this.props.userTeamSync &&
                      !userTeamSync.isShared && (
                        <span style={{ paddingLeft: "8px" }}>
                          <Button
                            icon={<EditOutlined />}
                            onClick={() => this.handleEdit(this.props.match.params.tId, userTeamSync)}
                            disabled={!(isAdmin || isTeamSyncAdmin)}
                          >
                            Edit
                          </Button>
                        </span>
                      )
                    }
                  >
                   <Paragraph type='secondary'>
                      {/* <Alert */}
                      {/* // style={{ margin: "16px 0px" }} */}
                      {userTeamSync.selectedMembers ? (
                        <span>
                          {`Check-in "${this.props.userTeamSync ? this.props.userTeamSync.name : ""}" setup by ${
                            this.props.userTeamSync.user_id ? (this.props.userTeamSync.user_id.displayName||this.props.userTeamSync.user_id.name) : ""
                          } on ${moment(this.props.userTeamSync.created_at).format("DD  MMM")}`}
                          <br />
                          {userTeamSync.selectedMembers ? (
                            <span>
                              {userTeamSync.selectedMembers.length > 3
                                ? (userTeamSync.selectedMembersInfo ? userTeamSync.selectedMembersInfo : userTeamSync.selectedMembers).map(
                                    (value, index) => {
                                      return index <= 2 ? ( value.displayName||value.name) + " " : "";
                                    }
                                  )
                                : (userTeamSync.selectedMembersInfo ? userTeamSync.selectedMembersInfo : userTeamSync.selectedMembers).map(
                                    (value) => {
                                      return (value.displayName||value.name) + " ";
                                    }
                                  )}
                              {userTeamSync.selectedMembers.length > 3 ? `and ${userTeamSync.selectedMembers.length - 3} others` : ""}{" "}
                              {userTeamSync.guestusersInfo.length > 0 &&
                                userTeamSync.guestusersInfo.map((usr) => {
                                  return <span>{usr.name} </span>;
                                })}
                              will be asked{" "}
                              {this.props.userTeamSync.multiple_question.length > 0 ? this.props.userTeamSync.multiple_question.length : ""}{" "}
                              {userTeamSync.standuptype == "dailystandup" ||
                              userTeamSync.standuptype == "Daily Standup" ||
                              userTeamSync.standuptype == "retrospective" ||
                              userTeamSync.standuptype == "planning_poker"
                                ? "questions "
                                : " to Respond "}
                              {this.props.userTeamSync.standupscheduleType == "recurring" && (
                                <span>on {this.props.userTeamSync ? this.weekdays(userTeamSync) : ""} </span>
                              )}
                              {this.props.teamSync &&
                                `${
                                  this.props.userTeamSync.timezone_type === "workspace_timezone"
                                    ? this.getTimeDate(this.props.workspace.timezone)
                                    : // : this.props.userTeamSync
                                      //     .timezone_type === "user_timezone"
                                      // ? this.getTimeDate(
                                      //     this.props.userTeamSync.user_id
                                      //       .timezone
                                      //   )
                                      ""
                                }`}
                            </span>
                          ) : (
                            ""
                          )}
                          <br />
                          {this.props.userTeamSync.user_id && this.props.userTeamSync.report_type == "after_wait_time"
                            ? `Check-in report will be delivered to ${
                                userTeamSync.reportChannels && userTeamSync.reportChannels.length > 0 ? "channels" : ""
                              } ${userTeamSync.reportChannels && userTeamSync.reportChannels.length > 0 ? this.getReportChannelText() : ""} ${
                                userTeamSync.report_members.length > 0
                                  ? userTeamSync.reportChannels && userTeamSync.reportChannels.length > 0
                                    ? "and "
                                    : ""
                                  : ""
                              } ${userTeamSync.report_members.map((mem) => {
                                return mem.displayName || mem.name;
                              })} after ${this.convertSecondsTohours(userTeamSync.wait_time)}`
                            : `Check-in report will be delivered to ${
                                userTeamSync.reportChannels && userTeamSync.reportChannels.length > 0 ? "channels" : ""
                              } ${userTeamSync.reportChannels && userTeamSync.reportChannels.length > 0 ? this.getReportChannelText() : ""} ${
                                userTeamSync.report_members.length > 0
                                  ? userTeamSync.reportChannels && userTeamSync.reportChannels.length > 0
                                    ? "and "
                                    : ""
                                  : ""
                              } ${userTeamSync.report_members.map((mem) => {
                                return mem.displayName || mem.name;
                              })} after every submission`}
                          <br />
                          {/* Standup report will be delivered at {this.caluculateWaitingTime(userTeamSync.time_at, userTeamSync.wait_time)} {this.props.userTeamSync && this.getTimeDate(this.props.userTeamSync.user_id.timezone)} <br /> */}
                          {/* {this.props.userTeamSync && this.props.userTeamSync.updated_at && this.props.userTeamSync.edited_by
                            ? `Last edited by ${this.props.userTeamSync.edited_by && (this.props.userTeamSync.edited_by.displayName||this.props.userTeamSync.edited_by.name)} at ${moment(
                                this.props.userTeamSync.updated_at
                              ).format("DD MMM LT")}  ${
                                this.props.userTeamSync.timezone_type === "workspace_timezone"
                                  ? this.getTimeDate(this.props.workspace.timezone)
                                  : // : this.props.userTeamSync
                                    //     .timezone_type === "user_timezone"
                                    // ? this.getTimeDate(
                                    //     this.props.userTeamSync.user_id
                                    //       .timezone
                                    //   )
                                    ""
                              }`
                            : this.props.userTeamSync && this.props.userTeamSync.updated_at
                            ? `Last edited at ${moment(this.props.userTeamSync.updated_at).format("DD MMM LT")}  ${
                                this.props.userTeamSync.timezone_type === "workspace_timezone"
                                  ? this.getTimeDate(this.props.workspace.timezone)
                                  : // : this.props.userTeamSync
                                    //     .timezone_type === "user_timezone"
                                    // ? this.getTimeDate(
                                    //     this.props.userTeamSync.user_id
                                    //       .timezone
                                    //   )
                                    ""
                              }`
                            : ""} */}
                        </span>
                      ) : (
                        <Spin size='small' style={{ marginLeft: "50%" }} />
                      )}
                      {/* type='info' */}
                      {/* /> */}
                    </Paragraph>
                  </Card>
                </Col>
              </Row>
              <br />
              <Row className='content_row' gutter={[0, 16]}>
                <Col span={col_span}>
                  {userTeamSync.standuptype != "retrospective" && userTeamSync.standuptype !== "planning_poker"  && (
                    <>
                      <Card
                        loading={userTeamSync.selectedMembers ? false : true}
                        title='Check-in late submission'
                        size='small'
                        bodyStyle={{ overflow: "hidden" }}
                        // extra={
                        //   <div>
                        //     <Switch loading={userTeamSync.selectedMembers?false:true} disabled={!(this.state.isAdmin || this.state.isTeamSyncAdmin)} onChange={(e)=>{this.handleSubmissionAfterWaitTime(e,userTeamSync._id)}}
                        //     checked={this.state.handleSubmissionAfterWaitTime}
                        //     // checked={this.state.isUnfurlLink}
                        //     />
                        //   </div>
                        // }
                      >
                        <Paragraph type='secondary'>
                          <div style={lateSubmissionAndUpdateStyle}>
                            <p>Allow participants to submit after wait time</p>
                            <Switch
                              loading={userTeamSync.selectedMembers ? false : true}
                              disabled={userTeamSync.standuptype == "retrospective" || !(isAdmin || isTeamSyncAdmin)}
                              onChange={(e) => {
                                this.handleSubmissionAfterWaitTime(e, userTeamSync._id);
                              }}
                              checked={this.state.handleSubmissionAfterWaitTime}
                              // checked={this.state.isUnfurlLink}
                            />
                          </div>
                          <div style={lateSubmissionAndUpdateStyle}>
                            <p>Allow participants to update submissions after wait time</p>
                            <Switch
                              loading={userTeamSync.selectedMembers ? false : true}
                              disabled={
                                userTeamSync.standuptype == "retrospective" ||
                                !(isAdmin || isTeamSyncAdmin) ||
                                this.state.handleSubmissionAfterWaitTime
                              }
                              checked={this.state.handleUpdateAfterWaitTime || this.state.handleSubmissionAfterWaitTime}
                              onChange={(e) => {
                                this.handleUpdateAfterWaitTime(e, userTeamSync._id);
                              }}
                            />
                          </div>
                        </Paragraph>
                      </Card>
                      <br></br>
                    </>
                  )}
                  <Collapse>
                    <Collapse.Panel header='Check-in Administration'>
                      <Paragraph type='secondary'>Configure Check-in administrators</Paragraph>
                      <Select
                        mode='multiple'
                        placeholder='Add admins for this check-in'
                        disabled={!(isTeamSyncAdmin || isAdmin)}
                        // value={this.state.currentMemberSelected}
                        value={teamSyncAdminNames}
                        style={{ width: 200 }}
                        // defaultValue={teamSyncAdminNames}
                        onSelect={this.handleAdminSelect}
                        onDeselect={this.handleAdminDeselect}
                      >
                        {workspaceUsers}
                      </Select>
                    </Collapse.Panel>
                    {/* <br></br> */}

                    {userTeamSync &&
                      (userTeamSync.standuptype == "dailystandup" ||
                        userTeamSync.standuptype == "Daily Standup" ||
                        userTeamSync.standuptype == "jiraissuestandup" ||
                        userTeamSync.standuptype == "retrospective") && (
                        <Collapse.Panel
                          className='collapse_with_action'
                          loading={userTeamSync.selectedMembers ? false : true}
                          header='Check-in allow skip'
                          bodyStyle={{ overflow: "hidden" }}
                          extra={
                            <Popconfirm
                              title={
                                <span>
                                  Please confirm if you want to {userTeamSync.enableSkip ? "disable" : "enable"} skip for check-in : "
                                  {userTeamSync.name}" now?
                                </span>
                              }
                              placement={"leftTop"}
                              onConfirm={() => this.skipConfiguration()}
                            >
                              <Switch disabled={!(isAdmin || isTeamSyncAdmin)} checked={userTeamSync.enableSkip} />
                            </Popconfirm>
                          }
                        >
                          <Paragraph type='secondary'>
                            <p>Allow participants to skip check-in</p>
                          </Paragraph>
                        </Collapse.Panel>
                      )}
                    {userTeamSync.standuptype === "team_mood_standup" ||
                    userTeamSync.standuptype === "Daily Standup" ||
                    userTeamSync.standuptype === "dailystandup" ? (
                      userTeamSync.moodquestion &&
                      userTeamSync.moodquestion !== "none" &&
                      userTeamSync.moodquestion !== "None" &&
                      (isAdmin || isTeamSyncAdmin) && (
                        <Collapse.Panel size='small' header='Team Mood Emojis'>
                          <div style={{ marginBottom: 8, height: 40 }}>
                            <Text type='secondary'>
                              These options will be displayed as available answers to the team mood question (how are you feeling today). Score 5 is
                              highest and 1 is lowest.
                            </Text>
                          </div>

                          {customEmoji.map((item, index) => {
                            return (
                              <div style={{ marginBottom: 8 }}>
                                <Text type='secondary'>{"Score " + customEmoji[index].score + ":"}</Text>
                                <Popover
                                  content={
                                    <Picker
                                      disableSearchBar
                                      onEmojiClick={(event, emojiObject) => this.onEmojiClick(index, event, emojiObject)}
                                      groupVisibility={{
                                        flags: false,
                                        animals_nature: false,
                                        food_drink: false,
                                        travel_places: false,
                                        activities: false,
                                        objects: false,
                                        symbols: false,
                                        recently_used: false,
                                      }}
                                      native={true}
                                    />
                                  }
                                  title='Pick emoji'
                                  trigger='click'
                                  index={index}
                                  visible={this.state.visible[index]}
                                  onVisibleChange={(popOverVisible) => this.handleVisibleChange(popOverVisible, index)}
                                >
                                  <Button type='text' style={{ marginRight: 4 }}>
                                    {customEmoji && customEmoji[index].emoji} Change
                                  </Button>
                                </Popover>
                                <Input
                                  index={index}
                                  item={item}
                                  width={150}
                                  style={{ width: 150 }}
                                  maxLength={15}
                                  value={customEmoji[index].text}
                                  onChange={(event) => this.changeEmojiText(index, item, event)}
                                />
                              </div>
                            );
                          })}
                          <div style={{ marginBottom: 8 }}>
                            <Button type='primary' className='btn_114' style={{ marginRight: 4 }} onClick={this.saveCustomEmoji}>
                              Save
                            </Button>
                            <Popconfirm
                              title={this.resetCustomEmojiConfirmation()}
                              onConfirm={this.resetCustomEmoji}
                              onCancel={this.resetCustomEmojiCancel}
                              placement='rightTop'
                            >
                              <Button danger className='btn_114' style={{ marginLeft: "16px" }}>
                                Reset
                              </Button>
                            </Popconfirm>
                          </div>
                        </Collapse.Panel>
                      )
                    ) : (
                      <></>
                    )}
                  </Collapse>
                  <div className='hidden_emoji_picker' style={{ visibility: "hidden" }}>
                    <Picker
                      disableSearchBar
                      onEmojiClick={(event, emojiObject) => this.onEmojiClick(event, emojiObject)}
                      groupVisibility={{
                        flags: false,
                        animals_nature: false,
                        food_drink: false,
                        travel_places: false,
                        activities: false,
                        objects: false,
                        symbols: false,
                        recently_used: false,
                      }}
                      native={true}
                    />
                  </div>
                  <br></br>
                  <br></br>
                </Col>
              </Row>
            </div>

            {this.state.edit && (
              <CreateTeamsyncModal
                newStandupModalVisible={this.state.newStandupModalVisible}
                modalToggle={this.toggleNewStandupModal}
                edit={this.state.edit}
                editTeamSyncId={this.props.match.params.tId}
                selectedTeamSyncForEdit={this.state.selectedTeamSyncForEdit}
                isCopying={this.state.isCopying}
                // standuptype={this.state.standuptype}
                // https://stackoverflow.com/questions/37949981/call-child-method-from-parent
                setClick={(click) => (this.clickChild = click)}
                //++++++++ whenever you add something here check in sidenavebar,allStandups,dashboard files too +++++++
              />
            )}
          </Fragment>
        ) : this.state.subview === "insights" ? (
          <Insights collapsed={this.sidertoggle} iconState={this.state.collapsed} Loading={this.state.loading} />
        ) : this.state.subview === "actionItems" ? (
          <RetroActionItems
            switchViewFromRetroActionItems={this.switchViewFromRetroActionItems}
            isTeamSyncAdmin={isTeamSyncAdmin}
            isAdmin={isAdmin}
            userTeamSync={userTeamSync}
          />
        ) : (
          "Unknown"
        )}
      </Layout>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    user_now: store.common_reducer.user,
    teamSync: store.skills.currentteamsync,
    teamSyncs: store.skills.userTeamSyncs,
    projectTeamSyncInstance: store.skills.projectTeamSyncInstance,
    instanceResponses: store.skills.instanceResponses,

    nextInstanceNotAvailable: store.skills.nextInstanceNotAvailable,
    teamSyncInstance: store.skills.projectTeamSyncInstance,
    previousInstanceNotAvailable: store.skills.previousInstanceNotAvailable,
    userTeamSync: store.skills.userTeamSync,
    skills: store.skills.skills,
    assistant: store.skills.team,
    workspace: store.common_reducer.workspace,
    members: store.skills.members,
    channels: store.skills.channels,
    usermappings: store.skills.userMappingsWithUsers,
    recentTeamsyncs: store.skills.recentTeamsyncs
  };
};
export default withRouter(
  connect(mapStateToProps, {
    // SkillsAction,
    getUserTeamSync,
    getUsersSelectedTeamSync,
    getProjectTeamSyncInstance,
    getAnotherInstancePage,
    editTeamSync,
    excecuteTeamSync,
    deleteteamsync,
    setCurrentTeamsync,
    sendTeamsyncAck,
    exportToCsv,
    deleteTeamInstance,
    getJiraUserActivity,
    getAssisantSkills,
    getUserMappingAndUsers,
    updateUserHoliday,
    answerTeamSync,
    updateTeamSyncCustomEmoji,
    addLikeToStandupVer2,
    addLikeToStandup,
    deleteRecentTeamsync,
    addTeamSyncAdmin,
    deleteTeamSyncAdmin,
    getChannelList
  })(Standup_Head)
);

// getIssueData = (str) => {
//   str = str.split("\n");
//   let name = str[0].split("*");
//   let issueDataArr = [];
//   str.forEach((data, index) => {
//     let arr = index != str.length - 1 && str[index + 1].split("*");
//     index != str.length - 1 && issueDataArr.push(arr);
//   });
//   return (
//     <span>
//       <strong>
//         :{name[1]} <br />
//       </strong>
//       {issueDataArr.map((data) => {
//         console.log(data);
//         if (data[1] == "Assignee") {
//           let assigneeArr = data[2].split("to");
//           if (assigneeArr[1]) {
//             let assignedTo = data[2].split("to")[1];
//             assignedTo = assignedTo.slice(2).slice(0, -2);
//             assigneeArr[0] = assigneeArr[0].split("<");
//             let AssignerArr = assigneeArr[0][1].slice(0, -1).split("|");
//             AssignerArr[1] = AssignerArr[1].slice(1);
//             AssignerArr[1] = AssignerArr[1].slice(0, -1);
//             return (
//               <span>
//                 <strong>{data[1]} </strong>
//                 {"=>"} chenged from <strong>{AssignerArr[1]}</strong> to{" "}
//                 <strong>{assignedTo}</strong>
//                 <br />
//               </span>
//             );
//           } else if (data[2].includes("https://")) {
//             let assignedTo = data[2].split("|")[1].slice(1).slice(0, -2);
//             return (
//               <span>
//                 <strong>{data[1]} </strong> {"=>"}{" "}
//                 <strong>{assignedTo && assignedTo}</strong>
//                 <br />
//               </span>
//             );
//           } else {
//             let assigneeNameArr = data[2].split("`");
//             return (
//               <span>
//                 <strong>{data[1]} </strong> {"=>"}{" "}
//                 <strong>{assigneeNameArr[1]}</strong>
//                 <br />
//               </span>
//             );
//           }
//         } else if (data[1] == "description") {
//           // console.log(data);
//           let descData = data[2];
//           descData = descData.split("<");
//           if (descData[1]) {
//             descData[1] = descData[1].slice(0, -1).split("|");
//             descData[1][1] = descData[1][1].slice(1);
//           }
//           // console.log(descData[1]);
//           return (
//             <span>
//               <strong>{data[1]}</strong>
//               {descData[0]}{" "}
//               {descData[1] && descData[1][1] && (
//                 <strong>{descData[1][1]}</strong>
//               )}
//               <br />
//             </span>
//           );
//         } else {
//         console.log(data);
//           return (
//             <span>
//               <strong>{data[1]}</strong>
//               {data[2]}
//               <br />
//             </span>
//           );
//         }
//       })}
//     </span>
//   );
// };
