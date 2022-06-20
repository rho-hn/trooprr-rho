import React, { Component, Fragment } from "react";
import { withRouter } from 'react-router'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { ContainerOutlined, DeleteOutlined, EditOutlined,EllipsisOutlined } from '@ant-design/icons';
import { Menu, Dropdown, Select, Popover, notification, Input, Modal,Typography,Divider, Button } from 'antd';
import classnames from "classnames";
import _ from "lodash";
import { Droppable, Draggable } from "react-beautiful-dnd";
import DeleteModal from "../../../common/confirmation-modal";
import {
  updateStatus,
  moveStatus,
  deleteStatus
} from "../section/sectionActions";
import { 
  setTasks, 
  setTask, 
  addTask, 
  updateTask, 
  clearTaskItem, 
  archiveTasksBySection, 
  getFilteredTasks, 
  // deleteStatusCompletely 
} from "../task/taskActions";
import { setSidebar } from "../../sidebar/sidebarActions";
import TaskItem from "./TaskItem";
import AddTask from "../AddTask";
import { getProjects } from "../../projectActions";
import axios from 'axios';

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  background:(localStorage.getItem('theme') == "dark" && "none"),
  // styles we need to apply on draggables
  ...draggableStyle
});

const { Text } = Typography;

class TaskSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formSection: false,
      formTask: false,
      moveStatusDropdown: false,
      projectSelectValue: "",
      position: "",
      projecSectionCount: "",
      selectedTasks: [],
      positionLoad:false,
      statusUpdateForm:false
    };
    this.toggleFormTask = this.toggleFormTask.bind(this);
    this.toggleFormSection = this.toggleFormSection.bind(this);
    this.sectionMove = this.sectionMove.bind(this);
    // this.dropdownToggle = this.dropdownToggle.bind(this);
    this.positionChange = this.positionChange.bind(this);
    this.handleProjectChange = this.handleProjectChange.bind(this);
    // this._getFilteredTasks = this._getFilteredTasks.bind(this);
    this.archiveTasksBySection = this.archiveTasksBySection.bind(this);
    this.dropdownMenu=this.dropdownMenu.bind(this)
  }

  positionChange(pos) {
    this.setState({ position: pos });
  }

  _noRenderRow() {
    return <div style={{ opacity: 0, width: 0, height: 0 }}>No content</div>;
  }

  handleProjectChange(sId) {
   let wId=this.props.match.params.wId
    // var project = this.props.projects.find(project => project._id === id);
    // console.log("projectttttt",project);
    this.setState({positionLoad:true})
    // axios.get('/api/workspace/'+wId+'/project/'+pId+'/status').then(res => {
    axios.get('/api/'+wId+'/squad/'+sId+'/taskStatus').then(res => {
      if (res.data.success) {
        this.setState({
          projectSelectValue: sId,
          projecSectionCount: res.data.statuses.length,
          position: 1,
          positionLoad:false

        });
      }
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

  moveToActive = (isSelected, id) => {
    if (isSelected) {
      this.setState({ selectedTasks: [...this.state.selectedTasks, id] }, () => { this.props.showMoveToButton(this.state.selectedTasks) })
    }
    else {
      this.setState({ selectedTasks: this.state.selectedTasks.filter(taskId => taskId !== id) }, () => { this.props.showMoveToButton(this.state.selectedTasks) })
    }

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

  

  handleStatusMoreAction = e =>{
    let key = e.key
    if (key == "delete"){
      this.deleteStatusColumnConfirm()
    }else if (key == "archive"){
      this.archiveStatusTasksConfirm()
    }else if (key == "rename"){
     this.setState({ statusUpdateForm: true })
    }
  }

  dropdownMenu() {
    const {
      status,
    } = this.props;
    const { projecSectionCount } = this.state;
    let obj = {
      projecSectionCount: projecSectionCount,
      number: this.state.projectSelectValue === status.project ? 0 : 1
    }
    let sectionCount = obj.projecSectionCount + obj.number;
    let count = [];
    for (let i = 0; i < sectionCount; i++) {
      count.push(i + 1);
    }
    return (
      <Menu onClick={this.handleStatusMoreAction}>      
        <Menu.Item key="rename">
        <EditOutlined />
        <span>
        Rename
        </span>
      </Menu.Item>
        <Menu.Item key="delete">
        <DeleteOutlined />
        <span>
        Delete
        </span>
      </Menu.Item>
        <Menu.Item key="archive">
        <ContainerOutlined />
        <span>
        Archive
        </span>
      </Menu.Item>
      </Menu>
    );

  }

  deleteCompleteSection = () => {
    if (this.props.tasks == undefined || this.props.tasks.length === 0) {
      // this.props.deleteStatusCompletely();
      this.props.deleteStatus(this.props.match.params.wId,this.props.match.params.pId ,this.props.status._id).then(()=>{
        notification["success"]({
          message: 'Status deleted successfully',
          placement:'bottomLeft'
        })
      })
    }
    else {
      notification['error']({
        message: "Cant delete Status that has tasks in it",
        placement:'bottomLeft'
      })
    }
  }

  deleteStatusColumnConfirm = () => {
    Modal.confirm({
      title: 'Are you sure you want to delete this status?',
      // content: ,
      okText: 'Yes',
      cancelText: 'No',
      // className: "sidebar_dropdown",
      onOk: this.deleteCompleteSection,
      okText: "Yes",
      okType: 'primary',
    })
  }

archiveTasksBySection() {
  let data = {};
  data.availability = "archived";
  // console.log("id",this.props.status)
  const id = this.props.status._id;
  this.props.archiveTasksBySection(this.props.match.params.wId, data, id)
    .then(res => {
      if (res.data.success) {
        notification["success"]({
          message: 'Tasks archived successfully',
          placement:'bottomLeft'
        });
      }else {
        notification['error']({
          message: "Error archiving tasks in this status. Try again later",
          placement:'bottomLeft'
        })
      }
    })
}

archiveStatusTasksConfirm = () => {
  Modal.confirm({
    title: 'Are you sure you want to archive all tasks in this status?',
    // content: ,
    okText: 'Yes',
    cancelText: 'No',
    // className: "sidebar_dropdown",
    onOk: this.archiveTasksBySection,
    okText: "Yes",
    okType: 'danger',
  })
}

delayedUpdate = _.debounce(this.props.updateStatus, 1000)
_getCurrentFilterTasks = tasks => this.props._getFilteredTasks(tasks, this.props.filter)

  render() {
    // console.log(this.state.selectedTasks,"siva")
    const {
      name,
      status,
      tasks,
      addTask,
      index,
      filter,
      getFilteredTasks,
      _getFilteredTasks
    } = this.props;

    let filteredtasks = tasks && _getFilteredTasks(tasks, filter)    
    if (!(filteredtasks && filteredtasks.length > 0)) { filteredtasks = [] }
    //save in store
    getFilteredTasks(status._id, filteredtasks)
    let paymentStatus = this.props.paymentHeader.billing_status;
    return (
      <Draggable key={status._id} draggableId={status._id} index={index}>
        {(section_provided, snapshot) => (
          <div
            className="proj-box "
            ref={section_provided.innerRef}
            {...section_provided.draggableProps}
            // {...section_provided.dragHandleProps}
            style={getItemStyle(
              snapshot.isDragging,
              section_provided.draggableProps.style
            )}
          >
            <div
          {...section_provided.dragHandleProps}
    
              className={classnames(
                "sec-title d-flex justify-content-between",
                { "hidden-xl-down": this.state.formSection }
              )}
            >
              {this.state.statusUpdateForm ?              
                <div style={{ height: "29px", width: "100%", display: "flex", alignItems: "center" }}>
                  <Input
                    size="small"
                    style={{ paddingLeft: 4 }}
                    type="text"
                    onChange={e => {
                      // console.log("onchange..")
                      let n = e.target.value
                      n && (n != this.props.name) && this.delayedUpdate(this.props.match.params.wId, this.props.match.params.pId, status._id, { name: n })
                    }}
                    onBlur={e => { this.setState({ statusUpdateForm: false }) }}
                    onPressEnter={e => { this.setState({ statusUpdateForm: false }) }}
                    defaultValue={name}
                    autoComplete="off"
                    autoFocus />
                </div>
              : <Fragment>
                  <div className="d-flex fix-width">
                    <div className={localStorage.getItem('theme') == 'default' ? "kanban_section_name":'kanban_section_name_dark'} onClick={() => { this.setState({ statusUpdateForm: true }) }}>{name}</div>
                    <div className="number_Task">
                      {/* {tasks ? this.getTasks(status._id, tasks).length : 0} */}
                      <Text>{filteredtasks.length}</Text>
                    </div>
                  </div>
                  <Dropdown
                    overlay={this.dropdownMenu()} trigger={['click']}
                    className="task_options dropdown "
                  >
                    <div className={localStorage.getItem("theme") == 'default' ? "section_option_btn" : 'section_option_btn_dark' }
                      onClick={e => e.preventDefault()}
                    // onClick={this.dropdownToggle}
                    style={{borderRadius:'2px'}}
                    >
                      <i className="material-icons">
                        more_horiz
                  </i>
                  {/* <EllipsisOutlined /> */}
                    </div>

                  </Dropdown>
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
           {this.state.formTask?  <AddTask
                checkFilterable={this._getCurrentFilterTasks}
                backlog={false}
                id={status._id}
                addTask={addTask}
                wId={this.props.match.params.wId}
                pId={this.props.match.params.pId}
                isVisible={!this.state.formTask}
                toggle={this.toggleFormTask}
                scrollToTask={this.scrollToTask}
              />:filter !== "Complete Tasks" ? 
                <div
                  className={classnames("task-add cancel", {
                    "hidden-xl-down": this.state.formTask
                  })}
                style={{padding:(localStorage.getItem('theme') == 'dark' && "4px 0px")}}
                  onClick={this.toggleFormTask}
                >
                  {/* <span><Button style={{width:'100%',marginBottom:'8px'}}>+ Add new task</Button></span> */}
                  <span><Text>+ Add new task</Text></span>
                </div>:null
            }
            </div>
            <Droppable
              droppableId={status._id}
              status={status._id}
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
                      backlog={false}
                      index={index}
                      key={task._id}
                      taskItemKey={task._id}
                      // onClick={e => this.viewTask(e, task)}
                      // moveToActive={this.moveToActive}
                      updateSelectedTasks={this.props.updateSelectedTasks}
                    // onTaskRender={this.props.taskId === task._id ? this.onTaskRender : null}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        )}
      </Draggable>
    );
  }
}

function mapStateToProps(state, ownProps) {
  // console.log("state.task.tasks[ownProps.status._id]", state.task.tasks[ownProps.status._id])
  // console.log("filter from store:", state.filterSidebarValue.filterItems[ownProps.match.params.pId])
  return {
    project: state.projects.project,
    user: state.common_reducer.user,
    sidebar: state.sidebar.sidebar,
    projects: state.projects.projects,
    workspaces: state.common_reducer.workspaces,    
    taskId: state.task.taskItem,
    tasks: state.task.tasks[ownProps.status._id],
    deleteSectionToaster: state.task.deletSectionCompletely,
    // notAllowSectionDelete: state.task.notAllowSectionDelete,
    paymentHeader: state.common_reducer.workspace,
    filter:state.filterSidebarValue.filterItems[ownProps.match.params.pId],
  };
}

export default
  withRouter(connect(
    mapStateToProps,
    {
      // getTasks,
      getProjects,
      updateStatus,
      moveStatus,
      deleteStatus,
      setTasks,
      setTask,
      addTask,
      updateTask,
      setSidebar,
      clearTaskItem,
      getFilteredTasks,
      archiveTasksBySection,
      // deleteStatusCompletely,
      // notAllowStatusDelete,
    }
  )(TaskSection)
  )