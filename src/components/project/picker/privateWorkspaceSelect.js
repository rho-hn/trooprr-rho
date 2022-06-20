import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from "react-redux";
import { Input } from "reactstrap";
import { updateWorkspaceShowStatus } from "../../workspace/workspaceActions";

class PrivateWorkspaceSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
         workspace_id:''
        };
       
        this.handleWorksapceChange=this.handleWorksapceChange.bind(this)
        this.markWorkspacePrivate= this.markWorkspacePrivate.bind(this)
    }

    handleWorksapceChange(e){
        this.setState({[e.target.name]:e.target.value})     

    }
    markWorkspacePrivate(e){
            e.stopPropagation();
            var data=
            {
                showStatus:"private"
            }

        this.props.updateWorkspaceShowStatus(this.state.common_reducer_id,data)
    }
        
 render() {
 const {isPickerEmpty,workspaces}=this.props;
 

 


  return(
    
  <div  className={classnames({ "d-flex workspace_select_inline_form": isPickerEmpty }, {  "d-flex flex-column workspace_select_form": !isPickerEmpty })}>
 
                
                              <Input
                                type="select"
                                name="workspace_id"
                                className="mark_private_workspace_select"
                                id="exampleSelect"
                                value={this.state.common_reducer_id}
                                onChange={this.handleWorksapceChange}
                              > 
                               <option value='' >select workspace</option>
                                    {workspaces.map((workspace, index) => (
                                        <option
                                          key={workspace._id}
                                          value={workspace._id}
                                        >
                                          {workspace.name}
                                        </option>
                                      ))}
                               
                              </Input>
                            
                            <div className="form-control mark_workspace_private_btn d-flex justify-content-center" onClick={this.markWorkspacePrivate}>Make it Private</div>


     
</div>


    )}  }




export default connect(null, {updateWorkspaceShowStatus})(PrivateWorkspaceSelect)
