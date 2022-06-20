import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  Modal,
  Select,
  Input,
  Button,
  message,
  Tag,
  Form,
  Alert,
} from "antd";
import { answerTeamSync, getJiraUserActivity } from "../skills_action";

import "./createTeamsyncModalStyles.css";
import _ from "lodash";
import moment from "moment-timezone";

const { Option } = Select;
const { TextArea } = Input;

class TeamSyncAnswerModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      answerModalVisible: false,
      progress_report: [],
      errors: {},
      usermood: null,
      progressreportReady: false,
      loading: false,
      nextAnswerModalVisible:false
    };
  }

  async componentDidMount() {
    // console.log("pro team ins", this.props.projectTeamSyncInstance);
    //console.log("In teamSyncAnswerModal",this.props.userTeamSync)
    await this.getProgressReport();
    let url = window.location.href.split("/")[8];
    if (url && url == "answer") this.setState({ answerModalVisible: true });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.answerModalVisible != this.state.answerModalVisible) {
      this.getProgressReport();
    }
  }

  getProgressReport = () => {
    const { projectTeamSyncInstance, instanceResponses, user_now } = this.props;
    if (this.state.answerModalVisible) {
      let progress_report = [];
      let userResponse = instanceResponses.find(
        (res) => res.user_id && res.user_id._id == user_now._id
      );
      if (userResponse && userResponse.progress_report) {
        userResponse.progress_report.forEach((report) => {
          // progress_report.push({
          //   question: {
          //     id: report.question.id._id
          //       ? report.question.id._id
          //       : report.question.id,
          //   },
          //   answer: {
          //     plain_text:
          //       report.answer && report.answer.plain_text
          //         ? report.answer.plain_text
          //         : "",
          //   },
          // });
          const data = {
            question: {
              id: report.question.id._id
                ? report.question.id._id
                : report.question.id,
            },
            answer: {
              plain_text:
                report.answer && report.answer.plain_text
                  ? report.answer.plain_text
                  : "",
            },
          }
          if (this.props.userTeamSync.standuptype === 'planning_poker' && report.answer) data.answer.desc = report.answer.desc
          progress_report.push(data)
        });
        this.setState({ usermood: userResponse.usermood });
      } else {
        projectTeamSyncInstance.questions.forEach((question) => {
          progress_report.push({
            question: { id: question._id },
            answer: { plain_text: "" },
          });
        });
      }
      this.setState({ progress_report, progressreportReady: true });
    }
  };

  answerModalToggle = () => {
    this.setState({ answerModalVisible: !this.state.answerModalVisible });
  };



  onAnswerChange = (event, index) => {
    let progress_report = this.state.progress_report;
    let value = event.target.value;
    progress_report[index].answer.plain_text = value;
    this.setState({ progress_report }, () => {
      if (this.state.errors.answer && value.length > 0) {
        let errors = this.state.errors;
        errors.answer = false;
        this.setState({ errors,loading:false });
      }
    });
  };

  onEstimateChange = (value,index) => {
    const progress_report = [...this.state.progress_report]
    if(progress_report[index].answer) progress_report[index].answer.plain_text = value
    else progress_report[index].answer = {plain_text : value}

    let errors = this.state.errors

    if(errors.estimate){
      errors.estimate[index] = {error : false}
    }

    this.setState({progress_report})
  }

  OnReasonChange = (event,index) => {
    const value = event.target.value
    const progress_report = [...this.state.progress_report]
    if(progress_report[index].answer) progress_report[index].answer.desc = value
    else progress_report[index].answer = {desc : value}
    this.setState({progress_report})
  }

  handleMoodChange = (value) => {
    this.setState({ usermood: value });
  };

  getJiraIds = (answer) => {
    let text = answer;
    // const jira_Id_regex = /\d+-[A-Z]+(?!-?[a-zA-Z]{1,10})/g
    const jira_Id_regex = /\d+-([0-9]+[A-Z]|[A-Z])+(?!-?[0-9a-zA-Z]{1,10})/gi;
    text = text.split("").reverse().join("");
    let jiraIssueKeys = text.match(jira_Id_regex);

    if (jiraIssueKeys && jiraIssueKeys.length > 0) {
      for (var i = 0; i < jiraIssueKeys.length; i++) {
        jiraIssueKeys[i] = jiraIssueKeys[i].split("").reverse().join("");
      }
      return jiraIssueKeys;
    } else {
      return [];
    }
  };

  onSubmit = () => {
    const { progress_report,usermood } = this.state;
    // this.setState({ loading: true });
    this.setState({ loading: true });
    let errors = {};
    if(this.props.userTeamSync.standuptype === 'planning_poker'){
        errors.estimate = progress_report.map((data,index) => {
          if(data.answer.plain_text) return {error:false}
          else {
            this.setState({loading:false})
            return {error:true}
          }
        })
    }else {
      let check = progress_report.filter(
        (val) => val.answer.plain_text.trim().length > 0
      );
      if(this.props.userTeamSync.standuptype == "team_mood_standup"){
        if(!usermood){
          errors.answer = true;
          this.setState({ loading: false });
        }
      }
      else if (check.length == 0) {
        errors.answer = true;
      this.setState({ loading: false });
      }
    }

    if(errors.estimate){
      const found = errors.estimate.find(data => data.error)
      if(!found) delete errors.estimate
    }
    this.setState(
      { errors },
      () => _.isEmpty(this.state.errors) && this.onSubmitAnswer()
    );
  };

  onSubmitAnswer = () => {
    // console.info("I'm a ************* Starboy!");

    const { userTeamSync, projectTeamSyncInstance,user_now } = this.props;
    // console.info("standup type: ", userTeamSync.standuptype);
    const { progress_report, usermood } = this.state;
    let data = {
      progress_report,
      // jiraunfurldata: ["ST-891"],
      //to do
      //userActivitylog
    };

    // let jiraunfurldata = [];
    // progress_report.forEach((report) => {
    //   // jiraunfurldata.push(this.getJiraIds(report.answer.plain_text));
    //   jiraunfurldata = [
    //     ...jiraunfurldata,
    //     ...this.getJiraIds(report.answer.plain_text),
    //   ];
    // });
    // console.log("jira ids", jiraunfurldata);
    let jiraSkill =
      this.props.skills &&
      this.props.skills.find((skill) => skill.name == "Jira");
    if (jiraSkill) data.isJiraConnected = jiraSkill.skill_metadata.linked;

    if (userTeamSync.standuptype == "dailystandup" || userTeamSync.standuptype == "Daily Standup" || userTeamSync.standuptype=="team_mood_standup") data.usermood = usermood;

    if (!(["team_mood_standup", "retrospective"].includes(userTeamSync.standuptype))) {
      if(jiraSkill.skill_metadata.linked){
        this.props
        .getJiraUserActivity(
          this.props.match.params.wId,
          user_now._id
        )
        .then((res) => {
          if (res.success) {
            data.userActivityLog = { jiraLogs: res.userActivity };
            // this.props
            //   .answerTeamSync(projectTeamSyncInstance._id, data)
            //   .then((res) => {
            //     if (res.data.success) {
            //       this.handleCancel();
            //     }
            //   });
          }else{
            data.userActivityLog = { jiraLogs: [] };
          }
          this.addAnswer(data,projectTeamSyncInstance)
        });
      }else this.addAnswer(data,projectTeamSyncInstance)
    } else {
      // this.props
      //   .answerTeamSync(projectTeamSyncInstance._id, data)
      //   .then((res) => {
      //     if (res.data.success) {
      //       this.handleCancel();
      //     }
      //   });
      this.addAnswer(data,projectTeamSyncInstance)
    }
  };

  addAnswer = (data,projectTeamSyncInstance) => {
    const { answerTeamSync } = this.props;
    answerTeamSync(projectTeamSyncInstance._id, data).then((res) => {
      if (res.data.success) {
        this.handleCancel();
      }
    });
  };

  onSkip = () => {

    const { projectTeamSyncInstance } = this.props;

    let data = { progress_report: [], isSkipped: true };
    let jiraSkill = (this.props.skills &&
      this.props.skills.find((skill) => skill.name == "Jira"));
      
    if (jiraSkill) data.isJiraConnected = jiraSkill.skill_metadata.linked;
    this.props.answerTeamSync(projectTeamSyncInstance._id, data).then((res) => {
      // console.log("res.data -> ", res.data);
      if(res.data.success){
        message.success(
          "Check-in skipped. You can still answer if you choose to later by clicking on Answer button.",
          5
        );
        // window.location.reload();
      }else{
        message.error("Failed to skip check-in");
      }
    });
  };

  handleCancel = () => {
    this.answerModalToggle();
    this.setState({
      progress_report: [],
      errors: {},
      usermood: null,
      progressreportReady: false,
      loading: false,
    });
  };

  getPlanningPokerFields = () => {
    const {projectTeamSyncInstance} = this.props
    const {progress_report,errors} = this.state
    return(        
    // <<<<< Plnning Poker >>>>>
    this.state.progressreportReady && 
    projectTeamSyncInstance.questions.map((question,i) => {
      /*
      let url=""
      let split_question_meta_desc
      if(question.meta.desc){
        //console.info(question.meta.desc)
        split_question_meta_desc=question.meta.desc.split(":")
        url=split_question_meta_desc[1]+":"+split_question_meta_desc[2]
      }
      */
      return (
        <div>
          <Tag style={{color:'orange'}}>Issue {i+1} of {projectTeamSyncInstance.questions.length}</Tag> <br />
          <span style={{display:'inline-block', marginBottom:'5px' ,fontWeight: 'bold'}}><a href={question.meta.url} target='_blank'>{question.meta.key}: </a>{question.question_text}</span><br />
          {/* <span style={{display:'inline-block', marginBottom:!question.meta.desc && '5px' ,fontWeight: 'bold'}}><a href={question.meta.url} target='_blank'>{question.meta.key} : </a>{question.question_text}</span><br /> */}
          
          {/*question.meta.desc && <span style={{display:'inline-block', marginBottom:'5px' }}>{split_question_meta_desc[0]+": "}<a href={url} target='_blank'>{url}</a><br /></span>*/} 
          {question.meta.desc && <><span style={{display:'inline-block', marginBottom:'5px' }}>{question.meta.desc}</span><br /></>} 


          <span style={{fontWeight:'bold'}}>Choose Estimate</span><br/>
          <Select value={progress_report[i].answer.plain_text || null} placeholder='Select a estimate' style={{marginBottom: '10px'}} onChange={(value) => this.onEstimateChange(value,i)}>
          {projectTeamSyncInstance.teamSync_metdata.story_points_options.split(',').map(option => {
            return <Option key={option} value={option}>{option}</Option>
          })}
          </Select><br/>
          {errors.estimate && errors.estimate[i].error && <div className='error-text'style={{marginTop:'-10px'}}>*Question is required<br/></div>}
          <span style={{fontWeight:'bold'}}>Reason</span> (optional)<br/>
          <Input value={progress_report[i].answer.desc || ''} onChange={(e) => this.OnReasonChange(e,i)} placeholder="Write a reason estimate" /><br/><br/>
        </div>
      )
    }))
  }

  render() {
    const {
      userTeamSync,
      projectTeamSyncInstance,
      instanceResponses,
      user_now,
    } = this.props;

    const ModalBodyStyle = {maxHeight: "70vh",wordBreak:'break-word', overflowY: "scroll",overflowX:'hidden'}

    let isAnswered = instanceResponses.find(
      (res) => res.user_id && res.user_id._id == user_now._id
    );
if(!isAnswered){
  isAnswered={}
}
    let currentTime = moment();
    const waitTime = userTeamSync && userTeamSync.wait_time;
    const instanceTime =projectTeamSyncInstance && projectTeamSyncInstance.created_at;
    let teamsyncreporttime = moment(instanceTime).add(waitTime, "seconds");
    let isAfter = currentTime.isAfter(teamsyncreporttime);
    let allowLateAns = true;
    let allowLateUpdate = true;
    let allowCurrentAns = true;
    let allowCurrentUpdate = true;
   
    if('allowSubmissionAfterWaitTime' in userTeamSync){
      allowLateAns = userTeamSync.allowSubmissionAfterWaitTime;
    }
    if('allowUpdateAfterWaitTime' in userTeamSync){
      allowLateUpdate = userTeamSync.allowUpdateAfterWaitTime;
    }
    if(userTeamSync&&(userTeamSync.standuptype==="retrospective" || userTeamSync.standuptype==="planning_poker")){
      allowLateAns=false
      allowLateUpdate=false
    }
    if(isAfter && !allowLateAns){
      allowCurrentAns = false;
    }

    if(isAfter && !allowLateUpdate){
      allowCurrentUpdate = false;
    }

    // let skipAllowed = (userTeamSync.enableSkip &&
    //   !isAnswered.isHoliday &&
    //   !isAnswered.isSkipped);

    // console.log("skipAllowed -> ", skipAllowed);
    // console.log("allowCurrentAns -> ",allowCurrentAns);
    // console.log("!isAnswered.isHoliday -> ", !(isAnswered.isHoliday));
    // let x = (allowCurrentUpdate && isAnswered && isAnswered.status && isAnswered.status === "replied" && (!isAnswered.isSkipped && isAnswered.progress_report));
    // console.log("x -> ",x);

    return (
      <Fragment>
     { (allowCurrentUpdate && isAnswered && isAnswered.status && isAnswered.status === "replied" && (!isAnswered.isSkipped && isAnswered.progress_report)) ? (
        <Fragment>
          {!isAnswered.isHoliday && (
            <Button type='primary' onClick={() => this.answerModalToggle()}>
              {(!isAnswered.isSkipped && isAnswered.progress_report) &&
                "Update Answer"}
            </Button>
          )}
          {/* {userTeamSync.enableSkip &&
            !isAnswered.isHoliday &&
            !isAnswered.isSkipped && (
              <Button style={{ marginLeft: "16px" }} onClick={this.onSkip}>
                Skip
              </Button>
            )} */}
          <Modal
            bodyStyle={ ModalBodyStyle }
            visible={this.state.answerModalVisible}
            onCancel={this.handleCancel}
            title={userTeamSync.name}
            footer={[
              <>
                <Button onClick={this.handleCancel}>Cancel</Button>
                <Button
                  key='submit'
                  type='primary'
                  loading={this.state.loading}
                  onClick={this.onSubmit}
                >
                  Submit
                </Button>
              </>,
            ]}
            centered
          >
            <Form className='answer-modal'>
              {this.state.errors.answer && (
                <Alert
                  type='error'
                  message={
                    <span className='empty-alert-text'>
                      Answer can't be empty. Answer atleast one question.
                    </span>
                  }
                  style={{ textAlign: "center" }}
                />
              )}
              {(userTeamSync.standuptype == "dailystandup" || userTeamSync.standuptype == "Daily Standup" || userTeamSync.standuptype=="team_mood_standup") && 
                userTeamSync.moodquestion !== "none" && userTeamSync.moodquestion !== "None" &&  (
                  <Form.Item>
                    <div className='question-text' style={{ marginTop: "0px" }}>
                      {userTeamSync.moodquestion}{" "}
                      {(userTeamSync.standuptype=="dailystandup" || userTeamSync.standuptype=="Daily Standup" ) && <span className='optional-text'>(optional)</span>}
                    </div>
                    {userTeamSync.customEmoji&&userTeamSync.customEmoji.length!=0?(
                      <Select
                      placeholder='Select'
                      onChange={this.handleMoodChange}
                      value={this.state.usermood}
                      >
                      <Option value={1} key={1}>
                        {userTeamSync.customEmoji[0].emoji+ " " + userTeamSync.customEmoji[0].text }
                      </Option>
                        <Option value={2} key={2}>
                        {userTeamSync.customEmoji[1].emoji+ " " + userTeamSync.customEmoji[1].text }
                      </Option>
                        <Option value={3} key={3}>
                        {userTeamSync.customEmoji[2].emoji+ " " + userTeamSync.customEmoji[2].text }
                      </Option>
                        <Option value={4} key={4}>
                        {userTeamSync.customEmoji[3].emoji+ " " + userTeamSync.customEmoji[3].text }
                      </Option>
                        <Option value={5} key={5}>
                        {userTeamSync.customEmoji[4].emoji+ " " + userTeamSync.customEmoji[4].text }
                      </Option>
                  
                      </Select> 
                
                    ):userTeamSync.standuptype=="team_mood_standup"?(
                      <Select
                      placeholder='Select'
                      onChange={this.handleMoodChange}
                      value={this.state.usermood}
                    >
                      <Option value={1} key={1}>
                        🤩 Rad
                      </Option>
                      <Option value={2} key={2}>
                        🙂 Good
                      </Option>
                      <Option value={3} key={3}>
                        😐 Meh
                      </Option>
                      <Option value={4} key={4}>
                        🥵 Exhausted
                      </Option>
                      <Option value={5} key={5}>
                        🙁 Awful
                      </Option>
                    </Select>
                    ):(
                      <Select
                        placeholder='Select'
                        onChange={this.handleMoodChange}
                        value={this.state.usermood}
                      >
                        <Option value={1} key={1}>
                          🤩 Excellent
                      </Option>
                        <Option value={2} key={2}>
                          🙂 Good
                      </Option>
                        <Option value={3} key={3}>
                          😐 Average
                      </Option>
                        <Option value={4} key={4}>
                          🥵 Exhausted
                      </Option>
                        <Option value={5} key={5}>
                          🙁 Bad
                      </Option>
                      </Select>
                    )
                      }
                  </Form.Item>
                )}
            {userTeamSync.standuptype === 'planning_poker' ? 
              this.getPlanningPokerFields()
            :
              this.state.progressreportReady &&
                projectTeamSyncInstance.questions.map((question, index) => {
                  return (
                    <Form.Item
                    // rules={[{required:true}]}
                    >
                      <div
                        className='question-text'
                        style={{
                          marginTop:
                            userTeamSync.standuptype != "dailystandup" &&
                            userTeamSync.standuptype != "Daily Standup" &&
                            userTeamSync.standuptype != "team_mood_standup" &&
                            index == 0 &&
                            "0px",
                        }}
                      >
                        {question.question_text}{" "}
                        <span className='optional-text'>(optional)</span>
                      </div>
                      <TextArea
                        // autoFocus={index == 0 && true}
                        placeholder='Write something'
                        value={
                          this.state.progress_report[index].answer.plain_text
                        }
                        onChange={(event) => this.onAnswerChange(event, index)}
                        rows={3}
                      />
                    </Form.Item>
                  );
                })}

              {/* {members && members.length > 0 && (
              <Form.Item>
                <div className='question-text'>
                  Mention Users in Report{" "}
                  <span className='optional-text'>(optional)</span>
                </div>
                <Select
                  onChange={this.handleParticipantChange}
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  mode='multiple'
                  placeholder='Mention Users in Report'
                  allowClear={true}
                  className='Select'
                  // value={this.state.participants}
                >
                  {members &&
                    members.map((mem) => {
                      return (
                        <Option
                          key={mem.user_id._id}
                          value={mem.user_id._id}
                          label={mem.user_id._id}
                        >
                          {mem.user_id.name}
                        </Option>
                      );
                    })}
                </Select>
              </Form.Item>
            )} */}
            </Form>
          </Modal>
        </Fragment>
        
      ) : (allowCurrentAns && (
          <Fragment>
            {!isAnswered.isHoliday && (
              <Button type='primary' onClick={() => this.answerModalToggle()}>
                Answer
              </Button>
            )}
            {userTeamSync.standuptype !== "team_mood_standup" && userTeamSync.standuptype !== 'planning_poker' && userTeamSync.enableSkip &&
              !isAnswered.isHoliday &&
              !isAnswered.isSkipped && (
                <Button style={{ marginLeft: "16px" }} onClick={this.onSkip}>
                  Skip
                </Button>
              )}
            <Modal
              bodyStyle={ ModalBodyStyle }
              visible={this.state.answerModalVisible}
              // visible={true}
              onCancel={this.handleCancel}
              title={userTeamSync.name}
              footer={[
                <>
                  <Button onClick={this.handleCancel}>Cancel</Button>
                  <Button
                    key='submit'
                    type='primary'
                    loading={this.state.loading}
                    onClick={this.onSubmit}
                  >
                    Submit
                </Button>
                </>,
              ]}
              centered
            >
              <Form className='answer-modal'>
                {this.state.errors.answer && (
                  <Alert
                    type='error'
                    message={
                      <span className='empty-alert-text'>
                        Answer can't be empty. Answer atleast one question.
                    </span>
                    }
                    style={{ textAlign: "center" }}
                  />
                )}
                {(userTeamSync.standuptype == "dailystandup" || userTeamSync.standuptype == "Daily Standup" || userTeamSync.standuptype=="team_mood_standup") &&
                  userTeamSync.moodquestion !== "none" && userTeamSync.moodquestion !== "None" && (
                    <Form.Item>
                      <div className='question-text' style={{ marginTop: "0px" }}>
                        {userTeamSync.moodquestion}{" "}
                        {(userTeamSync.standuptype=="dailystandup" || userTeamSync.standuptype=="Daily Standup" ) &&<span className='optional-text'>(optional)</span>}
                      </div>
                      {userTeamSync.customEmoji&&userTeamSync.customEmoji.length!=0?(
                        <Select
                        placeholder='Select'
                        onChange={this.handleMoodChange}
                        value={this.state.usermood}
                      >
                        <Option value={1} key={1}>
                          {userTeamSync.customEmoji[0].emoji+ " " + userTeamSync.customEmoji[0].text }
                      </Option>
                        <Option value={2} key={2}>
                        {userTeamSync.customEmoji[1].emoji+ " " + userTeamSync.customEmoji[1].text }
                      </Option>
                        <Option value={3} key={3}>
                        {userTeamSync.customEmoji[2].emoji+ " " + userTeamSync.customEmoji[2].text }
                      </Option>
                        <Option value={4} key={4}>
                        {userTeamSync.customEmoji[3].emoji+ " " + userTeamSync.customEmoji[3].text }
                      </Option>
                        <Option value={5} key={5}>
                        {userTeamSync.customEmoji[4].emoji+ " " + userTeamSync.customEmoji[4].text }
                      </Option>
                      </Select>
                      )
                    : userTeamSync.standuptype=="team_mood_standup"?(
                      <Select
                      placeholder='Select'
                      onChange={this.handleMoodChange}
                      value={this.state.usermood}
                    >
                      <Option value={1} key={1}>
                        🤩 Rad
                      </Option>
                      <Option value={2} key={2}>
                        🙂 Good
                      </Option>
                      <Option value={3} key={3}>
                        😐 Meh
                      </Option>
                      <Option value={4} key={4}>
                        🥵 Exhausted
                      </Option>
                      <Option value={5} key={5}>
                        🙁 Awful
                      </Option>
                    </Select>
                    )
                  :(<Select
                    placeholder='Select'
                    onChange={this.handleMoodChange}
                    value={this.state.usermood}
                  >
                    <Option value={1} key={1}>
                      🤩 Excellent
                  </Option>
                    <Option value={2} key={2}>
                      🙂 Good
                  </Option>
                    <Option value={3} key={3}>
                      😐 Average
                  </Option>
                    <Option value={4} key={4}>
                      🥵 Exhausted
                  </Option>
                    <Option value={5} key={5}>
                      🙁 Bad
                  </Option>
                  </Select>
                  )}
                    </Form.Item>
                  )}
                {userTeamSync.standuptype === 'planning_poker' ? 

                this.getPlanningPokerFields()
                
                : this.state.progressreportReady &&
                  projectTeamSyncInstance.questions.map((question, index) => {
                    return (
                      <Form.Item
                      // rules={[{required:true}]}
                      >
                        <div
                          className='question-text'
                          style={{
                            marginTop:
                              userTeamSync.standuptype != "dailystandup" &&
                              userTeamSync.standuptype != "Daily Standup" && 
                              userTeamSync.standuptype!= "team_mood_standup" &&
                              index == 0 &&
                              "0px",
                          }}
                        >
                          {question.question_text}{" "}
                          <span className='optional-text'>(optional)</span>
                        </div>
                        <TextArea
                          // autoFocus={index == 0 && true}
                          placeholder='Write something'
                          value={this.state.progress_report[index].answer.plain_text}
                          onChange={(event) => this.onAnswerChange(event, index)}
                          rows={3}
                        />
                      </Form.Item>
                    );
                  })}

                {/* {members && members.length > 0 && (
              <Form.Item>
                <div className='question-text'>
                  Mention Users in Report{" "}
                  <span className='optional-text'>(optional)</span>
                </div>
                <Select
                  onChange={this.handleParticipantChange}
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  mode='multiple'
                  placeholder='Mention Users in Report'
                  allowClear={true}
                  className='Select'
                  // value={this.state.participants}
                >
                  {members &&
                    members.map((mem) => {
                      return (
                        <Option
                          key={mem.user_id._id}
                          value={mem.user_id._id}
                          label={mem.user_id._id}
                        >
                          {mem.user_id.name}
                        </Option>
                      );
                    })}
                </Select>
              </Form.Item>
            )} */}
              </Form>
            </Modal>
          </Fragment>
      ))}

 
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  user_now: state.common_reducer.user,
  members: state.skills.members,
  userTeamSync: state.skills.userTeamSync,
  workspace: state.common_reducer.workspace,
  skills: state.skills.skills,
  instanceResponses: state.skills.instanceResponses,
  projectTeamSyncInstance: state.skills.projectTeamSyncInstance,
  nextInstanceNotAvailable: state.skills.nextInstanceNotAvailable,
});
export default withRouter(
  connect(mapStateToProps, {
    answerTeamSync,
    getJiraUserActivity,
  })(TeamSyncAnswerModal)
);
