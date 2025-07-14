import React from 'react';
import Papa, { ParseResult } from 'papaparse';

interface CsvData {
  [key: string]: string | number | null | undefined;
}

const CsvImporter = () => {
  const [ csvData, setCsvData ] = React.useState<CsvData[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse<CsvData>(file, {
        header: true,
        dynamicTyping: true,
        complete: (results: ParseResult<CsvData>) => {
          console.log("Parsed CSV data:", results.data);
          setCsvData(results.data);
        },
        error: (error: unknown) => {
          console.error("Error parsing CSV file:", error);
        },
      });
    }
  };

    return (
      <div>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <div>
          {
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
            )}
        </div>
      </div>
    );
}

export default CsvImporter;