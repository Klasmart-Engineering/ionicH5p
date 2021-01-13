import { put, takeLatest } from "redux-saga/effects";
import * as types from "../actions/types";
import { MAGICAL_PLACEHOLDER, SERVER_URL } from "../constants/constant";

function* getModel(action: any) {
    const url = action.params
        ? SERVER_URL + `/h5p/edit/${action.params}`
        : SERVER_URL + `/h5p/new`;

    let response = null;
    try {
        response = yield fetch(url, {
            method: "GET",
            credentials: "include",
            headers: new Headers({
                Accept: "application/json",
            }),
        });
    } catch (e) {
        console.log(e);
    }
    if (response && response.status === 200) {
        const r = yield response.json();
        const stringData = JSON.stringify(r)
        stringData.replace(MAGICAL_PLACEHOLDER, SERVER_URL)
        const payload = JSON.parse(stringData) 

        yield put({ type: types.GET_EDITOR_MODEL_SUCCESS, payload });
    } else {
        yield put({ type: types.GET_EDITOR_MODEL_FAILURE });
    }
}

export default function* playerSagas() {
    yield takeLatest(types.GET_EDITOR_MODEL_REQUEST, getModel);
}
