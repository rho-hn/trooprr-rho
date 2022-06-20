import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import invite from '../../../images/invite.svg';
import MemberItem from './MemberItem';
import { deleteMember } from './projectMembershipActions';

class ProjectMembers extends Component {
	constructor(props) {
		super(props);
        this.state = {
            id: this.props.match.params.id
        };

		this.onClick = this.onClick.bind(this);
	}

	onClick(id) {
		this.props.deleteMember(id,this.props.match.params.wId);
	}

	render() {
        const { members } = this.props;
        const link = "/project/" + this.state.id + "/members/invite";

    	return (
    		<div className="members d-flex flex-column">
    			<div className="d-flex flex-1 title">
    				<div className="d-flex justify-content-start">
    					<h3>Project Members</h3>
    				</div>
    				<div className="d-flex justify-content-end">
    					<button className="btn btn-primary middle-align">
                            <Link to={link}>
    						  <img src={invite} alt=""/>
    						  <span>Add members</span>
                            </Link>
    					</button>
    				</div>
    			</div>
    			<div className="d-flex flex-wrap">
                    {members.map((member, index) => (
                        <MemberItem key={index} name={member.user_id.displayName||member.user_id.name} email={member.user_id.email} onClick={() => this.onClick(member._id)}/>
                    ))}
    			</div>
      		</div>
    	);
  	}
}

ProjectMembers.propTypes = {
    match: PropTypes.object.isRequired,
    members: PropTypes.array.isRequired,
    deleteMember: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    return {
        members: state.projectMembership
    };
}

export default connect(mapStateToProps, { deleteMember })(ProjectMembers);
