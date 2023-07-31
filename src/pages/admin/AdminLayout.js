import { Outlet, Link } from "react-router-dom";
import {
    ChakraProvider,
    theme,
} from '@chakra-ui/react';
import Nav from "../../components/admin/Nav";

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
