import React, { Component } from "react";
import { Card, Button } from 'antd';

class TemplateCards extends Component {
  constructor(props) {
    super(props);
    this.state = {
       hovered: false
    };
  }

  onMouseEnter = e => {
     this.setState({ hovered: true });
  };

  onMouseLeave = e => {
     this.setState({ hovered: false });
  };

   handleClick = (skill) => {
  	 this.props.onClick();
  } 

  randomEmoji = () => {
    const { emoji } = this.props;
    return emoji[Math.floor(Math.random() * emoji.length)]
  }

  render() {
     const { data } = this.props;
   
     return (
       <div
         className="card_container" 
         onClick={() => this.handleClick(data)}
         key={data._id} 
         onMouseEnter={this.onMouseEnter}
         onMouseLeave={this.onMouseLeave}
      >
        {this.state.hovered ? (



                   <Card 
                       className="card_body_hovered"
                       hoverable 
                       bordered={false} 
                       style={{ width: 197, height: 216 }}>
                          <div className="column_flex justify_space_between " style={{ height:"100%"}}>
                         <div className="t_column_center ">
                           <div className="t_skill_name " style={{marginBottom:"15px" }}>{data.name}</div>
                             <div className="t_skill_description t_skill_description_4" >{data.desc ? data.desc : "No Description"}</div>
                             </div>
                               <div className="t_justify_center">

                                 <div className="t_template_card_footer_hovered">
                                    {data.type === "system" ? "Standard" 
                                    : <div>
                                        <Button className="t_template_card_button">Start Building</Button>
                                      </div>
                                    }
                             </div>
                             </div>
                         </div>
                   </Card>
             ) : (


                  <Card 
                      className="card_body"
                      hoverable 
                      bordered={false} 
                      style={{ width: 197, height: 216 }}>

                        <div className="column_flex justify_space_between " style={{ height:"100%"}}>
                           <div>
                        <div className="skill_info_box"></div>
                        <div className="t_column_center">
                         <div className="emoji_font">
                          {this.props.emoji}
                               
                         </div>
                        <div className="t_skill_name">{data.name}</div></div>
                      
                        </div>

                          <div className="t_skill_description">{data.desc ? data.desc : "No Description"}</div>
                    </div>
                    </Card>
             )
        }
       </div>
     );
   }
 }

export default TemplateCards;
