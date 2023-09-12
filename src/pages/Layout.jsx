import React from 'react';
import { Outlet } from 'react-router-dom';
import {
  ChakraProvider,
  theme,
} from '@chakra-ui/react';
import Nav from '../components/Nav';

function Layout() {
  return (
    <ChakraProvider theme={theme}>
      <Nav />

      <Outlet />

      {/* <Footer /> */}
    </ChakraProvider>
  );
}

export default Layout;
