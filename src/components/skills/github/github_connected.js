import React, { Component } from 'react'
import { withRouter } from "react-router-dom";
import Githublogo from '../../../media/Github_logo.png';
import GitHubAutomation from "./githubAutomation/githubAutomation";
import { Card, Avatar,Typography } from 'antd';
import { Button } from 'antd';
import '../jira/jira.css';

const { Text } = Typography

const { Meta } = Card;

 class Github_Connected extends Component {
    render(){
        return(
          <div>
            
                  <div>
                    <Card >
                      <Meta
                        avatar={
                          <Avatar src={Githublogo} />
                        }
                        title="Workspace Account"
                        description="Workspace is connected to a Github organization"
                        />
                        <Button>Disconnect</Button>
                    </Card>
                    </div>
          


                    
                          <Card >
                            <GitHubAutomation/>
                                <Button>Disable</Button>
                          </Card>
   
       </div>
        )
    }

}

export default withRouter(Github_Connected)