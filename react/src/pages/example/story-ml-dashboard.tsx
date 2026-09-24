/** import locally for development and testing **/
import * as msb from '../../../msb/src';
/** import from npm library */
// import * as msb from 'meta-storyboard';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Stack,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PauseIcon from '@mui/icons-material/Pause';
import { blue } from '@mui/material/colors';

import { useControllerWithState } from '../useControllerWithState';
import { MetricCard } from '../../components/dashboard/MetricCard';
import mlTrainingData from '../../assets/data/ml-training-data.json';
import mlDashboardFATable from '../../assets/feature-action-table/ml-numerical-fa-table-dashboard.json';

const HYPERPARAMS = ['channels', 'kernel_size', 'layers', 'samples_per_class'];

// pill-shaped control buttons, similar to the reference dashboard
const controlButtonSx = {
  borderRadius: '999px',
  textTransform: 'none',
  fontSize: '1.15rem',
  fontWeight: 600,
  px: 3.5,
  py: 1,
  backgroundColor: '#5661c5',
  '&:hover': { backgroundColor: '#444fae' },
} as const;

// larger font for the parameter select, matching the buttons and cards
const selectFontSx = { fontSize: '1.15rem' } as const;

const PARAM_LABELS: Record<string, string> = {
  channels: 'Channels',
  kernel_size: 'Kernel size',
  layers: 'Layers',
  samples_per_class: 'Samples/class',
};

const StoryMLDashboard = () => {
  const chartRefDetail = useRef<SVGSVGElement>(null);
  const chartRefContext = useRef<SVGSVGElement>(null);

  const [selectedHyperparam, setSelectedHyperparam] = useState<string>('');
  const [mlData, setMLData] = useState<msb.TimeSeriesData>([]);
  const [data, setData] = useState<msb.TimeSeriesData>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(-1);

  // detail (zoomed) plot on top, context (overview) plot at the bottom
  const detailPlot = useRef(new msb.NumericLinePlot()).current;
  const contextPlot = useRef(new msb.NumericLinePlot()).current;
  // control both plots together
  const [controller, isPlaying] = useControllerWithState(
    msb.SyncPlotsController,
    [detailPlot, contextPlot]
  );

  useEffect(() => {
    // 1. Load data
    setMLData(
      mlTrainingData.map(({ date, ...rest }) => ({
        date: new Date(date),
        ...rest,
      }))
    );
    setSelectedHyperparam('layers');
  }, []);

  useEffect(() => {
    if (
      !selectedHyperparam ||
      !mlData.length ||
      !chartRefDetail.current ||
      !chartRefContext.current
    )
      return;

    // 2. Sort the runs by the selected hyperparameter (ties by date), and use
    // the test accuracy as the y value
    const sorted = mlData
      .map((d): msb.TimeSeriesPoint => ({ ...d, y: d.mean_test_accuracy }))
      .sort(
        (a, b) =>
          a[selectedHyperparam] - b[selectedHyperparam] ||
          a.date.getTime() - b.date.getTime()
      );
    setData(sorted);
    setCurrentIdx(-1);

    // 3. Create timeline actions from the feature-action table; each plot
    // needs its own action instances
    const createActions = () =>
      new msb.FeatureActionFactory()
        .setProps({ metric: 'accuracy', window: 0 })
        .setData(sorted)
        .setNumericalFeatures(mlDashboardFATable as any)
        .create();

    // 4. Detail plot: y domain auto-fitted to the data
    detailPlot
      .setData(sorted)
      .setName(selectedHyperparam)
      .setPlotProps({
        xLabel: selectedHyperparam,
        yLabel: 'test accuracy',
      })
      .setCanvas(chartRefDetail.current)
      .setActions(createActions())
      .setOnStepCallback(idx => setCurrentIdx(idx));

    // 5. Context plot: fixed [0, 1] y domain with a band showing the y-extent
    contextPlot
      .setData(sorted)
      .setName(selectedHyperparam)
      .setPlotProps({
        xLabel: selectedHyperparam,
        yLabel: 'test accuracy',
        yDomain: [0, 1],
        showBand: true,
      })
      .setCanvas(chartRefContext.current)
      .setActions(createActions());

    // 6. Wait for the play button
    controller.pause();
  }, [selectedHyperparam, mlData]);

  const currentPoint = currentIdx >= 0 ? data[currentIdx] : undefined;

  // best run seen so far during the animation
  const maxPoint = useMemo(() => {
    if (currentIdx < 0 || !data.length) return undefined;
    return data
      .slice(0, currentIdx + 1)
      .reduce((best, d) => ((d.y ?? 0) > (best.y ?? 0) ? d : best));
  }, [data, currentIdx]);

  const cardEntries = (point?: msb.TimeSeriesPoint) =>
    HYPERPARAMS.map(param => ({
      label: PARAM_LABELS[param],
      value: point ? point[param] : '—',
    }));

  const percent = (point?: msb.TimeSeriesPoint) =>
    point ? `${Math.round((point.y ?? 0) * 100)}%` : '—';

  const handleSelection = (event: SelectChangeEvent) => {
    const newKey = event.target.value;
    if (newKey) {
      setSelectedHyperparam(newKey);
    }
  };

  const handleBeginningButton = () => {
    controller.pause();
    detailPlot.reset();
    contextPlot.reset();
  };

  const handleBackButton = () => {
    controller.pause();
    detailPlot.stepBackward();
    contextPlot.stepBackward();
  };

  return (
    <>
      <title key="title">Story | ML Dashboard</title>

      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 8,
        }}
      >
        <Card>
          <CardHeader
            avatar={
              <Avatar style={{ backgroundColor: blue[500] }}>
                <AutoStoriesIcon />
              </Avatar>
            }
            title="Dashboard & Story"
            subheader="Choose a hyperparameter, and click play to animate the story."
            titleTypographyProps={{ variant: 'h5' }}
            subheaderTypographyProps={{ variant: 'body1' }}
          />
          <CardContent sx={{ pt: '8px' }}>
            <FormGroup
              sx={{
                flexDirection: {
                  xs: 'column',
                  sm: 'row',
                  alignItems: 'center',
                },
              }}
            >
              <FormControl sx={{ m: 1, width: 300, mt: 0 }} size="small">
                <InputLabel id="select-parameter-label" sx={selectFontSx}>
                  Select parameter
                </InputLabel>
                <Select
                  labelId="select-parameter-label"
                  id="select-parameter"
                  displayEmpty
                  onChange={handleSelection}
                  value={selectedHyperparam}
                  input={<OutlinedInput label="Select parameter" />}
                  sx={selectFontSx}
                >
                  {HYPERPARAMS.map(d => (
                    <MenuItem key={d} value={d} sx={selectFontSx}>
                      {d}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ m: 1, mt: 0 }}>
                <Button
                  variant="contained"
                  disabled={currentIdx < 0}
                  onClick={handleBeginningButton}
                  sx={controlButtonSx}
                >
                  Beginning
                </Button>
              </FormControl>

              <FormControl sx={{ m: 1, mt: 0 }}>
                <Button
                  variant="contained"
                  disabled={currentIdx < 0}
                  onClick={handleBackButton}
                  startIcon={<ArrowBackIosIcon />}
                  sx={controlButtonSx}
                >
                  Back
                </Button>
              </FormControl>

              <FormControl sx={{ m: 1, mt: 0 }}>
                <Button
                  disabled={!selectedHyperparam}
                  variant="contained"
                  onClick={() => controller.togglePlayPause()}
                  endIcon={isPlaying ? <PauseIcon /> : <ArrowForwardIosIcon />}
                  sx={{
                    ...controlButtonSx,
                    minWidth: 130,
                    ...(isPlaying && {
                      backgroundColor: '#3b4499',
                      '&:hover': { backgroundColor: '#2f3780' },
                    }),
                  }}
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>
              </FormControl>
            </FormGroup>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Stack spacing={2} sx={{ width: 300, flexShrink: 0, mt: 2 }}>
                <MetricCard
                  title="Current Accuracy"
                  value={percent(currentPoint)}
                  valueColor={msb.Colors.DarkOrange}
                  entries={cardEntries(currentPoint)}
                />
                <MetricCard
                  title="Max Testing Accuracy"
                  value={percent(maxPoint)}
                  valueColor={msb.Colors.DarkGreen}
                  entries={cardEntries(maxPoint)}
                />
              </Stack>

              <Paper
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  p: 2,
                  mt: 2,
                  flexGrow: 1,
                  maxWidth: 900,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <svg
                  ref={chartRefDetail}
                  style={{ width: '100%', height: 360, border: '0px solid' }}
                ></svg>
                <svg
                  ref={chartRefContext}
                  style={{ width: '100%', height: 260, border: '0px solid' }}
                ></svg>
              </Paper>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default StoryMLDashboard;
