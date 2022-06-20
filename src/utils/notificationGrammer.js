export const singleGrammer = (action, param1, param2) => {
    let obj = {
        "TASK_FOLLOWING": param1 ? ` added you as a follower for the task "${param1}"` 
                                 : ` added you as a follower for the task`,

        "TASK_FOLLOWING_UPDATE": param1 ? ` Task "${param1}" that you are following was updated by ${param2}`
                                         : ` Task that you are following was updated by ${param2}`,

        "TASK_ASSIGNED": param2 ? ` assigned you this task "${param2}"`
                                 : ` assigned you this task `,

        "TASK_DELETE": param1 ? `The task you are following  "${param1}" was deleted by `
                               : `The task you are following was deleted by `,

        "TASK_SECTION_MOVED": ` moved a task from section ${param2} to section ${param1}`,

        "TASK_STATUS": ` changed the task status from ${param2} to ${param1}`,

        "TASK_COMMENT": param1 ? ` added a comment to task "${param1}"`
                               : `added a comment to task`,
        "TASK_COMMENT_MENTION": ` ${param1} has mentioned you in a comment.`,
        "PROJECT_NAME_UPDATED": ` updated the project name from ${param1} to ${param2}.`,
        "PROJECT_MEMBER_ADDED": ` added ${param1} to the project ${param2}.`,
        "WORKSPACE_NAME_CHANGE": ` updated the workspace name from ${param1} to ${param2}.`,
        "WORKSPACE_MEMBER_ADDED": ` added ${param1} to the workspace ${param2}.`,
        "FILE_UPLOADED": ` uploaded file in the project ${param1}.`,
        "PROJECT_TEAMSYNC_NEW_POST": ` posted in ${param1} team sync`,
        "PROJECT_TEAMSYNC_COMMENT": ` commented on your post in ${param1} team sync`,
        "PROJECT_TEAMSYNC_MENTION": ` mentioned you in ${param1} team sync`,
        "WORKSPACE_TEAMSYNC_NEW_POST": ` posted in ${param1} team sync`,
        "WORKSPACE_TEAMSYNC_COMMENT": ` commented on your post in ${param1} team sync`,
        "WORKSPACE_TEAMSYNC_MENTION": ` mentioned you in ${param1} team sync`,
        "WORKSPACE_TEAMSYNC_LIKE": ` liked your update in ${param1} team sync`,
        "WORKSPACE_TEAMSYNC_REMINDER": `It’s time for today’s Team-Sync update in ${param1}`,
        "PROJECT_TEAMSYNC_LIKE": ` liked your update in ${param1} team sync`,
        "TEAMSYNC_REMINDER": ` Standup Reminder - 15 minutes left for report in ${param1}`
    }
    return obj[action];
}

export const groupGrammer = (action, count, param1) => {
    let obj = {
        "TASK_FOLLOWING": `You were added as a follower for ${count} tasks in ${param1} project.`,
        "TASK_FOLLOWING_UPDATE": `${count} tasks you are following were updated in ${param1} project`,
        "TASK_ASSIGNED": `${count} tasks were assigned to you in ${param1} project.`,
        "TASK_STATUS": `Status of this task ${param1} was updated ${count} times`,
        "PROJECT_NAME_UPDATED": `Name of ${param1} project was updated ${count} times.`,
        "PROJECT_MEMBER_ADDED": `${count} new members were added to ${param1} project.`,
        "WORKSPACE_NAME_CHANGE": `Name of ${param1} workspace was updated ${count} times.`,
        "WORKSPACE_MEMBER_ADDED": `${count} new members were added to ${param1} workspace.`,
        "FILE_UPLOADED": `${count} files were uploaded to ${param1} project.`,
        "PROJECT_TEAMSYNC_NEW_POST": `${count} new posts in ${param1} team sync`,
        "PROJECT_TEAMSYNC_COMMENT": `${count} new comments on your post in ${param1} team sync`,
        "PROJECT_TEAMSYNC_MENTION": `You were mentioned in ${count} posts in ${param1} team sync`,
        "WORKSPACE_TEAMSYNC_NEW_POST": `${count} new posts in ${param1} team sync`,
        "WORKSPACE_TEAMSYNC_COMMENT": `${count} new comments on your post in ${param1} team sync`,
        "WORKSPACE_TEAMSYNC_MENTION": `You were mentioned in ${count} posts in ${param1} team sync`,
        "WORKSPACE_TEAMSYNC_LIKE": `${count} people liked your update in ${param1} team sync`,
        "PROJECT_TEAMSYNC_LIKE": `${count} people liked your update in ${param1} team sync`
    }
    return obj[action];
}