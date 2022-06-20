import React, { Component } from 'react';

import picker_empty_state from '../../../images/picker_empty_state.svg'
import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import PrivateWorkspaceSelect from './privateWorkspaceSelect'

class EmptyStateProjectPicker extends Component {


 render() {
 const {privatePicker,createWorkspace,publicWorksapce}=this.props;
 

 


  return(
    
<div className="picker_empty_state_container d-flex flex-column justify-content-center align-items-center">
        <img src={picker_empty_state}/>
        {privatePicker && <div className="d-flex flex-column  align-items-center">
            <div className="heading_message">
                Your Private Space is empty.
            </div>
            <div className="sub_heading_message">
            Mark any workspace as Private to view it here. 
            </div>
           < PrivateWorkspaceSelect workspaces={publicWorksapce} isPickerEmpty={true}/>
        <div className="d-flex picker_divider align-items-center justify-content-between">
        <div className="picker_line">
        </div>
        OR
        <div className="picker_line">
        </div>
        
        </div>
        
    </div>
        }
<div className="d-flex add_workspace_btn" onClick={createWorkspace}>+ Create new Workspace</div>
</div>


    )}  }




export default connect(null, {})(EmptyStateProjectPicker)
