import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { addAutomationApi,updateAutomation,getOrganistaionProject,getRepoProject,getProjectColumns,getRepos,deleteAutomation } from '../gitHubAction';
import { Button,Select,Modal,Row } from 'antd'
const { Option } = Select;
class AddAutomationCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pr_repo:{},
            project_column:{},
            project:{},
            field_error:false,
            visible:false,
            errorServer:false,
            pr_action:"",
            loadingSelect:false,
            columnSelect:false

              
        }

        this.onChange=this.onChange.bind(this);
        this.onAdd= this.onAdd.bind(this)
    }

   
  showModal = async() => {
   
    
    this.props.getRepos(this.props.workspace_id)
    if(this.props.state=="edit" && this.props.automation){
            this.props.getOrganistaionProject(this.props.workspace_id)
            this.props.getRepoProject(this.props.workspace_id,this.props.automation.pr_repo.id)
            this.props.getProjectColumns(this.props.workspace_id,this.props.automation.project.id)
       this.setState({
        pr_repo:this.props.automation.pr_repo,
        project_column:this.props.automation.project_column,
        project:this.props.automation.project,
        pr_action:this.props.automation.pr_action,
        visible: true,
        field_error:false,
        errorServer:false,
        }) 


    }else{
        this.props.getOrganistaionProject(this.props.match.params.wId)
 this.setState({ visible: true,
    field_error:false,
    errorServer:false
})   
}
  
};

  handleOk = e => {
    // console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    // console.log(e);
    this.setState({
      visible: false,
      pr_repo:{},
      project_type:{},
      project_repo:{},
      project_column:{},
      project:{},
       pr_action:""
    });
  };
onChange(value,data,type){

if(type=="pr_action"){
    this.setState({[type]:value})
}else{
    this.setState({[type]:{name:data.props.children,id:value}})
    if(type=="pr_repo"){
   
        let orgPrj=this.props.orgProj.find(prj=>{
           return  prj.id==this.state.project.id
        })
        if(orgPrj){
            this.setState({loadingSelect:true}) 
        }else{
            this.setState({loadingSelect:true,project:{},project_column:{}})  
        }

        this.props.getRepoProject(this.props.workspace_id,value).then(res=>{
            this.setState({loadingSelect:false}) 

        })
    
    }else if(type=="project"){
        this.setState({project_column:{},columnSelect:true})
        this.props.getProjectColumns(this.props.workspace_id,value).then(proj=>{

            this.setState({project_column:{},columnSelect:false})
        })
    }
}

  

}
delete=()=>{

    this.props.deleteAutomation(this.props.workspace_id,this.props.automation._id).then(res=>{

        if(res.data.success){
            this.handleCancel()
         }else{
    
            //male error cocde closinhg moda;
            this.setState({
                errorServer:"Error while deleting automation"
             })
         }
    })
}
onAdd(){

if(this.state.pr_repo.id && this.state.pr_action && this.state.project_column.id &&this.state.project.id){
let data={
    pr_repo: this.state.pr_repo,
    pr_action: this.state.pr_action ,
    project_column: this.state.project_column ,
    project:this.state.project
}



if (this.props.state== "add"){
    this.props.addAutomationApi(this.props.workspace_id,data).then(res=>{

     if(res.data.success){
        this.handleCancel()
     }else{

        //male error cocde closinhg moda;
        this.setState({
            errorServer:res.data.message 
         })
     }   
    })
}else
this.props.updateAutomation(this.props.workspace_id,this.props.automation._id,data).then(res=>{
// console.log("Updated status",res.data.success)
    if(res.data.success){
        this.handleCancel()
    }  else{
            this.setState({
                errorServer:res.data.message 
            })

    }})
}else{
    this.setState({field_error:true})
}
}


getOptions=()=>{
let projects=this.props.orgProj.concat(this.props.repoProj)
let options=projects.map(project=>(<Option key={project.id } value={project.id}>
        {project.name}
    </Option>)
    )


return options
}

     render() {
     
     const { repos,columns }=this.props;
        // console.log("skilllinked",skill.linked)
        return (
                 
                    <div>
                

                           { this.props.state== "add"? <Button type="primary" onClick={this.showModal}>  Add Automation   </Button>
 :<a  onClick={this.showModal}>Edit</a>}    
                       
{/* { this.props.state== "add"? <Button type="primary" onClick={this.showModal} style={{marginBottom:"16px"}}>  Add Automation   </Button>
 :"Edit"} */}
{this.state.visible?    
        <Modal
          title={this.props.title}
          visible={this.state.visible}
                footer={null}
          onCancel={this.handleCancel}
        >

<div className="flex_column" style={{marginBottom:25,marginTop:10}}>

<div className="form_group_label" > When PR (containing issue reference in the body/first comment) is  </div>
                                         <Select
                                            showSearch
                                            // 
                                            placeholder="Select a repo"
                                            optionFilterProp="children"
                                            onChange={(value,data)=>this.onChange(value,data,"pr_action")}
                                            style={{ width: "100%" }}
                                            value={this.state.pr_action}
                                            
                                            filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >

                                            <Option key="opened" value="opened">
                                                        Opened
                                            </Option>
                                             
                                        <Option key="reopened" value="reopened">
                                                         Reopened
                                            </Option>
                                        <Option key="closed" value="closed">
                                             Merged/Closed
                                        </Option>
                                        
                                    
                                            
                                        
                                                </Select>
                                            {this.state.field_error && !this.state.pr_action&&<span className="error_message">Staus is required</span> 
                                            }</div>

<div className="flex_column" style={{marginBottom:25,marginTop:10}}>

<div className="form_group_label" > In Repository </div>
                                         <Select
                                            showSearch
                                            // 
                                            placeholder="Select a repo"
                                            optionFilterProp="children"
                                            onChange={(value,data)=>this.onChange(value,data,"pr_repo")}
                                            style={{ width: "100%" }}
                                            value={this.state.pr_repo.id}
                                            
                                            filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                        {repos.map((item)=>(<Option key={item.id } value={item.id}>

                                            {item.name}
                                        </Option>))}
                                                </Select>
                                            {this.state.field_error && !this.state.pr_repo.id&&<span className="error_message">Repositry is required</span> 
                                            }</div>
                                   <div className="flex_column" style={{marginBottom:10}}>         

                                    <div className="form_group_label" >Update the issue in the project </div>
                    
                        <Select
                                    showSearch
                                    style={{ width: "100%" }}
                                    placeholder="Select a project"
                                    optionFilterProp="children"
                                    onChange={(value,data)=>this.onChange(value,data,"project")}
                                    loading={this.state.loadingSelect}
                                    disabled={(!this.state.pr_repo.id || this.state.loadingSelect)}
                        
                                    value={this.state.project.id}
                                    filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }>

                                 {this.getOptions()}
                         </Select>
                          
                             {this.state.field_error && !this.state.project.id&&<span className="error_message">Project type is required</span> 
                                            }
                                            
                     </div>
                                            <div className="flex_column"  style={{marginTop:25,marginBottom:10}}>
                                            <div className="form_group_label" > Move issue to this column </div>
                         <Select
                                    showSearch
                                    
                                    placeholder="Select a column"
                                    optionFilterProp="children"
                                    loading={this.state.columnSelect}
                                    disabled={(!this.state.project.id || this.state.columnSelect)}
                                    onChange={(value,data)=>this.onChange(value,data,"project_column")}
                                    style={{ width: "100%" }}

                                    value={this.state.project_column.id}
                                    filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                     >
                                               {this.state.project.id && columns.map((item)=>(<Option key={item.id } value={item.id}>

                                                    {item.name}
                                                    </Option>))}
                            </Select>
                              
                            {this.state.field_error && !this.state.project_column.id&&<span className="error_message">Project type is required</span> 
                                            } 
                            </div>
                                        {this.state.errorServer &&<div className="error_message">{this.state.errorServer}</div> 
                                            } 
                          
                           { this.props.state!== "add" ?  <div className="row_flex justify_space_between ">  
                             <Button onClick={this.delete} type="danger">Delete </Button> 
                           <Button onClick={this.onAdd} type="primary">Update </Button> 
                           </div>
                        : <Row type="flex" justify="end">  
                            <Button onClick={this.onAdd} type="primary"> Add</Button> </Row>}

                                
                              
            



         
        </Modal>:null}



                 </div>




       
        );
    }
}

     
const mapStateToProps = state => {
    // console.log(state.github)
    
    return {
repos:state.github.repos,
orgProj:state.github.org_projects,
repoProj:state.github.repo_projects,
columns:state.github.columns,


}};     

export default withRouter(connect(mapStateToProps, { 
    updateAutomation,
    addAutomationApi,
    getOrganistaionProject,
    getRepoProject,
    getProjectColumns,
    getRepos,
    deleteAutomation
     })(AddAutomationCard));





















     