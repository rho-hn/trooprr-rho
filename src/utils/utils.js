import React from 'react';
import jwt from 'jsonwebtoken';
import { message } from "antd";

const uuidv4 = require("uuid/v4");

export const isValidUser=(skill)=>{
    let createdBy=skill.user_id;
    let userToken=localStorage.getItem("token")
    let tokenInfo=jwt.decode(userToken)
    let user_id=tokenInfo._id;
    return createdBy==user_id
}

export const sendMessageOnchat = (msg) => {
    let key = uuidv4();
    message.loading({ content: "Connecting to Team Troopr...", key, duration: 0 });
    try {
        if (window.$crisp) {
            window.$crisp.push(["do", "message:send", ["text", msg]]);
            message.success({ content: "Connected to Team Troopr", key, duration: 0.5 });
        } else {
            message.error({ content: "We are having some trouble connecting.. pls try again later", key, duration: 2 });
        }
    } catch (error) {
        message.error({ content: "We are having some trouble connecting.. pls try again later", key, duration: 2 });
    }
}

export const checkJiraStatus = (jira_skill_meta) => {
    const enabledProducts = jira_skill_meta.sub_skills.filter(ss => !ss.disabled)

    return enabledProducts && enabledProducts.length > 0 ? true : false
}

export const validURL = (str) => {
    str = str ? str.trim() : ''
    /* https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url */
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    
      // if(str.includes('https'))return !!pattern.test(str);
    //   return false
    
    return !!pattern.test(str);
  }
