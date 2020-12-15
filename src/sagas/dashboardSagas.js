import { put, takeLatest } from "redux-saga/effects";
import * as types from "../actions/types";
import { SERVER_URL } from "../constants/constant";

function* documentsModel(action) {
    const url = SERVER_URL + `/h5p/documents`;

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
        yield put({ type: types.GET_DOCUMENTS_SUCCESS, payload });
    } else {
        yield put({ type: types.GET_DOCUMENTS_FAILURE });
    }
}

export default function* dashboardSagas() {
    yield takeLatest(types.GET_DOCUMENTS_REQUEST, documentsModel);
}
