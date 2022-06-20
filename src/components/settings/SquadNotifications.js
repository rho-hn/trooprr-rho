class SquadNotifications extends Component {

    constructor(props) {
      super();
      this.state = {
        loading: true,
        isProfileView: true,
        assistant_name: "Troopr Assistant",
        team: {},
        skills: [],
        defaultSkill: "",
        nameLoading: false,
        defaultLoading: false,
        settings_currentTab,
        channelNotifFreq: 1,
        notifEvents: "important_updates",
        skill: {},
        profileName: '',
        timeZone: '',
        offsetObj: {},
        showWorkspacesName: false,
        projects: [],
        showProjectsName: false,
        workspaces: [],
        showWorkspacesName: false,
        showDeleteAccountModal: false,
        workspaceName: '',
        leavemodal: false,
        profileNameChanged: false,
        profileTimezoneChanged: false,
        timeZoneValue: '',
        workspaceTimezoneChanged: false,
        workspaceNameChanged: false,
        status: true,
        check: false,
        isAdmin: false
      };
  
      this.checkForAdmin = this.checkForAdmin.bind(this);
      this.leaveWorkspace = this.leaveWorkspace.bind(this);
  
    }

handleNotificationDisable = () => {
    this.setState({ status: !this.state.status, check: true })
}

saveConfigs = values => {
    let frequency = values.notification.frequency
    let event_type = values.notification.events
    let freqChanged = (values.notification.frequency !== this.state.channelNotifFreq)
    let evtChanged = (values.notification.events !== this.state.notifEvents)

    if (!freqChanged && !evtChanged && !this.state.check) {
      message.info({ content: `No change to notification configuration found.` })
    } else {
      let data = {
        channel_id: this.props.channelDefaultId,
        frequency,
        event_type,
        skill_id: this.state.skill._id,
        workspace_id: this.props.match.params.wId,
        user_id: this.props.user_id,
        is_bot_channel: true,
        status: this.state.status
      }
      this.props.saveDataTrooprConfigs(this.props.match.params.wId, data)
        .then(() => {
          message.success({ content: "Notification preference updated successfully" })
          this.setState({
            channelNotifFreq: frequency,
            notifEvents: event_type
          })
        })
    }
  }

    
    render(){
        return(
            <Layout
                style={{ marginLeft: 0,
                   height: "100vh" }}
            >
            <Fragment>
                <PageHeader
                  title="Slack Notifications"
                  extra={<Switch /*style={{marginLeft:"153px"}}*/ style={{marginTop:'inherit'}}  checked={this.state.status} onClick={this.handleNotificationDisable} />}
                  style={{ maxWidth: 'fit-content'}}
                  subTitle={`Squad Personal Notification directly to your Slack Bot`}
                />
                <Layout style={{
                  padding: "16px 16px 32px 24px",
                  // background: (localStorage.getItem('theme') == 'default' ? "#ffffff" : "rgba(15,15,15)") 
                }} >
                  {/* <p >Squad Personal Notification directly to your Slack Bot</p> */}
                  <Row className='content_row'>
                    <Col span={24}>
                      <Card size='small' title='Slack Notifications'>
                    {!this.state.loading && <Form
                      autocomplete="off"
                      ref={this.formRef}
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 14 }}
                      name="userProfileForm"
                      hideRequiredMark={true}
                      initialValues={{
                        notification: {
                          frequency: this.state.channelNotifFreq,
                          events: this.state.notifEvents
                        },
                      }}
                      onFinish={this.saveConfigs}
                    >
                      <Form.Item labelAlign="left" label="Frequency" name={['notification', 'frequency']}>
                        <Select
                          // disabled={!this.state.notifStatus}
                          // name="projectNotif"
                          // style={{ width: "200px" }}
                          // value={this.state.channelNotifFreq}
                          placeholder="Select Frequency"
                          disabled={!this.state.status}
                        // onChange={this.onChangeFrequency}
                        style={{width:300}}
                        >
                          {ChannelFrequency.map((project, index) => (
                            <Option key={project.value} value={project.value}>
                              {project.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item labelAlign="left" label="Events" name={['notification', 'events']}>
                        <Select
                          placeholder="Select Event"
                          // onChange={this.handleChange}
                          // style={{ width: "300px" }}
                          // value={this.state.notifEvents}
                          defaultValue={notifEvent[0].name}
                          disabled={!this.state.status}
                          showSearch
                        style={{width:300}}
                        >
                          {notifEvent.map((project, index) => (
                            <Option key={project.value} value={project.value}>
                              {project.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item wrapperCol={{ span: 12, offset: 4 }} shouldUpdate={true}>
                        {() => (<Button
                          type="primary"
                          htmlType="submit"
                          disabled={
                            this.formRef &&
                            this.formRef.current &&
                            (!this.formRef.current.isFieldsTouched(false) ||
                              this.formRef.current.getFieldsError()
                                .filter(({ errors }) => errors.length).length) && (!this.state.check)
                          }
                        // onClick={this.saveConfigs}
                        >Save</Button>
                        )}
                      </Form.Item>
                    </Form>}
                    </Card>
                    </Col>
                  </Row>
                  <p ><a href="/" onClick={this.jiraNotification}>Jira Notification click here</a></p>
                </Layout>
              </Fragment>
              </Layout>
        )
    }
}
const mapStateToProps = state => {
    // console.log("REDUX UPD!")
    return {
      channelDefaultId: state.skills.personalSetting.id,
      user_now: state.common_reducer.user,
      user_name: state.common_reducer.user.name,
      user_id: state.common_reducer.user._id,
      user_timezone: state.skills.user.timezone,
      // workspace: state.skills.workspace,
      workspace_timezone: state.common_reducer.workspace.timezone,
      members: state.skills.members,
      workspace_name: state.common_reducer.workspace.name,
      workspace: state.common_reducer.workspace,
      // skills: state.skills
      // profilePic:state.common_reducer.user.profilePicUrl
    }
  }
  
  export default withRouter(
    connect(mapStateToProps, {
      personalSetting, leaveWorkspace, updateWorkspace, deleteAccount, saveDataTrooprConfigs, getSkillId, getTrooprUserChannelConfig, updateUserInfo,
      // getProfileinfo, 
      updateUserWorkspaces, getWorkspaceMembers, getWorkspace, deleteWorkspaceMember, updateMembership, sendWorkspaceInvite
    })(SquadNotifications)
  )  