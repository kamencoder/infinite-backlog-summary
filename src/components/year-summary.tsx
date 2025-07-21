import React from 'react';
import { getPlayTimeInHours, type PlatformTotal, type Summary } from '../data/summarizer';
import { LineChart, PieChart, BarChart } from '@mui/x-charts';

export interface YearSummaryProps {
  summary: Summary
}

type PlatformPieTotal = PlatformTotal & { otherPlatformDetails?: string[] };
export const YearSummary = (props: YearSummaryProps) => {
  const { summary } = props;

  const sortedPlatformsByTotal = summary.platformTotals.sort((a, b) => b.total - a.total);
  const platforPie: PlatformPieTotal[] = sortedPlatformsByTotal.reduce((acc: PlatformPieTotal[], platform: PlatformTotal) => {
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
  }, [] as PlatformPieTotal[]);


  return (
    <div>
      <h2>Year Summary ({summary.year})</h2>
      <div>
        {/* Display summary data here */}
        {/* Example: */}
        <p>Total Games Beaten: {summary.totalGamesBeaten}</p>
        <p>Total Time Spent: {getPlayTimeInHours(summary.totalTimeSpent)} hours</p>
        <p>Average Time Spent: {summary.averageTimeSpent} hours</p>
        <p>Games Acquired: {summary.acquisitions.totalAcquired}</p>
        <h3>Platform Totals</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '30px' }}>
          <div style={{ flex: 1, minWidth: '300px', maxWidth: '800px' }}>
            <BarChart
              dataset={sortedPlatformsByTotal as any}
              yAxis={[{ dataKey: 'platformAbbreviation', scaleType: 'band', width: 200 }]}
              // xAxis={[{ data: sortedPlatforms.map(p => p.platform) }]}
              series={[{ dataKey: 'total' }]}
              height={400}
              layout="horizontal"
            />
          </div>
          <div style={{ width: '300px' }}>
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
              height={400}
            />
          </div>
        </div>
        <h3>Game Lengths</h3>
        <LineChart
          title="Release Decade Totals"
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
          height={300}

        />
        <h3>Release Decade Totals</h3>
        <BarChart
          title="Release Decade Totals"
          dataset={summary.releaseDecadeTotals as any}
          xAxis={[{ dataKey: 'decade', scaleType: 'band' }]}
          series={[{ dataKey: 'total' }]}
          height={300}
        />
        <h3>Acquisitions</h3>
        <div style={{ width: '300px', textAlign: 'center', margin: 'auto' }}>
          <div style={{ display: 'flex', backgroundColor: 'coral', margin: '10px', width: '100%' }}>
            <div>{summary.acquisitions.totalAcquired}</div>
            <div>Purchased</div>
          </div>
          <div style={{ display: 'flex', backgroundColor: 'lightblue', margin: '10px', width: `${summary.acquisitions.percentPlayed}%` }}>
            <div>{summary.acquisitions.totalPlayed}</div>
            <div>Played</div>
          </div>
          <div style={{ display: 'flex', backgroundColor: 'lightgreen', margin: '10px', width: `${summary.acquisitions.percentFinished}%` }}>
            <div>{summary.acquisitions.totalBeaten}</div>
            <div>Done</div>
          </div>
        </div>
        <h3>Games Beaten/Completed</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {summary.games.filter(g => !!g.completionDate).map((game, index) => (
            <div style={{ border: '1px solid #ccc', gap: '10px', width: '200px' }} key={index}>
              <h4>{game.title} ({game.platformAbbreviation})</h4>
              <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                <div>
                  {game.completion} on {game.completionDate}
                </div>
                <div>
                  <label>Released Year</label>: <span>{game.releaseYear}</span>
                </div>
                {game.playTime && (
                  <div>
                    <label>Play Time</label>: <span>{getPlayTimeInHours(game.playTime) + (game.playTime || 0 > 1 ? 'hrs' : 'hr')}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default YearSummary;