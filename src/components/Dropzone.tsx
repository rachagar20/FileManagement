import { useState } from "react";
import { Form } from "react-bootstrap";
import { FileRejection, useDropzone } from "react-dropzone";
import { Icons } from "./icons/Icons";
import { toast } from "react-toastify";
export interface DropZoneProps {
    setFile: (file: File | null) => void;
    isInvalid:boolean;
}
const DropZone: React.FC<DropZoneProps> = ({ setFile,isInvalid }) => {
    const [errorMessage, setErrorMessage] = useState("")
    const onDropAccepted = async (acceptedFiles: File[]) => {
        setFile(acceptedFiles[0])
    }
    const onDropRejected = (rejectedFiles: FileRejection[]) => {
        console.log(rejectedFiles[0].errors)
        const code=rejectedFiles[0].errors[0].code;
        if(code==="file-invalid-type"){
            setErrorMessage("File type not accepted. File types accepted are: .jpg,.png,.gif,.jpeg,.pdf,.csv,.doc,.docx,.xls,.xlsx");
            toast.error("File type not accepted. File types accepted are: .jpg,.png,.gif,.jpeg,.pdf,.csv,.doc,.docx,.xls,.xlsx")
        }else if(code==="file-too-large"){
            setErrorMessage("File size is larger than 10MB");
            toast.error("File size is larger than 10MB")
        }
    }
    const { getRootProps, getInputProps } = useDropzone({
        onDropAccepted,
        onDropRejected,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
            'application/pdf': ['.pdf'],
            'text/*': ['.csv'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
        },
        maxSize: 10 * 1000 * 1000
    });
    return (
        <>
            <Form.Group>
                <div  {...getRootProps({ className: `dropzone drop d-flex justify-content-center align-items-center ${isInvalid||errorMessage?"error":""} ` })}>
                    <input {...getInputProps()} />
                    <div className="text-center" >
                        <div style={{ marginBottom: "10px" }}>
                            <Icons name={"upload"} width={"30px"} />
                        </div>
                        <div>
                            <p>Drag and drop,or Click to select a file (Max Size 10 MB)</p>
                        </div>
                    </div>
                </div>
                {
                    <div style={{ width:"100%",textAlign:"center", color: "rgb(220,53,69)", fontSize:"11px",paddingTop:"4px"}}>
                        {isInvalid&&<div>File is required.</div>}
                        {errorMessage&&<div>{errorMessage}</div>}
                    </div>
                }   
                {
                }
            </Form.Group>
        </>
    )

}

export default DropZone;