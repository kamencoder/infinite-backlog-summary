import React, { useMemo } from 'react';
import { getPlayTimeInHours, type PlatformTotal, type Summary, type SummaryGameInfo } from '../data/summarizer';
import { LineChart, PieChart, BarChart, Gauge } from '@mui/x-charts';
import { green, blue } from '@mui/material/colors'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Chip,
  Stack,
  Divider,
  LinearProgress,
} from '@mui/material';

export interface YearSummaryProps {
  summary: Summary
}

type PlatformPieTotal = PlatformTotal & { otherPlatformDetails?: string[] };

export const YearSummary = (props: YearSummaryProps) => {
  const { summary } = props;

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
      if (game.completionMonth) {
        if (!acc[game.completionMonth]) {
          acc[game.completionMonth] = { gamesFinished: [game] };
        } else {
          acc[game.completionMonth].gamesFinished.push(game);
        }
      }
      return acc;
    }, {} as Record<string, { gamesFinished: SummaryGameInfo[] }>) || {};
    return monthData;
  }, [summary.games]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Year Summary ({summary.year})
      </Typography>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6">Totals</Typography>
              <Divider sx={{ my: 1 }} />
              <Stack spacing={1}>
                <Typography>Total Games Finished: <b>{summary.totalGamesBeaten + summary.totalGamesCompeleted}</b></Typography>
                <Typography>Total Time Spent: <b>{getPlayTimeInHours(summary.totalTimeSpent)} hours</b></Typography>
                <Typography>Games Acquired: <b>{summary.acquisitions.totalAcquired}</b></Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>Platform Totals</Typography>
              <Grid container spacing={2}>
                <Grid size={8}>
                  <BarChart
                    dataset={sortedPlatformsByTotal as any}
                    yAxis={[{ dataKey: 'platformAbbreviation', scaleType: 'band', width: 120 }]}
                    series={[{ dataKey: 'total' }]}
                    height={300}
                    layout="horizontal"
                  />
                </Grid>
                <Grid size={4}>
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
                <Grid size={8}>
                  <BarChart
                    title="Release Decade Totals"
                    dataset={summary.releaseDecadeTotals as any}
                    xAxis={[{ dataKey: 'decade', scaleType: 'band' }]}
                    series={[{ dataKey: 'total' }]}
                    height={250}
                  />
                </Grid>
                <Grid size={4}>
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
                <Grid size={4}>
                  <div>Total Acquired <b>{summary.acquisitions.totalAcquired}</b></div>
                  <div>Total Played <b>{summary.acquisitions.totalAcquired}</b></div>
                  <div>Total Done <b>{summary.acquisitions.totalAcquired}</b></div>
                </Grid>
                <Grid size={8}>
                  <PieChart
                    series={[
                      {
                        innerRadius: 20,
                        outerRadius: 80,
                        id: 'played',
                        data: [
                          { id: 'Played', label: 'Played', value: summary.acquisitions.totalPlayed, color: blue[900] },
                          { id: 'Not Played', label: 'Not Played', value: summary.acquisitions.totalAcquired - summary.acquisitions.totalPlayed, color: blue[100] }
                        ],
                        arcLabel: (params) => params.label?.includes('Not') ? '' : params.label || '',
                        arcLabelMinAngle: 20,
                      },
                      {
                        innerRadius: 81,
                        outerRadius: 141,
                        id: 'OS-series',
                        data: [
                          { id: 'Done', label: 'Done', value: summary.acquisitions.totalFinished, color: green[900] },
                          { id: 'Not Done', label: 'Not Done', value: summary.acquisitions.totalAcquired - summary.acquisitions.totalFinished, color: green[100] }
                        ],
                        arcLabel: (params) => params.label?.includes('Not') ? '' : params.label || '',
                        arcLabelMinAngle: 20,
                      },
                    ]}
                    height={300}
                  />
                </Grid>
              </Grid>

            </CardContent>
          </Card>
        </Grid>
        <Typography variant="h5" gutterBottom>Games Beaten/Completed</Typography>
        <Grid size={12}>
          {gamesByMonth && Object.keys(gamesByMonth).map(month => (
            <Card variant="outlined" key={month} style={{ marginBottom: '16px' }}>
              <CardContent>
                <Typography key={month} variant="h6" style={{ textAlign: 'left' }}>{month}</Typography>
                <Grid container spacing={2}>
                  {
                    gamesByMonth[month].gamesFinished.map((game, index) => (
                      <Grid size={2} minWidth={160} key={index}>
                        <Card variant="outlined" sx={{ height: '100%' }}>
                          <CardContent>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {game.title} ({game.platformAbbreviation})
                            </Typography>
                            <Stack spacing={1} mt={1}>
                              {game.completion === 'Completed' && <Chip label={'Complete'} color="primary" size="small" />}
                              <Typography variant="body2">
                                <b>Released:</b> {game.releaseYear}
                              </Typography>
                              {game.playTime && (
                                <Typography variant="body2">
                                  <b>Time:</b> {getPlayTimeInHours(game.playTime) + ((game.playTime || 0) > 1 ? ' hrs' : ' hr')}
                                </Typography>
                              )}
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))
                  }
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
}

export default YearSummary;