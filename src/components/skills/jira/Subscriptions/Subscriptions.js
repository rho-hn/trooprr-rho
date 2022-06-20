import React from "react";
import {  Card, message,Switch } from "antd";
import { Button,Spin,Table, Tooltip} from "antd";
import { withRouter } from "react-router-dom";
import { getAllJiraConfigs,enableAndDisableNotificationSubscription } from "../../skills_action";
import { connect } from "react-redux";
import IssueModal from "./IssueModal";
import ToggleSwith from "./toggleSwitch"
import query from "query-string";
let ChannelFrequency = [
  {
    name: "Real Time",
    value: 0
  },
  {
    name: "1 min",
    value: 1
  },
  {
    name: "5 min",
    value: 5
  },
  {
    name: "15 min",
    value: 15
  },
  {
    name: "30 min",
    value: 30
  },
  {
    name: "1 hr",
    value: 60
  },
  {
    name: "2 hrs",
    value: 120
  },
  {
    name: "4 hrs",
    value: 240
  },
  {
    name: "6 hrs",
    value: 360
  },
  {
    name: "12 hrs",
    value: 720
  }
];


class Subscriptions extends React.Component {
  state = {
    openprojectModal: false,
    issueId: "",
    issueName: "",
    projectId: "",
    projectName: "",
    openIssueModal:false,
    configureId:"",
    isChannelAdmin : false,
    isGridSharedChannel: false,
    isInitialEditModalOpened:false
  };

  componentDidMount = () => {
    const { commonChanneldata, user_now, channel, userChannels } = this.props;
    // const search = window.location.search;
    const channelId = this.props.channel.id;
    let qs = query.parse(window.location.search);
    if(qs.isThreadSyncNotification){
this.setState({openIssueModal:true})
    }
    //checking if it's enterprice shared channel or not
    const channelFound = userChannels.find((cha) => cha.id === this.props.channel.id);
    let isGridSharedChannel = false;
    if (channelFound && channelFound.is_org_shared && channelFound.enterprise_id) {
      isGridSharedChannel = true;
      this.setState({ isGridSharedChannel: true });
    }

    this.props.getAllJiraConfigs(this.props.match.params.wId, this.props.match.params.skill_id, channelId, isGridSharedChannel).then((res) => {
      // console.log("res--->", res);
    });

    // axios.get(`/bot/api/${this.props.match.params.wId}/getUserChannel`).then( (res)=> {
    //   console.log('res111111111111111')
    //   console.log(res);
    // })
  };

  openIssueModal = () => {
    // if(this.props.isChannelAdmin){
      this.setState(prevState => {
        return {
          projectId: "",
          projectName: "",
          configureId:"",
          openIssueModal: !prevState.openIssueModal
        };
      });
    // }else{
    //   //example text : Channel configuration access restricted. Contact one of the channel admins (or workspace admins) for access: admin1, admin2, admin3 and 5 others

    //   const admins = this.getAdminNames()
    //   message.error("Channel configuration access restricted. Contact one of the channel admins (or workspace admins) for access: "+ admins)
    // }
  };

  getAdminNames = () => {
    const {currentChannelConfigs,members} = this.props;
    let adiminNames = ''
    if(currentChannelConfigs){
      currentChannelConfigs.channel_admins.forEach((id,index) => {
        if(index<3){
          const user = members.find(mem => mem.user_id._id == id)
          if(user) adiminNames = adiminNames + `${user.user_id.displayName||user.user_id.name} `
        }
      })

      if(currentChannelConfigs.channel_admins.length > 3){
        adiminNames = adiminNames + ` and ${currentChannelConfigs.channel_admins.length -3} others`
      }
    }

    return adiminNames;

  }
  
  openProjectModal = () => {
    this.setState(prevState => {
      return {
        projectId: "",
        projectName: "",
        configureId:"",
        openprojectModal: !prevState.openprojectModal
      };
    });
  };

  closeModal = () => {
    this.setState({
      openIssueModal: false,
      openprojectModal: false
    });
  };

  manageIssue = (issueId, issueName) => {
    
    this.setState({
      issueId: issueId,
      issueName: issueName,
      openIssueModal: true
    });
  };

  manageProjects = (record) => {
    const {isChannelAdmin,isWorkspaceAdimin} = this.props;
    if(isChannelAdmin || isWorkspaceAdimin){
      this.setState({
        projectId: record.project_id[0],
        projectName: record.project_name[0],
        openIssueModal: true,
        configureId:record._id
      });
    }else{
            message.error("Channel configuration access restricted. Contact one of the channel admins (or workspace admins) for access: "+ this.getAdminNames())
    }

  };
  toggleNotifications=(e,record)=>{
  
    const {isChannelAdmin,isWorkspaceAdimin} = this.props;
    if(isChannelAdmin || isWorkspaceAdimin){
      this.props
          .enableAndDisableNotificationSubscription(
            this.props.match.params.wId,
            {disabled:!e},
            record._id,
            this.state.isGridSharedChannel
          ).then(res=>{
             if (res.data.success) {
                this.props
                .getAllJiraConfigs(
                  this.props.match.params.wId,
                  this.props.match.params.skill_id,
                  record.channel_id,
                  this.state.isGridSharedChannel
                )
              }
              else{
                message.error("Error while modifying notification subscription.")
              }
          })
    }else{
      message.error("Channel configuration access restricted. Contact one of the channel admins (or workspace admins) for access: "+ this.getAdminNames())
    }
  }
  render() {
    const {isChannelAdmin,isWorkspaceAdimin,currentChannelConfigs} = this.props;
    const columns_projects = [
      {
        title: 'Subscription Name',
        dataIndex: '_id',
        key: '_id',
        className:"table-column",
        align:'center',
        // ellipsis:true,
        render: (text, record) =>{
          let time = record.frequency;
          let note;

          let timeValue = ChannelFrequency.find(data => {
            if (data.value === time) {
              return data;
            }
          });
          let Pname  = record.project_name[0].length>15?record.project_name[0].slice(0,12)+"...":record.project_name[0]
          
          if (timeValue && timeValue.name && timeValue.name === "Real Time") {
            note = `Events from ${Pname} in Real time`;
          } else {
            note = `Events from ${Pname} every ${timeValue && timeValue.name ? timeValue.name : ""}`;
          }
          return (
            <div style={{display:"flex",justifyContent:"space-between"}}>
            {record.project_name[0].length>15?
            <Tooltip placement="top" title={record.project_name} > 
            <a
              className="table-link"
              onClick={() => {
                // isChannelAdmin ? this.manageProjects(record) : () => (message.error("Channel configuration access restricted. Contact one of the channel admins (or workspace admins) for access: "+ this.getAdminNames()));
                this.manageProjects(record)
              }}
            >
            {note}
            </a>
            </Tooltip>
            :<a
              className="table-link"
              onClick={() => {
                // isChannelAdmin ? this.manageProjects(record) : () => (message.error("Channel configuration access restricted. Contact one of the channel admins (or workspace admins) for access: "+ this.getAdminNames()));
                this.manageProjects(record)
              }}
            >
            {note}
            </a>}
            <span>
            <ToggleSwith key={record._id} record={record} toggle={this.toggleNotifications} />
            </span>
            </div>
          );



          }
      }
    ];
   
    return (
      <>
        {/* <Card
          title="Issue Notification Subscription">
          <div>
            {this.props.jiraChannelConfigs && this.props.jiraChannelConfigs ? (
              manageissues
            ) : (
              <div></div>
            )}
          </div>
          <Empty image={"https://app.troopr.io/logo/empty_undraw.svg"} description={
          <span>
            You are not subscribed to any notifications for this channel
          </span>
        }><Button type="primary" onClick={this.openIssueModal}>Add Subscription</Button></Empty>
          
        </Card> */}
        
        <Card size='small' title="Channel Notifications" extra={<Button
              type="primary"
              onClick={this.openIssueModal}
              disabled={currentChannelConfigs != false && !isChannelAdmin && !isWorkspaceAdimin }
            >Add Subscription
            </Button>}>
        {this.state.loading? <Spin/>:
        <Table columns={columns_projects} ellipsis ={true} pagination={false} showHeader={false} dataSource={this.props.jiraChannelConfigs.filter((issues,index)=>{return issues.project_id})}  />}
      </Card>        

         {this.state.openIssueModal && (
          <IssueModal
            channelId={ this.props.channel.id}
            channel_name={ this.props.channel.name}
            skill={this.props.skill}
            setOption={this.props.setOption}
            showModal={this.state.openIssueModal}
            closeModal={this.closeModal}
            projectId={this.state.projectId}
            projectName={this.state.projectName}
            configureId={this.state.configureId}
            isGridSharedChannel={this.state.isGridSharedChannel}
          />
        )}
       
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    jiraChannelConfigs: state.skills.getJiraConfigs,
    members: state.skills.members,
    user_now: state.common_reducer.user
  };
};

export default withRouter(
  connect(mapStateToProps, { getAllJiraConfigs,enableAndDisableNotificationSubscription })(Subscriptions)
);
// export default withRouter(connect(mapStateToProps, { getProject,personalSetting,getAllJiraConfigs,setGitHubChannelConfig,enableAndDisable })(GithubChannelNotification2));
