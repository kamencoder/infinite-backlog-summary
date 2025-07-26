import { useContext, useMemo } from 'react';
import { getPlayTimeInHours, type PlatformTotal, type SummaryGameInfo } from '../data/summarizer';
import { LineChart, PieChart, BarChart } from '@mui/x-charts';
import { GaugeComponent } from 'react-gauge-component';
import { green, blue, red } from '@mui/material/colors'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  type Theme,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material'
import { SingleStat } from './single-stat';
import { DateTime } from 'luxon';
import { Game } from './game';
import { DataContext } from '../data/DataContext';

type PlatformPieTotal = PlatformTotal & { otherPlatformDetails?: string[] };

export const YearSummary = () => {
  const dataContext = useContext(DataContext);
  const { summary } = dataContext.data;
  if (!summary) {
    return null;
  }

  const sortedPlatformsByTotal = useMemo(() => summary.platformTotals.sort((a, b) => b.total - a.total), [summary.platformTotals]);
  const platforPie: PlatformPieTotal[] = useMemo(() => sortedPlatformsByTotal.reduce((acc: PlatformPieTotal[], platform: PlatformTotal) => {
    if (platform.total === 1) {
      const otherGroup = acc.find(p => p.platform === 'Other');
      if (otherGroup) {
        otherGroup.total += platform.total;
        otherGroup.otherPlatformDetails = [...otherGroup.otherPlatformDetails || [], platform.platform];
      } else {
        acc.push({ platform: 'Other', platformAbbreviation: 'Other', total: platform.total, otherPlatformDetails: [platform.platform] });
      }
    } else {
      acc.push(platform);
    }
    return acc;
  }, [] as PlatformPieTotal[]), [sortedPlatformsByTotal]);

  const gamesByMonth = useMemo(() => {
    const monthData = summary.games?.reduce((acc: Record<string, { gamesFinished: SummaryGameInfo[] }>, game) => {
      if (Object.keys(acc).length === 0) {
        for (let i = 1; i <= 12; i++) {
          const month = DateTime.fromFormat(`2020-${i.toString().padStart(2, '0')}-01`, 'yyyy-MM-dd').monthLong || 'unknown';
          acc[month] = { gamesFinished: [] };
        }
      }
      if (game.completionMonth) {
        acc[game.completionMonth]?.gamesFinished.push(game);
      }
      return acc;
    }, {} as Record<string, { gamesFinished: SummaryGameInfo[] }>) || {};
    return monthData;
  }, [summary.games]);

  const totalTimeSpent = getPlayTimeInHours(summary.totalTimeSpent) || 0;

  return (
    <Box sx={styles.yearSummaryContainer} id='year-summary-container'>
      <Typography variant="h1" fontWeight={700} textAlign="center">
        {summary.year}
      </Typography>
      <Typography variant="subtitle1" textAlign="center" gutterBottom>
        Yearly Summary
      </Typography>
      <h4 style={{ textAlign: 'center' }}>{ }</h4>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Card >
            <CardContent>
              <Stack spacing={1} direction="row" sx={{
                justifyContent: "center",
                alignItems: "center"
              }}>
                <SingleStat value={summary.totalGamesBeaten + summary.totalGamesCompeleted} label="Games Finished" color={green[500]} />
                <SingleStat value={totalTimeSpent} label="Hours Played" color={blue[500]} />
                <SingleStat value={summary.acquisitions.totalAcquired} label="Games Acquired" color={red[500]} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={12} container>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>Platform Totals</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <BarChart
                    dataset={sortedPlatformsByTotal as any}
                    yAxis={[{ dataKey: 'platformAbbreviation', scaleType: 'band', width: 120 }]}
                    series={[{ dataKey: 'total' }]}
                    height={300}
                    layout="horizontal"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <PieChart
                    series={[
                      {
                        data: platforPie.map(p => ({
                          id: p.platform,
                          label: `${p.platformAbbreviation} (${p.total})`,
                          value: p.total
                        })),
                        arcLabel: (params) => params.label?.replace(/\(.+\)/, '') ?? '',
                        arcLabelMinAngle: 20,
                      },
                    ]}
                    slotProps={{
                      legend: {
                        direction: 'horizontal',
                        position: { vertical: 'bottom', horizontal: 'center' }
                      }
                    }}
                    height={300}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>Game Lengths</Typography>
              <LineChart
                title="Game Lengths"
                dataset={summary.lengthGroupTotals as any}
                xAxis={[{ dataKey: 'lengthGroup', scaleType: 'band' }]}
                yAxis={[
                  { id: 'totalGames', scaleType: 'linear', position: 'left', label: 'Total Games' },
                  { id: 'totalTime', scaleType: 'linear', position: 'right', label: 'Time Spent (hrs)' },
                ]}
                series={[
                  { dataKey: 'totalGames', yAxisId: 'totalGames', label: 'Total Games' },
                  { dataKey: 'totalTimeSpent', yAxisId: 'totalTime', label: 'Total Time (hrs)' }
                ]}
                height={250}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>Release Decade Totals</Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <BarChart
                    title="Release Decade Totals"
                    dataset={summary.releaseDecadeTotals as any}
                    xAxis={[{ dataKey: 'decade', scaleType: 'band' }]}
                    series={[{ dataKey: 'total' }]}
                    height={250}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <PieChart
                    series={[
                      {
                        data: summary.releaseDecadeTotals.map(x => ({
                          id: x.decade,
                          label: `${x.decade?.toString()}s`,
                          value: x.total
                        })),
                        arcLabel: (params) => params.label || '',
                        arcLabelMinAngle: 20,
                      },
                    ]}
                    slotProps={{
                      legend: {
                        direction: 'horizontal',
                        position: { vertical: 'bottom', horizontal: 'center' }
                      }
                    }}
                    height={300}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>Acquisitions</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Stack spacing={1} flexWrap="wrap">
                    <SingleStat value={summary.acquisitions.totalAcquired} label="Acquired" color={red[500]} />
                    <SingleStat value={summary.acquisitions.totalPlayed} label="Played" color={blue[500]} />
                    <SingleStat value={summary.acquisitions.totalFinished} label="Finished" color={green[500]} />
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 9 }}>
                  <GaugeComponent
                    type="semicircle"
                    arc={{
                      width: 0.2,
                      padding: 0.005,
                      cornerRadius: 1,
                      subArcs: [
                        {
                          limit: Math.ceil(summary.acquisitions.totalFinished / summary.acquisitions.totalAcquired * 100),
                          color: green[500],
                          showTick: true,
                          tooltip: {
                            text: 'Percent of acquired games that were beaten or completed.'
                          },
                        },
                        {
                          limit: Math.ceil(summary.acquisitions.totalPlayed / summary.acquisitions.totalAcquired * 100),
                          color: blue[500],
                          showTick: true,
                          tooltip: {
                            text: 'Percent of acquired games that were played.'
                          }
                        },
                        {
                          limit: 100,
                          color: red[500],
                          showTick: true,
                          tooltip: {
                            text: 'Total Games acquired'
                          }
                        },
                      ]
                    }}
                    pointer={{
                      color: '#345243',
                      length: 0.90,
                      width: 12,
                    }}
                    labels={{
                      valueLabel: { formatTextValue: value => value + '%' },
                      tickLabels: {
                        type: 'outer',
                        defaultTickValueConfig: {
                          formatTextValue: (value: any) => value + '%',
                          style: { fontSize: 10 }
                        },
                        ticks: Array.from('1'.repeat(10)).map((n, i) => { return { value: parseInt(n) * (i + 1) * 10 } })
                      }
                    }}
                    value={Math.ceil(summary.acquisitions.totalPlayed / summary.acquisitions.totalAcquired * 100)}
                    minValue={0}
                    maxValue={100}
                  />

                </Grid>
                <Grid size={12}>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                    >
                      <Typography component="span">Acquired Game List</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TableContainer component={Paper}>
                        <Table aria-label="Acquired Games">
                          <TableHead>
                            <TableRow>
                              <TableCell>Title</TableCell>
                              <TableCell>Platform</TableCell>
                              <TableCell>Date Acquired</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {summary.games.filter(g => g.acquiredThisYear).map(g => (
                              // {g.title} ({g.platformAbbreviation})- {g.acquisitionDate}
                              <TableRow
                                key={g.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <TableCell component="th" scope="row">{g.title}</TableCell>
                                <TableCell>{g.platform}</TableCell>
                                <TableCell>{g.acquisitionDate}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              </Grid>

            </CardContent>
          </Card>
        </Grid>
        <Typography variant="h3">Games Finished</Typography>
        <Grid size={12}>
          {gamesByMonth && Object.keys(gamesByMonth).map(month => (
            <Card variant="outlined" key={month} >
              <CardContent>
                <Typography key={month} variant="h6" fontWeight={600} style={{ textAlign: 'left' }} gutterBottom>{month}</Typography>
                {/* <GameList games={gamesByMonth[month]?.gamesFinished} /> */}
                <Grid size={12} container spacing={2} justifyContent="center">
                  {gamesByMonth[month]?.gamesFinished.map(game => <Game game={game} />)}
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Grid>
    </Box >
  );
}

const styles = {
  yearSummaryContainer: (theme: Theme) => ({
    maxWidth: "1024px",
    margin: "auto",
    padding: 3,
    [theme.breakpoints.down('sm')]: {
      padding: 0
    }
  })
};

export default YearSummary;
