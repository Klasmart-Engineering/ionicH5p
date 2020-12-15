import * as types from "../actions/types";

export const DEFAULT_STATE = {
    model: null,
    isLoading: false,
};

const reducer = (state = DEFAULT_STATE, action = {}) => {
    switch (action.type) {
        case types.GET_EDITOR_MODEL_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case types.GET_EDITOR_MODEL_SUCCESS:
            return {
                ...state,
                model: action.payload,
                isLoading: false,
            };
        case types.GET_EDITOR_MODEL_FAILURE:
            return {
                ...state,
                isLoading: false,
            };
        default:
            return state;
    }
};

export default reducer;
