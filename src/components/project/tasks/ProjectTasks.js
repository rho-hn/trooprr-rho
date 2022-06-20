import React, { Component, Fragment } from "react";
import { withRouter } from 'react-router'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { DragDropContext } from "react-beautiful-dnd";
import moment from "moment";
import queryString from "query-string";
import _ from "lodash";

import { Icon as LegacyIcon } from '@ant-design/compatible';
import { SmileOutlined, CoffeeOutlined, CheckOutlined, DoubleRightOutlined, ControlOutlined } from '@ant-design/icons';
import { PageHeader, notification, Result, Skeleton, Tag, Button,Popconfirm, Dropdown, Menu, message, Modal, Tooltip,Layout } from "antd";

import SprintConfig from './kanban/sprintConfigureModal'
import ExtendSprint from './kanban/extendSprintModal'
import "./task_item.css";
import "./common.css"
import KanbanPage from "./kanban/KanbanPage";
import FilterDropdown from "./filter_dropdown"

import {
  setTaskView,
  updateProject,
  updateProjectFilterValue
} from "../projectActions.js";
import {
  getTasks,
  getTask,
  setTasks,
  setTask,
  updateTaskPosition,
  getBacklogTasks,
  moveToActive,
  moveToInActive
} from "./task/taskActions";
import {
  getStatuses,
  setStatuses,
  updateStatus,
  deleteStatus
} from "./section/sectionActions";
import {
  updateSprint, 
  setFutureSprints, 
} from "./section/sprintActions"
import { setSidebar, getActivities } from "../sidebar/sidebarActions";
import {
  // setFilterSidebarValue,
  // clearFilters,
  // setTagValue,
  // setUnassigned,
  // setMembers
  setSquadFilter
} from "../sidebar/filter_sidebar_actions"
import { getSprintConfig, getFutureSprints, getCurrentSprint, addSprint, startSprint, completeCurrentSprint } from "./section/sprintActions"

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const {Content} = Layout

class ProjectTasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingMove: false,
      // moveTasks:[],
      selectedInActiveTasks: [],
      selectedActiveTasks: [],
      brewingSprint: false
    };
  }

  
  onDrag = result => {
    const isBacklog = this.props.backlog
    const wId = this.props.match.params.wId
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    if (
      source.droppableId === destination.droppableId &&
      result.destination.index === result.source.index
    ) {
      return;
    }

    if (result.type === "section" && isBacklog) {
      // this is for section drag and drop
      const { futureSprints, setFutureSprints, updateSprint } = this.props;  
      //add a dummy backlog to futureSprints
      let sprintsWithBacklog = [{}, ...futureSprints]    
      let order = reorder(
        sprintsWithBacklog,
        result.source.index,
        result.destination.index
      );

      var section1 = {};
      var section2 = {};

      if (
        order[result.destination.index - 1] &&
        order[result.destination.index + 1]
      ) {
        section1 = order[result.destination.index + 1];
        section2 = order[result.destination.index - 1];
        var new_position = (section1.position + section2.position) / 2;
        order[result.destination.index].position = new_position;
      } else if (
        !order[result.destination.index - 1] &&
        order[result.destination.index + 1]
      ) {
        var new_position = order[result.destination.index + 1].position / 2;
        order[result.destination.index].position = new_position;
      } else if (
        order[result.destination.index - 1] &&
        !order[result.destination.index + 1]
      ) {
        var new_position = order[result.destination.index - 1].position + 0.0001;
        order[result.destination.index].position = new_position;
      }
      updateSprint(wId, this.props.match.params.pId, result.draggableId, {position:order[result.destination.index].position});
      //remove the dummy backlog
      order.shift()
      setFutureSprints(order)
    } else if (result.type === "section" && !isBacklog) {
      // this is for section drag and drop
      const { statuses, setStatuses, updateStatus } = this.props;
      var order = reorder(
        statuses,
        result.source.index,
        result.destination.index
      );

      var section1 = {};
      var section2 = {};

      if (
        order[result.destination.index - 1] &&
        order[result.destination.index + 1]
      ) {
        section1 = order[result.destination.index + 1];
        section2 = order[result.destination.index - 1];
        var new_position = (section1.position + section2.position) / 2;
        order[result.destination.index].position = new_position;
      } else if (
        !order[result.destination.index - 1] &&
        order[result.destination.index + 1]
      ) {
        var new_position = order[result.destination.index + 1].position / 2;
        order[result.destination.index].position = new_position;
      } else if (
        order[result.destination.index - 1] &&
        !order[result.destination.index + 1]
      ) {
        var new_position =
          order[result.destination.index - 1].position + 0.0001;
        order[result.destination.index].position = new_position;
      }
      // console.log("order[result.destination.index] for updating status obj:",order[result.destination.index])
      updateStatus(wId, this.props.match.params.pId, result.draggableId, {position:order[result.destination.index].position});
      setStatuses(order);
    } else {
      // this is for task drag and drop
      if (_.isEmpty(this.props.filterItems)) {
        // console.log("no filter branch..")
        if (source.droppableId === destination.droppableId) {

          const tasks = this.props.backlog ? this.props.backlogTasks[source.droppableId] : this.props.tasks[source.droppableId];
          const { section, setTasks, updateTaskPosition } = this.props;

          const order = reorder(
            tasks,
            result.source.index,
            result.destination.index
          );

          if (
            order[result.destination.index - 1] &&
            order[result.destination.index + 1]
          ) {
            var task1 = order[result.destination.index + 1];
            var task2 = order[result.destination.index - 1];
            var new_position = (task1.position + task2.position) / 2;
            order[result.destination.index].position = new_position;
            setTasks(source.droppableId, order, this.props.backlog, source.droppableId);
            // console.log("order[result.destination.index]:"+JSON.stringify(order[result.destination.index]))
            updateTaskPosition(this.props.match.params.wId, order[result.destination.index], this.props.backlog);
          } else if (
            !order[result.destination.index - 1] &&
            order[result.destination.index + 1]
          ) {
            var new_position =
              order[result.destination.index + 1].position + 0.0001;
            order[result.destination.index].position = new_position;
            setTasks(source.droppableId, order, this.props.backlog, source.droppableId);
            // console.log("order[result.destination.index]:"+JSON.stringify(order[result.destination.index]))
            updateTaskPosition(this.props.match.params.wId, order[result.destination.index], this.props.backlog);
          } else if (
            order[result.destination.index - 1] &&
            !order[result.destination.index + 1]
          ) {
            var new_position = order[result.destination.index - 1].position / 2;
            order[result.destination.index].position = new_position;
            setTasks(source.droppableId, order, this.props.backlog, source.droppableId);
            // console.log("order[result.destination.index]:"+JSON.stringify(order[result.destination.index]))
            updateTaskPosition(this.props.match.params.wId, order[result.destination.index], this.props.backlog);
          }
        } else {
          // console.log("moving task across sections.. ssource.droppableId:"+source.droppableId+" destination.droppableId:"+destination.droppableId)
          const { statuses, setTasks, updateTaskPosition } = this.props;
          const tasks = this.props.backlog ? this.props.backlogTasks : this.props.tasks
          let sourceList = tasks[source.droppableId] ? tasks[source.droppableId] : []
          let newList = tasks[destination.droppableId] ? tasks[destination.droppableId] : []
          const order = move(
            sourceList,
            newList,
            source,
            destination
          );
          setTasks(source.droppableId, order[source.droppableId], this.props.backlog, source.droppableId);
          var destinationSection = order[destination.droppableId];

          if (
            destinationSection[result.destination.index - 1] &&
            destinationSection[result.destination.index + 1]
          ) {
            var task1 = destinationSection[result.destination.index + 1];
            var task2 = destinationSection[result.destination.index - 1];
            var new_position = (task1.position + task2.position) / 2;
            destinationSection[
              result.destination.index
            ].position = new_position;
            destinationSection[result.destination.index][isBacklog ? "sprint" : "status"] = destination.droppableId;
            setTasks(destination.droppableId, destinationSection, this.props.backlog, destination.droppableId);
            updateTaskPosition(this.props.match.params.wId, destinationSection[result.destination.index], this.props.backlog);
          } else if (
            !destinationSection[result.destination.index - 1] &&
            destinationSection[result.destination.index + 1]
          ) {
            var new_position =
              destinationSection[result.destination.index + 1].position +
              0.0001;

            destinationSection[
              result.destination.index
            ].position = new_position;
            destinationSection[result.destination.index][isBacklog ? "sprint" : "status"] = destination.droppableId;
            setTasks(destination.droppableId, destinationSection, this.props.backlog, destination.droppableId);
            updateTaskPosition(this.props.match.params.wId, destinationSection[result.destination.index], this.props.backlog);
          } else if (
            destinationSection[result.destination.index - 1] &&
            !destinationSection[result.destination.index + 1]
          ) {
            var new_position =
              destinationSection[result.destination.index - 1].position / 2;
            destinationSection[
              result.destination.index
            ].position = new_position;
            destinationSection[result.destination.index][isBacklog ? "sprint" : "status"] = destination.droppableId;
            setTasks(destination.droppableId, destinationSection, this.props.backlog, destination.droppableId);
            updateTaskPosition(this.props.match.params.wId, destinationSection[result.destination.index], this.props.backlog);
          } else {
            destinationSection[result.destination.index][isBacklog ? "sprint" : "status"] = destination.droppableId;
            destinationSection[result.destination.index].position = 1;
            setTasks(destination.droppableId, destinationSection, this.props.backlog, destination.droppableId);
            updateTaskPosition(this.props.match.params.wId, destinationSection[result.destination.index], this.props.backlog);
          }
        }
      } else {
        //when there is filter 
        const { statuses, setTasks, updateTaskPosition } = this.props;
        // this.props.backlog ? this.props.backlogTasks[source.droppableId] : this.props.tasks[source.droppableId];
        var finalTasks = isBacklog ? this.props.finalBacklogTasks[source.droppableId]:this.props.finalTasks[source.droppableId];
        if (source.droppableId === destination.droppableId) {
          //intra section
          var tasks = this.props.backlog ? this.props.backlogTasks[source.droppableId] : this.props.tasks[source.droppableId];
          // let tasks = finalTasks

          // console.log("this.props.backlogTasks?",this.props.backlogTasks)
          // console.log("finalTasks:",finalTasks)
          const { section, setTasks, updateTaskPosition } = this.props;

          const order = reorder(
            finalTasks,
            result.source.index,
            result.destination.index
          );

          var taskIndex = tasks.findIndex(
            task => task._id == result.draggableId
          );
          if (
            order[result.destination.index - 1] &&
            order[result.destination.index + 1]
          ) {
            var task1 = order[result.destination.index + 1];
            var index = tasks.findIndex(task => task._id == task1._id);

            var task2 = tasks[index - 1];
            var new_position = (task1.position + task2.position) / 2;
            tasks[taskIndex].position = new_position;
          } else if (
            !order[result.destination.index - 1] &&
            order[result.destination.index + 1]
          ) {
            var task1 = order[result.destination.index + 1];
            var index = tasks.findIndex(task => task._id == task1._id);

            if (index === 0) {
              var new_position =
                order[result.destination.index + 1].position + 0.0001;
              tasks[taskIndex].position = new_position;
            } else {
              var task2 = tasks[index - 1];
              var new_position = (task1.position + task2.position) / 2;
              tasks[taskIndex].position = new_position;
            }
          } else if (
            order[result.destination.index - 1] &&
            !order[result.destination.index + 1]
          ) {
            var task1 = order[result.destination.index - 1];
            var index = tasks.findIndex(task => task._id == task1._id);

            if (index + 1 === tasks.length) {
              var new_position =
                order[result.destination.index - 1].position / 2;

              tasks[taskIndex].position = new_position;
            } else {
              var task2 = tasks[index + 1];

              var new_position = (task1.position + task2.position) / 2;
              tasks[taskIndex].position = new_position;
            }
          }

          updateTaskPosition(wId, tasks[taskIndex], this.props.backlog);
          var finaldestinationSection = tasks.sort(
            (task3, task4) => task4.position - task3.position
          );
          setTasks(destination.droppableId, finaldestinationSection, this.props.backlog, destination.droppableId);
        } else {
          //across sections
          var finalSourceTasks = isBacklog ? this.props.finalBacklogTasks[source.droppableId]?this.props.finalBacklogTasks[source.droppableId]:[]
            :this.props.finalTasks[source.droppableId] ? this.props.finalTasks[source.droppableId] : [];

          var finalDestinationTasks = isBacklog ? this.props.finalBacklogTasks[destination.droppableId] ? this.props.finalBacklogTasks[destination.droppableId] : []:
            this.props.finalTasks[destination.droppableId] ? this.props.finalTasks[destination.droppableId] : []
          const { statuses, setTasks, updateTaskPosition } = this.props;
          let tasks = isBacklog ? this.props.backlogTasks: this.props.tasks

          // console.log("tasks:",tasks)
          // console.log("finalSourceTasks:",finalTasks)
          // console.log("finalDestinationTasks:",finalTasks)

          const order = move(
            finalSourceTasks,
            finalDestinationTasks,
            source,
            destination
          );

          var newSourceTasks = tasks[source.droppableId].filter(
            (task, idx) => task._id !== result.draggableId
          );

          var destinationSection = tasks[destination.droppableId] ? tasks[destination.droppableId] : [];
          // console.log("destination section tasks before drop:",destinationSection)
          var filtereddestinationSection = order[destination.droppableId] ? order[destination.droppableId] : [];
          // console.log("expected destination section tasks after drop:",filtereddestinationSection)
          // console.log("result.destination.index:",result.destination.index)
          if (
            filtereddestinationSection[result.destination.index - 1] &&
            filtereddestinationSection[result.destination.index + 1]
          ) {
            var task1 =
              filtereddestinationSection[result.destination.index + 1];
            var index = destinationSection.findIndex(
              task => task._id == task1._id
            );
            var task2 = destinationSection[index - 1];
            var new_position = (task1.position + task2.position) / 2;
            filtereddestinationSection[
              result.destination.index
            ].position = new_position;
            filtereddestinationSection[result.destination.index][isBacklog ? "sprint" : "status"] =
              destination.droppableId;
          } else if (
            !filtereddestinationSection[result.destination.index - 1] &&
            filtereddestinationSection[result.destination.index + 1]
          ) {
            var task1 =
              filtereddestinationSection[result.destination.index + 1];
            var index = destinationSection.findIndex(
              task => task._id == task1._id
            );
            if (index === 0) {
              var new_position = task1.position + 0.0001;
              filtereddestinationSection[
                result.destination.index
              ].position = new_position;
              filtereddestinationSection[result.destination.index][isBacklog ? "sprint" : "status"] =
                destination.droppableId;
            } else {
              var task2 = destinationSection[index - 1];
              var new_position = (task1.position + task2.position) / 2;
              filtereddestinationSection[
                result.destination.index
              ].position = new_position;
              filtereddestinationSection[result.destination.index][isBacklog ? "sprint" : "status"] =
                destination.droppableId;
            }
          } else if (
            filtereddestinationSection[result.destination.index - 1] &&
            !filtereddestinationSection[result.destination.index + 1]
          ) {
            var task1 =
              filtereddestinationSection[result.destination.index - 1];
            var index = destinationSection.findIndex(
              task => task._id == task1._id
            );
            if (index + 1 === destinationSection.length) {
              var new_position = task1.position / 2;
              filtereddestinationSection[
                result.destination.index
              ].position = new_position;
              filtereddestinationSection[result.destination.index][isBacklog ? "sprint" : "status"] =
                destination.droppableId;
            } else {
              var task2 = destinationSection[index + 1];
              var new_position = (task1.position + task2.position) / 2;
              filtereddestinationSection[
                result.destination.index
              ].position = new_position;
              filtereddestinationSection[result.destination.index][isBacklog ? "sprint" : "status"] =
                destination.droppableId;
            }
          } else {
            // console.log("figured no tasks in destination section")
            if (destinationSection.length === 0) {
              filtereddestinationSection[result.destination.index][isBacklog ? "sprint" : "status"] =
                destination.droppableId;
              filtereddestinationSection[result.destination.index].position = 1;
            } else {
              var task1 = destinationSection[destinationSection.length - 1];
              filtereddestinationSection[result.destination.index][isBacklog ? "sprint" : "status"] =
                destination.droppableId;
              filtereddestinationSection[result.destination.index].position =
                task1.position / 2;
            }
          }
          destinationSection.push(
            filtereddestinationSection[result.destination.index]
          );
          var finaldestinationSection = destinationSection.sort(
            (task3, task4) => task4.position - task3.position
          );
          // console.log("destination section to store..",finaldestinationSection, " for sprint ", destination.droppableId)
          setTasks(destination.droppableId, finaldestinationSection, this.props.backlog, destination.droppableId)
          setTasks(source.droppableId, newSourceTasks, this.props.backlog, source.droppableId)
          
          updateTaskPosition(wId, filtereddestinationSection[result.destination.index], this.props.backlog)
        }
      }
    }

    // } 
  }

  // componentWillUnmount() {
  //   this.props.getActivities();
  //   this.props.clearFilters();
  // }

  // fetchUrlFilters = (params) => {

  //   const filter = params.filter;
  //   const sort = params.sort;
  //   const member = params.member;
  //   const filter_array = [
  //     "Incomplete Tasks",
  //     "Complete Tasks",
  //     "All Tasks",
  //     "OVER_DUE"
  //   ];
  //   const sort_array = ["None", "Alphabetic", "Due Date", "Assignee"];
  //   if (member === "UA") {
  //     this.props.setUnassigned();
  //   }

  //   if (filter_array.indexOf(filter) != -1) {
  //     this.props.setFilterSidebarValue(filter);
  //   }
  //   if (sort_array.indexOf(sort) != -1) {
  //     this.setState({ sort });
  //     this.props.setSidebar("");
  //   }
  // }

  componentDidMount() {
    // this.props.getStatuses(this.state.id);
    // this.props.getTasks(this.state.id);
    // modal_updated = false;
    let pId = this.props.match.params.pId
    let wId = this.props.match.params.wId
    const qParams = queryString.parse(window.location.search);

    this.props.getCurrentSprint(wId, pId)
    this.props.getStatuses(wId, pId)
    this.props.getFutureSprints(wId, pId)
    this.props.getTasks(wId, pId);
    this.props.getBacklogTasks(wId, pId)
    this.props.getSprintConfig(wId, pId)

    // this.fetchUrlFilters(qParams)

    //open the task sidebar for the current task
    if (this.props.match.params.tid) {
      this.props.getTask(wId, this.props.match.params.tid).then(res => {
        if (res.data.success) {
          this.props.setSidebar("task");
        }
      });
    }

  }

  componentDidUpdate(prevProps, prevState) {
    
    if (this.props.match.params.tid && this.props.match.params.tid !== prevProps.match.params.tid) {
      this.props.getTask(this.props.match.params.wId, this.props.match.params.tid).then(res => {
        this.props.setSidebar("task");
      })
    }
    //to remove selected task if the selected task is deleted
    if(prevProps.tasks != this.props.tasks){
      const parsedQueryString = queryString.parse(window.location.search);
      if(parsedQueryString.view=='active' && this.state.selectedActiveTasks.length > 0){
        let allTasks = [];
        let updatedselectedActiveTasks = [];
        //get all tasks in one array
        this.props.statuses&&this.props.statuses.forEach(status => {
          this.props.tasks[status._id]&&this.props.tasks[status._id].forEach(task => {
            allTasks.push(task)
          })
        })

        this.state.selectedActiveTasks.forEach(task => {
          let taskFound = allTasks.find(t => t._id == task);
          taskFound && updatedselectedActiveTasks.push(task)
        })
        this.setState({selectedActiveTasks:updatedselectedActiveTasks})
      }
    }

    if(prevProps.backlogTasks != this.props.backlogTasks){
      const parsedQueryString = queryString.parse(window.location.search);
      if(parsedQueryString.view='backlog'&& this.state.selectedInActiveTasks.length > 0){
        let allTasks = [];
        let updatedselectedInActiveTasks = [];
        this.props.backlogTasks.__backlog.forEach(task => {
          allTasks.push(task);
        })
        this.props.futureSprints&&this.props.futureSprints.forEach(status => {
          this.props.backlogTasks[status._id]&&this.props.backlogTasks[status._id].forEach(task => {
            allTasks.push(task);
          })
        })

        this.state.selectedInActiveTasks.forEach(task => {
          let taskFound = allTasks.find(t => t._id == task);
          taskFound && updatedselectedInActiveTasks.push(task)
        })
        this.setState({selectedInActiveTasks:updatedselectedInActiveTasks})
      }
    }
  }

  moveTasksToActive = () => {
    this.setState({ loadingMove: true })
    let data = {
      tasks: this.state.selectedInActiveTasks,
      isActive: true
    }
    this.props.moveToActive(this.props.match.params.wId, this.props.match.params.pId, data).then(res => {
      // this.setState({ selectedInActiveTasks: [], loadingMove: false })
      // this.props.getTasks(this.props.match.params.wId, this.props.match.params.pId)
      if (res.data.success) {
        //        
        this.removeFilter(this.state.selectedInActiveTasks)
      } else {
        notification['error']({
          message: res.data.err ? res.data.err : "Could not complete request",
          placement: 'bottomLeft'
        })
      }

      this.setState({ selectedInActiveTasks: [], loadingMove: false })


    })
  }

  removeFilter = (selectedTasks) => {
    //get current filters
    let filterSelectValues = []
    let allTasks = []
    this.props.filterItems && this.props.filterItems.map(item => {
      filterSelectValues.push({
        key:item.value.id,
        label:item.type+":"+item.value.name,
        value:item.value.id
      })
    })


      selectedTasks.forEach(id => {
        let index = filterSelectValues.find(filter => filter.key == id)
        filterSelectValues.splice(index,1)
      })

      this.handleChange(filterSelectValues)

  }

  handleChange = values => {
    // this.setState({filterSelectValues:values})
    //transform and store
    let storeFilters = []
    values.forEach(value => {
      let vsplit = value.label.split(":")
      storeFilters.push({type:vsplit[0],value:{name:vsplit[1],id:value.key}})
    })
    // console.log("storing..",storeFilters)
    this.storeSquadFilter(storeFilters)
  }

  storeSquadFilter(filter) {
    let query = queryString.parse(window.location.search);
    this.props.setSquadFilter(filter, this.props.match.params.pId  + ((query.view === "active")?"":"__p"))
  }

  moveTasksToInActive = (sprint) => {
    this.setState({ loadingMove: true })
    let data = {
      tasks: this.state.selectedActiveTasks,
      isActive: false,
      sprint: sprint
    }
    
    this.props.moveToInActive(this.props.match.params.wId, this.props.match.params.pId, data).then(res => {
      // this.props.getTasks(this.props.match.params.wId, this.props.match.params.pId)
      if (res.data.success) {
        //  
        this.removeFilter(this.state.selectedActiveTasks) 
      } else {
        notification['error']({
          message: res.data.err ? res.data.err : "Could not complete request",
          placement: 'bottomLeft'
        })
      }

      this.setState({ selectedActiveTasks: [], loadingMove: false })

    })


  }

  _updateSelectedInActiveTasks = (isSelected, id) => {
    if (isSelected) {
      // console.log("adding task to selected tasks:"+id)      
      this.setState({
        selectedInActiveTasks: [...this.state.selectedInActiveTasks, id]
      })
    }
    else {
      this.setState({
        selectedInActiveTasks: this.state.selectedInActiveTasks.filter(taskId => taskId !== id)
      })
    }
  }

  _updateSelectedActiveTasks = (isSelected, id) => {
    if (isSelected) {
      // console.log("adding task to selected tasks:"+id)      
      this.setState({
        selectedActiveTasks: [...this.state.selectedActiveTasks, id]
      })
    }
    else {
      this.setState({
        selectedActiveTasks: this.state.selectedActiveTasks.filter(taskId => taskId !== id)
      })
    }
  }
  // {(moveTasks) => this.setState({ moveTasks })}

  _startNewSprint = () => {
    const { wId, pId } = this.props.match.params
    this.setState({ brewingSprint: true })
    this.props.addSprint(wId, pId).then(res => {
      if (res.data.success) {
        return this.props.startSprint(wId, pId, res.data.sprint._id)
      }
    }).then(res => {
      if (res.data.success) {
        this.props.getCurrentSprint(wId, pId)
        this.props.getTasks(wId, pId)
        this.props.getSprintConfig(wId, pId)
      } else {
        notification["error"]({
          message: res.data.errors ? res.data.errors : "Could not complete request",
          placement: 'bottomLeft'
        })
      }
      this.setState({ brewingSprint: false })
    }).catch(err => {
      this.setState({ brewingSprint: false })
      notification["error"]({
        message: err,
        placement: 'bottomLeft'
      })
      console.error(err)
    })
  }

  _completeSprint = () => {
    // console.log("completing sprint..")
    const { wId, pId } = this.props.match.params
    this.props.completeCurrentSprint(wId, pId).then(res => {
      if (res.data.success) {
        notification["success"]({
          message: `Sprint completed successfully and incomplete tasks moved to ${(this.props.sprintConfig.spillOver==="sprint")?"Next Sprint":"Backlog"}`,
          description: `${(this.props.sprintConfig.spillOver==="sprint")?"When no Next Sprint is planned, incomplete tasks will be moved to Backlog":""}`,
          placement: 'bottomLeft'
        })
        this.props.getCurrentSprint(wId, pId)
        this.props.getTasks(wId, pId)
        this.props.getFutureSprints(wId, pId)
        this.props.getSprintConfig(wId, pId)
        this.props.getBacklogTasks(wId, pId)
      } else {
        notification["error"]({
          message: res.data.errors ? res.data.errors : "Could not complete request",
          placement: 'bottomLeft'
        })
      }
    }).catch(err => {
      notification["error"]({
        message: err,
        placement: 'bottomLeft'
      })
      console.error(err)
    })
  }
  //  !this.props.backlog && this.props.currentSprint && this.props.currentSprint.name && <Button type="primary" onClick={this._completeSprint}>Complete Sprint : {this.trunc(this.props.currentSprint.name)}</Button>
  trunc = name => name.length <= 13 ? name : name.slice(0, 13) + '..'

  handleSprintMenu = ({ key }) => {
    // message.info("clicked: ", JSON.stringify(key))
    // console.log("handleSprintMenu:", key)
    if(key === "complete_sprint"){
      Modal.confirm({
        title: "Are you sure you want to complete the Sprint?",
        okText:"Complete",
        onOk:this._completeSprint,       
        // icon: <ExclamationCircleOutlined style={{color: "#faad14"}} />,
        // onCancel: {}
        })
    }
  }

  trunc = t => t.length > 13 ? `${t.substring(0, 13)}..` : t

  render() {
    // console.log("this.props.currentSprint.startedOn:", this.props.currentSprint.startedOn, "this.props.sprintConfig.duration:", this.props.sprintConfig.duration)
    // console.log("this.props.sprintConfig.next_run_at: ", this.props.sprintConfig.next_run_at)
    const {
      sections,
      tasks,
      tags,
      sidebar,
      user,
      project
    } = this.props;
    let moveMode = (this.props.backlog && this.state.selectedInActiveTasks.length > 0) || (!this.props.backlog && this.state.selectedActiveTasks.length > 0)
    let routes=[
      {
        path: 'index',
        breadcrumbName: 'Squads',
      },
      {
        path: 'first',
        breadcrumbName: project && project.name ? this.trunc(project.name):"",
      },
    ]
    return <>
      <PageHeader
        // ghost
        style={{
          // backgroundColor: "#ffffff",
          width: "100%",
        }}
        // breadcrumb={{routes}}
        className="site-page-header-responsive projecttasks_header"
        // tags={!this.props.backlog && this.props.currentSprint && this.props.currentSprint.name && <Tag color="blue">{this.props.currentSprint.name}</Tag>}
        extra={[
          !moveMode? !this.props.backlog ? this.props.currentSprint && this.props.currentSprint.name && 
          // getSprintConfig
          this.props.currentSprint && this.props.sprintConfig && this.props.sprintConfig.endAt &&<Dropdown.Button
            onClick={(e) => e.preventDefault()} 
            overlay={(
              <Menu onClick={this.handleSprintMenu}>
                <Menu.Item key="complete_sprint" icon={<CheckOutlined />}>
                  Complete Now
                </Menu.Item>
                <Menu.Item  key="extend_sprint" >
                  {/* Extend */}
                  <ExtendSprint />
                </Menu.Item>
                {/* <Menu.Item key="manage_sprint" icon={<ControlOutlined />}>
                  Manage
                </Menu.Item> */}
                <Menu.Item>
                <SprintConfig />
                </Menu.Item>
              </Menu>
            )}
            buttonsRender={([leftButton, rightButton]) => [
              <Tooltip placement="bottomRight"
                title={<span>Sprint ends on {moment(this.props.sprintConfig.endAt).format('MMM Do')}. <br/>Sprint started on {moment(this.props.currentSprint.startedOn).format('MMM Do')}</span>}
                key="leftButton"
              >
                {leftButton}
              </Tooltip>,
              React.cloneElement(rightButton)
            ]}
          >
             {
              // this.props.currentSprint && this.props.sprintConfig && 
              `${this.trunc(this.props.currentSprint.name)} ends ` + moment(this.props.sprintConfig.endAt).fromNow()
              }
          </Dropdown.Button>
        //  <Popconfirm
        //  title='Are you sure you want to complete the sprint?.'
        //  onConfirm={this._completeSprint}
        //  okText='Yes'
        //  placement='left'
        //  >
        //    <Button type="primary"/* onClick={this._completeSprint}*/>Complete Sprint : {this.trunc(this.props.currentSprint.name)}
        //    </Button>
        //   </Popconfirm>
          :<SprintConfig/>
        :""      
        ]}
        title={
          <Fragment>
            {((this.props.backlog && this.state.selectedInActiveTasks.length > 0) || (!this.props.backlog && this.state.selectedActiveTasks.length > 0))?  
            (this.props.backlog && this.state.selectedInActiveTasks.length > 0)?
            <>

              {/* <span style={{ paddingLeft: "4px" }}>Move to :  */}
              <Button loading={this.state.loadingMove}
                onClick={this.moveTasksToActive}
                type="primary"
              // size="small"
              >
                Move {this.state.selectedInActiveTasks.length} {this.state.selectedInActiveTasks.length === 1 ? " Task" : " Tasks"} to Active
              </Button>
              <span style={{ paddingLeft: "4px" }} />
              <Button
                onClick={() => this.setState({ selectedInActiveTasks: [], loadingMove: false })}
              // size="small"
              >
                Cancel
              </Button>
              {/* </span> */}
            </>: 
            <>
            {this.props.futureSprints && this.props.futureSprints.length>0?             
              <Dropdown.Button 
                type="primary"
                onClick={() => this.moveTasksToInActive()}
                overlay={
                  (<Menu >
                  {this.props.futureSprints.map((sprint, index) => {
                    return (                      
                        <Menu.Item onClick={() => this.moveTasksToInActive(sprint._id)} key={sprint._id}>
                          Move to Sprint {sprint.name}
                        </Menu.Item>                      
                      )                      
                  })}
                  </Menu>)
                }
              >
                Move {this.state.selectedActiveTasks.length} {this.state.selectedActiveTasks.length === 1 ? " Task" : " Tasks"} to Backlog
              </Dropdown.Button>
              :
               <Button loading={this.state.loadingMove}
                onClick={() => this.moveTasksToInActive()}
                type="primary"
              // size="small"
              >
                Move {this.state.selectedActiveTasks.length} {this.state.selectedActiveTasks.length === 1 ? " Task" : " Tasks"} to Backlog
              </Button>
            }

              <span style={{ paddingLeft: "4px" }} />
              <Button
                onClick={() => this.setState({ selectedActiveTasks: [], loadingMove: false })}
              // size="small"
              >
                Cancel
              </Button>
              {/* </span> */}
            </>
              : <>
                {/* <LegacyIcon
                  className="trigger"
                  type={this.props.squadMenuCollapsed ? "menu-unfold" : "menu-fold"}
                  onClick={this.props.toggleSquadMenu}
                />
                <span style={{ paddingLeft: "16px" }}/> */}
                <span>
                  {/* {project && project.name ? (this.trunc(project.name).toUpperCase() + (this.props.backlog ? " Plan Tasks" :  " Active Tasks" )) : ''} */}
                  {(this.props.backlog ? "Plan Tasks" :  "Active Tasks" )}
                </span>
              </>
            }
          </Fragment>
        }

        // subTitle={<div>{!this.state.subview == "status" ? <FilterDropdown /> : ''}</div>}
        subTitle={!moveMode && (this.props.backlog || ((!this.props.backlog) && this.props.currentSprint._id)) && 
          (<FilterDropdown subview={this.props.subview} />)}
      />

      <Content
        style={{
          height: '75vh',
          //height: '100vh',
          // paddingLeft: 24,
          // paddingTop: 16,
          // zIndex: "9", 
          // overflowX: "scroll",
          //overflow: 'hidden',
          overflow: 'auto',
          padding: "16px 16px 32px 24px"
          // background: (localStorage.getItem('theme') == 'default' ? "#ffffff" : "rgba(15,15,15)")
        }}
      >
        {(this.props.backlog || ((!this.props.backlog) && this.props.currentSprint._id)) ? 
        <div className="proj_task_container">
          <DragDropContext onDragEnd={this.onDrag}>
            <KanbanPage
              isVisible={true}
              onDrag={this.onDrag}
              sidebar={sidebar}
              backlog={this.props.backlog}
              updateSelectedInActiveTasks={this._updateSelectedInActiveTasks}
              selectedInActiveTasks={this.state.selectedInActiveTasks}
              updateSelectedActiveTasks={this._updateSelectedActiveTasks}
              selectedActiveTasks={this.state.selectedActiveTasks}
              user={user}
              sections={sections}
              tasks={tasks}
              getFilteredTasks={this.props.getFilteredTasks}
            />
          </DragDropContext>
        </div> 
        : (this.props.sprintConfig && this.props.sprintConfig.next_run_at)?
          <>
            <div>
              <Result
                icon={<SmileOutlined rotate={180} />}
                title="Sprint Break!"
                subTitle={<span>Take a break, your next Sprint starts{" "}
                {this.props.sprintConfig && this.props.sprintConfig.next_run_at && 
                  moment(this.props.sprintConfig.next_run_at).fromNow()}
                  </span>}            
                // extra={
                //   <Button type="primary" onClick={this._startNewSprint}>
                //     Start Sprint
                // </Button>
                // }
              />
          </div>
          </>
        :
          <div>
            <Skeleton loading={this.state.brewingSprint}>
              <Result
                icon={<CoffeeOutlined />}
                title="Start a new Sprint"
                subTitle="If you have a planned future Sprint, go to Plan view and start one."
                extra={
                  <Button type="primary" onClick={this._startNewSprint}>
                    Start Sprint
                </Button>
                }
              />
            </Skeleton>
          </div>}

      </Content>
      

    </>;
  }
}

function mapStateToProps(store, ownProps) {
  // console.log("state.currentSprint:", state.sprints.currentSprint)
  return {
    currentSprint: store.sprints.currentSprint,
    project: store.projects.project,
    statuses: store.statuses,
    projectNotDelete: store.task.projectNotDelete,
    sidebar: store.sidebar.sidebar,
    user: store.common_reducer.user,
    // filterValue: store.filterSidebarValue.filterItems,
    filterItems: store.filterSidebarValue.filterItems[ownProps.match.params.pId  + ((ownProps.subview === "active")?"":"__p")],
    showByAssignee: store.filterSidebarValue.showByAssignee,
    showByUnassigned: store.filterSidebarValue.showByUnassigned,
    showByTag: store.filterSidebarValue.showByTag,
    finalTasks: store.task.filteredTasks,
    finalBacklogTasks: store.task.filteredBacklogTasks,
    tasks: store.task.tasks,
    backlogTasks: store.task.backlogTasks,
    futureSprints: store.sprints.futureSprints,
    sprintConfig:store.sprints.sprintConfig,
    // allTasks:store.task.backlogTasks,

    filterItems: store.filterSidebarValue.filterItems[ownProps.match.params.pId  + ((ownProps.subview === "active")?"":"__p")]
  }
}

export default withRouter(connect(
  mapStateToProps,
  {
    setTasks,
    // setTagValue,
    setStatuses,
    updateTaskPosition,
    updateStatus,
    getStatuses,
    // setTaskView,
    updateProject,
    setTask,
    setSidebar,
    getTasks,
    getBacklogTasks,
    getTask,
    // setFilterSidebarValue,
    // clearFilters,
    getActivities,
    // setUnassigned,
    updateProjectFilterValue,
    deleteStatus,
    getFutureSprints,
    getCurrentSprint,
    addSprint,
    moveToActive,
    moveToInActive,
    startSprint,
    completeCurrentSprint,
    getSprintConfig,
    setFutureSprints,
    updateSprint,setSquadFilter
  }
)(ProjectTasks))