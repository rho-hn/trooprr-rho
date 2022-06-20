import React from "react";
import { connect } from "react-redux";

import { withRouter } from "react-router-dom";
import {
  getOrganistaionProject,
  getRepoProject,
  getRepos
} from "../../skills/github/gitHubAction";
import {sendDefaultLauncher} from '../../skills/skills_action';

import { getTeamData } from "../../skills/skills_action";
import { getWorkspace } from "../../common/common_action";
import axios from "axios";
import { CheckCircleOutlined, SlackOutlined } from '@ant-design/icons';
import { Button, Select, Modal, Result, Checkbox } from "antd";
const { Option } = Select;
class GitHubDefaults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      project: {},
      repo: {},
      proj_repo: {},
      channel: {},
      project_type: {},
      loading: false,
      field_error: false,
      loadingSelect: false,
      visible: true,
      projectOptions: [],
      allProjects: [],
      orgProjects: [],
      orgProjectsOptions: [],
      view: "askdefaults",
      autoCreateFields:{issuesmissingupdates:true,
        issuesbycolumn:true,
      standup:true
      }
    };
    this.skip = this.skip.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({
      channel: {
        id: this.props.location.state.channelId,
        name: this.props.location.state.channelName
      }
    });
    if (!this.props.workspace._id) {
      this.props.getWorkspace(this.props.match.params.wId);
    }
    if (!this.props.teamId.id) {
      this.props.getTeamData(this.props.match.params.wId).then(res => {
        // console.log("res=>",res.data.teamId);
        localStorage.setItem("teamId", res.data.teamId);
      });
    }

    this.props.getRepos(this.props.match.params.wId);
    this.props.getOrganistaionProject(this.props.match.params.wId).then(res => {
      let orgProjects = [];
      let orgProjectsOptions = res.data.projects.map(project => {
        orgProjects.push({
          project_type: { id: "org_prj", name: "Organisation Projects" },
          project: { id: project.id, name: project.name }
        });
        return (
          <Option key={project.id} value={project.id}>
            {project.name}
          </Option>
        );
      });

      this.setState({
        orgProjects: orgProjects,
        orgProjectsOptions: orgProjectsOptions
      });
    });
  }

  onChange(value, data, type) {
    this.setState({ [type]: { name: data.props.children, id: value } });
    if (type == "repo") {
      this.setState({
        loadingSelect: true,
        project: {}
      });
      this.props
        .getRepoProject(this.props.match.params.wId, value)
        .then(res => {
          let repoProjects = res.data.projects;
          let allProjects = [];
          let projectOptions = [];

          repoProjects.forEach(project => {
            allProjects.push({
              project_type: { id: "repo_prj", name: "Repo Projects" },
              proj_repo: { name: this.state.repo.name, id: this.state.repo.id },
              project: { id: project.id, name: project.name }
            });
            projectOptions.push(
              <Option key={project.id} value={project.id}>
                {project.name}
              </Option>
            );
          });

          projectOptions = projectOptions.concat(this.state.orgProjectsOptions);
          allProjects = allProjects.concat(this.state.orgProjects);

          this.setState({
            projectOptions: projectOptions,
            allProjects: allProjects,
            loadingSelect: false
          });
        });
    }
  }

  handleSubmit() {
    // console.log(this.state)
    this.setState({ loading: true, field_error: false });
    // console.log(this.props.location.state);
    if (
      this.state.repo.id &&
      this.state.project.id &&
      this.props.location.state &&
      this.props.location.state.channelId
    ) {
 

      let data = this.state.allProjects.find(item => {
        return item.project.id == this.state.project.id;
      });
    
     let projectName=data.project.name.split("/")
     data.project.orgProjectName=projectName[0]
     data.project.name=projectName[1] 
    
      data.app = "GitHub";
      data.skill_id = this.props.match.params.skill_id;
      data.timeZone = this.props.workspace.timezone;
      data.repo = this.state.repo;
      data.channel = this.state.channel;
      data.autoCreateFields=this.state.autoCreateFields
      axios
        .post(
          "/bot/api/workspace/" +
            this.props.match.params.wId +
            "/setChannelDefault",
          data
        )
        .then(res => {
          this.setState({ loading: false });
          if (res.data.success) {
            this.setState({ loading: false, view: "success" });
          } else {
            this.setState({ loading: false, field_error: true });
          }
        });
    } else {
      this.setState({ loading: false, field_error: true });
    }
  }


  handleNextPage = view => {
    if(view==="askpermissions"){
      if(!this.state.project.id ||!this.state.repo.id){
        this.setState({field_error:true})
      }else{this.setState({view})}
}
else{
  this.setState({view})
}
  }
  skip() {
    // console.log("this.state.channel===>",this.props) ;
    // console.log("this.satte==>",this.state.channel);

if(this.state.channel && this.state.channel.id){
  let userId = localStorage.getItem('trooprUserId');
  let channelId = this.state.channel.id;
  this.props.sendDefaultLauncher(this.props.match.params.wId,channelId,userId);


}
    
    if(this.state.view==="askpermissions"){
      this.setState({issuesmissingupdates:true,
        issuesbycolumn:true,
      standup:true
      },()=>{this.handleSubmit()})}
    
    if (this.props.visible) {
      this.setState({ visible: false });
    } else {
      this.props.history.push(
        "/" +
          this.props.match.params.wId +
          "/skills/" +
          this.props.match.params.skill_id
      );
    }
  }

  goToNotif = () => {
    // https://app-stage.troopr.io/5da4544577360439548077eb/skills/5da454461d05673817aff1c1?view=channel_preferences&channel_name=websites&channel_id=CF2DL9ADT
    this.props.history.push(
      "/" +
        this.props.match.params.wId +
        "/skills/" +
        this.props.match.params.skill_id +
        "?view=channel_preferences&channel_name=" +
        this.state.channel.name +
        "&channel_id=" +
        this.state.channel.id
    );
  };

  goToReports = () => {
    this.props.history.push(
      "/" +
        this.props.match.params.wId +
        "/skills/" +
        this.props.match.params.skill_id +
        "?view=reports"
    );
  };

  getOptions = () => {
    // console.log("Call options");
    let options = [];
    this.props.orgProj.forEach(project => {
      options.push(
        <Option key={project.id} value={project.id}>
          {project.name}
        </Option>
      );
    });
    this.props.repoProj.forEach(project => {
      // console.log(project, "looooo");

      options.push(
        <Option key={project.id} value={project.id}>
          {project.name}
        </Option>
      );
    });

    return options;
  };
  onCheckBoxChange = e => {
    this.setState({
      autoCreateFields: {
        ...this.state.autoCreateFields,
        [e.target.name]: e.target.checked
      }
    });
  };


  render() {
    const { repos } = this.props;
    return (
      <Modal
        title={
          this.state.view == "askdefaults"
            ? `Link your GitHub Project to Channel ${this.state.channel.name}`
            : (this.state.view==="askpermissions"?"Reports":"")
        }
        visible={this.state.visible}
        onCancel={this.skip}
        footer={null}
        width={580}
      >
        {this.state.view == "success" &&<Result
            icon={<CheckCircleOutlined />}
            status="success"
            title="Done"
            subTitle={
              <div>
                Channel: <b>{this.state.channel.name}</b> linked to GitHub
                project: <b>{this.state.project.name}</b>. Reports and
                Notifications are enabled.
              </div>
            }
            extra={[
              <Button
                icon={<SlackOutlined />}
                href={`https://slack.com/app_redirect?team=${
                  this.props.teamId.id
                    ? this.props.teamId.id
                    : localStorage.getItem("teamId")
                }&channel=${this.state.channel.id}`}
                type="primary"
                key="slack"
              >
                Go to #({this.state.channel.name})
              </Button>,
              <br />,
              <Button onClick={this.goToNotif} type="link" key="slack">
                Customize Notifications
              </Button>,
              <br />,
              <Button onClick={this.goToReports} type="link" key="slack">
                Customize Reports
              </Button>
            ]}
          />
        }

        {this.state.view==="askdefaults"&&<React.Fragment>
           
            <div
              className="flex_column"
              style={{ marginBottom: 25, marginTop: 10 }}
            >
              {/* <div className="form_group_label"> Select a default repo </div> */}
              <div className={localStorage.getItem("theme") == 'dark' ? "form_group_label_dark" : "form_group_label"} > Select a default repo </div>

              <Select
                showSearch
                style={{ width: "100%" }}
                placeholder="Select a repo"
                optionFilterProp="children"
                onChange={(value, data) => this.onChange(value, data, "repo")}
                value={this.state.repo.id}
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {repos.map(item => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>

              {this.state.field_error && !this.state.repo.id && (
                <span className="error_message">Repositry is required</span>
              )}
            </div>
            <div
              className="flex_column"
              style={{ marginBottom: 25, marginTop: 10 }}
            >
              <div className="form_group_label"> Select a default project </div>
              <Select
                showSearch
                style={{ width: "100%" }}
                placeholder="Select a project"
                optionFilterProp="children"
                onChange={(value, data) =>
                  this.onChange(value, data, "project")
                }
                loading={this.state.loadingSelect}
                disabled={!this.state.repo.id || this.state.loadingSelect}
                value={this.state.project.id}
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {this.getOptions()}
            
              </Select>
              {this.state.field_error && !this.state.project.id && (
                <span className="error_message">Project is required</span>
              )}
            </div>
            {/* <Alert  style={{marginTop:30}} message="To invite to private channel. Invite  Troopr manually to the channel by typing /invite @troopr" type="info" showIcon /> */}
            <div
              className="row_flex"
              style={{ marginTop: 20, justifyContent: "flex-end" }}
            >
              <Button onClick={this.skip}>Skip</Button>
              &nbsp; &nbsp; &nbsp;
              <Button
                type="primary"
                loading={this.state.loading}
                onClick={()=>this.handleNextPage("askpermissions")}
              >
                Link
              </Button>
            </div>
          </React.Fragment>
        }
      {this.state.view==="askpermissions"&&<React.Fragment>
        
        <div> <Checkbox name="issuesmissingupdates" defaultChecked onChange={this.onCheckBoxChange}>Create Issue By Column Report scheduled every weekday at 10:00 AM.</Checkbox></div>
         <div><Checkbox  name="issuesbycolumn" defaultChecked onChange={this.onCheckBoxChange}>Create Issue Missing Updates Report scheduled every weekday at 10:00 AM.</Checkbox></div> 
         {/* <div> <Checkbox name="standup" defaultChecked onChange={this.onCheckBoxChange}>Create standup {this.state.channel.name} scheduled every weekday at 10:00 AM.</Checkbox></div> */}
         
         <div className="row_flex" style={{ marginTop: 20, justifyContent: "flex-end" }}>
          <Button type="primary" loading={this.state.loading} onClick={this.handleSubmit}>Set up</Button>
          </div>
          </React.Fragment>}

      </Modal>
    );
  }
}

const mapStateToProps = state => {
  return {
    repos: state.github.repos,
    projects: state.github.projects,
    workspace: state.common_reducer.workspace,
    teamId: state.skills.team,
    orgProj: state.github.org_projects,
    repoProj: state.github.repo_projects
  };
};

export default withRouter(
  connect(mapStateToProps, {
    getTeamData,

    getOrganistaionProject,
    getRepoProject,
    getWorkspace,
    sendDefaultLauncher,

    getRepos
  })(GitHubDefaults)
);

// import React, { Component } from 'react'
// import {connect} from 'react-redux'
// import {withRouter} from "react-router-dom"
// import { getOrgAndRepoProject,getRepos} from "../../skills/github/gitHubAction"
// import { Button,Select,Form,Modal} from "antd";
// import OnBoardingSuccess from "../../onBoarding/onBoardingSuccess"
// import { getWorkspace} from '../../common/common_action';
// import axios from "axios"
// const { Option } = Select;
// class GithubChannelSelect extends Component {
//  constructor(props) {
//    super(props)

//    this.state = {
//       visible:true,
//       showSuccess:false,
//       repo:{},
//       project:{},
//       proj_repo:{},
//       project_type:{}
//    }
//  }

// componentDidMount(){
//   this.props.getOrgAndRepoProject(this.props.match.params.wId)
//   this.props.getRepos(this.props.match.params.wId);
//   this.props.getWorkspace(this.props.match.params.wId)
// }
// getRepos=()=>{
// return this.props.repos.map(repo=><Option key={repo.id}  value={repo.id}>{repo.name}</Option>)
// }
// getProjects=()=>{
// return this.props.orgrepoProjects.map(project=><Option key={project.id} name={project.type} value={project.id}>{project.name}</Option>)
// }
// onFormSubmit=()=>{

// if(this.state.repo.id&&this.state.project.id||(this.props.location.state||this.props.location.state.channelId)){
//  let data={
//    repo:this.state.repository,
//    skill_id:this.props.match.params.skill_id,
//    app:"GitHub",
//    project:this.state.project,
//   //  channel:{id:this.props.location.state.channelId,name:this.props.location.state.channelName}
//    channel:{id:"CTSD5TRPX",name:"testttt"},
//    timeZone:this.props.workspace.timezone,
//  }
// // if(project.type=="repo_prj"){
// //   data.project_type.id="repo_prj"
// // }else{
// //   data.project_type="org_prj"
// // }

//  axios.post("/bot/api/workspace/"+this.props.match.params.wId+"/setChannelDefault",data).then(res=>{
//   if(res.data.success){
//     this.setState({showSuccess:true})
//   }
//   // this.setState({showSuccess:true})

// })

// }

// }

// onCancel=()=>{
//   this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}`)
//   this.setState({visible:false})
// }
// onChange(val,event,name){

//   if(name==="repository"){
// this.setState({repo:{id:val,name:event.props.children}})

//   }
//   else if(name==="project"){
//     console.log(event);
//     if(name=="repo_prj"){

//     }
//     // allProjects.push({project_type:{id:"repo_prj",name:"Repo Projects"},proj_repo:{name:this.state.repo.name,id:this.state.repo.id},project:{id:project.id,name:project.name}})
//     this.setState({project:{id:val,name:event.props.children,type:event.props.name}})
//   }

// }

// render() {

//   const {visible,showSuccess}=this.state
//   const { getFieldDecorator, validateFields } = this.props.form;
// return (
//   <React.Fragment>
//   {!showSuccess?
// <Modal
//       visible={visible}
//       onCancel={this.onCancel}
//       onOk={this.onFormSubmit}
//       title="Set up Github Channel Defaults"
//     >
//       <Form layout="vertical" onSubmit={this.onFormSubmit}>
//           <Form.Item label="Select a Repository">
//           {getFieldDecorator('repository', {
//             rules: [{ required: true, message: 'Please Select a Repository!' }],
//           })(<Select
//             showSearch
//             placeholder="Select a Repository"
//             optionFilterProp="children"
//             onChange={(val,event)=>this.onChange(val,event,"repository")}
//             // onSearch={onSearch}
//             filterOption={(input, option) =>
//               option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
//             }
//           >
// {this.getRepos()}
//           </Select>)}
//         </Form.Item>
//         <Form.Item label="Select a Project">
//           {getFieldDecorator('project')(<Select
//             showSearch
//             placeholder="Select a Project"
//             optionFilterProp="children"
//             onChange={(val,event)=>this.onChange(val,event,"project")}
//             filterOption={(input, option) =>
//               option.props.children.toLowerCase().indexOf(input.toLowerCase())>= 0
//             }
//             >
//               {this.getProjects()}
//                  </Select>)}
//         </Form.Item>
//       </Form>
//     </Modal>:
// <OnBoardingSuccess  isJira={false} title="Github Succesfully connected" subtitle="Invite Troopr to a channel to start /invite @troopr." />
//           }
//           </React.Fragment>
//           )
//   }

// }

// const mapStateToProps=(state)=>{
//   console.log(state,"chhheeeekkk");

//   return{
//     orgrepoProjects: state.github.orgrepoProjects,
//     repos:state.github.repos,
//     workspace: state.common_reducer.workspace
//   }
// }
// export default withRouter(connect(mapStateToProps,{getOrgAndRepoProject,getRepos,getWorkspace})(Form.create({ name: "step_open" })(GithubChannelSelect)));

// import React from 'react';
// import { connect } from 'react-redux';

// import { withRouter } from "react-router-dom";
// import queryString from 'query-string';
// import { getOrganistaionProject,getRepoProject,getRepos} from '../../skills/github/gitHubAction';
// import { getChannelList,getTeamData} from '../../skills/skills_action';
// import { getWorkspace} from '../../common/common_action';
// // import {checkSlackLink,getTeamData} from "../skills/skills_action"
// import axios from 'axios';
// import { Button,Select,Modal,Alert,Result,Icon} from 'antd'
// const { Option } = Select;
// class GitHubDefaults extends React.Component {
// 	 constructor(props) {
//    super(props);
//         this.state = {project:{},
//     repo:{},
//     proj_repo:{},
// channel:{},
// project_type:{},
// loading:false,
// field_error:false,
// loadingSelect:false,
// visible:true,
// projectOptions:[],
// allProjects:[],
// orgProjects:[],
// orgProjectsOptions:[],
// view:"invite"

//  }
// this.skip=this.skip.bind(this);
// this.handleSubmit=    this.handleSubmit.bind(this);

//      }

// componentDidMount() {
//     // this.props.getProject(this.props.match.params.skill_id);

//     if(!this.props.workspace._id){
//       this.props.getWorkspace(this.props.match.params.wId)
//     }
//    if(!this.props.teamId.id){

//     this.props.getTeamData(this.props.match.params.wId).then(res=>{
//       // console.log("res=>",res.data.teamId);
//       localStorage.setItem("teamId",res.data.teamId);
//    })
//    }
//  this.props.getChannelList(this.props.match.params.wId);
//     this.props.getRepos(this.props.match.params.wId);
//     this.props.getOrganistaionProject(this.props.match.params.wId).then(res=>{

//                 let orgProjects=[]
//             let orgProjectsOptions=res.data.projects.map(project=>{
//                 orgProjects.push({project_type:{id:"org_prj",name:"Organisation Projects"},project:{id:project.id,name:project.name}})
//                         return <Option key={project.id } value={project.id}>

//                         {project.name}
//                         </Option>

//             })

//             this.setState({orgProjects:orgProjects,orgProjectsOptions:orgProjectsOptions})
//     })

//     const parsedQueryString = queryString.parse(window.location.search);
//     // console.log(parsedQueryString)
//     if( parsedQueryString.view ){
//       let  _obj={view:parsedQueryString.view}
//       if(parsedQueryString.cName){
//         _obj.channel={name:parsedQueryString.cName,id:parsedQueryString.cId}
//         _obj.project={name:parsedQueryString.pName,id:parsedQueryString.pId}
//       }
//       this.setState(_obj)
//     }else{
//       //  this.setState({ step:'personalize'})
//     }
// }

// onChange(value,data,type){

//         this.setState({[type]:{name:data.props.children,id:value}})
//         if(type=="repo" ){

//             this.setState({
//                loadingSelect:true,
//                project:{},
//             //    allProjects:[],
//             //    projectOptions:[]
//               })
//           this.props.getRepoProject(this.props.match.params.wId,value).then(res=>{

//                 let  repoProjects=res.data.projects
//                  let allProjects=[]
//                  let projectOptions=[]

//                 repoProjects.forEach(project=>{
//                     allProjects.push({project_type:{id:"repo_prj",name:"Repo Projects"},proj_repo:{name:this.state.repo.name,id:this.state.repo.id},project:{id:project.id,name:project.name}})
//                     projectOptions.push( <Option key={project.id } value={project.id}>

//                             {project.name}
//                             </Option>)

//                 })

//              projectOptions=projectOptions.concat(this.state.orgProjectsOptions)
//              allProjects=allProjects.concat(this.state.orgProjects)

//           this.setState({
//             projectOptions:projectOptions,
//             allProjects:allProjects,
//             loadingSelect:false

//           });    })

//         }

//     }

//       handleSubmit() {
//         // console.log(this.state)
//         this.setState({loading:true,field_error:false})

//         if(this.state.repo.id  && this.state.channel.id  && this.state.project.id){
//             let data=this.state.allProjects.find(item=>{return item.project.id== this.state.project.id})
//             // let data=this.state
//             data.app="GitHub"
//             data.skill_id=this.props.match.params.skill_id
//             data.timeZone=this.props.workspace.timezone
//             data.repo=this.state.repo
//             data.channel=this.state.channel
//         axios.post("/bot/api/workspace/"+this.props.match.params.wId+"/setChannelDefault",data).then(res=>{
//             this.setState({loading:false})
//     if(res.data.success){
//         this.setState({loading:false})
//         // this.props.history.push("/"+this.props.match.params.wId+"/skills/"+this.props.match.params.skill_id)
//         this.changeStep("success")

//     }else{
//         this.setState({loading:false,field_error:true})

//     }

//         })
//     }else{

//         this.setState({loading:false,field_error:true})

//         }
//       }

//     //   getOptions=()=>{

//     //   }

//     changeStep(step){

//         let  path = window.location.pathname;
//         let obj = {
//           "title": step,
//           "url": path + `?view=${step}`
//         }
//         if(step=="success"){
//           obj.url=obj.url+"&cName="+this.state.channel.name+"&cId="+this.state.channel.id+"&pName="+this.state.project.name+"&pId="+this.state.project.id
//         }
//            window.history.pushState(obj, obj.title, obj.url);

//        this.setState({view:step})
//     }

//     skip(){
//         if(this.props.visible){
//                 this.setState({visible:false})
//         }else{
//             this.props.history.push("/"+this.props.match.params.wId+"/skills/"+this.props.match.params.skill_id)
//         }

//     }

//     goToNotif=()=>{
//         // https://app-stage.troopr.io/5da4544577360439548077eb/skills/5da454461d05673817aff1c1?view=channel_preferences&channel_name=websites&channel_id=CF2DL9ADT
//             this.props.history.push("/"+this.props.match.params.wId+"/skills/"+this.props.match.params.skill_id+"?view=channel_preferences&channel_name="+this.state.channel.name+"&channel_id="+this.state.channel.id)

//     }

//  goToReports=()=> {
//                 this.props.history.push("/"+this.props.match.params.wId+"/skills/"+this.props.match.params.skill_id+"?view=reports")

//             }

//             getOptions=()=>{
//               console.log("Call options")
//           let options=[]
//           this.props.orgProj.forEach(project=>{
//               options.push( <Option key={project.id } value={project.id}>
//                   {project.name}
//               </Option>)
//               })
//           this.props.repoProj.forEach(project=>{

//               options.push( <Option key={project.id } value={project.id}>
//                   {this.state.pr_repo.name+ "/ "+project.name}
//           </Option>
//           )

//           })
//           console.log("options")
//           console.log(options)
//           return options
//           }
//             render() {     const { repos }=this.props;
//   return(

//     <Modal
//           title={this.state.view=="invite"?"Link your GitHub Project":""}
//           visible={this.state.visible}
//         onCancel={this.skip}
//         footer={null}
//         >

//        {/* <Card title="Link your GitHub Project"> */}

//        {this.state.view=="success"? <Result
//             icon={<Icon type="check-circle" />}
//             status="success"
//             title="Done"
//             subTitle={<div>Channel: <b>{this.state.channel.name}</b> linked to GitHub project: <b>{this.state.project.name}</b>. Reports and Notifications are enabled.</div>}
//             extra={[
//               <Button icon="slack" href={`https://slack.com/app_redirect?team=${this.props.teamId.id}&channel=${this.state.channel.id}`} type="primary" key="slack">
//                 Go to #({this.state.channel.name})
//               </Button>,<br/>,
//               <Button  onClick={this.goToNotif} type="link" key="slack">
//             Customize Notifications
//             </Button>,<br/>,
//             <Button  onClick={this.goToReports} type="link" key="slack">
//                       Customize Reports
//           </Button>

//             ]}
//           /> : <React.Fragment>
//            <h4>

//                Linking Github Project with slack Channel will
//                <br/>
//                1.Invite Troopr to the channel
//                <br/>
//                2.Allow members to create and update issues in the channel
//                <br/>
//                3.Update Notification for linked GitHub project <br/>
//                4.Deliver Reports from linked GitHub project.
//            </h4>
//    <div className="flex_column" style={{marginBottom:25,marginTop:10}}>

// <div className="form_group_label" > Select a channel </div>
//    <Select
//                       showSearch
//                       style={{ width: "100%" }}
//                       placeholder="Select a channel"
//                       optionFilterProp="children"
//                       onChange={(value,data)=>this.onChange(value,data,"channel")}

//                       value={this.state.channel.id}

//                       filterOption={(input, option) =>
//                       option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
//                       }>
//                             {this.props.channels.map((item)=>(<Option key={item.id } value={item.id}>

//                         {item.name}
//                         </Option>))}
//                              </Select>

//                              {this.state.field_error && !this.state.channel.id&&<span className="error_message">Channel is required</span>
//                                             }

// </div>

// <div className="flex_column" style={{marginBottom:25,marginTop:10}}>

// <div className="form_group_label" > Select a default repo </div>

//                              <Select
//                       showSearch
//                       style={{ width: "100%" }}
//                       placeholder="Select a repo"
//                       optionFilterProp="children"
//                       onChange={(value,data)=>this.onChange(value,data,"repo")}

//                       value={this.state.repo.id}

//                       filterOption={(input, option) =>
//                       option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
//                       }>
//                             {repos.map((item)=>(<Option key={item.id } value={item.id}>

//                         {item.name}
//                         </Option>))}
//                              </Select>

//      {this.state.field_error && !this.state.repo.id&&<span className="error_message">Repositry is required</span>
//                                             }
// </div>

// <div className="flex_column" style={{marginBottom:25,marginTop:10}}>

// <div className="form_group_label" > Select a default project </div>
//                             <Select
//                                     showSearch
//                                     style={{ width: "100%" }}
//                                     placeholder="Select a project"
//                                     optionFilterProp="children"
//                                     onChange={(value,data)=>this.onChange(value,data,"project")}
//                                     loading={this.state.loadingSelect}
//                                     disabled={(!this.state.repo.id || this.state.loadingSelect)}
//                                     value={this.state.project.id}
//                                     filterOption={(input, option) =>
//                                     option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
//                                     }>

//                                         {this.getOptions()}
//                                           {/* {projects.map((item)=>(<Option key={item.id } value={item.id}>

//                                     {item.name}
//                                     </Option>))} */}
//                          </Select>
//                          {this.state.field_error && !this.state.project.id&&<span className="error_message">Project  is required</span>
//                                             }
// </div>

// <Alert  style={{marginTop:30}} message="To invite to private channel. Invite  Troopr manually to the channel by typing /invite @troopr" type="info" showIcon />
// <div className="row_flex" style={{marginTop:20,justifyContent: "flex-end"}}>
//                             <Button onClick={this.skip}>Skip</Button>
//                             &nbsp; &nbsp; &nbsp;
//                             <Button type="primary" loading={this.state.loading} onClick={this.handleSubmit}>Link</Button>
//                 </div> </React.Fragment> }
//  </Modal>

//                 )
//      }

// }

// const mapStateToProps = state => {
// return {
// repos:state.github.repos,
// projects:state.github.projects,
// workspace: state.common_reducer.workspace,
// teamId:state.skills.team,
// orgProj:state.github.org_projects,
// repoProj:state.github.repo_projects,

// }};

// export default withRouter(connect(mapStateToProps, { getTeamData,

//     getOrganistaionProject,
//     getRepoProject,getChannelList,getWorkspace,

//     getRepos,

//      })(GitHubDefaults));
