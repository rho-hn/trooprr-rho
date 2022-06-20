import React, { Component, Fragment } from 'react'
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { PageHeader, Typography, Row, Col, Table, Card, Tag, Tooltip, Avatar, Badge, Statistic} from 'antd';
import { getTasks } from "../tasks/task/taskActions"
import { setSidebar } from "../sidebar/sidebarActions";
import { setTask } from "../tasks/task/taskActions";
import ProjectReport from "../report/ProjectReport.js";

const { Text } = Typography;


class Status extends Component {
    constructor(props) {
        super(props)
        this.state = {           
            assigneesTasks:[],
            teamstatus_columns:[]
        }
    }

    _getInitials(name) {
      let nameArr = name
        .trim()
        .replace(/\s+/g,' ') //remove extra spaces
        .split(" ")
  
      if (nameArr.length>1)
        return (nameArr[0][0] + nameArr[1][0]).toUpperCase()
      else
        return nameArr[0].slice(0, 2).toUpperCase()
    }

    componentDidMount() {
        let wId = this.props.match.params.wId
        let pId = this.props.match.params.pId
        let teamstatus_columns = []
        let statuses=[]
        this.setState({ wId: wId, pId: pId })
        this.props.getTasks(wId, pId).then(res=>{
          if (res.data.success) {
            let tasks = res.data.tasks
            let assigneesTasks=[]            
            const map = new Map();
            for (const task of tasks) {
                if(!map.has(task.status._id)){
                    map.set(task.status._id, true)
                    statuses.push({
                        id: task.status._id,
                        name: task.status.name,
                        position: task.status.position
                    });
                }
            }
            for (let j = 0; j < res.data.tasks.length; j++) {
              if (tasks[j].user_id && tasks[j].status) {
                let assigneeTasks = assigneesTasks.find(at=>at.user_id===tasks[j].user_id._id) || {}
                if(!assigneeTasks.user_id){
                  assigneeTasks.name=(tasks[j].user_id.displayName||tasks[j].user_id.name)
                  assigneeTasks.user_id=tasks[j].user_id._id
                  assigneeTasks.profilePicUrl=tasks[j].user_id.profilePicUrl
                  assigneeTasks.count=0
                  assigneeTasks.tasks={}
                  assigneesTasks.push(assigneeTasks)
                } 
                if (assigneeTasks.user_id && !assigneeTasks.tasks[tasks[j].status._id]) {
                  assigneeTasks.tasks[tasks[j].status._id] = [tasks[j]]
                  assigneeTasks.count=assigneeTasks.count+1                   
                } else {
                  assigneeTasks.tasks[tasks[j].status._id].push(tasks[j])
                  assigneeTasks.count=assigneeTasks.count+1 
                }
              }
            }
            assigneesTasks= assigneesTasks.sort((a,b) => b.name - a.name)            
            teamstatus_columns.push({
              title: "Users",
              width: 200,
              render: (response, data) => {
                  // return (<Fragment><Text strong>{data.name}</Text><Badge count={data.count} /></Fragment>)
                  return (<div style={{display:"flex", alignItems:"center"}}>
                    {/* <Badge count={data.count} > */}
                    <Tooltip title={data.name}>                      
                      {data.profilePicUrl ?<Avatar src={data.profilePicUrl}/>:
                        <Avatar >{this._getInitials(data.name)}</Avatar>}
                    </Tooltip>
                    {/* </Badge> */}
                    {/* <Text style={{marginLeft:16}} strong>{data.name}</Text> */}
                    <Statistic value={data.count} suffix="tasks" style={{marginLeft:8}}/>
                    </div>)
              }
            })
            statuses.sort((a,b)=> a.position - b.position)
            statuses.forEach(status => {
              teamstatus_columns.push({
                title:status.name,
                render: (response, data) => (
                  <Fragment>
                    {data.tasks[status.id] && data.tasks[status.id].map(t => (
                      <Fragment>
                        {/* <Card hoverable={true} bordered={false} style={{ width: 200, marginBottom:6 }} size="small"  onClick={e => {e.stopPropagation();this.viewTask(t)}}> */}
                          {/* <a onClick={e => {e.stopPropagation();this.viewTask(t)}} style={{paddingRight:8}}><Text strong >{this.truncTitle(t.name)} </Text></a> */}
                          <Tooltip title={this.truncTitle(t.name)}>
                          <Tag>
                            <a onClick={e => {e.stopPropagation();this.viewTask(t)}} ><Text strong >{t.key}</Text></a>
                          </Tag>
                          </Tooltip>
                        {/* </Card> */}
                        {/* <br/> */}
                      </Fragment>
                    ))}
                  </Fragment>
                )
              })
            })
            // console.log("teamstatus_columns:", JSON.stringify(teamstatus_columns))
            this.setState({assigneesTasks, teamstatus_columns})            
          }
        })
    }

    truncTitle = t => t.length > 50 ? `${t.substring(0, 50)}..` : t

    viewTask(task) {
      if (task) {
        const { setTask, setSidebar } = this.props;
        setTask(task)
        // if (this.props.sidebar !== "task") {
          setSidebar("task")
        // }
  
        // this.setState({ showClass: task._id });
        // let arr = window.location.pathname.split("/");
        // if (arr[arr.length - 1] !== "tasks") {
        //   arr.splice(arr.length - 1, 1);
        // }
  
        // let new_loc = arr.join("/");
        // let obj = {
        //   backlog: false,
        //   title: "Task_Kanban",
        //   url: `${new_loc}/${task._id}${window.location.search}`
        // };
        // window.history.pushState(obj, obj.title, obj.url);
      }
    }

    trunc = name => name.length <= 13 ? name : name.slice(0, 13) + '..'

    render() {
        const { tasks, project, members } = this.props
        // console.log("members", members)
      return (
        <div>
          <PageHeader
            // ghost
            style={{
              // backgroundColor: "#ffffff",
              width: "100%",
            }}
            className="site-page-header-responsive"
            // title={project && project.name ? this.trunc(project.name).toUpperCase() + " Status" : ''}  
            title={"Status"}  
          />
          <div
            style={{
              // paddingLeft: 24,
              // paddingRight: 24,
              // paddingTop: 16,
              // marginRigh: 420,
              // overflowX: 'scroll',
              // height: "100vh"
              padding: "16px 16px 32px 24px",
              height:'75vh',
              overflow:'auto'
            }}
          >
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Table
                  // size="small"
                  style={{ width: "100%" }}
                  bordered={true}
                  // showHeader={false}
                  pagination={false}
                  columns={this.state.teamstatus_columns}
                  dataSource={this.state.assigneesTasks}
                />
              </Col>
            </Row>

            <Card  >
            <Row gutter={[16, 16]}>

<ProjectReport/>    </Row>

     </Card>
           
     </div>
        </div>
      );
    }
}
const mapStateToProps = state => {
    return {
        project: state.projects.project,
        members: state.projectMembership.members,
        tasks: state.task.tasks,
    }
};

export default withRouter(connect(mapStateToProps, { getTasks, setSidebar, setTask })(Status))