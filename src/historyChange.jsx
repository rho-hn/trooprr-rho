import { withRouter,useLocation } from "react-router-dom";
import React,{useEffect} from 'react'
import jwt from "jsonwebtoken";
import { sendUserActivity } from "./components/common/common_action";
const History = (props) => {
    let location = useLocation();

  useEffect(() => {
      let getToken = jwt.decode(localStorage.getItem("token"))
      let userInfo = getToken && getToken._id;
      let workspaceId = props.match.params.wId;
      if (!workspaceId) { workspaceId = localStorage.getItem("userCurrentWorkspaceId") }

      userInfo && workspaceId && location && location.pathname && sendUserActivity(workspaceId, userInfo, location.pathname)

    
  }, [location]);

    return <>
        {props.children}
    </>;
};

export default withRouter(History);
