import { useMemo, useState } from 'react'
import './App.css'
import CsvImporter from './components/data-importer'
import { type Data, DataContextProvider } from './data/DataContext';
import { getYearSummary } from './data/summarizer';
import YearSummary from './components/year-summary';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Download } from '@mui/icons-material'
import CssBaseline from '@mui/material/CssBaseline';
import { Button } from '@mui/material';

function App() {
  const [data, setData] = useState<Data>({});

  const summary = useMemo(() => {
    if (data.games && data.games.length > 0) {
      return getYearSummary(data.games, new Date().getFullYear());
    }
    return null;
  }, [data.games]);


  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <DataContextProvider
          value={{
            data,
            setGames: (games) => setData({ ...data, games: games })
          }}>
          <CsvImporter />
          {summary && (
            <div>
              {/* Collapsible section with list of games */}
              <YearSummary summary={summary} />
            </div>
          )}
          {data.games && (
            <Button
              component="label"
              variant="contained"
              tabIndex={-1}
              startIcon={<Download />}
              onClick={() => window.print()}
            >
              Export
            </Button>
          )
          }
        </DataContextProvider>

      </ThemeProvider>
    </>
  )
}

export default App
