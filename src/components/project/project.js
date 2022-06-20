import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import queryString from "query-string";
import { CheckOutlined, RedoOutlined, SettingOutlined, TableOutlined, TeamOutlined } from '@ant-design/icons';
import { Layout, Menu, Button, PageHeader, Select,Tabs } from "antd";
import { Icon as LegacyIcon } from '@ant-design/compatible';

import ProjectTasks from "./tasks/ProjectTasks";
import Status from "./Status/status"

import {
  // setTagValue,
  // setMembers,
  // setUnassigned
} from "./sidebar/filter_sidebar_actions";
import { getTag } from "./tasks/tags/TagAction";
import {
  getProject,
  // updateProject,
  // leaveProject,
  import_project,
  getProjects,
  recentProjects,
  // getRecentProjects
} from "./projectActions.js";
import {
  getMembers,
  // getProjectInvites,
  // getProjectShareUrl
} from "./projectMembers/projectMembershipActions";
import {
  setSidebar,
  // getNotifications 
} from "./sidebar/sidebarActions";
import { setTask } from "./tasks/task/taskActions";
import {
  getTrooprProject,
  // getWorkspaceMembers,
  // getSkillConnectUrl,
  // getSkillId,
  // saveDataTrooprConfigs,
  // getTrooprChannelConfig
} from "../skills/skills_action";

import SquadMembers from "./projectMembers/squadmembers"
import SquadSettings from "./squadsettings";
const { TabPane } = Tabs;

class Project extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      collapsed: true,
      subview: "active",
      currentActiveKey:"1",
      // moveTasks: [],
      // loadingMove: false,
    }
  }

  componentDidMount() {
    const {
      getProject,
      getMembers,
      getTag,
      setSidebar,
      setTagValue,
      setMembers,
      setUnassigned,
      // getNotifications,
    } = this.props;

    let parsedQueryString = queryString.parse(window.location.search);
    if(parsedQueryString.view  && (parsedQueryString.view =='settings'||'members'||'status'||'active'||'backlog')){
      this.setState({subview:parsedQueryString})
      if(parsedQueryString.view =='settings'){
        this.setState({currentActiveKey:"4"})
      }else if(parsedQueryString.view =='status'){
        this.setState({currentActiveKey:"3"})
      }else if(parsedQueryString.view =='active'){
        this.setState({currentActiveKey:"1"})
      }else if(parsedQueryString.view =='backlog'){
        this.setState({currentActiveKey:"2"})
      }
    }

    if (parsedQueryString && parsedQueryString.view) {
      this.setState({ subview: parsedQueryString.view })
    }

    getProject(this.props.match.params.pId, this.props.match.params.wId).then(res => {
      if (res.response && res.response.status == 401) {
        this.props.history.push('/error/project');
      }
      if (res && res.data && res.data.success) {
        //   if (this.state.tempProjectData.color !== res.data.project.color || this.state.tempProjectData.name !== res.data.project.color || this.state.tempProjectData.icon !== res.data.project.icon) {

        // getWorkspaceMembers(res.data.project.workspace_id._id);
        // getWorkspaceInvites(res.data.project.workspace_id._id);

        this.setState({
          name: res.data.project.name,
          icon: res.data.project.icon,
          isLoading: false
        });
      }
    })

    //set saved filter
    // getMembers(this.props.match.params.pId, this.props.match.params.wId).then(res => {
    //   if (res && res.data && res.data.success) {
    //     let currentUser = res.data.members.find(member => member.user_id._id === this.props.user._id)
    //     if (currentUser) {
    //       this.setState({ filter_value: currentUser.filter_value });
    //     }

    //     if (window.location.search != "") {
    //       var tempAssigneeArray = [];
    //       let params = window.location.search.substr(1).split("&");
    //       let split_params = params.map(item => item.split("="));
    //       for (let i = 0; i < split_params.length; i++) {
    //         if (split_params[i][0] === "member") {
    //           tempAssigneeArray.push(split_params[i][1]);
    //         }
    //       }
    //       // console.log('check tempAssignee Array', tempAssigneeArray);
    //       for (let j = 0; j < res.data.members.length; j++) {
    //         for (let k = 0; k < tempAssigneeArray.length; k++) {
    //           if (res.data.members[j].user_id._id === tempAssigneeArray[k]) {

    //             setMembers(res.data.members[j]);
    //           } else if (tempAssigneeArray[k] === "UA") {
    //             setUnassigned(true);
    //           }
    //         }
    //       }
    //     }
    //   }
    // })

    getTag(this.props.match.params.wId).then(res => {
      if (res.data.success) {
        if (window.location.search != "") {
          let tempTagsArray = [];
          let params = window.location.search.substr(1).split("&");
          let split_params;
          // if (params[0] !== "") {
          split_params = params.map(item => item.split("="));
          // }else{
          //   let filter_params = localStorage.getItem(`filter${projectData._id}`)
          //   split_params = filter_params.substr(1).split('&').map(item => item.split('='))

          // }
          for (let i = 0; i < split_params.length; i++) {
            if (split_params[i][0] === "tags") {
              tempTagsArray.push(split_params[i][1]);
            }
          }
          for (let k = 0; k < tempTagsArray.length; k++) {
            setTagValue(tempTagsArray[k]);
          }
        }
      }
    })



    // toggleLoader(true);
    if (window.location.search) {
      let qs = queryString.parse(window.location.search);
      if (qs.activity == "show") {
        setSidebar("activity");
      }
    }
  }

  handlePageChange(query) {
    this.setState({ selectedPage: query });
    let obj = {
      title: query,
      url: `/${this.state.common_reducerId}/squad/${this.props.match.params.id}/${query}`
    };
    window.history.pushState(obj, obj.title, obj.url);
    // this.props.history.push(`/project/${this.props.match.params.id}/${query}`);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.pId != this.props.match.params.pId) {
      this.setState({ subview: 'active' })
    }
        // to handle sidebar tab change
        if(this.props.location.search !== prevProps.location.search){
          let subview = this.props.location.search.split('=')[1]
          this.setState({subview : subview || 'active'})
        }
  }

  //   componentDidUpdate(prevProps, prevState) {
  //     if (this.state.id !== window.location.pathname.split('/')[4]) {
  //       this.setState({ id: window.location.pathname.split('/')[4] });
  //     }

  //     if (!prevProps.location.pathname.match('/tasks') && this.props.location.pathname.match('/tasks')) {
  //       let currentUser = this.props.projectMembers.find(member => member.user_id._id === this.props.user._id)
  //       if (currentUser) {
  //         this.setState({ filter_value: currentUser.filter_value });
  //       }
  //       // if(window.location.pathname.match('/tasks')){
  //       //   let obj = {
  //       //     title: 'filter_values',
  //       //     url: `${window.location.pathname}${currentUser.filterValue}` 
  //       //   }
  //       //   window.history.pushState(obj, obj.title, obj.url);
  //       // }

  //       if (window.location.search != "") {
  //         var tempAssigneeArray = [];
  //         let params = window.location.search.substr(1).split("&");
  //         let split_params = params.map(item => item.split("="));
  //         for (let i = 0; i < split_params.length; i++) {
  //           if (split_params[i][0] === "member") {
  //             tempAssigneeArray.push(split_params[i][1]);
  //           }
  //         }
  //         // console.log("tempAsssgne array", tempAssigneeArray)
  //         for (let j = 0; j < this.props.projectMembers.length; j++) {
  //           for (let k = 0; k < tempAssigneeArray.length; k++) {
  //             if (this.props.projectMembers[j].user_id._id === tempAssigneeArray[k]) {
  //               // console.log('check filter of member',this.props.projectMembers[j]);
  //               this.props.setMembers(this.props.projectMembers[j]);
  //             } else if (tempAssigneeArray[k] === "UA") {
  //               this.props.setUnassigned(true);
  //             }
  //           }
  //         }
  //       }
  //     }
  //     if (this.props.match.params.pId !== prevProps.match.params.pId) {
  //       console.log("new squad..")
  //       const {
  //         getProject,
  //         getMembers,
  //         getTag,
  //         setSidebar,
  //         setTagValue,
  //         setMembers,
  //         setUnassigned,
  //       } = this.props;
  //       const newWId = prevProps.match.params.wId
  //       const newSquadId = prevProps.match.params.pId

  //       // if (!this.windowPath) {
  //       //   let obj = {
  //       //     title: this.state.selectedPage,
  //       //     url: `/project/${id}/${this.state.selectedPage}`
  //       //   };
  //       //   window.history.pushState(obj, obj.title, obj.url);
  //       // }

  //       getProject(newSquadId,newWId).then(res => {
  //         if (res && res.data && res.data.success) {
  //           // this.setState({
  //           //   name: res.data.project.name,
  //           //   icon: res.data.project.icon,
  //           //   isLoading: false
  //           // })

  //           getTag(res.data.project.workspace_id._id).then(res => {
  //             if (res.data.success) {
  //               if (window.location.search != "") {
  //                 let tempTagsArray = [];
  //                 let params = window.location.search.substr(1).split("&");
  //                 let split_params;
  //                 // if (params[0] !== "") {
  //                 split_params = params.map(item => item.split("="));
  //                 // }else{
  //                 //   let filter_params = localStorage.getItem(`filter${projectData._id}`)
  //                 //   split_params = filter_params.substr(1).split('&').map(item => item.split('='))

  //                 // }
  //                 for (let i = 0; i < split_params.length; i++) {
  //                   if (split_params[i][0] === "tags") {
  //                     tempTagsArray.push(split_params[i][1]);
  //                   }
  //                 }
  //                 for (let k = 0; k < tempTagsArray.length; k++) {
  //                   setTagValue(tempTagsArray[k]);
  //                 }
  //               }
  //             }
  //           });
  //         } else {
  //           this.setState({ isLoading: false },
  //             //   () => {
  //             //   this.props.history.push("/error/member");
  //             // }
  //           );
  //         }
  //       })

  //       getMembers(newSquadId,newWId).then(res => {
  //         if (res && res.data && res.data.success) {
  //           let currentUser = res.data.members.find(member => member.user_id._id === this.props.user._id)
  //           if (currentUser) {
  //             this.setState({ filter_value: currentUser.filter_value });
  //           }
  //           if (window.location.search != "") {
  //             var tempAssigneeArray = [];
  //             let params = window.location.search.substr(1).split("&");
  //             let split_params = params.map(item => item.split("="));
  //             for (let i = 0; i < split_params.length; i++) {
  //               if (split_params[i][0] === "member") {
  //                 tempAssigneeArray.push(split_params[i][1]);
  //               }
  //             }
  //             // console.log("tempAsssgne array", tempAssigneeArray)
  //             for (let j = 0; j < res.data.members.length; j++) {
  //               for (let k = 0; k < tempAssigneeArray.length; k++) {
  //                 if (res.data.members[j].user_id._id === tempAssigneeArray[k]) {
  //                   // console.log('check filter of member',res.data.members[j]);
  //                   setMembers(res.data.members[j]);
  //                 } else if (tempAssigneeArray[k] === "UA") {
  //                   setUnassigned(true);
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       });

  //   }
  // }

  toggleSquadMenu = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  switchSubView = e => {
    let toView = e.key ? e.key : e;
    this.setState({
      subview: toView
    });
    // if(toView!=="active"){
      // console.log("hello is here")
this.props.setSidebar("")
    // }
    this.props.history.push(`/${this.props.match.params.wId}/squad/${this.props.match.params.pId}/tasks?view=${toView}`)
  };

  onTabChange = (key) => {
    this.setState({currentActiveKey:key.toString()})
    if(key==1){
      this.setState({subview: "active"});
      this.props.history.push(`/${this.props.match.params.wId}/squad/${this.props.match.params.pId}/tasks?view=active`)
    }else if(key==2){
      this.setState({subview: "backlog"});
      this.props.history.push(`/${this.props.match.params.wId}/squad/${this.props.match.params.pId}/tasks?view=backlog`)
    }
    else if(key==3){
      this.setState({subview: "status"});
      this.props.history.push(`/${this.props.match.params.wId}/squad/${this.props.match.params.pId}/tasks?view=status`)
    }
    else if(key==4){
      this.setState({subview: "settings"});
      this.props.history.push(`/${this.props.match.params.wId}/squad/${this.props.match.params.pId}/tasks?view=settings`)
    }
  }

  render() {
    // console.log("assistant_skills====>",this.props.project)
    const { project, members, assistant_skills } = this.props
    return (
      // <Layout>
        <Layout
          style={{
            // background: (localStorage.getItem('theme') == 'default' ? "#ffffff" : "rgba(15,15,15)"),
            overflowY: "hidden",
            // height: "calc(100vh - 64px)",
            height: "100vh",
            marginLeft:250
          }}
        >
          <PageHeader
          ghost={false}
          title={project && project.name}
          footer={
            <Tabs defaultActiveKey="1" activeKey={this.state.currentActiveKey} onChange={this.onTabChange}>
              <TabPane tab="Active Tasks" key="1" />
              <TabPane tab="Plan" key="2" />
              <TabPane tab="Status" key="3" />
              <TabPane tab="Settings" key="4" />
            </Tabs>
          }
        />
          <Fragment>
            <div
            // style={{
            //   paddingLeft: 24,
            //   paddingTop: 16,
            //   // zIndex: "9", 
            //   // overflowX: "scroll",
            //   // overflowY:'hidden'
            // }}
            >
              {
                this.state.subview == "active" ?
                  <ProjectTasks toggleSquadMenu={this.toggleSquadMenu} squadMenuCollapsed={this.state.collapsed} backlog={false} subview={this.state.subview} />
                  : this.state.subview == 'backlog' ?
                    <ProjectTasks toggleSquadMenu={this.toggleSquadMenu} squadMenuCollapsed={this.state.collapsed} backlog={true} showMoveToButton={this.showMoveToButton} subview={this.state.subview} />
                    : this.state.subview == 'status' ?
                      <Status toggleSquadMenu={this.toggleSquadMenu} squadMenuCollapsed={this.state.collapsed} />
                      : this.state.subview == 'members' ?
                        <SquadMembers toggleSquadMenu={this.toggleSquadMenu} squadMenuCollapsed={this.state.collapsed} />
                        : this.state.subview == 'settings' ?
                          <SquadSettings toggleSquadMenu={this.toggleSquadMenu} squadMenuCollapsed={this.state.collapsed} />
                          : ''

              }
            </div>
          </Fragment>
        </Layout>
        // </Layout>
    );
  }

}

const mapStateToProps = state => ({
  project: state.projects.project,
  members: state.skills.members,
  assistant_skills: state.skills,
  user: state.common_reducer.user,
  projectMembers: state.projectMembership.members,

});

export default withRouter(
  connect(mapStateToProps, {
    // getSkillConnectUrl,
    // getSkillId,
    // saveDataTrooprConfigs,
    // getTrooprChannelConfig,
    // getProjectShareUrl,
    // getProjectInvites,
    // updateProject,
    // leaveProject,
    setSidebar,
    // setTask,
    // setMembers,
    // setUnassigned,
    // getNotifications,
    // setTagValue,
    getProject,
    getMembers,
    getTag,
    // getRecentProjects,
    // moveToActive
  })(Project)
);
