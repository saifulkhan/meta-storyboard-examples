/** import locally for development and testing **/
import * as msb from '../../../msb/src';
/** import from npm library */
// import * as msb from "meta-storyboard";

import { useEffect, useState, useRef } from 'react';
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
import BarChartIcon from '@mui/icons-material/BarChart';
import PauseIcon from '@mui/icons-material/Pause';
import { teal } from '@mui/material/colors';

import { ExampleLayout } from '../../components/ExampleLayout';
import { useControllerWithState } from '../../hooks/useControllerWithState';
import mlTrainingData from '../../assets/data/ml-training-data.json';
import mlNumFATable from '../../assets/feature-action-table/ml-numerical-fa-table-pcp.json';

const StoryMLMirroredBar = () => {
  const HEIGHT = 600;
  const HYPERPARAMS = [
    'channels',
    'kernel_size',
    'layers',
    'samples_per_class',
  ];

  const chartRefLine = useRef<SVGSVGElement>(null);
  const chartRefMirrored = useRef<SVGSVGElement>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [selectedHyperparam, setSelectedHyperparam] = useState<string>('');
  const [mlData, setMLData] = useState<msb.TimeSeriesData>([]);
  const [numericalFATable, setNumericalFATable] = useState<any>({});

  const linePlot = useRef(new msb.LinePlot()).current;
  const mirroredBarChart = useRef(new msb.MirroredBarChart()).current;
  // control both plots together
  const [controller, isPlaying] = useControllerWithState(
    msb.SyncPlotsController,
    [[linePlot, mirroredBarChart]]
  );
  // test control each plot separately
  // const [controller, isPlaying] = useControllerWithState(msb.PlayPauseController, [mirroredBarChart]);

  useEffect(() => {
    if (!chartRefLine.current || !chartRefMirrored.current) return;
    setLoading(true);

    // 1.1 Load data
    setMLData(
      mlTrainingData.map(({ date, ...rest }) => ({
        date: new Date(date),
        ...rest,
      }))
    );

    // 1.2 Load feature-action table
    setNumericalFATable(mlNumFATable);

    console.log('ML data: ', mlData);
    console.log('Numerical feature-action table data: ', numericalFATable);
    setSelectedHyperparam('channels');
    setLoading(false);
  }, []);

  useEffect(() => {
    if (
      !selectedHyperparam ||
      !mlData ||
      !chartRefLine.current ||
      !chartRefMirrored.current
    )
      return;

    let data = msb.sortTimeseriesData(
      mlData,
      selectedHyperparam,
      'mean_test_accuracy'
    );
    const y1AxisName = 'mean_test_accuracy';
    const y2AxisName = selectedHyperparam;

    console.log(`Selected hyperparameter ${selectedHyperparam}'s data:`, data);

    // build story based on selected hyperparameter's data and feature-action table

    // 2. Create timeline actions
    const timelineActions: msb.TimelineAction[] = new msb.FeatureActionFactory()
      .setProps({ metric: 'accuracy', window: 0 })
      .setData(data) // <- timeseries data
      .setNumericalFeatures(numericalFATable) // <- feature-action table
      .create();

    // 3. Create line plot
    linePlot
      .setData([data.map(d => ({ ...d, y: d[y1AxisName] }))]) // <- timeseries data
      .setName(selectedHyperparam) // <- selected hyperparam
      .setPlotProps({
        title: `${selectedHyperparam}`,
        xLabel: 'Date',
        leftAxisLabel: y1AxisName,
      } as any)
      .setLineProps([])
      .setCanvas(chartRefLine.current)
      // .plot() // <- draw the static plot, useful for testing
      .setActions(timelineActions)
      .animate();

    // 3. Create mirrored bar chart
    mirroredBarChart
      .setPlotProps({
        y1Label: y1AxisName,
        y2Label: y2AxisName,
      })
      .setName(selectedHyperparam)
      .setData(data)
      .setCanvas(chartRefMirrored.current)
      .setActions(timelineActions);

    // 4. Pause the animation, start when play button is clicked
    controller.pause();

    return () => {};
  }, [selectedHyperparam, mlData]);

  const handleSelection = (event: SelectChangeEvent) => {
    const newKey = event.target.value;
    if (newKey) {
      setSelectedHyperparam(newKey);
    }
  };

  return (
    <ExampleLayout
      title="Machine Learning Provenance Story"
      subtitle="A mirrored bar chart narrating the provenance of a hyperparameter search. Choose a hyperparameter and press play."
      chip="Mirrored Bar Chart"
      icon={<BarChartIcon />}
      color={teal[600]}
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
              <InputLabel id="select-region-label">
                Select hyperparameter
              </InputLabel>
              <Select
                labelId="select-region-label"
                id="select-region-label"
                displayEmpty
                onChange={handleSelection}
                value={selectedHyperparam}
                input={<OutlinedInput label="Select hyperparameter" />}
              >
                {HYPERPARAMS.map(d => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              disabled={!selectedHyperparam}
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
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
            }}
          >
            <svg
              ref={chartRefLine}
              style={{
                width: '100%',
                height: HEIGHT * 0.7,
                border: '0px solid',
                marginBottom: '-50px',
              }}
            ></svg>
            <svg
              ref={chartRefMirrored}
              style={{
                width: '100%',
                height: HEIGHT,
                border: '0px solid',
                marginTop: '-50px',
              }}
            ></svg>
          </div>
        </>
      )}
    </ExampleLayout>
  );
};

export default StoryMLMirroredBar;
