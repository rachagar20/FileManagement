import { useEffect, useState } from "react"
import Document from "../components/Document.tsx";
import Folder from "../components/Folder.tsx";
import { useAppDispatch, RootState } from "../store/store.ts";
import ToggleSwitch from "../components/ToggleSwitch.tsx";
import { fetchDocuments ,fetchDocumentsSearch} from "../slices/DocumentSlice.ts";
import { fetchFolders, fetchFoldersSearch } from "../slices/FolderSlice.ts";
import CreateModal from "../components/Modals/CreateModal.tsx";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
const Repository = () => {
    const [view, setView] = useState("tile");
    const [showModal, setShowModal] = useState(false);
    const [createType, setCreateType] = useState("");
    const [searchField, setSearchField] = useState("");
    const [activeTab, setActiveTab] = useState<'folder' | 'document'>('folder');
    const loading=useSelector((state:RootState)=>state.loading);
    const folders = useSelector((state: RootState) => state.folders.folders);
    const documents = useSelector((state: RootState) => state.documents.documents);
    const dispatch = useAppDispatch();


    const handleToggle = (newView: string) => {
        setView(newView);
    }

    const handleOpen = (type: string) => {
        setShowModal(true);
        setCreateType(type)
    }

    const handleClose = () => {
        setShowModal(false);
    }

    useEffect(() => {
        dispatch(fetchDocuments());
        dispatch(fetchFolders());
    }, [])

    useEffect(()=>{
        dispatch(fetchDocumentsSearch({search:searchField}))
        dispatch(fetchFoldersSearch({search:searchField}))
    },[searchField])

    return (
        <>
            <div className="container position-relative w-728px">
                <div className="d-flex justify-content-between mb-2 mt-3">
                    <h1 className="fs-3">Vault</h1>
                    <div className="component d-flex align-items-center">
                        <div className="position-relative" style={{ marginRight: "10px" }}>
                            <span className="svg-icon svg-icon-3 position-absolute left-0 top-50 translate-middle-y ms-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="13" height="14" viewBox="0 0 50 50">
                                    <path d="M 21 3 C 11.622998 3 4 10.623005 4 20 C 4 29.376995 11.622998 37 21 37 C 24.712383 37 28.139151 35.791079 30.9375 33.765625 L 44.085938 46.914062 L 46.914062 44.085938 L 33.886719 31.058594 C 36.443536 28.083 38 24.223631 38 20 C 38 10.623005 30.377002 3 21 3 z M 21 5 C 29.296122 5 36 11.703883 36 20 C 36 28.296117 29.296122 35 21 35 C 12.703878 35 6 28.296117 6 20 C 6 11.703883 12.703878 5 21 5 z"></path>
                                </svg>
                            </span>
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchField}
                                onChange={(e) => setSearchField(e.target.value)}
                                className="form-control form-control-solid w-250px ps-16 searchTab"
                                style={{
                                    outline: "none",
                                    boxShadow: "none",
                                    border: "0.8px solid rgb(156, 164, 169)",
                                    backgroundColor: "rgb(245, 248, 250)"
                                }}
                                onClick={(e) => e.preventDefault()} />
                        </div>
                        <div className="d-flex flex-col align-items-center btn-group">
                            <button type="button" className=" btn btn-primary dropdown-toggle buttonStyle " data-bs-toggle="dropdown" aria-expanded="false">
                                + Add New
                            </button>
                            <ul className="dropdown-menu">
                                <li><button type="button" className="btn btn-none w-100 border-0 dropdown-item" onClick={() => handleOpen("folder")}>Folder</button></li>
                                <li><button type="button" className="btn btn-none w-100 border-0 dropdown-item" onClick={() => handleOpen("document")}>Document</button></li>
                            </ul>

                        </div>
                    </div>
                </div>
                <div className="toggleSwitch">
                    <ToggleSwitch activeView={view} onToggle={handleToggle} />
                </div>
                <ul className="nav nav-underline" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button className={`nav-link ${activeTab === "folder" ? 'active' : ''}`} id="folder-tab" data-bs-toggle="tab" data-bs-target={`#folder-tab-pane-${view}`} type="button" role="tab" aria-controls={`#folder-tab-pane-${view}`} aria-selected="true" onClick={() => { setActiveTab("folder") }}>Folder <b>({folders.length})</b></button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className={`nav-link ${activeTab === "document" ? 'active' : ''}`} id="document-tab" data-bs-toggle="tab" data-bs-target={`#document-tab-pane-${view}`} type="button" role="tab" aria-controls={`#document-tab-pane-${view}`} aria-selected="false" onClick={() => { setActiveTab("document") }}>Document <b>({documents.length})</b></button>
                    </li>
                </ul>

                <div className="tab-content d-flex" id="myTabContent" >
                    <div className={`tab-pane fade show active`} id={`folder-tab-pane-${view}`} style={{ "width": "100%" }} role="tabpanel" aria-labelledby="folder-tab" >
                        {loading ?
                            <div className="h-100 d-flex justify-content-center align-items-center">
                                <Spinner className="text-center" animation="border" variant="primary" role="status" />
                            </div> :
                            <Folder view={view}/>
                        }
                    </div>
                    <div className={`tab-pane fade `} id={`document-tab-pane-${view}`} style={{ "width": "100%" }} role="tabpanel" aria-labelledby="document-tab" >
                        {loading ?
                            <div className="h-100 d-flex justify-content-center align-items-center">
                                <Spinner className="text-center" animation="border" variant="primary" role="status" />
                            </div> :
                            <Document view={view}/>
                        }
                    </div>
                </div>
            </div>

            <CreateModal show={showModal} setShowModal={setShowModal} onClose={handleClose} createType={createType}/>
        </>
    )
}

export default Repository