// import React, { Component } from 'react'
// import {Button} from "antd"
// import {withRouter} from "react-router-dom"
// import {getOauthTokens} from "./jiraoauth.action"
// import "./jiraoauth.css"

//  class SaveConnection extends Component {
//      constructor(props) {
//          super(props)
     
//          this.state = {
//               showError:false,
//               loading:false
//          }
//      }
     
//     SaveConnection=async ()=>{
//         this.setState({loading:true})
//         console.log(this.props.location.state.sessionid)
//         // let url=await getOauthTokens(this.props.match.params.wId,this.props.location.state.sessionid)
//         let url
//        this.setState({loading:false})
//         if(url){
//         window.location.assign(url);
//        }
//        else{
//    this.setState({showError:true})
//        }
       
//         }
//     render() {
//         return (
//             <>
//           {this.state.showError?
//           <div style={{display:'flex',alignItems:"center",justifyContent:"center",width:"100%",height:"80vh",textAlign:"center"}}>
//                <div className="save-connection">
//          <div style={{marginBottom:"10px",fontSize:"24px",fontWeight:"bold"}}>Error Connecting Your Jira Instance</div>
//          <div style={{marginBottom:"10px"}}>Make sure you provided a valid domain url</div>
//          <div style={{marginBottom:"10px"}}>If you can't connect after providing valid domain url also Open your firewall for us Ip Address: </div>
//         <Button style={{marginBottom:"10px"}} type="primary" onClick={()=>this.props.history.push(`/${this.props.match.params.wId}/skills/${this.props.match.params.skill_id}?view=connection`)}>Connect Again</Button>
//         </div>
//            </div>:<div style={{display:'flex',alignItems:"center",justifyContent:"center",width:"100%",height:"80vh"}}>
//             <div className="save-connection">
//             <div style={{marginBottom:'20px', fontWeight:"bold",fontSize:"24px"}}>Save the connection</div> 
//            <Button type="primary" onClick={this.SaveConnection} loading={this.state.loading}>Save Connection</Button>
//                 </div>
//                 </div>
//     }
//             </>
     
//         )
//     }
// }
// export default withRouter(SaveConnection) 


