import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';
import {updateProject,getProject} from '../projectActions';
import {Card,Button,Input} from "antd";

const { TextArea } = Input;

class BasicDetails extends Component {
  constructor(props){
    super(props);
    this.state = {
      edit:false,
      project_name:'',
      color:'',
      description:'',
    };
    this.update = this.update.bind(this);
    this.editDetails = this.editDetails.bind(this);
    this.onColorChange = this.onColorChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onCancle = this.onCancle.bind(this);
  }

  onChange(e){
    this.setState({
      [e.target.name] : e.target.value
    });
  }

  update(){
    let data = {};
    const{project_name,color,description} = this.state;
    const {project,updateProject} = this.props;

    if(project_name !== project.name){
      data.name = project_name;
    }
    if(color !== project.color){
      data.color = color;
    }
    if(description !== project.description){
      data.description = description
    }
    if(project_name !== project.name || color !== project.color || description !== project.description){
      updateProject(this.props.project._id, data,this.props.match.params.wId).then(res=>{
        if(res.data.success){
          this.setState({edit:false});
        }
      });
    }else{
      this.setState({edit:false})
    }
    this.setState({edit:false});
  }

  onCancle(){
    this.setState({edit:false})
    this.setState({project_name:this.props.project.name});
    this.setState({description:this.props.project.description},()=>{
      // console.log("xyz",this.state.description);
      // console.log("abc",this.props.project)
    });
  }


  editDetails(){
    this.setState({edit:true});
  }

  onColorChange(color){
    this.setState({color})
  }

  componentDidMount(){
    const id = this.props.location.pathname.split('/')[4]
    this.props.getProject(id,this.props.match.params.wId).then(res =>{
      const {project} = res.data;
      this.setState({project_name:project.name});
      // if(project.description){
        this.setState({description:project.description});
      // }
    })

  }


  render() {
    const {project} = this.props;
    const color = project.color;
    return (
      <div className="d-flex flex-column ">
        {/* <div className="d-flex align-items-center project-setting-basic-details-header">
           Basic details
        </div>
        <hr className="basic-details-hr"/> */}

        {this.state.edit === true ?
          <Card title="Project Name">
            <div className="d-flex flex-column">
              <Input type="text" style={{marginBottom:'20px'}}value={this.state.project_name}  onChange={this.onChange}
               name="project_name" />
            </div>
            <div className="">
            <div className="basic-details-edit-header">Project Description </div>
            <TextArea rows={4} style={{marginTop:'20px',marginBottom:'20px'}}name="description" onChange={this.onChange} value={this.state.description}>
            </TextArea>
            </div>
            {/* <div className="project-setting-edit-project-theme">Project Theme</div>
            <div className="d-flex custom_dropdown_item color-box-items">      
              <div className="colorBox proj-color-box bg_Color1 d-flex align-items-center justify-content-center"
                    onClick={() => this.onColorChange("#de350a")}>
                    <div className={classnames({active_color_box: this.state.color === "#de350a"})}/>
              </div>
              <div className="colorBox proj-color-box bg_Color2 d-flex align-items-center justify-content-center"
                    onClick={() => this.onColorChange("#ff8b01")}>
                    <div className={classnames({active_color_box: this.state.color === "#ff8b01"})}/>
              </div>
                  <div className="colorBox proj-color-box bg_Color3 d-flex align-items-center justify-content-center"
                    onClick={() => this.onColorChange("#00875a")}>
                    <div className={classnames({active_color_box: this.state.color === "#00875a"})} />
               </div>
                <div className="colorBox proj-color-box bg_Color4 d-flex align-items-center justify-content-center"
                    onClick={() => this.onColorChange("#008da6")} >
                    <div className={classnames({active_color_box: this.state.color === "#008da6" })}/>
               </div>
              <div className="colorBox proj-color-box bg_Color5 d-flex align-items-center justify-content-center"
                    onClick={() => this.onColorChange("#0052cc")}>
                    <div className={classnames({ active_color_box: this.state.color === "#0052cc" })}/>
              </div>
              <div className="colorBox proj-color-box bg_Color6 d-flex align-items-center justify-content-center"
                    onClick={() => this.onColorChange("#403294")}>
                    <div className={classnames({active_color_box: this.state.color === "#403294"})} />
              </div>
              <div className="colorBox proj-color-box bg_Color7 d-flex align-items-center justify-content-center"
                    onClick={() => this.onColorChange("#42526e")}>
                    <div className={classnames({active_color_box: this.state.color === "#42526e"})} />
              </div>
            </div> */}
            <div className="d-flex justify-content-end">
            <Button className=" btn_114" style={{marginRight:'16px'}} onClick={this.onCancle}>Cancel</Button>
            <Button type="primary" className="btn_114"  onClick={this.update}>Save</Button>
            </div>
          </Card> :

        
        <Card title='Project Name' >
          <div className="">
          <div className="basic-details-item-value">{project.name}</div>
          </div>
          <div className="d-flex flex-column ">
          <div className="d-flex justify-content-between ">
            <div className="basic-details-edit-header">Project Description</div>
          </div>
          
            <div style={{marginTop:"10px"}}className="basic-details-item-value basic-detail-project-description">
            {project.description}
            </div>
          </div>
           {/* <div className="d-flex  basic-details-item-container">
            <div className="d-flex justify-content-between basic-details-item">
             <div>Project Theme</div>
             <div>:</div>
            </div>
           <div className="project-theme-block" style={{backgroundColor:color}}></div>
          </div> */}
          <div className="d-flex  justify-content-end ">
            <Button className="btn_114"  onClick={this.editDetails}>Edit</Button>
          </div>
         </Card>}
      </div>
    );
  }
}

const mapStateToProps = (state) =>({
  project:state.projects.project
})

export default withRouter(connect(mapStateToProps, {updateProject,getProject})(BasicDetails))
