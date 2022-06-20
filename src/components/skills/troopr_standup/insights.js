import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Icon as LegacyIcon } from "@ant-design/compatible";
import {toHTML} from "slack-markdown"
import {
  Card,
  Typography,
  Row,
  Col,
  Tooltip,
  PageHeader,
  Avatar,
  Tag,
  Select,
  DatePicker,
  Popconfirm,
  Button,
  Result,
  Dropdown,
  Menu,
  Badge,
  Modal,
  Spin,
  Layout,
  Popover
} from "antd";
import axios from "axios";
import { DownloadOutlined, EllipsisOutlined, UserOutlined, MessageOutlined, LikeOutlined } from "@ant-design/icons";
import Engagement from "./insights-engagement";
// import Pdf from "./ReoprtPdf";
import { getStandupHistory, getStandupCsvReport, sendReportEmail } from "../skills_action";
import moment from "moment";
import { CSVLink, CSVDownload } from "react-csv";

const { Text, Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Content } = Layout;

class Insights extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      defaultRangePickerValue: [],
      defaultRangeValue: [],
      selectedMembers: [],
      loading: true,
      userSelected: false,
      showMore: false,
      responseDataEmpty: true,
      allMembers: [],
      membersReady: false,
      downloadCsvModal: false,
      sendEmailModal: false,
      selectedQuestions: [],
      insightsModalVisible: false,
      showRangePicker: false,
    };
  }

  componentDidMount() {
    // const today = new Date();
    // // today.setHours(23, 59, 0);
    // const Today = new Date(today);
    // const yesterday = new Date();
    // yesterday.setDate(yesterday.getDate() - 1);
    // // yesterday.setHours(0, 0, 0);

    let today = new Date();
    let yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 29);

    today.setHours(23, 59, 0);

    // console.log(
    //   new Date(today),
    //   new Date(new Date(yesterday).setHours(0, 0, 0))
    // );

    // const Yesterday = new Date(yesterday);
    let defaultRangePickerValue = [moment(yesterday, "YYYY-MM-DD"), moment(today, "YYYY-MM-DD")];
    let defaultRangeValue = [new Date(new Date(yesterday).setHours(0, 0, 0)), new Date(today)];
    this.setState({ defaultRangeValue, defaultRangePickerValue });
    this.props.match.params.history_user_id &&
      this.setState({
        selectedMembers: [this.props.match.params.history_user_id],
        // startDate: new Date(new Date(yesterday).setHours(0, 0, 0)),
        // endDate: new Date(today),
      });
    let data = {
      startAt: 0,
      startDate: new Date(new Date(yesterday).setHours(0, 0, 0)),
      endDate: new Date(today),
    };
    if (this.props.match.params.history_user_id) {
      data.user_id = this.props.match.params.history_user_id;
    }
    //for guest user
    if (this.props.match.params.history_user_slack_id) {
      data.user_slack_id = this.props.match.params.history_user_slack_id;
    }
    this.getSelectedMemberdata();
    this.setState({ loading: true });
    this.props.getStandupHistory(this.props.match.params.wId, this.props.match.params.tId, data).then((res) => {
      if (res.data.success) {
        let tmp;
        res.data.responses.length == 0 && this.setState({ responseDataEmpty: true });

        tmp = res.data.responses.find((val) => val.status == "replied");
        tmp ? this.setState({ responseDataEmpty: false }) : this.setState({ responseDataEmpty: true });
        this.props.userTeamSync.standuptype == "planning_poker" && this.checkPlanningPokerRes();
        this.setState({ loading: false });
      }
    });

    // to check next page is available or not

    axios
      .get(`/api/${this.props.match.params.wId}/teamSync/${this.props.match.params.tId}/userResponses`, {
        params: {
          startAt: 100,
          startDate: data.startDate,
          endDate: data.endDate,
          user_id: data.user_id,
        },
      })
      .then((res) => {
        if (res.data.success && res.data.responses.length > 0) {
          this.setState({ showMore: true });
        }
      });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.userTeamSync != this.props.userTeamSync) {
      this.getSelectedMemberdata();
    }
  }

  getSelectedMemberdata = () => {
    const { userTeamSync, members } = this.props;

    if (userTeamSync.selectedMembers && (userTeamSync.selectedMembers[0].displayName || userTeamSync.selectedMembers[0].name)) {
      // console.log('here',userTeamSync)

      this.setState(
        {
          allMembers: userTeamSync.selectedMembers,
          membersReady: true,
        },
        () => {
          if (userTeamSync.isShared) {
            this.getGuestUser();
          }
        }
      );
    } else {
      let allMembers = [];
      //old logic
      // userTeamSync.selectedMembers &&
      //   userTeamSync.selectedMembers.forEach((mem) => {
      //     let tmp = members && members.find((val) => val.user_id._id == mem);

      //     tmp && allMembers.push(tmp);
      //   });

      if(userTeamSync.selectedMembersInfo){
        allMembers = [...userTeamSync.selectedMembersInfo]
      }

      this.setState({ allMembers, membersReady: true }, () => {
        if (userTeamSync.isShared) {
          this.getGuestUser();
        }
      });
    }
  };

  getGuestUser = () => {
    const { userTeamSync } = this.props;

    let allMembers = [...this.state.allMembers];

    userTeamSync.guestusersInfo &&
      userTeamSync.guestusersInfo.length > 0 &&
      userTeamSync.guestusersInfo.forEach((mem) => {
        allMembers.push(mem);
      });

    this.setState({
      allMembers: allMembers,
    });
  };

  // sortInstances = () => {
  //   let allIds = this.props.standupHistory.responses.map(
  //     (res) => res.question_instance_id
  //   );
  //   let instanceIds = [...new Set(allIds)];
  //   this.setState({ instanceIds });
  //   this.groupInstances(
  //     this.props.standupHistory.responses,
  //     "question_instance_id"
  //   );
  // };

  // groupInstances(array, property) {
  //   var hash = {};
  //   for (var i = 0; i < array.length; i++) {
  //     if (!hash[array[i][property]]) hash[array[i][property]] = [];
  //     hash[array[i][property]].push(array[i]);
  //   }
  //   this.setState({ instanceResponses: hash, loading: false });
  // }

  getInitials(string) {
    // return string
    //   .trim()
    //   .split(" ")
    //   .map(function (item) {
    //     if (item.trim() != "") {
    //       return item[0].toUpperCase();
    //     } else {
    //       return;
    //     }
    //   })
    //   .join("")
    //   .slice(0, 2);

    if (string) {
      let nameArr = string
        .trim()
        .replace(/\s+/g, " ") //remove extra spaces
        .split(" ");

      if (nameArr.length > 1) return (nameArr[0][0] + nameArr[1][0]).toUpperCase();
      else return nameArr[0].slice(0, 2).toUpperCase();
    } else return "";
  }

  getTimeDate = (timezone) => {
    let date = new Date().toLocaleString("en-US", { timeZone: timezone });
    let options = { timeZoneName: "long", timeZone: timezone };
    let tz = new Date().toLocaleString("en-US", options).split(" ");
    let tzName = tz[3] + " " + tz[4] + " " + tz[5];
    return moment(date).format("ddd hh:mm A") + " " + this.getInitials(tzName);
  };

  // disabledDate = (current) => {
  //   // to do addition in date
  //   //   function addDays(theDate, days) {
  //   //     return new Date(theDate.getTime() + days*24*60*60*1000);
  //   // }

  //   // var newDate = addDays(new Date(), 5);

  //   const today = new Date();
  //   const yesterday = new Date(today);

  //   const firstInstance = moment("2020-07-9", "YYYY-MM-DD");
  //   const lastInstance = moment("2020-08-5", "YYYY-MM-DD");
  //   return current < firstInstance || current > lastInstance;
  // };

  findUser = (response) => {
    const { userTeamSync, members } = this.props;
    if (response && response.user_id) {
      const id = response.user_id;
      if (userTeamSync.selectedMembers && userTeamSync.selectedMembers.length > 0 && members.length > 0) {
        let user = userTeamSync.selectedMembers && userTeamSync.selectedMembers.find((mem) => mem._id == id);

        if (user) {
          return user.displayName||user.name;
        } else {
          user = members && members.find((mem) => mem.user_id._id == id);
          if (user) {
            return user.user_id.displayName||user.user_id.name;
          } else {
            return "";
          }
        }
      }
    } else if (response && response.metadata && response.metadata.sharedUserName) {
      return response.metadata.sharedUserName + ' (External)';
    } else {
      const userFound = userTeamSync.guestusersInfo && userTeamSync.guestusersInfo.find((user) => user.user_slack_id == response.user_slack_id);
      return userFound ? (userFound.displayName||userFound.name) + ' (External)' : "";
    }
  };

  getAvatarInitials = (response) => {
    let username = this.findUser(response);

    if(username && username.includes(' (External)')) username = username.replace(' (External)', '')
    return username && this.getInitials(username);
  };

  getProfilePicUrl = (id) => {
    const { userTeamSync, members } = this.props;

    if (userTeamSync.selectedMembers.length > 0 && members.length > 0) {
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

  // getResData = (id) => {
  //   let res = this.props.user.responses.find((val) => val.question_instance_id == id);
  //   return {
  //     date: moment(res.created_at).format(" DD MMM YYYY"),
  //     day: moment(res.created_at).format("dddd"),
  //     name: res.name,
  //   };
  // };

  checkUser = (value) => {
    const { userTeamSync } = this.props;
    const guestUser = userTeamSync.guestusersInfo.find((usr) => usr.user_slack_id == value);
    if (guestUser) {
      return true;
    } else {
      return false;
    }
  };

  checkPlanningPokerRes = () => {
    //we are doing this, when standup is "planning_poker" and user is on holiday then we are not considering that res,
    // so here we are checking, if all the res is on holiday or not, if all res is on holiday, then responseData is empty
    const { standupHistory } = this.props;
    if (!this.state.responseDataEmpty) {
      let tmp = false;
      tmp = standupHistory && standupHistory.responses.filter((res) => res.isHoliday == false);
      tmp.length == 0 && this.setState({ responseDataEmpty: true });
    }
  };

  handleUserChange = (value) => {
    const { userTeamSync } = this.props;
    // console.log('select value',value)
    this.setState({ showMore: false, loading: true });
    this.setState({ selectedMembers: value, userSelected: true });

    let data = {
      startAt: 0,
      startDate: new Date(new Date(this.state.defaultRangeValue[0]).setHours(0, 0, 0)),
      endDate: new Date(new Date(this.state.defaultRangeValue[1]).setHours(23, 59, 0)),
    };
    let user_id = [],
      user_slack_id = [];

    if (!userTeamSync.isShared && value.length > 0) {
      data.user_id = value;
    }

    if (userTeamSync.isShared && value.length > 0) {
      // data.user_id = value;

      value.forEach((val) => {
        if (this.checkUser(val)) {
          user_slack_id.push(val);
        } else {
          user_id.push(val);
        }
      });
    }
    if (user_id.length > 0) data.user_id = user_id;
    if (user_slack_id.length > 0) data.user_slack_id = user_slack_id;

    this.props.getStandupHistory(this.props.match.params.wId, this.props.match.params.tId, data).then((res) => {
      if (res.data.success) {
        let tmp;
        res.data.responses.length == 0 && this.setState({ responseDataEmpty: true });

        tmp = res.data.responses.find((val) => val.status == "replied");

        tmp ? this.setState({ responseDataEmpty: false }) : this.setState({ responseDataEmpty: true });
        userTeamSync.standuptype == "planning_poker" && this.checkPlanningPokerRes();
        this.setState({ loading: false });
      }

      //to check for next page
      axios
        .get(`/api/${this.props.match.params.wId}/teamSync/${this.props.match.params.tId}/userResponses`, {
          params: {
            startAt: res.data.startAt + 100,
            startDate: data.startDate,
            endDate: data.endDate,
            user_id: user_id,
            user_slack_id: user_slack_id,
          },
        })
        .then((res) => {
          if (res.data.success && res.data.responses.length > 0) {
            this.setState({ showMore: true });
          }
        });
    });
  };

  handleTimeRangeChange = (value) =>{
    const { userTeamSync } = this.props;
    let startDate
    let endDate
    let today = new Date()
    if(value==="today"){
      this.setState({showRangePicker:false})
      startDate = new Date(today.setHours(0,0,0))
      endDate = new Date(today.setHours(23,59,59))
    }else if(value==="yesterday"){
      this.setState({showRangePicker:false})
      let yesterday = new Date(today.setDate(today.getDate() - 1))
      startDate = new Date(yesterday.setHours(0,0,0))
      endDate = new Date(yesterday.setHours(23,59,59))
    }else if(value==="last7days"){
      this.setState({showRangePicker:false})
      let last7day=new Date(today)
      last7day=new Date(last7day.setDate(last7day.getDate() - 6))
      //let yesterday = new Date(today.setDate(today.getDate() - 1))
      startDate = new Date(last7day.setHours(0,0,0))
      //endDate = new Date(yesterday.setHours(23,59,59))
      endDate=new Date(today.setHours(23,59,59))
    }else if(value==="last14days"){
      this.setState({showRangePicker:false})
      let last14day=new Date(today)
      last14day=new Date(last14day.setDate(last14day.getDate() - 13))
      //let yesterday = new Date(today.setDate(today.getDate() - 1))
      startDate = new Date(last14day.setHours(0,0,0))
      //endDate = new Date(yesterday.setHours(23,59,59))
      endDate=new Date(today.setHours(23,59,59))
    }else if(value==="last30days"){
      this.setState({showRangePicker:false})
      let last30day=new Date(today)
      last30day=new Date(last30day.setDate(last30day.getDate() - 29))
      //let yesterday = new Date(today.setDate(today.getDate() - 1))
      startDate = new Date(last30day.setHours(0,0,0))
      //endDate = new Date(yesterday.setHours(23,59,59))
      endDate=new Date(today.setHours(23,59,59))
    }else if(value==="thisMonth"){
      this.setState({showRangePicker:false})
      startDate=new Date(new Date(today.getFullYear(),today.getMonth(),1).setHours(0,0,0))
      endDate=new Date(new Date(today.getFullYear(),today.getMonth()+1,0).setHours(23,59,59))
    }else if(value==="lastMonth"){
      this.setState({showRangePicker:false})
      let lastMonth=new Date(today.setMonth(today.getMonth()-1))
      startDate=new Date(new Date(lastMonth.getFullYear(),lastMonth.getMonth(),1).setHours(0,0,0))
      endDate=new Date(new Date(lastMonth.getFullYear(),lastMonth.getMonth()+1,0).setHours(23,59,59))
    }else if(value==="customRange"){
      const {showRangePicker} = this.state
      this.setState({showRangePicker:true})
      let last30days = new Date(today);
      last30days.setDate(last30days.getDate() - 29);
      startDate=new Date(new Date(last30days).setHours(0,0,0))
      endDate=new Date(new Date(today).setHours(23,59,59))
    }
    
    let defaultRangePickerValue = [moment(startDate, "YYYY-MM-DD"), moment(endDate, "YYYY-MM-DD")];
    let defaultRangeValue = [startDate, endDate];
    this.setState({defaultRangePickerValue,defaultRangeValue})

    let data = {
      startAt: 0,
      startDate: new Date(new Date(startDate).setHours(0, 0, 0)),
      endDate: new Date(new Date(endDate).setHours(23, 59, 0)),
    };

    let user_id = [],
      user_slack_id = [];
    if (!userTeamSync.isShared && this.state.selectedMembers.length > 0) {
      data.user_id = this.state.selectedMembers;
    }
    if (userTeamSync.isShared && this.state.selectedMembers.length > 0) {
      this.state.selectedMembers.forEach((val) => {
        if (this.checkUser(val)) {
          user_slack_id.push(val);
        } else {
          user_id.push(val);
        }
      });
    }
    if (user_id.length > 0) data.user_id = user_id;
    if (user_slack_id.length > 0) data.user_slack_id = user_slack_id;

    this.props.getStandupHistory(this.props.match.params.wId, this.props.match.params.tId, data).then((res) => {
      if (res.data.success) {
        this.setState({ loading: false });
        let tmp;
        res.data.responses.length == 0 && this.setState({ responseDataEmpty: true });

        tmp = res.data.responses.find((val) => val.status == "replied");
        tmp ? this.setState({ responseDataEmpty: false }) : this.setState({ responseDataEmpty: true });
        userTeamSync.standuptype == "planning_poker" && this.checkPlanningPokerRes();
        this.setState({ loading: false });
      }

      //to check for next page
      axios
        .get(`/api/${this.props.match.params.wId}/teamSync/${this.props.match.params.tId}/userResponses`, {
          params: {
            startAt: res.data.startAt + 100,
            startDate: data.startDate,
            endDate: data.endDate,
            user_id: data.user_id,
            user_slack_id: data.user_slack_id,
          },
        })
        .then((res) => {
          if (res.data.success && res.data.responses.length > 0) {
            this.setState({ showMore: true });
          }
        });
    });
    }

  rangeChange = (value) => {
    const { userTeamSync } = this.props;
    // let defaultRangeValue = [moment(value[0]), moment(value[1])];
    // this.setState({ defaultRangeValue });
    this.setState({ showMore: false, loading: true });
    const startDate = value[0].format();
    const EndDate = value[1].format();

    // console.log(
    //   new Date(new Date(startDate).setHours(0, 0, 0)),
    //   new Date(new Date(EndDate).setHours(23, 59, 0))
    // );

    let defaultRangePickerValue = value;
    let defaultRangeValue = [startDate, EndDate];

    this.setState({ defaultRangeValue, defaultRangePickerValue });
    let data = {
      startAt: 0,
      startDate: new Date(new Date(startDate).setHours(0, 0, 0)),
      endDate: new Date(new Date(EndDate).setHours(23, 59, 0)),
    };

    let user_id = [],
      user_slack_id = [];
    if (!userTeamSync.isShared && this.state.selectedMembers.length > 0) {
      data.user_id = this.state.selectedMembers;
    }
    if (userTeamSync.isShared && this.state.selectedMembers.length > 0) {
      this.state.selectedMembers.forEach((val) => {
        if (this.checkUser(val)) {
          user_slack_id.push(val);
        } else {
          user_id.push(val);
        }
      });
    }
    if (user_id.length > 0) data.user_id = user_id;
    if (user_slack_id.length > 0) data.user_slack_id = user_slack_id;

    this.props.getStandupHistory(this.props.match.params.wId, this.props.match.params.tId, data).then((res) => {
      if (res.data.success) {
        this.setState({ loading: false });
        let tmp;
        res.data.responses.length == 0 && this.setState({ responseDataEmpty: true });

        tmp = res.data.responses.find((val) => val.status == "replied");
        tmp ? this.setState({ responseDataEmpty: false }) : this.setState({ responseDataEmpty: true });
        userTeamSync.standuptype == "planning_poker" && this.checkPlanningPokerRes();
        this.setState({ loading: false });
      }

      //to check for next page
      axios
        .get(`/api/${this.props.match.params.wId}/teamSync/${this.props.match.params.tId}/userResponses`, {
          params: {
            startAt: res.data.startAt + 100,
            startDate: data.startDate,
            endDate: data.endDate,
            user_id: data.user_id,
            user_slack_id: data.user_slack_id,
          },
        })
        .then((res) => {
          if (res.data.success && res.data.responses.length > 0) {
            this.setState({ showMore: true });
          }
        });
    });
  };

  onQuestionChanges = (selectedQuestions, selectedQuestionsData) => {
    this.setState({ selectedQuestions: selectedQuestionsData });
  };

  showMore = () => {
    const { userTeamSync } = this.props;

    this.setState({ showMore: false });
    let data = {
      startAt: this.props.standupHistory.startAt + 100,
      startDate: new Date(new Date(this.state.defaultRangeValue[0]).setHours(0, 0, 0)),
      endDate: new Date(new Date(this.state.defaultRangeValue[1]).setHours(23, 59, 0)),
    };

    let user_id = [],
      user_slack_id = [];
    if (!userTeamSync.isShared && this.state.selectedMembers.length > 0) {
      data.user_id = this.state.selectedMembers;
    }
    if (userTeamSync.isShared && this.state.selectedMembers.length > 0) {
      // data.user_id = value;

      this.state.selectedMembers.forEach((val) => {
        if (this.checkUser(val)) {
          user_slack_id.push(val);
        } else {
          user_id.push(val);
        }
      });
    }
    if (user_id.length > 0) data.user_id = user_id;
    if (user_slack_id.length > 0) data.user_slack_id = user_slack_id;

    const showMore = "true";

    this.props.getStandupHistory(this.props.match.params.wId, this.props.match.params.tId, data, showMore).then((res) => {
      if (res.data.success) {
        let tmp;
        res.data.responses.length == 0 && this.setState({ responseDataEmpty: true });

        tmp = this.props.standupHistory.responses.find((val) => val.status == "replied");
        tmp ? this.setState({ responseDataEmpty: false }) : this.setState({ responseDataEmpty: true });
        userTeamSync.standuptype == "planning_poker" && this.checkPlanningPokerRes();
        this.setState({ loading: false });
      }
      //to check for next page
      axios
        .get(`/api/${this.props.match.params.wId}/teamSync/${this.props.match.params.tId}/userResponses`, {
          params: {
            startAt: res.data.startAt + 100,
            startDate: data.startDate,
            endDate: data.endDate,
            user_id: data.user_id,
            user_slack_id: data.user_slack_id,
          },
        })
        .then((res) => {
          if (res.data.success && res.data.responses.length > 0) {
            this.setState({ showMore: true });
          }
        });
    });
  };

  handleSendEmail = () => {
    let data = {
      // startAt: this.props.standupHistory.startAt,
      startDate: new Date(new Date(this.state.defaultRangeValue[0]).setHours(0, 0, 0)),
      endDate: new Date(new Date(this.state.defaultRangeValue[1]).setHours(23, 59, 0)),
      user_id: this.state.selectedMembers,
      exactStartDate: this.state.defaultRangePickerValue[0].format("YYYY-M-D"),
      exactEndDate: this.state.defaultRangePickerValue[1].format("YYYY-M-D"),
    };

    this.props.sendReportEmail(this.props.match.params.wId, this.props.match.params.tId, data).then((res) => {});
    this.setState({ sendEmailModal: !this.state.sendEmailModal });
  };

  downloadCsv = () => {
    let data = {
      // startAt: this.props.standupHistory.startAt,
      startDate: new Date(new Date(this.state.defaultRangeValue[0]).setHours(0, 0, 0)),
      endDate: new Date(new Date(this.state.defaultRangeValue[1]).setHours(23, 59, 0)),
      user_id: this.state.selectedMembers,
    };
    this.props.getStandupCsvReport(this.props.match.params.wId, this.props.match.params.tId, data).then((res) => {
      this.download(res.data);
    });
  };

  download = (data) => {
    const { userTeamSync, standupHistory } = this.props;
    // let date = moment(this.props.projectTeamSyncInstance.created_at).format(
    //   "D  MMM"
    // );

    // let reportname = this.props.projectTeamSyncInstance.teamSync_metdata.name;
    // let fileName = `Troopr_${reportname}_${date}.csv`;

    // let betweenDates = [moment(this.state.defaultRangeValue[0]).format("D MMM"), moment(this.state.defaultRangeValue[1]).format("D MMM")];

    // let selectedMembersName = [];

    // this.state.selectedMembers.length > 0 &&
    //   this.state.selectedMembers.forEach((mem) => {
    //     let user = userTeamSync.selectedMembers.find((val) => val._id == mem);
    //     user.name && selectedMembersName.push(user.name);
    //   });

    // let fileName = `${userTeamSync.name} between ${betweenDates[0]} and ${betweenDates[1]} from ${
    //   selectedMembersName.length > 0
    //     ? selectedMembersName.map((name) => {
    //         return name;
    //       })
    //     : "all users"
    // }.csv`;

    let fileName = this.getFileName("history");

    const dataBlob = new Blob([data], { type: "text/csv" });
    const url = window.URL.createObjectURL(dataBlob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", fileName);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    this.setState({ downloadCsvModal: !this.state.downloadCsvModal });
  };

  getFileName = (type) => {
    const { userTeamSync } = this.props;
    const betweenDates = [moment(this.state.defaultRangeValue[0]).format("D MMM"), moment(this.state.defaultRangeValue[1]).format("D MMM")];
    let selectedMembersName = [];

    this.state.selectedMembers.length > 0 &&
      this.state.selectedMembers.forEach((mem) => {
        let user = userTeamSync.selectedMembers && userTeamSync.selectedMembers.find((val) => val._id == mem);
        user && user.name && selectedMembersName.push(user.name);
      });

    const fileName = `${userTeamSync.name} ${type} between ${betweenDates[0]} and ${betweenDates[1]} from ${
      selectedMembersName.length > 0
        ? selectedMembersName.map((name) => {
            return name;
          })
        : "all users"
    }.csv`;

    return fileName;
  };

  getSelectedMembersforName = () => {
    let selectedMembersName = [];

    this.state.selectedMembers.length > 0 &&
      this.state.selectedMembers.forEach((mem) => {
        let user = this.props.userTeamSync.selectedMembers.find((val) => val._id == mem);
        user.name && selectedMembersName.push(user.name);
      });

    return selectedMembersName;
  };
  getPopConfirmText = (type) => {
    const { userTeamSync, standupHistory } = this.props;

    let betweenDates = [moment(this.state.defaultRangeValue[0]).format("D MMM"), moment(this.state.defaultRangeValue[1]).format("D MMM")];

    let selectedMembersName = [];

    userTeamSync.selectedMembers &&
      this.state.selectedMembers.length > 0 &&
      this.state.selectedMembers.forEach((mem) => {
        let user = userTeamSync.selectedMembers.find((val) => val._id == mem);
        user && user.name ? selectedMembersName.push(user.name) : selectedMembersName.push("");
      });

    let title = `This will export responses ${type} for ${userTeamSync.name} between ${betweenDates[0]} and ${betweenDates[1]} from ${
      selectedMembersName.length > 0
        ? selectedMembersName.map((name) => {
            return name;
          })
        : "all users"
    } in CSV format`;

    return title;
  };

  getEmailText = () => {
    const { userTeamSync, standupHistory } = this.props;

    let betweenDates = [moment(this.state.defaultRangeValue[0]).format("D MMM"), moment(this.state.defaultRangeValue[1]).format("D MMM")];

    let selectedMembersName = [];

    userTeamSync.selectedMembers &&
      this.state.selectedMembers.length > 0 &&
      this.state.selectedMembers.forEach((mem) => {
        let user = userTeamSync.selectedMembers.find((val) => val._id == mem);
        user && user.name ? selectedMembersName.push(user.name) : selectedMembersName.push("");
      });

    let title = `This will send responses for ${userTeamSync.name} between ${betweenDates[0]} and ${betweenDates[1]} from ${
      selectedMembersName.length > 0
        ? selectedMembersName.map((name) => {
            return name;
          })
        : "all users"
    } in email`;

    return title;
  };

  getSelectedMemberName = () => {
    const { userTeamSync, standupHistory } = this.props;
    let selectedMembersName = [];

    this.state.selectedMembers.length > 0 &&
      this.state.selectedMembers.forEach((mem) => {
        let user = userTeamSync.selectedMembers.find((val) => val._id == mem);
        user.name && selectedMembersName.push(user.name);
      });

    return selectedMembersName;
  };

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

  thredAnswer(Answer, report,data) {
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
        ids = report;
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

  getSelectValue = () => {
    // this.props.match.params.history_user_id ?
    // (!this.state.userSelected
    //   ? [this.props.match.params.history_user_id]
    //   : this.state.selectedMembers)
    // :
    // (
    //   !this.state.userSelected
    // ? [this.props.match.params.history_user_slack_id]
    // : this.state.selectedMembers
    // )

    if (this.props.match.params.history_user_id && !this.state.userSelected) {
      return [this.props.match.params.history_user_id];
    } else if (this.props.match.params.history_user_slack_id && !this.state.userSelected) {
      return [this.props.match.params.history_user_slack_id];
    } else {
      return this.state.selectedMembers;
    }
  };

  downloadCsvModal = () => {
    this.setState({ downloadCsvModal: !this.state.downloadCsvModal });
  };
  insightsModalVisible = () => {
    this.setState({ insightsModalVisible: !this.state.insightsModalVisible });
  };

  sendEmailModal = () => {
    this.setState({ sendEmailModal: !this.state.sendEmailModal });
  };

  checkAnswer = (response, data) => {
    let tmp = 0;

    let ans = response.progress_report.filter((ans) => ans && ans.answer && ans.answer.plain_text && ans.answer.plain_text.length > 0);
    tmp = ans.length;
    if (tmp != 0) {
      return data.answer && data.answer.plain_text && data.answer.plain_text.length > 0 ? (
        <span
          dangerouslySetInnerHTML={{
            __html: this.thredAnswer(data.answer.plain_text, response.unfurl_medata.jiraIds,response),
          }}
        />
      ) : (
        <Text code>No Answer</Text>
      );
    } else {
      return <Text code>Skipped this report</Text>;
    }
  };

  getJiraIssueText = (str) => {
    try {
      if (str && str.length > 0) {
        // let eachIssueArr = str.split("\n\n");
        let eachIssueArr = str.split("\n\nUpdates in");
        let issueDataArr = [];
        eachIssueArr.forEach((issue) => {
          let arr = this.getSplitedData(issue);
          if(arr){
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
      console.error("error parsing jira avtivity string",error)
      return <Text code>Error parsing jira activity</Text>
    }
  };

  getIssueData = (str) => {
    // console.log("before ==>",`${str}`)
    let regexp = /\n\n/gi
    str = str.replace(regexp,"\r\r")
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
              if(assigneeUrlArr.length == 2){
                return (
                  <span>
                    <strong>
                      {"Assignee ==> "} {assigneeUrlArr[1]}
                    </strong>
                    <br />
                  </span>
                );
              }else if(assigneeUrlArr[0] == "nassigned "){
                //for unassigned
                return (
                  <span>
                    <strong>
                      {"Assignee ==> "} Unassigned
                    </strong>
                    <br />
                  </span>
                );
              }else return ''
            } else {
              if(data[2]){
                let regex = /\r\r/gi
                data[2] = data[2].replace(regex, "\n\n")
              }
            return (
                <span style={{whiteSpace: "pre-line"}}>
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
    // console.log(string);
    return { id: string[1][1], url: string[1][0] };
  };

  getSplitedData = (str) => {
    if(str.length > 0){

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

    str = str.substring(1)
    str = str.split(">:*")
    str[0] = str[0] + ">"
    str[1] = ":*" + str[1]
    return str;
  }
  };

  getTaskCheckInAnswer = (response) => {
    const { userTeamSync } = this.props;

    if (response.isHoliday) {
      return response.progress_report.length == 0 ? <Text code>User is on holiday</Text> : "";
    } else {
      if (response.isSkipped && response.metadata && response.metadata.jiraactivitytext == null) {
        return response.progress_report.length == 0 ? <Text code>Skipped this report</Text> : "";
      } else {
        return (response && response.metadata && response.metadata.jiraactivitytext) ? this.getJiraIssueText(response.metadata.jiraactivitytext) : /*fail safe*/ <Text code>No Update</Text>;
      }
    }
  };

  _isQuestionAvailableOnThisResponse = (response) => {
    const { selectedQuestions } = this.state;
    const { userTeamSync } = this.props;
    let showResponse = false;
    if (selectedQuestions.length > 0) {
      selectedQuestions.forEach((question) => {
        if (!response.isSkipped && !response.isHoliday) {
          let exactQuestionFound;
          if (userTeamSync.standuptype == "planning_poker") {
            exactQuestionFound = response.progress_report.find((data) => data.question.id == question.key);
          } else {
            exactQuestionFound = response.progress_report.find((data) => data.question.id == question.key && data.question.text == question.children);
          }
          if (exactQuestionFound) showResponse = true;
        }
      });
    } else {
      showResponse = true;
    }
    return showResponse;
  };

  getInsightsEngagementCsvData = () => {
    const { totalResponses, membersResponse, totalResponded, repliedResponsesCount, userMoodTotal, totalMoodResponses, userTeamSync } = this.props;
    const isPlannigPoker = userTeamSync.standuptype == "planning_poker" ? true : false;
    const index = isPlannigPoker ? 4 : 5;
    const jiraSkill = this.props.skills && this.props.skills.find((skill) => skill.name == "Jira");
    const activityCondition =
      (userTeamSync &&
        (userTeamSync.standuptype == "dailystandup" || userTeamSync.standuptype == "Daily Standup") &&
        jiraSkill &&
        jiraSkill.skill_metadata.linked &&
        userTeamSync.showActivity &&
        userTeamSync.showActivity.jira &&
        userTeamSync.showActivity.jira === "true") ||
      (userTeamSync.showActivity && userTeamSync.showActivity.jira && userTeamSync.showActivity.jira === true);
    const moodScoreCondition =
      userTeamSync &&
      (userTeamSync.standuptype == "dailystandup" || userTeamSync.standuptype == "Daily Standup") &&
      userTeamSync.moodquestion &&
      userTeamSync.moodquestion !== "None" &&
      userTeamSync.moodquestion !== "none";

    let csvData = [["Participant", "User Local Time", "Asked", "Responded", "Engagement"]];

    if (userTeamSync && !userTeamSync.isShared) {
      !isPlannigPoker && csvData[0].splice(4, 0, "Skipped");
      csvData[0].splice(index, 0, "Leave");
    }

    activityCondition && csvData[0].splice(6, 0, "Actvity");

    moodScoreCondition && csvData[0].splice(7, 0, "Mood Score");
    membersResponse &&
      membersResponse.forEach((mem) => {
        let data = [
          mem.user_id ? mem.user_id.name : mem.guestuserInfo && mem.guestuserInfo.name ? mem.guestuserInfo.name + ' (External)' : '',
          this.getTimeDate(mem.user_id ? mem.user_id.timezone : this.props.user_now.timeZone),
          mem.received,
          mem.responses,
          mem.participation == null ? "0%" : mem.participation + "%",
        ];

        if (userTeamSync && !userTeamSync.isShared) {
          !isPlannigPoker && data.splice(4, 0, mem.skippedReports);
          data.splice(index, 0, mem.isUserInHoliday);
        }

        activityCondition && data.splice(6, 0, mem.jiraActivity && mem.jiraActivity);
        moodScoreCondition &&
          data.splice(
            7,
            0,
            mem.usersTotalMoodResponses && mem.usersMoodTotal && mem.usersMoodTotal / mem.usersTotalMoodResponses != 0
              ? mem.usersMoodTotal / mem.usersTotalMoodResponses
              : "-"
          );

        csvData.push(data);
      });

    return csvData;
  };

  getTimeDate = (timezone) => {
    let date = new Date().toLocaleString("en-US", { timeZone: timezone });
    let options = { timeZoneName: "long", timeZone: timezone };
    let tz = new Date().toLocaleString("en-US", options).split(" ");
    let tzName = tz[3] + " " + tz[4] + " " + tz[5];
    return moment(date).format("ddd hh:mm A") + " " + this.getTzInitials(tzName);
  };

  getTzInitials(string) {
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

  getUserRespondedEmoji=(response)=>{
    const {userTeamSync} = this.props
    if(response && response.status=="replied" && response.usermood&&response.metadata&&response.metadata.emoji){
    return response.metadata.emoji
    }
    else if(response && response.status=="replied" && response.usermood){
      let emoji=userTeamSync.customEmoji&&userTeamSync.customEmoji.length!=0?(
          response.usermood && response.usermood == 1
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
        ):(
          response.usermood && response.usermood == 1
          ? "🤩"
          : response.usermood == 2
          ? "🙂"
          : response.usermood == 3
          ? "😐"
          : response.usermood == 4
          ? "🥵"
          : response.usermood == 5
          ? "🙁"
          : ""
          
        )
      return emoji
    }
    return ""
  }
  getEmojiText=(response)=>{
    const {userTeamSync} = this.props
    if(response && response.status=="replied" && response.usermood&&response.metadata&&response.metadata.emojiText){
      return " feeling "+response.metadata.emojiText
    }
    else if(response && response.status=="replied" && response.usermood){
      let emojiText=userTeamSync.customEmoji&&userTeamSync.customEmoji.length!=0?(
        response.usermood && response.usermood == 1
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
        ):(
          response.usermood && response.usermood == 1
          ? "excellent"
          : response.usermood == 2
          ? "good"
          : response.usermood == 3
          ? "average"
          : response.usermood == 4
          ? "exhausted"
          : response.usermood == 5
          ? "bad"
          : ""
          
        )
          return " feeling "+emojiText
      }
    return ""
  }
  getUserComment= (response,question) =>{
    if(response && response.status==="replied"){
      let report = response.progress_report.find(report=>report.question.id==question._id)
      if(report && report.answer && report.answer.plain_text){
        return report.answer.plain_text
      }
    }
  }

  render() {
    const { userTeamSync, standupHistory } = this.props;
    const { instanceResponses, selectedQuestions, loading } = this.state;
const isAnonymous=userTeamSync&&userTeamSync.send_anonymous
    return (
      <Fragment>
        <PageHeader
          style={{
            width: "100%",
          }}
          className='site-page-header-responsive'
          title={
            <Fragment>
              {/* <LegacyIcon className='trigger' type={this.props.iconState ? "menu-unfold" : "menu-fold"} onClick={this.props.collapsed} /> */}
              <span>
                {/* {this.props.userTeamSync.name ? (
                  <span >
                    {this.props.userTeamSync.name && this.props.userTeamSync.name.length > 39 ? (
                      <Tooltip title={this.props.userTeamSync.name}>{this.props.userTeamSync.name.substring(0, 40) + "... "}</Tooltip>
                    ) : (
                      this.props.userTeamSync.name + " "
                    )}
                    Insights
                  </span>
                ) : (
                  ""
                )} */}
                Insights
              </span>
            </Fragment>
          }
          // tags={this.props.userTeamSync.createInstance ? <Tag color='green'>Active</Tag> : <Tag color='orange'>Paused</Tag>}
          extra={
            <div>
              {/* {this.props.standupHistory &&
                this.state.allMembers.length > 0 && (
                  <Pdf
                    History={this.props.standupHistory}
                    allMembers={this.state.allMembers}
                  />
                )} */}

              {this.props.userTeamSync&&this.props.userTeamSync.standuptype==="team_mood_standup"&& this.props.userTeamSync.send_anonymous?(<></>):
              (this.props.userTeamSync&&!this.props.userTeamSync.send_anonymous && this.props.userTeamSync.selectedMembers && (
                <Select
                  value={this.getSelectValue()}
                  style={{ width: 200, marginRight: "10px" }}
                  mode='multiple'
                  placeholder='Select members'
                  onChange={this.handleUserChange}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  allowClear
                >
                  {userTeamSync.selectedMembers &&
                    // !this.state.loading &&
                    this.state.allMembers.map((mem) => (
                      <Option
                        key={mem.user_id && mem.user_id._id ? mem.user_id._id : mem._id ? mem._id : mem.user_slack_id}
                        value={mem.user_id && mem.user_id._id ? mem.user_id._id : mem._id ? mem._id : mem.user_slack_id}
                        label={mem.user_id && mem.user_id._id ? mem.user_id._id : mem._id ? mem._id : mem.user_slack_id}
                      >
                        {mem.name ? mem.name : mem.user_id.name}
                      </Option>
                    ))}
                </Select>
              ))}
              <Select
                defaultValue="last30days"
                style={{ width: 200, marginRight: "10px" }}
                onChange={this.handleTimeRangeChange}
              >
                <Option value="today">Today</Option>
                <Option value="yesterday">Yesterday</Option>
                <Option value="last7days">Last 7 Days</Option>
                <Option value="last14days">Last 14 Days</Option>
                <Option value="last30days">Last 30 Days</Option>
                <Option value="thisMonth">This Month</Option>
                <Option value="lastMonth">Last Month</Option>
                <Option value="customRange">Custom Range</Option>
              </Select>
              {this.state.showRangePicker&&<RangePicker
                value={this.state.defaultRangePickerValue}
                /* disabledDate ={this.disabledDate}*/
                onChange={this.rangeChange}
                allowClear={false}
                // style={{ width: 200 }}
                style={{marginRight:"10px"}}
              />}

              {userTeamSync&&userTeamSync.standuptype==="team_mood_standup"&& userTeamSync.send_anonymous?(<></>):
              (userTeamSync&&userTeamSync.multiple_question && userTeamSync.multiple_question.length > 0 && (
                <Select
                  style={{ width: 200, marginRight: "10px" }}
                  loading={userTeamSync._id ? false : true}
                  placeholder='Select a question'
                  onChange={(value, e) => this.onQuestionChanges(value, e)}
                  mode='multiple'
                  allowClear
                >
                  {userTeamSync._id &&
                    userTeamSync.multiple_question &&
                    userTeamSync.multiple_question.map((question) => {
                      return (
                        <Option key={question._id} value={question._id}>
                          {userTeamSync.standuptype === "planning_poker" ? question.meta.key : question.question_text}
                        </Option>
                      );
                    })}
                </Select>
              ))}

              {this.props.standupHistory &&
                this.state.allMembers.length > 0 &&
                userTeamSync &&
                (userTeamSync.standuptype == "dailystandup" ||
                  userTeamSync.standuptype == "Daily Standup" ||
                  userTeamSync.standuptype == "retrospective") && (
                  !isAnonymous &&
                  <Dropdown
                    onClick={(e) => e.preventDefault()}
                    overlay={
                      <Menu>
                        <Menu.Item key='csv' onClick={this.downloadCsvModal}>
                          Export as CSV
                        </Menu.Item>
                      {/* !isAnonymous&& */<Menu.Item key='csv-engagement' onClick={this.insightsModalVisible}>
                          Export Engagement as CSV
                        </Menu.Item>
                    }
                        {/* !isAnonymous&& */<Menu.Item key='email' onClick={this.sendEmailModal}>
                          Send as Email
                        </Menu.Item>}
                      </Menu>
                    }
                  >
                    <Button 
                    //style={{ marginLeft: "10px" }}
                    >
                      <EllipsisOutlined key='ellipsis' />
                    </Button>
                  </Dropdown>
                )}

              {/* {this.props.standupHistory && (
                <Pdf
                  standupHistory={this.props.standupHistory}
                  betweenDates={this.state.defaultRangePickerValue}
                  selectedMembersName={this.getSelectedMemberName()}
                />
              )} */}
            </div>
          }
        />
        <Content
          style={{
            // paddingLeft: "24px",
            // paddingTop: "32px",
            // paddingBottom:32,
            padding: "16px 16px 32px 24px",
            height:'75vh',
            overflow:'auto'
          }}
        >
          {/* checking this condition to avoid "RangeError: Invalid time value" in errors */}
          {this.state.defaultRangeValue.length > 0 &&
            <Engagement
            selectedUsers={this.state.selectedMembers}
            startDate={new Date(new Date(this.state.defaultRangeValue[0]).setHours(0, 0, 0))}
            endDate={new Date(new Date(this.state.defaultRangeValue[1]).setHours(23, 59, 0))}
            standupHistory={this.props.standupHistory}
          />}
          <div
            style={{
              // backgroundColor: "#FAFAFA",
              //   paddingLeft: "24px",
              paddingRight: "20px",
              paddingTop: "32px",
            }}
          >
            {/*Changes for team mood insights */}
            {userTeamSync.standuptype==="team_mood_standup"&&!this.state.loading && 
              standupHistory && !this.state.responseDataEmpty && (
                <>
                <Title level={3}>Participant Responses</Title>
                <Row gutter={[16, 16]}>
              <Col span={24}>
              <Row gutter={[16, 16]}>
                { standupHistory.responses.map(response=>{
                  return !response.isHoliday && !response.isSkipped && (
                    <Col span={12}>
                  <Card>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        // alignItems: "center",
                        wordBreak: "break-word"
                        // maxWidth: 250
                      }}
                    >
                      {userTeamSync && !userTeamSync.send_anonymous && (
                      <Avatar
                        style={{ minWidth: 32 }}
                        src={this.props.userTeamSync && response && response.user_id && this.getProfilePicUrl(response.user_id)}  
                        //icon={<UserOutlined />}
                      >
                       {response && response.user_id && this.getAvatarInitials(response)} 
                      </Avatar>
                      )}
                      <span style={{ marginLeft: 10 }}>
                        <div>
                        {userTeamSync && userTeamSync.send_anonymous? <Text>{this.getUserRespondedEmoji(response)+this.getEmojiText(response)}</Text>
                        :<Text>{this.findUser(response) + " " + this.getUserRespondedEmoji(response)+this.getEmojiText(response)}</Text>}
                        </div>
                        <span
                          style={{
                            fontWeight: "normal",
                            fontSize: "14px",
                            color:
                              localStorage.getItem("theme") == "dark" ? "rgba(255, 255, 255, 0.45)" : "rgba(0, 0, 0, 0.45)",
                          }}
                        >
                          {moment(response.responded_at).format("dddd DD MMM YYYY hh:mm A")}
                        </span>
                       <br/>
                        {userTeamSync.multiple_question.map(question=>{
                          return (
                          <div>
                          <Text type="secondary">{this.getUserComment(response,question)}
                          </Text>
                        </div>
                          )
                        })}
                        {/*
                        <div style={{ marginTop: 8 }}>
                          <Popover content="Like">
                            <Button
                              style={{ marginRight: 4 }}
                              icon={<LikeOutlined />}
                              size="small"
                            >
                              {" "}
                              5{" "}
                            </Button>
                          </Popover>
                          <Popover content="Comment">
                            <Button
                              style={{ marginRight: 4 }}
                              icon={<MessageOutlined />}
                              size="small"
                            >
                              {" "}
                              5{" "}
                            </Button>
                          </Popover>
                        </div>
                        */}
                      </span>
                    </div>
                  </Card>
                </Col>
                  )
                })}
                
                </Row>
                </Col>
                </Row>
                </>
              )
            }

            {/*Changes over for team mood insights*/}
            {userTeamSync.standuptype!=="team_mood_standup"&&(
              <>
            {!this.state.loading ? (
              standupHistory && !this.state.responseDataEmpty ? (
                <>
                  <Row gutter={32}>
                    {standupHistory &&
                      standupHistory.responses.map((response) => {
                        return this._isQuestionAvailableOnThisResponse(response)
                          ? response.status != "asked" && (userTeamSync.standuptype == "planning_poker" ? !response.isHoliday : true) && (
                              <Col span={12}>
                                <Row gutter={[32, 32]}>
                                  <Col span={24}>
                                    <Card>
                                      <Card.Meta
                                        title={
                                          <Row gutter={10}>
                                           {isAnonymous!==true&&  <Col style={{ marginTop: "5px" }}>
                                              <div className='standup_history_badge'>
                                            <Avatar
                                                  style={{ marginTop: "5px" }}
                                                  src={
                                                    this.props.userTeamSync &&
                                                    this.props.userTeamSync.selectedMembers &&
                                                    this.getProfilePicUrl(response.user_id)
                                                  }
                                                >
                                                  {this.props.members && this.state.membersReady && this.getAvatarInitials(response)}
                                                </Avatar>
                    
                                                {/* </Badge> */}
                                              </div>
                                            </Col>
                                        }
                                            <Col>
                                              {!isAnonymous && this.props.members && this.state.membersReady && this.findUser(response)}{" "}
                                              {/*response.usermood == 1
                                                ? "🤩"
                                                : response.usermood == 2
                                                ? "🙂"
                                                : response.usermood == 3
                                                ? "😐"
                                                : response.usermood == 4
                                                ? "🥵"
                                                : response.usermood == 5
                                                ? "🙁"
                                              : ""*/}
                                              {userTeamSync.customEmoji&&userTeamSync.customEmoji.length!=0?(
                                                response.usermood == 1
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
                                              ):(
                                                response.usermood == 1
                                                ? "🤩"
                                                : response.usermood == 2
                                                ? "🙂"
                                                : response.usermood == 3
                                                ? "😐"
                                                : response.usermood == 4
                                                ? "🥵"
                                                : response.usermood == 5
                                                ? "🙁"
                                              : ""
                                                
                                              )}
                                            {isAnonymous?"":<br />}
                                              <span
                                                style={{
                                                  fontWeight: "normal",
                                                  fontSize: "14px",
                                                  color:
                                                    localStorage.getItem("theme") == "dark" ? "rgba(255, 255, 255, 0.45)" : "rgba(0, 0, 0, 0.45)",
                                                }}
                                              >
                                                {isAnonymous?`Team Member response on ${moment(response.responded_at).format("dddd DD MMM YYYY hh:mm A")}`:moment(response.responded_at).format("dddd DD MMM YYYY hh:mm A")}
                                              </span>
                                            </Col>
                                          </Row>
                                        }
                                      />
                                      <span>
                                        <br />
                                        {!response.isSkipped && !response.isHoliday ? (
                                          <span>
                                            {response.progress_report.map((data) => {
                                              if (selectedQuestions.length > 0) {
                                                return selectedQuestions.map((question) => {
                                                  if (data.question.id == question.key) {
                                                    return (
                                                      <span>
                                                        <span
                                                          style={{
                                                            wordBreak: "break-word",
                                                            fontWeight: "bold",
                                                          }}
                                                        >
                                                          {userTeamSync.standuptype == "planning_poker" ? (
                                                            <span>
                                                              <a
                                                                style={{
                                                                  fontWeight: "normal",
                                                                }}
                                                                href={data.question.meta && data.question.meta.url}
                                                                target='_blank'
                                                              >
                                                                {data.question.meta && data.question.meta.key}
                                                              </a>
                                                              :{data.question.text}
                                                            </span>
                                                          ) : (
                                                            data.question.text
                                                          )}
                                                        </span>
                                                        <br />
                                                        <span
                                                          style={{
                                                            wordBreak: "break-word",
                                                            whiteSpace: "pre-line",
                                                          }}
                                                        >
                                                          {response.isSkipped ? (
                                                            this.checkAnswer(response, data)
                                                          ) : data.answer && data.answer.plain_text && data.answer.plain_text.length > 0 ? (
                                                            // data.answer.plain_text
                                                            <span
                                                              dangerouslySetInnerHTML={{
                                                                __html: this.thredAnswer(data.answer.plain_text, response.unfurl_medata.jiraIds,response),
                                                              }}
                                                            />
                                                          ) : response.isHoliday ? (
                                                            userTeamSync.standuptype == "planning_poker" ? (
                                                              <Text code>No Answer</Text>
                                                            ) : (
                                                              <Text code>User is on holiday</Text>
                                                            )
                                                          ) : (
                                                            <Text code>No Answer</Text>
                                                          )}
                                                        </span>
                                                        <br />
                                                      </span>
                                                    );
                                                  }
                                                });
                                              } else {
                                                return (
                                                  <span>
                                                    <span
                                                      style={{
                                                        wordBreak: "break-word",
                                                        fontWeight: "bold",
                                                      }}
                                                    >
                                                      {userTeamSync.standuptype == "planning_poker" ? (
                                                        <span>
                                                          <a
                                                            style={{
                                                              fontWeight: "normal",
                                                            }}
                                                            href={data.question.meta && data.question.meta.url}
                                                            target='_blank'
                                                          >
                                                            {data.question.meta && data.question.meta.key}
                                                          </a>
                                                          :{data.question.text}
                                                        </span>
                                                      ) : (
                                                        data.question.text
                                                      )}
                                                    </span>
                                                    <br />
                                                    <span
                                                      style={{
                                                        wordBreak: "break-word",
                                                        whiteSpace: "pre-line",
                                                      }}
                                                    >
                                                      {response.isSkipped ? (
                                                        this.checkAnswer(response, data)
                                                      ) : data.answer && data.answer.plain_text && data.answer.plain_text.length > 0 ? (
                                                        // data.answer.plain_text
                                                        <span
                                                          dangerouslySetInnerHTML={{
                                                            __html: this.thredAnswer(data.answer.plain_text, response.unfurl_medata && response.unfurl_medata.jiraIds,response),
                                                          }}
                                                        />
                                                      ) : response.isHoliday ? (
                                                        userTeamSync.standuptype == "planning_poker" ? (
                                                          <Text code>No Answer</Text>
                                                        ) : (
                                                          <Text code>User is on holiday</Text>
                                                        )
                                                      ) : (
                                                        <Text code>No Answer</Text>
                                                      )}
                                                    </span>
                                                    <br />
                                                  </span>
                                                );
                                              }
                                            })}
                                            {userTeamSync.standuptype == "jiraissuestandup" && this.getTaskCheckInAnswer(response)}
                                          </span>
                                        ) : response.isSkipped ? (
                                          <Text code>Skipped this report</Text>
                                        ) : (
                                          <Text code>User is on holiday</Text>
                                        )}
                                      </span>
                                    </Card>
                                  </Col>
                                </Row>
                              </Col>
                            )
                          : "";
                      })}
                  </Row>
                  {this.state.showMore && (
                    <Button onClick={this.showMore} style={{ marginBottom: "20px", float: "right" }}>
                      Show More
                    </Button>
                  )}
                </>
              ) : (
                // "here"
                <div>
                  <Result status='404' title='No data found' />
                  {this.state.showMore && (
                    <Button onClick={this.showMore} style={{ marginBottom: "20px", float: "right" }}>
                      Show More
                    </Button>
                  )}
                </div>
              )
            ) : (
              <Spin style={{ marginLeft: "50%" }} />
            )}
            </>
            )}
          </div>
        </Content>
        <div>
          <Modal
            className='sidebar_dropdown'
            // title="Confirm Task Archival"
            visible={this.state.downloadCsvModal}
            onOk={this.downloadCsv}
            onCancel={this.downloadCsvModal}
            okText='Export'
            bodyStyle={{ width: "97%" }}
          >
            {this.getPopConfirmText("history")}
          </Modal>
          <Modal
            className='sidebar_dropdown'
            // title="Confirm Task Archival"
            visible={this.state.insightsModalVisible}
            onCancel={this.insightsModalVisible}
            okText={
              <CSVLink filename={this.getFileName("engagement")} data={this.getInsightsEngagementCsvData()} onClick={this.insightsModalVisible}>
                Export
              </CSVLink>
            }
            bodyStyle={{ width: "97%" }}
          >
            {this.getPopConfirmText("engagement")}
          </Modal>
          <Modal
            className='sidebar_dropdown'
            // title="Confirm Task Archival"
            visible={this.state.sendEmailModal}
            onOk={this.handleSendEmail}
            onCancel={this.sendEmailModal}
            okText='Yes'
            bodyStyle={{ width: "97%" }}
          >
            {this.getEmailText()}
          </Modal>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  userTeamSync: state.skills.userTeamSync,
  teamSync: state.skills.currentteamsync,
  user_now: state.common_reducer.user,
  standupHistory: state.skills.standupHistory,
  members: state.skills.members,
  skills: state.skills.skills,
  //for engagement csv
  totalResponses: state.skills.totalResponses,
  membersResponse: state.skills.membersResponse,
  totalResponded: state.skills.totalResponded,
  repliedResponsesCount: state.skills.repliedResponsesCount,
  userMoodTotal: state.skills.userMoodTotal,
  totalMoodResponses: state.skills.totalMoodResponses,
});
export default withRouter(
  connect(mapStateToProps, {
    getStandupHistory,
    getStandupCsvReport,
    sendReportEmail,
  })(Insights)
);
