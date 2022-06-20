import React, { Component } from 'react';
import './ProjectActivity.css'

import { getProjectActivities, removeProjectActivities } from '../projectActions'
import { connect } from 'react-redux'; 


import activityActions from '../../../utils/activityActions.json';
import activityGrammer from '../../../utils/projectActivityGrammer.js';
import moment from 'moment';
import attach from '../../../media/shape3.svg'
import download from '../../../media/download.svg';
import PropTypes from "prop-types";
import { getTaskFile, getProjectFile, setSidebar } from '../sidebar/sidebarActions';


var compared_date = "";
class ProjectActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skip: 0,
      limit: 20
    };

    this._renderActivities = this._renderActivities.bind(this);
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
          this.props.match.params.id,
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

  componentDidMount(){
    this.props.setSidebar('');
    this.props.getProjectActivities(this.props.match.params.id,this.state.skip,this.state.limit,this.props.match.params.wId).then(res => {
      // this.props.toggleLoader(false);
      if(res.data && res.data.success){
        this.setState({skip:this.state.skip + this.state.limit})
      }
    })
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
      return this.props.project_activities.map((item, index) => {
        if(item){
          if (item.task_id) {
            let proj_type;
            let param2 = "";
            let param3 = "";
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
            } else if (item.action == activityActions.project.member_added) {
              param2 = item.additional_parameters.member_added.member_id.name;
            } else if (item.action == activityActions.project.endDate_updated) {
              param2 = moment(
                new Date(item.additional_parameters.project_end_date)
              ).format("DD MMM YYYY");
            } else if (item.action == activityActions.task.status_updated) {
              param2 = item.additional_parameters.status_to;
              activ_val = item.task_id.name;
            } else if (item.action == activityActions.task.assigned_to) {
              param2 = item.additional_parameters.assigned_to.name;
              activ_val = item.task_id.name;
            } else if (item.action == activityActions.task.attachment_added) {
              activ_val = item.additional_parameters.attachment
                ? item.additional_parameters.attachment.name
                : "";
            } else if (item.action == activityActions.project.attachment_added) {
              activ_val = item.additional_parameters.project_attachment
                ? item.additional_parameters.project_attachment.name
                : "";
            } else if (item.action == activityActions.task.due_date_updated) {
              activ_val = item.task_id.name;
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
              activ_val = item.task_id.name;
            }
  
            let date = new Date(item.created_at);
            date.setHours(0, 0, 0, 0);
            date = new Date(date);
            let date_in_ms = date.getTime();
            // (compared_date);
            // (date);
            // (date_in_ms);
            if (compared_date == "" || compared_date != date_in_ms) {
              compared_date = date_in_ms;
              return (
                <div key={item._id}>
                  <div className="proj_activ_block_date">
                    {moment(new Date(item.created_at)).format(
                      "dddd, DD MMM YYYY"
                    )}
                  </div>
                  <div className="proj_activ_block_item">
                    <div className="proj_activ_block_item_first">
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
                      <div className="proj_activ_block_item_details">
                        <p>
                          {activityGrammer(
                            item.action,
                            actor,
                            proj_type,
                            param2,
                            param3
                          )}{" "}
                          ·{" "}
                          <span className="activityDate">
                            {moment(new Date(item.created_at)).format("h:mm a")}
                          </span>
                        </p>
                        {activ_val === "" ? null : <p>{activ_val}</p>}
                      </div>
                    </div>
                    <div className="proj_activ_opt_holder">
                      {(item.action == activityActions.task.attachment_added ||
                        item.action ==
                          activityActions.project.attachment_added) && (
                        <div
                          className="proj_activ_block_item_download_hover"
                          onClick={() => {
                            if (item.task_id) {
                              this.downloadFile(
                                item.additional_parameters.attachment._id,
                                "task"
                              );
                            } else {
                              this.downloadFile(
                                item.additional_parameters.project_attachment._id,
                                "project"
                              );
                            }
                          }}
                        >
                          <img src={download} />
                        </div>
                      )}
                      {item.task_id && (
                        <div
                          className="proj_activ_block_item_details_hover"
                          onClick={() => {
                            // this.props.toggleLoader(true);
                            this.props.history.push(
                              `/project/${this.props.match.params.id}/tasks/${
                                item.task_id._id
                              }`
                            );
                          }}
                        >
                          <img src={attach} />
                          <p>Open Task</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <div key={item._id} className="proj_activ_block_item">
                  <div className="proj_activ_block_item_first">
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
                    <div className="proj_activ_block_item_details">
                      <p>
                        {activityGrammer(
                          item.action,
                          actor,
                          proj_type,
                          param2,
                          param3
                        )}{" "}
                        ·{" "}
                        <span className="activityDate">
                          {moment(new Date(item.created_at)).format("h:mm a")}
                        </span>
                      </p>
                      {activ_val === "" ? null : <p>{activ_val}</p>}
                    </div>
                  </div>
  
                  <div className="proj_activ_opt_holder">
                    {(item.action == activityActions.task.attachment_added ||
                      item.action ==
                        activityActions.project.attachment_added) && (
                      <div
                        className="proj_activ_block_item_download_hover"
                        onClick={() => {
                          if (item.task_id) {
                            this.downloadFile(
                              item.additional_parameters.attachment._id,
                              "task"
                            );
                          } else {
                            this.downloadFile(
                              item.additional_parameters.project_attachment._id,
                              "project"
                            );
                          }
                        }}
                      >
                        <img src={download} />
                      </div>
                    )}
                    {item.task_id && (
                      <div
                        className="proj_activ_block_item_details_hover"
                        onClick={() => {
                          // this.props.toggleLoader(true);
                          this.props.history.push(
                            `/project/${this.props.match.params.id}/tasks/${
                              item.task_id._id
                            }`
                          );
                        }}
                      >
                        <img src={attach} />
                        <p>Open Task</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            }
          }
         else {
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
            } else if (item.action == activityActions.project.member_added) {
              param2 = item.additional_parameters.member_added.member_id.name;
            } else if (item.action == activityActions.project.endDate_updated) {
              param2 = moment(
                new Date(item.additional_parameters.project_end_date)
              ).format("DD MMM YYYY");
            } else if (item.action == activityActions.task.status_updated) {
              param2 = item.additional_parameters.status_to;
              activ_val = item.task_id.name;
            } else if (item.action == activityActions.task.assigned_to) {
              param2 = item.additional_parameters.assigned_to.name;
              activ_val = item.task_id.name;
            } else if (item.action == activityActions.task.attachment_added) {
              activ_val = item.additional_parameters.attachment
                ? item.additional_parameters.attachment.name
                : "";
            } else if (
              item.action == activityActions.project.attachment_added
            ) {
              activ_val = item.additional_parameters.project_attachment
                ? item.additional_parameters.project_attachment.name
                : "";
            } else if (item.action == activityActions.task.due_date_updated) {
              activ_val = item.task_id.name;
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
              activ_val = item.task_id.name;
            }

            let date = new Date(item.created_at);
            date.setHours(0, 0, 0, 0);
            date = new Date(date);
            let date_in_ms = date.getTime();
            // (compared_date);
            // (date);
            // (date_in_ms);
            if (compared_date == "" || compared_date != date_in_ms) {
              compared_date = date_in_ms;
              return (
                <div>
                  <div key={item._id} className="proj_activ_block_date">
                    {moment(new Date(item.created_at)).format(
                      "dddd, DD MMM YYYY"
                    )}
                  </div>
                  <div className="proj_activ_block_item">
                    <div className="proj_activ_block_item_first">
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
                      <div className="proj_activ_block_item_details">
                        <p>
                          {activityGrammer(
                            item.action,
                            actor,
                            proj_type,
                            param2,
                            param3
                          )}{" "}
                          ·{" "}
                          <span className="activityDate">
                            {moment(new Date(item.created_at)).format("h:mm a")}
                          </span>
                        </p>
                        {activ_val === "" ? null : <p>{activ_val}</p>}
                      </div>
                    </div>
                    <div className="proj_activ_opt_holder">
                      {(item.action == activityActions.task.attachment_added ||
                        item.action ==
                          activityActions.project.attachment_added) && (
                        <div
                          className="proj_activ_block_item_download_hover"
                          onClick={() => {
                            if (item.task_id) {
                              this.downloadFile(
                                item.additional_parameters.attachment._id,
                                "task"
                              );
                            } else {
                              this.downloadFile(
                                item.additional_parameters.project_attachment
                                  ._id,
                                "project"
                              );
                            }
                          }}
                        >
                          <img src={download} />
                        </div>
                      )}
                      {item.task_id && (
                        <div
                          className="proj_activ_block_item_details_hover"
                          onClick={() => {
                            // this.props.toggleLoader(true);
                            this.props.history.push(
                              `/project/${this.props.match.params.id}/tasks/${
                                item.task_id._id
                              }`
                            );
                          }}
                        >
                          <img src={attach} />
                          <p>Open Task</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <div key={item._id} className="proj_activ_block_item">
                  <div className="proj_activ_block_item_first">
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
                    <div className="proj_activ_block_item_details">
                      <p>
                        {activityGrammer(
                          item.action,
                          actor,
                          proj_type,
                          param2,
                          param3
                        )}{" "}
                        ·{" "}
                        <span className="activityDate">
                          {moment(new Date(item.created_at)).format("h:mm a")}
                        </span>
                      </p>
                      {activ_val === "" ? null : <p>{activ_val}</p>}
                    </div>
                  </div>

                  <div className="proj_activ_opt_holder">
                    {(item.action == activityActions.task.attachment_added ||
                      item.action ==
                        activityActions.project.attachment_added) && (
                      <div
                        className="proj_activ_block_item_download_hover"
                        onClick={() => {
                          if (item.task_id) {
                            this.downloadFile(
                              item.additional_parameters.attachment._id,
                              "task"
                            );
                          } else {
                            this.downloadFile(
                              item.additional_parameters.project_attachment._id,
                              "project"
                            );
                          }
                        }}
                      >
                        <img src={download} />
                      </div>
                    )}
                    {item.task_id && (
                      <div
                        className="proj_activ_block_item_details_hover"
                        onClick={() => {
                          // this.props.toggleLoader(true);
                          this.props.history.push(
                            `/project/${this.props.match.params.id}/tasks/${
                              item.task_id._id
                            }`
                          );
                        }}
                      >
                        <img src={attach} />
                        <p>Open Task</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            }
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
    return (
      // <div className="d-flex flex-column align-items-center">
      <div className="proj_activ_full_screen"  onScroll={this.onScrollFunc}>
        {/* {this._renderLoader()} */}
        <div className="reports_main_view">
          <div className="reports_heading activity_heading proj-top">
            <div className="reports_title d-flex align-items-center">Project Activity</div>
          </div>
          <div className="reports_item_container">{this._renderActivities()}</div>
        </div>
        {/* <img src={activity_image} className="activity_image" alt=""/>
                <div className ="activity_btn">Coming Soon</div> */}
      </div>
    );
  }
}


ProjectActivity.propTypes = {
  setSidebar : PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  return{
    project_activities:state.projects.project_activities,
    total_activities:state.project.total_activities,
    loader:state.taskPreferences.loader,
    members: state.projectMembership.members,
    project: state.projects.project
  }
}

export default connect(mapStateToProps,{ getProjectActivities, getTaskFile, getProjectFile, removeProjectActivities, setSidebar })(ProjectActivity);

