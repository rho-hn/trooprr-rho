import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Card, Typography, Row, Col, Table, Tooltip, PageHeader, Statistic, Avatar, Tag, Layout } from "antd";
import {

  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  Legend,
  AreaChart,
  BarChart,
  Bar,
  Area,
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell
} from "recharts";

import { getTeamSyncAnalytics } from "../skills_action";
import moment from "moment";


const { Text } = Typography;

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#402E96", "#FF8042"];

class InsightsEngagement extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  componentDidMount() {
    this.setState({ loading: true });
    const data = {
      selectedMembers: this.props.match.params.history_user_id ? [this.props.match.params.history_user_id]: this.props.match.params.history_user_slack_id ? [this.props.match.params.history_user_slack_id] : [],
      startDate: this.props.startDate,
      endDate: this.props.endDate,
    };
    this.props.getTeamSyncAnalytics(this.props.match.params.tId, data).then(() => this.setState({ loading: false }));
  }

  componentDidUpdate(prevProps) {
    const { selectedUsers, startDate, endDate } = this.props;
    if (
      prevProps.selectedUsers !== selectedUsers ||
      String(prevProps.startDate) != String(startDate) ||
      String(prevProps.endDate) != String(endDate)
    ) {
      this.setState({ loading: true });
      let data = {
        selectedMembers: selectedUsers,
        startDate: startDate,
        endDate: endDate,
      };
      this.props.getTeamSyncAnalytics(this.props.match.params.tId, data).then(() => this.setState({ loading: false }));
    }
  }

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
    //   .slice(0, 3);

    if (string) {
      let nameArr = string
        .trim()
        .replace(/\s+/g, " ") //remove extra spaces
        .split(" ");

      if (nameArr.length > 1) return (nameArr[0][0] + nameArr[1][0]).toUpperCase();
      else return nameArr[0].slice(0, 2).toUpperCase();
    } else return "";
  }

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

  getTimeDate = (timezone) => {
    let date = new Date().toLocaleString("en-US", { timeZone: timezone });
    let options = { timeZoneName: "long", timeZone: timezone };
    let tz = new Date().toLocaleString("en-US", options).split(" ");
    let tzName = tz[3] + " " + tz[4] + " " + tz[5];
    return moment(date).format("ddd hh:mm A") + " " + this.getTzInitials(tzName);
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

  CustomTooltip = ({ active, payload, label }) => {
    const {totalMoodResponses,userTeamSync,responsesGroupedByTeamMoodScore } = this.props
    if (active) {
      //console.info("payload",payload)
      let scorePercent=(100*(payload[0].payload.totalMoodResponses/totalMoodResponses)).toFixed(0);
      let moodScore=payload[0].payload.score.split(" ")[1]
      let emoji = userTeamSync.customEmoji && userTeamSync.customEmoji.length>0?
                  (moodScore =="5"?userTeamSync.customEmoji[0].emoji
                  :moodScore=="4"? userTeamSync.customEmoji[1].emoji
                  :moodScore=="3"? userTeamSync.customEmoji[2].emoji
                  :moodScore=="2"? userTeamSync.customEmoji[3].emoji
                  :moodScore=="1"? userTeamSync.customEmoji[4].emoji
                  :""
                  ):(
                     moodScore == "5" ? "🤩"
                    :moodScore == "4" ? "🙂"
                    :moodScore == "3" ? "😐"
                    :moodScore == "2" ? "🥵"
                    :moodScore == "1" ? "🙁"
                    :""
                  )


        return (
            <div  style={{ backgroundColor: '#ffff', padding: '5px', border: '1px solid #cccc' }}>
                <label>{`${emoji} : ${scorePercent}%`}</label>
            </div>
        );
    }

    return null;
};
CustomTooltipAreaChart = ({ active, payload, label }) => {
  if (active) {
    //console.info(payload)
    //let url="/605311f1993f062b434c7fbe/teamsync/605b08542444a133ce11aee2/instance/606a0cb0da4d366f14fed111"
    let wId=this.props.match.params.wId
    let tId=this.props.match.params.tId
    let instance=payload[0].payload.question_instance_id[0]
    let url=`/${wId}/teamsync/${tId}/instance/${instance}`
    //console.info("wId",wId)
    //console.info("tId",tId)
    //console.info("instance",instance)
      return (
          <div style={{ backgroundColor: '#ffff', padding: '5px', border: '1px solid #cccc' }}>
            {/*
              <label>{payload[0].payload.name}</label><br/>
              <label>{`${payload[0].name} : ${payload[0].payload.mood}%`}</label>
            */}
              <a href={url} target='_blank'>Report</a>
          </div>
      );
  }

  return null;
};
goToReport=()=>{
  this.props.history.push(`/605311f1993f062b434c7fbe/teamsync/605b08542444a133ce11aee2/instance/606a0cb0da4d366f14fed111`)
}
isMoreThanOneScoreAvailable = ()=>{
  let count=0
  const {responsesGroupedByTeamMoodScore} = this.props
  for(var key in responsesGroupedByTeamMoodScore){
    if(responsesGroupedByTeamMoodScore[key].totalMoodResponses!=0)
    {
      count++;
    }
  }
  return count
}



    pieData = [
        {
            "name": "Score 5",
            "value": 68.85
        },
        {
            "name": "Score 4",
            "value": 7.91
        },
        {
            "name": "Score 3",
            "value": 6.85
        },
        {
            "name": "Score 2",
            "value": 6.14
        },
        {
            "name": "Score 1",
            "value": 10.25
        }
    ];
  render() {
    
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var mood = [5,4,3,2,1]

    /*
    function groupBy(objectArray, property) {
      return objectArray.reduce((acc, obj) => {
         const key = obj[property].slice(0,10);
         if (!acc[key]) {
            acc[key] = {
                        teamMood:0,
                        totalResponses:0,
                        name:months[key.split('-')[1]-1] + " " + key.split('-')[2]
                      };
         }
         // Add object to list for given key's value
         if(obj.usermood){
         acc[key].teamMood = acc[key].teamMood + mood[obj.usermood-1] ;
         acc[key].totalResponses = acc[key].totalResponses + 1;
         }
         return acc;
      }, {});
   }
   */
   const { totalResponded, repliedResponsesCount, totalResponses, membersResponse, userMoodTotal, totalMoodResponses, userTeamSync, standupHistory, startDate, endDate, participation,moodChart,responsesGroupedByTeamMoodScore} = this.props;
   if(userTeamSync.standuptype=="team_mood_standup"){
     if(userTeamSync.customEmoji && userTeamSync.customEmoji.length>0){
       for(var key in responsesGroupedByTeamMoodScore){
        responsesGroupedByTeamMoodScore[key].name=userTeamSync.customEmoji[key].text
       }
       /*
        responsesGroupedByTeamMoodScore[0].moodText=userTeamSync.customEmoji[0].text
        responsesGroupedByTeamMoodScore[1].moodText=userTeamSync.customEmoji[1].text
        responsesGroupedByTeamMoodScore[2].moodText=userTeamSync.customEmoji[2].text
        responsesGroupedByTeamMoodScore[3].moodText=userTeamSync.customEmoji[3].text
        responsesGroupedByTeamMoodScore[4].moodText=userTeamSync.customEmoji[4].text
        */
     }
     else{
      let text = ["Rad","Good","Meh","Exhausted","Awful"]
      for(var key in responsesGroupedByTeamMoodScore){
        responsesGroupedByTeamMoodScore[key].name=text[key]
       }
       /*
      responsesGroupedByTeamMoodScore[0].moodText="Rad"
      responsesGroupedByTeamMoodScore[1].moodText="Good"
      responsesGroupedByTeamMoodScore[2].moodText="Meh"
      responsesGroupedByTeamMoodScore[3].moodText="Exhausted"
      responsesGroupedByTeamMoodScore[4].moodText="Awful"
      */
     }
   } 
   function groupBy(objectArray, property) {
    return objectArray.reduce((acc, obj) => {
      const created_at = new Date(Date.parse(obj[property]))
      if(created_at>=startDate && created_at<=endDate){
        const dateDefault = new Date(Date.parse(obj[property]));
        //converting in MM/DD/YYYY format
        const key = dateDefault.getMonth()+'/'+dateDefault.getDate()+'/'+dateDefault.getFullYear()
       if (!acc[key]) {
          acc[key] = {
                      teamMood:0,
                      totalMoodResponses:0,
                      question_instance_id:[],
                      totalResponded:0,
                      name:months[key.split('/')[0]] + " " + key.split('/')[1]
                    };
       }
       // Add object to list for given key's value
       if(obj&&obj.usermood){
       acc[key].teamMood = acc[key].teamMood + mood[obj.usermood-1] ;
       acc[key].totalMoodResponses = acc[key].totalMoodResponses + 1;
       }
       //console.log(obj.question_instance_id)
      if(!acc[key].question_instance_id.includes(obj.question_instance_id)){
        acc[key].question_instance_id.push(obj.question_instance_id)
       }
       acc[key].totalResponded = acc[key].totalResponded + 1;
       return acc;
      }
      else{
        return acc;
      }  
    }, {});
 }
 
    const participation_grouped_by_date = {}
    const moodChart_grouped_by_date = {}
    for (var key in participation) {
      let date = moment(participation[key].created_at).format('DD-MMM-YYYY')
      let split_date = date.split('-')
      if (date in participation_grouped_by_date) {
        participation_grouped_by_date[date].totalResponses = participation_grouped_by_date[date].totalResponses + participation[key].totalResponses
        participation_grouped_by_date[date].totalResponded = participation_grouped_by_date[date].totalResponded + participation[key].totalResponded
      }
      else {
        participation_grouped_by_date[date] = participation[key]
        participation_grouped_by_date[date].name = split_date[1] + " " + split_date[0]

      }
    }
    for (var key in moodChart) {
      let date = moment(moodChart[key].created_at).format('DD-MMM-YYYY')
      let split_date = date.split('-')
      if (date in moodChart_grouped_by_date) {
        moodChart_grouped_by_date[date].totalMoodResponses = moodChart_grouped_by_date[date].totalMoodResponses + moodChart[key].totalMoodResponses
        moodChart_grouped_by_date[date].teamMood = moodChart_grouped_by_date[date].teamMood + moodChart[key].teamMood
        moodChart_grouped_by_date[date].question_instance_id.push(key)
      }
      else {
        moodChart_grouped_by_date[date] = moodChart[key]
        moodChart_grouped_by_date[date].name = split_date[1] + " " + split_date[0]
        moodChart_grouped_by_date[date].question_instance_id=[key]
      }
    }
    const rechart_participation2 = []
    const rechart_mood2 = []
    const best_day={moodScore:0,date:null}
    const worst_day={moodScore:5,date:null}
    for (var key in participation_grouped_by_date) {
      rechart_participation2.push({ name: participation_grouped_by_date[key].name, participation: (100 * (participation_grouped_by_date[key].totalResponded / participation_grouped_by_date[key].totalResponses)).toFixed(0) })
    }
    for (var key in moodChart_grouped_by_date) {
      if (moodChart_grouped_by_date[key].totalMoodResponses) {
        let moodScore=(moodChart_grouped_by_date[key].teamMood / moodChart_grouped_by_date[key].totalMoodResponses).toFixed(1) 
        rechart_mood2.push({ name: moodChart_grouped_by_date[key].name, mood: (moodChart_grouped_by_date[key].teamMood / moodChart_grouped_by_date[key].totalMoodResponses).toFixed(1), question_instance_id:moodChart_grouped_by_date[key].question_instance_id })
        if(moodScore>=best_day.moodScore){
          best_day.moodScore=moodScore
          best_day.date=key
        }
        if(moodScore<=worst_day.moodScore){
          worst_day.moodScore=moodScore
          worst_day.date=key
        }
      }
    }

 /*
  const rechart_data_mood = []
   const rechart_data_participation = []
  //if(this.props.standupHistory && this.props.standupHistory.responses && this.props.userTeamSync.moodquestion && this.props.userTeamSync.moodquestion !== "none"){
    if(this.props.standupHistory && this.props.standupHistory.responses){
    const groupedData = groupBy(this.props.standupHistory.responses, 'created_at');
    //console.log("Group Data : ",groupedData)
    
    for (var key in groupedData) {
      //console.log("Key",key)
      if(groupedData[key].totalMoodResponses){
        rechart_data_mood.push({name:groupedData[key].name,mood:(((groupedData[key].teamMood/groupedData[key].totalMoodResponses))).toFixed(1)})
      }
      let totalParticipants = this.props.userTeamSync&&this.props.userTeamSync.selectedMembers&&this.props.userTeamSync.selectedMembers.length?this.props.userTeamSync.selectedMembers.length*groupedData[key].question_instance_id.length:0;
      rechart_data_participation.push({name:groupedData[key].name, participation:(100*(groupedData[key].totalResponded/totalParticipants)).toFixed(0)})
    
    }
      //console.log("Report Chart Participation " ,rechart_data_participation)
    //console.log("Report Chart Mood " ,rechart_data_mood)
   }
   */
  //  const rechart_participation=[]
  //  const rechart_mood=[]
  //  for(var key in participation){
  //   rechart_participation.push({name:participation[key].name, participation:(100*(participation[key].totalResponded/participation[key].totalResponses)).toFixed(0)})
  //  }
  //  for(var key in moodChart){
  //   if(moodChart[key].totalMoodResponses){
  //     rechart_mood.push({name:moodChart[key].name, mood:(moodChart[key].teamMood/moodChart[key].totalMoodResponses).toFixed(1)})
  //   }
  // }
  //console.info("rechart_mood",rechart_mood)
  //console.info("rechart_participation:",rechart_participation)
   
   
    
    const { loading } = this.state;
    const jiraSkill = this.props.skills && this.props.skills.find((skill) => skill.name == "Jira");
    const span = userTeamSync && (userTeamSync.standuptype == "dailystandup" || userTeamSync.standuptype == "Daily Standup") ? 22 : 20;
    const standup_engagement_column = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        render: (response, data) => (
          <div
            // style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
            style={{ wordBreak: "break-word",maxWidth:'250px' }}
          >
            {data && data.user_id && (data.user_id.displayName || data.user_id.name) ? (
              <span
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <span>
                  <Avatar src={this.getProfilePicUrl(data.user_id._id)}>{this.getInitials(data.user_id.displayName || data.user_id.name)}</Avatar>
                </span>
                <span style={{ marginLeft: "10px" }}>
                  <Text strong>{data.user_id.displayName || data.user_id.name}</Text>
                  <br />
                  <Text type='secondary'>{data.user_id.emails[0]}</Text>
                </span>
              </span>
            ) : (
              <span
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <span>
                  <Avatar>{this.getInitials(data.guestuserInfo.name)}</Avatar>
                </span>
                <span style={{ marginLeft: "10px" }}>
                  <Text strong>{data.guestuserInfo.name} (External)</Text>
                  {/* <br /> */}
                  {/* <Text type='secondary'>{data.user_id.emails[0]}</Text> */}
                </span>
              </span>
            )}
          </div>
        ),
      },
      {
        title: "User Local Time",
        // dataIndex: "timezone",
        // key: "timezone"
        render: (response, data) => {
          // return <div>{data.user_id.timezone}</div>
          return <div>{this.getTimeDate(data.user_id ? data.user_id.timezone : this.props.user_now.timeZone)}</div>;
        },
      },
      {
        title: "Asked",
        // dataIndex: "received",
        // key: "received"
        render: (response, data) => {
          return <div>{data.received}</div>;
        },
      },
      {
        title: "Responded",
        // dataIndex: "responses",
        // key: "responses"
        render: (response, data) => {
          return <div>{data.responses}</div>;
        },
      },
      {
        title: "Engagement",
        // dataIndex: "engagement",
        // key: "engagement"
        render: (response, data) => {
          return <div>{data.participation == null ? "0%" : data.participation + "%"}</div>;
        },
      },
    ];

    // old logic
    // this.props.userTeamSync &&
    //   !this.props.userTeamSync.isShared &&
    //   standup_engagement_column.splice(
    //     4,
    //     0,
    //     {
    //       title: "Skipped",
    //       // dataIndex: "responses",
    //       // key: "responses"
    //       render: (response, data) => {
    //         return <div>{data.skippedReports}</div>;
    //       },
    //     },
    //     {
    //       title: "Leave",
    //       // dataIndex: "responses",
    //       // key: "responses"
    //       render: (response, data) => {
    //         return <div>{data.isUserInHoliday}</div>;
    //       },
    //     }
    //   );

    if (userTeamSync && !userTeamSync.isShared) {
      const isPlannigPoker = userTeamSync.standuptype == "planning_poker" ? true : false;
      if (!isPlannigPoker) {
        standup_engagement_column.splice(4, 0, {
          title: "Skipped",
          // dataIndex: "responses",
          // key: "responses"
          render: (response, data) => {
            return <div>{data.skippedReports}</div>;
          },
        });
      }

      const index = isPlannigPoker ? 4 : 5;
      standup_engagement_column.splice(index, 0, {
        title: "Leave",
        // dataIndex: "responses",
        // key: "responses"
        render: (response, data) => {
          return <div>{data.isUserInHoliday}</div>;
        },
      });
    }

    if (
      (userTeamSync &&
        (userTeamSync.standuptype == "dailystandup" || userTeamSync.standuptype == "Daily Standup") &&
        jiraSkill &&
        jiraSkill.skill_metadata.linked &&
        userTeamSync.showActivity &&
        userTeamSync.showActivity.jira &&
        userTeamSync.showActivity.jira === "true") ||
      (userTeamSync.showActivity && userTeamSync.showActivity.jira && userTeamSync.showActivity.jira === true)
    ) {
      standup_engagement_column.splice(6, 0, {
        title: "Activity",
        // dataIndex: "responses",
        // key: "responses"
        render: (response, data) => {
          return <div>{data.jiraActivity && data.jiraActivity}</div>;
        },
      });
    }

    if (
      userTeamSync &&
      (userTeamSync.standuptype == "dailystandup" || userTeamSync.standuptype == "Daily Standup") &&
      userTeamSync.moodquestion &&
      userTeamSync.moodquestion !== "None" &&
      userTeamSync.moodquestion !== "none"
    ) {
      standup_engagement_column.splice(7, 0, {
        title: "Mood Score",
        // dataIndex: "responses",
        // key: "responses"
        render: (response, data) => {
          return (
            <div>
              {data.usersTotalMoodResponses && data.usersMoodTotal && data.usersMoodTotal / data.usersTotalMoodResponses != 0
                // ? (data.usersMoodTotal / data.usersTotalMoodResponses.toFixed(1))
                ? (data.usersMoodTotal / data.usersTotalMoodResponses).toFixed(1)
                : "-"}
            </div>
          );
        },
      });
    }
    const moodAvg = userMoodTotal ? userMoodTotal / totalMoodResponses : 0;

    return (
      <Fragment>
        <div
        // style={{
        //   paddingLeft: "24px",
        //   // paddingRight: "100px",
        //   paddingTop: "32px",
        //   height: "100vh",
        // }}
        >
          <Row>
            <Col span={span}>
              {/*<div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  // justifyContent: "space-around"
                }}
              >*/}
                {/*
                <div style={{ paddingRight: 16 }}>
                  <Card 
                  border={false}
                  style={{ width: "100%" }}
                  size="small"
                    title="Engagement"
                  >
                    <Statistic  value={totalResponded ? totalResponded : ""} suffix='%' />
                  </Card>
                  
                </div>
                */}
               <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                <Col span={6} style={{ display: "flex" }}>
                {/*<div style={{ paddingRight: 16 }}> */}
                  <Card
                  border={false}
                  title="Responses"
                  style={{ width: "100%" }}
                  size="small"
                  >
                    <Statistic  value={repliedResponsesCount ? repliedResponsesCount : ""} suffix={"/ " + totalResponses} />
                  </Card>
                  
               </Col>
               {userTeamSync.standuptype=="team_mood_standup" && (
               <Col span={6} style={{ display: "flex" }}>
              {/*<div style={{ paddingRight: 16 }}> */}
              <Card 
              border={false}
              style={{ width: "100%" }}
              size="small"
                title="Participation"
              >
                <Statistic  value={totalResponded ? totalResponded : ""} suffix='%' />
              </Card>
              </Col>
               )}

              {userTeamSync.standuptype==="team_mood_standup" && userTeamSync.moodquestion && userTeamSync.moodquestion !== "none" && userTeamSync.moodquestion !== "None" && best_day && best_day.date &&(
                 <Col span={6} style={{ display: "flex" }}>
                 {/*<div style={{ paddingRight: 16 }}> */}
                <Card
                  border={false}
                  style={{ width: "100%" }}
                  size="small"
                  title={"Best Day: "+ best_day.moodScore}
                > 
                <Statistic value={best_day.date}  />
              </Card>
              </Col>
               )}
               
               {userTeamSync.standuptype==="team_mood_standup" && userTeamSync.moodquestion && userTeamSync.moodquestion !== "none" && userTeamSync.moodquestion !== "None" && worst_day && worst_day.date &&(
                 <Col span={6} style={{ display: "flex" }}>
                 {/*<div style={{ paddingRight: 16 }}> */}
                <Card
                  border={false}
                  style={{ width: "100%" }}
                  size="small"
                  title={"Worst Day: "+ worst_day.moodScore}
                > 
                {/*<p style={{fontSize:"21px", fontWeight:"normal", marginBottom:"0px"}}>{worst_day.date}</p>*/}
                {/*<Text>{worst_day.date}</Text>*/}
                <Statistic value={worst_day.date}  />
              </Card>
              </Col>
               )}

                {/*<div style={{ paddingRight: 16 }}></div>*/}
                {userTeamSync.moodquestion && userTeamSync.moodquestion !== "none" && userTeamSync.moodquestion !== "None" && rechart_mood2 && rechart_mood2.length<=1 &&(
                  <Col span={6} style={{ display: "flex" }}>
                  {/*<div style={{ paddingRight: 16 }}> */}
                    <Card
                    border={false}
                    style={{ width: "100%" }}
                    size="small"
                    title='Mood Score'
                    >
                      
                      <Statistic
                        
                        // value={userMoodTotal ? (Number.isInteger(userMoodTotal / totalMoodResponses) ? userMoodTotal / totalMoodResponses : (userMoodTotal / totalMoodResponses).toFixed(2) ): "0"}
                        value={userMoodTotal ? (Number.isInteger(moodAvg) ? moodAvg : moodAvg.toFixed(1)) : "0"}
                        suffix={totalMoodResponses ? "/ 5" : "/ 0"}
                      />
                      
                    </Card>
                  
                  </Col>
                )}
                
                
                {/*<div style={{ paddingRight: 16 }}></div>*/}
                {userTeamSync.standuptype!="team_mood_standup" && userTeamSync.moodquestion && userTeamSync.moodquestion !== "none" && userTeamSync.moodquestion !== "None" && rechart_mood2 && rechart_mood2.length>1 &&(
                 <Col span={6} style={{ display: "flex" }}>
                 {/*<div style={{ paddingRight: 16 }}> */}
                <Card
                  border={false}
                  style={{ width: "100%" }}
                  size="small"
                  title={"Mood Score: "+ moodAvg.toFixed(1)}
                > 
               
                  <div style={{ display: "flex", justifyContent: "center" }}>
                        <AreaChart width={200} height={40} data={rechart_mood2}>
                      
                      <ReTooltip />

                      <XAxis hide={true} dataKey="name" />
                      <Area
                        type="monotone"
                        dataKey="mood"
                        stroke="#402e96"
                        strokeWidth={2}
                      />
                      {/*
                      <ReTooltip content={<this.CustomTooltipAreaChart/>} />
                      <XAxis dataKey="name" />
                      <YAxis/>
                      <CartesianGrid strokeDasharray="3 3" />
                      <Area
                        type="monotone"
                        dataKey="mood"
                        stroke="#402e96"
                        strokeWidth={2}
                      />
                      */}
                    </AreaChart>
                
                </div>
              </Card>
              
                    </Col>
               )}
                
                {userTeamSync.standuptype=="team_mood_standup" && userTeamSync.moodquestion && userTeamSync.moodquestion !== "none" && userTeamSync.moodquestion !== "None" && rechart_mood2 && rechart_mood2.length>1 &&(
                 <Col span={9} style={{ display: "flex" }}>
                 {/*<div style={{ paddingRight: 16 }}> */}
                <Card
                  border={false}
                  style={{ width: "100%" , height: "100%" }}
                  size="small"
                  title={"Mood Score: "+ moodAvg.toFixed(1)}
                > 
                <ResponsiveContainer width="100%" height={200}>
                  {/*<div style={{ display: "flex", justifyContent: "center" }}>*/}
                        <BarChart width={400} height={160} data={rechart_mood2}>
                      
                      <ReTooltip />
                      <YAxis hide={true} />
                      <XAxis dataKey="name" />
                      <Bar
                        stackId="a"
                        dataKey="mood"
                        fill="#8884d8"
                        stroke="#402e96"
                      />
                      {/*
                      <ReTooltip content={<this.CustomTooltipAreaChart/>} />
                      <XAxis dataKey="name" />
                      <YAxis/>
                      <CartesianGrid strokeDasharray="3 3" />
                      <Area
                        type="monotone"
                        dataKey="mood"
                        stroke="#402e96"
                        strokeWidth={2}
                      />
                      */}
                    </BarChart>
                
                </ResponsiveContainer>
              </Card>
              
            </Col>
               )}
               

               {/*<div style={{ paddingRight: 16 }}></div>*/}

               {userTeamSync.standuptype!="team_mood_standup" && rechart_participation2&& rechart_participation2.length>1 && (
                 <Col span={6} style={{ display: "flex" }}>
                 {/*<div style={{ paddingRight: 16 }}> */}
                <Card
                  border={false}
                  style={{ width: "100%" }}
                  size="small"
                  title={totalResponded?"Total Participation: "+ totalResponded+"%" : "Total Participation: "+ 0 +"%" }
                > 
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <AreaChart width={200} height={40} data={rechart_participation2}>
                      <ReTooltip />
                      <XAxis hide={true} dataKey="name" />
                      <Area
                        type="monotone"
                        dataKey="participation"
                        stroke="#402e96"
                        strokeWidth={2}
                      />
                    </AreaChart>
                </div>
              </Card>
              </Col>
             )}
              {userTeamSync.standuptype!="team_mood_standup" && rechart_participation2&& rechart_participation2.length<=1 && (
                <Col span={6} style={{ display: "flex" }}>
              {/*<div style={{ paddingRight: 16 }}> */}
              <Card 
              border={false}
              style={{ width: "100%" }}
              size="small"
                title="Participation"
              >
                <Statistic  value={totalResponded ? totalResponded : ""} suffix='%' />
              </Card>
              </Col>
              )}
            

                {userTeamSync.standuptype=="team_mood_standup" && rechart_participation2&& rechart_participation2.length>1 && (
                 <Col span={9} style={{ display: "flex" }}>
                 {/*<div style={{ paddingRight: 16 }}> */}
                <Card
                  border={false}
                  style={{ width: "100%" }}
                  size="small"
                  title={totalResponded?"Total Participation: "+ totalResponded+"%" : "Total Participation: "+ 0 +"%" }
                > 
                {/*<div style={{ display: "flex", justifyContent: "center" }}>*/}
                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart width={200} height={40} data={rechart_participation2}>
                      <ReTooltip />
                      <YAxis hide={true} />
                      <XAxis dataKey="name" />
                      <Area
                        type="monotone"
                        dataKey="participation"
                        stroke="#402e96"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
              </Card>
              </Col>
                )}
                {/*
              : <Col span={6} style={{ display: "flex" }}>
              {/*<div style={{ paddingRight: 16 }}> }
              <Card 
              border={false}
              style={{ width: "100%" }}
              size="small"
                title="Participation"
              >
                <Statistic  value={totalResponded ? totalResponded : ""} suffix='%' />
              </Card>
              </Col>
            
            */}
            
               
               {userTeamSync.standuptype==="team_mood_standup" && userTeamSync.moodquestion && userTeamSync.moodquestion !== "none" && userTeamSync.moodquestion !== "None" && totalMoodResponses && ( 
               <Col span={6} style={{ display: "flex" }}>
                <Card
                  border={false}
                  style={{ width:"100%", height: "100%"}}
                  size="small"
                  title={"Mood Distribution" }
                > 
                {/*<div style={{ 
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                    height:160
                  }}>
                */}
                <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie 
                  data={responsesGroupedByTeamMoodScore} 
                  innerRadius={20}
                  outerRadius={40}
                  dataKey="totalMoodResponses"  
                  cy="50%"
                  
                  fill="#8884d8"
                  paddingAngle={this.isMoreThanOneScoreAvailable()>1? 5 : 0}
                  >
                      {
                          responsesGroupedByTeamMoodScore.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                      }
                  </Pie>
                  <Legend />
                  <ReTooltip content={<this.CustomTooltip /> } />
                </PieChart>
                </ResponsiveContainer>
                {/*</div>*/}
              </Card>
              </Col>
               )}
              </Row>
               
               
              {/*
              <div style={{ paddingRight: 16 }}></div>
                <Card>
                 <Statistic
                  title="Team Mood: 60%"
                  value={<div style={{ display: "flex", justifyContent: "center" }}>
                  <AreaChart width={200} height={50} data={rechart_data}>
                  <ReTooltip />
                  <XAxis hide={true} dataKey="name" />
                  <Area
                    type="monotone"
                    dataKey="mood"
                    stroke="#402e96"
                    strokeWidth={2}
                  />
                </AreaChart>
                </div>}
                 /> 
              </Card>
              */}
              {/*</div> */}
              
              
              {(userTeamSync.standuptype!=="team_mood_standup"&&userTeamSync.send_anonymous!==true) && (
              <>
              <div style={{ padding: 16 }} />
              <Table
                columns={standup_engagement_column}
                dataSource={membersResponse}
                pagination={false}
                style={{ marginBottom: "32px" }}
                loading={loading}
              />
              </>
              )}

              
              
            </Col>

            {/* <Col span={4}>
              <span> </span>
            </Col> */}
          </Row>
          
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  userTeamSync: state.skills.userTeamSync,
  totalResponses: state.skills.totalResponses,
  membersResponse: state.skills.membersResponse,
  totalResponded: state.skills.totalResponded,
  repliedResponsesCount: state.skills.repliedResponsesCount,
  userMoodTotal: state.skills.userMoodTotal,
  totalMoodResponses: state.skills.totalMoodResponses,
  participation:state.skills.participation,
  moodChart:state.skills.moodChart,
  responsesGroupedByTeamMoodScore:state.skills.responsesGroupedByTeamMoodScore,
  members: state.skills.members,
  user_now: state.common_reducer.user,
  skills: state.skills.skills,
});
export default withRouter(
  connect(mapStateToProps, {
    getTeamSyncAnalytics,
  })(InsightsEngagement)
);
