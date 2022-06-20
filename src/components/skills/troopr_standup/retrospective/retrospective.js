import React, { Component } from 'react'
import QuestionSection from "./questionSection"
import { Card, Statistic } from "antd"
import "./retrospective.css"

class Retrospective extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }
    getQuestions = () => {

        if (this.props.instanceResponses && this.props.instanceResponses[0] && this.props.instanceResponses[0].progress_report) {
            let questions = this.props.instanceResponses[0].progress_report.map(que => que && que.question && que.question.text)
            return questions
        }
        else if (this.props.questions && this.props.questions.length > 0) {

            let questions = this.props.questions.map(que => que && que.question_text)
            return questions
            //  return this.props.questions
        }
        //  return null
    }
    getAnswers = () => {
        if (this.props.instanceResponses) {
            let questionsAndAnswers = {}
            this.props.instanceResponses && this.props.instanceResponses.forEach(instance => {
                instance.progress_report && instance.progress_report.forEach((report, index) => {
                    if (report && report.answer && report.answer.plain_text) {

                        let totalVotes = (instance && instance.votes) ? instance.votes : []
                        let currentAnswerVotes = totalVotes.filter(vote => {
                            return vote.questionid === (report && (report.question && report.question.id && report.question.id._id || report && report.question && report.question.id))
                        })
                        let currentAnswerComments = instance.comment_id.filter(comment => {
                            return comment.questionid === (report && report.question && report.question.id && report.question.id._id || report && report.question && report.question.id)
                        })

                        let userId = localStorage.getItem("trooprUserId");
                        let isCurrentUserVoted = currentAnswerVotes.find(user => user.user_id === userId)

                        let allActionItems = (instance && instance.actionItems) ? instance.actionItems : [];
                        let currentAnsActionItems = allActionItems.filter(item => {
                          return item.question_id == (report && report.question && report.question.id && report.question.id._id || report && report.question && report.question.id)
                        })

                        if (questionsAndAnswers[index]) {
                          questionsAndAnswers[index].push({ report: instance, questionid: report.question.id._id || report.question.id, answer: this.props.thredAnswer(report.answer.plain_text, instance.unfurl_medata && instance.unfurl_medata.jiraIds,instance), currentVotes: currentAnswerVotes.length, isCurrentUserVoted, comments: currentAnswerComments, user_id: instance.user_id, action_items : currentAnsActionItems , grouping_data : report.grouping_data ? report.grouping_data : {} })
                        }
                        else {
                          questionsAndAnswers[index] = [{ report: instance, questionid: report.question.id._id || report.question.id, answer: this.props.thredAnswer(report.answer.plain_text, instance.unfurl_medata && instance.unfurl_medata.jiraIds,instance), currentVotes: currentAnswerVotes.length, isCurrentUserVoted, comments: currentAnswerComments, user_id: instance.user_id, action_items : currentAnsActionItems , grouping_data: report.grouping_data ? report.grouping_data : {} }]
                        }

                    }

                })
            })

            return questionsAndAnswers
        }
        return null
    }
    render() {

        let questions = this.getQuestions() || []
        // questions.push(questions)
        // questions.push(questions)
        let answers = this.getAnswers() || []
        // console.log(answers,"ttt")

        return (
            <div>
                <div className="retrospective-container" >

                    {questions && questions.map((que, index) => {

                      return <QuestionSection instanceResponses={this.props.instanceResponses} switchViewToRetroActionItems={this.props.switchViewToRetroActionItems} loading={this.props.loading} answers={Array.isArray(answers[index]) ? answers[index] : []} question={que} isTeamSyncAdmin= {this.props.isTeamSyncAdmin}/>

                    })
                    }
                </div>
            </div>
        )
    }
}


export default Retrospective
