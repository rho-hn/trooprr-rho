import React, { Component, Fragment } from "react";
import { withRouter } from 'react-router'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Menu, Dropdown, Select, Popover, notification, Input, Modal,Typography, Divider } from 'antd';
import classnames from "classnames";
import _ from "lodash";
import { Droppable, Draggable } from "react-beautiful-dnd";
import axios from 'axios';

import {
  updateStatus,
  moveStatus,
  deleteStatus
} from "../section/sectionActions";
import {
  getTasks,
  setTasks,
  setTask,
  addTask,
  updateTask,
  clearTaskItem,
  archiveTasksBySection,
  getFilteredBacklogTasks,
  getBacklogTasks,
  // deleteStatusCompletely 
} from "../task/taskActions";
import { setSidebar } from "../../sidebar/sidebarActions";
import TaskItem from "./TaskItem";
import AddTask from "../AddTask";
import { getProjects } from "../../projectActions";
import { updateSprint, startSprint, deleteSprint, getCurrentSprint, getSprintConfig } from "../section/sprintActions"

const { Text } = Typography;
const { Option } = Select;
const Position = obj => {
  let sectionCount = obj.projecSectionCount + obj.number;
  let count = [];
  for (var i = 0; i < sectionCount; i++) {
    count.push(i + 1);
  }

  return count.map((count, index) => (
    <Option value={count} index={index} key={count}>
      {count}
    </Option>
  ));
};

const grid = 8;
const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  background:(localStorage.getItem('theme') == "dark" && "none"),
  // styles we need to apply on draggables
  ...draggableStyle
});

class SprintSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formSection: false,
      formTask: false,
      showClass: null,
      optionsDropdown: true,
      moveStatusDropdown: false,
      projectSelectValue: "",
      position: "",
      projecSectionCount: "",
      selectedTasks: [],
      positionLoad: false,
      sprintUpdateForm: false
    }
    this.taskSectionCounter = 0;
    this.toggleFormTask = this.toggleFormTask.bind(this);
    this.toggleFormSection = this.toggleFormSection.bind(this);
    this.openmoveStatusDropDown = this.openmoveStatusDropDown.bind(this);
    this.closemoveStatusDropDown = this.closemoveStatusDropDown.bind(this);
    this.sectionMove = this.sectionMove.bind(this);
    this.dropdownToggle = this.dropdownToggle.bind(this);
    this.positionChange = this.positionChange.bind(this);
    this.handleProjectChange = this.handleProjectChange.bind(this);
    // this.getTasks = this._getFilteredTasks.bind(this);
    this.archiveTasksBySection = this.archiveTasksBySection.bind(this);
  }

  positionChange(pos) {
    this.setState({ position: pos });
  }

  _noRenderRow() {
    return <div style={{ opacity: 0, width: 0, height: 0 }}>No content</div>;
  }

  // componentDidUpdate() {
  //   if (this.props.sidebar === "" && this.state.showClass != null) {
  //     this.setState({ showClass: null });
  //   }
  // }

  handleProjectChange(pId) {
    let wId = this.props.match.params.wId
    // var project = this.props.projects.find(project => project._id === id);
    // console.log("projectttttt",project);
    this.setState({ positionLoad: true })
    axios.get('/api/workspace/' + wId + '/project/' + pId + '/status').then(res => {
      if (res.data.success) {
        this.setState({
          projectSelectValue: pId,
          projecSectionCount: res.data.statuses.length,
          position: 1,
          positionLoad: false
        })
      }
    })
  }

  dropdownToggle() {
    this.setState({
      optionsDropdown: true,
      moveStatusDropdown: false
    })
  }

  sectionMove(e) {
    e.stopPropagation();
    var proj = this.props.projects.find(
      project => project._id === this.state.projectSelectValue
    );
    const { status } = this.props;
    var data = {};
    data.workspace_id = proj.workspace_id._id;
    data.project_id = this.state.projectSelectValue;
    data.position = this.state.position;
    if (
      status.project_id === data.project_id &&
      this.props.index + 1 === data.position
    ) {
      // this.setState({ dropdownOpen: !this.state.dropdownOpen });
    } else {
      this.props.moveStatus(this.props.match.params.wId, this.props.match.params.pId, this.props.status._id, data).then(res => {
        if (res.data.success) {
          // this.setState({ dropdownOpen: !this.state.dropdownOpen });
        }
      });
    }
  }

  openmoveStatusDropDown(e) {
    e.stopPropagation();
    const { status } = this.props
    let project = this.props.projects.find(
      project => project._id === status.project
    );
    this.setState({
      optionsDropdown: false,
      moveStatusDropdown: true,
      projectSelectValue: status.project,
      position: this.props.index + 1,
      projecSectionCount: this.props.statuses.length
    });
  }

  closemoveStatusDropDown() {
    this.setState({ optionsDropdown: true, moveStatusDropdown: false });
  }

  toggleTask(e, task) {
    task.checked = !task.checked;
    let status = task.checked ? "true" : "false"
    this.props.updateTask(this.props.match.params.wId, task, status);
  }

  toggleFormTask() {
    this.setState({
      formTask: !this.state.formTask
    });
  }

  toggleFormSection() {
    this.setState({
      formSection: !this.state.formSection
    });
  }

  viewTask(e, task) {
    e.stopPropagation();
    if (e.target.nodeName !== "INPUT" && task) {
      const { setTask, setSidebar } = this.props;
      setTask(task);
      if (this.props.sidebar !== "task") {
        setSidebar("task");
      }
      this.setState({ showClass: task._id });
      let arr = window.location.pathname.split("/");
      if (arr[arr.length - 1] !== "tasks") {
        arr.splice(arr.length - 1, 1);
      }
      let new_loc = arr.join("/");
      let obj = {
        backlog: true,
        title: "Task_Kanban",
        url: `${new_loc}/${task._id}${window.location.search}`
      };
      window.history.pushState(obj, obj.title, obj.url);
    }
  }

  // componentDidMount() {
  //   // this.props.getBacklogTasks(this.props.match.params.wId, this.props.match.params.pId)
  // }
  
  handleSprintMoreAction = e => {
    let key = e.key
    if (key == "delete") {
      this.deleteSprintColumnConfirm()
    } else if (key == "start") {
      this.startSprintConfirm()
    } else if (key == "archive") {
      // this.archiveStatusTasksConfirm()
    } else if (key == "rename") {
      this.setState({ sprintUpdateForm: true })
    }
  }

  _startSprint = () => {
    const { wId, pId } = this.props.match.params
    this.props.startSprint(wId, pId, this.props.sprint._id).then(res => {
      if (res.data.success) {
        notification["success"]({
          message: 'Sprint started successfully',
          placement: 'bottomLeft'
        })
        this.props.getCurrentSprint(wId, pId)
        this.props.getTasks(wId, pId);
        this.props.getSprintConfig(wId, pId)
        this.props.history.push(`/${wId}/squad/${pId}/tasks`)
      } else {
        notification["error"]({
          message: res.data.errors ? res.data.errors : "Could not complete request",
          placement: 'bottomLeft'
        })
      }
    })
  }

  startSprintConfirm = () => {
    Modal.confirm({
      // title: 'Are you sure you want to start this Sprint?',
      title: this.props.sprint.name ? `Are you sure you want to start sprint : ${this.props.sprint.name}?` : 'Are you sure you want to start this Sprint?',
      // content: ,
      okText: 'Yes',
      cancelText: 'No',
      // className: "sidebar_dropdown",
      onOk: this._startSprint,
      okText: "Yes",
      okType: 'primary',
      width:450
    })
  }

  deleteCompleteSection = () => {
    if (this.props.tasks == undefined || this.props.tasks.length === 0) {
      // this.props.deleteStatusCompletely();
      this.props.deleteSprint(this.props.match.params.wId, this.props.match.params.pId, this.props.sprint._id).then(() => {
        notification["success"]({
          message: 'Sprint deleted successfully',
          placement: 'bottomLeft'
        })
      })
    }
    else {
      notification['error']({
        message: "Cant delete Sprint that has tasks in it",
        placement: 'bottomLeft'
      })
    }
  }

  deleteSprintColumnConfirm = () => {
    Modal.confirm({
      title: 'Are you sure you want to delete this Sprint?',
      // content: ,
      okText: 'Yes',
      cancelText: 'No',
      // className: "sidebar_dropdown",
      onOk: this.deleteCompleteSection,
      okText: "Yes",
      okType: 'danger',
    })
  }

  archiveTasksBySection() {
    let data = {};
    data.availability = "archived";
    const id = this.props.status._id;
    this.props.archiveTasksBySection(this.props.match.params.wId, data, id)
      .then(res => {
        if (res.data.success) {
          notification["success"]({
            message: 'Tasks archived successfully',
            placement: 'bottomLeft'
          });
        } else {
          notification['error']({
            message: "Error archiving tasks in this Sprint. Try again later",
            placement: 'bottomLeft'
          })
        }
      })
  }

  archiveStatusTasksConfirm = () => {
    Modal.confirm({
      title: 'Are you sure you want to archive all tasks in this Sprint?',
      // content: ,
      okText: 'Yes',
      cancelText: 'No',
      // className: "sidebar_dropdown",
      onOk: this.archiveTasksBySection,
      okText: "Yes",
      okType: 'danger',
    })
  }

  delayedSprintUpdate = _.debounce(this.props.updateSprint, 1000)

  _getCurrentFilterTasks = tasks => this.props._getFilteredTasks(tasks, this.props.filter)

  render() {
    // console.log(this.state.selectedTasks,"siva")

    const {
      name,
      sprint,
      tasks,
      index,
      filter,
      getFilteredBacklogTasks,
      _getFilteredTasks,
      durationFrom,
      durationTo
    } = this.props;

    // tasks && console.log("re-rendering tasks", tasks.length, filter)
    let filteredtasks = _getFilteredTasks(tasks, filter)
    if (!(filteredtasks && filteredtasks.length > 0)) { filteredtasks = [] }
    //set finaltasks in store for sprint._id
    getFilteredBacklogTasks(sprint._id, filteredtasks)
    let paymentStatus = this.props.paymentHeader.billing_status;

    let secElements = (
      <Fragment>
        <div
          className={classnames(
            "sec-title d-flex justify-content-between",
            { "hidden-xl-down": this.state.formSection }
          )}
        >
          {this.state.sprintUpdateForm ?
            <div style={{ height: "29px", width: "100%", display: "flex", alignItems: "center" }}>
              <Input
                size="small"
                style={{ paddingLeft: 4 }}
                type="text"
                onChange={e => {
                  // console.log("onchange..")
                  let n = e.target.value
                  n && (n != this.props.name) && this.delayedSprintUpdate(this.props.match.params.wId, this.props.match.params.pId, sprint._id, { name: n })
                }}
                onBlur={e => { this.setState({ sprintUpdateForm: false }) }}
                onPressEnter={e => { this.setState({ sprintUpdateForm: false }) }}
                defaultValue={name}
                autoComplete="off"
                autoFocus />
            </div>
            : <Fragment>
              <div className="d-flex fix-width ">
             {/* { (durationFrom && durationTo) &&<div
                ><Text style={{fontSize:"11px",marginLeft:"5px"}}>{`${durationFrom}-${durationTo}`}</Text></div>} */}
                {/* <div style={{display:"flex",flexDirection:"row"}}> */}
                <div className={sprint._id === "__backlog" ? "kanban_backlog_section_name" : localStorage.getItem('theme') == 'default' ? "kanban_section_name" : "kanban_section_name_dark"}
                  onClick={() => { sprint._id !== "__backlog" && this.setState({ sprintUpdateForm: true }) }}
                ><Text>{name}</Text></div>
                <div className="number_Task">
                  {/* {tasks ? this.getTasks(status._id, tasks).length : 0} */}
                  <Text>{filteredtasks.length}</Text>
                </div>
                {/* </div> */}
              </div>
              {sprint._id !== "__backlog" && <Dropdown
                overlay={<Menu onClick={this.handleSprintMoreAction}>
                  <Menu.Item key="rename">
                    <EditOutlined />
                    <span>
                      Rename
                  </span>
                  </Menu.Item>
                  <Menu.Item key="start">
                    <EditOutlined />
                    <span>
                      Start
                  </span>
                  </Menu.Item>
                  <Menu.Item key="delete">
                    <DeleteOutlined />
                    <span>
                      Delete
                  </span>
                  </Menu.Item>
                  {/* <Menu.Item key="archive">
                    <Icon type="container" />
                    <span>
                      Archive Tasks
                  </span>
                  </Menu.Item> */}
                </Menu>} trigger={['click']}
                className="task_options dropdown "
              >
                <div className={localStorage.getItem("theme") == 'default' ? "section_option_btn" : 'section_option_btn_dark' } onClick={this.dropdownToggle} style={{borderRadius:"2px"}}>
                  <i className="material-icons">
                    more_horiz
                </i>
                </div>
              </Dropdown>}
            </Fragment>}
        </div>
        <div style={{width:'94.5%',marginLeft:'auto',marginRight:'10px'}}>
            {localStorage.getItem('theme') == 'dark'&&
        <Divider style={{margin:'0'}}/>
        } 
        </div>
        <div className="add_task_kanban_container">
        {/* {localStorage.getItem('theme') == 'dark'&&
        <Divider style={{marginBottom:'5px',marginTop:'0'}}/>
        } */}
          {this.state.formTask ? <AddTask
            checkFilterable={this._getCurrentFilterTasks}
            backlog={true}
            id={sprint._id}
            wId={this.props.match.params.wId}
            pId={this.props.match.params.pId}
            isVisible={!this.state.formTask}
            toggle={this.toggleFormTask}
            scrollToTask={this.scrollToTask}
          /> :
            // filter !== "Complete Tasks" ? //TODO: show a msg that created issue is not visible in view
            <div
              className={classnames("task-add cancel", {
                "hidden-xl-down": this.state.formTask
              })}
              style={{padding:(localStorage.getItem('theme') == 'dark' && "4px 0px")}}
              onClick={this.toggleFormTask}
            >
              <span><Text>+ Add new task</Text></span>
            </div>
            // : null
          }
        </div>
        <Droppable
          droppableId={sprint._id}
          status={sprint._id}
          type="task"
          ignoreContainerClipping={true}
        >
          {(provided, snapshot) => (
            <div
              className={paymentStatus === ("grace" || "grace_payment_failed") ? "droppable_container_grace custom_scrollbar" : "droppable_container custom_scrollbar"}
              ref={provided.innerRef}
            >
              {filteredtasks.map((task, index) => (
                <TaskItem
                  checkedStatus={this.props.selectedTasks.includes(task._id)}
                  toggleTags={this.props.toggleTags}
                  showTagsDetails={this.props.showTagsDetails}
                  task={task}
                  showClass={this.state.showClass}
                  backlog={true}
                  index={index}
                  key={task._id}
                  taskItemKey={task._id}
                  onClick={e => this.viewTask(e, task)}
                  updateSelectedTasks={this.props.updateSelectedTasks}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </Fragment>
    )

    return (
      <Fragment>
        {sprint._id === "__backlog" ? 
        <div className="proj-box "
        style={{background:(localStorage.getItem('theme') == "dark" && "none")}}
        >
          {secElements}
        </div> 
        :
          <Draggable key={sprint._id} draggableId={sprint._id} index={index}>
            {(section_provided, snapshot) => (
              <div
                className="proj-box "
                ref={section_provided.innerRef}
                {...section_provided.draggableProps}
                style={getItemStyle(
                  snapshot.isDragging,
                  section_provided.draggableProps.style
                )}
                {...section_provided.dragHandleProps}
              >
                {secElements}
              </div>
            )}
          </Draggable>
        }
      </Fragment>
    );
  }
}

SprintSection.propTypes = {
  name: PropTypes.string.isRequired,
  sprint: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired,
  updateSprint: PropTypes.func.isRequired,
  deleteStatus: PropTypes.func.isRequired,
  setTasks: PropTypes.func.isRequired,
  setTask: PropTypes.func.isRequired,
  updateTask: PropTypes.func.isRequired,
  setSidebar: PropTypes.func.isRequired,
  sidebar: PropTypes.string.isRequired,

};
function mapStateToProps(state, ownProps) {
  // console.log("state.filterSidebarValue.filterItems[ownProps.match.params.pId+'__p']", state.filterSidebarValue.filterItems[ownProps.match.params.pId+"__p"])
  // console.log("tasks:"+state.task.tasks)
  // let bt = state.task.backlogTasks[ownProps.sprint._id];
  return {
    project: state.projects.project,
    user: state.common_reducer.user,
    sidebar: state.sidebar.sidebar,
    projects: state.projects.projects,
    workspaces: state.common_reducer.workspaces,
    // isAssignedToMe: state.filterSidebarValue.isAssignedToMe,
    taskId: state.task.taskItem,
    filter: state.filterSidebarValue.filterItems[ownProps.match.params.pId+"__p"],
    tasks: state.task.backlogTasks[ownProps.sprint._id],
    // tag: state.filterSidebarValue.tag,
    // showByTag: state.filterSidebarValue.showByTag,
    // showByAssignee: state.filterSidebarValue.showByAssignee,
    // assignee: state.filterSidebarValue.assignee,
    // showByUnassigned: state.filterSidebarValue.showByUnassigned,
    // deleteSectionToaster: state.task.deletSectionCompletely,
    paymentHeader: state.common_reducer.workspace,
    // backlogTasks: state.BackLog.backlogTasks[ownProps.status._id]
  };
}

export default
  withRouter(connect(
    mapStateToProps,
    {
      getTasks,
      getProjects,
      updateSprint,
      startSprint,
      moveStatus,
      deleteStatus,
      setTasks,
      setTask,
      updateTask,
      setSidebar,
      clearTaskItem,
      getFilteredBacklogTasks,
      archiveTasksBySection,
      // deleteStatusCompletely,
      getBacklogTasks,
      deleteSprint,
      getCurrentSprint,
      getSprintConfig
    }
  )(SprintSection)
  )