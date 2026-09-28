/** import locally for development and testing **/
import * as msb from '../../../msb/src';
/** import from npm library */
// import * as msb from "meta-storyboard";

import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Fade,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import SwipeIcon from '@mui/icons-material/Swipe';
import { pink } from '@mui/material/colors';

import { ExampleLayout } from '../../components/ExampleLayout';
import {
  ScrollEventCards,
  ScrollStoryEvent,
} from '../../components/storyboard/ScrollEventCards';
import covid19CasesData from '../../assets/data/covid19-cases-data.json';
import covid19NumFATable from '../../assets/feature-action-table/covid-19-numerical-fa-table.json';

/**
 * Scrollable storyboard, ported from the original Observable prototype:
 * scroll the event cards horizontally to progress the story. Events are
 * not ranked or pruned; every detected feature becomes a story step.
 */
const StoryCovid19Scrollable = () => {
  const GRAPH_HEIGHT = 400,
    TIMELINE_HEIGHT = 50;

  const graphRef = useRef<SVGSVGElement>(null);
  const timelineRef = useRef<SVGSVGElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [regions, setRegions] = useState<string[]>([]);
  const [region, setRegion] = useState<string>('');
  const [casesData, setCasesData] = useState<
    Record<string, msb.TimeSeriesData>
  >({});
  const [numericalFATable, setNumericalFATable] =
    useState<msb.FeatureActionTableData>([]);
  const [storyEvents, setStoryEvents] = useState<ScrollStoryEvent[]>([]);

  const plot = useRef<msb.LinePlot>(new msb.LinePlot()).current;
  const timelinePlot = useRef<msb.TimelinePlot>(new msb.TimelinePlot()).current;
  // drive both plots to the story step in focus while scrolling
  const controller = useRef<msb.ScrollStoryController>(
    new msb.ScrollStoryController([plot, timelinePlot])
  ).current;

  useEffect(() => {
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

      setRegion('Bolton');
    } catch (error) {
      console.error('Failed to fetch data; error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (
      !region ||
      !casesData[region] ||
      !graphRef.current ||
      !timelineRef.current
    )
      return;

    // 1.1.a Get timeseries data of a single region.
    const data = casesData[region];

    // 2. Create timeline actions in chronological order; unlike the other
    // storyboards, events are not ranked or pruned down.
    const timelineActions: msb.TimelineAction[] = new msb.FeatureActionFactory()
      .setProps({
        metric: 'Number of cases',
        window: 10,
      })
      .setNumericalFeatures(numericalFATable) // <- feature-action table
      .setData(data) // <- timeseries data
      .create()
      .sort((a, b) => a[0].getTime() - b[0].getTime());

    // 2.a Resolve the ${name} template variable now so that the card texts
    // are complete before the animation runs.
    timelineActions.forEach(([, action]) =>
      action.updateProps({ templateVariables: { name: region } })
    );

    // 2.b One scroll card per timeline action, plus a final card that
    // reveals the rest of the line after the last event.
    setStoryEvents([
      ...timelineActions.map(([date, action]) => ({
        date: date.toLocaleDateString('en-GB'),
        description: action.getText().message ?? '',
      })),
      { description: 'The end.' },
    ]);

    // 3. Create the story in a line plot driven by the scroll position.
    plot
      .setData([data]) // <- timeseries data
      .setName(region) // <- selected region
      .setPlotProps({
        title: `${region}`,
        xLabel: 'Date',
        leftAxisLabel: 'Number of cases',
        animationDelay: 0, // <- react to scrolling without delay
      })
      .setLineProps([])
      .setCanvas(graphRef.current)
      .setActions(timelineActions);

    // 3.a Progress timeline below the plot, one checkpoint per event; reuse
    // the line plot's horizontal margins so that the checkpoints line up
    // with the dates on the x-axis above.
    timelinePlot
      .setPlotProps({
        margin: { ...msb.defaultLinePlotProps.margin, top: 0, bottom: 0 },
      })
      .setData(data) // <- timeseries data
      .setActions(timelineActions)
      .setCanvas(timelineRef.current);

    // 4. Draw both plots in their initial state; scrolling the cards below
    // seeks the story via the controller.
    controller.reset();

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
      title="COVID-19 Scrollable Storyboard"
      subtitle="A scrollytelling storyboard: scroll the event cards horizontally and the line plot and the progress timeline follow the event in focus."
      chip="Scrollytelling"
      icon={<SwipeIcon />}
      color={pink[500]}
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
            <Typography variant="body2" color="text.secondary">
              Scroll the cards below the plot with the mouse wheel, trackpad, or
              arrow keys to move between events.
            </Typography>
          </Stack>
          <svg
            ref={graphRef}
            style={{
              width: '100%',
              height: GRAPH_HEIGHT,
              border: '0px solid',
            }}
          ></svg>
          <svg
            ref={timelineRef}
            style={{
              width: '100%',
              height: TIMELINE_HEIGHT,
              border: '0px solid',
            }}
          ></svg>
          <ScrollEventCards
            events={storyEvents}
            onEventChange={index => controller.seek(index)}
          />
        </>
      )}
    </ExampleLayout>
  );
};

export default StoryCovid19Scrollable;
