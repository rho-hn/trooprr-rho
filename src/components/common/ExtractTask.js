import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { getStatuses } from '../projectsidebar/sidebarActions';
import { addTask } from '../project/tasks/task/taskActions';
import chat from '../../media/chat_extraction.svg';

class ExtractTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      project: this.props.projects.length > 0 ? this.props.projects[0] : '',
      section: '',
      sections: []
    }

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.updateSections = this.updateSections.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    if (e.target.name === 'project') {
      this.updateSections(e.target.value);
    }
  }

  onSubmit(e) {
    const { section } = this.state;
    const { addTask, toggle, name } = this.props;
    if (section) {
      addTask(this.props.match.params.wId, {name: name,status:section}).then((response) => {
        if (response.data.success) {
          toggle();
        }
      });
    }
  }

  updateSections(id) {
    const { getStatuses } = this.props;
    if (id) {
      getStatuses(this.props.match.params.wId,id).then(res => {
        if (res.data.success) {
          this.setState({ sections: res.data.sections });
          if (res.data.sections.length > 0)
            this.setState({ section: res.data.sections[0]._id });
        }
      });
    }
  }

  componentWillMount() {
    this.updateSections(this.state.project._id);
  }

  render() {
    const { isOpen, toggle, projects } = this.props;
    const { sections } = this.state;

    return (
      <Modal isOpen={isOpen} toggle={toggle} className="task-modal">
        <ModalHeader toggle={toggle}><img src={chat} alt=''/>Add to Task</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>Project</Label>
            <Input type="select" name="project" onChange={this.onChange}>
              {projects.map((proj, idx) => (<option key={idx} value={proj._id}>{proj.name}</option>))}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label>Section</Label>
            <Input type="select" name="section" onChange={this.onChange}>
              {sections.map((sec, idx) => (<option key={idx} value={sec._id}>{sec.name}</option>))}
            </Input>
          </FormGroup>
        </ModalBody>
        <ModalFooter className="flex-1">
          <div className="d-flex flex-column">
            <Button color="primary" onClick={this.onSubmit}>Add to Task</Button>
            <span onClick={toggle}>Cancel</span>
          </div>
        </ModalFooter>
      </Modal> 
    );
  }
}

ExtractTask.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  getStatuses: PropTypes.func.isRequired,
  addTask: PropTypes.func.isRequired,
  projects: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired
}

function mapStateToProps(state) {
  return {
    projects: state.projects.projects
  };
}

export default withRouter(connect(mapStateToProps, { getStatuses, addTask })(ExtractTask));
