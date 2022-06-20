import React from "react";
import { Modal} from "antd";
import ProjectCardNotifications from "../ProjectCardNotifications";
class ProjectModal extends React.Component {
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
    if (this.props.projectId) {
      title = "Edit a new subscription";
    } else {
      title = "Create a new subscription";
    }

    return (
      <Modal
        title={title}
        visible={this.props.showModal}
        onOk={this.props.closeModal}
        onCancel={this.props.closeModal}
        width="800px"
        footer={null}
      >
        <ProjectCardNotifications
        subscription_data={this.props.subscription_data}
          projectId={this.props.projectId}
          projectName={this.props.projectName}
          channelId={this.props.channelId}
          channel_name={this.props.channel_name}
          skill={this.props.skill}
          setOption={this.props.setOption}
          closeModal={this.props.closeModal}

        />
      </Modal>
    );
  }
}

export default ProjectModal;
