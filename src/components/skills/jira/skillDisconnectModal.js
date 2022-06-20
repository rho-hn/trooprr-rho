import React from 'react';
import { Modal } from 'antd';

class DisconnectSkill extends React.Component {
  

    render() {
        return (
            <Modal visible={this.props.modal} toggle={this.props.toggle}>
                <div className="justify-content-center common-confirmation-modal-del">
                <div style={{whiteSpace:'inherit'}} className="d-flex flex-column justify-content-center commmon-confirmation-modal-body-content align-items-center">
                    <div>
                        You are currently connected to the Jira domain
                    </div> 
                    <div
                        className="d-flex justify-content-center">
                        "{this.props.domain}"
                    </div>
                    <div 
                        className="d-flex flex-wrap justify-content-center">
                        Disconnecting the Jira domain will disconnect Jira access for the entire team.
                    </div>
                    </div>
                     <div style={{fontSize:'20px',marginTop:'10px'}} className="d-flex justify-content-center">
                         Are you sure?   
                    </div>
                    <div style={{marginTop:'24px'}}
                    className="d-flex justify-content-center align-items-center">
                        <div className="confirmation-button secondary_btn justify-content-center btn_114"   
                        onClick={this.props.toggle}>
                           Cancel
                    </div>

                     <div 
                     className="confirmation-button btn_114"
                     style={{marginLeft:'24px'}}   
                     onClick={this.props.onClick}>
                             {this.props.Button}     
                     </div>
                    </div>
    
               </div>
            </Modal>
        );
    }
}


export default DisconnectSkill; 