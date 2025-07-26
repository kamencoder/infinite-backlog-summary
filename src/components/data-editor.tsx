import React, { useContext } from 'react';
import Papa, { type ParseResult } from 'papaparse';
import { type CsvData } from '../data/DataContext';
import { DataContext } from '../data/DataContext';
import { Box, Button, Container, Grid, Link, List, ListItem, styled, Table, Typography } from '@mui/material';
import type { Summary } from '../data/summarizer';

interface DataEditorProps {
  visible: boolean;
  onClose: () => void;
  summary: Summary | null;
}
const DataEditor = (props: DataEditorProps) => {
  const { visible, onClose, summary } = props;

  const dataContext = useContext(DataContext);

  const onContinue = () => {
    onClose();
  }

  return (
    <Container>
      <Box sx={{ textAlign: "right" }}>
        <Button variant="text" onClick={() => onClose()}>Skip</Button>
      </Box>
      <Grid size={12} visibility={visible ? 'visible' : 'hidden'}>

        <Box>
          {summary?.games?.map(g => (
            <div>{g.title}</div>
          ))}
        </Box>
      </Grid>

      <Box>
        <Button onClick={onContinue}>Continue</Button>
      </Box>
    </Container>
  );
}

export default DataEditor;