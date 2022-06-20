import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';

import InviteItem from '../../common/InviteItem';
import oval from '../../../images/oval.jpg';
import { addMember } from './projectMembershipActions';

class AddMember extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            name: '',
            suggestions: [],
            invites: [],
            error: ''
        }

        this.onChange = this.onChange.bind(this);
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
        this.getSuggestionValue = this.getSuggestionValue.bind(this);
        this.renderSuggestion = this.renderSuggestion.bind(this);
        this.removeInvite = this.removeInvite.bind(this);
        
    }

    escapeRegexCharacters(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    getSuggestions(value) {
        const escapedValue = this.escapeRegexCharacters(value.trim());
        if (escapedValue === '') {
            return [];
        }
        const regex = new RegExp('\\b' + escapedValue, 'i');
        var suggestions = this.props.members.filter(member => regex.test(member.user_id.displayName||member.user_id.name));
        suggestions = suggestions.filter(member => this.state.invites.indexOf(member) < 0);
        
        return suggestions;
    }

    onChange(e, { newValue, method }) {
        if (method === 'click') {
            this.setState({ name: '', invites: [...this.state.invites, newValue] });
        } else
            this.setState({ name: e.target.value });
    }

    onSuggestionsFetchRequested({ value }) {
        this.setState({
            suggestions: this.getSuggestions(value)
        });
    }

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    }

    getSuggestionValue(suggestion) {
        return suggestion;
    }

    renderSuggestion(suggestion, { query }) {
        return (
            <div className="d-flex suggestion-content">
                <img className="profilepic_myspace" src={suggestion.user_id.profilePicUrl} alt="profile"/>
                <div className="member-info">
                    <h5>{suggestion.user_id.displayName||suggestion.user_id.name}</h5>
                    <span>{suggestion.user_id.email}</span>
                </div>
            </div>
        );
    }

    removeInvite(index) {
        const invites = this.state.invites.slice();
        invites.splice(index, 1);
        this.setState({ invites: invites });
    }

    invitemember(e) {
        this.setState({ error: '' });
        const { invites } = this.state;
        const { project, addMember, chatClient } = this.props;
        if (invites.length > 0) {
            chatClient.getChannelByUniqueName(project._id.toString()).then(channel => {
                if (channel) {
                    invites.map((invite) => channel.add(invite.user_id._id.toString()));
                }
            });
            Promise.all(invites.map((invite) => addMember(project._id, invite.user_id.email))).then(() => {
                this.props.history.push('/project/'+this.state.id+'/members');
            });
        } else 
            this.setState({ error: 'Include at least one member!' });
    }

	render() {
        const { project } = this.props;
        const { id, name, suggestions, invites, error } = this.state;
        const link = '/project/'+id+'/members';
        const inputProps = {
            value: name,
            onChange: this.onChange,
            className: "form-control"
        };

    	return (
    		<div className="members d-flex justify-content-center">
                <div className="d-flex flex-column">
        			<div className="title d-flex justify-content-center">
                        <h3>Add members to {project.name}</h3>
                    </div>
                    <div className="form">
                        <div className={classnames('form-group', { 'has-danger': error })}>
                            <label className="form-control-label">Name</label>
                            
                            {error && <span className="form-control-feedback">{error}</span>}
                        </div>
                        <div className="d-flex flex-wrap">
                            {invites.map((invite, index) => (
                                <InviteItem key={index} email={invite.user_id.displayName||invite.user_id.name} onClick={() => this.removeInvite(index)}/>
                            ))}
                        </div>
                        <button className="btn btn-primary" onClick={this.onSubmit}>Add Members</button>
                    </div>
                    <div className="back d-flex justify-content-center">
                        <Link to={link}>Go Back</Link>
                    </div>
                </div>
      		</div>
    	);
  	}
}

AddMember.propTypes = {
    match: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    members: PropTypes.array.isRequired,
    projectMembers: PropTypes.array.isRequired,
    addMember: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        project: state.projects.project,
        members: state.common_reducerMembership.members,
        projectMembers: state.projectMembership,
        chatClient: state.sidebar.chatClient
    };
}

export default withRouter(connect(mapStateToProps, { addMember })(AddMember));