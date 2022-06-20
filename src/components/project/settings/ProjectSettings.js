import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';
import { withRouter } from 'react-router-dom';

import TabTitle from '../../common/TabTitle';
import TextFieldGroup from '../../common/TextFieldGroup';
import { updateProject, deleteProject } from '../projectActions';

class ProjectSettings extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: this.props.project.name,
			description: this.props.project.description,
			errors: {},
		}

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.deleteProject = this.deleteProject.bind(this);
	}

	isValid(data) {
		var errors = {};

		if (Validator.isEmpty(data.name)) {
		    errors.name = 'This field is required';
	  	}
    	this.setState({ errors: errors });

    	return isEmpty(errors);
  	}

	onChange(e) {
    	this.setState({ [e.target.name]: e.target.value });
  	}

  	onSubmit(e) {
  		this.setState({ errors: {} });
	    e.preventDefault();
	    if (this.isValid(this.state)) {
	    	const { project, updateProject } = this.props;
		    updateProject(project._id, this.state,this.props.match.params.wId).then((response) => {
		    	if (response.data.success) {
		    		this.props.history.push('/project/'+project._id+'/settings');
		    	} else {
		    		this.setState({ errors: response.data.errors });
		    	}
		    });
		}
  	}

  	deleteProject() {
  		const { project, deleteProject } = this.props;
	    deleteProject(project._id, this.props.match.params.wId,this.state).then((response) => {
	    	if (response.data.success) {
	    		this.props.history.push('/projects');
	    	} else {
	    		this.setState({ errors: response.data.errors });
	    	}
	    });
  	}

  	render() {
  		const { errors } = this.state;
	    
	    return (
	    	<div>
	    		<TabTitle name={"Settings"} />
	    		<form className="settings b-bottom" onSubmit={this.onSubmit}>
			      	<TextFieldGroup error={errors.name} label="Name" onChange={this.onChange} value={this.state.name} field="name"/>
			      	<TextFieldGroup error={errors.description} label="Description" onChange={this.onChange} value={this.state.description} field="description"/>
			      	<button className="btn btn-primary">Update</button>
	    		</form>
	    		<div className="settings">
			    	<button className="btn btn-danger" onClick={this.deleteProject}>Exit Project</button>
			    </div>
	      	</div>
	    );
  	}
}

ProjectSettings.propTypes = {
	project: PropTypes.object.isRequired,
	updateProject: PropTypes.func.isRequired,
	deleteProject: PropTypes.func.isRequired,
	history: PropTypes.object.isRequired
}

function mapStateToProps(state) {
	return {
		project: state.projects.project
	};
}

export default withRouter(connect(mapStateToProps, { updateProject, deleteProject })(ProjectSettings));	