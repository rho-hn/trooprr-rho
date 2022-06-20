import React from "react";
import "@ant-design/compatible/assets/index.css";
import { Modal, Image,/*  Row, Col, */ Typography } from "antd";
import JiraDomainUrlExampleImage from "../../../media/jira_cloud_site_url_example.jpeg"
import JiraDomainUrlExampleImage_server from "../../../media/jira_server_site_url_example.jpeg"
import Conflunce_domian_url from "../../../media/Confluence_Domain_url.png"

class JiraConnectionRequestModal extends React.Component {
  state = {};

  render() {
    const {isConfluence} = this.props
    return (
      <Modal title={isConfluence ? 'Confluence site URL' : 'Jira site URL'} visible={this.props.modal} onCancel={this.props.toggle} footer={false} centered >
        {/* <Row>
          <Col> */}
            <Typography.Text>To locate your {isConfluence ? 'Confluence' : 'Jira'} site URL, login to your {isConfluence ? 'Confluence' : 'Jira'} page in your browser and select the link from address bar</Typography.Text>
          {/* </Col>
          <Col> */}
            <br/>
            <br/>
            <Image
              style={{
                "box-shadow": "rgba(0, 0, 0, 0.24) 0px 3px 8px",
              }}
              // width={400}
              src={this.props.isConfluence ? Conflunce_domian_url : this.props.isCloud ? JiraDomainUrlExampleImage : JiraDomainUrlExampleImage_server}
              alt={isConfluence ? 'confluence site url example' : 'jira site url example'}
            />
          {/* </Col>
        </Row> */}
      </Modal>
    );
  }
}

export default JiraConnectionRequestModal;
