import React, { Component } from "react";
import { connect } from "react-redux";
import { setSidebar, getNotifications, makeNotificationsSeen, makeNotificationRead, makeGroupNotificationRead, markAllAsRead } from "./sidebarActions.js";
import { withRouter } from "react-router-dom";
import classnames from "classnames";
import closeImg from "../../../media/filter-sidebar-close.svg";
import trooprImg from "../../../media/troopr_guide.png";
import no_notif from "../../../media/no_notif.svg";
import moment from 'moment'
import { singleGrammer, groupGrammer } from '../../../utils/notificationGrammer'
import notifTypes from '../../../utils/notificationType.json'
import customToast from '../../common/customToaster';
// import customToaster from "../common/customToaster";
// import { setTaskDeletedNotifToaster, resetToaster } from '../tasks/task/taskActions';

// import { setWorkspace, getWorkspaceProject } from '../workspace/workspaceActions';
// import { getWorkspaceMembers } from "../workspace/members/workspaceMembershipActions";
import {getProjects} from '../projectActions.js';
// import { getTasks } from '../myspace/tasks/mytaskActions.js';
// import { getUsersSelectedTeamSync } from '../workspace/sidebar/appSidebarActions';


/*const CloseButton = ({ closeToast }) => (
  <span className="close-toaster-text" onClick={closeToast}>
    DISMISS
  </span>
);
*/

class NotificationSideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // isLoading:true,
      // isClikcedNotifDeleted:false
    };
    this.closeNotificationSidebar = this.closeNotificationSidebar.bind(this);
    this._renderNotifications = this._renderNotifications.bind(this);
    this.navigateToAction = this.navigateToAction.bind(this);
    this._getInitials = this._getInitials.bind(this);
  }


  closeNotificationSidebar() {
    this.props.setSidebar('');
  }
  componentWillMount() {
    this.props.makeNotificationsSeen()
  }

  _getInitials(string) {
    return string.trim().split(' ').map(function (item) {
      if (item.trim() !== "") {
        return item[0].toUpperCase()
      } else {
        return;
      }
    }).join('').slice(0, 2)
  };

  navigateToAction(notif) {
    this.props.makeNotificationRead(notif._id)
    if (notif.payload.url) {
      if(notif.type.match('TASK')){
        if(notif.payload.task.task_id){
          this.props.setSidebar('');
          this.props.history.push(notif.payload.url)
        }else{
          let splittedArray = notif.payload.url.split('/');
          this.props.history.push(splittedArray.slice(0, splittedArray.length - 2).join('/'));
          // this.props.resetToaster();
          // this.props.setTaskDeletedNotifToaster();
          // if(this.props.isTaskDeletedNotif) {
          //   customToast.fileTooLarge('Task not found', {
          //     className:
          //       "some-toast-box d-flex justify-content-between align-items-center"
          //   });
          // } else {
          //   customToast.taskDeleted('Task not found', {
          //     className:
          //       "some-toast-box d-flex justify-content-between align-items-center"
          //   });
          // }
          
          
          // this.props.history.push(notif.)
          // this.setState({isClikcedNotifDeleted:!this.state.isClikcedNotifDeleted})
          // customToast.deletedTaskNotif('Could not open this task.',{
          //   className:'some-toast-box d-flex justify-content-between align-items-center'
          // });
        }

      }else{
        let splittedArray = notif.payload.url.split('/');
        let isWorkspacePresent = this.props.workspaces.find(workspace => workspace._id === splittedArray[2]);
        if(isWorkspacePresent._id !== window.location.pathname.split('/')[2]) {
          // this.props.setWorkspace(isWorkspacePresent);
          // this.props.getWorkspaceProject(isWorkspacePresent._id);
          this.props.getProjects(isWorkspacePresent._id);
          // this.props.getWorkspaceMembers(isWorkspacePresent._id)
          // this.props.getTasks(isWorkspacePresent._id);
               this.props.getUsersSelectedTeamSync(isWorkspacePresent._id).then(res => {
                 if(res.data.success) {
                  this.props.setSidebar('');
                  this.props.history.push(notif.payload.url)
                 }
               })

        } else {
          this.props.setSidebar('');
          this.props.history.push(notif.payload.url)
        }
        
      }
    }
  }

  componentDidMount() {
    // console.log('this is the component');
    // this.props.getNotifications().then(res => {
    //   this.setState({isLoading:false})
    // })

  }

  _renderNotifications() {
    const { notifications } = this.props;
    if (notifications.length > 0) {
      return notifications.map(notif => {
        // return notifications[notifType].map(notif => {
        let notifGrammer;
        let todayNotif;
        let renderDate = notif.created_at;
        let renderDateStringFormat = renderDate.toLocaleString();
        let currentTime = new Date().toISOString();
        let currentDate = currentTime.split('T')[0];
        let renderDateOnly = renderDateStringFormat.split('T')[0];
        let date;
        if (currentDate === renderDateOnly) {
          todayNotif = true;
          date = moment(new Date(renderDate)).format('hh:mm a');
        } else {
          todayNotif = false;
          date = moment(new Date(renderDate)).format('DD MMM hh:mm a')
        }
        let param1;
        let param2;
        if (notif.grouped && notif.grouped.count > 0) {
          switch (notif.type) {
            case notifTypes.task_following:
            case notifTypes.task_assigned:
            case notifTypes.task_following_update:
            case notifTypes.task_delete:
              param1 = notif.payload && notif.payload.project && notif.payload.project.project_id ? notif.payload.project.project_id.name : ''
              break;
            case notifTypes.task_status:
              param1 = notif.payload && notif.payload.task && notif.payload.task.task_id && notif.payload.task.task_id.project_id ? notif.payload.task.task_id.project_id.name : ''
              break;
            case notifTypes.file_uploaded:
            case notifTypes.project_name_updated:
            case notifTypes.project_member_added:
            case notifTypes.project_teamsync_new_post:
            case notifTypes.project_teamsync_comment:
            case notifTypes.project_teamsync_mention:
            case notifTypes.project_teamsync_like:
              param1 = notif.payload && notif.payload.project && notif.payload.project.project_id ? notif.payload.project.project_id.name : ''
              break;
            case notifTypes.workspace_name_change:
            case notifTypes.workspace_member_added:
            case notifTypes.workspace_teamsync_new_post:
            case notifTypes.workspace_teamsync_comment:
            case notifTypes.workspace_teamsync_mention:
            case notifTypes.workspace_teamsync_like:
              param1 = notif.payload && notif.payload.workspace && notif.payload.workspace.workspace_id ? notif.payload.workspace.workspace_id.name : ''
              break;
            default:
              break;
          }
          notifGrammer = groupGrammer(notif.type, notif.grouped.count, param1);
        } else {
          switch (notif.type) {
            case notifTypes.task_assigned:
              try {
                param1 = (notif.payload.task.assgined_to.displayName||notif.payload.task.assgined_to.name);
                param2 = notif.payload.task.task_id.name.length > 80 ? notif.payload.task.task_id.name.slice(0, 79) + "..." : notif.payload.task.task_id.name;
              } catch (e) {
                param1 = '';
                param2 = '';
              }
              break;
            case notifTypes.task_delete:
              try {
                param1 = notif.payload.task.task_name.length > 80 ? notif.payload.task.task_name.slice(0, 79) + "..." : notif.payload.task.task_name;
                // param1 = notif.payload.task_name
              } catch (e) {
                param1 = ''
              }
              break;
            case notifTypes.task_status:
              try {
                param1 = notif.payload.task.status_to
                param2 = notif.payload.task.status_from
              } catch (e) {
                param1 = ''
                param2 = ''
              }
              break;
            case notifTypes.task_comment:
              try {
                param1 = notif.payload.task.task_id.name.length > 80 ? notif.payload.task.task_id.name.slice(0, 79) + "..." : notif.payload.task.task_id.name;

              } catch (e) {
                param1 = ''
              }
              break;
            case notifTypes.project_name_updated:
              try {
                param1 = notif.payload.project.prev_name
                param2 = notif.payload.project.updated_name
              } catch (e) {
                param1 = ''
                param2 = ''
              }
              break;
            case notifTypes.project_member_added:
              try {
                param1 = (notif.payload.project.member_name.displayName||notif.payload.project.member_name.name)
                param2 = notif.payload.project.project_id.name
              } catch (e) {
                param1 = ''
                param2 = ''
              }
              break;
            case notifTypes.workspace_name_change:
              try {
                param1 = notif.payload.workspace.prev_name
                param2 = notif.payload.workspace.updated_name
              } catch (e) {
                param1 = ''
                param2 = ''
              }
              break;
            case notifTypes.workspace_member_added:
              try {
                param1 = (notif.payload.workspace.member_name.displayName||notif.payload.workspace.member_name.name)
                param2 = notif.payload.workspace.workspace_id.name
              } catch (e) {
                param1 = ''
                param2 = ''
              }
              break;
            case notifTypes.file_uploaded:
              try {
                param1 = notif.payload.project.project_id.name
              } catch (e) {
                param1 = ''
              }
              break;
            case notifTypes.workspace_teamsync_new_post:
            case notifTypes.workspace_teamsync_comment:
            case notifTypes.workspace_teamsync_mention:
            case notifTypes.workspace_teamsync_like:
            case notifTypes.workspace_teamsync_reminder:
              try {
                param1 = notif.payload.workspace.workspace_id.name
              } catch (e) {
                param1 = ''
              }
              break;
            case notifTypes.project_teamsync_new_post:
            case notifTypes.project_teamsync_comment:
            case notifTypes.project_teamsync_mention:
            case notifTypes.project_teamsync_like:
            case notifTypes.teamsync_reminder:
              try {
                param1 = notif.payload.teamsync.teamsync_id.name
              } catch (e) {
                param1 = ''
              }
              break;
            case notifTypes.task_comment_mention:
              try {
                param1 = notif.payload.actor_id.name;
              } catch (e) {
                param1 = '';
              }
              break;
            case notifTypes.task_section_moved:
              try {
                param1 = notif.payload.task.moved_to ? notif.payload.task.moved_to.name : 'unknown';
                param2 = notif.payload.task.moved_from ? notif.payload.task.moved_from.name : 'unknown';
              } catch (e) {
                param1 = '';
                param2 = '';
              }
              break;
            case notifTypes.task_following_update:
              try {
                param1 = notif.payload.task.task_id.name.length > 80 ? notif.payload.task.task_id.name.slice(0, 79) + "..." : notif.payload.task.task_id.name;
                param2 = notif.actor_id.name;
              }
              catch (e) {
                param1 = '';
                param2 = '';
              }
            case notifTypes.task_following:
              try{
                param1 = notif.payload.task.task_id.name.length > 80 ? notif.payload.task.task_id.name.slice(0, 79) + "..." : notif.payload.task.task_id.name;
              }
              catch(e){
                param1 = '';
              }
            default:
              break;
          }
          notifGrammer = singleGrammer(notif.type, param1, param2);
        }
        return (
          <div className="notify-item" style={{ background: notif.status === 'unread' ? 'rgba(66, 44, 136, 0.04)' : '#ffffff' }} onClick={() => this.navigateToAction(notif)}>
            <div className=" d-flex align-items-center justify-content-center notify-img">
              {
                notif.action && notif.action === 'group'
                  ?
                  notif.user_id.profilePicUrl
                    ? (<img className="profilepic_sidebar notif_user_img" src={notif.user_id.profilePicUrl} alt="profile" />)
                    : (<div className="profilepic_member_search_notif d-flex align-items-center justify-content-center">
                      {(notif.user_id.displayName||notif.user_id.name) && (<div>{this._getInitials(notif.user_id.displayName||notif.user_id.name)}</div>)}
                    </div>)
                  :
                  notif.type === notifTypes.project_teamsync_reminder || notif.type == notifTypes.workspace_teamsync_reminder
                    ?
                    <img className="profilepic_sidebar notif_user_img" src={trooprImg} alt="troopr" />
                    :
                    notif.actor_id.profilePicUrl
                      ? (<img className="profilepic_sidebar notif_user_img" src={notif.actor_id.profilePicUrl} alt="profile" />)
                      : (<div className="profilepic_member_search_notif d-flex align-items-center justify-content-center">
                        {(notif.actor_id.name) && (<div>{this._getInitials(notif.actor_id.name)}</div>)}
                      </div>)
              }
            </div>
            <div className="notify-details">
              <p style={{whiteSpace: "pre-wrap"}}> 
               <span className="notify_actor_name" >
                 {(notif.grouped && notif.grouped.count > 0) || notif.type === notifTypes.task_following_update || notif.type === notifTypes.project_teamsync_reminder || notif.type === notifTypes.workspace_teamsync_reminder || notif.type === notifTypes.task_delete ? '' : notif.actor_id.name}
               </span>{notifGrammer}
               <span>{notif.type === notifTypes.task_delete ? notif.actor_id.name : '' }</span>
               </p>
              <p className="notify-date"> {notif.status === 'unread' ? <div className="Oval-Copy"></div> : ''}{todayNotif ? <span className="today-date-span">Today at </span> : ''}{date}</p>
            </div>
          </div>
        )

        // })
      })
    } else {
      return (
        <div className="no_notif_div">
          <img src={no_notif} alt=""/>
          <p>It’s so quiet here.</p>
          <p className="no_notif_count">You have 0 new notifications</p>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="filter-sidebar notif-sidebar" style={{marginTop:'13px'}}>
        <div className={classnames(
          "d-flex flex-row justify-content-between align-items-center notification-title",
          {
            "spac-task":
              this.props.location.pathname === "/myspace/tasks" ||
              this.props.location.pathname === "/myspace/calendar" ||
              this.props.location.pathname === "/myspace/notes" ||
              this.props.location.pathname === "/myspace/social" ||
              this.props.location.pathname === "/myspace/teamSync"
          },
          {
            'notif_header_picker':
              this.props.location.pathname === '/projects/picker'
          },
          {
            "backlog-task":
              this.props.location.pathname.match(`/workspace/${this.props.match.params.id}`) ? true : false

          }
        )}
        >
          <div className="notification-title-text">Notifications</div>
          <span className="notification-close" onClick={this.closeNotificationSidebar}>
            <img className="sidebar-close-btn" src={closeImg} alt=""/>
          </span>
        </div>
        <div className="notify-holder">
          {this._renderNotifications()}
        </div>
        <div className="markAsRead" onClick={this.props.markAllAsRead}>
          Mark all as read
        </div>
        {/* {this.state.isClikcedNotifDeleted && 
        <ToastContainer
        hideProgressBar
        closeButton={<CloseButton />}
        position="bottom-left"
      />
        } */}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    notifications: state.taskPreferences.notifications,
    project: state.projects.project,
    // isTaskDeletedNotif: state.task.isTaskDeletedNotif,
    workspaces: state.common_reducer.workspaces
  };
}

export default withRouter(connect(
  mapStateToProps,
  {
    setSidebar,
    getNotifications,
    makeNotificationsSeen,
    makeNotificationRead,
    makeGroupNotificationRead,
    markAllAsRead,
    // setTaskDeletedNotifToaster,
    // resetToaster,
    // setWorkspace,
    // getWorkspaceMembers,
    getProjects,
 
    // getUsersSelectedTeamSync,
    // getWorkspaceProject
  }
)(NotificationSideBar));
