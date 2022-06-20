import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import classnames from 'classnames';
import { setSidebar } from '../sidebarActions';
import { getMembers } from '../../projectMembers/projectMembershipActions';

import options from '../../../../media/options.svg';

class ProjectSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: ''
    }

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.showChatList = this.showChatList.bind(this);
     this.closeSidebar=this.closeSidebar.bind(this);
  }
  closeSidebar(){

     const {setSidebar} = this.props;    
        setSidebar(""); 

   }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    const { project, channels } = this.props;
    e.preventDefault();
    const { message } = this.state;
    this.setState({ message: '' });
    channels[project._id].sendMessage(message);
  }

  scrollToBottom = () => {
    if (this.messagesEnd)
      this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  showChatList() {
    const { setSidebar } = this.props;
    setSidebar("chat");
  }

  componentWillMount() {
    const { project, getMembers } = this.props;
    getMembers(project._id,this.props.match.params.wId);
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

	render() {
    const { project, members, messages, setShow ,user_now} = this.props;
    const { message } = this.state;

  	return (
  		<div className="h100 d-flex flex-column">
 			  <div className="chat-title d-flex align-items-center justify-content-between">
          <div className="d-flex justify-content-start">
            <h5>Chats and Discussion</h5>
          </div>
          <div className="d-flex justify-content-end">
          <i className="fas fa-times" aria-hidden="true" onClick={this.closeSidebar}></i> 
          </div>
        </div>
        <div className="d-flex align-items-center chat_project_info justify-content-between">
          <div className=" d-flex align-items-center">
            <i className="fa fa-chevron-left pointer mr-2 chat_list_btn" aria-hidden="true" onClick={this.showChatList}></i> 
          
          <div className={classnames('project_chat_pic d-flex align-items-center justify-content-center', [project.color])}>
            <i className={classnames('project_chat_icon', [project.icon])} aria-hidden="true"></i>
        </div>

        <div className="project_chat_name">
            {project.name}
          
          </div>
          </div>
          <img src={options} alt=""/>
      </div>
          
      
        <form className="chat-box" onSubmit={this.onSubmit}>
          <input type="text" placeholder="start typing..." onChange={this.onChange} name="message" value={message} disabled={!messages[project._id]} autoComplete="off" />
        </form>
  		</div>
  	);
  }
}

ProjectSidebar.propTypes = {
  setShow: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  members: PropTypes.array.isRequired,
  channels: PropTypes.object.isRequired,
  messages: PropTypes.object.isRequired,
  getMembers: PropTypes.func.isRequired,
  setSidebar: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    project: state.projects.project,
    members: state.projectMembership.members,
    channels: state.sidebar.channels,
    messages: state.sidebar.messages,
     user_now: state.common_reducer.user,
  }
}

export default withRouter(connect(mapStateToProps, { getMembers, setSidebar })(ProjectSidebar));