import React, { Component } from 'react'
import TemplateCards from './templateCards';
import RandomEmoji from '../../common/randomImageGenerator';
import { Button, message, Card } from 'antd';
export default class JiraTemplate extends Component {
constructor(props) {
super(props)
    
        this.state = {
          moreTemplates:false,
          noOfCards:null
        }
    }
    componentDidMount(){
    this.updatePredicate();
    window.addEventListener("resize", this.updatePredicate);
    }
    componentWillUnmount() {
      window.removeEventListener("resize", this.updatePredicate);
    }
    updatePredicate=()=> {
      if(window.innerWidth>1350){
        this.setState({ noOfCards:5});
      }
      else if(window.innerWidth>1050){
        this.setState({noOfCards:4})
      }
      else{
        this.setState({noOfCards:3})
      }
    
    }
    handleMoreTemplates=(e)=>{
    this.setState({moreTemplates:!this.state.moreTemplates})
      }
    render() {
      let templatesLength=this.state.moreTemplates?this.props.templates.length:(this.props.templateName==="Other Skill Templates")?this.state.noOfCards-1:this.state.noOfCards
     return (
       <div className="container-wrapper">
        <div className="template-header" >
                   {this.props.templateLoaded&&<div className="template-title">{this.props.templateName}</div>}
                   {this.props.templates.length>4&&<div onClick={()=>this.handleMoreTemplates()} className="template-header-link">More Templates</div>}
                   </div>
              
                    <div className="template_container flex-card">
                   {this.props.templateLoaded&&this.props.templateName==="Other Skill Templates"&& <div className="card_container" key="" onClick={() => this.props.redirect()}>
 <Card 
                     className="card_body"
                     hoverable 
                     bordered={false} 
                     style={{ width: 197, height: 216 }}>
                     <div className="column_flex justify_space_between " style={{ height:"100%"}}>
                     <div>
                                                    <div className="skill_info_box"></div>
                     <div className="t_column_center">
                    <div>
                    <i style={{width: 45, height: 45, display: 'flex', justifyContent: 'center', fontSize: 26.3, color: '#403294', alignItems: 'center'}} className="material-icons">add</i>     
                     </div>
                                                         <div className="t_skill_name">Blank</div>
                                                  </div>
                                                  
                                                </div>
                                                
                                                <div className="t_skill_description">Let's start building from scratch</div>
                                                </div>
                                                </Card>
                                            </div>} 
                    {
                      
                        this.props.templates.slice(0,templatesLength).map((data,index) => {
                           {/* emoji[] */}
                           let emojiIndex;
                           if(index<14){emojiIndex=index}else{emojiIndex=Math.floor(Math.random() * RandomEmoji.length)}

                          return <TemplateCards key={data._id}
                                          data={data} 
                                          emoji={RandomEmoji[emojiIndex]}
                                          onClick={(event) => this.props.selectedTemplate(data,event)}
                                       />
                     })}
                       
                </div>
           
              </div>
           
            
                
        )
    }
}
