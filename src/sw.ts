/// <reference lib="webworker" />
import { Capacitor } from "@capacitor/core";
import PouchDB from "pouchdb";
import cordovaSqlitePlugin from "pouchdb-adapter-cordova-sqlite";
import { precacheAndRoute } from "workbox-precaching";
import { SERVER_URL } from "./constants/constant";

declare const self: ServiceWorkerGlobalScope;
precacheAndRoute(self.__WB_MANIFEST);

let pouchdb: PouchDB.Database;

if (Capacitor.isNative) {
    PouchDB.plugin(cordovaSqlitePlugin);
    pouchdb = new PouchDB("myDB.db", { adapter: "cordova-sqlite" });
    console.log("running on a native device");
} else {
    pouchdb = new PouchDB("myDB.db");
    console.log("running on the browser");
}

const CORE_URLS = [
    "/h5p/core/js/jquery.js",
    "/h5p/core/js/h5p.js",
    "/h5p/core/js/h5p-event-dispatcher.js",
    "/h5p/core/js/h5p-x-api-event.js",
    "/h5p/core/js/h5p-x-api.js",
    "/h5p/core/js/h5p-content-type.js",
    "/h5p/core/js/h5p-confirmation-dialog.js",
    "/h5p/core/js/h5p-action-bar.js",
    "/h5p/core/js/request-queue.js",
    "/h5p/core/styles/h5p-confirmation-dialog.css",
].map((url) => SERVER_URL + url);

const EDITOR_SCRIPT_URLS = [
    "/h5p/editor/scripts/h5peditor-editor.js",
    "/h5p/editor/scripts/h5peditor.js",
    "/h5p/editor/language/en.js",
    "/h5p/editor/scripts/h5p-hub-client.js",
    "/h5p/editor/scripts/h5peditor-semantic-structure.js",
    "/h5p/editor/scripts/h5peditor-library-selector.js",
    "/h5p/editor/scripts/h5peditor-fullscreen-bar.js",
    "/h5p/editor/scripts/h5peditor-form.js",
    "/h5p/editor/scripts/h5peditor-text.js",
    "/h5p/editor/scripts/h5peditor-html.js",
    "/h5p/editor/scripts/h5peditor-number.js",
    "/h5p/editor/scripts/h5peditor-textarea.js",
    "/h5p/editor/scripts/h5peditor-file-uploader.js",
    "/h5p/editor/scripts/h5peditor-file.js",
    "/h5p/editor/scripts/h5peditor-image.js",
    "/h5p/editor/scripts/h5peditor-image-popup.js",
    "/h5p/editor/scripts/h5peditor-av.js",
    "/h5p/editor/scripts/h5peditor-group.js",
    "/h5p/editor/scripts/h5peditor-boolean.js",
    "/h5p/editor/scripts/h5peditor-list.js",
    "/h5p/editor/scripts/h5peditor-list-editor.js",
    "/h5p/editor/scripts/h5peditor-library.js",
    "/h5p/editor/scripts/h5peditor-library-list-editor.js",
    "/h5p/editor/scripts/h5peditor-select.js",
    "/h5p/editor/scripts/h5peditor-select-hub.js",
    "/h5p/editor/scripts/h5peditor-select-legacy.js",
    "/h5p/editor/scripts/h5peditor-demensions.js",
    "/h5p/editor/scripts/h5peditor-coordinates.js",
    "/h5p/editor/scripts/h5peditor-none.js",
    "/h5p/editor/scripts/h5peditor-metadata.js",
    "/h5p/editor/scripts/h5peditor-metadata-author-widget.js",
    "/h5p/editor/scripts/h5peditor-metadata-changelog-widget.js",
    "/h5p/editor/scripts/h5peditor-metadata-pre-save.js",
    "/h5p/editor/ckeditor/ckeditor.js",
].map((url) => SERVER_URL + url);

const FULL_PATH_URLS = [
    "https://h5p.org/sites/default/files/interactive%20video.svg",
    "https://h5p.org/sites/default/files/question-set.svg",

];

const LIBRARIES_URLS = [
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
    "/h5p/libraries/FontAwesome-4.5/h5p-font-awesome.min.css",
    "/h5p/libraries/Tether-1.0/styles/tether.min.css",
    "/h5p/libraries/Drop-1.0/css/drop-theme-arrows-bounce.min.css",
].map((url) => SERVER_URL + url);

const PRECACHE_URLS = [
    ...CORE_URLS,
    ...EDITOR_SCRIPT_URLS,
    ...LIBRARIES_URLS,
    // ...FULL_PATH_URLS,
];

const precache = async (urls: string[]) => {
    for (const url of urls) {
        console.log(url);
        const request = new Request(url)
        const options = {
            credentials: "same-origin" as RequestCredentials,
            mode: "cors" as RequestMode,
        };
        if (request.url.includes("https://h5p.org/sites/default/files/")) {
            options.mode = "no-cors";
        }
        const response = await fetch(request, options);
        try {
            await putAttachment(request.url, response);
            console.log("pre-cache!");
        } catch (err) {
            console.log("error");
            console.log(err);
        }
    }
};

// The install handler takes care of precaching the resources we always need.
self.addEventListener("install", (event: ExtendableEvent) => {
    console.log("install");
    event.waitUntil(precache(PRECACHE_URLS));
});

self.addEventListener("activate", (event: ExtendableEvent) => {
    console.log("Claiming control");
    event.waitUntil(self.clients.claim());
});

const cachedResponse = async (request: Request) => {
    let blob = null;
    try {
        const data = await pouchdb.get(request.url, {
            attachments: true,
            binary: true,
        });
        const attachment = data._attachments
            ?.attachment as PouchDB.Core.FullAttachment;
        blob = attachment.data;
        // blob = await localforage.getItem(request.url);
        // if (blob) {
        //     console.log(request.url + " was pre-cached!");
        //     return new Response(blob);
        // }
    } catch (err) {
        console.log(err);
    }

    if (
        blob &&
        (request.url.endsWith(".js") ||
            request.url.endsWith(".css") ||
            request.url.endsWith(".png") ||
            request.url.includes("/h5p/libraries/") ||
            request.url.includes("/h5p.org/sites/default/files/"))
    ) {
        console.log(request.url + " was pre-cached!");
        return new Response(blob);
    }
    console.log(request.url);

    try {
        const options = {
            credentials: "same-origin" as RequestCredentials,
            mode: "cors" as RequestMode,
        };
        if (request.url.includes("https://h5p.org/sites/default/files/")) {
            options.mode = "no-cors";
        } else if (request.url.includes(SERVER_URL)) {
            options.credentials = "include" as RequestCredentials;
        }

        const response = await fetch(request, options);
        // const response = await fetch(request);

        // if (!response || response.status !== 200) {
        //     console.log(response);
        //     console.log("whaaa");
        //     return response;
        // }
        // const res = await response.clone().blob();
        // const blob = await localforage.setItem(request.url, res);
        return await putAttachment(request.url, response);
    } catch (err) {
        return new Response(blob);
    }
};

self.addEventListener("fetch", (event: FetchEvent) => {
    console.log("fetch");
    event.respondWith(cachedResponse(event.request));
});

async function putAttachment(
    url: string,
    response: Response
): Promise<Response> {
    let rev;
    try {
        const meta = await pouchdb.get(url, {
            attachments: true,
            binary: true,
        });
        rev = meta?._rev;
        console.log(meta);
    } catch (err) {
        console.log("no precached data for " + url);
        console.log(err);
    }

    const clone = response.clone();
    const blob = await clone.blob();
    const res = await pouchdb.put({
        _id: url,
        _rev: rev,
        _attachments: {
            attachment: {
                content_type: blob.type,
                data: blob,
            },
        },
    });
    console.log(res);
    return response;
}
