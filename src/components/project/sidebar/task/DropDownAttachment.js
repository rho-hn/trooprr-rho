import React, { Component } from 'react';
import moment from "moment";
import unknownFileImg from '../../../../media/undefined_icon.png'
import { DeleteOutlined } from '@ant-design/icons';
import { Modal, Tooltip,Typography } from "antd";

const { Text } = Typography;


class DropDownAttachment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      fileColors: [],
      deleteConfirmModal: false
    }
    this._renderImageType = this._renderImageType.bind(this);
  }

  _renderImageType(type) {
    switch (type) {
      case 'jpg':
      case 'tif':
      case 'tiff':
      case 'jpeg':
      case 'jif':
      case 'jfif':
      case 'pcd':
      case 'png':
      case 'svg':
      case 'bmp':
        return (
          <div className="sidebar_attach_icon_fa" style={{color:(localStorage.getItem('theme') == "dark" && "#ffffff")}}>
            <i className="fas fa-file-image" aria-hidden="true"></i>
          </div>
        );
      case 'pdf':
        return (
          <div className="sidebar_attach_icon_fa">
            <i className="fas fa-file-pdf"></i>
          </div>
        );
      case '7z':
      case 'cbr':
      case 'deb':
      case 'pkg':
      case 'rar':
      case 'zip':
      case 'tar':
        return (
          <div className='sidebar_attach_icon_fa'>
            <i className="fas fa-file-archive" aria-hidden="true"></i>
          </div>
        );
      case 'aif':
      case 'iff':
      case 'mp3u':
      case 'mp4u':
      case 'mp3':
      case 'mpa':
      case 'wav':
      case 'wma':
        return (
          <div className='sidebar_attach_icon_fa'>
            <i className="fas fa-file-audio" aria-hidden="true"></i>
          </div>
        );
      case 'asp':
      case 'aspx':
      case 'css':
      case 'html':
      case 'js':
      case 'php':
      case 'xhtml':
      case 'c':
      case 'cpp':
      case 'cs':
      case 'java':
      case 'pl':
      case 'py':
      case 'swift':
      case 'vb':
      case '.vcxproj':
      case 'xcodeproj':
        return (
          <div className='sidebar_attach_icon_fa'>
            <i className="fas fa-file-code" aria-hidden="true"></i>
          </div>
        );
      case 'doc':
      case 'docx':
      case 'log':
      case 'pages':
      case 'rtf':
      case 'txt':
      case 'wpd':
      case 'wps':
      case 'xml':
        return (
          <div className='sidebar_attach_icon_fa'>
            <i className="fas fa-file-alt" aria-hidden="true"></i>
          </div>
        );
      case '3gp':
      case 'avi':
      case 'flv':
      case 'm4v':
      case 'mov':
      case 'mp4':
      case 'mpg':
      case 'swf':
      case 'vob':
      case 'wmv':
      case 'mkv':
        return (
          <div className='sidebar_attach_icon_fa'>
            <i className="fas fa-file-video" aria-hidden="true"></i>
          </div>
        );
      case 'xlr':
      case 'xls':
      case 'xlsx':
        return (
          <div className='sidebar_attach_icon_fa'>
            <i className="fas fa-file-excel" aria-hidden="true"></i>
          </div>
        );
      case 'pps':
      case 'ppt':
      case 'pptx':
        return (
          <div className='sidebar_attach_icon_fa'>
            <i className="fas fa-file-powerpoint" aria-hidden="true"></i>
          </div>
        );
      default:
        return (
          <div className='sidebar_attach_icon_fa'>
            <img src={unknownFileImg} alt="" />
          </div>
        );

    }
  }

  deleteShowConfirmModal = () => {
    let confirmObj = {
      title: 'Are you sure you want to delete this attachment?',
      // content: ,
      okText: 'Yes',
      cancelText: 'No',
      className: "sidebar_dropdown",
      onOk: this.props.deleteFile,
      okText: "Yes",
      okType: 'primary',
      maskClosable:true
    }
    // console.log(confirmObj)
    Modal.confirm(confirmObj);
  }

  render() {


    const { file } = this.props;
    return (
      <div index={file._id} className="d-flex task_file_box nested-class" style={{background:(localStorage.getItem('theme') == "dark" && "#1f1f1f"),border:(localStorage.getItem('theme') == "dark" &&"solid 1px #a9aaac ")}}>
        {this._renderImageType(file.name.split('\.')[file.name.split('\.').length - 1])}
        <div
          className='sidebar-attachment-box'
          onClick={e => this.props.downloadFile(file._id)}
        >
          <div className="sidebar_file_name"><Text>{file.name}</Text></div>
          <div className="sidebar_attach_name">{Math.floor((file.size) / (1024))} KB · Uploaded by {file.created_by ? (file.created_by.displayName || file.created_by.name) : ''}</div>
          <div className="sidebar_attach_name">{moment(new Date(file.created_at)).format('DD MMM, hh:mm a')}</div>
        </div>
        <div className="sidebar_attach_delete">
          <Tooltip title="Remove this attachment" placement='topRight' align={{ offset: [10, -15] }}>
            <DeleteOutlined
              className="taskSidebar_deleteComment"
              onClick={this.deleteShowConfirmModal} />
          </Tooltip>
        </div>
        {/* {file.progress < 100 ?
                <div className="file_Progressbar">
                  <img className="closebtn" src={closebtn} />
                  <div className="round">
                    <CircularProgressbar
                      percentage={file.progress}
                      textForPercentage={null}
                    />
                  </div>
                </div>
                :
                <i
                  className="fa fa-arrow-circle-down task_file_down"
                  aria-hidden="true"
                  onClick={e => this.downloadFile("download")}
                />
                } */}
      </div>
    );
  }
}

export default DropDownAttachment;