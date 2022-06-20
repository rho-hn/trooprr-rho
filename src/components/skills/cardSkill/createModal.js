import React, { Component} from "react";
import { Modal, Button,Spin, Row} from 'antd';
import { connect } from "react-redux";
import SelectCard from "../skill_builder/steps/cardInvocationDetails/SelectCard";
import {getCardTemplates} from "../skill_builder/steps/CardActions"
import CardTemplateList from "../skill_builder/steps/CardTemplateList";

class TemplateModal extends Component {

  state = { visible: false,
    showCreateModal:false,selectedTemplate:{},loading:false };

// componentDidMount(){
//     this.props.getCardTemplates(this.props.skill.name)
// }
  showModal = () => {
    this.setState({ visible: true,loading:true})
    this.props.getCardTemplates(this.props.skill.name).then(res=>{
        
        this.setState({loading:false})
     } )

  };

  handleOk = e => {
    
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    
    this.setState({
      visible: false,
    });
  };

  //create modal
  showCreateModal = (template) => {
      
    this.setState({
        showCreateModal: true,
        selectedTemplate:template
    });
  };
;

createModalCancel = type => {
if(type=="add"){
    this.setState({
        showCreateModal: false,   visible: false,
    });
}else{
    
    this.setState({
        showCreateModal: false,
    });  
   
  }
}



//   showCreateModal()
  render() {
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
        Create
        </Button>
        <Modal style={{width:"100vw",height:"100vh",top:0}}
        width="100vw"
          title="Select a Template"
          onCancel={this.handleCancel}
          bodyStyle={{height:"calc(100vh - 55px)",overflow:"auto"}}
          visible={this.state.visible}
         footer={null}
        >
        <Row gutter={[25, 25]} align="middle">
            {this.state.loading?<div style={{height:"calc(100vh - 55px)",width:"100vw",display:"flex",alignItems:"center" ,justifyContent:"center"}}><Spin size="large" /></div>:   
         this.props.cardTemplates.filter(item=>!item.isHidden).map( item=>(
               <CardTemplateList cards={item} showModal={()=>this.showCreateModal(item)}/>
            )

          
         )
         
         
         }

         </Row>
        </Modal>
        {this.state.showCreateModal&& <SelectCard
     template={this.state.selectedTemplate}
     visible={this.state.showCreateModal}
     cancel={this.createModalCancel}
   />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
    //   currentSkill: state.skills.currentSkill,
    cardTemplates: state.cards.templateCards,
    
    });
    
    export default 
      connect(mapStateToProps, {
        getCardTemplates
      })(TemplateModal)
    



