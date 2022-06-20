import React, { Component} from "react";

import "./skillCardDetails.css";
import Cards from "./cards";
import SideNavbar from "../../../sidebar/sidenavbar"
import SideNavbar2 from "../../../sidebar/sidenavbar2"
class skillCardDetails extends Component {
  constructor(props) {
    super(props);
    this.toggleRef=React.createRef()
    this.state = {
      templatesLoaded: false,
      showCards:false,
      
    }
   
  }
  toggle=()=>{
    this.setState({showCards:!this.state.showCards})
  }

  render() {
    
    return (
      <div className="page_wrapperr" >
    {/*<SideNavbar/>*/}
    <SideNavbar2/>
     <div className="second_child">
    {/* <Navbar title="Smart Cards" /> */}
    <div className="bg__img"></div>
    <Cards/>
    </div>
    
</div>
   
    );
  }
}

export default skillCardDetails