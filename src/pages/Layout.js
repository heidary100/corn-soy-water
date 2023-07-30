import { Outlet, Link } from "react-router-dom";
import {
    ChakraProvider,
    theme,
  } from '@chakra-ui/react';
import Nav from "../components/Nav";

const Layout = () => {
  return (
    <>
    <ChakraProvider theme={theme}>
    <Nav />
      {/* <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/blogs">Blogs</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </nav> */}

      <Outlet />
      </ChakraProvider>
    </>
  )
};

export default Layout;
