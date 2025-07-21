import React, { useContext } from 'react';
import Papa, { type ParseResult } from 'papaparse';
import { type CsvData } from '../data/DataContext';
import { DataContextProvider } from '../data/DataContext';
import { Button, styled } from '@mui/material';
import { UploadFile } from '@mui/icons-material';

const DataImporter = () => {

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const dataContext = useContext(DataContextProvider);
  // const [ csvData, setCsvData ] = React.useState<CsvData[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse<CsvData>(file, {
        header: true,
        dynamicTyping: true,
        complete: (results: ParseResult<CsvData>) => {
          console.log("Parsed CSV data:", results.data);
          dataContext.setGames(results.data);
          // setCsvData(results.data);
        },
        error: (error: unknown) => {
          console.error("Error parsing CSV file:", error);
        },
      });
    }
  };

  return (
    <div>
      {!dataContext.data
        && (
          <div>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<UploadFile />}
            >
              Load CSV
              <VisuallyHiddenInput
                type="file"
                onChange={handleFileChange}
                multiple
              />
            </Button>
          </div>
        )}
      {/* {
            csvData.length > 0 && (
              <table>
                <thead>
                  <tr>
                    {
                      Object.keys(csvData[0] ?? {}).map((key) => (
                        <th key={key} > {key} </th>
                      ))
                    }
                  </tr>
                </thead>
                <tbody>
                  {
                    csvData.map((row, index) => (
                      <tr key={index} >
                        {
                          row && Object.values(row).map((value, idx) =>{
                            return (
                              <td key={idx} > {String(value) ?? ''} </td>
                            )
                          })
                        }
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            )} */}
    </div>
  );
}

export default DataImporter;