// import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import axios from 'axios'
// import moment from 'moment';
// import { withRouter} from 'react-router-dom';
// // import options from '../../../media/options_icon.png';
// // import download_icon from '../../../media/download_icon.png';
// // import delete_icon from '../../../media/delete_icon.png';
// // import MessageItem from '../../common/MessageItem';
// import { setSidebar,sendMessage } from '../sidebarActions';
// import { getMembers } from '../../project/picker/projectMembers/projectMembershipActions';
// import { deleteFile} from '../../project/files/filedAction';
// import file_text from '../../../../media/file_text.png';
// import image_icon from '../../../../media/image_icon.png';
// import zip_icon from '../../../../media/zip_icon.png';
// import video_icon from '../../../../media/video_icon.png';
// import audio_icon from '../../../../media/audio_icon.png'
// import undefined_icon from '../../../../media/undefined_icon.png'
// // import folder_icon from '../../../media/folder.png';
// import pdf_icon from '../../../media/files_icon.png';




// // function ChangeDate({date_created}){

// //  var m1 = moment(date_created);
// //  var m2 = moment(new Date());
// //  var time = moment.duration(m1.diff(m2)).humanize();
// //  return(time+' ago')

// // };
// function Icon({type}){
// var typeArr=[];
  
//   typeArr=type.split('/')
  

//  if(typeArr[0]==="text"){
//   return(<img src={file_text} className="sidebar-files-icon" alt="txtfile"/>)
// }else if(typeArr[0]==="image"){
//  return(<img src={image_icon} className="sidebar-files-icon" alt="img"/>);
// }else if(typeArr[0]==="video"){
//  return(<img src={video_icon} className="sidebar-files-icon" alt="img"/>);
// }else if(typeArr[0]==="application" && typeArr[1]==="pdf"){
//  return(<img src={pdf_icon} className="sidebar-files-icon" alt="img"/>);
// }else if(typeArr[0]==="application" && typeArr[1]==="zip"){
//  return(<img src={zip_icon} className="sidebar-files-icon" alt="img"/>);
// }else if(typeArr[0]==="audio"){
//  return(<img src={audio_icon} className="sidebar-files-icon" alt="img"/>);
// }else{
//  return(<img src={undefined_icon} className="sidebar-files-icon" alt="img"/>);
// }
// }


// class FileSidebar extends Component {
//  constructor(props) {
//     super(props);
            
        
//     this.state={
//           url:'',
//           errors:'',
//           message: '',
//      }
//     this.openFile=this.openFile.bind(this);   
      
//     this.onSubmit = this.onSubmit.bind(this);
//     this.scrollToBottom = this.scrollToBottom.bind(this);
//     this.onChange = this.onChange.bind(this);
//     this.deleteFile = this.deleteFile.bind(this);
    
//     this.closeSidebar=this.closeSidebar.bind(this);

    
// }

//   scrollToBottom = () => {
//     if (this.messagesEnd)
//       this.messagesEnd.scrollIntoView({ behavior: "smooth" });
//   }

// openFile(){

// var id=this.props.file._id;

// axios.get('/api/files/'+id+'/content').then(res => {
      
//       if (res.data.success) {
//        var url=res.data.files;
//      window.location.href=url
//      }else{
//  this.setState({errors:res.data.errors})
//      }
//       });
//   }

//  ChatSidebar() {
//     const { setSidebar } = this.props;
//     setSidebar("fileChat");
//   }

//  closeSidebar(){

//      const {setSidebar} = this.props;    
//         setSidebar(""); 

//    }    

//    deleteFile(){ 
//    this.props.deleteFile(this.props.file._id).then(res => {
//       if (res.data.success) {
//        this.props.setSidebar('');

//      }else{

//      this.setState({errors:res.data.errors})
//      }
//       });
   
//   }
//  onChange(e) {
//     this.setState({ [e.target.name]: e.target.value });
//   }
//   onSubmit(e) {
//     const { channels,file, sendMessage } = this.props;
//     e.preventDefault();
//     const { message } = this.state;
//     this.setState({ message: '' });
//     var data = {
//      channel: channels[file.project_id].sid,
//       message: message,
//       file: file
//     };
    
//        sendMessage(data);   
//   }
// componentWillMount() {
//     const { getMembers,file } = this.props;
//     getMembers(file.project_id);
//   }
//   componentDidMount() {

//     this.scrollToBottom();
//   }

//   componentDidUpdate(prevProps,prevState) {
//     this.scrollToBottom();
//   }

  
  

//   render() {
//    const { file,messages,members, setShow,currentUser} = this.props;
//    const {errors,message } = this.state;

//     return (
//       <div className=" h100 d-flex flex-column">
//         <div className="task-title d-flex bg_color align-items-center justify-content-between">
//           <div className="d-flex justify-content-start">
//             <h5>File details and Chat</h5>
//           </div>
//           <div className="d-flex justify-content-end">
//           <i className="fas fa-times" aria-hidden="true" onClick={this.closeSidebar}></i> 
//           </div>
//         </div>
       
//         <div className=" file--info--box">
//         <div className=" file--info d-flex align-items-center justify-content-between">
//             <div className="d-flex align-items-center">
//                   <div className="file--info--icon  d-flex align-items-center justify-content-center ">

//                     <Icon type={file.mime_type}/>

//                   </div>
        
//                 <div className=" file--info--desc">
//                     <div className=" file--name"> {file.name}</div>
//                 </div>
//                 </div>
//               <div className="d-flex justify-content-end">
//               <div className="delete--File" onClick={this.openFile}>
//               <i className="fa fa-arrow-circle-down" aria-hidden="true"></i>
//               </div>
//               <div onClick={this.deleteFile}><i class="fa fa-trash" aria-hidden="true"></i></div>
//           </div>
//           </div>
//            {errors && <div className="project--files--err">{errors}</div>}
//            <hr className="file-details-hr"/>

//           <div className="file-details">
//           <p className="file-details-item">Owner<span className="file-owner file-details-item-value">
//                 {file.owner_name}</span>
//             </p>
//             <p className="file-details-item">File type<span className="file-type file-details-item-value">{file.mime_type}
//                 </span>
//              </p>
//              <p className="file-details-item">File size<span className="file-size file-details-item-value">{(file.size/1024).toFixed(2)}kB
//                 </span>
//              </p>
//           </div>
//           <hr className="file-details-hr"/>
//           <div className="file-details">
//               <p className="file-details-item">Created On<span className="file-created-at file-details-item-value">
//                 {moment(file.created_at).format("MMM Do YY")}</span>
//              </p>
//               </div>   
//            </div>



//       </div>
//     );
//   }
// }

// FileSidebar.propTypes = {
//   setShow: PropTypes.func.isRequired,
//   members: PropTypes.array.isRequired,
//   file:PropTypes.object.isRequired,
//   sendMessage: PropTypes.func.isRequired,
//   messages: PropTypes.object.isRequired,
//   channels: PropTypes.object.isRequired,
//   getMembers: PropTypes.func.isRequired,
  
// }

// function mapStateToProps (state) {
//   return {
//     members: state.projectMembership.members,
//     file:state.files.file,
//     sidebar: state.sidebar.sidebar,
//     channels: state.sidebar.channels,
//     messages: state.sidebar.messages,
//     currentUser: state.common_reducer.user,
//   };
// }



// export default  withRouter(connect(mapStateToProps,{ setSidebar,sendMessage,getMembers,deleteFile })(FileSidebar));