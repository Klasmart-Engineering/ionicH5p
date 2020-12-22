import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
import "@ionic/react/css/display.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/float-elements.css";
/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/typography.css";
import { createHashHistory } from "history";
import React from "react";
import { Provider } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { applyMiddleware, compose, createStore } from "redux";
import logger from "redux-logger";
import createSagaMiddleware from "redux-saga";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import Player from "./pages/Player";
import reducer from "./reducers/rootReducer";
import sagas from "./sagas/sagas";
/* Theme variables */

// import PouchDB from 'pouchdb';
// import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite';
// function createPouchDB() {
//     PouchDB.plugin(cordovaSqlitePlugin);
//     return new PouchDB('employees.db', { adapter: 'cordova-sqlite' });
// }
// const db = createPouchDB()
// console.log(db)
// const broadcast = new BroadcastChannel('count-channel');
// broadcast.postMessage({ payload: db });

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware, logger];
const enhancer = compose(applyMiddleware(...middleware));

const store = createStore(reducer, enhancer);

sagaMiddleware.run(sagas);

const history = createHashHistory();

const App: React.FC = () => (
    <IonApp>
        <Provider store={store}>
            <IonReactRouter history={history}>
                <IonRouterOutlet>
                    <Route exact path="/dashboard" component={Dashboard} />
                    <Route exact path="/play/:documentId" component={Player} />
                    <Route exact path="/edit/:documentId" component={Editor} />
                    <Route exact path="/new/" component={Editor} />
                    <Route
                        exact
                        path="/"
                        render={() => <Redirect to="/dashboard" />}
                    />
                </IonRouterOutlet>
            </IonReactRouter>
        </Provider>
    </IonApp>
);

export default App;
