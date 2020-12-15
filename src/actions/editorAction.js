import * as types from './types';

export const getEditorModelRequest = (params) => ({
    type: types.GET_EDITOR_MODEL_REQUEST,
    params,
});
