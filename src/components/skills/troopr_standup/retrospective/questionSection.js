import React, { Component } from 'react'
import { connect } from "react-redux"
import { List, Popover, Avatar, message, Typography, Button, Modal, Input, Select, Divider, Row, Col, Tooltip, Popconfirm } from 'antd';
import { LikeFilled, MessageOutlined, LinkOutlined, CheckOutlined, LikeOutlined, CommentOutlined, FolderOpenOutlined, DisconnectOutlined } from "@ant-design/icons"
import { addLikeToStandup, createGrouping, removeGroupingForDuplicate, removeGroupingForMaster, addActionItem, deleteActionItem } from "../../skills_action"
import { withRouter } from "react-router-dom"
import RetroCommentModal from "./retrocommentmodel"
import "./retrospective.css";

const { Text } = Typography;
const { Option } = Select;

class QuestionSection extends Component {

  constructor(props) {
    super(props)

    this.state = {
      showModal: false,
      comments: [],
      data: {},
      actionItemModalVisible: false,
      actionItemsTitle: "",
      currentTitle: "",
      actionItemsTags: [],
      actionItemsData: [],
      currentQuestionId: "",
      currentInstaceId: "",
      currentTeamSyncId: "",
      currentReporterId: "",
      visible_addgroup: false,
      isGroupingOptionSelected: false,
      targetAnsUserId: "",
      targetAnsReportId: "",
      targetAnsQuestionId: "",
      targetTitle: "",
      ungroupModalVisible : false,
      currentItem: {},
      showGroupsModalVisible : false,
      groupingData : []
    }
  }

  componentDidMount() {
    this.setState({
      currentInstaceId: this.props.match.params.instanceId ? this.props.match.params.instanceId : "",
      currentTeamSyncId: this.props.match.params.tId
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps == undefined) {
      return false;
    }

    if (this.state.currentTeamSyncId != this.props.match.params.tId) {
      this.setState({ currentTeamSyncId: this.props.match.params.tId });
    }
  }

  truncateString = (input, len) => {
    if (input.length > len) {
      let truncatedString = input.slice(0, len - 3);
      let str = truncatedString + "...";
      return str;
    } else {
      return input;
    }
  }

  _getInitials(name) {
    let nameArr = name && name
      .trim()
      .replace(/\s+/g, ' ') //remove extra spaces
      .split(" ")

    if (nameArr && nameArr.length > 1)
      return (nameArr[0][0] + nameArr[1][0]).toUpperCase()
    else
      return nameArr[0].slice(0, 2).toUpperCase()
  }

  IconText = (type, text, isCurrentUserVoted, item) => {
    return (
      <Popover content={type ? type : ""}>
        <Button onClick={() => this.listAction(type, text, isCurrentUserVoted, item)}
          style={{ marginRight: 4 }}
          //  icon=
          size="small"
        >
          {type === "like" ? <LikeOutlined /> : <CommentOutlined />}
          {" "}
          {text ? text : ""}{" "}
        </Button>
      </Popover>
    )
  };

  listAction = async (type, text, isCurrentUserVoted, item) => {
    try {
      let data = {
        user_id: this.props.user && this.props.user._id,
        workspace_id: this.props.match.params.wId,
        questionid: item.questionid,
        name: this.props.user && (this.props.user.displayName ||this.props.user.name),
        isCurrentUserVoted,
        reportid: item && item.report && item.report._id
      }
      if (type === "like") {
        data.type = "votes"
        this.props.addLikeToStandup(data).then(res => {

          if (res && res.data && res.data.permissionerror) {
            message.error(res.data.error);
          }

        })
      }
      else if (type == "comment") {
        this.setState({ showModal: true, comments: item.comments, data })
      }


    } catch (err) {
      console.error("some error occurred here -> ", err);
    }

  }
  closeModal = () => {
    this.setState({ showModal: false, comments: [], data: {} })
  }

  addAction = (item, isParticipant, isTeamSyncAdmin) => {

    //only allow team sync admin to perform this action
    if (!(isTeamSyncAdmin)) {
      message.error("Only check-in administrators can perform this action");
      return;
    }

    let ans = item.answer ? item.answer : "";
    let qId = item.questionid ? item.questionid : "";
    this.setState({
      currentItem: item,
      currentTitle : ans,
      actionItemsTitle: ans,
      actionItemModalVisible: true,
    });
  }

  handleActionItemSubmit = async () => {
    try {

      if (this.state.currentTitle.length == 0) {
        message.error("Please input title");
        return;
      }
      
      let teamsyncId = this.props.match.params.tId;
      
      let instanceId = this.props.answers && this.props.answers[0].report && this.props.answers[0].report.question_instance_id && this.props.answers[0].report.question_instance_id._id;
      
      let userId = this.props.user._id;

      let { currentItem } = this.state;

      let reqData = {
        reporter: currentItem && currentItem.report && currentItem.report._id,
        title: this.state.currentTitle,
        tags: [],
        teamsync_instance_id: instanceId,
        question_id: currentItem && currentItem.questionid,
        teamsync_id: teamsyncId,
        created_by: userId
      }

      this.setState({ actionItemModalVisible: false, currentItem: {}, currentTitle: "", actionItemsTitle: "" });

      this.props.addActionItem(reqData).then(res => {
        if(res.data.success){
          message.success("Action Item Added");
        }else{
          message.error("Error");
        }
      }).catch(err => {
        message.error("Error");
        console.error(err);
      })

    } catch (err) {
      message.error("error creating action item");
      console.error("some error occurred -> ", err);
    }
  }

  handleChange = (values) => {
    this.setState({ actionItemsTags: values });
  }

  //action item deletion is performed by action item document id and user_id is not involved
  deleteActionItem = (item, isParticipant, isTeamSyncAdmin) => {
    this.setState({ actionItemModalVisible: false });
    //only allow team sync admin to perform this action
    if (!(isTeamSyncAdmin)) {
      message.error("Only check-in administrators can perform this action");
      return;
    }

    let actionItemId = item._id;

    this.props.deleteActionItem(actionItemId).then(res => {
      if(res.data.success){
        message.success("Action Item Deleted");
      }
    }).catch(err => {
      message.error("Error");
      console.error(err);
    })
  }

  getExistingActionItems = (isParticipant, isTeamSyncAdmin,sendAnonymous) => {
    let {currentItem} = this.state;
    
    let existingItemsForCurrentAns = currentItem.action_items ? currentItem.action_items : [];
  

    let theme = localStorage.getItem('theme');
    let stylex = {};

    if(theme === "default"){
      stylex = {background : "#efefef" , padding: 4, display: "flex", flexDirection: "column", marginBottom: 8 }
    }else{
      stylex = { padding: 4, display: "flex", flexDirection: "column", marginBottom: 8 }
    }

    // console.log("existingItems  -> ", existingItems);
    if (existingItemsForCurrentAns.length > 0) {
      return existingItemsForCurrentAns.map(item => (
        <div style={stylex}>
          <div >
            <Text type="secondary">{sendAnonymous?"Team Member":item.created_by && (item.created_by.displayName||item.created_by.name)} reported: {item.title}</Text>
          </div>
          <Popconfirm
            title="Are you sure delete this action item?"
            onConfirm={() => this.deleteActionItem(item, isParticipant, isTeamSyncAdmin)}
            okText="Yes"
            cancelText="No"
          >
            <a style={{ width: "50px"}} href="#">Delete</a>
          </Popconfirm>
        </div>
      )
      )
    } else {
      return (
        <div>
          <Text type="secondary">Could not find action items for this answer</Text>
        </div>
      )
    }
  }

  redirectToActionItems = () => {
    this.props.switchViewToRetroActionItems();
  }

  groupFeedbackModal = (item  ,isParticipant,  isTeamSyncAdmin) => {
    //allow only for team sync admins
    if (!(isTeamSyncAdmin)) {
      message.error("Only check-in administrators can perform this action");
      return;
    }
    

    this.setState({ currentItem : item, visible_addgroup : true});
  }

  handleGroupingOptionsSelectNew = (opt,val) => {
    let splitVal = val.value.split(".");
    this.setState({ targetAnsReportId: splitVal[0], targetAnsQuestionId: splitVal[1], targetTitle: val.children, isGroupingOptionSelected : true});
  }

  handleGroupingOptionsSelect = (opt,val) => {
    this.setState({ targetAnsUserId: val.key, targetTitle: val.children });
  }

  closeGroupingModal = () => {
    this.setState({ visible_addgroup: false, currentItem: {}, targetAnsUserId: "", targetTitle: "", isGroupingOptionSelected: false});
  }

  getGroupingOptions = (allAnswers , isParticipant, isTeamSyncAdmin) => {
    //only allow team sync admins
    if (!(isTeamSyncAdmin)) {
      return [];
    }
    let {currentItem} = this.state;
    let allResponses = this.props.instanceResponses;

    let groupingOptions = [];

    if(this.state.visible_addgroup && allResponses && currentItem && currentItem.answer && (allResponses.length > 0)){
      allResponses.forEach(response => {
        //take only those reponses whose status is replied, not skipped and not on holiday
        if (response && (response.status && response.status === "replied") && (response.isSkipped === false) && (response.isHoliday === false)) {
          response.progress_report.forEach(report => {

            //do not take current response as an option for grouping
            if (!(((report.question.id._id == currentItem.questionid) || (report.question.id == currentItem.questionid)) && ((response._id == currentItem.report._id)))) {
              if ((report.grouping_data && report.grouping_data.is_duplicate == false) && (report.answer && report.answer.plain_text)){
                groupingOptions.push({
                  answer: report.answer.plain_text,
                  responseId: response._id,
                  questionid: report.question.id._id ? report.question.id._id : report.question.id
                })
              }
            }
          })
        }
      })
    }

    if(groupingOptions.length > 0){
      return groupingOptions.map((option, index) => <Option key={index} value={option.responseId + "." + option.questionid}>{option.answer}</Option>)
    }else{
      return [];
    }
  }

  handleNewGroup = (isParticipant ,isTeamSyncAdmin) => {
    if (!(isTeamSyncAdmin)) {
      message.error("Only check-in administrators can perform this action");
      return;
    }

    let { currentItem, targetAnsReportId, targetTitle, targetAnsQuestionId } = this.state;

    if ((targetAnsReportId.length == 0) || (targetTitle.length == 0)) {
      message.error("Please select a response to group with");
      return;
    }

    let instanceId = this.props.answers && this.props.answers[0].report && this.props.answers[0].report.question_instance_id && this.props.answers[0].report.question_instance_id._id;

    this.setState({ currentItem: {}, targetAnsReportId: "", targetAnsQuestionId: "", targetTitle: "", visible_addgroup: false, isGroupingOptionSelected : false });

    let duplicateAnsData = {
      type: "duplicate",
      query_report_id: currentItem && currentItem.report && currentItem.report._id,
      target_report_id: targetAnsReportId,
      targetTitle: targetTitle,
      self_question_id: currentItem && currentItem.questionid,
      target_question_id: targetAnsQuestionId
    }

    let masterAnsData = {
      type: "master",
      query_report_id: targetAnsReportId,
      target_report_id: currentItem && currentItem.report && currentItem.report._id,
      targetTitle: currentItem && currentItem.answer,
      self_question_id: targetAnsQuestionId,
      target_question_id: currentItem && currentItem.questionid
    }

    //we do not need instance id for grouping
    this.props.createGrouping(instanceId, duplicateAnsData).then(res1 => {
      if (res1 && res1.data && res1.data.success) {
        this.props.createGrouping(instanceId, masterAnsData).then(res2 => {
          if (res2 && res2.data && res2.data.success) {
            message.success("Merged");
            //after merging is complete we need to update the state to update the transferred action items
            if (res1.data.actionItemsTransferRes && res1.data.actionItemsTransferRes.nModified && (res1.data.actionItemsTransferRes.nModified > 0)) {
            } 
          } else {
            message.error("Error");
          }
        }).catch(err => {
          message.error("Error");
          console.error(err);
        })
      }
    }).catch(error => {
      message.error("error");
      console.error(error);
    })
    
  }

  showGroupsNew = (item , isParticipant , isTeamSyncAdmin) => {
    //only allow team sync admins
    if (!(isTeamSyncAdmin)) {
      message.error("Only check-in administrators can perform this action");
      return;
    }

    let groupingData = [];

    let allInstanceResponses = this.props.instanceResponses;
    if (allInstanceResponses && allInstanceResponses.length > 0){
      allInstanceResponses.forEach(response => {
        if(response._id == item.report._id){
          response.progress_report.forEach(report => {
            if((report.question.id && report.question.id._id && report.question.id._id === item.questionid) || (report.question.id === item.questionid)){
              let titles = report.grouping_data.groupedTitles;
              if(titles.length > 0){
                titles.forEach(title => {
                  groupingData.push({
                    answer: title
                  })
                })
              }
            }
          })
        }
      })

      this.setState({ groupingData: groupingData, showGroupsModalVisible: true, currentItem: item });
    }else{
      return [];
    }
  }


  handleShowGroupsModalCancel = () => {
    this.setState({ currentItem: {}, showGroupsModalVisible: false, groupingData: []});
  }

  ungroupModal = (item , isParticipant, isTeamSyncAdmin) => {
    //only allow team sync admins
    if (!(isTeamSyncAdmin)) {
      message.error("Only check-in administrators can perform this action");
      return;
    }
    this.setState({currentItem : item , ungroupModalVisible: true});
  }
  
  getUngroupModalText = () => {
    let {currentItem} = this.state;

    return (<Text strong>This response "{currentItem && currentItem.answer}" is grouped with "{currentItem && currentItem.grouping_data && currentItem.grouping_data.groupedTitles && currentItem.grouping_data.groupedTitles[0]}"</Text>)
  }

  handleUngroupCancel = () => {
    this.setState({currentItem : {},ungroupModalVisible: false});
  }

  handleUngroupSubmit = () => {
    let {currentItem} = this.state;
    this.setState({ currentItem: {}, ungroupModalVisible: false });

    let duplicateReqData = {
      query_report_id : currentItem && currentItem.report && currentItem.report._id,
      self_question_id : currentItem && currentItem.questionid
    }

    let instanceId = this.props.answers && this.props.answers[0].report && this.props.answers[0].report.question_instance_id && this.props.answers[0].report.question_instance_id._id;

    let masterReqData = {
      duplicateReportId : "",
      duplicateTitle : "",
      query_report_id: "",
      self_question_id: ""
    }

    //we do not require instance id for ungrouping
    this.props.removeGroupingForDuplicate(instanceId, duplicateReqData).then(res1 => {
      if(res1 && res1.data && res1.data.success){
        masterReqData.duplicateReportId = res1.data.duplicateReportId;
        masterReqData.duplicateTitle = res1.data.duplicateTitle;
        masterReqData.query_report_id = res1.data.masterReportId;
        masterReqData.self_question_id = res1.data.masterQuestionId;

        this.props.removeGroupingForMaster(instanceId , masterReqData).then(res2 => {
            if(res2 && res2.data && res2.data.success){
              message.success("Ungrouped");
              // this.showGroups(currentItem,false);
            }else{
              message.error("Error");
            }
        }).catch(err => {
          message.error("Error");
          console.error(err);
        }) 
      }
    }).catch(err => {
      message.error("Error");
      console.error("error");
    })
  }

  //todo
  handleExistingGroupsChange = (val) => {
    
  }

  render() {
    let allAnswers = this.props.answers;
    
    let { userTeamSync, isTeamSyncAdmin } = this.props;
    let { groupingData } = this.state;
    let sendAnonymous=(userTeamSync&&userTeamSync.send_anonymous)?true:false
    let currentUserId = this.props.user && this.props.user._id;
    let btnColor = localStorage.getItem('theme') === 'default' ? "#402E96" : "#664af0";

    // let selectedMembersIdArr = [];
    // if (userTeamSync.selectedMembers && userTeamSync.selectedMembers.length > 0) {
    //   userTeamSync.selectedMembers.forEach(member => {
    //     selectedMembersIdArr.push(member._id);
    //   })
    // }

    let isParticipant = false;
    // if (selectedMembersIdArr.length > 0) {
    //   if (selectedMembersIdArr.includes(currentUserId)) {
    //     isParticipant = true;
    //   }
    // }
    let currentAns = this.state.currentItem && this.state.currentItem.answer ? this.state.currentItem.answer : "";

    let {currentItem} = this.state;
    let hasActionItems = false;

    if(currentItem && currentItem.action_items && currentItem.action_items.length > 0){
      hasActionItems = true;
    }

    return (
      <div className="retrosection" style={{ paddingLeft: 24 }}>
        {this.state.showModal && <RetroCommentModal _getInitials={this._getInitials} comments={this.state.comments} showModal={this.state.showModal} data={this.state.data} handleCancel={this.closeModal} currentUserId={currentUserId} isAnonymous={sendAnonymous} />}
        {/* <Row gutter={[16, 16]}> */}
        {/* <Col span={6}> */}
        <List className={localStorage.getItem('theme') === 'default' && 'retospective_list_header'} loading={this.props.loading}
        // <List className={'retospective_list_header'} loading={this.props.loading}
          header={
            // <Popover content={<p style={{ wordWrap: "break-word" }}>{this.props.question}</p>}><div style={{ "wordBreak": "break-word", "height": "22px", "overflow": "hidden" }}>
            //   {/* {this.props.question} */}
            //   <Text style={{ maxWidth: "325px" }} ellipsis>{this.props.question}</Text>
            // </div>
            // </Popover>

            <Tooltip title={this.props.question} >
              <Text style={{ width: "325px" }} ellipsis>{this.props.question}</Text>
              {/* <Divider /> */}
              <hr style={{ marginTop: "15px", marginBottom: "0px", border: "none", height: "1px", backgroundColor: "#808080", borderTop: "0.1px solid grey", opacity: "0.3"}}/>
            </Tooltip>
          }
          size="small"
          itemLayout="vertical"
          split={false}
          dataSource={this.props.answers || []}
          // style={{ backgroundColor: localStorage.getItem('theme') == 'dark' && "#0f0f0f" }}
          renderItem={(item) => {
          return (
              <List.Item
                size="small"
                style={{
                  marginTop: 16,
                  // marginRight: 16,
                  // backgroundColor: "#efefef",
                  border: item.grouping_data && item.grouping_data.is_duplicate ? "1px solid lightgray" : "",
                  backgroundColor: item.grouping_data && item.grouping_data.is_duplicate ? (localStorage.getItem('theme') === 'default' ? '' : '#323232') : localStorage.getItem('theme') === 'default' ? 'white' : '#323232',
                  // backgroundColor: localStorage.getItem('theme') === 'default' ? 'white' : '#323232',
                  paddingBottom: 4,
                  // border: "solid 1px #eee"
                }}
              >
                <List.Item.Meta
                  style={{ marginBottom: 4 }}
                avatar={
                  sendAnonymous===false&&<Avatar size="small" style={{marginRight: -12}} src={item.user_id && item.user_id.profilePicUrl}>{this._getInitials(item.user_id.displayName || item.user_id.name)}</Avatar>
                    // <Avatar size="small" style={{ marginRight: -12 }} src={(item.user_id && item.user_id.profilePicUrl) ? item.user_id.profilePicUrl : "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"} />
                   
                  }
                //  description={sendAnonymous===false&&(item.user_id.name ? item.user_id.name : "")}
                 description={sendAnonymous===false&&(item.user_id.displayName || item.user_id.name || '')}
                />
                <Text>{item.answer ? item.answer : ""}</Text>
                <Divider style={{ marginTop: 8, marginBottom: 2 }} />
                {item.grouping_data && item.grouping_data.is_duplicate ? (
                  <Row justify="center">
                    <Col span={24}>
                      <Tooltip title="Deduplicate">
                        <Button
                          type="text"
                          block={true}
                          onClick={() => this.ungroupModal(item ,isParticipant, isTeamSyncAdmin)}
                          // danger
                          icon={<DisconnectOutlined style={{ opacity: 0.5 }} />}
                        // size="small"
                        >
                          Deduplicate
                        </Button>
                      </Tooltip>
                    </Col>
                  </Row>
                ) : (
                  <Row justify="space-between">
                  <Col span={6}>
                    {!item.isCurrentUserVoted ? 
                      (<Tooltip title="Vote">
                      <Button
                        type="text"
                        // ghost
                        block={true}
                        onClick={() => this.listAction("like", item.currentVotes, item.isCurrentUserVoted, item)}
                        style={{ marginRight: 4 }}
                        icon={<LikeOutlined style={{ opacity: 0.5 }} />}
                      // size="small"
                      >
                        <Text type="secondary">{" "}
                          {item.currentVotes ? item.currentVotes : 0}{" "}</Text>
                      </Button>
                    </Tooltip>) :
                    <Tooltip title="Vote">
                      <Button
                        type="text"
                        // ghost
                        block={true}
                        onClick={() => this.listAction("like", item.currentVotes, item.isCurrentUserVoted, item)}
                        style={{ marginRight: 4 }}
                        icon={<LikeFilled style={{ opacity: 0.5 ,color: btnColor }} />}
                      // size="small"
                      >
                        <Text type="secondary">{" "}
                          {item.currentVotes ? item.currentVotes : 0}{" "}</Text>
                      </Button>
                    </Tooltip> }
                  </Col>
                  <Col span={6}>
                    <Tooltip title="Comment">
                      <Button
                        type="text"
                        onClick={() => this.listAction("comment", item.comments ? item.comments.length : 0, null, item)}
                        // ghost
                        block={true}
                        style={{ marginRight: 4 }}
                        icon={<MessageOutlined style={{ opacity: 0.5 }} />}
                      // size="small"
                      >
                        <Text type="secondary">{" "}
                          {item.comments ? item.comments.length : 0}{" "}</Text>
                      </Button>
                    </Tooltip>
                  </Col>
                  <Col span={6}>
                    <Tooltip title="Action Items">
                      <Button
                        type="text"
                        block={true}
                        // ghost
                        onClick={() => this.addAction(item, isParticipant, isTeamSyncAdmin)}
                        // style={{ marginRight: 4 }}
                        icon={<CheckOutlined style={{ opacity: 0.5 }} />}
                      // size="small"
                      >
                        <Text type="secondary">{" "}
                          {item.action_items ? item.action_items.length : 0}{" "}</Text>
                      </Button>
                    </Tooltip>
                  </Col>
                  <Col span={6}>
                      {item.grouping_data.is_master ? (
                        <Tooltip title="Show Groups">
                          <Button
                            type="text"
                            block={true}
                            onClick={() => this.showGroupsNew(item , isParticipant, isTeamSyncAdmin)}

                            icon={<FolderOpenOutlined style={{ opacity: 0.5 }} />}
                          // size="small"
                          >
                            <Text type="secondary">{" "}</Text>
                          </Button>
                        </Tooltip>
                        
                        ) : (
                            <Tooltip title="Mark Duplicate">
                              <Button
                                type="text"
                                block={true}
                                onClick={() => this.groupFeedbackModal(item , isParticipant, isTeamSyncAdmin)}

                                icon={<LinkOutlined style={{ opacity: 0.5 }} />}
                              // size="small"
                              >
                                <Text type="secondary">{" "}</Text>
                              </Button>
                            </Tooltip>
                      )}
                    </Col>
                </Row >
                )}
                
              </List.Item>
            )

          }}
        />

        <Modal
          title="Add Action Item"
          centered
          visible={this.state.actionItemModalVisible}
          onOk={() => this.handleActionItemSubmit()}
          okText="Add Action Item"
          onCancel={() => this.setState({ actionItemModalVisible: false, currentTitle: "" })}
        >


          <Text strong>Title</Text><Text type="danger">*</Text>
          <Input style={{ marginBottom: 4, marginTop: 4 }} value={this.state.currentTitle} onChange={e => this.setState({ currentTitle: e.target.value })} />
          {/* <Text strong>Tags</Text> */}
          {/* <Select mode="tags" style={{ width: '100%', marginBottom: 16 }} placeholder="Tags" onChange={this.handleChange} /> */}
          <Divider />
          {hasActionItems ? (
            <div style={{ maxHeight: "300px", overflow: "scroll" }}>
              <div style={{ marginBottom: 8 }}>
                <Text type="secondary" strong>Related Action Items</Text>{" | "}<a onClick={this.redirectToActionItems}>Show all action items</a>
              </div>
              {this.getExistingActionItems(isParticipant, isTeamSyncAdmin,sendAnonymous)}
            </div>
          ) : (
            <div style={{ marginBottom: 8 }}>
              <Text type="secondary" strong>No Related Action Items</Text>
            </div>
          )}

        </Modal>
        <Modal
          visible={this.state.visible_addgroup}
          title="Mark Duplicate"
          onCancel={() => this.setState({ visible_addgroup: false, currentQuestionId: "", currentInstaceId: "", currentTitle: ""})}
          footer={[
            <Button key="back" onClick={this.closeGroupingModal}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={() => this.handleNewGroup(isParticipant, isTeamSyncAdmin)}
            >
              Mark Duplicate
            </Button>
          ]}
        >
          <Text strong>Add this response "{this.truncateString(currentAns, 70)}" as duplicate and group with:</Text>
          <br/>
          <Text type="secondary">This will transfer all votes, comments and action items from this response and is irreversible.</Text>
          <br/>
          <Select
            // labelInValue
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            placeholder="Please select a response"
            style={{ width: '100%' }}
            onSelect = {this.handleGroupingOptionsSelectNew}
            value={this.state.isGroupingOptionSelected ?  this.state.targetAnsReportId.toString() + "." + this.state.targetAnsQuestionId.toString() : ""}
            // defaultActiveFirstOption = {false}
            // defaultOpen = {false}
          >
            {this.getGroupingOptions(allAnswers,isParticipant,isTeamSyncAdmin)}
          </Select>
        </Modal>
        <Modal
          visible={this.state.ungroupModalVisible}
          title="Deduplicate"
          onCancel={this.handleUngroupCancel}
          footer={[
            <Button key="back" onClick={this.handleUngroupCancel}>
              Cancel
          </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={this.handleUngroupSubmit}
            >
              Yes, Deduplicate
          </Button>
          ]}
        >
          {this.getUngroupModalText()}
          <br /><br />
          <Text>Are you sure you want to remove this response from the group?</Text>
        </Modal>
        <Modal
          onCancel={this.handleShowGroupsModalCancel}
          visible={this.state.showGroupsModalVisible}
          title="Grouped Responses"
          footer={[
            <Button key="back" onClick={this.handleShowGroupsModalCancel}>
              OK
            </Button>
          ]}
        >
          <Text strong>The following responses are marked as duplicate for: "{this.state.currentItem && this.state.currentItem.answer}"</Text>
          <br />
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            // labelInValue
            open={false}
            onSelect={this.handleExistingGroupsChange}
            value={groupingData && (groupingData.length > 0) && groupingData.map(data => {
              return data.answer
            })}
          >
            {groupingData && (groupingData.length > 0) && groupingData.map((data,index) => {
              return <Option key={index} value={data.answer} disabled >{this.truncateString(data.answer,30)}</Option>
            }) }
          </Select>
        </Modal>
      </div>
    )

  }
}

const mapStateToProps = (state) => ({
  user: state.common_reducer.user,
  workspace: state.common_reducer.workspace,
  teamSyncInstance: state.skills.projectTeamSyncInstance,
  userTeamSync: state.skills.userTeamSync,
})
export default withRouter(connect(mapStateToProps, { addLikeToStandup, createGrouping, removeGroupingForDuplicate, removeGroupingForMaster, addActionItem, deleteActionItem })(QuestionSection))