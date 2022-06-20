import React, { Component} from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getAssisantSkills,setCurrentSkill } from "../skills/skills_action";
import {  Row,PageHeader } from "antd";
import CardHoverDetails from "../skills/skill_builder/cardHoverDetails";
const divStyle={
  overflowY: 'auto',                                                                                                                                                                
};

class Workflow extends Component {
  //   // let workspaceId = window.location.href.split("/")[4];
//   // if(workspaceId){
//   //   localStorage.setItem("userCurrentWorkspaceId", workspaceId);

//   // }
//   let workspaceId = window.location.href.split("/")[4];
//   let localWorkspacerId = localStorage.getItem("userCurrentWorkspaceId");
// if(workspaceId !== localWorkspacerId){
//   localStorage.setItem("userCurrentWorkspaceId", workspaceId);

// }
componentDidMount() {


if(this.props.assistant_skills.length<=0){
   this.setState({ loading: true });
  this.props.getAssisantSkills(this.props.match.params.wId).then(res => {
  this.setState({ loading: false });
  });
}
   
          
         
    // this.setState({skillView:parsedQueryString,loading: false})

  
  
 
}

onSkillClick = (skill )=> {
  //     this.props.getCurrentSkill(this.props.match.params.wId,this.props.match.params.skill_id).then(res=>{
  //       let info=getHeaderInfo(res.data.skill.name)
  //   info.defaultTab=parsedQueryString.view
  //   this.setState({headerInfo:info,skillView:parsedQueryString,loading: false})
  //  })
  
    this.props.setCurrentSkill(skill)
        // let info=getHeaderInfo(skill.name)
        // let parsedQueryString = queryString.parse(window.location.search);
        // info.defaultTab=parsedQueryString.view
        // this.setState({headerInfo:info,skillView:parsedQueryString,loading: false})
        this.props.history.push({

          // /:wId/skill/:skill_id/skillbuilder
          pathname: `/${this.props.match.params.wId}/skill/${skill._id}/skillbuilder`,
          // state: { skill }
        })
  
    
    };
onSkillEdit=(skill)=>{ 
  // this.setState({showEditModal:true,selectedTemplate:skill})
  
}
render() {
  const filteredSkills =this.props.assistant_skills.filter(skill => (
    skill.type === "custom"
      
    ))
  return (



    <div className="main_skill_container">

    <PageHeader
    
    avatar={{style:{backgroundColor: '' },icon: "apartment" }}
  ghost={false}
  title="WorkFlow"

  

/>


{filteredSkills.length>0?<div className="skills_container" style={divStyle}><Row gutter={[22, 22]} align="middle">
              {filteredSkills.map((skill, index) => {
                return (
                  <CardHoverDetails
                    key={skill._id}
                    skill={skill}
                    logo={skill.logo.url}
                    onSkillClick={() => this.onSkillClick(skill)}
                    onSkillEdit={()=>this.onSkillEdit(skill)}
                  />
                );
              })}
        
        
            </Row> </div> :
            
            <Row type="flex" justify="center" align="middle" style={{height: "calc(100vh - 64px)"}}>
      
          <img style={{height:"150px"}} src="https://app.troopr.io/logo/comingsoon_undraw.svg" alt=""></img>
        
        </Row>
           
      }
    </div>
  );
  }
}

const mapStateToProps = state => ({
  assistant_skills: state.skills.skills,
});

export default withRouter(
  connect(mapStateToProps,{setCurrentSkill,getAssisantSkills})(Workflow)
)
