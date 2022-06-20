import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  Modal,
  Select,
  Input,
  Button,
  Form,
  Alert,
} from "antd";
import "../createTeamsyncModalStyles.css"
import {addNextAnswerTeamsync,getEarlyNextTeamsyncAnswer} from "../../skills_action"
// import "./createTeamsyncModalStyles.css";
import _ from "lodash";
import moment from "moment-timezone"

const { Option } = Select;
const { TextArea } = Input;

class NextAnswer extends Component{
    constructor(props) {
        super(props);
        this.state = {
          
          progress_report:{},
          errors: {},
          usermood: null,
          loading: false,
          answerForDate:null,
      
         
        };
      }

         componentDidMount() {
        // console.log("pro team ins", this.props.projectTeamSyncInstance);
        //console.log("In teamSyncAnswerModal",this.props.userTeamSync)
      let {userTeamSync}=this.props
   
         this.props.getEarlyNextTeamsyncAnswer(userTeamSync.workspace_id._id?userTeamSync.workspace_id._id:userTeamSync.workspace_id,userTeamSync._id).then(res=>{
   
          if(res.success){
            if(res.response){
              let response=res.response
              let progress_report={}
              response.progress_report.forEach(el=>{
                if(el&&el.question&&el.question.id){
                  if(el.answer&&el.answer.plain_text){
                    progress_report[el.question.id]={answer:el.answer.plain_text}
                  }
                }
              })
              this.setState({progress_report})
              if(response.usermood){
                this.setState({usermood:+response.usermood})
              }
            }

if(res.jobRunAt){

  this.setState({answerForDate:res.jobRunAt})
}
         }
         }).catch(e=>{
           console.log(e)
         })

      }

      onSubmit = () => {
        const { progress_report,usermood } = this.state;
        const {userTeamSync}=this.props
        // this.setState({ loading: true });
        this.setState({ loading: true });
        let errors = {};
        
          let check = Object.values(progress_report).filter((val) => val&&val.answer&&val.answer.length > 0)
  
           if (check.length == 0) {
            errors.answer = true;
          this.setState({ loading: false,errors });
          return;
          }
        let answersArray=[]
        userTeamSync.multiple_question.forEach(que=>{
if(que&&que._id){
  if(progress_report[que._id]){
    answersArray.push({ question: { id: que._id }, answer: { plain_text:progress_report[que._id].answer}})
  }
  else{
    answersArray.push({ question: { id: que._id }})
  }       
}
        })

        let data={progress_report:answersArray}
        if(usermood){
          data.usermood=usermood
        }
        this.props.addNextAnswerTeamsync(userTeamSync.wId,userTeamSync._id,data).then(data=>{
      
          if(data.success){

        }
        else{

        }
        this.setState({loading:false,errors:false})
        this.props.handleCancel()
        })
        // this.setState(
        //   { errors },
        //   () => _.isEmpty(this.state.errors)
        // );
      };
    
    handleMoodChange = (value) => {
        this.setState({ usermood: value });
      };

      onAnswerChange = (event, questionId) => {
        let progress_report = {...this.state.progress_report}
        let value = event.target.value;
        if(progress_report[questionId]){
          progress_report[questionId].answer=value
        }
        else{
          progress_report[questionId]={}
          progress_report[questionId].answer=value
        }
        this.setState({ progress_report }, () => {
          if (this.state.errors.answer && value.length > 0) {
            let errors = this.state.errors;
            errors.answer = false;
            this.setState({ errors,loading:false });
          }
        });
      };

render(){
    const ModalBodyStyle = {maxHeight: "70vh",wordBreak:'break-word', overflowY: "scroll",overflowX:'hidden'}
const {userTeamSync}=this.props

 return (
     <Modal
       bodyStyle={ ModalBodyStyle }
       visible={this.props.nextAnswerModalVisible}
       // visible={true}
       onCancel={this.props.handleCancel}
       title={userTeamSync.name}
       footer={[
         <>
           <Button onClick={this.props.handleCancel}>Cancel</Button>
           <Button
             key='submit'
             type='primary'
             loading={this.state.loading}
             onClick={this.onSubmit}
           >
             Submit
         </Button>
         </>,
       ]}
       centered
     >
       {
       <Form className='answer-modal'>
         {this.state.errors.answer && (
           <Alert
             type='error'
             message={
               <span className='empty-alert-text'>
                 Answer can't be empty. Answer atleast one question.
             </span>
             }
             style={{ textAlign: "center" }}
           />
         )}
          {this.state.answerForDate && (
           <Alert
             type='info'
             message={
               <span className='empty-alert-text'>
                 {`This Check-in answer will be used for ${moment(this.state.answerForDate).format('MMM Do YY')}`}
             </span>
             }
             style={{ textAlign: "center" }}
           />
         )}
         {(userTeamSync.standuptype == "dailystandup" || userTeamSync.standuptype == "Daily Standup") &&
           userTeamSync.moodquestion !== "none" && userTeamSync.moodquestion !== "None" && (
             <Form.Item>
               <div className='question-text' style={{ marginTop: "0px" }}>
                 {userTeamSync.moodquestion}{" "}
                 {(userTeamSync.standuptype=="dailystandup" || userTeamSync.standuptype=="Daily Standup" ) &&<span className='optional-text'>(optional)</span>}
               </div>
               {userTeamSync.customEmoji&&userTeamSync.customEmoji.length!=0?(
                 <Select
                 placeholder='Select'
                 onChange={this.handleMoodChange}
                 value={this.state.usermood}
               >
                 <Option value={1} key={1}>
                   {userTeamSync.customEmoji[0].emoji+ " " + userTeamSync.customEmoji[0].text }
               </Option>
                 <Option value={2} key={2}>
                 {userTeamSync.customEmoji[1].emoji+ " " + userTeamSync.customEmoji[1].text }
               </Option>
                 <Option value={3} key={3}>
                 {userTeamSync.customEmoji[2].emoji+ " " + userTeamSync.customEmoji[2].text }
               </Option>
                 <Option value={4} key={4}>
                 {userTeamSync.customEmoji[3].emoji+ " " + userTeamSync.customEmoji[3].text }
               </Option>
                 <Option value={5} key={5}>
                 {userTeamSync.customEmoji[4].emoji+ " " + userTeamSync.customEmoji[4].text }
               </Option>
               </Select>
               )
             : userTeamSync.standuptype=="team_mood_standup"?(
               <Select
               placeholder='Select'
               onChange={this.handleMoodChange}
               value={this.state.usermood}
             >
               <Option value={1} key={1}>
                 🤩 Rad
               </Option>
               <Option value={2} key={2}>
                 🙂 Good
               </Option>
               <Option value={3} key={3}>
                 😐 Meh
               </Option>
               <Option value={4} key={4}>
                 🥵 Exhausted
               </Option>
               <Option value={5} key={5}>
                 🙁 Awful
               </Option>
             </Select>
             )
           :(<Select
             placeholder='Select'
             onChange={this.handleMoodChange}
             value={this.state.usermood}
           >
             <Option value={1} key={1}>
               🤩 Excellent
           </Option>
             <Option value={2} key={2}>
               🙂 Good
           </Option>
             <Option value={3} key={3}>
               😐 Average
           </Option>
             <Option value={4} key={4}>
               🥵 Exhausted
           </Option>
             <Option value={5} key={5}>
               🙁 Bad
           </Option>
           </Select>
           )}
             </Form.Item>
           )}
         {
           userTeamSync&&userTeamSync.multiple_question&&userTeamSync.multiple_question.map((question, index) => {
             return (
               <Form.Item key={index}>

                 <div
                   className='question-text'
                //    style={{
                //      marginTop:
                //        userTeamSync.standuptype != "dailystandup" &&
                //        userTeamSync.standuptype != "Daily Standup" && 
                //        userTeamSync.standuptype!= "team_mood_standup" &&
                //        index == 0 &&
                //        "0px",
                //    }}
                 >
                   {question.question_text}{" "}
                   <span className='optional-text'>(optional)</span>
                 </div>
                 <TextArea
                   // autoFocus={index == 0 && true}
                   placeholder='Write something'
                   value={this.state.progress_report[question._id]?this.state.progress_report[question._id].answer:""}
                   onChange={(event) => this.onAnswerChange(event, question._id)}
                   rows={3}
                 />
               </Form.Item>
             );
           })}
       </Form>
       }
      
      
     </Modal>
 )   


}
}

const mapStateToProps = (state) => ({
    
  });
export default withRouter(connect(mapStateToProps, {addNextAnswerTeamsync,getEarlyNextTeamsyncAnswer
  })(NextAnswer)
);



