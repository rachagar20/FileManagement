import React from "react";
import { Button, Card, Dropdown } from "react-bootstrap";
import { Document } from "../slices/DocumentSlice";
import { Folder } from "../slices/FolderSlice";
import { Icons } from "./icons/Icons";
import { extractFileType, shortenName } from "../utils/extraFunctions";

interface CardProps {
    element: Document | Folder;
    type: string;
    onDelete: () => void;
    onRename: () => void;
    onOpen: () => void;
}

const Cards: React.FC<CardProps> = ({ element, type, onDelete, onRename, onOpen }) => {
    const documentName = (element as Document)?.documentName || "Unnamed Document";
    const folderName = (element as Folder)?.folderName || "Unnamed Folder";
    const uploadedOn = (element as Document)?.uploadedOn || "Unknown Date";
    const createdOn = (element as Folder)?.createdOn || "Unknown Date";
    
    return (
        <>
            <Card className="h-100 w-100">
                <Dropdown className="position-absolute top-0 end-0">
                    <Dropdown.Toggle as={CustomToggle}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                        </svg>
                    </Dropdown.Toggle>
                    <Dropdown.Menu> 
                        <Dropdown.Item as={Button} variant="light" className="btn btn-none w-100 border-0" data_bs_toggle="offcanvas" data-bs_target="#offcanvasExample" aria-controls="offcanvasExample" onClick={onOpen}>Open</Dropdown.Item>
                        <Dropdown.Item as={Button} variant="light" onClick={onRename}>Rename</Dropdown.Item>
                        <Dropdown.Item as={Button} variant="light" onClick={onDelete}>Delete</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Card.Body className="d-flex flex-column justify-content-between align-items-center overflow-hidden">
                    {type === "folder" ?<Icons name={"folder"} width={"70px"}/>:<Icons name={extractFileType((element as Document).documents)} width={"70px"}/>}
                    <Card.Title className="mt-4 mb-2">
                        <p className="card-text">{type === "document" ?shortenName(documentName,25) : shortenName(folderName,25)}</p>
                    </Card.Title>
                    <Card.Text className="mb-2">{type === "folder" ? `Created on ${createdOn}` : `Uploaded on ${uploadedOn}`}</Card.Text>
                </Card.Body>
            </Card>
        </>
    );
};

const CustomToggle = React.forwardRef(({ children, onClick }: any, ref: any) => (
    <Button
        variant="none"
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
    >
        {children}
    </Button>
));

export default Cards;
