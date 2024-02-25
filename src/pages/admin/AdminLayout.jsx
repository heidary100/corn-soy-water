import React, { useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  Text,
  useToast,
} from '@chakra-ui/react';
import { HiOutlineLogout } from 'react-icons/hi';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import ColorModeSwitcher from '../../components/ColorModeSwitcher';
import AuthService from '../../services/auth.service';

function AdminLayout() {
  const navigate = useNavigate();
  const toast = useToast();
  const [footerHeight, setFooterHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [mainHeight, setMainHeight] = useState(0);
  const headerRef = useRef(null);
  const mainRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    setMainHeight(mainRef.current.clientHeight);
    setHeaderHeight(headerRef.current.clientHeight);
    setFooterHeight(footerRef.current.clientHeight);
    if (!AuthService.isAuthenticated()) {
      toast({
        title: 'Access denied! Please Log In.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      navigate('/login');
    }
  });

  const handleLogOut = () => {
    AuthService.logout();
    navigate('/login');
  };

  return (
    <Box as="section" bg="gray.50" _dark={{ bg: 'gray.700' }} maxW="100vw">
      <Flex>
        <Sidebar />
        <Box ref={mainRef} flex="1" transition=".3s ease" maxH="100vh" overflowY="scroll">
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
            ref={headerRef}
          >
            <Flex marginLeft={{ base: '0', md: '4' }} align="center">
              <Image
                w={30}
                h={30}
                src="/logo.png"
                alt="CornSoyWater"
              />
              <Text fontSize={{ base: 'sm', md: 'lg' }} ml="2" fontWeight="semibold">
                CornSoyWater
              </Text>
            </Flex>

            <Flex align="center">

              <Button
                display={{ base: 'none', md: 'inline-flex' }}
                fontSize="md"
                fontWeight="semibold"
                as={NavLink}
                to="/admin/profile"
                variant="outline"
                _hover={{ color: 'black' }}
              >
                Welcome back, Jon!
                &nbsp;
                &nbsp;
                <Avatar size="sm" name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
              </Button>
              <IconButton
                display={{ base: 'inline-flex', md: 'none' }}
                aria-label="User Profile"
                variant="outline"
                as={NavLink}
                to="/admin/profile"
                icon={<Avatar size="sm" name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />}
              />
              <ColorModeSwitcher />
              &nbsp;
              <Button
                display={{ base: 'none', md: 'inline-flex' }}
                onClick={handleLogOut}
                leftIcon={<HiOutlineLogout />}
                colorScheme="red"
                variant="outline"
              >
                Log out
              </Button>
              <IconButton
                display={{ base: 'inline-flex', md: 'none' }}
                aria-label="Log Out"
                colorScheme="red"
                variant="solid"
                onClick={handleLogOut}
                icon={<HiOutlineLogout />}
              />

            </Flex>
          </Flex>

          <Box as="main" h={`${(mainHeight - headerHeight - footerHeight - 20).toString()}px`} mb="5px" overflow="scroll">
            <Outlet />
          </Box>

          <Flex justify="space-between" ref={footerRef}>
            <Box w="16%">
              <NavLink to="https://www.unl.edu/" target="_blank">
                <Image src="/img/footer/logos/University_of_Nebraska–Lincoln.png" />
              </NavLink>
            </Box>
            <Box w="16%">
              <NavLink to="https://ncesr.unl.edu/?page_id=532" target="_blank">
                <Image src="/img/footer/logos/nebraska_weai.png" />
              </NavLink>
            </Box>
            <Box w="16%">
              <NavLink to="https://hprcc.unl.edu/" target="_blank">
                <Image src="/img/footer/logos/HPRCC_Bug_RGB.png" />
              </NavLink>
            </Box>
            <Box w="16%">
              <NavLink to="https://nebraskacorn.gov/" target="_blank">
                <Image src="/img/footer/logos/nebraska_corn_board.png" />
              </NavLink>
            </Box>
            <Box w="16%">
              <NavLink to="https://waterforfood.nebraska.edu/" target="_blank">
                <Image src="/img/footer/logos/water_for_food_Institude.svg" />
              </NavLink>
            </Box>
            <Box w="16%">
              <NavLink to="https://nebraskasoybeans.org/" target="_blank">
                <Image src="/img/footer/logos/nebraska_soybean_board.svg" />
              </NavLink>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}

export default AdminLayout;
