import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { CellClickedEvent, ColDef, ICellRendererParams, } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Button } from 'react-bootstrap';
import DisplayModal from '../Modals/DisplayModal';
import { extractFileType } from '../../utils/extraFunctions';
import {Icons  } from '../icons/Icons';
import { Document } from '../../slices/DocumentSlice';
import { shortenName } from '../../utils/extraFunctions';
interface MyGridComponentProps {
  handleDelete: (id: string) => void;
  documents:Document[];
}

const MyGridComponent: React.FC<MyGridComponentProps> = ({ handleDelete, documents }) => {
  const [showDisplayModal, setShowDisplayModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState({ id: "", documentName: "", documents: "", folderId: "", uploadedBy: "", uploadedOn: "", url: "" });
  const folders = useSelector((state: RootState) => state.folders.folders);

  const getFolderName = (folderId: string): string => {
    const foundFolder = folders.find((eachFolder) => eachFolder.id == folderId);
    return foundFolder ? foundFolder.folderName : "";
  }


  const handleClose = () => {
    setShowDisplayModal(false);
  }
  
  const rowData = documents;
  const columnDefs: ColDef[] = [
    { headerName: 'Document Name', field: 'documentName', sortable: false, filter: false, flex: 1 },
    {
      headerName: 'Documents',
      field: 'documents',
      sortable: false,
      filter: false,
      flex: 2,
      cellRenderer: (params: ICellRendererParams) => (
        <div className="d-flex align-items-center" >
          <Icons name={extractFileType(params.value)} width={"16px"}/>
          {shortenName(params.value,50)}
        </div>
      ),
    },
    {
      headerName: 'Folder Name',
      field: 'folderId',
      valueGetter: (params) => shortenName(getFolderName(params.data.folderId),25),
      sortable: false,
      filter: false,
      flex: 2,
      cellRenderer: (params: ICellRendererParams) => (
        <div className="d-flex align-items-center">
          <Icons name={"folder"} width={"20px"}/>
          {params.value}
        </div>
      ),
    },
    { headerName: 'Uploaded By ',field: 'uploadedBy', sortable: false, filter: false, flex: 1 },
    { headerName: 'Uploaded On', field: 'uploadedOn', sortable: false, filter: false, flex: 1 },
    {
      headerName: 'Actions',
      cellRenderer: (params: ICellRendererParams) => (
        <>
          <Button variant="none" as="a" target='_blank' href={`https://v2.convertapi.com/d/${params.data.url}`}>
            <svg width="16" height="16" fill="currentColor" className="bi bi-download" viewBox="0 0 16 16">
              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
              <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
            </svg>
          </Button>
          |
          <Button variant="none" onClick={(e) => { e.stopPropagation(); handleDelete(params.data.id) }}>
            <svg width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
              <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
            </svg>
          </Button>
        </>
      ),
      sortable: false,
      filter: false,
      resizable: false,
      flex: 1,
    }
  ];

  const onRowClicked = (e: CellClickedEvent) => {
    setShowDisplayModal(true);
    setSelectedDocument(e.data);
  }
  return (
    <>
      <div className="container-table ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
        <AgGridReact columnDefs={columnDefs} defaultColDef={{ resizable: true }} rowData={rowData} className="tableStyle" onCellClicked={(e: CellClickedEvent) => { if (e.colDef.headerName !== "Actions") onRowClicked(e) }} />
      </div>
      <DisplayModal show={showDisplayModal} onClose={handleClose} document={selectedDocument} />
    </>
  );
};

export default MyGridComponent;
