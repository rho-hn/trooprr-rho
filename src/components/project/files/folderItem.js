import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { setFile,deleteFile,updateFileName} from './filedAction.js'
import { withRouter} from 'react-router-dom';

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
  typeArr=type.split('/')}
  

if(isDir===true){
return(<div className="tabletext"><i className="fa fa-folder add_folder_img" aria-hidden="true"></i><span className="tabletext">{name}</span></div>);
}else{
 return(<div className="tabletext"><img src={undefined_icon} className="files-icon" alt="img"/>{name}</div>);
}
}

  
class FolderItem extends Component {

   constructor(props) {
    super(props);
            this.onNameClick = this.onNameClick.bind(this);
            this.deleteFolder=this.deleteFolder.bind(this);
            this.onClickSubmit = this.onClickSubmit.bind(this); 
            this.onSubmit = this.onSubmit.bind(this); 
            this.onChange = this.onChange.bind(this);
            this.toggle = this.toggle.bind(this);
            
            this.state={
             errors:'',
             name:this.props.data.name,
             dropdownOpen: false
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

deleteFolder(){
var location=this.props.location;
      const id = this.props.data._id;
      const {deleteFile}=this.props;
      deleteFile(id).then(res => {
      if (res.data.success) {
       

     }else{

      this.setState({errors:"There was an error deleting your folder"});
     }
      });
  
}

toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

onNameClick() {
    //this.props.folderPath();
    this.props.history.push("/project/"+this.props.match.params.id+"/files/folder/"+this.props.data._id);
}
   
 
  render() {

            const { errors } = this.state;
            const{data,members}=this.props;
             const folderOptions = () => { 
                            return(
                                 <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                                   <DropdownToggle tag="div" className="files_option_dropdown">
                                   <i class="material-icons" >
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
                                     
                                     <DropdownItem onClick={this.deleteFolder} className="custom_dropdown_item d-flex align-items-center">
                                     <i class=" material-icons custom_dropdown_icon">delete_outline</i>
                                                  Delete Folder
                                     </DropdownItem>
                                   </DropdownMenu>
                                 </Dropdown>                                
                                );
                              }



                                return(  

                                       <div className="file-item-footer d-flex justify-content-between align-items-center">
                                         <div className=" d-flex align-items-center"  onClick={this.onNameClick}>
                                           <Name name={this.state.name} isDir={data.is_dir} type={data.mime_type}/>
                                         </div>
                                         
                                           {folderOptions()}
                                       
                                      </div>

                                 )
  

}}

FolderItem.propTypes = {
  setFile:PropTypes.func.isRequired,
  updateFileName : PropTypes.func.isRequired,
  file:  PropTypes.object.isRequired
}

function mapStateToProps(state){
  return{ 
   file: state.files.file,
 };
}


export default withRouter(connect(mapStateToProps,{setFile,deleteFile,updateFileName})(FolderItem));