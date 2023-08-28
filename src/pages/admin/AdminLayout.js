import { Outlet, Link } from "react-router-dom";
import {
    ChakraProvider,
    extendTheme,
} from '@chakra-ui/react';
import Nav from "../../components/admin/Nav";
import Sidebar from "../../components/admin/Sidebar";

const colors = {
    brand: {
      50: "#ecefff",
      100: "#cbceeb",
      200: "#a9aed6",
      300: "#888ec5",
      400: "#666db3",
      500: "#4d5499",
      600: "#3c4178",
      700: "#2a2f57",
      800: "#181c37",
      900: "#080819"
    }
  };
  const config = {
    initialColorMode: "dark",
    useSystemColorMode: false
  };
  
  const theme = extendTheme({ colors, config });

const AdminLayout = () => {
    return (
        <>
            <ChakraProvider theme={theme}>
                <Nav />
                <Outlet />
            </ChakraProvider>
        </>
    )
};

export default AdminLayout;
