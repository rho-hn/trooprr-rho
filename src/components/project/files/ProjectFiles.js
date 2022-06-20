import React, { Component } from "react";
import "./files.css";
import { getFiles } from "./filedAction";

import { addFile, fileProgress } from "./filedAction";


import { Modal, ModalBody } from "reactstrap";
import Validator from "validator";
import isEmpty from "lodash/isEmpty";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import back_icon from "../../../media/back_icon.png";
import file_home from "../../../media/file_home.svg";
import PropTypes from "prop-types";
import FileItem from "./fileItem";
import FolderItem from "./folderItem";


import { setSidebar } from "../sidebar/sidebarActions";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

class ProjectFiles extends Component {
  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
    this.goHome = this.goHome.bind(this);
    this.toggle = this.toggle.bind(this);

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onFolderFormSubmit = this.onFolderFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    //this.getFolderPath = this.getFolderPath.bind(this);
    //this.nevigateToFolder = this.nevigateToFolder.bind(this);
    this.state = {
      id: this.props.match.params.id,
      dropdownOpen: false,
      posts: [],
      modal: false,
      folderName: "",
      errors: ""
    };
  
  }


  goHome() {
    if (this.props.match.params.pid !== "src") {
      this.props.history.push(
        "/project/" + this.props.match.params.id + "/files"
      );
    } else {
      this.props.history.push(this.props.location);
    }
  }
  goBack() {
    var id = this.props.match.params.pid;
    var data = [];

    if (this.props.match.params.pid !== "src") {
      axios.get("/api/files/" + id).then(res => {
        if (res.data.success) {
          data = res.data;
          if (data.file.parent_id === data.file.project_id) {
            this.props.history.push(
              "/project/" + this.props.match.params.id + "/files"
            );
          } else {
            this.props.history.push(
              "/project/" +
                this.props.match.params.id +
                "/files/folder/" +
                data.file.parent_id
            );
          }
        } else {
          this.setState({ errors: res.data.errors });
        }
      });
    }
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  //Adding files

  onFormSubmit(e) {
    e.preventDefault();

    const { addFile, fileProgress } = this.props;
    if (e.target.files[0].size > 20000000) {
      var file = {};
      file.name = e.target.files[0].name;
      file.project_id = this.state.id;
      file.type = e.target.files[0].type;

      file.status = "Limit Exceeded";
      fileProgress(file);
    } else {
      var pid = "";
      if (this.props.match.params.pid === "src") {
        pid = this.state.id;
      } else {
        pid = this.props.match.params.pid;
      }
      const formData = new FormData();
      const project_id = this.state.id;
      const parent_id = pid;
      const type = e.target.files[0].type;
      const originalname = e.target.files[0].name;
      const data_file = e.target.files[0];
      formData.append("is_dir", false);
      formData.append("project_id", project_id);
      formData.append("parent_id", parent_id);
      formData.append("originalname", originalname);
      formData.append("type", type);
      formData.append("file", data_file);

      const file = {};
      file.name = originalname;
      file.project_id = this.state.id 
      file.type = e.target.files[0].type
      addFile(formData, file).then(response => {
        if (response.data.success) {
          this.setState({
            dropdownOpen: !this.state.dropdownOpen
          });
        } else {
        }
      });
    }
  }

  //Adding Folders

  toggleModal() {
    this.setState({ modal: !this.state.modal, errors: "", folderName: "" });
  }

  onChange(e) {
    this.setState({ folderName: e.target.value });
  }

  isValid(data) {
    var errors = {};

    if (Validator.isEmpty(data.folderName)) {
      errors.folderName = "This field is required";
    }
    this.setState({ errors: errors });

    return isEmpty(errors);
  }

  onFolderFormSubmit(e) {
    var errors = {};

    e.preventDefault();
    const { addFile } = this.props;
    var pid = "";
    if (this.props.match.params.pid === "src") {
      pid = this.state.id;
    } else {
      pid = this.props.match.params.pid;
    }

    const name = this.state.folderName;
    const project_id = this.state.id;
    const parent_id = pid;
    const formData = new FormData();
    formData.append("is_dir", true);
    formData.append("project_id", project_id);
    formData.append("parent_id", parent_id);
    formData.append("name", name);

    if (this.isValid(this.state)) {
      addFile(formData).then(response => {
        if (response.data.success) {
          this.setState({
            modal: !this.state.modal,
            errors: {},
            folderName: ""
          });
        } else {
          errors.folderName = "Error in Creating Folder";
          this.setState({ errors: errors });
        }
      });
    }
  }

  /*getFolderPath(folder){
    const newPathItem = {name:folder.name,fId:folder._id}  

    this.setState(prevState => ({
             path: [...prevState.path, newPathItem]
          }));
    /*this.setState({
         path: path
    }, function(){
    }.bind(this));
    localStorage.setItem('FolderPath',JSON.stringify(path));
  }

  /*nevigateToFolder(fId){
    
    var path=JSON.parse(localStorage.getItem('FolderPath'))

    const folderIndex = path.findIndex(pathItem => pathItem.fId == fId );
    const newPath = path.slice(0,folderIndex)
    this.setState({
      path : newPath
    });
     localStorage.setItem('FolderPath',JSON.stringify(newPath))
    this.props.history.push(
              "/project/" +
                this.props.match.params.id +
                "/files/folder/" +
                fId
            );
  }*/

  componentDidMount() {
    const { getFiles, setSidebar } = this.props;
    const id = this.state.id;
    var pid = "";

    if (this.props.match.params.pid === "src") {
      pid = this.state.id;
    } else {
      pid = this.props.match.params.pid;
    }
    setSidebar("");
    getFiles(id, pid)
      .then(val => {
        // this.props.toggleLoader(false);
      })
      .catch(e => {
        // this.props.toggleLoader(false);
        console.error(e)
      });
  }

  /* componentWillUnmount(){
    localStorage.removeItem('FolderPath');
  }
*/
  render() {
    const { errors } = this.state;

    const topBarButtons = () => {
      return (
        <div>
          <img
            className="home--btn"
            onClick={this.goHome}
            src={file_home}
            alt="home"
          />
          <img
            src={back_icon}
            alt="back_button"
            onClick={this.goBack}
            className="backbutton--icon"
          />
        </div>
      );
    };

    const { project, files } = this.props;

    const Folders = files.filter(file => file.is_dir === true);
    const Files = files.filter(file => file.is_dir !== true);


    return (
      <div className="proj-files  align-items-center">
      {this._renderLoader()}
           <div className="d-flex justify-content-between file-header proj-top">
             <div className="go-back">
              {topBarButtons()}
              </div>
              <div className="add-file-folder">
                 <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                  <DropdownToggle className="file_add_btn"  color="primary" caret >

                      New
                   </DropdownToggle>
                  <DropdownMenu className="custom_dropdown_conatiner" right>
                  
                      <form onSubmit={this.onFormSubmit}> 
                        <div className="upload-btn-wrapper custom_dropdown_item">
                        <div className="file_upload_btn d-flex  align-items-center">
                        <i className="material-icons  custom_dropdown_icon">
                                      arrow_upward
                                      </i>
                      
                    
                      <span>Upload new file</span>
                      </div>
                          <input type="file" onChange={this.onFormSubmit} name="filetoupload"/>
                         </div>
                      </form>
                
               
                    <div className="custom_dropdown_item d-flex align-items-center" onClick={this.toggleModal}>
                                    <i className="material-icons custom_dropdown_icon">
                create_new_folder
                </i>
                      
                      <span>Create new folder</span>
                      
                     
                    </div>
   
                  </DropdownMenu>
                </Dropdown>
               </div>
              </div>
             

        {/* <div className="folder-path-navigation">
                     <span onClick={this.goHome}>Project Files > </span>
                       <div className="show-folder-name12">{path ? path.length > 0 && ( 
                                          path.map(pathItem => {
                                          return <span className="path-state">  
                                            {pathItem.name}</span>})
                                          ) :
                                          <span></span>                 
                        }
                  </div>
                </div>
              */}

        <div className="folder-container">
          <h3 className="Folders">Folders</h3>
          <div className="d-flex flex-wrap">
            {Folders.map((folder, index) => {
              return (
                <FolderItem
                  key={folder._id}
                  members={this.props.members}
                  data={folder}
                />
              );
            })}
          </div>
        </div>

        <div className="file-container">
          <h3 className="Files">Files</h3>
          {Files.map((file, index) => {
            return (
              <FileItem
                key={file._id}
                members={this.props.members}
                data={file}
              />
            );
          })}
        </div>
        <div>
          <Modal
            isOpen={this.state.modal}
            toggle={this.toggleModal}
            className={this.props.className}
          >
            <ModalBody>
              <div
                className
                className="d-flex justify-content-between add_folder_header"
              >
                <h5 className="modal-title">Create Folder</h5>
                <button
                  type="button"
                  className="close"
                  onClick={this.toggleModal}
                >
                  &times;
                </button>
              </div>
              <form onSubmit={this.onFolderFormSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    onChange={this.onChange}
                    placeholder="enter folder name"
                    className="form-control "
                    name="folderName"
                    required
                  />
                  {errors.folderName && (
                    <div className="project-files-errors">
                      {errors.folderName}
                    </div>
                  )}
                </div>

                <button
                  className="btn btn-primary form-control"
                  type="button"
                  onClick={this.onFolderFormSubmit}
                >
                  Create{" "}
                </button>
                <br />
              </form>
            </ModalBody>
          </Modal>
        </div>
      </div>
    );
  }
}
ProjectFiles.propTypes = {
  files: PropTypes.array.isRequired,
  project: PropTypes.object.isRequired,
  setSidebar: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    sidebar: state.sidebar.sidebar,
    project: state.projects.project,
    files: state.files.files,
    members: state.projectMembership.members,
    loader: state.taskPreferences.loader
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    { getFiles, addFile, fileProgress, setSidebar }
  )(ProjectFiles)
);
