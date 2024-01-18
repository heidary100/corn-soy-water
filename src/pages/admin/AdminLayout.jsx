import React from 'react';
import {
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  Text,
} from '@chakra-ui/react';
import { HiOutlineLogout, HiOutlineUser } from 'react-icons/hi';
import { NavLink, Outlet } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import ColorModeSwitcher from '../../components/ColorModeSwitcher';
import Footer from '../../components/admin/Footer';

function AdminLayout() {
  return (
    <Box as="section" bg="gray.50" _dark={{ bg: 'gray.700' }} maxW="100vw">
      <Flex>
        <Sidebar />
        <Box flex="1" transition=".3s ease" maxH="100vh" overflowY="scroll">
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
            overflow="hidden"
          >
            <Flex marginLeft={{ base: '0', md: '4' }} align="center">
              <Image
                w={30}
                h={30}
                src="/logo.png"
                alt="Corn Soy Water"
              />
              <Text fontSize={{ base: 'sm', md: 'lg' }} ml="2" fontWeight="semibold">
                Corn Soy Water
              </Text>
            </Flex>

            <Flex align="center">

              <Button
                display={{ base: 'none', md: 'inline-flex' }}
                fontSize="md"
                fontWeight="semibold"
                as={NavLink}
                leftIcon={<HiOutlineUser />}
                to="/admin/profile"
                variant="outline"
                _hover={{ color: 'black' }}
              >
                Welcome back, Jon
              </Button>
              <IconButton
                display={{ base: 'inline-flex', md: 'none' }}
                aria-label="User Profile"
                variant="outline"
                as={NavLink}
                to="/admin/profile"
                icon={<HiOutlineUser />}
              />
              <ColorModeSwitcher />
              &nbsp;
              <Button
                display={{ base: 'none', md: 'inline-flex' }}
                as="a"
                href="/login"
                leftIcon={<HiOutlineLogout />}
                colorScheme="red"
                variant="solid"
              >
                Log out
              </Button>
              <IconButton
                display={{ base: 'inline-flex', md: 'none' }}
                aria-label="Log Out"
                colorScheme="red"
                variant="solid"
                icon={<HiOutlineLogout />}
              />

            </Flex>
          </Flex>

          <Box as="main" minH="70vh">
            <Outlet />
          </Box>
          <Footer />
        </Box>
      </Flex>
    </Box>
  );
}

export default AdminLayout;
