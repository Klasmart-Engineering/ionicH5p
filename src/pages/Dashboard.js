import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getDocumentsRequest } from "../actions/dashboardAction";
import { appendStyle } from "../utils/utilFunc";
import { BACKEND_BASE_URL, SERVER_URL } from "../constants/constant";

function DocumentList() {
    const dispatch = useDispatch();
    const dashboard = useSelector((state) => state.dashboard);
    const documents = dashboard?.documents;

    // TODO maybe use material ui and build an actual dashboard page?
    appendStyle(
        "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css",
        "sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
    );
    appendStyle(
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.css"
    );

    useEffect(() => {
        dispatch(getDocumentsRequest());
    }, [dispatch]);

    return (
        <div className="container">
            <h1>H5P NodeJS Demo</h1>
            <div className="alert alert-warning">
                This demo is for debugging and demonstration purposes only and
                not suitable for production use!
            </div>

            <Link className="btn btn-primary my-2" to={`/new`}>
                <span className="fa fa-plus-circle m-2"></span>Create new
                content
            </Link>

            <h2>Existing Content</h2>
            <div className="list-group">
                {documents?.map((document, idx) => (
                    <div className="list-group-item" key={idx}>
                        <div className="d-flex w-10">
                            <div className="mr-auto p-2 align-self-center">
                                <Link to={`/play/${document.documentId}`}>
                                    <h5>{document.content.title}</h5>
                                </Link>
                                <div className="small d-flex">
                                    <div className="mr-2">
                                        <span className="fa fa-book-open" />{" "}
                                        {document.content.mainLibrary}
                                    </div>
                                    <div className="mr-2">
                                        <span className="fa fa-fingerprint" />{" "}
                                        {document.documentId}
                                    </div>
                                </div>
                            </div>
                            <div className="p-2">
                                <Link
                                    className="btn btn-secondary"
                                    to={`/edit/${document.documentId}`}
                                >
                                    <span className="fa fa-pencil-alt m-1" />{" "}
                                    edit
                                </Link>
                            </div>
                            <div className="p-2">
                                <a
                                    className="btn btn-info"
                                    href={`${SERVER_URL}${BACKEND_BASE_URL}${"/download"}/${
                                        document.contentId
                                    }`}
                                >
                                    <span className="fa fa-file-download m-1" />{" "}
                                    download
                                </a>
                            </div>
                            <div className="p-2">
                                <a
                                    className="btn btn-danger"
                                    href={`${SERVER_URL}${BACKEND_BASE_URL}/delete/${document.documentId}`}
                                >
                                    <span className="fa fa-trash-alt m-1" />{" "}
                                    delete
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DocumentList;
