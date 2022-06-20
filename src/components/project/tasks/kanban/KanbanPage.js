import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { Droppable } from 'react-beautiful-dnd';
import { withRouter } from 'react-router-dom';
import { Input, Typography } from "antd";

import TaskSection from './TaskSection';
import UpsertSection from './UpsertSection';
import SprintSection from './SprintSection';
import { setStatuses, addStatus, updateStatus } from '../section/sectionActions';
import { setTasks, updateTaskPosition } from '../task/taskActions';
import { setSidebar } from '../../sidebar/sidebarActions';
import {addSprint} from "../section/sprintActions"
import moment from 'moment';
const { Text } = Typography

class KanbanPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formSection: false,
      showTagsDetails: false
    };
    this.counter = 0;
    this.toggleFormSection = this.toggleFormSection.bind(this);
    this.onSortEnd = this.onSortEnd.bind(this);
    this.shouldCancelStart = this.shouldCancelStart.bind(this);
    this.toggleTags = this.toggleTags.bind(this);
  }
  toggleFormSection() {
    this.setState({
      formSection: !this.state.formSection
    });
  }

  onSortEnd({ oldIndex, newIndex }) {
    if (oldIndex !== newIndex) {
    }
  }

  toggleTags(e) {
    e.stopPropagation();
    this.setState(prevState => ({
      showTagsDetails: !prevState.showTagsDetails
    }));
  }

  shouldCancelStart(e) {
    if (e.target.closest(".cancel")) {
      return true;
    }
  }

  _getFilteredTasks(tasks, filterItems) {  
    // console.log("getFilteredTasks: filter:",JSON.stringify(filterItems))  
    let finalTasks = [];
    if (tasks) {
      // console.log("all tasks length:", tasks.length, " filterItems:", JSON.stringify(filterItems))
      finalTasks = tasks.slice();
      // finalTasks = finalTasks.filter(task => task.isActive)
      // console.log("active tasks length:", finalTasks.length)

      if(filterItems && filterItems.length>0){
        let named_filters = filterItems.filter(fi => fi.type === "named_filter").map(fi =>fi.value.id)
        let assignee_filters = filterItems.filter(fi => fi.type === "assignee").map(fi =>fi.value.id)
        let label_filters = filterItems.filter(fi => fi.type === "label").map(fi =>fi.value.id)
        let task_filters = filterItems.filter(fi => fi.type === "task").map(fi =>fi.value.id)
        let keyword_filters = filterItems.filter(fi => fi.type === "keyword").map(fi => fi.value.id)
        let follower_filters = filterItems.filter(fi => fi.type === "follower").map(fi => fi.value.id.split(':')[0])

        // apply task filters
        if (task_filters && task_filters.length > 0 ) { 
          // console.log("finalTasks", finalTasks)
          let matchedTasks = []
          task_filters.map(tIdFilter => {
            let matchedTask = finalTasks.find(task => task._id === tIdFilter)
            if(matchedTask) matchedTasks.push(matchedTask)
          })
          finalTasks = (matchedTasks && matchedTasks.length>0)? matchedTasks: []
        }  

        //apply keyword filters
        if(keyword_filters && keyword_filters.length > 0 ){
          let matchedTasks = []
          keyword_filters.map(kwf => {
            let matchedTask = finalTasks.filter(task => task.name.toLowerCase().includes(kwf.toLowerCase()))
            if(matchedTask) {
              matchedTask.forEach(task => {
                matchedTasks.push(task)
              })
            }
          })

          matchedTasks = matchedTasks.filter((thing, index) => {
            const _thing = JSON.stringify(thing);
            return index === matchedTasks.findIndex(obj => {
              return JSON.stringify(obj) === _thing;
            });
          });
          
          finalTasks = matchedTasks
        }


        // console.log("after applying task filters:", finalTasks)

        // apply named filters
        if (named_filters.includes("OVER_DUE")) { //TODO:overdue date logic to be revised
          let tempOverDueArray = [];
          let finalTasksWithDate = finalTasks.filter(task => task.due_on);
          const thisDay = new Date()
          const finalDay = thisDay.setDate(thisDay.getDate() - 2)
          // console.log("1",finalTasksWithDate)
          for (let i = 0; i < finalTasksWithDate.length; i++) {
            let mydate = finalTasksWithDate[i].due_on
              .split(/T/)[0]
              .toString()
              .split("-");
            let newDate = new Date(mydate[0], mydate[1] - 1, mydate[2]);
            if (newDate < finalDay) {
              tempOverDueArray.push(finalTasksWithDate[i]);
            }
          }
          finalTasks = tempOverDueArray;
        }  
        // console.log("after applying named filters:", finalTasks.length)

        //apply assignee filters
        if((assignee_filters && assignee_filters.length>0) || named_filters.includes("unassigned")){
          let tasksWithOutUsers = finalTasks.filter(task => !task.user_id);
          let tasksWithUsers = finalTasks.filter(task => task.user_id);
          if (named_filters.includes("unassigned")) {          
            let tempWithUnassignedFinalTasks = tasksWithOutUsers;
            for (let i = 0; i < tasksWithUsers.length; i++) {
              for (let j = 0; j < assignee_filters.length; j++) {
                if (
                  tasksWithUsers[i].user_id._id ===
                  assignee_filters[j]
                ) {
                  tempWithUnassignedFinalTasks.push(tasksWithUsers[i]);
                }
              }
            }
            finalTasks = tempWithUnassignedFinalTasks;
          } else {          
            let tempfinalTasks = [];
            for (let i = 0; i < tasksWithUsers.length; i++) {
              for (let j = 0; j < assignee_filters.length; j++) {
                if (
                  tasksWithUsers[i].user_id._id ===
                  assignee_filters[j]
                ) {
                  tempfinalTasks.push(tasksWithUsers[i]);
                }
              }
            }
            finalTasks = tempfinalTasks;
          }
        }

        //apply follower filters  
        if((follower_filters && follower_filters.length>0)){
          // let tasksWithUsers = finalTasks.filter(task => task.user_id);
          let tasksWithFollowers = finalTasks.filter(task => task.followers.length > 0);  
            let tempfinalTasks = [];
            for (let i = 0; i < tasksWithFollowers.length; i++) {
              for (let j = 0; j < follower_filters.length; j++) {
            // console.log('temp',tasksWithFollowers[i].followers.filter(follower => follower._id === follower_filters[j]))
                if (
                  tasksWithFollowers[i].followers.find(follower => follower._id === follower_filters[j])
                ) {
                  tempfinalTasks.push(tasksWithFollowers[i]);
                }
              }
            }

            tempfinalTasks = tempfinalTasks.filter((thing, index) => {
              const _thing = JSON.stringify(thing);
              return index === tempfinalTasks.findIndex(obj => {
                return JSON.stringify(obj) === _thing;
              });
            });
            finalTasks = tempfinalTasks;
          
        }

        // console.log("after applying assignee filters:", finalTasks.length)

        // apply label filter
        if(label_filters && label_filters.length>0){
          let tempTagsArray = [];
          let tasksWithTags = finalTasks.filter(task => task.tag_id.length > 0);
          // console.log("tasksWithTags",tasksWithTags)
          for (
            let k = 0, taskLength = tasksWithTags.length;
            k < taskLength;
            k++
          ) {
            for (
              let i = 0, storedTagsLength = label_filters.length;
              i < storedTagsLength;
              i++
            ) {
              for (let j = 0; j < tasksWithTags[k].tag_id.length; j++) {
                if (label_filters[i] === tasksWithTags[k].tag_id[j]._id) {
                  let obj = tempTagsArray.find(ele => ele._id == tasksWithTags[k]._id)
                  if (!obj) {
                    tempTagsArray.push(tasksWithTags[k]);
                  }
                }
              }
            }
          }
          finalTasks = tempTagsArray;
        }
        // console.log("after applying label filters:", finalTasks.length)
      }
    }
    // console.log("final finalTasks tasks length:", finalTasks.length)
    return finalTasks
  }



  render() {
    const {
      isVisible,
      project,
      statuses,
      futureSprints,
      tasks,
      addStatus,
      filter,
      sprintConfig
    } = this.props;
    let wId = this.props.match.params.wId
    let pId = this.props.match.params.pId
    return (
      <div
        className={classnames("d-flex kanban-page-conatiner", {
          "hidden-xl-down": !isVisible
        })}
      >
        <div className="proj-list" /*style={{background: (localStorage.getItem('theme') == 'dark' && "rgb(34, 34, 34)")}}*/>
          {this.props.backlog &&
          <div>
            <Text type="secondary" style={{fontSize:"12px",marginLeft:"3px"}} draggable="false">Unscheduled</Text>
            <SprintSection
              updateSelectedTasks={this.props.updateSelectedInActiveTasks}
              selectedTasks={this.props.selectedInActiveTasks}
              name="Backlog (Unplanned tasks)"
              key="__backlog"
              showTagsDetails={this.state.showTagsDetails}
              toggleTags={this.toggleTags}
              showByUnassigned={this.props.showByUnassigned}
              sprint={{ _id: "__backlog", name: "Backlog (Unplanned tasks)" }}
              // id={0}
              filter={filter}
              sort={this.props.sort}
              showByTag={this.props.showByTag}              
              // index={0}
              showByAssignee={this.props.showByAssignee}
              assignee={this.props.assigneee} 
              _getFilteredTasks={this._getFilteredTasks}/></div>
          }
        </div>
        <Droppable ignoreContainerClipping={true} droppableId="project" direction="horizontal" type="section">
          {(section_provided, snapshot) => (            
              <div ref={section_provided.innerRef} className="proj-list" /*style={{background: (localStorage.getItem('theme') == 'dark' && "#222222")}}*/>              
              
              {this.props.backlog ? futureSprints &&
              futureSprints.map((sprint, index) => {
                let durationFrom=moment(sprintConfig.endAt).add(sprintConfig.duration*(index)+sprintConfig.break,'days').format("DD MMM")
                let durationTo =moment(sprintConfig.endAt).add(sprintConfig.duration*(index+1),'days').format("DD MMM")
                return (
                  <div>
                    {/* <p style={{fontSize:"11px",marginLeft:"3px"}} draggable="false">{`${durationFrom} - ${durationTo}`}</p> */}
                    <div>
                  <Text type="secondary" style={{fontSize:"12px", marginLeft:"3px"}} draggable="false">{`${durationFrom} - ${durationTo}`}</Text></div>
                  <SprintSection 
                    updateSelectedTasks={this.props.updateSelectedInActiveTasks} 
                    selectedTasks={this.props.selectedInActiveTasks} 
                    name={sprint.name} 
                    durationFrom={durationFrom}
                    durationTo={durationTo}
                    key={sprint._id} 
                    showTagsDetails={this.state.showTagsDetails} 
                    toggleTags={this.toggleTags} 
                    showByUnassigned={this.props.showByUnassigned} 
                    sprint={sprint} 
                    sprints={futureSprints} 
                    id={index+1} 
                    filter={filter} 
                    sort={this.props.sort} 
                    showByTag={this.props.showByTag} 
                    index={index+1} 
                    showByAssignee={this.props.showByAssignee} 
                    assignee={this.props.assigneee} 
                    _getFilteredTasks={this._getFilteredTasks}/>
</div>
                )
              }) : statuses.map((status, index) => {
                return (
                  <TaskSection 
                    backlog={false} 
                    updateSelectedTasks={this.props.updateSelectedActiveTasks}
                    selectedTasks={this.props.selectedActiveTasks} 
                    name={status.name} 
                    key={status._id} 
                    showTagsDetails={this.state.showTagsDetails} 
                    toggleTags={this.toggleTags} 
                    showByUnassigned={this.props.showByUnassigned} 
                    status={status} 
                    statuses={statuses} 
                    id={index} 
                    filter={filter} 
                    sort={this.props.sort} 
                    showByTag={this.props.showByTag} 
                    index={index} 
                    showByAssignee={this.props.showByAssignee} 
                    assignee={this.props.assigneee} 
                    _getFilteredTasks={this._getFilteredTasks}/>
                )
              })}
              {section_provided.placeholder}
              {this.state.formSection &&
                <div
                  className={classnames("proj-box", {
                    "hidden-xl-down": !this.state.formSection
                  })}
                >
                  <div style={{ height: "29px", width: "100%", display: "flex", alignItems: "center", padding:6 }}>
                    <Input
                      size="small"
                      // style={{ paddingLeft: 4 }}
                      type="text"
                      onBlur={e => { this.setState({ formSection: false }) }}
                      onPressEnter={e => { addStatus(wId, { name: e.target.value,project:project._id?project._id:project }); this.setState({ formSection: false }) }}
                      autoComplete="off"
                      autoFocus />
                  </div>

                </div>
              }
            </div>            
          )}
        </Droppable>

        {this.props.backlog? (!this.state.formSection) && <div className="sec-add">
          <Text onClick={()=>this.props.addSprint(wId, pId)}>+ Add new Sprint</Text>
        </div>: (!this.state.formSection) && <div className="sec-add">
          <Text onClick={this.toggleFormSection}>+ Add new Status</Text>
        </div>
        }
     {this.props.sidebar=="task"?<div><div style={{width:'420px'}}></div></div>:null}

      </div>


    );
  }
}

KanbanPage.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  project: PropTypes.string,
  statuses: PropTypes.array.isRequired,
  setStatuses: PropTypes.func.isRequired,
  addStatus: PropTypes.func.isRequired,
  updateStatus: PropTypes.func.isRequired,
  // filter: PropTypes.string.isRequired,
};
function mapStateToProps(state) {
  // console.log(state.projects)
  // state.projects.project._id && console.log(state.projects.project._id)
  let propsObj = {
    statuses: state.statuses,
    futureSprints: state.sprints.futureSprints,
    currentSprint: state.sprints.currentSprint,
    sprintConfig: state.sprints.sprintConfig,
    project: (Object.keys(state.projects.project).length === 0) ? "" : state.projects.project._id
  }
  // console.log(propsObj)
  return propsObj
}

export default withRouter(connect(mapStateToProps, { addSprint, setSidebar, setTasks, setStatuses, updateTaskPosition, addStatus, updateStatus })(KanbanPage));