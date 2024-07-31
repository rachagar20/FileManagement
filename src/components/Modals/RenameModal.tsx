import { Modal, Button, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import {RootState,useAppDispatch} from "../../store/store.ts"
import { useSelector } from "react-redux";
import { renameFolder } from "../../slices/FolderSlice";
import { renameDocument } from "../../slices/DocumentSlice";
import { toast } from "react-toastify"
import { Icons } from "../icons/Icons";
import { setLoading } from "../../slices/LoadingSlice";
interface RenameModalProps {
  show: boolean,
  onClose: () => void;
  element: {
    id: string,
    name: string,
  },
  type: "folder" | "document"
}
const RenameModal: React.FC<RenameModalProps> = ({ show, onClose, element, type }) => {
  const dispatch = useAppDispatch();
  const [currentInputField, setCurrentInputField] = useState("");
  const [validated, setValidated] = useState(true);
  const documents = useSelector((state: RootState) => state.documents.documents);
  const folders = useSelector((state: RootState) => state.folders.folders)


  const matchingName = () => {
    let obj = null
    if (type === "folder") {
      obj = folders.find((folder) => folder.folderName.replace(/\s/g, '').toLowerCase() === currentInputField.replace(/\s/g, '').toLowerCase() && folder.id != element.id)
    } else {
      obj = documents.find((document) => document.documentName.replace(/\s/g, '').toLowerCase() === currentInputField.replace(/\s/g, '').toLowerCase() && document.id != element.id)
    }
    if (obj) return true;
    return false;
  }

  const handleRename = async () => {
    if (matchingName()) {
      setValidated(false);
      return;
    }
    setValidated(true);
    onClose();
    dispatch(setLoading(true));
    try {
      if (type === "folder") {
        const response = await fetch(`${import.meta.env.VITE_URL}/folders/${element.id}`, {
          method: "PATCH",
          body: JSON.stringify({ folderName: currentInputField }),
          headers: {
            "Content-Type": "application/json"
          }
        })
        if (!response.ok) throw new Error("Failed to rename the folder.")
        dispatch(renameFolder({ id: element.id, name: currentInputField }));
        toast.success("Folder renamed successfully.")
      } else {
        const response = await fetch(`${import.meta.env.VITE_URL}/documents/${element.id}`, {
          method: "PATCH",
          body: JSON.stringify({ documentName: currentInputField }),
          headers: {
            "Content-Type": "application/json"
          }
        })
        if (!response.ok) throw new Error("Failed to rename the document.")
        dispatch(renameDocument({ id: element.id, name: currentInputField }));
        toast.success("Document renamed successfully.")
      }
    } catch (error: any) {
      toast.error(error.message)
    }finally{
      dispatch(setLoading(false));
    }
  }

  useEffect(() => {
    setCurrentInputField(element.name);
  }, [element.name])


  return (
    <Modal show={show} onHide={onClose} centered backdrop="static" keyboard={false} >
      <Modal.Header>
        <Modal.Title >Rename {type === "folder" ? "Folder" : "Document"}</Modal.Title>
        <button type="button" onClick={() => onClose()} className="btn btn-sm btn-icon btn-active-light-primary me-n5">
          <Icons name={"closeButton"} width={"22px"} />
        </button>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3" controlId="formFolderName">
          <Form.Label className="">New {type === "folder" ? "Folder" : "Document"} Name</Form.Label>
          <Form.Control
            type="text"
            value={currentInputField}
            onChange={(e) => setCurrentInputField(e.target.value)}
            isInvalid={!validated && currentInputField.trim() === '' || matchingName()}
          />
          <Form.Control.Feedback type="invalid">
            {currentInputField === "" ? `${type} name cannot be empty.` : `${type} already exists`}
          </Form.Control.Feedback>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button className="buttonStyle" onClick={() => currentInputField ? handleRename() : setValidated(false)} >Save</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RenameModal;