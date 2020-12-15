import { IonContent } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SERVER_URL } from "../constants/constant";
import { appendScripts, appendStyles } from "../utils/utilFunc";

async function getModel(documentId) {
    const url = !!documentId
        ? SERVER_URL + `/h5p/edit/${documentId}`
        : SERVER_URL + `/h5p/new`;

    let response = null;
    let payload = null;
    try {
        response = await fetch(url, {
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
        payload = await response.json();
    }
    return payload;
}

async function loadData(model, containerName, documentId) {
    appendStyles(model.styles, containerName);
    const script = document.createElement("script");
    script.innerHTML = `H5PIntegration = ${JSON.stringify(
        model.integration,
        null,
        2
    )}`;
    document.getElementById(containerName).appendChild(script);
    await appendScripts(model.scripts, containerName);
    appendEditorScript(containerName, documentId);
}

function Editor() {
    const containerName = "container";
    const playUrl = "/h5p/play";
    const { documentId } = useParams();
    const [model, setModel] = useState();

    async function loadModel(documentId) {
        setModel(await getModel(documentId));
    }

    useEffect(() => {
        if (model) {
            loadData(model, containerName, documentId);
        } else {
            // dispatch(getEditorModelRequest(documentId));
            loadModel(documentId);
        }
    }, [documentId, model]);

    return (
        <IonContent id={containerName}>
            <form
                method="post"
                encType="multipart/form-data"
                id="h5p-content-form"
            >
                <div id="post-body-content">
                    <div className="h5p-create">
                        <div className="h5p-editor"></div>
                    </div>
                </div>
                <input
                    type="submit"
                    name="submit"
                    value="Create"
                    className="button button-primary button-large"
                    // style={{display: this.state.isShowing ? "inherit" : "none"}}
                />
            </form>
            <Link id="linkToPlay" to={`${playUrl}/${documentId}`}></Link>
        </IonContent>
    );
}

export default Editor;

const appendEditorScript = (containerName, documentId) => {
    const paramsUrl = "/h5p/params/";
    const jquery = `var ns = H5PEditor;

    (function($) {
        H5PEditor.init = function() {
            H5PEditor.$ = H5P.jQuery;
            H5PEditor.basePath = H5PIntegration.editor.libraryUrl;
            H5PEditor.fileIcon = H5PIntegration.editor.fileIcon;
            H5PEditor.ajaxPath = H5PIntegration.editor.ajaxPath;
            H5PEditor.filesPath = H5PIntegration.editor.filesPath;
            H5PEditor.apiVersion = H5PIntegration.editor.apiVersion;

            // Semantics describing what copyright information can be stored for media.
            H5PEditor.copyrightSemantics = H5PIntegration.editor.copyrightSemantics;
            H5PEditor.metadataSemantics = H5PIntegration.editor.metadataSemantics;

            // Required styles and scripts for the editor
            H5PEditor.assets = H5PIntegration.editor.assets;

            H5PEditor.contentId = H5PIntegration.editor.nodeVersionId;

            var h5peditor;
            var $type = $('input[name="action"]');
            var $upload = $('.h5p-upload');
            var $create = $('.h5p-create').hide();
            var $editor = $('.h5p-editor');
            var $library = $('input[name="library"]');
            var $params = $('input[name="parameters"]');
            var library = $library.val();

            // $type.change(function () {
            //   if ($type.filter(':checked').val() === 'upload') {
            //     $create.hide();
            //     $upload.show();
            //   }
            //   else {
            $upload.hide();
            if (h5peditor === undefined && H5PEditor.contentId !== undefined) {
                $.ajax({
                    error: function(res) {
                        h5peditor = new ns.Editor(undefined, undefined, $editor[0]);
                        $create.show();
                    },
                    success: function(res) {
                        h5peditor = new ns.Editor(
                            res.library,
                            JSON.stringify(res.params),
                            $editor[0]
                        );
                        $create.show();
                        // $type.change();
                    },
                    type: 'GET',
                    xhrFields: {
                        withCredentials: true
                    },
                    url: '${paramsUrl}' + H5PEditor.contentId + window.location.search,
                    xhrFields: {
                        withCredentials: true
                    }
                });
            } else if (h5peditor === undefined) {
                console.log('h5peditor is undefined')
                h5peditor = new ns.Editor(undefined, undefined, $editor[0]);
                $create.show();
            }
            $create.show();
            //   }
            // });

            if ($type.filter(':checked').val() === 'upload') {
                $type.change();
            } else {
                $type
                    .filter('input[value="create"]')
                    .attr('checked', true)
                    .change();
            }

            $('#h5p-content-form').submit(function(event) {
                if (h5peditor !== undefined) {
                    var params = h5peditor.getParams();

                    if (params.params !== undefined) {
                        // Validate mandatory main title. Prevent submitting if that's not set.
                        // Deliberately doing it after getParams(), so that any other validation
                        // problems are also revealed
                        // if (!h5peditor.isMainTitleSet()) {

                        // }

                        // Set main library
                        $library.val(h5peditor.getLibrary());

                        // Set params
                        $params.val(JSON.stringify(params));
                        // TODO check if this really works
                        if (H5PEditor.contentId) {
                            var editApiUrl = '/h5p/edit/${documentId}'
                        } else {
                            var editApiUrl = '/h5p/new/'
                        }

                        $.ajax({
                            data: JSON.stringify({
                                library: h5peditor.getLibrary(),
                                params
                            }),
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            url: editApiUrl,
                            type: 'POST',
                            xhrFields: {
                                withCredentials: true
                            }
                        }).then((result) => {
                            const parsedResult = JSON.parse(result)
                            console.log(parsedResult)
                            if(parsedResult.documentId) {
                                document.getElementById("linkToPlay").click();
                            }
                        });

                        return event.preventDefault();
                        // TODO - Calculate & set max score
                        // $maxscore.val(h5peditor.getMaxScore(params.params));
                    }
                }
            });

            // Title label
            var $title = $('#h5p-content-form #title');
            var $label = $title.prev();
            $title
                .focus(function() {
                    $label.addClass('screen-reader-text');
                })
                .blur(function() {
                    if ($title.val() === '') {
                        $label.removeClass('screen-reader-text');
                    }
                })
                .focus();

            // Delete confirm
            $('.submitdelete').click(function() {
                return confirm(H5PIntegration.editor.deleteMessage);
            });
        };

        H5PEditor.getAjaxUrl = function(action, parameters) {
            var url = H5PIntegration.editor.ajaxPath + action;

            if (parameters !== undefined) {
                for (var property in parameters) {
                    if (parameters.hasOwnProperty(property)) {
                        url += '&' + property + '=' + parameters[property];
                    }
                }
            }

            url += window.location.search.replace(/\\?/g, '&');
            return url;
        };

        $(document).ready(H5PEditor.init);
    })(H5P.jQuery);`;

    const script = document.createElement("script");
    script.innerHTML = jquery;
    document.getElementById(containerName).appendChild(script);
};
