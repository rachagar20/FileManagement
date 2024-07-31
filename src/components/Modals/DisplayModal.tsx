import { Modal } from "react-bootstrap";
import PdfViewer from "../Viewers/PdfViewer";
import { Document } from "../../slices/DocumentSlice";
import DocumentViewer from "../Viewers/DocViewer";
import { extractFileType } from "../../utils/extraFunctions";
import { Icons } from "../icons/Icons";
import CsvViewer from "../Viewers/CsvViewer";
import GifViewer from "../Viewers/GifViewer";
interface DisplayModalProps {
    show: boolean;
    onClose: () => void;
    document: Document;
}
const DisplayModal: React.FC<DisplayModalProps> = ({ show, onClose, document }) => {
    const fileType = extractFileType(document.documents);
    const fileUrl = `https://v2.convertapi.com/d/${document?.url}?download=inline`;

    let viewerComponent;

    switch (fileType) {
        case 'pdf':
            viewerComponent = <PdfViewer fileUrl={fileUrl} />;
            break;
        case 'csv':
            viewerComponent = <CsvViewer url={fileUrl} />
            break;
        case 'gif':
            viewerComponent = <GifViewer url={fileUrl} />;
            break;
        default:
            viewerComponent = <DocumentViewer fileUrl={fileUrl} />;
    }
    return (
        <>

            <Modal show={show} onHide={onClose} className="displayModal d-flex justify-content-center align-items-center ">
                <Modal.Header>
                    <div className="d-flex ">{document?.documentName}</div>
                    <button type="button" onClick={() => onClose()} className="btn btn-sm btn-icon btn-active-light-primary me-n5">
                        <Icons name={"closeButton"} width={"22px"} />
                    </button>
                </Modal.Header>
                <Modal.Body >
                    {viewerComponent}
                </Modal.Body>
            </Modal>
        </>
    )
}
export default DisplayModal;