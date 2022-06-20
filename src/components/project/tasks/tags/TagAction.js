import axios from 'axios';
import { editTask, setTask } from '../task/taskActions.js';
// import { editMyTask } from '../../../myspace/tasks/mytaskActions.js'
import { SET_WORKSPACE_TAGS, ADD_WORKSPACE_TAGS, UPDATE_WORKSPACE_TAGS, DELETE_WORKSPACE_TAGS } from './types';


export function createTagInSidebar(){
    return{
        type: 'CREATE_TAG_IN_SIDEBAR'
    }
}
export function setTags(tags) {
    return {
        type: SET_WORKSPACE_TAGS,
        tags
    };
}

export function insertTag(tag) {
    return {
        type: ADD_WORKSPACE_TAGS,
        tag
    };
}
export function editTags(tag) {
    return {
        type: UPDATE_WORKSPACE_TAGS,
        tag
    };
}
export function removeTag(id) {
    return {
        type: DELETE_WORKSPACE_TAGS,
        id
    };
}

export function deleteTaskTag(tagData) {
    return dispatch => {
        return axios.post('/api/removeTag', tagData).then(res => {
            if (res.data.success) {
                dispatch(editTask(res.data, res.data.task.isActive));
            }
            return res;
        });
    }
}
export function deleteMyTaskTag(tagData) {
    return dispatch => {
        return axios.post('/api/removeTag', tagData).then(res => {
            if (res.data.success) {
                // dispatch(editMyTask(res.data));
                dispatch(setTask(res.data.task));
            }
            return res;
        });
    }
}

export function addTaskTag(tagData) {
    return dispatch => {
        return axios.post('/api/addTag', tagData).then(res => {
            if (res.data.success) {
                if (res.data.tag) {
                    dispatch(insertTag(res.data.tag));
                }
                dispatch(setTask(res.data.task));
                dispatch(editTask(res.data, res.data.task.isActive));
            }
            return res;
        });
    }
}
export function addTaskMyTag(tagData) {
    return dispatch => {
        return axios.post('/api/addTag', tagData).then(res => {
            if (res.data.success) {
                if (res.data.tag) {
                    dispatch(insertTag(res.data.tag));
                }
                // dispatch(editMyTask(res.data.task));
                dispatch(setTask(res.data.task));
            }
            return res;
        });
    }
}

export function getTag(id) {
    return dispatch => {
        return axios.get('/api/' + id + '/workspaceTags').then(res => {
            if (res.data.success) {
                dispatch(setTags(res.data.tags));
            }
            return res;
        });
    }
}
export function addNewTag(data) {
    return dispatch => {
        return axios.post('/api/tag', data).then(res => {
            if (res.data.success) {
                dispatch(insertTag(res.data.tag));
            }
            return res;
        });
    }
}
export function updateTag(id, data) {
    return dispatch => {
        return axios.put('/api/' + id + '/tag', data).then(res => {
            if (res.data.success) {
                dispatch(editTags(res.data.tag));
            }
            return res;
        });
    }
}
export function deleteTag(id) {
    return dispatch => {
        return axios.delete('/api/' + id + '/tag').then(res => {
            if (res.data.success) {
                dispatch(removeTag(id));
            }
            return res;
        });
    }
}

