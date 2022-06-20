import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import { updateTask } from "./task/taskActions.js";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { setSidebar } from "../../project/sidebar/sidebarActions.js";

class ArchiveTaskItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false
    };
    this.toggle = this.toggle.bind(this);
    this.restoreTask = this.restoreTask.bind(this);
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  restoreTask(task) {
    task.availability = "active";
    const val = "availability";
    this.props.updateTask(this.props.match.params.wId,task, val).then(res => {
      if (res.data.success) {
        this.setState({
          dropdownOpen: false
        });
      }
    });
  }

  render() {
    const { task } = this.props;
    return (
      <div className="d-flex justify-content-between align-items-center archive-task-item">
        <div className="archive-task-name">{task.name}</div>
        <div onClick={this.toggle}>
          <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
            <DropdownToggle>
              <i class="fas fa-ellipsis-v archive-task-item-option" />
            </DropdownToggle>
            <DropdownMenu right className="restore-hover">
              <DropdownItem disabled >
                <div onClick={() => this.restoreTask(task)} >
                  <i class="fa fa-history" aria-hidden="true" />
                  {"  "}Restore
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    );
  }
}

export default withRouter(connect(
  null,
  { updateTask, setSidebar }
)(ArchiveTaskItem))
