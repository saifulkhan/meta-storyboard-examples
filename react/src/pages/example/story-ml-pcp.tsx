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
  SelectChangeEvent,
  Stack,
} from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PauseIcon from '@mui/icons-material/Pause';
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';
import { orange } from '@mui/material/colors';

import { ExampleLayout } from '../../components/ExampleLayout';
import { useControllerWithState } from '../../hooks/useControllerWithState';
import mlTrainingData from '../../assets/data/ml-training-data.json';
import mlNumFATable from '../../assets/feature-action-table/ml-numerical-fa-table-pcp.json';

const StoryMLPCP = () => {
  const HEIGHT = 1000;
  const HYPERPARAMS = [
    'channels',
    'kernel_size',
    'layers',
    'samples_per_class',
  ];

  const chartRef = useRef(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hyperparam, setHyperparam] = useState<string>('');
  const [mlData, setMLData] = useState<msb.TimeSeriesData>([]);
  const [numericalFATable, setNumericalFATable] = useState<any>({});

  const plot = useRef(new msb.ParallelCoordinatePlot()).current;
  const [controller, isPlaying] = useControllerWithState(
    msb.PlayPauseController,
    [plot]
  );

  useEffect(() => {
    if (!chartRef.current) return;
    setLoading(true);

    // 1.1 Load ML training data
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

    setHyperparam('channels');

    setLoading(false);
  }, []);

  useEffect(() => {
    if (!hyperparam || !mlData || !chartRef.current) return;

    // reset the plot when hyperparameter changes
    if (plot.svg) {
      plot.reset();
    }

    const data = msb.sortTimeseriesData(
      mlData,
      hyperparam,
      'mean_test_accuracy'
    );
    console.log(`Selected hyperparameter ${hyperparam}'s data: ${data}`);

    // build story based on selected hyperparameter's data and feature-action table

    // 2. Create timeline actions
    const timelineActions: msb.TimelineAction[] = new msb.FeatureActionFactory()
      .setProps({ metric: 'accuracy', window: 0 })
      .setData(data) // <- timeseries data
      .setNumericalFeatures(numericalFATable) // <- feature-action table
      .create();

    // 3. Create PCP
    plot
      .setPlotProps({ margin: { top: 150, right: 50, bottom: 60, left: 60 } })
      .setName(hyperparam) // <- selected hyperparameter
      .setData(data) // <- timeseries data
      .setCanvas(chartRef.current)
      //.plot(); // static plot
      .setActions(timelineActions);
    // TODO: animate();

    // 4. Pause the animation, start when play button is clicked
    controller.pause();

    return () => {};
  }, [hyperparam]);

  const handleSelection = (event: SelectChangeEvent) => {
    const newKey = event.target.value;
    if (newKey) {
      setHyperparam(newKey);
    }
  };

  return (
    <ExampleLayout
      title="Machine Learning Multivariate Story"
      subtitle="A parallel coordinates plot animating the relationship between hyperparameters and model accuracy. Choose a hyperparameter and press play."
      chip="Parallel Coordinates"
      icon={<StackedLineChartIcon />}
      color={orange[800]}
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
                value={hyperparam}
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
              disabled={!hyperparam}
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

export default StoryMLPCP;
