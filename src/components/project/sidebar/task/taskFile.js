import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { addTaskFile } from '../../tasks/task/taskActions'
import {message, Typography} from "antd"
import customToast from '../../../common/customToaster';
import {PaperClipOutlined } from '@ant-design/icons';

const uuidv4 = require("uuid/v4")
const {Text} = Typography

class AddTaskFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.pId,
      errors: '',
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onFormSubmit(e) {

    if(e.target.files[0].size>(1024*1024*20)){
      message.error({content:"File Size is more than 20MB"})
      this.setState({attachFiled: ''});
      
    }else{
    let key = uuidv4()
    message.loading({ content: 'Uploading file...', key, duration:0 });
    this.setState({attachFiled: e.target.value})
    e.preventDefault();
    const { addTaskFile, task } = this.props;
    const formData = new FormData();
    const file = e.target.files[0]
    const type = e.target.files[0].type;
    const originalname = e.target.files[0].name;
    formData.append('is_dir', false);
    formData.append('originalname', originalname)
    formData.append('type', type)
    formData.append('file', file)
    const files = {}
    files.size = e.target.files[0].size
    files.name = originalname
    files.project_id = this.state.id;
      files.type = e.target.files[0].type;
    var indexs = task.files.find(function (item, i) {
      return item.name === originalname
    });
    if (!indexs) {
      if (this.props.match.params.pId) {
        addTaskFile(this.props.match.params.wId,this.props.task._id, formData, files, this.props.task).then((response) => {
          
          if (response.data.success) {
            message.success({ content: 'File uploaded and attached successfully', key, duration: 2 });
            // this.props.setAttachmentsToaster();
            // this.props.dropdownToggleForAdd();            
            // customToast.taskDeleted("File Uploaded", {
            //   className:
            //     "some-toast-box d-flex justify-content-between align-items-center"
            // });
            this.setState({attachFiled: ''});
          } else {
            message.error({ content: 'Likely error uploading file', key, duration: 2 });
            // this.props.setAttachmentsToaster();
            // customToast.error('Error in Uploading File: Plz try again later', {
            //   className:
            //     "some-toast-box d-flex justify-content-between align-items-center"
            // });
            // this.setState({ errors: "Error in Uploading File" })
            this.setState({attachFiled: ''});

          }

        })
      } else {
        message.error({ content: 'Squad info not found', key, duration: 2 });
        // addMyTaskFile(this.props.task._id, formData).then((response) => {
        //   if (response.data.success) {
        //     this.props.setAttachmentsToaster();
        //     this.props.dropdownToggleForAdd();
        //     customToast.taskDeleted("File Uploaded", {
        //       className:
        //         "some-toast-box d-flex justify-content-between align-items-center"
        //     });
        //     this.setState({attachFiled: ''});
        //   } else {
        //     this.props.setAttachmentsToaster();
        //     customToast.error('Error in Uploading File: Plz try again later', {
        //  className:
        //         "some-toast-box d-flex justify-content-between align-items-center"
        //   });
        //   this.setState({attachFiled: ''});
        //  this.setState({ errors: "Error in Uploading File" })

        //  }

      // })

      }
    } else {
      message.error({ content: 'File already exists', key, duration: 2 });
      // this.props.setAttachmentsToaster();
      // customToast.error('Error: File already exists', {
      //   className:
      //     "some-toast-box d-flex justify-content-between align-items-center"
      // });
      this.setState({attachFiled: ''});
      // this.setState({ errors: "File already exists" })
    }
  }
  }

  render() {
    // const { errors } = this.state;
    return (

  
        <form onSubmit={this.onFormSubmit} >

          <div className="upload-btn-wrapper custom_dropdown_item">
            <div className="add_task_file_btn d-flex  align-items-center " >
              {/* <i className="material-icons custom_dropdown_icon" style={{color:(localStorage.getItem('theme') == "dark" && "#ffffff")}}>
                            attach_file
                            </i> */}
                            <PaperClipOutlined style={{color:localStorage.getItem("theme") ==  "dark" && "rgba(255, 255, 255, 0.65)",marginRight:'5px'}} />
                          <Text>Attach a File (Max 20MB)</Text>
        <input type="file" value={this.state.attachFiled} onChange={this.onFormSubmit} name="filetoupload" />
            </div>
          </div>
 
        </form>


        
   

    )
  }
}


export default withRouter(connect(null, { addTaskFile })(AddTaskFile))