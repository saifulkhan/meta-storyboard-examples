import type { ReactElement } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BarChartIcon from '@mui/icons-material/BarChart';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FunctionsIcon from '@mui/icons-material/Functions';
import GitHubIcon from '@mui/icons-material/GitHub';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ScienceIcon from '@mui/icons-material/Science';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import SwipeIcon from '@mui/icons-material/Swipe';
import SsidChartIcon from '@mui/icons-material/SsidChart';
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';
import TableChartIcon from '@mui/icons-material/TableChart';
import {
  blue,
  deepPurple,
  green,
  indigo,
  orange,
  pink,
  teal,
} from '@mui/material/colors';

type StoryCard = {
  title: string;
  description: string;
  path: string;
  chip: string;
  icon: ReactElement;
  color: string;
};

type PageLink = {
  title: string;
  path: string;
};

const exampleStories: StoryCard[] = [
  {
    title: 'COVID-19 Case Story',
    description:
      'An animated line plot of COVID-19 cases annotated with peaks and other features detected from a feature-action table.',
    path: '/example/story-covid19',
    chip: 'Line Plot',
    icon: <ShowChartIcon />,
    color: indigo[500],
  },
  {
    title: 'COVID-19 Case Story (Gaussian)',
    description:
      'The COVID-19 story segmented with Gaussian mixture models to rank and highlight the most important time-series segments.',
    path: '/example/story-covid19-gaussian',
    chip: 'Gaussian Segmentation',
    icon: <SsidChartIcon />,
    color: deepPurple[500],
  },
  {
    title: 'COVID-19 Scrollable Storyboard',
    description:
      'A scroll-driven ("scrollytelling") storyboard: scroll through event cards to progress the animated line plot and its progress timeline.',
    path: '/example/story-covid19-scrollable',
    chip: 'Scrollytelling',
    icon: <SwipeIcon />,
    color: pink[500],
  },
  {
    title: 'Machine Learning Provenance Story',
    description:
      'A mirrored bar chart narrating the provenance of a hyperparameter search of a machine learning model.',
    path: '/example/story-ml-mirorred-bar',
    chip: 'Mirrored Bar Chart',
    icon: <BarChartIcon />,
    color: teal[600],
  },
  {
    title: 'Machine Learning Multivariate Story',
    description:
      'A parallel coordinates plot animating the relationship between hyperparameters and model accuracy.',
    path: '/example/story-ml-pcp',
    chip: 'Parallel Coordinates',
    icon: <StackedLineChartIcon />,
    color: orange[800],
  },
  {
    title: 'Machine Learning Dashboard Story',
    description:
      'Multiple synchronized plots combined into a single animated dashboard telling one coherent story.',
    path: '/example/story-ml-dashboard',
    chip: 'Dashboard',
    icon: <DashboardIcon />,
    color: blue[600],
  },
  {
    title: 'Feature-Action Tables',
    description:
      'Browse the feature-action tables that drive the stories, and experiment with features, actions, and their properties.',
    path: '/example/feature-action-tables',
    chip: 'Interactive Table',
    icon: <TableChartIcon />,
    color: green[700],
  },
];

const componentPages: PageLink[] = [
  { title: 'Test Play/Pause Loop', path: '/playground/test-play-pause-loop' },
  { title: 'Test Actions', path: '/playground/test-actions' },
  { title: 'Test Line Plot', path: '/playground/test-line-plot' },
  { title: 'Test Features', path: '/playground/test-features' },
];

const gaussianPages: PageLink[] = [
  {
    title: 'Test Categorical Features to Gaussian',
    path: '/playground/test-categorical-features-to-gaussian',
  },
  {
    title: 'Test Numerical Features to Gaussian',
    path: '/playground/test-numerical-features-to-gaussian',
  },
  {
    title: 'Test Gaussian Combined',
    path: '/playground/test-combined-gaussian',
  },
];

const tablePages: PageLink[] = [
  {
    title: 'Test Action Properties Table',
    path: '/playground/test-action-properties-table',
  },
  {
    title: 'Test Feature Properties Table',
    path: '/playground/test-feature-properties-table',
  },
  { title: 'Test Action Table', path: '/playground/test-action-table' },
];

const playgroundGroups: {
  title: string;
  icon: ReactElement;
  pages: PageLink[];
}[] = [
  {
    title: 'Plots, Features & Actions',
    icon: <ScienceIcon fontSize="small" />,
    pages: componentPages,
  },
  {
    title: 'Gaussian Processing',
    icon: <FunctionsIcon fontSize="small" />,
    pages: gaussianPages,
  },
  {
    title: 'Tables (Experimental)',
    icon: <TableChartIcon fontSize="small" />,
    pages: tablePages,
  },
];

const SectionHeading = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {subtitle}
    </Typography>
  </Box>
);

const IndexPage = () => {
  return (
    <>
      <Head>
        <title>Meta-Storyboard Examples</title>
      </Head>

      <Box
        sx={{
          background: `linear-gradient(180deg, ${indigo[50]} 0%, #ffffff 100%)`,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}
          >
            Meta-Storyboard Examples
          </Typography>
          <Typography
            variant="h6"
            component="p"
            color="text.secondary"
            sx={{ maxWidth: 720, fontWeight: 400, mb: 3 }}
          >
            Interactive, animated storytelling visualizations built with the{' '}
            <Link
              href="https://www.npmjs.com/package/meta-storyboard"
              underline="hover"
            >
              meta-storyboard
            </Link>{' '}
            library using the feature-action design pattern.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              variant="contained"
              size="large"
              startIcon={<MenuBookIcon />}
              href="https://saifulkhan.github.io/meta-storyboard/"
              sx={{ textTransform: 'none' }}
            >
              Documentation
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<GitHubIcon />}
              href="https://github.com/saifulkhan/meta-storyboard"
              sx={{ textTransform: 'none' }}
            >
              GitHub
            </Button>
            <Button
              variant="outlined"
              size="large"
              endIcon={<OpenInNewIcon />}
              href="https://www.npmjs.com/package/meta-storyboard"
              sx={{ textTransform: 'none' }}
            >
              npm Package
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
        <SectionHeading
          title="Example Stories"
          subtitle="Complete storytelling visualizations driven by feature-action tables."
        />
        <Grid container spacing={3}>
          {exampleStories.map(story => (
            <Grid key={story.path} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                variant="outlined"
                sx={{
                  height: '100%',
                  borderRadius: 2,
                  transition: 'box-shadow 0.2s, transform 0.2s',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardActionArea
                  component={NextLink}
                  href={story.path}
                  sx={{ height: '100%', alignItems: 'stretch' }}
                >
                  <CardContent
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1.5,
                      p: 3,
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      sx={{ mb: 0.5 }}
                    >
                      <Avatar sx={{ bgcolor: story.color }}>
                        {story.icon}
                      </Avatar>
                      <Typography
                        variant="subtitle1"
                        component="h3"
                        sx={{ fontWeight: 600, lineHeight: 1.3 }}
                      >
                        {story.title}
                      </Typography>
                    </Stack>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ flexGrow: 1 }}
                    >
                      {story.description}
                    </Typography>
                    <Box>
                      <Chip
                        label={story.chip}
                        size="small"
                        variant="outlined"
                        sx={{ color: story.color, borderColor: story.color }}
                      />
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: { xs: 5, md: 7 } }} />

        <SectionHeading
          title="Playground"
          subtitle="Isolated test pages for developing and debugging individual components."
        />
        <Grid container spacing={3}>
          {playgroundGroups.map(group => (
            <Grid key={group.title} size={{ xs: 12, md: 4 }}>
              <Paper
                variant="outlined"
                sx={{ height: '100%', borderRadius: 2, p: 2.5 }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ mb: 1, color: 'text.secondary' }}
                >
                  {group.icon}
                  <Typography
                    variant="subtitle2"
                    component="h3"
                    sx={{ fontWeight: 600, textTransform: 'uppercase' }}
                  >
                    {group.title}
                  </Typography>
                </Stack>
                <List dense disablePadding>
                  {group.pages.map(page => (
                    <ListItem key={page.path} disableGutters>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <ArrowForwardIcon
                          sx={{ fontSize: 14, color: 'text.disabled' }}
                        />
                      </ListItemIcon>
                      <ListItemText>
                        <Link
                          component={NextLink}
                          href={page.path}
                          underline="hover"
                          variant="body2"
                        >
                          {page.title}
                        </Link>
                      </ListItemText>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box
        component="footer"
        sx={{ borderTop: '1px solid', borderColor: 'divider', py: 4 }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary">
            Based on the paper{' '}
            <Link href="https://arxiv.org/abs/2402.03116" underline="hover">
              Feature-Action Design Patterns for Storytelling Visualizations
              with Time Series Data
            </Link>{' '}
            (arXiv:2402.03116). Released under the MIT License.
          </Typography>
        </Container>
      </Box>
    </>
  );
};

export default IndexPage;
