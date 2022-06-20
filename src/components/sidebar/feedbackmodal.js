import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Modal, Input, Typography } from "antd";
import { sendUserFeedback } from "../common/common_action";

class FeedbackModal extends Component {
  constructor() {
    super();
    this.state = {
      feedback_text: "",
      feedbacksent : false,
      error : false
    };
  }

  sendFeedback = () => {
    const { feedback_text } = this.state;
    const { user_now } = this.props;

    if(feedback_text.trim().length > 0){

    
      const data = {
        workspace_id : this.props.match.params.wId,
        user_feedback : feedback_text,
        user_id : user_now._id
      }
    this.props.sendUserFeedback(data).then(res => {
      // this.props.toggleFeedbackModal()
        this.setState({feedback_text: '',feedbacksent : true, error: false})
    })
  }else {
    this.setState({error : true})
  }
  };

  handle_feedback_change = (e) => {
    this.setState({ feedback_text: e.target.value,error:false });
  };

  getFeedbackSentAck = () => {
    const {workspace,channels} = this.props
    let text = ''
    if (workspace.customFeedbackChannel && workspace.customFeedbackemail) {
      const channel = channels.find(cha => cha.id === workspace.customFeedbackChannel)
      text = `Thank you for the feedback! I have sent this to ${workspace.customFeedbackemail} and #${channel.name || ''}`;
    } else if (workspace.customFeedbackemail) {
      text = `Thank you for the feedback! I have sent this to ${workspace.customFeedbackemail}`;
    } else if (workspace.customFeedbackChannel) {
      const channel = channels.find(cha => cha.id === workspace.customFeedbackChannel)
      text = `Thank you for the feedback! I have sent this to #${channel.name || ''}`;
    } else {
      text = "Thank you for the feedback! I have sent this to Troopr Team.";
    }

    return text
  }

  handleModalClose = () => {
    this.setState({feedbacksent : false, feedback_text : '',error:false})
    this.props.toggleFeedbackModal()
  }

  render() {
    const { workspace, user_now } = this.props;
    const { feedbacksent, error } = this.state;
    const help_docs_link = workspace.customHelpDocsLink || "http://docs.troopr.ai/";
    return (
      <Modal
        title='Feedback for Troopr'
        visible={this.props.feedback_modal_visible}
        onOk={feedbacksent ? this.handleModalClose : this.sendFeedback}
        onCancel={this.handleModalClose}
        okText={feedbacksent ? 'Ok' : 'Submit'}
        cancelText='Cancel'
        // afterClose={this.handleModalClose}
      >
        {!this.state.feedbacksent ?<> <Typography.Text strong>Feedback/Question</Typography.Text>
        <Input.TextArea onChange={(e) => this.handle_feedback_change(e)} value={this.state.feedback_text} placeholder='Write a request or feedback for the Troopr team' rows={4} />
        {error && <><Typography.Text type='danger'>*Field is required</Typography.Text><br/></>}
        {!workspace.customFeedbackemail && <Typography.Text type='secondary'>Someone from the Troopr support team will get back to you soon<br /></Typography.Text>}
        <Typography.Text type='secondary'>
          For Toopr help docs, visit{" "}
          <Typography.Link href={help_docs_link} target='_blank'>
            Troopr Help Center
          </Typography.Link>
        </Typography.Text></>
      :
      this.getFeedbackSentAck()  
      }
      </Modal>
    );
  }
}

const mapStateToProps = (store) => {
  return { workspace: store.common_reducer.workspace, user_now: store.common_reducer.user, channels: store.skills.channels };
};

export default withRouter(connect(mapStateToProps, {sendUserFeedback})(FeedbackModal));
