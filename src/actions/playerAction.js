import * as types from './types';

export const getPlayerModelRequest = (params) => ({
    type: types.GET_PLAYER_MODEL_REQUEST,
    params,
});
