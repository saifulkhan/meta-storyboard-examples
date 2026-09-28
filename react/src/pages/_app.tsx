import type { ReactNode } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import CssBaseline from '@mui/material/CssBaseline';

type GetLayout = (page: ReactNode) => ReactNode;

type Page<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: GetLayout;
};

type MyAppProps<P = {}> = AppProps<P> & {
  Component: Page<P>;
};

function App({ Component, pageProps }: MyAppProps) {
  const getLayout = Component.getLayout ?? ((page: ReactNode) => page);

  return (
    <>
      <CssBaseline />
      {getLayout(<Component {...pageProps} />)}
    </>
  );
}

export default App;
