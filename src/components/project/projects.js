import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { ContainerOutlined, CrownOutlined, EditOutlined, PlusOutlined, TeamOutlined,EllipsisOutlined } from '@ant-design/icons';
import {
  Card,
  Row,
  Col,
  Button,
  Table,
  Layout,
  Tabs,
  Input,
  Menu,
  Modal,
  Select,
  PageHeader,
  message,
  Result,
  Spin,
  Divider,
  Dropdown,
  Tooltip,
  Progress,
  Typography
} from "antd";
// import { Form } from '@ant-design/compatible';
import SquadCreationModal from "./SquadCreationModal"


import {
  getProjects,
  getProject,
  setProject,
  recentProjects,
  getRecentProjects
} from "./projectActions.js";

const { Search, TextArea } = Input;
const {Content} = Layout
const {Text} = Typography


class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ActiveProjectsTab: true,
      newProjectModal: false,
      projectName: '',
      createProjectLoading: false,
      loading: false,
      projectType: 'kanban',
      searchValue: '',
      projectkey:"",
      disablecreation:true,
      projectkeyerrors:{error:false,text:''}
    };
  }
  componentDidMount() {
    this.setState({ loading: true })
    this.props.getProjects(this.props.match.params.wId).then(res => {
      if (res.data.success) {
        this.setState({ loading: false })
      }
    })
  }

  onProjectTabChange = activeKey => {
    if (activeKey === "active") {
      this.setState({
        ActiveProjectsTab: true
      });
    } else {
      this.setState({
        ActiveProjectsTab: false
      });
    }
  };

 
  openNewProjectModal = () => {
    this.setState({
      newProjectModal: !this.state.newProjectModal,
    });
  };
 

  onProjectTypeChange = (type) => {
    // console.log(type)
    this.setState({ projectType: type })
  };


  getProject = (project) => {
    this.props.getProject(project._id, this.props.match.params.wId).then(res => {
    })
    this.props.recentProjects(project._id, this.props.match.params.wId).then(res => {
      if (res.data.success) {
        //this.props.getRecentProjects(this.props.match.params.wId)
      }
    })

    this.props.setProject(project);
    const filter_value = project.filter_value;
    if (filter_value) {
      this.props.history.push("/" + this.props.match.params.wId + "/squad/" + project._id + "/tasks" + filter_value);
    } else {
      this.props.history.push(`/${this.props.match.params.wId}/squad/${project._id}/tasks`)

    }
    // this.props.history.push(`/${this.props.match.params.wId}/project/${id}/tasks`)
  }

  searchResult = (e) => {
    this.setState({ searchValue: e.target.value })
    // const searchData=this.props.projects.filter(o=>o.name.toLowerCase().includes(value.toLowerCase()))
    // this.setState({projects:searchData})
    // console.log(searchData)
  }
  handleOverlayMenu=(e,project,type)=>{
    // console.log(e,"ss");
    // /5da4544577360439548077eb/squad/5eb5513d6115eb34193060ca/tasks?view=settings
e.stopPropagation()    
this.props.history.push(`/${this.props.match.params.wId}/squad/${project._id}/tasks?view=${type}`)

  }

  projectMenu = (project)=>{
   return <Menu>
      <Menu.Item icon={<EditOutlined />}>
      <span onClick={(event) => this.handleOverlayMenu(event,project,"settings" )}>
    Edit
  </span>
  </Menu.Item>
      <Menu.Item icon={<TeamOutlined />}>
      <span onClick={(event) => this.handleOverlayMenu(event,project,"members" )}>Members</span>
          </Menu.Item>
      {/* <Menu.Item  icon={<ContainerOutlined />}>
      <span onClick={(event) => this.handleOverlayMenu(event,project,"archive" )}>Archive</span>
          </Menu.Item> */}
    </Menu>
  }

  closeModal=()=>{
    this.setState({newProjectModal:false})
  }

  render() {
 
    const { projects } = this.props
    const filterProjects = this.props.projects.filter(o => o.name.toLowerCase().includes(this.state.searchValue.toLowerCase()))
    // const progresspercent =Math.floor((this.props.task.total_tasks)-(this.props.task.incomplete_tasks)*100)/(this.props.task.total_tasks)
    return (
        <Layout /*style={{marginLeft: 250}} style={{background: (localStorage.getItem('theme') == 'default' ? "#ffffff" : "rgba(15,15,15)")}}*/>
        <PageHeader
          style={{
            // backgroundColor: "#ffffff",
            // paddingLeft: "100px",
            // paddingRight: "100px"
          }}
          // ghost={true}
          // avatar={{ icon: "project", shape: "square" }}
          className="site-page-header-responsive"
          // title="Squads"
          // title = 'Create a Squad for your team or project'
          title = {'Squads'}
          // subTitle="Squads are autonomous teams working on one or more Products. You can be part of one or more Squads."
          extra={<>
            <Button
              type="primary"
              // icon={<PlusOutlined />}
              onClick={() => this.openNewProjectModal()}
            >
              New Squad
            </Button>
            {/* <span  style={{position:'absolute', left: "87px",top:"80px",zIndex:'8'}}>
            <Search
            placeholder="search Squad"
            // onSearch={value => this.searchResult(value)}
              onChange={e=>this.searchResult(e)}
              style={{ width: 200 }}
               size="medium"
               allowClear
              autoFocus />
              </span> */}
              </>
          }
        // footer={
        //   <Tabs
        //     defaultActiveKey="active"
        //     onChange={this.onProjectTabChange}
        //   // style={{ position: 'fixed' }}
        //   >
        //     <TabPane
        //       tab={
        //         <span>
        //           <Icon type="check" />
        //           Active
        // </span>
        //       }
        //       key="active"
        //     />
        //     <TabPane
        //                       tab={
        //                           <span>
        //                               <Icon type="container" />
        //   Archive
        // </span>
        //                       }
        //                       key="archive"
        //                   />
        //   </Tabs>
        // }
        />
        <Content style={{ /*background: (localStorage.getItem('theme') == 'default' ? "#ffffff" : "rgba(15,15,15)"),padding: "0px 100px",*/padding: "16px 16px 32px 24px",height:'80vh', overflowX: "scroll"}}>
        {/* <Layout style={{ backgroundColor: "#ffffff", padding: "0px 100px"}}> */}
          {this.state.newProjectModal && (<SquadCreationModal closeModal={this.closeModal} newProjectModal={this.state.newProjectModal}/>)}

          {!this.state.loading ?
            this.state.ActiveProjectsTab ? (
              <Fragment>
                {/* {console.log("length", projects.length)} */}
               {/* <span  style={{ left: "100px",top:"190px"}}>
                  <Search
                            placeholder="search Squad"
                           onSearch={value => this.searchResult(value)}
                              style={{ width: 200 }}
                               size="medium"
                               allowClear
                              autoFocus />
                                            </span> */}
                                            {/* <Divider/> */}
            {/* <Layout style={{ backgroundColor: "#ffffff", overflowY: "scroll", height: '63vh',overflowX:'hidden' }}> */}
                  <Row gutter={[16, 16]}>
                    {filterProjects.length > 0 ?
                       // projects && projects.map(project => {
                      filterProjects && filterProjects.map(project => {                        
                        return (
                          <Col span={8}>
                            <a onClick={() => this.getProject(project)}>
                              <Card
                                title={project.name}
                                hoverable="true"
                                // bordered={false}
                                // style={{
                                //   height: "150px",
                                //   maxHeight: "150px",
                                //   minHeight: "150px"
                                // }}
                                size='small'
                              extra={
                                  <Dropdown
                                
                                      overlay={()=>this.projectMenu(project)}
                                      placement="bottomRight"
                                  >
                                    <div onClick={e=>{e.stopPropagation()}} className="action_colors"><EllipsisOutlined key="ellipsis" /></div>
                                  </Dropdown>
                              }
                              >
                                {project.created_by ?
                                  <span style={{marginBottom:4}}>
                                    <CrownOutlined />
                                    <Text type='secondary' style={{ paddingLeft: "8px" }}>
                                      {project.created_by.displayName||project.created_by.name}
                                    </Text>
                                    <br/>
                                    </span>
                                    : ''
                                  }
                                  
                                  
                                  {project.doneCount>=0 && project.totalCount>=0 &&
                                  <Tooltip title={`${project.doneCount} of ${project.totalCount} tasks completed`}>
                                    <Progress
                                        percent={project.totalCount==0?0:Math.round((project.doneCount*100)/project.totalCount)}
                                        size="small"
                                        status="active"
                                    />
                                  </Tooltip>}
                                                              
                              </Card>
                            </a>
                          </Col>
                        );
                      })
                      :
              <Layout style={{ /*background: (localStorage.getItem('theme') == 'default' ? "#ffffff" : "rgba(15,15,15)"),*/ padding: "0px 100px"}}>
                      {projects&&projects.length<=filterProjects.length?<Result
                        style={{padding:0}}
                        status="404"
                        // title="You are not member of any Squad yet!"
                        subTitle={
                          // <span>
                          //   Create a new Squad now{" "}<br/>
                          //   <Button
                          //   type="primary"
                          //   icon={<PlusOutlined />}
                          //   onClick={() => this.openNewProjectModal()}
                          // >
                          //   New Squad
                          //                 </Button>
                          // </span>
                          <span>
                          <h2 style={{padding:0}}>You are not member of any Squad yet!</h2>
                        <span >Create a new Squad now</span>{" "}<br/>
                        <Button
                        style={{marginTop:'10px'}}
                        // type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => this.openNewProjectModal()}
                      >
                        New Squad
                                      </Button>
                      </span>
                        }
                        // extra={
                        //   <Button
                        //     type="primary"
                        //     icon={<PlusOutlined />}
                        //     onClick={() => this.openNewProjectModal()}
                        //   >
                        //     New Squad
                        //                   </Button>
                        //                         }
                                            />
                                            :(<Result 
                                            status="404"
                                            title="No Result Found"
                                            style={{position:"fixed",right:"550px"}}/>)}
                                            </Layout>
                                        }
                                    </Row>
                                    {/* </Layout> */}

                            </Fragment>
                        ) : (
                                <Fragment>
                                    <div
                                        style={{
                                            paddingLeft: 57,
                                            paddingBottom: 15,
                                            boxShadow: "rgba(0,0,0,0.1) 0 2px 0 0",
                                            zIndex: "999",
                                            position: "relative",
                                            // height: "100vh"
                                        }}
                                    >
                                        {/* <Input placeholder="input with clear icon" allowClear size="small"/> */}

                    <span style={{ padding: 6 }} />
                    <span style={{ right: "32px", position: "absolute" }}>
                      <Search
                        placeholder="input search text"
                        // onSearch={value => console.log(value)}
                        style={{ width: 200 }}
                        size="medium"
                        allowClear
                      />
                      <span style={{ padding: 6 }} />
                    </span>
                  </div>
                  <div
                    style={{
                      paddingTop: 32
                    }}
                  >
                    <Table
                      pagination={true}
                      columns={this.archived_columns}
                      dataSource={this.archived_data}
                    />
                  </div>
                </Fragment>
              )
            :
           
            <Spin style={{ marginTop: "30vh",display:"flex",alignItems:"center" ,justifyContent:"center" }} />
            

          }
        </Content>
      </Layout >
    );
  }

}

const mapStateToProps = state => ({
  projects: state.projects.projects,
  workspacekeys:state.projects.workspacekeys
});
export default withRouter(
  connect(mapStateToProps, {
    getProjects,
    getProject,
    setProject,
    recentProjects,
    getRecentProjects
  })(Projects));