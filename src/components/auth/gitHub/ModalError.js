import React, { Component } from "react";
import { Modal, Button, Typography } from "antd";
import { connect } from "react-redux";
import { showErrorModal } from "../../skills/github/gitHubAction";

const { Text } = Typography;

class ModalError extends Component {
  closeModal = () => {
    this.props.closeModal();
    //  this.props.history.push("/"+this.props.wId+"/skills/"+this.props.skillId+"?view=connection");
  };
  onClickButton = () => {
    let showModal = false;

    this.props.showErrorModal(showModal);
  };
  render() {
    return (
      <Modal
        title="Error Connecting to Account"
        visible={this.props.showModal}
        // onOk={()=>this.props.closeModal()}
        onCancel={this.onClickButton}

        footer={null}
      >
        <div>
          <Text>
            Only organization account is supported.Please try connecting the
            organization account
          </Text>
        </div>
        <div style={{marginTop:"10px"}}>
          <Button type="primary" onClick={this.onClickButton}>
            Ok
          </Button>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  // console.log("store: "+JSON.stringify(state))
  return {
    currentSkill: state.skills.currentSkill
  };
};

// export default ModalError;
export default connect(mapStateToProps, { showErrorModal })(ModalError);
