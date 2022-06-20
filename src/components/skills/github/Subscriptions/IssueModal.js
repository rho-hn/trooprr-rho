import React from "react";
import { Modal} from "antd";
import GithubChannelNotification2 from "../github_channel_notification2";
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
    if (this.props.issueId) {
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
        // width = "900px"

        footer={null}
      >
        <GithubChannelNotification2
        subscription_data={this.props.subscription_data}
          issueId={this.props.issueId}
          issueName={this.props.issueName}
          channelId={this.props.channelId}
          channel_name={this.props.channel_name}
          skill={this.props.skill}
          setOption={this.props.setOption}
          closeModal = {this.props.closeModal}
        />
      </Modal>
    );
  }
}

export default IssueModal;
