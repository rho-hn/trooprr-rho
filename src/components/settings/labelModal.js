import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import moment from "moment";

import {
  DownOutlined,
} from '@ant-design/icons';

import {
  PageHeader,
  List,
  Layout,
  Card,
  Tag,
  Typography,
  Modal,
  Form,
  Input,
  Select,
  Button
} from "antd";

const {Option} = Select
const { Text } = Typography

class LabelModal extends Component {

  constructor(props) {
    super();
    this.state = {
      loading: false,
      labelModalVisible: false,
    }
  }

  componentDidMount = () => {

  }

  formRef = React.createRef()

  onOk = () => {
    this.formRef.current
      .validateFields()
      .then(values => {
        // this.formRef.current.resetFields();
        this.props.onUpdate(values, this.props.currentLabel);
      })
      .catch(info => {
        console.info('Validate Failed:', info);
        console.error(info)
      });
  }

  render() {

    const { onDelete, visible, onCancel, currentLabel } = this.props
    return (
      <Fragment >
        {currentLabel && <Modal
          visible={visible}
          title="Update Label"
          // okText="Update"
          // cancelText="Cancel"
          onCancel={onCancel}
          onOk={this.onOk}
          footer={[
            <Button danger style={{float:"left"}} key="del" onClick={() => onDelete(currentLabel)}>
              Delete
            </Button>,
            <Button key="back" onClick={onCancel}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={this.onOk}>
              Update
            </Button>,
          ]}
        >
          <Form
            ref={this.formRef}
            // form={form}
            layout="vertical"
            name="form_in_modal"
            initialValues={{
              name: currentLabel.name,
              color: currentLabel.color
            }}
          >
            <Form.Item name="name" label="Name"
              rules={[
                {
                  required: true,
                  message: 'Label name missing!',
                },
              ]}>
              <Input/>
            </Form.Item>
            <Form.Item label="Color" name="color"
              rules={[
                {
                  required: true,
                  message: 'Label name missing!',
                },
              ]}>
              <Select placeholder="Select Frequency">
                <Option key="green" value="#61be4f">
                  Green
                </Option>
                <Option key="yellow" value="#f2d700">
                  Yellow
                </Option>
                <Option key="orange" value="#ff9f1a">
                  Orange
                </Option>
                <Option key="red" value="#eb5a46">
                  Red
                </Option>
                <Option key="purple" value="#c377e0">
                  Purple
                </Option>
                <Option key="blue" value="#0078bf">
                  Blue
                </Option>
                <Option key="lightblue" value="#00c2e0">
                  Light Blue
                </Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>}
      </Fragment>
    )
  }
}

const mapStateToProps = store => {
  return {
    // user_now: store.common_reducer.user,
    // tags: store.tags.tags,
  }
}

export default withRouter(
  connect(mapStateToProps, {
  })(LabelModal)
)