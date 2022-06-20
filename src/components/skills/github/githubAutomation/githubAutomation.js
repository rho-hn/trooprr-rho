import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getAutomations } from '../gitHubAction';
import  AddAutomation from "./addAutomationCard"
import {Card,Table,Alert,Layout} from "antd"

const{Content} = Layout
class GithubAutomation extends Component {
    constructor(props) {
        super(props);
        this.state = {
        
            addState:false
              
        }

this.toggle= this.toggle.bind(this)
    }
   
   componentDidMount(){

    this.props.getAutomations(this.props.match.params.wId)
   }
    toggle(){
  this.setState({addState:!this.state.addState})
    }


     render() {

        const table_columns = [
            {
              title: 'When PR is merged in Repo',
              dataIndex: 'pr_repo',
              key: "pr_repo",
         
              align:'center',
              render: (repo, record) =>{ 
    
                return   <span>{repo.name}</span>
                        
                  

            },
            },
          
           
            {
                title: 'Transition Linked Issue to',
                key: "project_column",
                align:'center',
                dataIndex: 'project_column',
                
                render: (text, record) =>{ 
    
                 return <div>Column: <b>{text.name}</b> of project: <b>{record.project.name}</b> </div>
                }
              },

              {
                key: "edit",
                align:'center',
                
                
                render: (text, record) =>{ 
    
                 return    <AddAutomation  state={"edit"} workspace_id={this.props.match.params.wId} automation={record } title="Edit Automation"/>
                }
              },
              {}
           
          ];
      
        return (
          <Content  style={{ padding: "16px 16px 32px 24px", overflow: "initial",marginLeft:50 }}>
                  <Card title="PR => Project Card Automation" extra={<AddAutomation  state={"add"} workspace_id={this.props.match.params.wId} title="Add Automation"/>}>
                          {/* Specify if issues corresponding to PR should be automatically updated.<br/>
                          <br/>
                          When a PR is merged/closed in a repo,corresponding issue card mentioned in PR description will be moved
                          <br/> */}
                          {/* {this.state.addState? */}

                   

                 {/* <div onClick={this.toggle} style={{color:"blue"}}>
                     Add Automation
                </div>} */}


                         

                      <Table  rowKey="_id" columns={table_columns}  dataSource={this.props.automations}  pagination={{ pageSize: 20 }}  />

 <br/><Alert message="Issue is linked to a PR when the issue ID is mentioned in the body of PR" type="info" showIcon />

                  </Card>
                  </Content>
        );
    }
}

     
const mapStateToProps = state => ({
    automations:state.github.automations

});     

export default withRouter(connect(mapStateToProps, { 
    getAutomations
     })(GithubAutomation));





















     