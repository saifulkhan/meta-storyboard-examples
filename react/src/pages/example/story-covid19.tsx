/** import locally for development and testing **/
import * as msb from '../../../msb/src';
/** import from npm library */
// import * as msb from "meta-storyboard";

import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Fade,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PauseIcon from '@mui/icons-material/Pause';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { indigo } from '@mui/material/colors';

import { ExampleLayout } from '../../components/ExampleLayout';
import { useControllerWithState } from '../../hooks/useControllerWithState';
import covid19CasesData from '../../assets/data/covid19-cases-data.json';
import covid19NumFATable from '../../assets/feature-action-table/covid-19-numerical-fa-table.json';

const StoryCovid19Single = () => {
  const HEIGHT = 500;

  const chartRef = useRef(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [regions, setRegions] = useState<string[]>([]);
  const [region, setRegion] = useState<string>('');
  const [casesData, setCasesData] = useState<
    Record<string, msb.TimeSeriesData>
  >({});
  const [numericalFATable, setNumericalFATable] =
    useState<msb.FeatureActionTableData>([]);
  const plot = useRef<msb.LinePlot>(new msb.LinePlot()).current;
  // use the correct controller name for animation synchronization
  const [controller, isPlaying] = useControllerWithState(
    msb.SyncPlotsController,
    [[plot]]
  );

  useEffect(() => {
    if (!chartRef.current) return;
    setLoading(true);

    try {
      // 1.1 Get timeseries data for all regions.
      const casesData = Object.fromEntries(
        Object.entries(covid19CasesData || {}).map(([region, data]) => [
          region,
          data.map(({ date, y }: { date: string; y: number }) => ({
            date: new Date(date),
            y: +y,
          })),
        ])
      ) as Record<string, msb.TimeSeriesData>;
      setCasesData(casesData);
      setRegions(Object.keys(casesData).sort());

      // 1.2 Load feature-action table a JSON file.
      setNumericalFATable(covid19NumFATable as msb.FeatureActionTableData);

      console.log('Cases data: ', casesData);
      console.log('Numerical feature-action table data: ', numericalFATable);

      setRegion('Bolton');
    } catch (error) {
      console.error('Failed to fetch data; error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!region || !casesData[region] || !chartRef.current) return;

    // 1.1.a Get timeseries data of a single region.
    const data = casesData[region];
    console.log(`Selected region ${region}'s data: ${data}`);

    // 2. Create timeline actions
    const timelineActions: msb.TimelineAction[] = new msb.FeatureActionFactory()
      .setProps({
        metric: 'Number of cases',
        window: 10,
      })
      .setNumericalFeatures(numericalFATable) // <- feature-action table
      .setData(data) // <- timeseries data
      .create();

    // 3. Create story in a line plot
    plot
      .setData([data]) // <- timeseries data
      .setName(region) // <- selected region
      .setPlotProps({
        title: `${region}`,
        xLabel: 'Date',
        leftAxisLabel: 'Number of cases',
      } as any)
      .setLineProps([])
      .setCanvas(chartRef.current)
      // .plot() // <- draw the static plot, useful for testing
      .setActions(timelineActions)
      .animate();

    // 4. Pause the animation, start when play button is clicked
    controller.pause();

    return () => {};
  }, [region, casesData, numericalFATable]);

  const handleSelection = (event: SelectChangeEvent<string>) => {
    const newRegion = event.target.value;
    if (newRegion) {
      setRegion(newRegion);
    }
  };

  return (
    <ExampleLayout
      title="COVID-19 Case Story"
      subtitle="An animated line plot of COVID-19 cases annotated with features detected from a feature-action table. Select a region and press play."
      chip="Line Plot"
      icon={<ShowChartIcon />}
      color={indigo[500]}
    >
      {loading ? (
        <Box sx={{ height: 40 }}>
          <Fade
            in={loading}
            style={{
              transitionDelay: loading ? '800ms' : '0ms',
            }}
            unmountOnExit
          >
            <LinearProgress />
          </Fade>
        </Box>
      ) : (
        <>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ sm: 'center' }}
            sx={{ mb: 2 }}
          >
            <FormControl sx={{ width: 300 }} size="small">
              <InputLabel id="select-region-label">Select region</InputLabel>
              <Select
                labelId="select-region-label"
                id="select-region-label"
                displayEmpty
                onChange={handleSelection}
                value={region}
                input={<OutlinedInput label="Select region" />}
              >
                {regions.map(d => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              disabled={!region}
              variant="contained"
              color={isPlaying ? 'secondary' : 'primary'}
              // 4. Play/pause button
              onClick={() => controller.togglePlayPause()}
              endIcon={isPlaying ? <PauseIcon /> : <ArrowForwardIosIcon />}
              sx={{ width: 120 }}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
          </Stack>
          <svg
            ref={chartRef}
            style={{
              width: '100%',
              height: HEIGHT,
              border: '0px solid',
            }}
          ></svg>
        </>
      )}
    </ExampleLayout>
  );
};

export default StoryCovid19Single;
