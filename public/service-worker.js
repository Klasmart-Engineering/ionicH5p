/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

// Names of the two caches used in this version of the service worker.
// Change to v2, etc. when you update any of the local resources, which will
// in turn trigger the install event again.
// import { File } from '@ionic-native/file/ngx';
// import PouchDB from 'pouchdb';
// const File = require("@ionic-native/file/ngx");
importScripts(
    "https://cdnjs.cloudflare.com/ajax/libs/localforage/1.9.0/localforage.min.js"
);
importScripts(
    "https://cdn.jsdelivr.net/npm/localforage-cordovasqlitedriver@1.8.0/dist/localforage-cordovasqlitedriver.js"
);

const setupLocalforage = async () => {
    await localforage.defineDriver(cordovaSQLiteDriver);
    await localforage.setDriver([
        cordovaSQLiteDriver._driver,
        localforage.INDEXEDDB,
        localforage.WEBSQL,
        localforage.LOCALSTORAGE,
    ]);
};
setupLocalforage();

const PRECACHE = "precache-v1";
const RUNTIME = "example-cache";

// const SERVER_URL = "https://5cf78c6e7038.ngrok.io";
// TODO find a way to avoid redefining the server url in the service worker script
const SERVER_URL = "http://localhost:8023";
const ASSET_URLS = [
    "/h5p/core/js/jquery.js",
    "/h5p/core/js/h5p.js",
    "/h5p/core/js/h5p-event-dispatcher.js",
    "/h5p/core/js/h5p-x-api-event.js",
    "/h5p/core/js/h5p-x-api.js",
    "/h5p/core/js/h5p-content-type.js",
    "/h5p/core/js/h5p-confirmation-dialog.js",
    "/h5p/core/js/h5p-action-bar.js",
    "/h5p/core/js/request-queue.js",
    "/h5p/libraries/H5P.Transition-1.0/transition.js",
    "/h5p/libraries/Tether-1.0/scripts/tether.min.js",
    "/h5p/libraries/Drop-1.0/js/drop.min.js",
    "/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-help-dialog.js",
    "/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-message-dialog.js",
    "/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-progress-circle.js",
    "/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-simple-rounded-button.js",
    "/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-speech-bubble.js",
    "/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-throbber.js",
    "/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-tip.js",
    "/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-slider.js",
    "/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-score-bar.js",
    "/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-progressbar.js",
    "/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-ui.js",
    "/h5p/libraries/H5P.Flashcards-1.5/js/xapi.js",
    "/h5p/libraries/H5P.Flashcards-1.5/js/flashcards.js",
    "/h5p/core/styles/h5p-confirmation-dialog.css",
    "/h5p/libraries/FontAwesome-4.5/h5p-font-awesome.min.css",
    "/h5p/libraries/Tether-1.0/styles/tether.min.css",
    "/h5p/libraries/Drop-1.0/css/drop-theme-arrows-bounce.min.css",
    "/h5p/libraries/H5P.FontIcons-1.0/styles/h5p-font-icons.css",
    "/h5p/libraries/H5P.JoubelUI-1.3/css/joubel-help-dialog.css",
    "/h5p/libraries/H5P.JoubelUI-1.3/css/joubel-message-dialog.css",
    "/h5p/libraries/H5P.JoubelUI-1.3/css/joubel-progress-circle.css",
    "/h5p/libraries/H5P.JoubelUI-1.3/css/joubel-simple-rounded-button.css",
    "/h5p/libraries/H5P.JoubelUI-1.3/css/joubel-speech-bubble.css",
    "/h5p/libraries/H5P.JoubelUI-1.3/css/joubel-tip.css",
    "/h5p/libraries/H5P.JoubelUI-1.3/css/joubel-slider.css",
    "/h5p/libraries/H5P.JoubelUI-1.3/css/joubel-score-bar.css",
    "/h5p/libraries/H5P.JoubelUI-1.3/css/joubel-progressbar.css",
    "/h5p/libraries/H5P.JoubelUI-1.3/css/joubel-ui.css",
    "/h5p/libraries/H5P.JoubelUI-1.3/css/joubel-icon.css",
].map((url) => SERVER_URL + url);
const PRECACHE_URLS = ASSET_URLS.concat(["index.html"]);

const precache = async (urls) => {
    for (const url of urls) {
        try {
            const response = await fetch(url, {
                credentials: "include",
                mode: "cors",
            });
            if (!response || response.status !== 200) {
                continue;
            }
            const res = await response.clone().blob();
            console.log(res);
            // eslint-disable-next-line no-undef
            localforage.setItem(url, res);
            console.log("pre-cache!");
        } catch (err) {
            console.log(err);
        }
    }
};

// The install handler takes care of precaching the resources we always need.
self.addEventListener("install", (event) => {
    event.waitUntil(precache(PRECACHE_URLS));
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener("activate", (event) => {
    const currentCaches = [PRECACHE, RUNTIME];
    event.waitUntil(
        caches
            .keys()
            .then((cacheNames) => {
                return cacheNames.filter(
                    (cacheName) => !currentCaches.includes(cacheName)
                );
            })
            .then((cachesToDelete) => {
                return Promise.all(
                    cachesToDelete.map((cacheToDelete) => {
                        return caches.delete(cacheToDelete);
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

const cachedResponse = async (request) => {
    if (
        (request.url.endsWith(".js") || request.url.endsWith(".css")) &&
        !request.url.endsWith("/service-worker.js")
    ) {
        const blob = await localforage.getItem(request.url);
        if (blob) {
            console.log(request.url + " was pre-cached!");
            return new Response(blob);
        }
    }

    try {
        const response = await fetch(request, {
            credentials: "include",
            mode: "cors",
        });
        // if (!response || response.status !== 200 || response.type !== "basic") {
        if (!response || response.status !== 200) {
            return response;
        }
        const res = await response.clone().blob();
        // eslint-disable-next-line no-undef
        localforage.setItem(request.url, res);

        return response;
    } catch (err) {
        const blob = await localforage.getItem(request.url);
        if (blob) {
            return new Response(blob);
        }
        return new Response();
    }
};

self.addEventListener("fetch", (event) => {
    event.respondWith(cachedResponse(event.request));
});