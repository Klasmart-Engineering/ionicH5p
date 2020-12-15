import { all, fork } from "redux-saga/effects";
import documentsSagas from "./dashboardSagas";
import editorSagas from "./editorSagas";
import playerSagas from "./playerSagas";

export default function* rootSaga() {
    yield all([fork(documentsSagas), fork(editorSagas), fork(playerSagas)]);
}
