import { put, takeLatest } from "redux-saga/effects";
import * as types from "../actions/types";
import { SERVER_URL } from "../constants/constant";

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
        const payload = yield response.json();
        // const stringData = JSON.stringify(r)
        // const payload = JSON.parse(stringData.replaceAll(MAGICAL_PLACEHOLDER, SERVER_URL))
        // console.log(payload)

        yield put({ type: types.GET_EDITOR_MODEL_SUCCESS, payload });
    } else {
        yield put({ type: types.GET_EDITOR_MODEL_FAILURE });
    }
}

export default function* playerSagas() {
    yield takeLatest(types.GET_EDITOR_MODEL_REQUEST, getModel);
}
