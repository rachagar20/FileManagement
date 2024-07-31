import * as React from 'react';
import { Viewer ,Worker} from '@react-pdf-viewer/core';
import { toolbarPlugin, ToolbarSlot } from '@react-pdf-viewer/toolbar';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';

interface FloatingToolbarExampleProps {
    fileUrl: string;
}

const FloatingToolbarExample: React.FC<FloatingToolbarExampleProps> = ({ fileUrl }) => {
    const toolbarPluginInstance = toolbarPlugin();
    const { Toolbar } = toolbarPluginInstance;
    return (
        <div
            className="rpv-core__viewer"
            style={{
                borderRadius:'5.7px',
                display: 'flex',
                height: '500px',
                position: 'relative',
            }}
        >
            <div
                style={{
                    alignItems: 'center',
                    backgroundColor: 'rgb(245, 248, 250)',
                    border: '1px solid rgba(0, 0, 0, 0.2)',
                    borderRadius: '20px',
                    bottom: '16px',
                    display: 'flex',
                    left: '50%',
                    padding: '4px',
                    position: 'absolute',
                    transform: 'translate(-50%, 0)',
                    zIndex: 1,
                }}
            >
                <Toolbar>
                    {(props: ToolbarSlot) => {
                        const {
                            CurrentPageInput,
                            Download,
                            GoToNextPage,
                            GoToPreviousPage,
                            NumberOfPages,
                            Print,
                            ZoomIn,
                            ZoomOut,
                        } = props;
                        return (
                            <>
                                <div style={{ padding: '0px 2px' }}>
                                    <ZoomOut />
                                </div>
                                <div style={{ padding: '0px 2px' }}>
                                    <ZoomIn />
                                </div>
                                <div style={{ padding: '0px 2px', marginLeft: 'auto' }}>
                                    <GoToPreviousPage />
                                </div>
                                <div style={{ padding: '0px 2px', width: '4rem' }}>
                                    <CurrentPageInput />
                                </div>
                                <div style={{ padding: '0px 2px' }}>
                                    / <NumberOfPages />
                                </div>
                                <div style={{ padding: '0px 2px' }}>
                                    <GoToNextPage />
                                </div>
                                <div style={{ padding: '0px 2px' }}>
                                    <Download />
                                </div>
                                <div style={{ padding: '0px 2px' }}>
                                    <Print />
                                </div>
                            </>
                        );
                    }}
                </Toolbar>
            </div>
            <div
                style={{
                    flex: 1,
                    overflow: 'hidden',
                    backgroundColor:'rgb(245, 248, 250)'
                }}
            >
                <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`}>
                <Viewer fileUrl={fileUrl} plugins={[toolbarPluginInstance]}/>
                </Worker>
            </div>
        </div>
    );
};

export default FloatingToolbarExample;