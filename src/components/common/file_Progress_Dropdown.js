// import React from 'react';
// import { Progress } from 'reactstrap';
// import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
// import { connect } from 'react-redux';
// import uploader from '../../media/uploader.svg';

// import pdf_icon from '../../media/files_icon.png';
// import file_text from '../../media/file_text.png';
// import image_icon from '../../media/image_icon.png';
// import zip_icon from '../../media/zip_icon.png';
// import { clearProgress} from '../project/files/filedAction.js'
// import video_icon from '../../media/video_icon.png';
// import audio_icon from '../../media/audio_icon.png'
// import undefined_icon from '../../media/undefined_icon.png'


// function Name({name,isDir,type}){
//   var typeArr=[];
//     if (type===undefined){
//     typeArr=[];
  
//     }else{
//     typeArr=type.split('/')}
    
  
//   if(typeArr[0]==="text"){
//     return(<div className="tabletext"><img src={file_text} className="files-icon" alt="txtfile"/>{name}</div>)
//   }else if(typeArr[0]==="image"){
//    return(<div className="tabletext"><img src={image_icon} className="files-icon" alt="img"/>{name}</div>);
//   }else if(typeArr[0]==="video"){
//    return(<div className="tabletext"><img src={video_icon} className="files-icon" alt="img"/>{name}</div>);
//   }else if(typeArr[0]==="application" && typeArr[1]==="pdf"){
//    return(<div className="tabletext"><img src={pdf_icon} className="files-icon" alt="img"/>{name}</div>);
//   }else if(typeArr[0]==="application" && typeArr[1]==="zip"){
//    return(<div className="tabletext"><img src={zip_icon} className="files-icon" alt="img"/>{name}</div>);
//   }else if(typeArr[0]==="audio"){
//    return(<div className="tabletext"><img src={audio_icon} className="files-icon" alt="img"/>{name}</div>);
//   }else{
//    return(<div className="tabletext"><img src={undefined_icon} className="files-icon" alt="img"/>{name}</div>);
//   }
//   }

// class FileProgress extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       dropdownOpen:false

//     }

//     this.toggle = this.toggle.bind(this);
    
  
//   }

//   toggle() {
//     this.setState({ dropdownOpen: !this.state.dropdownOpen})
//   }
  
//   render() {
  
//     return (
//       <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
//         <DropdownToggle tag="div" className="uploader_icon_box">
//         <img src={uploader} alt="" className="uploader_icon"/>
//         </DropdownToggle>
//         <DropdownMenu className="progress_bar_box " tag="div">
//                   <div></div>
    
//               <div className="d-flex justify-content-between header"> 
//                   <div className="d-flex ">Troopr Uploader</div>
//                   <div className="d-flex clear_file_progress" onClick={()=>this.props.clearProgress()}>Clear all</div>
//             </div>
//             <div className="d-flex flex-column ">
//                 <div className="project_name"> ProjectName</div>
//                   <div> {this.props.files.map((file) =>(
//                         <div className="file_progress_item_box">
//                         <div className="file_name">
//                         <Name name={file.name} type={file.mime_type}/>
//                         </div>
//                         <div >
//                             {(file.status==="Progress" || file.status==="Success"  )&& <Progress value={file.progress}/>}
//                             {file.status==="Success" && <div>Succcess</div>}
//                         </div>
//                         {file.status==="Progress" && <div >Uploading</div> }
//                         {file.status==="Error" && <div className="file_upload_err">{file.err}</div>}
//                         {file.status==="Limit Exceeded" && <div className="file_upload_err">Exceeds maximum file size: 20MB.</div>}
                        
//                   </div>
//                   ))}
//                 </div>

//             </div>
            
//         </DropdownMenu>
//       </Dropdown>
//     );
//   }
// }
// function mapStateToProps(state) {
//   return {
//     files:state.files.progress
//   };
// }

// export  default connect(mapStateToProps, {clearProgress})(FileProgress )

