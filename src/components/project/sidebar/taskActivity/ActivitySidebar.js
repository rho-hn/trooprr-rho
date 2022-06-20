import React, { Component } from "react";
import "../../activity/ProjectActivity.css";
import "./activitySidebar.css";

import {
  getProjectActivities,
  removeProjectActivities
} from "../../projectActions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";


import activityActions from "../../../../utils/activityActions.json";
import activityGrammer from "../../../../utils/projectActivityGrammer.js";
import moment from "moment";

import PropTypes from "prop-types";
import { getTaskFile, getProjectFile, setSidebar } from "../sidebarActions";

var compared_date = "";
class ProjectActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skip: 0,
      limit: 20
    };
  
    this._renderActivities = this._renderActivities.bind(this);
    this.closeSidebar = this.closeSidebar.bind(this);
    // this._renderSingleActivity = this._renderSingleActivity.bind(this);
    this.onScrollFunc = this.onScrollFunc.bind(this);
  }

  onScrollFunc(e) {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && this.props.total_activities > this.state.skip) {
      // this.props.toggleLoader(true);
      this.props
        .getProjectActivities(
          // this.props.match.params.id,
          window.location.pathname.split("/")[4],
          this.state.skip,
          this.state.limit,
          this.props.match.params.wId
        )
        .then(res => {
          // this.props.toggleLoader(false);
          if (res.data && res.data.success) {
            this.setState({ skip: this.state.skip + this.state.limit });
          }
        });
    }
  }

  componentWillUnmount() {
    this.props.removeProjectActivities();
  }

  componentDidMount() {
    // console.log("Props",this.props);
    const id = this.props.location.pathname.split("/")[4];
    this.props
      .getProjectActivities(id, this.state.skip, this.state.limit,this.props.match.params.wId)
      .then(res => {
        // this.props.toggleLoader(false);
        if (res.data && res.data.success) {
          this.setState({ skip: this.state.skip + this.state.limit });
        }
      });
  }

  closeSidebar() {
    this.props.setSidebar("");
    let obj = {
      title: "Close_Sidebar_Blur",
      url: this.props.location.pathname
    };
    window.history.pushState(obj, obj.title, obj.url);
  }

  // _renderLoader() {
  //   if (this.props.loader) {
  //     return <Loader />;
  //   }
  // }

  _renderActivities() {
    // let req_arr = .filter(item => item.project_id);
    let compared_date = "";
    if (this.props.project_activities.length > 0) {
      // let project_activities = this.props.project_activities.filter((item) => item.action !== "ATTACHMENT_UPDATED")
      return this.props.project_activities.map((item, index) => {
        if (item) {
          if (item.task_id) {
            let proj_type;
            let param2 = "";
            let param3 = "";
            let req_actor = this.props.members.filter(
              member => member.user_id._id === item.actor_id._id
            );
            let actor;
            let activ_val = "";
            let task_name = "";
            let file_attach = "";

            if (req_actor.length > 0) {
              actor = item.actor_id.name;
            } else {
              actor = "Unknown user";
            }

            if (item.project_id.type && item.project_id.type == "sprint") {
              proj_type = "sprint";
            } else {
              proj_type = "project";
            }
            if (item.action == activityActions.project.status_updated) {
              param2 = item.additional_parameters.project_status;
            } else if (item.action == activityActions.project.member_added) {
              param2 = item.additional_parameters.member_added.member_id.name;
            } else if (item.action == activityActions.project.member_left) {
              param2 = item.additional_parameters.member_left.name;
            } else if (item.action == activityActions.project.endDate_updated) {
              param2 = moment(
                new Date(item.additional_parameters.project_end_date)
              ).format("DD MMM YYYY");
            } else if (item.action == activityActions.task.status_updated) {
              param2 = item.additional_parameters.status_to;
              task_name = item.task_id.name;
            } else if (item.action == activityActions.task.assigned_to) {
              param2 = item.additional_parameters.assigned_to.name;
              task_name = item.task_id.name;
            } else if (
              item.action == activityActions.project.attachment_added
            ) {
              file_attach = item.additional_parameters.project_attachment
                ? item.additional_parameters.project_attachment.name
                : "";
            } else if (item.action == activityActions.task.due_date_updated) {
              task_name = item.task_id.name;
            } else if (
              item.action == activityActions.project.moved &&
              item.additional_parameters.project_moved_from
            ) {
              param2 = item.additional_parameters.project_moved_from
                ? item.additional_parameters.project_moved_from.name
                : "";
              param3 = item.additional_parameters.project_moved_to.name;
            } else if (item.action == activityActions.project.tagAssigned) {
              param2 = item.additional_parameters.name;
              task_name = item.task_id.name;
            }

            let date = new Date(item.created_at);
            date.setHours(0, 0, 0, 0);
            date = new Date(date);
            let date_in_ms = date.getTime();

            let activityGrammar = activityGrammer(
              item.action,
              actor,
              proj_type,
              param2,
              param3,
              task_name,
              file_attach
            )

            return (
              <div key={item._id}>
                <div className="d-flex justify-content-start proj-activity-item">
                  <div className="proj-activity-item-pic">
                    <div className="proj_activ_block_item_img">
                      {item.actor_id.profilePicUrl ? (
                        <img
                          className="profilepic_activity"
                          src={item.actor_id.profilePicUrl}
                          alt="profile"
                        />
                      ) : (
                        <div className="proj_activ_block_item_without_img">
                          {item.actor_id.name
                            .split(" ")
                            .map(function(name) {
                              return name[0].toUpperCase();
                            })
                            .join("")}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="activity-details">
                    <div
                      className="activity-description"
                      onClick={() => {
                        // this.props.toggleLoader(true);
                        this.props.history.push(
                          `/workspace/${item.project_id.workspace_id}/project/${
                            item.project_id._id
                          }/tasks/${item.task_id._id}`
                        );
                      }}
                    >
                     
                   {activityGrammar}
                    </div>
                    <div className="activityDate">
                      {moment(new Date(item.created_at)).format(
                        "DD MMM, h:mm a"
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          } else {
            let action_arr = [
              "STATUS_UPDATED",
              "DUE_DATE_UPDATED",
              "ASSIGNED_TO",
              "ATTACHMENT_UPDATED"
            ];
            if (action_arr.indexOf(item.action) > -1) {
              return;
            } else {
              let proj_type;
              let param2 = "";
              let param3 = "";
              let file_attach = "";
              let task_name = "";
              let req_actor = this.props.members.filter(
                member => member.user_id._id === item.actor_id._id
              );
              let actor;
              let activ_val = "";

              if (req_actor.length > 0) {
                actor = item.actor_id.name;
              } else {
                actor = "Unknown user";
              }

              if (item.project_id.type && item.project_id.type == "sprint") {
                proj_type = "sprint";
              } else {
                proj_type = "project";
              }
              if (item.action == activityActions.project.status_updated) {
                param2 = item.additional_parameters.project_status;
              } else if (
                item.action == activityActions.project.member_added &&
                item.additional_parameters.member_added.status !== "pending"
              ) {
                param2 = item.additional_parameters.member_added.member_id.name;
              } else if (item.action == activityActions.project.member_left) {
                param2 = item.additional_parameters.member_left.name;
              } else if (
                item.action == activityActions.project.member_removed
              ) {
                param2 = item.additional_parameters.member_removed.name;
              } else if (
                item.action == activityActions.project.endDate_updated
              ) {
                param2 = moment(
                  new Date(item.additional_parameters.project_end_date)
                ).format("DD MMM YYYY");
              } else if (item.action == activityActions.task.status_updated) {
                param2 = item.additional_parameters.status_to;
                activ_val = item.task_id.name;
              } else if (item.action == activityActions.task.assigned_to) {
                param2 = item.additional_parameters.assigned_to.name;
                task_name = item.task_id.name;
              } else if (
                item.action == activityActions.project.attachment_added
              ) {
                file_attach = item.additional_parameters.project_attachment
                  ? item.additional_parameters.project_attachment.name
                  : "";
              } else if (item.action == activityActions.task.due_date_updated) {
                task_name = item.task_id.name;
              } else if (
                item.action == activityActions.project.moved &&
                item.additional_parameters.project_moved_from
              ) {
                param2 = item.additional_parameters.project_moved_from
                  ? item.additional_parameters.project_moved_from.name
                  : "";
                param3 = item.additional_parameters.project_moved_to.name;
              } else if (item.action == activityActions.project.tagAssigned) {
                param2 = item.additional_parameters.name;
                task_name = item.task_id.name;
              }

              let date = new Date(item.created_at);
              date.setHours(0, 0, 0, 0);
              date = new Date(date);
              let date_in_ms = date.getTime();

              return (
                <div key={item._id}>
                  <div className="d-flex justify-content-start proj-activity-item">
                    <div className="proj_activ_block_item_img">
                      {item.actor_id.profilePicUrl ? (
                        <img
                          className="profilepic_activity"
                          src={item.actor_id.profilePicUrl}
                          alt="profile"
                        />
                      ) : (
                        <div className="proj_activ_block_item_without_img">
                          {item.actor_id.name
                            .split(" ")
                            .map(function(name) {
                              return name[0].toUpperCase();
                            })
                            .join("")}
                        </div>
                      )}
                    </div>
                    <div className="activity-details">
                      <div className="activity-description">
                        {activityGrammer(
                          item.action,
                          actor,
                          proj_type,
                          param2,
                          param3,
                          task_name,
                          file_attach,
                          item.project_id.name
                        )}{" "}
                        ·{" "}
                      </div>
                      <div className="activityDate">
                        {moment(new Date(item.created_at)).format(
                          "DD MMM, h:mm a"
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          }
        }
      });
    }
  }

  downloadFile(file, text) {
    const { getTaskFile, getProjectFile } = this.props;
    if (text == "task") {
      getTaskFile(this.props.match.params.wId,file).then(res => {
        if (res.data.success) {
          var url = res.data.files;
          window.open(url, "_blank");
        } else {
          this.setState({ errors: res.data.errors });
        }
      });
    } else {
      getProjectFile(file).then(res => {
        if (res.data.success) {
          var url = res.data.files;
          window.location.href = url;
        } else {
          this.setState({ errors: res.data.errors });
        }
      });
    }
  }

  render() {
    // console.log("this.props", this.props);
    return (
      // <div className="d-flex flex-column align-items-center">
      <div className=" h100 d-flex flex-column">
        <div className="proj_activ_full_screen" onScroll={this.onScrollFunc}>
          {this._renderLoader()}
          <div className="activity-title d-flex align-items-center justify-content-between">
            <div className="proj-activity-title d-flex justify-content-start">
              <h5>Project Activity</h5>
            </div>
            <div className="d-flex justify-content-center align-items-center activity-close-img-div">
              <i
                className="activity-close-img fas fa-times"
                aria-hidden="true"
                onClick={this.closeSidebar}
              />
            </div>
          </div>
          <div className="activity_items_container">
            {this._renderActivities()}
          </div>

          {/* <img src={activity_image} className="activity_image" alt=""/>
                <div className ="activity_btn">Coming Soon</div> */}
        </div>
      </div>
    );
  }
}

ProjectActivity.propTypes = {
  setSidebar: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    project_activities: state.projects.project_activities,
    total_activities:state.projects.total_activities,
    loader: state.taskPreferences.loader,
    members: state.projectMembership.members
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    {
      getProjectActivities,
  
      getTaskFile,
      getProjectFile,
      removeProjectActivities,
      setSidebar
    }
  )(ProjectActivity)
);
