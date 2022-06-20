let projectActivityGrammer = (action,actor,param1,param2,param3,task_name,file_attach, proj_name) => {
    let obj = {
        "PROJECT_CREATED":`${actor} created the ${param1}`,
        "MEMBER_ADDED":`${actor} added ${param2} to the ${param1}`,
        "MEMBER_REMOVED": `${actor} removed ${param2} from project`,
        "PROJECT_NAME_CHANGED":`${actor} updated the ${param1} name to ${proj_name}`,
        "MEMBER_LEFT":`${param2} left the ${param1}`,
        "PROJECT_STATUS_CHANGED":`${actor} changed the ${param1} status to ${param2}`,
        "PROJECT_ENDDATE_CHANGED":`${actor} changed the ${param1} deadline to ${param2}`,
        "PROJECT_ATTACHMENT_UPDATED":`${actor} attached ${file_attach}  to the ${param1}`,
        //"ATTACHMENT_UPDATED":`${actor} attached  ${file_attach} to the task ${task_name}.`,
      //"PROJECT_ATTACHMENT_UPDATED":`${actor} attached a file to the ${param1}.`,
        "STATUS_UPDATED":`${actor} marked the task "${task_name}" as ${param2}`,
        "ASSIGNED_TO":`${actor} assigned a task to ${param2}`,
        "DUE_DATE_UPDATED":`${actor} added a due date`,
        "PROJECT_MOVED":`${actor} moved the ${param1} from ${param2} to ${param3}`,
        "TAG_ASSIGNED": `${actor} added tag ${param2} to the ${task_name}`
    }
    return obj[action];
}

export default projectActivityGrammer;