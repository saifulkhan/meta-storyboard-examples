import type { ReactElement, ReactNode } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GitHubIcon from '@mui/icons-material/GitHub';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { grey, indigo } from '@mui/material/colors';

export type ExampleLayoutProps = {
  title: string;
  subtitle?: string;
  chip?: string;
  icon?: ReactElement;
  color?: string;
  children: ReactNode;
};

/**
 * shared page frame for the example stories: a header with back navigation
 * and the story title, and an outlined paper card around the page content,
 * styled consistently with the landing page.
 */
export const ExampleLayout = ({
  title,
  subtitle,
  chip,
  icon,
  color = indigo[500],
  children,
}: ExampleLayoutProps) => {
  return (
    <>
      <Head>
        <title>{`${title} | Meta-Storyboard Examples`}</title>
      </Head>

      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: grey[50],
        }}
      >
        <Box
          component="header"
          sx={{
            backgroundColor: '#ffffff',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Container maxWidth="lg" sx={{ py: 2.5 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 1.5 }}
            >
              <Button
                component={NextLink}
                href="/"
                size="small"
                startIcon={<ArrowBackIcon />}
                sx={{ textTransform: 'none', ml: -1 }}
              >
                All examples
              </Button>
              <Stack direction="row" spacing={0.5}>
                <Tooltip title="Documentation">
                  <IconButton
                    size="small"
                    href="https://saifulkhan.github.io/meta-storyboard/"
                  >
                    <MenuBookIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="GitHub">
                  <IconButton
                    size="small"
                    href="https://github.com/saifulkhan/meta-storyboard"
                  >
                    <GitHubIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center">
              {icon && (
                <Avatar sx={{ bgcolor: color, width: 44, height: 44 }}>
                  {icon}
                </Avatar>
              )}
              <Box>
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  flexWrap="wrap"
                  useFlexGap
                >
                  <Typography
                    variant="h5"
                    component="h1"
                    sx={{ fontWeight: 700, letterSpacing: '-0.25px' }}
                  >
                    {title}
                  </Typography>
                  {chip && (
                    <Chip
                      label={chip}
                      size="small"
                      variant="outlined"
                      sx={{ color, borderColor: color }}
                    />
                  )}
                </Stack>
                {subtitle && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {subtitle}
                  </Typography>
                )}
              </Box>
            </Stack>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
          <Paper
            variant="outlined"
            sx={{ borderRadius: 2, p: { xs: 2, md: 3 } }}
          >
            {children}
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default ExampleLayout;
