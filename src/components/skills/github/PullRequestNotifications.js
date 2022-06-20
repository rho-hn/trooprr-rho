import React,{Component} from 'react';
import { Typography ,Select,Card} from 'antd';
import { Button, Checkbox, Switch, message } from 'antd';
const { Text } = Typography;
const { Option } = Select; 


let ChannelFrequency = [{
	name:"1 min",
	value:1
},{
	name:"5 min",
	value:5
},{
	name:"15 min",
	value:15
},{
	name:"30 min",
	value:30
},{
	name:"1 hr",
	value:60
},{
	name:"2 hrs",
	value:120
},{
	name:"4 hrs",
	value:240
},{
	name:"6 hrs",
	value:360
},{
	name:"12 hrs",
	value:720
},
];


var notifEvent = [
	{
		label:"Issue Edited",
		value:"edited"
	},
	{
		label:"Issue opened",
		value:"opened"
	},
	{
		label:"Issue Closed",
		value:"closed"
	},
	{
		label:"Issue Reopened",
		value:"reopened"
	},
	{
		label:"Issue assigned",
		value:"assigned"
	},
	{
		label:"Issue deleted",
		value:"deleted"
	},
	{
		label:"Issue commented",
		value:"commented"
	},
	{
		label:"Issue comment edited",
		value:"comment_edited"
	}
	// {
	// 	label:"Issue Moved in a project",
	// 	value:"moved"
	// }
 ]


class PullRequestNotifications extends Component{
    render(){
        return(
            <div style={{marginTop:"20px"}}>
<Card title="Pull request Notifications" style={{ width: "100%" }} extra={ <Switch 
                                //  checked={this.state.notifStatus}
                                //  onClick={this.toggleNotif}
                               />}>


<div className={localStorage.getItem('theme') == "default" ? "Jira_preference_tag_second_issue" :"Jira_preference_tag_second_issue_dark"} style={{marginBottom:"10px"}}>
		                            Customize how you want to receive issues related notifications<br/>
									
							</div>


                            <div className=""><Text type="secondary">Repo</Text></div>
                     <div className='d-flex align-items-center justify-content-between proj-setting-common-pointer'>
                           <Select 
                            //    disabled={!this.state.notifStatus} 
                               name="projectNotif" 
                          	   style={{ width: "100%" }}
						  	   value={"sw"}
                               placeholder="Select Frequency"
                               onChange={this.onChangeFrequency}>
			                      {ChannelFrequency.map((project, index) => (
			                     <Option key={project.value}  value={project.value}>{project.name}</Option>
			                     ))}
		                  </Select> 
                           
                    </div>


                    <div style={{marginBottom:'14px',marginTop:"20px"}} className='align-items-center justify-content-between proj-setting-common-pointer'>
		                    {notifEvent && notifEvent.map((event, index) => (
								<div className="d-flex align-items-center">

								  <Checkbox
		                             style={{marginLeft:'12px',fontSize:'16px',marginBottom:'4px'}}
		                            //  disabled={!this.state.notifStatus} 
		                            //  checked={this.state.notifEvent.find(item => item  === event.value)} 
		                             name="notifEvent" 
		                             onChange={this.onChangeEvent} 
                                     value={event.value}
		                            //  value={"wd"}
                                    
		                             >
                                     <Text type="secondary">{event.label}</Text>   
                                    </Checkbox>
		                        </div>
		                    ))}
                   </div>

                   


                    <div className="d-flex">
                         {/* <Button type="primary" ghost className="btn_114 margin__right__button" onClick={this.onSave}>Save</Button> */}
						 <Button type="primary" className="btn_114 margin__right__button" onClick={this.onSave}>Save</Button>
                    </div>

                               </Card>
            </div>
        
        )
            
    }
}

export default PullRequestNotifications;