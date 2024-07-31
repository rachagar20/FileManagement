import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { readRemoteFile } from 'react-papaparse';

interface CsvViewerProps {
  url: string;
}

interface CsvData {
  [key: string]: string | number | boolean;
}

const CsvViewer: React.FC<CsvViewerProps> = ({ url }) => {
  const [data, setData] = useState<CsvData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCsvData = () => {
      const config: any = {
        header: true,
        dynamicTyping: true,
        download: true,
        complete: (results: any) => {
          setData(results.data);
        },
        error: (error: Error) => {
          setError(error.message);
        },
      };

      readRemoteFile(url, config);
    };

    fetchCsvData();
  }, [url]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const columnDefs: ColDef[] = data.length > 0 ? Object.keys(data[0]).map(key => ({
    headerName: key,
    field: key,
    sortable: false,
    filter: false,
    flex: 1,
  })) : [];

  return (
    <div className="container-table ag-theme-alpine" style={{ textAlign:"center",height: '400px', width: '100%' }}>
      <AgGridReact
        className="tableStyle"
        defaultColDef={{resizable:true}}
        columnDefs={columnDefs}
        rowData={data}
      />
    </div>
  );
};

export default CsvViewer;
