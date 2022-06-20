import React, { Component } from 'react';
import { Breadcrumb } from 'antd';
import { withRouter, Link } from 'react-router-dom';
import { connect } from "react-redux";

import { Menu, Dropdown, Popconfirm} from 'antd';

const routes = [
	{
	  path: 'index',
	  breadcrumbName: 'home',
	},
	{
	  path: 'first',
	  breadcrumbName: 'first',
	  children: [
		{
		  path: '/general',
		  breadcrumbName: 'General',
		},
		{
		  path: '/layout',
		  breadcrumbName: 'Layout',
		},
		{
		  path: '/navigation',
		  breadcrumbName: 'Navigation',
		},
	  ],
	},
	{
	  path: 'second',
	  breadcrumbName: 'second',
	},
  ];


class NavbarBreadCrumbs extends Component {

	state={
		routes:[]
	}


	onBack = () => {
		const { workspace_Id } = this.props;
        this.props.history.push(`/${workspace_Id}/skills`);
	} 

	getMenu=(type)=>{
		
	if(type==="other_options"){
		return(<Menu>
				<Menu.Item onClick={this.props.openSkillEditModal}  >
			 <div >
				Edit Skill
		    </div>
			</Menu.Item>
			<Menu.Item   style={{padding:"0px"}}>
			<Popconfirm placement="leftBottom" title={"Are you sure you want to delete the skill ?"} onConfirm={this.props.deleteSkill} okText="Yes" cancelText="No">
		
			<div style={{padding: "5px 12px", width: "100%"}}>
					Delete Skill
			</div>
		
     		 </Popconfirm>
			
			  </Menu.Item>
		</Menu>)}
		else if(type==="skill_active"){
return(
	<Menu>
				
			<Menu.Item onClick={()=>this.props.updateSkill({is_enabled:true})}>
			 <div className="row_flex align_center">

				
						Activate this skill
		    </div>
			</Menu.Item>
			<Menu.Item onClick={()=>this.props.updateSkill({is_enabled:false})}>
				<div className="row_flex align_center">
				
					InActivate this skill
			</div>
		 </Menu.Item>
		 	</Menu>
)
		}
		else{
			return (<Menu>
				
			<Menu.Item onClick={()=>this.props.updateSkill({scope:"team"})}>
			 <div className="row_flex align_center">

				<i className="material-icons lock_icon">share</i>
						Share this skill to your team.
		    </div>
			</Menu.Item>
			<Menu.Item onClick={()=>this.props.updateSkill({scope:"personal"})}>
				<div className="row_flex align_center">
				<i className="material-icons lock_icon">lock</i>
						Keep this skill private.
			</div>
		 </Menu.Item>
		 	</Menu>)
		 }

	}

	getPageHeader = () =>{
		let itemArray=[];
		this.props.data.forEach(item=>{
			if(item){
				
				itemArray.push({path:item.url,breadcrumbName:item.name})
			}
		})
	
		this.setState({
			routes:itemArray
		})
	}

getBreadCrumbs=()=>{
let itemArray=[];
// console.log("this.props.data",this.props.data);
	this.props.data.forEach(item=>{
		if(item){
			// console.log("rfrrfrrfr===>",<Link>{item.name}</Link>)
			itemArray.push(<Breadcrumb.Item style={{width:"100%"}} ><Link  className="navbar_back_link" to={item.url}>{item.name}</Link></Breadcrumb.Item>)

		}
	})
	return itemArray

}



	render(){
		let f = this.props.data.filter(i=>{
			return i!==null;
		})
// console.log("this.props.data1====>",f[f.length-1].name);

let d1 = (<div className="ellipsis">{f[f.length-1].name}</div>)
		
		const { param1, param2, param3, workspace_Id, skill_Id } = this.props;
		let inactive=this.props.skill&&this.props.skill.is_enabled?"":"inactive_off"
	   return(
        <div className="row_flex" style={{padding: '10px 10%', background: '#f5f5f5', borderBottom: '1px solid #cccccc', height: '80px', alignItems: 'center', justifyContent:"space-between"}}>
		<div className="column_flex" style={{width:"65%"}} >	
		<div className="align_center">
		{/* <i style={{marginRight: '10px', cursor:'pointer'}} className="material-icons navbar-color" onClick={this.onBack}>arrow_back</i> */}
		<div className="row_flex">
       <div style={{cursor:"pointer",color:"rgba(0,0,0,.45)",fontSize:"14px"}} onClick={this.onBack}> Skills  / &nbsp;</div>
		<Breadcrumb separator="/">
		{this.getBreadCrumbs()}
		</Breadcrumb>
		</div>
		</div>
		<div style={{fontSize:"22px",fontWeight:"600",color:"rgba(0, 0, 0, 0.85)",paddingTop:"2px"}}>{d1}</div>
		{/* {this.props.data[2].name} */}
		{/* <PageHeader title="Guest Configuration" breadcrumb={{routes}}></PageHeader> */}
		</div>

		{this.props.skill && <div className="row_flex align_center">
        <Dropdown overlay={this.getMenu("skill_active")} pllock_icon_closeacement="bottomLeft" trigger={['click']}>
        <div className={"skill_active_dropdown row_flex align_center " + inactive}>
{this.props.skill.is_enabled?
<div className="row_flex align_center">	<span>Active</span></div>:<div className="row_flex align_center ">In Active</div>}


<i className="material-icons">
arrow_drop_down
</i>	</div>
		</Dropdown>

	<Dropdown overlay={this.getMenu("skill_share")} pllock_icon_closeacement="bottomLeft" trigger={['click']}>

	<div className="skill_share_dropdown row_flex align_center">
	{this.props.skill.scope==="personal"?
	<div className="row_flex align_center">	<i className="material-icons lock_icon">lock</i><span>Private</span></div>:<div className="row_flex align_center"><i className="material-icons lock_icon">share</i>Shared</div>}


	<i className="material-icons">
arrow_drop_down
</i>	</div>
			</Dropdown>
				

			<Dropdown overlay={this.getMenu("other_options")} pllock_icon_closeacement="bottomLeft" trigger={['click']}>
				<i className="material-icons" style={{cursor:"pointer",color:"#423393"}}>
				more_vert
				</i>
			</Dropdown>
  </div> 
			  }
			
             </div>
			);
	}
}

// export default withRouter(NavbarBreadCrumbs);
const mapStateToProps = state => ({
  assistant_skills:state.skills.skills,
});


export default withRouter(connect( mapStateToProps,{ })(NavbarBreadCrumbs)); 