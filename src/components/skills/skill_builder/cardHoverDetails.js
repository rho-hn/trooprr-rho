import React, { Component } from "react";
import Popup from "../../common/Popover"
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { ApartmentOutlined, BarsOutlined, SettingOutlined } from '@ant-design/icons';
import {Card, Avatar, Col, Button } from "antd";
import {excecuteCardSkill,updateCardSkills} from "./steps/CardActions"

const { Meta } = Card;
const logos = require.context('../../../media', true);

class CardHoverDetails extends Component {


  handleClick = skill => {
    this.props.onSkillClick(skill);
  };
  handleEditClick=(skill)=>{
    

    this.props.onSkillEdit(skill)
  }
  runNow=(skill)=>{
    const skill_id=skill._id;
    this.props.excecuteCardSkill(skill_id)
  }
  handleDisable=(skill,e,isEnabled)=>{

    const skill_id=skill._id;
    let data={
      _id:skill_id,
      EditOnly:true
    }
    if(isEnabled){
      e.stopPropagation();
     
      data["is_enabled"]=true
    }
   else {
      
      data["is_enabled"]=false
     
    }
     this.props.updateCardSkills(data)
  
    
  }

  render() {
    const { skill } = this.props;
  return (
    <div key={skill._id} onClick={() => this.handleClick(skill)}>
      {(skill.type === "system" ||skill.type === "custom") ? (
          <Col span={8}>
            <Card 
            // fullWidth  bodyStyle={{marginBottom: "-5px"}}
              actions={[
                <Button icon={<SettingOutlined />} type="link">
              Configure
            </Button>
              ]}
              hoverable
            >
              {skill.type==="system"?<Meta
                avatar={<Avatar src={logos('./' + skill.logo.url)} />}
                title={skill.name} 
                description={skill.desc}
                style={{ height: "75px", overflow:"hidden" }}
              />:
              <Meta

                avatar={<Avatar icon={<ApartmentOutlined />} className="avatar_styles"   />}
                title={skill.name} 
                description={skill.desc}
                style={{ height: "75px", overflow:"hidden" }}

              />
            }
      
            </Card>
          </Col>
        ):<Col span={8}>
        <Card 
        actions={skill.is_enabled?[<div className="action_colors">Manage</div>,<Popup runNow={()=>this.runNow(skill)} disable={()=>this.handleDisable(skill)} edit={()=>this.handleEditClick(skill)}/>]:[<div onClick={(e)=>this.handleDisable(skill,e,true)}>Enable</div>]}
          hoverable
        >
          <Meta
            avatar={<Avatar icon={<BarsOutlined />} className="avatar_styles"  />}
            title={skill.name} 
            description={skill.desc}
            style={{ height: "75px", overflow:"hidden" }}
          />
        </Card>
      </Col>}
      

        
    </div>
  );
  }
}
export default withRouter(
  connect(null, {
excecuteCardSkill,updateCardSkills
  })(CardHoverDetails)
);

