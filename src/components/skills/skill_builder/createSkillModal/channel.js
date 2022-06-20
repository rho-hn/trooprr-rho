




import React, { Component } from 'react';
import {connect} from "react-redux";
import CustomSelect from './select.js'
import {getChannelList}  from "../../skills_action"
import { withRouter } from "react-router-dom";
class ChannelSelect extends Component {

componentDidMount(){
  // let rootNodeIndex = nodes.findIndex(item => item.is_root)
  let rootNode=this.props.nodes.find(node=>node.is_root)
  let query=""
if(rootNode ){
  query="trigger_type="+rootNode.operation+"&nodeKey="+rootNode.key
}
 /* getChannels only called once in sidenavbar_new */
  // this.props.getChannelList(this.props.match.params.wId,query)
}




  render() {


      //  console.log(this.state[schema.key])
    const {schema,channels } = this.props;
    return (
   
 <CustomSelect keyValue={this.props.keyValue} value={this.props.value} onChange={this.props.onChange} schema={schema} channels={ channels}  descData={this.props.descData}/>

       



 


  

    );
  }
}
const mapStateToProps = (state) => {
//   console.log(state)
  return {
  
    channels:state.skills.channels,

}};


export default  withRouter(connect(mapStateToProps, {getChannelList

 })(ChannelSelect)); 





