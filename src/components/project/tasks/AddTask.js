import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import {
  addTask,
  //scrollForTaskItem 
} from './task/taskActions';
import { withRouter } from "react-router-dom"
import { Input, message, notification } from "antd"


class AddTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: localStorage.getItem(`${this.props.id}_temp_task`) !== null ? localStorage.getItem(`${this.props.id}_temp_task`) : '',
    }

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  onChange(e) {
    localStorage.setItem(`${this.props.id}_temp_task`, e.target.value);
    this.setState({ [e.target.name]: e.target.value });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isVisible !== this.props.isVisible) {
      this.setState({ name: localStorage.getItem(`${this.props.id}_temp_task`) !== null ? localStorage.getItem(`${this.props.id}_temp_task`) : '' });
    }
  }

  onSubmit(e) {

    // console.log("create task",this.props)
    localStorage.removeItem(`${this.props.id}_temp_task`);
    const { id, addTask, backlog } = this.props;
    e.preventDefault();
    if (this.state.name) {
      this.setState({ name: '' });
      let taskObj = {
        name: this.state.name,
        // status: id,
        project_id: this.props.pId,
        isActive: !backlog
      }
      if (backlog) {
        taskObj.sprint = (id!=="__backlog")?id:null
      } else {
        taskObj.status = id
      }
      addTask(this.props.wId, taskObj, this.props.backlog).then((response) => {
        if (response.data.success) {
          // this.props.scrollForTaskItem(response.data.task._id);
          //TODO: add listener to this new channel
          // console.log("IS THIS FILTERED OUT?",this.props.checkFilterable([response.data.task]))
          let whenFiltered = this.props.checkFilterable([response.data.task])
          if (!whenFiltered || whenFiltered.length===0){
            // message.success(`Task ${response.data.task.key} created successfully but not visible in this filtered view. Clear Filter(s) to see tasks`)
            notification.success({
              message: `Task ${response.data.task.key} created successfully`,
              description: `Task NOT visible in this filtered view. Clear Filters to see all tasks for this view`,
            });
          }
        } else {
          message.error("Error creating task! " + response.data.errors)
        }
      });
    }
  }

  onClose() {
    const { isVisible, toggle } = this.props;
    if (!isVisible) {
      this.setState({ name: localStorage.getItem(`${this.props.id}_temp_task`) !== null ? localStorage.getItem(`${this.props.id}_temp_task`) : '' });
      toggle();
    }
  }

  render() {
    const { name } = this.state;
    const { isVisible } = this.props;
    return (
      <form onSubmit={this.onSubmit} className={classnames('cancel', { 'hidden-xl-down': isVisible })}>
        <div className="task-form">
          <Input
            type="text"
            onChange={this.onChange}
            onBlur={this.onClose}
            value={name}
            name="name"
            className="task_add_input"
            placeholder="Enter your new task here"
            autoFocus
            autoComplete="off" />
        </div>
      </form>
    );
  }
}

AddTask.propTypes = {
  id: PropTypes.string,
  addTask: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
  return {
  }
}

export default withRouter(connect(mapStateToProps, { addTask })(AddTask))