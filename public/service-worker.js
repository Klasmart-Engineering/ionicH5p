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
    await localforage.setDriver([cordovaSQLiteDriver._driver, localforage.INDEXEDDB]);
};
setupLocalforage()

const PRECACHE = "precache-v1";
const RUNTIME = "example-cache";

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
    "index.html",
    "./", // Alias for index.html
    "styles.css",
    "../../styles/main.css",
    "demo.js",
];

// The install handler takes care of precaching the resources we always need.
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(PRECACHE)
            .then((cache) => cache.addAll(PRECACHE_URLS))
            .then(self.skipWaiting())
    );
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

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
// self.addEventListener("fetch", (event) => {
//     // Skip cross-origin requests, like those for Google Analytics.
//     if (event.request.url.startsWith(self.location.origin)) {
//         event.respondWith(
//             caches.match(event.request).then((cachedResponse) => {
//                 if (cachedResponse) {
//                     return cachedResponse;
//                 }

//                 return caches.open(RUNTIME).then((cache) => {
//                     return fetch(event.request).then((response) => {
//                         // Put a copy of the response in the runtime cache.
//                         return cache
//                             .put(event.request, response.clone())
//                             .then(() => {
//                                 return response;
//                             });
//                     });
//                 });
//             })
//         );
//     }
// });

// self.addEventListener("fetch", (event) => {
//     event.respondWith(
//         (async (event) => {
//             // eslint-disable-next-line no-undef
//             // const db = new PouchDB("database.db", { adapter: "idb" });
//             // const db = new PouchDB("database.db", { adapter: "cordova-sqlite" });
//             // console.log(db);
//             try {
//                 const response = await fetch(event.request);
//                 // Check if we received a valid response
//                 if (
//                     !response ||
//                     response.status !== 200 ||
//                     response.type !== "basic"
//                 ) {
//                     return response;
//                 }

//                 // IMPORTANT: Clone the response. A response is a stream
//                 // and because we want the browser to consume the response
//                 // as well as the cache consuming the response, we need
//                 // to clone it so we have two streams.
//                 // const cache = await caches.open(RUNTIME);
//                 // await cache.put(event.request, response.clone());

//                 // eslint-disable-next-line no-undef
//                 const res = response.clone().blob()
//                 // eslint-disable-next-line no-undef
//                 localforage.setItem(event.request.url, res);

//                 return response;
//             } catch (err) {
//                 // eslint-disable-next-line no-undef
//                 const blob = await localforage.getItem(event.request.url);
//                 // const response = await caches.match(event.request);
//                 // if (response) {
//                 if (blob) {
//                 const response = blob.stream()
//                 // console.log(response.clone())
//                     return response;
//                 }
//             }
//         })(event)
//     );
// });

const cachedResponse = async (request) => {
    try {
        const response = await fetch(request);
        if (!response || response.status !== 200 || response.type !== "basic") {
            return response;
        }
        const res = await response.clone().blob();
        console.log(res);
        // eslint-disable-next-line no-undef
        const a = await localforage.setItem(request.url, res);
        console.log(a);
        console.log("save");

        return response;
    } catch (err) {
        // eslint-disable-next-line no-undef
        const blob = await localforage.getItem(request.url);
        console.log(blob);
        console.log("get");
        if (blob) {
            return new Response(blob);
        }
        return new Response();
    }
};

self.addEventListener("fetch", (event) => {
    event.respondWith(cachedResponse(event.request));
});

