import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getCardSkills, excecuteCardSkill, updateCardSkills, getCardTemplates } from "../skill_builder/steps/CardActions"
import SelectCard from "../skill_builder/steps/cardInvocationDetails/SelectCard";
// import {} from "../skill_builder/steps/CardActions"
import EditSkill from "../EditSkill"
import { addActivityLog } from "../../common/activityLog"
import axios from 'axios';
import { getCurrentSkill,getSkillUser } from "../skills_action";
import { CloseOutlined, GithubOutlined, QuestionCircleOutlined } from '@ant-design/icons';
// import { getChannelInfo, getAllUsers,getCurrentSkill } from "../skills_action";
import {
  Button,
  Table,
  Divider,
  Card,
  Menu,
  Dropdown,
  Row,
  Col,
  message,
  notification,
  Tag,
  Avatar,
  Tooltip,
  PageHeader,
  Layout,
  Alert
} from 'antd';
import SkillConnectModal from "../cardSkill/connectionModal"
const { Meta } = Card;
const { Content } = Layout;
const tagsFromServer = ["Pre-built", "Custom"];

class AppHome extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      skillUserLoading: false,
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
      // isAdmin: false,
      isCreate: false,
      showCreateModal: false,
      warning: { status: false }
      // visible: false
    }
  }
  componentDidMount() {
    // const {jira_skill} = this.props
    // if(jira_skill && jira_skill.isJiraReportsDisabled){
    //   message.error('Jira Reports Integration disabled')
    //   this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}?view=connection`)
    // }

    // axios.get(`/api/${this.props.match.params.wId}/isAdmin`).then(res => {
    //   if(res.data.success && res.data.isAdmin){
    //     this.setState({
    //       isAdmin : true
    //     })
    //   }
    // }).catch(err => {
    //   console.log("error in requesting server if current user is the admin of the workspace: ", err);
    // })

    this.setState({ loading: true, skillUserLoading : true })
    // this.props.getSkillUser(this.props.match.params.wId, this.props.match.params.skill_id).then(res => {
    //   console.log(res);
    // })
    if(this.props.skills.length > 0){
      const jiraSkill = this.props.skills.find((skill) => skill.key === "jira");
      if (jiraSkill) {
        this.props.getSkillUser(this.props.match.params.wId, jiraSkill.skill_metadata._id).then(res => {
          if(res.data.success) this.setState({skillUserLoading : false})
          else this.setState({skillUserLoading : false})
        })
      }
    }

    this.props.getCardSkills(this.props.match.params.wId, "app_home").then(res => {
      this.setState({ loading: false })
    })
    let query = "app_home=" + true
    this.props.getCardTemplates(query)
    // showing templates of reports when user comes from slack apphome
    let isCreate_ = (window.location.search.split('=')[2] == "true")
    //console.info("url",window.location.search)
    //console.info("window.location.search.split('=')",window.location.search.split('='))
    //console.info("isCreate_",isCreate_)
    if(isCreate_){
      this.setState({isCreate : true})
    }

  }

  componentDidUpdate (prevProps) {
    const {skills, getSkillUser,currentSkillUser} = this.props

    if (skills != prevProps.skills) {
      const jiraSkill = this.props.skills.find((skill) => skill.key === "jira");
      if (jiraSkill) {
        getSkillUser(this.props.match.params.wId, jiraSkill.skill_metadata._id).then(res => {
          if(res.data.success) this.setState({skillUserLoading : false})
          else this.setState({skillUserLoading : false})
        })
      }
    }
  }

  //   componentWillUnmount() {
  //   }

  showConfigModal = async(skill) => {
    let modal = await this.skillTokenValidation(skill.cardInformation.card_template_id)
    if (modal == "create_modal") {

      this.setState({ showConfigModal: true, currentCardSkill: skill, selectedTemplate: skill.cardInformation.card_template_id });

    }
    
  }
  closeConfigModal = () => {
    this.setState({ showConfigModal: false, currentCardSkill: {} })
  }
  onSkillEdit = (skill) => {
    this.setState({ showEditModal: true, selectedTemplate: skill })
  }
  closeEditModel = () => {
    this.setState({ showEditModal: false })
  }

  showTemplates = () => {
  //   if (this.props.cardSkills && this.props.cardSkills.length >= 3) {
  // message.error("Only 3 reports can be configured in AppHome tab.")
  //   }
  //   else {
      this.setState({ isCreate: true })
    // }

  }

  hideTemplates = () => {
    this.setState({ isCreate: false })
  }

  //create modal
  showCreateModal = async (template) => {
    // console.log(template)
    if (template.isUpcoming) {
      // console.log("clicked on gitlab");
      message.info('Coming Soon!');
      addActivityLog(this.props.workspace_id, `clicked on report ${template.name}`, "botui_cardskill_comingsoon", `clicked on report ${template.name}`)
      return;
    }

    let modal = await this.skillTokenValidation(template)

    if (modal == "create_modal") {

      this.setState({
        showCreateModal: true,
        selectedTemplate: template
      });

    }


  };
  skillTokenValidation = async (template) => {
    const {currentSkillUser} = this.props
    // return new Promise(async(resolve,rej)=>{

    if (template.app == "Jira" || template.app == "GitHub") {


      let query = "name=" + template.app
      let res = await this.props.getCurrentSkill(this.props.match.params.wId, query)
      let skill = res.data.skill
      if (skill && skill.metadata && skill.linked) {

        if (template.app == "Jira" && template.meta && template.meta.isToken) {
          if ((skill.userName && skill.userToken)||(skill&&skill.metadata&&(skill.metadata.server_type==="jira_server"|| skill.metadata.server_type=="jira_server_oauth" || skill.metadata.server_type=="jira_cloud_oauth"))) {
            // return ("create_modal")
            if (!(currentSkillUser.token_obj && currentSkillUser.token_obj.access_token)) {
              this.setState({ warning: { status: true, skill: skill, type: "user_not_verified" } })
            } else {

              return ("create_modal")
            }
          } else {
            this.setState({ warning: { status: true, skill: skill, type: "jira_basic_token" } })
          }
        } else {
          return ("create_modal")
        }
      } else {
        this.setState({ warning: { status: true, skill: skill, type: "skill_not_connected" } })

      }
    } else {
      return ("create_modal")
    }

    // })

  }
  createModalCancel = type => {
    // console.log(type);
    if (type == "add") {
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
  closeWarningModal = () => {
    this.setState({ warning: { status: false } })

  }
  goToConnection = () => {
    const {currentSkillUser} = this.props

    this.closeWarningModal()
    let url = "/" + this.props.match.params.wId + "/skills/" + this.state.warning.skill._id + '/' + this.props.match.params.sub_skill

    if (!(currentSkillUser.token_obj && currentSkillUser.token_obj.access_token)) {
      url += "?view=personal_preferences"
    }

    this.props.history.push(url)

  }
  execRunNow = async ({skill_id, skill}) => {
    let modal = await this.skillTokenValidation(skill.cardInformation.card_template_id)
    if(modal === 'create_modal'){
      notification.success({
        key: "runNowStatus",
        message: "Request submitted",
        description: "If there is data to be sent, it will reach the configured Slack channel",
        placement: "bottomLeft",
        duration: 3,
      })
      this.props.excecuteCardSkill(skill_id);
    }
  }

  render() {
    const {workspace,cardTemplatesArr,skills} = this.props;
    // console.log("this is card skill", this.props.cardSkills, this.state.showConfigModal)
    let cardTemplates = [...cardTemplatesArr]
    if(workspace && cardTemplatesArr&&"showGithub" in workspace && !workspace.showGithub){
      cardTemplates = cardTemplatesArr.filter(template => template.app == "Jira");
    }

    const jiraSkill = skills.find(skill => skill.name === 'Jira')
    if(jiraSkill && jiraSkill.skill_metadata.disabled){
      cardTemplates = cardTemplates.filter(template => template.app != "Jira");
    }

    const table_columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: "name",

        align: 'center',
        render: (text, record) => {
          return <span>{text}</span>
        },
      }, {
        title: 'Status',
        key: "is_enabled",
        dataIndex: 'is_enabled',
        align: 'center',
        render: (text, record) => {
          if (record.is_enabled) {
            return <Tag color="green">Enabled</Tag>
          } else {
            return <Tag color="orange">Not Enabled</Tag>
          }
        }
      },
      //   {
      //     title: 'Frequency',
      //     key: "frequency",
      //     align: 'center',
      //     dataIndex: 'triggerInformation',

      //     render: (text, record) => {

      //       return <div>{text.frequency == "daily" ? "Daily" : "Every " + text.selectedDay} at {text.timeOfDay} </div>
      //     }
      //   },
      //   {
      //     title: 'Delivery Channel',
      //     key: "channel",
      //     align: 'center',
      //     dataIndex: 'slackData',

      //     render: (text, record) => {

      //       return <div>
      //       {this.props.channels.find(c => c.id == text.slackChannel)?this.props.channels.find(c => c.id == text.slackChannel).name:''} 
      //       </div>
      //     }
      //   },
      {
        title: 'Actions',
        key: "actions",
        align: 'center',
        render: (text, record) => {
          let menu = <Menu >
            <Menu.Item key="1">
              <div onClick={() => this.onSkillEdit(record)} style={{ width: "100%" }}>
                Edit
                    </div>
            </Menu.Item>
            <Menu.Item key="2">
              <div style={{ width: "100%" }} onClick={() => this.execRunNow({skill_id : record._id,skill:record})}>
                Run Now
                  </div>
            </Menu.Item>

            {/* {
              this.state.isAdmin ? (<Menu.Item key="3" onClick={() => this.props.updateCardSkills({ _id: record._id, is_enabled: !record.is_enabled, EditOnly: true })} >
                <div style={{ width: "100%" }}>
                  {record.is_enabled ? "Disable" : "Enable"}
                </div>
              </Menu.Item>) : (<Menu.Item key="3" onClick={() => message.error("Please contact workspace admin to perform this action")} >
                <div style={{ width: "100%" }}>
                  {record.is_enabled ? "Disable" : "Enable"}
                </div>
              </Menu.Item>)
            } */}

            <Menu.Item key="3" onClick={() => this.props.updateCardSkills({ _id: record._id, is_enabled: !record.is_enabled, EditOnly: true })} >
              <div style={{ width: "100%" }}>
                {record.is_enabled ? "Disable" : "Enable"}
              </div>
            </Menu.Item>
          </Menu>
          return <span>
            <a onClick={() => this.showConfigModal(record)}>Configure</a>
            <Divider type="vertical" />
            <Dropdown overlay={menu}>
              <a>More</a>
            </Dropdown>
          </span>
        }
      },
    ];

    // console.log("this.props.cardSkills[0]", this.props.cardSkills[0])
    let cardSkills = this.props.cardSkills

    
    
    // console.log("cardSkills -> ", cardSkills);

    // let currentUserId = localStorage.getItem("trooprUserId");
    // let userSkills = []
    // let otherSkills = []

    // cardSkills.forEach(skill => {
    //   if(skill.user_id === currentUserId){
    //     userSkills.push(skill);
    //   }
    //   else{
    //     otherSkills.push(skill);
    //   }
    // })

    // console.log("userSkills -> ", userSkills);
    // console.log("otherSkills -> ", otherSkills);

    // console.log("cardskillsss=>",cardSkills);
    let reversedSkills = cardSkills
    // cardSkills.forEach((data,index)=>{
    //   reversedSkills.push(cardSkills[cardSkills.length - (index+1)]);
    // })
    // console.log("reversedSkills=>",reversedSkills);

    return (
       <Layout style={{ marginLeft:0 }}>
        <PageHeader
          // avatar={{ style: { backgroundColor: '#402E96' }, icon: "dashboard" }}
          title="Personal Reports"
          style={{ width: "100%",maxWidth: 984}}
          // subTitle={
          //   <>
          //     <span>Jira reports for Troopr Assistant Slack app Home tab</span>
          //     <Button size="small" type="link" onClick={this.showAppHome}>
          //       Show me
          //     </Button>
          //   </>
          // } 
        //   subTitle={"showGithub" in workspace ? 
        //   (workspace.showGithub ?  "Configure Project Reports from Jira or GitHub that always show when you go to Troopr app in Slack" : "Configure Project Reports from Jira that always show when you go to Troopr app in Slack")
        //   :
        //   "Configure Project Reports from Jira or GitHub that always show when you go to Troopr app in Slack"
        // }
        // extra={[
        //   <Button type="primary" icon='plus' onClick={this.showTemplates}>
        //     Add Report
        //   </Button>
        // ]}
        extra={!this.state.isCreate ?
          <Button type="primary" onClick={this.showTemplates}>
            {/*➕ Personal Report */}
            十 Personal Report
          </Button>
          :
          <Button type="primary" icon={<CloseOutlined />} onClick={this.hideTemplates}>Cancel</Button>
        }
          />
      <Content style={{ padding: "10px 16px 32px 24px", overflow: "initial", maxWidth: 984 }}>
          <Alert message="Up to 3 active reports will show in your Slack App Home" type="info" />
          <br/>
        {/* <Content style={{ padding: "32px 16px 32px 24px", overflow: "initial" }}> */}
        {!this.state.isCreate ?
          // <Card title=""
          //   // bodyStyle={{ overflow: "auto", height: "calc(100vh - 138px)" }}
          //   extra={<Button onClick={this.showTemplates}>➕ Personal Report</Button>}
          //   title={
          //     <div>
          //       Personal Reports <Tooltip title={'Configure Project Reports from Jira that always show when you go to Troopr app in Slack'}><QuestionCircleOutlined/></Tooltip>
          //     </div>
          //   }
          //   loading={(!this.state.loading && !this.state.skillUserLoading ? false : true)}
          // >
          <Table loading={(!this.state.loading && !this.state.skillUserLoading ? false : true)} rowKey="_id" columns={table_columns} dataSource={reversedSkills} pagination={{size:'small'}}/>
          // </Card>
          :
          <Card title="Choose a template below to get started"
          // extra={<Button icon={<CloseOutlined />} onClick={this.hideTemplates}>Cancel</Button>}
          bodyStyle={{ overflow: "auto", height: "calc(100vh - 190px)" }}
          loading={(!this.state.loading && !this.state.skillUserLoading ? false : true)}
          >
            <Row gutter={[16, 16]} align="middle">
              {/* <Col></Col><br /> */}
              {cardTemplates.filter(i=>!i.hidden).map(item => (<Col span={8} key={item._id}><div onClick={() => this.showCreateModal(item)}>
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
                    avatar={item.app == "Jira" ? <Avatar src="https://app.troopr.io/logo/jira.png" shape="square" /> : <Avatar icon={<GithubOutlined />} style={{ color: "black" }} />}

                    title={item.name}
                  />
                </Card>

                  :
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
                      avatar={item.app == "Jira" ? <Avatar src="https://app.troopr.io/logo/jira.png" shape="square" /> : <Avatar icon={<GithubOutlined />} style={{ color: "black" }} />}

                      title={item.name}
                    />
                  </Card>}</div></Col>))}
            </Row>
          </Card>
        }

        {
          this.state.showConfigModal && (
            <SelectCard
              showModal={this.closeConfigModal}
              mode="edit"
              skill_type="app_home"
              cardInfo={this.state.currentCardSkill}
              template={this.state.selectedTemplate}
              visible={this.state.showConfigModal}
            />
          )
        }
        {this.state.showEditModal && <EditSkill closeModal={this.closeEditModel} cardInfo={this.state.selectedTemplate} visible={this.state.showEditModal} />}

        {
          this.state.showCreateModal && <SelectCard
            template={this.state.selectedTemplate}
            skill_type="app_home"
            visible={this.state.showCreateModal}
            cancel={this.createModalCancel}
          />
        }

        {this.state.warning.status && <SkillConnectModal gotToConnection={() => this.goToConnection()} closeModal={() => this.closeWarningModal()} wId={this.props.match.params.wId} skill={this.state.warning.skill} type={this.state.warning.type} />}
      </Content>
      </Layout>
    );
  }
}

const mapStateToProps = state => ({
  //   currentSkill: state.skills.currentSkill,
  cardSkills: state.cards.cardSkills,
  cardTemplatesArr: state.cards.templateCards,
  workspace:state.common_reducer.workspace,
  currentSkillUser: state.skills.currentSkillUser,
  skills: state.skills.skills
});

export default withRouter(
  connect(mapStateToProps, {
    getCardSkills, getCurrentSkill,
    excecuteCardSkill, updateCardSkills, getCardTemplates, getSkillUser
  })(AppHome)
);
