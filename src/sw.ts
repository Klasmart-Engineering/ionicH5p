/// <reference lib="webworker" />
import { Capacitor } from "@capacitor/core";
import PouchDB from "pouchdb";
import cordovaSqlitePlugin from "pouchdb-adapter-cordova-sqlite";
import { precacheAndRoute } from "workbox-precaching";
import { SERVER_URL } from "./constants/constant";
import upsert from "pouchdb-upsert";

declare const self: ServiceWorkerGlobalScope;
precacheAndRoute(self.__WB_MANIFEST);

let pouchdb: PouchDB.Database;
PouchDB.plugin(upsert);
if (Capacitor.isNative) {
    PouchDB.plugin(cordovaSqlitePlugin);
    pouchdb = new PouchDB("myDB.db", { adapter: "cordova-sqlite" });
    console.log("running on a native device");
} else {
    pouchdb = new PouchDB("myDB.db");
    console.log("running on the browser");
}

// const PRECACHE = "precache-v1";
// const RUNTIME = "example-cache";

// TODO find a way to avoid redefining the server url in the service worker script
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

const precache = async (urls: string[]) => {
    for (const url of urls) {
        console.log(url);
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
            // // eslint-disable-next-line no-undef
            // localforage.setItem(url, res);
            await pouchdb.putIfNotExists({
                _id: url,
                _attachments: {
                    attachment: {
                        content_type: res.type,
                        data: res,
                    },
                },
            });
            console.log("pre-cache!");
        } catch (err) {
            console.log("error");
            console.log(err);
        }
    }
};

// The install handler takes care of precaching the resources we always need.
self.addEventListener("install", (event) => {
    console.log("install");
    event.waitUntil(precache(PRECACHE_URLS));
});

self.addEventListener("activate", (event) => {
    console.log("Claiming control");
    event.waitUntil(self.clients.claim());
});

const cachedResponse = async (request: Request) => {
    if (request.url.endsWith(".js") || request.url.endsWith(".css")) {
        // const blob = await localforage.getItem(request.url);
        // const blob = await pouchdb.getAttachment(request.url, "attachment");
        // if (blob) {
        //     console.log(request.url + " was pre-cached!");
        //     return new Response(blob);
        // }
        try {
            const blob = await getFromPouch(request);
            return new Response(blob);
        } catch (err) {
            console.log(err);
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
        // localforage.setItem(request.url, res);
        await pouchdb.putIfNotExists({
            _id: request.url,
            _attachments: {
                attachment: {
                    content_type: res.type,
                    data: res,
                },
            },
        });

        return response;
    } catch (err) {
        // const blob = await localforage.getItem(request.url);
        // const blob = await pouchdb.getAttachment(request.url, "attachment");
        // if (blob) {
        //     return new Response(blob);
        // }
        // return new Response();
        try {
            const blob = await getFromPouch(request);
            return new Response(blob);
        } catch (err) {
            console.log(err);
            return new Response();
        }
    }
};

self.addEventListener("fetch", (event) => {
    console.log("fetch");
    event.respondWith(cachedResponse(event.request));
});

async function getFromPouch(request: Request) {
    const bin = await pouchdb.get(request.url, {
        attachments: true,
        binary: true,
    });
    console.log(bin);
    console.log('what')
    console.log(bin._attachments?.attachment);
    return (bin._attachments?.attachment as PouchDB.Core.FullAttachment).data;
}
