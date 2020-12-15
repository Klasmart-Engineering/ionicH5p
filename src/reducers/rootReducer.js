import { combineReducers } from "redux";
import dashboard from "./dashboardReducer";
import editor from "./editorReducer";
import player from "./playerReducer";

export default combineReducers({
    dashboard,
    editor,
    player,
});
