import * as types from "../actions/types";

export const DEFAULT_STATE = {
    model: null,
    isLoading: false,
};

const reducer = (state = DEFAULT_STATE, action = {}) => {
    switch (action.type) {
        case types.GET_PLAYER_MODEL_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case types.GET_PLAYER_MODEL_SUCCESS:
            return {
                ...state,
                model: { [action.payload.documentId]: action.payload },
                isLoading: false,
            };
        case types.GET_PLAYER_MODEL_FAILURE:
            return {
                ...state,
                isLoading: false,
            };
        default:
            return state;
    }
};

export default reducer;
