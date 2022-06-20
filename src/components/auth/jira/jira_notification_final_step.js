// import React from 'react';
// import { withRouter} from 'react-router-dom';

// class JiraNotifFinalPage extends React.Component {
//       constructor(props) {
//         super(props);
//           this.state = { }
//          this.verify = this.verify.bind(this);
//       }

//       verify() {
//           this.props.history.push("/"+this.props.workspace_id+"/skill/jira/"+this.props.skillId)
//       }
    						
//       render() {
//        return(
//            <div>
//              <div className="steps_box d-flex flex-column">
//                 <div className="step_heading">
//                           Step 4 : 
//                 </div>
//                 <div className="step_text">
//                     <span>Select issue related events shown below and click on "Create" at the bottom.</span>
//                 </div>
//                 <div className="final_step_text">Tick the 3 events listed below,</div>
//                    <div className="d-flex justify-content-between issue_event_selection_box">
//                        <div className="d-flex flex-column">
//                           <div className="event_for">Issue</div>
//                              <div className="event_type">Created</div>
//                                 <div className="event_type">Updated</div>
//                        </div>
//                        <div className="d-flex flex-column">
//                           <div className="event_for">Comment</div>
//                               <div className="event_type">Created</div>
//                        </div>
//                       </div>
//                   </div>
//                   <div className="d-flex justify-content-between align-items-center">
//                     <div className="nxt_btn  d-flex align-items-center justify-content-end" onClick={this.props.setOption}>
//                        <i className="material-icons">arrow_back</i>Back</div>
//                   <div className=" primary_btn verify_btn d-flex align-items-center justify-content-end" onClick={this.verify}>
//                             Finish
//                   </div>
//                </div>
//             </div>
//          )
//     }
// }


// export default withRouter(JiraNotifFinalPage)
