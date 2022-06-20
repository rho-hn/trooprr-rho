import { SET_WORKSPACE_TAGS, ADD_WORKSPACE_TAGS, UPDATE_WORKSPACE_TAGS, DELETE_WORKSPACE_TAGS } from './types';

const initialState = {
    tags: [],
    createTag: false
};

export default (state = initialState, action = {}) => {

    switch (action.type) {
        case SET_WORKSPACE_TAGS:
            return {
                ...state,
                tags: action.tags
            };
        case 'CREATE_TAG_IN_SIDEBAR':
            return{
                ...state,
                createTag: true
            }
        case ADD_WORKSPACE_TAGS:
            return {
                ...state,
                tags: [...state.tags, action.tag]
            };
        case UPDATE_WORKSPACE_TAGS:
            return {
                ...state,
                tags: state.tags.map((tag) => (tag._id === action.tag._id) ? action.tag : tag)
            }
        case DELETE_WORKSPACE_TAGS:
            return {
                ...state,
                tags: state.tags.filter((tag) => (tag._id !== action.id))
            };

        default: return state;
    }
}
