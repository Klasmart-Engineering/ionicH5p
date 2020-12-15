import * as types from './types';

export const getDocumentsRequest = (params) => ({
    type: types.GET_DOCUMENTS_REQUEST,
    params,
});
