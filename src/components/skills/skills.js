import React, { Component, Fragment } from "react";
import { Row, Spin, Typography, Divider, message, Layout } from "antd";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getAssisantSkills, getCurrentSkill, setCurrentSkill, getUser } from "./skills_action";
import {
  createSkill,

} from "./skill_builder/skillBuilderActions";
import EditSkill from "./EditSkill"
import Navbar from "./navbar/navbar";
import CardHoverDetails from "./skill_builder/cardHoverDetails";
import "./skills.css";
import queryString from 'query-string';
import getHeaderInfo from "../../utils/skillTabs";
import Skill from "./skill"
// import axios from 'axios';
// import skill from "./skill";
const tagsFromServer = ["Pre-built", "Custom"];
const { Paragraph } = Typography;


class Skills extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      selectedTemplate: {},
      selectedTemplateId: "",
      hover: false,
      selectedTags: tagsFromServer,
      showModal: false,
      selectedCardTemplate: {},
      cardTemplateInfo: {},
      showEditModal: false,
      skillView: {},
      headerInfo: {},
      currentSkill: [],
      currentUser: {},
      jiraAdminUserData: {}

    };
  }
  componentDidMount() {
    if (this.props.currentSkill && (this.props.currentSkill.skill_metadata || this.props.currentSkill.jiraConnectedId)) {
      this.setState({ currentSkill: this.props.currentSkill });
      // this.props
      //   .getUser(
      //     this.props.currentSkill.skill_metadata
      //       ? this.props.currentSkill.skill_metadata.jiraConnectedId
      //       : this.props.currentSkill.jiraConnectedId
      //   )
      //   .then(res => {
      //     if (res.data.user) {
      //       this.setState({
      //         jiraAdminUserData: res.data.user, loading: false
      //       });
      //     }
      //   });
    }

    if (this.props.user_now && this.props.user_now._id) {
      this.setState({ currentUser: this.props.user_now });
    }

    // axios.get(`/api/${this.props.match.params.wId}/isAdmin`).then(res => {
    //   if (res && res.data && res.data.success && res.data.isAdmin) {
    //     this.setState({ isAdmin: true });
    //   }
    // }).catch(err => {
    //   console.error("some error occurred while getting workspace admin details -> ", err);
    // })

    if (this.props.match.params.skill_id) {

      let parsedQueryString = queryString.parse(window.location.search);
      this.setState({ loading: true })
      if (this.props.currentSkill._id == this.props.match.params.skill_id) {
        this.setState({ loading: false ,  skillView: parsedQueryString})

      } else {
        this.setState({ loading: true });
        // console.log("Call skill")
        let query = "sId=" + this.props.match.params.skill_id
        this.props.getCurrentSkill(this.props.match.params.wId, query).then(res => {

          // this.setState({ loading: false })
          this.setState({ skillView: parsedQueryString, loading: false, currentSkill: res.data.skill });
        })
      }

      this.props.getAssisantSkills(this.props.match.params.wId).then(res => {
        // this.setState({ loading: false });
      });
      // this.setState({skillView:parsedQueryString,loading: false})

    } else {
      this.setState({ loading: true });
      this.props.getAssisantSkills(this.props.match.params.wId).then(res => {
        this.setState({ loading: false });
      });

    }

  }

  componentDidUpdate(prevProps) {
    const { assistant_skills } = this.props;
    // if (prevProps.currentSkill != this.props.currentSkill) {
    //   if (this.props.currentSkill.name == 'Jira') {
    //     this.setState({ loading: true })
    //     this.props
    //       .getUser(
    //         this.props.currentSkill.skill_metadata
    //           ? this.props.currentSkill.skill_metadata.jiraConnectedId
    //           : this.props.currentSkill.jiraConnectedId
    //       )
    //       .then(res => {
    //         if (res.data.user) {
    //           this.setState({
    //             jiraAdminUserData: res.data.user, loading: false
    //           });
    //         }
    //       });
    //   }
    // }

    if(this.props.match.params.skill_id!==prevProps.match.params.skill_id){
      const filteredSkills = assistant_skills.filter(skill => (
        skill.type === "system"

      ))
      let skill=filteredSkills.filter(skill=>(skill.skill_metadata&&skill.skill_metadata._id===this.props.match.params.skill_id))
      if(skill&&skill[0]){
        this.onSkillClick(skill[0])
      }
    }
    
    if(prevProps.currentSkill !== this.props.currentSkill){
      if(this.props.currentSkill.linked === false){
        const filteredSkills = assistant_skills.filter(skill => (
          skill.type === "system"
  
        ))
        let skill=filteredSkills.filter(skill=>(skill.skill_metadata&&skill.skill_metadata._id===this.props.match.params.skill_id))
        if(skill && skill[0]){
        // <<<<<<<<<<<<<<< setting skillView state at the bottom of render => return >>>>>>>>>>>>>>>>>>>>>>>
        this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}${skill[0].key === 'jira' ? `/${this.props.match.params.sub_skill}` : ''}?view=connection`)
        }
      }
    }

    if (prevProps.user_now != this.props.user_now) {
      this.setState({ currentUser: this.props.user_now });
    }
    //to handle channel name change in "channel defaults page"
    // if(this.props.channels != prevProps.channels){
    //   const parsedQueryString = queryString.parse(window.location.search);
    //   let skillView = {view:parsedQueryString.view};
    //   if(parsedQueryString.channel_id){
    //     const selectedChannel = this.props.channels.find(channel => channel.id == parsedQueryString.channel_id)
    //     skillView.channel_name = selectedChannel ? selectedChannel.name : parsedQueryString.channel_name;
    //     skillView.channel_id = parsedQueryString.channel_id
    //   }
    //   this.setState({ skillView })
    // }

    let qs = queryString.parse(window.location.search)
    if (this.props.location.search !== prevProps.location.search) {
      // console.log('skills',qs,prevProps);
      this.setState({skillView : qs})
    }
  }
  redirect = () => {
    let path = window.location.pathname;

    let obj = {
      "title": 'view',
      "url": path + `?view=connection`
    }
    window.history.pushState(obj, obj.title, obj.url);
    if (this.state.skillView.view !== 'connection')
      this.setState({ skillView: { view: 'connection' } })
  }

  setSkillView = () => {
    if (this.state.skillView.view !== 'connection')
    this.setState({ skillView: { view: 'connection' } })
  }

  // getHeader = () => {
  //   let info = {}
  //   if (this.props.match.params.skill_id) {

  //     let parsedQueryString = queryString.parse(window.location.search);

  //     let isJiraConnector = false;

  //     // if (this.state.jiraAdminUserData.user_id){
  //     //   console.log("this.state.jiraAdminUserData ", this.state.jiraAdminUserData);
  //     // }

  //     // if (this.state.currentUser._id){
  //     //   console.log("this.state.currentUser ", this.state.currentUser);
  //     // }

  //     if (this.state.jiraAdminUserData.user_id && this.state.currentUser._id) {
  //       if (this.state.jiraAdminUserData.user_id === this.state.currentUser._id) {
  //         isJiraConnector = true;
  //       }
  //     }

  //     // console.log('process.env.ZYNGA_WORKSPACE_ID',process.env)
  //     //id=Zynga
  //     // if((this.props.match.params.wId == "5f84c0d0b038174751d7b805"|| this.props.match.params.wId == "5da4544577360439548077eb") && this.props.currentSkill.name == 'Jira'){
  //     //   let isJiraAdmin = false
  //     //   let isZyngaWorkspace = true
  //     //   if(this.state.jiraAdminUserData.user_id){
  //     //     isJiraAdmin = this.state.jiraAdminUserData.user_id == this.props.user_now._id ? true : false
  //     //   }
  //     //   info = getHeaderInfo(this.props.currentSkill.name, this.props.currentSkill.skill_metadata ? this.props.currentSkill.skill_metadata.linked : this.props.currentSkill.linked, isJiraAdmin,isZyngaWorkspace)
  //     // }
  //     // else{
  //     info = getHeaderInfo(this.props.currentSkill.name, this.props.currentSkill.skill_metadata ? this.props.currentSkill.skill_metadata.linked : this.props.currentSkill.linked, null, isJiraConnector, this.state.isAdmin)
  //     // }
  //     //  info.isLinked = getHeaderInfo(this.props.currentSkill.name)
  //     info.defaultTab = parsedQueryString.view
  //     // this.setState({headerInfo:info,skillView:parsedQueryString,loading: false})


  //   } else {
  //     // console.log("headerelse")
  //     info = getHeaderInfo("main_page")
  //     let arr = window.location.pathname.split("/")
  //     info.defaultTab = arr[arr - 1]
  //     // console.log("header else",info)


  //   }
  //   //  console.log("inside header function",info,this.props.match.params.skill_id)
  //   return info
  // }
  onSkillClick = async skill => {
    //     this.props.getCurrentSkill(this.props.match.params.wId,this.props.match.params.skill_id).then(res=>{
    //       let info=getHeaderInfo(res.data.skill.name)
    //   info.defaultTab=parsedQueryString.view
    //   this.setState({headerInfo:info,skillView:parsedQueryString,loading: false})
    //  })
    if (skill.name.toUpperCase() === "GITLAB") {
      // console.log("clicked on gitlab");
      message.info('Coming Soon!');
      // ActivityLog.addActivityLog(this.props.workspace_id, "msg", "type", "value")
      return;
    }
    this.props.setCurrentSkill(skill)
    let info = getHeaderInfo(skill.name)
    let parsedQueryString = queryString.parse(window.location.search);
    info.defaultTab = parsedQueryString.view
    this.setState({ headerInfo: info, skillView: parsedQueryString, loading: false })
    // this.props.history.push({
    //   pathname: `/${this.props.match.params.wId}/skills/${skill.skill_metadata._id}`,
    //   state: { skill }
    // })

    /* another fix instead of commenting the abovr route push */
    /* finding sub skill from url */
    // let { pathname } = this.props.location;
    // let pathArr = pathname.split("/");
    // let sub_skill = pathArr[4]

    // this.props.history.push({
    //   pathname: `/${this.props.match.params.wId}/skills/${skill.skill_metadata._id}${sub_skill ? '/'+sub_skill : ''}`,
    //   state: { skill }
    // })


  };
  onTabClick = (key) => {
    if (this.props.match.params.skill_id) {
      let path = window.location.pathname;

      let obj = {
        "title": key,
        "url": path + `?view=${key}`
      }
      window.history.pushState(obj, obj.title, obj.url);
      this.setState({ skillView: { view: key } })
    } else {
      this.props.history.push("/" + this.props.match.params.wId + "/" + key)
    }



  }

  handleChange(tag, checked) {
    const { selectedTags } = this.state;
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter(t => t !== tag);
    // console.log("You are interested in: ", nextSelectedTags);
    this.setState({ selectedTags: nextSelectedTags });
  }
  closeModal = () => {
    this.setState({ showModal: false, selectedCardTemplate: {} });
  };
  onSkillEdit = (skill) => {
    this.setState({ showEditModal: true, selectedTemplate: skill })

  }
  closeEditModel = () => {
    this.setState({ showEditModal: false })
  }
  render() {
    const { assistant_skills } = this.props;
    // console.log("CurrentSKill",this.props);

    // const { selectedTags, selectedCardTemplate } = this.state;
    // const header = this.getHeader()
    // console.log("header",header)
    const filteredSkills = assistant_skills.filter(skill => (
      skill.type === "system"

    ))
    // let changeClassName = this.props.changeClassName ? "" : "skills_container"

    return (
      <Fragment>
        {/* <div className="page_wrapper"> */}
        <div >
          {/* <SideNavbar /> */}
          {this.state.loading ? <div style={{ marginLeft:0,height: "100vh", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", /*background: (localStorage.getItem('theme') == 'default' ? "#ffffff" : "black")*/ }}><Spin size="large" /></div> :
            <div className="main_skill_container" style={{  /*overflow: "auto",background: (localStorage.getItem('theme') == 'default' ? "#f0f2f5" : "black")*/ }}>
              {/* <<<<< page header for reports page will be handled in the coresponding component >>>>>> */}
              {(this.props.currentSkill.name === 'Jira'&&(this.state.skillView.view === 'reports' || this.state.skillView.view === "appHome" || this.state.skillView.view === 'personal_preferences')) ? '' : <Navbar title="Skills" cardtitle="New Skill" wId={this.props.match.params.wId} backButton={this.props.match.params.skill_id} /*headerInfo={header}*/ onTabClick={this.onTabClick} />}
              {/* <div className="skills_container"  style={{ overflow:"auto", height: "calc(100vh - 103px)"}}> */}
              <Layout className="main_skill_container" style={{ height: "100vh",  overflow: "auto",marginLeft: "0px",paddingBottom:50/*padding: "30px 100px", background: (localStorage.getItem('theme') == 'dark' ? "rgba(15,15,15)" : '#ffffff')*/ }}>
                {this.props.match.params.skill_id ? <Skill skill={this.props.currentSkill} skillView={this.state.skillView} /> :

                  <div>
                    <Paragraph>
                      Skills are capabilities of the Assistant. Click on one to configure.
    </Paragraph>
                    <Divider />

                    <Row gutter={[22, 22]} align="middle" >
                      {filteredSkills.map((skill, index) => {
                        return (
                          <CardHoverDetails
                            key={skill._id}
                            skill={skill}
                            logo={skill.logo.url}
                            onSkillClick={() => this.onSkillClick(skill)}
                            onSkillEdit={() => this.onSkillEdit(skill)}
                          />
                        );
                      })}
                    </Row>

                  </div>
                }
                {/* </div> */}
              </Layout>
            </div>}

          {/* {(this.props.currentSkill.linked === false) ? () => this.setState({ skillView: { view: 'connection' } }) : null} */}
          {(this.props.currentSkill.linked === false) ? this.setSkillView() : null}
        </div>
        {this.state.showEditModal && <EditSkill closeModal={this.closeEditModel} cardInfo={this.state.selectedTemplate} visible={this.state.showEditModal} />}
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    assistant_skills: state.skills.skills,
    currentSkill: state.skills.currentSkill,
    user_now: state.common_reducer.user,
    // isAdmin: state.common_reducer.isAdmin
  }
};

export default withRouter(
  connect(mapStateToProps, {
    getAssisantSkills,
    getCurrentSkill,
    // getSkillTemplates,
    createSkill,
    setCurrentSkill,
    getUser

  })(Skills)
);
