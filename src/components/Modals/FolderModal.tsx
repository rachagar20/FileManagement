import { Modal, Button } from "react-bootstrap";
import { Icons } from "../icons/Icons";
export interface DeleteModalProps {
  showModal: boolean;
  onClose: () => void;
  handleSubmit: () => void;
  type: "delete" | "create";
}
const DeleteModal: React.FC<DeleteModalProps> = ({ type, showModal, onClose, handleSubmit }) => {
  return (
    <>
      {
        type === "delete" ?
          <Modal show={showModal} onHide={onClose} backdrop="static" centered keyboard={false}>
            <Modal.Header className="fw-bold">
              Delete Folder
              <button type="button" onClick={() => onClose()} className="btn btn-sm btn-icon btn-active-light-primary me-n5">
                <Icons name={"closeButton"} width={"22px"} />
              </button>
            </Modal.Header>
            <Modal.Body className="text">
            The folder contains one or more documents. Do you want to delete all the associated documents as well?          
            </Modal.Body>
            <Modal.Footer>
              <Button className="buttonStyle" onClick={() => { handleSubmit() }}>
                Confirm
              </Button>
            </Modal.Footer>
          </Modal> :
          <Modal show={showModal} onHide={onClose} backdrop="static" centered keyboard={false}>
            <Modal.Header className="fw-bold">
              Create Document
              <button type="button" onClick={() => onClose()} className="btn btn-sm btn-icon btn-active-light-primary me-n5">
                <Icons name={"closeButton"} width={"22px"} />
              </button>
            </Modal.Header>
            <Modal.Body className="text">
              Folder not found. Would you like to create a new folder?
            </Modal.Body>
            <Modal.Footer>
              <Button className="buttonStyle" onClick={() => { handleSubmit() }}>
                Confirm
              </Button>
            </Modal.Footer>
          </Modal>
      }
    </>
  );
}

export default DeleteModal;
