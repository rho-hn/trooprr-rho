import React,{useState} from 'react'
import { Modal, Typography, Button, Input } from "antd"
import { useDispatch, useSelector } from "react-redux"
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { sendUserMappingReminder } from '../skills_action'

const {Text}=Typography
const reminderInitialText ="Lets make this happen!"
const UserMappingReminder = (props) => {
    const { record, user } = props
    const [reminderText, setReminderText] = useState(reminderInitialText)
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(false)
   
    const dispatch=useDispatch()
    const handleOk = async() => {
        setLoading(true)
        
    
        let userMappingReminder = await dispatch(sendUserMappingReminder(props.match.params.wId,record&&record.user_id&&record.user_id.user_id, { text:reminderText}))
        setLoading(false)
        setShowModal(false)
        setReminderText(reminderInitialText)
    }
    const handleCancel = () => {
        setShowModal(false)
        setReminderText(reminderInitialText)
    }
 
    return (
        <>
            <a onClick={()=>setShowModal(true)}>Remind</a>
            <Modal title="Send Reminder" visible={showModal} onOk={handleOk} onCancel={handleCancel}
            
                footer={[<Button key="back" onClick={handleCancel}>
            Cancel
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
                Submit
                    </Button>]
            
        }
                  
            
            >
      <>
                            <span>
                                This action will let Troopr send a private Slack
                                message to {(record && record.user_obj && record.user_obj.displayName) || (record && record.user_id && record.user_id.name)}  asking them to verify their Jira
                                account.
                            </span>
                            <br />
                            <br />
                            <Text strong>Message Preview</Text>
                            <br />
                            <span>
                                <a>@{user.displayName ||user.name}</a> wants you to verify your Jira account in
                                <a> @troopr</a>. Click on the <b>Verify</b> button
                                below and then "<b>Allow</b>" access when prompted.
                            </span>
                            <br />
                            <Text type="secondary">
                                Message from {user.displayName ||user.name}: {reminderText}
                            </Text>
                            <br />
                            <Button>Verify</Button>
                            <br />
                            <br />
                            <Text strong>
                                Type your custom note to user(s) here
                            </Text>
                            <br />
                            <Input value={reminderText} onChange={(e) => setReminderText(e.target.value)} />
                        </>
      </Modal>

</>
      
    )
}

export default withRouter(UserMappingReminder)
