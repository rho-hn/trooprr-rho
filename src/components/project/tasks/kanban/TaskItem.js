import React, { Component } from "react";
import { withRouter } from 'react-router-dom'
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button } from "reactstrap";
import { CheckCircleOutlined, PaperClipOutlined, AlignLeftOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Select, Card, Checkbox, Dropdown, Popover, Typography, Tag, Avatar } from "antd";
import classnames from "classnames";
import { Draggable } from "react-beautiful-dnd";

import "./TaskItem.css"
import { updateTask, setTask } from "../task/taskActions";
import { setSidebar } from "../../sidebar/sidebarActions";

const {Text} = Typography

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  cursor: isDragging ? "grab" : "pointer",
  // backgroundColor: isDragging ? 'red' : '#fff',
  // styles we need to apply on draggables
  ...draggableStyle
});

const { Option } = Select;

class TaskItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      click: false,
      emailTask_rel: {},
      input: false,
      name: "",
      // suggestions: this.getSuggestions(""),
      dropdownOpen: false,
      autoCompleteValue: "",
      windowWidth: 0,
      windowHeight: 0,
      date: this.props.task.due_on ? moment(this.props.task.due_on) : moment(),
      taskChecked: this.props.task.isCompleted,
      isScrolling: false,
      task: {},
      due_on_class: "",
      checked: false,
      showCheckbox: false,
      assigneeDropdown: false
    };
    this.taskItemCounter = 0;
    this.handleClick = this.handleClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    // this.onChangeName = this.onChangeName.bind(this);
    this.onBlur = this.onBlur.bind(this);
    // this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    // this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    // this.getSuggestionValue = this.getSuggestionValue.bind(this);
    // this.renderSuggestion = this.renderSuggestion.bind(this);
    this.toggleDropDown = this.toggleDropDown.bind(this);
    // this.toggleTags = this.toggleTags.bind(this);
    this._getInitials = this._getInitials.bind(this);
    // this.getTasksLength = this.getTasksLength.bind(this);
    this.mousePositionDocument = this.mousePositionDocument.bind(this);
    this.onTaskChecked = this.onTaskChecked.bind(this);
  }
  toggle() {
    this.setState({
      name: "",
      input: !this.state.input
    });
  }
  toggleDropDown(e) {
    e.stopPropagation();
    // console.log("hello hello")
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  assigneeDropdownToggle = () => {
    this.setState({
      assigneeDropdown: !this.state.assigneeDropdown
    });
  }

  onChangeDate(date) {
    const { updateTask } = this.props;
    const due = date.format("DD MMM YYYY");
    this.props.task.due_on = new Date(due);
    updateTask(this.props.match.params.wId, this.props.task, "due_on").then(res => {
      if (res.data.success) {
        this.setState({ date: date, dateState: !this.state.dateState });
      }
    });
  }

  onBlur() {
    if (this.state.input) {
      this.toggle();
    }
  }

  handleClick() {
    this.setState({
      click: !this.state.click
    });
  }

  _getInitials(name) {
    let nameArr = name
      .trim()
      .replace(/\s+/g,' ') //remove extra spaces
      .split(" ")

    if (nameArr.length>1)
      return (nameArr[0][0] + nameArr[1][0]).toUpperCase()
    else
      return nameArr[0].slice(0, 2).toUpperCase()
  }

  mousePositionDocument(e) {
    let windowHeight = window.innerHeight;
    let windowWidth = window.innerWidth;
    var posx = 0;
    var posy = 0;
    if (!e) {
      var e = window.event;
    }
    if (e.pageX || e.pageY) {
      posx = e.pageX;
      posy = e.pageY;
    } else if (e.clientX || e.clientY) {
      posx =
        e.clientX +
        document.body.scrollLeft +
        document.documentElement.scrollLeft;
      posy =
        e.clientY +
        document.body.scrollTop +
        document.documentElement.scrollTop;
    }
    var getWidthPercent = Math.floor((posx / windowWidth) * 100);
    var getHeightPercent = Math.floor((posy / windowHeight) * 100);

    this.setState({
      windowWidth: getWidthPercent,
      windowHeight: getHeightPercent
    });
    return;
  }

  onTaskChecked(e) {
    e.stopPropagation();
    // this.setState({taskChecked: !this.state.taskChecked});
    // this.props.toggleTask();
    let this_task = this.props.task;
    this_task.checked = !this_task.isCompleted;
    this.props.updateTask(this.props.match.params.wId, this_task, "checked");
  }

  componentDidUpdate() {
    if (this.state.task !== this.props.task)
      this.setState({ task: this.props.task })
  }

  handleCheck = (e) => {
    this.setState({ checked: e.target.checked })
    this.props.updateSelectedTasks(e.target.checked, this.props.taskItemKey)
  }


  task_assigneeOnChange = (val, opt) => {
    // console.log("task_assigneeOnChange called")
    // const { updateTask } = this.props;
    let assignee;
    this.props.workspaceMembers.map((member) => {
      if (member._id === val) {
        assignee = member.user_id;
      }
    })
    this.props.task.user_id = assignee;
    this.props.updateTask(this.props.match.params.wId, this.props.task, "user_id")
    this.setState({ dropdownOpen: false })
  }

  task_assigneeonDelete = val => {
    if (!val) {
      // console.log("should delete now")
      this.props.removeAssignee(this.props.match.params.wId, this.props.task._id);
    }
  }
  dropdownVisible = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen, filterQuery: '' })
  }



  viewTask(e, task) {
    // console.log(this.props.sidebar)
    e.stopPropagation();

    if (e.target.nodeName !== "INPUT" && task) {
      const { setTask, setSidebar } = this.props;

      setTask(task);

      if (this.props.sidebar !== "task") {
        setSidebar("task");
      }

      // this.setState({ showClass: task._id });
      let arr = window.location.pathname.split("/");
      if (arr[arr.length - 1] !== "tasks") {
        arr.splice(arr.length - 1, 1);
      }

      let new_loc = arr.join("/");
      let obj = {
        backlog: false,
        title: "Task_Kanban",
        url: `${new_loc}/${task._id}${window.location.search}`
      };
      window.history.pushState(obj, obj.title, obj.url);
    }
  }

  render() {
    const { task, onClick, index, taskItemKey } = this.props;
    const date = new Date();
    let tommorrow = date;
    // let Date_today = moment()
    //   .format()
    //   .split("T")[0];
    let Due_date = moment(task.due_on)
      .format()
      .split("T")[0];
    let Date_to_show = moment(task.due_on).format("DD MMM");
    // let Date_tomorrow = moment()
    //   .add(1, "days")
    //   .calendar("days");
    tommorrow = new Date(tommorrow.setDate(tommorrow.getDate() + 1))
      .toISOString()
      .split("T")[0];
    var info = "";
    if (task.due_on) {
      info = info + moment(task.due_on).format("DD MMM");
    }
    if (task.due_on && task.user_id) {
      info = info + " · ";
    }
    if (task.user_id) {
      info = info + (task.user_id.displayName||task.user_id.name);
    }
    var click = this.state.click;
    var cl_click = click ? "task-box-click" : "task-box-noclick";


    // const assignee_options = this.props.members.map(d => <Option key={d._id}>{d.user_id.name}</Option>);
    const assignee_options = this.props.workspaceMembers.map(d => <Option key={d._id}>{d.user_id.displayName||d.user_id.name}</Option>);
    // console.log("checkedStatus:", this.props.checkedStatus, " for task:", task._id)
    return (
      <div className="scroller" key={taskItemKey}>
        <Draggable draggableId={task._id} index={index}>
          {(provided, snapshot) => {
            return (
              <div
                onClick={e => {
                  e.stopPropagation();
                  this.viewTask(e, task)
                  this.setState({ click: !this.state.click });
                }}

                // ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={getItemStyle(
                  snapshot.isDragging,
                  provided.draggableProps.style
                )}

              >
                <div 
                ref={provided.innerRef}
                className={
                  "task_item_card task-box " +
                  (localStorage.getItem('theme') == "dark" ? " task-box-background-dark " : "task-box-background") +
                  (this.props.currentTask._id === task._id ? " task-box-focus " : "") +
                  (this.props.checkedStatus ? " multiSelectContainer-checked " : " multiSelectContainer ")+
                  (localStorage.getItem('theme') == "default" ? "task-box-border": "task-box-border_dark")
                } style={{ position: "relative"}}>
                  {/* <span style={{position:"absolute",right:"6px"}}>  */}
                  {/* {this.props.backlog && */}
                    <Card
                      className={"multiSelectBox"}
                      bodyStyle={{ borderRadius:'4px',padding: "0px 2px",background:(localStorage.getItem('theme') == 'dark' && '#151515')  }}
                      style={{borderRadius:'4px',background:(localStorage.getItem('theme') == 'dark' && '#151515')}}
                    >
                      <Checkbox
                        value={this.props.checkedStatus}
                        // value={this.props.checkedStatus}
                        onChange={this.handleCheck}
                        checked={this.props.checkedStatus}
                      />
                    </Card>
                  {/* } */}
                  {/* </span>   */}
                  {task.tag_id.length > 0 &&
                    <div
                      className={
                        "d-flex  wrap-div task_item_card "
                      }
                    >

                      <div className="d-flex tag__wrapping ">
                        {task.tag_id &&
                          task.tag_id.map(tag =>
                            this.props.showTagsDetails ? (
                              <div key={tag._id}
                                onClick={this.props.toggleTags}
                                style={{ backgroundColor: tag.color }}
                                key={tag._id}
                                data-toggle="tooltip"
                                title={tag.name}
                                className={"kanban-tags-style "}
                              >
                                <div className="tag_name">{tag.name}</div>
                              </div>
                            ) : (
                                <div
                                  key={tag._id}
                                  onClick={this.props.toggleTags}
                                  style={{ backgroundColor: tag.color }}
                                  className={"kanban-tags-style-no-detail "}
                                />
                              )
                          )}
                      </div>
                    </div>}
                  <div className=" task_item_card d-flex justify-content-between">
                    <div className=" task_item_card d-flex  justify-content-between task-desc">
                      <div className=" task_item_card d-flex">
                        {/* {task.checked ? (
                        <i
                          // className="far fa-check-circle kanban_checked_icon"
                          className="material-icons kanban_checked_icon"
                          onClick={e => this.onTaskChecked(e)}>
                            check_circle 
                        </i>
                      ) : (
                        <i
                          // className="fa fa-square kanban_unchecked_icon"
                          className="material-icons kanban_unchecked_icon"
                          onClick={e => this.onTaskChecked(e)}>
                           crop_square
                        </i>
                      )} */}
                        <div
                          className={classnames(
                            " task_item_card  desc flex-column task-item-name",
                            {
                              checked: task.isCompleted
                            }
                          )}
                        >
                          <Text>{task.name}</Text>
                        </div>
                      </div>
                    </div>
                  </div>
                  {(task.files.length > 0 ||
                    task.user_id ||
                    task.checklist.length > 0 ||
                    task.desc ||
                    task.due_on || task.key) && (
                      <div className=" task_item_card task_item_icons_list d-flex align-items-center" >
                       {/* {console.log(task.key)} */}
                       
                        <div><Text className="taskcard_taskkey" type="secondary">{task.key}</Text></div>
                        <div style={{display:'flex'}}>
                        {task.due_on ? (
                          Due_date === tommorrow ? (
                              <Tag className="taskcard_datetag taskcard_datetag_near" icon={<ClockCircleOutlined />} color="orange">{Date_to_show}</Tag>                     
                          ) : Due_date > tommorrow ? (
                            <Tag className="taskcard_datetag taskcard_datetag_future" icon={<ClockCircleOutlined />} color="default">{Date_to_show}</Tag>
                          ) : (
                            <Tag className="taskcard_datetag taskcard_datetag_over" icon={<ClockCircleOutlined />} color="red">{Date_to_show}</Tag>
                              )
                        ) : (
                            ""
                          )}

                        {task.desc && (
                          // <i className="task_item_card task_item_description_icon material-icons">
                          //   notes
                          // </i>
                          <div className={localStorage.getItem('theme') == "default" ? "task_item_attachment_icon" : "task_item_attachment_icon_dark"}>
                             <AlignLeftOutlined />
                          </div>                          
                        )}
                        {task.files.length > 0 && (
                          // <i className="task_item_card task_item_attachment_icon fas fa-paperclip" />
                          <div className={localStorage.getItem('theme') == "default" ? "task_item_attachment_icon" : "task_item_attachment_icon_dark"}>
                            <PaperClipOutlined  />
                          </div>
                        )}
                        {task.checklist.length > 0 && (
                          // <i className="task_item_card task_item_checklist_icon far fa-check-circle" />
                          <div className={localStorage.getItem('theme') == "default" ? "task_item_checklist_icon" : "task_item_checklist_icon_dark"}>
                            <CheckCircleOutlined  />
                          </div>
                        )}
                        {task.user_id && (
                            <Popover
                              content={
                                <div>
                                  <div>{task.user_id.displayName||task.user_id.name}</div>
                                  {task.user_id.email && <div>{task.user_id.email}</div>}
                                </div>
                              }
                            >
                              <span style={{marginLeft:'8px'}}>
                                {task.user_id && (
                                    task.user_id.profilePicUrl ? (
                                  <Avatar className="taskcard_assigneeavatar" src={task.user_id.profilePicUrl} size={22}/>
                                    ) : (
                                      <Avatar className="taskcard_assigneeavatar" gap={6} size={22}>{this._getInitials(task.user_id.displayName||task.user_id.name)}</Avatar>
                                      )
                                )}
                              </span>
                            </Popover>
                        )}
                        </div>
                      </div>
                    )}
                  {/* {this.state.emailTask_rel.success && <img src={message_icon} className="email_task_icon" alt="email_icon" />
                      }
                      {!this.state.emailTask_rel.success && task.user_id &&
                        <div>
                          {task.user_id.profilePicUrl ?
                            <img className="profilepic_myspace" src={task.user_id.profilePicUrl}
                              alt="profile" /> : <div className="profilepic_myspace_color d-flex align-items-center justify-content-center">
                              {task.user_id.name && <div>{task.user_id.name.substring(0, 2)}</div>}
                            </div>
                          }
                        </div>
        
        
                      } */}
                </div>
              </div>
            );
          }}
        </Draggable>
      </div>
    );
  }
}

function mapStateToProps(state) {
  let propsObj = {
    members: state.projectMembership.members,
    currentTask: state.task.task,
    workspaceMembers: state.skills.members
  }
  // console.log("propsObj:"+JSON.stringify(propsObj.currentTask))
  return propsObj;
}

export default withRouter(connect(
  mapStateToProps,
  { updateTask, setTask, setSidebar }
)(TaskItem));