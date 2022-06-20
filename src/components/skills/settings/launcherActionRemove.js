import React, { Component } from "react";
import { Button } from 'antd';

class LauncherActionButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      removeHover: false
    };
  }

  onMouseoverRemove = e => {
     this.setState({ removeHover: true });
  };

  onMouseoutRemove = e => {
     this.setState({ removeHover: false });
  };

   handleClick = (name) =>{
  	 this.props.data.name = name;
  	 this.props.handleOnClick();
  } 

  render() {
     const { text } = this.props;
     return (
      <div className="button_hover">
       <Button type="primary"
         className="Launcher_Actions_visible" 
         name={text}
         onClick={() => this.handleClick(text)}
         onMouseEnter={this.onMouseoverRemove}
         onMouseLeave={this.onMouseoutRemove}
      >
        {this.state.removeHover ? (
          <div className="d-flex align-items-center pointer__events justify-content-center">
               <i className="material-icons-round launcher_action_icon_hover">close</i>
               <div>Remove</div>
	        </div>
          ) : (
            text
             )
        }
       </Button>
       </div>
     );
   }
 }

export default LauncherActionButton;
