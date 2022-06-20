import React,{ Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import JiraLogo from '../../../media/Jira_logo.png';
import { SkillsAction } from '../settings/settings_action';
import { getAssisantSkills } from "../skills_action";
import { Card, Avatar, List,Typography, Row, Col } from 'antd';
import '../jira/jira.css';
const { Text } = Typography

const { Meta } = Card;

class JiraMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
          loading: false,
    jiraSkill:null
        }
      }

	componentDidMount(){	
    this.props.SkillsAction(this.props.match.params.wId);
    this.props.getAssisantSkills(this.props.match.params.wId)
  
  }

	render(){
    let jiraSkill= this.props.assistant_skills.find((skill)=>{
      // console.log("skills------>",skill)
      return skill.key==="jira"
       })
      
		return(
      <Row gutter={[16,16]} >
           <Col span={24}>
                    <Card >
                      <Meta
                        avatar={
                          <Avatar src={JiraLogo} />
                        }
                        title="Jira"
                        description="Create, update, track and get notified about Jira issues in Slack."
                      />
                    </Card>
                    </Col>
                    <Col span={24}>
                     
              <Card className="Assistant_Body card">
                    <List
                    loading={this.state.loading}
                      header={<div className="Commands_header">Commands</div>}
                      itemLayout="horizontal">

                      {jiraSkill&&jiraSkill.commands.map((action,index) => {
                        return<Card  type="inner" key={index} className="card-inner-config" >
                              <div className="commands-align-syntax"><Text code >{action.syntax}</Text></div>
                              <div className="commands-align-desc"><Text>{action.desc}</Text></div> 
     {action.example && "Example:"}
   {action.example &&<Text copyable code>{action.example}</Text>}
   </Card>
                        
                      })
                   }
                </List>
              </Card>
             </Col>
       
       </Row>
      );
	}
}


const mapStateToProps = state => ({
  assistant_skills:state.skills.skills,
});


export default withRouter(connect( mapStateToProps,{SkillsAction,getAssisantSkills})(JiraMain)); 
 
