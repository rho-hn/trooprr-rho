import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pdf_icon from '../../../media/files_icon.png';
import {setSidebar} from '../sidebar/sidebarActions';
import { connect } from 'react-redux';
import { setFile,deleteFile, updateFileName} from './filedAction.js'
import { withRouter} from 'react-router-dom';
// import options from '../../../media/options_icon.png';
import file_text from '../../../media/file_text.png';
import image_icon from '../../../media/image_icon.png';
import zip_icon from '../../../media/zip_icon.png';
import video_icon from '../../../media/video_icon.png';
import audio_icon from '../../../media/audio_icon.png'
import undefined_icon from '../../../media/undefined_icon.png';
import Validator from "validator";
import isEmpty from "lodash/isEmpty";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';


function ChangeDate({date_created}){
const date=new Date(date_created);
const new_date=date.toDateString()
return(<td>{new_date}</td>);
};


function Name({name,isDir,type}){
var typeArr=[];
  if (type===undefined){
  typeArr=[];

  }else{
  typeArr=type.split('/')
}  
 if(typeArr[0]==="text"){
  return(<div className="tabletext"><img src={file_text} className="files-icon" alt="txtfile"/>{name}</div>)
}else if(typeArr[0]==="image"){
 return(<div className="tabletext"><img src={image_icon} className="files-icon" alt="img"/>{name}</div>);
}else if(typeArr[0]==="video"){
 return(<div className="tabletext"><img src={video_icon} className="files-icon" alt="img"/>{name}</div>);
}else if(typeArr[0]==="application" && typeArr[1]==="pdf"){
 return(<div className="tabletext"><img src={pdf_icon} className="files-icon" alt="img"/>{name}</div>);
}else if(typeArr[0]==="application" && typeArr[1]==="zip"){
 return(<div className="tabletext"><img src={zip_icon} className="files-icon" alt="img"/>{name}</div>);
}else if (typeArr[0]==="audio"){
 return(<div className="tabletext"><img src={audio_icon} className="files-icon" alt="img"/>{name}</div>)}else{
 return(<div className="tabletext"><img src={undefined_icon} className="files-icon" alt="img"/>{name}</div>)
};
}


  
class FileItem extends Component {

   constructor(props) {
    super(props);
            this.onNameClick = this.onNameClick.bind(this);
            this.deleteFile = this.deleteFile.bind(this);
            this.toggle = this.toggle.bind(this);
            this.onClickSubmit = this.onClickSubmit.bind(this); 
            this.onSubmit = this.onSubmit.bind(this); 
            this.onChange = this.onChange.bind(this);
            this.state={
              dropdownOpen: false,
              name:this.props.data.name,
              errors:''
     }
    }



  isValid(data) {
    var errors = '';

    if (Validator.isEmpty(data)) {
      errors.name = "This field is required";
    }
    this.setState({ errors: errors });

    return isEmpty(errors);
  }
 

 onSubmit(e){
     e.preventDefault() ;
     if(this.isValid(this.state.name)){
     this.props.updateFileName(this.props.data._id,{name:this.state.name})
                .then(res =>{
                  if(res.data.success){
                    this.setState({name:res.data.file.name});
                  }else{

                  }
                });
  }
}

onClickSubmit(e){
  e.preventDefault();
  if(this.isValid(this.state.name)){
    this.props.updateFileName(this.props.data._id,{name:this.state.name})
              .then(res =>{
                if(res.data.success){
                  this.setState({
                    name:res.data.file.name, 
                    dropdownOpen: false
                  });
                }else{

                }
              })
  }
}




onChange(e){
  this.setState({
     [e.target.name] : e.target.value
  })
}

onNameClick() {
const {setFile, setSidebar } = this.props 
      setSidebar('file');
      setFile(this.props.data);
}

toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }
   
  deleteFile(){
    
   this.props.deleteFile(this.props.data._id)
       .then(res => {
              if (res.data.success) {
       
              }else{

                  this.setState({errors:res.data.errors})
               }
            });
  }

  render() {

            const { errors } = this.state;
            const{data,members}=this.props;




            const fileOptions = () => { 
                            return( 
                                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                                   <DropdownToggle tag="div" className="files_option_dropdown">
                                   <i class="material-icons">
                                        more_horiz
                                        </i>
                                   </DropdownToggle>
                                   <DropdownMenu className="custom_dropdown_conatiner">
                                   <div className=" custom_dropdown_item_input">
                                         <form  onSubmit={this.onClickSubmit}>
                                             <input 
                                              type="text"
                                              autoComplete="off"
                                              onBlur={this.onSubmit}
                                              onChange={this.onChange}
                                              value={this.state.name}
                                              name="name"
                                              className="dropdown-item-form"
                                              />
                                         </form>
                                         </div>
                                      
                                         <div class="custom_dropdown_divider"></div>
                                     <DropdownItem onClick={this.deleteFile}className="custom_dropdown_item d-flex align-items-center">
                                     <i class=" material-icons custom_dropdown_icon">delete_outline</i>
                                                  Delete File
                                     </DropdownItem>
                                   </DropdownMenu>
                                 </Dropdown>
                                 );
                                }






                                return(  

                                      <div className="project-file-item">
                                           <div>
                                                  <div className="file-item-content" onClick={this.onNameClick}>
                                                   </div>
                                                  <div className="d-flex justify-content-between align-items-center file-item-footer">
                                                  <div className="d-flex align-items-center"  onClick={this.onNameClick}>
                                                     <Name name={this.state.name} isDir={data.is_dir} type={data.mime_type} onClick={this.onNameClick}/>
                                                  </div>
                                                    
                                                         {fileOptions()}
                                                
                                                  
                                                  </div>
                                                  </div>
                                         </div>
                                 )
  

}}

FileItem.propTypes = {
  setSidebar: PropTypes.func.isRequired,
  setFile:PropTypes.func.isRequired,
  updateFileName:PropTypes.func.isRequired
}



export default withRouter(connect(null,{setFile,setSidebar,deleteFile,updateFileName})(FileItem));