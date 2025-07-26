import React, { useContext } from 'react';
import Papa, { type ParseResult } from 'papaparse';
import { type CsvData } from '../data/DataContext';
import { DataContext } from '../data/DataContext';
import { Box, Button, Link, List, ListItem, styled, Typography } from '@mui/material';
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

  const dataContext = useContext(DataContext);
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
    <>
      {!dataContext?.data?.games?.length
        && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            flexDirection="column"
          >
            <Typography variant='subtitle1'>Infinite Backlog</Typography>
            <Typography variant='h2' textAlign="center" gutterBottom>Yearly Summary</Typography>
            <Box sx={{ alignItems: "left", marginBottom: "16px" }} >
              <List >
                <ListItem>
                  <Typography variant='body2'>1. Navigate to <Link href="https://infinitebacklog.net/settings/export">Infinite Backlog Export Page.</Link></Typography>
                </ListItem>
                <ListItem>
                  <Typography variant='body2'>2. Export "Game Collection" to a CSV files.</Typography>
                </ListItem>
                <ListItem>
                  <Typography variant='body2'>3. Click Load CSV here and import the file.</Typography>
                </ListItem>
              </List>
            </Box >
            {/* <Container style={{ alignContent: 'center', justifyContent: 'center', width: '100%', height: '100%' }}> */}
            < Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={- 1
              }
              startIcon={< UploadFile />}
            >
              Load CSV
              < VisuallyHiddenInput
                type="file"
                onChange={handleFileChange}
                multiple
              />
            </Button >
            {/* </Container> */}

          </Box >
        )}
    </>
  );
}

export default DataImporter;