import { useEffect, useMemo, useState } from 'react'
import CsvImporter from './components/data-importer'
import { type CsvData, type Data, DataContext, type GameEdit, type UserData } from './data/DataContext';
import { getYearSummary, type Summary } from './data/summarizer';
import YearSummary from './components/year-summary';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Download } from '@mui/icons-material'
import CssBaseline from '@mui/material/CssBaseline';
import { Button } from '@mui/material';

const initialUserData = JSON.parse(localStorage.getItem('user-data') || "{}");
function App() {

  // TODO: Move data context state into separate hook
  const [csvImportData, setCsvImportData] = useState<CsvData[]>();
  const [userData, setUserData] = useState<UserData>({ ...initialUserData, gameEdits: { ...initialUserData.gameEdits } });
  const [baseSummary, setBaseSummary] = useState<Summary | null>(null);

  useEffect(() => {
    console.log('Creating summary from CSV data', { games: csvImportData?.length });
    if (csvImportData && csvImportData.length > 0) {
      const baseSummary = getYearSummary(csvImportData, new Date().getFullYear());
      setBaseSummary(baseSummary);
    }
  }, [csvImportData]);


  const summary = useMemo((): Summary | null => {
    if (!baseSummary) {
      return baseSummary;
    }
    return {
      ...baseSummary,
      games: baseSummary.games.map(g => ({
        ...g,
        ...userData.gameEdits?.[g.id],
      }))
    }
  }, [baseSummary, userData])

  const data = useMemo<Data>((): Data => {
    return {
      games: csvImportData,
      summary,
      userData,
    }
  }, [csvImportData, summary])


  const updateUserDataLocalStorage = () => {
    if (!summary) return;
    try {
      console.log('Saving user data to local storage');
      const currentUserData = JSON.parse(localStorage.getItem('user-data') || "{}");
      localStorage.setItem('user-data', JSON.stringify({
        ...currentUserData,
        ...userData,
        gameEdits: {
          ...currentUserData?.gameEdits,
          ...userData?.gameEdits,
        }
      }))
    } catch (err) {
      console.error('Unable to save user-data to local storage', err);
    }
  }

  useEffect(() => {
    if (userData) {
      updateUserDataLocalStorage();
    }
  }, [userData])

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <DataContext
          value={{
            data,
            editGame: (gameId: string, gameEdit: GameEdit) => {
              console.log('Game Edit saved', { gameId, gameEdit })
              const newUserData = {
                ...userData,
                gameEdits: {
                  ...data.userData?.gameEdits,
                  [gameId]: {
                    ...data.userData?.gameEdits[gameId],
                    ...gameEdit
                  }
                }
              }
              console.log('New user data game info: ', newUserData.gameEdits[gameId])
              setUserData(newUserData)
            },
            setGames: (games: CsvData[]) => {
              console.log('Updating games');
              setCsvImportData(games);
            }
          }}>
          <>
            <CsvImporter />
            {summary && (
              <YearSummary />
            )}
            {summary && (
              <Button
                component="label"
                variant="contained"
                tabIndex={-1}
                startIcon={<Download />}
                onClick={() => window.print()}
              >
                Print PDF
              </Button>
            )}
          </>
        </DataContext>

      </ThemeProvider>
    </>
  )
}

export default App
