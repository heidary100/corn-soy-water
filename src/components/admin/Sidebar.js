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
} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import { HiOutlineLogout } from "react-icons/hi";
import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const Sidebar = () => {
  const sidebar = useDisclosure();

  const NavItem = (props) => {
    const { icon, image, children, ...rest } = props;
    return (
      <Flex
        align="center"
        px="4"
        mx="2"
        rounded="md"
        py="3"
        cursor="pointer"
        color="whiteAlpha.700"
        _hover={{
          bg: "blackAlpha.300",
          color: "whiteAlpha.900",
        }}
        role="group"
        as={NavLink}
        fontWeight="semibold"
        transition=".15s ease"
        {...rest}
        className={(x) => {
          console.log(x);
        }}
      >
          {icon && (
            <Icon
              mr="2"
              boxSize="4"
              _groupHover={{
                color: "gray.300",
              }}
              as={icon}
            />
          )}

          {image && (
            <Image
              boxSize='20px'
              objectFit='cover'
              src={image}
              marginRight={2}
            />
          )}
          {children}
      </Flex>
    );
  };

  const SidebarContent = (props) => (
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
      bg="green.600"
      borderColor="blackAlpha.300"
      borderRightWidth="1px"
      w="60"
      {...props}
    >
      <Flex px="4" py="5" align="center">
        <Image
          boxSize='25px'
          objectFit='cover'
          src='/logo.png'
          alt='Corn Soy Water'
          bg={'white'}
          borderRadius={50}
        /> &nbsp;
        <Text fontSize="2xl" ml="2" color="white" fontWeight="semibold">
          Corn Soy Water
        </Text>
      </Flex>
      <Flex
        direction="column"
        as="nav"
        fontSize="sm"
        color="gray.600"
        aria-label="Main Navigation"
      >
        <NavItem image={'/img/profile.png'} to={'/admin/profile'}>
            Profile
        </NavItem>
        <NavItem image={'/img/corn.png'} to={'/admin/corn'}>Corn Fields</NavItem>
        <NavItem image={'/img/soy.png'} to={'/admin/soybean'}>Soybean Fields</NavItem>
      </Flex>
    </Box>
  );
  return (
    <Box as="section" bg="gray.50" _dark={{ bg: "gray.700" }} minH="100vh">
      <SidebarContent display={{ base: "none", md: "unset" }} />
      <Drawer
        isOpen={sidebar.isOpen}
        onClose={sidebar.onClose}
        placement="left"
      >
        <DrawerOverlay />
        <DrawerContent>
          <SidebarContent w="full" borderRight="none" />
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
          _dark={{ bg: "gray.800" }}
          borderBottomWidth="1px"
          borderColor="blackAlpha.300"
          h="14"
        >
          <IconButton
            aria-label="Menu"
            display={{ base: "inline-flex", md: "none" }}
            onClick={sidebar.onOpen}
            icon={<FiMenu />}
            size="sm"
          />
          <InputGroup w="96" display={{ base: "none", md: "flex" }}>

          </InputGroup>

          <Flex align="center">
            <Button as={'a'} href={'/admin/add-corn'} leftIcon={<HiOutlineLogout />} colorScheme='red' variant='solid'>
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
};
export default Sidebar;
