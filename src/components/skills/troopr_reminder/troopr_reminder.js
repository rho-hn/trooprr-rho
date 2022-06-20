import React,{ Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { SkillsAction } from '../settings/settings_action';
import NavbarBreadCrumbs from '../navbar/navbarBreadCrumbs'
import ReminderMain from "./troopr_reminder_main"
import SmartReminder from "./smart_reminders"
import queryString from 'query-string';

class TrooprReminder extends Component {
     constructor(props){
     super(props);
     this.state = {
         modal:false
     };
      this.toggle=this.toggle.bind(this)
      this.setOption=this.setOption.bind(this)
 }

    setOption( view ) {
       this.setState({ view: view});
     //   let queryStringObject = queryString.stringify({
     //   view: view  
     // });

     const path = window.location.pathname;
     const obj = {
       "title": view,
       "url": path + `?view=${view}`
     }
        window.history.pushState(obj, obj.title, obj.url);
    }
    
	   componentDidMount() {
        this.props.SkillsAction(this.props.match.params.wId);
        const parsedQueryString = queryString.parse(window.location.search);
        if( parsedQueryString.view ){
           this.setState({ view: parsedQueryString.view }) 
        }else{
           this.setState({ view:''})
        }
     }

    toggle= () => {
       this.setState({
          modal: !this.state.modal
     });
   };

	  render(){
       // const { launcherActions } = this.props;
       const { view } = this.state;
      //  let  paymentStatus = this.props.paymentHeader.billing_status;
		   return(
            <div>
               <NavbarBreadCrumbs    data={[{name:"Smart Reminder",url:"/"+this.props.match.params.wId+"/skill/troopr_reminder"} ]}   workspace_Id={this.props.match.params.wId}/>
                  <div className="">
                    {view === "smart_reminder" ? 
                         <SmartReminder /> : 
                         <ReminderMain setOption={this.setOption} />
                    } 
                 </div>
           </div>
        );
	  }
 }

  const mapStateToProps = state => ({
     launcherActions: state.launcherActions.allActions,
   //   paymentHeader : state.common_reducer.workspace
   });

  export default withRouter(connect( mapStateToProps, {
       SkillsAction
      })( TrooprReminder )); 
