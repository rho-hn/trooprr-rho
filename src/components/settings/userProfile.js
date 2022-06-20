import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import axios from "axios";
import ImgCrop from 'antd-img-crop';

import {
  DownOutlined,
  MailOutlined,
  LoadingOutlined,
  PlusOutlined 
} from '@ant-design/icons';

import {
  PageHeader,
  Tabs,
  Typography,
  Button,
  Select,
  message,
  Layout,
  Menu,
  Row,
  Col,
  Divider,
  Input,
  List,
  Avatar,
  Dropdown,
  Form,
  Alert,
  Modal,
  Upload,
  Card,
  Collapse,
  Space
} from "antd";

import {
  updateUserInfo,
} from "../skills/skills_action";
import { setUser } from "../common/common_action";
import { ThemeProvider, useTheme } from 'antd-theme';

const {Content} = Layout
const { Title, Text } = Typography;
const isValidProfileName = id => (id && (id.length >= 3)) //TODO:improve this validation

const Theme = () => {

  let initialTheme = {
    name: localStorage.getItem("theme"),
    // variables: { 'primary-color': '#664af0' }
    variables: { 'primary-color': localStorage.getItem("theme") == "dark" ? "#664af0" : "#402E96" }
  };

  const [theme, setTheme] = React.useState(initialTheme);
  return (
    <ThemeProvider
      theme={theme}
      onChange={(value) => { setTheme(value)}}
    >
      <ThemeSelect />
    </ThemeProvider>
  );
};
const ThemeSelect = () => {
  const [{ name, variables,themes }, setTheme] = useTheme();
  return (
    <>
      {/*<PageHeader title='Appearance' />*/}
      {/*<Content
        // style={{
        //   padding: "16px 0 0 24px",
        //   background: (localStorage.getItem('theme') == 'default' ? "#ffffff" : "rgba(15,15,15)")
        // }}
        style={{ padding: "0px 16px 32px 24px" }}
      >
        <Row className='content_row' gutter={[0, 16]}>
      
      <Col span={24}>*/}
            <Collapse defaultActiveKey="1" >
              <Collapse.Panel
              className='collapse_with_action'
                header='Theme'
                key='1'
                extra={
                  <Select
                    style={{ width: 100 }}
                    value={name}
                    onClick={event => {
                      event.stopPropagation();
                    }}
                    onChange={
                      (theme) => {
                        localStorage.setItem("theme", theme);
                        setTheme({ name: theme, variables: { "primary-color": localStorage.getItem("theme") == "default" ? "#402E96" : "#664af0" } });
                      }
                      // (theme) => {ThemeSelect()}
                    }
                  >
                    {themes.map(({ name }) => (
                      <Select.Option key={name} value={name}>
                        {/* {name}{console.log('names',name)} */}
                        {name == "dark" ? "Dark" : "Default"}
                      </Select.Option>
                    ))}
                  </Select>
                }
              >
                <Text type='secondary'>Customize how Troopr looks for you</Text>
              </Collapse.Panel>
            </Collapse>
          
        {/* <div>
          <Form
            autocomplete="off"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            name="userProfileForm"
            hideRequiredMark={true}
          >
            <Form.Item labelAlign="left" label="Select a Theme">
              <Select
                style={{ width: 200 }}
                value={name}
                onChange={
                  (theme) => {localStorage.setItem("theme", theme);setTheme({ name: theme, variables: { 'primary-color': localStorage.getItem("theme") == "default" ?  "#402E96": "#664af0" }
                })}
                  // (theme) => {ThemeSelect()}
                }
              >
                {
                  themes.map(
                    ({ name }) => (
                      <Select.Option key={name} value={name}>
                        {name == "dark" ? 'Dark': 'Default'}
                      </Select.Option>
                    )
                  )
                }
              </Select>
            </Form.Item>
          </Form>
        </div> */}
      
    </>
  );
};



class UserProfile extends Component {

  constructor(props) {
    super();
    this.state = {
      loading: false,
      upLoading: false
    }
  }

  
  onProfileNameChange = event => {
    this.props.user_name = event.target.value
    this.setState({ profileName: event.target.value, profileNameChanged: true })
  }

  handleNameSubmit = values => {
    // console.log("handleNameSubmit:values: ",values)
    let newProfileName = values.user.name.trim()
    let profileNameChanged = (values.user.name.trim() !== this.props.user_name)
    const { updateUserInfo } = this.props;
    // const { offsetObj, timeZone } = this.state;
    // console.log("!profileNameChanged:", !profileNameChanged)
    // console.log("isValidProfileName(newProfileName):", isValidProfileName(newProfileName))
    !profileNameChanged && message.info({ content: `Profile name not changed` })
    !isValidProfileName(newProfileName) && message.error({ content: `Profile name invalid.` })
    if (profileNameChanged && isValidProfileName(newProfileName)) {
      // console.log("updateUserInfo...")
      updateUserInfo({
        name: newProfileName
      }).then(res => {
        res.data.success && message.success({ content: "Profile updated successfully" })
        !res.data.success && message.error({ content: `Something went wrong! ${res.data.errors}` })
      }).catch(err => console.error(err))
    }
   
    // updateUserInfo({ timezone: timeZone }).then(res => {
    //   this.setState({ timeZone: this.props.user_timezone })
    // })

  }

  formRef = React.createRef();

  onStart = file => {
    // console.log('onStart', file, file.name);
    this.setState({
      upLoading: true,
    })
  }

  onSuccess = (ret, file) => {
    // console.log('onSuccess', ret, file.name);
    this.setState({
      // imageUrl: ret.user.profilePicUrl,
      upLoading: false,
    })
    // this.props.getProfileinfo() 
    this.props.setUser(ret.user)
  }

  render() {

    let wId = this.props.match.params.wId
    let isChanged = this.state.profileNameChanged || this.state.profileTimezoneChanged
    const {members,user_now} = this.props
    // console.log("this.props.user_name: ",this.props.user_name)

    // let uploadProps = {
    //   action: 'https://app-stage.troopr.io/api/profilepic',
    //   listType: 'picture',
    //   previewFile(file) {
    //     console.log('Your upload file:', file);
    //     // Your process logic. Here we just mock to the same file
    //     return fetch('https://next.json-generator.com/api/json/get/4ytyBoLK8', {
    //       method: 'POST',
    //       body: file,
    //     })
    //       .then(res => res.json())
    //       .then(({ thumbnail }) => thumbnail);
    //   },
    // };

    const uploadProps = {
      name:"avatar",
      listType:"picture-card",
      className:"avatar-uploader",
      showUploadList: false,
      action: '/api/profilepic',
      multiple: false,
      // onChange:this.handleChange,
      // data: { a: 1, b: 2 },
      // headers: {
      //   Authorization: '$prefix $token',
      // },
      onStart: this.onStart,
      onSuccess: this.onSuccess,
      onError(err) {
        console.error('onError', err);
      },
      onProgress({ percent }, file) {
        // console.log('onProgress', `${percent}%`, file.name);
      },
      customRequest({
        action,
        data,
        file,
        filename,
        headers,
        onError,
        onProgress,
        onSuccess,
        withCredentials,
      }) {
        const formData = new FormData();
        // if (data) {
        //   Object.keys(data).forEach(key => {
        //     formData.append(key, data[key]);
        //   });
        // }
        formData.append("file", file);
        formData.append("name", filename);
    
        axios
          .post(action, formData, {
            withCredentials,
            headers,
            onUploadProgress: ({ total, loaded }) => {
              onProgress({ percent: Math.round(loaded / total * 100).toFixed(2) }, file);
            },
          })
          .then(({ data: response }) => {
            onSuccess(response, file);
          })
          .catch(onError);
    
        return {
          abort() {
            console.info('upload progress is aborted.');
          },
        };
      },
    };

    const uploadButton = (
      <div>
        {this.state.upLoading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const imageUrl = this.props.user_now.profilePicUrl
    // console.log("new imageUrl:", imageUrl)
    const user_data = members && members.find(mem => mem.user_id && mem.user_id._id === user_now._id)
    return (
      <Fragment >

<>
        <PageHeader title="My Profile" 
          subTitle="Profile name and picture are synced from Slack"

        />
        <Content
          className="site-layout-background"
          style={{ padding: "16px 16px 32px 24px", overflow: "scroll" }}
        >
          <Row className='content_row' gutter={[0, 16]}>
            <Col span={24}>
            <Card style={{ width: "100%" }}>
            {this.props.user_name && <Form
              autocomplete="off"
              ref={this.formRef}
              labelCol={{span:4}}
              wrapperCol={{span: 14}}
              name="userProfileForm"
              hideRequiredMark={true}
              initialValues={{
                user: {
                  // name: this.props.user_name,
                  // name: user_data && (user_data.user_id.displayName || user_data.user_id.name)
                },
              }}
              onFinish={this.handleNameSubmit}
            >
              {/* <Form.Item labelAlign="left" rules={[{ min: 3, required: true }]}>
                <Input disabled value={user_data && (user_data.user_id.displayName || user_data.user_id.name)}/>
              </Form.Item> */}
              <Space direction="vertical" size="small">
              <Title>{user_data && (user_data.user_id.displayName || user_data.user_id.name)}</Title>
              <Text  type="secondary">Account Email</Text>
              <Text >{user_data && user_data.user_id.email}</Text>
              </Space>

              {/* <Form.Item shouldUpdate={true}>
                {() => (<Button
                    htmlType="submit"
                    disabled={
                      this.formRef &&
                      this.formRef.current &&
                      (!this.formRef.current.isFieldTouched(['user', 'name']) ||
                        this.formRef.current.getFieldsError()
                          .filter(({ errors }) => errors.length).length)
                    }
                    type="primary">Save</Button>
                )}
              </Form.Item> */}
              </Form>}
            </Card>
            </Col>
            {/* <Col span={24}>
              <Card title="Profile picture" style={{ width: "100%" }} size="small">
              {this.props.user_name && <ImgCrop rotate>
                  <Upload {...uploadProps}>
                    {imageUrl ? <img src={`${imageUrl}?_=${(new Date()).getTime()}`} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                  </Upload>
                </ImgCrop>}
              </Card>
            </Col> */}
            <Col span={24}>
              <Theme/>
            </Col>
          </Row>
        </Content>
      </>
        
        <Modal
          title={
            <div>
              Delete your Troopr account?<br />
              This action can not be undone
            </div>
          }
          visible={this.state.showDeleteAccountModal}
          onOk={this.removeAccount}
          onCancel={this.toggleDeleteAccount}
          okText='Delete'
        >
          <div>
            On deleting account ,the following data will be deleted forever
          </div>
          <div >
            <div>Email</div>
            <div >Profile Picture</div>
            <div >Likes and Comments</div>
            <div >My tasks</div>
            <div >Standup Responses</div>
          </div>
          <div >
            Queries? Please reach out to support@troopr.io
  </div>
        </Modal>
        
      </Fragment>
    )
  }
}

const mapStateToProps = store => {
  return {
    user_now: store.common_reducer.user,
    user_name: store.common_reducer.user.name,
    user_timezone: store.skills.user.timezone,
    members: store.skills.members,
    // workspace_name: store.common_reducer.workspace.name,
    // workspace: store.common_reducer.workspace
  }
}

export default withRouter(
  connect(mapStateToProps, {
    updateUserInfo,
    setUser,
  })(UserProfile)
)


{/* <PageHeader title="My Profile" />
{this.props.user_name && <Content style={{ padding: "16px 16px 32px 24px"
// background: (localStorage.getItem('theme') == 'default' ? "#ffffff" : "rgba(15,15,15)")
  }} >
  <div style={{ maxWidth: "500px" }}>
    <Form
      autocomplete="off"
      ref={this.formRef}
      labelCol={{span:4}}
      wrapperCol={{span: 14}}
      name="userProfileForm"
      hideRequiredMark={true}
      initialValues={{
        user: {
          name: this.props.user_name,
        },
      }}
      onFinish={this.handleNameSubmit}
    >
      <Form.Item labelAlign="left" label="Full Name" name={['user', 'name']} rules={[{ min: 3, required: true }]}>
        <Input/>
      </Form.Item>
      <Form.Item labelAlign="left" label="Profile Pic" name={['user', 'pic']}>
        <ImgCrop rotate>
          <Upload {...uploadProps}>
            {imageUrl ? <img src={`${imageUrl}?_=${(new Date()).getTime()}`} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
          </Upload>
        </ImgCrop>
      </Form.Item>
      <Form.Item wrapperCol={{ span: 12, offset: 4 }} shouldUpdate={true}>
        {() => (<Button
            htmlType="submit"
            disabled={
              this.formRef &&
              this.formRef.current &&
              (!this.formRef.current.isFieldTouched(['user', 'name']) ||
                this.formRef.current.getFieldsError()
                  .filter(({ errors }) => errors.length).length)
            }
            type="primary">Save</Button>
        )}
      </Form.Item>

      
      {/* <Upload                              
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="https://app-stage.troopr.io/api/profilepic"
        // beforeUpload={beforeUpload}
        onChange={this.handleChange}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload> */}
      {/* </Col> */}
      {/* <Row > */}
      {/* <Col span={8}> */}
      {/* <span style={{ padding: "6px",marginLeft:'16px' }}>Timezone</span> */}
      {/* </Col> */}
      {/* </Row> */}
      {/* <Col span={12}> */}
      {/* <Select
        showSearch
        // size="small"
        value={this.state.timeZone}
        // defaultValue='Select timezone'
        style={{ width: "25%" ,marginBottom:'16px',marginLeft:'20px'}}
        onChange={this.timeZoneChange}
      >
        {
          TimeZones.map((item, index) => {
            return <Option key={index} value={item}>{item}</Option>
          })
        }
      </Select> */}
      {/* <Button style={{ marginTop: '16px' }} onClick={this.onTimezoneChange}>Save</Button> */}
      {/* </Col> */}

    // </Form>
    // <Row>
      {/* <Col span={24}>
      <Divider />

      <Title level={4}>Danger Zone</Title>
    </Col> */}
      // <Col span={8}>
        {/* ////Delete Start/////////////////////////////////////////////////////////////////////////////////////// */}
        {/* <Button type="danger">Delete My Account</Button> */}


        {/* {this.state.showWorkspacesName ||
        this.state.showProjectsName ? (
          <Button type='danger' className="d-flex justify-content-center   btn_114">
            Delete
          </Button>
        ) : (
          <Button
            type='danger'
            className="d-flex justify-content-center  proj-setting-common-pointer btn_114"
            onClick={this.checkForAdmin}
          >
            Delete
          </Button>
        )} */}



        {/* Delete end ////////////////////////////////////////////////////////////////////////////////////////////// */}
      // </Col>
      // <Col span={16}>


        {/* ////start/// */}
        {/* {this.state.showWorkspacesName && (
          <Alert
            message="Cannot delete account"
            description={
              <div>
                <div>
                  You are the sole admin in the following workspaces:{" "}
                  {this.state.common_reducers.map(workspace => (
                    <span className="single-admin-item-name">
                      {workspace.name}{' '},
              </span>
                  ))}
                </div>
                <div>
                  Delegate the Admin role or delete the workspaces before
                  deleting account. If you need help, please email us at
                  support@troopr.io
            </div>
              </div>
            }
            type="error"
          />


        )} */}
        {/* ////end/// */}

        {/* /////////start */}
//         {this.state.showProjectsName && (
//           <Alert
//             message='You are alone admin of these Squads'
//             description={
//               <div>
//                 {this.state.projects.map(project => (
//                   <span className="single-admin-item-name">
//                     {project.name}
//                   </span>
//                 ))}{" "}
//                 <div>
//                   Please delegate admin role before deactivating your account.
//               </div>
//               </div>
//             }
//             type='error'
//           />
//         )}
//         {/* //// end */}
//       </Col>
//       {/* </Col> */}
//       <Col span={8} />
//     </Row>

//   </div>
// </Content >
// } */}