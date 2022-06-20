import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Logo from '../../../media/circular_troopr_logo.svg';
import { SkillsAction } from '../settings/settings_action';
import { getSkillData, updateSkill } from '../skills_action';
import { Button, Card, Avatar, List, Typography, Row, Col, message } from 'antd';
const { Text } = Typography

const { Meta } = Card;

class TrooprProManMainPage extends Component {

  componentDidMount() {
    const {workspace} = this.props

    if("showSquads" in workspace && !workspace.showSquads){
      message.warning('Squads disabled')
      this.props.history.push(`/${this.props.match.params.wId}/dashboard`)
    }else{
      this.props.getSkillData(this.props.match.params.skill_id)
      this.props.SkillsAction(this.props.match.params.wId);
    }
  }

  updateSkillToggle = (data) => {
    this.props.updateSkill(this.props.skill._id, this.props.skill.workspace_id, data).then(res => { })
  }

  gotoTrooprApp = () => {
    window.location.href = `https://${window.location.hostname}/workspace/${this.props.match.params.wId}/myspace/tasks`;
  }

  render() {

    return (

      <Row gutter={[16,16]}>
        <Col span={24}>
          <Card >
            <Meta
              avatar={
                <Avatar src={Logo} />
              }
              title="Troopr Projects"
              description="Create, update, track and get notified about tasks in Slack."
            />
          </Card>
        </Col>
        <Col span={24}>
          <Card title="Dashboard" className="card" style={{ marginBottom: "12px" }} extra={<Button type="primary" onClick={this.gotoTrooprApp}>Go to Dashboard</Button>}>
            <div>
              <div style={{ marginBottom: "10px" }}><Text>Troopr Project Management Web application</Text></div>
            </div>
          </Card>
        </Col>
        <Col span={24}>
          <Card title="Commands" className="Assistant_Body card">
            <div>
              <List

                itemLayout="horizontal">
                {this.props.skill.commands && this.props.skill.commands.map(action => {

                  return <Card type="inner" className="card-inner-config">
                    <div className="commands-align-syntax"><Text code >{action.syntax}</Text></div>
                    <div className="commands-align-desc"><Text>{action.desc}</Text></div>
                    {action.example && "Example:"}
                    {action.example && <Text copyable code>{action.example}</Text>}
                  </Card>
                })
                }
              </List>
            </div>
          </Card></Col>
      </Row>

      //         <div>
      //            <div className="standup-background" style={{overflow:'auto', height:'calc(100vh - 80px)', display:'flex', justifyContent:'center'}}>
      //                <div style={{width: '60%'}} className = "">
      // 	               <div className="Setting__body">
      //                   <Card className="card" style={{ marginBottom: '12px' }}>
      //                   <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between',}}>
      //                     <Meta
      //                       style={{marginRight: '24px'}}
      //                       avatar={
      //                         <Avatar src={Logo} />
      //                       }
      //                       title="Troopr"
      //                       description="Create, update, track and get notified about tasks in Slack."
      //                     />
      //                         {this.props.location.state.skill.skill_metadata.default? 
      //                            <div className="button_hover">
      //                 <Button type="primary" className="skill_action_btn_jira ">Default</Button>
      //                            </div>    
      //                          : <Button className="skill_action_btn_jira "  
      //                               onClick={() => this.updateSkillToggle({default:true})}>
      //                                  Set as default
      //                            </Button>}
      //                     </div>
      //                   </Card>
      //                   <Card title="Dashboard" className="card" style={{marginBottom:"12px"}}>
      //                    <div> 
      //                       <div style={{marginBottom:"10px"}}><Text>Web dashbaord to manage Standups for your team.</Text></div>
      //                       <div><button className="ant-btn ant-btn-primary" onClick={this.gotoTrooprApp}>Go to Dashboard</button></div>
      //                    </div>
      //                    </Card>
      //                   <Card title="Commands" className="Assistant_Body card">
      //                     <div>
      //                        <List

      //                          itemLayout="horizontal">
      //                           {this.props.skill.commands &&this.props.skill.commands.map(action => {

      //                                return<Card type="inner"  className="card-inner-config">
      //                             <div className="commands-align-syntax"><Text code >{action.syntax}</Text></div>
      //                             <div className="commands-align-desc"><Text>{action.desc}</Text></div> 
      //    {action.example && "Example:"}
      //  {action.example &&<Text copyable code>{action.example}</Text>}
      //  </Card>


      //                               })
      //                            }
      //                       </List>
      //                   </div>
      //                </Card>
      //             </div>
      //          </div>
      //       </div>
      //     </div>
    );
  }
}

const mapStateToProps = state => {

  return {
    assistant_skills: state.skills.skills,

    //   paymentHeader : state.common_reducer.workspace,
    skill: state.skills.skill,
    workspace: state.common_reducer.workspace

  }
};


export default withRouter(connect(mapStateToProps, {
  SkillsAction,
  getSkillData,
  updateSkill
})(TrooprProManMainPage)); 
