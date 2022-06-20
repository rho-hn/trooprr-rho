import React,{useState,useEffect} from 'react'
import { Modal, Steps, List, Select, Typography, Button, Input, Alert } from "antd"
import { useSelector, useDispatch } from 'react-redux';
import { getChannelList, getChannelMembersofSlack, sendUserMappingReminder, getRecentRemindersToUsers } from '../skills_action';
import moment from "moment-timezone"
import "./usermappingchannelreminder.css"
import { withRouter } from 'react-router';
const { Step } = Steps;
const { Title,Text } = Typography;
const {Option}=Select
const UserMappingChannelReminder = (props) => {
    const dispatch=useDispatch()
    const [showModal, setShowModal] = useState(false)
  
    const [channelLoading,setChannelLoading]=useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const channels = useSelector(store => store.skills.channels)
    const [selectedChannel, setSelectedChannel] = useState({})
    const [customText, setCustomText] = useState("Let's make this happen!")
    const [showPreviewText, setShowPreviewText] = useState("")
    const [reminderCount, setReminderCount] = useState("")
    const [showError, setShowError] = useState(false)
    const [hasNextCursor,setHasNextCusror]=useState(false)
    useEffect(() => {
        if (channels&&channels.length === 0) {
           
           dispatch(getChannelList(props.match.params.wId))
        }
    },[])

    useEffect(() => {
     
        dispatch(getRecentRemindersToUsers(props.match.params.wId, "user_mapping_reminder"))
    }, [showModal])

    const nextStep = async() => {
        if (currentStep == 2) {
            let sendReminders = await dispatch(sendUserMappingReminder(props.match.params.wId, selectedChannel.selectedChannel, { text: customText, isChannel: true, channelName: selectedChannel.selectedChannelName }))
        setReminderCount(sendReminders&&sendReminders.reminderCount)
            setCurrentStep(currentStep + 1)
        }
        else if (currentStep == 1) {
            if (!(selectedChannel && selectedChannel.selectedChannel)) {
                setShowError(true)
            }
            else {
                setCurrentStep(currentStep + 1);
            }
        }
        else {
            setCurrentStep(currentStep + 1);
    }
           
        
       
    };

    const prevStep = () => {
      setCurrentStep(currentStep - 1);
    };



    const recent_reminders_data = useSelector(store => store.skills.recent_reminders)

    const onChangeChannel = async(value, event) => {
        setChannelLoading(true)
        setShowPreviewText("")
        setShowError(false)
        let data = await dispatch(getChannelMembersofSlack(props.match.params.wId, value))
        if (data.success && data.membersText) {
            setShowPreviewText(data.membersText)
            setHasNextCusror(data.hasNextCursor?true:false)
        }
       setChannelLoading(false)
       setSelectedChannel({
            selectedChannel: value,
            selectedChannelName: event.props.children
        });
    }

   

    const reminders_steps = [
        {
            title: 'Recent Reminders',
            content: (<div ><List
            
                bordered
                dataSource={recent_reminders_data}
                renderItem={item => (
                    <List.Item>
                        {/* Sent Reminder to Raj, #channel1 & 99 others on NOV 20 at 10AM PST */}
                        {(item && item.channel && item.channel.channelName) ? `Sent Reminder to #${item.channel.channelName} channel members on ${moment.utc(item.createdAt).local().format('MMMM Do YYYY, h:mm a')}` : `Sent Reminder to @${item && item.userInfo && item.userInfo.name} on ${moment.utc(item.createdAt).local().format('MMMM Do YYYY, h:mm a')}`}
                    </List.Item>
                )}
            /><div style={{ marginTop: 16 }}>Please be mindful of frequent reminders. Click "Next" to proceed.</div>
            </div>),
        },
        {
            title: 'Choose Channel',
            content: (<div>
                <Title level={5}>Choose a channel to send reminder(s) to its members</Title>
                {showError && <div style={{color:"red",textAlign:"left  "}}>* Please Select a Channel</div>}
                <Select
                    loading={channelLoading}
                    showSearch
                    placeholder="Select Channel"
                    style={{ width: "100%" }}
                    value={selectedChannel&&selectedChannel.selectedChannel}
                    onChange={onChangeChannel}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {

                        channels&&channels.map((channel, index) => (
                            <Option
                                key={channel.id}
                                value={channel.id}
                                name={channel.name}
                            >
                                {channel.name}
                            </Option>
                        ))
                    }
                </Select>
              
                {showPreviewText && <div><br /><Text>{showPreviewText} <br />Click "Next" to see preview of the reminder message.</Text></div>}
                <br />
                {hasNextCursor && <Alert message="Please pick a channel that has fewer than 1000 members. If you proceed Troopr will send reminders to unverified users from the first 1000 members only." type="warning" />}
         </div>       
                    
        )},
        {
            title: 'Preview',
            content: (
                <>
               
                    <div>
                        <Text strong>Message Preview</Text>
                        <br />
                        <div style={{
                            textAlign: "left", width: 400, border: "1px solid lightgray", padding: 8,
                            // boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);"
                        }}>
                            <span>
                                <a>@{props.user.displayName||props.user.name}</a> wants you to verify your Jira account in
                                <a>@troopr</a>. Click on the <b>Verify</b> button below and then "
                                <b>Allow</b>" access when prompted.
                            </span>
                            <br />
                            <Text type="secondary">
                                Message from {props.user.displayName || props.user.name}: {customText}
                            </Text>
                            <br />
                            <Button>Verify</Button>
                        </div>
                        <br />

                        <Text strong>Type your custom note to user(s) here</Text>
                        <br />
                        <Input value={customText} onChange={(e)=>setCustomText(e.target.value)} />
                        <br />
                        <br />
                    </div>
                </>
            ),
        },
        {
            title: 'Confirmation',
            content: `Reminder sent to ${reminderCount} users!`,
        },
    ];


    const handleOk = async () => {
        // setLoading(true)
        // // let userMappingReminder = await dispatch(sendUserMappingReminder(props.match.params.wId, user ? user._id : user, { text: reminderText }))
        // setLoading(false)
        setShowModal(false)
        
    }
    const handleCancel = () => {
        setShowModal(false)
        setCurrentStep(0)
        setChannelLoading(false)
        setSelectedChannel({})
        setCustomText("Let's make this happen!")
        setShowPreviewText("")
        setHasNextCusror(false)
        setReminderCount("")
        setShowError(false)
    }

    return (
        <div>
            <Button type="secondary" onClick={()=>setShowModal(true)}>Remind all unverified users</Button>
            <Modal title="Send Reminder" visible={showModal} onOk={handleOk} onCancel={handleCancel}
            
                // okText={ }
                closable={true}
                footer={null}
                width={800}
                maskClosable={false}
        
            
            >
                <>
                    <div style={{ marginTop: 16 }}>
                        <Steps current={currentStep}>
                            {reminders_steps.map((item) => (
                                <Step key={item.title} title={item.title} />
                            ))}
                        </Steps>
                        <div className="steps-content" style={{ minHeight: 400, display: "flex", justifyContent: "center", alignItems: "center", padding: 32 }}>
                            {reminders_steps[currentStep].content}
                        </div>
                        <div className="steps-action">
                            {currentStep <
                                reminders_steps.length - 1 && (
                                    <Button
                                        type="primary"
                                    onClick={() => nextStep()}
                                    // disabled={channelLoading ? true : false}
                                    loading={channelLoading ? true : false}
                                    >
                                        {currentStep ===
                                            reminders_steps.length - 2 ? "Send Reminders" : "Next"}
                                    </Button>
                                )}
                            {currentStep ===
                                reminders_steps.length - 1 && (
                                    <Button
                                        type="primary"
                                    onClick={() => {
                                        
                                        setShowModal(false)
                                        setCurrentStep(0)
                                        setChannelLoading(false)
                                        setSelectedChannel({})
                                       setCustomText("Lets make this happen!")
                                       setShowPreviewText("")
                                       setHasNextCusror(false)
                                        setReminderCount("")
                                        }}
                                    >
                                        Done
                                    </Button>
                                )}
                            {currentStep> 0 && currentStep <
                                reminders_steps.length - 1 && (
                                    <Button
                                        style={{ margin: '0 8px' }}
                                    onClick={() => prevStep()}
                                    disabled={channelLoading ? true : false}
                                    
                                    >
                                        Previous
                                    </Button>
                                )}
                        </div>
                    </div>
                </>
            </Modal>
        </div>
    )
}

export default withRouter(UserMappingChannelReminder)
