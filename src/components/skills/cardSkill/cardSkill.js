import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getCardSkills, excecuteCardSkill, updateCardSkills, deleteCardSkill } from "../skill_builder/steps/CardActions"
import SelectCard from "../skill_builder/steps/cardInvocationDetails/SelectCard";
import { getCardTemplates } from "../skill_builder/steps/CardActions"
import EditSkill from "../EditSkill"
import { addActivityLog } from "../../common/activityLog"
import SkillConnectModal from "./connectionModal"
import queryString from "query-string"
import axios from "axios";
// import jwt from 'jsonwebtoken';
//  let  res=await this.props.getCurrentSkill(this.props.match.params.wId,query)
import { getChannelInfo, getChannelList, getAllUsers, getCurrentSkill, getSkillUser } from "../skills_action";

import { CloseOutlined, GithubOutlined , SearchOutlined} from '@ant-design/icons';
import "./cardSkill.css"
import Highlighter from "react-highlight-words";
import { Button, Table, Divider, Card, Menu, Dropdown, Row, Col, message, notification, Tag, Avatar, Layout, Radio , Icon , Input,PageHeader} from 'antd';
import { isValidUser } from "../../../utils/utils"
import ReportLandingPage from './report_landing_page'
const { Meta } = Card;
const { CheckableTag } = Tag;
const { Content } = Layout;
const tagsFromServer = ["Jira", "GitHub"];

function onradioselect (event){
};

class CardSkillList extends Component {
  constructor() {
    super();
    this.state = {
      // loading: true,
      selectedTemplate: {},
      selectedTemplateId: "",
      hover: false,
      selectedTags: tagsFromServer,
      showModal: false,
      selectedCardTemplate: {},
      cardTemplateInfo: {},
      showEditModal: false,
      showConfigModal: false,
      currentCardSkill: {},
      loading: false,
      isCreate: false,
      showCreateModal: false,
      warning: { status: false },
      searchText: "",
      searchedColumn: "",
      cardSkillWithuser : [],
      report_scope: "my_reports",
      isReportLandingPage : false,
      channelsLoading : false,
      // visible: false
    }
  }
  componentDidMount() {
    this.setState({ loading: true })
    const parsedQueryString = queryString.parse(this.props.location.search)
    if(this.props.channels && this.props.channels.length === 0 || (parsedQueryString.from && parsedQueryString.from === 'jira_conection_onboarding') ){
      this.setState({channelsLoading : true})
      this.props.getChannelList(this.props.match.params.wId).then(res => this.setState({channelsLoading : false}));
    }

    // if(this.props.skill && this.props.skill.isJiraReportsDisabled){
    //   message.error('Jira Reports Integration disabled')
    //   this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}?view=connection`)
    // }

    // console.log("this.props.skill", this.props.skill)
    let skill = {}
    let query = ""
    // this.props.getAllUsers(this.props.workspace_id).then(res =>{
      
      // if(res.data.success) {
      //   if(res.data.users) {
      //     this.setState({
      //       reportMembers: res.data.users
      //     });
      //   }
      // }
      if (this.props.skill) {
        query = "app=" + this.props.skill.name
        this.props.getCardTemplates(query)
        
        skill = this.props.getCardSkills(this.props.workspace_id, "app_message", this.props.skill.name).then(res =>{
          // let cardSkillWithuser = [];

          // console.log("oaasj",res.data.cardSkills);
          if(res.data.success ){
            this.setUserNameInCardSkills(res.data.CardSkills)
            this.setState({loading : false})
          //   res.data.CardSkills.forEach(report => {
          //   // console.log(this.props.allUsers);
          //   const userFound = this.props.allUsers.find(user => user.user_id === report.user_id)
          //   if(userFound) {
          //     // report.user_id = userFound
          //     report.creator_name = userFound.name;
          //   }else{
          //     report.creator_name = "Not a member";
          //   }
          //   //for channel search
          //   let channelPresent = this.props.channels.find(c => c.id === report.slackData.slackChannel);
          //   if(channelPresent){
          //     report.channel_name = channelPresent.name;
          //   }else{
          //     report.channel_name = '';
          //   }
          //   cardSkillWithuser.push(report);

          // });
          }
          // this.setState({cardSkillWithuser})
        }
          
        )
      } else {
  
        skill = this.props.getCardSkills(this.props.workspace_id, "app_message")
      }
    // })

    if(this.props.skillView && this.props.skillView.report_id){
      this.setState({isReportLandingPage : true})
    }

    // if (this.props.skill) {
    //   query = "app=" + this.props.skill.name
    //   skill = this.props.getCardSkills(this.props.workspace_id, "app_message", this.props.skill.name).then(res =>{
    //     // res.data.forEach(element => {
    //       console.log(this.props.allUsers);

    //     //   const userFound = this.props.allUsers.find(user => user.user_id === text)
    //     // });
    //   }
        
    //   )
    // } else {

    //   skill = this.props.getCardSkills(this.props.workspace_id, "app_message")
    // }

    /* getChannels only called once in sidenavbar_new */
    // let channels = this.props.getChannelList(this.props.match.params.wId)
    // Promise.all([skill/* , channels */]).then(res => { this.setState({ loading: false }) })

    // this.props.getCardTemplates(query)
    // this.props.getAllUsers(this.props.workspace_id)

    // showing templates of reports when user comes from slack apphome
    // console.log(this.props.location.search)
    let isCreate_ = (this.props.location.search.split('=')[2] === 'true')
    if(isCreate_){
      this.setState({isCreate : true})
    }

  }

  componentDidUpdate(prePorps){
    if(prePorps.cardSkills !== this.props.cardSkills){
      this.setUserNameInCardSkills(this.props.cardSkills)
    }

    if(prePorps.channels !== this.props.channels) this.setUserNameInCardSkills(this.props.cardSkills)
  }

  setUserNameInCardSkills = (CardSkills) => {
    let cardSkillWithuser = [];
    CardSkills.forEach(report => {
      // console.log(this.props.allUsers);
      const userFound = this.props.allUsers.find(user => user.user_id._id === report.user_id)
      if(userFound) {
        // report.user_id = userFound
        report.creator_name = userFound.user_id.displayName||userFound.user_id.name;
      }else{
        report.creator_name = "Not a member";
      }
      //for channel search
      // let channelPresent = report.slackData && this.props.channels.find(c => c.id ===  report.slackData.slackChannel);
      let channelPresent = [];
      let isChannelPresent = report.slackData && report.slackData.slackChannel && report.slackData.slackChannel;
      if(Array.isArray(isChannelPresent)) {
        let channelDetails;
        isChannelPresent.forEach(channel => {
          channelDetails = false;
          channelDetails = this.props.channels.find(c => c.id ===  channel);
          if(channelDetails) {
            channelPresent.push(channelDetails);
          }
        });
      } else {
        channelPresent = this.props.channels.find(c => c.id ===  isChannelPresent);
      }

      if(channelPresent){
        report.channel_name = channelPresent;
      }else{
        report.channel_name = '';
      }
      cardSkillWithuser.push(report);

    });

    this.setState({cardSkillWithuser})
  }



  showConfigModal = async (skill, e) => {
    e.preventDefault()

    let isCreator = isValidUser(skill);
    let skills = {}
    let query = ""

    if (isCreator || this.props.isAdmin){
      let modal = await this.skillTokenValidation(skill.cardInformation.card_template_id)
      if (modal === "create_modal") {
        if (this.props.skill) {
          query = "app=" + this.props.skill.name
          skills = this.props.getCardSkills(this.props.workspace_id, "app_message", this.props.skill.name)
        } else {

          skills = this.props.getCardSkills(this.props.workspace_id, "app_message")
        }
        /* getChannels only called once in sidenavbar_new */
        // let channels = this.props.getChannelList(this.props.match.params.wId)
        Promise.all([skills/* , channels */])


        this.props.getCardTemplates(query)
        this.props.getAllUsers(this.props.workspace_id)
        //>>>>>>>>>>>>>>>>>>>>>>>
        let isCreator = isValidUser(skill)
        if (isCreator || this.props.match.params.wId == '5f84c0d0b038174751d7b805' || this.props.isAdmin) {
          let modal = await this.skillTokenValidation(skill.cardInformation.card_template_id)
          if (modal === "create_modal") {

            this.setState({ showConfigModal: true, currentCardSkill: skill, selectedTemplate: skill.cardInformation.card_template_id })
          }
        } else {
          this.showErrorMessage();
        }
      }
    }else{
      this.showErrorMessage(); 
    }

    
    // if (this.props.skill) {
    //   query = "app=" + this.props.skill.name
    //   skills = this.props.getCardSkills(this.props.workspace_id, "app_message", this.props.skill.name)
    // } else {

    //   skills = this.props.getCardSkills(this.props.workspace_id, "app_message")
    // }

    // let channels = this.props.getChannelList(this.props.match.params.wId)
    // Promise.all([skills, channels])


    // this.props.getCardTemplates(query)
    // this.props.getAllUsers(this.props.workspace_id)
  }

  closeConfigModal = () => {
    this.setState({ showConfigModal: false, currentCardSkill: {} })
  }
  onSkillEdit = async (skill) => {
    let isCreator = isValidUser(skill)
    if (isCreator || this.props.isAdmin) {

      this.setState({ showEditModal: true, selectedTemplate: skill })

    } else {
      this.showErrorMessage();
    }



  }
  closeEditModel = () => {
    this.setState({ showEditModal: false })
  }

  showTemplates = () => {
    this.setState({ isCreate: true })
  }

  hideTemplates = () => {
    this.setState({ isCreate: false })
  }
  goToConnection = () => {
    // console.log("this.state.warning==>",this.state.warning)
    let skillId = this.state.warning.skill.skill_metadata ? this.state.warning.skill.skill_metadata._id : this.state.warning.skill._id
    this.closeWarningModal()
    if (this.state.warning.type == "user_not_verified") {
      this.props.history.push(
        "/" +
        this.props.match.params.wId +
        "/skills/" +
        skillId + `/${this.props.match.params.sub_skill}?view=personal_preferences`)

    } else {
      // this.closeWarningModal()
      this.props.history.push(
        "/" +
        this.props.match.params.wId +
        "/skills/" +
        skillId + `/${this.props.match.params.sub_skill}?view=connection`)
    }



    // http://localhost:3000/5da4544577360439548077eb/skills/5da454461d05673817aff1c1?view=personal_preferences

  }
  //create modal
  showCreateModal = async (template) => {
    // console.log("template===>", template)
    if (template.isUpcoming) {
      // console.log("clicked on gitlab");
      message.info('Coming Soon!');
      addActivityLog(this.props.workspace_id, `clicked on report ${template.name}`, "botui_cardskill_comingsoon", `clicked on report ${template.name}`)
      return;
    }

    let modal = await this.skillTokenValidation(template)
    // console.log("modal---->",modal)
    if (modal === "create_modal") {

      this.setState({
        showCreateModal: true,
        selectedTemplate: template
      });

    }


  }
  closeWarningModal = () => {
    this.setState({ warning: { status: false } })

  }


  skillTokenValidation = async (template) => {
    // return new Promise(async(resolve,rej)=>{
    if (template.app === "Jira" || template.app === "GitHub") {
      let skill = {}
      let currentSkillUser = {}

      if (this.props.skill) {
        skill = this.props.skill
        // this.props.currentSkill.skill_metadata 
      } else {
        let query = "name=" + template.app
        let res = await this.props.getCurrentSkill(this.props.match.params.wId, query)
        skill = res.data.skill
      }

      if (!this.props.currentSkillUser) {
        currentSkillUser = await this.props.getSkillUser(this.props.match.params.wId, this.props.match.params.skill_id)

      } else {
        currentSkillUser = this.props.currentSkillUser
      }
      // console.log("template===>",template)
      // console.log("skill====>", skill)
      if (skill && ((skill.skill_metadata && skill.skill_metadata.linked) || (skill.linked))) {
        if (template.app === "Jira") {


          if (template.meta && template.meta.isToken) {

            if ((skill.skill_metadata && skill.skill_metadata.userName && skill.skill_metadata.userToken) || (skill.userName && skill.userToken) || (skill.metadata.domain_url)) {
              if (!(currentSkillUser.token_obj && currentSkillUser.token_obj.access_token)) {
                this.setState({ warning: { status: true, skill: skill, type: "user_not_verified" } })
              } else {

                return ("create_modal")
              }

            }

            else {

              this.setState({ warning: { status: true, skill: skill, type: "jira_basic_token" } })
              // message.info('Jira Token required');     
            }
          } else if (!(currentSkillUser.token_obj && currentSkillUser.token_obj.access_token)) {

            this.setState({ warning: { status: true, skill: skill, type: "user_not_verified" } })

          } else {
            return ("create_modal")
          }
        }
      } else {
        this.setState({ warning: { status: true, skill: skill, type: "skill_not_connected" } })
        // message.info('Skill Not Connected');     

      }
    } else {

      return ("create_modal")
    }

    // })

  }
  createModalCancel = type => {
    // console.log(type);
    if (type === "add") {
      this.setState({
        showCreateModal: false,
        isCreate: false
      });
    } else {

      this.setState({
        showCreateModal: false,
      });

    }
  }

  execRunNow = async (skill) => {
    let isCreator = isValidUser(skill)
    //id=Zynga
    if (isCreator || this.props.isAdmin) {
      let modal = await this.skillTokenValidation(skill.cardInformation.card_template_id)
      if (modal === "create_modal") {

        notification.success({
          key: "runNowStatus",
          message: "Request submitted",
          description: "If there is data to be sent, it will reach the configured Slack channel",
          placement: "bottomLeft",
          duration: 3,
        })

        this.props.excecuteCardSkill(skill._id)
      }
    } else {
      this.showErrorMessage();
    }


  }
  showErrorMessage = () => {
    message.error(`You don't have permission to modify this skill. Only Creator or admin can modify it`)
  }
  toggleSkill = (record) => {
    let isCreator = isValidUser(record);
      (isCreator || this.props.isAdmin)  ? this.props.updateCardSkills({ _id: record._id, is_enabled: !record.is_enabled, EditOnly: true }) : this.showErrorMessage()
  }
  handleCheckedtage = (tag, checked) => {
    let { selectedTags } = this.state
    const nextSelectedTags = checked ? [...selectedTags, tag]
      : selectedTags.filter(t => t !== tag);
    this.setState({ selectedTags: nextSelectedTags });
  }
  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined />    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[this.state.searchText]}
          textToHighlight={text.toString()}
          autoEscape
        />
      ) : (
        text
      )
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  gotoReportLandingPage = (id) => {
    this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}/${this.props.match.params.sub_skill}?view=reports&report_id=${id}`);
    this.setState({isReportLandingPage : true})
  }

  handleReportScopeChange = e => {
    this.setState({
      report_scope: e.target.value
    });
  };
  getUserCardSkills = () => {
    let allCardSkills = this.state.cardSkillWithuser;
    let currentUserId = this.props.user_now._id;
    let userCardSkills = [];

    if(allCardSkills && allCardSkills.length > 0){
      userCardSkills = allCardSkills.filter(cardSkill => cardSkill.user_id === currentUserId);
    }

    return userCardSkills ;
  }

  goToReports = () => {
    this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}/${this.props.match.params.sub_skill}?view=reports`)
    this.setState({isReportLandingPage: false})
  }

  onReportDelete = (report) => {
    // console.log("comming");
    let isCreator = isValidUser(report)
    if (isCreator || this.props.isAdmin) {
      this.props
      .deleteCardSkill(report._id)
      .then((res) => {
        message.success("Report deleted");
        this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}/${this.props.match.params.sub_skill}?view=reports`);
        this.setState({isReportLandingPage: false})
      })
      .catch((e) => {
        // console.log(e);
        console.error(e);
      });
    }else{
      this.showErrorMessage()
    }
  };

  getReleventReports = (reports) => {
    const {report_scope} = this.state
    const {user_now} = this.props
    if(report_scope === 'all_reports') return reports
    else {
      return reports.filter(report => report.user_id === user_now._id)
    }
  }

  validateChannels = (channels, selectedChannels) => {
    let notExistChannels = [];
    if(selectedChannels) {
      if(Array.isArray(selectedChannels)) {
        selectedChannels.map((schannel) => {
          if(channels.some((channel) => channel.id === schannel)) {
          } else {
            notExistChannels.push(schannel);
          }
        })
      } else {
        if(channels.find(c => c.id === selectedChannels)) {

        } else {
          notExistChannels = selectedChannels;
        }
      }
    }
    return notExistChannels;
  }

  getDeliverChannelAndMember = (slackData) => {

    let notExistChannels = [];
    let existChannels = [];
    let existMemberDetails = [];
    let notExistMembersDetails = [];
    
    if (slackData) {
      if (slackData.slackChannel && Array.isArray(slackData.slackChannel)) {
        let channelDetails = "";
        slackData.slackChannel.map((schannel) => {
          channelDetails = this.props.channels.find((channel) => channel.id === schannel);
          if (channelDetails) {
            existChannels.push({
              id: channelDetails.id,
              name: channelDetails.name,
              type:'channel'
            })
          } else {
            notExistChannels.push(schannel);
          }
        })
      } else {
        let singleChannelDetails = this.props.channels.find(c => c.id === slackData.slackChannel);
        if (singleChannelDetails) {
          existChannels.push({
            id: singleChannelDetails.id,
            name: singleChannelDetails.name,
            type:'channel'
          })
        } else {
          notExistChannels = slackData.slackChannel;
        }
      }

      if (slackData && slackData.reportMembers && Array.isArray(slackData.reportMembers)) {
        let userDetails = "";
        slackData.reportMembers.map((member) => {
          
          userDetails = this.props.allUsers.find((user) => user.user_id._id === member);
          if (userDetails) {
            existMemberDetails.push({
              id: userDetails.user_id._id,
              name: userDetails.user_id.displayName || userDetails.user_id.name,
              type:'user'
            })
          } else {
            notExistMembersDetails.push(member);
          }
        })
      }
    }

    let deliverDetails = [...existChannels, ...existMemberDetails];
    
    return deliverDetails;
  } 

  render() {
    // console.log("skilllssss-->",this.props);
    // console.log("this.state.warningthis.state.warning==>",this.state.warning)
    // let openModal;
    const {isReportLandingPage} = this.state 
    const {currentSkillUser} = this.props
    let jiraServerModal
    const jiraSkill = this.props.skills.find(skill => skill.key === 'jira')

    if (this.props.currentSkill && this.props.currentSkill.metadata && this.props.currentSkill.metadata.server_type === "jira_server") {
      jiraServerModal = true
    } else {
      jiraServerModal = false
    }

    // if (this.props.currentSkill && this.props.currentSkill.userToken) {
    //   openModal = true

    // } else {
    //   openModal = false
    // }
    const { selectedTags } = this.state
    const table_columns = [
      {
        className: 'response_column_without_table_top',
        title: 'Name',
        dataIndex: 'name',
        key: "name",
        align: 'center',
        ...this.getColumnSearchProps("name"),
        
        // render: name => (
        //   <>
        //     <Button size="small" type="link" onClick={this.goToReport}>
        //       {name}
        //     </Button>
        //   </>
        // ),
        render: (text, data) => {
          return <Button type='link' onClick={() => this.gotoReportLandingPage(data._id)}>{text}</Button>        
        },        
      },
      {
        className: 'response_column_without_table_top',
        title: 'Creator',
        dataIndex: 'creator_name',
        // key: "user_id",
        align: 'center',
        render: (text, record) => {
          // return <span>
          //   {this.props.allUsers && this.props.allUsers.map(user => {
          //     if (text === user.user_id) {
          //       return user.name
          //     } else {
          //       return false
          //     }
          //   })}
          // </span>
          // const userFound = this.props.allUsers.find(user => user.user_id === text)
          // if(userFound) return userFound.name
          // else return 'Not a member'
          return <span>{text}</span>        
        },
        ...this.getColumnSearchProps("creator_name")
      },
      {
        title: 'Status',
        key: "is_enabled",
        align: 'center',
        dataIndex: 'is_enabled',
        sorter: (a, b) => (a.is_enabled ? 'Enabled' : 'Not Enabled').length - (b.is_enabled ? 'Enabled' : 'Not Enabled').length,
        sortDirections: ['descend', 'ascend'],
        render: (text, record) => {
          
          if (record.is_enabled) {
            return <Tag color="green">Enabled</Tag>
          } else {
            return <Tag color="orange">Not Enabled</Tag>
          }
        }
      },
      {
        title: 'Schedule',
        key: "frequency",
        align: 'center',
        dataIndex: 'triggerInformation',

        render: (text, record) => {

          return text ? <div>{text.frequency === "daily" ? "Daily" : "Every " + text.selectedDay} at {text.timeOfDay} </div> : ''
        }
      },
      {
        className: 'response_column_without_table_top',
        title: 'Delivery Channel',
        key: "channel",
        align: 'center',
        dataIndex: 'channel_name',
        sorter: (a, b) => {
          if(a.channel_name < b.channel_name) { return -1; }
          if(a.channel_name > b.channel_name) { return 1; }
          return 0;
      },
        sortDirections: ['descend', 'ascend'],
        // ...this.getColumnSearchProps("channel_name"),
        render: (text, record) => {

          let channelNames = "";
          let deliverDetails = this.getDeliverChannelAndMember(record.slackData);
          
          // if(Array.isArray(text)) {
          //   let textLength = text.length;
          //   text.forEach((channel, index) => {
          //     if((textLength-1) === index) {
          //       channelNames += `${channel.name}`;
          //     } else {
          //       channelNames += `${channel.name}, `;
          //     }
          //   });
          // } else {
          //   channelNames = text.name;
          // }
          // let isPresent = this.props.channels.find(c => c.id === record.slackData.slackChannel);
          let notExistChannels = this.validateChannels(this.props.channels, (record.slackData && record.slackData.slackChannel) ? record.slackData.slackChannel : [])
          let isPresent = notExistChannels.length > 0;
          if (isPresent) {
          return <Tag color="orange">{`Troopr was removed from channel ${notExistChannels}`}</Tag>
           }
          else{
          // return <div>
          //   {this.props.channels.find(c => c.id === text.slackChannel) ? this.props.channels.find(c => c.id === text.slackChannel).name : ''}
          // </div>

            let reportDeliver = "";
            deliverDetails.map((deliver, index) => {
              if(index < 3) {
                reportDeliver += `${deliver.type === 'channel' ? '#' : ''}${deliver.name}${deliverDetails.slice(0,3).length - 1 === index ? '' : ','} `;
              }
            }) 
            if(deliverDetails.length > 3) {
              reportDeliver += `and ${deliverDetails.length - 3} more`;
            } 

            return reportDeliver;
          }
        },

        
      },
      {
        title: 'Actions',
        key: "actions",
        align: 'center',
        width: 150,
        render: (text, record) => {
     
          let menu = <Menu >
            <Menu.Item key="1">
              <div onClick={() => this.onSkillEdit(record)} style={{ width: "100%" }}>
                Edit
                    </div>
            </Menu.Item>
            <Menu.Item key="2">
              <div style={{ width: "100%" }} onClick={() => this.execRunNow(record)}>
                Run Now
                  </div>
            </Menu.Item>
            <Menu.Item key="3" onClick={() => this.toggleSkill(record)} >
              <div style={{ width: "100%" }}>
                {record.is_enabled ? "Disable" : "Enable"}
              </div>
            </Menu.Item>
          </Menu>
          return <span>
            <a onClick={(e) => this.showConfigModal(record, e)}>Configure</a>
            <Divider type="vertical" />
            <Dropdown overlay={menu}>
              <a>More</a>
            </Dropdown>
          </span>
        }
      },
    ];
    let cardSkills = (this.state.cardSkillWithuser.length > 0 && ((this.props.skill && this.state.cardSkillWithuser[0].app === this.props.skill.name) || !this.props.skill || this.props.currentSkill.linked) && this.state.cardSkillWithuser[0].skill_type !== "app_home") ? this.state.cardSkillWithuser : []    
    const filteredSkills = (this.state.selectedTags.length > 0 && this.props.showFilter)
      ? this.props.cardTemplates.filter(card => {
        if (!card.hidden) {
          let skillType = card.app === "Jira" ? "Jira" : "GitHub";
          return selectedTags.includes(skillType);
        }

      })
      : this.props.cardTemplates.filter(i => !i.isHidden);

    return (
      <>
        <Layout style={{marginLeft:0}} className="reports_nudges">
      {!isReportLandingPage && <PageHeader
          title="Reports & Nudges"
          extra={[
            <Button type="primary"  icon={ this.state.isCreate && <CloseOutlined />} onClick={this.state.isCreate ? this.hideTemplates : this.showTemplates}>
              {this.state.isCreate ? 'Cancel': 'Add Report'}
            </Button>,
            <Button onClick={() => {
              if (!(currentSkillUser && currentSkillUser.token_obj && currentSkillUser.token_obj.access_token)) {
                this.setState({ warning: { status: true, skill: this.props.skill, type: "user_not_verified" } })
              }else{
                this.props.history.push(`/${this.props.match.params.wId}/jiraConnectionSteps/${jiraSkill.skill_metadata._id}?domainName=${jiraSkill.skill_metadata.metadata.domain_url}&sub_skill=${this.props.match.params.sub_skill}&from=setup_demo_channel_button`)
              }
            
            }}>Setup Demo Report</Button>
          ]}
          style={{maxWidth: 1440 }}
      />}
      <Content  style={{ padding: !isReportLandingPage && "16px 16px 32px 24px", overflow: "initial", maxWidth: 1440 }}>
        {!isReportLandingPage ? (!this.state.isCreate ?
          // <Card title=""
          //   bodyStyle={!this.props.skill ? { overflow: "auto", height: "calc(100vh - 170px)" } : {}}
          //   // extra={<CreateCardSkillModal skill={this.props.skill}/>}
          //   extra={<Button type="primary" onClick={this.showTemplates}>Add Report</Button>}
          //   loading={(this.state.loading)}
          // >
          <> 
          {this.props.isAdmin &&
            <div>
            <Radio.Group
              style={{ marginBottom: 8 }}
              value={this.state.report_scope}
              onChange={this.handleReportScopeChange}
            >
              <Radio.Button value="my_reports">My Reports</Radio.Button>
              <Radio.Button value="all_reports">All Reports</Radio.Button>
            </Radio.Group>
          </div>}
          <Table rowKey="_id" loading={this.state.loading || this.state.channelsLoading} columns={table_columns} dataSource={this.getReleventReports(this.state.cardSkillWithuser)} pagination={{ defaultPageSize: 20, showSizeChanger: true}} />
            </>
          // </Card>
          :
          <Card title="Choose a template below to get started"
            bodyStyle={!this.props.skill ? { overflow: "auto", height: "calc(100vh - 190px)" } : {}}
            // extra={<Button type="primary" icon={<CloseOutlined />} onClick={this.hideTemplates}>Cancel</Button>}
            loading={(this.state.loading)}
          >
            <div style={{ marginBottom: "10px" }}> {this.props.showFilter && tagsFromServer.map(tag => (
              <CheckableTag
                key={tag}
                checked={selectedTags.indexOf(tag) > -1}
                onChange={checked => this.handleCheckedtage(tag, checked)}
              >
                {tag}
              </CheckableTag>
            ))}</div>

            <Row gutter={[16, 16]} justify="space-between" align="middle" className='cardSkillDisplay'>


              {filteredSkills.map(item => (<Col span={8} key={item._id}><div onClick={() => this.showCreateModal(item)}>
                {item.isUpcoming ? <Card

                  cover={
                    <div
                      style={{
                        height: "200px",
                        // 'url("https://app-stage.troopr.io/logo/test1.png")'
                        backgroundImage: `url(${item.logo})`,
                        backgroundPosition: "center",
                        backgroundSize: "220px",
                        backgroundRepeat: "no-repeat",
                        backgroundColor: "#001529"
                      }}
                    />
                  }
                >
                  <Meta
                    avatar={item.app === "Jira" ? <Avatar src="https://app.troopr.io/logo/jira.png" shape="square" /> : <Avatar icon={<GithubOutlined />} style={{ color: "black" }} />}

                    title={item.name}
                  />
                </Card> :
                  <Card
                    hoverable

                    cover={
                      <div
                        style={{
                          height: "200px",
                          // 'url("https://app-stage.troopr.io/logo/test1.png")'
                          backgroundImage: `url(${item.logo})`,
                          backgroundPosition: "center",
                          backgroundSize: "220px",
                          backgroundRepeat: "no-repeat",
                          backgroundColor: "#001529"
                        }}
                      />
                    }
                  >
                    <Meta
                      avatar={item.app === "Jira" ? <Avatar src="https://app.troopr.io/logo/jira.png" shape="square" /> : <Avatar icon={<GithubOutlined />} style={{ color: "black" }} />}
                      title={item.name}
                    />
                  </Card>}</div></Col>))}
            </Row>
          </Card>) : <ReportLandingPage skillView = {this.props.skillView} goToReports = {this.goToReports} showConfigModal = {this.showConfigModal} toggleSkill = {this.toggleSkill} execRunNow={this.execRunNow} onReportDelete= {this.onReportDelete}/>
        }

        {(this.state.showConfigModal) && (
          <SelectCard
            showModal={this.closeConfigModal}
            mode="edit"
            skill_type="app_message"
            cardInfo={this.state.currentCardSkill}
            template={this.state.selectedTemplate}
            visible={this.state.showConfigModal}
            // reportMembers={this.state.reportMembers}
          />
        )}
        {(this.state.showEditModal) && <EditSkill closeModal={this.closeEditModel} cardInfo={this.state.selectedTemplate} visible={this.state.showEditModal} />}

        {(this.state.showCreateModal) && <SelectCard
          skill_type="app_message"
          template={this.state.selectedTemplate}
          visible={this.state.showCreateModal}
          cancel={this.createModalCancel}
          // reportMembers={this.state.reportMembers}
        />}
        {/* {this.state.warning.status && !openModal && (!jiraServerModal ||this.state.warning.type=="user_not_verified") && <SkillConnectModal gotToConnection={() => this.goToConnection()} closeModal={() => this.closeWarningModal()} wId={this.props.match.params.wId} skill={this.state.warning.skill} type={this.state.warning.type} />} */}
        {this.state.warning.status && (!jiraServerModal || this.state.warning.type == "user_not_verified") && <SkillConnectModal gotToConnection={() => this.goToConnection()} closeModal={() => this.closeWarningModal()} wId={this.props.match.params.wId} skill={this.state.warning.skill} type={this.state.warning.type} />}
      </Content>
      </Layout>
      </>
    );
  }
}

const mapStateToProps = state => ({
  currentSkill: state.skills.currentSkill,
  currentSkillUser: state.skills.currentSkillUser,
  cardSkills: state.cards.cardSkills,
  cardTemplates: state.cards.templateCards,
  channels: state.skills.channels,
  allUsers: state.skills.members,
  user_now: state.common_reducer.user,
  isAdmin: state.common_reducer.isAdmin,
  skills: state.skills.skills

});

export default withRouter(
  connect(mapStateToProps, {
    getCardSkills,
    excecuteCardSkill, updateCardSkills, getCardTemplates, getChannelInfo, getChannelList, getSkillUser, getAllUsers, getCurrentSkill, deleteCardSkill
  })(CardSkillList)
);
