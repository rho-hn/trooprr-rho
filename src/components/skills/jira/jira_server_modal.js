
import React, { Component, Fragment } from 'react'
import { LinkOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Input } from "antd";


const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
    // eslint-disable-next-line

    class extends React.Component {
        hasErrors = (fieldsError) => {
            return Object.keys(fieldsError).some(field => fieldsError[field]);
        }
        render() {
            let name=(this.props.currentSkillUser && this.props.currentSkillUser.user_obj)? (this.props.currentSkillUser.user_obj.displayName||this.props.currentSkillUser.user_obj.name):null
            // console.log(this.props,name)
            const { visible, onCancel, onCreate, form, serverConnection } = this.props;
            const { getFieldDecorator, getFieldError, getFieldsError } = form;
            const urlError = getFieldError('url');
            return serverConnection ?
                <Modal
                    visible={visible}
                    title="Jira Server/Data Center Connection"
                    okText="Connect"
                    onCancel={onCancel}
                    onOk={onCreate}
                    okButtonProps={{ disabled: this.hasErrors(getFieldsError()) }}
                    centered
                >
                    <Form layout="vertical">
                        <Form.Item label="Jira Server Url" style={{color:(localStorage.getItem("theme") == 'dark' && "#ffffff")}} extra={<span style={{color:(localStorage.getItem("theme") == 'dark' && "rgba(255,255,255,0.45)")}}>Example:http://jira.troopr.io</span> } validateStatus={urlError ? 'error' : ''} >
                            {getFieldDecorator('url', {
                                rules: [{ required: true, message: 'Please enter valid url!', type: 'url' }],
                            })(<Input className={` input-bg ${localStorage.getItem("theme") == 'dark' && "autofill_dark"}`} prefix={<LinkOutlined style={{ color: (localStorage.getItem("theme") == 'default' && 'rgba(0,0,0,.25)') }} />} />)}
                        </Form.Item>
                        <Form.Item label="Username" style={{color:(localStorage.getItem("theme") == 'dark' && "#ffffff")}} >
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: 'Please input Username!' }],
                            })(<Input className={` input-bg ${localStorage.getItem("theme") == 'dark' && "autofill_dark"}`} prefix={<UserOutlined style={{ color: (localStorage.getItem("theme") == 'default' && 'rgba(0,0,0,.25)') }} />} />)}
                        </Form.Item>
                        <Form.Item label="Password" style={{color:(localStorage.getItem("theme") == 'dark' && "#ffffff")}}>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: 'Please input your Password!' }],
                            })(
                                <Input
                                    prefix={<LockOutlined style={{ color: (localStorage.getItem("theme") == 'default' && 'rgba(0,0,0,.25)') }} />}
                                    type="password"
                                    placeholder="Password"
                                    className={"input-bg"}
                                />,
                            )}
                        </Form.Item>
                        {/* {console.log("server", server)} */}
                    </Form>
                </Modal>
                :
                <Modal
                    visible={visible}
                    // title="Jira Server/Data Center Connection"
                    title="Verify your Jira account"
                    okText="Connect"
                    onCancel={onCancel}
                    onOk={onCreate}
                    okButtonProps={{ disabled: this.hasErrors(getFieldsError()) }}
                    centered
                >
                    <Form layout="vertical">
                        {/* <Form.Item label="Jira Server Url" validateStatus={urlError ? 'error' : ''} >
            {getFieldDecorator('url', {
              rules: [{ required: true, message: 'Please enter valid url!', type: 'url' }],
            })(<Input prefix={<Icon type="link" style={{ color: 'rgba(0,0,0,.25)' }} />} />)}
          </Form.Item> */}
                        <Form.Item label="Username" style={{color:(localStorage.getItem("theme") == 'dark' && "#ffffff")}}>
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: 'Please input Username!' }],
                                initialValue: name
                            })(<Input className={"input-bg"} autoComplete={false} prefix={<UserOutlined style={{ color: (localStorage.getItem("theme") == 'default' && 'rgba(0,0,0,.25)') }} />} />)}
                        </Form.Item>
                        <Form.Item label="Password" style={{color:(localStorage.getItem("theme") == 'dark' && "#ffffff")}}>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: 'Please input your Password!' }],
                            })(
                                <Input
                                    prefix={<LockOutlined style={{ color: (localStorage.getItem("theme") == 'default' && 'rgba(0,0,0,.25)') }} />}
                                    type="password"
                                    placeholder="Password"
                                    className={"input-bg"}
                                />,
                            )}
                        </Form.Item>

                    </Form>
                </Modal>;
        }
    },
);

export default CollectionCreateForm;