import React, { Component } from "react";
import { Button } from 'antd';

class LauncherActionButtonAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addHover: false,
    };
  }

  onMouseoverAdd = e => {
     this.setState({ addHover: true });
  };

  onMouseoutAdd = e => {
     this.setState({ addHover: false });
  };

  handleClick = (name) =>{
  	 this.props.data.name = name;
  	 this.props.handleOnClick();
  } 

  render() {
     const { textAdd } = this.props;
     return (
        <Button
           className="Launcher_Actions_hidden" 
           name={textAdd}
           onClick={() => this.handleClick(textAdd)}
           onMouseEnter={this.onMouseoverAdd}
           onMouseLeave={this.onMouseoutAdd}
         >
          {this.state.addHover ? (
              <div className="d-flex align-items-center pointer__events justify-content-center">
                 <i className="material-icons-round launcher_action_icon_hover">add</i>
                 <div>Add</div>
		          </div>
            ) : (
              textAdd
               )
           }
       </Button>
     );
   }
 }

export default LauncherActionButtonAdd;
