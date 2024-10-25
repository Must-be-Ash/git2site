import { NextPage } from 'next';

declare global {
  type PageProps<P = {}, IP = P> = NextPage<P> & {
    getInitialProps?(context: any): IP | Promise<IP>;
  };
}
