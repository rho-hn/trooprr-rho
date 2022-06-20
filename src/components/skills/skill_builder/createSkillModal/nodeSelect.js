import React, { Component } from 'react';

import CustomSelect from './select.js'
import { withRouter } from "react-router-dom";
class NodeSelect extends Component {

// componentDidMount(){



// }


componentDidMount(){
   
}

getNodes=()=>{
   let arr=[]
    if(this.props.currentNodeIndex){
        arr=Array.from(this.props.nodes)
        arr=arr.splice(0,this.props.currentNodeIndex)

    }else{
        arr= this.props.nodes
    }
            if( this.props.currentOperation.name==="bar_chart_aggregate_count" || this.props.currentOperation.name==="bar_chart_aggregate_sum"){
              arr=arr.filter(item=>item.params_out && item.params_out.length>0)

            }else if( this.props.schema.type ==="image_url" ){
                arr= arr.filter(item=>item.operation=="bar_chart_aggregate_count" || item.operation=="bar_chart_aggregate_sum")
            }


    return arr
}
  render() {
let nodes=this.getNodes()
      //  console.log(this.state[schema.key])
    const {schema} = this.props;
    return (
   
 <CustomSelect keyValue={this.props.keyValue} value={this.props.value} onChange={this.props.onChange} schema={schema} currentOperation={this.props.currentOperation} skillNodes={ nodes} descData={this.props.descData}/>

       



 


  

    );
  }
}



export default  withRouter(NodeSelect); 





