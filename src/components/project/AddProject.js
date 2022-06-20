import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';
import { FormGroup, Label, Input } from 'reactstrap';

import TextFieldGroup from '../common/TextFieldGroup';
import { getWorkspaces } from '../workspace/workspaceActions';
import { addProject } from './projectActions.js';
import { addMember } from'../projectMembers/projectMembershipActions';
import InviteItem from '../common/InviteItem';
import image from '../../media/image.svg';

const ImageBox = () => {
    return (
        <div className="d-flex align-items-center">
            <div className="d-flex flex-column">
                <img src={image} alt="" />
                <span>Click to add project photo</span>
            </div>
        </div>  
    );
}

class AddProject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            image: '',
            imagePreviewUrl: '',
            workspace: this.props.match.params.wid,
            name: '',
            description: '',
            email: '',
            emails: [],
            errors: {}
        }

        this.setImage = this.setImage.bind(this);
        this.onChange = this.onChange.bind(this);
        this.addEmail = this.addEmail.bind(this);
        this.removeEmail = this.removeEmail.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    isValid(data) {
        var errors = {};

        if (Validator.isEmpty(data.email)) {
            errors.email = 'This field is required';
        } else if (!Validator.isEmail(data.email)) {
            errors.email = 'Email is invalid';
        }
        this.setState({ errors: errors });

        return isEmpty(errors);
    }

    checkData(data) {
        var errors = {};

        if (Validator.isEmpty(data.name)) {
            errors.name = 'This field is required';
        } 
        this.setState({ errors: errors });

        return isEmpty(errors);
    }

    setImage(e) {
        e.preventDefault();
        var reader = new FileReader();
        var file = e.target.files[0];

        reader.onloadend = () => {
          this.setState({
            image: file,
            imagePreviewUrl: reader.result
          });
        }
        
        if (file && file.type.match('image.*')) {
            reader.readAsDataURL(file);
        }
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    addEmail(e) {
        e.preventDefault();
        const { email, emails } = this.state;
        if (this.isValid(this.state)) {
            if (emails.indexOf(email) === -1)
                this.setState({ emails: [...emails, email], email: "" });
        }
    }

    removeEmail(index) {
        const emails = this.state.emails.slice();
        emails.splice(index, 1);
        this.setState({ emails: emails });
    }

    onSubmit() {
        this.setState({ errors: {} });
        const { chatClient, addProject, addMember } = this.props;
        if (this.checkData(this.state)) {
            var { workspace, name, description, emails } = this.state;
            var data = {
                name: name,
                description: description
            };
            if (!workspace && this.props.workspaces.length > 0) {
                workspace = this.props.workspaces[0]._id;
            }
            addProject(workspace, data).then((response) => {
                if (response.data.success) {
                    chatClient.createChannel({ uniqueName: response.data.project._id.toString() }).then(channel => channel.join());
                    Promise.all(emails.map((email) => addMember(response.data.project._id, email))).then(() => {
                        this.props.history.push('/project/'+response.data.project._id);
                    });
                } else {
                    this.setState({ errors: response.data.errors });
                }
            });
        }
    }

    componentWillMount() {
        const { getWorkspaces } = this.props;
        getWorkspaces();
    }

    render() {
        const { id, imagePreviewUrl, workspace, name, description, email, emails, errors } = this.state;
        const { workspaces } = this.props;
        var link = "";
        if (id) {
            link += ("/project/" + id);
        }
        link += "/projects";

        return (
            <div className="members d-flex justify-content-center">
                <div className="d-flex flex-column">
                    <div className="title d-flex justify-content-center">
                        <h3>Add New Project</h3>
                    </div>
                    <div className="form">
                        <div className="image-container d-flex justify-content-center">
                            <input type="file" name="pic" accept="image/*" onChange={this.setImage}/>
                            {imagePreviewUrl ? <img src={imagePreviewUrl} alt="" className="project-img"/> : <ImageBox />}
                        </div>
                        <FormGroup>
                          <Label for="exampleSelect">Workspace</Label>
                          <Input type="select" name="workspace" id="exampleSelect" onChange={this.onChange} value={workspace}>
                            {workspaces.map((workspace,index) => <option key={index} value={workspace._id}>{workspace.name}</option>)}
                          </Input>
                        </FormGroup>
                        <TextFieldGroup error={errors.name} label="Name of the Project" onChange={this.onChange} value={name} field="name"/>
                        <TextFieldGroup error={errors.description} label="Project description" onChange={this.onChange} value={description} field="description"/>
                        <form onSubmit={this.addEmail}>
                            <TextFieldGroup error={errors.email} label="Invite members" onChange={this.onChange} value={email} field="email"/>
                        </form>
                        <div className="d-flex flex-wrap">
                            {emails.map((email, index) => (
                                <InviteItem key={index} email={email} onClick={() => this.removeEmail(index)}/>
                            ))}
                        </div>
                        <button className="btn btn-primary" onClick={this.onSubmit}>Create Project</button>
                        <div className="cancel d-flex justify-content-center">
                            <Link to={link}>Cancel</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

AddProject.propTypes = {
    workspaces: PropTypes.array.isRequired,
    getWorkspaces: PropTypes.func.isRequired,
    addProject: PropTypes.func.isRequired,
    addMember: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
}

function mapStateToProps(state) {

    return {
        workspaces: state.common_reducer.workspaces,
        chatClient: state.sidebar.chatClient
    };
}

export default withRouter(connect(mapStateToProps, { getWorkspaces, addProject, addMember })(AddProject));