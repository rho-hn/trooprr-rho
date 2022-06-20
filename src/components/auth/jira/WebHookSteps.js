import React from 'react';

const WebHookStep = (props) =>{

    return(
        <div className= "webSteps">
            <div className="steps">{props.steps}</div>
            <div>{props.children}</div>
        </div>
    );
}

export default WebHookStep;