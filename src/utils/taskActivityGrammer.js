let taskActivityGrammer = (action,param1,param2) => {
    let obj = {
        "CREATED":` created the task.`,
        "TASK_SECTION_MOVED":` moved the task from ${param1} to ${param2}`,
        "NAME_UPDATED":` updated the task name to ${param1}`,
        "DESCRIPTION_UPDATED":` updated the task description to ${param1}`,
        "ATTACHMENT_UPDATED":` attached file: ${param1}`,
        "STATUS_UPDATED":` marked the task as ${param1}`,
        "ASSIGNED_TO":` assigned the task to ${param1}`,
        "DUE_DATE_UPDATED":` updated the task due date to ${param1}`,
        "TAG_ASSIGNED": `  added tag ${param1} to the task`,
        "TAG_REMOVED" : ` removed tag ${param1} from the task`,
        "ASSIGNE_REMOVED" : ` removed assignee ${param1} from the task`,
        "DUE_DATE_REMOVED" : ` removed due date from the task`,
        "ADD_FOLLOWER" : ` added ${param1} as follower for the task`,
        "START_DATE_UPDATED": ` updated the task start date to ${param1}`,
        "START_DATE_REMOVED": ` removed start date from the task`,
        "REMOVE_FOLLOWER": ` removed follower ${param1} from the task`    
    }
    return obj[action];
}

export default taskActivityGrammer;


