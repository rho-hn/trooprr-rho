import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  Layout, Row, Col
} from 'antd';
import ConfluenceCard from "./confluence_card.js";
const { Content } = Layout;

class ConfluenceChannelPreference extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    // else projectFound = false;
    return (
      <Content style={{ padding: "16px 16px 32px 24px", overflow: "initial", marginLeft: -15, marginTop: -20 }}>
        <Row className='content_row_jira' gutter={[16, 16]}>
          <Col span={24}>
            <ConfluenceCard channel={this.props.channel} />
            {/* </ConfluenceCard> */}
          </Col>
          {/* <Col span={24}>
          </Col> */}
        </Row >
      </Content>
    );
  }
}


export default withRouter(connect(null, {
})(ConfluenceChannelPreference));
