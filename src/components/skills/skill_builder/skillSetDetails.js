import React, { Component } from 'react';
import NavbarBreadCrumbs from '../navbar/navbarBreadCrumbs';
import { withRouter } from "react-router-dom";
import { Input, Upload, Button } from 'antd';

class SKillSetDetails extends Component {
	constructor(){
		super()
		this.state = {
			skillSetName: '',
			skillSetLogo: ''
		}
	}

	setSkillSetName = (event) => {
         this.setState({skillSetName: event.target.value})
	}

	goToNext = () => {
		 // this.props.history.push(`/${this.props.match.params.wId}/skill/skilldetails`)
		 const { skillSetName, skillSetLogo } = this.state;
		 if( skillSetName ){
		 	this.props.skillSetName.name = this.state.skillSetName
		 	this.props.skillSetLogo.name = this.state.skillSetLogo
		 	this.props.onNext()
		 }
	}

	uploadLogo = (event, url) => {
		
		this.setState({skillSetLogo: event.file.name})
	}

	render(){
		return(
             <div>
             <NavbarBreadCrumbs param1="SkillSet" param2="New SkillSet" workspace_Id={this.props.match.params.wId}/>
              <div style={{display: 'flex', flexDirection: 'column', alignItems:'center', justifyContent: 'center', height: 'calc(100vh - 80px)'}}>
              <div style={{marginBottom: '15px', width: '15.5%'}}>
                <Input 
                    style={{width: 200}}
                    placeholder="SkillSet Name"
                    onChange={this.setSkillSetName}
                />
              </div>
              <div style={{width: '15.5%', marginBottom: '15px'}}>
                <Upload url onChange={this.uploadLogo}>
				    <Button>
				       Skill Logo
				    </Button>
			    </Upload>
			   </div>
			   <div style={{width: '15.5%', marginBottom: '15px'}}>
			     <Button type="primary" onClick={this.goToNext}>
				       Next
				 </Button>
              </div>
              </div>
             </div>
			);
	}
}

export default withRouter(SKillSetDetails);