import React,{ Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Logo from '../../../media/circular_troopr_logo.svg';
import NavbarBreadCrumbs from '../navbar/navbarBreadCrumbs';
import { Card, List, Avatar, Button } from 'antd';

const { Meta } = Card;

class AssistantTeamsync extends Component {
  constructor() {
    super()
    this.state = {
       option:''
     }
  }

	componentDidMount() {
   	this.props.getSkillSetData( this.props.match.params.wId, this.props.match.params.skillset_id );
    this.props.getSkillSetSkills( this.props.match.params.wId, this.props.match.params.skillset_id );
   }

   redirectToSkillBuilder = () => {
       this.props.history.push(`/${this.props.match.params.wId}/skillset/${this.props.match.params.skillset_name}/${this.props.match.params.skillset_id}/skillbuilder`)
   }

	render(){
   //  const { option } = this.state;
    const { skillSetData, skillSetSkills } = this.props;
   //  let paymentStatus = this.props.paymentHeader.billing_status;
		return(
         <div>
              <NavbarBreadCrumbs param1 = "SkillSet" param2= {skillSetData.name} workspace_Id={this.props.match.params.wId}/>
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
                             title = {skillSetData.name}
                             description = {skillSetData.desc}
                            />
                           </div>
                      </Card>
                      <Card className="Assistant_Body">
                         <div>
                            <List
                               header={<div className="Commands_header">Skills</div>}
                               itemLayout="horizontal">
                                 {skillSetSkills.map(skill => (
                                      <List.Item key={skill._id} actions={[<Button key="list-loadmore-edit" onClick={this.redirectToSkillBuilder}>edit</Button>]}>
                                        <List.Item.Meta
                                          title={skill.name}
                                          description={skill.description}
                                       />
                                      </List.Item>   
                                  ))}           
                             </List>
                          </div>
                        </Card>
                     </div>
                  </div>
               </div>
             </div>
          );
	      }
     }

const mapStateToProps = state => ({
   launcherActions: state.launcherActions.allActions,
   skillSetData: state.skill_builder.skillSetData,
   skillSetSkills: state.skill_builder.skillSetSkills
   // paymentHeader : state.common_reducer.workspace
});


export default withRouter(connect( mapStateToProps, {
  
  
    })( AssistantTeamsync )); 
