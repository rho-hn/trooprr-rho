import React, { Component } from 'react'
import {useHistory} from "react-router-dom"
 const  ErrorPage=({clearState})=> {
const history=useHistory()
    const navigateToHomePage=()=>{

        clearState()
        history.push(`/`)
    }
  
        return (
            <div onClick={()=>navigateToHomePage()}>
               Some thing went wrong 
            </div>
        )
    
}


export default ErrorPage
