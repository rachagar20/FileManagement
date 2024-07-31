import React, { useState, useCallback } from "react";
import Card from "./Card";
import { Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { setLoading } from "../slices/LoadingSlice.ts";
import { removeDocument, Document } from "../slices/DocumentSlice";
import { RootState, useAppDispatch } from "../store/store";
import { toast } from "react-toastify";
import RenameModal from "./Modals/RenameModal";
import ConfirmModal from "./Modals/ConfirmModal";
import MyGridComponent from "./ag-grid/DocumentGrid";
import DisplayModal from "./Modals/DisplayModal";

interface ViewProp {
  view: string;
}

const DocumentComp: React.FC<ViewProp> = ({ view }) => {
  const [modalsState, setModalsState] = useState({
    showRenameModal: false,
    showDeleteModal: false,
    showDisplayModal: false,
  });
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);

  const filteredDocuments = useSelector((state: RootState) => state.documents.filteredDocuments);
  // const documents=useSelector((state: RootState) => state.documents.documents)
  const dispatch = useAppDispatch();

  const handleOpenModal = useCallback((type: string, document: Document | null) => {
    setCurrentDocument(document);
    setModalsState((prev) => ({ ...prev, [type]: !!document }));
  }, []);

  const handleCloseModals = useCallback(() => {
    setModalsState({
      showRenameModal: false,
      showDeleteModal: false,
      showDisplayModal: false,
    });
    setCurrentDocument(null);
  }, []);

  const handleSubmit = useCallback(async () => {
      dispatch(setLoading(true));
      if (currentDocument) {
      if (currentDocument.url.length > 0) {
        await fetch(`https://v2.convertapi.com/d/${currentDocument.url}`, { method: "DELETE" });
      }
      try {
        const response = await fetch(`${import.meta.env.VITE_URL}/documents/${currentDocument.id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("File couldn't be deleted");
        dispatch(removeDocument(currentDocument.id));
        toast.success("Document deleted successfully.");

      } catch (e) {
        console.error("Some error occurred", e);
        toast.error("Failed to delete document");
      }finally{
        handleCloseModals();
        dispatch(setLoading(false))
      }
    }
  }, [currentDocument, dispatch, handleCloseModals]);



  const renderDocuments =() => {
    if (view === "tile") {
      return (
        <div className="container text-center">
            {filteredDocuments.length===0?
            <div className="position-relative">No Documents to display</div>
            :<Row xs={1} sm={2} md={3} lg={4}>
              {filteredDocuments?.map((eachDocument) => (
                <Col key={eachDocument.id} className="mb-4">
                  <Card
                    element={eachDocument}
                    type="document"
                    onDelete={() => handleOpenModal("showDeleteModal", eachDocument)}
                    onRename={() => handleOpenModal("showRenameModal", eachDocument)}
                    onOpen={() => handleOpenModal("showDisplayModal", eachDocument)}
                  />
                </Col>
              ))}
            </Row>
            }
        </div>
      );
    } else {
      return (
        <MyGridComponent
          handleDelete={async (id: string) => {
            const response=await fetch(`${import.meta.env.VITE_URL}/documents/${id}`);
            const document=await response.json();
            handleOpenModal("showDeleteModal", document || null);
          }}
          documents={filteredDocuments}
        />
      );
    }
  };

  return (
    <>
      {renderDocuments()}
      {currentDocument && (
        <>
          <RenameModal
            show={modalsState.showRenameModal}
            onClose={handleCloseModals}
            element={{ id: currentDocument.id, name: currentDocument.documentName }}
            type="document"
          />
          <ConfirmModal
            type="document"
            name={currentDocument.documentName}
            show={modalsState.showDeleteModal}
            onClose={handleCloseModals}
            handleSubmit={handleSubmit}
          />
          <DisplayModal show={modalsState.showDisplayModal} onClose={handleCloseModals} document={currentDocument} />
        </>
      )}
    </>
  );
};

export default DocumentComp;
