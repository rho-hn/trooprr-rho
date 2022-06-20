import React from "react";
import { Modal} from "antd";
import JiraChannelNotification2 from "../channel_notification";
class IssueModal extends React.Component {
  state = { visible: false };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    // console.log(e);
    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    // console.log(e);
    this.setState({
      visible: false
    });
  };

  render() {
    let title;
    // if (this.props.issueId) {
    if(this.props.projectId){
      title = "Edit a new subscription";
    } else {
      title = "Create a new subscription";
    }

    return (
      <Modal
        // title="Create a new subscription"
        title={title}
        visible={this.props.showModal}
        onOk={this.props.closeModal}
        onCancel={this.props.closeModal}
        // style = {{width:"100%"}}
        // width="500"
        width = "700px"
        maskClosable={false}
        footer={null}
      >
        <JiraChannelNotification2
          projectId={this.props.projectId}
          projectName={this.props.projectName}
          channelId={this.props.channelId}
          channel_name={this.props.channel_name}
          skill={this.props.skill}
          setOption={this.props.setOption}
          closeModal = {this.props.closeModal}
          configureId={this.props.configureId}
          isGridSharedChannel={this.props.isGridSharedChannel}
        />
        
      </Modal>
    );
  }
}

export default IssueModal;
