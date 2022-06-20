import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { SkillsAction } from "../settings/settings_action";
import {getOauthTokensForUsers} from "../../jiraoauth/jiraoauth.action"

import {
  CheckOutlined,
  ClockCircleOutlined,
  HistoryOutlined,
  SlackOutlined,
  UserOutlined,
  CheckCircleOutlined,
  EllipsisOutlined,
  AppstoreOutlined,
  BulbOutlined,
  AppstoreAddOutlined,
  ArrowLeftOutlined,
  TeamOutlined,
  CrownOutlined,

} from "@ant-design/icons";

import { Card, Row, Col, Button, Tag, Layout, Tabs, PageHeader, Result, Spin, Modal, Dropdown, Menu, Typography, message, Select, Checkbox, Input } from "antd";
import { getUsersSelectedTeamSync, getAssisantSkills, getUserTeamSync,getProjectTeamSyncInstance, recentCheckins } from "../skills_action";
import CreateTeamsyncModal from "./createTeamsyncModal";
import moment from "moment-timezone";
import MenuItem from "antd/lib/menu/MenuItem";
import TeamSyncTemplates from "./teamSyncTemplates";
import CheckinIntegrations from "./checkin.integrations";
import "./AllStandups.css"
const { Content } = Layout;
const { Text } = Typography;
const { Option } = Select;
const { Search } = Input;

const compare=(a, b)=> {
  // Use toUpperCase() to ignore character casing
  const date1 = a.jobRunAt
  const date2 = b.jobRunAt

  let comparison = 0;
  if (date1 > date2) {
    comparison = 1;
  } else if (date1 < date2) {
    comparison = -1;
  }
  return comparison;
}

class MyStandups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showmystandups: false,
      loading: false,
      teamSyncId: "",
      teamSyncName: "",
      noInstance: "",
      weekdays: [],
      trooprUserId: "",
      modalVisible: false,
      // isToggleOn: true,
      currentPage: 1,
      tab: "",
      newStandupModalVisible: false,
      edit: false,
      editTeamSyncId: false,
      selectedTeamSyncForEdit: {},
      standuptype: false,
      showDisabledMyCheckins:true,
      showDisabledAllCheckins:true,
      selectInputMyCheckin:"",
      selectInputAllCheckin:"",
      myCheckIns2:[],
      allTeamsyncs:[],

      //To Do : handle for github also
      integrationPage : this.props.match.params.skill_id ? "jira" : 'all'
    };

    this.showreport = this.showreport.bind(this);
    this.toggle = this.toggle.bind(this);
    this.weekdays = this.weekdays.bind(this);
  }

  componentDidMount() {
    if(this.props.workspace.disableCheckins){
      this.props.history.push(`/${this.props.match.params.wId}/dashboard`)
      message.warning('Check-in is disabled')
    }
    else{
    this.setState({ loading: true });
    let currentWorkspaceId = localStorage.getItem("userCurrentWorkspaceId");
    this.props.getUsersSelectedTeamSync(currentWorkspaceId, true).then((res) => {
      if (res.data.success) {

        let myCheckIns = [];
        myCheckIns = res.data.teamSyncs 
        this.setState({
          myCheckIns2:res.data.teamSyncs ,
          allTeamsyncs:res.data.teamSyncs
        })
        const destination = window.location.href.split("/")[5];
        if (destination === "templates") {
          this.setState({ tab: "templates" });
          const creat_new_team_mood = window.location.href.split("/")[6];
          if(creat_new_team_mood==="new_team_mood_anonymous") this.setState({newStandupModalVisible : true,standuptype : 'moodcheckinanonymous'})
          else if(creat_new_team_mood==="new_team_mood") this.setState({newStandupModalVisible : true,standuptype : 'moodcheckin'})
          else if(creat_new_team_mood==="new_retro") this.setState({newStandupModalVisible : true,standuptype : 'retrospective'})
          else if(creat_new_team_mood==="new_retro_anonymous") this.setState({newStandupModalVisible : true,standuptype : 'retrospectiveanonymous'})
          else if(creat_new_team_mood==="new_planning_poker") this.setState({newStandupModalVisible : true, standuptype : 'planning_poker'})
          else if(creat_new_team_mood==="new_instant_planning_poker") this.setState({newStandupModalVisible : true, standuptype : 'instant-poker'})
          else if(creat_new_team_mood==="new_checkin") this.toggleNewStandupModal()

        }
        else if (destination === "all") this.setState({ tab: "all" });
        else if (destination === "global_insights") this.setState({ tab: "global_insights" });
        else if (destination === "integrations") this.setState({ tab: "integrations" });
        else if (myCheckIns.length > 0) {
          this.setState({ tab: "myCheckIn" });
        } else if (res.data.teamSyncs && res.data.teamSyncs.length > 0) {
          this.props.history.push(`/${this.props.match.params.wId}/teamsyncs/all`);
          // this.setState({ tab: "all" });
        } else {
          this.props.history.push(`/${this.props.match.params.wId}/teamsyncs/templates`);
          // this.setState({ tab: "templates" });
        }
      }
      this.setState({ loading: false });
    });
    // console.log(this.props.teamSyncs)
    }
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    // to handle sidebar changes
    // console.log(this.props,this.state)
    if (location.pathname !== prevProps.location.pathname) {
      this.setState({ tab: location.pathname.split("/")[3] || "myCheckIn" });
    }
  }

  handleCancel = () => {
    this.setState({ modalVisible: false });
  };

  toggle() {
    this.setState({
      modalVisible: !this.state.modalVisible,
    });
  }

  showreport = (teamsyncId, teamsyncName) => () => {
    let wID = localStorage.getItem("userCurrentWorkspaceId");
    this.props.recentCheckins(teamsyncId,wID).then(res=>{
      //console.info("res",res)
    }).catch(err=>{
      //console.info(err)
    })
    
    // this.props.history.push(`/${wID}/teamsync?teamsync_id=${teamsyncId}`)
    this.props.history.push(`/${wID}/teamsync/${teamsyncId}`);
  };

  seemore = () => {
    this.setState({ showmore: !this.state.showmore });

    // this.setState(function (prevState) {
    //   return { isToggleOn: !prevState.isToggleOn };
    // });
  };

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      currentPage: pagination.current,
    });
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

  onTabChange = (activeKey) => {
    this.setState({ tab: activeKey });
  };

  sortBySchedule=(teamsyncs)=>{
    let onGoingTeamsyncs=[]
    let scheduledTeamsyncs=[]
    let unscheduledTeamsyncs=[]
    let disabledTeamsyncs=[]
    teamsyncs.forEach((teamsync)=>{
      if(teamsync.createInstance){
        if(teamsync.standupscheduleType=="manual"&&!teamsync.isOngoing){
          //unscheduled
          unscheduledTeamsyncs.push(teamsync)
        }
        else{
          if(teamsync.isOngoing){
            //now
            onGoingTeamsyncs.push(teamsync)
          }else{
            //scheduled
            scheduledTeamsyncs.push(teamsync)
          }
        }

      }else{
        //disabled
        disabledTeamsyncs.push(teamsync)
      }
    })

    if(scheduledTeamsyncs && scheduledTeamsyncs.length>0){
      scheduledTeamsyncs.sort(compare)
    }

    //let sortedTeamsyncs=onGoingTeamsyncs.concat(scheduledTeamsyncs).concat(unscheduledTeamsyncs).concat(disabledTeamsyncs)
    let sortedTeamsyncs = []
    sortedTeamsyncs.push(...onGoingTeamsyncs, ...scheduledTeamsyncs, ...unscheduledTeamsyncs, ...disabledTeamsyncs)
    return sortedTeamsyncs
  }

  checkinRunTime=(teamsync)=>{
    const { user_now,projectTeamSyncInstance } = this.props;

    const next_job_run = teamsync.jobRunAt
    const onGoing=teamsync.isOngoing
    
    if(teamsync.createInstance){

      let today=new Date()
      //let today_tz=moment(new Date()).format('YYYYMMDD');
      //console.info("time",moment(today).format("LT"))
      let tomorrow=new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
      //let tomorrow_tz=moment(tomorrow).format('YYYYMMDD')
      //console.info(moment(tomorrow).format('YYYYMMDD'))

      //let gmt_job_date=new Date(Date.parse("2021-05-24T17:00:00.000Z"))
      let gmt_job_date=new Date(Date.parse(next_job_run))
      //console.info("gmt_job_date",gmt_job_date)
  
      //console.info("************",moment("20210603", "YYYYMMDD").fromNow())
      if(teamsync.standupscheduleType=="manual"&&!onGoing){
        return <Tag color="orange">Unscheduled</Tag>
      }
      else{
        if(onGoing){
          //Now
          return <Tag color="#87d068">NOW</Tag>
        }
        //else if(today_tz==moment(next_job_run).format('YYYYMMDD')){
        else if(today.getDate()==gmt_job_date.getDate() && today.getMonth()==gmt_job_date.getMonth() && today.getFullYear()==gmt_job_date.getFullYear()){
          return <Tag color="orange">{moment(next_job_run).format("LT")}</Tag>
        }
        //else if(tomorrow_tz==moment(next_job_run).format('YYYYMMDD')){
        else if(tomorrow.getDate()==gmt_job_date.getDate() && tomorrow.getMonth()==gmt_job_date.getMonth() && tomorrow.getFullYear()==gmt_job_date.getFullYear()){
          return <Tag color="orange">{"Tomorrow "+ moment(next_job_run).format("LT")}</Tag>
          //tomorrow
        }
        else{
          //in 10 days
          return <Tag color="orange">{moment(gmt_job_date, "YYYYMMDD").fromNow()}</Tag>
        }
      }
      

    }else{
      //Disabled
      return <Tag color="red">Disabled</Tag>
    }
  }

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

  // switchView = () => {
  //     this.props.history.push(`/assistant/${this.props.match.params.wId}/teamsyncs`);
  //     this.setState({ showreport: !this.state.showreport })
  // }

  // goToSlackAppHome = () => {
  //   let url = `https://slack.com/app_redirect?app=AE4FF42BA&team=${this.props.assistant.id}&tab=home`;
  //   window.open(url);
  //   this.setState({ newStandupModalVisible: false });
  // };

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
  newCheckIn = () => {
    this.setState({ edit: false });
  };

  handleEdit = (id, e) => {
    const { teamSyncs } = this.props;
    e.stopPropagation();
    // this.props.getUserTeamSync(id).then((res) => {
    //   if (res.data.success) {
    //     this.setState({ edit: true, editTeamSyncId: id }, () => {
    //       this.setState({ newStandupModalVisible: true });
    //     });
    //   }
    // });
    let selectedTeamSyncForEdit = {};
    if (teamSyncs.length > 0) {
      selectedTeamSyncForEdit = teamSyncs.find((ts) => ts._id == id);
    }

    if (selectedTeamSyncForEdit._id) {
      this.setState({ edit: true, editTeamSyncId: id, selectedTeamSyncForEdit }, () => {
        this.setState({ newStandupModalVisible: true });
      });
    }
  };


  handleTemplateSelect = async (standuptype) => {
    
    // if(standuptype ==="planning_poker"){
    //   const {skills,currentSkillUser} = this.props
    //   const skill = skills.find((skill) => skill.name == "Jira")
    //   const isjiraConnected = skill && skill.skill_metadata ? skill.skill_metadata.linked : skill.linked
    //   const token =  currentSkillUser && currentSkillUser._id && currentSkillUser.token_obj
    //   let url=await getOauthTokensForUsers(this.props.match.params.wId,this.props.match.params.sub_skill)
    //   if(!isjiraConnected||!token) return  message.warning({
    //     content: (
    //       <>
    //         Verify your jira account in order to use Planning Poker
    //         <Button
    //           style={{ marginLeft: 0 }}
    //           type='link'
    //           onClick={() => window.open(url, "_blank")}
    //         >
    //           Click here
    //         </Button>
    //       </>
    //     ),
    //   })
    // }
    this.setState({
      newStandupModalVisible: !this.state.newStandupModalVisible,
      standuptype,
    });
  };

  handleIntegrationSelection = (type) => {
    if(type === 'github') message.info('Coming Soon')
    else {
      if(type === 'jira'){
        const jiraSkill = this.props.skills.find((skill) => skill.key === "jira");
        this.props.history.push(`/${this.props.match.params.wId}/teamsyncs/integrations/${jiraSkill.skill_metadata._id}`);
      }else this.props.history.push(`/${this.props.match.params.wId}/teamsyncs/integrations`);

      this.setState({integrationPage : type})
    }
  }

  onSearchMyCheckins = (val) =>{
    
    const{showDisabledMyCheckins}=this.state;
    // console.log(showDisabledMyCheckins)

    const {teamSyncs} = this.props;
    let temp=[]
    if (teamSyncs) {
      temp = teamSyncs.filter(
        (teamsync) =>
        showDisabledMyCheckins?val?teamsync.name.toLowerCase().includes(val.toLowerCase()):true
          :val?teamsync.createInstance && teamsync.name.toLowerCase().includes(val.toLowerCase())
          :teamsync.createInstance
        );
      // console.log('mycheckins',temp)
      
      // teamSyncs.filter(
      //   (teamsync) =>
      //   showDisabledMyCheckins?val?teamsync.name.toLowerCase().includes(val.toLowerCase()):true
      //     :val?teamsync.createInstance && teamsync.name.toLowerCase().includes(val.toLowerCase())
      //     :teamsync.createInstance
      //   );
    }
    this.setState({myCheckIns2:temp})
    this.setState({selectInputMyCheckin:val})
  }
  onSearchChangeMyCheckin = (e) =>{
    let val=e.target.value
    const{showDisabledMyCheckins}=this.state;
    // console.log(showDisabledMyCheckins)
    const {teamSyncs} = this.props;
    let temp=[]
    if (teamSyncs) {
      temp = teamSyncs.filter(
        (teamsync) =>
        showDisabledMyCheckins?val?teamsync.name.toLowerCase().includes(val.toLowerCase()):true
          :val?teamsync.createInstance && teamsync.name.toLowerCase().includes(val.toLowerCase())
          :teamsync.createInstance
        );
    // console.log('changeMycheckins',temp)
      }
    this.setState({myCheckIns2:temp})
    this.setState({selectInputMyCheckin:val})
  }
  onSearchChangeAllCheckin =(e)=>{
    let val=e.target.value
    const{allTeamsyncs,showDisabledAllCheckins}=this.state;
    const {teamSyncs} = this.props;
    let temp=[]
    if (teamSyncs) {
      temp = teamSyncs.filter(
        (teamsync) =>
        showDisabledAllCheckins?
          val?teamsync&&(teamsync.name.toLowerCase().includes(val.toLowerCase()))
          :teamsync
          :val?teamsync.createInstance && (teamsync.name.toLowerCase().includes(val.toLowerCase()))
          :teamsync.createInstance && teamsync
        );
        // console.log('changeallcheckins',temp)
      }
    this.setState({allTeamsyncs:temp})
    this.setState({selectInputAllCheckin:val})

  }
  onSearchAllCheckins = (val) =>{
    const{allTeamsyncs,showDisabledAllCheckins}=this.state;
    const {teamSyncs} = this.props;
    let temp=[]
    if (teamSyncs) {
      temp = teamSyncs.filter(
        (teamsync) =>
        showDisabledAllCheckins?
          val?teamsync&&(teamsync.name.toLowerCase().includes(val.toLowerCase()))
          :teamsync
          :val?teamsync.createInstance && (teamsync.name.toLowerCase().includes(val.toLowerCase()))
          :teamsync.createInstance && teamsync
        );
    // console.log('Allcheckins',temp)
      }
    this.setState({allTeamsyncs:temp})
    this.setState({selectInputAllCheckin:val})
  }
  showSelectedMyCheckin=(val)=>{
    const{allTeamsyncs}=this.state;
    const {teamSyncs} = this.props;
    let temp=[]
    if(teamSyncs){
      temp=teamSyncs.filter(teamsync=>
      teamsync.name.toLowerCase()==val.toLowerCase()?
      teamsync && (teamsync.selectedMembers.includes(this.props.user_now._id) || (teamsync.admins && teamsync.admins.includes(this.props.user_now._id)))
      :""  
    )
    }
    this.setState({myCheckIns2:temp})
    //this.setState({myCheckInsSelctedValue:val})
    
  }
  showSelectedAllCheckin=(val)=>{
    const{allTeamsyncs}=this.state;
    const {teamSyncs} = this.props;
    let temp=teamSyncs.filter(teamsync=>
      teamsync.name.toLowerCase()==val.toLowerCase()?teamsync:""  
    )
    this.setState({allTeamsyncs:temp})
    //this.setState({myCheckInsSelctedValue:val})
    
  }

  showPausedMyCheckins = (e)=>{
    this.setState({showDisabledMyCheckins:e.target.checked})
    const {teamSyncs} = this.props;
    const {allTeamsyncs,myCheckIns2,selectInputMyCheckin} = this.state;
    let temp=[]
    if (teamSyncs) {
      temp = teamSyncs.filter(
        (teamsync) =>
        e.target.checked?
        selectInputMyCheckin?teamsync.name.toLowerCase().includes(selectInputMyCheckin.toLowerCase())&& (teamsync.selectedMembers.includes(this.props.user_now._id) || (teamsync.admins && teamsync.admins.includes(this.props.user_now._id)))
        :teamsync.selectedMembers.includes(this.props.user_now._id) || (teamsync.admins && teamsync.admins.includes(this.props.user_now._id))
        :selectInputMyCheckin?teamsync.createInstance && teamsync.name.toLowerCase().includes(selectInputMyCheckin.toLowerCase())&& (teamsync.selectedMembers.includes(this.props.user_now._id) || (teamsync.admins && teamsync.admins.includes(this.props.user_now._id)))
        :teamsync.createInstance && (teamsync.selectedMembers.includes(this.props.user_now._id) || (teamsync.admins && teamsync.admins.includes(this.props.user_now._id)))
      
         /* e.target.checked?
          teamsync.selectedMembers.includes(this.props.user_now._id) || (teamsync.admins && teamsync.admins.includes(this.props.user_now._id))
          :teamsync.createInstance && (teamsync.selectedMembers.includes(this.props.user_now._id) || (teamsync.admins && teamsync.admins.includes(this.props.user_now._id)))
        */
          );
          // console.log('pausedMycheckins',temp, selectInputMyCheckin)
    }
    this.setState({myCheckIns2:temp})
  }
  showPausedAllCheckins =(e)=>{
    this.setState(this.setState({showDisabledAllCheckins:e.target.checked}))
    
    const {allTeamsyncs,selectInputAllCheckin} = this.state;
    const {teamSyncs} = this.props;
    // console.log('teamsyncs',teamSyncs);
    let temp=[]
    if (teamSyncs) {
      temp = teamSyncs.filter(
        (teamsync) =>
          e.target.checked?
          selectInputAllCheckin?teamsync&&(teamsync.name.toLowerCase().includes(selectInputAllCheckin.toLowerCase()))
          :teamsync
          :selectInputAllCheckin?teamsync.createInstance && (teamsync.name.toLowerCase().includes(selectInputAllCheckin.toLowerCase()))
          :teamsync.createInstance && teamsync

         /* e.target.checked?
          teamsync
          :teamsync&&teamsync.createInstance 
          */
        );
        // console.log('PausedAllcheckins',temp)
    }
    this.setState({allTeamsyncs:temp})
  }
  
  
  render() {
    const { teamSyncs, instanceResponses, projectTeamSyncInstance, userTeamSync } = this.props;
    const { tab, integrationPage,showDisabledMyCheckins,showDisabledAllCheckins,selectInputMyCheckin,selectInputAllCheckin,myCheckIns2,allTeamsyncs } = this.state;
    // let creator_id;
    // if (userTeamSync && userTeamSync.user_id && userTeamSync.user_id._id) {
    //   creator_id = userTeamSync.user_id._id;
    // }
    //let myCheckIns = [];
    // console.log(this.props.user_now._id);
    // teamSyncs.forEach(teamsync => {
    //   console.log("seletedMembers -> ",teamsync.selectedMembers);
    //   console.log("admins -> ",teamsync.admins);
    // })
    /*
    if (teamSyncs) {
      myCheckIns = teamSyncs.filter(
        (teamsync) =>
          showDisabledCheckins?
          selectInput?teamsync.name.toLowerCase().includes(selectInput.toLowerCase())&& (teamsync.selectedMembers.includes(this.props.user_now._id) || (teamsync.admins && teamsync.admins.includes(this.props.user_now._id)))
          :teamsync.selectedMembers.includes(this.props.user_now._id) || (teamsync.admins && teamsync.admins.includes(this.props.user_now._id))
          :selectInput?teamsync.createInstance && teamsync.name.toLowerCase().includes(selectInput.toLowerCase())&& (teamsync.selectedMembers.includes(this.props.user_now._id) || (teamsync.admins && teamsync.admins.includes(this.props.user_now._id)))
          :teamsync.createInstance && (teamsync.selectedMembers.includes(this.props.user_now._id) || (teamsync.admins && teamsync.admins.includes(this.props.user_now._id)))
        );
    }
    */
    
    return (
      <div className="all_standup">
      <Layout style={{ height: "100vh" }}>   
        {/* <PageHeader
          style={{
            paddingLeft: "100px",
            paddingRight: "100px",
            // background: localStorage.getItem("theme") == "default" ? "#ffffff" : "rgba(15,15,15)",
          }}
          className='site-page-header-responsive'
          title='Conduct virtual asynchronous meetings'
          // subTitle='Conduct virtual asynchronous meetings'
          extra={
            <Button type='primary' icon={<CheckCircleOutlined />} onClick={this.toggleNewStandupModal}>
              New Check-in
            </Button>
          }
          footer={
            <Tabs activeKey={this.state.tab} onChange={this.onTabChange}>
              <TabPane
                tab={
                  <span>
                    <CheckOutlined />
                    My Check-ins
                  </span>
                }
                key='myCheckIn'
              />
              <TabPane
                tab={
                  <span>
                    <HistoryOutlined />
                    All Check-ins
                  </span>
                }
                key='all'
              />
              <TabPane
                tab={
                  <span>
                    <AppstoreOutlined />
                    Check-in Templates
                  </span>
                }
                key='templates'
              />
            </Tabs>
          }
        /> */}
        <PageHeader
          // title={
          //   tab === 'myCheckIn' ? 'My Check-ins' :
          //   tab === 'all' ? 'All Check-ins' :
          //   tab === 'templates' ? 'Check-in Templates' :
          //   tab === 'global_insights' ? 'Insights' :
          //   ""
          // }
          ghost={false}
          title={
            tab === "integrations" ? (
              <>
              {integrationPage === 'jira' && <Button onClick={() => this.handleIntegrationSelection("all")} icon={<ArrowLeftOutlined/>}>Back</Button> } {integrationPage === 'all' ? 'Integrations' : 'Jira'}
              </>
            ):("Check-ins")
          }
              
              footer={
                tab === 'integrations'?(""):(
                  <div className="all_standup">
                  <Tabs defaultActiveKey="myCheckIn" activeKey={this.state.tab} onChange={this.onTabChange}>
                    <Tabs.TabPane tab="My Check-ins" key="myCheckIn" />
                    {/* <Tabs.TabPane tab="All Check-ins" key="all" /> */}
                    <Tabs.TabPane tab="Check-in Templates" key="templates" />
                  </Tabs>
                  </div>
                  )
                }
              /*
              <Tabs activeKey={this.state.tab} onChange={this.onTabChange}>
                <Tabs.TabPane tab={<span><CheckOutlined />My Check-ins</span>} key='myCheckIn'/>
                <Tabs.TabPane
                  tab={
                    <span>
                      <HistoryOutlined />
                      All Check-ins
                    </span>
                  }
                  key='all'
                />
                <Tabs.TabPane
                  tab={
                    <span>
                      <AppstoreOutlined />
                      Templates
                    </span>
                  }
                  key='templates'
                />
                <Tabs.TabPane
                  tab={
                    <span>
                      <BulbOutlined />
                      Insights
                    </span>
                  }
                  key='global_insights'
                />
                {/* <Tabs.TabPane
                tab={
                  <span>
                    <AppstoreAddOutlined />
                    Integrations
                  </span>
                }
                key='integrations'
              /> }
              </Tabs>*/
              
          
          extra={tab === 'integrations' ? [] : [
            <Button onClick={this.toggleNewStandupModal} type='primary'>
              New Check-in
            </Button>,
          ]}
        />
        {!this.state.loading ? (
          <Content
            // style={{
            // padding: "32px 100px 0px",
            // height: "75vh",
            // height: "calc(100vh - 200px)",
            // background: localStorage.getItem("theme") == "default" ? "#ffffff" : "rgba(15,15,15)",

            // height: "100vh",
            // overflowY: "auto",
            // }}
            style={{ padding: "16px 16px 32px 24px", overflow: "auto" }}
          >
            {/*<div
            style={{
              marginTop: 16,
              marginBottom: 16,
              height: '32px',
              lineHeight: '32px'
            }}
          >
            <Select 
                placeholder="search Check-in by name"
                style={{ width: 200, marginRight: 16 }}
                showSearch
                placeholder="Select a person"
                optionFilterProp="children"
                onSearch={this.onSearch}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="tom">Tom</Option>
            </Select>
            <Checkbox defaultChecked onChange={(e)=>this.showPausedCheckins(e)}>Show Disabled Check-ins</Checkbox>
              </div>*/}
                
            {/*<Row gutter={[16, 16]} style={tab === 'integrations' ? { width: "100%", maxWidth: 1000 } : {}}>*/}
              {this.state.tab == "myCheckIn" ? (
                <>
                {/*<Row gutter={[16, 16]} style={{ width: "100%", maxWidth: 1000 }}>*/}
                <div
              style={{
                marginTop: 16,
                marginBottom: 32,
                marginLeft:0,
                height: '32px',
                lineHeight: '32px'
              }}
            >
              {/*
              <Select 
                  placeholder="Search Check-in by name"
                  style={{ width: 200, marginRight: 16 }}
                  showSearch
                  optionFilterProp="children"
                  onSearch={this.onSearchMyCheckins}
                  onSelect={this.showSelectedMyCheckin}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {myCheckIns2.map(checkin=>(<Option value={checkin.name}>{checkin.name}</Option>))}
              </Select>
                */}
              <Row gutter={[16, 16]}>
              <Col span={6}>
              <Search 
                onChange={e => this.onSearchChangeMyCheckin(e)}
                placeholder="Search Check-in by name"
                size='middle'
                allowClear
                autoFocus
                value={selectInputMyCheckin}
              />
              </Col>
              <Col span={6}>
              <Checkbox defaultChecked
              checked={this.state.showDisabledMyCheckins}
              onChange={(e)=>this.showPausedMyCheckins(e)}>Show Disabled Check-ins</Checkbox>
              </Col>
              </Row>
              </div>
            
                {teamSyncs && teamSyncs.length > 0 && myCheckIns2.length > 0 ? (
                  <>
                  <Row gutter={[16, 16]} style={tab === 'integrations' ? { width: "100%", maxWidth: 1000 } : {}}>
                  {teamSyncs &&
                  /*myCheckIns2*/this.sortBySchedule(myCheckIns2).map((teamsync) => {
                    // if (teamsync.createInstance) {
                    return (
                      <Col span={8}>
                        <a onClick={this.showreport(teamsync._id, teamsync.name, teamsync.createInstance)}>
                          <Card
                            // onClick={() =>
                            //   this.showreport(
                            //     teamsync._id,
                            //     teamsync.name,
                            //     teamsync.createInstance
                            //   )
                            // }
                            title={
                              <Fragment>
                                <span style={{ paddingRight: "8px" }}>{teamsync.name}</span>
                              </Fragment>
                            }
                            extra={
                              <>
                                {this.checkinRunTime(teamsync)}
                                {/*teamsync.createInstance ? <Tag color='green'>Active</Tag> : <Tag color='orange'>Paused</Tag>*/}
                                {/*teamsync.user_id._id == this.props.user_now._id && !teamsync.isShared && (
                                  <Button onClick={(e) => this.handleEdit(teamsync._id, e)} size='small'>
                                    Edit
                                  </Button>
                                )*/}
                                {/* <Dropdown
                                    overlay={
                                      <Menu
                                        onClick={() =>
                                          this.handleEdit(teamsync._id)
                                        }
                                      >
                                        <MenuItem>Edit</MenuItem>
                                      </Menu>
                                    }
                                  >
                                    <a
                                      className='ant-dropdown-link'
                                      onClick={(e) => e.preventDefault()}
                                    >
                                      <EllipsisOutlined />
                                    </a>
                                  </Dropdown> */}
                              </>
                            }
                            hoverable={true}
                            // bordered={false}
                            style={{
                              maxHeight: "170px",
                              minHeight: "170px",
                              // border: localStorage.getItem("theme") == "default" && "1px solid #d9d9d9",
                            }}
                            // style={{ width: "100%" }}
                            // size='small'
                          >
                            {/*teamsync.standupscheduleType && teamsync.standupscheduleType == "recurring" && (
                              <>
                                {" "}
                                <ClockCircleOutlined />
                                <Text type='secondary' style={{ paddingLeft: "8px" }}>
                                  {this.weekdays(teamsync)}{" "}
                                  {teamsync.timezone_type == "custom_timezone" ? this.convertToTZ(teamsync) : teamsync.time_at}
                                </Text>
                                <br />{" "}
                              </>
                            )*/}
                            <CrownOutlined style={{ marginRight: 8, opacity: 0.5 }}/>
                            <Text type="secondary">
                              {(teamsync.admins[0].displayName || teamsync.admins[0].name) + (teamsync.admins.length>1?(" & "+((teamsync.admins.length)-1)+" others"):"")}
                            </Text>
                            <br />
                            <TeamOutlined style={{ marginRight: 8, opacity: 0.5 }}/>
                            <Text type="secondary">{ teamsync.selectedMembers&&teamsync.selectedMembers.length + " participants"}</Text>
                            <br />
                            <Row>
                            <Col span={1.5}><SlackOutlined style={{ marginRight: 8, opacity: 0.5 }} /></Col>
                            <Col span={21}>
                            <Text type="secondary">
                              {teamsync.reportChannels && teamsync.reportChannels.length>0?"Reporting to #"+teamsync.reportChannels[0].name:teamsync.report_members && teamsync.report_members.length>0?"Reporting to @"+(teamsync.report_members[0].displayName || teamsync.report_members[0].name) :"" }
                              {teamsync.reportChannels&& teamsync.report_members && (teamsync.reportChannels.length+teamsync.report_members.length-1)>0?(" & "+(teamsync.reportChannels.length+teamsync.report_members.length-1)+" other channels"):""}
                            </Text>
                            </Col>
                            </Row>
                            <br />
                            {/*}
                            <UserOutlined />
                            <Text style={{ paddingLeft: "8px" }} type='secondary'>
                              {teamsync.user_id.name}
                            </Text>
                          */}
                            {/* <br />
                              <AppstoreOutlined />
                              <span style={{ paddingLeft: "8px" }}>
                                {teamsync.standuptype == "dailystandup"
                                  ? "Daily Standup"
                                  : "Retrospective"}
                              </span> */}
                          </Card>
                        </a>
                      </Col>
                    );
                    // }
                  })}
                  </Row>
                  </>
                ) : teamSyncs.length > 0 ? (
                  <Row gutter={[16, 16]} style={tab === 'integrations' ? { width: "100%", maxWidth: 1000 } : {}}>
                  <Result
                    style={{ marginLeft: "30vw", padding: "0px" }}
                    status='404'
                    subTitle={
                      <span>
                        <h2 style={{ padding: 0 }}>{"You got no"+(showDisabledMyCheckins?" ":" enabled ")+ "Check-ins which you are part of !"}</h2>
                        <span>Click here to check all Check-ins</span> <br />
                        <Button style={{ marginTop: "10px" }} icon={<HistoryOutlined />} onClick={() => this.onTabChange("all")}>
                          All Check-ins
                        </Button>
                      </span>
                    }
                  />
                  </Row>
                ) : (
                  <Row gutter={[16, 16]} style={tab === 'integrations' ? { width: "100%", maxWidth: 1000 } : {}}>
                  <Result
                    style={{ width: "94%" }}
                    status='404'
                    subTitle={
                      <span>
                        <h2 style={{ padding: 0 }}>You got no Check-ins yet!</h2>
                        <span>Create new Check-in</span> <br />
                        <Button style={{ marginTop: "10px" }} icon={<AppstoreOutlined />} onClick={() => this.onTabChange("templates")}>
                          Check-in Templates
                        </Button>
                      </span>
                    }
                  />
                  </Row>
                )}
                 </>
              ) : this.state.tab == "all" ? (
                <>
                
                
                    <div
                    style={{
                    marginTop: 16,
                    marginBottom: 32,
                    marginLeft: 0,
                    height: '32px',
                    lineHeight: '32px'
                  }}
                >
                
                  {/*
                  <Select 
                      placeholder="Search Check-in by name"
                      style={{ width: 200, marginRight: 16 }}
                      showSearch
                      optionFilterProp="children"
                      onSearch={this.onSearchAllCheckins}
                      onSelect={this.showSelectedAllCheckin}
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {allTeamsyncs.map(checkin=>(<Option value={checkin.name}>{checkin.name}</Option>))}
                  </Select>
                    */}
                    <Row gutter={[16, 16]}>
                  <Col span={6}>
                  <Search 
                    onChange={e => this.onSearchChangeAllCheckin(e)}
                    placeholder="Search Check-in by name"
                    size='middle'
                    allowClear
                    autoFocus
                    value={selectInputAllCheckin}
                  />
                  </Col>
                  <Col span={6}>
                  <Checkbox defaultChecked 
                  checked={this.state.showDisabledAllCheckins}
                  onChange={(e)=>this.showPausedAllCheckins(e)}>Show Disabled Check-ins</Checkbox>
                  </Col>
                  </Row>
                  </div>
                
                
                {allTeamsyncs && allTeamsyncs.length > 0 ? (
                  <Row gutter={[16, 16]} style={tab === 'integrations' ? { width: "100%", maxWidth: 1000 } : {}}>
                  {allTeamsyncs &&
                  /*allTeamsyncs*/this.sortBySchedule(allTeamsyncs).map((teamsync) => {
                    return (
                      <Col span={8}>
                        <a onClick={this.showreport(teamsync._id, teamsync.name, teamsync.createInstance)}>
                          <Card
                            // onClick={this.showreport(
                            //   teamsync._id,
                            //   teamsync.name,
                            //   teamsync.createInstance
                            // )}
                            title={
                              // <Fragment>
                              /*<div>
                                {/* <Tooltip placement='right' title={teamsync.name}> }
                                <span
                                  style={{
                                    paddingRight: "50px",
                                    maxWidth: "50px",
                                    minWidth: "50px",
                                  }}
                                >
                                  {teamsync.name}
                                </span>
                                {/* </Tooltip> }
                                {/* {teamsync.createInstance ? <Tag color="green">Active</Tag> : <Tag color="orange">Paused</Tag>} }
                              </div>
                              // </Fragment>*/
                              <Fragment>
                                <span style={{ paddingRight: "8px" }}>{teamsync.name}</span>
                              </Fragment>
                            }
                            extra={
                              <>
                                {this.checkinRunTime(teamsync)}
                                {/*teamsync.createInstance ? <Tag color='green'>Active</Tag> : <Tag color='orange'>Paused</Tag>*/}
                                {/*teamsync.user_id._id == this.props.user_now._id && !teamsync.isShared && (
                                  <Button onClick={(e) => this.handleEdit(teamsync._id, e)} size='small'>
                                    Edit
                                  </Button>
                                )*/}
                              </>
                            }
                            hoverable='true'
                            // bordered={false}
                            style={{
                              maxHeight: "170px",
                              minHeight: "170px",
                              // border: localStorage.getItem("theme") == "default" && "1px solid #d9d9d9",
                              // width: "100%",
                            }}
                            // size='small'
                          >
                            {/*teamsync.standupscheduleType && teamsync.standupscheduleType == "recurring" && (
                              <>
                                {" "}
                                <ClockCircleOutlined />
                                <Text type='secondary' style={{ paddingLeft: "8px" }}>
                                  {this.weekdays(teamsync)}{" "}
                                  {teamsync.timezone_type == "custom_timezone" ? this.convertToTZ(teamsync) : teamsync.time_at}
                                </Text>
                                <br />{" "}
                              </>
                            )*/}
                            {/*
                            <UserOutlined />
                            <Text type='secondary' style={{ paddingLeft: "8px" }}>
                              {teamsync.user_id.name}
                            </Text>
                            */}
                            {teamsync.admins[0] &&<><CrownOutlined style={{ marginRight: 8, opacity: 0.5 }}/>
                            <Text type="secondary">
                              {(teamsync.admins[0].displayName||teamsync.admins[0].name) + (teamsync.admins.length>1?(" & "+((teamsync.admins.length)-1)+" others"):"")}
                            </Text>
                            <br /></>}
                            <TeamOutlined style={{ marginRight: 8, opacity: 0.5 }}/>
                            <Text type="secondary">{ teamsync.selectedMembers&&teamsync.selectedMembers.length + " participants"}</Text>
                            <br />
                            <SlackOutlined style={{ marginRight: 8, opacity: 0.5 }} />
                            <Text type="secondary">
                              {teamsync.reportChannels&&teamsync.reportChannels.length>0?"Reporting to #"+teamsync.reportChannels[0].name: teamsync.report_members && teamsync.report_members.length>0? "Reporting to @"+(teamsync.report_members[0].displayName ||teamsync.report_members[0].name) : "" }
                              {teamsync.reportChannels && teamsync.report_members&& (teamsync.reportChannels.length+teamsync.report_members.length-1)>0?(" & "+(teamsync.reportChannels.length+teamsync.report_members.length-1)+" other channels"):""}
                            </Text>
                            <br />
                            {/* <br />
                            <AppstoreOutlined />
                            <span style={{ paddingLeft: "8px" }}>
                              {teamsync.standuptype == "dailystandup"
                                ? "Daily Standup"
                                : "Retrospective"}
                            </span> */}
                          </Card>
                        </a>
                      </Col>
                      
                    );
                  })
                }
                </Row>
                ) : (
                  <Row gutter={[16, 16]} style={tab === 'integrations' ? { width: "100%", maxWidth: 1000 } : {}}>
                  <Result
                    style={{ width: "94%" }}
                    status='404'
                    subTitle={
                      <span>
                        <h2 style={{ padding: 0 }}>You got no Check-ins yet!</h2>
                        <span>Create new Check-in</span> <br />
                        <Button style={{ marginTop: "10px" }} icon={<AppstoreOutlined />} onClick={() => this.onTabChange("templates")}>
                          Check-in Templates
                        </Button>
                      </span>
                    }
                  />
                  </Row>
                )}</>
              ) : this.state.tab == "templates" ? (
                <>
                {/*<Row gutter={[16, 16]} style={tab === 'integrations' ? { width: "100%", maxWidth: 1000 } : {}}>*/}
                {/*<div style={{marginBottom:"32px"}}>*/}
                
                <TeamSyncTemplates handleTemplateSelect={(value) => this.handleTemplateSelect(value)} from='page' />
                {/*</div>*/}
               </>
              ) : this.state.tab == "global_insights" ? (
                <Row gutter={[16, 16]} style={tab === 'integrations' ? { width: "100%", maxWidth: 1000 } : {}}>
                <Result style={{ width: "100%", marginTop: "10%" }} title='Coming Soon' />
                </Row>
              ) : this.state.tab == "integrations" ? (
                <Row gutter={[16, 16]} style={tab === 'integrations' ? { width: "100%", maxWidth: 1000 } : {}}>
                <CheckinIntegrations handleIntegrationSelection ={this.handleIntegrationSelection} integrationPage={this.state.integrationPage} />
                </Row>
              ) : (
                ""
              )}
          
          </Content>
        ) : (
          <Content
            style={{
              padding: "32px 100px 0px",
              height: "100vh",
              // background: "#ffffff"
              // background: localStorage.getItem("theme") == "default" ? "#ffffff" : "rgba(15,15,15)",
            }}
          >
            <Spin style={{ marginTop: "30vh", marginLeft: "50%" }} />
          </Content>
        )}
        {/* <Modal
          visible={this.state.newStandupModalVisible}
          title='Create Standup in Slack'
          onOk={this.goToSlackAppHome}
          onCancel={this.toggleNewStandupModal}
          okText={
            <span>
              <SlackOutlined />
              <span> Go to Slack</span>
            </span>
          }
        >
          This action will direct you to your Slack workspace where you can
          create a new Standup. Once you reach Troopr Assistant app in Slack,
          click on the "Home" Tab (if you are not there already) and select "New
          Standup"
        </Modal> */}

  {this.state.newStandupModalVisible && <CreateTeamsyncModal
          newStandupModalVisible={this.state.newStandupModalVisible}
          modalToggle={this.toggleNewStandupModal}
          edit={this.state.edit}
          editTeamSyncId={this.state.editTeamSyncId}
          selectedTeamSyncForEdit={this.state.selectedTeamSyncForEdit}
          standuptype={this.state.standuptype}
          // https://stackoverflow.com/questions/37949981/call-child-method-from-parent
          setClick={(click) => (this.clickChild = click)}
          key= '1'

          //whenever you add something here check in sidenavebar,standupReport,dashboard files too
        />}
      </Layout>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  teamSync: state.skills.currentteamsync,
  teamSyncs: state.skills.userTeamSyncs,
  skills: state.skills.skills,
  assistant: state.skills.team,
  user_now: state.common_reducer.user,
  workspace: state.common_reducer.workspace,
  projectTeamSyncInstance: state.skills.projectTeamSyncInstance,
  recentTeamsyncs: state.skills.recentTeamsyncs,
  currentSkillUser: state.skills.currentSkillUser
});
export default withRouter(
  connect(mapStateToProps, {
    SkillsAction,
    getUsersSelectedTeamSync,
    getAssisantSkills,
    getUserTeamSync,
    getProjectTeamSyncInstance,
    recentCheckins
  })(MyStandups)
);

// getCheckInList = () => {
//   return (
//     <Row gutter={[16, 16]} style={{ margin: "auto", width: "30vw" }}>
//       <Col span={24}>
//         <Card
//           hoverable={true}
//           title='Standup'
//           extra={
//             <Button onClick={() => this.handleTemplateSelect("dailystandup")}>
//               Choose
//             </Button>
//           }
//           onClick={() => this.handleTemplateSelect("dailystandup")}
//         >
//           Daily team meeting for quick status update
//         </Card>
//       </Col>
//       <Col span={24}>
//         <Card
//           hoverable={true}
//           title='Retrospective'
//           extra={
//             <Button
//               onClick={() => this.handleTemplateSelect("retrospective")}
//             >
//               Choose
//             </Button>
//           }
//           onClick={() => this.handleTemplateSelect("retrospective")}
//         >
//           End of Project / Sprint meeting to self inspect and plan for future
//           improvements
//         </Card>
//       </Col>
//     </Row>
//   );
// };
