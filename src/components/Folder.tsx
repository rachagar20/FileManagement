import React, { useState} from "react";
import { Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../store/store";
import { removeDocument } from "../slices/DocumentSlice";
import { removeFolder, Folder } from "../slices/FolderSlice";
import { setLoading } from "../slices/LoadingSlice.ts";
import { toast } from "react-toastify";
import FolderGrid from "./ag-grid/FolderGrid";
import Card from "./Card";
import SideBar from "./Modals/SideBar.tsx";
import RenameModal from "./Modals/RenameModal.tsx";
import DeleteModal from "./Modals/FolderModal.tsx";
import ConfirmModal from "./Modals/ConfirmModal";

interface ViewProp {
  view: string;
}

const FolderComponent: React.FC<ViewProp> = ({ view }) => {
  const [modalState, setModalState] = useState({
    showSideBar: false,
    showRenameModal: false,
    showDeleteModal: false,
    showConfirmModal: false,
    currentFolder: { id: "", folderName: "", createdBy: "", createdOn: "" },
  });
  
  const filteredFolders = useSelector((state: RootState) => state.folders.filteredFolders);
  const dispatch = useAppDispatch();

  const handleOpenModal = (type: string, folder: Folder = modalState.currentFolder) => {
    setModalState({ ...modalState, [type]: true, currentFolder: folder });
  };

  const handleCloseModals = () => {
    setModalState({
      ...modalState,
      showSideBar: false,
      showRenameModal: false,
      showDeleteModal: false,
      showConfirmModal: false,
    });
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_URL}/documents/${id}`, { method: "DELETE" });
      if (response.ok) {
        dispatch(removeDocument(id));
        toast.success("Document deleted successfully");
      } else {
        throw new Error("Failed to delete document");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteFolder = async (id: string, withDocuments = false) => {
    dispatch(setLoading(true));
    try {
      if (withDocuments) {
        const documentsResponse = await fetch(`${import.meta.env.VITE_URL}/documents?folderId=${id}`);
        const documents = await documentsResponse.json();
        const deleteDocsPromises = documents.map((doc: { id: string }) => handleDeleteDocument(doc.id));
        await Promise.all(deleteDocsPromises);
      }

      const response = await fetch(`${import.meta.env.VITE_URL}/folders/${id}`, { method: "DELETE" });
      if (response.ok) {
        dispatch(removeFolder(id));
        toast.success("Folder deleted successfully");
      } else {
        throw new Error("Failed to delete folder");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      handleCloseModals();
      dispatch(setLoading(false));

    }
  };

  const handleDeleteFolderWithConfirmation = async (id: string) => {
    try {
      const documentsResponse = await fetch(`${import.meta.env.VITE_URL}/documents?folderId=${id}`);
      const documents = await documentsResponse.json();
      const folderResponse = await fetch(`${import.meta.env.VITE_URL}/folders/${id}`);
      const folder = await folderResponse.json();
      if (documents.length > 0) {
        handleOpenModal("showDeleteModal", folder);
      } else {
        handleOpenModal("showConfirmModal", folder);
      }
    } catch (error: any) {
      toast.error("Error checking folder details");
    }
  };




  const renderFolders = (folderView: string) => {
    if (folderView === "tile") {
      return (
        <div className="container text-center">
            {filteredFolders.length===0?
            <div className="position-relative">No Folders to display</div>
            :<Row xs={1} sm={2} md={3} lg={4}>
            {filteredFolders.map((folder) => (
              <Col key={folder.id} className="mb-4">
                <Card
                  element={folder}
                  type="folder"
                  onDelete={() => handleDeleteFolderWithConfirmation(folder.id)}
                  onRename={() => handleOpenModal("showRenameModal", folder)}
                  onOpen={() => handleOpenModal("showSideBar", folder)}
                />
              </Col>
            ))}
            <SideBar show={modalState.showSideBar} folder={modalState.currentFolder} handleClose={handleCloseModals} />
          </Row>}
        </div>
      );
    } else {
      return (
        <FolderGrid
          handleDelete={handleDeleteFolderWithConfirmation}
          folders={filteredFolders}
        />
      );
    }
  };

  return (
    <>
      {renderFolders(view)}
      <RenameModal
        show={modalState.showRenameModal}
        onClose={handleCloseModals}
        element={{ id: modalState.currentFolder.id, name: modalState.currentFolder.folderName }}
        type="folder"
      />
      <DeleteModal
        type="delete"
        showModal={modalState.showDeleteModal}
        onClose={handleCloseModals}
        handleSubmit={() => handleDeleteFolder(modalState.currentFolder.id, true)}
      />
      <ConfirmModal
        type="folder"
        name={modalState.currentFolder.folderName}
        show={modalState.showConfirmModal}
        onClose={handleCloseModals}
        handleSubmit={() => handleDeleteFolder(modalState.currentFolder.id)}
      />
    </>
  );
};

export default FolderComponent;
