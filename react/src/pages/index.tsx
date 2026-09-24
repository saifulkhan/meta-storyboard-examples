import NextLink from 'next/link';
import { Box, Divider, Link, List, ListItem, Typography } from '@mui/material';

type PageLink = {
  title: string;
  path: string;
};

const exampleStories: PageLink[] = [
  { title: 'COVID-19 Case Story', path: '/example/story-covid19' },
  {
    title: 'COVID-19 Case Story (Gaussian)',
    path: '/example/story-covid19-gaussian',
  },
  {
    title: 'Machine Learning Provenance Story',
    path: '/example/story-ml-mirorred-bar',
  },
  {
    title: 'Machine Learning Multivariate Story',
    path: '/example/story-ml-pcp',
  },
  {
    title: 'Machine Learning Dashboard Story',
    path: '/example/story-ml-dashboard',
  },
  { title: 'Feature-Action Tables', path: '/example/feature-action-tables' },
];

const playgroundPages: PageLink[] = [
  { title: 'Test Play/Pause Loop', path: '/playground/test-play-pause-loop' },
  { title: 'Test Actions', path: '/playground/test-actions' },
  { title: 'Test Line Plot', path: '/playground/test-line-plot' },
  { title: 'Test Features', path: '/playground/test-features' },
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

const LinkList = ({ pages }: { pages: PageLink[] }) => (
  <List dense>
    {pages.map(page => (
      <ListItem key={page.path}>
        <Link component={NextLink} href={page.path}>
          {page.title}
        </Link>
      </ListItem>
    ))}
  </List>
);

const IndexPage = () => {
  return (
    <Box sx={{ maxWidth: 720, mx: 'auto', p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Meta-Storyboard Examples
      </Typography>
      <Typography variant="body1" gutterBottom>
        Examples of how to use the{' '}
        <Link href="https://www.npmjs.com/package/meta-storyboard">
          meta-storyboard
        </Link>{' '}
        library.
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Example Stories</Typography>
      <LinkList pages={exampleStories} />

      <Typography variant="h6">Playground</Typography>
      <LinkList pages={playgroundPages} />
    </Box>
  );
};

export default IndexPage;
