import { IonContent } from "@ionic/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getPlayerModelRequest } from "../actions/playerAction";
import { appendScripts, appendStyles } from "../utils/utilFunc";

async function loadData(model, containerName) {
    appendStyles(model.styles, containerName);
    const script = document.createElement("script");
    script.innerHTML = `H5PIntegration = ${JSON.stringify(
        model.integration,
        null,
        2
    )}`;
    document.getElementById(containerName).appendChild(script);

    // TODO find a way to avoid loading the scripts twice.
    await appendScripts(model.scripts, containerName);
    await appendScripts(model.customScripts, containerName);

    const div = document.createElement("div");
    div.setAttribute("class", "h5p-content");
    div.setAttribute("data-content-id", model.contentId);
    document.getElementById(containerName).appendChild(div);
    // document.body.appendChild(div);

    await appendScripts(model.scripts, containerName);
}

function Player() {
    const containerName = "container";
    const dispatch = useDispatch();
    const { documentId } = useParams();
    const playerState = useSelector((state) => state.player);
    const model = playerState?.model;

    useEffect(() => {
        if (model) {
            loadData(model, containerName);
        } else {
            dispatch(getPlayerModelRequest(documentId));
        }
    }, [dispatch, documentId, model]);

    return (
        <IonContent id={containerName}>
            {/* <div
                    className="h5p-content"
                    data-content-id={model?.contentId}
                ></div> */}
        </IonContent>
    );
}

export default Player;
