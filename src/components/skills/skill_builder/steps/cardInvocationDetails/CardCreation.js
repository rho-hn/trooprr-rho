import React, { Component } from 'react'
import StepsParent from "./StepsParent"
import NavbarBreadCrumbs from '../../../navbar/navbarBreadCrumbs';
 class CardCreation extends Component {
    render() {
        return (
            <div>
                 <NavbarBreadCrumbs param1="Skill Creation"  data={[{name:"Skill Creation",url:"/"+this.props.match.params.wId+"/skill/create_skill"}] }  workspace_Id={this.props.match.params.wId}/>

        <div style={{marginTop:"40px"}}>
     {/* <h6 className="threeSteps">Create new Card Skill in 3 simple steps</h6> */}
     <StepsParent/>
     </div>
            </div>
        )
    }
}
export default CardCreation