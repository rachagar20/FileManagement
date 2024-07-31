import { Modal, Button } from "react-bootstrap"
import { Icons } from "../icons/Icons"
interface ConfirmModalprops {
  type: string,
  name: string,
  show: boolean,
  onClose: () => void,
  handleSubmit: () => void
}
const ConfirmModal: React.FC<ConfirmModalprops> = ({ type, name, show, onClose, handleSubmit }) => {
  return (
    <Modal show={show} onHide={onClose} backdrop="static" centered keyboard={false}>
      <Modal.Header className="fw-bold">
        {
          type === "folder" ? "Delete Folder" : "Delete Document"

        }
        <button type="button" onClick={()=>onClose()} className="btn btn-sm btn-icon btn-active-light-primary me-n5">
        <Icons name={"closeButton"} width={"22px"}/>
        </button>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete <b>{name}</b>?
      </Modal.Body>
      <Modal.Footer>
        <Button className="buttonStyle" onClick={() => { handleSubmit() }}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
export default ConfirmModal;
