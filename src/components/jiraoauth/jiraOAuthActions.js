import {
    ADD_KEYS_DATA,
    NEXT_STEP, SET_DOMAIN_URL, ADD_INSTANCE_INFO
} from "./actionTypes"


// Actions

function nextStepAction() {
    return {
        type: NEXT_STEP
    }
}

function addDomainURLAction(url) {
    return {
        type: SET_DOMAIN_URL,
        url
    }
}

function addKeysAndSessionAction(data) {
    return {
        type: ADD_KEYS_DATA,
        data
    }
}

function addInstanceInfoAction(instanceInfo) {
    return {
        type: ADD_INSTANCE_INFO,
        instanceInfo
    }
}

// Dispatchers

export function nextStep() {
    return dispatch => dispatch(nextStepAction())
}

export function addDomainURL(url, instanceInfo) {
    return dispatch => new Promise(resolve => {
        dispatch(addDomainURLAction(url));
        dispatch(addInstanceInfoAction(instanceInfo))
        resolve();
    })
}

export function addKeysAndSession(data) {
    return dispatch => new Promise(resolve => {
        dispatch(addKeysAndSessionAction(data));
        resolve();
    })
}