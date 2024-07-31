import React from 'react';
import DocViewer from 'react-doc-viewer';
import {  DocViewerRenderers} from 'react-doc-viewer';
interface DocumentViewerProps {
  fileUrl: string;
}   

const DocumentViewer: React.FC<DocumentViewerProps> = ({ fileUrl }) => {
  const docs = [
    { uri: fileUrl }
  ];

  return (
    <div style={{ borderRadius:'5.7px',
      display: 'flex',
      height: '450px',
      justifyContent:"center",
      width:"100%"
       }}>
      <DocViewer
        documents={docs}
        pluginRenderers={DocViewerRenderers}
        config={{
          header: {
           disableHeader: true,
           disableFileName: true,
           retainURLParams: true
          }
        }}
        
      />
    </div>
  );
};

export default DocumentViewer;