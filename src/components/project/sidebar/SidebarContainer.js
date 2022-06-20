import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Validator from 'validator';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setSidebar } from './sidebarActions';

import ProjectSidebar from './project/ProjectSidebar';
import TaskSidebar from './task/TaskSidebar';
import FileChat from './file/FileChat';
// import FilterSideBar from './filter_sidebar';
import NotificationSideBar from './notificationSidebar';

import './sidebar.css';
import FileSidebar from './file/fileSidebar';
import ActivitySidebar from './taskActivity/ActivitySidebar';
// import TeamSyncSideBar from './teamSync/team_sync_filter_sidebar';
import queryString from 'query-string';
// import MySpaceTeamSycFilter from '../myspace/teamSync/MySpaceTeamSyncFilter';
// import WorkspaceTeamSyncFilter from '../workspace/workspace_setting/team_sync/WorkspaceTeamSyncFilter';
// import WorkspaceAnalyticsFilter from '../workspace/workspace_setting/team_sync/WorkspaceAnalyticsFilter';


class SidebarContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true
    }

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.setShow = this.setShow.bind(this);
  }

  componentDidMount() {
    // console.log('shccek sidebar mount');
    this.sidebar_dropdown = document.getElementsByClassName('sidebar_dropdown');
    this.filterButton = document.getElementsByClassName('for-selecting-filter');
    this.popoverButton = document.getElementsByClassName('custom-popover');
    this.popoverButton2 = document.getElementsByClassName('add-tag-options');
    this.deleteModal = document.getElementsByClassName('modal-content');
    // this.task_box=document.getElementsByClassName('task_item_card');
    // this.task_box_active=document.getElementsByClassName('task-box-focus');



    document.addEventListener('mousedown', this.handleClickOutside);
  }



  componentWillUnmount() {
    this.filterButton = [];
    this.popoverButton = [];
    this.popoverButton2 = [];
    this.deleteModal = [];
    this.task_box = [];
    // this.task_box_active = [];
    document.removeEventListener('mousedown', this.handleClickOutside);

  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(e) {
    const {workspace} = this.props;

    let iSidebarElement = false
    // console.log(e.target)
    // console.log(e.target.className)
    for (let i = 0; i < this.sidebar_dropdown.length; i++) {

      if (this.sidebar_dropdown[i].contains(e.target)) {
        iSidebarElement = true
      }
    }
    if ((iSidebarElement || this.filterButton.length > 0 && this.filterButton[0].contains(e.target)) || (this.popoverButton.length > 0 && this.popoverButton[0].contains(e.target)) || (this.popoverButton2.length > 0 && this.popoverButton2[0].contains(e.target)) || (this.deleteModal.length > 0 && this.deleteModal[0].contains(e.target)) || (this.props.sidebar == "task" && e.target.className && e.target.className.toString().search("task_item_card") > -1)) {
      // console.log("hello hello this is whewr i am sleeping")
      //  e.stopPropagation();
    } else {
      if (this.wrapperRef && !this.wrapperRef.contains(e.target) && this.state.show) {
        if (this.props.sidebar != '') {
          if (window.location.pathname.match('/myspace/tasks/') && window.location.pathname.match('/myspace/tasks/').length > 0) {
            let obj = {
              title: 'Close_Sidebar_Blur',
              url: `/workspace/${workspace._id}/myspace/tasks${window.location.search}`
            }
            this.props.setSidebar('');
            window.history.pushState(obj, obj.title, obj.url)
          } else if (window.location.pathname.match('/squad/') && window.location.pathname.match('/squad/').length > 0) {
            // console.log("runnign this",window.location.search);
            
            let loc = window.location.pathname.split("/");
            // console.log(loc)
            let qs = queryString.parse(window.location.search);
            if (loc[loc.length - 1] !== 'tasks' && loc[loc.length - 1].length == 24 && (loc[loc.length - 2] ? loc[loc.length - 2] !== 'folder' : true && qs.activity !== "show")) {
              // console.log("jhello tjhis is here")
              loc.splice(loc.length - 1, 1);
              let new_loc = loc.join("/");
              let obj = {
                title: "Close_Sidebar_Blur",
                url: `${new_loc}${window.location.search}`
              };
              this.props.setSidebar('', false);
              window.history.pushState(obj, obj.title, obj.url);
            } else if (qs.activity == "show") {
              let obj = {
                title: "close_activity_sidebar",
                url: this.props.location.pathname
              }
              this.props.setSidebar('');
              window.history.pushState(obj, obj.title, obj.url);
            } else {
              this.props.setSidebar('');
            }
          } else {
            this.props.setSidebar('');
          }
        }
      }
    }
  }

  setShow = show => {
    this.setState({ show: show });
  }

  components = {

    'project': <ProjectSidebar setShow={this.setShow} />,
    'task': <TaskSidebar setShow={this.setShow} />,
    // 'file': <FileSidebar setShow={this.setShow} />,

    // 'filter': <FilterSideBar setShow={this.setShow} />,
    // 'TeamSyncfilter' : <TeamSyncSideBar setShow={this.setShow}/>,
    'notification': <NotificationSideBar setShow={this.setShow} />,
    // 'fileChat': <FileChat setShow={this.setShow} />,
    'activity': <ActivitySidebar setShow={this.setShow} />,
    // 'mySpaceTeamSyncFilter': <MySpaceTeamSycFilter />,
    // 'workspaceTeamSyncFilter': <WorkspaceTeamSyncFilter />,
    // 'workspaceAnalyticsFilter': <WorkspaceAnalyticsFilter />
  }

  render() {
    const isVisible = !Validator.isEmpty(this.props.sidebar);
    const { sidebar, isFilterSidebar, isTeamSyncFileter, isMySpaceTeamSyncFilter, isWorkspaceTeamSyncFilter, isWorkspaceAnalyticsFilter } = this.props;

    if (isFilterSidebar || isTeamSyncFileter || isMySpaceTeamSyncFilter || isWorkspaceTeamSyncFilter || isWorkspaceAnalyticsFilter) {
      return (<div className={classnames({ 'sidebar-filter': isVisible }, { 'hidden-xl-down': !isVisible })} ref={this.setWrapperRef}>
        {this.components[sidebar]}
      </div>);
    }
    else {
      return (<div className={classnames({ 'sidebar': isVisible }, { 'hidden-xl-down': !isVisible })} ref={this.setWrapperRef}>
        {this.components[sidebar]}
      </div>);
    }
  }
}

SidebarContainer.propTypes = {
  sidebar: PropTypes.string.isRequired,
  setSidebar: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const { sidebar, isFilterSidebar, isTeamSyncFileter, isMySpaceTeamSyncFilter, isWorkspaceTeamSyncFilter, isWorkspaceAnalyticsFilter } = state.sidebar;
  return {
    sidebar,
    isFilterSidebar,
    isTeamSyncFileter,
    isMySpaceTeamSyncFilter,
    isWorkspaceTeamSyncFilter,
    isWorkspaceAnalyticsFilter,
    workspace: state.common_reducer.workspace
  };
}

export default withRouter(connect(mapStateToProps, { setSidebar })(SidebarContainer));
