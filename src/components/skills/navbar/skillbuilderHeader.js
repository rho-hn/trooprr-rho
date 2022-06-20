import React, { Component } from 'react';
import { withRouter} from 'react-router-dom';
import { connect } from "react-redux";

import { DownOutlined, LockOutlined, MoreOutlined, ShareAltOutlined } from '@ant-design/icons';

import { Menu, Dropdown, Popconfirm, PageHeader } from 'antd';




class SkillBuilderHeader extends Component {

	state={
		routes:[]
	}


	// onBack = () => {
	// 	const { workspace_Id } = this.props;
    //     this.props.history.push(`/${workspace_Id}/skills`);
	// } 




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
			return (
                <Menu>
                    
                <Menu.Item onClick={()=>this.props.updateSkill({scope:"team"})}>
                 <div className="row_flex align_center">
                 <ShareAltOutlined className="lock_icon" />
                    {/* <i className="material-icons lock_icon">share</i> */}
                            Share this skill to your team
                </div>
                </Menu.Item>
                <Menu.Item onClick={()=>this.props.updateSkill({scope:"personal"})}>
                    <div className="row_flex align_center">
                    {/* <i className="material-icons lock_icon">lock</i> */}
                    <LockOutlined className="lock_icon" />
                            Keep this skill private
                </div>
             </Menu.Item>
                </Menu>
            );
		 }

	}








	render(){
		
// console.log("this.props.data1====>",f[f.length-1].name);

let d1 = (<div style={{width: "325px","whiteSpace": "nowrap", "overflow": "hidden","textOverflow": "ellipsis"}}>{this.props.skill.name}</div>)

		// const {} = this.props;
        let inactive=this.props.skill&&this.props.skill.is_enabled?"":"inactive_off"
	   return (
           <PageHeader title={d1 }
           avatar={{style:{backgroundColor: '#402E96' },icon: "apartment" }}
           ghost={false}
           
           extra={[<div style={{display:"flex",alignItems:"center"}}><Dropdown overlay={this.getMenu("skill_active")} pllock_icon_closeacement="bottomLeft" trigger={['click']}>
           <div className={"skill_active_dropdown row_flex align_center " + inactive}>
               {this.props.skill.is_enabled?
       <div className="row_flex align_center">	<span>Active</span></div>:<div className="row_flex align_center ">In Active</div>}
      <DownOutlined style={{marginLeft:"5px",fontSize:"14px"}} />
               
               </div>
           </Dropdown>
               <Dropdown overlay={this.getMenu("skill_share")} pllock_icon_closeacement="bottomLeft" trigger={['click']}>

               <div className="skill_share_dropdown row_flex align_center">
               {this.props.skill.scope==="personal"?
               <div className="row_flex align_center">	
               
               <LockOutlined className="lock_icon" />
               <span>Private</span></div>:<div className="row_flex align_center">  <ShareAltOutlined className="lock_icon" />  Shared</div>}
           
   {/*         
               <i className="material-icons">
           arrow_drop_down
           </i> */}


               </div>
                       </Dropdown>
                           <Dropdown overlay={this.getMenu("other_options")} pllock_icon_closeacement="bottomLeft" trigger={['click']}>
                       <MoreOutlined style={{fontSize:"20px"}} />
               </Dropdown></div>]}/>
       );
	}
}

// export default withRouter(NavbarBreadCrumbs);
const mapStateToProps = state => ({

});


export default withRouter(connect( mapStateToProps,{ })(SkillBuilderHeader)); 