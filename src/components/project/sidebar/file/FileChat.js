// import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import axios from 'axios'
// import moment from 'moment';
// import { withRouter } from 'react-router-dom';
// import MessageItem from '../../common/MessageItem';
// import { setSidebar, sendMessage } from '../sidebarActions';
// import { getMembers } from '../../project/picker/projectMembers/projectMembershipActions';





// class FileChat extends Component {

//   constructor(props) {
//     super(props);
//     this.state = {
//       message: '',
//       errors: ''
//     }


//     this.onSubmit = this.onSubmit.bind(this);
//     this.scrollToBottom = this.scrollToBottom.bind(this);
//     this.showChatList = this.showChatList.bind(this);
//     this.onChange = this.onChange.bind(this);
//     this.closeSidebar = this.closeSidebar.bind(this);
//     this.fileSidebar = this.fileSidebar.bind(this);


//   }


//   scrollToBottom = () => {
//     if (this.messagesEnd)
//       this.messagesEnd.scrollIntoView({ behavior: "smooth" });
//   }

//   closeSidebar() {
//     const { setSidebar } = this.props;
//     setSidebar("");
//   }

//   onChange(e) {
//     this.setState({ [e.target.name]: e.target.value });
//   }

//   onSubmit(e) {
//     const { channels, file, sendMessage } = this.props;
//     e.preventDefault();
//     const { message } = this.state;
//     this.setState({ message: '' });
//     var data = {
//       channel: channels[file.project_id].sid,
//       message: message,
//       file: file
//     };
//     sendMessage(data);
//   }

//   showChatList() {
//     const { setSidebar } = this.props;
//     setSidebar("chat");
//   }

//   fileSidebar() {
//     const { setSidebar } = this.props;
//     setSidebar("file");
//   }



//   componentWillMount() {
//     const { getMembers, file } = this.props;
//     getMembers(file.project_id);
//   }


//   componentDidMount() {
//     this.scrollToBottom();
//   }

//   componentDidUpdate(prevProps, prevState) {
//     this.scrollToBottom();
//   }


//   render() {
//     const { file, messages, members, setShow, currentUser } = this.props;
//     const { errors, message } = this.state;


//     return (
//       <div className=" h100 d-flex flex-column">
//         <div className="task-title d-flex bg_color align-items-center justify-content-between">
//           <div className="d-flex justify-content-start">
//             <i
//               className="fa fa-arrow-left back_arrow"
//               aria-hidden="true"
//               onClick={this.showChatList}
//             />
//             <h5 onClick={this.fileSidebar}>File details > Chat</h5>
//           </div>
//           <div className="d-flex justify-content-end">
//             <i className="fas fa-times" aria-hidden="true" onClick={this.closeSidebar}></i>
//           </div>
//         </div>

//         {messages[file.project_id] && members.length > 0 ? <div className="chat-list">
//           <div className="chat-container">
//             <div className="d-flex flex-column justify-content-end">
//               {members.length > 0 && messages[file.project_id].filter(msg => msg.attributes.file_id === file._id).map(msg => (
//                 <MessageItem key={msg.sid} user={
//                   members.find(m => m.user_id._id === msg.author)
//                     ? members.find(m => m.user_id._id === msg.author)
//                       .user_id.name === currentUser.name
//                       ? "You"
//                       : members.find(m => m.user_id._id === msg.author)
//                         .user_id.name
//                     : "User"
//                 }
//                   message={msg.body}
//                   date={
//                     moment
//                       .duration(
//                         moment(msg.dateUpdated).diff(moment(new Date()))
//                       )
//                       .humanize() + " ago"
//                   }
//                   setShow={setShow}
//                 />
//               ))}
//             </div>
//             <div className="chat-bottom" ref={el => this.messagesEnd = el}></div>
//           </div>
//         </div> :
//           <div className="chat-list d-flex">
//             <div className="loader-container d-flex flex-column justify-content-center">
//               <div className="d-flex flex-row justify-content-center">
//                 <div className="loader"></div>
//               </div>
//             </div>
//           </div>}
//         <form className="chat-box" onSubmit={this.onSubmit}>
//           <input type="text" placeholder="start typing..." onChange={this.onChange} name="message" value={message} disabled={!messages[file.project_id]} autoComplete="off" />
//         </form>

//       </div>
//     )
//   }

// }



// FileChat.propTypes = {
//   setShow: PropTypes.func.isRequired,
//   members: PropTypes.array.isRequired,
//   file: PropTypes.object.isRequired,
//   sendMessage: PropTypes.func.isRequired,
//   messages: PropTypes.object.isRequired,
//   channels: PropTypes.object.isRequired,
//   getMembers: PropTypes.func.isRequired,
// }



// function mapStateToProps(state) {
//   return {
//     members: state.projectMembership.members,
//     file: state.files.file,
//     sidebar: state.sidebar.sidebar,
//     channels: state.sidebar.channels,
//     messages: state.sidebar.messages,
//     currentUser: state.common_reducer.user,
//   };
// }


// export default withRouter(connect(mapStateToProps, { setSidebar, sendMessage, getMembers })(FileChat));