import * as types from "../actions/types";

export const DEFAULT_STATE = {
    documents: null,
    isLoading: false,
};

const reducer = (state = DEFAULT_STATE, action = {}) => {
    switch (action.type) {
        case types.GET_DOCUMENTS_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case types.GET_DOCUMENTS_SUCCESS:
            return {
                ...state,
                documents: action.payload,
                isLoading: false,
            };
        case types.GET_DOCUMENTS_FAILURE:
            return {
                ...state,
                isLoading: false,
            };
        default:
            return state;
    }
};

export default reducer;
