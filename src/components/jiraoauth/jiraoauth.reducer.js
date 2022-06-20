import { ADD_INSTANCE_INFO, ADD_KEYS_DATA, SET_DOMAIN_URL } from "./actionTypes";

const initialState = {
    domainURL: null,
    isCloud: false,
}

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_DOMAIN_URL:
            return {
                ...state,
                domainURL: action.url
            }

        case ADD_KEYS_DATA:
            return {
                ...state,
                ...action.data
            }

        case ADD_INSTANCE_INFO:
            return {
                ...state,
                instanceInfo: action.instanceInfo
            }

        default:
            return state;
    }
}