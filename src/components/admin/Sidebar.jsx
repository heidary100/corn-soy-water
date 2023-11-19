import React from 'react';
import {
  Box,
  Button,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Icon,
  IconButton,
  Image,
  InputGroup,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { FiMenu } from 'react-icons/fi';
import { HiOutlineLogout } from 'react-icons/hi';
import { NavLink, Outlet } from 'react-router-dom';
import { CloseIcon } from '@chakra-ui/icons';
import ColorModeSwitcher from '../ColorModeSwitcher';

function NavItem(props) {
  const {
    icon, image, children, ...rest
  } = props;
  return (
    <Flex
      align="center"
      px="4"
      mx="2"
      rounded="md"
      py="3"
      cursor="pointer"
      color="whiteAlpha.900"
      _hover={{
        bg: 'blackAlpha.300',
        color: 'whiteAlpha.700',
      }}
      role="group"
      as={NavLink}
      fontWeight="semibold"
      transition=".15s ease"
      {...rest}
      style={({ isActive }) => ({
        background: isActive ? 'rgba(0,0,0,0.3)' : '',
        color: isActive ? 'white' : '',
      })}
    >
      {icon && (
        <Icon
          mr="2"
          boxSize="4"
          _groupHover={{
            color: 'gray.300',
          }}
          as={icon}
        />
      )}

      {image && (
        <Image
          boxSize="20px"
          objectFit="cover"
          src={image}
          marginRight={2}
        />
      )}
      {children}
    </Flex>
  );
}

function SidebarContent(props) {
  const { onClose } = props;
  return (
    <Box
      as="nav"
      pos="fixed"
      top="0"
      left="0"
      zIndex="sticky"
      h="full"
      pb="10"
      overflowX="hidden"
      overflowY="auto"
      bg="#61b0b7"
      borderColor="blackAlpha.300"
      borderRightWidth="1px"
      w="60"
      {...props}
    >
      <Flex px="4" py="5" align="center">
        <Image
          boxSize="25px"
          objectFit="cover"
          src="/logo.png"
          alt="Corn Soy Water"
        />
        {' '}
        &nbsp;
        <Text fontSize="2xl" ml="2" color="white" fontWeight="semibold">
          Corn Soy Water
        </Text>
        <IconButton
          position="absolute"
          right="10px"
          aria-label="Menu"
          colorScheme="whiteAlpha"
          display={{ md: 'none', base: 'unset' }}
          onClick={onClose}
          variant="outline"
          icon={<CloseIcon />}
          size="sm"
        />
      </Flex>
      <Flex
        direction="column"
        as="nav"
        fontSize="sm"
        color="gray.600"
        aria-label="Main Navigation"
      >
        <NavItem onClick={onClose} image="/img/home.png" to="/admin/">
          Home
        </NavItem>

        <NavItem onClick={onClose} image="/img/location.png" to="/admin/new">
          Add new Field
        </NavItem>

        <NavItem onClick={onClose} image="/img/chart.png" to="/admin/result">
          Field info and Result
        </NavItem>

        <NavItem onClick={onClose} image="/img/gears.png" to="/admin/setting">
          Setting
        </NavItem>

      </Flex>
    </Box>
  );
}

function Sidebar() {
  const sidebar = useDisclosure();
  // const user = JSON.parse(localStorage.user);

  return (
    <Box as="section" bg="gray.50" _dark={{ bg: 'gray.700' }} minH="100vh">
      <SidebarContent onClose={sidebar.onClose} display={{ base: 'none', md: 'unset' }} />
      <Drawer
        isOpen={sidebar.isOpen}
        onClose={sidebar.onClose}
        placement="left"
      >
        <DrawerOverlay />
        <DrawerContent>
          <SidebarContent onClose={sidebar.onClose} w="full" borderRight="none" />
        </DrawerContent>
      </Drawer>
      <Box ml={{ base: 0, md: 60 }} transition=".3s ease">
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
          {/* {user && (
          <Text fontWeight="bold">
            Hey,&nbsp;
            {user.firstName}
            !
          </Text>
          )} */}
          <IconButton
            aria-label="Menu"
            display={{ base: 'inline-flex', md: 'none' }}
            onClick={sidebar.onOpen}
            icon={<FiMenu />}
            size="sm"
          />
          <InputGroup w="96" display={{ base: 'none', md: 'flex' }} />

          <Flex align="center">
            <ColorModeSwitcher />
            &nbsp;
            <Button as="a" href="/login" leftIcon={<HiOutlineLogout />} colorScheme="red" variant="solid">
              Log out
            </Button>

          </Flex>
        </Flex>

        <Box as="main" p="4">
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
export default Sidebar;
