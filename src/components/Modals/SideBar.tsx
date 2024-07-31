import React, { useState } from "react"
import { Folder } from "../../slices/FolderSlice";
import Offcanvas from 'react-bootstrap/Offcanvas';
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import DisplayModal from "./DisplayModal";
import { extractFileType,shortenName } from "../../utils/extraFunctions";
import { Icons } from "../icons/Icons";


interface SideBarProps {
    show: boolean;
    handleClose: () => void;
    folder: Folder
}
const SideBar: React.FC<SideBarProps> = ({ show, handleClose, folder }) => {
    const [showModal, setShowModal] = useState(false);
    const [currDoc, setCurrDoc] = useState({ id: "", documentName: "", documents: "", folderId: "", uploadedBy: "", uploadedOn: "", url: "" });
    const documents = useSelector((state: RootState) => state.documents.documents).filter((eachDoc) => eachDoc.folderId === folder.id);
    return (
        <>
            <Offcanvas show={show} onHide={handleClose} placement="end">
                <Offcanvas.Header>
                    <Offcanvas.Title className="fs-5 border-b-2">Folder Details</Offcanvas.Title>
                    <button type="button" onClick={() => handleClose()} className="btn btn-sm btn-icon btn-active-light-primary me-n5">
                        <Icons name={"closeButton"} width={"22px"} />
                    </button>
                </Offcanvas.Header>
                <Offcanvas.Body >
                    <div className="d-flex mb-3 flex-row justify-content-center">
                        <Icons name={"folder"} width={"70px"} />
                    </div>
                    <div>
                        <ul className="nav nav-underline" id="myTab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link active"
                                    id="details-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#details-tab-pane"
                                    type="button"
                                    role="tab"
                                    aria-controls="details-tab-pane"
                                    aria-selected="true"
                                >
                                    Details
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link"
                                    id="documents-sideBar-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#documents-sideBar-tab-pane"
                                    type="button"
                                    role="tab"
                                    aria-controls="documents-sideBar-tab-pane"
                                    aria-selected="false"
                                >
                                    Documents
                                </button>
                            </li>
                        </ul>

                        <div className="tab-content d-flex" id="myTabContent">
                            <div
                                className="tab-pane fade show active"
                                id="details-tab-pane"
                                style={{ width: '100%' }}
                                role="tabpanel"
                                aria-labelledby="details-tab"
                            >
                                <div className="card">
                                    <div className="card-body">
                                        <p className="card-text"><span className="fw-bold">Folder Name: </span>{folder.folderName}</p>
                                        <p className="card-text"><span className="fw-bold">Created By: </span>{folder.createdBy}</p>
                                        <p className="card-text"><span className="fw-bold">Created On: </span>{folder.createdOn}</p>
                                        <p className="card-text"><span className="fw-bold">No. of Documents: </span>{documents.length}</p>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="tab-pane fade"
                                id="documents-sideBar-tab-pane"
                                style={{ width: '100%' }}
                                role="tabpanel"
                                aria-labelledby="documents-sideBar-tab"
                            >
                                <div className="card" style={{ padding: "15px", height: "300px", overflowY: "scroll", scrollbarWidth: "thin" ,scrollbarColor:"rgb(228, 230, 239) rgba(0, 0, 0, 0)"}}>
                                    <div className="card-subtitle"><Icons name={"folder"} width={"25px"} />{shortenName(folder.folderName,25)}</div>
                                    <div className="card-body " style={{ paddingLeft: "30px" }}>
                                        {
                                            documents.length > 0 ? documents.map((eachDoc) => (
                                                    <div key={eachDoc.id} className="card-text document-card-item" onClick={() => { setShowModal(true); setCurrDoc(eachDoc) }} style={{ cursor: "pointer" }}>
                                                        <Icons name={"arrow"} width={"16px"} />
                                                        <div className="document-item">
                                                            <Icons name={extractFileType(eachDoc.documents)} width={"16px"} />
                                                            {shortenName(eachDoc.documentName,25)}
                                                        </div>
                                                    </div>
                                            )) : <p className="card-text"><span className="fw-bold">No documents to display.</span></p>

                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
            <DisplayModal show={showModal} onClose={() => setShowModal(false)} document={currDoc} />
        </>
    )
}

export default SideBar;



