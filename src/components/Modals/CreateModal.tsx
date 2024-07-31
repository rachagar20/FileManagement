import { Modal, Button, Form, Spinner } from "react-bootstrap";
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { RootState, useAppDispatch } from "../../store/store";
import { useSelector } from "react-redux";
import { addDocument } from "../../slices/DocumentSlice";
import { setLoading } from "../../slices/LoadingSlice";
import { addFolder, Folder } from "../../slices/FolderSlice";
import { extractFileType, getDate } from "../../utils/extraFunctions";
import { toast } from "react-toastify";
import DropZone from "../Dropzone";
import { Icons } from "../icons/Icons";
import { shortenName } from "../../utils/extraFunctions";
import DeleteModal from "./FolderModal";

interface CreateModalProps {
    show: boolean;
    onClose: () => void;
    createType: string;
    setShowModal: (show: boolean) => void;
}

const CreateModal: React.FC<CreateModalProps> = ({ show, onClose, createType, setShowModal }) => {
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState({
        newFolderName: "",
        newDocumentName: "",
        selectedFolderName: "",
        selectedFolderId: "",
        file: null as File | null,
    });
    const [createNewFolder, setCreateNewFolder] = useState(false);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [validated, setValidated] = useState(true);
    const [suggested, setSuggested] = useState<Folder[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);




    const suggestionsRef = useRef<HTMLDivElement>(null);
    const folders = useSelector((state: RootState) => state.folders.folders);
    const documents = useSelector((state: RootState) => state.documents.documents);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
                setSuggested([]);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const uploadFileToConvertApi = async (file: File | null) => {
        try {
            if (!file) return null;
            const formData = new FormData();
            formData.append('file', file, file.name);
            const response = await fetch('https://v2.convertapi.com/upload', {
                method: "POST",
                body: formData
            });
            if (!response.ok) {
                throw new Error("Failed to upload the file! Try again later.");
            }
            const data = await response.json();
            return data.FileId;
        } catch (e: any) {
            console.error(e);
            toast.error("Error uploading file.");
            return null;
        }
    };

    const resetModal = () => {
        setValidated(true);
        setFormData({
            newFolderName: "",
            newDocumentName: "",
            selectedFolderName: "",
            selectedFolderId: "",
            file: null,
        });
        dispatch(setLoading(false));
        setSuggested([]);
        setLoadingSuggestions(false);
        onClose();
    };

    const matchingObj = useCallback(() => {
        let obj: any;
        if (createType === "folder") {
            obj = folders.find(folder => folder.folderName.replace(/\s/g, '').toLowerCase() === formData.newFolderName.replace(/\s/g, '').toLowerCase());
        } else {
            obj = documents.find(document => document.documentName.replace(/\s/g, '').toLowerCase() === formData.newDocumentName.replace(/\s/g, '').toLowerCase());
        }
        return !!obj;
    }, [createType, formData.newFolderName, formData.newDocumentName, folders, documents]);

    const handleDelete = () => {
        setFormData(prev => ({ ...prev, file: null }));
    };

    const onCloseCreateFolder = () => {
        setCreateNewFolder(false);
        setShowModal(true);
        dispatch(setLoading(false));
    };

    const handleSubmitCreateFolder = async () => {
        try {
            setCreateNewFolder(false);
            const folderId = await createFolder(formData.selectedFolderName);
            if (folderId) {
                await createDocument(formData.file, formData.newDocumentName, folderId);
                resetModal();
            }
        } catch (error) {
            console.error("Error creating folder:", error);
            toast.error("Error creating folder.");
        }
    };

    const createFolder = async (folderName: string) => {
        try {
            const folder = { folderName: folderName, createdBy: "OWNER", createdOn: getDate() };
            const response = await fetch(`${import.meta.env.VITE_URL}/folders`, {
                method: "POST",
                body: JSON.stringify(folder),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                dispatch(addFolder(data));
                toast.success("Folder created successfully.");
                return data.id;
            } else {
                throw new Error("Failed to create folder.");
            }
        } catch (error) {
            console.error("Error creating folder:", error);
            toast.error("Error creating folder.");
            return null;
        }
    };

    const createDocument = async (file: File | null, documentName: string, folderId: string) => {
        try {
            const fileUrl: string | null = await uploadFileToConvertApi(file);
            if (!fileUrl) return;
            const document = {
                documentName: documentName,
                documents: file ? file.name : documentName,
                folderId,
                uploadedBy: "OWNER",
                uploadedOn: getDate(),
                url: fileUrl,
            };
            const response = await fetch(`${import.meta.env.VITE_URL}/documents`, {
                method: "POST",
                body: JSON.stringify(document),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                dispatch(addDocument(data));
                toast.success("Document uploaded successfully.");
            } else {
                throw new Error("Failed to upload document.");
            }
        } catch (error) {
            console.error("Error uploading document:", error);
            toast.error("Error uploading document.");
        }
    };

    const handleSubmit = async () => {
        try {
            dispatch(setLoading(true));

            if (createType === "folder") {
                if (!formData.newFolderName.trim() || matchingObj()) {
                    setValidated(false);
                    dispatch(setLoading(false));
                    return;
                }
                setValidated(true);
                await createFolder(formData.newFolderName);
            } else {
                if (!formData.newDocumentName.trim() || matchingObj() || !formData.selectedFolderName.trim() || !formData.file) {
                    setValidated(false);
                    dispatch(setLoading(false));
                    return;
                }
                setValidated(true);
                if (formData.selectedFolderId) {
                    setShowModal(false);
                    await createDocument(formData.file, formData.newDocumentName, formData.selectedFolderId);
                } else {
                    const response = await fetch(`${import.meta.env.VITE_URL}/folders?folderName_like=^${formData.selectedFolderName}`);
                    let folder = null;
                    if (response.ok) {
                        const data = await response.json();
                        folder = data[0];
                    }
                    if (folder) {
                        setShowModal(false);
                        await createDocument(formData.file, formData.newDocumentName, folder.id);
                    } else {
                        setShowModal(false);
                        setCreateNewFolder(true);
                        return;
                    }
                }
            }
            resetModal();
            dispatch(setLoading(false));
        } catch (e) {
            console.error("Error occurred:", e);
            toast.error("Error occurred while processing your request.");
            dispatch(setLoading(false));
        }
    };


    const getSuggestions = async (searchValue: string, page: number = 1) => {
        setLoadingSuggestions(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_URL}/folders?folderName_like=^${searchValue}&_page=${page}&_limit=3`);
            if (response.ok) {
                const data = await response.json();
                const totalCount = parseInt(response.headers.get('X-Total-Count') || '0', 10);
                setSuggested(prev => page === 1 ? data : [...prev, ...data]);
                setTotalPages(Math.ceil(totalCount / 3));
            }
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
        setLoadingSuggestions(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value, selectedFolderId: "" }));
        if (name === "selectedFolderName" && value) {
            setCurrentPage(1); 
            getSuggestions(value, 1);
        } else {
            setSuggested([]);
        }
    };

    const handleFileChange = (file: File | null) => {
        setFormData(prev => ({ ...prev, file }));
    };

    const formInvalid = useMemo(() => {
        if (createType === "folder") {
            return !validated && (formData.newFolderName.trim().length === 0 || matchingObj());
        } else {
            return !validated && (formData.newDocumentName.trim().length === 0 || matchingObj());
        }
    }, [validated, formData, createType, matchingObj]);

    return (
        <>
            <Modal show={show} onHide={resetModal} centered backdrop="static" keyboard={false} aria-labelledby="create-modal-title">
                <Modal.Header>
                    <Modal.Title id="create-modal-title">Add {createType === "folder" ? "Folder" : "Document"}</Modal.Title>
                    <button type="button" onClick={() => resetModal()} className="btn btn-sm btn-icon btn-active-light-primary me-n5">
                        <Icons name={"closeButton"} width={"22px"} />
                    </button>
                </Modal.Header>
                <Modal.Body>
                    {createType === "folder" ? (
                        <Form onSubmit={(e) => e.preventDefault()}>
                            <Form.Group className="mb-3">
                                <Form.Label>Folder Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="newFolderName"
                                    value={formData.newFolderName}
                                    onChange={handleInputChange}
                                    isInvalid={formInvalid}
                                    autoComplete="off"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formData.newFolderName.trim().length === 0 ? "Folder Name is Required." : "Folder Name already exists"}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form>
                    ) : (
                        <>
                            <Form.Group className="mb-3">
                                <Form.Label>Document Name</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    name="newDocumentName"
                                    value={formData.newDocumentName}
                                    onChange={handleInputChange}
                                    isInvalid={formInvalid}
                                    autoComplete="off"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formData.newDocumentName.trim().length === 0 ? "Document Name is Required" : "Document already exists"}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Folder Name</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    name="selectedFolderName"
                                    value={formData.selectedFolderName}
                                    onChange={handleInputChange}
                                    isInvalid={!validated && (!formData.selectedFolderId.trim() && !formData.selectedFolderName.trim())}
                                    autoComplete="off"
                                ></Form.Control>

                                <Form.Control.Feedback type="invalid">Folder is Required</Form.Control.Feedback>
                                {loadingSuggestions ? (
                                    <div className="loadContainer">
                                        <Spinner className="spinner" animation="border" variant="primary" role="status" size="sm" />
                                    </div>
                                ) : (
                                    <div ref={suggestionsRef} className="suggestion-container">
                                        {suggested.length > 0 && (
                                            <ul className="list-group suggestions-list">
                                                {suggested.map((eachFolder) => (
                                                    <li
                                                        key={eachFolder.id}
                                                        className="suggestion-item"
                                                        onClick={() => {
                                                            setFormData(prev => ({ ...prev, selectedFolderName: eachFolder.folderName, selectedFolderId: eachFolder.id }));
                                                            setSuggested([]);
                                                        }}
                                                    >
                                                        {eachFolder.folderName}
                                                    </li>
                                                ))}
                                                {currentPage < totalPages && (
                                                    <li className="suggestion-item">
                                                    <button
                                                        className="btn"
                                                        onClick={() => {
                                                            const nextPage = currentPage + 1;
                                                            setCurrentPage(nextPage);
                                                            getSuggestions(formData.selectedFolderName, nextPage);
                                                        }}
                                                        style={{
                                                            fontSize:"12px",
                                                            padding:"0px",
                                                            textAlign:"center",
                                                            width:"100%",
                                                            color:"rgb(28, 113, 255)",
                                                            outline:"none",
                                                            border:"none"
                                                        }}
                                                    >
                                                        Load More....
                                                    </button>
                                                    </li>
                                                )}
                                            </ul>
                                        )}
                                    </div>
                                )}
                            </Form.Group>
                            {formData.file === null ? (
                                <>
                                    <DropZone setFile={handleFileChange} isInvalid={!validated && !formData.file} />
                                </>
                            ) : (
                                <div className="fileUpload">
                                    <div>
                                        <Icons name={extractFileType(formData.file.name)} width={"20px"} /> {shortenName(formData?.file?.name, 50)}
                                    </div>
                                    <Button variant="danger" onClick={handleDelete}>
                                        <svg width="15" height="15" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                                        </svg>
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>

                    <Button className="buttonStyle" onClick={handleSubmit}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
            <DeleteModal type={"create"} showModal={createNewFolder} onClose={onCloseCreateFolder} handleSubmit={handleSubmitCreateFolder} />
        </>
    );
};

export default CreateModal;
