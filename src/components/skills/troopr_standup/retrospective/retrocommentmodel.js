import React, { Component } from 'react'
import { Modal, Input, Divider, Avatar, message, Popconfirm, Typography } from 'antd';
import { addLikeToStandup, deleteRetroComment, addLikeToStandupVer2 } from "../../skills_action"
import { connect } from "react-redux";
const { TextArea } = Input;

const { Text } = Typography;

class Retrocommentmodel extends Component {
  constructor(props) {
    super(props)

    this.state = {
      visible: false,
      comment: ""
    }
  }

  handleOk = async () => {
    let data = this.props.data;
    data.comment = this.state.comment
    data.type = "comments"

    this.props.isNonRetro ? this.props.addLikeToStandupVer2(data).then(res => {
      if (res.data.permissionerror) {
        message.error(res.data.error);
      }
    }) : this.props.addLikeToStandup(data).then(res => {
      if (res.data.permissionerror) {
        message.error(res.data.error);
      }

    })
    this.props.handleCancel(this.props.response)
  }

  handleChange = (e) => {
    this.setState({ comment: e.target.value })
  }

  deleteComment = (item) => {
    if (item.user_id && item.user_id._id && (item.user_id._id === this.props.currentUserId)) {
      let commentId = item._id;

      this.props.deleteRetroComment(commentId).then(res => {
        if (res.data.success) {
          message.success("Comment deleted");
        } else {
          message.error("Could not delete comment");
        }
      }).catch(err => {
        message.error("Could not delete comment");
      })
    } else {
      message.error("You can only delete your own comment");
    }

    this.props.handleCancel(this.props.response);
  }

  getComment = (item) => {
    return (
      <div style={{ display: "flex", marginBottom: 8 }}>
        {!this.props.isAnonymous&&
        <div style={{ marginRight: 4 }}>
          {/* <Avatar size="small" icon="user" /> */}
          {(item.user_id && item.user_id.profilePicUrl) ? <Avatar size="small" src={item.user_id.profilePicUrl} /> : <Avatar size="small">{this.props._getInitials(item.user_id.displayName ||item.user_id.name)}</Avatar>}
        </div>
        }
        <div style={{ flexGrow: 1 }}>
        
          <div style={{ lineHeight: 1.0 }}>
          {!this.props.isAnonymous&&
            <Text type="secondary" style={{ marginRight: 4 }}>
              {item.user_id && (item.user_id.displayName || item.user_id.name)}
            </Text>
          }
            {item.user_id && item.user_id._id && (item.user_id._id === this.props.currentUserId) && (
              <Popconfirm
                title="Are you sure delete this comment?"
                onConfirm={() => this.deleteComment(item)}
                // onCancel={cancel}
                okText="Yes"
                cancelText="No"
              >
                <a href="#">Delete Comment</a>
              </Popconfirm>
            )}
          </div>
          
          <div>
            <Text>{item.comment_text}</Text>
            {this.props.isAnonymous && <hr style={{opacity:"0.20"}}/>}
          </div>
        {/* <Divider /> */}
        </div>
      </div>
    )
  }

  render() {

    return (

      <Modal
        centered={true} 
        // bodyStyle={{ overflowY: "scroll", maxHeight: "75vh" }}
        bodyStyle={{ maxHeight: "75vh" }}
        title="Add Comment" 
        visible={this.props.showModal} 
        onOk={this.handleOk} 
        onCancel={()=>this.props.handleCancel(this.props.response)} 
        okText="Add Comment"
        cancelText="Cancel"
      >
        <TextArea placeholder="Add a comment" onChange={this.handleChange} value={this.state.comment} rows={4} />
        {(this.props.comments && this.props.comments.length > 0) && (<Divider />)}
        {(this.props.comments && this.props.comments.length > 0) ? 
          (<div style={{ maxHeight: "300px", overflow: "scroll" }}>
            {(this.props.comments && this.props.comments.length > 0) && this.props.comments.map(item => {
              return this.getComment(item);
            })}
        </div>) : 
        (<div style={{ overflow: "scroll" }}></div>)}
        {/* <div style={{ height: "300px", overflow: "scroll" }}> */}
        {/* <div style={{ overflow: "scroll" }}> */}
          {/* {(this.props.comments && this.props.comments.length > 0) && this.props.comments.map(item => {
            return this.getComment(item);
          })}
        </div> */}
      </Modal>

    )
  }
}

// export default connect(null, { addLikeToStandup, deleteStandupComment })(Retrocommentmodel)
export default connect(null, { addLikeToStandup, deleteRetroComment, addLikeToStandupVer2 })(Retrocommentmodel)