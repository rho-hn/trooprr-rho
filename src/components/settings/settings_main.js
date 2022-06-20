import React, { Component,Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { ControlOutlined } from '@ant-design/icons';
import { Spin, PageHeader, Tabs, Typography, Button, Select, notification } from "antd";
import axios from "axios"
const { TabPane } = Tabs;
const { Option } = Select;
const {Title} = Typography;

class Workflow extends Component {

  constructor() {
    super();
    this.state = {
      loading: false,
      isProfileView: true,
      assistant_name: "Troopr Assistant",
      team:{},
      skills:[],
      defaultSkill:"",
      nameLoading:false,
      defaultLoading:false
    };
  }
 

  componentDidMount(){
      this.setState({ loading: true})
    // let teamPromise=axios.get("/bot/api/"+this.props.match.params.wId+"/getTeamData")
    let skill=axios.get("/bot/workspace/"+this.props.match.params.wId+"/assistant_skills")
      Promise.all([skill]).then(data=>{
        
          let defaultSkill={}
          let skills=[]
         data[0].data.skills.forEach(skill=>{

          if(skill.type=="Project Management"){
            skills.push(skill)
            if(skill.default){
              defaultSkill=skill
            }
          }
            
            
     

      })
// console.log(data[1].data.skills)
// console.log(skills)

        this.setState({ skills:skills,defaultSkill:defaultSkill.name,loading: false})

      })
  }
  onTabClick=(key)=>{
    (key == "profile")?this.setState({isProfileView:true}):this.setState({isProfileView:false})
  }

  onNameChange = str => {
    this.setState({ assistant_name:str });
  }

  handlePMChange = (value) => {
    this.setState({ defaultSkill:value});

  }

  onSubmitName=()=>{
    let data={assisantName:this.state.assistant_name}
    this.setState({nameLoading:true})
  
    axios.put("/bot/api/workspace/"+this.props.match.params.wId+"/team",data).then(res=>{
      this.setState({nameLoading:false})
if(res.data.success){

 

}else{

}


    })
  }
  setDefault=()=>{
    // let data={assisantName:this.state.assisant_name}
    this.setState({defaultLoading:true})
    
    let data={default:true}

    axios.put("/bot/api/workspace/"+this.props.match.params.wId+"/assistant_skills/"+this.state.defaultSkill,data).then(res=>{
      this.setState({defaultLoading:false})
if(res.data.success){
  notification.success({
    key: "projectstatus",
    message: "Default Project Management Skill Updated",
    // description: "If there is data to be sent, it will reach the configured Slack channel",
    placement: "bottomLeft",
    duration: 2,
  })
        // if(name=="Troopr"){
        //   this.props.history.push("/"+this.props.match.params.wId+"/troopr_default/"+res.data.skill._id)
        // }else{
        //   this.props.history.push("/"+this.props.match.params.wId+"/skills/"+res.data.skill._id) 
        // }
    // this.props.history.push("/"+this.props.match.params.wId+"/skills/"+res.data.skill._id)

}else{

}


    })
  }
  render() {
    return (
      <Fragment>

{this.state.loading?<div style={{height:"calc(100vh - 55px)",width:"100vw",display:"flex",alignItems:"center" ,justifyContent:"center"}}><Spin size="large" /></div>: 
        <PageHeader title="Assistant Settings" footer={
            <Tabs    
            onTabClick={this.onTabClick}
            >
              
              {/* <TabPane tab={
                  <span><Icon type="profile" />Profile</span>
                } 
                key="profile"  
              >
              <div style={{margin: "30px 100px" }}>
               
                <Title level={3}>Assistant Name</Title>
                <Paragraph editable={{ onChange: this.onNameChange }}>{this.state.assistant_name}</Paragraph>
                <Button loading={this.state.nameLoading} onClick={this.onSubmitName} type="primary">Update</Button>
                </div>
              </TabPane> */}
              <TabPane tab={ 
                  <span><ControlOutlined />Preferences</span>
                } 
                key="preferences" 
              >
                <div style={{margin: "30px 100px" }}>
                  <Title level={3}>Default Project Management Skill</Title>
                  <Select defaultValue="Jira" style={{ width: 150 }} value={this.state.defaultSkill} onChange={this.handlePMChange}>
              {this.state.skills.map(skill=>( <Option value={skill.name}>{skill.name}</Option>))
                  
              } 
                   
                  </Select><br/><br/>
                  <Button loading={this.state.defaultLoading} onClick={this.setDefault} type="primary">Update</Button>
                </div>
              </TabPane>        
            </Tabs>
          }>
        </PageHeader>
        }

      </Fragment>
    );
  }

}

const mapStateToProps = state => ({
  
});

export default withRouter(
  connect(mapStateToProps)(Workflow)
)
