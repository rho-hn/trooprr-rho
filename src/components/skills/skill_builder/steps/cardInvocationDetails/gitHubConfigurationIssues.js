import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import {  getRepoLabels,getRepos,getv3Milestones } from '../../../github/gitHubAction';
import { Button,Select,Row,Input } from 'antd'
const { Option } = Select;
class GitHubConfiguration extends Component {
    constructor(props) {
        super(props);
        this.state = {
           
            labels:[],
            assignees:"",
            repoId:"",
            graphTitle:"",
            x_axis_title:"",
            y_axis_title:"",
            period:5,
            milestone:"",
            reponame:"",
            field_error:false      
        }
        this.onChange=this.onChange.bind(this);
         this.onAdd= this.onAdd.bind(this)
         this.onChangeInput= this.onChangeInput.bind(this)
    }
   componentDidMount(){
  
    this.props.getRepos(this.props.match.params.wId)
    if(this.props.data.cardInformation && this.props.data.cardInformation.cardInformation){
        let data= this.props.data.cardInformation.cardInformation
        this.setState({
            labels:data.labels,
             assignees:data.assignees,
            repoId:data.repoId,
            x_axis_title:data.x_axis_title,
            y_axis_title:data.y_axis_title,
            graphTitle:data.graphTitle,
            period:data.period,
            milestone:data.milestone,
          reponame:data.reponame
        })
     
        
        this.props.getv3Milestones(this.props.match.params.wId,data.reponame)
    }

   }
  
   onChangeInput(e){
       if(e.target.name=="period" && isNaN(e.target.value)){
        //   console.log("Not a number")

       }else{
        this.setState({[e.target.name]:e.target.value})
       }

   
   }
onChange(value,data,type){
// console.log(value,data,type)

    this.setState({[type]:value})
    
if(type=="repoId"){
  
    this.setState({"reponame":data.props.children})
//   this.props.getRepoAssignableUsers(this.props.match.params.wId,value) 
  this.props.getRepoLabels(this.props.match.params.wId,value) 
  this.props.getv3Milestones(this.props.match.params.wId,data.props.children)
}
}

 onAdd(){
 

    if(this.state.repoId && (this.props.template.meta.period && this.state.period|| !this.props.template.meta.period)    ){
        let data=Object.assign({}, this.state);
        delete data.field_error  
        // let keys=Object.keys(data)
        //  keys.forEach(key => {
        //      if(!data[key]){

        //         delete data[key]
        //      }
         
        // });
        if(this.props.template.meta && this.props.template.meta.x_axis){
            data.x_axis=this.props.template.meta.x_axis
        }
 
        if(this.props.template.meta && this.props.template.meta.y_axis){

            data.y_axis  = this.props.template.meta.y_axis
        }
    //  this.props.data.cardInformation.x_axis=this.props.template.meta.field
        this.props.data.cardInformation.card_template_id=this.props.template._id
        this.props.data.cardInformation.key= this.props.template.key
    this.props.data.cardInformation.cardInformation= data 
    // console.log("this is data", this.props.data)
    this.setState({field_error:false})
    this.props.nextStep()
}else{
    this.setState({field_error:true})
}
 }
  
 
// data={this.state.data} template={this.state.selectedTemplate} nextStep={()=>this.onStepChange("trigger_step")}

     render() {
     
     const { repos,labels,milestones }=this.props;



        
        return (
                 <div>
                        <div className="flex_column" style={{marginBottom:10}}>
                        <div className="form_group_label" > Repository </div>
                            <Select
                                            showSearch
                                            placeholder="Select a repo"
                                            optionFilterProp="children"
                                            onChange={(value,data)=>this.onChange(value,data,"repoId")}
                                            style={{ width: "100%" }}
                                            value={this.state.repoId}
                                            
                                            filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                        {repos.map((item)=>(<Option key={item.id } value={item.id}>

                                            {item.name}
                                        </Option>))}
                            </Select>
                            {this.state.field_error && !this.state.repoId&&<span className="error_message">Repositry is required</span> 
                                            }
                        </div>
                                     

                                

                
                    
                             <div className="flex_column"  style={{marginBottom:10}}>
                                        <div className="form_group_label" >Filter: Milestone (Optional)</div>
                                <Select
                                    showSearch
                              
                                    style={{ width: "100%" }}
                                    placeholder="Select a milestone"
                                    allowClear
                                    optionFilterProp="children"
                                    onChange={(value,data)=>this.onChange(value,data,"milestone")}
                                    value={this.state.milestone}
                                    filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }>

                                          {milestones.map((item)=>(<Option key={item.id } value={item.id}>

                                   {item.title}
                                    </Option>))}
                         </Select>
                          </div>
                          
                                            <div className="flex_column"  style={{marginBottom:10}}>
                                            <div className="form_group_label" >Filter: Labels (Optional)</div>
                         <Select
                                    showSearch
                                    mode="multiple"
                                    placeholder="Select a labels"
                                    optionFilterProp="children"
                                    onChange={(value,data)=>this.onChange(value,data,"labels")}
                                    style={{ width: "100%" }}
                                    value={this.state.labels}
                                    filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                     >
                                               {labels.map((item)=>(<Option key={item.id } value={item.name}>

                                                    {item.name}
                                                    </Option>))}
                            </Select>

                          
                          
                            </div>
                           {this.props.template.meta.period && 
                                <div className="flex_column"  style={{marginBottom:10}}>
                                <div className="form_group_label" >{this.props.template.meta.periodTitle}</div>
                                <Input  type = "text"  className="custom_input" onChange={this.onChangeInput}  name="period" value={this.state.period} placeholder="Enter days"   autoComplete="off"/>
                                {this.state.field_error && !this.state.period&&<span className="error_message">Field is required</span> 
                                            }
                                </div>
                                }
                            {/* {this.props.template.meta.isGraph &&

                  
                                                        
                                <div className="flex_column"  style={{marginBottom:10}}>
                                <div className="form_group_label" >Graph title</div>
                                <Input  type = "text"  className="custom_input" onChange={this.onChangeInput}  name="graphTitle" value={this.state.graphTitle} placeholder="Enter graph title"   autoComplete="off"/>
                                </div>}
                                {this.props.template.meta.isGraph &&    <div className="flex_column"  style={{marginBottom:10}}>
                                <div className="form_group_label" >X-Axis title</div>
                                <Input  type = "text" className="custom_input" onChange={this.onChangeInput}   value={this.state.x_axis_title}  name="x_axis_title" placeholder="Enter x-axis title"   autoComplete="off"/>
                                </div>}
                                {this.props.template.meta.isGraph &&      <div className="flex_column"  style={{marginBottom:10}}>
                                <div className="form_group_label" >Y-Axis title</div>
                                <Input  type = "text"  className="custom_input" onChange={this.onChangeInput}   name="y_axis_title" value={this.state.y_axis_title} placeholder="Enter y-axis title"   autoComplete="off"/>
                                </div>} */}
                                
                            
                                        {this.state.errorServer &&<span className="error_message">{this.state.errorServer}</span> 
                                            } 
                            <Row type="flex" justify="end">


                            <Button onClick={this.onAdd} type="primary">       {this.props.skill_type=="app_home"?this.props.mode === "edit" ? "Update" : "Save":"Next"}   </Button> 
    </Row>
                                
                              
            

</div>

        


       
        );
    }
}

     
const mapStateToProps = state => {
   
    
    return {
    
repos:state.github.repos,
// assignees:state.github.repo_assignableUsers,
labels:state.github.repo_labels,
milestones:state.github.repoV3Milestones


}};     

export default withRouter(connect(mapStateToProps, { 
    getRepoLabels,
    getRepos,
    getv3Milestones
     })(GitHubConfiguration));





















     