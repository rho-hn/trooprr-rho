import React,{Component} from 'react'
import ErrorPage from "./ErrorPage"
class ErrorBoundary extends Component {
constructor(props) {
    super(props)

    this.state = {
         error:null,errorInfo:null
    }
    this.clearState=this.clearState.bind(this)
}

componentDidCatch(error,errorInfo){

this.setState({error:error,errorInfo:errorInfo})

//add sentry setup

}

clearState(){
    this.setState({error:null,errorInfo:null})
}

render(){

    if(this.state.error){
return <ErrorPage clearState={this.clearState} />

    }
return this.props.children

}

}

export default ErrorBoundary