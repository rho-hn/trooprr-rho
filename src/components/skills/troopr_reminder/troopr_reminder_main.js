import React,{ Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Logo from '../../../media/circular_troopr_logo.svg';
import { SkillsAction } from '../settings/settings_action';
import { Card, List, Avatar,Typography } from 'antd';

const { Meta } = Card;

class ReminderMain extends Component { 
	 componentDidMount() {
        this.props.SkillsAction(this.props.match.params.wId);
   }

	render() {
     const { launcherActions } = this.props;
	   return (
          <div style={{overflow:'auto', height:'calc(100vh - 80px)', display:'flex', justifyContent:'center'}}>
          <div style={{width: '60%'}}>
             <div className="Setting__body">
               <Card style={{ marginBottom: '12px' }}>
                 <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between',}}>
                   <Meta
                     style={{marginRight: '24px'}}
                     avatar={
                       <Avatar src={Logo} />
                     }
                     title="Reminder"
                     description="Set and manage reminders about tasks, jira issues and team meetings in Slack."
                    />
                   </div>
              </Card>
              <Card className="Assistant_Body">
                 <div>
                   <List
                      header={<div className="Commands_header">Commands</div>}
                      itemLayout="horizontal">
                      {this.props.skill.commands &&this.props.skill.commands.map(action => {
                       
                         return<Card type="inner" >
                               <div className="commands-align-syntax"><Typography.Text code >{action.syntax}</Typography.Text></div>
                               <div className="commands-align-desc"><Typography.Text>{action.desc}</Typography.Text></div> 
      {action.example && "Example:"}
    {action.example &&<Typography.Text copyable code>{action.example}</Typography.Text>}
    </Card>
                             
                          
                       })
                    }
                   </List>
                 </div>
              </Card>
          </div>
         </div>
      </div>
    );
	}
}

const mapStateToProps = state => ({
  launcherActions: state.launcherActions.allActions,
  // paymentHeader : state.common_reducer.workspace
});

export default withRouter(connect( mapStateToProps, {
      SkillsAction
    })(ReminderMain)); 
