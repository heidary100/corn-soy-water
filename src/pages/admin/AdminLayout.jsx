import React from 'react';
import {
  Box,
  Button,
  Flex,
  Image,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { HiOutlineLogout } from 'react-icons/hi';
import { NavLink, Outlet } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import ColorModeSwitcher from '../../components/ColorModeSwitcher';
import Footer from '../../components/admin/Footer';

function AdminLayout() {
  const sidebar = useDisclosure();

  return (
    <Box as="section" bg="gray.50" _dark={{ bg: 'gray.700' }} minH="100vh" maxW="100vw">
      <Flex>
        <Sidebar onToggle={sidebar.onToggle} isListMode={sidebar.isOpen} />
        <Box flex="1" transition=".3s ease">
          <Flex
            as="header"
            align="center"
            justify="space-between"
            w="full"
            px="4"
            bg="white"
            _dark={{ bg: 'gray.800' }}
            borderBottomWidth="1px"
            borderColor="blackAlpha.300"
            h="14"
          >
            <Flex px="4" py="5" align="center">
              <Image
                w={30}
                h={30}
                // objectFit="cover"
                src="/logo.png"
                alt="Corn Soy Water"
              />
              {' '}
              &nbsp;
              <Text fontSize="2xl" ml="2" fontWeight="semibold">
                Corn Soy Water
              </Text>
            </Flex>

            <Flex align="center">
              {/* Toggle button for switching between list and icon mode */}

              <Button fontWeight="bold" as={NavLink} to="/admin/profile" variant="outline" _hover={{ color: 'black' }}>
                Welcome back, Jon
              </Button>
              <ColorModeSwitcher />
              &nbsp;
              <Button as="a" href="/login" leftIcon={<HiOutlineLogout />} colorScheme="red" variant="solid">
                Log out
              </Button>

            </Flex>
          </Flex>

          <Box as="main">
            <Outlet />
          </Box>
          <Footer />
        </Box>
      </Flex>
    </Box>
  );
}

export default AdminLayout;
